import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 7102;

function run(command: string, args: string[], cwd = ROOT_DIR) {
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
    server.listen(PORT, '127.0.0.1', () => {
      server.close(error => {
        if (error) reject(error);
        else resolvePromise();
      });
    });
  });
}

if (process.env.BASIC_E2E_BASE_URL) {
  throw new Error(
    'test:e2e:basic:dev manages only a local target. Use the focused E2E commands for BASIC_E2E_BASE_URL.',
  );
}

await assertPortAvailable();
run('npm', ['run', 'db:reset']);
run('npx', ['playwright', 'test', '--config', 'playwright.basic.config.ts']);
