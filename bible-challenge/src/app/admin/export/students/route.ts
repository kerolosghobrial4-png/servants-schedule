import { db } from "@/db";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { csvResponse, toCsv } from "@/lib/csv";
import { dateInTz } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { listStudents } from "@/server/users-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await authorize("students.view");
  } catch (err) {
    if (err instanceof ForbiddenError) return new Response("Not found", { status: 404 });
    throw err;
  }
  const settings = await getSettings(db);
  const rows = await listStudents(db, { status: "all" });
  const body = toCsv(
    ["Display name", "Username", "Active", "Points", "Current streak", "Quizzes", "Last sign-in", "Joined"],
    rows.map((r) => [
      r.displayName,
      r.username,
      r.isActive ? "yes" : "no",
      r.points,
      r.streak,
      r.quizzes,
      r.lastLoginAt ? dateInTz(r.lastLoginAt, settings.timezone) : "",
      dateInTz(r.createdAt, settings.timezone),
    ]),
  );
  return csvResponse(`students-${dateInTz(new Date(), settings.timezone)}.csv`, body);
}
