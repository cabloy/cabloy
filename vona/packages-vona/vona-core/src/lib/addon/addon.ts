import fse from 'fs-extra';
import path from 'node:path';

import { resolverSharp } from './sharp.ts';
import { resolverSqlite3 } from './sqlite3.ts';

export type TypeCopyAddonOptionsResolver = (addonName: string, projectPath: string) => string;
export interface ICopyAddonOptions {
  addonName: string;
  resolver?: TypeCopyAddonOptionsResolver;
  projectPath: string;
  outDir: string;
  env: NodeJS.ProcessEnv;
}

export function getPlatformArch() {
  const platform = process.platform;
  const arch = process.arch;
  return `${platform}-${arch}`;
}

export async function copyAddon({
  addonName,
  resolver,
  projectPath,
  outDir,
  env,
}: ICopyAddonOptions) {
  const envName = `BUILD_ADDON_${addonName}`;
  const envValue = env[envName];
  if (envValue === 'false') return;
  // manual
  const addonDirSrc = path.join(projectPath, 'src/backend/addon', addonName);
  if (fse.existsSync(addonDirSrc)) {
    const addonDirDest = path.join(outDir, 'addon', addonName);
    await fse.copy(addonDirSrc, addonDirDest);
  }
  // auto
  const platformArch = getPlatformArch();
  const addonFile = _resolverAddonFile(addonName, projectPath, resolver);
  if (addonFile) {
    const fileDest = path.join(outDir, 'addon', addonName, `${platformArch}.node`);
    await fse.copy(addonFile, fileDest);
  }
}

function _resolverAddonFile(
  addonName: string,
  projectPath: string,
  resolver?: TypeCopyAddonOptionsResolver,
): string | undefined {
  const addonFile = resolver?.(addonName, projectPath);
  if (addonFile) return addonFile;
  if (addonName === 'sqlite3') {
    return resolverSqlite3(projectPath);
  } else if (addonName === 'sharp') {
    return resolverSharp(projectPath);
  }
}
