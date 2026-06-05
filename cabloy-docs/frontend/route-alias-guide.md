# Route Alias Guide

This page migrates the highest-value ideas from the legacy Zova route-alias documentation.

## Why route aliases exist

In a modular routing system, the real page path and the user-facing path are not always the same.

The legacy docs used the home-page example to show this clearly:

- a module may provide a real internal page path
- users may still expect a simpler public-facing path such as `/`

Route aliases bridge that gap.

## Basic routing flow

The legacy explanation described the navigation flow in terms of:

1. navigate to a path
2. resolve the owning module
3. load the module
4. inject the module routes into the route table
5. find the matching route and render the component

This is important because route aliasing is part of module-aware navigation, not an isolated string rewrite.

## Global config for aliases

The legacy docs emphasize that aliases belong in global config.

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

## Why this matters for AI workflows

When AI changes user-facing routes, it should ask:

1. is this a real route change or just an alias change?
2. does the alias belong in global config?
3. is the page params-aware, meaning the name-based alias path is the correct layer?

That helps avoid breaking modular routing semantics.
