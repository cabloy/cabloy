import type { VonaApplication } from 'vona';

import { SymbolCacheComposeGuards } from 'vona-module-a-aspect';

import type { ContextRouteBase } from '../../types/router.ts';

export function composeGuards(app: VonaApplication, route: ContextRouteBase) {
  // compose
  if (!app.meta[SymbolCacheComposeGuards]) app.meta[SymbolCacheComposeGuards] = {};
  const cacheComposeGuards: Record<string, Function> = app.meta[SymbolCacheComposeGuards];
  const beanFullName = route.controllerBeanFullName;
  const handlerName = route.action;
  const key = `${beanFullName}:${handlerName}`;
  if (!cacheComposeGuards[key]) {
    cacheComposeGuards[key] = app.bean.onion.guard.compose(route);
  }
  return cacheComposeGuards[key];
}
