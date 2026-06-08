# Fullstack Introduction

Cabloy is a Node.js fullstack framework for AI vibe coding.

Use one framework system instead of stitching together separate backend and frontend stacks.

With **Vona** on the backend, **Zova** on the frontend, and CLI-first workflows across the stack, Cabloy turns common scaffolding, metadata, refactors, and verification into explicit commands so AI vibe coding can stay more accurate, use fewer tokens, and move faster.

## What Cabloy emphasizes

- **One framework system** — build backend and frontend in one Node.js fullstack architecture
- **Vona + Zova** — use aligned backend and frontend frameworks instead of stitching together separate backend and frontend stacks
- **Multiple delivery modes** — support SSR, SPA, Web, and Admin applications with shared conventions
- **CLI-first workflows for AI vibe coding** — turn common scaffolding, metadata, refactors, and verification into explicit commands so AI vibe coding can stay more accurate, use fewer tokens, and move faster
- **Monorepo-native development** — keep framework source, docs, and tooling aligned in one repository model

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

Most framework concepts are shared across Cabloy Basic and Cabloy Start. The documentation prefers a common-first explanation, then adds edition-specific notes only where the repos intentionally diverge.

Use the [Editions Overview](/editions/overview) page whenever a task depends on UI library, module composition, or private-value project boundaries.
