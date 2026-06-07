# Backend Startup Guide

## Why backend startup matters

Vona treats startup as a first-class backend runtime capability rather than as ad hoc boot code scattered across modules.

That matters because distributed backend systems need a predictable way to run initialization logic:

- once for the whole application
- once for each initialized instance
- before or after the main runtime becomes ready
- with explicit ordering and environment scoping

## Startup is part of a larger lifecycle

In the current Vona runtime, backend startup sits inside a broader application lifecycle.

A practical sequence is:

1. app config is loaded and merged
2. modules are loaded
3. `appStart` hooks run
4. `appReady` hooks run
5. `appStarted` hooks run
6. shutdown hooks such as `appClose` and `appClosed` are available for teardown-sensitive logic

This is important because startup beans are not the only lifecycle surface in the backend.

## Two startup types

Vona supports two startup types:

- **app startup**
- **instance startup**

A useful mental model is:

- app startup runs for backend-wide runtime initialization
- instance startup runs for per-instance initialization in multi-instance or multi-tenant scenarios

This is one of the reasons backend startup belongs in the backend docs, not in the frontend app/system startup guides.

## Create a startup bean

Example: create a startup named `log` in module `demo-student`.

```bash
npm run vona :create:bean startup log -- --module=demo-student
```

Representative shape:

```typescript
@Startup()
export class StartupLog extends BeanBase implements IStartupExecute {
  async execute() {
    console.log('Current time: ', Date.now());
  }
}
```

The `execute()` method contains the initialization logic for that startup bean.

## Startup options

Representative pattern:

```typescript
@Startup({
  instance: false,
  after: false,
  debounce: true,
  transaction: false,
})
export class StartupLog {}
```

The most important options are:

- `instance`
- `after`
- `debounce`
- `transaction`

A practical interpretation is:

- `instance: false` means app-startup behavior
- `instance: true` means instance-startup behavior
- `after: false` runs before the relevant ready phase
- `after: true` runs after the relevant ready phase
- `debounce` prevents repeated startup execution when the runtime churns
- `transaction` wraps the startup logic in a database transaction when needed

## Configure startups in app config

Startup options can also be overridden through app config.

In the backend essentials model, startup is one bean scene, so startup configuration also follows the broader bean/onion naming and override conventions used across backend infrastructure.

Representative pattern:

```typescript
config.onions = {
  startup: {
    'demo-student:log': {
      after: false,
      debounce: true,
      instance: false,
      transaction: false,
    },
  },
};
```

That keeps startup policy configurable at deployment or project level rather than frozen only in decorator defaults.

## Control startup order

Startup ordering matters because backend initialization often depends on other runtime capabilities.

Two important ordering tools are:

- `dependencies`
- `dependents`

Representative patterns:

```typescript
@Startup({
  dependencies: 'a-web:listen',
})
class StartupLog {}
```

```typescript
@Startup({
  dependents: 'a-web:listen',
})
class StartupLog {}
```

Use `dependencies` when the current startup must run after another startup. Use `dependents` when the current startup must run before another startup.

## Enable or scope a startup

App config can disable a startup explicitly:

```typescript
config.onions = {
  startup: {
    'demo-student:log': {
      enable: false,
    },
  },
};
```

Startup decorators can also scope behavior by runtime metadata:

```typescript
@Startup({
  meta: {
    flavor: 'normal',
    mode: 'dev',
  },
})
class StartupLog {}
```

This matters because backend initialization often differs by environment, flavor, CI workflow, Docker workflow, or tenant-sensitive deployment mode.

For the underlying runtime dimensions, also see [Runtime and Flavors](/backend/runtime-and-flavors).

## Main hooks, monkey hooks, and startup beans are different surfaces

One of the most important lifecycle distinctions in the current Vona backend is that there are several different hook surfaces.

### Module main hooks

A module main can participate in module-level lifecycle hooks such as:

- `moduleLoading`
- `configLoaded`
- `moduleLoaded`

These are the right tools when a module needs to customize its own loading or config-processing behavior.

### Monkey hooks

Monkey hooks can participate in broader system lifecycle stages such as:

- `appStart`
- `appReady`
- `appStarted`
- `appClose`
- `appClosed`

Module monkey files can also receive module-oriented hook callbacks, and the app-level monkey file can coordinate app-wide lifecycle behavior.

Representative CLI workflow:

```bash
npm run vona :init:monkey demo-student
```

### Startup beans

Startup beans are the preferred lifecycle surface when the real goal is to run backend initialization work as part of the startup onion with ordering, metadata gating, transaction, and debounce support.

A practical rule is:

- use **main hooks** for module bootstrap customization
- use **monkey hooks** for deeper lifecycle interception
- use **startup beans** for normal backend initialization logic that should participate in startup ordering and runtime policy

## Hook surface matrix

| Surface          | Best for                                        | Ordering / policy support                                                                  | Teardown fit                                       |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Startup bean     | normal backend initialization work              | strong support through `dependencies`, `dependents`, `meta`, `debounce`, and `transaction` | not the main teardown surface                      |
| Module main hook | module bootstrap customization                  | tied to module load phases                                                                 | usually not the main teardown surface              |
| Monkey hook      | deeper lifecycle interception across app phases | follows lifecycle stage rather than startup-onion ordering                                 | strongest fit for `appClose` / `appClosed` cleanup |

This matrix is useful because the same backend task can look like “startup code” while actually belonging to different lifecycle surfaces.

## App startup and instance startup in practice

In the current runtime behavior:

- non-instance startups run during app startup / app ready phases according to `after`
- instance startups run when the app is ready for instances
- in `test` and `dev`, the default instance is started eagerly
- in production-style flows, configured static instances are started from `config.instance.instances`

A practical timeline is:

1. run non-instance startups with `after !== true` during app start
2. run non-instance startups with `after === true` during app ready
3. trigger instance startup for the relevant instance
4. run instance startups with `after !== true`
5. mark `appReadyInstances[instanceName] = true`
6. run instance startups with `after === true`

This is why startup should be read together with the instance and datasource story rather than as a purely global boot topic.

## Teardown-oriented monkey examples

Lifecycle hooks also matter when the backend is shutting down.

Representative current-runtime examples include:

- queue uses `appClose` to clear workers and `appClosed` to clear queues
- broadcast uses `appClose` to dispose the subscriber side and `appClosed` to dispose the publisher side
- SSR uses `appClose` to remove recorded SSR bean instances from the container

These are good examples of when shutdown-sensitive logic belongs to monkey hooks rather than startup beans.

## Inspect the effective startup list

You can inspect the currently effective startup list:

```typescript
this.bean.onion.startup.inspect();
```

This is useful when you need to debug which startup beans are active after config overrides, metadata filters, and ordering rules are applied.

## Built-in startup roles

Some built-in startup behaviors are especially important to understand.

### App-startup examples

Representative built-in app startup roles include:

- `a-version:databaseInit`
- `a-version:databaseName`
- `a-web:listen`

These show that startup is not only for custom business hooks. It is also part of the framework’s core runtime bootstrap.

### Instance-startup examples

Representative built-in instance startup roles include:

- `a-version:instanceInit`
- `a-printtip:printTip`
- `a-queue:loadQueueWorkers`
- `a-schedule:loadSchedules`

This is the key architectural point: startup is the lifecycle layer that activates other distributed capabilities such as queues and schedules.

## Relationship to config, instance, and datasource behavior

Startup should be read together with:

- [Config Guide](/backend/config-guide)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Model Guide](/backend/model-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
- [Election Guide](/backend/election-guide)
- [Queue Guide](/backend/queue-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Worker Guide](/backend/worker-guide)
- [Broadcast Guide](/backend/broadcast-guide)

A practical split is:

- startup decides _when backend capabilities are initialized_
- config decides _which startup behavior is enabled or overridden_
- instance config decides _which instance-specific startup flows exist_
- datasource behavior decides _which database context those startup flows run against_

For a practical distributed-runtime reading path, move from [Runtime and Flavors](/backend/runtime-and-flavors) and [Config Guide](/backend/config-guide) into this page, then continue to [Worker Guide](/backend/worker-guide), [Election Guide](/backend/election-guide), [Queue Guide](/backend/queue-guide), and [Schedule Guide](/backend/schedule-guide).

## Implementation checks for startup-sensitive changes

When changing backend startup-sensitive code, ask:

1. is this initialization logic app-wide or instance-specific?
2. should this be a startup bean, a module main hook, or a monkey hook?
3. does the logic need to run before or after the ready phase?
4. should ordering be expressed through `dependencies` or `dependents`?
5. should the startup be gated by `mode`, `flavor`, instance config, or app-config overrides?

That helps AI keep backend initialization aligned with Vona’s current runtime lifecycle rather than scattering boot logic across unrelated files.
