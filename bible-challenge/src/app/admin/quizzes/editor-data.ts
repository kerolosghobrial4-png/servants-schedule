import "server-only";
import type { EditorQuestion } from "@/lib/question-model";
import { dateInTz, timeInTz } from "@/lib/time";
import type { getQuizForEditing } from "@/server/quiz-admin";
import type { EditorQuiz } from "./quiz-editor";

type Loaded = NonNullable<Awaited<ReturnType<typeof getQuizForEditing>>>;

let n = 0;
const key = () => `s${(n++).toString(36)}`;

/** Maps a stored quiz to the editor's state. `asCopy` drops ids so it saves as a new quiz. */
export function toEditorQuiz(loaded: Loaded, tz: string, opts: { asCopy?: boolean; date?: string } = {}): EditorQuiz {
  const { quiz } = loaded;
  const questions: EditorQuestion[] = loaded.questions.map((q) => ({
    key: key(),
    id: opts.asCopy ? undefined : q.id,
    sourceQuestionId: q.sourceQuestionId,
    saveToBank: false,
    type: q.type,
    prompt: q.prompt,
    explanation: q.explanation,
    points: String(q.points),
    options: q.options.map((o) => ({ key: key(), id: opts.asCopy ? undefined : o.id, label: o.label, isCorrect: o.isCorrect })),
    acceptedAnswersText: q.acceptedAnswers.join("\n"),
    caseSensitive: q.caseSensitive,
    manualReview: q.manualReview,
    meta: { book: "", chapter: "", verses: "", topic: "", difficulty: "" },
  }));
  const quizDate = opts.date ?? quiz.quizDate;
  const openDate = dateInTz(quiz.opensAt, tz);
  const closeDate = dateInTz(quiz.closesAt, tz);
  // Preserve the open→close day gap when copying to a new date.
  const dayGap = Math.round((Date.parse(closeDate) - Date.parse(openDate)) / 86_400_000);
  const endDate = opts.date
    ? new Date(Date.parse(quizDate) + dayGap * 86_400_000).toISOString().slice(0, 10)
    : closeDate;
  return {
    title: quiz.title,
    passage: quiz.passage,
    topic: quiz.topic,
    studyNotes: quiz.studyNotes,
    quizDate,
    startTime: timeInTz(quiz.opensAt, tz),
    endDate,
    endTime: timeInTz(quiz.closesAt, tz),
    answerReveal: quiz.answerReveal,
    bonusPoints: String(quiz.bonusPoints),
    bonusCondition: quiz.bonusCondition,
    countsForStreak: quiz.countsForStreak,
    questions,
  };
}

export function blankEditorQuiz(date: string): EditorQuiz {
  return {
    title: "",
    passage: "",
    topic: "",
    studyNotes: "",
    quizDate: date,
    startTime: "06:00",
    endDate: date,
    endTime: "23:59",
    answerReveal: "immediate",
    bonusPoints: "0",
    bonusCondition: "perfect",
    countsForStreak: true,
    questions: [],
  };
}
