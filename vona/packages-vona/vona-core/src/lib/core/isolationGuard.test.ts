import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import type { VonaApplication } from './application.ts';

import {
  assertIsolatedTestConfig,
  assertIsolatedTestDatabaseClient,
  withIsolatedTestDatabaseDiscovery,
} from './isolationGuard.ts';
import {
  getDatabaseTestPrefix,
  getTestAppName,
  resolveTestRunId,
  resolveVonaLocalPaths,
  TEST_RUN_OWNER_FILE,
} from './testIsolation.ts';

const runId = '20261014010203-a1b2c3d4';
const appName = `cabtest${runId}`;
const timestamp = '20261012-123456';

type Client = {
  client: string;
  connection: Record<string, unknown>;
  connectionPool?: unknown;
};

function createFixture() {
  const root = mkdtempSync(path.join(realpathSync(tmpdir()), 'cabloy-orm-isolation-'));
  const projectPath = path.join(root, 'vona');
  const paths = resolveVonaLocalPaths(projectPath, 'test', runId);
  for (const ownedRoot of [paths.dataRoot, paths.generatedRoot]) {
    mkdirSync(ownedRoot, { recursive: true });
    writeFileSync(path.join(ownedRoot, TEST_RUN_OWNER_FILE), `${runId}\n`);
  }
  const client: Client = {
    client: 'pg',
    connection: { database: 'postgres', host: '127.0.0.1', port: 5432, user: 'isolated' },
  };
  const config = {
    server: {
      publicDir: paths.publicRoot,
      workers: 1,
      listen: { hostname: '127.0.0.1', port: 42178 },
      serve: { protocol: 'http', host: '127.0.0.1:42178' },
    },
    logger: { baseDir: paths.logsRoot },
    database: {
      testDatabase: true,
      base: {} as { connection?: unknown; connectionPool?: unknown },
      defaultClient: 'pg',
      clients: { pg: client } as Record<string, Client>,
    },
    instance: {
      instances: {} as Record<string, false | { isolate: boolean; isolateClient: string }>,
    },
    redis: { base: {}, clients: { default: { keyPrefix: true } } },
  };
  const app = {
    projectPath,
    name: appName,
    meta: {
      appReady: false,
      env: { META_MODE: 'test', VONA_TEST_RUN_ID: runId, SERVER_LISTEN_PORT: '42178' },
    },
    config,
  } as unknown as VonaApplication;
  return { root, paths, app, config, client };
}

function disposable(scope = 'share') {
  return `${getDatabaseTestPrefix(appName, scope)}${timestamp}`;
}

test('run IDs require a real UTC second and isolate resources with the random suffix', () => {
  const siblingId = '20261014010203-d4e5f6a7';
  const first = resolveVonaLocalPaths('/project/vona', 'test', runId);
  const second = resolveVonaLocalPaths('/project/vona', 'test', siblingId);
  assert.equal(first.dataDir, '.app-test-20261014010203-a1b2c3d4');
  assert.equal(first.generatedDir, '.vona-test-20261014010203-a1b2c3d4');
  assert.notEqual(first.dataDir, second.dataDir);
  assert.notEqual(getTestAppName(runId), getTestAppName(siblingId));
  assert.notEqual(
    getDatabaseTestPrefix(getTestAppName(runId), 'share'),
    getDatabaseTestPrefix(getTestAppName(siblingId), 'share'),
  );
  for (const invalid of [
    '0123456789abcdef',
    '20261014010203',
    '20260230010203-a1b2c3d4',
    '20261014250203-a1b2c3d4',
    '20261014010203-A1B2C3D4',
    '20261014010203-a1b2c3',
  ]) {
    assert.throws(() => resolveTestRunId('test', invalid), /UTC timestamp plus eight hex digits/);
  }
  assert.throws(() => resolveTestRunId('dev', runId), /requires test mode/);
  assert.equal(resolveTestRunId('test', runId), runId);
});

test('administrative discovery accepts only the configured client and target', async () => {
  const fixture = createFixture();
  try {
    const { app, client } = fixture;
    assertIsolatedTestConfig(app);
    assert.throws(() => assertIsolatedTestDatabaseClient(app, 'pg', client), /namespace/);
    await withIsolatedTestDatabaseDiscovery(app, 'pg', client, async () => {
      assert.doesNotThrow(() => assertIsolatedTestDatabaseClient(app, 'pg', client));
      const target = { ...client, connection: { ...client.connection, database: disposable() } };
      assert.doesNotThrow(() => assertIsolatedTestDatabaseClient(app, 'pg', target));
      for (const connection of [
        { ...client.connection, host: 'untrusted.example' },
        { ...client.connection, port: 5433 },
        { ...client.connection, user: 'another-user' },
        { ...client.connection, database: 'development' },
      ]) {
        assert.throws(
          () => assertIsolatedTestDatabaseClient(app, 'pg', { ...client, connection }),
          /namespace/,
        );
      }
      assert.throws(() => assertIsolatedTestDatabaseClient(app, 'dynamic_1', client), /namespace/);
      assert.throws(
        () =>
          assertIsolatedTestDatabaseClient(app, 'pg', {
            ...client,
            connection: {
              ...client.connection,
              connectionString: 'postgres://untrusted.example/dev',
            },
          }),
        /connection URL/,
      );
      assert.throws(
        () =>
          assertIsolatedTestDatabaseClient(app, 'pg', {
            ...client,
            connectionPool: {},
          }),
        /external pool/,
      );
      assert.throws(
        () =>
          assertIsolatedTestDatabaseClient(app, 'pg', {
            ...client,
            connection: () => ({ database: 'postgres' }),
          }),
        /explicit connection target/,
      );
    });
    assert.throws(() => assertIsolatedTestDatabaseClient(app, 'pg', client), /namespace/);
    assert.throws(
      () =>
        assertIsolatedTestDatabaseClient(app, 'pg', {
          ...client,
          connection: { database: 'vona-test-unowned-s-20261012-123456' },
        }),
      /namespace/,
    );
    assert.doesNotThrow(() =>
      assertIsolatedTestDatabaseClient(app, 'dynamic_1', {
        client: 'pg',
        connection: { database: disposable() },
      }),
    );
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('discovery rejects unconfigured clients and pinning changes', async () => {
  const fixture = createFixture();
  try {
    const { app, client, config } = fixture;
    config.database.clients.unused = { client: 'mysql2', connection: { database: 'mysql' } };
    await assert.rejects(
      withIsolatedTestDatabaseDiscovery(
        app,
        'unused',
        config.database.clients.unused,
        async () => {},
      ),
      /unconfigured database client/,
    );
    await assert.rejects(
      withIsolatedTestDatabaseDiscovery(
        app,
        'pg',
        {
          ...client,
          connection: { ...client.connection, host: 'untrusted.example' },
        },
        async () => {},
      ),
      /unconfigured database client/,
    );
    await withIsolatedTestDatabaseDiscovery(app, 'pg', client, async () => {
      const originalConnection = client.connection;
      config.database.clients.pg.connection = { ...client.connection, host: 'untrusted.example' };
      assert.throws(
        () =>
          assertIsolatedTestDatabaseClient(app, 'pg', {
            ...client,
            connection: originalConnection,
          }),
        /namespace/,
      );
      config.database.clients.pg.connection = originalConnection;
    });
    (app.meta as { appReady: boolean }).appReady = true;
    await assert.rejects(
      withIsolatedTestDatabaseDiscovery(app, 'pg', client, async () => {}),
      /after startup/,
    );
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('unused configured clients, base overrides, and URL targets fail before cleanup', () => {
  const fixture = createFixture();
  try {
    const { app, config } = fixture;
    for (const connection of [
      'postgres://untrusted.example/dev',
      () => ({ database: 'postgres' }),
      { connectionString: 'postgres://untrusted.example/dev' },
    ]) {
      config.database.base.connection = connection;
      assert.throws(() => assertIsolatedTestConfig(app), /base connection target or pool/);
    }
    delete config.database.base.connection;
    config.database.base.connectionPool = {};
    assert.throws(() => assertIsolatedTestConfig(app), /base connection target or pool/);
    delete config.database.base.connectionPool;
    config.database.clients.unused = { client: 'pg', connection: { database: 'postgres' } };
    assert.doesNotThrow(() => assertIsolatedTestConfig(app));
    for (const connection of [
      { database: 'postgres', connectionString: 'postgres://untrusted.example/dev' },
      { database: 'mysql', uri: 'mysql://untrusted.example/dev' },
      () => ({ database: 'postgres' }),
    ]) {
      config.database.clients.unused.connection = connection as Record<string, unknown>;
      assert.throws(() => assertIsolatedTestConfig(app), /external target or pool: unused/);
    }
    config.database.clients.unused.connection = { database: 'postgres' };
    config.database.clients.unused.connectionPool = {};
    assert.throws(() => assertIsolatedTestConfig(app), /external target or pool: unused/);
    delete config.database.clients.unused.connectionPool;
    assert.doesNotThrow(() => assertIsolatedTestConfig(app));
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('mysql URL overrides and SQLite escapes are rejected at construction', () => {
  const fixture = createFixture();
  try {
    const { app, paths } = fixture;
    assert.throws(
      () =>
        assertIsolatedTestDatabaseClient(app, 'dynamic_mysql', {
          client: 'mysql2',
          connection: { database: disposable(), uri: 'mysql://untrusted.example/dev' },
        }),
      /connection URL/,
    );
    const filename = path.join(paths.sqliteRoot, `${disposable()}.db`);
    assert.doesNotThrow(() =>
      assertIsolatedTestDatabaseClient(app, 'dynamic_sqlite', {
        client: 'better-sqlite3',
        connection: { filename },
      }),
    );
    assert.throws(
      () =>
        assertIsolatedTestDatabaseClient(app, 'dynamic_sqlite', {
          client: 'better-sqlite3',
          connection: { filename: path.join(fixture.root, `${disposable()}.db`) },
        }),
      /path escapes/,
    );
    mkdirSync(paths.sqliteRoot, { recursive: true });
    const linked = path.join(paths.sqliteRoot, `${disposable()}.db`);
    symlinkSync(path.join(fixture.root, 'development.db'), linked);
    assert.throws(
      () =>
        assertIsolatedTestDatabaseClient(app, 'dynamic_sqlite', {
          client: 'better-sqlite3',
          connection: { filename: linked },
        }),
      /symlink/,
    );
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});
