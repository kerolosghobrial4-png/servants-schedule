import "server-only";
import { eq, sql } from "drizzle-orm";
import { pool, type Database } from "@/db";
import { achievements, settings, users } from "@/db/schema";
import { STAFF_MIN_PASSWORD, hashPassword } from "@/lib/auth/password";
import { DEFAULT_ACHIEVEMENTS } from "./achievements";
import { DEFAULT_SETTINGS } from "./settings";

export type BootstrapResult = { createdAdmin: string | null; loadedDemo: boolean; notes: string[] };

/**
 * First-run setup that works on platforms without a shell (Netlify, Vercel…).
 * Idempotent and safe to run on every server start:
 *  - default settings and starter achievements
 *  - the first admin from ADMIN_USERNAME / ADMIN_PASSWORD, only if no admin exists
 *  - demo data when SEED_DEMO_DATA=true, only if no demo students exist
 * A Postgres advisory lock keeps concurrent cold starts from doing it twice.
 */
export async function bootstrap(database: Database, env: NodeJS.ProcessEnv = process.env): Promise<BootstrapResult> {
  const result: BootstrapResult = { createdAdmin: null, loadedDemo: false, notes: [] };
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock(727275)");
    await database.insert(settings).values({ key: "app", value: DEFAULT_SETTINGS }).onConflictDoNothing();
    for (const [i, a] of DEFAULT_ACHIEVEMENTS.entries()) {
      await database.insert(achievements).values({ ...a, position: i }).onConflictDoNothing({ target: achievements.key });
    }

    let admin = await database.query.users.findFirst({ where: eq(users.role, "admin") });
    const username = (env.ADMIN_USERNAME ?? "").trim().toLowerCase();
    const password = env.ADMIN_PASSWORD ?? "";
    if (!admin && username) {
      if (password.length < STAFF_MIN_PASSWORD) {
        result.notes.push(`ADMIN_PASSWORD must be at least ${STAFF_MIN_PASSWORD} characters; no admin was created.`);
      } else if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
        result.notes.push("ADMIN_USERNAME may only use lowercase letters, numbers, dot, dash and underscore.");
      } else {
        const taken = await database.query.users.findFirst({ where: sql`lower(${users.username}) = ${username}` });
        if (taken) {
          result.notes.push(`Username "${username}" already exists but isn't an admin; no admin was created.`);
        } else {
          [admin] = await database
            .insert(users)
            .values({
              username,
              displayName: env.ADMIN_DISPLAY_NAME?.trim().slice(0, 24) || "Leader",
              passwordHash: await hashPassword(password),
              role: "admin",
            })
            .returning();
          result.createdAdmin = username;
        }
      }
    }

    if (env.SEED_DEMO_DATA === "true") {
      if (!admin) result.notes.push("SEED_DEMO_DATA is on but there's no admin yet; demo data skipped.");
      else {
        const { loadDemoData } = await import("./demo/load");
        result.loadedDemo = await loadDemoData(database, { adminId: admin.id });
      }
    }
  } finally {
    await client.query("select pg_advisory_unlock(727275)").catch(() => {});
    client.release();
  }
  return result;
}
