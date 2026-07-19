# Fullstack Quickstart

This guide explains the fastest way to start a Cabloy fullstack project.

## 1. Prerequisites

Before creating a new Cabloy project, make sure your environment has:

| Name         | Version    |
| ------------ | ---------- |
| `pnpm`       | `>=11.5.2` |
| `Node.js`    | `>=24.4.0` |
| `Redis`      | `>=7.2.6`  |
| `SQLite3`    | `Built-in` |
| `MySQL`      | `>=8`      |
| `PostgreSQL` | `>=16`     |

- `Redis`: powers queue, schedule, startup, broadcast, caching, two-layer cache, and redlock
- `SQLite3`: if you use `better-sqlite3`, set up `node-gyp` before installing dependencies

## 2. Create a new project

```bash
npm create cabloy
```

The generated project already includes `CLAUDE.md` and the `.claude/` workspace assets. This path creates a Cabloy Basic project baseline. Open this project in Claude Code and start coding immediately with project-specific guidance.

### pnpm 11 supply-chain protection note

`pnpm` 11 enables the `minimumReleaseAge` supply-chain protection by default. Newly published packages may be blocked for a short time window before `pnpm` allows installation.

This matters for `npm create cabloy` because the command downloads Cabloy from npm and then automatically runs `npm run init`. If your environment blocks newly published packages during that flow, temporarily set `pnpm_config_minimum_release_age=0` for the current shell session and rerun the command.

#### Windows PowerShell

```powershell
$env:pnpm_config_minimum_release_age = "0"
npm create cabloy
```

#### Windows Command Prompt

```cmd
set pnpm_config_minimum_release_age=0 && npm create cabloy
```

#### macOS / Linux

```bash
pnpm_config_minimum_release_age=0 npm create cabloy
```

If you already created the project directory and only need to rerun initialization, use the same environment variable with `npm run init`.

## 3. Start the backend

```bash
npm run dev
```

- Web: http://localhost:7102/
- Admin: http://localhost:7102/admin/

## 4. Start the frontend for your edition

### Cabloy Basic

```bash
npm run dev:zova:admin # http://localhost:9000/admin/
npm run dev:zova:web   # http://localhost:9000/
```

### Cabloy Start

Cabloy Start is the private commercial edition. Instead of `npm create cabloy`, purchase access to the licensed private repository, clone that source directly, and run `npm run init`. Then use the frontend commands provided by that edition. Do not assume the Cabloy Basic flavor names apply to Cabloy Start.

For the full Start onboarding details, including the access and initialization flow, read [Cabloy Start](/editions/cabloy-start).

If you are not sure which edition you are using or which one to choose, read:

- [Choosing Between Cabloy Basic and Cabloy Start](/editions/choosing-between-basic-and-start)
- [Edition Detection](/editions/detection)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)

## 5. Run with Docker Compose

Both Cabloy Basic and Cabloy Start support the same Docker Compose command flow. Run these commands from the repository for the edition you are using:

```bash
npm run build:docker
cd vona/docker-compose
sudo COMPOSE_BAKE=true docker-compose build
sudo docker-compose up
```

- Web: http://localhost/
- Admin: http://localhost/admin/

These commands build the edition-specific frontend flavors from the repository you are using.

## 6. Upgrade an existing project

Inspect the planned framework changes before applying them:

```bash
npm run upgrade:dry-run
npm run upgrade
```

In Cabloy Basic, upgrade synchronizes the framework-owned SSR browser E2E baseline, its suite/surface root `test:e2e:*` commands, and the `@playwright/test` development dependency. It does not add a root script for each individual E2E scenario. The framework reserves these paths:

```text
e2e/config/
e2e/scripts/
e2e/specs/a-basic/
e2e/specs/a-commerce/
```

Keep project-owned browser tests outside those reserved paths, for example under `e2e/specs/my-project/`; upgrade overlays framework files without deleting project test paths. Projects whose previous upgrader predates this E2E synchronization may need to run `npm run upgrade` once more: the updated upgrader recognizes an incomplete Basic E2E baseline even when the version marker is already current.

### Cabloy Start repository baseline

Cabloy Start is checked out from the licensed private repository rather than created through `npm create cabloy`. Its E2E baseline is maintained in that repository:

```text
e2e/config/
e2e/scripts/
e2e/specs/a-start/
```

The public Cabloy upgrade flow does not synchronize or repair those Start E2E files, the `test:e2e:start*` scripts, or `@playwright/test`. Keep project-owned browser scenarios outside the baseline paths, for example under `e2e/specs/my-project/`.

Prepare and run the managed Start baseline locally with:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:start:clean
```

The managed command requires port `7102` to be available and owns the local reset and Vona worker lifecycle. For a separately managed target, set `START_E2E_BASE_URL` and use `test:e2e:start`, `test:e2e:start:web`, or `test:e2e:start:admin`; those commands do not reset, build, start, or stop the target. Install Chromium once when needed with `npx playwright install chromium`. See [Repo Scripts](/reference/repo-scripts#ssr-browser-checks) for the complete command variants.

## 7. Next steps for framework-aware development

If you are contributing to framework-aware workflows or using Cabloy CLI generation directly, prefer CLI-backed generation over manual scaffolding.

Read [Fullstack CLI](/fullstack/cli) for the shared cross-stack workflow model, then start with:

```bash
npm run vona :create
npm run zova :create
```

Then narrow into the specific command family you need.

## 8. Next step: follow the quick start tutorials

If you want a beginner-friendly path that connects modules, CRUD, bidirectional contract sharing, and schema-driven workflows into one story, continue with:

- [Fullstack Quick Start Tutorials](/fullstack/tutorials-overview)

## 9. Shared verification commands for deeper workflow checks

If you are validating framework-aware changes or a broader workflow, use the shared project scripts before declaring a workflow correct:

```bash
npm run tsc
npm run test
npm run build
```

Choose more targeted checks when only one area is affected, but treat these scripts as the shared reference surface.
