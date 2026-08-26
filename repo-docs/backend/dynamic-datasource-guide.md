# Dynamic Datasource Guide

This guide points from the backend docs to the deeper Cabloy dynamic-datasource architecture.

## Current source of truth

This page is intentionally a backend-facing pointer page rather than a full standalone tutorial.

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

## Do not confuse three different routing layers

A useful distinction is:

- **ordinary datasource selection** can live in model metadata or app config
- **isolated-instance routing** can change the effective default datasource through instance config such as `isolateClient` and is primarily explained in [Multi-Database and Datasource Guide](/backend/multi-database-datasource) together with [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution)
- **dynamic datasource** begins when the routing decision depends on runtime context that cannot be declared once up front

This distinction matters because many backend tasks do not actually need dynamic datasource.

## When a task becomes truly dynamic

A practical rule is:

- static datasource choice can live in model metadata or app config
- relation-level datasource choice can live in relation metadata
- instance-sensitive default routing can live in instance config
- dynamic datasource begins when routing depends on live context beyond those declarative mechanisms

That helps avoid overusing dynamic datasource when ordinary datasource configuration is sufficient.

## Guidance for contributors and AI workflows

When a task mentions dynamic datasource behavior, do not stop at ordinary model configuration.

Instead:

1. identify whether the routing decision is static, relation-level, instance-sensitive, model-level, or truly dynamic
2. inspect the Cabloy-level datasource architecture and source code
3. verify whether transactions, cache, relation loading, and queue behavior still align with the datasource routing strategy
4. confirm that instance isolation or app-config defaults are not already enough for the task

## Relationship to the broader ORM family

Read this guide together with:

- [Config Guide](/backend/config-guide)
- [Model Guide](/backend/model-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
- [Relations Guide](/backend/relations-guide)
- [Queue Guide](/backend/queue-guide)
- [Sharding Guide](/backend/sharding-guide)

## Documentation placement rule

Keep this page as the backend-facing pointer, but treat the Cabloy-level dynamic-datasource material as the deeper source of truth.
