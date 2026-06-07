# Menu Guide

## Why menus matter in Cabloy SSR flows

In Cabloy, SSR menu retrieval can be treated as a reusable backend capability instead of a one-off frontend-only concern.

That matters because shared menu retrieval makes it easier to reuse navigation logic across modules and editions.

## Core SSR menu model

The `a-ssr` module provides a general SSR menu system.

A project can ignore the system menu model and implement its own retrieval logic, but the built-in model is useful because it improves reuse, consistency, and scalability.

## `bean.ssr`

Vona exposes a global bean `bean.ssr` for SSR-facing menu retrieval.

A representative usage pattern is:

```typescript
const res = await this.bean.ssr.retrieveMenus(publicPath);
```

This allows a module-level menu service to:

1. ask the shared SSR menu system for the effective menu set
2. fall back to default local menus when needed

The current `home-base` implementation in this repo follows exactly that pattern in its menu service, which keeps this guide grounded in the real out-of-the-box SSR path.

## Fallback strategy

A practical menu service can:

- try shared SSR menu retrieval first
- return a module-defined default menu if no shared menu is available

That keeps menu integration flexible without giving up framework-level reuse.

## Menu API shape

A backend controller can expose the menu retrieval path directly:

```typescript
@Web.get(':publicPath?')
@Api.body(v.object(DtoMenus))
@Passport.public()
async retrieveMenus(@Arg.param('publicPath', v.optional()) publicPath?: string) {
  return await this.scope.service.menu.retrieveMenus(publicPath);
}
```

This makes menu retrieval part of the broader backend contract surface.

In the current repo implementation, the out-of-the-box menu controller is public and delegates directly to `this.scope.service.menu.retrieveMenus(publicPath)`.

## Relationship to frontend integration

Menu retrieval is especially relevant in SSR-sensitive frontend flows.

The backend menu contract should be read together with frontend routing, SSR, and page-loading behavior, especially when different editions expose different module or menu structures.

A practical boundary is:

- backend decides how menus are retrieved, merged, and defaulted
- frontend decides how those menu DTOs are rendered into route or navigation state

That split helps avoid re-implementing menu policy independently on both sides.

## Implementation checks for SSR menu changes

When editing SSR menu behavior, ask:

1. should the logic use `bean.ssr.retrieveMenus(...)` instead of inventing a parallel retrieval path?
2. is there a default fallback menu that should remain available?
3. does the menu contract belong in backend API design, frontend route design, or both?
4. does the active edition affect the menu structure or public path assumptions?

That helps AI keep menu behavior aligned with Cabloy’s shared SSR architecture.
