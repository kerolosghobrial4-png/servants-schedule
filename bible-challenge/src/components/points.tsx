import type { PointCategory } from "@/db/schema";
import { cx, formatPoints } from "./ui";

export const CATEGORY_LABEL: Record<PointCategory, string> = {
  quiz_correct: "Correct answers",
  quiz_participation: "Participation",
  quiz_completion: "Completion bonus",
  quiz_perfect: "Perfect score",
  quiz_bonus: "Quiz bonus",
  streak_bonus: "Streak bonus",
  achievement: "Achievement",
  admin_adjustment: "Leader adjustment",
  reversal: "Correction",
};

export function PointAmount({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cx("numeral", amount < 0 ? "text-red-bright" : "text-ink", className)}>
      {formatPoints(amount, true)}
    </span>
  );
}
