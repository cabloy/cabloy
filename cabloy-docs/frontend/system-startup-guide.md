# System Startup Guide

## Why system startup matters

Zova separates system startup from application startup so system-level initialization can be reasoned about independently from request-scoped or app-instance-scoped behavior.

That matters especially in SSR scenarios, where application startup may happen per request while system startup does not.

## System startup vs app startup

The critical distinction is:

- **app startup** can be tied to individual application instances or requests
- **system startup** is not request-scoped

This separation makes it easier to place long-lived initialization logic in the correct lifecycle.

## System startup timings

Zova provides three main system startup timings:

- `sysInitialize`
- `sysInitialized`
- `sysReady`

These allow framework and project code to stage system-level initialization intentionally.

## System shutdown timing

System shutdown is represented by:

- `sysClose`

## Module load and config load timings

System-level lifecycle also includes:

- `moduleLoading`
- `moduleLoaded`
- `configLoaded`

These hooks are especially useful when module registration or config mutation must happen before the system is considered fully ready.

## Hook response scenarios

System startup hooks can be implemented in several places:

- **Module Main Sys**
- **Module Monkey Sys**
- **Sys Monkey**

This allows both module-level and project-level system initialization logic to participate in a structured way.

## Module Main Sys

A module can provide system-level main lifecycle entrypoints.

Representative pattern:

```typescript
export class MainSys extends BeanSimple implements IModuleMainSys {
  async moduleLoading() {}
  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}
```

## Module Monkey Sys

A module can also attach richer system lifecycle behavior through monkey-based hooks.

Representative pattern:

```typescript
export class MonkeySys
  extends BeanSimple
  implements IMonkeyModuleSys, IMonkeySysInitialize, IMonkeySysInitialized, IMonkeySysReady, IMonkeySysClose
{
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async sysInitialize() {}
  async sysInitialized() {}
  async sysReady() {}
  async sysClose() {}
}
```

## Sys Monkey

Project-level system lifecycle customization can be placed in the frontend config area.

This is useful when the behavior belongs to the frontend runtime as a whole rather than to one module.

## When to use system startup

Use system startup when:

- the behavior should not be repeated per app instance or per request
- config-loading order matters at the system level
- module registration or route-table wiring must happen before app startup flows begin
- the concern belongs to long-lived runtime setup rather than page/app initialization

## Relationship to environment/config selection

System startup behavior still runs under a selected mode, appMode, and flavor.

Read this guide together with [Environment and Config Guide](/frontend/environment-config-guide).

## Relationship to app startup

This guide is the system-level companion to [App Startup Guide](/frontend/app-startup-guide).

Use the app guide for request- or app-instance-facing startup behavior, and this guide for long-lived runtime setup.

## Why this matters for AI workflows

When AI edits frontend lifecycle behavior, it should ask:

1. is this a system concern or an app concern?
2. does it need `configLoaded`, `moduleLoading`, or one of the `sys*` phases?
3. should the logic live in module mainSys, module monkeySys, or sys monkey?
4. does SSR change whether the code should be system-scoped instead of request-scoped?

That helps AI place lifecycle logic in the correct layer instead of mixing system and app startup behavior together.
