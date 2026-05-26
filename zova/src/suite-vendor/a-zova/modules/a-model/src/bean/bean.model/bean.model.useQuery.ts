import type {
  DefaultError,
  QueryClient,
  QueryKey,
  UseQueryDefinedReturnType,
  UseQueryOptions,
  UseQueryReturnType,
} from '@tanstack/vue-query';
import type { UnwrapNestedRefs } from 'vue';

import { checkErrorJwtExpired } from '@cabloy/utils';
import { useQuery } from '@tanstack/vue-query';
import { cast } from 'zova';

import type {
  DefinedInitialQueryOptions,
  UndefinedInitialQueryOptions,
} from '../../common/types.js';

import { resolveStaleTime } from '../../types/index.js';
import { BeanModelQuery } from './bean.model.query.js';

export class BeanModelUseQuery extends BeanModelQuery {
  $useQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryReturnType<TData, TError>>;
  $useQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryDefinedReturnType<TData, TError>>;
  $useQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryReturnType<TData, TError>>;
  $useQuery(options, queryClient) {
    const queryKey = this.self._forceQueryKeyPrefix(options.queryKey);
    const persister = this._createPersister(options.meta?.persister);
    const optionsDefault: any = {};
    if (!cast(options).meta?.disableErrorEffect) {
      optionsDefault.throwOnError = (error: Error, query) => {
        let errorInfo = cast(options).meta?.errorInfo;
        if (typeof errorInfo === 'function') {
          errorInfo = errorInfo(error, query);
        }
        if (!error.message.includes('useQuery:') && !checkErrorJwtExpired(error)) {
          error.message = `useQuery: [${queryKey.join(', ')}]: ${error.message}`;
        }
        this.$errorHandler(error, errorInfo ?? 'useQuery');
        return false;
      };
    }
    options = Object.assign(optionsDefault, options, { queryKey, persister });
    // staleTime
    const sync = typeof options.meta?.persister === 'object' && options.meta?.persister?.sync;
    if (sync !== true) {
      const staleTime = options.staleTime ?? this.scopeSelf.config.query.staleTime.async;
      const queryCache = this.$queryFind({ queryKey });
      const queryCacheExists = queryCache?.state.data !== undefined;
      options.staleTime = query => {
        if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration && queryCacheExists) {
          return resolveStaleTime(this.scopeSelf.config.query.staleTime.ssr, query);
        }
        return resolveStaleTime(staleTime, query);
      };
    }
    return this.ctx.util.instanceScope(() => {
      return useQuery(options, queryClient);
    });
  }
}
