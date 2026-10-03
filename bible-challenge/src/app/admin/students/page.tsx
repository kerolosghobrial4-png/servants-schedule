import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { can } from "@/lib/permissions";
import { formatDateTime } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { listStudents } from "@/server/users-admin";
import { Tabs } from "@/components/period-tabs";
import { ButtonLink, EmptyState, PageTitle, Tag, formatPoints } from "@/components/ui";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage(props: PageProps<"/admin/students">) {
  const viewer = await requirePermission("students.view");
  const sp = await props.searchParams;
  const status = sp.status === "inactive" ? "inactive" : sp.status === "all" ? "all" : "active";
  const q = typeof sp.q === "string" ? sp.q.slice(0, 50) : "";
  const [rows, settings] = await Promise.all([listStudents(db, { status, q }), getSettings(db)]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <PageTitle eyebrow="Manage" title="Students" />
        {can(viewer.role, "students.manage") && (
          <ButtonLink href="/admin/students/new" className="mb-8">
            Add student
          </ButtonLink>
        )}
      </div>
      <Tabs
        active={status}
        items={[
          { key: "active", label: "Active", href: "/admin/students" },
          { key: "inactive", label: "Deactivated", href: "/admin/students?status=inactive" },
          { key: "all", label: "All", href: "/admin/students?status=all" },
        ]}
      />
      <form className="mb-6 flex gap-2" role="search">
        {status !== "active" && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Search name or username" className="field max-w-sm" aria-label="Search students" />
        <button className="label px-4 border border-line-strong hover:text-ink">Search</button>
      </form>

      {rows.length === 0 ? (
        <EmptyState title="No students found" />
      ) : (
        <>
          {/* Mobile: stacked rows. Desktop: table. */}
          <ul className="md:hidden divide-y divide-line border-y border-line">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/students/${r.id}`} className="flex items-center gap-3 py-3">
                  <span className="flex-1 min-w-0">
                    <span className="display text-xl block truncate">{r.displayName}</span>
                    <span className="text-xs text-dim">
                      @{r.username} · {r.quizzes} quizzes · streak {r.streak}
                    </span>
                  </span>
                  {!r.isActive && <Tag>Inactive</Tag>}
                  <span className="numeral text-2xl">{formatPoints(r.points)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                {["Name", "Username", "Points", "Streak", "Quizzes", "Last sign-in", ""].map((h) => (
                  <th key={h} className="label py-2 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-raised">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/students/${r.id}`} className="font-semibold hover:text-red-bright">
                      {r.displayName}
                    </Link>
                    {!r.isActive && (
                      <span className="ml-2">
                        <Tag>Inactive</Tag>
                      </span>
                    )}
                    {r.mustChangePassword && (
                      <span className="ml-2">
                        <Tag tone="gold">Temp password</Tag>
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted">@{r.username}</td>
                  <td className="py-3 pr-4 numeral text-lg">{formatPoints(r.points)}</td>
                  <td className="py-3 pr-4">{r.streak}</td>
                  <td className="py-3 pr-4">{r.quizzes}</td>
                  <td className="py-3 pr-4 text-muted">{r.lastLoginAt ? formatDateTime(r.lastLoginAt, settings.timezone) : "Never"}</td>
                  <td className="py-3 text-right">
                    <Link href={`/admin/students/${r.id}`} className="label hover:text-ink">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
