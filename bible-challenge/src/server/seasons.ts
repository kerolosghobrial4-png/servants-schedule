import "server-only";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { Database, DbOrTx } from "@/db";
import { achievements, seasonParticipants, seasons, users } from "@/db/schema";
import { isDateString } from "@/lib/time";
import { blockText, lineText } from "@/lib/validation";
import { grantAchievement } from "./achievements";
import { audit } from "./audit";
import { getLeaderboard } from "./leaderboard";
import { getSettings } from "./settings";

export class SeasonError extends Error {}

export const seasonInputSchema = z
  .object({
    name: lineText(80).pipe(z.string().min(1, "Name is required")),
    description: blockText(500).default(""),
    startsOn: z.string().refine(isDateString, "Pick a start date"),
    endsOn: z.string().refine(isDateString, "Pick an end date"),
    isActive: z.boolean(),
  })
  .refine((s) => s.endsOn >= s.startsOn, { path: ["endsOn"], message: "The season must end after it starts." });

export async function listSeasons(db: DbOrTx) {
  return db.query.seasons.findMany({ orderBy: [desc(seasons.startsOn)] });
}

export async function getSeason(db: DbOrTx, id: string) {
  return db.query.seasons.findFirst({ where: eq(seasons.id, id) });
}

export async function createSeason(
  database: Database,
  opts: { input: z.output<typeof seasonInputSchema>; enrollAll: boolean; actorId: string },
) {
  return database.transaction(async (tx) => {
    const [row] = await tx.insert(seasons).values(opts.input).returning();
    if (opts.enrollAll) {
      const students = await tx
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.role, "student"), eq(users.isActive, true)));
      if (students.length) await tx.insert(seasonParticipants).values(students.map((s) => ({ seasonId: row.id, userId: s.id })));
    }
    await audit(tx, { actorId: opts.actorId, action: "season.created", targetType: "season", targetId: row.id, details: { ...opts.input } });
    return row.id;
  });
}

export async function updateSeason(
  database: Database,
  opts: { id: string; input: z.output<typeof seasonInputSchema>; actorId: string },
) {
  await database.transaction(async (tx) => {
    const updated = await tx
      .update(seasons)
      .set({ ...opts.input, updatedAt: new Date() })
      .where(eq(seasons.id, opts.id))
      .returning({ id: seasons.id });
    if (!updated.length) throw new SeasonError("Season not found.");
    await audit(tx, { actorId: opts.actorId, action: "season.updated", targetType: "season", targetId: opts.id, details: { ...opts.input } });
  });
}

export async function setSeasonParticipants(database: Database, opts: { id: string; userIds: string[]; actorId: string }) {
  await database.transaction(async (tx) => {
    const valid = opts.userIds.length
      ? (
          await tx
            .select({ id: users.id })
            .from(users)
            .where(and(inArray(users.id, opts.userIds), eq(users.role, "student")))
        ).map((r) => r.id)
      : [];
    await tx.delete(seasonParticipants).where(eq(seasonParticipants.seasonId, opts.id));
    if (valid.length) await tx.insert(seasonParticipants).values(valid.map((userId) => ({ seasonId: opts.id, userId })));
    await audit(tx, {
      actorId: opts.actorId,
      action: "season.participants_set",
      targetType: "season",
      targetId: opts.id,
      details: { count: valid.length },
    });
  });
}

/**
 * Closes a season: awards any "finish in the top N" achievements based on
 * the final season standings, then marks it finalized and inactive.
 */
export async function finalizeSeason(database: Database, opts: { id: string; actorId: string }) {
  return database.transaction(async (tx) => {
    const season = await tx.query.seasons.findFirst({ where: eq(seasons.id, opts.id) });
    if (!season) throw new SeasonError("Season not found.");
    if (season.finalizedAt) throw new SeasonError("This season is already finalized.");
    const settings = await getSettings(tx);
    const board = await getLeaderboard(tx, { kind: "season", seasonId: season.id }, settings);
    const rankAchievements = (await tx.query.achievements.findMany({ where: eq(achievements.isActive, true) })).filter(
      (a) => a.criteria.type === "season_rank",
    );
    let awarded = 0;
    for (const a of rankAchievements) {
      const threshold = a.criteria.type === "season_rank" ? a.criteria.threshold : 0;
      for (const row of board.filter((r) => r.rank <= threshold && r.points > 0)) {
        if (
          await grantAchievement(tx, {
            userId: row.userId,
            achievementId: a.id,
            contextKey: `season:${season.id}`,
            awardedBy: opts.actorId,
            note: `${season.name} — finished #${row.rank}`,
          })
        )
          awarded++;
      }
    }
    await tx.update(seasons).set({ finalizedAt: new Date(), isActive: false, updatedAt: new Date() }).where(eq(seasons.id, season.id));
    await audit(tx, {
      actorId: opts.actorId,
      action: "season.finalized",
      targetType: "season",
      targetId: season.id,
      details: { awarded, top: board.slice(0, 3).map((r) => ({ userId: r.userId, rank: r.rank, points: r.points })) },
    });
    return awarded;
  });
}
