import type { Next, VonaApplication, VonaContext } from 'vona';

import { SymbolCacheComposeInterceptors } from 'vona-module-a-aspect';

import type { ContextRoute } from '../../types/router.ts';

export async function middlewareInterceptor(ctx: VonaContext, next: Next) {
  // check handler
  const handler = ctx.getHandler();
  if (!handler) return next();
  // compose
  return await _composeInterceptors(ctx.app, ctx.route)(ctx, next);
}

function _composeInterceptors(app: VonaApplication, route: ContextRoute) {
  // compose
  if (!app.meta[SymbolCacheComposeInterceptors]) app.meta[SymbolCacheComposeInterceptors] = {};
  const cacheComposeInterceptors: Record<string, Function> =
    app.meta[SymbolCacheComposeInterceptors];
  const beanFullName = route.controllerBeanFullName;
  const handlerName = route.action;
  const key = `${beanFullName}:${handlerName}`;
  if (!cacheComposeInterceptors[key]) {
    cacheComposeInterceptors[key] = app.bean.onion.interceptor.compose(route);
  }
  return cacheComposeInterceptors[key];
}
