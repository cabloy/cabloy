import { defineConfig } from '@playwright/test';

const baseURL = process.env.COMMERCE_E2E_BASE_URL || 'http://127.0.0.1:9000';

export default defineConfig({
  testDir: './e2e/a-commerce',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
});
