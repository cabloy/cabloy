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

## Shared architecture

- **Vona** provides the backend framework capabilities.
- **Zova** provides the frontend framework capabilities.
- The root repository coordinates the two through shared scripts, shared terminology, and a shared release story.

This combination keeps backend and frontend development close enough for code sharing, workflow reuse, and AI vibe coding workflows.

## How the fullstack system stays connected

At the repository level, shared scripts, shared terminology, and CLI-first workflows keep Vona and Zova aligned as one framework system.

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

## Common-first, edition-aware

Most framework concepts are shared across Cabloy Basic and Cabloy Start because both editions follow the same Cabloy fullstack core. The documentation prefers a common-first explanation, then adds edition-specific notes only where the editions intentionally diverge.

Across editions, the frontend engineering layer stays mostly shared through Zova, Vue, Vite, Quasar tooling, and related libraries. The edition-specific UI layer then diverges between DaisyUI + Tailwind CSS for Cabloy Basic and Vuetify for Cabloy Start.

Use the [Editions Overview](/editions/overview) page whenever a task depends on UI library assumptions, flavor names, module composition, SSR site baselines, distribution boundaries, or AI workflow guidance.
