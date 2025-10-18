import { test, expect } from "@playwright/test";

test.describe("My Projects Page", () => {
  test("displays and manages personal projects", async ({ page }) => {
    // Login first
    await page.goto("/auth/login");
    await page.fill('[data-testid="email-input"]', "kashbel747@gmail.com");
    await page.fill('[data-testid="password-input"]', "1238@ashbel");
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL(/\/dashboard$/);

    // Go to My Projects page
    await page.goto("/projects/personal");
    await expect(page.locator('[data-testid="my-projects-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="my-projects-title"]')).toHaveText("My Projects");


    // Test navigation to create page
    await page.click('[data-testid="new-project-button"]');
    await expect(page).toHaveURL(/\/projects\/create$/);
  });
});
