export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { checkEnvironment } = await import("./lib/env");
  const { errors, warnings } = checkEnvironment();
  for (const w of warnings) console.warn(`[config] ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`[config] ${e}`);
    throw new Error("Invalid configuration — see the [config] messages above.");
  }
}
