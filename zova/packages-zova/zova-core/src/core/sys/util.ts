import { extend } from '@cabloy/extend';
import {
  combineApiPathControllerAndAction,
  defaultPathSerializer,
  isEmptyObject,
} from '@cabloy/utils';
import DeepEqual from 'deep-equal';
import { isReactive, reactive } from 'vue';

import type { IBeanRecord, IBeanScopeRecord, TypeBeanScopeRecordKeys } from '../../bean/type.ts';
import type { IBeanSceneRecord } from '../../decorator/interface/beanOptions.ts';
import type { TypeAuthToken } from '../../types/utils/auth.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { cast } from '../../types/utils/cast.ts';
import { uuid as _uuid } from '../../utils/uuid.ts';

export interface IApiActionConfigPrepareOptions {
  query?: {};
  authToken?: TypeAuthToken;
  openapiSchema?: boolean;
  headers?: {};
}

export class SysUtil extends BeanSimple {
  getAbsoluteUrlFromPagePath(path?: string, ignoreHost?: boolean, ignorePublicPath?: boolean) {
    let prefix = ignoreHost
      ? ''
      : process.env.DEV
        ? `http://${this.sys.env.DEV_SERVER_HOSTNAME || 'localhost'}:${this.sys.env.DEV_SERVER_PORT}`
        : `${this.sys.env.SSR_PROD_PROTOCOL}://${this.sys.env.SSR_PROD_HOST}`;
    if (!ignorePublicPath && this.sys.env.APP_PUBLIC_PATH) {
      prefix = `${prefix}/${this.sys.env.APP_PUBLIC_PATH}`;
    }
    return `${prefix}${path || ''}`;
  }

  getPagePathFromAbsoluteUrl(url: string, ignorePublicPath?: boolean) {
    let pagePath: string;
    if (isHttpUrl(url)) {
      const _url = new URL(url);
      pagePath = _url.pathname + _url.search;
    } else {
      pagePath = url;
    }
    if (!ignorePublicPath && this.sys.env.APP_PUBLIC_PATH) {
      const prefix = `/${this.sys.env.APP_PUBLIC_PATH}`;
      if (pagePath.startsWith(prefix)) {
        pagePath = pagePath.substring(prefix.length);
      }
    }
    return pagePath;
  }

  getApiBaseURL(useApiPrefix: boolean = true) {
    let baseURL = this.sys.config.api.baseURL || '';
    if (useApiPrefix) {
      baseURL = `${baseURL}${this.sys.config.api.prefix || ''}`;
    }
    return baseURL;
  }

  getOpenApiBaseURL(envName: string): string {
    if (process.env.CLIENT) {
      return (
        this.sys.env[envName] || this.sys.env.OPENAPI_BASE_URL_DEFAULT || this.sys.env.API_BASE_URL
      );
    } else {
      return (
        this.sys.env[envName] ||
        this.sys.env.OPENAPI_BASE_URL_DEFAULT ||
        this.sys.env.SSR_API_BASE_URL
      );
    }
  }

  getApiPath<K extends string | undefined = string | undefined>(
    path: K,
  ): K extends string ? string : undefined {
    if (!path) return path as any;
    if (path.startsWith('//')) {
      path = path.substring(1) as any;
    } else {
      path = (this.sys.config.api.prefix + path) as any;
    }
    return path as any;
  }

  apiActionPathTranslate(pathName: string, pathParams?: Record<string, any>): string {
    return defaultPathSerializer(pathName, pathParams);
  }

  apiActionConfigPrepare(
    baseURL?: string,
    options?: IApiActionConfigPrepareOptions,
    authToken?: TypeAuthToken,
  ) {
    // custom
    const optionsCustom: any = {
      params: options?.query,
      query: undefined,
    };
    const interceptors = {};
    // authToken
    authToken = options?.authToken === undefined ? authToken : options?.authToken;
    if (authToken !== undefined) {
      interceptors['a-interceptor:jwt'] = { authToken };
    }
    // openapiSchema
    if (options?.openapiSchema) {
      interceptors['a-interceptor:headers'] = { openapiSchema: options?.openapiSchema };
    }
    if (!isEmptyObject(interceptors)) {
      optionsCustom.interceptors = interceptors;
    }
    // extend
    return deepExtend(
      {
        baseURL: baseURL || this.getApiBaseURL(false),
      },
      options,
      optionsCustom,
    );
  }

  getModuleConfigSafe<K extends TypeBeanScopeRecordKeys>(
    moduleName: K,
  ): IBeanScopeRecord[K] extends { config?: infer CONFIG } ? CONFIG : undefined {
    const module = this.sys.meta.module.get(moduleName);
    if (module) {
      const scope = this.sys.bean.scope(moduleName);
      return cast(scope).config;
    }
    let config = this.sys.config.modules[moduleName as any];
    if (!config) {
      config = this.sys.config.modules[moduleName as any] = {} as any;
    }
    return config;
  }

  getModuleConfigOriginal<K extends TypeBeanScopeRecordKeys>(
    moduleName: K,
  ): IBeanScopeRecord[K] extends { config?: infer CONFIG } ? CONFIG : undefined {
    return this.sys.configOriginal.modules![moduleName as any] ?? {};
  }

  parseResourceApi(resource: string, api?: string) {
    const parts = resource.split(':');
    return (
      api ??
      combineApiPathControllerAndAction(
        parts[0],
        parts[1],
        undefined,
        true,
        true,
        this.sys.env.API_PREFIX,
      )
    );
  }
}

export function uuid(): string {
  return _uuid();
}

export function isUuid(str: string): boolean {
  if (!str) return false;
  const length = str.length;
  return length === 36 || length === 32;
}

// for hold on CustomRefImpl
export function objectAssignReactive<T = any>(...args): T {
  let target = args[0];
  if (!target || typeof target !== 'object') throw new Error('invalid args');
  if (!isReactive(target)) {
    target = reactive(target);
  }
  for (let i = 1; i < args.length; i++) {
    const source = args[i];
    if (!source) continue;
    const keys = Object.getOwnPropertyNames(source);
    for (const key of keys) {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      target[key] = desc?.value;
    }
  }
  return target;
}

export function deepExtend<T = any>(...args): T {
  return extend(true, ...args);
}

export function deepEqual(
  actual: unknown,
  expected: unknown,
  opts?: { strict?: boolean },
): boolean {
  return DeepEqual(actual, expected, opts);
}

export function disposeInstance(instance: any) {
  instance?.__dispose__?.();
}

export function polyfillDispose(instance: any) {
  if (!instance || instance.__dispose__) return;
  Object.getPrototypeOf(instance).__dispose__ = () => {};
}

export function beanFullNameFromOnionName(
  onionName: string,
  sceneName: keyof IBeanSceneRecord,
): keyof IBeanRecord {
  return onionName.replace(':', `.${sceneName}.`) as unknown as keyof IBeanRecord;
}

export function onionNameFromBeanFullName(
  beanFullName: string,
  sceneName: keyof IBeanSceneRecord,
): string {
  return beanFullName.replace(`.${sceneName}.`, ':');
}

export function convertToUnit(str: number, unit?: string): string;
export function convertToUnit(
  str: string | number | null | undefined,
  unit?: string,
): string | undefined;
export function convertToUnit(
  str: string | number | null | undefined,
  unit: string = 'px',
): string | undefined {
  if (str === undefined || str === null || str === '') {
    return undefined;
  }
  const num = Number(str);
  if (Number.isNaN(num)) {
    return String(str);
  } else if (!Number.isFinite(num)) {
    return undefined;
  } else {
    return `${num}${unit}`;
  }
}

export function isHttpUrl(url?: string): boolean {
  return !!url && (url.startsWith('http://') || url.startsWith('https://'));
}

export function throwErrorComponentUnmounted() {
  const error = new Error();
  error.code = 600;
  throw error;
}
