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

For the edition-detection workflow, see [Cabloy Editions: For AI Development](/editions/overview#for-ai-development).

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

## Zova standalone SSR development

The `dev:zova:*` commands start the Zova development server, which uses `9000` in the Cabloy Basic default environment. Use this Zova standalone SSR entry for page, route, and hydration iteration. It may be used as Vona's development proxy target, but direct access to `9000` does not prove the Vona request boundary or integrated acceptance.

## Proportionate frontend verification

For frontend changes, prefer a few critical user flows through the existing E2E infrastructure, together with relevant lightweight format, lint, and type checks. Select scenarios by the behavior being changed rather than running every spec or building exhaustive isolated-test matrices. Reuse the edition-aware preparation and spec/tag/`--grep` filtering below; prepare only the affected artifacts when they have changed.

Do not introduce custom source-evaluation loaders or extensive fake dependencies by default for ordinary page interactions. When an actual problem is fixed, add a focused regression test that reproduces it. Targeted unit and framework tests remain useful when they provide direct, low-cost proof; comprehensive upfront coverage is not a delivery prerequisite.

This preference does not relax applicable SSR/hydration, authentication, authorization, contract, or acceptance requirements, and UI coverage never replaces server-side enforcement. Managed E2E resource isolation remains required. If runtime verification is unavailable or not authorized, report the gap rather than adding substitute test machinery; live Provider and destructive operations retain their separate authorization boundaries.

## Vona integrated SSR browser acceptance

The default Basic Web and Admin sites have browser smoke commands that exercise Vona integrated SSR through Vona SSR dispatch at the managed run's dynamically allocated test listener, not through the ordinary Vona development listener (`7102` by default) or the Zova standalone SSR development-server port. Vona supplies the API origin at runtime, so no Zova `.env` change or rebuild is needed solely for the test port; see [Runtime API origins in Vona integrated SSR](/fullstack/ssr-entry-modes#runtime-api-origins-in-vona-integrated-ssr).

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

The sole managed `npm run test:e2e` command starts a fresh local Vona worker with `--workers=1 --flavor=normal --mode=test`, then runs the selected specs against Vona integrated SSR. Test-mode startup initializes test resources without a separate `db:reset`; browser commands consume already-built artifacts and do not rebuild them. In both Cabloy Basic and Cabloy Start, the root wrapper allocates run-owned test identity, database and Redis namespaces, generated/runtime/public paths, and a loopback listener independently of ordinary dev. A running same-checkout dev process alone is not a blocker. Check actual overlap with those test resources and custom external resources, and coordinate overlapping shared build/dependency writes; do not require dev shutdown or worktree/environment setup solely for these tests. See [Test isolation and development data](/reference/repo-scripts#test-isolation-and-development-data) for the ownership and preparation boundaries.

Place flat spec basenames directly after the npm script name. Use npm's `--` delimiter before Playwright options. With no names, every spec in `repo-e2e/specs` runs. Native `--grep` and `--grep-invert` remain available, and repeatable `--tag` values require all listed tags:

```bash
npm run test:e2e cabloy-basic home-user-account -- --grep @flow
npm run test:e2e a-commerce -- --tag @web --tag @smoke
```

For the complete Basic tag vocabulary and managed-runner argument boundaries, see [Repo Scripts](/reference/repo-scripts#ssr-browser-checks). `E2E_BASE_URL` must be unset: externally managed targets are unsupported.

Cabloy Basic's Chromium Basic/Commerce CI baselines configure Ubuntu, Windows, and macOS; a matrix declaration is not evidence that all six combinations passed. On native Windows, public commands work from CMD or PowerShell and require PowerShell 7 on `PATH`, local NTFS storage, reachable Redis, installed Chromium, and ready paired SSR/REST artifacts. Managed browsers inherit a registered non-breakaway Windows Job; both worker and browser membership are verified through its owning helper, and cleanup requires whole-Job drainage rather than browser close alone. Normal Windows server teardown uses authenticated cooperative shutdown; failures or interruption retain claims and resources. POSIX browsers retain independent process-group verification. See [Native Windows managed tests](/reference/repo-scripts#native-windows-managed-tests) for the prerequisites, lifecycle, and coverage limits; this is not a claim about Cabloy Start's Windows browser support.

## Cabloy Start root wrappers

Cabloy Start is the public MIT-licensed edition. Its default root wrappers use the `cabloyStartAdmin` and `cabloyStartWeb` flavors:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build:zova:admin
npm run build:zova:web
```

Cabloy Start does not expose the Basic Commerce wrapper family.

## Start SSR browser acceptance

The Start Web and Admin browser baseline exercises Vona integrated SSR dispatch at the managed run's dynamically allocated loopback listener, independently of the ordinary dev listener. Prepare current SSR and REST artifacts, then use the managed local command:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e
```

Start uses one E2E command and one fresh managed local test-mode lifecycle:

```text
npm run test:e2e       fresh managed local test-mode suite run
```

Select flat spec basenames and filter scenarios or surfaces with runner tags and native Playwright arguments. Current Start scenarios use tags including `@web`, `@admin`, `@smoke`, `@layout`, `@cabloy-admin`, `@account`, `@ssr`, and `@flow`:

```bash
npm run test:e2e cabloy-start
npm run test:e2e cabloy-start -- --tag @web
npm run test:e2e cabloy-admin -- --tag @admin --tag @cabloy-admin
npm run test:e2e cabloy-start -- --grep ATP-START-FLOW-01
```

Start does not support externally managed E2E targets: `E2E_BASE_URL` must be unset. Like Basic, its root wrapper allocates run-specific test identity, database and Redis namespaces, generated/runtime/public paths, and a loopback listener, then starts one Vona worker with `--workers=1 --flavor=normal --mode=test`; Playwright does not reuse an existing process. It can run alongside ordinary same-checkout dev without requiring the configured dev port to be free. Test-mode startup initializes test state without a separate `db:reset`. Apply the same [test-resource ownership and shared-preparation checks](/reference/repo-scripts#test-isolation-and-development-data); the command does not replace the paired build/dependency-sync prerequisite or authorize shared environment/port changes.

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

The separate public Cabloy Start repository supports Start-specific flavors:

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
