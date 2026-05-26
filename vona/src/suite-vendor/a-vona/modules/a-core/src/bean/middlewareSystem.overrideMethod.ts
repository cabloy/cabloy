import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import overrideMethodImport from 'koa-override';
import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

const overrideMethod = overrideMethodImport as any;

export interface IMiddlewareSystemOptionsOverrideMethod extends IDecoratorMiddlewareSystemOptions {
  allowedMethods?: string[];
}

@MiddlewareSystem<IMiddlewareSystemOptionsOverrideMethod>({
  dependencies: 'a-core:notfound',
  allowedMethods: ['POST'],
})
export class MiddlewareSystemOverrideMethod extends BeanBase implements IMiddlewareSystemExecute {
  private _overrideMethod: any;

  async execute(options: IMiddlewareSystemOptionsOverrideMethod, next: Next) {
    if (!this._overrideMethod) {
      this._overrideMethod = overrideMethod(options);
    }
    return this._overrideMethod(this.ctx, next);
  }
}
