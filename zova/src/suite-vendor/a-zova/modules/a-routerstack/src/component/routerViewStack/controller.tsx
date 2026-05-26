import { RouteLocationNormalizedLoadedGeneric } from '@cabloy/vue-router';
import { Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  BeanRouterViewBase,
  IRouterViewPropsBase,
  IRouteViewRouteMeta,
} from 'zova-module-a-router';

import type { ModelStack } from '../../model/stack.js';

export interface ControllerRouterViewStackProps extends IRouterViewPropsBase {}

@Controller()
export class ControllerRouterViewStack extends BeanRouterViewBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'skipSelf' })
  $$modelStack: ModelStack;

  public backRoute(route: RouteLocationNormalizedLoadedGeneric) {
    this.$$modelStack.backRoute(route);
    return true;
  }

  public forwardRoute(route: RouteLocationNormalizedLoadedGeneric) {
    this.$$modelStack.forwardRoute(route);
    return true;
  }

  protected prepareRouteMeta(route: RouteLocationNormalizedLoadedGeneric): IRouteViewRouteMeta {
    return this.$$modelStack.prepareRouteMeta(route);
  }

  protected getKeepAliveInclude(): string[] | undefined {
    return this.$$modelStack.keepAliveInclude;
  }
}
