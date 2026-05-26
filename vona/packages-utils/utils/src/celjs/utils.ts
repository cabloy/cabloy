import { StringPrefixCel, StringPrefixRaw, StringPrefixRegexp } from './types.ts';

export function regexp(str: string) {
  return `${StringPrefixRegexp}${str}`;
}

// should return any
export function cel(str: string): any {
  return `${StringPrefixCel}${str}`;
}

export function raw(str: string) {
  return `${StringPrefixRaw}${str}`;
}

export function createFunction(expression: string, scopeKeys?: string[]): Function {
  let fn: Function;
  try {
    const js = `return (${expression})`;
    fn =
      scopeKeys && scopeKeys.length > 0 ? new Function(scopeKeys.join(','), js) : new Function(js);
  } catch (_err) {
    fn =
      scopeKeys && scopeKeys.length > 0
        ? new Function(scopeKeys.join(','), expression)
        : new Function(expression);
  }
  return fn;
}

export function evaluateSimple(expression: string, scope?: object) {
  const scopeKeys = scope ? Object.keys(scope) : undefined;
  const scopeValues = scope ? Object.values(scope) : undefined;
  const fn = createFunction(expression, scopeKeys);
  return scopeValues ? fn(...scopeValues) : fn();
}
