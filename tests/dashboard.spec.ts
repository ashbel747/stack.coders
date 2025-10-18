import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test("redirects to login or shows error when user is not logged in", async ({ page }) => {
    await page.goto("/dashboard");

    // Expect error message or redirect
    const result = await Promise.race([
      page.waitForSelector("text=Authentication token not found", { timeout: 8000 }).then(() => "error"),
      page.waitForURL(/\/auth\/login$/, { timeout: 8000 }).then(() => "redirect"),
    ]);

    expect(["error", "redirect"]).toContain(result);
  });

  test("displays user dashboard when logged in", async ({ page }) => {
    await page.goto('/auth/login');

    // Fill inputs
    await page.fill('[data-testid="email-input"]', 'kashbel747@gmail.com');
    await page.fill('[data-testid="password-input"]', '1238@ashbel');

    // Submit
    await page.click('[data-testid="login-button"]');

    //Expect to be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // Wait for welcome message
    await expect(page.getByText("Welcome back, Ashbel!")).toBeVisible();

    // Verify role and quick actions
    await expect(page.getByText(/ROLE:/)).toBeVisible();
    await expect(page.getByText("Quick Actions:")).toBeVisible();

    // Check presence of expected action cards for admin
    await expect(page.getByTestId("quick-action-create-project")).toBeVisible();
    await expect(page.getByTestId("quick-action-my-projects")).toBeVisible();
    await expect(page.getByTestId("quick-action-all-projects")).toBeVisible();
    await expect(page.getByTestId("quick-action-my-notifications")).toBeVisible();
    await expect(page.getByTestId("quick-action-community-feed")).toBeVisible();
    await expect(page.getByTestId("quick-action-members")).toBeVisible();

    // Ensure footer is visible
    await expect(page.getByText(/Built with passion by the Stack Coders Admin Team/)).toBeVisible();
  });
});
