# Theme Guide

This guide explains how themes work in Zova within the Cabloy monorepo.

## Why Zova themes matter

Zova provides a theme system that is independent of any one UI library and supports theme switching out of the box.

This matters because Cabloy needs a frontend architecture that can survive across different edition-specific UI stacks.

## Two theme dimensions

Two major dimensions of theme switching are:

- **light/dark mode** with `light`, `dark`, and `auto`
- **brand style** changes, often centered on brand colors but not limited to them

This is an important design point: theming is not only dark-mode toggling. It is also a broader token and branding system.

## `$theme`

Zova injects `$theme` into `BeanBase`, so any bean instance can access theme state through `this.$theme`.

Important properties include:

- `name`
- `darkMode`
- `dark`
- `token`

Representative method:

- `toggleDark`

This is also why `$theme` and `$token` should be read together rather than as unrelated APIs.

## Tokens as the contract between style and theme

A token is the design-value layer that sits between CSS-in-JS styles and the active theme.

A practical split is:

- styles decide where values are consumed
- tokens define the reusable design vocabulary
- themes provide the concrete active token values

That is why token-driven styling scales better than scattering hardcoded values across many pages and components.

## Why token shape is shared in architecture but not fixed across UI libraries

The token architecture is shared across Cabloy Basic and Cabloy Start, but the exact token shape can still vary.

A practical distinction is:

- the idea of token-driven styling is shared
- the concrete token fields can still reflect the active UI library, component conventions, or project theme design

This matters because edition-sensitive UI differences should not be mistaken for a different styling architecture.

## Theme beans

Each UI library provides a default theme bean, and theme beans are responsible for returning token values and deeper theme customizations.

A practical lifecycle is:

- theme bean code defines the concrete token payload
- the active theme exposes that payload through `$theme.token`
- pages and components consume those values through `$token`
- runtime theme switching swaps the active token set without changing the broader styling architecture

Representative pattern:

```typescript
@Theme()
export class ThemeDefault implements IThemeBase {
  async apply({ dark }: IThemeApplyParams) {
    const token: ThemeToken = {
      color: {
        primary: '#1976d2',
      },
      var: {
        borderColor: '#297acc',
      },
      component: {
        page: {
          background: dark ? '#121212' : '#fff',
          color: dark ? '#fff' : '#000',
        },
      },
    };
    return { token };
  }
}
```

## Custom themes

Custom theme beans can also be created by following the same pattern.

That makes the theme system programmable rather than locked to a small fixed set of predefined skins.

## Consume tokens in pages and components

In practice, pages and components usually should not hardcode design values when those values belong to the theme vocabulary.

A practical rule is:

- use `$token` when a page or component is consuming theme-defined design values
- use `$theme` when code needs to inspect or switch the current theme state itself

This keeps token consumption separate from theme-state control while still letting both surfaces work together.

## Runtime theme switching

Representative usage pattern:

```typescript
this.$theme.name =
  this.$theme.name === 'home-theme:default' ? 'home-theme:orange' : 'home-theme:default';
```

This illustrates that theme switching is an ordinary part of the application model and can be driven directly from code.

A useful distinction is:

- dark-mode switching changes the light/dark state of the active theme flow
- brand-theme switching changes which named theme provides the token set
- both still work through the same `$theme` and token architecture

## What stays shared across editions

Across Cabloy Basic and Cabloy Start, the core theme architecture remains shared:

- theme beans provide token values
- pages and components consume those values through `$token`
- runtime code can inspect or switch theme state through `$theme`
- dark mode and brand-theme switching stay part of the same model

What may still vary by edition or UI library is:

- the exact token shape
- concrete default token values
- integration details for a specific component library or visual system

## Implementation checks for theme-related changes

When changing theme behavior, ask:

1. should this change live in a theme bean instead of inlining colors into components?
2. is the change about dark mode, brand style, or both?
3. should the change be token-driven instead of component-specific?
4. does the active edition change the UI component library while preserving the same theme architecture?

That helps keep theme work scalable and edition-aware.
