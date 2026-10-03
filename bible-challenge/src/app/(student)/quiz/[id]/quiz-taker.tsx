"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button, Notice, cx } from "@/components/ui";
import { submitQuizAction } from "../actions";

export type TakerQuestion = {
  id: string;
  type: "multiple_choice" | "multiple_answer" | "true_false" | "short_answer";
  prompt: string;
  points: number;
  options: { id: string; label: string }[];
};

type Answer = { selected: string[]; text: string };

const TYPE_HINT: Record<TakerQuestion["type"], string> = {
  multiple_choice: "Choose one",
  multiple_answer: "Choose all that apply",
  true_false: "True or false",
  short_answer: "Type your answer",
};

const LETTERS = "ABCDEFGHIJ";

function isAnswered(q: TakerQuestion, a: Answer | undefined) {
  if (!a) return false;
  return q.type === "short_answer" ? a.text.trim().length > 0 : a.selected.length > 0;
}

export function QuizTaker({
  quizId,
  storageKey,
  questions,
  isRevision,
  preview = false,
}: {
  quizId: string;
  storageKey: string;
  questions: TakerQuestion[];
  isRevision: boolean;
  /** Leader preview: nothing is saved or submitted. */
  preview?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [index, setIndex] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [restored, setRestored] = useState(preview);

  // Keep in-progress answers on this device only, so a refresh doesn't lose work.
  useEffect(() => {
    if (preview) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, Answer>;
        const valid = new Set(questions.map((q) => q.id));
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from storage
        setAnswers(Object.fromEntries(Object.entries(parsed).filter(([k]) => valid.has(k))));
      }
    } catch {
      /* ignore */
    }
    setRestored(true);
  }, [storageKey, questions, preview]);

  useEffect(() => {
    if (!restored || preview) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers, restored, storageKey, preview]);

  const answeredCount = useMemo(
    () => questions.filter((q) => isAnswered(q, answers[q.id])).length,
    [questions, answers],
  );

  const q = questions[index];
  const a = answers[q.id] ?? { selected: [], text: "" };

  function update(next: Answer) {
    setAnswers((prev) => ({ ...prev, [q.id]: next }));
  }

  function toggle(optionId: string) {
    if (q.type === "multiple_answer") {
      update({ ...a, selected: a.selected.includes(optionId) ? a.selected.filter((x) => x !== optionId) : [...a.selected, optionId] });
    } else {
      update({ ...a, selected: [optionId] });
    }
  }

  function go(i: number) {
    setReviewing(false);
    setIndex(i);
    window.scrollTo({ top: 0 });
  }

  function submit() {
    setError(null);
    if (preview) {
      setError("Preview only — answers aren't submitted. Students will see their score here.");
      return;
    }
    const payload = questions.map((question) => {
      const ans = answers[question.id];
      return {
        questionId: question.id,
        selectedOptionIds: question.type === "short_answer" ? [] : (ans?.selected ?? []),
        textAnswer: question.type === "short_answer" ? (ans?.text ?? "").trim() || null : null,
      };
    });
    startTransition(async () => {
      const res = await submitQuizAction(quizId, payload);
      // Only reached on error — success redirects to the results page,
      // which clears the saved draft.
      if (res?.error) setError(res.error);
    });
  }

  const progress = (
    <div className="sticky top-0 z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-bg/95 backdrop-blur border-b border-line mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="label">{reviewing ? "Review" : `Question ${index + 1} of ${questions.length}`}</span>
        <span className="label">
          {answeredCount}/{questions.length} answered
        </span>
      </div>
      <ol className="flex gap-1" aria-label="Questions">
        {questions.map((question, i) => (
          <li key={question.id} className="flex-1">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to question ${i + 1}${isAnswered(question, answers[question.id]) ? " (answered)" : ""}`}
              aria-current={!reviewing && i === index ? "step" : undefined}
              className="block w-full py-2"
            >
              <span
                className={cx(
                  "block h-1.5",
                  !reviewing && i === index
                    ? "bg-ink"
                    : isAnswered(question, answers[question.id])
                      ? "bg-red"
                      : "bg-line-strong",
                )}
              />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );

  if (reviewing) {
    const unanswered = questions.length - answeredCount;
    return (
      <div>
        {progress}
        <h2 className="display text-3xl mb-6">Review your answers</h2>
        <ol className="divide-y divide-line border-y border-line mb-8">
          {questions.map((question, i) => {
            const ans = answers[question.id];
            const answered = isAnswered(question, ans);
            const summary =
              question.type === "short_answer"
                ? ans?.text
                : question.options
                    .filter((o) => ans?.selected.includes(o.id))
                    .map((o) => o.label)
                    .join(", ");
            return (
              <li key={question.id}>
                <button type="button" onClick={() => go(i)} className="w-full text-left py-3 flex gap-4 items-baseline">
                  <span className="numeral text-xl text-dim w-6 shrink-0">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-muted line-clamp-2">{question.prompt}</span>
                    <span className={cx("block mt-0.5", answered ? "text-ink" : "text-red-bright")}>
                      {answered ? summary : "Not answered"}
                    </span>
                  </span>
                  <span className="label shrink-0">Edit</span>
                </button>
              </li>
            );
          })}
        </ol>
        {unanswered > 0 && (
          <div className="mb-4">
            <Notice>
              {unanswered} question{unanswered === 1 ? " is" : "s are"} unanswered. You can still submit, but answering
              everything earns the completion bonus.
            </Notice>
          </div>
        )}
        {error && (
          <div className="mb-4">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
        <p className="text-sm text-dim mb-4">
          {isRevision
            ? "Your leader allowed one revision. Submitting replaces your previous answers."
            : "Once you submit, your answers are final."}
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button type="button" variant="secondary" size="lg" onClick={() => go(questions.length - 1)} disabled={pending}>
            <ArrowLeft size={20} /> Back
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={pending || answeredCount === 0}
            onClick={submit}
          >
            {pending ? "Submitting…" : "Submit answers"} {!pending && <Check size={20} />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {progress}
      <fieldset>
        <legend className="w-full">
          <span className="label text-red-bright">
            {TYPE_HINT[q.type]} · {q.points} pts
          </span>
          <span className="block font-serif text-2xl sm:text-3xl leading-snug mt-2 mb-6">{q.prompt}</span>
        </legend>

        {q.type === "short_answer" ? (
          <div>
            <label htmlFor={`answer-${q.id}`} className="sr-only">
              Your answer
            </label>
            <input
              id={`answer-${q.id}`}
              className="field text-xl"
              value={a.text}
              maxLength={300}
              autoComplete="off"
              autoCapitalize="sentences"
              placeholder="Your answer"
              onChange={(e) => update({ ...a, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (index < questions.length - 1) go(index + 1);
                  else setReviewing(true);
                }
              }}
            />
          </div>
        ) : (
          <ul className={cx("grid gap-2.5", q.type === "true_false" && "grid-cols-2")}>
            {q.options.map((o, i) => {
              const selected = a.selected.includes(o.id);
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    role={q.type === "multiple_answer" ? "checkbox" : "radio"}
                    aria-checked={selected}
                    onClick={() => toggle(o.id)}
                    className={cx(
                      "w-full min-h-14 flex items-center gap-4 text-left px-4 py-3 border rounded-[4px] transition-colors",
                      selected ? "border-red bg-red-deep/50" : "border-line-strong hover:border-muted",
                    )}
                  >
                    {q.type !== "true_false" && (
                      <span
                        className={cx(
                          "numeral text-xl w-8 h-8 shrink-0 flex items-center justify-center border",
                          q.type === "multiple_answer" ? "rounded-[3px]" : "rounded-full",
                          selected ? "bg-red border-red text-ink" : "border-line-strong text-muted",
                        )}
                      >
                        {q.type === "multiple_answer" && selected ? <Check size={18} /> : LETTERS[i]}
                      </span>
                    )}
                    <span className={cx("text-lg leading-snug", q.type === "true_false" && "display text-2xl w-full text-center")}>
                      {o.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>

      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous question"
        >
          <ArrowLeft size={20} />
        </Button>
        {index < questions.length - 1 ? (
          <Button type="button" size="lg" className="flex-1" onClick={() => go(index + 1)}>
            Next <ArrowRight size={20} />
          </Button>
        ) : (
          <Button type="button" size="lg" className="flex-1" onClick={() => setReviewing(true)}>
            Review &amp; submit <ArrowRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}

/** Rendered on the results page to drop the local draft once answers are saved. */
export function ClearDraft({ storageKey }: { storageKey: string }) {
  useEffect(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);
  return null;
}
