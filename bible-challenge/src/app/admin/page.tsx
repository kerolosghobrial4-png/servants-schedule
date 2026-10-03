import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime, formatLongDate, formatTime } from "@/lib/time";
import { getAdminDashboard } from "@/server/admin-stats";
import { LeaderboardList } from "@/components/leaderboard-list";
import { PointAmount } from "@/components/points";
import { ButtonLink, Notice, SectionHeading, Stat, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Leader dashboard" };

export default async function AdminDashboard(props: PageProps<"/admin">) {
  await requirePermission("admin.access");
  const sp = await props.searchParams;
  const d = await getAdminDashboard(db);
  const tz = d.settings.timezone;
  const main = d.todayQuizStats[0];

  return (
    <div className="flex flex-col gap-12">
      {sp.denied === "1" && <Notice tone="error">Your role doesn&apos;t have access to that page.</Notice>}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="label mb-2">{formatLongDate(d.today)}</p>
          <h1 className="display text-4xl sm:text-5xl">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <ButtonLink href="/admin/quizzes/new">Create quiz</ButtonLink>
          <ButtonLink href="/admin/points#adjust" variant="secondary">
            Give points
          </ButtonLink>
        </div>
      </header>

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 border-y border-line py-6">
        <Stat label="Active students" value={d.activeStudentCount} />
        <Stat
          label="Completed today"
          value={main ? `${Math.round(main.completionRate * 100)}%` : "—"}
          sub={main ? `${main.completed.length} of ${d.activeStudentCount}` : "No quiz today"}
          tone="red"
        />
        <Stat
          label="Average score"
          value={main?.averageScore != null ? `${Math.round(main.averageScore * 100)}%` : "—"}
        />
        <Stat
          label="Waiting for review"
          value={d.pendingReview}
          tone={d.pendingReview ? "gold" : "ink"}
          sub={
            d.pendingReview ? (
              <Link href="/admin/submissions?status=pending_review" className="underline underline-offset-4">
                Review now
              </Link>
            ) : undefined
          }
        />
      </dl>

      <section>
        <SectionHeading>Today&apos;s quiz</SectionHeading>
        {d.todayQuizStats.length === 0 ? (
          <p className="text-muted">
            No quiz is published for today.{" "}
            <Link href="/admin/quizzes/new" className="text-ink underline underline-offset-4">
              Create one
            </Link>
            .
          </p>
        ) : (
          d.todayQuizStats.map((s) => (
            <div key={s.quiz.id} className="mb-8 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <div>
                  <Link href={`/admin/quizzes/${s.quiz.id}`} className="display text-2xl hover:text-red-bright">
                    {s.quiz.title}
                  </Link>
                  <p className="text-sm text-muted">
                    {s.quiz.passage} · {formatTime(s.quiz.opensAt, tz)} – {formatDateTime(s.quiz.closesAt, tz)}
                  </p>
                </div>
                <progress className="bar max-w-xs" max={d.activeStudentCount || 1} value={s.completed.length} />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="label mb-2">Completed · {s.completed.length}</p>
                  {s.completed.length ? (
                    <ul className="divide-y divide-line">
                      {s.completed.map((c) => (
                        <li key={c.userId} className="flex justify-between py-2 text-sm">
                          <span>
                            {c.displayName}
                            {c.status === "pending_review" && (
                              <span className="ml-2">
                                <Tag tone="gold">Review</Tag>
                              </span>
                            )}
                          </span>
                          <span className="text-muted">
                            <span className="numeral text-ink text-base mr-3">
                              {c.correctCount}/{c.questionCount}
                            </span>
                            {formatTime(c.submittedAt, tz)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-dim">Nobody yet.</p>
                  )}
                </div>
                <div>
                  <p className="label mb-2">Not yet · {s.notCompleted.length}</p>
                  <p className="text-sm text-muted leading-relaxed">
                    {s.notCompleted.map((n) => n.displayName).join(", ") || "Everyone's done!"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <div className="grid xl:grid-cols-2 gap-12">
        <section>
          <SectionHeading
            action={
              <Link href="/admin/leaderboard" className="label hover:text-ink">
                Full →
              </Link>
            }
          >
            Leaderboard · this month
          </SectionHeading>
          <LeaderboardList rows={d.board} showStreaks={d.settings.leaderboard.showStreaks} />
        </section>
        <div className="flex flex-col gap-12">
          <section>
            <SectionHeading
              action={
                <Link href="/admin/submissions" className="label hover:text-ink">
                  All →
                </Link>
              }
            >
              Recent submissions
            </SectionHeading>
            <ul className="divide-y divide-line">
              {d.recentSubmissions.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/submissions/${s.id}`} className="flex items-baseline gap-3 py-2.5 text-sm hover:bg-raised -mx-2 px-2">
                    <span className="font-semibold w-24 shrink-0 truncate">{s.displayName}</span>
                    <span className="flex-1 min-w-0 truncate text-muted">{s.quizTitle}</span>
                    <span className="numeral text-base">
                      {s.correctCount}/{s.questionCount}
                    </span>
                    <span className="text-dim text-xs w-24 text-right shrink-0">{formatDateTime(s.submittedAt, tz)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionHeading
              action={
                <Link href="/admin/points" className="label hover:text-ink">
                  Ledger →
                </Link>
              }
            >
              Recent point changes
            </SectionHeading>
            <ul className="divide-y divide-line">
              {d.recentPoints.map((p) => (
                <li key={p.id} className="flex items-baseline gap-3 py-2.5 text-sm">
                  <PointAmount amount={p.amount} className="text-lg w-12 text-right shrink-0" />
                  <Link href={`/admin/students/${p.userId}`} className="font-semibold w-20 shrink-0 truncate hover:underline">
                    {p.displayName}
                  </Link>
                  <span className="flex-1 min-w-0 truncate text-muted">{p.description}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
