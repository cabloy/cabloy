import { dehydrate, hydrate, QueryClient, QueryObserver } from '@tanstack/query-core';
import localforage from 'localforage';
import assert from 'node:assert/strict';
import test from 'node:test';
import { computed, markRaw, reactive, shallowReactive } from 'vue';
import { SymbolBeanFullName } from 'zova';

import { BeanModelUseState } from '../../src/bean/bean.model/bean.model.useState.ts';
import {
  getModelPersistenceStorageKey,
  ModelPersistenceContext,
} from '../../src/lib/modelPersistence.ts';
import { getPersistenceQueue } from '../../src/lib/persistenceQueue.ts';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 5));
const records = new Map<string, string>();
let readBarrier: ReturnType<typeof deferred<void>> | undefined;
let writeBarrier: ReturnType<typeof deferred<void>> | undefined;
const calls: string[] = [];
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => records.get(key),
    setItem: (key: string, value: string) => records.set(key, value),
    removeItem: (key: string) => records.delete(key),
  },
});
Object.assign(localforage, {
  async getItem(key: string) {
    calls.push(`get:${key}`);
    const value = records.get(key);
    await readBarrier?.promise;
    return value;
  },
  async setItem(key: string, value: string) {
    calls.push(`set:${key}`);
    await writeBarrier?.promise;
    records.set(key, value);
  },
  async removeItem(key: string) {
    calls.push(`remove:${key}`);
    records.delete(key);
  },
  async clear() {
    calls.push('clear');
    records.clear();
  },
});

function fixture(appName = 'app') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const persistence = new ModelPersistenceContext(client, 'site');
  const model = new BeanModelUseState() as any;
  const ctx = { disposed: false };
  Object.defineProperties(model, {
    ctx: { value: ctx },
    $queryClient: { value: client },
    $modelPersistence: { value: persistence },
    scopeSelf: {
      get() {
        assert.equal(ctx.disposed, false, 'disposed owner must not resolve persistence config');
        return {
          config: {
            persister: { maxAge: { db: Infinity, local: Infinity }, refetchOnRestore: false },
          },
        };
      },
    },
    sys: { value: { env: { APP_NAME: appName, APP_VERSION: '1' } } },
    [SymbolBeanFullName]: { value: 'test.model.example' },
  });
  function observer(key: string, options: Record<string, any> = {}) {
    const persisterOptions = options.meta?.persister;
    return new QueryObserver(
      client,
      persistence.guardOptions({
        enabled: false,
        ...options,
        queryKey: model._forceQueryKeyPrefix([key]),
        persister: model._createPersister(persisterOptions),
      } as any),
    );
  }
  // Exercise the real $useStateData wrapper cache and async-local get/ensure paths
  // with QueryObserver instead of requiring a mounted Vue application container.
  model.$useQuery = options => {
    const logicalKey = options.queryKey.at(-1);
    const observed = observer(logicalKey, options);
    const unsubscribe = observed.subscribe(() => undefined);
    const result = {
      get data() {
        return observed.getCurrentResult().data;
      },
      suspense: () => observed.refetch(),
    };
    void unsubscribe;
    return result;
  };
  function storageKey(key: string, options = {}) {
    const query = client.getQueryCache().find({ queryKey: model._forceQueryKeyPrefix([key]) });
    return model._getPersisterStorageKey(model._adjustPersisterOptions(options), query, [key]);
  }
  return { model, client, persistence, observer, storageKey };
}

function reset() {
  records.clear();
  calls.length = 0;
  readBarrier = undefined;
  writeBarrier = undefined;
}

function persisted(query: any, data: unknown, timestamp = Date.now()) {
  return JSON.stringify({
    state: { data, dataUpdatedAt: timestamp, errorUpdatedAt: 0 },
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    buster: '1',
  });
}

test('normalization, immutable capture, reactive epoch, no-op tuples and switch-away/back', async () => {
  const f = fixture();
  try {
    const initial = f.persistence.capture();
    assert.deepEqual(initial.scope, [null, 'site', null]);
    assert.ok(Object.isFrozen(initial));
    assert.ok(Object.isFrozen(initial.scope));
    const epoch = computed(() => f.persistence.epoch);
    assert.equal(epoch.value, 0);
    let changes = 0;
    const stop = f.persistence.subscribe(() => changes++);
    f.persistence.update({ instanceId: 0, userId: 0 }, { initial: true });
    const token = f.persistence.capture();
    assert.deepEqual(token.scope, ['0', null, '0']);
    assert.equal(epoch.value, 1);
    f.persistence.update({ instanceId: '0', userId: '0' });
    assert.equal(f.persistence.current(token), true);
    assert.equal(changes, 1);
    f.persistence.update({ instanceId: 1, siteId: null, userId: 0 });
    f.persistence.update({ instanceId: 0, siteId: 'site', userId: 0 });
    assert.equal(f.persistence.current(token), false);
    stop();
  } finally {
    f.client.clear();
  }
});

test('all DB physical paths isolate app, instance, site, user and custom/simplified logical keys', async () => {
  reset();
  const f = fixture();
  const other = fixture('other');
  try {
    const a = f.observer('draft', {
      meta: { persister: { prefix: 'custom', storageKeySimplify: true } },
    });
    const query = a.getCurrentQuery();
    query.setData('anonymous');
    await f.model.$persisterSave(['draft']);
    const anonymous = f.storageKey('draft', { prefix: 'custom', storageKeySimplify: true });
    assert.deepEqual(JSON.parse(anonymous), [
      'zova-model-db',
      1,
      'app',
      [null, 'site', null],
      'draft',
    ]);
    const keys = new Set([anonymous]);
    for (const identity of [
      { instanceId: 'i', siteId: 'site', userId: 'u' },
      { instanceId: 'other', siteId: 'site', userId: 'u' },
      { instanceId: 'other', siteId: 'other', userId: 'u' },
      { instanceId: 'other', siteId: 'other', userId: 'other' },
    ]) {
      f.persistence.update(identity);
      assert.equal(query.state.data, undefined);
      assert.equal(await f.model.$persisterLoad(['draft']), undefined);
      query.setData(JSON.stringify(identity));
      await f.model.$persisterSave(['draft']);
      keys.add(f.storageKey('draft', { prefix: 'custom', storageKeySimplify: true }));
    }
    assert.equal(keys.size, 5);
    assert.equal(records.size, 5);
    other.observer('draft', {
      meta: { persister: { prefix: 'custom', storageKeySimplify: true } },
    });
    assert.equal(await other.model.$persisterLoad(['draft']), undefined);
    const physical = f.storageKey('draft', { prefix: 'custom', storageKeySimplify: true });
    const generation = f.model.$persisterGeneration(['draft']);
    assert.ok(generation.includes(physical));
    records.set(physical, 'bad-json');
    assert.equal(await f.model.$persisterLoad(['draft']), undefined);
    assert.equal(f.model.$persisterError(['draft']), true);
    f.persistence.update({ instanceId: 'another', siteId: 'other', userId: 'other' });
    assert.equal(f.model.$persisterError(['draft']), false);
    f.persistence.update({ instanceId: 'other', siteId: 'other', userId: 'other' });
    query.setData('remove me');
    await f.model.$persisterSave(['draft']);
    f.client.removeQueries({ queryKey: query.queryKey });
    await f.model.$persisterRemove(['draft'], { prefix: 'custom', storageKeySimplify: true });
    assert.equal(records.has(physical), false);
    assert.equal(records.has(anonymous), true);
  } finally {
    f.client.clear();
    other.client.clear();
  }
});

test('scope reset keeps Query/observers but empties canonical state; old initial and placeholder options stay gated', async () => {
  reset();
  const f = fixture();
  try {
    const observer = f.observer('private', {
      initialData: 'initial-user',
      initialDataUpdatedAt: 123,
      placeholderData: previous => previous ?? 'private-placeholder',
    });
    const options = observer.options;
    const query = observer.getCurrentQuery();
    const unsubscribe = observer.subscribe(() => undefined);
    query.setState({ error: new Error('old'), errorUpdatedAt: 123, fetchFailureCount: 3 });
    f.persistence.update({ instanceId: 'i', userId: 'u' });
    assert.equal(observer.getCurrentQuery(), query);
    assert.equal(query.getObserversCount(), 1);
    assert.equal(query.state.data, undefined);
    assert.equal(query.state.error, null);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(query.state.dataUpdateCount, 0);
    assert.equal(query.state.errorUpdateCount, 0);
    assert.equal(query.state.fetchFailureCount, 0);
    assert.equal(query.state.fetchMeta, null);
    assert.equal(query.state.status, 'pending');
    assert.equal(query.state.fetchStatus, 'idle');
    observer.setOptions(options);
    assert.equal(observer.getCurrentResult().data, undefined);
    assert.equal(query.state.data, undefined);
    unsubscribe();
  } finally {
    f.client.clear();
  }
});

test('only actually hydrated Queries adopt first provider identity; non-DB and logical keys unchanged', async () => {
  reset();
  const f = fixture();
  const server = new QueryClient();
  try {
    server.setQueryData(['test.model.example', 'hydrated'], 'SSR');
    const state = dehydrate(server);
    hydrate(f.client, state);
    const hydrated = f.client.getQueryCache().get(state.queries[0].queryHash)!;
    f.persistence.markHydrated([hydrated]);
    const ordinary = f.observer('ordinary', { initialData: 'null-scope' }).getCurrentQuery();
    const local = f
      .observer('local', { initialData: 'local', meta: { persister: { sync: true } } })
      .getCurrentQuery();
    const mem = f
      .observer('mem', { initialData: 'mem', meta: { persister: false } })
      .getCurrentQuery();
    const implicit = f
      .observer('implicit', { initialData: 'db', meta: { persister: true } })
      .getCurrentQuery();
    f.persistence.update({ instanceId: 'i', userId: 'u' }, { initial: true });
    assert.equal(hydrated.state.data, 'SSR');
    assert.equal(ordinary.state.data, undefined);
    assert.equal(implicit.state.data, undefined);
    assert.equal(local.state.data, 'local');
    assert.equal(mem.state.data, 'mem');
    assert.deepEqual(hydrated.queryKey, ['test.model.example', 'hydrated']);
    f.persistence.update({ instanceId: 'i', userId: 'b' }, { initial: true });
    assert.equal(hydrated.state.data, undefined);
  } finally {
    f.client.clear();
    server.clear();
  }
});

test('automatic persistence restores/saves custom simplified keys, maxAge and buster', async () => {
  reset();
  const f = fixture();
  try {
    let network = 0;
    const observer = f.observer('draft', {
      queryFn: async () => `network-${++network}`,
      meta: { persister: { prefix: 'custom', storageKeySimplify: true } },
    });
    const query = observer.getCurrentQuery();
    const key = f.storageKey('draft', { prefix: 'custom', storageKeySimplify: true });
    records.set(key, persisted(query, 'stored', Date.now() - 100));
    assert.equal((await observer.refetch()).data, 'stored');
    assert.equal(network, 0);
    await tick();
    assert.ok(query.state.dataUpdatedAt < Date.now());
    f.persistence.update({ userId: 'u' });
    assert.equal((await observer.refetch()).data, 'network-1');
    await tick();
    await f.model.$persisterFlush();
    assert.equal(
      JSON.parse(
        records.get(f.storageKey('draft', { prefix: 'custom', storageKeySimplify: true }))!,
      ).state.data,
      'network-1',
    );
    assert.equal(JSON.parse(records.get(key)!).state.data, 'stored');
    f.persistence.update({ userId: 'b' });
    const bkey = f.storageKey('draft', { prefix: 'custom', storageKeySimplify: true });
    records.set(
      bkey,
      JSON.stringify({ state: { data: 'busted', dataUpdatedAt: Date.now() }, buster: 'bad' }),
    );
    assert.equal((await observer.refetch()).data, 'network-2');
  } finally {
    await tick();
    f.client.clear();
  }
});

test('stale explicit restore cannot change timestamps/defaults in a different epoch', async () => {
  reset();
  const f = fixture();
  try {
    const observer = f.observer('draft');
    const query = observer.getCurrentQuery();
    records.set(f.storageKey('draft'), persisted(query, 'anonymous', 123));
    readBarrier = deferred<void>();
    const load = f.model.$persisterLoad(['draft']);
    await Promise.resolve();
    f.persistence.update({ userId: 'u' });
    readBarrier.resolve();
    assert.equal(await load, undefined);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(query.state.data, undefined);
  } finally {
    readBarrier = undefined;
    f.client.clear();
  }
});

test('active QueryObservers refetch new identity; ignored abort old successes and rejections never publish or persist', async () => {
  for (const rejectOld of [false, true]) {
    reset();
    const f = fixture();
    const old = deferred<string>();
    let calls = 0;
    try {
      const observer = f.observer('remote', {
        enabled: true,
        queryFn: () => (++calls === 1 ? old.promise : Promise.resolve(`new-${calls}`)),
      });
      const unsubscribe = observer.subscribe(() => undefined);
      const query = observer.getCurrentQuery();
      await tick();
      f.persistence.update({ instanceId: 'i', userId: 'u' });
      assert.equal(query.state.data, undefined);
      await tick();
      assert.equal(query.state.data, 'new-2');
      if (rejectOld) old.reject(new Error('obsolete'));
      else old.resolve('obsolete');
      await tick();
      await f.model.$persisterFlush();
      assert.equal(query.state.data, 'new-2');
      assert.equal(query.state.error, null);
      assert.equal(query.state.status, 'success');
      assert.equal(
        [...records.values()].some(value => value.includes('obsolete')),
        false,
      );
      unsubscribe();
    } finally {
      f.client.clear();
    }
  }
});

test('bypass network results are also scope guarded and never persisted', async () => {
  reset();
  const f = fixture();
  const old = deferred<string>();
  try {
    const observer = f.observer('remote', { queryFn: () => old.promise });
    const query = observer.getCurrentQuery();
    const fetch = query
      .fetch(undefined, { meta: { bypassPersister: true } as any })
      .catch(() => undefined);
    f.persistence.update({ userId: 'u' });
    old.resolve('old');
    await fetch;
    await tick();
    assert.equal(query.state.data, undefined);
    assert.equal(records.size, 0);
    assert.equal(calls.length, 0);
  } finally {
    f.client.clear();
  }
});

test('global clear drains accepted saves across all scopes and invalidates stale automatic callbacks', async () => {
  reset();
  const f = fixture();
  const remote = deferred<string>();
  try {
    const draft = f.observer('draft').getCurrentQuery();
    draft.setData('accepted');
    writeBarrier = deferred<void>();
    const save = f.model.$persisterSave(['draft']);
    await Promise.resolve();
    f.persistence.update({ userId: 'u' });
    records.set('legacy-and-other-scope', 'other');
    const observer = f.observer('remote', { queryFn: () => remote.promise });
    const fetch = observer.refetch();
    const clear = f.model.$clear();
    writeBarrier.resolve();
    remote.resolve('late');
    await Promise.all([save, clear, fetch]);
    await tick();
    await f.model.$persisterFlush();
    assert.equal(records.size, 0);
    assert.equal(draft.state.data, undefined);
    assert.equal(observer.getCurrentQuery().state.data, undefined);
    assert.ok(calls.findIndex(value => value.startsWith('set:')) < calls.indexOf('clear'));
  } finally {
    writeBarrier = undefined;
    f.client.clear();
  }
});

test('async-local cached wrapper reacquires new scope and stale loads never install defaults', async () => {
  reset();
  const f = fixture();
  const options = {
    queryKey: ['draft'],
    enabled: false,
    meta: {
      disableSuspenseOnInit: true,
      defaultData: () => ({ text: 'default' }),
      persister: { storage: 'db' },
    },
  };
  try {
    const wrapper = f.model.$useStateData(options);
    const query = f.model.$queryFind({ queryKey: ['draft'] });
    records.set(f.storageKey('draft'), persisted(query, { text: 'old' }));
    readBarrier = deferred<void>();
    const pending = f.model._handleAsyncDataGet(options, undefined, true);
    await Promise.resolve();
    const value = computed(() => f.model._handleAsyncDataGet(options, undefined, true));
    void value.value;
    f.persistence.update({ instanceId: 'i', userId: 'a' });
    const nextKey = f.storageKey('draft');
    records.set(nextKey, persisted(query, { text: 'new' }));
    readBarrier.resolve();
    assert.equal(await pending, undefined);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(f.model.$useStateData(options), wrapper);
    assert.deepEqual(await value.value, { text: 'new' });
    assert.deepEqual(wrapper.data, { text: 'new' });
    assert.equal(JSON.parse(records.get(nextKey)!).state.data.text, 'new');
  } finally {
    readBarrier = undefined;
    f.client.clear();
  }
});

test('disposed async-local owners abandon restores before config, timestamps and defaults', async () => {
  reset();
  const f = fixture();
  let defaults = 0;
  const options = {
    queryKey: ['disposed'],
    enabled: false,
    meta: {
      disableSuspenseOnInit: true,
      defaultData: () => {
        defaults++;
        return [];
      },
      persister: { storage: 'db' },
    },
  };
  try {
    f.model.$useStateData(options);
    const query = f.model.$queryFind({ queryKey: ['disposed'] });
    records.set(f.storageKey('disposed'), persisted(query, ['old tabs'], 123));
    readBarrier = deferred<void>();
    const pending = f.model._handleAsyncDataGet(options, undefined, true);
    await tick();
    f.model.ctx.disposed = true;
    readBarrier.resolve();
    assert.equal(await pending, undefined);
    assert.equal(query.state.data, undefined);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(defaults, 0);
    const reads = calls.length;
    assert.equal(await f.model._handleAsyncDataGet(options, undefined, true), undefined);
    assert.equal(calls.length, reads);
  } finally {
    readBarrier = undefined;
    f.client.clear();
  }
});

test('disposed automatic DB restores cannot update timestamps or start restore refetch', async () => {
  reset();
  const f = fixture();
  let network = 0;
  try {
    const observer = f.observer('disposed-remote', {
      queryFn: async () => `network-${++network}`,
      meta: { persister: { refetchOnRestore: 'always' } },
    });
    const query = observer.getCurrentQuery();
    records.set(f.storageKey('disposed-remote'), persisted(query, 'old', 123));
    readBarrier = deferred<void>();
    const pending = observer.refetch();
    await tick();
    f.model.ctx.disposed = true;
    readBarrier.resolve();
    await pending;
    await tick();
    assert.equal(network, 0);
    assert.equal(query.state.data, undefined);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(calls.filter(call => call.startsWith('set:')).length, 0);
  } finally {
    readBarrier = undefined;
    f.client.clear();
  }
});

test('disposed owners cannot publish pending network successes or failures', async () => {
  reset();
  for (const fails of [false, true]) {
    const f = fixture();
    const response = deferred<string>();
    let started = false;
    try {
      const observer = f.observer('network', {
        queryFn: () => {
          started = true;
          return response.promise;
        },
      });
      const pending = observer.refetch();
      await tick();
      assert.equal(started, true);
      f.model.ctx.disposed = true;
      if (fails) response.reject(new Error('late network failure'));
      else response.resolve('private result');
      await pending;
      await tick();
      const query = observer.getCurrentQuery();
      assert.equal(query.state.data, undefined);
      assert.equal(query.state.error, null);
      assert.equal(query.state.dataUpdatedAt, 0);
      assert.equal(calls.filter(call => call.startsWith('set:')).length, 0);
    } finally {
      response.resolve('private result');
      f.client.clear();
    }
  }
});

test('disposed owners suppress deferred restore callbacks and automatic saves without dropping accepted writes', async () => {
  reset();
  const f = fixture();
  const saved = fixture('accepted');
  const remote = fixture('remote');
  let network = 0;
  try {
    const observer = f.observer('restored', {
      queryFn: async () => `network-${++network}`,
      meta: { persister: { refetchOnRestore: 'always' } },
    });
    const query = observer.getCurrentQuery();
    records.set(f.storageKey('restored'), persisted(query, 'restored', 123));
    assert.equal((await observer.refetch()).data, 'restored');
    f.model.ctx.disposed = true;
    await tick();
    assert.equal(network, 0);
    assert.notEqual(query.state.dataUpdatedAt, 123);

    const saving = remote.observer('automatic', { queryFn: async () => 'fresh' });
    assert.equal((await saving.refetch()).data, 'fresh');
    const automaticKey = remote.storageKey('automatic');
    remote.model.ctx.disposed = true;
    await tick();
    assert.equal(records.has(automaticKey), false);

    saved.observer('explicit');
    saved.model.$setQueryData(['explicit'], 'accepted', false);
    const key = saved.storageKey('explicit');
    writeBarrier = deferred<void>();
    const accepted = saved.model.$persisterSave(['explicit']);
    saved.model.ctx.disposed = true;
    writeBarrier.resolve();
    await accepted;
    assert.equal(JSON.parse(records.get(key)!).state.data, 'accepted');
  } finally {
    writeBarrier = undefined;
    f.client.clear();
    saved.client.clear();
    remote.client.clear();
  }
});

test('deferred restore timestamps/refetch and automatic save cannot escape an epoch or clear', async () => {
  reset();
  const f = fixture();
  try {
    let network = 0;
    const observer = f.observer('remote', {
      queryFn: async () => `network-${++network}`,
      meta: { persister: { refetchOnRestore: 'always' } },
    });
    const query = observer.getCurrentQuery();
    records.set(f.storageKey('remote'), persisted(query, 'restored', 123));
    assert.equal((await observer.refetch()).data, 'restored');
    f.persistence.update({ userId: 'next' });
    await tick();
    assert.equal(network, 0);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(query.state.data, undefined);
    assert.equal((await observer.refetch()).data, 'network-1');
    // The scheduled persistence callback has not run yet.
    const clear = f.model.$clear();
    await clear;
    await tick();
    await f.model.$persisterFlush();
    assert.equal(records.size, 0);
    assert.equal(query.state.data, undefined);
  } finally {
    f.client.clear();
  }
});

test('retry cancellation blocks old attempts and explicit removal invalidates pending restores', async () => {
  reset();
  const f = fixture();
  try {
    let attempts = 0;
    const observer = f.observer('retry', {
      retry: 3,
      retryDelay: 50,
      queryFn: async () => {
        attempts++;
        throw new Error('temporary');
      },
    });
    const fetching = observer.refetch();
    await tick();
    assert.equal(attempts, 1);
    f.persistence.update({ userId: 'next' });
    await fetching;
    await new Promise(resolve => setTimeout(resolve, 60));
    assert.equal(attempts, 1);
    assert.equal(observer.getCurrentQuery().state.error, null);
    const draft = f.observer('draft').getCurrentQuery();
    const key = f.storageKey('draft');
    records.set(key, persisted(draft, 'old'));
    readBarrier = deferred<void>();
    const loading = f.model.$persisterLoad(['draft']);
    await Promise.resolve();
    const removing = f.model.$persisterRemove(['draft']);
    readBarrier.resolve();
    assert.equal(await loading, undefined);
    await removing;
    assert.equal(records.has(key), false);
  } finally {
    readBarrier = undefined;
    f.client.clear();
  }
});

test('reactive context preserves frozen scope identity and exposes epoch invalidation', () => {
  const client = markRaw(new QueryClient());
  try {
    for (const wrap of [reactive, shallowReactive]) {
      const context = wrap(new ModelPersistenceContext(client, 'site'));
      const token = context.capture();
      assert.equal(context.current(token), true);
      context.update({ siteId: undefined });
      assert.deepEqual(context.capture().scope, [null, null, null]);
      assert.equal(context.current(token), false);
      const current = context.capture();
      context.update({ siteId: null });
      assert.equal(context.current(current), true);
    }
  } finally {
    client.clear();
  }
});

test('DB work before provider registration prevents hydrated Query scope adoption', async () => {
  reset();
  const f = fixture();
  try {
    const query = f.observer('hydrated', { initialData: 'SSR' }).getCurrentQuery();
    f.persistence.markHydrated([query]);
    await f.model.$persisterSave(['hydrated']);
    const oldKey = f.storageKey('hydrated');
    f.persistence.update({ instanceId: 'i', siteId: 'site', userId: 'u' }, { initial: true });
    assert.equal(query.state.data, undefined);
    assert.equal(JSON.parse(records.get(oldKey)!).state.data, 'SSR');
    assert.equal(await f.model.$persisterLoad(['hydrated']), undefined);
  } finally {
    f.client.clear();
  }
});

test('storage queue identity remains the shared localforage singleton', () => {
  assert.equal(getPersistenceQueue(localforage), getPersistenceQueue(localforage));
  assert.notEqual(
    getModelPersistenceStorageKey('a', [null, null, null], 'x'),
    getModelPersistenceStorageKey('b', [null, null, null], 'x'),
  );
});
