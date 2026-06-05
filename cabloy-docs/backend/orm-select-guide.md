# ORM Select Guide

This page migrates the highest-value ideas from the legacy Vona ORM select documentation.

## Why select operations matter

Select operations are where model definitions, relationships, filters, ordering, pagination, and caching behavior begin to interact.

The legacy docs show that Vona does not treat queries as untyped string fragments. It provides a richer model-aware query surface.

## Basic select operations

Representative patterns:

```typescript
await this.scope.model.post.select();
await this.scope.model.post.count();
await this.scope.model.post.selectAndCount();
await this.scope.model.post.get({ id });
await this.scope.model.post.mget(ids);
```

These operations show the basic query vocabulary that services can build on.

## Rich select parameters

The legacy docs show that `select` can combine:

- `columns`
- `where`
- `joins`
- `orders`
- `offset`
- `limit`
- `include`
- `with`

This matters because Vona ORM encourages structured query building rather than ad hoc query scattering.

## `where` operators

The legacy docs also define a broad operator model, including examples like:

- `_eq_`
- `_gt_`
- `_lt_`
- `_in_`
- `_includes_`
- case-insensitive variants
- `_between_`
- `_skip_`

That operator vocabulary is part of the Cabloy data language and should be reused consistently.

## `joins` and relationships

A key legacy insight is that joinable tables often come from the relationships already declared on the model.

That means joins are not floating SQL trivia. They are downstream from model relationship design.

## Query options

Representative option areas include:

- `disableDeleted`
- `disableCacheQuery`
- `disableCacheEntity`
- `deleted`

This is important because select behavior may depend on caching and soft-deletion policy, not only on columns and filters.

## Why this matters for AI workflows

When AI writes or edits select logic, it should:

1. start from model relationships and typed query structure
2. prefer the ORM query surface before dropping to raw SQL
3. remember that soft-delete and cache behavior may affect the query semantics
4. think about whether the query shape should also drive DTO or OpenAPI-facing output
