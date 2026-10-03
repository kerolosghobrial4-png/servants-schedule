import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ current: null as null | Record<string, unknown> }));
vi.mock("@/lib/auth/session", () => ({ getCurrentSession: async () => session.current }));

import { pool } from "@/db";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { DEFAULT_SETTINGS, saveSettings } from "@/server/settings";
import { db } from "@/db";

const user = (over: Record<string, unknown> = {}) => ({
  sessionId: "s",
  mfaPending: false,
  user: { id: "u", username: "u", displayName: "U", role: "leader", isActive: true, mustChangePassword: false, totpEnabled: false, createdAt: new Date(), ...over },
});

afterAll(async () => {
  await saveSettings(db, DEFAULT_SETTINGS, null);
  await pool.end();
});

beforeEach(async () => {
  await saveSettings(db, DEFAULT_SETTINGS, null);
});

describe("authorize (server actions)", () => {
  it("rejects anonymous, MFA-pending and must-change-password sessions", async () => {
    session.current = null;
    await expect(authorize("points.manage")).rejects.toThrow(ForbiddenError);
    session.current = { ...user(), mfaPending: true };
    await expect(authorize("points.manage")).rejects.toThrow(ForbiddenError);
    session.current = user({ mustChangePassword: true });
    await expect(authorize("points.manage")).rejects.toThrow(ForbiddenError);
  });

  it("enforces role permissions", async () => {
    session.current = user({ role: "student" });
    await expect(authorize("points.manage")).rejects.toThrow(/permission/);
    session.current = user({ role: "leader" });
    await expect(authorize("points.manage")).resolves.toMatchObject({ role: "leader" });
    await expect(authorize("settings.manage")).rejects.toThrow(/permission/);
    session.current = user({ role: "admin" });
    await expect(authorize("settings.manage")).resolves.toMatchObject({ role: "admin" });
  });

  it("requires two-step verification for staff when the setting is on", async () => {
    await saveSettings(db, { ...DEFAULT_SETTINGS, security: { requireStaffTwoFactor: true } }, null);
    session.current = user({ role: "admin", totpEnabled: false });
    await expect(authorize("quizzes.manage")).rejects.toThrow(/two-step/);
    session.current = user({ role: "admin", totpEnabled: true });
    await expect(authorize("quizzes.manage")).resolves.toBeTruthy();
  });
});
