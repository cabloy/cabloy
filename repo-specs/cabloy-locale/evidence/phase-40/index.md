# Language Configuration and Historical Integration Evidence

## Later guide restoration and Phase 50 handoff — 2026-10-30

After the corrected-placement run, the user designated `main` as the sole source of truth for `repo-docs/backend/i18n-guide.md` and required leaving it unchanged. It was restored to `main`; the guide hash `3bbc1e8a3bf6869a048b47ef3f648b56b37a198b49d18b8be05cb3b19fdd8cca` and docs-build result below describe the earlier, branch-modified guide only. They do not prove the restored guide bytes. Runtime/configuration/test and paired-build/type proof below retains its source scope. The separately approved [Phase 50 reconciliation](../phase-50/index.md#approved-readiness-reconciliation--2026-10-30) records the current-guide build and applicability; the earlier no-successor-approval handoff is historical, not a remaining execution gate.

## Home-base registration correction — 2026-10-30

The user subsequently directed both stacks to append Japanese/Traditional Chinese mappings in their existing `home-base/src/main.ts`, not project monkeys. This supersedes the same-day project-monkey placement and unchanged-home-base requirement, not the four-language root policy, baseline/default, client-only frontend registration or data-only providers. The bounded correction and its applicable ATP-LOC-03/07 rerun are complete: **WBS-LOC-40-01 is verified**. The project-monkey candidate below remains historical proof for its exact bytes; corrected-placement proof follows here. No Phase 50 execution, release, environment change or reset is authorized by this correction.

### Corrected source and ownership

Cabloy Basic, branch `worktree-spec-basic-cabloy-locale`, base `ef6368e35ac57cca0485ba47eb926058edae3d99`, dirty candidate. The base SHA alone does not reproduce verification. The seven implementation/test paths below have concatenated lexical-order per-path binary-diff SHA-256 `4a04f91f4c77ac2fb744000ec62d0b6428ef653b91bcebd43060ed39c1432909`, using the same tracked/new-file commands described in the historical attribution below. This digest excludes documentation, specs, logs and charts; it replaces, rather than reuses, the project-monkey digest.

| Implementation/test path | SHA-256 of original source bytes |
| --- | --- |
| `vona/src/backend/config/config/config.ts` | `5a465cb1e9bef5186a729475a8bae160716f15964b0b2d5aed12be64b634aee3` |
| `vona/src/suite/a-home/modules/home-base/src/main.ts` | `30dd245e4cd10ecf5e973fbf2893a8fb9fad3fc75399dfe9a42212071d31d751` |
| `vona/src/suite/cabloy-locale/modules/locale-test/test/provider.test.ts` | `6815ee273ee89050bec2068b95d6586690c9cf1785ea441e4a22a6d45e7876ca` |
| `vona/src/suite/cabloy-locale/modules/locale-test/test/zod.test.ts` | `9ef826a4c8949515a277fab20c13387b678d159cfd94c06d9b8b84e4c83eef13` |
| `zova/src/front/config/config/config.ts` | `b36bbf2724cfdf17c1826692d08fd811af56796a84bededfb58b4f3c73a324f2` |
| `zova/src/suite/a-home/modules/home-base/src/main.ts` | `893b6c28e9d1f14ffcc1d47cc107f5080c363a3fe95ac3d053bc50f3705386ec` |
| `zova/src/suite/cabloy-locale/modules/locale-test/test/zod.test.ts` | `774e64ed00642efe8928116f56a9909cc083e5dec49c197b7a6c2c009b102b11` |

Both existing home-base `Main.moduleLoaded` hooks now register all four factories. Backend uses `this.app.config.locale.default`; frontend retains its existing `process.env.CLIENT` guard and `this.sys.config.locale.default`. Frontend project monkey was byte-compared equal to HEAD. The superseded backend monkey was confirmed untracked and still matched its known task-created hash before removing only that file. No project-monkey registration remains for this increment. Root policy/defaults and provider dictionaries are unchanged by this relocation; accepted inventory remains 1,550 entries.

### Corrected-placement procedures and results

All commands used child-scoped Node 24.11.0. Both pipelines recorded producer, ANSI-presentation and path-sanitizer exits separately as **0/0/0**. No corrected-placement command failed.

| Actual procedure | Result | Primary artifact |
| --- | --- | --- |
| `npm run format -- <both home-base mains, frontend monkey, both zod tests>` then `npm run lint -- <same five paths>` | Passed | [Focused checks](./artifacts/20261030-home-base-tests.txt) |
| From `vona`: `SWC_NODE_PROJECT=tsconfig.json node --import=@swc-node/register/esm-register --test ../zova/src/suite/cabloy-locale/modules/locale-test/test/zod.test.ts` | 2 passed, no failures/skips | [Focused checks](./artifacts/20261030-home-base-tests.txt) |
| `node --experimental-transform-types --test zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts` | 14 passed, no failures/skips | [Focused checks](./artifacts/20261030-home-base-tests.txt) |
| `npm run test -- 'locale-test/test/*.test.ts' 'test-vona/test/locale.test.ts'` | 19 passed, no failures/skips | [Focused checks](./artifacts/20261030-home-base-tests.txt) |
| `npm run build:zova:admin && npm run build:zova:web && npm run deps:vona && npm run tsc:zova && npm run tsc:vona && npm run docs:build` | Both Basic SSR/REST pairs, sync, both native typechecks and current public-guide build passed | [Build/type/docs checks](./artifacts/20261030-home-base-builds.txt) |

**ATP-LOC-03 passed for the bounded effective-policy increment:** actual backend startup enables exactly four languages/default en-us; actual frontend root config retains absent/empty/English/Japanese override behavior. Existing installed-but-disabled, loader, normalization and config-replacement regressions passed. **ATP-LOC-07 passed for corrected registration:** actual Zod parsing produces exact installed-vendor messages for en-us/zh-cn/ja-jp/zh-tw on both stacks, with missing/unsupported selection falling back to English. Backend operations use independent `mockCtx(...)` boundaries without per-request registration. Frontend tests invoke actual home-base `moduleLoaded`, `AppLocale` and `AppUtil` with minimal fixture owners, and verify server invocation does not register or change the callback. This is source-level config/hook/adapter proof, not mounted-browser/full-frontend-startup or SSR-validation equivalence. ATP-LOC-04 remains excluded, not passed.

The directly affected public I18n Guide now describes both home-base hooks and no extra project-monkey registration; its original-source SHA-256 is `3bbc1e8a3bf6869a048b47ef3f648b56b37a198b49d18b8be05cb3b19fdd8cca`. Docs build completed with a chunk-size warning; native transform-types warnings also remain visible. Results are not described as warning-free.

### Cleanup, privacy and handoff

Managed passing run `20261030115050-5f607e28` logged graceful shutdown. Its `vona/.app-test-20261030115050-5f607e28`, `vona/.vona-test-20261030115050-5f607e28` and `vona/.vona-test-claim/20261030115050-5f607e28.json` paths were checked absent. Tests create no persisted business fixtures. Earlier failed-run resources and failures remain retained; no manual reset/cleanup was performed.

Both streams were ANSI-normalized in memory and path-sanitized before capture, including explicit `<PACKAGE_STORE>` mapping. Explicit scoped path checks passed with no binary/unsupported exclusions; manual review found no remaining machine-local paths, credentials, tokens, live provider identifiers or customer/payment data in the two new artifacts. The checker establishes bounded path recognition only, not universal secret scanning or ATP proof.

[Final corrected-record checks](./artifacts/20261030-home-base-records.txt) passed: complete `spec:check` (32 definitions), deterministic chart generation/freshness (English, 4/6 verified), scoped source/docs/spec format, seven-path lint, `git diff --check` and bounded evidence-path checks. Producer/presentation/sanitizer exits were 0/0/0. These establish record/model consistency, not runtime acceptance or human approval.

During final attribution checking, HEAD advanced externally to `4cc5108245f8d4bc8c2625d5a96deee07c11b87b` (`feat: ja-jp/zh-tw`). A check using moving HEAD initially failed its digest assertion; no source/test failure occurred. Recomputing against the recorded original base `ef6368e35a` reproduced `4a04f91f4c77ac2fb744000ec62d0b6428ef653b91bcebd43060ed39c1432909`, and all seven verified source files were byte-compared equal to the external commit. Frontend monkey still matches the original base, backend monkey remains absent, and owned passing/failed-run cleanup dispositions remain as recorded. No unchanged runtime test was rerun merely because of this external commit. This assistant did not run commit or push.

Corrected predecessor proof is available for a separately approved WBS-LOC-50-01 / ATP-LOC-08 reconciliation. Phase 50 remains unexecuted and unapproved; no readiness/publication conclusion, environment edit, reset/init, recovery reinstall or business-consumer expansion follows from this WBS-LOC-40-01 closure.

## Verified bilateral configuration and mapping — 2026-10-30

### Approval, scope and source attribution

The user explicitly approved the concrete four-language root configuration, preserved default/home-base boundary, project-monkey registration and proportional verification with “同意，请执行下一步”. This closes **WBS-LOC-40-01 only**, under PRD-LOC-03/05/06, SRS-LOC-03/06/09/12 and current ATP-LOC-03/07. ATP-LOC-04 remains historical/not required, not a current pass. No business consumer, Commerce profile/flavor, runner expansion or browser/SSR acceptance campaign was implemented.

Cabloy Basic was detected from the sole `__CABLOY_BASIC__` marker. Branch: `worktree-spec-basic-cabloy-locale`; clean entry/base revision: `ef6368e35ac57cca0485ba47eb926058edae3d99`. Verification applies to the **dirty seven-file implementation/test candidate** below, not the base SHA alone. SHA-256 of the concatenated per-path binary diffs, in the displayed lexical order, is `096a8321e59264ff14c86f82bf6db8834d42250b9cee0966ed7f647d0c1a8383`. For tracked paths the input is `git diff --no-ext-diff --binary HEAD -- <path>`; for new paths it is `git diff --no-ext-diff --binary --no-index -- /dev/null <path>`. Specification, documentation, logs and derived charts are excluded from that implementation digest.

| Implementation/test path | SHA-256 of original source bytes |
| --- | --- |
| `vona/src/backend/config/config/config.ts` | `5a465cb1e9bef5186a729475a8bae160716f15964b0b2d5aed12be64b634aee3` |
| `vona/src/backend/config/monkey.ts` | `db06d6e61fb5297966a88e5069738145787212619dc4f7a90480d90c06536956` |
| `vona/src/suite/cabloy-locale/modules/locale-test/test/provider.test.ts` | `6815ee273ee89050bec2068b95d6586690c9cf1785ea441e4a22a6d45e7876ca` |
| `vona/src/suite/cabloy-locale/modules/locale-test/test/zod.test.ts` | `a35394a620f6ed771ad8ad1310f3c0d9a32e2df159459cde224292b0fcb4fcd0` |
| `zova/src/front/config/config/config.ts` | `b36bbf2724cfdf17c1826692d08fd811af56796a84bededfb58b4f3c73a324f2` |
| `zova/src/front/config/monkey.ts` | `0ed519a0ae13b661a1b5bbaccd52a574248406baebe5f4587c6619ae5ed86e09` |
| `zova/src/suite/cabloy-locale/modules/locale-test/test/zod.test.ts` | `bcf5b3c91ea02bb56225dc1a52d55d7981ab692c04f0071cccb683ed85b94e6d` |

Both home-base files were byte-compared against this base and remain identical: Vona SHA-256 `13be5f528700dda66db29647a89b8c61e4d77004f7b2f11f45f8f4765aa33814`; Zova SHA-256 `b90ce76efb55e61a3f7f8a2b9af141e1798229206bddc18e4097ad3cb68ee933`. Provider dictionaries and their accepted 1,550 entries are unchanged. The directly affected public `repo-docs/backend/i18n-guide.md` has source SHA-256 `bf67ed40e46e6e64bbccc3af30ef378b48365c1cfb3592c2d5fd302dd5a0aa09` before Markdown formatting; its final documentation checks are recorded separately below.

### Implementation and acceptance result

- Both existing roots explicitly enable exactly en-us/zh-cn/ja-jp/zh-tw. Backend default remains en-us; frontend baseline/fallback en-us retains the supported `APP_LOCALE_DEFAULT` override. No environment file was read or changed.
- The backend project monkey was created with the supported `npm run vona -- :init:appMonkey` command. Its `appStart` registers the complete en/zhCN/ja/zhTW map after moduleLoaded. Real startup exposed that the project monkey is directly instantiated without an injected `this.app`; the bounded repair uses existing `useApp()` and `app.config.locale.default`, without core/template changes. SRS/WBS/test guidance reflects this source-backed accessor correction, not a different lifecycle or activation scope.
- Existing frontend `AppMonkey.appInitialize` registers the same map only inside `process.env.CLIENT`, using `this.sys.config.locale.default`. Both maps replace the earlier baseline map. Providers remain data-only and registration is never per request.
- **ATP-LOC-03 current increment: passed.** Actual managed backend startup asserts the four enabled keys/default; frontend imports the actual root function and asserts absent/empty/English/Japanese environment-override inputs. Existing backend policy fixtures and frontend loader/policy/config-replacement tests also pass, preserving installed-but-disabled and replacement semantics without restoring a test-only enablement switch. Prior menu/browser framework proof retains its original source scope; no new browser result is inferred.
- **ATP-LOC-07 current mapping increment: passed.** Both stacks validate actual `z.string().min(2).safeParse('x')`, asserting one `too_small` issue and exact installed-Zod messages in all four languages. Each backend scoped operation owns a separate `mockCtx(...)`; no registration occurs inside those contexts. Missing/unsupported selections resolve to the configured English default. Frontend uses actual `AppLocale`, `AppUtil`, home-base and project-monkey classes with minimal existing-style fixture owners: Japanese falls back to English before project registration, all four mappings work afterwards, and server-side project initialization neither calls the adapter nor changes the callback. This is source-level adapter/config initialization proof, **not** a mounted browser, full frontend startup or SSR-validation equivalence claim.

### Commands and primary artifacts

Commands below used child-scoped Node **24.11.0**. Successful producers and sanitizers each exited **0**; failed attempts are retained separately. Commands are root-relative unless a working directory is explicit.

| Actual procedure | Observed result | Artifact |
| --- | --- | --- |
| `npm run vona -- :init:appMonkey` | Supported generator created the backend project monkey | [Generation](./artifacts/20261030-app-monkey-generation.txt) |
| `npm run test -- 'locale-test/test/*.test.ts' 'test-vona/test/locale.test.ts'` | 19 passed, 0 failed/skipped; actual application startup and scoped validation | [Backend passing rerun](./artifacts/20261030-backend-mapping-attempt2.txt) |
| From `vona`: `SWC_NODE_PROJECT=tsconfig.json node --import=@swc-node/register/esm-register --test ../zova/src/suite/cabloy-locale/modules/locale-test/test/zod.test.ts` | 2 passed, 0 failed/skipped; existing installed SWC loader handles transitive TSX imports | [Frontend mappings](./artifacts/20261030-frontend-mapping-attempt2.txt) |
| `node --experimental-transform-types --test zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts` | 14 passed, 0 failed/skipped | [Existing frontend regressions](./artifacts/20261030-regression-style.txt) |
| `npm run format -- <seven implementation/test paths>` followed by `npm run lint -- <same paths>` | Final scoped formatting/lint passed | [Final source style](./artifacts/20261030-source-style-final.txt) |
| `npm run build:zova:admin && npm run build:zova:web && npm run deps:vona && npm run tsc:zova && npm run tsc:vona` | Both Basic SSR/REST pairs, dependency synchronization and both native typechecks passed | [Paired builds and types](./artifacts/20261030-paired-builds-types.txt) |
| `npm run docs:build` | First build passed; rerun after correcting backend `useApp()` guidance also passed | [Initial docs build](./artifacts/20261030-docs-build.txt), [final guidance build](./artifacts/20261030-docs-build-final.txt) |
| `npm run spec:check -- cabloy-locale` | Authority-first amendment audit passed; final status/chart checks recorded below | [Initial authority audit](./artifacts/20261030-authority-audit.txt) |

### Failures, cleanup and privacy

- The [first managed startup](./artifacts/20261030-backend-mapping.txt) exited 1 on undefined `this.app.util`. Replacing that access with supported `useApp()` resolved it; the 19-test rerun passed. The failed run `20261030093512-d0a095cf` deliberately retains its `.app-test-*`, `.vona-test-*` and `.vona-test-claim/*.json` resources for inspection; their presence was checked. They were not manually deleted or reset. Passing run `20261030093702-4be38615` logged graceful shutdown, and all three corresponding paths were checked absent. Tests own no persisted business fixtures; managed startup owns disposable database/Redis/runtime resources.
- The [first frontend invocation](./artifacts/20261030-frontend-mapping-attempt1.txt) used an incorrect `npm --prefix vona exec -- node ...` form: it warned that `node@26.13.0` would be installed and then could not locate the test. It did not run the intended tests and is not a supported verification result. The corrected direct Node command in the actual Vona working directory uses installed SWC and Node 24.11.0. No package/lockfile change or dependency reinstall is part of this delivery.
- [Initial formatting](./artifacts/20261030-source-style-attempt1.txt) failed on the new frontend test; scoped formatting fixed it. The [regression/style attempt](./artifacts/20261030-regression-style.txt) passed all 14 tests and format, then failed lint for missing blank lines after nonempty lifecycle methods. Those two blank lines were added; the final style run passed. Failures remain visible rather than replaced by passing output.
- Diagnostics include Node experimental-transform warnings, experimental TypeScript 7 API warnings, a pnpm cross-volume store warning and docs chunk-size warnings. These do not make the successful commands failures, nor are the logs described as warning-free.
- Both streams were path-sanitized before capture. Manual review found ANSI control bytes causing the bounded checker to report `BINARY`, and an uncovered local pnpm store root. Only the freshly authored current-run logs were presentation-normalized (ANSI removed and explicit `<PACKAGE_STORE>` mapping applied); original commands, messages and failures were preserved, historical artifacts untouched. Explicit path checks then passed for all new logs. The checker is bounded path recognition, not secret scanning or ATP acceptance. Manual review found no retained credentials, tokens, live provider identifiers or customer/payment data.

Final record checks passed: `npm run spec:check -- cabloy-locale` (32 definitions), `npm run spec:charts -- cabloy-locale`, `npm run spec:charts:check -- cabloy-locale` (English, 4/6 active verified) and `git diff --check`; producer/sanitizer exits were separately 0. See [final record checks](./artifacts/20261030-final-record-checks.txt). These are authority/model/freshness checks, not runtime acceptance or successor authorization. The final guidance build's ANSI-only checker exclusion was normalized in the same presentation-only manner; final explicit evidence-path checking covers all current-run logs.

WBS-LOC-40-01 is **verified** for the current configuration/mapping scope. Phase 50 / ATP-LOC-08 reconciliation is not executed or passed here; predecessor proof is now available, but its separate execution approval remains absent. No commit/push, environment change, reset/init, recovery reinstall, publication or unrelated cleanup occurred.

## Current bilateral configuration and mapping scope — 2026-10-30

This subsection records the authority-first state before execution. The verified result above supersedes its pending-status statements; original scope/approval and historical evidence remain retained.

The user's correction retains frontend/backend language configuration and Zod mappings without an actual business consumer. The latest narrow approval additionally settles existing Basic root configuration and project-AppMonkey placement and separately approves bounded WBS-LOC-40-01 execution. This supersedes only the former two-language enabled-set constraint: existing `vona/src/backend/config/config/config.ts` and `zova/src/front/config/config/config.ts` enable exactly en-us/zh-cn/ja-jp/zh-tw, baseline/fallback en-us with supported frontend override preserved. Both home-base registration files remain byte unchanged. Register all four en/zhCN/ja/zhTW factories in the approved new supported backend `vona/src/backend/config/monkey.ts` AppMonkey.appStart after moduleLoaded and existing frontend `zova/src/front/config/monkey.ts` AppMonkey.appInitialize inside process.env.CLIENT, using each root default. Placement/root-wide activation scope and execution approval are no longer open gates. WBS-LOC-40-01 is in-progress as approved work begins, not verified; this spec amendment records no current implementation-complete or ATP pass. WBS-LOC-50-01 remains blocked pending verified ATP-LOC-03/07 configuration/mapping proof and separate execution approval, not consumer proof. ATP-LOC-04 is not required current scope and not passed. No Commerce profile/flavor, runner extension, business page, schema/draft flow or SSR/browser matrix is required. Phase 50, commit/push and release are not authorized; [current progress](../../progress.md) owns the handoff and main execution will retain actual verification separately.

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
