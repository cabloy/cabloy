# Editions Overview

This page is the editions hub for deciding which Cabloy baseline you are working with and which assumptions should follow from that choice.

Cabloy currently supports two related but distinct editions:

- **Cabloy Basic**
- **Cabloy Start**

They share one Cabloy fullstack architecture, but they are composed and optimized differently.

## How the names fit together

| Name         | Functional role                                                                   |
| ------------ | --------------------------------------------------------------------------------- |
| Cabloy       | The coordinated Node.js fullstack system.                                         |
| Vona         | Cabloy's backend framework and runtime layer.                                     |
| Zova         | Cabloy's frontend framework and application layer.                                |
| Cabloy Basic | The public reference and community edition baseline.                              |
| Cabloy Start | The public MIT-licensed business-system edition baseline in a sibling repository. |

Vona and Zova answer the architectural-layer question. Cabloy Basic and Cabloy Start answer the complete-edition-baseline question: both use the shared Cabloy architecture, but their UI, frontend flavors, modules, SSR baselines, project assets, generated outputs, root scripts, and onboarding paths can differ.

If you need a recommendation path, start with [Choosing Between Cabloy Basic and Cabloy Start](/editions/choosing-between-basic-and-start).

## How to approach editions work

For contributor and automation workflows in this repository, prefer this order:

1. identify the active edition before making UI-sensitive, flavor-sensitive, module-sensitive, or asset-sensitive assumptions
2. explain the shared Cabloy architecture once before branching into edition-specific notes
3. split documentation or workflow guidance only where the editions intentionally diverge
4. use explicit edition markers and flavor names instead of treating the editions as interchangeable

## Editions reading paths

Use this page as the main editions hub, then choose the path that matches your task.

### Selection path

Start here when the task is about choosing the right edition baseline or understanding their differences:

- [Choosing Basic vs Start](/editions/choosing-between-basic-and-start)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)

### Detection and workflow path

Use this path when the task is about repo-aware automation, flavor assumptions, or edition-safe workflow choices:

- [Edition Detection](/editions/detection)
- [Fullstack Introduction](/fullstack/introduction)
- [AI Development Introduction](/ai/introduction)

## Shared fullstack core

Both editions are built around the same core direction:

- **Vona** as the backend framework and runtime layer
- **Zova** as the frontend framework and application layer
- suite-based modules across the stack
- root-level `npm run vona` and `npm run zova` entrypoints
- CLI-backed workflows for generation, refactoring, metadata, and verification

This means the editions are related fullstack baselines, not unrelated products or alternatives to Vona and Zova.

## What "Basic" means

Cabloy Basic is the public reference and community edition of Cabloy.

- this public repository is marked with `__CABLOY_BASIC__`
- projects created with `npm create cabloy` follow the Cabloy Basic route
- the public docs and examples in this repo use Cabloy Basic as the default baseline

Cabloy Basic is the open-source community edition and is optimized for public reference, learning, and fast development workflows.

## What "Start" means

Cabloy Start is the public MIT-licensed edition maintained in its own repository.

- the public repository is marked with `__CABLOY_START__`
- users clone the public repository source directly, then run `npm run init`
- Start uses its own edition-specific flavors, SSR site baselines, and project assets

Cabloy Start is optimized as a business-system baseline for more complex systems while staying on the same Cabloy fullstack direction.

## Architecture layering

Most of the frontend engineering layer is shared, while the edition-specific UI layer differs.

### Shared frontend engineering layer

Across editions, Zova uses the same frontend framework direction and engineering tooling, including:

- Vue
- Vite
- Quasar tooling such as `quasar dev` and `quasar build`
- TanStack libraries where applicable

Here, Quasar is used for engineering tooling rather than as the edition UI component library.

### Edition-specific UI layer

The UI component strategy diverges by edition:

- **Cabloy Basic**: DaisyUI + Tailwind CSS
- **Cabloy Start**: Vuetify

This difference affects not only UI code, but also module composition, frontend flavor assumptions, SSR site baselines, examples, and AI workflow guidance.

## Edition-specific assets

The editions intentionally diverge in several surfaces:

- UI layer assumptions
- frontend flavor names
- suite and module composition
- admin/web SSR site baselines
- separate-repository structure and edition-specific project assets
- generated outputs and root scripts
- rules, skills, and docs used for AI vibe coding

For example:

- **Cabloy Basic** provides the `cabloy-basic` suites and the `cabloyBasicAdmin` / `cabloyBasicWeb` Zova flavors
- **Cabloy Start** uses public flavors such as `cabloyStartAdmin` and `cabloyStartWeb`

## Why the repo markers matter

The edition markers are not just labels for humans.

`__CABLOY_BASIC__` and `__CABLOY_START__` help tools, docs, and AI workflows choose the correct assumptions for:

- UI component usage
- flavor selection
- module availability
- SSR site expectations
- rules, skills, and verification guidance

This is why the two editions should be identified explicitly instead of being treated as interchangeable.

## Documentation rule

Write shared explanations once. Split or annotate only when a workflow changes because of:

- UI library assumptions
- frontend flavor names
- different modules or assets
- repository and initialization model
- edition-specific scripts, generated outputs, or AI workflow guidance
