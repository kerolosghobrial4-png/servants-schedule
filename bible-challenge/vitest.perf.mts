import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "server-only": path.resolve(import.meta.dirname, "tests/server-only-stub.ts"),
    },
  },
  test: {
    include: ["tests/perf/**/*.bench.ts"],
    env: { DATABASE_URL: process.env.LOAD_DATABASE_URL ?? "" },
    testTimeout: 300_000,
  },
});
