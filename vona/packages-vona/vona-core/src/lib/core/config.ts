import fse from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

import type { PowerPartial } from '../../types/utils/powerPartial.ts';
import type { VonaApplication } from './application.ts';

import { deepExtend } from '../utils/util.ts';
import { assertIsolatedTestPath } from './isolationGuard.ts';
import { assertTestRunOwner, resolveVonaLocalPaths } from './testIsolation.ts';

export type TypeConfigLoader<T> = (app: VonaApplication) => Promise<PowerPartial<T>>;

export async function combineConfigDefault<T>(
  app: VonaApplication,
  configDefault: TypeConfigLoader<T>,
  configDev?: TypeConfigLoader<T>,
  configProd?: TypeConfigLoader<T>,
  configTest?: TypeConfigLoader<T>,
): Promise<PowerPartial<T>> {
  let config = (await configDefault(app))!;
  const mode = app.meta.env.META_MODE;
  if (mode === 'dev' && configDev) {
    config = deepExtend(config, await configDev(app));
  } else if (mode === 'prod' && configProd) {
    config = deepExtend(config, await configProd(app));
  } else if (mode === 'test' && configTest) {
    config = deepExtend(config, await configTest(app));
  }
  return config;
}

export function getLoggerPathPhysicalRoot(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  let loggerDir: string;
  if (mode === 'test' || mode === 'dev') {
    loggerDir = resolveVonaLocalPaths(
      app.projectPath,
      mode,
      app.meta.env.VONA_TEST_RUN_ID,
    ).logsRoot;
  } else {
    loggerDir = path.join(getHomeVonaAppDir(app), 'logs');
  }
  if (!app.options.configResolutionOnly) {
    assertOwnedLocalPath(app, loggerDir, 'logsRoot');
    fse.ensureDirSync(loggerDir);
  }
  return loggerDir;
}

export function getPublicPathPhysicalRoot(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  let publicDir: string;
  if (mode === 'test' || mode === 'dev') {
    publicDir = resolveVonaLocalPaths(
      app.projectPath,
      mode,
      app.meta.env.VONA_TEST_RUN_ID,
    ).publicRoot;
  } else {
    publicDir = path.join(getHomeVonaAppDir(app), 'public');
  }
  if (!app.options.configResolutionOnly) {
    assertOwnedLocalPath(app, publicDir, 'publicRoot');
    fse.ensureDirSync(publicDir);
  }
  return publicDir;
}

export function getRuntimePathPhysicalRoot(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  let runtimeDir: string;
  if (mode === 'test' || mode === 'dev') {
    runtimeDir = resolveVonaLocalPaths(
      app.options.projectPath,
      mode,
      app.meta.env.VONA_TEST_RUN_ID,
    ).runtimeRoot;
  } else {
    runtimeDir = path.join(getHomeVonaAppDir(app), 'runtime');
  }
  if (!app.options.configResolutionOnly) {
    assertOwnedLocalPath(app, runtimeDir, 'runtimeRoot');
    fse.ensureDirSync(runtimeDir);
  }
  return runtimeDir;
}

function assertOwnedLocalPath(
  app: VonaApplication,
  actual: string,
  leaf: 'logsRoot' | 'publicRoot' | 'runtimeRoot',
) {
  const paths = resolveVonaLocalPaths(
    app.projectPath,
    app.meta.env.META_MODE,
    app.meta.env.VONA_TEST_RUN_ID,
  );
  if (!paths.runId) return;
  assertTestRunOwner(paths.dataRoot, paths.runId);
  assertIsolatedTestPath(actual, paths[leaf]);
}

export function getHomeVonaAppDir(app: VonaApplication) {
  return path.join(os.homedir(), '.vona', app.name);
}
