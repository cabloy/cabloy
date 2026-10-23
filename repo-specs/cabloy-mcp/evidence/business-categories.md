# Categories → products → detail: bounded business evidence

## Historical disposition (2026-10-23)

The Commerce-backed public Category increment from `059c5779d3` is withdrawn/removed; its Commerce requirements, delivery and acceptance supplements are no longer current authority. The [independent mcp-test migration](#independent-mcp-test-migration-2026-10-23) owns the current three-tool journey. Pre-existing Commerce public Product APIs remain unchanged. Earlier Category successes, failures, commands and source hashes below are preserved as revision-bound historical evidence, not current authority or fresh verification of this removal.

## Authority, revision and outcome

On 2026-10-22, the user explicitly approved the combined authority amendments, public category contract, exactly-three-tool local exception and finite execution plan. The [accepted extension](../decisions/0002-mcp-transport.md#accepted-three-tool-category-extension-2026-10-22), [MCP proof supplement](../test-plan.md#approved-three-tool-category-proof-supplement-2026-10-22) and [historical/superseded Commerce public Category proof](#historical-disposition-2026-10-23) controlled that historical increment. `zhennann` is the accountable reviewer/evidence custodian.

Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, base `6d04bab6f046329a881cfc7b46d01b29d4412f6a`, attributable dirty worktree. Earlier local-runtime source remains uncommitted and is preserved; the full dirty tree must not be attributed only to category work. Results are not reproducible from the base alone.

The independently bounded business increment is delivered: public categories → returned category ID → exact-category product search → returned product ID → detail. It contributes partial evidence to WBS-MCP-20-01/30-01/40-01 and the linked Commerce catalogue increment. MCP parents remain blocked, full ATPs open and verified **0/12**. Historical [two-tool runtime proof](./commerce-local-entry.md) remains intact; its factory/test/guide hashes and 11-test result are historical, not proof of the category extension. The current 20-test and actual three-tool results below supersede those aspects for this increment only.

## Delivered boundary

- Separate public `GET /commerce/catalog/category/public`; existing Admin category actions retain system-admin authorization. Ordinary model scope, server-owned `published: true` before count/paging, stable `id ASC`, explicit columns and DTO projection: `id`, `name`, optional `description`.
- Only `pageNo`/`pageSize`, positive integers, defaults 1/20, cap 100. MCP checks raw JSON number types before the existing strict DTO validator; unknown/control arguments are denied. Envelope retains string `total` and ordinary pagination fields.
- Flat directory: published empty categories and categories with only unavailable products are visible. No parent/tree/count/inventory-derived category filter or ancestor policy. Existing product filtering/availability/pagination remains unchanged.
- `commerce_categories_list` joins the existing product search/detail tools in the same business factory and root runtime, fixed guarded `performAction(..., innerAccess: false)`, safe errors and DTO-validated structured/equivalent text output. No new transport, registry, profile, context or lifecycle foundation.
- Existing ordinary per-request context, fixed default instance, loopback-only ingress, modern protocol `2026-07-28`, single-active/no-queue, 16 KiB input, 1 MiB output, actual 2/10-second receive/execution deadlines and settlement/drain ownership remain unchanged. Cancellation signaling is not SQL cancellation proof.
- No entity/model/schema/seed/fileVersion change, frontend page/state owner, production OAuth/protected tool/remote exposure, main edit, environment-file read/edit, manual reset, process takeover, reinstall, commit or push.

## Retained failures and corrections

1. First managed run: 20 tests, 18 pass/2 fail, `31228.607167` ms, producer/filter/sanitizer `1 0 0`. Both MCP journeys expected the wrong managed seed name `HomeKitchen`; actual read-only seed is `Home & Kitchen`. Corrected assertions, no seed edit. Category controller regression passed.
2. Second run: 20 tests, 19 pass/1 fail, `31078.714708` ms, stages `1 0 0`. Numeric string `{ pageNo: '1' }` was accepted. Vona's installed Zod query adapter coerces even ordinary `z.number()`; strict DTO parsing rejects unknown keys but does not prevent this coercion.
3. Temporary strict-object `.pipe($schema(...))` failed native typechecking with `TS2345` at `businessTools.ts(102,11)`: DTO input `unknown` was incompatible with the inferred object pipeline input. Static stages `1 0`; runtime did not execute in that stopped chain.
4. Separating strict-object and DTO parsing still coerced: 20 tests, 18 pass/2 fail, stages `1 0 0`, business and actual HTTP numeric-string negatives failed. Inspected `vona/packages-utils/zod-query/src/lib/query.ts` and `vona/packages-vona/vona-core/src/lib/utils/zod-enhance.ts`; removed the ineffective temporary validator and added the minimal raw `typeof` guard before DTO validation. Existing product behavior/global framework adapters were not changed.
5. Initial MCP authority audit rejected eight foreign Commerce IDs as undefined local references. Replaced new bare foreign references with descriptive cross-suite Markdown links, not new local definitions. MCP audit then passed with 68 definitions.
6. A chart `--help` probe exited 1 with usage because that option is unsupported. It was not chart validation; normal root chart commands are used separately.

Failed managed runs retained their runner-owned resources; no manual cleanup/reset was performed. Historical failures are not erased by later success.

## Final managed/static verification

```sh
SERVER_LISTEN_DISABLE=true npm run test -- src/suite/a-commerce/modules/commerce-catalog/test/catalog.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts
```

Both producer streams passed through Node `stripVTControlCharacters`, then `npm run --silent evidence:sanitize`, with `pipefail` and immediate Zsh `pipestatus` capture. Manually minimized observed projection:

```text
catalog.test.ts: public category scoped pagination/projection/visibility/Admin-denial case passed
businessTools.test.ts: seven business cases passed
commerceLocalHttp.test.ts: real category → search → detail and retained ingress/deadline/drain cases passed
App shutdown gracefully
tests 20
suites 4
pass 20
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 34882.380958
test_pipeline_stages=0 0 0
root_exit=0
```

Normal flavor, better-sqlite3, managed isolated Redis/runtime resources. Scoped tests own `mockCtx(...)`; stateful suites explicitly use `concurrency: false` and the existing `a-commerce` lock. Shared seeds are read-only. New hidden/empty/unavailable-product fixtures are precisely deleted in `finally` in reverse dependency order; the foreign-instance fixture owns its own context/finally. Historical catalogue tests retain their existing disposable-run fixture behavior, not a new cleanup claim. No `TEST_CONCURRENCY=false` or raw runner.

Both affected native module checks exited 0:

```sh
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/a-commerce/modules/commerce-catalog/tsconfig.json
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
```

Final `oxfmt --check` and `oxlint --disable-nested-config` over the three category DTOs, category controller/service/catalog test, business factory/two MCP tests, Zova matcher and two generated category helpers passed, exit 0 (12 matched files). No source bytes were changed by these final checks.

## Generated contract and paired synchronization

Executed serially, all root exits 0; each producer/ANSI-filter/path-sanitizer pipeline was `0 0 0`:

```sh
npm run contract:generate:isolated -- commerce-catalog
npm run build:zova:commerce
npm run deps:vona
```

The generation owner used isolated test-mode Vona/allocated loopback Swagger, then existing Zova generation and metadata, followed by graceful shutdown. No fallback to ordinary dev Swagger or environment override. Generated category API/schema helpers, metadata and OpenAPI expose the approved operation/item/envelope/pagination. Existing product helpers and their operation/referenced-response definitions remain unchanged.

The generator also refreshes the full source OpenAPI snapshot: `operations.match` constrains helpers, not all `types.ts`/component schema output. Its 622 additions/384 deletions are not purely category changes. Scoped comparison to committed backend `HEAD` attributes passport `instanceId`, role `builtin`, SKU `available`, refund `await_webhook`, student bulk/content/Markdown, training-record string `studentId` and layout-profile operations to already-existing committed source. The dev-only mock authorization controller remains in source but is absent from the test-mode snapshot. Ordering/inferred-schema hashes also changed. This is generated catch-up/mode selection, not new authored business scope; no generated hand patch.

Commerce batch successfully ran Web SSR, Admin SSR, Web REST and Admin REST before Vona dependency synchronization. SSR client/server timings were 3.72/2.99 seconds (Web) and 3.40/3.03 seconds (Admin). Sync reported lockfile up to date; no tracked `vona/pnpm-lock.yaml` or `vona/package.original.json` drift was observed. A local store-location warning was manually omitted from retained output; no store configuration was changed.

## Actual documented external client and TTL

```sh
npm run mcp:commerce:local -- --seconds 60
```

A separate process extracted only the allocated loopback URL and ran the public guide's exact Bash curl/jq blocks in order with `set -euo pipefail` and `MCP_URL` supplied. No hardcoded category/product ID, in-memory substitute or alternative server. It required no protocol/tool errors, exact discovery/tools, returned category/product identity equality and equivalent structured/text results. Only this minimized result is retained:

```json
{
  "client": "documented curl+jq blocks",
  "discover": "complete/private/ttl0",
  "tools": ["commerce_products_search", "commerce_product_detail", "commerce_categories_list"],
  "categorySearchDetailIdsMatch": true,
  "textEquivalent": true,
  "exit": 0
}
```

The actual 60-second serving TTL expired normally, `App shutdown gracefully` was observed, `category_launcher_stages=0 0 0`, root exit 0. The managed owner returned successfully; this is not an independent audit of all external-resource deletion, interruption cleanup, SQL cancellation, Inspector compatibility or production acceptance. The SDK's existing fixed JSON-notification warning remains; no subscription/notification behavior was introduced.

## Source attribution

SHA-256 values refer to source bytes, not sanitized log bytes:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-commerce/modules/commerce-catalog/src/controller/category.ts` | `3003499b5f593fe157ec637eb23b8c05ecb2c57796d8173705cee80127664d03` |
| `vona/src/suite/a-commerce/modules/commerce-catalog/src/service/category.ts` | `946c04327a47300f7a907bc79d1cfdb52b0f4b15286d2631eee336fcf23223eb` |
| `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/categoryPublic.tsx` | `308c4a612333c219dbcb0b53d33d298a3dbf3074686d8e1eec5fdd24c8444fbb` |
| `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/categoryPublicSelectReq.tsx` | `5e8c357aafe44ea9cc4ce47680b5232336bfdad87d1d66413f7f5655b5dba673` |
| `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/categoryPublicSelectRes.tsx` | `014300d83cfae9cee0aa8c968ba90e3bb12357bc650ec44e4d182574fff4119b` |
| `vona/src/suite/a-commerce/modules/commerce-catalog/test/catalog.test.ts` | `7bc5a98a2cfa207e210a25bdf89da91fbed47d3f62812719acbae67f00c60180` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts` | `89223b50c02ecf50bd28612c6a30b0d01c24c8090b056fb6fbe24f9dbe7646f4` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts` | `51f4e4da22d24e6c61b1dacf6af61b68ecf5eb43a6c49a3db2f3575aa94d2e94` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts` | `7a4accf208d128e079395d8c747aa64418804a1f805bd50144349ee896831fa6` |
| `zova/src/suite/a-commerce/modules/commerce-catalog/src/api/openapi/types.ts` | `ef53882389eacf65ebc53e788aa0f8f43b48484acd591c02e0efcdef0b07eaff` |
| `zova/src/suite/a-commerce/modules/commerce-catalog/src/api/openapi/schemas.ts` | `e332d59e24be2834e32aa32d0930a009bb6522bd6acf9aa181f55135c74427db` |
| `repo-docs/backend/mcp-commerce-local.md` | `3d9dfec3b61947b2e73c45de6e52067266303c1bc6e85c746ce4592b5f1267da` |

Connected dirty-source diff SHA-256: `4b391822e94595c29e98f66b5625f65918e452de29207e1d95cccaa0c6e9f6b6`. Input: `git diff --binary HEAD --` over the sorted 21 paths consisting of root `package.json`, `scripts/runCommerceMcpLocal.ts`, public guide; catalogue metadata/controller/service/three DTOs/catalog test; MCP runtime `commerceLocal.ts`, business factory, `commerceLocalTransport.ts`, two tests; Zova matcher/metadata/two category helpers/OpenAPI schemas/types. Then append each selected untracked file in sorted order as NUL + relative UTF-8 path + NUL + bytes. Excludes authority/evidence/progress/charts. Includes carried local-runtime source for connected attribution, not a claim those files were newly authored here or an apply-ready patch.

## Documentary checks and limits

- Public docs build passed, `build complete in 10.94s`, producer/filter/sanitizer `0 0 0`; existing chunk-size warning only. Public guide navigation and relative reference link checked.
- MCP authority audit after cross-suite-link correction: exit 0, 68 definitions. Commerce audit: exit 1, 138 definitions, 16 existing legacy chain gaps (WBS-10-01/20-01 incoming/outgoing; WBS-80-00 outgoing; SRS-DAT-03/04 and SRS-PAY-04/05 incoming/outgoing; SRS-UI-01 and SRS-NFR-03/04 incoming). No unrelated authority invented to clear them.
- Final `spec:check` reruns preserve the same outcomes: MCP 68 definitions, exit 0, producer/sanitizer `0 0`; Commerce 138 definitions, the same 16 legacy gaps, exit 1, stages `1 0`.
- After progress/evidence links, `npm run spec:charts -- cabloy-mcp` / `spec:charts:check` and the corresponding `a-commerce` commands all exited 0, stages `0 0`. English charts retain MCP 0/12 and historical Commerce 23/23 verified; these counts do not accept this increment, repair legacy chains or upgrade historical CI proof.
- Final documentary formatting check exited 0 (12 matched files; formatter-ignored evidence manually reviewed), scoped `evidence:check` over this record/evidence index/both progress records/public guide exited 0, and `git diff --check` exited 0. Generated chart bytes were unchanged. No commit/push.
- Path sanitation is path-only, not secret scanning or acceptance proof. Retained projections are manually reviewed: no machine paths, private run/claim/database identities, process IDs, credentials or full business rows. Tool-generated raw startup output is not incorporated into this retained record.

## Independent mcp-test migration (2026-10-23)

### Authority and delivered scope

The user explicitly approved moving test business out of Basic's `a-commerce` and into same-suite `mcp-test`, then approved the finite execution plan. The [ownership disposition](../decisions/0001-mcp-suite-boundaries.md#accepted-independent-test-business-ownership-2026-10-23), [local transport migration](../decisions/0002-mcp-transport.md#accepted-independent-mcp-test-migration-2026-10-23) and [bounded proof supplement](../test-plan.md#independent-mcp-test-proof-2026-10-23) control this increment. Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, clean base `9f98519ebec9e025197d92005916e02f918e459a` followed by attributable migration changes, including new untracked module files. Base alone cannot reproduce these results. `zhennann` remains the accountable reviewer/evidence custodian.

Delivered: dev/test-only `mcp-test` owns immutable synthetic catalog fixtures, eight DTOs, public controller/service, the moved three-tool factory, local transport/runtime and business/HTTP tests. Dependency direction is only `mcp-test → cabloy-mcp`; core exposes the existing generic body/ingress helpers without changing their implementation. Fixed guarded actions are `/mcp/test/catalog/categories`, `/mcp/test/catalog/products` and `/mcp/test/catalog/products/:id`, with `innerAccess: false`. Existing `commerce_*` tool names/order and payload shapes are compatibility identifiers, not Commerce dependencies. No Commerce imports/routes/services/seeds/test locks remain in the migrated business composition.

Only actual request context for default instance `''` sees fixtures; other real instance contexts see empty/absent results. This is fixture scope, **not persisted ORM tenancy proof**. Publication/active/positive-availability filtering, stable pagination, fresh safe product/SKU projections and optional JSON omission are tested. No Entity/Model, table, seed, migration, fileVersion, shopping write, frontend owner or contract generation was added.

The actual canonical launcher is `npm run mcp:test:local -- --seconds 60`; legacy `mcp:commerce:local` points to the same single script. Its child environment merges `a-commerce` into `PROJECT_DISABLED_SUITES` for preparation and runtime. Runtime fails closed unless `mcp-test` and core are present and `commerce-*`/dependent `test-pay` are absent from `app.meta.modules`. Tests assert this actual composition when the exclusion is selected; this is not just a selected-file or import-search claim. Installed Commerce packages/shared typings are not removed.

Modern `2026-07-28` and stateless legacy SDK behavior, protocol/query isolation, fresh scoped contexts, loopback ingress, credential/selector rejection, one-active/no-queue, 16 KiB input/1 MiB output, deadlines, actual-work settlement/drain and managed TTL ownership remain intact. No production/OAuth/remote exposure, credentials, environment-file edits, main edits, reset/manual cleanup/process takeover, dependency upgrade, paid model call, commit or push.

### CLI wiring and retained failures

CLI module/bean scaffolding, `npm run vona :tools:metadata mcp-test` and `npm run deps:vona` exited 0. The approved generator's required local dependency preparation ran: `vona/pnpm-lock.yaml` gained 22 lines for local app/suite/module wiring and exact existing SDK versions (`server` 2.3.0, `node` 2.1.1); no package versions upgraded. Existing peer/deprecation/store warnings did not cause a configuration change. No dependency recovery/reinstall was initiated.

Failures retained, not hidden by later passes:

1. First new catalog run exited 1: 3 tests, 2 pass/1 fail, `2587.809125` ms. DTO parsing normalizes numeric fixture identities to strings; raw-controller/parsed deep equality was an incorrect assertion. Corrected that assertion while retaining schema validation and explicit content/projection checks; no DTO coercion change.
2. First combined Commerce-excluded run exited 1: 42 tests, 41 pass/1 fail, `27363.1585` ms. Existing `ingressProxy.test.ts` explicitly requires no suite exclusions, so `suite_exclusion_not_selected` failed. All new business/HTTP cases passed. Did not weaken the qualification: reran it separately under its original full composition.
3. Scoped lint rejected copied-array `.sort()` in the new pagination helper. Changed to `list.toSorted(...)`, then lint/types and final managed tests passed.
4. A directory-scoped formatter incidentally changed two SQL-string quote styles in unrelated `existingReadyBoundaryIntegration.test.ts`. Precisely restored those assistant-created changes; final diff for that file is empty. Final checks target changed/new paths only.

Failed managed runs retain their runner-owned resources; no manual reset or cleanup. Successful test/smoke roots return normally through the managed owner; that is not an independent audit of external-resource deletion or interruption cleanup.

### Final managed and static checks

```sh
PROJECT_DISABLED_SUITES=a-commerce SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/catalog.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/config.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts
SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/ingressProxy.test.ts
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/mcp-test/tsconfig.json
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
```

All four root commands exited 0. Final-source combined result: **41 tests/6 suites, 41 pass, 0 fail/cancelled/skipped/todo**, `26235.824125` ms. Breakdown: catalog 3, business tools 7, local HTTP 8, configuration 17, transport guards 6. An earlier corrected combined run also passed 41/41 (`26377.675459` ms), before the final lint-only pagination change. Stateful suites explicitly use `concurrency: false`; scoped operations own `mockCtx`, prototype fault injection owns the `mcp-test` lock/restoration in `finally`; static fixtures require no persisted-resource cleanup. No `TEST_CONCURRENCY=false` or raw runner.

Separate unchanged ingress-proxy qualification: **1 test, 1 pass/0 fail**, `54.0285` ms, included startup proxy matched/wrapped/transparent, 2 calls, close and listener restoration observed. Graceful app shutdown observed for successful runs. Final scoped oxlint and oxfmt checks exited 0 (36 formatter-matched source/config/authority/guide files); no unrelated core-test change remains.

### Actual native client, composition and TTL

A separate parent/client process spawned the real canonical root command with a 60-second TTL and privately extracted only its allocated loopback URL. The already-installed native SDK 1.29.0 client connected with nonempty roots/sampling/elicitation capabilities, listed tools, then called categories → returned Electronics category ID → product search → returned product ID → matching detail. No hardcoded identity, alternative server, sleeps or retry loop. It recursively resolved each tool schema's local component references, checked that Commerce schema identifiers were absent, and checked structured/text equivalence. Alias equality was checked from root scripts, without a second concurrent server. Observed minimized output:

```json
{"client":"installed native SDK 1.29.0","tools":["commerce_products_search","commerce_product_detail","commerce_categories_list"],"returnedIdChain":true,"textEquivalent":true,"schemaRefsResolved":true,"noCommerceSchema":true,"aliasSameLauncher":true,"clientExit":0}
{"launcherExit":0,"signal":null,"graceful":true,"cleanupFailure":false}
```

The client closed before awaiting the launcher's normal TTL; the parent exited 0. Graceful app shutdown and no cleanup-failure marker were observed. Runtime composition assertions executed before listener binding, proving this actual example ran without Commerce. This is native SDK/business/TTL proof, not a real-Claude rerun, complete cleanup audit, SQL-cancellation or production/full-ATP acceptance. The earlier real-Claude record remains historical Commerce-backed evidence; real-Claude proof for the migrated module is separately pending.

### Migration source attribution

SHA-256 values identify final source bytes, not logs:

| Repository-relative file | SHA-256 |
| --- | --- |
| `package.json` | `7a864b9b2b4aa179eb16f9c68d342461aca3d15b6fe0faa9c7f9dd2491bae6f3` |
| `scripts/runCommerceMcpLocal.ts` | `375e7b7b7402dd1bd10600b513e081a180ed74c2f531529c4127d685b4a753ba` |
| `vona/pnpm-lock.yaml` | `077212b1cda8d8549607a7e2311b3b7a1a77580a1355bb905e5596b0afb68174` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/index.ts` | `ff6f66f7d35f770566dc6a747f999dd29ecb1df998eb06dfd30290df071bf865` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/package.json` | `1ef53f77753d26be49a4788ae25dfb7062f84711f2dff8fb96e00550394bf83f` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/runtime/local.ts` | `658374ac8d4efcb3342a00d741383329564bbad5c59b2ec4fe195ae70609e1c7` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/.metadata/index.ts` | `9596676feda8ae5a8e05297eb16646647052ebb7140deb3648541ade967a5ddb` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/controller/catalog.ts` | `67b9d33285a821924109920b6df198f471ccf639257a70b253f7231bf516f8b2` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/service/catalog.ts` | `991e2c2115781191f1e515b3530d149fda3618b993ab8f322ac422dc208bf421` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/catalogFixtures.ts` | `ae9ded3b8b3bff91d2abcb7c0ddc8b14d2d063d63177fc766ba051fc3f762d05` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/businessTools.ts` | `3ab82d4444f6b1c3289107436499e7bfe91f3e587152d639fb1940446c2c99ae` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/localTransport.ts` | `fefa3d9458273d7e81e1dab425f746aa6e2a42c5966e72295016b3fc9582e8b1` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/catalog.test.ts` | `9cc344daabe7de61888db6a2bf5a5a90745bb17a0ed4316aa623951e6b6d096a` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `e75f3362f3bb86439dcc26a66a2065749a8cb515cb0123bbb0bf5c0ff07fe38e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts` | `a8704fb33d0105de42249753bfc0938573f9504d9d7b8573ea2e2ead069aad59` |
| `repo-docs/backend/mcp-commerce-local.md` | `f183790b40fa53e24fad9ab9e1a6587b8fe18f9f2524b6b5cfc66e3e8676cc68` |

Connected migration diff SHA-256: `a858ca0757bcc3cba1e8520d591ddbb1146d0148ca2a4392ba327bde1e34bb2e`. Input: `git diff --binary HEAD -- package.json scripts/runCommerceMcpLocal.ts repo-docs/backend/mcp-commerce-local.md vona/pnpm-lock.yaml vona/src/suite/cabloy-mcp`, then all 23 `git ls-files --others --exclude-standard` files under those selections, sorted, each appended as NUL + repository-relative UTF-8 path + NUL + file bytes. This includes all eight DTOs, generated tracked metadata, suite references and moved-file deletions. Authority/evidence/progress/charts and ignored generated/dependency output are excluded; not an apply-ready patch. `git diff --exit-code -- vona/src/suite/a-commerce zova/src/suite/a-commerce` exited 0: no Commerce source changes.

### Documentary checks and bounded handoff

Public docs build exited 0 (`10.02s`, existing chunk-size warning only); navigation retains the stable guide path with its current Local MCP Test Catalog title. MCP authority audit passed, 68 definitions. No frontend consumer/generation/build is required for this backend-only static example. Evidence-path tooling covers recognized checkout/home/temp roots, not every possible absolute path or secrets; retained projections were manually minimized/reviewed without startup logs, machine paths, private run/database/claim identities, process IDs, credentials or full rows.

Post-update authority audit exited 0 (68 definitions). `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` exited 0, English charts/0-of-12 unchanged. Initial evidence-check invocation omitted the tool's required operand separator and exited 2 (`INVALID_USAGE`), so chained checks did not run. Corrected `npm run evidence:check -- --` over this record, evidence index, progress, suite README and public guide exited 0. Documentary formatter check passed two matched files (evidence is formatter-ignored and manually reviewed); subsequent whitespace check found an extra EOF blank line in this appended record, removed without source changes. Corrected final evidence-path and `git diff --check` reruns exited 0; Commerce and incidental core-test diffs remain empty. Public guide local-link existence and navigation checks passed.

The independent catalog migration is delivered as partial WBS-MCP-20-01/30-01/40-01 proof only. Parents remain blocked, full ATPs open and verified **0/12**. Historical Commerce-backed proof is preserved, not reattributed. Handoff: use the canonical local three-read walkthrough; if real-Claude proof is needed, rerun its existing finite independent-terminal procedure against this new entry. No automatic cart/checkout/payment/OAuth or foundation expansion.
