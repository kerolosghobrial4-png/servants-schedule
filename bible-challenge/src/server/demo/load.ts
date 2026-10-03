import "server-only";
import { randomUUID } from "node:crypto";
import { asc, eq, sql } from "drizzle-orm";
import type { Database } from "@/db";
import {
  pointTransactions,
  quizQuestionOptions,
  quizQuestions,
  quizzes,
  seasonParticipants,
  seasons,
  submissionAnswers,
  submissions,
  users,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { addDays, dateInTz, isWeekend } from "@/lib/time";
import { evaluateAchievements } from "../achievements";
import { desiredQuizAwards, gradeAnswer, summarize } from "../grading";
import { quizQuestionInputSchema } from "../question-input";
import { insertBankQuestion, quizInputSchema, saveQuiz } from "../quiz-admin";
import { getSettings } from "../settings";
import { computeStreak, getStreaks } from "../streaks";
import { LESSONS } from "./lessons";

export const DEMO_STUDENT_PASSWORD = "bible-demo-2026";

const STUDENTS = [
  ["matthew", "Matthew", 0.95],
  ["david", "David", 0.9],
  ["mark", "Mark", 0.85],
  ["andrew", "Andrew", 0.8],
  ["john", "John", 0.8],
  ["peter", "Peter", 0.7],
  ["thomas", "Thomas", 0.65],
  ["philip", "Philip", 0.6],
  ["stephen", "Stephen", 0.55],
  ["timothy", "Timothy", 0.5],
  ["luke", "Luke", 0.45],
  ["joseph", "Joseph", 0.35],
] as const;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const CATEGORY_TEXT = {
  quiz_participation: "Daily participation",
  quiz_correct: "Correct answers",
  quiz_completion: "Completed every question",
  quiz_perfect: "Perfect score",
  quiz_bonus: "Quiz bonus",
} as const;

async function insertChunked<T>(rows: T[], insert: (chunk: T[]) => Promise<unknown>, size = 500) {
  for (let i = 0; i < rows.length; i += size) await insert(rows.slice(i, i + size));
}

/**
 * Loads a realistic demo: 12 students, a leader, an active season, a question
 * bank, ten days of past quizzes with graded submissions, today's quiz and
 * tomorrow's. Grading and awards use the same pure functions as live
 * submissions, so the ledger passes the integrity check, but everything is
 * written in bulk so it finishes in a couple of seconds even on a remote
 * database. Does nothing if demo students already exist.
 */
export async function loadDemoData(database: Database, opts: { adminId: string; now?: Date }): Promise<boolean> {
  const now = opts.now ?? new Date();
  const existing = await database.query.users.findFirst({ where: sql`lower(${users.username}) = 'matthew'` });
  if (existing) return false;

  const settings = await getSettings(database);
  const tz = settings.timezone;
  const today = dateInTz(now, tz);
  const random = rng(42);

  // Accounts
  const passwordHash = await hashPassword(DEMO_STUDENT_PASSWORD);
  const students = await database
    .insert(users)
    .values(STUDENTS.map(([username, displayName]) => ({ username, displayName, passwordHash, role: "student" as const })))
    .returning({ id: users.id, username: users.username });
  const skill = new Map<string, number>(STUDENTS.map(([u, , s]) => [u, s]));
  const [leader] = await database
    .insert(users)
    .values({ username: "leader", displayName: "Demo Leader", passwordHash: await hashPassword("leader-demo-2026"), role: "leader" })
    .onConflictDoNothing()
    .returning({ id: users.id });

  const [season] = await database
    .insert(seasons)
    .values({
      name: "Fall Bible Challenge",
      description: "Read through the Gospel of Matthew together.",
      startsOn: addDays(today, -12),
      endsOn: addDays(today, 78),
      isActive: true,
    })
    .returning({ id: seasons.id });
  await database.insert(seasonParticipants).values(students.map((s) => ({ seasonId: season.id, userId: s.id })));

  // Question bank
  for (const lesson of LESSONS) {
    for (const q of lesson.questions) {
      const parsed = quizQuestionInputSchema.parse(q);
      await insertBankQuestion(database, parsed, parsed.meta, opts.adminId);
    }
  }

  // Quizzes: ten past days, today and tomorrow.
  const days = [...Array(12).keys()].map((i) => addDays(today, i - 10));
  const quizIds: { id: string; day: string }[] = [];
  for (const [i, day] of days.entries()) {
    const lesson = LESSONS[i % LESSONS.length];
    const input = quizInputSchema.parse({
      title: `Daily Bible Study — ${lesson.title}`,
      passage: lesson.passage,
      topic: lesson.topic,
      studyNotes: lesson.notes,
      quizDate: day,
      startTime: "06:00",
      endDate: day,
      endTime: "23:30",
      answerReveal: i % 4 === 3 ? "after_close" : "immediate",
      bonusPoints: 0,
      bonusCondition: "perfect",
      countsForStreak: true,
      questions: lesson.questions.map((q) => ({ ...q, saveToBank: false })),
    });
    const { quizId } = await saveQuiz(database, { input, actorId: opts.adminId, intent: "publish" });
    quizIds.push({ id: quizId, day });
  }

  // Graded submissions for the past days, computed in memory.
  const subRows: (typeof submissions.$inferInsert)[] = [];
  const answerRows: (typeof submissionAnswers.$inferInsert)[] = [];
  const ledgerRows: (typeof pointTransactions.$inferInsert)[] = [];
  const completed = new Map<string, Set<string>>(students.map((s) => [s.id, new Set()]));
  const rules = { participation: settings.points.participation, completion: settings.points.completion, perfect: settings.points.perfect };

  for (const { id: quizId, day } of quizIds) {
    if (day >= today) continue;
    const quiz = (await database.query.quizzes.findFirst({ where: eq(quizzes.id, quizId) }))!;
    const qs = await database.query.quizQuestions.findMany({
      where: eq(quizQuestions.quizId, quizId),
      orderBy: [asc(quizQuestions.position)],
      with: { options: { orderBy: [asc(quizQuestionOptions.position)] } },
    });
    for (const s of students) {
      const sk = skill.get(s.username)!;
      if (random() < (1 - sk) * 0.6 + (isWeekend(day) ? 0.1 : 0)) continue;
      const submissionId = randomUUID();
      const submittedAt = new Date(quiz.opensAt.getTime() + (2 + random() * 12) * 3600_000);
      const grades = qs.map((q) => {
        const right = random() < sk;
        const raw =
          q.type === "short_answer"
            ? { selectedOptionIds: [], textAnswer: right ? (q.acceptedAnswers[0] ?? "") : "not sure" }
            : {
                selectedOptionIds: right
                  ? q.options.filter((o) => o.isCorrect).map((o) => o.id)
                  : [q.options.find((o) => !o.isCorrect)!.id],
                textAnswer: null,
              };
        const g = gradeAnswer(
          {
            id: q.id,
            type: q.type,
            points: q.points,
            acceptedAnswers: q.acceptedAnswers,
            caseSensitive: q.caseSensitive,
            manualReview: q.manualReview,
            options: q.options.map((o) => ({ id: o.id, isCorrect: o.isCorrect })),
          },
          raw,
        );
        answerRows.push({
          submissionId,
          quizQuestionId: q.id,
          selectedOptionIds: raw.selectedOptionIds,
          textAnswer: raw.textAnswer,
          isCorrect: g.isCorrect,
          reviewStatus: g.reviewStatus,
          pointsAwarded: g.pointsAwarded,
        });
        return g;
      });
      const summary = summarize(qs, grades);
      subRows.push({
        id: submissionId,
        quizId,
        userId: s.id,
        submittedAt,
        status: summary.pendingCount ? "pending_review" : "graded",
        scorePoints: summary.scorePoints,
        maxPoints: summary.maxPoints,
        correctCount: summary.correctCount,
        answeredCount: summary.answeredCount,
        questionCount: summary.questionCount,
        awardRules: rules,
      });
      for (const award of desiredQuizAwards(summary, rules, { points: quiz.bonusPoints, condition: quiz.bonusCondition })) {
        if (!award.amount) continue;
        ledgerRows.push({
          userId: s.id,
          amount: award.amount,
          category: award.category,
          description: `${CATEGORY_TEXT[award.category]} — ${quiz.title}${award.category === "quiz_correct" ? ` (${summary.correctCount}/${summary.questionCount})` : ""}`,
          sourceKey: `quiz:${quizId}:${award.category}`,
          quizId,
          submissionId,
          effectiveAt: submittedAt,
          createdAt: submittedAt,
        });
      }
      completed.get(s.id)!.add(day);
    }
  }

  // Streak bonuses, replayed day by day exactly as live submissions would earn them.
  const every = settings.streak.bonusEvery;
  if (every > 0 && settings.streak.bonusPoints > 0) {
    const pastDays = quizIds.map((q) => q.day).filter((d) => d < today);
    for (const s of students) {
      const done = completed.get(s.id)!;
      for (let i = 0; i < pastDays.length; i++) {
        const day = pastDays[i];
        if (!done.has(day)) continue;
        const { current } = computeStreak({
          quizDays: pastDays.slice(0, i + 1),
          openDays: new Set(),
          completedDays: done,
          weekendsCount: settings.streak.weekendsCount,
        });
        if (current > 0 && current % every === 0) {
          ledgerRows.push({
            userId: s.id,
            amount: settings.streak.bonusPoints,
            category: "streak_bonus",
            description: `${current}-day streak`,
            sourceKey: `streak:${day}:${current}`,
            effectiveAt: new Date(`${day}T20:00:00Z`),
          });
        }
      }
    }
  }

  await insertChunked(subRows, (c) => database.insert(submissions).values(c));
  await insertChunked(answerRows, (c) => database.insert(submissionAnswers).values(c));
  await insertChunked(ledgerRows, (c) => database.insert(pointTransactions).values(c));

  await database.insert(pointTransactions).values({
    userId: students.find((s) => s.username === "mark")!.id,
    amount: 50,
    category: "admin_adjustment",
    description: "Memorized the Beatitudes",
    note: "Recited Matthew 5:3–12 in class",
    createdBy: leader?.id ?? opts.adminId,
  });

  // Badges earned so far.
  const streaks = await getStreaks(
    database,
    students.map((s) => s.id),
    { tz, weekendsCount: settings.streak.weekendsCount, now },
  );
  await database.transaction(async (tx) => {
    for (const s of students) await evaluateAchievements(tx, s.id, streaks.get(s.id)!);
  });
  return true;
}
