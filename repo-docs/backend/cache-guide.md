# Cache Guide

This guide explains how ORM caching works in Vona within the Cabloy monorepo.

## Why caching is first-class in Vona

Large business systems often fail not because performance is impossible, but because performance strategy is bolted on too late and too inconsistently.

Vona responds by moving caching into the framework core.

That means cache behavior is not only an optimization technique. It is part of the default data model.

## Out-of-the-box behavior

One major point is that Vona ORM offers out-of-the-box caching.

In practice, that means ordinary ORM operations can benefit from framework-managed cache behavior without forcing the developer to hand-maintain every cache path.

## Entity cache

The entity cache centers on the mapping:

- entity id -> entity data

This is important because entity reads can become cheap and update/delete operations can invalidate the relevant entries systematically.

## Query cache

The query cache operates differently.

For normal queries, the cache is based on:

- hash of the query clause -> array of ids

Then the final data is resolved through entity-cache retrieval.

For aggregate and group operations, the cache can directly store the resulting computed data.

This is one of the key Vona ideas: query cache and entity cache cooperate instead of duplicating responsibility blindly.

## Cache configuration

Cache configuration exists at both:

- model options
- app config

Representative areas include:

- entity-cache mode and ttl
- query-cache mode and ttl
- related-model cache clearing
- custom cache-clearing logic

## Cross-model query-cache dependencies

When a mutation in one Model changes the members, ordering, totals, computed results, projections, includes, or visibility of a query cached by another Model, declare an explicit cross-model dependency. Decide this from **query-result semantics**, not merely from a relation or foreign key.

### Check dependencies when changing cross-model queries

Whenever adding or changing relation predicates (`exists` / `notExists`, including child conditions), related-field query `bindings`, joins, sorting, or aggregation, identify the Model that owns the cached query and the related sources whose mutations can change its result. Model relations and public query policies do not register these invalidation dependencies automatically.

The two query directions below require different edges:

| Cached query                                                               | Query-cache owner | Related source mutation                                                                    | Required invalidation direction |
| -------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------ | ------------------------------- |
| Student `relations.trainingRecords` existence or child-condition filtering | Student           | Record create, score update, delete, or restore that changes whether the predicate matches | Record → Student                |
| Record `bindings.studentName` filtering or sorting                         | Record            | Student rename, delete, or restore that changes matching rows or their order               | Student → Record                |

Declare each required edge in the owning modules. Refreshing entity-cache entries does not repair a cached ID membership/order, total, or aggregate. Cache consistency is separate from Action authorization and dataScope; declaring an edge grants no query permission.

Do not add edges solely because a relation exists. A query that explicitly bypasses caching does not itself require a query-cache dependency; check other cached consumers before omitting an edge. Add both directions only when both directions have real cached-result dependencies.

### Choose one directed declaration

Express each dependency as one source-to-target edge:

- `modelsClear` declares targets from the source Model;
- `modelsClearedBy` declares sources from the target Model.

They normalize to the same direction. Choose the form that makes local ownership clearest, but never declare both forms for the same edge.

### Cycle-safe default propagation

Default clearing follows the directed dependency graph transitively. Within one invalidation wave, the framework clears each effective Model query-cache namespace at most once, including self-references, cycles, and converging paths. Identity includes the Model, normalized datasource client, and effective table; different Model aliases over one table remain distinct cache owners.

Declare each intended directed edge once. A reverse edge is appropriate only when the reverse query-result dependency also exists, not as an extra reliability measure. For example, Student queries filtered by Record existence need Record → Student; Record queries filtered or ordered by Student name also need Student → Record. Both query caches can remain enabled with these two dependencies.

Each independent invalidation, transaction-commit re-clear, and configured delayed double-delete starts a fresh wave. Deduplication does not suppress a later clear after a cache has been rewarmed. This is traversal safety, not automatic discovery of dependencies from relations, joins, or public query bindings.

The default behavior clears affected **query caches**. It does not make a cross-Model entity cache relationship, replace a lock, enforce uniqueness, or create a transaction boundary.

### Use custom clearing deliberately

`modelsClearedByFn(ctx, modelTarget, modelSource)` replaces the normal target-clear behavior for that dependency. When using it, explicitly own the target clear and any required downstream propagation. Do not add it as if it were an additional callback around the normal path. Callbacks retain their per-edge, source-specific behavior; default target deduplication does not combine callbacks from different sources. The cycle-safety guarantee covers default framework propagation, not arbitrary callback recursion: calling a normal clear entrypoint from a callback starts a new wave, so custom code must avoid re-entering its own cycle.

Prefer normal Model or service mutation paths so source invalidation, transaction-aware re-clearing, and configured cache behavior remain active.

### Verify a warmed dependent query

For every new dependency path, add a regression test that:

1. warms the dependent Model query;
2. mutates the source through the normal Model or service path;
3. repeats the dependent query;
4. proves that the result now reflects the mutation.

This test demonstrates business invalidation rather than relying on test-runner scheduling or cache implementation assumptions.

## Consistency strategy

Vona also clears or compensates cache automatically when model mutation occurs.

That matters because a useful cache is not only about hits. It is about correctness under change.

## Implementation checks for cache-sensitive data-access changes

When changing data-access behavior, ask:

1. is this path already covered by Vona’s built-in cache model?
2. does the model cache config need to be updated?
3. should related-model query caches also be cleared?
4. does transaction-aware cache compensation matter for this change?

That helps avoid both underusing and breaking the cache system.
