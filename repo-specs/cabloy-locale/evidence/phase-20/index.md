# Japanese Connected Increment Evidence

## Current Applicability: Proof Refreshed

The separately approved WBS-LOC-20-01 proof refresh completed on 2026-10-25. [Current revision-scoped proof](./current-proof.md) records base `c6bbe87564`, dirty implementation digest `0ca3d8077b0bd5a3ea8bcc412dfecc17b0b5c7e634d6166b977eec923028607b`, supported Node 24.11.0, six new tooling cases / 14 passing companion tests, 19 frontend regressions, 9 managed backend tests, both typechecks, paired Admin/Web SSR+REST builds then deps:vona, and 2 passing independent E2E scenarios. Final producer and sanitizer exits were independently observed as 0. New primary results are nonignored `.txt` additions; no commit was authorized.

**Current disposition: WBS-LOC-20-01 verified for the bounded Japanese mechanism slice.** The predecessor proof edge is restored; successor execution still requires its own approval. Full dictionaries, attributed language review, HMR and complete two-language integration/release proof remain open.

### Subsequent Test Removal

The user subsequently requested removal of both dedicated CLI `localeMetadata.test.ts` files as unnecessary. The files have been removed. The tooling test counts and dirty implementation digest above refer to the proof-refresh snapshot before removal; they are not claims of retained regression coverage or the current digest. Historical commands, hashes and logs remain preserved in the [proof record](./current-proof.md#subsequent-test-removal). Product runtime and generator sources were not changed.

### Current Record and Chart Checks

The [current record-check artifact](./artifacts/current-record-checks.txt) retains the final formatter, authority audit, chart generation and freshness results; its chained producer also ran scoped evidence checking and `git diff --check`. Producer and sanitizer both exited 0. The [closure recheck](./artifacts/current-closure-checks.txt) also passed after final bookkeeping, confirmed unchanged implementation attribution, and confirmed current primary artifacts are nonignored.

- `npm run spec:check -- cabloy-locale`: passed, 32 definitions and complete exact-ID chain; static planning structure only.
- `npm run spec:charts -- cabloy-locale` and `npm run spec:charts:check -- cabloy-locale`: passed, both English derived views fresh, 1/6 verified. Both SVGs were rendered together in Chromium and visually inspected: titles, task/status labels and scope counts are readable without clipping or overlap. The deterministic candidate is WBS-LOC-30-01; the progress register recommends independently verifiable WBS-LOC-30-02 instead. Neither view authorizes successor execution.
- Scoped evidence/path checks and `git diff --check`: passed. Manual sensitive-content review remains subject to the limits in the current proof; these checks are not secret scanning or ATP proof.
- The user approval remains the bounded WBS-LOC-20-01 dossier; no human terminology review, release approval or successor approval is inferred.

### Prior Applicability Review: Rerun Was Required

Review date: 2026-10-25. Source reviewed: clean commit `c6bbe87564acbc19af6c7667a104a3b2e71a8afc`, followed by approved documentation-only alignment. The remainder of this index preserves the original dirty-snapshot results and failures as history; its original closure wording does **not** establish current-implementation verification.

The user explicitly approved retaining `src/locales` + `localesProvider` and aligning the affected specifications/static checks in [ADR 0002](../../decisions/0002-locale-provider-resource-export.md). That approval does not authorize new source work or ATP execution. The current implementation differs materially from the historical digest below:

- Providers now author `src/locales` and export `resource.localesProvider`; both runtimes consume that property rather than ordinary provider `resource.locales`.
- Ordinary metadata generator sources are unchanged from the original baseline. The two `localeMetadata.test.ts` files claimed below are not present at the reviewed commit. Historical generator results therefore do not prove the revised authored-export-preservation contract.
- Corresponding backend registry/policy/managed provider tests now live under `vona/src/suite/cabloy-locale/modules/locale-test/test/`; frontend runtime tests live under `zova/src/suite/cabloy-locale/modules/locale-test/test/`. Their coverage is not presumed deleted, but historical selectors and passing results cannot be transferred to the changed source without rerun.
- All 22 historical artifact logs remain present in this checkout. They are ignored by the repository's `**/*.log` rule and are not tracked in the reviewed commits; no alternate durable location is recorded. They are not missing locally, but their repository-durable retention is not established. This update neither deletes them nor claims to repair their retention.

**Disposition at that review, superseded by the current proof above:** WBS-LOC-20-01 was `implementation-complete`, with applicable ATP-LOC-01/02/03 proof requiring rerun and bounded export-preservation regression coverage still to be established. The historical `verified` disposition remains attributable only to its recorded dirty implementation, not current source. WBS-LOC-30-01 and WBS-LOC-30-02 could not use that predecessor edge until the proof refresh.

Finite closure: under a separately approved execution dossier, verify CLI metadata/capability and authored export preservation for single-language providers and ordinary regressions; run the current Japanese registry/startup/policy/managed tests and applicable type/build/sync/browser checks; retain nonignored redacted primary results with exact revision/dirty attribution, commands, exits and cleanup. Update this index and progress after observed results. Do not require full dictionaries, attributed terminology review, HMR, or later full SSR/validation release coverage to close this specific gap. No ATP or product build was run during this documentation alignment.

## Documentation Alignment Checks

On 2026-10-25, after the explicit ADR 0002 design/documentation approval, Claude Code performed the bounded alignment at base `c6bbe87564` with only suite specifications/evidence-applicability records and derived SVGs changed. Actual commands and outcomes:

| Command | Exit | Observed result |
| --- | --- | --- |
| `npm run spec:check -- cabloy-locale` | 0 | Complete planning structure and exact-ID chain passed, 32 definitions. |
| `npm run spec:charts -- cabloy-locale` | 0 | Both English derived SVGs regenerated, 0/6 currently verified. |
| `npm run spec:charts:check -- cabloy-locale` | 0 | Both regenerated views fresh, 0/6 currently verified. |

These are static documentary results, not ATP execution, source verification, successor authorization or human terminology review. The table retains the relevant command results without publishing machine-local paths or sensitive payloads. Historical primary logs below were not modified, deleted or newly verified by this alignment. Runtime proof remains open.

## Historical Scope and Authority

- Date: 2026-10-25 (local); producer timestamps use UTC.
- Edition: Cabloy Basic.
- Task: [WBS-LOC-20-01](../../pdp-wbs.md#wbs-loc-20-01-connect-japanese-providers-policy-and-real-consumers).
- Authorization: [approved sequential dossier](../phase-10/baseline-review.md#successor-execution-dossier), following documentary closure of WBS-LOC-10-01.
- Contracts: PRD-LOC-01/02/03/04/06; SRS-LOC-01/02/03/04/05/06/07/10.
- Acceptance authority: [ATP-LOC-01](../../test-plan.md#atp-loc-01-discover-generate-and-consume-providers-before-preload), [ATP-LOC-02](../../test-plan.md#atp-loc-02-preserve-scoped-precedence-absent-targets-and-fallback), and [ATP-LOC-03](../../test-plan.md#atp-loc-03-make-configured-items-and-default-authoritative), limited to the Japanese connected slice. Full two-pack, translation, HMR, schema/validation and SSR release acceptance remains with later WBS tasks.

## Attribution

Base revision: `81610b2341d7b6723e863da1a73a69ed0e0aefb2`. The worktree is dirty with attributable implementation changes; this SHA alone does **not** reproduce the tested source.

Final implementation diff SHA-256: `46b47ab6ad9e623a43efedbb6377d60edd51aeba77557dfb5d058616a86bcf62`.

Digest input: the bytes of `git diff --binary HEAD -- vona zova repo-e2e`, followed by each sorted, untracked, nonignored file under those three roots as repository-relative UTF-8 path, NUL, original file bytes, NUL. This includes 69 changed/new implementation files, including generated provider source and workspace lockfiles. Evidence, progress and derived charts are excluded to avoid self-reference. No implementation source changed after this attribution; subsequent changes are evidence/progress/chart records only.

Changed-file scope:

- Vona CLI metadata entrypoint and `toolsMetadata/generateConfig.ts` / `generateScope.ts`, with new `test/localeMetadata.test.ts`.
- Vona core `src/lib/bean/resource/locale/{appLocale,utils}.ts`, `src/lib/framework/start.ts`, `src/lib/module/locales.ts` and its new test, `src/lib/utils/zod-enhance.ts`, and `src/types/config/{config,locale}.ts`.
- Vona root backend configuration; `a-locale` configuration, monkey and new policy test; `home-base/src/main.ts`; existing `test-vona/test/locale.test.ts`.
- Zova CLI metadata entrypoint and `toolsMetadata/generateConfig.ts` / `generateScope.ts`, with new `test/localeMetadata.test.ts`.
- Zova core `src/core/component/locale.ts`, `src/core/sys/{config,locale,module,sys}.ts`, `src/utils/zod-enhance.ts`, and new `test/locale.test.ts`.
- Zova `a-ssr/src/lib/{ssr,ssrNavigation}.ts`, `src/monkey.ts` and existing navigation test; `home-base` English/Chinese language labels; Web layout locale-menu renderer.
- Both complete new `src/suite/cabloy-locale/` suite trees and their `locale-jajp` modules; both `pnpm-lock.yaml` files; `repo-e2e/specs/cabloy-basic.spec.ts`.

CLI-backed scaffolding created the paired suites/modules, and CLI dependency preparation added their workspace lockfile importers. Generated metadata was regenerated, not hand-patched. No Traditional Chinese module, migration, API, Site/flavor, shared environment override, dev reset, publication, or commit was created.

## Configuration and Fixtures

- Product root policies remain `en-us`/`zh-cn`, default `en-us`; Japanese resources are installed but disabled.
- DB-free app/config fixtures separately enable Japanese, including a Japanese default with and without its dictionary. Explicit item-map layers replace the previous item map, so subsets and invalid empty maps remain meaningful.
- Generator fixtures discover actual manifests and execute `_generateMetadata` for Japanese-only and Traditional-Chinese-only providers without English, plus ordinary English-base modules. These Traditional Chinese fixtures are not delivered language packs.
- Loader tests use the real `a-bean` capability manifest and `MonkeySys`, plus the real Japanese provider and `demo-basic` dictionaries. New assertion instrumentation observes text at `a-bean` installation; there was no pre-existing preload translation reader. Minimal scope/container collaborators are fixtures, not a complete application boot. Client lazy assertions do not claim SSR import laziness.
- Actual `BeanScopeLocale` callbacks read contributed Japanese `demo-basic::HelloWorld` and a distinct home scope value; subsequent ordinary installation preserves provider precedence. The existing demo locale controller is the real consumer of that key. The test exercises its scope facade, not a Japanese-enabled browser rendering of that controller.
- Managed backend integration uses `app.bean.executor.mockCtx(...)`, real `test-vona` and `home-base` scope facades, Japanese interpolation/plurals and installed-but-disabled active assignment. It creates no test-owned business records.
- Managed browser tests use Vona integrated SSR on the existing Basic Web/Admin Sites and their paired artifacts, plus the existing synthetic managed Admin login fixture. Isolated runners own disposable databases, Redis/runtime namespaces and listeners. No environment identity or API origin was changed. Successful runs shut down/clean their owned resources; failed runs retain their own inspection claim. No manual cleanup/reset was performed.

## Observed Commands and Results

Commands run from the repository root unless a subshell is shown. Captured producer streams passed through `npm run --silent evidence:sanitize`. Successful sanitization does not imply producer success. Earlier commands observed producer/sanitizer exits separately; the final E2E command used `pipefail` and returned pipeline 0, establishing both stages succeeded.

| Procedure | Observed result | Retained artifact |
| --- | --- | --- |
| `npm run vona :tools:metadata locale-jajp`; `npm run zova :tools:metadata locale-jajp`; `npm run zova :tools:metadata home-base` | Targeted CLI generation exited 0; provider resources export only `ja-jp`, with no ordinary base-key scope/helper inference. | Generated provider `.metadata/locales.ts` and `.metadata/index.ts` under each new module; generator tests below. |
| `node --test vona/packages-cli/cli-set-api/test/localeMetadata.test.ts zova/packages-cli/cli-set-front/test/localeMetadata.test.ts zova/packages-cli/cli-set-front/test/sourceImports.test.ts` | 13 passed, 0 failed; producer 0, sanitizer 0. | [Generator regressions](./artifacts/generators.log) |
| `npm run tsc:zova && npm run tsc:vona` | Final two-stack rerun exited 0 after the production alias repair. | [Final typechecks](./artifacts/typechecks-final.log) |
| `(cd vona && node --import=./.vona/register.js --test packages-vona/vona-core/src/lib/module/locales.test.ts src/suite-vendor/a-vona/modules/a-locale/test/localePolicy.test.ts packages-vona/vona-core/src/lib/framework/start.test.ts)` | 13 passed, 0 failed; producer 0, sanitizer 0. | [Final backend runtime/config regressions](./artifacts/backend-runtime-final.log) |
| `node --experimental-transform-types --test zova/packages-zova/zova-core/test/locale.test.ts zova/src/suite-vendor/a-zova/modules/a-ssr/test/lib/ssrNavigation.test.ts zova/src/suite-vendor/a-zova/modules/a-ssr/test/lib/ssrProfile.test.ts` | Final 13 passed, 0 failed; includes exact nested alias and actual scope-facade regressions; producer 0, sanitizer 0. | [Final frontend runtime/router/profile results](./artifacts/frontend-runtime-final.log) |
| `node --test zova/packages-utils/zova-vite/test/generateEntryFiles.test.ts` | 1 passed, 0 failed; producer 0, sanitizer 0. | [Entry generation](./artifacts/entry-generation.log) |
| `npm run build:zova:admin && npm run build:zova:web && npm run deps:vona` | Final Admin and Web SSR/REST pairs and subsequent dependency handoff exited 0 after alias repair. | [Final paired builds and handoff](./artifacts/paired-build-final.log) |
| `npm run test -- 'test-vona/test/locale.test.ts'` | Final-source selected locale suite: 3 passed, 0 failed; producer 0, sanitizer 0; graceful owned shutdown. | [Final managed backend integration](./artifacts/backend-managed-final.log) |
| `npm run test:e2e -- cabloy-basic --grep 'ATP-LOC-03\|ATP-BASIC-SSR-01'` | Historical final run before spec extraction: 3 passed, 0 failed; retained for the original combined coverage. | [Combined browser results](./artifacts/e2e-final.log) |
| `npm run test:e2e -- cabloy-locale` | Final independent locale spec: 2 passed, 0 failed; producer 0, sanitizer 0; Web disabled Japanese/canonical redirect/Chinese switch/reload and Admin disabled-menu/switch/reload passed. | [Independent locale E2E](./artifacts/e2e-locale-isolated-final.log) |
| Scoped `oxlint --disable-nested-config` on all changed/new TypeScript/TSX | Final exit 0, no diagnostics; browser test formatting and `git diff --check` also passed. | Earlier [scoped lint](./artifacts/scoped-lint.log) contains no diagnostics; final identical check observed directly. |

The grep expression above is the regular-expression alternation `ATP-LOC-03|ATP-BASIC-SSR-01`; the backslash is Markdown table escaping, not an extra command argument.

Earlier successful build/type/runtime logs remain retained as historical intermediate results, not proof of later edits.

## Failures and Reconciliation

1. Initial Zova and separate Vona typechecks failed with TS6133: provider `.metadata/index.ts` retained an unused `locales` import after scope inference was removed. Both owning generators now omit that provider index import and preserve separate resource exports. Tests were extended, both modules regenerated through the CLI, and both typechecks passed. Original failures: [Zova](./artifacts/typecheck-zova-initial-failure.log), [Vona](./artifacts/typecheck-vona-initial-failure.log).
2. An automatic Edit hook reported `build:zova:admin` exit 1 with only a short failure excerpt and no full log path. That hook is not verification proof. Deliberate coordinated builds subsequently passed; no fuller historical hook diagnostic is available.
3. Early focused test runs exposed unsupported Node `t.mock.env`, incomplete minimal fixtures, an incorrect backend split-test import, and a canonical-path fixture expectation mismatch. These were corrected. Tests also exposed client redirect query/hash loss, repaired by explicitly preserving those fields.
4. The [first browser run](./artifacts/web-e2e.log) had 1 pass/1 failure: disabled `/ja-jp` redirected to URL path `home/indexweb/home/` (leading slash omitted here to avoid classification as a machine home-directory path), rather than `/`. Production routing has an original synthetic layout parent followed by its public-alias child. Selecting the deepest locale-bearing record with `findLast` repaired the wrong destination. The exact nested alias regression, both paired builds/dependency handoff, typechecks and final browser run passed. The failed isolated run retained its claim.
5. The [second browser run](./artifacts/e2e-rerun.log) had 2 passes/1 failure: Web now passed; Admin switched to Chinese, but its assertion reused a locator filtered by old English `Chinese`, so the translated menu no longer matched. The locator now reacquires the Chinese menu. The final three-scenario combined run passed without changing production behavior or weakening the expected locale/persistence outcome. This failed run also retained its claim.
6. After moving the two locale scenarios into the independent `cabloy-locale.spec.ts`, its first isolated run had 1 pass/1 failure because a transient duplicate Chinese SSR heading triggered strict mode during navigation. The locale assertion now selects the first matching heading; the final independent run passed 2/2. This was test-only repair; `cabloy-basic.spec.ts` has no feature diff.

## Applicable Acceptance Disposition

| Scenario | Japanese-slice disposition and actual proof | Not claimed |
| --- | --- | --- |
| ATP-LOC-01 | Pass for the selected mechanism slice: real manifest discovery and generated exports, both typechecks, provider-before-preload instrumentation, client lazy installation assertions, actual frontend target-scope facade and managed backend scoped/plural reads. | No pre-existing preload text reader, complete IoC application boot, SSR import laziness, complete translations, or two-pack runtime acceptance. |
| ATP-LOC-02 | Pass: both real registries exercise project/provider/ordinary precedence, distinct target scopes, absent-target filtering, global/en-us/raw-key fallback, and lazy ordinary registration; backend explicitly rejects implicit zh-tw-to-zh-cn fallback. | No HMR/helper/deletion acceptance. |
| ATP-LOC-03 | Pass for Japanese policy: configured enabled/default variants, dictionary-independent selection, invalid-policy errors, negotiation/assignment/cookie/menu-subset and route normalization assertions; real Web/Admin browser menu/switch/reload and disabled Japanese route proof. | No complete two-provider runtime, Japanese-enabled browser/SSR language matrix, schema/draft validation, or full cross-request SSR release proof. |

The two-pack steps explicitly assigned to later WBS tasks remain unexecuted. This disposition is not a waiver of them. WBS-LOC-20-01 is verified for this bounded Japanese slice: applicable checks have retained passing results, including final-source managed backend confirmation. This is an automated implementation/acceptance disposition by Claude Code, not human terminology review or release approval.

## Evidence Privacy and Limits

The path tool does not recognize every semantic or escaped path. Streaming sanitizer output retained ANSI terminal escapes that the file checker classified as binary. Presentation-only removal of ANSI SGR sequences made logs checkable; escaped checkout paths embedded in Playwright regex were manually converted to repository-relative paths. Producer failures/exits were not changed. The sanitizer also replaces some route-like diagnostic strings with `<PRIVATE_PATH>`; the original local Playwright context established the explicit route failure recorded above.

`npm run evidence:check -- -- repo-specs/cabloy-locale/evidence/phase-20/artifacts` passed after normalization of the final browser logs. This is path-coverage proof only, not secret scanning or ATP success. Retained content was manually reviewed for machine-local paths, credentials, signed state and real customer data; fixtures are synthetic and no such sensitive payload is retained. Final additions require the same check.

## Final Record Checks

- `npm run evidence:check -- -- repo-specs/cabloy-locale/evidence`: exit 0, including normalized combined and independent E2E logs and the final managed backend log; manual sensitive-content review completed within the limits above.
- `npm run spec:check -- cabloy-locale`: exit 0, 32 definitions and complete exact-ID chain. Static authority structure only, not human approval or ATP authenticity.
- `npm run spec:charts -- cabloy-locale` and `npm run spec:charts:check -- cabloy-locale`: exit 0, English, 1/6 verified. Both refreshed SVGs were browser-rendered and visually inspected; labels/status are readable. Direct file-document screenshot capture timed out; rendering the same SVGs inside an HTML document succeeded without chart changes.
- Scoped source formatting: 65 changed/new TypeScript/TSX/JSON files passed. Scoped lint and `git diff --check` passed; the final implementation digest remained unchanged.
- Human approval remains the recorded bounded execution approval, not a new terminology or release approval. No optional broad review, adjacent WBS execution, Git commit or publication followed closure.

## Closure Boundary

No full-feature or release claim is made. Japanese vocabulary is bounded initial content and has not received attributed human terminology review. Traditional Chinese delivery, complete inventories, HMR helper/deletion behavior, localized validation/schema draft switching, complete paired Admin/Web two-language SSR/hydration/request isolation, public guidance and release approval remain unexecuted later tasks.
