// Manual load benchmark. Run against a large scratch database:
//   LOAD_DATABASE_URL=postgres://…/bible_load npx vitest run tests/perf --config vitest.perf.mts
import { afterAll, describe, it } from "vitest";
import { db, pool } from "@/db";
import { getAdminDashboard } from "@/server/admin-stats";
import { getLeaderboard } from "@/server/leaderboard";
import { getSettings } from "@/server/settings";
import { getDashboard, getProfile, getQuizHistory, getStudentQuizzes } from "@/server/student";
import { listStudents } from "@/server/users-admin";

afterAll(async () => {
  await pool.end();
});

async function time(label: string, fn: () => Promise<unknown>) {
  await fn(); // warm
  const runs = 3;
  const t0 = performance.now();
  for (let i = 0; i < runs; i++) await fn();
  console.log(`${label.padEnd(28)} ${((performance.now() - t0) / runs).toFixed(0).padStart(6)} ms`);
}

describe("load", () => {
  it("times the hot paths", async () => {
    const settings = await getSettings(db);
    const user = (await db.query.users.findFirst({ where: (u, { eq }) => eq(u.role, "student") }))!;
    await time("leaderboard all-time", () => getLeaderboard(db, { kind: "period", period: "all" }, settings));
    await time("leaderboard week", () => getLeaderboard(db, { kind: "period", period: "week" }, settings));
    await time("student dashboard", () => getDashboard(db, user.id));
    await time("student quizzes", () => getStudentQuizzes(db, user.id, settings));
    await time("student profile", () => getProfile(db, user.id));
    await time("quiz history", () => getQuizHistory(db, user.id));
    await time("admin dashboard", () => getAdminDashboard(db));
    await time("admin student list", () => listStudents(db, { status: "active" }));
  }, 300_000);
});
