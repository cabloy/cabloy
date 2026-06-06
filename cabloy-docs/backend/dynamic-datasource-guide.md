# Dynamic Datasource Guide

This guide points from the backend docs to the deeper Cabloy dynamic-datasource architecture.

## Current source of truth

The older ORM page for dynamic datasource is intentionally brief because the deeper capability is provided by the `a-cabloy` suite.

In the new docs structure, treat dynamic datasource as a Cabloy-level capability with strong backend implications.

## Why this matters

Dynamic datasource selection affects:

- how model operations are routed
- how related queries are resolved
- how transactions and cache behavior should be coordinated
- how queue and distributed flows should remain datasource-safe
- how multi-tenant or multi-project data architectures can be organized

So this is not only an implementation tweak. It is part of the system architecture.

## When a task becomes truly dynamic

A useful distinction is:

- static datasource choice can live in model metadata or app config
- relation-level datasource choice can live in relation metadata
- dynamic datasource begins when the routing decision depends on runtime context that cannot be declared once up front

That helps avoid overusing dynamic datasource when ordinary datasource configuration is sufficient.

## Guidance for contributors and AI workflows

When a task mentions dynamic datasource behavior, do not stop at ordinary model configuration.

Instead:

1. identify whether the routing decision is static, relation-level, model-level, or truly dynamic
2. inspect the Cabloy-level datasource architecture and source code
3. verify whether transactions, cache, relation loading, and queue behavior still align with the datasource routing strategy

## Relationship to the broader ORM family

Read this guide together with:

- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
- [Relations Guide](/backend/relations-guide)
- [Queue Guide](/backend/queue-guide)
- [Sharding Guide](/backend/sharding-guide)

## Documentation placement rule

Keep this page as the backend-facing pointer, but treat the Cabloy-level dynamic-datasource material as the deeper source of truth.
