# A-Router Guide

This guide explains the router runtime boundary in Zova through the current public Cabloy Basic source:

```text
zova/src/suite-vendor/a-zova/modules/a-router
```

Use this page when you want to understand:

- what `a-router` is responsible for
- what `a-router` is **not** responsible for
- how module route records become operational router records
- how system startup and app startup cooperate around routing
- where `$route`, `$params`, and `$query` reach page controllers
- where `a-router` stops and router-view host behavior begins

## Why this page exists

The existing router docs already explain several important layers:

- [Page Route Guide](/frontend/page-route-guide) explains the public route-record surface
- [Navigation Guards Guide](/frontend/navigation-guards-guide) explains route policy hooks
- [Page Params Guide](/frontend/page-params-guide) and [Page Query Guide](/frontend/page-query-guide) explain typed route-state authoring
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood) explains the broader runtime cooperation
- [Router View Hosts Guide](/frontend/router-view-hosts-guide) explains how routed pages are hosted after route resolution

What those pages do not isolate directly is the module boundary of `a-router` itself.

That is the gap this page fills.

In the current Basic source, `a-router` is not only a thin wrapper around Vue Router and not only a route-record registry. It is the runtime package that connects module route registration, router creation, startup readiness, guard flow, controller route-state injection, and the handoff into routed hosts.

## The shortest accurate mental model

A practical mental model is:

1. modules declare route records through `routes.ts`
2. `a-router` registers those records into the shared router during system startup
3. `a-router` merges config routes, expands module-relative paths, synthesizes aliases, and wraps routes with layout structure when needed
4. `a-router` makes the main router operational during app startup
5. `a-router` guard flow lazy-loads modules and normalizes alias or fallback behavior during navigation
6. `a-router` pushes `$route`, `$routeMatched`, `$params`, and `$query` onto page controllers
7. the resolved routed output then enters a router-view host for page-instance ownership and keep-alive behavior

That is why `a-router` is a real Zova architectural boundary rather than only a route-table utility.

## What `a-router` is

In the current Basic source, `a-router` is mainly these seven things:

- a **module integration surface** through generated metadata
- a **shared system router owner** through `SysRouter`
- a **module-route registration bridge** through `monkeySys.ts`
- an **app lifecycle and router readiness bridge** through `monkey.ts`
- a **guard service** through `ServiceRouterGuards`
- a **page-controller route-state injection layer** through `monkey.ts`
- a **routed-host handoff boundary** through `routerViewBase.tsx`

Those roles make `a-router` the package that turns route declarations into operational routed frontend behavior.

## What `a-router` is not

It is equally important to avoid over-assigning responsibilities to `a-router`.

`a-router` does **not** itself own:

- the authoring explanation for route records and their public meaning
- the full typed params/query authoring story
- the business-facing explanation for navigation policy and auth design
- the detailed semantics of `routerViewEmpty`, `routerViewTabs`, or `routerViewStack`
- the tabs or stack workspace models
- the layout component implementations themselves

Those responsibilities belong to other routing, host, and layout docs.

So when you read `a-router`, read it as the runtime package that operationalizes routing, not as the page-authoring guide and not as the routed-host guide.

## The core source-reading path

When reading `a-router`, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-router/src/.metadata/index.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/sys.router.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkeySys.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/bean.router.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-router/src/types/router.ts`
8. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx`

That order moves from integration surface, to system router ownership, to startup hooks, to navigation flow, to app-level router-view coordination, to type contract, and finally to the routed-host handoff boundary.

## What each source file clarifies

### `src/.metadata/index.ts`

This is the generated integration map for the module.

It shows that `a-router` contributes:

- model export and typing for page data
- router sys bean registration
- router bean registration
- router guard service registration
- the `routerViewEmpty` component export
- config, monkey, and scope integration

This file is the best single map of how `a-router` enters the larger Zova bean, config, and component records.

### `src/bean/sys.router.ts`

This is the shared router owner.

Its main jobs are:

- create the router instance and choose history mode
- load config routes by path and name
- load legacy routes if present
- register module routes into real router records
- expand module-relative route paths and names
- merge config-route overrides
- synthesize alias routes when needed
- wrap routed pages with layout routes when `meta.layout` requires it
- expose helpers such as `getPagePath(...)`, `resolveName(...)`, and `ensureRoute(...)`

This is the file that most clearly shows how a module-local route record becomes operational router structure.

### `src/monkeySys.ts`

This file is the system-startup route registration bridge.

Its most important job is:

- when a module is loading and contributes `resource.routes`, call `sysRouter._registerRoutes(module)`

That matters because route registration belongs to system startup rather than being delayed until page code happens to execute.

This file also exposes application-level helpers such as:

- `$gotoPage(...)`
- `$gotoHome(...)`
- `$gotoLogin(...)`
- `$getCurrentPagePath()`

So `monkeySys.ts` is not only about route registration. It also helps define the application-facing router convenience surface.

### `src/monkey.ts`

This file is the app lifecycle and controller route-state bridge.

Its main jobs are:

- create or retrieve the main router bean
- attach guard setup through the router-guards event flow
- make the router operational during `appReady()`
- inject `$router`, `$routerView`, `$pageRoute`, and `$currentRoute` onto bean instances
- prepare controller route context
- push `$route` and `$routeMatched` onto page controllers
- parse typed `$params` and `$query` from page schemas and preserve stable client references
- handle SSR/client redirect-related error behavior

This is the key source file if your question is: “where do page controllers actually receive route-aware state?”

## `src/service/routerGuards.ts`

This file is the navigation guard runtime layer.

Its main jobs are:

- run `beforeEach(...)` checks
- lazy-load modules during navigation when needed
- normalize alias redirect behavior
- retry route resolution after module loading when appropriate
- handle 404/module-load preparation checks
- emit back/forward notifications after navigation

This file is the best place to read when the route exists conceptually but is not yet fully operational at navigation time.

## `src/bean/bean.router.ts`

This file is the app-level router bean and router-view coordination surface.

Its main jobs are:

- create the main app router from `SysRouter`
- expose router APIs through the bean surface
- register and deregister active router-view hosts
- forward back-route and forward-route notifications to hosts
- forward `setPageMeta(...)` updates to hosts

This is the layer that connects the router runtime to routed-host controllers.

## `src/types/router.ts`

This file is the public type contract for the router package.

It shows the extended route meta and app/bean/controller-facing router surface, including:

- `RouteMeta.layout`
- `RouteMeta.requiresAuth`
- `RouteMeta.locale`
- `RouteMeta.componentKeyMode`
- `RouteMeta.componentKey`
- `RouteMeta.tabKey`
- `RouteMeta.keepAlive`
- app helpers such as `$gotoPage(...)`
- bean-level `$router`, `$routerView`, `$pageRoute`, and `$currentRoute`
- page-controller `$route` and `$routeMatched`

This is the best file to read when you want to verify what the router package promises to the rest of the application.

## `src/lib/routerViewBase.tsx`

This file is the handoff boundary from router runtime into routed-host behavior.

What matters here is not the full host model, but the boundary itself:

- `a-router` has already resolved the routed page path
- the routed output now enters a router-view host
- that host wraps `RouterView`, computes host-facing route meta, manages `KeepAlive`, and injects the current page route into the routed vnode

This is the point where router runtime responsibility gives way to routed-host responsibility.

For the detailed host layer, continue with [Router View Hosts Guide](/frontend/router-view-hosts-guide).

## System startup vs app startup

A practical distinction in `a-router` is:

- **system startup** registers module routes into the shared router structure
- **app startup** makes the operational router ready for the running application instance

In source terms:

- `monkeySys.ts` handles module route registration
- `monkey.ts` handles app readiness and page-controller route-state injection

This split matters because it explains why route-table wiring and first-screen navigation readiness are related but not identical responsibilities.

## How layout enters the router runtime

One of the most important source-confirmed details in `SysRouter._registerRoute(...)` is that layout is not only a visual afterthought.

When layout is enabled:

- `a-router` wraps the routed page in a parent route
- the parent route uses the resolved layout component
- the original page route becomes the child route

That means layout choice becomes runtime route structure inside `a-router`, not only a later rendering preference.

## How page controllers receive route-aware state

A key Zova-specific behavior in `a-router` is that route-aware page state becomes part of the page-controller surface.

In `monkey.ts`, page controllers receive:

- `$route`
- `$routeMatched`
- `$params`
- `$query`

The important point is that this is not only a thin `useRoute()` translation.

The route state is pushed through the controller lifecycle and, for `$params` and `$query`, parsed from the page-schema records that belong to the module resource.

That is one reason the routing model stays tightly integrated with the rest of Zova’s controller-oriented architecture.

## Where `a-router` stops and router-view hosts begin

A useful boundary rule is:

- `a-router` owns route registration, layout wrapping, startup readiness, guard flow, and page-controller route-state injection
- router-view hosts own routed page instance hosting, `tabKey`, `componentKey`, `keepAlive`, and empty/tabs/stack host behavior

So if your next question is:

- “how does the route become operational?” stay in `a-router`
- “which host owns the routed page instance now?” continue to [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- “should this host behave like tabs or stack?” continue with [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)

## Read together with

Use this page together with:

- [Page Route Guide](/frontend/page-route-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Page Params Guide](/frontend/page-params-guide)
- [Page Query Guide](/frontend/page-query-guide)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Final takeaway

The most accurate way to read `a-router` is not as a generic Vue Router wrapper and not as the owner of every routing-related concern.

Read it as the Zova router runtime package that:

- registers module routes
- creates and normalizes operational router structure
- makes the router ready during app startup
- injects route-aware state into page controllers
- hands routed output into router-view hosts

That is the source-confirmed role of `a-router` in the current Basic frontend architecture.
