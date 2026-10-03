import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { formatDateTime, formatLongDate } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getSettings } from "@/server/settings";
import { getStudentQuizView } from "@/server/quiz-view";
import { AchievementIcon } from "@/components/achievement-icon";
import { ButtonLink, Notice, SectionHeading, Tag, cx, formatPoints } from "@/components/ui";
import { ClearDraft, QuizTaker } from "./quiz-taker";

export const metadata: Metadata = { title: "Quiz" };

export default async function QuizPage(props: PageProps<"/quiz/[id]">) {
  const viewer = await requireStudent();
  const { id } = await props.params;
  const sp = await props.searchParams;
  if (!uuidSchema.safeParse(id).success) notFound();

  const [view, settings] = await Promise.all([getStudentQuizView(db, viewer.id, id), getSettings(db)]);
  if (!view) notFound();
  const { quiz } = view;
  const tz = settings.timezone;
  const storageKey = `quiz-draft:${viewer.id}:${quiz.id}`;

  const header = (
    <header className="mb-6">
      <p className="label mb-2">
        <Link href="/quiz" className="hover:text-ink">
          ← Quizzes
        </Link>
        <span className="mx-2 text-line-strong">/</span>
        {formatLongDate(quiz.quizDate)}
      </p>
      <h1 className="display text-4xl sm:text-5xl">{quiz.title}</h1>
      {quiz.passage && <p className="scripture text-xl text-muted mt-2">{quiz.passage}</p>}
      {quiz.topic && <p className="label mt-3">{quiz.topic}</p>}
    </header>
  );

  if (view.mode === "locked") {
    return (
      <div className="max-w-2xl">
        {header}
        <Notice>Opens {formatDateTime(quiz.opensAt, tz)}. Read the passage ahead of time!</Notice>
        {quiz.studyNotes && <StudyNotes notes={quiz.studyNotes} />}
      </div>
    );
  }

  if (view.mode === "take") {
    return (
      <div className="max-w-2xl">
        {header}
        {quiz.studyNotes && (
          <details className="mb-6 border-y border-line py-3 group">
            <summary className="label cursor-pointer list-none flex justify-between">
              Study notes <span className="group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="prose-notes mt-3 text-muted whitespace-pre-line">{quiz.studyNotes}</div>
          </details>
        )}
        <p className="text-sm text-dim mb-2">Closes {formatDateTime(quiz.closesAt, tz)}</p>
        <QuizTaker
          quizId={quiz.id}
          storageKey={storageKey}
          isRevision={!!view.submission}
          questions={view.questions.map((q) => ({
            id: q.id,
            type: q.type,
            prompt: q.prompt,
            points: q.points,
            options: q.options.map((o) => ({ id: o.id, label: o.label })),
          }))}
        />
      </div>
    );
  }

  const { submission, review, revealAnswers } = view;
  const earnedTotal = view.earned.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="max-w-2xl">
      {sp.submitted === "1" && <ClearDraft storageKey={storageKey} />}
      {header}

      {submission ? (
        <section className="border-y border-line py-6 mb-10" aria-label="Your result">
          {sp.submitted === "1" && <p className="label text-red-bright mb-3">Submitted</p>}
          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            <div>
              <div className="numeral text-7xl">
                {submission.correctCount}
                <span className="text-dim text-4xl">/{submission.questionCount}</span>
              </div>
              <div className="label mt-2">Correct</div>
            </div>
            <div>
              <div className="numeral text-7xl text-red-bright">{formatPoints(earnedTotal, true)}</div>
              <div className="label mt-2">Points earned</div>
            </div>
          </div>
          {submission.status === "pending_review" && (
            <p className="mt-4 text-sm text-gold">
              A leader is reviewing one or more of your written answers. Your points will update after review.
            </p>
          )}
          {view.earned.length > 0 && (
            <ul className="mt-6 text-sm text-muted space-y-1">
              {view.earned.map((e, i) => (
                <li key={i} className="flex gap-3">
                  <span className="numeral text-ink text-base w-12 text-right">{formatPoints(e.amount, true)}</span>
                  {e.description}
                </li>
              ))}
            </ul>
          )}
          {view.newAchievements.length > 0 && (
            <ul className="mt-6 flex flex-col gap-4">
              {view.newAchievements.map((a) => (
                <li key={a.name} className="flex items-center gap-4">
                  <AchievementIcon icon={a.icon} />
                  <div>
                    <p className="label text-gold">Badge unlocked</p>
                    <p className="display text-xl">{a.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <div className="mb-8">
          <Notice>You didn&apos;t take this quiz before it closed. Here are the answers so you can still learn from it.</Notice>
        </div>
      )}

      <SectionHeading>{revealAnswers ? "Answers" : "Your answers"}</SectionHeading>
      {!revealAnswers && (
        <div className="mb-6">
          <Notice>Correct answers will be shown after the quiz closes on {formatDateTime(quiz.closesAt, tz)}.</Notice>
        </div>
      )}
      <ol className="flex flex-col gap-10">
        {review.map((q, i) => (
          <li key={q.id}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="numeral text-2xl text-dim">{i + 1}</span>
              <p className="font-serif text-xl leading-snug flex-1">{q.prompt}</p>
              {q.isCorrect !== undefined && submission && (
                q.pending ? (
                  <Tag tone="gold">In review</Tag>
                ) : q.isCorrect ? (
                  <Tag tone="green">
                    <Check size={12} /> +{q.pointsAwarded}
                  </Tag>
                ) : (
                  <Tag tone="red">
                    <X size={12} /> Missed
                  </Tag>
                )
              )}
            </div>
            {q.type === "short_answer" ? (
              <div className="pl-9 space-y-1 text-sm">
                <p>
                  <span className="label mr-2">You</span>
                  {q.textAnswer ?? <span className="text-dim">No answer</span>}
                </p>
                {q.acceptedAnswer && (
                  <p>
                    <span className="label mr-2">Answer</span>
                    <span className="text-green">{q.acceptedAnswer}</span>
                  </p>
                )}
              </div>
            ) : (
              <ul className="pl-9 space-y-1.5">
                {q.options.map((o) => (
                  <li
                    key={o.id}
                    className={cx(
                      "flex items-center gap-2 text-sm py-1.5 px-3 border-l-2",
                      o.isCorrect ? "border-green text-ink" : o.selected ? "border-red-bright" : "border-transparent text-muted",
                      o.selected && "bg-raised",
                    )}
                  >
                    <span className="flex-1">{o.label}</span>
                    {o.selected && <span className="label">Your pick</span>}
                    {o.isCorrect && <Check size={16} className="text-green" aria-label="Correct answer" />}
                  </li>
                ))}
              </ul>
            )}
            {q.explanation && <p className="ml-9 mt-3 pl-3 border-l border-line text-sm text-muted">{q.explanation}</p>}
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <ButtonLink href="/leaderboard" size="lg">
          See standings
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg">
          Home
        </ButtonLink>
      </div>
    </div>
  );
}

function StudyNotes({ notes }: { notes: string }) {
  return (
    <section className="mt-8">
      <SectionHeading>Study notes</SectionHeading>
      <div className="prose-notes text-muted whitespace-pre-line">{notes}</div>
    </section>
  );
}
