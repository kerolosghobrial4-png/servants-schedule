import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "@/db";
import { achievements, auditLog, sessions, userAchievements, users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { evaluateAchievements, grantAchievement, revokeAchievement } from "@/server/achievements";
import { getBalance } from "@/server/ledger";
import { getLeaderboard } from "@/server/leaderboard";
import { QuizAdminError, deleteDraftQuiz, quizInputSchema, saveQuiz, setQuizStatus, type QuizInput } from "@/server/quiz-admin";
import { createSeason, finalizeSeason } from "@/server/seasons";
import { DEFAULT_SETTINGS } from "@/server/settings";
import { submitQuiz } from "@/server/submissions";
import { adjustPoints, changeRole, createUser, resetUserPassword, setUserActive, UserAdminError } from "@/server/users-admin";
import { makeStaff, makeStudent } from "./helpers";

afterAll(async () => {
  await pool.end();
});

const baseQuiz = (overrides: Partial<QuizInput> = {}): QuizInput => ({
  title: "Test quiz",
  passage: "John 1",
  topic: "",
  studyNotes: "",
  quizDate: "2032-05-05",
  startTime: "06:00",
  endDate: "2032-05-05",
  endTime: "22:00",
  answerReveal: "immediate",
  bonusPoints: 0,
  bonusCondition: "perfect",
  countsForStreak: false,
  questions: [
    {
      type: "multiple_choice",
      prompt: "In the beginning was the…",
      explanation: "",
      points: 10,
      options: [
        { label: "Law", isCorrect: false },
        { label: "Word", isCorrect: true },
      ],
      acceptedAnswers: [],
      caseSensitive: false,
      manualReview: false,
      saveToBank: true,
      meta: { book: "John", chapter: 1, verses: "1", topic: "Gospels", difficulty: "easy" },
    },
  ],
  ...overrides,
});

describe("quiz authoring", () => {
  it("validates the answer key per question type", () => {
    const bad = baseQuiz();
    bad.questions[0].options = bad.questions[0].options!.map((o) => ({ ...o, isCorrect: true }));
    expect(quizInputSchema.safeParse(bad).success).toBe(false);

    const sa = baseQuiz();
    sa.questions[0] = { ...sa.questions[0], type: "short_answer", options: [], acceptedAnswers: [] };
    expect(quizInputSchema.safeParse(sa).success).toBe(false);
    sa.questions[0].manualReview = true;
    expect(quizInputSchema.safeParse(sa).success).toBe(true);

    expect(quizInputSchema.safeParse(baseQuiz({ endTime: "05:00" })).success).toBe(false);
  });

  it("publishes, protects answered questions, and regrades on key fixes", async () => {
    const admin = await makeStaff();
    const input = quizInputSchema.parse(baseQuiz());
    const { quizId } = await saveQuiz(db, { input, actorId: admin.id, intent: "publish" });
    const quiz = await db.query.quizzes.findFirst({
      where: (q, { eq }) => eq(q.id, quizId),
      with: { questions: { with: { options: true } } },
    });
    expect(quiz?.status).toBe("published");
    expect(quiz?.questions[0].sourceQuestionId).toBeTruthy(); // saved to bank

    const s = await makeStudent();
    const q = quiz!.questions[0];
    const law = q.options.find((o) => o.label === "Law")!;
    const word = q.options.find((o) => o.label === "Word")!;
    await submitQuiz(db, {
      userId: s.id,
      quizId,
      answers: [{ questionId: q.id, selectedOptionIds: [law.id], textAnswer: null }],
      now: new Date(quiz!.opensAt.getTime() + 60_000),
    });
    const before = await getBalance(db, s.id);

    // Removing an answered question is refused.
    await expect(
      saveQuiz(db, { quizId, input: quizInputSchema.parse(baseQuiz({ questions: [] })), actorId: admin.id, intent: "keep" }),
    ).rejects.toThrow(QuizAdminError);
    // Going back to draft is refused.
    await expect(setQuizStatus(db, { quizId, status: "draft", actorId: admin.id })).rejects.toThrow(/Archive/);

    // Flip the key so "Law" is correct: the student's submission is regraded.
    const fixed = baseQuiz();
    fixed.questions[0] = {
      ...fixed.questions[0],
      id: q.id,
      sourceQuestionId: q.sourceQuestionId,
      saveToBank: false,
      options: [
        { id: law.id, label: "Law", isCorrect: true },
        { id: word.id, label: "Word", isCorrect: false },
      ],
    };
    const res = await saveQuiz(db, { quizId, input: quizInputSchema.parse(fixed), actorId: admin.id, intent: "keep" });
    expect(res.regraded).toBe(1);
    expect(await getBalance(db, s.id)).toBe(before + 10 + 20);
  });

  it("only deletes untaken drafts", async () => {
    const admin = await makeStaff();
    const { quizId } = await saveQuiz(db, { input: quizInputSchema.parse(baseQuiz()), actorId: admin.id, intent: "draft" });
    await deleteDraftQuiz(db, { quizId, actorId: admin.id });
    expect(await db.query.quizzes.findFirst({ where: (q, { eq }) => eq(q.id, quizId) })).toBeUndefined();

    const pub = await saveQuiz(db, { input: quizInputSchema.parse(baseQuiz()), actorId: admin.id, intent: "publish" });
    await expect(deleteDraftQuiz(db, { quizId: pub.quizId, actorId: admin.id })).rejects.toThrow(/Only drafts/);
  });
});

describe("accounts", () => {
  it("creates students with a one-time temporary password", async () => {
    const admin = await makeStaff();
    const name = `kid${Date.now()}`;
    const { id, temporaryPassword } = await createUser(db, { username: name, displayName: "Kid", role: "student", actorId: admin.id });
    const u = await db.query.users.findFirst({ where: eq(users.id, id) });
    expect(u?.mustChangePassword).toBe(true);
    expect(u?.passwordHash).not.toContain(temporaryPassword!);
    expect(await verifyPassword(temporaryPassword!, u!.passwordHash)).toBe(true);
    await expect(
      createUser(db, { username: name.toUpperCase(), displayName: "Dup", role: "student", actorId: admin.id }),
    ).rejects.toThrow(/taken/);
  });

  it("revokes sessions on reset and deactivation, and keeps one admin", async () => {
    const admin = await makeStaff("admin");
    const s = await makeStudent();
    await db.insert(sessions).values({ id: `t-${s.id}`, userId: s.id, expiresAt: new Date(Date.now() + 1e6) });
    await resetUserPassword(db, { id: s.id, actorId: admin.id });
    expect(await db.query.sessions.findFirst({ where: eq(sessions.userId, s.id) })).toBeUndefined();

    await db.insert(sessions).values({ id: `t2-${s.id}`, userId: s.id, expiresAt: new Date(Date.now() + 1e6) });
    await setUserActive(db, { id: s.id, active: false, actorId: admin.id });
    expect(await db.query.sessions.findFirst({ where: eq(sessions.userId, s.id) })).toBeUndefined();
    const board = await getLeaderboard(db, { kind: "period", period: "all" }, DEFAULT_SETTINGS);
    expect(board.some((r) => r.userId === s.id)).toBe(false);

    await expect(setUserActive(db, { id: admin.id, active: false, actorId: admin.id })).rejects.toThrow(UserAdminError);
    await expect(changeRole(db, { id: s.id, role: "admin", actorId: admin.id })).rejects.toThrow(/separate accounts/);
  });

  it("records attributed point adjustments and audits them", async () => {
    const leader = await makeStaff("leader");
    const s = await makeStudent();
    const row = await adjustPoints(db, { userId: s.id, amount: 50, reason: "Verse", note: "Psalm 23", actorId: leader.id });
    expect(row.createdBy).toBe(leader.id);
    expect(await getBalance(db, s.id)).toBe(50);
    const log = await db.query.auditLog.findFirst({ where: eq(auditLog.targetId, s.id) });
    expect(log?.action).toBe("points.adjusted");
    await expect(adjustPoints(db, { userId: leader.id, amount: 5, reason: "x", actorId: leader.id })).rejects.toThrow(/student/);
    await expect(adjustPoints(db, { userId: s.id, amount: 0, reason: "x", actorId: leader.id })).rejects.toThrow();
  });
});

describe("achievements and seasons", () => {
  it("awards point-threshold badges once, and revoking reverses the reward", async () => {
    const admin = await makeStaff();
    const [a] = await db
      .insert(achievements)
      .values({ key: `pts-${Date.now()}`, name: "Hundred", description: "100 points", criteria: { type: "total_points", threshold: 100 }, pointsReward: 15 })
      .returning();
    const s = await makeStudent();
    await adjustPoints(db, { userId: s.id, amount: 100, reason: "test", actorId: admin.id });
    // adjustPoints evaluates achievements itself
    expect(await getBalance(db, s.id)).toBe(115);
    const again = await db.transaction((tx) =>
      evaluateAchievements(tx, s.id, { current: 0, longest: 0, lastCompletedDay: null }),
    );
    expect(again).not.toContain("Hundred");

    const ua = await db.query.userAchievements.findFirst({ where: eq(userAchievements.achievementId, a.id) });
    await db.transaction((tx) => revokeAchievement(tx, { userAchievementId: ua!.id, actorId: admin.id, reason: "test" }));
    expect(await getBalance(db, s.id)).toBe(100);
    await db.update(achievements).set({ isActive: false }).where(eq(achievements.id, a.id));
  });

  it("finalizes a season and awards top-N badges to that season only", async () => {
    const admin = await makeStaff();
    const [top] = await db
      .insert(achievements)
      .values({ key: `top2-${Date.now()}`, name: "Top 2", description: "", criteria: { type: "season_rank", threshold: 2 } })
      .returning();
    const [a, b, c] = [await makeStudent("A"), await makeStudent("B"), await makeStudent("C")];
    const seasonId = await createSeason(db, {
      input: { name: "Test season", description: "", startsOn: "2000-01-01", endsOn: "2099-12-31", isActive: true },
      enrollAll: false,
      actorId: admin.id,
    });
    const { setSeasonParticipants } = await import("@/server/seasons");
    await setSeasonParticipants(db, { id: seasonId, userIds: [a.id, b.id, c.id], actorId: admin.id });
    await adjustPoints(db, { userId: a.id, amount: 30, reason: "x", actorId: admin.id });
    await adjustPoints(db, { userId: b.id, amount: 20, reason: "x", actorId: admin.id });
    await adjustPoints(db, { userId: c.id, amount: 10, reason: "x", actorId: admin.id });

    const awarded = await finalizeSeason(db, { id: seasonId, actorId: admin.id });
    expect(awarded).toBeGreaterThanOrEqual(2); // other active "top N" badges may also apply
    const winners = await db.query.userAchievements.findMany({ where: eq(userAchievements.achievementId, top.id) });
    expect(winners.map((w) => w.userId).sort()).toEqual([a.id, b.id].sort());
    expect(winners.every((w) => w.contextKey === `season:${seasonId}`)).toBe(true);
    await expect(finalizeSeason(db, { id: seasonId, actorId: admin.id })).rejects.toThrow(/already/);

    // Manual grant is idempotent per context.
    const first = await db.transaction((tx) => grantAchievement(tx, { userId: c.id, achievementId: top.id }));
    const second = await db.transaction((tx) => grantAchievement(tx, { userId: c.id, achievementId: top.id }));
    expect([first, second]).toEqual([true, false]);
    await db.update(achievements).set({ isActive: false }).where(eq(achievements.id, top.id));
  });
});

describe("bulk import", () => {
  it("generates unique usernames and is all-or-nothing", async () => {
    const { bulkCreateStudents, parseImportText, suggestUsername } = await import("@/server/users-admin");
    expect(suggestUsername("José M.")).toBe("josem");
    expect(suggestUsername("Al")).toBe("studental");
    const admin = await makeStaff();
    const tag = Date.now().toString(36);
    const lines = parseImportText(`Zed${tag}\n\nZed${tag}\nYan${tag}, yan${tag}`);
    expect(lines).toHaveLength(3);
    const created = await bulkCreateStudents(db, { lines, seasonIds: [], actorId: admin.id });
    expect(created.map((c) => c.username)).toEqual([`zed${tag}`, `zed${tag}2`, `yan${tag}`]);

    const before = (await db.select().from(users)).length;
    await expect(
      bulkCreateStudents(db, { lines: parseImportText(`Okay${tag}\nBad<name>`), seasonIds: [], actorId: admin.id }),
    ).rejects.toThrow(/Line 2/);
    expect((await db.select().from(users)).length).toBe(before);
  });
});

describe("personal data removal", () => {
  it("wipes identity, redacts audit details, keeps the ledger", async () => {
    const { removePersonalData } = await import("@/server/users-admin");
    const admin = await makeStaff();
    const { id } = await createUser(db, { username: `priv${Date.now()}`, displayName: "Private", role: "student", actorId: admin.id });
    await adjustPoints(db, { userId: id, amount: 40, reason: "Verse", actorId: admin.id });
    await expect(removePersonalData(db, { id, actorId: admin.id })).rejects.toThrow(/Deactivate/);
    await setUserActive(db, { id, active: false, actorId: admin.id });
    await removePersonalData(db, { id, actorId: admin.id });

    const u = await db.query.users.findFirst({ where: eq(users.id, id) });
    expect(u?.displayName).toBe("Former student");
    expect(u?.username).toMatch(/^removed-/);
    expect(await verifyPassword("anything", u!.passwordHash)).toBe(false);
    expect(await getBalance(db, id)).toBe(40);
    const logs = await db.query.auditLog.findMany({ where: eq(auditLog.targetId, id) });
    const created = logs.find((l) => l.action === "user.created");
    expect(created?.details).toEqual({ redacted: true });

    // Without the explicit flag, the audit log is still immutable.
    await expect(db.update(auditLog).set({ details: { redacted: true } }).where(eq(auditLog.id, logs[0].id))).rejects.toThrow();
  });
});

describe("quiz bonus edits", () => {
  it("re-grades submissions when the quiz bonus changes", async () => {
    const admin = await makeStaff();
    const { quizId } = await saveQuiz(db, { input: quizInputSchema.parse(baseQuiz()), actorId: admin.id, intent: "publish" });
    const quiz = await db.query.quizzes.findFirst({
      where: (q, { eq }) => eq(q.id, quizId),
      with: { questions: { with: { options: true } } },
    });
    const q = quiz!.questions[0];
    const s = await makeStudent();
    await submitQuiz(db, {
      userId: s.id,
      quizId,
      answers: [{ questionId: q.id, selectedOptionIds: [q.options.find((o) => o.isCorrect)!.id], textAnswer: null }],
      now: new Date(quiz!.opensAt.getTime() + 60_000),
    });
    const before = await getBalance(db, s.id);

    const withBonus = baseQuiz({ bonusPoints: 15, bonusCondition: "perfect" });
    withBonus.questions[0] = {
      ...withBonus.questions[0],
      id: q.id,
      sourceQuestionId: q.sourceQuestionId,
      saveToBank: false,
      options: q.options.map((o) => ({ id: o.id, label: o.label, isCorrect: o.isCorrect })),
    };
    const res = await saveQuiz(db, { quizId, input: quizInputSchema.parse(withBonus), actorId: admin.id, intent: "keep" });
    expect(res.regraded).toBe(1);
    expect(await getBalance(db, s.id)).toBe(before + 15);
  });
});
