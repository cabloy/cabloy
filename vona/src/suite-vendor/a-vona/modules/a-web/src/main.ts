import type { IModuleMain, Next, VonaApplication, VonaContext } from 'vona';
import type { IMiddlewareSystemExecute, IMiddlewareSystemRecord } from 'vona-module-a-aspect';
import type { IOnionSlice } from 'vona-module-a-onion';

import Router from 'find-my-way';
import { BeanSimple, compose } from 'vona';
import { SymbolCacheComposeMiddlewareSystems } from 'vona-module-a-aspect';
import { SymbolRouterMiddleware } from 'vona-module-a-executor';

import { __ThisModule__ } from './.metadata/this.ts';

const SymbolRouter = Symbol('SymbolRouter');

export class Main extends BeanSimple implements IModuleMain {
  private [SymbolRouter]: Router.Instance<Router.HTTPVersion.V1>;

  async moduleLoading() {}
  async moduleLoaded() {
    const config = this.app.scope(__ThisModule__).config;
    const self = this;
    // router
    Object.defineProperty(this.app, 'router', {
      get() {
        if (!self[SymbolRouter]) {
          self[SymbolRouter] = Router(config.router);
        }
        return self[SymbolRouter];
      },
    });
    // register controllers
    for (const controller of this.bean.onion.controller.getOnionsEnabledCached()) {
      this.bean.router.registerController(controller.beanOptions.beanFullName);
    }
    // middleware: system
    this.app.use((ctx, next) => {
      return _composeMiddlewareSystems(this.app)(ctx, next);
    });
    // middleware: router
    this.app[SymbolRouterMiddleware] = routerMiddleware(this[SymbolRouter]);
    this.app.use(this.app[SymbolRouterMiddleware]);
  }

  async configLoaded(_config: any) {}
}

function routerMiddleware(router: Router.Instance<Router.HTTPVersion.V1>) {
  return function (ctx: VonaContext) {
    return new Promise((resolve, reject) => {
      (router as any).lookup(ctx.req, ctx.res, ctx, (err: Error | null, result: any) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };
}

function _composeMiddlewareSystems(app: VonaApplication) {
  // compose
  if (!app.meta[SymbolCacheComposeMiddlewareSystems]) {
    const middlewares = app.bean.onion.middlewareSystem.getOnionsEnabledWrapped(item => {
      return _wrapOnion(app, item);
    });
    app.meta[SymbolCacheComposeMiddlewareSystems] = compose(middlewares);
  }
  return app.meta[SymbolCacheComposeMiddlewareSystems];
}

function _wrapOnion<T extends keyof IMiddlewareSystemRecord>(
  app: VonaApplication,
  item: IOnionSlice<IMiddlewareSystemRecord, T>,
) {
  const fn = (_ctx: VonaContext, next: Next) => {
    const options = item.beanOptions.options!;
    if (!app.bean.onion.checkOnionOptionsEnabled(options, app.ctx.path)) {
      return next();
    }
    // execute
    const beanFullName = item.beanOptions.beanFullName;
    const beanInstance = app.bean._getBean<IMiddlewareSystemExecute>(beanFullName as any);
    if (!beanInstance) {
      throw new Error(`middlewareSystem bean not found: ${beanFullName}`);
    }
    return beanInstance.execute(options, next);
  };
  fn._name = item.name;
  return fn;
}
