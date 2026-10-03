import "server-only";
import type { QuestionType } from "@/db/schema";

/**
 * Pure grading logic. Point values always come from the stored quiz, never
 * from the browser; the client only sends which options/text were chosen.
 */

export type GradableQuestion = {
  id: string;
  type: QuestionType;
  points: number;
  acceptedAnswers: string[];
  caseSensitive: boolean;
  manualReview: boolean;
  options: { id: string; isCorrect: boolean }[];
};

export type RawAnswer = {
  selectedOptionIds: string[];
  textAnswer: string | null;
};

export type AnswerGrade = {
  answered: boolean;
  /** null = waiting for a leader to review */
  isCorrect: boolean | null;
  reviewStatus: "auto" | "pending";
  pointsAwarded: number;
};

/**
 * Normalises a short answer for comparison: unicode-normalised, curly quotes
 * straightened, punctuation removed, whitespace collapsed and (unless the
 * question is case-sensitive) lower-cased. "St. Mark" == "st mark".
 */
export function normalizeShortAnswer(value: string, caseSensitive = false): string {
  let s = value
    .normalize("NFKC")
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!caseSensitive) s = s.toLocaleLowerCase("en-US");
  return s;
}

export function matchesAcceptedAnswer(
  answer: string,
  accepted: string[],
  caseSensitive: boolean,
): boolean {
  const given = normalizeShortAnswer(answer, caseSensitive);
  if (!given) return false;
  return accepted.some((a) => normalizeShortAnswer(a, caseSensitive) === given);
}

export function gradeAnswer(q: GradableQuestion, a: RawAnswer | undefined): AnswerGrade {
  const unanswered: AnswerGrade = { answered: false, isCorrect: false, reviewStatus: "auto", pointsAwarded: 0 };
  if (!a) return unanswered;

  if (q.type === "short_answer") {
    const text = (a.textAnswer ?? "").trim();
    if (!text) return unanswered;
    if (matchesAcceptedAnswer(text, q.acceptedAnswers, q.caseSensitive)) {
      return { answered: true, isCorrect: true, reviewStatus: "auto", pointsAwarded: q.points };
    }
    // Never auto-award an unmatched answer. Either queue it for a leader or mark it wrong.
    if (q.manualReview) {
      return { answered: true, isCorrect: null, reviewStatus: "pending", pointsAwarded: 0 };
    }
    return { answered: true, isCorrect: false, reviewStatus: "auto", pointsAwarded: 0 };
  }

  const selected = new Set(a.selectedOptionIds);
  if (selected.size === 0) return unanswered;
  const correct = new Set(q.options.filter((o) => o.isCorrect).map((o) => o.id));

  let isCorrect: boolean;
  if (q.type === "multiple_answer") {
    // All-or-nothing: exactly the set of correct options.
    isCorrect = selected.size === correct.size && [...selected].every((id) => correct.has(id));
  } else {
    isCorrect = selected.size === 1 && correct.has([...selected][0]);
  }
  return { answered: true, isCorrect, reviewStatus: "auto", pointsAwarded: isCorrect ? q.points : 0 };
}

export type GradeSummary = {
  scorePoints: number;
  maxPoints: number;
  correctCount: number;
  answeredCount: number;
  pendingCount: number;
  questionCount: number;
  complete: boolean;
  perfect: boolean;
};

export function summarize(
  questions: Pick<GradableQuestion, "points">[],
  grades: Pick<AnswerGrade, "answered" | "isCorrect" | "pointsAwarded">[],
): GradeSummary {
  const questionCount = questions.length;
  const maxPoints = questions.reduce((s, q) => s + q.points, 0);
  const scorePoints = grades.reduce((s, g) => s + g.pointsAwarded, 0);
  const correctCount = grades.filter((g) => g.isCorrect === true).length;
  const answeredCount = grades.filter((g) => g.answered).length;
  const pendingCount = grades.filter((g) => g.isCorrect === null).length;
  return {
    scorePoints,
    maxPoints,
    correctCount,
    answeredCount,
    pendingCount,
    questionCount,
    complete: questionCount > 0 && answeredCount === questionCount,
    perfect: questionCount > 0 && correctCount === questionCount,
  };
}

export type QuizAwardRules = { participation: number; completion: number; perfect: number };

export type DesiredAward = {
  category: "quiz_participation" | "quiz_correct" | "quiz_completion" | "quiz_perfect" | "quiz_bonus";
  amount: number;
};

/** What a submission *should* be worth. The ledger is reconciled to this. */
export function desiredQuizAwards(
  summary: GradeSummary,
  rules: QuizAwardRules,
  quizBonus: { points: number; condition: "completion" | "perfect" },
): DesiredAward[] {
  const bonusEarned =
    quizBonus.points > 0 && (quizBonus.condition === "completion" ? summary.complete : summary.perfect);
  return [
    { category: "quiz_participation", amount: summary.answeredCount > 0 ? rules.participation : 0 },
    { category: "quiz_correct", amount: summary.scorePoints },
    { category: "quiz_completion", amount: summary.complete ? rules.completion : 0 },
    { category: "quiz_perfect", amount: summary.perfect ? rules.perfect : 0 },
    { category: "quiz_bonus", amount: bonusEarned ? quizBonus.points : 0 },
  ];
}
