import type { VonaConfigMeta } from '@cabloy/module-info';

import * as dotenv from '@cabloy/dotenv';
import { glob } from '@cabloy/module-glob';
import os from 'node:os';
import path from 'node:path';

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
    for (const key of ['NODE_ENV', 'SERVER_WORKERS', 'META_FLAVOR', 'META_MODE']) {
      if ((res[key] as any) !== false) {
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
