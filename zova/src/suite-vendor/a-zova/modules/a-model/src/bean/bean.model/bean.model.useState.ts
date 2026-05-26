import type {
  DefaultError,
  Query,
  QueryClient,
  QueryKey,
  QueryMeta,
  UseQueryDefinedReturnType,
  UseQueryOptions,
  UseQueryReturnType,
} from '@tanstack/vue-query';
import type { UnwrapNestedRefs } from 'vue';

import { hashKey } from '@tanstack/vue-query';
import { deepExtend } from 'zova';

import type {
  DefinedInitialQueryOptions,
  UndefinedInitialQueryOptions,
} from '../../common/types.js';
import type { QueryMetaPersister, UseQueryComputedOptions } from '../../types/query.js';

import { BeanModelUseQuery } from './bean.model.useQuery.js';

const SymbolUseQueries = Symbol('SymbolUseQueries');
const SymbolUseComputeds = Symbol('SymbolUseComputeds');

export class BeanModelUseState extends BeanModelUseQuery {
  private [SymbolUseQueries]: Record<string, unknown> = {};
  private [SymbolUseComputeds]: Record<string, unknown> = {};

  async $loadStateDb<T>(dbData: T): Promise<T> {
    return await dbData;
  }

  $useStateDb<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateDb<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateDb<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateDb(options, queryClient) {
    options = deepExtend(
      {
        meta: {
          maxAge: this.scopeSelf.config.persister.maxAge.local,
        } satisfies QueryMeta,
      },
      options,
      {
        enabled: false,
        staleTime: Infinity,
        meta: {
          ssr: {
            dehydrate: false,
          },
          persister: { storage: 'db', sync: false },
        } satisfies QueryMeta,
      },
    );
    const self = this;
    return this.$customRef(() => {
      return {
        get() {
          return self._handleAsyncDataGet(options, queryClient, true);
        },
        set(value) {
          self._handleSyncDataSet(options, queryClient, true, value);
        },
      };
    });
  }

  $useStateLocal<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateLocal<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateLocal<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateLocal(options, queryClient) {
    options = deepExtend(
      {
        meta: {
          persister: {
            serializeDefault: (obj?: Query) => {
              return this.$serializeLocal(obj);
            },
            deserializeDefault: (value?: string) => {
              return this.$deserializeLocal(value);
            },
            storageKeySimplify: true,
          },
        } satisfies QueryMeta,
      },
      options,
      {
        enabled: false,
        staleTime: Infinity,
        meta: {
          persister: { storage: 'local', sync: true } satisfies QueryMetaPersister,
        },
      },
    );
    const self = this;
    return this.$customRef(() => {
      return {
        get() {
          return self._handleSyncDataGet(options, queryClient, true);
        },
        set(value) {
          self._handleSyncDataSet(options, queryClient, true, value);
        },
      };
    });
    // return useComputed({
    //   get() {
    //     return self._handleSyncDataGet(options, queryClient, true);
    //   },
    //   set(value) {
    //     self._handleSyncDataSet(options, queryClient, true, value);
    //   },
    // });
  }

  $useStateCookie<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateCookie<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateCookie<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateCookie(options, queryClient) {
    options = deepExtend(
      {
        meta: {
          persister: {
            serializeDefault: (obj?: Query) => {
              return this.$serializeCookie(obj);
            },
            deserializeDefault: (value?: string) => {
              const cookieType = options.meta.persister.cookieType;
              return this.$deserializeCookie(this._cookieCoerce(value, cookieType));
            },
            storageKeySimplify: true,
          },
        } satisfies QueryMeta,
      },
      options,
      {
        enabled: false,
        staleTime: Infinity,
        meta: {
          persister: { storage: 'cookie', sync: true } satisfies QueryMetaPersister,
        },
      },
    );
    const self = this;
    return this.$customRef(() => {
      return {
        get() {
          return self._handleSyncDataGet(options, queryClient, true);
        },
        set(value) {
          self._handleSyncDataSet(options, queryClient, true, value);
        },
      };
    });
    // return useComputed({
    //   get() {
    //     return self._handleSyncDataGet(options, queryClient, true);
    //   },
    //   set(value) {
    //     self._handleSyncDataSet(options, queryClient, true, value);
    //   },
    // });
  }

  $useStateMem<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateMem<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateMem<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useStateMem(options, queryClient) {
    options = deepExtend({}, options, {
      enabled: false,
      staleTime: Infinity,
      meta: {
        persister: false,
      },
    });
    const self = this;
    return this.$customRef(() => {
      return {
        get() {
          return self._handleSyncDataGet(options, queryClient, false);
        },
        set(value) {
          self._handleSyncDataSet(options, queryClient, false, value);
        },
      };
    });
    // return useComputed({
    //   get() {
    //     return self._handleSyncDataGet(options, queryClient, false);
    //   },
    //   set(value) {
    //     self._handleSyncDataSet(options, queryClient, false, value);
    //   },
    // });
  }

  $useStateComputed<TDATA, TQueryKey extends QueryKey>(
    options: UseQueryComputedOptions<TDATA, TQueryKey>,
  ): TDATA {
    const queryKey = this.self._forceQueryKeyPrefix(options.queryKey);
    const queryHash = hashKey(queryKey);
    if (!this[SymbolUseComputeds][queryHash]) {
      this[SymbolUseComputeds][queryHash] = this.$computed(options.queryFn, options.debugOptions);
    }
    return this[SymbolUseComputeds][queryHash] as unknown as TDATA;
  }

  $useStateData<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryReturnType<TData, TError>>;
  $useStateData<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryDefinedReturnType<TData, TError>>;
  $useStateData<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryReturnType<TData, TError>>;
  $useStateData(options, queryClient) {
    const queryKey = this.self._forceQueryKeyPrefix(options.queryKey);
    const queryHash = hashKey(queryKey);
    if (!this[SymbolUseQueries][queryHash]) {
      const useQuery = this.$useQuery(options, queryClient);
      this[SymbolUseQueries][queryHash] = useQuery;
      if (!options.meta?.disableSuspenseOnInit) {
        useQuery.suspense();
      }
    }
    return this[SymbolUseQueries][queryHash];
  }

  private _handleAsyncDataGet(options, queryClient, persister) {
    const query = this.$useStateData(options, queryClient);
    if (query.data !== undefined) return query.data;
    return this._handleAsyncDataGet_inner(options, queryClient, persister);
  }

  private async _handleAsyncDataGet_inner(options, queryClient, persister) {
    const queryKey = options.queryKey;
    const query = this.$useStateData(options, queryClient);
    if (persister) {
      const data = await this.$persisterLoad(queryKey);
      if (data !== undefined) {
        this.$setQueryData(queryKey, data, false);
      }
    }
    if (query.data === undefined) {
      this._handleSyncDataGet_defaultData(queryKey, options);
    }
    return query.data;
  }

  private _handleSyncDataGet(options, queryClient, persister) {
    const queryKey = options.queryKey;
    const query = this.$useStateData(options, queryClient);
    if (query.data !== undefined) return query.data;
    if (persister) {
      const data = this.$persisterLoad(queryKey);
      if (data !== undefined) {
        this.$setQueryData(queryKey, data, false);
      }
    }
    if (query.data === undefined) {
      this._handleSyncDataGet_defaultData(queryKey, options);
    }
    return query.data;
  }

  private _handleSyncDataGet_defaultData(queryKey, options) {
    let defaultData = options.meta?.defaultData;
    if (typeof defaultData === 'function') {
      defaultData = defaultData();
    }
    if (defaultData !== undefined) {
      // need not persister save
      this.$setQueryData(queryKey, defaultData, false);
    }
  }

  private _handleSyncDataSet(options, queryClient, persister, value) {
    const queryKey = options.queryKey;
    const query = this.$useStateData(options, queryClient);
    this.$setQueryData(queryKey, value, persister);
    return query;
  }
}
