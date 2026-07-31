# Parallel Worktree Environment

Use worktree-local environment overrides when two Cabloy Basic worktrees need to run ordinary local development or managed E2E checks at the same time.

This workflow creates an isolated local runtime without changing committed environment defaults. It covers normal Vona and Zova development, `npm run test`, and `npm run test:e2e:XXX:clean`. It does not automatically isolate every external dependency.

## Before creating local overrides

1. Confirm that the checkout is a separate worktree.
2. Check `vona/env/` and `zova/env/` for applicable, more-specific `.env.*.local` files. A more-specific local override can take precedence over `.env.local`.
3. Choose one unique worktree name and unused Vona, Zova, and HMR ports.

The repository ignores `**/env/.env*.local`, so these files remain local to the worktree and must not be committed.

## Minimum configuration

Create these files in the new worktree.

### Vona

`vona/env/.env.local`

```dotenv
APP_NAME = cabloy-basic-my-worktree
SERVER_LISTEN_PORT = 7113
```

### Zova

`zova/env/.env.local`

```dotenv
APP_NAME = cabloy-basic-my-worktree
API_BASE_URL = http://localhost:7113
DEV_SERVER_PORT = 9013
DEV_SERVER_HMR_PORT = 24693
```

Keep these invariants:

- Vona and Zova use the same unique `APP_NAME`.
- `API_BASE_URL` points to the selected Vona `SERVER_LISTEN_PORT`.
- `SERVER_LISTEN_PORT`, `DEV_SERVER_PORT`, and `DEV_SERVER_HMR_PORT` are unique among concurrently running worktrees.

The base Zova environment defines `SSR_API_BASE_URL = $API_BASE_URL`, so SSR uses the same Vona target in the normal baseline. Add an explicit local `SSR_API_BASE_URL` only if an applicable, more-specific environment file changes that relationship.

## What this isolates

A unique `APP_NAME` separates the application identity used by ordinary framework-managed local resources, including managed test database names and Redis-related key prefixes. Worktree-local generated files, runtime files, build output, and coverage output are already separated by their worktree paths.

The selected Vona, Zova, and HMR ports let the worktrees run their ordinary local processes concurrently. The matching Zova API URL prevents the frontend in one worktree from calling the Vona process in another.

This is sufficient for the normal local workflows:

```bash
npm run dev
npm run dev:zova:admin
npm run dev:zova:web
npm run test
npm run test:e2e:basic:clean
```

The managed clean E2E workflow reads Vona's effective local `SERVER_LISTEN_PORT`, then resets, starts, and targets that local runtime.

## Add configuration only when the work uses it

Do not add isolation settings preemptively. Extend the local overrides only when the selected workflow actually shares one of these resources:

- an explicitly named database or a separately configured Redis target
- mail, payment, webhook, object-storage, or other external providers
- a standalone mock-build process, using `MOCK_BUILD_PORT`
- an SSR preview or production process, using `SSR_PROD_PORT`

For example, `APP_NAME` namespaces ordinary framework Redis keys, but it does not create a separate Redis server or automatically isolate custom, unprefixed keys. Likewise, an explicitly configured external database remains shared until it is configured separately.

## Edition-aware note

This page describes the current Cabloy Basic workflow. For Cabloy Start, detect the active edition first and inspect the Start repository's current scripts, flavors, environment files, and generated-output paths before applying this recipe.

## Read together with

- [Quick Start](/fullstack/quickstart)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Runtime Environments and Flavors](/backend/runtime-and-flavors)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [SSR Environment Variables](/frontend/ssr-env)
- [Mock Guide](/frontend/mock-guide)
