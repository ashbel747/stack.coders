import { test, expect } from "@playwright/test";

test.describe("Create Project Page", () => {

  test("creates a new project successfully", async ({ page }) => {
    //Go to login page
    await page.goto("/auth/login");

    //Log in
    await page.fill('[data-testid="email-input"]', "kashbel747@gmail.com");
    await page.fill('[data-testid="password-input"]', "1238@ashbel");
    await page.click('[data-testid="login-button"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    //Navigate to Create Project page
    await page.goto("/projects/create");
    await expect(page.getByText("Ready to build something amazing?")).toBeVisible();

    // Fill out the form
    await page.fill('[data-testid="title-input"]', "Test Automation Project");
    await page.fill('[data-testid="description-input"]', "This is a test project created by Playwright.");
    await page.fill('[data-testid="category-input"]', "Automation");
    await page.fill('[data-testid="team-size-input"]', "3");
    await page.fill('[data-testid="skills-input"]', "React, Node.js, MongoDB");
    await page.fill('[data-testid="github-input"]', "https://github.com/test/repo");

    // Optional: fill deadline with today + 7 days
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    const dateStr = nextWeek.toISOString().split("T")[0];
    await page.fill('[data-testid="deadline-input"]', dateStr);

    // Submit
    await page.click('[data-testid="create-project-button"]');

    //Expect redirect to personal projects page
    await expect(page).toHaveURL(/\/projects\/personal$/);
  });
});
