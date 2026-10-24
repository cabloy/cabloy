# A-MCP Test Strategy and Acceptance Plan

## Purpose and Authority

This plan defines verification strategy, executable acceptance scenarios, fixtures, evidence requirements, and release proof for the accepted overall `cabloy-mcp` remote access design. Initial scaffold/configuration and application integration now exist under separately approved bounded increments recorded in the [phase-20 index](./evidence/phase-20/index.md); endpoint readiness and ATP/runtime acceptance proof remain pending. It completes the traceability chain:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

The [PRD](./prd.md) owns product outcomes; the [SRS](./srs.md) owns technical contracts; the [PDP/WBS](./pdp-wbs.md) owns sequencing and completion checks. `ATP-MCP-*` declarations are scenarios, not evidence or status. Planning, static audits, and chart generation never prove runtime acceptance.

## Current bounded browser authorization verification contract (2026-10-24)

For the approved browser-to-MCP increment, [ADR 0010](./decisions/0010-mcp-browser-execution-profile.md) and the [current SRS contract](./srs.md#current-bounded-browser-authorization-contract-2026-10-24) supersede incompatible legacy setup/procedures below, including `ATP-MCP-AUTH-03`'s `a-auth` ownership, pre-registered/static-client assumptions, authored issuer/resource/instance map and unimplemented bridge/receipt/qualified-clock/fleet gates. Retain compatible OAuth, tenant, privacy, single-winner and no-refresh requirements; historical proof remains limited to its recorded revision.

The simplification needs focused checks, not a new test result asserted by this plan:

- Verify issuer **and** resource equal exact `${origin}/mcp`, derived from root backend `server.serve.protocol`/`host`, with canonical AS metadata `/.well-known/oauth-authorization-server/mcp`, unchanged PRM `/.well-known/oauth-protected-resource/mcp`, and endpoints `/mcp/auth`, `/mcp/token`, `/mcp/register`. Cover nonproduction requestless `http://localhost:<SERVER_LISTEN_PORT>` fallback and production public-serve-pair requirement; hostile Host/proxy values cannot mint authority. Validate Host and existing automatic routing in a fresh selector-free context, without an MCP registry.
- Verify bounded RFC 7591 DCR and `registration_endpoint` follow existing AS/MCP ingress availability without `registration.enabled`; retain body/redirect and rate limits and public/confidential `none`/`client_secret_basic` behavior. Keep exact redirects, PKCE S256, consent, account/identity checks, code replay rejection and real Bearer MCP calls unchanged.
- Verify module-default `allowLoopbackHttp: true` permits HTTP only for exact `localhost`, `127.0.0.1` or `[::1]`, rejects arbitrary HTTP/lookalikes, and supports explicit `false`.
- Run the connected managed browser flow under normal defaults, without special E2E backend configuration injection/helper. Do not reintroduce injected issuer/resources, a DCR switch or loopback opt-in to make it pass. Preserve existing SSR/login/consent/hydration/privacy coverage.
- Verify old origin-only issuer grants/codes/tokens fail exact comparison and need new authorization; do not relax matching, rewrite state or reset. Schema and `mcp-auth` `fileVersion: 1` are unchanged. Existing-database v1 non-replay limits remain.

These are prospective checks for the approved slice, not full ATP completion, production qualification or permission to run tests/reset in this documentation-only task.

## Scope, Quality Priorities, and Risk

Verification prioritizes:

1. MCP-profile access-token resource/expiry/scope validation, current token lookup, and local-subject mapping;
2. trusted endpoint-host to instance binding, forwarded-host behavior, and selector conflict rejection;
3. candidate-vs-enabled-vs-visible-vs-call-authorized tool separation;
4. OpenAPI/DTO schema fidelity, MCP exclusions, stable-name collision handling, and unsafe-shape rejection;
5. fixed executor dispatch with explicit `innerAccess: false`, normal guard/AOP execution, and no arbitrary route/header/state control;
6. fresh Passport/context isolation under concurrent different-subject and different-instance calls;
7. JSON result/error adaptation, timeout, idempotency, side-effect and transaction boundaries;
8. request/rate limits, redacted audit/telemetry, sensitive-data minimization, and disablement;
9. transport metadata/protocol behavior and absence of an implicit Zova/site dependency for the MCP resource endpoint; the separately selected AS Zova interaction needs its own browser proof.

The first increment does not test deferred multipart/binary/streaming adapters as positive features; it tests that they are rejected or remain disabled. Provider live credentials, real customer data, raw tokens, and secrets are never used in retained evidence.

## Verification Model

### Narrow-scope verification

Run the smallest module-local unit/integration tests that own the changed invariant. Vona scoped tests must own an `app.bean.executor.mockCtx(...)` boundary. Every intentionally competing operation uses a separate `mockCtx(...)`; runner concurrency is not contention proof. Test-owned persisted resources are deleted in `finally` with precise owned identities and reverse dependency order.

### Contract verification

After Vona controller/DTO/OpenAPI/MCP metadata changes, inspect emitted OpenAPI and catalog output before any consumer or protocol test. Generated artifacts are never hand-edited. The MCP resource endpoint has no Zova consumer; the selected AS authorization presentation requires the documented forward/reverse contract loop after its APIs and site/flavor are approved.

### Full closure verification

Release requires protocol, OAuth, instance, direct authorization, catalog, dispatch, concurrency, redaction, limit, disablement, type, lint, format, and applicable root tests, with exact revision/environment/procedure/result/redacted artifact evidence. A passing MCP protocol smoke test cannot substitute for direct business authorization or cross-instance proof.

## Test Levels and Ownership Locations

| Test level                               | Purpose                                                                                                                                    | Expected ownership                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Catalog/metadata unit tests              | OpenAPI projection, MCP metadata, exclusions, stable names, shape/risk classification                                                      | Proposed `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/` and metadata owner tests                           |
| OAuth/resource integration tests         | Token validation, resource metadata, scope, local subject mapping, key/error cases                                                         | Proposed `cabloy-mcp` tests plus approved OAuth integration owner                                                |
| Authorization-server integration tests   | Metadata, code/PKCE/pre-registered clients, resource-bound issuance, approved shared grant/token state, revocation and no-refresh behavior | Selected integrated `a-auth` logical AS (`zhennann` implementation/operations) under blocked WBS-MCP-20-04 scope |
| Instance/authorization integration tests | Host mapping, selector conflicts, RBAC/data scope, tenant isolation                                                                        | Proposed `cabloy-mcp` tests and existing instance/guard owners                                                   |
| Dispatch/context tests                   | Fixed executor route, `innerAccess: false`, headers/options, Passport isolation, concurrent calls                                          | Proposed `cabloy-mcp` tests and owning controller tests                                                          |
| Transaction/side-effect tests            | Domain transaction, timeout, retry/idempotency, irreversible operation policy                                                              | Owning domain module tests plus MCP adapter tests                                                                |
| Protocol tests                           | Selected-version Streamable HTTP, metadata/discovery, tools/list, tools/call, errors, limits                                               | Proposed `cabloy-mcp` protocol tests                                                                             |
| Operational tests                        | Rate limits, audit/telemetry, redaction, disablement, failure-closed behavior                                                              | Proposed `cabloy-mcp` operational tests and deployment checks                                                    |
| Root closure checks                      | Type, format, lint, tests, planning audit, chart freshness                                                                                 | Root scripts and bounded release dossier                                                                         |

No Zova browser/E2E suite is required for the MCP resource-server module itself. The selected integrated `a-auth` logical AS has a Zova-presented per-request authorization interaction; it needs separately approved site/admission and browser/session/CSRF contracts and AS-owned `ATP-MCP-AUTH-03` SSR/hydration and grant-flow proof, without assuming an independent site. The first profile uses explicit approval or denial per request, not remembered consent. Any later general operator/management UI needs its own scoped acceptance and site-specific proof.

## Fixtures, Cleanup, Privacy, and Data Minimization

### Minimum fixture set

Each applicable combination uses synthetic data and separate contexts for:

- instance A and instance B;
- subject A with allowed scope/RBAC/data ownership;
- subject B with different allowed scope and no ownership of A's resource;
- disabled/unmapped subject, ambiguous subject mapping, wrong-resource token, expired/inactive/revoked opaque token, token-lookup outage, wrong issuer, insufficient scope, and valid token;
- approved endpoint host, unknown host, trusted proxy host, conflicting query/header selector, and token-instance mismatch;
- one safe JSON read candidate, one JSON mutation candidate, one destructive or side-effecting GET candidate, one MCP-excluded candidate, one API-excluded candidate, one multipart/binary/streaming/redirect/unsupported-shape candidate, and a duplicate-name candidate;
- valid, malformed, unknown, extra-field, oversized, route-like, header-like, tenant-like, and state-like tool arguments;
- downstream success, validation rejection, authorization rejection, timeout, rate-limit, controller error, executor error, and injected post-commit failure cases.

Fixtures must be created through the owning module's managed seed path when they are shared durable fixtures; test-owned resources are isolated and deleted in `finally`. No fixture contains a real OAuth secret, customer identity, bearer token, password, or usable external link.

### Evidence record

Every accepted ATP retains:

- linked PRD, SRS, WBS, and ATP IDs;
- source revision/commit, runtime/database/environment, endpoint host and instance where relevant;
- exact command or request procedure, fixture identities in redacted form, and concurrency interleaving;
- pass/fail result and durable redacted log, response, trace, screenshot, CI job, or artifact location;
- proof that tokens, secrets, passwords, raw sensitive payloads, and complete private data were not retained;
- owner, reason, compensating control, and expiry for any temporary waiver.

A planned command or code reading is not a result. No `evidence/` directory or `EVD-*` record is created before actual execution.

## Acceptance Scenario Catalogue

### ATP-MCP-TRANSPORT-01: Streamable HTTP protocol and protected-resource discovery

Setup:

- Use a synthetic configured MCP endpoint and, for the metadata handoff, approved resource metadata/authorization-server discovery values; DEC-MCP-03/04 acceptance and their separate ATPs remain necessary for actual metadata/host authorization closure.
- Prepare valid 2026-07-28-profile `server/discover`, tools/list, and tools/call requests with required `_meta` and mirrored headers plus JSON and request-scoped SSE negotiation. Record the accepted design's SDK versions and explicit `legacy: 'reject'` setting once installed in a separately approved execution; do not use `initialize` as a valid-profile handshake.
- Prepare malformed/omitted `_meta` and headers, mismatches, unsupported versions, unknown RPC method and tool, malformed RPC request versus invalid tool input, header-safe/unsafe/sentinel-shaped `Mcp-Name`, unsupported content types, oversized bodies, POST `X-HTTP-Method-Override`, invalid Origin, GET/DELETE, and legacy session/resumption headers. Test missing authorization and unknown host only against approved DEC-MCP-03/04 policies, not as transport-only proof.

Procedure:

- Request protected-resource metadata and verify approved resource/discovery values only after their DEC-MCP-03/04 owners select them; do not treat this test alone as acceptance of their policy or instance binding.
- After separate design acceptance and execution approval, inspect the installed SDK versions, generated dependency owner and compilation; verify the handler factory creates a fresh server per request and `legacy: 'reject'` behavior under overlapping requests, including any legacy-classified notification response without dispatch.
- Over real HTTP, perform `server/discover`, tools/list, and a minimal tools/call with a valid synthetic token under the separately approved OAuth/host fixture; exercise JSON and request-scoped SSE, including a disconnect and work that settles later. Test request-scope disposal and native error/response writer behavior before and after headers, with no duplicate or framework-wrapped response.
- Repeat with missing or mismatched `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name`, decoded Base64/sentinel-shaped names, missing required `_meta` in a claimed modern request versus an unclassified legacy request, missing required client capability, unsupported version, unknown RPC method versus unknown tool versus malformed call versus invalid tool input versus tool-execution failure, invalid Origin, and oversized/unsupported representations. Submit POST with `X-HTTP-Method-Override: GET` and `DELETE` and confirm no method remapping or business dispatch; test GET/DELETE and ignored `Mcp-Session-Id`/`Last-Event-ID` without enabling legacy behavior. Test missing authorization/unknown host against separately approved DEC-MCP-03/04 decisions.

Expected result:

- Supported exchanges are protocol-compliant; malformed/missing mirrored headers yield HTTP `400` / JSON-RPC `-32020`, unsupported version `400` / `-32022`, missing required `_meta` on a modern-profile request `400` / `-32602`, missing required client capability `400` / `-32021`, and an unknown RPC method `404` / `-32601`. An unknown tool or malformed RPC call is a protocol error, while tool-input validation or execution failure after a valid call follows the tool-result `isError` contract. No invalid/method-overridden request dispatches a business controller.
- Modern-only mode rejects a well-formed `initialize` request as an unimplemented method, answers GET/DELETE with the chosen `405`, and ignores session/resumption headers without accepting them as authority. Legacy-classified notifications must not dispatch; record their actual response rather than assuming every legacy message is rejected with an error. An invalid present Origin yields `403` even when unauthenticated, without Vona rewriting it to `401`; bounded body handling remains effective when Vona's ordinary parser is bypassed.
- Native JSON/SSE/error responses are not enveloped or rewritten by Vona; disconnect signaling, actual work settlement, context disposal, and post-effect outcomes are observed separately rather than inferring rollback from a closed socket.
- The selected protocol's discovery response and, after separate DEC-MCP-03/04 approval, protected-resource metadata identify only approved resource/authorization information without secrets. Every protected request still authenticates; this scenario does not itself approve OAuth or host-to-instance policy.

Minimum proof:

- Retain accepted protocol revision and SDK/legacy-mode configuration fingerprint, source revision, environment, exact real-HTTP JSON/SSE, header, method-override, Origin, error and disconnect procedures with synthetic/redacted tokens, dispatch counter, status and JSON-RPC codes, context/work-settlement observations, and durable redacted artifact location. Document which metadata/host/auth decisions and ATPs are still separately open.

Traceability: `PRD-MCP-ACCESS-01`, `SRS-MCP-TRANSPORT-01`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-TRANSPORT-03`, `SRS-MCP-NFR-03`, `WBS-MCP-20-01`.

#### Local commerce verification supplement (2026-10-22)

This prospective supplemental procedure belongs to existing `ATP-MCP-TRANSPORT-01`, with partial `ATP-MCP-CONTRACT-01`, `ATP-MCP-CALL-01` and `ATP-MCP-CALL-03` coverage under the [existing WBS contribution](./pdp-wbs.md#local-commerce-verification-contribution-2026-10-22). [ADR 0002's accepted disposition](./decisions/0002-mcp-transport.md#accepted-local-commerce-verification-disposition-2026-10-22) records the exact bounded design/execution approval at clean `6d04bab6f046329a881cfc7b46d01b29d4412f6a`; `zhennann` is accountable reviewer and sanitized-evidence custodian. It adds no ATP definition and changes none of the full scenario's Setup, Procedure, Expected result, Minimum proof or Traceability obligations above. It is not production/OAuth/host-profile or full isolation proof; the historical synthetic fixture's no-business limit remains unchanged.

- **Setup:** create the approved root `mcp:commerce:local` command and same module-local runtime used by the focused HTTP tests before invoking them. Reuse only managed disposable test DB/Redis/runtime and ordinary seed preparation, fix instance `''`, disable the default listener before startup and assert no `app.server` before binding `127.0.0.1`. No `.env` reads/edits, ordinary dev database, manual reset, process killing or production registration. Keep the existing six business regressions.
- **Real HTTP:** prove modern `2026-07-28` discovery/listing of exactly `commerce_products_search` and `commerce_product_detail`, required `_meta`/mirrored headers, explicit legacy rejection/JSON-only responses and SDK wire `resultType` plus default `{ ttlMs: 0, cacheScope: 'private' }` for discovery/listing. Exercise real guarded public search → returned ID → detail with `innerAccess: false`; compare DTO projection, structured output and compatibility text. Cover invalid/control arguments and scoped absence. Group critical ingress/limit cases: deny unsafe traffic before context/dispatch, GET/DELETE 405, exact Host/Origin/target/direct peer/framing; ADR 0002's one-active/noqueue, headers/target/body/structure/output/receive/execution ceilings; bound complete output before release and reject unexpected streams. Observe disconnect/deadline/shutdown ownership through actual handler work, SDK close, executor continuation and disposal, with no early capacity release, false cancellation or false drain.
- **Approved targeted checks after source work:** scoped format/lint and `node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json`; managed root `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts`. If shared helper behavior changes, run its existing targeted qualification regression via a separately selected managed command, never raw test execution.
- **Usability and cleanup:** launch the actual documented command and use a separate real HTTP client for complete discover/list/search/detail requests. Use the bounded shorten-window option to prove TTL normal completion: stop admission, drain actual work, close app and allow managed cleanup. Document at-most-10-minute serving and Ctrl+C/termination as interruption that may retain claims/resources, not guaranteed successful cleanup. Do not claim Inspector compatibility unless a client supporting this modern profile actually passes. Build docs and check actual navigation/links; run the approved planning audit, applicable chart generation/freshness, scoped evidence checks and diff whitespace check separately from runtime acceptance.
- **Later minimum proof:** retain source hashes/revision, exact commands and producer/filter/sanitizer exit statuses, actual failures and attributable preparation drift, sanitized discover/list/search/detail projections, admission/dispatch/settlement assertions and truthful stop/cleanup outcome under the existing evidence convention. Exclude raw startup paths, private database identities and full data rows. No evidence/progress update is made by this documentary amendment. Success qualifies only the local verification entry; full ATP checks, dependencies, parent blocked statuses and verified count 0/12 remain unchanged.

#### Approved three-tool category proof supplement (2026-10-22)

The [later combined approval](./decisions/0002-mcp-transport.md#accepted-three-tool-category-extension-2026-10-22) follows delivered two-tool runtime; the preceding supplement and retained two-tool proof remain historical. This extends existing partial `ATP-MCP-TRANSPORT-01`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-03` procedure only, not full closure. Traceability: `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01`, `SRS-MCP-TRANSPORT-01`, `SRS-MCP-CATALOG-01`, `SRS-MCP-API-01`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `WBS-MCP-20-01`, `WBS-MCP-30-01`, `WBS-MCP-40-01`; [Historical/superseded Commerce proof](./evidence/business-categories.md#historical-disposition-2026-10-23) covered the former public Category action.

- **Setup/procedure:** extend existing `catalog.test.ts`, `businessTools.test.ts`, `commerceLocalHttp.test.ts`, retaining security regressions and managed isolated resources. Run `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/a-commerce/modules/commerce-catalog/test/catalog.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts`; no raw runner, `TEST_CONCURRENCY=false`, seed edits or manual reset. Cover exactly three tools, strict positive-integer pagination/defaults/cap/control denial, public DTO projection, empty category behavior and category → returned ID → exact-category search → returned ID → detail with structured/text equivalence.
- **Finite contract/usability checks:** scoped format/lint and affected Commerce/MCP native typechecks; after backend proof run `npm run contract:generate:isolated -- commerce-catalog`, inspect generated operation/fields, then `npm run build:zova:commerce && npm run deps:vona`. Update the existing guide with complete modern curl/jq requests and `MCP_URL='http://127.0.0.1:<printed-port>/mcp'` (copy the printed URL). Launch `npm run mcp:commerce:local -- --seconds 60` and use a separate-process curl/jq client with returned category/Product IDs; reject protocol/tool errors and observe normal TTL graceful shutdown and successful root exit. Run `npm run docs:build`, link/navigation checks, scoped suite audits, eligible chart refresh/check, sanitized evidence-path checks and `git diff --check` later; report legacy gaps separately, without widening scope.
- **Expected result/minimum proof:** exactly the approved three-tool public journey passes through the same runtime with unchanged ingress/limits/context/settlement/cleanup. Later retain revision/hashes, commands/exits/failures, minimized category/search/detail and cleanup observations, strip ANSI before path sanitation and manually review. Old two-tool fingerprints remain historical, not proof for the new tool. This amendment runs none of these checks and creates no evidence/progress; full ATPs stay open, parents blocked and verified 0/12.

#### Local stateless compatibility proof (2026-10-22)

The [accepted local-only compatibility amendment](./decisions/0002-mcp-transport.md#accepted-local-stateless-client-compatibility-2026-10-22) and [bounded WBS contribution](./pdp-wbs.md#approved-local-compatibility-contribution-2026-10-22) qualify only earlier local legacy-rejection/notification wording. Existing partial ATP associations and full production procedures remain unchanged; `zhennann` is reviewer/evidence custodian. This amendment records approval, not results.

- Retain existing modern discovery/list/schema/DTO/returned-ID/security/limit/drain regressions. Extend `commerceLocalHttp.test.ts` with native legacy `initialize` (`2025-11-25`) → genuinely id-less initialized notification (empty 202) → exactly-three-tool listing → category → returned Electronics ID → filtered search → returned Product ID → matching detail. Assert JSON-only output, no session header, safe headers/errors and structured/text equivalence without imposing modern-only `resultType` on legacy results. Cover strict/control arguments, credential/instance rejection, malformed initialized/other notifications and malformed modern claims without downgrade. One held legacy service regression must prove deadline response, retained capacity and close waiting for actual work, followed by successful settlement/shutdown rather than a hanging native JSON wait.
- Run existing MCP native typecheck, scoped format/lint and managed root `SERVER_LISTEN_DISABLE=true npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts src/suite/cabloy-mcp/modules/cabloy-mcp/test/commerceLocalHttp.test.ts`. Launch `npm run mcp:commerce:local -- --seconds 60`; separate-process HTTP client proves legacy handshake/list/returned-ID journey and retained modern discovery, then normal TTL/graceful app/root exit. Existing managed resources, read-only seeds and cleanup rules apply. No contract generation/frontend build/schema change is needed.
- Update existing guide, run docs build/link checks, MCP authority audit, eligible charts generate/check, scoped evidence-path/manual privacy review and whitespace checks. Retain observed failure, source hashes/dirty attribution, commands/exits and minimized outcomes in one nonempty evidence record; historical proof is not rewritten.
- Real Claude Code success additionally requires actual connection, the three ordered tool-use/result events with returned-ID equality, faithful SKU/price/availability explanation, budget/client outcome and normal server shutdown. Exit 0 alone or SDK/HTTP success is insufficient. Use independent-terminal handoff if nested/auth prerequisites prevent safe invocation; no auth/provider edits, guard bypass, persistent registration or permission bypass. Local implementation can complete with real AI proof explicitly pending. Parents remain blocked, full ATPs open, verified 0/12.

#### Independent mcp-test proof (2026-10-23)

The [accepted migration](./decisions/0002-mcp-transport.md#accepted-independent-mcp-test-migration-2026-10-23) defines this subsequent finite procedure under partial `ATP-MCP-TRANSPORT-01`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-03`, linked to the existing local WBS/PRD/SRS contribution. `zhennann` remains reviewer/evidence custodian. Historical Commerce and real-Claude proof is not transferred.

- Generate/register dev/test-only `mcp-test`, own immutable fixture/DTO/service/controller and move the existing factory/local runtime/business+HTTP tests. No tables/seed/fileVersion. Use actual scoped request contexts; nondefault instances see empty/absent fixture data, not a claim of ORM tenancy. Preserve existing public projection, filtering/paging/absence and strict-input/schema checks.
- Run managed root tests with `PROJECT_DISABLED_SUITES=a-commerce SERVER_LISTEN_DISABLE=true`: `src/suite/cabloy-mcp/modules/mcp-test/test/catalog.test.ts`, `businessTools.test.ts`, `localHttp.test.ts`. Assert core/new module present, Commerce modules and dependent `test-pay` absent. Retain modern/native legacy, protocol/query isolation, ingress/credential/selector/control rejection, bounded output, deadline/disconnect/actual-work settlement; replace Commerce prototype injection with the actual new service and restore in finally. Run directly affected core generic regressions, scoped native checks for both modules and style.
- Launch actual `npm run mcp:test:local -- --seconds 60`, with child preparation/runtime merging Commerce exclusion. A separate process using the installed native SDK must connect/list and complete the three-tool chain from returned IDs without sleeps/retries. Observe client/root exits, normal TTL, app graceful close and managed cleanup. Confirm old command aliases the same implementation. No paid client call, persistent registration or Commerce/Zova generation/build.
- Update the existing guide; run docs build/practical links, authority audit, eligible charts generation/freshness, evidence-path/manual privacy and whitespace checks. Retain actual revision/hashes, dirty attribution, commands/exits/failures, composition assertions and minimized results in one existing business evidence record, then index/progress/charts. No predeclared result, empty evidence, full ATP/production closure; blocked parents and verified 0/12 remain.

#### Local protocol parsing isolation proof (2026-10-23)

Under the [bounded approval](./decisions/0002-mcp-transport.md#accepted-local-protocol-parsing-isolation-2026-10-23), retain earlier compatibility checks and historical failures. `zhennann` remains reviewer/evidence custodian. Required supplemental proof:

- One shared managed `test-vona/test/utils/zodQueryScope.test.ts` proves default query behavior, checked native parsing including nested/lazy values, nested/error restoration and deterministic concurrent async isolation. Test canonical main first, mirror the four approved shared paths exactly, then include this regression with existing MCP business/HTTP tests. Use ordinary `mockCtx` where scoped state is involved; no global mutation or timing-based contention proof.
- Business tests call the real factory/handlers beneath an outer disabled-coercion scope and preserve DTO normalization/projection and guarded controller semantics. HTTP tests initialize with valid `roots: { listChanged: true }`, `sampling: {}`, `elicitation: {}`, preserve numeric ID 0, reject a malformed capability, and immediately send initialized acknowledgement and tools/list without snapshot polling, delays or retries. Retain both profiles' returned-ID business journey, strict argument/modern metadata/security/bounds/deadline/disconnect/actual-work drain checks.
- Run focused no-emit semantics for `zod-query`, `vona-core`, `test-vona` and MCP, scoped style, and root managed combined tests. In one `npm run mcp:commerce:local -- --seconds 60` window, an already-installed native SDK client in a separate process performs continuous connect/list and category → returned category ID → search → returned product ID → detail. No model call or new dependency. Observe native-client exit and normal TTL/graceful root exit. Optional GET 405 does not authorize streaming.
- If continuous sequencing actually exposes a capacity/response race, retain the failure and correct only local response/cleanup ordering; do not add a queue, early capacity release, test sleep or retry. Allow bounded in-scope repairs/reruns; stop on scope/dependency/safety expansion.
- Update existing sanitized evidence/index/progress and guide, run docs build/practical links and shell checks, authority audit, eligible chart generation/freshness, path/manual privacy and whitespace checks. Distinguish observed Claude failure from independently reproduced capability shape. Native SDK success is not real AI success: actual Claude connection, three ordered events, truthful shopping output and client/budget/server outcome remain separately pending. Parents blocked, full ATPs open, verified 0/12 unchanged.

#### Dev shared-listener proof (2026-10-23)

The [accepted dev amendment](./decisions/0002-mcp-transport.md#accepted-dev-shared-listener-amendment-2026-10-23) records `zhennann`'s approval at clean `47d41c84fe` and corrected optional-instance contract. Under [the existing WBS contribution](./pdp-wbs.md#approved-dev-shared-listener-contribution-2026-10-23), this is prospective partial `ATP-MCP-TRANSPORT-01`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-03` coverage, not a new ATP or production `ATP-MCP-INSTANCE-01` closure. Existing PRD/SRS traceability and `zhennann`'s reviewer/sanitized-evidence custody remain.

- **Same-listener procedure:** use managed isolated test resources with the real Vona listener and the identical system middleware registered by `mode: ['dev', 'test']`; no test-specific flag, global mode mutation, shared dev database/reset or port/configuration takeover. Exercise default URL resolution (`instanceName` absent → `undefined` passed to `newCtx`), explicit default selection and an actual foreign-instance context on that same listener. Prove exactly the existing three tools and default category → returned ID → search → returned ID → detail with structured/text equivalence; foreign lists are empty and detail absent, without default-data fallback. Compare ordinary non-MCP route behavior on the same listener to unchanged framework behavior. Prove the automatic entry is limited to dev plus managed-test qualification of the same middleware, never production, independently of the retained isolated test launcher.
- **Security/lifecycle regressions:** retain modern/native legacy parsing, strict arguments, safe bounded JSON, receive/execution limits and one-active/no-queue. Test allowed optional dev URL `instanceName` and default framework resolution, including the configured instance-header resolver when applicable; do not impose blanket instance-header rejection. Reject unknown query controls, malformed/duplicate selector forms, tool-supplied scope, credentials, forwarding, overrides, invalid Host/Origin and nonlocal socket peers before MCP dispatch. A held real service operation must show disconnect/deadline response does not release capacity/context early; app close stops new admission and waits through actual work, SDK close, executor continuation and disposal before reporting drain. Assert no per-request shared listener/app close, no dev TTL and no false successful drain. Restore injected behavior in `finally`; scoped/competing operations retain separate owned `mockCtx` boundaries.
- **Finite verification and later proof:** extend the smallest existing module/HTTP tests for same-listener behavior, run managed root focused tests and affected module native type/style checks; rerun existing local business/HTTP regressions and the actual `mcp:test:local -- --seconds 60` native-client returned-ID journey with normal TTL/app/root cleanup. Preserve alias behavior and the isolated launcher's fixed-default selector denial. Later retain actual commands/exits/failures, source attribution, minimized instance/admission/lifecycle observations and sanitized artifacts; static checks or historical launcher proof cannot stand in for new middleware runtime proof. Required docs/authority/privacy checks follow separately; this amendment runs none, updates no evidence/progress, and claims no AI-client success. Production dependencies/full ATPs remain open, parents blocked and verified 0/12.

#### Superseding shared-ingress proof amendment (2026-10-23)

The [later explicit correction](./decisions/0002-mcp-transport.md#accepted-shared-ingress-authority-simplification-2026-10-23) supersedes only middleware-mode and shared-locality assertions above. Qualify the same middleware under dev/test-only `mcp-test` module inclusion, with no middleware `mode` duplication. Shared `/mcp` must not deny solely for a nonlocal peer, nonlocal Host or nonmatching Origin; those inputs are not a local-authority allowlist. Retain fixed-action `innerAccess: false` guard assertions: the three fixture reads are public and anonymous, not proof of protected-action authentication. Add no credential forwarding, authentication, OAuth or CORS expectation.

Retain credential/cookie/forwarding, target/selector/framing/override negatives, strict protocol/body/output limits, one-active/no-queue, fresh instance resolution, returned-ID journey, ordinary-route passthrough and actual-work/app-close drain checks. Standalone `checkFixtureIngress` and launcher must still reject nonloopback/mismatched Host/Origin and selectors, keep fixed default scope, and preserve TTL/cleanup. Prior qualification remains historical and cannot prove changed ingress behavior. This documentary amendment executes no tests/startup, edits no evidence/progress and changes no parent/full-ATP status (blocked/open, verified 0/12).

### ATP-MCP-AUTH-01: OAuth resource validation and failure-closed behavior

Setup:

- Prepare synthetic MCP-profile opaque access-token lookup results for valid issuer/resource/subject/scope/instance, wrong issuer, wrong resource, expired/inactive/revoked state, missing subject, missing scope, ambiguous mapping, and lookup/introspection outage. If a JWT/JWKS alternative is separately selected, add its signed-token and key-rotation fixtures as an explicit branch rather than as the default profile.
- Configure protected-resource metadata with the canonical `resource` and at least one `authorization_servers` issuer identifier (not an authorization-server metadata URL), plus a local subject mapping for one instance.
- Prepare a synthetic credential distinguishable from an MCP access token for the negative resource-server case. The first profile issues no refresh tokens; AS no-refresh behavior belongs to `ATP-MCP-AUTH-03`, not this resource-server fixture.

Procedure:

- Call metadata, tools/list, and tools/call with each token state.
- Simulate token lookup/introspection unavailability, stale or ambiguous token state, and ambiguous or disabled local subject mapping. Send a synthetic refresh credential to the MCP resource endpoint as a negative test and confirm rejection; do not exercise AS issuance or refresh here. If JWT/JWKS is later selected, separately simulate a required JWKS refresh failure while a previously fetched key remains cached.

Expected result:

- Only the active MCP-profile access token whose current lookup/introspection state confirms the canonical resource, subject, scope, instance, expiry, and revocation status proceeds to the next policy stage; a client-supplied `resource` parameter alone is not proof of binding.
- Lookup/introspection outage, stale authorization state, and ambiguous grant state deny without using a stale cache or permitting controller dispatch. A refresh credential is rejected at the MCP resource endpoint. A client without a refresh token may use its valid access token until expiry and then needs reauthorization, not a resource-server refresh. The first profile has no AS refresh issuance; a later refresh profile and its AS-only rotation/reuse proof require a separate authority change.
- Missing, invalid, expired, inactive, revoked, or wrong-resource tokens yield bounded HTTP `401`; insufficient scope yields bounded HTTP `403` at the HTTP authorization boundary. Unavailable, ambiguous, or disabled states fail closed with a separately approved nondiagnostic mapping; none permits anonymous fallback, controller dispatch, or cross-instance probing. If a JWT/JWKS alternative is later approved, its required-refresh-failure behavior is verified in a separate branch.
- Client errors are bounded; protected telemetry records a redacted reason class.

Minimum proof:

- Retain token-fixture labels (not token values), issuer/resource configuration fingerprint, expected/observed result, dispatch counts, and redacted audit artifact.

Traceability: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-NFR-01`, `WBS-MCP-20-02`.

### ATP-MCP-AUTH-02: Authorization intersection and call-time recheck

Setup:

- Prepare two local subjects with different roles/data ownership and OAuth tokens with narrow/broad scopes.
- Prepare tools enabled by deployment policy, excluded by policy, visible only to one role, and requiring a scope/data owner.

Procedure:

- Compare tools/list for each subject/token combination.
- Invoke visible and hidden tools, change or revoke a policy/role between list and call, and submit arguments targeting an unowned resource.

Expected result:

- List results reflect the current intersection of scope, deployment policy, Passport/RBAC, data scope, and risk rules.
- Hidden/changed/disallowed calls fail at call time; list visibility is not a reusable authorization grant.
- No response reveals whether an unrelated subject or out-of-scope resource exists beyond the approved nondiagnostic policy.

Minimum proof:

- Retain policy fixture labels, subject/tool visibility matrix, call outcomes, resource-scope assertions, and redacted audit records.

Traceability: `PRD-MCP-ACCESS-02`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-AUTH-02`, `SRS-MCP-AUTH-03`, `WBS-MCP-30-02`, `WBS-MCP-40-01`.

### ATP-MCP-AUTH-03: Authorization-server issuance, grant, and token lifecycle (prospective; no runtime proof)

This is a prospective AS-owned acceptance scenario, not authorization to implement or operate an AS. DEC-MCP-03's bounded design is accepted; ADR 0009 selects the integrated `a-auth` logical AS with `zhennann` responsible for implementation and operations, one AS-owned database-backed authority with **code consumption/token activation in the same atomic commit** and Zova presentation of the AS-controlled per-request browser grant flow under DEC-MCP-09. The first AS implementation and verification target is multiple Vona workers on one host sharing persistent SQLite via `better-sqlite3` through Vona's existing primary datasource, not cross-host SQLite or replica support. If persistence resides in existing `a-auth`, keep `vonaModule.fileVersion: 1` and fold the schema into its version-1 creation path; no version-2 migration or automatic upgrade of already-versioned v1 databases is selected. Fresh-only installation scope/exclusions and secret-free confirmation requirements are separately accepted under ADR 0009; actual installation eligibility, deployment observations, migration implementation and any treatment outside that scope remain open. This design choice does not confirm an actual deployment, prove SQLite atomicity, select PostgreSQL/MySQL AS support, or presume an explicit multi-statement transaction by default; the Zova direction does not approve a site/flavor/admission, physical schema, server-verified session/CSRF control or SSR implementation. Run this ATP only after the exact physical storage/browser-interaction contract (including actual eligibility and migration implementation within the accepted fresh-only conditional existing-`a-auth` keep-v1 scope), bounded `WBS-MCP-20-04` execution dossier and safe verification path are separately approved. An isolated resource-server lookup fixture is not sufficient; a separately operated AS would need a new route decision and equivalent contract proof.

Setup:

- Confirm the test deployment has at least two Vona worker processes on the same host sharing the same persistent SQLite database via `better-sqlite3` through Vona's existing primary datasource, with the effective datasource confirmed for each AS-bound instance. Record only synthetic worker/storage labels and a safe configuration fingerprint without reading `.env*` contents into evidence. Approve connection ownership, contention/failure handling and the safe test launcher separately; no journal mode, busy timeout, pool size or automatic write retry is prescribed by this plan. For existing-`a-auth` persistence, use the selected keep-v1 creation path only within the accepted fresh-only scope after actual eligibility and execution/procedure approval; an already-recorded v1 installation does not upgrade automatically. Use excluded existing/partial states only as approved synthetic negative fixtures; separately approve partial-failure expectations and any recovery procedure before tests; no reset/recreation is implied. Configure synthetic issuer/client/resource/instance/subject labels under the selected `a-auth` logical AS, without retaining credentials or real endpoint/provider settings. Include pre-registered public and confidential client profiles; record Client ID Metadata Documents compatibility limits and do not assume Dynamic Client Registration support.
- The [installation scope and deployment-confirmation requirements](./wbs-mcp-20-04-as-contract-dossier.md#92-installation-applicability-accepted-bounded-design-only) were separately accepted for bounded design only on 2026-10-15; no actual installation or deployment observation is confirmed. After separate physical-contract and execution/procedure approval, concretize synthetic fixtures per physical target for fresh v1 creation, existing-v1 non-replay/denied AS activation when required objects are absent, missing history with existing objects, partial/unknown state and separately approved recovery. Distinguish shared schema history from per-instance initialization and routed physical targets; no absent-marker inference, automatic adoption, ledger repair, replay or reset. Minimum future proof must retain classification, exact contract revision, redacted rejection/activation assertions and recovery disposition, not raw schema/log/configuration dumps. The unfilled operator template is not evidence or deployment-inspection authorization; no new procedure ran.
- The [owner/representation/activation-check refinement, sections 9.5–9.8](./wbs-mcp-20-04-as-contract-dossier.md#95-owner-and-runtime-boundary-bounded-design-accepted) has separate bounded design acceptance only, including the logical lifecycle, layered responsibilities/timing and approved-fresh-install continuity rule. After separate mechanism, physical-contract and execution/procedure approval, add synthetic checks distinguishing approved fresh-creation continuity across restart from excluded arbitrary existing-v1 adoption, per-worker/per-effective-binding readiness from startup hints, installation compatibility from current-token validity, dynamic/routed-target mismatch, unknown provenance and checker outage. Assert no DDL/repair/replay/fallback, no credential issuance/acceptance while unconfirmed and no collateral change to ordinary login. The later four-row disposition below refines provenance/coherence/reuse at bounded mechanism level only; exact implementation, hooks, fixtures, launcher and public error mappings remain open. This bullet authorizes no new runtime procedure.
- The four [provenance/read-only-check mechanism rows, sections 9.9–9.12](./wbs-mcp-20-04-as-contract-dossier.md#99-installation-provenance-mechanism-bounded-design-accepted) were prepared at `e66171a243`, then separately accepted for bounded design only on 2026-10-15 under ADR 0009/SRS-MCP-AUTH-04. Earlier open mechanism gates are refined only to that extent; concrete implementation and procedure gates remain. Prospective coverage/minimization requirements are accepted, not a launcher, executable procedure or test result. After separate concrete mechanism implementation/physical-contract/execution/fixture/procedure approval, concretize their synthetic proof matrix: protected completed receipt/live generation/target binding; pending or corrupted evidence, arbitrary matching-v1 adoption and interrupted completion rejection; copied/restored/rebound authority and artifact mismatch; actual pinned connection, ambient snapshot, prebuilt/rerouted builder and reconnect failures; repeated checks without positive reuse; fleet stop/drain and activation-epoch separation. Prove each supported detection/control rather than inferring it from marker equality. No automatic completion reconstruction/repair/replay, credential release or token acceptance on unknown state; ordinary login remains unchanged. Exact receipt/marker integrity/storage/retention, physical identity, adapter/hooks/SQL, fleet enforcement, fixtures/launcher and public errors remain open. Retain only allowlisted revision, synthetic coverage/generation/epoch aliases, protected approval/receipt reference aliases, failure/interleaving labels, classifications, negative counts and combined durable assertions; no raw schema/SQL/paths/configuration/credentials. This setup is prospective, not a runnable or authorized new procedure.
- The [receipt/marker and physical-identity contract, sections 9.13–9.16](./wbs-mcp-20-04-as-contract-dossier.md#913-receipt-and-marker-representation-bounded-design-accepted), was separately accepted for bounded design only after preparation and the candidate report, under ADR 0009/SRS-MCP-AUTH-04 on 2026-10-15. The strict format/bounds, custody/lifecycle, publication-failure and qualified-identity requirements are accepted, not a parser, adapter, platform, runnable procedure or result. After separate remaining physical-contract/implementation/execution/fixture/procedure approval, add strict-format/duplicate-key/size/unknown-field negatives, marker cardinality/mismatch, wrong custody/indirection and worker publication denial, missing/withdrawn/replayed activation, each commit/postcheck/publication/durability/activation failure point, and actual-handle/path/alias/hardlink/symlink/namespace/private-copy/in-place-restore controls. Distinguish observable mismatch, enforced prevention and unsupported platform cases; filename/metadata/signature/generation equality is not clone or rollback proof. Verify SQLite required sidecar writes remain compatible with approved storage confinement, and no automatic reconstruction/adoption/retry/reset or uncertain-state issuance/acceptance occurs. Exact parser/DDL, OS/filesystem/driver identity, durability/confinement/fleet enforcement, retention/disposal and safe launcher remain gated. Retain only synthetic labels, classifications, negative counts, combined durable assertions and redacted revision/reference aliases, not actual receipts, paths/schema/SQL/configuration or credentials. No new procedure, evidence or deployment observation is authorized by this setup.
- The [aggregate/marker schema and conditional-transition contract, sections 9.17–9.20](./wbs-mcp-20-04-as-contract-dossier.md#917-aggregate-and-marker-physical-schema-bounded-design-accepted), was separately accepted for bounded design only after preparation at `20b6aeb8b4` with eight carried planning edits and the candidate report. The later independent four-row disposition is recorded in ADR 0009/SRS-MCP-AUTH-04 against clean `b0ff7ceab0` before planning edits. Physical storage/lifecycle/creation-adapter requirements and prospective proof obligations are accepted, not emitted DDL, source/native adapter/platform qualification, executable fixtures/procedures or results. After separate remaining dependency/implementation/execution/fixture/procedure approval, add synthetic physical-type/NULL/default/range/state-shape/immutable-field/index/singleton-marker checks, scoped absent-row creation collision/duplicate-reference denial, omitted-guard/forbidden-patch negatives, revision/clock/deadline boundaries, and complete approve/deny/cancel/redemption/revocation contention. Prove the direct adapter preserves every predicate and obtains exact statement-local affected count plus acknowledged owning commit; explicitly defeat ordinary Model cache preselection, returned-object/default and ambient-snapshot traps. Verify same-row consumption/activation, no losing-worker credential, no generic delete/prune, post-revocation fresh lookup, busy/binding failure, unknown commit and lost-response non-reissue. Cross-worker combined durable assertions remain required; no source/runtime/DDL/ATP is executed here. Retain only synthetic aliases/classifications/counts and redacted revisions, never actual rows/schema/SQL/bindings/receipts/credentials. Credential/browser/policy/clock/retention/platform and driver-result obligations remain separate, and all 11 observations stay Unconfirmed with 0/12 verified.
- The [locator/credential, verifier and custody contract, sections 9.21–9.24](./wbs-mcp-20-04-as-contract-dossier.md#921-locator-and-credential-wire-contract-bounded-design-accepted), was prepared on 2026-10-15 at `b0ff7ceab0` with eight carried planning edits, initially Proposed. After the candidate report, `zhennann` independently accepted all four section 9.24 rows for bounded design only on 2026-10-16, recorded under ADR 0009/SRS-MCP-AUTH-04 against clean `086811c5e5` before planning edits. Every dependency/platform/ambiguity restriction remains; prospective proof obligations are accepted, not fixtures/procedures/results. Only after separate remaining-contract/implementation/execution/fixture/procedure approval, concretize strict kind/version/71–115-byte grammar and canonical base64url43 negatives, transport duplicates/single decoding, independent CSPRNG/failure seams, seven-field length-prefixed binary SHA-256 domain/context substitution, stored-verifier bounds, scoped duplicate/collision denial and no global scan. Add cross-worker winner-only release, same-commit code-clear/token activation, no recovery/retry/reissue and raw-value/digest/frame leakage assertions with combined durable outcomes. No vector/credential/key is generated here; decision-binding/browser, policy/clock/TTL/retention/no-reuse/platform and protocol dependencies remain open. Retain only synthetic labels/classifications/counts and revision aliases, never wire credentials/preimages/verifiers/rows or HTTP/SQL dumps. This bullet authorizes no runtime action and supplies no evidence; all 11 observations remain Unconfirmed and verified count 0/12.
- The [trusted-time/absolute-deadline/TTL contract, sections 9.25–9.28](./wbs-mcp-20-04-as-contract-dossier.md#925-trusted-time-assurance-boundary-bounded-design-accepted), was prepared on 2026-10-16 at `086811c5e5` with eight carried planning edits after separate preparation authorization; initially Proposed. After the candidate report, `zhennann` explicitly agreed to independent acceptance of all four section 9.28 candidates. ADR 0009/SRS-MCP-AUTH-04 record this later bounded design acceptance on 2026-10-16 at the same `086811c5e5` with eight attributable carried planning edits from credential acceptance and time-candidate preparation, not a clean checkout. Retain every platform/parameter/continuity/dependency/ambiguity restriction; preparation/static checks were not acceptance. Prospective proof obligations are accepted for bounded design only, not fixtures/procedures/results. Only after separate remaining parameter/platform/contract/implementation/execution/fixture/procedure approval, specify synthetic interval/rounding/safe-arithmetic/overflow and deadline-equality/uncertainty-straddle negatives; distinct phase deadlines/no renewal/grace/prune; actual-effect/read versus queue/suspend timing and postcommit release/remaining-lifetime behavior; cross-worker nondecreasing time bounds, restart/reboot/continuity loss, forward/backward clock steps and permanent deadline denial. Refute process-local clamp, SQL/wall-clock/default, startup-health/receipt-equality and stale-read shortcuts; preserve single-winner/same-commit/no-recovery and independent browser/policy checks. No real host-clock change, provider configuration, caller-controlled production timestamp/TTL/fault hook, fixture/vector/procedure or runtime result is authorized. Retain only synthetic labels, contract revisions, boundary/failure classes and combined durable counts, never credentials/rows/host settings/SQL or HTTP dumps. Exact TTL/error/freshness/hold budgets, native clock/driver/fleet/continuity capabilities, safe launcher and operations procedures remain gated. All 11 observations remain Unconfirmed; no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified.

- The [browser decision-binding/CSRF custody and invalidation contract, sections 9.29–9.32](./wbs-mcp-20-04-as-contract-dossier.md#929-decision-binding-preimage-and-verifier-bounded-design-accepted), was prepared on 2026-10-16 at `086811c5e5` with eight attributable carried planning edits, not a clean checkout, after separate preparation authorization following the time-acceptance report. Initially Proposed, all four rows were later independently accepted for bounded design only on 2026-10-16 under ADR 0009/SRS-MCP-AUTH-04 after `zhennann` explicitly selected all four bounded acceptances. Agreement to undertake disposition was not itself an acceptance choice. Recorded at the same `086811c5e5` with eight attributable carried planning edits from credential/time preparation and acceptance and browser-candidate preparation, not a clean checkout, with every custody/bootstrap/first-binding/current-session/cross-worker synchronization/platform/parameter/dependency/ambiguity restriction. Prospective obligations are accepted, not fixtures/vectors/procedures/results; none is deferred or implementation-authorized. Only after separate remaining custody/identity/synchronization/parameter/platform/contract/implementation/execution/fixture/procedure approval, specify synthetic strict proof parsing/eight-LP-field SHA-256 substitution, immutable pending verifier/NULL subject, first-binding/login-CSRF/replay, holder without login/login without holder, current auth/session/activation/site, exact Origin/independent CSRF, native single-winner approve/deny/cancel and cross-tab negatives. Add neutral SSR/hydration/post-hydration-only summary, no persistence/dehydration/leakage, browser disk/session restore/BFCache and holder/bridge/key/cookie scope/deletion custody assertions; session-cookie flags/encryption are not custody proof. Force at least two workers across precheck/writer wait/effect/commit/release against logout/account switch/session withdrawal/account/site/client/redirect/resource/scope/policy changes, asserting combined durable ordering/winners and zero stale/loser release, including time/epoch loss and unknown commit/no recovery/reissue. No new session field/store/Redis authority, custody exception or implicit issued-token logout cascade. Retain only synthetic aliases/classes/counts and revision references, never secrets/digests/frames/JWT/cookies/envelopes/full claims/rows or HTTP/SQL dumps. Existing auth/CSRF/Origin primitives are not certified synchronization/enforcement. Accepted sections 9.2–9.28 unchanged, all 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified; no browser/provider/clock/database/runtime operation is authorized.

- The separately authorized [custody/bootstrap compatibility and first-binding options, sections 9.33–9.36](./wbs-mcp-20-04-as-contract-dossier.md#933-custody-compatibility-feasibility-preparation-only), are Proposed preparation only on 2026-10-16 at `086811c5e5` with eight attributable carried credential/time/browser planning edits, not a clean checkout. At preparation no option or amendment was accepted. The later explicit 2026-10-16 disposition at the same dirty revision with eight attributable carried planning edits including compatibility-options preparation recognizes the analysis, preserves strict custody, defers the recoverable-custody exception direction and authorizes only the next bounded bootstrap sequence/proof candidate preparation and existing identity-owner first-binding assessment. Neither bootstrap branch nor new authority/state/session mechanism is selected; no amendment is accepted. This increment records that disposition without performing the successor preparation. No procedure/fixture/vector is approved or executed. Future proof must follow the actually selected and independently accepted custody/sequence/identity contract, not test an assumed exception: distinguish the literal bootstrap cycle from an approved noncircular proof sequence; enforce protected proof issuance, login/holder mismatch denial, first-bridge replay and simultaneous different-identity binding rejection, and session reissue despite matching user/auth IDs. Qualify browser disk/session restore/BFCache and envelope/key recoverability against the accepted custody boundary. Preserve two-worker invalidation through effect/commit/release and all time/epoch/ambiguity/no-recovery obligations. A custody exception or stronger bridge alone cannot close synchronization. Existing contract/implementation/execution/fixture/procedure approvals remain required; retain only synthetic aliases/classes/counts/revision references, never raw secrets, digests/frames, JWT/cookies/envelopes/full claims, rows/settings or HTTP/SQL dumps. Accepted sections 9.2–9.32, 11 Unconfirmed observations, blocked AS/RS, prospective ATP and 0/12 verified are unchanged.

- The separately authorized [bootstrap candidates and identity-owner capability assessment, sections 9.37–9.40](./wbs-mcp-20-04-as-contract-dossier.md#937-bootstrap-candidate-preparation-boundary-proposed-only), are Proposed preparation only on 2026-10-16 at `086811c5e5` with eight attributable carried credential/time/browser and compatibility-options/disposition planning edits, not a clean checkout. No branch/amendment/authority/state/session mechanism or executable fixture/procedure/vector is selected/accepted. Future proof, only after the remaining contracts and implementation/fixture/procedure/execution approvals, must distinguish protected pre-bridge C issuance from a forbidden public summary and independent bootstrap proof from decision C; reject circular issuance, cookie-only/bearer-only/account-injection shortcuts, request/holder/session/operation substitutions and replay/conflicting first binding. Cover lost bridge response without reconstruction, identical user/auth IDs plus reused marker after session reissue, and two-worker invalidation across issuance/binding/waits/effect/commit/release with combined durable assertions and no stale release. Qualify strict browser/model/envelope/key/restore custody separately; the recoverable-custody exception direction stays deferred. Bounded owner source reading is not current-session/first-binding/synchronization qualification or runtime ATP. Retain only synthetic aliases/classes/counts/revision references, never proofs/secrets/digests/frames/JWT/cookies/envelopes/full claims/rows/settings/HTTP or SQL dumps. Accepted sections 9.2–9.32, all 11 Unconfirmed observations, no qualified installation, blocked AS/RS, prospective ATP and 0/12 verified remain unchanged; no procedure is run or evidence created.

- The separately authorized [identity authority/first-binding/synchronization options preparation, sections 9.41–9.44](./wbs-mcp-20-04-as-contract-dossier.md#941-identity-authority-options-preparation-boundary-proposed-only), starts at clean `a8cb51711b` on 2026-10-16 and remains Proposed under ADR 0009/SRS-MCP-AUTH-04. No option, bootstrap branch, exact amendment or new state/coordinator is accepted; no executable fixture/procedure is approved. Future proof, only after independent remaining-contract/implementation/fixture/procedure/execution approval, must cover intended-browser proof-root substitution, same IDs/new session incarnation, simultaneous conflicting first binders and lost binding response without recovery; every covered lifecycle writer, including non-AS paths, before effect/during owning commit/between commit and release; new-admission stop and existing-holder drain/fencing, worker/coordinator loss, stale lease holder, unknown acknowledgment and restart no-reuse; aggregate-to-adjunct mismatch/duplicate/unavailable authority; and release-boundary loss without reissue. Assert cross-worker combined durable outcomes and zero stale server release, distinguishing a defined enforceable server release boundary from later browser receipt. SQL commit, response enqueue or socket completion alone must not be relabeled browser-delivery proof. Demonstrate that no bypassing identity/policy writer, positive cached authority, event-only invalidation or unqualified coordinator can admit a request. Strict custody/browser restore qualification remains independent; no raw browser proof or recoverable envelope persistence is implied by noncredential metadata. Retain only synthetic aliases/classes/counts, contract revisions and ordering assertions, never actual session references, proofs/secrets/digests/frames/JWT/cookies/envelopes/full claims/rows/settings or HTTP/SQL dumps. Accepted sections 9.2–9.32, formal ATP/Traceability and all statuses stay unchanged; all 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified. No runtime procedure or evidence is produced here.

- The later [explicit owner-first limited disposition](./decisions/0009-mcp-as-state-boundary.md#explicit-owner-first-limited-disposition-2026-10-16-further-preparation-only) on 2026-10-16 at `a8cb51711b` with eight attributable carried options-preparation planning edits recognizes bounded analysis and authorizes only future option 1 owner-responsibility/writer-coverage/failure-ordering preparation, with option 2 comparator and option 3 unselected fallback. It is not mechanism, Candidate A/B, exact state/schema/version/primitive/release-amendment acceptance or implementation/fixture/procedure/execution approval. The successor design is not performed here. The prospective proof implications above remain conditional, not executable fixtures or observed results; direction preference qualifies no current identity capability or installation. Strict custody/deferred exception, accepted sections 9.2–9.32, formal ATP fields/Traceability and every status remain unchanged: 11 Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective, 0/12 verified. No runtime/root-test/ATP procedure or evidence is created or run.

- The separately instructed [owner-first responsibility/coverage/failure-ordering preparation, sections 9.45–9.48](./wbs-mcp-20-04-as-contract-dossier.md#945-owner-first-preparation-boundary-proposed-only), is Proposed only on 2026-10-16 at `a8cb51711b` with eight attributable carried options/disposition planning edits. It prepares option 1 with option 2 comparator, not exact mechanism, bootstrap-branch, amendment, implementation or fixture/procedure approval. Future independently approved proof must connect every covered originating writer to admission closure, effective mutation/owning commit, AS in-flight effect/commit disposition, protected release and truthful acknowledgment, with two-worker combined durable assertions. Distinguish observed paths from unclosed direct Model/bulk/Admin/background/policy coverage; valid release before withdrawal from forbidden stale release; known failure/rollback from unknown domain commit; AS/binding acknowledgment loss from replay-safe recovery; and pause/restart/deletion from qualified no-reuse. SQL/Redis operations, events, final rereads and socket completion alone prove neither atomic cross-owner ordering nor browser receipt. Option 2 adds coherence checks without removing upstream participation. Exact release/acknowledgment and custody/continuity/platform gates remain independent. Retain only synthetic aliases/classes/counts/revisions/ordering assertions, never actual session references, proofs/secrets/digests/frames/JWT/cookies/envelopes/full claims/rows/settings or HTTP/SQL dumps. No executable fixture/vector/procedure, runtime/root-test/ATP or evidence is produced. Formal ATP/Traceability, accepted sections 9.2–9.32, all 11 Unconfirmed observations, no qualified installation, blocked AS/RS, prospective ATP and 0/12 verified remain unchanged.

- The later [limited review disposition](./decisions/0009-mcp-as-state-boundary.md#later-limited-review-disposition-2026-10-16-coverage-preparation-only) recognizes bounded analysis and authorizes only future writer-coverage closure/boundary-contract preparation, not exact mechanism/amendment, Candidate A/B, implementation or fixture/procedure/execution approval. The scoped no-high-confidence-defect review is not runtime or complete-coverage proof. The future documentary mapping must expose each writer's conflict scope, admission closure, effective mutation/owning commit, AS in-flight disposition, protected release and truthful acknowledgment/failure; excluded paths require enforceable inability to undermine supported contexts. No successor preparation or executable proof is performed here. Formal ATP/Traceability and accepted sections 9.2–9.32 remain unchanged; all 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective, 0/12 verified. No runtime/root-test/ATP procedure or evidence is created or run.

- The separately instructed [sections 9.49–9.52 writer coverage/boundary record](./wbs-mcp-20-04-as-contract-dossier.md#949-writer-coverage-record-boundary-proposed-only) is Proposed preparation only, not coverage closure, exact amendment or fixture/procedure/execution approval. Future independently approved proof must connect each included writer/caller and enforced exclusion to dependency scope, admission closure, actual owning commit, AS in-flight effect/commit, protected release and truthful acknowledgment/failure. Include ambient outer commit/rollback, ordinary password finalizers versus commit callbacks, callback failure after durable commit, independent Redis effects, multi-account migration/shared-policy/instance fan-out, concurrent creators/withdrawers, conditional background disposal and stale paused actors. Absence of a discovered production Admin caller proves neither exclusion nor coverage. Assert combined two-worker durable outcomes and no forbidden output; server completion is not browser receipt. Only synthetic aliases/classes/counts/revisions/ordering assertions may be retained, not actual sessions/proofs/secrets/digests/frames/JWT/cookies/envelopes/claims/rows/settings or HTTP/SQL dumps. Formal ATP/Traceability, accepted sections 9.2–9.32 and all qualification/execution gates remain unchanged; 11 Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective, 0/12 verified. No executable fixture/vector/procedure or runtime/root-test/ATP/evidence is created or run.

- Prepare approved authorization-server metadata/discovery, redirect URI and client-authentication policy, authorization-code + PKCE S256 fixtures, the selected Zova-presented AS interaction with a separately approved site/flavor/admission, server-verifiable identity/session or bridge, request-bound CSRF, SSR/hydration privacy, pre-instance AS admission and new explicit authorization/grant interaction per request, two distinct canonical resources/instances and scopes, and current token/grant-state lookup for the resource server. Do not assume existing Cabloy login JWTs, Redis session markers, provider records or local Passport refresh satisfy these fixtures.
- Prepare the accepted no-refresh first profile: access expiry and reauthorization, unsupported refresh requests/metadata, and multi-worker shared-state outage and revocation fixtures. No refresh rotation, family state, or remembered consent is in scope; a later refresh profile needs a separate authority change and ATP amendment.

Procedure:

- Inspect issuer discovery and advertised endpoints, grant types, pre-registration and PKCE `S256` capabilities. Exercise pre-registered-client compatibility, authorization-time redirect/client authentication and a new explicit user/grant authorization interaction per request; reject unregistered/incompatible clients, missing/invalid PKCE, absent/duplicate `resource`, unauthorized user grants, redirect mismatch (including protocol-relative `//host` and duplicate parameters) and authorization-code reuse. Under the selected Zova presentation, verify no implicit AS authentication from a frontend cookie/flag, fixed internal browser-bound login continuation, protected display escaping, login/decision CSRF, explicit denial, early instance admission across all AS paths, and no-store/referrer/framing protections on private pages, APIs, local errors and redirects as well as success. Verify the chosen site admits the intended users without a role workaround; SSR server HTML and hydration-time initial render must agree, and sensitive pending/code data must not leak into hydration or persistent query state. Prove that a decision POST navigates only to the prevalidated, server-bound redirect URI rather than relying on an AJAX-followed redirect; a generic route/middleware-only check is insufficient. Verify that OAuth client `state` (when supplied), AS pending correlation, provider-login state and approval-form CSRF are distinct; client `state` belongs only to the authorization response, not token redemption. OAuth 2.1 draft-13 §10.2 removes token-request `redirect_uri`; for a separately supported OAuth 2.0 branch, when the authorization request supplied it, RFC 6749 §4.1.3 requires the identical value at token exchange. Verify the selected branch, not merely a comparison when optionally supplied. If RFC 9207 authorization-response `iss` is selected, verify it is present on every redirectable success and error, advertised, and identical to the metadata issuer; invalid client/redirect errors never redirect.
- Request the canonical `resource` during authorization and token exchange, then attempt substitution of another resource, client, subject, instance or broader scope when redeeming the code. Exercise duplicate approve/deny/cancel/expiry interleavings and concurrent code redemption under the selected single AS database-backed authority, including committed-but-lost response; at most one code per pending request and one active token per redeemed code result. Prove code consumption and resulting token activation share the **same atomic commit**, whether implemented as one proven conditional mutation or an appropriate transaction for multiple writes; show that a failed activation cannot burn a code in an unapproved split phase. Prove conditional-transition affected-row handling, creation-time uniqueness/ambiguous digest denial and redemption/revocation ordering on the confirmed same-host shared SQLite/`better-sqlite3` primary-datasource deployment. Deliberately launch competing approvals and redemptions across at least two worker processes, each operation owning a separate Vona `mockCtx(...)` boundary where scoped test state is used; assert the combined durable outcome, not runner parallelism. Verify connection contention, fail-closed busy/unavailable/unknown-commit outcomes and no unsafe replay, under the separately approved connection policy. For existing-`a-auth` keep-v1 persistence, verify the approved fresh/version-1 creation path, explicitly demonstrate that already-recorded v1 databases are not automatically upgraded, and exercise approved partial-failure/recovery behavior. Do not report an existing-install upgrade as supported without a separate disposition. A test on another dialect is not equivalent proof or AS support. Verify that issued MCP-only opaque access tokens have current issuer/profile/grant/token records retrievable by the protected resource, and that revoked/expired/ambiguous/outage states cannot be accepted as current. Separate worker-process execution is mandatory for the selected topology; single-process competing contexts alone cannot close this proof. After worker A acknowledges revocation, prove every lookup begun on worker B fails without an older ambient snapshot, positive cache or replica fallback; do not treat a valid Redis session marker or ordinary signed JWT as an MCP token record.
- Confirm the first-profile AS neither advertises nor issues refresh capability and requires a new authorization request after access expiry; reject unsupported refresh grant requests. Verify current grant/token lookup, revocation and fail-closed multi-worker outage behavior under the separately approved shared-state design. `ATP-MCP-AUTH-01` separately proves the MCP resource endpoint rejects non-access credentials.

Expected result:

- Metadata and actual behavior agree for the pre-registered public/confidential clients and no-refresh first profile. Only the authorized user/client/code/PKCE and explicitly approved canonical resource/scope combination produces a current MCP-profile access-token record. Duplicate approval, denial/cancellation, code replay, substitution, invalid client, revoked grant, ambiguous state or unavailable token service never yields a second resource-server-valid token or escalates local authority; an uncertain lost response does not reissue the same code's token.
- No refresh grant or `offline_access` resource scope is advertised for the first profile; access expiry requires reauthorization, with no remembered-consent shortcut. Browser denial/cancellation, CSRF rejection, account switching or cross-tab conflicts issue no code or token; failures do not expose credentials, token-state internals or subject profiles. This scenario does not independently prove host binding, Passport mapping or guarded tool authorization.

Minimum proof:

- Retain `zhennann`'s AS implementation/operations ownership, separate execution/storage/interaction approvals and source revision, synthetic environment/resource/instance/client labels, configuration and metadata fingerprints, exact authorization/token/lookup procedures and interleavings, redacted combined durable grant/token-state outcomes, distinct synthetic worker-process labels, shared-storage fingerprint, connection/contention/failure outcomes, acknowledged-revocation-to-later-lookup ordering, approved installation scope and keep-v1 non-upgrade/recovery results, explicit per-request grant-interaction results, negative issuance counts, observed no-refresh behavior, and a durable redacted artifact location. Never retain raw codes, access/refresh tokens, cookies, signed callback state, client secrets, full claims or private subject data. The selected Zova authorization presentation needs the separately approved site/flavor's real-browser SSR/hydration and admission proof under this AS ATP; no general management UI is implied.

Traceability: `PRD-MCP-IDENTITY-01`, `SRS-MCP-AUTH-04`, `SRS-MCP-NFR-01`, `WBS-MCP-20-04`.

### ATP-MCP-INSTANCE-01: Host binding and cross-instance isolation

Setup:

- Configure synthetic canonical HTTPS endpoints and distinct resources for instances A and B, plus an unknown host, malformed/duplicate authority, unexpected port, direct-backend and trusted/untrusted forwarded-host/proto cases, and query/header selectors that agree or conflict with the endpoint.
- Prepare same-subject tokens authorized only for A, only for B, and with mismatched/absent verified instance claims; configure metadata routing/cache cases for both endpoint hosts.

Procedure:

- Exercise real HTTP metadata, tools/list, and tools/call against each host/selector/token combination, including the instance-initialization order, missing/disabled-instance rejection and cached-name behavior; compare ordinary non-MCP API routing before and after. The inner executor's instance lookup/readiness is not a substitute for the HTTP `initInstance()` admission check.
- Attempt to use an `iid`-like argument, host header, forwarded host/protocol, empty/default or duplicate query selector, or instance header to switch from A to B. Simulate a reverse-proxy cache hit for the wrong host's metadata.

Expected result:

- Only the approved host/resource/token/instance combination proceeds; each metadata response names only the configured resource and issuer for that host.
- Unknown hosts, untrusted proxy values, token-instance mismatches, and selectors fail under the accepted reject/ignore policy without default-instance fallback, wrong-instance metadata, unintended instance initialization, or controller dispatch. ADR 0004 proposes rejecting all MCP query/header instance selectors; accepting this behavior still requires DEC-MCP-04 approval.
- Business queries never use a caller-supplied instance field as authorization, and ordinary non-MCP routing remains unchanged.

Minimum proof:

- Retain synthetic host/resource/instance labels, proxy-ingress trust configuration fingerprint (without sensitive network settings), exact redacted HTTP requests and responses, expected/observed outcomes, metadata cache behavior, instance initialization/dispatch counters, and redacted artifacts. Do not mutate global `app.proxy` or request-origin settings in unit tests; use explicit `req` fixtures and environment-specific real HTTP tests.

Traceability: `PRD-MCP-IDENTITY-02`, `SRS-MCP-INSTANCE-01`, `SRS-MCP-INSTANCE-02`, `SRS-MCP-NFR-01`, `WBS-MCP-20-03`.

### ATP-MCP-CONTRACT-01: DTO/OpenAPI schema projection and freshness

Setup:

- Prepare an observed or execution-created enabled controller DTO/OpenAPI operation with representative path/query/body/response schema, one excluded/disabled router action, a referenced schema, and a distinct runtime-serialization or response-envelope case.
- Generate OpenAPI and the proposed MCP candidate/registry output from the same source revision and approved configuration fingerprint, with a second worker snapshot if multi-process serving is selected.

Procedure:

- Compare the declared MCP input/output schema, normalized references, actual enabled router identity, fixed controller/action/method/path mapping, and runtime response shape with emitted OpenAPI/DTO metadata.
- Change a source DTO/operation metadata field in a controlled revision, regenerate, and inspect OpenAPI-cache, HMR/restart, registry snapshot and second-worker freshness/drift behavior.
- Attempt to invoke an orphaned, excluded, disabled, stale, ambiguous, or wrong-worker registry entry; separately change role/policy after listing and try to call the formerly visible name.

Expected result:

- The candidate reflects approved DTO/OpenAPI truth through a deterministic transformation; no hand-edited generated consumer is required. An emitted single-action schema alone cannot admit a disabled or API-excluded router action.
- Drift, missing ownership, unsupported references/extensions, schema/serialization disagreement, worker mismatch, or stale entries fail the catalog check or prevent dispatch.
- Runtime does not silently retain an obsolete schema/route; revoking policy/role after list prevents subsequent call even when the structural snapshot remains valid.

Minimum proof:

- Retain source revision, effective route identity and generated schema diff, catalog/worker revision fingerprints, cache/rebuild procedure, negative dispatch counts, policy-revocation result, and redacted artifact path.

Traceability: `PRD-MCP-CONTRACT-01`, `SRS-MCP-CATALOG-01`, `SRS-MCP-API-01`, `SRS-MCP-API-02`, `WBS-MCP-30-01`.

### ATP-MCP-CONTRACT-02: MCP exclusion, metadata, and stable-name collisions

Setup:

- Prepare operations that are API-excluded (controller and action), MCP-excluded only, explicitly named, unnamed/unreviewed, duplicate-named, and annotated with risk/confirmation/output-adapter metadata. Include a refactor/rename case, an alternate locale, a controller/action metadata conflict, and a deployment-disabled entry.

Procedure:

- Build the catalog and inspect registered route, emitted operation, candidate, eligible, deployment-enabled, subject-visible, and call-authorized states separately.
- Change MCP metadata while leaving OpenAPI exposure intact; introduce a stable-name collision, a bean/action rename with an unchanged public tool name, an invalid schema reference, a metadata inheritance conflict, a locale change, and a disabled deployment policy.
- List tools under two subjects and instances, then change policy/role and retry a paginated cursor and `tools/call`; inspect the selected MCP revision's completed list fields, private caching rules, and bounded error classes.

Expected result:

- API-excluded operations never reappear in MCP; MCP-only exclusion hides an otherwise OpenAPI-visible operation, while ordinary OpenAPI/API behavior remains unchanged.
- An unannotated or unreviewed operation is not enabled; presentation text and risk hints are preserved only as reviewed metadata, not interpreted as authorization.
- A stable reviewed public name survives a checked internal refactor, and locale changes affect presentation only. Duplicate names, invalid metadata conflicts, and unsupported schemas fail deterministically; no nondeterministic winner is callable.
- A private, subject-filtered list (or its cursor/cache entry) never exposes another subject or instance's tools and cannot authorize a call after revocation; required list response fields match the approved protocol revision.

Minimum proof:

- Retain metadata/manifest fixture and source revision, catalog state and stable-name tables, collision/conflict diagnostics, locale/policy changes, redacted list/cache/call outcomes, and generated output.

Traceability: `PRD-MCP-CONTRACT-02`, `SRS-MCP-CATALOG-02`, `SRS-MCP-CATALOG-04`, `SRS-MCP-API-02`, `WBS-MCP-30-01`.

### ATP-MCP-CONTRACT-03: Unsafe shape and side-effect classification

Setup:

- Prepare JSON read/mutation operations (including reversible and confirmation-required mutations), a side-effecting GET, multipart/raw-body, binary, redirect, streaming, unsupported 201/202/204 status or envelope, arbitrary-URL/callback, and unclassified destructive operation.
- For each candidate, define a synthetic domain-owner review of route, request/response fields, guards/row scope, business and external effects, idempotency, reversibility, and proposed OAuth scope/deployment policy. Leave at least one candidate without review and one with misleading read-only metadata.

Procedure:

- Run candidate eligibility/classification and inspect `tools/list` under default policy and explicitly approved policy, with subject/instance/scope/role variants; change role/policy and try the same tool with owned and unowned row identifiers.
- Attempt calls for unsupported/unclassified/confirmation-required operations using a forged `confirm: true` argument or tool annotation; compare an individually reviewed JSON mutation that requires no per-call confirmation. Do not execute a destructive call just to classify or preview it.
- Check the runtime result of a supported 200-status action and the proposed output allowlist against OpenAPI/DTO; verify that source changes or unreviewed external effects invalidate prior risk approval.

Expected result:

- JSON-compatible, explicitly classified operations may become candidates, but only domain/operator-reviewed and deployment-approved read or bounded reversible operations may enter an enabled set; this plan itself does not approve one. Unsafe/unclassified/destructive/open-world shapes and misleading hints cannot enable or appear as safe reads; GET side effects are mutations.
- Confirmation-required operations remain disabled without an approved, server-verifiable, subject/client/instance/tool/arguments-bound and replay-safe grant; caller booleans, hints, a prior list, or optional elicitation alone do not grant one. Explicitly reviewed low-risk mutations without a per-call-confirmation requirement still face normal scope, RBAC, row scope, and audit checks.
- Excluded operations cannot be reached through a guessed tool name or route-like arguments, and neither list visibility nor broad scopes disclose an unrelated row. Unsupported executor statuses or unsafe result fields never fall back to raw data.

Minimum proof:

- Retain the per-operation review/classification and field-policy matrix, synthetic allowlist and configuration fingerprints, scope/role/row visibility and call outcomes, negative dispatch counters, and redacted diagnostics.

Traceability: `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-CATALOG-03`, `WBS-MCP-30-02`.

### ATP-MCP-CALL-01: Valid JSON tool call and result adaptation

Setup:

- Use one approved fixed registry entry backed by a synthetic 200-status controller operation with declared path/query/body mapping and JSON result; include an OpenAPI 200 envelope, an unwrapped executor result, a declared-field projection with an extra sensitive field, and optional `outputSchema`.
- Prepare valid and schema-invalid arguments, including unknown, nested override, route/host/tenant-like, and boundary values. Include approved object/array/scalar/null outputs and an unsupported status, non-finite number, oversized result, and output-schema mismatch.

Procedure:

- Call the tool with valid arguments, then malformed/unknown/oversized/extra arguments; verify that Vona raw-body parser limits are not incorrectly credited for a pre-populated executor body.
- Verify the controller receives only the declared mapped fields and inspect the actual unwrapped 200 value. Compare the OpenAPI/DTO response with the runtime result and the MCP-specific field allowlist after any Vona serializer.
- Inspect `structuredContent` and any compatibility JSON text block, then inject an extra secret field or result-shape mismatch after a synthetic mutation and check both external result and protected outcome classification.

Expected result:

- Valid input reaches the fixed operation and returns only the reviewed, bounded JSON value; any published output schema matches `structuredContent` for objects, arrays, scalars, or null as individually approved. Text content, if supplied, derives from the same filtered value.
- Invalid input is rejected before business dispatch; unknown/dangerous fields cannot alter route or state. DTO metadata and Vona serialization do not substitute for the MCP result allowlist.
- An unsupported status, undeclared sensitive field, unsafe value, or schema mismatch does not leak through a raw-result or text fallback. A post-execution filtering failure does not claim the domain mutation was rolled back or auto-retry it.

Minimum proof:

- Retain synthetic request/result and field-projection matrix, mapping and route validation assertions, status/dispatch and side-effect counters, structured/text/schema comparisons, protected outcome classification, and redacted logs.

Traceability: `PRD-MCP-ACCESS-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `SRS-MCP-TRANSPORT-03`, `WBS-MCP-40-01`.

### ATP-MCP-CALL-02: Guarded fixed dispatch and executor-option rejection

Setup:

- Use an operation with an observable existing controller guard/RBAC requirement and a fixed registry entry.
- Attempt arguments or protocol fields representing method, URL, host, Authorization, cookies, forwarded headers, instance, `innerAccess`, onions, `authToken`, or arbitrary state.

Procedure:

- Call as an authorized subject and an unauthorized subject.
- Repeat with every forged execution-control input, including a query token key, and inspect the **inner action** invocation options and guard behavior. Verify the exact registered route, guard/AOP chain and action-context RBAC decision; separately check that MCP admission enforces enabled-instance and body-size/security controls not rerun by router-only dispatch.

Expected result:

- The adapter invokes the known method/path with `innerAccess: false` on the action, not just an outer context; normal route guard/AOP authorization remains effective with a fresh local mapped Passport.
- Caller-controlled execution options are rejected before dispatch and never reach the executor; token-in-query, inherited HTTP Passport, and `extraData.state` cannot substitute another principal.
- Unauthorized calls fail without a trusted inner-access bypass; router-only tests are not counted as real HTTP admission proof.

Minimum proof:

- Retain redacted executor-option capture, guard invocation/result, route identity, matched instance and Passport labels, query-token denial, caller input class, admission control coverage, and audit artifact.

Traceability: `PRD-MCP-SAFETY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-03`, `WBS-MCP-40-01`.

### ATP-MCP-CALL-03: Concurrent context, Passport, and side-effect isolation

Setup:

- Prepare subjects A/B and instances A/B with distinct visible resources, fixed tools, separate `mockCtx(...)` contexts, and a transaction/side-effect fixture.
- Include interleavings where one request is authenticated or reaches a guard while the other begins dispatch. Create shared setup separately, then launch each contender inside its own **top-level** `mockCtx(...)` boundary; do not nest competitors inside one parent transaction.

Procedure:

- Launch explicitly competing calls with different subjects/instances and controlled barriers, and verify the effective instance, Passport, action-context RBAC decision and datasource/transaction ownership for each.
- Inject downstream validation, a response lost after commit, a post-commit success-callback rejection, a context-completion failure, result-filter failure and non-idempotent side-effect failure where the owning domain supports them; separately test deadline/disconnect with a real HTTP transport fixture. Attempt a duplicate client submission after an uncertain result only for a reviewed domain-safe test operation.
- Inspect Passport/state/header identity and combined durable outcome after all calls settle; separately compare execution outcome, result delivery, redacted audit class and any permitted domain reconciliation. Delete precise test-owned persisted resources in `finally` in reverse dependency order.

Expected result:

- No call observes another request's Passport, state, headers, arguments, instance, transaction store, authorization result or audit identity.
- At most the contract-defined durable side effect occurs; deadlines/disconnects or post-execution callback/filter failures do not automatically duplicate non-idempotent work. Operations lacking a reviewed idempotency/recovery policy remain disabled.
- Failure results match the documented transaction/recovery boundary, never claim false success or automatic rollback after commit, and do not reveal rejected output. The real HTTP fixture demonstrates bounded completion/accounting independently of executor-only tests.

Minimum proof:

- Retain explicit interleaving, separate-context/datasource identifiers, durable final state, failure injection and duplicate-submit outcome, guarded route and real HTTP classifications, and redacted telemetry; test runner concurrency alone is not contention proof.

Traceability: `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-DISPATCH-04`, `SRS-MCP-DISPATCH-05`, `SRS-MCP-PRIVACY-01`, `WBS-MCP-40-02`.

### ATP-MCP-OPS-01: Limits, audit, telemetry, and sensitive-data redaction

Setup:

- Configure synthetic, separately reviewed preauth header/body/parser and request budgets, JSON argument/structure and list/result limits, keyed rate and in-flight limits, and execution/cleanup deadlines; configure an approved protected audit sink and separate telemetry/exporters. Keep live secret/configuration values out of evidence.
- Prepare successful, validation, auth, instance, policy, downstream, timeout, post-commit filtering/audit failure, disconnect, and internal-failure calls containing synthetic sensitive-looking values; use independent subjects, clients, instances and tool classes, plus the approved worker topology.

Procedure:

- Exceed each approved ingress/JSON/catalog/result/time/concurrency/rate limit, including preauth requests, per-subject/client/instance/tool dimensions, multiple workers where applicable, and a quota-backend failure/stall or restart. Prove whether denial occurs before dispatch and whether result rejection follows an already committed effect.
- Inject sink delivery/ack failure before state-changing admission; check read/list outage behavior against the approved policy. Trigger disconnect/deadline while an owned operation remains active, and check slot/accounting and eventual domain outcome without auto-replay.
- Inspect real HTTP protocol/error responses, dedicated HTTP file logs, platform/SDK/proxy and nested route/AOP error-and-argument/token/ORM SQL debug logs, trace exceptions, metrics, protected audit records, external exporters and retained test artifacts, including debug and nonproduction error modes. Search each approved sink for bearer tokens, cookies, passwords, hashes, raw OAuth claims, raw arguments/results, complete private payloads, usable links and high-cardinality identity labels; verify MCP correlation independently of optional telemetry and caller-supplied request IDs.

Expected result:

- Limits and required sink/backend failures reject safely at the approved stage without cross-subject leakage, unintended controller side effects for pre-dispatch denials, or untracked active work; result rejection or timeout does not imply rollback or permit MCP replay.
- Protected audit delivery and operator telemetry preserve the approved, pseudonymous event/outcome classes; clients receive bounded nondiagnostic errors. Actual settled and unknown states remain distinguishable.
- No prohibited secret or sensitive value is retained; ordinary non-MCP routes remain unchanged by MCP limit/disablement policy.

Minimum proof:

- Retain the approved numeric/key/window matrix, source/configuration/worker/sink fingerprints, ingress and dispatch counters, explicit in-flight/settlement interleaving, sink-failure procedure, safe event samples, per-sink redaction searches, and redacted artifact locations. This is a future ATP, not evidence from this planning draft.

Traceability: `PRD-MCP-SAFETY-03`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-OPS-01`, `SRS-MCP-OPS-02`, `SRS-MCP-TRANSPORT-03`, `WBS-MCP-50-01`.

### ATP-MCP-OPS-02: Disablement and configuration fail-closed behavior

Setup:

- Initial scaffold/configuration and application integration exist under the separately approved increments in the [phase-20 index](./evidence/phase-20/index.md). In a separately approved ATP procedure, inspect the generated initial `5.0.0` suite/module manifests, suite `workspace:^` module dependency, module `a-vona: 5.0.0` lifecycle dependency, absence of MCP-owned `fileVersion`/schema, and discovered/generated application registration; do not substitute planning text or initial-source proof for this ATP.
- Prepare module-owned `enabled: app.meta.env.CABLOY_MCP_ENABLED !== 'false'` cases: unset, empty, literal `false`, literal `true`, and another non-`false` string. Only literal `false` disables the module flag. Inspect the absence of the standard application MCP `enabled` environment mapping; separately prepare an explicit generic framework application override to verify merge precedence without reinstating an opt-in requirement. Include enabled/disabled endpoint and per-tool policy states, missing OAuth configuration, missing host mapping, invalid registry/adapter or policy, and ordinary HTTP calls to the same underlying controller.

Procedure:

- Confirm the generated module is discoverable without handwritten registration and the module owns the environment expression without a standard application MCP `enabled` mapping. Compare unset/empty/`true`/other non-`false` values (flag enabled) with literal `false` (flag disabled); separately verify an explicitly supplied generic application override merges after defaults. Remove each required OAuth/host/registry/policy configuration item and attempt list/call operations with the module flag enabled.
- Disable the endpoint and individual tool, then call the ordinary HTTP API with its normal authentication before and after MCP disablement.

Expected result:

- The actual initial manifests and registration match DEC-MCP-01. Module configuration owns `app.meta.env.CABLOY_MCP_ENABLED !== 'false'`, with no standard application MCP `enabled` environment mapping. Unset, empty, `true` and other non-`false` strings yield an enabled module flag; only literal `false` disables it. Explicit generic framework application overrides retain their normal later merge precedence without making application opt-in mandatory.
- Discovery or an enabled flag never establishes readiness. Literal-`false` disablement, an explicit generic disabling override, and missing/invalid required OAuth/host/registry/adapter/policy configuration return stable unavailable/failure-closed results and never invoke a business controller. Default enablement with incomplete security configuration is still denied.
- Ordinary HTTP authorization and behavior are unchanged by MCP disablement.
- Operator telemetry identifies the configuration class without exposing secret values.

Minimum proof:

- Retain source revision, generated manifest/registration excerpts, module configuration ownership and absence-of-standard-application-mapping assertions, the unset/empty/literal-`false`/literal-`true`/other-value state matrix, separate generic application override precedence results, independent readiness denial/dispatch counters, ordinary HTTP comparison, result classes, and redacted operator artifact. State labels, not secret values, are retained; these prospective requirements do not close this ATP.

Traceability: `PRD-MCP-SAFETY-04`, `SRS-MCP-OPS-03`, `SRS-MCP-OPS-04`, `SRS-MCP-UI-01`, `SRS-MCP-UI-02`, `WBS-MCP-50-02`.

## Contract, SSR, Browser, and Integration Procedures

The MCP resource-server module itself has no Zova SSR/browser procedure. The selected integrated `a-auth` logical AS needs Zova-presented authorization/grant-interaction verification under `ATP-MCP-AUTH-03` after site/flavor/admission and browser security contracts are approved; an independent site is not presumed. After implementation, use the narrowest applicable command and record actual results in a bounded execution dossier. Prospective resource-server command families verified during planning include:

```bash
# Vona module-local or selected backend tests, after the proposed module exists
npm run vona -- :bin:test -- <selected-cabloy-mcp-tests> --flavor=normal

# Type and root checks as applicable
npm run tsc
npm run lint
npm run format
npm run test

# Planning authority and derived chart checks
npm run spec:check -- cabloy-mcp
npm run spec:charts -- cabloy-mcp
npm run spec:charts:check -- cabloy-mcp
```

The exact generated module test command, protocol harness, OAuth test provider, and deployment integration command remain execution-dossier decisions. Do not run database reset, provider operation, deployment, or acceptance tests automatically as a consequence of generating this plan.

For the selected AS Zova interaction, build the approved affected flavor's SSR and REST artifacts together and synchronize through `npm run deps:vona` when execution is approved; `ATP-MCP-AUTH-03` must separately prove its site/admission and browser/SSR contract. A future management UI would require its own site-specific proof.

## Commands

Planning commands are separate from runtime proof:

- `npm run spec:check -- cabloy-mcp` validates planning definition/reference/link structure.
- `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` validate complete supported chart inputs and freshness.
- The implementation commands above are prospective only until an approved execution dossier runs them and retains evidence.

## Release Closure Gate

Release is blocked until:

- ADR 0001 is accepted and concrete module/OAuth/host/registry designs have separate approvals;
- every applicable PRD/SRS/WBS/ATP chain has an owner and passing, revision-bound, redacted evidence;
- OAuth resource validation, subject mapping, instance binding, direct authorization, list/call recheck, fixed dispatch, and context isolation pass independently;
- unsafe shapes, destructive/unclassified operations, arbitrary execution controls, and stale registry entries are proven unavailable;
- limits, audit, redaction, disablement, configuration fail-closed behavior, and ordinary-HTTP non-regression pass;
- no expired waiver, unresolved critical `TODO(confirm)`, unreviewed provider/host trust issue, or source/schema drift remains;
- production endpoint/resource metadata, OAuth issuer, secrets, host-instance mapping, tool policy, and operational ownership are explicitly configured and approved.

## Related Records

- [A-MCP planning index](./README.md)
- [A-MCP PRD](./prd.md)
- [A-MCP SRS](./srs.md)
- [A-MCP PDP/WBS](./pdp-wbs.md)
- [A-MCP progress](./progress.md)
- [A-MCP ADR 0001](./decisions/0001-mcp-suite-boundaries.md)
- [A-MCP ADR 0004 (proposed)](./decisions/0004-mcp-host-instance-binding.md)
- [A-MCP ADR 0005 (proposed)](./decisions/0005-mcp-tool-catalog-registry.md)
- [A-MCP ADR 0006 (proposed)](./decisions/0006-mcp-tool-eligibility-risk-results.md)
- [A-MCP ADR 0007 (proposed)](./decisions/0007-mcp-context-passport-executor.md)
- [A-MCP ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md)
- [A-MCP ADR 0009 (accepted design-only amendment)](./decisions/0009-mcp-as-state-boundary.md)
