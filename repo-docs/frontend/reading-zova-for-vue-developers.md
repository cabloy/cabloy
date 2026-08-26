# Reading Zova for Vue Developers

This guide is for readers who already know Vue 3 and want the shortest accurate path to reading Zova source code without forcing generic Vue assumptions onto it.

## Why this page exists

When Vue developers first open Zova code, several things can feel unfamiliar at the same time:

- page and component logic lives in controller classes
- plain class fields behave reactively
- derived state is often wired in `__init__`
- render logic is written in TSX and can live in a controller or a dedicated render bean
- state sharing is organized through IoC containers and bean scopes rather than a pile of unrelated patterns

If you read Zova as "Vue with unusual syntax," you will miss the architectural point.

A better starting point is:

- **Vue still provides the reactive foundation**
- **Zova changes the preferred programming model built on top of that foundation**

## The shortest accurate mental model

If you only remember one paragraph, remember this one:

> Zova keeps Vue 3 reactivity underneath, but moves the main authoring surface from `setup()` locals and explicit `ref/reactive` values toward IoC-managed reactive bean instances such as page controllers, component controllers, service beans, and model beans.

That is why Zova code often reads more like controller-oriented application code than like a typical Vue single-file-component or composable-first codebase.

## Quick translation table

| If you usually think in Vue terms                                           | Read Zova like this instead                                                                                 |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `setup()` is the main wiring point                                          | `__init__` and bean lifecycle are major wiring points                                                       |
| `ref` / `reactive` are the visible state hosts                              | controller and bean instances are the visible state hosts                                                   |
| `computed()` creates local derived refs                                     | `$computed()` usually creates instance-level derived state                                                  |
| `useRoute()` pulls route state into the component                           | page controllers expose `$route`, `$params`, and `$query` as part of the controller surface                 |
| `provide/inject`, composables, props, and stores are separate sharing tools | bean scopes and IoC are used to unify more sharing patterns under one model                                 |
| template or component render is the obvious center                          | controller-oriented architecture is the center; render can stay in the controller or move into render beans |

## Start from the right assumptions

### 1. Do not assume Zova wants to end at `ref.value`

Zova intentionally aims for code that feels closer to direct variable usage than `ref/reactive`-heavy business code.

That does **not** mean Zova rejects Vue reactivity. It means Zova tries to hide more of the reactive primitive management behind a different framework surface.

Read together with:

- [Design Principles](/frontend/design-principles)
- [Foundation](/frontend/foundation)

### 2. Do not treat IoC as a small convenience layer

In Zova, IoC is not only about injecting a helper or two.

It is part of the larger architectural answer for:

- state ownership
- state sharing
- cross-module composition
- lifecycle structure
- extensibility

Read together with:

- [IoC and Beans](/frontend/ioc-and-beans)
- [Module Scope](/frontend/module-scope)
- [Modules and Suites](/frontend/modules-and-suites)

### 3. Do not collapse page, component, service, and model code into one generic Vue component mental model

Zova gives different bean types different architectural jobs.

For example:

- page controllers organize page-local state and route-aware behavior
- component controllers organize reusable UI units
- service beans can own extracted business state or behavior
- model beans organize broader state categories such as async, local-storage, cookie, or in-memory data

Read together with:

- [Page Guide](/frontend/page-guide)
- [Component Guide](/frontend/component-guide)
- [Model Architecture](/frontend/model-architecture)
- [Model State Guide](/frontend/model-state-guide)

## A concrete specimen to read first

If you want one small example that shows the Zova coding style clearly, start with the demo page controller in the public source tree:

```text
zova/src/suite/a-demo/modules/demo-basic/src/page/state/controller.tsx
```

The important things to notice in that file are:

- `count` is a plain class field
- `count2` is wired in `__init__` through `$computed`
- actions are plain class methods such as `increment()` and `decrement()`
- `render()` reads the instance fields directly

A Vue-first reader often expects this kind of code to be rewritten into `setup()` plus `ref` plus `computed`. That is exactly the instinct you should suspend while reading Zova.

## How to read the reactive path under the surface

For the example above, a practical source-reading path is:

1. the example controller in `zova/src/suite/a-demo/modules/demo-basic/src/page/state/controller.tsx`
2. `zova/packages-zova/zova-core/src/composables/useController.ts`
3. `zova/packages-zova/zova-core/src/bean/beanContainer.ts`
4. `zova/packages-zova/zova-core/src/bean/beanBase.ts`
5. `zova/packages-zova/zova-core/src/core/context/component.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`

A compact interpretation of those files is:

- `useController.ts` creates and loads the controller bean
- `beanContainer.ts` is where bean instances become reactive and container-managed
- `beanBase.ts` exposes helpers such as `$computed`, `$watch`, and `$toRef`
- `component.ts` patches the component render flow so controller-driven render logic participates in normal frontend updates
- `a-router/src/monkey.ts` pushes page route state onto page controllers

This is the main reason Zova can feel so different while still standing on top of Vue runtime behavior.

If you want the next layer down, continue with [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood).

## Six practical differences Vue developers usually feel first

### 1. The visible state host is the controller instance

A Vue developer often expects to see:

```typescript
const count = ref(0);
```

A Zova reader will more often see:

```typescript
count: number = 0;
```

The important idea is not only less syntax. The important idea is that the framework is making the bean instance itself the main business-facing state surface.

### 2. Derived state is written as instance wiring

Instead of thinking:

```typescript
const count2 = computed(() => `=== ${count.value} ===`);
```

Zova often reads more like:

```typescript
protected async __init__() {
  this.count2 = this.$computed(() => {
    return `=== ${this.count} ===`;
  });
}
```

That makes derived state feel like part of object initialization rather than only part of a local `setup()` assembly.

### 3. Actions are ordinary methods

Instead of scattering behavior through closures returned from `setup()`, Zova often keeps page or component actions as plain methods on the controller instance.

That is one reason Zova business code can read more like application controller code.

### 4. Route state is part of the page-controller surface

A Vue reader often looks for `useRoute()` first.

In Zova, a page controller often expects route-aware behavior through members such as:

- `$route`
- `$params`
- `$query`

For the route-oriented mental model, also see [Page Route Guide](/frontend/page-route-guide).

### 5. State sharing is more architecture-driven

Vue projects often combine several independent techniques:

- props and emits
- composables
- `provide/inject`
- store layers

Zova tries to keep more of that within the bean and scope architecture, so the first question becomes less "which unrelated mechanism should I use?" and more "which bean owns this state and which scope should that bean live in?"

### 6. Render is controller-oriented, not only component-file-oriented

A Vue reader might assume that moving code out of a large page means immediately creating more composables or child components.

In Zova, a common growth path is:

- start with a single page controller
- split render into a render bean when the page grows
- split style into a style bean when needed
- extract business state or logic into service beans when that becomes clearer

That growth path is one of the main reasons you should read Zova pages through the page/controller architecture instead of through a generic component-file lens.

## A practical reading order for Vue developers

If you want the shortest path from Vue familiarity to Zova fluency, use this order:

1. [Foundation](/frontend/foundation)
2. [Design Principles](/frontend/design-principles)
3. [IoC and Beans](/frontend/ioc-and-beans)
4. [Page Guide](/frontend/page-guide)
5. [Component Guide](/frontend/component-guide)
6. [Model Architecture](/frontend/model-architecture)
7. [Page Route Guide](/frontend/page-route-guide)
8. [Behavior Guide](/frontend/behavior-guide)

Use this order when:

- you already know Vue
- you want to read Zova source code accurately
- you want to avoid rewriting framework-specific code back toward generic Vue habits

If your main question is specifically about large-project state organization rather than source-reading posture first, continue next with [State Architecture for Vue Developers](/frontend/state-architecture-for-vue-developers).

## Common mistakes to avoid

### Mistake 1: "This should become a normal Vue SFC"

Usually the better question is whether the existing controller, render bean, style bean, or service/model bean boundaries are already the intended Zova architecture.

### Mistake 2: "If I do not see `ref`, there is no real reactivity"

The reactive foundation is still there. The framework is simply exposing a different authoring surface.

### Mistake 3: "IoC only matters for dependency injection"

In Zova, IoC is tied to structure, sharing scope, extensibility, and long-term maintainability.

### Mistake 4: "Route state should always be pulled locally by composables"

For page controllers, route-aware behavior is deliberately pushed into the controller surface so the page model stays cohesive.

### Mistake 5: "Model state is just another local store choice"

The model layer is one of Zova’s larger architectural answers for unified state categories, SSR-aware state handling, caching, and persistence-oriented behavior.

## Edition note

This reading guide is about the shared Zova frontend architecture, not about one UI library.

That means the architectural reading model applies across Cabloy Basic and Cabloy Start. However, UI-sensitive examples can still diverge:

- Cabloy Basic public examples currently align with DaisyUI + Tailwind CSS
- Cabloy Start aligns with Vuetify-oriented UI workflows and may differ in modules, SSR site baselines, and project assets

So when your task becomes UI-specific rather than architecture-specific, detect the active edition before assuming a component or theme workflow.

## Final takeaway

If Vue teaches you to think in terms of reactive primitives and local composition, Zova asks you to think in terms of reactive framework-managed objects with explicit architectural roles.

That is the mental shift that makes the rest of the source tree much easier to read.
