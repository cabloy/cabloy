# ORM Guide

This guide explains the role of Vona ORM in the Cabloy monorepo.

## Why Vona ORM matters

Vona ORM is an intuitive and powerful ORM engine built around TypeScript, strong typing, and dynamic DTO inference.

For the new Cabloy docs, the most important takeaway is that Vona ORM is not just a thin query wrapper. It is a framework-level data system that connects:

- models and entities
- query behavior
- caching
- multi-datasource support
- transactions
- DTO inference and generation
- frontend integration through OpenAPI and generated contracts

## Core capabilities

Its core ORM capabilities include:

- multiple databases and multiple datasources
- dynamic datasource support
- sharded databases and tables
- read-write separation
- dynamic DTO inference and generation
- aggregate and grouping queries
- static and dynamic relationships
- query cache and entity cache
- transaction and transaction-propagation support
- transaction compensation for data and cache consistency

## Why this matters for Cabloy AI workflows

For AI-assisted development, Vona ORM should be treated as a knowledge hub rather than as an implementation detail.

When AI touches backend data logic, it should ask:

1. is this a model/entity/DTO problem rather than a raw SQL problem?
2. does the change affect caching, transactions, or datasource behavior?
3. should DTO inference or OpenAPI generation be updated as a consequence?
4. does frontend integration depend on the ORM-facing contract shape?

That perspective produces more Cabloy-native results.
