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
- `npm run contract:generate:isolated`
- `npm run db:reset`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

`npm run init` prepares all Cabloy Basic SSR and REST artifacts with `npm run build:zova:all`, which sequentially builds the Basic and Commerce flavor batches before Vona initialization. Use `build:zova` or `build:zova:commerce` for focused artifact refreshes; use `build:zova:all` only when every shipped Basic flavor must be prepared.

## Test isolation and development data {#test-isolation-and-development-data}

<span id="test-isolation-and-development-data-in-cabloy-basic"></span>

Cabloy Basic and Cabloy Start both support root `npm run test` and `npm run test:e2e` alongside ordinary development services in the **same checkout**. Their managed runners allocate isolated test resources; an ordinary dev process alone is not a reason to stop services, create another worktree, or change environment identity or ports. Detect the active edition to select its scripts and artifact prerequisites, not to decide whether this guarantee applies.

Root `npm run test` delegates to Vona's `npm run test`; both it and direct `cd vona && npm run test` use the same isolated runner. Vona's `npm run cov` also uses that runner and enables coverage. Root `npm run test:e2e` retains its own isolated E2E entrypoint. Each command launches a new test-mode run, even in the same checkout as a running development server. The runner chooses a UTC `YYYYMMDDHHmmss` timestamp plus eight lowercase cryptographically random hexadecimal characters for one run ID (for example, `20261014010203-a1b2c3d4`). This ID names both owned Vona directories (`.app-test-<id>` and `.vona-test-<id>`) and the disposable database and Redis namespaces; the runner also allocates a loopback listener. The runner exclusively creates an ignored JSON claim at `vona/.vona-test-claim/<id>.json` before allocating resources. A rare claim or directory collision fails without adopting or deleting the existing paths; rerun the command. Independent checkouts sharing database or Redis services do not share these claims, so their random suffixes reduce, but cannot eliminate, cross-checkout collisions.

Claims contain a versioned, nonsecret resource inventory: owned local roots, exact database allocation intents, Redis namespaces and endpoint identities, process ownership, and cleanup progress. Allocators must receive an acknowledgment that their intent is recorded before creating a database or using framework-managed Redis resources. Credentials, full environment/configuration snapshots, and readiness secrets are not stored in claims.

Successful unit, coverage, and managed application E2E runs release inventoried database and Redis resources and remove their owned local roots after process shutdown is verified. Managed E2E uses a registered browser fixture to verify detached browser-group shutdown; its run-owned reports, traces, and temporary profiles are deleted on success too. The claim is deleted last. Failed or interrupted runs retain their claim and resources for inspection. Cleanup failure also makes the command fail and retains the journal for retry.

Before each new invocation, the runner checks retained claims against their immutable UTC creation timestamp. Claims older than one day are eligible for cleanup; set `VONA_TEST_CLAIM_TTL_SECONDS` to a positive integer to change the default `86400` seconds. Eligibility is not permission to delete a live or unowned resource: the runner retains malformed claims, mismatched owner markers, symlinked paths, changed service endpoints, live or uncertain process identities, incomplete launch registrations, and claims with an existing cleanup lock. Inspect these warnings manually; a lock is never taken over merely because it is old. Cleanup resolves current trusted configuration without starting the application, running seeds, or opening a listener. It drops only recorded database names and scans only exact recorded Redis prefixes, never flushing Redis. Partial progress is journaled so a later eligible cleanup can retry safely. Legacy `.vona-test-claim-<id>` directories and inventory-less run roots are not automatically migrated or deleted.

All three commands initialize test databases and run module `seed()` hooks; none resets the ordinary dev-mode database or deletes its business data. A narrow test selection still initializes the test environment. Raw `:bin:test` invocations bypass the public scripts and do not get the runner's isolation guarantee.

Coverage reports (`vona/coverage/lcov.info` and, without `--ci`, `vona/coverage/report`) are shared checkout-level artifacts, not run-owned data. Avoid overlapping coverage runs or relying on these reports as independent per-run output.

Builds, generated artifacts, dependency installation/generation, and other shared preparation writes remain accepted prerequisites when needed. Test isolation does not make those writes private or authorize an unrelated reset of development data. The run-specific identity namespaces framework-managed resources; separately configured external databases, Redis targets or unprefixed custom keys, and third-party providers still require deliberate ownership and isolation.

Judge preflight conflicts by actual resource overlap, not process names:

| Situation                                                                                                                                   | Required action                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary Vona or Zova dev services are running in the same checkout                                                                         | Not a blocker by itself; do not require shutdown or environment/worktree setup solely for root managed tests.                                                                   |
| Another operation writes the same build output, generated artifacts, installed dependencies, or coverage reports                            | Coordinate the overlapping shared writes and artifact readiness; these outputs are not run-private.                                                                             |
| A runner-owned listener, test identity, claim, database/Redis namespace, or path actually collides, or a custom external resource is shared | Diagnose ownership and wait or ask when needed; do not adopt another run's resources, reset dev data, kill its process, or change shared identity/ports to bypass the conflict. |

A process-list match or a free port alone is not proof of either a conflict or safe ownership. Use the managed root entrypoints and retain normal execution-authorization checks; isolation is not a blanket reset or cleanup authorization.

`npm run contract:generate:isolated -- <module-name>` starts a fresh test-mode Vona service on a run-owned loopback port, verifies its signed readiness response, fetches the Swagger document, and invokes the existing Zova OpenAPI generator without Playwright. The run owns its disposable test resources and claim-backed local roots; successful runs clean them after the service drains, while failures retain the claim and evidence for inspection. The generated SDK files under `zova/src/**` remain shared checkout output, so serialize concurrent generation for the same workspace/module and do not treat this command as an automatic rollback boundary.

For Vona integrated SSR, the allocated E2E origin is supplied to Zova at runtime as server `SSR_API_BASE_URL` and browser `API_BASE_URL`. Do not edit Zova `.env` files or rebuild solely to match the test port. The current root `npm run test:e2e` consumes prebuilt frontend artifacts; refresh affected SSR/REST output and synchronize dependencies when their inputs change. See [Runtime API origins in Vona integrated SSR](/fullstack/ssr-entry-modes#runtime-api-origins-in-vona-integrated-ssr) for configuration overrides and scope.

For deliberate **dev-mode** database preparation, `npm run db:reset` is a separate, destructive command: in a single process, it clears validated application-owned Redis keys, drops and recreates managed disposable development databases, reruns migrations and instance initialization, then runs module `seed()` hooks. It requires `database.testDatabase: true` in the dev configuration and a connection outside the disposable database. Ordinary `npm run dev` and `npm run dev:one` only reuse existing managed databases; if any required target is missing, startup fails promptly with an instruction to run `npm run db:reset`. They do not create databases, perform creation-time Redis cleanup, or seed. Never run `db:reset` against development data you need to retain. Upgrades do not reset existing development data or repeat its seeds. See [Development database preparation](#development-database-preparation) and [Migration and Changes](/backend/migration-and-changes#local-development-workflow).

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

## Development database preparation

**Cabloy Basic and Cabloy Start** share this explicit development-preparation lifecycle. Use the active repository's commands and configuration; sharing the lifecycle does not make the editions' flavors or frontend outputs interchangeable.

With `database.testDatabase: true`, `npm run dev` and `npm run dev:one` only reuse existing framework-managed disposable development databases:

- **All required databases exist:** startup reuses them without database creation, creation-time Redis cleanup, or module seeding. Ordinary startup is not a reset or a repeatable fixture-import path.
- **Any required database is missing:** startup fails promptly with an instruction to run `npm run db:reset`. This check covers both shared and statically configured isolate database targets; the presence of the shared database alone is not sufficient. Startup does not create the missing target or clear Redis or seed as a fallback.

`npm run db:reset` is the explicit, destructive preparation command. It requires `database.testDatabase: true` and a connection outside the disposable database. In a single process, it clears validated application-owned Redis state with `clearAllData()`, drops and recreates the managed disposable dev databases, then runs migrations, instance initialization, and module `seed()` hooks.

**Stop the development server and any other processes using the same database and Redis namespace before running reset.** There is no file-based preparation lock: concurrent dev/dev and dev/reset processes against the same database and Redis namespace are unsupported. Disabling the reset command's own listener does not make reset safe alongside a live server or queue worker. Do not reset data you need to retain.

Reset failures remain visible. There is no preparation journal or automatic recovery; investigate and resolve the failure, then explicitly rerun `npm run db:reset`. Do not use ordinary dev startup to repair or finish a partial reset.

Here, `clearAllData()` deletes only keys in the validated application-owned Redis prefixes, covering Bull queue, redlock, worker, and cache keys. It does not use `FLUSHDB` or `FLUSHALL`, clear unrelated namespaces, or treat broadcast subscriptions as cleanup keys. Prefix scoping still makes reset destructive to the application's own Redis state; it is not permission to clean a shared live namespace manually.

See [Managed development database preparation](/backend/migration-and-changes#managed-development-database-preparation) for the seed lifecycle and safety boundary.

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

Cabloy Basic and Cabloy Start each use a managed local `npm run test:e2e` command. In both editions, the root wrapper allocates a run-specific test identity, disposable database and Redis namespaces, Vona generated/runtime/public paths, and an available loopback port, then starts a fresh `--workers=1 --flavor=normal --mode=test` worker. Test-mode startup initializes test resources and invokes module seeds without a separate dev-mode `db:reset`; Playwright does not reuse an existing process. This protects ordinary same-checkout development data and permits root E2E alongside a dev server in either edition, subject to the [shared-preparation and external-resource boundaries](#test-isolation-and-development-data).

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

The Start suite exercises Web at `/` and Admin at `/admin` through Vona integrated SSR dispatch. Prepare current Start artifacts before a managed local run. The runner allocates a loopback listener for its `normal`-flavor, test-mode Vona worker independently of the configured dev port:

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

In Cabloy Start, the sole `npm run test:e2e` command uses the allocated run listener and starts a fresh runner-managed Vona target with `--workers=1 --flavor=normal --mode=test`. Playwright never reuses an existing server. Test-mode startup initializes test resources; the runner does not invoke a separate `db:reset`. Ordinary same-checkout dev presence is not a blocker, and its configured port need not be free. Apply the same run-owned resource and shared-preparation checks as Basic; do not change shared environment identity or ports to bypass an actual conflict.

`E2E_BASE_URL` is unsupported in Cabloy Start and must be unset, even for a local URL. Externally managed targets are not supported.

Browser commands consume existing SSR and REST artifacts; they never rebuild them. Install Chromium once when needed with `npx playwright install chromium`.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
