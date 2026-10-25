import { createMemoryHistory, createRouter } from '@cabloy/vue-router';
import assert from 'node:assert/strict';
import test from 'node:test';

import type { TypeSsrNavigationRoute } from '../../src/lib/ssrNavigation.ts';

import { AppLocale } from '../../../../../../../packages-zova/zova-core/src/core/component/locale.ts';
import {
  createSsrNavigationSync,
  getCanonicalLocaleRoutePath,
} from '../../src/lib/ssrNavigation.ts';

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

test('matched locale routes canonicalize disabled, noncanonical and default input through actual router', async () => {
  const locale = Object.assign(new AppLocale(), {
    sys: {
      config: { locale: { default: 'en-us', items: { 'en-us': 'English', 'zh-cn': 'Chinese' } } },
    },
  });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        name: '$:home-indexweb:home',
        path: '/home/indexweb/home/:locale?',
        alias: '/:locale([a-z]{2}-[a-z]{2}|[a-z]{2})?',
        component: {},
        children: [
          {
            name: 'home-indexweb:home',
            path: '',
            // SysRouter preserves the authored alias on the child as well as its layout.
            alias: '/:locale([a-z]{2}-[a-z]{2}|[a-z]{2})?',
            component: {},
            meta: { locale: true, requiresAuth: false, ssrProfile: 'public' },
          },
        ],
      },
      { name: 'static', path: '/static', component: {} },
    ],
  });
  const canonical = (path: string) =>
    getCanonicalLocaleRoutePath(router.resolve(path), locale, 'en-us');
  assert.equal(canonical('/ja-jp?tab=one#section'), '/?tab=one#section');
  assert.equal(canonical('/home/indexweb/home/ja-jp'), '/home/indexweb/home/');
  assert.equal(canonical('/home/indexweb/home/ZH_CN'), '/home/indexweb/home/zh-cn');
  assert.equal(canonical('/en-us'), '/');
  assert.equal(canonical('/zh-cn'), undefined);
  assert.equal(canonical('/'), undefined);
  assert.equal(canonical('/static'), undefined);
  router.beforeEach(to => {
    const path = getCanonicalLocaleRoutePath(to, locale, 'en-us');
    if (path) return { path, query: to.query, hash: to.hash, replace: true };
  });
  await router.push('/ja-jp?tab=one#section');
  assert.equal(router.currentRoute.value.fullPath, '/?tab=one#section');
  assert.equal(router.currentRoute.value.name, 'home-indexweb:home');
  assert.equal(router.currentRoute.value.meta.ssrProfile, 'public');
  assert.equal(router.currentRoute.value.meta.requiresAuth, false);
});
