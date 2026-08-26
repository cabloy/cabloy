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

Cabloy Basic exposes these default Web and Admin wrappers:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build:zova:admin
npm run build:zova:web
```

They map to the `cabloyBasicAdmin` and `cabloyBasicWeb` flavors. Basic also includes the Commerce aggregate-and-surface wrappers:

```bash
# Customer Web or Operator Admin development server
npm run dev:zova:commerce:web
npm run dev:zova:commerce:admin

# Both Commerce SSR/REST artifact pairs, or one surface only
npm run build:zova:commerce
npm run build:zova:commerce:web
npm run build:zova:commerce:admin
```

`npm run build:zova:all` sequentially runs the focused Basic and Commerce batch builds. `npm run init` uses it to prepare every shipped Cabloy Basic SSR/REST flavor before Vona is initialized. For normal frontend work, continue to use `build:zova` or `build:zova:commerce` when only that suite's artifacts changed.

## Basic SSR browser acceptance

The default Basic Web and Admin sites have browser smoke commands that exercise Vona SSR dispatch at port `7102`, not a standalone Zova development-server port.

Prepare current SSR and REST artifacts explicitly when frontend output has changed:

```bash
# Web only
npm run build:zova:web

# Admin only
npm run build:zova:admin

# Both default Basic sites, then a managed local run
npm run build:zova
npm run deps:vona
npm run test:e2e cabloy-basic home-user-account
```

The managed clean command resets Vona-managed test data and the local Redis namespace, starts one development Vona worker, and runs the selected specs. Browser commands consume already-built artifacts; they do not rebuild them.

The unified runner uses two commands:

```text
npm run test:e2e                 clean local run with database reset
npm run test:e2e:fast            fast run without automatic reset
```

Place flat spec basenames directly after the npm script name. Use npm's `--` delimiter before Playwright options. With no names, every spec in `repo-e2e/specs` runs. Native `--grep` and `--grep-invert` remain available, and repeatable `--tag` values require all listed tags:

```bash
npm run test:e2e cabloy-basic home-user-account -- --grep @flow
npm run test:e2e:fast a-commerce -- --tag @web --tag @smoke
```

For the complete tag vocabulary, managed-runner argument boundaries, and externally managed-target examples, see [Repo Scripts](/reference/repo-scripts#ssr-browser-checks). A separately managed target uses `E2E_BASE_URL` with `test:e2e:fast`; the caller owns external-target data, cache, and artifact freshness.

## Cabloy Start root wrappers

Cabloy Start is the licensed private edition. Its default root wrappers use the `cabloyStartAdmin` and `cabloyStartWeb` flavors:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build:zova:admin
npm run build:zova:web
```

Cabloy Start does not expose the Basic Commerce wrapper family.

## Start SSR browser acceptance

The Start Web and Admin browser baseline also exercises Vona SSR dispatch at the effective local server port. Prepare current SSR and REST artifacts, then use the managed local command:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e
```

Start uses the same unified E2E command pair as Basic:

```text
npm run test:e2e       managed clean local suite run
npm run test:e2e:fast  fast rerun without an automatic reset
```

Select flat spec basenames and filter scenarios or surfaces with runner tags and native Playwright arguments. Current Start scenarios use tags including `@web`, `@admin`, `@smoke`, `@layout`, `@cabloy-admin`, `@account`, `@ssr`, and `@flow`:

```bash
npm run test:e2e cabloy-start
npm run test:e2e:fast cabloy-start -- --tag @web
npm run test:e2e:fast cabloy-admin -- --tag @admin --tag @cabloy-admin
npm run test:e2e:fast cabloy-start -- --grep ATP-START-FLOW-01
```

For a separately managed Start target, set `E2E_BASE_URL` and use `test:e2e:fast`. The target owner is responsible for data, cache, artifact freshness, and process lifecycle.

## Zova script model

The underlying Zova package organizes scripts around app mode and flavor.

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
- `dev:ssr:cabloyStartAdmin`
- `build:ssr:cabloyStartAdmin`
- `build:rest:cabloyStartAdmin`

## Cabloy Basic

The public repository supports Basic-specific flavors:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative Zova commands are:

```bash
cd zova && npm run dev:ssr:cabloyBasicAdmin
cd zova && npm run build:ssr:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicAdmin
```

## Cabloy Start

The licensed private repository supports Start-specific flavors:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Representative Zova commands are:

```bash
cd zova && npm run dev:ssr:cabloyStartAdmin
cd zova && npm run build:ssr:cabloyStartAdmin
cd zova && npm run build:rest:cabloyStartAdmin
```

## Workflow guidance

When documenting or automating frontend scripts:

- start from the root wrappers for the detected edition
- detect the edition before choosing flavor-specific examples
- verify the exact flavor before writing edition-specific examples
- use REST/type generation commands deliberately when backend integration depends on them
- understand the mode/appMode/flavor model before changing script families; see [Environment and Config Guide](/frontend/environment-config-guide)
- enable or package frontend mock support deliberately when development depends on fake-server behavior; see [Mock Guide](/frontend/mock-guide)
- use [Frontend Quickstart](/frontend/quickstart) when the reader first needs the end-to-end onboarding story rather than only a script reference
