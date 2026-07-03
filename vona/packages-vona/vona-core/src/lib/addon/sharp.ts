import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { getPlatformArch } from 'vona';

import { pathToHref } from '../utils/util.ts';

export function resolverSharp(projectPath: string) {
  // src
  const require = createRequire(pathToHref(path.join(projectPath, '/')));
  const modulePath = require.resolve(`@img/sharp-${getPlatformArch()}/package`);
  const moduleDir = path.extname(modulePath) ? path.dirname(modulePath) : modulePath;
  const libPath = path.join(moduleDir, 'lib');
  const fileName = fs.readdirSync(libPath).find(item => item.endsWith('.node'));
  if (!fileName) {
    throw new Error(`Sharp native binding not found: ${libPath}`);
  }
  return path.join(libPath, fileName);
}
