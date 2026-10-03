"use client";

import { useState, useTransition } from "react";
import { Plus, Search } from "lucide-react";
import { QuestionFields } from "@/components/question-editor";
import { TYPE_LABELS, blankQuestion, emptyMeta, newKey, toPayload, type EditorQuestion } from "@/lib/question-model";
import { Button, Checkbox, Field, Notice, SectionHeading, cx } from "@/components/ui";
import { loadBankQuestionsAction, saveQuizAction, searchBankAction } from "./actions";

export type EditorQuiz = {
  title: string;
  passage: string;
  topic: string;
  studyNotes: string;
  quizDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  answerReveal: "immediate" | "after_close";
  bonusPoints: string;
  bonusCondition: "completion" | "perfect";
  countsForStreak: boolean;
  questions: EditorQuestion[];
};

type BankHit = Awaited<ReturnType<typeof searchBankAction>>[number];

export function QuizEditor({
  quizId,
  initial,
  status,
  hasSubmissions,
  defaultPoints,
  timezone,
}: {
  quizId: string | null;
  initial: EditorQuiz;
  status: "draft" | "published" | "archived";
  hasSubmissions: boolean;
  defaultPoints: number;
  timezone: string;
}) {
  const [quiz, setQuiz] = useState<EditorQuiz>(initial);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const [bankOpen, setBankOpen] = useState(false);

  const set = (patch: Partial<EditorQuiz>) => setQuiz((q) => ({ ...q, ...patch }));
  const setQuestion = (i: number, q: EditorQuestion) =>
    setQuiz((s) => ({ ...s, questions: s.questions.map((x, j) => (j === i ? q : x)) }));
  const move = (i: number, dir: -1 | 1) =>
    setQuiz((s) => {
      const qs = [...s.questions];
      const j = i + dir;
      if (j < 0 || j >= qs.length) return s;
      [qs[i], qs[j]] = [qs[j], qs[i]];
      return { ...s, questions: qs };
    });

  function submit(intent: "draft" | "publish" | "keep") {
    setError(null);
    setFieldErrors({});
    const payload = {
      ...quiz,
      bonusPoints: quiz.bonusPoints || "0",
      questions: quiz.questions.map(toPayload),
    };
    start(async () => {
      const res = await saveQuizAction(quizId, payload, intent);
      if (res?.error) {
        setError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const qErrors = (i: number) =>
    Object.fromEntries(
      Object.entries(fieldErrors)
        .filter(([k]) => k.startsWith(`questions.${i}.`))
        .map(([k, v]) => [k.split(".")[2], v]),
    );
  const topErr = (k: string) => fieldErrors[k];
  const questionErrorCount = Object.keys(fieldErrors).filter((k) => k.startsWith("questions.")).length;

  return (
    <div className="flex flex-col gap-10 pb-28">
      {error && (
        <Notice tone="error">
          {error}
          {questionErrorCount > 0 && ` ${questionErrorCount} problem${questionErrorCount === 1 ? "" : "s"} in the questions below.`}
        </Notice>
      )}
      {hasSubmissions && (
        <Notice>
          Students have already taken this quiz. You can fix wording or the answer key — every submission is re-graded and
          points are corrected automatically — but questions and options can&apos;t be removed.
        </Notice>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" error={topErr("title")} className="sm:col-span-2">
          <input
            id="title"
            className="field text-lg"
            value={quiz.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Daily Bible Study — Matthew 5"
            maxLength={120}
          />
        </Field>
        <Field label="Bible passage" htmlFor="passage" error={topErr("passage")}>
          <input id="passage" className="field" value={quiz.passage} onChange={(e) => set({ passage: e.target.value })} placeholder="Matthew 5:1–12" maxLength={120} />
        </Field>
        <Field label="Lesson / topic (optional)" htmlFor="topic">
          <input id="topic" className="field" value={quiz.topic} onChange={(e) => set({ topic: e.target.value })} placeholder="The Beatitudes" maxLength={80} />
        </Field>
        <Field
          label="Study notes (optional)"
          htmlFor="notes"
          hint="Shown to students on the Study page before the quiz opens."
          className="sm:col-span-2"
        >
          <textarea id="notes" className="field" rows={4} value={quiz.studyNotes} onChange={(e) => set({ studyNotes: e.target.value })} maxLength={8000} />
        </Field>
      </section>

      <section>
        <SectionHeading>Schedule</SectionHeading>
        <p className="text-sm text-dim mb-4">Times are in {timezone.replace(/_/g, " ")}.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Quiz date" htmlFor="quizDate" error={topErr("quizDate")}>
            <input
              id="quizDate"
              type="date"
              className="field"
              value={quiz.quizDate}
              onChange={(e) => set({ quizDate: e.target.value, endDate: quiz.endDate < e.target.value ? e.target.value : quiz.endDate })}
            />
          </Field>
          <Field label="Opens at" htmlFor="startTime" error={topErr("startTime")}>
            <input id="startTime" type="time" className="field" value={quiz.startTime} onChange={(e) => set({ startTime: e.target.value })} />
          </Field>
          <Field label="Deadline date" htmlFor="endDate" error={topErr("endDate")}>
            <input id="endDate" type="date" className="field" value={quiz.endDate} onChange={(e) => set({ endDate: e.target.value })} />
          </Field>
          <Field label="Deadline time" htmlFor="endTime" error={topErr("endTime")}>
            <input id="endTime" type="time" className="field" value={quiz.endTime} onChange={(e) => set({ endTime: e.target.value })} />
          </Field>
        </div>
      </section>

      <section>
        <SectionHeading>Scoring &amp; answers</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Show correct answers" htmlFor="reveal">
            <select
              id="reveal"
              className="field"
              value={quiz.answerReveal}
              onChange={(e) => set({ answerReveal: e.target.value as EditorQuiz["answerReveal"] })}
            >
              <option value="immediate">Right after the student submits</option>
              <option value="after_close">Only after the quiz closes</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Extra bonus points" htmlFor="bonus">
              <input id="bonus" type="number" min={0} max={1000} className="field" value={quiz.bonusPoints} onChange={(e) => set({ bonusPoints: e.target.value })} />
            </Field>
            <Field label="Bonus for" htmlFor="bonusCondition">
              <select
                id="bonusCondition"
                className="field"
                value={quiz.bonusCondition}
                onChange={(e) => set({ bonusCondition: e.target.value as EditorQuiz["bonusCondition"] })}
              >
                <option value="perfect">Perfect score</option>
                <option value="completion">Answering all</option>
              </select>
            </Field>
          </div>
          <Checkbox
            checked={quiz.countsForStreak}
            onChange={(e) => set({ countsForStreak: e.currentTarget.checked })}
            label="Counts toward daily streaks"
            hint="Turn off for optional or bonus quizzes."
          />
        </div>
      </section>

      <section>
        <SectionHeading>
          Questions · {quiz.questions.length} · {quiz.questions.reduce((s, q) => s + (Number(q.points) || 0), 0)} pts
        </SectionHeading>
        {quiz.questions.length === 0 && <p className="text-muted mb-6">No questions yet. Add one below or pull from the question bank.</p>}
        <ol className="flex flex-col gap-6">
          {quiz.questions.map((q, i) => (
            <li key={q.key} className={cx("border-l-2 pl-4 sm:pl-6 py-2", Object.keys(qErrors(i)).length ? "border-red-bright" : "border-line-strong")}>
              <QuestionFields
                q={q}
                index={i}
                total={quiz.questions.length}
                onChange={(next) => setQuestion(i, next)}
                onMove={(dir) => move(i, dir)}
                onRemove={() => setQuiz((s) => ({ ...s, questions: s.questions.filter((_, j) => j !== i) }))}
                locked={hasSubmissions && !!q.id}
                errors={qErrors(i)}
              />
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => set({ questions: [...quiz.questions, blankQuestion(defaultPoints)] })}>
            <Plus size={18} /> Add question
          </Button>
          <Button type="button" variant="secondary" onClick={() => setBankOpen((o) => !o)} aria-expanded={bankOpen}>
            <Search size={18} /> {bankOpen ? "Close bank" : "Add from bank"}
          </Button>
        </div>
        {bankOpen && (
          <BankPicker
            onAdd={(qs) => {
              set({ questions: [...quiz.questions, ...qs] });
            }}
          />
        )}
      </section>

      {/* Sticky action bar — always reachable on phones */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-bg/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-end gap-3">
          <span className="label mr-auto hidden sm:block">
            {status === "published" ? "Published" : status === "archived" ? "Archived" : "Draft"}
          </span>
          {status === "draft" ? (
            <>
              <Button type="button" variant="secondary" disabled={pending} onClick={() => submit("draft")}>
                Save draft
              </Button>
              <Button type="button" disabled={pending} onClick={() => submit("publish")}>
                {pending ? "Saving…" : "Publish"}
              </Button>
            </>
          ) : (
            <Button type="button" disabled={pending} onClick={() => submit("keep")}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function BankPicker({ onAdd }: { onAdd: (qs: EditorQuestion[]) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<BankHit[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, start] = useTransition();

  function search() {
    start(async () => setHits(await searchBankAction({ q: q.trim() || undefined })));
  }

  function add() {
    start(async () => {
      const rows = await loadBankQuestionsAction(selected);
      onAdd(
        rows.map((r) => ({
          key: newKey(),
          sourceQuestionId: r.sourceQuestionId,
          saveToBank: false,
          type: r.type,
          prompt: r.prompt,
          explanation: r.explanation,
          points: String(r.points),
          options: r.options.map((o) => ({ key: newKey(), label: o.label, isCorrect: o.isCorrect })),
          acceptedAnswersText: r.acceptedAnswers.join("\n"),
          caseSensitive: r.caseSensitive,
          manualReview: r.manualReview,
          meta: {
            ...emptyMeta(),
            book: r.meta.book ?? "",
            chapter: r.meta.chapter ? String(r.meta.chapter) : "",
            verses: r.meta.verses ?? "",
            topic: r.meta.topic ?? "",
            difficulty: r.meta.difficulty ?? "",
          },
        })),
      );
      setSelected([]);
    });
  }

  return (
    <div className="mt-6 border border-line-strong p-4">
      <div className="flex gap-2">
        <input
          className="field"
          placeholder="Search questions, e.g. peacemakers"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          aria-label="Search question bank"
        />
        <Button type="button" variant="secondary" onClick={search} disabled={pending}>
          Search
        </Button>
      </div>
      {hits && (
        <ul className="mt-4 max-h-96 overflow-y-auto divide-y divide-line">
          {hits.length === 0 && <li className="py-3 text-muted text-sm">No matches.</li>}
          {hits.map((h) => (
            <li key={h.id}>
              <label className="flex gap-3 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-[var(--color-red)]"
                  checked={selected.includes(h.id)}
                  onChange={(e) => setSelected((s) => (e.target.checked ? [...s, h.id] : s.filter((x) => x !== h.id)))}
                />
                <span>
                  <span className="block">{h.prompt}</span>
                  <span className="text-xs text-dim">
                    {TYPE_LABELS[h.type]}
                    {h.book && ` · ${h.book}${h.chapter ? ` ${h.chapter}` : ""}`}
                    {h.topic && ` · ${h.topic}`}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {selected.length > 0 && (
        <Button type="button" className="mt-4" onClick={add} disabled={pending}>
          Add {selected.length} question{selected.length === 1 ? "" : "s"}
        </Button>
      )}
    </div>
  );
}
