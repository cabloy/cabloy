# Frontend Foundation

This guide explains the core architectural role of Zova in the Cabloy monorepo.

## What Zova is in Cabloy

Zova is the frontend half of the Cabloy fullstack architecture.

It is an intuitive frontend framework that combines strengths associated with Vue3 reactivity, React-style TSX rendering, and Angular-style IOC.

## Why that matters in practice

The point of this combination is not branding. The point is to make large business systems feel more natural to write and maintain.

Three enduring ideas define this design:

- intuitive reactive code
- elegant structure for complex systems
- strong extensibility through IOC and AOP patterns

## UI-library flexibility

One point still matters throughout the monorepo docs:

Zova is not tied to one UI library.

That flexibility matters directly for Cabloy’s edition model:

- **Cabloy Basic** currently aligns with DaisyUI + TailwindCSS oriented examples
- **Cabloy Start** aligns with Vuetify-oriented frontend modules and workflows

So docs and skills must separate shared Zova principles from edition-specific UI assumptions.

## Enduring frontend capabilities

The highest-value Zova capabilities to preserve in the unified docs are:

- SSR support across `SSR`, `SPA`, `Web`, and `Admin` flows
- dual-layer tabs navigation
- CRUD-oriented rendering patterns
- model-based unified state management
- CSS-in-JS and theme support
- IOC + AOP extensibility
- compatibility with multiple UI-library strategies

## Why this matters for AI development

AI systems should not treat Zova as generic Vue with a few utilities.

Instead, they should:

- preserve Zova’s model, IOC, and AOP conventions
- detect the active edition before assuming a UI-library workflow
- prefer the Zova CLI for scaffolding and refactor work
- verify that the generated or edited code still matches Zova’s actual architecture
