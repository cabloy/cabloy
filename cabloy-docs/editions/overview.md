# Editions Overview

Cabloy currently supports two related but distinct editions:

- **Cabloy Basic**
- **Cabloy Start**

They share one Cabloy fullstack architecture, but they are distributed, composed, and optimized differently.

## Shared fullstack core

Both editions are built around the same core direction:

- **Vona** as the backend framework
- **Zova** as the frontend framework
- suite-based modules across the stack
- root-level `npm run vona` and `npm run zova` entrypoints
- CLI-backed workflows for generation, refactoring, metadata, and verification

This means the editions are related fullstack baselines, not unrelated products.

## What "Basic" means

Cabloy Basic is the public framework/reference edition.

- this public repository is marked with `__CABLOY_BASIC__`
- projects created with `npm create cabloy` follow the Cabloy Basic route
- the public docs and examples in this repo use Cabloy Basic as the default baseline

Cabloy Basic is the open-source community edition and is optimized for public reference, learning, and fast development workflows.

## What "Start" means

Cabloy Start is the private commercial edition.

- the private repository is marked with `__CABLOY_START__`
- access is granted through licensing, after which users clone the private repository source directly
- Start provides its own suites, flavors, SSR sites, and project assets for that edition

Cabloy Start is optimized as a commercial baseline for more complex business systems while staying on the same Cabloy fullstack direction.

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

- UI library assumptions
- frontend flavor names
- suite and module composition
- admin/web SSR site baselines
- private-value project structure and assets
- rules, skills, and docs used for AI vibe coding

For example:

- **Cabloy Basic** provides the `cabloy-basic` suites and the `cabloyBasicAdmin` / `cabloyBasicWeb` Zova flavors
- **Cabloy Start** provides the `cabloy-start` suites and the `cabloyStartAdmin` / `cabloyStartWeb` Zova flavors

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
- distribution and authorization model
- edition-specific scripts, generated outputs, or AI workflow guidance
