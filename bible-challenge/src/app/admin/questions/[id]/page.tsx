import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { uuidSchema } from "@/lib/validation";
import { getBankQuestion, usageCounts } from "@/server/question-bank";
import { ActionForm } from "@/components/action-form";
import type { EditorQuestion } from "@/lib/question-model";
import { SubmitButton } from "@/components/submit-button";
import { Notice, PageTitle, Tag } from "@/components/ui";
import { archiveQuestionAction, duplicateQuestionAction } from "../actions";
import { BankQuestionForm } from "../bank-question-form";

export const metadata: Metadata = { title: "Edit question" };

export default async function EditQuestionPage(props: PageProps<"/admin/questions/[id]">) {
  await requirePermission("questions.manage");
  const { id } = await props.params;
  const sp = await props.searchParams;
  if (!uuidSchema.safeParse(id).success) notFound();
  const q = await getBankQuestion(db, id);
  if (!q) notFound();
  const used = (await usageCounts(db)).get(q.id) ?? 0;

  const initial: EditorQuestion = {
    key: q.id,
    saveToBank: false,
    type: q.type,
    prompt: q.prompt,
    explanation: q.explanation,
    points: String(q.points),
    options: q.options.map((o) => ({ key: o.id, label: o.label, isCorrect: o.isCorrect })),
    acceptedAnswersText: q.acceptedAnswers.join("\n"),
    caseSensitive: q.caseSensitive,
    manualReview: q.manualReview,
    meta: {
      book: q.book ?? "",
      chapter: q.chapter ? String(q.chapter) : "",
      verses: q.verses ?? "",
      topic: q.topic ?? "",
      difficulty: q.difficulty ?? "",
    },
  };

  return (
    <>
      <p className="label mb-2">
        <Link href="/admin/questions" className="hover:text-ink">
          ← Question bank
        </Link>
      </p>
      <PageTitle title="Edit question">
        <p className="flex flex-wrap gap-2 items-center">
          {q.archivedAt && <Tag>Archived</Tag>}
          Used in {used} quiz{used === 1 ? "" : "zes"}. Changes here don&apos;t alter those quizzes.
        </p>
      </PageTitle>
      <div className="flex flex-col gap-3 mb-6">
        {sp.saved === "1" && <Notice tone="success">Saved.</Notice>}
        {sp.copied === "1" && <Notice tone="success">This is a copy. Edit it and save.</Notice>}
      </div>
      <BankQuestionForm key={q.updatedAt.toISOString()} id={q.id} initial={initial} />
      <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-line">
        <ActionForm action={duplicateQuestionAction}>
          <input type="hidden" name="id" value={q.id} />
          <SubmitButton variant="secondary" size="sm">
            Duplicate
          </SubmitButton>
        </ActionForm>
        <ActionForm action={archiveQuestionAction}>
          <input type="hidden" name="id" value={q.id} />
          <input type="hidden" name="archived" value={q.archivedAt ? "false" : "true"} />
          <SubmitButton variant={q.archivedAt ? "secondary" : "danger"} size="sm">
            {q.archivedAt ? "Restore" : "Archive"}
          </SubmitButton>
        </ActionForm>
      </div>
    </>
  );
}
