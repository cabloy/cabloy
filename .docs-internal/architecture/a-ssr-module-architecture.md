# a-ssr Module Architecture

This note explains how the Vona-side `a-ssr` module works in Cabloy Basic, what boundaries it owns, and which code paths future contributors should trace first when changing SSR behavior.

Use it when future work needs to:

- understand how Vona receives an SSR request and hands it to the generated Zova bundle
- decide whether an SSR change belongs in `a-ssr`, in the generated site bundle, or in Zova runtime code
- add or debug SSR sites, menus, redirects, render decorators, or auth redirect behavior
- reason about cache invalidation, HMR reload behavior, or SSR diagnostics

## Why this note exists

For the cross-layer Vona/Zova handoff after `handler.js`, also read `.docs-internal/architecture/ssr-vona-zova-boundary-and-call-chain.md`.

The public SSR docs under `cabloy-docs/frontend/` explain SSR capabilities and usage patterns.

They do **not** try to preserve the maintainer-level model of the Vona-side SSR runtime module itself.

That internal model matters because `a-ssr` is the backend runtime bridge between:

- Vona route/static resolution
- SSR site registration
- generated frontend bundle assets and `handler.js`
- server-side render execution
- SSR-specific redirect, menu, and auth behavior

Without a durable architecture note, future contributors can easily mix together three different layers:

1. Vona-side SSR orchestration in `a-ssr`
2. frontend SSR application behavior inside the generated Zova bundle
3. lower-level runtime semantics in Zova or Vue runtime-core

## Module role in the monorepo

`a-ssr` is the Vona-side SSR runtime module.

It does **not** author the frontend application itself. Instead, it provides the backend-side integration layer that:

- discovers enabled SSR sites
- maps incoming paths to the correct site
- proxies to the dev server in dev mode when needed
- serves built static assets from the site bundle when available
- loads the generated `handler.js` entry from the site bundle
- calls the site handler to render HTML
- exposes decorators and beans that let controller routes redirect to or render SSR pages
- assembles SSR menu and menu-group data
- provides diagnostic endpoints for SSR memory analysis

Representative entrypoints:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/index.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/.metadata/index.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/index.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/index.ts`

## High-level execution model

At runtime, the `a-ssr` flow is:

1. Vona static-path resolution emits `a-static:resolvePath`
2. `EventListenerResolvePath` iterates enabled SSR sites and matches the incoming URL against each site `publicPath`
3. the matching site bean resolves the request in this order:
   - dev proxy, if the site is in `apiType: 'dev'`
   - built static asset lookup from the site bundle
   - SSR render fallback through the loaded site handler
4. the site handler returns HTML or a static-file result
5. auth and route decorators can redirect HTML requests into SSR pages when required

The key routing listener is:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.resolvePath.ts`

The key site runtime base is:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`

## Core request-resolution boundary

### 1. Path matching starts from enabled SSR sites

`ServiceSsr.getSitesEnabled()` is the first important lookup boundary:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/ssr.ts`

It:

- reads enabled `ssrSite` onions for the current instance
- caches them by `instanceName:host`
- sorts them by `publicPath` specificity so more specific paths win before broader ones

That ordering matters whenever multiple SSR sites coexist under different prefixes.

### 2. Static resolution dispatches to a site bean

`EventListenerResolvePath.execute(...)` is the runtime dispatcher:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.resolvePath.ts`

It:

- receives the filename/path being resolved
- checks each enabled SSR site
- strips the site `publicPath` prefix when matched
- resolves the actual site bean instance
- delegates the remainder of the work to `BeanSsrSiteBase.resolvePath(...)`

This is the main place to inspect when an SSR route is not being picked up at all.

### 3. The site bean chooses dev proxy, static file, or SSR render

`BeanSsrSiteBase.resolvePath(...)` implements the three-stage decision:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`

Decision order:

1. if `apiType === 'dev'`, proxy to the configured dev host
2. otherwise load/prepare the SSR handler
3. ask the handler whether a static asset exists in the site bundle
4. if no asset matches, render HTML through the handler

This means the Vona-side site bean is the main runtime coordinator for SSR site requests.

## SSR site model

The SSR site model is onion-based and type-augmentable.

Primary contracts:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrSite.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/ssrSite.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/cli/ssrSite/boilerplate/{{sceneName}}.{{beanName}}.ts_`

An SSR site is declared with `@SsrSite(...)` and usually extends `BeanSsrSiteBase`.

The site options surface includes:

- `publicPath`: the URL prefix owned by the site
- `bundlePath`: the physical asset path for the built frontend bundle
- `apiType`: runtime mode, one of `performAction`, `api`, or `dev`
- `dev.host`: dev-server target when using dev proxy mode
- `pages`: typed page-path contract
- `icons`: typed site icon contract
- `envServer` / `envClient`: environment payload forwarded into SSR runtime state

The type model is intentionally open through module augmentation:

- `ISsrSiteRecord`
- `ISsrSitePublicPathRecord`

That lets concrete modules declare real site names, public paths, page-path records, and icon records while keeping the runtime module generic.

## Environment contract and Basic assumptions

`BeanSsrSiteBase.siteOptions` merges three layers:

1. built-in Vona-side defaults
2. module config defaults from `config.ts`
3. per-site onion options

Relevant sources:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/config/config.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/env.ts`

The default config establishes:

- `apiType: 'performAction'`
- dev host `http://localhost:9000`
- preset links such as `presetLogin`, `presetErrorExpired`, and `presetResource`

The generated environment surface includes values such as:

- `SSR_API_BASE_URL`
- `SSR_PROD_PROTOCOL`
- `SSR_PROD_HOST`
- `SSR_WITH_VONA`
- `META_MODE`
- theme-related cookie/env names such as `SSR_COOKIE_THEMENAME` and `SSR_COOKIE_THEMEDARK`

For Cabloy Basic, this note should be read together with the repo-level rule that frontend/UI assumptions are edition-sensitive.

In practice:

- this Vona-side module is shared infrastructure
- but SSR pages and final UI behavior can still differ by edition
- Basic-specific UI assumptions should stay in public frontend docs, not in this backend architecture note

## Handler loading boundary

The generated frontend bundle is entered through `ServiceSsrHandler`:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/ssrHandler.ts`

This service is responsible for:

- locating `<bundlePath>/handler.js`
- dynamically importing it through a nonce-tagged file URL
- calling `initialize(envServer)` on the imported module
- asking the returned Zova system for `meta.$getSsrHandler(siteAssetDir)`
- ensuring the handler is ready before static resolution or HTML render

This boundary is important because it separates responsibilities clearly:

- `a-ssr` owns bundle discovery and backend invocation
- the generated frontend SSR bundle owns actual render implementation details

If SSR assets exist but rendering still fails inside app logic, the investigation usually needs to continue past `a-ssr` into the generated handler or Zova runtime.

## Dev mode boundary

Dev-mode proxying is isolated in:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/devProxy.ts`

`ServiceDevProxy.web(...)` proxies to the configured frontend dev host only when the request does **not** already resolve to:

- a backend route
- a backend-served static file

That rule prevents the SSR dev proxy from stealing normal backend/static traffic.

If the dev server is not reachable and returns `ECONNREFUSED`, the proxy resolves quietly to `undefined` so the caller can continue its normal resolution path.

This service is the first place to inspect when SSR works in build mode but not in dev mode.

## Render and redirect integration with controller routes

The module exposes decorator helpers through:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/ssr.ts`

These helpers create aspect interceptors:

- `Ssr.render(...)` -> `a-ssr:ssrRender`
- `Ssr.redirect(...)` -> `a-ssr:ssrRedirect`

Implementation sources:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/interceptor.ssrRender.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/interceptor.ssrRedirect.ts`

### `Ssr.render(...)`

The render interceptor:

- runs the original controller action first
- checks whether the response content type is HTML
- injects the controller result into `pageOptions.data`
- copies route params and query into page options
- calls `bean.ssr.render(...)`

This is the main bridge from a Vona controller response into an SSR page render.

### `Ssr.redirect(...)`

The redirect interceptor:

- checks whether the response content type is HTML
- combines route params/query with configured page options
- redirects to the configured SSR page route
- can enforce redirect-only behavior through `redirectOnly`

This is the right boundary when the backend route should hand off navigation to an SSR page instead of rendering content directly.

## Top-level SSR facade bean

The convenient bean surface is:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/bean.ssr.ts`

`BeanSsr` is a thin facade over per-site beans. It:

- resolves a site onion name to the real `ssrSite` bean
- delegates `redirect(...)`
- delegates `render(...)`
- retrieves site menus by public path and emits menu-related extension events

This bean keeps most callers from having to resolve site bean full names manually.

## Server-side action bridge

The most important `performAction` behavior lives in:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`

When `apiType === 'performAction'`, the site base creates a callback that the rendered SSR application can use to call back into backend actions.

Important responsibilities of `_createPerformAction()`:

- normalize forwarded headers
- copy locale and timezone headers into the current request context
- initialize the backend instance exactly once for the callback lifecycle
- restore or validate auth token state when available
- throw only on JWT-expired semantics when appropriate
- sign in anonymously if no authenticated user is established
- execute backend actions through `executor.performActionInner(...)`
- JSON-normalize object responses before returning them to the SSR caller

This is the main server-side fullstack bridge for SSR pages that need backend action execution during render or hydration setup.

## Auth redirect boundary

SSR auth handling is centralized in:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/middleware.ssrPassport.ts`

This middleware:

- runs after `a-core:gate`
- catches `401` errors on non-JSON requests
- checks whether the current route is using SSR redirect/render interceptors
- redirects HTML traffic to preset login or expired-session pages
- passes a `returnTo` query so the user can be sent back after auth flow

This design keeps SSR auth fallback behavior tied to SSR-aware routes instead of applying it blindly to all backend traffic.

## Menu and menu-group architecture

Menu assembly is site-scoped and locale-aware.

Primary sources:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrMenu.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrMenuGroup.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/event.retrieveMenus.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/event.retrieveMenusSite.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/cli/ssrMenuWeb/boilerplate/{{sceneName}}.{{beanName}}.ts_`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/cli/ssrMenuGroupWeb/boilerplate/{{sceneName}}.{{beanName}}.ts_`

The site base:

- reads enabled `ssrMenu` and `ssrMenuGroup` onions
- filters them by site and locale
- expands single-item or multi-item definitions
- localizes title/description through `app.meta.text.locale(...)`
- normalizes preset menu links through `ServiceSsr.prepareMenuLink(...)`
- caches the final menu/group set by site bean, instance, host, and locale

This means menu ownership is distributed across onion definitions, while final assembly stays in the site runtime.

## Cache and HMR boundaries

The module maintains two main cache families:

- site cache through `SymbolCacheSites`
- menu cache through `SymbolCacheMenus`

Cache helpers live in:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/const.ts`

Relevant reload logic:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/hmr.ssrSite.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/hmr.ssrMenu.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/hmr.ssrMenuGroup.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.hmrReload.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/monkey.ts`

Important behavior:

- site HMR reload clears site cache
- menu/menu-group reload clears menu cache
- locale reload clears menu cache and triggers SSR reload
- controller-scene reload reloads SSR site beans and then triggers SSR reload
- app close removes HMR-recorded `.ssrSite.` bean instances to avoid leftover site bean instances

This is the first area to inspect when SSR changes appear stale until a full restart.

## Diagnostics boundary

The module includes a dedicated SSR memory diagnostic controller:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/controller/memoryDiag.ts`

Endpoints:

- `GET /ssr/memoryDiag/stats`
- `POST /ssr/memoryDiag/gc`
- `POST /ssr/memoryDiag/heapSnapshot`

Access model:

- if `SSR_MEMORY_DIAG_TOKEN` is set, requests must provide `x-ssr-memory-diag-token`
- if the token is unset, the controller is limited to dev/test environments

This controller is an internal operational surface, not normal product API behavior.

It should be read together with:

- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `vona/.claude/skills/detect-ssr-leak/`

## What `a-ssr` owns vs what it does not own

### `a-ssr` owns

- Vona-side dispatch from resolved request path to SSR site
- SSR site registration and path-prefix matching
- dev proxy coordination
- built bundle static-file lookup via the site handler
- backend-side invocation of the generated SSR handler
- Vona controller-to-SSR redirect/render decorators
- SSR auth redirect fallback for HTML routes
- SSR menu and menu-group assembly
- SSR memory diagnostic endpoints
- cache invalidation and SSR-related HMR orchestration on the Vona side

### `a-ssr` does not own

- the frontend application's page implementation
- the generated frontend bundle contents beyond loading and invocation
- lower-level Zova runtime SSR semantics
- Vue runtime-core SSR setup semantics
- edition-specific UI component choices

When debugging, this split is critical.

If request dispatch, handler loading, redirect behavior, or backend-side performAction bridging is wrong, start in `a-ssr`.

If render output, hydration semantics, composable behavior, or setup-state semantics are wrong after the handler is entered, the investigation often belongs in Zova or runtime-core instead.

## Typical source-tracing order

When changing or debugging this subsystem, use this order.

### SSR route is not being matched

1. `src/service/ssr.ts`
2. `src/bean/eventListener.resolvePath.ts`
3. concrete `@SsrSite(...)` registration and `publicPath`

### Dev mode behaves differently from build mode

1. `src/service/devProxy.ts`
2. site `apiType` / `dev.host`
3. site bundle output and `handler.js` presence

### HTML should render or redirect differently

1. `src/lib/ssr.ts`
2. `src/bean/interceptor.ssrRender.ts`
3. `src/bean/interceptor.ssrRedirect.ts`
4. `src/bean/bean.ssr.ts`
5. `src/lib/beanSsrSiteBase.ts`

### SSR auth fallback is wrong

1. `src/bean/middleware.ssrPassport.ts`
2. route interceptor metadata
3. preset menu-link config in `src/config/config.ts`

### Menus or groups are missing or stale

1. `src/lib/beanSsrSiteBase.ts`
2. `src/service/ssr.ts`
3. `src/bean/event.retrieveMenus*.ts`
4. HMR/cache invalidation sources

### Memory/leak diagnostics are needed

1. `src/controller/memoryDiag.ts`
2. `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
3. `vona/.claude/skills/detect-ssr-leak/`

## Invariants future refactors should preserve

1. SSR site dispatch must continue to resolve by enabled site registrations and `publicPath` specificity
2. Vona-side resolution order must remain: dev proxy -> static asset lookup -> SSR render fallback
3. `a-ssr` should stay a backend orchestration layer, not absorb frontend app logic
4. route-level redirect/render decorators should continue to gate SSR-specific auth fallback behavior
5. menu and menu-group assembly should remain site-aware, locale-aware, and cache-invalidated by SSR-related HMR events
6. handler loading should continue to make the generated `handler.js` boundary explicit
7. internal SSR diagnostics should remain operationally protected and should not drift into normal public API assumptions

## Related records

- `.docs-internal/architecture/README.md`
- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `.docs-internal/decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md`
- `.docs-internal/decisions/0004-fullstack-ssr-and-bidirectional-type-flow.md`
- `cabloy-docs/frontend/ssr-overview.md`
- `cabloy-docs/frontend/ssr-env.md`
- `cabloy-docs/frontend/ssr-init-data.md`
- `cabloy-docs/frontend/ssr-client-only.md`
- `cabloy-docs/frontend/ssr-seo-meta.md`
