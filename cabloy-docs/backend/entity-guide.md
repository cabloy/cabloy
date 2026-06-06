# Entity Guide

This guide explains how entities work in Vona within the Cabloy monorepo.

## Create an entity

Example: create an entity named `student` in module `demo-student`.

```bash
npm run vona :create:bean entity student -- --module=demo-student
```

## Entity definition

Representative pattern:

```typescript
@Entity<IEntityOptionsStudent>('demoStudent')
export class EntityStudent extends EntityBase {}
```

The entity defines the table-oriented data shape that the model layer works with.

## Table-name convention

Vona’s modular system needs a safe table-naming convention to reduce conflicts.

General pattern:

```text
tableName = moduleName + entityName
```

If the entity name duplicates the module name, Vona removes the duplicate fragment.

This convention matters because AI systems should not invent arbitrary table names when the framework already has a stable naming model.

## `@Api.field`

A key Vona idea is that entity fields can simultaneously express:

- field type
- validation rules
- OpenAPI metadata
- serializer-oriented response metadata

For response-shaping behavior built on the same field metadata surface, see [Serialization Guide](/backend/serialization-guide).

That is why entity fields are centered around `@Api.field`.

Representative pattern:

```typescript
class EntityStudent {
  @Api.field()
  name: string;
}
```

You can also extend the field definition with richer schema and metadata.

Representative examples include:

- explicit schema rules such as `z.number().min(18)`
- helpers such as `v.default`, `v.optional`, `v.array`
- OpenAPI metadata such as `v.title`, `v.description`, `v.example`, `v.openapi`

## I18n-aware metadata

OpenAPI-facing field metadata can also be localized.

That means entities are not only persistence definitions. They can also participate in developer-facing and API-facing metadata generation. For the broader locale and metadata model, see [I18n Guide](/backend/i18n-guide).

## Why this matters for AI workflows

When AI creates or updates entities, it should:

1. preserve Vona table-naming conventions unless there is a deliberate reason to override them
2. use `@Api.field` rather than scattering schema and metadata concerns inconsistently
3. keep validation, OpenAPI, and entity structure aligned
4. remember that entities often feed DTO and OpenAPI workflows downstream
