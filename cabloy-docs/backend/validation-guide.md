# Validation Guide

This guide explains how validation works in Vona within the Cabloy monorepo.

## Why validation matters in Vona

Vona builds validation around Zod and integrates it directly into controller argument handling, DTOs, entities, and OpenAPI generation.

That means validation is not an isolated input-checking step. It is part of the contract layer shared across runtime behavior, types, and API documentation.

## Automatic schema inference

One very important convenience is that if a parameter type is a basic type, DTO, or entity, Vona can automatically infer the corresponding Zod schema.

Representative cases:

- `number` → `z.number()`
- DTO → `z.object({...})`
- Entity → `z.object({...})`

This matters because Vona tries to keep the contract surface concise while still producing strong runtime validation.

In controller AOP terms, this usually means built-in argument handling is enough for many request parameters without creating a custom pipe or argument pipe first.

## Explicit schema rules

You can also pass explicit schema rules when automatic inference is not enough.

Representative pattern:

```typescript
findOne(@Arg.query('id', z.number().min(6)) id: number) {}
```

## Extending the inferred schema

Inferred schemas can also be extended through helper tools like:

- `v.optional`
- `v.default`
- `v.array`
- `v.lazy`

That is important because many real validation cases need augmentation rather than total replacement.

## `@Arg.filter`

The validation layer also supports more advanced query-style inputs through `@Arg.filter`, which ties into DTO/query helper structures.

This is a good example of validation being connected to higher-level query semantics, not only primitive field checks.

## Tool groups

These helper tools fall into groups such as:

- basic tools
- string tools
- OpenAPI tools
- serializer tools
- Zod tools

For response-side shaping with those serializer helpers, see [Serialization Guide](/backend/serialization-guide).
- query filter tools
- special tools like `v.tableIdentity`

This matters for AI because the right answer is often “use the existing helper vocabulary” instead of hand-writing a one-off schema pattern.

## Why this matters for AI workflows

When AI changes request contracts, it should ask:

1. can Vona infer the schema automatically?
2. does the contract need explicit extension through the `v` helpers?
3. does the same validation surface also feed OpenAPI and DTO behavior?
4. is the validation logic better expressed at the controller, DTO, or entity layer?

That produces more consistent backend contracts.

For the broader request-path model around pipes, guards, middleware, interceptors, and filters, see [Controller AOP Guide](/backend/controller-aop-guide). Captcha verification flows commonly intersect with this request-path layer through a local interceptor; see [Captcha Guide](/backend/captcha-guide).
