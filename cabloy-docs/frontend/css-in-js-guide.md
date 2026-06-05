# CSS-in-JS Guide

This page migrates the highest-value ideas from the legacy Zova CSS-in-JS introduction.

## Why CSS-in-JS matters in Zova

Zova uses a built-in CSS-in-JS approach so styling can stay close to component and page logic without collapsing into uncontrolled global CSS.

The legacy docs explain this through TypeStyle and emphasize that the goal is not novelty. The goal is a styling system that stays flexible, scoped, and framework-friendly in larger applications.

## Core benefits

The legacy docs highlighted several enduring benefits:

- scoped styles that reduce conflicts
- dynamic style generation from reactive state
- token support independent of UI libraries
- theme support independent of UI libraries
- easier debugging through development-friendly class naming
- built-in template support for multiple UI-library strategies

## Why UI-library independence matters

This is especially important in Cabloy because the two editions diverge in frontend stack choices:

- **Cabloy Basic** aligns with DaisyUI + TailwindCSS oriented examples
- **Cabloy Start** aligns with Vuetify-oriented modules

A UI-library-independent styling layer makes it easier for the same architectural ideas to survive across both editions.

## Styling in the controller-oriented model

In Zova, styling is not an unrelated afterthought. It fits into the same controller-oriented architecture as state and render logic.

That is why examples often use style generation directly from a controller or render-oriented bean rather than splitting everything into a separate CSS asset by default.

## Why this matters for AI workflows

When AI changes frontend styling in Zova, it should ask:

1. should this use the built-in CSS-in-JS path instead of ad hoc external CSS?
2. does the style depend on reactive or runtime state?
3. does the active edition affect only the UI library, while the styling architecture remains shared?
4. should token or theme mechanisms be used instead of hardcoded values?

That keeps style work aligned with Zova’s actual design.
