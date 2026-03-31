import { test, expect } from '@playwright/test';

test('Verify Dashboard Subjects UI structure', async ({ page }) => {
  // Inject the required app state to bypass onboarding
  await page.goto('http://localhost:3000/EduGuide/#/dashboard');

  await page.evaluate(() => {
    window.localStorage.setItem('eduguide-storage', JSON.stringify({
      state: {
        hasSeenOnboarding: true,
        selectedBoard: 'CBSE',
        selectedClass: 'Class 10',
        theme: 'light',
        streak: 0,
        lastActiveDate: null
      },
      version: 0
    }));
  });

  await page.goto('http://localhost:3000/EduGuide/#/dashboard');
  await page.waitForLoadState('networkidle');

  // Verify it tries to go to Dashboard or shows login since user isn't auth'd.
  // Actually, we can bypass auth for this specific manual mock
  await page.evaluate(() => {
    // Inject mock user profile
    const useAuthStore = window.__ZUSTAND_STORES__?.auth || (window as any).useAuthStore;
    if (useAuthStore) {
      useAuthStore.getState().setProfile({
         id: "mock_id",
         selected_subjects: []
      });
      useAuthStore.getState().setSession({
        user: { id: "mock_id" }
      });
    }
  });

  await page.screenshot({ path: 'subjects_dashboard.png', fullPage: true });
});
