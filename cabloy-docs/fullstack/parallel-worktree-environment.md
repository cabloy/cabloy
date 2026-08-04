# Parallel Worktree Environment

Use worktree-local environment overrides when two Cabloy Basic or Cabloy Start worktrees need to run ordinary local development or managed E2E checks at the same time.

This Cabloy Basic page is the canonical shared recipe for both editions. Detect the active edition before selecting commands, but keep the same two-file isolation model.

This workflow creates an isolated local runtime without changing committed environment defaults. It covers normal Vona development, one selected Zova development flavor, `npm run test`, and the edition-appropriate managed clean E2E command. It does not automatically isolate every external dependency.

## Before creating local overrides

1. Create and enter a separate linked worktree.
2. Select the processes to run: Vona development, ordinary tests, managed clean E2E, and optionally one Zova development flavor—Admin or Web.
3. Do not run Admin and Web frontend development concurrently in one worktree. Configure another linked worktree for the other flavor.
4. Explicitly invoke `/cabloy-worktree-environment` to receive a deterministic isolation proposal and confirm it before any local file is written.

The repository ignores `**/env/.env*.local`, but this workflow may create or change only these broad files:

- `vona/env/.env.local`
- `zova/env/.env.local`

Do not create or modify flavor-, mode-, app-mode-, or runtime-specific `.env.*.local` files for worktree isolation.

## Deterministic, secret-safe recommendations

The explicit setup skill does not inspect `.env`, `.env.local`, `.env.*.local`, sibling configuration, process environment, listening processes, or external services while recommending values. Therefore secrets in local environment files are not supplied to the AI/model, printed to the console, or included in this workflow’s diagnostic output.

The recommendation uses only Git worktree metadata and the fixed defaults below. The primary checkout has ordinal `0`; the first linked worktree has ordinal `1`, the second has ordinal `2`, and so on. For the first proposal, add the linked-worktree ordinal to each baseline port.

| Setting               | Baseline | First-proposal rule               |
| --------------------- | -------: | --------------------------------- |
| `SERVER_LISTEN_PORT`  |   `7102` | `7102 + linked-worktree ordinal`  |
| `DEV_SERVER_PORT`     |   `9000` | `9000 + linked-worktree ordinal`  |
| `DEV_SERVER_HMR_PORT` |  `24679` | `24679 + linked-worktree ordinal` |

`APP_NAME` is the current linked worktree directory name. `API_BASE_URL` is regenerated as `http://localhost:<SERVER_LISTEN_PORT>`.

For example, the first linked worktree receives this initial Vona + Zova development proposal:

```dotenv
# vona/env/.env.local
APP_NAME = cabloy-worktree-name
SERVER_LISTEN_PORT = 7103
```

```dotenv
# zova/env/.env.local
APP_NAME = cabloy-worktree-name
API_BASE_URL = http://localhost:7103
DEV_SERVER_PORT = 9001
DEV_SERVER_HMR_PORT = 24680
```

The user-facing summary is:

> 环境隔离信息：Vona 开发 + Zova 开发

The ports are shared by the selected Zova development environment. The user still starts **either** the Admin command **or** the Web command in that worktree; they are not separate environment-port configurations.

If the proposal is unsuitable, say **“再换一批”**. The skill increases every selected listener port by exactly `+1`, regenerates `API_BASE_URL` from the new Vona port, and presents the next tuple for confirmation. It never writes during this step.

This deterministic scheme is not a port reservation or a live collision check. If an application later reports that a port is occupied, request another batch before setup or choose valid replacement values; successful application startup remains the final authority.

## Configuration boundaries

For Vona development, ordinary tests, or managed clean E2E, configure:

```dotenv
APP_NAME = cabloy-worktree-name
SERVER_LISTEN_PORT = 7103
```

For one selected Zova development process, add the same `APP_NAME` and the matching frontend configuration:

```dotenv
APP_NAME = cabloy-worktree-name
API_BASE_URL = http://localhost:7103
DEV_SERVER_PORT = 9001
DEV_SERVER_HMR_PORT = 24680
```

Keep these invariants:

- Vona and Zova use the same unique `APP_NAME`.
- `API_BASE_URL` points to the selected Vona `SERVER_LISTEN_PORT`.
- Selected listener ports, including `SERVER_LISTEN_PORT`, `DEV_SERVER_PORT`, and `DEV_SERVER_HMR_PORT`, are unique within the configured worktree tuple.
- A worktree runs Admin or Web frontend development, not both. Use a separate linked worktree for concurrent development of the other flavor.

The base Zova environment defines `SSR_API_BASE_URL = $API_BASE_URL`, so SSR uses the same Vona target in the normal baseline. Add an explicit local `SSR_API_BASE_URL` only after confirming that the selected runtime requires it.

The enabled Zova Quasar extension maps `DEV_SERVER_HMR_PORT` to Vite's client HMR/WebSocket listener. It is a separate listener when it differs from `DEV_SERVER_PORT`, so every concurrently running Zova development worktree needs its own unique HMR port.

For privacy, the skill writes only to absent or empty permitted broad local files. If either target already contains content, it stops without reading or changing that file; manage the existing local configuration outside this workflow or use a fresh linked worktree.

## Edition-aware commands

Use commands from the active repository root.

| Edition      | Marker             | Selected frontend command                          | Managed clean E2E              |
| ------------ | ------------------ | -------------------------------------------------- | ------------------------------ |
| Cabloy Basic | `__CABLOY_BASIC__` | `npm run dev:zova:admin` or `npm run dev:zova:web` | `npm run test:e2e:basic:clean` |
| Cabloy Start | `__CABLOY_START__` | `npm run dev:zova:admin` or `npm run dev:zova:web` | `npm run test:e2e:start:clean` |

Both managed clean E2E workflows read Vona's effective local `SERVER_LISTEN_PORT`, then reset, start, and target that local runtime.

## What this isolates

A unique `APP_NAME` separates the application identity used by ordinary framework-managed local resources, including managed test database names and Redis-related key prefixes. Worktree-local generated files, runtime files, build output, and coverage output are already separated by their worktree paths.

The selected Vona, Zova development HTTP, and Zova HMR ports let worktrees run their ordinary local processes concurrently. The matching Zova API URL prevents the frontend in one worktree from calling the Vona process in another.

This is sufficient for the normal local workflows:

```bash
npm run dev
# Select one frontend process in this worktree:
npm run dev:zova:admin
# or
npm run dev:zova:web
npm run test
```

## Add configuration only when the work uses it

Do not add isolation settings preemptively. Extend the broad local overrides only when the selected workflow actually uses one of these resources:

- an explicitly named database or a separately configured Redis target
- mail, payment, webhook, object-storage, or other external providers
- a standalone mock-build process, using `MOCK_BUILD_PORT`
- an SSR preview or production process, after inspecting every listener its selected entrypoint starts

For example, `APP_NAME` namespaces ordinary framework Redis keys, but it does not create a separate Redis server or automatically isolate custom, unprefixed keys. Likewise, an explicitly configured external database remains shared until it is configured separately.

Current SSR preview scripts also start `dist-mock`; configure `MOCK_BUILD_PORT` when that listener is used. Configure `SSR_PROD_PORT` only after confirming that the selected preview runtime consumes it.

## Guided setup and initialization

For confirmation-gated setup, explicitly invoke `/cabloy-worktree-environment`. The skill validates the linked worktree and edition, derives a secret-safe proposal from Git metadata and fixed port baselines, and writes only the two allowed broad local files after final confirmation.

After local overrides are validated, decide separately whether to run `npm run init`. It is not an environment allocator: it installs dependencies, runs generation/build-related work, and rewrites the base `APP_NAME` values in `vona/env/.env` and `zova/env/.env`.

## Read together with

- [Quick Start](/fullstack/quickstart)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Runtime Environments and Flavors](/backend/runtime-and-flavors)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [SSR Environment Variables](/frontend/ssr-env)
- [Mock Guide](/frontend/mock-guide)
