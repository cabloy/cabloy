import type {
  RouteLocationNormalizedGeneric,
  RouteLocationResolvedGeneric,
} from '@cabloy/vue-router';

import { combineParamsAndQuery } from '@cabloy/utils';

// Keep the matched route/alias and existing optional-default URL policy. No new identity.
export function getCanonicalLocaleRoutePath(
  route: TypeSsrNavigationRoute,
  locale: { normalize(value: unknown): string },
  defaultLocale: string,
): string | undefined {
  if (!route.meta.locale) return;
  const value = locale.normalize(route.params?.locale);
  const canonical = value === defaultLocale ? '' : value;
  if ((route.params?.locale ?? '') === canonical) return;
  // A synthetic layout parent may retain its original path while its child matches
  // the public alias. The deepest matching record owns the actual destination URL.
  const matched = route.matched.findLast(record => record.path.includes(':locale'));
  if (!matched) return;
  const path =
    combineParamsAndQuery(matched.path, {
      params: { ...route.params, locale: canonical || undefined },
      query: route.query,
    }) + (route.hash ?? '');
  return path !== route.fullPath ? path : undefined;
}

export type TypeSsrNavigationRoute = RouteLocationNormalizedGeneric | RouteLocationResolvedGeneric;

export interface ISsrNavigationSync {
  beforeEach(to: TypeSsrNavigationRoute): void;
  afterEach(to: TypeSsrNavigationRoute, from: TypeSsrNavigationRoute, failure: unknown): void;
}

export interface ISsrNavigationSyncOptions<L> {
  getLocale(): L;
  setLocale(locale: L): void;
  setProfile(route: TypeSsrNavigationRoute): void;
  setRouteLocale(route: TypeSsrNavigationRoute): void;
}

export function createSsrNavigationSync<L>(
  options: ISsrNavigationSyncOptions<L>,
): ISsrNavigationSync {
  const navigationLocales = new WeakMap<object, L>();
  return {
    beforeEach(to) {
      navigationLocales.set(to, options.getLocale());
      options.setProfile(to);
      options.setRouteLocale(to);
    },
    afterEach(to, from, failure) {
      const locale = navigationLocales.get(to);
      navigationLocales.delete(to);
      if (!failure) return;
      options.setProfile(from);
      if (locale !== undefined) {
        options.setLocale(locale);
      }
    },
  };
}
