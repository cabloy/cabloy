import assert from 'node:assert/strict';
import test from 'node:test';

import { RoutedDialogHistory } from '../../src/lib/routedDialogHistory.js';

function createHistory() {
  const routedDialogHistory = new RoutedDialogHistory();
  return { history: routedDialogHistory.history, routedDialogHistory };
}

test('routed dialog history establishes replace as the root entry', () => {
  const { history, routedDialogHistory } = createHistory();

  history.replace('/entry');

  assert.equal(routedDialogHistory.canGoBack, false);
});

test('routed dialog history updates Back availability before navigation listeners', () => {
  const { history, routedDialogHistory } = createHistory();
  const canGoBackOnChange: boolean[] = [];
  const canGoBackOnNavigation: boolean[] = [];

  routedDialogHistory.onCanGoBackChange(canGoBack => {
    canGoBackOnChange.push(canGoBack);
  });
  history.listen(() => {
    canGoBackOnNavigation.push(routedDialogHistory.canGoBack);
  });
  history.replace('/entry');
  history.push('/detail');
  history.replace('/detail-edited');
  assert.equal(routedDialogHistory.canGoBack, true);

  history.go(-1);
  assert.equal(routedDialogHistory.canGoBack, false);
  history.go(1);
  assert.equal(routedDialogHistory.canGoBack, true);

  assert.deepEqual(canGoBackOnChange, [true, false, true]);
  assert.deepEqual(canGoBackOnNavigation, [false, true]);
});

test('routed dialog history truncates forward entries after a new push', () => {
  const { history, routedDialogHistory } = createHistory();

  history.replace('/entry');
  history.push('/detail/1');
  history.push('/detail/2');
  history.go(-1);
  history.push('/detail/3');
  history.go(1);
  assert.equal(history.location, '/detail/3');
  assert.equal(routedDialogHistory.canGoBack, true);

  history.go(-2);
  assert.equal(history.location, '/entry');
  assert.equal(routedDialogHistory.canGoBack, false);
});

test('routed dialog history mirrors a silent rejected-pop repair', () => {
  const { history, routedDialogHistory } = createHistory();

  history.replace('/entry');
  history.push('/detail');
  history.go(-1);
  assert.equal(routedDialogHistory.canGoBack, false);

  // Vue Router repairs a rejected pop with history.go(-delta, false).
  history.go(1, false);
  assert.equal(history.location, '/detail');
  assert.equal(routedDialogHistory.canGoBack, true);
});

test('routed dialog histories remain independent and reset after destruction', () => {
  const first = createHistory();
  const second = createHistory();
  const firstChanges: boolean[] = [];

  first.routedDialogHistory.onCanGoBackChange(canGoBack => {
    firstChanges.push(canGoBack);
  });
  first.history.replace('/first');
  second.history.replace('/second');
  first.history.push('/first-detail');
  assert.equal(first.routedDialogHistory.canGoBack, true);
  assert.equal(second.routedDialogHistory.canGoBack, false);

  first.routedDialogHistory.destroy();
  assert.deepEqual(firstChanges, [true]);
  assert.equal(first.routedDialogHistory.canGoBack, false);
});
