"use client";

import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import { BIBLE_BOOKS, TOPIC_SUGGESTIONS } from "@/lib/bible";
import { cx } from "./ui";

import {
  TYPE_LABELS,
  newKey,
  optionsForType,
  type EditorOption,
  type EditorQuestion,
  type QuestionType,
} from "@/lib/question-model";



const small = "field !min-h-10 !py-2";

export function QuestionFields({
  q,
  index,
  total,
  onChange,
  onMove,
  onRemove,
  locked,
  showBankToggle = true,
  errors,
}: {
  q: EditorQuestion;
  index?: number;
  total?: number;
  onChange: (q: EditorQuestion) => void;
  onMove?: (dir: -1 | 1) => void;
  onRemove?: () => void;
  /** Students have answered: type can't change and options can't be removed. */
  locked?: boolean;
  showBankToggle?: boolean;
  errors?: Record<string, string>;
}) {
  const set = (patch: Partial<EditorQuestion>) => onChange({ ...q, ...patch });
  const setOption = (i: number, patch: Partial<EditorOption>) => {
    let options = q.options.map((o, j) => (j === i ? { ...o, ...patch } : o));
    if (patch.isCorrect && (q.type === "multiple_choice" || q.type === "true_false")) {
      options = options.map((o, j) => ({ ...o, isCorrect: j === i }));
    }
    set({ options });
  };
  const err = (k: string) => errors?.[k];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {index !== undefined && <span className="numeral text-3xl text-dim w-8">{index + 1}</span>}
        <select
          aria-label="Question type"
          value={q.type}
          disabled={locked}
          onChange={(e) => {
            const type = e.target.value as QuestionType;
            set({ type, options: optionsForType(type, q.options) });
          }}
          className={cx(small, "!w-auto")}
        >
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <span className="label">Points</span>
          <input
            type="number"
            min={0}
            max={500}
            value={q.points}
            onChange={(e) => set({ points: e.target.value })}
            className={cx(small, "!w-20")}
          />
        </label>
        {q.sourceQuestionId && <span className="label text-gold">From bank</span>}
        <span className="flex-1" />
        {onMove && (
          <>
            <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="p-2 text-muted hover:text-ink disabled:opacity-30" aria-label="Move up">
              <ArrowUp size={18} />
            </button>
            <button type="button" onClick={() => onMove(1)} disabled={index === (total ?? 1) - 1} className="p-2 text-muted hover:text-ink disabled:opacity-30" aria-label="Move down">
              <ArrowDown size={18} />
            </button>
          </>
        )}
        {onRemove && !locked && (
          <button type="button" onClick={onRemove} className="p-2 text-muted hover:text-red-bright" aria-label="Remove question">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div>
        <textarea
          aria-label="Question"
          placeholder="What does Jesus call the peacemakers?"
          value={q.prompt}
          onChange={(e) => set({ prompt: e.target.value })}
          rows={2}
          className="field font-serif text-lg"
        />
        {err("prompt") && <p className="text-xs text-red-bright mt-1">{err("prompt")}</p>}
      </div>

      {q.type === "short_answer" ? (
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor={`acc-${q.key}`}>
            Accepted answers — one per line (alternate spellings too)
          </label>
          <textarea
            id={`acc-${q.key}`}
            value={q.acceptedAnswersText}
            onChange={(e) => set({ acceptedAnswersText: e.target.value })}
            rows={3}
            placeholder={"Peter\nSimon Peter\nSt. Peter"}
            className="field"
          />
          <p className="text-xs text-dim">
            Matching ignores punctuation and extra spaces. Answers that don&apos;t match are never auto-awarded.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={q.caseSensitive} onChange={(e) => set({ caseSensitive: e.target.checked })} className="h-5 w-5 accent-[var(--color-red)]" />
            Case-sensitive
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={q.manualReview} onChange={(e) => set({ manualReview: e.target.checked })} className="h-5 w-5 accent-[var(--color-red)]" />
            Send non-matching answers to a leader for review
          </label>
          {err("acceptedAnswers") && <p className="text-xs text-red-bright">{err("acceptedAnswers")}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="label">
            {q.type === "multiple_answer" ? "Options — tick every correct one" : "Options — tick the correct one"}
          </p>
          <ul className="flex flex-col gap-2">
            {q.options.map((o, i) => (
              <li key={o.key} className="flex items-center gap-2">
                <button
                  type="button"
                  role={q.type === "multiple_answer" ? "checkbox" : "radio"}
                  aria-checked={o.isCorrect}
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} correct`}
                  onClick={() => setOption(i, { isCorrect: q.type === "multiple_answer" ? !o.isCorrect : true })}
                  className={cx(
                    "w-10 h-10 shrink-0 flex items-center justify-center border numeral text-lg",
                    q.type === "multiple_answer" ? "rounded-[3px]" : "rounded-full",
                    o.isCorrect ? "bg-green border-green text-bg" : "border-line-strong text-muted hover:border-ink",
                  )}
                >
                  {o.isCorrect ? <Check size={18} /> : String.fromCharCode(65 + i)}
                </button>
                <input
                  aria-label={`Option ${String.fromCharCode(65 + i)}`}
                  value={o.label}
                  readOnly={q.type === "true_false"}
                  onChange={(e) => setOption(i, { label: e.target.value })}
                  className={cx(small, "flex-1")}
                />
                {q.type !== "true_false" && !(locked && o.id) && q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => set({ options: q.options.filter((_, j) => j !== i) })}
                    className="p-2 text-dim hover:text-red-bright"
                    aria-label={`Remove option ${String.fromCharCode(65 + i)}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {q.type !== "true_false" && q.options.length < 10 && (
            <button
              type="button"
              onClick={() => set({ options: [...q.options, { key: newKey(), label: "", isCorrect: false }] })}
              className="label self-start flex items-center gap-1 hover:text-ink py-1"
            >
              <Plus size={14} /> Add option
            </button>
          )}
          {err("options") && <p className="text-xs text-red-bright">{err("options")}</p>}
        </div>
      )}

      <div>
        <label className="label" htmlFor={`exp-${q.key}`}>
          Explanation (shown with the answer)
        </label>
        <textarea
          id={`exp-${q.key}`}
          value={q.explanation}
          onChange={(e) => set({ explanation: e.target.value })}
          rows={2}
          placeholder='"Blessed are the peacemakers, for they shall be called sons of God." (Matthew 5:9)'
          className="field mt-1.5"
        />
      </div>

      <details className="group" open={showBankToggle ? undefined : true}>
        <summary className="label cursor-pointer list-none hover:text-ink">
          <span className="group-open:hidden">+ </span>Tags: book, chapter, topic, difficulty
          {(q.meta.book || q.meta.topic) && (
            <span className="text-muted normal-case tracking-normal font-sans ml-2">
              {[q.meta.book && `${q.meta.book} ${q.meta.chapter}`.trim(), q.meta.topic].filter(Boolean).join(" · ")}
            </span>
          )}
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
          <select aria-label="Book" value={q.meta.book} onChange={(e) => set({ meta: { ...q.meta, book: e.target.value } })} className={cx(small, "col-span-2")}>
            <option value="">Book…</option>
            {BIBLE_BOOKS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <input aria-label="Chapter" placeholder="Ch." inputMode="numeric" value={q.meta.chapter} onChange={(e) => set({ meta: { ...q.meta, chapter: e.target.value.replace(/\D/g, "") } })} className={small} />
          <input aria-label="Verses" placeholder="Verses" value={q.meta.verses} onChange={(e) => set({ meta: { ...q.meta, verses: e.target.value } })} className={small} />
          <select aria-label="Difficulty" value={q.meta.difficulty} onChange={(e) => set({ meta: { ...q.meta, difficulty: e.target.value } })} className={small}>
            <option value="">Difficulty…</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            aria-label="Topic"
            placeholder="Topic"
            list="topic-suggestions"
            value={q.meta.topic}
            onChange={(e) => set({ meta: { ...q.meta, topic: e.target.value } })}
            className={cx(small, "col-span-2 sm:col-span-5")}
          />
          <datalist id="topic-suggestions">
            {TOPIC_SUGGESTIONS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        {showBankToggle && !q.sourceQuestionId && !q.id && (
          <label className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" checked={q.saveToBank} onChange={(e) => set({ saveToBank: e.target.checked })} className="h-5 w-5 accent-[var(--color-red)]" />
            Also save to the question bank for reuse
          </label>
        )}
      </details>
    </div>
  );
}
