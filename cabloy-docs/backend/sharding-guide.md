# Sharding Guide

This guide points from the backend docs to the deeper Cabloy sharding architecture.

## Current source of truth

The older ORM page for sharding is intentionally thin because the actual sharding capability is provided by the `a-cabloy` suite.

In the new docs structure, treat sharding as a Cabloy-level capability that affects backend data architecture.

## Why this matters

Sharding is not a local model trick. It changes how data distribution, query behavior, transaction expectations, and system-scale architecture are designed.

That means it belongs in the broader Cabloy knowledge graph, even when ORM-facing examples reference it.

## When sharding is the right mental model

A useful distinction is:

- ordinary multi-datasource routing chooses among existing datasources
- dynamic datasource chooses a datasource based on runtime context
- sharding changes how data itself is partitioned across the system

This matters because not every scaling problem should immediately be treated as sharding.

## Relationship to the broader ORM family

Read this guide together with:

- [ORM Guide](/backend/orm-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
- [Dynamic Datasource Guide](/backend/dynamic-datasource-guide)
- [Transaction Guide](/backend/transaction-guide)
- [Cache Guide](/backend/cache-guide)

## Guidance for contributors and AI workflows

When a task mentions sharding, do not assume ordinary single-database model rules are sufficient.

Instead:

1. identify whether the work belongs to core Vona model design or Cabloy sharding infrastructure
2. inspect the Cabloy-level sharding guidance and source implementation
3. verify whether related concerns such as cache, transactions, relations, and DTO inference still behave correctly under the sharded design

## Documentation placement rule

Keep this page as the backend-facing pointer, but treat the Cabloy-level sharding material as the deeper source of truth.
