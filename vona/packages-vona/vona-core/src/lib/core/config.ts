import fse from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

import type { PowerPartial } from '../../types/utils/powerPartial.ts';
import type { VonaApplication } from './application.ts';

import { deepExtend } from '../utils/util.ts';

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
    loggerDir = path.join(app.projectPath, '.app/logs');
  } else {
    loggerDir = path.join(getHomeVonaAppDir(app), 'logs');
  }
  fse.ensureDirSync(loggerDir);
  return loggerDir;
}

export function getPublicPathPhysicalRoot(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  let publicDir: string;
  if (mode === 'test' || mode === 'dev') {
    publicDir = path.join(app.projectPath, '.app/public');
  } else {
    publicDir = path.join(getHomeVonaAppDir(app), 'public');
  }
  fse.ensureDirSync(publicDir);
  return publicDir;
}

export function getRuntimePathPhysicalRoot(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  let runtimeDir: string;
  if (mode === 'test' || mode === 'dev') {
    runtimeDir = path.join(app.options.projectPath, '.app/runtime');
  } else {
    runtimeDir = path.join(getHomeVonaAppDir(app), 'runtime');
  }
  fse.ensureDirSync(runtimeDir);
  return runtimeDir;
}

export function getHomeVonaAppDir(app: VonaApplication) {
  return path.join(os.homedir(), '.vona', app.name);
}
