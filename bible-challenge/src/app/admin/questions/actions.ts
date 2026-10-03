"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { uuidSchema, zodToFormState } from "@/lib/validation";
import { duplicateBankQuestion, saveBankQuestion, setQuestionArchived } from "@/server/question-bank";
import { bankQuestionSchema } from "@/server/question-input";

function fail(err: unknown): FormState {
  if (err instanceof ForbiddenError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong. Please try again." };
}

export async function saveBankQuestionAction(id: string | null, payload: unknown): Promise<FormState> {
  let savedId: string;
  try {
    const actor = await authorize("questions.manage");
    if (id !== null && !uuidSchema.safeParse(id).success) return { error: "Invalid question." };
    const parsed = bankQuestionSchema.safeParse(payload);
    if (!parsed.success) return zodToFormState(parsed.error);
    savedId = await saveBankQuestion(db, { id: id ?? undefined, input: parsed.data, actorId: actor.id });
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin/questions");
  redirect(`/admin/questions/${savedId}?saved=1`);
}

export async function duplicateQuestionAction(_prev: FormState, fd: FormData): Promise<FormState> {
  let newId: string;
  try {
    const actor = await authorize("questions.manage");
    newId = await duplicateBankQuestion(db, { id: uuidSchema.parse(fd.get("id")), actorId: actor.id });
  } catch (err) {
    return fail(err);
  }
  redirect(`/admin/questions/${newId}?copied=1`);
}

export async function archiveQuestionAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("questions.manage");
    const archived = fd.get("archived") === "true";
    await setQuestionArchived(db, { id: uuidSchema.parse(fd.get("id")), archived, actorId: actor.id });
    revalidatePath("/admin/questions");
    return { ok: true, message: archived ? "Archived. Quizzes that already use it are unaffected." : "Restored." };
  } catch (err) {
    return fail(err);
  }
}
