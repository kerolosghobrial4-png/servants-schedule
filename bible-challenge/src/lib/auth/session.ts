import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { sessions, users, type Role, type User } from "@/db/schema";

/**
 * Opaque, database-backed sessions. The cookie holds a random 256-bit token;
 * the database only stores its SHA-256 hash, so a leaked database can't be
 * replayed as live sessions. Sessions can be revoked instantly (logout,
 * password reset, deactivation).
 */

const isProd = process.env.NODE_ENV === "production";
const secureCookies = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === "true" : isProd;
export const SESSION_COOKIE = secureCookies ? "__Host-bc_session" : "bc_session";

const STUDENT_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const STAFF_TTL_MS = 12 * 60 * 60 * 1000;
const MFA_PENDING_TTL_MS = 10 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionTtl(role: Role, mfaPending = false) {
  if (mfaPending) return MFA_PENDING_TTL_MS;
  return role === "student" ? STUDENT_TTL_MS : STAFF_TTL_MS;
}

/** Must be called from a Server Action or Route Handler. */
export async function createSession(user: Pick<User, "id" | "role">, opts: { mfaPending?: boolean } = {}) {
  const token = randomBytes(32).toString("base64url");
  const ttl = sessionTtl(user.role, opts.mfaPending);
  const expiresAt = new Date(Date.now() + ttl);
  await db.insert(sessions).values({
    id: hashToken(token),
    userId: user.id,
    mfaPending: opts.mfaPending ?? false,
    expiresAt,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  // Opportunistic cleanup of expired sessions.
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export type CurrentSession = {
  sessionId: string;
  mfaPending: boolean;
  user: Pick<
    User,
    "id" | "username" | "displayName" | "role" | "isActive" | "mustChangePassword" | "totpEnabled" | "createdAt"
  >;
};

/** Resolves the session for this request (memoised per request). */
export const getCurrentSession = cache(async (): Promise<CurrentSession | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const id = hashToken(token);
  const [row] = await db
    .select({
      sessionId: sessions.id,
      mfaPending: sessions.mfaPending,
      lastSeenAt: sessions.lastSeenAt,
      user: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        role: users.role,
        isActive: users.isActive,
        mustChangePassword: users.mustChangePassword,
        totpEnabled: users.totpEnabled,
        createdAt: users.createdAt,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())));
  if (!row || !row.user.isActive) return null;
  if (Date.now() - row.lastSeenAt.getTime() > 15 * 60 * 1000) {
    await db.update(sessions).set({ lastSeenAt: new Date() }).where(eq(sessions.id, id));
  }
  return { sessionId: row.sessionId, mfaPending: row.mfaPending, user: row.user };
});

/** Logs out the current browser. Must be called from a Server Action. */
export async function destroyCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  jar.delete(SESSION_COOKIE);
}

/** Signs a user out everywhere (optionally keeping the current session). */
export async function revokeUserSessions(userId: string, exceptSessionId?: string) {
  await db
    .delete(sessions)
    .where(exceptSessionId ? and(eq(sessions.userId, userId), ne(sessions.id, exceptSessionId)) : eq(sessions.userId, userId));
}
