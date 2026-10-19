import type { RequestBoundary, RequestBoundaryCapture, VonaContext, VonaScopeOutcome } from 'vona';

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import {
  AppLogger,
  BeanBase,
  captureRequestBoundary,
  createRequestBoundary,
  formatLoggerAxiosError,
  formatLoggerConsole,
  formatLoggerCtx,
  formatLoggerDummy,
  formatLoggerErrors,
  formatLoggerFilter,
  getRequestBoundary,
  getSuppressedDiagnosticLogger,
  runWithRequestBoundary,
  SymbolBeanContainerInstances,
} from 'vona';
import { app } from 'vona-mock';

import type { INewCtxLifecycle } from '../../../../a-vona/modules/a-executor/src/types/executor.ts';

import { ServiceExecutor } from '../../../../a-vona/modules/a-executor/src/service/executor.ts';
import { SymbolRouterMiddleware } from '../../../../a-vona/modules/a-executor/src/types/executor.ts';
import { AopMethodLog } from '../../../../a-vona/modules/a-logger/src/bean/aopMethod.log.ts';
import { MiddlewareSystemHttpLog } from '../../../../a-vona/modules/a-logger/src/bean/middlewareSystem.httpLog.ts';
import { ServiceTransactionAsyncLocalStorage } from '../../../../a-vona/modules/a-orm/src/service/transactionAsyncLocalStorage_.ts';
import { BeanTelemetry } from '../../../../a-vona/modules/a-telemetry/src/bean/bean.telemetry.ts';
import {
  createHttpSpanEnd,
  endHttpSpan,
  recordSpanException,
} from '../../../../a-vona/modules/a-telemetry/src/lib/spanDiagnostics.ts';
import { ServiceTelemetry } from '../../../../a-vona/modules/a-telemetry/src/service/telemetry.ts';
import {
  barrier,
  controlledScope,
  getterProbe,
  heldBarrier,
  LocalResponse,
  memoryLogger,
  observe,
  projection,
  rejectsIdentity,
  spanFixture,
  turns,
} from './support/requestBoundaryFoundationFixture.ts';

const ROOT_CONTEXT = Object.getOwnPropertyDescriptor(
  ServiceTelemetry.prototype,
  'activeContext',
)!.get!.call({ ctx: undefined });
const contextOptions = { instanceName: null, innerAccess: false } as const;
function witness(ctx: any, dispose: () => Promise<void>) {
  ctx.bean[SymbolBeanContainerInstances]['request-boundary-foundation-witness'] = {
    __dispose__: dispose,
  };
}
function countReads(target: object, key: PropertyKey, counts: { reads: number }) {
  Object.defineProperty(target, key, {
    get() {
      counts.reads++;
      throw new Error();
    },
  });
}
function noReads(probe: ReturnType<typeof getterProbe>) {
  assert.deepEqual(probe.counts, { reads: 0, lazy: 0, sql: 0, string: 0 });
}

// The managed runner owns startup, disposable seeds, its listener and shutdown.
// Local diagnostic collaborators prove seams, not an installed HTTP/OAuth graph.
describe(
  'request boundary foundation qualification',
  { concurrency: false, timeout: 120_000 },
  () => {
    it(
      '1 capability precedes context and preserves synchronous and async ownership',
      { timeout: 15_000 },
      async t => {
        assert.equal(app.ctx, undefined);
        assert.equal(getRequestBoundary(), undefined);
        assert.equal(captureRequestBoundary(), undefined);
        const boundary = createRequestBoundary();
        const other = createRequestBoundary();
        let deniedCalls = 0;
        assert.equal(Object.isFrozen(boundary), true);
        assert.throws(() =>
          runWithRequestBoundary({} as RequestBoundary, () => {
            deniedCalls++;
          }),
        );
        const error = new Error();
        assert.equal(
          runWithRequestBoundary(boundary, () => 17),
          17,
        );
        assert.throws(
          () =>
            runWithRequestBoundary(boundary, () => {
              throw error;
            }),
          value => value === error,
        );
        const value = Promise.resolve(23);
        assert.equal(
          runWithRequestBoundary(boundary, () => value),
          value,
        );
        const failure = Promise.reject(error);
        assert.equal(
          runWithRequestBoundary(boundary, () => failure),
          failure,
        );
        await rejectsIdentity(failure, error);
        await runWithRequestBoundary(boundary, async () => {
          assert.equal(getRequestBoundary(), boundary);
          const capture = captureRequestBoundary()!;
          assert.equal(Object.isFrozen(capture), true);
          assert.equal(capture.diagnostics, 'suppress');
          assert.deepEqual(Object.keys(capture).sort(), [
            'diagnostics',
            'reportFailure',
            'snapshot',
          ]);
          assert.deepEqual(capture.snapshot(), { portFault: false });
          assert.throws(() =>
            runWithRequestBoundary(other, () => {
              deniedCalls++;
            }),
          );
          await runWithRequestBoundary(boundary, async () => {
            await turns();
            assert.equal(getRequestBoundary(), boundary);
            assert.equal(captureRequestBoundary(), capture);
          });
        });
        assert.equal(deniedCalls, 0);
        assert.equal(getRequestBoundary(), undefined);
        projection(t, 'capability', { deniedCalls, cleared: getRequestBoundary() === undefined });
      },
    );

    it(
      '2 synchronous initialization precedes controlled setup and actual healthy throw disposal',
      { timeout: 15_000 },
      async t => {
        const local = controlledScope();
        const outcomes: VonaScopeOutcome[] = [];
        let calls = 0;
        assert.equal(
          await local.executor.newCtx(
            async () => {
              calls++;
              return 19;
            },
            {
              instanceName: null,
              innerAccess: false,
              locale: 'en-us',
              tz: 'UTC',
              dbInfo: { level: 0 },
            },
            {
              initializeContext(ctx) {
                assert.equal(ctx, local.context);
                assert.equal(local.storage.getStore(), ctx);
                assert.deepEqual(local.counts, {
                  increment: 1,
                  decrement: 0,
                  dispose: 0,
                  remaining: 0,
                  setup: 0,
                  commits: 0,
                  database: 0,
                });
                local.initialize();
              },
              onScopeOutcome(outcome) {
                outcomes.push(outcome);
              },
            },
          ),
          19,
        );
        assert.equal(calls, 1);
        assert.equal(local.counts.database, 1);
        assert.equal(local.counts.commits, 1);
        assert.deepEqual(outcomes, ['disposed']);

        const error = new Error();
        let disposed = 0;
        let business = 0;
        const healthy: VonaScopeOutcome[] = [];
        await rejectsIdentity(
          app.bean.executor.mockCtx(
            async () => {
              business++;
            },
            contextOptions,
            {
              initializeContext(ctx) {
                assert.equal(app.ctx, ctx);
                witness(ctx, async () => {
                  disposed++;
                });
                throw error;
              },
              onScopeOutcome(outcome) {
                healthy.push(outcome);
              },
            },
          ),
          error,
        );
        assert.equal(business, 0);
        assert.equal(disposed, 1);
        assert.deepEqual(healthy, ['disposed']);

        const held = heldBarrier();
        const entered = barrier();
        const misuse = controlledScope();
        const misuseOutcomes: VonaScopeOutcome[] = [];
        let settled = false;
        const task = misuse.executor.newCtx(
          async () => {
            business++;
          },
          contextOptions,
          {
            initializeContext: (() => {
              entered.release();
              return held.promise;
            }) as () => void,
            onScopeOutcome(outcome) {
              misuseOutcomes.push(outcome);
            },
          },
        );
        const rejection = assert.rejects(
          task,
          error =>
            error instanceof Error && error.message === 'Context initializer must be synchronous',
        );
        const joined = rejection.then(() => {
          settled = true;
        });
        try {
          await observe(entered.promise);
          await turns();
          assert.equal(settled, false);
          assert.equal(misuse.counts.setup, 0);
          assert.equal(misuse.counts.dispose, 0);
          assert.deepEqual(misuseOutcomes, []);
        } finally {
          held.release();
          await joined;
        }
        assert.equal(held.expired, false);
        assert.equal(business, 0);
        assert.deepEqual(misuseOutcomes, ['disposed']);
        projection(t, 'initializer', {
          calls,
          disposed,
          business,
          setup: misuse.counts.setup,
          settled,
        });
      },
    );

    it(
      '3 independent real mockCtx overlap does not bleed protected policy',
      { timeout: 15_000 },
      async t => {
        const local = memoryLogger();
        const boundary = createRequestBoundary();
        const held = heldBarrier();
        const entered = barrier();
        const contexts = new WeakSet<object>();
        let count = 0;
        const tasks = [true, false].map(protectedCall => {
          const execute = () =>
            app.bean.executor.mockCtx(async () => {
              assert.equal(contexts.has(app.ctx), false);
              contexts.add(app.ctx);
              assert.equal(getRequestBoundary(), protectedCall ? boundary : undefined);
              count++;
              if (count === 2) entered.release();
              await held.promise;
              assert.equal(getRequestBoundary(), protectedCall ? boundary : undefined);
              local.logger.error('local');
            }, contextOptions);
          return protectedCall ? runWithRequestBoundary(boundary, execute) : execute();
        });
        try {
          await observe(entered.promise);
          assert.deepEqual(local.counts(), [0, 0, 0, 0]);
          held.release();
          await Promise.all(tasks);
          await turns();
          assert.deepEqual(local.counts(), [1, 0, 0, 1]);
          assert.equal(getRequestBoundary(), undefined);
        } finally {
          held.release();
          await Promise.allSettled(tasks);
          await local.close();
        }
        assert.equal(held.expired, false);
        projection(t, 'overlap', {
          contexts: count,
          protectedSinks: 0,
          ordinarySinks: local.counts()[0],
        });
      },
    );

    it(
      '4 real local Winston gates every supported input before evaluation and formatting',
      { timeout: 15_000 },
      async t => {
        const local = memoryLogger();
        const probe = getterProbe();
        const boundary = createRequestBoundary();
        let writes = 0;
        try {
          runWithRequestBoundary(boundary, () => {
            for (const level of [
              'error',
              'warn',
              'info',
              'http',
              'verbose',
              'debug',
              'silly',
            ] as const) {
              local.logger[level](probe.payload);
              local.logger[level](probe.error);
              local.logger[level](probe.axios);
              local.logger[level](probe.lazy as any, probe.payload);
            }
            local.logger.log(probe.payload as any);
            local.logger.log('error', probe.payload as any, probe.payload);
            assert.equal(
              local.logger.write(probe.payload, () => {
                writes++;
              }),
              true,
            );
            local.logger.child(probe.payload).error(probe.payload);
            local.logger.startTimer().done(probe.payload);
            local.logger.profile('local', probe.payload);
            const formats = [
              formatLoggerAxiosError({ stack: true, cause: true }),
              formatLoggerErrors(probe.payload),
              formatLoggerCtx(),
              formatLoggerDummy(),
              formatLoggerFilter(probe.payload as any),
              formatLoggerConsole(probe.payload as any),
            ];
            for (const format of formats)
              assert.equal(format.transform(probe.payload as any, probe.payload), false);
          });
          await turns();
          noReads(probe);
          assert.equal(writes, 1);
          assert.deepEqual(local.counts(), [0, 0, 0, 0]);
          local.logger.error('local');
          local.logger.warn('local');
          local.logger.http('local');
          await turns();
          assert.deepEqual(local.counts(), [1, 1, 1, 3]);
          projection(t, 'winston', { ...probe.counts, writes, ordinarySinks: local.counts()[3] });
        } finally {
          await local.close();
        }
      },
    );

    it(
      '5 preacquired handles resume but protected children, timers and first lookups stay inert',
      { timeout: 15_000 },
      async t => {
        const local = memoryLogger();
        const child = local.logger.child({ name: 'local' });
        const timer = local.logger.startTimer();
        const probe = getterProbe();
        let protectedChild!: typeof child;
        let protectedTimer!: typeof timer;
        let creations = 0;
        const factory = new AppLogger();
        Object.defineProperty(factory, '_createClient', {
          value() {
            creations++;
            return local.raw;
          },
        });
        class LocalBean extends BeanBase {
          logger() {
            return this.$loggerClient();
          }

          child() {
            return this.$loggerChild('req');
          }
        }
        const bean = new LocalBean();
        Object.defineProperty(bean, 'app', { value: { meta: { logger: factory } } });
        const failures = { calls: 0 };
        let capture!: RequestBoundaryCapture;
        const boundary = createRequestBoundary({
          onFailure() {
            failures.calls++;
            capture.reportFailure('diagnostic_failed');
            capture.reportFailure('late_callback_failed');
            throw new Error();
          },
        });
        try {
          runWithRequestBoundary(boundary, () => {
            capture = captureRequestBoundary()!;
            child.error(probe.payload);
            timer.done(probe.payload);
            assert.notEqual(timer.logger, local.raw);
            protectedChild = local.logger.child(probe.payload);
            protectedTimer = local.logger.startTimer();
            assert.equal(factory.get(), getSuppressedDiagnosticLogger());
            assert.equal(factory.child('req'), getSuppressedDiagnosticLogger());
            assert.equal(bean.logger(), getSuppressedDiagnosticLogger());
            assert.equal(bean.child(), getSuppressedDiagnosticLogger());
            assert.equal(creations, 0);
            capture.reportFailure('diagnostic_failed');
            capture.reportFailure('diagnostic_failed');
          });
          assert.equal(failures.calls, 1);
          assert.deepEqual(capture.snapshot(), { portFault: true });
          let asyncCapture!: RequestBoundaryCapture;
          runWithRequestBoundary(
            createRequestBoundary({ onFailure: (() => Promise.reject(new Error())) as () => void }),
            () => {
              asyncCapture = captureRequestBoundary()!;
              asyncCapture.reportFailure('diagnostic_failed');
            },
          );
          await turns();
          assert.equal(
            asyncCapture.snapshot().portFault,
            true,
            'async_port_is_unsupported_not_a_lifetime_guarantee',
          );
          protectedChild.error(probe.payload);
          protectedTimer.done(probe.payload);
          protectedTimer.logger.error(probe.payload);
          noReads(probe);
          assert.equal(creations, 0);
          child.error('local');
          const ordinary = factory.get();
          assert.notEqual(ordinary, getSuppressedDiagnosticLogger());
          assert.notEqual(ordinary, local.raw);
          assert.equal(factory.get(), ordinary);
          bean.logger().error('local');
          bean.child().error('local');
          assert.equal(creations, 1);
          await turns();
          assert.deepEqual(local.counts(), [3, 0, 0, 3]);
          projection(t, 'factory', {
            ...probe.counts,
            creations,
            failures: failures.calls,
            portFault: capture.snapshot().portFault,
          });
        } finally {
          await local.close();
        }
      },
    );

    it(
      '6 actual HTTP log function bypasses diagnostic receiver and serializer ports',
      { timeout: 15_000 },
      async t => {
        const counts = { reads: 0 };
        const receiver: any = {};
        for (const key of ['ctx', 'app', '$loggerChild']) countReads(receiver, key, counts);
        const probe = getterProbe();
        let calls = 0;
        const execute = (next: () => Promise<any>) =>
          runWithRequestBoundary(createRequestBoundary(), () =>
            MiddlewareSystemHttpLog.prototype.execute.call(receiver, probe.payload as any, next),
          );
        await execute(async () => {
          calls++;
        });
        const error = new Error();
        await rejectsIdentity(
          execute(async () => {
            calls++;
            throw error;
          }),
          error,
        );
        assert.equal(calls, 2);
        assert.equal(counts.reads, 0);
        noReads(probe);
        projection(t, 'http-seam', { calls, diagnosticReads: counts.reads, ...probe.counts });
      },
    );

    it(
      '7 actual action AOP and inner executor seams preserve business without diagnostic reads',
      { timeout: 15_000 },
      async t => {
        const counts = { reads: 0 };
        const receiver: any = {};
        for (const key of ['app', '_getContext', '_logResult', '_logError'])
          countReads(receiver, key, counts);
        const probe = getterProbe();
        const result = Object.create(null);
        const boundary = createRequestBoundary();
        const aop = AopMethodLog.prototype;
        runWithRequestBoundary(boundary, () => {
          assert.equal(
            aop.get.call(receiver, probe.payload as any, () => result, probe.payload, 'local'),
            result,
          );
          assert.equal(
            aop.set.call(
              receiver,
              probe.payload as any,
              probe.payload,
              () => true,
              probe.payload,
              'local',
            ),
            true,
          );
          assert.equal(
            aop.execute.call(
              receiver,
              probe.payload as any,
              probe.payload as any,
              () => result,
              probe.payload,
              'local',
            ),
            result,
          );
          const error = probe.error;
          assert.throws(
            () =>
              aop.execute.call(
                receiver,
                probe.payload as any,
                [] as any,
                () => {
                  throw error;
                },
                probe.payload,
                'local',
              ),
            value => value === error,
          );
        });
        await rejectsIdentity(
          runWithRequestBoundary(boundary, () =>
            aop.execute.call(
              receiver,
              probe.payload as any,
              [] as any,
              async () => {
                throw probe.error;
              },
              probe.payload,
              'local',
            ),
          ) as Promise<unknown>,
          probe.error,
        );

        const ctx: any = { req: { headers: {} }, res: {}, request: {}, status: 200, body: result };
        let calls = 0;
        const own: any = {
          ctx,
          app: {
            async [SymbolRouterMiddleware]() {
              calls++;
            },
            util: {
              createError() {
                return probe.error;
              },
            },
          },
          bean: {
            executor: {
              async newCtx(fn: () => Promise<unknown>) {
                return await fn();
              },
            },
          },
        };
        countReads(own, '$scope', counts);
        assert.equal(
          await runWithRequestBoundary(boundary, () =>
            ServiceExecutor.prototype.performActionInner.call(own, 'get', '/local'),
          ),
          result,
        );
        ctx.status = 500;
        ctx.body = {};
        await rejectsIdentity(
          runWithRequestBoundary(boundary, () =>
            ServiceExecutor.prototype.performActionInner.call(own, 'get', '/local'),
          ),
          probe.error,
        );
        assert.equal(calls, 2);
        assert.equal(counts.reads, 0);
        noReads(probe);
        projection(t, 'action-seam', { calls, diagnosticReads: counts.reads, ...probe.counts });
      },
    );

    it(
      '8 actual telemetry facade service and pure helpers prevent protected evaluation',
      { timeout: 15_000 },
      async t => {
        const counts = { reads: 0 };
        const receiver: any = {};
        for (const key of ['scope', 'ctx', 'activeContext', '_enabled'])
          countReads(receiver, key, counts);
        const probe = getterProbe();
        const { span, counts: spans } = spanFixture();
        const facade = BeanTelemetry.prototype;
        const service = ServiceTelemetry.prototype;
        let calls = 0;
        runWithRequestBoundary(createRequestBoundary(), () => {
          assert.equal(
            Object.getOwnPropertyDescriptor(facade, 'enabled')!.get!.call(receiver),
            false,
          );
          Object.getOwnPropertyDescriptor(service, 'activeContext')!.get!.call(receiver);
          Object.getOwnPropertyDescriptor(service, 'enabled')!.get!.call(receiver);
          assert.equal(
            facade.startSpan.call(receiver, 'local', probe.payload).isRecording(),
            false,
          );
          assert.equal(
            facade.withSpan.call(receiver, span, () => {
              calls++;
              return 7;
            }),
            7,
          );
          facade.recordException.call(receiver, span, probe.error);
          service.startSpan.call(receiver, 'local', probe.payload);
          service.injectCarrier.call(receiver);
          service.createContext.call(receiver, span);
          assert.equal(
            service.withSpan.call(receiver, span, () => {
              calls++;
              return 9;
            }),
            9,
          );
          service.recordException.call(receiver, span, probe.error);
          service.recordException.call(receiver, span, probe.payload);
          service.getLogContext.call(receiver);
          service.createServerSpan.call(receiver, probe.payload as any, ROOT_CONTEXT);
          service.enrichHttpSpan.call(receiver, probe.payload as any, 'local', 'local', 'local');
          recordSpanException(span, probe.error);
          recordSpanException(span, probe.payload);
        });
        assert.equal(calls, 2);
        assert.equal(counts.reads, 0);
        noReads(probe);
        assert.deepEqual(spans, { exception: 0, status: 0, attribute: 0, end: 0, name: 0 });
        recordSpanException(span, new Error());
        recordSpanException(span, 3);
        endHttpSpan(span, 503);
        assert.deepEqual(spans, { exception: 1, status: 3, attribute: 1, end: 1, name: 0 });
        projection(t, 'telemetry', {
          calls,
          diagnosticReads: counts.reads,
          ...probe.counts,
          ordinaryEnds: spans.end,
        });
      },
    );

    it(
      '9 actual healthy disposer barrier owns outcome until successful whole settlement',
      { timeout: 15_000 },
      async t => {
        const held = heldBarrier();
        const entered = barrier();
        const outcomes: VonaScopeOutcome[] = [];
        let disposed = 0;
        let settled = false;
        const task = app.bean.executor.mockCtx(
          async () => {
            witness(app.ctx, async () => {
              disposed++;
              entered.release();
              await held.promise;
            });
            assert.equal(await app.ctxStorage.run(app.ctx, async () => 29), 29);
            return 31;
          },
          contextOptions,
          {
            onScopeOutcome(outcome) {
              outcomes.push(outcome);
            },
          },
        );
        const joined = task.then(value => {
          settled = true;
          return value;
        });
        try {
          await observe(entered.promise);
          assert.equal(disposed, 1);
          assert.equal(settled, false);
          assert.deepEqual(outcomes, []);
          held.release();
          assert.equal(await joined, 31);
          assert.deepEqual(outcomes, ['disposed']);
        } finally {
          held.release();
          await Promise.allSettled([joined]);
        }
        assert.equal(held.expired, false);
        projection(t, 'healthy-disposal', { disposed, settled, outcomes: outcomes.length });
      },
    );

    it(
      '10 controlled actual ALS creation disposal precedence counters and observed reentry',
      { timeout: 15_000 },
      async t => {
        const missing = controlledScope({ failCreation: true });
        const absent: VonaScopeOutcome[] = [];
        let calls = 0;
        await rejectsIdentity(
          missing.executor.newCtx(
            async () => {
              calls++;
            },
            contextOptions,
            {
              onScopeOutcome(outcome) {
                absent.push(outcome);
              },
            },
          ),
          missing.creationError,
        );
        assert.equal(calls, 0);
        assert.deepEqual(absent, ['not_created']);
        assert.equal(missing.counts.increment, 0);
        const local = controlledScope({ failDispose: true });
        local.initialize();
        const outcomes: VonaScopeOutcome[] = [];
        const businessError = new Error();
        await rejectsIdentity(
          local.storage.runObserved(
            local.context,
            async () => {
              throw businessError;
            },
            outcome => {
              outcomes.push(outcome);
            },
          ),
          local.disposalError,
        );
        assert.deepEqual(outcomes, ['dispose_failed']);
        assert.equal(local.counts.increment, 1);
        assert.equal(local.counts.decrement, 0);
        assert.equal(local.counts.dispose, 1);
        assert.equal(local.counts.remaining, 0);
        const healthy = controlledScope();
        healthy.initialize();
        const observed: VonaScopeOutcome[] = [];
        let nested = 0;
        await healthy.storage.runObserved(
          healthy.context,
          async () => {
            await assert.rejects(
              healthy.storage.runObserved(
                healthy.context,
                () => {
                  nested++;
                },
                outcome => {
                  observed.push(outcome);
                },
              ),
            );
            assert.equal(await healthy.storage.run(healthy.context, () => 37), 37);
          },
          outcome => {
            observed.push(outcome);
          },
        );
        assert.equal(nested, 0);
        assert.deepEqual(observed, ['disposed']);
        assert.equal(healthy.counts.increment, 1);
        assert.equal(healthy.counts.decrement, 1);
        assert.equal(healthy.counts.dispose, 1);
        const failures: string[] = [];
        const boundary = createRequestBoundary({
          onFailure(failure) {
            failures.push(failure);
          },
        });
        const observer = controlledScope();
        observer.initialize();
        assert.equal(
          await runWithRequestBoundary(boundary, () =>
            observer.storage.runObserved(
              observer.context,
              () => 41,
              () => {
                throw new Error();
              },
            ),
          ),
          41,
        );
        assert.deepEqual(failures, ['observer_failed']);
        const asyncObserver = controlledScope();
        asyncObserver.initialize();
        let asyncCapture!: RequestBoundaryCapture;
        const asyncBoundary = createRequestBoundary();
        assert.equal(
          await runWithRequestBoundary(asyncBoundary, () => {
            asyncCapture = captureRequestBoundary()!;
            return asyncObserver.storage.runObserved(asyncObserver.context, () => 43, (() =>
              Promise.reject(new Error())) as () => void);
          }),
          43,
        );
        await turns();
        assert.equal(
          asyncCapture.snapshot().portFault,
          true,
          'async_observer_is_unsupported_not_a_lifetime_guarantee',
        );
        const rejected = controlledScope();
        rejected.initialize();
        await rejectsIdentity(
          runWithRequestBoundary(createRequestBoundary(), () =>
            rejected.storage.runObserved(
              rejected.context,
              () => {
                throw businessError;
              },
              () => {
                throw new Error();
              },
            ),
          ),
          businessError,
        );
        projection(t, 'controlled-als', {
          notCreated: absent.length,
          disposeFailed: outcomes.length,
          decrement: local.counts.decrement,
          remaining: local.counts.remaining,
          nested,
        });
      },
    );

    it(
      'managed transaction ALS shares delegated state and isolates independent contexts',
      { timeout: 15_000 },
      async () => {
        // Exercise managed state identity only: no queries or transaction begins.
        await app.bean.executor.mockCtx(async () => {
          const outerContext = app.ctx;
          const executor = app.bean.executor;
          const transactions = app.bean._getBean(ServiceTransactionAsyncLocalStorage);
          const outerState = transactions.transactionState;
          assert.ok(outerState);
          const states = new Set([outerState]);
          let initializations = 0;
          let callbacks = 0;
          const branches = [
            {
              shared: true,
              enter(fn: () => Promise<void>, lifecycle: INewCtxLifecycle) {
                // No explicit instanceName: delegate even from the null-instance outer scope.
                return executor.newCtx(fn, { innerAccess: true }, lifecycle);
              },
            },
            {
              shared: false,
              enter(fn: () => Promise<void>, lifecycle: INewCtxLifecycle) {
                return executor.newCtxIsolate(fn, { innerAccess: true }, lifecycle);
              },
            },
            {
              shared: false,
              enter(fn: () => Promise<void>, lifecycle: INewCtxLifecycle) {
                return executor.mockCtx(fn, contextOptions, lifecycle);
              },
            },
          ];
          for (const branch of branches) {
            for (const shouldThrow of [false, true]) {
              let initializedContext: VonaContext | undefined;
              const failure = new Error('managed_transaction_scope_failure');
              const task = branch.enter(
                async () => {
                  callbacks++;
                  const childContext = app.ctx;
                  assert.equal(childContext, initializedContext);
                  assert.notEqual(childContext, outerContext);
                  assert.equal(
                    app.bean._getBean(ServiceTransactionAsyncLocalStorage),
                    transactions,
                  );
                  const childState = transactions.transactionState;
                  assert.ok(childState);
                  if (branch.shared) {
                    assert.equal(childState, outerState);
                    assert.equal(childContext.ctxCaller, outerContext);
                  } else {
                    assert.notEqual(childState, outerState);
                    assert.equal(states.has(childState), false);
                    states.add(childState);
                    assert.equal(childContext.ctxCaller, undefined);
                  }
                  await turns();
                  assert.equal(app.ctx, childContext);
                  assert.equal(transactions.transactionState, childState);
                  if (shouldThrow) throw failure;
                },
                {
                  initializeContext(ctx) {
                    initializations++;
                    initializedContext = ctx;
                    assert.equal(app.ctx, ctx);
                    assert.notEqual(ctx, outerContext);
                    // Context ALS has entered; transaction ALS has not entered the child run yet.
                    assert.equal(transactions.transactionState, outerState);
                  },
                },
              );
              if (shouldThrow) {
                await rejectsIdentity(task, failure);
              } else {
                await task;
              }
              assert.equal(app.ctx, outerContext);
              assert.equal(transactions.transactionState, outerState);
              await turns();
              assert.equal(app.ctx, outerContext);
              assert.equal(transactions.transactionState, outerState);
            }
          }
          assert.equal(initializations, 6);
          assert.equal(callbacks, 6);
          assert.equal(states.size, 5);
        }, contextOptions);
      },
    );

    it(
      '11 pure late terminal helper after real disposal ends once without scoped lookup',
      { timeout: 15_000 },
      async t => {
        for (const terminal of ['finish', 'close'] as const) {
          const response = new LocalResponse();
          response.writableEnded = terminal === 'finish';
          const { span, counts } = spanFixture();
          let callbacks!: ReturnType<typeof createHttpSpanEnd>;
          let disposed = 0;
          await app.bean.executor.mockCtx(async () => {
            witness(app.ctx, async () => {
              disposed++;
            });
            callbacks = createHttpSpanEnd(span, response);
            response.once('finish', callbacks.finish);
            response.once('close', callbacks.close);
          }, contextOptions);
          assert.equal(disposed, 1);
          assert.equal(Object.isFrozen(callbacks), true);
          response.emit(terminal);
          callbacks.finish();
          callbacks.close();
          assert.equal(counts.end, 1);
          assert.equal(response.listenerCount('finish'), 0);
          assert.equal(response.listenerCount('close'), 0);
        }
        const response = new LocalResponse();
        let removals = 0;
        Object.defineProperty(response, 'removeListener', {
          value(event: string, listener: () => void) {
            removals++;
            LocalResponse.prototype.removeListener.call(response, event, listener);
            if (event === 'close') throw new Error();
          },
        });
        const broken = spanFixture(true);
        let capture!: RequestBoundaryCapture;
        let callbacks!: ReturnType<typeof createHttpSpanEnd>;
        let failureCalls = 0;
        const boundary = createRequestBoundary({
          onFailure() {
            failureCalls++;
            throw new Error();
          },
        });
        await runWithRequestBoundary(boundary, () =>
          app.bean.executor.mockCtx(async () => {
            capture = captureRequestBoundary()!;
            callbacks = createHttpSpanEnd(broken.span, response, capture);
            response.once('finish', callbacks.finish);
            response.once('close', callbacks.close);
          }, contextOptions),
        );
        assert.doesNotThrow(() => response.emit('finish'));
        assert.doesNotThrow(() => callbacks.close());
        assert.equal(broken.counts.end, 0, 'captured_suppression_survives_disposal');
        assert.equal(removals, 2);
        assert.equal(failureCalls, 1);
        assert.deepEqual(capture.snapshot(), { portFault: true });
        assert.equal(response.listenerCount('close'), 0);
        projection(t, 'late-terminal', {
          protectedEnds: broken.counts.end,
          removals,
          failureCalls,
          portFault: capture.snapshot().portFault,
        });
      },
    );

    it(
      '12 unmarked local diagnostic defaults remain ordinary and helper import is inert',
      { timeout: 15_000 },
      async t => {
        const local = memoryLogger();
        const span = spanFixture();
        let activeReads = 0;
        const receiver = {
          get activeContext() {
            activeReads++;
            return ROOT_CONTEXT;
          },
        };
        try {
          local.logger.write({ level: 'error', message: 'local' });
          local.logger.child({ name: 'local' }).warn('local');
          local.logger.startTimer().done({ level: 'http', message: 'local' });
          await turns();
          assert.deepEqual(local.counts(), [1, 1, 1, 3]);
          ServiceTelemetry.prototype.injectCarrier.call(receiver);
          ServiceTelemetry.prototype.startSpan.call(receiver, 'local');
          ServiceTelemetry.prototype.createContext.call(receiver, span.span);
          assert.equal(activeReads, 3);
          const error = new Error();
          assert.throws(
            () =>
              ServiceTelemetry.prototype.withSpan.call(receiver, span.span, () => {
                throw error;
              }),
            value => value === error,
          );
          const metadataUrl = new URL('../src/.metadata/index.ts', import.meta.url);
          const before = await readFile(metadataUrl, 'utf8');
          const server = app.server;
          await import('../../../../../../packages-vona/vona-core/src/lib/core/requestBoundary.ts');
          await import('../../../../a-vona/modules/a-telemetry/src/lib/spanDiagnostics.ts');
          assert.equal(await readFile(metadataUrl, 'utf8'), before);
          assert.equal(app.server, server);
          assert.equal(getRequestBoundary(), undefined);
          projection(t, 'ordinary', {
            activeReads,
            sinks: local.counts()[3],
            listenerUnchanged: app.server === server,
          });
        } finally {
          await local.close();
        }
      },
    );
  },
);
