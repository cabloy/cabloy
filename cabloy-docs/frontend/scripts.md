# Frontend Scripts

This guide explains the main Zova script workflows in the Cabloy monorepo.

## Shared rule

Zova can build `SSR`, `SPA`, `Web`, and `Admin` modes in one codebase. In Cabloy, contributors should usually start from the root scripts first, then drop into `zova/package.json` only when they need edition-specific detail.

## Detect the edition first

Before choosing script examples, detect whether you are working in Cabloy Basic or Cabloy Start.

A practical rule is:

1. detect the edition first
2. then choose the correct script, flavor, and appMode path
3. only then document or automate edition-specific frontend examples

For the edition-detection workflow, also see [Edition Detection](/editions/detection).

## Cabloy Basic root wrappers

From the current root repository:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
```

These map to Basic-specific Zova flavors in this repository. Commerce follows the same aggregate-and-surface pattern:

```bash
# Customer Web or Operator Admin development server
npm run dev:zova:commerce:web
npm run dev:zova:commerce:admin

# Both Commerce SSR/REST artifact pairs, or one surface only
npm run build:zova:commerce
npm run build:zova:commerce:web
npm run build:zova:commerce:admin
```

## Basic SSR browser acceptance

The default Basic Web and Admin sites have browser smoke commands that exercise Vona SSR dispatch at `7102`, not a standalone Zova development-server port.

Prepare current artifacts explicitly when the relevant frontend SSR output changed:

```bash
# Web only
npm run build:zova:web

# Admin only
npm run build:zova:admin

# Both default Basic sites
npm run build:zova
npm run deps:vona
```

Then use the managed clean local acceptance command:

```bash
npm run test:e2e:basic:dev
```

It resets Vona-managed test data and the local Redis namespace, starts one development Vona worker, and runs the complete suite by default. The E2E commands consume already-built artifacts; they do not rebuild them.

The suite command family is consistent across Basic and Commerce:

```text
test:e2e:<suite>          complete suite
test:e2e:<suite>:web      all @web surface scenarios
test:e2e:<suite>:admin    all @admin surface scenarios
test:e2e:<suite>:dev      managed clean local suite run
```

Use Playwright tags after npm's argument delimiter for feature/category selection instead of adding one root script per scenario:

```bash
npm run test:e2e:basic:dev -- --grep @flow
npm run test:e2e:basic -- --grep ATP-BASIC-FLOW-01
```

For the complete tag vocabulary, managed-runner argument boundaries, and externally managed-target examples, see [Repo Scripts](/reference/repo-scripts#ssr-browser-checks). For a separately managed Basic target, set `BASIC_E2E_BASE_URL`; the equivalent Commerce commands use `COMMERCE_E2E_BASE_URL`. The caller owns external-target data, cache, and artifact freshness.

## Zova script model

The underlying Zova package still organizes scripts around app mode and flavor.

Examples from the current source include:

- `dev:ssr:admin`
- `build:ssr:admin`
- `preview:ssr:admin`
- `dev:ssr:web`
- `build:ssr:web`
- `preview:ssr:web`
- `dev:ssr:cabloyBasicAdmin`
- `build:ssr:cabloyBasicAdmin`
- `build:rest:cabloyBasicAdmin`
- `dev:ssr:cabloyBasicWeb`
- `build:ssr:cabloyBasicWeb`
- `build:rest:cabloyBasicWeb`

## Cabloy Basic

The current public repository documents and scripts support Basic-specific flavors such as:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative Zova commands inside this repo include:

```bash
cd zova && npm run dev:ssr:cabloyBasicAdmin
cd zova && npm run build:ssr:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicAdmin
```

## Cabloy Start

The sibling `cabloy-start` repository is the private commercial edition and uses Start-specific flavors such as:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Those commands are not driven by the current Basic repo root wrappers, so verify the Start repo’s `package.json`, flavor names, SSR site baselines, and project assets before documenting or automating them.

## Workflow guidance

When documenting or automating frontend scripts:

- start from root wrappers for normal Cabloy Basic workflows
- detect the edition before choosing flavor-specific examples
- verify the exact flavor before writing edition-specific examples
- use REST/type generation commands deliberately when backend integration depends on them
- understand the mode/appMode/flavor model before changing script families; see [Environment and Config Guide](/frontend/environment-config-guide)
- enable or package frontend mock support deliberately when development depends on fake-server behavior; see [Mock Guide](/frontend/mock-guide)
- use [Frontend Quickstart](/frontend/quickstart) when the reader first needs the end-to-end onboarding story rather than only a script reference
