# Zova Source Reading Map

This page is a practical map for contributors and AI workflows that need to read Zova source code efficiently.

It does not try to teach every subsystem from scratch. Instead, it answers a narrower question:

> when I need to understand one kind of Zova frontend behavior, which files should I read first, and in what order?

Use this page together with the architectural guides:

- [Foundation](/frontend/foundation)
- [Design Principles](/frontend/design-principles)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Frontend Source Reading Roadmap](/frontend/frontend-source-reading-roadmap)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)

## Why this page exists

In a framework-sized codebase, source reading usually becomes slow for one reason:

- you can already find _a_ relevant file
- but you do not yet know the shortest path to the _next_ file

Zova especially benefits from a reading map because several layers cooperate at once:

- public wrappers and generated surfaces
- controller or bean authoring surfaces
- container and lifecycle runtime
- route or SSR integration
- module and suite boundaries

This page gives a starting sequence for each major topic so readers can move from public surface to runtime layer without drifting.

## How to use this page

For each topic below:

1. start with the public guide to refresh the architectural intent
2. read the first source file to identify the public surface
3. continue into the next runtime file only if you still need the implementation detail
4. stop as soon as you have enough information for the task

The goal is not to read the entire framework every time. The goal is to choose the shortest accurate path.

## 1. Page controller and page reactivity

Use this path when you are asking questions like:

- why does a plain page-controller field update the UI?
- where do `$params` and `$query` come from?
- how does page render enter the runtime?

### Read the docs first

- [Page Guide](/frontend/page-guide)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)

### Then read source in this order

1. `zova/src/suite/a-demo/modules/demo-basic/src/page/state/controller.tsx`
2. `zova/packages-zova/zova-core/src/composables/useController.ts`
3. `zova/packages-zova/zova-core/src/bean/beanContainer.ts`
4. `zova/packages-zova/zova-core/src/bean/beanBase.ts`
5. `zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts`
6. `zova/packages-zova/zova-core/src/core/context/component.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`

### What each file clarifies

- `controller.tsx` shows the public authoring pattern
- `useController.ts` shows controller creation and load timing
- `beanContainer.ts` shows when beans become reactive and context-managed
- `beanBase.ts` shows helper wrappers such as `$computed` and `$watch`
- `beanControllerPageBase.ts` shows page-controller data-refresh hooks
- `component.ts` shows controller-oriented render redirection
- `a-router/src/monkey.ts` shows how route-aware state is pushed onto the controller

## 2. Component controller and component wrapper behavior

Use this path when you are asking questions like:

- how do Z-prefixed wrapper components fit into the runtime?
- how does `controllerRef` expose the controller instance?
- how do component controllers differ from page controllers?

### Read the docs first

- [Component Guide](/frontend/component-guide)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)

### Then read source in this order

1. a representative component metadata wrapper under `src/.metadata/component/*.ts`
2. `zova/packages-zova/zova-core/src/composables/useController.ts`
3. `zova/packages-zova/zova-core/src/bean/beanControllerBase.ts`
4. `zova/packages-zova/zova-core/src/core/context/component.ts`
5. the component controller source you are actually analyzing

### What each file clarifies

- metadata wrapper files show how the public component wrapper enters `useController(...)`
- `useController.ts` shows how component-local controller data is prepared
- `beanControllerBase.ts` shows component-controller data refresh rules such as props updates
- `component.ts` shows how render is patched toward controller/render beans
- the concrete component controller shows the public authoring pattern for the case you care about

## 3. Bean lifecycle, instance scope, and helper APIs

Use this path when you are asking questions like:

- where should reactive setup happen?
- what is the role of `__init__` and `__dispose__`?
- how are helpers such as `$watch`, `$toRef`, or `$customRef` exposed?

### Read the docs first

- [IoC and Beans](/frontend/ioc-and-beans)
- [Design Principles](/frontend/design-principles)

### Then read source in this order

1. `zova/packages-zova/zova-core/src/bean/beanBase.ts`
2. `zova/packages-zova/zova-core/src/bean/beanBaseSimple.ts`
3. `zova/packages-zova/zova-core/src/bean/beanContainer.ts`
4. `zova/packages-zova/zova-core/src/core/context/util.ts`

### What each file clarifies

- `beanBase.ts` shows the main helper surface available to beans
- `beanBaseSimple.ts` shows the lower-level bean identity/base surface
- `beanContainer.ts` shows init, inject, and dispose flow
- `context/util.ts` shows how instance scope is applied around framework operations

## 4. Page routing, params, query, and layout-oriented route behavior

Use this path when you are asking questions like:

- where are typed params/query resolved?
- how does a route record connect to a page wrapper?
- where should route-aware page changes be debugged?

### Read the docs first

- [Page Route Guide](/frontend/page-route-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Page Params Guide](/frontend/page-params-guide)
- [Page Query Guide](/frontend/page-query-guide)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)

### Then read source in this order

1. the page `routes.ts` file for the module you care about
2. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/utils.ts`
4. the relevant route schema metadata or module page schema source
5. `zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts`

### What each file clarifies

- route files show the public route declaration surface
- `monkey.ts` shows controller data prepare/init/update behavior
- route utils show how current/page route resolution is derived
- route schema sources show typed parsing behavior for params and query
- `beanControllerPageBase.ts` shows the page-controller refresh hook surface

### When to continue into routed hosts

If your next question becomes any of these:

- why this route lands in one shell host rather than another
- where keep-alive participation is decided after route resolution
- where `tabKey` / `componentKey` are derived for routed pages
- how the active layout consumes routed-host state

then continue immediately with:

- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- section 5 on this page for the compact source-reading path

## 5. Router-view hosts, routertabs, and routerstack

Use this path when you are asking questions like:

- why does one routed page use an empty host while another behaves like a tabbed workbench?
- where do `tabKey`, `componentKey`, and keep-alive inclusion actually come from?
- how do `routerViewTabs` and `routerViewStack` differ at runtime?
- which layout files are the real consumers of routed-host behavior?

### Read the docs first

- [Page Route Guide](/frontend/page-route-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)
- [Router Stack Guide](/frontend/router-stack-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-router/src/component/routerViewEmpty/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/component/routerViewStack/controller.tsx`
6. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/model/stack.ts`
7. the active layout controller/render pair that consumes the host you care about

### What each file clarifies

- `routerViewBase.tsx` shows the shared host contract for routed-page render, keep-alive, and host callbacks
- `routerViewEmpty/controller.tsx` shows the minimal routed host without the richer tabs/stack model
- `routerViewTabs/controller.tsx` shows the controller-facing tabs host entrypoint
- `model/tabs.ts` shows workspace grouping, tab-item state, page-meta updates, and keep-alive inclusion

If your next question becomes specifically about task-level title, dirty state, or form-scene presentation after the routed item is already open, continue with [Page Meta Guide](/frontend/page-meta-guide).

- `routerViewStack/controller.tsx` shows the stack-host entrypoint with a smaller contract than tabs
- `model/stack.ts` shows the fullPath-based stack identity model and recency-based pruning
- active layout consumers show how the current shell turns host state into visible Admin or Web behavior

## 6. Model state, cache-oriented state, and broader data ownership

Use this path when you are asking questions like:

- should this state live in a model bean?
- how does Zova unify async and sync state categories?
- where should I debug model-owned state instead of controller-owned state?

### Read the docs first

- [Model Architecture](/frontend/model-architecture)
- [Model State Guide](/frontend/model-state-guide)
- [Design Principles](/frontend/design-principles)

### Then read source in this order

1. the relevant model bean in the module you are studying
2. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
3. representative built-in model beans such as router tabs or resource models
4. nearby state-owner service/controller code that consumes the model

### What each file clarifies

- the local model bean shows the public business-facing ownership pattern
- `bean.model.useState.ts` shows framework-level state helper behavior
- built-in model beans show how the architecture is used in nontrivial cases
- consuming code shows whether the state really belongs in the model or only uses the model result

## 7. Command scene and command-bean invocation

Use this path when you are asking questions like:

- how does `$performCommand(...)` resolve a command bean?
- when should an action live in a command bean instead of a page/controller method?
- where do command names, helper bases, and generated command typing come from?

### Read the docs first

- [Command Scene Authoring](/frontend/command-scene-authoring)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Frontend CLI](/frontend/cli)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-command/src/lib/command.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-command/src/monkey.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-command/src/lib/performCommand.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-command/src/types/command.ts`
5. one generated downstream metadata file such as `zova/src/suite/cabloy-basic/modules/basic-commands/src/.metadata/index.ts`
6. representative command beans such as `command.create.tsx`, `command.delete.tsx`, `command.setValue.tsx`, or `command.log.tsx`

### What each file clarifies

- `command.ts` shows the public decorator surface and confirms the `sys` container scope
- `monkey.ts` shows how `$performCommand(...)` is injected onto bean instances and how default `renderContext` data is synthesized from the host bean
- `performCommand.ts` shows onion-name to bean resolution, sync-first then async bean loading, option merging, and command execution
- `types/command.ts` shows the command-scene type contract, including `ICommandRecord`, `IDecoratorCommandOptions`, and `SymbolCommandResult`
- generated downstream metadata shows the real command names and bean full names exposed by consuming modules
- representative command beans show when to use the plain, bulk, row, or scene-sensitive command shapes

## App-shell root host and `a-app`

Use this path when you are asking questions like:

- what is the root app host in Zova?
- where does the routed tree first enter the app controller path?
- where do app-wide behaviors wrap the routed content?
- how should I read `a-app` without confusing it with routes, layouts, or SSR orchestration?

### Read the docs first

- [Zova App Guide](/frontend/zova-app-guide)
- [Root Behaviors Guide](/frontend/root-behaviors-guide)
- [App Startup Guide](/frontend/app-startup-guide)
- [Page Route Guide](/frontend/page-route-guide)
- [Behavior Guide](/frontend/behavior-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-app/src/.metadata/this.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-app/src/.metadata/index.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-app/src/.metadata/component/app.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-app/src/component/app/controller.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-app/src/config/config.ts`

### What each file clarifies

- `this.ts` shows the module identity quickly
- `.metadata/index.ts` shows the generated integration surface for controller, component, config, and scope
- `.metadata/component/app.ts` shows the thin `ZApp` wrapper that mounts `ControllerApp` through `useController(...)`
- `controller.tsx` shows app-level meta setup, behavior-holder initialization, and behavior-wrapped `RouterView` render
- `config.ts` shows the root behavior injection point through `scope.config.behaviors`

## 8. Behavior scene and render-time interception

Use this path when you are asking questions like:

- should this concern be a Behavior, a Component, or a Helper?
- how do behaviors wrap render targets?
- where does the behavior pipeline actually compose?

### Read the docs first

- [Behavior Guide](/frontend/behavior-guide)
- [IoC and Beans](/frontend/ioc-and-beans)

### Then read source in this order

1. the public behavior wrapper and controller path referenced in the docs
2. the concrete behavior bean you are studying
3. the composer/service files used by the behavior scene
4. any host-injected controller or bean that the behavior depends on

### What each file clarifies

- wrapper/controller files show the public entry into the behavior system
- concrete behavior beans show authoring-time render interception
- composer/service files show how behavior chains are normalized and executed
- host dependencies show why host-scoped injection is part of the behavior design

## 9. SSR runtime and hydration handoff

Use this path when you are asking questions like:

- is this SSR issue owned by Vona or Zova?
- where does the frontend SSR runtime begin?
- where should hydration-sensitive debugging start?

### Read the docs first

- [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- [SSR Overview](/frontend/ssr-overview)
- [SSR Init Data](/frontend/ssr-init-data)
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)

### Then read source in this order

1. the frontend SSR site entry or generated SSR bundle entry for the affected app/site
2. the SSR-related context/runtime files in `zova-core`
3. the relevant page/controller/model code whose output differs between server and client
4. if needed, the Vona SSR integration layer for the site entry and request handoff

### What each file clarifies

- SSR entry files show where the frontend runtime starts during SSR
- SSR runtime/context files show how render context and state transfer are assembled
- page/controller/model files show whether the bug is actually page-level logic
- the Vona side shows whether the problem happens before the Zova runtime is even entered

## 10. Modules, suites, and architectural placement

Use this path when you are asking questions like:

- where should new frontend code live?
- does this belong in an existing module, a new module, or a different suite?
- which source-tree boundary expresses the intended business architecture?

### Read the docs first

- [Modules and Suites](/frontend/modules-and-suites)
- [Module Scope](/frontend/module-scope)
- [Frontend Directory Structure](/reference/frontend-directory-structure)

### Then read source in this order

1. the nearby suite/module layout under `zova/src/suite*`
2. the target module `package.json` and metadata if relevant
3. representative peer modules in the same suite
4. only then the exact controller/component/model/service file you intend to change

### What each file clarifies

- source-tree layout shows the real architectural neighborhood
- module metadata shows naming, dependencies, and bundle-related declarations
- peer modules show current placement conventions
- the final target file then makes sense inside the correct architectural boundary

## A compact reading strategy

When in doubt, use this sequence:

1. public guide
2. representative example in app/module code
3. public wrapper or controller entrypoint
4. bean/container/runtime source
5. integration layer such as router, behavior, model, or SSR

That order usually gets you to the answer faster than starting from deep runtime files first.

## Final takeaway

The fastest way to read Zova source accurately is not to memorize every core file.

It is to recognize which architectural topic you are in, then start from the smallest public surface that matches that topic and only descend into runtime files as needed.
