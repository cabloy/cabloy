# ORM Select Guide

This guide explains how ORM select operations work in Vona within the Cabloy monorepo.

## Why select operations matter

Select operations are where model definitions, relationships, filters, ordering, pagination, and caching behavior begin to interact.

Vona does not treat queries as untyped string fragments. It provides a richer model-aware query surface.

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

`select` can combine:

- `distinct`
- `columns`
- `where`
- `joins`
- `orders`
- `offset`
- `limit`
- `include`
- `with`

Representative pattern:

```typescript
await this.scope.model.post.select(
  {
    columns: ['id', 'title', 'userId'],
    where: {
      id: { _gt_: 1 },
      'testVonaUser.id': 1,
    },
    joins: [['innerJoin', 'testVonaUser', ['userId', 'testVonaUser.id']]],
    offset: 0,
    limit: 20,
    orders: [['createdAt', 'desc']],
  },
  {
    disableDeleted: false,
  },
  'test-vona:user',
);
```

This matters because Vona ORM encourages structured query building rather than ad hoc query scattering.

## Query options

Representative option areas include:

- `disableDeleted`
- `disableCreateTime`
- `disableUpdateTime`
- `disableCacheQuery`
- `disableCacheEntity`
- `deleted`

This is important because select behavior may depend on caching and soft-deletion policy, not only on columns and filters.

## `joins`, `include`, and `with`

A useful distinction is:

- `joins` shapes table-level join behavior
- `include` loads declared static relations
- `with` loads dynamic relations declared at the usage site

That means joins are not floating SQL trivia. They are part of a model-aware query system that can move between table-level control and relation-level convenience.

## Type-guided joins

A key insight is that joinable tables often come from relationships already declared on the model.

In broader systems, not every useful join is declared on the current model. In those cases, the `_modelJoins` parameter can provide additional model hints so the join surface remains typed and discoverable.

## `where` operators

The operator model is broad and includes examples like:

- `_eq_`
- `_notEq_`
- `_gt_`
- `_gte_`
- `_lt_`
- `_lte_`
- `_in_`
- `_notIn_`
- `_is_`
- `_isNot_`
- `_between_`
- `_notBetween_`
- `_startsWith_`
- `_endsWith_`
- `_includes_`
- case-insensitive variants
- `_ref_`
- `_skip_`

That operator vocabulary is part of the Cabloy data language and should be reused consistently.

### `_skip_`

`_skip_` is especially useful when building query objects compositionally.

Representative pattern:

```typescript
const where = {
  title: { _includes_: 'ai' },
  stars: { _gt_: 20 },
};

await this.scope.model.post.select({
  where: {
    ...where,
    stars: '_skip_' as const,
  },
});
```

This lets a query builder remove one condition cleanly without rebuilding the whole `where` object by hand.

## Joint operators and subqueries

The query language also supports joint operators such as:

- `_and_`
- `_or_`
- `_not_`
- `_exists_`
- `_notExists_`

These operators matter because many real queries are not flat field comparisons.

Representative `_exists_` pattern:

```typescript
await this.scope.model.post.select({
  where: {
    _exists_: function (builder: Knex.QueryBuilder) {
      builder
        .select('*')
        .from('testVonaPostContent')
        .where('postId', this.scope.model.post.ref('testVonaPost.id'));
    } as any,
  },
});
```

## `raw` and `ref`

The structured query language is the default, but Vona still exposes escape hatches when they are truly needed.

Representative `raw` pattern:

```typescript
await this.scope.model.post.select({
  where: this.scope.model.post.raw('?? > ?', ['stars', 20]) as any,
});
```

Representative `ref` pattern:

```typescript
await this.scope.model.post.select({
  where: {
    title: {
      _eq_: this.scope.model.post.ref('testVonaPost.title') as any,
    },
  },
});
```

A practical rule is:

- start with structured operators first
- use `ref` when comparisons need identifier semantics
- use `raw` only when the structured surface is not sufficient

## Relationship to aggregate/group and DTOs

Read this guide together with:

- [Relations Guide](/backend/relations-guide)
- [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)

A practical split is:

- use this guide for row-oriented query structure
- use the aggregate/group guide when the result shape is summary-oriented
- use DTO guidance when query shape must become an explicit API contract

## Why this matters for AI workflows

When AI writes or edits select logic, it should:

1. start from model relationships and typed query structure
2. choose deliberately among `joins`, `include`, and `with`
3. prefer the ORM query surface before dropping to raw SQL
4. remember that soft-delete, cache, and datasource behavior may affect query semantics
5. think about whether the query shape should also drive DTO or OpenAPI-facing output

That keeps query logic aligned with Vona’s intended abstractions.
