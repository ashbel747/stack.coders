import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Signup Page', () => {
  test('user can sign up successfully', async ({ page }) => {
    await page.goto('/auth/signup');

    // Fill text inputs
    await page.fill('[data-testid="name-input"]', 'Playwright');
    await page.fill('[data-testid="description-input"]', 'Playwright tester');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', '1238@ashbel');
    await page.fill('[data-testid="confirm-password-input"]', '1238@ashbel');
    await page.fill('[data-testid="skills-input"]', 'React, Node.js, MongoDB');

    // Select role
    await page.selectOption('[data-testid="role-select"]', 'dev');

    // Upload avatar
    const filePath = path.resolve(__dirname, 'avatar.webp');
    await page.setInputFiles('[data-testid="avatar-input"]', filePath);

    // Submit form
    await page.click('[data-testid="signup-button"]');
  });
});
