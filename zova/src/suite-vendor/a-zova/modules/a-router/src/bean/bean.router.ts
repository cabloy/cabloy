import type {
  NavigationGuardWithThis,
  NavigationHookAfter,
  RouteLocationNormalizedLoadedGeneric,
  Router,
  RouterOptions,
} from '@cabloy/vue-router';

import { BeanBase, Use } from 'zova';
import { Bean } from 'zova-module-a-bean';

import { RouterGuardDisposers } from '../lib/routerGuardDisposers.js';
import { BeanRouterViewBase } from '../lib/routerViewBase.js';
import { ModelPageData } from '../model/pageData.js';
import { IPageMeta } from '../types/pageMeta.js';
import { TypeErrorListener } from '../types/router.js';
import { SysRouter } from './sys.router.js';

export interface BeanRouterInitOptions {
  mainRouter?: boolean;
  routerOptions?: RouterOptions;
  prepareNavigation?: (to: unknown) => Promise<void> | void;
  embeddedView?: 'page';
}

export interface BeanRouter extends Omit<
  SysRouter,
  '$beanFullName' | '$onionName' | '$onionOptions'
> {}

@Bean()
export class BeanRouter extends BeanBase {
  private _vueRouterApp: Router;
  private _routerGuardDisposers = new RouterGuardDisposers();
  private _routerViews: BeanRouterViewBase[] = [];
  private _disposed = false;

  @Use()
  $$sysRouter: SysRouter;

  @Use()
  $$modelPageData: ModelPageData; // for prepare pageData on server

  get router(): Router {
    return this._vueRouterApp;
  }

  get isEmbedded() {
    return this._isEmbedded;
  }

  private _isEmbedded = false;
  private _embeddedView?: 'page';
  private _prepareNavigation?: (to: unknown) => Promise<void> | void;

  /**
   * Returns the initial RouterView depth for an embedded page-only host.
   *
   * SysRouter records the synthetic layout parents it creates. The page-only
   * host skips only those exact records; routes registered with
   * `meta.layout: false` still start at depth zero.
   */
  public getEmbeddedRouterViewDepth(route: RouteLocationNormalizedLoadedGeneric): number {
    if (this._embeddedView !== 'page') return 0;
    return this.$$sysRouter.isSyntheticLayoutRouteRecord(route.matched[0]) ? 1 : 0;
  }

  public dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._routerGuardDisposers.dispose();
    this._routerViews = [];
    const router = this._vueRouterApp as Router & {
      __prepareNavigation?: (to: unknown) => Promise<void> | void;
    };
    if (router) router.__prepareNavigation = undefined;
  }

  protected __dispose__() {
    // Router instances can be borrowed through page host providers. Their
    // creator explicitly calls dispose() when the router itself is finished.
  }

  protected __get__(prop: string) {
    // SymbolRouter first
    const value = this._vueRouterApp?.[prop];
    if (value !== undefined) return value;
    return this.$$sysRouter?.[prop];
  }

  protected async __init__(mainRouterOrOptions?: boolean | BeanRouterInitOptions) {
    const options: BeanRouterInitOptions =
      typeof mainRouterOrOptions === 'boolean'
        ? { mainRouter: mainRouterOrOptions }
        : (mainRouterOrOptions ?? {});
    this._isEmbedded = options.mainRouter === false;
    this._embeddedView = options.embeddedView;
    this._prepareNavigation = options.prepareNavigation;
    // create router
    this._vueRouterApp = this.$$sysRouter.createRouter(options.routerOptions);
    const router = this._vueRouterApp as Router & {
      __prepareNavigation?: (to: unknown) => Promise<void> | void;
    };
    router.__prepareNavigation = this._prepareNavigation;
    if (!options.mainRouter) {
      // emit event
      await this.app.meta.event.emit('a-router:routerGuards', this);
    }
  }

  addRouterView(routerView: BeanRouterViewBase) {
    this._routerViews.push(routerView);
    if (!this._isEmbedded) return;
    const route = this._vueRouterApp.currentRoute.value;
    if (route?.matched.length > 0) {
      routerView.forwardRoute(route);
    }
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
    return this._routerGuardDisposers.add(this._vueRouterApp.beforeEach(guard));
  }

  beforeResolve(guard: NavigationGuardWithThis<undefined>): () => void {
    return this._routerGuardDisposers.add(this._vueRouterApp.beforeResolve(guard));
  }

  afterEach(guard: NavigationHookAfter): () => void {
    return this._routerGuardDisposers.add(this._vueRouterApp.afterEach(guard));
  }

  onError(handler: TypeErrorListener): () => void {
    return this._routerGuardDisposers.add(this._vueRouterApp.onError(handler));
  }

  setPageMeta(route: RouteLocationNormalizedLoadedGeneric, pageMeta: IPageMeta) {
    for (const routerView of this._routerViews) {
      routerView.setPageMeta(route, pageMeta);
    }
  }
}
