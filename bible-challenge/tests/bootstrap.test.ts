import { eq, sql } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "@/db";
import { submissions, users } from "@/db/schema";
import { bootstrap } from "@/server/bootstrap";
import { loadDemoData } from "@/server/demo/load";
import { checkLedgerIntegrity } from "@/server/integrity";

afterAll(async () => {
  await pool.end();
});

describe("bootstrap", () => {
  it("creates the first admin from env once, and validates the password", async () => {
    const weak = await bootstrap(db, { ADMIN_USERNAME: "bootadmin", ADMIN_PASSWORD: "short" } as unknown as NodeJS.ProcessEnv);
    // Another admin may already exist from other suites; either way a weak password never creates one.
    expect(weak.createdAdmin).toBeNull();
    const again = await bootstrap(db, { ADMIN_USERNAME: "bootadmin", ADMIN_PASSWORD: "a-long-enough-password" } as unknown as NodeJS.ProcessEnv);
    const admins = await db.select().from(users).where(eq(users.role, "admin"));
    expect(admins.length).toBeGreaterThan(0);
    if (again.createdAdmin) {
      const third = await bootstrap(db, { ADMIN_USERNAME: "other", ADMIN_PASSWORD: "a-long-enough-password" } as unknown as NodeJS.ProcessEnv);
      expect(third.createdAdmin).toBeNull();
    }
  });

  it("loads demo data that passes the ledger integrity check, only once", async () => {
    const admin = (await db.query.users.findFirst({ where: eq(users.role, "admin") }))!;
    const now = new Date("2035-06-15T16:00:00Z"); // far from other suites' dates
    expect(await loadDemoData(db, { adminId: admin.id, now })).toBe(true);
    expect(await loadDemoData(db, { adminId: admin.id, now })).toBe(false);
    const demoUser = (await db.query.users.findFirst({ where: sql`lower(${users.username}) = 'mark'` }))!;
    const subs = await db.select().from(submissions).where(eq(submissions.userId, demoUser.id));
    expect(subs.length).toBeGreaterThan(3);
    const demoIds = new Set(
      (await db.select({ id: users.id }).from(users).where(sql`${users.passwordHash} is not null and ${users.username} in ('matthew','david','mark','andrew','john','peter','thomas','philip','stephen','timothy','luke','joseph')`)).map((u) => u.id),
    );
    const { issues } = await checkLedgerIntegrity(db);
    expect(issues.filter((i) => i.userId && demoIds.has(i.userId))).toEqual([]);
  });
});
