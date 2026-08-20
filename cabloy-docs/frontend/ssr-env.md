# SSR Environment Variables

This guide explains SSR-related environment variables in Zova within the Cabloy monorepo.

## Why SSR env configuration matters

SSR behavior often depends on environment variables that do not matter in exactly the same way for purely client-side execution.

Zova exposes SSR-related environment variables so the framework can configure key behaviors directly.

## Representative configurable variables

Representative variables include:

- `SSR_PROFILE`
- `SSR_COOKIE_THEMEDARK_DEFAULT`
- `SSR_API_BASE_URL`
- `SSR_PROD_PORT`

These affect SSR profile selection, theme defaults, server-side API targeting, and SSR production port behavior. Response-cache defaults are resolved from the selected request-local profile; body-ready behavior is an opt-in of the selected layout module, not an environment or profile switch.

## SSR profile

`SSR_PROFILE` is the standalone-flavor default for request-local SSR behavior:

- `public`: the server renders without request-cookie credentials or cookie-backed theme resolution. Output must be anonymous-safe and may use public response caching.
- `session`: the server may recover request-cookie session state for normal route admission and authorized rendering. The response is always `Cache-Control: private, no-store`.

For Vona-backed SSR, `SSR_PROFILE` supplies the flavor default. After the frontend route is resolved, `route.meta.ssrProfile` can override that default before `serverEntry` runs. The resolved profile controls request-cookie capability and related SSR behavior; locale-aware URL handling remains the existing `route.meta.locale` contract. A profile never grants authentication, site admission, or API authorization; `requiresAuth` and Vona guards remain responsible for those decisions.

Route authors should choose the profile from the rendering contract rather than from the presence or absence of a `locale` parameter. Use `session` when SSR genuinely needs cookie-backed state, protected admission, personalized first paint, or private data; use `public` for an explicit URL-locale or deliberately locale-neutral, cache-safe, hydration-equivalent public contract. This is not an authentication requirement: an anonymous route should set `requiresAuth: false`, and `session` still does not grant Passport, Site, role, or API authority.

The selected layout owns sidebar restoration. A layout that enables `layout.sidebar.bodyReadyObserver` queues a request-local hidden-body metadata entry during SSR, registers its readiness condition and restoration callback, and then injects the generic browser observer. The observer restores browser-local sidebar state after the relevant layout DOM exists and reveals the body before hydration. Admin enables this path; Web and Empty disable it. Therefore, a Web route using `ssrProfile: 'session'` remains `private, no-store` without gaining the Admin sidebar observer.

The selected layout also supplies its own desktop sidebar fallback and responsive breakpoint: the Admin layout defaults to open and the Web layout defaults to closed, and both currently use `1023px` as their independently configured breakpoint. Browser-local sidebar preference can override that fallback. The selected layout passes its breakpoint to the SSR browser handoff; it is not profile-specific. SSR profile selection does not change a layout's sidebar behavior.

## SSR response cache control

After Zova resolves the route profile, a `session` response immediately receives `Cache-Control: private, no-store`, before router guards or rendering can terminate it. A successfully rendered public route receives the profile default cache header, which `meta.ssrProfileOptions.responseCache` can refine.

Cabloy Basic uses different flavor defaults:

| Flavor | Default profile | SSR response header                  |
| ------ | --------------- | ------------------------------------ |
| Web    | `public`        | `public, max-age=600` when cacheable |
| Admin  | `session`       | `private, no-store`                  |

A route can override the flavor profile through `meta.ssrProfile` and can define a public response-cache policy through `meta.ssrProfileOptions.responseCache`. Set the nested value to `false` to disable public cache-header generation for that route. For Cloudflare cache-rule alignment that preserves these origin headers, see [Docker + Cloudflare Deployment](/fullstack/deploy-cloudflare-docker).

## Theme implications of `SSR_PROFILE`

`SSR_PROFILE` determines whether the server can use cookie-backed theme state for the current request.

- `session`: the server can resolve theme state from request cookies during SSR.
- `public`: server theme reads are not authoritative for the browser's final theme. Keep theme-sensitive rendering hydration-tolerant and use the established browser-finalization path.

Use the active edition and UI library to determine the adapter-level implementation. Cabloy Basic and Cabloy Start share the profile contract but do not necessarily use the same SSR theme handoff.

For the broader theme usage contract and edition-aware checklist, see [Theme Guide](/frontend/theme-guide). For the runtime/flavor selection model behind these env choices, see [Environment and Config Guide](/frontend/environment-config-guide).

## Dynamic environment variables

The runtime also exposes environment variables that describe the current execution context, such as:

- `SSR`
- `DEV`
- `PROD`
- `CLIENT`
- `SERVER`

These are important because SSR-aware code often needs to distinguish:

- server versus client behavior
- development versus production behavior
- SSR mode versus non-SSR mode

## Implementation checks for SSR environment-sensitive changes

When editing SSR-sensitive code, do not assume one execution environment.

It should explicitly consider whether the code path depends on:

- server versus client execution
- dev versus prod behavior
- SSR-specific environment configuration

That is often the difference between code that “works locally once” and code that fits the actual Zova SSR model.

For the broader mode/appMode/flavor and env/config loading model, see [Environment and Config Guide](/frontend/environment-config-guide).
