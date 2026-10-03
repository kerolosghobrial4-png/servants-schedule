import "server-only";
import { eq, sql } from "drizzle-orm";
import type { Database } from "@/db";
import { submissionAnswers, submissions } from "@/db/schema";
import { desiredQuizAwards, summarize } from "./grading";
import { overriddenSourceKeys, sumForSourceKey } from "./ledger";
import { gradeStoredAnswers, loadQuizWithQuestions } from "./submissions";

export type IntegrityIssue = { kind: string; detail: string; submissionId?: string; userId?: string };

/**
 * Read-only audit of the points system. Re-derives what every submission
 * should be worth and compares it with the ledger, and checks reversal rows
 * mirror their originals. A healthy database returns no issues. Nothing is
 * changed; use "Re-grade all" on a quiz to repair a reported mismatch.
 */
export async function checkLedgerIntegrity(database: Database): Promise<{ checked: number; issues: IntegrityIssue[] }> {
  const issues: IntegrityIssue[] = [];

  const badReversals = await database.execute<{ id: string; user_id: string }>(sql`
    select r.id, r.user_id from point_transactions r
    join point_transactions o on o.id = r.reverses_id
    where r.amount <> -o.amount or r.user_id <> o.user_id or o.category = 'reversal'`);
  for (const r of badReversals.rows) {
    issues.push({ kind: "reversal", detail: `Reversal ${r.id} doesn't mirror its original entry`, userId: r.user_id });
  }

  const subs = await database.select().from(submissions);
  await database.transaction(async (tx) => {
    for (const sub of subs) {
      const loaded = await loadQuizWithQuestions(tx, sub.quizId);
      if (!loaded) continue;
      const stored = await tx.query.submissionAnswers.findMany({ where: eq(submissionAnswers.submissionId, sub.id) });
      const grades = gradeStoredAnswers(loaded.questions, new Map(stored.map((s) => [s.quizQuestionId, s])));
      const summary = summarize(loaded.questions, grades);
      if (summary.correctCount !== sub.correctCount || summary.scorePoints !== sub.scorePoints) {
        issues.push({
          kind: "stale_score",
          detail: `Stored score ${sub.correctCount}/${sub.questionCount} but the current key gives ${summary.correctCount}/${summary.questionCount}`,
          submissionId: sub.id,
          userId: sub.userId,
        });
      }
      const prefix = `quiz:${sub.quizId}:`;
      const overridden = await overriddenSourceKeys(tx, sub.userId, prefix);
      const desired = desiredQuizAwards(summary, sub.awardRules, {
        points: loaded.quiz.bonusPoints,
        condition: loaded.quiz.bonusCondition,
      });
      for (const award of desired) {
        const key = `${prefix}${award.category}`;
        if (overridden.has(key)) continue;
        const actual = await sumForSourceKey(tx, sub.userId, key);
        if (actual !== award.amount) {
          issues.push({
            kind: "ledger_mismatch",
            detail: `${award.category}: ledger has ${actual}, expected ${award.amount}`,
            submissionId: sub.id,
            userId: sub.userId,
          });
        }
      }
    }
    // Read-only: never commit anything from this transaction.
    tx.rollback();
  }).catch((err) => {
    if (!(err instanceof Error && err.message.includes("Rollback"))) throw err;
  });

  return { checked: subs.length, issues };
}
