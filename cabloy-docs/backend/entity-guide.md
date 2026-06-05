# Entity Guide

This page migrates the most important ideas from the legacy Vona entity documentation.

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

The legacy docs emphasized that Vona’s modular system needs a safe table-naming convention to reduce conflicts.

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

That is why the legacy docs centered entity fields around `@Api.field`.

Representative pattern:

```typescript
class EntityStudent {
  @Api.field()
  name: string;
}
```

You can also extend the field definition with richer schema and metadata.

Examples from the legacy docs included:

- explicit schema rules such as `z.number().min(18)`
- helpers such as `v.default`, `v.optional`, `v.array`
- OpenAPI metadata such as `v.title`, `v.description`, `v.example`, `v.openapi`

## I18n-aware metadata

The old docs also highlighted that OpenAPI-facing field metadata can be localized.

That means entities are not only persistence definitions. They can also participate in developer-facing and API-facing metadata generation.

## Why this matters for AI workflows

When AI creates or updates entities, it should:

1. preserve Vona table-naming conventions unless there is a deliberate reason to override them
2. use `@Api.field` rather than scattering schema and metadata concerns inconsistently
3. keep validation, OpenAPI, and entity structure aligned
4. remember that entities often feed DTO and OpenAPI workflows downstream
