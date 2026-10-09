import { defineConfig } from '@playwright/test';

import { E2E_LOCAL_BASE_URL, E2E_ROOT_DIR } from '../scripts/e2e.ts';

export default defineConfig({
  testDir: `${E2E_ROOT_DIR}/repo-e2e/specs`,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: E2E_LOCAL_BASE_URL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node repo-e2e/scripts/startE2eVona.ts',
    cwd: E2E_ROOT_DIR,
    url: `${E2E_LOCAL_BASE_URL}/health/ready`,
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
