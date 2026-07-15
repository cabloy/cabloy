# SSR Environment Variables

This guide explains SSR-related environment variables in Zova within the Cabloy monorepo.

## Why SSR env configuration matters

SSR behavior often depends on environment variables that do not matter in exactly the same way for purely client-side execution.

Zova exposes SSR-related environment variables so the framework can configure key behaviors directly.

## Representative configurable variables

Representative variables include:

- `SSR_COOKIE`
- `SSR_COOKIE_THEMEDARK_DEFAULT`
- `SSR_BODYREADYOBSERVER`
- `SSR_API_BASE_URL`
- `SSR_PROD_PORT`
- `SSR_TRANSFERCACHE`
- `SSR_TRANSFERCACHE_EXPIRES`

These affect areas such as cookie-driven SSR behavior, theme defaults, body-load observation, server-side API targeting, and SSR production port behavior.

## SSR response cache control

`SSR_TRANSFERCACHE` and `SSR_TRANSFERCACHE_EXPIRES` control the `Cache-Control` response header that Zova adds after an SSR page is rendered.

- `SSR_TRANSFERCACHE=false` disables this header path.
- Any other value enables it in the current configuration normalization.
- `SSR_TRANSFERCACHE_EXPIRES=0` emits `Cache-Control: no-cache, no-store, must-revalidate`.
- A positive number of seconds or an `ms`-style duration such as `10m` emits `Cache-Control: public, max-age=<seconds>`.

Cabloy Basic uses different flavor defaults:

| Flavor | Settings                                                  | SSR response header                   |
| ------ | --------------------------------------------------------- | ------------------------------------- |
| Web    | `SSR_TRANSFERCACHE=true`, `SSR_TRANSFERCACHE_EXPIRES=10m` | `public, max-age=600`                 |
| Admin  | `SSR_TRANSFERCACHE=true`, `SSR_TRANSFERCACHE_EXPIRES=0`   | `no-cache, no-store, must-revalidate` |

A route can override the flavor default through its SSR route metadata. For Cloudflare cache-rule alignment that preserves these origin headers, see [Docker + Cloudflare Deployment](/fullstack/deploy-cloudflare-docker).

## Theme implications of `SSR_COOKIE`

`SSR_COOKIE` is not only a storage choice. It also changes what SSR can guarantee about theme-sensitive output.

A practical split is:

- `SSR_COOKIE=true`: the server can resolve theme state from cookies during SSR
- `SSR_COOKIE=false`: the server cannot guarantee that theme-sensitive SSR reads match the browser's eventual selected theme

In practice, this means Web SSR and Admin SSR can intentionally expose different theme capabilities.

- In a cookie-capable SSR path, theme-sensitive server rendering can rely on a stronger server/client match guarantee.
- In a cookie-disabled SSR path, SSR should treat theme-sensitive reads as non-authoritative for the browser's final theme and prefer hydration-tolerant or client-finalized decisions when exact matching matters.

A practical development rule is:

- use `SSR_COOKIE` to determine the capability level
- use the active edition and UI library to determine how that capability is implemented

That matters because Cabloy Basic and Cabloy Start share the same theme architecture but do not use the same adapter-level SSR handoff strategy.

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
