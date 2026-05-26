import type { TypeEventOff } from 'zova';

import { BeanBase, Virtual } from 'zova';
import { Bean } from 'zova-module-a-bean';

import type { BeanRouter } from './bean.router.js';

@Bean()
@Virtual()
export class BeanRouterGuardsBase extends BeanBase {
  private _eventRouterGuards: TypeEventOff;

  protected async __init__() {
    this._eventRouterGuards = this.app.meta.event.on(
      'a-router:routerGuards',
      async (router, next) => {
        this.onRouterGuards(router);
        return await next();
      },
    );
  }

  protected __dispose__() {
    this.dispose();
  }

  dispose() {
    if (this._eventRouterGuards) {
      this._eventRouterGuards();
    }
  }

  protected onRouterGuards(_router: BeanRouter) {}
}
