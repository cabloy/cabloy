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

## Practical implications for component implementation

When working on Zova components, do not automatically fall back to generic Vue component habits.

A better default is:

1. use the component generator
2. preserve the wrapper-based usage model
3. treat controller access as the primary instance-reference pattern
4. remember that wrapper behavior and async loading are part of the framework design
