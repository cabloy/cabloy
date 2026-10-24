# Cabloy Locale Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver modular Japanese and Traditional Chinese resources with explicit language policy, early registration, predictable precedence, and acceptance-backed integration in existing Cabloy Basic consumers. The first implementation slice connects Japanese resources to real backend/frontend consumers; framework helpers alone do not complete it or the parent feature.

## Delivery Principles

- Preserve the accepted boundary in [ADR 0001](./decisions/0001-locale-module-boundaries.md).
- Separate design acceptance, planning checks, bounded execution approval, implementation completion, ATP proof, and release approval.
- Use existing CLI scaffolding and regeneration families. Never patch generated consumers or dependency definitions by hand.
- Keep translation inventory/review separate from framework wiring; both are required for full support.
- Do not add speculative registration APIs, independent sites, persistence, transactions, locks, or environment changes.
- Prefer targeted existing tests and a few critical browser/SSR flows; retain failures and evidence limitations honestly.

## Work Breakdown Structure

### Phase 10: Bounded Planning and Execution Handoff

Dependencies: none.

#### WBS-LOC-10-01: Review the baseline handoff

Traceability mode: planning-baseline-review

Review authority: [ADR 0001](./decisions/0001-locale-module-boundaries.md)

Completion mode: planning-only.

Dependencies: none.

Source areas: this planning directory and the bounded execution dossier prepared through cabloy-spec-execution.

Tasks:

- Review the complete approved baseline and ensure source observations, approved new targets, excluded scope, and unexecuted procedures remain distinct.
- Record the named reviewer's revision-scoped closure disposition and the selected increment's execution boundary.
- Confirm planning audit/chart results and retain documentary proof without creating runtime evidence or reopening settled design without a material new fact.

Acceptance checks:

- A named reviewer records a baseline closure disposition for the exact planning revision and no material design blocker is hidden.
- Explicit execution authorization for the chosen successor is recorded separately; this gate does not grant it.
- Only this documentary task is eligible for planning-complete; generation, ADR acceptance, and tool output alone do not close it.

### Phase 20: Japanese Connected Increment

Dependencies: `WBS-LOC-10-01`.

#### WBS-LOC-20-01: Connect Japanese providers, policy, and real consumers

Traceability: `PRD-LOC-01`, `PRD-LOC-02`, `PRD-LOC-03`, `PRD-LOC-04`, `PRD-LOC-06`, `SRS-LOC-01`, `SRS-LOC-02`, `SRS-LOC-03`, `SRS-LOC-04`, `SRS-LOC-05`, `SRS-LOC-06`, `SRS-LOC-07`, `SRS-LOC-10`, `ATP-LOC-01`, `ATP-LOC-02`, `ATP-LOC-03`.

Dependencies: `WBS-LOC-10-01`.

Source areas: approved new Vona/Zova cabloy-locale suites and locale-jajp modules; both core locale/module runtimes and metadata generators; root locale configuration; a-locale; existing home-base, home-layoutadmin/home-layoutweb, and SSR locale consumers.

Tasks:

- Recheck collisions and scaffold both suites/Japanese modules through existing create:suite/create:module commands; set correct capability declarations and regenerate metadata/dependencies.
- Implement capability-gated envelope registration, absent-target filtering, first-wins scoped precedence, and Zova provider import/install before preload without target eager loading.
- Add Vona root language policy, migrate existing default consumers, and implement subset-capable item typing plus central active-locale normalization on both stacks.
- Apply enabled-item policy consistently to cookie/preference/current assignment/SSR route inputs and menus; preserve explicit lookup semantics and canonical route consistency.
- Make provider metadata generation work with only ja-jp, preserving ordinary target key ownership and Zova source suffix conventions.
- Supply a bounded initial Japanese dictionary for actual home-base/layout consumers and at least one existing locale-bearing lazy target selected from current source. Exercise backend scoped text plus a preload initialization consumer through existing test infrastructure.
- Preserve root defaults/offerings unless a deliberately scoped test/configuration enables Japanese; do not enable it merely by installing the pack.

Acceptance checks:

- ATP-LOC-01, ATP-LOC-02, and ATP-LOC-03 pass for the Japanese slice with retained source revision, fixture/config variant, exact commands, assertions, and results.
- A real existing consumer reads Japanese from its target scope, and installed-but-disabled Japanese cannot become active through supported runtime inputs.
- Generated metadata shows locale capability; no dummy English dictionary, bogus modules message key, target eager import, or hand-edited generated consumer is used.
- Narrow type/generation checks and existing English/Simplified Chinese regression assertions pass.
- This closes a bounded Japanese mechanism slice only, not complete translation coverage, HMR hardening, SSR release proof, or the two-language feature.

### Phase 30: Full Dictionaries and Development Correctness

Dependencies: `WBS-LOC-20-01`.

#### WBS-LOC-30-01: Complete both language packs against the release inventory

Traceability: `PRD-LOC-01`, `PRD-LOC-05`, `SRS-LOC-01`, `SRS-LOC-08`, `ATP-LOC-01`, `ATP-LOC-05`.

Dependencies: `WBS-LOC-20-01`.

Source areas: approved new locale-zhtw modules and both languages' provider dictionaries, authored type exports, existing message owners, and a focused translation coverage check using repository test conventions.

Tasks:

- Create both Traditional Chinese modules through existing CLI families and regenerate discovered metadata.
- Freeze a revision-scoped authored source inventory of module dictionaries plus necessary core errors/language names; exclude dependencies and generated bundles explicitly.
- Complete Japanese and Traditional Chinese dictionaries by target module, preserving source keys, interpolation, plural forms, and formatting tokens.
- Add focused missing/extra-key and placeholder/plural checks; document any intentional non-text or unsupported inventory exclusions instead of silently capping coverage.
- Obtain attributed Japanese and Taiwan Traditional Chinese terminology review. Select reviewer identities at execution/review time, not by invented assignment in this plan.

Acceptance checks:

- ATP-LOC-05 passes for both languages; every inventory omission has an explicit reviewed disposition and no required missing key remains at release.
- ATP-LOC-01 is rerun for single-language provider generation and two-pack discovery, including installed-but-unlisted compatibility.
- Translation inventory results and human review are retained separately from wiring checks; the baseline sizing estimate is not used as a target count.

#### WBS-LOC-30-02: Preserve provider overrides through development reloads

Traceability: `PRD-LOC-06`, `SRS-LOC-11`, `ATP-LOC-06`.

Dependencies: `WBS-LOC-20-01`.

Source areas: Vona core locale snapshot and a-hmr watcher/service; existing Zova reload/Sys lifecycle paths; provider aggregator/helper files.

Tasks:

- Move backend override snapshot after project/provider registration and before ordinary defaults.
- Ensure normal target locale reload retains provider/project values.
- Route provider resource changes to existing full reload/restart behavior; include imported helper changes and removed keys/target contributions in coverage.
- Use existing frontend full reload/reinitialization where necessary, with no generic dynamic registry subsystem.

Acceptance checks:

- ATP-LOC-06 retains actual before/after assertions for target edits, provider value changes, and deletions.
- Reload state matches clean startup precedence, and no stale envelope/global modules key appears.
- Verification uses an authorized test/dev boundary without killing unrelated processes or resetting data.

### Phase 40: Existing Consumer Integration

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

#### WBS-LOC-40-01: Verify validation, schema switching, SSR, and paired artifacts

Traceability: `PRD-LOC-03`, `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-03`, `SRS-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `ATP-LOC-03`, `ATP-LOC-04`, `ATP-LOC-07`.

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

Source areas: existing Vona/Zova home-base validation adapters; existing Admin/Web selectors; locale-aware backend metadata and frontend schema/resource owners; existing Basic SSR hosts and repo-e2e critical flows; root build/dependency scripts.

Tasks:

- Extend current validation mappings for ja-jp/zh-tw and language label keys while preserving optional pack enablement and root default semantics.
- Verify representative backend schema labels/validation and frontend validation for both new locales using existing owners.
- Verify schema-driven language switching reacquires reactive schemas and preserves existing drafts instead of storing stale facades.
- Cover initial SSR/hydration and subsequent language navigation on existing Admin/Web hosts, including disabled route input, concurrent distinct-locale requests, and English/Simplified Chinese regression.
- Build affected Basic Admin/Web SSR and REST pairs before deps:vona. If backend contract truth changes, invoke forward regeneration; do not create new APIs or hand-patch generated output to manufacture proof.

Acceptance checks:

- ATP-LOC-03 is rerun for both complete providers; ATP-LOC-04 and ATP-LOC-07 pass with backend/browser/SSR proof as applicable.
- Typechecks and relevant paired artifact builds succeed; artifact/dependency synchronization is observed rather than assumed.
- Browser text, schema labels, validation messages, active locale, and canonical URL are coherent without hydration warnings or cross-request preference leakage.
- No site/flavor/admission change or persistence modification is smuggled into locale integration.

### Phase 50: Documentation and Release Readiness

Dependencies: `WBS-LOC-40-01`.

#### WBS-LOC-50-01: Close guidance and release-readiness proof

Traceability: `PRD-LOC-06`, `SRS-LOC-12`, `ATP-LOC-08`.

Dependencies: `WBS-LOC-40-01`.

Source areas: repo-docs backend i18n and frontend module/startup/configuration guidance; existing root validation/build scripts; this planning set's progress/evidence references.

Tasks:

- Document pack authoring, cross-module envelopes, enablement/defaults, precedence, fallback, generator behavior, reload behavior, and migration from module defaultLocale.
- Explicitly explain text versus date/number/currency formatting coverage and the absence of automatic language enablement.
- Run docs build/link review and scoped type/regression/build checks; collect the applicable ATP results for the release revision.
- Review translation approvals, evidence sanitization, compatibility/config migration notes, and any approved exclusions. Request release approval separately; do not publish.

Acceptance checks:

- ATP-LOC-08 passes with links to current revision-scoped ATP results and actual docs/build outputs.
- No open required translation/configuration/SSR/validation/reload failure is hidden by a static planning pass.
- Release-readiness completion does not authorize npm publication, deployment, version changes, or a release operation.

## Dependency and Contract-Loop Rules

- Task Dependencies above are exact and authoritative; phase dependencies are not silently accumulated on top of a task override.
- Only a verified predecessor, or an eligible planning-complete documentary predecessor, satisfies its edge. Evidence/approval gates remain separate.
- Source/runtime availability is not a prerequisite to plan approved new targets; collision checks and bounded source creation belong to execution.
- Existing root CLI families create suites/modules and regenerate metadata. Inspect supported flags at execution time; no planning command creates application code automatically.
- No new API is expected. Any backend contract change invokes forward generation from Vona truth. Reverse changes require affected paired Zova SSR/REST builds before deps:vona; stale installed Vona consumers are local dependency drift, not permission to patch links.
- Builds/generation share checkout files even when isolated tests use disposable resources; coordinate overlapping writes. Admin and Web ordinary dev must not run concurrently in one worktree. This plan does not authorize environment overrides or resets.

## Traceability Matrix

| WBS           | Contracts                                                                                      | Acceptance / authority                                                              |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| WBS-LOC-10-01 | Whole-baseline documentary review                                                              | Accepted ADR 0001 and attributable revision-scoped planning closure; no runtime ATP |
| WBS-LOC-20-01 | SRS-LOC-01, SRS-LOC-02, SRS-LOC-03, SRS-LOC-04, SRS-LOC-05, SRS-LOC-06, SRS-LOC-07, SRS-LOC-10 | ATP-LOC-01, ATP-LOC-02, ATP-LOC-03                                                  |
| WBS-LOC-30-01 | SRS-LOC-01, SRS-LOC-08                                                                         | ATP-LOC-01, ATP-LOC-05                                                              |
| WBS-LOC-30-02 | SRS-LOC-11                                                                                     | ATP-LOC-06                                                                          |
| WBS-LOC-40-01 | SRS-LOC-03, SRS-LOC-06, SRS-LOC-09, SRS-LOC-12                                                 | ATP-LOC-03, ATP-LOC-04, ATP-LOC-07                                                  |
| WBS-LOC-50-01 | SRS-LOC-12                                                                                     | ATP-LOC-08                                                                          |

## Completion and Evidence Rules

All six tasks start as not-started. Generated plans, passing audits, accepted design, code presence, and passing helper-only tests cannot establish full feature completion. Maintain exact source revision, environment/configuration/flavor, commands/procedures, fixture ownership, assertions, result, and redacted artifacts for each applicable ATP. WBS-LOC-10-01 alone uses documentary completion mode; other tasks require their actual implementation and acceptance proof. Do not create evidence records until a real approved procedure has run.

## Related Records

- [README](./README.md)
- [PRD](./prd.md)
- [SRS](./srs.md)
- [Test plan](./test-plan.md)
- [Progress](./progress.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
