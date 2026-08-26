# SSR `retrieveMenus` Role-Aware Cache Evaluation

## Purpose

This note records the source-backed evaluation of role-aware caching for SSR menu retrieval. It preserves the current cache boundary, the freshness and authorization implications of that boundary, and the conditions that must be satisfied before introducing a caller-specific visible-menu cache.

It supplements [ADR 0006: SSR Site Access and Role Model](../decisions/0006-ssr-site-access-and-role-model.md). It does not replace that decision, change its status, or introduce a new authorization boundary.

## Scope and current conclusion

The current design is correct:

- cache Site-, instance-, host-, and locale-specific **structural** menu declarations;
- retain static `roles` policy only in that private prepared structure;
- project visible menu items for the current Passport on every retrieval; and
- do not cache a visible response by user, Passport, role set, token, or session.

Do not add a caller-specific role-aware menu-result cache without evidence that the request-local projection itself is a material bottleneck. The present projection is a small filter-and-copy pass over declarations that were already prepared, localized, and link-normalized.

## Current retrieval path

The menu endpoint is intentionally public:

1. `home-base` `ControllerMenu.retrieveMenus()` exposes `GET menu/:publicPath?` with `@Passport.public()`.
2. `ServiceMenu.retrieveMenus()` delegates to `bean.ssr.retrieveMenus(publicPath)` and supplies a default menu when no SSR Site matches.
3. `BeanSsr.retrieveMenus()` resolves the enabled SSR Site from `publicPath`, then emits `a-ssr:retrieveMenus` around the Site instance's `retrieveMenus()` call.
4. `BeanSsrSiteBase.retrieveMenus()` reads prepared declarations and projects the response in the active request context.

Representative sources:

- `vona/src/suite/a-home/modules/home-base/src/controller/menu.ts`
- `vona/src/suite/a-home/modules/home-base/src/service/menu.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/bean.ssr.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`

`@Passport.public()` permits anonymous retrieval; it does not remove the current Passport from an authenticated request. Visibility is therefore still projected against the current Passport when one exists.

## Structural cache and request-local projection

### Cache identity and contents

`BeanSsrSiteBase._getMenusCache()` stores prepared data under `app.meta[SymbolCacheMenus]`. Its effective identity is:

- SSR Site bean full name;
- `ctx.instanceName`;
- `ctx.host`; and
- `ctx.locale`.

The value is a structural `menus`/`groups` result assembled from enabled `ssrMenu` and `ssrMenuGroup` onions. Preparation filters declarations by Site and locale, expands `item`/`items`, localizes titles and descriptions, and normalizes menu links. The prepared menu items retain their static `roles` metadata.

This cache intentionally does **not** contain:

- a user-specific result;
- a Passport-, role-, token-, or session-specific result; or
- a final public DTO with authorization policy removed.

`SymbolCacheMenus` is a process-local SSR runtime/HMR cache. `clearAllCacheMenus(app)` clears this structural cache for declaration changes such as SSR menu, menu-group, or locale HMR. A role membership change does not change a structural menu declaration and must not use this cache invalidator as a substitute for authorization/session handling.

Relevant sources:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/const.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/hmr.ssrMenu.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/hmr.ssrMenuGroup.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.hmrReload.ts`

### Visibility projection invariant

For every `retrieveMenus()` call, the Site base:

1. reads the prepared structural result;
2. keeps items with omitted or empty `roles` arrays;
3. for a nonempty `roles` array, calls `passport.checkRoleName(...)`, whose semantics are any matching current role name;
4. creates a new public item object without `roles`; and
5. returns that request's menu projection without mutating prepared items.

The `roles` field is server-only static navigation metadata. It must never reach the public menu DTO, and request-specific filtering must never remove data from the shared structural cache. Caching an already filtered privileged response without a complete policy key would allow a later caller to receive an incorrect result.

`groups` remain structural. The Admin and Web Zova menu models recursively build the menu tree and omit a group when it has no visible children.

Relevant sources:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrMenu.ts`
- `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/model/menu.ts`
- `zova/src/suite/a-home/modules/home-layoutweb/src/model/menu.ts`

## Authorization and freshness boundaries

### Menu visibility is not authorization

Menu filtering controls navigation disclosure only. It must not be treated as authorization for:

- Zova page admission;
- Vona controllers or actions;
- APIs and resources; or
- data mutation.

Route admission and Vona Passport/permission guards remain authoritative. This separation is the reason a public menu endpoint can safely return a Passport-filtered navigation projection while protected operations remain independently guarded.

### Passport and client-state freshness

Role membership is evaluated on every backend menu retrieval. The concrete Passport adapter deserializes a subsequent authenticated request by loading the current user, auth record, and roles from persistence. Consequently, a later request can reflect a role membership change without invalidating the structural menu declaration cache.

A current request holds a Passport snapshot. A database role change during that request does not automatically replace `ctx.state.passport.roles`; the mutation owner must refresh the authoritative Passport state when same-request behavior requires it. If revocation must terminate existing sessions, session/token revocation is a separate policy decision, not a menu-cache invalidation mechanism.

The current Zova Admin and Web menu query key is:

```ts
['retrieveMenus', APP_PUBLIC_PATH, locale];
```

It intentionally has no username, authentication-state, role-name, role-ID, or authorization-fingerprint dimension. Authentication and policy-mutation flows own any necessary client query invalidation/refetch under this resource-scoped key. Changing the frontend key solely because the backend projects a current-Passport result would make identity a cache dimension without resolving the underlying role/session freshness contract.

Relevant sources:

- `vona/src/suite/a-home/modules/home-user/src/service/passportAdapter.ts`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/model/menu.ts`
- `zova/src/suite/a-home/modules/home-layoutweb/src/model/menu.ts`
- [ADR 0006: SSR Site Access and Role Model](../decisions/0006-ssr-site-access-and-role-model.md)

## Why a role-aware result cache is not currently justified

A separate result cache would avoid only the request-local role filter and public-item projection. It would also add all of the following obligations:

- a canonical role-policy key and bounded cache cardinality;
- safe handling of anonymous versus authenticated-empty-role state;
- defensive copying or immutability so callers cannot mutate cached response objects;
- invalidation for role membership, role-policy, menu-policy, locale, Site, and host changes;
- propagation guarantees in multi-worker or multi-instance deployment; and
- isolation tests across alternating and concurrent identities.

The existing `a-permission` role-set cache demonstrates role-ID normalization and cross-worker cache facilities, but it does not make those lifecycle requirements disappear for menus. Reusing that pattern without a complete mutation/invalidation design would create a new privilege-leak and staleness surface.

## Future implementation thresholds

Reconsider a caller-specific menu-result cache only when **all** of the following are demonstrated and designed:

1. **Measured need:** representative production or load profiling attributes a material portion of menu retrieval latency or CPU to request-local filtering/projection itself, rather than declaration preparation, authentication, transport, or frontend rendering.
2. **Static policy input:** visibility still depends only on a finite, canonicalizable policy input. Normalize stable role IDs by deduplicating and sorting them; distinguish any additional Passport state when it affects visibility. Do not key by user ID unless visibility is actually user-specific.
3. **Bounded storage:** document expected role-set cardinality, memory/Redis budget, eviction/TTL behavior, and behavior on cache misses. Frequent requests alone are not evidence that a role-result cache is beneficial.
4. **Safe result ownership:** cache only a fully public projection with `roles` removed. Never return cached arrays, menu items, groups, or nested mutable data directly to callers; produce an independent response graph per caller or enforce immutability.
5. **Complete invalidation:** define post-commit invalidation for role grants, revocations, role-definition/policy changes, menu-policy changes, locale changes, and structural SSR menu changes. A role-set key cannot in general be precisely deleted after a role change because the old combinations may be unknown and a role affects many users.
6. **Deployment correctness:** provide verified propagation across the actual worker/instance topology. A process-local `app.meta` deletion is not a distributed invalidation guarantee. If Summer Cache/Redis or a broadcast event is introduced, document failure and expiry behavior.
7. **Isolation coverage:** prove that warm-cache order cannot leak privileged output: anonymous → privileged, privileged → lower privilege, equivalent role ordering/duplicates, and concurrent role sets. Also prove that returned objects cannot pollute subsequent hits and that private policy metadata is absent from every DTO.
8. **Authorization separation:** ensure a cache hit remains navigation disclosure only and never replaces route, controller, API, resource, or mutation authorization checks.

Before caller-specific caching, prefer a caller-independent optimization such as a prepared static role index derived from structural menu declarations. It can reduce repeated scanning while retaining the safer structural-cache/request-projection boundary.

A new ADR is required before changing this boundary for dynamic policy, including database-driven tenant/workspace rules, effective permissions, arbitrary predicates, remote policy services, caller-specific frontend query keys, or a persisted/cross-request visible-menu cache.

## Verification evidence and gaps

`vona/src/suite-vendor/a-test/modules/test-rest/test/ssrMenu.test.ts` actively verifies that:

- anonymous retrieval does not receive the `systemAdmin` menu item;
- an authenticated `systemAdmin` retrieval does receive it;
- returned menu items do not expose `roles`; and
- after a privileged retrieval, replacing the current in-memory Passport roles with `registeredUser` does not reuse the privileged visible result.

These tests demonstrate the essential structural-cache isolation property. They do **not** yet provide a complete visibility matrix: fixtures and assertions for omitted roles, empty roles, `registeredUser`, and multiple-role matching are currently commented out in the test and its `ssrMenu.product` fixture. Do not describe those cases as actively test-verified until the fixtures and assertions are restored.

The focused test attempt made during this evaluation could not execute because the shared test listener port `7102` was already occupied; this is an environment blocker, not a behavioral failure of the assertions.

## Related records

- [ADR 0006: SSR Site Access and Role Model](../decisions/0006-ssr-site-access-and-role-model.md)
- [a-ssr Module Architecture](a-ssr-module-architecture.md)
- [SSR Vona/Zova Boundary and Call Chain](ssr-vona-zova-boundary-and-call-chain.md)
