import type { TestClaimManifest, VonaConfig, VonaConfigEnv } from 'vona-core';

import { getEnvFiles } from '@cabloy/dotenv';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import {
  VonaApplication,
  deepExtend,
  getTestAppName,
  getTestClaimRedisPrefix,
  mergeTestClaimDatabaseOptions,
  mergeTestClaimRedisOptions,
  normalizeTestClaimDatabaseEndpoint,
  normalizeTestClaimRedisEndpoint,
  getDatabaseTestPrefix,
  assertDisposableDatabaseName,
} from 'vona-core';

import { createConfigUtils } from './configUtils.ts';
import { TestCleanupConfigError } from './testCleanupErrors.ts';

export interface TestCleanupResolvedConfig {
  databaseOptions: Map<string, Record<string, any>>;
  redisOptions: Map<string, Record<string, any>>;
}
export interface TestCleanupConfigDependencies {
  loadEnvs(): NodeJS.ProcessEnv;
  files: string[];
  loadConfig(file: string): Promise<{ default: (app: VonaApplication) => unknown }>;
  createApp(env: NodeJS.ProcessEnv): VonaApplication;
}

export async function resolveTestCleanupConfig(
  claim: TestClaimManifest,
  injected?: TestCleanupConfigDependencies,
): Promise<TestCleanupResolvedConfig> {
  const meta = { flavor: 'normal' as const, mode: 'test' as const };
  const deps = injected ?? {
    loadEnvs: createConfigUtils(meta as any, {
      appDir: claim.projectPath,
      runtimeDir: '.unused-cleanup',
    }).loadEnvs,
    files: getEnvFiles(
      { ...meta, local: 'local' },
      path.join(claim.projectPath, 'src/backend/config/config'),
      'config',
      ['.ts', '.tsx'],
    )!,
    loadConfig: (file: string) => import(pathToFileURL(file).href),
    createApp: (env: NodeJS.ProcessEnv) =>
      new VonaApplication({
        name: getTestAppName(claim.runId),
        projectPath: claim.projectPath,
        env: env as unknown as VonaConfigEnv,
        configResolutionOnly: true,
        config: async () => {
          throw new Error('Cleanup config is source-only');
        },
        modulesMeta: async () => {
          throw new Error('Cleanup never loads modules');
        },
        locales: async () => {
          throw new Error('Cleanup never loads locales');
        },
      }),
  };
  const env = { ...deps.loadEnvs() };
  const shared = claim.databases.filter(database => database.scope === 'share');
  // Rebuild default-derived isolate clients for this run without changing process env.
  // Exact recorded endpoints and scopes must still match the resulting current config.
  if (shared.length === 1) env.DATABASE_DEFAULT_CLIENT = shared[0].clientName;
  if (
    env.META_MODE !== 'test' ||
    env.VONA_TEST_RUN_ID !== claim.runId ||
    env.APP_NAME !== getTestAppName(claim.runId)
  ) {
    throw new TestCleanupConfigError('identity');
  }
  const app = deps.createApp(env);
  const loaders = await Promise.all(deps.files.map(file => deps.loadConfig(file)));
  // Exactly Start's concurrent evaluation and ordered deep merge, without Start,
  // createGeneralApp/createApp, module loading, listeners, migrations or seeds.
  const items = await Promise.all(loaders.map(loader => loader.default(app)));
  const config: Record<string, any> = {};
  for (const item of items) {
    if (item) deepExtend(config, item);
  }
  app.config = config as VonaConfig;
  if (
    config.meta?.mode !== 'test' ||
    config.meta?.flavor !== 'normal' ||
    config.database?.testDatabase !== true
  ) {
    throw new TestCleanupConfigError('mode');
  }
  const databaseOptions = new Map<string, Record<string, any>>();
  const redisOptions = new Map<string, Record<string, any>>();
  for (const database of claim.databases) {
    // The recorded client owns this resource; today's default only selects new runs.
    const client = config.database.clients?.[database.clientName];
    if (!client) throw new TestCleanupConfigError('databaseClient');
    // Built-in dialect defaults only shape pools/afterCreate, never endpoints.
    // Admin cleanup uses a dedicated bounded pool instead of application hooks.
    const options = mergeTestClaimDatabaseOptions(config.database.base, undefined, client);
    const endpoint = normalizeTestClaimDatabaseEndpoint(options, claim.projectPath, claim.runId);
    if (!isDeepStrictEqual(endpoint, database.endpoint))
      throw new TestCleanupConfigError('databaseEndpoint');
    if (database.prefix !== getDatabaseTestPrefix(getTestAppName(claim.runId), database.scope))
      throw new TestCleanupConfigError('databaseNamespace');
    if (database.scope !== 'share') {
      const instance = config.instance?.instances?.[database.scope.slice('isolate-'.length)];
      if (!instance?.isolate || instance.isolateClient !== database.clientName)
        throw new TestCleanupConfigError('databaseScope');
    }
    if (endpoint.dialect !== 'better-sqlite3') {
      if (options.connection.database !== endpoint.adminDatabase)
        throw new TestCleanupConfigError('databaseAdmin');
      for (const creation of database.creations)
        assertDisposableDatabaseName(creation.name, database.prefix);
    }
    databaseOptions.set(database.clientName, options);
  }
  for (const resource of claim.redis) {
    const client = config.redis?.clients?.[resource.clientName];
    if (!client || config.redis.base?.keyPrefix !== undefined)
      throw new TestCleanupConfigError('redisTarget');
    const options = mergeTestClaimRedisOptions(config.redis.base, client);
    const endpoint = normalizeTestClaimRedisEndpoint(options);
    const owned = getTestClaimRedisPrefix(claim.runId, resource.clientName);
    if (
      !isDeepStrictEqual(endpoint, resource.endpoint) ||
      !owned ||
      owned.prefix !== resource.prefix ||
      owned.kind !== resource.kind
    ) {
      throw new TestCleanupConfigError('redisEndpoint');
    }
    if (resource.kind === 'client' ? options.keyPrefix !== true : options.keyPrefix !== undefined)
      throw new TestCleanupConfigError('redisPrefix');
    delete options.keyPrefix;
    redisOptions.set(resource.clientName, options);
  }
  return { databaseOptions, redisOptions };
}
