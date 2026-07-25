import type { Next } from 'vona';
import type { IDecoratorInterceptorOptionsGlobal, IInterceptorExecute } from 'vona-module-a-aspect';

import { BeanBase, Global } from 'vona';
import { Interceptor } from 'vona-module-a-aspect';

import type { IRateLimitPolicy, IRateLimitResult } from '../types/rateLimit.ts';

export interface IInterceptorOptionsRateLimit extends IDecoratorInterceptorOptionsGlobal {
  rateLimit?: Partial<IRateLimitPolicy>;
}

@Interceptor<IInterceptorOptionsRateLimit>({
  enable: false,
  dependents: 'a-body:bodyReq',
  rateLimit: {
    mode: 'enforce',
    client: 'limiter',
    limit: 120,
    windowMs: 60_000,
    key: 'identity',
    headers: true,
    failureMode: 'closed',
  },
})
@Global()
export class InterceptorRateLimit extends BeanBase implements IInterceptorExecute {
  async execute(options: IInterceptorOptionsRateLimit, next: Next) {
    const policy = options.rateLimit as IRateLimitPolicy | undefined;
    if (!policy) throw new Error('rate-limit policy is required when the interceptor is enabled');
    let result: IRateLimitResult;
    try {
      result = await this.scope.service.rateLimit.admit(policy);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('rate-limit ')) throw error;
      this.$logger.warn({
        event: 'rate_limit.redis_error',
        route: this.ctx.route.routePathRaw,
        instanceName: this.ctx.instanceName,
        mode: policy.mode,
        failureMode: policy.failureMode,
        error: error instanceof Error ? error.message : String(error),
      });
      if (policy.mode === 'observe') return next();
      return this.app.throw(503);
    }
    if (policy.mode === 'observe') {
      if (!result.allowed) {
        this.$logger.warn({
          event: 'rate_limit.would_reject',
          route: this.ctx.route.routePathRaw,
          instanceName: this.ctx.instanceName,
          limit: result.limit,
        });
      }
      return next();
    }
    if (policy.headers) this._setHeaders(result);
    if (result.allowed) return next();
    this.ctx.set('Retry-After', String(result.retryAfterSeconds));
    this.$logger.warn({
      event: 'rate_limit.rejected',
      route: this.ctx.route.routePathRaw,
      instanceName: this.ctx.instanceName,
      limit: result.limit,
    });
    this.app.throw(429);
  }

  private _setHeaders(result: IRateLimitResult) {
    this.ctx.set('RateLimit-Limit', String(result.limit));
    this.ctx.set('RateLimit-Remaining', String(result.remaining));
    this.ctx.set('RateLimit-Reset', String(Math.max(1, Math.ceil(result.resetAfterMs / 1000))));
  }
}
