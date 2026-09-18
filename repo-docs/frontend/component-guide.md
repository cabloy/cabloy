# Component Guide

This guide explains how components work in Zova within the Cabloy monorepo.

## What a component means in Zova

A Zova component is not only a reusable render unit. It is also part of the controller-oriented architecture that gives Zova its specific coding style.

That means component design is closely tied to:

- controller-based logic organization
- TSX rendering
- IOC-friendly instance access
- async-friendly module loading
- CSS-in-JS styling through the same controller-oriented architecture

For the practical styling decision map around local `$style`, dedicated style beans, shared/global styles, and token/theme surfaces, also see [CSS-in-JS Guide](/frontend/css-in-js-guide).

## Create a component

Example: create a component named `card` in module `training-student`.

```bash
npm run zova :create:component card -- --module=training-student
```

The component generator also supports named boilerplate variants through `--boilerplate=...`.

A practical current example is a detail-page bulk action controller scaffold:

```bash
npm run zova :create:component actionCreate -- --module=training-student --boilerplate=detailsActionBulk
```

That variant generates a controller registered in `IResourceDetailsActionBulkRecord` and injects `IJsxRenderContextDetails` from the host details runtime.

## Controller definition

Representative component controller shape:

```typescript
@Controller()
class ControllerCard extends BeanControllerBase {
  protected render() {
    return null;
  }
}
```

## Component wrapper

Zova automatically creates a wrapper component for each component.

Representative example:

- component: `card`
- wrapper: `ZCard`

The `Z` prefix is useful because it makes framework components easy to identify quickly inside TSX.

## Use a component

Representative usage pattern:

```typescript
import { ZCard } from 'zova-module-training-student';

class RenderPageCounter {
  render() {
    return <ZCard />;
  }
}
```

## Async loading behavior

Component wrappers can also participate in asynchronous loading behavior automatically.

This matters because the wrapper is not just a naming convenience. It is part of how Zova turns modular code into practical runtime behavior.

## Controller load boundaries

A component Controller, optional Style bean, and optional Render bean load in that order. While that asynchronous work is pending, Zova can render a loading boundary; an unhandled initialization failure renders an error boundary.

```ts
@Controller()
class ControllerReport extends BeanControllerBase {
  static $componentOptions: IComponentOptions = {
    boundary: {
      loading: { delay: 500 },
      renderMode: 'inline',
      retry: true,
    },
  };
}
```

`retry` is disabled by default. Enable it only when creating a fresh Controller → Style → Render graph and running the Controller initialization again is safe. In particular, do not opt in for initialization that can repeat a non-idempotent external effect without its own idempotency or recovery contract.

Error rendering keeps Controller ownership first. A Controller override may receive the retry action as its trailing argument; otherwise the application boundary renderer receives it:

```ts
protected renderError(error, renderMode, retry?) {
  return null;
}

config.boundary.renderError(ctx, error, renderMode, retry?);
```

The callback is optional because retry may be disabled or unavailable. Existing error renderers that accept only `error` or `error, renderMode` remain valid. When a Controller provides its own error renderer, Zova does not wrap that output with an application retry control; the Controller decides whether to present the action.

For SSR, a server-selected error fallback remains the client’s first hydration result. Retry becomes interactive only after the component has mounted, so the server HTML and hydration-time client output stay equivalent. A retry then creates a fresh client-side load graph; it does not rerun the failed Controller instance in place.

## Reference the component instance

Instead of relying on template refs in the usual Vue style, Zova prefers direct access to the component controller instance.

Representative pattern:

```typescript
import type { ControllerCard } from 'zova-module-training-student';
import { ZCard } from 'zova-module-training-student';

class RenderPageCounter {
  cardRef: ControllerCard;

  render() {
    return (
      <ZCard
        controllerRef={ref => {
          this.cardRef = ref;
        }}
      />
    );
  }
}
```

## `controllerRef` and internal companion access

`controllerRef` is a consumer-side mechanism: it exposes this component's Controller instance to the component's caller. It is distinct from the internal companion-member access used by a split Controller, Render, and Style implementation.

Inside one component, use direct `this.member` access for ordinary companion state, actions, and generated style classes. For the lookup order, shadowing rule, and cases that require explicit identity or interop access instead, see [Page Guide: Companion-member access](/frontend/page-guide#companion-member-access-in-a-split-page).

## Practical implications for component implementation

When working on Zova components, do not automatically fall back to generic Vue component habits.

A better default is:

1. use the component generator
2. preserve the wrapper-based usage model
3. treat controller access as the primary instance-reference pattern
4. remember that wrapper behavior and async loading are part of the framework design
