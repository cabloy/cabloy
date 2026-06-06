# Multi-Database and Datasource Guide

This guide explains how multi-database and multi-datasource support works in Vona within the Cabloy monorepo.

## Why this matters

Vona ORM is designed for business systems that may need:

- multiple database engines
- multiple datasources
- cross-datasource relation queries
- datasource-aware topology decisions

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

## Dynamic datasource selection

One pattern is to create a model instance bound to a chosen datasource dynamically.

This is useful when the decision depends on runtime context.

## Relation-level datasource selection

Relation options can also specify datasource metadata.

That matters because different parts of a related object graph may need different datasource bindings.

## Model-level and app-config-level defaults

You can also simplify usage by declaring datasource choices in:

- model options
- app config

That reduces repeated dynamic selection in ordinary business code.

## Datasource levels and isolation

Datasource architecture is not only about routing to the right database. It is also about isolation across execution contexts.

In distributed flows such as `pushAsync`, Vona can move work to a higher datasource level so background execution does not contend with the current request context for the same constrained connection pool.

That is why datasource design should be read together with:

- queue behavior
- transaction behavior
- relation loading
- runtime/distributed execution patterns

## Topology guidance

A practical way to think about topology is:

- use ordinary datasource selection for routine multi-datasource routing
- use relation metadata when cross-datasource object graphs must still feel model-native
- use dynamic datasource logic when the routing decision depends on live context
- escalate to sharding or deeper Cabloy architecture when the problem is no longer just datasource choice but data-distribution design

## Relationship to dynamic datasource and sharding

Read this guide together with:

- [Dynamic Datasource Guide](/backend/dynamic-datasource-guide)
- [Sharding Guide](/backend/sharding-guide)
- [Queue Guide](/backend/queue-guide)
- [Relations Guide](/backend/relations-guide)

A practical split is:

- this guide explains ordinary multi-database and multi-datasource behavior
- the dynamic datasource guide points to deeper routing architecture
- the sharding guide points to deeper data-distribution architecture

## Why this matters for AI workflows

When AI changes backend data flow in a multi-datasource system, it should ask:

1. is the model using the default datasource or a specific one?
2. do related models need different datasource bindings?
3. should the datasource choice live in runtime logic, relation metadata, model metadata, or app config?
4. does the transaction, queue, or cache path need to match the same datasource choice?
5. is the problem still ordinary datasource routing, or has it become a sharding/topology concern?

That keeps multi-datasource logic coherent instead of fragile.
