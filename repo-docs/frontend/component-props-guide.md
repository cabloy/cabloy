# Component Props Guide

This guide explains how component props work in Zova within the Cabloy monorepo.

## Why Zova props feel different

In Zova, component design does not force a hard separation between `Props`, `Emits`, and `Slots` in the same way many Vue codebases do.

Zova uses a more unified approach centered on component props, which makes the programming model more concise and TypeScript-friendly.

## Add props support

Example: add props support to component `card`.

```bash
npm run zova :refactor:componentProps card -- --module=training-student
```

## Define props

Representative pattern:

```typescript
import { ISlot } from 'zova';

export interface ControllerCardProps {
  content?: string;
  onReset?: () => void;
  slotHeader?: ISlot;
  slotDefault?: (name: string) => VNode;
}
```

This is important because the props contract can describe ordinary values, callbacks, and slot-like behavior in one consistent shape.

## Default values

Representative pattern:

```typescript
class ControllerCard {
  static $propsDefault = {
    content: 'no content',
  };
}
```

## Use props in the controller

Zova injects `$props` into the controller base class.

Representative pattern:

```typescript
class ControllerCard {
  render() {
    return (
      <div>
        <div>{this.$props.slotHeader?.()}</div>
        <div>{this.$slotDefault?.('tom')}</div>
        <div>{this.$props.content}</div>
        <button onClick={() => this.$props.onReset?.()}>Reset</button>
      </div>
    );
  }
}
```

## Pass props to child components

Representative pattern:

```typescript
<ZCard
  content="custom content"
  onReset={() => {
    console.log('onReset is invoked');
  }}
  slotHeader={() => {
    return <div>custom header</div>;
  }}
  slotDefault={name => {
    return <div>{name}</div>;
  }}
/>
```

## Practical implications for component API design

When creating or refactoring Zova components, do not automatically impose a generic Vue component API style.

A better default is:

1. use the Zova refactor command to add the props skeleton
2. keep the props contract explicit and typed
3. treat props as the main contract surface for values, callbacks, and slot-like behavior
4. preserve the controller-oriented way of consuming props inside the component
