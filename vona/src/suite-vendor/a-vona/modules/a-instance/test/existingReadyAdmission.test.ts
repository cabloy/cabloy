import type { ExistingReadyCapability, IInstanceRecord } from 'vona';

import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { describe, it } from 'node:test';
import { setImmediate as nextTurn } from 'node:timers/promises';
import {
  beginCompletedInstance,
  captureCompletedInstance,
  captureRequestBoundary,
  createCompletedReadiness,
  createRequestBoundary,
  finishCompletedInstance,
  getRequestBoundary,
  invalidateCompletedInstance,
  isExistingReadyContext,
  pinExistingReadyContext,
  resolveExistingReadyCapability,
  runWithRequestBoundary,
} from 'vona';

import type { ExistingReadyResult } from '../src/lib/existingReadyAdmission.ts';

import { BeanInstance } from '../src/bean/bean.instance.ts';
import { createExistingReadyAdmissionForTest } from '../src/lib/existingReadyAdmission.ts';
import { ServiceInstance } from '../src/service/instance.ts';

// Fixture-only internal access; the canonical URL keeps the same owner WeakMaps as 'vona'.
// Do not publish provisioning or capability issuance through the framework barrel for tests.
const completedReadinessUrl = new URL(
  '../../../../../../packages-vona/vona-core/src/lib/core/completedReadiness.ts',
  import.meta.url,
);
const {
  beginCompletedApplication,
  closeCompletedReadiness,
  finishCompletedApplication,
  getCompletedPublication,
  getExistingReadyContextConfig,
  issueExistingReadyCapability,
  matchesCompletedRow,
  provisionCompletedInstanceForTest,
} = await import(completedReadinessUrl.href);
const admissionInternals = {
  getCompletedPublication,
  issueExistingReadyCapability,
  matchesCompletedRow,
};

const name = '';
type InstanceName = keyof IInstanceRecord;
type Row = {
  id: number;
  name: string;
  disabled: boolean;
  isolate: boolean;
  config: string | null;
};

function row(overrides: Partial<Row> = {}): Row {
  return { id: 41, name, disabled: false, isolate: false, config: null, ...overrides };
}

function barrier() {
  let release!: () => void;
  const promise = new Promise<void>(resolve => {
    release = resolve;
  });
  return { promise, release };
}

// Observation expiry never settles the original work. Every held task is released and joined.
function observe<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('admission_observation_expired')), 1_000);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function withinBoundary<T>(fn: () => T): T {
  return runWithRequestBoundary(createRequestBoundary(), fn);
}

function capability(result: ExistingReadyResult): ExistingReadyCapability {
  assert.equal(result.outcome, 'ready');
  if (result.outcome !== 'ready') {
    throw new Error('ready_control_required');
  }
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.capability), true);
  return result.capability;
}

function controlled() {
  const appIdentity = {};
  const owner = createCompletedReadiness(appIdentity);
  const registry = Object.freeze({});
  const route = Object.freeze({});
  const handle = Object.freeze({});
  const calls: string[] = [];
  let time = 100;
  let read: (selected: string) => unknown | Promise<unknown> = () => ({
    outcome: 'found',
    row: row(),
  });
  provisionCompletedInstanceForTest(owner, name, { registry, route, handle, isolate: false });
  const applicationAttempt = beginCompletedApplication(owner);
  finishCompletedApplication(owner, applicationAttempt, true);
  function publish(value: Row = row(), config: object = { proof: { generation: 1 } }) {
    const attempt = beginCompletedInstance(owner, name);
    const captured = captureCompletedInstance(owner, name, attempt, value, config);
    assert.ok(captured);
    finishCompletedInstance(owner, name, attempt, captured);
    const publication = getCompletedPublication(owner, name, registry, route);
    assert.ok(publication);
    return publication;
  }
  const dependencies = {
    ...admissionInternals,
    owner,
    registry,
    route,
    read(selected: string) {
      calls.push(selected);
      return read(selected);
    },
    now: () => time,
  };
  const admission = createExistingReadyAdmissionForTest(dependencies);
  publish();
  return {
    appIdentity,
    owner,
    registry,
    route,
    handle,
    calls,
    admission,
    dependencies,
    publish,
    setTime(value: number) {
      time = value;
    },
    setRead(fn: typeof read) {
      read = fn;
    },
  };
}

// These are local objects, not another Vona application or container-managed singletons.
// The real lifecycle methods and async.queue run against inert, test-owned collaborators.
function localLifecycle() {
  const identity = {};
  const owner = createCompletedReadiness(identity);
  const registry = {};
  const route = {};
  const handle = {};
  const rows = new Map<string, Row>([
    [
      name,
      row({
        config: JSON.stringify({
          proof: { db: 1, shared: 'db', nested: { db: 1 } },
        }),
      }),
    ],
  ]);
  const counts = { reads: 0, startups: 0, contexts: 0, broadcasts: 0 };
  let onRead: () => Promise<void> = async () => {};
  let onStartup: () => Promise<void> = async () => {};
  let onContext: () => Promise<void> = async () => {};
  const localApp = {
    meta: {
      completedReadiness: owner,
      appReady: true,
      appReadyInstances: {} as Record<string, boolean>,
      scopeContainer: {
        startup: {
          service: {
            startup: {
              async runStartupInstance() {
                counts.startups++;
                await onStartup();
              },
            },
          },
        },
      },
    },
    config: {
      instance: {
        instances: {
          [name]: { config: { proof: { base: 1, shared: 'base', nested: { base: 1 } } } },
        },
      },
      proof: { global: 1, shared: 'global', nested: { global: 1 } },
    },
    currentContext: {} as any,
    bean: {} as any,
    throw(status: number): never {
      throw new Error(`local_status_${status}`);
    },
  };
  const service = new ServiceInstance();
  const bean = new BeanInstance();
  const scope = {
    model: {
      instance: {
        async get(where: { name: string }) {
          counts.reads++;
          await onRead();
          return rows.get(where.name);
        },
      },
    },
    service: { instance: service },
    broadcast: {
      reload: {
        emit() {
          counts.broadcasts++;
        },
      },
    },
  };
  function attach<T extends ServiceInstance | BeanInstance>(value: T): T {
    Object.defineProperties(value, {
      app: { value: localApp },
      scope: { value: scope },
    });
    return value;
  }
  attach(service);
  attach(bean);
  localApp.bean = {
    instance: bean,
    executor: {
      async newCtx(fn: () => Promise<unknown>) {
        counts.contexts++;
        await onContext();
        return fn();
      },
    },
  };
  localApp.currentContext = { app: localApp, instanceName: name };
  const applicationAttempt = beginCompletedApplication(owner);
  finishCompletedApplication(owner, applicationAttempt, true);
  function provision(selected = name) {
    provisionCompletedInstanceForTest(owner, selected, { registry, route, handle, isolate: false });
  }
  function publication(selected = name) {
    return getCompletedPublication(owner, selected, registry, route);
  }
  const admission = createExistingReadyAdmissionForTest({
    ...admissionInternals,
    owner,
    registry,
    route,
    now: () => 100,
    read: selected => ({ outcome: 'found', row: rows.get(selected) }),
  });
  return {
    identity,
    owner,
    registry,
    route,
    handle,
    localApp,
    rows,
    counts,
    service,
    bean,
    admission,
    provision,
    publication,
    anotherService: () => attach(new ServiceInstance()),
    setRead(fn: typeof onRead) {
      onRead = fn;
    },
    setStartup(fn: typeof onStartup) {
      onStartup = fn;
    },
    setContext(fn: typeof onContext) {
      onContext = fn;
    },
  };
}

// Controlled-provider qualification only: no installed registry driver or consumer is asserted.
// The managed runner, not this suite, owns application startup and shutdown.
describe('existing-ready admission qualification', { concurrency: false, timeout: 120_000 }, () => {
  it(
    'keeps each queued preparation and startup in its caller async context',
    { timeout: 15_000 },
    async () => {
      const f = localLifecycle();
      f.provision();
      const contexts = new AsyncLocalStorage<object>();
      const databases = new AsyncLocalStorage<object>();
      const transactions = new AsyncLocalStorage<object>();
      Object.defineProperty(f.localApp, 'currentContext', { get: () => contexts.getStore() });
      const firstScope = { context: {}, database: {}, transaction: {} };
      const secondScope = { context: {}, database: {}, transaction: {} };
      const reads: ReturnType<typeof current>[] = [];
      const startups: ReturnType<typeof current>[] = [];
      function current() {
        return {
          context: f.localApp.currentContext,
          database: databases.getStore(),
          transaction: transactions.getStore(),
        };
      }
      f.setRead(async () => {
        const scope = current();
        reads.push(scope);
        const source = scope.database === firstScope.database ? 'first' : 'second';
        f.rows.set(name, row({ config: JSON.stringify({ proof: { source } }) }));
      });
      const entered = barrier();
      const held = barrier();
      f.setStartup(async () => {
        startups.push(current());
        if (startups.length === 1) {
          entered.release();
          await held.promise;
        }
      });
      function start(scope: typeof firstScope) {
        return contexts.run(scope.context, () =>
          databases.run(scope.database, () =>
            transactions.run(scope.transaction, () =>
              f.anotherService().instanceStartup(name, { force: true }),
            ),
          ),
        );
      }
      const first = start(firstScope);
      let second: Promise<unknown> | undefined;
      try {
        await observe(entered.promise);
        second = start(secondScope);
        await nextTurn();
        assert.equal(reads.length, 1, 'the second preparation must remain queued');
      } finally {
        held.release();
        await Promise.all([first, ...(second ? [second] : [])]);
      }
      for (const observed of [reads, startups]) {
        assert.equal(observed.length, 2);
        for (const [index, expected] of [firstScope, secondScope].entries()) {
          assert.equal(observed[index].context, expected.context);
          assert.equal(observed[index].database, expected.database);
          assert.equal(observed[index].transaction, expected.transaction);
        }
      }
      assert.equal((f.service.getConfig(name) as any).proof.source, 'second');
      assert.ok(f.publication());
      assert.equal(contexts.getStore(), undefined);
      assert.equal(databases.getStore(), undefined);
      assert.equal(transactions.getStore(), undefined);
    },
  );

  it(
    '1 requires a healthy request boundary and freshly matches every registry identity field',
    { timeout: 15_000 },
    async () => {
      const f = controlled();
      assert.equal(getRequestBoundary(), undefined);
      assert.deepEqual(await f.admission.admit(name), { outcome: 'boundary_required' });
      assert.equal(f.calls.length, 0);
      withinBoundary(() => {
        assert.throws(
          () => createExistingReadyAdmissionForTest(f.dependencies),
          /lifecycle boundary/,
        );
        assert.throws(
          () =>
            provisionCompletedInstanceForTest(f.owner, name, {
              registry: f.registry,
              route: f.route,
              handle: f.handle,
              isolate: false,
            }),
          /lifecycle boundary/,
        );
      });
      await withinBoundary(async () => {
        captureRequestBoundary()!.reportFailure('diagnostic_failed');
        assert.deepEqual(await f.admission.admit(name), { outcome: 'boundary_required' });
      });
      assert.equal(f.calls.length, 0);
      for (const invalid of [null, 3, {}, '\0', '\uD800', 'x'.repeat(257)]) {
        assert.deepEqual(await withinBoundary(() => f.admission.admit(invalid as string)), {
          outcome: 'invalid_input',
        });
      }
      assert.equal(f.calls.length, 0);
      for (const deadline of [Number.NaN, Infinity, -Infinity]) {
        assert.deepEqual(await withinBoundary(() => f.admission.admit(name, deadline)), {
          outcome: 'invalid_input',
        });
      }
      assert.deepEqual(await withinBoundary(() => f.admission.admit(name, 100)), {
        outcome: 'expired',
      });
      assert.equal(f.calls.length, 0);

      const first = capability(await withinBoundary(() => f.admission.admit(name)));
      assert.equal(resolveExistingReadyCapability(f.owner, first, f.appIdentity)?.handle, f.handle);
      assert.equal(resolveExistingReadyCapability(f.owner, first, {}), undefined);
      assert.deepEqual(f.calls, [name]);
      const unavailable: unknown[] = [
        undefined,
        { outcome: 'absent' },
        { outcome: 'duplicate', rows: [row(), row()] },
        { outcome: 'found', row: row({ disabled: true }) },
        { outcome: 'found', row: row({ id: 42 }) },
        { outcome: 'found', row: row({ name: 'other' }) },
        { outcome: 'found', row: row({ config: '{}' }) },
        { outcome: 'found', row: row({ isolate: true }) },
      ];
      for (const result of unavailable) {
        const before = f.calls.length;
        f.setRead(() => result);
        assert.deepEqual(await withinBoundary(() => f.admission.admit(name)), {
          outcome: 'unavailable',
        });
        assert.deepEqual(await withinBoundary(() => f.admission.recheck(first)), {
          outcome: 'unavailable',
        });
        assert.equal(
          f.calls.length,
          before + 2,
          'admission and recheck must each read, not reuse a cached success',
        );
      }
      f.setRead(() => ({ outcome: 'found', row: row() }));
      const again = await withinBoundary(() => f.admission.recheck(first));
      assert.equal(capability(again), first);
      const before = f.calls.length;
      for (const identities of [{ registry: {} }, { route: {} }]) {
        const other = createExistingReadyAdmissionForTest({ ...f.dependencies, ...identities });
        assert.deepEqual(await withinBoundary(() => other.admit(name)), { outcome: 'unavailable' });
      }
      assert.deepEqual(await withinBoundary(() => f.admission.admit('unknown')), {
        outcome: 'unavailable',
      });
      assert.equal(f.calls.length, before);
      f.setTime(1_100);
      assert.equal(resolveExistingReadyCapability(f.owner, first), undefined);
      assert.deepEqual(await withinBoundary(() => f.admission.recheck(first)), {
        outcome: 'unavailable',
      });
      assert.equal(f.calls.length, before);
    },
  );

  it(
    '2 keeps the zero-queue reservation until held work joins after expiry, generation change, close or port fault',
    { timeout: 15_000 },
    async () => {
      for (const change of ['expiry', 'generation', 'close', 'portFault'] as const) {
        const f = controlled();
        const entered = barrier();
        const held = barrier();
        let settled = false;
        const boundary = createRequestBoundary();
        let fault!: () => void;
        f.setRead(async () => {
          fault = () => captureRequestBoundary()!.reportFailure('late_callback_failed');
          entered.release();
          await held.promise;
          return { outcome: 'found', row: row() };
        });
        const task = runWithRequestBoundary(boundary, () => f.admission.admit(name));
        const joined = task.then(value => {
          settled = true;
          return value;
        });
        try {
          await observe(entered.promise);
          if (change === 'expiry') {
            f.setTime(1_100);
          }
          if (change === 'generation') {
            f.publish();
          }
          if (change === 'close') {
            closeCompletedReadiness(f.owner);
          }
          if (change === 'portFault') {
            runWithRequestBoundary(boundary, fault);
          }
          await nextTurn();
          assert.equal(
            settled,
            false,
            'expiry and invalidation do not cancel the provider promise',
          );
          for (let i = 0; i < 3; i++) {
            assert.deepEqual(await withinBoundary(() => f.admission.admit(name)), {
              outcome: 'busy',
            });
          }
          assert.equal(f.calls.length, 1, 'busy requests are rejected, not queued');
        } finally {
          held.release();
          await joined;
        }
        assert.deepEqual(await task, { outcome: change === 'expiry' ? 'expired' : 'unavailable' });
        await nextTurn();
        assert.equal(f.calls.length, 1, 'no rejected request runs after release');
        f.setRead(() => ({ outcome: 'found', row: row() }));
        const recovered = await withinBoundary(() => f.admission.admit(name));
        if (change === 'close') {
          assert.deepEqual(recovered, { outcome: 'unavailable' });
          assert.equal(f.calls.length, 1);
        } else {
          capability(recovered);
          assert.equal(f.calls.length, 2, 'the joined operation releases its reservation');
        }
      }
    },
  );

  it(
    '3 rejects a simulated final-checkpoint identity gap and never inspects provider errors or accessor payloads',
    { timeout: 15_000 },
    async () => {
      const f = controlled();
      const admitted = capability(await withinBoundary(() => f.admission.admit(name)));
      let business = 0;
      // A controlled consumer seam, not proof that an installed production consumer calls it.
      async function finalCheckpoint() {
        await Promise.resolve(); // Simulated asynchronous identity work ends before the fresh checkpoint.
        const fresh = await f.admission.recheck(admitted);
        if (fresh.outcome === 'ready') {
          business++;
        }
        return fresh;
      }
      f.setRead(() => ({ outcome: 'found', row: row({ id: 42 }) }));
      assert.deepEqual(await withinBoundary(finalCheckpoint), { outcome: 'unavailable' });
      assert.equal(business, 0);
      assert.equal(f.calls.length, 2);
      assert.ok(
        resolveExistingReadyCapability(f.owner, admitted),
        'a raw-row mismatch is not itself lifecycle revocation',
      );
      f.setRead(() => ({ outcome: 'found', row: row() }));
      assert.equal(capability(await withinBoundary(finalCheckpoint)), admitted);
      assert.equal(business, 1, 'the positive checkpoint control reaches business work');

      const counts = { property: 0, descriptor: 0, keys: 0, prototype: 0, getter: 0, string: 0 };
      const poison = new Proxy(
        {},
        {
          get() {
            counts.property++;
            throw new Error('poison_get');
          },
          getOwnPropertyDescriptor() {
            counts.descriptor++;
            throw new Error('poison_descriptor');
          },
          ownKeys() {
            counts.keys++;
            throw new Error('poison_keys');
          },
          getPrototypeOf() {
            counts.prototype++;
            throw new Error('poison_prototype');
          },
        },
      );
      for (const reject of [false, true]) {
        f.setRead(() => {
          if (reject) {
            return Promise.reject(poison);
          }
          throw poison;
        });
        assert.deepEqual(await withinBoundary(() => f.admission.admit(name)), {
          outcome: 'unavailable',
        });
      }
      const accessorResult = {};
      for (const key of ['outcome', 'row']) {
        Object.defineProperty(accessorResult, key, {
          get() {
            counts.getter++;
            return poison;
          },
        });
      }
      const accessorRow = row();
      Object.defineProperty(accessorRow, 'id', {
        get() {
          counts.getter++;
          return 41;
        },
      });
      const stringPoison = {
        toString() {
          counts.string++;
          return name;
        },
      };
      for (const result of [
        accessorResult,
        { outcome: 'found', row: accessorRow },
        { outcome: 'found', row: row({ name: stringPoison as unknown as string }) },
      ]) {
        f.setRead(() => result);
        assert.deepEqual(await withinBoundary(() => f.admission.admit(name)), {
          outcome: 'unavailable',
        });
      }
      assert.deepEqual(counts, {
        property: 0,
        descriptor: 0,
        keys: 0,
        prototype: 0,
        getter: 0,
        string: 0,
      });
      f.setRead(() => ({ outcome: 'found', row: row() }));
      capability(await withinBoundary(() => f.admission.admit(name)));

      const attempt = beginCompletedInstance(f.owner, name);
      let configGets = 0;
      const accessorConfig = Object.defineProperty({}, 'secret', {
        enumerable: true,
        get() {
          configGets++;
          return poison;
        },
      });
      const cycle: { self?: object } = {};
      cycle.self = cycle;
      for (const config of [accessorConfig, cycle, { unsupported: new Date(0) }]) {
        assert.equal(captureCompletedInstance(f.owner, name, attempt, row(), config), undefined);
      }
      assert.equal(configGets, 0);
      finishCompletedInstance(f.owner, name, attempt, {});
      assert.equal(getCompletedPublication(f.owner, name, f.registry, f.route), undefined);
      const stale = captureCompletedInstance(f.owner, name, attempt, row(), { proof: true });
      assert.ok(stale);
      invalidateCompletedInstance(f.owner, name);
      finishCompletedInstance(f.owner, name, attempt, stale);
      assert.equal(getCompletedPublication(f.owner, name, f.registry, f.route), undefined);
      const appAttempt = beginCompletedApplication(f.owner);
      assert.deepEqual(await withinBoundary(() => f.admission.admit(name)), {
        outcome: 'unavailable',
      });
      finishCompletedApplication(f.owner, appAttempt, false);
      assert.equal(f.owner.snapshot().application, 'failed');
      assert.deepEqual(await withinBoundary(() => f.admission.admit(name)), {
        outcome: 'unavailable',
      });
    },
  );

  it(
    '4 uses real local lifecycle invalidation and queue-owned row/config captures without patching singletons',
    { timeout: 15_000 },
    async () => {
      const inert = localLifecycle();
      await inert.service.instanceStartup(name, { force: true });
      assert.ok(inert.service.getConfig(name));
      assert.equal(
        inert.publication(),
        undefined,
        'ordinary startup has no authority without explicit inert provisioning',
      );
      assert.deepEqual(await withinBoundary(() => inert.admission.admit(name)), {
        outcome: 'unavailable',
      });

      // A legacy-ready nonforce skip preserves its ordinary cache, but revokes completed
      // admission and cannot advertise a fresh publication without a completed startup.
      const skipped = localLifecycle();
      skipped.provision();
      await skipped.service.instanceStartup(name, { force: true });
      const beforeSkip = capability(await withinBoundary(() => skipped.admission.admit(name)));
      const cachedBeforeSkip = skipped.service.getConfig(name);
      const readsBeforeSkip = skipped.counts.reads;
      const startupsBeforeSkip = skipped.counts.startups;
      skipped.localApp.meta.appReadyInstances[name] = true;
      skipped.rows.set(name, row({ config: JSON.stringify({ proof: { shared: 'not-loaded' } }) }));
      await skipped.service.instanceStartup(name, { force: false });
      assert.equal(skipped.service.getConfig(name), cachedBeforeSkip);
      assert.equal((skipped.service.getConfig(name) as any).proof.shared, 'db');
      assert.equal(
        skipped.counts.reads,
        readsBeforeSkip,
        'a ready nonforce skip does not reread a cached instance',
      );
      assert.equal(skipped.counts.startups, startupsBeforeSkip);
      assert.equal(skipped.publication(), undefined);
      assert.equal(resolveExistingReadyCapability(skipped.owner, beforeSkip), undefined);
      assert.deepEqual(await withinBoundary(() => skipped.admission.admit(name)), {
        outcome: 'unavailable',
      });

      // resetCache revokes immediately, before its held model read, and cannot republish.
      const reset = localLifecycle();
      reset.provision();
      await reset.service.instanceStartup(name, { force: true });
      const beforeReset = capability(await withinBoundary(() => reset.admission.admit(name)));
      const resetEntered = barrier();
      const resetHeld = barrier();
      reset.setRead(async () => {
        resetEntered.release();
        await resetHeld.promise;
      });
      const resetting = reset.service.resetCache(name);
      try {
        await observe(resetEntered.promise);
        assert.equal(reset.publication(), undefined);
        assert.equal(resolveExistingReadyCapability(reset.owner, beforeReset), undefined);
      } finally {
        resetHeld.release();
        await resetting;
      }
      assert.equal(reset.publication(), undefined);
      reset.setRead(async () => {});
      await reset.service.instanceStartup(name, { force: true });
      assert.ok(reset.publication());

      // All cached names are revoked before resetAllCaches enters even its first context.
      const all = localLifecycle();
      const other = 'other' as InstanceName;
      all.rows.set(other, row({ id: 42, name: other }));
      for (const selected of [name, other] as InstanceName[]) {
        all.provision(selected);
        await all.service.instanceStartup(selected, { force: true });
        assert.ok(all.publication(selected));
      }
      const allEntered = barrier();
      const allHeld = barrier();
      all.setContext(async () => {
        allEntered.release();
        await allHeld.promise;
      });
      const resettingAll = all.service.resetAllCaches();
      try {
        await observe(allEntered.promise);
        assert.equal(all.publication(name), undefined);
        assert.equal(all.publication(other), undefined);
      } finally {
        allHeld.release();
        await resettingAll;
      }
      assert.equal(all.counts.contexts, 2);
      assert.equal(all.publication(name), undefined);
      assert.equal(all.publication(other), undefined);

      // Observe each entry before a downstream lifecycle method could revoke on its behalf.
      for (const operation of ['isolate', 'reloadWorker', 'reload'] as const) {
        const f = localLifecycle();
        f.provision();
        await f.service.instanceStartup(name, { force: true });
        const prior = capability(await withinBoundary(() => f.admission.admit(name)));
        const entered = barrier();
        const held = barrier();
        let revokedAtEntry = false;
        if (operation === 'isolate') {
          f.setContext(async () => {
            revokedAtEntry = f.publication() === undefined;
            entered.release();
            await held.promise;
          });
        } else if (operation === 'reloadWorker') {
          Object.defineProperty(f.service, 'instanceStartupIsolate', {
            value: async (...args: Parameters<ServiceInstance['instanceStartupIsolate']>) => {
              revokedAtEntry = f.publication() === undefined;
              entered.release();
              await held.promise;
              return ServiceInstance.prototype.instanceStartupIsolate.apply(f.service, args);
            },
          });
        } else {
          Object.defineProperty(f.bean, 'reloadWorker', {
            value: async (selected: InstanceName) => {
              revokedAtEntry = f.publication() === undefined;
              entered.release();
              await held.promise;
              return BeanInstance.prototype.reloadWorker.call(f.bean, selected);
            },
          });
        }
        const task =
          operation === 'isolate'
            ? f.service.instanceStartupIsolate(name, { force: true })
            : operation === 'reloadWorker'
              ? f.bean.reloadWorker(name)
              : f.bean.reload();
        try {
          await observe(entered.promise);
          assert.equal(revokedAtEntry, true, operation);
          assert.equal(resolveExistingReadyCapability(f.owner, prior), undefined);
        } finally {
          held.release();
          await task;
        }
        assert.ok(f.publication());
        assert.equal(f.counts.broadcasts, operation === 'reload' ? 1 : 0);
      }

      const failed = localLifecycle();
      failed.provision();
      await failed.service.instanceStartup(name, { force: true });
      const failure = new Error('controlled_startup_failure');
      failed.setStartup(async () => {
        throw failure;
      });
      const failing = failed.service.instanceStartup(name, { force: true });
      assert.equal(failed.publication(), undefined, 'startup revokes before queue execution');
      await assert.rejects(failing, error => error === failure);
      assert.equal(failed.publication(), undefined);
      failed.setStartup(async () => {});
      await failed.service.instanceStartup(name, { force: true });
      assert.ok(failed.publication(), 'failed work does not poison the startup queue');

      // Two local service objects share one real queue. The queued closure owns its prepared
      // base, persisted row and detached merge; neither an older attempt nor a later cache wins.
      const queued = localLifecycle();
      queued.provision();
      const secondService = queued.anotherService();
      const firstEntered = barrier();
      const firstHeld = barrier();
      const secondEntered = barrier();
      const secondHeld = barrier();
      const firstRow = { ...queued.rows.get(name)! };
      queued.setStartup(async () => {
        if (queued.counts.startups === 1) {
          firstEntered.release();
          await firstHeld.promise;
        } else {
          secondEntered.release();
          await secondHeld.promise;
        }
      });
      const first = queued.service.instanceStartup(name, { force: true });
      let second: Promise<unknown> | undefined;
      let capturedRow!: Row;
      try {
        await observe(firstEntered.promise);
        assert.equal(
          queued.publication(),
          undefined,
          'startup hooks must complete before publication',
        );
        assert.equal((queued.service.getConfig(name) as any).proof.shared, 'db');
        capturedRow = row({
          config: JSON.stringify({ proof: { db: 2, shared: 'db2', nested: { db: 2 } } }),
        });
        queued.rows.set(name, capturedRow);
        second = secondService.instanceStartup(name, {
          force: true,
          configInstanceBase: {
            config: { proof: { base: 2, shared: 'base2', nested: { base: 2 } } },
          } as any,
        });
        await nextTurn();
        assert.equal(
          queued.counts.reads,
          1,
          'queued preparation must not run ahead of the first startup',
        );
        firstHeld.release();
        await observe(first);
        await observe(secondEntered.promise);
        assert.equal(
          queued.publication(),
          undefined,
          'the superseded first attempt cannot publish',
        );
        assert.equal(queued.counts.reads, 2);
        assert.deepEqual((secondService.getConfig(name) as any).proof, {
          global: 1,
          base: 2,
          db: 2,
          shared: 'db2',
          nested: { global: 1, base: 2, db: 2 },
        });
        capturedRow.config = JSON.stringify({ proof: { shared: 'later-row' } });
        (secondService.getConfig(name) as any).proof.shared = 'later-cache';
        (secondService.getConfig(name) as any).proof.nested.db = 99;
      } finally {
        firstHeld.release();
        secondHeld.release();
        await Promise.all([first, ...(second ? [second] : [])]);
      }
      const publication = queued.publication();
      assert.ok(publication);
      const completedRow = row({
        config: JSON.stringify({ proof: { db: 2, shared: 'db2', nested: { db: 2 } } }),
      });
      assert.equal(matchesCompletedRow(publication, firstRow), false);
      assert.equal(matchesCompletedRow(publication, capturedRow), false);
      assert.equal(matchesCompletedRow(publication, completedRow), true);
      queued.rows.set(name, completedRow);
      const ready = capability(await withinBoundary(() => queued.admission.admit(name)));
      const context: any = {};
      assert.equal(
        pinExistingReadyContext(queued.owner, ready, queued.localApp, context),
        false,
        'owner identity must match the provisioned app',
      );
      assert.equal(pinExistingReadyContext(queued.owner, ready, queued.identity, context), true);
      assert.equal(isExistingReadyContext(context), true);
      assert.equal(getExistingReadyContextConfig(context), context.config);
      assert.deepEqual(
        JSON.parse(JSON.stringify(context.config.proof)),
        {
          global: 1,
          base: 2,
          db: 2,
          shared: 'db2',
          nested: { global: 1, base: 2, db: 2 },
        },
        'the real queued publication retains its pre-mutation merged snapshot',
      );
      assert.notEqual(context.config, secondService.getConfig(name));
      assert.notEqual(context.config.proof, (secondService.getConfig(name) as any).proof);
      assert.equal((secondService.getConfig(name) as any).proof.shared, 'later-cache');
      assert.equal((secondService.getConfig(name) as any).proof.nested.db, 99);
      assert.equal(context.instance.config, completedRow.config);
      assert.equal(Object.isFrozen(context.config.proof.nested), true);
      assert.equal(context.innerAccess, false);
      assert.equal(context.instanceName, name);
      assert.equal(pinExistingReadyContext(queued.owner, ready, queued.identity, context), false);
      assert.throws(() => {
        context.config.proof.shared = 'changed';
      }, TypeError);
    },
  );
});
