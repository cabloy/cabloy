import assert from 'node:assert/strict';
import test from 'node:test';

import type { BeanRouter } from '../../src/bean/bean.router.js';
import type { IRouteDiscardEvent } from '../../src/types/routeDiscard.js';

import { dispatchRouteDiscard } from '../../src/lib/routeDiscard.js';

const router = {} as BeanRouter;

test('route discard invalidates synchronously and awaits registered cleanup', async () => {
  const calls: string[] = [];
  let finish!: () => void;
  const cleanup = new Promise<void>(resolve => {
    finish = resolve;
  });
  const completion = dispatchRouteDiscard(
    { router, reason: 'back', items: [{ fullPath: '/entry/create' }] },
    event => {
      calls.push('invalidate');
      event.waitUntil(
        cleanup.then(() => {
          calls.push('cleanup');
        }),
      );
    },
    () => assert.fail('unexpected cleanup error'),
  ).then(() => {
    calls.push('complete');
  });

  assert.deepEqual(calls, ['invalidate']);
  await Promise.resolve();
  assert.deepEqual(calls, ['invalidate']);
  finish();
  await completion;
  assert.deepEqual(calls, ['invalidate', 'cleanup', 'complete']);
});

test('route discard captures detached inactive workspace identities', async () => {
  const items = [
    { fullPath: '/entry/1/edit', componentKey: 'edit-1', tabKey: 'workspace' },
    { fullPath: '/entry/2/edit', componentKey: 'edit-2', tabKey: 'workspace' },
  ];
  let captured!: IRouteDiscardEvent;
  await dispatchRouteDiscard(
    { router, reason: 'workspaceClose', items, ownerSelector: 'admin' },
    event => {
      captured = event;
    },
    () => assert.fail('unexpected cleanup error'),
  );
  items[0].fullPath = '/newly-active';
  items.pop();

  assert.equal(captured.router, router);
  assert.equal(captured.ownerSelector, 'admin');
  assert.equal(captured.reason, 'workspaceClose');
  assert.deepEqual(captured.items, [
    { fullPath: '/entry/1/edit', componentKey: 'edit-1', tabKey: 'workspace' },
    { fullPath: '/entry/2/edit', componentKey: 'edit-2', tabKey: 'workspace' },
  ]);
});

test('failed cleanup is reported without skipping other cleanup or rejecting navigation', async () => {
  const error = new Error('unavailable');
  const reported: unknown[] = [];
  let completed = false;
  await dispatchRouteDiscard(
    { router, reason: 'taskClose', items: [{ fullPath: '/entry/create' }] },
    event => {
      event.waitUntil(Promise.reject(error));
      event.waitUntil(
        Promise.resolve().then(() => {
          completed = true;
        }),
      );
    },
    failure => reported.push(failure),
  );

  assert.equal(completed, true);
  assert.deepEqual(reported, [error]);
});

test('a synchronous listener failure still drains registered cleanup', async () => {
  const error = new Error('listener failed');
  const reported: unknown[] = [];
  let completed = false;
  await dispatchRouteDiscard(
    { router, reason: 'back', items: [{ fullPath: '/entry/create' }] },
    event => {
      event.waitUntil(
        Promise.resolve().then(() => {
          completed = true;
        }),
      );
      throw error;
    },
    failure => reported.push(failure),
  );

  assert.equal(completed, true);
  assert.deepEqual(reported, [error]);
});
