// Mirrors drizzle/*.sql into netlify/database/migrations/<NNNN_slug>/migration.sql,
// the layout Netlify Database applies automatically before each deploy is published.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const src = join(root, "drizzle");
const out = join(root, "netlify/database/migrations");
rmSync(out, { recursive: true, force: true });
for (const file of readdirSync(src).filter((f) => f.endsWith(".sql")).sort()) {
  const [num, ...rest] = file.replace(/\.sql$/, "").split("_");
  const slug = rest.join("-").toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const dir = join(out, `${num}_${slug}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "migration.sql"), readFileSync(join(src, file)));
}
console.log("Netlify migrations synced.");
