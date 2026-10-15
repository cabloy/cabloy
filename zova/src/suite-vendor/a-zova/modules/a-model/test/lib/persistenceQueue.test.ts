import assert from 'node:assert/strict';
import test from 'node:test';

import { getPersistenceQueue, PersistenceQueue } from '../../src/lib/persistenceQueue.js';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

test('async saves finish before removal and flush waits for durable completion', async () => {
  const queue = new PersistenceQueue();
  const write = deferred();
  const calls: string[] = [];
  let stored: string | undefined;
  const save = queue.enqueue(async () => {
    calls.push('save');
    await write.promise;
    stored = 'draft';
  });
  const remove = queue.enqueue(() => {
    calls.push('remove');
    stored = undefined;
  });
  let flushed = false;
  const flush = queue.flush().then(() => {
    flushed = true;
  });
  await Promise.resolve();
  assert.deepEqual(calls, ['save']);
  assert.equal(flushed, false);
  write.resolve();
  await Promise.all([save, remove, flush]);
  assert.deepEqual(calls, ['save', 'remove']);
  assert.equal(stored, undefined);
  assert.equal(flushed, true);
});

test('an unawaited storage failure is observed by flush without poisoning later operations', async () => {
  const queue = new PersistenceQueue();
  const error = new Error('storage unavailable');
  queue.enqueue(() => {
    throw error;
  });
  let saved = false;
  await queue.enqueue(() => {
    saved = true;
  });
  assert.equal(saved, true);
  await assert.rejects(queue.flush(), failure => failure === error);
  await queue.flush();
  await queue.enqueue(() => {
    saved = false;
  });
  await queue.flush();
  assert.equal(saved, false);
});

test('save serialization failures are awaited and the queue recovers', async () => {
  const queue = new PersistenceQueue();
  const error = new Error('serialization failed');
  await assert.rejects(
    queue.enqueue(() => {
      throw error;
    }),
    failure => failure === error,
  );
  await assert.rejects(queue.flush(), failure => failure === error);
  await queue.enqueue(() => undefined);
  await queue.flush();
});

test('a clear barrier drains earlier writes and invalidates delayed writers and restores', async () => {
  const queue = new PersistenceQueue();
  const write = deferred();
  let stored: string | undefined;
  const generation = queue.generation('draft');
  const save = queue.enqueue(async () => {
    await write.promise;
    stored = 'accepted draft';
  });
  queue.invalidateAll();
  const clear = queue.enqueue(() => {
    stored = undefined;
  });
  const lateSave = queue.enqueue(() => {
    if (generation === queue.generation('draft')) stored = 'late draft';
  });
  assert.notEqual(generation, queue.generation('draft'));
  write.resolve();
  await Promise.all([save, clear, lateSave]);
  await queue.flush();
  assert.equal(stored, undefined);
});

test('per-key invalidation discards a late restore without affecting other keys', async () => {
  const queue = new PersistenceQueue();
  const read = deferred();
  const firstGeneration = queue.generation('first');
  const secondGeneration = queue.generation('second');
  const restore = queue.enqueue(async () => {
    await read.promise;
    return firstGeneration === queue.generation('first') ? 'old data' : undefined;
  });
  await Promise.resolve();
  queue.invalidate('first');
  read.resolve();
  assert.equal(await restore, undefined);
  assert.equal(secondGeneration, queue.generation('second'));
});

test('all models using one storage share ordering while separate stores remain independent', async () => {
  const storage = {};
  const otherStorage = {};
  const first = getPersistenceQueue(storage);
  assert.equal(first, getPersistenceQueue(storage));
  assert.notEqual(first, getPersistenceQueue(otherStorage));
  const pending = deferred();
  const calls: string[] = [];
  const save = first.enqueue(async () => {
    await pending.promise;
    calls.push('save');
  });
  const clear = getPersistenceQueue(storage).enqueue(() => {
    calls.push('clear');
  });
  await getPersistenceQueue(otherStorage).enqueue(() => {
    calls.push('other');
  });
  assert.deepEqual(calls, ['other']);
  pending.resolve();
  await Promise.all([save, clear]);
  assert.deepEqual(calls, ['other', 'save', 'clear']);
});
