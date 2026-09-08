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

`npm create cabloy` automatically runs `npm run init` after creating the project. If you later need to reinstall the project's frontend and backend dependencies, you can run `npm run init` directly.

### Cabloy Start

Cabloy Start is the public MIT-licensed edition maintained in its own repository. Instead of `npm create cabloy`, clone its public repository directly and run `npm run init`. Then use the frontend commands provided by that edition. Do not assume the Cabloy Basic flavor names apply to Cabloy Start.

For the full Start onboarding and initialization flow, read [Cabloy Start](/editions/cabloy-start).

If you are not sure which edition you are using or which one to choose, read:

- [Choosing Between Cabloy Basic and Cabloy Start](/editions/choosing-between-basic-and-start)
- [Edition Detection](/editions/detection)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)

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

## 3. Start Vona integrated SSR

```bash
npm run dev
```

`npm run dev` starts the Vona server. In the Cabloy Basic default environment, its listener at `7102` is the Vona integrated SSR entry: Vona serves the backend API and dispatches the selected SSR site.

| SSR Site       | Url                                   |
| -------------- | ------------------------------------- |
| Web            | http://localhost:7102/                |
| Admin          | http://localhost:7102/admin/          |
| Commerce-Web   | http://localhost:7102/commerce/       |
| Commerce-Admin | http://localhost:7102/commerce-admin/ |

## 4. Start Zova standalone SSR

The Zova commands below start the Zova development server on `9000` in the Cabloy Basic default environment. This is the Zova standalone SSR entry for page, route, and hydration iteration. Direct access to `9000` does not replace Vona integrated SSR acceptance through `7102`.

```bash
npm run dev:zova:web   # http://localhost:9000/
npm run dev:zova:admin # http://localhost:9000/admin/
npm run dev:zova:commerce:web   # http://localhost:9000/commerce/
npm run dev:zova:commerce:admin   # http://localhost:9000/commerce-admin/
```

| SSR Site       | Url                                   |
| -------------- | ------------------------------------- |
| Web            | http://localhost:9000/                |
| Admin          | http://localhost:9000/admin/          |
| Commerce-Web   | http://localhost:9000/commerce/       |
| Commerce-Admin | http://localhost:9000/commerce-admin/ |

## 5. Run with Docker Compose

Both Cabloy Basic and Cabloy Start support the same Docker Compose command flow. Run these commands from the repository for the edition you are using:

```bash
npm run build:docker
cd vona/docker-compose
sudo COMPOSE_BAKE=true docker-compose build
sudo docker-compose up
```

| SSR Site       | Url                              |
| -------------- | -------------------------------- |
| Web            | http://localhost/                |
| Admin          | http://localhost/admin/          |
| Commerce-Web   | http://localhost/commerce/       |
| Commerce-Admin | http://localhost/commerce-admin/ |

## 6. Upgrade an existing project

```bash
npm run upgrade
```

## 7. Next step: follow the quick start tutorials

If you want a beginner-friendly path that connects modules, CRUD, bidirectional contract sharing, and schema-driven workflows into one story, continue with:

- [Fullstack Quick Start Tutorials](/fullstack/tutorials-overview)
