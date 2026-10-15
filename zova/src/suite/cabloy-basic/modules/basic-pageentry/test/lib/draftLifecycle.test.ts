import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { setImmediate as tick } from 'node:timers/promises';
import ts from 'typescript';
import { computed, effectScope, markRaw, nextTick, reactive, watch } from 'vue';

import type { IDraftEnvelope, IDraftIdentity } from '../../src/types/draft.js';

import {
  createDraftSchema,
  draftBaselineSignature,
  projectDraftValues,
  restoreDraftValues,
} from '../../src/lib/draftSchema.js';

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

interface Node {
  type: unknown;
  props: Record<string, any>;
  children: any[];
}

function h(type: unknown, props: Record<string, any> | null, ...children: any[]): Node {
  return { type, props: props ?? {}, children: children.flat(Infinity) };
}

// Adapt a-form's schemaRefreshLifecycle evaluator: execute the current controller,
// including its TSX, rather than copying the draft state machine into the test.
function evaluateController(bindings: Record<string, unknown>) {
  const path = '../../src/component/blockPageEntry/controller.tsx';
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?;\n/gm, '')
    .replace(/^\s*@(Controller|UseScope|Use)\([^\n]*\)\s*\n/gm, '');
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: path,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      jsxFactory: 'h',
    },
  });
  assert.deepEqual(
    diagnostics?.filter(item => item.category === ts.DiagnosticCategory.Error),
    [],
  );
  const javascript = outputText.replace(
    'export class ControllerBlockPageEntry',
    'class ControllerBlockPageEntry',
  );
  return new Function(...Object.keys(bindings), `${javascript}\nreturn ControllerBlockPageEntry;`)(
    ...Object.values(bindings),
  );
}

const ControllerBlockPageEntry = evaluateController({
  BeanControllerBase: class {},
  createDraftSchema,
  draftBaselineSignature,
  projectDraftValues,
  restoreDraftValues,
  formMetaFromFormScene: (scene: string) => ({ formMode: 'edit', editMode: scene }),
  $QueriesEnsureLoaded: async (...queries: (() => unknown)[]) => {
    for (const query of queries) await query();
  },
  deepEqual: (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right),
  deepExtend: (target: any, source: any) => Object.assign(target, structuredClone(source)),
  isNil: (value: unknown) => value === undefined || value === null,
  h,
  ZButton: 'ZButton',
});

const baseline = {
  id: 7,
  name: 'Server name',
  note: 'Server note',
  server: 'Fresh readonly value',
  password: 'Never persist',
};

const formSchema = {
  type: 'object',
  properties: {
    id: { type: 'number', readOnly: true },
    name: { type: 'string' },
    note: { type: 'string' },
    server: { type: 'string', readOnly: true },
    password: { type: 'string' },
  },
};

type Outcome = 'success' | 'failed' | 'throw' | 'stale';

function operation(outcome: Outcome = 'success') {
  return { ...deferred(), entered: deferred(), outcome };
}

type Operation = ReturnType<typeof operation>;

function createRuntime() {
  const entry: any = new ControllerBlockPageEntry();
  const identity: IDraftIdentity = {
    context: { scope: ['2', 'admin', '1'], epoch: 0 },
    resource: 'training-student:student',
    mode: 'edit',
    id: '7',
    path: '/resource/student/7/edit',
  };
  const key = JSON.stringify(identity);
  const database = new Map<string, IDraftEnvelope>();
  const owner: any = { snapshot: null, failed: false };
  const plans = { open: [] as Operation[], save: [] as Operation[], remove: [] as Operation[] };
  const calls = { identity: 0, open: 0, remove: 0, refetch: 0, bean: 0 };
  const saves: { envelope: IDraftEnvelope; done: Promise<void> }[] = [];
  const resets: { values: any; options: any }[] = [];
  const pageMeta: any[] = [];
  const listeners = new Set<(event: any, next: () => void) => void>();
  let generation = 0;
  let beanWait: Promise<void> | undefined;
  let refetch: () => Promise<any> = async () => ({ data: structuredClone(baseline) });
  const passport = { isAuthenticated: true, user: { id: 1, anonymous: false } };
  const coordinator = {
    identity() {
      calls.identity++;
      return identity;
    },
    async open() {
      calls.open++;
      const plan = plans.open.shift();
      plan?.entered.resolve();
      if (plan) await plan.promise;
      if (plan?.outcome === 'throw') throw new Error('Open failed');
      if (plan?.outcome === 'stale') return;
      owner.snapshot = structuredClone(database.get(key) ?? null);
      owner.failed = plan?.outcome === 'failed';
      return { key, identity, generation, owner };
    },
    isCurrent(actualIdentity: IDraftIdentity) {
      return (
        passport.isAuthenticated && String(passport.user.id) === actualIdentity.context.scope[2]
      );
    },
    current(editor: any) {
      return editor.generation === generation && this.isCurrent(editor.identity);
    },
    save(editor: any, actualIdentity: IDraftIdentity, envelope: IDraftEnvelope) {
      assert.equal(actualIdentity, identity);
      assert.equal(this.current(editor), true);
      const plan = plans.save.shift();
      // ModelDraft updates its in-memory snapshot before persisting. Failure must
      // not erase the old durable envelope, even though the owner has new data.
      owner.snapshot = structuredClone(envelope);
      const done = (async () => {
        plan?.entered.resolve();
        if (plan) await plan.promise;
        owner.failed = plan?.outcome === 'failed' || plan?.outcome === 'throw';
        if (plan?.outcome === 'throw') throw new Error('Save threw');
        if (!owner.failed) database.set(key, structuredClone(envelope));
      })();
      saves.push({ envelope: structuredClone(envelope), done });
      return done;
    },
    async remove(actualIdentity: IDraftIdentity) {
      assert.equal(actualIdentity, identity);
      calls.remove++;
      ++generation;
      const plan = plans.remove.shift();
      plan?.entered.resolve();
      if (plan) await plan.promise;
      if (plan?.outcome === 'throw' || plan?.outcome === 'failed') {
        owner.failed = true;
        throw new Error('Remove failed');
      }
      database.delete(key);
      owner.snapshot = null;
      owner.failed = false;
    },
  };
  entry.app = {
    bean: {
      async _getBean(name: string, cached: boolean) {
        assert.equal(name, 'basic-pageentry.bean.draftCoordinator');
        assert.equal(cached, true);
        calls.bean++;
        await beanWait;
        return coordinator;
      },
    },
    meta: {
      locale: { current: 'en-us' },
      event: {
        on(name: string, listener: (event: any, next: () => void) => void) {
          assert.equal(name, 'a-router:routeDiscard');
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      },
    },
  };
  entry.scope = {
    config: { draft: { enabled: true, resources: {}, maxAge: 86400000 } },
    locale: Object.fromEntries(
      [
        'DraftAvailable',
        'DraftSaved',
        'DraftRecover',
        'DraftDiscard',
        'DraftStorageFailed',
        'DraftIncompatible',
        'DraftRecoverFailed',
        'DraftReplaceConfirm',
        'DraftRetry',
        'EntryNotExist',
      ].map(name => [name, () => name]),
    ),
  };
  entry.$props = {
    ...ControllerBlockPageEntry.$propsDefault,
    resource: identity.resource,
    id: 7,
    formScene: 'edit',
  };
  entry.$passport = passport;
  entry.$ssr = { isRuntimeSsrPreHydration: false };
  entry.$pageRoute = { fullPath: identity.path };
  entry.$router = {
    resolve: (fullPath: string) => ({ path: fullPath.split('?')[0] }),
    setPageMeta: (_route: any, meta: any) => pageMeta.push(structuredClone(meta)),
  };
  entry.$sdk = {
    loadSchemaProperties(schema: any) {
      return Object.entries(schema.properties ?? {}).map(([key, value]) => ({
        ...(value as any),
        key,
      }));
    },
    getSchema: () => ({ data: undefined }),
  };
  entry.formMeta = { formMode: 'edit', editMode: 'edit', formScene: 'edit' };
  entry.formSchema = structuredClone(formSchema);
  entry.formData = structuredClone(baseline);
  entry.formRef = {
    formState: { values: structuredClone(baseline) },
    reset(values: any, options: any) {
      resets.push({ values: structuredClone(values), options });
      this.formState.values = structuredClone(values);
    },
  };
  entry.$$modelResource = {
    view() {
      return {
        refetch(options: any) {
          assert.deepEqual(options, { throwOnError: true });
          calls.refetch++;
          return refetch();
        },
      };
    },
  };
  entry.$performCommand = async () => true;
  entry._setEditorBaseline(baseline);
  pageMeta.length = 0;
  return {
    entry,
    coordinator,
    identity,
    database,
    owner,
    calls,
    saves,
    resets,
    pageMeta,
    passport,
    candidate(values: any = { name: 'Old draft', note: 'Old draft note' }) {
      const schema = entry._getDraftSchema();
      const envelope: IDraftEnvelope = {
        version: 1,
        savedAt: Date.now(),
        schemaSignature: schema.signature,
        baselineSignature: draftBaselineSignature(schema, baseline),
        projection: projectDraftValues(schema, values, baseline),
      };
      database.set(key, structuredClone(envelope));
      return envelope;
    },
    durable() {
      return database.get(key);
    },
    plan(kind: keyof typeof plans, outcome: Outcome = 'success') {
      const plan = operation(outcome);
      plans[kind].push(plan);
      return plan;
    },
    waitForBean(promise: Promise<void>) {
      beanWait = promise;
    },
    refetchWith(callback: () => Promise<any>) {
      refetch = callback;
    },
    change(values: any) {
      entry.formRef.formState.values = structuredClone(values);
      entry.formChanged(entry.formRef.formState.values);
    },
    discardRoute() {
      for (const listener of [...listeners]) {
        listener(
          { router: entry.$router, items: [{ fullPath: `${identity.path}?tab=details` }] },
          () => {},
        );
      }
    },
    renderDraft() {
      return [entry._renderDraft(), entry._renderDraftStorage?.()];
    },
    dispose() {
      entry.__dispose__();
    },
  };
}

type Runtime = ReturnType<typeof createRuntime>;

async function withRuntime(run: (runtime: Runtime) => Promise<void>) {
  const previousClient = process.env.CLIENT;
  Object.assign(process.env, { CLIENT: 'true' });
  let runtime: Runtime | undefined;
  try {
    runtime = createRuntime();
    await run(runtime);
  } finally {
    runtime?.dispose();
    if (previousClient === undefined) Reflect.deleteProperty(process.env, 'CLIENT');
    else Object.assign(process.env, { CLIENT: previousClient });
  }
}

function nodes(value: any): Node[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== 'object') return [];
  return [value, ...nodes(value.children)];
}

function testIds(value: any) {
  return nodes(value)
    .map(node => node.props['data-testid'])
    .filter(Boolean);
}

function assertNoReset(runtime: Runtime, values: any) {
  assert.deepEqual(runtime.resets, []);
  assert.deepEqual(runtime.entry.formRef.formState.values, values);
}

async function startCandidate(runtime: Runtime) {
  const candidate = runtime.candidate();
  await runtime.entry._startDraft();
  assert.deepEqual(runtime.entry.draftCandidate, candidate);
  return candidate;
}

for (const earlyInput of [false, true]) {
  test(
    `delayed edit schema starts discovery after mounted readiness${earlyInput ? ' without replacing early input' : ' exactly once'}`,
    { concurrency: false },
    async () => {
      await withRuntime(async runtime => {
        const candidate = runtime.candidate();
        const scope = effectScope();
        markRaw(runtime.coordinator);
        markRaw(runtime.identity);
        markRaw(runtime.entry.formRef);
        const entry = reactive(runtime.entry);
        const readiness = reactive({ schema: undefined as typeof formSchema | undefined });
        const hydrated: (() => void)[] = [];
        const model = runtime.entry.$$modelResource;
        Object.assign(model, {
          getFormSchema: () => readiness.schema,
          getFormData: () => structuredClone(baseline),
          getFormApiSchemas: () => undefined,
        });
        entry.bean = { _getBeanSelector: async () => model };
        entry._prepareJsx = () => {};
        entry.$computed = (getter: () => unknown) => scope.run(() => computed(getter));
        entry.$watch = (...args: any[]) => scope.run(() => (watch as any)(...args));
        entry.$ssr = {
          isRuntimeSsrPreHydration: true,
          handleDirectOrOnHydrated(callback: () => void) {
            if (this.isRuntimeSsrPreHydration) hydrated.push(callback);
            else callback();
          },
        };
        try {
          await entry.__init__();
          entry.formReady(entry.formRef);
          assert.equal(runtime.calls.open, 0);
          entry.$ssr.isRuntimeSsrPreHydration = false;
          hydrated.forEach(callback => callback());
          await tick();
          assert.equal(runtime.calls.open, 0);
          assert.equal(entry._draftStarted, false);
          if (earlyInput) {
            entry.formRef.formState.values = { ...baseline, name: 'New early input' };
            entry.formChanged(entry.formRef.formState.values);
          }
          readiness.schema = structuredClone(formSchema);
          await nextTick();
          await tick();
          assert.equal(runtime.calls.open, 1);
          if (earlyInput) {
            assert.equal(entry.draftCandidate, undefined);
            assert.equal(runtime.durable()?.projection.values.name, 'New early input');
          } else {
            assert.deepEqual(entry.draftCandidate, candidate);
            await entry.recoverDraft();
            assert.equal(entry.draftCandidate, undefined);
            assert.equal(entry.formRef.formState.values.name, 'Old draft');
          }
          // Schema gaps or another form-ready callback must not rediscover active work.
          readiness.schema = undefined;
          await nextTick();
          readiness.schema = structuredClone(formSchema);
          await nextTick();
          entry.formReady(entry.formRef);
          await tick();
          assert.equal(runtime.calls.open, 1);
          assert.equal(entry.draftCandidate, undefined);
        } finally {
          entry.__dispose__();
          scope.stop();
        }
      });
    },
  );
}

test(
  'first input synchronously dismisses the candidate and saves one complete replacement without remove',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      const save = runtime.plan('save');
      runtime.change({ name: 'New input', password: 'Do not persist', unknown: 'Not declared' });
      assert.equal(runtime.entry.draftCandidate, undefined);
      assert.equal(runtime.entry._dirty, true);
      assert.equal(runtime.entry._draftInputRevision, 1);
      assert.equal(runtime.calls.remove, 0);
      assert.equal(runtime.calls.refetch, 0);
      assert.deepEqual(runtime.saves[0].envelope.projection.values, { name: 'New input' });
      assert.equal(runtime.durable()!.projection.values.name, 'Old draft');
      save.resolve();
      await tick();
      assert.deepEqual(runtime.durable()!.projection.values, { name: 'New input' });
      assert.equal(runtime.entry.draftActive, true);
      assert.equal(runtime.entry.draftError, undefined);
      assertNoReset(runtime, {
        name: 'New input',
        password: 'Do not persist',
        unknown: 'Not declared',
      });
    });
  },
);

test(
  'input during slow coordinator discovery or open wins over the late saved candidate',
  { concurrency: false },
  async () => {
    for (const delay of ['bean', 'open'] as const) {
      await withRuntime(async runtime => {
        runtime.candidate();
        const gate = delay === 'bean' ? deferred() : runtime.plan('open');
        if (delay === 'bean') runtime.waitForBean(gate.promise);
        const started = runtime.entry._startDraft();
        if (delay === 'open') await (gate as Operation).entered.promise;
        runtime.change({ name: 'Input during discovery' });
        assert.equal(runtime.entry.draftCandidate, undefined);
        gate.resolve();
        await started;
        assert.equal(runtime.entry.draftCandidate, undefined);
        assert.equal(runtime.calls.remove, 0);
        assert.deepEqual(runtime.durable()!.projection.values, { name: 'Input during discovery' });
        assertNoReset(runtime, { name: 'Input during discovery' });
      });
    }
  },
);

test(
  'recovery uses real schema signatures, projection and restore over a fresh server baseline',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      const candidate = await startCandidate(runtime);
      const fresh = {
        ...baseline,
        server: 'Refetched readonly value',
        password: 'Refetched secret',
      };
      runtime.refetchWith(async () => ({ data: fresh }));
      const expected = restoreDraftValues(
        runtime.entry._getDraftSchema(),
        candidate.projection,
        fresh,
      );
      await runtime.entry.recoverDraft();
      assert.equal(runtime.calls.refetch, 1);
      assert.deepEqual(runtime.resets, [
        { values: expected, options: { keepDefaultValues: true } },
      ]);
      assert.equal(runtime.entry.formRef.formState.values.server, 'Refetched readonly value');
      assert.equal(runtime.entry.formRef.formState.values.name, 'Old draft');
      assert.equal(runtime.entry.draftCandidate, undefined);
      assert.equal(runtime.entry.draftActive, true);
      assert.equal(runtime.entry._dirty, true);
      assert.equal(runtime.pageMeta.at(-1).pageDirty, true);
      assert.equal(runtime.calls.remove, 0);
    });
  },
);

test(
  'recovery rejects changed baseline or schema signatures without resetting the form',
  { concurrency: false },
  async () => {
    for (const mismatch of ['baseline', 'schema'] as const) {
      await withRuntime(async runtime => {
        await startCandidate(runtime);
        if (mismatch === 'baseline') {
          runtime.refetchWith(async () => ({ data: { ...baseline, name: 'Changed server name' } }));
        } else {
          runtime.entry.formSchema.properties.note.maxLength = 2;
        }
        await runtime.entry.recoverDraft();
        assert.equal(runtime.entry.draftError, 'incompatible');
        assert.ok(runtime.entry.draftCandidate);
        assertNoReset(runtime, baseline);
      });
    }
  },
);

test(
  'new input invalidates pending recovery refetch success and cannot be reset by its completion',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      const result = deferred<any>();
      runtime.refetchWith(() => result.promise);
      const recovery = runtime.entry.recoverDraft();
      assert.equal(runtime.calls.refetch, 1);
      runtime.change({ name: 'Typed during refetch' });
      await tick();
      const metaCount = runtime.pageMeta.length;
      result.resolve({ data: structuredClone(baseline) });
      await recovery;
      assertNoReset(runtime, { name: 'Typed during refetch' });
      assert.equal(runtime.pageMeta.length, metaCount);
      assert.equal(runtime.entry.draftCandidate, undefined);
      assert.equal(runtime.entry.draftError, undefined);
      assert.deepEqual(runtime.entry._baseline, baseline);
      assert.deepEqual(runtime.durable()!.projection.values, { name: 'Typed during refetch' });
    });
  },
);

test(
  'new input invalidates pending recovery errors and retains the latest storage error',
  { concurrency: false },
  async () => {
    for (const error of [new Error('Offline'), { code: 403 }, { response: { status: 404 } }]) {
      await withRuntime(async runtime => {
        await startCandidate(runtime);
        const result = deferred<any>();
        runtime.refetchWith(() => result.promise);
        const recovery = runtime.entry.recoverDraft();
        const save = runtime.plan('save', 'failed');
        runtime.change({ name: 'Current input' });
        save.resolve();
        await tick();
        assert.equal(runtime.entry.draftError, 'storage');
        result.reject(error);
        await recovery;
        assert.equal(runtime.entry.draftError, 'storage');
        assert.equal(runtime.entry.draftCandidate, undefined);
        assertNoReset(runtime, { name: 'Current input' });
      });
    }
  },
);

test(
  'current recovery failures remain visible and distinguish incompatible from recover errors',
  { concurrency: false },
  async () => {
    for (const [error, expected] of [
      [new Error('Offline'), 'recover'],
      [Object.assign(new Error('Forbidden'), { code: 403 }), 'incompatible'],
    ] as const) {
      await withRuntime(async runtime => {
        await startCandidate(runtime);
        runtime.refetchWith(() => Promise.reject(error));
        await runtime.entry.recoverDraft();
        assert.equal(runtime.entry.draftError, expected);
        assert.ok(runtime.entry.draftCandidate);
        assertNoReset(runtime, baseline);
      });
    }
  },
);

test(
  'input while replacement confirmation is pending prevents recovery refetch and reset',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      // Exercise the supported confirmation branch without replacing controller methods.
      runtime.entry._dirty = true;
      const confirmed = deferred<boolean>();
      runtime.entry.$performCommand = () => confirmed.promise;
      const recovery = runtime.entry.recoverDraft();
      runtime.change({ name: 'Input during confirmation' });
      confirmed.resolve(true);
      await recovery;
      await tick();
      assert.equal(runtime.calls.refetch, 0);
      assertNoReset(runtime, { name: 'Input during confirmation' });
      assert.equal(runtime.entry.draftCandidate, undefined);
    });
  },
);

test(
  'active drafts render no banner or discard toolbar, while candidates still offer recovery',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      assert.ok(testIds(runtime.entry._renderDraft()).includes('resource-draft'));
      assert.ok(
        nodes(runtime.entry._renderDraft()).some(
          node => typeof node.props.onPerform === 'function',
        ),
      );
      runtime.change({ name: 'Active input' });
      await tick();
      assert.equal(runtime.entry.draftActive, true);
      assert.equal(runtime.entry._renderDraft(), undefined);
      assert.deepEqual(testIds(runtime.renderDraft()), []);
    });
  },
);

test(
  'active storage failures use a separate resource-draft-storage indicator and retry saves latest values',
  { concurrency: false },
  async () => {
    for (const outcome of ['failed', 'throw'] as const) {
      await withRuntime(async runtime => {
        const old = await startCandidate(runtime);
        const failed = runtime.plan('save', outcome);
        runtime.change({ name: 'Failed replacement' });
        failed.resolve();
        await tick();
        assert.equal(runtime.entry.draftCandidate, undefined);
        assert.equal(runtime.entry.draftError, 'storage');
        assert.deepEqual(runtime.durable(), old);
        assert.equal(runtime.entry._renderDraft(), undefined);
        assert.deepEqual(testIds(runtime.renderDraft()), ['resource-draft-storage']);
        // Retry reads the current form, not the failed envelope or old candidate.
        runtime.entry.formRef.formState.values = { name: 'Latest retry value', note: undefined };
        await runtime.entry.retryDraftStorage();
        assert.deepEqual(runtime.durable()!.projection.values, { name: 'Latest retry value' });
        assert.deepEqual(runtime.durable()!.projection.undefinedPaths, ['["note"]']);
        assert.equal(runtime.entry.draftError, undefined);
        assert.equal(runtime.entry.draftActive, true);
        assert.equal(runtime.calls.remove, 0);
        assert.deepEqual(testIds(runtime.renderDraft()), []);
      });
    }
  },
);

test(
  'a failed initial read retries discovery without replacing its candidate with baseline form data',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      const old = runtime.candidate();
      const read = runtime.plan('open', 'failed');
      const started = runtime.entry._startDraft();
      await read.entered.promise;
      read.resolve();
      await started;
      assert.equal(runtime.entry.draftError, 'storage');
      assert.deepEqual(runtime.entry.draftCandidate, old);
      await runtime.entry.retryDraftStorage();
      assert.deepEqual(runtime.entry.draftCandidate, old);
      assert.equal(runtime.entry.draftError, undefined);
      assert.equal(runtime.saves.length, 0);
      assert.equal(runtime.calls.remove, 0);
      assert.deepEqual(runtime.durable(), old);
    });
  },
);

test(
  'internal active discard resets the baseline but has no active draft toolbar',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await runtime.entry._startDraft();
      runtime.change({ name: 'Active changes' });
      await tick();
      assert.equal(runtime.entry._renderDraft(), undefined);
      await runtime.entry.discardDraft();
      assert.deepEqual(runtime.resets, [{ values: baseline, options: undefined }]);
      assert.equal(runtime.entry._dirty, false);
      assert.equal(runtime.entry.draftActive, false);
      assert.equal(runtime.entry.draftCandidate, undefined);
      assert.equal(runtime.entry._draftRemovalPending, false);
      assert.equal(runtime.durable(), undefined);
      assert.equal(runtime.pageMeta.at(-1).pageDirty, false);
    });
  },
);

test(
  'discarding an untouched candidate never resets the live baseline',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      await runtime.entry.discardDraft();
      assertNoReset(runtime, baseline);
      assert.equal(runtime.entry._dirty, false);
      assert.equal(runtime.durable(), undefined);
    });
  },
);

test(
  'input during active removal or editor reopen is not reset and is saved after reopen',
  { concurrency: false },
  async () => {
    for (const phase of ['remove', 'open'] as const) {
      await withRuntime(async runtime => {
        await runtime.entry._startDraft();
        runtime.change({ name: 'Before discard' });
        await tick();
        const wait = runtime.plan(phase);
        const discarded = runtime.entry.discardDraft();
        await wait.entered.promise;
        runtime.change({ name: `Input during ${phase}` });
        assert.equal(runtime.entry._draftRemovalPending, true);
        wait.resolve();
        await discarded;
        assertNoReset(runtime, { name: `Input during ${phase}` });
        assert.equal(runtime.entry._dirty, true);
        assert.equal(runtime.entry.draftActive, true);
        assert.deepEqual(runtime.durable()!.projection.values, { name: `Input during ${phase}` });
        assert.equal(runtime.pageMeta.at(-1).pageDirty, true);
      });
    }
  },
);

test(
  'stale reopen, route-session invalidation and disposal prevent an active discard reset',
  { concurrency: false },
  async () => {
    for (const invalidate of ['stale', 'session', 'dispose'] as const) {
      await withRuntime(async runtime => {
        await runtime.entry._startDraft();
        runtime.change({ name: 'Keep live state' });
        await tick();
        const reopen = runtime.plan('open', invalidate === 'stale' ? 'stale' : 'success');
        const discarded = runtime.entry.discardDraft();
        await reopen.entered.promise;
        if (invalidate === 'session') runtime.discardRoute();
        if (invalidate === 'dispose') runtime.dispose();
        const metaCount = runtime.pageMeta.length;
        reopen.resolve();
        await discarded;
        assertNoReset(runtime, { name: 'Keep live state' });
        assert.equal(runtime.pageMeta.length, metaCount);
      });
    }
  },
);

test(
  'failed removal keeps durable data and retry removal still protects intervening input',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await runtime.entry._startDraft();
      runtime.change({ name: 'Before failed discard' });
      await tick();
      const old = structuredClone(runtime.durable());
      const removal = runtime.plan('remove', 'throw');
      const discarded = runtime.entry.discardDraft();
      removal.resolve();
      await discarded;
      assert.equal(runtime.entry.draftError, 'storage');
      assert.equal(runtime.entry._draftRemovalPending, true);
      assert.deepEqual(runtime.durable(), old);
      assertNoReset(runtime, { name: 'Before failed discard' });
      const retryRemoval = runtime.plan('remove');
      const retry = runtime.entry.retryDraftStorage();
      await retryRemoval.entered.promise;
      runtime.change({ name: 'During retry removal' });
      retryRemoval.resolve();
      await retry;
      assertNoReset(runtime, { name: 'During retry removal' });
      assert.equal(runtime.entry.draftError, undefined);
      assert.equal(runtime.entry._draftRemovalPending, false);
      assert.deepEqual(runtime.durable()!.projection.values, { name: 'During retry removal' });
    });
  },
);

test(
  'retrying failed removal retains the original input revision and never resets intervening input',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await runtime.entry._startDraft();
      runtime.change({ name: 'Before failed discard' });
      await tick();
      const removal = runtime.plan('remove', 'throw');
      const discarded = runtime.entry.discardDraft();
      removal.resolve();
      await discarded;
      assert.equal(runtime.entry._draftRemovalPending, true);
      runtime.change({ name: 'After failed discard, before retry' });
      await runtime.entry.retryDraftStorage();
      assertNoReset(runtime, { name: 'After failed discard, before retry' });
      assert.equal(runtime.entry._dirty, true);
      assert.equal(runtime.entry._draftRemovalPending, false);
      assert.deepEqual(runtime.durable()!.projection.values, {
        name: 'After failed discard, before retry',
      });
    });
  },
);

test(
  'schemaRefreshed is not input takeover and does not invalidate candidate recovery',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      const candidate = await startCandidate(runtime);
      runtime.entry._dirty = true;
      const result = deferred<any>();
      runtime.refetchWith(() => result.promise);
      const recovery = runtime.entry.recoverDraft();
      await tick();
      assert.equal(runtime.calls.refetch, 1);
      const inputRevision = runtime.entry._draftInputRevision;
      const recoveryRevision = runtime.entry._draftRecoveryRevision;
      runtime.entry.formSchema.properties.name.title = 'Translated name';
      runtime.entry.formSchemaRefreshed(runtime.entry.formRef.formState.values);
      assert.equal(runtime.entry._draftInputRevision, inputRevision);
      assert.equal(runtime.entry._draftRecoveryRevision, recoveryRevision);
      assert.deepEqual(runtime.entry.draftCandidate, candidate);
      assert.equal(runtime.saves.length, 0);
      result.resolve({ data: structuredClone(baseline) });
      await recovery;
      assert.equal(runtime.resets.length, 1);
      assert.equal(runtime.entry.draftCandidate, undefined);
      runtime.entry.formSchemaRefreshed(runtime.entry.formRef.formState.values);
      await tick();
      assert.equal(runtime.entry._draftInputRevision, inputRevision);
      assert.equal(runtime.saves.length, 1);
      assert.equal(runtime.entry.draftActive, true);
      assert.equal(runtime.entry._dirty, true);
    });
  },
);

test(
  'schemaRefreshed during slow initial open leaves the candidate available',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      const candidate = runtime.candidate();
      const open = runtime.plan('open');
      const started = runtime.entry._startDraft();
      await open.entered.promise;
      runtime.entry.formSchemaRefreshed(runtime.entry.formRef.formState.values);
      open.resolve();
      await started;
      assert.deepEqual(runtime.entry.draftCandidate, candidate);
      assert.equal(runtime.entry._draftInputRevision, 0);
      assert.equal(runtime.saves.length, 0);
      assert.equal(runtime.calls.remove, 0);
    });
  },
);

test(
  'overlapping saves ignore older failed or thrown completions after current success',
  { concurrency: false },
  async () => {
    for (const outcome of ['failed', 'throw'] as const) {
      await withRuntime(async runtime => {
        await runtime.entry._startDraft();
        const old = runtime.plan('save', outcome);
        runtime.change({ name: 'Old pending input' });
        runtime.change({ name: 'Current successful input' });
        await tick();
        assert.equal(runtime.entry.draftError, undefined);
        assert.equal(runtime.entry.draftActive, true);
        old.resolve();
        await tick();
        assert.equal(runtime.entry.draftError, undefined);
        assert.equal(runtime.entry.draftActive, true);
        assert.deepEqual(runtime.durable()!.projection.values, {
          name: 'Current successful input',
        });
        assertNoReset(runtime, { name: 'Current successful input' });
      });
    }
  },
);

test(
  'an older successful save cannot clear the current failed save error',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await runtime.entry._startDraft();
      const old = runtime.plan('save');
      runtime.change({ name: 'Old pending input' });
      const latest = runtime.plan('save', 'failed');
      runtime.change({ name: 'Current failed input' });
      latest.resolve();
      await tick();
      assert.equal(runtime.entry.draftError, 'storage');
      old.resolve();
      await tick();
      assert.equal(runtime.entry.draftError, 'storage');
      await runtime.entry.retryDraftStorage();
      assert.equal(runtime.entry.draftError, undefined);
      assert.deepEqual(runtime.durable()!.projection.values, { name: 'Current failed input' });
    });
  },
);

test(
  'disposal or route-session invalidation suppresses late save errors',
  { concurrency: false },
  async () => {
    for (const invalidate of ['session', 'dispose'] as const) {
      await withRuntime(async runtime => {
        await runtime.entry._startDraft();
        const save = runtime.plan('save', 'throw');
        runtime.change({ name: 'Before invalidation' });
        if (invalidate === 'session') runtime.discardRoute();
        else runtime.dispose();
        const error = runtime.entry.draftError;
        save.resolve();
        await tick();
        assert.equal(runtime.entry.draftError, error);
        assertNoReset(runtime, { name: 'Before invalidation' });
      });
    }
  },
);

test(
  'disposal or route-session invalidation independently suppresses pending recovery success and error',
  { concurrency: false },
  async () => {
    for (const invalidate of ['session', 'dispose'] as const) {
      for (const outcome of ['success', 'throw'] as const) {
        await withRuntime(async runtime => {
          await startCandidate(runtime);
          const result = deferred<any>();
          runtime.refetchWith(() => result.promise);
          const recovery = runtime.entry.recoverDraft();
          assert.equal(runtime.calls.refetch, 1);
          if (invalidate === 'session') runtime.discardRoute();
          else runtime.dispose();
          const error = runtime.entry.draftError;
          const metaCount = runtime.pageMeta.length;
          if (outcome === 'success') result.resolve({ data: structuredClone(baseline) });
          else result.reject(new Error('Late recovery failure'));
          await recovery;
          assert.equal(runtime.entry.draftError, error);
          assert.equal(runtime.pageMeta.length, metaCount);
          assertNoReset(runtime, baseline);
        });
      }
    }
  },
);

test(
  'newer recovery invalidates an overlapping older recovery completion',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      const first = deferred<any>();
      const second = deferred<any>();
      let attempt = 0;
      runtime.refetchWith(() => (++attempt === 1 ? first.promise : second.promise));
      const oldRecovery = runtime.entry.recoverDraft();
      const currentRecovery = runtime.entry.recoverDraft();
      second.reject(new Error('Current recovery failed'));
      await currentRecovery;
      assert.equal(runtime.entry.draftError, 'recover');
      first.resolve({ data: structuredClone(baseline) });
      await oldRecovery;
      assert.equal(runtime.entry.draftError, 'recover');
      assertNoReset(runtime, baseline);
    });
  },
);

test(
  'SSR and prehydration render no candidate, active banner or storage indicator',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      await startCandidate(runtime);
      for (const state of ['candidate', 'active', 'storage'] as const) {
        if (state !== 'candidate') runtime.entry.draftCandidate = undefined;
        runtime.entry.draftActive = state === 'active';
        runtime.entry.draftError = state === 'storage' ? 'storage' : undefined;
        Reflect.deleteProperty(process.env, 'CLIENT');
        assert.equal(runtime.entry._renderDraft(), undefined);
        assert.deepEqual(testIds(runtime.renderDraft()), []);
        Object.assign(process.env, { CLIENT: 'true' });
        runtime.entry.$ssr.isRuntimeSsrPreHydration = true;
        assert.equal(runtime.entry._renderDraft(), undefined);
        assert.deepEqual(testIds(runtime.renderDraft()), []);
        runtime.entry.$ssr.isRuntimeSsrPreHydration = false;
      }
    });
  },
);

test(
  'SSR start never obtains the coordinator or reads draft storage',
  { concurrency: false },
  async () => {
    await withRuntime(async runtime => {
      runtime.candidate();
      Reflect.deleteProperty(process.env, 'CLIENT');
      await runtime.entry._startDraft();
      assert.equal(runtime.calls.bean, 0);
      assert.equal(runtime.calls.open, 0);
      assert.equal(runtime.saves.length, 0);
      assert.equal(runtime.entry.draftCandidate, undefined);
    });
  },
);
