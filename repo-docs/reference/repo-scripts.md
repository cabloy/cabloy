# Repo Scripts

Use this page as the compact lookup surface for root scripts in Cabloy Basic and Cabloy Start.

For the broader Reference landing page, see [Reference Introduction](/reference/introduction).

Always start with the active repository's root `package.json`. Cabloy Basic is the public generated-project baseline; Cabloy Start is the public MIT-licensed edition in its own repository and has its own root command surface.

## Generated workspace manifests

The tracked root `package.json` is the primary command surface. The tracked `vona/package.original.json` and `zova/package.original.json` files are durable bootstrap manifest inputs. Their sibling `vona/package.json` and `zova/package.json` files are ignored generated working dependency closures, not durable edit targets.

Root `npm run init` runs `scripts/init.ts`, which restores each generated workspace manifest from its `package.original.json` input before running dependency generation. During Vona initialization, it also seeds generated `.zova-rest` workspace dependencies before the first install and dependency-tool run. Direct edits to either ignored workspace manifest are overwritten by the next root initialization.

Run root `npm run init` deliberately after a fresh clone, recovery of generated workspace state, or a framework upgrade. Do not treat it as an automatic follow-up for narrow changes.

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
- `npm run test:e2e`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

`npm run init` prepares all Cabloy Basic SSR and REST artifacts with `npm run build:zova:all`, which sequentially builds the Basic and Commerce flavor batches before Vona initialization. Use `build:zova` or `build:zova:commerce` for focused artifact refreshes; use `build:zova:all` only when every shipped Basic flavor must be prepared.

## Specification planning and derived charts

The current Cabloy Basic root scripts also expose:

```bash
npm run spec:check -- <suite>
npm run spec:check -- <suite> --lightweight --format json
npm run test:spec-charts
npm run spec:charts -- <suite>
npm run spec:charts:check -- <suite>
```

`spec:check` is a read-only planning-authority structure audit: complete mode checks core records, formal definitions, exact references and traceability, WBS/progress consistency, and supported local Markdown links. `--lightweight` checks the present authority and references without requiring a full baseline or charts; `--format json` emits deterministic diagnostics. Audit regressions run under `test:agent-governance`. A structural pass does not authenticate approval, business completeness, implementation, or acceptance evidence; existing legacy gaps should be reported rather than filled with invented requirements.

`spec:charts` refreshes the generated Gantt and burndown SVG views for a chart-compatible `repo-specs/<suite>/` record. `spec:charts:check` validates the supported input contract and detects stale generated views; `test:spec-charts` runs the chart-tool test suite. The deterministic implementation lives in `repo-agent-governance/tools/spec-charts/`, not inside a provider-specific skill discovery directory.

### Chart input contract

The generator consumes `README.md`, `pdp-wbs.md`, `test-plan.md`, and `progress.md`. The supported Markdown format includes:

- formal `### Phase <number>:` and `#### WBS-...:` headings in the WBS, with supported dependency labels
- formally defined `ATP-*` scenarios in the test plan for every ATP reference used by a WBS task
- exactly one progress row for each WBS item, with columns identified by the `WBS ID` and `Status` headers, regardless of their order; explicit WBS status must agree
- unique formal definitions and an acyclic dependency graph; both `Dependency:` and `Dependencies:` are supported, phase defaults apply only before the first task, and explicit task dependencies override them
- a README whose current title and language should be reflected by regenerated chart output

A legacy suite with a different WBS or progress-table layout is not chart-compatible until a deliberate record-format normalization aligns its authoritative Markdown with this input contract. Format normalization must preserve the existing planning authority; it does not require an unrelated product or delivery change.

These commands do not create planning authority, implement a WBS task, execute an ATP, produce acceptance evidence, or replace traceability/status review. Confirm the active root `package.json` and script input expectations before assuming equivalent behavior in Cabloy Start or another repository.

## Agent-governance maintenance

Use these Cabloy Basic maintenance commands when changing shared agent rules, root skill bundles, or adapter tooling:

```bash
npm run agent:governance:render
npm run agent:governance:check
npm run agent:governance:adopt
npm run agent:governance:pack-check
npm run test:agent-governance
npm run contract:gate -- --file <source-path> --format json
```

The renderer updates committed Claude Code, Codex, and Cursor adapters from `repo-agent-governance/`. The checker is read-only. Adoption preserves locally modified or unowned adapter files as conflicts rather than overwriting them. The contract gate is advisory and does not run builds automatically; use the active edition's verified contract-loop workflow for completion evidence.

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
- `npm run test:e2e`
- `npm run tsc`

Cabloy Start does not expose Basic Commerce or root documentation wrappers.

## Upgrade

Run `npm run upgrade:dry-run` before `npm run upgrade` to inspect framework files and root manifest entries that an upgrade would synchronize. The upgrader replaces the framework-owned `repo-agent-governance/` source, reconciles only its named package scripts, and uses ownership-aware adapter adoption. It preserves locally modified or legacy adapter outputs as conflicts for explicit review instead of blindly overwriting root Claude, Codex, or Cursor files.

### Cabloy Basic public projects

Basic upgrade owns these browser baseline paths:

```text
repo-e2e/config/
repo-e2e/scripts/
repo-e2e/specs/cabloy-basic.spec.ts
repo-e2e/specs/home-user-account.spec.ts
repo-e2e/specs/a-commerce.spec.ts
```

It reconciles the single framework-owned `test:e2e` script and the `@playwright/test` development dependency. The retired `test:e2e:fast` script is removed only if its value matches the known old framework command; a customized project alias is preserved. Keep additional project browser specs under other filenames in `repo-e2e/specs`; the upgrader updates only the listed framework files. The current fresh baseline is required and is not repaired for unsupported legacy project layouts.

### Cabloy Start repository

The Start E2E baseline is maintained in the separate Start repository:

```text
repo-e2e/config/
repo-e2e/scripts/
repo-e2e/specs/
```

The public-package upgrade flow does not source or reconcile the Start-owned baseline, its root E2E scripts, or `@playwright/test`. Keep project browser tests in the flat `repo-e2e/specs/` directory under distinct filenames, for example `repo-e2e/specs/my-project.spec.ts`.

## SSR browser checks

Cabloy Basic and Cabloy Start each use a single managed local `npm run test:e2e` command. In Basic, the runner checks the effective `normal/test/local` Vona listener port and starts one fresh `--workers=1 --flavor=normal --mode=test` worker. Test-mode startup initializes test resources; the runner does not invoke a separate `db:reset` or a development-mode server. Playwright does not reuse an existing process. Confirm exclusive ownership of the effective test database, `_local` Redis namespace, public/runtime paths, `APP_NAME`, API origin, and listener before starting it; port availability alone is insufficient.

Both editions' browser checks target Vona integrated SSR. In the Cabloy Basic default environment, the Vona listener is `7102`; the Zova standalone SSR development server uses `9000` and is not an acceptance target.

Place spec basenames directly after the npm script name; use npm's `--` delimiter only before Playwright options. Multiple spec names are allowed. With no names, every spec in `repo-e2e/specs` is discovered:

```bash
npm run test:e2e cabloy-basic home-user-account
npm run test:e2e a-commerce
npm run test:e2e home-user-account
npm run test:e2e a-commerce -- --grep ATP-SSR
npm run test:e2e a-commerce -- --grep-invert @admin
```

Tags remain independent from filenames. Repeat `--tag` to require all tags, while native `--grep` and `--grep-invert` remain available:

```bash
npm run test:e2e a-commerce -- --tag @web --tag @smoke
npm run test:e2e home-user-account -- --grep @flow --tag @web
```

The existing Basic tags include `@web`, `@admin`, `@smoke`, `@flow`, `@ssr`, `@theme`, and the business tags used by Commerce such as `@cart`, `@payment`, `@shipment`, and `@refund`. No suite tag is required. In Cabloy Basic, `E2E_BASE_URL` must be unset: external targets and a fast/no-reset mode are unsupported.

### Cabloy Basic and Commerce

The Basic baseline exercises Web at `/` and Admin at `/admin` through Vona integrated SSR dispatch. Prepare artifacts when frontend output has changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e cabloy-basic home-user-account
```

Commerce browser acceptance exercises Customer Web at `/commerce` and Operator Admin routing at `/commerce-admin`. Prepare its paired artifacts explicitly:

```bash
npm run build:zova:commerce
npm run deps:vona
npm run test:e2e a-commerce
```

### Cabloy Start

The Start suite exercises Web at `/` and Admin at `/admin` through Vona integrated SSR dispatch. Prepare current Start artifacts before a managed local run. The runner uses the effective local `normal`-flavor, test-mode Vona listener, rather than assuming a fixed port:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e
```

```bash
# Exact acceptance scenario
npm run test:e2e cabloy-start -- --grep ATP-START-FLOW-01

# Category or surface selection
npm run test:e2e cabloy-start -- --tag @smoke
npm run test:e2e cabloy-admin -- --tag @admin --tag @cabloy-admin
```

In Cabloy Start, the sole `npm run test:e2e` command checks the configured local port and starts a fresh runner-managed Vona target with `--workers=1 --flavor=normal --mode=test`. Playwright never reuses an existing server. Test-mode startup initializes test resources; the runner does not invoke a separate `db:reset`. Confirm ownership of the test database, Redis namespace, and public/runtime paths before running it; do not change shared environment identity or ports to bypass a busy resource.

`E2E_BASE_URL` is unsupported in Cabloy Start and must be unset, even for a local URL. Externally managed targets are not supported.

Browser commands consume existing SSR and REST artifacts; they never rebuild them. Install Chromium once when needed with `npx playwright install chromium`.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
