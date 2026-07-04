import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { getPlatformArch } from 'vona';

import { pathToHref } from '../utils/util.ts';

export function resolverSharp(projectPath: string) {
  // src
  const require = createRequire(pathToHref(path.join(projectPath, '/')));
  const sharpPath = require.resolve('sharp');
  const requireSharp = createRequire(pathToHref(sharpPath));
  const modulePath = requireSharp.resolve(`@img/sharp-${getPlatformArch()}/sharp.node`);
  const libPath = path.join(path.dirname(modulePath), 'lib');
  const fileName = fs.readdirSync(libPath).find(item => item.endsWith('.node'));
  if (!fileName) {
    throw new Error(`Sharp native binding not found: ${libPath}`);
  }
  return path.join(libPath, fileName);
}

export function resolverSharpLibvips(projectPath: string) {
  // src
  const require = createRequire(pathToHref(path.join(projectPath, '/')));
  const sharpPath = require.resolve('sharp');
  const requireSharp = createRequire(pathToHref(sharpPath));
  const modulePath = requireSharp.resolve(`@img/sharp-libvips-${getPlatformArch()}/package`);
  const libPath = path.join(path.dirname(modulePath), 'lib');
  const fileName = fs.readdirSync(libPath).find(item => item.endsWith('.dylib'));
  if (!fileName) {
    throw new Error(`Sharp libvips native binding not found: ${libPath}`);
  }
  return path.join(libPath, fileName);
}
