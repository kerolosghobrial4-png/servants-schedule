"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import type { FormState } from "@/components/form-state";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { uuidSchema, zodToFormState } from "@/lib/validation";
import { searchBank } from "@/server/question-bank";
import {
  QuizAdminError,
  deleteDraftQuiz,
  getBankQuestionsForQuiz,
  quizInputSchema,
  saveQuiz,
  setQuizStatus,
} from "@/server/quiz-admin";
import { regradeQuiz } from "@/server/submissions";

function fail(err: unknown): FormState {
  if (err instanceof QuizAdminError || err instanceof ForbiddenError) return { error: err.message };
  console.error(err);
  return { error: "Something went wrong saving the quiz. Please try again." };
}

export async function saveQuizAction(
  quizId: string | null,
  payload: unknown,
  intent: "draft" | "publish" | "keep",
): Promise<FormState> {
  let target: string;
  try {
    const actor = await authorize("quizzes.manage");
    if (quizId !== null && !uuidSchema.safeParse(quizId).success) return { error: "Invalid quiz." };
    if (!["draft", "publish", "keep"].includes(intent)) return { error: "Invalid action." };
    const parsed = quizInputSchema.safeParse(payload);
    if (!parsed.success) return zodToFormState(parsed.error);
    const res = await saveQuiz(db, { quizId: quizId ?? undefined, input: parsed.data, actorId: actor.id, intent });
    const params = new URLSearchParams({ saved: intent });
    if (res.regraded) params.set("regraded", String(res.regraded));
    target = `/admin/quizzes/${res.quizId}?${params}`;
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/", "layout");
  redirect(target);
}

export async function setQuizStatusAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("quizzes.manage");
    const quizId = uuidSchema.parse(fd.get("quizId"));
    const status = z.enum(["draft", "published", "archived"]).parse(fd.get("status"));
    await setQuizStatus(db, { quizId, status, actorId: actor.id });
    revalidatePath("/", "layout");
    return { ok: true, message: status === "published" ? "Published." : status === "archived" ? "Archived." : "Moved to drafts." };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteQuizAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("quizzes.manage");
    await deleteDraftQuiz(db, { quizId: uuidSchema.parse(fd.get("quizId")), actorId: actor.id });
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes?deleted=1");
}

export async function regradeQuizAction(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const actor = await authorize("submissions.review");
    const n = await regradeQuiz(db, uuidSchema.parse(fd.get("quizId")), actor.id);
    revalidatePath("/", "layout");
    return { ok: true, message: `Re-graded ${n} submission${n === 1 ? "" : "s"}. Points were corrected where needed.` };
  } catch (err) {
    return fail(err);
  }
}

export async function searchBankAction(filters: { q?: string; book?: string; topic?: string }) {
  await authorize("quizzes.manage");
  const f = z
    .object({ q: z.string().max(100).optional(), book: z.string().max(40).optional(), topic: z.string().max(60).optional() })
    .parse(filters);
  const rows = await searchBank(db, { ...f, limit: 30 });
  return rows.map((r) => ({ id: r.id, prompt: r.prompt, type: r.type, book: r.book, chapter: r.chapter, topic: r.topic }));
}

export async function loadBankQuestionsAction(ids: string[]) {
  await authorize("quizzes.manage");
  const valid = z.array(uuidSchema).max(50).parse(ids);
  const rows = await getBankQuestionsForQuiz(db, valid);
  return rows.map((q) => ({
    sourceQuestionId: q.id,
    type: q.type,
    prompt: q.prompt,
    explanation: q.explanation,
    points: q.points,
    acceptedAnswers: q.acceptedAnswers,
    caseSensitive: q.caseSensitive,
    manualReview: q.manualReview,
    options: q.options.map((o) => ({ label: o.label, isCorrect: o.isCorrect })),
    meta: { book: q.book, chapter: q.chapter, verses: q.verses, topic: q.topic, difficulty: q.difficulty },
  }));
}
