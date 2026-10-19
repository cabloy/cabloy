import { spawn } from 'node:child_process';
import { lstat, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  TestClaimDatabase,
  TestClaimManifest,
  TestClaimRedis,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';

import {
  assertTestClaimSafePath,
  loadTestClaim,
  TEST_CLAIM_DIRECTORY,
  writeTestClaim,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import {
  acquireTestClaimCleanupLock,
  assertTestClaimPrivateDirectory,
  deleteTestClaimFile,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaimFilesystem.ts';
import { assertTestRunOwner } from '../vona/packages-vona/vona-core/src/lib/core/testIsolation.ts';

export interface TestClaimCleanupSession {
  dropDatabase(database: TestClaimDatabase, name: string): Promise<void>;
  clearRedis(resource: TestClaimRedis): Promise<void>;
  close(): Promise<void>;
}
export interface TestClaimCleanupOptions {
  projectPath?: string;
  isInactive?: (
    claim: TestClaimManifest,
  ) => Promise<boolean | { inactive: boolean; reason?: string }>;
  warn?: (message: string) => void;
  prepare?: (claim: TestClaimManifest, claimPath: string) => Promise<TestClaimCleanupSession>;
}
export interface TestClaimReapOptions extends TestClaimCleanupOptions {
  ttlSeconds?: number;
  now?: number;
}
export interface TestClaimCleanupResult {
  status: 'cleaned' | 'skipped' | 'failed';
  reason?: string;
}

export function parseTestClaimTtlSeconds(
  value: string | undefined = process.env.VONA_TEST_CLAIM_TTL_SECONDS,
): number {
  if (value === undefined) return 86400;
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) <= 0) {
    throw new Error('VONA_TEST_CLAIM_TTL_SECONDS must be a positive safe integer');
  }
  return Number(value);
}

async function exists(file: string) {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}
async function validateLocalRoots(claim: TestClaimManifest) {
  for (const local of claim.locals) {
    assertTestClaimSafePath(local.path);
    if (!(await exists(local.path))) continue;
    if (local.stage === 'released') throw new Error('Released local test resource reappeared');
    const markerPath = path.join(local.path, '.vona-test-owner');
    assertTestClaimSafePath(markerPath, false);
    const marker = await lstat(markerPath);
    if (marker.isSymbolicLink() || !marker.isFile() || marker.nlink !== 1)
      throw new Error('Unsafe test owner marker');
    assertTestRunOwner(local.path, claim.runId);
  }
}

export async function cleanTestClaim(
  claimPath: string,
  options: TestClaimCleanupOptions = {},
): Promise<TestClaimCleanupResult> {
  claimPath = path.resolve(claimPath);
  // An unsafe shared namespace is fatal to the invocation, not a skippable claim.
  await assertTestClaimPrivateDirectory(path.dirname(claimPath), false);
  const warn = options.warn ?? (() => {});
  const skip = (reason: string): TestClaimCleanupResult => {
    warn(`Retained test claim ${path.basename(claimPath)}: ${reason}`);
    return { status: 'skipped', reason };
  };
  let claim: TestClaimManifest;
  try {
    claim = await loadTestClaim(claimPath);
    if (options.projectPath && claim.projectPath !== path.resolve(options.projectPath))
      return skip('checkout mismatch');
  } catch {
    return skip('malformed or unsafe manifest');
  }
  const lockPath = `${claimPath}.cleanup.lock`;
  let lock;
  try {
    lock = await acquireTestClaimCleanupLock(lockPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST')
      return skip('cleanup lock present; inspect manually, age never permits takeover');
    return skip('cannot acquire safe cleanup lock');
  }
  let session: TestClaimCleanupSession | undefined;
  let sequenceStarted = false;
  try {
    // Re-read after locking; the runner must have closed its single inventory broker.
    claim = await loadTestClaim(claimPath);
    await validateLocalRoots(claim);
    if (claim.databases.length || claim.redis.length)
      session = await (options.prepare ?? prepareCleanupProcess)(claim, claimPath);
    if (!options.isInactive) return skip('process inactivity inspector unavailable');
    const evidence = await options.isInactive(claim);
    if (!(typeof evidence === 'boolean' ? evidence : evidence.inactive))
      return skip('live or uncertain process ownership');
    sequenceStarted = true;
    claim.status = 'cleaning';
    claim.cleanup.processes = true;
    await writeTestClaim(claimPath, claim);
    for (const db of claim.databases) {
      for (const creation of db.creations) {
        if (creation.stage === 'released') continue;
        // SQLite files and sidecars are released with the entire marked data root,
        // and must not be journaled as gone before that deletion completes.
        if (db.endpoint.dialect === 'better-sqlite3') continue;
        await session!.dropDatabase(db, creation.name);
        creation.stage = 'released';
        await writeTestClaim(claimPath, claim);
      }
    }
    claim.cleanup.databases = claim.databases.every(database =>
      database.creations.every(creation => creation.stage === 'released'),
    );
    await writeTestClaim(claimPath, claim);
    for (const resource of claim.redis) {
      if (resource.released) continue;
      await session!.clearRedis(resource);
      resource.released = true;
      await writeTestClaim(claimPath, claim);
    }
    claim.cleanup.redis = true;
    await writeTestClaim(claimPath, claim);
    // No connections can outlive local deletion. A failed close retains the journal.
    if (session) {
      await session.close();
      session = undefined;
    }
    for (const local of claim.locals) {
      if (local.stage === 'released') continue;
      assertTestClaimSafePath(local.path);
      if (await exists(local.path)) {
        assertTestRunOwner(local.path, claim.runId);
        await rm(local.path, { recursive: true, force: false });
      }
      local.stage = 'released';
      await writeTestClaim(claimPath, claim);
    }
    for (const database of claim.databases) {
      if (database.endpoint.dialect === 'better-sqlite3') {
        for (const creation of database.creations) creation.stage = 'released';
      }
    }
    claim.cleanup.databases = true;
    claim.cleanup.locals = true;
    await writeTestClaim(claimPath, claim);
    // Validate once more before releasing the inventory, always last.
    await loadTestClaim(claimPath);
    await deleteTestClaimFile(claimPath);
    return { status: 'cleaned' };
  } catch {
    const reason = sequenceStarted
      ? 'cleanup failed; remaining resources journaled for retry'
      : 'unsafe roots, configuration drift, or inspection failure';
    warn(`Retained test claim ${path.basename(claimPath)}: ${reason}`);
    return { status: sequenceStarted ? 'failed' : 'skipped', reason };
  } finally {
    if (session) await session.close().catch(() => {});
    // Do not remove a replacement lock. No automatic orphan-lock takeover.
    try {
      await lock.release();
    } catch {
      warn(`Retained cleanup lock ${path.basename(lockPath)}: manual inspection required`);
    }
  }
}

export async function reapExpiredTestClaims(
  projectPath: string,
  options: TestClaimReapOptions = {},
): Promise<TestClaimCleanupResult[]> {
  projectPath = path.resolve(projectPath);
  const ttl = options.ttlSeconds ?? parseTestClaimTtlSeconds();
  if (!Number.isSafeInteger(ttl) || ttl <= 0)
    throw new Error('Test claim TTL must be a positive safe integer');
  const now = options.now ?? Date.now();
  if (!Number.isFinite(now)) throw new Error('Invalid test claim cleanup clock');
  const warn = options.warn ?? (() => {});
  const directory = path.join(projectPath, TEST_CLAIM_DIRECTORY);
  // Legacy roots cannot prove remote ownership and are never adopted/deleted.
  for (const item of await readdir(projectPath, { withFileTypes: true })) {
    if (item.name.startsWith('.vona-test-claim-'))
      warn(`Legacy inventory-less test claim retained: ${item.name}`);
    const legacyRun = /^(?:\.vona-test-|\.app-test-)(\d{14}-[a-f0-9]{8})$/.exec(item.name);
    if (legacyRun && !(await exists(path.join(directory, `${legacyRun[1]}.json`))))
      warn(`Legacy inventory-less test root retained: ${item.name}`);
  }
  if (!(await assertTestClaimPrivateDirectory(directory))) return [];
  const results: TestClaimCleanupResult[] = [];
  for (const name of await readdir(directory)) {
    if (name.endsWith('.cleanup.lock')) {
      warn(`Cleanup lock retained for manual inspection: ${name}`);
      continue;
    }
    if (!name.endsWith('.json')) continue;
    const claimPath = path.join(directory, name);
    let claim: TestClaimManifest;
    try {
      claim = await loadTestClaim(claimPath);
    } catch {
      warn(`Malformed or unsafe test claim retained: ${name}`);
      results.push({ status: 'skipped', reason: 'malformed or unsafe manifest' });
      continue;
    }
    if (claim.projectPath !== projectPath) {
      warn(`Checkout-mismatched test claim retained: ${name}`);
      continue;
    }
    if ((now - Date.parse(claim.createdAt)) / 1000 <= ttl) continue;
    results.push(await cleanTestClaim(claimPath, { ...options, projectPath }));
  }
  return results;
}

export async function prepareCleanupProcess(
  claim: TestClaimManifest,
  claimPath: string,
): Promise<TestClaimCleanupSession> {
  const helper = fileURLToPath(
    new URL(
      '../vona/packages-cli/cli-set-api/src/lib/bean/toolsBin/testCleanupProcess.ts',
      import.meta.url,
    ),
  );
  // Config and credentials stay inside the child. Ignore stdout/stderr completely:
  // source config and driver diagnostics must never become secret-bearing logs.
  const child = spawn(process.execPath, [helper], {
    cwd: claim.projectPath,
    env: {
      ...process.env,
      VONA_TEST_RUN_ID: claim.runId,
      META_MODE: 'test',
      META_FLAVOR: 'normal',
      APP_NAME: `cabtest${claim.runId}`,
      SERVER_LISTEN_PORT: '1',
    },
    stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
  });
  let nextId = 0;
  let closed = false;
  let exited = false;
  const exitPromise = new Promise<void>(resolve => {
    child.once('exit', () => {
      exited = true;
      resolve();
    });
    child.once('error', () => {
      exited = true;
      resolve();
    });
  });
  const pending = new Map<
    number,
    { resolve: () => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }
  >();
  const fail = () => {
    for (const operation of pending.values()) {
      clearTimeout(operation.timer);
      operation.reject(new Error('Cleanup helper failed'));
    }
    pending.clear();
  };
  child.on('error', () => {
    exited = true;
    fail();
  });
  child.on('exit', fail);
  child.on('message', (value: any) => {
    if (!value || typeof value.id !== 'number' || typeof value.ok !== 'boolean') return;
    const operation = pending.get(value.id);
    if (!operation) return;
    pending.delete(value.id);
    clearTimeout(operation.timer);
    if (value.ok) operation.resolve();
    else operation.reject(new Error('Cleanup helper rejected operation'));
  });
  const request = (command: string, args: object = {}) =>
    new Promise<void>((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error('Cleanup helper timed out'));
        child.kill('SIGTERM');
      }, 30000);
      pending.set(id, { resolve, reject, timer });
      child.send({ id, command, ...args }, error => {
        if (error) fail();
      });
    });
  const close = async () => {
    if (closed) return;
    closed = true;
    try {
      if (child.connected && !exited) await request('close');
    } finally {
      if (child.connected) child.disconnect();
      if (!exited) child.kill('SIGTERM');
      const timer = setTimeout(() => {
        if (!exited) child.kill('SIGKILL');
      }, 3000);
      try {
        await exitPromise;
      } finally {
        clearTimeout(timer);
      }
    }
  };
  try {
    await request('prepare', { claimPath });
  } catch (error) {
    await close().catch(() => {});
    throw error;
  }
  return {
    dropDatabase: (database, name) =>
      request('database', { clientName: database.clientName, scope: database.scope, name }),
    clearRedis: resource => request('redis', { clientName: resource.clientName }),
    close,
  };
}
