# Local stateless compatibility and AI-client proof boundary

## Authority and attribution

On 2026-10-22, after an actual Claude Code protocol rejection, the user explicitly approved local-only native stateless compatibility and its finite execution plan. The [accepted amendment](../decisions/0002-mcp-transport.md#accepted-local-stateless-client-compatibility-2026-10-22), [bounded contribution](../pdp-wbs.md#approved-local-compatibility-contribution-2026-10-22) and [proof procedure](../test-plan.md#local-stateless-compatibility-proof-2026-10-22) control this increment. `zhennann` remains accountable reviewer/evidence custodian.

Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, base `6d04bab6f046329a881cfc7b46d01b29d4412f6a`, plus attributable dirty/untracked source. Preserve the carried local-runtime/category/generated changes: the complete tree is not authored by this increment and the base alone is insufficient to reproduce it. Historical [category proof](./business-categories.md) retains its original hashes/results, not current transport compatibility proof.

**Current outcome:** local compatibility and parsing-isolation checks passed. The historical [Commerce-backed real Claude Code journey](#real-claude-code-business-proof-2026-10-23) retains its unknown server root exit. The separately approved [independent mcp-test real-client proof](#independent-mcp-test-real-client-proof-2026-10-23) now supplies connection, three sequential returned-ID calls, faithful Chinese output, client exit 0, reported cost US$0.02581, server graceful shutdown and `server_exit=0`. These are user-supplied runtime observations, not independently captured launch/configuration or cleanup attestations. Earlier pending statements remain historical; the new proof closes only the migrated local business-journey gap. The later [user-reported Codex OAuth and fixture-tool success](#user-reported-codex-oauth-and-fixture-tool-success-recorded-2026-10-25) adds real authenticated-client happy-path evidence separately from those anonymous local runs. Production OAuth/controller/modern-only requirements, blocked MCP parents, open full ATPs and verified **0/12** are unchanged.

## Actual earlier client failure

User-supplied Claude Code `2.1.236` output showed `commerce_local` failed, no available tools, one model turn and no business calls. The model stopped without inventing product data. `client_exit=0` / query subtype success described model-query completion only; cost reported US$0.00643. A later no-initial-prompt client diagnostic supplied an actual server JSON-RPC `-32022`, unsupported protocol, supported modern revision `2026-07-28`. The exact client-requested version was not supplied.

The diagnostic's unauthenticated label does not establish an authentication cause for this anonymous endpoint. The model warning and later shell-save error are not proven causes either. Server JSON-mode warning comes from per-request handler construction, so it is evidence of request entry, not merely launcher startup. Raw session signatures, paths, identifiers and full dumps are intentionally not retained here.

## Delivered local boundary

- Existing strict modern SDK handler remains `legacy: 'reject'`, JSON mode, modern metadata/mirrored-header validation. Exported SDK `isLegacyRequest` selects a fresh native `WebStandardStreamableHTTPServerTransport` for legacy messages with `sessionIdGenerator: undefined`, `enableJsonResponse: true`, `keepAliveMs: 0`, 16 KiB limit. Installed server/node versions remain 2.3.0/2.1.1. No install or custom SSE parser/bridge.
- Only SDK-validated genuinely id-less `notifications/initialized` is newly admitted; empty 202 uses safe header projection. No general notifications, subscriptions, sessions, GET stream or DELETE termination. Modern errors retain modern-only version diagnostics.
- Both paths reuse unchanged `createBusinessToolServer`, exactly three public reads, ordinary fresh context, fixed default instance, guarded `performAction(..., innerAccess: false)`, original ingress/limits and one-active/no-queue. Complete JSON remains bounded to 1 MiB and sanitized before output.
- Native JSON transport close alone does not resolve a pending response promise. A request-local abort wait releases only that response wait; transport close, actual `settleWork()`, business close and executor disposal remain inside the owner before capacity release. No SQL cancellation claim.
- Runtime banner and existing public guide now describe local compatibility. Client example explicitly selects `--permission-mode manual`, retains the exact three-tool allowlist, public synthetic data, isolated client directory, no built-ins/skills/browser/persistence and US$1 API budget. No actual model/client was invoked by this increment; the harness's nested/auth restrictions were not bypassed.

## Retained failures and corrections

1. Attempting `npm run format -- --write ...` exited 1 because the root script already supplies `--check`; `--check` and `--write` cannot be combined. No formatting was performed by that failed command. Used the installed `pnpm exec oxfmt --write` on only three selected source files, then normal root check/lint.
2. First managed run: 14 tests, 13 pass/1 fail, duration `25858.161917` ms, producer/ANSI-filter/path-sanitizer `1 0 0`. Legacy invalid-argument error ID was string `"1"`, expected number `1`. Vona's query parse adapter coerces string schemas; the legacy SDK's union request-ID parse can therefore change numeric IDs. The fix is confined to the existing complete-response projection: preserve the single request's original safe ID type when textual identity matches. No relaxed assertion, framework patch or business change. Failed runner resources were retained; no manual cleanup/reset.

## Final finite verification

```sh
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts
```

Final semantic check exited 0, producer/path-sanitizer `0 0`. Final managed test streams passed through Node `stripVTControlCharacters` then root `evidence:sanitize`, with `pipefail` and immediate Zsh `pipestatus` capture:

```text
businessTools.test.ts: seven retained business cases passed
commerceLocalHttp.test.ts: seven real-HTTP cases passed
modern and legacy: returned-ID three-tool journey, DTO/text equivalence, strict arguments, scoped absence
legacy: initialize, empty initialized 202, exact three tools, no session header
malformed notifications/batch and modern-claim downgrade denied; ingress retained
legacy deadline: 504, retained capacity, close waits for held real service, actual drain completes
retained modern receive/deadline/output/disconnect/drain cases passed
App shutdown gracefully
tests 14
suites 3
pass 14
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 26790.293958
compatibility_test_stages=0 0 0
root_exit=0
```

Stateful suites retain explicit `concurrency: false` and existing `a-commerce` lock; real source service is held then forwarded, never a replacement executor. HTTP messages own ordinary runtime contexts; direct expectations own `mockCtx`. No persisted fixtures were added; managed seeds remain read-only. No runner-concurrency override, raw runner, reset, generation, frontend builds, dependency sync or schema change.

## Actual root command and normal TTL

```sh
npm run mcp:commerce:local -- --seconds 60
```

A separate Python process extracted only the actual allocated loopback URL from the launcher output and drove sequential `curl --noproxy '*' --max-time 12` requests, asserting JSON in Python (not a model, in-memory substitute, or execution of the public guide's modern blocks). It proved modern discovery, native legacy initialization/empty notification/list, then categories → returned Electronics ID → filtered search → returned Product ID → detail. IDs were never hardcoded. Only this minimized projection is retained:

```json
{
  "client": "separate-process curl with Python assertions",
  "modernDiscover": true,
  "legacyProtocol": "2025-11-25",
  "initializedEmpty": true,
  "tools": ["commerce_products_search", "commerce_product_detail", "commerce_categories_list"],
  "categorySearchDetailIdsMatch": true,
  "textEquivalent": true,
  "clientExit": 0
}
```

Actual 60-second serving TTL expired normally; graceful application shutdown observed, `compatibility_launcher_stages=0 0 0`, root exit 0. Managed owner returned successfully; this is not an independent audit of every deleted external resource or interruption/SQL/production proof.

## Source fingerprints

SHA-256 identifies source bytes, not sanitized output:

| Repository-relative source | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/commerceLocalTransport.ts` | `7140ce5bab8e2cfafa8e9850a4698660e90a06c5a780404e62bbe02d5713047c` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/runtime/commerceLocal.ts` | `e0129c793a1e200e0747666fd8bb6b399b7330f251c687ce2d8345f2fa5cff07` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts` | `dc754b5cff970f2aa2a23ac2a83b4ce6074f78368181e53c8574f6d77e43315b` |
| unchanged business factory `src/lib/businessTools.ts` in the same module | `89223b50c02ecf50bd28612c6a30b0d01c24c8090b056fb6fbe24f9dbe7646f4` |
| `repo-docs/backend/mcp-commerce-local.md` | `127d6d4fbc0bd1ac0925644c235c520bacffe7d202d81f878cd56af4b5d33f27` |

Selected dirty-source digest `93946776f36306f398c385b20143506ffb113cc975913021cfdcba63701757f7`: `git diff --binary HEAD --` over the sorted transport/runtime/test/public-guide paths above (excluding unchanged factory); append each selected untracked file in sorted order as NUL + repository-relative UTF-8 path + NUL + bytes. Includes carried bytes where those files were already untracked; not a compatibility-only patch or whole-tree fingerprint.

## Documentary checks and next proof

- Source formatting/lint passed for the three changed runtime/test files. Guide's 13 Bash blocks passed `bash -n`; inline MCP JSON, root launcher existence, relative links and existing navigation checked.
- Public docs build passed in 9.66 seconds, producer/ANSI-filter/path-sanitizer `0 0 0`; existing chunk-size warning only.
- MCP authority audit passed, 68 definitions, producer/path-sanitizer `0 0`. Audit is structure only, not approval/acceptance proof. No unrelated Commerce audit repair.
- After evidence/index/progress updates, root `spec:charts -- cabloy-mcp` and `spec:charts:check -- cabloy-mcp` passed, each producer/path-sanitizer `0 0`; English charts retain 0/12 verified. No acceptance claim follows from chart output.
- Final scoped `evidence:check -- --` over this record/index/progress/public guide, root formatting check (10 matched files; formatter-ignored evidence manually reviewed) and `git diff --check` exited 0. Path checks cover machine-path patterns only, not secrets or acceptance. Retained prose/projections were manually reviewed to omit machine paths, credentials, private run/database/claim identities, process/session IDs and raw business rows. No commit/push.

One next proof is the guide's independent-terminal Claude Code probe against a fresh managed serving window: connected server, actual three ordered tool-use/result events, returned-ID equality, truthful SKU/price/availability explanation, client/budget result and normal server shutdown. Until those observations exist, real AI interoperability remains pending. No cart/checkout, fourth tool or production expansion is authorized.

## Later protocol/query parsing repair (2026-10-23)

### Authority, failure and attribution

The user separately approved the [parsing-isolation amendment](../decisions/0002-mcp-transport.md#accepted-local-protocol-parsing-isolation-2026-10-23), [bounded repair](../pdp-wbs.md#approved-local-parsing-repair-2026-10-23) and [supplemental procedure](../test-plan.md#local-protocol-parsing-isolation-proof-2026-10-23), including the exact four shared paths in canonical Basic main followed by byte-identical mirroring to this MCP worktree. MCP base is `e27b754d87578159ed64f5c588987c3365a9071c`; main base is `e00546cd4cfd544b4b417f91512c3ea01510cb7f`. Both were clean before this repair. Changes remain uncommitted. Earlier fingerprints and 14/14 results above are historical, not final-byte proof for this repair.

The second user-run Claude Code 2.1.236 probe still reported `commerce_local: failed`, no tools and no business calls; client exit 0 and US$0.005605 did not establish interoperability. Interactive diagnostics returned HTTP 400 / JSON-RPC `-32700`, `Parse error`. The earlier interactive command also rejected `--no-session-persistence` because it requires `--print`; the public guide now distinguishes the two modes. Raw client sessions, signatures, configuration dumps and local identities are omitted.

An independent installed-native-client reproduction, without a model call, used valid `roots: { listChanged: true }`, `sampling: {}` and `elicitation: {}` capabilities. Vona's global query conversion caused the SDK's checked intersection parsing to throw `Unmergable intersection` at `form`. Import ordering did not avoid lazy-schema parsing. Claude's exact request body was not captured: this is an independently reproduced parser conflict, not proof of that client's precise payload. The unauthenticated label does not require login for these anonymous public reads.

### Connected implementation

- Portable `setParseAdapter` accepts an optional runtime policy. Disabled conversion delegates to the supplied checked parser, preserving refinements and native JSON values; no SDK schema mutation, Node import in the portable utility, global per-request toggling or validation bypass.
- Backend owns one private `AsyncLocalStorage<boolean>` with generic `runWithZodQueryCoercion(enabled, fn)`, default enabled and nested/error/concurrent restoration. Only its named helper is added to the existing utility barrel.
- Local transport disables query conversion for SDK guards, classification, construction, dispatch and encoding. Executor initialization/disposal stay outside that scope. Business factory setup and its deferred tracked continuation explicitly enable normal query/DTO/controller conversion. Three public tools, guarded `innerAccess: false`, limits, safe numeric-ID projection, actual-work settlement and no-session/no-queue ownership remain intact.
- No 429 race was observed by immediate initialize → acknowledgement → list. No speculative capacity-release or lifecycle correction was made.

### Retained attempts and final regression

1. Canonical main shared regression passed 3/3 with root exit 0. Adapter, core and test-owner native no-emit checks and exact-path lint passed. The four approved files were mirrored only after checking destination overlap; all four bytes matched afterward.
2. A formatting invocation via `pnpm --dir <MAIN_CHECKOUT> exec oxfmt` unexpectedly ran an up-to-date dependency check and the Husky prepare script. It reported lockfile/already up to date; main's Git changes remained only the four approved paths, without tracked lockfile/dependency changes. No deliberate installation or installed-package patch was performed. Later formatting used the existing binary directly.
3. First combined managed regression: 18 tests, 16 passed/2 failed, root exit 1. New business schema comparison incorrectly generated its expected OpenAPI under disabled conversion; malformed-capability transport status was incorrectly expected as 400 instead of the observed 200. Corrected the comparison scope and strengthened the in-band error assertion; retained the failed result, without manual resource cleanup/reset.
4. Second combined regression: 18 tests, 16 passed/2 failed, root exit 1, duration `25882.048583` ms. The remaining direct-controller comparison still used disabled conversion and rejected stringified query pagination. The proposed error expectation `-32602` was also wrong: actual SDK spec-handler validation throws a plain Error, mapped to `-32603` and sanitized to `Internal error`. Installed SDK source confirmed that mapping. Enabled normal conversion only for the direct expected controller call and asserted the exact native rejection; no production code or validation was relaxed.
5. Final combined regression passed: **18 tests, 4 suites, 18 passed, 0 failed/cancelled/skipped/todo**, duration `25876.672209` ms, graceful application shutdown and root exit 0. Three shared scope cases, seven business cases and eight HTTP cases include valid nonempty capabilities/numeric ID 0, malformed-type rejection, immediate continuous handshake/list, both protocol returned-ID journeys, strict input/projection/instance boundaries and retained deadline/disconnect/actual-work drain cases. Read-only managed seeds only; separate scoped contexts and existing Commerce test lock retained.

Executed from the MCP repository root:

```sh
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
SERVER_LISTEN_DISABLE=true npm run test -- src/suite-vendor/a-test/modules/test-vona/test/utils/zodQueryScope.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts
```

Final MCP no-emit and scoped four-source/test lint exited 0 after the last test corrections. Failed managed runs retained their claim/resources under the runner's failure policy; no reset, process takeover or manual deletion followed.

### Separate-process native client

One actual `npm run mcp:commerce:local -- --seconds 60` serving window used the already-installed SDK 1.29.0 `Client` and `StreamableHTTPClientTransport` in a separate Node process. A Python parent extracted only the actual launcher URL; requests were native SDK operations, not curl or hand-written HTTP. Native connect/initialized/list and business calls had no artificial inter-request sleeps, retries or snapshot polling. No install, authentication/provider change or model call occurred. Retained projection:

```json
{
  "client": "installed native SDK 1.29.0",
  "nonemptyCapabilities": true,
  "connected": true,
  "tools": ["commerce_products_search", "commerce_product_detail", "commerce_categories_list"],
  "callOrder": ["commerce_categories_list", "commerce_products_search", "commerce_product_detail"],
  "returnedIdsMatch": true,
  "textEquivalent": true,
  "noSession": true,
  "clientExit": 0
}
```

The actual 60-second serving window expired normally; graceful application shutdown was observed and the root command exited 0. The managed owner returned successfully; this is not an independent audit of every removed external resource or an interruption/SQL-cancellation guarantee. No raw catalogue rows, allocated port, private run/database/claim identities or machine paths are retained. Native success is not actual Claude tool-event or natural-language proof.

### Current source fingerprints

SHA-256 of final source bytes; the first four paths are identical in canonical main and MCP:

| Repository-relative source | SHA-256 |
| --- | --- |
| `vona/packages-utils/zod-query/src/lib/query.ts` | `943155d4c777b4021badb06372b64e1a67f5d98507a5a252d66a3685944fce65` |
| `vona/packages-vona/vona-core/src/lib/utils/zod-enhance.ts` | `26d4f09e8b7da402d61a6a14a1547331e3e4ab4a4e7a514cdd40a9a858e0cb14` |
| `vona/packages-vona/vona-core/src/lib/utils/index.ts` | `480c65046c3bd5ac939d522132e154f607d3298ad2db18550dd73029ad3ed482` |
| `vona/src/suite-vendor/a-test/modules/test-vona/test/utils/zodQueryScope.test.ts` | `33bf95ef7e794f5a7f0d9713b3da8c80b22624ae8a0de7e6e4c39c4ceb7eb86b` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts` | `72ff6b973b7d2633020a9d0ea6417f616e587a70723d3c550355cd88f623c66b` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/commerceLocalTransport.ts` | `24a5e00b2bb77ef5a0b9389f432a1686cc41871dbfb0279cc1e12bc502e2f847` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts` | `90d6e6823aedf8afcdf8d3bff15020293af5914c4f92bbd348da7d6776107392` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts` | `590f39c61e4d6c0480c86da10d3a210e7e9edcfdd03c805ce6dc78d3d685e1bb` |
| `repo-docs/backend/mcp-commerce-local.md` | `8347ccf8a2e620b29379167a7b7082809b83a30455e8e9efabd40c3cc5d1b2d0` |

### Documentary checks and remaining proof

- Public docs build passed in 10.25 seconds with the existing chunk-size warning; complete MCP authority audit passed with 68 definitions, including a final audit after evidence/progress updates. All 13 public-guide Bash blocks passed `bash -n`; relative link targets and the root launcher script were checked. New repair authority/evidence heading anchors were checked explicitly.
- `spec:charts -- cabloy-mcp` and `spec:charts:check -- cabloy-mcp` both exited 0 after progress updates. English charts retain verified 0/12; generation/freshness proves only the derived model, not approval or acceptance.
- Scoped `evidence:check -- --` over the guide, four amended authority records, evidence/index and progress exited 0. Supported machine-path patterns were checked; retained prose/projections were manually reviewed for credentials, private run/database/claim/process/session identities, raw client dumps and business rows. Path checking is neither secret scanning nor acceptance proof; full raw local task logs are not copied into repository evidence.
- Final scoped formatter check passed on 14 matched source/docs/authority/progress files; formatter-ignored evidence/index were manually inspected. Both worktrees' `git diff --check` exited 0. Canonical main has exactly the four approved shared paths (including the new test); all four match MCP bytes. No general main synchronization, environment read/edit, reset, model call, commit or push occurred. The unexpected up-to-date/prepare invocation above remains disclosed rather than described as no dependency-related activity.

These documentary/static checks and the observed normal shutdown do not establish actual Claude interoperability, full ATP completion or production readiness.

At this repair checkpoint, successful real Claude connection, the actual three ordered tool-use/result events and truthful SKU/price/availability prose remained **pending**. The later user-supplied proof below supersedes that pending business outcome only. Parent WBS rows remain blocked, full ATPs open and verified **0/12**; no fourth tool, cart/checkout, production/OAuth work, commit or push follows automatically.

## Real Claude Code business proof (2026-10-23)

### Custody and scope

After the parsing repair, the user supplied the actual client tool-use/result stream, final answer/result, `client_exit=0`, and server startup/shutdown excerpt in this conversation, then explicitly approved recording the sanitized outcome in the existing evidence/index/progress/public guide. This is user-supplied runtime evidence reviewed here, not an assistant-executed model call, an independently captured full transcript, or a rerun. Documentation-only recording started at clean MCP revision `3419e120d67db469d74d69b4a725233f3b2c52d4`. That revision identifies the recording checkout; the external client did not supply a server-source revision/hash attestation, so it is not proof of the exact source bytes used by that run. Earlier source fingerprints and failed attempts remain historical and intact.

Only the minimized observations below are retained. Machine paths, allocated port, process/session/message/tool-call identifiers, plugin paths and complete startup/session dumps are omitted. Synthetic catalogue identities are expressed as returned-ID equality rather than retained seed constants; the limited SKU/price/availability facts are needed to assess the final answer.

### Observed events and answer

| Observation | Supplied result |
| --- | --- |
| Client | Claude Code `2.1.236` |
| MCP server | `commerce_local`, status `connected` |
| Available tools | Exactly `commerce_categories_list`, `commerce_products_search`, `commerce_product_detail` with their MCP namespace |
| First call | Category listing with empty arguments; result includes Electronics |
| Second call | Search uses the Electronics ID returned by the first result, `pageNo: 1`, `pageSize: 1` |
| Third call | Detail uses the product ID returned by search; product and category identities match |
| Ordering | Each tool result precedes the next tool-use event; three calls, no observed parallel call or retry |
| Final answer | Chinese description of Wireless Headphones, SKU `HPH-BLK`, product/SKU `priceCents: 7999`, product/SKU `available: 24`; currency explicitly unknown |
| Faithfulness | Matches returned fields; no inferred colour or invented currency; description is a faithful translation |
| Client result | `is_error: false`, subtype `success`, terminal reason `completed`, stop reason `end_turn`, four turns |
| Client exit and permissions | `client_exit=0`, empty permission denials |
| Reported cost | US$0.02286, below the documented US$1 budget; no reported budget exhaustion |
| Server | Supplied banner announces a 180-second managed local window; excerpt ends with `App shutdown gracefully` |
| Server root-command exit | **Not supplied / unknown**; do not infer exit 0 or independently verified resource cleanup |

The repeated SDK JSON-mode notification messages are not tool failures: this three-read journey did not require mid-call notifications or subscriptions. Their presence does not justify SSE expansion or another lifecycle change. The server excerpt does not independently establish exact elapsed TTL time or every cleanup operation. Earlier native-SDK root exit 0 belongs to a different run and is not substituted here.

### Observed configuration limits

The startup stream reported model identifier `gpt-6.1-sol`, permission mode `default`, API-key source `none`, loaded plugins, empty slash commands and empty skills; its tools list contained only the three MCP tools. It also emitted an unrecognized-model warning, but the supplied events subsequently show successful tool calls and completion. No provider/authentication mechanism is inferred from these labels, and this is not validation of arbitrary model/provider configurations.

The exact shell invocation was not supplied. Therefore this successful business run does **not** independently attest use of `--bare`, the documented existing-API-key prerequisite, explicit `manual` permissions, plugin isolation, or every other print-mode flag. Do not relabel its reported mode, claim a credential source, or weaken the public procedure's safety controls to match it. No settings, credential, environment, provider or MCP registration changes were performed in this recording task.

### Disposition and remaining boundary

**The observed local real-AI read-only business journey passed:** connected client, exactly three available tools, sequential returned-ID traversal, faithful natural-language answer, successful client/budget outcome and server graceful shutdown. Full launcher lifecycle/cleanup proof for this particular run remains limited by the absent root-command exit code. No repeated model call is needed to establish the already-observed business result.

This supersedes the earlier real-AI-business pending handoff, not the retained failures, native-SDK proof or production gates. Parent WBS statuses remain blocked, full ATPs open and verified **0/12**. No new tool, shopping cart, authorization design, framework source, dependency installation, reset, application/frontend build, commit or push is authorized by this documentary closure. Any authenticated-user business increment requires its own bounded scope and approval.

### Recording checks

Documentation-only verification passed: public docs build in 10.23 seconds (existing chunk-size warning), complete MCP authority audit with 68 definitions, English implementation-chart generation and freshness retaining 0/12 verified, 13 guide Bash blocks via `bash -n`, guide relative links and new evidence heading anchors, scoped machine-path check, two formatter-matched guide/progress files and `git diff --check`. Evidence/index are formatter-ignored and manually inspected. Retained excerpts were manually checked to exclude machine paths, credentials and private run/session identifiers; supported path checking is not secret scanning. The final diff is limited to the four approved documentation records; regenerated charts have no byte changes. No model, application startup, source edit, dependency install, frontend build, main synchronization, commit or push was performed. These checks validate the recording and derived views, not independent runtime capture or production acceptance.

## Independent mcp-test real-client proof (2026-10-23)

### Approval, authority and attribution

The user explicitly selected the finite real-client verification dossier in this session, including one external client call with a US$1 CLI budget and independent-terminal execution, followed by sanitized evidence/index/progress and applicable chart updates. The unchanged scope excludes source edits, new features, production activation, credential/configuration changes, persistent registration, resets, automatic retries and commit/push. `zhennann` remains reviewer/evidence custodian. This is a verification-only subincrement of the delivered local `WBS-MCP-20-01` / `WBS-MCP-30-01` / `WBS-MCP-40-01` contribution, not execution or closure of those blocked parents.

Controlling records are the [accepted independent migration](../decisions/0002-mcp-transport.md#accepted-independent-mcp-test-migration-2026-10-23), [bounded WBS contribution](../pdp-wbs.md#approved-independent-mcp-test-contribution-2026-10-23), [independent proof procedure](../test-plan.md#independent-mcp-test-proof-2026-10-23) and [real-client observation requirements](../test-plan.md#local-stateless-compatibility-proof-2026-10-22). Linked partial ATPs remain `ATP-MCP-TRANSPORT-01`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-CALL-01` and `ATP-MCP-CALL-03`; full procedures are not closed. The [migration evidence](./business-categories.md#independent-mcp-test-migration-2026-10-23) retains separate Commerce-excluded managed/native-SDK proof; it is not reattributed as this client run.

Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, clean recording checkout `f06254fb78f0dddd900a58ef557af48aeea6b287` before documentation edits; the same clean revision was observed during the terminal handoff. This identifies the recording/source checkout, not an independent attestation of the user's server process or installed dependencies. The user supplied runtime excerpts and exits in this conversation, not a complete independently captured transcript or server-source hash. Subsequent dirty changes belong only to documentation/evidence and derived views, not the runtime source.

### Procedure and minimized observations

The instructed server invocation was `npm run mcp:test:local -- --seconds 180`, wrapped to print `server_exit`. The user supplied its actual loopback `/mcp` URL. The client handoff used the existing [public independent-terminal procedure](../../../vona/src/suite/cabloy-mcp/docs/mcp-commerce-local.md#8-real-ai-client-walkthrough-claude-code-21236-tested): one `claude --bare --print` call, strict inline HTTP MCP configuration, no built-in tools, exact three-tool allowlist, `--permission-mode manual`, disabled slash commands/browser/session persistence, `--max-budget-usd 1`, verbose stream JSON and the existing sequential returned-ID Chinese shopping prompt. This is the instructed procedure; no shell invocation echo or preflight-success output was supplied, so actual enforcement of every flag/auth prerequisite is not attested. No assistant-executed client/server call or retry occurred.

| Observation | Supplied result |
| --- | --- |
| Client / connection | Claude Code `2.1.236`; `commerce_local` connected |
| Available tools | Exactly `commerce_categories_list`, `commerce_products_search`, `commerce_product_detail` with MCP namespace |
| First call | Category listing with empty arguments; Electronics returned |
| Second call | Search uses the actual returned Electronics ID, `pageNo: 1`, `pageSize: 1` |
| Third call | Detail uses the product ID returned by search; category/product identities match |
| Ordering and content | Each result precedes the next call; three observed calls, no observed parallel call or retry; text JSON and structured results agree |
| Product | Wireless Headphones; `priceCents: 9999`, `available: 11` |
| SKU facts | `HEADPHONES-BLACK`: `priceCents: 9999`, `available: 8`; `HEADPHONES-WHITE`: `priceCents: 10999`, `available: 3` |
| Final answer | Chinese explanation matches the returned product/SKU/availability facts, preserves raw `priceCents` and explicitly leaves currency unknown |
| Client outcome | `is_error: false`, subtype `success`, terminal reason `completed`, stop reason `end_turn`, four turns; `client_exit=0`; no permission denials |
| Reported cost | US$0.02581, below US$1; no reported budget exhaustion |
| Same server run | User supplied `App shutdown gracefully` and `server_exit=0` after the natural-expiry handoff |

Retain only these observations: machine/client/plugin paths, allocated port, process/session/message/tool-call identities and full row/startup dumps are omitted. Catalogue IDs are represented by returned-ID equality. The limited product/SKU facts are necessary to compare the answer, not real customer or payment data.

### Configuration, lifecycle and acceptance limits

Startup reported model identifier `gpt-6.1-sol`, permission mode `default`, API-key source `none` and loaded plugins, despite the instructed `--bare`/`manual` profile. It also emitted an unrecognized-model warning; subsequent actual tool results and success show that warning did not prevent this business run. No provider, credential source, flag enforcement or reason for the configuration discrepancy is inferred. Keep the existing safe procedure unchanged; neither permissions/authentication/plugin isolation nor arbitrary model/provider compatibility is qualified by this run.

Both client and server exits are supplied for this same run, unlike the earlier Commerce-backed proof. User-reported graceful shutdown/root exit supports the instructed normal-expiry handoff, not independent elapsed-time measurement, complete external-resource deletion audit, interruption recovery, SQL cancellation or production lifecycle proof. The earlier run's unknown root exit remains unknown; this result does not repair its history.

**Disposition:** the independent mcp-test local real-client three-read business journey passed within the supplied-observation boundary. This supersedes only the migrated real-client pending handoff; prior failures, migration/native proof and the historical Commerce-backed client result remain intact. Parent WBS rows stay `blocked`, full ATPs remain open and verified stays **0/12**. No further model call is needed for this bounded business outcome. Next single action: use the delivered canonical walkthrough; any new business capability requires separate finite scope/approval, not automatic OAuth, cart/checkout or foundation expansion.

### Recording verification

- `npm run spec:check -- cabloy-mcp` passed with 68 definitions; producer/path-sanitizer exits `0 0`. This checks definition/reference structure, not human approval, authentic runtime capture or full ATP acceptance.
- `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` passed, each producer/path-sanitizer exits `0 0`. English charts retain 0/12 verified and have no byte changes. Suite README title/language is unchanged; no chart-input omission.
- `npm run docs:build` passed in 10.77 seconds with the existing chunk-size warning; producer/ANSI-filter/path-sanitizer exits `0 0 0`. No public guide or frontend source was changed.
- All 153 local links/Markdown heading targets in the three changed records resolved. `npm run format --` with those exact paths passed one matched progress file; the two ignored evidence files were manually inspected. `npm run evidence:check -- --` with the same three paths and `git diff --check` passed. Supported path checking is not secret scanning; manual review excluded credentials, raw initialization/session dumps, machine paths, allocated port, process identities and private run/database identifiers.
- Dirty attribution is limited to `repo-specs/cabloy-mcp/evidence/README.md`, `repo-specs/cabloy-mcp/evidence/business-ai-client.md` and `repo-specs/cabloy-mcp/progress.md`. Before adding this verification section, `git diff --binary HEAD --` over those exact ordered paths had SHA-256 `8d55f34776fad2e5089284954b337a3807f73ec5b64347722bd0b0d894879209` (46 insertions, 3 deletions). That checkpoint digest identifies the observed outcome/index/progress patch, not this later check-summary text, runtime source changes or a whole-tree attestation. Runtime source remains at the clean recording revision above; no new regression claim is made.

No source test, client/server startup, model call, dependency installation, environment/configuration change, main synchronization, reset, commit or push was performed by the assistant in this recording increment. These checks validate retained documentation and derived views; the actual business/lifecycle results remain explicitly user-supplied.

## User-reported Codex OAuth and fixture-tool success (recorded 2026-10-25)

### Attribution and procedure

After the native DCR compatibility fix, the user reported successful real Codex App authentication, then requested a test prompt and confirmed its results in this conversation. They subsequently approved recording this bounded outcome. This is a retained user report, not an assistant-executed client retry or independently captured runtime transcript. The current [browser authorization profile](../decisions/0010-mcp-browser-execution-profile.md) and [suite guide](../../../vona/src/suite/cabloy-mcp/docs/mcp-browser-authorization.md) govern this flow; the preceding anonymous standalone evidence keeps its historical scope.

Recording began at clean Cabloy Basic checkout `ca9d34c948cb1e3b18b2319d02b651c2d4fc0a82` on branch `worktree-spec-basic-cabloy-mcp`. That revision includes the committed native-registration compatibility fix. It is the documentation baseline, not an attestation of the exact server source/dependencies used during the earlier run; no run-time source hash was captured. Earlier read-only diagnosis identified Codex App `26.1016.61520` (build `21421`), bundled Codex `0.163.0-alpha.11.1`; the user did not separately reconfirm the successful run's version. No new credential/configuration inspection was performed for this recording.

The supplied prompt targeted configured MCP server `test` at the existing local shared `/mcp` endpoint. It required MCP tools only (no local files, direct HTTP or substitute data source): list categories, use the returned Electronics category ID to search for Wireless Headphones, then use the returned product ID for detail. It prohibited writes and requested tool names, key results and ID/value comparisons. This records the instructed procedure and the user's confirmation below; a complete tool-event trace was not supplied.

### Minimized observations and disposition

| Observation | User-reported result |
| --- | --- |
| Authentication | `Authentication complete. You may close this window.` |
| Business calls | All category, product-search and product-detail tool calls succeeded |
| Identity consistency | Search/detail product IDs match; their category IDs match each other and the category-list result |
| Fixture values | `priceCents = 9999`, `available = 11`, as expected for the instructed product |

The current three fixture tools are `commerce_categories_list`, `commerce_products_search` and `commerce_product_detail`; these names describe the tested catalog, not independently captured event names. Raw catalog IDs are omitted in favor of equality observations. The exact granted scope, complete DCR/consent/PKCE/token exchange wire sequence, permission/account/instance details, client/server exits, cost and cleanup were not supplied. Successful read calls alone do not distinguish `mcp:all` from `mcp:read`. Do not copy the earlier Claude run's exits, TTL, SKU details or cost into this result. No token, cookie, authorization code, client secret, machine path or credential-bearing callback URL is retained.

**Disposition:** the user-observed installed-Codex authentication and three-read fixture business journey passed. This closes that bounded real-client happy-path gap after the native DCR fix, without reclassifying the separate automated **15 backend tests / 4 browser scenarios** as real-client proof. It does not establish negative authorization behavior in the real App, mutation-scope enforcement, production tool exposure/deployment, complete lifecycle cleanup or full ATP acceptance. Parent WBS rows remain `blocked`, full ATPs open and verified **0/12** unchanged. No repeat real-client call or new authentication foundation is required for this outcome; a next business increment needs a concrete selected action and bounded approval.

### Recording checks

- `npm run spec:check -- cabloy-mcp` passed (68 definitions); `npm run spec:charts:check -- cabloy-mcp` passed with unchanged charts and **0/12** verified. These are structural/derived-view checks, not new runtime acceptance.
- `npm run docs:build` exited **0** in 10.13 seconds with the existing chunk-size warning. It does not build these suite-local/spec records.
- All **153 relative file links** across the three changed records resolved, and the new evidence heading anchor was checked; other fragments and external URLs were not checked. Targeted `npm run format --` passed for two matched files; this evidence file is formatter-ignored and was manually reviewed. `npm run evidence:check -- --` on the three changed records and `git diff --check` passed. Path checking is not secret scanning; the new record was also manually checked for credentials and machine-local identifiers.

This recording modifies only this evidence record, `repo-specs/cabloy-mcp/progress.md` and the suite browser-authorization guide. No source test, client/server startup, model call, live diagnostic registration, environment/port change, database reset, commit or push is performed by this increment.

## Student summary business tool automated qualification (2026-10-25)

### Delivered boundary

The next separately approved increment adds `training_student_summary` to the authenticated dev/test shared `/mcp` endpoint when `training-student` is active. Implementation started from clean `4911a8fd5d914438d127d2c64a43f730f8345e5b` on `worktree-spec-basic-cabloy-mcp`; the tests below exercise that baseline plus the current uncommitted MCP source/test diff. This is Basic's persisted reference-business action, not production customer-data qualification.

The fixed adapter derives input/output metadata from the existing `DtoStudentSummary`, accepts only `id`, and invokes `GET /training/student/summary/:id` with `innerAccess: false`. The existing controller's inherited student `view` RBAC and serializer remain authoritative. The response is parsed/projected to exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, and `summaryText`; mobile and full Markdown/HTML notes are excluded from schemas, structured data, and text. Invalid required output fails closed. Vona's existing scalar coercion is retained, rather than claiming native JSON-type rejection for all DTO output fields.

Shared modern/legacy transports select this fixed composition after restoring current Passport. The existing tracked-work settlement is reused. The anonymous independent launcher remains fixture-only, and inactive Training leaves the shared catalog at three tools. No core domain dependency, domain-module change, generic registry, production ingress, write tool, schema/fileVersion change, or durable seed is introduced.

### Automated observations and retained failures

- The contract/standalone managed run passed **17/17**, exit **0**, with `SERVER_LISTEN_DISABLE=true` as required by the standalone tests. Schema/input/projection tests cover the six-field contract, excluded fields, invalid required output, rejected extra dispatch/identity options, and the default server's rejection of the student tool. Existing local modern/legacy HTTP, ingress, deadline, response-bound, and held-work drain regressions passed.
- A separate managed run with `PROJECT_DISABLED_SUITES=a-training SERVER_LISTEN_DISABLE=true` passed **9/9**, exit **0**, confirming the optional module is absent and the shared catalog retains three tools. The projection test's early return when Training is absent is not evidence that student execution was tested in that run.
- Shared HTTP tests exercise real persisted student/content fixtures and an ordinary OAuth-authenticated user. Both `mcp:read` and `mcp:all` are denied before role assignment. Adding the existing `systemAdmin` role through the supported membership API allows the **same already-issued tokens** to read through modern and legacy modes; removal restores denial. This qualifies current-role reload and Basic's supported unrestricted-role allow path, **not a custom non-admin grant provider**. The shared role is unchanged; only test-owned user membership is written and removed.
- A delegating executor spy observes the fixed guarded call and masked mobile in the controller result before MCP projection; the actual controller/service/model and RBAC remain in use. A permitted reader gets the same safe not-found outcome for missing and other-instance IDs. Test-owned membership/content/student records are cleaned in `finally` using precise identities and separate instance contexts.
- The first contract run failed **1/9**, exit **1**, because an object supplied as an invalid string was coerced by the existing Vona schema; the negative now removes a required field. The next mixed run passed contract **9/9** but failed standalone **8/8**, exit **1**, because its required disabled default listener was not selected; rerunning with the documented process-local test option passed. The first shared/domain run passed **22/23**, exit **1**, because an error assertion excluded SDK-owned `_meta`/`resultType`; the following shared run passed **8/9**, exit **1**, because a direct controller numeric ID was compared with the projected string ID without normalizing it. Assertions were corrected without weakening permission, field, or instance boundaries. Failed-run claims/resources were retained by the managed runner; no manual cleanup/reset was performed.

The final combined shared HTTP/student regression run passed **23/23**, exit **0** (9 shared HTTP tests and 14 student tests). Native no-emit typechecks for `mcp-test` and `training-student` passed; final six-file TypeScript formatting/lint passed. The docs build exited **0** in 10.92 seconds with the existing chunk-size warning; it does not build suite/spec records themselves. `spec:check` passed 68 definitions; `spec:charts:check` retained **0/12** verified. All **155 relative file links** in the three changed guidance/evidence records resolved, including the new student anchors; other fragments and external URLs were not checked. Targeted docs formatting passed for two matched files; this ignored evidence file was manually reviewed. Evidence-path and diff-whitespace checks passed. These path checks are not secret scanning; new prose was also manually checked for credentials and machine-local identifiers.

These observations are automated service/transport proof only. No Codex student-tool call or new model invocation was executed. The earlier user-reported Codex catalog success remains a separate result, not proof of this new tool.

### Handoff and limits

At the automated handoff, live student-tool acceptance was pending an existing authorized safe student ID supplied by the user. The [subsequent user-reported Codex result](#user-reported-codex-student-summary-success-recorded-2026-10-25) closes that bounded happy-path gap; the automated observations above remain separately attributed. Do not reuse disposable test IDs or seed/reset development data. No service restart, environment/port edit, credential-store access, live diagnostic registration, commit/push, production qualification, or full ATP closure follows. Parent WBS rows remain blocked and verified **0/12** unchanged.

## User-reported Codex student summary success (recorded 2026-10-25)

### Attribution and minimized observations

After the student-tool implementation, the user supplied the real Codex output in this conversation and approved recording its successful result. This is user-reported runtime evidence, not an assistant-executed retry or independently captured tool transcript. Recording began at `4911a8fd5d914438d127d2c64a43f730f8345e5b` on `worktree-spec-basic-cabloy-mcp`, with the preceding student-tool source/test and three documentation changes still uncommitted. That checkout state identifies the recording baseline, not the exact bytes served during the user's call.

The supplied procedure targeted MCP server `test`, required MCP tools only, and prohibited writes or permission changes. The user reported:

| Observation | User-reported result |
| --- | --- |
| Discovery | Server `test` provides `training_student_summary` |
| Actual client tool | `mcp__test__training_student_summary` |
| Identity | Returned student ID exactly matches the supplied ID |
| Output fields | Exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText` |
| Summary values | `level = 2`, `levelTitle = "2"`, `descriptionLength = 48`; summary text agrees with the returned name, level and length |
| Excluded fields | No `mobile`, `descriptionMarkdown` or `descriptionHtml` |
| Effects | No creation, update, deletion or role-permission modification reported |

The raw student identity and name are deliberately omitted; equality and summary consistency preserve the useful check without retaining those business identifiers. No credential, full note, machine-local path or callback URL is retained. The exact client version, granted scope, account roles, instance identity, full OAuth/wire sequence and runtime source hash were not supplied. A successful call does not distinguish `mcp:all` from `mcp:read`, prove both transport modes, or establish the absence of every possible server-side effect.

### Disposition

**Passed: bounded real-Codex student-summary happy path.** The user observed discovery and successful execution of the persisted business read with matching identity and the minimized six-field result. Live student-tool acceptance is no longer pending. The earlier **23/23** shared HTTP/student, **17/17** contract/standalone and **9/9** Training-disabled results remain historical automated evidence; they were not rerun or reclassified as real-client proof for this recording. Ordinary-user denial, role revocation and cross-instance isolation remain covered by those automated checks, not by this successful client call.

This closes the selected business-tool increment's real-client gap, not production ingress/deployment, write-scope enforcement or full ATP/release acceptance. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged. This follow-up changes only this evidence record, progress and the suite guide; no source change, runtime/client invocation, model call, seed/reset, environment change, restart, commit or push is performed.

### Recording checks

The docs build exited **0** in 10.25 seconds with the existing chunk-size warning; it does not build these suite/spec records. `spec:check` passed **68 definitions**, and `spec:charts:check` passed with **0/12** verified unchanged. All **157 relative file links** across the three records resolved and all three links to the new acceptance anchor were checked; other fragments and external URLs were not checked. Targeted formatting passed for the two matched files; this formatter-ignored evidence record was manually reviewed. Evidence-path and diff-whitespace checks passed. Path checking is not secret scanning; new prose was also manually reviewed for credentials and machine-local identifiers. No backend/browser tests or client calls were rerun for this documentation-only follow-up.

## Explicit opt-in Controller Action mapping (2026-10-25)

### Approved boundary and implementation

The user superseded the proposed default-open/exclude model with **default closed, explicit `@mcp.tool()` opt-in, no `@mcp.exclude()`** and approved the revised implementation plan. Work continues from `4911a8fd5d914438d127d2c64a43f730f8345e5b` on `worktree-spec-basic-cabloy-mcp`, preserving the preceding uncommitted student/evidence changes. Earlier real-Codex catalog/student reports describe the handwritten adapters; they do not accept this generic replacement.

A lightweight decorator in `a-openapiutils` marks a controller or individual registered Action and supports description, effective read-only classification and top-level output picks; public names are method-only. Method options override class defaults and pick arrays replace inherited picks. GET is a classification convention, not evidence of no side effects. Ordinary unannotated Actions remain unavailable.

The mapper in `cabloy-mcp` intersects enabled controller/registered-route metadata, extracts per-Action V31 OpenAPI with an explicit cache-separated `includeExcluded` option and reuses the original runtime validators. Ordinary `@Api.exclude()` remains independent. Fixed path/query/JSON-body bindings reject execution-control fields and dispatch through the registered raw route with `innerAccess: false`. JSON/200 is the supported profile; unsupported contracts produce diagnostics rather than untyped approximations. Output picks minimize actual data and reachable schema definitions; failures do not fall back to raw output. Objects are direct structured results, with scalar/array results wrapped as `{result: value}`.

Authorization lookup now returns request-local `{passport, scope}` through one token-validation path. Both shared transport modes pass the validated scope into composition; `mcp:read` filters discovery and denies direct write-tool calls before dispatch, while `mcp:all` still requires business authorization. No scope is stored on Passport or the app-level exchange. Student summary and the three shared catalog Actions use annotations and thin generic composition. The independent anonymous launcher remains exactly three fixtures. Observable write tests use a test-mode-only in-memory controller, not a production registration or new persisted business mutation.

### Retained failures and verification

Early managed attempts exposed a generated-schema mismatch: the student runtime validator was already an optional object, while V31 emitted `type: ['object', 'null']`. The first run passed **15/19**, and the diagnostic rerun with the additional scalar/array test passed **15/20**; both exited **1** at tool construction. Only object/null successful output is normalized to object, retaining safe not-found behavior and the six-field projection. No arbitrary union branch or raw-output fallback was introduced.

The next run passed **16/20**, exit **1**: schema cloning rejected locale metadata methods, and fixed dispatch used the already-prefixed route, causing ordinary executor 404s. A focused diagnostic run passed **9/12**, exit **1**, confirming the executor route mismatch after JSON-wire schema cloning fixed discovery. Dispatch now uses existing `ContextRoute.routePathRaw`, allowing the executor to apply the configured prefix once. Temporary diagnostics were removed. Initial test-only tuple/spread/unused-import type errors and mapper-only lint/format failures were corrected; they are not passing checks. A later combined invocation incorrectly disabled the listener needed by `devHttp`: **44 passed, 0 failed, 10 cancelled**, exit **1**, with the shared suite rejected in its before hook. Standalone and shared tests therefore require separate correctly configured runs. All failed-run resources remain under managed-runner ownership; no manual cleanup/reset followed.

Final correctly configured managed selections:

- With the application listener enabled, `npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts src/suite/cabloy-mcp/modules/mcp-auth/test/authorization.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` passed **34/34**, exit **0**. This covers real persisted student reads, denied/allowed/revoked role behavior on the same tokens, serializer/projection, missing/foreign-instance equivalence, current Passport/scope lookup and modern/legacy deny-before-write dispatch. Each test-owned persisted resource is removed through precise finally cleanup; the supported unrestricted role is reused, not modified.
- `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts` passed **20/20**, exit **0**. Coverage includes opt-in/default closure, class/method precedence and replacement picks, fixed mixed bindings/no-args, invalid raw input/control fields, output/schema minimization, invalid retained output, excluded OpenAPI cache separation, unsupported diagnostics, scalar/array wrappers and the unchanged anonymous three-tool modern/legacy launcher with its existing bounds/drain checks.

- `PROJECT_DISABLED_SUITES=a-training SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` passed **12/12**, exit **0**. The shared catalog omits student summary while retaining the three catalog reads plus test-only fixture Actions; standalone remains exactly three fixtures. Student-only test branches return early when Training is absent and do not prove student execution in this run.

All commands use Node **24.11.0** and the root managed test entrypoint. Six affected module native no-emit typechecks passed with `--incremental false --composite false`: `a-openapi`, `a-openapiutils`, `cabloy-mcp`, `mcp-auth`, `mcp-test` and `training-student`. A later `mcp-test` check after the final raw-route correction also passed. Exact changed-source formatting/lint and diff-whitespace checks passed. Initial public-guide formatting failed and was corrected with the scoped formatter. Documentation builds pass with the existing chunk-size warning; they do not build suite/spec records. `spec:check` passed **68 definitions**, and `spec:charts:check` retained **0/12** verified.

Final documentation verification passed **171 local Markdown targets** and **76 explicit fragments** across the public guide, suite guide, progress and evidence, plus five source paths, ten root scripts, factory definition/export/composition and the navigation entry. The last docs build exited **0**. Subsequent evidence additions were prose and the source-hash table, not new link targets/headings. Evidence-path and whitespace checks passed; new prose was manually reviewed for credentials and machine-local paths. Path checking is not secret scanning or acceptance proof.

Selected tested-source SHA-256 fingerprints (repository-relative, no runtime deployment attestation):

| Source | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `7e529b3e5e832654670a56cb1cc32ee37b6fad8cd5aa79f280c6b631454e468a` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts` | `5890622c15fd470563055d150a39f8bbfdfd1128b3e6db2c2a292cc853742b96` |
| `vona/src/suite-vendor/a-vona/modules/a-openapi/src/service/openapi.ts` | `3da6d7e9afd233f8445cdbcb03383029e4c5124b9907be63e05d6b065d790099` |
| `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/mcp.ts` | `ebc6628bc2f07306e398bb6c6d783a2f0c32b5fe7cee1cbaaa6f2a3a158ce571` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `566408a918129bddf3ea4dd2e6033a243ab92f692bedcba800c9139de43079e4` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | `cc8d0c609d1c9109b970f8f29d3767553d3668a98a3e49eb034dde462b583699` |

No new real-client invocation, browser E2E, production ingress, environment/port edit, development reset, restart, process kill, credential-store access, live diagnostic registration, commit, push or deployment is included. A real-Codex retest should repeat the existing category → search → detail and six-field student-summary journey using an already-authorized student, without writes or permission changes. At that handoff it remained pending for the generic replacement; the [subsequent user-reported replay](#user-reported-codex-generic-mapper-replay-success-recorded-2026-10-25) closes only that bounded happy-path gap. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged.

## User-reported Codex generic mapper replay success (recorded 2026-10-25)

### Attribution and procedure

The user approved the finite generic-replacement real-Codex replay after authority synchronization, then supplied the four successful sequential tool outcomes in this conversation. This is **user-reported client evidence**, not an assistant-executed retry or independently captured tool-event transcript. It supersedes only the generic mapper's pending real-client happy-path handoff, not the earlier failures or separately attributed handwritten-adapter results.

Recording baseline: Cabloy Basic `b2659120712f74a96b5d3b2d60104372d38a6262`, branch `worktree-spec-basic-cabloy-mcp`, with seven approved authority-document edits already present: README, PRD, SRS, PDP/WBS, test plan and ADRs 0005/0006. Their pre-recording `git diff --binary` SHA-256 was `8140e35e5fbdfda62999685e8c7864eeb3783d08e7212b9965593fc6b3703a89`; the dirty documentary baseline is not reproducible from the base commit alone. All six selected implementation/test fingerprints above matched during preflight. Neither those checkout fingerprints nor this recording baseline attest the exact source or dependencies served during the user's calls.

The supplied procedure used existing authenticated MCP server `test`, MCP tools only, and prohibited direct HTTP, alternative data sources, business writes, fixture creation and permission changes. It required categories → returned Electronics ID → filtered Wireless Headphones search → returned product ID → detail, followed by a summary read using an existing student already viewable by the signed-in account. The user reports completing all steps in order, with no retries or permission changes. This finite verification contributes to `WBS-MCP-30-01/30-02/40-01` and bounded portions of `ATP-MCP-CONTRACT-01/02/03` and `ATP-MCP-CALL-01/02`, under `SRS-MCP-CATALOG-01/02/03/04` and `SRS-MCP-DISPATCH-01/02`; it does not close those whole records.

### Minimized observations

| Step | Actual client tool reported | User-reported result |
| --- | --- | --- |
| Categories | `mcp__test__commerce_categories_list` | Electronics found; its returned ID was used for search |
| Search | `mcp__test__commerce_products_search` | Returned a product using that category ID |
| Detail | `mcp__test__commerce_product_detail` | Product ID matches search; search/detail category IDs both match the category-list result |
| Student summary | `mcp__test__training_student_summary` | Returned student ID matches input; exactly the six approved fields and consistent summary |

The product actually returned `priceCents = 9999` and `available = 11`. The student result contained exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText`, without `mobile`, `descriptionMarkdown` or `descriptionHtml`. The user reports the summary's name, level, level title and description length agree with the corresponding fields. Raw catalog/student identities, student name and summary body are omitted; equality checks retain the useful observation. No credential, token, cookie, signed callback state or machine-local path is retained.

### Disposition and limits

**Passed: user-reported bounded real-Codex generic-mapper four-read happy path.** The current replay is distinct from the old handwritten-adapter successes and closes the selected replacement's client gap within this attribution boundary. Exact client version, granted scope, account/instance details, runtime source hash, client/server exit codes, cost and full OAuth/wire transcript were not supplied. Separate inspection of output schemas/reachable definitions and equality of JSON text versus structured content were not reported and are not inferred from field checks. Successful reads do not prove scope-negative behavior, role revocation, cross-instance denial, both transport modes or absence of every possible server-side effect.

No further client retry is needed for this bounded outcome. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged; neither production readiness nor a new implementation increment follows. This recording changes documentation only, without source changes, assistant-driven client/model calls, resets/seeding, permission grants, environment/port changes, service restarts, commit or push.

### Recording checks

`spec:check` passed **68 definitions**; chart generation/freshness passed in English with **0/12 verified** and no chart-byte changes. `docs:build` exited **0** in 10.02 seconds with the existing chunk-size warning; it does not build these suite/spec records themselves. Targeted formatting passed for eight matched Markdown files; this formatter-ignored evidence record was manually reviewed. All **476 local Markdown targets** across the changed records resolved, and incoming links to this new replay fragment were checked; other fragments and external URLs were not checked. WBS execution-register rows, WBS/ATP headings and dependency lines remained unchanged. Scoped evidence-path and diff-whitespace checks passed; new prose was manually reviewed for credentials, machine-local paths and student identifiers. Path checking is not secret scanning or runtime acceptance. No backend/browser tests or real-client calls were rerun for this documentary recording.

## Student lookup-to-summary increment (2026-10-25)

### Approved boundary and attribution

The user explicitly approved the [new lookup contract](../srs.md#approved-new-student-lookup-amendment-2026-10-25), including its three-field business-data disclosure, implementation, managed synthetic tests, required generation and bounded repairs. Implementation starts from clean Basic `c199a99042542a50c7ffef6e956a1030709b67cc` on `worktree-spec-basic-cabloy-mcp`. The earlier source fingerprints and user-reported Codex replay do not verify this new tool. This contributes only to the approved subsets of `WBS-MCP-30-01/30-02/40-01` and `ATP-MCP-CONTRACT-02/03`, `ATP-MCP-CALL-01/02`; parent tasks remain blocked, full ATPs open and verified **0/12**.

The new `training-student` Action uses method-only `training_student_lookup` opt-in and explicit `readOnly: true`, ordinary registered guarded dispatch and select-permission inheritance. Existing summary still inherits view. Its strict query accepts only a trimmed nonempty name of at most 100 characters, optional level 1/2/3, integer positive pageNo (default 1), and pageSize 1..20 (default 10). Results use the existing listAndCount envelope with string total and fixed ID-ascending order. An inferred DTO selects only ID/name/level; query columns and explicit item construction also enforce the runtime boundary. The Model predicate uses bound values and explicit `!` escaping for literal `%`, `_` and `!`, nested within ordinary Model where handling so instance/deleted constraints remain active. No relations are loaded. No mapper, ordinary select, summary, persistence schema, migration or anonymous standalone change is intended.

### Retained attempts and contract generation

The first `npm run tsc:vona` exited **1** with `TS2322` at `training-student/src/service/student.ts`: a top-level Knex raw predicate is not assignable to Model where. Source inspection also showed that Model copies the outer where object before adding scope constraints; the implementation was corrected to a nested supported predicate, not a scope-disabling query or generic ORM change. `npm --prefix vona run tsc:native` then exited **0**. The first root pnpm entrypoint automatically reconciled dependency links and rewrote 72 lockfile specifiers; inspection confirmed no resolved-version changes, and only those incidental lockfile rewrites were removed. Later checks use direct npm/native entrypoints, not a dependency reinstall as a debugging step.

`npm run contract:generate:isolated -- training-student` exited **0**, generating the student API/ApiSchema and OpenAPI types/schema aliases from a managed isolated test backend. Generated aggregate OpenAPI types also refreshed already-existing MCP test/auth operations and two commerce field descriptions from that composition; they were not hand-edited or presented as new API implementations. The first scoped frontend typecheck exited **1** with `TS5058` because its project path redundantly included the workspace prefix. The corrected workspace-relative native no-emit check with `--incremental false --composite false` exited **0** for the frontend student module. Affected `mcp-test` native typechecking also exited **0**.

The first correctly listener-disabled mapper/standalone selection passed **20/21**, exit **1**. The new contract assertion incorrectly flattened an optional level schema branch without an enum, producing `[1,2,3,undefined]` instead of `[1,2,3]`. The nested-output/default/trim regression and all standalone tests passed in that attempt; the failed schema assertion is retained, not reclassified as a pass. Its bounded repair and final managed results are recorded below when observed. Two focused mapper follow-ups each passed **12/13**, exit **1**, confirming inherited `rest` UI metadata in the projected item schema; the no-UI-metadata assertion was preserved. The normalization/nested-output test passed, but malformed-input checks located after the schema assertion had not yet run.

The first shared HTTP/student selection passed **23/26**, exit **1**. Both valid lookup flows failed because ordinary Action query binding serializes numeric values as strings while literal-union level validation does not coerce them. The request level validator was changed to integer `1..3`, preserving the exact numeric allowed set and strict raw MCP input validation. A third failure was an incorrect direct-Action assertion: its ordinary query serializer legitimately converts an array value to a string before validation. That assertion was removed from the HTTP-binding test; the MCP boundary continues explicitly rejecting array-valued names before dispatch. No generic query-coercion behavior was changed. The actual runtime for these new commands is Node **24.8.0**, below the root manifest's `>=24.11.0` engine recommendation; earlier evidence's Node version is not reused as this run's version.

The corrected shared HTTP/student command passed **26/26**, exit **0**. It exercises registered Action validation, defaults, literal `%`/`_`/`!`/quote/backslash matching, ordering, pagination, exact service result fields and current-instance exclusion. The guarded modern/legacy flow uses the lookup-returned ID for summary under both read/all scopes, checks denied callers, and reloads/revokes test-owned membership in the existing read-only systemAdmin role. Fixtures are synthetic, owned by `mockCtx` boundaries and removed in `finally`; no shared role definition or development membership is changed. RBAC catalog assertions establish lookup → select and summary → view. This is **not** runtime proof of a select-only principal lacking view; that distinct permission scenario remains unexecuted.

The DTO-local `fields` overlay clears inherited `rest` for ID/name/level while retaining `$Dto.get` model inference. The following mapper/standalone run passed **20/21**, exit **1**, at a different assertion: OpenAPI emits optional level as `type: ['integer', 'null']`, not a single integer type. Its schema-shape assertion was corrected to that established representation; raw MCP rejection of null remains required and was not relaxed. Both affected backend modules' final native no-emit typechecks exited **0**; changed-file formatting/lint also exited **0** at that revision. Final mapper results and regeneration are recorded below.

### Final managed procedures and observations

| Procedure | Observed result |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts` | **21/21**, exit **0** after the retained fixes. Exact shared/standalone catalogs, input bounds/types/control rejection, schema closure, nested runtime projection and JSON-text/structured equality pass; anonymous standalone remains three fixtures. |
| `npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | **26/26**, exit **0** after the query-binding fixes; final rerun after the DTO metadata overlay and final generation also passed **26/26**, exit **0**. |
| `PROJECT_DISABLED_SUITES=a-training SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | **13/13**, exit **0**; both student tools absent from the actual Training-disabled shared composition. Training-dependent test branches intentionally return without executing their assertions; this is catalog-composition proof, not a second lookup business-flow pass. |
| `npm run contract:generate:isolated -- training-student` (final source) | Exit **0**. Student API/ApiSchema/OpenAPI consumers regenerated, never hand-patched; output item stays model-inferred `id/name/level`. The generated request type uses `number` for level, with integer `1..3` validation retained in backend schema/runtime. |

Final frontend student and backend MCP-test native checks used `node scripts/typecheck.ts native <workspace> --noEmit --incremental false --composite false --project <workspace-relative module>/tsconfig.json`; both exited **0** after generation and the final assertion change. Final changed-file formatting and source lint passed. `docs:build` exited **0** in **10.57 seconds**, with the existing >500 kB chunk warning; it builds public docs, not suite/spec Markdown. All **350 local Markdown path targets** in the five changed spec/evidence records resolved; external URLs and every historical fragment were not checked. Evidence-path checking passed; manual review found no newly retained credentials, machine-local paths or real student identities. This check is not secret scanning or runtime acceptance.

Final `spec:check -- cabloy-mcp` passed **68 definitions**. Chart generation and freshness checks passed in English with **0/12 verified**, with no chart-byte diff. These are independent structural/derived-view gates, not human acceptance or runtime proof. The approved finite implementation/check scope is complete; no broader Proposed ADR was accepted and no parent WBS/ATP status was promoted. Scoped evidence-path and diff-whitespace checks passed after recording.

### Source attribution

The following SHA-256 fingerprints identify the checked implementation/test bytes relative to baseline `c199a99042542a50c7ffef6e956a1030709b67cc`; they do not attest a separately running development server or client session.

| Repository-relative source | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/dto/studentLookupReq.tsx` | `df983802c259ef06be68364c7062dff56cbc7b86999023c0f727e651415818b2` |
| `vona/src/suite/a-training/modules/training-student/src/dto/studentLookupItem.tsx` | `83ec186f5024de604825e70ede4b6522101e40841d224289699f8e1f894bb709` |
| `vona/src/suite/a-training/modules/training-student/src/dto/studentLookupRes.tsx` | `2c40d917cb25970508dfc28a2a78df4a968d52223a4c9466d7d6aa1e38832ad2` |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `5608bb77162de55e28fad6ebe66d2ab97392f65fee3379d5d946f4015581ba51` |
| `vona/src/suite/a-training/modules/training-student/src/service/student.ts` | `9acd0b651fcdbf494b1fce761144c11e9244439596407ea568823315bc82f7fa` |
| `vona/src/suite/a-training/modules/training-student/test/student.test.ts` | `1dcb85e9b19d46f48f0a5b8748eed790cae84c88b49a8dfeade461d88a0f9ed6` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `131bcea0fd07298c3d372f115eae58380ce505cecbd628af2513649cd87c2b10` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | `0f28558257a1c8c6f511980880e4399899a2ea963ecb54fd3ffa6b35c271aed9` |

### Verification disposition

**Implementation complete; the approved bounded automated checks pass.** This does not mark any parent WBS verified or close a full ATP: parent rows remain blocked, full ATPs open and verified **0/12**. At the automated handoff, real-Codex lookup proof was pending. The first client attempt stopped at discovery and the next stopped for a missing authorized target name; both remain historical below. The [subsequent user-reported lookup → returned-ID summary success](#user-reported-codex-lookup-to-summary-success-2026-10-25) closes this bounded happy-path gap, without independent served-source attestation or broader acceptance. No live grant, write or reset is implied. The runtime select-only/no-view scenario and engine-version qualification limits remain as stated above. No production qualification is claimed. No development database writes/reset, live role grants, environment/port changes, process killing, deployment, commit or push are included.

## User-reported Codex lookup discovery failure (2026-10-25)

After approving the separate bounded real-client replay, the user reported that **step 1 failed**: the current client tool directory lacked `mcp__test__training_student_lookup`, while `mcp__test__training_student_summary` was present. They stopped immediately. Steps 2–4 were not executed, field/identity consistency was not checked, and there were **no business tool calls, retries, or changes to code, permissions, configuration, business data or services**.

This is a user-reported client-directory discovery failure, not a lookup Action error, a summary denial, an independently captured protocol transcript or a proven server root cause. Client version, endpoint, served-source revision, session/catalog refresh behavior and actual wire-level `tools/list` response were not supplied. Summary visibility alone does not identify the connected runtime or establish why lookup is absent. No credentials or student data were supplied or retained.

Recording remains at Basic `c199a99042542a50c7ffef6e956a1030709b67cc` plus the preceding attributed uncommitted lookup/spec/generated-consumer changes. The local controller and lookup-item DTO fingerprints still match the table above; this does not attest the source served to Codex. This report changes only this evidence record and progress, preserving the earlier managed-test results without treating them as client acceptance. The assistant did not invoke Codex or any business tool, change runtime/registration/permissions, or retry the replay.

**Disposition:** implementation and its bounded automated checks remain complete, but real-client lookup → returned-ID summary acceptance is blocked at discovery. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged. The next diagnostic action is a bounded read-only comparison of the existing connection's served source and a fresh server catalog; no restart, registration change, permission grant or further replay is executed by this recording.

Recording checks passed: `spec:check` **68 definitions**; English chart generation/freshness **0/12**, no chart-byte changes; scoped evidence-path, diff-whitespace and progress formatting checks; the new incoming evidence fragment was verified. The formatter ignores this evidence file, whose added prose was manually reviewed. `docs:build` exited **0** in **9.93 seconds** with the existing chunk-size warning; that build does not render suite/spec Markdown. No business tests or client calls were rerun for this documentary update. These checks do not resolve discovery or establish real-client acceptance. The later report below supersedes only the discovery-blocker disposition, without erasing this failed attempt.

## User-reported Codex discovery recovery and missing target (2026-10-25)

The user reports that a **new session still did not show lookup**. The original recording treated the later App restart and MCP reauthentication as combined setup actions. The user subsequently clarified the sequence: **restarting Codex App alone did not work; reauthenticating MCP afterward restored visibility** of both `mcp__test__training_student_lookup` and `mcp__test__training_student_summary`. Reauthentication was the reported effective recovery step, not App restart alone. This corrects the earlier attribution; the underlying cache, connection, credential or discovery mechanism is not proven. No token, credential or authentication transcript is retained.

For the following replay, the reported actual tool was `functions.exec`, used to check the directory, not either student business tool. **Step 1 passed** because both tools existed. **Step 2 stopped** because the current context had no previously authorized, successfully read student name. Lookup was not called. Steps 3–4 were not executed; field/identity consistency was not verified and summary was not called. The user reports no retries or modifications during this replay. That no-modification statement applies to the replay itself, not to the preceding App restart and MCP reauthentication.

This remains user-reported client evidence, not an assistant-captured `tools/list` response or successful business call. Exact `functions.exec` command/output, client version, endpoint, active scope and served-source revision were not supplied. Recording remains at Basic `c199a99042542a50c7ffef6e956a1030709b67cc` with the preceding attributed lookup/spec/generated-consumer changes; this continuation changes only evidence/progress. No source fix, runtime operation, business invocation or permission change was performed by the assistant.

**Disposition at that attempt:** discovery was reported recovered; real-client lookup → returned-ID summary acceptance remained unexecuted, awaiting an explicitly authorized target name in the Codex context. The subsequent success below supersedes that missing-target blocker, not the historical stopped attempt. The earlier discovery failure remains historical. The next single action is for the user to supply one student name they are authorized to read and approve for this check, then continue the existing bounded read-only lookup/summary procedure. Do not guess names, enumerate unrelated students, reuse isolated-test identities, create data or grant permissions. Only return minimized pass/fail and identity/field equality checks, not student names, IDs, notes or credentials. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged.

Recording checks passed: `spec:check` **68 definitions**; English charts generated/checked at **0/12** with no byte changes; scoped evidence-path, progress formatting, new evidence-fragment and diff-whitespace checks. Added evidence prose was manually reviewed because the formatter ignores this file. `docs:build` exited **0** in **10.30 seconds** with the existing chunk warning; it does not render suite/spec Markdown. No business tests, client calls, restart or reauthentication were performed by the assistant for this update.

## User-reported Codex lookup-to-summary success (2026-10-25)

The user reports the following successful real-Codex sequence within the approved lookup contract and read-only replay. This is their reported outcome, not an assistant-driven client call or independently captured protocol transcript.

| Actual client tool reported | Input/procedure | User-reported observation |
| --- | --- | --- |
| `mcp__test__training_student_lookup` | Only the authorized target name supplied; optional inputs omitted | Success. Envelope strictly `list`, `total`, `pageNo`, `pageSize`, `pageCount`; total is a string, pageNo **1**, pageSize **10**. The unique matching item contains exactly `id`, `name`, `level`, without mobile, full notes or UI metadata. |
| `mcp__test__training_student_summary` | Uses the ID returned by this lookup, not a preprepared identity | Success. Exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText`; the three identity fields agree with the lookup item, and summary content agrees with its related returned fields. No mobile or full notes. |

The user reports **no retries, modifications or expanded queries** during this successful replay. Student name, ID, summary text and other record contents are deliberately omitted; only field-set and equality observations are retained. The earlier user-performed MCP reauthentication is a preceding recovery action, not a business-permission grant inferred from the successful calls. The clarified observation is App restart ineffective, followed by reauthentication effective; no specific internal cache or authentication root cause is claimed.

Recording baseline remains Basic `c199a99042542a50c7ffef6e956a1030709b67cc` plus the preceding attributed lookup/spec/generated-consumer edits on `worktree-spec-basic-cabloy-mcp`. The local controller, service and lookup-item DTO fingerprints match the implementation table above. The evidence/progress patch SHA-256 immediately before this recording was `47a37f70e70a0c4dd97b351850ff085fdab92b1ce3c4f9a998d98132f3315d31` (`git diff --binary --` those two paths); it identifies the prior documentary state, not the served runtime. This update changes evidence/progress only and does not attest the exact source loaded by the client connection.

**Passed: user-reported bounded real-Codex lookup → returned-ID summary happy path.** This closes the selected implementation's real-client gap; the earlier directory failure and missing-target stop remain retained, not reclassified as successful calls. Exact client version, endpoint, account/instance, granted scopes, served-source hash, exit codes and wire transcript were not supplied. Reachable-schema inspection and equality of JSON text versus structured content were not separately reported. Successful reads do not prove select-only/no-view denial, role revocation, cross-instance denial, both transport modes, every server-side effect or production qualification; existing managed tests remain separately attributed.

No further replay is required for this bounded outcome. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged. No broader ADR acceptance, source implementation, permission/environment/registration change, client call, restart, reset, commit or push is executed by this documentary recording. Another increment requires separate scope selection/approval.

Recording checks passed: `spec:check` **68 definitions**; English chart generation/freshness **0/12** with no chart-byte changes; progress formatting, success evidence-link/fragment, scoped evidence-path and diff-whitespace checks. Added/corrected prose was manually reviewed for privacy and chronological attribution; the formatter ignores this evidence file. `docs:build` exited **0** in **10.20 seconds**, with the existing chunk-size warning; it does not render suite/spec Markdown. No backend/browser tests or real-client calls were rerun for this documentary recording. Structural, derived-chart and human-reported runtime evidence gates remain separately attributed.

## Managed select-only student authorization proof (2026-10-25)

The user separately approved the finite test-only dossier and its managed checks, bounded repairs and evidence updates. Baseline: clean Cabloy Basic `9512dced75a7924616fa1e7a1330de2eefceae00`, branch `worktree-spec-basic-cabloy-mcp`. The sole source edit is `vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts`; no production contract or implementation changed. This contributes to `WBS-MCP-30-02/40-01`, principally `ATP-MCP-CALL-02` and supporting `ATP-MCP-CONTRACT-03`, under `PRD-MCP-IDENTITY-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-AUTH-02/03`, `SRS-MCP-DISPATCH-01/03`, the approved lookup amendment, ADR0010 and the bounded ADR0005/0006 dispositions. The [existing acceptance requirement](../test-plan.md#atp-mcp-call-02-guarded-fixed-dispatch-and-executor-option-rejection) governs the test; no requirement or full ATP was changed.

The existing serial managed HTTP fixture now temporarily registers an `a-rbac.resolvePolicy` listener restricted to its synthetic user, current default instance and student Controller. It allows only inherited `training-student.controller.student#select`, binds each decision to the actual Action descriptor, and denies view. Actual Passport/auth identity, the real RBAC Guard, registered fixed executor routes and `innerAccess: false` remain exercised. No role or membership is added for this select-only branch. The existing later systemAdmin/revocation regression remains separate and unchanged apart from the expected total dispatch count.

| Synthetic permission / scope / transport | Observed result |
| --- | --- |
| Select only / `mcp:read` / modern | Lookup succeeds with exactly `id/name/level` per item and one current-instance match; summary using its returned ID is denied. |
| Select only / `mcp:read` / legacy | Same success/denial and field boundary. |
| Select only / `mcp:all` / modern | Same success/denial; broader OAuth scope does not grant view. |
| Select only / `mcp:all` / legacy | Same success/denial and field boundary. |
| Listener removed / `mcp:read` / modern | Lookup and summary both return the existing minimized denial again; the detached listener records no further policy calls. |

All four pairs assert the exact five-field lookup envelope, string total, default pagination, exclusion of the same-name foreign-instance fixture, distinct lookup → select / summary → view policy observations, generic `Action failed` denial without structured content, and no mobile/full-note fields or values. A call-through observer records **zero summary service calls** during all select-only attempts; the Guard is not mocked into allowing requests. Eight policy observations match the four ordered lookup/summary pairs. The exact listener is detached and the observer restored in `finally`; existing outer `mockCtx(...)` cleanup removes owned content/students in their creation instances. Existing suite teardown owns OAuth/user fixture cleanup. No development grant, live student or shared-role definition was changed.

### Observed procedures and bounded repair

| Procedure | Result |
| --- | --- |
| `npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | First managed runtime attempt: **26/26 passed**, **0 failed**, **0 skipped**, exit **0**; existing test expanded rather than adding a test-count claim. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/mcp-test/tsconfig.json` | Initial and final checked bytes exit **0**. |
| `npm run format -- vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | Initial and final checked bytes exit **0**. |
| `npm run lint -- vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | Initial exit **1**, `e18e(prefer-array-fill)` on a constant `Array.from` callback. One bounded test-only repair uses `.fill(...).flat()`; final exit **0** without weakening assertions. |
| `npm run spec:check -- cabloy-mcp` | Exit **0**, **68 definitions**; structural authority audit only. |
| `npm run docs:build` | Exit **0**, **9.99 seconds**, existing >500 kB chunk warning. It builds public docs, not suite/spec Markdown. |

The actual runtime is Node **24.8.0** on Darwin with managed `better-sqlite3` test databases, isolated Redis identity, default and `shareTest` instances, and the normal enabled loopback listener. Root `engines.node` recommends **>=24.11.0**; this run does not qualify that newer runtime. Run `20261025141046-27238eba` shut down gracefully; its exact `vona/.app-test-20261025141046-27238eba`, `vona/.vona-test-20261025141046-27238eba` and `vona/.vona-test-claim/20261025141046-27238eba.json` paths were independently observed absent afterward. Startup reported retaining an older unrelated claim for live/uncertain ownership; it was not touched or represented as cleaned by this run.

Both producer streams were passed through the path sanitizer, with producer and sanitizer exits recorded separately. Producer/sanitizer exits were **0/0** for the passing procedures, **1/0** for initial lint. The first scoped capture check exited **2** because the test/docs logs still contained ANSI controls (`BINARY`), not because business tests failed. Text copies removing terminal controls only passed the scoped path check; no business rerun was needed or claimed. Raw captures remain local only. The durable minimized procedure/result and permission matrix are retained here, with no token, credentials, actual student identity or machine-local path. Path checking is not secret scanning or acceptance proof. An ancillary cleanup-inspection shell initially shadowed Zsh's `path` variable, causing subsequent hash/Git lookups to exit **127**; a fresh corrected read-only command verified the exact absences, source hash and whitespace check. No source or runtime retry followed that shell error.

Tested source SHA-256: `35605836f523e27c4f9715ce702877f981aa9d62d0fd29cfb1c5bb8fdc58fee2`. Source-only `git diff --binary -- vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` SHA-256: `0954fb3224e06e2c79881fdce39a51d9db9f68e28dd55b38bcdd2c21e9fa32b6`. These identify the dirty tested bytes relative to the baseline, not a deployed server or client session. Later documentary edits are outside that source-only digest.

**Disposition: the approved bounded select-only/no-view managed proof passes.** It resolves the runtime permission-separation gap explicitly left by the earlier lookup evidence, without reclassifying historical unexecuted scenarios or repeating the completed real-Codex happy path. It proves the selected synthetic policy-extension fixture, not a production grant provider or production authorization deployment. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12** unchanged. No Mapper/controller/DTO/persistence/frontend/environment/port change, development reset, dependency reinstall, client replay, deployment, commit or push was performed. Stop this increment after the applicable documentary checks; another increment needs separate scope selection/approval.

Documentary checks after recording: `spec:check -- cabloy-mcp` passes **68 definitions**; English chart generation/freshness passes at **0/12 verified**, with no chart-byte diff. Scoped evidence-path and diff-whitespace checks pass; both new evidence/acceptance link fragments resolve. Formatting passes for progress; the formatter ignores this evidence file, whose added prose was manually reviewed for chronology, synthetic-data minimization and privacy. The docs build above remains separately attributed and does not render these spec records. These structural/derived checks neither accept an ADR nor close a full ATP or parent WBS. Source and source-only diff hashes remain identical to the managed test run.
