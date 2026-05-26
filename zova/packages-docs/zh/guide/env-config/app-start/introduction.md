# 应用启动自定义

ZovaJS 提供了`Hook/Monkey`机制，可以在应用启动时对系统进行深度的定制。

在解释`Hook/Monkey`机制之前，有必要先了解应用启动/停止的时序。

## 应用启动时序

应用启动时序分三个时机：

1. `appInitialize`: 触发钩子`appInitialize`
   - 比如，模块 a-router 响应此钩子，初始化路由守卫服务
2. `appInitialized`: 触发钩子`appInitialized`
   - 比如，模块 a-router 响应此钩子，触发路由守卫事件，从而允许其他业务模块也可以提供路由守卫服务，并监听路由守卫事件
3. `appReady`: 触发钩子`appReady`
   - 比如，模块 a-router 响应此钩子，注入 Vue Router 实例，并执行首次导航

> 最佳实践：ZovaJS提供三个时机，是为了提供更大的灵活性和可配置性。业务模块可以根据自身需要在合适的时机执行自定义的初始化逻辑。在满足业务需求的前提下，尽量使用最靠前的时机，从而为后续的其他业务扩展提供可能

## 应用停止时序

应用停止时序只有一个时机：

1. `appClose`: 触发钩子`appClose`
   - 比如，模块 a-router 响应此钩子，销毁路由守卫服务，从而销毁路由守卫监听器

## 模块加载时序

模块加载时序分两个时机：

1. `moduleLoading`: 触发钩子`moduleLoading`
2. `moduleLoaded`: 触发钩子`moduleLoaded`

## 钩子清单

系统提供了三个场景来响应钩子:

1. `Module Main`: 在`{module}/src/main.ts`中响应模块自身的钩子
2. `Module Monkey`: 在`{module}/src/monkey.ts`中响应 App 钩子
3. `App Monkey`: 在`{project}/src/front/config/monkey.ts`中响应 App 钩子

针对不同的场景，为不同的钩子提供了对应的接口定义，从而规范钩子的使用。

| 钩子           | Module Main 接口 | Module Monkey 接口    | App Monkey 接口       |
| -------------- | ---------------- | --------------------- | --------------------- |
| moduleLoading  | IModuleMain      | IMonkeyModule         | IMonkeyModule         |
| moduleLoaded   | IModuleMain      | IMonkeyModule         | IMonkeyModule         |
| appInitialize  |                  | IMonkeyAppInitialize  | IMonkeyAppInitialize  |
| appInitialized |                  | IMonkeyAppInitialized | IMonkeyAppInitialized |
| appReady       |                  | IMonkeyAppReady       | IMonkeyAppReady       |
| appClose       |                  | IMonkeyAppClose       | IMonkeyAppClose       |

## 创建 Module Main

### 1. Cli命令

```bash
$ zova :init:main demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Init/Main`
:::

### Module Main定义

```typescript
export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {}
}
```

## 创建 Module Monkey

### 1. Cli命令

```bash
$ zova :init:monkey demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Init/Monkey`
:::

### Module Monkey定义

```typescript
export class Monkey extends BeanSimple implements IMonkeyModule, IMonkeyAppInitialize, IMonkeyAppInitialized, IMonkeyAppReady, IMonkeyAppClose {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async appInitialize() {}
  async appInitialized() {}
  async appReady() {}
  async appClose() {}
}
```

## 创建 App Monkey

### 1. Cli命令

```bash
$ zova :init:appMonkey
```

### 2. 菜单命令

::: tip
右键菜单 - [项目路径/src]: `Zova Init/Monkey`
:::

### App Monkey定义

`src/front/config/monkey.ts`

```typescript
export class AppMonkey extends BeanSimple implements IMonkeyModule, IMonkeyAppInitialize, IMonkeyAppInitialized, IMonkeyAppReady, IMonkeyAppClose {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async appInitialize() {}
  async appInitialized() {}
  async appReady() {}
  async appClose() {}
}
```
