# IoC and Beans

## Why IoC matters in Zova

Zova uses IoC as a unifying frontend architecture rather than treating it as a small dependency-injection helper.

That matters because state sharing, resource access, lifecycle behavior, and cross-module composition all need to stay structured as the system grows.

## The four state-sharing scopes

A key Zova idea is that several common sharing scopes can be handled through one IoC-centered model:

- component-internal
- between-components
- app-global
- system-level

This replaces the need to switch constantly between unrelated mechanisms for each sharing scope.

## The three container types

Zova uses three main IoC containers:

- **sys container** for system-wide singleton-style beans
- **app container** for request-scoped or app-scoped beans
- **ctx container** for component-instance-local beans

This is one of the main reasons Zova can support both SSR-aware behavior and strongly structured frontend logic.

## Bean classes

Zova’s IoC model is built around bean classes provided by modules.

All beans inherit from `BeanBase`, which exposes common framework capabilities and gives each bean a structured place inside the broader frontend architecture.

## `BeanBase`

`BeanBase` sits on top of the simpler core bean surface and is also a host for members extended by modules and adapters.

Core inherited members include:

- `sys`
- `app`
- `ctx`
- `bean`
- `scope`
- `$el`
- `$event`

Module and adapter layers can extend that surface further. For example, SSR-related modules can add members such as `$ssr` and `$useMeta`.

More specialized controller bases can also add frontend-specific members:

- component-style controller bases expose `$props`
- page-controller bases expose `$params` and `$query`

Module and UI adapters can further extend the base surface.

## Injection methods

Zova supports two main styles:

- **dependency injection** through `@Use`
- **dependency lookup** through the container and scope model

A key Zova preference is to keep the code concise by favoring dependency lookup where it leads to clearer business code.

## Resolution rules

A bean can be resolved by:

- bean class
- bean identifier
- registration name
- variable name

The most important design point is that cross-module access should prefer bean identifiers over hardwired file-path coupling.

### Representative `@Use` patterns

Same-module injection can stay class-oriented and concise:

```typescript
import { ModelTodo } from '../../bean/model.todo.js';

class ControllerTodo {
  @Use()
  $$modelTodo: ModelTodo;
}
```

Cross-module injection should usually prefer a bean identifier so the consuming module does not depend on the provider’s internal file path layout:

```typescript
import type { ModelTabs } from 'zova-module-a-routertabs';

class ControllerLayout {
  @Use('a-routertabs.model.tabs')
  $$modelTabs: ModelTabs;
}
```

In practice, Zova can still preserve the ergonomic class-based development experience while compiling cross-module usage back toward bean-identifier-based resolution.

### Hierarchical injection patterns

Hierarchical injection replaces many cases where a generic Vue app would fall back to `provide/inject`.

Representative child lookup pattern:

```typescript
import type { ModelTabs } from 'zova-module-a-routertabs';

class Child {
  @Use({ injectionScope: 'host' })
  $$modelTabs: ModelTabs;
}
```

That keeps parent/child sharing aligned with the same IoC model instead of introducing a separate state-sharing mechanism.

## Injection scopes

Zova supports several injection scopes:

- `sys`
- `app`
- `ctx`
- `new`
- `host`
- `skipSelf`

This allows code to be explicit about whether a bean should be shared globally, per request, per component instance, or created fresh.

## Hierarchical injection

The `host` and `skipSelf` scopes provide hierarchical lookup behavior.

This replaces much of the conventional Vue `provide/inject` style with an IoC-native rule set.

That means parent/child sharing can stay aligned with the same overall bean model instead of becoming a separate architectural subsystem.

## Lifecycle

All beans can define two lifecycle methods:

- `__init__`
- `__dispose__`

These lifecycle hooks are important because they give beans a structured place for initialization and cleanup logic.

Representative uses include:

- computed setup
- watchers
- derived state wiring
- resource cleanup

Representative initialization pattern:

```typescript
export class Counter {
  count: number = 0;
  count2: string;

  protected async __init__() {
    this.count2 = this.$computed(() => {
      return `=== ${this.count} ===`;
    });

    this.$watch(
      () => this.count,
      () => {
        console.log('changed: ', this.count);
      },
    );
  }
}
```

That gives a bean one consistent place to wire reactive behavior instead of scattering setup logic through unrelated hooks.

## Bean identifiers and loose coupling

Bean identifiers are a key part of Zova’s modular architecture.

They make cross-module access more stable and decoupled than always relying on direct file-path imports.

This matters especially in large systems, where business modules should remain reusable and composable.

## Relationship to other frontend guides

Read this together with:

- [Frontend Bean Scene Authoring](/frontend/bean-scene-authoring) when you need to create a **new bean scene** rather than only adding a bean inside an existing scene
- [Modules and Suites](/frontend/modules-and-suites)
- [Module Scope](/frontend/module-scope)
- [Frontend Design Principles](/frontend/design-principles)

Those pages explain how beans fit into module boundaries, scope-based resources, and the broader Zova architectural model.

## Implementation checks for frontend bean-architecture changes

When editing Zova frontend code, ask:

1. should this behavior live in a bean instead of a framework-neutral helper?
2. is the right sharing scope `ctx`, `app`, or `sys`?
3. should dependency injection or dependency lookup be preferred here?
4. does this component or page already rely on lifecycle hooks, hierarchical injection, or bean identifiers that should be preserved?

That helps AI keep frontend changes aligned with Zova’s real architectural model instead of drifting toward generic Vue patterns.
