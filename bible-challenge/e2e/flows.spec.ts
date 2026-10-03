import { expect, test } from "@playwright/test";
import { ADMIN, DEMO_PASSWORD, signIn } from "./helpers";

test("signed-out visitors are sent to the login page", async ({ page }) => {
  await page.goto("/admin/students");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: /Bible\s*Challenge/i })).toBeVisible();
});

test("wrong passwords get a generic error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill("nobody-here");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Incorrect username or password.")).toBeVisible();
});

test("students can't reach the admin panel or exports", async ({ page }) => {
  await signIn(page, "mark", DEMO_PASSWORD);
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
  for (const path of ["/admin", "/admin/students", "/admin/points"]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
  }
  const csv = await page.request.get("/admin/export/ledger", { maxRedirects: 0 });
  expect(csv.status()).toBe(404);
});

test("leader publishes a quiz, a student takes it once, points appear", async ({ page, browser }) => {
  const title = `E2E ${Date.now()}`;
  await signIn(page, ADMIN.user, ADMIN.pass);
  await page.goto("/admin/quizzes/new");
  await page.locator("#title").fill(title);
  await page.locator("#passage").fill("Exodus 3:1–14");
  await page.locator("#startTime").fill("00:00");
  await page.getByLabel("Question", { exact: true }).fill("Who saw the burning bush?");
  for (const [i, label] of ["Abraham", "Moses", "David", "Elijah"].entries()) {
    await page.getByLabel(`Option ${"ABCD"[i]}`, { exact: true }).fill(label);
  }
  await page.getByLabel("Mark option B correct").click();
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page).toHaveURL(/saved=publish/);
  const quizId = page.url().match(/quizzes\/([0-9a-f-]{36})/)![1];

  const student = await (await browser.newContext()).newPage();
  await signIn(student, "andrew", DEMO_PASSWORD);
  await student.goto(`/quiz/${quizId}`);
  await student.getByRole("radio", { name: /Moses/ }).click();
  await student.getByRole("button", { name: /Review/ }).click();
  await student.getByRole("button", { name: /Submit answers/ }).click();
  await expect(student).toHaveURL(/submitted=1/);
  await expect(student.getByLabel("Your result")).toContainText("1/1");

  // A second visit shows results, never the form again.
  await student.goto(`/quiz/${quizId}`);
  await expect(student.getByRole("button", { name: /Submit answers/ })).toHaveCount(0);

  await student.goto("/history");
  await expect(student.getByText(`Correct answers — ${title} (1/1)`)).toBeVisible();
});

test("new students must replace their temporary password", async ({ page, browser }) => {
  const username = `e2e${Date.now().toString(36)}`;
  await signIn(page, ADMIN.user, ADMIN.pass);
  await page.goto("/admin/students/new");
  await page.getByLabel("Display name").fill("Tester");
  await page.getByLabel("Username").fill(username);
  await page.getByRole("button", { name: "Create account" }).click();
  const temp = (await page.locator("p.font-mono").innerText()).trim();

  const s = await (await browser.newContext()).newPage();
  await signIn(s, username, temp);
  await expect(s).toHaveURL(/\/change-password/);
  await s.goto("/");
  await expect(s).toHaveURL(/\/change-password/);
  await s.getByLabel("Current password").fill(temp);
  await s.getByLabel("New password", { exact: true }).fill("a-brand-new-password");
  await s.getByLabel("Confirm new password").fill("a-brand-new-password");
  await s.getByRole("button", { name: "Save password" }).click();
  await expect(s.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
});
