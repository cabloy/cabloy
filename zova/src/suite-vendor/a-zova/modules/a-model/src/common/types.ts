import type { DefaultError, QueryKey, UseQueryOptions } from '@tanstack/vue-query';
import type { Ref, UnwrapRef } from 'vue';
import type { Functionable } from 'zova';

export type NonUndefinedGuard<T> = T extends undefined ? never : T;

export type UndefinedInitialQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey> & {
  initialData?: undefined;
};
export type DefinedInitialQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey> & {
  initialData: NonUndefinedGuard<TQueryFnData> | (() => NonUndefinedGuard<TQueryFnData>);
};

export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export type UnwrapLeaf =
  | Primitive
  | Functionable
  | Date
  | Error
  | RegExp
  | Map<any, any>
  | WeakMap<any, any>
  | Set<any>
  | WeakSet<any>;
export type MaybeRef<T> = Ref<T> | T;
export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T);
export type MaybeRefDeep<T> = MaybeRef<
  T extends Functionable
    ? T
    : T extends object
      ? {
          [Property in keyof T]: MaybeRefDeep<T[Property]>;
        }
      : T
>;
export type NoUnknown<T> = Equal<unknown, T> extends true ? never : T;
export type Equal<TTargetA, TTargetB> =
  (<T>() => T extends TTargetA ? 1 : 2) extends <T>() => T extends TTargetB ? 1 : 2 ? true : false;
export type DeepUnwrapRef<T> = T extends UnwrapLeaf
  ? T
  : T extends Ref<infer U>
    ? DeepUnwrapRef<U>
    : T extends {}
      ? {
          [Property in keyof T]: DeepUnwrapRef<T[Property]>;
        }
      : UnwrapRef<T>;
export type DistributiveOmit<T, TKeyOfAny extends keyof any> = T extends any
  ? Omit<T, TKeyOfAny>
  : never;
