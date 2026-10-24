import { FieldApi, FormApi, getBy, revalidateLogic } from '@tanstack/form-core';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { nextTick, ref, toRaw } from 'vue';
import { z } from 'zod';

import {
  createSchemaRefreshContract,
  schemaRefreshFingerprint,
  SchemaRefreshTracker,
} from '../../src/lib/schemaRefresh.ts';

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

// Like basic-pageentry's draftModel harness, execute the current source rather than a
// copied refresh algorithm. TSX requires transpileModule instead of native stripping.
function evaluateClass(
  path: string,
  name: string,
  bindings: Record<string, unknown>,
  jsx = ts.JsxEmit.Preserve,
) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?;\n/gm, '')
    .replace(/^\s*@(Controller|UseScope|Use)\([^\n]*\)\s*\n/gm, '');
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: path,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx,
      jsxFactory: 'createElement',
    },
  });
  assert.deepEqual(
    diagnostics?.filter(item => item.category === ts.DiagnosticCategory.Error),
    [],
  );
  const javascript = outputText.replace(`export class ${name}`, `class ${name}`);
  return new Function(...Object.keys(bindings), `${javascript}\nreturn ${name};`)(
    ...Object.values(bindings),
  );
}

const computedValue = Symbol('computedValue');
class ControllerBase {
  $props: any = {};
  app: any;
  bean = { _setBean() {}, _newBeanSimple: () => ({}) };
  scope = { config: { formFieldLayout: { bordered: true } } };
  watchers: { source: () => any; callback: (...args: any[]) => any }[] = [];
  mountedCallbacks: (() => void)[] = [];

  constructor() {
    // Zova computed fields are unwrapped by their owner; retain that behavior
    // without booting a Vue component/container or replacing controller methods.
    return new Proxy(this, {
      set(target, property, value) {
        if (value?.[computedValue]) {
          Object.defineProperty(target, property, { configurable: true, get: value.get });
          return true;
        }
        return Reflect.set(target, property, value);
      },
    });
  }

  $computed(get: () => any) {
    return { [computedValue]: true, get };
  }

  $watch(source: () => any, callback: (...args: any[]) => any) {
    this.watchers.push({ source, callback });
  }

  $controllerMounted(callback: () => void) {
    this.mountedCallbacks.push(callback);
  }

  $useForm(options: any) {
    return new FormApi(options);
  }
}

const fieldTypes = ts.transpileModule(
  readFileSync(new URL('../../src/types/formField.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const { constFieldProps, constFieldBindingSlot } = new Function(
  'exports',
  `${fieldTypes}\nreturn exports;`,
)({});
const commonBindings = {
  markRaw: (value: unknown) => value,
  useSelector: (store: any, selector: (state: any) => any) => ({
    [computedValue]: true,
    get: () => selector(store.state),
  }),
  isNil: (value: unknown) => value === undefined || value === null,
  schemaRefreshFingerprint,
  constFieldProps,
  constFieldBindingSlot,
};

const ZFormField = {};
const ControllerFormFieldInput = evaluateClass(
  '../../../../../../suite/cabloy-basic/modules/basic-input/src/component/formFieldInput/controller.tsx',
  'ControllerFormFieldInput',
  {
    BeanControllerBase: ControllerBase,
    constFieldBindingSlot,
    ZFormField,
    classes: (...values: unknown[]) => values.filter(Boolean).join(' '),
    createElement: (type: unknown, props: any) => ({ type, props }),
  },
  ts.JsxEmit.React,
);

function inputBindingProps(props: any = {}) {
  const input = new ControllerFormFieldInput();
  input.$props = props;
  const rendered = input.render();
  assert.equal(rendered.type, ZFormField);
  assert.equal(rendered.props[constFieldBindingSlot], true);
  return rendered.props;
}

const ControllerForm = evaluateClass('../../src/component/form/controller.tsx', 'ControllerForm', {
  ...commonBindings,
  BeanControllerFormBase: ControllerBase,
  createSchemaRefreshContract,
  SchemaRefreshTracker,
  nextTick,
  revalidateLogic,
  getBy,
  ZodMetadata: { getFieldSchema: (schema: any, name: string) => schema?.shape[name] },
  deepEqual: (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b),
  deepExtend: Object.assign,
  celEnvBase: { clone: () => ({ registerFunction() {} }) },
  ZovaJsx: class {},
  objectAssignReactive: Object.assign,
  isJsxComponent: (value: any) => value?.$$typeof === 'zova-jsx:component',
  cast: (value: unknown) => value,
});

interface Event {
  kind: string;
  value?: unknown;
  options?: any;
  validators?: any;
  meta?: any;
}

function schema(locale = 'en-us', overrides: Record<string, unknown> = {}, root: any = {}) {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: locale === 'en-us' ? 'Name' : '姓名',
        minLength: 3,
        errorMessage: { minLength: locale === 'en-us' ? 'Too short' : '太短' },
        ...overrides,
      },
    },
    ...root,
  };
}

function sdk(locale: string) {
  const validators = new WeakMap<object, any>();
  return {
    selector: locale,
    loadSchemaProperties(value: any) {
      return (
        value &&
        Object.entries(value.properties).map(([key, field]) => ({ key, ...(field as any) }))
      );
    },
    getSchema: () => ({ data: undefined }),
    schemaToZodSchema(value: any) {
      if (!validators.has(value)) {
        const field = value.properties.name;
        let name: any = z.string().min(field.minLength, field.errorMessage.minLength);
        if (!value.required?.includes('name')) name = name.optional();
        validators.set(value, z.object({ name }));
      }
      return validators.get(value);
    },
  };
}

async function createRuntime(options: { data?: any; schema?: any; policy?: boolean } = {}) {
  const events: Event[] = [];
  const changed: any[] = [];
  const form = new ControllerForm();
  form.app = { meta: { locale: { current: 'en-us' } } };
  form.$props = {
    ...ControllerForm.$propsDefault,
    data: options.data ?? { name: 'baseline' },
    schema: options.schema ?? schema(),
    localePresentationRefresh:
      options.policy === false ? undefined : { identity: 'student:edit:1' },
    onChanged: (data: any) => changed.push(structuredClone(data)),
  };
  form.$$scopeOpenapi = { config: { formProvider: {} } };
  form.$sdk = sdk('en-us');
  await form.__init__();
  const unmountForm = form.form.mount();
  const actualResetField = form.form.resetField;
  form.form.resetField = (name: string) => {
    events.push({ kind: 'reset', value: form.form.getFieldValue(name) });
    return actualResetField(name);
  };
  const actualSet = form.form.setFieldValue;
  form.form.setFieldValue = (name: string, value: any, opts: any) => {
    events.push({ kind: 'set', value, options: opts });
    return actualSet(name, value, opts);
  };
  const fields: any[] = [];
  const cleanups: (() => void)[] = [];
  const createdOptions: any[] = [];
  let mountingApi = false;
  const ControllerFormField = evaluateClass(
    '../../src/component/formField/controller.tsx',
    'ControllerFormField',
    {
      ...commonBindings,
      BeanControllerBase: ControllerBase,
      useField(fieldOptions: any) {
        createdOptions.push(fieldOptions);
        const api: any = new FieldApi(fieldOptions);
        const actualUpdate = api.update;
        api.update = (next: any) => {
          if (!mountingApi) events.push({ kind: 'update', validators: next.validators });
          return actualUpdate(next);
        };
        const actualValidateSync = api.validateSync;
        api.validateSync = (...args: any[]) => {
          events.push({ kind: 'validate', validators: api.options.validators });
          return actualValidateSync(...args);
        };
        return { api };
      },
    },
  );
  const ready = (field: any) => {
    events.push({
      kind: 'ready',
      value: form.form.getFieldValue(field.name),
      meta: structuredClone(field.field.api.state.meta),
    });
  };
  return {
    form,
    events,
    changed,
    createdOptions,
    ready,
    select(locale: string, next = schema(locale)) {
      form.app.meta.locale.current = locale;
      form.$sdk = sdk(locale);
      form.$props.schema = next;
    },
    beginField(props: any = {}, behaviorWait: Promise<void> = Promise.resolve()) {
      const field = new ControllerFormField();
      field.$$form = form;
      field.$props = {
        name: 'name',
        validators: { onChange: true },
        [constFieldProps]: true,
        onFieldStateReady: ready,
        ...props,
      };
      field.$$beanBehaviorsHolder = {
        async initialize(options: any) {
          options.behaviors();
          await behaviorWait;
        },
      };
      fields.push(field);
      const initialized = field.__init__();
      let mounted = false;
      return {
        field,
        initialized,
        mount() {
          assert.equal(mounted, false);
          mounted = true;
          // FieldApi.mount internally updates its provisional options; only log
          // controller-originated updates in the refresh ordering assertions.
          mountingApi = true;
          try {
            cleanups.push(field.field.api.mount());
          } finally {
            mountingApi = false;
          }
          for (const callback of field.mountedCallbacks) callback();
        },
        refresh() {
          // Drive the registered post-flush watcher, not a replacement algorithm.
          field.watchers[0].callback();
        },
        dispose() {
          field.__dispose__();
          if (mounted) cleanups.pop()?.();
        },
      };
    },
    dispose() {
      for (const field of fields) field.__dispose__();
      for (const cleanup of cleanups.reverse()) cleanup();
      form.__dispose__();
      unmountForm();
    },
  };
}

async function withRuntime(
  options: Parameters<typeof createRuntime>[0],
  run: (runtime: Awaited<ReturnType<typeof createRuntime>>) => Promise<void>,
) {
  const environment = process.env as Record<string, string | undefined>;
  const previousClient = environment.CLIENT;
  environment.CLIENT = 'true';
  const runtime = await createRuntime(options);
  try {
    await run(runtime);
  } finally {
    runtime.dispose();
    if (previousClient === undefined) delete environment.CLIENT;
    else environment.CLIENT = previousClient;
  }
}

async function initializedField(runtime: Awaited<ReturnType<typeof createRuntime>>, props = {}) {
  const owner = runtime.beginField(props);
  owner.mount();
  await owner.initialized;
  runtime.events.length = 0;
  return owner;
}

function dirty(runtime: Awaited<ReturnType<typeof createRuntime>>, value: unknown) {
  runtime.form.form.setFieldValue('name', value, { dontValidate: true });
  runtime.form.form.setFieldMeta('name', (previous: any) => ({
    ...previous,
    isTouched: true,
    isBlurred: true,
    errorMap: { onServer: 'stale server error' },
    errorSourceMap: { onServer: 'form' },
  }));
  runtime.events.length = 0;
}

function lifecycle(events: Event[]) {
  return events.filter(event => event.kind !== 'set').map(event => event.kind);
}

function eventIndex(events: Event[], kind: string, after = -1): number {
  return events.findIndex((event, index) => index > after && event.kind === kind);
}

function eventAt(events: Event[], index: number): Event {
  return events.at(index)!;
}

function lastEvent(events: Event[]): Event {
  return eventAt(events, -1);
}

function assertResetMeta(meta: any) {
  assert.equal(meta.isTouched, false);
  assert.equal(meta.isBlurred, false);
  assert.equal(meta.errorMap.onServer, undefined);
  assert.equal(meta.errorSourceMap.onServer, undefined);
}

test(
  'locale refresh executes update, reset, silent live restore, fresh validation, then ready',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const owner = await initializedField(runtime);
      dirty(runtime, 'x');
      owner.field.field.api.validateSync('change', {});
      assert.equal(owner.field.field.api.state.meta.errors[0].message, 'Too short');
      const oldValidator = owner.field.field.api.options.validators.onChange;
      runtime.events.length = 0;
      runtime.select('zh-cn');
      owner.refresh();
      assert.deepEqual(
        runtime.events.map(event => event.kind),
        ['update', 'reset', 'set', 'validate', 'ready'],
      );
      assert.notEqual(runtime.events[0].validators.onChange, oldValidator);
      assert.equal(runtime.events[0].validators.onChange, runtime.form.getFieldZodSchema('name'));
      const restore = runtime.events[2];
      assert.equal(restore.value, 'x');
      assert.deepEqual(restore.options, {
        dontUpdateMeta: true,
        dontRunListeners: true,
        dontValidate: true,
      });
      const ready = lastEvent(runtime.events);
      assert.equal(ready.value, 'x');
      assertResetMeta(ready.meta);
      assert.equal(ready.meta.errors[0].message, '太短');
      assert.equal(ready.meta.errorSourceMap.onChange, 'field');
      assert.deepEqual(runtime.changed, []);
      runtime.events.length = 0;
      owner.refresh();
      assert.deepEqual(runtime.events, []);
    });
  },
);

test(
  'Start edit layout locale refresh preserves recovered input while localized custom options reset',
  { concurrency: false },
  async () => {
    const nestedEffect = () => {};
    const studentSchema = (locale: string) => {
      const title = locale === 'en-us' ? 'Training Records' : '培训记录';
      const result: any = schema(
        locale,
        {},
        {
          rest: {
            blocks: [
              {
                render: 'start-pageentry:blockPageEntry',
                options: {
                  blocks: [
                    {
                      render: 'start-pageentry:blockForm',
                      options: {
                        blocks: [
                          {
                            render: 'start-form:blockFormLayout',
                            options: {
                              formLayout: {
                                children: [
                                  {
                                    type: 'tabs',
                                    children: [
                                      {
                                        type: 'tab',
                                        title,
                                        children: [{ type: 'field', name: 'name' }],
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      render: 'start-pageentry:blockToolbarRow',
                      options: {
                        actions: [
                          {
                            render: 'start-form:actionSubmit',
                            options: { permission: { actionInherit: 'update' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      );
      result.properties.level = {
        type: 'number',
        rest: {
          form: {
            render: 'training-student:formFieldLevel',
            options: { items: [{ value: 1, title }] },
          },
        },
      };
      result.properties.trainingRecords = {
        type: 'array',
        rest: { form: { render: 'start-details:formFieldDetails' } },
        items: {
          type: 'object',
          properties: {
            subject: { type: 'string', rest: { onEffect: nestedEffect } },
          },
        },
      };
      return result;
    };
    await withRuntime(
      { data: { name: 'baseline', level: 1 }, schema: studentSchema('en-us') },
      async runtime => {
        const name = await initializedField(runtime, inputBindingProps());
        const level = await initializedField(runtime, {
          name: 'level',
          slotDefault: () => 'custom level options',
        });
        runtime.form.reset(
          { name: 'recovered unsaved name', level: 2 },
          { keepDefaultValues: true },
        );
        // Establish the post-recovery epoch before switching locales, like mounted fields do.
        name.refresh();
        level.refresh();
        for (const locale of ['zh-cn', 'en-us']) {
          runtime.form.form.setFieldValue('level', 2, { dontValidate: true });
          runtime.events.length = 0;
          runtime.select(locale, studentSchema(locale));
          name.refresh();
          level.refresh();
          assert.equal(runtime.form.form.getFieldValue('name'), 'recovered unsaved name');
          assert.equal(runtime.form.form.getFieldValue('level'), 1);
          assert.deepEqual(runtime.changed, []);
        }
      },
    );
  },
);

test(
  'locale replay preserves exact raw empty and falsy values',
  { concurrency: false },
  async () => {
    for (const value of [undefined, null, '', false, 0]) {
      await withRuntime({}, async runtime => {
        const owner = await initializedField(runtime);
        dirty(runtime, value);
        runtime.select('zh-cn');
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'validate', 'ready']);
        assert.equal(runtime.form.form.getFieldValue('name'), value);
        assert.equal(lastEvent(runtime.events).value, value);
        assert.deepEqual(runtime.changed, []);
      });
    }
  },
);

test(
  'controller silent setter skips onChanged while ordinary setter and ready overrides remain active',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const notifications: unknown[] = [];
      const ready = (field: any) => notifications.push(field.form.getFieldValue(field.name));
      const owner = await initializedField(runtime, { onFieldStateReady: ready });
      assert.deepEqual(notifications, ['baseline']);
      owner.field.setValue('silent edit', true);
      assert.deepEqual(runtime.changed, []);
      owner.field.setValue('notified edit', false);
      assert.deepEqual(runtime.changed, [{ name: 'notified edit' }]);
      runtime.events.length = 0;
      runtime.select('zh-cn');
      owner.refresh();
      assert.equal(owner.field.$props.onFieldStateReady, ready);
      assert.deepEqual(notifications, ['baseline', 'notified edit']);
      assert.deepEqual(runtime.changed, [{ name: 'notified edit' }]);
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'validate']);
    });
  },
);

test(
  'public consumeSchemaRefresh uses detached facts and cold contracts retain the baseline',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const { form } = runtime;
      assert.deepEqual(form.consumeSchemaRefresh('name', 'configuration', true), {
        changed: false,
        preserve: false,
      });
      assert.equal(form.hasSchemaRefresh('name'), true);
      runtime.select('zh-cn');
      form.$props.schema = undefined;
      assert.equal(form.schemaRefresh.contract.ready, false);
      assert.deepEqual(form.consumeSchemaRefresh('name', 'configuration', true), {
        changed: false,
        preserve: false,
      });
      form.$props.schema = schema('zh-cn');
      assert.deepEqual(form.consumeSchemaRefresh('name', 'configuration', true), {
        changed: true,
        preserve: true,
      });
      form.__dispose__();
      assert.equal(form.hasSchemaRefresh('name'), false);
    });
  },
);

test(
  'same-locale display metadata and constraint changes reset without replay',
  { concurrency: false },
  async () => {
    for (const next of [schema('en-us', { title: 'Renamed' }), schema('en-us', { minLength: 5 })]) {
      await withRuntime({}, async runtime => {
        const owner = await initializedField(runtime);
        dirty(runtime, 'live edit');
        runtime.form.$props.schema = next;
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
        assert.equal(
          runtime.events.some(event => event.kind === 'set'),
          false,
        );
        assert.equal(lastEvent(runtime.events).value, 'baseline');
        assertResetMeta(lastEvent(runtime.events).meta);
        assert.deepEqual(runtime.changed, []);
      });
    }
  },
);

test(
  'changed own renderer options reset even without an opaque slot',
  { concurrency: false },
  async () => {
    const rest = (title: string) => ({
      render: {
        $$typeof: 'zova-jsx:component',
        type: 'training-student:formFieldLevel',
        props: { items: [{ value: 1, title }] },
      },
    });
    await withRuntime({ schema: schema('en-us', { rest: rest('Foundation') }) }, async runtime => {
      const owner = await initializedField(runtime);
      dirty(runtime, 'live edit');
      runtime.select('zh-cn', schema('zh-cn', { rest: rest('基础') }));
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
      assert.equal(runtime.form.form.getFieldValue('name'), 'baseline');
      assert.equal(
        runtime.events.some(event => event.kind === 'set'),
        false,
      );
      assert.deepEqual(runtime.changed, []);
    });
  },
);

test(
  'parent required changes reset even when canonical field metadata is identical',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const owner = await initializedField(runtime);
      const property = runtime.form.getFieldProperty('name');
      dirty(runtime, 'live edit');
      runtime.form.$props.schema = schema('en-us', {}, { required: ['name'] });
      assert.deepEqual(runtime.form.getFieldProperty('name'), property);
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
      assert.equal(lastEvent(runtime.events).value, 'baseline');
    });
  },
);

test(
  'cold schema skips refresh and ready until current SDK and schema are available',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const owner = await initializedField(runtime);
      dirty(runtime, 'live edit');
      runtime.form.app.meta.locale.current = 'zh-cn';
      runtime.form.$props.schema = undefined;
      owner.refresh();
      assert.deepEqual(runtime.events, []);
      assert.equal(runtime.form.form.getFieldValue('name'), 'live edit');
      runtime.form.$props.schema = schema('zh-cn');
      owner.refresh();
      assert.equal(runtime.form.schemaRefresh.contract.ready, false);
      assert.deepEqual(runtime.events, []);
      runtime.form.$sdk = sdk('zh-cn');
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'validate', 'ready']);
      assert.equal(lastEvent(runtime.events).value, 'live edit');
    });
  },
);

test(
  'remount omits provisional default, waits for behaviors and TanStack mount, and replays exact null/undefined',
  { concurrency: false },
  async () => {
    for (const value of [undefined, null]) {
      for (const mountBeforeBehaviors of [true, false]) {
        await withRuntime(
          { schema: schema('en-us', { default: 'schema default' }) },
          async runtime => {
            const original = await initializedField(runtime);
            // Untouched state is important: TanStack update/mount otherwise does not seed defaults.
            runtime.form.form.setFieldValue('name', value, {
              dontUpdateMeta: true,
              dontValidate: true,
              dontRunListeners: true,
            });
            original.dispose();
            runtime.form.app.meta.locale.current = 'zh-cn';
            runtime.form.$props.schema = undefined;
            const wait = deferred();
            const remount = runtime.beginField({}, wait.promise);
            assert.equal(Object.hasOwn(runtime.createdOptions.at(-1), 'defaultValue'), false);
            assert.equal(runtime.form.form.getFieldValue('name'), value);
            runtime.events.length = 0;
            remount.refresh();
            assert.deepEqual(runtime.events, []);
            runtime.select('zh-cn', schema('zh-cn', { default: 'schema default' }));
            if (mountBeforeBehaviors) remount.mount();
            remount.refresh();
            assert.deepEqual(runtime.events, []);
            assert.equal(runtime.form.form.getFieldValue('name'), value);
            wait.resolve();
            await remount.initialized;
            if (!mountBeforeBehaviors) {
              assert.deepEqual(runtime.events, []);
              assert.equal(runtime.form.form.getFieldValue('name'), value);
              remount.mount();
            }
            assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'validate', 'ready']);
            const resetIndex = eventIndex(runtime.events, 'reset');
            const restoreIndex = eventIndex(runtime.events, 'set', resetIndex);
            assert.ok(resetIndex > eventIndex(runtime.events, 'update'));
            assert.ok(restoreIndex > resetIndex);
            assert.equal(eventAt(runtime.events, restoreIndex).value, value);
            assert.deepEqual(eventAt(runtime.events, restoreIndex).options, {
              dontUpdateMeta: true,
              dontRunListeners: true,
              dontValidate: true,
            });
            assert.equal(runtime.form.form.getFieldValue('name'), value);
            assert.equal(lastEvent(runtime.events).value, value);
            assertResetMeta(lastEvent(runtime.events).meta);
            assert.deepEqual(runtime.changed, []);
          },
        );
      }
    }
  },
);

test(
  'reset epoch prevents locale replay even when the reset value is subsequently edited',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const owner = await initializedField(runtime);
      runtime.form.reset({ name: 'reset baseline' });
      dirty(runtime, 'edit after reset');
      runtime.select('zh-cn');
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
      assert.equal(lastEvent(runtime.events).value, 'reset baseline');
      assert.equal(
        runtime.events.some(event => event.kind === 'set'),
        false,
      );
    });
  },
);

test(
  'record, scene, disabled policy and custom Zod truth do not authorize replay',
  { concurrency: false },
  async () => {
    for (const change of [
      (form: any) => {
        form.$props.localePresentationRefresh = { identity: 'student:edit:2' };
      },
      (form: any) => {
        form.$props.schemaScene = 'form-view';
      },
      (form: any) => {
        form.$props.localePresentationRefresh = undefined;
      },
      (form: any) => {
        form.$props.zodSchema = z.object({ name: z.string() });
      },
    ]) {
      await withRuntime({}, async runtime => {
        const owner = await initializedField(runtime);
        dirty(runtime, 'live edit');
        runtime.select('zh-cn');
        change(runtime.form);
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
        assert.equal(lastEvent(runtime.events).value, 'baseline');
        assert.deepEqual(runtime.changed, []);
      });
    }
  },
);

test(
  'disabled policy from initial render still refreshes metadata without replay',
  { concurrency: false },
  async () => {
    await withRuntime({ policy: false }, async runtime => {
      const owner = await initializedField(runtime);
      dirty(runtime, 'live edit');
      runtime.select('zh-cn');
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
      assert.equal(lastEvent(runtime.events).value, 'baseline');
    });
  },
);

test(
  'callback validator and sys overrides survive reset and are not replay-eligible',
  { concurrency: false },
  async () => {
    const callback = () => 'custom validation';
    for (const props of [
      { validators: { onChange: callback } },
      { sys: { defaultValue: 'custom default', validators: { onChange: callback } } },
    ]) {
      await withRuntime({}, async runtime => {
        const owner = await initializedField(runtime, props);
        assert.equal(owner.field.field.api.options.validators.onChange, callback);
        dirty(runtime, 'live edit');
        runtime.select('zh-cn');
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
        assert.equal(owner.field.field.api.options.validators.onChange, callback);
        assert.equal(runtime.events[0].validators.onChange, callback);
        assert.equal(lastEvent(runtime.events).value, props.sys?.defaultValue ?? 'baseline');
        assertResetMeta(lastEvent(runtime.events).meta);
      });
    }
  },
);

test(
  'behavior/effect/slot customizations preserve callbacks while disabling automatic replay',
  { concurrency: false },
  async () => {
    for (const props of [{ behaviors: {} }, { onEffect() {} }, { slotDefault() {} }]) {
      await withRuntime({}, async runtime => {
        const owner = await initializedField(runtime, props);
        dirty(runtime, 'live edit');
        runtime.select('zh-cn');
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
        for (const [key, value] of Object.entries(props))
          assert.equal(owner.field.$props[key], value);
        assert.equal(lastEvent(runtime.events).value, 'baseline');
      });
    }
  },
);

test(
  'replacing inline slot and ready callbacks does not reset; schema changes use the latest ready callback',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      runtime.form.$$scopeOpenapi.config.formProvider = {
        components: { Input: 'basic-input:formFieldInput' },
      };
      const before: unknown[] = [];
      const after: unknown[] = [];
      const owner = await initializedField(runtime, {
        [constFieldBindingSlot]: true,
        slotDefault: () => 'initial slot',
        onFieldStateReady: (field: any) => before.push(field.form.getFieldValue(field.name)),
      });
      assert.deepEqual(before, ['baseline']);
      dirty(runtime, 'typed name');
      owner.field.$props.slotDefault = () => 'replacement slot';
      owner.field.$props.onFieldStateReady = (field: any) =>
        after.push(field.form.getFieldValue(field.name));
      owner.refresh();
      assert.deepEqual(runtime.events, []);
      assert.equal(runtime.form.form.getFieldValue('name'), 'typed name');
      assert.deepEqual(after, []);
      runtime.select('zh-cn');
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'validate']);
      assert.deepEqual(before, ['baseline']);
      assert.deepEqual(after, ['typed name']);
      assert.deepEqual(runtime.changed, []);
    });
  },
);

test(
  'explicit renderer-owned binding slots preserve live names independently of component selectors',
  { concurrency: false },
  async () => {
    for (const selector of ['basic-input:formFieldInput', 'start-input:formFieldInput']) {
      for (const render of [
        undefined,
        'Input',
        selector,
        { $$typeof: 'zova-jsx:component', type: selector },
      ]) {
        await withRuntime({}, async runtime => {
          runtime.form.$$scopeOpenapi.config.formProvider = {
            components: { Input: selector },
          };
          const owner = await initializedField(runtime, inputBindingProps({ render }));
          dirty(runtime, 'typed name');
          runtime.select('zh-cn');
          owner.refresh();
          assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'validate', 'ready']);
          assert.equal(lastEvent(runtime.events).value, 'typed name');
          assertResetMeta(lastEvent(runtime.events).meta);
          assert.deepEqual(runtime.changed, []);
        });
      }
    }
  },
);

test(
  'manual Basic input and canonical custom provider slots remain replay-ineligible',
  { concurrency: false },
  async () => {
    for (const props of [
      inputBindingProps({ [constFieldProps]: false, render: 'basic-input:formFieldInput' }),
      { render: 'basic-input:formFieldInput' },
      { render: 'custom:formFieldInput' },
      { render: 'Input' },
      {},
      { [constFieldBindingSlot]: false },
      { [constFieldBindingSlot]: 'true' },
    ]) {
      await withRuntime({}, async runtime => {
        runtime.form.$$scopeOpenapi.config.formProvider = {
          components: { Input: 'custom:formFieldInput' },
        };
        const owner = await initializedField(runtime, {
          ...props,
          slotDefault: () => 'custom slot',
        });
        dirty(runtime, 'typed name');
        runtime.select('zh-cn');
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
        assert.equal(lastEvent(runtime.events).value, 'baseline');
        assert.deepEqual(runtime.changed, []);
      });
    }
  },
);

test('the input wrapper owns its marker and value/blur binding slot', () => {
  const externalSlot = () => 'external slot';
  const props = inputBindingProps({
    name: 'name',
    [constFieldBindingSlot]: false,
    slotDefault: externalSlot,
  });
  assert.equal(props.name, 'name');
  assert.notEqual(props.slotDefault, externalSlot);
  const writes: unknown[] = [];
  let blurred = false;
  const input = props.slotDefault(
    { propsBucket: { value: 'current', disableNotifyChanged: true }, props: {} },
    {
      setValue: (...args: unknown[]) => writes.push(args),
      handleBlur: () => {
        blurred = true;
      },
    },
  );
  assert.equal(input.type, 'input');
  assert.equal(input.props.value, 'current');
  input.props.onInput({ target: { value: 'edited' } });
  input.props.onBlur();
  assert.deepEqual(writes, [['edited', true]]);
  assert.equal(blurred, true);
});

test(
  'a missing Input provider does not authorize an unmarked slot',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const owner = await initializedField(runtime, { slotDefault: () => 'custom slot' });
      dirty(runtime, 'typed name');
      runtime.select('zh-cn');
      owner.refresh();
      assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
      assert.equal(lastEvent(runtime.events).value, 'baseline');
    });
  },
);

test(
  'binding-slot ownership changes invalidate the prior refresh configuration',
  { concurrency: false },
  async () => {
    for (const initiallyOwned of [false, true]) {
      await withRuntime({}, async runtime => {
        const owner = await initializedField(runtime, {
          [constFieldBindingSlot]: initiallyOwned,
          slotDefault: () => 'slot',
        });
        dirty(runtime, 'typed name');
        owner.field.$props[constFieldBindingSlot] = !initiallyOwned;
        owner.refresh();
        assert.deepEqual(lifecycle(runtime.events), ['update', 'reset', 'ready']);
        assert.equal(lastEvent(runtime.events).value, 'baseline');
      });
    }
  },
);

test(
  'disposal during awaited behavior initialization suppresses refresh and ready callbacks',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const wait = deferred();
      const owner = runtime.beginField({}, wait.promise);
      owner.mount();
      owner.dispose();
      runtime.events.length = 0;
      runtime.select('zh-cn');
      wait.resolve();
      await owner.initialized;
      owner.refresh();
      assert.deepEqual(runtime.events, []);
      assert.equal(runtime.form.hasSchemaRefresh('name'), false);
    });
  },
);

test(
  'schema completion callback coalesces after ready and reads current values without onChanged',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const notifications: unknown[] = [];
      runtime.form.$props.onSchemaRefreshed = (values: any) =>
        notifications.push(structuredClone(values));
      const owner = await initializedField(runtime);
      dirty(runtime, 'live edit');
      runtime.select('zh-cn');
      owner.refresh();
      assert.deepEqual(notifications, []);
      assert.equal(lastEvent(runtime.events).kind, 'ready');
      await nextTick();
      assert.deepEqual(notifications, [{ name: 'live edit' }]);
      notifications.length = 0;
      runtime.form.schemaFieldRefreshed();
      runtime.form.schemaFieldRefreshed();
      runtime.form.form.setFieldValue('name', 'latest edit', {
        dontUpdateMeta: true,
        dontRunListeners: true,
        dontValidate: true,
      });
      await nextTick();
      assert.deepEqual(notifications, [{ name: 'latest edit' }]);
      assert.deepEqual(runtime.changed, []);
    });
  },
);

test(
  'queued schema completion is suppressed by reset, locale drift, cold truth, and disposal',
  { concurrency: false },
  async () => {
    for (const invalidate of [
      (runtime: any) => runtime.form.reset({ name: 'reset' }),
      (runtime: any) => {
        runtime.form.app.meta.locale.current = 'fr-fr';
      },
      (runtime: any) => {
        runtime.form.$props.schema = undefined;
      },
      (runtime: any) => runtime.form.__dispose__(),
    ]) {
      await withRuntime({}, async runtime => {
        const notifications: unknown[] = [];
        runtime.form.$props.onSchemaRefreshed = (values: any) => notifications.push(values);
        const owner = await initializedField(runtime);
        runtime.select('zh-cn');
        owner.refresh();
        invalidate(runtime);
        await nextTick();
        assert.deepEqual(notifications, []);
        assert.deepEqual(runtime.changed, []);
      });
    }
  },
);

test(
  'queued schema completion is invalidated by record identity drift',
  { concurrency: false },
  async () => {
    await withRuntime({}, async runtime => {
      const notifications: unknown[] = [];
      runtime.form.$props.onSchemaRefreshed = (values: any) => notifications.push(values);
      const owner = await initializedField(runtime);
      runtime.select('zh-cn');
      owner.refresh();
      runtime.form.$props.localePresentationRefresh = { identity: 'student:edit:2' };
      await nextTick();
      assert.deepEqual(notifications, []);
    });
  },
);

test('queued schema completion is invalidated by scene drift', { concurrency: false }, async () => {
  await withRuntime({}, async runtime => {
    const notifications: unknown[] = [];
    runtime.form.$props.onSchemaRefreshed = (values: any) => notifications.push(values);
    const owner = await initializedField(runtime);
    runtime.select('zh-cn');
    owner.refresh();
    runtime.form.$props.schemaScene = 'form-view';
    await nextTick();
    assert.deepEqual(notifications, []);
  });
});

test(
  'a-openapi monkey suppresses obsolete rapid SDK selection completions',
  { concurrency: false },
  async () => {
    const selections: { locale: string; result: ReturnType<typeof deferred<any>> }[] = [];
    const watchers: (() => Promise<void>)[] = [];
    class BeanSimple {
      app = {
        meta: { locale: { current: 'en-us' } },
        bean: {
          _getBeanSelector(name: string, cached: boolean, locale: string) {
            assert.equal(name, 'a-openapi.model.sdk');
            assert.equal(cached, true);
            const result = deferred<any>();
            selections.push({ locale, result });
            return result.promise;
          },
        },
      };

      ctx = { util: { instanceScope: (run: () => void) => run() } };
    }
    const Monkey = evaluateClass('../../../a-openapi/src/monkey.ts', 'Monkey', {
      BeanSimple,
      ref,
      watch: (_source: () => string, callback: () => Promise<void>) => watchers.push(callback),
    });
    const monkey = new Monkey();
    const consumer: any = {};
    await monkey.beanInit({ defineProperty: Object.defineProperty }, consumer);
    const initialize = monkey.appInitialize();
    const english = { selector: 'en-us' };
    selections[0].result.resolve(english);
    await initialize;
    assert.equal(toRaw(consumer.$sdk.value), english);
    assert.equal(watchers.length, 1);

    monkey.app.meta.locale.current = 'zh-cn';
    const first = watchers[0]();
    monkey.app.meta.locale.current = 'fr-fr';
    const second = watchers[0]();
    const french = { selector: 'fr-fr' };
    selections[2].result.resolve(french);
    await second;
    selections[1].result.resolve({ selector: 'zh-cn' });
    await first;
    assert.equal(toRaw(consumer.$sdk.value), french);

    // Returning to the same locale must not resurrect an earlier generation.
    monkey.app.meta.locale.current = 'en-us';
    const third = watchers[0]();
    monkey.app.meta.locale.current = 'zh-cn';
    const fourth = watchers[0]();
    monkey.app.meta.locale.current = 'en-us';
    const fifth = watchers[0]();
    selections[3].result.resolve({ selector: 'en-us', obsolete: true });
    await third;
    assert.equal(toRaw(consumer.$sdk.value), french);
    const latest = { selector: 'en-us', latest: true };
    selections[5].result.resolve(latest);
    await fifth;
    selections[4].result.resolve({ selector: 'zh-cn' });
    await fourth;
    assert.equal(toRaw(consumer.$sdk.value), latest);
    assert.deepEqual(
      selections.map(item => item.locale),
      ['en-us', 'zh-cn', 'fr-fr', 'en-us', 'zh-cn', 'en-us'],
    );
  },
);
