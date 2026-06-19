# Zova App Guide

This guide explains the root app-shell module in Zova through the current public Cabloy Basic source:

```text
zova/src/suite-vendor/a-zova/modules/a-app
```

Use this page when you want to understand:

- what `a-app` is responsible for
- what `a-app` is **not** responsible for
- how the root app wrapper reaches the routed tree
- where app-wide behavior wrapping enters the runtime
- which files to read first when tracing the source

## Why this page exists

Several other frontend guides already explain routing, startup, behavior, and SSR.

What they do not explain directly is the thin root module that connects those concerns at the app host level.

That root module is `a-app`.

In the current Basic source, `a-app` is not a feature module full of pages or business services. It is a small app-shell module whose main job is to host the root app controller, apply app-level metadata, initialize app-wide behaviors, and render the routed tree.

## The shortest accurate mental model

A practical mental model is:

1. `a-app` exposes the root app component surface
2. `ZApp` mounts the root controller
3. `ControllerApp` initializes app meta and root behaviors
4. `ControllerApp.render()` returns the routed tree through `RouterView`
5. that routed tree is wrapped by `BeanBehaviorsHolder` so app-wide behaviors can participate around it

That means `a-app` is the root app host, not the owner of every frontend concern.

## What `a-app` is

In the current Basic source, `a-app` is mainly these five things:

- a **module integration surface** through generated metadata
- a **root component wrapper** through `ZApp`
- an **app controller** through `ControllerApp`
- a **root behavior host** through `BeanBehaviorsHolder`
- a **routed-content host** through `RouterView`

Those roles are enough to make it a real architectural boundary even though the module is small.

## What `a-app` is not

It is equally important to avoid over-assigning responsibilities to `a-app`.

`a-app` does **not** itself define:

- page route records
- page controllers
- model beans
- standalone business services
- the actual layout implementations
- the full SSR orchestration flow

Those responsibilities belong to other routing, layout, model, service, and SSR layers.

So when you read `a-app`, read it as the root host that connects those systems, not as the place where all of them are authored.

## The core source-reading path

When reading `a-app`, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-app/src/.metadata/this.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-app/src/.metadata/index.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-app/src/.metadata/component/app.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-app/src/component/app/controller.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-app/src/config/config.ts`

That order moves from module identity, to generated integration surface, to component wrapper, to runtime controller logic, to configuration hook points.

## What each source file clarifies

### `src/.metadata/this.ts`

This file gives the module identity quickly:

- module name is `a-app`
- module scope is exported as `ScopeModule`

Read this file first when you want to anchor the rest of the source path.

### `src/.metadata/index.ts`

This is the generated integration map for the module.

It shows that `a-app` contributes:

- the app controller registration
- the `ZApp` component export
- the module config typing
- the module scope typing

This file is the best single map of how the module enters the larger Zova container and component records.

### `src/.metadata/component/app.ts`

This file shows the public wrapper component:

- `ZApp` is defined with `defineComponent(...)`
- it calls `useController(ControllerApp, ...)`
- it exposes `controllerRef` as a controller-facing hook

The important idea is that `ZApp` is a thin wrapper whose main job is to mount the controller-oriented runtime path.

## `src/component/app/controller.tsx`

This is the real runtime center of the module.

Its main jobs are:

- call `$useMeta(...)` to set app-level document metadata
- initialize `BeanBehaviorsHolder`
- read root behaviors from `scope.config.behaviors`
- render the routed tree through `RouterView`

This is the file that shows the actual app-host responsibilities most clearly.

## `src/config/config.ts`

This file is small but important.

It exposes the module config surface for:

- `behaviors`

That matters because it shows that `a-app` is intentionally designed to receive app-wide behavior configuration from outside the module instead of hard-coding every root behavior locally.

## Runtime flow from `ZApp` to routed content

The shortest practical runtime flow is:

1. `ZApp` calls `useController(ControllerApp, ...)`
2. the framework creates and loads `ControllerApp`
3. `ControllerApp.__init__()` sets app-level meta through `$useMeta(...)`
4. `ControllerApp.__init__()` initializes `BeanBehaviorsHolder`
5. the holder reads app-wide behavior declarations from `scope.config.behaviors`
6. `ControllerApp.render()` returns behavior-wrapped `<RouterView />`
7. the routed page tree continues from the router and layout layers

This page stops at the root app-host boundary. For the deeper behavior-composition path behind `BeanBehaviorsHolder`, continue with [Root Behaviors Guide](/frontend/root-behaviors-guide).

## Relationship to routing

`a-app` does not define the page route records themselves.

Instead, it hosts the routed tree by rendering `RouterView`.

That means routing questions usually split into two layers:

- `a-app` as the root host that renders the routed content entry
- router and layout layers as the owners of route records, layout choice, guards, and routed-host behavior

Read together with:

- [Page Route Guide](/frontend/page-route-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)

## Relationship to behaviors

`a-app` is also the root behavior host in the current Basic source.

Because `ControllerApp` initializes `BeanBehaviorsHolder` from `scope.config.behaviors`, project or module-level code can extend the root app host by contributing behavior configuration.

A practical way to think about this is:

- `a-app` owns the root behavior hosting point
- other modules can contribute app-wide behavior declarations to that hosting point

Read together with:

- [Behavior Guide](/frontend/behavior-guide)
- [Root Behaviors Guide](/frontend/root-behaviors-guide)

## Relationship to startup

App startup and `a-app` are related, but they are not the same concept.

- **app startup** decides when the application lifecycle becomes operational
- **`a-app`** is the root app host component/controller path inside that operational application

That distinction helps avoid placing startup logic into the root app controller just because it feels globally visible.

Read together with:

- [App Startup Guide](/frontend/app-startup-guide)
- [System Startup Guide](/frontend/system-startup-guide)

## Relationship to SSR

`a-app` participates in the frontend runtime side of SSR because it is part of the application render tree.

But it is not the complete SSR orchestration layer.

In the broader SSR model:

- Vona owns request-level SSR orchestration
- the built frontend bundle provides the SSR entry
- Zova SSR runtime resolves and renders the frontend route tree
- `a-app` participates as part of that root render tree

Read together with:

- [SSR Architecture Overview](/frontend/ssr-architecture-overview)

## A compact interpretation of app-wide extension

When you need app-wide overlays or wrappers, the root behavior host is often a better fit than forcing that concern into unrelated page code.

A practical extension model is:

- keep `a-app` as the thin root host
- let other modules contribute root behavior configuration
- let those behaviors wrap the routed tree in a reusable way

That keeps the root host small while still making it extensible.

## Where to read next

After this page, the most useful next paths are usually:

- [Root Behaviors Guide](/frontend/root-behaviors-guide)
- [App Startup Guide](/frontend/app-startup-guide)
- [Page Route Guide](/frontend/page-route-guide)
- [Behavior Guide](/frontend/behavior-guide)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)
- [SSR Architecture Overview](/frontend/ssr-architecture-overview)

## Final takeaway

The most accurate way to read `a-app` is not as a generic Vue root component and not as the owner of the whole frontend system.

Read it as the thin Zova app-shell host that:

- mounts the root app controller
- applies app-level meta
- hosts root behaviors
- renders the routed tree

That is the source-confirmed role of `a-app` in the current Basic frontend architecture.
