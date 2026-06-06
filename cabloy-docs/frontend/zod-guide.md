# Zod Guide

## Why Zod matters in Zova

Zova uses Zod as the schema foundation for typed page params, typed page query handling, and other frontend schema-driven behaviors.

That matters because route-driven data should not be handled as raw strings once the framework already provides a stronger schema model.

## Zova’s `z` wrapper

Zova encapsulates Zod and provides an enhanced `z` surface.

The goal is not only generic schema validation. The goal is schema validation that fits Zova’s routing and page-controller model.

## Basic schema usage

Representative examples include:

```typescript
const name = z.string();
const age = z.number();
const enabled = z.boolean();
```

Optional values and defaults are also first-class:

```typescript
const name = z.string().optional();
const title = z.string().optional().default('');
```

## Common object schemas

Representative object schema:

```typescript
const user = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
});
```

This is the foundation used by typed page params and page query support.

## Type coercion

One of the most important Zova enhancements is automatic coercion.

This matters because route params and query values often arrive as strings, while the page controller wants the final typed values.

That is why schemas such as:

```typescript
z.number()
```

can still support route-driven values more naturally than raw parsing code.

## Boolean coercion

Zova also applies special handling for boolean-like string values.

Representative false-like values include:

- `'false'`
- `'undefined'`
- `'null'`
- `'0'`

This makes route/query handling more practical in real app flows.

## JSON object support in query

Zova can support JSON-shaped data in query values.

Representative pattern:

```typescript
export const QuerySchema = z.object({
  user: z
    .object({
      name: z.string(),
      age: z.number(),
    })
    .optional(),
});
```

That allows page code to work with typed nested query objects instead of flattening everything into ad hoc string logic.

## Array support in query

Zova can also support array-shaped query values.

Representative pattern:

```typescript
export const QuerySchema = z.object({
  colors: z.array(z.string()).optional(),
});
```

This is especially useful for filter-like or multi-select page behavior.

## Relationship to page params and query

Zod is most often encountered in the frontend docs through:

- [Page Params Guide](/frontend/page-params-guide)
- [Page Query Guide](/frontend/page-query-guide)

Those guides explain how the schemas are attached to routing behavior, while this guide focuses on the schema model itself.

## Why this matters for AI workflows

When AI edits Zova route-driven page behavior, it should ask:

1. should this page value be expressed through a Zod schema instead of manual parsing?
2. does the schema need coercion, default values, nested objects, or arrays?
3. is this concern really page params, page query, or a broader reusable schema?
4. should the typed schema be shared rather than duplicated across pages?

That helps AI keep frontend routing behavior aligned with Zova’s schema-first page model.
