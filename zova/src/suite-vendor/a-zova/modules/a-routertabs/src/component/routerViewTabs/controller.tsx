import { RouteLocationNormalizedLoadedGeneric } from '@cabloy/vue-router';
import { Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  BeanRouterViewBase,
  IPageMeta,
  IRouterViewPropsBase,
  IRouteViewRouteMeta,
} from 'zova-module-a-router';

import type { ModelTabs } from '../../model/tabs.js';

export interface ControllerRouterViewTabsProps extends IRouterViewPropsBase {}

@Controller()
export class ControllerRouterViewTabs extends BeanRouterViewBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'skipSelf' })
  $$modelTabs: ModelTabs;

  public backRoute(route: RouteLocationNormalizedLoadedGeneric) {
    this.$$modelTabs.backRoute(route);
    return true;
  }

  public forwardRoute(route: RouteLocationNormalizedLoadedGeneric) {
    this.$$modelTabs.forwardRoute(route);
    return true;
  }

  public setPageMeta(route: RouteLocationNormalizedLoadedGeneric, pageMeta: IPageMeta) {
    this.$$modelTabs.setPageMeta(route, pageMeta);
  }

  protected prepareRouteMeta(route: RouteLocationNormalizedLoadedGeneric): IRouteViewRouteMeta {
    return this.$$modelTabs.prepareRouteMeta(route);
  }

  protected getKeepAliveInclude(): string[] | undefined {
    return this.$$modelTabs.keepAliveInclude;
  }
}
