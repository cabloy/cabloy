# Page Query Guide

This guide explains how typed page query handling works in Zova within the Cabloy monorepo.

## Why page query support matters

Zova enhances page query handling with type-aware support so routing data can be read and passed in a more structured way.

That is important because query values are part of page behavior, not just incidental URL text.

## Add query support to a page

Example: add query support for page `counter`.

```bash
npm run zova :refactor:pageQuery counter -- --module=training-student
```

## Add query schema

Query support becomes explicit through a Zod schema.

Representative pattern:

```typescript
export const ControllerPageCounterSchemaQuery = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
});
```

This matters because query parsing becomes typed and framework-aware instead of stringly-typed ad hoc access.

## Numeric query values

Query values are commonly strings at the URL boundary. On Zova's route/query parsing path, the Cabloy Zod query adapter converts a non-nil numeric value with `Number(...)` before ordinary `z.number()` validation. Use `z.number()` for numeric query fields such as `age`; when parsing succeeds, `this.$query.age` is a number.

Invalid numeric text still fails number validation rather than silently producing a usable value. `z.coerce.number()` is normally redundant for Zova page query schemas, but may be appropriate at a different input boundary that does not use the Zova adapter. See [Zova route/query number parsing](/frontend/zod-guide#zova-routequery-number-parsing) for the adapter's nil semantics and scope.

## Use query values

Representative pattern:

```typescript
class ControllerPageCounter {
  render() {
    return (
      <div>
        <div>{this.$query.name}</div>
        <div>{this.$query.age}</div>
      </div>
    );
  }
}
```

## Pass query values during navigation

Representative pattern:

```typescript
const url = this.$router.getPagePath('/training/student/counter', {
  query: {
    name: 'tom',
    age: 18,
  },
});
this.$router.push(url);
```

## More complex query shapes

Query schemas do not have to stop at flat primitives.

Representative patterns include nested objects and arrays:

```typescript
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

That lets page code consume richer route-driven state such as filter collections or nested search payloads without dropping back to manual string parsing.

## Implementation checks for page-query changes

When adding page query behavior, do not fall back to raw string parsing.

A better default is:

1. add the query skeleton with the Zova refactor command
2. define the schema explicitly
3. use `this.$query` and typed navigation helpers
4. keep query behavior aligned with the page controller model

For the broader schema model behind `z`, coercion, nested objects, and array support, see [Zod Guide](/frontend/zod-guide).
