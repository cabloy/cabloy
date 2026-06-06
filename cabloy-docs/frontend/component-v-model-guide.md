# Component v-model Guide

This guide explains how component `v-model` works in Zova within the Cabloy monorepo.

## Why Zova `v-model` matters

Zova makes it convenient to add two-way binding behavior to a component while keeping the binding logic visible inside the controller model.

That is important because the framework treats model binding as part of the controller-oriented component architecture, not just as template sugar.

## Add the basic `modelValue` skeleton

Example: add `modelValue` to component `card`.

```bash
npm run zova :refactor:componentModel card modelValue -- --module=demo-student
```

## Representative generated shape

```typescript
export interface ControllerCardModels {
  vModel?: number;
}

@Controller()
export class ControllerCard extends BeanControllerBase {
  static $propsDefault = {
    modelValue: 0,
  };

  modelValue: number;

  protected async __init__() {
    this.modelValue = this.$useModel('modelValue');
  }
}
```

## Use `v-model` inside the component

Representative pattern:

```typescript
class ControllerCard {
  render() {
    return (
      <div>
        <div>{this.modelValue}</div>
        <button
          onClick={() => {
            this.modelValue++;
          }}
        >
          Change
        </button>
      </div>
    );
  }
}
```

The key idea is that changing `this.modelValue` updates the bound parent-side value through the framework binding model.

## Pass `v-model` from the parent

Representative pattern:

```typescript
class ControllerOther {
  count: number;

  render() {
    return <ZCard vModel={this.count} />;
  }
}
```

## Named `v-model` parameters

`modelValue` is only the default binding name. Other binding names can be added, for example `title`.

Representative generation command:

```bash
npm run zova :refactor:componentModel card title -- --module=demo-student
```

Representative usage pattern:

```typescript
<ZCard vModel:title={this.title} />
```

## Modifiers

Zova also supports modifiers through the same broader binding model.

One representative example uses a custom `capitalize` modifier, implemented by passing a setter transformation into `$useModel`.

That is useful because it shows `v-model` behavior in Zova is programmable and explicit, not just a fixed syntax feature.

## Why this matters for AI workflows

When AI adds two-way binding to a Zova component, it should:

1. use the Zova refactor command to create the skeleton
2. keep the binding visible through `Controller*Models` and `$useModel`
3. choose between default and named model parameters deliberately
4. use modifiers through the framework pattern instead of inventing parallel custom binding logic
