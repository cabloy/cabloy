# Multi-Instance and Instance Resolution

This guide explains how multi-instance behavior works in Vona within the Cabloy monorepo.

## Why this matters

In Vona, backend runtime behavior is not always global-only.

A backend application may need:

- a shared default instance
- named instances for tenant-like separation
- isolated instances with their own datasource routing
- instance-aware config, startup, and model behavior

That is why multi-instance behavior should be understood as part of the backend runtime/config family, not only as an ORM detail.

## Three practical layers

A useful mental model is:

- runtime and config decide how instances are declared
- request context decides which instance is active
- model and datasource behavior decide how that instance affects persistence

## Instance config shape

In the current runtime, instance behavior is configured under `config.instance`.

Representative shape:

```typescript
config.instance = {
  getInstanceName: undefined,
  queryField: $protocolKey('x-vona-instance-name'),
  headerField: $protocolKey('x-vona-instance-name'),
  instances: {
    '': { password: '', title: '' },
    'shareTest': { password: '', title: '' },
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

The important fields are:

- `getInstanceName`
- `queryField`
- `headerField`
- `instances`
- per-instance options such as `id`, `isolate`, `isolateClient`, and `config`

## Shared instance vs isolated instance

A practical distinction is:

- a **shared** instance participates in the normal shared datasource strategy
- an **isolated** instance can route to its own datasource through `isolateClient`

This means multi-instance behavior is not only a naming concern. It can materially change which database path the backend uses.

## How the active instance name is resolved

In the current runtime, the instance name is resolved in this order:

1. `getInstanceName(ctx)` if provided
2. the configured query field
3. the configured header field
4. subdomain-derived instance name

This matters because request routing, config, and datasource behavior may all depend on the resolved instance name.

A special case is also supported:

- `'null'` is normalized to `null`

A practical fallback rule is:

- subdomain-based instance resolution only becomes relevant if custom getter, query-field, and header-field resolution did not already determine the instance name

## Instance edge cases to remember

A few current-runtime edge cases are worth remembering:

- disabled instances can be declared with `false`
- isolated instances require an explicit `id`
- instance-name resolution is cached on the current context once determined
- the instance record can be created or refreshed through the instance service before the effective config is cached

## What context exposes

Once instance resolution is active, the request context can expose:

- `ctx.instanceName`
- `ctx.instance`
- `ctx.config`

A practical distinction is:

- `ctx.instanceName` identifies the active instance
- `ctx.instance` is the loaded instance record
- `ctx.config` is the effective config merged for that instance-aware context

That means request-scoped backend code can stay instance-aware without manually reassembling config or routing rules.

## How instance config affects effective backend config

This page owns the request-context and instance-aware merge view. For env-file precedence and mode/flavor selection, see [Runtime and Flavors](/backend/runtime-and-flavors). For the broader config-layering surface, see [Config Guide](/backend/config-guide).

In the current runtime, instance-aware config is built by merging:

1. `app.config`
2. static config under `config.instance.instances[instanceName].config`
3. any persisted config stored on the instance record

This is why instance behavior belongs partly to config docs and partly to runtime docs.

A practical merge-order mental model is:

1. start from `app.config`
2. merge static instance config from `config.instance.instances[instanceName].config`
3. merge persisted config stored on the instance record
4. expose the result through `ctx.config`

For the broader config-layering story, also see [Config Guide](/backend/config-guide).

## How instance affects startup behavior

Startup is also instance-aware.

A practical split is:

- app startup handles backend-wide initialization
- instance startup handles per-instance initialization after the app is ready for instances

In the current runtime:

- `test` and `dev` eagerly start the default instance
- production-style flows iterate configured static instances
- instance startup work is queued and coordinated so one instance can initialize cleanly

For the lifecycle view, also see [Backend Startup Guide](/backend/startup-guide).

## How instance affects datasource selection

One of the most important multi-instance consequences is datasource routing.

In the current runtime, datasource selection can work like this:

1. use an explicit datasource when code names one
2. otherwise use the configured default datasource
3. if the active instance is isolated, let `isolateClient` override that default

This is why instance isolation should be understood together with datasource strategy rather than documented as an unrelated feature.

For the datasource view, also see [Multi-Database and Datasource Guide](/backend/multi-database-datasource).

## How instance affects model behavior

Ordinary model operations are instance-aware by default.

That means:

- normal model flows participate in instance filtering
- instance-aware config and startup can influence model behavior indirectly
- `disableInstance` changes semantics and should be used deliberately

For the model-layer perspective, also see [Model Guide](/backend/model-guide).

## Relationship to runtime and config docs

Read this guide together with:

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Model Guide](/backend/model-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)

## Implementation checks for instance-resolution changes

When editing backend runtime, datasource, or tenant-like behavior, ask:

1. how is the current instance name resolved?
2. is the task about shared-instance behavior or isolated-instance behavior?
3. should the logic read `app.config` or `ctx.config`?
4. does instance startup or instance config need to change as well?
5. does datasource routing change indirectly through `isolateClient` even if no model call names a client explicitly?

That keeps multi-instance behavior aligned with the current Vona runtime rather than treating it as a loose convention.
