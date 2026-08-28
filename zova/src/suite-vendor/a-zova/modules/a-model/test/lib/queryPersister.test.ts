import { QueryClient, QueryObserver } from '@tanstack/query-core';
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import assert from 'node:assert/strict';
import test from 'node:test';

import { createQueryPersister } from '../../src/lib/queryPersister.js';

type Value = { value: string };

function createStorage(initialValue?: Value) {
  const stored = initialValue
    ? JSON.stringify({
        state: { data: initialValue, dataUpdatedAt: Date.now(), errorUpdatedAt: 0 },
        queryKey: ['summary'],
        queryHash: '["summary"]',
        buster: '',
      })
    : undefined;
  let value = stored;
  let reads = 0;
  let writes = 0;

  return {
    storage: {
      getItem() {
        reads++;
        return value;
      },
      setItem(_key: string, nextValue: string) {
        writes++;
        value = nextValue;
      },
      removeItem() {
        value = undefined;
      },
    },
    get reads() {
      return reads;
    },
    get writes() {
      return writes;
    },
  };
}

function createObserver(storage: ReturnType<typeof createStorage>, queryFn: () => Promise<Value>) {
  const client = new QueryClient();
  const persisterFn = experimental_createQueryPersister({ storage: storage.storage }).persisterFn;
  const observer = new QueryObserver(client, {
    queryKey: ['summary'],
    queryFn,
    enabled: false,
    persister: createQueryPersister(persisterFn),
  });

  return { client, observer };
}

test('bypassPersister fetches fresh data without restoring or saving persisted data', async () => {
  const storage = createStorage({ value: 'old' });
  let calls = 0;
  const { client, observer } = createObserver(storage, async () => ({ value: `fresh-${++calls}` }));

  try {
    const result = await observer
      .getCurrentQuery()
      .fetch(undefined, { meta: { bypassPersister: true } as any });

    assert.deepEqual(result, { value: 'fresh-1' });
    assert.deepEqual(observer.getCurrentQuery().state.data, { value: 'fresh-1' });
    assert.equal(calls, 1);
    assert.equal(storage.reads, 0);
    assert.equal(storage.writes, 0);
  } finally {
    client.clear();
  }
});

test('ordinary refetch still restores persisted data after a bypassed fetch', async () => {
  const storage = createStorage({ value: 'old' });
  let calls = 0;
  const { client, observer } = createObserver(storage, async () => ({ value: `fresh-${++calls}` }));

  try {
    const bypassed = await observer
      .getCurrentQuery()
      .fetch(undefined, { meta: { bypassPersister: true } as any });
    assert.deepEqual(bypassed, { value: 'fresh-1' });

    client.removeQueries({ queryKey: ['summary'] });
    const restored = await observer.refetch();

    assert.deepEqual(restored.data, { value: 'old' });
    assert.equal(calls, 1);
    assert.equal(storage.reads, 1);
  } finally {
    client.clear();
  }
});

test('ordinary refetch restores persisted data without invoking the query function', async () => {
  const storage = createStorage({ value: 'old' });
  let calls = 0;
  const { client, observer } = createObserver(storage, async () => ({ value: `fresh-${++calls}` }));

  try {
    const result = await observer.refetch();

    assert.deepEqual(result.data, { value: 'old' });
    assert.equal(calls, 0);
    assert.equal(storage.reads, 1);
  } finally {
    client.clear();
  }
});
