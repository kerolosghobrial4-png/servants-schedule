import { describe, expect, it } from "vitest";
import { checkEnvironment } from "@/lib/env";

describe("environment check", () => {
  it("requires a postgres DATABASE_URL", () => {
    expect(checkEnvironment({ NODE_ENV: "development" } as NodeJS.ProcessEnv).errors).toHaveLength(1);
    expect(checkEnvironment({ NODE_ENV: "development", DATABASE_URL: "mysql://x" } as NodeJS.ProcessEnv).errors).toHaveLength(1);
    expect(checkEnvironment({ NODE_ENV: "development", DATABASE_URL: "postgres://x" } as NodeJS.ProcessEnv).errors).toEqual([]);
  });

  it("validates the server-actions key in production", () => {
    const base = { NODE_ENV: "production", DATABASE_URL: "postgres://x", TRUST_PROXY: "true" } as NodeJS.ProcessEnv;
    expect(checkEnvironment(base).warnings.length).toBe(1);
    expect(checkEnvironment({ ...base, NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: "short" }).errors.length).toBe(1);
    const good = Buffer.alloc(32, 7).toString("base64");
    expect(checkEnvironment({ ...base, NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: good })).toEqual({ errors: [], warnings: [] });
  });
});
