# Local stateless compatibility and AI-client proof boundary

## Authority and attribution

On 2026-10-22, after an actual Claude Code protocol rejection, the user explicitly approved local-only native stateless compatibility and its finite execution plan. The [accepted amendment](../decisions/0002-mcp-transport.md#accepted-local-stateless-client-compatibility-2026-10-22), [bounded contribution](../pdp-wbs.md#approved-local-compatibility-contribution-2026-10-22) and [proof procedure](../test-plan.md#local-stateless-compatibility-proof-2026-10-22) control this increment. `zhennann` remains accountable reviewer/evidence custodian.

Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, base `6d04bab6f046329a881cfc7b46d01b29d4412f6a`, plus attributable dirty/untracked source. Preserve the carried local-runtime/category/generated changes: the complete tree is not authored by this increment and the base alone is insufficient to reproduce it. Historical [category proof](./business-categories.md) retains its original hashes/results, not current transport compatibility proof.

**Current outcome:** local compatibility and parsing-isolation checks passed. The historical [Commerce-backed real Claude Code journey](#real-claude-code-business-proof-2026-10-23) retains its unknown server root exit. The separately approved [independent mcp-test real-client proof](#independent-mcp-test-real-client-proof-2026-10-23) now supplies connection, three sequential returned-ID calls, faithful Chinese output, client exit 0, reported cost US$0.02581, server graceful shutdown and `server_exit=0`. These are user-supplied runtime observations, not independently captured launch/configuration or cleanup attestations. Earlier pending statements remain historical; the new proof closes only the migrated local business-journey gap. Production OAuth/controller/modern-only requirements, blocked MCP parents, open full ATPs and verified **0/12** are unchanged.

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
