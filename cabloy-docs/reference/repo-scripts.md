# Repo Scripts

Use this page as the compact lookup surface for root scripts in Cabloy Basic and Cabloy Start.

For the broader Reference landing page, see [Reference Introduction](/reference/introduction).

Always start with the active repository's root `package.json`. Cabloy Basic is the public generated-project baseline; Cabloy Start is the licensed private repository and has its own root command surface.

## Cabloy Basic entrypoints

Cabloy Basic exposes these shared root scripts:

- `npm run init`
- `npm run upgrade`
- `npm run upgrade:dry-run`
- `npm run vona`
- `npm run zova`
- `npm run dev`
- `npm run dev:one`
- `npm run dev:zova:admin`
- `npm run dev:zova:web`
- `npm run dev:zova:commerce:web`
- `npm run dev:zova:commerce:admin`
- `npm run build`
- `npm run build:zova`
- `npm run build:zova:admin`
- `npm run build:zova:web`
- `npm run build:zova:commerce`
- `npm run build:zova:commerce:web`
- `npm run build:zova:commerce:admin`
- `npm run start`
- `npm run start:one`
- `npm run test`
- `npm run db:reset`
- `npm run test:e2e:basic`
- `npm run test:e2e:basic:web`
- `npm run test:e2e:basic:admin`
- `npm run test:e2e:basic:clean`
- `npm run test:e2e:commerce`
- `npm run test:e2e:commerce:web`
- `npm run test:e2e:commerce:admin`
- `npm run test:e2e:commerce:clean`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

## Cabloy Start entrypoints

Cabloy Start exposes the equivalent Start repository surface:

- `npm run init`
- `npm run upgrade`
- `npm run upgrade:dry-run`
- `npm run vona`
- `npm run zova`
- `npm run dev`
- `npm run dev:one`
- `npm run dev:zova:admin`
- `npm run dev:zova:web`
- `npm run build`
- `npm run build:zova`
- `npm run build:zova:admin`
- `npm run build:zova:web`
- `npm run start`
- `npm run start:one`
- `npm run test`
- `npm run db:reset`
- `npm run test:e2e:start`
- `npm run test:e2e:start:web`
- `npm run test:e2e:start:admin`
- `npm run test:e2e:start:clean`
- `npm run tsc`

Cabloy Start does not expose Basic Commerce or root documentation wrappers.

## Upgrade

Run `npm run upgrade:dry-run` before `npm run upgrade` to inspect framework files and root manifest entries that an upgrade would synchronize.

### Cabloy Basic public projects

Basic upgrade owns these browser baseline paths:

```text
e2e/config/
e2e/scripts/
e2e/specs/cabloy-basic/
e2e/specs/a-commerce/
```

It also reconciles the framework Basic and Commerce `test:e2e:*` scripts and `@playwright/test` development dependency. Keep project browser tests outside those reserved paths. The upgrader merges framework baseline directories without deleting project-owned paths and can repair an incomplete Basic E2E baseline even when the framework version marker is already current.

### Cabloy Start private repository

The Start E2E baseline is maintained in the private repository:

```text
e2e/config/
e2e/scripts/
e2e/specs/cabloy-start/
```

The public-package upgrade flow does not source or reconcile the Start baseline, its `test:e2e:start*` scripts, or `@playwright/test`. Keep project browser tests outside the baseline paths, for example under `e2e/specs/my-project/`.

## SSR browser checks

The suites use this command family:

- `test:e2e:<suite>` runs every browser scenario in the suite.
- `test:e2e:<suite>:web` and `test:e2e:<suite>:admin` select `@web` and `@admin` scenarios.
- `test:e2e:<suite>:clean` resets managed local state, starts one development Vona worker, then runs the suite or a Playwright-filtered subset.

The managed `:clean` runner requires port `7102` to be available. It owns the suite config and local lifecycle: it resets the database, and Playwright starts and stops `npm run dev:one`. It accepts normal Playwright selection and reporting options, but rejects external base URLs, `--config`, and positional spec paths. Use `--grep` or `--grep-invert` to narrow the run.

Pass Playwright options after npm's `--` delimiter. `@web` and `@admin` are stable surface tags. Purpose tags depend on the suite: current scenarios use `@smoke`, while the Basic suite also uses `@flow`. ATP IDs remain in titles for exact evidence and failure reruns.

### Cabloy Basic and Commerce

The Basic suite exercises Web at `/` and Admin at `/admin` through Vona's SSR dispatcher. Prepare fresh SSR and REST artifacts explicitly when frontend output has changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:basic:clean
```

```bash
# Exact acceptance scenario
npm run test:e2e:basic -- --grep ATP-BASIC-FLOW-01

# Category or surface selection
npm run test:e2e:basic:clean -- --grep @flow
npm run test:e2e:basic:clean -- --grep @admin

# Compose tags with a Playwright regular expression
npm run test:e2e:basic:clean -- --grep '(?=.*@admin)(?=.*@flow)'
```

For an externally managed Basic target, set `BASIC_E2E_BASE_URL` and use aggregate, surface, or forwarded-tag commands. These commands do not reset, start, stop, or rebuild the target:

```bash
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic:admin
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic -- --grep @flow
```

Commerce browser acceptance exercises Customer Web at `/commerce` and Operator Admin routing at `/commerce-admin`. Prepare its paired artifacts explicitly:

```bash
npm run build:zova:commerce
npm run deps:vona
npm run test:e2e:commerce:clean
```

For an externally managed Commerce target, set `COMMERCE_E2E_BASE_URL` and use the matching aggregate, surface, or forwarded-tag command. The target owner is responsible for data, cache, and artifact freshness:

```bash
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:web
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce -- --grep @smoke
```

### Cabloy Start

The Start suite exercises Web at `/` and Admin at `/admin` through Vona's SSR dispatcher. Prepare current Start artifacts before a managed local run:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:start:clean
```

```bash
# Exact acceptance scenario
npm run test:e2e:start -- --grep ATP-START-FLOW-01

# Category or surface selection
npm run test:e2e:start:clean -- --grep @smoke
npm run test:e2e:start:clean -- --grep @admin
```

For an externally managed Start target, set `START_E2E_BASE_URL` and use matching aggregate, surface, or forwarded-tag commands. The target owner is responsible for data, cache, and artifact freshness:

```bash
START_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:start
START_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:start:admin
START_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:start -- --grep @web
```

Browser commands consume existing SSR and REST artifacts; they never rebuild them. Install Chromium once when needed with `npx playwright install chromium`.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
