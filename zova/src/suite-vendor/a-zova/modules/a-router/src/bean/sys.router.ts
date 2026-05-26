import type {
  RouteLocationMatched,
  RouteLocationNormalizedLoaded,
  RouteLocationResolvedGeneric,
  Router,
  RouterOptions,
} from '@cabloy/vue-router';

import { IModule } from '@cabloy/module-info';
import * as ModuleInfo from '@cabloy/module-info';
import { combineParamsAndQuery } from '@cabloy/utils';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from '@cabloy/vue-router';
import { BeanBase, cast, deepExtend } from 'zova';
import { Sys } from 'zova-module-a-bean';

import { getRealRouteName, getRouteMatched, isRouterName } from '../lib/utils.js';
import {
  IModuleRoute,
  IModuleRouteComponent,
  IPageNameRecord,
  IPagePathRecord,
} from '../types/router.js';
import { SymbolRouterHistory } from '../types/utils.js';

export interface SysRouter extends Router {}

@Sys()
export class SysRouter extends BeanBase {
  private _vueRouterSys: Router;

  get router(): Router {
    return this._vueRouterSys;
  }

  protected __get__(prop: string) {
    return this._vueRouterSys && this._vueRouterSys[prop];
  }

  protected async __init__() {
    // create router
    this._vueRouterSys = this.createRouter();
    // config.routes
    this._loadConfigRoutes();
    // legacy routes
    this._loadLegacyRoutes();
  }

  public createRouter(options?: RouterOptions) {
    options = Object.assign({}, options);
    // matcher
    if (!options.matcher) {
      options.matcher = this._vueRouterSys?.matcher;
    }
    // routes
    if (!options.routes) {
      if (!this._vueRouterSys) {
        options.routes = [];
      }
    }
    // scrollBehavior
    if (!options.scrollBehavior) {
      options.scrollBehavior = this.scope.config.scrollBehavior;
    }
    // history
    if (!options.history) {
      const createHistory = process.env.SERVER
        ? createMemoryHistory
        : this.sys.env.ROUTER_MODE === 'history'
          ? createWebHistory
          : createWebHashHistory;
      const routeBase =
        process.env.SERVER || this.sys.env.ROUTER_MODE === 'history'
          ? this.sys.env.APP_PUBLIC_PATH
          : undefined;
      options.history = createHistory(routeBase);
    }
    // create
    const router = createRouter(options);
    cast(router).__hasDevtools = true;
    router[SymbolRouterHistory] = options.history;
    return router;
  }

  public createAsyncComponent(component: string | IModuleRouteComponent) {
    if (typeof component !== 'string') return component;
    return this.sys.meta.component.createAsyncComponent(component);
  }

  public getPagePath<K extends keyof IPagePathRecord>(
    path: K,
    options?: IPagePathRecord[K],
    absolute?: boolean,
  ) {
    const pagePath = combineParamsAndQuery(path, {
      params: options?.params,
      query: options?.query,
    });
    return absolute ? this.sys.util.getAbsoluteUrlFromPagePath(pagePath) : pagePath;
  }

  public async resolveRoute(
    url: string,
    check404?: boolean,
    checkAliasOf?: boolean,
  ): Promise<RouteLocationResolvedGeneric | undefined> {
    const pagePath = this.sys.util.getPagePathFromAbsoluteUrl(url);
    let route = await this.ensureRoute(pagePath);
    if (check404 && route.name === '$:/:catchAll(.*)*') return;
    // aliasOf
    if (checkAliasOf) {
      const matchItem = route.matched.find(item => item.aliasOf);
      if (matchItem) {
        route = matchItem.aliasOf as unknown as RouteLocationResolvedGeneric;
      }
      // 404
      if (check404 && route.name === '$:/:catchAll(.*)*') return;
    }
    // ok
    return route;
  }

  public checkPathValid(
    to?: { name?: string; path?: string | null | undefined } | string | null | undefined,
  ): boolean {
    const _name = to && typeof to === 'object' ? to.name : undefined;
    const _path = to && typeof to === 'object' ? (to.name ?? to.path) : to;
    // legacy
    if (this._findLegacyRoute(_name, _path)) return true;
    // general check
    if (!_path) return true;
    const moduleName = ModuleInfo.parseName(_path);
    if (!moduleName) return true;
    return this.sys.meta.module.exists(moduleName);
  }

  public async ensureRoute(pagePath: string) {
    // try to resolve, support alias route
    let route = this._vueRouterSys.resolve(pagePath);
    if (route && route.name !== '$:/:catchAll(.*)*') return route;
    // try to load module
    const moduleName = ModuleInfo.parseName(pagePath);
    if (moduleName) {
      if (this.sys.meta.module.exists(moduleName)) {
        const module = this.sys.meta.module.get(moduleName);
        if (!module) {
          await this.sys.meta.module.use(moduleName);
          // try to resolve again
          route = this._vueRouterSys.resolve(pagePath);
        }
      }
    }
    return route;
  }

  /** @internal */
  public _registerRoutes(module: IModule) {
    if (!module.resource.routes) return;
    for (const route of module.resource.routes) {
      this._registerRoute(route, module);
    }
  }

  /** @internal */
  public _findConfigRoute(
    name: string | symbol | null | undefined,
    path: string | undefined,
  ): IModuleRoute | undefined {
    name = this.getRealRouteName(name);
    return name ? this.sys.config.routes.name[name] : this.sys.config.routes.path[path!];
  }

  /** @internal */
  public _findLegacyRoute(
    name: string | symbol | null | undefined,
    path: string | null | undefined,
  ): IModuleRoute | undefined {
    const legacyRoutes = cast(this.sys.meta).legacyRoutes;
    if (!legacyRoutes) return;
    name = this.getRealRouteName(name);
    return legacyRoutes.find(item => {
      return name ? item.name === name : item.path === path;
    });
  }

  getRouteMatched(route: RouteLocationNormalizedLoaded): RouteLocationMatched | undefined {
    return getRouteMatched(route);
  }

  getRealRouteName(name?: string | symbol | null): string | undefined {
    return getRealRouteName(name);
  }

  isRouterName(name?: string | null | undefined): boolean {
    return isRouterName(name);
  }

  resolveName<K extends keyof IPageNameRecord>(name: K, options?: IPageNameRecord[K]): string {
    const params = cast(options)?.params;
    const query = cast(options)?.query;
    return this._resolveNameOrPath(query, query => {
      const route = this.router.resolve({ name, params, query });
      return route.fullPath;
    });
  }

  resolvePath<K extends keyof IPagePathRecord>(path: K, query?: IPagePathRecord[K]): string {
    return this._resolveNameOrPath(query, query => {
      const route = this.router.resolve({ path, query });
      return route.fullPath;
    });
  }

  private _resolveNameOrPath(query, fn) {
    const query1 = {};
    const query2: any = [];
    if (query) {
      for (const key in query) {
        const value = query[key];
        if (value && typeof value === 'object') {
          query2.push([key, value]);
        } else {
          query1[key] = value;
        }
      }
    }
    // resolve
    const fullPath = fn(query1);
    // query2
    const query2str = query2
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
      })
      .join('&');
    // join
    if (!query2str) return fullPath;
    const join = Object.keys(query1).length > 0 ? '&' : '?';
    return `${fullPath}${join}${query2str}`;
  }

  private _loadConfigRoutes() {
    const routesPath = this.sys.config.routes.path;
    for (const key in routesPath) {
      const route = routesPath[key];
      if (!route) continue;
      this._loadConfigRoute({ ...route, path: key, name: `$:${key}` });
    }
    const routesName = this.sys.config.routes.name;
    for (const key in routesName) {
      const route = routesName[key];
      if (!route) continue;
      this._loadConfigRoute({ ...route, path: route.path || (route.alias as string), name: key });
    }
  }

  private _loadLegacyRoutes() {
    const legacyRoutes = cast(this.sys.meta).legacyRoutes;
    if (!legacyRoutes) return;
    for (const route of legacyRoutes) {
      this._registerRoute(route);
    }
  }

  private _loadConfigRoute(route: IModuleRoute) {
    this.router.addRoute(route);
  }

  private _registerRoute(route: IModuleRoute, module?: IModule) {
    // path
    let path: string | undefined;
    if (route.path !== undefined) {
      if (!module || route.meta?.absolute === true) {
        path = route.path;
      } else {
        path = route.path
          ? `/${module.info.pid}/${module.info.name}/${route.path}`
          : `/${module.info.pid}/${module.info.name}`;
      }
    }
    // name
    let name: string | undefined;
    if (route.name) {
      if (!module || route.meta?.absolute === true) {
        name = String(route.name);
      } else {
        name = `${module.info.relativeName}:${String(route.name)}`;
      }
    }
    // config route
    const configRoute = name
      ? this.sys.config.routes.name[name]
      : this.sys.config.routes.path[path!];
    if (configRoute) {
      route = deepExtend({}, route, configRoute);
    }
    // name alias
    if (name && configRoute?.alias) {
      // add extra route
      this.router.addRoute({
        name: `$alias:${name}`,
        path: `/__alias__${configRoute?.alias}`,
        redirect: '',
      });
    }
    // name
    if (!name) {
      name = `$:${path}`;
    }
    // meta
    const meta = route.meta;
    // component
    const component = route.component;
    // layout / routeData
    let layout = meta?.layout;
    let routeData;
    let routeNameParent;
    if (layout === false) {
      routeData = { ...route, name, path, component, meta };
    } else {
      if (layout === undefined || layout === 'default') {
        layout = this.sys.config.layout.component.default;
      } else if (layout === 'empty') {
        layout = this.sys.config.layout.component.empty;
      }
      routeNameParent = `$:${name}`;
      routeData = {
        name: routeNameParent,
        path,
        component: this.createAsyncComponent(layout as any),
        children: [{ ...route, name, path: '', component, meta }],
      };
    }
    // force delete
    if (this.router.hasRoute(routeNameParent)) {
      this.router.removeRoute(routeNameParent);
    }
    if (this.router.hasRoute(name)) {
      this.router.removeRoute(name);
    }
    // add
    this.router.addRoute(routeData);
  }
}
