# Cabloy

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cabloy/cabloy/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/cabloy.svg?style=flat-square&label=cabloy)](https://www.npmjs.com/package/cabloy)
[![npm downloads](https://img.shields.io/npm/dm/cabloy?color=orange&label=downloads)](https://www.npmjs.com/package/cabloy)
[![Docs](https://img.shields.io/badge/docs-cabloy-4f46e5.svg?style=flat-square)](https://docs.cabloy.com)
[![Demo](https://img.shields.io/badge/demo-cabloy.com-059669.svg?style=flat-square)](https://cabloy.com)

Cabloy is a Node.js fullstack framework for AI vibe coding.

Use one framework system instead of stitching together separate backend and frontend stacks.

With **Vona** on the backend, **Zova** on the frontend, and CLI-first workflows across the stack, Cabloy turns common scaffolding, metadata, refactors, and verification into explicit commands so AI coding can stay more accurate, use fewer tokens, and move faster.

[Documentation](https://docs.cabloy.com) · [npm](https://www.npmjs.com/package/cabloy) · [Web Demo](https://cabloy.com) · [Admin Demo](https://cabloy.com/admin) · [GitHub](https://github.com/cabloy/cabloy)

## Get Started

### Prerequisites

Before creating a new Cabloy project, make sure your environment has:

| Name       | Version     |
| ---------- | ----------- |
| pnpm       | `>=10.19.0` |
| Node.js    | `>=24.4.0`  |
| Redis      | `>=7.2.6`   |
| SQLite3    | `Built-in`  |
| MySQL      | `>=8`       |
| PostgreSQL | `>=16`      |

- `Redis`: powers queue, schedule, startup, broadcast, caching, two-layer cache, and redlock
- `SQLite3`: if you use `better-sqlite3`, set up `node-gyp` before installing dependencies

Create a new Cabloy project:

```bash
npm create cabloy
```

The generated project already includes `CLAUDE.md` and the `.claude/` workspace assets. Open this project in Claude Code and start coding immediately with project-specific guidance.

Then continue with the framework docs:

- [Fullstack Quickstart](https://docs.cabloy.com/fullstack/quickstart)
- [Documentation](https://docs.cabloy.com)
- [Fullstack Introduction](https://docs.cabloy.com/fullstack/introduction)
- [Backend Introduction](https://docs.cabloy.com/backend/introduction)
- [Frontend Introduction](https://docs.cabloy.com/frontend/introduction)
- [Editions Overview](https://docs.cabloy.com/editions/overview)

To upgrade an existing Cabloy project:

```bash
npm run upgrade
```

## Highlights

- **One framework system** — build backend and frontend in one Node.js fullstack architecture
- **Vona + Zova** — use aligned backend and frontend frameworks instead of stitching together separate backend and frontend stacks
- **Multiple delivery modes** — support SSR, SPA, Web, and Admin applications with shared conventions
- **CLI-first workflows for AI coding** — turn common scaffolding, metadata, refactors, and verification into explicit commands so AI coding can stay more accurate, use fewer tokens, and move faster
- **Monorepo-native development** — keep framework source, docs, and tooling aligned in one repository model

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

## Contributing

Contributions to the Cabloy framework, docs, and tooling are welcome.

Use the root [package.json](https://github.com/cabloy/cabloy/blob/main/package.json) as the shared workflow entrypoint:

```bash
npm run init
npm run dev
npm run tsc
npm run test
npm run build
```

For more details, see:

- [Repo Scripts](https://docs.cabloy.com/reference/repo-scripts)
- [Package Map](https://docs.cabloy.com/reference/package-map)
- [AI Development Introduction](https://docs.cabloy.com/ai/introduction)

Contribution guidelines:

- prefer CLI-backed workflows with `npm run vona` and `npm run zova`
- put user-facing and agent-facing guidance in [docs.cabloy.com](https://docs.cabloy.com)
- put maintainer rationale, architecture notes, and ADRs in [.docs-internal/](https://github.com/cabloy/cabloy/tree/main/.docs-internal)
- verify framework changes with the narrowest meaningful checks first, then shared root scripts when broader confidence is needed

To report bugs or propose changes, use [GitHub Issues](https://github.com/cabloy/cabloy/issues) or open a pull request in [github.com/cabloy/cabloy](https://github.com/cabloy/cabloy).

## Community

- [GitHub Issues](https://github.com/cabloy/cabloy/issues)
- [X / Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## License

[MIT](https://github.com/cabloy/cabloy/blob/main/LICENSE)
