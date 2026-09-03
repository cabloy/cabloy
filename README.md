# Cabloy

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cabloy/cabloy/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/cabloy.svg?style=flat-square&label=cabloy)](https://www.npmjs.com/package/cabloy)
[![npm downloads](https://img.shields.io/npm/dm/cabloy?color=orange&label=downloads)](https://www.npmjs.com/package/cabloy)
[![Docs](https://img.shields.io/badge/docs-cabloy-4f46e5.svg?style=flat-square)](https://cabloy.com)
[![Demo](https://img.shields.io/badge/demo-cabloy.com-059669.svg?style=flat-square)](https://cabloy.com)

Cabloy is a Node.js fullstack framework for AI vibe coding.

**One fullstack system for AI vibe coding—bidirectional type sync, CLI-first workflows, docs, and skills.**

Instead of stitching separate backend and frontend stacks together, Cabloy keeps their contracts, tooling, and guidance connected in one repository. Vona is its backend framework and runtime layer, and Zova is its frontend framework and application layer. Cabloy Basic and Cabloy Start are related, complete edition baselines built on that shared architecture; see [Editions Overview](https://cabloy.com/editions/overview) for their deliberate differences.

[Documentation](https://cabloy.com) · [npm](https://www.npmjs.com/package/cabloy) · [Web Demo](https://cabloy.com) · [Admin Demo](https://cabloy.com/admin) · [GitHub](https://github.com/cabloy/cabloy)

## Fullstack Principles

Cabloy’s fullstack model is built around two core principles:

1. **Frontend build output participates directly in backend SSR**
   - Zova owns the frontend application source
   - the generated frontend bundle and SSR-related artifacts are consumed by the Vona-side SSR flow
   - backend rendering and frontend hydration stay on one coordinated delivery path

2. **Type information flows in both directions**
   - **Backend -> Frontend**: Vona emits Swagger/OpenAPI contracts that Zova can use to generate SDKs and related schema-aware helpers
   - **Frontend -> Backend**: Zova generates structural metadata and typing surfaces such as routes, components, and icons that can improve backend-side tooling and type hints

For the complete explanation, see [Fullstack Introduction](https://cabloy.com/fullstack/introduction), [Vona + Zova Integration](https://cabloy.com/fullstack/vona-zova-integration), [Backend OpenAPI to Frontend SDK](https://cabloy.com/fullstack/openapi-to-sdk), and [Frontend Metadata Back to Backend](https://cabloy.com/fullstack/frontend-metadata-to-backend).

## Get Started

### Prerequisites

Before creating a new Cabloy project, make sure your environment has:

| Name       | Version    |
| ---------- | ---------- |
| pnpm       | `>=11.5.2` |
| Node.js    | `>=24.4.0` |
| Redis      | `>=7.2.6`  |
| SQLite3    | `Built-in` |
| MySQL      | `>=8`      |
| PostgreSQL | `>=16`     |

- `Redis`: powers queue, schedule, startup, broadcast, caching, two-layer cache, and redlock
- `SQLite3`: if you use `better-sqlite3`, set up `node-gyp` before installing dependencies

Create a new Cabloy project:

```bash
npm create cabloy
```

The generated project already includes `CLAUDE.md` and the `.claude/` workspace assets. This path creates a Cabloy Basic project baseline. Open this project in Claude Code and start coding immediately with project-specific guidance.

#### pnpm 11 supply-chain protection note

`pnpm` 11 enables the `minimumReleaseAge` supply-chain protection by default. Newly published packages may be blocked for a short time window before `pnpm` allows installation.

This matters for `npm create cabloy` because the command downloads Cabloy from npm and then automatically runs `npm run init`. If your environment blocks newly published packages during that flow, temporarily set `pnpm_config_minimum_release_age=0` for the current shell session and rerun the command.

**Windows PowerShell**

```powershell
$env:pnpm_config_minimum_release_age = "0"
npm create cabloy
```

**Windows Command Prompt**

```cmd
set pnpm_config_minimum_release_age=0 && npm create cabloy
```

**macOS / Linux**

```bash
pnpm_config_minimum_release_age=0 npm create cabloy
```

If you already created the project directory and only need to rerun initialization, use the same environment variable with `npm run init`.

For **Cabloy Start**, clone the public MIT-licensed repository at `https://github.com/cabloy/cabloy-start`, then run `npm run init`. For the complete Start onboarding flow, read the [Cabloy Start](https://cabloy.com/editions/cabloy-start) page.

Then continue with the framework docs:

- [Fullstack Quickstart](https://cabloy.com/fullstack/quickstart)
- [Documentation](https://cabloy.com)
- [Fullstack Introduction](https://cabloy.com/fullstack/introduction)
- [Backend Introduction](https://cabloy.com/backend/introduction)
- [Frontend Introduction](https://cabloy.com/frontend/introduction)
- [Editions Overview](https://cabloy.com/editions/overview)
- [Choosing Between Cabloy Basic and Cabloy Start](https://cabloy.com/editions/choosing-between-basic-and-start)

To upgrade an existing Cabloy project:

```bash
npm run upgrade
```

## Highlights

- **One fullstack system** — build backend and frontend together instead of assembling separate stacks
- **Bidirectional type sync** — use the contract loop to keep backend contracts and frontend metadata aligned in both directions
- **CLI-first workflows** — use explicit commands for scaffolding, generation, refactors, and verification
- **Docs and skills** — give people and AI agents reusable, source-grounded guidance for the current repository
- **Vona + Zova** — use aligned backend and frontend layers for code sharing and cross-stack consistency
- **Modular delivery** — organize capabilities as suites and modules, then deliver SSR, SPA, Web, and Admin applications with shared conventions

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

### Shared Frontend Engineering Layer

- Vue
- Vite
- Quasar tooling such as `quasar dev` and `quasar build`
- TanStack libraries where applicable

Quasar is used here for engineering tooling rather than as the edition UI component library.

### Edition-specific UI Layer

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

- [Editions Overview](https://cabloy.com/editions/overview)
- [Choosing Between Cabloy Basic and Cabloy Start](https://cabloy.com/editions/choosing-between-basic-and-start)
- [Repo Scripts](https://cabloy.com/reference/repo-scripts)
- [Package Map](https://cabloy.com/reference/package-map)
- [AI Development Introduction](https://cabloy.com/ai/introduction)

Contribution guidelines:

- prefer CLI-backed workflows with `npm run vona` and `npm run zova`
- put user-facing and agent-facing guidance in [cabloy.com](https://cabloy.com)
- put maintainer rationale, architecture notes, and engineering ADRs in [repo-docs-internal/](https://github.com/cabloy/cabloy/tree/main/repo-docs-internal)
- put product and business specifications, delivery plans, and suite-local ADRs in [repo-specs/](https://github.com/cabloy/cabloy/tree/main/repo-specs)
- verify framework changes with the narrowest meaningful checks first, then shared root scripts when broader confidence is needed

To report bugs or propose changes, use [GitHub Issues](https://github.com/cabloy/cabloy/issues) or open a pull request in [github.com/cabloy/cabloy](https://github.com/cabloy/cabloy).

## Community

- [GitHub Issues](https://github.com/cabloy/cabloy/issues)
- [X / Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## License

[MIT](https://github.com/cabloy/cabloy/blob/main/LICENSE)
