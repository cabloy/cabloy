import type { TestClaimManifest } from 'vona-core';

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  getTestClaimCreatedAt,
  getTestClaimPaths,
  getTestClaimRedisPrefix,
  getDatabaseTestPrefix,
  getTestAppName,
} from 'vona-core';

import type { TestCleanupConfigDependencies } from './resolveTestCleanupConfig.ts';

import { resolveTestCleanupConfig } from './resolveTestCleanupConfig.ts';

const runId = '20261011010203-deadbeef';
const projectPath = '/canonical-checkout/vona';
function fixture(dialect: 'pg' | 'mysql' = 'pg') {
  const prefix = getDatabaseTestPrefix(getTestAppName(runId), 'share');
  const paths = getTestClaimPaths(projectPath, runId);
  const claim: TestClaimManifest = {
    version: 1,
    runId,
    projectPath,
    createdAt: getTestClaimCreatedAt(runId),
    kind: 'unit',
    owner: { pid: 1, startTime: 'fake', host: 'fake' },
    status: 'failed',
    locals: [
      { kind: 'generated', path: paths.generatedRoot, stage: 'owned' },
      { kind: 'data', path: paths.dataRoot, stage: 'owned' },
    ],
    databases: [
      {
        clientName: dialect,
        scope: 'share',
        prefix,
        endpoint: {
          dialect,
          transport: 'tcp',
          host: 'override-db',
          port: 6543,
          tls: false,
          adminDatabase: dialect === 'pg' ? 'postgres' : 'mysql',
        },
        creations: [{ name: `${prefix}20261011-010203`, stage: 'intent' }],
      },
    ],
    redis: [
      {
        clientName: 'cache',
        ...getTestClaimRedisPrefix(runId, 'cache')!,
        endpoint: { transport: 'tcp', host: 'override-redis', port: 6380, tls: false, db: 4 },
        released: false,
      },
    ],
    processes: [],
    cleanup: { processes: false, databases: false, redis: false, locals: false },
  };
  const base = {
    meta: { mode: 'test', flavor: 'normal' },
    database: {
      testDatabase: true,
      defaultClient: 'pg',
      base: { connection: { host: 'base-db', port: 5432, password: 'memory-only-secret' } },
      clients: {
        [dialect]: {
          client: dialect,
          connection: { database: dialect === 'pg' ? 'postgres' : 'mysql', user: 'user' },
        },
      },
    },
    redis: {
      base: { host: 'base-redis', port: 6379, db: 0, password: 'memory-only-secret' },
      clients: { cache: { keyPrefix: true } },
    },
    instance: { instances: {} },
  };
  const override = {
    database: { clients: { [dialect]: { connection: { host: 'override-db', port: 6543 } } } },
    redis: { clients: { cache: { host: 'override-redis', port: 6380, db: 4 } } },
  };
  const env = {
    NODE_ENV: 'test' as const,
    META_MODE: 'test' as const,
    META_FLAVOR: 'normal' as const,
    VONA_TEST_RUN_ID: runId,
    APP_NAME: getTestAppName(runId),
  };
  const evaluated: string[] = [];
  const deps: TestCleanupConfigDependencies = {
    loadEnvs: () => env,
    files: ['default', 'test', 'local'],
    async loadConfig(file) {
      return {
        default: async () => {
          evaluated.push(file);
          return file === 'default' ? base : file === 'local' ? override : {};
        },
      };
    },
    createApp: currentEnv =>
      ({
        options: { projectPath, configResolutionOnly: true },
        projectPath,
        name: currentEnv.APP_NAME,
        meta: { env: currentEnv },
      }) as any,
  };
  return { claim, deps, base, override, env, evaluated };
}

test('current source config evaluation and ordered deep precedence, credentials stay memory-only', async () => {
  const f = fixture();
  const resolved = await resolveTestCleanupConfig(f.claim, f.deps);
  assert.deepEqual(f.evaluated, ['default', 'test', 'local']);
  assert.equal(resolved.databaseOptions.get('pg')!.connection.host, 'override-db');
  assert.equal(resolved.databaseOptions.get('pg')!.connection.password, 'memory-only-secret');
  assert.equal(resolved.redisOptions.get('cache')!.host, 'override-redis');
  assert.equal(resolved.redisOptions.get('cache')!.keyPrefix, undefined);
  assert.ok(!JSON.stringify(f.claim).includes('memory-only-secret'));
});

test('historical pg/mysql clients resolve after switching the default to sqlite3', async () => {
  for (const dialect of ['pg', 'mysql'] as const) {
    const f = fixture(dialect);
    f.base.database.defaultClient = 'sqlite3';
    Object.assign(f.base.database.clients, { sqlite3: { client: 'better-sqlite3' } });
    const resolved = await resolveTestCleanupConfig(f.claim, f.deps);
    assert.deepEqual([...resolved.databaseOptions.keys()], [dialect]);
    assert.equal(resolved.databaseOptions.get(dialect)!.client, dialect);
    assert.equal(resolved.databaseOptions.get(dialect)!.connection.host, 'override-db');
    assert.equal(
      resolved.databaseOptions.get(dialect)!.connection.database,
      dialect === 'pg' ? 'postgres' : 'mysql',
    );

    f.override.database.clients[dialect].connection.host = 'different';
    await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), {
      reasonCode: 'databaseEndpoint',
      message: 'cleanup database endpoint drift',
    });
    delete f.base.database.clients[dialect];
    delete f.override.database.clients[dialect];
    await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), {
      reasonCode: 'databaseClient',
      message: 'cleanup database client missing',
    });
  }
});

test('historical defaults rebuild derived isolate clients without changing the loaded environment', async () => {
  for (const dialect of ['pg', 'mysql'] as const) {
    const f = fixture(dialect);
    const loadedEnv = { ...f.env, DATABASE_DEFAULT_CLIENT: 'sqlite3' };
    f.deps.loadEnvs = () => loadedEnv;
    const prefix = getDatabaseTestPrefix(getTestAppName(runId), 'isolate-isolateTest');
    f.claim.databases.push({
      ...f.claim.databases[0],
      clientName: 'isolateTest',
      scope: 'isolate-isolateTest',
      prefix,
      creations: [{ name: `${prefix}20261011-010203`, stage: 'intent' }],
    });
    // The mysql config key selects mysql2, as in the application config.
    if (dialect === 'mysql') {
      f.base.database.clients.mysql.client = 'mysql2' as any;
      for (const database of f.claim.databases) database.endpoint.dialect = 'mysql2';
    }
    let isolateClient = 'isolateTest';
    let isolateHost = 'override-db';
    const processDefault = process.env.DATABASE_DEFAULT_CLIENT;
    const loadConfig = f.deps.loadConfig;
    f.deps.loadConfig = async file => {
      const loader = await loadConfig(file);
      return {
        default: async app => {
          const config = await loader.default(app);
          if (file !== 'local') return config;
          const selected = (app.meta.env as unknown as typeof loadedEnv).DATABASE_DEFAULT_CLIENT;
          assert.equal(selected, dialect);
          const historical = {
            ...f.base.database.clients[dialect],
            connection: {
              ...f.base.database.clients[dialect].connection,
              ...f.override.database.clients[dialect].connection,
              host: isolateHost,
            },
          };
          return {
            ...f.override,
            database: {
              ...f.override.database,
              defaultClient: selected,
              clients: { ...f.override.database.clients, isolateTest: historical },
            },
            instance: { instances: { isolateTest: { isolate: true, isolateClient } } },
          };
        },
      };
    };
    const resolved = await resolveTestCleanupConfig(f.claim, f.deps);
    assert.deepEqual([...resolved.databaseOptions.keys()], [dialect, 'isolateTest']);
    assert.deepEqual(
      resolved.databaseOptions.get('isolateTest'),
      resolved.databaseOptions.get(dialect),
    );
    assert.equal(loadedEnv.DATABASE_DEFAULT_CLIENT, 'sqlite3');
    assert.equal(process.env.DATABASE_DEFAULT_CLIENT, processDefault);

    isolateHost = 'different';
    await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), {
      reasonCode: 'databaseEndpoint',
    });
    isolateHost = 'override-db';
    isolateClient = 'different';
    await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), {
      reasonCode: 'databaseScope',
    });
  }
});

test('namespace and isolate-client protections survive a default-client switch', async () => {
  const f = fixture();
  f.base.database.defaultClient = 'sqlite3';
  f.claim.databases[0].prefix += 'foreign';
  await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), {
    reasonCode: 'databaseNamespace',
  });
  f.claim.databases[0].scope = 'isolate-example';
  f.claim.databases[0].prefix = getDatabaseTestPrefix(getTestAppName(runId), 'isolate-example');
  f.claim.databases[0].creations[0].name = `${f.claim.databases[0].prefix}20261011-010203`;
  await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), {
    reasonCode: 'databaseScope',
  });
});

test('current configuration drift and unsupported targets fail before any driver access', async () => {
  for (const mutate of [
    (f: ReturnType<typeof fixture>) => {
      f.override.database.clients.pg.connection.host = 'different';
    },
    (f: ReturnType<typeof fixture>) => {
      f.override.redis.clients.cache.db = 5;
    },
    (f: ReturnType<typeof fixture>) => {
      f.base.database.clients.pg.connection.database = 'development';
    },
    (f: ReturnType<typeof fixture>) => {
      f.base.redis.clients.cache.keyPrefix = false as any;
    },
    (f: ReturnType<typeof fixture>) => {
      (f.base.database.clients.pg.connection as any).connectionString = 'secret://different';
    },
    (f: ReturnType<typeof fixture>) => {
      (f.base.redis.clients.cache as any).sentinels = [];
    },
  ]) {
    const f = fixture();
    mutate(f);
    await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps));
  }
});

test('cleanup source-only resolution rejects wrong identity and does not call lifecycle loaders', async () => {
  const f = fixture();
  const resolved = await resolveTestCleanupConfig(f.claim, f.deps);
  assert.equal(resolved.databaseOptions.size, 1);
  f.env.APP_NAME = 'development';
  await assert.rejects(resolveTestCleanupConfig(f.claim, f.deps), /identity mismatch/);
});
