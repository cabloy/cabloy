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

## Zova route/query number parsing

Cabloy Basic pins `zod` in `zova/pnpm-workspace.yaml` to `npm:@cabloy/zod@4.3.8`. Zova's route/query parsing path uses the Cabloy Zod query adapter to prepare URL values before ordinary Zod validation.

For a non-nil numeric route or query value, the adapter applies `Number(value)` before `z.number()` validates it. Therefore, use `z.number()` for numeric fields in Zova page params and query schemas:

```typescript
export const ControllerPageCounterSchemaQuery = z.object({
  age: z.number().optional(),
});
```

When parsing succeeds, `this.$query.age` is a number. There is normally no need to add `z.coerce.number()` or a manual `Number(...)` conversion at this boundary.

The adapter preserves its nil semantics: an empty string, `'undefined'`, or `'null'` is handled as an absent or null value rather than as an ordinary number. Invalid numeric text becomes `NaN` and still fails normal number validation. This behavior belongs to Zova's route/query parsing path; do not infer it for an arbitrary standalone `Zod.parse` call. Use `z.coerce.number()` when handling a different input boundary that does not use the Zova adapter.

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

## Representative page-oriented schemas

A page can combine param and query schemas so route-driven input stays typed end to end.

Representative patterns:

```typescript
export const ControllerPageCounterSchemaParams = z.object({
  id: z.number().optional().default(0),
});

export const ControllerPageCounterSchemaQuery = z.object({
  user: z
    .object({
      name: z.string(),
      age: z.number(),
    })
    .optional(),
  colors: z.array(z.string()).optional(),
});
```

Representative page access pattern:

```typescript
class ControllerPageCounter {
  render() {
    return (
      <div>
        <div>id: {this.$params.id}</div>
        <div>name: {this.$query.user?.name}</div>
        <div>colors: {this.$query.colors?.join(',')}</div>
      </div>
    );
  }
}
```

## Relationship to page params and query

Zod is most often encountered in the frontend docs through:

- [Page Params Guide](/frontend/page-params-guide)
- [Page Query Guide](/frontend/page-query-guide)

Those guides explain how the schemas are attached to routing behavior, while this guide focuses on the schema model itself.

## Implementation checks for schema-driven route-state changes

When editing Zova route-driven page behavior, ask:

1. should this page value be expressed through a Zod schema instead of manual parsing?
2. does the schema need coercion, default values, nested objects, or arrays?
3. is this concern really page params, page query, or a broader reusable schema?
4. should the typed schema be shared rather than duplicated across pages?

That helps AI keep frontend routing behavior aligned with Zova’s schema-first page model.
