import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  beginCompletedInstance,
  captureCompletedInstance,
  createCompletedReadiness,
  createRequestBoundary,
  finishCompletedInstance,
  pinExistingReadyContext,
  runWithRequestBoundary,
} from 'vona';
import { app } from 'vona-mock';
import {
  ServiceDatabaseAsyncLocalStorage,
  ServiceTransactionAsyncLocalStorage,
} from 'vona-module-a-orm';

import { BeanExecutor } from '../src/bean/bean.executor.ts';

// Fixture-only internal access; use the canonical module shared by the public 'vona' imports.
const completedReadinessUrl = new URL(
  '../../../../../../packages-vona/vona-core/src/lib/core/completedReadiness.ts',
  import.meta.url,
);
const {
  beginCompletedApplication,
  finishCompletedApplication,
  getCompletedPublication,
  issueExistingReadyCapability,
  matchesCompletedRow,
  provisionCompletedInstanceForTest,
} = await import(completedReadinessUrl.href);
const existingReadyAdmissionUrl = new URL(
  '../../a-instance/src/lib/existingReadyAdmission.ts',
  import.meta.url,
);
const { createExistingReadyAdmissionForTest } = await import(existingReadyAdmissionUrl.href);
const admissionInternals = {
  getCompletedPublication,
  issueExistingReadyCapability,
  matchesCompletedRow,
};

function fixture() {
  const local = { meta: { completedReadiness: createCompletedReadiness({}) } };
  const owner = createCompletedReadiness(local);
  local.meta.completedReadiness = owner;
  const registry = {},
    route = {},
    handle = {};
  const row = Object.freeze({ id: 1, name: '', disabled: false, isolate: false, config: null });
  let time = 0;
  provisionCompletedInstanceForTest(owner, '', { registry, route, handle, isolate: false });
  const started = beginCompletedApplication(owner);
  const attempt = beginCompletedInstance(owner, '');
  finishCompletedInstance(
    owner,
    '',
    attempt,
    captureCompletedInstance(owner, '', attempt, row, { marker: 'pinned' }),
  );
  finishCompletedApplication(owner, started, true);
  const provider = createExistingReadyAdmissionForTest({
    ...admissionInternals,
    owner,
    registry,
    route,
    read: () => ({ outcome: 'found', row }),
    now: () => time,
  });
  return {
    local,
    owner,
    handle,
    provider,
    expire: () => {
      time = 1_000;
    },
  };
}

function localExecutor(local: object, current: object | undefined, create: () => never) {
  const executor = Object.create(BeanExecutor.prototype) as BeanExecutor;
  Object.defineProperties(executor, {
    app: { value: { ...local, createAnonymousContext: create } },
    ctx: { value: current },
  });
  return executor;
}

describe('ready-existing executor', { concurrency: false, timeout: 120_000 }, () => {
  it(
    'refuses forged, foreign, expired and conflicting options before context construction',
    { timeout: 15_000 },
    async () => {
      const f = fixture();
      let created = 0,
        getters = 0;
      // Use the exact app identity: the public entry must not adopt a foreign capability.
      const executor = Object.create(BeanExecutor.prototype) as BeanExecutor;
      Object.assign(f.local, {
        createAnonymousContext() {
          created++;
          throw new Error('unexpected context');
        },
      });
      Object.defineProperties(executor, { app: { value: f.local }, ctx: { value: undefined } });
      await runWithRequestBoundary(createRequestBoundary(), async () => {
        const result = await f.provider.admit('');
        assert.equal(result.outcome, 'ready');
        if (result.outcome !== 'ready') return;
        await assert.rejects(executor.newCtxReadyExisting({} as never, async () => undefined));
        await assert.rejects(
          executor.newCtxReadyExisting({ ...result.capability } as never, async () => undefined),
        );
        for (const options of [
          { instanceName: '' },
          { dbInfo: {} },
          { innerAccess: true },
          { transaction: true },
          { extraData: {} },
          { authToken: 'synthetic' },
        ]) {
          await assert.rejects(
            executor.newCtxReadyExisting(
              result.capability,
              async () => undefined,
              options as never,
            ),
          );
        }
        const options = Object.defineProperty({}, 'locale', {
          get() {
            getters++;
            return 'en-us';
          },
        });
        await assert.rejects(
          executor.newCtxReadyExisting(result.capability, async () => undefined, options),
        );
        const foreign = localExecutor(
          { meta: { completedReadiness: createCompletedReadiness({}) } },
          undefined,
          () => {
            created++;
            throw new Error('unexpected context');
          },
        );
        await assert.rejects(foreign.newCtxReadyExisting(result.capability, async () => undefined));
        f.expire();
        await assert.rejects(
          executor.newCtxReadyExisting(result.capability, async () => undefined),
        );
      });
      assert.equal(created, 0);
      assert.equal(getters, 0);
    },
  );

  it(
    'pins before initializer and drains commit tails in the bound scope before disposal',
    { timeout: 15_000 },
    async () => {
      // The managed runner owns its listener; executor scopes must leave it unchanged.
      const server = app.server;
      const registry = {},
        route = {},
        handle = {};
      const row = { id: 1, name: '', disabled: false, isolate: false, config: null };
      await app.bean.executor.mockCtx(async () => {
        const database = app.bean._getBean(ServiceDatabaseAsyncLocalStorage);
        const transaction = app.bean._getBean(ServiceTransactionAsyncLocalStorage);
        const outer = transaction.transactionState;
        const executor = Object.create(BeanExecutor.prototype) as BeanExecutor;
        // A local app facade owns this test-only owner; actual context creation/ALS/disposal
        // remain the runner-owned application's facilities. No singleton property is patched.
        const facade = Object.create(app);
        Object.defineProperty(facade, 'meta', { value: { ...app.meta } });
        Object.defineProperties(executor, {
          app: { value: facade },
          ctx: { get: () => app.ctx },
          bean: { get: () => app.bean },
        });
        // Capability app ownership is explicit; fixture publication uses the facade, not app.
        const localOwner = createCompletedReadiness(facade);
        facade.meta.completedReadiness = localOwner;
        provisionCompletedInstanceForTest(localOwner, '', {
          registry,
          route,
          handle,
          isolate: false,
        });
        const appAttempt = beginCompletedApplication(localOwner),
          localAttempt = beginCompletedInstance(localOwner, '');
        finishCompletedInstance(
          localOwner,
          '',
          localAttempt,
          captureCompletedInstance(localOwner, '', localAttempt, row, { marker: 'pinned' }),
        );
        finishCompletedApplication(localOwner, appAttempt, true);
        const localProvider = createExistingReadyAdmissionForTest({
          ...admissionInternals,
          owner: localOwner,
          registry,
          route,
          read: () => ({ outcome: 'found', row }),
          now: () => 0,
        });
        await runWithRequestBoundary(createRequestBoundary(), async () => {
          const result = await localProvider.admit('');
          assert.equal(result.outcome, 'ready');
          if (result.outcome !== 'ready') return;
          const events: string[] = [];
          const returned = await executor.newCtxReadyExisting(
            result.capability,
            async () => {
              events.push('callback');
              const context = app.ctx;
              const state = transaction.transactionState;
              assert.equal((context.config as any).marker, 'pinned');
              assert.equal(database.dbStorage.getStore(), handle);
              assert.notEqual(state, outer);
              assert.throws(() => {
                context.instanceName = 'replacement' as never;
              });
              assert.throws(() => {
                context.innerAccess = true;
              });
              context.commit(async () => {
                events.push('commit');
                assert.equal(app.ctx, context);
                assert.equal(database.dbStorage.getStore(), handle);
                assert.equal(transaction.transactionState, state);
                await Promise.resolve();
                context.commit(() => events.push('nested_commit'));
                events.push('commit_done');
              });
              return 'result';
            },
            undefined,
            {
              initializeContext(ctx) {
                events.push('initializer');
                assert.equal((ctx.config as any).marker, 'pinned');
                assert.equal(ctx.instanceName, '');
                assert.equal(ctx.innerAccess, false);
                assert.equal(transaction.transactionState, outer);
              },
              onScopeOutcome(outcome) {
                events.push(outcome);
              },
            },
          );
          assert.equal(returned, 'result');
          assert.deepEqual(events, [
            'initializer',
            'callback',
            'commit',
            'commit_done',
            'nested_commit',
            'disposed',
          ]);
          assert.equal(transaction.transactionState, outer);

          for (const phase of ['callback', 'commit'] as const) {
            events.length = 0;
            const failure = new Error(`controlled_${phase}_failure`);
            await assert.rejects(
              executor.newCtxReadyExisting(
                result.capability,
                async () => {
                  events.push('callback');
                  app.ctx.commit(() => {
                    events.push('commit');
                    throw failure;
                  });
                  if (phase === 'callback') throw failure;
                },
                undefined,
                { onScopeOutcome: outcome => events.push(outcome) },
              ),
              error => error === failure,
            );
            assert.deepEqual(
              events,
              phase === 'callback' ? ['callback', 'disposed'] : ['callback', 'commit', 'disposed'],
            );
            assert.equal(transaction.transactionState, outer);
          }
        });
      });
      assert.ok(app.server === server, 'executor scopes must preserve the runner-owned listener');
    },
  );

  it(
    'blocks every ordinary nested entry before database or getter work',
    { timeout: 15_000 },
    async () => {
      const f = fixture();
      await runWithRequestBoundary(createRequestBoundary(), async () => {
        const result = await f.provider.admit('');
        assert.equal(result.outcome, 'ready');
        if (result.outcome !== 'ready') return;
        const context = {};
        assert.equal(pinExistingReadyContext(f.owner, result.capability, f.local, context), true);
        let setups = 0;
        const executor = localExecutor(f.local, context, () => {
          setups++;
          throw new Error('unexpected setup');
        });
        Object.defineProperty(executor, 'bean', {
          get() {
            setups++;
            throw new Error('unexpected DB');
          },
        });
        await assert.rejects(executor.newCtx(async () => undefined));
        await assert.rejects(executor.newCtxIsolate(async () => undefined));
        await assert.rejects(executor.mockCtx(async () => undefined));
        await assert.rejects(executor.performAction('get' as never, '/' as never));
        assert.throws(() => executor.runInBackground(async () => undefined));
        assert.equal(setups, 0);
      });

      // Controlled failure port: real owned ALS/disposer logic, inert local app facade.
      // The retained counter is custody proof, not a test-owned live application leak.
      const failed = fixture();
      let current: any;
      let retained = 0,
        callbacks = 0,
        setups = 0;
      const failure = new Error('controlled_dispose_failure');
      const context = {
        bean: {
          async dispose() {
            throw failure;
          },
        },
      };
      Object.assign(failed.local.meta, {
        ctxCounter: {
          increment() {
            retained++;
          },
          decrement() {
            retained--;
          },
        },
      });
      const local: any = failed.local;
      const Storage = app.ctxStorage.constructor as new (
        application: typeof app,
      ) => typeof app.ctxStorage;
      const storage = new Storage(local);
      Object.defineProperty(local, 'currentContext', { get: () => storage.getStore() });
      Object.assign(local, { ctxStorage: storage, createAnonymousContext: () => context });
      const executor = Object.create(BeanExecutor.prototype) as BeanExecutor;
      Object.defineProperties(executor, {
        app: { value: local },
        ctx: { get: () => current },
        bean: {
          get() {
            setups++;
            throw new Error('unexpected setup after initializer failure');
          },
        },
      });
      const events: string[] = [];
      await runWithRequestBoundary(createRequestBoundary(), async () => {
        const admitted = await failed.provider.admit('');
        assert.equal(admitted.outcome, 'ready');
        if (admitted.outcome !== 'ready') return;
        await assert.rejects(
          executor.newCtxReadyExisting(
            admitted.capability,
            async () => {
              callbacks++;
            },
            undefined,
            {
              initializeContext(ctx) {
                current = ctx;
                assert.equal((ctx.config as any).marker, 'pinned');
                assert.equal(ctx.innerAccess, false);
                throw new Error('controlled_initializer_failure');
              },
              onScopeOutcome(outcome) {
                events.push(outcome);
              },
            },
          ),
          error => error === failure,
        );
      });
      assert.deepEqual(events, ['dispose_failed']);
      assert.equal(retained, 1);
      assert.equal(callbacks, 0);
      assert.equal(setups, 0);
    },
  );

  it(
    'retains ordinary mock context behavior and actual healthy disposal',
    { timeout: 15_000 },
    async () => {
      const outcomes: string[] = [];
      let called = false;
      await app.bean.executor.mockCtx(
        async () => {
          called = true;
          assert.ok(app.ctx.instance);
          assert.notEqual(app.ctx.innerAccess, false);
        },
        undefined,
        { onScopeOutcome: outcome => outcomes.push(outcome) },
      );
      assert.equal(called, true);
      assert.deepEqual(outcomes, ['disposed']);
    },
  );
});
