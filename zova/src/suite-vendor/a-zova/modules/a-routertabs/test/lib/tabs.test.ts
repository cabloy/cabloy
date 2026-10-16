import { extend } from '@cabloy/extend';
import { dehydrate, QueryClient, QueryObserver } from '@tanstack/query-core';
import localforage from 'localforage';
import { mutate } from 'mutate-on-copy';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { computed, customRef, effectScope, markRaw, reactive, shallowReactive, watch } from 'vue';
import { SymbolBeanFullName } from 'zova';

import { BeanModelUseState } from '../../../a-model/src/bean/bean.model/bean.model.useState.js';
import { ModelPersistenceContext } from '../../../a-model/src/lib/modelPersistence.js';

// Only imports/decorators are removed; every tabs/state/persister method below is
// production code. Real Vue refs and QueryObservers model the reactive IoC owner.
const source = readFileSync(new URL('../../src/model/tabs.ts', import.meta.url), 'utf8')
  .replace(/^import[\s\S]*?;\n/gm, '')
  .replace(/^@Model[\s\S]+?^\}\)\n/gm, '');
const javascript = stripTypeScriptTypes(source).replace(
  'export class ModelTabs',
  'class ModelTabs',
);
const ModelTabs = new Function(
  'BeanModelBase',
  'deepExtend',
  'deepEqual',
  'mutate',
  'shallowReactive',
  'process',
  `${javascript}\nreturn ModelTabs;`,
)(
  BeanModelUseState,
  (...values: any[]) => extend(true, ...values),
  isDeepStrictEqual,
  mutate,
  shallowReactive,
  { env: { CLIENT: true } },
);

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 5));
const records = new Map<string, string>();
const barriers = new Map<string, ReturnType<typeof deferred<void>>>();
const reads: string[] = [];
const writes: string[] = [];
Object.assign(localforage, {
  async getItem(key: string) {
    reads.push(key);
    const value = records.get(key);
    await barriers.get(key)?.promise;
    return value;
  },
  async setItem(key: string, value: string) {
    writes.push(key);
    records.set(key, value);
  },
  async removeItem(key: string) {
    records.delete(key);
  },
});

function tab(key: string, dirty = false) {
  return {
    tabKey: key,
    info: { title: key },
    updatedAt: 1,
    items: [{ componentKey: key, fullPath: key, updatedAt: 1, pageMeta: { pageDirty: dirty } }],
  };
}
function route(key: string) {
  return { path: key, fullPath: key, meta: {} };
}
function fixture(cache = true) {
  records.clear();
  barriers.clear();
  reads.length = 0;
  writes.length = 0;
  const client = markRaw(new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } }));
  const persistence = new ModelPersistenceContext(client, 'site');
  const owner = effectScope();
  const ctx = reactive({ disposed: false });
  const errors: unknown[] = [];
  const navigations: string[] = [];
  const stops: (() => void)[] = [];
  let initialKey = '/initial';
  let defaults = 0;
  let hmr: (data: unknown, next: () => void) => void;
  let offHmr = 0;
  const model = reactive(new ModelTabs()) as any;
  const properties: PropertyDescriptorMap = {
    ctx: { value: ctx },
    bean: {
      get() {
        assert.equal(ctx.disposed, false, 'disposed container access');
        return { _setBean() {} };
      },
    },
    $queryClient: { value: client },
    $modelPersistence: {
      get() {
        assert.equal(ctx.disposed, false, 'disposed persistence lookup');
        return persistence;
      },
    },
    scopeSelf: {
      value: {
        config: {
          persister: { maxAge: { db: Infinity, local: Infinity }, refetchOnRestore: false },
        },
      },
    },
    sys: {
      value: {
        env: { APP_NAME: 'tabs-test', APP_VERSION: '1' },
        config: { ssr: { hmr: true } },
        meta: {
          event: {
            on(_name: string, fn: typeof hmr) {
              hmr = fn;
              return () => offHmr++;
            },
          },
        },
      },
    },
    app: { value: reactive({ meta: { locale: { current: 'en-us' } } }) },
    $router: {
      value: {
        getRealRouteName: () => undefined,
        push: async (path: string) => navigations.push(path),
        notifyRouteDiscard: () => undefined,
      },
    },
    $currentRoute: { value: undefined, writable: true },
    [SymbolBeanFullName]: { value: 'a-routertabs.model.tabs' },
  };
  for (const property of Reflect.ownKeys(properties)) properties[property].configurable = true;
  Object.defineProperties(model, properties);
  model.$computed = (value: any) => owner.run(() => computed(value));
  model.$customRef = (factory: any) => customRef(factory);
  model.$watch = (...args: any[]) => owner.run(() => (watch as any)(...args));
  model.$errorHandler = (error: unknown) => errors.push(error);
  model.$useQuery = (options: any) => {
    const observer = new QueryObserver(
      client,
      persistence.guardOptions({
        ...options,
        queryKey: model._forceQueryKeyPrefix(options.queryKey),
        persister: model._createPersister(options.meta?.persister),
      }),
    );
    const state = shallowReactive(observer.getCurrentResult());
    stops.push(observer.subscribe(result => Object.assign(state, result)));
    return {
      get data() {
        return state.data;
      },
      suspense: () => observer.refetch(),
    };
  };
  const options = {
    cache,
    max: -1,
    maxItems: -1,
    getInitialTabs() {
      defaults++;
      return [tab(initialKey)];
    },
    getTabInfo: (key: string) => ({ title: `${key}:${model.app.meta.locale.current}` }),
  };
  function key(user: string | null) {
    const options = model._adjustPersisterOptions();
    return model._getPersisterStorageKey(options, undefined, ['tabs'], {
      scope: [null, 'site', user],
      epoch: 0,
    });
  }
  function store(user: string | null, tabs: unknown) {
    records.set(
      key(user),
      JSON.stringify({ state: { data: tabs, dataUpdatedAt: Date.now() }, buster: '1' }),
    );
  }
  function block(user: string | null) {
    const pending = deferred();
    barriers.set(key(user), pending);
    return pending;
  }
  return {
    model,
    ctx,
    persistence,
    errors,
    navigations,
    client,
    key,
    store,
    block,
    init: () => model.__init__('test', options),
    defaults: () => defaults,
    setInitial: (key: string) => {
      initialKey = key;
    },
    reload: () => hmr?.(undefined, () => undefined),
    offHmr: () => offHmr,
    async dispose() {
      model.__dispose__();
      ctx.disposed = true;
      owner.stop();
      for (const pending of barriers.values()) pending.resolve();
      await tick();
      await model.$persisterFlush();
      for (const stop of stops) stop();
      client.clear();
    },
  };
}

test('cached tabs remain a writable current-scope array during a delayed identity restore', async () => {
  const f = fixture();
  try {
    f.store(null, [tab('/old')]);
    await f.init();
    assert.equal(f.model.findTab('/old')[0], 0);
    f.store('next', [tab('/saved')]);
    const stored = records.get(f.key('next'));
    const pending = f.block('next');
    f.persistence.update({ siteId: 'site', userId: 'next' });
    assert.deepEqual(
      f.model.tabs.map((item: any) => item.tabKey),
      [],
    );
    assert.deepEqual(f.model.keepAliveInclude, []);
    assert.deepEqual(f.model.findTab('/old'), [-1, undefined]);
    assert.deepEqual(f.model.findTabItemByFullPath('/old'), []);
    for (let i = 0; i < 3; i++) assert.deepEqual([...f.model.tabs], []);
    // Incidental mutations/assignments of the neutral projection cannot become
    // canonical query data or overwrite the destination while storage is pending.
    f.model.tabs.push(tab('/incidental'));
    assert.deepEqual(f.model.tabs, []);
    f.model.tabs = [];
    await tick();
    assert.equal(reads.filter(key => key === f.key('next')).length, 1);
    assert.equal(writes.length, 0);
    assert.equal(records.get(f.key('next')), stored);
    pending.resolve();
    await tick();
    assert.equal(f.model.findTab('/saved')[0], 0);
    assert.equal(f.model.findTab('/old')[0], -1);
    assert.equal(
      f.model.addTab({ tabKey: '/sync', componentKey: '/sync', fullPath: '/sync' }),
      true,
    );
    assert.notEqual(f.model.findTab('/sync')[0], -1);
    f.model.tabs = [tab('/replacement')];
    assert.equal(f.model.tabs[0].tabKey, '/replacement');
  } finally {
    await f.dispose();
  }
});

test('one restore boundary defers routes, page metadata, menu/locale/HMR and synchronous tab creation', async () => {
  const f = fixture();
  try {
    await f.init();
    f.store('next', [tab('/saved', true)]);
    const pending = f.block('next');
    f.persistence.update({ siteId: 'site', userId: 'next' });
    f.model.$currentRoute = route('/current');
    f.model.forwardRoute(route('/task'));
    f.model.setPageMeta(route('/task'), { pageTitle: 'Deferred title', pageDirty: true });
    f.model.updateAllTabInfos();
    f.model.app.meta.locale.current = 'zh-cn';
    f.reload();
    const result = f.model.addTab({ tabKey: '/sync', componentKey: '/sync', fullPath: '/sync' });
    assert.equal(typeof result, 'boolean');
    assert.deepEqual(f.model.tabs, []);
    await tick();
    assert.equal(writes.length, 0);
    pending.resolve();
    await tick();
    assert.notEqual(f.model.findTab('/saved')[0], -1);
    assert.equal(f.model.findTab('/saved')[1].items[0].pageMeta.pageDirty, false);
    assert.notEqual(f.model.findTab('/current')[0], -1);
    assert.notEqual(f.model.findTab('/sync')[0], -1);
    assert.equal(f.model.findTab('/task')[1].items[0].pageMeta.pageTitle, 'Deferred title');
    assert.equal(f.model.findTab('/task')[1].info.title, '/task:zh-cn');
    assert.equal(reads.filter(key => key === f.key('next')).length, 1);
  } finally {
    await f.dispose();
  }
});

test('obsolete epochs never replay deferred work or current-route initialization into the destination', async () => {
  const f = fixture();
  try {
    await f.init();
    const old = f.block('old');
    f.persistence.update({ siteId: 'site', userId: 'old' });
    f.model.$currentRoute = route('/old-current');
    f.model.forwardRoute(route('/obsolete'));
    f.model.resetAllTabInfos();
    f.model.backRoute(route('/keep'));
    const latest = f.block('latest');
    f.store('latest', [tab('/keep')]);
    f.persistence.update({ siteId: 'site', userId: 'latest' });
    f.model.$currentRoute = route('/latest-current');
    f.model.forwardRoute(route('/latest'));
    latest.resolve();
    await tick();
    old.resolve();
    await tick();
    assert.equal(f.model.findTab('/obsolete')[0], -1);
    assert.equal(f.model.findTab('/old-current')[0], -1);
    assert.notEqual(f.model.findTab('/keep')[0], -1);
    assert.notEqual(f.model.findTab('/latest')[0], -1);
    assert.notEqual(f.model.findTab('/latest-current')[0], -1);
    assert.deepEqual(f.errors, []);
  } finally {
    await f.dispose();
  }
});

test('initial restore uses a fresh default factory and initializes only the current live scope', async () => {
  const f = fixture();
  try {
    const pending = f.block(null);
    const init = f.init();
    await tick();
    assert.equal(f.defaults(), 0);
    f.setInitial('/fresh');
    f.model.$currentRoute = route('/current');
    pending.resolve();
    await init;
    assert.equal(
      f.model.tabs.some((item: any) => item.tabKey === '/fresh'),
      true,
    );
    assert.equal(f.defaults(), 1);
    assert.notEqual(f.model.findTab('/current')[0], -1);
    const next = f.block('next');
    f.persistence.update({ siteId: 'site', userId: 'next' });
    void f.model.tabs;
    f.setInitial('/new-scope');
    next.resolve();
    await tick();
    assert.notEqual(f.model.findTab('/new-scope')[0], -1);
    assert.equal(f.model.findTab('/fresh')[0], -1);
    assert.equal(f.defaults(), 2);
  } finally {
    await f.dispose();
  }
});

test('disposal during restore does not initialize routes, replay ingress or access disposed context', async () => {
  const f = fixture();
  try {
    await f.init();
    const pending = f.block('next');
    f.persistence.update({ siteId: 'site', userId: 'next' });
    f.model.forwardRoute(route('/late'));
    f.model.__dispose__();
    f.ctx.disposed = true;
    pending.resolve();
    await tick();
    assert.deepEqual(f.model.tabs, []);
    assert.deepEqual(f.errors, []);
    assert.equal(f.offHmr(), 1);
    assert.equal(writes.length, 0);
  } finally {
    await f.dispose();
  }
});

test('async close completion cannot navigate an old tab after an identity transition', async () => {
  const f = fixture();
  try {
    f.store(null, [tab('/first'), tab('/second')]);
    await f.init();
    f.model.tabKeyCurrent = '/first';
    const cleanup = deferred();
    f.model.$router.notifyRouteDiscard = () => cleanup.promise;
    const closing = f.model.deleteTab('/first');
    f.store('next', [tab('/second')]);
    f.persistence.update({ siteId: 'site', userId: 'next' });
    cleanup.resolve();
    await closing;
    assert.deepEqual(f.navigations, []);
  } finally {
    await f.dispose();
  }
});

test('switch-away/back drops obsolete work even when the destination identity tuple repeats', async () => {
  const f = fixture();
  try {
    await f.init();
    const old = f.block('same');
    f.store('same', [tab('/same-saved')]);
    f.persistence.update({ siteId: 'site', userId: 'same' });
    f.model.forwardRoute(route('/must-not-replay'));
    f.persistence.update({ siteId: 'site', userId: 'away' });
    const latest = f.block('same');
    f.persistence.update({ siteId: 'site', userId: 'same' });
    f.model.forwardRoute(route('/latest'));
    old.resolve();
    await tick();
    assert.deepEqual(f.model.tabs, []);
    latest.resolve();
    await tick();
    assert.equal(f.model.findTab('/must-not-replay')[0], -1);
    assert.notEqual(f.model.findTab('/same-saved')[0], -1);
    assert.notEqual(f.model.findTab('/latest')[0], -1);
  } finally {
    await f.dispose();
  }
});

test('initial scope supersession and full clear each initialize the current route once', async () => {
  const f = fixture();
  try {
    const old = f.block(null);
    const init = f.init();
    await tick();
    const originalForward = f.model.forwardRoute;
    const forwarded: string[] = [];
    f.model.forwardRoute = function (value: any) {
      forwarded.push(value.fullPath);
      return originalForward.call(this, value);
    };
    f.model.$currentRoute = route('/outgoing');
    const next = f.block('next');
    f.persistence.update({ siteId: 'site', userId: 'next' });
    f.model.$currentRoute = route('/current');
    next.resolve();
    await tick();
    old.resolve();
    await init;
    assert.deepEqual(forwarded, ['/current']);
    assert.equal(f.model.findTab('/outgoing')[0], -1);
    f.model.tabs = [tab('/discard-on-clear')];
    await f.model.$persisterFlush();
    const cleared = f.block('next');
    records.delete(f.key('next'));
    f.persistence.clear();
    assert.deepEqual(f.model.tabs, []);
    cleared.resolve();
    await tick();
    assert.deepEqual(forwarded, ['/current', '/current']);
    assert.equal(f.model.findTab('/discard-on-clear')[0], -1);
    assert.notEqual(f.model.findTab('/current')[0], -1);
  } finally {
    await f.dispose();
  }
});

test('disposal during the first restore never installs defaults, routes or listeners', async () => {
  const f = fixture();
  try {
    const pending = f.block(null);
    const init = f.init();
    await tick();
    f.model.$currentRoute = route('/late');
    f.model.forwardRoute(route('/late-ingress'));
    f.model.__dispose__();
    f.ctx.disposed = true;
    pending.resolve();
    await init;
    assert.deepEqual(f.model.tabs, []);
    assert.equal(f.defaults(), 0);
    assert.equal(f.offHmr(), 0);
    assert.deepEqual(f.errors, []);
  } finally {
    await f.dispose();
  }
});

test('memory-only tabs dehydrate into serializable SSR state including query metadata', async () => {
  // Use the serializer owned by a-ssr, just like the rendered state payload.
  const requireSsr = createRequire(new URL('../../../a-ssr/package.json', import.meta.url));
  const { uneval } = await import(pathToFileURL(requireSsr.resolve('devalue')).href);
  const f = fixture(false);
  try {
    f.model.$currentRoute = route('/current');
    await f.init();
    const state = dehydrate(f.client);
    const serialized = uneval({ query: state });
    assert.equal(typeof serialized, 'string');
    const tabs = state.queries.find(query => query.queryKey.at(-1) === 'tabs');
    assert.ok(tabs);
    assert.ok(Array.isArray(tabs.meta?.defaultData));
    assert.ok((tabs.state.data as any[]).some(item => item.tabKey === '/current'));
  } finally {
    await f.dispose();
  }
});

test('memory-only tabs preserve immediate initialization, writes and boolean addTab', async () => {
  const f = fixture(false);
  try {
    f.model.$currentRoute = route('/current');
    await f.init();
    assert.notEqual(f.model.findTab('/current')[0], -1);
    assert.equal(
      f.model.addTab({ tabKey: '/sync', componentKey: '/sync', fullPath: '/sync' }),
      true,
    );
    f.model.tabs = [tab('/assigned')];
    assert.equal(f.model.findTab('/assigned')[0], 0);
    assert.equal(reads.length, 0);
    assert.equal(writes.length, 0);
  } finally {
    await f.dispose();
  }
});
