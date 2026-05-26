# Sys Startup Customization

ZovaJS provides a `Hook/Monkey` mechanism that allows deep customization of the system during system startup.

Before explaining the `Hook/Monkey` mechanism, it is necessary to first understand the timing of system startup and shutdown.

## 🔥Difference from Application Startup

In the SSR scenario, `application startup` refers to each individual request, while `system startup` is unrelated to requests.

## System Startup Timing

There are three timings for system startup:

1. `sysInitialize`: Triggers the hook `sysInitialize`
2. `sysInitialized`: Triggers the hook `sysInitialized`
3. `sysReady`: Triggers the hook `sysReady`

## System Shutdown Timing

There is only one timing for system shutdown:

1. `sysClose`: Triggers the hook `sysClose`

## Module Load Timing

There are two timings for module load:

1. `moduleLoading`: Triggers the hook `moduleLoading`
   - For example, the module a-router responds to this hook and registers the routes provided by the module into the system's routing table
2. `moduleLoaded`: Triggers the hook `moduleLoaded`
3. `configLoaded`: Triggers the hook `configLoaded`

## Hook List

The system provides three scenarios to respond to application startup/shutdown hooks:

1. `Module Main`: Respond to the module's own hooks in the file `{module}/src/mainSys.ts`
2. `Module Monkey`: Respond to app hooks in the file `{module}/src/monkeySys.ts`
3. `Sys Monkey`: Respond to app hooks in the file `{project}/src/front/config/monkeySys.ts`

For different scenarios, corresponding interface definitions are provided for different hooks, thereby standardizing the use of hooks.

| Hook           | Module Main Interface | Module Monkey Interface | Sys Monkey Interface  |
| -------------- | --------------------- | ----------------------- | --------------------- |
| moduleLoading  | IModuleMainSys        | IMonkeyModuleSys        | IMonkeyModuleSys      |
| moduleLoaded   | IModuleMainSys        | IMonkeyModuleSys        | IMonkeyModuleSys      |
| configLoaded   | IModuleMainSys        | IMonkeyModuleSys        | IMonkeyModuleSys      |
| sysInitialize  |                       | IMonkeySysInitialize    | IMonkeySysInitialize  |
| sysInitialized |                       | IMonkeySysInitialized   | IMonkeySysInitialized |
| sysReady       |                       | IMonkeySysReady         | IMonkeySysReady       |
| sysClose       |                       | IMonkeySysClose         | IMonkeySysClose       |

## Create Module Main

### 1. Cli command

```bash
$ zova :init:mainSys demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Init/Main Sys`
:::

### Module Main Definition

```typescript
export class MainSys extends BeanSimple implements IModuleMainSys {
  async moduleLoading() {}
  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}
```

## Create Module Monkey

### 1. Cli command

```bash
$ zova :init:monkeySys demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Zova Init/Monkey Sys`
:::

### Module Monkey Definition

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

## Create Sys Monkey

### 1. Cli command

```bash
$ zova :init:sysMonkey
```

### 2. Menu command

::: tip
Context Menu - [Project Path/src]: `Zova Init/Monkey Sys`
:::

### Sys Monkey Definition

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
