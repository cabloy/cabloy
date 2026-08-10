# Page Route Guide

This guide explains how page route records work in Zova within the Cabloy monorepo.

## Why route records matter

When a page is created, Zova automatically creates a route record.

That route record is the framework-level description of how the page is reached, loaded, authenticated, and rendered within the broader application model and app shell.

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

These route fields are the most important:

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

Aliases are supported, but alias handling belongs in the broader routing configuration rather than being treated as an isolated route-local trick.

## `meta`

The route meta surface includes important behavior such as:

- absolute-path behavior
- layout choice
- authentication requirement
- URL-locale handling through `meta.locale`
- component key behavior
- keepAlive behavior
- SSR profile and nested `meta.ssrProfileOptions.responseCache` behavior

This is one reason route records matter so much: they are not just URL declarations. They are an application-behavior surface.

## Route -> shell -> routed page

A useful frontend mental model is:

1. the route record identifies the page
2. route metadata chooses the logical shell/layout
3. the resolved shell hosts the routed page
4. guards and aliases can still affect how the page is reached

That is why routing in Zova is not only about URLs. It is also about how the app shell and navigation policy shape the visible screen.

### Layout selection

If a page route does not specify a layout, Zova uses the default layout.

Representative route shape:

```typescript
export const routes: IModuleRoute[] = [
  {
    path: 'counter',
    component: ZPageCounter,
    meta: {
      layout: 'default',
    },
  },
];
```

The system also distinguishes common built-in layout placeholders such as:

- `empty`
- `default`

These names act as logical layout choices rather than hard-coded component filenames.

A representative env mapping looks like this:

```txt
env/.env
LAYOUT_COMPONENT_EMPTY = home-layout:layoutEmpty
LAYOUT_COMPONENT_DEFAULT = home-layout:layoutTabs
```

That means route metadata chooses the logical layout, while env/config decides which actual layout component should back that choice for the active runtime variant.

This is the practical app-shell boundary in Zova: routed pages do not appear alone. They appear inside the resolved layout shell for the current runtime variant.

For the thin root app host that renders the routed tree before layout-specific behavior continues, see [Zova App Guide](/frontend/zova-app-guide).

In the current Basic source, that shell is represented concretely by admin-style, web-style, and empty/minimal layout implementations.

For the broader runtime-selection model behind env and flavor-aware configuration, see [Environment and Config Guide](/frontend/environment-config-guide).
For the onboarding path that leads into shell selection, also see [Frontend Quickstart](/frontend/quickstart).

## Relationship to guards and aliases

Layout selection, navigation guards, and aliases are closely related but they solve different problems:

- route metadata chooses the logical shell and route behavior
- guards decide whether navigation should continue, redirect, or enrich route state
- aliases provide alternate entry paths without changing the main route identity model

Read together with:

- [A-Router Guide](/frontend/a-router-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)
- [Route Alias Guide](/frontend/route-alias-guide)
- [Frontend Quickstart](/frontend/quickstart)

If your next question is no longer about the public route record itself but about the `a-router` package that makes routes operational, continue with [A-Router Guide](/frontend/a-router-guide).

## Implementation checks for page-routing changes

When editing page routing, do not only change the URL string.

It should also check whether the route change affects:

- params typing
- auth behavior
- layout behavior
- whether `meta.locale` should participate in URL-locale behavior
- SSR profile and nested `meta.ssrProfileOptions.responseCache` behavior
- metadata regeneration
