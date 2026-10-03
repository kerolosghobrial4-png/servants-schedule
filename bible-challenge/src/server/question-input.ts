import { z } from "zod";
import { blockText, lineText } from "@/lib/validation";

/**
 * Shared validation for a question, whether it lives in the bank or inside a
 * quiz. Enforces a sensible answer key for each question type.
 */
export const optionInputSchema = z.object({
  id: z.uuid().optional(),
  label: lineText(300).pipe(z.string().min(1, "Option text is required")),
  isCorrect: z.boolean(),
});

export const questionMetaSchema = z.object({
  book: lineText(40).nullish().transform((v) => v || null),
  chapter: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().int("Chapter must be a whole number").min(1).max(200).nullable(),
  ),
  verses: lineText(40).nullish().transform((v) => v || null),
  topic: lineText(60).nullish().transform((v) => v || null),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .or(z.literal(""))
    .nullish()
    .transform((v) => v || null),
});

const questionBodyBase = z.object({
  type: z.enum(["multiple_choice", "multiple_answer", "true_false", "short_answer"]),
  prompt: blockText(1000).pipe(z.string().min(1, "Question text is required")),
  explanation: blockText(2000).default(""),
  points: z.coerce.number().int().min(0).max(500),
  options: z.array(optionInputSchema).max(10).default([]),
  acceptedAnswers: z.array(lineText(200)).max(20).default([]),
  caseSensitive: z.boolean().default(false),
  manualReview: z.boolean().default(false),
});

type QuestionBodyBase = z.output<typeof questionBodyBase>;

function refineQuestion(q: QuestionBodyBase, ctx: z.RefinementCtx) {
  const correct = q.options.filter((o) => o.isCorrect).length;
  if (q.type === "short_answer") {
    const accepted = q.acceptedAnswers.filter(Boolean);
    if (accepted.length === 0 && !q.manualReview) {
      ctx.addIssue({ code: "custom", path: ["acceptedAnswers"], message: "Add at least one accepted answer, or turn on manual review." });
    }
    return;
  }
  if (q.type === "true_false" && q.options.length !== 2) {
    ctx.addIssue({ code: "custom", path: ["options"], message: "True/false needs exactly two options." });
  }
  if (q.options.length < 2) {
    ctx.addIssue({ code: "custom", path: ["options"], message: "Add at least two options." });
  }
  if (q.type === "multiple_answer" ? correct < 1 : correct !== 1) {
    ctx.addIssue({
      code: "custom",
      path: ["options"],
      message: q.type === "multiple_answer" ? "Mark at least one correct option." : "Mark exactly one correct option.",
    });
  }
}

function normalizeQuestion<T extends QuestionBodyBase>(q: T): T {
  return {
    ...q,
    options: q.type === "short_answer" ? [] : q.options,
    acceptedAnswers: q.type === "short_answer" ? [...new Set(q.acceptedAnswers.filter(Boolean))] : [],
  };
}

/** A question in the bank: body + optional metadata. */
export const bankQuestionSchema = questionBodyBase
  .extend({ meta: questionMetaSchema })
  .superRefine(refineQuestion)
  .transform(normalizeQuestion);

/** A question inside a quiz (a snapshot, optionally linked to / saved into the bank). */
export const quizQuestionInputSchema = questionBodyBase
  .extend({
    id: z.uuid().optional(),
    sourceQuestionId: z.uuid().nullable().optional(),
    saveToBank: z.boolean().default(false),
    meta: questionMetaSchema.optional(),
  })
  .superRefine(refineQuestion)
  .transform(normalizeQuestion);

export type BankQuestionInput = z.output<typeof bankQuestionSchema>;
export type QuizQuestionInput = z.output<typeof quizQuestionInputSchema>;
