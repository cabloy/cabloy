# ADR 0006: SSR Site Access and Role Model

## Status

Proposed.

## Background

Cabloy Basic currently provides Web and Admin SSR Sites. Their configurations have several identifiers with distinct operational purposes:

- `publicPath` selects a Site from an incoming URL;
- the SSR bean/onion name selects a Site for typed backend calls;
- `bundlePath` locates the built SSR assets;
- `diagnostics.siteName` provides a missing-bundle error label.

None of them is a stable Site authorization identity. In particular, `publicPath` cannot fill that role because the Web Site intentionally uses the empty root path, and URL mount paths may change independently of authorization policy.

The current user domain also creates only a built-in `admin` role. The bootstrap account whose username is `admin` receives that role during activation, while ordinary registrations receive no corresponding registered-user role. This overloads the word `admin` across account username, role, Site, and URL path, and it does not support a role policy that explicitly states which SSR Sites a user may enter.

The repository is currently allowed to make a clean-schema breaking change. No compatibility behavior is required for previous role names or previous databases.

## Problem

The framework needs an authorization model that supports multiple independently configured SSR Sites without relying on a client-provided application type or treating a shared authentication cookie as shared Admin authorization.

The model must:

1. give every SSR Site a stable authorization identity;
2. supply the current Site identity to both SSR and standalone SPA Zova runtimes;
3. grant protected-route Site access through direct user role membership;
4. use existing route metadata to distinguish anonymous pages from authenticated pages;
5. preserve the independent server-side API/resource permission model; and
6. make the bootstrap account and ordinary registrations unambiguous.

## Decision

### 1. Treat SSR Sites as application access targets

An SSR Site is an application entry and routing boundary. A role declares the SSR Sites in which it may access authenticated routes. A user's effective protected-route Site access is the union of the `siteIds` of its directly assigned roles.

This replaces the broad role classification of “frontend” versus “backend.” A role may access authenticated routes in one or more Sites, and a new Site can be introduced without changing the meaning of existing Site IDs.

The Site-admission layer answers only this question:

> May this authenticated request navigate to this route in the current SSR Site?

It does not answer whether the request may execute a resource action or API endpoint.

### 2. Add a stable `siteId` to each SSR Site

Every `@SsrSite(...)` declaration must expose a non-empty, unique, stable `siteId`.

Initial values are:

| SSR Site | `siteId` | `publicPath` |
| --- | --- | --- |
| Web | `web` | `''` |
| Admin | `admin` | `admin` |

`siteId` is the authorization identifier. It is not a display name, URL path, bundle name, or bean/onion name.

The `a-ssr` type surface will add `ISsrSiteIdRecord`, following the existing declaration-merging pattern of `ISsrSitePublicPathRecord`. Enabled-Site preparation validates both Site IDs and public paths:

- `siteId` must be present and non-empty;
- `siteId` must be unique among Sites enabled for the same instance/host;
- `publicPath` must be unambiguous among the same Site set.

The existing Site dispatch mechanism continues to use `publicPath`, and typed programmatic APIs such as `BeanSsr.render()` and `redirect()` continue to use SSR bean/onion identity. No existing identifier is repurposed.

### 3. Derive `SITE_ID` for SSR and configure it for standalone SPA

`SITE_ID` is the Zova runtime context for the current Site. It is not an authorization assertion received from the browser.

| Runtime mode | `SITE_ID` source | Authority |
| --- | --- | --- |
| Vona SSR | The selected `@SsrSite.siteId`, automatically merged into `envServer` and `envClient` | The Vona SSR Site declaration is authoritative. |
| Browser after SSR hydration | The Vona-provided `envClient.SITE_ID` serialized in the SSR state | It must equal the selected Vona Site `siteId`. |
| Standalone SPA / SPA development | The active Zova flavor environment file | The flavor supplies the Site context because no Vona Site exists in this execution mode. |

The initial flavor mapping is explicit:

| Zova flavor | `SITE_ID` |
| --- | --- |
| `cabloyBasicWeb` | `web` |
| `cabloyBasicAdmin` | `admin` |

Do not derive `SITE_ID` from `META_FLAVOR` by string convention. Flavor is a build identity and `siteId` is an authorization-domain identity; their current mapping must remain explicit so either can evolve independently.

`SITE_ID` is required in Zova runtime configuration. Startup must fail clearly when the standalone flavor omits it. Vona SSR Site options must not manually repeat it in `envServer` or `envClient`; `BeanSsrSiteBase` derives and injects both values from the one authoritative `siteId` option. This prevents Vona/Zova configuration drift.

Because `envClient` is observable and mutable in the browser, `SITE_ID` is suitable for frontend routing and user experience only. Vona must never trust a client-supplied `SITE_ID` as authorization evidence.

### 4. Remove `diagnostics.siteName`

`diagnostics.siteName` is removed from `ISsrSiteDiagnosticsOptions` and from every Site declaration.

`diagnostics` remains a diagnostic-only configuration area and retains `buildCommand`. Missing-bundle diagnostics use the required `siteId` directly. This removes duplicate identity data and prevents authorization from depending on a field intended only for human-readable error output.

### 5. Replace the legacy built-in role model

The clean initial schema seeds these two roles:

| Role name | Initial `siteIds` | Meaning |
| --- | --- | --- |
| `registeredUser` | `['web']` | Basic role for an activated registered account. It does not itself grant unrestricted business capabilities. |
| `systemAdmin` | `['web', 'admin']` | Explicit system-administration role for the initially available Sites. |

`systemAdmin` does not bypass Site policy. A future Site is unavailable to it until its ID is deliberately added to the role policy.

`homeRole` gains a JSON-backed `siteIds` array. An absent or empty array grants no protected-Site access. The clean initial schema also enforces unique role names and unique `(userId, roleId)` membership pairs. The role adapter provides duplicate-safe assignment so lifecycle retries remain idempotent.

The legacy role name `admin` is removed. Generic role-name declarations, passport convenience APIs, adapter helpers, example routes, and tests use `systemAdmin` instead. The preferred guard helper is `Passport.systemAdmin()` rather than a retained `Passport.admin()` alias.

### 6. Keep the bootstrap username distinct from roles

The bootstrap account retains the username `admin`. This value is only an account login identifier.

The initial seed creates the two built-in roles before bootstrap registration. The existing activation lifecycle then assigns direct memberships:

```text
username: admin
roles: systemAdmin, registeredUser
```

Every activated account receives `registeredUser`. The activated bootstrap account whose username is exactly `admin`, when bootstrap administration is enabled, receives `systemAdmin` in addition.

Role assignment occurs on activation, not merely on registration. This preserves existing email-confirmation and automatic-activation semantics. The registration flow must refresh the issued passport when an immediate response must include the roles assigned by activation.

No role inheritance is introduced. Assigning `systemAdmin` to another account does not implicitly assign `registeredUser`; both memberships remain explicit account-level decisions.

### 7. Enforce protected-route Site admission in Zova router guards

`home-base` router guards own route-level Site admission. They run after Zova has resolved the target route and therefore can use both `to.meta.requiresAuth` and `this.sys.env.SITE_ID`.

The required guard sequence is:

1. If `to.meta.requiresAuth === false`, allow the route anonymously and do not evaluate role Site policy.
2. Otherwise, call the existing `ensurePassport()` flow.
3. If no authenticated passport is available, use the existing Site-local login redirect behavior.
4. If the passport is authenticated but none of its roles contains the current `SITE_ID` in `siteIds`, produce a Site-rendered access-denied page with HTTP status `403`.
5. Otherwise, continue navigation.

This makes anonymous access a route-level decision available to every Site. Login, registration, password recovery, confirmation, error, and public-content routes use `requiresAuth: false`; authenticated business routes use the default `requiresAuth` behavior and then require a matching role Site policy.

The resulting route-access contract is:

| Route state | Required behavior |
| --- | --- |
| `requiresAuth: false` | Allow anonymously in every Site. |
| Requires authentication, no valid passport | Redirect to the current Site login page. |
| Requires authentication, authenticated passport lacks `SITE_ID` | Render the current Site access-denied page with HTTP status `403`. |
| Requires authentication, a role contains `SITE_ID` | Allow navigation. |
| Expired or invalid token | Preserve the existing expired-token behavior; otherwise follow the unauthenticated path. |

The redirect and access-denied mechanisms must be SSR-aware. Returning `false` from a router guard only aborts navigation; it is not itself an HTTP response contract. Existing `$gotoLogin()`/SSR redirect behavior remains the model for unauthenticated requests. The new access-denied helper must produce a renderable `403` response without re-entering its own protected-route check.

This router guard is the authoritative page-navigation gate for SSR document rendering and browser SPA navigation. It is deliberately not an asset or API gate:

- static assets and built frontend code are not treated as confidential authorization resources;
- `apiType: 'dev'` proxy behavior is not protected by a frontend router guard; and
- Vona API/resource guards remain the authoritative server-side protection for data and actions.

The current Web flavor may disable server-cookie passport resolution during SSR. In that mode, route admission that requires authentication is completed after browser hydration unless that flavor deliberately enables the required server passport state. This is an SSR rendering behavior choice, not a reason to trust client-provided Site identity.

### 8. Keep API permissions and route admission separate

Route admission controls whether Zova may navigate to an authenticated page in the current Site. API and resource permissions remain enforced by existing Vona `Passport` guards and the `a-permission` action evaluation flow.

Consequences:

- an admitted route never grants API access;
- a client-side route denial never replaces API authorization for programmatic clients;
- `a-permission` remains a resource/action permission facility and is not made the route gate; and
- Site policy does not enter the existing action-permission cache model.

### 9. Preserve structural cache boundaries

Enabled SSR Sites remain a structural cache keyed by instance and host. Site lists must not become per-user cache entries.

The current SSR menu cache remains safe only while its contents are role-invariant. The first delivery must ensure protected menu API endpoints have their own Vona authorization guards; it does not add role-filtered menu content to the locale-only SSR menu cache.

If future work introduces role-aware menu entries, it must first add a stable authorization fingerprint to the cache key and define invalidation for role-policy mutations.

## Why This Decision Was Chosen

### Stable authorization without URL coupling

A dedicated `siteId` is stable across URL/path refactors and works for the root Web Site. It avoids making `publicPath`, diagnostics, or bean identity silently serve multiple unrelated contracts.

### Direct role membership is explicit and auditable

The bootstrap account directly owns both built-in roles. Other accounts receive only the roles explicitly assigned to them. This avoids making every system administrator automatically a Web business user through role inheritance.

### Shared authentication remains safe

A shared same-domain cookie proves authentication only. It does not grant access to authenticated Admin routes. Zova route admission evaluates role Site policy for SSR and SPA navigation, while Vona continues to enforce the server-side API/resource boundary independently.

### The model scales beyond two applications

Future Sites such as `merchant`, `partner`, or `operations` can be added as new stable Site IDs and deliberately granted to roles. No new “frontend/backend” category or client-controlled login flag is needed.

### Existing API permission boundaries remain intact

Zova protected-route admission and Vona resource/API permission have different scopes. Keeping them separate avoids weakening API protection or creating a second interpretation of route permissions inside the SSR dispatcher.

## Alternatives Considered

### Use `diagnostics.siteName` as the Site-access identifier

Rejected because it is optional, diagnostic-only, and currently used solely to improve missing-bundle errors. A security identifier must have a required, stable contract.

### Use `publicPath` as the Site-access identifier

Rejected because the Web Site uses an empty path and URLs are routing deployment details that can change independently of role policy.

### Use the SSR bean/onion name as the persisted Site policy

Rejected because it is a module/class implementation identity used by typed backend dispatch. Persisted authorization policy needs a deliberate business-stable ID that does not change when a bean is reorganized.

### Continue classifying roles as frontend or backend

Rejected because a role can reasonably access more than one Site. The actual question is Site admission, not an exclusive abstract category.

### Let the client declare Web or Admin login mode

Rejected because a client-provided application marker is not authorization evidence. The server must derive admission from authenticated role policy.

### Treat a shared cookie as Admin authorization

Rejected because authentication and authorization are distinct. A user may present a valid cookie while lacking the role policy for the selected Site.

### Make `systemAdmin` a universal Site bypass

Rejected because future Sites require deliberate authorization. Explicit `siteIds` preserve least privilege and force an intentional decision when a new Site is introduced.

### Assign `registeredUser` at registration before activation

Rejected because role membership should follow the established activation lifecycle and email-confirmation semantics. Existing activated/passport guards remain coherent when the role is added on activation.

## Implementation Plan

### 1. Record and audit the break

1. Add this ADR and index it from `.docs-internal/README.md`; also correct the missing ADR 0005 index entry.
2. Enumerate in-repository uses of the legacy `admin` role before editing. Keep role names distinct from the bootstrap username, Admin Site ID, and Admin public path.
3. Keep `home-user` at `vonaModule.fileVersion: 1`. Rewrite only clean version-1 schema and seed definitions; do not add migration, alias, backfill, or fallback logic for old data.

### 2. Establish SSR Site IDs

Modify the relevant `a-ssr` option types, Site declarations, missing-bundle handler, Site service, and SSR-Site generator boilerplate.

1. Add `ISsrSiteIdRecord` and `siteId` to `IDecoratorSsrSiteOptions`.
2. Declare `web` and `admin` Site IDs in the concrete Web and Admin Site beans.
3. Remove every `diagnostics.siteName` value and type declaration.
4. Make missing-bundle errors display the required Site ID.
5. Validate missing, empty, and duplicate Site IDs as well as duplicate public paths while preparing enabled Sites.
6. Update the generator boilerplate so future Site declarations use the new identity model.

### 3. Rebuild clean role policy schema and lifecycle

Modify the role entity/type, version-1 schema/init logic, indexes, role adapter, activation listener, passport integration, and affected role-guard consumers.

1. Add JSON-backed `siteIds` to `homeRole` and concrete role typing.
2. Add clean-schema uniqueness for role names and role-user membership pairs.
3. Implement duplicate-safe direct role assignment.
4. Seed `systemAdmin` and `registeredUser`; remove the legacy role seed.
5. Give every activated user `registeredUser`; give the bootstrap username `admin` `systemAdmin` in addition.
6. Refresh newly issued passport role state where required.
7. Rename role semantics and helpers from `admin` to `systemAdmin` across framework code, examples, and tests.

### 4. Provide `SITE_ID` to every Zova runtime

Modify the mirrored Vona/Zova environment contracts, the SSR Site base, and the Web/Admin flavor environment files.

1. Add required `SITE_ID` typing to the Zova and Vona `ZovaConfigEnv` interfaces.
2. Add `SITE_ID=web` and `SITE_ID=admin` to the corresponding standalone SPA flavor environment files.
3. Automatically merge the selected Vona `siteId` into SSR `envServer` and per-render `envClient` values.
4. Do not require concrete Vona Site declarations to duplicate `SITE_ID` manually.
5. Add startup validation that rejects a standalone Zova flavor without `SITE_ID`.
6. Verify SSR injection overrides or validates the flavor default without creating a Vona/Zova mismatch.

### 5. Add protected-route Site admission

Modify `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`, Passport role helpers, the SSR-aware access-denied response mechanism, and relevant Web/Admin route declarations.

1. Preserve `to.meta.requiresAuth === false` as the complete anonymous-route exemption for every Site.
2. On every other route, use `ensurePassport()` before evaluating role policy.
3. Redirect unauthenticated navigation through the existing Site-local login flow.
4. Evaluate the current passport's role `siteIds` against `this.sys.env.SITE_ID`.
5. Render an in-Site HTTP-`403` access-denied response when an authenticated user lacks the matching Site ID.
6. Preserve expired-token behavior and make login/error/denied routes loop-free.
7. Apply the same logic during SSR initial navigation and browser SPA navigation; do not attempt to use it as an asset, dev-proxy, or API guard.

### 6. Align API/menu authorization and caches

1. Ensure protected menu API endpoints have their own Vona authorization guards rather than trusting frontend route admission.
2. Keep menu content role-invariant and retain the current structural/locale cache model in this delivery.
3. Verify denied callers cannot retrieve Admin menu data through its API.
4. Defer role-aware menu filtering until its cache identity and role-policy invalidation model are designed.

### 7. Test, build, and verify end to end

Add focused test coverage for:

- valid, missing, and duplicate Site IDs;
- missing-bundle diagnostics using `siteId` and preserving build-command hints;
- clean initial role policy seed data;
- direct bootstrap `admin` membership in both roles;
- normal activation assigning only `registeredUser` and remaining idempotent;
- immediate passport-role visibility after registration/activation;
- SSR `SITE_ID` derivation from the selected Vona Site and hydration into Zova;
- standalone Web/Admin SPA flavor `SITE_ID` values and missing-value startup failure;
- anonymous `requiresAuth: false` routes in Web, Admin, and a future Site fixture;
- unauthenticated required routes redirecting to the current Site login;
- `registeredUser` Web protected-route access and Admin route `403` denial;
- bootstrap Admin protected-route access to both Sites;
- SSR initial navigation and browser SPA navigation enforcing the same rule;
- expired-token behavior;
- independence of existing API route guards; and
- protected Admin menu API non-disclosure.

After focused tests, run the required shared checks. `meta.version.ts` changes require test database reinitialization through `npm run test`.

```bash
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona
npm run tsc
npm run test
npm run lint
npm run format
```

Perform browser-level verification in production SSR and `apiType: 'dev'` mode. Test direct navigation and direct static asset URLs, not only frontend menu paths or client redirects.

## Consequences

### Benefits

- SSR Site authorization has an explicit, extensible model.
- Site identity no longer duplicates diagnostic data or depends on URL paths.
- Bootstrap account semantics, role names, and Site IDs are distinct.
- Shared-cookie Admin escalation is prevented by server-side Site admission.
- Future Site rollout requires a deliberate role-policy decision.
- API authorization remains isolated and continues to use its existing guard model.

### Trade-offs

- This is an intentional breaking change: existing roles and databases are unsupported.
- Protected routes require explicit authentication and denial behavior during Zova navigation.
- Future role-management UI/API work must include cache invalidation and audit policy; it is not part of this delivery.
- Menu personalization is deferred until it can be implemented with an authorization-aware cache contract.

## Guidance for Future Work

1. Never use `publicPath`, `bundlePath`, `diagnostics`, username, or an SSR bean name as a replacement for `siteId` in authorization policy.
2. Keep Site ID changes rare and treat them as authorization-data changes.
3. Add a new Site only with an explicit policy decision for each built-in and application role.
4. Do not turn protected-route Site admission into a substitute for controller/API guards.
5. Use `requiresAuth: false` to mark anonymous routes in every Site; keep it separate from authenticated route and resource access.
6. Treat `SITE_ID` as frontend runtime context only; Vona never accepts it as authorization evidence from a client.
7. Do not add role-specific data to structural Site/menu caches without an authorization fingerprint and invalidation path.
8. Keep direct role membership explicit; do not introduce implicit role inheritance without a separate design decision.

## Related Records

- `.docs-internal/decisions/0002-guard-permission-projection.md`
- `.docs-internal/decisions/0005-current-passport-guard-permission-evaluation.md`
- `.docs-internal/architecture/a-ssr-module-architecture.md`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrSite.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.resolvePath.ts`
- `vona/src/suite/a-home/modules/home-user/src/bean/meta.version.ts`
- `vona/src/suite/a-home/modules/home-user/src/bean/eventListener.activate.ts`
