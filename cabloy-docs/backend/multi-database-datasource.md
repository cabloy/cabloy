# Multi-Database and Datasource Guide

This guide explains how multi-database and multi-datasource support works in Vona within the Cabloy monorepo.

## Why this matters

Vona ORM is designed for business systems that may need:

- multiple database engines
- multiple datasources
- cross-datasource relation queries
- datasource-aware topology decisions
- isolated-instance database routing

This is an important part of the framework’s large-system positioning.

## Core model

A representative example uses related models such as `User` and `Order`.

The key idea is that model relations can remain meaningful even when the participating data lives on different datasources.

## Datasource setup

Three important pieces define the datasource setup:

1. datasource type definitions
2. datasource configuration in app config
3. model or relation-level selection of which datasource to use

That means datasource choice is part of the typed application model, not just a hidden runtime string.

## Default datasource selection

In the current runtime, ordinary datasource selection starts from `config.database.defaultClient`.

A practical order is:

1. use the explicitly requested datasource when one is provided
2. otherwise fall back to the configured default datasource
3. if the current instance is isolated, allow the instance’s `isolateClient` to override the ordinary default

This is why datasource selection belongs partly to config and partly to request/runtime context.

## Explicit client selection

One pattern is to create a model instance bound to a chosen datasource dynamically.

Representative pattern:

```typescript
const modelMysql = this.scope.model.student.newInstance('mysql');
return await modelMysql.select();
```

This is useful when the decision is explicit in business logic rather than implied by config defaults.

## Model-level, relation-level, and app-config-level defaults

You can simplify ordinary usage by declaring datasource choices in:

- model options
- relation options
- app config

That reduces repeated dynamic selection in ordinary business code.

A practical distinction is:

- use model or app-config defaults when one datasource should usually win
- use relation metadata when different parts of a graph need different datasources
- use explicit runtime selection when the current task truly needs to choose in code

## Ordinary multi-datasource behavior vs isolated-instance routing

One of the most important backend distinctions is:

- **ordinary multi-datasource behavior** chooses among datasources for business or topology reasons
- **isolated-instance routing** changes the effective default datasource because the active instance is configured as isolated

In the current repo, an isolated instance can declare:

- `isolate: true`
- `isolateClient: 'isolateTest'`

That means a request can remain model-native while still landing on a different default datasource because of instance configuration.

## Instance-aware database strategy

This matters because backend database strategy is not only about choosing MySQL vs PostgreSQL vs Sqlite3.

It is also about deciding whether:

- all instances share one datasource layout
- some instances share data while others isolate storage
- a test or tenant-specific instance should use a dedicated client

A practical example in the current repo is the `isolateTest` client used together with an isolated test instance.

## Concrete isolated datasource pattern in this repo

In the current app config, `isolateTest` is created by cloning the currently selected default client into a dedicated isolated client slot.

That pattern matters because it shows that isolated-instance routing does not require a completely separate datasource architecture from day one. It can start from the ordinary default client and then create an isolated variant for instance-aware routing.

A practical runtime split in the current repo is:

- base config defines `isolateTest` from the current default client
- dev/test config enables an isolated instance that points at `isolateClient: 'isolateTest'`
- prod config can explicitly unset `isolateTest` when that isolated test-oriented client should not remain active

## Relation-level datasource selection

Relation options can also specify datasource metadata.

That matters because different parts of a related object graph may need different datasource bindings.

## Datasource levels and execution isolation

Datasource architecture is not only about routing to the right database. It is also about isolation across execution contexts.

In distributed flows such as `pushAsync`, Vona can move work to a higher datasource level so background execution does not contend with the current request context for the same constrained connection pool.

That is why datasource design should be read together with:

- queue behavior
- transaction behavior
- relation loading
- runtime and distributed execution patterns

## Topology guidance

A practical way to think about topology is:

- use ordinary datasource selection for routine multi-datasource routing
- use isolated-instance config when the default database route should vary by instance
- use relation metadata when cross-datasource object graphs must still feel model-native
- use explicit runtime selection when business flow must choose a datasource directly
- escalate to sharding or deeper Cabloy architecture when the problem is no longer just datasource choice but data-distribution design

## Relationship to config, model, and dynamic datasource

Read this guide together with:

- [Config Guide](/backend/config-guide)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Model Guide](/backend/model-guide)
- [Dynamic Datasource Guide](/backend/dynamic-datasource-guide)
- [Sharding Guide](/backend/sharding-guide)
- [Queue Guide](/backend/queue-guide)
- [Relations Guide](/backend/relations-guide)

A practical split is:

- this guide explains ordinary multi-database and multi-datasource behavior
- config and instance docs explain why the effective default may differ by runtime or instance
- the dynamic datasource guide points to deeper routing architecture
- the sharding guide points to deeper data-distribution architecture

## Implementation checks for multi-datasource changes

When changing backend data flow in a multi-datasource system, ask:

1. is the model using an explicit datasource, a model default, or the current effective default datasource?
2. does the active instance change that default through `isolateClient`?
3. do related models need different datasource bindings?
4. should the datasource choice live in runtime logic, relation metadata, model metadata, or app config?
5. does the transaction, queue, or cache path need to match the same datasource choice?
6. is the problem still ordinary datasource routing, or has it become a dynamic-datasource or sharding concern?

That keeps multi-datasource logic coherent instead of fragile.
