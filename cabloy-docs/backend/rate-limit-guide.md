# Rate Limit Guide

## Overview

`a-ratelimit` limits matched Vona HTTP API actions across all application workers. It runs as the global `a-ratelimit:rateLimit` interceptor after Passport has resolved an authenticated or anonymous subject, and before request-body parsing, pipes, local middleware, and controller code.

It protects controller APIs. Put volumetric, static-file, unknown-route, and network-edge protection in the reverse proxy, WAF, or gateway.

## Enablement and rollout

The interceptor ships with `enable: false` to preserve compatibility. Enable the global interceptor through standard onion configuration and begin in observe mode:

```ts
config.onions.interceptor['a-ratelimit:rateLimit'] = {
  enable: true,
  rateLimit: {
    mode: 'observe',
    limit: 120,
    windowMs: 60_000,
  },
};
```

`observe` records requests that would exceed the policy but does not reject them. Review `rate_limit.would_reject` events and Redis health, then deliberately enable enforcement:

```ts
config.onions.interceptor['a-ratelimit:rateLimit'] = {
  enable: true,
  rateLimit: {
    mode: 'enforce',
    limit: 120,
    windowMs: 60_000,
    key: 'identity',
    headers: true,
    failureMode: 'closed',
  },
};
```

Use instance configuration when tenants require different policy values. Each limiter key always includes the active instance, so one instance never consumes another instance’s quota.

## Route policies

Use `Core.rateLimit(...)` on a controller for its baseline policy, or on an action for a stricter policy, an intentional shared bucket, or an explicit exemption:

```ts
import { Core } from 'vona-module-a-core';

@Core.rateLimit({
  enable: true,
  rateLimit: {
    mode: 'enforce',
    limit: 5,
    windowMs: 60_000,
    name: 'password-reset',
  },
})
@Web.post('request-reset')
@Passport.public()
async requestReset() {}

@Core.rateLimit({ enable: false })
@Web.get('health')
@Passport.public()
health() {}
```

`enable`, matching, and ordering remain outer interceptor options. The nested `rateLimit` object contains the quota policy, so partial controller/action overrides inherit the remaining policy fields through normal Vona onion merging. Interceptor options use normal Vona precedence: application config, active-instance config, controller/action decorators, then controlled dynamic onion overrides used by tests. A controller/action can enable a narrower policy while the global interceptor is disabled, or set `enable: false` as a reviewed exemption after global activation. Do not put this policy in another middleware’s options: only `a-ratelimit:rateLimit` consumes the `rateLimit` object at the post-Passport interceptor stage.

## Identity and Redis storage

The default `key: 'identity'` combines the proxy-trusted `ctx.ip` with the authenticated subject. Anonymous callers therefore receive an IP-scoped budget. Use `key: 'ip'` for an explicitly IP-only policy or `key: 'subject'` when a stable subject budget must follow a user across addresses.

Do not parse `X-Forwarded-For` in application code. Vona resolves `ctx.ip` according to its configured proxy trust settings. The trusted reverse proxy must replace client-supplied forwarding headers before forwarding a request.

The limiter uses the dedicated `limiter` Redis client and one atomic Lua fixed-window counter operation. Redis keys contain the instance, policy, normalized route, window start, and a SHA-256 digest of the identity; raw IP addresses and subject IDs are not stored in key text.

Fixed windows provide one low-cost atomic operation per request. A limit can burst around a window boundary; choose lower limits or shorter windows for especially sensitive actions.

## HTTP response contract

In enforce mode, evaluated requests expose RFC 9333 fields when `headers` is enabled:

- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset` (seconds until the window resets)

A rejected request returns Vona’s standard HTTP `429 Too Many Requests` response and also includes `Retry-After`. The rejected request does not reach body parsing or controller logic.

If the limiter Redis operation fails during enforce mode, Cabloy returns `503`, not `429`, and logs `rate_limit.redis_error`. This closed behavior preserves admission protection rather than silently accepting unbounded public traffic. During observe mode, a Redis failure is logged but does not turn the observation rollout into an outage.

## Operations

The primary structured events are `rate_limit.would_reject`, `rate_limit.rejected`, and `rate_limit.redis_error`. They contain only route/policy/instance and error-class information; do not add raw identities, full URLs, or Redis keys to logs or metric labels.

The `limiter` client may initially use the same Redis deployment as other Vona clients, but it is separately configured so production can isolate its endpoint, timeout, and capacity. Ensure Redis remains available before globally setting `enable: true` with `rateLimit.mode: 'enforce'`.

See [Controller AOP Guide](/backend/controller-aop-guide), [Config Guide](/backend/config-guide), [Redis Guide](/backend/redis-guide), and [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).
