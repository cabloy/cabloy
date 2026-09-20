import assert from 'node:assert/strict';
import test from 'node:test';

import { RouterGuardDisposers } from '../../src/lib/routerGuardDisposers.js';

test('router guard disposers release every callback only once', () => {
  const disposers = new RouterGuardDisposers();
  const calls: string[] = [];

  const beforeEach = () => calls.push('beforeEach');
  const beforeResolve = () => calls.push('beforeResolve');
  const afterEach = () => calls.push('afterEach');
  const onError = () => calls.push('onError');

  assert.equal(disposers.add(beforeEach), beforeEach);
  assert.equal(disposers.add(beforeResolve), beforeResolve);
  assert.equal(disposers.add(afterEach), afterEach);
  assert.equal(disposers.add(onError), onError);

  disposers.dispose();
  disposers.dispose();

  assert.deepEqual(calls, ['beforeEach', 'beforeResolve', 'afterEach', 'onError']);
});
