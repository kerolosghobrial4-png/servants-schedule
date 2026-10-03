import "server-only";
import { and, desc, eq, inArray, isNotNull, like, sql } from "drizzle-orm";
import type { DbOrTx, Tx } from "@/db";
import { pointTransactions, type PointCategory } from "@/db/schema";

/**
 * The points ledger. Every change to a student's points is a new row with a
 * category, description and (for manual changes) the staff member who made
 * it. Rows are never updated or deleted — the database enforces that — so a
 * student's total is always SUM(amount) and fully explainable.
 */

export type NewPointTransaction = {
  userId: string;
  amount: number;
  category: PointCategory;
  description: string;
  sourceKey?: string | null;
  quizId?: string | null;
  submissionId?: string | null;
  reversesId?: string | null;
  note?: string | null;
  createdBy?: string | null;
  effectiveAt?: Date;
};

export async function recordPoints(db: DbOrTx, tx: NewPointTransaction) {
  if (!Number.isInteger(tx.amount) || tx.amount === 0) {
    throw new Error("Point transactions must be a non-zero whole number");
  }
  const [row] = await db
    .insert(pointTransactions)
    .values({
      userId: tx.userId,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      sourceKey: tx.sourceKey ?? null,
      quizId: tx.quizId ?? null,
      submissionId: tx.submissionId ?? null,
      reversesId: tx.reversesId ?? null,
      note: tx.note ?? null,
      createdBy: tx.createdBy ?? null,
      effectiveAt: tx.effectiveAt ?? new Date(),
    })
    .returning();
  return row;
}

/**
 * Serialises point work for one student inside a transaction so concurrent
 * requests (double taps, replayed requests) can't race each other.
 */
export async function lockUserLedger(tx: Tx, userId: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${"ledger:" + userId}))`);
}

export async function getBalance(db: DbOrTx, userId: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<string>`coalesce(sum(${pointTransactions.amount}), 0)` })
    .from(pointTransactions)
    .where(eq(pointTransactions.userId, userId));
  return Number(row.total);
}

export async function sumForSourceKey(db: DbOrTx, userId: string, sourceKey: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<string>`coalesce(sum(${pointTransactions.amount}), 0)` })
    .from(pointTransactions)
    .where(and(eq(pointTransactions.userId, userId), eq(pointTransactions.sourceKey, sourceKey)));
  return Number(row.total);
}

export async function hasSourceKey(db: DbOrTx, userId: string, sourceKey: string): Promise<boolean> {
  const row = await db.query.pointTransactions.findFirst({
    columns: { id: true },
    where: and(eq(pointTransactions.userId, userId), eq(pointTransactions.sourceKey, sourceKey)),
  });
  return !!row;
}

/** Source keys under a prefix that a staff member has manually reversed. */
export async function overriddenSourceKeys(db: DbOrTx, userId: string, prefix: string): Promise<Set<string>> {
  const reversed = await db
    .select({ sourceKey: pointTransactions.sourceKey })
    .from(pointTransactions)
    .where(
      and(
        eq(pointTransactions.userId, userId),
        like(pointTransactions.sourceKey, `${prefix}%`),
        sql`exists (select 1 from ${pointTransactions} r where r.reverses_id = ${pointTransactions.id})`,
      ),
    );
  return new Set(reversed.map((r) => r.sourceKey!).filter(Boolean));
}

export class LedgerError extends Error {}

/**
 * Reverses one ledger row by inserting an equal and opposite row that points
 * back to it. A row can only be reversed once (unique index), and reversal
 * rows themselves can't be reversed.
 */
export async function reverseTransaction(
  tx: Tx,
  opts: { transactionId: string; actorId: string; reason: string },
) {
  const original = await tx.query.pointTransactions.findFirst({
    where: eq(pointTransactions.id, opts.transactionId),
  });
  if (!original) throw new LedgerError("That point entry no longer exists.");
  if (original.category === "reversal") throw new LedgerError("A reversal can't itself be reversed.");
  await lockUserLedger(tx, original.userId);
  const already = await tx.query.pointTransactions.findFirst({
    columns: { id: true },
    where: eq(pointTransactions.reversesId, original.id),
  });
  if (already) throw new LedgerError("That entry has already been reversed.");

  return recordPoints(tx, {
    userId: original.userId,
    amount: -original.amount,
    category: "reversal",
    description: `Reversed: ${original.description}`,
    reversesId: original.id,
    quizId: original.quizId,
    note: opts.reason,
    createdBy: opts.actorId,
    effectiveAt: original.effectiveAt,
  });
}

export async function listTransactions(
  db: DbOrTx,
  opts: { userId?: string; userIds?: string[]; limit?: number; offset?: number; manualOnly?: boolean },
) {
  const where = [];
  if (opts.userId) where.push(eq(pointTransactions.userId, opts.userId));
  if (opts.userIds) where.push(inArray(pointTransactions.userId, opts.userIds));
  if (opts.manualOnly) where.push(isNotNull(pointTransactions.createdBy));
  return db.query.pointTransactions.findMany({
    where: where.length ? and(...where) : undefined,
    orderBy: [desc(pointTransactions.effectiveAt), desc(pointTransactions.createdAt)],
    limit: opts.limit ?? 50,
    offset: opts.offset ?? 0,
  });
}
