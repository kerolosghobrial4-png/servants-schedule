import "server-only";
import { desc, eq } from "drizzle-orm";
import type { DbOrTx } from "@/db";
import { seasons } from "@/db/schema";

export async function listSeasons(db: DbOrTx) {
  return db.query.seasons.findMany({ orderBy: [desc(seasons.startsOn)] });
}

export async function getSeason(db: DbOrTx, id: string) {
  return db.query.seasons.findFirst({ where: eq(seasons.id, id) });
}
