import type { RequestBoundary } from 'vona';

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import {
  captureRequestBoundary,
  createDiagnosticLogger,
  createRequestBoundary,
  getRequestBoundary,
  runWithRequestBoundary,
  SymbolBeanContainerInstances,
} from 'vona';
import { app } from 'vona-mock';

import type {
  ProductionOwnerContext,
  ProductionOwnerDrainReport,
} from '../src/lib/productionRequestOwner.ts';

import {
  createProductionRequestOwner,
  productionOwnerLimits,
} from '../src/lib/productionRequestOwner.ts';
import { createRequestBoundaryOwner } from '../src/lib/requestBoundaryOwner.ts';
import {
  barrier,
  boundaryIO,
  controlledPorts,
  safeEvent,
  turns,
  waitFor,
} from '../test/support/productionBoundaryFixture.ts';
import { controlledScope } from '../test/support/requestBoundaryFoundationFixture.ts';

const owners: ReturnType<typeof createProductionRequestOwner>[] = [];
function owner() {
  const result = createProductionRequestOwner(productionOwnerLimits);
  owners.push(result);
  return result;
}
function boundaryOwner() {
  const result = createRequestBoundaryOwner(productionOwnerLimits);
  owners.push(result);
  return result;
}
function record(
  t: { diagnostic: (value: string) => void },
  alias: string,
  proof: Parameters<typeof safeEvent>[1],
  current: ReturnType<typeof owner>,
  status: number,
  released: boolean,
  terminal: boolean,
) {
  const state = current.snapshot();
  try {
    t.diagnostic(
      safeEvent(alias, proof, {
        status,
        released,
        terminal,
        active: state.active,
        healthy: state.healthy,
      }),
    );
  } catch {
    current.close();
    throw new Error('event_budget_failed');
  }
}

function drainReport(
  report: Readonly<ProductionOwnerDrainReport>,
  outcome: 'drained' | 'faulted',
  quarantinedReservations: number,
) {
  assert.equal(Object.isFrozen(report), true, 'frozen_drain_report');
  assert.deepEqual(Object.keys(report).sort(), [
    'outcome',
    'pendingAdmittedRuns',
    'quarantinedReservations',
  ]);
  assert.deepEqual(report, { outcome, pendingAdmittedRuns: 0, quarantinedReservations });
}

function listenersCleared(io: ReturnType<typeof boundaryIO>) {
  assert.equal(io.request.listenerCount('aborted'), 0);
  for (const event of ['finish', 'close', 'error'])
    assert.equal(io.response.listenerCount(event), 0);
}

// Runner owns the shared application and its fresh managed seed lifecycle.
describe(
  'production boundary no-listener qualification',
  { concurrency: false, timeout: 120_000 },
  () => {
    after(() => {
      for (const current of owners) current.close();
    });

    for (const outcome of ['denied', 'missing', 'ambiguous', 'unavailable', 'throw'] as const) {
      it(`synthetic admission ${outcome}`, { timeout: 15_000 }, async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        fixture.ports.binding = async () => {
          fixture.counts.provider++;
          assert.equal(current.snapshot().active, 1, 'reserved_before_provider');
          if (outcome === 'throw') throw new Error('synthetic_private_error');
          return { outcome };
        };
        const result = await current.run(io.req, io.res, fixture.ports);
        assert.equal(result.status, outcome === 'denied' ? 403 : outcome === 'throw' ? 500 : 503);
        assert.deepEqual(fixture.counts, { provider: 1, executor: 0, cleanup: 0 });
        assert.equal(result.released, true);
        assert.equal(io.response.bytes, 0);
        assert.equal(io.response.ends, 1);
        assert.equal(current.snapshot().active, 0);
        record(
          t,
          `admission-${outcome}`,
          'synthetic-boundary',
          current,
          result.status,
          result.released,
          result.terminal,
        );
      });
    }

    it(
      'missing binding and invalid limits cannot open executor admission',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        fixture.ports.binding = async () => undefined;
        assert.equal((await current.run(io.req, io.res, fixture.ports)).status, 503);
        const invalid = createProductionRequestOwner(
          undefined as unknown as typeof productionOwnerLimits,
        );
        const other = boundaryIO();
        const otherFixture = controlledPorts(other);
        assert.equal((await invalid.run(other.req, other.res, otherFixture.ports)).status, 503);
        assert.equal(otherFixture.counts.provider, 0);
        assert.equal(invalid.snapshot().healthy, false);
        record(t, 'invalid-limits', 'synthetic-boundary', invalid, 503, false, true);
      },
    );

    it(
      'whole continuation and response terminal each hold capacity',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        io.response.autoFinish = false;
        const fixture = controlledPorts(io);
        const entered = barrier();
        const release = barrier();
        fixture.ports.execute = async (callback, _options, lifecycle) => {
          fixture.counts.executor++;
          lifecycle.initializeContext(fixture.ctx);
          await callback(fixture.ctx);
          entered.release();
          await release.promise;
          lifecycle.onScopeOutcome('disposed');
        };
        let settled = false;
        const task = current.run(io.req, io.res, fixture.ports).then(result => {
          settled = true;
          return result;
        });
        try {
          await waitFor(entered.promise);
          assert.equal(current.snapshot().active, 1);
          assert.equal(settled, false);
          release.release();
          await turns();
          assert.equal(current.snapshot().active, 1);
          assert.equal(settled, false);
          io.response.finish();
          const result = await task;
          assert.equal(result.scopeDisposed && result.executorSettled && result.released, true);
          assert.deepEqual(fixture.counts, { provider: 1, executor: 1, cleanup: 1 });
          record(
            t,
            'continuation-terminal',
            'synthetic-boundary',
            current,
            200,
            result.released,
            result.terminal,
          );
        } finally {
          release.release();
          io.response.finish();
          await task;
        }
      },
    );

    for (const stage of ['before', 'during', 'commit', 'disposal'] as const) {
      it(`controlled ${stage} rejection is not scope recovery`, { timeout: 15_000 }, async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        const held = barrier();
        const rejected = barrier();
        const stages = { callback: 0, commit: 0, disposal: 0 };
        fixture.ports.work = async () => {
          stages.callback++;
          if (stage === 'during') await held.promise;
        };
        fixture.ports.execute = async (callback, _options, lifecycle) => {
          fixture.counts.executor++;
          try {
            if (stage === 'before') {
              lifecycle.onScopeOutcome('not_created');
              throw new Error('synthetic_private_error');
            }
            lifecycle.initializeContext(fixture.ctx);
            const work = callback(fixture.ctx);
            if (stage === 'during') throw new Error('synthetic_private_error');
            await work;
            stages.commit++;
            if (stage === 'commit') throw new Error('synthetic_private_error');
            stages.disposal++;
            throw new Error('synthetic_private_error');
          } finally {
            rejected.release();
          }
        };
        let settled = false;
        const task = current.run(io.req, io.res, fixture.ports).then(result => {
          settled = true;
          return result;
        });
        try {
          await waitFor(rejected.promise);
          await turns();
          if (stage === 'during') {
            assert.equal(settled, false, 'rejection_does_not_settle_callback');
            assert.equal(current.snapshot().active, 1);
            assert.equal(fixture.counts.cleanup, 0);
          }
        } finally {
          held.release();
          await task;
        }
        const result = await task;
        assert.deepEqual(stages, {
          callback: stage === 'before' ? 0 : 1,
          commit: stage === 'commit' || stage === 'disposal' ? 1 : 0,
          disposal: stage === 'disposal' ? 1 : 0,
        });
        assert.equal(fixture.counts.executor, 1);
        assert.equal(fixture.counts.cleanup, stage === 'before' ? 0 : 1);
        assert.equal(result.status, 500);
        assert.equal(result.fault, true);
        assert.equal(result.released, false);
        assert.equal(result.scopeDisposed, false);
        assert.equal(current.snapshot().active, 1);
        assert.equal(current.snapshot().healthy, false);
        assert.equal(io.response.ends, 1);
        assert.equal(io.response.bytes, 0);
        const other = boundaryIO();
        const next = controlledPorts(other);
        assert.equal((await current.run(other.req, other.res, next.ports)).status, 503);
        assert.equal(next.counts.provider, 0);
        record(
          t,
          `fault-${stage}`,
          'controlled-fault',
          current,
          result.status,
          result.released,
          result.terminal,
        );
      });
    }

    it(
      'late pure error does not rewrite a committed or terminal response',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        fixture.ports.work = async ctx => {
          io.response.headersSent = true;
          ctx.onerror(new Error('synthetic_private_error'));
        };
        const result = await current.run(io.req, io.res, fixture.ports);
        assert.equal(io.response.ends, 0);
        assert.equal(io.response.destroys, 1);
        assert.equal(io.response.statusCode, 200);
        fixture.ctx.onerror(new Error('synthetic_late_private_error'));
        assert.equal(io.response.ends, 0);
        assert.equal(io.response.destroys, 1);
        assert.equal(io.response.bytes, 0);
        assert.equal(result.released, true);
        record(
          t,
          'late-postcommit',
          'synthetic-boundary',
          current,
          result.status,
          result.released,
          result.terminal,
        );
      },
    );

    it('cleanup failure remains unhealthy without normal release', { timeout: 15_000 }, async t => {
      const current = owner();
      const io = boundaryIO();
      const fixture = controlledPorts(io);
      fixture.ports.work = async () => {};
      fixture.ports.cleanup = async () => {
        throw new Error('synthetic_private_error');
      };
      const result = await current.run(io.req, io.res, fixture.ports);
      assert.equal(result.cleanupSettled, false);
      assert.equal(result.released, false);
      assert.equal(result.fault, true);
      assert.equal(current.snapshot().healthy, false);
      record(
        t,
        'cleanup-fault',
        'controlled-fault',
        current,
        result.status,
        result.released,
        result.terminal,
      );
    });

    it(
      'cleanup observation overrun fails closed while work remains owned',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        const held = barrier();
        const entered = barrier();
        fixture.ports.cleanup = async () => {
          entered.release();
          await held.promise;
        };
        const task = current.run(io.req, io.res, fixture.ports);
        try {
          await waitFor(entered.promise);
          await delay(1_100);
          assert.equal(current.snapshot().healthy, false);
          assert.equal(current.snapshot().active, 1);
        } finally {
          held.release();
        }
        const result = await task;
        assert.equal(result.released, false);
        record(
          t,
          'cleanup-overrun',
          'controlled-fault',
          current,
          result.status,
          result.released,
          result.terminal,
        );
      },
    );

    it(
      'deadline cancels a held provider but never settles or reuses its slot',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        const held = barrier();
        let signal: AbortSignal | undefined;
        let settled = false;
        fixture.ports.binding = async value => {
          signal = value;
          await held.promise;
          return { outcome: 'admitted', instanceName: '' };
        };
        const task = current.run(io.req, io.res, fixture.ports).then(result => {
          settled = true;
          return result;
        });
        try {
          await delay(5_100);
          assert.equal(signal?.aborted, true);
          assert.equal(settled, false);
          assert.equal(current.snapshot().active, 1);
          assert.equal(io.response.statusCode, 504);
          assert.equal(fixture.counts.executor, 0);
          await delay(1_050);
          assert.equal(current.snapshot().healthy, false);
        } finally {
          held.release();
        }
        const result = await task;
        assert.equal(result.released, false);
        assert.equal(result.executorCalls, 0);
        record(
          t,
          'provider-deadline',
          'controlled-fault',
          current,
          result.status,
          result.released,
          result.terminal,
        );
      },
    );

    it(
      'real healthy executor overlap, disconnect, work and scoped disposal',
      { timeout: 15_000 },
      async t => {
        const current = boundaryOwner();
        const work = barrier();
        const workEntered = barrier();
        const disposal = barrier();
        const disposalEntered = barrier();
        let entered = 0;
        let disposed = 0;
        let calls = 0;
        const contexts = new WeakSet<object>();
        await app.bean.executor.mockCtx(
          async () => {
            const instance = await app.scope('a-instance').model.instance.get({ name: '' });
            assert.equal(instance?.name === '', true, 'managed_default_instance_required');
          },
          { instanceName: null, innerAccess: false },
        );
        const ios = [boundaryIO(), boundaryIO()];
        const tasks = ios.map(io =>
          app.bean.executor.mockCtx(
            async () => {
              const fixture = controlledPorts(io);
              fixture.ports.execute = async (callback, options, lifecycle) => {
                calls++;
                assert.deepEqual(Object.keys(options).sort(), [
                  'dbInfo',
                  'innerAccess',
                  'instanceName',
                  'req',
                  'res',
                ]);
                assert.equal(options.instanceName, '');
                assert.equal(options.innerAccess, false);
                assert.deepEqual(options.dbInfo, { level: 0 });
                let witness = false;
                await app.bean.executor.newCtx(
                  async () => {
                    const ctx = app.ctx;
                    assert.equal(contexts.has(ctx), false, 'distinct_request_context');
                    contexts.add(ctx);
                    assert.equal(
                      ctx.instance !== undefined && ctx.instance !== null,
                      true,
                      'managed_seed_required',
                    );
                    const instances = (
                      ctx.bean as unknown as {
                        [SymbolBeanContainerInstances]: Record<string, unknown>;
                      }
                    )[SymbolBeanContainerInstances];
                    instances['production-boundary-witness'] = {
                      async __dispose__() {
                        disposed++;
                        if (disposed === 2) disposalEntered.release();
                        await disposal.promise;
                        witness = true;
                      },
                    };
                    await callback(ctx);
                  },
                  {
                    instanceName: '',
                    innerAccess: options.innerAccess,
                    dbInfo: options.dbInfo,
                    req: options.req,
                    res: options.res,
                  },
                  {
                    initializeContext(ctx) {
                      assert.equal(getRequestBoundary() !== undefined, true);
                      lifecycle.initializeContext(ctx);
                      assert.equal(ctx.respond, false, 'early_native_ownership');
                    },
                    onScopeOutcome(outcome) {
                      assert.equal(witness, true, 'actual_disposal_before_outcome');
                      lifecycle.onScopeOutcome(outcome);
                    },
                  },
                );
                assert.equal(witness, true, 'normal_disposal_witness');
              };
              fixture.ports.work = async (ctx: ProductionOwnerContext, signal) => {
                assert.equal(ctx.respond, false);
                entered++;
                if (entered === 2) workEntered.release();
                await work.promise;
                if (!signal.aborted) io.response.end();
              };
              return await current.run(io.req, io.res, fixture.ports);
            },
            { instanceName: null, innerAccess: false },
          ),
        );
        try {
          await waitFor(workEntered.promise);
          assert.equal(current.snapshot().active, 2);
          assert.equal(calls, 2);
          const third = boundaryIO();
          const fixture = controlledPorts(third);
          assert.equal((await current.run(third.req, third.res, fixture.ports)).status, 429);
          assert.equal(fixture.counts.provider, 0);
          ios[0].disconnect();
          await turns();
          assert.equal(current.snapshot().active, 2);
          assert.equal(current.snapshot().releases, 0);
          work.release();
          await waitFor(disposalEntered.promise);
          assert.equal(current.snapshot().active, 2);
          assert.equal(current.snapshot().releases, 0);
          disposal.release();
          const results = await Promise.all(tasks);
          assert.equal(
            results.every(
              result =>
                result.workSettled &&
                result.cleanupSettled &&
                result.scopeDisposed &&
                result.executorSettled &&
                result.terminal &&
                result.released,
            ),
            true,
          );
          assert.deepEqual(current.snapshot(), {
            healthy: true,
            open: true,
            active: 0,
            reservations: 2,
            releases: 2,
          });
          record(t, 'real-overlap-disconnect', 'real-healthy', current, 200, true, true);
        } finally {
          work.release();
          disposal.release();
          for (const io of ios) {
            if (!io.response.writableEnded && !io.response.destroyed) io.response.end();
          }
          await Promise.allSettled(tasks);
        }
      },
    );

    it(
      'empty and close-before-drain retain one exact promise and closed gate',
      { timeout: 15_000 },
      async t => {
        for (const closeFirst of [false, true]) {
          const current = owner();
          if (closeFirst) current.close();
          const draining = current.drain();
          assert.equal(current.snapshot().open, false);
          assert.equal(current.drain(), draining);
          drainReport(await draining, 'drained', 0);
          assert.equal(current.drain(), draining);
          current.close();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          const result = await current.run(io.req, io.res, fixture.ports);
          assert.equal(result.status, 503);
          assert.deepEqual(fixture.counts, { provider: 0, executor: 0, cleanup: 0 });
          listenersCleared(io);
          record(
            t,
            closeFirst ? 'drain-after-close' : 'drain-empty',
            'synthetic-boundary',
            current,
            503,
            false,
            true,
          );
        }
      },
    );

    it(
      'provider and abort-listener reentry share a published drain and closed admission',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        const held = barrier();
        const entered = barrier();
        let providerDrain: ReturnType<typeof current.drain> | undefined;
        let abortDrain: ReturnType<typeof current.drain> | undefined;
        let aborts = 0;
        let signal: AbortSignal | undefined;
        const onAbort = () => {
          aborts++;
          abortDrain = current.drain();
          assert.equal(current.snapshot().open, false);
          io.response.end();
        };
        fixture.ports.binding = async value => {
          fixture.counts.provider++;
          signal = value;
          value.addEventListener('abort', onAbort, { once: true });
          providerDrain = current.drain();
          entered.release();
          await held.promise;
          return { outcome: 'admitted', instanceName: '' };
        };
        const task = current.run(io.req, io.res, fixture.ports);
        let settled = false;
        const draining = current.drain();
        const observed = draining.then(() => {
          settled = true;
        });
        try {
          await waitFor(entered.promise);
          assert.equal(providerDrain, draining);
          assert.equal(abortDrain, draining);
          current.close();
          current.drain();
          assert.equal(aborts, 1);
          await turns();
          assert.equal(io.response.writableFinished, true);
          assert.equal(settled, false, 'originating_provider_still_owned');
          assert.equal(current.snapshot().active, 1);
        } finally {
          held.release();
          await task;
          await observed;
          signal?.removeEventListener('abort', onAbort);
        }
        drainReport(await draining, 'drained', 0);
        assert.equal(current.snapshot().releases, 1);
        assert.equal(fixture.counts.executor, 0);
        listenersCleared(io);
        record(t, 'drain-reentry', 'synthetic-boundary', current, 0, true, true);
      },
    );

    for (const stage of ['provider', 'work', 'cleanup', 'executor', 'disposal'] as const) {
      it(
        `drain joins independently held ${stage} after cancellation and terminal`,
        { timeout: 15_000 },
        async t => {
          const current = owner();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          const held = barrier();
          const entered = barrier();
          let signal: AbortSignal | undefined;
          const onAbort = () => {
            if (!io.response.writableEnded) io.response.end();
          };
          async function hold() {
            entered.release();
            await held.promise;
          }
          fixture.ports.binding = async value => {
            fixture.counts.provider++;
            signal = value;
            value.addEventListener('abort', onAbort, { once: true });
            if (stage === 'provider') await hold();
            return { outcome: 'admitted', instanceName: '' };
          };
          fixture.ports.work = async () => {
            if (stage === 'work') await hold();
            if (!io.response.writableEnded) io.response.end();
          };
          fixture.ports.cleanup = async () => {
            fixture.counts.cleanup++;
            if (stage === 'cleanup') await hold();
          };
          let disposed = false;
          fixture.ports.execute = async (callback, _options, lifecycle) => {
            fixture.counts.executor++;
            lifecycle.initializeContext(fixture.ctx);
            await callback(fixture.ctx);
            if (stage === 'disposal') await hold();
            // A synthetic observation, not a real framework disposer.
            disposed = true;
            lifecycle.onScopeOutcome('disposed');
            if (stage === 'executor') await hold();
          };
          const task = current.run(io.req, io.res, fixture.ports);
          let draining: ReturnType<typeof current.drain> | undefined;
          let settled = false;
          let observed: Promise<void> | undefined;
          try {
            await waitFor(entered.promise);
            draining = current.drain();
            observed = draining.then(() => {
              settled = true;
            });
            await turns();
            assert.equal(io.response.writableFinished, true);
            assert.equal(settled, false);
            assert.equal(disposed, stage === 'executor');
            assert.equal(current.snapshot().active, 1);
            assert.equal(current.snapshot().releases, 0);
          } finally {
            held.release();
            await task;
            await observed;
            signal?.removeEventListener('abort', onAbort);
          }
          drainReport(await draining!, 'drained', 0);
          assert.equal(current.snapshot().releases, 1);
          listenersCleared(io);
          record(t, `drain-held-${stage}`, 'synthetic-boundary', current, 0, true, true);
        },
      );
    }

    it(
      'drain joins held terminal and the release-to-outer-teardown gap',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        io.response.autoFinish = false;
        const workDone = barrier();
        const execute = fixture.ports.execute;
        fixture.ports.execute = async (...args) => {
          await execute(...args);
          workDone.release();
        };
        let settled = false;
        let gapObserved = false;
        let gapStillPending = false;
        let gapDrain: ReturnType<typeof current.drain> | undefined;
        io.response.teardown = () => {
          gapObserved = true;
          assert.equal(current.snapshot().active, 0, 'normal_release_precedes_teardown');
          gapDrain = current.drain();
          queueMicrotask(() => {
            gapStillPending = !settled;
          });
        };
        const task = current.run(io.req, io.res, fixture.ports);
        let draining: ReturnType<typeof current.drain> | undefined;
        let observed: Promise<void> | undefined;
        try {
          await waitFor(workDone.promise);
          draining = current.drain();
          observed = draining.then(() => {
            settled = true;
          });
          await turns();
          assert.equal(settled, false);
          assert.equal(current.snapshot().active, 1);
          io.response.finish();
          await task;
          await observed;
          assert.equal(gapObserved && gapStillPending, true);
          assert.equal(gapDrain, draining);
          drainReport(await draining, 'drained', 0);
        } finally {
          io.response.finish();
          await task;
          await observed;
          io.response.teardown = undefined;
        }
        listenersCleared(io);
        record(t, 'drain-terminal-teardown', 'synthetic-boundary', current, 200, true, true);
      },
    );

    for (const stage of ['provider', 'cleanup'] as const) {
      it(
        `drain never treats ${stage} observation overrun as settlement`,
        { timeout: 15_000 },
        async t => {
          const current = owner();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          const held = barrier();
          const entered = barrier();
          if (stage === 'provider') {
            fixture.ports.binding = async () => {
              fixture.counts.provider++;
              entered.release();
              await held.promise;
              return { outcome: 'admitted', instanceName: '' };
            };
          } else {
            fixture.ports.cleanup = async () => {
              fixture.counts.cleanup++;
              entered.release();
              await held.promise;
            };
          }
          const task = current.run(io.req, io.res, fixture.ports);
          let draining: ReturnType<typeof current.drain> | undefined;
          let settled = false;
          let observed: Promise<void> | undefined;
          try {
            await waitFor(entered.promise);
            draining = current.drain();
            observed = draining.then(() => {
              settled = true;
            });
            await delay(1_100);
            assert.equal(current.snapshot().healthy, false);
            assert.equal(current.snapshot().active, 1);
            assert.equal(settled, false);
          } finally {
            held.release();
            await task;
            await observed;
          }
          drainReport(await draining!, 'faulted', 1);
          assert.equal(current.snapshot().releases, 0);
          listenersCleared(io);
          record(
            t,
            `drain-overrun-${stage}`,
            'controlled-fault',
            current,
            io.response.statusCode,
            false,
            true,
          );
        },
      );
    }

    for (const before of [true, false]) {
      it(
        `controlled fault ${before ? 'before' : 'during'} drain persists`,
        { timeout: 15_000 },
        async t => {
          const current = owner();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          const entered = barrier();
          const held = barrier();
          fixture.ports.cleanup = async () => {
            entered.release();
            await held.promise;
            throw new Error('synthetic_private_error');
          };
          const task = current.run(io.req, io.res, fixture.ports);
          let draining: ReturnType<typeof current.drain> | undefined;
          try {
            await waitFor(entered.promise);
            if (before) {
              held.release();
              await task;
            }
            draining = current.drain();
          } finally {
            held.release();
            await task;
          }
          drainReport(await draining!, 'faulted', 1);
          assert.equal(current.drain(), draining);
          listenersCleared(io);
          record(
            t,
            before ? 'drain-fault-before' : 'drain-fault-during',
            'controlled-fault',
            current,
            500,
            false,
            true,
          );
        },
      );
    }

    for (const stage of ['admitted', 'teardown'] as const) {
      for (const before of [true, false]) {
        it(
          `${stage} outer rejection ${before ? 'before' : 'during'} drain preserves caller failure`,
          { timeout: 15_000 },
          async t => {
            const current = owner();
            const io = boundaryIO();
            const fixture = controlledPorts(io);
            const failure = new Error('synthetic_private_error');
            let reentrant: ReturnType<typeof current.drain> | undefined;
            const reject = () => {
              if (!before) reentrant = current.drain();
              throw failure;
            };
            if (stage === 'teardown') io.response.teardown = reject;
            else Object.defineProperty(io.request, 'aborted', { get: reject });
            const task = current.run(io.req, io.res, fixture.ports);
            // Attach a consumed rejection branch immediately; no global rejection instrumentation.
            const checked = assert.rejects(task, error => error === failure);
            try {
              await checked;
              const draining = current.drain();
              if (!before) assert.equal(reentrant, draining);
              drainReport(await draining, 'faulted', stage === 'admitted' ? 1 : 0);
              assert.equal(current.snapshot().healthy, false);
              assert.equal(current.snapshot().releases, stage === 'admitted' ? 0 : 1);
              assert.equal(current.drain(), draining);
              await turns();
            } finally {
              io.response.teardown = undefined;
              await checked;
            }
            listenersCleared(io);
            record(
              t,
              `drain-reject-${stage}-${before ? 'before' : 'during'}`,
              'controlled-fault',
              current,
              0,
              stage === 'teardown',
              io.response.writableFinished,
            );
          },
        );
      }
    }

    it(
      'nonadmitted saturation and closed-response waits remain outside drain',
      { timeout: 15_000 },
      async t => {
        const current = owner();
        const held = barrier();
        const ios = [boundaryIO(), boundaryIO()];
        const tasks = ios.map(io => {
          const fixture = controlledPorts(io);
          fixture.ports.binding = async () => {
            await held.promise;
            return { outcome: 'admitted', instanceName: '' };
          };
          return current.run(io.req, io.res, fixture.ports);
        });
        const denied = [boundaryIO(), boundaryIO()];
        const deniedFixtures = denied.map(io => controlledPorts(io));
        for (const io of denied) io.response.autoFinish = false;
        let firstSettled = false;
        let secondSettled = false;
        const first = current
          .run(denied[0].req, denied[0].res, deniedFixtures[0].ports)
          .then(result => {
            firstSettled = true;
            return result;
          });
        const draining = current.drain();
        const second = current
          .run(denied[1].req, denied[1].res, deniedFixtures[1].ports)
          .then(result => {
            secondSettled = true;
            return result;
          });
        try {
          held.release();
          for (const io of ios) io.response.end();
          await Promise.all(tasks);
          drainReport(await draining, 'drained', 0);
          assert.equal(firstSettled || secondSettled, false);
          assert.equal(denied[0].response.statusCode, 429);
          assert.equal(denied[1].response.statusCode, 503);
          for (const fixture of deniedFixtures)
            assert.deepEqual(fixture.counts, { provider: 0, executor: 0, cleanup: 0 });
          assert.equal(
            denied.every(io => io.response.listenerCount('error') === 1),
            true,
          );
          assert.equal(current.snapshot().releases, 2);
        } finally {
          held.release();
          for (const io of ios) {
            if (!io.response.writableEnded) io.response.end();
          }
          for (const io of denied) io.response.finish();
          await Promise.allSettled([...tasks, first, second]);
          await draining;
        }
        for (const io of [...ios, ...denied]) listenersCleared(io);
        record(t, 'drain-excludes-nonadmitted', 'synthetic-boundary', current, 503, true, true);
      },
    );

    it(
      'composition boundary precedes provider and survives cleanup and outer teardown',
      { timeout: 15_000 },
      async t => {
        assert.equal(app.meta.env.SERVER_LISTEN_DISABLE, 'true');
        assert.equal(app.server === undefined, true);
        const current = boundaryOwner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        let boundary: RequestBoundary | undefined;
        const checked = () => assert.equal(getRequestBoundary(), boundary);
        fixture.ports.binding = async () => {
          boundary = getRequestBoundary();
          assert.notEqual(boundary, undefined);
          await turns();
          checked();
          return { outcome: 'admitted', instanceName: '' };
        };
        const execute = fixture.ports.execute;
        fixture.ports.execute = async (...args) => {
          checked();
          await execute(...args);
          checked();
        };
        fixture.ports.work = async ctx => {
          checked();
          assert.equal(ctx.respond, false);
          io.response.end();
        };
        fixture.ports.cleanup = async () => {
          await turns();
          checked();
        };
        io.response.teardown = checked;
        const result = await current.run(io.req, io.res, fixture.ports);
        assert.equal(result.scopeOutcome, 'disposed');
        assert.equal(result.released, true);
        assert.equal(result.portFault, false);
        assert.equal(getRequestBoundary(), undefined);
        listenersCleared(io);
        record(t, 'composition-lifetime', 'synthetic-boundary', current, 200, true, true);
      },
    );

    it(
      'composition early initializer owns setup failure despite actual healthy disposal',
      { timeout: 15_000 },
      async t => {
        const current = boundaryOwner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        let disposed = 0;
        fixture.ports.execute = async (_callback, options, lifecycle) => {
          await app.bean.executor.newCtx(
            async () => assert.fail('setup_failure_must_not_enter_work'),
            { ...options, instanceName: null },
            {
              initializeContext(ctx) {
                lifecycle.initializeContext(ctx);
                assert.equal(ctx.respond, false);
                const instances = (
                  ctx.bean as unknown as {
                    [SymbolBeanContainerInstances]: Record<string, unknown>;
                  }
                )[SymbolBeanContainerInstances];
                instances['composition-setup-witness'] = {
                  async __dispose__() {
                    assert.notEqual(getRequestBoundary(), undefined);
                    disposed++;
                  },
                };
                ctx.onerror(new Error('synthetic_private_error'));
                throw new Error('synthetic_setup_failure');
              },
              onScopeOutcome: lifecycle.onScopeOutcome,
            },
          );
        };
        const result = await app.bean.executor.mockCtx(
          () => current.run(io.req, io.res, fixture.ports),
          { instanceName: null, innerAccess: false },
        );
        assert.equal(disposed, 1);
        assert.equal(result.scopeOutcome, 'disposed');
        assert.equal(result.callbackCalls, 0);
        assert.equal(result.scopeDisposed, true);
        assert.equal(result.fault, true);
        assert.equal(result.released, false);
        assert.equal(io.response.bytes, 0);
        drainReport(await current.drain(), 'faulted', 1);
        record(t, 'composition-setup-fault', 'real-healthy', current, 500, false, true);
      },
    );

    it(
      'composition controlled creation and disposal failures preserve actual scope outcomes',
      { timeout: 15_000 },
      async t => {
        for (const stage of ['creation', 'disposal'] as const) {
          const current = boundaryOwner();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          const local = controlledScope({
            failCreation: stage === 'creation',
            failDispose: stage === 'disposal',
          });
          fixture.ports.execute = async (callback, _options, lifecycle) => {
            await local.executor.newCtx(
              () => callback(local.context),
              { instanceName: null, innerAccess: false, dbInfo: { level: 0 } },
              {
                initializeContext(ctx) {
                  lifecycle.initializeContext(ctx);
                  local.initialize();
                },
                onScopeOutcome: lifecycle.onScopeOutcome,
              },
            );
          };
          const result = await current.run(io.req, io.res, fixture.ports);
          assert.equal(
            result.scopeOutcome,
            stage === 'creation' ? 'not_created' : 'dispose_failed',
          );
          assert.equal(result.scopeDisposed, false);
          assert.equal(result.released, false);
          assert.equal(result.fault, true);
          assert.equal(result.portFault, false);
          assert.equal(local.counts.decrement, 0);
          drainReport(await current.drain(), 'faulted', 1);
          record(t, `composition-${stage}`, 'controlled-fault', current, 500, false, true);
        }
      },
    );

    it(
      'composition rejects missing duplicate and mismatched lifecycle observations',
      { timeout: 15_000 },
      async t => {
        for (const mode of ['missing-init', 'missing-outcome', 'duplicate', 'mismatch'] as const) {
          const current = boundaryOwner();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          fixture.ports.execute = async (callback, _options, lifecycle) => {
            if (mode !== 'missing-init') lifecycle.initializeContext(fixture.ctx);
            await callback(mode === 'mismatch' ? { ...fixture.ctx } : fixture.ctx);
            if (mode !== 'missing-outcome') lifecycle.onScopeOutcome('disposed');
            if (mode === 'duplicate') lifecycle.onScopeOutcome('disposed');
          };
          const result = await current.run(io.req, io.res, fixture.ports);
          assert.equal(result.portFault, true);
          assert.equal(result.fault, true);
          assert.equal(result.released, false);
          if (mode === 'missing-outcome') assert.equal(result.scopeOutcome, 'pending');
          drainReport(await current.drain(), 'faulted', 1);
          record(t, `composition-${mode}`, 'controlled-fault', current, 500, false, true);
        }
      },
    );

    it(
      'composition boundary faults fail closed before executor or after healthy work',
      { timeout: 15_000 },
      async t => {
        for (const stage of ['provider', 'cleanup'] as const) {
          const current = boundaryOwner();
          const io = boundaryIO();
          const fixture = controlledPorts(io);
          const report = () => captureRequestBoundary()!.reportFailure('diagnostic_failed');
          if (stage === 'provider') {
            fixture.ports.binding = async () => {
              report();
              return { outcome: 'admitted', instanceName: '' };
            };
          } else {
            fixture.ports.cleanup = async () => report();
          }
          const result = await current.run(io.req, io.res, fixture.ports);
          assert.equal(result.portFault, true);
          assert.equal(result.released, false);
          assert.equal(result.executorCalls, stage === 'provider' ? 0 : 1);
          drainReport(await current.drain(), 'faulted', 1);
          record(t, `composition-port-${stage}`, 'controlled-fault', current, 500, false, true);
        }
      },
    );

    it(
      'composition suppresses diagnostic evaluation and refuses boundary replacement',
      { timeout: 15_000 },
      async t => {
        const current = boundaryOwner();
        const io = boundaryIO();
        const fixture = controlledPorts(io);
        let reads = 0;
        const payload = Object.defineProperty({}, 'message', {
          get() {
            reads++;
            throw new Error('diagnostic_must_not_evaluate');
          },
        });
        let sinks = 0;
        const logger = createDiagnosticLogger({
          info() {
            sinks++;
          },
        } as unknown as Parameters<typeof createDiagnosticLogger>[0]);
        fixture.ports.binding = async () => {
          logger.info(payload);
          logger.info(() => {
            reads++;
            return 'private';
          });
          return { outcome: 'admitted', instanceName: '' };
        };
        assert.equal(captureRequestBoundary(), undefined);
        assert.equal((await current.run(io.req, io.res, fixture.ports)).released, true);
        assert.equal(reads, 0);
        assert.equal(sinks, 0);
        assert.equal(captureRequestBoundary(), undefined);
        logger.info('ordinary');
        assert.equal(sinks, 1);
        const other = boundaryIO();
        const otherFixture = controlledPorts(other);
        assert.throws(() =>
          runWithRequestBoundary(createRequestBoundary(), () =>
            current.run(other.req, other.res, otherFixture.ports),
          ),
        );
        assert.equal(otherFixture.counts.provider, 0);
        record(t, 'composition-diagnostic-seam', 'source-scope', current, 200, true, true);
      },
    );

    it(
      'inert source has no production registration or SDK import',
      { timeout: 15_000 },
      async t => {
        const source = await readFile(
          new URL('../src/lib/productionRequestOwner.ts', import.meta.url),
          'utf8',
        );
        assert.equal(
          /@(Bean|Service|Controller|Startup|Aop)|createServer\(|\.listen\(|@modelcontextprotocol|from ['"]vona['"]/u.test(
            source,
          ),
          false,
        );
        const index = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');
        assert.equal(index.includes('productionRequestOwner'), false);
        const current = owner();
        record(t, 'inert-source-scope', 'source-scope', current, 0, false, false);
      },
    );
  },
);
