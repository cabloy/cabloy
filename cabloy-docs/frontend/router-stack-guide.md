# Router Stack Guide

This guide explains the Router Stack host in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- what `routerViewStack` is responsible for
- how stack hosting differs from Router Tabs
- where `ControllerRouterViewStack` stops and `ModelStack` begins
- how stack identity, pruning, and keep-alive work
- why stack should be read as a routed-host primitive rather than as a workbench-tabs model

## Why this page exists

The existing router docs already explain several nearby layers:

- [Router View Hosts Guide](/frontend/router-view-hosts-guide) explains the shared routed-host layer
- [Router Tabs Introduction](/frontend/router-tabs-introduction) and the rest of the tabs series explain the workbench-tabs branch
- [A-Router Guide](/frontend/a-router-guide) explains the router runtime boundary before routed-host ownership begins

What those pages do not isolate directly is the stack branch as a first-class host concept.

That is the gap this page fills.

In the current public Basic source, Router Stack is a framework-level routed-host primitive. It is smaller than the tabs model, uses a linear fullPath-keyed identity model, and does not add tabs-style workbench or page-meta semantics.

## The shortest accurate mental model

A practical mental model is:

1. the route has already become operational in `a-router`
2. `routerViewStack` receives the routed page through the shared host contract
3. `ControllerRouterViewStack` forwards host events into `ModelStack`
4. `ModelStack` treats each route visit as a linear stack item keyed by `fullPath`
5. `ModelStack` maintains stack contents, recency pruning, and keep-alive inclusion
6. the host renders routed instances through the shared `BeanRouterViewBase` / `KeepAlive` contract

That means Router Stack is best understood as a linear routed-cache host, not as a workbench/grouped-tabs host.

## What Router Stack is

In the current Basic source, Router Stack is mainly these four things:

- a **shared routed-host specialization** built on `BeanRouterViewBase`
- a **thin controller adapter** through `ControllerRouterViewStack`
- a **linear stack state owner** through `ModelStack`
- a **fullPath-keyed keep-alive and pruning model** for routed instances

Those roles are enough to make it a distinct routed-host strategy, even though its implementation is much smaller than the tabs branch.

## What Router Stack is not

It is equally important to avoid over-assigning responsibilities to Router Stack.

Router Stack does **not** itself own:

- route registration or route-state injection
- business workspace grouping
- two-level tab semantics
- tabs-style page-meta coordination
- Admin/Web tabs layout behavior

So when you read Router Stack, read it as a compact routed-host strategy after route resolution, not as the owner of the broader routing model and not as a smaller copy of Router Tabs.

## The core source-reading path

When reading Router Stack, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/component/routerViewStack/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/model/stack.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/types/stack.ts`

That order moves from the shared host contract, to the stack host adapter, to the real stack owner, and finally to the stack model shape.

## What each source file clarifies

### `a-router/src/lib/routerViewBase.tsx`

This is the shared routed-host contract.

Its main jobs are:

- register the host with `$router`
- receive routed output through `RouterView`
- wrap routed instances in `KeepAlive`
- assign vnode identity from host-prepared route meta
- inject the current page route into the hosted vnode

This file matters because Router Stack is not a standalone host system. It is a specialization built on this shared contract.

### `a-routerstack/src/component/routerViewStack/controller.tsx`

This is the Router Stack host controller.

Its main jobs are very small and explicit:

- inject `$$modelStack`
- forward `backRoute(...)`
- forward `forwardRoute(...)`
- delegate `prepareRouteMeta(...)`
- delegate `getKeepAliveInclude()`

That is the key source-confirmed boundary:

- the controller is a thin adapter
- the real stack semantics live in `ModelStack`

Unlike the tabs controller, the stack controller does **not** override `setPageMeta(...)`.

### `a-routerstack/src/model/stack.ts`

This is the real stack owner.

Its main jobs are:

- keep the linear stack in `tabs`
- track `keepAliveInclude`
- add or update routed stack items on forward navigation
- delete stack items on back navigation
- prune the stack by recency when `max` is bounded
- prepare routed identity from `route.fullPath`

This file is the source of truth for what “stack” really means in the framework.

### `a-routerstack/src/types/stack.ts`

This file defines the compact stack model shape.

It confirms that the stack branch is much smaller than the tabs branch:

- `ModelStackOptionsBase`
- `RouteTabTransient`
- `RouteTab`

There is no tabs-style `items` structure or richer tab info contract here.

## Stack identity model

The most important stack rule is in `ModelStack.prepareRouteMeta(...)`.

It returns:

- `tabKey = route.fullPath`
- `componentKey = route.fullPath`
- `fullPath = route.fullPath`

That means Router Stack collapses routed identity into one linear per-visit key.

This is very different from Router Tabs, where:

- `tabKey` is business/workspace grouping identity
- `componentKey` is page-instance identity inside that grouping

In Router Stack, one route visit is one stack identity.

## Keep-alive and pruning behavior

Router Stack still participates in keep-alive through the shared host layer, but its inclusion model is simple:

- `keepAliveInclude` is derived from the current stack contents
- each stack item contributes its own key
- pruning removes older entries when the configured max is exceeded

The pruning rule is recency-based, not workspace-based.

That means Router Stack behaves more like a bounded linear routed cache than like a persistent workbench model.

## Forward and back behavior

The stack host reacts to route flow in a compact way:

- `forwardRoute(route)` prepares the stack route meta and adds/updates the stack entry
- `backRoute(route)` removes the matching `fullPath` entry

This is another important semantic difference from tabs:

- tabs maintain grouped workspace state and page-meta-aware items
- stack mainly tracks linear routed presence

## Current Cabloy Basic boundary

In the current public Basic source:

- Router Stack exists as a real framework primitive
- the currently visible public Basic shell is centered on Router Tabs
- Router Stack should therefore be read as an available routed-host strategy, not as the main visible Basic shell pattern

This keeps the docs source-confirmed without overstating current public usage.

## Where Router Stack stops and other docs begin

A useful boundary rule is:

- [A-Router Guide](/frontend/a-router-guide) owns route registration and route-state injection before host ownership begins
- [Router View Hosts Guide](/frontend/router-view-hosts-guide) owns the shared host layer and the first tabs/stack distinction
- this page owns the Stack branch specifically
- the existing Router Tabs pages own the workbench-tabs branch

So if your next question is:

- “how do routes become operational?” go back to [A-Router Guide](/frontend/a-router-guide)
- “what is the shared host contract?” go to [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- “how does the workbench-tabs model work?” go to [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

## Read together with

Use this page together with:

- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)
- [A-Router Guide](/frontend/a-router-guide)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Final takeaway

The most accurate way to read Router Stack is not as “tabs, but simpler” and not as a replacement for the broader router runtime.

Read it as the stack-oriented routed-host primitive that:

- builds on the shared `BeanRouterViewBase` host contract
- delegates host behavior through `ControllerRouterViewStack`
- owns linear fullPath-keyed routed presence through `ModelStack`
- participates in keep-alive and recency pruning
- stays smaller than the Router Tabs workbench model

That is the source-confirmed role of Router Stack in the current Basic frontend architecture.
