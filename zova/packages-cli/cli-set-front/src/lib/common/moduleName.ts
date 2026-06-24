import type { IModule, IModuleInfo } from '@cabloy/module-info';

export function parseModuleInfoCanonical(
  helper: { parseModuleInfo(moduleName: string): IModuleInfo },
  moduleName: string,
  moduleRole = 'module',
) {
  const moduleInfo = helper.parseModuleInfo(moduleName);
  if (moduleInfo.relativeName !== moduleName) {
    throw new Error(
      `${moduleRole} name must use the canonical relative module name: ${moduleInfo.relativeName}. Received: ${moduleName}. Use names like training-student, not package names or extra-suffixed names.`,
    );
  }
  return moduleInfo;
}

export function findModuleCanonical(
  helper: {
    parseModuleInfo(moduleName: string): IModuleInfo;
    findModule(moduleName: string): IModule | undefined;
  },
  moduleName: string,
  moduleRole = 'module',
) {
  const moduleInfo = parseModuleInfoCanonical(helper, moduleName, moduleRole);
  const module = helper.findModule(moduleInfo.relativeName);
  if (!module) {
    throw new Error(`${moduleRole} does not exist: ${moduleName}`);
  }
  return module;
}
