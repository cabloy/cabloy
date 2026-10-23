import { QueryClient, QueryObserver } from '@tanstack/query-core';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';

import { ModelPersistenceContext } from '../../src/lib/modelPersistence.ts';

const tick = () => new Promise<void>(resolve => setTimeout(resolve, 0));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

test('outgoing transition cancels and resets immediately without active refetch; later login still refetches', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const persistence = new ModelPersistenceContext(client, 'admin');
  persistence.update({ instanceId: 2, siteId: 'admin', userId: 1 }, { initial: true });
  await tick();
  const outgoing = deferred<string>();
  let accessToken: string | undefined = 'token-1';
  const requests: Array<string | undefined> = [];
  let aborted = false;
  const observer = new QueryObserver(client, {
    queryKey: ['protected'],
    initialData: 'private',
    queryFn: ({ signal }) => {
      requests.push(accessToken);
      if (requests.length === 1) {
        signal.addEventListener('abort', () => {
          aborted = true;
        });
        return outgoing.promise;
      }
      return Promise.resolve(`data:${accessToken}`);
    },
  });
  const local = client.getQueryCache().build(client, {
    queryKey: ['local'],
    initialData: 'local-value',
    meta: { persister: { storage: 'local' } },
  });
  const unsubscribe = observer.subscribe(() => undefined);
  const query = observer.getCurrentQuery();
  const previous = persistence.capture();
  let notifications = 0;
  const stop = persistence.subscribe(token => {
    notifications++;
    assert.equal(persistence.current(token), true);
    assert.equal(persistence.current(previous), false);
    assert.equal(aborted, true);
    assert.equal(query.state.data, undefined);
    assert.equal(query.state.error, null);
    assert.equal(query.state.dataUpdatedAt, 0);
    assert.equal(query.state.fetchStatus, 'idle');
    assert.equal(query.state.status, 'pending');
  });
  try {
    assert.deepEqual(requests, ['token-1']);
    accessToken = undefined;
    persistence.update(
      { instanceId: null, siteId: 'admin', userId: null },
      { refetchActive: false },
    );
    assert.equal(notifications, 1);
    assert.equal(persistence.epoch, previous.epoch + 1);
    assert.deepEqual(persistence.capture().scope, [null, 'admin', null]);
    assert.equal(observer.getCurrentQuery(), query);
    assert.equal(query.getObserversCount(), 1);
    assert.equal(local.state.data, 'local-value');
    await tick();
    assert.deepEqual(requests, ['token-1']);
    outgoing.resolve('obsolete-private');
    await tick();
    assert.equal(query.state.data, undefined);
    assert.equal(query.state.error, null);
    stop();

    // Ordinary login must use its already-installed token and must not inherit
    // the preceding outgoing transition's no-refetch policy.
    accessToken = 'token-3';
    persistence.update({ instanceId: 4, siteId: 'admin', userId: 3 });
    assert.equal(query.state.data, undefined);
    await tick();
    assert.deepEqual(requests, ['token-1', 'token-3']);
    assert.equal(query.state.data, 'data:token-3');

    accessToken = 'token-5';
    persistence.update({ instanceId: 4, siteId: 'admin', userId: 5 }, { refetchActive: true });
    await tick();
    assert.deepEqual(requests, ['token-1', 'token-3', 'token-5']);
    assert.equal(query.state.data, 'data:token-5');
  } finally {
    stop();
    unsubscribe();
    outgoing.resolve('obsolete-private');
    client.clear();
  }
});

test('ServiceStorage forwards outgoing refetch policy unchanged', () => {
  const source = readFileSync(new URL('../../src/service/storage.ts', import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?;\n/gm, '')
    .replace(/^@Service[^\n]*\n/gm, '');
  const javascript = stripTypeScriptTypes(source).replace(
    'export class ServiceStorage',
    'class ServiceStorage',
  );
  const ServiceStorage = new Function('BeanBase', `${javascript}\nreturn ServiceStorage;`)(
    class BeanBase {},
  );
  const storage = new ServiceStorage();
  const calls: any[] = [];
  storage._persistence = { update: (...args: any[]) => calls.push(args) };
  const identity = { instanceId: null, siteId: 'admin', userId: null };
  const options = { refetchActive: false };
  storage.update(identity, options);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], identity);
  assert.equal(calls[0][1], options);
  storage.update({ instanceId: 4, siteId: 'admin', userId: 3 });
  assert.equal(calls[1][1], undefined);
});
