# Cabloy Locale Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver modular Japanese and Traditional Chinese resources with explicit framework language policy, early registration, predictable precedence, reload correctness and application-owned configuration guidance. The accepted framework/dictionary/reload slices remain supported by their retained proof. Per the user's 2026-10-27 correction, no actual enabled business-application consumer or corresponding runtime integration verification is required for suite delivery.

## Delivery Principles

- Preserve the accepted boundary in [ADR 0001](./decisions/0001-locale-module-boundaries.md), with the narrowly superseding provider export/generation decision in [ADR 0002](./decisions/0002-locale-provider-resource-export.md).
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
- Author the Japanese `src/locales` language map and `localesProvider` module entrypoint export outside ordinary locale generation. Verify that normal metadata regeneration preserves those exports and capability metadata, creates no provider-owned English-base locale key/helper surface, and preserves ordinary target key ownership and Zova source suffix conventions.
- Supply a bounded initial Japanese dictionary for actual home-base/layout consumers and at least one existing locale-bearing lazy target selected from current source. Exercise backend scoped text plus a preload initialization consumer through existing test infrastructure.
- Preserve root defaults/offerings unless a deliberately scoped test/configuration enables Japanese; do not enable it merely by installing the pack.

Acceptance checks:

- ATP-LOC-01, ATP-LOC-02, and ATP-LOC-03 pass for the Japanese slice with retained source revision, fixture/config variant, exact commands, assertions, and results.
- A real existing consumer reads Japanese from its target scope, and installed-but-disabled Japanese cannot become active through supported runtime inputs.
- Generated module metadata shows locale capability; authored `localesProvider` exports remain intact after normal regeneration, and provider scope has no ordinary English-base locale key/helper inference. No dummy English dictionary, bogus modules message key, target eager import, or hand-edited generated consumer is used.
- Narrow type/generation checks and existing English/Simplified Chinese regression assertions pass.
- This closes a bounded Japanese mechanism slice only, not complete translation coverage, HMR hardening, SSR release proof, or the two-language feature.

Current-revision reconciliation: the historical phase-20 closure covered a different dirty source snapshot. Under accepted ADR 0002, re-establish the applicable ATP-LOC-01/02/03 results at the current implementation using the relocated locale-test modules and the authored export-preservation contract. Retain current redacted primary results durably and reconcile the existing evidence index before successors use this dependency. This is a bounded proof refresh within WBS-LOC-20-01, not a new baseline review or permission to execute adjacent tasks.

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

### Phase 40: Former Consumer Integration Scope — Not Required

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

#### WBS-LOC-40-01: Retain the disposition of former application integration verification

Traceability: `PRD-LOC-03`, `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-03`, `SRS-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `ATP-LOC-03`, `ATP-LOC-04`, `ATP-LOC-07`.

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

Source areas: historical phase-40 records and the public I18n Guide. Basic's Vona/Zova home-base adapters and ordinary policy remain unchanged; additional vendor validation registration belongs to application owners.

Tasks:

- This former runtime integration increment is outside the revised delivery scope following the user's explicit 2026-10-27 correction. It requires no implementation, consumer discovery/configuration or verification run.
- Retain historical results and stable identifiers for attribution. Do not restore the rejected test-only locale-policy switch, integration matrix or Basic ja/zhTW registrations.
- Retain application-owned configuration guidance without creating an application, Site, flavor, route, API or environment override.

Acceptance checks:

- No current pass is claimed for the excluded application validation, schema/draft switching, SSR, hydration, navigation or concurrent-request procedures. ATP-LOC-04 is not required; ATP-LOC-07 now covers configuration guidance only. ATP-LOC-03 keeps its existing framework policy proof without an application-integration rerun.
- Record this task as `deferred` (out of current scope, not verified), with no scheduled resumption or runtime prerequisite for suite delivery. This is a scope removal, not a temporary evidence waiver.
- WBS-LOC-50-01 does not depend on this task. Retained dictionary/mechanism/reload proof and public guidance, not an enabled consumer, govern current readiness.

### Phase 50: Documentation and Release Readiness

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

#### WBS-LOC-50-01: Close guidance and release-readiness proof

Traceability: `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `ATP-LOC-07`, `ATP-LOC-08`.

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

Source areas: repo-docs backend i18n and frontend module/startup/configuration guidance; existing root validation/build scripts; this planning set's progress/evidence references.

Tasks:

- Document pack authoring, cross-module envelopes, enablement/defaults, precedence, fallback, generator behavior, reload behavior, and migration from module defaultLocale.
- Explicitly explain text versus date/number/currency formatting coverage and the absence of automatic language enablement.
- Reuse retained docs/build/link and framework/dictionary/reload proof within its recorded source scope; reconcile the current guidance and scope disposition under ATP-LOC-07/08. No consumer integration tests, extra runtime checks or builds solely for the removed validation are required.
- Review translation approvals, evidence sanitization, compatibility/config migration notes and the explicitly removed application-integration scope. Scope removal is not a passed test or automatic readiness closure. Request release approval separately; do not publish.

Acceptance checks:

- ATP-LOC-08 passes with links to current revision-scoped ATP results and actual docs/build outputs.
- No open in-scope dictionary, framework policy, reload or guidance issue is hidden by a static planning pass. Excluded application-consumer verification does not block readiness and is not claimed as passed.
- Release-readiness completion does not authorize npm publication, deployment, version changes, or a release operation.

## Dependency and Contract-Loop Rules

- Task Dependencies above are exact and authoritative; phase dependencies are not silently accumulated on top of a task override.
- Only a verified predecessor, or an eligible planning-complete documentary predecessor, satisfies its edge. Evidence/approval gates remain separate.
- Source/runtime availability is not a prerequisite to plan approved new targets; collision checks and bounded source creation belong to execution.
- Existing root CLI families create suites/modules and regenerate metadata. Inspect supported flags at execution time; no planning command creates application code automatically.
- No new API is expected. Any backend contract change invokes forward generation from Vona truth. Reverse changes require affected paired Zova SSR/REST builds before deps:vona; stale installed Vona consumers are local dependency drift, not permission to patch links.
- Builds/generation share checkout files even when isolated tests use disposable resources; coordinate overlapping writes. Admin and Web ordinary dev must not run concurrently in one worktree. This plan does not authorize environment overrides or resets.

## Traceability Matrix

WBS-LOC-40-01 and ATP-LOC-04 associations remain historical only; they do not require execution or block current delivery. ATP-LOC-07 is now a guidance check under WBS-LOC-50-01.

| WBS           | Contracts                                                                                      | Acceptance / authority                                                              |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| WBS-LOC-10-01 | Whole-baseline documentary review                                                              | Accepted ADR 0001 and attributable revision-scoped planning closure; no runtime ATP |
| WBS-LOC-20-01 | SRS-LOC-01, SRS-LOC-02, SRS-LOC-03, SRS-LOC-04, SRS-LOC-05, SRS-LOC-06, SRS-LOC-07, SRS-LOC-10 | ATP-LOC-01, ATP-LOC-02, ATP-LOC-03                                                  |
| WBS-LOC-30-01 | SRS-LOC-01, SRS-LOC-08                                                                         | ATP-LOC-01, ATP-LOC-05                                                              |
| WBS-LOC-30-02 | SRS-LOC-11                                                                                     | ATP-LOC-06                                                                          |
| WBS-LOC-40-01 | SRS-LOC-03, SRS-LOC-06, SRS-LOC-09, SRS-LOC-12                                                 | ATP-LOC-03, ATP-LOC-04, ATP-LOC-07                                                  |
| WBS-LOC-50-01 | SRS-LOC-09, SRS-LOC-12                                                                         | ATP-LOC-07, ATP-LOC-08                                                              |

## Completion and Evidence Rules

All six tasks start as not-started. Generated plans, passing audits, accepted design, code presence, and passing helper-only tests cannot establish full feature completion. Maintain exact source revision, environment/configuration/flavor, commands/procedures, fixture ownership, assertions, result, and redacted artifacts for each applicable ATP. WBS-LOC-10-01 alone uses documentary completion mode; other tasks require their actual implementation and acceptance proof. Do not create evidence records until a real approved procedure has run.

## Related Records

- [README](./README.md)
- [PRD](./prd.md)
- [SRS](./srs.md)
- [Test plan](./test-plan.md)
- [Progress](./progress.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
