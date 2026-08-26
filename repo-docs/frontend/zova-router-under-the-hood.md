# Zova Router Under the Hood

This guide explains the source-level runtime path behind Zova Router.

Use this page after [Page Route Guide](/frontend/page-route-guide), [A-Router Guide](/frontend/a-router-guide), [Route Alias Guide](/frontend/route-alias-guide), and [Navigation Guards Guide](/frontend/navigation-guards-guide) when you want to move from the public routing surface to the internal cooperation among route registration, router startup, lazy module loading, alias handling, typed params/query parsing, and router-view hosting.

If your next question is specifically about empty/tabs/stack routed hosts, continue with [Router View Hosts Guide](/frontend/router-view-hosts-guide). For compact file-order guidance, continue with [Zova Source Reading Map](/frontend/zova-source-reading-map).

> [!TIP]
> **Zova Router docs path**
>
> 1. **[Page Route Guide](/frontend/page-route-guide)** — learn the public route-record and layout surface
> 2. **[A-Router Guide](/frontend/a-router-guide)** — learn what the `a-router` package owns in the runtime
> 3. **[Route Alias Guide](/frontend/route-alias-guide)** — learn how user-facing aliases fit into modular routing
> 4. **[Navigation Guards Guide](/frontend/navigation-guards-guide)** — learn where routing policy attaches
> 5. **[Zova Router Under the Hood](/frontend/zova-router-under-the-hood)** — learn how the runtime pieces cooperate
> 6. **[Zova Source Reading Map](/frontend/zova-source-reading-map)** — learn which files to read next
>
> **You are here:** step 5.
> **Previous pages:** [Page Route Guide](/frontend/page-route-guide), [A-Router Guide](/frontend/a-router-guide), [Route Alias Guide](/frontend/route-alias-guide), and [Navigation Guards Guide](/frontend/navigation-guards-guide).
> **Next recommended pages:** [Router View Hosts Guide](/frontend/router-view-hosts-guide) for routed-host behavior, then [Zova Source Reading Map](/frontend/zova-source-reading-map) for compact source-reading paths.

## Router ecosystem map

Use this compact map when you want to place this page inside the broader Router documentation set.

| Layer                  | Main question                                                             | Primary page                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| public routing surface | what does the route record mean?                                          | [Page Route Guide](/frontend/page-route-guide)                                                                         |
| route policy           | how do aliases and guards change navigation semantics?                    | [Route Alias Guide](/frontend/route-alias-guide), [Navigation Guards Guide](/frontend/navigation-guards-guide)         |
| core router runtime    | how does the route become operational at runtime?                         | this page                                                                                                              |
| routed host layer      | once the route is resolved, which host owns the page instance?            | [Router View Hosts Guide](/frontend/router-view-hosts-guide)                                                           |
| tabs vs stack choice   | should this routed host behave like a workbench or a linear routed stack? | [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)                                                                 |
| stack host meaning     | what does the stack host actually own?                                    | [Router Stack Guide](/frontend/router-stack-guide)                                                                     |
| tabs workbench meaning | why does the tabs host exist conceptually?                                | [Router Tabs Introduction](/frontend/router-tabs-introduction), [Router Tabs Overview](/frontend/router-tabs-overview) |
| tabs model internals   | how does the tabs host turn route visits into workspace state?            | [Router Tabs Mechanism](/frontend/router-tabs-mechanism)                                                               |
| tabs authoring inputs  | how do I produce the intended tabs behavior through route meta?           | [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)                                           |
| compact source paths   | which files should I read next?                                           | [Zova Source Reading Map](/frontend/zova-source-reading-map)                                                           |

## Why this page exists

The public routing docs already explain the authoring surface:

- `routes.ts`
- route `meta`
- route aliases in global config
- navigation guards as policy hooks
- typed params and query through generated schemas

What many contributors and AI workflows still want next is the implementation bridge:

- where module routes are registered into the router
- where route config and aliases are merged
- where app startup makes the router operational
- where lazy module loading happens during navigation
- where `$route`, `$params`, and `$query` are pushed onto page controllers
- where routed pages enter router-view hosts such as empty, tabs, or stack-style shells
- how those hosts differ once the route is already resolved

This page is that bridge.

## The shortest accurate runtime model

For a typical Zova page route, the shortest accurate model is:

1. module `routes.ts` declares the page route record
2. system startup registers module routes into the shared system router
3. route config can merge alias, layout, or other route overrides on top of that declaration
4. app startup creates the main router bean, attaches guards, injects Vue Router into the app, and drives first navigation
5. navigation guards lazy-load modules and normalize alias or fallback behavior before the route is finalized
6. page-controller route state is pushed into `$route`, `$params`, and `$query`
7. a router-view host renders the matched page inside the chosen shell and keep-alive strategy

That is why Zova Router is not only a thin wrapper around Vue Router. The business-facing runtime is still module-oriented, bean-oriented, and startup-aware.

## A concrete source specimen

A small public route table that shows several important route decisions clearly is:

```text
zova/src/suite/a-demo/modules/demo-basic/src/routes.ts
```

Representative shape:

```typescript
export const routes: IModuleRoute[] = [
  { path: 'routeQuery', component: ZPageRouteQuery, meta: { requiresAuth: false } },
  {
    name: 'routeParams',
    path: 'routeParams/:id?',
    component: ZPageRouteParams,
    meta: {
      componentKeyMode: 'nameOnly',
      requiresAuth: false,
    },
  },
  {
    path: 'toolMinimal',
    component: ZPageToolMinimal,
    meta: {
      layout: 'empty',
      requiresAuth: false,
    },
  },
];
```

What matters here is not only the route strings.

What matters is that:

- the module declares routes relative to the module boundary by default
- dynamic-parameter routes require `name` for typed params; static routes normally remain path-keyed
- route `meta` controls shell-facing behavior such as layout and component reuse strategy
- the route record is only the first layer; config, guards, startup timing, and router-view hosting still cooperate afterward

## The core source-reading path

When you want to trace the full mechanism, read these files in order:

1. `zova/src/suite/a-demo/modules/demo-basic/src/routes.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/sys.router.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/utils.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx`

A compact role map is:

- `routes.ts` shows the public authoring surface for page routes
- `sys.router.ts` owns shared router creation, route registration, alias synthesis, and typed path generation helpers
- `monkeySys.ts` hooks module loading so newly loaded modules can contribute routes into the system router
- `monkey.ts` owns app-level router lifecycle, guard/event readiness, page-controller route injection, and SSR/client redirect handling
- `service/routerGuards.ts` owns lazy module loading during navigation and alias redirection behavior
- `utils.ts` normalizes canonical route identity and current/page route lookup
- `routerViewBase.tsx` shows how routed pages enter a Zova router-view host rather than bypassing the bean/controller architecture

## Step-by-step runtime path

### 1. The route record starts in module-local `routes.ts`

The public route declaration surface is a module-local file such as:

```text
zova/src/suite/a-demo/modules/demo-basic/src/routes.ts
```

The important architectural point is:

- **routes are owned by modules, not by one flat global route file**
- **module-relative paths are the default authoring shape**

That is why a route like:

```typescript
{ path: 'toolMinimal', component: ZPageToolMinimal }
```

later becomes the full page path `/demo/basic/toolMinimal` after module-aware registration.

### 2. The system router is the shared route-table owner

The main shared runtime owner is:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/bean/sys.router.ts
```

Inside `SysRouter.__init__()` the system router:

- creates the shared Vue Router instance
- loads route overrides from `sys.config.routes.path`
- loads route overrides from `sys.config.routes.name`
- loads legacy routes if present

This is one of the most important source-level facts about Zova Router.

The route table is not assembled only from static page files. It is the result of cooperation among:

- module route records
- global config routes
- startup-time module loading
- alias and layout normalization

### 3. Module loading registers routes during system startup

The system-level hook lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts
```

The important runtime detail is that `moduleLoading(module)` checks whether the loading module contributes `resource.routes`, then calls `sysRouter._registerRoutes(module)`.

That matters because:

- route registration belongs to system startup, not only app startup
- newly loaded modules can extend the route table without hand-editing one giant router file
- the same architectural split matches the broader startup model explained in [System Startup Guide](/frontend/system-startup-guide)

A practical reading takeaway is:

- **system startup owns route-table wiring**
- **app startup later owns router readiness and first navigation**

### 4. Route registration expands module-local records into real router records

The most important registration method is:

```text
SysRouter._registerRoute(...)
```

Inside that path, the router runtime performs several important transformations.

#### Module-relative path expansion

If the route is not `meta.absolute === true`, Zova prefixes the module path automatically.

That means:

- `toolMinimal` in module `demo-basic` becomes `/demo/basic/toolMinimal`
- named route `routeParams` becomes `demo-basic:routeParams`

This is one reason route authoring stays compact while runtime routing stays globally unique.

#### Config-route merging

Before adding the route, the runtime checks `sys.config.routes.name` or `sys.config.routes.path` and deep-merges the config route on top of the module declaration.

That is why an approved alias or shared route-policy override belongs in config instead of being hand-spread across module route files. An alias is an explicit public-URL contract, not a routine convenience: ordinary business routes without `locale` params keep their canonical module path unless a documented system entry, compatibility path, or designed user-facing URL requires an exception.

Representative config source:

```text
zova/src/front/config/config/config.ts
```

Representative shape:

```typescript
config.routes = {
  path: {
    '/home/indexadmin/dashboard': { alias: '/' },
    '/home/login': { alias: '/login' },
  },
  name: {
    'demo-todo:item': { alias: '/todo/:id' },
  },
};
```

#### Alias synthesis for named routes

If a named route has a config alias, Zova also creates an internal `$alias:<name>` route under `/__alias__...`.

This detail is important because:

- user-facing aliases can stay path-shaped
- the runtime can still preserve named-route identity and params-aware resolution
- alias handling remains a router concern instead of leaking into page code

`$alias:<name>` and `/__alias__` are private runtime machinery. Application code should use `$router.getAliasPath('module:page', { params, query }, absolute?)` only when it intentionally needs a configured public alias; the helper accepts the canonical route name and returns that alias path (or `undefined` when no alias is configured). Its optional `absolute` argument uses the same origin and public-path conversion as `getPagePath(...)`. For a known canonical static page path, use path-keyed `$router.getPagePath(...)` instead of adding a route name or alias solely for URL generation.

#### Layout wrapping

If `meta.layout !== false`, the runtime does not register the page component alone.

Instead it creates a parent route that resolves the layout component and makes the page route its child.

That is why routing in Zova is also an app-shell decision, not only a URL decision.

A practical reading takeaway is:

- **layout is normalized during route registration, not as an afterthought in page render code**

### 5. Path and name helpers stay module-aware and schema-aware

The most visible helper is:

```text
SysRouter.getPagePath(...)
```

This helper:

- combines params and query into the page path
- handles locale-specific param normalization
- can return a relative page path or an absolute URL

Zova also exposes canonical named-route resolution through `resolveName(...)` and configured public alias-path generation through `getAliasPath(...)`. Like `getPagePath(...)`, `getAliasPath(...)` can return either a relative path or an absolute URL. These helpers preserve the module-aware naming/path model rather than asking every caller to manually build URLs.

That is why the recommended page-navigation surface stays framework-native:

- `this.$router.getPagePath(...)`
- `this.$router.getAliasPath(...)`
- `this.app.$gotoPage(...)`
- `this.app.$gotoHome(...)`

rather than ad hoc string concatenation.

### 6. App startup creates the main router bean and makes it operational

The app-level lifecycle owner is:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts
```

The important timing split is:

- `appInitialize()` creates the router-guard service and client-side SSR error handling
- `appInitialized()` emits `a-router:routerGuards` so guard contributors can attach to the main router bean
- `appReady()` installs the router into Vue and drives first-navigation readiness for SSR or client hydration
- `appClose()` disposes router-guard listeners

This is the second major source-level fact about Zova Router.

The router runtime is not considered fully ready merely because route records exist. It also needs:

- a router bean instance
- attached guards
- SSR/client readiness handling
- Vue app installation

This matches the broader lifecycle model in [App Startup Guide](/frontend/app-startup-guide).

### 7. `a-router:routerGuards` is the main policy extension point

The shared extension hook begins with:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/bean/bean.routerGuardsBase.ts
```

This base bean subscribes to the `a-router:routerGuards` event and calls `onRouterGuards(router)`.

That means the framework-level guard and app-level guards can both attach through one structured extension point instead of each patching router startup manually.

Representative consumers include:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts`
- `zova/src/suite/a-home/modules/home-base/src/service/routerGuards.ts`

The framework service focuses on routing mechanics such as:

- lazy module loading
- alias redirection
- 404 fallback retry after module loading
- back/forward notifications for router-view hosts

The `home-base` service focuses on application policy such as:

- auth enforcement through `meta.requiresAuth`
- URL-locale participation and initialization through `meta.locale`

A practical reading takeaway is:

- **routing mechanics and business policy are separated, but they meet on the same guard event surface**

### 8. Lazy module loading happens during navigation, not only before startup

The framework guard service lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts
```

Inside `beforeEach(...)`, the router runtime:

1. identifies the matched route
2. checks whether a 404-like match should trigger a module-load retry
3. checks whether the route has a configured alias
4. forces module loading if the target module exists but is not yet loaded
5. retries navigation when module loading completed

That is why Zova routing feels module-aware even when the target module was not preloaded.

A practical reading takeaway is:

- **navigation is part of module activation**
- **the router guard layer is where lazy route availability becomes real runtime behavior**

### 9. Page controllers receive route state through controller-data hooks

The page-controller bridge also lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts
```

The important methods are:

- `controllerDataPrepare(...)`
- `controllerDataInit(...)`
- `controllerDataUpdate(...)`
- `_initControllerRoute(...)`

This is where page controllers receive and refresh:

- `$route`
- `$routeMatched`
- `$params`
- `$query`

This is one of the biggest architectural differences a Vue-first reader notices.

The page controller does not pull everything locally through one composable first. Zova also pushes route-aware page state into the controller lifecycle.

### 10. Typed params and query come from generated page schemas

When `_initControllerRoute(...)` updates a page controller, it resolves the route’s canonical identity and then loads page schemas from the owning module resource:

- `pageNameSchemas` for named routes
- `pagePathSchemas` for path-keyed routes

For page routes with dynamic params, define `route.name` and use the named-route metadata path. Do not rely on an unnamed parameterized route: the generated path-keyed record does not establish the typed controller `$params` contract. Conversely, a static route should not acquire a name merely for typing, canonical URL generation, or alias convenience; keep it path-keyed unless a documented named-route contract requires otherwise.

Those schema records are generated into module metadata.

Representative generator source:

```text
zova/src/suite-vendor/a-zova/modules/a-bean/cli/controller/metadata/generateMetaPage.ts
```

Representative generated output:

```text
zova/src/suite/a-demo/modules/demo-basic/src/.metadata/index.ts
```

That means typed routing in Zova is not only a TypeScript declaration convenience.

It is also a runtime parse step:

- route params and query are parsed by schema
- controller `$params` and `$query` receive parsed values
- on the client, those objects are kept reactive through `shallowReactive(...)`

A practical reading takeaway is:

- **typed routing is generated and runtime-parsed, not just editor-only typing**

### 11. Beans receive router helpers through the router monkey

The same router monkey also defines bean-level helper surfaces such as:

- `$router`
- `$routerView`
- `$pageRoute`
- `$currentRoute`

That matters because route-aware behavior is not isolated to page controllers alone.

Router-view controllers, services, models, and other beans can participate through the same bean-oriented access pattern.

## 12. Router-view hosting stays inside the controller/bean architecture

The shared router-view base lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx
```

This base controller:

- registers itself on the host bean scope as `$$routerView`
- registers and deregisters itself with `$router`
- wraps routed pages in `RouterView`
- prepares route meta for routed pages
- controls keep-alive inclusion through the host implementation
- injects the current page route into the routed vnode through host providers

This is the third major source-level fact about Zova Router.

Routed pages do not bypass Zova and fall directly into a plain Vue Router surface. They still enter through a controller-oriented router-view host.

### Empty host vs richer hosts

A minimal host exists in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/component/routerViewEmpty/controller.tsx
```

That host renders the routed page directly and only injects the current page route provider.

Richer hosts extend the same base in modules such as:

- `a-routertabs`
- `a-routerstack`

For example, the tabs host delegates route meta, keep-alive, and page-meta updates to the tabs model so one routing runtime can support more than one shell behavior.

A practical reading takeaway is:

- **router-view hosting is an extension point, not only one hard-coded component**

## 13. SSR and redirect behavior are also part of router runtime

The router runtime also owns several SSR-sensitive behaviors.

In `monkeySys.ts`, `app.$redirect(...)` and `app.$gotoPage(...)` cooperate with SSR redirects by throwing an SSR-aware error when necessary.

In `monkey.ts`, SSR/client startup handles:

- server-side initial `push(...)` and `isReady()`
- client pre-hydration history alignment
- client redirect/error normalization for 301, 302, 401, and component-unmounted cases

That means router behavior in Zova is not purely a client SPA concern. It is also part of the SSR-ready frontend runtime.

## A practical reading order for source readers

If you want the shortest path from route authoring to runtime understanding, use this order:

1. [Page Route Guide](/frontend/page-route-guide)
2. [Route Alias Guide](/frontend/route-alias-guide)
3. [Navigation Guards Guide](/frontend/navigation-guards-guide)
4. `zova/src/suite/a-demo/modules/demo-basic/src/routes.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/sys.router.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`
8. `zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts`
9. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx`
10. [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Common mistakes to avoid

### Mistake 1: “The route table is just one static Vue Router config”

Usually the better model is that route records are module-owned, system-registered, config-merged, and sometimes lazy-loaded during navigation.

### Mistake 2: “Aliases are just convenience string rewrites”

In Zova, aliases still participate in module-aware route identity, named-route resolution, and guard-time lazy loading.

### Mistake 3: “Typed params/query are only TypeScript sugar”

The generated schemas are also used at runtime to parse route params and query before page controllers consume them.

### Mistake 4: “Page controllers should always pull route state manually”

Zova also pushes route-aware state into page controllers through controller-data hooks so the page controller surface stays cohesive.

### Mistake 5: “RouterView is only a plain shellless Vue concern”

In Zova, router-view hosting is part of the controller/bean architecture and can be extended into empty, tabs, or stack-style route hosts.

## Edition note

This guide explains the shared Zova Router architecture, not one UI-library-specific router shell.

That means the routing runtime model applies across Cabloy Basic and Cabloy Start. However, shell-level presentation and layout integrations can still diverge when the task becomes UI-sensitive or edition-specific.

In the current public framework repository, the active edition is Cabloy Basic.

## Final takeaway

If [Page Route Guide](/frontend/page-route-guide) explains what a route means in Zova, this page explains how that route becomes a running router-aware page through system startup, app startup, guard hooks, generated schemas, and router-view hosting.

That is the mental bridge that makes the Zova Router source tree much easier to read.
