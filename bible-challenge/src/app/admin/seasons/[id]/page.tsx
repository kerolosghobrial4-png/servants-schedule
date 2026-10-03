import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { seasonParticipants } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/permissions";
import { formatDate } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getLeaderboard } from "@/server/leaderboard";
import { getSeason } from "@/server/seasons";
import { getSettings } from "@/server/settings";
import { listStudents } from "@/server/users-admin";
import { ActionForm } from "@/components/action-form";
import { LeaderboardList } from "@/components/leaderboard-list";
import { SubmitButton } from "@/components/submit-button";
import { EmptyState, Notice, SectionHeading, Tag } from "@/components/ui";
import { finalizeSeasonAction, setParticipantsAction, updateSeasonAction } from "../actions";
import { SeasonFields } from "../season-fields";

export const metadata: Metadata = { title: "Season" };

export default async function SeasonPage(props: PageProps<"/admin/seasons/[id]">) {
  const viewer = await requirePermission("admin.access");
  const { id } = await props.params;
  const sp = await props.searchParams;
  if (!uuidSchema.safeParse(id).success) notFound();
  const season = await getSeason(db, id);
  if (!season) notFound();
  const settings = await getSettings(db);
  const [board, students, participants] = await Promise.all([
    getLeaderboard(db, { kind: "season", seasonId: id }, settings),
    listStudents(db, { status: "active" }),
    db.select({ userId: seasonParticipants.userId }).from(seasonParticipants).where(eq(seasonParticipants.seasonId, id)),
  ]);
  const inSeason = new Set(participants.map((p) => p.userId));
  const manage = can(viewer.role, "seasons.manage");

  return (
    <div className="flex flex-col gap-12">
      <header>
        <p className="label mb-2">
          <Link href="/admin/seasons" className="hover:text-ink">
            ← Seasons
          </Link>
        </p>
        <h1 className="display text-4xl sm:text-5xl flex flex-wrap items-center gap-3">
          {season.name}
          {season.finalizedAt ? <Tag>Finalized</Tag> : season.isActive ? <Tag tone="green">Active</Tag> : <Tag>Inactive</Tag>}
        </h1>
        <p className="text-muted mt-2">
          {formatDate(season.startsOn, { year: "numeric" })} – {formatDate(season.endsOn, { year: "numeric" })}
          {season.description && ` · ${season.description}`}
        </p>
        {sp.created === "1" && (
          <div className="mt-4">
            <Notice tone="success">Season created.</Notice>
          </div>
        )}
      </header>

      <div className="grid xl:grid-cols-2 gap-12">
        <section>
          <SectionHeading>Season standings</SectionHeading>
          {board.length ? <LeaderboardList rows={board} showStreaks={false} /> : <EmptyState title="No participants yet" />}
        </section>

        {manage && (
          <div className="flex flex-col gap-12">
            <section>
              <SectionHeading>Details</SectionHeading>
              <ActionForm action={updateSeasonAction}>
                <input type="hidden" name="id" value={season.id} />
                <SeasonFields defaults={season} />
                <SubmitButton variant="secondary" className="self-start">
                  Save
                </SubmitButton>
              </ActionForm>
            </section>
            <section>
              <SectionHeading>Participants · {inSeason.size}</SectionHeading>
              <ActionForm action={setParticipantsAction}>
                <input type="hidden" name="id" value={season.id} />
                <ul className="grid grid-cols-2 gap-x-4">
                  {students.map((s) => (
                    <li key={s.id}>
                      <label className="flex items-center gap-3 py-2 cursor-pointer">
                        <input type="checkbox" name="userIds" value={s.id} defaultChecked={inSeason.has(s.id)} className="h-5 w-5 accent-[var(--color-red)]" />
                        {s.displayName}
                      </label>
                    </li>
                  ))}
                </ul>
                <SubmitButton variant="secondary" className="self-start">
                  Save participants
                </SubmitButton>
              </ActionForm>
            </section>
            {!season.finalizedAt && (
              <section>
                <SectionHeading>Finish season</SectionHeading>
                <ActionForm action={finalizeSeasonAction}>
                  <input type="hidden" name="id" value={season.id} />
                  <p className="text-sm text-muted">
                    Locks in the final standings, awards “top N” badges (like Top 3) and marks the season inactive. Points
                    are not changed.
                  </p>
                  <SubmitButton variant="danger" className="self-start" confirm="Finalize this season and award badges?">
                    Finalize season
                  </SubmitButton>
                </ActionForm>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
