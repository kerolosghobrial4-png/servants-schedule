import "server-only";
import { and, asc, desc, eq, ilike, isNotNull, isNull, sql } from "drizzle-orm";
import type { Database } from "@/db";
import { questionOptions, questions } from "@/db/schema";
import { audit } from "./audit";
import type { BankQuestionInput } from "./question-input";

export type BankFilters = {
  q?: string;
  book?: string;
  chapter?: number;
  topic?: string;
  type?: string;
  difficulty?: string;
  archived?: boolean;
  limit?: number;
  offset?: number;
};

function escapeLike(s: string) {
  return s.replace(/[%_\\]/g, "\\$&");
}

export async function searchBank(database: Database, f: BankFilters) {
  const where = [f.archived ? isNotNull(questions.archivedAt) : isNull(questions.archivedAt)];
  if (f.q) where.push(ilike(questions.prompt, `%${escapeLike(f.q)}%`));
  if (f.book) where.push(eq(questions.book, f.book));
  if (f.chapter) where.push(eq(questions.chapter, f.chapter));
  if (f.topic) where.push(ilike(questions.topic, escapeLike(f.topic)));
  if (f.type && ["multiple_choice", "multiple_answer", "true_false", "short_answer"].includes(f.type)) {
    where.push(eq(questions.type, f.type as "multiple_choice"));
  }
  if (f.difficulty && ["easy", "medium", "hard"].includes(f.difficulty)) {
    where.push(eq(questions.difficulty, f.difficulty as "easy"));
  }
  return database.query.questions.findMany({
    where: and(...where),
    orderBy: [asc(questions.book), asc(questions.chapter), desc(questions.createdAt)],
    limit: f.limit ?? 100,
    offset: f.offset ?? 0,
    with: { options: { orderBy: [asc(questionOptions.position)] } },
  });
}

export async function bankFacets(database: Database) {
  const [books, topics] = await Promise.all([
    database
      .selectDistinct({ v: questions.book })
      .from(questions)
      .where(and(isNotNull(questions.book), isNull(questions.archivedAt))),
    database
      .selectDistinct({ v: questions.topic })
      .from(questions)
      .where(and(isNotNull(questions.topic), isNull(questions.archivedAt))),
  ]);
  return {
    books: books.map((b) => b.v!).sort(),
    topics: topics.map((t) => t.v!).sort((a, b) => a.localeCompare(b)),
  };
}

export async function getBankQuestion(database: Database, id: string) {
  return database.query.questions.findFirst({
    where: eq(questions.id, id),
    with: { options: { orderBy: [asc(questionOptions.position)] } },
  });
}

/** Bank edits never touch quizzes already built from the question (they hold snapshots). */
export async function saveBankQuestion(
  database: Database,
  opts: { id?: string; input: BankQuestionInput; actorId: string },
): Promise<string> {
  const { input } = opts;
  return database.transaction(async (tx) => {
    const values = {
      type: input.type,
      prompt: input.prompt,
      explanation: input.explanation,
      points: input.points,
      acceptedAnswers: input.acceptedAnswers,
      caseSensitive: input.caseSensitive,
      manualReview: input.manualReview,
      book: input.meta.book,
      chapter: input.meta.chapter,
      verses: input.meta.verses,
      topic: input.meta.topic,
      difficulty: input.meta.difficulty,
      updatedAt: new Date(),
    };
    let id = opts.id;
    if (id) {
      const updated = await tx.update(questions).set(values).where(eq(questions.id, id)).returning({ id: questions.id });
      if (!updated.length) throw new Error("Question not found");
      await tx.delete(questionOptions).where(eq(questionOptions.questionId, id));
    } else {
      const [row] = await tx.insert(questions).values({ ...values, createdBy: opts.actorId }).returning({ id: questions.id });
      id = row.id;
    }
    if (input.options.length) {
      await tx
        .insert(questionOptions)
        .values(input.options.map((o, i) => ({ questionId: id!, label: o.label, isCorrect: o.isCorrect, position: i })));
    }
    await audit(tx, {
      actorId: opts.actorId,
      action: opts.id ? "question.updated" : "question.created",
      targetType: "question",
      targetId: id,
    });
    return id;
  });
}

export async function setQuestionArchived(database: Database, opts: { id: string; archived: boolean; actorId: string }) {
  await database.transaction(async (tx) => {
    await tx
      .update(questions)
      .set({ archivedAt: opts.archived ? new Date() : null, updatedAt: new Date() })
      .where(eq(questions.id, opts.id));
    await audit(tx, {
      actorId: opts.actorId,
      action: opts.archived ? "question.archived" : "question.restored",
      targetType: "question",
      targetId: opts.id,
    });
  });
}

export async function duplicateBankQuestion(database: Database, opts: { id: string; actorId: string }) {
  const q = await getBankQuestion(database, opts.id);
  if (!q) throw new Error("Question not found");
  return saveBankQuestion(database, {
    actorId: opts.actorId,
    input: {
      type: q.type,
      prompt: `${q.prompt} (copy)`,
      explanation: q.explanation,
      points: q.points,
      acceptedAnswers: q.acceptedAnswers,
      caseSensitive: q.caseSensitive,
      manualReview: q.manualReview,
      options: q.options.map((o) => ({ label: o.label, isCorrect: o.isCorrect })),
      meta: { book: q.book, chapter: q.chapter, verses: q.verses, topic: q.topic, difficulty: q.difficulty },
    },
  });
}

/** How many quizzes have used each bank question. */
export async function usageCounts(database: Database) {
  const rows = await database.execute<{ source_question_id: string; n: string }>(
    sql`select source_question_id, count(distinct quiz_id) as n from quiz_questions where source_question_id is not null group by 1`,
  );
  return new Map(rows.rows.map((r) => [r.source_question_id, Number(r.n)]));
}
