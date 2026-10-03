// Applies pending SQL migrations. Plain JS so it runs in production without a TypeScript toolchain.
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const url = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: url,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
});

try {
  // Serialise concurrent deploys/instances so migrations run exactly once.
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock(727274)");
    await migrate(drizzle(client), { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });
    await client.query("select pg_advisory_unlock(727274)");
  } finally {
    client.release();
  }
  console.log("Migrations applied.");
} catch (err) {
  console.error("Migration failed:", err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
