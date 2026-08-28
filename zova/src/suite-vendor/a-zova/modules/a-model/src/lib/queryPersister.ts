import type { QueryPersister } from '@tanstack/query-core';

// TanStack's FetchMeta is internal to the public QueryPersister call path.
type QueryFetchMeta = {
  bypassPersister?: boolean;
};

export function createQueryPersister<T, TQueryKey extends readonly unknown[]>(
  persisterFn: QueryPersister<T, TQueryKey>,
): QueryPersister<T, TQueryKey> {
  return (queryFn, context, query) => {
    if ((query.state.fetchMeta as QueryFetchMeta | null)?.bypassPersister === true) {
      return queryFn(context);
    }
    return persisterFn(queryFn, context, query);
  };
}
