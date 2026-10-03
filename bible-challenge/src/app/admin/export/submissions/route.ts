import { type NextRequest } from "next/server";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { quizzes, submissions, users } from "@/db/schema";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { csvResponse, toCsv } from "@/lib/csv";
import { dateInTz } from "@/lib/time";
import { uuidSchema } from "@/lib/validation";
import { getSettings } from "@/server/settings";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await authorize("submissions.review");
  } catch (err) {
    if (err instanceof ForbiddenError) return new Response("Not found", { status: 404 });
    throw err;
  }
  const quizParam = request.nextUrl.searchParams.get("quiz");
  const where: SQL[] = [];
  if (quizParam) {
    if (!uuidSchema.safeParse(quizParam).success) return new Response("Bad request", { status: 400 });
    where.push(eq(submissions.quizId, quizParam));
  }
  const settings = await getSettings(db);
  const rows = await db
    .select({
      quizDate: quizzes.quizDate,
      quizTitle: quizzes.title,
      student: users.displayName,
      submittedAt: submissions.submittedAt,
      correct: submissions.correctCount,
      questions: submissions.questionCount,
      answered: submissions.answeredCount,
      score: submissions.scorePoints,
      status: submissions.status,
      revisions: submissions.revisionCount,
    })
    .from(submissions)
    .innerJoin(users, eq(users.id, submissions.userId))
    .innerJoin(quizzes, eq(quizzes.id, submissions.quizId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(quizzes.quizDate), users.displayName);
  const body = toCsv(
    ["Quiz date", "Quiz", "Student", "Submitted (UTC)", "Correct", "Questions", "Answered", "Answer points", "Status", "Revisions"],
    rows.map((r) => [r.quizDate, r.quizTitle, r.student, r.submittedAt, r.correct, r.questions, r.answered, r.score, r.status, r.revisions]),
  );
  return csvResponse(`submissions-${dateInTz(new Date(), settings.timezone)}.csv`, body);
}
