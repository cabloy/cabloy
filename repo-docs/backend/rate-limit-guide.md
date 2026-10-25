# Rate Limit Guide

## Overview

`a-ratelimit` provides two independent admission controls:

- The identity interceptor, `a-ratelimit:rateLimit`, limits matched Vona HTTP API actions across all application workers. It runs after Passport has resolved an authenticated or anonymous subject, and before request-body parsing, pipes, local middleware, and controller code.
- The aggregate system middleware, `a-ratelimit:aggregate`, limits incoming HTTP requests across the application before the application/instance readiness middleware and routing, but after the HTTP executor's initial instance lookup. It is disabled by default and requires explicit configuration.

The identity interceptor protects controller APIs only; its route matching and instance isolation do not describe the aggregate middleware. Keep volumetric and network-edge protection in the reverse proxy, WAF, or gateway even when aggregate admission is enabled. See [Controller AOP Guide](/backend/controller-aop-guide) for the general request-stage diagram and the distinction between a local aspect and a route override of an existing global onion.

The aggregate middleware documented here is a Cabloy Basic runtime addition. Cabloy Start is maintained separately and does not automatically receive this runtime change; shared documentation does not imply aggregate middleware availability in Start.

## Aggregate application admission

Enable the system middleware through application configuration, starting in observe mode:

```ts
config.onions.middlewareSystem['a-ratelimit:aggregate'] = {
  enable: true,
  rateLimit: {
    mode: 'observe',
    limit: 100,
  },
};
```

`100` is an example limit, not a measured application capacity or a recommended production value. An enabled aggregate middleware requires an explicit valid `limit` and a `mode` of either `'observe'` or `'enforce'`; there is no enabled default quota. Review observed traffic and Redis health before changing `mode` to `'enforce'`.

### Coverage and ordering

The aggregate middleware runs after `httpLog` and before health handling, the application/instance readiness middleware, routing, and authentication. The HTTP listener enters the executor first: it resolves the instance name and, when applicable, loads the instance record before dispatching system middleware. Aggregate admission does not protect that initial lookup or any instance registration it triggers, and requests that fail before middleware dispatch are not counted.

By default, aggregate admission covers all requests that reach the system middleware chain, including API, SSR, static-file, preflight, health, and unknown-route requests. Standard system middleware `match` and `ignore` options can narrow this coverage; they match the incoming `ctx.path`, including the API prefix where present, before routing. Traffic served entirely by a proxy or CDN never reaches this counter. Other programs, background work, and later WebSocket messages are outside its coverage.

Aggregate admission is independent of the identity interceptor. Both can be enabled, and a controller/action identity policy with `enable: false` does not bypass aggregate admission. There are no built-in aggregate path exemptions: unless explicitly excluded through system middleware matching, saturation can reject health probes and control requests before their handlers run. Account for this operational consequence before enforcing the quota.

### Shared counter and fixed windows

The aggregate counter uses the `limiter` Redis client and the application Redis prefix. It is shared across users, routes, instances, and workers rather than partitioned by identity or active instance. Multiple hosts using the same prefix and Redis share the quota; this is not physical-host discovery or an automatic per-host capacity limit. Keep custom application prefixes unique for applications or environments that require independent quotas.

The window is fixed at `1000` ms and aligned to one-second boundaries. Attempts count toward the window, including requests already rejected for exceeding the limit. As with other fixed-window counters, traffic can burst around a window boundary; the limit is not a rolling-window guarantee.

### Modes, responses, and logs

In `observe` mode, requests over the limit log `rate_limit.would_reject` and still continue to the next middleware. Redis failures log `rate_limit.redis_error` and fail open, allowing the request to continue.

In `enforce` mode, an over-limit request logs `rate_limit.rejected` and returns HTTP `429` with `Retry-After`. A Redis failure logs `rate_limit.redis_error` and returns HTTP `503` instead of allowing unbounded admission. Both responses are direct JSON bodies with the shape `{ code, message }`, even for requests expecting HTML; they do not enter the normal page/error rendering path.

Aggregate admission does not add success `RateLimit-*` headers. The identity interceptor's response headers remain unchanged when a request reaches that interceptor.

Aggregate logs use the same event names as the identity interceptor, with `scope: 'aggregate'`. Redis failures expose only a sanitized error class, not a raw error message. Do not include raw identities, routes, full URLs, or Redis keys in aggregate logs or metric labels.

## Identity interceptor enablement and rollout

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
  },
};
```

Use instance configuration when tenants require different identity policy values. Each identity interceptor key includes the active instance, so one instance never consumes another instance’s identity quota. The aggregate middleware instead shares one application-prefix quota across instances.

## Identity route policies

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

`enable`, matching, and ordering remain outer interceptor options. The nested `rateLimit` object contains the quota policy, so partial controller/action overrides inherit the remaining policy fields through normal Vona onion merging. Interceptor options use normal Vona precedence: application config, active-instance config, controller/action decorators, then controlled dynamic onion overrides used by tests. A controller/action can enable a narrower policy while the global interceptor is disabled, or set `enable: false` as a reviewed exemption after global activation. These identity policy fields belong to `a-ratelimit:rateLimit` at the post-Passport interceptor stage, not to another middleware. The aggregate system middleware has its own independent `rateLimit` configuration described above.

## Identity and Redis storage

The default `key: 'identity'` combines the proxy-trusted `ctx.ip` with the authenticated subject. Anonymous callers therefore receive an IP-scoped budget. Use `key: 'ip'` for an explicitly IP-only policy or `key: 'subject'` when a stable subject budget must follow a user across addresses.

Do not parse `X-Forwarded-For` in application code. Vona resolves `ctx.ip` according to its configured proxy trust settings. The trusted reverse proxy must replace client-supplied forwarding headers before forwarding a request.

The identity interceptor always uses the dedicated `limiter` Redis client; this infrastructure choice is not a route-policy field. It registers one atomic Lua fixed-window counter command during module startup and invokes that command for each evaluated request. Identity Redis keys contain the instance, policy, normalized route, window start, and a SHA-256 digest of the identity; raw IP addresses and subject IDs are not stored in key text.

Fixed windows provide one low-cost atomic operation per request. A limit can burst around a window boundary; choose lower limits or shorter windows for especially sensitive actions.

## Identity HTTP response contract

In enforce mode, evaluated requests expose RFC 9333 fields when `headers` is enabled:

- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset` (seconds until the window resets)

A rejected request returns Vona’s standard HTTP `429 Too Many Requests` response and also includes `Retry-After`. The rejected request does not reach body parsing or controller logic.

If the limiter Redis operation fails during enforce mode, Cabloy returns `503`, not `429`, and logs `rate_limit.redis_error`. This closed behavior preserves admission protection rather than silently accepting unbounded public traffic. During observe mode, a Redis failure is logged but does not turn the observation rollout into an outage.

## Operations

The primary structured events are `rate_limit.would_reject`, `rate_limit.rejected`, and `rate_limit.redis_error`. Identity interceptor events contain only route/policy/instance and error-class information. Aggregate events carry `scope: 'aggregate'` and omit route/identity detail, with only a sanitized error class for Redis failures. Do not add raw identities, full URLs, or Redis keys to logs or metric labels.

The `limiter` client may initially use the same Redis deployment as other Vona clients, but it is separately configured so production can isolate its endpoint, timeout, and capacity. Ensure Redis remains available before globally setting `enable: true` with `rateLimit.mode: 'enforce'`.

See [Controller AOP Guide](/backend/controller-aop-guide), [Config Guide](/backend/config-guide), [Redis Guide](/backend/redis-guide), and [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).
