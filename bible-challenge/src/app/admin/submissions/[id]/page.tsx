import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { Check, X } from "lucide-react";
import { db } from "@/db";
import { pointTransactions, quizQuestionOptions, quizQuestions, submissions } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getSettings } from "@/server/settings";
import { ActionForm } from "@/components/action-form";
import { PointAmount } from "@/components/points";
import { SubmitButton } from "@/components/submit-button";
import { SectionHeading, Tag, cx } from "@/components/ui";
import { reviewAnswerAction, setEditAllowedAction } from "../actions";

export const metadata: Metadata = { title: "Submission" };

export default async function SubmissionPage(props: PageProps<"/admin/submissions/[id]">) {
  await requirePermission("submissions.review");
  const { id } = await props.params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const sub = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
    with: {
      quiz: true,
      user: { columns: { id: true, displayName: true, username: true } },
      answers: true,
    },
  });
  if (!sub) notFound();
  const settings = await getSettings(db);
  const tz = settings.timezone;
  const questions = await db.query.quizQuestions.findMany({
    where: eq(quizQuestions.quizId, sub.quizId),
    orderBy: [asc(quizQuestions.position)],
    with: { options: { orderBy: [asc(quizQuestionOptions.position)] } },
  });
  const byQ = new Map(sub.answers.map((a) => [a.quizQuestionId, a]));
  const ledger = await db.query.pointTransactions.findMany({
    where: eq(pointTransactions.submissionId, sub.id),
    orderBy: [asc(pointTransactions.createdAt)],
  });

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <header>
        <p className="label mb-2">
          <Link href="/admin/submissions" className="hover:text-ink">
            ← Submissions
          </Link>
        </p>
        <h1 className="display text-4xl">
          <Link href={`/admin/students/${sub.user.id}`} className="hover:text-red-bright">
            {sub.user.displayName}
          </Link>
        </h1>
        <p className="text-muted mt-1">
          <Link href={`/admin/quizzes/${sub.quiz.id}`} className="underline underline-offset-4">
            {sub.quiz.title}
          </Link>{" "}
          · submitted {formatDateTime(sub.submittedAt, tz)}
          {sub.revisionCount > 0 && ` · revised ${sub.revisionCount}×`}
        </p>
        <div className="flex flex-wrap items-center gap-6 mt-6">
          <span className="numeral text-6xl">
            {sub.correctCount}
            <span className="text-dim text-3xl">/{sub.questionCount}</span>
          </span>
          {sub.status === "pending_review" && <Tag tone="gold">Needs review</Tag>}
          {sub.editAllowed && <Tag tone="gold">Revision allowed</Tag>}
        </div>
      </header>

      <section>
        <SectionHeading>Answers</SectionHeading>
        <ol className="flex flex-col gap-8">
          {questions.map((q, i) => {
            const a = byQ.get(q.id);
            const pending = a?.reviewStatus === "pending";
            return (
              <li key={q.id} className={cx("border-l-2 pl-4", pending ? "border-gold" : a?.isCorrect ? "border-green" : "border-red-bright")}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="numeral text-xl text-dim">{i + 1}</span>
                  <p className="flex-1 font-serif text-lg leading-snug">{q.prompt}</p>
                  {pending ? (
                    <Tag tone="gold">Pending</Tag>
                  ) : a?.isCorrect ? (
                    <Tag tone="green">
                      <Check size={12} /> +{a.pointsAwarded}
                    </Tag>
                  ) : (
                    <Tag tone="red">
                      <X size={12} /> 0
                    </Tag>
                  )}
                </div>
                {q.type === "short_answer" ? (
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="label mr-2">Answer</span>
                      <span className="text-lg">{a?.textAnswer ?? <span className="text-dim">(blank)</span>}</span>
                    </p>
                    <p className="text-muted">
                      <span className="label mr-2">Accepted</span>
                      {q.acceptedAnswers.join(" · ") || "—"}
                    </p>
                    {a?.reviewStatus === "approved" && <p className="text-green text-xs">Approved by a leader</p>}
                    {a?.reviewStatus === "rejected" && <p className="text-red-bright text-xs">Rejected by a leader</p>}
                    {a?.textAnswer && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {a.reviewStatus !== "approved" && (
                          <ActionForm action={reviewAnswerAction}>
                            <input type="hidden" name="answerId" value={a.id} />
                            <input type="hidden" name="decision" value="approved" />
                            <SubmitButton size="sm">Approve</SubmitButton>
                          </ActionForm>
                        )}
                        {a.reviewStatus !== "rejected" && (
                          <ActionForm action={reviewAnswerAction}>
                            <input type="hidden" name="answerId" value={a.id} />
                            <input type="hidden" name="decision" value="rejected" />
                            <SubmitButton size="sm" variant="danger">
                              Reject
                            </SubmitButton>
                          </ActionForm>
                        )}
                        {(a.reviewStatus === "approved" || a.reviewStatus === "rejected") && (
                          <ActionForm action={reviewAnswerAction}>
                            <input type="hidden" name="answerId" value={a.id} />
                            <input type="hidden" name="decision" value="auto" />
                            <SubmitButton size="sm" variant="ghost">
                              Undo review
                            </SubmitButton>
                          </ActionForm>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <ul className="text-sm space-y-1">
                    {q.options.map((o) => {
                      const picked = a?.selectedOptionIds.includes(o.id);
                      return (
                        <li key={o.id} className={cx("flex items-center gap-2 px-2 py-1", picked && "bg-raised")}>
                          <span className="w-4">{o.isCorrect && <Check size={14} className="text-green" aria-label="Correct" />}</span>
                          <span className={cx("flex-1", !o.isCorrect && !picked && "text-muted")}>{o.label}</span>
                          {picked && <span className="label">Picked</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <SectionHeading>Points from this submission</SectionHeading>
        <ul className="divide-y divide-line">
          {ledger.map((t) => (
            <li key={t.id} className="flex items-baseline gap-3 py-2 text-sm">
              <PointAmount amount={t.amount} className="text-lg w-12 text-right" />
              <span className="flex-1">{t.description}</span>
              <span className="text-xs text-dim">{formatDateTime(t.createdAt, tz)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading>Revision</SectionHeading>
        <ActionForm action={setEditAllowedAction}>
          <input type="hidden" name="submissionId" value={sub.id} />
          <input type="hidden" name="allowed" value={sub.editAllowed ? "false" : "true"} />
          <p className="text-sm text-muted">
            {sub.editAllowed
              ? "This student may revise their answers once. Their new answers will replace these and points will be recalculated."
              : "Let this student change their answers one time (for example, if they submitted by accident)."}
            {!sub.editAllowed && sub.quiz.answerReveal === "immediate" && " Note: this quiz shows correct answers right after submitting, so they have already seen them."}
          </p>
          <SubmitButton size="sm" variant="secondary" className="self-start">
            {sub.editAllowed ? "Remove revision permission" : "Allow one revision"}
          </SubmitButton>
        </ActionForm>
      </section>
    </div>
  );
}
