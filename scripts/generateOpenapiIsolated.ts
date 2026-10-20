import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ROOT_DIR,
  runIsolatedProcess,
  withIsolatedVona,
  withIsolatedRun,
} from './runIsolatedTest.ts';
import { strictGenerationFailure } from './strictGenerationDiagnostics.ts';

const OPENAPI_VERSION = 'V31';
const SOURCE_TIMEOUT_MS = 30_000;

export function getOpenapiSource(port: number) {
  return `http://127.0.0.1:${port}/swagger/json?version=${OPENAPI_VERSION}`;
}

export function parseIsolatedOpenapiArgs(args: string[]) {
  const flag = '--skip-expired-claim-reaping';
  if (args.some(arg => arg.startsWith(`${flag}=`))) {
    throw new Error(`${flag} is a standalone flag`);
  }
  return {
    generatorArgs: args.filter(arg => arg !== flag),
    skipExpiredClaimReaping: args.includes(flag),
  };
}

export function getOpenapiGeneratorCommand(args: string[]) {
  if (args.some(arg => /^--projectPath(?:=|$)/.test(arg))) {
    throw new Error(
      'Isolated OpenAPI generation uses the current Zova project; projectPath overrides are unsupported',
    );
  }
  return {
    command: process.execPath,
    args: [
      './zova/packages-cli/cli/src/bin/zova.ts',
      '--projectPath=zova',
      ':openapi:generate',
      ...args,
    ],
    cwd: ROOT_DIR,
  };
}

export async function validateOpenapiSource(source: string) {
  let response: Response;
  try {
    response = await fetch(source, {
      signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
      redirect: 'error',
    });
  } catch (error) {
    throw new Error('Isolated OpenAPI source request failed', { cause: error });
  }
  if (!response.ok) {
    throw new Error(`Isolated OpenAPI source returned HTTP ${response.status}`);
  }
  let document: unknown;
  try {
    document = await response.json();
  } catch (error) {
    throw new Error('Isolated OpenAPI source returned invalid JSON', { cause: error });
  }
  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('Isolated OpenAPI source returned an invalid document');
  }
  const record = document as Record<string, unknown>;
  if (
    (typeof record.openapi !== 'string' && typeof record.swagger !== 'string') ||
    !record.paths ||
    typeof record.paths !== 'object' ||
    Array.isArray(record.paths)
  ) {
    throw new Error('Isolated OpenAPI source returned an invalid document');
  }
}

export async function generateOpenapiIsolated(args: string[]) {
  const strict = args.some(arg => /^--skip-expired-claim-reaping(?:=|$)/.test(arg));
  try {
    return await generateOpenapiIsolatedInternal(args);
  } catch (error) {
    throw strict ? strictGenerationFailure('run', error) : error;
  }
}

async function generateOpenapiIsolatedInternal(args: string[]) {
  const { generatorArgs, skipExpiredClaimReaping } = parseIsolatedOpenapiArgs(args);
  const command = getOpenapiGeneratorCommand(generatorArgs);
  if (process.env.E2E_BASE_URL !== undefined) {
    throw new Error(
      'E2E_BASE_URL is unsupported; isolated OpenAPI generation manages a local test-mode target.',
    );
  }
  return await withIsolatedRun(
    'contract',
    async ({ env, port }) => {
      const source = getOpenapiSource(port);
      await withIsolatedVona(port, env, async () => {
        await validateOpenapiSource(source);
        await runIsolatedProcess(command.command, command.args, command.cwd, {
          ...env,
          OPENAPI_SOURCE_URL: source,
          VONA_TEST_READY_KEY: undefined,
        });
      });
    },
    ROOT_DIR,
    { skipExpiredClaimReaping },
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  try {
    await generateOpenapiIsolated(args);
  } catch (error) {
    if (!args.some(arg => /^--skip-expired-claim-reaping(?:=|$)/.test(arg))) throw error;
    console.error(strictGenerationFailure('run', error).message);
    process.exitCode = 1;
  }
}
