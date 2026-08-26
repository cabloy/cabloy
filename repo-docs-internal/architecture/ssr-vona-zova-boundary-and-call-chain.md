# SSR Vona/Zova Boundary and Call Chain

This note explains the end-to-end SSR call chain across the Vona-side `a-ssr` module, the generated Zova SSR bundle, and the Zova SSR runtime layers.

Use it when future work needs to:

- trace a request from Vona path resolution into Zova SSR render and back to the HTTP response
- decide whether an SSR bug belongs in Vona `a-ssr`, in Zova `a-ssrserver`, in Zova `a-ssr`, or in generated frontend code
- preserve the boundary between backend orchestration and frontend SSR runtime responsibilities
- understand how SSR state, meta, preload links, and hydration handoff are transferred from server to client

## Why this note exists

For the Vona-side `a-ssr` module boundary itself, first read `repo-docs-internal/architecture/a-ssr-module-architecture.md`. For the approved request-local `public` / `session` profile refactor, read [SSR Request-Local Profiles](ssr-request-local-profiles.md).

The internal `a-ssr` architecture note explains the Vona-side module itself.

That still leaves an important cross-layer question:

- where exactly does Vona stop and Zova begin during SSR?

That boundary matters because Cabloy SSR is intentionally fullstack.

A single request crosses multiple layers:

1. Vona request and static-path resolution
2. Vona SSR site orchestration
3. generated Zova bundle bootstrap through `handler.js`
4. Zova SSR handler runtime and route resolution
5. Zova SSR context/meta/state injection
6. client hydration handoff

Without a durable call-chain note, future contributors can fix bugs in the wrong layer or blur responsibilities between backend orchestration and frontend runtime behavior.

## Layer model

The SSR stack should be read as four cooperating layers.

### Layer 1: Vona SSR orchestration

Primary sources:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/ssrHandler.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.resolvePath.ts`

Owns:

- path-prefix matching by SSR site
- dev proxy vs static asset vs SSR render decision
- loading the generated bundle entry `handler.js`
- constructing SSR render input from Vona request/response state
- ending the HTTP response with returned HTML

### Layer 2: Generated Zova bundle entry contract

Runtime contract surfaced by:

- `handler.js` at the site bundle root
- `quasar.manifest.json` beside the handler

Observed through:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`

Owns:

- exported `initialize(envRuntime)` bootstrap
- exported render helpers used by Zova SSR runtime
- generated client/server build artifacts for the site

### Layer 3: Zova SSR server runtime

Primary sources:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/monkeySys.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/types/ssr.ts`

Owns:

- registering `sys.meta.$getSsrHandler(siteAssetDir)`
- resolving frontend routes for SSR render
- serving built client assets under the bundle directory
- resolving the effective SSR profile/options for production HTTP response policy before `serverEntry`
- setting `Cache-Control: private, no-store` immediately for a `session` profile
- calling `serverEntry`, `renderToString`, and `renderTemplate`
- generating preload links from the client manifest
- applying public HTTP `responseCache` headers only after a successful render

### Layer 4: Zova SSR application/runtime semantics

Primary sources:

- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/types/ssr.ts`

Owns:

- SSR context initialization
- server-side state/meta accumulation
- hydration pre-state on the client
- SSR-side render error capture
- server-context disposal after render
- app/module tracking for preload generation

## End-to-end request sequence

The durable SSR sequence is:

```text
HTTP request
  -> Vona static/path resolution
  -> a-ssr site selection by publicPath
  -> a-ssr chooses one of:
       - dev proxy
       - built static asset
       - SSR render
  -> Vona imports bundle handler.js and calls initialize(envServer)
  -> Zova sys.meta.$getSsrHandler(siteAssetDir)
  -> Zova ServiceSsrHandler resolves route and renders app
  -> Zova SSR runtime injects state/meta/preload output
  -> Vona writes HTML response
  -> browser hydrates using injected SSR state/meta
```

A more explicit sequence diagram is:

```text
Browser
  -> Vona a-static:resolvePath
  -> EventListenerResolvePath
  -> BeanSsrSiteBase.resolvePath
     -> [dev] ServiceDevProxy.web
     -> [prod static] ServiceSsrHandler.resolvePath -> bundle client asset
     -> [prod render] BeanSsrSiteBase.render
          -> Vona ServiceSsrHandler.ensureReady
               -> import handler.js
               -> initialize(envServer)
               -> zova sys.meta.$getSsrHandler(siteAssetDir)
          -> zova ServiceSsrHandler.render
               -> resolveRoute(pagePathFull)
               -> resolve ssrProfile/options for HTTP response policy
               -> [session] set Cache-Control: private, no-store
               -> serverEntry(ssrContext)
                    -> app initialization
                    -> a-router.appInitialize resolves the current route
                       and seeds request-local profile/options and locale
               -> renderToString(renderFn, ssrContext)
               -> onRendered callbacks
               -> inject state/meta/preloads
               -> renderTemplate(ssrContext)
               -> [public] apply resolved responseCache after successful render
          -> Vona res.end(html)
Browser
  <- HTML with SSR state/meta/preloads
  -> client boot reads __INITIAL_STATE__ / __Q_META__
  -> hydration completes
```

## Detailed boundary by stage

### Stage 1: Vona decides whether SSR is involved at all

`EventListenerResolvePath.execute(...)` is the first SSR-aware dispatcher:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/bean/eventListener.resolvePath.ts`

It:

- reads enabled SSR sites from `ServiceSsr`
- matches incoming filenames against each site `publicPath`
- strips the matched prefix
- forwards the request remainder to the matched site bean

At this stage, Zova is not involved yet.

If a request never reaches SSR logic, the problem usually belongs in Vona site registration, path matching, or route/static resolution order.

### Stage 2: Vona site runtime decides dev proxy vs static asset vs render

`BeanSsrSiteBase.resolvePath(...)` owns this decision:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`

Decision order:

1. if `apiType === 'dev'`, proxy to the frontend dev host
2. otherwise ensure the SSR handler is ready
3. ask the handler whether a built static asset exists
4. if not, perform SSR render

This ordering is an important invariant. The dev-proxy branch bypasses the built Zova `ServiceSsrHandler.render()` path, including its production HTTP response-policy resolution and response-cache handling. Direct Vite/Quasar dev SSR therefore reaches the same `a-router.appInitialize()` boundary that resolves the current route and prepares request-local profile/options and locale before profile-sensitive application initialization; client `a-ssr` `router.beforeEach` remains responsible for later navigation synchronization. Direct dev SSR cannot validate the production handler's response-header behavior.

The Vona-side site bean remains the outer orchestrator even after the frontend bundle is involved.

### Stage 3: Vona boots the generated Zova bundle

`vona` enters the bundle through:

- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/ssrHandler.ts`

The Vona-side service:

- finds `<siteAssetDir>/handler.js`
- imports it using a nonce-tagged file URL
- calls `initialize(envServer)`
- asks the returned Zova system for `meta.$getSsrHandler(siteAssetDir)`
- keeps the resulting SSR handler instance cached for the site bean

This is the most important cross-layer boundary in the fullstack flow.

Vona does **not** render the frontend app itself.

It only loads the generated bundle entry and obtains the runtime handler object that Zova exposes.

### Stage 4: Zova registers the SSR handler factory on system metadata

The registration point is:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/monkeySys.ts`

`sysInitialize()` defines:

- `sys.meta.$getSsrHandler(siteAssetDir)`

That function creates or resolves `ServiceSsrHandler` inside Zova.

This means the bundle bootstrap does not hand Vona a raw render function directly.

Instead, it hands Vona a Zova system whose metadata can produce a site-aware SSR handler bean.

### Stage 5: Zova SSR server runtime resolves route and renders HTML

The core server-side render layer is:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`

Its responsibilities split into two branches.

#### Static asset resolution

`resolvePath(filename)`:

- normalizes empty filename to `index.html`
- resolves `siteAssetDir/client/<filename>`
- returns the asset path when it exists

This is why built static assets are still served through the SSR handler boundary rather than by Vona independently guessing the bundle layout.

#### HTML render

`render(options)`:

- derives `pagePathFull` from SSR state or request URL
- resolves the route through `SysRouter`
- resolves the effective profile/options for HTTP response policy
- immediately sets `Cache-Control: private, no-store` for `session`
- creates `ssrContext` with the caller's request-local state copy, without pre-seeding route profile fields
- calls `serverEntry(ssrContext)`
- lets `a-router.appInitialize()` resolve the current route and prepare request-local profile/options and locale before profile-sensitive application initialization, for both built and direct SSR
- calls `renderToString(renderFn, ssrContext)`
- flushes `onRendered` callbacks
- records render errors through SSR meta state
- generates module preload tags from `quasar.manifest.json`
- renders final HTML through `renderTemplate(ssrContext)`
- applies resolved public HTTP `responseCache` headers to the Vona response only after successful rendering

The handler's route/profile resolution is authoritative only for HTTP response policy. `a-router.appInitialize()` is authoritative for route-derived application profile/options and locale state in both built and direct SSR; consumers must not depend on route-specific profile state before that boundary. Client router `beforeEach` applies destination profile and locale before downstream guards, while failed navigation restores both the committed profile and the exact prior locale.

This layer owns the server-side HTML assembly model.

### Stage 6: Zova SSR runtime injects state, meta, and hydration handoff data

The application/runtime semantics live in `zova-module-a-ssr`.

#### SSR context and hydration pre-state

- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`

`CtxSSR.initialize()` owns:

- server-context registration
- pre-hydration flagging on server and client
- SSR state access
- mismatch-handling hooks during hydration
- deferred cleanup of server contexts after render

This is the layer that turns a raw server render into a hydration-aware app lifecycle.

#### State and meta injection into HTML

- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts`

`CtxSSRMetaStore` injects:

- `window.__INITIAL_STATE__`
- `window.__INITIAL_STATE_DEFER__`
- `window.__Q_META__`
- SSR theme/bootstrap helper scripts
- optional body-ready observer logic

It also disposes server contexts and closes the app when final render-time injection is complete.

#### a-model deferred Query Cache handoff

- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts`

After server rendering, `ServiceStorage` dehydrates the request QueryClient into `ssrContext.stateDefer.query`, then clears that server QueryClient. `CtxSSRMetaStore` serializes the deferred state through `window.__INITIAL_STATE_DEFER__`; during client SSR pre-hydration, `ServiceStorage` hydrates the client QueryClient from the same query snapshot.

The current default policy first excludes `meta.ssr.dehydrate === false`, then excludes sync-persisted queries, and otherwise delegates to TanStack Query's successful-query dehydration predicate. `$useStateMem(...)` sets `persister: false`, so a successful memory-state entry remains eligible for this transfer. This is not browser persistence and does not make the state survive a later unrelated reload. Mutations are not included in this snapshot.

This is a Zova Model/SSR-runtime cache handoff, not a Vona-owned business-state store.

#### Client-side hydration bootstrap

- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts`

`SysSsrState` reads the injected globals back on the client and removes the bootstrap script tags.

That is the state handoff point between server render and client hydration.

#### SSR error/meta/module hooks

- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts`

This layer:

- exposes `$ssr` on beans
- exposes `$useMeta(...)` helpers
- tracks loaded modules into `ssrContext.modules` during server render
- captures SSR-side navigation/auth/render errors into SSR context state

## The shared Vona/Zova contract

The durable cross-layer contract is small but important.

### Filesystem contract

Expected bundle artifacts:

- `<siteAssetDir>/handler.js`
- `<siteAssetDir>/quasar.manifest.json`
- `<siteAssetDir>/client/*`

If these artifacts are missing, the failure belongs at the build/output boundary rather than the SSR routing boundary.

### Bootstrap contract

Vona expects the imported bundle entry to support:

- `initialize(envServer)`

and to expose a Zova system whose metadata supports:

- `$getSsrHandler(siteAssetDir)`

### Handler contract

The handler is expected to support:

- static asset resolution
- HTML render from request/response plus SSR state

The type surface is declared in:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/types/ssr.ts`

### SSR context contract

The shared SSR context/state shape includes:

- `state`
- `stateDefer`
- `_meta`
- `performAction`
- `onRendered(...)`
- `modules`

Primary type surface:

- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/types/ssr.ts`

## Ownership split

### Vona owns

- matching SSR sites by `publicPath`
- outer request/response lifecycle
- dev proxy fallback
- calling into the generated bundle
- site-level envServer/envClient assembly
- route decorators that map backend controller flow to SSR render/redirect
- final `res.statusCode`, headers, and `res.end(html)`

### Zova SSR server runtime owns

- bundle-local static asset layout under `client/`
- route resolution for SSR page render
- resolving profile/options for HTTP response policy without owning route-derived application state
- creating SSR context
- calling generated `serverEntry`, `renderToString`, and `renderTemplate`
- module preload generation from manifest
- HTTP response-cache header policy

### Zova SSR application/runtime owns

- SSR context semantics
- state/meta accumulation and injection
- theme/bootstrap helper scripts for hydration-sensitive behavior
- hydration pre-state and mismatch handling
- SSR-side app/module cleanup after render

### Generated site bundle owns

- the actual frontend application tree
- page components and controller/render behavior
- emitted `handler.js` entry
- emitted manifest and client assets

## Practical debugging split

Use this rule when triaging SSR bugs.

### Start in Vona `a-ssr` when

- the request never enters the expected SSR site
- `publicPath` matching is wrong
- dev proxy behavior is wrong
- the site bundle path is wrong
- controller `Ssr.render(...)` or `Ssr.redirect(...)` behavior is wrong
- the backend response is not being converted into SSR page render correctly

### Start in Zova `a-ssrserver` when

- `handler.js` loads but route resolution fails
- built assets exist but static resolution is wrong
- HTML render fails after entering the handler
- module preload tags or HTTP response-cache behavior are wrong

### Start in Zova `a-ssr` when

- injected SSR state/meta is wrong
- hydration pre-state or mismatch behavior is wrong
- SSR render errors are captured incorrectly
- server contexts are not cleaned up after render
- client bootstrap state restoration is wrong

### Start in generated app code when

- route/page logic itself is wrong
- page output is wrong despite correct runtime handoff
- page-level data assumptions or meta usage are wrong

## Invariants future refactors should preserve

1. Vona must remain the outer orchestrator of the HTTP lifecycle
2. the bundle boundary must stay explicit through `handler.js` and `$getSsrHandler(siteAssetDir)`
3. static asset lookup and HTML render should continue to flow through the handler boundary rather than through duplicated ad-hoc logic
4. Zova SSR runtime should remain responsible for state/meta injection and hydration handoff semantics
5. server-side cleanup should continue to happen after render completion, not earlier during app render
6. frontend UI/application logic should not be pulled into the Vona-side SSR runtime module

## Related records

- `repo-docs-internal/architecture/a-ssr-module-architecture.md`
- `repo-docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `repo-docs-internal/decisions/0004-fullstack-ssr-and-bidirectional-type-flow.md`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts`
