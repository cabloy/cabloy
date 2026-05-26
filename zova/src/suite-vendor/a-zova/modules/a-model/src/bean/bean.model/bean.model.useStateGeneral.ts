import type {
  DefaultError,
  QueryClient,
  QueryKey,
  UseQueryDefinedReturnType,
  UseQueryOptions,
  UseQueryReturnType,
} from '@tanstack/vue-query';
import type { UnwrapNestedRefs } from 'vue';

import type {
  DefinedInitialQueryOptions,
  UndefinedInitialQueryOptions,
} from '../../common/types.js';
import type { StateType } from '../../types/query.js';

import { BeanModelUseState } from './bean.model.useState.js';

export class BeanModelUseStateGeneral extends BeanModelUseState {
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'db' | 'local' | 'cookie' | 'mem',
    options: UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'db' | 'local' | 'cookie' | 'mem',
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): TData;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'db' | 'local' | 'cookie' | 'mem',
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
  ): UnwrapNestedRefs<UseQueryReturnType<TData, TError>>;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'data',
    options: DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryDefinedReturnType<TData, TError>>;
  $useState<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    stateType: 'data',
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseQueryReturnType<TData, TError>>;
  $useState(stateType: StateType, options, queryClient) {
    switch (stateType) {
      case 'db':
        return this.$useStateDb(options, queryClient);
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
