import { sleep } from '@cabloy/utils';

import type { VonaAppInfo, VonaApplicationOptions } from '../../types/application/app.ts';
import type { BootstrapOptions } from '../../types/interface/bootstrap.ts';
import type { VonaConfigEnv } from '../../types/utils/env.ts';

import { VonaApplication } from '../core/application.ts';
import { jsxEnhance } from '../utils/jsx-enhance.ts';
import { prepareEnv } from '../utils/util.ts';
import { zodEnhance } from '../utils/zod-enhance.ts';
import { Start } from './start.ts';

export async function createAppMaster(bootstrapOptions: BootstrapOptions) {
  globalThis.__bootstrapOptions__ = bootstrapOptions;
  const { modulesMeta, locales, config, env, AppMonkey } = bootstrapOptions;
  globalThis.__app__ = __createApp({
    modulesMeta,
    locales,
    config,
    env,
    AppMonkey,
  });
}

export async function createApp(bootstrapOptions: BootstrapOptions) {
  while (globalThis.__creating__) {
    await sleep(100);
  }
  try {
    globalThis.__creating__ = true;
    globalThis.__bootstrapOptions__ = bootstrapOptions;
    const { modulesMeta, locales, config, env, AppMonkey } = bootstrapOptions;
    if (!globalThis.__app__) {
      globalThis.__app__ = __createApp({
        modulesMeta,
        locales,
        config,
        env,
        AppMonkey,
      });
      const start = new Start(globalThis.__app__);
      await start.start();
    }
    await globalThis.__app__.meta.waitAppStarted();
    return globalThis.__app__;
  } finally {
    globalThis.__creating__ = false;
  }
}

function __createApp({ modulesMeta, locales, config, env, AppMonkey }: BootstrapOptions) {
  // patch zod, should before config
  zodEnhance();
  jsxEnhance();
  // env
  const env2 = prepareEnv(env);
  // appInfo
  const appInfo = prepareAppInfo(env2);
  // options
  const options: VonaApplicationOptions = {
    name: appInfo.name,
    projectPath: appInfo.projectPath,
    modulesMeta,
    locales,
    config,
    env: env2,
    AppMonkey,
  };
  return new VonaApplication(options);
}

function prepareAppInfo(env: VonaConfigEnv): VonaAppInfo {
  return {
    name: env.APP_NAME!,
    projectPath: process.cwd(),
  };
}
