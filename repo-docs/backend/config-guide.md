# Config Guide

## Why config matters as a backend scope resource

In Vona, configuration is not only a global backend settings concern. It is also a module-scoped resource that can be defined close to a module and then accessed through scope.

That matters because backend capabilities often need both:

- reusable module-local defaults
- project-level overrides for the current application
- runtime-sensitive configuration chosen by mode, flavor, and instance

## Initialize the config skeleton

Example: initialize config for module `training-student`.

```bash
npm run vona :init:config training-student
```

This gives the module its own config file under the module’s config area.

## Define module config

Representative pattern:

```typescript
export function config(_app: VonaApplication) {
  return {
    title: 'Hello World',
  };
}
```

The important point is that module config fields are declared directly, and the framework extracts the config typing from that shape.

## Use config within the current module

The current module’s config can be accessed through scope.

Representative pattern:

```typescript
console.log(this.scope.config.title);
```

This keeps config access aligned with the same module-resource model used for service, model, entity, locale, and error.

## Use config across modules

Cross-module config access uses the cross-module scope surface.

Representative pattern:

```typescript
console.log(this.$scope.trainingStudent.config.title);
```

A practical distinction is:

- `this.scope.config` for the current module
- `this.$scope.<module>.config` for another module

## Project config is layered, not single-file

At the application level, Vona config is assembled from a cascading set of config files.

In the current repo, representative project config files include:

- `config.ts`
- `config.dev.ts`
- `config.dev.play.ts`
- `config.test.ts`
- `config.prod.ts`
- `config.dev.local.ts`
- `config.test.local.ts`
- `config.prod.local.ts`
- `config.local.tsx`

That means effective config is built by merging general config with more specific runtime/flavor/local layers.

A practical mental model is:

1. start from the shared base config
2. merge mode-specific config
3. merge flavor-specific config when present
4. merge local override config last

This is one of the main reasons backend config should be understood together with [Runtime and Flavors](/backend/runtime-and-flavors).

## Async config loading is normal

In the current Vona startup flow, project config items are loaded asynchronously and then deep-merged.

That means async config is a normal part of the framework model rather than a special workaround.

A practical implication is:

- config can safely derive values from runtime information, filesystem state, or other async setup needs during config assembly

## How runtime env and flavor affect config

Runtime metadata does not only choose env files. It also participates directly in config assembly.

In the current app config, representative fields derived from env/meta include:

- `config.meta.mode`
- `config.meta.flavor`
- `config.server.workers`
- `config.server.listen.*`
- `config.server.serve.*`
- `config.database.defaultClient`
- logger, Redis, and mail client settings

That means config selection and runtime selection are part of one continuous flow rather than two unrelated systems.

## Override module config at the project level

Project-level config can override module-level defaults.

Representative pattern:

```typescript
config.modules = {
  'training-student': {
    title: 'Hello World!!',
  },
};
```

This is the key ownership rule:

- module config defines reusable defaults close to the module
- project config overrides those defaults for the current backend application

## Environment-specific decorator defaults

Reusable backend decorator/onion option defaults belong to the provider or bean that declares them. When those defaults differ by runtime mode, use module-level `const app = useApp()` and select the default directly in the decorator configuration, rather than adding an application `config.test.ts` entry just to supply the capability's own default behavior.

Representative SMS captcha provider configuration (cooldown values are in milliseconds):

```typescript
import type { IDecoratorCaptchaProviderOptions } from 'vona-module-a-captcha';

import { BeanBase, useApp } from 'vona';
import { CaptchaProvider } from 'vona-module-a-captcha';

const app = useApp();

export interface ICaptchaProviderOptionsSms extends IDecoratorCaptchaProviderOptions {
  cooldown?: number;
}

@CaptchaProvider<ICaptchaProviderOptionsSms>({
  enable: true,
  ttl: 300000,
  cooldown: app.meta.isTest ? 3000 : 30000,
})
export class CaptchaProviderSms extends BeanBase {
  // Provider methods consume the effective options supplied by the framework.
}
```

The example shows the default configuration, not a complete provider implementation. A provider method reads `options.cooldown` from its effective options; the framework's configuration merging still allows explicit overrides, including `cooldown: 0`.

This keeps three responsibilities separate:

- the decorator owns the reusable baseline, including the test-mode default
- execution methods consume the effective options instead of supplying a second environment-dependent fallback
- application configuration, including `config.test.ts`, remains available for intentional overrides and test integration choices, such as enabling a scene or selecting a Mock provider

Do not turn this into a ban on test configuration or infer that every test-mode policy should be relaxed. Only move a value into the decorator when it is genuinely the provider's intended environment-specific default; keep security and business constraints intact. See [Controller and AOP Guide](/backend/controller-aop-guide#shared-configuration-patterns) for onion configuration and override patterns.

### Startup-time evaluation boundary

Decorator expressions are evaluated when the module is loaded, not on each request. This pattern is for backend bean modules loaded through the normal Vona application lifecycle, after the application has been created. `useApp()` returns the current application; it does not create it or wait for initialization.

Use startup-stable metadata such as `app.meta.isTest` here. Do not capture request, user, current-instance, or dynamically changing configuration in module-level defaults, and do not assume services are already ready. Scripts or standalone tests that import such modules must establish the application lifecycle first; bootstrap/config-loading code should use its supplied application argument rather than assume module-level `useApp()` is available.

## App config vs instance-merged config

One important Vona distinction is:

- `this.app.config` is the global application config
- `this.ctx.config` is the effective config for the current instance-aware request context

That matters in multi-instance or multi-tenant scenarios.

In the current runtime, instance config is assembled by merging:

1. the global app config
2. any static config under `config.instance.instances[instanceName].config`
3. any stored instance config data from the instance record

A practical interpretation is:

- use `app.config` when you need the backend-wide config baseline
- use `ctx.config` when behavior should respect the active instance

## Config access surfaces at a glance

| Access surface                | Typical meaning                                        |
| ----------------------------- | ------------------------------------------------------ |
| `app.config`                  | app-wide baseline config                               |
| `ctx.config`                  | effective config for the active instance-aware context |
| `this.scope.config`           | current-module config resource                         |
| `this.$scope.<module>.config` | another module’s config resource                       |

A practical rule is:

- use `scope` access when the task is about module-owned config
- use `app.config` when the task is about backend-wide baseline behavior
- use `ctx.config` when request-scoped behavior must respect the active instance

## Effective instance-aware config merge order

This page owns the config-layering view. For env-file precedence and mode/flavor selection, see [Runtime and Flavors](/backend/runtime-and-flavors). For the fuller request-context view of instance resolution and instance-aware config behavior, see [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).

In the current runtime, the effective instance-aware config can be understood at a high level like this:

1. start from the app-wide baseline config
2. merge static config from `config.instance.instances[instanceName].config`
3. merge any persisted config stored on the instance record
4. expose the merged result as `ctx.config`

That means `ctx.config` is not just a pointer to `app.config`. It is the instance-aware effective config surface.

## Instance config shape

Representative instance config shape in the current repo looks like:

```typescript
config.instance = {
  getInstanceName: undefined,
  queryField: $protocolKey('x-vona-instance-name'),
  headerField: $protocolKey('x-vona-instance-name'),
  instances: {
    '': { password: '', title: '' },
    'isolateTest': {
      password: '',
      title: '',
      id: 1000,
      isolate: true,
      isolateClient: 'isolateTest',
    },
  },
};
```

The key point is that instance configuration is part of the config system itself, not an external plugin layer.

## Config ownership layers

A useful backend mental model is:

- env files provide deployable runtime values
- project config translates and organizes those values into backend config
- module config provides reusable module-local defaults
- `config.modules[...]` overrides module-local defaults for the current app
- `config.instance.instances[...]` adds static per-instance behavior
- `ctx.config` is the effective instance-aware result seen by request-scoped code

This layered model is the safest way to reason about config changes in Cabloy.

`CORS_WHITE_LIST` is an example of a deployable environment value consumed directly by a framework middleware default. Configure deployment-specific browser origins in the active env layer; it is not a `config.modules[...]` field or instance-specific config. Use explicit `a-security:cors` configuration only when the application needs middleware behavior beyond the environment-provided origin list. See [Runtime and Flavors](/backend/runtime-and-flavors#configure-browser-cors-origins) for its format, browser-origin behavior, and env-file precedence.

## Relationship to startup, model, and datasource behavior

Config does not live in isolation. In many backend tasks, config interacts directly with:

- runtime environment and flavor
- startup lifecycle and startup bean overrides
- model options
- datasource defaults and isolated-instance routing

Read this guide together with:

- [Backend Essentials](/backend/backend-essentials)
- [Backend Foundation](/backend/foundation)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Backend Startup Guide](/backend/startup-guide)
- [Model Guide](/backend/model-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)

## Implementation checks for backend configuration changes

When editing backend configuration behavior, ask:

1. should this value live in env files, project config, or module config?
2. is the value consumed through current-module scope, cross-module scope, `app.config`, or `ctx.config`?
3. does the config depend on runtime mode, flavor, or instance?
4. is there already a module config skeleton or project config layer that should be extended instead of inventing a new pattern?
5. will a config change alter startup, datasource, or model behavior indirectly?

That helps AI keep backend configuration aligned with Vona’s module-resource model and current runtime layering.
