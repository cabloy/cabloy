# Fullstack Introduction

Cabloy is a fullstack framework built around a single source tree where backend and frontend development stay close enough for code sharing, workflow reuse, and AI-assisted implementation.

## Shared architecture

- **Vona** provides the backend framework capabilities.
- **Zova** provides the frontend framework capabilities.
- The root repository coordinates the two through shared scripts, shared terminology, and a shared release story.

In the current monorepo root, the main command entrypoints are:

- `npm run vona`
- `npm run zova`
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run tsc`

These are defined in the root `package.json` and should be the first place an agent or contributor checks before inventing a custom workflow.

## Why the monorepo matters for workflow selection

The monorepo makes it possible to answer cross-stack questions from source rather than memory, for example:

- how frontend routes and components are reflected back into backend type hints
- how backend OpenAPI and DTO output feeds frontend SDK generation
- how edition-specific scripts differ between Cabloy Basic and Cabloy Start
- how Vona and Zova CLI commands can be reused instead of writing scaffolding manually

## Technology Stack

### General

| Package    | Version   |
| ---------- | --------- |
| TypeScript | `^5.9.3`  |
| Zod        | `^4.3.6`  |

### Backend (Vona)

| Package                            | Version   |
| ---------------------------------- | --------- |
| Koa                                | `^3.2.0`  |
| Knex                               | `^3.2.9`  |
| Redis Client (`ioredis`)           | `^5.10.1` |
| SQLite Driver (`better-sqlite3`)   | `^12.9.0` |

### Frontend (Zova)

| Package          | Version     |
| ---------------- | ----------- |
| Vue              | `^3.5.32`   |
| Vite             | `^8.0.14`   |
| Quasar           | `^2.19.3`   |
| TanStack Query   | `^5.100.10` |
| TanStack Form    | `^1.32.0`   |
| TanStack Table   | `^8.21.3`   |

### Edition-specific UI Stack

- **Cabloy Basic**: DaisyUI + Tailwind CSS
- **Cabloy Start**: Vuetify

## Common-first, edition-aware

Most framework concepts are shared across Cabloy Basic and Cabloy Start. The new documentation prefers a common-first explanation, then adds edition-specific notes only where the repos intentionally diverge.

Use the [Editions Overview](/editions/overview) page whenever a task depends on UI library, module composition, or private-value project boundaries.
