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
- `npm run build:zova:all`
- `npm run build:zova:admin`
- `npm run build:zova:web`
- `npm run build:zova:commerce`
- `npm run build:zova:commerce:web`
- `npm run build:zova:commerce:admin`
- `npm run start`
- `npm run start:one`
- `npm run test`
- `npm run db:reset`
- `npm run test:e2e`
- `npm run test:e2e:fast`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

`npm run init` prepares all Cabloy Basic SSR and REST artifacts with `npm run build:zova:all`, which sequentially builds the Basic and Commerce flavor batches before Vona initialization. Use `build:zova` or `build:zova:commerce` for focused artifact refreshes; use `build:zova:all` only when every shipped Basic flavor must be prepared.

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
e2e/specs/cabloy-basic.spec.ts
e2e/specs/account.spec.ts
e2e/specs/a-commerce.spec.ts
```

It also reconciles the two framework E2E scripts and the `@playwright/test` development dependency. Keep additional project browser specs under other filenames in `e2e/specs`; the upgrader updates only the listed framework files. The current fresh baseline is required and is not repaired for unsupported legacy project layouts.

### Cabloy Start private repository

The Start E2E baseline is maintained in the private repository:

```text
e2e/config/
e2e/scripts/
e2e/specs/cabloy-start/
```

The public-package upgrade flow does not source or reconcile the Start baseline, its `test:e2e:start*` scripts, or `@playwright/test`. Keep project browser tests outside the baseline paths, for example under `e2e/specs/my-project/`.

## SSR browser checks

The unified runner has two modes:

- `npm run test:e2e`: clean local run; checks the managed port, resets the database, starts one development Vona worker, and runs Playwright.
- `npm run test:e2e:fast`: skips the reset for quick reruns and may target either the local managed server or an externally managed `E2E_BASE_URL`.

Place spec basenames directly after the npm script name; use npm's `--` delimiter only before Playwright options. Multiple spec names are allowed. With no names, every spec in `e2e/specs` is discovered:

```bash
npm run test:e2e cabloy-basic account
npm run test:e2e a-commerce
npm run test:e2e:fast account
npm run test:e2e:fast a-commerce -- --grep ATP-SSR
npm run test:e2e:fast a-commerce -- --grep-invert @admin
```

Tags remain independent from filenames. Repeat `--tag` to require all tags, while native `--grep` and `--grep-invert` remain available:

```bash
npm run test:e2e:fast a-commerce -- --tag @web --tag @smoke
npm run test:e2e:fast account -- --grep @flow --tag @web
```

The existing tags include `@web`, `@admin`, `@smoke`, `@flow`, `@ssr`, `@theme`, and the business tags used by Commerce such as `@cart`, `@payment`, `@shipment`, and `@refund`. No suite tag is required. Clean runs are local-only and reject `E2E_BASE_URL`; fast runs against an external target do not reset, start, stop, or rebuild that target.

### Cabloy Basic and Commerce

The Basic baseline exercises Web at `/` and Admin at `/admin` through Vona's SSR dispatcher. Prepare artifacts when frontend output has changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e cabloy-basic account
```

Commerce browser acceptance exercises Customer Web at `/commerce` and Operator Admin routing at `/commerce-admin`. Prepare its paired artifacts explicitly:

```bash
npm run build:zova:commerce
npm run deps:vona
npm run test:e2e a-commerce
```

For a separately managed target, use the fast command:

```bash
E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:fast a-commerce -- --tag @smoke
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
