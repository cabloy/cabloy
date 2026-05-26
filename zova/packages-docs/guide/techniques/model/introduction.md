# Introduction

Zova provides the `Model` mechanism in the MVC architecture, encapsulating unified data sources through `Model`, thereby standardizing the use of data, simplifying the code structure, and improving the maintainability of the code.

The base of Zova Model is [TanStack Query](https://tanstack.com/query/latest/docs/framework/vue/overview). `TanStack Query` provides powerful data acquisition, caching and update capabilities. Zova encapsulates a very simple usage paradigm based on TanStack Query, which makes it very easy to get started. However, it is still recommended that you read the documentation for TanStack Query. If you have not used similar data management mechanisms, then you will definitely be impressed by the thought.

## Four types of global state data

In actual development, you will encounter four types of global state data: `asynchronous data (usually from the server)` and `synchronous data`, while `synchronous data` is divided into three types: `localstorage`, `cookie`, and `memory`. In the traditional Vue3, different mechanisms are used to handle these state data, while only a unified `Model` mechanism is needed in Zova.

| Global State Data | Traditional Vue3     | Zova  |
| ----------------- | -------------------- | ----- |
| asynchronous data | Pinia                | Model |
| localstorage      | Pinia + Localstorage | Model |
| cookie            | Pinia + Cookie       | Model |
| memory            | Pinia                | Model |

By using the `Model` mechanism to uniformly manage these global state data, you can uniformly obtain the capabilities provided by TanStack Query, including `Memory Optimization`, `Persistence` and `SSR Support`, etc., thereby standardizing data usage, simplifying code structure, and improving code maintainability.

## Feature 1. Support for async data and sync data

Important things should be said three times. The core of TanStack Query is to manage `asynchronous data (usually from the server)`. Zova provides some extension capabilities based on TanStack Query, so as to support the management of `synchronous data`. In other words, all the features and capabilities described below apply to both `asynchronous data` and `synchronous data`

## Feature 2. Automatic caching

Locally cache the acquired asynchronous data to avoid repeated acquisition. For synchronous data, read and write operations will be automatically performed on localstorage or cookie.

## Feature 3. Automatic update

Provide data expiration strategy and automatically update at the right time.

## Feature 4. Reduce duplicate requests

When accessing data in multiple places in the program at the same time, the server API will only be called once. If it is synchronous data, only one operation will be called for localstorage or cookie.

## Feature 5. Memory optimization

Although the data managed by Zova Model is in a global state, it does not always occupy memory, but provides a mechanism for memory release and recycling. Specifically, it is to create cache data according to business needs when creating a Vue component instance, release the reference to the cache data when the Vue component instance is unmounted, and if no reference and expiration time reached, the garbage collection mechanism (GC) will be triggered to complete the release of memory, thereby saving memory usage. This has significant benefits for large projects and scenarios where users need to interact with the interface for a long time.

## Feature 6. Persistence

Local cache can be persisted and can be automatically restored when the page is refreshed to avoid server requests. If it is asynchronous data, it will be automatically persisted to `IndexDB` to meet the storage needs of large amounts of data. If it is synchronous data, it will be automatically persisted to `localstorage` or `cookie`

`Memory optimization` and `persistence` work together, and the effect is more obvious for large projects. For example, the data obtained from the server will generate a local cache and automatically persist. When no longer used and expires, the local cache will be automatically destroyed to release memory. When the data is accessed again, the local cache data will be automatically restored from persistence instead of requesting the data from the server again.

## Feature 7. SSR support

Different types of state data will also have different implementation mechanisms in SSR mode. Zova Model smoothes out the differences in these state data and uses a unified mechanism to hydrate them, making the implementation of SSR more natural and intuitive, significantly reducing the mental burden.

## Feature 8. Automatic namespace isolation

Zova manages data through Model Bean. The Bean itself has a unique identifier and can be used as a namespace for data, thereby automatically ensuring the uniqueness of the state data naming inside the Bean and avoiding data conflicts.

- See: [Bean Identifier](../../essentials/ioc/bean-identifier.md)

## Create Model Bean

::: tip
Context Menu - [Module Path]: `Zova Create/Bean: Model`
:::

Enter the name of model bean according to the prompt, such as `todo`. The VSCode extension will automatically create the code skeleton of `model bean`

For example, create a Model Bean `todo` in the `demo-basic` module.

`demo-basic/src/bean/model.todo.ts`

```typescript
import { Model } from 'zova';
import { BeanModelBase } from 'zova-module-a-model';

@Model()
export class ModelTodo extends BeanModelBase {}
```

- Use `@Model` decorator
- Inherited from base class `BeanModelBase`
