import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { Database, Tx } from "@/db";
import {
  quizQuestionOptions,
  quizQuestions,
  quizzes,
  submissionAnswers,
  submissions,
  users,
} from "@/db/schema";
import { audit } from "./audit";
import { evaluateAchievements } from "./achievements";
import {
  desiredQuizAwards,
  gradeAnswer,
  summarize,
  type AnswerGrade,
  type GradableQuestion,
  type RawAnswer,
} from "./grading";
import { hasSourceKey, lockUserLedger, overriddenSourceKeys, recordPoints, sumForSourceKey } from "./ledger";
import { getSettings } from "./settings";
import { getStreak } from "./streaks";

export class SubmissionError extends Error {}

export const MAX_TEXT_ANSWER = 300;

export type SubmittedAnswer = {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer: string | null;
};

async function loadQuizWithQuestions(tx: Tx, quizId: string) {
  const quiz = await tx.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) });
  if (!quiz) return null;
  const qs = await tx.query.quizQuestions.findMany({
    where: eq(quizQuestions.quizId, quizId),
    orderBy: [asc(quizQuestions.position)],
    with: { options: { orderBy: [asc(quizQuestionOptions.position)] } },
  });
  return { quiz, questions: qs };
}

type LoadedQuiz = NonNullable<Awaited<ReturnType<typeof loadQuizWithQuestions>>>;

function toGradable(q: LoadedQuiz["questions"][number]): GradableQuestion {
  return {
    id: q.id,
    type: q.type,
    points: q.points,
    acceptedAnswers: q.acceptedAnswers,
    caseSensitive: q.caseSensitive,
    manualReview: q.manualReview,
    options: q.options.map((o) => ({ id: o.id, isCorrect: o.isCorrect })),
  };
}

/**
 * Validates a student's raw answers against the quiz. Anything that doesn't
 * belong to this quiz (foreign question/option ids, multiple picks on a
 * single-choice question, oversized text) rejects the whole request.
 */
function validateAnswers(loaded: LoadedQuiz, answers: SubmittedAnswer[]): Map<string, RawAnswer> {
  const byId = new Map(loaded.questions.map((q) => [q.id, q]));
  const out = new Map<string, RawAnswer>();
  for (const a of answers) {
    const q = byId.get(a.questionId);
    if (!q) throw new SubmissionError("One of your answers doesn't match this quiz. Refresh and try again.");
    if (out.has(q.id)) throw new SubmissionError("Duplicate answer for a question.");
    const optionIds = new Set(q.options.map((o) => o.id));
    const selected = [...new Set(a.selectedOptionIds)];
    if (selected.some((id) => !optionIds.has(id))) {
      throw new SubmissionError("One of your answers doesn't match this quiz. Refresh and try again.");
    }
    if ((q.type === "multiple_choice" || q.type === "true_false") && selected.length > 1) {
      throw new SubmissionError("Choose only one answer for each single-choice question.");
    }
    if (q.type === "short_answer" && selected.length > 0) {
      throw new SubmissionError("Invalid answer.");
    }
    const text = q.type === "short_answer" ? (a.textAnswer ?? "").trim().slice(0, MAX_TEXT_ANSWER) : null;
    out.set(q.id, { selectedOptionIds: q.type === "short_answer" ? [] : selected, textAnswer: text || null });
  }
  return out;
}

export type SubmitResult = {
  submissionId: string;
  correctCount: number;
  questionCount: number;
  pendingCount: number;
  pointsEarned: number;
  newAchievements: string[];
  streak: number;
  streakBonus: number;
};

/**
 * Accepts a student's quiz answers. All checks happen here, inside one
 * transaction holding the student's ledger lock:
 *  - the quiz must be published and currently open
 *  - one submission per student per quiz (unique index as a backstop)
 *  - revisions only when a leader has explicitly allowed them
 *  - points are computed from stored question values, never from the client
 */
export async function submitQuiz(
  database: Database,
  opts: { userId: string; quizId: string; answers: SubmittedAnswer[]; now?: Date },
): Promise<SubmitResult> {
  const now = opts.now ?? new Date();
  return database.transaction(async (tx) => {
    await lockUserLedger(tx, opts.userId);

    const student = await tx.query.users.findFirst({ where: eq(users.id, opts.userId) });
    if (!student || !student.isActive || student.role !== "student") {
      throw new SubmissionError("Only active student accounts can submit quizzes.");
    }

    const loaded = await loadQuizWithQuestions(tx, opts.quizId);
    if (!loaded || loaded.quiz.status !== "published" || loaded.quiz.opensAt > now) {
      throw new SubmissionError("This quiz isn't available.");
    }
    if (loaded.questions.length === 0) throw new SubmissionError("This quiz has no questions yet.");

    const existing = await tx.query.submissions.findFirst({
      where: and(eq(submissions.quizId, opts.quizId), eq(submissions.userId, opts.userId)),
    });
    const isRevision = !!existing;
    if (existing && !existing.editAllowed) {
      throw new SubmissionError("You've already submitted this quiz.");
    }
    if (!isRevision && loaded.quiz.closesAt <= now) {
      throw new SubmissionError("This quiz has closed.");
    }

    const raw = validateAnswers(loaded, opts.answers);
    const answeredAny = [...raw.values()].some((a) => a.selectedOptionIds.length > 0 || a.textAnswer);
    if (!answeredAny) throw new SubmissionError("Answer at least one question before submitting.");

    const settings = await getSettings(tx);
    let submissionId: string;
    if (existing) {
      const previous = await tx.query.submissionAnswers.findMany({
        where: eq(submissionAnswers.submissionId, existing.id),
      });
      await audit(tx, {
        actorId: opts.userId,
        action: "submission.revised",
        targetType: "submission",
        targetId: existing.id,
        details: {
          previousAnswers: previous.map((p) => ({
            questionId: p.quizQuestionId,
            selectedOptionIds: p.selectedOptionIds,
            textAnswer: p.textAnswer,
            reviewStatus: p.reviewStatus,
          })),
        },
      });
      await tx.delete(submissionAnswers).where(eq(submissionAnswers.submissionId, existing.id));
      await tx
        .update(submissions)
        .set({ editAllowed: false, revisionCount: existing.revisionCount + 1, updatedAt: now })
        .where(eq(submissions.id, existing.id));
      submissionId = existing.id;
    } else {
      const inserted = await tx
        .insert(submissions)
        .values({
          quizId: opts.quizId,
          userId: opts.userId,
          submittedAt: now,
          awardRules: {
            participation: settings.points.participation,
            completion: settings.points.completion,
            perfect: settings.points.perfect,
          },
        })
        .onConflictDoNothing()
        .returning({ id: submissions.id });
      if (inserted.length === 0) throw new SubmissionError("You've already submitted this quiz.");
      submissionId = inserted[0].id;
    }

    await tx.insert(submissionAnswers).values(
      loaded.questions.map((q) => {
        const a = raw.get(q.id);
        return {
          submissionId,
          quizQuestionId: q.id,
          selectedOptionIds: a?.selectedOptionIds ?? [],
          textAnswer: a?.textAnswer ?? null,
        };
      }),
    );

    const before = await quizPointsForUser(tx, opts.userId, opts.quizId);
    const outcome = await gradeAndSync(tx, submissionId, { now });
    const after = await quizPointsForUser(tx, opts.userId, opts.quizId);

    return {
      submissionId,
      correctCount: outcome.summary.correctCount,
      questionCount: outcome.summary.questionCount,
      pendingCount: outcome.summary.pendingCount,
      pointsEarned: after - before,
      newAchievements: outcome.newAchievements,
      streak: outcome.streak,
      streakBonus: outcome.streakBonus,
    };
  });
}

async function quizPointsForUser(tx: Tx, userId: string, quizId: string) {
  const keys = ["quiz_participation", "quiz_correct", "quiz_completion", "quiz_perfect", "quiz_bonus"];
  let total = 0;
  for (const k of keys) total += await sumForSourceKey(tx, userId, `quiz:${quizId}:${k}`);
  return total;
}

const CATEGORY_TEXT = {
  quiz_participation: "Daily participation",
  quiz_correct: "Correct answers",
  quiz_completion: "Completed every question",
  quiz_perfect: "Perfect score",
  quiz_bonus: "Quiz bonus",
} as const;

/**
 * Re-grades a submission from its stored raw answers and reconciles the
 * ledger to what it should be worth. Safe to run any number of times: it
 * only ever inserts the difference. Leader review decisions are preserved,
 * and award groups a leader has manually reversed are left alone.
 */
export async function gradeAndSync(
  tx: Tx,
  submissionId: string,
  opts: { now?: Date } = {},
): Promise<{ summary: ReturnType<typeof summarize>; newAchievements: string[]; streak: number; streakBonus: number }> {
  const now = opts.now ?? new Date();
  const submission = await tx.query.submissions.findFirst({ where: eq(submissions.id, submissionId) });
  if (!submission) throw new SubmissionError("Submission not found.");
  await lockUserLedger(tx, submission.userId);

  const loaded = await loadQuizWithQuestions(tx, submission.quizId);
  if (!loaded) throw new SubmissionError("Quiz not found.");
  const stored = await tx.query.submissionAnswers.findMany({
    where: eq(submissionAnswers.submissionId, submissionId),
  });
  const storedByQ = new Map(stored.map((s) => [s.quizQuestionId, s]));

  const grades: AnswerGrade[] = [];
  for (const q of loaded.questions) {
    const s = storedByQ.get(q.id);
    let g: AnswerGrade;
    if (s && (s.reviewStatus === "approved" || s.reviewStatus === "rejected")) {
      const ok = s.reviewStatus === "approved";
      g = { answered: true, isCorrect: ok, reviewStatus: "auto", pointsAwarded: ok ? q.points : 0 };
    } else {
      g = gradeAnswer(
        toGradable(q),
        s ? { selectedOptionIds: s.selectedOptionIds, textAnswer: s.textAnswer } : undefined,
      );
    }
    grades.push(g);
    if (s) {
      const keepReview = s.reviewStatus === "approved" || s.reviewStatus === "rejected";
      await tx
        .update(submissionAnswers)
        .set({
          isCorrect: g.isCorrect,
          pointsAwarded: g.pointsAwarded,
          reviewStatus: keepReview ? s.reviewStatus : g.reviewStatus,
        })
        .where(eq(submissionAnswers.id, s.id));
    }
  }

  const summary = summarize(loaded.questions, grades);
  await tx
    .update(submissions)
    .set({
      scorePoints: summary.scorePoints,
      maxPoints: summary.maxPoints,
      correctCount: summary.correctCount,
      answeredCount: summary.answeredCount,
      questionCount: summary.questionCount,
      status: summary.pendingCount > 0 ? "pending_review" : "graded",
      updatedAt: now,
    })
    .where(eq(submissions.id, submissionId));

  // Reconcile the ledger.
  const quiz = loaded.quiz;
  const prefix = `quiz:${quiz.id}:`;
  const overridden = await overriddenSourceKeys(tx, submission.userId, prefix);
  // A perfect score isn't final while answers are waiting for review.
  const desired = desiredQuizAwards(summary, submission.awardRules, {
    points: quiz.bonusPoints,
    condition: quiz.bonusCondition,
  });
  for (const award of desired) {
    const sourceKey = `${prefix}${award.category}`;
    if (overridden.has(sourceKey)) continue;
    const current = await sumForSourceKey(tx, submission.userId, sourceKey);
    const delta = award.amount - current;
    if (delta === 0) continue;
    const firstTime = !(await hasSourceKey(tx, submission.userId, sourceKey));
    const detail =
      award.category === "quiz_correct" ? ` (${summary.correctCount}/${summary.questionCount})` : "";
    await recordPoints(tx, {
      userId: submission.userId,
      amount: delta,
      category: award.category,
      description: firstTime
        ? `${CATEGORY_TEXT[award.category]} — ${quiz.title}${detail}`
        : `${CATEGORY_TEXT[award.category]} updated after review — ${quiz.title}${detail}`,
      sourceKey,
      quizId: quiz.id,
      submissionId,
      effectiveAt: submission.submittedAt,
    });
  }

  // Streak bonus — awarded once per milestone, never clawed back.
  const settings = await getSettings(tx);
  const streak = await getStreak(tx, submission.userId, {
    tz: settings.timezone,
    weekendsCount: settings.streak.weekendsCount,
    now,
  });
  let streakBonus = 0;
  const every = settings.streak.bonusEvery;
  if (every > 0 && settings.streak.bonusPoints > 0 && streak.current > 0 && streak.current % every === 0) {
    const key = `streak:${streak.lastCompletedDay}:${streak.current}`;
    if (!(await hasSourceKey(tx, submission.userId, key))) {
      streakBonus = settings.streak.bonusPoints;
      await recordPoints(tx, {
        userId: submission.userId,
        amount: streakBonus,
        category: "streak_bonus",
        description: `${streak.current}-day streak`,
        sourceKey: key,
        effectiveAt: now,
      });
    }
  }

  const newAchievements = await evaluateAchievements(tx, submission.userId, streak);
  return { summary, newAchievements, streak: streak.current, streakBonus };
}

/** Re-grade every submission for a quiz, e.g. after fixing its answer key. */
export async function regradeQuiz(database: Database, quizId: string, actorId: string) {
  return database.transaction(async (tx) => {
    const subs = await tx
      .select({ id: submissions.id })
      .from(submissions)
      .where(eq(submissions.quizId, quizId));
    for (const s of subs) await gradeAndSync(tx, s.id);
    await audit(tx, { actorId, action: "quiz.regraded", targetType: "quiz", targetId: quizId, details: { submissions: subs.length } });
    return subs.length;
  });
}

/** A leader's decision on one short answer (or an override on any answer). */
export async function reviewAnswer(
  database: Database,
  opts: { answerId: string; decision: "approved" | "rejected" | "auto"; actorId: string },
) {
  return database.transaction(async (tx) => {
    const answer = await tx.query.submissionAnswers.findFirst({ where: eq(submissionAnswers.id, opts.answerId) });
    if (!answer) throw new SubmissionError("Answer not found.");
    await tx
      .update(submissionAnswers)
      .set({
        reviewStatus: opts.decision,
        reviewedBy: opts.decision === "auto" ? null : opts.actorId,
        reviewedAt: opts.decision === "auto" ? null : new Date(),
      })
      .where(eq(submissionAnswers.id, answer.id));
    await gradeAndSync(tx, answer.submissionId);
    await audit(tx, {
      actorId: opts.actorId,
      action: `answer.${opts.decision === "auto" ? "review_cleared" : opts.decision}`,
      targetType: "submission",
      targetId: answer.submissionId,
      details: { answerId: answer.id, textAnswer: answer.textAnswer },
    });
    return answer.submissionId;
  });
}

export async function setEditAllowed(
  database: Database,
  opts: { submissionId: string; allowed: boolean; actorId: string },
) {
  await database.transaction(async (tx) => {
    const updated = await tx
      .update(submissions)
      .set({ editAllowed: opts.allowed, updatedAt: new Date() })
      .where(eq(submissions.id, opts.submissionId))
      .returning({ id: submissions.id });
    if (updated.length === 0) throw new SubmissionError("Submission not found.");
    await audit(tx, {
      actorId: opts.actorId,
      action: opts.allowed ? "submission.edit_allowed" : "submission.edit_revoked",
      targetType: "submission",
      targetId: opts.submissionId,
    });
  });
}

/** Questions + options with answer keys stripped — the only shape a student may see before results. */
export async function getQuizForTaking(database: Database, quizId: string) {
  const qs = await database.query.quizQuestions.findMany({
    where: eq(quizQuestions.quizId, quizId),
    orderBy: [asc(quizQuestions.position)],
    columns: { id: true, type: true, prompt: true, points: true, position: true },
    with: {
      options: {
        columns: { id: true, label: true, position: true },
        orderBy: [asc(quizQuestionOptions.position)],
      },
    },
  });
  return qs;
}

export async function quizHasSubmissions(database: Database | Tx, quizIds: string[]) {
  if (quizIds.length === 0) return new Set<string>();
  const rows = await database
    .selectDistinct({ quizId: submissions.quizId })
    .from(submissions)
    .where(inArray(submissions.quizId, quizIds));
  return new Set(rows.map((r) => r.quizId));
}
