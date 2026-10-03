import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { getSettings } from "@/server/settings";
import { blankQuestion } from "@/lib/question-model";
import { PageTitle } from "@/components/ui";
import { BankQuestionForm } from "../bank-question-form";

export const metadata: Metadata = { title: "New question" };

export default async function NewQuestionPage() {
  await requirePermission("questions.manage");
  const settings = await getSettings(db);
  return (
    <>
      <p className="label mb-2">
        <Link href="/admin/questions" className="hover:text-ink">
          ← Question bank
        </Link>
      </p>
      <PageTitle title="New question" />
      <BankQuestionForm id={null} initial={{ ...blankQuestion(settings.points.defaultQuestion), saveToBank: false }} />
    </>
  );
}
