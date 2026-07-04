import type { ICliBuildCustomOptions } from '@cabloy/cli';

import { copyAddon } from 'vona';

export async function afterBuild(options: ICliBuildCustomOptions) {
  const { projectPath, outDir, env } = options;
  // await copySqlite3NativeBinding(projectPath, outDir, env);
  await copyAddon({ addonName: 'sqlite3', projectPath, outDir, env });
  await copyAddon({ addonName: 'sharp', projectPath, outDir, env });
  await copyAddon({ addonName: 'sharpLibvips', projectPath, outDir, env });
}
