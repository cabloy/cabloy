import assert from 'node:assert/strict';
import test from 'node:test';

import { $QueryEnsureLoaded } from '../../src/lib/utils.js';

type QueryResult<T> = {
  data: T | undefined;
  error: Error | null;
};

function createQuery<T>(data: T | undefined, result: QueryResult<T>) {
  let suspenseCalls = 0;
  const query = {
    data,
    suspense: async () => {
      suspenseCalls++;
      return result;
    },
  };
  return {
    query,
    get suspenseCalls() {
      return suspenseCalls;
    },
  };
}

test('QueryEnsureLoaded throws an initial query error', async () => {
  const error = new Error('Initial query load failed');
  const fixture = createQuery(undefined, { data: undefined, error });

  await assert.rejects(
    $QueryEnsureLoaded(() => fixture.query as never),
    caught => caught === error,
  );
  assert.equal(fixture.suspenseCalls, 1);
});

test('QueryEnsureLoaded accepts cached data when a background refresh has failed', async () => {
  const error = new Error('Background refresh failed');
  const fixture = createQuery({ value: 'cached' }, { data: { value: 'cached' }, error });

  const result = await $QueryEnsureLoaded(() => fixture.query as never);

  assert.equal(result, fixture.query);
  assert.equal(fixture.suspenseCalls, 0);
});

test('QueryEnsureLoaded returns a query after an initial successful load', async () => {
  const fixture = createQuery(undefined, { data: { value: 'loaded' }, error: null });

  const result = await $QueryEnsureLoaded(() => fixture.query as never);

  assert.equal(result, fixture.query);
  assert.equal(fixture.suspenseCalls, 1);
});
