import type {
  NavigationGuardWithThis,
  NavigationHookAfter,
  RouteLocationNormalizedLoadedGeneric,
  Router,
} from '@cabloy/vue-router';

import { BeanBase, TypeEventOff, Use } from 'zova';
import { Bean } from 'zova-module-a-bean';

import { BeanRouterViewBase } from '../lib/routerViewBase.js';
import { ModelPageData } from '../model/pageData.js';
import { IPageMeta } from '../types/pageMeta.js';
import { TypeErrorListener } from '../types/router.js';
import { SysRouter } from './sys.router.js';

export interface BeanRouter extends Omit<
  SysRouter,
  '$beanFullName' | '$onionName' | '$onionOptions'
> {}

@Bean()
export class BeanRouter extends BeanBase {
  private _vueRouterApp: Router;
  private _eventRouterGuards: TypeEventOff[] = [];
  private _routerViews: BeanRouterViewBase[] = [];

  @Use()
  $$sysRouter: SysRouter;

  @Use()
  $$modelPageData: ModelPageData; // for prepare pageData on server

  get router(): Router {
    return this._vueRouterApp;
  }

  protected __dispose__() {
    for (const fn of this._eventRouterGuards) {
      fn();
    }
  }

  protected __get__(prop: string) {
    // SymbolRouter first
    const value = this._vueRouterApp?.[prop];
    if (value !== undefined) return value;
    return this.$$sysRouter?.[prop];
  }

  protected async __init__(mainRouter?: boolean) {
    // create router
    this._vueRouterApp = this.$$sysRouter.createRouter();
    if (!mainRouter) {
      // emit event
      await this.app.meta.event.emit('a-router:routerGuards', this);
    }
  }

  addRouterView(routerView: BeanRouterViewBase) {
    this._routerViews.push(routerView);
  }

  removeRouterView(routerView: BeanRouterViewBase) {
    const index = this._routerViews.findIndex(item => item === routerView);
    if (index > -1) {
      this._routerViews.splice(index, 1);
    }
  }

  afterEachBackRoute(route: RouteLocationNormalizedLoadedGeneric) {
    for (const routerView of this._routerViews) {
      const res = routerView.backRoute(route);
      if (res) break;
    }
  }

  afterEachForwardRoute(route: RouteLocationNormalizedLoadedGeneric) {
    for (const routerView of this._routerViews) {
      const res = routerView.forwardRoute(route);
      if (res) break;
    }
  }

  beforeEach(guard: NavigationGuardWithThis<undefined>): () => void {
    const fn = this._vueRouterApp.beforeEach(guard);
    this._eventRouterGuards.push(fn);
    return fn;
  }

  beforeResolve(guard: NavigationGuardWithThis<undefined>): () => void {
    const fn = this._vueRouterApp.beforeResolve(guard);
    this._eventRouterGuards.push(fn);
    return fn;
  }

  afterEach(guard: NavigationHookAfter): () => void {
    const fn = this._vueRouterApp.afterEach(guard);
    this._eventRouterGuards.push(fn);
    return fn;
  }

  onError(handler: TypeErrorListener): () => void {
    const fn = this._vueRouterApp.onError(handler);
    this._eventRouterGuards.push(fn);
    return fn;
  }

  setPageMeta(route: RouteLocationNormalizedLoadedGeneric, pageMeta: IPageMeta) {
    for (const routerView of this._routerViews) {
      routerView.setPageMeta(route, pageMeta);
    }
  }
}
