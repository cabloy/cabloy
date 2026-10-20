import { lstat, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { VonaApplication } from './application.ts';
import type { TestClaimDatabasePlan, TestClaimRedis } from './testClaim.ts';

import { assertIsolatedTestConfig, assertIsolatedTestPath } from './isolationGuard.ts';
import {
  buildTestClaimResourceInventory,
  mergeTestClaimDatabaseOptions,
  mergeTestClaimRedisOptions,
} from './testClaim.ts';
import { resolveVonaLocalPaths } from './testIsolation.ts';
import { requiresFreshTestResources } from './testStrictMode.ts';

export { requiresFreshTestResources, TEST_REQUIRE_FRESH_RESOURCES_ENV } from './testStrictMode.ts';

const freshApps = new WeakSet<VonaApplication>();

export function assertFreshTestResourcesReady(app: VonaApplication) {
  if (!requiresFreshTestResources()) return;
  if (!freshApps.has(app)) throw new Error('Strict test resource freshness was not established');
}

export interface TestFreshnessDependencies {
  databaseExists(plan: TestClaimDatabasePlan, options: Record<string, any>): Promise<boolean>;
  redisExists(resource: TestClaimRedis, options: Record<string, any>): Promise<boolean>;
}

async function assertEmptyDirectory(directory: string) {
  assertIsolatedTestPath(directory, directory);
  try {
    if (!(await lstat(directory)).isDirectory() || (await readdir(directory)).length !== 0) {
      throw new Error('Strict test local resource is not fresh');
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

// Runs after configuration, before module loading (including worker-alive Redis writes).
// This is a freshness snapshot, not a lease against independent external writers.
export async function assertFreshTestResources(
  app: VonaApplication,
  dependencies?: TestFreshnessDependencies,
) {
  if (!requiresFreshTestResources()) return;
  if (!app.meta.env.VONA_TEST_RUN_ID || app.meta.appReady || freshApps.has(app)) {
    throw new Error('Strict test freshness requires a new isolated startup');
  }
  assertIsolatedTestConfig(app);
  const config = app.config as typeof app.config & {
    database: {
      base: Record<string, unknown>;
      clients: Record<string, Record<string, unknown>>;
    };
    redis: {
      base: Record<string, unknown>;
      clients: Record<string, Record<string, unknown>>;
    };
  };
  const paths = resolveVonaLocalPaths(app.projectPath, 'test', app.meta.env.VONA_TEST_RUN_ID);
  for (const directory of [paths.publicRoot, paths.runtimeRoot, paths.sqliteRoot]) {
    await assertEmptyDirectory(directory);
  }
  const inventory = buildTestClaimResourceInventory(app);
  const readers = dependencies ?? createFreshnessDependencies(app.projectPath);
  try {
    for (const plan of inventory.databases) {
      if (plan.endpoint.dialect === 'better-sqlite3') continue;
      const options = mergeTestClaimDatabaseOptions(
        config.database.base,
        undefined,
        config.database.clients[plan.clientName],
      );
      if (await readers.databaseExists(plan, options)) {
        throw new Error('Preexisting strict test database namespace');
      }
    }
    for (const resource of inventory.redis) {
      const options = mergeTestClaimRedisOptions(
        config.redis.base,
        config.redis.clients[resource.clientName],
      );
      if (await readers.redisExists(resource, options)) {
        throw new Error('Preexisting strict test Redis namespace');
      }
    }
  } catch {
    // Driver messages may embed credentials, database names or Redis keys.
    throw new Error('Strict test resource freshness check failed');
  }
  freshApps.add(app);
}

export interface FreshnessSqlConnection {
  raw(sql: string, bindings: unknown[]): Promise<any>;
  destroy(): Promise<unknown>;
}

export async function hasFreshnessDatabase(
  connection: FreshnessSqlConnection,
  plan: TestClaimDatabasePlan,
) {
  try {
    const pg = plan.endpoint.dialect === 'pg';
    if (!pg && !['mysql', 'mysql2'].includes(plan.endpoint.dialect)) {
      throw new Error('Unsupported freshness database dialect');
    }
    const result = await connection.raw(
      pg
        ? 'select datname from pg_database where left(datname, ?) = ? limit 1'
        : 'select schema_name from information_schema.schemata where left(schema_name, ?) = ? limit 1',
      [plan.prefix.length, plan.prefix],
    );
    const rows = pg ? result?.rows : result?.[0];
    if (!Array.isArray(rows)) throw new Error('Invalid freshness database response');
    return rows.length !== 0;
  } finally {
    await connection.destroy();
  }
}

export interface FreshnessRedisConnection {
  scan(
    cursor: string,
    match: 'MATCH',
    pattern: string,
    count: 'COUNT',
    size: number,
  ): Promise<unknown>;
}

export async function hasFreshnessRedis(
  connection: FreshnessRedisConnection,
  prefix: string,
  maxScans = 10000,
) {
  if (!prefix || !Number.isSafeInteger(maxScans) || maxScans < 1) {
    throw new Error('Invalid Redis freshness bounds');
  }
  const pattern = `${prefix.replace(/[\\*?[\]]/g, '\\$&')}*`;
  let cursor = '0';
  for (let scans = 0; scans < maxScans; scans++) {
    const result = await connection.scan(cursor, 'MATCH', pattern, 'COUNT', 128);
    if (
      !Array.isArray(result) ||
      result.length !== 2 ||
      typeof result[0] !== 'string' ||
      !/^\d+$/.test(result[0]) ||
      !Array.isArray(result[1]) ||
      result[1].some(key => typeof key !== 'string' || !key.startsWith(prefix))
    ) {
      throw new Error('Invalid Redis freshness response');
    }
    if (result[1].length !== 0) return true;
    cursor = result[0];
    if (cursor === '0') return false;
  }
  throw new Error('Redis freshness scan limit exceeded');
}

export function createFreshnessDependencies(
  projectPath: string,
  load: (name: string) => any = createRequire(path.join(projectPath, 'package.json')),
): TestFreshnessDependencies {
  return {
    async databaseExists(plan, options) {
      const endpoint = plan.endpoint;
      const source = options.connection;
      const target: Record<string, any> = {
        user: source.user,
        password: source.password,
        ssl: source.ssl,
        database: endpoint.adminDatabase,
        connectionTimeoutMillis: 10000,
        connectTimeout: 10000,
      };
      if (endpoint.transport === 'tcp') {
        target.host = endpoint.host;
        target.port = endpoint.port;
      } else if (endpoint.dialect === 'pg') {
        target.host = endpoint.socketPath;
        target.port = endpoint.port;
      } else {
        target.socketPath = endpoint.socketPath;
      }
      const knex = load('knex');
      return await hasFreshnessDatabase(
        knex({
          client: endpoint.dialect,
          connection: target,
          pool: { min: 0, max: 1 },
          acquireConnectionTimeout: 10000,
        }),
        plan,
      );
    },
    async redisExists(resource, options) {
      const endpoint = resource.endpoint;
      const target =
        endpoint.transport === 'socket'
          ? { path: endpoint.socketPath }
          : { host: endpoint.host, port: endpoint.port };
      const Redis = load('ioredis').Redis;
      const connection = new Redis({
        ...target,
        username: options.username,
        password: options.password,
        tls: options.tls,
        db: endpoint.db,
        keyPrefix: undefined,
        lazyConnect: true,
        connectTimeout: 10000,
        commandTimeout: 10000,
        retryStrategy: () => null,
        maxRetriesPerRequest: 0,
        enableOfflineQueue: false,
      });
      connection.on('error', () => {});
      try {
        await connection.connect();
        const prefix =
          resource.kind === 'queue' ? resource.prefix.slice(0, -'queue:'.length) : resource.prefix;
        return await hasFreshnessRedis(connection, prefix);
      } finally {
        connection.disconnect();
      }
    },
  };
}
