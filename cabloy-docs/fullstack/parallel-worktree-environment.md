# Parallel Worktree Environment

Use worktree-local environment overrides when two Cabloy Basic or Cabloy Start worktrees need to run ordinary local development or managed E2E checks at the same time.

This Cabloy Basic page is the canonical shared recipe for both editions. Detect the active edition before selecting commands, but keep the same two-file isolation model.

This workflow creates an isolated local runtime without changing committed environment defaults. It covers normal Vona development, one selected Zova development flavor, `npm run test`, and the edition-appropriate managed clean E2E command. It does not automatically isolate every external dependency.

## Before creating local overrides

1. Confirm that the checkout is a separate linked worktree.
2. Check `vona/env/` and `zova/env/` for applicable, more-specific `.env.*.local` files. They can mask a broad `.env.local` setting.
3. Choose one unique worktree name and unused Vona, Zova development, and Zova HMR listener ports for the selected processes.
4. Choose one Zova development flavor: Admin or Web. To run the other flavor concurrently, create and configure another linked worktree.

The repository ignores `**/env/.env*.local`, but this workflow may create or change only these broad files:

- `vona/env/.env.local`
- `zova/env/.env.local`

Do not create or modify flavor-, mode-, app-mode-, or runtime-specific `.env.*.local` files for worktree isolation. If an existing specific local file masks a required setting, resolve that conflict outside this workflow or use a clean worktree; do not edit the specific local file as part of isolation setup.

## Minimum configuration

Create the selected broad local files in the new worktree. The values below are examples only; choose values that do not collide with the other worktree.

### Vona

`vona/env/.env.local`

```dotenv
APP_NAME = cabloy-worktree-name
SERVER_LISTEN_PORT = 7113
```

### Zova

Use this only when the worktree runs one selected Admin or Web development process.

`zova/env/.env.local`

```dotenv
APP_NAME = cabloy-worktree-name
API_BASE_URL = http://localhost:7113
DEV_SERVER_PORT = 9013
DEV_SERVER_HMR_PORT = 24693
```

Keep these invariants:

- Vona and Zova use the same unique `APP_NAME`.
- `API_BASE_URL` points to the selected Vona `SERVER_LISTEN_PORT`.
- Selected listener ports, including `SERVER_LISTEN_PORT`, `DEV_SERVER_PORT`, and `DEV_SERVER_HMR_PORT`, are unique among concurrently running worktrees.
- A worktree runs Admin or Web frontend development, not both. Use a separate linked worktree for concurrent development of the other flavor.

The base Zova environment defines `SSR_API_BASE_URL = $API_BASE_URL`, so SSR uses the same Vona target in the normal baseline. Add an explicit local `SSR_API_BASE_URL` only after confirming that the selected runtime requires it and that no applicable specific local file masks it.

The enabled Zova Quasar extension maps `DEV_SERVER_HMR_PORT` to Vite's client HMR/WebSocket listener. It is a separate listener when it differs from `DEV_SERVER_PORT`, so every concurrently running Zova development worktree needs its own unique HMR port.

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

For confirmation-gated setup, explicitly invoke `/cabloy-worktree-environment`. The skill validates the linked worktree and edition, checks broad-file precedence, requires user-chosen values, and writes only the two allowed broad local files after final confirmation.

After local overrides are validated, decide separately whether to run `npm run init`. It is not an environment allocator: it installs dependencies, runs generation/build-related work, and rewrites the base `APP_NAME` values in `vona/env/.env` and `zova/env/.env`.

## Read together with

- [Quick Start](/fullstack/quickstart)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Runtime Environments and Flavors](/backend/runtime-and-flavors)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [SSR Environment Variables](/frontend/ssr-env)
- [Mock Guide](/frontend/mock-guide)
