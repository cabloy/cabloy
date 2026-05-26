import { sleep } from '@cabloy/utils';
import path from 'node:path';

import type { VonaApplication } from '../core/application.ts';

import { pathToHref } from '../utils/util.ts';

export function useApp(): VonaApplication {
  return globalThis.__app__;
}

export async function closeApp() {
  while (globalThis.__closing__) {
    await sleep(50);
  }
  try {
    globalThis.__closing__ = true;
    if (globalThis.__app__) {
      await globalThis.__app__.meta.close();
      delete globalThis.__app__;
    }
  } finally {
    globalThis.__closing__ = false;
  }
}

export async function createGeneralApp(
  projectPath: string,
  envRuntime?: Partial<NodeJS.ProcessEnv>,
) {
  if (envRuntime) {
    for (const key of Object.keys(envRuntime)) {
      process.env[key] = envRuntime[key];
    }
  }
  if (process.env.META_MODE === 'prod') {
    const testFile = path.join(projectPath, `dist/${process.env.META_FLAVOR}/bootstrap.js`);
    const testInstance = await import(pathToHref(testFile));
    return await testInstance.appBootstrap;
  } else {
    const testFile = path.join(projectPath, '.vona/app.ts');
    const testInstance = await import(pathToHref(testFile));
    return await testInstance.createSingleApp();
  }
}

// export async function reloadApp() {
//   while (globalThis.__reloading__) {
//     await sleep(100);
//   }
//   try {
//     globalThis.__reloading__ = true;
//     await closeApp();
//     await createApp(globalThis.__bootstrapOptions__);
//   } finally {
//     globalThis.__reloading__ = false;
//   }
// }
