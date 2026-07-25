# Vona HTTP Rate Limit Architecture

## Invariants

- `a-ratelimit:rateLimit` is a global interceptor, so it runs after the Passport guard and before body parsing, pipes, local middleware, and actions. Its decorator default is `enable: false`; activation is controlled through the outer standard interceptor options, while quota behavior is contained in the nested `rateLimit` option rather than module configuration.
- Inbound admission is one atomic Redis Lua operation. Do not replace it with `a-cache` get/set calls or a distributed lock on every request.
- Redis keys must include the active Cabloy instance, stable policy/action identity, normalized route template, window start, and a one-way identity digest. Do not put raw IPs, user/auth IDs, query values, or concrete URL parameters in a key.
- The primary route identity is `ctx.route.routePathRaw`, not a concrete request URL.
- Redis unavailability in `enforce` mode is HTTP 503. It is not 429 and must not silently permit an unprotected request.
- `observe` mode executes the same admission calculation but never returns a client-side rate-limit response.
- 429 headers must be applied before throwing Vona’s standard 429 error.
- Explicit contention tests must place every competing request in a distinct `app.bean.executor.mockCtx(...)`. Runner-level concurrency is not evidence of atomic admission.

## Non-goals

This module protects matched controller APIs. System middleware, reverse proxy, WAF, or gateway controls own protection for static assets, unknown routes, and volumetric network attacks. Durable subscription or billing quotas belong to domain services and persistent transactions rather than this ephemeral request limiter.
