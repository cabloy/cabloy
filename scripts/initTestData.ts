import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

function exec(cmd: string): void {
  execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR });
}

function initTestData(): void {
  // eslint-disable-next-line no-console
  console.log('[init:test-data] Initializing test data via npm run test...');
  try {
    exec('npm run test');
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      '[init:test-data] npm run test failed after init completed; Redis may be unavailable, skipping test data initialization',
    );
  }
}

initTestData();
