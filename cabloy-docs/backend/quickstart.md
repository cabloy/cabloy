# Backend Quickstart

This page migrates the most valuable parts of the legacy Vona quickstart into the new monorepo docs.

## When to use this page

Use this page when you want to understand the backend side of Cabloy quickly:

- required runtime dependencies
- how backend development starts in the monorepo
- what the historical project templates mean
- which commands are the real source of truth today

## Prerequisites

| Name | Version |
| --- | --- |
| pnpm | >=10.19.0 |
| Node.js | >=24.8.0 |
| Redis | >=7.2.6 |
| Sqlite3 | Built-in |
| MySQL | >=8 |
| Postgresql | >=16 |

Notes:

- Redis underpins capabilities such as queue, schedule, startup, broadcast, caching, two-layer cache, and redlock.
- If you use Sqlite3, make sure the node-gyp toolchain is ready so native dependencies can compile correctly.

## Monorepo-first start

In this repository, start from the root scripts instead of thinking in terms of a standalone Vona repo.

### Install and initialize

```bash
npm run init
```

### Start backend development

```bash
npm run dev
```

### Run tests

```bash
npm run test
```

### Build

```bash
npm run build
```

### Start production output

```bash
npm run start
```

## Historical template context

Legacy Vona docs described creating projects from templates such as `cabloy-basic` and `cabloy-start`.

That history still matters, because it explains why the Cabloy ecosystem now supports two editions:

- **Cabloy Basic**: public reference repo with DaisyUI + TailwindCSS oriented frontend modules
- **Cabloy Start**: sibling private repo with Vuetify-oriented frontend modules and different value-add composition

In the current monorepo docs, do not treat these as just template names. Treat them as edition boundaries that affect frontend integration, scripts, and examples.

## Backend configuration reminder

The legacy quickstart also required editing `.env` values for database and Redis selection. That is still conceptually true, but in the monorepo the exact values should always be taken from the current repo files under `vona/env/` rather than copied from older docs blindly.

## Recommended next pages

- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)
