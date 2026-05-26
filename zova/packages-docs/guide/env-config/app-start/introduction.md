# App Startup Customization

ZovaJS provides a `Hook/Monkey` mechanism that allows deep customization of the system during application startup.

Before explaining the `Hook/Monkey` mechanism, it is necessary to first understand the timing of application startup and shutdown.

## Application Startup Timing

There are three timings for application startup:

1. `appInitialize`: Triggers the hook `appInitialize`
   - For example, the module a-router responds to this hook and initializes the route guard service
2. `appInitialized`: Triggers the hook `appInitialized`
   - For example, the module a-router responds to this hook, triggering route guard events, thereby allowing other business modules to also provide route guard services and listen to route guard events
3. `appReady`: Triggers the hook `appReady`
   - For example, the module a-router responds to this hook, injects the Vue Router instance, and performs the initial navigation

> Best Practice: ZovaJS provides three timings to offer greater flexibility and configurability. Business modules can execute custom initialization logic at the appropriate timing according to their needs. While meeting business requirements, try to use the earliest timing possible, thereby providing possibilities for subsequent business extensions

## Application Shutdown Timing

There is only one timing for application shutdown:

1. `appClose`: Triggers the hook `appClose`
   - For example, the module a-router responds to this hook, destroys the route guard service, thereby destroying the route guard listeners

## Module Load Timing

There are two timings for module load:

1. `moduleLoading`: Triggers the hook `moduleLoading`
2. `moduleLoaded`: Triggers the hook `moduleLoaded`

## Hook List

The system provides three scenarios to respond to application startup/shutdown hooks:

1. `Module Main`: Respond to the module's own hooks in the file `{module}/src/main.ts`
2. `Module Monkey`: Respond to app hooks in the file `{module}/src/monkey.ts`
3. `App Monkey`: Respond to app hooks in the file `{project}/src/front/config/monkey.ts`

For different scenarios, corresponding interface definitions are provided for different hooks, thereby standardizing the use of hooks.

| Hook           | Module Main Interface | Module Monkey Interface | App Monkey Interface  |
| -------------- | --------------------- | ----------------------- | --------------------- |
| moduleLoading  | IModuleMain           | IMonkeyModule           | IMonkeyModule         |
| moduleLoaded   | IModuleMain           | IMonkeyModule           | IMonkeyModule         |
| appInitialize  |                       | IMonkeyAppInitialize    | IMonkeyAppInitialize  |
| appInitialized |                       | IMonkeyAppInitialized   | IMonkeyAppInitialized |
| appReady       |                       | IMonkeyAppReady         | IMonkeyAppReady       |
| appClose       |                       | IMonkeyAppClose         | IMonkeyAppClose       |

## Create Module Main

### 1. Cli command

```bash
$ zova :init:main demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Init/Main`
:::

### Module Main Definition

```typescript
export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {}
}
```

## Create Module Monkey

### 1. Cli command

```bash
$ zova :init:monkey demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Init/Monkey`
:::

### Module Monkey Definition

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

## Create App Monkey

### 1. Cli command

```bash
$ zova :init:appMonkey
```

### 2. Menu command

::: tip
Context Menu - [Project Path/src]: `Zova Init/Monkey`
:::

### App Monkey Definition

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
