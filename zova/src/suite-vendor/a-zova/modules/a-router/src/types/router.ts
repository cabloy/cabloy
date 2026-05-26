import type {
  NavigationFailure,
  RouteComponent,
  RouteLocationMatched,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
  RouteRecordRaw,
} from '@cabloy/vue-router';
import type { z } from 'zod';
import type {
  ILayoutRecord,
  ILocaleRecord,
  TypeComponentLayoutRecord,
  ZovaApplication,
} from 'zova';

import type { BeanRouter } from '../bean/bean.router.js';
import type { BeanRouterViewBase } from '../lib/routerViewBase.js';
import type { IGotoPageOptions } from './utils.js';
import 'vue-router';

export type Lazy<T> = () => Promise<T>;
export type IModuleRouteComponent = RouteComponent | Lazy<RouteComponent>;
export type IModuleRoute = RouteRecordRaw;

export type TypeComponentKeyMode = 'nameOnly' | 'withParams';

export type TypeGotoPageResult = void | Promise<NavigationFailure | void | undefined>;

declare module '@cabloy/vue-router' {
  interface RouteMeta {
    absolute?: boolean;
    layout?: keyof TypeComponentLayoutRecord | keyof ILayoutRecord | false | IModuleRouteComponent;
    requiresAuth?: boolean;
    locale?: boolean;
    locales?: Record<keyof ILocaleRecord, string>;
    componentKeyMode?: TypeComponentKeyMode;
    componentKey?:
      | ((this: ZovaApplication, route: RouteLocationNormalizedLoaded) => string)
      | string;
    tabKey?: ((this: ZovaApplication, route: RouteLocationNormalizedLoaded) => string) | string;
    keepAlive?:
      | ((this: ZovaApplication, route: RouteLocationNormalizedLoaded) => boolean)
      | boolean;
  }
}

declare module 'zova' {
  export interface ZovaApplication {
    $redirect(pagePath: string, status?: 301 | 302): never;
    $gotoPage(pagePath: string, options?: IGotoPageOptions): TypeGotoPageResult;
    $gotoHome(): TypeGotoPageResult;
    $gotoLogin(returnTo?: string, cause?: string): TypeGotoPageResult;
    $gotoReturnTo(returnTo?: string): TypeGotoPageResult;
    $getReturnTo(returnTo?: string): string;
    $getCurrentPagePath(): string | undefined;
  }

  export interface AppMeta {
    $router: BeanRouter;
  }
  export interface BeanBase {
    $router: BeanRouter;
    $routerView: BeanRouterViewBase;
    $pageRoute: RouteLocationNormalizedLoadedGeneric | undefined;
    $currentRoute: RouteLocationNormalizedLoadedGeneric | undefined;
  }

  export interface IModuleResource {
    routes: IModuleRoute[];
  }

  export interface IControllerDataContext {
    route?: RouteLocationNormalizedLoaded;
  }

  export interface IModuleResource {
    pagePathSchemas?: TypePageSchemas;
    pageNameSchemas?: TypePageSchemas;
  }

  export interface ZovaConfigRoutes {
    path: Record<keyof IPagePathRecord, IModuleRoute>;
    name: Record<keyof IPageNameRecord, IModuleRoute>;
  }

  export interface IEventRecord {
    'a-router:routerGuards': { data: BeanRouter; result: void };
  }

  export interface ZovaConfigEnv {
    ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    ROUTER_PAGE_HOME: string;
    ROUTER_PAGE_LOGIN: string;
    ROUTER_KEY_RETURNTO: string;
  }

  export interface BeanControllerPageBase {
    $route: RouteLocationNormalizedLoaded;
    $routeMatched: RouteLocationMatched;
  }

  // export interface IEventRecord {
  //   'a-router:routerGuards': BeanRouter;
  // }

  // export interface IEventResultRecord {
  //   'a-router:routerGuards': void;
  // }
}

export interface IPageNameRecord {}
export interface IPagePathRecord {}
export interface IPagePathSchemaRecord {}

export interface TypePageSchema {
  params?: z.ZodTypeAny;
  query: z.ZodTypeAny;
}
export type TypePageSchemas = Record<string, TypePageSchema>;

export interface TypePagePathSchema<PARAMS = unknown, QUERY = unknown> {
  params?: PARAMS;
  query?: QUERY;
}

export interface TypeErrorListener {
  (error: any, to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded): any;
}

export enum NavigationType {
  pop = 'pop',
  push = 'push',
}

export enum NavigationDirection {
  back = 'back',
  forward = 'forward',
  unknown = '',
}

export interface NavigationInformation {
  type: NavigationType;
  direction: NavigationDirection;
  delta: number;
  replace?: boolean;
}
