import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, desc, eq, gte, lt, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { dateInTz, formatDate, formatTime } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { Tabs } from "@/components/period-tabs";
import { ButtonLink, EmptyState, Notice, PageTitle, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizzesPage(props: PageProps<"/admin/quizzes">) {
  await requirePermission("quizzes.manage");
  const sp = await props.searchParams;
  const tab = ["upcoming", "drafts", "past", "archived"].includes(String(sp.tab)) ? String(sp.tab) : "upcoming";
  const settings = await getSettings(db);
  const tz = settings.timezone;
  const today = dateInTz(new Date(), tz);

  const where =
    tab === "drafts"
      ? eq(quizzes.status, "draft")
      : tab === "archived"
        ? eq(quizzes.status, "archived")
        : tab === "past"
          ? and(eq(quizzes.status, "published"), lt(quizzes.quizDate, today))
          : and(ne(quizzes.status, "archived"), ne(quizzes.status, "draft"), gte(quizzes.quizDate, today));

  const rows = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      passage: quizzes.passage,
      quizDate: quizzes.quizDate,
      opensAt: quizzes.opensAt,
      closesAt: quizzes.closesAt,
      status: quizzes.status,
      questions: sql<number>`(select count(*)::int from quiz_questions qq where qq.quiz_id = "quizzes"."id")`,
      submissions: sql<number>`(select count(*)::int from submissions s where s.quiz_id = "quizzes"."id")`,
    })
    .from(quizzes)
    .where(where)
    .orderBy(tab === "upcoming" || tab === "drafts" ? asc(quizzes.quizDate) : desc(quizzes.quizDate))
    .limit(200);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageTitle eyebrow="Manage" title="Quizzes" />
        <ButtonLink href="/admin/quizzes/new" className="mb-8">
          Create quiz
        </ButtonLink>
      </div>
      {sp.deleted === "1" && (
        <div className="mb-4">
          <Notice tone="success">Draft deleted.</Notice>
        </div>
      )}
      <Tabs
        active={tab}
        items={[
          { key: "upcoming", label: "Today & upcoming", href: "/admin/quizzes" },
          { key: "drafts", label: "Drafts", href: "/admin/quizzes?tab=drafts" },
          { key: "past", label: "Past", href: "/admin/quizzes?tab=past" },
          { key: "archived", label: "Archived", href: "/admin/quizzes?tab=archived" },
        ]}
      />
      {rows.length === 0 ? (
        <EmptyState title="No quizzes here">
          <Link href="/admin/quizzes/new" className="underline">
            Create one
          </Link>
        </EmptyState>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/quizzes/${r.id}`} className="flex items-center gap-4 py-3.5 hover:bg-raised -mx-2 px-2">
                <span className="w-20 shrink-0">
                  <span className="label block">{r.quizDate === today ? "Today" : formatDate(r.quizDate, { weekday: "short" })}</span>
                  <span className="text-sm text-muted">{formatDate(r.quizDate)}</span>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="display text-xl block truncate">{r.title}</span>
                  <span className="text-sm text-muted block truncate">
                    {r.passage} · {r.questions} questions · {formatTime(r.opensAt, tz)}–{formatTime(r.closesAt, tz)}
                  </span>
                </span>
                <span className="shrink-0 flex items-center gap-3">
                  {r.status === "draft" && <Tag>Draft</Tag>}
                  {r.status === "archived" && <Tag>Archived</Tag>}
                  {r.status === "published" && <Tag tone="green">Published</Tag>}
                  <span className="text-right hidden sm:block">
                    <span className="numeral text-xl block">{r.submissions}</span>
                    <span className="label">taken</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
