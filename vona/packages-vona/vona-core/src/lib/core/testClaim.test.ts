import '@cabloy/json5';
import assert from 'node:assert/strict';
import {
  chmodSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  assertTestClaimDatabaseClient,
  assertTestClaimRedisClient,
  buildTestClaimResourceInventory,
  createTestClaim,
  getTestClaimCreatedAt,
  getTestClaimPaths,
  hasTestClaimTransport,
  loadTestClaim,
  mergeTestClaimRedisOptions,
  normalizeTestClaimDatabaseEndpoint,
  normalizeTestClaimRedisEndpoint,
  registerTestClaimDatabaseCreation,
  registerTestClaimResourceInventory,
  sendTestClaimEvent,
  startTestClaimBroker,
  validateTestClaim,
  writeTestClaim,
} from './testClaim.ts';
import { getTestAppName } from './testIsolation.ts';

const runId = '20261013010203-a1b2c3d4';
const owner = { pid: process.pid, startTime: 'test-process-start', host: hostname() };
function fixture() {
  const root = mkdtempSync(path.join(realpathSync(tmpdir()), 'vona-test-claim-'));
  const projectPath = path.join(root, 'vona');
  mkdirSync(projectPath);
  return { root, projectPath, dispose: () => rmSync(root, { recursive: true, force: true }) };
}
function appFixture(projectPath: string) {
  return {
    projectPath,
    name: getTestAppName(runId),
    meta: { env: { META_MODE: 'test', VONA_TEST_RUN_ID: runId } },
    config: {
      database: {
        defaultClient: 'pg',
        base: {},
        clients: {
          pg: {
            client: 'pg',
            connection: {
              host: '127.0.0.1',
              port: 5432,
              database: 'postgres',
              password: 'SECRET_DB',
              user: 'owner',
            },
          },
        },
      },
      instance: { instances: { isolated: { isolate: true, isolateClient: 'pg' } } },
      redis: {
        base: { host: '127.0.0.1', port: 6379, password: 'SECRET_REDIS' },
        clients: {
          cache: { keyPrefix: true, db: 2 },
          queue: {},
          redlock: {},
          redlockOther: { port: 6380 },
          broadcast: {},
        },
      },
    },
  };
}
function transportEnv(env: Record<string, string | undefined>) {
  return { ...env, META_MODE: 'test', VONA_TEST_RUN_ID: runId };
}

test('exclusive central claim has canonical immutable UTC creation time and private modes', async () => {
  const f = fixture();
  try {
    const { claimPath, manifest } = await createTestClaim(f.projectPath, runId, 'unit', owner);
    assert.equal(claimPath, path.join(f.projectPath, '.vona-test-claim', `${runId}.json`));
    assert.equal(manifest.createdAt, '2026-10-13T01:02:03.000Z');
    assert.ok(JSON.parse('{"createdAt":"2026-10-13T01:02:03.000Z"}').createdAt instanceof Date);
    assert.equal(lstatSync(claimPath).mode & 0o777, 0o600);
    assert.equal(lstatSync(path.dirname(claimPath)).mode & 0o777, 0o700);
    await assert.rejects(createTestClaim(f.projectPath, runId, 'unit', owner), { code: 'EEXIST' });
    const contractClaim = await createTestClaim(
      f.projectPath,
      '20261013010203-deadbeef',
      'contract',
      owner,
    );
    assert.equal((await loadTestClaim(contractClaim.claimPath)).kind, 'contract');
    assert.deepEqual(
      manifest.locals.map(item => item.kind),
      ['generated', 'data'],
    );
    assert.deepEqual(await loadTestClaim(claimPath), manifest);
    for (const id of [
      '20260230010203-a1b2c3d4',
      '20261013240203-a1b2c3d4',
      '20261013010203-A1B2C3D4',
    ])
      assert.throws(() => getTestClaimCreatedAt(id));
  } finally {
    f.dispose();
  }
});

test('claim creation rejects symlink paths and permissive shared directories', async () => {
  const f = fixture();
  try {
    const directory = getTestClaimPaths(f.projectPath, runId).claimDirectory;
    mkdirSync(path.join(f.root, 'outside'));
    symlinkSync(path.join(f.root, 'outside'), directory);
    await assert.rejects(createTestClaim(f.projectPath, runId, 'unit', owner), /Unsafe/);
    rmSync(directory, { recursive: true, force: true });
    mkdirSync(directory, { mode: 0o755 });
    await assert.rejects(createTestClaim(f.projectPath, runId, 'unit', owner), /Unsafe/);
    rmSync(directory, { recursive: true, force: true });
    const { claimPath } = await createTestClaim(f.projectPath, runId, 'unit', owner);
    chmodSync(claimPath, 0o644);
    await assert.rejects(loadTestClaim(claimPath), /Unsafe/);
  } finally {
    f.dispose();
  }
});

test('manifest validation rejects filename drift, secret snapshots and arbitrary resources', async () => {
  const f = fixture();
  try {
    const { manifest, claimPath } = await createTestClaim(f.projectPath, runId, 'unit', owner);
    assert.throws(() => validateTestClaim(manifest, `${claimPath}.other`));
    assert.throws(() => validateTestClaim({ ...manifest, kind: 'unknown' }));
    assert.throws(() => validateTestClaim({ ...manifest, password: 'secret' }));
    assert.throws(() => validateTestClaim({ ...manifest, createdAt: '2026-10-14T01:02:03.000Z' }));
    assert.throws(() =>
      validateTestClaim({
        ...manifest,
        locals: [{ ...manifest.locals[0], path: f.root }, manifest.locals[1]],
      }),
    );
    assert.throws(() =>
      validateTestClaim({
        ...manifest,
        processes: [{ id: 'x', role: 'browser', stage: 'registered', pid: 1, pgid: 1 }],
      }),
    );
    assert.throws(() =>
      validateTestClaim({
        ...manifest,
        processes: [{ id: 'x', role: 'browser', stage: 'pending', profilePath: f.root }],
      }),
    );
    const inventory = buildTestClaimResourceInventory(appFixture(f.projectPath));
    manifest.databases = inventory.databases.map(item => ({ ...item, creations: [] }));
    manifest.redis = inventory.redis;
    assert.throws(() =>
      validateTestClaim({ ...manifest, redis: [{ ...manifest.redis[0], prefix: 'cache_' }] }),
    );
    assert.throws(() =>
      validateTestClaim({
        ...manifest,
        databases: [
          { ...manifest.databases[0], creations: [{ name: 'development', stage: 'intent' }] },
        ],
      }),
    );
  } finally {
    f.dispose();
  }
});

test('normalization whitelists endpoint identity and exact physical Redis prefixes', () => {
  const app = appFixture('/project/vona');
  const inventory = buildTestClaimResourceInventory(app);
  assert.equal(inventory.databases.length, 2);
  assert.equal(inventory.databases[1].scope, 'isolate-isolated');
  assert.equal(inventory.redis.length, 4);
  assert.equal(
    inventory.redis.find(item => item.clientName === 'queue')!.prefix,
    `bull_${app.name}_local:queue:`,
  );
  assert.equal(
    inventory.redis.find(item => item.clientName === 'redlockOther')!.prefix,
    `redlock_${app.name}_local:`,
  );
  assert.equal(
    inventory.redis.find(item => item.clientName === 'redlockOther')!.endpoint.port,
    6380,
  );
  assert.equal(JSON.stringify(inventory).includes('SECRET'), false);
  assert.equal(JSON.stringify(inventory).includes('password'), false);
  const options = mergeTestClaimRedisOptions(
    { host: 'base', port: 6379 },
    { host: undefined, port: 6380 },
  );
  assert.deepEqual(normalizeTestClaimRedisEndpoint(options), {
    transport: 'tcp',
    host: 'base',
    port: 6380,
    tls: false,
    db: 0,
  });
  assert.deepEqual(normalizeTestClaimRedisEndpoint({ path: '/run/redis.sock', db: 2 }), {
    transport: 'socket',
    socketPath: '/run/redis.sock',
    db: 2,
    tls: false,
  });
});

test('normalization rejects unresolved or custom targets and captures pg socket port', () => {
  assert.throws(
    () =>
      normalizeTestClaimDatabaseEndpoint(
        { client: 'pg', connection: { database: 'postgres' } },
        '/vona',
        runId,
      ),
    /explicit/,
  );
  assert.deepEqual(
    normalizeTestClaimDatabaseEndpoint(
      { client: 'pg', connection: { host: '/run/postgresql', port: 5433 } },
      '/vona',
      runId,
    ),
    {
      dialect: 'pg',
      transport: 'socket',
      socketPath: '/run/postgresql',
      port: 5433,
      tls: false,
      adminDatabase: 'postgres',
    },
  );
  assert.throws(() =>
    normalizeTestClaimDatabaseEndpoint(
      { client: 'pg', connection: { host: '/run/postgresql' } },
      '/vona',
      runId,
    ),
  );
  for (const extra of [{ connectionString: 'postgres://secret' }, { stream: () => {} }]) {
    assert.throws(() =>
      normalizeTestClaimDatabaseEndpoint(
        { client: 'pg', connection: { host: 'localhost', port: 5432, ...extra } },
        '/vona',
        runId,
      ),
    );
  }
  for (const options of [
    { Connector: class {} },
    { nodes: [{}] },
    { host: 'redis://password@host' },
    { db: -1 },
    { port: 0 },
  ])
    assert.throws(() => normalizeTestClaimRedisEndpoint(options));
});

test('broker serializes simultaneous updates and acknowledges durable intent before allocation', async () => {
  const f = fixture();
  let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
  try {
    const { claimPath } = await createTestClaim(f.projectPath, runId, 'unit', owner);
    broker = await startTestClaimBroker(claimPath);
    const env = transportEnv(broker.env);
    const inventory = buildTestClaimResourceInventory(appFixture(f.projectPath));
    await sendTestClaimEvent(env, { type: 'inventory', ...inventory });
    const db = inventory.databases[0];
    await Promise.all(
      Array.from({ length: 15 }, (_, i) =>
        sendTestClaimEvent(env, {
          type: 'database',
          database: db,
          name: `${db.prefix}20261013-0102${String(i).padStart(2, '0')}`,
          stage: 'intent',
        }),
      ),
    );
    const manifest = await loadTestClaim(claimPath);
    assert.equal(manifest.databases[0].creations.length, 15);
    assert.equal(readFileSync(claimPath, 'utf8').includes(broker.env.VONA_TEST_CLAIM_TOKEN), false);
    assert.equal(readFileSync(claimPath, 'utf8').includes('SECRET'), false);
    await assert.rejects(
      sendTestClaimEvent(
        { ...env, VONA_TEST_CLAIM_TOKEN: '0'.repeat(64) },
        { type: 'status', status: 'failed' },
      ),
      /registration failed/,
    );
    await assert.rejects(
      sendTestClaimEvent(env, {
        type: 'database',
        database: db,
        name: 'development',
        stage: 'intent',
      }),
    );
    assert.equal((await loadTestClaim(claimPath)).databases[0].creations.length, 15);
  } finally {
    await broker?.close();
    f.dispose();
  }
});

test('database confirmations and process registration cannot precede allocation intent', async () => {
  const f = fixture();
  let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
  try {
    const { claimPath } = await createTestClaim(f.projectPath, runId, 'unit', owner);
    broker = await startTestClaimBroker(claimPath);
    const inventory = buildTestClaimResourceInventory(appFixture(f.projectPath));
    await broker.update({ type: 'inventory', ...inventory });
    const db = inventory.databases[0];
    const name = `${db.prefix}20261013-010203`;
    await assert.rejects(
      broker.update({ type: 'database', database: db, name, stage: 'created' }),
      /write-ahead/,
    );
    await broker.update({ type: 'database', database: db, name, stage: 'intent' });
    await broker.update({ type: 'database', database: db, name, stage: 'created' });
    await assert.rejects(
      broker.update({ type: 'database', database: db, name, stage: 'intent' }),
      /regression/,
    );
    const proc = {
      id: 'browser-uuid',
      role: 'browser',
      pid: 42,
      pgid: 42,
      startTime: 'start',
      host: hostname(),
    };
    await assert.rejects(
      broker.update({ type: 'process', process: { ...proc, stage: 'registered' } }),
      /write-ahead/,
    );
    const tmp = path.join(getTestClaimPaths(f.projectPath, runId).dataRoot, 'tmp');
    await broker.update({
      type: 'process',
      process: { id: proc.id, role: proc.role, stage: 'pending', profilePath: tmp },
    });
    await assert.rejects(
      broker.update({ type: 'process', process: { ...proc, stage: 'drained', profilePath: tmp } }),
      /Pending/,
    );
    await broker.update({
      type: 'process',
      process: { ...proc, stage: 'registered', profilePath: path.join(tmp, 'browser-profile') },
    });
    await assert.rejects(
      broker.update({ type: 'process', process: { ...proc, pid: 43, stage: 'drained' } }),
      /identity/,
    );
    await broker.update({
      type: 'process',
      process: { id: proc.id, role: proc.role, stage: 'drained' },
    });
    assert.equal((await loadTestClaim(claimPath)).processes[0].stage, 'drained');
  } finally {
    await broker?.close();
    f.dispose();
  }
});

test('cleanup editor persists partial progress but may not replace claim identity', async () => {
  const f = fixture();
  try {
    const { claimPath, manifest } = await createTestClaim(f.projectPath, runId, 'unit', owner);
    manifest.status = 'cleaning';
    manifest.cleanup.processes = true;
    manifest.locals[0].stage = 'released';
    await writeTestClaim(claimPath, manifest);
    assert.deepEqual(await loadTestClaim(claimPath), manifest);
    await assert.rejects(
      writeTestClaim(claimPath, { ...manifest, owner: { ...owner, pid: 1 } }),
      /immutable/,
    );
  } finally {
    f.dispose();
  }
});

test('manual isolation remains transport-free, partial and non-test transport fail closed', async () => {
  assert.equal(hasTestClaimTransport({}), false);
  await sendTestClaimEvent({}, { type: 'status', status: 'running' });
  assert.throws(
    () => hasTestClaimTransport({ VONA_TEST_CLAIM_TOKEN: '0'.repeat(64) }),
    /Incomplete/,
  );
  assert.throws(
    () =>
      hasTestClaimTransport({
        VONA_TEST_CLAIM_URL: 'http://127.0.0.1:1/event',
        VONA_TEST_CLAIM_TOKEN: '0'.repeat(64),
      }),
    /identity/,
  );
  assert.throws(
    () =>
      hasTestClaimTransport({
        ...transportEnv({
          VONA_TEST_CLAIM_URL: 'http://remote:1/event',
          VONA_TEST_CLAIM_TOKEN: '0'.repeat(64),
        }),
      }),
    /Invalid/,
  );
  await assert.rejects(
    sendTestClaimEvent(
      transportEnv({
        VONA_TEST_CLAIM_URL: 'http://127.0.0.1:1/event',
        VONA_TEST_CLAIM_TOKEN: '0'.repeat(64),
      }),
      { type: 'status', status: 'running' },
    ),
    /registration failed/,
  );
});

test(
  'managed resource gates reject drift and allocation before broker acknowledgement',
  { concurrency: false },
  async () => {
    const f = fixture();
    const old = {
      META_MODE: process.env.META_MODE,
      VONA_TEST_RUN_ID: process.env.VONA_TEST_RUN_ID,
      VONA_TEST_CLAIM_URL: process.env.VONA_TEST_CLAIM_URL,
      VONA_TEST_CLAIM_TOKEN: process.env.VONA_TEST_CLAIM_TOKEN,
    };
    let broker: Awaited<ReturnType<typeof startTestClaimBroker>> | undefined;
    try {
      const { claimPath } = await createTestClaim(f.projectPath, runId, 'unit', owner);
      broker = await startTestClaimBroker(claimPath);
      Object.assign(process.env, transportEnv(broker.env));
      const app = appFixture(f.projectPath);
      const client = app.config.database.clients.pg;
      assert.throws(() => assertTestClaimDatabaseClient(app, 'pg', client), /Unregistered/);
      await registerTestClaimResourceInventory(app);
      assertTestClaimDatabaseClient(app, 'pg', client);
      assert.throws(() => assertTestClaimDatabaseClient(app, 'dynamic_admin', client), /endpoint/);
      assert.throws(
        () =>
          assertTestClaimDatabaseClient(app, 'pg', {
            ...client,
            connection: { ...client.connection, port: 5433 },
          }),
        /Unregistered/,
      );
      const plan = buildTestClaimResourceInventory(app).databases[0];
      const name = `${plan.prefix}20261013-010203`;
      const allocatedClient = { ...client, connection: { ...client.connection, database: name } };
      const aliases = ['dynamic_123', 'index-recovery-test'];
      assert.throws(() => assertTestClaimDatabaseClient(app, 'pg', allocatedClient), /allocation/);
      for (const alias of aliases) {
        assert.throws(
          () => assertTestClaimDatabaseClient(app, alias, allocatedClient),
          /allocation/,
        );
      }
      await registerTestClaimDatabaseCreation(app, client, name, 'intent');
      assertTestClaimDatabaseClient(app, 'pg', allocatedClient);
      for (const alias of aliases) assertTestClaimDatabaseClient(app, alias, allocatedClient);
      assert.equal((await loadTestClaim(claimPath)).databases[0].creations[0].stage, 'intent');
      await registerTestClaimDatabaseCreation(app, client, name, 'created');
      for (const alias of aliases) {
        assertTestClaimDatabaseClient(app, alias, allocatedClient);
        assert.throws(
          () =>
            assertTestClaimDatabaseClient(app, alias, {
              ...allocatedClient,
              connection: { ...allocatedClient.connection, port: 5433 },
            }),
          /endpoint/,
        );
        assert.throws(
          () =>
            assertTestClaimDatabaseClient(app, alias, {
              ...allocatedClient,
              connection: {
                ...allocatedClient.connection,
                database: `${plan.prefix}20261013-010205`,
              },
            }),
          /allocation/,
        );
      }
      const isolatePlan = buildTestClaimResourceInventory(app).databases[1];
      const isolateName = `${isolatePlan.prefix}20261013-010203`;
      await registerTestClaimDatabaseCreation(app, client, isolateName, 'intent');
      assertTestClaimDatabaseClient(app, 'dynamic_isolated', {
        ...client,
        connection: { ...client.connection, database: isolateName },
      });
      assert.ok((await loadTestClaim(claimPath)).databases.every(item => item.clientName === 'pg'));
      const sqliteApp = appFixture(f.projectPath);
      const sqliteClient = { client: 'better-sqlite3', connection: { filename: '' } };
      sqliteApp.config.database = {
        ...sqliteApp.config.database,
        defaultClient: 'sqlite3',
        clients: { sqlite3: sqliteClient } as any,
      };
      sqliteApp.config.instance.instances = {} as any;
      await registerTestClaimResourceInventory(sqliteApp);
      const sqlitePlan = buildTestClaimResourceInventory(sqliteApp).databases[0];
      const copyName = `${sqlitePlan.prefix}20261013-010206`;
      const copyClient = {
        ...sqliteClient,
        connection: {
          filename: path.join(getTestClaimPaths(f.projectPath, runId).sqliteRoot, `${copyName}.db`),
        },
      };
      assert.throws(
        () => assertTestClaimDatabaseClient(sqliteApp, 'index-recovery-copy', copyClient),
        /allocation/,
      );
      await registerTestClaimDatabaseCreation(sqliteApp, sqliteClient, copyName, 'intent');
      assertTestClaimDatabaseClient(sqliteApp, 'index-recovery-copy', copyClient);
      assert.throws(
        () =>
          assertTestClaimDatabaseClient(sqliteApp, 'index-recovery-copy', {
            ...copyClient,
            connection: { filename: `${copyName}.db` },
          }),
        /allocation/,
      );
      assert.throws(
        () => assertTestClaimDatabaseClient(sqliteApp, 'dynamic_admin', sqliteClient),
        /endpoint/,
      );
      await registerTestClaimDatabaseCreation(sqliteApp, sqliteClient, copyName, 'created');
      const manifest = await loadTestClaim(claimPath);
      assert.equal(
        manifest.databases.find(item => item.clientName === 'sqlite3')!.creations[0].stage,
        'created',
      );
      const redis = { host: '127.0.0.1', port: 6379, db: 2, keyPrefix: `cache_${app.name}_local:` };
      assertTestClaimRedisClient(app, 'cache', redis);
      assert.throws(
        () => assertTestClaimRedisClient(app, 'cache', { ...redis, db: 0 }),
        /Unregistered/,
      );
      assert.throws(
        () => assertTestClaimRedisClient(app, 'cache', { ...redis, keyPrefix: 'cache_' }),
        /prefix/,
      );
      await broker.close();
      broker = undefined;
      await assert.rejects(
        registerTestClaimDatabaseCreation(app, client, `${plan.prefix}20261013-010204`, 'intent'),
        /registration failed/,
      );
      assert.throws(
        () =>
          assertTestClaimDatabaseClient(app, 'dynamic_rejected', {
            ...client,
            connection: { ...client.connection, database: `${plan.prefix}20261013-010204` },
          }),
        /allocation/,
      );
    } finally {
      for (const [key, value] of Object.entries(old)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      await broker?.close();
      f.dispose();
    }
  },
);
