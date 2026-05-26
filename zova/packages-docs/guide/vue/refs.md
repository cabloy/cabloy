# Refs

## Template Ref {#template-ref}

If it is an Html Element or a regular Vue component (without using an ioc container), you can use `Template Ref` to reference the component instance.

### 1. Html Element

Take `input` element as an example:

```typescript
export class ControllerPageComponent {
  inputRef: HTMLInputElement | null;

  protected async __init__() {
    this.$onMounted(() => {
      this.inputRef?.focus();
    });
  }
}
```

- Declare variable `inputRef`
- Listen to `onMounted` event and call `focus` method

```typescript
export class RenderComponent {
  render() {
    return (
      <div>
        <input
          ref={ref => {
            this.inputRef = ref as any;
          }}
        />
      </div>
    );
  }
}
```

- Receive `ref` through callback function Parameter, assigned to `inputRef`

### 2. Vue component (without using ioc container)

Take quasar's `QBtn` component as an example:

```typescript
export class ControllerPageComponent {
  btnRef: InstanceType<typeof QBtn> | null;

  protected async __init__() {
    this.$onMounted(() => {
      this.btnRef?.click();
    });
  }
}
```

- Declare variable `btnRef`
- Listen to `onMounted` event and call `click` method

```typescript
export class RenderComponent {
  render() {
    return (
      <div>
        <input
          ref={ref => {
            this.btnRef = ref as any;
          }}
        />
      </div>
    );
  }
}
```

- Receive `ref` through callback function Parameter, assigned to `btnRef`

## Controller Ref {#controller-ref}

For Vue components that use the ioc container, you cannot use `Template Ref`, but directly reference the `controller bean` instance corresponding to the Vue component.

### 1. Declare variable

First declare a variable in `controller.ts` of the parent component:

```typescript
import type { ControllerCard } from '../../.metadata/index.js';

export class ControllerPageComponent {
  cardRef: ControllerCard;
}
```

### 2. controllerRef

Then set the `controllerRef` prop of the child component to obtain the ref value of the `controller bean` instance:

```typescript
import { ZCard } from '../../.metadata/index.jsx';

export class RenderComponent {
  render() {
    return (
      <div>
        <ZCard
          controllerRef={ref => {
            this.cardRef = ref;
          }}
        ></ZCard>
      </div>
    );
  }
}
```
