import type { DefaultError, QueryClient, QueryKey, UseQueryOptions } from '@tanstack/vue-query';

import type {
  DefinedInitialQueryOptions,
  UndefinedInitialQueryOptions,
} from '../../common/types.js';
import type { ModelUseQueryDefinedReturnType, ModelUseQueryReturnType } from '../../types/query.js';
import type { StateType } from '../../types/query.js';

import { BeanModelUseState } from './bean.model.useState.js';

export class BeanModelUseStateGeneral extends BeanModelUseState {
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'localAsync' | 'local' | 'cookie' | 'mem',
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'localAsync' | 'local' | 'cookie' | 'mem',
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'localAsync' | 'local' | 'cookie' | 'mem',
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'data',
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): ModelUseQueryReturnType<TData, TError>;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'data',
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): ModelUseQueryDefinedReturnType<TData, TError>;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'data',
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): ModelUseQueryReturnType<TData, TError>;
  $useState(stateType: StateType, options, queryClient) {
    switch (stateType) {
      case 'localAsync':
        return this.$useStateLocalAsync(options, queryClient);
      case 'local':
        return this.$useStateLocal(options, queryClient);
      case 'cookie':
        return this.$useStateCookie(options, queryClient);
      case 'mem':
        return this.$useStateMem(options, queryClient);
      case 'data':
        return this.$useStateData(options, queryClient);
    }
  }
}
