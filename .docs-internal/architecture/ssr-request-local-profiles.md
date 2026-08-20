# SSR Request-Local Profiles: `public` and `session`

## Status

Approved architecture and implementation plan.

This document is the maintainer source of truth for the SSR profile refactor. It records the design context, source-backed boundaries, consumer migration rules, and verification requirements so implementation can proceed without recreating the original discussion.

## Context

Cabloy Basic currently has two SSR flavor defaults:

| Flavor/Site     | Default profile | Existing intent                                    |
| --------------- | --------------- | -------------------------------------------------- |
| Web / `web`     | `public`        | Anonymous, SEO-oriented, potentially cacheable SSR |
| Admin / `admin` | `session`       | Cookie-aware, internal authenticated SSR           |

This makes Web personal-center features awkward. Address books, orders, account information, coupons, checkout, and payment continuation pages belong to the Web business boundary, but some of them may benefit from authenticated server rendering. Moving them to Admin would confuse business ownership with SSR rendering capability.

The approved direction is a deliberately small profile abstraction:

```ts
type TypeSsrProfile = 'public' | 'session';
```

The refactor is intentionally breaking. No backward-compatibility layer, legacy alias, migration fallback, or dual naming is required. Obsolete names and fields may be removed directly after all consumers are migrated.

## Source-confirmed current architecture

The request crosses these boundaries:

```text
HTTP request
  -> Vona SSR site selection by publicPath
  -> BeanSsrSiteBase per-request state
  -> generated handler.js / initialize(envServer)
  -> Zova ServiceSsrHandler route resolution
  -> Zova serverEntry
  -> router initialization and guards
  -> renderToString / renderTemplate
  -> SSR state, query state, meta, and preload injection
  -> HTTP response
  -> browser SysSsrState and hydration
```

The key ownership split is:

- Vona `a-ssr` owns site selection, request/response orchestration, handler loading, and the Vona-to-Zova handoff.
- Zova `a-ssrserver` owns frontend route resolution, per-render SSR context creation, render execution, template assembly, and HTTP response-cache headers.
- Zova `a-ssr` owns `$ssr`, SSR state/meta accumulation, hydration handoff, theme/bootstrap scripts, and server-context cleanup.
- Generated Zova application code owns route/page/model behavior.

Production SSR must select the profile in the Zova SSR handler after route resolution and before `serverEntry`. The handler resolves the effective profile/options, writes the safe immutable snapshot to request-local `ssrContext.state`, and immediately applies `Cache-Control: private, no-store` for `session`. This establishes both the production HTTP policy and the initial SSR-state contract for consumers that initialize before or alongside router guards.

That production pre-resolution intentionally coexists with two narrower fallback/synchronization mechanisms. For direct Vite/Quasar server rendering where no outer handler seeded the state, `a-router.appInitialize()` resolves the request route and sets `$ssr` before profile-sensitive application initialization. Zova `a-ssr` registers a first client `router.beforeEach` that resolves the destination route profile through the same `$ssr._setProfile(...)` path before the router event chain continues to downstream guards. The former supplies the missing direct-server initial handoff; the latter keeps client navigation aligned. Neither replaces the production handler as the source of initial production SSR state or response-cache policy.

Primary source paths:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrSite.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts`

## Profile semantics

### `public`

`public` means the SSR request is rendered without request-cookie credentials and without cookie-backed private identity or theme resolution.

Required behavior:

- server Passport recovery from request cookies is disabled;
- server JWT forwarding based on request credentials is disabled;
- server-rendered HTML is anonymous-safe;
- public response caching is permitted only when the page and transferred state are user-independent;
- public routes continue to use URL locale as the canonical public-language input;
- browser-only theme and private state remain hydration-safe.

A protected route may still use `public` when it has an explicit URL locale or deliberately locale-neutral public contract and its product behavior is an anonymous shell followed by browser admission and private-data loading. `public` does not mean the route is anonymous; `requiresAuth` remains a separate route-admission rule.

### `session`

`session` means the SSR request may read request-cookie session credentials and recover the current Passport before rendering.

Required behavior:

- server Passport, JWT, permission, and user-preference consumers may use the request-local session;
- authenticated SSR output is allowed only when normal route admission and API/resource authorization permit it;
- user-specific HTML and dehydrated private query state are treated as private;
- the HTTP response is always `no-store`/private;
- profile state is request-local and is never written back to shared system configuration.

`session` does not grant authentication, Site admission, role membership, or API permission. `SITE_ID`, `requiresAuth`, Vona Passport guards, and resource/action guards retain their existing responsibilities.

## Configuration and selection contract

Use the canonical `SSR_PROFILE` environment value as the SSR flavor default.

Initial defaults:

| Flavor/Site         | Default               |
| ------------------- | --------------------- |
| Web / Basic Web     | `SSR_PROFILE=public`  |
| Admin / Basic Admin | `SSR_PROFILE=session` |

SSR route metadata is intentionally narrow:

```ts
interface RouteMeta {
  ssrProfile?: TypeSsrProfile;
  ssrProfileOptions?: Readonly<ISsrRouteProfileOptions>;
  locale?: boolean;
}

interface ISsrRouteProfileOptions {
  responseCache?: false | Readonly<ISsrResponseCachePolicy>;
}
```

`meta.ssrProfile` selects the SSR profile and `meta.ssrProfileOptions.responseCache` can refine the HTTP response-cache policy for a public document. The route profile-options surface is deliberately allowlisted; it is not a partial copy of the full profile snapshot. `meta.locale` remains the existing route-level opt-in for URL-locale parsing and canonicalization; it does not select a profile or configure profile options.

The effective profile is resolved with this precedence:

```text
route.meta.ssrProfile
  > SSR_PROFILE
  > public
```

There is no legacy cookie-profile fallback. `SSR_PROFILE` is authoritative, and direct reads of static SSR cookie configuration are replaced by request-local `$ssr.profile` or `$ssr.profileOptions` access.

Profile options are a typed, narrow policy surface, not an arbitrary environment overlay. Routes may select a profile and provide only the public-only `ssrProfileOptions.responseCache` override, using `false | policy` semantics. The resolver copies that allowlisted override into a fresh immutable request snapshot; server cache-header generation and hydration consumers observe the same snapshot. Layout/sidebar defaults are deliberately excluded from that snapshot: the selected layout owns its desktop fallback, while the layout model owns the browser-local preference. Routes cannot alter cookie capability, body-ready behavior, or layout/sidebar defaults. No route setting can relax the `session` no-store invariant or enable private data in `public`.

## Request lifecycle and state handoff

The implementation sequence is:

1. Vona selects the SSR Site and constructs the normal per-request state.
2. In the built production handler path, Zova `ServiceSsrHandler.render()` derives the page path and resolves the route.
3. The handler resolves `route.meta.ssrProfile` or the flavor `SSR_PROFILE` default and resolves the allowlisted immutable options snapshot.
4. It copies the state and attaches the effective profile/options snapshot to the per-render `ssrContext`.
5. When the profile is `session`, the handler immediately sets `Cache-Control: private, no-store`, before `serverEntry`, router guards, redirects, or rendering can terminate the request.
6. It calls `serverEntry` only after `$ssr` can observe the selected profile/options.
7. For direct Vite/Quasar server rendering that lacks the outer handler handoff, `a-router.appInitialize()` resolves the request route and prepares the same profile/options before profile-sensitive application initialization. It does nothing when the handler has already seeded the snapshot.
8. The same safe snapshot is serialized into initial SSR state. For `public`, the resolved `responseCache` policy is applied only after a successful document render.
9. Existing `finally` cleanup clears state, deferred state, callbacks, modules, and profile references.
10. On initial browser hydration, `SysSsrState` reads the serialized profile. The client keeps it stable through hydration; client `router.beforeEach` synchronizes a destination profile before downstream navigation guards and restores the committed route profile when navigation fails, without mutating global configuration.

The serialized state must contain only safe profile identity/options. It must never contain cookies, access tokens, Passport credentials, request/response objects, or arbitrary server configuration.

The `$ssr` surface should expose the resolved app-local values requested by this design:

```ts
this.$ssr.profile; // 'public' | 'session'
this.$ssr.profileOptions; // immutable resolved options snapshot
```

The existing `isRuntimeSsrPreHydration`, `isRuntimeSsrHydrated`, and `onHydrated` lifecycle remains authoritative for hydration timing. Hydration completion is not equivalent to authentication or admission readiness.

## Response cache terminology and invariant

`responseCache` controls HTTP `Cache-Control` response headers, while Query dehydration is a separate mechanism. Source, configuration, routes, generated artifacts, and documentation use this single cache name.

Keep these mechanisms separate:

1. `responseCache`: HTTP response headers and shared HTML-cache policy;
2. Query SSR transfer: `stateDefer.query`, `__INITIAL_STATE_DEFER__`, and TanStack Query hydration;
3. router tabs/KeepAlive persistence: browser instance and navigation state.

Immediately after server route resolution selects `session`, Zova sets `Cache-Control: private, no-store` before `serverEntry`, router guards, redirects, or rendering can terminate the request. Public cache policy is evaluated only after a successful public document render:

```text
session -> set private/no-store immediately
public  -> apply resolved responseCache policy after successful render
```

A session response must never receive `public, max-age=...`, even if route metadata requests it. Avoid contradictory appended headers. Public behavior may use a finite `max-age` only after confirming that HTML and dehydrated state are user-independent.

## Consumer migration matrix

| Consumer                          | Current dependency                                          | Required change                                                                                                                         |
| --------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `home-base` `routerGuards`        | static server-cookie capability                             | Read `$ssr.profile`; preserve `requiresAuth`, login redirect, `SITE_ID` role admission, and browser behavior.                           |
| `home-passport` `ModelPassport`   | cookie-disabled token/current-Passport branches             | Read profile capability; preserve client local state, server memory state, token refresh, locale, and timezone behavior.                |
| JWT interceptor                   | cookie-disabled forwarding guard                            | Forward request credentials only for `session`; preserve explicit unauthenticated API calls.                                            |
| OpenAPI SDK permission model      | cookie-disabled server prefetch guard                       | Enable safe permission prefetch under `session`; keep permission query ownership and authorization boundaries.                          |
| Resource model                    | cookie-disabled permission projection                       | Make permission state profile-aware without changing Vona resource authorization.                                                       |
| SSR meta store                    | static cookie and body-ready env reads                      | Use profile for cookie-backed theme/bootstrap; let the selected layout register body-ready metadata and scripts.                        |
| Basic theme handler               | static SSR cookie capability                                | Public emits browser-resolved theme markers; session may emit cookie-resolved final theme.                                              |
| Style theme bean                  | static server-cookie capability                             | Make dual theme application profile-aware and hydration-equivalent.                                                                     |
| Web/Admin layouts and `ssrLayout` | body-ready/cookie-disabled branches                         | Use the layout config to opt into pre-reveal restoration; consume profile only for identity/theme-sensitive behavior.                   |
| Commerce private pages/models     | post-hydration `$ssr` gates and client-only private queries | Retain gates for public fallback; migrate selected pages to session SSR only after query transfer and hydration equivalence are proven. |
| Locale service/route guards       | URL locale plus cookie/user preference                      | Keep explicit URL locale authoritative; resolve it in `beforeResolve` before the initial hydration render.                              |

Repository-wide searches for obsolete profile and cache names are required before implementation is considered complete. `SSR_COOKIE_THEMEDARK_DEFAULT` remains only as a static theme default. HTTP response-cache defaults are resolved from the request-local profile snapshot; body-ready behavior is selected by the layout module and must not be restored through a profile or environment switch. Each remaining legacy env match must be classified or removed.

## Route and page rollout

Authorization, locale input, and rendering profile remain separate dimensions.

- A route with dynamic params defines `route.name`; a static route remains path-keyed unless a documented named-route contract requires otherwise. Ordinary business routes without `locale` params do not receive an app-config alias merely for convenience.
- Choose the profile from each page's rendering contract. Public home/catalogue/product/content, login, registration, callback, error, and not-found routes may use `public` when their contract is anonymous-safe, cache-safe, and hydration-equivalent; an explicit URL locale is one way to provide the public-language input, but a missing locale parameter does not prohibit `public`.
- Select `session` only where SSR genuinely needs cookie-backed state, protected admission, personalized first paint, or private SSR data. It does not grant Passport, Site admission, role membership, or API authority.
- `requiresAuth` remains independent: `requiresAuth: false` chooses anonymous admission, while the normal omitted value remains protected regardless of profile.
- Admin inherits `session`; Web inherits `public`. A protected Web route may remain `public` with a neutral shell and post-hydration admission when its product contract does not need server-side admission or personalized rendering.

Use one representative commerce route first, such as address or order list. For each session route, verify the reason for cookie-capable SSR, Passport admission where required, private Query dehydration where used, no-store headers, and first-render equivalence before expanding to order detail, checkout, and payment continuation.

## Locale policy

`route.meta.locale` remains the route-level opt-in for URL-locale parsing, normalization, and omission of the default locale from canonical optional segments. An explicit URL locale remains authoritative in both profiles.

The router resolves locale in `beforeResolve`, before the initial hydration render:

```text
explicit URL locale
  > validated server cookie when the resolved profile permits server cookie reads
  > configured default locale
```

Public pages use path locale for canonical SEO URLs and cache keys. Browser navigation and hydration use the same route guard to set the active locale before rendering. Recovered `user.locale` remains an ordinary preference fallback when no locale cookie exists; it is not serialized as SSR state.

Timezone remains runtime-local. The browser determines its timezone through `Intl.DateTimeFormat().resolvedOptions().timeZone`; SSR does not serialize a server timezone snapshot.

## Hydration and private data safety

The invariant is:

```text
server HTML == client hydration-time initial render tree
```

For `public` pages and session-unavailable protected paths, render the same neutral shell through hydration. Start Passport-dependent queries and private rendering only after an explicit admission, mount, `onHydrated`, or interaction boundary.

For `session` pages, server models may initialize authenticated queries, but only if the query's data is authorized, safely dehydrated, and consumed by the client before hydration. Existing commerce gates should be relaxed incrementally, not removed globally.

`isRuntimeSsrHydrated` indicates lifecycle completion only. It does not prove Passport readiness, Site admission, query freshness, or permission readiness.

## Migration stages

### Stage A: contract and configuration

- Add profile types and route metadata.
- Add explicit Web/Admin flavor defaults.
- Add request-state profile field and resolver.
- Use `responseCache` throughout types, config, route metadata, handler logic, generated artifacts, and documentation.
- Remove the former SSR cookie capability switch and related compatibility branches instead of preserving aliases.

### Stage B: runtime boundary

- Resolve profile after route resolution and before `serverEntry`.
- Initialize `$ssr.profile`/`profileOptions` from request context.
- Transfer the safe snapshot through initial SSR state.
- Enforce session no-store before response-cache evaluation.
- Add concurrent isolation and shared-config immutability tests.

### Stage C: framework consumers

- Migrate Passport, router guards, JWT, permission models, theme, SSR metadata, layouts, and all remaining direct consumers.
- Remove static request-time assumptions from `sys.config.ssr`.
- Move body-ready behavior to the selected layout module; keep the generic SSR meta store profile-independent.

### Stage D: route/page adoption

- Audit and annotate all Web/Admin routes.
- Preserve public neutral shells where personalized SSR is not required.
- Migrate selected commerce pages to session SSR.
- Keep locale initialization in the existing route guard and timezone runtime-local.
- Add page-specific private-query and hydration tests.

### Stage E: cleanup and regeneration

- Remove obsolete env names, types, route metadata, and docs.
- Regenerate SSR and REST artifacts.
- Run `npm run deps:vona` to refresh local generated dependency links.
- Do not add migration aliases or compatibility fallback.

## Authorization boundaries and non-goals

- Profile selection does not authenticate a user.
- `session` does not grant Site admission or role membership.
- `SITE_ID` remains frontend runtime context, never client authorization evidence.
- `requiresAuth` remains route admission metadata, not a profile alias.
- Router admission does not replace Vona API/resource guards.
- Menu visibility does not authorize routes or API actions.
- Public/session selection does not create a second permission system.
- Vona remains the outer HTTP orchestrator; frontend app logic stays in Zova/generated bundles.
- No per-request mutation of shared system config is allowed.

## Verification matrix

Focused tests must cover:

- route metadata versus flavor `SSR_PROFILE` default precedence;
- invalid profile configuration;
- per-request isolation and no shared env/config mutation;
- SSR state serialization and client restoration;
- `$ssr` profile visibility before bean/model initialization;
- Passport/JWT/theme/layout/meta/permission behavior under both profiles;
- session no-store overriding route/profile `responseCache` settings;
- public response-cache behavior remaining unchanged;
- public neutral-shell hydration equivalence;
- session private-query transfer and hydration equivalence;
- explicit URL locale, profile-permitted cookie locale, user preference fallback, and default locale;
- unauthenticated redirects, Site admission/access denial, and independent API/resource denial;
- alternating and concurrent public/session renders without profile leakage.

Run the narrowest affected checks first, then:

```text
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona
npm run tsc
npm run test
npm run lint
npm run format
```

Also verify production SSR and `apiType: 'dev'`, direct document and asset requests, affected commerce flavors, and any `meta.version.ts` requirement (`npm run test` reinitializes the test database).

## Related records and source paths

- [SSR Vona/Zova Boundary and Call Chain](ssr-vona-zova-boundary-and-call-chain.md)
- [a-ssr Module Architecture](a-ssr-module-architecture.md)
- [User Workspace SSR Strategy](user-workspace-ssr-strategy.md)
- [Zova SSR Payment Return and Passport Recovery](zova-ssr-payment-return-passport-recovery.md)
- [ADR 0006: SSR Site Access and Role Model](../decisions/0006-ssr-site-access-and-role-model.md)
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrSite.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts`
- `zova/src/front/config/config/config.ts`
- `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`
- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`
