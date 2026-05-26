import type { Constructable, VonaApplication, VonaContext } from 'vona';

import * as ModuleInfo from '@cabloy/module-info';
import Router from 'find-my-way';
import { appMetadata, appResource, BeanBase, deepExtend } from 'vona';
import { SymbolCacheComposeMiddlewares } from 'vona-module-a-aspect';
import { Bean } from 'vona-module-a-bean';
import { SymbolUseOnionOptions, SymbolUseOnionOptionsRouteReal } from 'vona-module-a-onion';
import { SymbolRouteHandlersArgumentsValue } from 'vona-module-a-openapiutils';

import type { RequestMappingMetadata } from '../lib/decorator/request.ts';
import type { IDecoratorControllerOptions } from '../types/controller.ts';
import type { TypeRequestMethod } from '../types/request.ts';
import type { ContextRoute } from '../types/router.ts';

import { getCacheControllerRoutes } from '../lib/const.ts';
import { middlewareGuard } from '../lib/middleware/middlewareGuard.ts';
import { middlewareInterceptor } from '../lib/middleware/middlewareInterceptor.ts';
import { middlewarePipe } from '../lib/middleware/middlewarePipe.ts';
import { SymbolRequestMappingHandler } from '../types/request.ts';

@Bean()
export class BeanRouter extends BeanBase {
  reRegisterController(beanFullName: string) {
    const app = this.app;
    // remove
    const cacheControllerRoutes = getCacheControllerRoutes(this.app);
    const routes = cacheControllerRoutes[beanFullName];
    if (routes) {
      delete cacheControllerRoutes[beanFullName];
      for (const route of routes) {
        app.router.off(route.routeMethod.toUpperCase() as any, route.routePath);
      }
    }
    // register
    this.registerController(beanFullName);
  }

  registerController(beanFullName: string) {
    // controller options
    const beanOptions = appResource.getBean(beanFullName);
    if (!beanOptions) return;
    const controller = beanOptions.beanClass;
    const controllerBeanFullName = beanOptions.beanFullName;
    const controllerOptions = beanOptions.options as IDecoratorControllerOptions;
    const controllerPath = controllerOptions.path;
    const controllerMiddlewaresOptions = appMetadata.getMetadata<object>(
      SymbolUseOnionOptions,
      controller,
    );
    // descs
    const descs = Object.getOwnPropertyDescriptors(controller.prototype);
    for (const actionKey in descs) {
      const desc = descs[actionKey];
      if (['constructor'].includes(actionKey)) continue;
      if (!desc.value || typeof desc.value !== 'function') continue;
      this._registerControllerAction(
        beanOptions.module,
        controller,
        controllerBeanFullName,
        controllerPath,
        controllerMiddlewaresOptions,
        actionKey,
        desc,
      );
    }
  }

  register(
    method: Router.HTTPMethod,
    moduleName: ModuleInfo.IModuleInfo | string,
    path: string | undefined,
    simplify: boolean,
    fn: Router.Handler<Router.HTTPVersion.V1>,
  ) {
    const app = this.app;
    const _path = app.util.combineApiPath(path, moduleName, true, simplify);
    app.router.on(method, _path, fn);
  }

  unRegister(
    method: Router.HTTPMethod,
    moduleName: ModuleInfo.IModuleInfo | string,
    path: string | undefined,
    simplify: boolean,
  ) {
    const app = this.app;
    const _path = app.util.combineApiPath(path, moduleName, true, simplify);
    app.router.off(method, _path);
  }

  findByPath(
    method: Router.HTTPMethod,
    moduleName: ModuleInfo.IModuleInfo | string,
    path: string | undefined,
    simplify: boolean,
  ): any {
    const app = this.app;
    const _path = app.util.combineApiPath(path, moduleName, true, simplify);
    return app.router.findRoute(method, _path);
  }

  private _registerControllerAction(
    moduleName: string,
    controller: Constructable,
    controllerBeanFullName: string,
    controllerPath: string | undefined,
    controllerMiddlewaresOptions: object | undefined,
    actionKey: string,
    desc: PropertyDescriptor,
  ) {
    // app
    const app = this.app;

    // actionPath/actionMethod
    if (!appMetadata.hasMetadata(SymbolRequestMappingHandler, controller.prototype, actionKey))
      return;
    const handlerMetadata = appMetadata.getMetadata<RequestMappingMetadata>(
      SymbolRequestMappingHandler,
      controller.prototype,
      actionKey,
    )!;
    const actionPath: RegExp | string = handlerMetadata.path || '';
    const actionMethod: TypeRequestMethod = handlerMetadata.method || 'get';
    // routePath
    const routePath = app.util.combineApiPathControllerAndAction(
      moduleName,
      controllerPath,
      actionPath,
      true,
      true,
    );
    const routePathRaw = app.util.combineApiPathControllerAndActionRaw(
      moduleName,
      controllerPath,
      actionPath,
      true,
    );

    // middlewares options
    const actionMiddlewaresOptions = appMetadata.getMetadata(
      SymbolUseOnionOptions,
      controller.prototype,
      actionKey,
    );

    // route
    const route = {
      meta: deepExtend({}, controllerMiddlewaresOptions, actionMiddlewaresOptions),
    };
    appMetadata.defineMetadata(
      SymbolUseOnionOptionsRouteReal,
      route,
      controller.prototype,
      actionKey,
    );

    // route
    const _route: ContextRoute = {
      controller,
      actionDescriptor: desc,
      controllerBeanFullName,
      action: actionKey,
      route,
      routeMethod: actionMethod,
      routePath,
      routePathRaw,
      routePathOriginal: actionPath,
    };

    // fn
    const fn = function (this: VonaContext, _req, _res, params, _store, searchParams) {
      const ctx = this;
      ctx.route = _route;
      ctx.request.params = params;
      ctx.request.query = searchParams;
      return _composeMiddlewares(this.app, _route)(ctx);
    };

    // add
    const cacheControllerRoutes = getCacheControllerRoutes(this.app);
    if (!cacheControllerRoutes[controllerBeanFullName]) {
      cacheControllerRoutes[controllerBeanFullName] = [];
    }
    cacheControllerRoutes[controllerBeanFullName].push(_route);

    // register
    app.router.on(_route.routeMethod.toUpperCase() as any, _route.routePath, fn);
  }
}

function _composeMiddlewares(app: VonaApplication, route: ContextRoute) {
  // compose
  if (!app.meta[SymbolCacheComposeMiddlewares]) app.meta[SymbolCacheComposeMiddlewares] = {};
  const cacheComposeMiddlewares: Record<string, Function> = app.meta[SymbolCacheComposeMiddlewares];
  const beanFullName = route.controllerBeanFullName;
  const handlerName = route.action;
  const key = `${beanFullName}:${handlerName}`;
  if (!cacheComposeMiddlewares[key]) {
    // start
    const fnStart = routeStartMiddleware;
    // mid: guard/interceptor/pipes/tail
    const fnMid: Function[] = [];
    fnMid.push(middlewareGuard);
    fnMid.push(middlewareInterceptor);
    fnMid.push(middlewarePipe);
    fnMid.push(routeTailDoneMiddleware);
    // end: controller
    const fnEnd = classControllerMiddleware;
    cacheComposeMiddlewares[key] = app.bean.onion.middleware.compose(route, fnStart, fnMid, fnEnd);
  }
  return cacheComposeMiddlewares[key];
}

function classControllerMiddleware(ctx: VonaContext) {
  const handlerName = ctx.getHandlerName()!;
  const controller = ctx.getControllerBean();
  return controller[handlerName](...(ctx[SymbolRouteHandlersArgumentsValue] || []));
}

async function routeStartMiddleware(ctx: VonaContext, next: Function) {
  // next
  const res = await next();
  // invoke callbacks: handle secondly
  await ctx.commitsDone();
  // ok
  return res;
}

async function routeTailDoneMiddleware(ctx: VonaContext, next: Function) {
  // next
  const res = await next();
  // invoke callbacks: handle firstly
  await ctx.commitsDone();
  // ok
  return res;
}
