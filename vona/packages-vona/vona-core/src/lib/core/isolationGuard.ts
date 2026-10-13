import { AsyncLocalStorage } from 'node:async_hooks';
import { lstatSync } from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

import type { VonaApplication } from './application.ts';

import {
  assertDisposableDatabaseName,
  assertTestAppIdentity,
  assertTestRunOwner,
  getDatabaseTestPrefix,
  resolveVonaLocalPaths,
} from './testIsolation.ts';

const databaseDiscovery = new AsyncLocalStorage<{
  app: VonaApplication;
  clientName: string;
  client: IsolatedDatabaseClient;
}>();

type IsolatedDatabaseConnection = {
  database?: string;
  filename?: string;
  connectionString?: string;
  uri?: string;
};

type IsolatedDatabaseClient = {
  client: string;
  connection?: unknown;
  connectionPool?: unknown;
};

export async function withIsolatedTestDatabaseDiscovery<T>(
  app: VonaApplication,
  clientName: string,
  client: IsolatedDatabaseClient,
  fn: () => Promise<T>,
): Promise<T> {
  if (!app.meta.env.VONA_TEST_RUN_ID) return fn();
  if (app.meta.appReady) throw new Error('Isolated test cannot discover databases after startup');
  const config = app.config as typeof app.config & {
    database: { defaultClient: string; clients: Record<string, IsolatedDatabaseClient> };
    instance: { instances: Record<string, false | { isolate?: boolean; isolateClient?: string }> };
  };
  const instanceClients = Object.values(config.instance.instances).flatMap(instance =>
    instance && instance.isolate && instance.isolateClient ? [instance.isolateClient] : [],
  );
  if (
    !client ||
    (clientName !== config.database.defaultClient && !instanceClients.includes(clientName)) ||
    config.database.clients[clientName]?.client !== client.client ||
    !isDeepStrictEqual(client.connection, config.database.clients[clientName].connection) ||
    !client.connection ||
    typeof client.connection !== 'object' ||
    Array.isArray(client.connection)
  ) {
    throw new Error(`Isolated test cannot discover an unconfigured database client: ${clientName}`);
  }
  return databaseDiscovery.run({ app, clientName, client }, async () => {
    assertIsolatedTestDatabaseClient(app, clientName, client);
    return await fn();
  });
}

export function assertIsolatedTestDatabaseClient(
  app: VonaApplication,
  clientName: string,
  client: IsolatedDatabaseClient,
) {
  const id = assertTestAppIdentity(app.meta.env.META_MODE, app.meta.env.VONA_TEST_RUN_ID, app.name);
  if (!id) return;
  const paths = resolveVonaLocalPaths(app.projectPath, 'test', id);
  assertTestRunOwner(paths.dataRoot, id);
  if (client.connectionPool !== undefined) {
    throw new Error(`Isolated test database cannot use an external pool: ${clientName}`);
  }
  if (
    !client.connection ||
    typeof client.connection !== 'object' ||
    Array.isArray(client.connection)
  ) {
    throw new Error(`Isolated test database requires an explicit connection target: ${clientName}`);
  }
  const connection = client.connection as IsolatedDatabaseConnection;
  if (connection.connectionString !== undefined || connection.uri !== undefined) {
    throw new Error(`Isolated test database cannot use a connection URL: ${clientName}`);
  }
  if (!['better-sqlite3', 'pg', 'mysql', 'mysql2'].includes(client.client)) {
    throw new Error(`Isolated test database client is unsupported: ${clientName}`);
  }
  if (
    client.client === 'better-sqlite3'
      ? connection.database !== undefined
      : connection.filename !== undefined
  ) {
    throw new Error(`Isolated test database has conflicting connection targets: ${clientName}`);
  }
  const config = app.config as typeof app.config & {
    database: { clients: Record<string, IsolatedDatabaseClient>; defaultClient: string };
    instance: { instances: Record<string, false | { isolate?: boolean; isolateClient?: string }> };
  };
  const configured = config.database;
  const discovering = databaseDiscovery.getStore();
  const target = client.client === 'better-sqlite3' ? connection.filename : connection.database;
  if (
    discovering?.app === app &&
    discovering.clientName === clientName &&
    !app.meta.appReady &&
    configured.clients[clientName]?.client === client.client &&
    client.client === discovering.client.client &&
    isDeepStrictEqual(connection, discovering.client.connection) &&
    isDeepStrictEqual(connection, configured.clients[clientName].connection)
  ) {
    const discoveryTarget =
      client.client === 'better-sqlite3' ? '' : client.client === 'pg' ? 'postgres' : 'mysql';
    if (
      target === discoveryTarget ||
      (client.client === 'better-sqlite3' && target === ':memory:')
    ) {
      return;
    }
  }
  const scopes = new Set(['share']);
  for (const [instanceName, instance] of Object.entries(config.instance.instances)) {
    if (instance && instance.isolate && instance.isolateClient) {
      scopes.add(`isolate-${instanceName}`);
    }
  }
  if (typeof target !== 'string') {
    throw new TypeError(`Isolated test database requires a disposable target: ${clientName}`);
  }
  let matched = false;
  for (const scope of scopes) {
    const prefix = getDatabaseTestPrefix(app.name, scope);
    const databaseName = client.client === 'better-sqlite3' ? path.basename(target, '.db') : target;
    try {
      assertDisposableDatabaseName(databaseName, prefix);
      matched = true;
      break;
    } catch {
      // Try the next owned namespace.
    }
  }
  if (!matched) throw new Error(`Isolated test database is outside its namespace: ${clientName}`);
  if (client.client === 'better-sqlite3') {
    if (!path.isAbsolute(target) || path.extname(target) !== '.db') {
      throw new Error(`Isolated test SQLite target must be an owned .db file: ${clientName}`);
    }
    assertIsolatedTestPath(target, path.join(paths.sqliteRoot, path.basename(target)));
  }
}

export function assertIsolatedTestPath(actual: string, expected: string) {
  if (path.resolve(actual) !== path.resolve(expected)) {
    throw new Error(`Isolated test path escapes its owned root: ${actual}`);
  }
  let current = path.resolve(actual);
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
}

export function assertIsolatedTestConfig(app: VonaApplication) {
  const env = app.meta.env;
  const id = assertTestAppIdentity(env.META_MODE, env.VONA_TEST_RUN_ID, app.name);
  if (!id) return;
  const paths = resolveVonaLocalPaths(app.projectPath, env.META_MODE, id);
  assertTestRunOwner(paths.dataRoot, id);
  assertTestRunOwner(paths.generatedRoot, id);
  assertIsolatedTestPath(app.config.server.publicDir, paths.publicRoot);
  assertIsolatedTestPath(app.config.logger.baseDir, paths.logsRoot);
  assertIsolatedTestPath(paths.runtimeRoot, paths.runtimeRoot);
  assertIsolatedTestPath(paths.sqliteRoot, paths.sqliteRoot);
  if (app.config.server.workers !== 1) throw new Error('Isolated test requires one Vona worker');
  const config = app.config as typeof app.config & {
    database: {
      testDatabase: boolean;
      base: {
        connection?: unknown;
        connectionPool?: unknown;
      };
      defaultClient: string | ((...args: unknown[]) => string);
      clients: Record<
        string,
        {
          client: string;
          connection?: unknown;
          connectionPool?: unknown;
        }
      >;
    };
    instance: { instances: Record<string, false | { isolate?: boolean; isolateClient?: string }> };
    redis: {
      base: { keyPrefix?: string };
      clients: Record<string, { keyPrefix?: string | true; sentinels?: unknown; nodes?: unknown }>;
    };
  };
  if (process.env.VONA_DB_RESET !== undefined) {
    throw new Error('Isolated test cannot run a development database reset');
  }
  if (!config.database.testDatabase) {
    throw new Error('Isolated test requires disposable test database configuration');
  }
  if (typeof config.database.defaultClient !== 'string') {
    throw new TypeError('Isolated test requires a static default database client');
  }
  if (
    config.database.base.connection !== undefined ||
    config.database.base.connectionPool !== undefined
  ) {
    throw new Error('Isolated test cannot inherit a database base connection target or pool');
  }
  const clientNames = new Set<string>([config.database.defaultClient]);
  const instances = config.instance.instances;
  for (const instance of Object.values(instances)) {
    if (!instance || !instance.isolate) continue;
    if (!instance.isolateClient)
      throw new Error('Isolated test instance requires an isolateClient');
    clientNames.add(instance.isolateClient);
  }
  for (const clientName of clientNames) {
    if (!config.database.clients[clientName]) {
      throw new Error(`Isolated test has no configured database client: ${clientName}`);
    }
  }
  for (const [clientName, client] of Object.entries(config.database.clients)) {
    if (client.connectionPool !== undefined) {
      throw new Error(
        `Isolated test database client has an external target or pool: ${clientName}`,
      );
    }
    // Optional, unused clients may intentionally remain empty in local configuration.
    // Any configured connection is still validated, even when that client is not selected.
    if (client.connection === undefined && !clientNames.has(clientName)) continue;
    if (
      typeof client.connection !== 'object' ||
      client.connection === null ||
      Array.isArray(client.connection) ||
      (client.connection as IsolatedDatabaseConnection).connectionString !== undefined ||
      (client.connection as IsolatedDatabaseConnection).uri !== undefined
    ) {
      throw new Error(
        `Isolated test database client has an external target or pool: ${clientName}`,
      );
    }
    if (!clientNames.has(clientName)) continue;
    if (!['better-sqlite3', 'pg', 'mysql', 'mysql2'].includes(client.client)) {
      throw new Error(`Isolated test has an unsupported database client: ${clientName}`);
    }
    const connection = client.connection as IsolatedDatabaseConnection;
    const expected =
      client.client === 'better-sqlite3' ? '' : client.client === 'pg' ? 'postgres' : 'mysql';
    const target = client.client === 'better-sqlite3' ? connection.filename : connection.database;
    if (target !== expected && !(client.client === 'better-sqlite3' && target === ':memory:')) {
      throw new Error(
        `Isolated test requires an administrative discovery connection: ${clientName}`,
      );
    }
    if (
      client.client === 'better-sqlite3'
        ? connection.database !== undefined
        : connection.filename !== undefined
    ) {
      throw new Error(`Isolated test discovery connection has conflicting targets: ${clientName}`);
    }
  }
  const redis = config.redis;
  if (redis.base.keyPrefix !== undefined) {
    throw new Error('Isolated test cannot inherit a Redis base keyPrefix');
  }
  for (const [clientName, client] of Object.entries(redis.clients)) {
    const special = ['queue', 'broadcast'].includes(clientName) || clientName.startsWith('redlock');
    if (
      (client as { sentinels?: unknown; nodes?: unknown }).sentinels ||
      (client as { nodes?: unknown }).nodes
    ) {
      throw new Error(`Isolated test cannot use a Redis sentinel or cluster client: ${clientName}`);
    }
    if (special ? client.keyPrefix !== undefined : client.keyPrefix !== true) {
      throw new Error(`Isolated test requires a framework-managed Redis prefix: ${clientName}`);
    }
  }
  const expectedPort = Number(env.SERVER_LISTEN_PORT);
  const requiresServerOrigin = process.env.VONA_TEST_SERVER_ORIGIN === 'true';
  if (
    !Number.isInteger(expectedPort) ||
    expectedPort <= 0 ||
    expectedPort > 65535 ||
    app.config.server.listen.port !== expectedPort ||
    app.config.server.listen.hostname !== '127.0.0.1' ||
    (requiresServerOrigin &&
      (app.config.server.serve.protocol !== 'http' ||
        app.config.server.serve.host !== `127.0.0.1:${expectedPort}`))
  ) {
    throw new Error(
      requiresServerOrigin
        ? 'Isolated test listener and server origin must match the assigned loopback port'
        : 'Isolated test listener must match the assigned loopback port',
    );
  }
}
