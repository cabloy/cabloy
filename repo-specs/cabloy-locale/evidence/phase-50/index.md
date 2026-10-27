# Guidance and Release-Readiness Evidence

## AccountUserName supplement disposition — 2026-10-27

The user subsequently approved the bounded next step with “同意，请执行下一步”. Both Zova home-user provider dictionaries now contain `AccountUserName`: Japanese `ユーザー名`, Taiwan Traditional Chinese `使用者名稱`, consistent with existing home-login wording. The [supplement review packet](../phase-30/terminology-review.md#accountusername-supplement--2026-10-27) and [actual inventory/source checks](../phase-30/artifacts/account-username-398f2e-checks.txt) supersede the missing-source gate below, without changing historical records. Base remains `398f2e270aac823a6feb0da5eac534e5867798e8` plus the preceding documentary edits and exact retained two-file source diff.

The focused inventory test passed (1/1, no skips): Vona 28 targets / 320 module + 68 core keys and Zova 23 targets / 387 keys per language; source inventory SHA-256 `2708abc5da3821fca7e78c0553579276caecadb9b0d12ef28821da7ba3899333`. Source format/lint and diff checks passed. This is dictionary data proof, not consumer/runtime, browser, SSR, build, generation or artifact-sync verification. No such additional operations were performed or required. Existing framework/reload and guidance proof retains its prior scope; the two authored string additions do not change those mechanisms or public guide bytes.

Reviewer `zhennann` subsequently explicitly declared “这两个新增译文均 accept，无 correct/query” on 2026-10-27. This accepts both displayed AccountUserName translations; it is separate from execution approval and supplements rather than rewrites the original 1,548-entry acceptance. The two source file hashes and binary diff SHA-256 `e81c82b47b8c00a2e18fb18da7f14d98e55e39592523b5aaa298950e6b12b8e0` still match the tested candidate. No correction or source edit followed acceptance, so the retained focused checks remain applicable without rerunning them.

**Current revised-scope readiness: satisfied.** ATP-LOC-05 / WBS-LOC-30-01 are `verified` for 1,550 accepted entries, zero corrections and zero unresolved queries. ATP-LOC-07 remains satisfied for guidance only. Reconciliation of the current dictionary proof, retained framework/reload proof and attributed guidance/build/link review closes ATP-LOC-08 / WBS-LOC-50-01 as `verified`. No migration, policy change, generated consumer edit or artifact synchronization is needed for these two authored strings; general formatting is not added to scope. This is the suite's revised-scope readiness conclusion, not publication authorization, a fresh HEAD build or an excluded runtime pass. WBS-LOC-40-01 / ATP-LOC-04 remain outside current scope, not passed. No further in-scope implementation or acceptance task remains; publication, commit and push remain separate and unperformed.

The [earlier supplement record checks](./artifacts/account-username-398f2e-records.txt) retain the pre-acceptance state. [Final acceptance closure checks](./artifacts/account-username-398f2e-closure.txt) retain the final static results; those checks establish record consistency, not the human disposition or product proof themselves.

## Current revised-scope closure — 2026-10-27

Historical step: the following records the approved documentary closeout before the separately approved supplement above. Its missing-source status and next-approval handoff are superseded; its attribution, observed results and historical-build limits remain retained.

### Approval, attribution and boundary

- The user approved the finite WBS-LOC-50-01 documentary closeout with “同意，请进行收尾”, following the stated scope of reconciling retained evidence, progress and readiness without new source, tests or builds. This does not authorize release, publication, version changes, commit/push, reset, environment edits or dependency operations.
- Edition: Cabloy Basic, sole `__CABLOY_BASIC__` marker. Revision: `398f2e270aac823a6feb0da5eac534e5867798e8`, branch `worktree-spec-basic-cabloy-locale`, clean before closeout. The immediately preceding commit contains only the approved spec/chart scope correction, with no changes to Vona, Zova, public docs, E2E or scripts. This closeout changes only this phase record, README, progress, derived charts and its scoped static artifact; base revision alone does not include those documentary edits.
- Authority: PRD-LOC-05/06, SRS-LOC-09/12, WBS-LOC-50-01 and revised ATP-LOC-07/08. Accepted ADR 0001's 2026-10-27 clarification and ADR 0002 retain the provider/framework boundaries. At closeout entry, direct prerequisites WBS-LOC-30-01 and WBS-LOC-30-02 were recorded verified. The applicability review below preserves the reload result but identifies a new current-inventory gap in the dictionary prerequisite.
- The user explicitly removed actual business-consumer delivery and corresponding runtime integration verification. WBS-LOC-40-01 remains out of current scope (`deferred`, no required resumption); ATP-LOC-04 is not required. ATP-LOC-03 retains framework policy proof without a consumer-integration rerun. ATP-LOC-07 now concerns configuration guidance, not backend/frontend validation, schema/draft, SSR, hydration, navigation or concurrent-request runtime acceptance.

### Procedures and disposition

- Review the retained public-guide build/link/command results and source continuity within their actual scope, rather than rerunning business tests or builds. Historical failures and superseded results remain unchanged below and in their original artifacts.
- ATP-LOC-07 guidance review checks the installed-resources/enabled-policy/vendor-registration distinction, application-owned `ja-jp`/`ja` and `zh-tw`/`zhTW` mappings, backend root default, client-only frontend registration, backend schema truth and current locale-scoped frontend projections. Both current home-base adapters still register only English/Simplified Chinese; Vona's `src/lib/utils/util.ts` and Zova's `src/core/app/util.ts` retain the existing `setLocaleErrors` adapter. No consumer implementation or runtime behavior is inferred from these source/guidance observations.
- ATP-LOC-08 reconciles the reviewed dictionary and framework/reload evidence, retained public-guidance results, migration/formatting/generated-output boundaries, removed verification scope, and separate publication authorization. Static authority/chart checks support record consistency only; they do not substitute for retained product proof.
- No runtime fixture, database, listener, application build, dependency sync or external operation is introduced. New documentary material uses repository-relative paths and synthetic/public source facts only. The scoped path checker has bounded recognition; manual sensitive-content review remains separate.

### Current evidence applicability

- Public guidance: the backend guide hash recorded in `business-zod-guidance.txt` (`d01d1eff7af2e7d50dd5429ba06496eeba28bf656633cb778698c44465caf5f9`) exactly matches revision `48b75ddb1120`, not current HEAD. The subsequent four-guide diff contains seven line replacements: bundled-provider claims become application-authored examples, provider-specific scope becomes the provider's own scope, and the metadata example uses `<module>`. The startup guide is unchanged. These are packaging/authoring clarifications, not new locale behavior. Current scoped review found no unresolved guidance, command, navigation or link defect; headings, link targets/fragments, four sidebar entries, CLI declarations and the docs command chain remain applicable. Historical successful builds cover their original bytes only; no build of current guide bytes is claimed. Current hashes and exact diff attribution are retained in the closure artifact below.
- ATP-LOC-07: satisfied for its revised guidance-only scope by the current guide/adapter/API review and attributed retained documentation proof. Basic registration remains English/Simplified Chinese. The removed application runtime procedures are not passed or waived.
- Framework/reload continuity: both locale suite trees are unchanged from tested `36756a972a`; the HMR service retains SHA-256 `8a20ec1fdd2bf904a5223bd565771a911ec918f3733c1b610fb2d340e2a490be`. Retained mechanism and actual watcher proof keep their original limits; no fresh runtime, typecheck, SSR build or artifact-sync pass is claimed.
- Dictionary acceptance boundary: the recorded inventory hash `ce33bb93c3bc3a8c1fcdf9195c2d677502e6a0ff9c0d467a0c57a0b67c9cf2c5` and all 1,548 human-accepted entries remain valid for the reviewed/tested revisions. However, commit `ca516d45505195b3b49e9bbe3a71662dcb0ce96e` subsequently added `AccountUserName` (`User name` / `用户名`) to `zova/src/suite/a-home/modules/home-user/src/config/locale/{en-us,zh-cn}.ts`. The key is absent from both `zova/src/suite/cabloy-locale/modules/{locale-jajp,locale-zhtw}/src/lib/locales/home-user.ts`. Unchanged provider bytes therefore do not establish parity with the expanded current source inventory. This is one new source key missing in two provider dictionaries, not a full new inventory assessment or a failure of the previously accepted entries.

### Closure disposition

The approved documentary reconciliation is complete, but **ATP-LOC-08 and WBS-LOC-50-01 are blocked for current-source readiness** by the concrete in-scope dictionary omission. WBS-LOC-30-01's former verified closure remains historical and revision-scoped; its current status is `blocked` pending an authorized bounded dictionary supplement, attributed terminology disposition for the two translations, and focused inventory/placeholder proof. No application-consumer, vendor-validation, browser or SSR verification is required to resolve this finding. WBS-LOC-20-01 and WBS-LOC-30-02 retain their verified scope; WBS-LOC-40-01 stays deferred outside current scope without required resumption.

No dictionary or public guide was edited, no excluded verification was restored, and no runtime/build/release operation occurred. The finite documentary procedure reports the newly observed gate rather than hiding it behind passing static checks. The next implementation candidate is the two-dictionary `AccountUserName` supplement under WBS-LOC-30-01; it is not executed or approved by this closeout. Publication remains separately authorized and is not currently ready.

The exact static procedures, exit codes and documentary diff attribution are retained in [revised-scope closure checks](./artifacts/revised-scope-398f2e-closure.txt). All later 2026-10-26 integrated-readiness statements are historical, not current application verification or current-inventory completeness claims.

## Historical guidance and integration records

The sections below preserve the earlier chronology and candidate results. Current scope and readiness are governed by the section above and the current PRD/SRS/WBS/test plan, not by historical consumer-verification prerequisites.

## Business-application Zod configuration clarification

The user further requested that Basic's existing English/Simplified Chinese Zod adapters remain unchanged. Both home-base mapping additions have been removed. The public I18n Guide now documents application-owned imports and registration for enabled business languages, including backend/default and frontend/client-only calls. Previous guide digests and build outputs below describe their earlier bytes; the updated guide is checked separately in [business Zod guidance checks](./artifacts/business-zod-guidance.txt). No current runtime-source change or new integration acceptance is asserted.

## Subsequent simplification and applicability

After this recorded closure, the user rejected the test-only locale-policy switch and its related integration tests. They have been removed rather than replaced. The public guides and their docs/link checks remain valid, but the former 13-file candidate attribution and integrated release-readiness conclusion below are historical, not a claim about current retained test coverage. See the [phase-40 simplification note](../phase-40/index.md#subsequent-user-directed-simplification) for the current two-file runtime diff and focused verification. No new integration matrix is proposed or required by this note; no waiver of the existing acceptance authority or new release approval is inferred.

## Scope, approval, and candidate

- Date: 2026-10-26. Edition: Cabloy Basic, sole `__CABLOY_BASIC__` marker.
- Selected increment: [WBS-LOC-50-01](../../pdp-wbs.md#wbs-loc-50-01-close-guidance-and-release-readiness-proof). Traceability: PRD-LOC-06, SRS-LOC-12, [ATP-LOC-08](../../test-plan.md#atp-loc-08-verify-guidance-and-release-readiness-boundaries).
- After the separate bounded dossier was presented, the user explicitly approved execution with “同意，请执行下一步”. Approval covers existing public guides, docs verification, applicable evidence reconciliation and derived records only. It does not authorize publication, deployment, version changes, commit/push, reset/init, environment changes, dependency recovery or runtime source changes.
- Base: `308cfe5c3677fc0c8124c1f26527f92a6125feec`, branch `worktree-spec-basic-cabloy-locale`, dirty worktree. HEAD alone is not the tested candidate.
- The existing [phase-40 13-file implementation scope](../phase-40/index.md#scope-approval-and-attribution) was independently recomputed and still has diff SHA-256 `a27d6510a885f56abbb1d013020610e48966263a428feb5f30d7571ffb88bbee`. None of those files was changed by phase 50. No committed implementation-root changes exist from dictionary-tested `36756a972a` or human-reviewed `6d6d9401f7` to this base.
- Phase-50 public-guide diff SHA-256: `342159870d7659304ed9bbf9dcd2d9ecc974e73484df3cfdaaada37a8d21bf03`, computed using `git diff --binary --` followed by the four paths below, in that order. Evidence, README, progress and charts are excluded from this guide digest.

```text
repo-docs/backend/i18n-guide.md
repo-docs/frontend/module-scope.md
repo-docs/frontend/system-startup-guide.md
repo-docs/frontend/environment-config-guide.md
```

## Delivered guidance and source review

The four existing guides now distinguish ordinary `src/config/locale` dictionaries from authored `src/locales` / `localesProvider` resources, declare each stack's capability key, explain cross-module envelopes and target ownership, and retain metadata-filtered lazy-target behavior. They document project/provider/ordinary precedence separately from requested-locale/global/English/key lookup; installed resources separately from enabled policy and configured default; replacement of `items` layers; independent frontend/backend alignment; root-default migration; full reload/reinitialization; and ordinary metadata generation versus provider authoring.

The backend guide removes the obsolete module-default read as a recommendation and shows root `this.app.config.locale.default`; the old expression remains only as an explicitly obsolete migration example. Text placeholders and exact numeric suffixes are not represented as complete date/number/currency formatting. Existing Zod mappings, client-only frontend registration, locale-scoped schema ownership, compatible dirty-input preservation and opaque-renderer reset limits are explicit. No public page exposes test-only policy markers, internal ATP/WBS prerequisites, evidence paths or machine-local paths. No page, navigation hierarchy or runtime API was added.

Source checks used the existing owners, not generic framework assumptions:

- Vona provider registration: `vona/packages-vona/vona-core/src/lib/module/locales.ts`; active policy helpers: `src/lib/bean/resource/locale/utils.ts`; negotiation: `vona/src/suite-vendor/a-vona/modules/a-locale/src/main.ts`.
- Zova startup, metadata filtering and config replacement: `zova/packages-zova/zova-core/src/core/sys/{module,locale,sys,config}.ts`.
- Shared fallback: `vona/packages-utils/localeutil/src/index.ts`.
- Ordinary locale generation: each CLI's `toolsMetadata/generateConfig.ts`; command declarations: each CLI's `command/init.locale.ts` and `command/tools.metadata.ts`.
- Both existing `home-base/src/main.ts` adapters, authored provider maps/exports and existing application config roots. No environment files were read or changed for this increment.

## Fresh ATP-LOC-08 procedures and results

All producers used Node **24.11.0**. Both output streams were captured in memory, ANSI removed, passed through the repository evidence sanitizer, and only then exclusively written to new artifacts. Producer and sanitizer statuses remain visible.

| Procedure | Observed result | Primary evidence |
| --- | --- | --- |
| `npm run docs:build` | Passed; VitePress client/server bundles and page rendering complete | [Initial build](./artifacts/docs-build.txt) |
| Scoped rendered-link/anchor/navigation/CLI/public-boundary review and `oxfmt --check` | Links and declarations resolved; initial combined procedure stopped at formatting check. Repeated dedicated style check confirmed one new table needed formatting, exit 1 | [Initial style diagnostic](./artifacts/docs-style-initial.txt) |
| `oxfmt --write repo-docs/frontend/module-scope.md`, then scoped review / `oxfmt --check` / `git diff --check` | Formatter exit 0; 37 root-local link occurrences resolve in rendered HTML, fragment IDs resolve, all four existing sidebar entries present, Vona/Zova init-locale and metadata declarations exist; style and diff checks exit 0 | [Scoped review](./artifacts/docs-review.txt) |
| `npm run docs:build` after table formatting | Passed on the final guide bytes; producer and sanitizer exit 0 | [Final build](./artifacts/docs-build-final.txt) |

VitePress reports its existing greater-than-500-kB chunk-size warning; no build failure or dead-link failure is hidden. Default dead-link validation remains enabled, with only existing localhost HTTP exceptions. CLI checks verified root wrappers and actual declaration sources; no scaffolding or metadata generation was run merely to manufacture freshness. The inline rendered-link check is a one-shot scoped inspection, not new repository verification infrastructure.

## Applicability of existing ATP-LOC-01–07 and type/build proof

This is **reuse after source attribution review**, not a claim that runtime tests, watcher sequences, types or paired builds were rerun in phase 50. The docs-only changes do not alter their tested implementation inputs.

| Proof | Applicable retained result and boundary |
| --- | --- |
| ATP-LOC-01 | [Phase-20 current proof](../phase-20/current-proof.md) retains actual Japanese discovery/generation/preload proof; [phase-30 dictionary execution](../phase-30/dictionaries.md) adds actual both-provider metadata and independent pack invocations. [Phase-40 frontend results](../phase-40/artifacts/frontend-locale.txt) retain none/either/both client/server variants. Preload instrumentation is a real existing module boundary, not a pre-existing business reader; client lazy assertions do not prove SSR import laziness. |
| ATP-LOC-02 | Phase-20 real-loader scoped/global, precedence, absent-target and fallback proof remains applicable: relevant loader/lookup source is unchanged. Phase-30 dictionary expansion and phase-40 backend/frontend passes provide continuity. Phase 20 alone is not reload proof. |
| ATP-LOC-03 | [Phase-40 complete-provider policy proof](../phase-40/index.md#atp-loc-03--passed-for-both-complete-providers): backend default 32 pass/2 policy skips, enabled 18 pass; frontend 14 pass; default browser 2 pass/3 skips and enabled browser 3 pass/2 skips. Complementary runs cover intentional policy skips. Ordinary Basic remains English/Chinese, default English. |
| ATP-LOC-04 | [Existing Basic Admin/Web SSR proof](../phase-40/index.md#atp-loc-04--passed-on-existing-basic-webadmin): Japanese/Traditional raw HTML, hydration, menu/reload/URLs and concurrent distinct-locale requests, plus original-language regression. Existing Site/flavor, admission and Vona integrated SSR boundaries remain unchanged. |
| ATP-LOC-05 | [Final dictionary closure](../phase-30/dictionaries.md#final-human-review-and-dictionary-closure-2026-10-26) and [explicit human declaration](../phase-30/terminology-review.md#current-all-entry-acceptance-2026-10-26): `zhennann` accepted all 1,548 entries including the new language name, 0 correct / 0 query. Reviewed `6d6d9401f7` dictionaries match tested `36756a972a` and current source. Vona 28 targets/320 module + 68 core keys and Zova 23 targets/386 keys per language; inventory digest `ce33bb93c3bc3a8c1fcdf9195c2d677502e6a0ff9c0d467a0c57a0b67c9cf2c5`. Mechanical disposition expansion is not independent AI terminology review. |
| ATP-LOC-06 | [Phase-30 actual reload proof](../phase-30/index.md) retains backend/Web five-edit watcher sequences, seven snapshots per stack, deletion behavior, clean-start equivalence and owned restoration. Current HMR service SHA-256 still matches accepted `8a20ec1fdd2bf904a5223bd565771a911ec918f3733c1b610fb2d340e2a490be`. Later test expansions passed subsequently; watcher sequences were not freshly rerun. Historical cold-start warnings are not SSR acceptance. |
| ATP-LOC-07 | [Phase-40 schema/validation/draft proof](../phase-40/index.md#atp-loc-07--passed-using-existing-owners): four-language backend schema and Zod errors, current frontend schema/validation and compatible dirty-input preservation; existing draft 07/08/11 results are 3 pass. Opaque translated custom-renderer reset is intentional, not universal preservation. |
| Types and paired artifacts | [Phase-40 environment/types](../phase-40/artifacts/types-and-env.txt): 7 environment tests and both native typechecks pass under Node 24.11.0. [Paired builds](../phase-40/artifacts/paired-builds.txt): Admin SSR+REST, Web SSR+REST, then `npm run deps:vona`, producer exit 0. No later runtime source drift was found. Current generated/installed REST JS and declarations match across both flavors; this corroborates synchronization, not a fresh SSR build. |

The two CLI `localeMetadata.test.ts` files were previously removed at the user's request. Their retained phase-20 successes apply to the pre-removal snapshot, **not current retained regression coverage**; product/generator sources were not changed by that removal. No test was recreated or rerun in phase 50. Earlier failed/preliminary runs, historical 385-key inventories, prior Node-version limitations and supersession notes remain in their original records unchanged. No evidence was erased or promoted to imply broader coverage.

## Privacy, closure, and release boundary

No runtime fixtures, database preparation, server listener, external provider, deployment or publication operation was needed. Existing phase-40 synthetic-fixture cleanup remains its own attributed result. Scoped path checking and manual inspection cover the new phase-50 artifacts and this index. Manual inspection found no credentials, raw tokens, signed callback state, secrets, live provider identifiers or real customer/payment data. Logs contain repository-relative commands and build diagnostics only. The path checker is bounded recognition, not universal path detection, secret scanning or acceptance proof.

ATP-LOC-08 is satisfied for this attributed candidate by actual docs output, rendered-link/command/navigation review, source-scoped reuse of applicable ATP-LOC-01–07 and supported-Node type/paired-build results, explicit human translation acceptance, migration/formatting/generated-file boundaries and retained diagnostics. No required translation, configuration, SSR, validation or reload failure remains open in the approved feature scope. **WBS-LOC-50-01 is verified; the candidate is guidance/release-ready within this specification, but no release operation or publication is authorized.**

Final path/style/authority/chart/diff results are retained separately in [closure checks](./artifacts/closure-checks.txt). Static authority auditing and chart freshness are not runtime or human acceptance. The resulting chart count is five verified tasks plus one planning-complete baseline, not six runtime-verified tasks.

Next single action: request separate release-operation authorization if publication is desired; otherwise retain this verified candidate without further execution. No commit or push was performed.
