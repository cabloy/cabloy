import type { IndexAPI } from '@quasar/app-vite';

import fse from 'fs-extra';
import path from 'node:path';
import { getOutDir, getOutReleasesDir } from 'zova-vite';

import type { ConfigContext, QuasarConf } from './types.js';

export function extendAfterBuild(context: ConfigContext, _flavor: string) {
  return async function extendAfterBuild(_conf: QuasarConf, _api: IndexAPI) {
    const outDir = path.join(context.configOptions!.appDir, getOutDir());
    // remove dist/ssr/server
    fse.removeSync(path.join(outDir, 'server'));
    // remove zova/runtime
    fse.removeSync(path.join(context.configOptions!.appDir, context.configOptions!.runtimeDir));
    // copy
    const outReleasesDir = path.join(context.configOptions!.appDir, getOutReleasesDir());
    fse.removeSync(outReleasesDir);
    fse.copySync(outDir, outReleasesDir, { preserveTimestamps: true });
    // copy
    _copyToTarget(outDir, process.env.BUILD_COPY_DIST, path.basename(outDir));
    _copyToTarget(outDir, process.env.BUILD_COPY_RELEASE, path.basename(outReleasesDir));
  };
}

function _copyToTarget(outDir: string, target: string | undefined, basename: string) {
  if (!target) return;
  const dirs = target.split(',');
  for (const dir of dirs) {
    const outReleasesDirCopy = path.join(dir, basename);
    fse.removeSync(outReleasesDirCopy);
    fse.copySync(outDir, outReleasesDirCopy, { preserveTimestamps: true });
  }
}
