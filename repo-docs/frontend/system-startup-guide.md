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

A compact mental model is:

- **Module Main Sys** handles a module’s own system-facing load/config lifecycle
- **Module Monkey Sys** lets a module participate in broader system-level hook timings
- **Sys Monkey** lets the project frontend config layer participate in the same system hook system

## Module Main Sys

A module can provide system-level main lifecycle entrypoints.

Representative creation command:

```bash
npm run zova :init:mainSys training-student
```

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

Representative creation command:

```bash
npm run zova :init:monkeySys training-student
```

Representative pattern:

```typescript
export class MonkeySys
  extends BeanSimple
  implements
    IMonkeyModuleSys,
    IMonkeySysInitialize,
    IMonkeySysInitialized,
    IMonkeySysReady,
    IMonkeySysClose
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

Representative creation command:

```bash
npm run zova :init:sysMonkey
```

Representative file location:

```text
src/front/config/monkeySys.ts
```

## Practical interpretation of the phases

A representative lifecycle interpretation is:

- `moduleLoading` for early module registration work such as route-table contribution
- `moduleLoaded` once the module is available to the broader system
- `configLoaded` when module or project config still needs inspection or mutation before readiness
- `sysInitialize` for the earliest system-wide initialization
- `sysInitialized` when other modules should be able to react to initialized system state
- `sysReady` for long-lived runtime behavior that depends on the system being fully operational
- `sysClose` for teardown of system-level resources

## Locale providers during system startup

Locale providers are static module resources registered at the Sys level, not dictionaries appended separately in each SSR request or app instance. The relevant initialization order is:

1. Initialize project locale overrides from the frontend locale map.
2. Merge and validate the root config, including enabled languages and the default.
3. Load startup module resources, including modules with `zovaModule.capabilities.locale: true`.
4. Install locale providers and register their `localesProvider` resources **before installing the first preload module**.
5. Continue with preload, monkey, and sync installation; on the server, install the remaining modules through the existing SSR path.
6. Run `sysInitialize`, `sysInitialized`, and `sysReady` after module initialization.

Resource import and module installation are different stages. Startup resources may already be imported together, but provider installation completes before preload installation begins. This makes provider text available at the preload consumer's supported initialization boundary without requiring page code or an app-level provider hook to register it again.

### Translation targets remain metadata-filtered

A provider's `modules` envelope names translation targets, not dependencies to import. Registration checks target membership in the active module metadata map:

- A target absent from that map, including a project-disabled module, is skipped.
- A target present in the map can receive translations even if it has not been imported or installed yet.
- Registering that dictionary does not import or install the target. Client-side lazy targets remain lazy; their later ordinary dictionaries cannot replace earlier provider values.

This does not mean all SSR modules are lazy: the existing server startup path imports and installs remaining modules independently of provider registration. Do not add blanket target dependencies or eager target imports merely to contribute translations. Providers themselves are selected by the locale capability and do not need `preload: true` just to register text.

Project overrides therefore precede providers, which precede ordinary target dictionaries. For the authoring layout, ownership rules, and exact fallback order, see [Module Scope](/frontend/module-scope#ordinary-dictionaries-and-language-providers). For language enablement, see [Environment and Config Guide](/frontend/environment-config-guide#locale-enablement-and-defaults). Resource registration does not enable a language or change the configured default.

### Development reload and reinitialization

Frontend provider changes use the existing full-reload / Sys-reinitialization path, including changes to imported per-target helper files and removal of contributions. Closing the Sys disposes its locale maps; initialization starts again with project overrides, providers, and ordinary dictionaries. This avoids retaining deleted keys through append-only merges.

Do not treat `localesProvider` as a live dynamic-registration API or mutate shared locale maps in app/request hooks. Changing source resources requires the normal reload or rebuild/restart lifecycle for the running mode. Switching the active language is a separate app-scoped operation over registered resources; it does not install new providers. Backend reload behavior and the shared resource conventions are described in [I18n Guide](/backend/i18n-guide).

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

This guide is the first half of the frontend startup story, and the system-level companion to [App Startup Guide](/frontend/app-startup-guide).

Use this guide for long-lived runtime setup such as route-table and config wiring, then read the app guide for the router-readiness and first-screen behavior that runs after that system wiring is in place.

The legacy system-start docs used route registration as the clearest example boundary:

- `moduleLoading` as an early point for registering module routes into the system routing table
- app startup only after that lower-level system wiring is in place

That distinction is especially important in SSR-capable systems, where app lifecycles can repeat while system-level route and config wiring should not.

If your main question is how this `app` versus `sys` lifecycle split participates in the broader state architecture of a large Vue application, read [State Architecture for Vue Developers](/frontend/state-architecture-for-vue-developers) together with [IoC and Beans](/frontend/ioc-and-beans).

A practical reading sequence is:

1. [Environment and Config Guide](/frontend/environment-config-guide)
2. this page for system wiring
3. [App Startup Guide](/frontend/app-startup-guide) for router/guard readiness
4. [Page Route Guide](/frontend/page-route-guide) for shell/layout behavior

## Implementation checks for system-startup changes

When editing frontend lifecycle behavior, ask:

1. is this a system concern or an app concern?
2. does it need `configLoaded`, `moduleLoading`, or one of the `sys*` phases?
3. should the logic live in module mainSys, module monkeySys, or sys monkey?
4. does SSR change whether the code should be system-scoped instead of request-scoped?

That helps AI place lifecycle logic in the correct layer instead of mixing system and app startup behavior together.
