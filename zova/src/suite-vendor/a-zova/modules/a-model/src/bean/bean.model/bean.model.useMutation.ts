import type {
  DefaultError,
  MutationKey,
  MutationObserverOptions,
  QueryClient,
  UseMutationReturnType,
} from '@tanstack/vue-query';
import type { UnwrapNestedRefs } from 'vue';

import { hashKey, useMutation } from '@tanstack/vue-query';
import { cast } from 'zova';

import type { MaybeRefDeep } from '../../common/types.js';

import { BeanModelUseStateGeneral } from './bean.model.useStateGeneral.js';

const SymbolUseMutations = Symbol('SymbolUseMutations');

export class BeanModelUseMutation extends BeanModelUseStateGeneral {
  private [SymbolUseMutations]: Record<string, unknown> = {};

  $useMutation<TData = unknown, TVariables = void, TContext = unknown>(
    mutationOptions: MaybeRefDeep<
      MutationObserverOptions<TData, DefaultError, TVariables, TContext>
    >,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseMutationReturnType<TData, DefaultError, TVariables, TContext>> {
    return this.ctx.util.instanceScope(() => {
      return useMutation(mutationOptions, queryClient) as any;
    });
  }

  $useMutationData<TData = unknown, TVariables = void, TContext = unknown>(
    mutationOptions: MaybeRefDeep<
      MutationObserverOptions<TData, DefaultError, TVariables, TContext>
    >,
    queryClient?: QueryClient,
  ): UnwrapNestedRefs<UseMutationReturnType<TData, DefaultError, TVariables, TContext>> {
    let mutationKey: MutationKey = cast(mutationOptions).mutationKey;
    if (!mutationKey || mutationKey.length === 0) throw new Error('should specify mutationKey');
    mutationKey = this.self._forceQueryKeyPrefix(mutationKey);
    const mutationHash = hashKey(mutationKey);
    if (!this[SymbolUseMutations][mutationHash]) {
      const optionsDefault: any = {};
      if (!cast(mutationOptions).meta?.disableErrorEffect) {
        optionsDefault.onError = (error, variables, context) => {
          let errorInfo = cast(mutationOptions).meta?.errorInfo;
          if (typeof errorInfo === 'function') {
            errorInfo = errorInfo(error, variables, context);
          }
          this.$errorHandler(error, errorInfo ?? 'useMutationData');
        };
      }
      mutationOptions = Object.assign(optionsDefault, mutationOptions, { mutationKey });
      this[SymbolUseMutations][mutationHash] = this.$useMutation(mutationOptions, queryClient);
    }
    return this[SymbolUseMutations][mutationHash] as UnwrapNestedRefs<
      UseMutationReturnType<TData, DefaultError, TVariables, TContext>
    >;
  }
}
