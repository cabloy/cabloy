# Frontend Foundation

This page migrates the most important architectural ideas from the legacy Zova introduction into the new unified docs site.

## What Zova is in Cabloy

Zova is the frontend half of the Cabloy fullstack architecture.

Its legacy positioning remains useful: an intuitive frontend framework that combines strengths associated with Vue3 reactivity, React-style TSX rendering, and Angular-style IOC.

## Why that matters in practice

The point of this combination is not branding. The point is to make large business systems feel more natural to write and maintain.

The legacy docs repeatedly emphasized three enduring ideas:

- intuitive reactive code
- elegant structure for complex systems
- strong extensibility through IOC and AOP patterns

## UI-library flexibility

The legacy introduction also made an important point that still matters in the new monorepo docs:

Zova is not tied to one UI library.

That flexibility matters directly for Cabloy’s edition model:

- **Cabloy Basic** currently aligns with DaisyUI + TailwindCSS oriented examples
- **Cabloy Start** aligns with Vuetify-oriented frontend modules and workflows

So docs and skills must separate shared Zova principles from edition-specific UI assumptions.

## Enduring frontend capabilities

From the legacy introduction, the highest-value Zova capabilities to preserve in the new docs are:

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
