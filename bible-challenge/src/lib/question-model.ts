/** Editor state for questions — shared by server pages and client editors. */

export type QuestionType = "multiple_choice" | "multiple_answer" | "true_false" | "short_answer";

export type EditorOption = { key: string; id?: string; label: string; isCorrect: boolean };
export type EditorMeta = { book: string; chapter: string; verses: string; topic: string; difficulty: string };
export type EditorQuestion = {
  key: string;
  id?: string;
  sourceQuestionId?: string | null;
  saveToBank: boolean;
  type: QuestionType;
  prompt: string;
  explanation: string;
  points: string;
  options: EditorOption[];
  acceptedAnswersText: string;
  caseSensitive: boolean;
  manualReview: boolean;
  meta: EditorMeta;
};

export const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple choice",
  multiple_answer: "Multiple answer",
  true_false: "True / False",
  short_answer: "Short answer",
};

let counter = 0;
export const newKey = () => `k${Date.now().toString(36)}${(counter++).toString(36)}`;

export const emptyMeta = (): EditorMeta => ({ book: "", chapter: "", verses: "", topic: "", difficulty: "" });

export function blankQuestion(points: number, type: QuestionType = "multiple_choice"): EditorQuestion {
  return {
    key: newKey(),
    saveToBank: true,
    type,
    prompt: "",
    explanation: "",
    points: String(points),
    options: optionsForType(type, []),
    acceptedAnswersText: "",
    caseSensitive: false,
    manualReview: false,
    meta: emptyMeta(),
  };
}

export function optionsForType(type: QuestionType, current: EditorOption[]): EditorOption[] {
  if (type === "short_answer") return [];
  if (type === "true_false") {
    const wasTrue = current.find((o) => o.label === "True")?.isCorrect ?? true;
    return [
      { key: newKey(), id: current[0]?.id, label: "True", isCorrect: wasTrue },
      { key: newKey(), id: current[1]?.id, label: "False", isCorrect: !wasTrue },
    ];
  }
  if (current.length >= 2) {
    if (type === "multiple_choice") {
      const first = current.findIndex((o) => o.isCorrect);
      return current.map((o, i) => ({ ...o, isCorrect: i === first }));
    }
    return current;
  }
  return ["", "", "", ""].map((label) => ({ key: newKey(), label, isCorrect: false }));
}

/** Converts the editor state to the server's input shape (validated again on the server). */
export function toPayload(q: EditorQuestion) {
  return {
    id: q.id,
    sourceQuestionId: q.sourceQuestionId ?? null,
    saveToBank: q.saveToBank,
    type: q.type,
    prompt: q.prompt,
    explanation: q.explanation,
    points: q.points,
    options: q.options.map((o) => ({ id: o.id, label: o.label, isCorrect: o.isCorrect })),
    acceptedAnswers: q.acceptedAnswersText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    caseSensitive: q.caseSensitive,
    manualReview: q.manualReview,
    meta: {
      book: q.meta.book || null,
      chapter: q.meta.chapter || null,
      verses: q.meta.verses || null,
      topic: q.meta.topic || null,
      difficulty: q.meta.difficulty || null,
    },
  };
}

