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
- `npm run tsc:zova`
- `npm run tsc:vona`
- `npm run test:typecheck`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

`npm run init` prepares all Cabloy Basic SSR and REST artifacts with `npm run build:zova:all`, which sequentially builds the Basic and Commerce flavor batches before Vona initialization. Use `build:zova` or `build:zova:commerce` for focused artifact refreshes; use `build:zova:all` only when every shipped Basic flavor must be prepared.

## TypeScript toolchains in Cabloy Basic

Cabloy Basic keeps two TypeScript toolchains: root `@typescript/native` is the exact npm alias `npm:typescript@7.0.2`, while classic `typescript` 5.9.3 remains available for compiler-API consumers and existing tooling. The alias changes the dependency name, not the executable name: its package still declares `bin.tsc`, not a separate `native` or `tsgo` command.

Use the root commands to select the workspace scope:

| Root command             | Scope                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run tsc`            | Check Zova, then Vona, through their workspace defaults: single-project, no-emit checks with native TypeScript and incremental caching disabled.                          |
| `npm run tsc:zova`       | Check Zova through its workspace `tsc` script.                                                                                                                            |
| `npm run tsc:vona`       | Check Vona through its workspace `tsc` script.                                                                                                                            |
| `npm run test:typecheck` | Test compiler selection, argument and failure propagation, daily-check configuration/scripts, CLI command registration, and installed compiler versions/API availability. |

`scripts/typecheck.ts` delegates to the package-resolving runner in `scripts/typescriptRunner.ts`. It resolves `@typescript/native` or `typescript` from the target workspace, reads that package's `bin.tsc`, and invokes it directly with Node. Native Vona checks use the same runner. This avoids relying on `PATH` or a shared `.bin/tsc` name to identify the selected compiler.

Explicit native and legacy checks use `--noEmit --incremental false`: Zova selects `tsconfig.vue-tsc.json`, and Vona selects `tsconfig.json`. Vona's daily config has no `include` or project `references`; default source discovery is filtered by `exclude`, following Zova's approach. Backend/application/module source and module tests are checked together in one program. CLI tooling, package-directory roots, dependencies, distribution output, and generated runtime/REST directories are excluded from initial discovery. Exclusions are not import barriers: required framework/package source and hidden module metadata still participate through imports. Unreferenced hidden helpers and generated `.vona` bootstraps are not independent daily-check roots.

Root `npm run tsc` runs `tsc:zova`, then `tsc:vona`; these are the only root `tsc` entrypoints. Compiler selection remains in the nested workspaces: use `pnpm --dir zova run tsc:legacy` or `pnpm --dir vona run tsc:legacy` for comparison or fallback, and the corresponding workspace `tsc:native` scripts for explicit native checks. The former `tsc:force`, `tsc:vona:native:force`, and nested Vona `tsc:native:force` aliases have been removed: these source checks neither run a project build nor emit declarations/build-info files. Each module's existing publication scripts remain responsible for its declaration output; there is no separate root declaration-validation workflow.

In both nested workspaces, `npm run tsc` delegates to `npm run tsc:native`. Native and legacy checks first run `npm run prerun`, then invoke the selected compiler with incremental caching disabled. Root workspace aliases delegate to these scripts too, so dependency and generated metadata preparation is not bypassed. Each workspace's `prerun` runs only its `:tools:deps` command; it does not call `tsc`, avoiding recursive script execution. Preparation may refresh generated metadata or dependency manifests and install changed dependencies, while the compiler step itself emits no declarations or build-info files.

Zova development and build entrypoints call `npm run prerun` before Quasar or REST emission to prepare dependencies and generated metadata without automatically running a typecheck. Run `npm run tsc`, `npm run tsc:native`, or `npm run tsc:legacy` explicitly inside the Zova workspace when source typechecking is needed. The former multi-project Vona CLI command `:bin:tsc` has been removed; use the project checking scripts instead. Module publication configurations and REST emitters are unchanged. Classic TypeScript remains installed for compiler-JavaScript-API consumers, including SWC configuration loading, Rollup integration, and OpenAPI generation; the REST emitter retains the `@typescript/native-preview` dependency name as an npm alias for stable `typescript@7.0.2`, preserving its declaration plugin's compiler lookup.

The native alias is installed at the repository root, not in either nested workspace. Run `pnpm install` at the root after updating the checkout; a missing alias fails with an installation diagnostic rather than silently selecting the legacy compiler. Do not use a bare root `tsc`/`pnpm exec tsc` to choose a compiler, because both packages declare the same binary name.

The `vona-tsc` CI workflow runs root `npm run test:typecheck`, then root `npm run tsc`, after its existing initialization. The root release workflow runs `npm run tsc` before versioning/publishing (excluding changelog-only and GitHub-release-only runs), and its post-release compensation verification uses the same default entrypoint. CI and release checks therefore both use native TypeScript source checks through the workspace defaults, with incremental caching disabled. Check the active repository before assuming the same aliases or commands exist in Cabloy Start.

## Test isolation and development data {#test-isolation-and-development-data}

<span id="test-isolation-and-development-data-in-cabloy-basic"></span>

Cabloy Basic and Cabloy Start both support root `npm run test` and `npm run test:e2e` alongside ordinary development services in the **same checkout**. Their managed runners allocate isolated test resources; an ordinary dev process alone is not a reason to stop services, create another worktree, or change environment identity or ports. Detect the active edition to select its scripts and artifact prerequisites, not to decide whether this guarantee applies.

Root `npm run test` delegates to Vona's `npm run test`; both it and direct `cd vona && npm run test` use the same isolated runner. Vona's `npm run cov` also uses that runner and enables coverage. Root `npm run test:e2e` retains its own isolated E2E entrypoint. Each command launches a new test-mode run, even in the same checkout as a running development server. The runner chooses a UTC `YYYYMMDDHHmmss` timestamp plus eight lowercase cryptographically random hexadecimal characters for one run ID (for example, `20261014010203-a1b2c3d4`). This ID names both owned Vona directories (`.app-test-<id>` and `.vona-test-<id>`) and the disposable database and Redis namespaces; the runner also allocates a loopback listener. The runner exclusively creates an ignored JSON claim at `vona/.vona-test-claim/<id>.json` before allocating resources. A rare claim or directory collision fails without adopting or deleting the existing paths; rerun the command. Independent checkouts sharing database or Redis services do not share these claims, so their random suffixes reduce, but cannot eliminate, cross-checkout collisions.

Claims contain a versioned, nonsecret resource inventory: owned local roots, exact database allocation intents, Redis namespaces and endpoint identities, process ownership, and cleanup progress. Allocators must receive an acknowledgment that their intent is recorded before creating a database or using framework-managed Redis resources. Credentials, full environment/configuration snapshots, and readiness secrets are not stored in claims.

Successful unit, coverage, and managed application E2E runs release inventoried database and Redis resources and remove their owned local roots after process shutdown is verified. Managed E2E uses a registered browser fixture: POSIX browsers have independently verified process groups, while Windows workers and browsers must prove membership in the designated registered guardian Job. Cleanup requires verified process-group or whole-Job drainage, respectively; browser close or a missing PID is not sufficient proof. Run-owned reports, traces, and temporary profiles are deleted on success too. The claim is deleted last. Failed or interrupted runs retain their claim and resources for inspection. Cleanup failure also makes the command fail and retains the journal for retry.

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

For an explicitly authorized contract-generation run that must not reap historical claims, Cabloy Basic and Cabloy Start support this opt-in form:

```bash
npm run contract:generate:isolated -- <module-name> --skip-expired-claim-reaping
```

The wrapper consumes this standalone flag rather than forwarding it to Zova; `--skip-expired-claim-reaping=...` is rejected. Without the flag, contract generation retains normal historical-claim reaping. Unit, coverage and E2E defaults are unchanged; the runner rejects their use of this opt-out.

The opt-in lane requires strict freshness after application configuration and before module loading: run-owned public/runtime/SQLite directories must be absent or empty, shared and static-isolate database namespaces must be absent, and persistent Redis namespaces must be empty. Read-only discovery failures or preexisting resources fail closed rather than authorizing deletion. Startup requires per-application freshness proof to bypass normal test clearing; database preparation rechecks the namespace, never drops existing databases in this lane, and reuses only a database creation recorded by that application.

In the strict opt-in lane, generated `env.ts` contains a selected-key projection of the bootstrap process environment, not serialized configuration values. The CLI passes its resolved configuration to the bootstrap child in memory, preserving resolved-value precedence without exposing every inherited environment key through `app.meta.env`. Strict generation requires test mode and matching run-owned directories before configuration loading or generated-file writes. Ordinary dev/build/test and default contract generation keep their existing environment generation behavior.

Strict service and generator stdout/stderr are discarded, not captured for later redaction. Framework logger access bypasses client configuration and transport construction; direct file-transport construction fails before filesystem or rotation access. Parent failures report categorical stages instead of raw child errors, causes or response bodies. Windows output still drains through the native bridges into discard streams; this implementation policy and synthetic coverage are not native Windows runtime verification. Custom filesystem writers, external logging sinks and seed behavior remain outside this framework diagnostic boundary: it is not a universal secret sandbox or secret scanner.

This still loads environment configuration, initializes newly allocated test databases and Redis/runtime resources, and runs normal module seeds. Successful runs clean only their inventoried current-run resources after verified shutdown; failed runs retain their claim/resources, without automatic generation retry or fallback. Discarded diagnostics are not recoverable from a retained claim. Generated consumers remain shared checkout writes. Freshness is a snapshot, **not an exclusive lease**, zero-mutation mode, network sandbox, blanket log-redaction guarantee, or authorization to contact a Provider. Independently configured external resources and Provider operations retain their separate ownership and approval requirements. This shared flag does not extend Basic's separately scoped Windows verification to Start.

For Vona integrated SSR, the allocated E2E origin is supplied to Zova at runtime as server `SSR_API_BASE_URL` and browser `API_BASE_URL`. Do not edit Zova `.env` files or rebuild solely to match the test port. The current root `npm run test:e2e` consumes prebuilt frontend artifacts; refresh affected SSR/REST output and synchronize dependencies when their inputs change. See [Runtime API origins in Vona integrated SSR](/fullstack/ssr-entry-modes#runtime-api-origins-in-vona-integrated-ssr) for configuration overrides and scope.

For deliberate **dev-mode** database preparation, `npm run db:reset` is a separate, destructive command: in a single process, it clears validated application-owned Redis keys, drops and recreates managed disposable development databases, reruns migrations and instance initialization, then runs module `seed()` hooks. It requires `database.testDatabase: true` in the dev configuration and a connection outside the disposable database. Ordinary `npm run dev` and `npm run dev:one` only reuse existing managed databases; if any required target is missing, startup fails promptly with an instruction to run `npm run db:reset`. They do not create databases, perform creation-time Redis cleanup, or seed. Never run `db:reset` against development data you need to retain. Upgrades do not reset existing development data or repeat its seeds. See [Development database preparation](#development-database-preparation) and [Migration and Changes](/backend/migration-and-changes#local-development-workflow).

### Native Windows managed tests {#native-windows-managed-tests}

<span id="native-windows-unit-tests"></span>

The Cabloy Basic SQLite unit-test workflow and Chromium application E2E workflow configure native Windows runners alongside Ubuntu and macOS. Each E2E suite has its own three-OS matrix with `fail-fast: false`, Node.js 24, pnpm 12.14.0, and SQLite. Basic selects `cabloy-basic home-user-account`; Commerce selects `a-commerce markdown` and retains its explicit Commerce artifact build and Vona dependency synchronization. A configured matrix is not proof of a successful run: inspect the focused gates, real Windows Chromium lifecycle regressions, and all six hosted Basic/Commerce suite-and-OS results before claiming verified platform compatibility.

On Windows, the managed test entrypoints require Node.js with npm, PowerShell 7 (`pwsh.exe` on `PATH`), local NTFS storage, and a reachable Redis service. E2E also requires Playwright's Chromium installation and current SSR/REST artifacts with Vona dependencies synchronized. PowerShell is an internal helper dependency, not a required interactive terminal. From either CMD or PowerShell, use the same public commands:

```text
npm run test
npx playwright install chromium
npm run test:e2e -- cabloy-basic home-user-account
```

The Node runner explicitly invokes its checked-in Windows helper; it does not interpret PowerShell code in the caller's shell or download a helper runtime. It uses a non-breakaway Windows Job Object to contain the test process tree, with job membership established at process creation and kill-on-close ownership. Claim directories and files use protected private Windows ACLs and reject unsafe reparse points and hardlinks. Flushed file contents and same-volume atomic updates provide the supported local-NTFS process-crash publication contract; this is not a claim of POSIX directory-fsync equivalence or power-loss durability.

A missing native capability, unsafe claim storage, ambiguous process identity, or unproven job drainage fails closed. Failed/interrupted runs retain their claims; helper disappearance alone never authorizes cleanup. Do not bypass these checks with raw test commands or remove retained resources without verifying ownership. The npm CLI is resolved from the npm invocation or its standard location beside the Node installation; a pnpm executable is not substituted for npm's JavaScript entrypoint.

The Windows CI Redis setup uses a pinned, checksum-verified [third-party Redis Windows development distribution](https://github.com/redis-windows/redis-windows/releases/tag/8.2.10) with its bundled Cygwin runtime, bound to loopback. This is not an official Redis Windows port or a production deployment recommendation. Linux CI uses a Redis container with a health check; macOS starts native loopback Redis with bounded readiness polling. The native setups do not install persistent services. Local users must provision Redis deliberately; neither managed test command installs it. Chromium's `--with-deps` installation is Linux-only in CI; Windows and macOS use `playwright install chromium`.

For Windows E2E, the managed fixture verifies the Playwright worker's membership before browser launch, then verifies the actual browser child's membership before connecting. The claim broker authenticates the query and asks the live helper owning that registered Job to check exact PID/creation-time identity and membership in that specific Job. An inherited registration locator, an environment flag, or membership in some other Job is not ownership proof. The Job handle stays private, and Windows browsers do not fabricate POSIX process-group claims. Inherited or custom `TEMP`, `TMP`, and `TMPDIR` names are handled case-insensitively and normalized to the run-owned temporary root.

After authenticated readiness, normal Windows Vona teardown uses an authenticated, nonce-bound loopback shutdown request and acknowledgment, then awaits a zero server exit and the helper's whole-Job drainage proof. This path reuses the worker's awaited application-close lifecycle; it does not emulate POSIX graceful signals. Refusal, invalid proof, timeout, interruption, unexpected exit, or uncertain drainage fails the run and invokes failure-stop where possible. Force-stop is never reclassified as successful teardown. Controller/helper death and cancellation retain claims and resources; disappearing PIDs alone never authorize cleanup.

The supported application browser scope here is Cabloy Basic's Chromium Basic/Commerce baselines, not every browser, documentation E2E, Cabloy Start, or generic POSIX signal parity. The E2E workflow uploads failure-only reports from `vona/.app-test-*/playwright-report/` and `vona/.app-test-*/test-results/`, including hidden run directories, under suite-and-OS-specific artifact names. It never uploads whole run roots. Failed runs retain local claims/resources for inspection, while successful runs remove their run-owned reports and profiles along with other inventoried resources.

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

## Evidence path sanitization

The dependency-free path tool lives in `repo-agent-governance/tools/evidence-paths/sanitize.mjs`. It sanitizes caller-supplied UTF-8 stdin, or independently checks explicitly selected files/directories without rewriting them:

```bash
npm run --silent evidence:sanitize -- --help
npm run --silent evidence:check -- -- repo-specs/example/evidence
# Declare another checkout or external root; use the same mappings when checking.
npm run --silent evidence:sanitize -- --map '/synthetic/other-checkout=MAIN_CHECKOUT'
npm run --silent evidence:check -- --map '/synthetic/other-checkout=MAIN_CHECKOUT' -- evidence.pending.txt
```

The last two commands illustrate a **synthetic** root, not a detected local location. `sanitize` waits for stdin; it does not run a producer. Use quiet npm output so npm banners are not mixed into the retained stream. Default checkout discovery comes from the tool's installed location, not the shell working directory; `--repo-root ROOT` overrides it. Repeatable `--map ROOT=ALIAS` declares additional absolute roots with stable uppercase aliases, such as `MAIN_CHECKOUT`. Longest matching roots win at path-segment boundaries. Checkout paths become repository-root-relative; explicit external mappings become `<ALIAS>/suffix`. Choose aliases that distinguish unrelated roots and review any sensitive suffixes.

### Capture before retaining

Combine producer stdout/stderr **before** sanitization, never `tee` or spool raw output first. Use a new output filename, check sanitizer status, and retain the actual producer result, including failures. See [Verify narrowly and retain evidence](/ai/playbook-spec-execution#verify-narrowly-and-retain-evidence) for a Bash pipeline with immediate per-stage status capture. Zsh uses `pipestatus` instead of Bash `PIPESTATUS`. `pipefail` prevents a passing sanitizer from masking an upstream failure, but it does not preserve every stage's exact code. A failed sanitizer may leave earlier sanitized lines; partial output must not be accepted as evidence. The tool does not automatically intercept terminal or agent-tool output and does not authorize capturing secret-bearing streams.

### Windows and PowerShell

The tool uses Node's native filesystem APIs on Windows, Linux and macOS; it requires the repository's Node.js version (`>=24.4.0`). Path-text recognition is cross-platform independently of the host OS. Native filesystem behavior is checked by the `evidence-platforms` CI matrix on Ubuntu, Windows and macOS. A configured matrix is not a successful run: inspect the actual job results before claiming all three platforms are verified.

From the repository root, PowerShell can invoke the CLI directly:

```powershell
node .\repo-agent-governance\tools\evidence-paths\sanitize.mjs --help
node .\repo-agent-governance\tools\evidence-paths\sanitize.mjs check -- '.\evidence.pending.txt'
$checkExit = $LASTEXITCODE
# 0 = clean, 1 = paths found, 2 = incomplete/error
```

For a **synthetic input smoke test only**, not evidence capture from a real producer:

```powershell
$previousOutputEncoding = $OutputEncoding
try {
  $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  'Unicode sample: café C:\Users\Synthetic\private\log.txt' |
    node .\repo-agent-governance\tools\evidence-paths\sanitize.mjs sanitize
  $sanitizeExit = $LASTEXITCODE
  # Expected output: Unicode sample: café <PRIVATE_PATH>
} finally {
  $OutputEncoding = $previousOutputEncoding
}
```

Bash `pipefail`/`PIPESTATUS` and Zsh `pipestatus` are not PowerShell syntax. `$LASTEXITCODE` after a native pipeline is not a record of every stage's status. For real producer capture, use the Bash example in a Bash environment, or orchestration that explicitly observes both native processes and supplies UTF-8 bytes without a raw spool; do not claim the synthetic example preserves a producer exit code. Never accept evidence based only on the last pipeline command succeeding.

Prefer PowerShell 7.4+ for native byte-stream pipelines/redirection. Windows PowerShell 5.1 and text cmdlets can transcode output or create UTF-16 files; merely setting `$OutputEncoding` does not make all redirection byte-transparent. The sanitizer rejects invalid UTF-8/binary input rather than guessing an encoding. Avoid inserting text cmdlets into a byte-preserving capture pipeline, and preserve stderr and exit statuses deliberately. Do not change platform encoding globally.

POSIX mode-bit and unusual-filename tests are explicitly platform-specific. Windows permission failures are determined by native file-open/read errors, not simulated with POSIX `chmod(0)`. Symlink tests use Windows directory junctions where possible; unavailable file-symlink privileges are reported as capability skips, not successful coverage. The scan's no-symlink, no-environment-file and stable-filesystem requirements apply on every platform.

### Coverage and result boundaries

Sanitization and checking share the same matcher. They recognize configured roots and bounded machine-local home/temp conventions, not every slash-prefixed path. Known private paths become `<PRIVATE_PATH>`; configured mappings take precedence so useful checkout-relative locations survive. Supported forms include POSIX home/temp paths, Windows drive/UNC paths, JSON-escaped backslashes and local `file:` URLs. Quote whitespace-containing path tokens; unquoted tokens end at whitespace or prose delimiters. Ordinary non-file URLs and generic API/container paths are not treated as filesystem paths. Other machine roots must be declared explicitly; unusual escaping, unknown filesystem locations, and sensitive relative suffixes still require manual review. This is **path-only tooling**, not a secret scanner or safe-publication certificate. Review credentials, tokens, customer data, and provider identifiers separately before retention/sharing.

Input must be UTF-8 text with lines no larger than 1 MiB; checked files are limited to 8 MiB each. Streaming handles split UTF-8/path chunks, CRLF and final unterminated lines; invalid encoding, NUL/non-text controls and oversized lines fail rather than emitting raw fragments. Disable producer color/terminal controls using its supported option (for example, `NO_COLOR=1` when honored); ANSI escape sequences are not silently stripped. The checker recursively visits explicit scopes in deterministic order, including hidden entries. It does not follow symlinks (including selected-scope ancestors), open special files, or read `.env*` files/directories. Select the canonical scope path when a system temp-directory alias is itself a symlink. Keep the scope tree stable while scanning; this is not an adversarial filesystem snapshot. Encountering unsupported, excluded or unreadable inputs means incomplete coverage, not clean success. Scope checks to reviewed evidence artifacts, not an arbitrary repository root. Diagnostics identify safe relative scope labels and line numbers, never matched source text or raw absolute scan roots.

| Exit | Meaning                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------- |
| `0`  | Sanitization completed, or the complete selected check scope has no recognized paths.             |
| `1`  | Checker detected recognized local paths.                                                          |
| `2`  | Usage, I/O, encoding, size-limit or incomplete-scan failure; this takes precedence over findings. |

A clean check proves only declared path-recognition coverage. It does not prove producer success, ATP completion, approval, or release readiness. Preserve diagnostic codes, line/column locations, failures, exit codes and source hashes. Source hashes refer to original source bytes; label historical path-redacted diffs as non-byte-exact and not apply-ready. Tests run under `npm run test:agent-governance`; `spec:check` intentionally excludes evidence and is not a privacy checker.

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

`npm run db:reset` is the explicit, destructive preparation command. It requires `database.testDatabase: true` and a connection outside the disposable database. In a single process, it clears validated application-owned Redis state with `clearAllData()`, drops and recreates the managed disposable dev databases, then runs migrations and instance initialization. In both editions, only the default instance (`''`) runs module `seed()` hooks, supplying test/dev convenience fixtures before consuming its creation bookkeeping and marking it ready. Configured isolated targets such as `isolateTest` initialize and become ready without fixture seeding. Each instance completes preparation in sequence.

Reset retains non-after startups and skips all instance and application startups with `after: true`, including schedules, runtime JSON generation, development tips, queue-worker preloading, and HTTP listening. Required data preparation must not depend on after-startups. Normal dev startup retains these runtime tasks; independent framework lifecycle hooks and application teardown still run during reset. See [Backend Startup Guide](/backend/startup-guide#app-startup-and-instance-startup-in-practice).

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
