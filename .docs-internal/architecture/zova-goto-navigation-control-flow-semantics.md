# Zova `$goto...()` Navigation Control-Flow Semantics

This note records why Zova application navigation helpers intentionally support both synchronous and asynchronous control flow.

Use it when changing `a-router` navigation helpers, SSR redirect handling, authentication guards, or workflows that must sequence state cleanup after navigation.

## Why this note exists

The application-facing helpers look superficially like ordinary promise-based navigation APIs:

- `$gotoPage(...)`
- `$gotoHome(...)`
- `$gotoLogin(...)`
- `$gotoAccessDenied(...)`
- `$gotoReturnTo(...)`

They are deliberately not uniformly promise-based. One helper chooses among native mechanisms whose completion and control-flow models differ:

- SSR HTTP redirect control flow
- Client-side Vue Router navigation
- browser document navigation
- intentional no-op navigation

The mixed result type preserves those native semantics instead of hiding them behind an artificial promise wrapper.

## Core contract

Primary source:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/types/router.ts`

```ts
export type TypeGotoPageResult = void | Promise<NavigationFailure | void | undefined>;
```

`ZovaApplication` exposes this result contract through all imperative `$goto...()` helpers. `$gotoHome(...)`, `$gotoLogin(...)`, `$gotoAccessDenied(...)`, and `$gotoReturnTo(...)` resolve a policy-specific path and delegate to `$gotoPage(...)`, so they retain the same runtime-dependent behavior.

`$redirect(...)` is separately typed as `never`. It does not return a navigation result because it changes SSR response control flow by throwing an SSR-aware error.

## Runtime branch matrix

Primary implementation:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts`

| Context                          | Mechanism                                       | Normal return behavior                                                     | Meaning of `await`                                                                 |
| -------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Server rendering                 | `$gotoPage(...)` calls `$redirect(...)`         | Does not return normally; `$redirect(...)` synchronously throws `ErrorSSR` | Does not turn the throw into a normal result                                       |
| Client with `forceRedirect`      | `$gotoPage(...)` calls `$redirect(...)`         | Does not return normally; throws the redirect signal                       | Does not turn the throw into a normal result                                       |
| Client internal path             | `router.push(...)` or `router.replace(...)`     | Returns Vue Router's navigation promise                                    | Waits for the router navigation to settle                                          |
| Client external HTTP URL         | `window.location.assign(...)` or `replace(...)` | Returns `void` after requesting browser document navigation                | Completes immediately; the destination document is outside the current SPA process |
| Already at a special destination | Wrapper intentionally does nothing              | Returns `void`                                                             | Completes immediately                                                              |

The no-op cases are deliberate:

- `$gotoLogin()` does nothing when already on the Login route and no explicit `returnTo` is requested.
- `$gotoAccessDenied()` does nothing when already on its target route.

Therefore, `void` does not mean that navigation support was omitted. It represents either a browser-owned navigation or an intentional decision not to navigate.

## Why the API is not normalized to `Promise<void>`

A uniform promise would obscure the facts callers need to preserve:

1. **SSR redirects are non-local control flow.** `$redirect(...)` constructs `ErrorSSR`, attaches the status, page path, and absolute URL, then throws it. Converting that to a resolved promise would break the SSR error/response path.
2. **Browser document navigation has no useful in-process completion signal.** After `window.location.assign(...)`, the current JavaScript context is leaving the document.
3. **Vue Router already provides a meaningful promise for internal Client transitions.** That promise is valuable when follow-up work depends on route replacement or unmounting.
4. **No-op branches should stay cheap and explicit.** Creating promises merely to represent “already there” would add a false asynchronous boundary.

The union is therefore a transport/control-flow contract, not a permissive typing convenience.

## Calling patterns

### Fire-and-forget navigation

UI event handlers and workflows with no dependent post-navigation work should invoke `$goto...()` without awaiting it. Examples include header navigation, error-page recovery buttons, locale-switch clicks, and successful-login return navigation.

These callers intentionally start navigation but do not need a later operation to wait for router completion.

### Ordered Client workflow navigation

Await a `$goto...()` result only when later work depends on an internal Client navigation completing.

Primary example:

- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`

Logout clears Passport/JWT state, then awaits `$gotoLogin()`, then clears cached model state. The ordering keeps the outgoing layout from reading cache data after that cache has been cleared:

```ts
this._setPassportJwt();
await this.app.$gotoLogin();
this.$clear();
```

`await` safely accepts either member of `TypeGotoPageResult`: it waits for a Client router promise when one exists and continues immediately for `void`. It must not be interpreted as a guarantee that every navigation mechanism completes in-process, nor as a way to suppress a synchronous SSR redirect throw.

## Path construction versus imperative navigation

The navigation API has two distinct roles:

- `$getPagePath(...)`, `$getPagePathLogin(...)`, and `$getPagePathAccessDenied()` construct paths without navigating.
- `$goto...()` helpers deliberately execute navigation according to runtime and destination.

The pure path helpers are appropriate when code needs a route destination as data, especially in a navigation guard. They also centralize params, query, locale normalization, `returnTo`, Login, and access-denied policy without duplicating URL construction in application modules.

## Guard boundary

Primary source:

- `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`

A Client `beforeEach` guard must return the redirect destination for the navigation it is currently evaluating:

```ts
return this.app.$getPagePathLogin(to.fullPath);
```

It must not call `$gotoLogin(...)` and then return `false`. On the Client, `$gotoLogin(...)` starts a separate `router.push(...)` while `false` aborts the original navigation. That nested-navigation pattern can make the address bar change while an old RouterView tree remains mounted.

For access denied, return a route location with `replace: true` when replacement semantics are required:

```ts
return { path: this.app.$getPagePathAccessDenied(), replace: true };
```

Cookie-enabled SSR remains different: it must use `$redirect(pagePath)` so the SSR pipeline produces the established HTTP redirect response. With `SSR_COOKIE=false`, `cookieDisabledOnServer` deliberately bypasses admission during server rendering; the Client evaluates admission after hydration using browser Passport state.

## SSR and error-flow interaction

The Server redirect chain is:

```text
$gotoPage(...) or $redirect(...)
 -> ErrorSSR is thrown synchronously
 -> application error handling receives the error
 -> SSR error handling records the redirect response state
 -> SSR response uses the redirect status and target URL
```

Relevant sources:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts`
- `zova/src/suite/a-home/modules/home-base/src/service/ssr.ts`

On the Client, `a-router` error handling can normalize redirect-related errors back into imperative `$gotoPage(...)` or `$gotoLogin()` calls. That error-handler context is distinct from a guard: it is translating an already-raised error, not choosing the outcome of an active route transition.

## Invariants future changes must preserve

1. Keep `TypeGotoPageResult` aligned with every actual `$gotoPage(...)` branch.
2. Preserve synchronous `ErrorSSR` throwing for SSR and forced redirects.
3. Preserve the Client router promise for internal paths so ordered workflows can await it.
4. Do not claim that browser document navigation has an in-process completion promise.
5. Keep special-route no-ops as valid `void` outcomes.
6. Keep `$getPagePath...()` helpers pure and use them for guard redirect decisions.
7. Do not reintroduce imperative nested `$goto...()` calls followed by guard abortion on the Client.
8. Preserve the SSR/Client distinction: Server redirect responses use `$redirect(...)`; Client guards return destinations.

## Related guidance

Read together with:

- `cabloy-docs/frontend/navigation-guards-guide.md`
- `cabloy-docs/frontend/zova-router-under-the-hood.md`
- `.docs-internal/architecture/ssr-vona-zova-boundary-and-call-chain.md`
