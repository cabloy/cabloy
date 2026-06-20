# Entity Guide

This guide explains how entities work in Vona within the Cabloy monorepo.

## Why entities matter in the contract loop

Entities are not only persistence records. In Vona, they also participate in validation, OpenAPI metadata, serializer-facing response shape, and downstream DTO design.

That makes entity design one of the main places where database structure and API contract structure meet.

## Create an entity

Example: create an entity named `student` in module `training-student`.

```bash
npm run vona :create:bean entity student -- --module=training-student
```

## Entity definition

Representative pattern:

```typescript
@Entity<IEntityOptionsStudent>('trainingStudent')
export class EntityStudent extends EntityBase {}
```

The entity defines the table-oriented data shape that the model layer works with.

## Entities in the backend contract loop

Entities sit at an important boundary:

- models bind to entities
- DTOs can reuse entity field structure
- validation can infer schema from entity field declarations
- OpenAPI metadata can be emitted from the same field surface

Read this guide together with:

- [Model Guide](/backend/model-guide)
- [DTO Guide](/backend/dto-guide)
- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)

## Table-name convention

Vona’s modular system needs a safe table-naming convention to reduce conflicts.

General pattern:

```text
tableName = moduleName + entityName
```

If the entity name duplicates the module name, Vona removes the duplicate fragment.

This convention matters because AI systems should not invent arbitrary table names when the framework already has a stable naming model.

## `@Api.field` as the shared contract surface

A key Vona idea is that entity fields can simultaneously express:

- field type
- validation rules
- OpenAPI metadata
- serializer-oriented response metadata

That is why entity fields are centered around `@Api.field`.

Representative pattern:

```typescript
class EntityStudent {
  @Api.field()
  name: string;
}
```

This is one of the strongest backend-contract-loop ideas: the same field definition can drive runtime validation and machine-readable API description without duplicating the contract in several places.

## Automatic schema inference

If the field type is a basic type, DTO, or entity, Vona can automatically infer the corresponding schema and OpenAPI output.

Representative automatically inferred types include:

- `string`
- `number`
- `boolean`
- DTO classes
- Entity classes

This matters because entity design is not only about persistence columns. It also affects how much explicit schema authoring you need later.

## Explicit schema extension

When inference is not enough, you can extend the field definition with richer schema and metadata.

Representative examples include:

- explicit schema rules such as `z.number().min(18)`
- helpers such as `v.default`, `v.optional`, `v.array`
- OpenAPI metadata such as `v.title`, `v.description`, `v.example`, `v.openapi`

When mixing helper metadata and an explicit zod schema in `@Api.field(...)`, keep a small but important ordering rule:

- `z.xxx(...)` returns the zod schema instance, so place it as the **last argument**
- put helper metadata such as `v.xxx(...)` and `ZovaRender.xxx(...)` before the zod schema
- otherwise helpers written after the zod schema may stop taking effect

Representative pattern:

```typescript
@Api.field(
  v.title($locale('Level')),
  ZovaRender.order(3),
  ZovaRender.field('basic-select:formFieldSelect', { items: levelItems }),
  z.number().int().min(1).max(3),
)
level: number;
```

A practical rule is:

- use inference for straightforward fields
- add explicit schema or metadata only where the contract really needs more detail

## Entity options

Important entity-option areas include:

- `table`
- `independent`
- `openapi`
- `fields`

These options matter because the entity can influence not only table mapping but also how the entity appears in the machine-readable contract layer.

## App-config overrides

Entity options can also be configured through app config.

This matters because entity-facing contract metadata can be refined at the project level without rewriting the entity class directly.

## Base class and identity type

By default, entities inherit from `EntityBase`, which provides common fields such as:

- `id`
- `createdAt`
- `updatedAt`
- `deleted`
- `iid`

The `id` field uses `TableIdentity`, which supports both string and number representations depending on the configured identity strategy.

That matters because contract types should not assume a narrower identity shape than the backend actually supports.

## Implementation checks for entity changes

When creating or updates entities:

1. preserve Vona table-naming conventions unless there is a deliberate reason to override them
2. use `@Api.field` rather than scattering schema and metadata concerns inconsistently
3. keep validation, OpenAPI, serializer, and entity structure aligned
4. remember that entities feed DTO, model, and OpenAPI workflows downstream
5. keep identity and base-field assumptions consistent with the actual backend contract loop

## Where to read next

If your next question is how entity field metadata becomes named transport contracts and emitted backend contract metadata, continue with:

- [DTO Guide](/backend/dto-guide)
- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
