import type { DataQuery } from '../types/query.js';

export type TypeQueryEnsureLoadedFn<TData, TError = Error | null> = () =>
  | DataQuery<TData, TError>
  | undefined;

export type TypeQueryIsStaleFn<TData, TError = Error | null> = (
  query: DataQuery<TData, TError>,
) => boolean;

export function $QueryGetFresh<TData = any, TError = Error | null>(
  fn: TypeQueryEnsureLoadedFn<TData, TError>,
  isStale: TypeQueryIsStaleFn<TData, TError>,
): TData | undefined {
  const query = fn();
  if (!query) return;
  if (!isStale(query)) return query.data;
  void query.suspense().catch(() => undefined);
}

export async function $QueryEnsureFresh<TData = any, TError = Error | null>(
  fn: TypeQueryEnsureLoadedFn<TData, TError>,
  isStale: TypeQueryIsStaleFn<TData, TError>,
): Promise<TData | undefined> {
  const query = fn();
  if (!query) return;
  if (!isStale(query)) return query.data;
  const result = await query.suspense();
  if (result.error) throw result.error;
  return result.data;
}

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
