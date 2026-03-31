import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /test_frontend\.ts/,
  use: {
    baseURL: 'http://localhost:3000/EduGuide/',
  },
});
