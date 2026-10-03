import "server-only";
import { db } from "@/db";
import { can, isStaff, type Permission } from "@/lib/permissions";
import { getCurrentSession } from "@/lib/auth/session";
import { getSettings } from "@/server/settings";

export class ForbiddenError extends Error {}

/**
 * Authorization for Server Actions. Actions are public POST endpoints, so
 * each one re-checks the session and permission rather than trusting that
 * the page which rendered the form was protected.
 */
export async function authorize(permission: Permission) {
  const session = await getCurrentSession();
  if (!session || session.mfaPending || session.user.mustChangePassword) {
    throw new ForbiddenError("Your session has expired. Sign in again.");
  }
  const user = session.user;
  if (!can(user.role, permission)) throw new ForbiddenError("You don't have permission to do that.");
  if (isStaff(user.role) && !user.totpEnabled) {
    const settings = await getSettings(db);
    if (settings.security.requireStaffTwoFactor) throw new ForbiddenError("Set up two-step verification first.");
  }
  return user;
}
