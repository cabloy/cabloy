import { defineConfig } from '@playwright/test';

const externalBaseURL = process.env.COMMERCE_E2E_BASE_URL;
const baseURL = externalBaseURL || 'http://127.0.0.1:7102';

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
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'node scripts/startE2eCommerceVona.ts',
        url: `${baseURL}/commerce`,
        timeout: 180_000,
        reuseExistingServer: false,
        stdout: 'pipe',
        stderr: 'pipe',
        gracefulShutdown: {
          signal: 'SIGINT',
          timeout: 10_000,
        },
      },
});
