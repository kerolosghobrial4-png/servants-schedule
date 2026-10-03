import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { formatDateTime, relativeDayLabel } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { getStudentQuizzes, type StudentQuizCard } from "@/server/student";
import { EmptyState, PageTitle, SectionHeading, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizListPage() {
  const viewer = await requireStudent();
  const settings = await getSettings(db);
  const q = await getStudentQuizzes(db, viewer.id, settings);
  const tz = settings.timezone;

  return (
    <>
      <PageTitle eyebrow="Daily Bible study" title="Quizzes" />
      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading>Open now</SectionHeading>
          {q.open.length ? (
            <QuizRows rows={q.open} today={q.today} tz={tz} />
          ) : (
            <EmptyState title="You're all caught up">New quizzes show up here when they open.</EmptyState>
          )}
        </section>
        {q.upcoming.length > 0 && (
          <section>
            <SectionHeading
              action={
                <Link href="/study" className="label hover:text-ink">
                  Study material →
                </Link>
              }
            >
              Coming up
            </SectionHeading>
            <QuizRows rows={q.upcoming} today={q.today} tz={tz} />
          </section>
        )}
        <section>
          <SectionHeading
            action={
              <Link href="/history?tab=quizzes" className="label hover:text-ink">
                Full history →
              </Link>
            }
          >
            Recent
          </SectionHeading>
          {q.past.length ? <QuizRows rows={q.past.slice(0, 10)} today={q.today} tz={tz} /> : <p className="text-muted">Nothing yet.</p>}
        </section>
      </div>
    </>
  );
}

function QuizRows({ rows, today, tz }: { rows: StudentQuizCard[]; today: string; tz: string }) {
  return (
    <ul className="divide-y divide-line">
      {rows.map((r) => (
        <li key={r.id}>
          <Link href={`/quiz/${r.id}`} className="flex items-center gap-4 py-4 group">
            <div className="w-20 shrink-0">
              <p className="label">{relativeDayLabel(r.quizDate, today).replace(/,.*$/, "")}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="display text-xl sm:text-2xl truncate group-hover:text-red-bright">{r.title}</p>
              <p className="text-sm text-muted truncate">
                {r.passage}
                {r.status === "open" && ` · closes ${formatDateTime(r.closesAt, tz)}`}
                {r.status === "upcoming" && ` · opens ${formatDateTime(r.opensAt, tz)}`}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              {r.status === "done" && (
                <span className="numeral text-2xl">
                  {r.correctCount}
                  <span className="text-dim text-lg">/{r.questionCount}</span>
                </span>
              )}
              {r.status === "open" && <Tag tone="red">Take</Tag>}
              {r.status === "revise" && <Tag tone="gold">Revise</Tag>}
              {r.status === "pending_review" && <Tag tone="gold">In review</Tag>}
              {r.status === "missed" && <Tag>Missed</Tag>}
              {r.status === "upcoming" && <Tag>Soon</Tag>}
              <ArrowRight size={18} className="text-dim group-hover:text-ink" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
