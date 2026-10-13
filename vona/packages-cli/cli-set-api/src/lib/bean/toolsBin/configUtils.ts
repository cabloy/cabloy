import type { VonaConfigMeta } from '@cabloy/module-info';

import * as dotenv from '@cabloy/dotenv';
import { glob } from '@cabloy/module-glob';
import os from 'node:os';
import path from 'node:path';
import { getTestAppName, resolveTestRunId, TEST_RUN_ID_ENV } from 'vona-core';

import type { VonaBinConfigOptions } from './types.ts';

import { getEnvMeta, getNodeEnv } from '../../utils.ts';

export function createConfigUtils(
  configMeta: VonaConfigMeta,
  configOptions: VonaBinConfigOptions,
): {
  loadEnvs: () => NodeJS.ProcessEnv;
  loadModulesMeta: () => ReturnType<typeof glob>;
} {
  let __modulesMeta: Awaited<ReturnType<typeof glob>>;
  return {
    loadEnvs: __loadEnvs,
    loadModulesMeta: __loadModulesMeta,
  };

  //////////////////////////////

  function __loadEnvs(): NodeJS.ProcessEnv {
    const meta = getEnvMeta(configMeta);
    const envDir = path.join(configOptions.appDir, 'env');
    const runId = resolveTestRunId(meta.mode, process.env[TEST_RUN_ID_ENV]);
    if (runId && process.env.VONA_DB_RESET !== undefined) {
      throw new Error('Isolated test cannot run a development database reset');
    }
    const envs = dotenv.loadEnvs(meta, envDir, '.env');
    const res = Object.assign(
      {
        NODE_ENV: getNodeEnv(meta.mode),
      },
      envs,
      {
        META_FLAVOR: meta.flavor,
        META_MODE: meta.mode,
      },
    );
    if (runId) {
      res[TEST_RUN_ID_ENV] = runId;
      res.APP_NAME = getTestAppName(runId);
      const port = Number(process.env.SERVER_LISTEN_PORT);
      if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error('Isolated test requires an assigned SERVER_LISTEN_PORT');
      }
      res.SERVER_LISTEN_PORT = String(port);
      res.SERVER_LISTEN_HOSTNAME = '127.0.0.1';
      if (process.env.VONA_TEST_SERVER_ORIGIN === 'true') {
        res.SERVER_SERVE_PROTOCOL = 'http';
        res.SERVER_SERVE_HOST = `127.0.0.1:${port}`;
      }
    }
    if (configOptions.workers !== undefined) {
      res.SERVER_WORKERS = configOptions.workers.toString();
    }
    // maybe empty string
    if (!res.SERVER_WORKERS) {
      if (meta.mode === 'prod') {
        res.SERVER_WORKERS = os.cpus().length.toString();
      } else {
        res.SERVER_WORKERS = '1';
      }
    }
    for (const key of ['NODE_ENV', 'SERVER_WORKERS', 'META_FLAVOR', 'META_MODE', TEST_RUN_ID_ENV]) {
      if (res[key] !== undefined && (res[key] as any) !== false) {
        process.env[key] = res[key];
      }
    }
    // ok
    return res as NodeJS.ProcessEnv;
  }

  async function __loadModulesMeta() {
    const meta = getEnvMeta(configMeta);
    // modules
    __modulesMeta = await glob({
      projectMode: 'vona',
      projectPath: configOptions.appDir,
      disabledModules: process.env.PROJECT_DISABLED_MODULES,
      disabledSuites: process.env.PROJECT_DISABLED_SUITES,
      log: false,
      meta,
    });
    return __modulesMeta;
  }
}
