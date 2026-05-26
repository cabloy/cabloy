import type { IModuleInfo } from '@cabloy/module-info';
import type { VonaApplication } from 'vona-core';

import { parseModuleInfo, ParseModuleNameLevelInit } from '@cabloy/module-info-pro';
import { useApp } from 'vona-core';

const ParseModuleNameLevel = ParseModuleNameLevelInit + 2;

export const app: VonaApplication = useApp();

export function mockPath(path?: string) {
  const moduleInfo = parseModuleInfo(ParseModuleNameLevel)!;
  return app.util.combineApiPath(path, moduleInfo.relativeName, false, true);
}

export function mockUrl(path?: string) {
  const moduleInfo = parseModuleInfo(ParseModuleNameLevel)!;
  return app.util.combineApiPath(path, moduleInfo.relativeName, true, true);
}

export function mockModuleInfo(): IModuleInfo {
  return parseModuleInfo(ParseModuleNameLevel)!;
}
