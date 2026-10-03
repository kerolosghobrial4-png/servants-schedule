import { afterAll, it } from "vitest";
import { db, pool } from "@/db";
import { users } from "@/db/schema";
import { getStreaks, loadCompletedDays, loadQuizCalendar } from "@/server/streaks";
afterAll(async () => { await pool.end(); });
it("streak breakdown", async () => {
  const ids = (await db.select({ id: users.id }).from(users)).map((r) => r.id);
  for (const [label, fn] of [
    ["calendar", () => loadQuizCalendar(db, "America/New_York")],
    ["completed days", () => loadCompletedDays(db, ids)],
    ["getStreaks (150)", () => getStreaks(db, ids, { tz: "America/New_York", weekendsCount: true })],
    ["getStreaks (1)", () => getStreaks(db, [ids[0]], { tz: "America/New_York", weekendsCount: true })],
  ] as const) {
    await fn();
    const t = performance.now();
    await fn();
    console.log(label, (performance.now() - t).toFixed(0), "ms");
  }
});
