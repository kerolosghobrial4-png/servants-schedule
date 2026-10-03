"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { FormState } from "@/components/form-state";
import { requireUser, homeFor } from "@/lib/auth/guards";
import {
  STAFF_MIN_PASSWORD,
  STUDENT_MIN_PASSWORD,
  burnPasswordCheck,
  hashPassword,
  needsRehash,
  verifyPassword,
} from "@/lib/auth/password";
import { createSession, destroyCurrentSession, getCurrentSession, revokeUserSessions } from "@/lib/auth/session";
import { generateTotpSecret, verifyTotp } from "@/lib/auth/totp";
import { isStaff } from "@/lib/permissions";
import { clientIp } from "@/lib/request";
import { formString } from "@/lib/validation";
import { audit } from "@/server/audit";
import { LIMITS, isLimited, recordAttempt } from "@/server/rate-limit";
import { getSettings } from "@/server/settings";

const GENERIC_LOGIN_ERROR = "Incorrect username or password.";

const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(1).max(64),
  password: z.string().min(1).max(200),
});

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    username: formString(formData, "username"),
    password: formString(formData, "password"),
  });
  if (!parsed.success) return { error: "Enter your username and password." };
  const { username, password } = parsed.data;

  const ip = await clientIp();
  const userKey = `user:${username}`;
  const ipKey = ip ? `ip:${ip}` : null;
  if ((await isLimited(db, userKey, LIMITS.user)) || (ipKey && (await isLimited(db, ipKey, LIMITS.ip)))) {
    return { error: "Too many attempts. Wait 15 minutes and try again, or ask a leader for help." };
  }

  const user = await db.query.users.findFirst({ where: sql`lower(${users.username}) = ${username}` });
  const ok = user && user.isActive ? await verifyPassword(password, user.passwordHash) : (await burnPasswordCheck(password), false);

  await recordAttempt(db, userKey, !!ok);
  if (ipKey) await recordAttempt(db, ipKey, !!ok);
  if (!ok || !user) return { error: GENERIC_LOGIN_ERROR };

  const updates: Partial<typeof users.$inferInsert> = { lastLoginAt: new Date() };
  if (needsRehash(user.passwordHash)) updates.passwordHash = await hashPassword(password);
  await db.update(users).set(updates).where(eq(users.id, user.id));

  // Never reuse a pre-login session (prevents session fixation).
  await destroyCurrentSession();
  const mfaPending = isStaff(user.role) && user.totpEnabled;
  await createSession(user, { mfaPending });
  if (isStaff(user.role)) await audit(db, { actorId: user.id, action: "auth.login", details: { mfa: mfaPending } });

  if (mfaPending) redirect("/login/verify");
  if (user.mustChangePassword) redirect("/change-password");
  redirect(homeFor(user.role));
}

export async function verifyTotpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getCurrentSession();
  if (!session || !session.mfaPending) redirect("/login");
  const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!user?.totpSecret || !user.totpEnabled) redirect("/login");

  const key = `totp:${user.id}`;
  if (await isLimited(db, key, LIMITS.totp)) {
    await destroyCurrentSession();
    return { error: "Too many incorrect codes. Sign in again in 15 minutes." };
  }
  const ok = verifyTotp(user.totpSecret, formString(formData, "code"));
  await recordAttempt(db, key, ok);
  if (!ok) return { error: "That code didn't match. Use the current code from your authenticator app." };

  await destroyCurrentSession();
  await createSession(user);
  if (user.mustChangePassword) redirect("/change-password");
  redirect(homeFor(user.role));
}

export async function logoutAction() {
  await destroyCurrentSession();
  redirect("/login");
}

/** Ends every session for this account, including this one. */
export async function signOutEverywhereAction() {
  const session = await getCurrentSession();
  if (session) {
    await revokeUserSessions(session.user.id);
    await audit(db, { actorId: session.user.id, action: "auth.signed_out_everywhere", targetType: "user", targetId: session.user.id });
  }
  await destroyCurrentSession();
  redirect("/login");
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser({ allowPasswordChange: true });
  const session = await getCurrentSession();
  const min = isStaff(viewer.role) ? STAFF_MIN_PASSWORD : STUDENT_MIN_PASSWORD;

  const current = formString(formData, "current");
  const next = formString(formData, "next");
  const confirm = formString(formData, "confirm");

  const fieldErrors: Record<string, string> = {};
  if (next.length < min) fieldErrors.next = `Use at least ${min} characters.`;
  if (next.length > 200) fieldErrors.next = "That's too long.";
  if (next.toLowerCase().includes(viewer.username.toLowerCase())) fieldErrors.next = "Don't include your username.";
  if (next !== confirm) fieldErrors.confirm = "Passwords don't match.";
  if (next && next === current) fieldErrors.next = "Choose a different password from the current one.";
  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors };

  const key = `password:${viewer.id}`;
  if (await isLimited(db, key, LIMITS.password)) return { error: "Too many attempts. Try again in 15 minutes." };

  const user = await db.query.users.findFirst({ where: eq(users.id, viewer.id) });
  const ok = !!user && (await verifyPassword(current, user.passwordHash));
  await recordAttempt(db, key, ok);
  if (!ok) return { fieldErrors: { current: "That isn't your current password." }, error: "Please fix the highlighted fields." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(next), mustChangePassword: false, updatedAt: new Date() })
    .where(eq(users.id, viewer.id));
  // Sign out every other device.
  await revokeUserSessions(viewer.id, session?.sessionId);
  await audit(db, { actorId: viewer.id, action: "auth.password_changed", targetType: "user", targetId: viewer.id });
  if (user.mustChangePassword) redirect(homeFor(viewer.role));
  return { ok: true, message: "Password updated. Other devices have been signed out." };
}

/* ---------------------------- two-step setup ---------------------------- */

export async function startTotpSetupAction(): Promise<void> {
  const viewer = await requireUser();
  if (!isStaff(viewer.role)) redirect("/");
  if (viewer.totpEnabled) redirect("/account/security");
  await db.update(users).set({ totpSecret: generateTotpSecret() }).where(eq(users.id, viewer.id));
  redirect("/account/security?setup=1");
}

export async function confirmTotpSetupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser();
  if (!isStaff(viewer.role)) return { error: "Not available." };
  const user = await db.query.users.findFirst({ where: eq(users.id, viewer.id) });
  if (!user?.totpSecret || user.totpEnabled) return { error: "Start setup again." };
  const key = `totp:${user.id}`;
  if (await isLimited(db, key, LIMITS.totp)) return { error: "Too many attempts. Try again in 15 minutes." };
  const ok = verifyTotp(user.totpSecret, formString(formData, "code"));
  await recordAttempt(db, key, ok);
  if (!ok) return { error: "That code didn't match. Check your phone's clock and try the newest code." };
  await db.update(users).set({ totpEnabled: true }).where(eq(users.id, user.id));
  const session = await getCurrentSession();
  await revokeUserSessions(user.id, session?.sessionId);
  await audit(db, { actorId: user.id, action: "auth.2fa_enabled", targetType: "user", targetId: user.id });
  redirect("/account/security?enabled=1");
}

export async function disableTotpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const viewer = await requireUser();
  const user = await db.query.users.findFirst({ where: eq(users.id, viewer.id) });
  if (!user?.totpEnabled || !user.totpSecret) return { error: "Two-step verification isn't on." };
  if ((await getSettings(db)).security.requireStaffTwoFactor) {
    return { error: "Two-step verification is required for staff accounts in this group." };
  }
  const key = `password:${user.id}`;
  if (await isLimited(db, key, LIMITS.password)) return { error: "Too many attempts. Try again in 15 minutes." };
  const ok =
    (await verifyPassword(formString(formData, "password"), user.passwordHash)) &&
    verifyTotp(user.totpSecret, formString(formData, "code"));
  await recordAttempt(db, key, ok);
  if (!ok) return { error: "Password or code is incorrect." };
  await db.update(users).set({ totpEnabled: false, totpSecret: null }).where(eq(users.id, user.id));
  await audit(db, { actorId: user.id, action: "auth.2fa_disabled", targetType: "user", targetId: user.id });
  redirect("/account/security?disabled=1");
}
