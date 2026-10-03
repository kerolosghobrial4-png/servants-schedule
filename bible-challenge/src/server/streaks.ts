import "server-only";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
import type { DbOrTx } from "@/db";
import { quizzes, submissions } from "@/db/schema";
import { dateInTz, isWeekend } from "@/lib/time";

/**
 * Streak rules
 * ------------
 * A "quiz day" is a calendar date (group time zone) with at least one
 * published, streak-counting quiz that has already opened. A streak is the
 * number of consecutive quiz days a student completed. Days with no quiz are
 * neutral — they neither extend nor break a streak. A quiz day whose quiz is
 * still open doesn't break the streak yet. When weekends don't count, weekend
 * quiz days are ignored entirely.
 *
 * Everything here is derived from server timestamps and stored submissions.
 */

export type StreakInput = {
  /** All quiz days to date, any order. */
  quizDays: string[];
  /** Quiz days on which there is still an open, uncompleted quiz. */
  openDays: Set<string>;
  /** Quiz days the student completed. */
  completedDays: Set<string>;
  weekendsCount: boolean;
};

export type StreakResult = { current: number; longest: number; lastCompletedDay: string | null };

export function computeStreak(input: StreakInput): StreakResult {
  const days = [...new Set(input.quizDays)]
    .filter((d) => input.weekendsCount || !isWeekend(d))
    .sort();

  let longest = 0;
  let run = 0;
  let lastCompletedDay: string | null = null;
  for (const day of days) {
    if (input.completedDays.has(day)) {
      run += 1;
      longest = Math.max(longest, run);
      lastCompletedDay = day;
    } else if (!input.openDays.has(day)) {
      run = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (input.completedDays.has(day)) current += 1;
    else if (input.openDays.has(day)) continue;
    else break;
  }
  return { current, longest, lastCompletedDay };
}

type QuizDayRow = { quizDate: string; opensAt: Date; closesAt: Date };

/** Quiz days and still-open days, shared by every student. */
export async function loadQuizCalendar(db: DbOrTx, tz: string, now = new Date()) {
  const today = dateInTz(now, tz);
  const rows: QuizDayRow[] = await db
    .select({ quizDate: quizzes.quizDate, opensAt: quizzes.opensAt, closesAt: quizzes.closesAt })
    .from(quizzes)
    .where(
      and(
        eq(quizzes.status, "published"),
        eq(quizzes.countsForStreak, true),
        lte(quizzes.quizDate, today),
        lte(quizzes.opensAt, now),
      ),
    );
  const quizDays = rows.map((r) => r.quizDate);
  const openDayCandidates = new Set(rows.filter((r) => r.closesAt > now).map((r) => r.quizDate));
  return { quizDays, openDayCandidates };
}

/** Completed streak-counting quiz days, per student. */
export async function loadCompletedDays(db: DbOrTx, userIds: string[]) {
  const map = new Map<string, Set<string>>();
  if (userIds.length === 0) return map;
  const rows = await db
    .selectDistinct({ userId: submissions.userId, quizDate: quizzes.quizDate })
    .from(submissions)
    .innerJoin(quizzes, eq(quizzes.id, submissions.quizId))
    .where(
      and(
        inArray(submissions.userId, userIds),
        eq(quizzes.countsForStreak, true),
        eq(quizzes.status, "published"),
        sql`${submissions.answeredCount} > 0`,
      ),
    );
  for (const r of rows) {
    if (!map.has(r.userId)) map.set(r.userId, new Set());
    map.get(r.userId)!.add(r.quizDate);
  }
  return map;
}

export async function getStreaks(
  db: DbOrTx,
  userIds: string[],
  opts: { tz: string; weekendsCount: boolean; now?: Date },
): Promise<Map<string, StreakResult>> {
  const { quizDays, openDayCandidates } = await loadQuizCalendar(db, opts.tz, opts.now);
  const completed = await loadCompletedDays(db, userIds);
  const out = new Map<string, StreakResult>();
  for (const id of userIds) {
    const completedDays = completed.get(id) ?? new Set<string>();
    // A day only stays "open" for this student if they haven't done it yet.
    const openDays = new Set([...openDayCandidates].filter((d) => !completedDays.has(d)));
    out.set(id, computeStreak({ quizDays, openDays, completedDays, weekendsCount: opts.weekendsCount }));
  }
  return out;
}

export async function getStreak(
  db: DbOrTx,
  userId: string,
  opts: { tz: string; weekendsCount: boolean; now?: Date },
): Promise<StreakResult> {
  return (await getStreaks(db, [userId], opts)).get(userId)!;
}
