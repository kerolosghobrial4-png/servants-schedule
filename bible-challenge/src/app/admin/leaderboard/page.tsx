import type { Metadata } from "next";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { getLeaderboard, type LeaderboardScope } from "@/server/leaderboard";
import { listSeasons } from "@/server/seasons";
import { getSettings } from "@/server/settings";
import { LeaderboardList } from "@/components/leaderboard-list";
import { Tabs } from "@/components/period-tabs";
import { EmptyState, PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Leaderboard" };

export default async function AdminLeaderboardPage(props: PageProps<"/admin/leaderboard">) {
  await requirePermission("admin.access");
  const sp = await props.searchParams;
  const settings = await getSettings(db);
  const seasons = await listSeasons(db);
  const seasonId = typeof sp.season === "string" ? seasons.find((s) => s.id === sp.season)?.id : undefined;
  const period = ["week", "month", "all"].includes(String(sp.period)) ? (sp.period as "week" | "month" | "all") : "month";
  const scope: LeaderboardScope = seasonId ? { kind: "season", seasonId } : { kind: "period", period };
  const board = await getLeaderboard(db, scope, settings);

  return (
    <>
      <PageTitle eyebrow="Standings" title="Leaderboard">
        <p>Exactly what students see: display names, points and streaks only.</p>
      </PageTitle>
      <Tabs
        active={seasonId ? `s:${seasonId}` : period}
        items={[
          { key: "week", label: "This week", href: "/admin/leaderboard?period=week" },
          { key: "month", label: "This month", href: "/admin/leaderboard?period=month" },
          { key: "all", label: "All time", href: "/admin/leaderboard?period=all" },
          ...seasons.map((s) => ({ key: `s:${s.id}`, label: s.name, href: `/admin/leaderboard?season=${s.id}` })),
        ]}
      />
      {board.length ? <LeaderboardList rows={board} size="lg" showStreaks={settings.leaderboard.showStreaks} /> : <EmptyState title="No students yet" />}
    </>
  );
}
