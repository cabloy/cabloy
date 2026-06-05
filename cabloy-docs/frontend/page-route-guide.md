# Page Route Guide

This page migrates the highest-value ideas from the legacy Zova page-route documentation.

## Why route records matter

When a page is created, Zova automatically creates a route record.

That route record is the framework-level description of how the page is reached, loaded, authenticated, and rendered within the broader application model.

## Representative route record

```typescript
import { ZPageCounter } from './.metadata/page/counter.js';

export const routes: IModuleRoute[] = [
  {
    name: 'counter',
    path: 'counter/:id?',
    component: ZPageCounter,
  },
];
```

## Core route fields

The legacy docs highlighted these route fields:

- `path`
- `name`
- `component`
- `alias`
- `meta`

These are the main surface area for page routing behavior.

## `path`

`path` defines the route path relative to the module. The framework then combines it with the module prefix to form the absolute route path.

This matters because path generation is modular by default.

## `name`

If a page uses params, the route name becomes especially important because typed param-aware routing depends on it.

## `component`

`component` points to the generated page wrapper such as `ZPageCounter`.

## `alias`

Aliases are supported, but the legacy docs note that alias handling belongs in the broader routing configuration rather than being treated as an isolated route-local trick.

## `meta`

The route meta surface includes important behavior such as:

- absolute-path behavior
- layout choice
- authentication requirement
- locale handling
- component key behavior
- keepAlive behavior
- SSR transfer-cache behavior

This is one reason route records matter so much: they are not just URL declarations. They are an application-behavior surface.

## Why this matters for AI workflows

When AI edits page routing, it should not only change the URL string.

It should also check whether the route change affects:

- params typing
- auth behavior
- layout behavior
- locale behavior
- SSR behavior
- metadata regeneration
