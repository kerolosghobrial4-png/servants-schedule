import type { Metadata } from "next";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { dateInTz, formatDateTime, relativeDayLabel } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { getStudyMaterial } from "@/server/student";
import { ButtonLink, EmptyState, PageTitle, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Study" };

export default async function StudyPage() {
  await requireStudent();
  const settings = await getSettings(db);
  const now = new Date();
  const items = await getStudyMaterial(db, settings, now);
  const tz = settings.timezone;
  const today = dateInTz(now, tz);

  return (
    <>
      <PageTitle eyebrow="Read ahead" title="Study">
        <p>Current and upcoming passages. Read them before the quiz opens.</p>
      </PageTitle>
      {items.length === 0 ? (
        <EmptyState title="Nothing scheduled yet">Your leaders haven&apos;t posted upcoming material.</EmptyState>
      ) : (
        <div className="flex flex-col divide-y divide-line border-t border-line">
          {items.map((q) => {
            const open = q.opensAt <= now;
            return (
              <article key={q.id} className="py-8">
                <p className="label mb-2 flex items-center gap-2">
                  {relativeDayLabel(q.quizDate, today)}
                  {open ? <Tag tone="red">Quiz open</Tag> : <Tag>Opens {formatDateTime(q.opensAt, tz)}</Tag>}
                </p>
                <h2 className="display text-3xl sm:text-4xl">{q.title}</h2>
                {q.passage && <p className="scripture text-xl text-muted mt-1">{q.passage}</p>}
                {q.topic && <p className="label mt-3">{q.topic}</p>}
                {q.studyNotes && <div className="prose-notes mt-4 max-w-2xl whitespace-pre-line leading-relaxed">{q.studyNotes}</div>}
                {open && (
                  <ButtonLink href={`/quiz/${q.id}`} className="mt-6">
                    Go to quiz
                  </ButtonLink>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
