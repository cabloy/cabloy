# ORM Guide

## Why Vona ORM matters

Vona ORM is an intuitive and powerful ORM engine built around TypeScript, strong typing, and dynamic DTO inference.

For the Cabloy docs, the most important takeaway is that Vona ORM is not just a thin query wrapper. It is a framework-level data system that connects:

- models and entities
- query behavior
- mutation behavior
- relationships
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

## Recommended ORM reading path

Use this page as the ORM overview, then move into the deeper leaves in roughly this order:

1. [Model Guide](/backend/model-guide)
2. [Entity Guide](/backend/entity-guide)
3. [ORM Configuration Guide](/backend/orm-configuration-guide)
4. [ORM Select Guide](/backend/orm-select-guide)
5. [ORM Mutation Guide](/backend/orm-mutation-guide)
6. [Relations Guide](/backend/relations-guide)
7. [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
8. [DTO Guide](/backend/dto-guide)
9. [DTO Infer and Generation](/backend/dto-infer-generation)
10. [Transaction Guide](/backend/transaction-guide)
11. [Cache Guide](/backend/cache-guide)
12. [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
13. [Dynamic Datasource Guide](/backend/dynamic-datasource-guide)
14. [Sharding Guide](/backend/sharding-guide)

Use [Dynamic Datasource Guide](/backend/dynamic-datasource-guide) as a backend-facing pointer page into deeper Cabloy datasource architecture, not as a parallel full ORM tutorial.

This keeps the overview page focused while pushing depth into the pages that own each concern.

## The main ORM concern clusters

A useful mental model is to treat Vona ORM as several connected concern clusters:

### Structure cluster

- entities define persistence-facing fields
- models define data behavior and relationships
- ORM config defines framework-wide defaults

### Query cluster

- select operations shape row-oriented reads
- aggregate/group operations shape summary-oriented reads
- static and dynamic relations shape cross-model retrieval

### Write cluster

- insert/update/delete express explicit write intent
- mutate/mutateBulk provide higher-level write inference
- relation-aware writes support nested CRUD workflows

### Infrastructure cluster

- transactions protect consistency
- cache affects query and entity behavior
- datasource selection affects routing, isolation, and scale
- sharding and advanced topology move the ORM into larger-system architecture

## Relationship to fullstack contracts

ORM is closely connected to DTO inference, OpenAPI, and frontend-facing contract generation.

That means backend data modeling is not an isolated persistence concern. It also shapes:

- controller contracts
- generated SDKs
- relation-aware DTOs
- aggregate/group result contracts

## Implementation checks for ORM changes

Vona ORM should be treated as a knowledge hub rather than as an implementation detail.

When changing backend data logic, ask:

1. is this a model/entity/DTO problem rather than a raw SQL problem?
2. does the change affect query shape, mutation semantics, relation behavior, or summary shape?
3. does the change affect caching, transactions, or datasource behavior?
4. should DTO inference or OpenAPI generation be updated as a consequence?
5. does frontend integration depend on the ORM-facing contract shape?

That perspective produces more Cabloy-native results.
