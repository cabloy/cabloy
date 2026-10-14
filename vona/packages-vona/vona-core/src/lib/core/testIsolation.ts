import fse from 'fs-extra';
import { createHash } from 'node:crypto';
import { lstatSync } from 'node:fs';
import path from 'node:path';

export const TEST_RUN_ID_ENV = 'VONA_TEST_RUN_ID';
export const TEST_RUN_OWNER_FILE = '.vona-test-owner';

const DATABASE_NAME_MAX_BYTES = 63;
const APP_NAME_MAX_BYTES = 13;
const HASH_LENGTH = 10;
const TIMESTAMP_LENGTH = 15;

export function getDatabaseTestPrefix(appName: string, scope: string): string {
  const readablePrefix =
    scope === 'share'
      ? `vona-test-${appName}-s-`
      : `vona-test-${appName}-i-${scope.slice('isolate-'.length)}-`;
  if (Buffer.byteLength(readablePrefix, 'utf8') + TIMESTAMP_LENGTH <= DATABASE_NAME_MAX_BYTES) {
    return readablePrefix;
  }
  let appHead = '';
  for (const char of appName) {
    if (Buffer.byteLength(`${appHead}${char}`, 'utf8') > APP_NAME_MAX_BYTES) break;
    appHead += char;
  }
  const scopeKind = scope === 'share' ? 's' : 'i';
  const namespaceHash = createHash('sha256')
    .update(`${appName}\0${scope}`)
    .digest('base64url')
    .slice(0, HASH_LENGTH);
  return `vona-test-${appHead}-${scopeKind}-${namespaceHash}-`;
}

export function assertDisposableDatabaseName(databaseName: string, databasePrefix: string) {
  if (
    typeof databaseName !== 'string' ||
    !databaseName.startsWith(databasePrefix) ||
    !/^\d{8}-\d{6}$/.test(databaseName.slice(databasePrefix.length)) ||
    Buffer.byteLength(databaseName, 'utf8') > DATABASE_NAME_MAX_BYTES
  ) {
    throw new Error(`Database is outside the disposable namespace: ${databaseName}`);
  }
}

export function resolveTestRunId(
  mode: string,
  runId: string | undefined = process.env[TEST_RUN_ID_ENV],
) {
  if (runId === undefined) return undefined;
  const match = /^(\d{14})-[a-f0-9]{8}$/.exec(runId);
  const timestamp = match?.[1];
  const date = timestamp
    ? new Date(
        `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}T${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}:${timestamp.slice(12, 14)}Z`,
      )
    : undefined;
  if (
    mode !== 'test' ||
    !timestamp ||
    !date ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 19).replace(/[-:T]/g, '') !== timestamp
  ) {
    throw new Error(
      `${TEST_RUN_ID_ENV} requires test mode and a UTC timestamp plus eight hex digits`,
    );
  }
  return runId;
}

export function getTestAppName(runId: string) {
  resolveTestRunId('test', runId);
  return `cabtest${runId}`;
}

export function assertTestAppIdentity(mode: string, runId: string | undefined, appName: string) {
  const id = resolveTestRunId(mode, runId);
  if (id && appName !== getTestAppName(id)) {
    throw new Error('Isolated test APP_NAME does not match its run ID');
  }
  return id;
}

export function getTestRunIdFromEnv(env: NodeJS.ProcessEnv) {
  return resolveTestRunId(env.META_MODE, env[TEST_RUN_ID_ENV]);
}

export function assertTestRunOwner(root: string, runId: string) {
  resolveTestRunId('test', runId);
  let current = path.resolve(root);
  while (true) {
    try {
      if (lstatSync(current).isSymbolicLink()) {
        throw new Error(`Isolated test path traverses a symlink: ${current}`);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  const marker = path.join(root, TEST_RUN_OWNER_FILE);
  if (!fse.lstatSync(marker).isFile() || fse.readFileSync(marker, 'utf8') !== `${runId}\n`) {
    throw new Error(`Isolated test directory has no matching owner: ${root}`);
  }
}

export function resolveVonaLocalPaths(
  projectPath: string,
  mode: string,
  runId: string | undefined = process.env[TEST_RUN_ID_ENV],
) {
  const id = resolveTestRunId(mode, runId);
  const generatedDir = id ? `.vona-test-${id}` : '.vona';
  const dataDir = id ? `.app-test-${id}` : '.app';
  return {
    runId: id,
    generatedDir,
    dataDir,
    generatedRoot: path.join(projectPath, generatedDir),
    dataRoot: path.join(projectPath, dataDir),
    publicRoot: path.join(projectPath, dataDir, 'public'),
    runtimeRoot: path.join(projectPath, dataDir, 'runtime'),
    logsRoot: path.join(projectPath, dataDir, 'logs'),
    sqliteRoot: path.join(projectPath, dataDir, 'sqlite3'),
  };
}
