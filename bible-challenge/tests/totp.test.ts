import { describe, expect, it } from "vitest";
import { hotp, matchTotp, verifyTotp } from "@/lib/auth/totp";
import { ipFromHeaders } from "@/lib/request";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("auth primitives", () => {
  it("matches the RFC 4226 HOTP test vectors", () => {
    // Secret "12345678901234567890" in base32
    const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
    expect(hotp(secret, 0)).toBe("755224");
    expect(hotp(secret, 1)).toBe("287082");
    expect(hotp(secret, 9)).toBe("520489");
  });

  it("verifies TOTP within one step of drift", () => {
    const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
    const now = 1_700_000_000_000;
    const code = hotp(secret, Math.floor(now / 30000));
    expect(verifyTotp(secret, code, now)).toBe(true);
    expect(verifyTotp(secret, code, now + 30_000)).toBe(true);
    expect(verifyTotp(secret, code, now + 120_000)).toBe(false);
    expect(verifyTotp(secret, "abc", now)).toBe(false);
  });

  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(hash).not.toContain("correct horse");
    expect(await verifyPassword("correct horse battery", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("rejects a replayed TOTP code", () => {
    const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
    const now = 1_700_000_000_000;
    const code = hotp(secret, Math.floor(now / 30000));
    const step = matchTotp(secret, code, now);
    expect(step).not.toBeNull();
    expect(matchTotp(secret, code, now + 10_000, step)).toBeNull();
    const next = hotp(secret, step! + 1);
    expect(matchTotp(secret, next, now + 30_000, step)).toBe(step! + 1);
  });

  it("takes the proxy-appended (rightmost) forwarded IP", () => {
    expect(ipFromHeaders("6.6.6.6, 1.2.3.4", null)).toBe("1.2.3.4");
    expect(ipFromHeaders(null, " 9.9.9.9 ")).toBe("9.9.9.9");
    expect(ipFromHeaders("", null)).toBeNull();
  });
});
