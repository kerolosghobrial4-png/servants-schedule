/** Prints any inconsistencies between submissions and the points ledger. Read-only. */
import "dotenv/config";
import { db, pool } from "../src/db";
import { checkLedgerIntegrity } from "../src/server/integrity";

checkLedgerIntegrity(db)
  .then(({ checked, issues }) => {
    console.log(`Checked ${checked} submissions.`);
    if (!issues.length) console.log("No issues found.");
    for (const i of issues) console.log(`- [${i.kind}] ${i.detail}${i.submissionId ? ` (submission ${i.submissionId})` : ""}`);
    if (issues.length) process.exitCode = 2;
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
