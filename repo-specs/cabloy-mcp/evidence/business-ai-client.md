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

The instructed server invocation was `npm run mcp:test:local -- --seconds 180`, wrapped to print `server_exit`. The user supplied its actual loopback `/mcp` URL. The client handoff used the existing [public independent-terminal procedure](../../../repo-docs/mcp/mcp-commerce-local.md#8-real-ai-client-walkthrough-claude-code-21236-tested): one `claude --bare --print` call, strict inline HTTP MCP configuration, no built-in tools, exact three-tool allowlist, `--permission-mode manual`, disabled slash commands/browser/session persistence, `--max-budget-usd 1`, verbose stream JSON and the existing sequential returned-ID Chinese shopping prompt. This is the instructed procedure; no shell invocation echo or preflight-success output was supplied, so actual enforcement of every flag/auth prerequisite is not attested. No assistant-executed client/server call or retry occurred.

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

After the native DCR compatibility fix, the user reported successful real Codex App authentication, then requested a test prompt and confirmed its results in this conversation. They subsequently approved recording this bounded outcome. This is a retained user report, not an assistant-executed client retry or independently captured runtime transcript. The current [browser authorization profile](../decisions/0010-mcp-browser-execution-profile.md) and [backend guide](../../../repo-docs/mcp/mcp-browser-authorization.md) govern this flow; the preceding anonymous standalone evidence keeps its historical scope.

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

## Student permission-aware discovery (2026-10-26)

### Approval and attribution

After the finite [student discovery dossier](../pdp-wbs.md#student-discovery-execution-dossier-2026-10-25) handoff, `zhennann` explicitly approved its source/verification package. Preflight observed Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, unchanged HEAD `1c2ed5c47fc5502926c180a7e7fbd9165986c854` and five attributable carried planning edits, not a clean whole tree. This is only the approved connected contribution to `WBS-MCP-30-02` and the reauthorization subset of `WBS-MCP-40-01`, under the bounded SRS/ADR0005/0006 amendments and `ATP-MCP-AUTH-02`/`ATP-MCP-CONTRACT-02`/`ATP-MCP-CALL-02`. It neither accepts whole proposed ADRs nor changes blocked parent statuses, open full ATPs or verified **0/12**. Earlier real-Codex observations do not qualify the changed discovery behavior.

### Implementation and current qualification

The existing permission owner adds uncached Controller/action guard discovery through `checkPermissionControllerActionGuards(controller, action)`, while retaining the Resource/action `checkPermissionActionGuards(resource, action)` API for existing consumers. Both preserve Passport admission, composed guards, actual RBAC decision binding and exact state restoration without matcher projection or permission-result cache reuse. The mapper adds an optional server-owned registered-identity visibility callback, awaited sequentially after scope filtering and inside existing tracked work. Unexpected visibility failure returns only a whole-list nondiagnostic error. Shared construction scans enabled Controllers and cached registered routes rather than applying Resource-derived admission; calls retain independent guarded fixed dispatch. No business row probing, new authorization authority, transport change or duplicate capability/mode filter is introduced.

The HTTP regression covers neither/select-only/view-only/both permissions under both scopes and transports, fresh changes without cache flush, list-to-call revocation, zero student Controller/service/model reads during listing, authorized schema privacy and recovery after unexpected policy failure. Existing select-only call proof remains intact. Mapper tests use context-local synthetic Passport/policy fixtures rather than mocking the new permission checker.

The final approved command set now passes, as recorded below. The first mapper attempt's still-live root/cleanup anomaly remains independently open; later passing runs do not erase it. Individual case output and graceful-shutdown text are not root-exit or cleanup attestations.

### Retained attempts

- Initial scoped lint failed on three unbraced control statements in the new HTTP test. Installed lint autofix plus exact-file formatting repaired them; final mapper/HTTP style checks pass. No assertion was weakened.
- The first permission native check overlapped test authoring and saw two temporarily unused imports. After test authoring, a second check failed on synthetic Passport users lacking required `name`, a protected `permission.ctx` access and two guard-bean lookup overloads. Runtime success does not substitute for repairing these static diagnostics.
- First mapper/standalone run (`20261025165818-902127ec`) shows all **21 case lines passing**, followed by `App shutdown gracefully`, but no final summary/root exit. Its child remains live and its exact runtime, generated registration and claim paths remain present. It is **not a complete pass or cleanup proof**; no process was killed and no runner or environment setting was changed to bypass it. Bounded inspection found no concrete new fixture resource leak and did not establish a root cause.
- Actual Training-disabled run (`20261025171740-e0646123`) passes **13/13**, **0 skipped**, root exit **0**, producer/ANSI-filter/path-sanitizer **0/0/0**. The two student-output-only bodies return early when Training is absent; the first test explicitly checks the actual disabled composition rather than pretending to exercise student behavior. Exact run-owned runtime, generated registration and claim paths were observed absent afterward.
- First permission/shared HTTP run (`20261025172117-565b61d7`) exits **1**, **22/23 passed**, **1 failed**, **0 skipped**, producer/filter/sanitizer **1/0/0**. All **12 permission cases passed**. The new HTTP case stopped during observer setup: `ModelStudent.prototype.getById` is not an actual prototype method (it is supplied through the Model runtime). The bounded repair observes the real inherited `get` read method instead; existing `select`/`count`, Controller and service call-through observers remain. This failure is test instrumentation, not discovery-policy evidence. The managed owner retained failed resources; no manual deletion/reset was performed.
- Initial capture-path check used the wrong CLI separator and returned `INVALID_USAGE`; the next used the platform's temporary-directory symlink and reported `SYMLINK_EXCLUDED`. Correct `evidence:check -- --` with canonical capture paths passed. These path/tooling failures do not reclassify runtime results. Path sanitization is neither secret scanning nor acceptance proof.
- Docs build passes exit **0** in **8.61 seconds**, with the existing >500 kB chunk warning. The authority audit passes **68 definitions**; English chart generation/freshness passes **0/12 verified** without changing SVG bytes. These are structural/derived checks, not business acceptance.

### Managed permission/shared HTTP result

The exact dossier command, rerun after the Model observer repair, passes **23/23**, **0 failed**, **0 skipped**, duration **7220.367583 ms**, root exit **0**, producer/filter/sanitizer **0/0/0**. This includes all 12 permission regressions and 11 shared HTTP cases. Every scope/transport pair observes neither → lookup-only → summary-only → both → neither, then a successful list followed by revocation and independently denied known-name calls. Each list records both actual Action keys, with policy inheritance resolved by the real RBAC Guard. View-only does not imply select; no fabricated matcher terms are supplied. The existing select-only lookup/summary call proof and later systemAdmin/revocation/instance-isolation flow also pass.

Call-through observers record zero student Controller/service calls and zero Model select/count/get reads for discovery, revoked calls and unexpected-failure/recovery. Authorized summary schemas retain the exact six fields and exclude mobile/full-note names. Unexpected policy failure after earlier candidate work yields only protocol `-32603`, no partial result or private exception text; a subsequent view-only request succeeds. Permission tests separately prove exact route/innerAccess/decision restoration, ordinary 401/403 denial, unexpected exception propagation, no-terms guard admission without retrieval/cache/projection and missing/skipped/mismatched Action denial.

Run `20261025172411-d10bcaea` shuts down gracefully and its exact runtime, generated registration and claim paths are observed absent afterward. Failed run `20261025172117-565b61d7` remains retained by the managed owner. Test-owned policy listeners/mocks are removed in `finally`; existing precise student/content/role-membership/OAuth/user cleanup remains in place. No new persisted fixture was needed for the discovery matrix. Node **24.8.0** is still below the root **>=24.11.0** engine recommendation; these runs do not qualify that newer runtime or production policy/deployment.

### Final checks, fingerprints and disposition

After fixing the permission test's required synthetic names, captured-context comparison and exported `GuardRbac` class-token lookup, all three affected module native typechecks pass, producer/sanitizer **0/0** each. Existing old projection tests remain passing; no new production permission semantics or scope terms were invented. Final exact-file root format/lint checks pass for the six changed TypeScript files.

The unchanged mapper/standalone dossier command was repeated without a runner/configuration change. Run `20261025172511-d769b092` passes **21/21**, **0 failed**, **0 skipped**, **26518.452417 ms**, root exit **0**, producer/filter/sanitizer **0/0/0**; its exact runtime, generated registration and claim paths were observed absent. This proves a successful rerun, not the cause or cleanup of the first stalled attempt. A final permission/shared HTTP run after the static fixture repairs (`20261025172630-26c8df7a`) again passes **23/23**, **0 failed**, **0 skipped**, **7235.078292 ms**, root exit **0**, producer/filter/sanitizer **0/0/0**.

Final handoff checks confirm that run `20261025172630-26c8df7a`'s exact runtime, generated registration and claim paths are absent. Scoped format/lint, `git diff --check`, the authority audit (**68 definitions**), English chart generation/freshness (**0/12 verified**) and scoped evidence-path checks pass after the progress update; source hashes below remain unchanged. Chart files have no diff. Evidence-path checking does not establish secret scanning or acceptance. The first mapper child was still live at the last observation; no exit or cleanup is claimed for it.

SHA-256 of the tested source bytes:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite-vendor/a-vona/modules/a-permission/src/bean/bean.permission.ts` | `6da2f8845530885f6daa22d5b98a240ba9557e13a2d01cb0f282dfe964ec59a5` |
| `vona/src/suite-vendor/a-vona/modules/a-permission/test/permission.test.ts` | `81ef803110adc437f3632ae8fd639f37428a02d4455958fb399dd1465bd1d686` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `ad2f79c5e4617b238aacdad1a80f769e0cf914b9bbe679ef34fad37b7dbd825e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/sharedBusinessTools.ts` | `bca6743e22b16204bf9ed120a05c6ca8fb62b44ec4a135bf046359d7791e11be` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `075910a3a11506d9e78c1c601853396a4580d69cd12f4f29669854baf2834659` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/devHttp.test.ts` | `293b78b361e7ef14bc51c35a52e42e920ac80319532dda19fb6f4626c887f6e7` |

Source-only `git diff --binary HEAD --` over those six lexically sorted paths: SHA-256 `147a6014353d3d0aedbb2ecd134b901cc63a429c475aa91eb49170bdf6aed563`. This excludes documentary edits and identifies dirty bytes relative to the baseline, not a deployed endpoint or client session. The five carried authority edits remain attributable to the preceding approved planning increment.

**Disposition at the implementation handoff:** source implementation and final bounded automated checks pass. The first stalled mapper root remains a named operational verification/cleanup follow-up, so this handoff does not claim every attempt exited or all resources were cleaned. No automatic process kill, manual reset, test-runner patch or broader infrastructure investigation is authorized by these results. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12**. No real-client replay, live permission grant, business schema/DTO/route change, frontend generation, development reset, environment/port edit, install, deployment, commit or push occurred. Stop the connected implementation here; the next action is disposition of the first managed-run nonexit/retained resources under a separately bounded investigation, not another business-planning loop.

### First-run post-stop investigation (2026-10-26)

After that handoff, the background-task event for the first mapper command reported `killed`; its task output contains only `[killed]`, not a final command exit code or test summary. The event is not human approval and does not establish who or what stopped the command. The user subsequently explicitly approved the next bounded investigation. It is read-only process/resource and existing-source inspection plus updates to this evidence and progress; no kill, manual deletion, reset, runner/environment patch or additional managed test is included. Cabloy Basic and HEAD `1c2ed5c47fc5502926c180a7e7fbd9165986c854` are unchanged; carried edits remain attributable to the preceding approved work. The six-file source diff digest remains `147a6014353d3d0aedbb2ecd134b901cc63a429c475aa91eb49170bdf6aed563`.

Observed for run `20261025165818-902127ec`:

- The retained sanitized capture still has **21 passing case lines**, graceful-shutdown output and no final tests/pass summary. No normal root exit is inferred from the stop event.
- Read-only `ps` inspection finds the former test child absent. A deliberately limited claim projection reports `kind: unit`, `status: failed`, an absent same-host owner, and two same-host guardians marked `drained`; neither guardian PID nor any member of either recorded process group is present. No browser profile is registered. This removes the previously observed active-process condition at this observation, not every possible resource or process risk and not a substitute for the cleanup owner's validation.
- The exact paths `vona/.app-test-20261025165818-902127ec`, `vona/.vona-test-20261025165818-902127ec` and `vona/.vona-test-claim/20261025165818-902127ec.json` remain present. No cleanup lock is present. All four claim cleanup flags (`processes`, `databases`, `redis`, `locals`) remain `false`. Neither external database nor Redis state was queried or modified; their release is **not proven**.
- The claim projection excludes database/Redis inventories and endpoints, machine names and paths; generated `env.ts`/configuration and retained database/log contents were not read. Resource inspection used names/types/counts only, without following links or reading business data. One source lookup included a nonexistent `scripts/testClaim.ts` and exited **2**; the real cleanup source was located, with no command fallback or mutation.

Source trace establishes the boundary, not the root cause. `vona/packages-vona/vona-core/src/lib/core/meta.ts:135-174` prints the graceful message after awaited lifecycle hooks, context drainage, bean disposal and logger disposal; it does not call `process.exit`, and server closure is not awaited. `vona/packages-cli/cli-set-api/toolsIsolate/test.ts:102-120,145-148` starts closure on the `---done---` pass event but separately waits for both the Node test summary and reporter pipeline, without a timeout. The CLI child-close wait (`vona/packages-cli/cli-set-api/src/lib/bean/cli.bin.test.ts:98-106`) and managed guardian wait (`scripts/runIsolatedTest.ts:451-483`) are later completion boundaries. Thus the lifecycle message cannot prove test-stream, reporter or OS-process completion. No retained active-handle snapshot identifies which boundary originally stalled, and no specific leaked handle or defective fixture was established. The disposition is **unreproduced post-application-close nonexit; root cause unproven**, not a diagnosed runner bug. No timeout or forced-exit patch is justified by this observation alone.

`scripts/runIsolatedTest.ts:681-713` marks failed execution and retains resources; validated cleanup follows successful execution. Retention matches the existing [managed-run lifecycle](../../../repo-docs/reference/repo-scripts.md#test-isolation-and-development-data): interrupted/failed runs keep claims and resources. A later authorized managed invocation may consider claims older than the configured TTL (default one day), but only after the existing ownership, process, endpoint, path and lock checks. This investigation neither executes that lane nor changes its TTL, authorizes deletion, or promises cleanup will succeed. The successful unchanged rerun remains the **21/21, exit 0** behavior proof; it does not repair or reclassify the first interrupted attempt.

Bounded investigation disposition: recorded-process contention is no longer observed; resources are intentionally left retained; original nonexit cause remains unproven. Progress formatting, authority audit (**68 definitions**), English chart generation/freshness (**0/12 verified**), scoped evidence-path checking and diff whitespace checks pass for the updated records. No chart diff or infrastructure/source change is introduced by this investigation. No business runtime test or public-docs build was rerun for these evidence/progress-only additions. This closes the approved inspection/recording work, not root-cause repair, resource cleanup, full ATP acceptance or a successor implementation.

### User-reported restricted-client verification stopped before discovery (2026-10-26)

The user separately approved the finite real-client student permission-aware discovery check: use an existing independently known restricted identity and existing authorized target only; no account creation, permission changes, reauthentication, restart or expanded querying. This Claude Code session exposes neither student MCP tools nor control of the user's Codex session. No server `tools/list` or business call was issued by the assistant; absence of tools from this assistant session is not server permission-filtering evidence.

The user then reported:

| Observation | User-reported result |
| --- | --- |
| Permission category | Unknown; no independent identity-permission evidence in the current context. Stopped. |
| Tool directory versus expected authority | Not assessed; tool visibility cannot establish the permission category. |
| Business read | Not executed. |
| Result-field checks | Not executed. |
| Client version | Unknown. |

This is a user-reported **precondition stop**, not a passed or failed discovery assertion, authorization denial or observed server defect. No student identity, record content, token or raw response was supplied or retained. Existing automated results remain separately attributed and do not substitute for this missing real-client evidence.

Recording preflight observes Cabloy Basic, a clean worktree at `31127a17de29f787758697a4a30bec201eb4aa3b` (`Merge branch 'main' into worktree-spec-basic-cabloy-mcp`), rather than the earlier dirty implementation baseline. This recording changes only this evidence and progress; it neither reruns nor requalifies earlier runtime proof for the merged revision or the connected client. Served revision, connection identity, scope and independent select/view authority remain unestablished.

**Disposition:** restricted-client acceptance remains **open/pending**, solely at the missing independent permission-category prerequisite; directory, reads and fields are untested. Do not infer authority from catalog visibility, guess a target, grant permissions, inspect credentials, repeat the both-permissions happy path, or retry this procedure without new qualifying facts. Resume only when an existing authorized identity has independently established select/view authority; any later read additionally needs an authorized target in that client context. This prerequisite blocks this real-client verification branch, not unrelated business work. Parent WBS rows remain blocked, full ATPs open and verified **0/12** unchanged. No source, permission, connection, environment, database, process, deployment, commit or push operation is performed by this recording.

Recording checks pass: progress formatting, `spec:check` (**68 definitions**), English chart generation/freshness (**0/12 verified**, no SVG diff), scoped evidence-path checking and diff whitespace. The added evidence prose was manually reviewed; the formatter ignores this evidence file. The new progress link matches this heading. No business/client test or public-docs build was rerun for this evidence/progress-only update; structural/path checks do not establish runtime acceptance or secret scanning.

### Normal-module business ingress migration (2026-10-26)

The user approved the [finite ownership dossier](../pdp-wbs.md#normal-module-ownership-execution-dossier-2026-10-26), including distinct authority synchronization, bounded design and execution dispositions. Cabloy Basic preflight found only `__CABLOY_BASIC__`, clean HEAD `c1949336a67c6edb124777096ba42a57123c4d2e`; the resulting dirty worktree contains this approved connected increment. This contributes only to `WBS-MCP-20-01`, `WBS-MCP-30-01`, `WBS-MCP-30-02`, `WBS-MCP-40-01` and the [bounded ATP supplement](../test-plan.md#normal-module-ownership-proof-supplement-2026-10-26), not their full production acceptance.

**Delivered ownership and admission:** normal `cabloy-mcp` owns the sole authenticated `/mcp` middleware, exchange, exact composition and app-close drain. `mcp-test` retains synthetic controllers/catalog, mapper fixtures and the anonymous standalone launcher, explicitly injecting its factory into the relocated exchange. Normal source has no fixture-module import or required Training dependency. Construction admits exactly the registered, opted-in student `lookup` and `summary` Actions before schema extraction/name collisions; the same map restricts list and direct calls. Fresh independent select/view discovery and guarded calls, current-instance scope, minimized fields, current opaque-token Passport and actual-work settlement remain. Default-enabled/literal-false/application-override semantics are unchanged. Production and unknown runtime modes return nondiagnostic **503 before downstream work**; this is an enforced interim audit gate, not production audit implementation or availability.

Observed CLI operations, all exit **0**:

```sh
npm run vona :create:bean middlewareSystem mcp -- --module=cabloy-mcp
npm run vona :init:monkey cabloy-mcp
npm run vona :tools:metadata cabloy-mcp mcp-test
```

The generated normal middleware/monkey registrations replace the fixture owner's registration. Metadata generation also synchronizes existing fixture scalar/array/unsupported route typings; no new fixture Action was authored. There is no backend move generator; inspected authored ingress/exchange implementations were relocated, preserving lifecycle internals. No generated metadata was hand-edited.

#### Managed HTTP composition proof

Each command below uses the root managed isolated runner and synthetic test-owned identities/resources, not development data. Shared preparation writes were sequenced; no environment file, global origin/proxy setting or real role was changed.

```sh
SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts
PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts
PROJECT_DISABLED_MODULES=mcp-test PROJECT_DISABLED_SUITES=a-training SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts
```

| Composition / run | Observed result | Root exit |
| --- | --- | --- |
| First default attempt `20261026061028-28c5e12d` | 11 passed, 1 failed, 0 skipped; 7706.475709 ms | 1 |
| Corrected default `20261026061153-17e7b381` | 12 passed, 0 failed/skipped/cancelled; 7798.815875 ms | 0 |
| `mcp-test` excluded `20261026061237-b6f82d82` | 12 passed, 0 failed/skipped/cancelled; 7842.244209 ms | 0 |
| `mcp-test` and Training excluded `20261026061315-7c5b261d` | 12 passed, 0 failed/skipped/cancelled; 6094.511541 ms | 0 |

The first failure was the drain test's new unauthenticated closing probe: expected 503, observed 401 before exchange admission. The bounded repair adds the existing Bearer to the raw `openHttp()` probe; it does not change runtime precedence. The raw helper is required while work is held because `send()` waits for active work to settle. The failed run's exact runtime, generated registration and claim paths remain present and runner-retained, not manually cleaned or reclassified by later success.

The Training-present runs prove exactly one normal middleware/close owner, modern/native stateless legacy under both `mcp:read` and `mcp:all`, both student reads without `mcp-test`, unavailable synthetic/unapproved known names before `performAction`, four independent select/view categories, no business/row reads during discovery, revocation and unexpected-policy fail-closed behavior, independent summary access without lookup authority, current-role reload, output/schema privacy and current-instance absence. They retain canonical resource/selector, credential stripping, DCR, malformed/revoked/expired-token and consent-boundary checks. Shutdown holds an approved student lookup service call, invokes the actual normal monkey hook, keeps capacity owned until work finishes, rejects closing ingress and leaves the shared listener/metadata route available.

The Training-absent composition explicitly asserts actual module absence, empty authenticated discovery and rejection of both student names for each scope/transport; it also checks closing behavior and shared-listener survival. Three Training-dependent case bodies return early in that composition (discovery policy matrix, persisted student/role behavior and approved-Action Passport inspection); the reporter counts these as passed, not skipped. They do not claim those unavailable business behaviors were exercised without Training. Production/unknown-mode tests call real ingress with explicit metadata/request fixtures whose downstream getters fail if accessed; singleton runtime mode is never mutated. This is code-level denial proof, not a production deployment probe.

Successful composition runs' exact `vona/.app-test-<run>`, `vona/.vona-test-<run>` and `vona/.vona-test-claim/<run>.json` paths were observed absent. Tests preserve scoped `mockCtx(...)`, separate request contexts and precise reverse-order `finally` cleanup, including listeners/mocks/roles and test-owned student/OAuth/user resources. Path absence is local cleanup observation, not an independent database/Redis audit. Historical nonexit resources were neither inspected anew nor manipulated.

#### Mapper, standalone and shared-helper regressions

The initial standalone/config/guard subset passed **33/33**, zero failed/skipped, **23544.770292 ms**, root exit **0**, run `20261026060441-035268b7`. After test migration, the complete approved no-listener package ran:

```sh
SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/cabloy-mcp/modules/mcp-test/test/localHttp.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/config.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts
```

Run `20261026061356-61138dd6` passes **47/47**, five suites, zero failed/cancelled/skipped/todo, **27894.369791 ms**, graceful shutdown and root exit **0**. The fourteen mapper cases retain generic fixture-positive mapping separately from restricted normal composition and prove exclusion before duplicate names/malformed contract extraction without admitting an annotated sibling. Eight standalone HTTP cases retain anonymous three-tool modern/legacy flows, ingress/body boundaries, one-slot/cancellation/actual-work drain, real receive/execution deadlines and oversized-response rejection. Seventeen configuration and eight transport-guard cases remain passing. SDK JSON-notification advisories and expected negative-case diagnostics are not test failures. Both successful subset/full runs' exact runtime, generated registration and claim paths were observed absent. No standalone tool was added to the normal catalog.

#### Static checks and evidence attribution

Both affected native module checks pass, exit **0**:

```sh
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/mcp-test/tsconfig.json
```

One intermediate native check ran while the migrated HTTP test was still being edited and exited **1**, with unused imports and unresolved old synthetic/`closeDevTransport` names in that incomplete test. Completed-test checks and the final closing-probe repair check pass; the intermediate failure is not erased or attributed to unchanged runtime source. Root format/lint pass on all ten changed authored TypeScript paths, with the repaired test checked again. Scoped Markdown formatting and `git diff --check` pass. Public docs build exits **0**, with only the existing large-chunk advisory; sixteen suite-guide local file links and seven fragment links resolve. Public OpenAPI guidance adds no deprecated package-doc citation.

Node is **v24.8.0**, below the root **>=24.11.0** engine requirement; pnpm is **12.14.0**. No upgrade/install was performed. These results do not qualify a supported newer Node runtime. Local raw command logs were used for inspection only and are not durable evidence artifacts; this retained projection omits machine-local roots, credentials, token/callback values and student record contents. Path checking is independent from manual sensitive-data review and does not prove universal secret scanning or ATP acceptance.

SHA-256 of the tested source/test/registration bytes:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/package.json` | `fbb855369d7998087b3e7cf0b2cd3c9064a01a2ee75261c20767a25533b14aa3` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/.metadata/index.ts` | `4d4f0ef31ab7fe7f5e67e3695f179fc81b6e80ce6ccc9f6f98e133d9c19f24b3` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/bean/middlewareSystem.mcp.ts` | `e7c605582dac01caab69c2607a3840d82a5a69285e89f6957faf63d64a060fc1` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/index.ts` | `460d6bd92685c149019af6a5fb0fdc57063121cd0f58d1a4a103c30f0b04612f` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTransport.ts` | `4629096b374b32d31320c62d5231a40515887d23c5818a0c451a95276ca98ea2` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `c1136240fea08ac336b77d52018ac18954becf71836bbe7355ef6832f9a668d2` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts` | `53d77655e8d40266a2eefbaa66126ef9735c4d487ce2c922fe387869e09ea854` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `62643dd4c505b6dfb017e96addcb250d2cf6792bdb8e94b06a5962ce5b15ebfc` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/monkey.ts` | `a6dca387a2beaf31b78f881599785e99fba8799c8c22c3369d5e065f2ebbfa3e` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `d1e224a9b83efdb99d373188c3dbe88185751baea2ad9b5d2ef78cf5cbc2f536` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/package.json` | `1ef53f77753d26be49a4788ae25dfb7062f84711f2dff8fb96e00550394bf83f` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/.metadata/index.ts` | `464466194b7a1b8a5b90c14dff2dc619ba1924358676e8d77cca5eb90c966bb7` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/localTransport.ts` | `ccaeeb1feb9a14642bed3eabbda52f39e3ad7d03148b01b781391e9ece356e8d` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `b3b3cafbf9b4a10ea9ab7d28916dba5958c0645e77796c5e6e36fdc3726f7e6d` |

Module patch digest **`2d28e50d661a2c4e9ad4e5c20de015dc5696e1b44c9baddd6aa71a794aa94bea`** hashes the binary HEAD diff for lexically sorted tracked changed paths under `vona/src/suite/cabloy-mcp/modules/`, followed by concatenated `git diff --binary --no-index -- /dev/null <path>` output for the six lexically sorted new module paths. It includes removed old owners/test and excludes documentary edits. The baseline SHA alone does not reproduce these dirty bytes, nor do these hashes attest a deployed endpoint or real-client session.

**Final disposition:** all four approved managed compositions and required focused static/docs checks pass on the fingerprinted bytes after the retained test-only repair. Following the progress update, authority audit passes **68 definitions**, English chart generation/freshness passes with **0/12 verified**, scoped evidence-path checks and diff whitespace pass. Charts remain derived views, not ATP or design approval. This closes only the approved normal-module ownership/dev-test business increment. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12**; whole Proposed ADRs remain Proposed, protected production audit/controls unresolved, and restricted-client verification independently pending. No real-client replay, development schema/data/permission/environment change, reset/init, install, production activation/deployment, historical-resource cleanup, commit or push occurred. Handoff is the usable normal-owned dev/test two-tool entry, not automatic removal of the production gate or execution of another WBS item.

### Simplified MVP production admission (2026-10-26)

The user explicitly accepted the simplified MVP boundary and requested removal of the production-only 503, then approved the [bounded dossier](../pdp-wbs.md#simplified-mvp-production-entry-dossier-2026-10-26) and [proof package](../test-plan.md#simplified-mvp-production-admission-proof-2026-10-26). Basic baseline `c4106108f05d766e025fca55423fed414ccef3a6` was clean before this increment. Qualification is against its attributable dirty authority/guidance and two source/test edits, not the baseline SHA alone. The later SRS/ADR 0008/0010 dispositions supersede only the historical production-denial/audit prerequisite for the existing lookup/summary MVP. Dedicated protected audit, audit-outage gating and deployment-wide fine-grained quotas are deferred, not implemented or waived proof.

The runtime diff adds `app.meta.isProd` to recognized modes and updates its comment; downstream OAuth, current select/view guards, exact two-tool construction, instance isolation, minimized output, bounds and actual-work settlement are unchanged. The old fixture's nonframework `mode: 'production'` is replaced by actual `isProd: true`, `mode: 'prod'`. Local detached fixtures exercise real ingress/resource/protocol functions: ready/enabled production with explicit synthetic HTTPS authority and no bearer returns **401**, the canonical protected-resource metadata challenge and a generic no-store body, with no business entry/exchange. Unknown/missing mode and production not-ready, closing, disabled or missing-authority remain **503**. No global runtime mode, origin or proxy configuration is mutated. This is mode-admission proof, not production startup or deployment qualification.

Observed commands and results:

| Procedure | Observed result |
| --- | --- |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | **13 passed, 0 failed, 0 skipped; exit 0**, normal root completion and graceful shutdown. Managed run `20261026082226-b5fd40c9`; Training present, fixture module excluded. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json` | **Exit 0**, no diagnostics. |
| Scoped root lint on the two changed TypeScript files; scoped format on twelve changed source/guidance/authority files; `git diff --check` | All **exit 0**. Formatting was applied before qualification. |
| `npm run docs:build` | **Exit 0**, existing large-chunk advisory; does not build suite-local guides. |
| Local documentation file/fragment check | **48 link occurrences**, including **28 fragments**, resolve across new/changed links and the three current guides. Four unchanged external URLs excluded. |
| `npm run spec:check -- cabloy-mcp` | Initial **exit 1**, 66 definitions: the new dossier heading interrupted Phase 50 task parsing. Moving it before the Phase 50 heading, without changing task definitions/dependencies, restored **68 definitions, exit 0**. This documentary failure and correction do not alter tested runtime bytes. |

Both output streams of each retained local command capture passed through the existing path sanitizer, **sanitizer exit 0**. Individual lint/format/whitespace/spec exits were captured separately: the first grouped shell's overall exit 0 does not conceal its recorded `spec_exit=1`. Local captures use the `evidence/phase-20/artifacts/mvp-production-*-20261026.log` prefix; this tracked minimized record is the durable result projection, not a promise that ignored local logs are distributed. Manual inspection found no credential/token/callback values, student contents or machine-local roots in these captures. Expected Forbidden/Unauthorized and partial-request parser diagnostics come from negative tests, not test failures. The runner reported a historical claim retained for live/uncertain ownership; no manual cleanup or claim disposition was attempted, and successful completion does not prove release of historical retained resources.

Final record formatting/whitespace and authority audit pass, and English chart generation/freshness passes with **0/12 verified** (SVG bytes unchanged because modeled statuses remain unchanged). The first scoped path check exits **2** for ANSI-bearing HTTP/docs captures classified as `BINARY`; it is not a complete path-check pass. New text-only copies strip ANSI presentation escapes, then pass through the same sanitizer (normalizer/sanitizer both **exit 0**). The scoped check of those text copies, other textual captures and current evidence/progress exits **0**; original ANSI logs remain coverage exclusions. Path checks are not secret scans or ATP proof.

Tested source SHA-256:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts` | `5d49680148d0985cfb86624cc111bdedb59f56db75dd7a9c59b2e86afe918fa9` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `03d347c9fa770bd6bc08b0919380cc975cd95407db6bad75bb67ca14242e0795` |

SHA-256 of `git diff --binary --` followed by those two paths in the table's order: `d69e3670f1223c29630bfdadebe79c7423a65944196dafaa701810eecdcd1705`. This identifies the small dirty runtime/test patch, not a deployed source attestation.

Node **v24.8.0** remains below required **>=24.11.0**; pnpm **12.14.0**. No automatic upgrade/install occurred; supported-newer-runtime qualification is not claimed. This completes the bounded production-mode eligibility implementation/regression contribution to WBS 20-01/50-01/50-02 and ATP TRANSPORT-01/OPS-01/OPS-02, not entire parent tasks or full ATPs. Existing real-HTTP authentication, independent permission, privacy, instance and drain cases pass in the same suite. Audit compliance, fleet quotas, deployment and release acceptance are not claimed. Parent statuses/full ATPs and **0/12 verified** remain unchanged; restricted-client verification stays independently pending. No deployment, main-checkout synchronization, real identity/data/config/environment change, reset/init, dependency reinstall, commit or push occurred.

### Connected browser student-tool regression (2026-10-27)

The user explicitly approved the finite test-only execution dossier under `WBS-MCP-40-01`, supporting `WBS-MCP-20-04`/`WBS-MCP-20-02`, then requested continuation. The observed Basic baseline is `c99b5c828c8919dd78a3ab971cf458fd4ee9560b`, clean before execution, after a main merge since discovery. Impact inspection found no intervening changes to the selected MCP test, backend/frontend MCP suites or managed entrypoints. This is an independent bounded contribution, not execution or closure of the blocked parent tasks. Authority remains [ADR 0010](../decisions/0010-mcp-browser-execution-profile.md), its normal-owner/two-read amendments and the [current browser verification contract](../test-plan.md#current-bounded-browser-authorization-verification-contract-2026-10-24): bounded `ATP-MCP-AUTH-03` and `ATP-MCP-CALL-01`, supporting `ATP-MCP-AUTH-02`/`ATP-MCP-CONTRACT-03` and `SRS-MCP-AUTH-02`/`SRS-MCP-AUTH-03`/`SRS-MCP-PRIVACY-01`.

Only `repo-e2e/specs/mcp-authorization.spec.ts` is authored implementation: replace obsolete `commerce_categories_list` with exact two-tool discovery and student lookup → summary. Each successful authorization scenario creates its own synthetic student/content through the existing authenticated REST API and deletes that precise identity through `deleteForce` in `finally`. The existing seeded account is read-only; MCP receives only the new opaque OAuth token, never the fixture REST credential. Both scopes assert exact lookup fields/envelope and the six-field summary, plus absence of raw/masked mobile and full Markdown/HTML in structured/text results. Existing metadata/DCR, anonymous login/return, explicit consent, private no-store neutral SSR shell, hydration/error counts, S256 exchange, no-refresh, anonymous denial, code replay, denial and invalid-request checks remain.

An already installed **Node v24.11.0** was selected through invocation-local `PATH`, with **pnpm 12.14.0**; no runtime installation or default environment change. Existing bundles lacked attributable freshness, so `npm run build:zova:web` rebuilt the actual root Web Site's paired SSR/REST artifacts, followed by `npm run deps:vona`. No Admin/Commerce rebuild, API origin override or source consumer patch was needed. The Site declares `ssr-cabloyBasicWeb-5.0.0`; Vona integrated SSR supplies the managed listener origin. Dependency synchronization automatically reconciled 70 lockfile dependency specifiers across generated REST importers; resolved package versions did not change. This generated `vona/pnpm-lock.yaml` delta is retained separately, not described as a hand-authored dependency upgrade or clean source baseline. The command reused installed packages (zero downloaded), not a dependency reinstall or drift workaround.

| Procedure | Observed result |
| --- | --- |
| `npm run build:zova:web` | **Exit 0**, both Basic Web SSR and REST complete. Build plugin-timing advisories only. |
| `npm run deps:vona` | **Exit 0**; generated lockfile specifier reconciliation, no authored backend change. Existing peer/deprecation/store advisories remain. |
| First `npm run test:e2e -- mcp-authorization` | **2 passed, 2 failed, exit 1**, managed run `20261027011234-bf13fb2e`. Both successful-authorization tests reached actual lookup, then failed because the new test expected the numeric REST creation ID while MCP returns its string representation. Denial and invalid-request scenarios passed. `finally` deletion assertions did not fail. No application defect or authorization bypass is inferred. |
| Test-only correction and same managed command | **4 passed, 0 failed/skipped, exit 0**, run `20261027011408-fc21b2f9`, one browser worker, normal application shutdown. Expected IDs are now `String(studentId)`; no business/security expectation was relaxed. Both scopes complete lookup → summary and precise deletion. |
| `npm run format -- repo-e2e/specs/mcp-authorization.spec.ts` | Initial **exit 1**; scoped `oxfmt --write` and both later checks **exit 0**. |
| `npm run lint -- repo-e2e/specs/mcp-authorization.spec.ts`; `git diff --check` | **Exit 0**, including final corrected test bytes. |
| `npm run docs:build` | **Exit 0**, existing large-chunk advisory only. This public build does not compile suite-local evidence pages. |
| `npm run spec:check -- cabloy-mcp` before evidence/progress update | **Exit 0**, 68 definitions; static authority structure, not runtime or approval proof. |

Successful-run claim, exact `.vona-test-<run>` generated root and `.app-test-<run>` data root are absent. The failed run remains `failed`, with both owned local roots retained and all four cleanup flags false; no manual cleanup was attempted. The runner also retained historical claim `20261020024644-91d861ba` for live/uncertain process ownership. Passing current tests does not release or qualify historical retained resources. Bad Request stacks correspond to intentionally invalid/terminal request scenarios, not failed final assertions. No credentials, callback values or raw private records are copied here; traces/videos/screenshots remain disabled by the existing spec.

Qualification identifies dirty test/build inputs, not the base SHA alone:

| Input | SHA-256 |
| --- | --- |
| Final `repo-e2e/specs/mcp-authorization.spec.ts` | `4a2cf73a23bba17126cb7380dba3e5ca0c18b20cb835c974b0ab6993cc997496` |
| `git diff --binary -- repo-e2e/specs/mcp-authorization.spec.ts` | `a8b97ef10a4185b9d3fe1f69f941a5fa203a2645d326ba4fd7b85cc0e2851154` |
| Generated `vona/pnpm-lock.yaml` | `54b0b9fa66eb1b6ac767e7c94f56d20f4c4db6773f4bb2cc8098332b09993d3d` |
| `git diff --binary -- vona/pnpm-lock.yaml` | `0a0054b90a37ba3d9f4b348c3f67540a89d041a04245fa031d94075b7c01fb72` |
| Rebuilt `zova/dist-releases/ssr-cabloyBasicWeb-5.0.0/handler.js` | `ba3778e62aa45fd4301c86f9f3a63eb0a2197eb0cb56948a9c890353da8c7421` |
| Rebuilt `zova/dist-releases/rest-cabloyBasicWeb-5.0.0/index.mjs`, identical to `zova/dist/rest-cabloyBasicWeb/index.mjs` and synchronized `vona/.zova-rest/cabloy-basic-web/index.mjs` | `e1c55cea6af7f77c83b65ed09ad2dea46bc078911f246508e01600a03ff8495f` |

Both producer streams passed through the existing path sanitizer, sanitizer **exit 0** for the commands above. These ignored local command captures are inspection material; this minimized record is the retained proof projection. Manual review excludes local roots, credentials, OAuth values and synthetic record contents. The path tool did not recognize every path embedded in regex diagnostics or a store advisory; those raw captures are not retained as distributed evidence. Path checking below covers this reviewed record/progress only and is not secret scanning or ATP acceptance.

After evidence/progress updates, `npm run spec:check -- cabloy-mcp` passes **68 definitions, exit 0**; `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` both exit **0**, English labels and **0/12 verified**, with SVG bytes unchanged. Scoped record formatting exits **0** for matched inputs, and `npm run evidence:check -- -- repo-specs/cabloy-mcp/evidence/business-ai-client.md repo-specs/cabloy-mcp/progress.md` plus `git diff --check` exit **0**. Authority structure, derived-view freshness and actual approved runtime evidence remain three independent results, not interchangeable acceptance gates.

The bounded connected browser regression passes on a supported Node runtime; this does not requalify the historical HTTP/production-mode suites on that runtime. Parent WBS statuses remain blocked, full ATPs open and verified **0/12**. Restricted real-client verification remains independently pending, and audit/fleet capabilities remain deferred. No schema/version, business/auth/role, dev data, environment/port or main-checkout change, reset/init, deployment, commit or push follows.

### Supported-Node normal HTTP qualification (2026-10-27)

After the connected-browser handoff, the user approved the next step. The existing [progress handoff](../progress.md#connected-browser-student-tool-regression-qualified-2026-10-27) identifies supported-Node qualification of the normal-owner HTTP suite; execution was explicitly limited to that verification-only increment and its evidence/static/documentation checks. Basic baseline **`38ed62af0f3a5b7ec1690218f774085f2fc4df9b`** was clean. Its predecessor-to-HEAD diff contains the prior browser repair/evidence and generated lockfile reconciliation, not changes to MCP backend/Training source or the managed runner. No source, test, dependency, schema, permission or runtime configuration change was made for this increment.

This contributes bounded proof to `WBS-MCP-20-01`/`WBS-MCP-50-01`/`WBS-MCP-50-02` under the [simplified MVP proof contract](../test-plan.md#simplified-mvp-production-admission-proof-2026-10-26), including `ATP-MCP-TRANSPORT-01`/`ATP-MCP-OPS-01`/`ATP-MCP-OPS-02` and supporting current permission/privacy/dispatch checks. ADR 0010's later two-read MVP disposition remains controlling; no deferred audit/fleet capability, complete ATP or production deployment is inferred.

The already installed **Node v24.11.0** was selected through command-local `PATH`; pnpm remains **12.14.0**, meeting root engine minimums. There was no installation, persistent environment edit, frontend rebuild or dependency synchronization in this verification-only step. All commands ran from the active worktree root.

| Exact procedure | Observed result |
| --- | --- |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | **13 passed, 0 failed, 0 skipped/cancelled/todo; managed exit 0**, run `20261027014742-5490ffc8`, normal application shutdown. Training present; fixture module excluded. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json` | **Exit 0**, no diagnostics. |
| `npm run docs:build` | **Exit 0**, existing large-chunk advisory only; public build does not compile suite-local evidence records. |

The HTTP run covers normal middleware/close ownership, modern and legacy discovery/calls, exact two-tool admission and excluded known-name denial, fresh independent select/view authorization, instance/privacy boundaries, DCR, canonical authority/Bearer and credential stripping, invalid/revoked/expired token denial, decision-origin rejection and actual-work drain without closing the listener. Detached production fixtures reach the normal missing-Bearer 401 boundary while unknown mode/readiness/closing/disabled/missing-authority cases deny; these are not real production startup or deployment tests. Parser/Unauthorized/Forbidden diagnostics are intentional negative cases, not failed tests. Test-owned scoped resources and intentionally competing contexts retain existing precise cleanup rules.

The successful run's exact claim, `.vona-test-20261027014742-5490ffc8` generated root and `.app-test-20261027014742-5490ffc8` data root are absent. The runner reported historical claim `20261020024644-91d861ba` retained for live/uncertain process ownership; no manual cleanup, process termination or claim investigation occurred. No historical failure/retention disposition is replaced by the passing current run.

Tested unchanged source SHA-256, matching the earlier simplified-MVP evidence:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts` | `5d49680148d0985cfb86624cc111bdedb59f56db75dd7a9c59b2e86afe918fa9` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `03d347c9fa770bd6bc08b0919380cc975cd95407db6bad75bb67ca14242e0795` |

Both command streams passed through the existing path sanitizer; producer and sanitizer exits above are separately **0**. Local ignored captures are inspection material; this manually reviewed minimized projection is the retained record and excludes machine-local roots, raw tokens/callbacks, identity credentials and private record contents. Path checks do not establish secret scanning or acceptance.

After evidence/progress updates, scoped record formatting, `npm run spec:check -- cabloy-mcp` (**68 definitions**), `npm run spec:charts -- cabloy-mcp`, `npm run spec:charts:check -- cabloy-mcp`, scoped `npm run evidence:check -- -- repo-specs/cabloy-mcp/evidence/business-ai-client.md repo-specs/cabloy-mcp/progress.md` and `git diff --check` all exit **0**. Charts retain English labels and **0/12 verified**, with no SVG diff. Authority structure, chart freshness and actual runtime qualification remain independent gates.

The supported-runtime limitation is closed only for this normal-owner HTTP suite/native check and the separately retained browser run. Other historical compositions or full ATPs are not requalified. Parent statuses remain blocked, full ATPs open and verified **0/12**; restricted real-client verification remains independently pending until current select/view authority and any read target are independently established. No reset/init, development data/environment change, deployment, install, main synchronization, commit or push occurred. This finite verification increment is complete; no automatic additional suite or hardening work follows.

### User-reported ChatGPT identity and both-permissions category (2026-10-27)

Following the user's instruction to execute the previously recommended task, the assistant requested only non-secret current-connection authority facts. The user reported **ChatGPT 26.1021.31345**, authorization account **admin**, the **default empty instance**, and **both student select and view permissions**. The supplied basis refers to existing role/permission configuration and account-administrator confirmation. These are user-reported facts, not an assistant inspection of the connected token, authenticated request context, effective guards or deployment. The connection is not assumed to be the same client/session as earlier Codex evidence.

This supplies a reported permission category for the currently identified ChatGPT connection; it supersedes the unknown-client/category handoff only for that connection. Both student tools are expected under otherwise valid ingress/scope/composition conditions, but no ChatGPT tool-directory observation, business read, output-field check, served revision or scope was supplied or independently observed. No actual ChatGPT discovery/read success is claimed. The earlier restricted-client precondition stop remains historical; this both-permissions identity does **not** supply select-only, view-only or neither-permission real-client evidence. The existing bounded procedure excludes an extra both-permissions happy-path replay; no restart, reauthentication, grant, revocation, account creation, guessed target or additional querying is performed.

Recording baseline is Basic `38ed62af0f3a5b7ec1690218f774085f2fc4df9b` with two attributable carried documentation edits from the supported-Node HTTP qualification above. This update changes only this evidence file and progress. No source, test, dependency, environment or development data is changed; no runtime/client call, commit or push occurs. Parent WBS statuses, open full ATPs and **0/12 verified** remain unchanged. The permission-information handoff is complete for the reported connection; restricted-identity real-client verification remains pending and is not a global business-development blocker. Resume that branch only if an existing restricted identity and its independently established authority become available; an eligible read additionally needs an existing authorized target. Do not modify the current admin account's permissions merely to manufacture coverage.

### Complete existing student select tool (2026-10-27)

The user requested making the existing `ControllerStudent.select()` an MCP tool with its complete result and approved the finite authority/design/execution plan. The [SRS amendment](../srs.md#approved-student-select-extension-2026-10-27), [bounded dossier](../pdp-wbs.md#student-select-extension-dossier-2026-10-27) and [proof procedure](../test-plan.md#student-select-extension-proof-2026-10-27) govern this contribution to `WBS-MCP-30-01`/`WBS-MCP-30-02`/`WBS-MCP-40-01`. Basic baseline **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, branch `worktree-spec-basic-cabloy-mcp`, was clean before this increment. Qualification applies to its attributable dirty source/tests and bounded authority/guidance amendments, not the base SHA alone. Earlier exact-two-tool evidence remains historical; this entry replaces that catalog expectation only for the approved third read, without accepting whole Proposed ADRs or closing their parent tasks.

The runtime change is limited to native `@Mcp.tool({ name: 'training_student_select', readOnly: true, ... })` with no output pick/omit, plus exact `select` admission on the existing Student controller. The HTTP Action's route, DTOs, `Arg.filter`, serializer, RBAC and service remain unchanged, as does the generic mapper. Full output means `list`, `total`, `pageNo`, `pageSize`, `pageCount` and existing serialized rows—not raw records, newly loaded relations or an unbounded export. The fixture's matching-format mobile remains masked. Existing DTO validation normalizes numeric identities/total to strings and absent optional SQL `imageId: null` away; the parity assertions explicitly account for these existing wire rules without removing other fields.

Observed on installed **Node v24.11.0**, selected through command-local `PATH`, with pnpm **12.14.0**:

| Exact procedure | Final observed result |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | **31 passed, 0 failed/skipped, exit 0**, run `20261027095307-3e16bc20`. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | **13 passed, 0 failed/skipped, exit 0**, run `20261027100120-795b12a5`. |
| `PROJECT_DISABLED_MODULES=mcp-test PROJECT_DISABLED_SUITES=a-training SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | **13 passed, 0 failed/skipped, exit 0**, run `20261027100151-102b0355`. Training-specific test bodies return early; this is absent-suite admission/catalog proof, not student business-read coverage. |
| `npm run test:e2e -- mcp-authorization` | **4 passed, 0 failed, exit 0**, run `20261027100221-6efde020`, one browser worker. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/<module>/tsconfig.json`, separately for `a-training/modules/training-student`, `cabloy-mcp/modules/cabloy-mcp`, `cabloy-mcp/modules/mcp-test` | All three **exit 0**, no diagnostics, on final code. |
| Scoped `npm run format -- <five source/test paths below>` and `npm run lint -- <same paths>` | Both **exit 0** on final code. Earlier formatting failures were corrected with scoped `oxfmt --write`. |
| `npm run docs:build` | **Exit 0**, existing large-chunk advisory only; does not compile suite-local evidence. |

The mapper regression checks the complete advertised request/response shape, existing defaults/filter semantics, strict unknown arguments, fixed guarded dispatch, structured/text equality and safe invalid-output failure. Normal HTTP proves complete serialized-result parity, an empty second page, safe incompatible `columns` failure, current-instance exclusion, and independent select/view permissions on modern/legacy transports with both OAuth ceilings. Exact catalogs are none / select+lookup / summary / all three for neither / select-only / view-only / both permissions. Discovery invokes guards without business reads; calls reauthorize, including after revocation. Lookup/summary projections and privacy assertions remain independent. Browser OAuth retains login, consent, PKCE, replay/anonymous/denial, neutral SSR/hydration and precise REST-created fixture deletion, and adds full select-versus-ordinary-HTTP parity in both successful scope scenarios. Standalone remains the separate three-synthetic-tool catalog.

Retained failed attempts and concrete corrections, without weakening production validation or authorization:

1. Mapper/student run `20261027095058-09dc00cc`: **30 passed, 1 failed, exit 1**. `total: 0` is validly coerced, so it was not an invalid-output fixture. Replaced only that fixture with `list: 'invalid'`; final safe-error assertions pass.
2. Browser run `20261027095150-1de0b0ff`: **2 passed, 2 failed, exit 1**. MCP select succeeded; the new comparison incorrectly read REST `.data.list`. The existing select response exposes pagination at the root. Corrected extraction to the five declared envelope fields and existing DTO normalization; final comparison passes.
3. Normal HTTP run `20261027095508-432d599a`: **12 passed, 1 failed, exit 1**. Existing filter rejects `orders: 'id,desc'`; the test now supplies supported `createdAt,desc`. No filter or business change.
4. Normal HTTP run `20261027095600-3a8715b6`: **12 passed, 1 failed, exit 1**. Direct serialized SQL values and validated MCP wire values differed in numeric `id`/`total` and optional null `imageId`. Added only the explicit existing normalization described above.
5. Normal HTTP run `20261027095713-aeac0d92`: **12 passed, 1 failed, exit 1**. The final query assertion compared JSON property order. Replaced string comparison with `isDeepStrictEqual`, preserving exact query values and `innerAccess: false`; final **13/13** passes.
6. Initial authority audit: **exit 1**, 56 definitions. The new level-four WBS dossier heading interrupted phase parsing. Making only that non-task heading level five restores the same twelve task IDs/dependencies/phases and **68 definitions, exit 0**. No new task/status was invented.

Managed runs report normal application shutdown on success. Exact claim/generated/data roots for all four final successful runs were inspected and are absent. Inspected failed mapper/browser/last-HTTP roots remain retained; no manual deletion, reset or process termination occurred. Historical claim `20261020024644-91d861ba` remains retained for live/uncertain ownership; current success does not settle it. Tests retain owned `mockCtx(...)` boundaries and precise `finally` cleanup, without runner-concurrency overrides or process-global origin/proxy mutation.

Source/test SHA-256 of the final qualified bytes:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `311d7eb9ac6f2f7f326c2a2b1972488454c8ca35ef4e1d519c0c6de2bda3761e` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `f12c1c86082b8627ebf64a8af38b83cea617b52dd0c0bb5115cf117fb77ba6fc` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `239e46f868057c0b939dd72b20d5f67233a01bc907d31c41f232dbc9e9e397bb` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `a05e6512822c4d5bcbd3534902332d1e185d87c52a787d96063813355e86618c` |
| `repo-e2e/specs/mcp-authorization.spec.ts` | `e7ac7755bda74aa93a3088efb5645b25bd897fee50e6ff12a84b5ca06004a9cf` |

SHA-256 of `git diff --binary --` with these five paths in table order: **`43a92ed0a7a3c40576b8f8935eafdf9ad2400b03444554928b0e8cac6fc6983d`**. This is bounded dirty-code attribution, not deployment attestation. Both command streams pass through the existing path sanitizer; final reported `pipeline_exit=0` under `pipefail` establishes success of producer and sanitizer. Failed pipelines report combined exit 1, not separately measured stage codes. The initial Training typecheck's empty shell-status fields are not treated as measured zero; the final explicit three-module rerun above supplies exit 0. Local command captures are inspection material, not distributed artifacts. This manually reviewed minimized record excludes machine-local roots, credentials, OAuth values and private fixture contents; path checks are not secret scanning or ATP acceptance.

After evidence/progress updates, `npm run spec:check -- cabloy-mcp` passes **68 definitions**; `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` pass with English labels and **0/12 verified**, without SVG changes. Scoped documentation formatting passes for matched inputs, and `npm run evidence:check -- -- repo-specs/cabloy-mcp/evidence/business-ai-client.md repo-specs/cabloy-mcp/progress.md` plus `git diff --check` pass, all **exit 0**. Authority structure, derived-view freshness and actual runtime proof remain independent gates.

The connected select outcome and required runtime/static/docs checks pass. Parent WBS statuses remain **blocked**, full ATPs **open**, verified **0/12**; restricted-identity real-client proof remains independently pending. This is not a ChatGPT select call or deployment/production qualification. No persistence/schema/version, generic mapper, frontend/generated consumer, dependency, environment/port, development data or main-checkout edit, reset/init, install, deployment, commit or push occurred. No adjacent WBS or deferred audit/fleet work follows automatically.

### User-reported ChatGPT select success (2026-10-27)

After the user approved the next real-client proof, the assistant supplied a bounded existing-connection procedure: discover select, then call it once with `{"pageNo":1,"pageSize":1}`, without other business calls, paging or writes. The user returned the following minimized observations in that ChatGPT verification context:

| Observation | User-reported result |
| --- | --- |
| Actually discovered and invoked tool | `mcp__test__training_student_select` |
| Call succeeded | Yes |
| Response top-level fields | `list`, `total`, `pageCount`, `pageSize`, `pageNo` |
| List length | `1` |
| Pagination values | `total: 1`, `pageNo: 1`, `pageSize: 1`, `pageCount: 1` |
| First-row field names | `createdAt`, `updatedAt`, `deleted`, `iid`, `id`, `name`, `mobile`, `imageId`, `level`, `image` |
| Mobile observation | Appeared masked; no value supplied or retained |

This is **user-reported actual-client discovery/call success**, not an assistant-observed network capture. It closes the pending reported-select-availability/success observation for this connection and demonstrates a reported complete five-field pagination envelope with row fields beyond lookup. The displayed `mcp__test__` prefix is retained literally; it does not establish the server-side `mcp-test` module, transport endpoint, test environment or composition owner. The reported `image`/`imageId` field presence is not evidence of new relation-loading behavior introduced by this change.

The earlier reported connection was ChatGPT **26.1021.31345**, **admin**, default empty instance, both select/view permissions. Those identity/authority facts remain user reports; no fresh token, guard or served revision inspection occurred. The new response does not supply a complete three-tool catalog, exact request capture, JSON field types (in particular string versus numeric `total`), structured/text equality, HTTP parity, full masking correctness, absence of private data throughout values, restricted-role behavior or instance-isolation proof. None is inferred from the field/value summary. Local regression proof above remains separate and is not relabeled as this deployed-client run.

Recording baseline remains Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2` with the same sixteen attributable modified source/test/authority/guidance/evidence paths. This follow-up changes only this record and progress; it does not change the fingerprinted implementation. No raw student values, credentials, tokens, callback state, connection configuration or machine-local paths are retained. Parent WBS rows remain blocked, full ATPs open and **0/12 verified** unchanged; restricted-identity real-client coverage remains independently pending. No additional client call, runtime test, deployment/restart, permission/environment/data change, commit or push is performed by the assistant. The bounded user-reported select proof is complete; no repeated happy-path query or adjacent task follows automatically.

Record-update checks pass: scoped formatting for matched inputs; `npm run spec:check -- cabloy-mcp` (**68 definitions**); chart generation/freshness (**English, 0/12 verified**, no SVG diff); scoped evidence-path checks on this record/progress; and `git diff --check`. The command pipeline, including the path sanitizer, exits **0** under `pipefail`. These are documentary checks, not another runtime test or independent validation of the supplied client observations.

### Complete existing student view tool (2026-10-27)

The user approved the next bounded detail-data increment and its finite plan. The [SRS amendment](../srs.md#approved-student-view-fourth-read-extension-2026-10-27), [WBS dossier](../pdp-wbs.md#student-view-fourth-read-extension-dossier-2026-10-27) and [proof supplement](../test-plan.md#student-view-fourth-read-extension-proof-2026-10-27) govern this contribution under existing `WBS-MCP-30-01`, `WBS-MCP-30-02` and `WBS-MCP-40-01`. Basic baseline remains **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, branch `worktree-spec-basic-cabloy-mcp`, with sixteen carried select/authority/guidance/evidence edits and a separately observed pre-existing lockfile delta of unknown origin. This is dirty-source qualification, not qualification of the base SHA alone. The seven-file authority amendment preceded runtime edits. Earlier select/client reports remain historical and are not relabeled as view proof.

Only two runtime surfaces change: native `@Mcp.tool({ name: 'training_student_view', readOnly: true, ... })` on the existing `view()` and exact `view` admission in the shared Student predicate. No output pick/omit is added. Existing route, input validation, optional `DtoStudentView`, serializer, RBAC, service/relation loading and generic mapper remain unchanged. Complete view means the existing validated detail contract, including masked mobile, full `content.descriptionMarkdown`, `trainingRecords` and nested `trainingRecordSubjects`, plus optional existing image presentation—not every persistence field, image bytes or a new UI. Select remains the existing paginated list read; lookup/summary retain their narrower projections.

Observed on installed **Node v24.11.0**, selected through command-local PATH, with pnpm **12.14.0**:

| Exact procedure | Final observed result |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | **32 passed, 0 failed/skipped, exit 0**, run `20261027122233-15dfc43d`. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | **13 passed, 0 failed/skipped/cancelled/todo, exit 0**, run `20261027123328-15eb5e41`. |
| `PROJECT_DISABLED_MODULES=mcp-test PROJECT_DISABLED_SUITES=a-training SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | **13 passed, 0 failed/skipped, exit 0**, run `20261027122859-5f549ac7`. Training-specific bodies return early; this proves absent-composition admission/catalog behavior, not Student business reads. Subsequent edits affect only the unexecuted view parity/date assertions. |
| `npm run test:e2e -- mcp-authorization` | **4 passed, 0 failed, exit 0**, run `20261027123231-d0b88fd1`, one worker. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/<module>/tsconfig.json`, separately for `a-training/modules/training-student`, `cabloy-mcp/modules/cabloy-mcp`, `cabloy-mcp/modules/mcp-test` | All three **exit 0**. After the last HTTP Date assertion correction, the affected `cabloy-mcp` native check ran again and **exited 0**. |
| Scoped `npm run format -- <five source/test paths below>` and `npm run lint -- <same paths>` | Both **exit 0** on final code. |
| Scoped formatting of the seven authority and three current usage files | **Exit 0**, all ten matched inputs. |
| `npm run docs:build` | **Exit 0**, existing large-chunk advisory; public docs build, not evidence compilation. Thirteen relative file links in the three usage guides resolve. |

Mapper proof covers full existing input/output and reachable nested/image schemas, fixed `GET /training/student/:id` path binding with `innerAccess: false`, strict invalid/control arguments, matching structured/text result, and safe malformed nested-output failure without raw fallback. Its synthetic full detail includes native Dates, Markdown, two detail levels and an image URL presentation object. This proves object/schema preservation, not image upload, signed-URL delivery or external access.

Normal HTTP uses real test-owned persisted aggregates and compares the complete serialized Action output with validated MCP output. Measured existing schema normalization is explicit and field-specific: identity strings; optional null `imageId` omission; the content projection excludes SQL `content.id`; missing nested `deleted` receives the inherited declared `false` default; only null optional `sceneImageIds`/`dossierFileIds` are omitted. No blanket null stripping, permissive numeric coercion or reduced detail allowlist is used. Numeric average score must equal **88**. Vona's existing `@cabloy/json5` import patches `JSON.parse` to revive ISO strings, so the backend HTTP helper's parsed training time must be an actual `Date` with the exact fixture ISO value. Browser JSON separately asserts the exact ISO string. Full deep parity remains in place.

Current permission catalogs are exactly none / select+lookup / view+summary / all four for neither / select-only / view-only / both permissions. Discovery calls current real guards without business Action/service reads; unexpected guard failures fail the entire list. Calls independently reauthorize, including revocation, on modern/legacy transports under both OAuth ceilings. Full view preserves current-instance scope and uniform safe missing/foreign-instance absence. Training absent yields no Student tools; standalone remains exactly its three anonymous synthetic tools. Browser proof preserves login/consent/PKCE, replay/anonymous/denial/invalid-request and SSR/hydration checks, and compares complete view to ordinary HTTP root detail with exact Markdown and both detail levels. Lookup/summary privacy checks remain independent; full Markdown is intentional authorized view output.

Retained attempts and narrow test corrections:

1. An initial native check ran while the HTTP test edit was incomplete: Training **exit 0**, `cabloy-mcp` **exit 1**, `TS6133` unused `view` helper; the third module was not run. Completed test usage and final explicit native checks pass. This was not a finished-code pass.
2. Browser `20261027122330-854f100c`: **2 passed, 2 failed, exit 1**. MCP view succeeded; the new ordinary HTTP comparison incorrectly assumed `.data`, causing a TypeError reading `id`.
3. Normal HTTP `20261027122430-ab1a1baa`: **12 passed, 1 failed, exit 1**. Full parity exposed the existing content projection, nested defaults and optional attachment-array normalization above. Corrected only the expected DTO representation, not production contracts or validation.
4. Browser diagnostic `20261027122959-a8a3ad62`: **2 passed, 2 failed, exit 1**, intentionally stopping at a temporary key-only assertion. The synthetic ordinary HTTP detail is a root object with eleven business keys and no `.data`/transport metadata. Removed the diagnostic and compared that entire root with the explicit schema normalization; final browser **4/4** passes. No values or credentials were needed for diagnosis.
5. Normal HTTP `20261027123055-0e766fbe`: **12 passed, 1 failed, exit 1**. Full parity passed, but a new strict ISO-string assertion incorrectly ignored the backend JSON parser's existing Date revival. Replaced it with an actual-Date check and exact ISO equality, keeping strict numeric and full parity assertions; final normal HTTP **13/13** passes.

Successful runs report graceful shutdown. Exact claim/generated/data roots for all four final successful runs were inspected and are absent. All four failed runtime runs above retain their exact claim/generated/data roots; no manual cleanup was performed. Historical uncertain claim `20261020024644-91d861ba` also remains present and unresolved. Tests retain owned `mockCtx(...)` boundaries, synthetic fixtures and precise aggregate `finally` deletion, without seed mutation, runner-concurrency override or global origin/proxy changes.

Final qualified source/test SHA-256:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `cbd91afab88b550909a175b7a52b0b07d9bfa7c993e6c53bc792ed285ff6867e` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `93421e16926599249530dce56c156ad37274314c5354f0ab2f3a761840732be5` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `e98d77a615142ef53765e98cfd958d9f2ca73060cf84376c03f089e7a84cd422` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `30803a42c124352b3f5c607bc3072bc6ae35e3e1d203a6d1c45a99d2fbcc2439` |
| `repo-e2e/specs/mcp-authorization.spec.ts` | `b52387e4515fda2a703fc0e367bc5fb9ce143a0e45c576db3b7207767df9b6ac` |

SHA-256 of `git diff --binary --` in table path order: **`aa62dcd9856a9d322165bc64185a2532fcddd6e94ae97f8d47ea5b22c2854cb0`**. Pre-existing `vona/pnpm-lock.yaml` remains unchanged through this increment: file SHA-256 **`b3db5015c5a69ed6bcd6dfd823f3c00699a78d72bc9bad6def99a615d9d6773f`**, binary-diff SHA-256 **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**. Its importer-specifier-only delta is preserved without assigning an origin. Managed root tests run their existing preparation; no separate install/reinstall/dependency synchronization was initiated.

Command output passes through the existing path sanitizer. Successful `pipeline_exit=0` under `pipefail` establishes producer/sanitizer success; failed exit 1 is a combined pipeline result, not separately measured stage codes. The sanitizer does not cover every syntax: an escaped absolute regex in the local Playwright command banner remained outside its recognition. That banner is not copied here; this manually minimized record retains only repository-relative commands/locations, failures and fingerprints, without credentials, token/callback values, private Student values or machine-local roots. Path sanitization is not secret scanning or acceptance proof.

The approved fourth read and its required runtime/code/docs checks pass. After evidence/progress updates, scoped record formatting passes for matched inputs; `npm run spec:check -- cabloy-mcp` passes **68 definitions**; chart generation/freshness passes with **English, 0/12 verified**, without SVG changes; scoped evidence-path checks on this record/progress and `git diff --check` pass, all **exit 0**. These documentary gates remain separate from runtime proof. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12**; whole Proposed ADRs, deferred audit/fleet work and release remain unclosed. No persistence/schema/version, generic mapper, frontend/generated consumer, image-delivery policy, environment/port, live permission, development-data or main-checkout change, reset/init, process killing, deployment, commit or push occurred. No actual ChatGPT view call, external image reachability or client visual rendering is claimed. The next optional proof is one bounded detail/display check through the existing authorized real-client connection against the revision actually served, only if separately selected; no adjacent implementation follows automatically.

### User-reported detail display with Codex label (2026-10-27)

After approving the bounded actual-client detail/display check, the user returned the following minimized observations:

| Observation | User-reported result |
| --- | --- |
| Value supplied for actual tool name | `Codex` |
| Call succeeded | Yes |
| Student image | Returned but not displayed; only an image placeholder, with the returned address reported as missing its site origin |
| Markdown | Rendered normally |
| Multilevel details | Parent/child hierarchy displayed correctly |
| Additional exception summary | None supplied |

The initial `Codex` label above is retained as report history, not current attribution. The user subsequently corrected the actual tool name to **`training_student_view`** and identified the client as **ChatGPT**, explaining the earlier label by equating ChatGPT with Codex App. Record the explicit tool/client correction without adopting that product equivalence: ChatGPT and Codex App are distinct applications. This supersedes only the earlier tool/client uncertainty and the instruction not to attribute this report to ChatGPT. Client version, endpoint/composition, current identity/permissions/instance, continuity with the earlier connection and served revision were not freshly supplied or independently observed; do not infer them from the corrected label.

This records **user-reported successful `training_student_view` invocation and display behavior in ChatGPT**, not an assistant-observed network/rendering check. Markdown and hierarchical-detail usability are reported successful; the image placeholder limitation below is unchanged. It does not establish exact DTO/structured-text parity, complete catalog, isolation, restricted-identity coverage or independently verified application identity.

The image outcome remains unresolved: an image address was reported present, but only a placeholder displayed. Missing site origin is the user's reported diagnosis; no raw URL was collected, and URL shape, accessibility, authentication, expiry, browser policy and renderer support were not independently tested. No origin is guessed or prefixed, and no image URL is fetched. Image object/schema preservation in the local regression remains distinct from external image delivery and visual display.

Recording baseline remains dirty Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`; the qualified five-path binary-diff SHA-256 remains **`aa62dcd9856a9d322165bc64185a2532fcddd6e94ae97f8d47ea5b22c2854cb0`**. Only this evidence record and progress are updated for the report. No source, test, dependency, environment, permission, image-delivery policy or development-data change, runtime rerun, external call, deployment/restart, commit or push occurred. No Student values, IDs, image URLs, Markdown body, credentials or tokens are retained. Parent WBS rows remain blocked, full ATPs open and **0/12 verified** unchanged. The bounded observation handoff is complete with the image-display limitation explicit; the next recommended increment is source-based diagnosis of image URL origin ownership and a bounded correction proposal, only if separately selected—not automatic delivery/UI changes or repeated business queries.

### Native public image absolute URLs qualified locally (2026-10-27)

The user subsequently reported the image object present, `image.url` beginning `/api/static/`, `public: true` and `signed: false`. These are minimized user-reported response observations, not an independently captured payload or image HTTP check. The user corrected the configuration-first recommendation: native delivery should derive its origin dynamically rather than require `deliveryBaseUrl`. The separately approved [native-public dossier](../pdp-wbs.md#native-public-image-absolute-url-follow-up-dossier-2026-10-27), [SRS correction](../srs.md#approved-native-public-image-absolute-url-follow-up-2026-10-27) and [focused proof supplement](../test-plan.md#native-public-image-absolute-url-follow-up-proof-2026-10-27) govern this finite contribution to `WBS-MCP-30-01`, `WBS-MCP-30-02`, `WBS-MCP-40-01`, supporting `ATP-MCP-CONTRACT-02`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-02` without closing them.

At dirty Cabloy Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, one production line in `image-native/src/service/imageNative.ts` now wraps the existing composed static path in existing `app.util.getAbsoluteUrl(...)`. The explicit-base branch remains unchanged. AppUtil still resolves effective serve protocol/host, current request values and HTTP loopback fallback; neither origin/proxy trust nor the utility changes. Existing persisted-base precedence, instance path/containment, third-party providers and private/audience signatures remain unchanged. This corrects shared native presentation, not just MCP.

The existing native test gains public original/thumbnail/presentation and explicit-base regressions, using an HTTPS request fixture through `mockCtx(...)`, not global origin mutation. Its touched private lifecycle now owns precise image/file finally cleanup while preserving signed/audience checks. The existing normal MCP Student aggregate owns one public tiny PNG with scene `training-student:studentImage`, deletes the Student before its image and removes temporary input in finally. Both select and view assert complete serialized Action/MCP parity, equivalent JSON channels and absolute public unsigned image presentation under the unchanged permissions, revocation, instance and Action-count assertions. Select already declares the image serializer relation in `DtoStudentSelectResItem`; observing it with this fixture adds no DTO/relation/contract. The backend image guide documents the dynamic default and optional explicit override, not a required native configuration workaround.

Observed with installed **Node v24.11.0** and pnpm **12.14.0**, selected command-locally without installation:

| Executed procedure | Observed result |
| --- | --- |
| `SERVER_LISTEN_DISABLE=false npm run test -- src/suite-vendor/a-test/modules/test-image/test/imageNative.test.ts src/suite-vendor/a-test/modules/test-vona/test/application.test.ts` | Run **`20261027144410-137befdb`**: **7 passed, 0 failed/cancelled/skipped/todo**; producer **0**, sanitizer **0**. Three native lifecycle/URL cases and four unchanged AppUtil origin cases. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | First run **`20261027144453-9a74641b`**: **12 passed, 1 failed**, producer **1**, sanitizer **0**. Final rerun **`20261027145030-e0867b21`**: **13 passed, 0 failed/cancelled/skipped/todo**, graceful shutdown and no failure diagnostic. The rerun wrapper exited **0**, but its Bash-specific stage-status expansion printed empty fields in the active shell; separate producer/sanitizer codes were not measured for that rerun. Passing test counts and precise cleanup inspection are observed independently, not inferred from those empty fields. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project <module>/tsconfig.json`, separately for `src/suite-vendor/a-image/modules/image-native`, `src/suite-vendor/a-test/modules/test-image`, `src/suite/cabloy-mcp/modules/cabloy-mcp` | All three **exit 0**. Final MCP test corrections received a further affected-module native check, **exit 0**. |
| Scoped `npm run format -- <paths>` and `npm run lint -- <three source/test paths>` | Both **exit 0**; affected MCP test format/lint reran after its last correction, **exit 0**. Authority/guide formatting covered the nine selected files before evidence/progress updates. |
| `npm run docs:build` | **Exit 0**, sanitizer **0**, existing large-chunk advisory. **367** local file targets in the selected guide/authority records resolve; external URLs and historical fragments were not checked. |
| `npm run spec:check -- cabloy-mcp` | **68 definitions**, complete planning structure, **exit 0**, sanitizer **0** before final evidence/progress refresh; documentary gates remain separate from runtime proof. |

Retained failures and narrow corrections:

1. An initial native check omitted the established `--incremental false --composite false` flags: image-native passed, while cabloy-mcp emitted TS6307 composite file-list diagnostics involving existing core imports. Its final exit was not retained in the preview; it is not a passing check. Repeating the declared non-composite form for all three affected modules passed without source suppressions.
2. First image-bearing MCP run **12/13** failed complete select parity: validated nested `image.id` was a string, while expected serialized identity was numeric. Source inspection confirmed select's existing image serializer. The test now normalizes that nested identity exactly as view already does and replaces the old no-image expectation with explicit image/absolute-URL assertions; content/contentHtml/trainingRecords remain absent from select. Full result equality, JSON-channel parity, permission/instance assertions and dispatch counts remain intact. Final rerun is **13/13**; no production mapper, DTO or business/auth change was made to repair the test.

The two successful managed runs' exact `vona/.vona-test-claim/<run-id>.json`, `vona/.vona-test-<run-id>` and `vona/.app-test-<run-id>` paths were inspected and are **absent**. The first failed MCP run's exact three paths remain **present**; no manual cleanup was performed. Historical uncertain claim `20261020024644-91d861ba` remains a runner warning, not resolved or cleaned by this increment. Expected private/audience **401** logs are passing negative assertions. Synthetic request/CDN hosts are string fixtures only; existing private delivery fetches stay on the managed listener. No external image access was tested.

Final qualified source/test fingerprints:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite-vendor/a-image/modules/image-native/src/service/imageNative.ts` | `124d0deaf6771a46f9fdcf878337f08458e8306913c22fe6d3a6b973a8e2f817` |
| `vona/src/suite-vendor/a-test/modules/test-image/test/imageNative.test.ts` | `04e9e113e06a4bedb668a3614e103161aea9c0dc5647fbe1dc8126d4188b5196` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `14b412403fca34e1bef63bb7e75fd36caa286506d5d4d44ee368970d8b53c73e` |

SHA-256 of `git diff --binary --` in table order: **`9f2e6505959539b5a13296417c9b6a190b88b436db8c601fbde846c752649e42`**. This HEAD-relative three-path diff includes carried Student test work, not solely the native follow-up. The baseline had **18 carried modified paths**; three newly touched paths are the native service, native test and backend image guide, for **21 modified tracked paths**. Changes merge narrowly into existing MCP test/authority/evidence records. Unknown-origin `vona/pnpm-lock.yaml` remains **70 insertions/70 deletions**, with unchanged binary-diff SHA-256 **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**; no install/reinstall/synchronization was initiated. Managed root tests still execute their established preparation.

Both output streams were routed through the existing path sanitizer. This manually minimized record retains repository-relative paths, synthetic host classes, results, failures and original-source fingerprints, not raw response URLs/resource IDs, Student content, credentials, tokens or machine-local roots. Path sanitization is not secret scanning or acceptance proof. Prior relative-URL/client-display reports remain historical; prior Student qualification does not prove corrected native URLs, and the focused reruns above supply the new local proof without claiming a new browser/Training-absent/actual-client run.

Final documentary gates also pass: `npm run spec:check -- cabloy-mcp` again reports **68 definitions**; chart generation/freshness both pass (**English, 0/12 verified**, no SVG diff); scoped `evidence:check` and `git diff --check` exit **0**. The record/progress format invocation exits **0** with **one matched file** (not a claim that both supplied paths were formatter-covered); both records were manually reviewed for minimized sensitive content and **202** local file targets resolve. External URLs and historical fragments remain outside that link check. These documentary passes do not establish runtime acceptance or ADR approval.

The approved native-URL correction and focused runtime/static/docs checks are complete locally. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12**, whole Proposed ADRs unaccepted and restricted-real-client/release gates separate. No `.env*`/credential read, live image fetch, real permission/account change, dev reset/init, environment/port edit, process killing, dependency installation/synchronization, frontend/generated-consumer edit, deployment, main-checkout edit, historical cleanup, broad review, commit or push occurred. A later separately selected existing-client retry must use the revision actually served; neither absolute URL construction nor these managed local checks guarantees public reachability or ChatGPT inline image rendering.

### Student create qualification stopped on nested contract mismatch (2026-10-28)

The separately approved [create dossier](../pdp-wbs.md#student-create-fifth-tool-extension-dossier-2026-10-28) authorized the fifth exact tool, its individual mutation/confirmation/audit dispositions and focused execution. At dirty Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`, method-only `training_student_create` with `readOnly: false` and exact normal admission are written. Existing DTO/service/Model/mapper/auth/persistence remain unchanged. Existing mapper/HTTP tests and scope-aware browser catalog expectations are extended; browser fixtures still use REST, not MCP creation. **This increment is not qualified or complete.** No live-client write occurred.

Observed checks with command-local installed Node **v24.11.0**:

| Procedure | Actual result |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | Run **`20261028012807-a01f7504`**: **15 passed, 2 failed**, no cancelled/skipped/todo; graceful shutdown; producer **1**, sanitizer **0**. Both new create assertions failed; existing read/standalone regressions passed. |
| Native non-emitting check for `src/suite/a-training/modules/training-student/tsconfig.json`, using `--incremental false --composite false` | **0**, sanitizer **0**. |
| Same native check for `src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json` | **1**, sanitizer **0**: TS2339 at new HTTP-test lines 1031–1032, declared detail-view record type lacks `trainingRecordSubjects`. The sequential mcp-test native check was not reached. No suppression/cast repair was made. |
| `npm run docs:build` before the stop annotation | **0**, sanitizer **0**, existing large-chunk advisory. This does not qualify runtime or the later stop text. |
| Scoped formatting/lint before the stop | Main 14-path formatting and three-path runtime/browser lint **0**. HTTP agent reports its owned test format/lint/diff **0**; these are not native/runtime passes. |
| Local guide/authority file-link check | **514** targets across 11 documents resolve; fragments and external URLs excluded. |

First failure: the schema assertion expecting no nested `id` found a nullable table-identity field. Second failure: exact fixed-body equality found `deleted: false` added to the nested subject. Read-only source tracing confirms a real contract mismatch, not a reference to presentation-shadow fields. Content and training-record create schemas remove identity/deletion/FK controls, but StudentCreate includes `DtoDetailRecordMutate` without repeating its nested include (`training-student/src/dto/studentCreate.tsx:110`). Relation reconstruction in `a-orm/src/lib/utils.ts:14–35` only traverses explicitly included/autoload relations; the copied subject mutation schema survives. The effective persistence path `trainingRecords[].trainingRecordSubjects[]` therefore retains optional `id` and `deleted`, defaults the latter to false, and still excludes `recordId`.

Existing `a-orm/src/service/relations_.ts:351–379` checks supplied child IDs against the current parent FK before mutation and forces that FK, so this finding does **not** establish arbitrary cross-parent update/delete/reparent authority. A new subject with `deleted: true` and no ID is skipped; a rejected supplied ID may be detected after Student/record insertion. These latter behaviors are source-backed, not extra runtime experiments; no new transaction/atomicity or rollback claim is made. The approved plan's full recursive omission premise is false. Implementation must stop rather than weaken the regression or change DTO/ORM/mapper policy automatically.

Current source SHA-256 fingerprints:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `e75e001e94b61d156263d9be6c82658295203f25c888a3e69b3a2380e414395c` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `d0bd6c4a48d56aea21d5d42f620fb66a27ef0e3e1b6ab47cac3eb82baf1744d2` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `c4615eefd533af97273453bbb0ef95d409469f8ce75114d602462b4f4e255d48` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `145b806a481ce98262e681c5021fb1d298e2fb7ca645f16875076662620c4103` |
| `repo-e2e/specs/mcp-authorization.spec.ts` | `a119e12292d4bec48db0cde61eae56fca3ea5391459462cc8faa43a6f64f6327` |

HEAD-relative binary diff SHA-256 in table order: **`0ba5e3d6230241e243347ffd36e6a042b8f70092e64860f10581976bb63d2714`**, including carried read work, not solely create. The failed run's exact claim/generated/data paths are all **present** and retained; no manual cleanup. Historical uncertain claim `20261020024644-91d861ba` remains unresolved. Unknown-origin lockfile binary-diff SHA-256 remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**. Baseline 21 carried modified paths becomes 22 with the named ADR 0008 amendment; no unrelated file is attributed to this increment.

Normal HTTP, Training-absent and browser managed runs are **deferred**, not passed. No persisted MCP-create success, denied-write/instance runtime qualification or actual-client mutation is claimed. Tool annotation/admission remains in the dirty worktree, unqualified; no deploy/restart/commit/push occurred. Both command streams used the existing path sanitizer and this minimized record omits credentials, tokens, raw callbacks and machine-local roots; path sanitization is not secret scanning or acceptance proof. No `.env*`/credential read, real permission change, dev reset/init, dependency installation/synchronization, process killing, environment/port or main-checkout edit, historical cleanup or resumed image diagnosis occurred. Managed tests used their established isolated preparation only.

Stop-record documentary checks: `spec:check` passes **68 definitions**; chart generation/freshness pass (**English, 0/12 verified**). The first combined wrapper reached `evidence:check` without its required literal `--`, yielding `INVALID_USAGE` (**2**, sanitizer **0**); downstream diff check was not reached. Corrected `npm run evidence:check -- -- <two record paths>` and `git diff --check` both exit **0**. Scoped stop formatting reports **six matched files** for seven supplied paths, not universal formatter coverage. A subsequent evidence-only `format --check` exits **2** because ignore rules exclude the evidence file; its chained checks did not run. This establishes that the evidence record, not progress, was excluded; the evidence record is manually reviewed rather than advertised as formatter-covered. These checks neither repair runtime failures nor accept the disputed contract.

Single next action: dispose the newly observed nested-create contract mismatch through a bounded amendment before further implementation/runtime verification. A DTO include correction would change shared HTTP contract truth and needs separately scoped approval and contract-loop handling; retaining current nested mutation semantics instead needs explicit policy/authority acceptance, not an assertion rename. Parent WBS rows remain blocked, full ATPs open, **0/12 verified**, whole Proposed ADRs and release/restricted-client gates unchanged.

### Student create nested composition corrected; parsing qualification still blocked (2026-10-28)

The user approved the [bounded correction dossier](../pdp-wbs.md#student-create-nested-contract-correction-dossier-2026-10-28), including its named authority amendments, create-only DTO composition and necessary generated-consumer handoff. Authority was amended first. At dirty Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, `DtoStudentCreate` now explicitly includes `trainingRecords.trainingRecordSubjects` using existing `DtoDetailRecordSubjectMutate`. The HTTP regression now loads subjects with a typed Model `include` in the same owned `mockCtx`, resolving both TS2339 diagnostics without casts or response widening. Shared mutate/update DTOs, ORM, mapper, authorization, services, persistence and transactions remain unchanged.

Actual checks used installed Node **v24.11.0**, with both command streams path-sanitized:

| Procedure | Observed result |
| --- | --- |
| Sequential native checks for training-student, cabloy-mcp and mcp-test, each `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project <module>/tsconfig.json` | Producer **0**, sanitizer **0**; all three reached and passed. |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | Run **`20261028040034-4f6d8576`**: **33 tests, 31 passed, 2 failed**, no cancelled/skipped/todo, graceful shutdown; producer **1**, sanitizer **0**. All 16 existing Student cases passed, including nested create/update and form-layout metadata; mapper remained **15/17** with different failures. |
| Initial three-source-path format check chained before lint | Format failed on the two MCP test files; lint did not run. This initial wrapper did not capture separate producer/sanitizer codes, so none are inferred. |
| Installed `pnpm exec oxfmt --write` on only those two test files | Producer **0**, sanitizer **0**. Formatting occurred during the managed run; captured stack line numbers therefore differ from final formatted source. This is not an immutable execution-source snapshot. |
| Repeated scoped format and lint on DTO and two tests | Producer **0**, sanitizer **0**; three files formatter-covered. |
| `npm run spec:check -- cabloy-mcp` | **68 definitions**, producer **0**, sanitizer **0**. Static authority structure only. |

Qualification-stop documentary checks subsequently passed as one sequential chain: full `spec:check` (**68 definitions**), chart regeneration and freshness (**English, 0/12 verified**), path-evidence checks of this record and progress, scoped Markdown format and `git diff --check`; producer **0**, sanitizer **0**. Formatter output covered **one** matched file (`progress.md`); this evidence file is ignored by formatter configuration and was manually reviewed. These checks do not qualify runtime behavior; no new public-docs build was run for this stop record.

The original schema-omission and exact dispatched-body assertions now pass: writable content/record/subject schemas omit identity/deletion/parent-FK fields, ordinary nested creation no longer injects subject `deleted: false`, and title/order/render/block/effect/presentation-shadow metadata checks pass. Shared mutate/update schemas still retain identity/deletion controls. These are partial regression results, **not qualification**.

Two remaining failures expose existing mapper parsing behavior:

1. The first nested subject `{ id: '123' }` input does **not** return the required pre-dispatch `-32602`. `controllerToolSchema.ts:52–58` closes only the root object. `$schema` uses ordinary stripping objects (`a-openapiutils/src/lib/schema/makeSchemaLikes.ts:125–129`), so the unknown nested identity is admitted by JSON Schema then stripped by request parsing before Action dispatch. The dispatcher mock is reached and its thrown assertion becomes safe `Action failed`; `rejected.error` is undefined. Omission/stripping is not rejection. The loop stops here, so later nested deletion/FK cases have not been runtime-qualified.
2. The object-valued invalid scalar response fixture does **not** produce `isError: true`. `controllerTools.ts:264–311` disables query coercion for request parsing but runs response parsing under enabled coercion. Existing string coercion (`vona/packages-utils/zod-query/src/lib/query.ts:231–240`) can convert the object to `"[object Object]"`, which the table-identity string arm accepts. This is a source-backed explanation of the failed error assertion; no raw identity or client output is retained. Valid identity wrapping/text parity and exact valid-body assertions preceding it passed.

These failures cannot be corrected by the approved nested include alone. No assertions were relaxed or replaced, and no unapproved mapper/DTO-pipe/coercion repair was applied. The finite amendment expressly requires a stop if new mapper or policy changes are necessary. Managed normal HTTP, Training-absent HTTP, browser, isolated generation, Admin/Web paired builds, dependency handoff and regenerated frontend native check remain **deferred**. Generated frontend files are untouched; backend and checked-in frontend create truth are therefore not yet synchronized. No persisted MCP-create success or release/actual-client proof is claimed. Docs qualification-stop notices have not been promoted to passing guidance.

Final formatted source SHA-256 (not an immutable snapshot of the concurrent formatting interval):

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx` | `052b2154ef3d9bbe26036cf6f1132f50ce1c16d806bd2762c48f76b0c47cf64d` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `d86b3677dca783d904cd96a5b1569bba857b1404e10b5b099c423f6f15a40da9` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `b2333e141b6c5e54930d61d6a7a3b9783a6cc8355ec8a63c0eb19cd0d685d90c` |

HEAD-relative binary-diff SHA-256 **`e55288a097e32a9dccf9918e48bae9170eb26511eb5e3b58e9efea103b12641e`** uses, in order, Student controller, shared admission, StudentCreate DTO, mapper test, HTTP test and browser test. It includes carried work, not solely this correction. Unknown-origin lockfile diff remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**. New failed-run claim/generated/data roots were inspected **present** and retained, alongside previous failed resources and unresolved historical process ownership; no manual cleanup occurred.

Single next action: approve a bounded parsing-boundary correction covering nested writable-input rejection and scalar result type admission before coercive parsing, while preserving existing read serialization and shared framework semantics. No automatic authority expansion is made here. Parent WBS rows remain blocked, full ATPs open, **0/12 verified**, whole Proposed ADRs and restricted-client/release gates separate. No environment/credential reads, live-client calls, real permission/account changes, dev reset/init, frontend generation/build/dependency synchronization, arbitrary install, process killing, deployment, main-checkout edits, commit/push or resumed image diagnosis occurred. This minimized record is manually reviewed for sensitive data; path sanitization is not secret scanning or acceptance proof.

### Student create parsing regressions pass; HTTP date input remains blocked (2026-10-28)

The later plan-interface approval authorized the [bounded parsing amendment](../pdp-wbs.md#student-create-nested-contract-correction-dossier-2026-10-28), separately covering the five authority-owner amendments, two mapper-local repairs and connected qualification. Authority was amended before source. Baseline remains dirty Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, with 23 carried modified tracked paths before the two mapper files joined this increment. Prior failed runs above remain historical, not erased.

`controllerToolSchema.ts` now closes declared object shapes in cloned non-read-only MCP input schemas, preserving explicit maps/open objects, declared presentation shadows and metadata; its new traversal follows schema keywords and copied references with cycle protection. Split `allOf` branches remain deliberately unclosed; no universal strictness or redesign of the older reference-copy walk is claimed. `controllerTools.ts` reuses the installed SDK validator to reject nested unknown controls before dispatch and to validate primitive-only wrapped raw results before native coercion. Object/array output normalization, read-query behavior, shared ORM/Zod/HTTP semantics, current-instance authorization and create effects remain unchanged. Existing rejection and invalid-result assertions were preserved.

Actual procedures used installed **Node v24.11.0**, with producer and sanitizer exits captured separately:

| Procedure | Observed result |
| --- | --- |
| Four-source-path lint, nine-path source/authority formatting, full `spec:check` and whitespace preflight | Producer **0**, sanitizer **0**; **68 definitions**. Static authority only. |
| First three-module backend native chain | Student and cabloy-mcp passed; mcp-test failed **TS2345** at the new helper fixture's SDK schema boundary; producer **1**, sanitizer **0**. Corrected using the mapper's existing `Parameters<typeof fromJsonSchema>[0]` adaptation, not a suppression. |
| First managed mapper + Student run | **`20261028053947-1e38d338`**, **34/34**, graceful exit; producer **0**, sanitizer **0**. The later type-only cast means this run does not attest final test-file bytes. |
| Repeated four-file format and all three backend native checks | Producer **0**, sanitizer **0** after the cast correction. |
| Final-byte managed mapper + Student run, same root command as the preceding stop | **`20261028054616-1fb56916`**, **34 tests, 34 passed, 0 failed/cancelled/skipped/todo**, graceful shutdown; producer **0**, sanitizer **0**. Both original parsing failures now pass, including zero-dispatch nested control rejection, scalar object/array safe failure, numeric/string identities, valid shadows and existing read normalization. |
| Normal HTTP: `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | Three runs **`20261028054109-4bc25a0b`**, **`20261028055133-e817b5ea`**, **`20261028055343-0413eaeb`** each **13/14**, graceful shutdown; producer **1**, sanitizer **0**. Create fails before its successful persistence assertions. |
| Training absent: same HTTP command additionally setting `PROJECT_DISABLED_SUITES=a-training` | **`20261028054722-22595169`**, **14/14**, graceful shutdown; producer **0**, sanitizer **0**. Training-specific case bodies return early by design; this is empty-catalog/unavailable-name proof, not create persistence proof. |
| `npm run contract:generate:isolated -- training-student` | **`20261028055023-a3eb307d`**, producer **0**, sanitizer **0**, graceful service shutdown. Existing module matcher and project resolver consumed child-scoped `OPENAPI_SOURCE_URL`; no development Swagger fallback or environment edit. |
| Generated owner's `node scripts/typecheck.ts native zova --noEmit --composite false --incremental false --project src/suite/a-training/modules/training-student/tsconfig.json` | Producer **0**, sanitizer **0**. |
| `npm run build:zova:admin` | Paired Admin SSR and REST succeeded; producer **0**, sanitizer **0**. Existing experimental TypeScript API warning remains advisory. No Web build or `deps:vona` followed. |
| HTTP fixture static chain | Initial check-only format failed, so chained lint/native did not run; producer **1**, sanitizer **0**. Narrow formatting, lint and cabloy-mcp native rerun passed, producer **0**, sanitizer **0**, before the labeled HTTP run. |

**HTTP failure diagnosis and limit:** all three normal runs report actual protocol **`-32602` / `Invalid params`** where `assertDenied` expects an Action-level safe failure. Initial transformed line-number interpretation incorrectly suspected the denied select/view loop. A trial aligning select arguments with an existing successful fixture changed nothing. Adding a static assertion-stage label proved the failure is the **first create call without current create permission**, before that loop. The speculative select change was removed; useful assertion labels remain. No assertion, date field or valid aggregate fixture was weakened to force success.

The valid create fixture includes `trainingTime: Date`; `send()` JSON-serializes it to a string. The existing mapper validates the native request under `runWithZodQueryCoercion(false)` (`controllerTools.ts:277–280`), while the `Date` field (`training-record/src/entity/record.tsx:87–94`) relies on the date adapter (`zod-query/src/lib/query.ts:129–133`) to accept transport strings. This is the source-backed explanation for the pre-dispatch date incompatibility, not a retained field-level runtime issue trace or a proof that no additional defect exists. The mapper unit fixture does not cover this HTTP date conversion. No new request-date conversion, broad coercion enablement or field omission was applied: that is a new material contract boundary outside the two approved repairs. The first create denial aborts the case before aggregate success, revocation and create-specific instance assertions; other passing cases do not substitute for these unreached assertions. No persisted MCP-create success is claimed.

Generation removed subject `id`/`deleted` from the writable nested create branch while retaining declared presentation shadows. The generated file also refreshed pre-existing shared `home-user` display-name components and their dependent component, traceable to current backend declarations, not new authored business changes. Only `zova/.../training-student/src/api/openapi/types.ts` changed; no handwritten consumer or metadata redesign. All five other inspected generated API/schema files stayed byte-identical. StudentUpdate's extracted component SHA-256 stayed **`9818749f630d9aba993562564dc019ae011cdca058b235846d38743288c5ddae`** before/after. These observed shared-component refreshes remain disclosed; they are not qualification of unrelated account flows. Generation/Admin success is partial contract-loop progress, **not a completed Web/REST/dependency handoff**.

Final retained source SHA-256:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts` | `ce2fd7c1aa35a5e2a9e0d7ba65e82ec2ec60c539317af8cc8f63459ed99fa270` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `33e0a97163af778c596c7a128c805ee04b849e6b29ddde3e11f33bc5e4c826dc` |
| `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx` | `052b2154ef3d9bbe26036cf6f1132f50ce1c16d806bd2762c48f76b0c47cf64d` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `5a0c59221d112ac4658f19b6e0509afcf090685571dfff92d6b6c0e1d7c7508e` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `57be26017387425448aa43f87626f97eb3d9fbaafff153166eb991fde3b9bcf0` |
| `zova/src/suite/a-training/modules/training-student/src/api/openapi/types.ts` | `8e2efddc991857d108951ce0c76654aae3ca27d0678337d2020312c73f30d620` |

The final HTTP file differs from its failing execution bytes only by removal of the ineffective select-fixture trial; no final-byte HTTP pass is inferred. Source stayed frozen during each run. Successful final mapper, Training-absent and generation claim/generated/data paths were inspected absent; all three failed normal HTTP claim/generated/data roots were inspected present and retained. Historical failed/uncertain resources remain untouched. Unknown-origin lockfile binary-diff SHA-256 remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**; no unexpected tracked package-manifest or dependency delta was observed.

After the partial Admin build, a final HTTP-file format/lint check passed, but repeated cabloy-mcp native verification failed with **nine TS2322/TS2345 diagnostics** in existing `test-rest`, `test-ssr`, training SSR menus and Basic SSR menus (page keys inferred as `undefined`/`never`); producer **1**, sanitizer **0**. The chain stopped before its documentary commands. Earlier native passes remain revision/installation-context scoped; no final clean native check or completed dependency handoff is claimed. No broad source patch or dependency reinstall was attempted for these post-build consumer diagnostics. The current stop-notice docs build subsequently passed, producer **0**, sanitizer **0**, with its existing chunk-size advisory; **13** relative guide file targets were checked present (not exhaustive anchor/navigation or external-link proof). The final documentary-only chain passed: full authority audit **68 definitions**, English chart generation/freshness **0/12 verified**, scoped evidence-path checks and `git diff --check`, producer **0**, sanitizer **0**. Scoped stop-notice Markdown formatting covered four files; retained evidence is formatter-ignored and manually reviewed. These are documentation/static checks, not runtime qualification.

**Single next action:** approve a bounded, schema-directed request-date transport correction and focused regression, preserving strict non-date input rejection, existing permission/instance gates and read/output normalization. Web paired build, `deps:vona`, browser qualification and final create qualification remain deferred. Parents remain blocked, full ATPs open and **0/12 verified**; Proposed whole ADRs, actual-client and release gates stay separate. No live-client call, real permission/account change, credential/environment read, dev reset/init, arbitrary install, process killing, historical cleanup, deployment, main-checkout edit, commit/push or resumed image diagnosis occurred. Evidence is minimized and manually privacy-reviewed; path sanitization is not secret scanning or acceptance proof.

### Student create date transport and connected qualification (2026-10-28)

The user separately approved the bounded schema-directed request-date correction after the preceding HTTP stop. The [existing dossier amendment](../pdp-wbs.md#student-create-nested-contract-correction-dossier-2026-10-28), SRS, README, test plan and narrow ADR 0006 disposition now record that scope explicitly. Baseline remains dirty Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, with **26 carried modified tracked paths**. This is the same create increment under `WBS-MCP-30-01`, `WBS-MCP-30-02`, `WBS-MCP-40-01`, not an adjacent task or whole-ADR acceptance. Earlier failed results remain historical below/above.

**Diagnosis and bounded correction.** Read-only tracing located the HTTP conversion in the global JSON reviver installed by `vona/packages-utils/json5/src/index.ts:13–19,33–38` and imported by Vona core. `cabloy-mcp/src/lib/transport.ts:191–195` uses that patched `JSON.parse`, so matching UTC ISO strings are already native Dates before SDK dispatch. This supersedes the preceding incomplete coercion-only explanation. Neither SDK unknown-argument validation nor disabling `zod-query` controls that reviver. No shared parser, transport or coercion source changed.

The mapper now validates the **complete** original argument shape using a copy that serializes only schema-declared Dates into JSON transport strings. Original date formats and nullable types remain intact; an intermediate schema-format-stripping helper was removed. Then declared strings normalize to native Dates before native DTO parsing with broad coercion still disabled. Undeclared keys remain visible to strict validation rather than disappearing during location reconstruction. Invalid dates reject before dispatch. The existing mutation-only nested closure, primitive-only raw-output validation, shared read/object/array normalization, fixed `innerAccess: false`, scope/business authority and instance boundaries remain. Date-only serialization uses the date portion; invalid native Dates remain invalid rather than throwing during serialization. This is not a general schema-composition engine or a universal date coercion policy.

**Retained intermediate failures and limits.** Early continuation HTTP attempts remained **13/14**. Temporary field diagnostics showed `trainingRecords[0].trainingTime` already had native Date shape. An intermediate serialization implementation reached **14/14 HTTP**, but reconstruction using only known request-location keys dropped an unexpected root `innerAccess`; repeated mapper attempts remained **18/19**. Misreading transformed stack line numbers led to ineffective query-assertion investigations; those speculative edits/logs were removed. The actual correction validates all root keys first. One accidentally weakened Student read-scope assertion was restored to the exact `{ code: -32602, message: 'Tool unavailable' }`. An earlier **35/35** pass after that ordering correction still preceded removal of the unnecessary date-format schema clone; it is not substituted for final-byte proof. Some intermediate attempts used default Node **24.8.0** and pipelines without reliable producer status; neither is supported-runtime qualification. Failed resources remain retained without manual cleanup.

Final checks used installed **Node v24.11.0**, command-local PATH, formatted/frozen source, default runner concurrency and the existing managed root entrypoints. Producer and path-sanitizer exits were separately captured:

| Procedure | Final observed result |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | Run **`20261028102355-879d85be`**, **35/35**, zero failed/cancelled/skipped/todo, graceful shutdown; producer **0**, sanitizer **0**. Mapper 19 and Student 16 include nested rejection, identity-only success/safe invalid-result failure, exact scope error, ISO-to-native binding, nullable/original-format date validation and complete root-extra rejection. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | Run **`20261028102452-2bd7bd95`**, **14/14**, zero failed/cancelled/skipped/todo, graceful shutdown; producer **0**, sanitizer **0**. Actual owned Markdown/record/subject persistence, bound native Date, fixed dispatch, equivalent identity-only channels, independent create/read authority, scope/invalid/revoked no-write behavior, guard-only discovery and current-instance isolation pass alongside read/image/ingress/drain regressions. |
| Same HTTP command additionally setting `PROJECT_DISABLED_SUITES=a-training` | Run **`20261028102613-596e13f9`**, **14/14**, zero failed/cancelled/skipped/todo, graceful shutdown; producer **0**, sanitizer **0**. Empty catalog and all five unavailable are asserted; Training-dependent bodies return early, not aggregate proof without Training. |
| `npm run test:e2e -- mcp-authorization` | Run **`20261028102658-109944b8`**, **4/4**, producer **0**, sanitizer **0**, graceful shutdown. Both scope/OAuth journeys, login/consent/PKCE/Bearer, scope-aware catalogs, denial/invalid-request and existing SSR/hydration checks pass. This is not a browser or actual-client create journey. |
| `npm run build:zova:web` then `npm run deps:vona` | Both producer **0**, sanitizer **0**. Completes the preceding isolated Student generation → paired Admin SSR/REST → paired Web SSR/REST → dependency handoff; generation/Admin are reused from their revision-bound results above, not rerun or relabeled as new executions. |
| `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project <module>/tsconfig.json` for training-student, cabloy-mcp, mcp-test; corresponding `native zova` Student owner check | All four producer **0**, sanitizer **0** after the completed handoff. The nine earlier SSR page-key diagnostics no longer reproduce; no source workaround or arbitrary reinstall was needed. |
| Eight connected code-file format/lint and `git diff --check` | **0**; existing Student controller/DTO, mapper helpers/controller/shared admission, mapper/HTTP tests and browser test. |
| `npm run docs:build`; relative guide file targets | Producer **0**, sanitizer **0**, existing chunk-size advisory; **13** relative file targets resolve. Public build does not build suite-local guides; external URLs and all fragments/navigation were not exhaustively checked. |
| Full `npm run spec:check -- cabloy-mcp` | **68 definitions**, **0**. Static authority/links only, not runtime/acceptance approval. |

Generation remains owner-only: the same generated `training-student/src/api/openapi/types.ts` hash as the preceding generation is retained, including disclosed backend-derived display-name refreshes. A direct HEAD/current extraction confirms StudentUpdate byte equality; this extraction's SHA-256 is **`2e73623b3549cc9111f4e6187b5a5f2961506c754fe4fa89cb9d655e61140127`** (different extraction boundaries from the earlier hash, not a changed update contract). No generated consumer was hand-edited. No tracked package manifest changed. Unknown-origin lockfile binary-diff SHA-256 remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`** before/after Web/dependency handoff.

Final execution-source SHA-256:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `e75e001e94b61d156263d9be6c82658295203f25c888a3e69b3a2380e414395c` |
| `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx` | `052b2154ef3d9bbe26036cf6f1132f50ce1c16d806bd2762c48f76b0c47cf64d` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `b1311cdd56bdbe590ba4956474a328516f9574c9d9115daab49b09513532f253` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts` | `c868cbb2f6391ff51086358c62cecb16c218d27a32bf06a20ccf0d0a0e710369` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `d0bd6c4a48d56aea21d5d42f620fb66a27ef0e3e1b6ab47cac3eb82baf1744d2` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `5e3cf10318ac285330e39ff96b6cefd4f99e02884eaf0c3d1bc57fea3ca9751e` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `c7a00b5c006c5e65a9d6d8c18e8fe8d316c7a367c0c07b8d8e5de05b5a63f54d` |
| `repo-e2e/specs/mcp-authorization.spec.ts` | `a119e12292d4bec48db0cde61eae56fca3ea5391459462cc8faa43a6f64f6327` |
| `zova/src/suite/a-training/modules/training-student/src/api/openapi/types.ts` | `8e2efddc991857d108951ce0c76654aae3ca27d0678337d2020312c73f30d620` |

All four final managed runs' exact local claim/generated/data paths were checked **absent** after shutdown. This is precise local cleanup proof, not a claim that historical failed/uncertain resources were cleaned. No credentials, bearer/code/callback state, raw Student identities or live-provider data are retained here. Automatic path sanitization does not cover every escaped regex/unknown root: the browser command's regex-escaped absolute checkout path and the pnpm store path were manually excluded from this minimized record. Path sanitization is not secret scanning or acceptance proof.

The approved Student-create implementation and connected local runtime qualification are complete. This supersedes only the preceding date-blocker/remaining-Web-deps-browser next action and current unqualified notices; historical failures stay intact. Existing non-idempotence, possible partial writes/uncertain responses, no automatic retry/deduplication/new transaction/rollback promise, exact fifth-tool admission and explicit audit/quota deferral remain. Parent WBS rows stay **blocked**, full ATPs **open**, verified **0/12**, whole Proposed ADRs and independent restricted-real-client/release gates unchanged. No actual-client create, live permission/account change, environment/credential read, dev reset/init, arbitrary dependency install, process killing, historical cleanup, deployment, main-checkout edit, commit/push or reopened image diagnosis occurred. No automatic adjacent implementation follows. Final documentary chain completed: full authority audit **68 definitions**, English Gantt/burndown generation and freshness **0/12 verified**, scoped path checks across the ten amended authority/evidence/guidance owners and `git diff --check` all exit **0**. README/progress formatting passes; retained evidence is formatter-ignored and manually reviewed. These checks prove only their static/documentary scopes, not additional runtime, human acceptance or secret-scanning coverage.

### User-reported ChatGPT image retry: absolute HTTP and clickable image (2026-10-27)

After explicitly selecting the next bounded existing-client image retry, the user supplied these minimized observations:

| Observation | User-reported result |
| --- | --- |
| Service has loaded this correction | Yes |
| Tool call succeeded | Yes |
| `image.url` shape | Complete HTTP URL |
| Image presentation | A placeholder near the beginning of the response; a link near the end. Clicking the link opens the image. |
| Exception summary | None |

This completes the selected observation handoff in the existing ChatGPT/`training_student_view` context. Client/tool attribution follows that handoff, not a newly captured client trace; no fresh version, endpoint, identity, instance, permission category or immutable served revision was supplied. The service-loading assertion is user-reported, not independently attested deployment evidence. The assistant did not invoke the client, fetch the image or inspect browser network/rendering behavior.

The report supports successful tool invocation, corrected absolute-HTTP URL shape and image access through the user's clicked link. It supersedes the earlier relative-address/access uncertainty only for this reported retry. It does **not** establish anonymous/external-client fetchability, HTTPS delivery, correct direct image MIME/redirect behavior, raw DTO/structured-text parity or successful inline rendering. The placeholder remains a presentation limitation; HTTP/mixed-content policy, client rendering/fetch restrictions and other causes have not been diagnosed. Do not infer that HTTP caused it, that switching to HTTPS is a proven fix, or that a clickable image equals an inline-display pass. Markdown/detail rendering was not freshly reported in this retry; earlier observations remain separately scoped.

Recording baseline remains dirty Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**. All three qualified source/test hashes above and their binary-diff SHA-256 **`9f2e6505959539b5a13296417c9b6a190b88b436db8c601fbde846c752649e42`** were rechecked unchanged locally; this does not attest the remote served bytes. Only this evidence record and progress change for the report, with derived chart regeneration/checks. No new runtime suite, external fetch, source/test/dependency/environment/permission change, service restart/deployment, commit or push is performed by the assistant. No raw URL, Student value/identity, provider identifier, credential or token is retained. Parent WBS rows remain blocked, full ATPs open, **0/12 verified**, with restricted-client and release gates separate. The native absolute-URL follow-up now has user-reported client corroboration; inline image display is not accepted, and any client-presentation diagnosis is a separate bounded increment rather than automatic MCP image-block, access-policy or origin changes.

### User-reported ChatGPT Student create and returned-ID view success (2026-10-29)

The user selected real-client verification after the [connected local qualification](#student-create-date-transport-and-connected-qualification-2026-10-28). The first read-only handoff inspected the existing ChatGPT connection's catalog/definitions without calling business tools. The user reported `mcp__test__training_student_create` visible, required top-level `name`, `mobile`, `level`, nested record `name` and subject `name`/`score`, nullable optional `trainingTime`, and the explicit non-idempotence description. Writable subject identity/deletion controls were not present in the reported definition. The client did not expose date `format`, structured tool annotations or the element details of the declared presentation-shadow arrays; those observations do not prove missing server metadata. The client-local `test` prefix does not identify the serving module or endpoint.

The user then explicitly approved **one synthetic create, followed by at most one returned-ID view, with the record temporarily retained**. The handoff prohibited other business calls, permission/scope changes and automatic retries, including after ambiguous responses. It supplied one synthetic Student, Markdown content, one training record with `trainingTime: "2026-10-29T08:00:00.000Z"` and one subject with `score: 88`; no image/attachment or execution-control fields. View was conditional on an existing available tool and current authority. The assistant did not invoke the client or issue a live write.

The user reported the following result in this conversation:

| Observation | User-reported result |
| --- | --- |
| Actual business calls | Create **1**, view **1**, other business tools **0**. |
| Create business response | Only `result` identity; no full Student detail. The client exposed outer `content` and `structuredContent`. |
| Response channels | Text and structured results agree for both create and view. |
| Returned-ID handoff | View used the actual create ID; the returned Student ID matched. Identity is retained only as `<created-id>`. |
| Student fields | Exact supplied synthetic name and `level: 1` match. |
| Markdown | Full text and line breaks match the supplied synthetic content. |
| Training record | Exactly one; supplied name matches. |
| Date | Returned `2026-10-29T08:00:00.000Z`, matching the specified instant. |
| Subject | Exactly one; supplied name and `score: 88` match. |
| Errors/replay/authority changes | No error, timeout, retry, permission modification or OAuth scope expansion reported. |
| Retention/cleanup | Record remains retained; at read time Student, record and subject each had `deleted: false`. No later modification or deletion reported. This is not cleanup proof. |

**Disposition and attribution.** This passes only the bounded **user-reported ChatGPT create → returned-ID view happy path**, including aggregate/date round-trip and identity-only/equivalent response channels. It is not an independently captured tool trace or raw-wire inspection. No fresh client version, exact granted OAuth scope, account/permission category, active-instance identifier, endpoint or immutable served revision was supplied. In particular, no new authorization expansion was reported, but the effective scope was not inspected; do not infer restricted-identity coverage from a successful authorized call. The prior successful local tests remain separate evidence for scope/permission denials, revocation, strict unknown-input rejection and instance isolation; this journey does not re-prove them or atomicity/rollback/replay safety.

Recording baseline is dirty Cabloy Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`, **26 carried modified tracked paths**. The five production paths in the preceding qualification table (Student controller/create DTO, mapper, schema helper and exact shared admission) were rechecked locally and match their retained source hashes; their combined `git diff --binary HEAD -- <five-paths>` SHA-256 is **`80b5f24fcdc4db003a46e93ccd3e4ebc6629f6d7833e4d2652d88d605e9b7112`**. This attributes the local recording context, not the running client's served bytes. Only this evidence record and progress are amended for the report, with applicable derived chart checks. No new runtime test, live call, permission/environment/dependency/source change, restart/deployment, cleanup, commit or push is performed by the assistant. The minimized record omits the synthetic mobile, actual record identities, connection URL, credentials/tokens and callback state; manually reviewed path minimization is not secret scanning or acceptance proof.

Documentary verification: progress formatting, the full 68-definition authority audit, English chart generation/freshness (**0/12 verified**) and the scoped two-record path check passed. The first final `git diff --check` failed on an extra blank line at this record's EOF (chain producer **2**, sanitizer **0**); that blank line was removed without changing the reported client result. No runtime suite or public-docs build is run for this evidence/progress-only update. Retained evidence remains formatter-ignored and manually privacy-reviewed; static/path checks do not authenticate the client report.

This supersedes the absence of actual-client create happy-path evidence only for this reported journey, not historical statements about earlier executions. The synthetic record is deliberately still retained; next single action is user-owned deletion through normal Admin when inspection is finished, followed by a minimized cleanup report, not an automatic MCP mutation. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12**, whole Proposed ADRs and independent restricted-client/served-revision/operational/release gates unchanged.

### Student update implementation and transport-depth qualification stop (2026-10-30)

The user separately approved the [sixth-tool dossier](../pdp-wbs.md#student-update-sixth-tool-extension-dossier-2026-10-29), including the minimal shared-service root-admission guard, and instructed execution to continue. Approval covers this bounded update increment under existing `WBS-MCP-30-01`, `WBS-MCP-30-02`, `WBS-MCP-40-01`, not a successor or whole-ADR acceptance. Recording baseline remains dirty Cabloy Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**: **26** carried modified tracked paths before this increment, **28** now, adding only the Student service and its existing test owner to that path set. Preserve carried source/image/create/generated changes; the unknown-origin lockfile binary-diff SHA-256 remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**. Test run identifiers and log timestamps are UTC 2026-10-29; this stop handoff is dated local 2026-10-30.

**Implemented, not qualified.** Method-only `@Mcp.tool({ name: 'training_student_update', readOnly: false, ... })` annotates the existing guarded PATCH Action. Exact normal composition now includes six Student tools, with independent current update permission AND `mcp:all`; no standalone delete/deleteForce/bulk admission. Grouped `{ params: { id }, body: { ... } }` reuses the complete existing DTO, including required name/mobile/level, Markdown, records/subjects and declared nested identity/deletion controls. The shared service checks ordinary current-instance/deleted root scope before content preparation or mutation and returns on absence. No cross-instance probe, transaction, lock, rollback or concurrent-deletion guarantee was added. Existing void/null response adaptation is reused, not rewritten: `{ result: null }` is completion only, not existence, affected-row or read-back proof. Wrong-parent failures may follow partial target writes. Authority was amended first in eight existing owners; current guidance now carries an explicit qualification stop.

**Retained failures and corrections.** Initial native/style checks exposed fixture DTO typing, an unused import, inferred relation fields, reverse-array and cleanup-style issues; these were corrected within the existing test owners, without changing DTO/ORM contracts. An initial combined mapper/Student run **`20261029153914-e75d8e51`** was **36/37**: the mapper expected raw input instead of existing DTO-added `deleted: false` defaults. Exact normalized expectations were corrected; strict-input assertions were not weakened. Normal HTTP run **`20261029160400-30f34ff9`** was **13/15**, failing two test setups with `ERR_INVALID_ARG_VALUE` (`methodName` must be a method). Source tracing established `getById` and `updateById` are proxy-generated closures, not prototype methods. Discovery now spies the real `update`, retaining existing `get`; the aggregate test spies real root `update` plus the three concrete inherited child `mutateBulk` methods. Zero-business-work and unchanged-write-count assertions remain. This was test instrumentation repair, not a production ORM change or permission/root-isolation failure.

All runtime procedures below used installed **Node v24.11.0**, command-local PATH, the managed root entrypoints and default runner concurrency. Source was frozen during each run. Producer and sanitizer exits were separately captured:

| Procedure | Observed result and scope |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | Final run **`20261029160307-69de001c`**, **37/37**, zero failed/cancelled/skipped/todo; producer **0**, sanitizer **0**. Mapper 20 and Student 17 cover grouped contract, strict binding, retained child controls/no parent FKs, fixed PATCH/null channels and safe output failure without replay, plus ordinary aggregate update and missing/deleted/foreign-root service no-write regression. This bypasses transport ingress and is not HTTP aggregate qualification. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | After spy correction, run **`20261029161246-042c43e1`**, **14/15**, one failed, zero cancelled/skipped/todo; producer **1**, sanitizer **0**, graceful application shutdown. Discovery now passes. The new aggregate test fails at its first expected business-permission denial: HTTP **400**, expected **200**. No successful aggregate update, real executor-null, update read-back, update revocation or wrong-parent assertions later in that body were reached; do not credit them as passed. Existing read/create/ingress/drain tests pass separately. |
| Same HTTP command additionally setting `PROJECT_DISABLED_SUITES=a-training` | Run **`20261029161549-73a90dc4`**, **15/15**, zero failed/cancelled/skipped/todo; producer **0**, sanitizer **0**, graceful shutdown. Empty normal catalog and all six unavailable are checked. Training-dependent bodies return early, so their runner pass labels are not update/aggregate execution proof. |
| `npm run test:e2e -- mcp-authorization` | Run **`20261029161629-c7f56050`**, **4/4**, producer **0**, sanitizer **0**, graceful shutdown. Existing OAuth/consent/PKCE/Bearer and SSR/hydration journeys verify six all-scope versus four read-scope tools. No browser mutation or actual-client update journey. |
| Native no-emit via `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project <module>/tsconfig.json` | training-student, cabloy-mcp and mcp-test all pass after typing/default-expectation corrections. cabloy-mcp was rerun after the final spy edit: producer **0**, sanitizer **0**. No generation, frontend builds, dependency handoff or reinstall. |
| Seven changed code-file format/lint | Final **0**, sanitizer **0**, including final HTTP spy bytes and browser catalog. |
| Public docs build, repeated after stop notices; guide file targets | Final producer **0**, sanitizer **0**; existing >500 kB chunk advisory only. **26** local targets resolve with public root routes interpreted as docs routes. An initial naive filesystem-only link probe mislabeled 13 root routes missing; corrected resolution found no missing files. Fragments/external URLs/navigation were not exhaustively checked; suite-local guides are not built by the public build. |
| Full `npm run spec:check -- cabloy-mcp` before final archival | **68 definitions**, producer **0**, sanitizer **0**. Static structure only, not runtime or acceptance proof. Final archive/chart/path checks are recorded below after execution. |

**Source-backed transport blocker.** `cabloy-mcp/src/lib/transport.ts:59–83` limits JSON container nesting to eight; `:86–119` additionally counts all value nodes with root at depth 1 and rejects any depth above **8**. The approved grouped request has root → params → arguments → body → trainingRecords array → record → trainingRecordSubjects array → subject object → subject scalar, reaching **value depth 9**. A read-only traversal of the corresponding minimal synthetic envelope confirms 9. Thus the first legitimate full-aggregate request is rejected before SDK/tool/Action authorization. Existing `transportGuards.test.ts:316–342` deliberately tests exact value-depth 8 and rejection one beyond; this is not stale dependency state or a missing `mcp:all` grant. No temporary production diagnostic, transport relaxation, field omission or alternate-dispatch workaround was applied. Passing mapper/service proof cannot override the HTTP stop.

The current dossier explicitly preserves numeric/JSON bounds and does not authorize a shared transport depth-policy expansion. **Next single decision:** approve or withhold a bounded value-depth amendment sufficient for the approved aggregate request, with exact boundary regression and connected HTTP rerun. A minimal candidate is value depth **9**, while retaining the existing eight-container parse guard and every byte/node/key/array/string/duplicate-key bound; subject scalar depth 9 requires no ninth container. This candidate is **not accepted or implemented** here. Any accepted change must update its owning authority first, prove exact accepted/rejected depth edges and rerun the normal HTTP body without dropping fields or weakening permission, root or child-ownership assertions. No broader parser/schema framework or adjacent WBS work is proposed.

Execution-source SHA-256 at the stop (unchanged mapper/schema helper/transport included to distinguish coverage):

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `4e5b462042e91125be1664bcfca6ee1c615a0576d5f45d8a9d329061d5ba5cdf` |
| `vona/src/suite/a-training/modules/training-student/src/service/student.ts` | `c9f96eb74add0fcefa95b2b8bc179c06d42dc18565743348d1e8d2025555e355` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `5952b2c4c7762e4e865153a9f936488f2b7a29fd6a48ae0a09d861b31e3bdedf` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `b1311cdd56bdbe590ba4956474a328516f9574c9d9115daab49b09513532f253` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts` | `c868cbb2f6391ff51086358c62cecb16c218d27a32bf06a20ccf0d0a0e710369` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/transport.ts` | `6d0ac15360d0fec1e84e7f722329b8ab2bc589df94b9fe84cafcadfdd0997421` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts` | `113abb7c9278ff4779c230a2cb07f9380703027ebffcd8662cae5a0791dd9add` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `9814b257308bddfcbffeef4db0a03e123c1b8881a945825abf191e5b884e3351` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `b954cd3a8981ba8e00b9e043c7f386248a7cdbb89370bd97e0a1c26ba63990fb` |
| `vona/src/suite/a-training/modules/training-student/test/student.test.ts` | `60df81f4947f0a06856950e35ba5e00667794cdcbf6594ff4e420bf6ee0661ec` |
| `repo-e2e/specs/mcp-authorization.spec.ts` | `4134649c5e0696f8e2c942fbb37b897d06f7cd4cb5bf692af9011789a7a6e47a` |

Successful final mapper/Student, Training-absent and browser runs each have exact claim/generated/data paths checked **absent** after shutdown. Both failed HTTP claims remain **present**; failed resources are runner-retained, not manually cleaned. Earlier failed mapper resources/history are not erased. Persisted test fixtures use precise owned IDs and reverse dependency `finally` cleanup, including deleted descendants; this is distinct from managed failed-run retention. No prior live create fixture was cleaned here.

This increment is **implemented but unqualified**. No live-client update, actual account/permission change, `.env*`/credential read, dev reset/init, environment identity/port change, arbitrary dependency install, process killing, deployment, main-checkout edit, historical cleanup, commit or push occurred. Restricted-client A/B remain unavailable and unexecuted, not passed/failed; prior user-reported create/view and unconfirmed retained-fixture cleanup keep their limits. Parent WBS rows stay **blocked**, full ATPs **open**, verified **0/12**, whole Proposed ADRs unchanged and served-source/operational/release gates independent. Minimized retained evidence excludes raw identities, synthetic field values, URLs, credentials, tokens and callback state. Sanitized local logs are not committed captures; manually excluding regex-escaped browser paths and nonessential runtime values is not secret scanning or acceptance proof.

Final documentary checks after this stop record and progress update: README/progress format, full **68-definition** authority audit, English chart generation/freshness (**0/12 verified**), scoped path checks over the **13** amended authority/evidence/guidance owners and `git diff --check` all pass; chain producer **0**, sanitizer **0**. Charts regenerate without a tracked SVG delta because parent statuses remain unchanged. Public docs were rebuilt after the stop notices, producer **0**, sanitizer **0**. These are static/documentary scopes only; they neither resolve the HTTP failure nor authenticate human/client evidence. Retained evidence is formatter-ignored and manually reviewed. Task qualification remains pending the separately approved depth-policy amendment; no automatic runtime retry or source expansion follows.

### Student update approved depth correction and connected qualification (2026-10-30)

**Later approval and supersession:** after the preceding stop report proposed exactly value depth 8→9 with container depth 8 retained, the user explicitly replied “同意，请执行下一步”. This separately authorizes the narrow authority amendment, source correction, exact edge regressions and connected qualification; it is not inferred from automated notifications or earlier update approval. Authority was recorded first in existing SRS, ADR 0008, WBS dossier and test-plan owners. Whole Proposed ADRs remain Proposed. This section supersedes the preceding **current unqualified** disposition for local aggregate HTTP only, without rewriting the historical 13/15 or 14/15 failures or claiming release/client acceptance.

Baseline remained dirty Cabloy Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`, 28 carried modified tracked paths at amendment entry and **30** after adding existing transport source/test owners. Work remained in the approved linked checkout. Unknown-origin `vona/pnpm-lock.yaml` HEAD binary-diff SHA-256 remains `f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`. No carried changes were discarded.

**Exact correction:** only `validateBody`'s parsed value-depth comparison changes from `depth > 8` to `depth > 9` in production. Root counts as one. Raw `rejectDuplicateKeys` still rejects a ninth container (`stack.length >= 8`). Existing 16 KiB body, 256 value nodes, 32 object keys/array entries, 2 KiB string/key, duplicate-key, UTF-8, ingress/output/worker/deadline and privacy controls remain. Existing transport regressions now accept eight containers followed by a scalar at value depth nine, reject the next scalar level and independently reject an empty ninth container. These end-to-end reader checks prove accepted/rejected envelopes; the raw container guard can reject the depth-ten envelope before the value walk. No DTO, ORM, mapper, executor or frontend contract change.

**Retained newly reached test failure:** initial amended normal HTTP run `20261030011319-9d6670e4` was **14/15**, producer **1**, sanitizer **0**. The valid aggregate now passed ingress, guarded execution and null completion, then failed exact dispatch-body comparison because existing DTO normalization returned nested identities as strings while the expectation retained Model numeric identities. Only the expectation now uses `String(record.id)` / `String(subject.id)` when the ID is present; omitted identities remain omitted, declared `deleted: false` defaults remain exact, and no fields, permission, ownership, deletion or cleanup assertions were removed. No production identity/coercion behavior changed. Format/lint and non-emitting native checks passed again before rerun. The failed claim was observed retained; no manual cleanup. A diagnostic command with an unmatched shell glob failed before its read-only retention probe; a corrected explicit-path probe obtained the run identity, without changing resources.

All runs below used installed **Node v24.11.0**, command-local PATH, default runner concurrency, managed root entrypoints and frozen source per run. Producer/sanitizer exit codes are independently captured, not inferred from pipeline completion:

| Procedure | Observed result and coverage |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts` | Run `20261030011234-79087be6`, **8/8**, zero failed/cancelled/skipped/todo; producer **0**, sanitizer **0**. Exact depth/container boundaries and retained byte/node/key/array/string/duplicate/UTF-8/ingress/output controls. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | Final run `20261030011606-0ebdfafe`, **15/15**, zero failed/cancelled/skipped/todo; producer **0**, sanitizer **0**, graceful shutdown. The unchanged full aggregate journey now reaches and passes guarded PATCH, exact normalized dispatch/native date, once-only aggregate mutation, real executor null/equivalent channels, legacy root-only completion without replaying id-less inserts, independent authorized view, Markdown/date/subject values and nested deletion. It also passes independent update authority, scope/invalid-input no dispatch/no write, current permission/token revocation, missing/deleted/foreign-root no nested mutation and wrong-parent record/subject protection. Protected resources remain unchanged; this does not prove whole-target rollback, aggregate atomicity or concurrent-delete protection. |
| Same HTTP command additionally setting `PROJECT_DISABLED_SUITES=a-training` | Run `20261030011721-94cec04e`, **15/15**, producer **0**, sanitizer **0**, graceful shutdown. Empty catalog/all six unavailable. Training-dependent bodies return early; their runner pass labels are not aggregate execution without Training. |
| `npm run test:e2e -- mcp-authorization` | Run `20261030011817-999c52b2`, **4/4** in 6.8s; producer **0**, sanitizer **0**, graceful shutdown. OAuth/consent/PKCE/Bearer and SSR/catalog/read journeys retain six all-scope versus four read-scope. No browser mutation or actual-client update. |
| Affected format/lint plus `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json` | Initial transport pair and final identity-expectation correction both pass; producer **0**, sanitizer **0**. Other module sources and earlier mapper/Student **37/37** are unchanged; those earlier results retain their revision/hash scope and were not represented as newly rerun. |
| Three-guide format and `npm run docs:build` | Producer **0**, sanitizer **0**; build 13.23s, existing >500 kB chunk advisory only. Current stop notices superseded with local proof/limits. **26** local guide file targets resolve; fragments/external URLs/navigation not exhaustively checked, suite guides outside public build manually checked. |
| Authority format/full `npm run spec:check -- cabloy-mcp`/`git diff --check` before archival | Producer **0**, sanitizer **0**, **68 definitions**. Static authority/whitespace checks only. Final evidence/progress/chart/path checks follow below after execution. |

Final execution-source SHA-256 (other Student/admission/mapper/schema/browser hashes match the preceding stop table):

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/transport.ts` | `fc78ca045e97fe2be881b613de25ea28b0532257165e26e692100f62e7c167db` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts` | `6853a880979ca74e6f5eb61e6899823295a2331dca4d2774e5ec53f7a22c3589` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `640a475d9d05ef59f00be0649e5f6aeef1b7ae0bc5d2ecbf85a56fcea7c8fcf5` |

Each successful guard/normal HTTP/Training-absent/browser run's exact claim, generated and runtime-data paths was checked **absent** after shutdown. Test-owned persisted fixtures retain precise reverse-dependency `finally` cleanup; successful managed cleanup is separate from failed-run retention. Prior failed resources/history were not manually deleted. Existing live/uncertain historical claim remains the runner's ownership decision, not authority for process killing or cleanup.

**Bounded result:** the sixth-tool update and approved depth correction are locally qualified through the required connected checks. `{ result: null }` remains completion only, never existence/affected-row/read-back proof; uncertain responses permit no automatic replay. No live-client update, real account/permission change, `.env*`/credential read, dev reset/init, environment identity/port change, arbitrary install, generation/frontend build/dependency handoff, process killing, deployment, main-checkout edit, historical/live-fixture cleanup, commit or push occurred. Restricted-client A/B remain unavailable/unexecuted, prior live create cleanup unconfirmed, immutable served-source and operational/release proof independent. Parent WBS rows stay blocked, full ATPs open and verified **0/12**. Evidence retains no raw fixture identities/fields, tokens, credentials, callback state or runtime URLs; path sanitation is not secret scanning or acceptance proof. Local sanitized logs are not committed wire captures.

Final archival pass initially reached successful README/progress format, full **68-definition** authority audit, English chart generation/freshness (**0/12 verified**) and scoped path checks, then `git diff --check` rejected an extra blank line at EOF (producer **2**, sanitizer **0**). The extra blank was removed; this documentary failure does not invalidate runtime results. The rerun passes full **68-definition** authority audit, English chart generation/freshness (**0/12 verified**), scoped path checks over the ten amended documentary owners and `git diff --check`, producer **0**, sanitizer **0**. Charts have no tracked SVG delta because parent statuses remain unchanged. Evidence is formatter-ignored and manually reviewed; static/path/chart success is not secret scanning, actual-client evidence or release acceptance.

### Actual-client fresh create/update attempt; read-back failed (2026-10-30)

**Authority and fixture separation:** after local qualification, the user separately approved an actual-client update→view journey, then reported that the earlier create/view fixture had already been deleted. That is a user-reported deletion, not cleanup performed or independently verified by this assistant. The old identity was not reused. The user explicitly approved the replacement budget of at most **one new create, one update and one view**, using only this create's returned identity. The handoff limited create/update to required root fields, changing only the name during update while preserving the original full mobile and level; no nested effects, extra business calls, replay, authority/connection changes or cleanup were authorized. This root-only journey is not full aggregate client proof.

**User-reported observations:**

| Operation | Reported result |
| --- | --- |
| `mcp__test__training_student_create` — exactly once | Succeeded with a new identity; `structuredContent` and JSON-text channels agreed. |
| `mcp__test__training_student_update` — exactly once | Returned `{ "result": null }` with equivalent channels. This is a completion receipt, not persisted-state, affected-row, existence or read-back proof. |
| `mcp__test__training_student_view` — exactly once | Returned an error and lacked `structuredContent`. Identity, updated name, level, masked mobile and read-response channel equivalence could not be verified. The user stopped immediately. |

The user observed no timeout prompt and reported no retry, extra business call, permission/connection change, deletion or cleanup. The **new fixture remains retained**; this is distinct from the earlier deleted fixture. Create success is supported by the user report; the post-update persisted state remains **unverified/uncertain**. Update was not replayed. Failed view does not imply update rollback or justify another update.

**Evidence limits and disposition:** no sanitized error code/text or independently captured wire response was supplied, so the view failure's cause is unknown. Do not infer authorization failure, missing resource, serialization defect or served-source drift from absent `structuredContent` alone. The client alias `mcp__test__` does not establish anonymous server ownership or effective scope. This is user-reported actual-client evidence, not independently executed calls, current-account/effective-scope proof or immutable served-revision evidence. The archive checkout remains dirty Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2` with 30 carried modified tracked paths and the preceding local source hashes; those identify local qualification bytes, **not** the externally served revision. The carried lock delta remains unchanged.

The actual-client **create→update→view chain did not pass**. Earlier local qualification remains separate and is not invalidated by an undiagnosed external-client failure. Restricted-client A/B remain unavailable/unexecuted; parent WBS rows remain blocked, full ATPs open, verified **0/12**, and operational/release gates unchanged. This archival step makes no runtime/source change, new business call, test rerun, cleanup, deployment, commit or push. No raw identities, input values, credentials, tokens, URLs or full request/response bodies are retained. Next diagnostic handoff is limited to already-observed, minimized error classification/code/text, with sensitive values removed; another call, write or replay requires separate bounded authorization.

Documentary checks initially passed progress formatting, the 68-definition authority audit, English chart generation/freshness (0/12 verified) and scoped path checking, then failed `git diff --check` on an extra EOF blank line (producer **2**, sanitizer **0**). That blank line was removed; the complete rerun passed progress formatting, the **68-definition** authority audit, English chart generation/freshness (**0/12 verified**), scoped path checks and `git diff --check`, producer **0**, sanitizer **0**. The carried lock-diff hash is unchanged. Evidence is formatter-ignored and manually privacy-reviewed; path checks are not secret scanning or acceptance proof. This documentary failure and successful rerun are not runtime or actual-client test results.

### Basic-fields-only MCP journey regression; client failure not reproduced (2026-10-30)

**Approval and scope:** the user first supplied already-observed diagnostic classification: the failed live view was an MCP tool result with `isError: true`; text content existed but its original text and error code were unavailable. No new tool call occurred during that classification. The user then separately approved read-only source investigation, followed by the proposed single existing-HTTP-test regression. This test-only increment contributes to existing `WBS-MCP-30-01`, `WBS-MCP-30-02`, `WBS-MCP-40-01` and their existing contract/call/auth/instance ATP associations; no new requirements, IDs, production repair or live-client call are authorized by it.

Source inspection found that `controllerTools.ts:288–309` returns the reported tool-error shape both for resource absence (`Resource not found`) and caught Action/output/JSON failures (`Action failed`). Without the original text or served revision, those branches cannot be selected for the live incident. Empty content, empty training-record arrays and absent image have supported paths. Existing tests covered populated aggregate read-back and basic-only content persistence separately, but not the complete basic-only MCP journey.

**Implemented regression:** only `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts:1146` changes source in this increment. One owned fixture is created through authenticated normal MCP with only required root fields, updated on the returned ID with only its name changed (original mobile and level retained), then viewed under separately installed view authority. Existing helpers require HTTP success, no protocol/tool error and exact JSON-text/structured channel equivalence for each step. Assertions cover identity-only create, null update, matching view identity/updated name/level, masked mobile, omitted optional empty Markdown and `trainingRecords: []`. Exact owned-name recovery handles a create response failing after insertion; scoped `finally` deletes owned content before the root. No live record or seed is targeted.

**Retained initial failure:** static format/lint/non-emitting native checks passed, then managed HTTP run `20261030045934-c082995f` was **15/16**, producer **1**, sanitizer **0**. The new journey had already passed create, null update, successful MCP view/channel checks and root-field assertions; its new expectation of `descriptionMarkdown === ''` failed with **actual `undefined`, expected empty string**. The later empty-record assertion was not reached in that run. This was not an `isError: true` reproduction. A read-only lookup initially guessed the nonexistent `a-serializer` module path and exited 2; the owning module is `a-serialization`. No source or resources were changed by that lookup.

The existing response path explains the expectation correction: `EntityStudentContent` declares optional Markdown; `vona/packages-utils/zod-query/src/lib/query.ts:182–188,231–245` normalizes optional empty strings to `undefined`; the mapper parses the existing response schema and JSON-round-trips it at `controllerTools.ts:300–303`, omitting that property. `BeanSerializer` applies transforms but is not itself the schema parser. Only the new test now asserts absence with `Object.hasOwn(..., 'descriptionMarkdown') === false`; success/channel/root/empty-array checks remain, and no DTO, mapper, coercion, serializer, permission or production contract changes.

**Final verification:** installed Node **v24.11.0**, command-local PATH, unchanged default concurrency, frozen final test source:

- `npm run format -- <test>` and `npm run lint -- <test>`, then `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json` passed before both HTTP attempts.
- `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts`: final run **`20261030050443-f275a7db`**, **16/16**, zero failed/cancelled/skipped/todo, producer **0**, sanitizer **0**, graceful shutdown. The new basic-only body executed and passed; the existing aggregate/security checks in that file also passed.
- The final successful run's exact claim/generated/runtime-data paths were checked absent. The initial failed run's three exact paths remain present under runner retention; no manual cleanup. Test-owned fixture cleanup remains separate from runner resource retention.
- Final test SHA-256: **`783c468a75090ad3427d4e9b93c42e3c79636f40a031edf4bc785be439a8c1b6`**. Baseline remains dirty Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`, 30 modified tracked paths, with carried lock-diff SHA-256 **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`** unchanged. This hash identifies local test bytes, not served-client bytes.

**Disposition:** the basic-only local coverage gap is closed; the live-client tool error is **not reproduced or diagnosed**. No production fix is justified by this result. Earlier Training-absent/browser/mapper/service proof remains historical under its own hashes; those suites were not rerun for this one-test addition. No public guide or generated contract changed. The live record remains retained, its post-update state unverified; no additional live call, retry, cleanup, account/configuration change, deployment, commit or push occurred. Restricted-client A/B remain unavailable/unexecuted, parent WBS rows blocked, full ATPs open and verified **0/12**. The next useful diagnostic boundary is existing operator-side failure evidence and served-revision attribution, under separately approved access, not a new write/replay. No raw fixture identities, input values, credentials, tokens, URLs or full payloads are retained here.

Archival checks pass progress formatting, the full **68-definition** authority audit, English chart generation/freshness (**0/12 verified**), scoped evidence-path checking and `git diff --check`, producer **0**, sanitizer **0**; carried lock-diff hash unchanged. Evidence is formatter-ignored and manually privacy-reviewed; path/static/chart checks are not secret scanning, live-client proof or release acceptance.

### Actual-client separately authorized follow-up view succeeded (2026-10-30)

**Scope and chronology:** after the preceding local regression, the user separately approved read-only inspection of existing service logs and served-version clues. A bounded inspection of six normal-development error/combined/http log files for October 29–30 found no `/mcp`-context records or relevant fixed error markers. Only allowlisted metadata and fixed-marker projections were inspected; no raw message/stack/request payload was retained. This absence does not establish that the request did not occur: MCP middleware handles `/mcp` before ordinary HTTP logging, and the mapper catch does not log the caught exception. No immutable served-source attestation was found in the inspected startup path. Environment/credential contents, generated environment files, runtime credentials JSON and startup token output were not read; no business call or configuration change occurred during that investigation.

The user then explicitly confirmed that the ChatGPT MCP service was launched from the current `spec-basic-cabloy-mcp` worktree. This is **user-reported service-location attribution**, not proof of the exact source bytes loaded by the worker at the original failed call. The user separately approved exactly one new point `training_student_view` on the known retained fixture returned by the fresh create—not the earlier deleted fixture—with no search, create, update replay, other business call, authority/connection change or cleanup. The later approval is distinct from the exhausted original create/update/view budget.

**User-reported follow-up result:**

- `mcp__test__training_student_view` called **once** in this separately authorized round; no JSON-RPC error observed. `isError` was **not provided**, not explicitly reported as `false`.
- Both `structuredContent` and a text `content` block were present; reading succeeded and their contents were reported semantically equivalent.
- Returned identity matched the intended retained fixture; name matched the earlier update's requested value; level matched its input; mobile was masked. No raw identity, field value, full request/response or connection detail is retained here.
- No timeout or ambiguous result, retry, other business tool, account/permission/connection/configuration change or cleanup was reported. The fixture remains retained.

**Current disposition:** the expected updated state is now **verified at the follow-up read time by user report**; earlier statements that it was unverified describe the earlier evidence boundary and are superseded for current state by this later observation. The original view still failed, its original error text/code remain unavailable, and its cause is **unknown**. The later success neither diagnoses that failure nor establishes that a code fix repaired it; no production repair was made. Do not recast the original attempt as an uninterrupted passing chain. Across the fresh fixture's two separately approved rounds, reported operations total **one create, one update and two views**; create/update were not replayed, and the record was not deleted.

This is minimized user-reported actual-client evidence, not independently captured wire proof, immutable served-source evidence, complete aggregate actual-client qualification or restricted-client A/B proof. It contributes only to the existing business-tool WBS/ATP evidence associations; parent WBS rows remain blocked, full ATPs open, verified **0/12**, Proposed ADRs and operational/release gates unchanged. This archival increment changes only existing evidence/progress and eligible derived charts; it authorizes no further live call, test run, cleanup, source repair, deployment, commit or push.

**Archival verification:** under installed Node **v24.11.0**, progress format, full **68-definition** `spec:check`, English chart generation/freshness (**0/12 verified**), scoped `evidence:check` and `git diff --check` passed, producer **0**, sanitizer **0**. Local baseline remains dirty Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`; carried lock-diff SHA-256 remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**. Evidence is formatter-ignored and manually privacy-reviewed. These documentary checks do not establish secret scanning, worker-loaded revision, runtime ATP completion or release acceptance. A final evidence-only wrapper passed path/diff checks and confirmed the unchanged 30-path baseline/lock hash, then exited **127** (sanitizer **0**) because its optional heading lookup used `rg`, unavailable in that Bash PATH; no source or runtime failure occurred. The final check uses installed Node for heading lookup instead.

### Student delete seventh-tool implementation and connected local qualification (2026-10-30)

**Approval and attribution:** the user separately approved the [seventh-tool dossier](../pdp-wbs.md#student-delete-seventh-tool-extension-dossier-2026-10-30), including named authority amendments, the delete-only risk/design disposition and bounded implementation/managed verification/evidence updates. Approval is not inherited from create/update and does not authorize a live deletion. The eight existing authority owners were amended before source. Existing `WBS-MCP-30-01`, `WBS-MCP-30-02`, `WBS-MCP-40-01` and `ATP-MCP-CONTRACT-01/02/03`, `ATP-MCP-AUTH-02`, `ATP-MCP-CALL-01/02`, `ATP-MCP-INSTANCE-01` remain the owning associations; no new IDs or full-ATP closure.

Recording baseline remains dirty Cabloy Basic **`ab3657cd507457e83e8b6c4b93698f9c721d84e2`**, with **30 carried modified tracked paths**, still 30 after this increment. All writes stay in the active linked checkout; carried image/create/update/generated changes are preserved. Unknown-origin `vona/pnpm-lock.yaml` HEAD binary-diff SHA-256 remains **`f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`**. These local source fingerprints do not attest worker-loaded actual-client bytes.

**Production slice:** method-only `training_student_delete`, explicit `readOnly: false`, annotates the existing ordinary guarded DELETE; exact normal admission adds only `training-student.controller.student#delete`. Require `mcp:all` AND independent current delete authority. Flat `{ id }` binds to fixed `DELETE /training/student/:id` with `{ params: { id }, innerAccess: false }`; existing identity/schema/executor/null handling is unchanged. Discovery remains fresh sequential guard-only, with no business reads, row probes or trial mutations. The ordinary shared Student service first obtains the active current-instance root with `columns: ['id']`, returning before any cascade when absent. This closes the concrete cache-enabled requested-ID cascade hole for ordinary deletion: active current-instance content/records/subjects referencing missing, soft-deleted or foreign roots remain unchanged. It is not a cross-instance probe or an atomic concurrent-deletion guarantee. Force/bulk and ORM are unchanged.

This is **destructive aggregate soft deletion**, not root-only deletion, guaranteed restoration/retention or attachment/blob removal. Existing pruning can later physically remove rows. Equivalent `{ result: null }` channels acknowledge completion, not existence, affected-row count, complete cascade or read-back. Missing/deleted/foreign roots deliberately share completion. Sequential effects may partially persist after errors, timeout or delivery/output failure; no new transaction, lock, atomic cascade, rollback, replay safety, deduplication or idempotency promise. Do not automatically replay. The separately accepted delete-only disposition adds no per-call confirmation flag/store/UI/gate and individually defers dedicated protected audit, audit-delivery/outage gating and deployment-wide fine-grained/fleet quotas; ordinary logs are no protected audit/compliance proof. Existing OAuth/readiness/host/instance/privacy/ingress/JSON/result/worker/deadline/settlement/drain controls remain unchanged. No mapper, DTO, ORM, executor, transport or generated frontend production edit is part of this increment.

**Retained intermediate failure:** normal HTTP run **`20261030112456-ac631af8`** was **16/17**, one failure, graceful shutdown. Actual aggregate DELETE/null completion, persisted soft-deleted root/content/record/subject, unchanged unrelated aggregate and separately authorized view absence had already passed. The new intentional repeated-ID legacy probe then incorrectly compared the entire legacy completion wrapper to the modern wrapper: modern includes existing `_meta`/`resultType` fields, legacy does not. Both business channels already contained `{ result: null }`. Only this test helper's comparison surface was corrected to `structuredContent` and `content`; shared `output(...)` still asserts HTTP success, no protocol/tool error and exact text/structured equivalence. Exact DELETE options, real null, permission, effects, isolation and cleanup assertions remain. The missing/foreign probes and final snapshots after that failed assertion were not credited until the passing rerun. No production protocol repair or response-field removal occurred. The failed run's claim/generated/data paths were observed present and not manually deleted.

One initial new shell wrapper used Bash `PIPESTATUS` under the default zsh shell, printing empty producer/sanitizer fields; its overall HTTP exit was 1 and the retained log proves 16/17, but **separate producer/sanitizer statuses for that run were not captured**. The initial style-only wrapper had the same capture defect despite passing tool output. Later final wrappers explicitly invoke `/bin/bash`, record both statuses and propagate failure. Do not retroactively label the first run 1/0. A first guide-link probe also failed on the valid VitePress root-relative extensionless `/backend/serialization-guide`; its shell printed `producer=1` without propagating failure. Correct route resolution subsequently passed. A rejected ambiguous exact-string Edit made no change; the unique delete-test call-count edit preserved the separate update expectation.

All final procedures use installed **Node v24.11.0**, command-local PATH, default runner concurrency, managed root test entrypoints and frozen source per run:

| Procedure | Observed result and scope |
| --- | --- |
| `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts src/suite/a-training/modules/training-student/test/student.test.ts` | Final run **`20261030112058-d6acb0db`**, **39/39**, zero failed/cancelled/skipped/todo; producer **0**, sanitizer **0**, graceful shutdown. Includes numeric/string identity normalization, flat closed input, malformed/undeclared-control rejection before dispatch, exact DELETE/options, null channels, conservative annotations and safe invalid-output errors without replay. Service regression creates active current-instance descendants pointing to genuinely missing/deleted/foreign roots and proves they remain unchanged, including foreign owning-context aggregate. Earlier run `20261030111926-f2fbce09` was also 39/39 but predates the final numeric-ID assertion and does not qualify that added assertion. |
| `PROJECT_DISABLED_MODULES=mcp-test SERVER_LISTEN_DISABLE=false npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | Final run **`20261030112642-42f3ca53`**, **17/17**, zero failed/cancelled/skipped/todo; producer **0**, sanitizer **0**, graceful shutdown. New connected body executes: delete-only discovery/call, other Action permissions not granting delete, read-scope/invalid-input predispatch rejection, current permission and token revocation, actual guarded DELETE/null channels, persisted aggregate soft deletion, independent view absence, nondisclosing repeated/missing/foreign completion, unchanged unrelated and foreign owning-context aggregates. Intentional isolated absence probes are not live retries or an idempotency guarantee. |
| Same HTTP command with `PROJECT_DISABLED_SUITES=a-training` | Run **`20261030112739-e1834b9e`**, **17/17**, producer **0**, sanitizer **0**, graceful shutdown. Empty business catalog and all seven known Student tools unavailable, without synthetic fallback. Training-dependent bodies return early; their runner pass labels do not prove a deletion body executed without Training. |
| `npm run test:e2e -- mcp-authorization` | Run **`20261030112815-90c3e34a`**, **4/4** in 7.7s; producer **0**, sanitizer **0**, graceful shutdown. Existing OAuth/consent/PKCE/Bearer/SSR/read flows assert seven all-scope versus four read-scope tools. Browser change is catalog-only; no browser delete journey or actual-client deletion. |
| Native no-emit `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project <module>/tsconfig.json` | Final explicit-Bash capture checks training-student, cabloy-mcp and mcp-test, producer **0**, sanitizer **0**, on final source. |
| Seven changed code owners format/lint | Explicit-Bash final seven-file check producer **0**, sanitizer **0**; subsequent HTTP comparison correction separately formatted/linted and native-checked before the final HTTP run; final HTTP format/diff also passes. |
| Three guidance owners and `npm run docs:build` | Build producer **0**, sanitizer **0**, 8.70s, existing >500 kB chunk advisory only. **27** local guide targets/anchors pass with VitePress root-relative extensionless route resolution. Public build does not include suite-local guides; external URLs/navigation were not exhaustively checked. Guides document independent delete authority, aggregate effects, flat ID/null limits, absent-root guard, partial effects/no replay and delete-specific deferrals. |
| Eight authority records plus three guides format, `npm run spec:check -- cabloy-mcp`, `git diff --check` | Producer **0**, sanitizer **0**, full **68-definition** structural audit. Static checks do not accept whole ADRs or authenticate runtime/client evidence. Final archival/chart/path results follow only after execution. |

Final execution-source SHA-256:

| Repository-relative file | SHA-256 |
| --- | --- |
| `vona/src/suite/a-training/modules/training-student/src/controller/student.ts` | `89490e46e4013d69a77a690b1cf8f32d3adbcd2236e308b629dfe6170daca851` |
| `vona/src/suite/a-training/modules/training-student/src/service/student.ts` | `3b9852088042603995c24a9e019b5e40c3758adf3ae7e04258753bd94ca96642` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/sharedBusinessTools.ts` | `090d5a1e5f60296d3b19b8ada45a37a07d2c490e8fb4c8e65cb388f05fa22093` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts` | `b1311cdd56bdbe590ba4956474a328516f9574c9d9115daab49b09513532f253` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts` | `c868cbb2f6391ff51086358c62cecb16c218d27a32bf06a20ccf0d0a0e710369` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/transport.ts` | `fc78ca045e97fe2be881b613de25ea28b0532257165e26e692100f62e7c167db` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessHttp.test.ts` | `23b196bb62729eeb260fa44e89129544da4335b4963576491d73700deca342e2` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/test/businessTools.test.ts` | `0247626d4c2560d695ea7b696afcdf831039d3ba8d1f3760b34666bbacb4075a` |
| `vona/src/suite/a-training/modules/training-student/test/student.test.ts` | `2dea039ecb79dd1892b80f128973b3d840612df48cc8511472a0c2f61ecbd8f8` |
| `repo-e2e/specs/mcp-authorization.spec.ts` | `33203ab9cf91f04310051537d21aa538b1cb11c530e91156623086e7d8df17c7` |

The two successful mapper/Student runs and final normal HTTP/Training-absent/browser runs each have exact claim, generated and runtime-data paths checked **absent** after shutdown. Test-owned persisted resources use precise reverse-dependency `finally` cleanup within owning `mockCtx(...)`, including soft-deleted descendants and exact owned-name postcommit recovery. Runner retention of a historical live/uncertain claim is not a blocker for isolated runs or permission to kill/clean it. Prior failed-run resources/history remain runner-owned; no manual historical cleanup.

**Bounded result:** seventh-tool discovery/call, independent authority, real aggregate soft deletion, concrete unavailable-root no-cascade regression and required connected checks are **locally qualified**. No live-client call/deletion or retained-fixture cleanup occurred. No actual account/permission/configuration change, `.env*`/credential read, dev reset/init, environment identity/port change, install, generation/paired frontend build/dependency handoff, process killing, deployment, main-checkout edit, commit or push. Existing transport proof retains its prior unchanged-source scope, not a new transport test run. Restricted-client A/B remain unavailable/unexecuted; prior failed view and later successful user-reported read remain historical. Full aggregate actual-client, immutable served-revision, operational and release proof are independent. Parent WBS rows remain **blocked**, full ATPs **open**, verified **0/12**, whole Proposed ADRs unchanged. Actual-client delete requires a separately approved safe target and operation budget; no such call is authorized by local qualification. Minimized evidence excludes raw identities/field values, tokens, credentials, callback state and connection details. Sanitized local logs are not committed captures; path sanitation/manual privacy review is not secret scanning or acceptance proof.

**Final archival checks:** README/progress formatting, full **68-definition** authority audit, English chart generation/freshness (**0/12 verified**), scoped evidence-path checks over all **13** amended documentary owners and `git diff --check` pass, producer **0**, sanitizer **0**. Charts have no tracked SVG delta because parent statuses are unchanged. Evidence is formatter-ignored and manually privacy-reviewed. These are documentary/derived-view checks, not human acceptance, secret scanning, actual-client deletion or release closure.

### Actual-client authorized Student delete and subsequent view absence (2026-10-30)

**Separate authority and target:** after local qualification, the user explicitly approved deleting the retained test record from the fresh create → update → successful follow-up view journey, including its content, training records and subjects. This target was distinct from the earlier fixture already reported deleted. The approved budget was at most one `training_student_delete`, followed only after successful equivalent completion by at most one independently authorized `training_student_view` on the same exact identity. Unknown identity or prior execution count required stopping; searching, retries, other business tools, account/permission/connection/configuration changes and extra cleanup were prohibited. The assistant had no connected Student MCP tools in this session and supplied the bounded handoff instead of performing or claiming calls. The user subsequently reported the result below, then separately approved this evidence/progress/chart-only archival step.

**User-reported observations:**

| Operation | Reported result |
| --- | --- |
| Student delete — **1 call** | Successfully completed without a tool error. Structured and JSON-text channels were both equivalent to `{ "result": null }`. Null is completion only, not proof of complete deletion. Exact wire-level error flags/envelope were not supplied. |
| Subsequent Student view — **1 call** | Expected tool-level **`Resource not found`**, with no successful data. This expected absence is not classified as an unexpected journey failure. |
| Stop conditions | No timeout, ambiguity or other unexpected error reported. The approved delete/view call budget is exhausted; no further call, replay or cleanup follows. |

**Current disposition:** the bounded actual-client **delete completion → subsequent independently authorized view absence** journey passes **by user report**. This supersedes the prior current absence of actual-client delete evidence and the earlier retained-fixture state only to this observed scope: the targeted test record is reported unavailable to the subsequent view. It does not independently prove physical removal, the persisted soft-deletion flags of every related row, complete aggregate cascade, atomicity, rollback, restoration or replay safety. Existing local automated aggregate-soft-deletion evidence retains its separate fixture/source scope; no database inspection was performed for the actual-client target. The original failed view and later successful read remain historical and undiagnosed; this later deletion does not recast that earlier chain as uninterrupted success. The fresh fixture's reported operations across separately approved budgets now total **one create, one update, one delete and three views** (one failed original view, one successful follow-up view, one expected post-delete absence).

This is minimized user-reported evidence, not independently captured wire proof. No fresh client-version, effective scope/permission snapshot or immutable worker-loaded source attestation was supplied. Earlier worktree-launch attribution remains attribution only. Restricted-client A/B remain unavailable/unexecuted; full aggregate actual-client persistence, served-source, operational and release proof stay separate. Existing business-tool WBS/ATP associations remain unchanged; parents **blocked**, full ATPs **open**, verified **0/12**, whole Proposed ADRs unchanged. No credentials, tokens, full identities, mobile values, URLs, callback state or complete requests/responses are retained.

**Archival baseline and scope:** dirty Cabloy Basic `ab3657cd507457e83e8b6c4b93698f9c721d84e2`, **30 carried modified tracked paths**, in the active linked checkout. Carried lockfile binary-diff SHA-256 remains `f13acd0f46906eb9cb02bbe8dd0bf74c552e0c299be6d50e81482f92e5b31fc4`. Only this existing evidence record and `progress.md`, with eligible derived chart output, are changed by this archival increment. No new business call, source repair, runtime test, deployment, account/permission/configuration/environment change, reset/init, install, extra cleanup, commit or push. Documentary checks do not authenticate the report, prove secrets absent or close release gates.

**Archival verification:** under installed Node **v24.11.0**, progress formatting, full **68-definition** `spec:check`, English chart generation/freshness (**0/12 verified**), scoped evidence/progress path checks and `git diff --check` pass, producer **0**, sanitizer **0**. Charts have no tracked SVG delta because parent statuses remain unchanged. Evidence is formatter-ignored and manually privacy-reviewed; no public-docs build or runtime suite was needed or run for this evidence/progress-only increment. The previously qualified source and local-test results are not represented as newly rerun or as immutable served-source proof.

## User-provided real-client MCP refresh runtime evidence (2026-11-01)

**Attribution:** the user supplied two server log lines from their real-client interaction, then authorized recording the evidence and committing the completed refresh increment. The assistant did not independently capture the client traffic or inspect its credential storage. The supplied SHA-256 family correlator is replaced below by the consistent alias `FAMILY_A`; equality was observed in the supplied lines, not reconstructed from credentials. No raw tokens, codes, cookies, identity/client/grant IDs, full request URLs or machine-local paths are retained.

| Supplied UTC timestamp | Event | Family alias | Generation | Method / canonical path |
| --- | --- | --- | --- | --- |
| `2026-11-01T13:52:27.151Z` | `mcp.oauth.refresh_succeeded` | `FAMILY_A` | **4** | `POST /mcp/token` |
| `2026-11-01T13:52:27.204Z` | `mcp.oauth.refreshed_access_accepted` | `FAMILY_A` | **4** | `POST /mcp` |

**Bounded result:** the user-provided runtime logs establish server-side refresh completion followed by protected MCP authentication using the same refreshed generation. The interval between logged events is **53 ms**, not a measurement of total refresh latency. Generation 4 is consistent with the existing initial-generation-1 contract, but these two lines directly evidence only this generation's issuance and subsequent acceptance, not a complete history of earlier rotations.

The user's earlier report that an interaction worked and another approximately 25 minutes later also worked remains separate usability evidence. These lines do not independently measure an access-expiry wait, establish the absence of manual reauthorization, prove successful tool/business execution or client response persistence, or attest the exact worker-loaded source revision. No client-version snapshot or independent wire capture was supplied. This is bounded operational evidence, not a protected audit trail, production qualification or full security/release acceptance. Existing WBS/ATP statuses, **0/12 verified**, and whole Proposed ADR dispositions remain unchanged.

**Automated verification context:** before this archival closeout, the connected Passport/session/registration/authorization/HTTP run passed **61/61**, and the browser authorization selection passed **4/4**. The later JWT-pair selection passed **38/38**, with **5/5** JWT logging regressions. After adding refresh evidence, the authorization/HTTP selection passed **37/37**, zero skipped; final backend typecheck, docs build, scoped format/lint and diff checks passed. Seven actual formatted fixture refresh-event lines were checked for readable event/family/generation fields and permitted method/path metadata. The first evidence typecheck failed because an empty-array assertion narrowed a captured array to `never[]`; the assertion was corrected and typecheck passed. These are separate prior scoped runs, not a claim every suite was rerun together on the final source. Fixture output is not the real-client log source above.

**Commit-closeout verification:** the final unified managed selection covering JWT, ordinary Passport, Passport sessions, MCP registration, authorization and business HTTP passed **63/63**, **0 failed**, **0 skipped**, exit **0**. The documentation build after adding this record and its guide link passed, exit **0**; scoped documentation formatting, evidence-path checks, both new relative links and whitespace checks also passed. The original checkout remained clean. These checks verify the repository increment, not the exact worker revision that produced the user-supplied logs.

The operational event meanings and suppression limits are documented in [Server-side refresh evidence](../../../repo-docs/mcp/mcp-browser-authorization.md#server-side-refresh-evidence). No server restart, database reset, credential replay, environment/port change or push is part of this closeout. Unrelated Zova textlint dependency changes are excluded from the refresh commit and left untouched.

## User-reported Codex generic tool-contract compatibility (recorded 2026-11-11)

### Attribution and procedure

The user supplied a Codex read-only compatibility report and requested its archival in this spec. This is **user-reported client evidence**, not assistant-executed MCP calls, an independently captured transport transcript or a raw discovery response. The date above is the recording date; the exact client execution timestamp and Codex version were not supplied. The client namespace `mcp__test__` identifies its connection label only, not an endpoint, instance or runtime configuration.

The reported procedure used **six `cabloy_tool_contract` calls and one Student select call**, with no skill installed, loaded or used. The user reported no local-file reads, log searches, environment or business-data changes, or calls to the removed query helper. The assistant did not replay the procedure while recording it. The generic helper replaces the old query-only entry point; this observation does not depend on an old-tool alias or fallback.

Recording checkout: Cabloy Basic, HEAD `90fea47b916901608d45b59ace1c94458fe8413d`, with existing approved uncommitted implementation/documentation changes. This is recording context only, **not an attestation of the worker-loaded source** used by Codex. Mechanism and public contract boundaries are documented in [Retrieve one tool's contract](../../../repo-docs/mcp/mcp-controller-tools.md#retrieve-one-tools-contract).

### Minimized observations

The user distinguished exact server-published names from client callable identifiers:

| Server name used in helper arguments | Client callable identifier |
| --- | --- |
| `cabloy_tool_contract` | `mcp__test__cabloy_tool_contract` |
| `training-student_student_select` | `mcp__test__training_student_student_select` |
| `training-student_student_summary` | `mcp__test__training_student_student_summary` |

The model-visible select description supplied its exact server name, and helper responses matched the requested target. The helper declaration exposed required `tool: string` and optional `section: "overview" | "input" | "output" | "query"`. The select declaration retained compact `where?: { [key: string]: unknown }` and `list: Array<{ [key: string]: unknown }>` surfaces, alongside `total: string` and numeric pagination fields. These are **model-visible declaration observations**, not proof that the server published the TypeScript word `unknown`.

**Raw `tools/list` was not obtained.** The report relies on model-visible declarations and helper/business results; it does not establish raw client discovery, wire serialization or the client's declaration-conversion implementation.

| Call | Helper arguments | Reported result |
| --- | --- | --- |
| 1 | `{"tool":"training-student_student_select"}` | Default overview: `contractVersion: 1`, exact target, sections `overview/input/output/query`, input compact paths `[["where"]]`, output compact paths `[["list","items"]]`; no full schema embedded in overview. |
| 2 | `{"tool":"training-student_student_select","section":"input"}` | Full input schema returned as result data: explicit predicate leaves and recursive `and/or/not`; all inspected references resolved within its own `$defs`. |
| 3 | `{"tool":"training-student_student_select","section":"output"}` | Full public output schema returned as result data: required `list/total/pageNo/pageSize/pageCount`; row fields included `id/name/level/createdAt/updatedAt/mobile/image`. Row/image references resolved within this output's own `$defs`, without borrowing input definitions. Schema field visibility is not disclosure of row values. |
| 4 | `{"tool":"training-student_student_select","section":"query"}` | Native payload retained `grammarVersion: 1`, exact target, a binding with `argumentPath: []`, `mode: "select"`, `capabilities/querySchema/predicates`; no new generic schema wrapper. `level` admitted numeric `1/2/3` for `eq/gte`; pagination admitted `pageNo >= 1` and `pageSize` from 1 through 100. Full input supported `where.or`. |
| 5 | `{"tool":"training-student_student_summary"}` | Nonquery overview offered `overview/input/output`, with no query section. |
| 6 | `{"tool":"training-student_student_summary","section":"output"}` | Public output projection contained exactly `id/name/level/levelTitle/descriptionLength/summaryText`, all required, with `additionalProperties: false`; no mobile or full note fields. No summary business call was made. |

Reported reference examples included `#/$defs/TrainingStudentSelectQueryPredicate_52faf9b0777604cfccabc1d562ef60a2e5b2deb9` and `#/$defs/TrainingStudentSelectQueryPredicate` in input, and `#/$defs/training-student.dto.studentSelectResItem` in output. The report observed no truncation or hidden content in the inspected results based on visible structures and reference checks, not merely a successful helper status. These are reported inspections, not independently retained complete schema captures.

The **one** business call used the exact select tool with:

```json
{
  "where": {
    "or": [
      { "field": "level", "op": "eq", "value": 1 },
      { "field": "level", "op": "eq", "value": 2 }
    ]
  },
  "pageNo": 1,
  "pageSize": 10
}
```

The user reported success with `isError: false`, two rows whose levels were `[1, 2]`, `total: "2"` (string), `pageNo: 1`, `pageSize: 10` and `pageCount: 1`. There was no query splitting, client-side merging or retry. Row judgments apply only to the returned page; names, mobile values, notes and complete records are not retained here.

### Disposition and limits

The bounded **no-skill overview → full input/output/query retrieval → one native OR select** path passes **by user report**. The nonquery summary observation additionally supports exact public output projection retrieval, not execution of that Action. Expected compact `unknown` placeholders remained in model-visible declarations while detailed contracts were usable as result data. Successful execution does not prove complete declaration rendering; declaration `unknown` does not prove server-published `unknown`.

No universal compatibility claim follows for other clients, tools, input/output forms, recursion shapes, query limits or pagination boundaries. Exact Codex version, execution timestamp, endpoint, account/instance/database/runtime, granted scopes/effective permissions, dependency versions, worker-loaded source revision, wire capture and client/server exit codes were not supplied. This record adds no negative authorization, revocation, cross-instance, mutation, production or release proof. No further client replay is required to archive this bounded reported result.

Supporting associations are `PRD-MCP-CONTRACT-01`, `SRS-MCP-CATALOG-01`, `WBS-MCP-30-01`, `WBS-MCP-40-01`, `ATP-MCP-CONTRACT-01` (contract projection) and `ATP-MCP-CALL-01` (valid call/result adaptation), not full acceptance of those requirements or tasks. Historical evidence is preserved. Original blocked WBS parents and full ATPs remain unchanged; the original baseline stays **0/12 verified**, and the separately verified personal-scope increment keeps the expanded register at **1/13 verified**.

This archival increment changes only this evidence record and its derived progress summary. No new MCP/business call, runtime test, source implementation, service restart, credential/configuration access, environment/port change, database reset, installation, deployment, commit or push is performed for recording. No secrets, private row values, full identities or machine-local paths are retained in this addition.

### Recording checks

- `npm run spec:check -- cabloy-mcp`: **exit 1**, 69 definitions inspected, with **25 missing-link findings in two unchanged historical owners**: `decisions/0008-mcp-limits-audit-telemetry-redaction.md` and `wbs-mcp-20-01-execution-dossier.md`. Findings concern old `vona/src/suite/cabloy-mcp/...` source paths and unavailable local phase-20 logs. Neither owner was changed by this archival increment; no historical-link repair or full-audit pass is claimed.
- `npm run spec:charts:check -- cabloy-mcp`: **exit 0**, existing English charts current at **1/13 verified**, with no chart edits or status promotion.
- Scoped `npm run evidence:check -- -- ...` over this record and `progress.md`: **exit 0**. This checks machine-local paths, not secret absence or client-evidence authenticity.
- Scoped `oxfmt --check`: **exit 0** for the matched progress file; this evidence record is formatter-ignored and was manually checked for Markdown and minimized sensitive content. Both added relative links and their heading fragments passed targeted checks. `git diff --check` passed.
- `npm run docs:build`: **exit 0**. The public documentation build does not render these suite-spec records and is not spec acceptance or runtime/client proof.

These documentary results do not independently authenticate the supplied report or close any full ATP. No runtime suite or further client/business call was run for archival.
