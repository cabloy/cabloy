# Page Params Guide

This guide explains how typed page params work in Zova within the Cabloy monorepo.

## Why page params support matters

Zova enhances route params handling with typed support so page controllers can work with route parameters through a structured schema instead of ad hoc string access.

## Add params support to a page

Example: add params support for page `counter`.

```bash
npm run zova :refactor:pageParams counter -- --module=training-student
```

## Add params schema

Representative pattern:

```typescript
export const ControllerPageCounterSchemaParams = z.object({
  id: z.number().optional().default(0),
});
```

This is more than a type annotation.

Because route params arrive as strings at the URL level, the schema is also where Zova’s `z` wrapper can coerce the route value into the typed value that the page controller wants to consume.

## Route record requirements

A page route that declares or consumes dynamic params **must** define `route.name`. Do not use an unnamed route with params.

The route name is required because Zova uses the named route identity to generate and resolve the page's typed `params` schema at runtime. This initializes the controller's `$params` surface during SSR and client navigation. A params schema declaration alone does not make `$params` available if the route is unnamed.

Representative route idea:

```typescript
{
  name: 'counter',
  path: 'counter/:id?',
  component: ZPageCounter,
}
```

## Regenerate metadata

When the route definition changes, regenerate module metadata so the framework’s typed route information stays aligned.

```bash
npm run zova :tools:metadata training-student
```

For the broader schema model behind `z`, coercion, defaults, and nested structures, see [Zod Guide](/frontend/zod-guide).

## Use params in a page

Representative pattern:

```typescript
class ControllerPageCounter {
  render() {
    return <div>{this.$params.id}</div>;
  }
}
```

## Pass params during navigation

Representative pattern:

```typescript
const url = this.$router.getPagePath('/training/student/counter/:id?', {
  params: {
    id: 1,
  },
});
this.$router.push(url);
```

## Implementation checks for param-driven page changes

When adding or editing param-driven page behavior:

1. use the Zova refactor command when possible
2. define `route.name` whenever the route has dynamic params
3. regenerate metadata when route typing depends on it
4. use `this.$params` and typed router helpers instead of manual parsing
