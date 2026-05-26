# 应用启动自定义

VonaJS 提供了`Hook/Monkey`机制，可以在应用启动时对系统进行深度的定制。

::: tip
当然，对于常规业务需求，一般只需创建[启动项](../../distributed/startup/introduction.md)即可
:::

在解释`Hook/Monkey`机制之前，有必要先了解应用启动/停止的时序。

## 应用启动时序

![](../../../assets/img/app-start/app-start.png)

应用启动时序分四个步骤：

1. `appLoad`: 加载所有的模块
   - 针对每个模块均触发钩子`moduleLoading`、`configLoaded`、`moduleLoaded`
2. `appStart`: 触发钩子`appStart`
   - 比如，模块 a-startup 响应此钩子，执行`应用启动项(after: false)`。参见: [启动项](../../distributed/startup/introduction.md)
   - 当`appStart`执行后，会设置`app.meta.appReady=true`
   - 此时，系统提供的所有 API 服务可以接受客户端的请求
3. `appReady`: 触发钩子`appReady`
   - 比如，模块 a-startup 响应此钩子，执行`应用启动项(after: true)`。参见: [启动项](../../distributed/startup/introduction.md)
4. `appStarted`: 触发钩子`appStarted`

## 应用停止时序

![](../../../assets/img/app-start/app-close.png)

应用停止时序分两个步骤：

1. `appClose`: 触发钩子`appClose`
2. `appClosed`: 触发钩子`appClosed`

## 钩子清单

系统提供了三个场景来响应应用启动/停止的钩子:

1. `Module Main`: 在`{module}/src/main.ts`中响应模块自身的钩子
2. `Module Monkey`: 在`{module}/src/monkey.ts`中响应系统钩子
3. `App Monkey`: 在`{project}/src/backend/config/monkey.ts`中响应系统钩子

针对不同的场景，VonaJS 为不同的钩子提供了对应的接口定义，从而规范钩子的使用。

| 钩子          | Module Main 接口 | Module Monkey 接口                | App Monkey 接口                   |
| ------------- | ---------------- | --------------------------------- | --------------------------------- |
| moduleLoading | IModuleMain      | IMonkeyModule                     | IMonkeyModule                     |
| configLoaded  | IModuleMain      | IMonkeyModule                     | IMonkeyModule                     |
| moduleLoaded  | IModuleMain      | IMonkeyModule                     | IMonkeyModule                     |
| appStart      |                  | IMonkeySystem / IMonkeyAppStart   | IMonkeySystem / IMonkeyAppStart   |
| appReady      |                  | IMonkeySystem / IMonkeyAppReady   | IMonkeySystem / IMonkeyAppReady   |
| appStarted    |                  | IMonkeySystem / IMonkeyAppStarted | IMonkeySystem / IMonkeyAppStarted |
| appClose      |                  | IMonkeySystem / IMonkeyAppClose   | IMonkeySystem / IMonkeyAppClose   |
| appClosed     |                  | IMonkeySystem / IMonkeyAppClosed  | IMonkeySystem / IMonkeyAppClosed  |

## 创建 Module Main

### 1. Cli命令

```bash
$ vona :init:main demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Main`
:::

### Module Main定义

```typescript
export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}
```

## 创建 Module Monkey

### 1. Cli命令

```bash
$ vona :init:monkey demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Monkey`
:::

### Module Monkey定义

```typescript
export class Monkey extends BeanSimple implements IMonkeyModule, IMonkeySystem {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async appStart() {}
  async appReady() {}
  async appStarted() {}
  async appClose() {}
  async appClosed() {}
}
```

## 创建 App Monkey

### 1. Cli命令

```bash
$ vona :init:appMonkey
```

### 2. 菜单命令

::: tip
右键菜单 - [项目路径/src]: `Vona Init/App Monkey`
:::

### App Monkey定义

`src/backend/config/monkey.ts`

```typescript
export class AppMonkey extends BeanSimple implements IMonkeyModule, IMonkeySystem {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async appStart() {}
  async appReady() {}
  async appStarted() {}
  async appClose() {}
  async appClosed() {}
}
```
