import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, ilike, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { quizzes, submissions, users } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { formatDate, formatDateTime } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getSettings } from "@/server/settings";
import { Tabs } from "@/components/period-tabs";
import { EmptyState, PageTitle, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Submissions" };

export default async function SubmissionsPage(props: PageProps<"/admin/submissions">) {
  await requirePermission("submissions.review");
  const sp = await props.searchParams;
  const status = sp.status === "pending_review" ? "pending_review" : "all";
  const quizId = typeof sp.quiz === "string" && uuidSchema.safeParse(sp.quiz).success ? sp.quiz : null;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 50) : "";
  const settings = await getSettings(db);

  const where: SQL[] = [];
  if (status === "pending_review") where.push(eq(submissions.status, "pending_review"));
  if (quizId) where.push(eq(submissions.quizId, quizId));
  if (q) where.push(ilike(users.displayName, `%${q.replace(/[%_\\]/g, "\\$&")}%`));

  const rows = await db
    .select({
      id: submissions.id,
      submittedAt: submissions.submittedAt,
      correctCount: submissions.correctCount,
      questionCount: submissions.questionCount,
      scorePoints: submissions.scorePoints,
      status: submissions.status,
      editAllowed: submissions.editAllowed,
      revisionCount: submissions.revisionCount,
      displayName: users.displayName,
      quizTitle: quizzes.title,
      quizDate: quizzes.quizDate,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.userId))
    .innerJoin(quizzes, eq(quizzes.id, submissions.quizId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(submissions.submittedAt))
    .limit(200);

  const quizTitle = quizId ? (await db.query.quizzes.findFirst({ where: eq(quizzes.id, quizId), columns: { title: true } }))?.title : null;
  const base = (extra: Record<string, string>) => {
    const p = new URLSearchParams({ ...(quizId ? { quiz: quizId } : {}), ...extra });
    return `/admin/submissions${p.size ? `?${p}` : ""}`;
  };

  return (
    <>
      <PageTitle eyebrow="Review" title="Submissions">
        {quizTitle && (
          <p>
            Showing {quizTitle}.{" "}
            <Link href="/admin/submissions" className="underline">
              Show all quizzes
            </Link>
          </p>
        )}
      </PageTitle>
      <Tabs
        active={status}
        items={[
          { key: "all", label: "All", href: base({}) },
          { key: "pending_review", label: "Needs review", href: base({ status: "pending_review" }) },
        ]}
      />
      <form className="mb-6 flex flex-wrap gap-2" role="search">
        {quizId && <input type="hidden" name="quiz" value={quizId} />}
        {status !== "all" && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Student name" aria-label="Student name" className="field max-w-xs" />
        <button className="label px-4 border border-line-strong hover:text-ink">Search</button>
        <a
          href={`/admin/export/submissions${quizId ? `?quiz=${quizId}` : ""}`}
          download
          className="label px-4 flex items-center hover:text-ink ml-auto"
        >
          Export CSV ↓
        </a>
      </form>
      {rows.length === 0 ? (
        <EmptyState title={status === "pending_review" ? "Nothing waiting for review" : "No submissions"} />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/submissions/${r.id}`} className="flex items-center gap-4 py-3 hover:bg-raised -mx-2 px-2">
                <span className="flex-1 min-w-0">
                  <span className="font-semibold">{r.displayName}</span>
                  <span className="text-muted"> · {r.quizTitle}</span>
                  <span className="block text-xs text-dim">
                    {formatDate(r.quizDate)} quiz · submitted {formatDateTime(r.submittedAt, settings.timezone)}
                    {r.revisionCount > 0 && ` · revised ${r.revisionCount}×`}
                  </span>
                </span>
                {r.status === "pending_review" && <Tag tone="gold">Review</Tag>}
                {r.editAllowed && <Tag tone="gold">Can revise</Tag>}
                <span className="numeral text-2xl shrink-0">
                  {r.correctCount}
                  <span className="text-dim text-base">/{r.questionCount}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
