/**
 * Break-glass recovery for a locked-out admin. Run on the server with shell
 * access only:
 *
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD='new long password' npm run user:reset-admin
 *
 * Sets a new password, turns off two-step verification for that account,
 * reactivates it, and signs it out everywhere. The action is audit-logged.
 */
import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { db, pool } from "../src/db";
import { sessions, users } from "../src/db/schema";
import { STAFF_MIN_PASSWORD, hashPassword } from "../src/lib/auth/password";
import { audit } from "../src/server/audit";

async function main() {
  const username = (process.env.ADMIN_USERNAME ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!username || password.length < STAFF_MIN_PASSWORD) {
    throw new Error(`Set ADMIN_USERNAME and ADMIN_PASSWORD (at least ${STAFF_MIN_PASSWORD} characters).`);
  }
  const user = await db.query.users.findFirst({ where: sql`lower(${users.username}) = ${username}` });
  if (!user || user.role !== "admin") throw new Error(`No admin account named "${username}".`);
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), totpEnabled: false, totpSecret: null, totpLastStep: null, isActive: true, deactivatedAt: null, mustChangePassword: false })
    .where(eq(users.id, user.id));
  await db.delete(sessions).where(eq(sessions.userId, user.id));
  await audit(db, { actorId: null, action: "auth.admin_reset_from_cli", targetType: "user", targetId: user.id });
  console.log(`Reset admin "${username}". Two-step verification is off — set it up again after signing in.`);
}

main()
  .catch((err) => {
    console.error(err.message ?? err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
