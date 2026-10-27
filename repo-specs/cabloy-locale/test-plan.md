# Cabloy Locale Test Strategy and Acceptance Plan

## Purpose and Authority

This document defines executable acceptance and minimum proof for the [SRS](./srs.md), linked to the [PRD](./prd.md) and [WBS](./pdp-wbs.md). Procedure definitions are not execution results. Historical Japanese-slice results are retained in the [phase-20 index](./evidence/phase-20/index.md); the separately approved [current proof refresh](./evidence/phase-20/current-proof.md) re-establishes the bounded Japanese slice after the resource-contract change accepted in [ADR 0002](./decisions/0002-locale-provider-resource-export.md). Creating or updating this file, accepting an ADR, running spec audits, or generating charts executes none of these scenarios.

## Scope, Quality Priorities, and Risk

Priorities are correct registration/precedence, language-policy isolation from installed packs, startup/lazy correctness, single-language metadata generation, actual translation coverage, validation/schema switching, SSR equivalence, and development reload correctness. Existing English/Simplified Chinese behavior must remain intact. No new business authorization, database lifecycle, concurrency control, or external provider flow is introduced.

## Verification Model

| Level                | Purpose                                                                                                                                               | Limit                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Narrow               | Focused existing unit/runtime/generator tests and typechecks for the selected increment.                                                              | Does not prove browser, complete vocabulary, SSR, or release closure.        |
| Contract/integration | Real scoped text, configured selection, emitted locale metadata, validation, and actual loader interactions.                                          | Source inspection or mocked imports alone do not prove integration.          |
| Full closure         | Both languages' reviewed inventory plus critical existing Admin/Web browser and SSR flows, paired artifacts, docs, and applicable regression results. | No release/publishing authorization; proof is revision/configuration scoped. |

## Test Levels and Ownership Locations

Reuse existing infrastructure, with focused regressions rather than a bespoke source-evaluation harness:

- Existing [backend locale tests](../../vona/src/suite-vendor/a-test/modules/test-vona/test/locale.test.ts) retain original-language lookup regressions. Current [locale-test provider tests](../../vona/src/suite/cabloy-locale/modules/locale-test/test/provider.test.ts), [registry tests](../../vona/src/suite/cabloy-locale/modules/locale-test/test/locales.test.ts), and [policy tests](../../vona/src/suite/cabloy-locale/modules/locale-test/test/localePolicy.test.ts) own the relocated Japanese/policy assertions.
- Verify provider export preservation under ADR 0002 through the supported metadata CLI and resulting exports/scopes. The two dedicated `localeMetadata.test.ts` files added during the proof refresh were subsequently removed at the user's request as unnecessary; their recorded executions remain historical evidence, not retained regression tests. Existing [frontend source import tests](../../zova/packages-cli/cli-set-front/test/sourceImports.test.ts) and [entry generation tests](../../zova/packages-utils/zova-vite/test/generateEntryFiles.test.ts) are supporting checks, not substitutes for provider assertions.
- Current [frontend locale runtime tests](../../zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts) exercise SysModule/SysLocale early/lazy installation and policy fixtures; module-glob conventions support metadata discovery.
- The independent [locale E2E suite](../../repo-e2e/specs/cabloy-locale.spec.ts) owns existing locale browser regressions; [Basic E2E](../../repo-e2e/specs/cabloy-basic.spec.ts) retains shared SSR/schema/draft flows. Add the smallest suitable assertions; do not require unrelated domain scenarios solely because locale is shared.
- Provider-local or existing tooling test placement for deterministic inventory and placeholder checks, selected during bounded implementation. Such a check is a planned addition, not a current command.

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

Setup:

- Isolated app/config fixtures for: both packs installed with only en-us/zh-cn enabled; ja-jp enabled/default with and without its pack; both new languages enabled; invalid empty items or default outside items.
- Synthetic query/header/cookie/preference/current-assignment and locale-route inputs, including canonicalizable casing/underscores, aliases to disabled targets, and unknown values.

Procedure:

- Resolve backend request/current language and frontend active language using supported entry paths; assert installed-resource changes do not change policy.
- Exercise no explicit selection, disabled/stale saved values, direct setters, request negotiation, SSR route selection, and navigation restoration.
- Inspect Admin/Web menus including route-specific subsets. Compare route URL, active locale, SSR text, and hydrated client behavior for disabled matched route input.
- Initialize invalid policy and capture its explicit error. Rerun both complete providers at consumer integration.

Expected result:

- Enabled own-item keys only determine current-language availability; default is the sole validated configured default, not dictionary availability or old module defaultLocale.
- Disabled values resolve to the default through supported selection paths, with canonical URLs consistent with existing router policy; menu overrides cannot expand the enabled set.
- Enabled language without a provider remains selectable and falls back; explicit low-level lookup remains independent.
- Invalid policy fails visibly without enabling an installed pack or mutating shared settings.

Minimum proof:

- Config/installed-pack variants, entry-path assertions and responses, invalid-policy error, menu/route assertions, paired backend/frontend results, revision, and exact commands/procedures.

Traceability: `PRD-LOC-02`, `SRS-LOC-05`, `SRS-LOC-06`, `WBS-LOC-20-01`, `WBS-LOC-40-01`.

### ATP-LOC-04: Keep SSR, hydration, and subsequent navigation coherent

Setup:

- Built existing Basic Admin/Web SSR and REST artifacts synchronized to Vona; name and attribute the explicitly configured consumer boundary where both new languages are enabled. Ordinary Basic policy remains en-us/zh-cn; installed dictionaries do not supply this setup.
- Existing shared Site admission and public/session profiles unchanged; use a synthetic admitted account only where an existing route requires it.

Procedure:

- Request existing representative Web and Admin pages in each new locale; capture server HTML and the client's hydration-time render/console.
- Switch language through existing menus/navigation, test a disabled matched locale route, and observe canonical URL/current-language alignment.
- Run separate concurrent requests for different enabled locales and assert no request inherits the other's preference.
- Repeat a representative English/Simplified Chinese flow without changing shared environment identity.

Expected result:

- Server and initial client render are equivalent; no hydration warning or private-state timing regression.
- Language selection and URL stay coherent, requests remain isolated, and existing Site admission/SSR profiles and original languages are preserved.
- Static dictionaries are shared without request-specific mutation and business lazy loading is not broadened.

Minimum proof:

- Build/sync commands and results, Site/flavor/config identifiers, response assertions, browser assertions/console logs, distinct-request outcomes, cleanup, revision, and redacted artifacts. Screenshots alone are insufficient.

Traceability: `PRD-LOC-03`, `PRD-LOC-06`, `SRS-LOC-03`, `SRS-LOC-06`, `SRS-LOC-12`, `WBS-LOC-40-01`.

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

### ATP-LOC-07: Localize validation and schema-owned UI state

Setup:

- Both packs enabled at an explicitly configured existing consumer, with a representative existing schema-driven form and backend validation path using synthetic values. Attribute the consumer's source/configuration and application-owned Zod registrations: `ja-jp` to `ja`, `zh-tw` to `zhTW`, backend root default and client-only frontend setup.
- Basic's ordinary home-base adapters retain only English/Simplified Chinese Zod registrations. Their original-language regression is separate from enabled business-application validation proof; dictionary installation alone is not validation setup.

Procedure:

- Request locale-aware backend schemas and trigger a known validation error under ja-jp/zh-tw plus original language regressions.
- Trigger frontend validation using the corresponding Zod mappings.
- Open the existing schema-driven form, make a draft edit, switch language, and observe current schema-owner projections and text while checking the draft.
- Verify selector names and compare default language behavior with root configuration.

Expected result:

- Representative schema labels and backend/frontend validation messages use the intended locale; no stale schema facade, duplicated metadata, or invented API owner.
- Draft semantics are preserved, selectors display meaningful language names, and existing English/Simplified Chinese errors still work.

Minimum proof:

- Backend schema/error assertions, frontend validation and compatible draft-preservation assertions, locale-owner observations, current generated artifact/build results if applicable, revision, procedures, and redacted artifacts. Include the enabled consumer's policy/validation-registration attribution and unchanged Basic-baseline regression result. Public configuration examples are guidance, not observed runtime proof.

Traceability: `PRD-LOC-03`, `PRD-LOC-05`, `PRD-LOC-06`, `SRS-LOC-09`, `SRS-LOC-12`, `WBS-LOC-40-01`.

### ATP-LOC-08: Verify guidance and release-readiness boundaries

Setup:

- Implementation candidate revision, actual applicable scenario evidence, translation review, updated public docs, and synchronized affected artifacts.

Procedure:

- Run docs build and verify changed local links/commands/navigation where practical; check instructions against observed CLI/runtime behavior.
- Check current type/build/regression outcomes and applicability of each retained scenario to the candidate revision.
- Review language policy migration notes, formatting exclusions, generated-file handling, evidence sanitization, release blockers, and separate publication authorization.

Expected result:

- Guidance accurately distinguishes resources/enablement/default/fallback and old backend configuration migration.
- All required proof applies or a specific gap remains explicitly open; no publishing, deployment, reset, environment change, or ATP completion is inferred from planning tools.

Minimum proof:

- Docs/type/build outputs with exit codes and revisions, link/command review, applicable scenario evidence index, translation-review references, sanitized artifact check and manual redaction disposition, and explicit release-readiness result. Publication approval remains separate.

Traceability: `PRD-LOC-06`, `SRS-LOC-12`, `WBS-LOC-50-01`.

## Contract, SSR, Browser, and Integration Procedures

Backend truth remains authoritative for localized schema metadata. If an implementation change affects a DTO/OpenAPI contract, inspect emitted output and use the contract-loop specialist for forward generation. Text-only changes do not require invented schema/endpoint changes. Frontend artifacts require affected SSR and REST pairs before Vona dependency synchronization. For Vona integrated SSR isolated E2E, retain runtime API-origin handoff; do not rebuild or edit API_BASE_URL merely to match an isolated test listener.

No single screenshot, source grep, generated file, or helper test substitutes for the assertions in a scenario. Runtime validation beyond the selected approved increment is deferred, not implicitly authorized.

### Current acceptance boundary after simplification

The [phase-40 simplification record](./evidence/phase-40/index.md#basic-baseline-zod-registration-retained) governs applicability of the historical candidate results, not the definitions above. Basic retains its ordinary language policy and original Zod registrations; the removed test-only policy switch and added integration matrix must not be recreated. Historical successes remain attributable to their original candidate and do not establish current full ATP-LOC-03/04/07 coverage.

Resuming those scenarios requires a separately approved WBS-LOC-40-01 execution dossier naming the actual existing consumer, enabled configuration, validation setup where needed, exact procedures, owned fixtures/cleanup and source-scoped evidence reuse. This alignment neither selects nor creates that consumer/configuration. If the permitted boundary cannot exercise an assertion, retain the specific gap; do not substitute documentation, change Basic defaults or waive the assertion. ATP-LOC-08 full readiness remains dependent on closing WBS-LOC-40-01, while completed public-guidance proof keeps its recorded applicability. No runtime acceptance or release operation is authorized by this planning update.

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

The current Japanese-slice proof refresh under ADR 0002 closes only WBS-LOC-20-01; historical results retain their separate source limits. Full feature release readiness requires both reviewed dictionaries and all applicable scenario proof for the candidate revision, relevant type/build/docs checks, no unresolved required issue, and a truthful progress register. Runtime acceptance does not grant release/publication approval. No migration or reset is required by the approved scope.

## Related Records

- [README](./README.md)
- [PRD](./prd.md)
- [SRS](./srs.md)
- [PDP/WBS](./pdp-wbs.md)
- [Progress](./progress.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
- [Repository scripts](../../repo-docs/reference/repo-scripts.md)
- [SSR entry modes](../../repo-docs/fullstack/ssr-entry-modes.md)
