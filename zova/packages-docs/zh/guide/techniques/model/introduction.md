# 简介

Zova 提供了 MVC 架构中的 Model 机制，通过 Model 封装统一数据源，从而规范数据使用方式，简化代码结构，提升代码的可维护性。

Zova Model 的基座是[TanStack Query](https://tanstack.com/query/latest/docs/framework/vue/overview)。TanStack Query 提供了强大的数据获取、缓存和更新能力。Zova 在 TanStack Query 的基础上封装出了非常简洁的使用范式，可以非常容易的上手使用。但是，仍然建议你阅读 TanStack Query 的文档。如果你没有使用过类似的数据管理机制，那么你一定会受到思想的洗礼。

## 四种全局状态数据

在实际开发当中，会遇到四种全局状态数据：`异步数据（一般来自服务端）`、`同步数据`。同步数据又分为三种：`localstorage`、`cookie`、`内存`。在传统的 Vue3 当中，分别采用不同的机制来处理这些状态数据，而在 Zova 中只需要采用统一的`Model`机制。

| 状态数据     | 传统的Vue3           | Zova  |
| ------------ | -------------------- | ----- |
| 异步数据     | Pinia                | Model |
| localstorage | Pinia + Localstorage | Model |
| cookie       | Pinia + Cookie       | Model |
| 内存         | Pinia                | Model |

采用 Model 机制统一管理这些全局状态数据，就可以统一获得 TanStack Query 提供的能力，包括`内存优化`、`持久化`和`SSR支持`等等，从而规范数据使用方式，简化代码结构，提升代码的可维护性。

## 特性1. 支持异步数据和同步数据

重要的事情说三遍。TanStack Query 的核心是对异步数据（一般来自服务端）进行管理。Zova Model 在 TanStack Query 的基础上做了扩展，因此也支持同步数据的管理。换而言之，以下所述所有特性和能力同时适用于`异步数据`和`同步数据`

## 特性2. 自动缓存

对获取的异步数据进行本地缓存，避免重复获取。对于同步数据，会自动针对 localstorage 或者 cookie 进行读写操作。

## 特性3. 自动更新

提供数据过期策略，在合适的时机自动更新。

## 特性4. 减少重复请求

在程序的多个地方同时访问数据，将只调用一次服务端 api。如果是同步数据，也只针对 localstorage 或者 cookie 调用一次操作。

## 特性5. 内存优化

通过 Zova Model 管理的数据，虽然是全局范围的状态，但是并不总是占用内存，而是提供了内存释放与回收的机制。具体而言，就是在创建 Vue 组件实例时根据业务的需要创建缓存数据，当 Vue 组件实例卸载时释放对缓存数据的引用，到达约定的过期时间如果仍然没有其他 Vue 组件引用，就会触发回收机制(GC)，完成对内存的释放，从而节约内存占用。这对于大型项目，用户需要长时间进行界面交互的场景，具有显著的好处。

## 特性6. 持久化

本地缓存可以持久化，当页面刷新时可以自动恢复，避免服务端调用。如果是异步数据，就会自动持久化到 IndexDB 中，从而满足大数据量的存储需要。如果是同步数据，就会自动持久化到 localstorage 或者 cookie。

`内存优化`与`持久化`配合发挥作用，对于大型项目效果更佳明显。比如，第一次从服务端获取的数据，会生成本地缓存，并自动持久化。当页面不再使用并且过期时，会自动销毁本地缓存，从而释放内存。当再次访问该数据时，会自动从持久化中恢复本地缓存数据，而不是再次从服务端获取数据。

## 特性7. SSR支持

不同类型的状态数据，在 SSR 模式下也会有不同的实现机制。Zova Model 把这些状态数据的差异进行抹平，并且采用统一的机制进行水合，从而让 SSR 的实现更加自然、直观，显著降低了心智负担。

## 特性8. 自动命名空间隔离

Zova 通过 Model Bean 来管理数据。而 Bean 本身有唯一的标识，可以作为数据的命名空间，从而自动保证了 Bean 内部状态数据命名的唯一性，避免数据冲突。

- 参见：[Bean标识](../../essentials/ioc/bean-identifier.md)

## 创建Model Bean

::: tip
右键菜单 - [模块路径]: `Zova Create/Bean: Model`
:::

依据提示输入 model bean 的名称，比如`todo`，VSCode 插件会自动添加 model bean 的代码骨架。

比如，在 demo-basic 模块中创建一个 Model Bean `todo`

`demo-basic/src/bean/model.todo.ts`

```typescript
import { Model } from 'zova';
import { BeanModelBase } from 'zova-module-a-model';

@Model()
export class ModelTodo extends BeanModelBase {}
```

- 使用@Model 装饰器
- 继承自基类 BeanModelBase
