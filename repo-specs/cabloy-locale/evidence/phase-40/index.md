# Language Configuration and Historical Integration Evidence

## Current bilateral configuration and mapping scope — 2026-10-30

The user's subsequent same-date correction retains frontend/backend language configuration and Zod mappings, but removes the actual business-consumer requirement. WBS-LOC-40-01 remains active and `not-started`, pending concrete application-owned configuration/initialization placement, activation scope and bounded execution approval. WBS-LOC-50-01 waits for its verified ATP-LOC-03/07 configuration/mapping result, not consumer proof. ATP-LOC-04 is not required current scope and not passed. No Commerce profile/flavor, runner extension, business page, schema/draft flow or SSR/browser matrix is required. Basic defaults/home-base mappings remain unchanged. No new runtime implementation or result is recorded here; [current progress](../../progress.md) owns the handoff.

The restoration and integration material below is historical and superseded in scope by this correction. Prior successes, failures, source hashes and removal records remain unchanged; guidance and former dirty-candidate results do not establish pending mapping delivery.

## Consumer requirement restored — 2026-10-30

The user now requires “落实一个符合既定边界的实际业务应用消费者”. WBS-LOC-40-01 is active again as `not-started`, pending selection/confirmation of one actual application-owned consumer and a separately approved execution dossier. Both languages and focused ATP-LOC-03/04/07 proof are required; WBS-LOC-50-01 readiness waits for its verified result. Prior removed tests, the former dirty candidate and the 2026-10-27 reduced-scope closure do not prove this restored requirement. The Basic baseline and rejected test-only-switch boundaries below remain in force. No new consumer implementation or runtime result is recorded by this specification update; [current progress](../../progress.md) owns the current handoff.

## Basic baseline Zod registration retained

The user subsequently clarified that Basic is a framework/reference baseline, not the business application where Japanese/Traditional Zod validation must be enabled. Both `home-base/src/main.ts` files now match base `308cfe5c3677fc0c8124c1f26527f92a6125feec` exactly, retaining only English/Simplified Chinese registrations. There is no remaining runtime-source diff from phase 40. Business applications should register Zod resources for their own enabled languages as explained in the public [I18n Guide](../../../../repo-docs/backend/i18n-guide.md#text-formatting-and-validation-boundaries). The two-file mapping candidate and its verification below are also historical; no new runtime acceptance is claimed.

## Subsequent user-directed simplification

On 2026-10-26 the user rejected the test-only locale-policy switch and related added integration tests as unnecessary complexity. The 11 paths containing that plumbing and added scenarios were restored to their pre-phase-40 content; original tests remain. Only the actual Japanese/Traditional Zod mappings in the two existing `home-base/src/main.ts` files remain as runtime changes. No replacement switch or testing abstraction was introduced.

Current base remains `308cfe5c3677fc0c8124c1f26527f92a6125feec`; the remaining two-file implementation diff SHA-256 is `22b144ddc74bd78d62519b97b84f30247a9b63905a115a19d83948b0991f08b0`, using Vona then Zova home-base paths in `git diff --binary --`. Under Node 24.11.0, the original environment regressions, existing frontend locale tests, Admin/Web paired SSR+REST builds followed by dependency synchronization, and both native typechecks passed; see [simplification checks](./artifacts/simplification-checks.txt). No added browser/Student integration matrix was rerun or retained in source.

The material below is **historical proof for the former 13-file candidate**, not current retained integration-test coverage. Its successes and failures are preserved unchanged. Current simplified-source verification does not claim a fresh complete ATP-LOC-03/04/07 execution or publication readiness.

## Scope, approval, and attribution

- Date: 2026-10-26. Edition: Cabloy Basic, detected from the sole `__CABLOY_BASIC__` marker.
- Selected increment: [WBS-LOC-40-01](../../pdp-wbs.md#wbs-loc-40-01-configure-frontend-and-backend-languages-and-zod-mappings), existing validation/schema/SSR consumers and paired artifacts only. The user explicitly approved its bounded execution dossier before implementation. This record does not grant successor or release approval.
- Traceability: PRD-LOC-03/05/06; SRS-LOC-03/06/09/12; [ATP-LOC-03, ATP-LOC-04, ATP-LOC-07](../../test-plan.md).
- Predecessors: WBS-LOC-30-01 dictionary acceptance and WBS-LOC-30-02 reload proof remain independently verified in [phase 30](../phase-30/index.md) and [dictionary closure](../phase-30/dictionaries.md#final-human-review-and-dictionary-closure-2026-10-26).
- Base revision: `308cfe5c3677fc0c8124c1f26527f92a6125feec`, branch `worktree-spec-basic-cabloy-locale`, **dirty implementation**. Base SHA alone cannot reproduce these results.
- Implementation diff SHA-256: `a27d6510a885f56abbb1d013020610e48966263a428feb5f30d7571ffb88bbee`, computed from `git diff --binary -- <the 13 implementation paths below>` before evidence/progress/chart edits. Evidence and derived records are excluded. Later external commits before this run changed prior acceptance records, not these implementation inputs.

Implementation paths:

```text
repo-e2e/specs/cabloy-basic.spec.ts
repo-e2e/specs/cabloy-locale.spec.ts
scripts/runIsolatedTest.ts
vona/packages-cli/cli-set-api/src/lib/bean/toolsBin/configUtils.ts
vona/packages-cli/cli-set-api/test/strictGenerationPrivacy.test.ts
vona/packages-vona/vona-core/src/types/utils/env.ts
vona/src/backend/config/config/config.ts
vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/beanSsrSiteBase.ts
vona/src/suite/a-home/modules/home-base/src/main.ts
vona/src/suite/a-training/modules/training-student/test/student.test.ts
zova/packages-zova/zova-core/src/types/utils/env.ts
zova/src/front/config/config/config.ts
zova/src/suite/a-home/modules/home-base/src/main.ts
```

## Implementation and runtime boundary

Both existing home-base validation adapters now register Zod `en`, `zhCN`, `ja`, and `zhTW` mappings. No DTO shape, API, persistence, migration, generated consumer, or schema-owner duplication was introduced. Language-name dictionaries retain the separately accepted phase-30 source.

Ordinary root policy remains en-us/zh-cn. The retained default-policy runs use default en-us; enabled runs explicitly pass `VONA_TEST_LOCALE_POLICY=both` to the managed test entrypoint. The marker is seeded into Vona's selected environment only for a managed test run and forwarded to SSR server/browser environments only when Vona mode is test with a run ID. An arbitrary inherited process key alone was not sufficient: the CLI selected-key environment seed needed the corresponding addition. The focused regression covers absent, supported, unknown, and nonmanaged marker cases. Zova integrated test rendering uses production rendering mode, so the frontend consumes the explicitly forwarded marker rather than guessing that its mode is test.

Existing Vona integrated SSR Sites remain `admin`/`web`, Zova flavors `cabloyBasicAdmin`/`cabloyBasicWeb`. Existing Web public and Admin session page contracts, admission, authorization, and runtime API-origin handoff are unchanged. No shared identity, port, or environment-file edit was made. Builds and dependency preparation ran sequentially before runtime tests.

## Supported-environment commands and observed results

All commands below actually ran under Node **24.11.0** with producer exit **0**. Each capture combined stdout/stderr, removed ANSI formatting, sanitized paths in memory, checked sanitizer exit **0**, and exclusively created its artifact. Default runs explicitly omitted the policy marker from the parent environment. Opposite-policy skips are intentional and covered by the complementary run, not waived failures.

| Procedure | Observed result | Primary artifact |
| --- | --- | --- |
| `npm run build:zova:admin && npm run build:zova:web && npm run deps:vona` | Both Admin/Web client/server/webserver SSR and REST builds completed; Vona dependency sync completed | [Paired builds](./artifacts/paired-builds.txt) |
| `node --test vona/packages-cli/cli-set-api/test/strictGenerationPrivacy.test.ts && npm run tsc:zova && npm run tsc:vona` | 7 passed, 0 failed; both native typechecks passed | [Environment and types](./artifacts/types-and-env.txt) |
| `npm run test -- 'training-student/test/student.test.ts' 'locale-test/test/*.test.ts' 'test-vona/test/locale.test.ts'` | 32 passed, 0 failed, 2 new-locale Student cases intentionally skipped under default policy | [Backend default](./artifacts/backend-default.txt) |
| `VONA_TEST_LOCALE_POLICY=both npm run test -- 'training-student/test/student.test.ts'` | 18 passed, 0 failed, including all four localized schema/error cases | [Backend enabled](./artifacts/backend-enabled.txt) |
| `node --experimental-transform-types --test zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts` | 14 passed, 0 failed, covering client/server loader variants and policy | [Frontend locale](./artifacts/frontend-locale.txt) |
| `npm run test:e2e -- cabloy-locale` | 2 passed, 0 failed; 3 enabled-policy scenarios intentionally skipped | [Browser default](./artifacts/browser-default.txt) |
| `VONA_TEST_LOCALE_POLICY=both npm run test:e2e -- cabloy-locale` | 3 passed, 0 failed; 2 default-policy scenarios intentionally skipped | [Browser enabled](./artifacts/browser-enabled.txt) |
| `VONA_TEST_LOCALE_POLICY=both npm run test:e2e -- cabloy-basic --grep 'ATP-BASIC-DRAFT-(07\|08\|11):'` | 3 passed, 0 failed: invalid-create recovery, multilingual current-schema draft preservation, and existing opaque-renderer reset semantics | [Draft regressions](./artifacts/draft-enabled.txt) |

The grep command above displays the literal alternation characters escaped for Markdown table syntax; the artifact header retains the exact executed shell command.

## ATP disposition

### ATP-LOC-03 — passed for both complete providers

Backend real-loader tests reran none/Japanese/Traditional/both provider variants, independent scoped lookup, disabled active selection, enabled-without-provider fallback, root default authority, configuration replacement, invalid policy, and negotiation/setter behavior. Frontend tests reran real client/server initialization, saved/current locale normalization, route-menu subsets, and invalid/replaced policy. The complete dictionary inventory remains `ce33bb93c3bc3a8c1fcdf9195c2d677502e6a0ff9c0d467a0c57a0b67c9cf2c5`.

Default-policy browser requests to both `/ja-jp` and `/zh-tw` redirect canonically to `/`; a disabled Japanese cookie does not re-enable the language. Existing Web English/Chinese navigation/reload and Admin menu selection/reload pass. Enabled-policy menus expose translated Japanese/Traditional language names and identify the active item. Installing dictionaries remains distinct from product enablement.

### ATP-LOC-04 — passed on existing Basic Web/Admin

Enabled Web requests return 200 with the correct Japanese or Traditional SSR heading, without the opposite heading or a preexisting hydration-complete marker. Browser hydration sets the existing Web marker; menu changes, canonical locale URLs and reload preserve the intended heading. Admin login follows its existing admission path; menu switches to Japanese then Traditional, reload HTML, active menu item, hydration marker, and canonical `/admin/` agree.

Distinct Japanese/Traditional HTTP requests are launched together with `Promise.all`; each response retains its own URL and localized heading without the other's text. Browser page-error, console-error and hydration-mismatch collections are empty in these enabled scenarios. Default-policy browser flows provide the original-language regression. No claim of a new SSR Site, changed lazy-import boundary, or independent deployment is made.

### ATP-LOC-07 — passed using existing owners

Each backend locale uses a separate `app.bean.executor.mockCtx(...)`. The real Student create DTO's serialized OpenAPI titles and mobile minimum length are asserted; the actual DTO validator rejects synthetic invalid mobile input with exact installed-Zod text in en-us, zh-cn, ja-jp and zh-tw. These added checks do not invoke a persistence action.

The real existing Student create form recovers an owned dirty draft, switches through English, Chinese, Japanese and Traditional menus, and asserts current localized name/mobile labels and exact client-side validation messages. Dirty name/mobile values survive compatible schema refresh; edits persist through the existing draft owner and are recovered and discarded at the end. No business mutation, page error or hydration mismatch is observed. This verifies the current reactive resource/schema projection without retaining a stale facade or adding parallel state.

The existing edit regression also passes: ordinary name edits survive, while the opaque custom level renderer with translated options intentionally resets to server baseline. The outcome is compatible-draft preservation, not a promise that every custom field survives any schema change.

## Fixtures, cleanup, diagnostics, and privacy

Managed root tests allocated run-owned disposable database/Redis/runtime/listener resources. Logs identify SQLite test databases and synthetic runs only. No development database reset, init, manual seed, unrelated process shutdown or recovery reinstall occurred. New backend locale checks are read-only; existing Student regressions own their resources and cleanup. Browser tests use the existing synthetic admitted fixture; credentials and session material are not retained in these artifacts.

All five managed producers exited successfully and logged graceful application shutdown. After completion, both `.app-test-<run>` and `.vona-test-<run>` directories for each run ID in the retained logs were absent. E2E draft-08 explicitly discarded its owned draft; draft-11 uses the existing fixture cleanup. No claim is made that ordinary development data was modified or refreshed.

Diagnostics are preserved rather than hidden:

- Backend negative validation scenarios log expected rejected inputs and still pass their rejection assertions.
- Frontend Node tests report the experimental type-transform warning.
- Browser workers report the NO_COLOR/FORCE_COLOR conflict warning.
- Draft runs log two server `ERR_STREAM_PREMATURE_CLOSE` asset-stream closures around navigation. All three scenarios pass; the monitored browser page-error/hydration/mutation assertions remain satisfied. This is not a claim of an entirely error-free server log.
- Builds report experimental TypeScript declaration support, dependency-bundling hints, plugin timing diagnostics, and pnpm fallback-store selection; producer exit remains 0.

Manual content inspection found no raw tokens, credentials, secret values, signed callback state, live provider identifiers, or customer/payment data. The path checker initially passed, but manual review found an escaped absolute Playwright selector in three artifacts and a fallback pnpm-store path. Those presentation-only locations were replaced with repository-relative selectors and `<FALLBACK_PNPM_STORE>`; command meaning, diagnostics and results were preserved. These logs are sanitized presentations, not byte-exact shell transcripts. This correction is neither a runtime rerun nor a general secret-scanning guarantee. The scoped path check must be read together with this manual review.

Preliminary runs used Node 24.8.0 and/or earlier assertion revisions. They are not the controlling supported-environment proof; the eight final artifacts above replace their applicability to this increment. Earlier phase-20/30 successes and failures remain unchanged and separately attributed.

## Closure and handoff

WBS-LOC-40-01 runtime and paired-artifact acceptance is **verified** for the attributed dirty implementation. This does not close WBS-LOC-50-01, ATP-LOC-08, public guidance, release readiness, publication or deployment. No commit or push was performed.

Authority audit and deterministic chart freshness are separate gates; their actual final results are retained in [closure checks](./artifacts/closure-checks.txt), not used as substitutes for ATP execution or human terminology acceptance. Human dictionary acceptance remains the phase-30 declaration; no new AI terminology review is substituted.

Next single action: obtain separate approval for a bounded WBS-LOC-50-01 documentation/release-readiness dossier. Do not execute that increment automatically.
