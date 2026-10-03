import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { quizQuestionOptions, quizQuestions, quizzes, users, type QuestionType } from "@/db/schema";

export async function makeStudent(name = "Student") {
  const [u] = await db
    .insert(users)
    .values({ username: `s_${randomUUID().slice(0, 8)}`, displayName: name, passwordHash: "x", role: "student" })
    .returning();
  return u;
}

export async function makeStaff(role: "leader" | "admin" = "admin") {
  const [u] = await db
    .insert(users)
    .values({ username: `a_${randomUUID().slice(0, 8)}`, displayName: "Leader", passwordHash: "x", role })
    .returning();
  return u;
}

type Q = {
  type: QuestionType;
  points?: number;
  options?: { label: string; isCorrect: boolean }[];
  acceptedAnswers?: string[];
  manualReview?: boolean;
};

export async function makeQuiz(opts: {
  quizDate: string;
  opensAt: Date;
  closesAt: Date;
  status?: "draft" | "published";
  questions: Q[];
  bonusPoints?: number;
  countsForStreak?: boolean;
}) {
  const [quiz] = await db
    .insert(quizzes)
    .values({
      title: `Quiz ${opts.quizDate}`,
      quizDate: opts.quizDate,
      opensAt: opts.opensAt,
      closesAt: opts.closesAt,
      status: opts.status ?? "published",
      bonusPoints: opts.bonusPoints ?? 0,
      countsForStreak: opts.countsForStreak ?? true,
    })
    .returning();
  const qs = [];
  for (const [i, q] of opts.questions.entries()) {
    const [row] = await db
      .insert(quizQuestions)
      .values({
        quizId: quiz.id,
        position: i,
        type: q.type,
        prompt: `Q${i + 1}`,
        points: q.points ?? 10,
        acceptedAnswers: q.acceptedAnswers ?? [],
        manualReview: q.manualReview ?? false,
      })
      .returning();
    const options = q.options?.length
      ? await db
          .insert(quizQuestionOptions)
          .values(q.options.map((o, j) => ({ quizQuestionId: row.id, label: o.label, isCorrect: o.isCorrect, position: j })))
          .returning()
      : [];
    qs.push({ ...row, options });
  }
  return { quiz, questions: qs };
}

export const mc = (correctIndex = 1): Q => ({
  type: "multiple_choice",
  options: ["A", "B", "C", "D"].map((label, i) => ({ label, isCorrect: i === correctIndex })),
});
