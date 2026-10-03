import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "@/db";
import { getStudentQuizView } from "@/server/quiz-view";
import { getQuizForTaking, submitQuiz } from "@/server/submissions";
import { makeQuiz, makeStudent, mc } from "./helpers";

const H = 3600_000;
const now = new Date("2031-03-03T15:00:00Z");

afterAll(async () => {
  await pool.end();
});

/** Recursively finds keys that would reveal the answer key. */
function leakedKeys(value: unknown, path = ""): string[] {
  if (!value || typeof value !== "object") return [];
  const out: string[] = [];
  for (const [k, v] of Object.entries(value)) {
    if (["isCorrect", "acceptedAnswers", "acceptedAnswer", "explanation"].includes(k) && v !== undefined && v !== null) {
      out.push(`${path}.${k}`);
    }
    out.push(...leakedKeys(v, `${path}.${k}`));
  }
  return out;
}

describe("student quiz view", () => {
  it("never includes answer keys while taking a quiz", async () => {
    const { quiz } = await makeQuiz({
      quizDate: "2031-03-03",
      opensAt: new Date(now.getTime() - H),
      closesAt: new Date(now.getTime() + H),
      questions: [mc(1), { type: "short_answer", acceptedAnswers: ["Moses"] }],
    });
    const taking = await getQuizForTaking(db, quiz.id);
    expect(leakedKeys(taking)).toEqual([]);

    const s = await makeStudent();
    const view = await getStudentQuizView(db, s.id, quiz.id, now);
    expect(view?.mode).toBe("take");
    expect(leakedKeys(view)).toEqual([]);
  });

  it("hides answers after submitting when reveal is after close, then reveals them", async () => {
    const { quiz, questions } = await makeQuiz({
      quizDate: "2031-03-03",
      opensAt: new Date(now.getTime() - H),
      closesAt: new Date(now.getTime() + H),
      questions: [mc(1)],
    });
    const { quizzes } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    await db.update(quizzes).set({ answerReveal: "after_close" }).where(eq(quizzes.id, quiz.id));

    const s = await makeStudent();
    await submitQuiz(db, {
      userId: s.id,
      quizId: quiz.id,
      answers: [{ questionId: questions[0].id, selectedOptionIds: [questions[0].options[0].id], textAnswer: null }],
      now,
    });
    const during = await getStudentQuizView(db, s.id, quiz.id, now);
    expect(during?.mode).toBe("results");
    expect(leakedKeys(during)).toEqual([]);

    const after = await getStudentQuizView(db, s.id, quiz.id, new Date(now.getTime() + 2 * H));
    expect(leakedKeys(after).length).toBeGreaterThan(0);
  });

  it("does not serve drafts or unopened quizzes", async () => {
    const draft = await makeQuiz({
      quizDate: "2031-03-03",
      opensAt: new Date(now.getTime() - H),
      closesAt: new Date(now.getTime() + H),
      status: "draft",
      questions: [mc()],
    });
    const s = await makeStudent();
    expect(await getStudentQuizView(db, s.id, draft.quiz.id, now)).toBeNull();

    const later = await makeQuiz({
      quizDate: "2031-03-04",
      opensAt: new Date(now.getTime() + H),
      closesAt: new Date(now.getTime() + 2 * H),
      questions: [mc()],
    });
    const view = await getStudentQuizView(db, s.id, later.quiz.id, now);
    expect(view?.mode).toBe("locked");
    expect(view && "questions" in view).toBe(false);
  });
});
