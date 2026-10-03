import { describe, expect, it } from "vitest";
import { hotp, verifyTotp } from "@/lib/auth/totp";
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
});
