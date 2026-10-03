import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "@/db";
import { checkLedgerIntegrity } from "@/server/integrity";
import { recordPoints } from "@/server/ledger";
import { submitQuiz } from "@/server/submissions";
import { makeQuiz, makeStudent, mc } from "./helpers";

afterAll(async () => {
  await pool.end();
});

describe("ledger integrity check", () => {
  it("passes for normal submissions and flags a tampered award", async () => {
    const now = new Date("2033-01-01T15:00:00Z");
    const s = await makeStudent();
    const { quiz, questions } = await makeQuiz({
      quizDate: "2033-01-01",
      opensAt: new Date(now.getTime() - 3600_000),
      closesAt: new Date(now.getTime() + 3600_000),
      countsForStreak: false,
      questions: [mc(0)],
    });
    const { submissionId } = await submitQuiz(db, {
      userId: s.id,
      quizId: quiz.id,
      answers: [{ questionId: questions[0].id, selectedOptionIds: [questions[0].options[0].id], textAnswer: null }],
      now,
    });
    const mine = (r: Awaited<ReturnType<typeof checkLedgerIntegrity>>) => r.issues.filter((i) => i.submissionId === submissionId);
    expect(mine(await checkLedgerIntegrity(db))).toEqual([]);

    // Simulate a bad write: an extra perfect bonus under the quiz's award key.
    await recordPoints(db, { userId: s.id, amount: 20, category: "quiz_perfect", description: "dup", sourceKey: `quiz:${quiz.id}:quiz_perfect` });
    const issues = mine(await checkLedgerIntegrity(db));
    expect(issues).toHaveLength(1);
    expect(issues[0].kind).toBe("ledger_mismatch");
  });
});
