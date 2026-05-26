export function mutate<T>(target: T, fn: (copyState: T) => T | undefined | void): T {
  if (!target) return target;
  const copyState = (Array.isArray(target) ? target.slice() : Object.assign({}, target)) as T;
  const res = fn(copyState);
  return res === undefined ? copyState : res;
}
