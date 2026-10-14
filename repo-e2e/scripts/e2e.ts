import * as dotenv from '@cabloy/dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const E2E_ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

if (process.env.E2E_BASE_URL !== undefined) {
  throw new Error('E2E_BASE_URL is unsupported; the E2E runner manages a local test-mode target.');
}

const vonaEnv = dotenv.loadEnvs(
  { flavor: 'normal', mode: 'test', local: 'local' },
  resolve(E2E_ROOT_DIR, 'vona', 'env'),
  '.env',
);
const runId = process.env.VONA_TEST_RUN_ID;
if (runId) {
  const match = /^(\d{14})-[a-f0-9]{8}$/.exec(runId);
  const timestamp = match?.[1];
  const date = timestamp
    ? new Date(
        `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}T${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}:${timestamp.slice(12, 14)}Z`,
      )
    : undefined;
  if (
    !timestamp ||
    !date ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 19).replace(/[-:T]/g, '') !== timestamp
  ) {
    throw new Error('Invalid isolated test run ID: expected a UTC timestamp plus eight hex digits');
  }
}
const e2ePort = Number(runId ? process.env.SERVER_LISTEN_PORT : vonaEnv?.SERVER_LISTEN_PORT);
if (!Number.isInteger(e2ePort) || e2ePort <= 0 || e2ePort > 65535) {
  throw new Error('Missing or invalid SERVER_LISTEN_PORT for local E2E target');
}

export const E2E_PORT = e2ePort;
export const E2E_LOCAL_BASE_URL = `http://127.0.0.1:${E2E_PORT}`;
export const E2E_CONFIG_FILE = resolve(E2E_ROOT_DIR, 'repo-e2e', 'config', 'playwright.config.ts');
export const E2E_SPECS_DIR = resolve(E2E_ROOT_DIR, 'repo-e2e', 'specs');
