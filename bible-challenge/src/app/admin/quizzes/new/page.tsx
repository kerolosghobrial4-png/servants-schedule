import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { dateInTz, isDateString } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getQuizForEditing } from "@/server/quiz-admin";
import { getSettings } from "@/server/settings";
import { blankQuestion } from "@/lib/question-model";
import { PageTitle } from "@/components/ui";
import { blankEditorQuiz, toEditorQuiz } from "../editor-data";
import { QuizEditor } from "../quiz-editor";

export const metadata: Metadata = { title: "Create quiz" };

export default async function NewQuizPage(props: PageProps<"/admin/quizzes/new">) {
  await requirePermission("quizzes.manage");
  const sp = await props.searchParams;
  const settings = await getSettings(db);
  const today = dateInTz(new Date(), settings.timezone);
  const date = typeof sp.date === "string" && isDateString(sp.date) ? sp.date : today;

  let initial = blankEditorQuiz(date);
  let copiedFrom: string | null = null;
  if (typeof sp.from === "string" && uuidSchema.safeParse(sp.from).success) {
    const source = await getQuizForEditing(db, sp.from);
    if (source) {
      initial = toEditorQuiz(source, settings.timezone, { asCopy: true, date });
      initial.title = `${initial.title} (copy)`;
      copiedFrom = source.quiz.title;
    }
  }
  if (initial.questions.length === 0) initial.questions = [blankQuestion(settings.points.defaultQuestion)];

  return (
    <>
      <p className="label mb-2">
        <Link href="/admin/quizzes" className="hover:text-ink">
          ← Quizzes
        </Link>
      </p>
      <PageTitle title="Create quiz">{copiedFrom && <p>Copied from “{copiedFrom}”.</p>}</PageTitle>
      <QuizEditor
        quizId={null}
        initial={initial}
        status="draft"
        hasSubmissions={false}
        defaultPoints={settings.points.defaultQuestion}
        timezone={settings.timezone}
      />
    </>
  );
}
