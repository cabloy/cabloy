# Cabloy Locale Test Strategy and Acceptance Plan

## Purpose and Authority

This document defines executable acceptance and minimum proof for the [SRS](./srs.md), linked to the [PRD](./prd.md) and [WBS](./pdp-wbs.md). Procedure definitions are not execution results. Historical Japanese-slice results are retained in the [phase-20 index](./evidence/phase-20/index.md); the separately approved [current proof refresh](./evidence/phase-20/current-proof.md) re-establishes the bounded Japanese slice after the resource-contract change accepted in [ADR 0002](./decisions/0002-locale-provider-resource-export.md). Creating or updating this file, accepting an ADR, running spec audits, or generating charts executes none of these scenarios.

## Scope, Quality Priorities, and Risk

Priorities are correct registration/precedence, framework language-policy isolation from installed packs, startup/lazy correctness, single-language metadata generation, reviewed dictionary coverage, development reload correctness and bilateral application-owned language configuration/Zod mappings. The user's latest 2026-10-30 correction removes the actual business-consumer requirement and its page/schema/draft/SSR/browser acceptance. Retain proportional effective-policy and actual adapter-validation proof; do not replace it with guidance-only closure. Basic's English/Simplified Chinese policy and home-base adapters remain unchanged. No new business authorization, database lifecycle, concurrency control, external provider flow, Commerce profile or runner expansion is introduced.

## Verification Model

| Level                | Purpose                                                                                                                 | Limit                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Narrow               | Focused existing unit/runtime/generator tests and typechecks for the selected increment.                                | Does not prove browser, complete vocabulary, SSR, or release closure.                                                  |
| Contract/integration | Real scoped text, configured selection, emitted locale metadata, validation, and actual loader interactions.            | Source inspection or mocked imports alone do not prove integration.                                                    |
| Full closure         | Both reviewed inventories, retained framework/reload/guidance proof and bilateral configuration/Zod mapping acceptance. | No business-consumer prerequisite or publication authorization; guidance alone does not prove actual mapping behavior. |

## Test Levels and Ownership Locations

Reuse existing infrastructure, with focused regressions rather than a bespoke source-evaluation harness:

- Existing [backend locale tests](../../vona/src/suite-vendor/a-test/modules/test-vona/test/locale.test.ts) retain original-language lookup regressions. Current [locale-test provider tests](../../vona/src/suite/cabloy-locale/modules/locale-test/test/provider.test.ts), [registry tests](../../vona/src/suite/cabloy-locale/modules/locale-test/test/locales.test.ts), and [policy tests](../../vona/src/suite/cabloy-locale/modules/locale-test/test/localePolicy.test.ts) own the relocated Japanese/policy assertions.
- Verify provider export preservation under ADR 0002 through the supported metadata CLI and resulting exports/scopes. The two dedicated `localeMetadata.test.ts` files added during the proof refresh were subsequently removed at the user's request as unnecessary; their recorded executions remain historical evidence, not retained regression tests. Existing [frontend source import tests](../../zova/packages-cli/cli-set-front/test/sourceImports.test.ts) and [entry generation tests](../../zova/packages-utils/zova-vite/test/generateEntryFiles.test.ts) are supporting checks, not substitutes for provider assertions.
- Current [frontend locale runtime tests](../../zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts) exercise SysModule/SysLocale early/lazy installation and policy fixtures; module-glob conventions support metadata discovery.
- The independent [locale E2E suite](../../repo-e2e/specs/cabloy-locale.spec.ts) and [Basic E2E](../../repo-e2e/specs/cabloy-basic.spec.ts) remain existing application regressions, not required new business-consumer proof for this scope. Prefer existing locale/validation tests for the retained configuration/mapping checks; do not reinstate the removed switch or exhaustive former matrix.
- The existing [inventory/placeholder checker](../../vona/src/suite/cabloy-locale/modules/locale-test/test/coverage.test.ts) owns deterministic dictionary coverage; its accepted results are separate from configuration/mapping proof.

## Fixtures, Cleanup, Privacy, and Data Minimization

Use synthetic translation markers with distinct project/provider/target values, a known existing preload consumer, and a known existing lazy target. Select actual consumer names from active source before writing tests. Cover no provider, either provider, and both providers through focused isolated configuration/metadata fixtures rather than repeatedly installing/uninstalling workspace packages or overwriting shared project settings.

Backend tests using scoped Vona state own app.bean.executor.mockCtx boundaries; intentionally competing requests each have separate contexts. Do not mutate process-global origin/proxy configuration or global library locale state to simulate requests. Prefer explicit fixtures and existing per-app/request paths. Any test-owned persisted account/resource is precisely cleaned in finally in reverse dependency order. Shared durable fixtures are read-only; no repeated seeding or reset follows from this plan.

Use managed root test/E2E isolation for runtime procedures. Existing ordinary dev alone is not a blocker, but builds/dependency writes and custom resources still require coordination. No process killing, environment identity changes, or database reset is authorized. Admin/Web browser runs may be sequential through isolated tests or their existing integrated SSR hosts; do not run conflicting ordinary dev commands concurrently in this worktree.

## Evidence Record

After approved execution, retain scenario/task/contract links, exact source revision and relevant diff hashes, config/pack variants, environment and flavor/Site, exact command/procedure, owned fixtures and cleanup, assertions, exit code, observed result, and durable redacted artifacts. Record translation reviewer identity/disposition and reviewed dictionary revision separately from automated parity output. A temporary waiver requires owner, reason, expiry, and compensating control; required two-language coverage is not silently waived.

Before durable retention, sanitize machine-local paths with the existing evidence tools and manually inspect remaining sensitive material. Keep repository-relative paths, failure details, exit codes, and original source hashes. Path checking is not secret scanning, producer success, or acceptance proof. New proof must have a durable, nonignored artifact or explicitly identified durable CI location; a checkout-local ignored log alone does not meet retention. Preserve existing historical logs without silently deleting or replacing them. No evidence ID or empty evidence directory exists at baseline creation.

## Acceptance Scenario Catalogue

### ATP-LOC-01: Discover, generate, and consume providers before preload

Setup:

- Use actual Japanese provider modules and representative home-base/layout consumers; identify an existing locale-bearing lazy module and a preload initialization consumer from active metadata.
- Include provider-only ja-jp and zh-tw fixtures with authored `src/locales` maps and `localesProvider` entrypoint exports, without en-us or ordinary `src/config/locale` files; retain ordinary module English-base generation fixtures. These zh-tw fixtures do not constitute delivered Traditional Chinese modules.

Procedure:

- Regenerate module metadata with the supported CLI; inspect capability flags, confirm authored provider maps and entrypoint exports survive unchanged, and typecheck the resulting exports/scopes. Assert provider scope has no ordinary English-base locale key/helper inference or generated ordinary locale resource; ordinary target inference remains intact. Provider dictionaries are not discovered by the ordinary locale generator.
- Start the Zova loader through existing runtime test infrastructure and assert translation availability inside the preload consumer's initialization boundary.
- Observe the lazy target remains uninstalled until use, then load it and read the same contributed key again.
- In Vona, read scoped text at moduleLoaded or a later supported context; verify ordinary moduleLoading lifecycle order remains unchanged.
- After Traditional Chinese creation, rerun discovery/generation with each pack alone and both together.

Expected result:

- Correct capability metadata and preserved, valid single-language `localesProvider` exports, with no generated provider-owned English-base scope/helper surface. No dummy base dictionary, bogus modules key, target eager import, or duplicated provider installation.
- Preload receives provider text, lazy targets remain lazy, and later target defaults do not overwrite provider values.
- Vona supported consumers obtain text without a new preload subsystem or false moduleLoading guarantee.

Minimum proof:

- Generated capability/scope excerpt, authored export-preservation and ordinary-module regression assertions, typecheck result, initialization/lazy-state assertions, actual scoped text results, revision and pack/config variants, exact procedure, and durable redacted logs.

Traceability: `PRD-LOC-01`, `PRD-LOC-03`, `PRD-LOC-06`, `SRS-LOC-01`, `SRS-LOC-03`, `SRS-LOC-04`, `SRS-LOC-10`, `WBS-LOC-20-01`, `WBS-LOC-30-01`.

### ATP-LOC-02: Preserve scoped precedence, absent targets, and fallback

Setup:

- Distinct project/provider/ordinary values for the same target/locale/key, two targets sharing a key, an absent metadata target, a global-only key, and a genuinely unknown key.

Procedure:

- Register through real project/provider/ordinary paths in documented order and query target-qualified, scoped, and global text.
- Reload the lazy target's own dictionary through normal installation and repeat the assertions.
- Query a missing current-language key with an English value and an unknown key with no value.
- Verify provider contributions for absent targets are skipped while existing project override semantics remain unchanged.

Expected result:

- Project target override beats provider, which beats target defaults; target dictionaries remain distinct despite global first-wins collision behavior.
- Lookup follows current scoped/global then English scoped/global then raw key; no automatic zh-cn fallback for zh-tw.
- No target import/dependency, literal modules text entry, or disabled-target global pollution.

Minimum proof:

- Fixture dictionaries and active metadata membership, exact registration/lookup assertions on both stacks, source revision, commands, and retained results.

Traceability: `PRD-LOC-01`, `PRD-LOC-04`, `SRS-LOC-02`, `SRS-LOC-07`, `WBS-LOC-20-01`.

### ATP-LOC-03: Make configured items and default authoritative

Applicability: retain existing framework/policy and original-language proof within its recorded source scope. The latest 2026-10-30 correction adds only proportional effective frontend/backend configuration assertions: complete enabled set, aligned default and replacement semantics. No actual business consumer, new menu/route/browser flow or test-only switch is required.

Setup:

- Isolated app/config fixtures for: both packs installed with only en-us/zh-cn enabled; ja-jp enabled/default with and without its pack; both new languages enabled; invalid empty items or default outside items.
- Synthetic query/header/cookie/preference/current-assignment and locale-route inputs, including canonicalizable casing/underscores, aliases to disabled targets, and unknown values.

Procedure:

- Resolve backend request/current language and frontend active language using supported entry paths; assert installed-resource changes do not change policy.
- Exercise no explicit selection, disabled/stale saved values, direct setters, request negotiation, SSR route selection, and navigation restoration.
- Inspect Admin/Web menus including route-specific subsets. Compare route URL, active locale, SSR text, and hydrated client behavior for disabled matched route input.
- Initialize invalid policy and capture its explicit error. These framework/menu/route procedures retain their recorded proof scope; current WBS-LOC-40-01 adds only effective paired configuration/default/replacement assertions through normal initialization. Installed dictionaries or example snippets alone do not prove the configured result.

Expected result:

- Enabled own-item keys only determine current-language availability; default is the sole validated configured default, not dictionary availability or old module defaultLocale.
- Disabled values resolve to the default through supported selection paths, with canonical URLs consistent with existing router policy; menu overrides cannot expand the enabled set.
- Enabled language without a provider remains selectable and falls back; explicit low-level lookup remains independent.
- Invalid policy fails visibly without enabling an installed pack or mutating shared settings.

Minimum proof:

- Config/installed-pack variants, entry-path assertions and responses, invalid-policy error, menu/route assertions, paired backend/frontend results, revision, and exact commands/procedures.

Traceability: `PRD-LOC-02`, `SRS-LOC-05`, `SRS-LOC-06`, `WBS-LOC-20-01`, `WBS-LOC-40-01`.

### ATP-LOC-04: Historical SSR, hydration, and navigation acceptance

Applicability: **not required current scope** after the latest 2026-10-30 correction removing the actual business consumer. This stable ID and the prior procedures/results remain for attribution only, not as a current pass, waiver, WBS dependency or required resumption. Ordinary SSR/hydration/request-isolation safety remains a framework constraint, not a mandatory business-flow acceptance campaign for configuration/mappings.

Setup:

- Historical execution used existing Basic Web/Admin Sites with an explicitly enabled policy, paired SSR/REST artifacts and synthetic admitted fixtures. The test-only policy switch and added scenarios were subsequently removed; do not recreate them to execute this excluded scenario.

Procedure:

- The historical procedure compared server HTML and hydration-time client output, language navigation/canonical routes, distinct-locale concurrent requests and original-language controls. Retain those actual artifacts under their original source/configuration attribution; do not rerun them automatically or infer current results from their existence.

Expected result:

- Current scope records clearly distinguish retained historical SSR results from bilateral configuration/mapping proof. No business page, draft adaptation, Site/flavor, browser matrix or current ATP-LOC-04 pass is required or claimed.

Minimum proof:

- Preserve historical revision, commands, config/Site/flavor, assertions, diagnostics and redacted artifacts in the existing phase-40 record. The latest user correction supplies scope authority, not runtime acceptance.

Traceability: historical association only — `PRD-LOC-03`, `PRD-LOC-06`, `SRS-LOC-03`, `SRS-LOC-06`, `SRS-LOC-12`, `WBS-LOC-40-01`.

### ATP-LOC-05: Close inventory, placeholder, and terminology coverage

Setup:

- Revision-scoped authored English module dictionaries and core error/status inventory, excluding dependencies/generated bundles; complete Japanese and Traditional Chinese providers.

Procedure:

- Run the focused inventory check added during implementation; compare required target keys, missing/extra entries, interpolation placeholders, plural variants, and format tokens for each language.
- Check helper files do not become discovered locale IDs and optional targets do not become hard dependencies.
- Have attributed reviewers examine Japanese and Taiwan Traditional Chinese terminology/context, especially validation, navigation, error text, and schema labels.
- Retain exclusions and dispositions, then rerun automated checks after corrections.

Expected result:

- Both languages cover the required release inventory with intact placeholders/plural conventions and no unresolved required omission.
- Human language review is attributable and revision scoped; automatic conversion or raw key-count estimates do not substitute for review.

Minimum proof:

- Inventory revision/hash, exact checker command/output, missing/extra/placeholder reports, explicit exclusion reasons, reviewer identity/disposition and reviewed revision, result, and artifact links.

Traceability: `PRD-LOC-01`, `PRD-LOC-05`, `SRS-LOC-01`, `SRS-LOC-08`, `WBS-LOC-30-01`.

### ATP-LOC-06: Match reload behavior to clean registration

Setup:

- Authorized development/test runtime with known project/provider/target collisions; provider aggregator imports per-target helpers.

Procedure:

- Edit a normal target locale file and assert provider/project overrides survive.
- Change a provider value through both aggregator and imported helper paths, then remove a key and a target contribution.
- Observe the existing complete reload/restart mechanism and compare resulting scoped/global lookup with a clean start of the same revision.
- Revert only test-owned edits and shut down only test-owned processes in finally.

Expected result:

- HMR baseline includes provider overrides, helper changes are observed, and removed contributions leave no stale values.
- Reloaded results match clean-start precedence without a generic registry rebuild subsystem or unrelated process/data manipulation.

Minimum proof:

- Exact owned edit sequence/diffs, watcher/reload observations, before/after/clean-start assertions, cleanup outcome, revision, environment, and redacted logs.

Traceability: `PRD-LOC-06`, `SRS-LOC-11`, `WBS-LOC-30-02`.

### ATP-LOC-07: Verify frontend and backend language configuration and Zod mappings

Applicability: the latest 2026-10-30 correction retains bilateral configuration/mapping delivery and proportional verification, not actual business-consumer acceptance. Retained guidance proof remains applicable to guidance only; neither it nor removed-test results establish the pending source/runtime mapping result.

Setup:

- Concrete paired application configuration/initialization owners and activation scope from the bounded WBS-LOC-40-01 dossier, preserving Basic policy/home-base mappings. No business page, host, API, schema/draft flow, Commerce profile or new flavor is required.
- Complete root `locale.items` and vendor maps retaining en-us/en, zh-cn/zhCN, ja-jp/ja and zh-tw/zhTW, default en-us. Use existing Vona/Zova adapters and focused locale/validation test infrastructure, not a bespoke source-evaluation harness or test-only enablement switch.

Procedure:

- Review guidance/source distinction between installed dictionaries, enabled policy and vendor registration; assert effective paired policy/default under ATP-LOC-03. Both `locale.items` and `setLocaleErrors` replace prior maps, so verify all four entries survive application initialization.
- Verify backend registration uses `app.config.locale.default`, and frontend registration uses its current root default only inside `process.env.CLIENT`. Register at startup after baseline initialization, not per request or through provider dictionaries.
- Through the actual existing adapter, validate representative synthetic invalid input in ja-jp and zh-tw on both stacks and assert installed-Zod messages, not manually constructed translated errors. Retain en-us/zh-cn controls and configured-default fallback. Use separate backend mockCtx/request contexts for scoped-locale assertions without request-time global Zod reconfiguration.
- Use the smallest supported existing tests that prove the configuration and adapter behavior. No business submission, browser form, schema label/draft preservation, SSR/hydration/navigation or exhaustive matrix is required. Prepare paired artifacts only if the approved source change actually needs them; never patch generated consumers.

Expected result:

- Both stacks expose the intended complete language policy and validation mappings with aligned default; Basic's original policy/home-base registrations remain unchanged and provider installation remains independent.
- Both new languages produce the expected actual Zod errors through the existing adapters, original-language controls remain valid, and current scoped locale is respected without global per-request mutation. No business-consumer result is claimed or required.

Minimum proof:

- Concrete configuration/registration paths and activation scope, revision/dirty attribution, effective policy/map/default assertions, exact supported commands and actual adapter-validation results on both stacks, original-language/default controls, separate-context observations and owned cleanup. Retain sanitized outputs and applicable guidance proof separately; static checks alone cannot close runtime mapping acceptance.

Traceability: `PRD-LOC-03`, `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `WBS-LOC-40-01`, `WBS-LOC-50-01`.

### ATP-LOC-08: Verify guidance and release-readiness boundaries

Setup:

- Implementation candidate revision, actual applicable scenario evidence, translation review, updated public docs, and synchronized affected artifacts.

Procedure:

- Review retained public docs build/link/command proof and its applicability. This specification correction runs no runtime verification or public-docs build. Reuse unaffected documentation proof only within its actual source scope; subsequent approved configuration/mapping execution supplies proportional verification and any actually affected build/sync proof.
- Reconcile retained revision-scoped framework/dictionary/reload/guidance results with bilateral configuration/mapping ATP-LOC-03/07 results. WBS-LOC-40-01 must be verified for that scope. ATP-LOC-04 and business-consumer proof are not prerequisites; earlier guidance-only readiness does not establish the retained actual mappings.
- Review language policy migration notes, formatting exclusions, generated-file handling, evidence sanitization, release blockers, and separate publication authorization.

Expected result:

- Guidance accurately distinguishes resources/enablement/default/fallback and old backend configuration migration.
- Retained accepted proof and pending bilateral configuration/mapping acceptance are distinguished. No unresolved required configuration/mapping gap remains at readiness closure; no business-consumer gate remains and no old removed-test result is presented as a current pass. Publishing, deployment, reset, environment changes and ATP passes never follow from planning tools.

Minimum proof:

- Docs/type/build outputs with exit codes and revisions, link/command review, applicable scenario evidence index, translation-review references, sanitized artifact check and manual redaction disposition, and explicit release-readiness result. Publication approval remains separate.

Traceability: `PRD-LOC-06`, `SRS-LOC-12`, `WBS-LOC-50-01`.

## Contract, SSR, Browser, and Integration Procedures

Backend truth remains authoritative for localized schema metadata. If an implementation change affects a DTO/OpenAPI contract, inspect emitted output and use the contract-loop specialist for forward generation. Text-only changes do not require invented schema/endpoint changes. Frontend artifacts require affected SSR and REST pairs before Vona dependency synchronization. For Vona integrated SSR isolated E2E, retain runtime API-origin handoff; do not rebuild or edit API_BASE_URL merely to match an isolated test listener.

No single screenshot, source grep, generated file, or helper test substitutes for the assertions in a scenario. Runtime validation beyond the selected approved increment is deferred, not implicitly authorized.

### Current acceptance boundary after the latest 2026-10-30 correction

The user explicitly clarified: “前端和后端均进行‘语言配置和zod验证映射’，不需要再进行‘业务消费者’了”. This supersedes the same-date consumer restoration and Commerce dossier recommendation. It retains actual bilateral configuration/mapping delivery, not merely guidance or complete Phase-40 deferral. Earlier scope changes and closures retain their historical attribution.

ATP-LOC-03 retains accepted framework policy proof and adds proportional effective configuration assertions. ATP-LOC-07 retains guidance proof and requires actual frontend/backend Zod mapping checks through supported existing adapters/tests. ATP-LOC-04 is not required current scope and is not reported passed. Business pages, schema/draft adaptation, SSR/hydration/navigation campaigns, a Commerce backend profile and test-runner expansion are not prerequisites. Do not restore test-only policy plumbing or alter Basic home-base mappings.

WBS-LOC-40-01 remains active and `not-started`; only concrete application-owned configuration/registration placement and activation scope, followed by bounded execution approval, remain its finite execution gate. Basic defaults stay unchanged absent explicit changed authority. WBS-LOC-50-01 is `blocked` on verified configuration/mapping proof, not consumer proof. This specification correction authorizes no runtime test, build, source implementation, dependency operation, environment edit, reset or publication.

## Commands

### Planning-only checks authorized for this generation

```sh
npm run spec:check -- cabloy-locale
npm run spec:charts -- cabloy-locale
npm run spec:charts:check -- cabloy-locale
```

### Observed implementation entrypoints, not executed by generation

```sh
npm run vona :create:suite cabloy-locale
npm run vona :create:module locale-jajp -- --suite=cabloy-locale
npm run vona :create:module locale-zhtw -- --suite=cabloy-locale
npm run zova :create:suite cabloy-locale
npm run zova :create:module locale-jajp -- --suite=cabloy-locale
npm run zova :create:module locale-zhtw -- --suite=cabloy-locale
npm run tsc:vona
npm run tsc:zova
npm run build:zova:admin
npm run build:zova:web
npm run deps:vona
npm run docs:build
```

`npm run test` and `npm run test:e2e` are the observed managed test entrypoints. Resolve supported narrow selectors in the active runner during execution; no invented wrapper/filter is asserted runnable here. The coverage checker is a planned implementation addition. Run only commands authorized by the bounded execution dossier, coordinate shared preparation writes, and use the established evidence sanitize/check tools before retention.

## Release Closure Gate

The Japanese-slice proof refresh under ADR 0002 closes WBS-LOC-20-01; dictionary/reload and public-guidance proof retain their separate source limits. Current readiness requires both reviewed dictionaries, applicable retained framework/reload/guidance proof and bilateral language configuration/Zod mapping ATP-LOC-03/07 proof. WBS-LOC-50-01 waits for verified WBS-LOC-40-01 on that scope only; no business consumer or ATP-LOC-04 acceptance is required. Historical guidance-only closure does not prove actual mappings. This planning edit performs no runtime/type/build run; subsequent approved execution prepares only actually affected artifacts and procedures. Publication remains separately authorized; no migration or reset follows from this scope.

## Related Records

- [README](./README.md)
- [PRD](./prd.md)
- [SRS](./srs.md)
- [PDP/WBS](./pdp-wbs.md)
- [Progress](./progress.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
- [Repository scripts](../../repo-docs/reference/repo-scripts.md)
- [SSR entry modes](../../repo-docs/fullstack/ssr-entry-modes.md)
