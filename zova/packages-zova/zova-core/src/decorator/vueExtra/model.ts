export function modelSet(fn: Function) {
  return fn();
}

export function modelGet<T>(args, fn: (value: T) => T) {
  return fn(args[0]);
}
