# Provide/Inject

Zova 推荐使用[ioc: 层级注入](../essentials/ioc/dependency-injection.md#hierarchical-injection)来代替 Vue3 的依赖注入机制。当然，Zova 也支持 Vue3 的依赖注入机制，从而兼容现有 Vue3 生态。

在 Zova 中实现 Vue3 的依赖注入，主要分三步：

## 1. 定义类型

采用接口合并的机制，定义 key 与 type 的映射关系。为了确保全局唯一性，key 采用`module:name`的格式，从而避免命名冲突。

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

在父组件中提供值。

```typescript
// in module: test-module1
class Parent {
  protected async __init__() {
    this.bean.provide('test-module1:fruit', 'apple');
  }
}
```

- this.bean 是当前组件实例的 ioc 容器

## 3. Inject

在子组件中注入值。

```typescript
// in module: test-module2
class Child {
  protected async __init__() {
    const fruit = this.bean.inject('test-module1:fruit');
    const fruit2 = this.bean.inject('test-module1:fruit', 'pear');
  }
}
```

- this.bean 是当前组件实例的 ioc 容器

## 为何不直接使用Vue3提供的provide/inject方法？

Vue3 的 provide/inject 方法只能在 setup 的同步阶段调用。而 Zova 通过 ioc 容器封装的 provide/inject 方法则没有这个限制，可以在任何地方的异步方法中调用。
