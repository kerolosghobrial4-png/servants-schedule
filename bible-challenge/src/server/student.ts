import "server-only";
import { and, asc, desc, eq, gt, gte, inArray, lte, sql } from "drizzle-orm";
import type { Database } from "@/db";
import {
  achievements,
  pointTransactions,
  quizzes,
  seasonParticipants,
  seasons,
  submissions,
  userAchievements,
} from "@/db/schema";
import { addDays, dateInTz, periodWindow } from "@/lib/time";
import { getStudentStats, meetsCriteria } from "./achievements";
import { getBalance } from "./ledger";
import { getLeaderboard, pointsInWindow } from "./leaderboard";
import { getSettings, type AppSettings } from "./settings";
import { getStreak } from "./streaks";

/**
 * Read models for the student experience. Every function takes the viewer's
 * own id from the session — never from the URL — so students can only ever
 * load their own private data.
 */

export type StudentQuizCard = {
  id: string;
  title: string;
  passage: string;
  topic: string;
  quizDate: string;
  opensAt: Date;
  closesAt: Date;
  questionCount: number;
  status: "open" | "done" | "upcoming" | "missed" | "pending_review" | "revise";
  correctCount?: number;
};

/** Published quizzes visible to students: open now, upcoming (material only), and recent. */
export async function getStudentQuizzes(database: Database, userId: string, settings: AppSettings, now = new Date()) {
  const today = dateInTz(now, settings.timezone);
  const rows = await database
    .select({
      id: quizzes.id,
      title: quizzes.title,
      passage: quizzes.passage,
      topic: quizzes.topic,
      quizDate: quizzes.quizDate,
      opensAt: quizzes.opensAt,
      closesAt: quizzes.closesAt,
      questionCount: sql<number>`(select count(*)::int from quiz_questions qq where qq.quiz_id = "quizzes"."id")`,
    })
    .from(quizzes)
    .where(
      and(
        eq(quizzes.status, "published"),
        lte(quizzes.quizDate, addDays(today, 14)),
        gte(quizzes.quizDate, addDays(today, -60)),
      ),
    )
    .orderBy(desc(quizzes.quizDate), desc(quizzes.opensAt));

  const subs = rows.length
    ? await database
        .select({
          quizId: submissions.quizId,
          status: submissions.status,
          correctCount: submissions.correctCount,
          editAllowed: submissions.editAllowed,
        })
        .from(submissions)
        .where(and(eq(submissions.userId, userId), inArray(submissions.quizId, rows.map((r) => r.id))))
    : [];
  const subByQuiz = new Map(subs.map((s) => [s.quizId, s]));

  const cards: StudentQuizCard[] = rows.map((r) => {
    const sub = subByQuiz.get(r.id);
    let status: StudentQuizCard["status"];
    if (sub?.editAllowed) status = "revise";
    else if (sub) status = sub.status === "pending_review" ? "pending_review" : "done";
    else if (r.opensAt > now) status = "upcoming";
    else if (r.closesAt > now) status = "open";
    else status = "missed";
    return { ...r, status, correctCount: sub?.correctCount };
  });

  return {
    today,
    open: cards.filter((c) => c.status === "open" || c.status === "revise").sort((a, b) => +a.closesAt - +b.closesAt),
    upcoming: cards.filter((c) => c.status === "upcoming").sort((a, b) => +a.opensAt - +b.opensAt),
    past: cards.filter((c) => ["done", "missed", "pending_review"].includes(c.status)),
    todays: cards.filter((c) => c.quizDate === today),
  };
}

export async function getActiveSeason(database: Database, userId: string, today: string) {
  const rows = await database
    .select({ season: seasons, joined: seasonParticipants.userId })
    .from(seasons)
    .leftJoin(
      seasonParticipants,
      and(eq(seasonParticipants.seasonId, seasons.id), eq(seasonParticipants.userId, userId)),
    )
    .where(and(eq(seasons.isActive, true), lte(seasons.startsOn, today), gte(seasons.endsOn, today)))
    .orderBy(asc(seasons.endsOn));
  const mine = rows.find((r) => r.joined) ?? rows[0];
  return mine ? { ...mine.season, isParticipant: !!mine.joined } : null;
}

export async function getDashboard(database: Database, userId: string, now = new Date()) {
  const settings = await getSettings(database);
  const tz = settings.timezone;
  const week = periodWindow("week", tz, settings.weekStartsOn, now);

  const [total, weekPoints, streak, monthBoard, quizData, recent] = await Promise.all([
    getBalance(database, userId),
    pointsInWindow(database, userId, week.start, week.end),
    getStreak(database, userId, { tz, weekendsCount: settings.streak.weekendsCount, now }),
    getLeaderboard(database, { kind: "period", period: "month" }, settings, now),
    getStudentQuizzes(database, userId, settings, now),
    database.query.pointTransactions.findMany({
      where: eq(pointTransactions.userId, userId),
      orderBy: [desc(pointTransactions.createdAt)],
      limit: 6,
    }),
  ]);

  const season = await getActiveSeason(database, userId, quizData.today);
  let seasonStanding: { rank: number | null; of: number; points: number } | null = null;
  if (season?.isParticipant) {
    const board = await getLeaderboard(database, { kind: "season", seasonId: season.id }, settings, now);
    const me = board.find((r) => r.userId === userId);
    seasonStanding = { rank: me?.rank ?? null, of: board.length, points: me?.points ?? 0 };
  }

  const nextAchievement = await getNextAchievement(database, userId, streak);
  const monthMe = monthBoard.find((r) => r.userId === userId);

  return {
    settings,
    total,
    weekPoints,
    streak,
    monthRank: monthMe?.rank ?? null,
    monthPoints: monthMe?.points ?? 0,
    boardSize: monthBoard.length,
    boardPreview: previewAround(monthBoard, userId),
    quizzes: quizData,
    recent,
    season,
    seasonStanding,
    nextAchievement,
  };
}

/** Top five, plus the viewer's own row if they're further down. */
export function previewAround<T extends { userId: string }>(board: T[], userId: string, top = 5) {
  const head = board.slice(0, top);
  if (head.some((r) => r.userId === userId)) return { rows: head, detached: false };
  const me = board.find((r) => r.userId === userId);
  return me ? { rows: [...head, me], detached: true } : { rows: head, detached: false };
}

async function getNextAchievement(
  database: Database,
  userId: string,
  streak: Awaited<ReturnType<typeof getStreak>>,
) {
  const all = await database.query.achievements.findMany({
    where: eq(achievements.isActive, true),
    orderBy: [asc(achievements.position)],
  });
  const owned = new Set(
    (await database.select({ id: userAchievements.achievementId }).from(userAchievements).where(eq(userAchievements.userId, userId))).map(
      (r) => r.id,
    ),
  );
  const stats = await getStudentStats(database, userId, streak);
  const candidates = all
    .filter((a) => !owned.has(a.id) && "threshold" in a.criteria && a.criteria.type !== "season_rank")
    .map((a) => {
      const c = a.criteria as { type: "quizzes_completed" | "perfect_quizzes" | "streak" | "total_points"; threshold: number };
      const current =
        c.type === "quizzes_completed"
          ? stats.quizzesCompleted
          : c.type === "perfect_quizzes"
            ? stats.perfectQuizzes
            : c.type === "streak"
              ? streak.current
              : stats.totalPoints;
      return { achievement: a, current: Math.min(current, c.threshold), target: c.threshold };
    })
    .filter((x) => !meetsCriteria(x.achievement.criteria, stats))
    .sort((a, b) => b.current / b.target - a.current / a.target);
  return candidates[0] ?? null;
}

export async function getProfile(database: Database, userId: string) {
  const settings = await getSettings(database);
  const streak = await getStreak(database, userId, {
    tz: settings.timezone,
    weekendsCount: settings.streak.weekendsCount,
  });
  const [stats, allTimeBoard, earned] = await Promise.all([
    getStudentStats(database, userId, streak),
    getLeaderboard(database, { kind: "period", period: "all" }, settings),
    database
      .select({
        id: userAchievements.id,
        awardedAt: userAchievements.awardedAt,
        contextKey: userAchievements.contextKey,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.awardedAt)),
  ]);
  const allAchievements = await database.query.achievements.findMany({
    where: eq(achievements.isActive, true),
    orderBy: [asc(achievements.position)],
  });
  const me = allTimeBoard.find((r) => r.userId === userId);
  return {
    settings,
    streak,
    stats,
    rank: me?.rank ?? null,
    boardSize: allTimeBoard.length,
    earned,
    allAchievements,
  };
}

export async function getQuizHistory(database: Database, userId: string) {
  return database
    .select({
      submissionId: submissions.id,
      quizId: quizzes.id,
      title: quizzes.title,
      passage: quizzes.passage,
      quizDate: quizzes.quizDate,
      submittedAt: submissions.submittedAt,
      status: submissions.status,
      correctCount: submissions.correctCount,
      questionCount: submissions.questionCount,
      earned: sql<string>`coalesce((select sum(pt.amount) from point_transactions pt where pt.user_id = ${userId} and pt.quiz_id = "quizzes"."id"), 0)`,
    })
    .from(submissions)
    .innerJoin(quizzes, eq(quizzes.id, submissions.quizId))
    .where(eq(submissions.userId, userId))
    .orderBy(desc(quizzes.quizDate), desc(submissions.submittedAt));
}

export async function getPointHistory(database: Database, userId: string, limit = 300) {
  return database.query.pointTransactions.findMany({
    where: eq(pointTransactions.userId, userId),
    orderBy: [desc(pointTransactions.effectiveAt), desc(pointTransactions.createdAt)],
    limit,
    columns: {
      id: true,
      amount: true,
      category: true,
      description: true,
      effectiveAt: true,
      createdAt: true,
    },
  });
}

/** Study material that is visible now: open or upcoming within two weeks. */
export async function getStudyMaterial(database: Database, settings: AppSettings, now = new Date()) {
  const today = dateInTz(now, settings.timezone);
  return database
    .select({
      id: quizzes.id,
      title: quizzes.title,
      passage: quizzes.passage,
      topic: quizzes.topic,
      studyNotes: quizzes.studyNotes,
      quizDate: quizzes.quizDate,
      opensAt: quizzes.opensAt,
      closesAt: quizzes.closesAt,
    })
    .from(quizzes)
    .where(
      and(
        eq(quizzes.status, "published"),
        gt(quizzes.closesAt, now),
        lte(quizzes.quizDate, addDays(today, 14)),
      ),
    )
    .orderBy(asc(quizzes.quizDate), asc(quizzes.opensAt));
}
