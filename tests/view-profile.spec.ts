import { test, expect } from "@playwright/test";

test.describe("User Profile Page", () => {
  const userId = "68f2a142aed5e38b1bb9415f";
    
  test("renders profile successfully", async ({ page }) => {
    await page.goto('/auth/login');

    // Fill inputs
    await page.fill('[data-testid="email-input"]', 'kashbel747@gmail.com');
    await page.fill('[data-testid="password-input"]', '1238@ashbel');

    // Submit
    await page.click('[data-testid="login-button"]');

    //Expect to be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto(`/profile/${userId}`);

    // Wait for final profile
    await expect(page.getByTestId("profile-page")).toBeVisible();
    await expect(page.getByTestId("profile-name")).toBeVisible();
    await expect(page.getByTestId("profile-id")).toContainText(userId);
  });

  test("shows error if not logged in", async ({ page }) => {
    await page.goto(`/profile/${userId}`);
    await expect(page.getByTestId("error-profile")).toHaveText(
      /You must be logged in/i
    );
  });
});
