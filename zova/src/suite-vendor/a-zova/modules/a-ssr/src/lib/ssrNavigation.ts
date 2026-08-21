import type {
  RouteLocationNormalizedGeneric,
  RouteLocationResolvedGeneric,
} from '@cabloy/vue-router';

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
