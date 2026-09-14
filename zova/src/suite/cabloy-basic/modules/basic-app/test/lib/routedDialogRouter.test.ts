import { createRouter } from '@cabloy/vue-router';
import assert from 'node:assert/strict';
import test from 'node:test';

import { RoutedDialogHistory } from '../../src/lib/routedDialogHistory.js';

function createRouterWithHistory() {
  const routedDialogHistory = new RoutedDialogHistory();
  const router = createRouter({
    history: routedDialogHistory.history,
    routes: [
      { path: '/entry', component: {} },
      { path: '/detail', component: {} },
    ],
  });
  return { router, routedDialogHistory };
}

test('routed dialog router synchronizes Back availability after a pop navigation', async () => {
  const { router, routedDialogHistory } = createRouterWithHistory();
  const canGoBackAfterEach: boolean[] = [];

  router.afterEach((_to, _from, failure) => {
    if (!failure) canGoBackAfterEach.push(routedDialogHistory.canGoBack);
  });
  await router.replace('/entry');
  await router.isReady();
  await router.push('/detail');
  router.back();
  await new Promise(resolve => setTimeout(resolve));

  assert.equal(router.currentRoute.value.fullPath, '/entry');
  assert.equal(routedDialogHistory.canGoBack, false);
  assert.deepEqual(canGoBackAfterEach, [false, true, false]);
});
