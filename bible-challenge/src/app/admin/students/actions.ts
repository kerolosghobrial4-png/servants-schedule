"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { displayNameSchema, formString, lineText, usernameSchema, uuidSchema, zodToFormState } from "@/lib/validation";
import {
  UserAdminError,
  adjustPoints,
  bulkCreateStudents,
  createUser,
  parseImportText,
  removePersonalData,
  resetUserPassword,
  reversePoints,
  setStudentSeasons,
  setUserActive,
  updateUserProfile,
} from "@/server/users-admin";

function fail(err: unknown): FormState {
  if (err instanceof UserAdminError || err instanceof ForbiddenError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong. Please try again." };
}

const createSchema = z.object({
  username: usernameSchema,
  displayName: displayNameSchema,
  seasonIds: z.array(uuidSchema).max(20),
});

export async function createStudentAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("students.manage");
    const parsed = createSchema.safeParse({
      username: formString(fd, "username"),
      displayName: formString(fd, "displayName"),
      seasonIds: fd.getAll("seasonIds").filter((v) => typeof v === "string"),
    });
    if (!parsed.success) return zodToFormState(parsed.error);
    const { temporaryPassword } = await createUser(db, { ...parsed.data, role: "student", actorId: actor.id });
    revalidatePath("/admin", "layout");
    return {
      ok: true,
      message: `Account created for ${parsed.data.displayName}. Username: ${parsed.data.username}`,
      secret: temporaryPassword ?? undefined,
    };
  } catch (err) {
    return fail(err);
  }
}

export async function updateStudentAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("students.manage");
    const parsed = z
      .object({ id: uuidSchema, username: usernameSchema, displayName: displayNameSchema })
      .safeParse({ id: formString(fd, "id"), username: formString(fd, "username"), displayName: formString(fd, "displayName") });
    if (!parsed.success) return zodToFormState(parsed.error);
    await updateUserProfile(db, { ...parsed.data, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Saved." };
  } catch (err) {
    return fail(err);
  }
}

export async function resetPasswordAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("students.manage");
    const id = uuidSchema.parse(formString(fd, "id"));
    const secret = await resetUserPassword(db, { id, actorId: actor.id });
    return { ok: true, message: "Temporary password created. They'll choose a new one when they sign in.", secret };
  } catch (err) {
    return fail(err);
  }
}

export async function setActiveAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("students.manage");
    const id = uuidSchema.parse(formString(fd, "id"));
    const active = formString(fd, "active") === "true";
    await setUserActive(db, { id, active, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: active ? "Account reactivated." : "Account deactivated. Their history is kept." };
  } catch (err) {
    return fail(err);
  }
}

export async function setSeasonsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("students.manage");
    const id = uuidSchema.parse(formString(fd, "id"));
    const seasonIds = z.array(uuidSchema).max(50).parse(fd.getAll("seasonIds"));
    await setStudentSeasons(db, { id, seasonIds, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Seasons updated." };
  } catch (err) {
    return fail(err);
  }
}

const adjustSchema = z.object({
  userId: uuidSchema,
  amount: z.coerce.number().int("Whole numbers only").refine((n) => n !== 0, "Can't be zero").refine((n) => Math.abs(n) <= 10000, "Too large"),
  reason: lineText(120).pipe(z.string().min(3, "Give a reason the student will see")),
  note: lineText(300).optional(),
});

export async function adjustPointsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("points.manage");
    const parsed = adjustSchema.safeParse({
      userId: formString(fd, "userId"),
      amount: formString(fd, "amount"),
      reason: formString(fd, "reason"),
      note: formString(fd, "note"),
    });
    if (!parsed.success) return zodToFormState(parsed.error);
    const row = await adjustPoints(db, { ...parsed.data, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: `${row.amount > 0 ? "+" : ""}${row.amount} recorded.` };
  } catch (err) {
    return fail(err);
  }
}

export async function reversePointsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("points.manage");
    const parsed = z
      .object({ transactionId: uuidSchema, reason: lineText(200).pipe(z.string().min(3, "Say why")) })
      .safeParse({ transactionId: formString(fd, "transactionId"), reason: formString(fd, "reason") });
    if (!parsed.success) return zodToFormState(parsed.error);
    await reversePoints(db, { ...parsed.data, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Entry reversed." };
  } catch (err) {
    return fail(err);
  }
}

export type ImportState = FormState & { created?: { displayName: string; username: string; temporaryPassword: string }[] };

export async function importStudentsAction(_prev: ImportState, fd: FormData): Promise<ImportState> {
  try {
    const actor = await authorize("students.manage");
    const text = formString(fd, "names").slice(0, 20_000);
    const seasonIds = z.array(uuidSchema).max(20).parse(fd.getAll("seasonIds"));
    const created = await bulkCreateStudents(db, { lines: parseImportText(text), seasonIds, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: `Created ${created.length} account${created.length === 1 ? "" : "s"}.`, created };
  } catch (err) {
    return fail(err);
  }
}

export async function removePersonalDataAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("students.manage");
    const id = uuidSchema.parse(fd.get("id"));
    if (formString(fd, "confirm").trim().toUpperCase() !== "REMOVE") {
      return { error: "Type REMOVE to confirm." };
    }
    await removePersonalData(db, { id, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Personal data removed. Their past points remain as “Former student”." };
  } catch (err) {
    return fail(err);
  }
}
