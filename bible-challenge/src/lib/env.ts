/**
 * Startup configuration check. Fails fast with a readable message instead of
 * a confusing runtime error on the first request.
 */
export function checkEnvironment(env: NodeJS.ProcessEnv = process.env): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prod = env.NODE_ENV === "production";

  const url = env.DATABASE_URL || env.NETLIFY_DB_URL || "";
  if (!url) errors.push("DATABASE_URL is not set.");
  else if (!/^postgres(ql)?:\/\//.test(url)) errors.push("DATABASE_URL must start with postgres:// or postgresql://");

  if (prod) {
    const key = env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY ?? "";
    if (!key) {
      warnings.push(
        "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY is not set. Set a stable value (openssl rand -base64 32) so forms keep working across deploys and instances.",
      );
    } else if (Buffer.from(key, "base64").length !== 32) {
      errors.push("NEXT_SERVER_ACTIONS_ENCRYPTION_KEY must be 32 bytes, base64-encoded (openssl rand -base64 32).");
    }
    if (env.COOKIE_SECURE === "false") {
      warnings.push("COOKIE_SECURE=false in production: session cookies will be sent over plain HTTP. Only do this for local testing.");
    }
    if (env.TRUST_PROXY !== "true") {
      warnings.push("TRUST_PROXY is not 'true', so per-IP login limits are off (per-username limits still apply).");
    }
  }
  return { errors, warnings };
}
