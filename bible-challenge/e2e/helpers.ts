import { expect, type Page } from "@playwright/test";

export const ADMIN = { user: process.env.E2E_ADMIN_USERNAME ?? "admin", pass: process.env.E2E_ADMIN_PASSWORD ?? "dev-admin-password" };
export const DEMO_PASSWORD = "bible-demo-2026";

export async function signIn(page: Page, username: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
