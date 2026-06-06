# DTO Guide

This guide explains how DTOs work in Vona within the Cabloy monorepo.

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

## `@Api.field`

DTO field definitions use the same `@Api.field` mental model as entities.

That means DTOs can express:

- validation rules
- field metadata
- OpenAPI-facing schema information

Representative pattern:

```typescript
class DtoStudentCreate {
  @Api.field(v.title($locale('Name')), v.min(3))
  name: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;
}
```

## DTO options

Three especially important DTO option areas are:

- `independent`
- `openapi`
- `fields`

These options make DTOs configurable as reusable schema objects, not just local TypeScript classes.

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

## DTO infer and generation

The DTO layer is also closely connected to a broader Vona value proposition: DTO inference and generation.

This is especially important for AI-assisted development, because it reduces redundant type-definition work and gives the agent a stronger source of truth.

## Why this matters for AI workflows

When AI creates DTOs, it should:

1. prefer reuse through mapped-class helpers when the shape is derived from existing classes
2. keep DTO validation and OpenAPI concerns aligned through `@Api.field`
3. avoid re-declaring fields manually if Vona’s DTO-generation or class-derivation tools already solve the problem
4. treat DTO design as part of the contract between backend handlers, models, and frontend integration
