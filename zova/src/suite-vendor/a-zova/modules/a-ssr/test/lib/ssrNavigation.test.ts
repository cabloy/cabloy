import assert from 'node:assert/strict';
import test from 'node:test';

import type { TypeSsrNavigationRoute } from '../../src/lib/ssrNavigation.ts';

import { createSsrNavigationSync } from '../../src/lib/ssrNavigation.ts';

function createRoute(locale?: string): TypeSsrNavigationRoute {
  return {
    meta: { locale: locale !== undefined },
    params: locale === undefined ? {} : { locale },
  } as TypeSsrNavigationRoute;
}

test('SSR navigation rollback restores the prior locale from a non-locale route', () => {
  const from = createRoute();
  const to = createRoute('zh-cn');
  let locale = 'en-us';
  let profileRoute: TypeSsrNavigationRoute | undefined;
  const sync = createSsrNavigationSync({
    getLocale: () => locale,
    setLocale: value => {
      locale = value;
    },
    setProfile: route => {
      profileRoute = route;
    },
    setRouteLocale: route => {
      if (route.meta.locale) {
        locale = route.params.locale as string;
      }
    },
  });

  sync.beforeEach(to);
  assert.equal(locale, 'zh-cn');
  assert.equal(profileRoute, to);

  sync.afterEach(to, from, new Error('blocked'));
  assert.equal(locale, 'en-us');
  assert.equal(profileRoute, from);
});

test('SSR navigation keeps destination profile and locale after success', () => {
  const from = createRoute('en-us');
  const to = createRoute('zh-cn');
  let locale = 'en-us';
  let profileRoute: TypeSsrNavigationRoute | undefined;
  const sync = createSsrNavigationSync({
    getLocale: () => locale,
    setLocale: value => {
      locale = value;
    },
    setProfile: route => {
      profileRoute = route;
    },
    setRouteLocale: route => {
      if (route.meta.locale) {
        locale = route.params.locale as string;
      }
    },
  });

  sync.beforeEach(to);
  sync.afterEach(to, from, undefined);

  assert.equal(locale, 'zh-cn');
  assert.equal(profileRoute, to);
});
