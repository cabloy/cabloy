import type { TestContext } from 'node:test';
import type { BeanModelBase } from 'vona-module-a-orm';

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

type CacheModel = Pick<BeanModelBase, '$onionName' | 'newInstanceTarget' | 'cacheQuery'>;

// Supply only the edges and instance resolution; traversal and cache operations stay real.
function mockEdges(t: TestContext, source: CacheModel, targets: CacheModel[]) {
  t.mock.method(source as any, '_getModelsClear', () => targets.map(target => target.$onionName));
  t.mock.method(source, 'newInstanceTarget', ((name: string) => {
    const target = targets.find(target => target.$onionName === name);
    assert.ok(target, `unexpected cache dependency: ${name}`);
    return target;
  }) as unknown as typeof source.newInstanceTarget);
}

function observeClears(t: TestContext, model: CacheModel) {
  const clear = model.cacheQuery.clear.bind(model.cacheQuery);
  let calls = 0;
  return t.mock.method(model.cacheQuery, 'clear', async table => {
    // Bound a regression without replacing the real clear or the recursive worker.
    assert.ok(++calls <= 10, 'cache invalidation revisited a namespace repeatedly');
    await clear(table);
  });
}

describe('modelCache.test.ts', { concurrency: false }, () => {
  it('action:modelCache:cacheQuery', async () => {
    await app.bean.executor.mockCtx(async () => {
      const prefix = `action:modelCache:cacheQuery:${randomUUID()}`;
      const model = app.scope('test-vona').model.user;
      const user = await model.insert({ name: `${prefix}:1` });
      try {
        let items = await model.select({ where: { name: `${prefix}:1` } });
        assert.equal(items.length, 1);
        items = await model.select({ where: { name: `${prefix}:1` } });
        assert.equal(items.length, 1);
        const user2 = await model.get({ id: user.id });
        const user3 = await model.get({ name: `${prefix}:1` });
        const user4 = await model.get({ name: `${prefix}:1` });
        assert.equal(user2?.id, user3?.id);
        assert.equal(user3?.id, user4?.id);
        await model.update({ id: user.id, name: `${prefix}:2` });
        items = await model.select({ where: { name: `${prefix}:2` } });
        assert.equal(items.length, 1);
        await model.delete({ id: user.id });
        items = await model.select({ where: { name: `${prefix}:2` } });
        assert.equal(items.length, 0);
      } finally {
        await model.delete({ id: user.id });
      }
    });
  });

  it('clears a self-cycle once and starts an independent wave on every public inner call', async t => {
    await app.bean.executor.mockCtx(async () => {
      const model = app.scope('test-vona').model.product.newInstance();
      try {
        mockEdges(t, model, [model]);
        const clear = observeClears(t, model);
        await model.cacheQueryClearInner();
        assert.equal(clear.mock.callCount(), 1);
        await model.cacheQueryClearInner();
        assert.equal(clear.mock.callCount(), 2);
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('terminates a two-model cycle and deduplicates a diamond with repeated edges', async t => {
    await app.bean.executor.mockCtx(async () => {
      const models = app.scope('test-vona').model;
      const root = models.user.newInstance();
      const left = models.post.newInstance();
      const right = models.role.newInstance();
      const leaf = models.product.newInstance();
      try {
        mockEdges(t, root, [left]);
        mockEdges(t, left, [root]);
        mockEdges(t, right, []);
        mockEdges(t, leaf, []);
        const clears = [root, left, right, leaf].map(model => observeClears(t, model));
        await root.cacheQueryClearInner();
        assert.deepEqual(
          clears.map(clear => clear.mock.callCount()),
          [1, 1, 0, 0],
        );

        t.mock.restoreAll();
        mockEdges(t, root, [left, right, left]);
        mockEdges(t, left, [leaf, leaf]);
        mockEdges(t, right, [leaf]);
        mockEdges(t, leaf, []);
        const diamondClears = [root, left, right, leaf].map(model => observeClears(t, model));
        await root.cacheQueryClearInner();
        assert.deepEqual(
          diamondClears.map(clear => clear.mock.callCount()),
          [1, 1, 1, 1],
        );
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('uses the effective table namespace rather than model name or instance identity', async t => {
    await app.bean.executor.mockCtx(async () => {
      const models = app.scope('test-vona').model;
      const root = models.user.newInstance();
      const defaultTable = root.getTable(undefined);
      const otherTable = models.post.getTable(undefined);
      const defaultTarget = root.newInstance();
      const sameNamespace = root.newInstance(undefined, otherTable);
      try {
        // The explicit root table equals sameNamespace, but differs from defaultTarget.
        mockEdges(t, root, [defaultTarget, sameNamespace]);
        // Both targets have the same model name; resolve by edge order, not a name map.
        const targets = [defaultTarget, sameNamespace];
        t.mock.method(root, 'newInstanceTarget', (() =>
          targets.shift()!) as typeof root.newInstanceTarget);
        mockEdges(t, defaultTarget, []);
        mockEdges(t, sameNamespace, []);
        const rootClear = observeClears(t, root);
        const defaultClear = observeClears(t, defaultTarget);
        const duplicateClear = observeClears(t, sameNamespace);
        await root.cacheQueryClearInner(otherTable);
        assert.equal(rootClear.mock.callCount(), 1);
        assert.equal(rootClear.mock.calls[0].arguments[0], otherTable);
        assert.equal(defaultClear.mock.callCount(), 1);
        assert.equal(defaultClear.mock.calls[0].arguments[0], defaultTable);
        assert.equal(duplicateClear.mock.callCount(), 0);
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('keeps custom callbacks as awaited three-argument replacements on every incoming edge', async t => {
    await app.bean.executor.mockCtx(async () => {
      const models = app.scope('test-vona').model;
      const root = models.user.newInstance();
      const left = models.post.newInstance();
      const right = models.role.newInstance();
      const target = models.product.newInstance();
      const options = target.options;
      const calls: unknown[][] = [];
      let completed = 0;
      try {
        mockEdges(t, root, [left, right]);
        mockEdges(t, left, [target]);
        mockEdges(t, right, [target, target]);
        mockEdges(t, target, []);
        const clear = observeClears(t, target);
        t.mock.getter(target, 'options', () => ({
          ...options,
          cache: {
            ...options.cache,
            modelsClearedByFn: async (...args: unknown[]) => {
              calls.push(args);
              await Promise.resolve();
              completed++;
            },
          },
        }));
        await root.cacheQueryClearInner();
        assert.equal(completed, 3);
        assert.deepEqual(calls, [
          [app.ctx, target, left],
          [app.ctx, target, right],
          [app.ctx, target, right],
        ]);
        assert.equal(clear.mock.callCount(), 0);
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('propagates cache and callback failures without poisoning later waves', async t => {
    await app.bean.executor.mockCtx(async () => {
      const models = app.scope('test-vona').model;
      const root = models.user.newInstance();
      const target = models.product.newInstance();
      const options = target.options;
      const failure = new Error('owned model cache failure');
      try {
        mockEdges(t, root, [target]);
        mockEdges(t, target, []);
        const targetClear = observeClears(t, target);
        const rootClear = t.mock.method(root.cacheQuery, 'clear', async () => {
          throw failure;
        });
        await assert.rejects(root.cacheQueryClearInner(), error => error === failure);
        assert.equal(targetClear.mock.callCount(), 0);
        rootClear.mock.restore();
        const callback = t.mock.getter(target, 'options', () => ({
          ...options,
          cache: {
            ...options.cache,
            modelsClearedByFn: async () => {
              throw failure;
            },
          },
        }));
        await assert.rejects(root.cacheQueryClearInner(), error => error === failure);
        assert.equal(targetClear.mock.callCount(), 0);
        callback.mock.restore();
        await root.cacheQueryClearInner();
        assert.equal(targetClear.mock.callCount(), 1);
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('propagates from a disabled tableless model without resolving its table', async t => {
    await app.bean.executor.mockCtx(async () => {
      const models = app.scope('test-vona').model;
      const root = models.user.newInstance();
      const target = models.product.newInstance();
      const options = root.options;
      try {
        t.mock.getter(root, 'options', () => ({
          ...options,
          entity: undefined,
          table: undefined,
          cache: { ...options.cache, query: false as const },
        }));
        const getTable = t.mock.method(root, 'getTable', () => {
          throw new Error('tableless model');
        });
        mockEdges(t, root, [target]);
        mockEdges(t, target, [root]);
        const clear = observeClears(t, target);
        assert.equal(root.cacheQuery.enabled, false);
        await root.cacheQueryClearInner();
        assert.equal(getTable.mock.callCount(), 0);
        assert.equal(clear.mock.callCount(), 1);
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('starts a fresh invalidation wave after a real transaction commits', async t => {
    await app.bean.executor.mockCtx(async () => {
      const models = app.scope('test-vona').model;
      const root = models.user.newInstance();
      const target = models.product.newInstance();
      try {
        mockEdges(t, root, [target]);
        mockEdges(t, target, [root]);
        // Isolate commit re-entry; the queue handler has its own integration test below.
        t.mock.method(root as any, '_shardingCacheDoubleDelete', () => {});
        const rootClear = observeClears(t, root);
        const targetClear = observeClears(t, target);
        await root.db.transaction.begin(async () => {
          await root.db.connection.raw('select 1 as value');
          await root.cacheQueryClear();
          assert.equal(root.db.inTransaction, true);
          assert.deepEqual([rootClear.mock.callCount(), targetClear.mock.callCount()], [1, 1]);
        });
        assert.equal(root.db.inTransaction, false);
        assert.deepEqual([rootClear.mock.callCount(), targetClear.mock.callCount()], [2, 2]);
      } finally {
        t.mock.restoreAll();
      }
    });
  });

  it('clears rewarmed root and dependent caches on delayed queue handler re-entry', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('test-vona');
      const root = scope.model.user.newInstance();
      const models = [root, scope.model.userStats, scope.model.userStatsGroup];
      const caches = models.map(model => model.cacheQuery.getInstance(model.getTable(undefined)));
      const key = { modelCacheRegression: randomUUID() };
      const queue = app.scope('a-orm').queue.doubleDelete;
      const jobId = randomUUID();
      try {
        await root.cacheQueryClearInner();
        for (const cache of caches) {
          await cache.set('rewarmed', key);
          assert.equal(await cache.peek(key), 'rewarmed');
        }
        // Use the real queue's declared delay and completion, not a sleep or config override.
        await queue.pushAsync(
          {
            beanFullName: root.$beanFullName,
            clientName: root.db.clientName,
            method: 'cacheQueryClearInner',
            args: [],
          },
          { jobOptions: { jobId } },
        );
        for (const cache of caches) {
          assert.equal(await cache.peek(key), undefined);
        }
        assert.equal(await queue.getQueue().getJob(jobId), undefined);
      } finally {
        for (const cache of caches) await cache.del(key);
        const job = await queue.getQueue().getJob(jobId);
        await job?.remove();
      }
    });
  });
});
