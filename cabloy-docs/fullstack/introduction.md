# Fullstack Introduction

Cabloy is a Node.js fullstack framework for AI vibe coding.

Use one fullstack framework instead of stitching together separate backend and frontend stacks.

With Vona, Zova, suite-based modules, and CLI-first workflows, Cabloy turns common scaffolding, metadata, refactors, and verification into explicit commands for faster, more accurate AI vibe coding.

## What Cabloy emphasizes

- **One framework system** — build backend and frontend in one fullstack architecture
- **Vona + Zova** — use aligned backend and frontend frameworks for code sharing, workflow reuse, and cross-stack consistency
- **Suite-based modular system** — organize capabilities as suites and modules so services, features, metadata, and tooling evolve in composable units
- **Multiple delivery modes** — deliver SSR, SPA, Web, and Admin applications with shared conventions across the stack
- **CLI-first workflows for AI vibe coding** — turn common scaffolding, metadata, refactors, and verification into explicit commands for faster, more accurate AI vibe coding
- **Monorepo-native development** — keep framework source, docs, and tooling aligned in one monorepo workflow

## How to approach fullstack work

For contributor and automation workflows in this repository, prefer this order:

1. inspect the root `package.json` and shared monorepo scripts first
2. inspect `npm run vona`, `npm run zova`, and the shared fullstack CLI workflow before inventing custom steps
3. detect the active edition before making UI-sensitive or flavor-sensitive assumptions
4. explain shared cross-stack concepts once, then isolate edition-specific notes only where the editions intentionally diverge

## Fullstack reading paths

Use this page as the main fullstack hub, then choose the path that matches your task.

### Getting started path

Start here when you want the shortest route to a working monorepo mental model:

- [Quickstart](/fullstack/quickstart)
- [Suites and Modules](/fullstack/suites-and-modules)
- [CLI](/fullstack/cli)
- [VS Code Extensions](/fullstack/vscode-extensions)

### Architecture and integration path

Use this path when the task is about how backend and frontend stay aligned inside one framework system:

- [Comparison with Other Frameworks](/fullstack/comparison-with-other-frameworks)
- [Framework Performance](/fullstack/framework-performance)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

### Edition-aware collaboration path

Use this path when the task depends on edition boundaries, UI assumptions, or cross-repo delivery differences:

- [Edition Collaboration Differences](/fullstack/edition-collaboration-differences)
- [Editions Overview](/editions/overview)
- [Choosing Basic vs Start](/editions/choosing-between-basic-and-start)

## Shared architecture

- **Vona** provides the backend framework capabilities.
- **Zova** provides the frontend framework capabilities.
- The root repository coordinates the two through shared scripts, shared terminology, and a shared release story.

This combination keeps backend and frontend development close enough for code sharing, workflow reuse, and AI vibe coding workflows.

## Cabloy fullstack framework principles

Cabloy’s fullstack model can be understood through two core principles.

### 1. Frontend build output participates directly in backend SSR

Zova owns the frontend application, but its build output is not treated as a completely separate artifact that the backend ignores.

In Cabloy’s fullstack flow:

- the frontend is built from Zova source
- the generated bundle and related SSR output are consumed by the Vona-side SSR runtime
- backend rendering and frontend hydration stay in one coordinated SSR path rather than two unrelated systems

In earlier standalone-repo explanations, this was often described as placing the frontend bundle into the backend for direct SSR rendering. In the current monorepo, the important principle stays the same while the workflow is cleaner: shared scripts and integrated repository structure let frontend build artifacts flow into the backend-side SSR process.

For the integration workflow and current monorepo shape, see [Vona + Zova Integration](/fullstack/vona-zova-integration) and [SSR Overview](/frontend/ssr-overview).

### 2. Type information flows in both directions

Cabloy does not treat type sharing as backend-to-frontend only. The collaboration loop is bidirectional:

- **Backend → Frontend**: Vona emits Swagger/OpenAPI contracts that Zova uses to generate frontend SDKs and related schema-aware helpers
- **Frontend → Backend**: Zova generates structural metadata and types such as routes, components, and icons, which can be reflected back into backend-side tooling and type hints

This two-way contract loop reduces duplicate declarations and lets backend and frontend evolve from generated source truth instead of hand-maintained memory.

Start with the canonical [Contract Loop Playbook](/fullstack/contract-loop-playbook), then use the directional deep dives [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) and [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend).

Use the playbook to distinguish four cases clearly:

- forward chain
- reverse chain
- consumer drift
- local dependency drift

The contract-loop model is shared across Cabloy Basic and Cabloy Start. Detect the edition to choose concrete flavor commands and generated-output paths, not to redefine the workflow model.

When the reverse direction involves newly added frontend resources that backend tooling or backend metadata will consume, treat that as an operational handoff rather than a conceptual one: refresh generated frontend output, run the relevant flavor build, then run `npm run deps:vona`, and if the generated `.zova-rest` artifacts already contain the expected changes but Vona still sees stale shared types, rebuild `vona/node_modules` and reinstall dependencies.

## How the fullstack system stays connected

At the repository level, shared scripts, shared terminology, and CLI-first workflows keep Vona and Zova aligned as one framework system.

For the shared terminal-first workflow model, see [Fullstack CLI](/fullstack/cli).

## Why the monorepo matters

The monorepo makes it possible to keep backend and frontend concepts, tooling, and generated outputs aligned from source rather than memory, for example:

- how frontend routes and components are reflected back into backend type hints
- how backend OpenAPI and DTO output feeds frontend SDK generation
- how common concepts can be documented once before edition-specific notes branch out
- how Vona and Zova CLI capabilities can be reused instead of rebuilding scaffolding by hand

## Technology Stack

### General

| Package    | Version  |
| ---------- | -------- |
| TypeScript | `^5.9.3` |
| Zod        | `^4.3.6` |

### Backend (Vona)

| Package                          | Version   |
| -------------------------------- | --------- |
| Koa                              | `^3.2.0`  |
| Knex                             | `^3.2.9`  |
| Redis Client (`ioredis`)         | `^5.10.1` |
| SQLite Driver (`better-sqlite3`) | `^12.9.0` |

### Frontend (Zova)

| Package        | Version     |
| -------------- | ----------- |
| Vue            | `^3.5.32`   |
| Vite           | `^8.0.14`   |
| Quasar         | `^2.19.3`   |
| TanStack Query | `^5.100.10` |
| TanStack Form  | `^1.32.0`   |
| TanStack Table | `^8.21.3`   |

### Edition-specific UI Stack

- **Cabloy Basic**: DaisyUI + Tailwind CSS
- **Cabloy Start**: Vuetify

## Edition impact

Most framework concepts are shared across Cabloy Basic and Cabloy Start because both editions follow the same Cabloy fullstack core. The documentation prefers a common-first explanation, then adds edition-specific notes only where the editions intentionally diverge.

Across editions, the frontend engineering layer stays mostly shared through Zova, Vue, Vite, Quasar tooling, and related libraries. The edition-specific UI layer then diverges between DaisyUI + Tailwind CSS for Cabloy Basic and Vuetify for Cabloy Start.

Use the [Editions Overview](/editions/overview) page whenever a task depends on UI library assumptions, flavor names, module composition, SSR site baselines, distribution boundaries, or AI workflow guidance.
