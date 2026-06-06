# Cabloy

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cabloy/cabloy/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/cabloy.svg?style=flat-square&label=cabloy)](https://www.npmjs.com/package/cabloy)
[![npm downloads](https://img.shields.io/npm/dm/cabloy?color=orange&label=downloads)](https://www.npmjs.com/package/cabloy)
[![Docs](https://img.shields.io/badge/docs-cabloy-4f46e5.svg?style=flat-square)](https://github.com/cabloy/cabloy/tree/main/cabloy-docs)
[![Demo](https://img.shields.io/badge/demo-cabloy.com-059669.svg?style=flat-square)](https://cabloy.com)

Cabloy is a Node.js fullstack framework for AI vibe coding.

Use one framework system instead of stitching together separate backend and frontend stacks.

With **Vona** on the backend, **Zova** on the frontend, and CLI-first workflows across the stack, Cabloy turns common scaffolding and verification into explicit commands so AI coding can stay more accurate, use fewer tokens, and move faster.

[Documentation](https://github.com/cabloy/cabloy/tree/main/cabloy-docs) · [npm](https://www.npmjs.com/package/cabloy) · [Web Demo](https://cabloy.com) · [Admin Demo](https://cabloy.com/admin) · [GitHub](https://github.com/cabloy/cabloy)

## Get Started

Create a new Cabloy project:

```bash
npm create cabloy
```

Then continue with the framework docs:

- [Documentation](https://github.com/cabloy/cabloy/tree/main/cabloy-docs)
- [Fullstack Introduction](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/fullstack/introduction.md)
- [Backend Introduction](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/backend/introduction.md)
- [Frontend Introduction](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/frontend/introduction.md)
- [Editions Overview](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/editions/overview.md)

If you are working in this repository directly, use the [Fullstack Quickstart](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/fullstack/quickstart.md).

## Highlights

- **One framework system** — build backend and frontend in one Node.js fullstack architecture
- **Vona + Zova** — use aligned backend and frontend frameworks instead of stitching together separate stacks
- **Multiple delivery modes** — support SSR, SPA, Web, and Admin applications with shared conventions
- **CLI-first workflows for AI coding** — turn scaffolding, metadata, refactors, and verification into explicit commands so AI can stay more accurate, use fewer tokens, and move faster
- **Monorepo-native development** — keep framework source, docs, and tooling aligned in one repository model

## Ecosystem

- [create-cabloy](https://www.npmjs.com/package/create-cabloy) — create a new Cabloy project with `npm create cabloy`
- [Vona](https://github.com/cabloy/cabloy/tree/main/vona) — backend framework, modules, suites, and the Vona CLI
- [Zova](https://github.com/cabloy/cabloy/tree/main/zova) — frontend framework, modules, suites, and the Zova CLI
- [Cabloy Docs](https://github.com/cabloy/cabloy/tree/main/cabloy-docs) — unified public documentation for Cabloy, Vona, Zova, and AI-assisted workflows

## Repository Layout

Cabloy uses a monorepo layout so framework development and Cabloy workspace development can share the same structure and workflows.

Core areas:

- [vona/](https://github.com/cabloy/cabloy/tree/main/vona) — backend framework, modules, suites, and the Vona CLI
- [zova/](https://github.com/cabloy/cabloy/tree/main/zova) — frontend framework, modules, suites, and the Zova CLI
- [cabloy-docs/](https://github.com/cabloy/cabloy/tree/main/cabloy-docs) — unified public documentation

Additional references:

- [Repo Scripts](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/reference/repo-scripts.md)
- [Package Map](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/reference/package-map.md)
- [AI Development Introduction](https://github.com/cabloy/cabloy/blob/main/cabloy-docs/ai/introduction.md)

## Development

If you are working in a Cabloy workspace directly, the root [package.json](https://github.com/cabloy/cabloy/blob/main/package.json) is the shared workflow entrypoint.

### Requirements

- Node.js `>=24.4.0`
- `pnpm@10.19.0`

### Install

```bash
npm run init
```

### Run

Start the backend:

```bash
npm run dev
```

Start the frontend verification surfaces used in this workspace:

```bash
npm run dev:zova:admin
npm run dev:zova:web
```

### Verify

```bash
npm run tsc
npm run test
npm run build
```

### Common scripts

| Command                  | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `npm run init`           | Install dependencies and initialize the workspace            |
| `npm run vona`           | Enter the Vona CLI command family                            |
| `npm run zova`           | Enter the Zova CLI command family                            |
| `npm run dev`            | Start the backend development workflow                       |
| `npm run dev:zova:admin` | Start the admin verification frontend used in this workspace |
| `npm run dev:zova:web`   | Start the web verification frontend used in this workspace   |
| `npm run build`          | Run the shared production build workflow                     |
| `npm run start`          | Start the backend production workflow                        |
| `npm run test`           | Run backend tests from the shared root entrypoint            |
| `npm run tsc`            | Run shared type checking                                     |
| `npm run docs:dev`       | Start the docs development server                            |
| `npm run docs:build`     | Build the docs site                                          |
| `npm run docs:preview`   | Preview the built docs site                                  |

### CLI-first workflows

Prefer the existing CLI entrypoints before writing framework scaffolding by hand.

For AI coding, this matters because scaffolding, metadata operations, refactors, and verification can be expressed as explicit commands instead of long natural-language instructions, which helps reduce token usage, improve accuracy, and speed up iteration.

```bash
npm run vona :create
npm run zova :create
```

## Contributing

Contributions to the Cabloy framework, docs, and tooling are welcome.

- use the root [package.json](https://github.com/cabloy/cabloy/blob/main/package.json) as the shared workflow entrypoint
- prefer CLI-backed workflows with `npm run vona` and `npm run zova`
- put user-facing and agent-facing guidance in [cabloy-docs/](https://github.com/cabloy/cabloy/tree/main/cabloy-docs)
- put maintainer rationale, architecture notes, and ADRs in [.docs-internal/](https://github.com/cabloy/cabloy/tree/main/.docs-internal)
- verify documentation changes with `npm run docs:build`
- verify framework changes with the narrowest meaningful checks first, then shared root scripts when broader confidence is needed

To report bugs or propose changes, use [GitHub Issues](https://github.com/cabloy/cabloy/issues) or open a pull request in [github.com/cabloy/cabloy](https://github.com/cabloy/cabloy).

## Community

- [GitHub Issues](https://github.com/cabloy/cabloy/issues)
- [X / Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## License

[MIT](https://github.com/cabloy/cabloy/blob/main/LICENSE)
