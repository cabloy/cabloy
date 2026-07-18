import { defineConfig } from '@playwright/test';

import type { E2eSuiteName } from './scripts/e2e.ts';

import { E2E_LOCAL_BASE_URL, getE2eSuite } from './scripts/e2e.ts';

export function createE2eConfig(suiteName: E2eSuiteName) {
  const suite = getE2eSuite(suiteName);
  const externalBaseURL = process.env[suite.externalBaseUrlEnv];
  const baseURL = externalBaseURL || E2E_LOCAL_BASE_URL;

  return defineConfig({
    testDir: suite.testDir,
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
          command: 'node scripts/startE2eVona.ts',
          url: `${baseURL}${suite.readinessPath}`,
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
}
