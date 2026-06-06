# ORM Configuration Guide

## Why ORM configuration matters

Vona ORM is not only shaped by model code. It is also shaped by framework-level configuration in the `a-orm` module.

That matters because ORM behavior depends on more than query syntax alone:

- table identity strategy
- model defaults
- soft-deletion cleanup
- supported database dialects
- two-layer cache behavior

## Configure the `a-orm` module

ORM configuration lives under `config.modules['a-orm']`.

Representative pattern:

```typescript
config.modules = {
  'a-orm': {
    table: {
      identityType: 'bigint',
    },
    softDeletionPrune: {
      enable: true,
    },
  },
};
```

This is the main backend-level control surface for framework-wide ORM behavior.

## Main configuration areas

The most important ORM config areas are:

- `table`
- `model`
- `softDeletionPrune`
- `dialects`
- `summer`

A representative framework config shape is:

```typescript
config.modules = {
  'a-orm': {
    table: {
      identityType: 'bigint',
    },
    model: {
      disableDeleted: false,
      disableInstance: false,
      disableCreateTime: false,
      disableUpdateTime: false,
    },
    softDeletionPrune: {
      enable: true,
      expired: 14 * 24 * 3600 * 1000,
    },
    dialects: {
      mysql: 'a-ormdialect.databaseDialect.mysql',
      mysql2: 'a-ormdialect.databaseDialect.mysql3',
      pg: 'a-ormdialect.databaseDialect.pg',
    },
    summer: {
      enable: true,
      presetDefault: 'redis',
      redis: {
        client: 'model',
      },
    },
  },
};
```

## `table.identityType`

`table.identityType` controls the type of the primary `id` field, such as:

- `number`
- `bigint`

This matters because identity shape propagates into entity typing, DTO typing, and model-facing contracts.

## `model` defaults

The `model` block provides broad defaults for ORM behavior.

Representative concerns include:

- `disableDeleted`
- `disableInstance`
- `disableCreateTime`
- `disableUpdateTime`

A useful ownership rule is:

- model config establishes framework-wide defaults
- model metadata can specialize a specific model
- method options can still override behavior at the usage site when needed

That is why ORM behavior should be understood as layered configuration rather than as one fixed decorator-only setting.

## `softDeletionPrune`

Soft deletion is not only about marking a row as deleted. It also has a cleanup lifecycle.

The `softDeletionPrune` block controls:

- whether prune is enabled
- how long deleted data is retained before prune

This matters because teams often need a deliberate retention window for recoverability, audits, or operational cleanup.

## `dialects`

The `dialects` block defines the supported database dialect adapters.

This is important because ORM behavior is framework-level and must remain portable across different backend database engines rather than assuming one hardcoded SQL target.

## `summer` and two-layer cache behavior

The `summer` block controls two-layer cache behavior for ORM workloads.

Representative concerns include:

- whether cache is enabled
- which preset is the default
- which Redis client should back the model cache path

This matters because ORM query behavior, cache behavior, and invalidation expectations are part of one data-system design.

For surrounding cache concepts, also see [Cache Guide](/backend/cache-guide).

## Relationship to model and query behavior

Read this guide together with:

- [ORM Guide](/backend/orm-guide)
- [Model Guide](/backend/model-guide)
- [ORM Select Guide](/backend/orm-select-guide)
- [ORM Mutation Guide](/backend/orm-mutation-guide)
- [Cache Guide](/backend/cache-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)

A practical split is:

- ORM configuration defines framework-wide defaults and infrastructure behavior
- model metadata defines model-local behavior
- select/mutation calls decide the per-operation query and write shape

## Why this matters for AI workflows

When AI edits ORM-sensitive backend code, it should ask:

1. is this behavior controlled by app-level ORM config, model metadata, or a usage-site option?
2. does the change affect identity type, soft deletion, or timestamp behavior?
3. does the cache path depend on `summer` settings?
4. does a database-engine assumption actually belong in the dialect layer instead?

That helps AI keep ORM behavior aligned with Vona’s layered configuration model.
