import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, users } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Audit log" };

const PAGE = 100;

export default async function AuditPage(props: PageProps<"/admin/audit">) {
  await requirePermission("audit.view");
  const sp = await props.searchParams;
  const page = Math.max(0, Number(sp.page) || 0);
  const settings = await getSettings(db);
  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      targetType: auditLog.targetType,
      targetId: auditLog.targetId,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      actor: users.displayName,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorId))
    .orderBy(desc(auditLog.createdAt))
    .limit(PAGE + 1)
    .offset(page * PAGE);

  return (
    <>
      <PageTitle eyebrow="Admin" title="Audit log">
        <p>Every staff action, permanently recorded. Entries can&apos;t be edited or deleted.</p>
      </PageTitle>
      <ul className="divide-y divide-line border-y border-line text-sm">
        {rows.slice(0, PAGE).map((r) => (
          <li key={r.id} className="py-2.5">
            <div className="flex flex-wrap gap-x-3 items-baseline">
              <span className="text-dim w-32 shrink-0">{formatDateTime(r.createdAt, settings.timezone)}</span>
              <span className="font-semibold">{r.actor ?? "System"}</span>
              <span className="font-mono text-gold">{r.action}</span>
              {r.targetType === "user" && r.targetId && (
                <Link href={`/admin/students/${r.targetId}`} className="text-muted underline">
                  user
                </Link>
              )}
              {r.targetType === "quiz" && r.targetId && (
                <Link href={`/admin/quizzes/${r.targetId}`} className="text-muted underline">
                  quiz
                </Link>
              )}
              {r.targetType === "submission" && r.targetId && (
                <Link href={`/admin/submissions/${r.targetId}`} className="text-muted underline">
                  submission
                </Link>
              )}
            </div>
            {r.details && Object.keys(r.details).length > 0 && (
              <details className="mt-1">
                <summary className="text-xs text-dim cursor-pointer">Details</summary>
                <pre className="text-xs text-muted whitespace-pre-wrap break-all mt-1 bg-raised p-2">{JSON.stringify(r.details, null, 2)}</pre>
              </details>
            )}
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        {page > 0 ? <Link href={`/admin/audit?page=${page - 1}`} className="label">← Newer</Link> : <span />}
        {rows.length > PAGE && <Link href={`/admin/audit?page=${page + 1}`} className="label">Older →</Link>}
      </div>
    </>
  );
}
