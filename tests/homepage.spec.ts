import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display hero, feed, contact form, and footer', async ({ page }) => {
    // Go to root URL
    await page.goto('http://localhost:3000/');

    // Check Hero section is visible
    await expect(page.locator('div.relative')).toContainText('Stack Coders');

    // Check Feed section
    await expect(page.locator('text=Community Feed')).toBeVisible();

    // Check Contact form exists
    await expect(page.locator('form')).toBeVisible();

    // Check Footer exists
    await expect(page.locator('footer')).toBeVisible();
  });
});
