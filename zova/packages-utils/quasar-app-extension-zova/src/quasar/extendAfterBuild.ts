import type { IndexAPI } from '@quasar/app-vite';

import fse from 'fs-extra';
import path from 'node:path';
import { getOutDir, getOutReleasesDir } from 'zova-vite';

import type { ConfigContext, QuasarConf } from './types.js';

export function extendAfterBuild(context: ConfigContext, _flavor: string) {
  return async function extendAfterBuild(_conf: QuasarConf, _api: IndexAPI) {
    const appDir=context.configOptions!.appDir;
    const outDir = path.join(appDir, getOutDir());
    // remove dist/ssr/server
    fse.removeSync(path.join(outDir, 'server'));
    // remove zova/runtime
    fse.removeSync(path.join(appDir, context.configOptions!.runtimeDir));
    // copy
    const outReleasesDir = path.join(appDir, getOutReleasesDir());
    fse.removeSync(outReleasesDir);
    fse.copySync(outDir, outReleasesDir, { preserveTimestamps: true });
    // copy
    _copyToTarget(outDir, process.env.BUILD_COPY_DIST, path.basename(outDir),appDir);
    _copyToTarget(outDir, process.env.BUILD_COPY_RELEASE, path.basename(outReleasesDir),appDir);
  };
}

function _copyToTarget(outDir: string, target: string | undefined, basename: string,appDir: string) {
  if (!target) return;
  const dirs = target.split(',');
  for (const dir of dirs) {
    const dir2=path.isAbsolute(dir)?dir:path.join(appDir,dir);
    const outReleasesDirCopy = path.join(dir2, basename);
    fse.removeSync(outReleasesDirCopy);
    fse.copySync(outDir, outReleasesDirCopy, { preserveTimestamps: true });
  }
}
