import "server-only";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import type { DbOrTx } from "@/db";
import { pointTransactions, seasonParticipants, seasons, users } from "@/db/schema";
import { dateRangeWindow, periodWindow, type Period } from "@/lib/time";
import type { AppSettings } from "./settings";
import { getStreaks } from "./streaks";

/**
 * Leaderboards only ever expose id (for "is this me"), display name, points,
 * rank and streak. No usernames or other account data leave this module.
 */
export type LeaderboardRow = {
  userId: string;
  displayName: string;
  points: number;
  rank: number;
  streak: number;
};

export type LeaderboardScope =
  | { kind: "period"; period: Period }
  | { kind: "season"; seasonId: string };

/** Standard competition ranking: 1, 2, 2, 4. */
export function assignRanks<T extends { points: number }>(rows: T[]): (T & { rank: number })[] {
  let rank = 0;
  let prevPoints: number | null = null;
  return rows.map((row, i) => {
    if (prevPoints === null || row.points !== prevPoints) rank = i + 1;
    prevPoints = row.points;
    return { ...row, rank };
  });
}

export async function getLeaderboard(
  db: DbOrTx,
  scope: LeaderboardScope,
  settings: AppSettings,
  now = new Date(),
): Promise<LeaderboardRow[]> {
  let window: { start: Date | null; end: Date | null };
  let seasonId: string | null = null;
  if (scope.kind === "season") {
    const season = await db.query.seasons.findFirst({ where: eq(seasons.id, scope.seasonId) });
    if (!season) return [];
    seasonId = season.id;
    window = dateRangeWindow(season.startsOn, season.endsOn, settings.timezone);
  } else {
    window = periodWindow(scope.period, settings.timezone, settings.weekStartsOn, now);
  }

  const joinConds = [eq(pointTransactions.userId, users.id)];
  if (window.start) joinConds.push(gte(pointTransactions.effectiveAt, window.start));
  if (window.end) joinConds.push(lt(pointTransactions.effectiveAt, window.end));

  const base = db
    .select({
      userId: users.id,
      displayName: users.displayName,
      points: sql<string>`coalesce(sum(${pointTransactions.amount}), 0)`,
    })
    .from(users)
    .leftJoin(pointTransactions, and(...joinConds));

  const filtered = seasonId
    ? base.innerJoin(
        seasonParticipants,
        and(eq(seasonParticipants.userId, users.id), eq(seasonParticipants.seasonId, seasonId)),
      )
    : base;

  const rows = await filtered
    .where(and(eq(users.role, "student"), eq(users.isActive, true)))
    .groupBy(users.id, users.displayName)
    .orderBy(sql`coalesce(sum(${pointTransactions.amount}), 0) desc`, users.displayName);

  const streaks = await getStreaks(
    db,
    rows.map((r) => r.userId),
    { tz: settings.timezone, weekendsCount: settings.streak.weekendsCount, now },
  );

  return assignRanks(
    rows.map((r) => ({
      userId: r.userId,
      displayName: r.displayName,
      points: Number(r.points),
      streak: streaks.get(r.userId)?.current ?? 0,
    })),
  );
}

export async function getRank(
  db: DbOrTx,
  userId: string,
  scope: LeaderboardScope,
  settings: AppSettings,
): Promise<{ rank: number | null; of: number; points: number }> {
  const board = await getLeaderboard(db, scope, settings);
  const row = board.find((r) => r.userId === userId);
  return { rank: row?.rank ?? null, of: board.length, points: row?.points ?? 0 };
}

/** Points per student within a window — used for "points this week". */
export async function pointsInWindow(db: DbOrTx, userId: string, start: Date | null, end: Date | null) {
  const conds = [eq(pointTransactions.userId, userId)];
  if (start) conds.push(gte(pointTransactions.effectiveAt, start));
  if (end) conds.push(lt(pointTransactions.effectiveAt, end));
  const [row] = await db
    .select({ total: sql<string>`coalesce(sum(${pointTransactions.amount}), 0)` })
    .from(pointTransactions)
    .where(and(...conds));
  return Number(row.total);
}
