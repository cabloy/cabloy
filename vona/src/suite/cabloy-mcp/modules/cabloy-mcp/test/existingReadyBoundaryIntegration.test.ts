import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { captureRequestBoundary, isExistingReadyContext } from 'vona';
import { app } from 'vona-mock';
import {
  ServiceDatabaseAsyncLocalStorage,
  ServiceTransactionAsyncLocalStorage,
} from 'vona-module-a-orm';

import {
  createIntegrationFixture,
  withinBoundary,
} from './support/existingReadyBoundaryIntegrationFixture.ts';
import { barrier, turns, waitFor } from './support/productionBoundaryFixture.ts';
import { proof } from './support/protectedSqliteRegistryFixture.ts';

// Real native registry/context ownership; only publication/config/handle and fault controls
// are synthetic. No listener, ORM query, business dispatch or production admission is tested.
describe('existing-ready boundary composition', { concurrency: false, timeout: 120_000 }, () => {
  it(
    '1 real-native admission and final recheck reach only the inert handoff',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      try {
        const run = f.start({
          handoff(ctx) {
            f.assertPinned(ctx);
            assert.equal(isExistingReadyContext(ctx), true);
            assert.throws(() => {
              ctx.instanceName = 'replacement' as never;
            });
            assert.throws(() => {
              ctx.innerAccess = true;
            });
          },
        });
        const result = await run.task;
        assert.equal(run.observed.handoffs, 1);
        assert.equal(f.counts.reads, 2, 'admit_and_final_native_read');
        assert.equal(f.counts.contexts, 1);
        assert.equal(f.counts.forbidden, 0);
        assert.equal(result.scopeOutcome, 'disposed');
        assert.equal(result.released, true);
        assert.deepEqual(run.order, [
          'initializer',
          'callback',
          'inert_handoff',
          'cleanup',
          'actual_disposal',
          'disposed',
        ]);
        assert.equal((await f.requestOwner.drain()).outcome, 'drained');
        proof(t, 'composition-real-native-healthy', { reads: 2, handoffs: 1, disposed: true });
      } finally {
        await f.close();
      }
      assert.deepEqual(f.events, ['prepared', 'drained', 'reader_closed', 'fixture_removed']);
    },
  );

  it(
    '2 exact native config text drift denies after the controlled identity gap',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      const entered = barrier();
      const held = barrier();
      const run = f.start({
        async gap(ctx) {
          assert.equal(ctx.instance.config === '{"ok":true}', true, 'original_persisted_text');
          entered.release();
          await held.promise;
          f.assertPinned(ctx);
          assert.equal(ctx.instance.config === '{"ok":true}', true, 'pin_not_refreshed');
        },
      });
      try {
        await waitFor(entered.promise);
        await f.mutate('UPDATE aInstance SET config = ? WHERE id = 1', ['{ "ok": true }']);
        assert.equal(JSON.parse('{ "ok": true }').ok === JSON.parse('{"ok":true}').ok, true);
        held.release();
        const result = await run.task;
        assert.equal(run.observed.handoffs, 0);
        assert.equal(f.counts.reads, 2);
        assert.equal(run.io.response.statusCode, 503);
        assert.equal(result.scopeOutcome, 'disposed');
        assert.equal(result.released, true);
        proof(t, 'composition-native-text-drift-controlled-gap', { reads: 2, handoffs: 0 });
      } finally {
        held.release();
        await Promise.allSettled([run.task]);
        await f.close();
      }
    },
  );

  it(
    '3 fresh native disabled deleted missing and duplicate rows deny before setup',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      try {
        const mutations = [
          'UPDATE aInstance SET disabled = 1 WHERE id = 1',
          'UPDATE aInstance SET deleted = 1 WHERE id = 1',
          'DELETE FROM aInstance WHERE id = 1',
          'INSERT INTO aInstance VALUES (9, \'alpha\', 0, 1, \'{"ok":true}\', 0)',
        ];
        for (const mutation of mutations) {
          await f.mutate(mutation);
          const run = f.start();
          const result = await run.task;
          assert.equal(result.executorCalls, 0);
          assert.equal(result.released, true);
          assert.equal(run.io.response.statusCode, 503);
          assert.equal(run.observed.initialized, false);
          assert.equal(run.observed.handoffs, 0);
          await f.mutate("DELETE FROM aInstance WHERE name = 'alpha'");
          await f.mutate('INSERT INTO aInstance VALUES (1, \'alpha\', 0, 1, \'{"ok":true}\', 0)');
        }
        assert.equal(f.counts.reads, 4, 'each_denial_reads_native_again');
        assert.equal(f.counts.contexts, 0);
        assert.equal(f.counts.forbidden, 0, 'no_ordinary_get_register_start_reload_repair');
        const positive = f.start();
        assert.equal((await positive.task).scopeDisposed, true);
        assert.equal(positive.observed.handoffs, 1, 'restored_native_positive_control');
        proof(t, 'composition-real-native-row-denials', { denials: 4, forbidden: 0 });
      } finally {
        await f.close();
      }
    },
  );

  it(
    '4 invalidation during native read and closed authority deny before setup',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      const entered = barrier();
      const held = barrier();
      let late: Promise<unknown> | undefined;
      try {
        f.setReadBarrier(async () => {
          entered.release();
          await held.promise;
        });
        const run = f.start();
        late = run.task;
        await waitFor(entered.promise);
        f.invalidate();
        assert.equal(f.requestOwner.snapshot().active, 1);
        held.release();
        const result = await run.task;
        assert.equal(result.executorCalls, 0);
        assert.equal(run.observed.handoffs, 0);
        assert.equal(result.released, true);
        f.setReadBarrier();
        f.republish();
        await f.withCapability(async (capability, executor) => {
          f.closeReadiness();
          assert.equal((await f.admission.recheck(capability)).outcome, 'unavailable');
          await assert.rejects(executor.newCtxReadyExisting(capability, async () => undefined));
        });
        const closed = f.start();
        assert.equal((await closed.task).executorCalls, 0);
        assert.equal(f.counts.contexts, 0);
        proof(t, 'composition-controlled-generation-close', { contexts: 0, lateDenied: true });
      } finally {
        held.release();
        if (late) await Promise.allSettled([late]);
        await f.close();
      }
    },
  );

  it(
    '5 controlled held read and recheck expire without cancellation or admission queue',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      try {
        for (const phase of ['admit', 'recheck'] as const) {
          f.setClock(0);
          const entered = barrier();
          const held = barrier();
          let settled = false;
          let task: Promise<unknown> | undefined;
          try {
            if (phase === 'admit') {
              f.setReadBarrier(async () => {
                entered.release();
                await held.promise;
              });
              const run = f.start();
              task = run.task.then(result => {
                settled = true;
                assert.equal(result.executorCalls, 0);
                assert.equal(result.released, true);
              });
            } else {
              let reads = 0;
              f.setReadBarrier(async () => {
                reads++;
                if (reads === 2) {
                  entered.release();
                  await held.promise;
                }
              });
              task = f.withCapability(async capability => {
                // The initial admission has settled before the controlled recheck is held.
                const checking = f.admission.recheck(capability);
                const result = await checking;
                assert.equal(result.outcome, 'expired');
                settled = true;
              });
            }
            await waitFor(entered.promise);
            f.setClock(1_000);
            await turns();
            assert.equal(settled, false, 'checkpoint_expiry_does_not_settle_held_read');
            assert.equal(f.directoryExists(), true);
            const before = f.counts.reads;
            await app.bean.executor.mockCtx(async () => {
              const busy = await withinBoundary(() => f.admission.admit('alpha'));
              assert.equal(busy.outcome, 'busy');
            });
            assert.equal(f.counts.reads, before, 'busy_is_not_queued');
          } finally {
            held.release();
            if (task) await task;
            f.setReadBarrier();
          }
          assert.equal(settled, true);
        }
        proof(t, 'composition-controlled-expiry-not-native-cancel', { heldPhases: 2, queued: 0 });
      } finally {
        await f.close();
      }
    },
  );

  it(
    '6 asynchronous commit through the owner retains pinned ALS until actual disposal',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      try {
        const run = f.start({
          handoff(ctx) {
            const database = app.bean._getBean(ServiceDatabaseAsyncLocalStorage);
            const transaction = app.bean._getBean(ServiceTransactionAsyncLocalStorage);
            const state = transaction.transactionState;
            ctx.commit(async () => {
              run.order.push('commit');
              assert.equal(app.ctx === ctx, true);
              assert.equal(database.dbStorage.getStore() === f.handle, true);
              assert.equal(transaction.transactionState === state, true);
              await Promise.resolve();
              assert.equal(app.ctx === ctx, true);
              assert.equal(database.dbStorage.getStore() === f.handle, true);
              assert.equal(transaction.transactionState === state, true);
              assert.equal(run.observed.disposed, false);
              run.order.push('commit_done');
            });
          },
        });
        const result = await run.task;
        assert.equal(result.scopeOutcome, 'disposed');
        assert.equal(result.released, true);
        assert.deepEqual(run.order.slice(-4), [
          'commit',
          'commit_done',
          'actual_disposal',
          'disposed',
        ]);
        assert.equal(f.counts.forbidden, 0);
        proof(t, 'composition-real-context-async-commit', { commits: 1, disposed: true });
      } finally {
        await f.close();
      }
    },
  );

  it(
    '7 held work cleanup and faulted drain retain custody through actual teardown',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      const workEntered = barrier();
      const workHeld = barrier();
      const cleanupEntered = barrier();
      const cleanupHeld = barrier();
      const run = f.start({
        async gap() {
          workEntered.release();
          await workHeld.promise;
          // Controlled diagnostic fault, not a native read/close failure or throwing disposer.
          captureRequestBoundary()!.reportFailure('diagnostic_failed');
        },
        async cleanup() {
          cleanupEntered.release();
          await cleanupHeld.promise;
        },
      });
      let drained = false;
      let drain: ReturnType<typeof f.requestOwner.drain> | undefined;
      try {
        await waitFor(workEntered.promise);
        drain = f.requestOwner.drain();
        void drain.then(() => {
          drained = true;
        });
        await turns();
        assert.equal(drained, false);
        assert.equal(f.requestOwner.snapshot().active, 1);
        assert.equal(run.observed.disposed, false);
        assert.equal(f.reader.snapshot().state === 'ready', true);
        assert.equal(f.directoryExists(), true);
        workHeld.release();
        await waitFor(cleanupEntered.promise);
        await turns();
        assert.equal(drained, false, 'cleanup_is_owned_until_settled');
        assert.equal(run.observed.disposed, false);
        assert.equal(f.requestOwner.snapshot().releases, 0);
        cleanupHeld.release();
        const result = await run.task;
        const report = await drain;
        assert.equal(result.scopeOutcome, 'disposed');
        assert.equal(result.executorSettled && result.cleanupSettled, true);
        assert.equal(result.released, false);
        assert.equal(report.outcome, 'faulted');
        assert.equal(report.quarantinedReservations, 1);
        assert.equal(report.pendingAdmittedRuns, 0);
        proof(t, 'composition-controlled-fault-real-teardown', { quarantined: 1, disposed: true });
      } finally {
        workHeld.release();
        cleanupHeld.release();
        await Promise.allSettled([run.task]);
        if (drain) await drain;
        await f.close();
      }
      assert.deepEqual(f.events, ['prepared', 'drained', 'reader_closed', 'fixture_removed']);
      assert.equal(f.directoryExists(), false);
    },
  );

  it(
    '8 boundary fault and ordinary nested options cannot dispatch or rebind',
    { timeout: 15_000 },
    async t => {
      const f = await createIntegrationFixture();
      const server = app.server;
      let getters = 0;
      try {
        const run = f.start({
          async gap() {
            const options = Object.defineProperty({}, 'dbInfo', {
              get() {
                getters++;
                throw new Error('caller_db_getter_forbidden');
              },
            });
            await assert.rejects(f.executor.newCtx(async () => undefined, options));
            await assert.rejects(f.executor.newCtxIsolate(async () => undefined, options));
            await assert.rejects(f.executor.mockCtx(async () => undefined, options));
            await assert.rejects(f.executor.performAction('get' as never, '/' as never));
            assert.throws(() => f.executor.runInBackground(async () => undefined));
          },
        });
        assert.equal((await run.task).scopeOutcome, 'disposed');
        assert.equal(run.observed.handoffs, 1);
        assert.equal(getters, 0);
        assert.equal(f.counts.forbidden, 0);
        const before = f.counts.contexts;
        const faulted = f.start({
          beforeAdmit() {
            captureRequestBoundary()!.reportFailure('diagnostic_failed');
          },
        });
        assert.equal((await faulted.task).executorCalls, 0);
        assert.equal(faulted.observed.handoffs, 0);
        assert.equal(f.counts.contexts, before);
        await app.bean.executor.mockCtx(async () => {
          assert.equal(isExistingReadyContext(app.ctx), false);
          assert.equal(app.ctx.instance !== undefined, true, 'ordinary_seed_context_preserved');
        });
        assert.equal(app.server === server, true);
        proof(t, 'composition-boundary-and-nested-refusal', { getters: 0, forbidden: 0 });
      } finally {
        await f.close();
      }
    },
  );
});
