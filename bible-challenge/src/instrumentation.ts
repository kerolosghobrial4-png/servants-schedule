export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { checkEnvironment } = await import("./lib/env");
  const { errors, warnings } = checkEnvironment();
  for (const w of warnings) console.warn(`[config] ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`[config] ${e}`);
    throw new Error("Invalid configuration — see the [config] messages above.");
  }

  // For hosts without a shell (Netlify, Vercel…): create defaults, the first
  // admin and optional demo data on start. Idempotent; never blocks serving.
  if (process.env.BOOTSTRAP_ON_START === "true") {
    try {
      const [{ db }, { bootstrap }] = await Promise.all([import("./db"), import("./server/bootstrap")]);
      const r = await bootstrap(db);
      for (const n of r.notes) console.warn(`[bootstrap] ${n}`);
      if (r.createdAdmin) console.log(`[bootstrap] created admin "${r.createdAdmin}"`);
      if (r.loadedDemo) console.log("[bootstrap] loaded demo data");
    } catch (err) {
      console.error("[bootstrap] failed (is the database migrated?)", err);
    }
  }
}
