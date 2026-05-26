import type {
  DefaultError,
  DehydratedState,
  Query,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import type { DebuggerOptions, UnwrapNestedRefs } from 'vue';

import 'zova';

declare module 'zova' {
  export interface BeanBase {
    $queryClient: ReturnType<typeof useQueryClient>;
  }
}

declare module 'zova-module-a-ssr' {
  export interface SSRContextStateDefer {
    query: DehydratedState;
  }
}

declare module '@tanstack/vue-query' {
  export interface Register {
    queryMeta: MyQueryMeta;
    mutationMeta: MyMutationMeta;
  }
}

export type { UseQueryOptions } from '@tanstack/vue-query';

export interface MyQueryMetaBase extends Record<string, unknown> {
  defaultData?: (() => any) | any;
  ssr?: QueryMetaSSR;
  persister?: QueryMetaPersister | boolean;
  disableErrorEffect?: boolean;
  disableSuspenseOnInit?: boolean;
}

export interface MyQueryMeta extends MyQueryMetaBase {
  errorInfo?: ((error, query) => string) | string;
}

export interface MyMutationMeta extends MyQueryMetaBase {
  errorInfo?: ((error, variables, context) => string) | string;
}

export interface QueryMetaSSR {
  /** default is true */
  dehydrate?: boolean;
}

export type QueryMetaPersisterStorage = 'cookie' | 'local' | 'db' | undefined;

export type QueryMetaPersisterCookieType =
  | 'auto'
  | 'boolean'
  | 'number'
  | 'date'
  | 'string'
  | undefined;

export type StateType = 'db' | 'local' | 'cookie' | 'mem' | 'data';

export type StaleTime = number;
export type StaleTimeFunction<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = StaleTime | ((query: Query<TQueryFnData, TError, TData, TQueryKey>) => StaleTime);

export type MaxAgeTime = StaleTime;
export type MaxAgeTimeFunction<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = StaleTimeFunction<TQueryFnData, TError, TData, TQueryKey>;

export interface QueryMetaPersister {
  /** default is false */
  sync?: boolean;
  /** default is db if async, local if sync */
  storage?: QueryMetaPersisterStorage;
  /** default is false if db, true if local/cookie */
  storageKeySimplify?: boolean;
  /** default is 24 hours */
  maxAge?: MaxAgeTime;
  /**
   * How to serialize the data to storage.
   * @default `JSON.stringify`
   */
  serialize?: (persistedQuery: any, serializeDefault: (persistedQuery: any) => any) => any;
  serializeDefault?: (persistedQuery: any) => any;
  /**
   * How to deserialize the data from storage.
   * @default `JSON.parse`
   */
  deserialize?: (cachedString: any, deserializeDefault: (cachedString: any) => any) => any;
  deserializeDefault?: (cachedString: any) => any;
  prefix?: string;
  buster?: string;
  cookieType?: QueryMetaPersisterCookieType;
  refetchOnRestore?: boolean | 'always';
}

export type DataQuery<TData> = UnwrapNestedRefs<
  ReturnType<typeof useQuery<TData | undefined, Error | null>>
>;

export type DataMutation<TData = unknown, TVariables = void, TContext = unknown> = UnwrapNestedRefs<
  ReturnType<typeof useMutation<TData, DefaultError, TVariables, TContext>>
>;

export function resolveStaleTime<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  staleTime: undefined | StaleTimeFunction<TQueryFnData, TError, TData, TQueryKey>,
  query: Query<TQueryFnData, TError, TData, TQueryKey>,
): StaleTime | undefined {
  return typeof staleTime === 'function' ? staleTime(query) : staleTime;
}

export function resolveMaxAgeTime<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  maxAge: undefined | MaxAgeTimeFunction<TQueryFnData, TError, TData, TQueryKey>,
  query: Query<TQueryFnData, TError, TData, TQueryKey>,
): MaxAgeTime | undefined {
  return typeof maxAge === 'function' ? maxAge(query) : maxAge;
}

export type UseQueryComputedFn<TDATA> = (oldValue?: TDATA) => TDATA;

export interface UseQueryComputedOptions<TDATA, TQueryKey> {
  queryKey: TQueryKey;
  queryFn: UseQueryComputedFn<TDATA>;
  debugOptions?: DebuggerOptions;
}
