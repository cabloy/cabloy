import { createHash } from 'node:crypto';
import { BeanBase, cast } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IRateLimitPolicy, IRateLimitResult } from '../types/rateLimit.ts';

@Service()
export class ServiceRateLimit extends BeanBase {
  private get clientRedis() {
    return this.bean.redis.get('limiter');
  }

  async admit(policy: IRateLimitPolicy): Promise<IRateLimitResult> {
    this._validatePolicy(policy);
    const now = Date.now();
    const key = this._createKey(policy, now);
    const result = (await cast(this.clientRedis).rateLimitAdmit(key, String(policy.windowMs))) as [
      number | string,
      number | string,
    ];
    const current = Number(result[0]);
    const resetAfterMs = Math.max(0, Number(result[1]));
    return {
      allowed: current <= policy.limit,
      limit: policy.limit,
      remaining: Math.max(0, policy.limit - current),
      resetAfterMs,
      retryAfterSeconds: Math.max(1, Math.ceil(resetAfterMs / 1000)),
    };
  }

  private _createKey(policy: IRateLimitPolicy, now: number) {
    const route = this.ctx.route;
    const identity = this._getIdentity(policy);
    const identityHash = createHash('sha256').update(identity).digest('base64url');
    const policyName = policy.name ?? `${route.controllerBeanFullName}:${String(route.action)}`;
    const routeName = `${route.routeMethod}:${route.routePathRaw}`;
    const windowStart = Math.floor(now / policy.windowMs) * policy.windowMs;
    const instanceName = this.ctx.instanceName ?? 'default';
    return [
      'rate-limit:v1',
      encodeURIComponent(instanceName),
      encodeURIComponent(policyName),
      encodeURIComponent(routeName),
      identityHash,
      windowStart,
    ].join(':');
  }

  private _getIdentity(policy: IRateLimitPolicy) {
    const ip = this.ctx.ip || 'unknown';
    const auth = this.bean.passport.currentAuth;
    const user = this.bean.passport.currentUser;
    const subject = user?.anonymous ? 'anonymous' : (auth?.id ?? user?.id ?? 'anonymous');
    if (policy.key === 'ip') return `ip:${ip}`;
    if (policy.key === 'subject') return `subject:${subject}`;
    return `ip:${ip}|subject:${subject}`;
  }

  private _validatePolicy(policy: IRateLimitPolicy) {
    if (!Number.isSafeInteger(policy.limit) || policy.limit < 1) {
      throw new Error('rate-limit limit must be a positive safe integer');
    }
    if (
      !Number.isSafeInteger(policy.windowMs) ||
      policy.windowMs < 1_000 ||
      policy.windowMs > 86_400_000
    ) {
      throw new Error('rate-limit windowMs must be an integer between 1000 and 86400000');
    }
    if (!['identity', 'ip', 'subject'].includes(policy.key)) {
      throw new Error('rate-limit key must be identity, ip, or subject');
    }
  }
}
