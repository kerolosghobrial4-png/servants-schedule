import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { listSeasons } from "@/server/seasons";
import { PageTitle } from "@/components/ui";
import { ImportForm } from "./import-form";

export const metadata: Metadata = { title: "Import students" };

export default async function ImportStudentsPage() {
  await requirePermission("students.manage");
  const seasons = (await listSeasons(db)).filter((s) => s.isActive).map((s) => ({ id: s.id, name: s.name }));
  return (
    <div className="max-w-2xl">
      <p className="label mb-2 print:hidden">
        <Link href="/admin/students" className="hover:text-ink">
          ← Students
        </Link>
      </p>
      <PageTitle title="Import students">
        <p>Set up a whole group at once. Use first names or nicknames only — no surnames, emails or phone numbers needed.</p>
      </PageTitle>
      <ImportForm seasons={seasons} />
    </div>
  );
}
