import * as dotenv from '@cabloy/dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const E2E_ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const vonaEnv = dotenv.loadEnvs(
  { flavor: 'normal', mode: 'dev', local: 'local' },
  resolve(E2E_ROOT_DIR, 'vona', 'env'),
  '.env',
);
const e2ePort = Number(vonaEnv?.SERVER_LISTEN_PORT);
if (!Number.isInteger(e2ePort) || e2ePort <= 0 || e2ePort > 65535) {
  throw new Error('Missing or invalid SERVER_LISTEN_PORT for local E2E target');
}

export const E2E_PORT = e2ePort;
export const E2E_LOCAL_BASE_URL = `http://127.0.0.1:${E2E_PORT}`;

const E2E_CONFIG_DIR = resolve(E2E_ROOT_DIR, 'e2e', 'config');
const E2E_SPECS_DIR = resolve(E2E_ROOT_DIR, 'e2e', 'specs');

const e2eSuites = {
  basic: {
    externalBaseUrlEnv: 'BASIC_E2E_BASE_URL',
    configFile: resolve(E2E_CONFIG_DIR, 'playwright.basic.config.ts'),
    testDir: resolve(E2E_SPECS_DIR, 'cabloy-basic'),
    readinessPath: '/',
  },
  commerce: {
    externalBaseUrlEnv: 'COMMERCE_E2E_BASE_URL',
    configFile: resolve(E2E_CONFIG_DIR, 'playwright.commerce.config.ts'),
    testDir: resolve(E2E_SPECS_DIR, 'a-commerce'),
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
