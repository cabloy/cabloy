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
- `aggregate` returns one summary object rather than grouped rows

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

A practical result-shape distinction is:

- `aggregate` returns one summary object
- `group` returns grouped rows keyed by the chosen group columns and aggregate aliases

## Aggregate result values

The ORM adapts database-driver aggregate scalars before returning model results or storing query-cache entries. Cached results and relation aggregates follow the same contract; business services do not need their own normalization helper.

| Result                             | Runtime value and inferred type                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `count_*`                          | Decimal string, with existing `undefined` optionality                                                  |
| `sum_*`, `avg_*`, `min_*`, `max_*` | String when populated; SQL `null` for empty/all-null inputs; existing `undefined` optionality retained |
| Group dimensions                   | Their ordinary column types and dialect conversion, not aggregate strings                              |

Aliases follow `${function}_${column}`, with `*` mapped to `all`, for example `count_all` and `avg_stars`. Adaptation uses the requested `aggrs`, not a prefix scan of arbitrary column names. Non-count functions currently accept numeric columns; this does not extend `min` or `max` to text/date columns.

An empty group query returns `[]`. An aggregate over no matching rows returns `"0"` for counts and `null` for non-count metrics. Missing relation objects retain their existing absence semantics rather than being synthesized into zero-valued summaries. `$Dto.aggregate` and `$Dto.group` reflect these scalar contracts, including nullable non-count fields.

`count()` also returns a string (or its existing `undefined` absence value). In `selectAndCount()`, `total` is a string; `pageCount`, `pageSize`, and `pageNo` remain numbers. Convert explicitly at a business arithmetic boundary only when the application's numeric range permits it.

Driver strings are preserved exactly, including large integers and decimal precision. Supported finite numeric/bigint scalars are converted to strings; numeric counts must be nonnegative safe integers. Unsupported values and unsafe numeric counts are rejected. Conversion cannot restore precision already lost by a driver; configure driver precision deliberately when that matters. The ORM does not parse decimal strings through JavaScript `Number`.

**Compatibility:** drivers that previously leaked native numeric aggregate values now return strings, matching the existing declared string contract. Untyped code that depended on native numbers must adapt deliberately. Non-count TypeScript and DTO fields now explicitly admit SQL `null`; callers must handle it rather than assuming a populated value.

## Bounded, client-selectable analysis APIs

Raw `model.group()` / `model.aggregate()` remain server-authored ORM operations. Do not expose their full parameter objects directly to clients. For an API that lets clients choose dimensions and metrics, define one `$defineAnalysis(modelLike, config)` policy and attach it to the resource SelectReq DTO with `@Dto({ analysis: policy })`.

Use `@Arg.filter(SelectReq, { mode: 'group' })` or `{ mode: 'aggregate' }`, infer finite optional response fields with `$Dto.analysisGroup(policy)` / `$Dto.analysisAggregate(policy)`, and execute through `$executeAnalysisGroup(model, policy, params)` / `$executeAnalysisAggregate(model, policy, params)`. The same policy supplies field allowlists, per-action defaults, limits, request enums and public `filter.capabilities.analysis` metadata. It is an API boundary, not an Entity-wide permission flag.

These helpers deliberately expose less than the raw ORM: no joins, relation loading, `having`, custom expressions or aliases. A named filter that requires joins is rejected for analysis rather than silently dropped. Ordinary select retains its existing joined-filter behavior. Projection, order and pagination controls are validated but do not drive analysis execution; dimension ordering and the result cap are server-owned.

The default limits are 3 dimensions, 10 function/column metric pairs and 1000 grouped rows. Group execution reads at most the configured row cap plus one and fails with 422 on overflow instead of returning a silently truncated result. This bounds materialized/returned rows, not database scan or aggregation cost. Existing instance scope, soft-delete handling, query caching and scalar normalization remain owned by the ORM.

See [CRUD Workflow](/backend/crud-workflow#grouping-and-statistics) for the Student policy, JSON query transport and default CLI analysis generation.

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

A practical alias rule is:

- aggregate aliases such as `count_all` and `sum_stars` become the names used in `having` and grouped ordering

That is also why grouped or summary outputs often deserve explicit DTO treatment once they become stable API contracts.

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

## Implementation checks for aggregate and grouped query changes

When editing summary-oriented backend queries, ask:

1. is this a row-oriented select, a one-object aggregate, or a grouped result set?
2. should the summary live at the top level or inside a relation?
3. do `having` and derived-field ordering belong in the group definition?
4. should DTO inference or OpenAPI output reflect the summary shape explicitly?

That helps AI keep statistical and reporting queries aligned with Vona’s typed ORM model.
