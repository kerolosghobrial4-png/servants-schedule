import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { dateInTz, formatDate, relativeDayLabel } from "@/lib/time";
import { getBalance } from "@/server/ledger";
import { getSettings } from "@/server/settings";
import { getPointHistory, getQuizHistory } from "@/server/student";
import { CATEGORY_LABEL, PointAmount } from "@/components/points";
import { Tabs } from "@/components/period-tabs";
import { EmptyState, PageTitle, Tag, formatPoints } from "@/components/ui";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage(props: PageProps<"/history">) {
  const viewer = await requireStudent();
  const sp = await props.searchParams;
  const tab = sp.tab === "quizzes" ? "quizzes" : "points";
  const settings = await getSettings(db);
  const tz = settings.timezone;
  const today = dateInTz(new Date(), tz);

  return (
    <>
      <PageTitle eyebrow="Your record" title="History">
        <p>Every point you&apos;ve earned, and exactly where it came from.</p>
      </PageTitle>
      <Tabs
        active={tab}
        items={[
          { key: "points", label: "Points", href: "/history" },
          { key: "quizzes", label: "Quizzes", href: "/history?tab=quizzes" },
        ]}
      />
      {tab === "points" ? <PointsTab userId={viewer.id} tz={tz} today={today} /> : <QuizzesTab userId={viewer.id} today={today} />}
    </>
  );
}

async function PointsTab({ userId, tz, today }: { userId: string; tz: string; today: string }) {
  const [rows, total] = await Promise.all([getPointHistory(db, userId), getBalance(db, userId)]);
  if (!rows.length) return <EmptyState title="No points yet">Take a quiz to get on the board.</EmptyState>;

  const groups: { day: string; total: number; rows: typeof rows }[] = [];
  for (const r of rows) {
    const day = dateInTz(r.effectiveAt, tz);
    const last = groups.at(-1);
    if (last?.day === day) {
      last.rows.push(r);
      last.total += r.amount;
    } else groups.push({ day, total: r.amount, rows: [r] });
  }

  return (
    <>
      <p className="mb-8 text-muted">
        Total: <span className="numeral text-3xl text-ink align-middle ml-1">{formatPoints(total)}</span>
      </p>
      <div className="flex flex-col gap-8">
        {groups.map((g) => (
          <section key={g.day}>
            <div className="flex justify-between items-baseline border-b border-line pb-2 mb-1">
              <h2 className="label text-ink">{relativeDayLabel(g.day, today)}</h2>
              <span className="numeral text-lg text-muted">{formatPoints(g.total, true)}</span>
            </div>
            <ul className="divide-y divide-line/60">
              {g.rows.map((r) => (
                <li key={r.id} className="flex items-baseline gap-4 py-3">
                  <PointAmount amount={r.amount} className="text-2xl w-16 shrink-0 text-right" />
                  <div className="flex-1 min-w-0">
                    <p className="leading-snug">{r.description}</p>
                    <p className="text-xs text-dim mt-0.5">
                      {CATEGORY_LABEL[r.category]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

async function QuizzesTab({ userId, today }: { userId: string; today: string }) {
  const rows = await getQuizHistory(db, userId);
  if (!rows.length) return <EmptyState title="No quizzes yet" />;
  return (
    <ul className="divide-y divide-line">
      {rows.map((r) => (
        <li key={r.submissionId}>
          <Link href={`/quiz/${r.quizId}`} className="flex items-center gap-4 py-4 group">
            <span className="label w-16 shrink-0">{r.quizDate === today ? "Today" : formatDate(r.quizDate)}</span>
            <span className="flex-1 min-w-0">
              <span className="display text-xl block truncate group-hover:text-red-bright">{r.title}</span>
              <span className="text-sm text-muted block truncate">{r.passage}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="numeral text-2xl block">
                {r.correctCount}
                <span className="text-dim text-base">/{r.questionCount}</span>
              </span>
              {r.status === "pending_review" ? (
                <Tag tone="gold">In review</Tag>
              ) : (
                <span className="text-xs text-muted">{formatPoints(Number(r.earned), true)} pts</span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
