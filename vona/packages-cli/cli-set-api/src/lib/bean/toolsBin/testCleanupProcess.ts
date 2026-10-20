import { register, createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Register before dynamically importing source config/framework (decorators and
// workspace TS exports). Dependencies resolve from this checkout's Vona install.
register(import.meta.resolve('@swc-node/register/esm'), pathToFileURL(`${process.cwd()}/`));
const require = createRequire(pathToFileURL(path.join(process.cwd(), 'package.json')));
let queue = Promise.resolve();
let claim: import('vona-core').TestClaimManifest | undefined;
let config: import('./resolveTestCleanupConfig.ts').TestCleanupResolvedConfig | undefined;

process.on('message', (message: any) => {
  if (!message || !Number.isSafeInteger(message.id) || typeof message.command !== 'string') return;
  queue = queue
    .then(async () => {
      let ok = false;
      try {
        if (message.command === 'prepare') {
          if (claim || typeof message.claimPath !== 'string')
            throw new Error('Invalid cleanup initialization');
          const inventory = await import('vona-core');
          claim = await inventory.loadTestClaim(message.claimPath);
          if (claim.projectPath !== process.cwd() || claim.runId !== process.env.VONA_TEST_RUN_ID)
            throw new Error('Cleanup process identity mismatch');
          config = await (
            await import('./resolveTestCleanupConfig.ts')
          ).resolveTestCleanupConfig(claim);
        } else if (message.command === 'database') {
          if (!claim || !config) throw new Error('Cleanup not initialized');
          const database = claim.databases.find(
            db => db.clientName === message.clientName && db.scope === message.scope,
          );
          if (
            !database ||
            !database.creations.some(item => item.name === message.name) ||
            database.endpoint.dialect === 'better-sqlite3'
          ) {
            throw new Error('Unknown cleanup database intent');
          }
          const options = config.databaseOptions.get(database.clientName)!;
          const knex = require('knex');
          const source = options.connection;
          // Project only supported target/auth/TLS fields. Never carry application
          // hooks, connectors, search paths, session setup, or pool callbacks.
          const target: Record<string, any> = {
            user: source.user,
            password: source.password,
            ssl: source.ssl,
            database: database.endpoint.adminDatabase,
          };
          if (database.endpoint.transport === 'tcp') {
            target.host = database.endpoint.host;
            target.port = database.endpoint.port;
          } else if (database.endpoint.dialect === 'pg') {
            target.host = database.endpoint.socketPath;
            target.port = database.endpoint.port;
          } else {
            target.socketPath = database.endpoint.socketPath;
          }
          target.connectionTimeoutMillis = 10000;
          target.connectTimeout = 10000;
          const connection = knex({
            client: database.endpoint.dialect,
            connection: target,
            pool: { min: 0, max: 1 },
            acquireConnectionTimeout: 10000,
          });
          const { dropExactCleanupDatabase } = await import('./testCleanupAdapters.ts');
          const { assertDisposableDatabaseName, getDatabaseTestPrefix, getTestAppName } =
            await import('vona-core');
          await dropExactCleanupDatabase(
            connection,
            database.endpoint.dialect,
            message.name,
            name =>
              assertDisposableDatabaseName(
                name,
                getDatabaseTestPrefix(getTestAppName(claim!.runId), database.scope),
              ),
          );
        } else if (message.command === 'redis') {
          if (!claim || !config) throw new Error('Cleanup not initialized');
          const resource = claim.redis.find(item => item.clientName === message.clientName);
          if (!resource) throw new Error('Unknown cleanup Redis resource');
          const options = config.redisOptions.get(resource.clientName)!;
          const Redis = require('ioredis').Redis;
          const target: Record<string, any> = {
            username: options.username,
            password: options.password,
            tls: options.tls,
            db: resource.endpoint.db,
          };
          if (resource.endpoint.transport === 'socket') {
            target.path = resource.endpoint.socketPath;
          } else {
            target.host = resource.endpoint.host;
            target.port = resource.endpoint.port;
          }
          const connection = new Redis({
            ...target,
            keyPrefix: undefined,
            lazyConnect: true,
            connectTimeout: 10000,
            commandTimeout: 10000,
            retryStrategy: () => null,
            maxRetriesPerRequest: 0,
            enableOfflineQueue: false,
          });
          // Never emit error details, even if a driver embeds a credential or URL.
          connection.on('error', () => {});
          try {
            await connection.connect();
            const { clearExactRedisPrefix } = await import('./testCleanupAdapters.ts');
            const { getTestClaimRedisPrefix } = await import('vona-core');
            await clearExactRedisPrefix(connection, resource.prefix, prefix => {
              if (prefix !== getTestClaimRedisPrefix(claim!.runId, resource.clientName)?.prefix)
                throw new Error('Foreign cleanup prefix');
            });
          } finally {
            connection.disconnect();
          }
        } else if (message.command === 'close') {
          config = undefined;
          claim = undefined;
        } else {
          throw new Error('Unknown cleanup operation');
        }
        ok = true;
      } catch {
        /* The IPC protocol deliberately contains no raw errors/config. */
      }
      if (process.connected) process.send?.({ id: message.id, ok });
    })
    .catch(() => {});
});
process.on('disconnect', () => {
  process.exit(0);
});
