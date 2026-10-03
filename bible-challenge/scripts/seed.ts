/**
 * Bootstraps a fresh database: default settings, the starter achievements and
 * the first admin account (from ADMIN_USERNAME / ADMIN_PASSWORD). Safe to run
 * more than once — existing rows are left alone.
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db, pool } from "../src/db";
import { achievements, settings, users } from "../src/db/schema";
import { STAFF_MIN_PASSWORD, hashPassword } from "../src/lib/auth/password";
import { DEFAULT_ACHIEVEMENTS } from "../src/server/achievements";
import { DEFAULT_SETTINGS } from "../src/server/settings";

async function main() {
  await db.insert(settings).values({ key: "app", value: DEFAULT_SETTINGS }).onConflictDoNothing();

  for (const [i, a] of DEFAULT_ACHIEVEMENTS.entries()) {
    await db
      .insert(achievements)
      .values({ ...a, position: i })
      .onConflictDoNothing({ target: achievements.key });
  }

  const username = (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const existing = await db.query.users.findFirst({ where: sql`lower(${users.username}) = ${username}` });
  if (existing) {
    console.log(`Admin "${username}" already exists — not changed.`);
  } else {
    if (password.length < STAFF_MIN_PASSWORD) {
      throw new Error(`Set ADMIN_PASSWORD (at least ${STAFF_MIN_PASSWORD} characters) to create the first admin.`);
    }
    await db.insert(users).values({
      username,
      displayName: process.env.ADMIN_DISPLAY_NAME ?? "Leader",
      passwordHash: await hashPassword(password),
      role: "admin",
    });
    console.log(`Created admin "${username}".`);
  }
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
