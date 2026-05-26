export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';
export const isNil = (val: any): val is null | undefined => isUndefined(val) || val === null;

export const isObject = (fn: any): fn is object => !isNil(fn) && typeof fn === 'object';

export function isEmptyObject(obj: any): boolean {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

export function isPlainObject(fn: any): fn is object {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
  );
}

export function addLeadingSlash(path?: string): string {
  return path && typeof path === 'string' ? (path.charAt(0) !== '/' ? `/${path}` : path) : '';
}

export function normalizePath(path?: string): string {
  return path
    ? path.startsWith('/')
      ? `/${path.replace(/\/+$/, '')}`.replace(/\/+/g, '/')
      : `/${path.replace(/\/+$/, '')}`
    : '/';
}

export const stripEndSlash = (path: string) =>
  path[path.length - 1] === '/' ? path.slice(0, path.length - 1) : path;

export const isFunction = (val: any): val is Function => typeof val === 'function';
export const isString = (val: any): val is string => typeof val === 'string';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isConstructor = (val: any): boolean => val === 'constructor';
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isSymbol = (val: any): val is symbol => typeof val === 'symbol';

export function isClass(fn: any) {
  return typeof fn === 'function' && !!fn.name && fn.prototype?.constructor === fn;
}

export function isClassStrict(fn: any) {
  return typeof fn === 'function' && /^class(?:\s|\{)/.test(fn.toString());
}

export function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise || (obj && typeof obj.then === 'function');
}

export function isNilOrEmptyString(str?: string | undefined | null): str is null | undefined | '' {
  return str === undefined || str === null || str === '';
}

export function checkMeta(meta?: {}, data?: {}): boolean {
  // check none
  if (!meta) return true;
  // loop
  for (const key in meta) {
    const metaItem = meta[key];
    if (isNil(metaItem)) continue;
    if (!Array.isArray(metaItem) && metaItem !== data?.[key]) return false;
    if (Array.isArray(metaItem) && !metaItem.includes(data?.[key])) return false;
  }
  // default
  return true;
}

export function safeBoolean(value?: undefined | null | boolean | string) {
  if (isNil(value) || value === 'false' || value === '0') return false;
  return Boolean(value);
}
