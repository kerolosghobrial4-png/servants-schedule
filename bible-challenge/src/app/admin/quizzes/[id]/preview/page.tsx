import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { uuidSchema } from "@/lib/validation";
import { getQuizForEditing } from "@/server/quiz-admin";
import { getQuizForTaking } from "@/server/submissions";
import { QuizTaker } from "@/app/(student)/quiz/[id]/quiz-taker";
import { Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Preview quiz" };

export default async function PreviewQuizPage(props: PageProps<"/admin/quizzes/[id]/preview">) {
  await requirePermission("quizzes.manage");
  const { id } = await props.params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const loaded = await getQuizForEditing(db, id);
  if (!loaded) notFound();
  const questions = await getQuizForTaking(db, id);

  return (
    <div className="max-w-2xl">
      <p className="label mb-2">
        <Link href={`/admin/quizzes/${id}`} className="hover:text-ink">
          ← Back to editor
        </Link>
      </p>
      <h1 className="display text-4xl sm:text-5xl">{loaded.quiz.title}</h1>
      {loaded.quiz.passage && <p className="scripture text-xl text-muted mt-2 mb-4">{loaded.quiz.passage}</p>}
      <div className="mb-6">
        <Notice>Preview — this is exactly what students see. Nothing you pick here is saved.</Notice>
      </div>
      {questions.length ? (
        <QuizTaker quizId={id} storageKey="preview" questions={questions} isRevision={false} preview />
      ) : (
        <p className="text-muted">Add questions to preview this quiz.</p>
      )}
    </div>
  );
}
