# Provide/Inject

Zova recommends using [ioc: hierarchical injection](../essentials/ioc/dependency-injection.md#hierarchical-injection) to replace Vue3's dependency injection mechanism. Of course, Zova also supports Vue3's dependency injection mechanism, so it is compatible with the existing Vue3 ecosystem.

To implement Vue3's dependency injection in Zova, there are three main steps:

## 1. Define the type

Use the interface merging mechanism to define the mapping relationship between `key` and `type`. To ensure global uniqueness, `key` uses the format of `module:name` to avoid naming conflicts.

```typescript
// in module: test-module1
import 'zova';
declare module 'zova' {
  export interface IInjectRecord {
    'test-module1:fruit': String;
  }
}
```

## 2. Provide

Provide a value ​​in the parent component.

```typescript
// in module: test-module1
class Parent {
  protected async __init__() {
    this.bean.provide('test-module1:fruit', 'apple');
  }
}
```

- `this.bean` is the ioc container of the current component instance

## 3. Inject

Inject a value ​​in child component.

```typescript
// in module: test-module2
class Child {
  protected async __init__() {
    const fruit = this.bean.inject('test-module1:fruit');
    const fruit2 = this.bean.inject('test-module1:fruit', 'pear');
  }
}
```

- `this.bean` is the ioc container of the current component instance

## Why not use the provide/inject method provided by Vue3 directly?

The `provide/inject` method of Vue3 can only be used in the synchronous phase of `setup`. The `provide/inject` method encapsulated by Zova through the ioc container does not have this limitation and can be used in asynchronous methods anywhere.
