# CSS-in-JS Guide

This guide explains the role of CSS-in-JS in Zova within the Cabloy monorepo.

## Why CSS-in-JS matters in Zova

Zova uses a built-in CSS-in-JS approach so styling can stay close to component and page logic without collapsing into uncontrolled global CSS.

This is often explained through TypeStyle, but the main point is not novelty. The goal is a styling system that stays flexible, scoped, and framework-friendly in larger applications.

## Core benefits

Several enduring benefits stand out:

- scoped styles that reduce conflicts
- dynamic style generation from reactive state
- token support independent of UI libraries
- theme support independent of UI libraries
- easier debugging through development-friendly class naming
- built-in template support for multiple UI-library strategies

## Choose the right styling mechanism

A practical decision map is:

| Use this | When it fits best |
| --- | --- |
| `this.$style(...)` | local scoped styles near one controller, render bean, or style bean |
| dedicated style bean with `BeanStyleBase` | the page or component has enough styling logic to deserve its own file or boundary |
| `@Css()` and `$cssBase` | shared/global style vocabulary should be reused across many pages or components |
| `$token` | style values should come from theme-defined design values instead of hardcoded literals |
| `$theme` | runtime behavior needs to read or switch the active theme or dark-mode state |

The important point is that these are not competing styling systems. They are connected surfaces inside one Zova styling architecture.

## Local scoped styles with `this.$style(...)`

`this.$style(...)` is the normal entrypoint for local scoped class generation.

Use it when the style belongs to one page, component, or style bean and should stay close to the current controller-oriented logic.

This is a good default for:

- one-off local classes
- styles driven by local runtime state
- styles that should remain scoped instead of becoming app-wide vocabulary

## Dedicated style beans with `BeanStyleBase`

When styling grows beyond a small local block, split it into a dedicated style bean instead of forcing everything to remain inline.

A practical rule is:

- use local `this.$style(...)` first when the styling is still small
- move into a dedicated style bean when the page or component needs a clearer styling boundary

This is an organizational split, not a different styling engine. Zova still uses the same CSS-in-JS model; it simply gives larger pages and components a better place to hold their style concerns.

## Shared/global styles with `@Css()` and `$cssBase`

Not every style should stay local.

Use shared/global styles when the application needs reusable style vocabulary that should be available across multiple pages or components.

A practical distinction is:

- use local scoped classes when the style belongs to one page or component
- use `@Css()` and `$cssBase` when the style should be shared as part of broader app-level styling vocabulary

That is the practical global-style story in Zova: shared styles still live inside the framework model instead of falling back to uncontrolled ad hoc global CSS.

## How styles consume tokens

When a value represents design meaning rather than a one-off literal, prefer `$token` over hardcoded values.

That is especially useful for:

- colors
n- spacing or sizing conventions owned by the theme
- component-surface values that should change with dark mode or brand theme

This keeps style logic flexible across themes and editions without changing the underlying styling architecture.

## Style -> token -> theme flow

A useful mental model is:

1. `this.$style(...)` generates scoped classes
2. those classes can consume `this.$token`
3. token values come from the active theme
4. theme beans provide the concrete token values
5. runtime theme switching changes the active token set

That means CSS-in-JS, tokens, and themes are not separate ideas. They are one connected frontend styling flow.

For the token and theme lifecycle itself, also see [Theme Guide](/frontend/theme-guide).

## Debugging generated class names

CSS-in-JS class names are framework-generated for scoping, but they still remain debuggable during development.

A practical rule is:

- treat generated class names as framework output rather than as a hand-authored public CSS API
- use the development-friendly naming help to trace where a style came from when debugging

## Why UI-library independence matters

This is especially important in Cabloy because the two editions diverge in frontend stack choices:

- **Cabloy Basic** aligns with DaisyUI + TailwindCSS oriented examples
- **Cabloy Start** aligns with Vuetify-oriented modules

A UI-library-independent styling layer makes it easier for the same architectural ideas to survive across both editions.

## Styling in the controller-oriented model

In Zova, styling is not an unrelated afterthought. It fits into the same controller-oriented architecture as state and render logic.

That is why examples often use style generation directly from a controller or style-oriented bean rather than splitting everything into a separate CSS asset by default.

## What stays shared across editions

Across Cabloy Basic and Cabloy Start, the styling architecture itself stays shared:

- CSS-in-JS remains the primary styling model
- local scoped styles still use `$style`
- larger styling concerns can still move into dedicated style beans
- shared/global styling can still use `@Css()` and `$cssBase`
- token and theme behavior still form the same architecture
- runtime theme switching still belongs to the same `$theme` model

What may still vary by edition or UI library is:

- token shape details
- concrete token values
- theme-handler integration details
- surrounding utility-class or component-library conventions

That means edition differences usually change the surrounding UI stack, not the core styling architecture.

## Why this matters for AI workflows

When AI changes frontend styling in Zova, it should ask:

1. should this use the built-in CSS-in-JS path instead of ad hoc external CSS?
2. does the style depend on reactive or runtime state?
3. does the active edition affect only the UI library, while the styling architecture remains shared?
4. should token or theme mechanisms be used instead of hardcoded values?

That keeps style work aligned with Zova’s actual design.
