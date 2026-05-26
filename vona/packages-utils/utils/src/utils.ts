import { isNil } from './check.ts';

export interface IParamsAndQuery {
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export function deprecated(oldUsage, newUsage) {
  const message = '`'
    .concat(oldUsage, '` is deprecated and will be removed in a later version. Use `')
    .concat(newUsage, '` instead');

  console.warn(message);
}

export async function catchError<T>(
  fnMethod: (...args: any[]) => Promise<T>,
): Promise<[T, undefined] | [undefined, Error]> {
  let error: Error | undefined;
  let data: T | undefined;
  try {
    data = await fnMethod();
  } catch (err) {
    error = err as Error;
  }
  return error ? [undefined, error!] : [data!, undefined];
}

export function catchErrorSync<T>(
  fnMethod: (...args: any[]) => T,
): [T, undefined] | [undefined, Error] {
  let error: Error | undefined;
  let data: T | undefined;
  try {
    data = fnMethod();
  } catch (err) {
    error = err as Error;
  }
  return error ? [undefined, error!] : [data!, undefined];
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function replaceTemplate(content: string, scope: object) {
  if (!content) return content;
  return content.toString().replace(/(\\)?\{\{ *([\w.]+) *\}\}/g, (block, skip, key) => {
    if (skip) {
      return block.substring(skip.length);
    }
    const value = getProperty<string>(scope, key);
    return value !== undefined ? value : '';
  });
}

export function setProperty<T>(obj: object, name: string, value: T) {
  const names = name.split('.');
  if (names.length === 1) {
    obj[name] = value;
  } else {
    for (let i = 0; i < names.length - 1; i++) {
      const _obj = obj[names[i]];
      if (_obj) {
        obj = _obj;
      } else {
        obj = obj[names[i]] = {};
      }
    }
    obj[names[names.length - 1]] = value;
  }
}

export function hasProperty(obj: object | undefined, name: string, sep?: string): boolean {
  return _hasProperty(obj, name, sep);
}

export function getProperty<T>(obj: object | undefined, name: string, sep?: string) {
  return _getProperty<T>(obj, name, sep, false);
}

export function getPropertyObject<T>(obj: object | undefined, name: string, sep?: string) {
  return _getProperty<T>(obj, name, sep, true);
}

const __keysIgnore = ['constructor', 'prototype', '__proto__'];

function _hasProperty(_obj: object | undefined, name: string, sep: string | undefined): boolean {
  if (!_obj) return false;
  let obj = _obj as object;
  const names = name.split(sep || '.');
  // loop
  for (const _name of names) {
    const [name, index] = _parsePropertyKey(_name);
    if (__keysIgnore.includes(name)) throw new Error(`invalid prop: ${name}`);
    if (obj === undefined || !Object.hasOwnProperty.call(obj, name)) {
      return false;
    }
    obj = obj[name];
    if (index !== undefined) {
      obj = obj[index];
    }
  }
  return true;
}

function _getProperty<T>(
  _obj: object | undefined,
  name: string,
  sep: string | undefined,
  forceObject: boolean,
): T | undefined {
  if (!_obj) return undefined;
  let obj = _obj as object;
  const names = name.split(sep || '.');
  // loop
  for (const _name of names) {
    const [name, index] = _parsePropertyKey(_name);
    if (__keysIgnore.includes(name)) throw new Error(`invalid prop: ${name}`);
    if (obj[name] === undefined) {
      // not check obj[name] === null
      if (forceObject) {
        if (index === undefined) {
          obj[name] = {};
        } else {
          obj[name] = [];
        }
      } else {
        obj = obj[name];
        break;
      }
    }
    obj = obj[name];
    if (index !== undefined) {
      obj = obj[index];
    }
  }
  return obj as T | undefined;
}

function _parsePropertyKey(name: string): [string, number | undefined] {
  const matched = name.match(/([^[]+)\[(\d+)\]/);
  if (!matched) return [name, undefined];
  return [matched[1], Number.parseInt(matched[2])];
}

export function getRandomInt(size: number, start: number = 0) {
  return Math.floor(Math.random() * size) + start;
}

export function combineParamsAndQuery(path?: string, options?: IParamsAndQuery): string {
  return combineQueries(defaultPathSerializer(path, options?.params), options?.query);
}

export function combineQueries(pagePath?: string, queries?: Record<string, any>): string {
  pagePath = pagePath ?? '/';
  //
  if (!queries) return pagePath;
  //
  const query2: any[] = [];
  const parts: string[] = [];
  if (queries) {
    for (const key in queries) {
      const value = queries[key];
      if (isNil(value)) continue;
      if (typeof value === 'object') {
        query2.push([key, value]);
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }
  // query2
  for (const [key, value] of query2) {
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`);
  }
  if (parts.length === 0) return pagePath;
  //
  const str = parts.join('&');
  //
  const pos = pagePath.indexOf('?');
  if (pos === -1) return `${pagePath}?${str}`;
  if (pos === pagePath.length - 1) return `${pagePath}${str}`;
  return `${pagePath}&${str}`;
}

const PATH_PARAM_RE = /\{([^{}/]+)\}/g;
const PATH_PARAM_RE2 = /:([^/]+)/g;
export function defaultPathSerializer<T extends string | undefined>(
  pathName?: T,
  pathParams?: Record<string, any>,
): T extends string ? string : undefined {
  if (!pathName) return undefined as any;
  pathParams = pathParams ?? {};
  for (const item of [PATH_PARAM_RE, PATH_PARAM_RE2]) {
    pathName = pathName!.replace(item, (_, _part: string) => {
      if (_part.includes('?')) _part = _part.substring(0, _part.length - 1);
      const value = pathParams?.[_part];
      if (value === undefined || value === null) return '';
      if (typeof value === 'object') return encodeURIComponent(JSON.stringify(value));
      return encodeURIComponent(value);
    }) as any;
  }
  return pathName as any;
}

export function ensureArray(arr: any, sep?: string) {
  if (arr === undefined || arr === null) return undefined;
  if (arr === '') return [];
  if (Array.isArray(arr)) return arr;
  if (typeof arr === 'string' && sep !== null) return arr.split(sep ?? ',');
  return [arr];
}

export function stringLazy(fn: () => string) {
  return {
    toString: fn,
  };
}

export async function forEach<T>(
  arr: T[],
  order: boolean,
  fn: (item: T, index: number) => Promise<void>,
) {
  if (!arr) return;
  if (order) {
    for (let index = 0; index < arr.length; index++) {
      await fn(arr[index], index);
    }
  } else {
    for (let index = arr.length - 1; index >= 0; index--) {
      await fn(arr[index], index);
    }
  }
}

export function forEachSync<T>(arr: T[], order: boolean, fn: (item: T, index: number) => void) {
  if (order) {
    for (let index = 0; index < arr.length; index++) {
      fn(arr[index], index);
    }
  } else {
    for (let index = arr.length - 1; index >= 0; index--) {
      fn(arr[index], index);
    }
  }
}

export function pickObject<T extends object | undefined, K extends keyof NonNullable<T>>(
  obj: T,
  keys: K[],
): T extends undefined ? undefined : Pick<NonNullable<T>, K> {
  if (!obj) return undefined as T extends undefined ? undefined : Pick<NonNullable<T>, K>;
  const result = {} as Record<string, unknown>;
  for (const key of keys) {
    if (key in obj) {
      result[key as string] = (obj as Record<string, unknown>)[key as string];
    }
  }
  return result as unknown as T extends undefined ? undefined : Pick<NonNullable<T>, K>;
}

export function omitObject<T extends object | undefined, K extends keyof NonNullable<T>>(
  obj: T,
  keys: K[],
): T extends undefined ? undefined : Omit<NonNullable<T>, K> {
  if (!obj) return undefined as T extends undefined ? undefined : Omit<NonNullable<T>, K>;
  const result = { ...obj } as NonNullable<T>;
  for (const key of keys) {
    delete (result as Record<string, unknown>)[key as string];
  }
  return result as unknown as T extends undefined ? undefined : Omit<NonNullable<T>, K>;
}

export function typedKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>;
}
