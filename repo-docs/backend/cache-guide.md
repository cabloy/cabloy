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

When a mutation in one Model changes the members, totals, projections, includes, or visibility of a query cached by another Model, declare an explicit cross-model dependency. Decide this from **query-result semantics**, not merely from a relation or foreign key.

### Choose one directed declaration

Express each dependency as one source-to-target edge:

- `modelsClear` declares targets from the source Model;
- `modelsClearedBy` declares sources from the target Model.

They normalize to the same direction. Choose the form that makes local ownership clearest, but never declare both forms for the same edge.

### Keep the graph acyclic

Keep the dependency graph directed, acyclic, and free of duplicate edges. A normal target clear can propagate transitively to its own dependent query caches, so reverse or duplicate declarations are not a way to increase reliability.

The default behavior clears affected **query caches**. It does not make a cross-Model entity cache relationship, replace a lock, enforce uniqueness, or create a transaction boundary.

### Use custom clearing deliberately

`modelsClearedByFn` replaces the normal target-clear behavior for that dependency. When using it, explicitly own the target clear and any required downstream propagation. Do not add it as if it were an additional callback around the normal path.

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
