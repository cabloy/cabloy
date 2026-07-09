import type { DataQuery } from '../types/query.js';

export type TypeQueryEnsureLoadedFn<T> = () => DataQuery<T> | undefined;

export async function $QueryEnsureLoaded<T = any>(fn: TypeQueryEnsureLoadedFn<T>) {
  return _QueryEnsureLoadedInner<T>(fn);
}

export async function $QueriesEnsureLoaded<T1 = any, T2 = any, T3 = any, T4 = any, T5 = any>(
  fn1?: TypeQueryEnsureLoadedFn<T1>,
  fn2?: TypeQueryEnsureLoadedFn<T2>,
  fn3?: TypeQueryEnsureLoadedFn<T3>,
  fn4?: TypeQueryEnsureLoadedFn<T4>,
  fn5?: TypeQueryEnsureLoadedFn<T5>,
  ...fns: TypeQueryEnsureLoadedFn<any>[]
): Promise<
  [
    DataQuery<T1> | undefined,
    DataQuery<T2> | undefined,
    DataQuery<T3> | undefined,
    DataQuery<T4> | undefined,
    DataQuery<T5> | undefined,
    ...DataQuery<any>[],
  ]
> {
  let promises: any[] = [
    _QueryEnsureLoadedInner<T1>(fn1),
    _QueryEnsureLoadedInner<T2>(fn2),
    _QueryEnsureLoadedInner<T3>(fn3),
    _QueryEnsureLoadedInner<T4>(fn4),
    _QueryEnsureLoadedInner<T5>(fn5),
  ];
  if (fns.length > 0) {
    promises = promises.concat(fns.map(fn => _QueryEnsureLoadedInner(fn)));
  }
  return (await Promise.all(promises)) as any;
}

async function _QueryEnsureLoadedInner<T = any>(fn?: TypeQueryEnsureLoadedFn<T>) {
  if (!fn) return;
  const query = fn();
  if (query && query.data === undefined) {
    await query.suspense();
  }
  return query;
}
