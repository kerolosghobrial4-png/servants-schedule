import { eq, sql } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "@/db";
import { pointTransactions, quizzes, submissionAnswers, submissions } from "@/db/schema";
import { getBalance, reverseTransaction } from "@/server/ledger";
import { getLeaderboard } from "@/server/leaderboard";
import { DEFAULT_SETTINGS, saveSettings } from "@/server/settings";
import { regradeQuiz, reviewAnswer, setEditAllowed, submitQuiz } from "@/server/submissions";
import { makeQuiz, makeStaff, makeStudent, mc } from "./helpers";

const H = 3600_000;
const now = new Date("2026-10-03T15:00:00Z");
const open = { opensAt: new Date(now.getTime() - H), closesAt: new Date(now.getTime() + H) };

afterAll(async () => {
  await pool.end();
});

function answersFor(questions: Awaited<ReturnType<typeof makeQuiz>>["questions"], pick: (i: number) => number) {
  return questions.map((q, i) => ({ questionId: q.id, selectedOptionIds: [q.options[pick(i)].id], textAnswer: null }));
}

describe("quiz submission", () => {
  it("awards points from the server-side answer key, exactly once", async () => {
    await saveSettings(db, DEFAULT_SETTINGS, null);
    const s = await makeStudent("Mark");
    const { quiz, questions } = await makeQuiz({ quizDate: "2026-10-03", ...open, questions: [mc(1), mc(1), mc(1)] });

    const result = await submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 1), now });
    // 30 correct + 5 participation + 10 completion + 20 perfect
    expect(result.pointsEarned).toBe(65);
    expect(await getBalance(db, s.id)).toBe(65 + result.streakBonus);

    await expect(
      submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 1), now }),
    ).rejects.toThrow(/already submitted/);
    expect(await getBalance(db, s.id)).toBe(65 + result.streakBonus);
  });

  it("survives concurrent duplicate submissions", async () => {
    const s = await makeStudent();
    const { quiz, questions } = await makeQuiz({ quizDate: "2026-10-03", ...open, questions: [mc(0)] });
    const a = answersFor(questions, () => 0);
    const results = await Promise.allSettled([
      submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: a, now }),
      submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: a, now }),
      submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: a, now }),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const subs = await db.select().from(submissions).where(eq(submissions.userId, s.id));
    expect(subs).toHaveLength(1);
  });

  it("rejects drafts, unopened, closed quizzes and foreign option ids", async () => {
    const s = await makeStudent();
    const draft = await makeQuiz({ quizDate: "2026-10-03", ...open, status: "draft", questions: [mc()] });
    await expect(
      submitQuiz(db, { userId: s.id, quizId: draft.quiz.id, answers: answersFor(draft.questions, () => 1), now }),
    ).rejects.toThrow(/isn't available/);

    const future = await makeQuiz({
      quizDate: "2026-10-04",
      opensAt: new Date(now.getTime() + H),
      closesAt: new Date(now.getTime() + 2 * H),
      questions: [mc()],
    });
    await expect(
      submitQuiz(db, { userId: s.id, quizId: future.quiz.id, answers: answersFor(future.questions, () => 1), now }),
    ).rejects.toThrow(/isn't available/);

    const closed = await makeQuiz({
      quizDate: "2026-10-01",
      opensAt: new Date(now.getTime() - 3 * H),
      closesAt: new Date(now.getTime() - 2 * H),
      questions: [mc()],
    });
    await expect(
      submitQuiz(db, { userId: s.id, quizId: closed.quiz.id, answers: answersFor(closed.questions, () => 1), now }),
    ).rejects.toThrow(/closed/);

    const other = await makeQuiz({ quizDate: "2026-10-03", ...open, questions: [mc()] });
    const mine = await makeQuiz({ quizDate: "2026-10-03", ...open, questions: [mc()] });
    await expect(
      submitQuiz(db, {
        userId: s.id,
        quizId: mine.quiz.id,
        answers: [{ questionId: mine.questions[0].id, selectedOptionIds: [other.questions[0].options[1].id], textAnswer: null }],
        now,
      }),
    ).rejects.toThrow(/doesn't match/);
    expect(await getBalance(db, s.id)).toBe(0);
  });

  it("refuses submissions from staff accounts", async () => {
    const admin = await makeStaff();
    const { quiz, questions } = await makeQuiz({ quizDate: "2026-10-03", ...open, questions: [mc()] });
    await expect(
      submitQuiz(db, { userId: admin.id, quizId: quiz.id, answers: answersFor(questions, () => 1), now }),
    ).rejects.toThrow(/student/);
  });

  it("queues unmatched short answers for review and pays out on approval", async () => {
    const s = await makeStudent();
    const leader = await makeStaff("leader");
    const { quiz, questions } = await makeQuiz({
      quizDate: "2026-10-03",
      ...open,
      countsForStreak: false,
      questions: [mc(1), { type: "short_answer", acceptedAnswers: ["Peter"], manualReview: true }],
    });
    const r = await submitQuiz(db, {
      userId: s.id,
      quizId: quiz.id,
      answers: [
        { questionId: questions[0].id, selectedOptionIds: [questions[0].options[1].id], textAnswer: null },
        { questionId: questions[1].id, selectedOptionIds: [], textAnswer: "Simon Peter" },
      ],
      now,
    });
    expect(r.pendingCount).toBe(1);
    expect(await getBalance(db, s.id)).toBe(10 + 5 + 10);

    const [ans] = await db
      .select()
      .from(submissionAnswers)
      .where(eq(submissionAnswers.quizQuestionId, questions[1].id));
    await reviewAnswer(db, { answerId: ans.id, decision: "approved", actorId: leader.id });
    expect(await getBalance(db, s.id)).toBe(20 + 5 + 10 + 20);

    // Reviewing again is idempotent; rejecting claws back via new ledger rows.
    await reviewAnswer(db, { answerId: ans.id, decision: "approved", actorId: leader.id });
    expect(await getBalance(db, s.id)).toBe(55);
    await reviewAnswer(db, { answerId: ans.id, decision: "rejected", actorId: leader.id });
    expect(await getBalance(db, s.id)).toBe(25);
    const rows = await db.select().from(pointTransactions).where(eq(pointTransactions.userId, s.id));
    expect(rows.length).toBeGreaterThan(4);
  });

  it("regrades after an answer-key fix and honours leader reversals", async () => {
    const s = await makeStudent();
    const admin = await makeStaff();
    const { quiz, questions } = await makeQuiz({
      quizDate: "2026-10-03",
      ...open,
      countsForStreak: false,
      questions: [mc(0)],
    });
    await submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 1), now });
    expect(await getBalance(db, s.id)).toBe(5 + 10); // wrong answer: participation + completion

    // Leader realises B was actually correct.
    await db.execute(sql`update quiz_question_options set is_correct = (position = 1) where quiz_question_id = ${questions[0].id}`);
    await regradeQuiz(db, quiz.id, admin.id);
    expect(await getBalance(db, s.id)).toBe(5 + 10 + 10 + 20);

    // Reversing the perfect bonus sticks even through another regrade.
    const perfectRow = (await db.select().from(pointTransactions).where(eq(pointTransactions.userId, s.id))).find(
      (r) => r.category === "quiz_perfect",
    )!;
    await db.transaction((tx) => reverseTransaction(tx, { transactionId: perfectRow.id, actorId: admin.id, reason: "dup" }));
    await regradeQuiz(db, quiz.id, admin.id);
    expect(await getBalance(db, s.id)).toBe(25);
    await expect(
      db.transaction((tx) => reverseTransaction(tx, { transactionId: perfectRow.id, actorId: admin.id, reason: "again" })),
    ).rejects.toThrow(/already been reversed/);
  });

  it("allows a revision only after staff permit it", async () => {
    const s = await makeStudent();
    const admin = await makeStaff();
    const { quiz, questions } = await makeQuiz({ quizDate: "2026-10-03", ...open, countsForStreak: false, questions: [mc(2)] });
    const sub = await submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 1), now });
    await setEditAllowed(db, { submissionId: sub.submissionId, allowed: true, actorId: admin.id });
    await submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 2), now });
    expect(await getBalance(db, s.id)).toBe(5 + 10 + 10 + 20);
    await expect(
      submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 2), now }),
    ).rejects.toThrow(/already submitted/);
  });

  it("awards a streak bonus at the milestone, once", async () => {
    await saveSettings(db, { ...DEFAULT_SETTINGS, streak: { weekendsCount: true, bonusEvery: 3, bonusPoints: 25 } }, null);
    // Use a far-future window so other tests' quizzes don't interleave.
    const base = new Date("2030-01-10T15:00:00Z");
    const s = await makeStudent();
    let last = 0;
    for (let d = 0; d < 3; d++) {
      const day = new Date(base.getTime() + d * 24 * H);
      const quizDate = `2030-01-${String(10 + d).padStart(2, "0")}`;
      const { quiz, questions } = await makeQuiz({
        quizDate,
        opensAt: new Date(day.getTime() - H),
        closesAt: new Date(day.getTime() + H),
        questions: [mc(0)],
      });
      const r = await submitQuiz(db, { userId: s.id, quizId: quiz.id, answers: answersFor(questions, () => 0), now: day });
      last = r.streakBonus;
      expect(r.streak).toBe(d + 1);
    }
    expect(last).toBe(25);
    const streakRows = (await db.select().from(pointTransactions).where(eq(pointTransactions.userId, s.id))).filter(
      (r) => r.category === "streak_bonus",
    );
    expect(streakRows).toHaveLength(1);
    await db.update(quizzes).set({ status: "archived" }).where(sql`quiz_date >= '2030-01-01'`);
    await saveSettings(db, DEFAULT_SETTINGS, null);
  });
});

describe("ledger integrity", () => {
  it("rejects updates and deletes at the database level", async () => {
    const s = await makeStudent();
    const [row] = await db
      .insert(pointTransactions)
      .values({ userId: s.id, amount: 5, category: "admin_adjustment", description: "test" })
      .returning();
    await expect(db.update(pointTransactions).set({ amount: 5000 }).where(eq(pointTransactions.id, row.id))).rejects.toThrow();
    await expect(db.delete(pointTransactions).where(eq(pointTransactions.id, row.id))).rejects.toThrow();
    await expect(
      db.insert(pointTransactions).values({ userId: s.id, amount: 0, category: "admin_adjustment", description: "zero" }),
    ).rejects.toThrow();
  });

  it("ranks ties with competition ranking and only shows students", async () => {
    const board = await getLeaderboard(db, { kind: "period", period: "all" }, DEFAULT_SETTINGS);
    expect(board.every((r) => Object.keys(r).sort().join() === "displayName,points,rank,streak,userId")).toBe(true);
    for (let i = 1; i < board.length; i++) {
      expect(board[i].points).toBeLessThanOrEqual(board[i - 1].points);
      if (board[i].points === board[i - 1].points) expect(board[i].rank).toBe(board[i - 1].rank);
    }
  });
});
