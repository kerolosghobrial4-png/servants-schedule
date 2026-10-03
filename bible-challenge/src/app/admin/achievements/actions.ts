"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { achievements, users } from "@/db/schema";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { blockText, formString, lineText, uuidSchema, zodToFormState } from "@/lib/validation";
import { ACHIEVEMENT_ICONS, AchievementError, grantAchievement, revokeAchievement, saveAchievement } from "@/server/achievements";
import { audit } from "@/server/audit";

function fail(err: unknown): FormState {
  if (err instanceof ForbiddenError || err instanceof AchievementError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong. Please try again." };
}

const schema = z
  .object({
    id: uuidSchema.optional(),
    key: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]{2,40}$/, "Use 2–40 lowercase letters, numbers or dashes"),
    name: lineText(40).pipe(z.string().min(1, "Required")),
    description: blockText(200).pipe(z.string().min(1, "Required")),
    icon: z.enum(ACHIEVEMENT_ICONS),
    criteriaType: z.enum(["quizzes_completed", "perfect_quizzes", "streak", "total_points", "season_rank", "manual"]),
    threshold: z.coerce.number().int().min(1).max(100000).optional(),
    pointsReward: z.coerce.number().int().min(0).max(1000),
    isActive: z.boolean(),
    position: z.coerce.number().int().min(0).max(1000),
  })
  .refine((v) => v.criteriaType === "manual" || v.threshold, { path: ["threshold"], message: "Set a target number" });

export async function saveAchievementAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("achievements.manage");
    const parsed = schema.safeParse({
      id: formString(fd, "id") || undefined,
      key: formString(fd, "key"),
      name: formString(fd, "name"),
      description: formString(fd, "description"),
      icon: formString(fd, "icon"),
      criteriaType: formString(fd, "criteriaType"),
      threshold: formString(fd, "threshold") || undefined,
      pointsReward: formString(fd, "pointsReward") || "0",
      isActive: fd.get("isActive") === "on",
      position: formString(fd, "position") || "0",
    });
    if (!parsed.success) return zodToFormState(parsed.error);
    const v = parsed.data;
    const criteria = v.criteriaType === "manual" ? { type: "manual" as const } : { type: v.criteriaType, threshold: v.threshold! };
    await db.transaction((tx) =>
      saveAchievement(tx, {
        id: v.id,
        actorId: actor.id,
        input: {
          key: v.key,
          name: v.name,
          description: v.description,
          icon: v.icon,
          criteria,
          pointsReward: v.pointsReward,
          isActive: v.isActive,
          position: v.position,
        },
      }),
    );
    revalidatePath("/", "layout");
    return { ok: true, message: v.id ? "Saved." : "Achievement created. Students who already qualify will earn it after their next quiz." };
  } catch (err) {
    return fail(err);
  }
}

export async function grantAchievementAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("achievements.grant");
    const userId = uuidSchema.parse(fd.get("userId"));
    const achievementId = uuidSchema.parse(fd.get("achievementId"));
    const note = lineText(200).parse(formString(fd, "note"));
    const student = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!student || student.role !== "student") return { error: "Choose a student." };
    const achievement = await db.query.achievements.findFirst({ where: eq(achievements.id, achievementId) });
    if (!achievement) return { error: "Choose an achievement." };
    const granted = await db.transaction(async (tx) => {
      const ok = await grantAchievement(tx, { userId, achievementId, awardedBy: actor.id, note: note || null });
      if (ok) {
        await audit(tx, {
          actorId: actor.id,
          action: "achievement.granted",
          targetType: "user",
          targetId: userId,
          details: { achievementId, name: achievement.name, note },
        });
      }
      return ok;
    });
    revalidatePath("/", "layout");
    return granted
      ? { ok: true, message: `${achievement.name} awarded to ${student.displayName}.` }
      : { error: `${student.displayName} already has ${achievement.name}.` };
  } catch (err) {
    return fail(err);
  }
}

export async function revokeAchievementAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("achievements.grant");
    const id = uuidSchema.parse(fd.get("id"));
    await db.transaction((tx) => revokeAchievement(tx, { userAchievementId: id, actorId: actor.id, reason: "Badge revoked by a leader" }));
    revalidatePath("/", "layout");
    return { ok: true, message: "Badge removed." };
  } catch (err) {
    return fail(err);
  }
}
