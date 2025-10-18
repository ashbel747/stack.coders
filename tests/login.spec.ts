import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('user can log in successfully or shows error', async ({ page }) => {

    await page.goto('/auth/login');

    // Fill inputs
    await page.fill('[data-testid="email-input"]', 'kashbel747@gmail.com');
    await page.fill('[data-testid="password-input"]', '1238@ashbel');

    // Submit
    await page.click('[data-testid="login-button"]');

    // Wait for either success (dashboard) or error message
    const result = await Promise.race([
      page.waitForURL(/\/dashboard$/, { timeout: 10000 }).then(() => 'success'),
      page.waitForSelector('[data-testid="error-message"]', { timeout: 10000 }).then(() => 'error'),
    ]);

    if (result === 'error') {
      const errorText = await page.textContent('[data-testid="error-message"]');
      throw new Error(`Login failed: ${errorText}`);
    }

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
