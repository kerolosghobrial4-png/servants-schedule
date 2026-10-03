/**
 * Bootstraps a fresh database: default settings, starter achievements and the
 * first admin (from ADMIN_USERNAME / ADMIN_PASSWORD). Safe to run repeatedly.
 */
import "dotenv/config";
import { db, pool } from "../src/db";
import { bootstrap } from "../src/server/bootstrap";

bootstrap(db, { ...process.env, SEED_DEMO_DATA: "false" })
  .then((r) => {
    for (const n of r.notes) console.warn(n);
    console.log(r.createdAdmin ? `Created admin "${r.createdAdmin}".` : "Admin already exists — not changed.");
    console.log("Seed complete.");
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
