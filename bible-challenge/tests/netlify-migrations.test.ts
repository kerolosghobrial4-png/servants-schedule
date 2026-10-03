import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("netlify migrations", () => {
  it("mirror every drizzle migration exactly (run `npm run db:generate`)", () => {
    const root = join(__dirname, "..");
    const drizzle = readdirSync(join(root, "drizzle")).filter((f) => f.endsWith(".sql")).sort();
    const netlify = readdirSync(join(root, "netlify/database/migrations")).sort();
    expect(netlify.length).toBe(drizzle.length);
    drizzle.forEach((file, i) => {
      expect(netlify[i].startsWith(file.split("_")[0] + "_")).toBe(true);
      expect(netlify[i]).toMatch(/^\d+_[a-z0-9-]+$/);
      expect(readFileSync(join(root, "netlify/database/migrations", netlify[i], "migration.sql"), "utf8")).toBe(
        readFileSync(join(root, "drizzle", file), "utf8"),
      );
    });
  });
});
