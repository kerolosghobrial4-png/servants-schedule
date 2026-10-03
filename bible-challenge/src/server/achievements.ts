import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import type { DbOrTx, Tx } from "@/db";
import { achievements, submissions, userAchievements, type AchievementCriteria } from "@/db/schema";
import { getBalance, hasSourceKey, recordPoints } from "./ledger";
import type { StreakResult } from "./streaks";

/**
 * Data-driven badges. Each achievement row carries its own criteria, so new
 * ones can be added from the admin panel without code changes.
 */

export const ACHIEVEMENT_ICONS = ["step", "target", "flame", "book", "trophy", "star", "crown", "scroll", "shield", "cross"] as const;
export type AchievementIcon = (typeof ACHIEVEMENT_ICONS)[number];

export const CRITERIA_LABELS: Record<AchievementCriteria["type"], string> = {
  quizzes_completed: "Quizzes completed",
  perfect_quizzes: "Perfect quizzes",
  streak: "Streak length (days)",
  total_points: "Total points",
  season_rank: "Finish a season in the top N",
  manual: "Awarded by a leader",
};

export const DEFAULT_ACHIEVEMENTS: {
  key: string;
  name: string;
  description: string;
  icon: AchievementIcon;
  criteria: AchievementCriteria;
}[] = [
  { key: "first-step", name: "First Step", description: "Complete your first Bible quiz", icon: "step", criteria: { type: "quizzes_completed", threshold: 1 } },
  { key: "perfect", name: "Perfect", description: "Score 100% on a quiz", icon: "target", criteria: { type: "perfect_quizzes", threshold: 1 } },
  { key: "on-fire", name: "On Fire", description: "Reach a 7-day streak", icon: "flame", criteria: { type: "streak", threshold: 7 } },
  { key: "bible-scholar", name: "Bible Scholar", description: "Complete 25 quizzes", icon: "book", criteria: { type: "quizzes_completed", threshold: 25 } },
  { key: "sharpshooter", name: "Sharpshooter", description: "Score 100% on 10 quizzes", icon: "shield", criteria: { type: "perfect_quizzes", threshold: 10 } },
  { key: "unbroken", name: "Unbroken", description: "Reach a 30-day streak", icon: "cross", criteria: { type: "streak", threshold: 30 } },
  { key: "top-3", name: "Top 3", description: "Finish a competition season in the top three", icon: "trophy", criteria: { type: "season_rank", threshold: 3 } },
  { key: "verse-keeper", name: "Verse Keeper", description: "Recognised by a leader for memorising Scripture", icon: "scroll", criteria: { type: "manual" } },
];

export type StudentStats = {
  quizzesCompleted: number;
  perfectQuizzes: number;
  totalPoints: number;
  longestStreak: number;
};

export async function getStudentStats(db: DbOrTx, userId: string, streak: StreakResult): Promise<StudentStats> {
  const [row] = await db
    .select({
      completed: sql<string>`count(*) filter (where ${submissions.answeredCount} > 0)`,
      perfect: sql<string>`count(*) filter (where ${submissions.questionCount} > 0 and ${submissions.correctCount} = ${submissions.questionCount})`,
    })
    .from(submissions)
    .where(eq(submissions.userId, userId));
  return {
    quizzesCompleted: Number(row.completed),
    perfectQuizzes: Number(row.perfect),
    totalPoints: await getBalance(db, userId),
    longestStreak: streak.longest,
  };
}

export function meetsCriteria(criteria: AchievementCriteria, stats: StudentStats): boolean {
  switch (criteria.type) {
    case "quizzes_completed":
      return stats.quizzesCompleted >= criteria.threshold;
    case "perfect_quizzes":
      return stats.perfectQuizzes >= criteria.threshold;
    case "streak":
      return stats.longestStreak >= criteria.threshold;
    case "total_points":
      return stats.totalPoints >= criteria.threshold;
    default:
      return false; // season_rank and manual are awarded explicitly
  }
}

/** Insert the badge (idempotent) and pay any point reward through the ledger. */
export async function grantAchievement(
  tx: Tx,
  opts: { userId: string; achievementId: string; contextKey?: string; awardedBy?: string | null; note?: string | null },
): Promise<boolean> {
  const contextKey = opts.contextKey ?? "";
  const inserted = await tx
    .insert(userAchievements)
    .values({
      userId: opts.userId,
      achievementId: opts.achievementId,
      contextKey,
      awardedBy: opts.awardedBy ?? null,
      note: opts.note ?? null,
    })
    .onConflictDoNothing()
    .returning({ id: userAchievements.id });
  if (inserted.length === 0) return false;

  const achievement = await tx.query.achievements.findFirst({ where: eq(achievements.id, opts.achievementId) });
  if (achievement && achievement.pointsReward !== 0) {
    const sourceKey = `achievement:${achievement.id}:${contextKey}`;
    if (!(await hasSourceKey(tx, opts.userId, sourceKey))) {
      await recordPoints(tx, {
        userId: opts.userId,
        amount: achievement.pointsReward,
        category: "achievement",
        description: `Achievement: ${achievement.name}`,
        sourceKey,
        createdBy: opts.awardedBy ?? null,
      });
    }
  }
  return true;
}

/** Checks every automatic achievement for one student. Returns newly earned names. */
export async function evaluateAchievements(tx: Tx, userId: string, streak: StreakResult): Promise<string[]> {
  const all = await tx.query.achievements.findMany({
    where: eq(achievements.isActive, true),
    orderBy: [asc(achievements.position)],
  });
  const automatic = all.filter((a) => !["manual", "season_rank"].includes(a.criteria.type));
  if (automatic.length === 0) return [];

  const owned = new Set(
    (
      await tx
        .select({ id: userAchievements.achievementId })
        .from(userAchievements)
        .where(and(eq(userAchievements.userId, userId), eq(userAchievements.contextKey, "")))
    ).map((r) => r.id),
  );
  const pending = automatic.filter((a) => !owned.has(a.id));
  if (pending.length === 0) return [];

  const stats = await getStudentStats(tx, userId, streak);
  const earned: string[] = [];
  for (const a of pending) {
    if (meetsCriteria(a.criteria, stats) && (await grantAchievement(tx, { userId, achievementId: a.id }))) {
      earned.push(a.name);
    }
  }
  return earned;
}
