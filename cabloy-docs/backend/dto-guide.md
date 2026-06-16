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

Example: create a DTO named `studentCreate` in module `demo-student`.

```bash
npm run vona :create:bean dto studentCreate -- --module=demo-student
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

For the inference side, see [DTO Infer and Generation](/backend/dto-infer-generation).

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

1. prefer reuse through mapped-class helpers when the shape is derived from existing classes
2. keep DTO validation and OpenAPI concerns aligned through `@Api.field`
3. decide whether the contract should be an explicit DTO class or an inferred DTO
4. avoid re-declaring fields manually if Vona’s DTO-generation or class-derivation tools already solve the problem
5. treat DTO design as part of the contract between backend handlers, models, and frontend integration
6. choose explicit DTOs when named long-lived contracts matter, and inferred DTOs when the model/query shape already expresses the contract clearly
