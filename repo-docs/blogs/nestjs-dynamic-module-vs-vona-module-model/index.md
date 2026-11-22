---
title: Why Cabloy/Vona Has No NestJS Dynamic Module
titleEn: Why Cabloy/Vona Has No NestJS Dynamic Module
subtitle: A Dynamic Module is not a more advanced way to write modules. It is a patch for the premise that a module is a compile unit. Once modules become namespaces and binding moves to resolution time, the patch has no reason to exist.
summary: Taking apart the four real needs behind forRoot / forRootAsync / register, this article compares them with Vona's global bean registry, standalone config pipeline, module load phases, and application lifecycle — explaining why the notion of a "dynamic module" never appears in Vona, and what that trade-off buys and gives up.
tags:
  - NestJS
  - Cabloy
  - Vona
  - IoC
  - Dependency Injection
  - Module System
  - TypeScript
  - Backend Architecture
slug: nestjs-dynamic-module-vs-vona-module-model-en
cover: ./cover-en-v1.png
date: 2026-11-14
---

# Why Cabloy/Vona Has No NestJS Dynamic Module

> NestJS builds a module definition before assembly; Vona never has a module definition to build.

Anyone who has used NestJS knows `forRoot()`. When wiring a database, a queue, or a config module, almost every third-party package offers a static method that takes your options:

```ts
@Module({
  imports: [TypeOrmModule.forRoot({ type: 'mysql', host: 'localhost' })],
})
export class AppModule {}
```

At first this looks like "the advanced way to write a module." After a while it becomes clear that it is a patch — a patch over the premise that a module definition must be known in advance.

Coming to Cabloy/Vona, many people look for the equivalent: components, configuration, and scaffolding are all there, but there is no such thing as a "dynamic module." The reason is not that it has not been built yet. It is that **the problem it solves does not exist in Vona**.

---

## 1. What a Dynamic Module Actually Does

Start with the minimal form. A dynamic module usually looks like this:

```ts
@Module({})
export class PayModule {
  static forRoot(options: PayModuleOptions): DynamicModule {
    return {
      module: PayModule,
      providers: [{ provide: PAY_OPTIONS, useValue: options }, PayService],
      exports: [PayService],
    };
  }

  static forRootAsync(options: PayModuleAsyncOptions): DynamicModule {
    return {
      module: PayModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: PAY_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        PayService,
      ],
      exports: [PayService],
    };
  }
}
```

Three traits matter:

1. The module class itself is an empty shell; `@Module({})` declares no providers.
2. The real `providers / exports / imports` are returned by a static method.
3. The return value is still a **module definition** — it is simply computed later.

In other words, a Dynamic Module is a deferred constructor for a module definition. It does not change what a module means; it changes **when the module definition is computed**.

---

## 2. Why NestJS Must Have This Layer

Because in NestJS a module is not "a directory of code" — it is **input to the container compiler**. `imports / providers / exports` must all be settled before `NestFactory.create()`, so the container can build the dependency graph, instantiate providers, and enforce visibility.

But the following information is unavailable when the `@Module` decorator is evaluated:

| Need                             | Typical case                                | Why a static decorator cannot express it               |
| -------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| Caller-supplied options          | Database URL, payment keys, tenant config   | The options belong to the consumer, not the library    |
| Async configuration              | Remote config center, secret manager        | Decorator evaluation is synchronous                    |
| Multiple instances of one module | Several DB connections, several queues      | One class has one set of module metadata               |
| Conditional provider sets        | An implementation set chosen by environment | The provider array depends on conditions not yet known |

These four look different, but share one root cause: **the module definition must be fixed before compilation, while the information that determines it is not complete before compilation**.

So the definition has to be lifted off the class and turned into a function, letting `forRoot / forRootAsync / register` fill it in during bootstrap. `forRootAsync` goes one step further and wraps "a definition that will be ready later" as an async provider.

Once you see this, the test for any other framework becomes obvious: **if the module is no longer compiler input, a Dynamic Module loses its ground to stand on.**

---

## 3. What a Vona Module Is

A Vona module consists of three things: a directory and package layout, the `vonaModule` metadata in `package.json`, and the namespace under which config, locales, and resources live.

```json
{
  "vonaModule": {
    "fileVersion": 1,
    "dependencies": {
      "a-core": "5.0.0",
      "a-orm": "5.0.0",
      "a-user": "5.0.0"
    },
    "onions": {
      "payProvider": { "scopeResource": true }
    }
  }
}
```

There is no `providers`, no `exports`, and no `imports`. A module does not declare what the container holds, and certainly not who may see it.

Beans are registered the moment their decorator runs. `createBeanDecorator` writes the class straight into the global `AppResource`, keyed by `{module}.{scene}.{name}`:

```ts
// excerpt
export function createBeanDecorator<T>(scene, options?, optionsPrimitive?, fn?) {
  return function (target) {
    const beanClass = target as unknown as Constructable;
    const module = parseModuleName(beanClass);
    const name = scene === 'scope' ? 'module' : undefined;
    const beanOptions = appResource.addBean({ module, scene, name, beanClass, options });
    fn?.(beanClass);
  };
}
```

The container is a flat two-level structure (app and ctx). Getting a bean is a lookup by name, and instantiation happens only on a miss:

```ts
// excerpt
_getBeanSelectorInner<T>(beanFullName: Constructable<T> | string, ...) {
  const beanOptions = appResource.getBean(beanFullName as any);
  if (!beanOptions) return null!;
  const fullName = beanOptions.beanFullName;
  const key = __getSelectorKey(fullName, withSelector, args[0]);
  if (this[SymbolBeanContainerInstances][key] === undefined) {
    this._newBeanInner(true, fullName, withSelector, ...args);
  }
  return this[SymbolBeanContainerInstances][key] as T;
}
```

A module provides only two things here: **ownership** (`moduleBelong`, which determines `this.scope`, config paths, and log labels) and **load order** (`vonaModule.dependencies`). It provides no visibility boundary, so the question "which providers does this module instance expose?" never arises.

The contrast in one line:

- A NestJS module = compile unit + DI boundary + visibility rules.
- A Vona module = code organization + a namespace for config and resources.

The former's module definition must be constructed ahead of time. The latter's "module definition" was never an object.

---

## 4. Requirement 1: Passing Config — Config Is Data, Not a Constructor Argument

`forRoot(options)` exists because options participate in provider construction. Vona removes configuration from module construction entirely: a module supplies defaults, and application config overrides them during the load phase.

A module's default config lives in `src/config/config.ts` and exports a function:

```ts
// a-file/src/config/config.ts
export function config(_app: VonaApplication) {
  return {
    file: {
      defaultProvider: 'file-native:native',
      public: false,
      upload: { maxSize: 20 * 1024 * 1024 },
    },
  };
}
```

During the module load phase (after the `moduleLoading` hook), the loader merges it into `app.config.modules[relativeName]`, with application config placed after the module defaults:

```ts
app.config.modules[module.info.relativeName] = deepExtend(
  {},
  configModule,
  app.config.modules[module.info.relativeName],
);
```

Application-level customization is written in the project config and overrides data:

```ts
// src/backend/config/config/config.ts
config.modules['a-file'] = {
  file: {
    defaultProvider: 'file-cloudflare:cloudflare',
  },
};
```

Modules that need environment separation go further. The ORM module, for example, layers dev / prod / test defaults inside its own `Main.moduleLoading()` and then puts application config on top:

```ts
export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {
    const _configDefault = await combineConfigDefault<ConfigDatabase>(
      this.app,
      configDefault,
      configDev,
      configProd,
      configTest,
    );
    this.app.config.database = deepExtend({}, _configDefault, this.app.config.database);
  }

  async moduleLoaded() {
    // extend Knex, expose ctx.db, etc.
  }

  async configLoaded(_config) {}
}
```

Note that `Main` is instantiated during the module load phase, while application config has already been loaded by then. So "passing config to a library module" in Vona is a **config merge**: fixed timing, clear direction (application over module defaults), no module definition regeneration required.

---

## 5. Requirement 2: Async — The Load Phase and Lifecycle Already Absorb It

The root cause of `forRootAsync` is that a module definition must be returned synchronously while its dependencies are asynchronous. Vona has no such constraint; the entire startup chain is asynchronous.

The startup order can be summarized as:

```text
appConfig → appLoad (moduleLoading → config/locale/error/constant → moduleLoaded) → appStart → appReady → appStarted
```

In the source, `Start.start()` runs `_start_appConfig`, `_start_appLoad`, `_start_appStart`, `_start_appReady`, `_start_appStarted` in order. Among them:

- A config item may return a Promise, and multiple items are evaluated in parallel with `Promise.all`;
- A module's `Main.moduleLoading()` and `Main.moduleLoaded()` are async and can read remote config, extend third-party libraries, and attach `ctx` properties;
- Application-level async initialization goes into `Monkey.appStart()` and `Monkey.appReady()`, invoked by the framework in module order.

```ts
export class Monkey extends BeanSimple implements IMonkeyAppStart, IMonkeyAppReady {
  async appStart() {
    await this.app.scope(__ThisModule__).service.startup.appStart();
  }

  async appReady() {
    await this.app.scope(__ThisModule__).service.startup.appReady();
  }
}
```

Database connections, queue consumers, and secret fetching — the things that must complete before serving traffic — live in `moduleLoaded` or `appStart`. They take no part in constructing a module definition, so there is no need for "a module definition that will be ready later."

NestJS's `forRootAsync` pushes asynchrony into the module definition; Vona puts asynchrony back into the startup flow. The latter already has explicit phases and ordering; the former exists to work around "the definition must be synchronous."

---

## 6. Requirement 3: Multiple Instances — No Module Instance, Only Bean Names

The other major use of Dynamic Modules is registering the same module multiple times: multiple databases, multiple queues, multiple tenants.

NestJS needs dynamic modules here because a module is a compile unit: one class has one set of metadata, and "one more copy" means generating a second module definition.

Vona has no "module instance" layer at all. Multiple implementations are simply **multiple beans registered side by side**, each with a unique fully qualified name:

| Domain   | Scene             | Implementations (each its own module)  |
| -------- | ----------------- | -------------------------------------- |
| Payments | `payProvider`     | `pay-stripe`, `pay-paypal`, `pay-mock` |
| Files    | `fileProvider`    | `file-native`, `file-cloudflare`       |
| Auth     | `authProvider`    | `auth-simple`, `auth-oauth`            |
| Captcha  | `captchaProvider` | `captcha-simple`                       |

A consumer does not receive a module instance. It receives a name, which is then converted into a bean full name:

```ts
@Bean()
export class BeanPayProvider extends BeanBase {
  get<N extends keyof IPayProviderRecord>(providerName: N) {
    const beanFullName = beanFullNameFromOnionName(providerName, 'payProvider');
    return this.app.bean._getBean(beanFullName as never);
  }
}
```

Even "multiple clients of the same implementation" does not require multiple modules. It is a `clients` map in config plus a `clientName`:

```ts
const clientOptions = options.clients?.[clientName];
const resolvedOptions = deepExtend(
  {},
  options.base,
  clientOptions,
  this.ctx?.state.payProviderClientOptions?.[`${providerName}/${clientName}`],
);
```

As a result, an API like `register()` — "register another copy of the module" — has nowhere to stand. There is no module object to instantiate again, only new bean names or new config keys.

---

## 7. Requirement 4: Conditional Providers and Module Customization

The last need is "decide what the container holds based on conditions." Vona handles it in two layers:

- **Registration time**: scene decorators register statically, so every implementation is in the registry;
- **Resolution time**: onion options `enable / match / ignore` decide whether an implementation is currently active, with `VonaConfig.onions` and `ctx.onionsDynamic` providing application-level and request-level switches.

Differentiated customization goes through `config` plus monkey hooks: `moduleLoading`, `moduleLoaded`, `configLoaded`, `appStart`, `appReady`, `appStarted`, `appClose`, `appClosed`. These hooks run in module order and change metadata, config, and resources — not "return a new module definition."

One point deserves emphasis: `vonaModule.dependencies` is used only for load order and minimum version constraints. It **creates no dependency-injection edges**. That is why a module can be added later, or referenced before it is assembled, without rearranging an assembly graph.

---

## 8. Side by Side

| Need                             | NestJS                              | Vona                                                 |
| -------------------------------- | ----------------------------------- | ---------------------------------------------------- |
| Pass options to a library module | `forRoot(options)`                  | Override `config.modules[name]`                      |
| Async configuration              | `forRootAsync`                      | The config pipeline is async itself                  |
| Multiple instances of one module | Register dynamic modules repeatedly | Multiple bean names + resolver / selector            |
| Conditional provider sets        | `register()` returns providers      | Static decorator registration + onion `enable/match` |
| Module visibility isolation      | `imports / exports`                 | None (single container, lookup by name)              |
| Customize an existing module     | Dynamic module options              | `config` overrides + monkey hooks                    |
| Dependency ordering              | Module import graph                 | `vonaModule.dependencies` (order/version only)       |
| Binding time                     | Before container compile            | On every `_getBean`                                  |

The last row is the summary. Once binding happens at resolution time, everything that "must be computed in advance" simply disappears.

---

## 9. The Cost

This design is not free. It just moves the cost to the other side.

**What NestJS buys** is an explicit dependency graph and visibility boundary: the provider set is static, module exports are obvious, and compile-time and static analysis can offer stronger guarantees. The price is that module definitions must be constructible in advance, which requires the Dynamic Module layer.

**What Vona buys** is zero assembly-order constraints and plug-and-play modules: a new implementation is just a new bean, switching implementations is just a config change, and modules create no static dependency edges. The price is that dependencies become a **name contract** — visibility and assembly correctness are not enforced by the compiler but rely on naming conventions, scope constraints, and tests.

If one day you genuinely need "multiple isolated DI graphs" (strongly isolated multi-tenancy, for example), Vona's answer is still not "register the module several times." It is to make isolation explicit with namespaces, separate container instances, and selectors. That path still does not pass through the concept of a dynamic module.

---

## 10. Summary

1. A Dynamic Module is a deferred constructor for a module definition, serving the premise that a module definition must be fixed before compilation;
2. Vona modules carry no DI-boundary or visibility responsibility. Beans are registered into a global registry by decorators and resolved by name, so there is no module definition to construct in advance;
3. The four needs — passing config, async config, multiple instances, conditional providers — are absorbed by config merging, the startup phases, multiple bean names, and onion filtering respectively;
4. This is not "Vona also implements dynamic modules." It is **removing the premise on which dynamic modules depend**.

The same reason explains why Vona's Provider Scene can replace NestJS's Dynamic Providers: once binding is deferred to resolution time, multiple implementations cost the dependency structure nothing.

---

## References & Source

### NestJS

- [NestJS Modules / Dynamic Modules](https://docs.nestjs.com/modules#dynamic-modules)
- [NestJS Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [NestJS Circular Dependency](https://docs.nestjs.com/fundamentals/circular-dependency)

### CabloyJS / Vona

- [Bean decorator: the registration entry](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/decorator/class/createBeanDecorator.ts)
- [Global bean registry AppResource](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/core/resource.ts)
- [BeanContainer: lookup by name and lazy instantiation](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/bean/beanContainer.ts)
- [Module config loading and merging](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/module/config.ts)
- [Module load pipeline ModuleLoader](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/module/loader.ts)
- [Startup phase orchestration Start](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/framework/start.ts)
- [Config layering combineConfigDefault](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/lib/core/config.ts)
- [Monkey / ModuleMain lifecycle hook types](https://github.com/cabloy/cabloy/blob/main/vona/packages-vona/vona-core/src/types/interface/monkey.ts)
- [a-orm: a real example of config layering in Main.moduleLoading](https://github.com/cabloy/cabloy/blob/main/vona/src/suite-vendor/a-vona/modules/a-orm/src/main.ts)
- [a-startup: Monkey.appStart / appReady](https://github.com/cabloy/cabloy/blob/main/vona/src/suite-vendor/a-vona/modules/a-startup/src/monkey.ts)
- [a-file: module default config example](https://github.com/cabloy/cabloy/blob/main/vona/src/suite-vendor/a-file/modules/a-file/src/config/config.ts)
- [a-pay: resolving a provider by name and multi-client config](https://github.com/cabloy/cabloy/blob/main/vona/src/suite-vendor/a-pay/modules/a-pay/src/bean/bean.payProvider.ts)
