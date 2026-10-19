import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

import type { ParsedE2eArgs } from './runE2eArgs.ts';

import { buildSpecFilter, combineGreps, parseE2eArgs } from './runE2eArgs.ts';

export function runPlaywright(options: {
  rootDir: string;
  configFile: string;
  specsDir: string;
  parsed: ParsedE2eArgs;
}): void {
  const { rootDir, configFile, specsDir, parsed } = options;
  const require = createRequire(resolve(rootDir, 'package.json'));
  const cli = require.resolve('@playwright/test/cli');
  const specFilters = parsed.specNames.map(name =>
    buildSpecFilter(resolve(specsDir, `${name}.spec.ts`)),
  );
  const args = [
    cli,
    'test',
    '--config',
    configFile,
    ...specFilters,
    ...combineGreps(parsed.playwrightArgs, parsed.tags),
  ];
  // eslint-disable-next-line no-console
  console.log(`\n===> ${[process.execPath, ...args].join(' ')}`);
  execFileSync(process.execPath, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });
}

async function assertPortAvailable(port: number): Promise<void> {
  const server = createServer();
  await new Promise<void>((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.close(error => {
        if (error) reject(error);
        else resolvePromise();
      });
    });
  });
}

async function main(): Promise<void> {
  const { E2E_CONFIG_FILE, E2E_LOCAL_BASE_URL, E2E_PORT, E2E_ROOT_DIR, E2E_SPECS_DIR } =
    await import('./e2e.ts');
  const parsed = parseE2eArgs(process.argv.slice(2), E2E_SPECS_DIR);
  if (
    process.env.VONA_TEST_RUN_ID &&
    process.env.APP_NAME !== `cabtest${process.env.VONA_TEST_RUN_ID}`
  ) {
    throw new Error('Managed E2E test identity does not match its run ID');
  }
  if (process.env.VONA_TEST_RUN_ID) {
    const { assertManagedTestImports } = await import('./managedTestImports.ts');
    await assertManagedTestImports();
  } else {
    await assertPortAvailable(E2E_PORT);
  }

  runPlaywright({
    rootDir: E2E_ROOT_DIR,
    configFile: E2E_CONFIG_FILE,
    specsDir: E2E_SPECS_DIR,
    parsed,
  });

  // eslint-disable-next-line no-console
  console.log(`E2E target: ${E2E_LOCAL_BASE_URL}`);
}

if (import.meta.main) await main();
