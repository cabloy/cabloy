import { RouterView } from '@cabloy/vue-router';
import { h } from 'vue';
import { cast } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { pageRouteKey } from '../../lib/const.js';
import { BeanRouterViewBase } from '../../lib/routerViewBase.js';

@Controller()
export class ControllerRouterViewEmpty extends BeanRouterViewBase {
  protected async __init__() {}

  protected render() {
    const slots = {
      default: component => {
        const vnode = h(component.Component);
        cast(vnode).zovaHostProviders = { [pageRouteKey]: component.route };
        return vnode;
      },
    };
    return <RouterView v-slots={slots}></RouterView>;
  }
}
