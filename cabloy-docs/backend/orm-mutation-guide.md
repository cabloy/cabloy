# ORM Mutation Guide

This page migrates the highest-value ideas from the legacy Vona ORM insert/update/delete documentation.

## Why mutation operations matter

Mutation is where data shape, persistence behavior, soft deletion, and business rules intersect.

The legacy docs show that Vona ORM provides a structured mutation surface rather than forcing every change through raw SQL or hand-written branching.

## Basic mutation operations

Representative operations include:

- `insert`
- `insertBulk`
- `update`
- `updateBulk`
- `delete`
- `deleteBulk`

Representative examples:

```typescript
await this.scope.model.post.insert({ title: 'Post001' });
await this.scope.model.post.update({ id: 1, title: 'Post001-Update' });
await this.scope.model.post.delete({ id: 1 });
```

## `mutate` and `mutateBulk`

One of the most interesting legacy ideas is the `mutate` model.

Instead of forcing callers to choose insert/update/delete up front, Vona can infer the mutation kind from data characteristics.

Representative logic:

- no `id` → insert
- `id` present → update
- `id` present and `deleted: true` → delete

This is important because it gives the framework a higher-level mutation abstraction that can simplify business flows.

## Why this matters for AI workflows

When AI writes mutation logic, it should ask:

1. is this best expressed as explicit insert/update/delete?
2. or is `mutate` a cleaner fit for the business flow?
3. does the deletion behavior depend on Vona soft-delete semantics?
4. should the mutation contract be reflected in DTO or controller definitions too?

That helps keep write-path logic aligned with the ORM’s intended abstractions.
