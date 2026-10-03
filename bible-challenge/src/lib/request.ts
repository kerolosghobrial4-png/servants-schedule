import "server-only";
import { headers } from "next/headers";

/**
 * Client IP for rate limiting. Forwarded headers are only trusted when the
 * deployment says a proxy sets them (TRUST_PROXY=true); otherwise they could
 * be spoofed to dodge limits.
 */
export async function clientIp(): Promise<string | null> {
  if (process.env.TRUST_PROXY !== "true") return null;
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 64) || null;
  return h.get("x-real-ip")?.slice(0, 64) ?? null;
}
