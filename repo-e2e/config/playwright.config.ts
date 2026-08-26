import { defineConfig } from '@playwright/test';

import { E2E_LOCAL_BASE_URL, E2E_ROOT_DIR } from '../scripts/e2e.ts';

const externalBaseURL = process.env.E2E_BASE_URL;
const baseURL = externalBaseURL || E2E_LOCAL_BASE_URL;

export default defineConfig({
  testDir: `${E2E_ROOT_DIR}/repo-e2e/specs`,
  fullyParallel: false,
  workers: 1,
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
        command: 'node repo-e2e/scripts/startE2eVona.ts',
        cwd: E2E_ROOT_DIR,
        url: `${baseURL}/`,
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
