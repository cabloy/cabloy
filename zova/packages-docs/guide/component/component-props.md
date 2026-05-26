# Component Props

In Zova, components no longer distinguish between `Props`, `Emits`, and `Slots`; you only need to provide `Props`, which offers a more consistent and concise programming paradigm, and is more friendly for TypeScript programming.

## Add Props Code Skeleton

Add a Props code skeleton for the `card` component.

### 1. CLI Command

```bash
$ zova :refactor:componentProps card --module=demo-student
```

### 2. Menu Command

::: tip
Context Menu - [Module Path/src/component/componentName]: `Zova Refactor/Add Component Props`
:::

## Add Props

```typescript
import { ISlot } from 'zova';

export interface ControllerCardProps {
  content?: string;
  onReset?: () => void;
  slotHeader?: ISlot;
  slotDefault?: (name: string) => VNode;
}
```

## Default Value

You can set default values for Props:

```typescript
class ControllerCard {
  static $propsDefault = {
    content: 'no content',
  };
}
```

### Using Props

Zova injects the `$props` object in the base class of the `controller` bean, so you can directly access props through `this.$props` with type hints supported.

```diff
class ControllerCard {
  render() {
    return (
      <div>
+       <div>{this.$props.slotHeader?.()}</div>
+       <div>{this.$slotDefault?.('tom')}</div>
+       <div>{this.$props.content}</div>
        <button
          onClick={() => {
+           this.$props.onReset?.();
          }}
        >
          Reset
        </button>
      </div>
    );
  }
}
```

### Passing Props

Type hints are also supported when passing Props to child components.

```diff
import { ZCard } from 'zova-module-demo-student';

class ControllerOther {
  render() {
    return (
      <div>
        <ZCard
+         content="custom content"
+         onReset={() => {
+           console.log('onReset is invoked');
+         }}
+         slotHeader={() => {
+           return <div>custom header</div>;
+         }}
+         slotDefault={name => {
+           return <div>{name}</div>;
+         }}
        ></ZCard>
      </div>
    );
  }
}
```
