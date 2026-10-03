import "server-only";
import { and, asc, count, desc, eq, ilike, inArray, isNotNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { Database, DbOrTx } from "@/db";
import { pointTransactions, seasonParticipants, seasons, sessions, submissions, users, type Role } from "@/db/schema";
import { STAFF_MIN_PASSWORD, generateTemporaryPassword, hashPassword } from "@/lib/auth/password";
import { displayNameSchema, usernameSchema } from "@/lib/validation";
import { audit } from "./audit";
import { recordPoints, reverseTransaction, lockUserLedger, LedgerError } from "./ledger";
import { evaluateAchievements } from "./achievements";
import { getSettings } from "./settings";
import { getStreak, getStreaks } from "./streaks";

export class UserAdminError extends Error {}

async function usernameTaken(database: Database, username: string, exceptId?: string) {
  const row = await database.query.users.findFirst({
    columns: { id: true },
    where: sql`lower(${users.username}) = ${username.toLowerCase()}`,
  });
  return !!row && row.id !== exceptId;
}

export async function listStudents(database: Database, opts: { status: "active" | "inactive" | "all"; q?: string }) {
  const where = [eq(users.role, "student")];
  if (opts.status === "active") where.push(eq(users.isActive, true));
  if (opts.status === "inactive") where.push(eq(users.isActive, false));
  if (opts.q) {
    const like = `%${opts.q.replace(/[%_\\]/g, "\\$&")}%`;
    where.push(or(ilike(users.displayName, like), ilike(users.username, like))!);
  }
  const rows = await database
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
      points: sql<string>`coalesce((select sum(pt.amount) from point_transactions pt where pt.user_id = "users"."id"), 0)`,
      quizzes: sql<string>`(select count(*) from submissions s where s.user_id = "users"."id")`,
    })
    .from(users)
    .where(and(...where))
    .orderBy(asc(users.displayName));
  const settings = await getSettings(database);
  const streaks = await getStreaks(
    database,
    rows.map((r) => r.id),
    { tz: settings.timezone, weekendsCount: settings.streak.weekendsCount },
  );
  return rows.map((r) => ({
    ...r,
    points: Number(r.points),
    quizzes: Number(r.quizzes),
    streak: streaks.get(r.id)?.current ?? 0,
  }));
}

export async function getStudentDetail(database: Database, id: string) {
  const user = await database.query.users.findFirst({
    where: and(eq(users.id, id), eq(users.role, "student")),
    columns: { passwordHash: false, totpSecret: false },
  });
  if (!user) return null;
  const settings = await getSettings(database);
  const [streak, seasonRows] = await Promise.all([
    getStreak(database, id, { tz: settings.timezone, weekendsCount: settings.streak.weekendsCount }),
    database.select({ seasonId: seasonParticipants.seasonId }).from(seasonParticipants).where(eq(seasonParticipants.userId, id)),
  ]);
  return { user, streak, seasonIds: seasonRows.map((r) => r.seasonId), settings };
}

export async function createUser(
  database: Database,
  opts: {
    username: string;
    displayName: string;
    role: Role;
    password?: string;
    seasonIds?: string[];
    actorId: string;
  },
): Promise<{ id: string; temporaryPassword: string | null }> {
  if (await usernameTaken(database, opts.username)) throw new UserAdminError("That username is already taken.");
  const temporaryPassword = opts.password ? null : generateTemporaryPassword();
  if (opts.password && opts.role !== "student" && opts.password.length < STAFF_MIN_PASSWORD) {
    throw new UserAdminError(`Staff passwords need at least ${STAFF_MIN_PASSWORD} characters.`);
  }
  const passwordHash = await hashPassword(opts.password ?? temporaryPassword!);
  return database.transaction(async (tx) => {
    const [row] = await tx
      .insert(users)
      .values({
        username: opts.username,
        displayName: opts.displayName,
        role: opts.role,
        passwordHash,
        // Leader-chosen or generated passwords are always temporary.
        mustChangePassword: true,
      })
      .returning({ id: users.id });
    if (opts.role === "student" && opts.seasonIds?.length) {
      const valid = await tx.select({ id: seasons.id }).from(seasons).where(inArray(seasons.id, opts.seasonIds));
      if (valid.length) {
        await tx.insert(seasonParticipants).values(valid.map((s) => ({ seasonId: s.id, userId: row.id })));
      }
    }
    await audit(tx, {
      actorId: opts.actorId,
      action: "user.created",
      targetType: "user",
      targetId: row.id,
      details: { username: opts.username, displayName: opts.displayName, role: opts.role },
    });
    return { id: row.id, temporaryPassword };
  });
}

export async function updateUserProfile(
  database: Database,
  opts: { id: string; username: string; displayName: string; actorId: string },
) {
  const user = await database.query.users.findFirst({ where: eq(users.id, opts.id) });
  if (!user) throw new UserAdminError("User not found.");
  if (await usernameTaken(database, opts.username, opts.id)) throw new UserAdminError("That username is already taken.");
  await database.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ username: opts.username, displayName: opts.displayName, updatedAt: new Date() })
      .where(eq(users.id, opts.id));
    await audit(tx, {
      actorId: opts.actorId,
      action: "user.updated",
      targetType: "user",
      targetId: opts.id,
      details: {
        from: { username: user.username, displayName: user.displayName },
        to: { username: opts.username, displayName: opts.displayName },
      },
    });
  });
}

/** Deactivation is a soft delete: history, points and submissions are kept. */
export async function setUserActive(database: Database, opts: { id: string; active: boolean; actorId: string }) {
  if (opts.id === opts.actorId && !opts.active) throw new UserAdminError("You can't deactivate your own account.");
  await database.transaction(async (tx) => {
    const user = await tx.query.users.findFirst({ where: eq(users.id, opts.id) });
    if (!user) throw new UserAdminError("User not found.");
    if (!opts.active && user.role === "admin") await assertAnotherAdmin(tx, user.id);
    await tx
      .update(users)
      .set({ isActive: opts.active, deactivatedAt: opts.active ? null : new Date(), updatedAt: new Date() })
      .where(eq(users.id, opts.id));
    if (!opts.active) await tx.delete(sessions).where(eq(sessions.userId, opts.id));
    await audit(tx, {
      actorId: opts.actorId,
      action: opts.active ? "user.reactivated" : "user.deactivated",
      targetType: "user",
      targetId: opts.id,
    });
  });
}

/** Issues a one-time temporary password and signs the user out everywhere. */
export async function resetUserPassword(database: Database, opts: { id: string; actorId: string }) {
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  await database.transaction(async (tx) => {
    const updated = await tx
      .update(users)
      .set({ passwordHash, mustChangePassword: true, updatedAt: new Date() })
      .where(eq(users.id, opts.id))
      .returning({ id: users.id });
    if (!updated.length) throw new UserAdminError("User not found.");
    await tx.delete(sessions).where(eq(sessions.userId, opts.id));
    await audit(tx, { actorId: opts.actorId, action: "user.password_reset", targetType: "user", targetId: opts.id });
  });
  return temporaryPassword;
}

export async function setStudentSeasons(database: Database, opts: { id: string; seasonIds: string[]; actorId: string }) {
  await database.transaction(async (tx) => {
    const valid = opts.seasonIds.length
      ? (await tx.select({ id: seasons.id }).from(seasons).where(inArray(seasons.id, opts.seasonIds))).map((s) => s.id)
      : [];
    const current = (
      await tx.select({ id: seasonParticipants.seasonId }).from(seasonParticipants).where(eq(seasonParticipants.userId, opts.id))
    ).map((r) => r.id);
    const toAdd = valid.filter((id) => !current.includes(id));
    const toRemove = current.filter((id) => !valid.includes(id));
    if (toAdd.length) await tx.insert(seasonParticipants).values(toAdd.map((seasonId) => ({ seasonId, userId: opts.id })));
    if (toRemove.length) {
      await tx
        .delete(seasonParticipants)
        .where(and(eq(seasonParticipants.userId, opts.id), inArray(seasonParticipants.seasonId, toRemove)));
    }
    await audit(tx, {
      actorId: opts.actorId,
      action: "user.seasons_changed",
      targetType: "user",
      targetId: opts.id,
      details: { added: toAdd, removed: toRemove },
    });
  });
}

async function assertAnotherAdmin(database: DbOrTx, exceptId: string) {
  const [row] = await database
    .select({ n: count() })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.isActive, true), sql`${users.id} <> ${exceptId}`));
  if ((row?.n ?? 0) === 0) throw new UserAdminError("There must always be at least one active admin.");
}

export async function changeRole(database: Database, opts: { id: string; role: Role; actorId: string }) {
  const user = await database.query.users.findFirst({ where: eq(users.id, opts.id) });
  if (!user) throw new UserAdminError("User not found.");
  if (user.role === opts.role) return;
  if (user.role === "student" || opts.role === "student") {
    // Keeps leaderboards and ledgers clean: students and staff are separate accounts.
    throw new UserAdminError("Students and staff use separate accounts. Create a new staff account instead.");
  }
  if (user.role === "admin") await assertAnotherAdmin(database, user.id);
  await database.transaction(async (tx) => {
    await tx.update(users).set({ role: opts.role, updatedAt: new Date() }).where(eq(users.id, opts.id));
    await tx.delete(sessions).where(eq(sessions.userId, opts.id));
    await audit(tx, {
      actorId: opts.actorId,
      action: "user.role_changed",
      targetType: "user",
      targetId: opts.id,
      details: { from: user.role, to: opts.role },
    });
  });
}

export async function listStaff(database: Database) {
  return database
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      role: users.role,
      isActive: users.isActive,
      totpEnabled: users.totpEnabled,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .where(inArray(users.role, ["leader", "admin"]))
    .orderBy(asc(users.displayName));
}

/* ------------------------------ points ------------------------------ */

/**
 * A manual adjustment is always a new, attributed ledger row. `reason` is
 * shown to the student; `note` is for leaders only.
 */
export async function adjustPoints(
  database: Database,
  opts: { userId: string; amount: number; reason: string; note?: string | null; actorId: string },
) {
  if (!Number.isInteger(opts.amount) || opts.amount === 0) throw new UserAdminError("Enter a non-zero whole number.");
  if (Math.abs(opts.amount) > 10_000) throw new UserAdminError("That's an unusually large adjustment. Use 10,000 or less.");
  return database.transaction(async (tx) => {
    const student = await tx.query.users.findFirst({ where: eq(users.id, opts.userId) });
    if (!student || student.role !== "student") throw new UserAdminError("Points can only be given to student accounts.");
    await lockUserLedger(tx, student.id);
    const row = await recordPoints(tx, {
      userId: student.id,
      amount: opts.amount,
      category: "admin_adjustment",
      description: opts.reason,
      note: opts.note || null,
      createdBy: opts.actorId,
    });
    await audit(tx, {
      actorId: opts.actorId,
      action: "points.adjusted",
      targetType: "user",
      targetId: student.id,
      details: { amount: opts.amount, reason: opts.reason, note: opts.note ?? null, transactionId: row.id },
    });
    const settings = await getSettings(tx);
    const streak = await getStreak(tx, student.id, { tz: settings.timezone, weekendsCount: settings.streak.weekendsCount });
    await evaluateAchievements(tx, student.id, streak);
    return row;
  });
}

export async function reversePoints(database: Database, opts: { transactionId: string; reason: string; actorId: string }) {
  try {
    return await database.transaction(async (tx) => {
      const row = await reverseTransaction(tx, opts);
      await audit(tx, {
        actorId: opts.actorId,
        action: "points.reversed",
        targetType: "user",
        targetId: row.userId,
        details: { reversedTransactionId: opts.transactionId, amount: row.amount, reason: opts.reason },
      });
      return row;
    });
  } catch (err) {
    if (err instanceof LedgerError) throw new UserAdminError(err.message);
    throw err;
  }
}

export async function studentSubmissions(database: Database, userId: string) {
  return database.query.submissions.findMany({
    where: eq(submissions.userId, userId),
    with: { quiz: { columns: { id: true, title: true, quizDate: true } } },
    orderBy: (s, { desc }) => [desc(s.submittedAt)],
  });
}

/** Ledger rows with the staff member who made each manual change. */
export async function ledgerWithActors(database: Database, opts: { userId?: string; limit?: number; offset?: number; manualOnly?: boolean }) {
  const actor = alias(users, "actor");
  const student = alias(users, "student");
  const where = [];
  if (opts.userId) where.push(eq(pointTransactions.userId, opts.userId));
  if (opts.manualOnly) where.push(isNotNull(pointTransactions.createdBy));
  const reversed = sql<boolean>`exists (select 1 from point_transactions r where r.reverses_id = "point_transactions"."id")`;
  return database
    .select({
      id: pointTransactions.id,
      amount: pointTransactions.amount,
      category: pointTransactions.category,
      description: pointTransactions.description,
      note: pointTransactions.note,
      effectiveAt: pointTransactions.effectiveAt,
      createdAt: pointTransactions.createdAt,
      reversesId: pointTransactions.reversesId,
      isReversed: reversed,
      userId: pointTransactions.userId,
      studentName: student.displayName,
      actorName: actor.displayName,
    })
    .from(pointTransactions)
    .innerJoin(student, eq(student.id, pointTransactions.userId))
    .leftJoin(actor, eq(actor.id, pointTransactions.createdBy))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(pointTransactions.createdAt))
    .limit(opts.limit ?? 100)
    .offset(opts.offset ?? 0);
}

/* ---------------------------- bulk import ---------------------------- */

export type ImportLine = { line: number; displayName: string; username?: string };

/** "Mark W." → "markw", "José" → "jose" */
export function suggestUsername(displayName: string): string {
  const base = displayName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
  return base.length >= 3 ? base : `student${base}`;
}

/** Parses "Display name" or "Display name, username" per line. Blank lines are ignored. */
export function parseImportText(text: string): ImportLine[] {
  return text
    .split(/\r?\n/)
    .map((raw, i) => ({ raw: raw.trim(), line: i + 1 }))
    .filter((l) => l.raw)
    .map(({ raw, line }) => {
      const [name, user] = raw.split(/[,\t]/).map((s) => s.trim());
      return { line, displayName: name, username: user || undefined };
    });
}

/**
 * Creates many student accounts at once, all-or-nothing. Usernames are
 * generated from display names when not given and made unique. Returns each
 * account's one-time temporary password for the leader to hand out.
 */
export async function bulkCreateStudents(
  database: Database,
  opts: { lines: ImportLine[]; seasonIds: string[]; actorId: string },
): Promise<{ displayName: string; username: string; temporaryPassword: string }[]> {
  if (opts.lines.length === 0) throw new UserAdminError("Paste at least one name.");
  if (opts.lines.length > 100) throw new UserAdminError("Import at most 100 students at a time.");

  const problems: string[] = [];
  const taken = new Set(
    (await database.select({ u: sql<string>`lower(${users.username})` }).from(users)).map((r) => r.u),
  );
  const planned: { displayName: string; username: string }[] = [];
  for (const l of opts.lines) {
    const name = displayNameSchema.safeParse(l.displayName);
    if (!name.success) {
      problems.push(`Line ${l.line}: name — ${name.error.issues[0].message}`);
      continue;
    }
    let username: string;
    if (l.username) {
      const u = usernameSchema.safeParse(l.username);
      if (!u.success) {
        problems.push(`Line ${l.line}: username — ${u.error.issues[0].message}`);
        continue;
      }
      if (taken.has(u.data)) {
        problems.push(`Line ${l.line}: username "${u.data}" is already taken`);
        continue;
      }
      username = u.data;
    } else {
      const base = suggestUsername(name.data);
      username = base;
      for (let n = 2; taken.has(username); n++) username = `${base}${n}`;
    }
    taken.add(username);
    planned.push({ displayName: name.data, username });
  }
  if (problems.length) throw new UserAdminError(problems.slice(0, 10).join("\n"));

  const withPasswords: { displayName: string; username: string; temporaryPassword: string; passwordHash: string }[] = [];
  for (const p of planned) {
    const temporaryPassword = generateTemporaryPassword();
    withPasswords.push({ ...p, temporaryPassword, passwordHash: await hashPassword(temporaryPassword) });
  }

  await database.transaction(async (tx) => {
    const inserted = await tx
      .insert(users)
      .values(
        withPasswords.map((p) => ({
          username: p.username,
          displayName: p.displayName,
          passwordHash: p.passwordHash,
          role: "student" as const,
          mustChangePassword: true,
        })),
      )
      .returning({ id: users.id });
    if (opts.seasonIds.length) {
      const valid = await tx.select({ id: seasons.id }).from(seasons).where(inArray(seasons.id, opts.seasonIds));
      const rows = valid.flatMap((s) => inserted.map((u) => ({ seasonId: s.id, userId: u.id })));
      if (rows.length) await tx.insert(seasonParticipants).values(rows);
    }
    await audit(tx, {
      actorId: opts.actorId,
      action: "user.bulk_created",
      targetType: "user",
      details: { count: inserted.length, userIds: inserted.map((u) => u.id) },
    });
  });
  return withPasswords.map(({ displayName, username, temporaryPassword }) => ({ displayName, username, temporaryPassword }));
}

/* --------------------------- personal data --------------------------- */

/**
 * Removes a former student's personal data while keeping the competition
 * history consistent: the account keeps its id (so the ledger and past
 * leaderboards still add up) but its name, username and credentials are
 * wiped, and audit entries about it are redacted. Irreversible.
 */
export async function removePersonalData(database: Database, opts: { id: string; actorId: string }) {
  await database.transaction(async (tx) => {
    const user = await tx.query.users.findFirst({ where: eq(users.id, opts.id) });
    if (!user || user.role !== "student") throw new UserAdminError("Student not found.");
    if (user.isActive) throw new UserAdminError("Deactivate the account first.");
    const short = user.id.slice(0, 8);
    await tx
      .update(users)
      .set({
        displayName: "Former student",
        username: `removed-${short}`,
        passwordHash: "disabled",
        totpSecret: null,
        totpEnabled: false,
        mustChangePassword: false,
        lastLoginAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
    await tx.delete(sessions).where(eq(sessions.userId, user.id));
    await tx.execute(sql`delete from login_attempts where key in (${`user:${user.username.toLowerCase()}`}, ${`password:${user.id}`})`);
    await tx.execute(sql`update user_achievements set note = null where user_id = ${user.id}`);
    await tx.execute(sql`select set_config('app.redact_audit', 'on', true)`);
    await tx.execute(sql`update audit_log set details = '{"redacted": true}'::jsonb where target_id = ${user.id} and details <> '{"redacted": true}'::jsonb`);
    await tx.execute(sql`select set_config('app.redact_audit', 'off', true)`);
    await audit(tx, { actorId: opts.actorId, action: "user.personal_data_removed", targetType: "user", targetId: user.id });
  });
}
