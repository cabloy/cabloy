import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';

import type { ExistingReadyCapability } from './completedReadiness.ts';

import {
  beginCompletedApplication,
  beginCompletedInstance,
  captureCompletedInstance,
  closeCompletedReadiness,
  createCompletedReadiness,
  finishCompletedApplication,
  finishCompletedInstance,
  getCompletedPublication,
  getExistingReadyContextConfig,
  invalidateCompletedInstance,
  isExistingReadyContext,
  issueExistingReadyCapability,
  matchesCompletedRow,
  pinExistingReadyContext,
  provisionCompletedInstanceForTest,
  resolveExistingReadyCapability,
} from './completedReadiness.ts';
import { createRequestBoundary, runWithRequestBoundary } from './requestBoundary.ts';

// These are inert identities, not Vona applications. No singleton, environment,
// persistence, listener, or application event emitter is used by this suite.
function fixture(functions: readonly Function[] = []) {
  const app = Object.freeze({});
  const owner = createCompletedReadiness(app);
  const registry = Object.freeze({});
  const route = Object.freeze({});
  const handle = Object.freeze({});
  const name = 'completed-readiness-test';
  const row = { id: 1, name, disabled: false, isolate: false, config: null as string | null };
  provisionCompletedInstanceForTest(owner, name, {
    registry,
    route,
    handle,
    isolate: false,
    functions,
  });
  return { app, owner, registry, route, handle, name, row };
}

type Fixture = ReturnType<typeof fixture>;

function ready(local: Fixture) {
  const attempt = beginCompletedApplication(local.owner);
  finishCompletedApplication(local.owner, attempt, true);
}

function current(local: Fixture) {
  return getCompletedPublication(local.owner, local.name, local.registry, local.route);
}

function capture(local: Fixture, config: unknown, row: unknown = local.row) {
  const attempt = beginCompletedInstance(local.owner, local.name);
  assert.ok(attempt);
  const captured = captureCompletedInstance(local.owner, local.name, attempt, row, config);
  return { attempt, captured };
}

function publish(local: Fixture, config: unknown) {
  const { attempt, captured } = capture(local, config);
  assert.ok(captured);
  finishCompletedInstance(local.owner, local.name, attempt, captured);
  const publication = current(local);
  assert.equal(publication, captured);
  assert.ok(publication);
  return { attempt, publication };
}

describe(
  'completed readiness inert qualification',
  { concurrency: false, timeout: 120_000 },
  () => {
    test(
      'lifecycle rejects stale attempts, failure, and synchronous close',
      {
        concurrency: false,
        timeout: 15_000,
      },
      async () => {
        const local = fixture();
        const { owner, name } = local;
        const initial = owner.snapshot();
        assert.equal(initial.application, 'starting');
        assert.equal(Object.isFrozen(owner), true);
        assert.equal(Object.isFrozen(initial), true);

        const staleApplication = beginCompletedApplication(owner);
        const application = beginCompletedApplication(owner);
        assert.notEqual(application, staleApplication);
        finishCompletedApplication(owner, staleApplication, true);
        assert.equal(owner.snapshot().application, 'starting');
        finishCompletedApplication(owner, staleApplication, false);
        assert.equal(owner.snapshot().application, 'starting');

        const staleInstance = capture(local, { revision: 1 });
        const instance = capture(local, { revision: 2 });
        assert.ok(staleInstance.captured);
        assert.ok(instance.captured);
        assert.notEqual(staleInstance.attempt, instance.attempt);
        finishCompletedInstance(owner, name, staleInstance.attempt, staleInstance.captured);
        finishCompletedApplication(owner, application, true);
        assert.equal(current(local), undefined);
        finishCompletedInstance(owner, name, instance.attempt, instance.captured);
        assert.equal(current(local), instance.captured);
        assert.equal(owner.snapshot().application, 'ready');
        assert.equal(initial.application, 'starting');

        const capability = issueExistingReadyCapability(owner, instance.captured, 100, () => 0);
        assert.ok(resolveExistingReadyCapability(owner, capability, local.app));
        const failingApplication = beginCompletedApplication(owner);
        assert.equal(current(local), undefined);
        assert.equal(resolveExistingReadyCapability(owner, capability, local.app), undefined);
        finishCompletedInstance(owner, name, instance.attempt, instance.captured);
        const duringStartup = capture(local, { revision: 3 });
        assert.ok(duringStartup.captured);
        finishCompletedInstance(owner, name, duringStartup.attempt, duringStartup.captured);
        assert.equal(current(local), undefined);
        finishCompletedApplication(owner, failingApplication, false);
        assert.equal(owner.snapshot().application, 'failed');
        finishCompletedInstance(owner, name, duringStartup.attempt, duringStartup.captured);
        assert.equal(current(local), undefined);

        ready(local);
        assert.equal(current(local), undefined);
        const { publication } = publish(local, { revision: 4 });
        const closingCapability = issueExistingReadyCapability(owner, publication, 100, () => 0);
        const pending = capture(local, { revision: 5 });
        const pendingApplication = beginCompletedApplication(owner);
        // Pure synchronous witness. The source assertion below separately ties this
        // helper to AppMeta.close, without importing its application dependency graph.
        closeCompletedReadiness(owner);
        assert.equal(owner.snapshot().application, 'closing');
        assert.equal(current(local), undefined);
        assert.equal(
          resolveExistingReadyCapability(owner, closingCapability, local.app),
          undefined,
        );
        assert.equal(
          captureCompletedInstance(owner, name, pending.attempt, local.row, {}),
          undefined,
        );
        finishCompletedInstance(owner, name, pending.attempt, pending.captured);
        finishCompletedApplication(owner, pendingApplication, true);
        finishCompletedApplication(owner, pendingApplication, false);
        const afterClose = beginCompletedApplication(owner);
        finishCompletedApplication(owner, afterClose, true);
        closeCompletedReadiness(owner);
        assert.equal(owner.snapshot().application, 'closing');
        assert.equal(current(local), undefined);

        const metaSource = await readFile(new URL('./meta.ts', import.meta.url), 'utf8');
        assert.match(
          metaSource,
          /async close\(\)\s*\{\s*closeCompletedReadiness\(this\.completedReadiness\);\s*if \(!this\[SymbolClosePromise\]\)\s*\{\s*this\[SymbolClosePromise\] = this\._closeInner\(\);\s*\}\s*return this\[SymbolClosePromise\];\s*\}/,
        );
      },
    );

    test(
      'configuration detaches data and rejects getters, exotic values, cycles, and unsafe functions',
      {
        concurrency: false,
        timeout: 15_000,
      },
      () => {
        let calls = 0;
        const allowed = Object.freeze(() => {
          calls++;
        });
        const lookalike = Object.freeze(() => {
          calls++;
        });
        const mutable = Object.assign(
          () => {
            calls++;
          },
          { mutable: true },
        );
        const withObject = Object.freeze(
          Object.assign(
            () => {
              calls++;
            },
            { state: {} },
          ),
        );
        const withFunction = Object.freeze(
          Object.assign(
            () => {
              calls++;
            },
            { callback: allowed },
          ),
        );
        const ordinary = Object.freeze(function ordinaryFunction() {
          calls++;
        });
        let getterReads = 0;
        const read = () => {
          getterReads++;
          throw new Error('Synthetic getter must not run');
        };
        const withGetter = Object.freeze(
          Object.defineProperty(
            () => {
              calls++;
            },
            'state',
            { get: read },
          ),
        );
        const functions = [allowed, mutable, withObject, withFunction, ordinary, withGetter];
        const local = fixture(functions);
        ready(local);
        // Provisioning copies the allowlist; later mutation must not grant identity.
        functions.push(lookalike);

        const shared = { value: 1 };
        const nullPrototype = Object.assign(Object.create(null), { flag: true });
        const source = {
          nested: { items: [shared, shared] },
          empty: nullPrototype,
          callback: allowed,
        };
        Object.defineProperty(source, 'hidden', { value: 'retained', enumerable: false });
        const { publication } = publish(local, source);
        const context: Record<string, unknown> = {};
        const capability = issueExistingReadyCapability(local.owner, publication, 100, () => 0);
        assert.equal(pinExistingReadyContext(local.owner, capability, local.app, context), true);
        const detached = context.config as typeof source & { hidden: string };
        assert.notEqual(detached, source);
        assert.notEqual(detached.nested, source.nested);
        assert.notEqual(detached.nested.items, source.nested.items);
        assert.notEqual(detached.nested.items[0], shared);
        assert.notEqual(detached.nested.items[0], detached.nested.items[1]);
        assert.equal(detached.callback, allowed);
        assert.equal(Object.getPrototypeOf(detached.empty), null);
        assert.equal(detached.hidden, 'retained');
        assert.equal(Object.getOwnPropertyDescriptor(detached, 'hidden')?.enumerable, false);
        for (const value of [
          detached,
          detached.nested,
          detached.nested.items,
          ...detached.nested.items,
          detached.empty,
        ]) {
          assert.equal(Object.isFrozen(value), true);
        }
        shared.value = 2;
        source.nested.items.push({ value: 3 });
        nullPrototype.flag = false;
        assert.equal(detached.nested.items.length, 2);
        assert.equal(detached.nested.items[0].value, 1);
        assert.equal(detached.empty.flag, true);

        const cycle: Record<string, unknown> = {};
        cycle.self = cycle;
        const arrayCycle: unknown[] = [];
        arrayCycle.push(arrayCycle);
        const getter = Object.defineProperty({}, 'secret', { get: read, enumerable: true });
        const hiddenGetter = Object.defineProperty({}, 'secret', { get: read });
        const symbolKey = { [Symbol('unsupported')]: true };
        const exoticArray = Object.setPrototypeOf([], null);
        const rejected: readonly [string, unknown][] = [
          ['enumerable getter', { nested: getter }],
          ['non-enumerable getter', hiddenGetter],
          ['object cycle', cycle],
          ['array cycle', arrayCycle],
          ['date', { value: new Date(0) }],
          ['map', { value: new Map() }],
          ['set', { value: new Set() }],
          ['regexp', { value: /synthetic/ }],
          ['typed array', { value: new Uint8Array(1) }],
          ['custom prototype', Object.create({ inherited: true })],
          ['custom array prototype', exoticArray],
          ['symbol key', symbolKey],
          ['symbol value', { value: Symbol('unsupported') }],
          ['bigint', { value: 1n }],
          ['non-finite number', { value: Infinity }],
          ['NaN', { value: Number.NaN }],
          ['unlisted function', { callback: () => undefined }],
          ['frozen lookalike added after provisioning', { callback: lookalike }],
          ['allowlisted writable function property', { callback: mutable }],
          ['allowlisted object function property', { callback: withObject }],
          ['allowlisted function function property', { callback: withFunction }],
          ['allowlisted ordinary function prototype', { callback: ordinary }],
          ['allowlisted function getter', { callback: withGetter }],
          ['primitive root', 'not an object'],
          ['null root', null],
        ];
        for (const [label, value] of rejected) {
          const { attempt, captured } = capture(local, value);
          assert.equal(captured, undefined, label);
          finishCompletedInstance(local.owner, local.name, attempt, captured);
          assert.equal(current(local), undefined, label);
        }
        const rowWithGetter = Object.defineProperty({ ...local.row }, 'config', { get: read });
        assert.equal(capture(local, {}, rowWithGetter).captured, undefined);
        assert.equal(getterReads, 0);
        assert.equal(calls, 0);
      },
    );

    test(
      'publication and capability identity reject forgery, foreign owners, expiration, and stale state',
      {
        concurrency: false,
        timeout: 15_000,
      },
      () => {
        const local = fixture();
        const foreign = fixture();
        ready(local);
        ready(foreign);
        const { attempt, publication } = publish(local, { revision: 1 });
        assert.equal(Object.isFrozen(publication), true);
        assert.equal(getCompletedPublication(local.owner, local.name, {}, local.route), undefined);
        assert.equal(
          getCompletedPublication(local.owner, local.name, local.registry, {}),
          undefined,
        );
        assert.equal(
          getCompletedPublication(foreign.owner, local.name, local.registry, local.route),
          undefined,
        );
        assert.equal(matchesCompletedRow(publication, { ...local.row }), true);
        for (const changed of [
          { id: 2 },
          { name: 'other' },
          { disabled: true },
          { isolate: true },
          { config: '{}' },
        ]) {
          assert.equal(matchesCompletedRow(publication, { ...local.row, ...changed }), false);
        }
        let rowReads = 0;
        const rowWithGetter = Object.defineProperty({ ...local.row }, 'id', {
          get() {
            rowReads++;
            return 1;
          },
        });
        assert.equal(matchesCompletedRow(publication, rowWithGetter), false);
        assert.equal(rowReads, 0);

        for (const forged of [{}, { ...publication }, Object.create(publication)]) {
          assert.throws(
            () => issueExistingReadyCapability(local.owner, forged, 20, () => 10),
            /Existing-ready unavailable/,
          );
          finishCompletedInstance(foreign.owner, foreign.name, attempt, forged);
          assert.equal(current(foreign), undefined);
        }
        finishCompletedInstance(foreign.owner, foreign.name, attempt, publication);
        assert.equal(current(foreign), undefined);

        let now = 10;
        const capability = issueExistingReadyCapability(local.owner, publication, 20, () => now);
        assert.equal(Object.isFrozen(capability), true);
        const resolved = resolveExistingReadyCapability(local.owner, capability, local.app);
        assert.ok(resolved);
        assert.equal(Object.isFrozen(resolved), true);
        assert.equal(resolved.publication, publication);
        assert.equal(resolved.name, local.name);
        assert.equal(resolved.handle, local.handle);
        assert.equal(
          resolveExistingReadyCapability(foreign.owner, capability, foreign.app),
          undefined,
        );
        assert.equal(
          resolveExistingReadyCapability(local.owner, capability, foreign.app),
          undefined,
        );
        for (const forged of [{}, { ...capability }, Object.create(capability)]) {
          assert.equal(
            resolveExistingReadyCapability(
              local.owner,
              forged as ExistingReadyCapability,
              local.app,
            ),
            undefined,
          );
        }
        const misissued = issueExistingReadyCapability(foreign.owner, publication, 20, () => 10);
        assert.equal(
          resolveExistingReadyCapability(foreign.owner, misissued, foreign.app),
          undefined,
        );
        now = 19;
        assert.ok(resolveExistingReadyCapability(local.owner, capability, local.app));
        now = 20;
        assert.equal(resolveExistingReadyCapability(local.owner, capability, local.app), undefined);
        for (const clock of [
          () => Number.NaN,
          () => Infinity,
          () => {
            throw new Error('Synthetic clock failure');
          },
        ]) {
          const invalidClock = issueExistingReadyCapability(local.owner, publication, 20, clock);
          assert.equal(
            resolveExistingReadyCapability(local.owner, invalidClock, local.app),
            undefined,
          );
        }

        now = 10;
        invalidateCompletedInstance(local.owner, local.name);
        assert.equal(current(local), undefined);
        assert.equal(resolveExistingReadyCapability(local.owner, capability, local.app), undefined);
        finishCompletedInstance(local.owner, local.name, attempt, publication);
        assert.equal(current(local), undefined);
        const replacement = publish(local, { revision: 2 });
        assert.notEqual(replacement.publication, publication);
        assert.equal(resolveExistingReadyCapability(local.owner, capability, local.app), undefined);
        const replacementCapability = issueExistingReadyCapability(
          local.owner,
          replacement.publication,
          20,
          () => 10,
        );
        assert.ok(resolveExistingReadyCapability(local.owner, replacementCapability, local.app));
        provisionCompletedInstanceForTest(local.owner, local.name, {
          registry: local.registry,
          route: local.route,
          handle: local.handle,
          isolate: false,
        });
        assert.equal(current(local), undefined);
        assert.equal(
          resolveExistingReadyCapability(local.owner, replacementCapability, local.app),
          undefined,
        );
        assert.throws(
          () =>
            runWithRequestBoundary(createRequestBoundary(), () => {
              provisionCompletedInstanceForTest(local.owner, local.name, {
                registry: local.registry,
                route: local.route,
                handle: local.handle,
                isolate: false,
              });
            }),
          /Provisioning requires lifecycle boundary/,
        );
      },
    );

    test(
      'context pins immutable detached configuration and registry identity to the exact context owner',
      {
        concurrency: false,
        timeout: 15_000,
      },
      async () => {
        const local = fixture();
        const foreign = fixture();
        ready(local);
        ready(foreign);
        const config = { nested: { enabled: true }, values: [1, 2] };
        const { publication } = publish(local, config);
        const capability = issueExistingReadyCapability(local.owner, publication, 20, () => 10);
        const denied: Record<string, unknown> = {};
        assert.equal(
          pinExistingReadyContext(foreign.owner, capability, foreign.app, denied),
          false,
        );
        assert.equal(pinExistingReadyContext(local.owner, capability, foreign.app, denied), false);
        const expired = issueExistingReadyCapability(local.owner, publication, 10, () => 10);
        assert.equal(pinExistingReadyContext(local.owner, expired, local.app, denied), false);
        assert.deepEqual(Reflect.ownKeys(denied), []);
        assert.equal(isExistingReadyContext(denied), false);

        const context: Record<string, unknown> = { app: local.app };
        assert.equal(pinExistingReadyContext(local.owner, capability, local.app, context), true);
        assert.equal(isExistingReadyContext(context), true);
        const pinnedConfig = context.config as typeof config;
        const pinnedRow = context.instance as typeof local.row;
        assert.equal(getExistingReadyContextConfig(context), pinnedConfig);
        assert.notEqual(pinnedConfig, config);
        assert.notEqual(pinnedRow, local.row);
        assert.equal(context.instanceName, local.name);
        assert.equal(context.innerAccess, false);
        for (const key of ['config', 'instance', 'instanceName', 'innerAccess']) {
          const descriptor = Object.getOwnPropertyDescriptor(context, key);
          assert.ok(descriptor);
          assert.equal(descriptor.writable, false);
          assert.equal(descriptor.configurable, false);
          assert.equal(descriptor.enumerable, true);
          assert.equal(Reflect.set(context, key, {}), false);
          assert.equal(Reflect.deleteProperty(context, key), false);
          assert.equal(Reflect.defineProperty(context, key, { value: {} }), false);
        }
        assert.equal(Reflect.set(pinnedConfig.nested, 'enabled', false), false);
        assert.equal(Reflect.set(pinnedConfig.values, '0', 99), false);
        assert.equal(Reflect.set(pinnedRow, 'id', 99), false);
        assert.equal(Object.isFrozen(pinnedRow), true);
        assert.equal(pinExistingReadyContext(local.owner, capability, local.app, context), false);
        for (const lookalike of [{ ...context }, Object.create(context)]) {
          assert.equal(isExistingReadyContext(lookalike), false);
          assert.equal(getExistingReadyContextConfig(lookalike), undefined);
        }
        assert.equal(isExistingReadyContext(undefined), false);
        assert.equal(isExistingReadyContext(null), false);

        config.nested.enabled = false;
        config.values.push(3);
        local.row.id = 2;
        local.row.name = 'mutated-source';
        local.row.config = '{}';
        assert.equal(pinnedConfig.nested.enabled, true);
        assert.deepEqual(pinnedConfig.values, [1, 2]);
        assert.equal(pinnedRow.id, 1);
        assert.equal(pinnedRow.name, local.name);
        assert.equal(pinnedRow.config, null);
        assert.equal(context.instanceName, local.name);

        invalidateCompletedInstance(local.owner, local.name);
        assert.equal(resolveExistingReadyCapability(local.owner, capability, local.app), undefined);
        const afterInvalidation = {};
        assert.equal(
          pinExistingReadyContext(local.owner, capability, local.app, afterInvalidation),
          false,
        );
        assert.equal(isExistingReadyContext(afterInvalidation), false);
        // An already pinned context retains its captured data; this is not a claim
        // that an invalidated capability can admit another context.
        assert.equal(getExistingReadyContextConfig(context), pinnedConfig);
        const foreignPublication = publish(foreign, { foreign: true }).publication;
        const foreignCapability = issueExistingReadyCapability(
          foreign.owner,
          foreignPublication,
          20,
          () => 10,
        );
        assert.equal(
          pinExistingReadyContext(foreign.owner, foreignCapability, foreign.app, context),
          false,
        );
        assert.equal(getExistingReadyContextConfig(context), pinnedConfig);

        // Trace the existing getter's pin-first integration without importing the
        // bean container or touching production application configuration.
        const contextSource = await readFile(new URL('./context.ts', import.meta.url), 'utf8');
        assert.match(
          contextSource,
          /get config\(\)\s*\{\s*const self = cast\(this\);\s*const pinned = getExistingReadyContextConfig\(self\);\s*if \(pinned\) return pinned as any;\s*const serviceInstance =/,
        );
      },
    );
  },
);
