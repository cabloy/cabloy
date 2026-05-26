import type { Next } from 'vona';
import type { IDecoratorMiddlewareOptionsGlobal, IMiddlewareExecute } from 'vona-module-a-aspect';
import type { IOnionOptionsMeta } from 'vona-module-a-onion';

import { BeanBase, Global } from 'vona';
import { Middleware } from 'vona-module-a-aspect';

export interface IMiddlewareOptionsGate extends IDecoratorMiddlewareOptionsGlobal {
  gate?: IOnionOptionsMeta;
}

@Middleware<IMiddlewareOptionsGate>()
@Global()
export class MiddlewareGate extends BeanBase implements IMiddlewareExecute {
  async execute(options: IMiddlewareOptionsGate, next: Next) {
    // check gate
    if (!this.app.bean.onion.checkOnionOptionsMeta(options.gate)) {
      this.app.throw(403);
    }
    // next
    return next();
  }
}
