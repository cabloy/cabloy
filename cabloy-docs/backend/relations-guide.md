# Relations Guide

This page migrates the highest-value ideas from the legacy Vona ORM relations documentation.

## Why relations matter

In Vona, relationships are not only for nicer reads. They shape:

- query composition
- nested CRUD behavior
- DTO inference
- OpenAPI-facing contract shape
- cross-model navigation in business code

That makes relations one of the most important bridges between persistence structure and fullstack contract design.

## Four relation kinds

The legacy docs highlight four main relation types:

- `hasOne`
- `belongsTo`
- `hasMany`
- `belongsToMany`

Together they cover common `1:1`, `n:1`, `1:n`, and `n:n` structures.

## `hasOne`

Representative idea:

- define the relation in model metadata
- use `include` to operate on the related record together with the main record

This is important because nested insert/update/delete behavior can be expressed through the same model operation surface instead of hand-written orchestration everywhere.

## `belongsTo`

The legacy docs frame `belongsTo` mainly as a query-time relationship.

That means it is especially useful for retrieving related parent-side data through model-aware query operations.

## `hasMany`

`hasMany` is especially important because it supports main-details structures, including scenarios where nested create/update/delete behavior happens together with the parent record.

This is one of the strongest reasons Cabloy can express CRUD-oriented business flows compactly.

## `belongsToMany`

`belongsToMany` models `n:n` relations through an intermediate model.

This matters because many real business systems depend on explicit join-table structure, and the framework treats that as a first-class modeling concern.

## Metadata regeneration

The legacy docs warn that relation changes require regenerating metadata.

That is important for AI workflows because relation changes are not purely local edits. They can affect type generation and downstream framework behavior.

## Why this matters for AI workflows

When AI adds or edits model relationships, it should ask:

1. which relation kind actually matches the business structure?
2. should the relation participate only in queries, or also in nested CRUD behavior?
3. does metadata need to be regenerated?
4. does the relation change affect DTO inference, OpenAPI, or frontend integration?

That keeps relations aligned with the broader Cabloy contract system.
