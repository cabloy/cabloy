# Rate Limit Guide

## Overview

`a-ratelimit` provides two independent admission controls:

- The identity interceptor, `a-ratelimit:rateLimit`, limits matched Vona Controller Actions across all application workers. On the ordinary HTTP API path, it runs after Passport has resolved an authenticated or anonymous subject, and before request-body parsing, pipes, local middleware, and controller code.
- The aggregate provider, `a-ratelimit:aggregate`, limits application admission through system middleware and the common MCP business transport. On the ordinary HTTP path, it runs before the application/instance readiness middleware and routing, but after the HTTP executor's initial instance lookup. It is disabled by default and requires explicit configuration.

The identity interceptor protects Controller Actions only; its route matching and instance isolation do not describe aggregate admission. Both controls remain disabled by default, including for MCP. Keep volumetric and network-edge protection in the reverse proxy, WAF, or gateway even when aggregate admission is enabled: MCP admission occurs after transport checks and body parsing, not at the network edge. See [MCP admission and error mapping](#mcp-admission-and-error-mapping) below and [Controller AOP Guide](/backend/controller-aop-guide) for the general request-stage diagram and the distinction between a local aspect and a route override of an existing global onion.

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

On the ordinary HTTP path, the aggregate middleware runs after `httpLog` and before health handling, the application/instance readiness middleware, routing, and authentication. The HTTP listener enters the executor first: it resolves the instance name and, when applicable, loads the instance record before dispatching system middleware. Aggregate admission does not protect that initial lookup or any instance registration it triggers, and requests that fail before middleware dispatch are not counted.

Once enabled, aggregate admission covers ordinary HTTP requests that reach this middleware, including API, SSR, static-file, preflight, health, and unknown-route requests. Standard system middleware `enable`, `meta`, `match`, and `ignore` options govern coverage; path matching uses the incoming `ctx.path`, including the API prefix where present, before routing. MCP ingress is intercepted earlier and uses the same configured provider inside its common business transport instead of passing through this middleware a second time; see [MCP admission and error mapping](#mcp-admission-and-error-mapping). Traffic served entirely by a proxy or CDN never reaches this counter. Other programs, background work, and later WebSocket messages are outside its coverage.

Aggregate admission is independent of the identity interceptor. Both can be enabled, and a controller/action identity policy with `enable: false` does not bypass aggregate admission. There are no built-in aggregate path exemptions: unless explicitly excluded through system middleware matching, saturation can reject health probes and control requests before their handlers run. Account for this operational consequence before enforcing the quota.

### Shared counter and fixed windows

The aggregate counter uses the `limiter` Redis client and the application Redis prefix. Ordinary HTTP admission and both MCP ingress paths consume this same budget. It is shared across users, routes, instances, and workers rather than partitioned by identity or active instance. Multiple hosts using the same prefix and Redis share the quota; this is not physical-host discovery or an automatic per-host capacity limit. Keep custom application prefixes unique for applications or environments that require independent quotas.

The window is fixed at `1000` ms and aligned to one-second boundaries. Attempts that reach configured aggregate admission count toward the window, including requests then rejected for exceeding the limit; earlier transport or executor rejects do not. As with other fixed-window counters, traffic can burst around a window boundary; the limit is not a rolling-window guarantee.

### Modes, responses, and logs

In `observe` mode, requests over the limit log `rate_limit.would_reject` and still continue to the next middleware. Redis failures log `rate_limit.redis_error` and fail open, allowing the request to continue.

In `enforce` mode, an over-limit request logs `rate_limit.rejected` and returns HTTP `429` with `Retry-After`. A Redis failure logs `rate_limit.redis_error` and returns HTTP `503` instead of allowing unbounded admission. On the ordinary HTTP path, both responses remain direct JSON bodies with the shape `{ code, message }`, even for requests expecting HTML; they do not enter the normal page/error rendering path. MCP uses the safe JSON-RPC envelope described below without changing this generic HTTP body.

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

## MCP admission and error mapping

### Aggregate ingress boundary

Authenticated shared `/mcp` and the managed dedicated local HTTP listener use the same `businessTransport` admission boundary. The common transport calls configured aggregate admission as the first operation in its `executor.newCtx(...)` callback, before instance initialization, authentication, or tool-server construction. It uses the existing `a-ratelimit:aggregate` configuration and normal `enable`, `meta`, `match`, and `ignore` checks against the ingress `ctx.path`; there is no separate MCP quota or enabled default.

Each accepted JSON-RPC request for `initialize`, `tools/list`, `server/discover`, or `tools/call` reaches this gate once when configuration enables and matches it. A list or discovery request does not consume an aggregate unit per candidate tool. The system middleware ordering remains MCP ingress → HTTP logger → aggregate middleware: MCP handles its own exchange through the common transport, rather than reordering that graph or counting the same exchange again in downstream system middleware.

This is **not** a count of all network traffic or bad requests. Earlier framing, body-size/parse, method, ingress-wrapper, and busy/capacity rejections do not reach aggregate admission and are not counted. The body is parsed before the gate, and the executor's initial instance lookup precedes the callback; failures there are also outside the counter. Requests that pass these earlier checks can consume a unit even if later authentication or business admission fails. Keep upstream network/body protection and the existing per-worker capacity bounds.

### Controller identity policy

An MCP Controller tool still dispatches its real target Action through the ordinary executor. `Core.rateLimit(...)` policies and identity-interceptor `match`/`ignore` checks therefore apply to that target route, not to the `/mcp` ingress path or the tool's display name. Aggregate path matching, in contrast, uses the ingress path.

Prefer `key: 'subject'` for authenticated MCP Controller tools when the budget should follow the resolved user. Tool execution does not preserve the caller's real network IP in its target Action context, so do not interpret an IP-derived identity bucket there as a reliable per-client IP quota. The ordinary HTTP API's proxy-trusted `ctx.ip` behavior described above is unchanged. Identity quotas remain instance-scoped and independent of the shared aggregate budget.

### Safe limiter failures

Only trusted limiter error instances receive the MCP identity-limiter mapping: `RateLimitError` for `429` and `RateLimitUnavailableError` for `503`. A status field, matching name/message, or arbitrary object shaped like a limiter error is not sufficient. Other Action failures retain the ordinary safe error handling.

An identity-limiter rejection is a tool result, not an HTTP aggregate rejection. It has `isError: true`, one fixed text content item (`Too Many Requests` or `Service Unavailable`), and `_meta['cabloy/rateLimit']` with exactly the applicable safe projection:

```json
{
  "isError": true,
  "content": [{ "type": "text", "text": "Too Many Requests" }],
  "_meta": {
    "cabloy/rateLimit": {
      "kind": "rate_limit",
      "status": 429,
      "limit": 5,
      "retryAfterSeconds": 10
    }
  }
}
```

The numbers above are illustrative, not defaults. For an unavailable limiter, the fixed text is `Service Unavailable` and the metadata is `{ "kind": "rate_limit_unavailable", "status": 503 }`, with no retry seconds. Neither failure includes `structuredContent`; raw exception messages, identities, Redis keys, and internal policy details are not returned.

An aggregate rejection occurs before tool handling and instead returns HTTP `429` with `Retry-After` and a fixed safe JSON-RPC error. Like other ingress rejections, it uses a `null` response ID:

```json
{
  "jsonrpc": "2.0",
  "id": null,
  "error": {
    "code": -32000,
    "message": "Too Many Requests",
    "data": {
      "kind": "rate_limit",
      "status": 429,
      "limit": 100,
      "retryAfterSeconds": 1
    }
  }
}
```

An aggregate Redis failure in enforce mode returns HTTP `503`, JSON-RPC code `-32000`, fixed message `Service Unavailable`, and `error.data` equal to `{ "kind": "rate_limit_unavailable", "status": 503 }`. It supplies neither `Retry-After` nor retry seconds. Observe mode retains its existing log-and-continue behavior for over-limit and Redis-error cases. These MCP envelopes do not change ordinary HTTP aggregate `{ code, message }` responses or enable either limiter automatically.

## Operations

The primary structured events are `rate_limit.would_reject`, `rate_limit.rejected`, and `rate_limit.redis_error`. Identity interceptor events contain only route/policy/instance and error-class information. Aggregate events carry `scope: 'aggregate'` and omit route/identity detail, with only a sanitized error class for Redis failures. Do not add raw identities, full URLs, or Redis keys to logs or metric labels.

The `limiter` client may initially use the same Redis deployment as other Vona clients, but it is separately configured so production can isolate its endpoint, timeout, and capacity. Ensure Redis remains available before globally setting `enable: true` with `rateLimit.mode: 'enforce'`.

See [Controller AOP Guide](/backend/controller-aop-guide), [Config Guide](/backend/config-guide), [Redis Guide](/backend/redis-guide), and [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).
