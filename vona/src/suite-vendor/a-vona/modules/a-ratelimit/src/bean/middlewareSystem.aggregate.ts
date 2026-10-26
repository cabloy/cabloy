import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import type { IRateLimitAggregatePolicy, IRateLimitResult } from '../types/rateLimit.ts';

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
    const policy = options.rateLimit;
    if (!policy) throw new Error('rate-limit aggregate policy is required when enabled');
    // Validation is synchronous; only Redis admission failures enter the catch below.
    const admission = this.scope.service.rateLimit.admitAggregate(policy);
    let result: IRateLimitResult;
    try {
      result = await admission;
    } catch (error) {
      this.$logger.warn({
        event: 'rate_limit.redis_error',
        scope: 'aggregate',
        mode: policy.mode,
        error: error instanceof Error ? error.name : 'Error',
      });
      if (policy.mode === 'observe') return next();
      this._reject(503, 'Service Unavailable');
      return;
    }
    if (result.allowed) return next();
    this.$logger.warn({
      event: policy.mode === 'observe' ? 'rate_limit.would_reject' : 'rate_limit.rejected',
      scope: 'aggregate',
      mode: policy.mode,
      limit: policy.limit,
    });
    if (policy.mode === 'observe') return next();
    this.ctx.set('Retry-After', String(result.retryAfterSeconds));
    this._reject(429, 'Too Many Requests');
  }

  private _reject(status: number, message: string) {
    this.ctx.status = status;
    this.ctx.type = 'application/json';
    this.ctx.body = { code: status, message };
  }
}
