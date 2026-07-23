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
      'id': { _gt_: 1 },
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

That operator vocabulary is part of the Cabloy data language and should be reused consistently.

A practical operator-family reading is:

- comparison: `_eq_`, `_notEq_`, `_gt_`, `_gte_`, `_lt_`, `_lte_`
- membership/range: `_in_`, `_notIn_`, `_between_`, `_notBetween_`
- null checks: `_is_`, `_isNot_`
- string matching: `_startsWith_`, `_endsWith_`, `_includes_`, and case-insensitive variants
- composition/subquery: `_and_`, `_or_`, `_not_`, `_exists_`, `_notExists_`
- identifier helper: `_ref_`

### Absent, `undefined`, and `null` in `where`

A direct `where` object distinguishes omitted conditions from SQL `NULL` checks:

| Field value                | Meaning                           |
| -------------------------- | --------------------------------- |
| Field is absent            | Do not add a condition            |
| Own field with `undefined` | Do not add a condition            |
| `Op.omit`                  | Explicitly do not add a condition |
| `null`                     | Match SQL `NULL` with `IS NULL`   |

An own `undefined` means the property exists on the JavaScript object but its value is `undefined`, such as `{ title: undefined }`. It has the same query result as an absent field, while `Op.omit` is the readable way to make that omission intentional in a dynamically composed query.

Representative pattern:

```typescript
import { Op } from 'vona-module-a-orm';

await this.scope.model.post.select({
  where: {
    title: undefined, // omitted
    stars: Op.omit, // explicitly omitted
    publishedAt: null, // SQL IS NULL
  },
});
```

The same direct-`where` rule applies to filters used by mutation, aggregate, and group operations.

That distinction also matters at the request-contract layer: omitting a nullable filter and passing a real `null` are different operations. When a query DTO needs `IS NULL` behavior from frontend query params, the parsing contract must explicitly preserve `null` instead of collapsing it to omission.

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

## `selectAndCount` and pagination-shaped results

`selectAndCount` is especially useful when one backend query should return both rows and pagination metadata together.

A practical result shape includes:

- `list`
- `total`
- `pageCount`
- `pageSize`
- `pageNo`

This matters because page-query contracts often need more than a plain row array. They need a stable list-plus-metadata response shape that can map directly into DTOs and controller response contracts.

## Relationship to aggregate/group and DTOs

Read this guide together with:

- [Relations Guide](/backend/relations-guide)
- [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)

A practical split is:

- use this guide for row-oriented query structure
- use the aggregate/group guide when the result shape is summary-oriented
- use DTO guidance when query shape must become an explicit API contract

## Implementation checks for ORM select changes

When writing or editing select logic:

1. start from model relationships and typed query structure
2. choose deliberately among `joins`, `include`, and `with`
3. prefer the ORM query surface before dropping to raw SQL
4. remember that soft-delete, cache, and datasource behavior may affect query semantics
5. think about whether the query shape should also drive DTO or OpenAPI-facing output

That keeps query logic aligned with Vona’s intended abstractions.
