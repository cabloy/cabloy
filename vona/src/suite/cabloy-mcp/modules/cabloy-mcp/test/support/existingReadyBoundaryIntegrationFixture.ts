import type { ExistingReadyCapability, VonaContext } from 'vona';

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import {
  beginCompletedInstance,
  captureCompletedInstance,
  createCompletedReadiness,
  createRequestBoundary,
  finishCompletedInstance,
  getRequestBoundary,
  invalidateCompletedInstance,
  runWithRequestBoundary,
  SymbolBeanContainerInstances,
} from 'vona';
import { app } from 'vona-mock';
import { BeanExecutor } from 'vona-module-a-executor';
import {
  ServiceDatabaseAsyncLocalStorage,
  ServiceTransactionAsyncLocalStorage,
} from 'vona-module-a-orm';
import { createProtectedSqliteRegistry } from 'vona-module-a-ormdialect';

import { productionOwnerLimits } from '../../src/lib/productionRequestOwner.ts';
import { createRequestBoundaryOwner } from '../../src/lib/requestBoundaryOwner.ts';
import { boundaryIO } from './productionBoundaryFixture.ts';
import { createProtectedSqliteFixture } from './protectedSqliteRegistryFixture.ts';

// Test-only canonical access preserves the framework's private WeakMap identities.
// Neither these collaborators nor the synthetic publication are production authority.
const completedReadinessUrl = new URL(
  '../../../../../../../packages-vona/vona-core/src/lib/core/completedReadiness.ts',
  import.meta.url,
);
const {
  beginCompletedApplication,
  closeCompletedReadiness,
  finishCompletedApplication,
  getCompletedPublication,
  issueExistingReadyCapability,
  matchesCompletedRow,
  provisionCompletedInstanceForTest,
} = await import(completedReadinessUrl.href);
const existingReadyAdmissionUrl = new URL(
  '../../../../../../suite-vendor/a-vona/modules/a-instance/src/lib/existingReadyAdmission.ts',
  import.meta.url,
);
const { createExistingReadyAdmissionForTest } = await import(existingReadyAdmissionUrl.href);

export function withinBoundary<T>(work: () => T): T {
  return runWithRequestBoundary(createRequestBoundary(), work);
}

type Hooks = {
  beforeAdmit?: () => void;
  gap?: (ctx: VonaContext, signal: AbortSignal) => Promise<void>;
  handoff?: (ctx: VonaContext) => void;
  cleanup?: (signal: AbortSignal) => Promise<void>;
};

export async function createIntegrationFixture() {
  assert.equal(getRequestBoundary(), undefined, 'unprotected_fixture_preparation');
  const server = app.server;
  assert.equal(server, undefined, 'listener_disabled');
  const sqlite = await createProtectedSqliteFixture();
  const reader = createProtectedSqliteRegistry({ filename: sqlite.filename });
  const requestOwner = createRequestBoundaryOwner(productionOwnerLimits);
  const events: string[] = [];
  const counts = { reads: 0, contexts: 0, handoffs: 0, forbidden: 0, cleanups: 0 };
  const facade = Object.create(app);
  Object.defineProperty(facade, 'meta', { value: { ...app.meta } });
  const readiness = createCompletedReadiness(facade);
  facade.meta.completedReadiness = readiness;
  const registry = Object.freeze({});
  const route = Object.freeze({});
  // No ORM operation or business consumer may use this deliberately inert handle.
  const handle = Object.freeze({});
  let clock: number | undefined;
  let beforeRead: (() => Promise<void>) | undefined;
  const executor = Object.create(BeanExecutor.prototype) as BeanExecutor;
  Object.defineProperties(executor, {
    app: { value: facade },
    ctx: { get: () => app.ctx },
    bean: {
      get: () =>
        new Proxy(app.bean, {
          get(target, key, receiver) {
            if (key === 'instance' || key === 'database') {
              counts.forbidden++;
              throw new Error('ordinary_setup_forbidden');
            }
            return Reflect.get(target, key, receiver);
          },
        }),
    },
  });
  let removed = false;
  const tasks: Promise<unknown>[] = [];

  try {
    assert.equal(reader.prepare().outcome, 'ready', 'native_prepare');
    events.push('prepared');
    const initial = withinBoundary(() => reader.lookup('alpha'));
    assert.equal(initial.outcome, 'found', 'native_fixture_row');
    if (initial.outcome !== 'found') throw new Error('fixture_row_required');
    provisionCompletedInstanceForTest(readiness, 'alpha', {
      registry,
      route,
      handle,
      isolate: true,
    });
    const applicationAttempt = beginCompletedApplication(readiness);
    const instanceAttempt = beginCompletedInstance(readiness, 'alpha');
    const captured = captureCompletedInstance(readiness, 'alpha', instanceAttempt, initial.row, {
      proof: { marker: 'inert-pinned', ok: true },
    });
    assert.equal(captured !== undefined, true, 'synthetic_data_only_capture');
    finishCompletedInstance(readiness, 'alpha', instanceAttempt, captured);
    finishCompletedApplication(readiness, applicationAttempt, true);
  } catch {
    await requestOwner.drain();
    assert.equal((await reader.close()).outcome, 'closed', 'retain_on_uncertain_close');
    await sqlite.close();
    throw new Error('integration_preparation_failed');
  }

  const admission = createExistingReadyAdmissionForTest({
    owner: readiness,
    registry,
    route,
    getCompletedPublication,
    matchesCompletedRow,
    issueExistingReadyCapability,
    now: () => clock ?? performance.now(),
    async read(selected: string) {
      assert.equal(getRequestBoundary() !== undefined, true, 'request_lookup_boundary');
      counts.reads++;
      await beforeRead?.();
      return reader.lookup(selected);
    },
  });

  function assertPinned(ctx: VonaContext) {
    assert.equal(app.ctx === ctx, true, 'current_pinned_context');
    assert.equal(ctx.instanceName === ('alpha' as never), true, 'pinned_name');
    assert.equal(ctx.instance?.id === 1, true, 'pinned_row_identity');
    assert.equal(ctx.innerAccess, false);
    assert.equal((ctx.config as any).proof.marker === 'inert-pinned', true, 'pinned_config');
    assert.equal(Object.isFrozen((ctx.config as any).proof), true);
  }

  function start(hooks: Hooks = {}) {
    const io = boundaryIO();
    const observed = { disposed: false, cleanup: false, handoffs: 0, initialized: false };
    const order: string[] = [];
    const task = app.bean.executor.mockCtx(async () => {
      const database = app.bean._getBean(ServiceDatabaseAsyncLocalStorage);
      const transaction = app.bean._getBean(ServiceTransactionAsyncLocalStorage);
      const outer = transaction.transactionState;
      let capability: ExistingReadyCapability | undefined;
      const result = await requestOwner.run<VonaContext>(io.req, io.res, {
        async binding() {
          hooks.beforeAdmit?.();
          const admitted = await admission.admit('alpha');
          if (admitted.outcome !== 'ready') return { outcome: 'unavailable' };
          capability = admitted.capability;
          return { outcome: 'admitted', instanceName: 'ignored-owner-name' };
        },
        async execute(callback, options, lifecycle) {
          assert.equal(capability !== undefined, true, 'private_invocation_capability');
          // Do not spread the old owner port's name, dbInfo or innerAccess into this entry.
          const selected = { req: options.req, res: options.res };
          assert.deepEqual(Object.keys(selected).sort(), ['req', 'res']);
          assert.equal(options.instanceName === 'ignored-owner-name', true);
          await executor.newCtxReadyExisting(
            capability!,
            async () => {
              const ctx = app.ctx;
              assertPinned(ctx);
              assert.equal(database.dbStorage.getStore() === handle, true, 'inert_handle_binding');
              const state = transaction.transactionState;
              assert.equal(state !== outer, true, 'independent_transaction_state');
              order.push('callback');
              await callback(ctx);
              assert.equal(transaction.transactionState === state, true, 'transaction_retained');
            },
            selected,
            {
              initializeContext(ctx) {
                counts.contexts++;
                observed.initialized = true;
                assertPinned(ctx);
                assert.equal(transaction.transactionState === outer, true, 'pin_before_setup');
                order.push('initializer');
                const instances = (
                  ctx.bean as unknown as {
                    [SymbolBeanContainerInstances]: Record<string, unknown>;
                  }
                )[SymbolBeanContainerInstances];
                instances['existing-ready-integration-witness'] = {
                  async __dispose__() {
                    observed.disposed = true;
                    order.push('actual_disposal');
                  },
                };
                lifecycle.initializeContext(ctx);
              },
              onScopeOutcome(outcome) {
                assert.equal(observed.disposed, true, 'actual_disposal_precedes_outcome');
                order.push(outcome);
                lifecycle.onScopeOutcome(outcome);
              },
            },
          );
          assert.equal(transaction.transactionState === outer, true, 'outer_transaction_restored');
        },
        async work(ctx, signal) {
          await hooks.gap?.(ctx, signal); // Simulated identity work, not OAuth or business work.
          const fresh = await admission.recheck(capability!);
          if (fresh.outcome === 'ready' && !signal.aborted) {
            assert.equal(fresh.capability === capability, true, 'same_capability');
            counts.handoffs++;
            observed.handoffs++;
            order.push('inert_handoff');
            hooks.handoff?.(ctx); // Synchronous inert handoff: no intervening await or SQL.
          } else {
            io.response.statusCode = 503;
          }
          if (!io.response.writableEnded && !io.response.destroyed) io.response.end();
        },
        async cleanup(signal) {
          counts.cleanups++;
          await hooks.cleanup?.(signal);
          observed.cleanup = true;
          order.push('cleanup');
        },
      });
      assert.equal(app.server === server, true, 'runner_listener_preserved');
      return result;
    });
    tasks.push(task);
    return { io, observed, order, task };
  }

  async function close() {
    if (removed) return;
    const drain = requestOwner.drain();
    await Promise.allSettled(tasks);
    const report = await drain;
    assert.equal(report.pendingAdmittedRuns, 0);
    events.push('drained');
    assert.equal((await reader.close()).outcome, 'closed', 'retain_on_uncertain_reader_close');
    events.push('reader_closed');
    await sqlite.close();
    assert.equal(existsSync(sqlite.directory), false, 'precise_fixture_removal');
    events.push('fixture_removed');
    removed = true;
    closeCompletedReadiness(readiness);
    assert.equal(app.server === server, true, 'runner_listener_preserved');
  }

  return {
    admission,
    executor,
    readiness,
    facade,
    handle,
    reader,
    requestOwner,
    events,
    counts,
    start,
    close,
    assertPinned,
    directoryExists: () => existsSync(sqlite.directory),
    setClock(value: number) {
      clock = value;
    },
    setReadBarrier(value?: () => Promise<void>) {
      assert.equal(getRequestBoundary(), undefined, 'unprotected_control_change');
      beforeRead = value;
    },
    invalidate: () => invalidateCompletedInstance(readiness, 'alpha'),
    republish() {
      assert.equal(getRequestBoundary(), undefined, 'unprotected_fixture_publication');
      const result = withinBoundary(() => reader.lookup('alpha'));
      assert.equal(result.outcome, 'found', 'native_republication_row');
      if (result.outcome !== 'found') throw new Error('fixture_row_required');
      const attempt = beginCompletedInstance(readiness, 'alpha');
      finishCompletedInstance(
        readiness,
        'alpha',
        attempt,
        captureCompletedInstance(readiness, 'alpha', attempt, result.row, {
          proof: { marker: 'inert-pinned', ok: true },
        }),
      );
    },
    closeReadiness: () => closeCompletedReadiness(readiness),
    async mutate(sql: string, values: readonly unknown[] = []) {
      await app.bean.executor.mockCtx(async () => {
        assert.equal(getRequestBoundary(), undefined, 'independent_unprotected_writer');
        sqlite.withWriter(db => {
          db.prepare(sql).run(...values);
        });
      });
    },
    async withCapability(
      work: (capability: ExistingReadyCapability, executor: BeanExecutor) => Promise<void>,
    ) {
      await app.bean.executor.mockCtx(() =>
        withinBoundary(async () => {
          const result = await admission.admit('alpha');
          assert.equal(result.outcome, 'ready', 'controlled_capability_required');
          if (result.outcome !== 'ready') throw new Error('controlled_capability_required');
          await work(result.capability, executor);
        }),
      );
    },
  };
}
