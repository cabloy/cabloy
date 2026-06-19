# Root Behaviors Guide

This guide explains app-wide root behaviors in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- what root behaviors are responsible for
- where root behavior configuration is injected
- how the routed tree is wrapped from the app host
- how `BeanBehaviorsHolder`, `BehaviorRoot`, and `ServiceComposer` cooperate
- what kinds of concerns belong at root behavior scope
- where root behaviors stop and routing or routed-host behavior begins

## Why this page exists

Several existing docs already explain important parts of the story:

- [Behavior Guide](/frontend/behavior-guide) explains generic Behavior concepts and authoring
- [Zova App Guide](/frontend/zova-app-guide) explains `a-app` as the root app host
- [A-Router Guide](/frontend/a-router-guide) explains the router runtime boundary
- [Router View Hosts Guide](/frontend/router-view-hosts-guide) explains routed-page host ownership
- [Zova Source Reading Map](/frontend/zova-source-reading-map) explains compact reading paths

What those pages do not isolate directly is the end-to-end app-wide behavior flow.

That is the gap this page fills.

In the current Basic source, root behaviors are not just “some behaviors used near the app.” They are the app-scope composition layer that wraps the routed tree from the root host, using behavior declarations from `scope.config.behaviors` and routing them through the behavior composition engine.

## The shortest accurate mental model

A practical mental model is:

1. `a-app` exposes the root behavior injection point through `scope.config.behaviors`
2. `ControllerApp.__init__()` initializes `BeanBehaviorsHolder`
3. the holder builds a synthetic root behavior declaration for `a-behavior:root`
4. `BehaviorRoot` creates an inner composer for the declared app-wide behaviors
5. `ServiceComposer` normalizes and loads the behavior stack
6. `ControllerApp.render()` renders the routed tree through that composed root wrapper
7. the routed content continues into router and host layers only after the root behavior chain has already wrapped it

That means root behaviors are the app-wide render-time composition layer around the routed tree.

This page starts where [Zova App Guide](/frontend/zova-app-guide) stops: the app host is already established, and the remaining question is how app-wide behavior composition works behind that host boundary.

## What root behaviors are

In the current Basic source, root behaviors are mainly these five things:

- an **app-scope behavior declaration surface** through `scope.config.behaviors`
- a **root behavior holder** through `BeanBehaviorsHolder`
- a **synthetic root wrapper** through `a-behavior:root` / `BehaviorRoot`
- a **behavior composition pipeline** through `ServiceComposer`
- a **render-time wrapper around the routed tree** rather than around one page or one component only

This is why root behaviors are best understood as part of the app host layer, not only as a generic behavior-scene feature.

## What root behaviors are not

It is equally important to avoid over-assigning responsibilities to root behaviors.

Root behaviors do **not** themselves own:

- the generic explanation of `@Behavior()` authoring
- route registration or route-state injection
- routed-host ownership such as tabs, stack, or keep-alive semantics
- page-local render concerns that do not need app scope
- standalone business state ownership that should live in a service or model bean

So when you read this topic, read it as **app-wide render-time composition around routed content**, not as a replacement for routing, hosts, or generic behavior authoring.

## The core source-reading path

When reading root behaviors, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-app/src/component/app/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-app/src/config/config.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/types/behavior.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/lib/useBehavior.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/lib/behavior.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/bean/bean.behaviorBase.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/bean/bean.behaviorsHolder.ts`
8. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/bean/behavior.root_.ts`
9. `zova/src/suite-vendor/a-zova/modules/a-behavior/src/service/composer.ts`

That order moves from root app host, to injection point, to declaration surface, to authoring helpers, to base contract, to root bridge, to synthetic root wrapper, and finally to the composition engine.

## What each source file clarifies

### `a-app/src/component/app/controller.tsx`

This is the root app controller.

Its root-behavior jobs are:

- initialize `BeanBehaviorsHolder`
- read app-wide behavior declarations from `scope.config.behaviors`
- render `<RouterView />` through the behavior holder

This file is the clearest proof that root behaviors wrap the routed tree from the app host.

### `a-app/src/config/config.ts`

This file is the root behavior injection point.

It exposes:

- `behaviors`

That matters because it shows root behaviors are configured through the app module config surface instead of being hard-coded directly into the root controller.

### `a-behavior/src/types/behavior.ts`

This file is the behavior declaration and type contract.

It defines:

- `IBehaviorTag`
- `IBehaviorItem`
- `IBehaviors`
- behavior-scene type registration
- behavior-related JSX / HTML attribute surfaces

This is the file to read when you want to understand what a behavior declaration looks like before runtime composition begins.

### `a-behavior/src/lib/useBehavior.ts`

This file exposes the public declaration helpers:

- `$UseBehavior(...)`
- `$UseBehaviorTag(...)`

These helpers matter because root behavior composition starts from behavior declarations, not from manual wiring of raw behavior instances.

### `a-behavior/src/lib/behavior.ts`

This file defines the public `@Behavior()` decorator.

That matters because root behaviors still use the same behavior scene as other behavior beans. They are not a separate special-purpose scene. What makes them special is their app-scope host position.

### `a-behavior/src/bean/bean.behaviorBase.ts`

This is the base behavior contract.

It shows that a behavior bean can:

- keep behavior options as `$options`
- use host-scoped injections such as `$$beanBehavior` and `$$behaviorTag`
- create a nested composer
- default to `next()` pass-through when it does not need extra wrapping

This file is the best place to confirm that a behavior is a bean-scene render interceptor, not just a free helper.

### `a-behavior/src/bean/bean.behaviorsHolder.ts`

This file is the bridge from app-level config to the actual behavior composition pipeline.

Its main jobs are:

- accept root holder options
- store the host behavior tag
- create a composer from a synthetic `a-behavior:root` declaration
- watch reactive behavior sources and reload the composer when declarations change
- remove behavior-only props before rendering
- render the final chain around the default vnode, which in the app root is the routed tree

This is the most important implementation file for understanding root behaviors end to end.

### `a-behavior/src/bean/behavior.root_.ts`

This file defines the synthetic root behavior.

Its main jobs are:

- create an inner composer from the declared root behaviors
- reload that inner composer when root behavior options change
- delegate render to the inner composer

This matters because the root behavior chain is not composed directly on the app controller. It is composed through a stable synthetic root layer.

### `a-behavior/src/service/composer.ts`

This file is the behavior composition engine.

Its main jobs are:

- normalize behavior declarations into onion items
- load onion slices from the behavior scene
- reuse existing behavior instances when possible
- update options when reused instances change
- dispose removed behavior instances
- build the final composed render chain

This is the file to read when your next question is not only “where are root behaviors declared?” but “how does the app-wide behavior stack actually become a render pipeline?”.

## Runtime flow from root config to wrapped routed tree

The shortest practical runtime flow is:

1. `a-app` exposes `scope.config.behaviors`
2. `ControllerApp.__init__()` calls `BeanBehaviorsHolder.initialize(...)`
3. the holder stores the behavior tag for the current host
4. the holder creates a synthetic root declaration for `a-behavior:root`
5. `BehaviorRoot` creates an inner composer from the declared behaviors
6. `ServiceComposer` normalizes, loads, reuses, and composes behavior slices
7. `ControllerApp.render()` returns the routed tree through the composed root wrapper
8. individual root behaviors may call `next()` and then append app-wide UI around that routed output

This explains why root behaviors are best described as app-scope wrapping around routed content rather than as page-local behavior selection.

## What belongs in a root behavior

Root behavior is a good fit when the concern should surround the routed tree as a whole.

Typical fits include:

- app-wide overlays or modal layers
- app-shell wrappers that should apply around all routed content
- global render-time concerns that depend on app-level service state
- app-wide UI composition that should remain configurable instead of being copied into page code

A practical rule is:

- if the concern belongs around the routed tree, consider a root behavior
- if the concern belongs only around one component or one page, keep it at component/page scope instead

## Service-owned state and root behavior rendering

A common root-behavior pattern is:

- a service owns mutable UI state
- the root behavior reads that state
- the root behavior calls `next()` and then renders extra app-wide UI around the routed output

This keeps state ownership and render wrapping separate:

- services own state and actions
- root behaviors own render-time composition around the app tree

That separation usually produces cleaner app-shell code than forcing global overlay logic directly into unrelated pages.

## Where root behaviors stop and other docs begin

A useful boundary rule is:

- **Behavior Guide** owns generic Behavior concepts and authoring
- **Zova App Guide** owns the root app host boundary
- **Root Behaviors Guide** owns app-wide behavior composition around the routed tree
- **A-Router Guide** owns route registration and route-state injection
- **Router View Hosts Guide** owns page-instance hosting, keep-alive, and empty/tabs/stack behavior

So if your next question is:

- “how do I author a behavior bean?” continue with [Behavior Guide](/frontend/behavior-guide)
- “how does the app host mount the routed tree?” continue with [Zova App Guide](/frontend/zova-app-guide)
- “how do routes become operational?” continue with [A-Router Guide](/frontend/a-router-guide)
- “which host owns the routed page instance now?” continue with [Router View Hosts Guide](/frontend/router-view-hosts-guide)

## Read together with

Use this page together with:

- [Behavior Guide](/frontend/behavior-guide)
- [Zova App Guide](/frontend/zova-app-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Final takeaway

The most accurate way to read root behaviors in Zova is not as a generic “global wrapper” shortcut and not as a routing feature.

Read them as the app-scope behavior composition layer that:

- starts from `scope.config.behaviors`
- is initialized by the root app controller
- is bridged by `BeanBehaviorsHolder`
- is stabilized through `BehaviorRoot`
- is executed through `ServiceComposer`
- wraps the routed tree before control continues into routing and host layers

That is the source-confirmed role of root behaviors in the current Basic frontend architecture.
