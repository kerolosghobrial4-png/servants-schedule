"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { uuidSchema } from "@/lib/validation";
import { MAX_TEXT_ANSWER, SubmissionError, submitQuiz } from "@/server/submissions";

const answersSchema = z
  .array(
    z.object({
      questionId: uuidSchema,
      selectedOptionIds: z.array(uuidSchema).max(20),
      textAnswer: z.string().max(MAX_TEXT_ANSWER * 2).nullable(),
    }),
  )
  .max(100);

/**
 * The browser sends only *which* answers were chosen. Whether they're right,
 * and how many points that's worth, is decided entirely on the server.
 */
export async function submitQuizAction(quizId: string, answers: unknown): Promise<{ error: string }> {
  const viewer = await requireStudent();
  const id = uuidSchema.safeParse(quizId);
  const parsed = answersSchema.safeParse(answers);
  if (!id.success || !parsed.success) return { error: "Something about that submission wasn't valid. Refresh and try again." };

  try {
    await submitQuiz(db, { userId: viewer.id, quizId: id.data, answers: parsed.data });
  } catch (err) {
    if (err instanceof SubmissionError) return { error: err.message };
    console.error("submitQuiz failed", err);
    return { error: "We couldn't save your answers. Please try again." };
  }
  redirect(`/quiz/${id.data}?submitted=1`);
}
