# Route Alias Guide

This guide explains how route aliases work in Zova within the Cabloy monorepo.

## Why route aliases exist

In a modular routing system, the real page path and the user-facing path are not always the same.

A home-page example shows this clearly:

- a module may provide a real internal page path
- users may still expect a simpler public-facing path such as `/`

Route aliases bridge that gap.

Aliases are an explicit public-URL contract, not a default convenience layer. Ordinary business routes without `locale` params should keep their canonical module path and omit an app-config alias. Use an alias when the route is a documented system entry, compatibility path, or intentionally designed user-facing URL; locale-aware public routes are another common exception.

## Basic routing flow

The navigation flow can be described in terms of:

1. navigate to a path
2. resolve the owning module
3. load the module
4. inject the module routes into the route table
5. find the matching route and render the component

This is important because route aliasing is part of module-aware navigation, not an isolated string rewrite.

## Global config for aliases

Aliases belong in global config.

Representative pattern:

```typescript
config.routes = {
  path: {
    '/home/index': { alias: '/' },
    '/home/login': { alias: '/login' },
  },
  name: {
    'demo-todo:item': { alias: '/todo/:id' },
  },
};
```

## `path` vs `name`

The distinction matters after an alias has a documented reason:

- use `routes.path` for an approved static path-based alias;
- use `routes.name` when the approved alias depends on params-aware naming.

Do not introduce a static route name solely to use `routes.name`: a static exception can use `routes.path` instead.

## Generate a configured alias path

When application code needs a user-facing URL for a named route, use the canonical route name with `$router.getAliasPath(...)`:

```ts
const path = this.$router.getAliasPath('demo-todo:item', {
  params: {
    id: '42',
    locale: true,
  },
});
const absoluteUrl = this.$router.getAliasPath(
  'demo-todo:item',
  { params: { id: '42', locale: true } },
  true,
);
```

The helper returns the configured alias path, such as `/zh-cn/todo/42`, or `undefined` when that route name has no configured alias. Pass `true` as the third argument when an absolute URL is required; it uses the same host and public-path conversion as `$router.getPagePath(..., true)`. `locale: true` uses the active locale and omits the configured default locale from an optional locale segment.

Use the canonical generated route name. Do not construct `$alias:<name>` or strip `/__alias__` in application code: those are private router implementation details.

Use `$router.getPagePath(...)` for a known canonical path template, `$router.getAliasPath(...)` for a configured public alias by canonical route name, and `$router.resolveName(...)` for canonical named-route resolution. Do not add alias behavior to `getPagePath(...)`, because aliases are configured against route names rather than page-path templates.

## Implementation checks for route-alias changes

When changing user-facing routes, ask:

1. is this a real route change or just an alias change?
2. does the alias have an explicit system, compatibility, locale-aware, or user-facing URL reason?
3. does the alias belong in global config?
4. is the page params-aware, meaning the name-based alias path is the correct layer?
5. if the route is static, can `getPagePath(...)` and a path-keyed alias preserve the canonical route without adding a name?

That helps avoid breaking modular routing semantics and keeps ordinary business routes on their canonical paths.

## Where to read next

- If you want the broader public routing surface first, continue with [Page Route Guide](/frontend/page-route-guide).
- If the alias decision depends on route metadata or shell behavior, continue with [Page Meta Guide](/frontend/page-meta-guide).
- If you want the deeper routing runtime after the public surface is clear, descend into [Zova Router Under the Hood](/frontend/zova-router-under-the-hood).
