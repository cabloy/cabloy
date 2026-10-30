# Cabloy Locale Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver modular Japanese and Traditional Chinese resources with explicit framework language policy, early registration, predictable precedence, reload correctness and application-owned configuration guidance. The user's latest 2026-10-30 correction retains frontend and backend language configuration and Zod validation mappings, but removes actual business-consumer delivery and its page/schema/draft/SSR acceptance. Accepted dictionary/framework/reload and guidance proof retains its recorded scope; it does not prove the pending bilateral configuration/mapping delivery.

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

### Phase 40: Application Language Configuration and Validation

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

#### WBS-LOC-40-01: Configure frontend and backend languages and Zod mappings

Traceability: `PRD-LOC-03`, `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-03`, `SRS-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `ATP-LOC-03`, `ATP-LOC-04`, `ATP-LOC-07`.

`ATP-LOC-04` is retained as historical traceability only; it is not required current scope, not a dependency and not a current pass.

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`.

Source areas: paired application root language configuration and application initialization through the existing Vona/Zova validation adapters, public I18n guidance and existing focused locale/validation tests. Concrete configuration and registration paths and activation scope must be named in the bounded execution dossier; no business page, API or shared-host selection is required.

Tasks:

- Apply the latest 2026-10-30 correction: deliver frontend and backend language configuration and Zod mappings without an actual business consumer. Before source execution, settle only the application-owned configuration/registration placement and activation scope that preserve Basic's existing baseline. This finite gate does not authorize a new Commerce profile, Site/flavor, runner expansion or replacement locale engine.
- Enable ja-jp and zh-tw through normal paired root policy, retaining en-us/zh-cn and aligned default en-us. Because `locale.items` replaces earlier items, declare the complete intended four-language set. Do not infer enablement from provider installation.
- Register the complete en/zhCN/ja/zhTW vendor map through existing application adapters after baseline registration: backend uses `app.config.locale.default`; frontend uses its root default inside `process.env.CLIENT`. Registration replaces the previous map and occurs at startup, never per request. Preserve Basic home-base mappings and keep provider modules data-only.
- Run proportional ATP-LOC-03 effective-policy assertions and ATP-LOC-07 actual mapping checks through existing supported adapters/test infrastructure. Retain applicable original-language and separate-context regressions. No business submission, page adaptation, schema/draft flow or SSR/browser matrix is required; ATP-LOC-04 is outside current scope, not passed.
- Reuse accepted framework/dictionary/reload/guidance proof within its recorded source scope and preserve historical failures. Source changes and meaningful runtime verification require a separately approved bounded dossier; prepare affected paired artifacts only if that actual implementation needs them.

Acceptance checks:

- Concrete frontend/backend configuration and registration owners, activation scope and source revision are attributable; both new languages and the full four-entry vendor map are effective without changing Basic defaults/home-base registrations.
- ATP-LOC-03 confirms the paired enabled set/default and replacement semantics; ATP-LOC-07 verifies actual Zod validation messages for both new languages on both stacks through existing adapters, retaining original-language controls and scoped-locale behavior. Keep exact commands, configuration, assertions, cleanup and sanitized results.
- No actual business consumer, Commerce flavor/profile, test-runner extension or business-page/schema/draft/SSR acceptance is a prerequisite. Guidance alone or historical removed-test results do not prove the retained configuration/mapping delivery.
- WBS-LOC-40-01 remains active and `not-started` until approved execution begins. WBS-LOC-50-01 depends on its verified configuration/mapping result, not a consumer result.

### Phase 50: Documentation and Release Readiness

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`, `WBS-LOC-40-01`.

#### WBS-LOC-50-01: Close guidance and release-readiness proof

Traceability: `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `ATP-LOC-07`, `ATP-LOC-08`.

Dependencies: `WBS-LOC-30-01`, `WBS-LOC-30-02`, `WBS-LOC-40-01`.

Source areas: repo-docs backend i18n and frontend module/startup/configuration guidance; existing root validation/build scripts; this planning set's progress/evidence references.

Tasks:

- Document pack authoring, cross-module envelopes, enablement/defaults, precedence, fallback, generator behavior, reload behavior, and migration from module defaultLocale.
- Explicitly explain text versus date/number/currency formatting coverage and the absence of automatic language enablement.
- Reuse retained docs/build/link and framework/dictionary/reload proof within its recorded source scope; reconcile guidance with the bilateral configuration/mapping ATP-LOC-03/07 results under ATP-LOC-08. Build/sync only artifacts actually affected by approved implementation, not an invented consumer flow.
- Review translation approvals, evidence sanitization, compatibility/config migration notes and the latest configuration/mapping scope. Earlier readiness conclusions remain historical for their own scope. Request release approval separately; do not publish.

Acceptance checks:

- ATP-LOC-08 passes with links to current revision-scoped ATP results and actual docs/build outputs.
- No open dictionary, framework policy, reload, guidance or bilateral configuration/mapping gate is hidden by a static planning pass. WBS-LOC-40-01 must be verified for that retained scope; no business-consumer or ATP-LOC-04 prerequisite remains. Prior guidance-only readiness and removed tests do not establish current configuration/mapping proof.
- Release-readiness completion does not authorize npm publication, deployment, version changes, or a release operation.

## Dependency and Contract-Loop Rules

- Task Dependencies above are exact and authoritative; phase dependencies are not silently accumulated on top of a task override.
- Only a verified predecessor, or an eligible planning-complete documentary predecessor, satisfies its edge. Evidence/approval gates remain separate.
- Source/runtime availability is not a prerequisite to plan approved new targets; collision checks and bounded source creation belong to execution.
- Existing root CLI families create suites/modules and regenerate metadata. Inspect supported flags at execution time; no planning command creates application code automatically.
- No new API is expected. Any backend contract change invokes forward generation from Vona truth. Reverse changes require affected paired Zova SSR/REST builds before deps:vona; stale installed Vona consumers are local dependency drift, not permission to patch links.
- Builds/generation share checkout files even when isolated tests use disposable resources; coordinate overlapping writes. Admin and Web ordinary dev must not run concurrently in one worktree. This plan does not authorize environment overrides or resets.

## Traceability Matrix

WBS-LOC-40-01 remains active for bilateral language configuration/Zod mappings. ATP-LOC-04 retains its stable historical ID but is not required current scope. ATP-LOC-07 covers guidance and effective mapping checks, not business schema/draft acceptance; WBS-LOC-50-01 reconciles the applicable proof after Phase 40 closes.

| WBS           | Contracts                                                                                      | Acceptance / authority                                                              |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| WBS-LOC-10-01 | Whole-baseline documentary review                                                              | Accepted ADR 0001 and attributable revision-scoped planning closure; no runtime ATP |
| WBS-LOC-20-01 | SRS-LOC-01, SRS-LOC-02, SRS-LOC-03, SRS-LOC-04, SRS-LOC-05, SRS-LOC-06, SRS-LOC-07, SRS-LOC-10 | ATP-LOC-01, ATP-LOC-02, ATP-LOC-03                                                  |
| WBS-LOC-30-01 | SRS-LOC-01, SRS-LOC-08                                                                         | ATP-LOC-01, ATP-LOC-05                                                              |
| WBS-LOC-30-02 | SRS-LOC-11                                                                                     | ATP-LOC-06                                                                          |
| WBS-LOC-40-01 | SRS-LOC-03, SRS-LOC-06, SRS-LOC-09, SRS-LOC-12                                                 | ATP-LOC-03, ATP-LOC-07                                                              |
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
