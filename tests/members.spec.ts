import { test, expect } from "@playwright/test";

test.describe("Members Page", () => {
  test("shows error if no token", async ({ page }) => {
    await page.goto("/members");
    await expect(page.getByTestId("error-state")).toHaveText(/No authentication token found/);
  });

  test("shows loading, then members list", async ({ page }) => {
    await page.goto('/auth/login');

    // Fill inputs
    await page.fill('[data-testid="email-input"]', 'kashbel747@gmail.com');
    await page.fill('[data-testid="password-input"]', '1238@ashbel');

    // Submit
    await page.click('[data-testid="login-button"]');

    //Expect to be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/members");

    // Wait for members to load
    await page.waitForSelector('[data-testid="members-grid"]', { timeout: 5000 });

    // Check title and total members
    await expect(page.getByTestId("members-title")).toHaveText("Members");
    await expect(page.getByTestId("members-grid")).toBeVisible();

    // Ensure at least one member card is visible
    const cards = page.getByTestId("member-card");
    await expect(cards.first()).toBeVisible();
  });
});
