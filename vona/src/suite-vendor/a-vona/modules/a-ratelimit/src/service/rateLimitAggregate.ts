import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IMiddlewareSystemOptionsAggregate } from '../bean/middlewareSystem.aggregate.ts';
import type { IRateLimitResult, RateLimitAggregateDenial } from '../types/rateLimit.ts';

@Service()
export class ServiceRateLimitAggregate extends BeanBase {
  async admitConfigured(): Promise<RateLimitAggregateDenial | undefined> {
    const options = this.bean.onion.middlewareSystem.getOnionOptions('a-ratelimit:aggregate');
    if (!options || !this.bean.onion.checkOnionOptionsEnabled(options, this.ctx.path)) return;
    return this.admit(options);
  }

  async admit(
    options: IMiddlewareSystemOptionsAggregate,
  ): Promise<RateLimitAggregateDenial | undefined> {
    const policy = options.rateLimit;
    if (!policy) {
      throw new Error('rate-limit aggregate policy is required when enabled');
    }
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
      if (policy.mode === 'observe') return;
      return { status: 503 };
    }
    if (result.allowed) return;
    this.$logger.warn({
      event: policy.mode === 'observe' ? 'rate_limit.would_reject' : 'rate_limit.rejected',
      scope: 'aggregate',
      mode: policy.mode,
      limit: policy.limit,
    });
    if (policy.mode === 'observe') return;
    return {
      status: 429,
      limit: result.limit,
      retryAfterSeconds: result.retryAfterSeconds,
    };
  }
}
