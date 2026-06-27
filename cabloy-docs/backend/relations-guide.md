# Relations Guide

This guide explains how ORM relations work in Vona within the Cabloy monorepo.

## Why relations matter

In Vona, relationships are not only for nicer reads. They shape:

- query composition
- nested CRUD behavior
- aggregate/group behavior on related data
- DTO inference
- OpenAPI-facing contract shape
- cross-model navigation in business code

That makes relations one of the most important bridges between persistence structure and fullstack contract design.

## Four relation kinds

Four main relation types are supported:

- `hasOne`
- `belongsTo`
- `hasMany`
- `belongsToMany`

Together they cover common `1:1`, `n:1`, `1:n`, and `n:n` structures.

## Static relations vs dynamic relations

A useful distinction is:

- **static relations** are declared in model metadata and reused across operations
- **dynamic relations** are declared at the usage site through `with`

A practical rule is:

- prefer static relations when the relation is part of the model’s stable business structure
- use dynamic relations when the relation is situational, cross-module, or too numerous to declare everywhere up front

## `hasOne`

Representative static definition:

```typescript
@Model({
  entity: EntityPost,
  relations: {
    postContent: $relation.hasOne('test-vona:postContent', 'postId', {
      columns: ['id', 'content'],
    }),
  },
})
class ModelPost {}
```

`hasOne` is important because the same relation can participate in:

- nested insert
- nested get
- nested update
- nested delete

through `include` or `with`.

## `belongsTo`

`belongsTo` is mainly a query-time relationship.

Representative pattern:

```typescript
const postContent = await this.scope.model.postContent.select({
  include: {
    post: true,
  },
});
```

That means it is especially useful for retrieving related parent-side data through model-aware query operations.

## `hasMany`

`hasMany` is especially important because it supports main-details structures, including scenarios where nested create/update/delete behavior happens together with the parent record.

Representative pattern:

```typescript
await this.scope.model.order.update(
  {
    id: orderCreate.id,
    orderNo: 'Order001-Update',
    products: [
      { name: 'Peach' },
      { id: orderCreate.products?.[0].id, name: 'Apple-Update' },
      { id: orderCreate.products?.[1].id, deleted: true },
    ],
  },
  {
    include: {
      products: true,
    },
  },
);
```

This is one of the strongest reasons Cabloy can express CRUD-oriented business flows compactly.

If the next question becomes specifically about aggregate-owned detail resources, nested-detail recursion, or nested detail DTO naming/placement, continue with [Master-Detail Workflow](/backend/master-detail-workflow).

If the next question becomes how a relation-aware DTO should keep a reusable named field surface instead of only inline relation columns, continue with [DTO Infer and Generation](/backend/dto-infer-generation), especially the `dtoClass` guidance.

## `belongsToMany`

`belongsToMany` models `n:n` relations through an intermediate model.

Representative definition:

```typescript
@Model({
  entity: EntityUser,
  relations: {
    roles: $relation.belongsToMany('test-vona:roleUser', 'test-vona:role', 'userId', 'roleId', {
      columns: ['id', 'name'],
    }),
  },
})
class ModelUser {}
```

The key point is that relation-aware CRUD here operates on the intermediate model, not directly on the target model.

## `include` vs `with`

A practical distinction is:

- use `include` when operating on a declared static relation
- use `with` when declaring a dynamic relation inline for the current operation

| Relation-loading style | Best for                                           | Typical source of truth      |
| ---------------------- | -------------------------------------------------- | ---------------------------- |
| `include`              | stable business relations reused across operations | model metadata               |
| `with`                 | situational, dynamic, or cross-module relations    | usage-site query or mutation |

Dynamic relations are especially useful when a model cannot reasonably declare every cross-module or situational relation in advance.

Representative static pattern:

```typescript
return this.scope.model.order.select({
  ...params,
  include: {
    products: true,
  },
});
```

Representative dynamic pattern:

```typescript
const postContent = await this.scope.model.postContent.select({
  with: {
    post: $relationDynamic.belongsTo(
      () => ModelPostContent,
      () => ModelPost,
      'postId',
      {
        columns: ['id', 'title'],
      },
    ),
  },
});
```

## Autoload and tree-shaped relations

`autoload: true` is useful when a relation should usually travel with the main model.

That is especially helpful for tree-shaped structures.

Representative idea:

- a self-referential `hasMany` relation with `autoload: true` can express parent-to-children trees
- a self-referential `belongsTo` relation with `autoload: true` can express reverse traversal from child to parent

A practical example is a category model whose `children` relation autoloads and only exposes the tree-oriented fields that usually matter for navigation, such as `id` and `name`.

This keeps tree-shaped domain structures inside the ORM relation model instead of hand-authoring traversal logic everywhere.

## Relation aggregation and grouping

Relations are not limited to row-oriented loading. They can also express aggregate- or group-oriented derived data.

Examples include:

- a dynamic `hasMany` relation with `aggrs`
- a dynamic `hasMany` relation with `groups` + `aggrs`
- static relations that autoload grouped or aggregated related summaries

That means relation metadata can shape reporting-style substructures as well as ordinary object graphs.

For deeper summary-query guidance, also see [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide).

## Relation options and datasource metadata

Representative relation option areas include:

- `autoload`
- `columns`
- `include`
- `with`
- `meta.client`
- `meta.table`
- `distinct`
- `where`
- `joins`
- `orders`
- `limit`
- `offset`
- `aggrs`
- `groups`

A particularly important advanced point is that `meta.client` and related datasource metadata can route relations across datasources.

That is why relation design must sometimes be read together with multi-datasource architecture rather than treated as a purely local model concern.

## Metadata regeneration

Relation changes require regenerating metadata.

That is important for AI workflows because relation changes are not purely local edits. They can affect type generation and downstream framework behavior.

## Relationship to ORM depth pages

Read this guide together with:

- [ORM Select Guide](/backend/orm-select-guide)
- [ORM Mutation Guide](/backend/orm-mutation-guide)
- [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
- [DTO Infer and Generation](/backend/dto-infer-generation)

## Implementation checks for model-relationship changes

When adding or editing model relationships, ask:

1. which relation kind actually matches the business structure?
2. should the relation be static metadata or a dynamic usage-site relation?
3. should the relation participate only in queries, or also in nested CRUD behavior?
4. does the relation carry grouped or aggregated derived data?
5. do metadata need to be regenerated?
6. does the relation change affect DTO inference, OpenAPI, or frontend integration?

That keeps relations aligned with the broader Cabloy contract system.
