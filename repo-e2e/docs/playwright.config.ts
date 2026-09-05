import { defineConfig } from '@playwright/test';

const rootDir = new URL('../..', import.meta.url).pathname;
const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: `${rootDir}/repo-e2e/docs/specs`,
  outputDir: `${rootDir}/repo-e2e/docs/test-results`,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        ['html', { open: 'never', outputFolder: `${rootDir}/repo-e2e/docs/playwright-report` }],
        ['list'],
      ]
    : 'list',
  use: {
    baseURL,
    viewport: { width: 1440, height: 900 },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm --dir repo-docs docs:preview -- --host 127.0.0.1 --port 4173 --strictPort',
    cwd: rootDir,
    url: `${baseURL}/`,
    timeout: 120_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    gracefulShutdown: {
      signal: 'SIGINT',
      timeout: 10_000,
    },
  },
});
