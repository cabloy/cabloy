import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  ROOT_DIR,
  getUnitTestCommands,
  runIsolatedProcess,
  withIsolatedRun,
} from './runIsolatedTest.ts';

const VONA_DIR = resolve(ROOT_DIR, 'vona');
const ENTRY_FILE = fileURLToPath(import.meta.url);
const RUNTIME_FILE = resolve(VONA_DIR, 'src/suite/cabloy-mcp/modules/mcp-test/runtime/local.ts');

function parseSeconds(args: string[]): number {
  if (args.length === 0) return 600;
  const value =
    args.length === 2 && args[0] === '--seconds'
      ? args[1]
      : args.length === 1 && args[0].startsWith('--seconds=')
        ? args[0].slice('--seconds='.length)
        : undefined;
  if (!value || !/^[1-9]\d{0,2}$/.test(value) || Number(value) > 600) {
    throw new Error('Usage: npm run mcp:test:local -- [--seconds 1..600]');
  }
  return Number(value);
}

async function prepare() {
  const { assertTestAppIdentity, assertTestRunOwner, resolveVonaLocalPaths } =
    await import('../vona/packages-vona/vona-core/src/lib/core/testIsolation.ts');
  const { hasTestClaimTransport } =
    await import('../vona/packages-vona/vona-core/src/lib/core/testClaim.ts');
  const runId = assertTestAppIdentity(
    process.env.META_MODE ?? '',
    process.env.VONA_TEST_RUN_ID,
    process.env.APP_NAME ?? '',
  );
  if (
    !runId ||
    !hasTestClaimTransport() ||
    process.env.SERVER_LISTEN_DISABLE !== 'true' ||
    resolve(process.cwd()) !== VONA_DIR
  ) {
    throw new Error('MCP test preparation requires its managed local launcher');
  }
  const paths = resolveVonaLocalPaths(VONA_DIR, 'test', runId);
  assertTestRunOwner(paths.generatedRoot, runId);
  assertTestRunOwner(paths.dataRoot, runId);
  const { generateVonaMeta } =
    await import('../vona/packages-cli/cli-set-api/src/lib/bean/toolsBin/generateVonaMeta.ts');
  await generateVonaMeta(
    { mode: 'test', flavor: 'normal' },
    { appDir: VONA_DIR, runtimeDir: paths.generatedDir, workers: 1 },
  );
}

async function run(args: string[]) {
  const seconds = parseSeconds(args);
  await withIsolatedRun('unit', async ({ env, generatedRoot, vonaDir }) => {
    const disabledSuites = new Set((env.PROJECT_DISABLED_SUITES ?? '').split(',').filter(Boolean));
    disabledSuites.add('a-commerce');
    const childEnv = {
      ...env,
      SERVER_LISTEN_DISABLE: 'true',
      PROJECT_DISABLED_SUITES: [...disabledSuites].join(','),
    };
    const prerun = getUnitTestCommands([])[0];
    await runIsolatedProcess(prerun.command, prerun.args, prerun.cwd, childEnv);
    await runIsolatedProcess(
      process.execPath,
      [
        '--import',
        pathToFileURL(resolve(vonaDir, 'packages-cli/cli-set-api/templates/app/register.js')).href,
        ENTRY_FILE,
        '--prepare',
      ],
      vonaDir,
      childEnv,
    );
    await runIsolatedProcess(
      process.execPath,
      [
        '--import',
        pathToFileURL(resolve(generatedRoot, 'register.js')).href,
        RUNTIME_FILE,
        String(seconds),
      ],
      vonaDir,
      childEnv,
    );
  });
}

if (process.argv[1] && resolve(process.argv[1]) === ENTRY_FILE) {
  const args = process.argv.slice(2);
  try {
    if (args.length === 1 && args[0] === '--prepare') await prepare();
    else await run(args);
  } catch {
    console.error(
      'MCP test local launch failed. Use only --seconds 1..600; interrupted or failed managed runs may retain resources.',
    );
    process.exitCode = 1;
  }
}
