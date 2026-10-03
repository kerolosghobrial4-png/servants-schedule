"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { uuidSchema } from "@/lib/validation";
import { SubmissionError, reviewAnswer, setEditAllowed } from "@/server/submissions";

function fail(err: unknown): FormState {
  if (err instanceof ForbiddenError || err instanceof SubmissionError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong. Please try again." };
}

export async function reviewAnswerAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("submissions.review");
    const answerId = uuidSchema.parse(fd.get("answerId"));
    const decision = z.enum(["approved", "rejected", "auto"]).parse(fd.get("decision"));
    await reviewAnswer(db, { answerId, decision, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: decision === "approved" ? "Approved — points awarded." : decision === "rejected" ? "Marked incorrect." : "Review cleared." };
  } catch (err) {
    return fail(err);
  }
}

export async function setEditAllowedAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("submissions.review");
    const submissionId = uuidSchema.parse(fd.get("submissionId"));
    const allowed = fd.get("allowed") === "true";
    await setEditAllowed(db, { submissionId, allowed, actorId: actor.id });
    revalidatePath("/admin", "layout");
    return { ok: true, message: allowed ? "The student can revise their answers once." : "Revision permission removed." };
  } catch (err) {
    return fail(err);
  }
}
