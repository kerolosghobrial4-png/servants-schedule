import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;
/** Either the root db handle or a transaction handle. */
export type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type DbOrTx = Database | Tx;

const globalForDb = globalThis as unknown as { __pgPool?: Pool };

function createPool() {
  // NETLIFY_DB_URL is provided automatically when the site uses Netlify Database.
  const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
        : undefined,
  });
}

// Reuse the pool across hot reloads in development.
const pool = globalForDb.__pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.__pgPool = pool;

export const db: Database = drizzle(pool, { schema });
export { pool, schema };
