# Current Japanese Slice Proof Refresh

## Authority and Disposition

Date: 2026-10-25. Edition: Cabloy Basic. Executor: Claude Code.

Task: [WBS-LOC-20-01](../../pdp-wbs.md#wbs-loc-20-01-connect-japanese-providers-policy-and-real-consumers). Applicable proof: [ATP-LOC-01](../../test-plan.md#atp-loc-01-discover-generate-and-consume-providers-before-preload), [ATP-LOC-02](../../test-plan.md#atp-loc-02-preserve-scoped-precedence-absent-targets-and-fallback), and [ATP-LOC-03](../../test-plan.md#atp-loc-03-make-configured-items-and-default-authoritative), limited to the Japanese mechanism slice. Contracts remain PRD-LOC-01/02/03/04/06 and SRS-LOC-01/02/03/04/05/06/07/10.

After separately approving [ADR 0002](../../decisions/0002-locale-provider-resource-export.md) and specification alignment, the user explicitly approved the bounded execution dossier with “同意，请执行下一步”. It covered focused provider-export regressions, current runtime/original-language checks, typechecks, Basic Admin/Web paired builds then dependency synchronization, independent managed locale E2E, bounded repairs/reruns, and durable sanitized evidence/status updates. No adjacent WBS execution, reset/init, environment-file edits, dependency reinstall, commit or publication was authorized or performed.

**Disposition: verified for WBS-LOC-20-01's bounded Japanese slice.** The current proof below supersedes the historical dirty-snapshot results for this predecessor edge. It does not close full dictionaries, human terminology review, Traditional Chinese delivery, HMR, complete two-language SSR/validation integration, public guidance or release acceptance. Both phase-30 tasks still require separate execution approval.

## Source and Environment Attribution

- Active linked worktree/branch: `spec-basic-cabloy-locale` / `worktree-spec-basic-cabloy-locale`; all edits stayed inside that worktree.
- Base revision: `c6bbe87564acbc19af6c7667a104a3b2e71a8afc`. This SHA alone does not reproduce the dirty test/lockfile additions.
- Final implementation diff SHA-256: `0ca3d8077b0bd5a3ea8bcc412dfecc17b0b5c7e634d6166b977eec923028607b`.
- Digest input: bytes of `git diff --binary HEAD -- vona zova repo-e2e`, followed by every sorted untracked nonignored file under those roots as repository-relative UTF-8 path, NUL, original bytes, NUL. Specs/evidence/charts are excluded to avoid self-reference.
- Implementation changes are exactly two new tooling tests and the generated three-line root importer entry for the already-declared `zova-module-locale-test` workspace dependency in `zova/pnpm-lock.yaml`. Product runtime, ordinary generators, provider source, generated application source and E2E source have no diff from HEAD. No new production repair was necessary.
- Final acceptance commands used existing Node **v24.11.0**, selected only through child-scoped PATH. Initial results on default Node v24.8.0 are retained as intermediate evidence, not substituted for supported-runtime verification. No Node installation or persistent shell/project configuration change occurred.
- Local macOS/Darwin execution; managed test database dialect `better-sqlite3`, runner-owned Redis/runtime/public/listener resources. This is not cross-platform acceptance.
- Existing Sites/flavors: `basic-siteadmin` / `admin` / `cabloyBasicAdmin`, and `basic-siteweb` / `web` / `cabloyBasicWeb`, through Vona integrated SSR. No Site/admission/profile/route tuple changed.

Final changed-file SHA-256:

| File | SHA-256 |
| --- | --- |
| `vona/packages-cli/cli-set-api/test/localeMetadata.test.ts` | `638681a1f9c8114ed0f74d5d19f6c59ec06a1186f3d244738c1538bdd20d1d24` |
| `zova/packages-cli/cli-set-front/test/localeMetadata.test.ts` | `c2009cec86867390667e43d8eb038d7dff220bcd8e8c819a81435f6a25d94fa1` |
| `zova/pnpm-lock.yaml` | `a3b47d97cf5453cf5e3db28b26612dafee4895bca08650cc7d314c81783b10cf` |

## Exact Procedures and Observed Results

Commands are repository-root commands unless a working directory is stated. Each parent producer combined stdout/stderr before `npm run --silent evidence:sanitize`; Bash `PIPESTATUS` captured producer and sanitizer exits immediately. Every final row below observed **producer 0 / sanitizer 0**. Agent tooling captures also report artifact-writer status 0. Presentation normalization described below does not change those exits.

| Procedure | Actual result | Durable primary artifact |
| --- | --- | --- |
| In `vona`: `SWC_NODE_PROJECT=tsconfig.json node --import=@swc-node/register/esm-register --test packages-cli/cli-set-api/test/localeMetadata.test.ts packages-cli/cli-set-api/test/indexSnippets.test.ts ../zova/packages-cli/cli-set-front/test/localeMetadata.test.ts ../zova/packages-cli/cli-set-front/test/sourceImports.test.ts` | 14 passed, 0 failed. Six new real-discovery/full-generator provider/ordinary cases, with existing snippet/source-import regressions. Scoped formatter and lint final exits 0. | [Supported Node tooling](./artifacts/current-metadata-supported-node.txt) |
| `npm run vona :tools:metadata locale-jajp` then `npm run zova :tools:metadata locale-jajp` | Both successful; authored entrypoint/maps remain unchanged, generated provider scope has no ordinary locale helper/resource. | [Supported runtime verification](./artifacts/current-supported-verification.txt) |
| `node --experimental-transform-types --test zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts zova/src/suite-vendor/a-zova/modules/a-ssr/test/lib/ssrNavigation.test.ts zova/src/suite-vendor/a-zova/modules/a-ssr/test/lib/ssrProfile.test.ts zova/packages-utils/zova-vite/test/generateEntryFiles.test.ts zova/packages-cli/cli-set-front/test/sourceImports.test.ts` | 19 passed, 0 failed, including original English/Simplified Chinese and canonical nested-route regressions. | [Supported runtime verification](./artifacts/current-supported-verification.txt) |
| `npm run test -- 'locale-test/test/*.test.ts' 'test-vona/test/locale.test.ts'` | 9 passed, 0 failed; current registry/policy/provider and original-language tests. Graceful application shutdown; managed wrapper exit 0 includes successful owned cleanup. | [Supported runtime verification](./artifacts/current-supported-verification.txt) |
| `npm run tsc:zova` then `npm run tsc:vona` | Both exit 0 after normal CLI metadata regeneration. | [Supported runtime verification](./artifacts/current-supported-verification.txt) |
| `npm run build:zova:admin && npm run build:zova:web && npm run deps:vona` | Both flavors' SSR client/server/webserver and REST JS/types built successfully, followed by normal Vona dependency handoff. | [Paired builds and sync](./artifacts/current-paired-builds-sync.txt) |
| `npm run test:e2e -- cabloy-locale` | 2 passed, 0 failed: Web disabled Japanese redirect/menu exclusion/Chinese switch/reload and Admin menu exclusion/switch/reload, with no collected page or console errors. Graceful shutdown and managed cleanup succeeded. | [Independent locale E2E](./artifacts/current-e2e.txt) |
| `npm run tsc:vona`, then `npm run --silent evidence:check -- -- repo-specs/cabloy-locale/evidence/phase-20/artifacts/current-*.txt`, then `git diff --check` | All exit 0 after the paired handoff/E2E; current-artifact path scan complete. | [Post-sync checks](./artifacts/current-post-sync-checks.txt) |

The parent supported-verification producer chained metadata, frontend tests, managed backend tests and both typechecks with `&&`; its exit 0 therefore establishes success of each stage, not merely sanitizer success. Paired builds likewise chained all three commands. Final metadata test hashes above reflect the last lint-only expression split; runtime sources were unchanged throughout.

Generated boundary excerpt, identical after CLI regeneration on both providers:

```ts
// authored src/index.ts
export { localesProvider } from './locales/index.ts';
export * from './.metadata/index.ts';
export * from './types/index.ts';

// generated provider scope: no locale member or locale helper
export class ScopeModuleLocaleJajp extends BeanScopeBase {}
```

Both actual manifests retain `capabilities.locale: true`; the managed backend test asserts the discovered flag. Both new tooling fixtures use actual `@cabloy/module-glob` discovery and full CLI `_generateMetadata`, asserting capability propagation rather than merely inspecting a synthetic property. No `.metadata/locales.ts` is generated for these providers. Ordinary English fixtures still generate that resource, scoped type inference and their normal helper. The provider runtime map is authored, not discovered by ordinary locale generation.

## Fixtures, Assertions and Cleanup

- Actual product policy remains `items: en-us, zh-cn`, default `en-us`; installing Japanese does not enable it. Isolated config fixtures cover Japanese-enabled/default, missing dictionary, invalid policy, aliases, own-item checks, cookies/preferences/setters, request negotiation and route-menu subsets. No shared root policy was edited.
- Each stack's new tooling tests creates Japanese-only and Traditional-Chinese-only temporary provider modules without ordinary English dictionaries, plus an ordinary English target. They execute actual manifest discovery and full forced metadata regeneration twice, import the authored provider map, verify unchanged files/exports, resource/scope/helper boundaries and idempotence, and remove temporary roots in `finally`. Only formatting is disabled within these fixture generators. The zh-tw fixture is not a delivered pack.
- Frontend runtime tests use real SysModule/SysLocale, real `a-bean` manifest/MonkeySys and real Japanese/demo dictionaries with minimal container collaborators. Instrumentation reads text at the existing preload installation boundary; it is not a pre-existing business translation reader or full app startup. Client lazy `demo-basic` stays uninstalled until use, actual BeanScopeLocale reads Japanese, and later ordinary installation preserves provider precedence. SSR-mode instrumentation does not prove import laziness.
- Backend tests use actual loader/locale helpers with frozen synthetic source maps and real managed app scope facades. They assert project > provider > ordinary precedence, distinct scopes, stable provider collisions, absent-target filtering, envelope separation, English/raw fallback and no implicit zh-tw-to-zh-cn fallback. No imported dictionary mutation occurs. Managed provider/plural reads own `app.bean.executor.mockCtx(...)` and create no business records.
- Existing backend loader order remains `moduleLoading -> config -> loadLocales -> moduleLoaded`; managed reads are later supported contexts. Source inspection corroborates that order but is not advertised as an early-hook translation test.
- Browser fixtures use existing managed Admin login and configured English/Chinese policy, not Japanese-enabled browser rendering. Both original-language paths and disabled-Japanese behavior passed without page/console errors. No new identity, authorization or persistence boundary was added.
- Managed run IDs: initial `20261025113021-5f4de3be`, final backend `20261025113848-696b39ac`, final E2E `20261025114013-1249c09b`. Their `.app-test-<id>` and `.vona-test-<id>` roots were confirmed absent after successful wrapper completion. The wrapper fails if owned cleanup is incomplete; no manual resource deletion/reset/process killing was performed. Ordinary dev resources were not adopted.

## Failures, Warnings and Evidence Reconciliation

1. Initial tooling invocation from root failed with `ERR_MODULE_NOT_FOUND` for `@swc-node/register` (producer 1 / sanitizer 0). Resolving the existing loader from `vona` fixed invocation ownership; six tests then passed. Final supported-Node four-file run passed 14. The [initial tooling artifact](./artifacts/current-metadata-20261025T113005Z-18168.txt) retains the failure and reruns, including a later wrapper stopping on expected `git diff --no-index` new-file status 1 before the evidence check; direct checks then passed. No dependency reinstall was needed.
2. Scoped lint initially reported `@stylistic/comma-dangle` in both new tests. Splitting the dynamic-import URL expression fixed the test-only formatting issue; formatter, lint and all 14 tests passed under Node 24.11.0. The [supported tooling artifact](./artifacts/current-metadata-supported-node.txt) preserves both outcomes.
3. Initial parent commands used default Node 24.8.0 before the engine mismatch was noticed. Their passing results remain intermediate records: [backend runtime](./artifacts/current-backend-runtime.txt), [frontend runtime](./artifacts/current-frontend-runtime.txt), [managed backend](./artifacts/current-backend-managed.txt), [metadata CLI](./artifacts/current-cli-metadata.txt), and [typechecks](./artifacts/current-typechecks.txt). All required final procedures were rerun with existing supported Node 24.11.0. No pass on the older version is used to waive the minimum engine.
4. Builds report the existing TypeScript 7.0 native-preview API warning and a pnpm store hard-link fallback warning. Both builds and handoff still exit 0; no store/env/dependency recovery change was made. Normal `:tools:deps`/root wrappers performed their existing preparation; no explicit install, deletion of node_modules or reinstall occurred.
5. Framework/Playwright output retains ANSI SGR even with `NO_COLOR=1` (Playwright notes FORCE_COLOR). Before checking retained current artifacts, presentation-only SGR removal was applied. The escaped checkout prefix embedded in the Playwright selector was normalized to a repository-relative selector; an unrecognized machine-local pnpm-store prefix was replaced by `<PNPM_STORE>`. No diagnostic/failure/result/exit was removed. Historical `.log` artifacts were not edited.
6. All new primary results use nonignored `.txt` files; `git check-ignore` found none ignored. They remain uncommitted worktree additions because no commit was authorized. The 22 historical `.log` files remain locally present/ignored and are not claimed to have acquired repository-durable retention. Current proof no longer depends on their durability.

## Acceptance and Limits

| Scenario | Current bounded disposition | Explicit limit |
| --- | --- | --- |
| ATP-LOC-01 | Pass: real capability discovery/full generator tests, authored single-language exports preserved without ordinary provider helper/resource inference, ordinary English generation preserved, actual Japanese metadata CLI, two typechecks, preload/lazy instrumentation, actual target-scope text and managed backend plural reads. | No full vocabulary, two delivered packs, pre-existing preload business reader, complete IoC startup fixture or SSR import-laziness proof. |
| ATP-LOC-02 | Pass: real backend/frontend registration and lookup paths cover precedence, separate scopes, absent targets, global/English/raw fallback and lazy merge preservation. | No HMR edit/helper/deletion proof. |
| ATP-LOC-03 | Pass for Japanese slice: configured policy and dictionary independence, invalid-config failures, negotiation/cookie/preference/current setter/menu subset/router regressions, actual Web/Admin E2E with installed-but-disabled Japanese. | No complete two-pack runtime, Japanese-enabled browser matrix, localized schema/draft validation or full two-language request-isolation release acceptance. |

Manual review covered the complete retained current streams for machine-local paths, credentials/tokens/signed state, customer data and live provider identifiers; none remain observed. Fixtures are synthetic. Evidence tooling proves only its supported path coverage, not secret scanning or ATP authenticity. Subsequent record/chart checks are recorded in the phase index separately; no static check substitutes for runtime proof or human terminology/release approval.
