import type {
  RouteLocationMatched,
  RouteLocationNormalizedLoadedGeneric,
} from '@cabloy/vue-router';
import type {
  BeanBase,
  BeanContainer,
  IControllerData,
  IErrorHandlerEventData,
  IMonkeyAppClose,
  IMonkeyAppInitialize,
  IMonkeyAppInitialized,
  IMonkeyAppReady,
  IMonkeyBeanInit,
  IMonkeyController,
  ZovaContext,
} from 'zova';
import type { ErrorSSR } from 'zova-module-a-ssr';

import * as ModuleInfo from '@cabloy/module-info';
import { shallowReactive } from 'vue';
import { BeanControllerPageBase, BeanSimple, cast, useComputed } from 'zova';

import type { BeanRouter } from './bean/bean.router.js';
import type { TypePageSchema } from './types/router.js';

import { routerViewKey } from './lib/const.js';
import { getCurrentRoute, getPageRoute, getRealRouteName, getRouteMatched } from './lib/utils.js';
import { ServiceRouterGuards } from './service/routerGuards.js';
import { SymbolRouterHistory } from './types/utils.js';

export class Monkey
  extends BeanSimple
  implements
    IMonkeyAppInitialize,
    IMonkeyAppInitialized,
    IMonkeyAppReady,
    IMonkeyAppClose,
    IMonkeyBeanInit,
    IMonkeyController
{
  private _beanRouter: BeanRouter;
  serviceRouterGuards: ServiceRouterGuards;

  async getBeanRouter() {
    if (!this._beanRouter) {
      // markReactive: true
      this._beanRouter = this.app.meta.$router = (await this.bean._getBean(
        'a-router.bean.router',
        true,
        true,
      )) as BeanRouter;
    }
    return this._beanRouter;
  }

  async appInitialize() {
    // router
    this.serviceRouterGuards = await this.bean._newBean(ServiceRouterGuards, false);
    //  ssr errorHandler
    if (process.env.CLIENT) {
      this._ssrErrorHandler();
    }
  }

  async appInitialized() {
    const beanRouter = await this.getBeanRouter();
    // emit event
    await this.app.meta.event.emit('a-router:routerGuards', beanRouter);
  }

  appClose(): void {
    if (this.serviceRouterGuards) {
      this.serviceRouterGuards.dispose();
    }
  }

  async appReady() {
    const beanRouter = await this.getBeanRouter();
    // pagePath
    if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      const pagePathFull = this.ctx.meta.$ssr.state.pagePathFull;
      if (pagePathFull) {
        const routerHistory = beanRouter.router[SymbolRouterHistory];
        routerHistory.push(pagePathFull);
      }
    }
    // use router
    this.app.vue.use(beanRouter);
    // ssr
    if (process.env.SERVER) {
      // push
      const pagePath = this.app.$getCurrentPagePath()!;
      beanRouter.push(pagePath);
      await beanRouter.isReady();
    } else if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      await beanRouter.isReady();
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    bean.defineProperty(beanInstance, '$router', {
      enumerable: false,
      configurable: true,
      get() {
        return bean._getBeanFromHost('a-router.bean.router');
      },
    });
    bean.defineProperty(beanInstance, '$routerView', {
      enumerable: false,
      configurable: true,
      get() {
        return bean._getBeanFromHost({ name: routerViewKey });
      },
    });
    bean.defineProperty(beanInstance, '$pageRoute', {
      enumerable: false,
      configurable: true,
      get() {
        return useComputed(() => {
          return getPageRoute(cast(bean).ctx);
        });
      },
    });
    bean.defineProperty(beanInstance, '$currentRoute', {
      enumerable: false,
      configurable: true,
      get() {
        return useComputed(() => {
          return getCurrentRoute(cast(bean).ctx);
        });
      },
    });
  }

  controllerDataPrepare(controllerData: IControllerData, ctx: ZovaContext) {
    controllerData.context.route = getPageRoute(ctx);
  }

  controllerDataInit(controllerData: IControllerData, controller: BeanBase) {
    // only for controller page
    if (!(controller instanceof BeanControllerPageBase)) return;
    const route = controllerData.context.route;
    this._initControllerRoute(route, controller);
  }

  controllerDataUpdate(controller: BeanBase) {
    // only for controller page
    if (!(controller instanceof BeanControllerPageBase)) return;
    const route = getPageRoute(cast<ZovaContext>(cast(controller).ctx));
    this._initControllerRoute(route, controller);
  }

  private _initControllerRoute(
    route: RouteLocationNormalizedLoadedGeneric | undefined,
    controller: BeanControllerPageBase,
  ) {
    if (!route) return;
    const routeMatched = getRouteMatched(route);
    if (!routeMatched) return;
    // check if the same
    if (controller.$routeMatched && !this._checkIfRouteSame(routeMatched, controller.$routeMatched))
      return;
    // check if changed
    const changed = !controller.$route || controller.$route.fullPath !== route.fullPath;
    if (!changed) return;
    controller.$route = route;
    controller.$routeMatched = routeMatched;
    // update $params/$query
    const routeName = getRealRouteName(routeMatched.name);
    const schemaKey = routeName || String(routeMatched.path);
    let schemas: TypePageSchema | undefined;
    const moduleInfo = ModuleInfo.parseInfo(ModuleInfo.parseName(schemaKey));
    if (!moduleInfo) {
      // do nothing
      return;
    }
    if (!this.app.meta.module.exists(moduleInfo.relativeName)) {
      // do nothing
      return;
    }
    const module = this.app.meta.module.get(moduleInfo.relativeName)!;
    if (routeName) {
      schemas = module.resource.pageNameSchemas?.[schemaKey];
    } else {
      schemas = module.resource.pagePathSchemas?.[schemaKey];
    }
    if (schemas?.params) {
      const params = schemas.params.parse(route.params);
      if (!controller.$params) {
        controller.$params = process.env.SERVER ? params : shallowReactive(params as any);
      } else {
        // hold the same $params ref
        Object.assign(controller.$params as any, params);
      }
    }
    if (schemas?.query) {
      const query = schemas.query.parse(route.query);
      if (!controller.$query) {
        controller.$query = process.env.SERVER ? query : shallowReactive(query as any);
      } else {
        // hold the same $query ref
        Object.assign(controller.$query as any, query);
      }
    }
  }

  private _checkIfRouteSame(route1: RouteLocationMatched, route2: RouteLocationMatched) {
    return (route1.name && route1.name === route2.name) || route1.path === route2.path;
  }

  private _ssrErrorHandler() {
    if (!process.env.CLIENT) return;
    this.app.meta.event.on('app:errorHandler', (data, next) => {
      const err = next();
      if (!err || !(err instanceof Error)) return err;
      return this._errorHandlerDefaultClient(err, data);
    });
  }

  private _errorHandlerDefaultClient(err: ErrorSSR, _data: IErrorHandlerEventData) {
    if (!process.env.CLIENT) return err;
    // client
    if ([301, 302].includes(Number(err.code))) {
      this.app.$gotoPage(err.pagePath!);
      return undefined;
    }
    // COMPONENT_UNMOUNTED
    if (err.code === 600) {
      // do nothing
      return undefined;
    }
    // 401
    if (err.code === 401) {
      this.app.$gotoLogin();
      return undefined;
    }
    // not handled
    return err;
  }
}
