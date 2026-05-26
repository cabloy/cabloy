import type * as ModuleInfo from '@cabloy/module-info';
import type { IModule } from '@cabloy/module-info';
import type { BinaryToTextEncoding, HashOptions } from 'node:crypto';

import { compose as _compose } from '@cabloy/compose';
import { extend } from '@cabloy/extend';
import {
  combineApiPath,
  combineApiPathControllerAndAction,
  combineApiPathControllerAndActionRaw,
  combineResourceName,
  forEach,
  forEachSync,
} from '@cabloy/utils';
import fse from 'fs-extra';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as uuid from 'uuid';

import type {
  IInstanceRecord,
  TypeMonkeyName,
  VonaConfigEnv,
  VonaContext,
} from '../../types/index.ts';
import type { IBeanRecord, IBeanScopeRecord, TypeBeanScopeRecordKeys } from '../bean/type.ts';
import type { IBeanSceneRecord } from '../decorator/interface/beanOptions.ts';
import type { ZodLocaleErrors } from './zod-enhance.ts';

import { cast } from '../../types/index.ts';
import { BeanSimple } from '../bean/beanSimple.ts';
import { zodSetLocaleErrors } from './zod-enhance.ts';

export interface IExecuteBeanCallbackParams {
  ctx: VonaContext;
  bean: any;
  context: any;
}
export interface IExecuteBeanCallback {
  (params: IExecuteBeanCallbackParams): Promise<any>;
}

export interface IModuleAssetSceneRecord {
  static: never;
  templates: never;
  site: never;
  fonts: never;
}

const SymbolProdRootPath = Symbol('SymbolProdRootPath');

export class AppUtil extends BeanSimple {
  private [SymbolProdRootPath]: string;

  instanceStarted(instanceName: keyof IInstanceRecord): boolean {
    return this.app.meta.appReadyInstances && this.app.meta.appReadyInstances[instanceName];
  }

  get protocol() {
    const config = this.ctx ? this.ctx.config : this.app.config;
    return config.server.serve.protocol || this.ctx?.protocol;
  }

  get host() {
    const config = this.ctx ? this.ctx.config : this.app.config;
    return config.server.serve.host || this.ctx?.host;
  }

  getAbsoluteUrl(path?: string) {
    const prefix = this.host ? `${this.protocol}://${this.host}` : '';
    return `${prefix}${path || ''}`;
  }

  getAbsoluteUrlByApiPath(path: string) {
    return this.getAbsoluteUrl(this.combineApiPath(path, '', true, true));
  }

  combineApiPathControllerAndActionRaw(
    moduleName: ModuleInfo.IModuleInfo | string,
    controllerPath: string | undefined,
    actionPath: RegExp | string | undefined,
    simplify?: boolean,
  ): string {
    return combineApiPathControllerAndActionRaw(moduleName, controllerPath, actionPath, simplify);
  }

  combineApiPathControllerAndAction(
    moduleName: ModuleInfo.IModuleInfo | string,
    controllerPath: string | undefined,
    actionPath: RegExp | string | undefined,
    prefix?: string | boolean,
    simplify?: boolean,
  ): string {
    return combineApiPathControllerAndAction(
      moduleName,
      controllerPath,
      actionPath,
      prefix,
      simplify,
      this.app.config.server.globalPrefix,
    );
  }

  combineApiPath(
    path: string | undefined,
    moduleName?: ModuleInfo.IModuleInfo | string,
    prefix?: string | boolean,
    simplify?: boolean,
  ) {
    return combineApiPath(path, moduleName, prefix, simplify, this.app.config.server.globalPrefix);
  }

  combineStaticPath(staticPath: string | undefined, moduleName?: ModuleInfo.IModuleInfo | string) {
    const globalPrefix = '/api/static';
    if (!staticPath) staticPath = '';
    // safe
    staticPath = path.normalize(staticPath);
    if (staticPath.includes('..')) throw new Error(`unsafe path: ${staticPath}`);
    // ignore globalPrefix
    if (staticPath.startsWith('//')) return staticPath.substring(1);
    // ignore module path
    if (staticPath.startsWith('/')) return `${globalPrefix}${staticPath}`;
    // globalPrefix + module path + arg
    if (!moduleName) throw new Error('should specify the moduleName');
    if (typeof moduleName !== 'string') moduleName = moduleName.relativeName;
    const parts = moduleName.split('-');
    // path
    return `${globalPrefix}/${parts[0]}/${parts[1]}/${staticPath}`;
  }

  combineResourceName(
    resourceName: string | undefined,
    moduleName: ModuleInfo.IModuleInfo | string,
    simplify?: boolean,
    simplifyProviderId?: boolean,
  ): string {
    return combineResourceName(resourceName, moduleName, simplify, simplifyProviderId);
  }

  async getPublicPathPhysical(subdir?: string, ensure?: boolean) {
    const rootPath = this.app.config.server.publicDir;
    // use instance.id, not instanceName
    const dir = combineFilePathSafe(
      path.join(rootPath, cast(this.ctx).instance.id.toString()),
      subdir || '',
    );
    if (!dir) throw new Error('not valid path');
    if (ensure) {
      await fse.ensureDir(dir);
    }
    return dir;
  }

  get prodRootPath(): string {
    if (!this.app.meta.isProd) throw new Error('only invoked in prod');
    if (!this[SymbolProdRootPath]) {
      this[SymbolProdRootPath] = import.meta.dirname;
    }
    return this[SymbolProdRootPath];
  }

  getAssetPathPhysical(
    moduleName: ModuleInfo.IModuleInfo | string,
    scene: keyof IModuleAssetSceneRecord,
    assetPath?: string,
  ) {
    if (typeof moduleName !== 'string') moduleName = moduleName.relativeName;
    if (this.app.meta.isProd) {
      return combineFilePathSafe(
        path.join(this.prodRootPath, 'assets', scene, moduleName),
        assetPath || '',
      );
    } else {
      const module = this.app.meta.modules[moduleName];
      if (!module) throw new Error('module not found');
      return combineFilePathSafe(path.join(module.root, 'assets', scene), assetPath || '');
    }
  }

  createError(data, returnObject?: boolean) {
    const error = returnObject ? ({} as any) : new Error();
    error.code = data.code !== undefined ? data.code : 500;
    if (data.message && typeof data.message === 'object') {
      error.message = JSON.stringify(data.message, null, 2);
    } else {
      error.message = data.message;
    }
    if (!this.app.meta.isProd) {
      if (data.stack) error.stack = data.stack;
      if (data.name) error.name = data.name;
      if (data.errno) (error as any).errno = data.errno;
      if (data.sqlMessage) (error as any).sqlMessage = data.sqlMessage;
      if (data.sqlState) (error as any).sqlState = data.sqlState;
      if (data.index) (error as any).index = data.index;
      if (data.sql) (error as any).sql = data.sql;
    }
    return error;
  }

  async monkeyModule(
    ebAppMonkey,
    ebModulesMonkey: IModule[],
    order: boolean,
    monkeyName: TypeMonkeyName,
    moduleTarget?: IModule,
    ...monkeyData: any[]
  ) {
    // self: main
    if (moduleTarget && moduleTarget.mainInstance && moduleTarget.mainInstance[monkeyName]) {
      // @ts-ignore ignore
      await moduleTarget.mainInstance[monkeyName](...monkeyData);
    }
    // module monkey
    await forEach(ebModulesMonkey, order, async moduleMonkey => {
      if (moduleMonkey.monkeyInstance && moduleMonkey.monkeyInstance[monkeyName]) {
        if (moduleTarget === undefined) {
          // @ts-ignore ignore
          await moduleMonkey.monkeyInstance[monkeyName](...monkeyData);
        } else {
          // @ts-ignore ignore
          await moduleMonkey.monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
        }
      }
    });
    // app monkey
    if (ebAppMonkey && ebAppMonkey[monkeyName]) {
      if (moduleTarget === undefined) {
        await ebAppMonkey[monkeyName](...monkeyData);
      } else {
        await ebAppMonkey[monkeyName](moduleTarget, ...monkeyData);
      }
    }
  }

  monkeyModuleSync(
    ebAppMonkey,
    ebModulesMonkey: IModule[],
    order: boolean,
    monkeyName: TypeMonkeyName,
    moduleTarget?: IModule,
    ...monkeyData: any[]
  ) {
    // self: main
    if (moduleTarget && moduleTarget.mainInstance && moduleTarget.mainInstance[monkeyName]) {
      // @ts-ignore ignore
      moduleTarget.mainInstance[monkeyName](...monkeyData);
    }
    // module monkey
    forEachSync(ebModulesMonkey, order, moduleMonkey => {
      if (moduleMonkey.monkeyInstance && moduleMonkey.monkeyInstance[monkeyName]) {
        if (moduleTarget === undefined) {
          // @ts-ignore ignore
          moduleMonkey.monkeyInstance[monkeyName](...monkeyData);
        } else {
          // @ts-ignore ignore
          moduleMonkey.monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
        }
      }
    });
    // app monkey
    if (ebAppMonkey && ebAppMonkey[monkeyName]) {
      if (moduleTarget === undefined) {
        ebAppMonkey[monkeyName](...monkeyData);
      } else {
        ebAppMonkey[monkeyName](moduleTarget, ...monkeyData);
      }
    }
  }

  detectErrorMessage(err: Error) {
    // detect json parse error
    if (
      err.status === 400 &&
      err.name === 'SyntaxError' &&
      this.ctx.request.is('application/json', 'application/vnd.api+json', 'application/csp-report')
    ) {
      return 'Problems parsing JSON';
    }
    return err.message;
  }

  detectStatus(err: Error) {
    // detect status
    let status = err.status || 500;
    if (typeof status !== 'number') status = Number(status);
    if (status < 200) {
      // invalid status consider as 500, like urllib will return -1 status
      status = 500;
    }
    return status;
  }

  accepts() {
    if (this.ctx.acceptJSON) return 'json';
    return 'html';
  }

  getModuleConfigRaw<K extends TypeBeanScopeRecordKeys>(
    moduleName: K,
  ): IBeanScopeRecord[K] extends { config?: infer CONFIG } ? CONFIG | undefined : undefined {
    return this.app.config.modules[moduleName as any];
  }

  setLocaleErrors(localeErrors: ZodLocaleErrors, localeDefault?: string) {
    return zodSetLocaleErrors(this.app, localeErrors, localeDefault);
  }
}

export function compose(chains, adapter?) {
  return _compose(chains, adapter);
}

export function instanceDesp(instanceName: keyof IInstanceRecord | null | undefined): string {
  if (instanceName === undefined || instanceName === null) return '~';
  return instanceName || '-';
}

export function requireDynamic(file: string) {
  if (!file) throw new Error('file should not empty');
  const require = createRequire(import.meta.url);
  let instance = require(file);
  const mtime = _requireDynamic_getFileTime(file);
  if (instance.__requireDynamic_mtime === undefined) {
    instance.__requireDynamic_mtime = mtime;
  } else if (instance.__requireDynamic_mtime !== mtime) {
    delete require.cache[require.resolve(file)];
    instance = require(file);
    instance.__requireDynamic_mtime = mtime;
  }
  return instance;
}

function _requireDynamic_getFileTime(file) {
  if (!path.isAbsolute(file)) return null;
  const exists = fse.pathExistsSync(file);
  if (!exists) return null;
  // stat
  const stat = fse.statSync(file);
  return stat.mtime.valueOf();
}

export function deepExtend<T extends []>(target: T, ...args): [];
export function deepExtend<T = any>(target: {}, ...args): T;
export function deepExtend(target: any, ...args): any {
  return extend(true, target, ...args);
}

export function uuidv4() {
  return uuid.v4();
}

export function createHash(
  str: string,
  encoding?: BinaryToTextEncoding,
  algorithm?: string,
  options?: HashOptions,
) {
  const hash = crypto.createHash(algorithm ?? 'sha256', options);
  hash.update(str);
  return hash.digest(encoding ?? 'hex');
}

export async function disposeInstance(instance: any) {
  await instance?.__dispose__?.();
}

export function polyfillDispose(instance: any) {
  if (!instance || instance.__dispose__) return;
  Object.getPrototypeOf(instance).__dispose__ = () => {};
}

export function pathToHref(fileName: string): string {
  return pathToFileURL(fileName).href;
  // return Path.sep === '\\' ? pathToFileURL(fileName).href : fileName;
}

export function prepareEnv(env: Partial<NodeJS.ProcessEnv>): VonaConfigEnv {
  const env2 = { ...env };
  for (const key of Object.keys(env2)) {
    if (process.env[key] !== undefined) {
      env2[key] = process.env[key];
    }
  }
  return env2 as unknown as VonaConfigEnv;
}

export function beanFullNameFromOnionName(
  onionName: string,
  sceneName: keyof IBeanSceneRecord,
): keyof IBeanRecord {
  return onionName.replace(':', `.${sceneName}.`) as unknown as keyof IBeanRecord;
}

export function onionNameFromBeanFullName(beanFullName: string): string {
  const parts = beanFullName.split('.');
  return `${parts[0]}:${parts[2]}`;
}

export function filterHeaders(headers: object | undefined, whitelist: string[]) {
  if (!headers) return;
  const res = {};
  for (const key in headers) {
    if (whitelist.includes(key)) {
      res[key] = headers[key];
    }
  }
  return res;
}

export function combineFilePathSafe(dir: string, file: string) {
  const fullPath = path.normalize(path.join(dir, file));
  // files that can be accessd should be under options.dir
  if (fullPath.indexOf(dir) !== 0) throw new Error(`unsafe dir: ${dir}`);
  return fullPath;
}

export async function loadJSONFile(fileName: string) {
  const pkgContent = (await fse.readFile(fileName)).toString();
  return JSON.parse(pkgContent);
}

export async function saveJSONFile(fileName: string, json: object) {
  await fse.writeFile(fileName, `${JSON.stringify(json, null, 2)}\n`);
}
