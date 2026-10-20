import type { VonaApplication, VonaContext } from 'vona';
import type { ServiceDb } from 'vona-module-a-orm';

import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { describe, it } from 'node:test';
import {
  beginCompletedInstance,
  captureCompletedInstance,
  createCompletedReadiness,
  createRequestBoundary,
  finishCompletedInstance,
  runWithRequestBoundary,
} from 'vona';
import {
  ServiceDatabaseAsyncLocalStorage,
  ServiceTransactionAsyncLocalStorage,
  ServiceTransactionConsistency‌,
  ServiceTransactionState,
} from 'vona-module-a-orm';

import { VonaAsyncLocalStorage } from '../../../../../../packages-vona/vona-core/src/lib/core/asyncLocalStorage.ts';
import {
  beginCompletedApplication,
  finishCompletedApplication,
  getCompletedPublication,
  issueExistingReadyCapability,
  provisionCompletedInstanceForTest,
} from '../../../../../../packages-vona/vona-core/src/lib/core/completedReadiness.ts';
import { BeanExecutor } from '../src/bean/bean.executor.ts';

// Real executor, context disposal and ORM callback queues with inert, test-owned DB ports.
// No application singleton, persistence, environment configuration or listener is used.
function fixture() {
  const events: string[] = [];
  let active = 0;
  const database = new ServiceDatabaseAsyncLocalStorage();
  database.dbStorage = new AsyncLocalStorage();
  const transaction = new ServiceTransactionAsyncLocalStorage();
  transaction.transactionStorage = new AsyncLocalStorage();
  Object.defineProperty(transaction, 'bean', {
    value: { _newBean: () => new ServiceTransactionState() },
  });
  const handle = {} as ServiceDb;
  let storage: VonaAsyncLocalStorage;
  const local = {
    meta: {
      completedReadiness: undefined as ReturnType<typeof createCompletedReadiness> | undefined,
      ctxCounter: {
        increment() {
          active++;
        },
        decrement() {
          active--;
        },
      },
    },
    get currentContext() {
      return storage.getStore();
    },
    createAnonymousContext() {
      const consistency = new ServiceTransactionConsistency‌();
      return {
        commit: (cb: () => unknown) => consistency.commit(cb),
        commitsDone: () => consistency.commitsDone(),
        bean: {
          async dispose() {
            events.push('disposed');
          },
        },
      } as unknown as VonaContext;
    },
  };
  storage = new VonaAsyncLocalStorage(local as unknown as VonaApplication);
  Object.assign(local, { ctxStorage: storage });
  const executor = Object.create(BeanExecutor.prototype) as BeanExecutor;
  Object.defineProperties(executor, {
    app: { value: local },
    ctx: { get: () => local.currentContext },
    bean: {
      value: {
        _getBean(selector: unknown) {
          assert.ok(
            selector === ServiceDatabaseAsyncLocalStorage ||
              selector === ServiceTransactionAsyncLocalStorage,
          );
          return selector === ServiceDatabaseAsyncLocalStorage ? database : transaction;
        },
      },
    },
  });
  const owner = createCompletedReadiness(local);
  local.meta.completedReadiness = owner;
  const registry = {},
    route = {};
  provisionCompletedInstanceForTest(owner, '', { registry, route, handle, isolate: false });
  const application = beginCompletedApplication(owner);
  const attempt = beginCompletedInstance(owner, '');
  const row = { id: 1, name: '', disabled: false, isolate: false, config: null };
  const captured = captureCompletedInstance(owner, '', attempt, row, {});
  finishCompletedInstance(owner, '', attempt, captured);
  finishCompletedApplication(owner, application, true);
  const publication = getCompletedPublication(owner, '', registry, route);
  assert.ok(publication);
  const capability = issueExistingReadyCapability(owner, publication, 1_000, () => 0);
  return {
    local,
    executor,
    database,
    transaction,
    handle,
    capability,
    events,
    active: () => active,
  };
}

describe('ready-existing commit lifecycle', { concurrency: false }, () => {
  it('awaits async and nested commit callbacks before disposal in the pinned scope', async () => {
    const f = fixture();
    const result = await runWithRequestBoundary(createRequestBoundary(), () =>
      f.executor.newCtxReadyExisting(f.capability, async () => {
        const context = f.local.currentContext!;
        const state = f.transaction.transactionState;
        f.events.push('callback');
        context.commit(async () => {
          f.events.push('commit');
          assert.equal(f.local.currentContext, context);
          assert.equal(f.database.current, f.handle);
          assert.equal(f.transaction.transactionState, state);
          assert.equal(f.active(), 1);
          await Promise.resolve();
          context.commit(() => f.events.push('nested_commit'));
          f.events.push('commit_done');
        });
        return 'result';
      }),
    );
    assert.equal(result, 'result');
    assert.deepEqual(f.events, ['callback', 'commit', 'commit_done', 'nested_commit', 'disposed']);
    assert.equal(f.active(), 0);
    assert.equal(f.local.currentContext, undefined);
    assert.equal(f.database.current, undefined);
    assert.equal(f.transaction.transactionState, undefined);
  });

  for (const phase of ['callback', 'commit'] as const) {
    it(`propagates ${phase} failure and still disposes the context`, async () => {
      const f = fixture();
      const failure = new Error(`controlled_${phase}_failure`);
      await assert.rejects(
        runWithRequestBoundary(createRequestBoundary(), () =>
          f.executor.newCtxReadyExisting(f.capability, async () => {
            f.events.push('callback');
            f.local.currentContext!.commit(() => {
              f.events.push('commit');
              throw failure;
            });
            if (phase === 'callback') throw failure;
          }),
        ),
        error => error === failure,
      );
      assert.deepEqual(
        f.events,
        phase === 'callback' ? ['callback', 'disposed'] : ['callback', 'commit', 'disposed'],
      );
      assert.equal(f.active(), 0);
      assert.equal(f.local.currentContext, undefined);
      assert.equal(f.database.current, undefined);
      assert.equal(f.transaction.transactionState, undefined);
    });
  }
});
