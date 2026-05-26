# 系统启动自定义

ZovaJS 提供了`Hook/Monkey`机制，可以在系统启动时对系统进行深度的定制。

在解释`Hook/Monkey`机制之前，有必要先了解系统启动/停止的时序。

## 🔥与应用启动的区别

在 SSR 场景中，`应用启动`是针对每一个 Request 而言的，`系统启动`则与 Request 无关。

## 系统启动时序

系统启动时序分三个时机：

1. `sysInitialize`: 触发钩子`sysInitialize`
2. `sysInitialized`: 触发钩子`sysInitialized`
3. `sysReady`: 触发钩子`sysReady`

## 系统停止时序

系统停止时序只有一个时机：

1. `sysClose`: 触发钩子`sysClose`

## 模块加载时序

模块加载时序分两个时机：

1. `moduleLoading`: 触发钩子`moduleLoading`
   - 比如，模块 a-router 响应此钩子，将模块提供的路由注册到系统路由表中
2. `moduleLoaded`: 触发钩子`moduleLoaded`
3. `configLoaded`: 触发钩子`configLoaded`

## 钩子清单

系统提供了三个场景来响应钩子:

1. `Module Main`: 在`{module}/src/mainSys.ts`中响应模块自身的钩子
2. `Module Monkey`: 在`{module}/src/monkeySys.ts`中响应 Sys 钩子
3. `Sys Monkey`: 在`{project}/src/front/config/monkeySys.ts`中响应 Sys 钩子

针对不同的场景，为不同的钩子提供了对应的接口定义，从而规范钩子的使用。

| 钩子           | Module Main 接口 | Module Monkey 接口    | Sys Monkey 接口       |
| -------------- | ---------------- | --------------------- | --------------------- |
| moduleLoading  | IModuleMainSys   | IMonkeyModuleSys      | IMonkeyModuleSys      |
| moduleLoaded   | IModuleMainSys   | IMonkeyModuleSys      | IMonkeyModuleSys      |
| configLoaded   | IModuleMainSys   | IMonkeyModuleSys      | IMonkeyModuleSys      |
| sysInitialize  |                  | IMonkeySysInitialize  | IMonkeySysInitialize  |
| sysInitialized |                  | IMonkeySysInitialized | IMonkeySysInitialized |
| sysReady       |                  | IMonkeySysReady       | IMonkeySysReady       |
| sysClose       |                  | IMonkeySysClose       | IMonkeySysClose       |

## 创建 Module Main

### 1. Cli命令

```bash
$ zova :init:mainSys demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Init/Main Sys`
:::

### Module Main定义

```typescript
export class MainSys extends BeanSimple implements IModuleMainSys {
  async moduleLoading() {}
  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}
```

## 创建 Module Monkey

### 1. Cli命令

```bash
$ zova :init:monkeySys demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Init/Monkey Sys`
:::

### Module Monkey定义

```typescript
export class MonkeySys extends BeanSimple implements IMonkeyModuleSys, IMonkeySysInitialize, IMonkeySysInitialized, IMonkeySysReady, IMonkeySysClose {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async sysInitialize() {}
  async sysInitialized() {}
  async sysReady() {}
  async sysClose() {}
}
```

## 创建 Sys Monkey

### 1. Cli命令

```bash
$ zova :init:sysMonkey
```

### 2. 菜单命令

::: tip
右键菜单 - [项目路径/src]: `Zova Init/Monkey Sys`
:::

### Sys Monkey定义

`src/front/config/monkeySys.ts`

```typescript
export class SysMonkey extends BeanSimple implements IMonkeyModuleSys, IMonkeySysInitialize, IMonkeySysInitialized, IMonkeySysReady, IMonkeySysClose {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async sysInitialize() {}
  async sysInitialized() {}
  async sysReady() {}
  async sysClose() {}
}
```
