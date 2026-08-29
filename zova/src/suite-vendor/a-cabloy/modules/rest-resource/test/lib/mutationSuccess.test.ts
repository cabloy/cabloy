import assert from 'node:assert/strict';
import test from 'node:test';

import { runMutationSuccess } from '../../src/lib/mutationSuccess.ts';

function createDeferred() {
  let resolve: (() => void) | undefined;
  const promise = new Promise<void>(resolve_ => {
    resolve = resolve_;
  });
  return { promise, resolve: () => resolve?.() };
}

async function flushAsyncWork() {
  await new Promise<void>(resolve => setImmediate(resolve));
}

test('waits for select invalidation when used by a create mutation', async () => {
  const select = createDeferred();
  let completed = false;
  const result = runMutationSuccess({
    invalidateSelect: () => select.promise,
  }).then(() => {
    completed = true;
  });

  await flushAsyncWork();
  assert.equal(completed, false);

  select.resolve();
  await result;
  assert.equal(completed, true);
});

test('waits for select and item invalidation before custom success handling', async () => {
  const select = createDeferred();
  const item = createDeferred();
  const calls: string[] = [];
  let completed = false;
  const result = runMutationSuccess({
    invalidateSelect: async () => {
      calls.push('select');
      await select.promise;
    },
    invalidateItem: async () => {
      calls.push('item');
      await item.promise;
    },
    onSuccess: () => {
      calls.push('success');
    },
  }).then(() => {
    completed = true;
  });

  await flushAsyncWork();
  assert.deepEqual(calls, ['select']);
  assert.equal(completed, false);

  select.resolve();
  await flushAsyncWork();
  assert.deepEqual(calls, ['select', 'item']);
  assert.equal(completed, false);

  item.resolve();
  await result;
  assert.deepEqual(calls, ['select', 'item', 'success']);
  assert.equal(completed, true);
});

test('skips select invalidation while still waiting for item invalidation', async () => {
  const item = createDeferred();
  const calls: string[] = [];
  let completed = false;
  const result = runMutationSuccess({
    invalidateItem: async () => {
      calls.push('item');
      await item.promise;
    },
    onSuccess: () => {
      calls.push('success');
    },
  }).then(() => {
    completed = true;
  });

  await flushAsyncWork();
  assert.deepEqual(calls, ['item']);
  assert.equal(completed, false);

  item.resolve();
  await result;
  assert.deepEqual(calls, ['item', 'success']);
  assert.equal(completed, true);
});
