import type {
  DataTag,
  DefaultError,
  InvalidateOptions,
  InvalidateQueryFilters,
  Query,
  QueryFilters,
  QueryKey,
  RefetchOptions,
  RefetchQueryFilters,
  SetDataOptions,
  Updater,
} from '@tanstack/vue-query';

import localforage from 'localforage';
import { cast } from 'zova';

import type { MaybeRefDeep, NoUnknown } from '../../common/types.js';

import { BeanModelCookie } from './bean.model.cookie.js';

export class BeanModelQuery extends BeanModelCookie {
  $setQueryData<
    TQueryFnData,
    TTaggedQueryKey extends QueryKey,
    TData = TTaggedQueryKey extends DataTag<unknown, infer TaggedValue>
      ? TaggedValue
      : TQueryFnData,
  >(
    queryKey: TTaggedQueryKey,
    updater: Updater<NoInfer<TData> | undefined, NoInfer<TData> | undefined>,
    persisterSave?: boolean,
    options?: MaybeRefDeep<SetDataOptions>,
  ): TData | undefined;
  $setQueryData<TQueryFnData, TData = NoUnknown<TQueryFnData>>(
    queryKey: MaybeRefDeep<QueryKey>,
    updater: Updater<NoInfer<TData> | undefined, NoInfer<TData> | undefined>,
    persisterSave?: boolean,
    options?: MaybeRefDeep<SetDataOptions>,
  ): TData | undefined;
  $setQueryData(queryKey, updater, persisterSave, options) {
    queryKey = this._forceQueryKeyPrefix(queryKey);
    const data = this.$queryClient.setQueryData(queryKey, updater, options);
    if (data === undefined) {
      if (persisterSave) {
        this.$persisterRemove(queryKey);
      }
      this.$setQueryDataDirect(queryKey, data);
    } else {
      if (persisterSave) {
        this.$persisterSave(queryKey);
      }
    }
    return data;
  }

  $queryFind<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData>(
    filters: QueryFilters,
  ): Query<TQueryFnData, TError, TData> | undefined {
    filters = this.$normalizeFilters(filters);
    return this.$queryClient.getQueryCache().find(filters as any);
  }

  $invalidateQueries(
    filters?: InvalidateQueryFilters,
    options?: MaybeRefDeep<InvalidateOptions>,
  ): Promise<void> {
    filters = this.$normalizeFilters(filters);
    return this.$queryClient.invalidateQueries(filters, options);
  }

  $refetchQueries(
    filters?: RefetchQueryFilters,
    options?: MaybeRefDeep<RefetchOptions>,
  ): Promise<void> {
    filters = this.$normalizeFilters(filters);
    return this.$queryClient.refetchQueries(filters, options);
  }

  $setQueryDataDirect(queryKey: QueryKey, value: any) {
    const query = this.$queryFind({ queryKey, exact: true });
    query?.setData(value);
  }

  async $clear() {
    const queries = this.$queryClient.getQueryCache().getAll();
    for (const query of queries) {
      query?.setData(undefined);
    }
    // remove all db cache
    await localforage.clear();
  }

  $normalizeFilters<T extends {}>(filters?: T): T {
    if (!filters) filters = {} as T;
    const queryKey = this._forceQueryKeyPrefix(cast(filters).queryKey);
    return { ...filters, queryKey };
  }
}
