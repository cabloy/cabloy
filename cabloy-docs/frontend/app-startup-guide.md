# App Startup Guide

## Why app startup matters

In Zova, application startup is a structured lifecycle rather than a single opaque bootstrap step.

That matters because routing, guards, business initialization, and extension hooks often need to run at different startup phases.

## App startup vs system startup

App startup is not the same as system startup.

In SSR scenarios especially, app startup can be request-scoped, while system startup is not.

This guide focuses on the application lifecycle. For system-level lifecycle hooks, see [System Startup Guide](/frontend/system-startup-guide).

## App startup timings

Zova provides three main app startup timings:

- `appInitialize`
- `appInitialized`
- `appReady`

These timings allow business modules to run initialization logic at the earliest appropriate stage.

## App shutdown timing

App shutdown is represented by:

- `appClose`

## Module load timings

The app lifecycle also intersects with module loading:

- `moduleLoading`
- `moduleLoaded`

These allow module-aware logic to participate before or after the app becomes fully ready.

## Hook response scenarios

Zova supports several implementation locations for these hooks:

- **Module Main** in a module-local main file
- **Module Monkey** in a module-local monkey file
- **App Monkey** in the project frontend config area

This makes startup behavior extensible at both module and project levels.

## Hook interface model

Different hooks correspond to different interfaces depending on where they are implemented.

The important architectural point is not the exact interface matrix alone, but that startup behavior is typed and structured rather than improvised.

A compact mental model is:

- **Module Main** handles a module’s own loading lifecycle
- **Module Monkey** lets a module participate in app-wide hook timings
- **App Monkey** lets the project frontend config layer participate in the same hook system

## Module Main

A module can provide its own main lifecycle entrypoints.

Representative creation command:

```bash
npm run zova :init:main demo-student
```

Representative pattern:

```typescript
export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {}
}
```

## Module Monkey

A module can also provide broader app hook behavior through a monkey entry.

Representative creation command:

```bash
npm run zova :init:monkey demo-student
```

Representative pattern:

```typescript
export class Monkey
  extends BeanSimple
  implements IMonkeyModule, IMonkeyAppInitialize, IMonkeyAppInitialized, IMonkeyAppReady, IMonkeyAppClose
{
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async appInitialize() {}
  async appInitialized() {}
  async appReady() {}
  async appClose() {}
}
```

## App Monkey

Project-level app lifecycle customization can be placed in the frontend config area.

This is useful when startup behavior belongs to the application as a whole rather than to one module.

Representative creation command:

```bash
npm run zova :init:appMonkey
```

Representative file location:

```text
src/front/config/monkey.ts
```

## Practical interpretation of the phases

A useful rule of thumb is:

- use the earliest timing that still satisfies the need
- reserve later timings for behavior that depends on earlier framework or module setup already being finished

That keeps initialization extensible without creating unnecessary ordering coupling.

A representative lifecycle interpretation is:

- `appInitialize` for the earliest app-level service setup
- `appInitialized` when other modules should be able to react to the initialized state
- `appReady` for behavior that depends on the app becoming operational, such as final router-facing readiness
- `appClose` for teardown and listener cleanup

## Relationship to routing and guards

Startup timing is closely related to frontend routing and guards, because route services and route-guard behavior often need to be initialized before the app is considered ready.

The legacy startup docs explicitly used the router module as the core example:

- `appInitialize` as an early route-guard service setup point
- `appInitialized` as the point where route-guard events can begin involving other business modules
- `appReady` as the point where Vue Router can be injected and initial navigation can run
- `appClose` as the teardown point for route-guard listeners

Read this guide together with [Navigation Guards Guide](/frontend/navigation-guards-guide) when route lifecycle is involved.

## Relationship to environment/config selection

The chosen scripts, mode, appMode, and flavor determine which config and env values are active while startup hooks run.

Read this guide together with [Environment and Config Guide](/frontend/environment-config-guide).

## Why this matters for AI workflows

When AI edits frontend startup behavior, it should ask:

1. does this logic belong to app startup or system startup?
2. what is the earliest safe hook timing for this behavior?
3. should the logic live in module main, module monkey, or app monkey?
4. does the behavior depend on routing, SSR, or environment-specific config already being ready?

That helps AI place initialization logic correctly instead of pushing everything into one late-stage bootstrap step.
