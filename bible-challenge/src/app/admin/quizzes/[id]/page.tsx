import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { requirePermission } from "@/lib/auth/guards";
import { formatDateTime } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getQuizForEditing } from "@/server/quiz-admin";
import { getSettings } from "@/server/settings";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Notice, Tag, buttonClass } from "@/components/ui";
import { deleteQuizAction, regradeQuizAction, setQuizStatusAction } from "../actions";
import { toEditorQuiz } from "../editor-data";
import { QuizEditor } from "../quiz-editor";

export const metadata: Metadata = { title: "Edit quiz" };

export default async function EditQuizPage(props: PageProps<"/admin/quizzes/[id]">) {
  await requirePermission("quizzes.manage");
  const { id } = await props.params;
  const sp = await props.searchParams;
  if (!uuidSchema.safeParse(id).success) notFound();
  const [loaded, settings] = await Promise.all([getQuizForEditing(db, id), getSettings(db)]);
  if (!loaded) notFound();
  const { quiz } = loaded;
  const [{ n: subCount }] = await db.select({ n: count() }).from(submissions).where(eq(submissions.quizId, id));
  const tz = settings.timezone;
  const now = new Date();
  const state = quiz.status !== "published" ? quiz.status : now < quiz.opensAt ? "scheduled" : now < quiz.closesAt ? "open" : "closed";

  return (
    <>
      <p className="label mb-2">
        <Link href="/admin/quizzes" className="hover:text-ink">
          ← Quizzes
        </Link>
      </p>
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="display text-4xl sm:text-5xl">{quiz.title}</h1>
          <p className="text-muted mt-2 flex flex-wrap items-center gap-2">
            <Tag tone={state === "open" ? "red" : state === "draft" ? "muted" : state === "scheduled" ? "gold" : "muted"}>{state}</Tag>
            {formatDateTime(quiz.opensAt, tz)} → {formatDateTime(quiz.closesAt, tz)}
            <span>·</span>
            <Link href={`/admin/submissions?quiz=${quiz.id}`} className="underline underline-offset-4">
              {subCount} submission{subCount === 1 ? "" : "s"}
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/quizzes/${quiz.id}/preview`} className={buttonClass("secondary", "sm")}>
            Preview
          </Link>
          <Link href={`/admin/quizzes/new?from=${quiz.id}`} className={buttonClass("secondary", "sm")}>
            Duplicate
          </Link>
          {quiz.status === "published" && (
            <ActionForm action={setQuizStatusAction}>
              <input type="hidden" name="quizId" value={quiz.id} />
              <input type="hidden" name="status" value={subCount > 0 ? "archived" : "draft"} />
              <SubmitButton size="sm" variant="secondary" confirm={subCount > 0 ? "Archive this quiz? Students will no longer see it, but points stay." : "Unpublish this quiz?"}>
                {subCount > 0 ? "Archive" : "Unpublish"}
              </SubmitButton>
            </ActionForm>
          )}
          {quiz.status === "archived" && (
            <ActionForm action={setQuizStatusAction}>
              <input type="hidden" name="quizId" value={quiz.id} />
              <input type="hidden" name="status" value="published" />
              <SubmitButton size="sm" variant="secondary">
                Restore
              </SubmitButton>
            </ActionForm>
          )}
          {subCount > 0 && (
            <ActionForm action={regradeQuizAction}>
              <input type="hidden" name="quizId" value={quiz.id} />
              <SubmitButton size="sm" variant="secondary" pendingText="Re-grading…">
                Re-grade all
              </SubmitButton>
            </ActionForm>
          )}
          {quiz.status === "draft" && subCount === 0 && (
            <ActionForm action={deleteQuizAction}>
              <input type="hidden" name="quizId" value={quiz.id} />
              <SubmitButton size="sm" variant="danger" confirm="Delete this draft permanently?">
                Delete draft
              </SubmitButton>
            </ActionForm>
          )}
        </div>
      </header>

      <div className="mb-8 flex flex-col gap-3">
        {sp.saved === "publish" && <Notice tone="success">Published. Students will see it when it opens.</Notice>}
        {sp.saved === "draft" && <Notice tone="success">Draft saved. Students can&apos;t see drafts.</Notice>}
        {sp.saved === "keep" && <Notice tone="success">Changes saved.</Notice>}
        {sp.regraded && (
          <Notice tone="success">
            The answer key changed, so {sp.regraded} submission(s) were re-graded and points corrected in the ledger.
          </Notice>
        )}
      </div>

      <QuizEditor
        key={quiz.updatedAt.toISOString()}
        quizId={quiz.id}
        initial={toEditorQuiz(loaded, tz)}
        status={quiz.status}
        hasSubmissions={subCount > 0}
        defaultPoints={settings.points.defaultQuestion}
        timezone={tz}
      />
    </>
  );
}
