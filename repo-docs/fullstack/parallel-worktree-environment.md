# Parallel Worktree Environment

Use worktree-local environment overrides when two Cabloy Basic or Cabloy Start worktrees need to run ordinary local development or managed E2E checks at the same time.

This Cabloy Basic page is the canonical shared recipe for both editions. Detect the active edition before selecting commands, but keep the same two-file environment model.

This workflow creates a standard isolated local runtime without changing committed environment defaults. It does not automatically isolate every external dependency.

## Before creating local overrides

1. Create and enter a separate linked worktree.
2. Explicitly invoke `/cabloy-worktree-environment` to receive a deterministic environment proposal and confirm it before any local file is written.

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

Every valid explicit setup proposes the same complete tuple and both local files:

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

> Environment isolation: Vona development + Zova development

If the proposal is unsuitable, say **“Try another batch”**. The skill increases every listener port by exactly `+1`, regenerates `API_BASE_URL` from the new Vona port, and presents the next tuple for confirmation. It never writes during this step.

This deterministic scheme is not a port reservation or a live collision check. If an application later reports that a port is occupied, request another batch before setup or create another linked worktree; successful application startup remains the final authority.

## Configuration boundaries

After final confirmation, the skill always writes the two shown files. Keep these invariants:

- Vona and Zova use the same unique `APP_NAME`.
- `API_BASE_URL` points to the generated Vona `SERVER_LISTEN_PORT`.
- `SERVER_LISTEN_PORT`, `DEV_SERVER_PORT`, and `DEV_SERVER_HMR_PORT` are unique within the generated worktree tuple.
- The skill writes no settings beyond the five shown assignments and creates no flavor-specific local file.

Admin and Web are alternative commands that share the generated Zova environment. Do not run both frontend development commands concurrently in one worktree. Configure another linked worktree for concurrent development of the other flavor.

The enabled Zova Quasar extension maps `DEV_SERVER_HMR_PORT` to Vite's client HMR/WebSocket listener. It is a separate listener when it differs from `DEV_SERVER_PORT`, so every concurrently running Zova development worktree needs its own unique HMR port.

For privacy, the skill writes only to absent or empty permitted broad local files. If either target already contains content, it stops without reading or changing either file; manage the existing local configuration outside this workflow or use a fresh linked worktree.

## Edition-aware commands

Use commands from the active repository root.

| Edition      | Marker             | Frontend command                                   | Managed clean E2E              |
| ------------ | ------------------ | -------------------------------------------------- | ------------------------------ |
| Cabloy Basic | `__CABLOY_BASIC__` | `npm run dev:zova:admin` or `npm run dev:zova:web` | `npm run test:e2e`             |
| Cabloy Start | `__CABLOY_START__` | `npm run dev:zova:admin` or `npm run dev:zova:web` | `npm run test:e2e:start:clean` |

Run one frontend command, not both, in each worktree. Both managed clean E2E workflows read Vona's effective local `SERVER_LISTEN_PORT`, then reset, start, and target that local runtime.

## What this isolates

A unique `APP_NAME` separates the application identity used by ordinary framework-managed local resources, including managed test database names and Redis-related key prefixes. Worktree-local generated files, runtime files, build output, and coverage output are already separated by their worktree paths.

The generated Vona, Zova development HTTP, and Zova HMR ports let worktrees run their ordinary local processes concurrently. The matching Zova API URL prevents the frontend in one worktree from calling the Vona process in another.

This is sufficient for the normal local workflows:

```bash
npm run dev
# Run one frontend process in this worktree:
npm run dev:zova:admin
# or
npm run dev:zova:web
npm run test
```

## Resources requiring separate design

Do not extend this universal five-value setup with additional listener or provider settings. An explicit separate design is required for:

- an explicitly named database or a separately configured Redis target
- mail, payment, webhook, object-storage, or other external providers
- standalone mock-build, SSR preview, or production listeners

For example, `APP_NAME` namespaces ordinary framework Redis keys, but it does not create a separate Redis server or automatically isolate custom, unprefixed keys. Likewise, an explicitly configured external database remains shared until it is configured separately.

## Guided setup and initialization

For confirmation-gated setup, explicitly invoke `/cabloy-worktree-environment`. The skill validates the linked worktree and edition, derives a secret-safe proposal from Git metadata and fixed port baselines, and writes both allowed broad local files after final confirmation.

After local overrides are validated, decide separately whether to run `npm run init`. It is not an environment allocator: it installs dependencies and runs generation/build-related work. When it runs from a linked Git worktree rooted at the project, it preserves the tracked base `APP_NAME` defaults in `vona/env/.env` and `zova/env/.env`; the generated broad `.env.local` files supply the worktree-specific identity. Primary-checkout and non-Git project initialization may still establish base `APP_NAME` from the project directory.

## Read together with

- [Quick Start](/fullstack/quickstart)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Runtime Environments and Flavors](/backend/runtime-and-flavors)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [SSR Environment Variables](/frontend/ssr-env)
- [Mock Guide](/frontend/mock-guide)
