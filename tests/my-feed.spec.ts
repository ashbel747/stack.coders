import { test, expect } from "@playwright/test";

test.describe("My Feed Page", () => {
  test("creates a new post admin role", async ({ page }) => {
    await page.goto('/auth/login');

    // Fill inputs
    await page.fill('[data-testid="email-input"]', 'kashbel747@gmail.com');
    await page.fill('[data-testid="password-input"]', '1238@ashbel');

    // Submit
    await page.click('[data-testid="login-button"]');

    //Expect to be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/feed/my-feed");

    await page.fill('[data-testid="title-input"]', "Playwright Post");
    await page.fill('[data-testid="description-input"]', "Automated test post");
    await page.click('[data-testid="post-button"]');

    // Check if create was triggered (optional visual check)
    await expect(page.getByTestId("create-post-form")).toBeVisible();
  });
});
