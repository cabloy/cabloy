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
