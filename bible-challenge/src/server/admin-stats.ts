import "server-only";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import type { Database } from "@/db";
import { pointTransactions, quizzes, submissions, users } from "@/db/schema";
import { dateInTz } from "@/lib/time";
import { getLeaderboard } from "./leaderboard";
import { getSettings } from "./settings";

export async function getAdminDashboard(database: Database, now = new Date()) {
  const settings = await getSettings(database);
  const today = dateInTz(now, settings.timezone);

  const activeStudents = await database
    .select({ id: users.id, displayName: users.displayName })
    .from(users)
    .where(and(eq(users.role, "student"), eq(users.isActive, true)))
    .orderBy(users.displayName);

  const todays = await database.query.quizzes.findMany({
    where: and(eq(quizzes.quizDate, today), eq(quizzes.status, "published")),
    orderBy: [quizzes.opensAt],
  });

  const todayQuizStats = [];
  for (const quiz of todays) {
    const subs = await database
      .select({
        userId: submissions.userId,
        correctCount: submissions.correctCount,
        questionCount: submissions.questionCount,
        submittedAt: submissions.submittedAt,
        status: submissions.status,
      })
      .from(submissions)
      .where(eq(submissions.quizId, quiz.id));
    const doneIds = new Set(subs.map((s) => s.userId));
    const byId = new Map(activeStudents.map((s) => [s.id, s.displayName]));
    const completed = subs
      .filter((s) => byId.has(s.userId))
      .map((s) => ({ ...s, displayName: byId.get(s.userId)! }))
      .sort((a, b) => +a.submittedAt - +b.submittedAt);
    const avg = completed.length
      ? completed.reduce((sum, s) => sum + (s.questionCount ? s.correctCount / s.questionCount : 0), 0) / completed.length
      : null;
    todayQuizStats.push({
      quiz,
      completed,
      notCompleted: activeStudents.filter((s) => !doneIds.has(s.id)),
      completionRate: activeStudents.length ? completed.length / activeStudents.length : 0,
      averageScore: avg,
    });
  }

  const [recentSubmissions, recentPoints, pendingReview, board] = await Promise.all([
    database
      .select({
        id: submissions.id,
        submittedAt: submissions.submittedAt,
        correctCount: submissions.correctCount,
        questionCount: submissions.questionCount,
        status: submissions.status,
        displayName: users.displayName,
        quizTitle: quizzes.title,
      })
      .from(submissions)
      .innerJoin(users, eq(users.id, submissions.userId))
      .innerJoin(quizzes, eq(quizzes.id, submissions.quizId))
      .orderBy(desc(submissions.submittedAt))
      .limit(8),
    database
      .select({
        id: pointTransactions.id,
        amount: pointTransactions.amount,
        description: pointTransactions.description,
        category: pointTransactions.category,
        createdAt: pointTransactions.createdAt,
        displayName: users.displayName,
        userId: users.id,
      })
      .from(pointTransactions)
      .innerJoin(users, eq(users.id, pointTransactions.userId))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(8),
    database.select({ n: count() }).from(submissions).where(eq(submissions.status, "pending_review")),
    getLeaderboard(database, { kind: "period", period: "month" }, settings, now),
  ]);

  return {
    settings,
    today,
    activeStudentCount: activeStudents.length,
    todayQuizStats,
    recentSubmissions,
    recentPoints,
    pendingReview: pendingReview[0]?.n ?? 0,
    board: board.slice(0, 10),
  };
}

export async function displayNames(database: Database, ids: string[]) {
  if (!ids.length) return new Map<string, string>();
  const rows = await database.select({ id: users.id, displayName: users.displayName }).from(users).where(inArray(users.id, ids));
  return new Map(rows.map((r) => [r.id, r.displayName]));
}
