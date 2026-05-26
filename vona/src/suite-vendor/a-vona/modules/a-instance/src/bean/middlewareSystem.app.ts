import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsApp extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsApp>({
  dependencies: 'a-core:overrideMethod',
})
export class MiddlewareSystemApp extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsApp, next: Next) {
    // check appReady
    if (!this.ctx.innerAccess) {
      if (this.app.meta.appClose) this.app.throw(423);
      await this.scope.service.instance.checkAppReady();
    }
    // next
    return next();
  }
}
