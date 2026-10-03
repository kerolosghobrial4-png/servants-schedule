import "server-only";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { DbOrTx } from "@/db";
import { settings } from "@/db/schema";
import { isValidTimeZone } from "@/lib/time";

/**
 * All tunable rules live in one validated settings document so leaders can
 * change point values, streak rules and the group's time zone without a deploy.
 */
export const appSettingsSchema = z.object({
  groupName: z.string().trim().min(1).max(60).default("Bible Challenge"),
  timezone: z
    .string()
    .refine(isValidTimeZone, "Unknown time zone")
    .default("America/New_York"),
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn: z.number().int().min(0).max(6).default(0),
  points: z
    .object({
      defaultQuestion: z.number().int().min(0).max(1000).default(10),
      participation: z.number().int().min(0).max(1000).default(5),
      completion: z.number().int().min(0).max(1000).default(10),
      perfect: z.number().int().min(0).max(1000).default(20),
    })
    .default({ defaultQuestion: 10, participation: 5, completion: 10, perfect: 20 }),
  streak: z
    .object({
      weekendsCount: z.boolean().default(true),
      /** Award a streak bonus every N consecutive quiz days (0 disables). */
      bonusEvery: z.number().int().min(0).max(365).default(7),
      bonusPoints: z.number().int().min(0).max(1000).default(25),
    })
    .default({ weekendsCount: true, bonusEvery: 7, bonusPoints: 25 }),
  leaderboard: z
    .object({
      defaultPeriod: z.enum(["week", "month", "all", "season"]).default("month"),
      showStreaks: z.boolean().default(true),
    })
    .default({ defaultPeriod: "month", showStreaks: true }),
  security: z
    .object({
      /** Require leaders/admins to use an authenticator app. */
      requireStaffTwoFactor: z.boolean().default(false),
    })
    .default({ requireStaffTwoFactor: false }),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;

export const DEFAULT_SETTINGS: AppSettings = appSettingsSchema.parse({});

const KEY = "app";

export async function getSettings(db: DbOrTx): Promise<AppSettings> {
  const row = await db.query.settings.findFirst({ where: eq(settings.key, KEY) });
  if (!row) return DEFAULT_SETTINGS;
  const parsed = appSettingsSchema.safeParse(row.value);
  // A corrupt document should never take the app down; fall back to defaults.
  return parsed.success ? parsed.data : DEFAULT_SETTINGS;
}

export async function saveSettings(db: DbOrTx, value: AppSettings, actorId: string | null) {
  const parsed = appSettingsSchema.parse(value);
  await db
    .insert(settings)
    .values({ key: KEY, value: parsed, updatedBy: actorId })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: parsed, updatedBy: actorId, updatedAt: new Date() },
    });
  return parsed;
}

/** Point rules frozen onto a submission so later setting changes never rewrite history. */
export type AwardRules = AppSettings["points"];
