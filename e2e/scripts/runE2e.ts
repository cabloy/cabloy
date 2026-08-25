import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

import {
  E2E_CONFIG_FILE,
  E2E_LOCAL_BASE_URL,
  E2E_PORT,
  E2E_ROOT_DIR,
  E2E_SPECS_DIR,
} from './e2e.ts';
import { combineGreps, parseE2eArgs } from './runE2eArgs.ts';

function run(command: string, args: string[]): void {
  // eslint-disable-next-line no-console
  console.log(`\n===> ${[command, ...args].join(' ')}`);
  execFileSync(command, args, {
    cwd: E2E_ROOT_DIR,
    stdio: 'inherit',
  });
}

async function assertPortAvailable(): Promise<void> {
  const server = createServer();
  await new Promise<void>((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(E2E_PORT, '127.0.0.1', () => {
      server.close(error => {
        if (error) reject(error);
        else resolvePromise();
      });
    });
  });
}

const parsed = parseE2eArgs(process.argv.slice(2), E2E_SPECS_DIR);
if (parsed.mode === 'clean' && process.env.E2E_BASE_URL) {
  throw new Error(
    'The clean E2E run manages the local target and cannot be used with E2E_BASE_URL. Use test:e2e:fast for an external target.',
  );
}

if (parsed.mode === 'clean') {
  await assertPortAvailable();
  run('npm', ['run', 'db:reset']);
}

const playwrightCommand = resolve(
  E2E_ROOT_DIR,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright',
);
const specPaths = parsed.specNames.map(name => resolve(E2E_SPECS_DIR, `${name}.spec.ts`));
const playwrightArgs = combineGreps(parsed.playwrightArgs, parsed.tags);
run(playwrightCommand, ['test', '--config', E2E_CONFIG_FILE, ...specPaths, ...playwrightArgs]);

// Keep this value referenced in the runner's startup output and make the local target explicit.
if (!process.env.E2E_BASE_URL) {
  // eslint-disable-next-line no-console
  console.log(`E2E target: ${E2E_LOCAL_BASE_URL}`);
}
