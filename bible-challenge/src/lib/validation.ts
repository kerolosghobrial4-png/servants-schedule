import { z } from "zod";
import type { FormState } from "@/components/form-state";

/** Converts a Zod failure into the FormState shape forms render. */
export function zodToFormState(error: z.ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    fieldErrors[key] ??= issue.message;
  }
  return { error: "Please fix the highlighted fields.", fieldErrors };
}

export const uuidSchema = z.uuid({ message: "Invalid id" });

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "At least 3 characters")
  .max(32, "At most 32 characters")
  .regex(/^[a-z0-9._-]+$/, "Letters, numbers, dot, dash and underscore only");

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(24, "At most 24 characters")
  .regex(/^[\p{L}\p{N} .'-]+$/u, "Letters, numbers, spaces, apostrophes and dashes only");

/** Single-line text with control characters stripped. */
export const lineText = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]/g, " ").trim())
    .pipe(z.string().max(max, `At most ${max} characters`));

/** Multi-line text: keeps newlines, strips other control characters. */
export const blockText = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/\r\n/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "").trim())
    .pipe(z.string().max(max, `At most ${max} characters`));

export function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}
