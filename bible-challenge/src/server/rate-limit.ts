import "server-only";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import type { DbOrTx } from "@/db";
import { loginAttempts } from "@/db/schema";

/**
 * Database-backed attempt counting, so limits hold across server instances
 * and restarts. Failures are counted since the most recent success within the
 * window.
 */
export const LIMITS = {
  user: { max: 5, windowMs: 15 * 60 * 1000 },
  ip: { max: 30, windowMs: 15 * 60 * 1000 },
  totp: { max: 5, windowMs: 15 * 60 * 1000 },
  password: { max: 5, windowMs: 15 * 60 * 1000 },
} as const;

export async function recentFailures(db: DbOrTx, key: string, windowMs: number): Promise<number> {
  const since = new Date(Date.now() - windowMs);
  const [row] = await db
    .select({
      failures: sql<string>`count(*) filter (where not ${loginAttempts.success} and ${loginAttempts.createdAt} > coalesce(
        (select max(la.created_at) from ${loginAttempts} la where la.key = ${key} and la.success), 'epoch'::timestamptz))`,
    })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gt(loginAttempts.createdAt, since)));
  return Number(row?.failures ?? 0);
}

export async function isLimited(db: DbOrTx, key: string, limit: { max: number; windowMs: number }) {
  return (await recentFailures(db, key, limit.windowMs)) >= limit.max;
}

export async function recordAttempt(db: DbOrTx, key: string, success: boolean) {
  await db.insert(loginAttempts).values({ key, success });
  if (Math.random() < 0.05) {
    await db.delete(loginAttempts).where(lt(loginAttempts.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
  }
}
