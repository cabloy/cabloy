import fse from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { VonaApplication } from '../core/application.ts';

import { getHomeVonaAppDir } from '../core/config.ts';
import { pathToHref } from '../utils/util.ts';

export function getSqlite3DatabaseNameDefault(app: VonaApplication) {
  const mode = app.meta.env.META_MODE;
  if (mode !== 'prod') return '';
  const dbPath = path.join(getHomeVonaAppDir(app), 'sqlite3');
  fse.ensureDirSync(dbPath);
  return path.join(dbPath, `${app.name}.db`);
}

export function resolverSqlite3(projectPath: string) {
  // src
  const require = createRequire(pathToHref(path.join(projectPath, '/')));
  const modulePath = require.resolve('better-sqlite3/package.json');
  return path.join(path.dirname(modulePath), 'build/Release/better_sqlite3.node');
}
