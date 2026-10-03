import "server-only";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import type { Database, Tx } from "@/db";
import {
  questionOptions,
  questions,
  quizQuestionOptions,
  quizQuestions,
  quizzes,
  submissionAnswers,
  submissions,
} from "@/db/schema";
import { isDateString, isTimeString, zonedTimeToUtc } from "@/lib/time";
import { blockText, lineText } from "@/lib/validation";
import { audit } from "./audit";
import { quizQuestionInputSchema, type questionMetaSchema } from "./question-input";
import { getSettings } from "./settings";
import { gradeAndSync } from "./submissions";

export class QuizAdminError extends Error {}

export const quizInputSchema = z
  .object({
    title: lineText(120).pipe(z.string().min(1, "Title is required")),
    passage: lineText(120).default(""),
    topic: lineText(80).default(""),
    studyNotes: blockText(8000).default(""),
    quizDate: z.string().refine(isDateString, "Pick a date"),
    startTime: z.string().refine(isTimeString, "Pick a start time"),
    endDate: z.string().refine(isDateString, "Pick an end date"),
    endTime: z.string().refine(isTimeString, "Pick an end time"),
    answerReveal: z.enum(["immediate", "after_close"]),
    bonusPoints: z.coerce.number().int().min(0).max(1000).default(0),
    bonusCondition: z.enum(["completion", "perfect"]).default("perfect"),
    countsForStreak: z.boolean().default(true),
    questions: z.array(quizQuestionInputSchema).max(50),
  })
  .refine((q) => `${q.endDate}T${q.endTime}` > `${q.quizDate}T${q.startTime}`, {
    path: ["endTime"],
    message: "The quiz must close after it opens.",
  });

export type QuizInput = z.input<typeof quizInputSchema>;
export type ParsedQuizInput = z.output<typeof quizInputSchema>;

export type SaveIntent = "draft" | "publish" | "keep";

/**
 * Creates or updates a quiz and its question snapshots in one transaction.
 * Once students have submitted, questions and options can be edited (typo
 * fixes, answer-key corrections) but not removed, and every submission is
 * re-graded so the ledger reflects the corrected key.
 */
export async function saveQuiz(
  database: Database,
  opts: { quizId?: string; input: ParsedQuizInput; actorId: string; intent: SaveIntent },
): Promise<{ quizId: string; regraded: number }> {
  const { input } = opts;
  return database.transaction(async (tx) => {
    const settings = await getSettings(tx);
    const opensAt = zonedTimeToUtc(input.quizDate, input.startTime, settings.timezone);
    const closesAt = zonedTimeToUtc(input.endDate, input.endTime, settings.timezone);
    if (closesAt <= opensAt) throw new QuizAdminError("The quiz must close after it opens.");

    let quizId = opts.quizId;
    let existingStatus: "draft" | "published" | "archived" = "draft";
    let hasSubs = false;
    if (quizId) {
      const existing = await tx.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) });
      if (!existing) throw new QuizAdminError("Quiz not found.");
      existingStatus = existing.status;
      hasSubs = !!(await tx.query.submissions.findFirst({ columns: { id: true }, where: eq(submissions.quizId, quizId) }));
    }

    let status = existingStatus;
    if (opts.intent === "publish") status = "published";
    if (opts.intent === "draft") {
      if (hasSubs) throw new QuizAdminError("Students have already taken this quiz, so it can't go back to draft. Archive it instead.");
      status = "draft";
    }
    if (status === "published" && input.questions.length === 0) {
      throw new QuizAdminError("Add at least one question before publishing.");
    }

    const values = {
      title: input.title,
      passage: input.passage,
      topic: input.topic,
      studyNotes: input.studyNotes,
      quizDate: input.quizDate,
      opensAt,
      closesAt,
      status,
      answerReveal: input.answerReveal,
      bonusPoints: input.bonusPoints,
      bonusCondition: input.bonusCondition,
      countsForStreak: input.countsForStreak,
      updatedAt: new Date(),
    };

    if (quizId) {
      const current = await tx.query.quizzes.findFirst({ where: eq(quizzes.id, quizId), columns: { publishedAt: true } });
      await tx
        .update(quizzes)
        .set({ ...values, publishedAt: status === "published" ? (current?.publishedAt ?? new Date()) : current?.publishedAt })
        .where(eq(quizzes.id, quizId));
    } else {
      const [row] = await tx
        .insert(quizzes)
        .values({ ...values, createdBy: opts.actorId, publishedAt: status === "published" ? new Date() : null })
        .returning({ id: quizzes.id });
      quizId = row.id;
    }

    const keyChanged = await syncQuizQuestions(tx, quizId, input.questions, { hasSubs, actorId: opts.actorId });

    let regraded = 0;
    if (hasSubs && keyChanged) {
      const subs = await tx.select({ id: submissions.id }).from(submissions).where(eq(submissions.quizId, quizId));
      for (const s of subs) await gradeAndSync(tx, s.id);
      regraded = subs.length;
    }

    await audit(tx, {
      actorId: opts.actorId,
      action: opts.quizId ? "quiz.updated" : "quiz.created",
      targetType: "quiz",
      targetId: quizId,
      details: { title: input.title, status, questions: input.questions.length, regraded },
    });
    return { quizId, regraded };
  });
}

/** Upserts question snapshots. Returns true when anything that affects grading changed. */
async function syncQuizQuestions(
  tx: Tx,
  quizId: string,
  input: ParsedQuizInput["questions"],
  ctx: { hasSubs: boolean; actorId: string },
): Promise<boolean> {
  const existing = await tx.query.quizQuestions.findMany({
    where: eq(quizQuestions.quizId, quizId),
    with: { options: true },
  });
  const existingById = new Map(existing.map((q) => [q.id, q]));
  const keptIds = new Set(input.map((q) => q.id).filter(Boolean) as string[]);
  let keyChanged = false;

  for (const id of keptIds) {
    if (!existingById.has(id)) throw new QuizAdminError("A question doesn't belong to this quiz. Reload and try again.");
  }

  const removed = existing.filter((q) => !keptIds.has(q.id));
  if (removed.length) {
    if (ctx.hasSubs) throw new QuizAdminError("Students have answered this quiz, so questions can't be removed.");
    await tx.delete(quizQuestions).where(inArray(quizQuestions.id, removed.map((q) => q.id)));
  }

  for (const [position, q] of input.entries()) {
    let sourceQuestionId = q.sourceQuestionId ?? null;
    if (q.saveToBank && !sourceQuestionId) {
      sourceQuestionId = await insertBankQuestion(tx, q, q.meta, ctx.actorId);
    }

    const row = {
      position,
      type: q.type,
      prompt: q.prompt,
      explanation: q.explanation,
      points: q.points,
      acceptedAnswers: q.acceptedAnswers,
      caseSensitive: q.caseSensitive,
      manualReview: q.manualReview,
      sourceQuestionId,
    };

    let questionId: string;
    const prev = q.id ? existingById.get(q.id) : undefined;
    if (prev) {
      if (ctx.hasSubs && prev.type !== q.type) {
        throw new QuizAdminError("A question's type can't change after students have answered it.");
      }
      if (
        prev.points !== q.points ||
        prev.caseSensitive !== q.caseSensitive ||
        prev.manualReview !== q.manualReview ||
        prev.acceptedAnswers.join("\u0000") !== q.acceptedAnswers.join("\u0000")
      ) {
        keyChanged = true;
      }
      await tx.update(quizQuestions).set(row).where(eq(quizQuestions.id, prev.id));
      questionId = prev.id;
    } else {
      const [inserted] = await tx.insert(quizQuestions).values({ ...row, quizId }).returning({ id: quizQuestions.id });
      questionId = inserted.id;
      keyChanged = true;
    }

    // Options
    const prevOptions = new Map((prev?.options ?? []).map((o) => [o.id, o]));
    const keptOptionIds = new Set(q.options.map((o) => o.id).filter(Boolean) as string[]);
    for (const id of keptOptionIds) {
      if (!prevOptions.has(id)) throw new QuizAdminError("An option doesn't belong to this question. Reload and try again.");
    }
    const removedOptions = [...prevOptions.values()].filter((o) => !keptOptionIds.has(o.id));
    if (removedOptions.length) {
      if (ctx.hasSubs) {
        const used = await tx.query.submissionAnswers.findFirst({
          columns: { id: true },
          where: eq(submissionAnswers.quizQuestionId, questionId),
        });
        if (used) throw new QuizAdminError("Options can't be removed after students have answered. Edit the text instead.");
      }
      await tx.delete(quizQuestionOptions).where(inArray(quizQuestionOptions.id, removedOptions.map((o) => o.id)));
      keyChanged = true;
    }
    for (const [i, o] of q.options.entries()) {
      const prevOpt = o.id ? prevOptions.get(o.id) : undefined;
      if (prevOpt) {
        if (prevOpt.isCorrect !== o.isCorrect) keyChanged = true;
        await tx
          .update(quizQuestionOptions)
          .set({ label: o.label, isCorrect: o.isCorrect, position: i })
          .where(eq(quizQuestionOptions.id, prevOpt.id));
      } else {
        await tx.insert(quizQuestionOptions).values({ quizQuestionId: questionId, label: o.label, isCorrect: o.isCorrect, position: i });
        keyChanged = true;
      }
    }
  }
  return keyChanged;
}

export async function insertBankQuestion(
  tx: Tx | Database,
  q: Pick<ParsedQuizInput["questions"][number], "type" | "prompt" | "explanation" | "points" | "acceptedAnswers" | "caseSensitive" | "manualReview" | "options">,
  meta: z.output<typeof questionMetaSchema> | undefined,
  actorId: string | null,
): Promise<string> {
  const [row] = await tx
    .insert(questions)
    .values({
      type: q.type,
      prompt: q.prompt,
      explanation: q.explanation,
      points: q.points,
      acceptedAnswers: q.acceptedAnswers,
      caseSensitive: q.caseSensitive,
      manualReview: q.manualReview,
      book: meta?.book ?? null,
      chapter: meta?.chapter ?? null,
      verses: meta?.verses ?? null,
      topic: meta?.topic ?? null,
      difficulty: meta?.difficulty ?? null,
      createdBy: actorId,
    })
    .returning({ id: questions.id });
  if (q.options.length) {
    await tx
      .insert(questionOptions)
      .values(q.options.map((o, i) => ({ questionId: row.id, label: o.label, isCorrect: o.isCorrect, position: i })));
  }
  return row.id;
}

export async function setQuizStatus(
  database: Database,
  opts: { quizId: string; status: "draft" | "published" | "archived"; actorId: string },
) {
  await database.transaction(async (tx) => {
    const quiz = await tx.query.quizzes.findFirst({ where: eq(quizzes.id, opts.quizId) });
    if (!quiz) throw new QuizAdminError("Quiz not found.");
    const hasSubs = !!(await tx.query.submissions.findFirst({ columns: { id: true }, where: eq(submissions.quizId, quiz.id) }));
    if (opts.status === "draft" && hasSubs) throw new QuizAdminError("Students have taken this quiz. Archive it instead.");
    if (opts.status === "published") {
      const q = await tx.query.quizQuestions.findFirst({ columns: { id: true }, where: eq(quizQuestions.quizId, quiz.id) });
      if (!q) throw new QuizAdminError("Add at least one question before publishing.");
    }
    await tx
      .update(quizzes)
      .set({
        status: opts.status,
        publishedAt: opts.status === "published" ? (quiz.publishedAt ?? new Date()) : quiz.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(quizzes.id, quiz.id));
    await audit(tx, { actorId: opts.actorId, action: `quiz.${opts.status}`, targetType: "quiz", targetId: quiz.id, details: { title: quiz.title } });
  });
}

/** Only drafts nobody has taken can be deleted outright. */
export async function deleteDraftQuiz(database: Database, opts: { quizId: string; actorId: string }) {
  await database.transaction(async (tx) => {
    const quiz = await tx.query.quizzes.findFirst({ where: eq(quizzes.id, opts.quizId) });
    if (!quiz) throw new QuizAdminError("Quiz not found.");
    if (quiz.status !== "draft") throw new QuizAdminError("Only drafts can be deleted. Archive published quizzes instead.");
    const sub = await tx.query.submissions.findFirst({ columns: { id: true }, where: eq(submissions.quizId, quiz.id) });
    if (sub) throw new QuizAdminError("This quiz has submissions and can't be deleted.");
    await tx.delete(quizzes).where(eq(quizzes.id, quiz.id));
    await audit(tx, { actorId: opts.actorId, action: "quiz.deleted", targetType: "quiz", targetId: quiz.id, details: { title: quiz.title } });
  });
}

/** Loads a quiz in the editor's input shape. */
export async function getQuizForEditing(database: Database, quizId: string) {
  const quiz = await database.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) });
  if (!quiz) return null;
  const qs = await database.query.quizQuestions.findMany({
    where: eq(quizQuestions.quizId, quizId),
    orderBy: [asc(quizQuestions.position)],
    with: { options: { orderBy: [asc(quizQuestionOptions.position)] } },
  });
  return { quiz, questions: qs };
}

/** Copies bank questions into the editor's input shape (as new snapshots). */
export async function getBankQuestionsForQuiz(database: Database, ids: string[]) {
  if (!ids.length) return [];
  const rows = await database.query.questions.findMany({
    where: and(inArray(questions.id, ids), isNull(questions.archivedAt)),
    with: { options: { orderBy: [asc(questionOptions.position)] } },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((r) => !!r);
}
