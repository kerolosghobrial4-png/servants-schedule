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
  // Netlify's edge sets this to the real client address.
  const netlify = h.get("x-nf-client-connection-ip")?.trim();
  if (netlify) return netlify.slice(0, 64);
  return ipFromHeaders(h.get("x-forwarded-for"), h.get("x-real-ip"));
}

/**
 * The rightmost X-Forwarded-For entry is the one appended by the proxy in
 * front of the app; entries to its left are supplied by the client and can
 * be forged, so they're ignored.
 */
export function ipFromHeaders(forwardedFor: string | null, realIp: string | null): string | null {
  const last = forwardedFor?.split(",").map((s) => s.trim()).filter(Boolean).at(-1);
  const ip = last || realIp?.trim() || null;
  return ip ? ip.slice(0, 64) : null;
}
