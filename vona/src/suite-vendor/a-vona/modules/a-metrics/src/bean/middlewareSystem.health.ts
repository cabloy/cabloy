import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

export interface IMiddlewareSystemOptionsHealth extends IDecoratorMiddlewareSystemOptions {}

@MiddlewareSystem<IMiddlewareSystemOptionsHealth>({
  dependents: 'a-instance:app',
})
export class MiddlewareSystemHealth extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsHealth, next: Next) {
    const path = this.ctx.path;
    if (!['/health/live', '/health/ready', '/health/startup'].includes(path)) return next();
    const health = await this.$scope.metrics.service.health.status(path);
    this.ctx.status = health.code;
    this.ctx.type = 'application/json';
    this.ctx.body = { status: health.status };
  }
}
