import { extend } from '@cabloy/extend';

const __SepDefault = '.';

export function cascadeExtendKeys(
  scope: object,
  source: object | undefined,
  prefix?: string,
  sep: string = __SepDefault,
): string[] | undefined {
  if (!source) return undefined;
  if (prefix === undefined) prefix = '';
  // filter
  let keys = Object.keys(source).filter(key => {
    return key === prefix || key.indexOf(prefix + sep) === 0;
  });
  if (keys.length === 0) return undefined;
  if (keys.length === 1 && keys[0] === prefix) return keys;
  // sort
  keys.sort((a, b) => {
    return a.split(sep).length - b.split(sep).length;
  });
  // filter
  keys = keys.filter(key => {
    if (key === prefix) return true;
    const parts = key.substring(prefix!.length + 1).split(sep);
    return parts.every(part => !!scope[part]);
  });
  // ok
  return keys.length === 0 ? undefined : keys;
}

export function cascadeExtend(
  scope: object,
  source: object | undefined,
  prefix?: string,
  sep: string = __SepDefault,
): object | undefined {
  if (!source) return undefined;
  // keys
  const keys = cascadeExtendKeys(scope, source, prefix, sep);
  if (!keys) return undefined;
  // special
  if (keys.length === 1) return source[keys[0]];
  // extend
  const result = {};
  for (const key of keys) {
    extend(true, result, source[key]);
  }
  return result;
}
