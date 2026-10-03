import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { dateRangeWindow, dateInTz, formatDate, formatTime, relativeDayLabel } from "@/lib/time";
import { getDashboard } from "@/server/student";
import { LeaderboardList } from "@/components/leaderboard-list";
import { PointAmount } from "@/components/points";
import { ButtonLink, SectionHeading, Tag, cx, formatPoints, ordinal } from "@/components/ui";

export const metadata: Metadata = { title: "Home" };

export default async function DashboardPage() {
  const viewer = await requireStudent();
  const d = await getDashboard(db, viewer.id);
  const tz = d.settings.timezone;
  const today = d.quizzes.today;
  const todays = d.quizzes.todays;
  const nextOpen = d.quizzes.open[0];
  const featured = todays.find((q) => q.status === "open" || q.status === "revise") ?? todays[0] ?? nextOpen ?? null;
  const firstName = viewer.displayName.split(" ")[0];

  const every = d.settings.streak.bonusEvery;
  const toNextBonus = every > 0 ? every - (d.streak.current % every) : null;

  return (
    <div className="flex flex-col gap-12">
      {/* Headline numbers */}
      <section aria-labelledby="welcome">
        <p className="label mb-2">{formatDate(today, { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 id="welcome" className="display text-4xl sm:text-6xl mb-8">
          Welcome back, <span className="text-red-bright">{firstName}</span>
        </h1>
        <dl className="grid grid-cols-3 gap-4 sm:gap-10 border-y border-line py-6">
          <div>
            <dt className="label">Points</dt>
            <dd className="numeral text-5xl sm:text-7xl mt-1">{formatPoints(d.total)}</dd>
            <dd className="text-sm text-muted mt-2">
              <span className="text-ink font-semibold">{formatPoints(d.weekPoints, true)}</span> this week
            </dd>
          </div>
          <div className="border-l border-line pl-4 sm:pl-10">
            <dt className="label">This month</dt>
            <dd className="numeral text-5xl sm:text-7xl mt-1">
              {d.monthRank ? (
                <>
                  <span className="text-dim text-3xl sm:text-5xl align-top">#</span>
                  {d.monthRank}
                </>
              ) : (
                "—"
              )}
            </dd>
            <dd className="text-sm text-muted mt-2">of {d.boardSize}</dd>
          </div>
          <div className="border-l border-line pl-4 sm:pl-10">
            <dt className="label">Day streak</dt>
            <dd className="numeral text-5xl sm:text-7xl mt-1 flex items-start gap-1">
              {d.streak.current}
              {d.streak.current > 0 && <Flame aria-hidden className="text-red-bright mt-1 w-6 h-6 sm:w-9 sm:h-9" />}
            </dd>
            <dd className="text-sm text-muted mt-2">Best {d.streak.longest}</dd>
          </div>
        </dl>
      </section>

      {/* Today's study */}
      <section aria-labelledby="today">
        <SectionHeading>
          <span id="today">Today&apos;s Bible study</span>
        </SectionHeading>
        {featured ? (
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2">
                <QuizStatusTag status={featured.status} />
                {featured.quizDate !== today && (
                  <span className="label ml-2">{relativeDayLabel(featured.quizDate, today)}</span>
                )}
              </p>
              <h2 className="display text-3xl sm:text-4xl">{featured.title}</h2>
              {featured.passage && <p className="scripture text-lg text-muted mt-1">{featured.passage}</p>}
              <p className="text-sm text-dim mt-2">
                {featured.status === "upcoming"
                  ? `Opens ${formatTime(featured.opensAt, tz)}`
                  : featured.status === "open" || featured.status === "revise"
                    ? `${featured.questionCount} questions · closes ${dateInTz(featured.closesAt, tz) === today ? formatTime(featured.closesAt, tz) : formatDate(dateInTz(featured.closesAt, tz)) + " " + formatTime(featured.closesAt, tz)}`
                    : featured.correctCount !== undefined
                      ? `${featured.correctCount}/${featured.questionCount} correct`
                      : null}
              </p>
            </div>
            {featured.status === "open" || featured.status === "revise" ? (
              <ButtonLink href={`/quiz/${featured.id}`} size="lg" className="w-full sm:w-auto">
                {featured.status === "revise" ? "Revise your answers" : "Take today's quiz"} <ArrowRight size={20} />
              </ButtonLink>
            ) : featured.status === "done" || featured.status === "pending_review" ? (
              <ButtonLink href={`/quiz/${featured.id}`} variant="secondary" size="lg" className="w-full sm:w-auto">
                See results
              </ButtonLink>
            ) : (
              <ButtonLink href="/study" variant="secondary" size="lg" className="w-full sm:w-auto">
                Read the passage
              </ButtonLink>
            )}
          </div>
        ) : (
          <p className="text-muted">
            No quiz today. Check the{" "}
            <Link href="/study" className="text-ink underline underline-offset-4">
              study page
            </Link>{" "}
            for what&apos;s coming up.
          </p>
        )}
        {d.quizzes.open.length > 1 && (
          <p className="text-sm text-muted mt-4">
            {d.quizzes.open.length - 1} more open{" "}
            <Link href="/quiz" className="text-ink underline underline-offset-4">
              quiz{d.quizzes.open.length > 2 ? "zes" : ""}
            </Link>
          </p>
        )}
      </section>

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Standings preview */}
        <section aria-labelledby="standings">
          <SectionHeading
            action={
              <Link href="/leaderboard" className="label hover:text-ink">
                Full standings →
              </Link>
            }
          >
            <span id="standings">Standings · this month</span>
          </SectionHeading>
          {d.boardPreview.rows.length ? (
            <LeaderboardList
              rows={d.boardPreview.rows}
              viewerId={viewer.id}
              showStreaks={d.settings.leaderboard.showStreaks}
              detachLast={d.boardPreview.detached}
            />
          ) : (
            <p className="text-muted">No points on the board yet this month.</p>
          )}
        </section>

        <div className="flex flex-col gap-12">
          {/* Goals */}
          <section aria-labelledby="goals">
            <SectionHeading>
              <span id="goals">Goals</span>
            </SectionHeading>
            <ul className="flex flex-col gap-6">
              {d.season && (
                <li>
                  <SeasonGoal season={d.season} standing={d.seasonStanding} today={today} tz={tz} />
                </li>
              )}
              {toNextBonus !== null && d.settings.streak.bonusPoints > 0 && (
                <li>
                  <div className="flex justify-between items-baseline gap-3 mb-2">
                    <span className="font-semibold">Streak bonus</span>
                    <span className="text-sm text-muted">
                      {toNextBonus} more day{toNextBonus === 1 ? "" : "s"} → +{d.settings.streak.bonusPoints}
                    </span>
                  </div>
                  <progress className="bar" max={every} value={every - toNextBonus} />
                </li>
              )}
              {d.nextAchievement && (
                <li>
                  <div className="flex justify-between items-baseline gap-3 mb-2">
                    <span className="font-semibold">
                      Next badge: <span className="text-gold">{d.nextAchievement.achievement.name}</span>
                    </span>
                    <span className="numeral text-lg text-muted">
                      {d.nextAchievement.current}/{d.nextAchievement.target}
                    </span>
                  </div>
                  <progress className="bar gold" max={d.nextAchievement.target} value={d.nextAchievement.current} />
                  <p className="text-xs text-dim mt-1.5">{d.nextAchievement.achievement.description}</p>
                </li>
              )}
            </ul>
          </section>

          {/* Recent activity */}
          <section aria-labelledby="activity">
            <SectionHeading
              action={
                <Link href="/history" className="label hover:text-ink">
                  All →
                </Link>
              }
            >
              <span id="activity">Recent activity</span>
            </SectionHeading>
            {d.recent.length ? (
              <ul className="divide-y divide-line">
                {d.recent.map((t) => (
                  <li key={t.id} className="flex items-baseline gap-4 py-2.5">
                    <PointAmount amount={t.amount} className="text-2xl w-14 shrink-0 text-right" />
                    <span className="flex-1 min-w-0 text-sm leading-snug">{t.description}</span>
                    <span className="text-xs text-dim shrink-0">
                      {relativeDayLabel(dateInTz(t.effectiveAt, tz), today).replace(/^\w+, /, "")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">Your points will show up here after your first quiz.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function QuizStatusTag({ status }: { status: string }) {
  switch (status) {
    case "open":
      return <Tag tone="red">Not completed</Tag>;
    case "revise":
      return <Tag tone="gold">Revision allowed</Tag>;
    case "done":
      return <Tag tone="green">Completed</Tag>;
    case "pending_review":
      return <Tag tone="gold">Completed · in review</Tag>;
    case "upcoming":
      return <Tag>Opens later</Tag>;
    default:
      return <Tag>Closed</Tag>;
  }
}

function SeasonGoal({
  season,
  standing,
  today,
  tz,
}: {
  season: { name: string; startsOn: string; endsOn: string; isParticipant: boolean };
  standing: { rank: number | null; of: number; points: number } | null;
  today: string;
  tz: string;
}) {
  const w = dateRangeWindow(season.startsOn, season.endsOn, tz);
  const totalDays = Math.round((+w.end - +w.start) / 86_400_000);
  const todayIdx = Math.round((+dateRangeWindow(today, today, tz).start - +w.start) / 86_400_000) + 1;
  const daysLeft = Math.max(0, totalDays - todayIdx);
  return (
    <div>
      <div className="flex justify-between items-baseline gap-3 mb-2">
        <span className="font-semibold">{season.name}</span>
        <span className="text-sm text-muted shrink-0">{daysLeft} days left</span>
      </div>
      <progress className="bar" max={totalDays} value={Math.min(todayIdx, totalDays)} />
      <p className={cx("text-sm mt-1.5", standing?.rank ? "text-ink" : "text-dim")}>
        {standing?.rank
          ? `${ordinal(standing.rank)} of ${standing.of} · ${formatPoints(standing.points)} pts`
          : season.isParticipant
            ? "Earn points to get on the season board."
            : "Ask a leader to add you to this season."}
      </p>
    </div>
  );
}
