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

- **Shared frontend engineering layer**: both editions follow the same Zova-centered frontend direction, with Vue, Vite, Quasar tooling, and related libraries
- **Cabloy Basic UI layer**: current public docs and examples align with DaisyUI + Tailwind CSS
- **Cabloy Start UI layer**: the private commercial edition aligns with Vuetify-oriented frontend workflows and may use different module composition and SSR site baselines

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

For the deeper architectural concepts behind IoC, module boundaries, and scope-based resources, see [IoC and Beans](/frontend/ioc-and-beans), [Modules and Suites](/frontend/modules-and-suites), and [Module Scope](/frontend/module-scope). For the runtime-variant and startup model, see [Environment and Config Guide](/frontend/environment-config-guide), [App Startup Guide](/frontend/app-startup-guide), and [System Startup Guide](/frontend/system-startup-guide).

## Recommended reading path for architectural source reading

If you want a compact path from public architecture to source-level understanding, use this order:

1. [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
2. [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison)
3. [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
4. [Zova Source Reading Map](/frontend/zova-source-reading-map)
5. [IoC and Beans](/frontend/ioc-and-beans)
6. [Page Guide](/frontend/page-guide)
7. [Component Guide](/frontend/component-guide)
8. [Model Architecture](/frontend/model-architecture)
9. [Model State Guide](/frontend/model-state-guide)
10. [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
11. [Using ModelResource in Your Module](/frontend/model-resource-usage-guide)
12. [Resource Model Best Practices](/frontend/model-resource-best-practices)
13. [Resource Model Cookbook](/frontend/model-resource-cookbook)

Use this order when you want to understand both the public mental model and the shortest source-reading routes without collapsing Zova back into generic Vue habits.

If your main goal is resource-oriented frontend design, the model-focused subpath is:

1. [Model Architecture](/frontend/model-architecture)
2. [Model State Guide](/frontend/model-state-guide)
3. [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
4. [Using ModelResource in Your Module](/frontend/model-resource-usage-guide)
5. [Resource Model Best Practices](/frontend/model-resource-best-practices)
6. [Resource Model Cookbook](/frontend/model-resource-cookbook)

## Why this matters for AI development

AI systems should not treat Zova as generic Vue with a few utilities.

Instead, they should:

- preserve Zova’s model, IOC, and AOP conventions
- detect the active edition before assuming a UI-library workflow
- prefer the Zova CLI for scaffolding and refactor work
- verify that the generated or edited code still matches Zova’s actual architecture
