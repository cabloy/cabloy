# Component

## Code Style

Zova delivers an intuitive, elegant, and powerful code style by combining the core design strengths of Vue3, React, and Angular:

- `Vue3`: intuitive reactive state
- `React`: flexible TSX rendering
- `Angular`: powerful IOC container

## Creating a Component

Taking the module `demo-student` as an example, create a component `card`

### 1. CLI Command

```bash
$ zova :create:component card --module=demo-student
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Zova Create/Component`
:::

Enter the component name `card` as prompted, and the VSCode plugin will automatically create the code skeleton for the component.

## Controller Definition

```typescript
@Controller()
class ControllerCard extends BeanControllerBase {
  protected render() {
    return null;
  }
}
```

## Component Wrapper

Zova automatically generates a component Wrapper for each component. For example, the component `card` corresponds to the component Wrapper `ZCard`

::: info
All component Wrappers use the `Z` prefix, making it easy to quickly find components in JSX
:::

## Use Component

```typescript
import { ZCard } from 'zova-module-demo-student';

class RenderPageCounter {
  render() {
    return (
      <ZCard></ZCard>
    );
  }
}
```

::: info
Based on the support of the compiler, ZCard will automatically switch to asynchronous loading mode. Specifically, the system will asynchronously load the module `demo-student`, then obtain the component `card`, and then render the component
:::

## How to Reference Component Instance

In Zova, instead of using `Template Ref` to reference component instance, you directly reference the component's corresponding `controller`, which supports more intuitive and powerful type hints.

```typescript
import type { ControllerCard } from 'zova-module-demo-student';
import { ZCard } from 'zova-module-demo-student';

class RenderPageCounter {
  cardRef: ControllerCard;

  render() {
    return (
      <ZCard
        controllerRef={ref => {
          this.cardRef = ref;
        }}
      ></ZCard>
    );
  }
}
```
