import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/permissions";
import { formatDate } from "@/lib/time";
import { listSeasons } from "@/server/seasons";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox, EmptyState, PageTitle, SectionHeading, Tag } from "@/components/ui";
import { createSeasonAction } from "./actions";
import { SeasonFields } from "./season-fields";

export const metadata: Metadata = { title: "Seasons" };

export default async function SeasonsPage() {
  const viewer = await requirePermission("admin.access");
  const seasons = await listSeasons(db);
  const counts = await db.execute<{ season_id: string; n: string }>(
    sql`select season_id, count(*) as n from season_participants group by season_id`,
  );
  const countBy = new Map(counts.rows.map((r) => [r.season_id, Number(r.n)]));

  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-12">
      <div>
        <PageTitle eyebrow="Competitions" title="Seasons">
          <p>Points always count toward the all-time total. Seasons add a separate leaderboard for a date range.</p>
        </PageTitle>
        {seasons.length === 0 ? (
          <EmptyState title="No seasons yet" />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {seasons.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/seasons/${s.id}`} className="flex items-center gap-4 py-4 hover:bg-raised -mx-2 px-2">
                  <span className="flex-1 min-w-0">
                    <span className="display text-2xl block truncate">{s.name}</span>
                    <span className="text-sm text-muted">
                      {formatDate(s.startsOn, { year: "numeric" })} – {formatDate(s.endsOn, { year: "numeric" })} · {countBy.get(s.id) ?? 0} participants
                    </span>
                  </span>
                  {s.finalizedAt ? <Tag>Finalized</Tag> : s.isActive ? <Tag tone="green">Active</Tag> : <Tag>Inactive</Tag>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {can(viewer.role, "seasons.manage") && (
        <section>
          <SectionHeading>New season</SectionHeading>
          <ActionForm action={createSeasonAction}>
            <SeasonFields />
            <Checkbox name="enrollAll" defaultChecked label="Add all active students" />
            <SubmitButton className="self-start">Create season</SubmitButton>
          </ActionForm>
        </section>
      )}
    </div>
  );
}
