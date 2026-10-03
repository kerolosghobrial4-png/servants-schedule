import type { Metadata } from "next";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { formatDate } from "@/lib/time";
import { getLeaderboard, type LeaderboardScope } from "@/server/leaderboard";
import { listSeasons } from "@/server/seasons";
import { getSettings } from "@/server/settings";
import { LeaderboardList } from "@/components/leaderboard-list";
import { Tabs } from "@/components/period-tabs";
import { EmptyState, PageTitle, formatPoints, ordinal } from "@/components/ui";

export const metadata: Metadata = { title: "Standings" };

const PERIODS = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "all", label: "All time" },
] as const;

export default async function LeaderboardPage(props: PageProps<"/leaderboard">) {
  const viewer = await requireStudent();
  const sp = await props.searchParams;
  const settings = await getSettings(db);
  const seasons = (await listSeasons(db)).filter((s) => s.isActive || s.finalizedAt);
  const current = seasons.find((s) => s.isActive) ?? seasons[0];

  const requested = typeof sp.period === "string" ? sp.period : settings.leaderboard.defaultPeriod;
  const seasonId = typeof sp.season === "string" ? sp.season : undefined;
  const season = seasonId ? seasons.find((s) => s.id === seasonId) : requested === "season" ? current : undefined;

  let scope: LeaderboardScope;
  let activeKey: string;
  if (season) {
    scope = { kind: "season", seasonId: season.id };
    activeKey = `season:${season.id}`;
  } else {
    const period = PERIODS.some((p) => p.key === requested) ? (requested as "week" | "month" | "all") : "month";
    scope = { kind: "period", period };
    activeKey = period;
  }

  const board = await getLeaderboard(db, scope, settings);
  const me = board.find((r) => r.userId === viewer.id);
  const ahead = me ? board.filter((r) => r.points > me.points).at(-1) : undefined;
  const tabs = [
    ...PERIODS.map((p) => ({ key: p.key, label: p.label, href: `/leaderboard?period=${p.key}` })),
    ...seasons.slice(0, 3).map((s) => ({ key: `season:${s.id}`, label: s.name, href: `/leaderboard?season=${s.id}` })),
  ];

  return (
    <>
      <PageTitle eyebrow="Leaderboard" title="Standings">
        {season && (
          <p>
            {season.name} · {formatDate(season.startsOn)} – {formatDate(season.endsOn, { year: "numeric" })}
          </p>
        )}
      </PageTitle>
      <Tabs items={tabs} active={activeKey} />

      {me && (
        <p className="mb-6 text-muted">
          You&apos;re <span className="text-ink font-semibold">{ordinal(me.rank)}</span> with{" "}
          <span className="text-ink font-semibold">{formatPoints(me.points)}</span> points
          {ahead ? (
            <>
              {" "}— <span className="text-ink font-semibold">{formatPoints(ahead.points - me.points)}</span> behind{" "}
              {ordinal(ahead.rank)} place.
            </>
          ) : (
            "."
          )}
        </p>
      )}

      {board.length ? (
        <LeaderboardList rows={board} viewerId={viewer.id} showStreaks={settings.leaderboard.showStreaks} size="lg" />
      ) : (
        <EmptyState title="No one on the board yet" />
      )}
    </>
  );
}
