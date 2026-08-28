import type { Query, RefetchOptions } from '@tanstack/query-core';

import assert from 'node:assert/strict';
import test from 'node:test';

import { createQueryRefetch } from '../../src/lib/queryRefetch.js';

type Result = { data: string };

function createQuery(state: Query['state']) {
  return { state } as Query;
}

test('bypassPersister waits for a cold initial fetch before starting its own marked fetch', async () => {
  let resolveInitial: (() => void) | undefined;
  const initial = new Promise<void>(resolve => {
    resolveInitial = resolve;
  });
  const calls: Array<RefetchOptions | undefined> = [];
  const query = createQuery({
    fetchStatus: 'fetching',
    data: undefined,
    fetchMeta: null,
  } as Query['state']);
  const refetch = async (options?: RefetchOptions): Promise<Result> => {
    calls.push(options);
    if (calls.length === 1) {
      await initial;
      query.state.fetchStatus = 'idle';
      return { data: 'initial' };
    }
    return { data: 'fresh' };
  };
  const wrapped = createQueryRefetch(refetch, () => query);

  const result = wrapped({ bypassPersister: true, cancelRefetch: false, throwOnError: true });
  assert.deepEqual(calls, [{ cancelRefetch: false }]);

  resolveInitial!();
  assert.deepEqual(await result, { data: 'fresh' });
  assert.deepEqual(calls, [
    { cancelRefetch: false },
    { cancelRefetch: false, throwOnError: true, meta: { bypassPersister: true } },
  ]);
});

test('ordinary refetch forwards native options unchanged', async () => {
  const calls: Array<RefetchOptions | undefined> = [];
  const refetch = async (options?: RefetchOptions): Promise<Result> => {
    calls.push(options);
    return { data: 'result' };
  };
  const wrapped = createQueryRefetch(refetch, () => undefined);
  const options = { cancelRefetch: false, throwOnError: true };

  assert.deepEqual(await wrapped(options), { data: 'result' });
  assert.deepEqual(calls, [options]);
});

test('false bypassPersister retains native refetch behavior', async () => {
  const calls: Array<RefetchOptions | undefined> = [];
  const refetch = async (options?: RefetchOptions): Promise<Result> => {
    calls.push(options);
    return { data: 'result' };
  };
  const wrapped = createQueryRefetch(refetch, () => undefined);

  assert.deepEqual(await wrapped({ bypassPersister: false }), { data: 'result' });
  assert.deepEqual(calls, [{}]);
});

test('bypassPersister leaves the caller options object unchanged', async () => {
  const calls: Array<RefetchOptions | undefined> = [];
  const refetch = async (options?: RefetchOptions): Promise<Result> => {
    calls.push(options);
    return { data: 'result' };
  };
  const wrapped = createQueryRefetch(refetch, () => undefined);
  const options = { bypassPersister: true, cancelRefetch: false };

  await wrapped(options);
  assert.deepEqual(options, { bypassPersister: true, cancelRefetch: false });
  assert.deepEqual(calls, [{ cancelRefetch: false, meta: { bypassPersister: true } }]);
});
