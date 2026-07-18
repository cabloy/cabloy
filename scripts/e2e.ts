export const E2E_PORT = 7102;
export const E2E_LOCAL_BASE_URL = `http://127.0.0.1:${E2E_PORT}`;

const e2eSuites = {
  basic: {
    externalBaseUrlEnv: 'BASIC_E2E_BASE_URL',
    configFile: 'playwright.basic.config.ts',
    testDir: './e2e/a-basic',
    readinessPath: '/',
  },
  commerce: {
    externalBaseUrlEnv: 'COMMERCE_E2E_BASE_URL',
    configFile: 'playwright.commerce.config.ts',
    testDir: './e2e/a-commerce',
    readinessPath: '/commerce',
  },
} as const;

export type E2eSuiteName = keyof typeof e2eSuites;

export function getE2eSuite(name: string | undefined) {
  if (name && name in e2eSuites) {
    return e2eSuites[name as E2eSuiteName];
  }
  throw new Error(`Expected an E2E suite: ${Object.keys(e2eSuites).join(', ')}.`);
}
