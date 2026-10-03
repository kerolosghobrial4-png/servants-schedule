import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { dateInTz, formatDate } from "@/lib/time";
import { getProfile } from "@/server/student";
import { AchievementIcon } from "@/components/achievement-icon";
import { SectionHeading, Stat, buttonClass, cx, formatPoints } from "@/components/ui";
import { logoutAction, signOutEverywhereAction } from "../../(auth)/actions";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const viewer = await requireStudent();
  const p = await getProfile(db, viewer.id);
  const earnedIds = new Set(p.earned.map((e) => e.name));

  return (
    <>
      <header className="mb-10">
        <p className="label mb-2">Profile · @{viewer.username}</p>
        <h1 className="display text-5xl sm:text-6xl">{viewer.displayName}</h1>
        <p className="text-sm text-dim mt-2">Member since {formatDate(dateInTz(viewer.createdAt, p.settings.timezone), { month: "long", year: "numeric" })}</p>
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 border-y border-line py-8 mb-12">
        <Stat label="Total points" value={formatPoints(p.stats.totalPoints)} />
        <Stat label="All-time rank" value={p.rank ? `#${p.rank}` : "—"} sub={`of ${p.boardSize}`} />
        <Stat label="Current streak" value={p.streak.current} tone={p.streak.current > 0 ? "red" : "ink"} />
        <Stat label="Longest streak" value={p.streak.longest} />
        <Stat label="Quizzes completed" value={p.stats.quizzesCompleted} />
        <Stat label="Perfect quizzes" value={p.stats.perfectQuizzes} tone={p.stats.perfectQuizzes > 0 ? "gold" : "ink"} />
      </dl>

      <section className="mb-12">
        <SectionHeading>
          Badges · {p.earned.length}/{p.allAchievements.length}
        </SectionHeading>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {p.allAchievements.map((a) => {
            const got = earnedIds.has(a.name);
            const when = p.earned.find((e) => e.name === a.name);
            return (
              <li key={a.id} className={cx("flex items-center gap-4", !got && "opacity-60")}>
                <AchievementIcon icon={a.icon} earned={got} />
                <div className="min-w-0">
                  <p className={cx("display text-lg", got ? "text-ink" : "text-muted")}>{a.name}</p>
                  <p className="text-sm text-dim">
                    {a.description}
                    {when && ` · ${formatDate(dateInTz(when.awardedAt, p.settings.timezone))}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mb-12">
        <SectionHeading>Account</SectionHeading>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/history" className={buttonClass("secondary")}>
            Point history
          </Link>
          <Link href="/change-password" className={buttonClass("secondary")}>
            Change password
          </Link>
          <form action={logoutAction}>
            <button className={buttonClass("ghost", "md", "w-full sm:w-auto")}>Sign out</button>
          </form>
        </div>
        <form action={signOutEverywhereAction} className="mt-4">
          <button className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            Signed in on a phone or computer you don&apos;t use anymore? Sign out everywhere
          </button>
        </form>
        <p className="text-xs text-dim mt-6 max-w-lg">
          Only your display name, points, rank and streak are shown to other students. Your username is private.
        </p>
      </section>
    </>
  );
}
