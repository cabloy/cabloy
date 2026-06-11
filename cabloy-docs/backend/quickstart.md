# Backend Quickstart

This guide explains the fastest way to get oriented on the backend side of the Cabloy framework repository.

If you want to create and use a Cabloy project, start with [Fullstack Quickstart](/fullstack/quickstart).

## When to use this page

Use this page when you are contributing backend work in the framework repository and want to understand Cabloy quickly:

- required runtime dependencies
- how backend development starts in the monorepo
- what the historical project templates mean
- which commands are the real source of truth today
- which essentials pages to read next

## Prerequisites

| Name       | Version   |
| ---------- | --------- |
| pnpm       | >=10.19.0 |
| Node.js    | >=24.8.0  |
| Redis      | >=7.2.6   |
| Sqlite3    | Built-in  |
| MySQL      | >=8       |
| Postgresql | >=16      |

Notes:

- Redis underpins capabilities such as queue, startup, election-adjacent distributed coordination, schedule, broadcast, caching, two-layer cache, and redlock.
- If you use Sqlite3, make sure the node-gyp toolchain is ready so native dependencies can compile correctly.

## Framework repository entrypoint

In the Cabloy framework repository, start from the root scripts instead of thinking in terms of a standalone Vona repo.

These commands are repository-root workflows for framework development, not the default bootstrap path for a normal Cabloy project.

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

## Backend essentials reading path

Before diving into feature-specific backend guides, it helps to read the essentials spine first:

1. [Backend (Vona)](/backend/introduction)
2. [Backend Foundation](/backend/foundation)
3. [Backend Essentials](/backend/backend-essentials)
4. [Backend CLI](/backend/cli)
5. [Backend Scripts](/backend/scripts)
6. [Service Guide](/backend/service-guide)
7. [Package Map](/reference/package-map)

This gives the architectural vocabulary for bean, scope, suite, module, package, and backend access patterns.

## Historical template context

Legacy Vona docs described creating projects from templates such as `cabloy-basic` and `cabloy-start`.

That history still matters, because it explains why the Cabloy ecosystem now supports two editions:

- **Cabloy Basic**: the public framework/reference edition, including the project route created by `npm create cabloy`, with a shared frontend engineering layer and a DaisyUI + Tailwind CSS oriented UI layer in the current public examples
- **Cabloy Start**: the private commercial edition, accessed by cloning the licensed private repository source, with a Vuetify-oriented UI layer plus edition-specific SSR site baselines and project assets

In the current monorepo docs, do not treat these as just template names. Treat them as edition boundaries that affect frontend integration, scripts, UI assumptions, and examples.

## Backend configuration reminder

Backend setup may still require editing `.env` values for database and Redis selection. In the monorepo, the exact values should always be taken from the current repo files under `vona/env/` rather than copied from archived guidance blindly.

For the backend runtime/config family, read these pages together:

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)

## Recommended next pages

Choose the next reading path based on the kind of backend task you are doing.

### Architecture spine

- [Backend (Vona)](/backend/introduction)
- [Backend Foundation](/backend/foundation)
- [Backend Essentials](/backend/backend-essentials)
- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)

### Backend contract and data family

- [Controller Guide](/backend/controller-guide)
- [DTO Guide](/backend/dto-guide)
- [Entity Guide](/backend/entity-guide)
- [Model Guide](/backend/model-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [ORM Guide](/backend/orm-guide)

### Runtime and distributed family

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution)
- [Worker Guide](/backend/worker-guide)
- [Election Guide](/backend/election-guide)
- [Queue Guide](/backend/queue-guide)
- [Broadcast Guide](/backend/broadcast-guide)

### Fullstack bridge

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)
