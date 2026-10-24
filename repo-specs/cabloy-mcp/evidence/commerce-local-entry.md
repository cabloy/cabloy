# Local commerce MCP entry: bounded runtime evidence

## Scope and authority

On 2026-10-22, the separately approved [local-only ADR disposition](../decisions/0002-mcp-transport.md#accepted-local-commerce-verification-disposition-2026-10-22), [WBS contribution](../pdp-wbs.md#local-commerce-verification-contribution-2026-10-22) and [test-plan supplement](../test-plan.md#local-commerce-verification-supplement-2026-10-22) authorize this connected increment. `zhennann` is the accountable reviewer and sanitized-evidence custodian. Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, clean starting base `6d04bab6f046329a881cfc7b46d01b29d4412f6a`; results below are from attributable dirty source, not reproducible from the base alone.

This contributes partially to WBS-MCP-20-01, WBS-MCP-30-01 and WBS-MCP-40-01 under PRD-MCP-ACCESS-01/03, PRD-MCP-CONTRACT-01, SRS-MCP-TRANSPORT-01/03 and SRS-MCP-DISPATCH-01/02; partial ATP-MCP-TRANSPORT-01, ATP-MCP-CONTRACT-01 and ATP-MCP-CALL-01/03 coverage only. Parent statuses stay blocked, full ATPs open and verified 0/12. The older [search](./business-products-search.md) and [detail](./business-product-detail.md) results remain historical in-memory proof, not evidence of an external endpoint. The new final-byte combined run below rechecks those business cases after the actual-work tracking change.

## Delivered path

- Root `npm run mcp:commerce:local -- --seconds 600` reuses the managed isolated unit-run owner, existing dependency prerun and normal/test metadata generator. A private preparation child uses the template register; the serving child uses the run-specific register and `createGeneralApp`.
- The serving runtime loads business decorators only after application startup. It verifies managed test identity/claim ownership and the disabled default application listener, then owns one allocated `127.0.0.1` listener. Ordinary dev/start does not install it.
- Exactly `commerce_products_search` and `commerce_product_detail`, unchanged DTO contracts and fixed guarded `performAction` with `innerAccess: false`. Each request owns a fresh ordinary context, fixed default instance `''`, `dbInfo: { level: 0 }`, native request/response and a fresh SDK server. No existing-ready bypass.
- Installed `@modelcontextprotocol/server@2.3.0` and `@modelcontextprotocol/node@2.1.1`; explicit `legacy: 'reject'`, modern `2026-07-28`, JSON responses and required JSON/SSE Accept negotiation. SDK owns wire-only completion/cache/server metadata.
- Existing strict ingress/body reader reused without behavior changes; their diff changes comments only. Synthetic fixture modes/shims/test support are not runtime dependencies. Consequently the conditional shared-helper behavior-change qualification rerun was not triggered.
- One active/no queue; exact direct-only Host/Origin/path and credential/selector denial; 16 KiB body, 1 MiB complete JSON output, actual two-second receive and ten-second execution deadlines. Abort is not SQL cancellation: actual handler promises, SDK close and executor continuation/disposal remain owned before capacity release. Response-limit failure is sanitized and propagated to the close owner rather than silently reported as success.
- At most 600 serving seconds; normal TTL stops admission, drains and closes the app before managed cleanup. Interruption/failure may retain claims/resources. No hard-kill, reset, environment change or cleanup workaround.

The [public walkthrough](../../../vona/src/suite/cabloy-mcp/docs/mcp-commerce-local.md) and API & Testing navigation provide complete modern discover/list/search/detail requests. No production/OAuth, protected tools, main/core/framework, persistence, frontend, profile/lifecycle/ORM foundation, generic registry, dependency install, commit or push was performed.

## Observed failures and corrections

1. Initial scoped static chain stopped at two curly-style lint errors; the subsequent typecheck did not run in that failed `&&` chain. Scoped fixes and runtime `stdout.write` replaced the initial style/warning sites; later complete checks passed.
2. First actual launcher, `npm run mcp:commerce:local -- --seconds 45`, failed before serving with `Error: Should not import vona module in config`, at `vona/packages-vona/vona-core/src/lib/core/resource.ts:116`. A static runtime import reached decorated commerce dependencies before app startup. The runtime now uses a type-only import and imports the adapter dynamically after `createGeneralApp` and guards. Producer/ANSI-filter/path-sanitizer stages were `1 0 0`. Failed-run resources remained managed-runner-retained; no manual deletion/reset or process killing.
3. Corrected 90-second launcher: separate Node HTTP client discover/list/search/detail passed; TTL graceful shutdown and pipeline stages `0 0 0`. Initial managed regression selection passed 10/10 (six existing cases and four HTTP groups), duration `3810.501916` ms, stages `0 0 0`.
4. Added the actual receive/execution-deadline and output-ceiling group. The first expanded run had 11 tests, 10 passed, 1 failed, no cancellations/skips/todos, duration `18890.647042` ms, stages `1 0 0`. Failure: `AssertionError [ERR_ASSERTION]: Missing expected rejection` at the expected oversized-response `close()` rejection. Inspection showed the official Node adapter catches fetch-wrapper exceptions, returns its own 500 and resolves, hiding the failure from the drain owner. The fetch boundary now explicitly marks unexpected failure and returns a bounded fixed 500; expected abort still follows cancellation handling. No SDK/framework patch or weakened assertion.
5. A 30-second launcher and exact documented curl/jq flow also passed before that last failure-ownership correction, with stages `0 0 0`. It is an intermediate checkpoint, not final-byte proof. The final-byte runs below supersede it for current applicability. All failed attempts remain historical; failed-run resources were retained by the runner.

The SDK emits its fixed `responseMode: 'json' drops mid-call notifications` warning; no dependency modification or global console interception was introduced. Tools emit no progress notifications and this entry admits no subscription/notification method.

## Final-byte fingerprints

Paths below are repository-relative except the explicitly module-relative table. No implementation/test/docs bytes changed after these fingerprints and the final static/runtime checks.

| File | SHA-256 |
| --- | --- |
| `package.json` | `17b2b6645f2afc923512b7c9e0f2929a6dff844d5de865f7461b170be6043c49` |
| `scripts/runCommerceMcpLocal.ts` | `fc476414f2ee378c62ab15797aa865ffde721867cf44ff078fab4798e0c6dc06` |
| `repo-docs/backend/mcp-commerce-local.md` | `2a04a094308145a437857e8548db43a2cfe8ef12e620e3422575ab30a5581395` |
| `repo-docs/.vitepress/config.mjs` | `446c90f30b063c8bf103387f4ede6755c5c545d4e75f73f26573a0282183a096` |

MCP-module-relative paths (`vona/src/suite/cabloy-mcp/modules/cabloy-mcp/`):

| File | SHA-256 |
| --- | --- |
| `runtime/commerceLocal.ts` | `0beacfad23aa45947aa6cf09500d91fa4223e8ee41554a9d623a82c4fd4957ad` |
| `src/lib/businessTools.ts` | `217d2f901d80bac0915696dfe2e4292693034ae9c916fa9025923ef3073f9b04` |
| `src/lib/commerceLocalTransport.ts` | `47f04634577708c57e5fbfa6f204ad74b4ba6c0e1f9671f5fa1d25f3af36f99d` |
| `src/lib/transport.ts` | `6d0ac15360d0fec1e84e7f722329b8ab2bc589df94b9fe84cafcadfdd0997421` |
| `src/lib/transportIngress.ts` | `4c76b77e2f59fd0093bbe3c73ff67f719529f2ce8153bf868c1cba7ce893ef54` |
| `test/businessTools.test.ts` (unchanged) | `bb035bd61f947514fa11c40c06a2734a5bca8f63ea5435ba2bc96b64a5f3e767` |
| `test/commerceLocalHttp.test.ts` | `46a9ce1f070aa8325fd37e4c55a6820f4e47567e3c7b4e32ac71fc202bc4c1ab` |

Connected-source diff digest: `7d260e18b64515dc030cbe9afd4082fd6af6a2584a4c4d829fdc6545de828eae`. SHA-256 input is `git diff --binary HEAD --` restricted to the eleven paths above, followed by each untracked path in sorted order as NUL + repository-relative UTF-8 path + NUL + file bytes. It excludes authority/evidence/progress/chart records, which change separately. This identifies dirty scope, not an apply-ready patch or clean-revision claim.

## Final static and managed business/HTTP verification

All three final-byte static commands exited 0:

```sh
node_modules/.bin/oxfmt --check scripts/runCommerceMcpLocal.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/runtime/commerceLocal.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/{businessTools,commerceLocalTransport,transport,transportIngress}.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts
node_modules/.bin/oxlint --disable-nested-config scripts/runCommerceMcpLocal.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/runtime/commerceLocal.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/{businessTools,commerceLocalTransport,transport,transportIngress}.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
```

Final managed command:

```sh
SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts
```

Both producer streams were piped through `stripVTControlCharacters` and `npm run --silent evidence:sanitize`, with `pipefail` and immediate Zsh `pipestatus` capture. Manually reviewed projection, excluding startup paths, private DB/claim identities, process IDs and data rows:

```text
businessTools.test.ts: six retained business regressions passed
PASS discovers the modern server and both DTO-backed tools without the default app listener
PASS searches then reads the returned identity with DTO/text projection, strict inputs and scoped absence
PASS rejects critical ingress/body ambiguity before context entry and refuses legacy negotiation
PASS keeps one active/no queue, cancels partial receipt, and drains actual held controller work on close
PASS enforces actual receive/work deadlines and rejects oversized real-read output before commitment
App shutdown gracefully
tests 11
pass 11
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 15703.26575
test_pipeline_stages=0 0 0
```

Normal flavor, better-sqlite3 and isolated managed Redis/runtime resources. Existing commerce seeds stayed read-only; no test-owned persisted fixtures were added. Stateful suites use explicit `concurrency: false` and the existing `a-commerce` lock. Direct expected controller reads own ordinary `mockCtx(...)`; HTTP requests own separate runtime contexts. Held-operation tests temporarily intercept the real service, forward to the original actual read and restore in `finally`; the oversized case changes only a returned DTO copy, not persistence/configuration. Actual 2/10-second deadlines elapsed; unfinished real work retained capacity, and close waited for its release. No uncooperative SQL cancellation/rollback or hard process-stop proof is claimed. HTTP scoped absence uses the scoped model; foreign-instance equality remains covered by the retained business regression, not an invented HTTP cross-instance probe.

No tracked `vona/package.original.json` or `vona/pnpm-lock.yaml` drift was observed after managed preparation. Earlier dependency changes already present in the base are historical, not new drift from this increment.

## Actual documented external client

Final source launch:

```sh
npm run mcp:commerce:local -- --seconds 45
```

The launcher output used the same producer/ANSI-filter/path-sanitizer pipeline and separate stage capture. A separate process extracted only the allocated loopback URL, then executed the public Markdown's exact curl/jq blocks (discover, list, search, ID extraction, detail) in Bash with `set -euo pipefail` and the URL supplied in `MCP_URL`. It parsed all four responses, required no protocol/tool errors, checked discovery completion/private/zero-TTL, exact tool names, returned-ID equality and structured/text equivalence. It retained only:

```json
{
  "client": "documented curl+jq blocks",
  "discover": "complete/private/ttl0",
  "tools": ["commerce_products_search", "commerce_product_detail"],
  "searchDetailIdMatches": true,
  "textEquivalent": true,
  "exit": 0
}
```

This is a real HTTP client of the actual command, not the in-memory transport or a duplicate fake server. Inspector/other-client compatibility is not claimed.

## Remaining evidence boundary

The bounded local entry is not production integration, OAuth acceptance, full host/tenant/Passport isolation, platform qualification or release proof. Managed startup is intentional here, not production existing-ready/no-start proof. Normal TTL and interruption remain different outcomes. Passing path sanitation does not prove secrets/privacy/acceptance; this projection was manually reviewed in addition to scoped path checking. Final launcher shutdown and documentary gate outcomes follow.

## Final launcher shutdown and documentary gates

- Final 45-second launcher: actual documented client exit 0, then `App shutdown gracefully`, producer/ANSI-filter/path-sanitizer stages `0 0 0`, root exit 0. The normal managed owner returned successfully; this is not an independent audit of external resource deletion and does not imply interruption cleanup.
- Documentary format check exited 0. Evidence Markdown is formatter-ignored (only `progress.md` matched in the three-file evidence/progress check); evidence text/tables were manually reviewed. Earlier scoped package/navigation/public-doc/authority formatting also passed, eight matched files.
- `npm run spec:check -- cabloy-mcp`: exit 0, 68 definitions; producer/path-sanitizer stages `0 0`. Static authority structure/local links only, not semantic acceptance or ATP proof.
- `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp`: both exit 0, English charts, 0/12 verified; generated SVG bytes unchanged.
- Scoped `evidence:check` over this record, evidence README and progress: exit 0. Recognized path coverage only, supplemented by manual review; no raw run IDs/private DB filenames/full product rows retained here.
- Public guide relative links and the actual API & Testing navigation entry checked successfully. `git diff --check` exited 0. No commit/push.
- The first final docs capture omitted the ANSI filter: `evidence:sanitize` rejected output as `BINARY`, producer/sanitizer stages `1 2`; that interrupted pipeline is not a docs-build pass or acceptable full evidence capture. The corrected `npm run docs:build` capture through the ANSI-filter/path-sanitizer pipeline passed without changing docs/source: client/server bundles and page rendering succeeded, `build complete in 9.42s`, stages `0 0 0`, root exit 0. Existing chunk-size warning remains; no broken-link build error. Successful build removed the interrupted build's temporary output; no manual cleanup was performed.
