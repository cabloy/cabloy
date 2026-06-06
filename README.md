# Cabloy

Cabloy is a unified fullstack framework for building **SSR**, **SPA**, **Web**, and **Admin** applications in one architecture.

It is built around **Vona** for the backend and **Zova** for the frontend, with monorepo-native workflows, CLI-first automation, and shared development conventions.

## Get started

Create a new Cabloy project:

```bash
npm create cabloy
```

Then follow the framework guides in [cabloy-docs/](cabloy-docs/).

Recommended entry points:

- [Fullstack Introduction](cabloy-docs/fullstack/introduction.md)
- [Fullstack Quickstart](cabloy-docs/fullstack/quickstart.md)
- [Editions Overview](cabloy-docs/editions/overview.md)
- [Repo Scripts](cabloy-docs/reference/repo-scripts.md)
- [Package Map](cabloy-docs/reference/package-map.md)
- [AI Development Introduction](cabloy-docs/ai/introduction.md)

## Why Cabloy

- **Fullstack by design** — develop backend and frontend in one framework system
- **Vona + Zova** — combine backend and frontend capabilities without splitting the developer experience
- **CLI-first workflows** — prefer generators, metadata, refactors, and verification through existing command families
- **Monorepo-native guidance** — keep framework source, docs, and tooling aligned in one repository model

## This repository

This repository contains the source monorepo for the Cabloy framework itself.

Main areas:

- [vona/](vona/) — backend framework, modules, suites, and the Vona CLI
- [zova/](zova/) — frontend framework, modules, suites, and the Zova CLI
- [cabloy-docs/](cabloy-docs/) — unified public documentation
- [.docs-internal/](.docs-internal/) — internal engineering notes and ADR-style documentation
- [.claude/](.claude/) — Claude commands, skills, and local AI workflow settings

## Repository note

The active source repository carries the `__CABLOY_BASIC__` marker. In this monorepo, that marker is used to select the public reference workspace and the UI assumptions used for framework development and verification.

When introducing Cabloy as a framework, however, the subject should remain **Cabloy** itself rather than Cabloy Basic as a product narrative.

## Framework development in this repo

If you are working on the framework source directly, the root [package.json](package.json) is the shared workflow entrypoint.

### Requirements

- Node.js `>=24.4.0`
- `pnpm@10.19.0`

### Install dependencies

```bash
npm run init
```

### Start local development

Start the backend:

```bash
npm run dev
```

Start the frontend verification surfaces used in this repository:

```bash
npm run dev:zova:admin
npm run dev:zova:web
```

### Shared verification

```bash
npm run tsc
npm run test
npm run build
```

## Common root scripts

| Command | Purpose |
| --- | --- |
| `npm run init` | Install dependencies and initialize the workspace |
| `npm run vona` | Enter the Vona CLI command family |
| `npm run zova` | Enter the Zova CLI command family |
| `npm run dev` | Start the backend development workflow |
| `npm run dev:zova:admin` | Start the admin verification frontend used in this repo |
| `npm run dev:zova:web` | Start the web verification frontend used in this repo |
| `npm run build` | Run the shared production build workflow |
| `npm run start` | Start the backend production workflow |
| `npm run test` | Run backend tests from the shared root entrypoint |
| `npm run tsc` | Run shared type checking |
| `npm run docs:dev` | Start the docs development server |
| `npm run docs:build` | Build the docs site |
| `npm run docs:preview` | Preview the built docs site |

For the current script surface, see [Repo Scripts](cabloy-docs/reference/repo-scripts.md).

## CLI-first workflows

Prefer the existing CLI entrypoints before writing framework scaffolding by hand:

```bash
npm run vona :create
npm run zova :create
```

Use the CLI command families to generate, refactor, inspect metadata, and verify workflows in ways that stay aligned with the current framework conventions.

## Documentation boundaries

Keep documentation in the right place:

- put user-facing and agent-facing guidance in [cabloy-docs/](cabloy-docs/)
- put maintainer rationale, architecture notes, and ADRs in [.docs-internal/](.docs-internal/)

For the internal documentation boundary, see [.docs-internal/README.md](.docs-internal/README.md).

## License

[MIT](LICENSE)
