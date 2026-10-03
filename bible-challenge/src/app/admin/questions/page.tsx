import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { requirePermission } from "@/lib/auth/guards";
import { bankFacets, searchBank, usageCounts } from "@/server/question-bank";
import { TYPE_LABELS } from "@/lib/question-model";
import { ButtonLink, EmptyState, PageTitle, Tag } from "@/components/ui";

export const metadata: Metadata = { title: "Question bank" };

const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 100) : "");

export default async function QuestionsPage(props: PageProps<"/admin/questions">) {
  await requirePermission("questions.manage");
  const sp = await props.searchParams;
  const f = {
    q: str(sp.q),
    book: str(sp.book),
    chapter: Number(str(sp.chapter)) || undefined,
    topic: str(sp.topic),
    type: str(sp.type),
    difficulty: str(sp.difficulty),
    archived: sp.archived === "1",
  };
  const [rows, facets, usage] = await Promise.all([searchBank(db, { ...f, limit: 200 }), bankFacets(db), usageCounts(db)]);
  const sel = "field !min-h-10 !py-2";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageTitle eyebrow="Reusable" title="Question bank">
          <p>Questions saved here can be pulled into any quiz. Editing a bank question never changes quizzes that already used it.</p>
        </PageTitle>
        <ButtonLink href="/admin/questions/new" className="mb-8">
          New question
        </ButtonLink>
      </div>

      <form className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6" role="search">
        <input name="q" defaultValue={f.q} placeholder="Search text" aria-label="Search text" className={`${sel} col-span-2`} />
        <select name="book" defaultValue={f.book} aria-label="Book" className={sel}>
          <option value="">Any book</option>
          {facets.books.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <input name="chapter" defaultValue={f.chapter ?? ""} placeholder="Chapter" inputMode="numeric" aria-label="Chapter" className={sel} />
        <select name="topic" defaultValue={f.topic} aria-label="Topic" className={sel}>
          <option value="">Any topic</option>
          {facets.topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select name="type" defaultValue={f.type} aria-label="Type" className={sel}>
          <option value="">Any type</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select name="difficulty" defaultValue={f.difficulty} aria-label="Difficulty" className={sel}>
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="archived" value="1" defaultChecked={f.archived} className="h-5 w-5 accent-[var(--color-red)]" />
          Archived
        </label>
        <div className="col-span-2 md:col-span-4 flex gap-2">
          <button className="label px-4 border border-line-strong hover:text-ink min-h-10">Filter</button>
          <Link href="/admin/questions" className="label px-4 flex items-center hover:text-ink">
            Clear
          </Link>
        </div>
      </form>

      <p className="label mb-2">{rows.length} question{rows.length === 1 ? "" : "s"}</p>
      {rows.length === 0 ? (
        <EmptyState title="No questions match" />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((q) => (
            <li key={q.id}>
              <Link href={`/admin/questions/${q.id}`} className="block py-3 hover:bg-raised -mx-2 px-2">
                <span className="block leading-snug">{q.prompt}</span>
                <span className="flex flex-wrap gap-2 items-center mt-1.5 text-xs text-dim">
                  <Tag>{TYPE_LABELS[q.type]}</Tag>
                  {q.book && (
                    <span>
                      {q.book}
                      {q.chapter ? ` ${q.chapter}` : ""}
                      {q.verses ? `:${q.verses}` : ""}
                    </span>
                  )}
                  {q.topic && <span>· {q.topic}</span>}
                  {q.difficulty && <span>· {q.difficulty}</span>}
                  <span>· {q.points} pts</span>
                  {usage.get(q.id) ? <span>· used in {usage.get(q.id)} quiz{usage.get(q.id) === 1 ? "" : "zes"}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
