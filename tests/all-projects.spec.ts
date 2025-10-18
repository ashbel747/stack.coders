import { test, expect } from "@playwright/test";

test.describe("All Projects Page", () => {
  test("shows all projects after login", async ({ page }) => {
    await page.goto("/auth/login");

    // Fill inputs
    await page.fill('[data-testid="email-input"]', "kashbel747@gmail.com");
    await page.fill('[data-testid="password-input"]', "1238@ashbel");

    // Submit
    await page.click('[data-testid="login-button"]');

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // Go to All Projects
    await page.goto("/projects");

    // Confirm loaded page
    await expect(page.getByTestId("projects-title")).toBeVisible();
  });
});
