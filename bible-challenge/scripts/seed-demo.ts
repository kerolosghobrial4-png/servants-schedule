/**
 * Fills a DEVELOPMENT database with demo data (12 students, a season, ten days
 * of graded quizzes, today's and tomorrow's quiz). Refuses to run when
 * NODE_ENV=production. Run `npm run db:seed` first.
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, pool } from "../src/db";
import { users } from "../src/db/schema";
import { DEMO_STUDENT_PASSWORD, loadDemoData } from "../src/server/demo/load";

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to load demo data into a production database.");
  const admin = await db.query.users.findFirst({ where: eq(users.role, "admin") });
  if (!admin) throw new Error("Run `npm run db:seed` first to create an admin.");
  const loaded = await loadDemoData(db, { adminId: admin.id });
  console.log(
    loaded
      ? `Demo data loaded: 12 students (password "${DEMO_STUDENT_PASSWORD}"), leader "leader" (password "leader-demo-2026").`
      : "Demo data already loaded.",
  );
}

main()
  .catch((err) => {
    console.error(err.message ?? err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
