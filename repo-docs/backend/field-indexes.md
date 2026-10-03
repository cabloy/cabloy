# Field Indexes

This guide explains how field indexes work in Vona within the Cabloy monorepo.

## Why field indexes are a first-class concept

Vona provides a framework-level mechanism for declaring field indexes and having the system create them automatically.

That is important because indexing is not treated as an afterthought. It is part of module metadata.

## `meta.index`

Vona uses a bean named `meta.index` to configure a module’s field indexes.

Create it with:

```bash
npm run vona :create:bean meta index -- --module=training-student
```

Representative shell:

```typescript
@Meta()
export class MetaIndex extends BeanBase {}
```

## Configure indexes: direct style

Representative pattern:

```typescript
@Meta({
  indexes: {
    trainingStudent: 'name',
  },
})
class MetaIndex {}
```

This expresses:

- table name
- field name or field-name list

## Configure indexes: typed style

A typed style is also supported:

```typescript
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta({
  indexes: {
    ...$tableColumns('trainingStudent', 'name'),
  },
})
class MetaIndex {}
```

This is especially valuable for maintainability because it reduces stringly-typed drift.

### Multiple indexes on one table

Declare each table only once in an `indexes` object, whether using direct properties or `$tableColumns`. The helper returns one property keyed by the table name; spreading multiple calls for the same table overwrites earlier values rather than combining them. Put all specifications for that table in one array:

```typescript
@Meta({
  indexes: {
    ...$tableColumns('payPaymentSession', [
      'businessReference',
      'providerCorrelationReference',
      'state+expiresAt',
    ]),
  },
})
class MetaIndex {}
```

Each array entry defines a separate index. In this example, the first two entries are independent single-column indexes; `state+expiresAt` defines one composite index, with `state` as its leading column. An array such as `['state', 'expiresAt']` would instead define two single-column indexes. The typed helper accepts arrays containing both single-column fields and two-column `+` specifications.

### Generated names and verification

The current index reconciler names an index `idx_<table>_<first-column>` and checks existing indexes by that leading column. Two intended indexes with the same leading column, such as `state+expiresAt` and `state+nextAttemptAt`, can therefore collide or leave one uncreated. Do not change column order merely to avoid a naming collision: order is part of the query access pattern. Inspect the resulting definitions, not just whether initialization succeeded.

## App-config override support

Field indexes can also be configured through app config.

That means index behavior participates in the broader configuration system rather than being locked into one metadata file only.

## Shared-database multitenancy and business uniqueness

Ordinary indexes in `meta.index` improve lookup and query performance. They do not define a business uniqueness rule.

In shared-database multitenancy, do not use `table.unique(...)` for tenant-scoped business uniqueness. A database-wide unique constraint can reject the same business value when it belongs to a different tenant.

Keep the ordinary indexes needed by the access pattern, and enforce the tenant-scoped uniqueness rule in tenant-aware business logic.

## Implementation checks for persistence changes

When changing persistence design, do not stop at entity fields and model methods.

Also ask:

1. does this access pattern need an index?
2. should the index belong in `meta.index`?
3. does a business key need tenant-scoped uniqueness, to be enforced in tenant-aware business logic rather than with `table.unique(...)`?
4. is the typed style a better fit than raw string declarations?
5. does each table have one effective declaration containing every intended index specification, without conflicting leading columns?
6. do the resulting database indexes have the intended columns in the intended order? Check both registered metadata and physical index definitions; a passing type check or successful initialization alone does not establish this.

That leads to backend changes that are more production-aware and more aligned with Vona’s module metadata model.

## Where to read next

- If you want the broader persistence-side source-reading chooser, continue with [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap).
- If you are deciding how indexed fields relate to backend persistence truth, continue with [Entity Guide](/backend/entity-guide).
- If the index question is part of a persisted-schema change, continue with [Migration and Changes](/backend/migration-and-changes).
