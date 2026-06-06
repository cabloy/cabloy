# DTO Infer and Generation

This guide explains how DTO inference and generation work in Vona within the Cabloy monorepo.

## Why DTO inference matters

DTOs are essential for validation and OpenAPI metadata, but manually maintaining them becomes expensive and error-prone as models and relationships grow more complex.

Vona addresses that by dynamically inferring and generating DTOs from model structure and query shape.

## DTO tools

Several DTO-oriented tools are available, including:

- `$Dto.get`
- `$Dto.listAndCount`
- `$Dto.query`
- `$Dto.queryPage`
- `$Dto.create`
- `$Dto.update`
- `$Dto.aggregate`
- `$Dto.group`

These tools let DTOs emerge from model-aware structure instead of always being hand-authored from scratch.

## Main-details example

A representative example uses an `Order -> Product` relation.

The key lesson is that when the return shape is richer than a simple entity array, an inferred DTO can capture the actual result shape more accurately than a hand-waved entity annotation.

Representative pattern:

```typescript
@Api.body(v.array($Dto.get(() => ModelOrder, { include: { products: true } })))
```

This shows the dynamic DTO layer participating directly in controller return contracts.

## Encapsulating inferred DTOs

Inferred DTO logic can also be wrapped inside an explicit DTO class for reuse.

That is useful because it gives teams a spectrum of options:

- use inference directly for one endpoint
- or package the inferred DTO into a named reusable class when the contract is important elsewhere too

## Why this matters for AI workflows

When AI sees a return shape or input contract that closely follows model structure, it should ask:

1. should this DTO be inferred instead of handwritten?
2. does model relationship structure already contain enough information?
3. should the inferred DTO stay inline or be wrapped in a named DTO class?
4. does the resulting DTO also affect OpenAPI and frontend generation paths?

That helps reduce redundant type work and keeps contracts closer to the model truth.
