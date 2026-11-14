import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import type { IRateLimitAggregatePolicy } from '../types/rateLimit.ts';

export interface IMiddlewareSystemOptionsAggregate extends IDecoratorMiddlewareSystemOptions {
  rateLimit?: IRateLimitAggregatePolicy;
}

@MiddlewareSystem<IMiddlewareSystemOptionsAggregate>({
  enable: false,
  dependencies: 'a-logger:httpLog',
  dependents: ['a-metrics:health', 'a-instance:app'],
})
export class MiddlewareSystemAggregate extends BeanBase implements IMiddlewareSystemExecute {
  async execute(options: IMiddlewareSystemOptionsAggregate, next: Next) {
    const denial = await this.scope.service.rateLimitAggregate.admit(options);
    if (!denial) return next();
    if (denial.status === 429) {
      this.ctx.set('Retry-After', String(denial.retryAfterSeconds));
    }
    this._reject(
      denial.status,
      denial.status === 429 ? 'Too Many Requests' : 'Service Unavailable',
    );
  }

  private _reject(status: number, message: string) {
    this.ctx.status = status;
    this.ctx.type = 'application/json';
    this.ctx.body = { code: status, message };
  }
}
