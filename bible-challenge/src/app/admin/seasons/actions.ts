"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { formString, uuidSchema, zodToFormState } from "@/lib/validation";
import { SeasonError, createSeason, finalizeSeason, seasonInputSchema, setSeasonParticipants, updateSeason } from "@/server/seasons";

function fail(err: unknown): FormState {
  if (err instanceof ForbiddenError || err instanceof SeasonError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong. Please try again." };
}

function parseSeason(fd: FormData) {
  return seasonInputSchema.safeParse({
    name: formString(fd, "name"),
    description: formString(fd, "description"),
    startsOn: formString(fd, "startsOn"),
    endsOn: formString(fd, "endsOn"),
    isActive: fd.get("isActive") === "on",
  });
}

export async function createSeasonAction(_prev: FormState, fd: FormData): Promise<FormState> {
  let id: string;
  try {
    const actor = await authorize("seasons.manage");
    const parsed = parseSeason(fd);
    if (!parsed.success) return zodToFormState(parsed.error);
    id = await createSeason(db, { input: parsed.data, enrollAll: fd.get("enrollAll") === "on", actorId: actor.id });
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/", "layout");
  redirect(`/admin/seasons/${id}?created=1`);
}

export async function updateSeasonAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("seasons.manage");
    const id = uuidSchema.parse(fd.get("id"));
    const parsed = parseSeason(fd);
    if (!parsed.success) return zodToFormState(parsed.error);
    await updateSeason(db, { id, input: parsed.data, actorId: actor.id });
    revalidatePath("/", "layout");
    return { ok: true, message: "Season saved." };
  } catch (err) {
    return fail(err);
  }
}

export async function setParticipantsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("seasons.manage");
    const id = uuidSchema.parse(fd.get("id"));
    const userIds = z.array(uuidSchema).max(1000).parse(fd.getAll("userIds"));
    await setSeasonParticipants(db, { id, userIds, actorId: actor.id });
    revalidatePath("/", "layout");
    return { ok: true, message: `${userIds.length} participant${userIds.length === 1 ? "" : "s"} saved.` };
  } catch (err) {
    return fail(err);
  }
}

export async function finalizeSeasonAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("seasons.manage");
    const n = await finalizeSeason(db, { id: uuidSchema.parse(fd.get("id")), actorId: actor.id });
    revalidatePath("/", "layout");
    return { ok: true, message: `Season finalized. ${n} badge${n === 1 ? "" : "s"} awarded.` };
  } catch (err) {
    return fail(err);
  }
}
