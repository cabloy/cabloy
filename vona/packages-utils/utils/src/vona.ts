import type * as ModuleInfo from '@cabloy/module-info';

import { stringToCapitalize, toLowerCaseFirstChar } from '@cabloy/word-utils';

export function combineResourceNameParts(
  resourceName: string | undefined,
  moduleName: ModuleInfo.IModuleInfo | string,
  simplify?: boolean,
  simplifyProviderId?: boolean,
): string[] {
  simplify = simplify ?? true;
  simplifyProviderId = simplifyProviderId ?? true;
  if (!resourceName) resourceName = '';
  // module path + arg
  if (typeof moduleName !== 'string') moduleName = moduleName.relativeName;
  const parts = moduleName.split('-');
  // path
  const res: string[] = [];
  if (!simplifyProviderId || parts[0] !== 'a') res.push(parts[0]);
  if (!simplify || !resourceName.startsWith(parts[1])) res.push(parts[1]);
  if (resourceName) res.push(resourceName);
  return res;
}

export function combineResourceName(
  resourceName: string | undefined,
  moduleName: ModuleInfo.IModuleInfo | string,
  simplify?: boolean,
  simplifyProviderId?: boolean,
): string {
  const parts = combineResourceNameParts(resourceName, moduleName, simplify, simplifyProviderId);
  return toLowerCaseFirstChar(stringToCapitalize(parts));
}

export function combineApiPath(
  path: string | undefined,
  moduleName?: ModuleInfo.IModuleInfo | string,
  prefix?: string | boolean,
  simplify?: boolean,
  globalPrefixConfig?: string,
): string {
  const globalPrefix =
    typeof prefix === 'string' ? prefix : prefix === false ? '' : globalPrefixConfig;
  simplify = simplify ?? true;
  if (!path) path = '';
  // ignore globalPrefix
  if (path.startsWith('//')) return path.substring(1);
  // ignore module path
  if (path.startsWith('/')) return `${globalPrefix}${path}`;
  // globalPrefix + module path + arg
  const parts = combineResourceNameParts(path, moduleName ?? '', simplify, true);
  return `${globalPrefix}/${parts.join('/')}`;
}

export function combineApiPathControllerAndAction(
  moduleName: ModuleInfo.IModuleInfo | string,
  controllerPath: string | undefined,
  actionPath: RegExp | string | undefined,
  prefix?: string | boolean,
  simplify?: boolean,
  globalPrefixConfig?: string,
): string {
  if (actionPath === undefined) actionPath = '';
  // routePath
  let routePath: string;
  if (typeof actionPath !== 'string') {
    // regexp
    throw new TypeError('regexp not supported');
  } else if (actionPath.startsWith('/')) {
    // absolute
    routePath = combineApiPath(actionPath, moduleName, prefix, simplify, globalPrefixConfig);
  } else {
    // relative
    if (!controllerPath) {
      routePath = combineApiPath(actionPath, moduleName, prefix, simplify, globalPrefixConfig);
    } else {
      routePath = combineApiPath(controllerPath, moduleName, prefix, simplify, globalPrefixConfig);
      if (actionPath) {
        routePath = `${routePath}/${actionPath}`;
      }
    }
  }
  return routePath;
}

export function combineApiPathControllerAndActionRaw(
  moduleName: ModuleInfo.IModuleInfo | string,
  controllerPath: string | undefined,
  actionPath: RegExp | string | undefined,
  simplify?: boolean,
): string {
  let apiPath = combineApiPathControllerAndAction(
    moduleName,
    controllerPath,
    actionPath,
    '/_api_',
    simplify,
  );
  if (typeof apiPath !== 'string') return apiPath;
  if (apiPath.startsWith('/_api_')) {
    apiPath = apiPath.substring('/_api_'.length);
  } else {
    apiPath = `/${apiPath}`;
  }
  return apiPath;
}
