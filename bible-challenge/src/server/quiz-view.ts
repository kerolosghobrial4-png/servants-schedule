import "server-only";
import { and, asc, eq, gte } from "drizzle-orm";
import type { Database } from "@/db";
import {
  achievements,
  pointTransactions,
  quizQuestionOptions,
  quizQuestions,
  quizzes,
  submissionAnswers,
  submissions,
  userAchievements,
} from "@/db/schema";
import { getQuizForTaking } from "./submissions";

export type QuizMode = "take" | "results" | "missed" | "locked";

/**
 * Builds exactly what a student may see for one quiz. Answer keys and
 * explanations are only loaded when the quiz's reveal rule allows it.
 */
export async function getStudentQuizView(database: Database, userId: string, quizId: string, now = new Date()) {
  const quiz = await database.query.quizzes.findFirst({
    where: and(eq(quizzes.id, quizId), eq(quizzes.status, "published")),
    columns: {
      id: true,
      title: true,
      passage: true,
      topic: true,
      studyNotes: true,
      quizDate: true,
      opensAt: true,
      closesAt: true,
      answerReveal: true,
    },
  });
  if (!quiz) return null;

  const submission = await database.query.submissions.findFirst({
    where: and(eq(submissions.quizId, quizId), eq(submissions.userId, userId)),
  });

  const isOpen = quiz.opensAt <= now && quiz.closesAt > now;
  let mode: QuizMode;
  if (quiz.opensAt > now) mode = "locked";
  else if (submission?.editAllowed) mode = "take";
  else if (submission) mode = "results";
  else if (isOpen) mode = "take";
  else mode = "missed";

  const revealAnswers = quiz.answerReveal === "immediate" || quiz.closesAt <= now;

  if (mode === "locked") return { quiz, mode, submission: null, revealAnswers: false } as const;
  if (mode === "take") {
    const questions = await getQuizForTaking(database, quizId);
    return { quiz, mode, submission, questions, revealAnswers: false } as const;
  }

  // Results or missed: build the per-question review.
  const qs = await database.query.quizQuestions.findMany({
    where: eq(quizQuestions.quizId, quizId),
    orderBy: [asc(quizQuestions.position)],
    with: { options: { orderBy: [asc(quizQuestionOptions.position)] } },
  });
  const answers = submission
    ? await database.query.submissionAnswers.findMany({ where: eq(submissionAnswers.submissionId, submission.id) })
    : [];
  const byQ = new Map(answers.map((a) => [a.quizQuestionId, a]));

  const review = qs.map((q) => {
    const a = byQ.get(q.id);
    return {
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      points: q.points,
      // Option labels are always safe; correctness only when revealed.
      options: q.options.map((o) => ({
        id: o.id,
        label: o.label,
        isCorrect: revealAnswers ? o.isCorrect : undefined,
        selected: a?.selectedOptionIds.includes(o.id) ?? false,
      })),
      acceptedAnswer: revealAnswers && q.type === "short_answer" ? (q.acceptedAnswers[0] ?? null) : null,
      explanation: revealAnswers ? q.explanation : null,
      textAnswer: a?.textAnswer ?? null,
      isCorrect: revealAnswers ? (a?.isCorrect ?? false) : undefined,
      pending: a?.reviewStatus === "pending",
      pointsAwarded: revealAnswers ? (a?.pointsAwarded ?? 0) : undefined,
    };
  });

  let earned: { amount: number; description: string }[] = [];
  let newAchievements: { name: string; description: string; icon: string }[] = [];
  if (submission) {
    earned = await database
      .select({ amount: pointTransactions.amount, description: pointTransactions.description })
      .from(pointTransactions)
      .where(and(eq(pointTransactions.userId, userId), eq(pointTransactions.submissionId, submission.id)));
    newAchievements = await database
      .select({ name: achievements.name, description: achievements.description, icon: achievements.icon })
      .from(userAchievements)
      .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
      .where(
        and(
          eq(userAchievements.userId, userId),
          gte(userAchievements.awardedAt, new Date(submission.updatedAt.getTime() - 5_000)),
        ),
      );
  }
  const streakBonus = submission
    ? await database
        .select({ amount: pointTransactions.amount, description: pointTransactions.description })
        .from(pointTransactions)
        .where(
          and(
            eq(pointTransactions.userId, userId),
            eq(pointTransactions.category, "streak_bonus"),
            gte(pointTransactions.createdAt, new Date(submission.updatedAt.getTime() - 5_000)),
          ),
        )
    : [];

  return {
    quiz,
    mode,
    submission,
    review,
    revealAnswers,
    earned: [...earned, ...streakBonus],
    newAchievements,
  } as const;
}
