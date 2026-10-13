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
function fixture() {
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
        clientName: 'pg',
        scope: 'share',
        prefix,
        endpoint: {
          dialect: 'pg',
          transport: 'tcp',
          host: 'override-db',
          port: 6543,
          tls: false,
          adminDatabase: 'postgres',
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
      clients: { pg: { client: 'pg', connection: { database: 'postgres', user: 'user' } } },
    },
    redis: {
      base: { host: 'base-redis', port: 6379, db: 0, password: 'memory-only-secret' },
      clients: { cache: { keyPrefix: true } },
    },
    instance: { instances: {} },
  };
  const override = {
    database: { clients: { pg: { connection: { host: 'override-db', port: 6543 } } } },
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
