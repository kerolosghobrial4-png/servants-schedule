import { db } from "@/db";
import { ForbiddenError, authorize } from "@/lib/action-guard";
import { csvResponse, toCsv } from "@/lib/csv";
import { dateInTz } from "@/lib/time";
import { getSettings } from "@/server/settings";
import { ledgerWithActors } from "@/server/users-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await authorize("points.manage");
  } catch (err) {
    if (err instanceof ForbiddenError) return new Response("Not found", { status: 404 });
    throw err;
  }
  const settings = await getSettings(db);
  const rows = await ledgerWithActors(db, { limit: 100_000 });
  const body = toCsv(
    ["Recorded at (UTC)", "Counts on", "Student", "Amount", "Category", "Description", "Private note", "By", "Reversed", "Entry id", "Reverses entry"],
    rows.map((r) => [
      r.createdAt,
      dateInTz(r.effectiveAt, settings.timezone),
      r.studentName,
      r.amount,
      r.category,
      r.description,
      r.note ?? "",
      r.actorName ?? "system",
      r.isReversed ? "yes" : "",
      r.id,
      r.reversesId ?? "",
    ]),
  );
  return csvResponse(`points-ledger-${dateInTz(new Date(), settings.timezone)}.csv`, body);
}
