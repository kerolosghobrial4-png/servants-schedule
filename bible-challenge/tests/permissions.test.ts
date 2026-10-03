import { afterAll, describe, expect, it } from "vitest";
import { db, pool } from "@/db";
import { PERMISSIONS, can } from "@/lib/permissions";
import { LIMITS, isLimited, recordAttempt } from "@/server/rate-limit";

afterAll(async () => {
  await pool.end();
});

describe("role-based access", () => {
  it("students can only take quizzes", () => {
    const allowed = (Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[]).filter((p) => can("student", p));
    expect(allowed).toEqual(["quiz.take"]);
  });

  it("leaders run quizzes and points but not users, roles or settings", () => {
    expect(can("leader", "quizzes.manage")).toBe(true);
    expect(can("leader", "submissions.review")).toBe(true);
    expect(can("leader", "points.manage")).toBe(true);
    expect(can("leader", "students.manage")).toBe(false);
    expect(can("leader", "staff.manage")).toBe(false);
    expect(can("leader", "settings.manage")).toBe(false);
    expect(can("leader", "quiz.take")).toBe(false);
  });

  it("admins can do everything staff can", () => {
    for (const p of Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[]) {
      if (p !== "quiz.take") expect(can("admin", p)).toBe(true);
    }
  });
});

describe("login rate limiting", () => {
  it("locks a key after repeated failures and resets on success", async () => {
    const key = `user:test-${Date.now()}`;
    for (let i = 0; i < LIMITS.user.max - 1; i++) await recordAttempt(db, key, false);
    expect(await isLimited(db, key, LIMITS.user)).toBe(false);
    await recordAttempt(db, key, false);
    expect(await isLimited(db, key, LIMITS.user)).toBe(true);

    const other = `user:test2-${Date.now()}`;
    for (let i = 0; i < 3; i++) await recordAttempt(db, other, false);
    await recordAttempt(db, other, true);
    for (let i = 0; i < 3; i++) await recordAttempt(db, other, false);
    expect(await isLimited(db, other, LIMITS.user)).toBe(false);
  });
});
