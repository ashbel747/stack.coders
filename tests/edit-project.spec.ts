import { test, expect } from '@playwright/test';

test.describe('Edit Project Flow', () => {
  const projectId = '68f3ebad57ca8dbd131a7659'; 

  test('should log in and edit project successfully', async ({ page }) => {
    // Go to login page
    await page.goto("/auth/login");

    // Fill inputs
    await page.fill('[data-testid="email-input"]', "kashbel747@gmail.com");
    await page.fill('[data-testid="password-input"]', "1238@ashbel");

    // Submit
    await page.click('[data-testid="login-button"]');

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // Go to edit project page
    await page.goto(`/projects/${projectId}/edit`);

    // Expect correct URL
    await expect(page).toHaveURL(new RegExp(`/projects/${projectId}/edit`));

    // Wait for form to load
    await page.waitForSelector('form');

    // Edit form fields using testids
    await page.getByTestId('title-input').fill('Updated Project Title');
    await page
      .getByTestId('description-input')
      .fill('Updated project description for automated Playwright testing.');
    await page.getByTestId('category-input').fill('Web Development');
    await page.getByTestId('team-size-input').fill('5');
    await page.getByTestId('skills-input').fill('React, Node.js, MongoDB');
    await page
      .getByTestId('github-input')
      .fill('https://github.com/testuser/updated-project');

    // Click Save button
    await page.getByTestId('save-button').click();

    // Expect redirect to /projects/personal
    await expect(page).toHaveURL(/\/projects\/personal$/, { timeout: 20000 });
  });
});
