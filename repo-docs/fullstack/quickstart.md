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

Run the root CLI command to start the Vona server:

```bash
npm run dev
```

In the Cabloy Basic default environment, Vona listens on `7102` and serves the following SSR sites:

| SSR Site       | URL                                   |
| -------------- | ------------------------------------- |
| Web            | http://localhost:7102/                |
| Admin          | http://localhost:7102/admin/          |
| Commerce-Web   | http://localhost:7102/commerce/       |
| Commerce-Admin | http://localhost:7102/commerce-admin/ |

## 4. Start Zova standalone SSR

Run one of the root CLI commands below to start the Zova development server. Zova standalone SSR is typically used for frontend development, hot reload, and isolated debugging:

```bash
npm run dev:zova:web             # http://localhost:9000/
npm run dev:zova:admin           # http://localhost:9000/admin/
npm run dev:zova:commerce:web    # http://localhost:9000/commerce/
npm run dev:zova:commerce:admin  # http://localhost:9000/commerce-admin/
```

In the Cabloy Basic default environment, the Zova development server listens on `9000`:

| SSR Site       | URL                                   |
| -------------- | ------------------------------------- |
| Web            | http://localhost:9000/                |
| Admin          | http://localhost:9000/admin/          |
| Commerce-Web   | http://localhost:9000/commerce/       |
| Commerce-Admin | http://localhost:9000/commerce-admin/ |

## 5. Vona integrated SSR and Zova standalone SSR

The two commands start different SSR entry points. Choose the one that matches the task:

| SSR entry               | Default port | Best for                                                                                 | What it validates                                                                                   |
| ----------------------- | ------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Vona integrated SSR** | `7102`       | Fullstack development, site access, and browser acceptance                               | Vona API handling, SSR site matching, built artifact handoff, and the integrated HTTP response path |
| **Zova standalone SSR** | `9000`       | Frontend development, hot reload, isolated debugging, and page/route/hydration iteration | Zova SSR rendering and frontend behavior without proving the Vona integration boundary              |

The Zova standalone SSR server can also be used as Vona's development proxy target. However, directly opening `9000` does not replace validation through Vona integrated SSR at `7102`. For acceptance or deployment-oriented checks, build the required SSR/REST artifacts, synchronize them with Vona, and access the site through Vona.

## 6. Run with Docker Compose

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

## 7. Upgrade an existing project

```bash
npm run upgrade
```

## 8. Next step: follow the quick start tutorials

If you want a beginner-friendly path that connects modules, CRUD, bidirectional contract sharing, and schema-driven workflows into one story, continue with:

- [Fullstack Quick Start Tutorials](/fullstack/tutorials-overview)

## 9. AI Spec-Driven Development

After the project is running, use **AI Spec-Driven Development** when AI-assisted work must move from confirmed product intent to traceable, evidence-backed delivery.

Cabloy implements this approach through **Traceable Spec Delivery**:

```text
PRD → SRS → WBS → ATP → Evidence
```

For suite-level work, describe the business capability you want to plan in Claude Code:

```text
/cabloy-spec-generation <business description>
```

Once a bounded WBS increment is approved, execute it with:

```text
/cabloy-spec-execution <WBS-ID>
```

These Skills guide planning, specialist implementation, verification, evidence, and progress handoff; they do not replace the suite records that own product, technical, delivery, acceptance, and evidence authority.

Start with [AI Spec-Driven Development](/ai/ai-spec-driven-development), then continue with [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation) and [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution).
