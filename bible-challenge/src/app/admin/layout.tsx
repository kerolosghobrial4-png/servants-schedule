import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { ROLE_LABELS, can, type Permission } from "@/lib/permissions";
import { getSettings } from "@/server/settings";
import { AdminSidebar, AdminTopNav, type AdminNavItem } from "@/components/admin-nav";
import { logoutAction } from "../(auth)/actions";

const NAV: (AdminNavItem & { permission: Permission })[] = [
  { href: "/admin", label: "Dashboard", permission: "admin.access" },
  { href: "/admin/students", label: "Students", permission: "students.view" },
  { href: "/admin/quizzes", label: "Quizzes", permission: "quizzes.manage" },
  { href: "/admin/questions", label: "Questions", permission: "questions.manage" },
  { href: "/admin/submissions", label: "Submissions", permission: "submissions.review" },
  { href: "/admin/leaderboard", label: "Leaderboard", permission: "admin.access" },
  { href: "/admin/points", label: "Points", permission: "points.manage" },
  { href: "/admin/seasons", label: "Seasons", permission: "admin.access" },
  { href: "/admin/achievements", label: "Achievements", permission: "achievements.grant" },
  { href: "/admin/settings", label: "Settings", permission: "settings.manage" },
  { href: "/admin/audit", label: "Audit log", permission: "audit.view" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Layouts don't re-run on every navigation, so every admin page and action
  // also checks its own permission. This check is the first line, not the only one.
  const viewer = await requirePermission("admin.access");
  const [settings, pending] = await Promise.all([
    getSettings(db),
    db.select({ n: count() }).from(submissions).where(eq(submissions.status, "pending_review")),
  ]);
  const items = NAV.filter((n) => can(viewer.role, n.permission)).map((n) =>
    n.href === "/admin/submissions" ? { ...n, badge: pending[0]?.n ?? 0 } : n,
  );

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <span aria-hidden className="block w-2.5 h-6 bg-red" />
            <span className="display text-lg tracking-[0.06em] truncate">{settings.groupName}</span>
            <span className="label text-gold shrink-0">Leaders</span>
          </Link>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/account/security" className="hidden sm:block text-sm text-muted hover:text-ink">
              {viewer.displayName} · {ROLE_LABELS[viewer.role]}
            </Link>
            <form action={logoutAction}>
              <button className="label hover:text-ink py-2">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <AdminTopNav items={items} />
      <div className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 flex gap-10">
        <AdminSidebar items={items} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
