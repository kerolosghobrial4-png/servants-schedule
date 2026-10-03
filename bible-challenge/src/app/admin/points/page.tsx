import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { uuidSchema } from "@/lib/validation";
import { getSettings } from "@/server/settings";
import { ledgerWithActors, listStudents } from "@/server/users-admin";
import { ActionForm } from "@/components/action-form";
import { LedgerTable } from "@/components/ledger-table";
import { Tabs } from "@/components/period-tabs";
import { SubmitButton } from "@/components/submit-button";
import { Field, Input, PageTitle, SectionHeading, Select } from "@/components/ui";
import { adjustPointsAction } from "../students/actions";

export const metadata: Metadata = { title: "Points" };

const PAGE = 100;

export default async function PointsPage(props: PageProps<"/admin/points">) {
  await requirePermission("points.manage");
  const sp = await props.searchParams;
  const manualOnly = sp.view === "manual";
  const userId = typeof sp.student === "string" && uuidSchema.safeParse(sp.student).success ? sp.student : undefined;
  const page = Math.max(0, Number(sp.page) || 0);
  const [students, settings, rows] = await Promise.all([
    listStudents(db, { status: "active" }),
    getSettings(db),
    ledgerWithActors(db, { manualOnly, userId, limit: PAGE + 1, offset: page * PAGE }),
  ]);
  const hasMore = rows.length > PAGE;
  const qs = (extra: Record<string, string | number>) => {
    const p = new URLSearchParams();
    if (manualOnly) p.set("view", "manual");
    if (userId) p.set("student", userId);
    for (const [k, v] of Object.entries(extra)) p.set(k, String(v));
    return `/admin/points?${p}`;
  };

  return (
    <div className="flex flex-col gap-12">
      <PageTitle eyebrow="Ledger" title="Points">
        <p>
          Every point change is a permanent, attributed entry. To fix a mistake, reverse the entry — nothing is ever edited or
          deleted.
        </p>
      </PageTitle>

      <section id="adjust" className="max-w-xl">
        <SectionHeading>Give or remove points</SectionHeading>
        <ActionForm action={adjustPointsAction} resetOnSuccess>
          <Field label="Student" htmlFor="userId">
            <Select id="userId" name="userId" required defaultValue={userId ?? ""}>
              <option value="" disabled>
                Choose a student…
              </option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName} (@{s.username})
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-[8rem_1fr] gap-3">
            <Field label="Amount" htmlFor="amount">
              <Input id="amount" name="amount" type="number" step={1} required placeholder="+50" />
            </Field>
            <Field label="Reason (student sees this)" htmlFor="reason">
              <Input id="reason" name="reason" required maxLength={120} placeholder="Memorized weekly verse" />
            </Field>
          </div>
          <Field label="Private note (leaders only)" htmlFor="note">
            <Input id="note" name="note" maxLength={300} placeholder="Optional" />
          </Field>
          <SubmitButton className="self-start">Record adjustment</SubmitButton>
        </ActionForm>
      </section>

      <section>
        <SectionHeading>History</SectionHeading>
        <Tabs
          active={manualOnly ? "manual" : "all"}
          items={[
            { key: "all", label: "All entries", href: userId ? `/admin/points?student=${userId}` : "/admin/points" },
            { key: "manual", label: "Manual changes", href: `/admin/points?view=manual${userId ? `&student=${userId}` : ""}` },
          ]}
        />
        <form className="flex gap-2 mb-4">
          {manualOnly && <input type="hidden" name="view" value="manual" />}
          <Select name="student" defaultValue={userId ?? ""} aria-label="Filter by student" className="max-w-xs !min-h-10 !py-2">
            <option value="">All students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.displayName}
              </option>
            ))}
          </Select>
          <button className="label px-4 border border-line-strong hover:text-ink">Filter</button>
        </form>
        <LedgerTable rows={rows.slice(0, PAGE)} tz={settings.timezone} canReverse showStudent />
        <div className="flex justify-between mt-4">
          {page > 0 ? (
            <Link href={qs({ page: page - 1 })} className="label hover:text-ink">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          {hasMore && (
            <Link href={qs({ page: page + 1 })} className="label hover:text-ink">
              Older →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
