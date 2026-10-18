import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, describe, it } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { SymbolBeanContainerInstances } from 'vona';
import { app } from 'vona-mock';

import type { ProductionOwnerContext } from '../src/lib/productionRequestOwner.ts';

import {
  createProductionRequestOwner,
  productionOwnerLimits,
} from '../src/lib/productionRequestOwner.ts';
import {
  barrier,
  boundaryIO,
  controlledPorts,
  safeEvent,
  turns,
  waitFor,
} from './support/productionBoundaryFixture.ts';

const owners: ReturnType<typeof createProductionRequestOwner>[] = [];
function owner() {
  const result = createProductionRequestOwner(productionOwnerLimits);
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
        fixture.ports.execute = async (callback, _options, disposed) => {
          fixture.counts.executor++;
          await callback(fixture.ctx);
          entered.release();
          await release.promise;
          disposed();
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
        fixture.ports.execute = async callback => {
          fixture.counts.executor++;
          try {
            if (stage === 'before') throw new Error('synthetic_private_error');
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
        const current = owner();
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
              fixture.ports.execute = async (callback, options, observeDisposed) => {
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
                );
                assert.equal(witness, true, 'normal_disposal_witness');
                observeDisposed();
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
