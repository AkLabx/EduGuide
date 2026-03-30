import { test, expect } from '@playwright/test';

test('login flow and dashboard redirect', async ({ page }) => {
  // Inject local storage to bypass onboarding and set a mock board/class
  // So we only test the authentication flow
  await page.addInitScript(() => {
    window.localStorage.setItem('eduguide-storage', JSON.stringify({
      state: {
        hasSeenOnboarding: true,
        selectedBoard: 'CBSE',
        selectedClass: '10'
      },
      version: 0
    }));
  });

  await page.goto('/#/auth');

  // Ensure we are on auth page initially
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible({ timeout: 10000 });

  // Fill in login credentials
  await page.getByPlaceholder('you@example.com').fill('user@eduguide.com');
  await page.getByPlaceholder('••••••••').fill('userguide');

  // Submit login
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for the redirect to Dashboard
  await expect(page).toHaveURL(/.*#\/dashboard/, { timeout: 15000 });

  // Verify dashboard loaded correctly
  await expect(page.getByText('Class 10')).toBeVisible();

  // Reload the page and ensure we stay on the dashboard (don't get bounced back to auth)
  await page.reload();
  await expect(page).toHaveURL(/.*#\/dashboard/, { timeout: 15000 });
});
