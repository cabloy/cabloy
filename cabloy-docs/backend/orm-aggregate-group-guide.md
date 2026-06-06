# ORM Aggregate and Group Guide

## Why aggregate and group matter

Many backend queries do not need raw rows only. They need derived results such as counts, sums, averages, grouped totals, or grouped summaries attached to related records.

Vona ORM provides aggregate and group operations as typed model-level capabilities rather than forcing every summary query into ad hoc SQL.

## `count`

The simplest aggregate is `count`.

Representative pattern:

```typescript
const total = await this.scope.model.post.count();
```

A count operation can still depend on:

- `column`
- `distinct`
- `where`
- `joins`

So even the simplest summary query still participates in the wider ORM query model.

## `aggregate`

Use `aggregate` when the query should return one summary object.

Representative pattern:

```typescript
const result = await this.scope.model.post.aggregate({
  aggrs: {
    count: ['*', 'stars'],
    sum: 'stars',
    avg: 'stars',
    min: 'stars',
    max: 'stars',
  },
});
```

A useful mental model is:

- `aggrs` declares which aggregate functions should run
- Vona infers the returned shape from the aggregate declaration

Representative parameter areas include:

- `aggrs`
- `distinct`
- `where`
- `joins`

## `group`

Use `group` when the query should return grouped rows instead of one summary object.

Representative pattern:

```typescript
const result = await this.scope.model.post.group({
  groups: 'userId',
  aggrs: {
    count: '*',
    sum: 'stars',
  },
});
```

Representative parameter areas include:

- `groups`
- `columns`
- `aggrs`
- `distinct`
- `where`
- `joins`
- `limit`
- `offset`
- `having`
- `orders`

This matters because grouped results are still part of the structured ORM query language, not a separate unmanaged SQL world.

## `having` and grouped ordering

Grouped queries often need filtering and ordering on derived fields.

Representative pattern:

```typescript
const result = await this.scope.model.post.group({
  groups: 'userId',
  aggrs: {
    count: '*',
    sum: 'stars',
  },
  having: {
    count_all: {
      _gt_: 20,
    },
    sum_stars: {
      _gt_: 30,
      _lt_: 50,
    },
  },
  orders: [['count_all', 'desc']],
});
```

This is one of the reasons aggregate/group deserves dedicated documentation instead of being hidden inside a basic select page.

## Aggregate and group on relations

Aggregate and group are not limited to top-level model queries. They can also participate in relations.

### Dynamic relation example

Representative aggregate-on-relation pattern:

```typescript
const users = await this.scope.model.user.select({
  with: {
    posts: $relationDynamic.hasMany('test-vona:post', 'userId', {
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
});
```

Representative group-on-relation pattern:

```typescript
const users = await this.scope.model.user.select({
  with: {
    posts: $relationDynamic.hasMany('test-vona:post', 'userId', {
      groups: 'id',
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
});
```

### Static relation example

Representative static relation pattern:

```typescript
@Model({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany('test-vona:post', 'userId', {
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
})
class ModelUserStats {}
```

That means summary-shaped relations can still be expressed through model metadata instead of living outside the ORM relation system.

## Relationship to select and relations

Read this guide together with:

- [ORM Select Guide](/backend/orm-select-guide)
- [Relations Guide](/backend/relations-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)

A practical split is:

- use the select guide for row-oriented query structure and operators
- use this guide when the result shape is aggregate- or group-oriented
- use the relations guide when the summary is attached through relation metadata or dynamic relations

## Why this matters for AI workflows

When AI edits summary-oriented backend queries, it should ask:

1. is this a row-oriented select, a one-object aggregate, or a grouped result set?
2. should the summary live at the top level or inside a relation?
3. do `having` and derived-field ordering belong in the group definition?
4. should DTO inference or OpenAPI output reflect the summary shape explicitly?

That helps AI keep statistical and reporting queries aligned with Vona’s typed ORM model.
