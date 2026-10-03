import { defineConfig, devices } from "@playwright/test";

/**
 * Browser end-to-end tests. Expects a running app with demo data:
 *   npm run db:seed && npm run db:seed:demo && npm run build && npm start
 *   E2E_BASE_URL=http://localhost:3000 npm run test:e2e
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
});
