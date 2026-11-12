import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import type { TestClaimCleanupSession } from './testClaimCleanup.ts';

import {
  isTestCleanupConfigCode,
  TestCleanupConfigError,
} from '../vona/packages-cli/cli-set-api/src/lib/bean/toolsBin/testCleanupErrors.ts';
import {
  createTestClaim,
  getTestClaimRedisPrefix,
  loadTestClaim,
  writeTestClaim,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import { createTestClaimFile } from '../vona/packages-vona/vona-core/src/lib/core/testClaimFilesystem.ts';
import {
  getTestAppName,
  getDatabaseTestPrefix,
} from '../vona/packages-vona/vona-core/src/lib/core/testIsolation.ts';
import {
  cleanTestClaim,
  parseTestClaimTtlSeconds,
  reapExpiredTestClaims,
} from './testClaimCleanup.ts';

const runId = '20261011010203-deadbeef';
const inactive = async () => true;
async function fixture(remote = false, ownerHost = os.hostname()) {
  const parent = await mkdtemp(path.join(await realpath(os.tmpdir()), 'claim-cleanup-'));
  const project = path.join(parent, 'vona');
  await mkdir(project);
  const { claimPath, manifest } = await createTestClaim(project, runId, 'unit', {
    pid: process.pid,
    startTime: 'test-start',
    host: ownerHost,
  });
  for (const local of manifest.locals) {
    await mkdir(local.path);
    await writeFile(path.join(local.path, '.vona-test-owner'), `${runId}\n`);
    local.stage = 'owned';
    await writeFile(path.join(local.path, 'test-owned'), 'resource');
  }
  await mkdir(path.join(project, 'coverage'));
  await writeFile(path.join(project, 'coverage', 'sentinel'), 'keep');
  await mkdir(path.join(project, '.app'));
  await writeFile(path.join(project, '.app', 'sentinel'), 'development');
  if (remote) {
    const prefix = getDatabaseTestPrefix(getTestAppName(runId), 'share');
    manifest.databases.push({
      clientName: 'pg',
      scope: 'share',
      prefix,
      endpoint: {
        dialect: 'pg',
        transport: 'tcp',
        host: 'localhost',
        port: 5432,
        tls: false,
        adminDatabase: 'postgres',
      },
      creations: [{ name: `${prefix}20261011-010203`, stage: 'intent' }],
    });
    manifest.redis.push({
      clientName: 'cache',
      ...getTestClaimRedisPrefix(runId, 'cache')!,
      endpoint: { transport: 'tcp', host: 'localhost', port: 6379, tls: false, db: 0 },
      released: false,
    });
  }
  await writeTestClaim(claimPath, manifest);
  return {
    parent,
    project,
    claimPath,
    manifest,
    async close() {
      await rm(parent, { recursive: true, force: true });
    },
  };
}
async function absent(file: string) {
  await assert.rejects(lstat(file), { code: 'ENOENT' });
}

test('TTL defaults, positive safe integers and exact expiry boundary', async () => {
  assert.equal(parseTestClaimTtlSeconds(undefined), 86400);
  assert.equal(parseTestClaimTtlSeconds('1'), 1);
  for (const value of ['0', '-1', '1.5', '1e3', '', ' 1', '9007199254740992', 'Infinity'])
    assert.throws(() => parseTestClaimTtlSeconds(value));
  const f = await fixture();
  try {
    const created = Date.parse(f.manifest.createdAt);
    for (const now of [created - 1, created + 999, created + 1000]) {
      assert.deepEqual(await reapExpiredTestClaims(f.project, { now, ttlSeconds: 1 }), []);
      await lstat(f.claimPath);
    }
    assert.deepEqual(
      await reapExpiredTestClaims(f.project, { now: created + 1001, ttlSeconds: 1 }),
      [{ status: 'cleaned' }],
    );
    await absent(f.claimPath);
  } finally {
    await f.close();
  }
});

test('expired claims ignore host and process liveness while releasing only inventoried resources', async () => {
  for (const host of [os.hostname(), `${os.hostname()}-other`]) {
    const f = await fixture(true, host);
    const actions: string[] = [];
    let inspections = 0;
    try {
      f.manifest.processes.push(
        { id: 'pending-browser', role: 'browser', stage: 'pending' },
        {
          id: 'guardian',
          role: 'guardian',
          stage: 'registered',
          pid: process.pid,
          containment: 'windows-job',
          jobId: '12345678-1234-1234-1234-123456789abc',
          startTime: '123456789',
          host,
        },
      );
      await writeTestClaim(f.claimPath, f.manifest);
      assert.deepEqual(
        await reapExpiredTestClaims(f.project, {
          now: Date.parse(f.manifest.createdAt) + 1001,
          ttlSeconds: 1,
          isInactive: async () => {
            inspections++;
            throw new Error('Historical process inspection must not run');
          },
          prepare: async () => ({
            async dropDatabase(db, name) {
              assert.equal(name, db.creations[0].name);
              actions.push('database');
            },
            async clearRedis(resource) {
              assert.equal(resource.prefix, f.manifest.redis[0].prefix);
              actions.push('redis');
            },
            async close() {
              actions.push('close');
            },
          }),
        }),
        [{ status: 'cleaned' }],
      );
      assert.equal(inspections, 0);
      assert.deepEqual(actions, ['database', 'redis', 'close']);
      await absent(f.claimPath);
      for (const local of f.manifest.locals) await absent(local.path);
      assert.equal(await readFile(path.join(f.project, '.app/sentinel'), 'utf8'), 'development');
      assert.equal(await readFile(path.join(f.project, 'coverage/sentinel'), 'utf8'), 'keep');
    } finally {
      await f.close();
    }
  }
});

test('cleanup rechecks expiry under lock before configuration or process inspection', async () => {
  const f = await fixture(true);
  let preparations = 0;
  let inspections = 0;
  try {
    const created = Date.parse(f.manifest.createdAt);
    for (const expiredBefore of [created - 1, created]) {
      assert.deepEqual(
        await cleanTestClaim(f.claimPath, {
          expiredBefore,
          isInactive: async () => {
            inspections++;
            return true;
          },
          prepare: async () => {
            preparations++;
            throw new Error('Unexpired claim must not prepare cleanup');
          },
        }),
        { status: 'skipped', reason: 'claim has not expired' },
      );
      assert.deepEqual(await loadTestClaim(f.claimPath), f.manifest);
      for (const local of f.manifest.locals) await lstat(local.path);
      await absent(`${f.claimPath}.cleanup.lock`);
    }
    for (const expiredBefore of [Number.NaN, Infinity, -Infinity]) {
      await assert.rejects(cleanTestClaim(f.claimPath, { expiredBefore }), /Invalid.*cutoff/);
    }
    assert.equal(preparations, 0);
    assert.equal(inspections, 0);
  } finally {
    await f.close();
  }
});

test('one cleanup sequence journals database and Redis before roots; claim removed last', async () => {
  const f = await fixture(true);
  const actions: string[] = [];
  try {
    const result = await cleanTestClaim(f.claimPath, {
      isInactive: async () => {
        actions.push('inactive');
        return true;
      },
      prepare: async () => {
        actions.push('validate-config');
        return {
          async dropDatabase(db, name) {
            actions.push('database');
            assert.equal(name, db.creations[0].name);
            await lstat(f.claimPath);
          },
          async clearRedis() {
            actions.push('redis');
            assert.equal(
              (await loadTestClaim(f.claimPath)).databases[0].creations[0].stage,
              'released',
            );
          },
          async close() {
            actions.push('close');
            await lstat(f.manifest.locals[0].path);
          },
        };
      },
    });
    assert.deepEqual(result, { status: 'cleaned' });
    assert.deepEqual(actions, ['validate-config', 'inactive', 'database', 'redis', 'close']);
    await absent(f.claimPath);
    for (const root of f.manifest.locals) await absent(root.path);
    assert.equal(await readFile(path.join(f.project, '.app/sentinel'), 'utf8'), 'development');
    assert.equal(await readFile(path.join(f.project, 'coverage/sentinel'), 'utf8'), 'keep');
  } finally {
    await f.close();
  }
});

test('inactive checks retain categorical reasons with a generic fallback and no cleanup', async () => {
  for (const evidence of [
    false,
    { inactive: false },
    { inactive: false, reason: 'registered Windows job owner is still present' },
  ]) {
    const f = await fixture(true);
    const warnings: string[] = [];
    const actions: string[] = [];
    try {
      const result = await cleanTestClaim(f.claimPath, {
        isInactive: async () => evidence,
        warn: message => warnings.push(message),
        prepare: async () => ({
          async dropDatabase() {
            actions.push('database');
          },
          async clearRedis() {
            actions.push('redis');
          },
          async close() {
            actions.push('close');
          },
        }),
      });
      const detail = typeof evidence === 'boolean' ? undefined : evidence.reason;
      const reason = `live or uncertain process ownership${detail ? `: ${detail}` : ''}`;
      assert.deepEqual(result, { status: 'skipped', reason });
      assert.deepEqual(warnings, [`Retained test claim ${path.basename(f.claimPath)}: ${reason}`]);
      assert.deepEqual(actions, ['close']);
      assert.deepEqual(await loadTestClaim(f.claimPath), f.manifest);
      for (const local of f.manifest.locals) {
        assert.equal(await readFile(path.join(local.path, 'test-owned'), 'utf8'), 'resource');
      }
    } finally {
      await f.close();
    }
  }
});

test('preparation reports only fixed config categories, never arbitrary error details', async () => {
  for (const code of ['databaseClient', 'databaseEndpoint', 'databaseNamespace', 'databaseScope'])
    assert.equal(isTestCleanupConfigCode(code), true);
  for (const code of [undefined, null, {}, '__proto__', 'constructor', 'secret://private-host'])
    assert.equal(isTestCleanupConfigCode(code), false);

  const known = new TestCleanupConfigError('databaseEndpoint');
  known.message = 'secret://private-host/private-path';
  for (const error of [known, new Error('secret://private-host/private-path')]) {
    const f = await fixture(true);
    const warnings: string[] = [];
    try {
      const reason =
        error === known
          ? 'cleanup database endpoint drift'
          : 'unsafe roots, configuration drift, or inspection failure';
      assert.deepEqual(
        await cleanTestClaim(f.claimPath, {
          expiredBefore: Date.parse(f.manifest.createdAt) + 1,
          warn: message => warnings.push(message),
          prepare: async () => {
            throw error;
          },
        }),
        { status: 'skipped', reason },
      );
      assert.deepEqual(warnings, [`Retained test claim ${path.basename(f.claimPath)}: ${reason}`]);
      assert.deepEqual(await loadTestClaim(f.claimPath), f.manifest);
      for (const local of f.manifest.locals) await lstat(local.path);
      await absent(`${f.claimPath}.cleanup.lock`);
    } finally {
      await f.close();
    }
  }
});

test('partial failure retains progress and retries only remaining resources', async () => {
  const f = await fixture(true);
  let drops = 0;
  let fail = true;
  const session: TestClaimCleanupSession = {
    async dropDatabase() {
      drops++;
    },
    async clearRedis() {
      if (fail) throw new Error('secret-bearing error deliberately not surfaced');
    },
    async close() {},
  };
  try {
    const first = await cleanTestClaim(f.claimPath, {
      isInactive: inactive,
      prepare: async () => session,
    });
    assert.equal(first.status, 'failed');
    assert.equal((await loadTestClaim(f.claimPath)).databases[0].creations[0].stage, 'released');
    for (const root of f.manifest.locals) await lstat(root.path);
    fail = false;
    assert.equal(
      (await cleanTestClaim(f.claimPath, { isInactive: inactive, prepare: async () => session }))
        .status,
      'cleaned',
    );
    assert.equal(drops, 1);
  } finally {
    await f.close();
  }
});

test('live, missing inspector, drifted config, malformed manifest and unmarked roots retain resources', async () => {
  for (const reason of ['live', 'inspector', 'drift', 'malformed', 'unmarked', 'symlink']) {
    const f = await fixture(reason === 'drift');
    try {
      if (reason === 'malformed') await writeFile(f.claimPath, '{');
      if (reason === 'unmarked') await rm(path.join(f.manifest.locals[0].path, '.vona-test-owner'));
      if (reason === 'symlink') {
        await rm(f.manifest.locals[0].path, { recursive: true });
        await symlink(
          path.join(f.project, '.app'),
          f.manifest.locals[0].path,
          process.platform === 'win32' ? 'junction' : 'dir',
        );
      }
      const result = await cleanTestClaim(f.claimPath, {
        isInactive: reason === 'inspector' ? undefined : async () => reason !== 'live',
        prepare: async () => {
          throw new Error('drift');
        },
      });
      assert.equal(result.status, 'skipped', reason);
      await lstat(f.claimPath);
      assert.equal(await readFile(path.join(f.project, '.app/sentinel'), 'utf8'), 'development');
    } finally {
      await f.close();
    }
  }
});

test('expired claims retain invalid manifests, unsafe roots and configuration drift', async () => {
  for (const reason of ['drift', 'malformed', 'unmarked', 'wrong-owner', 'symlink']) {
    const f = await fixture(reason === 'drift');
    let preparations = 0;
    try {
      if (reason === 'malformed') await writeFile(f.claimPath, '{');
      const marker = path.join(f.manifest.locals[0].path, '.vona-test-owner');
      if (reason === 'unmarked') await rm(marker);
      if (reason === 'wrong-owner') await writeFile(marker, 'another-run\n');
      if (reason === 'symlink') {
        await rm(f.manifest.locals[0].path, { recursive: true });
        await symlink(
          path.join(f.project, '.app'),
          f.manifest.locals[0].path,
          process.platform === 'win32' ? 'junction' : 'dir',
        );
      }
      const results = await reapExpiredTestClaims(f.project, {
        now: Date.parse(f.manifest.createdAt) + 1001,
        ttlSeconds: 1,
        prepare: async () => {
          preparations++;
          throw new Error('Configuration drift');
        },
      });
      assert.equal(results.length, 1, reason);
      assert.equal(results[0].status, 'skipped', reason);
      assert.equal(preparations, reason === 'drift' ? 1 : 0);
      await lstat(f.claimPath);
      assert.equal(await readFile(path.join(f.project, '.app/sentinel'), 'utf8'), 'development');
      assert.equal(await readFile(path.join(f.project, 'coverage/sentinel'), 'utf8'), 'keep');
    } finally {
      await f.close();
    }
  }
});

test('exclusive cleaners skip contenders, including historical cleanup against a fresh lock', async () => {
  const f = await fixture();
  let release!: () => void;
  let acquired!: () => void;
  const ready = new Promise<void>(resolve => {
    acquired = resolve;
  });
  const gate = new Promise<void>(resolve => {
    release = resolve;
  });
  try {
    const first = cleanTestClaim(f.claimPath, {
      isInactive: async () => {
        acquired();
        await gate;
        return true;
      },
    });
    await ready;
    assert.equal((await cleanTestClaim(f.claimPath, { isInactive: inactive })).status, 'skipped');
    const warnings: string[] = [];
    const result = await reapExpiredTestClaims(f.project, {
      now: Date.now(),
      ttlSeconds: 86400,
      warn: warning => warnings.push(warning),
    });
    assert.equal(result[0].status, 'skipped');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /unexpired or changed/);
    release();
    assert.equal((await first).status, 'cleaned');
    await absent(`${f.claimPath}.cleanup.lock`);
  } finally {
    release?.();
    await f.close();
  }
});

test('historical cleanup recovers expired locks and reuses guarded resource cleanup', async () => {
  for (const contents of [
    'truncated {',
    JSON.stringify({ pid: process.pid, hostname: 'foreign' }),
  ]) {
    const f = await fixture(true);
    const lockPath = `${f.claimPath}.cleanup.lock`;
    const created = Date.parse(f.manifest.createdAt);
    const actions: string[] = [];
    const warnings: string[] = [];
    try {
      await createTestClaimFile(lockPath, contents);
      await utimes(lockPath, new Date(created), new Date(created));
      // Current-run cleanup and unexpired claims must not reclaim even an old lock.
      assert.equal((await cleanTestClaim(f.claimPath, { isInactive: inactive })).status, 'skipped');
      assert.equal(
        (await cleanTestClaim(f.claimPath, { expiredBefore: created })).reason,
        'claim has not expired',
      );
      assert.equal(await readFile(lockPath, 'utf8'), contents);
      assert.deepEqual(
        await reapExpiredTestClaims(f.project, {
          now: created + 10000,
          ttlSeconds: 1,
          warn: warning => warnings.push(warning),
          isInactive: async () => {
            throw new Error('Historical cleanup must not inspect processes');
          },
          prepare: async () => ({
            async dropDatabase(db, name) {
              assert.equal(name, db.creations[0].name);
              actions.push('database');
            },
            async clearRedis(resource) {
              assert.equal(resource.prefix, f.manifest.redis[0].prefix);
              actions.push('redis');
            },
            async close() {
              actions.push('close');
            },
          }),
        }),
        [{ status: 'cleaned' }],
      );
      assert.deepEqual(actions, ['database', 'redis', 'close']);
      assert.deepEqual(warnings, []);
      await absent(f.claimPath);
      await absent(lockPath);
      for (const local of f.manifest.locals) await absent(local.path);
    } finally {
      await f.close();
    }
  }
});

test('unsafe shared directories fail invocation; legacy directories warn and remain', async () => {
  const f = await fixture();
  try {
    if (process.platform === 'win32') {
      execFileSync('icacls.exe', [path.dirname(f.claimPath), '/grant', '*S-1-1-0:(R)'], {
        windowsHide: true,
        stdio: 'pipe',
      });
    } else {
      await chmod(path.dirname(f.claimPath), 0o777);
    }
    await assert.rejects(reapExpiredTestClaims(f.project, { isInactive: inactive }), /Unsafe/);
    if (process.platform === 'win32') {
      execFileSync('icacls.exe', [path.dirname(f.claimPath), '/remove:g', '*S-1-1-0'], {
        windowsHide: true,
        stdio: 'pipe',
      });
    } else {
      await chmod(path.dirname(f.claimPath), 0o700);
    }
    const legacy = path.join(f.project, `.vona-test-claim-${runId}`);
    await mkdir(legacy);
    const warnings: string[] = [];
    await reapExpiredTestClaims(f.project, {
      now: Date.parse(f.manifest.createdAt),
      warn: warning => warnings.push(warning),
    });
    assert.ok(warnings.some(w => w.includes('Legacy')));
    await lstat(legacy);
  } finally {
    await f.close();
  }
});

test('missing already-deleted local roots are idempotent on retry', async () => {
  const f = await fixture();
  try {
    await rm(f.manifest.locals[0].path, { recursive: true });
    assert.equal((await cleanTestClaim(f.claimPath, { isInactive: inactive })).status, 'cleaned');
  } finally {
    await f.close();
  }
});

test('SQLite files and sidecars remain intents until the marked data root is released', async () => {
  const f = await fixture();
  const prefix = getDatabaseTestPrefix(getTestAppName(runId), 'share');
  const data = f.manifest.locals.find(local => local.kind === 'data')!.path;
  const sqlite = path.join(data, 'sqlite3');
  const name = path.join(sqlite, `${prefix}20261011-010203.db`);
  let failClose = true;
  try {
    await mkdir(sqlite);
    for (const suffix of ['', '-wal', '-shm']) await writeFile(name + suffix, 'test-owned');
    f.manifest.databases.push({
      clientName: 'sqlite3',
      scope: 'share',
      prefix,
      endpoint: { dialect: 'better-sqlite3', transport: 'file', socketPath: sqlite, tls: false },
      creations: [{ name, stage: 'intent' }],
    });
    await writeTestClaim(f.claimPath, f.manifest);
    const options = {
      isInactive: inactive,
      prepare: async () => ({
        async dropDatabase() {
          throw new Error('SQLite must not use a remote driver');
        },
        async clearRedis() {
          throw new Error('No Redis inventory');
        },
        async close() {
          if (failClose) throw new Error('uncertain close');
        },
      }),
    };
    assert.equal((await cleanTestClaim(f.claimPath, options)).status, 'failed');
    assert.equal((await loadTestClaim(f.claimPath)).databases[0].creations[0].stage, 'intent');
    assert.equal((await loadTestClaim(f.claimPath)).cleanup.databases, false);
    await lstat(`${name}-wal`);
    failClose = false;
    assert.equal((await cleanTestClaim(f.claimPath, options)).status, 'cleaned');
    await absent(data);
  } finally {
    await f.close();
  }
});
