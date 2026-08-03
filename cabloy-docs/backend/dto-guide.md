# DTO Guide

This guide explains how DTOs work in Vona within the Cabloy monorepo.

## Why DTOs matter

DTOs are not only transport classes. In Vona, they are part of one contract system shared across:

- validation
- OpenAPI metadata
- serializer-facing response shape
- model-aware DTO inference
- frontend-facing generated contracts

That is why DTO design should be treated as a framework concern instead of only a controller-local convenience.

## Create a DTO

Example: create a DTO named `studentCreate` in module `training-student`.

```bash
npm run vona :create:bean dto studentCreate -- --module=training-student
```

## DTO definition

Representative pattern:

```typescript
@Dto<IDtoOptionsStudentCreate>()
export class DtoStudentCreate {}
```

## DTOs in the backend contract loop

DTOs are the most explicit named contracts in the backend contract loop.

A useful split is:

- entities define reusable field/data structure close to persistence
- DTOs define explicit request/response contract artifacts
- inferred DTOs reduce duplication when the model/query shape is already strong enough

Read this guide together with:

- [Entity Guide](/backend/entity-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)
- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)

## `@Api.field`

DTO field definitions use the same `@Api.field` mental model as entities.

That means DTOs can express:

- validation rules
- field metadata
- OpenAPI-facing schema information
- serializer-oriented response metadata when needed

For response-shaping behavior built on the same field metadata surface, see [Serialization Guide](/backend/serialization-guide).

Representative pattern:

```typescript
class DtoStudentCreate {
  @Api.field(v.title($locale('Name')), v.min(3))
  name: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;
}
```

When mixing helper metadata and an explicit zod schema in `@Api.field(...)`, apply the same ordering rule used by entities:

- place `z.xxx(...)` as the **last argument** because it returns the zod schema instance
- keep helper metadata such as `v.xxx(...)` and `ZovaRender.xxx(...)` before the zod schema
- otherwise helpers written after the zod schema may stop taking effect

For query-oriented DTOs, another important distinction is optional vs nullable:

- `v.optional()` means the field may be omitted
- `v.nullable()` means the field may carry a real `null`

That becomes especially important for DTO query filters. A field declared with `v.optional(), v.nullable()` can preserve real `null` through query parsing so the downstream ORM filter can express SQL `IS NULL` instead of silently treating the value as omitted.

## DTO options

Three especially important DTO option areas are:

- `independent`
- `openapi`
- `fields`

These options make DTOs configurable as reusable schema objects, not just local TypeScript classes.

A useful ownership rule is:

- DTO metadata defines the contract shape close to the class
- app config can still override broader DTO behavior
- inference tools can reduce how much hand-authored DTO code is needed

## App-config override support

DTO options can also be configured through app config.

That matters because the DTO layer participates in the broader framework configuration system instead of being fully hardcoded in one file.

## Mapped class tools

One of the most valuable DTO topics is reuse through mapped-class helpers.

Representative tools include:

- `$Class.pick`
- `$Class.partial`
- `$Class.omit`
- `$Class.mixin`

These let you derive DTOs from existing entities or DTOs instead of re-declaring the same field sets repeatedly.

## Operation-specific DTO thinking

A practical way to think about DTO families is by operation shape.

Common operation families include:

- create DTOs
- update DTOs
- get DTOs
- list-and-count DTOs
- query DTOs
- query-page DTOs
- aggregate DTOs
- group DTOs

Some of these are hand-authored DTO classes. Others are better expressed through Vona’s inference helpers.

The important point is not to force every operation shape into one generic DTO when the framework already distinguishes them more precisely.

## Explicit DTOs vs inferred DTOs

A practical split is:

- use explicit DTO classes when the contract needs a stable named artifact
- use inferred DTOs when the contract closely follows model structure or query shape
- wrap inferred DTOs in a named DTO class when reuse or discoverability becomes more important

When stable Entity, Model, relation, or query truth already exists, prefer inference first: use `$Dto.*` with `columns`, `include`, or `dtoClass` to define the projection; use `@Dto({ fields })` with `$makeMetadata(...)` for metadata-only differences or `$makeSchema(...)` for schema and validation differences; add an `@Api.field(...)` member only for a genuinely new field absent from the inferred contract. Keep an explicit DTO as a deliberate fallback when no suitable upstream truth exists or the inferred composition is less clear.

Advanced inferred DTO shaping can also stay named and reusable through helper options such as `dtoClass`, especially for relation-aware contracts and nested DTO surfaces. `$Dto.get(...)` otherwise keeps the complete model-aware read shape by default; use `columns` or `dtoClass` for a genuine business projection, not merely to remove `iid` or `deleted`. For the canonical authoring sequence, see [Default-first three-layer DTO authoring](/backend/dto-infer-generation#default-first-three-layer-dto-authoring) and [Default read shape versus a public projection](/backend/dto-infer-generation#default-read-shape-versus-a-public-projection).

## Relationship to ORM and controller contracts

DTOs sit between backend data structure and backend API contracts.

That means DTO design should often be read together with:

- [Model Guide](/backend/model-guide)
- [Relations Guide](/backend/relations-guide)
- [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Controller Guide](/backend/controller-guide)

## Implementation checks for DTO changes

When creating DTOs:

1. check whether an Entity, Model, relation, or query shape already provides suitable upstream contract truth
2. define the inferred projection before redeclaring fields: choose the `$Dto.*` helper and, where needed, `columns`, `include`, or `dtoClass`
3. use `$makeMetadata(...)` for metadata-only refinement and `$makeSchema(...)` for schema or validation refinement of an inferred field
4. use `@Api.field(...)` for a genuinely new field, not as a second declaration of an inferred field
5. keep DTO validation and OpenAPI concerns aligned, and keep the final structure-defining schema last when using schema-like composition
6. decide whether the contract should remain inferred, be wrapped in a named inferred DTO, or deliberately fall back to an explicit DTO
7. treat DTO design as part of the contract between backend handlers, models, and frontend integration

## Where to read next

If your next question is how named DTO artifacts fit into one complete backend module specimen, continue with:

- [DTO Infer and Generation](/backend/dto-infer-generation)
- [Controller Guide](/backend/controller-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
