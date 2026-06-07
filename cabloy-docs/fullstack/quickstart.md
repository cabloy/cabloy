# Fullstack Quickstart

This guide explains the fastest way to start a Cabloy fullstack project.

## 1. Prerequisites

Before creating a new Cabloy project, make sure your environment has:

| Name       | Version     |
| ---------- | ----------- |
| `pnpm`     | `>=10.19.0` |
| `Node.js`  | `>=24.4.0`  |
| `Redis`    | `>=7.2.6`   |
| `SQLite3`  | `Built-in`  |
| `MySQL`    | `>=8`       |
| `PostgreSQL` | `>=16`    |

- `Redis`: powers queue, schedule, startup, broadcast, caching, two-layer cache, and redlock
- `SQLite3`: if you use `better-sqlite3`, set up `node-gyp` before installing dependencies

## 2. Create a new project

```bash
npm create cabloy
```

## 3. Start the backend

```bash
npm run dev
```

## 4. Start the frontend for your edition

### Cabloy Basic

```bash
npm run dev:zova:admin
npm run dev:zova:web
```

### Cabloy Start

Use the frontend commands provided by your project edition. Do not assume the Cabloy Basic flavor names apply to Cabloy Start.

If you are not sure which edition you are using, read:

- [Edition Detection](/editions/detection)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)

## 5. Upgrade an existing project

```bash
npm run upgrade
```

## 6. Next steps for framework-aware development

If you are contributing to framework-aware workflows or using Cabloy CLI generation directly, prefer CLI-backed generation over manual scaffolding.

Instead of creating framework files by hand, start with:

```bash
npm run vona :create
npm run zova :create
```

Then narrow into the specific command family you need.

## 7. Shared verification commands for deeper workflow checks

If you are validating framework-aware changes or a broader workflow, use the shared project scripts before declaring a workflow correct:

```bash
npm run tsc
npm run test
npm run build
```

Choose more targeted checks when only one area is affected, but treat these scripts as the shared reference surface.
