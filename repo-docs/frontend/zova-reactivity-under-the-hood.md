# Zova Reactivity Under the Hood

This guide explains the source-level runtime path behind Zova’s reactive page and component authoring model.

Use this page after [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers) when you want to move from the public mental model to the core source path that makes plain controller fields behave reactively.

## Why this page exists

The public frontend docs already explain the architectural intent:

- Zova keeps Vue 3 reactive strengths
- Zova prefers controller-oriented and bean-oriented authoring
- IoC and bean scopes organize state and behavior sharing

What many source readers still want next is the implementation bridge:

- where the controller instance is created
- where it becomes reactive
- where `$computed` connects back to Vue `computed`
- where page route state is pushed onto the controller
- where controller-driven render logic joins the normal update flow

This page is that bridge.

## The shortest accurate runtime model

For a page controller, the shortest accurate model is:

1. `useControllerPage(...)` creates the Zova context and controller load path
2. the bean container creates the controller bean with `markReactive = true`
3. the bean container wraps the controller instance with Vue `reactive(...)`
4. bean helpers such as `$computed()` and `$watch()` wrap Vue reactive APIs inside the controller instance scope
5. the component runtime patches render so the controller or render bean becomes the effective render entry
6. before each render, page-controller route data can be refreshed onto the controller surface
7. when a controller field changes, Vue dependency tracking drives recomputation and rerender

That is why Zova can offer direct-looking class-field authoring while still using Vue runtime behavior underneath.

## A concrete source specimen

A small public example that shows the pattern clearly is:

```text
zova/src/suite/a-demo/modules/demo-basic/src/page/state/controller.tsx
```

Representative shape:

```typescript
@Controller()
export class ControllerPageState extends BeanControllerPageBase {
  count: number = 0;
  count2: string;

  protected async __init__() {
    this.count2 = this.$computed(() => {
      return `=== ${this.count} ===`;
    });
  }

  increment() {
    this.count++;
  }

  protected render() {
    return <div>{this.count2}</div>;
  }
}
```

What matters here is not only the syntax.

What matters is that:

- `count` is a plain class field
- `count2` is instance-level derived state
- `increment()` mutates the controller instance directly
- `render()` reads controller fields directly

The rest of this page explains how that becomes real runtime reactivity.

## The core source-reading path

When you want to trace the implementation, read these files in order:

1. `zova/packages-zova/zova-core/src/composables/useController.ts`
2. `zova/packages-zova/zova-core/src/bean/beanContainer.ts`
3. `zova/packages-zova/zova-core/src/bean/beanBase.ts`
4. `zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts`
5. `zova/packages-zova/zova-core/src/core/context/component.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`

A compact role map is:

- `useController.ts` creates and loads controller, style, and render beans
- `beanContainer.ts` instantiates beans, injects context, and applies `reactive(...)`
- `beanBase.ts` exposes instance-scoped wrappers around Vue helpers such as `computed` and `watch`
- `beanControllerPageBase.ts` provides the page-controller hook points for route-aware controller data updates
- `component.ts` redirects component render toward controller-oriented render flow
- `a-router/src/monkey.ts` pushes page route state onto page controllers

## Step-by-step runtime path

### 1. `useControllerPage(...)` starts the controller load path

The public entrypoint for a page is `useControllerPage(...)` in:

```text
zova/packages-zova/zova-core/src/composables/useController.ts
```

The important job here is not only creating a helper.

It creates the Zova context, prepares controller data, and registers the async load path that will create the controller bean and related beans.

A practical reading takeaway is:

- **the page controller is not an ad hoc class instance created by page code**
- **it is created by the framework runtime inside the bean/container model**

### 2. The controller bean is created with `markReactive = true`

Inside the controller load path, the framework calls the bean container to create the controller bean with reactive wrapping enabled.

That is the key bridge between:

- plain class authoring in user code
- real Vue reactive behavior at runtime

A practical reading takeaway is:

- **the framework decides that the controller instance itself is a reactive host**

### 3. The bean container wraps the instance with Vue `reactive(...)`

In:

```text
zova/packages-zova/zova-core/src/bean/beanContainer.ts
```

The bean container:

- creates the class instance
- attaches framework context such as `sys`, `app`, and `ctx`
- records bean identity metadata
- applies Vue `reactive(...)` when the bean should be reactive
- may also patch the bean with AOP-oriented proxy behavior before the final reactive wrapper is exposed

This is one of the most important source-level facts for understanding Zova.

Zova does not require the business author to write `reactive({ ... })` around controller state, because the framework already treats the controller bean as the reactive object.

### 4. `$computed()` is an instance-scoped wrapper around Vue `computed(...)`

In:

```text
zova/packages-zova/zova-core/src/bean/beanBase.ts
```

Helpers such as these are exposed from the bean surface:

- `$computed()`
- `$watch()`
- `$watchEffect()`
- `$watchPostEffect()`
- `$watchSyncEffect()`
- `$toRef()`
- `$customRef()`

The important reading point is:

- **Zova is not replacing Vue `computed` with a different reactive theory**
- **Zova is exposing Vue’s reactive capabilities through a bean-oriented, instance-scoped API surface**

So when a controller writes:

```typescript
this.count2 = this.$computed(() => {
  return `=== ${this.count} ===`;
});
```

what really happens is still dependency tracking through Vue’s computed system.

### 5. Page-controller route data uses a controller-data update path

In:

```text
zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts
```

page controllers expose page-oriented controller data refresh hooks.

Then in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts
```

route-aware controller data is prepared, initialized, and updated.

That is where page-controller members such as these are maintained:

- `$route`
- `$params`
- `$query`

A practical reading takeaway is:

- **page route state is not only pulled ad hoc by the page**
- **the framework pushes and refreshes route-aware controller data as part of the page-controller runtime path**

This is one of the biggest differences a Vue-first reader usually notices.

### 6. The component runtime patches render toward the controller/render bean path

In:

```text
zova/packages-zova/zova-core/src/core/context/component.ts
```

Zova patches the component instance render method so the effective render flow becomes controller-oriented.

That is why the framework can support these patterns consistently:

- render directly inside the controller
- split render into a dedicated render bean later
- keep the higher-level page/component authoring model stable while the implementation grows

A practical reading takeaway is:

- **render is not treated as only a local component-file concern**
- **render is part of the controller/bean architecture**

### 7. Field mutation becomes normal reactive invalidation and rerender

Once the controller bean is reactive and render has read its fields, changes such as:

```typescript
this.count++;
```

behave the way a Vue reader would expect at the reactive-engine level:

- the field change invalidates dependencies
- computed values depending on that field are recomputed
- the next render sees the updated values

So the runtime behavior is still recognizably Vue-like.

The architectural surface is what changed.

## A compact call-flow sketch

```text
useControllerPage(...)
  -> _useController(...)
  -> ctx.bean._newBeanInner(..., markReactive = true)
  -> BeanContainer creates controller bean
  -> BeanContainer applies reactive(...)
  -> controller __init__ wires $computed / $watch helpers
  -> component render is patched toward controller/render bean
  -> render-time controller data update refreshes page route data
  -> render reads controller fields
  -> field mutation invalidates dependencies
  -> rerender produces updated UI
```

Use this sketch as the durable mental model even if lower-level implementation details evolve over time.

## What is stable vs what is implementation detail

### Stable public architectural idea

The following ideas are durable and should guide how you read and extend Zova code:

- controller and bean instances are first-class authoring surfaces
- Vue reactivity is still the foundation underneath
- bean lifecycle and IoC scope are central to the architecture
- render flow is controller-oriented
- route-aware page state is part of the page-controller surface

### More implementation-shaped detail

The following details are helpful for source reading, but are not the main public design lesson:

- the exact internal helper names
- the exact order of intermediate load helpers
- the exact proxy or monkey hook boundaries used by the runtime
- the exact render patch mechanics inside the component context implementation

This distinction matters because public docs should teach the durable model first, then use source details only to clarify that model.

## When to use this page

Use this page when:

- you already understand the public Zova architecture but want to trace the runtime source path
- you need to debug why a page controller field updates the UI
- you need to understand where route state is refreshed before render
- you are deciding whether a change belongs in controller authoring, bean lifecycle, route synchronization, or render-flow plumbing

If you are still learning the public mental model first, start with:

- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Design Principles](/frontend/design-principles)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Page Guide](/frontend/page-guide)

## Final takeaway

The most important source-reading insight is simple:

> Zova does not remove Vue reactivity. It relocates the business-facing reactive surface from local reactive primitives toward framework-managed reactive bean instances.

Once that clicks, the rest of the controller, render-bean, route, and lifecycle design becomes much easier to follow.
