import { randomBytes, timingSafeEqual } from 'node:crypto';
import { constants, lstatSync } from 'node:fs';
import { mkdir, open, rename, unlink } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

import {
  assertDisposableDatabaseName,
  getDatabaseTestPrefix,
  getTestAppName,
  resolveTestRunId,
  resolveVonaLocalPaths,
} from './testIsolation.ts';

export const TEST_CLAIM_URL_ENV = 'VONA_TEST_CLAIM_URL';
export const TEST_CLAIM_TOKEN_ENV = 'VONA_TEST_CLAIM_TOKEN';
export const TEST_CLAIM_DIRECTORY = '.vona-test-claim';
export type TestClaimKind = 'unit' | 'cov' | 'e2e';
export type TestClaimEnv = Record<string, string | undefined>;
export interface TestClaimOwner {
  pid: number;
  startTime: string;
  host: string;
}
export interface TestClaimDatabaseEndpoint {
  dialect: 'pg' | 'mysql' | 'mysql2' | 'better-sqlite3';
  transport: 'tcp' | 'socket' | 'file';
  host?: string;
  port?: number;
  socketPath?: string;
  tls: boolean;
  adminDatabase?: string;
}
export interface TestClaimRedisEndpoint {
  transport: 'tcp' | 'socket';
  host?: string;
  port?: number;
  socketPath?: string;
  tls: boolean;
  db: number;
}
export interface TestClaimDatabasePlan {
  clientName: string;
  scope: string;
  prefix: string;
  endpoint: TestClaimDatabaseEndpoint;
}
export interface TestClaimDatabase extends TestClaimDatabasePlan {
  creations: { name: string; stage: 'intent' | 'created' | 'released' }[];
}
export interface TestClaimRedis {
  clientName: string;
  kind: 'client' | 'queue' | 'redlock';
  prefix: string;
  endpoint: TestClaimRedisEndpoint;
  released: boolean;
}
export interface TestClaimProcess {
  id: string;
  role: string;
  stage: 'pending' | 'registered' | 'drained';
  pid?: number;
  pgid?: number;
  startTime?: string;
  host?: string;
  profilePath?: string;
}
export type TestClaimLocalKind = 'generated' | 'data';
export type TestClaimLocalStage = 'intent' | 'created' | 'owned' | 'released';
export interface TestClaimManifest {
  version: 1;
  runId: string;
  createdAt: string;
  projectPath: string;
  kind: TestClaimKind;
  owner: TestClaimOwner;
  status: 'allocated' | 'running' | 'failed' | 'cleaning';
  locals: { kind: TestClaimLocalKind; path: string; stage: TestClaimLocalStage }[];
  databases: TestClaimDatabase[];
  redis: TestClaimRedis[];
  processes: TestClaimProcess[];
  cleanup: { processes: boolean; databases: boolean; redis: boolean; locals: boolean };
}
export type TestClaimEvent =
  | { type: 'local'; kind: TestClaimLocalKind; stage: TestClaimLocalStage }
  | { type: 'status'; status: TestClaimManifest['status'] }
  | { type: 'process'; process: TestClaimProcess }
  | { type: 'inventory'; databases: TestClaimDatabasePlan[]; redis: TestClaimRedis[] }
  | {
      type: 'database';
      database: TestClaimDatabasePlan;
      name: string;
      stage: 'intent' | 'created' | 'released';
    }
  | { type: 'cleanup'; resource: keyof TestClaimManifest['cleanup']; complete: boolean };

export function getTestClaimPaths(projectPath: string, runId: string) {
  resolveTestRunId('test', runId);
  const project = path.resolve(projectPath);
  const local = resolveVonaLocalPaths(project, 'test', runId);
  const claimDirectory = path.join(project, TEST_CLAIM_DIRECTORY);
  return {
    ...local,
    claimDirectory,
    claimPath: path.join(claimDirectory, `${runId}.json`),
  };
}

export function getTestClaimCreatedAt(runId: string) {
  resolveTestRunId('test', runId);
  const s = runId.slice(0, 14);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}.000Z`;
}

export function assertTestClaimSafePath(file: string, allowMissing = true) {
  let current = path.resolve(file);
  while (true) {
    try {
      const stat = lstatSync(current);
      if (stat.isSymbolicLink() || (current !== path.resolve(file) && !stat.isDirectory())) {
        throw new Error('Unsafe test claim path');
      }
    } catch (error) {
      if (!allowMissing || (error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

function record(value: unknown): asserts value is Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid test claim object');
}
function keys(value: unknown, allowed: string[]) {
  record(value);
  if (Object.keys(value).some(key => !allowed.includes(key)))
    throw new Error('Unknown test claim field');
}
function text(value: unknown): asserts value is string {
  if (
    typeof value !== 'string' ||
    !value ||
    value.length > 4096 ||
    [...value].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)
  ) {
    throw new Error('Invalid test claim text');
  }
}
function label(value: unknown): asserts value is string {
  text(value);
  if (!/^[\w.-]+$/.test(value)) throw new Error('Invalid test claim label');
}
function integer(value: unknown, min: number, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || (value as number) < min || (value as number) > max)
    throw new Error('Invalid test claim integer');
}
function oneOf(value: unknown, values: string[]) {
  if (!values.includes(value as string)) throw new Error('Invalid test claim state');
}
function bool(value: unknown) {
  if (typeof value !== 'boolean') throw new Error('Invalid test claim boolean');
}
function array(value: unknown): asserts value is any[] {
  if (!Array.isArray(value) || value.length > 10000) throw new Error('Invalid test claim array');
}
function unique(values: string[]) {
  if (new Set(values).size !== values.length) throw new Error('Duplicate test claim resource');
}
function validateEndpoint(value: unknown, redis: boolean) {
  keys(
    value,
    redis
      ? ['transport', 'host', 'port', 'socketPath', 'tls', 'db']
      : ['dialect', 'transport', 'host', 'port', 'socketPath', 'tls', 'adminDatabase'],
  );
  const endpoint = value as TestClaimDatabaseEndpoint & { db?: number };
  bool(endpoint.tls);
  oneOf(endpoint.transport, redis ? ['tcp', 'socket'] : ['tcp', 'socket', 'file']);
  if (redis) integer(endpoint.db, 0);
  else oneOf(endpoint.dialect, ['pg', 'mysql', 'mysql2', 'better-sqlite3']);
  if (endpoint.transport === 'tcp') {
    text(endpoint.host);
    if (/[\s/@?#\\]/.test(endpoint.host!)) throw new Error('Invalid test claim host');
    integer(endpoint.port, 1, 65535);
    if (endpoint.socketPath !== undefined) throw new Error('Conflicting test claim endpoint');
  } else {
    text(endpoint.socketPath);
    if (
      !path.isAbsolute(endpoint.socketPath!) ||
      path.resolve(endpoint.socketPath!) !== endpoint.socketPath ||
      endpoint.host !== undefined
    ) {
      throw new Error('Invalid test claim socket');
    }
    if (!redis && endpoint.dialect === 'pg' && endpoint.transport === 'socket')
      integer(endpoint.port, 1, 65535);
    else if (endpoint.port !== undefined) throw new Error('Invalid test claim socket port');
  }
  if (!redis) {
    if (endpoint.dialect === 'better-sqlite3') {
      if (endpoint.transport !== 'file' || endpoint.tls || endpoint.adminDatabase !== undefined)
        throw new Error('Invalid SQLite claim endpoint');
    } else if (
      endpoint.transport === 'file' ||
      endpoint.adminDatabase !== (endpoint.dialect === 'pg' ? 'postgres' : 'mysql')
    ) {
      throw new Error('Invalid database administration endpoint');
    }
  }
}
export function validateTestClaim(value: unknown, claimPath?: string): TestClaimManifest {
  keys(value, [
    'version',
    'runId',
    'createdAt',
    'projectPath',
    'kind',
    'owner',
    'status',
    'locals',
    'databases',
    'redis',
    'processes',
    'cleanup',
  ]);
  const m = value as TestClaimManifest;
  if (m.version !== 1) throw new Error('Unsupported test claim version');
  resolveTestRunId('test', m.runId);
  if (m.createdAt !== getTestClaimCreatedAt(m.runId))
    throw new Error('Invalid test claim creation time');
  text(m.projectPath);
  if (!path.isAbsolute(m.projectPath) || path.resolve(m.projectPath) !== m.projectPath)
    throw new Error('Invalid test claim checkout');
  const p = getTestClaimPaths(m.projectPath, m.runId);
  if (claimPath && path.resolve(claimPath) !== p.claimPath)
    throw new Error('Test claim filename or checkout mismatch');
  oneOf(m.kind, ['unit', 'cov', 'e2e']);
  keys(m.owner, ['pid', 'startTime', 'host']);
  integer(m.owner.pid, 1);
  text(m.owner.startTime);
  text(m.owner.host);
  oneOf(m.status, ['allocated', 'running', 'failed', 'cleaning']);
  array(m.locals);
  unique(m.locals.map(item => item.kind));
  for (const item of m.locals) {
    keys(item, ['kind', 'path', 'stage']);
    oneOf(item.kind, ['generated', 'data']);
    oneOf(item.stage, ['intent', 'created', 'owned', 'released']);
    const expected = item.kind === 'generated' ? p.generatedRoot : p.dataRoot;
    if (item.path !== expected) throw new Error('Invalid test claim local root');
  }
  if (
    m.locals.length !== 2 ||
    !m.locals.some(item => item.kind === 'data') ||
    !m.locals.some(item => item.kind === 'generated')
  ) {
    throw new Error('Missing test claim local roots');
  }
  array(m.databases);
  unique(m.databases.map(item => `${item.clientName}\0${item.scope}`));
  for (const db of m.databases) {
    keys(db, ['clientName', 'scope', 'prefix', 'endpoint', 'creations']);
    label(db.clientName);
    text(db.scope);
    if (db.scope !== 'share' && !/^isolate-[\w-]+$/.test(db.scope))
      throw new Error('Invalid test claim database scope');
    if (db.prefix !== getDatabaseTestPrefix(getTestAppName(m.runId), db.scope))
      throw new Error('Invalid test claim database prefix');
    validateEndpoint(db.endpoint, false);
    if (db.endpoint.dialect === 'better-sqlite3' && db.endpoint.socketPath !== p.sqliteRoot)
      throw new Error('Invalid test claim SQLite root');
    array(db.creations);
    unique(db.creations.map(item => item.name));
    for (const creation of db.creations) {
      keys(creation, ['name', 'stage']);
      oneOf(creation.stage, ['intent', 'created', 'released']);
      text(creation.name);
      let name = creation.name;
      if (db.endpoint.dialect === 'better-sqlite3') {
        if (name !== path.join(p.sqliteRoot, path.basename(name)) || path.extname(name) !== '.db')
          throw new Error('Invalid test claim SQLite target');
        name = path.basename(name, '.db');
      }
      assertDisposableDatabaseName(name, db.prefix);
    }
  }
  array(m.redis);
  unique(m.redis.map(item => item.clientName));
  for (const item of m.redis) {
    keys(item, ['clientName', 'kind', 'prefix', 'endpoint', 'released']);
    label(item.clientName);
    oneOf(item.kind, ['client', 'queue', 'redlock']);
    const expected = getTestClaimRedisPrefix(m.runId, item.clientName);
    if (!expected || item.kind !== expected.kind || item.prefix !== expected.prefix)
      throw new Error('Invalid test claim Redis prefix');
    validateEndpoint(item.endpoint, true);
    bool(item.released);
  }
  array(m.processes);
  unique(m.processes.map(item => item.id));
  for (const proc of m.processes) {
    keys(proc, ['id', 'role', 'stage', 'pid', 'pgid', 'startTime', 'host', 'profilePath']);
    label(proc.id);
    oneOf(proc.role, ['guardian', 'browser', 'cleanup']);
    if (proc.host !== undefined) text(proc.host);
    oneOf(proc.stage, ['pending', 'registered', 'drained']);
    const hasIdentity =
      proc.pid !== undefined || proc.pgid !== undefined || proc.startTime !== undefined;
    if (hasIdentity || proc.stage !== 'pending') {
      integer(proc.pid, 1);
      integer(proc.pgid, 1);
      text(proc.startTime);
    }
    if (proc.profilePath !== undefined) {
      text(proc.profilePath);
      if (
        path.resolve(proc.profilePath) !== proc.profilePath ||
        !proc.profilePath.startsWith(`${p.dataRoot}${path.sep}`)
      ) {
        throw new Error('Invalid test claim process profile');
      }
    }
  }
  keys(m.cleanup, ['processes', 'databases', 'redis', 'locals']);
  for (const key of ['processes', 'databases', 'redis', 'locals']) bool(m.cleanup[key]);
  return m;
}

function assertPrivateFile(file: string) {
  assertTestClaimSafePath(file, false);
  const stat = lstatSync(file);
  if (
    !stat.isFile() ||
    stat.nlink !== 1 ||
    (stat.mode & 0o077) !== 0 ||
    (process.getuid && stat.uid !== process.getuid())
  ) {
    throw new Error('Unsafe test claim file');
  }
}
export async function loadTestClaim(claimPath: string) {
  assertPrivateFile(claimPath);
  const handle = await open(claimPath, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > 4 * 1024 * 1024) throw new Error('Invalid test claim file');
    return validateTestClaim(parseTestClaimJson(await handle.readFile('utf8')), claimPath);
  } finally {
    await handle.close();
  }
}
function parseTestClaimJson(source: string) {
  // Claim identities stay literal even when @cabloy/json5 revives ISO strings.
  return JSON.parse(source, function (this: Record<string, unknown>, key: string) {
    return this[key];
  });
}
async function syncDirectory(directory: string) {
  const handle = await open(directory, constants.O_RDONLY);
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}
export async function createTestClaim(
  projectPath: string,
  runId: string,
  kind: TestClaimKind,
  owner: TestClaimOwner,
) {
  const p = getTestClaimPaths(projectPath, runId);
  assertTestClaimSafePath(p.claimDirectory);
  await mkdir(p.claimDirectory, { mode: 0o700 }).catch(error => {
    if (error.code !== 'EEXIST') throw error;
  });
  // The directory is shared across runs; an existing directory is valid, never an existing claim.
  return createClaimFile(p, runId, kind, owner);
}
async function createClaimFile(
  p: ReturnType<typeof getTestClaimPaths>,
  runId: string,
  kind: TestClaimKind,
  owner: TestClaimOwner,
) {
  assertTestClaimSafePath(p.claimDirectory, false);
  const directoryStat = lstatSync(p.claimDirectory);
  if (
    !directoryStat.isDirectory() ||
    (directoryStat.mode & 0o077) !== 0 ||
    (process.getuid && directoryStat.uid !== process.getuid())
  ) {
    throw new Error('Unsafe shared test claim directory');
  }
  const manifest: TestClaimManifest = {
    version: 1,
    runId,
    createdAt: getTestClaimCreatedAt(runId),
    projectPath: path.dirname(p.claimDirectory),
    kind,
    owner,
    status: 'allocated',
    locals: [
      { kind: 'generated', path: p.generatedRoot, stage: 'intent' },
      { kind: 'data', path: p.dataRoot, stage: 'intent' },
    ],
    databases: [],
    redis: [],
    processes: [],
    cleanup: { processes: false, databases: false, redis: false, locals: false },
  };
  validateTestClaim(manifest, p.claimPath);
  const handle = await open(
    p.claimPath,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`);
    await handle.sync();
  } finally {
    await handle.close();
  }
  await syncDirectory(p.claimDirectory);
  return { claimPath: p.claimPath, manifest };
}

// Only the live broker or a cleanup editor holding the exclusive cleanup lock may call this.
export async function writeTestClaim(claimPath: string, manifest: TestClaimManifest) {
  validateTestClaim(manifest, claimPath);
  const previous = await loadTestClaim(claimPath);
  for (const key of ['version', 'runId', 'createdAt', 'projectPath', 'kind', 'owner'] as const) {
    if (!isDeepStrictEqual(previous[key], manifest[key]))
      throw new Error('Test claim identity is immutable');
  }
  const temp = `${claimPath}.${randomBytes(12).toString('hex')}.tmp`;
  const handle = await open(
    temp,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  );
  try {
    try {
      await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`);
      await handle.sync();
    } finally {
      await handle.close();
    }
    assertPrivateFile(claimPath);
    await rename(temp, claimPath);
    await syncDirectory(path.dirname(claimPath));
  } finally {
    await unlink(temp).catch(error => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}

function applyEvent(m: TestClaimManifest, event: TestClaimEvent) {
  record(event);
  switch (event.type) {
    case 'local': {
      keys(event, ['type', 'kind', 'stage']);
      const local = m.locals.find(item => item.kind === event.kind);
      if (!local) throw new Error('Unplanned test claim local root');
      const stages = ['intent', 'created', 'owned', 'released'];
      if (stages.indexOf(event.stage) < stages.indexOf(local.stage))
        throw new Error('Test claim local stage regression');
      local.stage = event.stage;
      break;
    }
    case 'status':
      keys(event, ['type', 'status']);
      m.status = event.status;
      break;
    case 'process': {
      keys(event, ['type', 'process']);
      const old = m.processes.find(item => item.id === event.process.id);
      if (!old) {
        if (event.process.stage !== 'pending')
          throw new Error('Process needs a write-ahead intent');
        m.processes.push(event.process);
      } else {
        if (old.role !== event.process.role) throw new Error('Test claim process identity changed');
        if (
          event.process.profilePath !== undefined &&
          old.profilePath !== event.process.profilePath
        ) {
          if (
            old.stage !== 'pending' ||
            event.process.stage !== 'registered' ||
            !old.profilePath ||
            !event.process.profilePath.startsWith(`${old.profilePath}${path.sep}`)
          ) {
            throw new Error('Test claim process profile changed');
          }
        }
        if (
          (old.stage === 'drained' && event.process.stage !== 'drained') ||
          (old.stage === 'registered' && event.process.stage === 'pending')
        ) {
          throw new Error('Test claim process stage regression');
        }
        if (old.stage === 'pending' && event.process.stage === 'drained')
          throw new Error('Pending process cannot establish drainage');
        for (const key of ['pid', 'pgid', 'startTime', 'host'] as const) {
          if (
            old[key] !== undefined &&
            event.process[key] !== undefined &&
            old[key] !== event.process[key]
          ) {
            throw new Error('Test claim process identity changed');
          }
        }
        Object.assign(old, event.process);
      }
      break;
    }
    case 'inventory': {
      keys(event, ['type', 'databases', 'redis']);
      for (const plan of event.databases) {
        keys(plan, ['clientName', 'scope', 'prefix', 'endpoint']);
        const old = m.databases.find(
          item => item.clientName === plan.clientName && item.scope === plan.scope,
        );
        if (old) {
          const { creations: _, ...oldPlan } = old;
          if (!isDeepStrictEqual(oldPlan, plan)) throw new Error('Database inventory drift');
        } else {
          m.databases.push({ ...plan, creations: [] });
        }
      }
      for (const resource of event.redis) {
        const old = m.redis.find(item => item.clientName === resource.clientName);
        if (old && !isDeepStrictEqual(old, resource)) throw new Error('Redis inventory drift');
        if (!old) m.redis.push(resource);
      }
      break;
    }
    case 'database': {
      keys(event, ['type', 'database', 'name', 'stage']);
      keys(event.database, ['clientName', 'scope', 'prefix', 'endpoint']);
      const db = m.databases.find(
        item =>
          item.clientName === event.database.clientName && item.scope === event.database.scope,
      );
      if (!db) throw new Error('Unplanned database creation');
      const { creations: _, ...plan } = db;
      if (!isDeepStrictEqual(plan, event.database))
        throw new Error('Database creation endpoint drift');
      const old = db.creations.find(item => item.name === event.name);
      if (!old) {
        if (event.stage !== 'intent') throw new Error('Database needs a write-ahead intent');
        db.creations.push({ name: event.name, stage: event.stage });
      } else {
        if (
          ['intent', 'created', 'released'].indexOf(event.stage) <
          ['intent', 'created', 'released'].indexOf(old.stage)
        ) {
          throw new Error('Database creation stage regression');
        }
        old.stage = event.stage;
      }
      break;
    }
    case 'cleanup':
      keys(event, ['type', 'resource', 'complete']);
      if (!(event.resource in m.cleanup)) throw new Error('Unknown cleanup resource');
      m.cleanup[event.resource] = event.complete;
      break;
    default:
      throw new Error('Unknown test claim event');
  }
  validateTestClaim(m);
}

export async function startTestClaimBroker(claimPath: string) {
  await loadTestClaim(claimPath);
  const token = randomBytes(32).toString('hex');
  let queue: Promise<void> = Promise.resolve();
  let closing = false;
  const update = (event: TestClaimEvent) => {
    if (closing) return Promise.reject(new Error('Test claim broker is closed'));
    const result = queue.then(async () => {
      const manifest = await loadTestClaim(claimPath);
      applyEvent(manifest, event);
      await writeTestClaim(claimPath, manifest);
    });
    queue = result.catch(() => {});
    return result;
  };
  const server = createServer(async (req, res) => {
    const auth = req.headers.authorization;
    const expected = `Bearer ${token}`;
    if (
      req.method !== 'POST' ||
      req.url !== '/event' ||
      typeof auth !== 'string' ||
      Buffer.byteLength(auth) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
    ) {
      res.writeHead(403).end();
      req.resume();
      return;
    }
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString('utf8');
        if (Buffer.byteLength(body) > 1024 * 1024) throw new Error('Test claim event too large');
      }
      await update(parseTestClaimJson(body));
      res.writeHead(204).end();
    } catch {
      res.writeHead(409).end('Test claim registration rejected');
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Cannot bind test claim broker');
  return {
    env: {
      [TEST_CLAIM_URL_ENV]: `http://127.0.0.1:${address.port}/event`,
      [TEST_CLAIM_TOKEN_ENV]: token,
    },
    update,
    async close() {
      closing = true;
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve())),
      );
      await queue;
    },
  };
}
export function hasTestClaimTransport(env: TestClaimEnv = process.env) {
  const url = env[TEST_CLAIM_URL_ENV];
  const token = env[TEST_CLAIM_TOKEN_ENV];
  if (url === undefined && token === undefined) return false;
  if (!url || !token) throw new Error('Incomplete managed test claim transport');
  if (!resolveTestRunId(env.META_MODE!, env.VONA_TEST_RUN_ID))
    throw new Error('Managed test claim transport requires test identity');
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid managed test claim transport');
  }
  if (
    parsed.protocol !== 'http:' ||
    parsed.hostname !== '127.0.0.1' ||
    !parsed.port ||
    parsed.pathname !== '/event' ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    !/^[a-f0-9]{64}$/.test(token)
  ) {
    throw new Error('Invalid managed test claim transport');
  }
  return true;
}
export async function sendTestClaimEvent(env: TestClaimEnv, event: TestClaimEvent) {
  if (!hasTestClaimTransport(env)) return;
  try {
    const response = await fetch(env[TEST_CLAIM_URL_ENV]!, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${env[TEST_CLAIM_TOKEN_ENV]}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(10000),
      redirect: 'error',
    });
    if (response.status !== 204) throw new Error('Registration rejected');
  } catch {
    throw new Error('Managed test allocation registration failed');
  }
}

export function getTestClaimRedisPrefix(
  runId: string,
  clientName: string,
): { kind: TestClaimRedis['kind']; prefix: string } | undefined {
  const appName = getTestAppName(runId);
  if (clientName === 'broadcast') return undefined;
  if (clientName === 'queue') return { kind: 'queue', prefix: `bull_${appName}_local:queue:` };
  if (clientName.startsWith('redlock'))
    return { kind: 'redlock', prefix: `redlock_${appName}_local:` };
  return { kind: 'client', prefix: `${clientName}_${appName}_local:` };
}

function assertNoTlsTargetOverrides(tls: unknown) {
  if (!tls) return;
  if (typeof tls === 'string') throw new Error('Unsupported managed TLS profile');
  if (typeof tls === 'object') {
    for (const key of [
      'host',
      'port',
      'path',
      'socketPath',
      'socket',
      'stream',
      'lookup',
      'createConnection',
      'servername',
    ]) {
      if ((tls as any)[key] !== undefined)
        throw new Error('Unsupported managed TLS target override');
    }
  }
}
// Only explicit connection fields are projected. Credentials, URLs and option snapshots never enter the journal.
export function normalizeTestClaimDatabaseEndpoint(
  client: Record<string, any>,
  projectPath: string,
  runId: string,
): TestClaimDatabaseEndpoint {
  const dialect = client.client as TestClaimDatabaseEndpoint['dialect'];
  record(client.connection);
  const c = client.connection;
  assertNoTlsTargetOverrides(c.ssl);
  if (
    c.connectionString !== undefined ||
    c.uri !== undefined ||
    client.connectionPool !== undefined ||
    c.stream !== undefined ||
    c.lookup !== undefined ||
    client.driver !== undefined ||
    client.dialect !== undefined ||
    c.beforeConnect !== undefined
  ) {
    throw new Error('Unsupported managed database target');
  }
  let endpoint: TestClaimDatabaseEndpoint;
  if (dialect === 'better-sqlite3') {
    endpoint = {
      dialect,
      transport: 'file',
      socketPath: getTestClaimPaths(projectPath, runId).sqliteRoot,
      tls: false,
    };
  } else {
    if (!['pg', 'mysql', 'mysql2'].includes(dialect))
      throw new Error('Unsupported managed database dialect');
    const socket =
      c.socketPath ??
      (dialect === 'pg' && typeof c.host === 'string' && c.host.startsWith('/')
        ? c.host
        : undefined);
    const adminDatabase = dialect === 'pg' ? 'postgres' : 'mysql';
    if (socket !== undefined) {
      endpoint = {
        dialect,
        transport: 'socket',
        socketPath: socket,
        ...(dialect === 'pg' ? { port: Number(c.port) } : {}),
        tls: Boolean(c.ssl),
        adminDatabase,
      };
    } else {
      // pg otherwise consults mutable PGHOST/PGPORT environment defaults: fail closed.
      if (dialect === 'pg' && (c.host === undefined || c.port === undefined))
        throw new Error('Managed PostgreSQL requires explicit host and port');
      endpoint = {
        dialect,
        transport: 'tcp',
        host: c.host ?? 'localhost',
        port: Number(c.port ?? 3306),
        tls: Boolean(c.ssl),
        adminDatabase,
      };
    }
  }
  validateEndpoint(endpoint, false);
  return endpoint;
}
function mergeClaimOptions(...sources: Record<string, any>[]): Record<string, any> {
  const result: Record<string, any> = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (['__proto__', 'constructor', 'prototype'].includes(key))
        throw new Error('Unsupported managed option field');
      if (value === undefined) continue;
      if (value && Object.getPrototypeOf(value) === Object.prototype) {
        const previous = result[key];
        result[key] = mergeClaimOptions(
          previous && Object.getPrototypeOf(previous) === Object.prototype ? previous : {},
          value,
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
export function mergeTestClaimDatabaseOptions(
  base: Record<string, any>,
  dialect: Record<string, any> | undefined,
  client: Record<string, any>,
) {
  return mergeClaimOptions(base, dialect ?? {}, client);
}
export function mergeTestClaimRedisOptions(
  base: Record<string, any>,
  client: Record<string, any>,
): Record<string, any> {
  // Match extend(true, ...) for connection/TLS objects and undefined values without importing runtime code.
  return mergeClaimOptions(base, client);
}
export function normalizeTestClaimRedisEndpoint(
  options: Record<string, any>,
): TestClaimRedisEndpoint {
  assertNoTlsTargetOverrides(options.tls);
  if (
    options.sentinels ||
    options.nodes ||
    options.url ||
    options.connectionString ||
    options.Connector !== undefined ||
    options.connector !== undefined ||
    options.stream !== undefined ||
    options.dnsLookup !== undefined ||
    options.natMap !== undefined
  ) {
    throw new Error('Unsupported managed Redis target');
  }
  const endpoint: TestClaimRedisEndpoint =
    options.path !== undefined
      ? {
          transport: 'socket',
          socketPath: options.path,
          tls: Boolean(options.tls),
          db: Number(options.db ?? 0),
        }
      : {
          transport: 'tcp',
          host: options.host ?? 'localhost',
          port: Number(options.port ?? 6379),
          tls: Boolean(options.tls),
          db: Number(options.db ?? 0),
        };
  validateEndpoint(endpoint, true);
  return endpoint;
}

export interface TestClaimApp {
  projectPath: string;
  name: string;
  meta: { env: { META_MODE: string; VONA_TEST_RUN_ID?: string } };
  config: any;
}
export function buildTestClaimResourceInventory(app: TestClaimApp): {
  databases: TestClaimDatabasePlan[];
  redis: TestClaimRedis[];
} {
  const id = resolveTestRunId(app.meta.env.META_MODE, app.meta.env.VONA_TEST_RUN_ID);
  if (!id || app.name !== getTestAppName(id))
    throw new Error('Managed resource inventory requires test identity');
  const database = app.config.database;
  const scopes: [string, string][] = [['share', database.defaultClient]];
  for (const [name, instance] of Object.entries(app.config.instance.instances)) {
    const item = instance as any;
    if (item && item.isolate) scopes.push([`isolate-${name}`, item.isolateClient]);
  }
  const databases = scopes.map(([scope, clientName]) => {
    const client = database.clients[clientName];
    if (!client) throw new Error('Managed database client is missing');
    const options = mergeTestClaimDatabaseOptions(database.base, undefined, client);
    return {
      clientName,
      scope,
      prefix: getDatabaseTestPrefix(app.name, scope),
      endpoint: normalizeTestClaimDatabaseEndpoint(options, app.projectPath, id),
    };
  });
  const redis: TestClaimRedis[] = [];
  for (const [clientName, client] of Object.entries(app.config.redis.clients)) {
    const prefix = getTestClaimRedisPrefix(id, clientName);
    if (!prefix) continue;
    const options = mergeTestClaimRedisOptions(app.config.redis.base, client as any);
    redis.push({
      clientName,
      ...prefix,
      endpoint: normalizeTestClaimRedisEndpoint(options),
      released: false,
    });
  }
  return { databases, redis };
}

const appInventories = new WeakMap<object, ReturnType<typeof buildTestClaimResourceInventory>>();
const appDatabaseIntents = new WeakMap<object, Set<string>>();
export async function registerTestClaimResourceInventory(app: TestClaimApp) {
  if (!hasTestClaimTransport()) return;
  const inventory = buildTestClaimResourceInventory(app);
  await sendTestClaimEvent(process.env, { type: 'inventory', ...inventory });
  appInventories.set(app, inventory);
  appDatabaseIntents.set(app, new Set());
}
export function assertTestClaimDatabaseClient(
  app: TestClaimApp,
  clientName: string,
  config: Record<string, any>,
) {
  if (!hasTestClaimTransport()) return;
  const inventory = appInventories.get(app);
  const id = resolveTestRunId(app.meta.env.META_MODE, app.meta.env.VONA_TEST_RUN_ID)!;
  const endpoint = normalizeTestClaimDatabaseEndpoint(config, app.projectPath, id);
  const matches = inventory?.databases.filter(item => isDeepStrictEqual(item.endpoint, endpoint));
  if (!matches?.length) throw new Error('Unregistered managed database endpoint');
  const target = config.connection[endpoint.dialect === 'better-sqlite3' ? 'filename' : 'database'];
  const admin =
    endpoint.dialect === 'better-sqlite3'
      ? ['', ':memory:'].includes(target)
      : target === endpoint.adminDatabase;
  if (admin) {
    if (!matches.some(item => item.clientName === clientName))
      throw new Error('Unregistered managed database endpoint');
  } else if (
    !matches.some(item => appDatabaseIntents.get(app)?.has(`${item.clientName}\0${target}`))
  ) {
    throw new Error('Unregistered managed database allocation');
  }
}
export async function registerTestClaimDatabaseCreation(
  app: TestClaimApp,
  config: Record<string, any>,
  databaseName: string,
  stage: 'intent' | 'created',
) {
  if (!hasTestClaimTransport()) return;
  const id = resolveTestRunId(app.meta.env.META_MODE, app.meta.env.VONA_TEST_RUN_ID)!;
  const endpoint = normalizeTestClaimDatabaseEndpoint(config, app.projectPath, id);
  const plan = appInventories.get(app)?.databases.find(item => {
    if (!isDeepStrictEqual(item.endpoint, endpoint)) return false;
    try {
      assertDisposableDatabaseName(databaseName, item.prefix);
      return true;
    } catch {
      return false;
    }
  });
  if (!plan) throw new Error('Unregistered managed database creation endpoint');
  const name =
    endpoint.dialect === 'better-sqlite3'
      ? path.join(getTestClaimPaths(app.projectPath, id).sqliteRoot, `${databaseName}.db`)
      : databaseName;
  await sendTestClaimEvent(process.env, { type: 'database', database: plan, name, stage });
  appDatabaseIntents.get(app)!.add(`${plan.clientName}\0${name}`);
}
export function assertTestClaimRedisClient(
  app: TestClaimApp,
  clientName: string,
  options: Record<string, any>,
) {
  if (!hasTestClaimTransport()) return;
  // Broadcast carries subscriptions only, but may not drift to an unregistered endpoint either.
  const inventory = appInventories.get(app);
  const endpoint = normalizeTestClaimRedisEndpoint(options);
  const plan = inventory?.redis.find(item => item.clientName === clientName);
  if (clientName === 'broadcast') {
    const current = normalizeTestClaimRedisEndpoint(
      mergeTestClaimRedisOptions(app.config.redis.base, app.config.redis.clients.broadcast),
    );
    if (!inventory || !isDeepStrictEqual(current, endpoint))
      throw new Error('Unregistered managed Redis broadcast endpoint');
    return;
  }
  if (!plan || !isDeepStrictEqual(plan.endpoint, endpoint))
    throw new Error('Unregistered managed Redis endpoint');
  if (plan.kind === 'client' ? options.keyPrefix !== plan.prefix : options.keyPrefix !== undefined)
    throw new Error('Unregistered managed Redis key prefix');
}
