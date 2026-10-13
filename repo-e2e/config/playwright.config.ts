import { defineConfig } from '@playwright/test';

import { E2E_LOCAL_BASE_URL, E2E_ROOT_DIR } from '../scripts/e2e.ts';

export default defineConfig({
  testDir: `${E2E_ROOT_DIR}/repo-e2e/specs`,
  outputDir: process.env.VONA_TEST_RUN_ID
    ? `${E2E_ROOT_DIR}/vona/.app-test-${process.env.VONA_TEST_RUN_ID}/test-results`
    : `${E2E_ROOT_DIR}/repo-e2e/test-results`,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        [
          'html',
          {
            open: 'never',
            outputFolder: process.env.VONA_TEST_RUN_ID
              ? `${E2E_ROOT_DIR}/vona/.app-test-${process.env.VONA_TEST_RUN_ID}/playwright-report`
              : `${E2E_ROOT_DIR}/repo-e2e/playwright-report`,
          },
        ],
        ['list'],
      ]
    : 'list',
  use: {
    baseURL: E2E_LOCAL_BASE_URL,
    trace: 'on-first-retry',
  },
  webServer: process.env.VONA_TEST_RUN_ID
    ? undefined
    : {
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
