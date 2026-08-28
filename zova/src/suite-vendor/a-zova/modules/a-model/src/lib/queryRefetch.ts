import type { Query, RefetchOptions } from '@tanstack/query-core';

import type { QueryRefetchOptions } from '../types/query.js';

type QueryRefetch<TResult> = (options?: RefetchOptions) => Promise<TResult>;
type QueryRefetchWithFetchOptions<TResult> = (
  options?: RefetchOptions & { meta?: { bypassPersister?: boolean } },
) => Promise<TResult>;

export function createQueryRefetch<TResult>(
  refetch: QueryRefetch<TResult>,
  getQuery: () => Query | undefined,
): (options?: QueryRefetchOptions) => Promise<TResult> {
  return async (refetchOptions?: QueryRefetchOptions) => {
    const { bypassPersister, ...options } = refetchOptions ?? {};
    if (!bypassPersister) return refetch(options);

    const query = getQuery();
    // A cold query may already be fetching before its result is returned. Query.fetch
    // deduplicates that request before applying the new fetch metadata, so wait for it
    // before issuing the marked fetch.
    if (query && query.state.fetchStatus !== 'idle' && query.state.data === undefined) {
      await refetch({ cancelRefetch: false });
    }

    // TanStack's public RefetchOptions does not expose the internal fetch metadata
    // forwarded by the installed QueryObserver implementation.
    const refetchWithFetchOptions = refetch as QueryRefetchWithFetchOptions<TResult>;
    return await refetchWithFetchOptions({
      ...options,
      meta: { bypassPersister: true },
    });
  };
}
