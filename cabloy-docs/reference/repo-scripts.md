# Repo Scripts

Use this page when you need the compact lookup surface for the shared root scripts exposed by the Cabloy Basic monorepo.

For the broader Reference landing page, see [Reference Introduction](/reference/introduction).

The root `package.json` is the first reference point for shared monorepo workflows.

## Current shared entrypoints in Cabloy Basic

- `npm run init`
- `npm run upgrade`
- `npm run upgrade:dry-run`
- `npm run vona`
- `npm run zova`
- `npm run dev`
- `npm run dev:zova:admin`
- `npm run dev:zova:web`
- `npm run dev:zova:commerce:web`
- `npm run dev:zova:commerce:admin`
- `npm run build`
- `npm run build:zova`
- `npm run build:zova:commerce`
- `npm run build:zova:commerce:web`
- `npm run build:zova:commerce:admin`
- `npm run start`
- `npm run test`
- `npm run test:e2e:basic`
- `npm run test:e2e:basic:web`
- `npm run test:e2e:basic:admin`
- `npm run test:e2e:basic:dev`
- `npm run test:e2e:commerce`
- `npm run test:e2e:commerce:web`
- `npm run test:e2e:commerce:admin`
- `npm run test:e2e:commerce:dev`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

## Upgrade

Run `npm run upgrade:dry-run` before `npm run upgrade` to inspect the framework files and root manifest entries that an upgrade would synchronize. In Cabloy Basic, the upgrade owns `e2e/config/`, `e2e/scripts/`, `e2e/specs/a-basic/`, and `e2e/specs/a-commerce/`, together with the framework `test:e2e:*` scripts and `@playwright/test` development dependency. Keep project browser tests outside those reserved paths; see [Fullstack Quickstart](/fullstack/quickstart) for the upgrade bootstrap behavior.

## SSR browser checks

Both E2E families use the same command structure:

- `test:e2e:<suite>` runs every browser scenario in the suite.
- `test:e2e:<suite>:web` and `test:e2e:<suite>:admin` are durable surface shortcuts that select `@web` and `@admin` tests.
- `test:e2e:<suite>:dev` resets managed local test state, starts one development Vona worker, then runs the suite or a Playwright-filtered subset.

Use native Playwright tags for scenario categories rather than adding a root script for each feature. Every framework scenario uses one surface tag (`@web` or `@admin`) and one purpose tag when applicable (`@smoke` or `@flow`). ATP IDs remain in titles for exact evidence and failure reruns.

Pass Playwright options after npm's `--` delimiter:

```bash
# Exact acceptance scenario
npm run test:e2e:basic -- --grep ATP-BASIC-FLOW-01

# Category or surface selection
npm run test:e2e:basic:dev -- --grep @flow
npm run test:e2e:basic:dev -- --grep @admin

# Compose tags with a Playwright regular expression
npm run test:e2e:basic:dev -- --grep '(?=.*@admin)(?=.*@flow)'
```

The managed `:dev` runner owns its suite config and local lifecycle. It accepts normal Playwright selection and reporting options, but does not accept `--config` or positional spec paths. Use `--grep` or `--grep-invert` to narrow the run. It rejects an external base URL rather than resetting or starting an externally managed target.

The Basic suite exercises Web at `/` and Admin at `/admin` through Vona's SSR dispatcher. Prepare fresh Basic SSR artifacts explicitly when frontend SSR output has changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:basic:dev
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
npm run test:e2e:commerce:dev
```

For an externally managed Commerce target, set `COMMERCE_E2E_BASE_URL` and use the matching aggregate, surface, or forwarded-tag command. The target owner is responsible for data, cache, and artifact freshness:

```bash
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:web
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce -- --grep @smoke
```

Browser commands consume existing SSR and REST artifacts; they never rebuild them. Install Chromium once when needed with `npx playwright install chromium`.

## Edition-sensitive note

Cabloy Start keeps the same high-level pattern while using different frontend flavors such as `cabloyStartAdmin` and `cabloyStartWeb`, plus its own SSR site baselines and project assets in the licensed private repository.

When documenting or automating flavor-specific commands, always confirm the active repo first.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
