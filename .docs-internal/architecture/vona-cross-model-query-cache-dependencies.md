# Vona Cross-Model Query-Cache Dependencies

## Purpose

Use this note when a Vona query result depends on data owned by more than one Model. It explains how to decide which query caches must be invalidated after a mutation, how `modelsClear` and `modelsClearedBy` are executed, and which graph shapes are unsafe.

This is maintainer guidance. It describes current Vona source behavior and deliberately distinguishes that from behavior covered by direct regression tests.

## Core rule

Model cache dependencies follow **result semantics**, not relation declarations, foreign keys, or which Model happens to issue the final query.

Declare a cross-model invalidation edge when writing a source Model can make a target Model's cached query result stale by changing any of the following:

- result membership;
- ordering, pagination, or `total`;
- selected or derived projection fields;
- included relation results;
- publication, permission, or other visibility decisions;
- active-instance or soft-delete visibility.

For example, a public Product query can depend on Category publication, SKU lifecycle and price, and StockBalance availability. Even though the query cache is owned by the Product Model, writes to each of those sources can change its result.

## Declaration direction

Use one directed edge for each dependency:

```ts
// Source-side declaration: source write invalidates target query cache.
@Model({
  cache: {
    modelsClear: 'module-b:target',
  },
})
export class ModelSource extends BeanModelBase<EntitySource> {}
```

Or declare the same edge from the target side:

```ts
// Target-side declaration: source write invalidates this target query cache.
@Model({
  cache: {
    modelsClearedBy: 'module-a:source',
  },
})
export class ModelTarget extends BeanModelBase<EntityTarget> {}
```

Both forms normalize to the same source-to-target graph. Prefer `modelsClear` when the source's mutation impact is clearest. Prefer `modelsClearedBy` only when target ownership makes the dependency clearer.

Do **not** declare both forms for the same edge. Current graph collection appends targets rather than deduplicating them.

## Runtime behavior — source-proven

The relevant contracts and implementation are in:

- [model options](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/types/onion/model.ts)
- [dependency graph normalization](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/const.ts)
- [model cache invalidation](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/bean.model/bean.model_cache.ts)

Normal Model mutations invalidate the affected entity cache entry and clear the source Model's query cache. Query-cache clearing then obtains the source Model's dependency targets and clears each target's query cache.

The default target path calls `target.cacheQueryClearInner()`. Consequently, propagation is transitive:

```text
StockBalance write
  → StockBalance query cache clear
  → SKU query cache clear
  → Product query cache clear
```

This is specifically **query-cache** propagation. A related target Model's entity cache is not cleared merely because it appears in `modelsClear` or `modelsClearedBy`.

The cache implementation also registers commit-time clearing and may enqueue configured delayed sharding double-delete work. Prefer normal Model mutation APIs over out-of-band database writes so these consistency paths remain active.

## Callback replacement semantics — source-proven

`modelsClearedByFn` belongs to the target Model. When an edge reaches that target, Vona invokes the callback with:

```ts
async (ctx, modelTarget, modelSource) => {
  // custom target invalidation
};
```

The callback **replaces** the normal `modelTarget.cacheQueryClearInner()` path; it does not supplement it. A callback that needs ordinary clearing or downstream propagation must perform that behavior deliberately.

Use this only when the dependent target needs custom table, datasource, sharding, or partial-invalidation handling. Verify the target's datasource/table resolution rather than assuming it is identical to the source Model's.

## Graph safety rules

Treat cache dependencies as a small directed graph with strict safety requirements:

1. Declare each edge once.
2. Keep the graph acyclic; do not introduce self-edges.
3. Keep edges narrow and tied to actual query-result dependencies.
4. Trace downstream edges before adding a new source edge.
5. Use a callback only when default whole-target query clearing is not correct.

Current graph collection and traversal have no target deduplication or visited-set cycle guard. Duplicate edges can clear a target more than once, and a cycle can recurse through related query-cache clearing.

## Authoring checklist

Before adding an edge:

1. Identify the target Model whose **query cache** holds the potentially stale result.
2. List every source Model used by the target query's `where`, `EXISTS`, join, aggregate, relation include, or DTO mapping.
3. For each source write, ask whether it can alter membership, count, page membership, order, projection, or visibility.
4. Add exactly one source-to-target declaration where the answer is yes.
5. Check whether an existing intermediate edge already provides the desired transitive propagation.
6. Verify that the resulting graph is acyclic and contains no duplicate edge.
7. If using `modelsClearedByFn`, document which target invalidation and downstream propagation it owns.
8. Keep transactional commands authoritative: a browse/query cache is never a substitute for transaction-safe locking and reads in a command path.

## Regression pattern

Test the stale-cache scenario rather than merely asserting that a Model method was called:

```text
1. Read the dependent query to warm its cache.
2. Mutate the source Model through its normal Model/service path.
3. Repeat the identical dependent query.
4. Assert that members, totals, relations, and projections reflect the mutation.
```

For a public Product query, useful transitions include:

```text
StockBalance.available: 0 → positive → 0
SKU.lifecycle: active ↔ inactive
Category.published: true → false
```

The Product public-catalogue test is a representative application-level regression pattern:

- [catalog.test.ts](../../vona/src/suite/a-commerce/modules/commerce-catalog/test/catalog.test.ts)

## Evidence boundary

### Source-proven

Current source establishes:

- source-side and target-side declarations normalize into the same dependency direction;
- related target query-cache clearing is transitive on the default path;
- `modelsClearedByFn` replaces default target clearing;
- graph collection does not deduplicate targets;
- traversal has no cycle guard.

### Regression-tested today

The general Model cache suite covers ordinary cache behavior across insert, select, update, and delete:

- [modelCache.test.ts](../../vona/src/suite-vendor/a-test/modules/test-vona/test/database/modelCache.test.ts)

The Product public-catalogue suite verifies a concrete warm-query → Category/SKU/StockBalance mutation → refreshed public result path:

- [catalog.test.ts](../../vona/src/suite/a-commerce/modules/commerce-catalog/test/catalog.test.ts)

### Recommended framework regression coverage

When extending the ORM cache subsystem, add direct tests for:

- source-side `modelsClear` invalidating a warmed target query;
- target-side `modelsClearedBy` normalization;
- transitive `A → B → C` propagation;
- `modelsClearedByFn` replacement and explicit continuation behavior;
- dynamic table/datasource targets;
- duplicate-edge and cycle rejection or explicit unsupported behavior.

Do not describe these branches as framework regression guarantees until such tests exist.

## Related source entrypoints

- [Model cache options](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/types/onion/model.ts)
- [Dependency graph normalization](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/const.ts)
- [Cache invalidation and propagation](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/bean.model/bean.model_cache.ts)
- [Cache transaction consistency](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/service/transactionConsistency_.ts)
- [Model cache baseline tests](../../vona/src/suite-vendor/a-test/modules/test-vona/test/database/modelCache.test.ts)
