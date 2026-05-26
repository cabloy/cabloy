import fse from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { VonaApplication } from '../core/application.ts';

import { getHomeVonaAppDir } from '../core/config.ts';
import { pathToHref } from './util.ts';

export function getSqlite3DatabaseNameDefault(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  if (mode !== 'prod') return '';
  const dbPath = path.join(getHomeVonaAppDir(app), 'sqlite3');
  fse.ensureDirSync(dbPath);
  return path.join(dbPath, `${app.name}.db`);
}

// string/true/false
export function getSqlite3NativeBinding(_app: VonaApplication, nativeBinding: string | undefined) {
  nativeBinding = prepareNativeBinding(nativeBinding);
  if (!nativeBinding) return nativeBinding;
  const nativeBindingPath = path.isAbsolute(nativeBinding)
    ? nativeBinding
    : path.join(import.meta.dirname, nativeBinding);
  const require = createRequire(import.meta.url);
  const addon = require(nativeBindingPath);
  return addon as any;
}

export async function copySqlite3NativeBinding(
  projectPath: string,
  outDir: string,
  env: NodeJS.ProcessEnv,
) {
  // dest
  const nativeBinding = prepareNativeBinding(env.DATABASE_CLIENT_SQLITE3_NATIVEBINDING);
  if (!nativeBinding || path.isAbsolute(nativeBinding)) return;
  const fileDest = path.join(outDir, nativeBinding);
  // src
  const require = createRequire(pathToHref(path.join(projectPath, '/')));
  const modulePath = require.resolve('better-sqlite3/package.json');
  const fileSrc = path.join(path.dirname(modulePath), 'build/Release/better_sqlite3.node');
  // copy
  await fse.copy(fileSrc, fileDest);
}

function prepareNativeBinding(nativeBinding: string | undefined) {
  if (!nativeBinding || nativeBinding === 'false') return null as unknown as undefined;
  return nativeBinding === 'true' ? 'node/better_sqlite3.node' : nativeBinding;
}
