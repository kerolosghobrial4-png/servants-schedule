import "server-only";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { can, isStaff, type Permission } from "@/lib/permissions";
import { getSettings } from "@/server/settings";
import { getCurrentSession, type CurrentSession } from "./session";

export type Viewer = CurrentSession["user"];

/**
 * Server-side gatekeepers. Every page and every server action calls one of
 * these; the UI hiding a link is never relied on for access control.
 */

export async function requireUser(opts: { allowPasswordChange?: boolean } = {}): Promise<Viewer> {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  if (session.mfaPending) redirect("/login/verify");
  if (session.user.mustChangePassword && !opts.allowPasswordChange) redirect("/change-password");
  return session.user;
}

export async function requireStudent(): Promise<Viewer> {
  const user = await requireUser();
  if (!can(user.role, "quiz.take")) redirect("/admin");
  return user;
}

export async function requirePermission(permission: Permission): Promise<Viewer> {
  const user = await requireUser();
  if (!can(user.role, permission)) {
    // Students get a plain 404 for staff URLs rather than confirmation they exist.
    if (!isStaff(user.role)) notFound();
    redirect("/admin?denied=1");
  }
  if (isStaff(user.role) && !user.totpEnabled) {
    const settings = await getSettings(db);
    if (settings.security.requireStaffTwoFactor) redirect("/account/security?required=1");
  }
  return user;
}

export function homeFor(role: Viewer["role"]) {
  return isStaff(role) ? "/admin" : "/";
}
