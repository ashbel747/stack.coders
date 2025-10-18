import { test, expect } from "@playwright/test";

test.describe("User Profile Page", () => {

  test("renders my profile successfully", async ({ page }) => {
    // Go to login
    await page.goto("/auth/login");

    // Fill login inputs
    await page.getByTestId("email-input").fill("kashbel747@gmail.com");
    await page.getByTestId("password-input").fill("1238@ashbel");

    // Submit
    await page.getByTestId("login-button").click();

    // Expect redirect
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10000 });

    // Go to profile page
    await page.goto("/profile");

    // Wait for form
    await expect(page.getByTestId("name-input")).toBeVisible();

    // Fill new name and update
    await page.getByTestId("name-input").fill("Ashbel");
    await page.getByTestId("update").click();

    // Re-check name field contains updated value
    await expect(page.getByTestId("name-input")).toHaveValue("Ashbel");
  });
});
