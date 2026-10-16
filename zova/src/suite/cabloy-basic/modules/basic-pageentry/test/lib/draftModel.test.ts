import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

async function createRuntime(options: { load?: Promise<void>; write?: Promise<void> } = {}) {
  const database = new Map<string, any>();
  const owners = new Map<string, any>();
  const accesses = {
    localState: 0,
    selector: 0,
    storage: 0,
    discardListener: 0,
    discardCleanup: 0,
  };
  const discardListeners = new Set<(event: any, next: () => void) => void>();
  let queue: Promise<void> = Promise.resolve();
  let failRemove = false;
  let failSave = false;
  let failRestore = false;
  let failLoad = false;
  let ModelDraft: any;
  const passport = { isAuthenticated: true, user: { id: 1, anonymous: false } };
  const environment = { instanceId: '2', site: 'admin' };
  const contextListeners = new Set<() => void>();
  let epoch = 0;
  let previousScope = '';
  function capture() {
    const scope = [environment.instanceId, environment.site, String(passport.user.id)];
    const serialized = JSON.stringify(scope);
    if (serialized !== previousScope) {
      if (previousScope) ++epoch;
      previousScope = serialized;
      for (const listener of contextListeners) listener();
    }
    return { scope, epoch };
  }
  const persistence = {
    capture,
    current(token: any) {
      const current = capture();
      return (
        token.epoch === current.epoch &&
        JSON.stringify(token.scope) === JSON.stringify(current.scope)
      );
    },
    subscribe(listener: () => void) {
      contextListeners.add(listener);
      return () => contextListeners.delete(listener);
    },
  };
  const app: any = {
    meta: {
      event: {
        on(name: string, listener: (event: any, next: () => void) => void) {
          assert.equal(name, 'a-router:routeDiscard');
          accesses.discardListener++;
          discardListeners.add(listener);
          return () => {
            accesses.discardCleanup++;
            discardListeners.delete(listener);
          };
        },
      },
    },
    bean: {
      async _getBeanSelector(_name: string, _cache: boolean, key: string) {
        accesses.selector++;
        if (!owners.has(key)) {
          const owner = new ModelDraft();
          await owner.__init__(key);
          owners.set(key, owner);
        }
        return owners.get(key);
      },
    },
  };
  class BeanBase {
    app = app;
    sys = { env: { SITE_ID: 'admin' } };
    scope = { config: { draft: { maxAge: 86400000 } } };
    $passport = passport;
    $modelPersistence = persistence;
    async __init__() {}
  }
  class BeanModelBase extends BeanBase {
    snapshot: any;
    keyValue?: string;
    async __init__(key?: string) {
      await super.__init__();
      this.keyValue = key;
    }

    $useStateLocalAsync(stateOptions: any) {
      accesses.localState++;
      assert.deepEqual(stateOptions, {
        queryKey: ['snapshot'],
        meta: { defaultData: null, maxAge: 86400000 },
      });
      // Like the production custom ref, initialization does not read storage.
      return {
        then: (resolve: (value: any) => void, reject: (error: unknown) => void) =>
          (options.load ?? Promise.resolve())
            .then(() => {
              accesses.storage++;
              if (failLoad) throw new Error('Unavailable');
              return database.get(this.keyValue!) ?? null;
            })
            .then(resolve, reject),
      };
    }

    async $ensureStateLocalAsync(snapshot: any) {
      this.snapshot = await snapshot;
      return this.snapshot;
    }

    $useStateData(stateOptions: any) {
      assert.deepEqual(stateOptions, {
        queryKey: ['snapshot'],
        enabled: false,
        staleTime: Infinity,
        meta: { persister: { storage: 'db', sync: false }, ssr: { dehydrate: false } },
      });
    }

    $persisterError(key: string[]) {
      assert.deepEqual(key, ['snapshot']);
      return failRestore;
    }

    $setQueryData(key: string[], value: any, persist: boolean) {
      assert.deepEqual(key, ['snapshot']);
      assert.equal(persist, false);
      this.snapshot = value;
    }

    $persisterSave(key: string[]) {
      assert.deepEqual(key, ['snapshot']);
      accesses.storage++;
      const snapshot = structuredClone(this.snapshot);
      const operation = queue.then(async () => {
        await options.write;
        if (failSave) throw new Error('Unavailable');
        database.set(this.keyValue!, snapshot);
      });
      queue = operation.catch(() => {});
      return operation;
    }

    $persisterRemove(key: string[]) {
      assert.deepEqual(key, ['snapshot']);
      accesses.storage++;
      const operation = queue.then(() => {
        if (failRemove) throw new Error('Unavailable');
        database.delete(this.keyValue!);
      });
      queue = operation.catch(() => {});
      return operation;
    }
  }
  function evaluateClass(path: string, name: string, baseName: string, base: any) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
      .replace(/^import[\s\S]*?;\n/gm, '')
      .replace(/^@(Model|Bean)[^\n]*\n/gm, '');
    const javascript = stripTypeScriptTypes(source).replace(
      `export class ${name}`,
      `class ${name}`,
    );
    return new Function(baseName, `${javascript}\nreturn ${name};`)(base);
  }
  ModelDraft = evaluateClass(
    '../../src/model/draft.ts',
    'ModelDraft',
    'BeanModelBase',
    BeanModelBase,
  );
  const BeanDraftCoordinator = evaluateClass(
    '../../src/bean/bean.draftCoordinator.ts',
    'BeanDraftCoordinator',
    'BeanBase',
    BeanBase,
  );
  const coordinator = new BeanDraftCoordinator();
  await coordinator.__init__();
  const router = {
    resolve(fullPath: string) {
      const path = fullPath.split('?')[0];
      const [, resource, id, scene] = /\/resource\/([^/]+)\/([^/]+)(?:\/([^/]+))?/.exec(path) ?? [];
      return {
        path,
        name: id === 'create' ? 'rest-resource:entryCreate' : 'rest-resource:entry',
        params: { resource: decodeURIComponent(resource ?? ''), id, formScene: scene },
      };
    },
  };
  const identity = coordinator.identity(
    router,
    '/admin/rest/resource/training-student%3Astudent/create',
  );
  return {
    coordinator,
    accesses,
    get listenerCount() {
      return discardListeners.size;
    },
    dispose() {
      coordinator.__dispose__();
    },
    async initializeSelected(key: string) {
      const selected = new ModelDraft();
      await selected.__init__(key);
      return selected;
    },
    database,
    owners,
    passport,
    environment,
    persistence,
    router,
    identity,
    setFailRestore(value: boolean) {
      failRestore = value;
    },
    setFailLoad(value: boolean) {
      failLoad = value;
    },
    setFailSave(value: boolean) {
      failSave = value;
    },
    setFailRemove(value: boolean) {
      failRemove = value;
    },
    discard(fullPaths: string[]) {
      const cleanups: Promise<void>[] = [];
      for (const listener of discardListeners) {
        listener(
          {
            router,
            items: fullPaths.map(fullPath => ({ fullPath })),
            waitUntil(cleanup: Promise<void>) {
              cleanups.push(cleanup);
            },
          },
          () => {},
        );
      }
      return Promise.all(cleanups);
    },
  };
}

const envelope = {
  version: 1,
  savedAt: 1,
  schemaSignature: 'schema',
  projection: { values: { name: 'draft' }, relations: {}, undefinedPaths: [] },
};

async function withBrowser(run: () => Promise<void>) {
  const environment = process.env as Record<string, string | undefined>;
  const client = environment.CLIENT;
  environment.CLIENT = 'true';
  try {
    await run();
  } finally {
    if (client === undefined) delete environment.CLIENT;
    else environment.CLIENT = client;
  }
}

test(
  'BeanDraftCoordinator and ModelDraft SSR initialization never accesses browser draft state',
  { concurrency: false },
  async () => {
    const environment = process.env as Record<string, string | undefined>;
    const client = environment.CLIENT;
    delete environment.CLIENT;
    try {
      const runtime = await createRuntime();
      const selected = await runtime.initializeSelected('server-rendered-owner');
      assert.equal(runtime.identity, undefined);
      assert.equal('snapshot' in runtime.coordinator, false);
      assert.equal(selected.snapshot, undefined);
      assert.equal(runtime.owners.size, 0);
      assert.equal(runtime.database.size, 0);
      assert.deepEqual(runtime.accesses, {
        localState: 0,
        selector: 0,
        storage: 0,
        discardListener: 0,
        discardCleanup: 0,
      });
      runtime.dispose();
      assert.equal(runtime.accesses.discardCleanup, 0);
    } finally {
      if (client !== undefined) environment.CLIENT = client;
    }
  },
);

test(
  'BeanDraftCoordinator CLIENT initialization registers once without owning local draft state',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const runtime = await createRuntime();
      assert.deepEqual(runtime.accesses, {
        localState: 0,
        selector: 0,
        storage: 0,
        discardListener: 1,
        discardCleanup: 0,
      });
      assert.equal(runtime.listenerCount, 1);
      assert.equal('snapshot' in runtime.coordinator, false);
      assert.equal('$useStateLocalAsync' in runtime.coordinator, false);
      const selected = await runtime.initializeSelected('selected-owner');
      assert.equal(selected.failed, false);
      assert.deepEqual(runtime.accesses, {
        localState: 1,
        selector: 0,
        storage: 0,
        discardListener: 1,
        discardCleanup: 0,
      });
      assert.equal('identity' in selected, false);
      assert.equal('current' in selected, false);
      assert.equal('__dispose__' in selected, false);
      runtime.dispose();
      assert.equal(runtime.accesses.discardCleanup, 1);
      assert.equal(runtime.listenerCount, 0);
      await runtime.discard([runtime.identity.path]);
      assert.equal(runtime.accesses.selector, 0);
      assert.equal(runtime.accesses.storage, 0);
    }),
);

test(
  'BeanDraftCoordinator keeps resource business identity independent of persistence context',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const runtime = await createRuntime();
      const { coordinator, identity, router } = runtime;
      const key = coordinator.key(identity);
      assert.equal(Object.hasOwn(identity, 'origin'), false);
      assert.deepEqual(JSON.parse(key), [
        'training-student:student',
        'create',
        null,
        identity.path,
      ]);
      assert.equal(
        key,
        coordinator.key(coordinator.identity(router, `${identity.path}?display=compact`)),
      );
      for (const changed of [
        { resource: 'another:resource' },
        { mode: 'edit', id: '1' },
        { path: '/different' },
      ])
        assert.notEqual(key, coordinator.key({ ...identity, ...changed }));
      runtime.passport.user.anonymous = true;
      assert.equal(coordinator.identity(router, identity.path), undefined);
    }),
);

test(
  'BeanDraftCoordinator distinguishes missing snapshots from failed restoration',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const runtime = await createRuntime();
      const missing = await runtime.coordinator.open(runtime.identity);
      assert.equal(missing.owner.snapshot, null);
      assert.equal(missing.owner.failed, false);
      runtime.setFailRestore(true);
      const failed = await runtime.coordinator.open(runtime.identity);
      assert.equal(failed.owner.snapshot, null);
      assert.equal(failed.owner.failed, true);
      runtime.setFailRestore(false);
      const retried = await runtime.coordinator.open(runtime.identity);
      assert.equal(retried.owner.failed, false);

      const loadFailure = await createRuntime();
      loadFailure.setFailLoad(true);
      const rejected = await loadFailure.coordinator.open(loadFailure.identity);
      assert.equal(rejected.owner.failed, true);
      loadFailure.setFailLoad(false);
      const recovered = await loadFailure.coordinator.open(loadFailure.identity);
      assert.equal(recovered.owner.snapshot, null);
      assert.equal(recovered.owner.failed, false);
    }),
);

test(
  'BeanDraftCoordinator account changes invalidate pending restoration and outgoing saves',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const load = deferred();
      const delayed = await createRuntime({ load: load.promise });
      const opening = delayed.coordinator.open(delayed.identity);
      await Promise.resolve();
      delayed.passport.user.id = 2;
      load.resolve();
      assert.equal(await opening, undefined);
      assert.equal(delayed.database.size, 0);

      const runtime = await createRuntime();
      const editor = await runtime.coordinator.open(runtime.identity);
      assert.equal(editor.owner.failed, false);
      runtime.passport.user.id = 2;
      assert.equal(runtime.coordinator.current(editor), false);
      await runtime.coordinator.save(editor, runtime.identity, envelope);
      assert.equal(runtime.database.size, 0);
      const replacement = runtime.coordinator.identity(runtime.router, runtime.identity.path);
      const current = await runtime.coordinator.open(replacement);
      assert.equal(current.key, editor.key);
      assert.notDeepEqual(current.identity.context, editor.identity.context);
      await runtime.coordinator.save(current, replacement, envelope);
      assert.equal(runtime.database.has(current.key), true);
      assert.equal(runtime.coordinator.current(editor), false);
    }),
);

test(
  'BeanDraftCoordinator invalidates instance/site switches and never revives an old editor after returning',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      for (const dimension of ['instanceId', 'site'] as const) {
        const runtime = await createRuntime();
        const editor = await runtime.coordinator.open(runtime.identity);
        const original = runtime.environment[dimension];
        runtime.environment[dimension] = 'another';
        const switched = runtime.coordinator.identity(runtime.router, runtime.identity.path);
        assert.equal(runtime.coordinator.key(switched), editor.key);
        assert.equal(runtime.coordinator.current(editor), false);
        assert.equal(runtime.coordinator.isCurrent(runtime.identity), false);
        await runtime.coordinator.save(editor, runtime.identity, envelope);
        assert.equal(runtime.database.size, 0);
        runtime.environment[dimension] = original;
        const returned = runtime.coordinator.identity(runtime.router, runtime.identity.path);
        assert.deepEqual(returned.context.scope, runtime.identity.context.scope);
        assert.notEqual(returned.context.epoch, runtime.identity.context.epoch);
        assert.equal(runtime.coordinator.current(editor), false);
        assert.equal(runtime.coordinator.isCurrent(switched), false);
        const current = await runtime.coordinator.open(returned);
        assert.equal(runtime.coordinator.current(current), true);
        await runtime.coordinator.save(current, returned, envelope);
        const accesses = runtime.accesses.storage;
        await runtime.coordinator.remove(runtime.identity);
        assert.equal(runtime.accesses.storage, accesses);
        assert.equal(runtime.database.has(current.key), true);
        runtime.dispose();
      }
    }),
);

test(
  'BeanDraftCoordinator skips queued removal when its context becomes obsolete',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const runtime = await createRuntime();
      const editor = await runtime.coordinator.open(runtime.identity);
      await runtime.coordinator.save(editor, runtime.identity, envelope);
      const accesses = runtime.accesses.storage;
      // Both removals are accepted before the first barrier callback executes.
      const first = runtime.coordinator.remove(runtime.identity);
      const queued = runtime.coordinator.remove(runtime.identity);
      runtime.environment.instanceId = 'another';
      const replacement = runtime.coordinator.identity(runtime.router, runtime.identity.path);
      const current = await runtime.coordinator.open(replacement);
      await Promise.all([first, queued]);
      assert.equal(runtime.coordinator.current(editor), false);
      assert.equal(runtime.coordinator.current(current), true);
      assert.equal(runtime.database.has(current.key), true);
      assert.equal(runtime.accesses.storage, accesses);
      runtime.dispose();
    }),
);

test(
  'BeanDraftCoordinator invalidates pending loads and orders deletion after accepted writes',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const write = deferred();
      const runtime = await createRuntime({ write: write.promise });
      const editor = await runtime.coordinator.open(runtime.identity);
      const saving = runtime.coordinator.save(editor, runtime.identity, envelope);
      await Promise.resolve();
      const removing = runtime.coordinator.remove(runtime.identity);
      assert.equal(runtime.coordinator.current(editor), false);
      write.resolve();
      await Promise.all([saving, removing]);
      assert.equal(runtime.database.size, 0);
      await runtime.coordinator.save(editor, runtime.identity, envelope);
      assert.equal(runtime.database.size, 0);

      const load = deferred();
      const delayed = await createRuntime({ load: load.promise });
      const opening = delayed.coordinator.open(delayed.identity);
      await Promise.resolve();
      const removal = delayed.coordinator.remove(delayed.identity);
      load.resolve();
      await removal;
      assert.equal(await opening, undefined);
      assert.equal(delayed.database.size, 0);
    }),
);

test(
  'BeanDraftCoordinator deletes unopened inactive routes and leaves unrelated drafts intact',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const runtime = await createRuntime();
      const inactivePath = '/admin/rest/resource/training-student%3Astudent/42/edit';
      const inactive = runtime.coordinator.identity(runtime.router, inactivePath);
      const inactiveKey = runtime.coordinator.key(inactive);
      runtime.database.set(inactiveKey, envelope);
      const editor = await runtime.coordinator.open(runtime.identity);
      await runtime.coordinator.save(editor, runtime.identity, envelope);
      assert.equal(runtime.owners.has(inactiveKey), false);
      const storageBeforeDiscard = runtime.accesses.storage;
      runtime.setFailLoad(true);
      await runtime.discard([inactivePath]);
      assert.equal(runtime.accesses.storage, storageBeforeDiscard + 1);
      assert.equal(runtime.accesses.discardListener, 1);
      assert.equal(runtime.owners.get(inactiveKey).snapshot, null);
      assert.equal(runtime.database.has(inactiveKey), false);
      assert.equal(runtime.database.has(editor.key), true);
      assert.equal(runtime.coordinator.current(editor), true);
    }),
);

test(
  'BeanDraftCoordinator storage failures remain visible without poisoning later operations',
  { concurrency: false },
  async () =>
    withBrowser(async () => {
      const runtime = await createRuntime();
      const editor = await runtime.coordinator.open(runtime.identity);
      runtime.setFailSave(true);
      await runtime.coordinator.save(editor, runtime.identity, envelope);
      assert.equal(editor.owner.failed, true);
      runtime.setFailSave(false);
      await runtime.coordinator.save(editor, runtime.identity, envelope);
      assert.equal(editor.owner.failed, false);
      runtime.setFailRemove(true);
      await assert.rejects(
        runtime.coordinator.remove(runtime.identity),
        /Draft storage removal failed/,
      );
      assert.equal(editor.owner.failed, true);
      runtime.setFailRemove(false);
      await runtime.coordinator.remove(runtime.identity);
      assert.equal(runtime.database.size, 0);
    }),
);
