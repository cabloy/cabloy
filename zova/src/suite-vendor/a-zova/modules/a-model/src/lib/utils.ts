import type { DataQuery } from '../types/query.js';

export type TypeQueryAutoLoadFn<T> = () => DataQuery<T> | undefined;

export async function $QueryAutoLoad<T = any>(fn: TypeQueryAutoLoadFn<T>) {
  return _QueryAutoLoadInner<T>(fn);
}

export async function $QueriesAutoLoad<T1 = any, T2 = any, T3 = any, T4 = any, T5 = any>(
  fn1?: TypeQueryAutoLoadFn<T1>,
  fn2?: TypeQueryAutoLoadFn<T2>,
  fn3?: TypeQueryAutoLoadFn<T3>,
  fn4?: TypeQueryAutoLoadFn<T4>,
  fn5?: TypeQueryAutoLoadFn<T5>,
  ...fns: TypeQueryAutoLoadFn<any>[]
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
    _QueryAutoLoadInner<T1>(fn1),
    _QueryAutoLoadInner<T2>(fn2),
    _QueryAutoLoadInner<T3>(fn3),
    _QueryAutoLoadInner<T4>(fn4),
    _QueryAutoLoadInner<T5>(fn5),
  ];
  if (fns.length > 0) {
    promises = promises.concat(fns.map(fn => _QueryAutoLoadInner(fn)));
  }
  return (await Promise.all(promises)) as any;
}

async function _QueryAutoLoadInner<T = any>(fn?: TypeQueryAutoLoadFn<T>) {
  if (!fn) return;
  const query = fn();
  if (query && query.data === undefined) {
    await query.suspense();
  }
  return query;
}
