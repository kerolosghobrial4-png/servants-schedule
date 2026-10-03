import "server-only";
import type { DbOrTx } from "@/db";
import { auditLog } from "@/db/schema";

/** Append-only record of every staff action (enforced by a DB trigger). */
export async function audit(
  db: DbOrTx,
  entry: {
    actorId: string | null;
    action: string;
    targetType?: string;
    targetId?: string;
    details?: Record<string, unknown>;
  },
) {
  await db.insert(auditLog).values({
    actorId: entry.actorId,
    action: entry.action,
    targetType: entry.targetType ?? null,
    targetId: entry.targetId ?? null,
    details: entry.details ?? {},
  });
}
