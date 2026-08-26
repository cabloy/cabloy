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
export const E2E_CONFIG_FILE = resolve(E2E_ROOT_DIR, 'repo-e2e', 'config', 'playwright.config.ts');
export const E2E_SPECS_DIR = resolve(E2E_ROOT_DIR, 'repo-e2e', 'specs');
