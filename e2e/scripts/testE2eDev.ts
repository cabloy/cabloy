import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';

import { E2E_PORT, E2E_ROOT_DIR, getE2eSuite } from './e2e.ts';
const suiteName = process.argv[2];
const suite = getE2eSuite(suiteName);

function run(command: string, args: string[], cwd = E2E_ROOT_DIR) {
  // eslint-disable-next-line
  console.log(`\n===> ${[command, ...args].join(' ')}`);
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
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
    `test:e2e:${suiteName}:dev manages only a local target. Use the aggregate or focused E2E commands for ${suite.externalBaseUrlEnv}.`,
  );
}

await assertPortAvailable();
run('npm', ['run', 'db:reset']);
run('npx', ['playwright', 'test', '--config', suite.configFile]);
