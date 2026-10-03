"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { displayNameSchema, formString, usernameSchema, uuidSchema, zodToFormState } from "@/lib/validation";
import { audit } from "@/server/audit";
import { appSettingsSchema, getSettings, saveSettings } from "@/server/settings";
import { UserAdminError, changeRole, createUser, resetUserPassword, setUserActive } from "@/server/users-admin";

function fail(err: unknown): FormState {
  if (err instanceof ForbiddenError || err instanceof UserAdminError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong. Please try again." };
}

const num = (fd: FormData, k: string) => Number(formString(fd, k));

export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("settings.manage");
    const before = await getSettings(db);
    const parsed = appSettingsSchema.safeParse({
      groupName: formString(fd, "groupName"),
      timezone: formString(fd, "timezone"),
      weekStartsOn: num(fd, "weekStartsOn"),
      points: {
        defaultQuestion: num(fd, "defaultQuestion"),
        participation: num(fd, "participation"),
        completion: num(fd, "completion"),
        perfect: num(fd, "perfect"),
      },
      streak: {
        weekendsCount: fd.get("weekendsCount") === "on",
        bonusEvery: num(fd, "bonusEvery"),
        bonusPoints: num(fd, "bonusPoints"),
      },
      leaderboard: {
        defaultPeriod: formString(fd, "defaultPeriod"),
        showStreaks: fd.get("showStreaks") === "on",
      },
      security: { requireStaffTwoFactor: fd.get("requireStaffTwoFactor") === "on" },
    });
    if (!parsed.success) return zodToFormState(parsed.error);
    await db.transaction(async (tx) => {
      await saveSettings(tx, parsed.data, actor.id);
      await audit(tx, { actorId: actor.id, action: "settings.updated", details: { before, after: parsed.data } });
    });
    revalidatePath("/", "layout");
    return { ok: true, message: "Settings saved. New point values apply to quizzes submitted from now on." };
  } catch (err) {
    return fail(err);
  }
}

export async function createStaffAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("staff.manage");
    const parsed = z
      .object({ username: usernameSchema, displayName: displayNameSchema, role: z.enum(["leader", "admin"]) })
      .safeParse({ username: formString(fd, "username"), displayName: formString(fd, "displayName"), role: formString(fd, "role") });
    if (!parsed.success) return zodToFormState(parsed.error);
    const { temporaryPassword } = await createUser(db, { ...parsed.data, actorId: actor.id });
    revalidatePath("/admin/settings");
    return { ok: true, message: `Staff account created: ${parsed.data.username}`, secret: temporaryPassword ?? undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function staffAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("staff.manage");
    const id = uuidSchema.parse(fd.get("id"));
    const op = z.enum(["make_leader", "make_admin", "deactivate", "reactivate", "reset"]).parse(fd.get("op"));
    if (id === actor.id && op !== "reset") return { error: "You can't change your own role or status." };
    switch (op) {
      case "make_leader":
        await changeRole(db, { id, role: "leader", actorId: actor.id });
        break;
      case "make_admin":
        await changeRole(db, { id, role: "admin", actorId: actor.id });
        break;
      case "deactivate":
      case "reactivate":
        await setUserActive(db, { id, active: op === "reactivate", actorId: actor.id });
        break;
      case "reset": {
        const secret = await resetUserPassword(db, { id, actorId: actor.id });
        return { ok: true, message: "Password reset.", secret };
      }
    }
    revalidatePath("/admin/settings");
    return { ok: true, message: "Updated." };
  } catch (err) {
    return fail(err);
  }
}
