import type {
  RouteLocationMatched,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
  RouterScrollBehavior,
} from '@cabloy/vue-router';
import type { Ref } from 'vue';
import type { ZovaContext } from 'zova';

import { routerViewLocationKey } from '@cabloy/vue-router';
import { inject } from 'vue';

import { pageRouteKey } from './const.js';

export function getRouteMatched(
  route: RouteLocationNormalizedLoaded,
): RouteLocationMatched | undefined {
  let match = route.matched.find(item => item.aliasOf);
  if (match) {
    match = match.aliasOf;
  } else {
    match = route.matched[route.matched.length - 1];
  }
  return match;
}

export function getRealRouteName(name?: string | symbol | null): string | undefined {
  if (!name) return undefined;
  name = String(name);
  if (name.startsWith('$:')) return undefined;
  return name;
}

export function isRouterName(name?: string | null | undefined): boolean {
  return !!name && name.includes(':') && !name.includes('/');
}

export function getPageRoute(ctx: ZovaContext): RouteLocationNormalizedLoadedGeneric | undefined {
  const route = ctx.bean._getBeanFromHost({ name: pageRouteKey });
  return route as RouteLocationNormalizedLoadedGeneric | undefined;
}

export function getCurrentRoute(
  ctx: ZovaContext,
): Ref<RouteLocationNormalizedLoadedGeneric> | undefined {
  const route = ctx.util.instanceScope(() => {
    return inject(routerViewLocationKey);
  });
  return route;
}

export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) {
    return new Promise(resolve => {
      setTimeout(() => {
        // savedPosition = Object.assign({}, savedPosition, { behavior: 'smooth' });
        resolve(savedPosition);
      }, 100);
    });
  } else if (to.hash) {
    return new Promise(resolve => {
      setTimeout(() => {
        // resolve({ el: to.hash, behavior: 'smooth' });
        resolve({ el: to.hash });
      }, 200);
    });
  } else {
    return { left: 0, top: 0 };
  }
};
