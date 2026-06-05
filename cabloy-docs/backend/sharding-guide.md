# Sharding Guide

This page bridges the legacy Vona ORM advanced sharding page into the new unified docs site.

## Current source of truth

The legacy ORM page for sharding is intentionally thin because the actual sharding capability is provided by the `a-cabloy` suite.

In the new docs structure, treat sharding as a Cabloy-level capability that affects backend data architecture.

## Why this matters

Sharding is not a local model trick. It changes how data distribution, query behavior, and system-scale architecture are designed.

That means it belongs in the broader Cabloy knowledge graph, even when ORM-facing examples reference it.

## Guidance for contributors and AI workflows

When a task mentions sharding, do not assume ordinary single-database model rules are sufficient.

Instead:

1. identify whether the work belongs to core Vona model design or Cabloy sharding infrastructure
2. inspect the Cabloy-level sharding guidance and source implementation
3. verify whether related concerns such as cache, transactions, and DTO inference still behave correctly under the sharded design

## Documentation placement rule

Keep this page as the backend-facing pointer, but treat the Cabloy-level sharding material as the deeper source of truth.
