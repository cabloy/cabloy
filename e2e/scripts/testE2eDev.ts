import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';

import { E2E_PORT, E2E_ROOT_DIR, getE2eSuite } from './e2e.ts';

const suiteName = process.argv[2];
const suite = getE2eSuite(suiteName);
const playwrightArgs = process.argv.slice(3);

function run(command: string, args: string[], cwd = E2E_ROOT_DIR) {
  // eslint-disable-next-line
  console.log(`\n===> ${[command, ...args].join(' ')}`);
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

function assertPlaywrightArgs(args: string[]) {
  for (const arg of args) {
    if (arg === '--config' || arg.startsWith('--config=')) {
      throw new Error(
        `test:e2e:${suiteName}:dev manages its suite config. Use --grep or --grep-invert to select tests.`,
      );
    }
    if (!arg.startsWith('-') && (arg.startsWith('e2e/') || /\.[cm]?[jt]sx?$/.test(arg))) {
      throw new Error(
        `test:e2e:${suiteName}:dev does not accept spec paths. Use --grep or --grep-invert to select tests.`,
      );
    }
  }
}

async function assertPortAvailable() {
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

if (process.env[suite.externalBaseUrlEnv]) {
  throw new Error(
    `test:e2e:${suiteName}:dev manages only a local target. Use the aggregate or surface E2E commands for ${suite.externalBaseUrlEnv}.`,
  );
}

assertPlaywrightArgs(playwrightArgs);
await assertPortAvailable();
run('npm', ['run', 'db:reset']);
run('npx', ['playwright', 'test', '--config', suite.configFile, ...playwrightArgs]);
