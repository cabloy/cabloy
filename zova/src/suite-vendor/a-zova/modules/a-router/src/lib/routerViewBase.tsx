import type { RouteLocationNormalizedLoadedGeneric } from '@cabloy/vue-router';

import { RouterView } from '@cabloy/vue-router';
import { h, KeepAlive, Transition } from 'vue';
import { BeanControllerBase, cast } from 'zova';

import type { IPageMeta } from '../types/pageMeta.js';
import type { IRouterViewSlotParams, IRouteViewRouteMeta } from '../types/routerView.js';

import { pageRouteKey, routerViewKey } from './const.js';

export interface IRouterViewPropsBase {}

export class BeanRouterViewBase extends BeanControllerBase implements IRouterViewPropsBase {
  protected async __init__() {
    this.bean._setBean(routerViewKey, this);
    this.$router.addRouterView(this);
  }

  protected __dispose__() {
    this.$router.removeRouterView(this);
  }

  public backRoute(_route: RouteLocationNormalizedLoadedGeneric) {
    return false;
  }

  public forwardRoute(_route: RouteLocationNormalizedLoadedGeneric) {
    return false;
  }

  public setPageMeta(_route: RouteLocationNormalizedLoadedGeneric, _pageMeta: IPageMeta) {}

  protected prepareRouteMeta(_route: RouteLocationNormalizedLoadedGeneric): IRouteViewRouteMeta {
    throw new Error('Not Implemented');
  }

  protected getKeepAliveInclude(): string[] | undefined {
    throw new Error('Not Implemented');
  }

  protected render() {
    const slots = {
      default: (component: IRouterViewSlotParams) => {
        const routeMeta = this.prepareRouteMeta(component.route);
        return h(Transition, null, {
          default: () => {
            const vnode = h(component.Component as any, {
              key: routeMeta.componentKey,
            });
            cast(vnode).zovaHostProviders = { [pageRouteKey]: component.route };
            return [
              h(
                KeepAlive,
                {
                  include: this.getKeepAliveInclude(),
                },
                [vnode],
              ),
            ];
          },
        });
      },
    };
    return <RouterView v-slots={slots}></RouterView>;
  }
}
