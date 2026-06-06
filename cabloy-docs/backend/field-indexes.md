# Field Indexes

This guide explains how field indexes work in Vona within the Cabloy monorepo.

## Why field indexes are a first-class concept

Vona provides a framework-level mechanism for declaring field indexes and having the system create them automatically.

That is important because indexing is not treated as an afterthought. It is part of module metadata.

## `meta.index`

Vona uses a bean named `meta.index` to configure a module’s field indexes.

Create it with:

```bash
npm run vona :create:bean meta index -- --module=demo-student
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
    demoStudent: 'name',
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
    ...$tableColumns('demoStudent', 'name'),
  },
})
class MetaIndex {}
```

This is especially valuable for maintainability because it reduces stringly-typed drift.

## App-config override support

Field indexes can also be configured through app config.

That means index behavior participates in the broader configuration system rather than being locked into one metadata file only.

## Why this matters for AI workflows

When AI changes persistence design, it should not stop at entity fields and model methods.

It should also ask:

1. does this access pattern need an index?
2. should the index belong in `meta.index`?
3. is the typed style a better fit than raw string declarations?

That leads to backend changes that are more production-aware and more aligned with Vona’s module metadata model.
