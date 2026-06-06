# Backend Startup Guide

## Why backend startup matters

Vona treats startup as a first-class backend runtime capability rather than as ad hoc boot code scattered across modules.

That matters because distributed backend systems need a predictable way to run initialization logic:

- once for the whole application
- once for each initialized instance
- before or after the main runtime becomes ready
- with explicit ordering and environment scoping

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

## Inspect the effective startup list

You can inspect the currently effective startup list:

```typescript
this.bean.onion.startup.inspect();
```

This is useful when you need to debug which startup beans are active after config overrides, metadata filters, and ordering rules are applied.

## Built-in startup roles

Some built-in startup behaviors are especially important to understand:

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

## Relationship to election, queue, and schedule

Read this guide together with:

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Election Guide](/backend/election-guide)
- [Queue Guide](/backend/queue-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Worker Guide](/backend/worker-guide)
- [Broadcast Guide](/backend/broadcast-guide)

A practical split is:

- startup decides *when backend capabilities are initialized*
- election decides *which worker should own a standalone responsibility*
- queue decides *how background point-to-point jobs run*
- schedule decides *when recurring jobs run once the runtime is ready*

## Why this matters for AI workflows

When AI edits backend startup-sensitive code, it should ask:

1. is this initialization logic app-wide or instance-specific?
2. does the logic need to run before or after the ready phase?
3. should ordering be expressed through `dependencies` or `dependents`?
4. should the startup be gated by `mode`, `flavor`, or app-config overrides?

That helps AI keep backend initialization aligned with Vona’s distributed runtime model.
