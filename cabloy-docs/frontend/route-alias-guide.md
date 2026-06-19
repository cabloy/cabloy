# Route Alias Guide

This guide explains how route aliases work in Zova within the Cabloy monorepo.

## Why route aliases exist

In a modular routing system, the real page path and the user-facing path are not always the same.

A home-page example shows this clearly:

- a module may provide a real internal page path
- users may still expect a simpler public-facing path such as `/`

Route aliases bridge that gap.

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

The distinction matters:

- use `routes.path` for normal path-based aliases
- use `routes.name` when the route depends on params-aware naming

## Implementation checks for route-alias changes

When changing user-facing routes, ask:

1. is this a real route change or just an alias change?
2. does the alias belong in global config?
3. is the page params-aware, meaning the name-based alias path is the correct layer?

That helps avoid breaking modular routing semantics.

## Where to read next

- If you want the broader public routing surface first, continue with [Page Route Guide](/frontend/page-route-guide).
- If the alias decision depends on route metadata or shell behavior, continue with [Page Meta Guide](/frontend/page-meta-guide).
- If you want the deeper routing runtime after the public surface is clear, descend into [Zova Router Under the Hood](/frontend/zova-router-under-the-hood).
