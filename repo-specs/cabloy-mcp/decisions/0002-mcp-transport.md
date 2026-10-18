# ADR 0002: MCP Streamable HTTP Transport Boundary

## Status

Accepted (design only) — on 2026-10-07, the accountable decision owner `zhennann` explicitly accepted `DEC-MCP-02` for the MCP **2026-07-28** modern-only Streamable HTTP profile, the specified SDK versions and explicit legacy rejection, and the Vona `/mcp` integration design below. This decision does not authorize source creation, select an OAuth provider or live Host/proxy policy, configure a route in a running application, or provide runtime/ATP evidence. DEC-MCP-03/04/07/08 and a separate bounded execution dossier remain gates.

Do not silently apply this design to an older MCP profile or infer its wire behavior from a package name alone. Published SDK and Vona source observations informed the decision; target-module compilation, real HTTP interoperability, security behavior, and bounded request lifetime remain implementation/ATP checks.

## Context

The first increment needs one remote MCP HTTP boundary served by Vona. It must not add a Zova site, an Express application, a second HTTP server, or a second business API. Vona exposes the native Node request/response through its Koa context, but ordinary controller responses are wrapped in the Cabloy response envelope and the normal body interceptor can consume the request before an MCP transport sees it.

The current MCP profile differs materially from older Streamable HTTP revisions. The 2026-07-28 profile is a POST request/response protocol: it has no `initialize` handshake, protocol session, standalone GET stream, DELETE termination, or `Last-Event-ID` resumption. Treating an older client/server exchange as the current contract would create an interoperability and security ambiguity.

## Decision

### Protocol profile and library

Use the MCP 2026-07-28 Streamable HTTP profile in **modern-only** mode:

- select the official v2 server package `@modelcontextprotocol/server` at `2.3.0`;
- select the official Node adapter `@modelcontextprotocol/node` at `2.1.1`;
- use the v2 web-standard handler (`createMcpHandler`) and its Node adapter (`toNodeHandler`), subject to compile-time/API and real HTTP verification during a separately approved execution dossier;
- configure `createMcpHandler(factory, { legacy: 'reject' })` explicitly: the published `2.3.0` handler defaults to `legacy: 'stateless'` and would otherwise admit 2025-era requests. The published `2.1.1` Node adapter accepts native `(req, res, parsedBody?)` and returns `Promise<void>`; it does not make a Vona controller action or its lifecycle safe by itself. The published packages declare Node `>=20` and the adapter peers on server `^2.3.0`; the root project declares Node `>=24.4.0`. These are package-source observations, **not** installation, compilation, lockfile selection, or runtime interoperability proof. These versions and their module-local ordinary dependency ownership are accepted for the transport design; their installation and compatibility in the target module remain execution gates.

Do not select the older monolithic `@modelcontextprotocol/sdk` 1.x package for this modern-only boundary. If compatibility with an older MCP revision is later required, it needs a separate protocol/version decision, explicit route behavior, and separate ATP coverage; it must not be enabled as an accidental SDK default.

### Vona route and response ownership

Mount the endpoint at the origin-root Vona path `//mcp`, which resolves to `/mcp` rather than inheriting a global API prefix. Use a dedicated controller action for `POST`; register explicit `GET` and `DELETE` behavior that returns `405` for this modern-only endpoint, rather than relying on generic not-found handling. Do not assume a catch-all `@Web.all` action exists.

The controller hands native `ctx.req` and `ctx.res` to the Node adapter. It must deliberately transfer ownership of parsing, protocol response writing, stream completion, and protocol error formatting to the selected MCP transport. The implementation must:

- disable the transport actions' global Vona parser/envelope with route-local `@Aspect.interceptorGlobal('a-body:bodyReq', { enable: false })` and `@Aspect.interceptorGlobal('a-body:bodyRes', { enable: false })` (the publicly exported `Aspect` facade configures existing global interceptors; the option is `enable`, **not** `enabled`); alternatively, a separately verified pre-parsed-body path must preserve the same bounds without double-reading the stream. The normal parser's 20 MB default is no longer an MCP ingress bound when bypassed. The published Node adapter and server handler each default to a 4 MiB body bound for bodies they read; select and verify application-level request limits under DEC-MCP-08 rather than relying on those defaults or passing an unbounded pre-parsed body;
- set `ctx.respond = false` for native response ownership, not as an error or lifetime bypass: Vona error handling and middleware unwinding still run. Define and verify one bounded writer for native JSON, SSE, pre-/post-header errors, and aborts so that a Vona error cannot corrupt an MCP response or leak an unredacted framework payload;
- avoid Express response/request APIs and avoid appending an Express-style middleware after Vona's terminal router;
- reject transport-path method override before routing: Vona's system-level `koa-override` accepts POST overrides (including `X-HTTP-Method-Override`) before the controller route is chosen. A POST with an override must not reach a GET/DELETE handler, bypass the POST protocol checks, or dispatch a business action; disabling action-level interceptors alone does not address this ingress behavior;
- await the adapter and any request-scope-dependent tool work/cleanup through actual settlement. Vona disposes request-scoped beans when its request callback settles, not when a socket eventually closes; a response close is a cancellation signal under the protocol but cannot by itself prove domain work stopped, a transaction rolled back, or capacity was released. No process-global handler may capture a request-scoped context or Passport. DEC-MCP-07/08 own bounded active-work, deadline, and post-disconnect outcome mechanics.

A separate protected-resource metadata HTTP route is **not** selected here. Its resource identifier, authorization-server discovery, OAuth bearer validation, and host-to-instance authorization belong to `DEC-MCP-03` and `DEC-MCP-04`. The MCP `server/discover` method is a protocol RPC on `/mcp`, not a substitute for OAuth protected-resource metadata.

### Modern HTTP wire contract

For the first increment, each client JSON-RPC message uses a new `POST` with a single JSON-RPC request or notification, never a response or batch. The current core protocol defines no client-to-server HTTP notifications; accepting an extension notification would need separate review:

- require JSON request `Content-Type: application/json` and an `Accept` header listing both `application/json` and `text/event-stream`; a supported request receives either a JSON object or a request-scoped SSE response. An accepted notification, if separately supported, returns `202` with no body;
- require `_meta` fields `io.modelcontextprotocol/protocolVersion` and `io.modelcontextprotocol/clientCapabilities` on every request; `io.modelcontextprotocol/clientInfo` is SHOULD but not a required authentication input. Missing required metadata maps to HTTP `400` and JSON-RPC `-32602`; a declared but missing capability required for the operation maps to HTTP `400` and `-32021` with `data.requiredCapabilities`;
- require and compare `MCP-Protocol-Version` with `_meta` and `Mcp-Method` with `method`; require `Mcp-Name` for `tools/call` and compare with `params.name`. Standard header names are case-insensitive, values are case-sensitive. Decode the `=?base64?{Base64EncodedValue}?=` sentinel for header-unsafe or sentinel-shaped names before comparison; reject malformed, missing, or mismatched required headers with HTTP `400` / JSON-RPC `-32020`. Reject an unsupported protocol version with HTTP `400` / `-32022` and a supported-version list. If any later tool publishes `x-mcp-header`, its `Mcp-Param-*` matching and safe value encoding need a separate catalog/transport review; first-increment tools must not advertise an unvalidated annotation;
- implement the required `server/discover` RPC, `tools/list`, and `tools/call` on the same endpoint. An unimplemented **RPC method** maps to HTTP `404` and JSON-RPC `-32601`; an unknown tool or malformed call is a JSON-RPC protocol error (for example `-32602`), **not** an `isError` tool result. Execution failures after a valid tool call use a tool result with `isError: true` where the profile requires one. Bound and redact all error bodies;
- allow JSON or request-scoped SSE responses. There is no standalone GET notification stream. A future `subscriptions/listen` or long-lived notification path requires a separate scope, cancellation, and limits review; a request-scoped SSE close is a protocol cancellation signal, not proof of completed business cancellation;
- return `405` for GET and DELETE as the chosen modern-only behavior (the specification says **SHOULD**, not MUST). Ignore `Mcp-Session-Id` and `Last-Event-ID` as legacy compatibility inputs without minting/echoing sessions or resuming streams; never treat them as authority;
- validate `Origin` on incoming transport traffic and return HTTP `403` when a present Origin is invalid (**MUST**). Validate approved Host/proxy inputs at ingress; the published bare handler does not itself supply deployment-specific trust or host-to-instance binding, which remains DEC-MCP-04;
- choose bounded request bytes, JSON depth/collection limits, concurrent calls, execution deadlines, and cancellation behavior under DEC-MCP-07/08. The protocol profile supplies no numeric body bound. A disconnected SSE response cannot on its own prove domain cancellation or rollback of a committed effect.

The cited normative mappings and published-package API/defaults were inspected as design inputs; compatibility across the installed SDK, Vona, ingress/proxy and real HTTP still requires separately approved compilation and ATP. No runtime wire behavior is claimed.

### Legacy compatibility boundary

Legacy 2025-era behavior (`initialize`, optional protocol sessions, GET SSE, DELETE, and `Last-Event-ID`) is excluded from the first increment. A well-formed, modern-profile `initialize` request is an unimplemented RPC method (`404` / `-32601`); malformed/missing headers or an unsupported version instead receive their applicable `400` protocol error before RPC dispatch. Legacy GET/DELETE receive the chosen `405`; session/resumption headers are ignored rather than used for authority. Supporting both profiles in one route would require explicit negotiation, test fixtures, and a new decision; it is not a safe SDK compatibility default.

## Alternatives rejected or deferred

- **Older `@modelcontextprotocol/sdk` transport/session model:** deferred because it does not match the selected 2026-07-28 profile and would reintroduce ambiguous GET/session behavior.
- **Express adapter or second HTTP server:** rejected for the first increment because Vona already supplies native Node request/response access and a second server would complicate host, OAuth, instance, lifecycle, and disablement ownership.
- **Ordinary Vona JSON controller return:** rejected because the response interceptor wraps JSON-RPC and the framework's error renderer is not an MCP JSON-RPC boundary.
- **Long-lived GET/SSE session:** rejected for the modern-only first increment; request-scoped POST responses are narrower and avoid treating transport state as authorization.
- **HTTP protected-resource metadata under this decision:** deferred to `DEC-MCP-03`; protocol discovery and OAuth protected-resource metadata are different contracts.

## Consequences and verification gates

This decision keeps transport ownership inside the planned normal Vona module and preserves the no-new-persistence boundary. It requires a native-response controller integration, exact body/response interceptor configuration, explicit Host/Origin policy, and real HTTP tests rather than only `bean.executor.performAction(...)` tests. It also means older MCP clients are intentionally unsupported until a separately approved compatibility design exists.

Design acceptance and implementation verification are separate gates. The 2026-10-07 owner disposition accepts the 2026-07-28 revision, pinned package versions and published API/Node/peer requirements, explicit modern-only configuration, root `/mcp` POST and GET/DELETE policy, normative wire/error mappings, and Vona integration design. The review considered the known pre-route method override, parser/envelope bypass, native error writing (including an invalid Origin remaining `403` rather than being rewritten to `401`), request-scope settlement, and ownership handoffs to DEC-MCP-03/04/07/08. Static planning/source checks informed this design decision; unverified SDK behavior and runtime controls remain execution checks. Acceptance does not authorize source work, select a live issuer/host/proxy/limit, or prove a runtime control.

Obtain separate approval of a bounded `WBS-MCP-20-01` execution dossier **before** adding any package, route, or source. That dossier must retain the following compilation and real-HTTP checks as implementation/ATP gates, not prerequisites for this already accepted design:

1. Install the accepted versions under the approved module dependency owner; check generated manifests, lockfile selection, compilation, fresh per-request server creation in the handler factory, and actual `legacy: 'reject'` behavior. Never reuse a server across overlapping requests or capture request-scoped state in a process-global handler.
2. Exercise the selected profile's required `_meta`, mirrored headers and Base64 sentinel, JSON/SSE negotiation, `server/discover`, supported/unknown-method errors and unsupported-version behavior over real HTTP. Distinguish a malformed RPC request from a valid call whose tool-input validation or execution fails; inspect the pinned handler's legacy-notification and missing/unsupported-version classification rather than assuming an error for every legacy message.
3. Prove Vona `//mcp` route resolution, POST/GET/DELETE mapping, pre-route POST method-override rejection, route-level `enable: false` body/response overrides, application body bounds, parser bypass, and one bounded native writer for JSON/SSE and pre-/post-header errors.
4. Observe request-context lifetime across JSON/SSE and errors, awaited request-scoped work and cleanup, disconnect signaling versus actual domain settlement, and concurrent stateless calls; do not infer cancellation, transaction rollback, or capacity release from socket close alone.
5. Prove invalid Origin receives `403` even when the default Vona error filter would rewrite an unauthenticated `403` to `401`; test the approved Host/proxy ingress and instance-binding handoff only against separately accepted DEC-MCP-03/04 policy, without moving their authority into this decision.

`ATP-MCP-TRANSPORT-01` and the WBS-MCP-20-01 acceptance checks retain the real-HTTP proof obligation; failing a check blocks implementation closure and may require reopening this design. No check listed here has been executed in the target module. Planning audit and chart checks did not accept this ADR and cannot prove protocol/security behavior; acceptance is the separate owner disposition recorded above.

## Proposed bounded native-core qualification (2026-10-17)

**Bounded design accepted on 2026-10-18; source execution not approved.** This section was proposed on 2026-10-17 and is not part of the original 2026-10-07 acceptance; its dated proposal heading is retained for chronology and stable links. After reviewing the unchanged G1–G4 package, the user explicitly selected acceptance of all four bounded items, including native-core scope reduction, the complete ADR 0008 fixture budgets and `zhennann` as fixture implementation/sanitized-artifact custodian and accountable reviewer. This disposition applies to `c14eab56db0f561d41d84fcd946c6c94ee2601af` plus the seven carried planning-document changes (ADR 0002/0004/0007/0008, SRS, dossier and README), not the base SHA alone. It accepts the native-core/writer design below and the linked fixture-only designs, not production DEC-MCP-04/07/08 as a whole. G5 source/dependency/command/evidence execution approval remains separate. No SDK compatibility, runtime proof, ATP closure or WBS advancement follows. The production route, protocol, OAuth requirement and full ATP completion rules are unchanged.

Use one dedicated root-managed single-file test invocation, its real Vona singleton app, a test-owned loopback listener with the default app listener disabled, temporary raw router registration, `executor.newCtx` and real Koa `handleRequest`. The precise ingress and ownership proposal is in [ADR 0004](./0004-mcp-host-instance-binding.md#proposed-nonpublic-qualification-ingress-2026-10-17); lifetime is in [ADR 0007](./0007-mcp-context-passport-executor.md#proposed-transport-only-lifetime-2026-10-17); numeric fixture budgets and sinks are in [ADR 0008](./0008-mcp-limits-audit-telemetry-redaction.md#proposed-native-core-fixture-budgets-and-sinks-2026-10-17). No production controller, startup bean or module export wires this listener or fixture. This is a test listener, not permission for a second production HTTP server.

### Native writer and parser proposal

- Admit and bound raw ingress before executor creation. Use exactly one bounded body reader; after byte, UTF-8 and JSON-structure checks, pass the parsed body only if the pinned adapter's actual API supports that path without rereading. Otherwise stop this candidate for a concrete disposition; do not silently bypass bounds or consume the stream twice.
- In the executor callback, before `handleRequest`, set `ctx.respond = false` and install a request-own `ctx.onerror` backed only by pure Node response state. Run the existing `SymbolRouterMiddleware`, not `compose(app.middleware)`. Raw router registration bypasses controller guard/interceptor/pipe composition: absence of a parser/envelope here is **not** proof that controller Aspect overrides work.
- The listener contains rejection of the **entire** executor promise, including `commitsDone()` and scope disposal outside middleware catch. Both this catch and the request-local Koa error callback use the same idempotent native failure gate; neither invokes the ordinary Vona error filter, logger or a disposed bean. Keep that pure-state callback available through response termination, including Koa's late `onFinished` callback.
- Model response commitment/termination, adapter/work/cleanup settlement and capacity independently. Before commitment, emit only a bounded fixed failure; invalid Origin is directly written as `403`, never thrown through the unauthenticated `403`→`401` filter. Preserve the accepted protocol error mappings. Fixture-only nonprotocol admission failures use the status table in ADR 0004; precommit unexpected internal failure is fixed `500` / JSON-RPC `-32603` with `id: null`, without exception text. A precommit execution deadline is fixed `504` with no diagnostic body. These fixture fallback choices are included in the bounded design acceptance, not new normative MCP mappings.
- After commitment, do not change status/headers or append another JSON/envelope. Cancel producers and terminate an unwritable/failed stream without passing a raw Error to a sink. Do not write after `writableEnded`/`destroyed`; normal finish followed by close is not a second failure. The SDK remains the normal protocol writer, not a competing writer beside a controller return value.
- Every SDK output path, including internal errors, must fall under the byte/frame/disclosure boundary **before** native commitment. Prefer supported pinned-SDK controls; if a response-instance gate is necessary, cover all used header/commit/write/end APIs, preserve Node overloads, backpressure and adapter compatibility, never patch a global prototype. Bound a complete JSON payload before release; inspect SSE incrementally with a bounded frame buffer, not by treating arbitrary chunks as complete JSON. Merely counting bytes or catching thrown errors does not sanitize SDK-generated error payloads.

### First execution checkpoint and proof limits

Selected `server@2.3.0` / `node@2.1.1` are not installed in the MCP module at this discovery revision; observed transitive `server/core@2.0.0` cannot substitute. After separate execution approval and exact-version installation, inspect actual imports/options, pre-parsed-body behavior, signal propagation, handler/stream settlement, server cleanup and all response/error/log sinks **before opening the fixture listener**. Compile the resulting integration. If bounded output, safe errors/sinks or actual settlement cannot be established within the approved files, stop and report the precise incompatibility; no invented SDK option, framework patch or silent version switch is allowed.

Future successful checks can qualify selected modern wire behavior over real Node HTTP and the Vona executor/ALS/raw-router core, JSON/request-scoped SSE, error containment and synthetic lifetime. They cannot qualify controller `//mcp` discovery/Aspect overrides, full system middleware ordering or ordinary-route regression, production Host/instance/OAuth admission, business cancellation, deployment quotas or audit. All original full-integration checks above remain open. Partial qualification cannot complete `ATP-MCP-TRANSPORT-01` or `WBS-MCP-20-01`.

## Proposed unregistered request-owner refinement (2026-10-18)

**Initial disposition (historical): Proposed — C1/C2 acceptance and C3 execution were separate and outstanding.** The user authorized the concentrated design-disposition step after [dossier section 10](../wbs-mcp-20-01-execution-dossier.md#10-production-integration-candidate--unregistered-request-ownership-seam-2026-10-18) was prepared. Agreement to perform that step does not select its acceptance result. The scoped check at clean `9e6f7bb7720819cdd7bd0b4cb6ec3c2352d9e98f` found only the candidate dossier/README commit since preparation at `6478ea6844b4b2d36bb040d05252268901ecfa26`, with no source or upstream contract delta. This proposed refinement is recorded against that HEAD plus the six attributed ADR/SRS/dossier/README edits; it does not modify the original transport acceptance or the historical native-core acceptance/execution.

**Later C1/C2 bounded design acceptance (2026-10-18).** After the preceding Proposed-design report explicitly identified bounded C1/C2 acceptance as the sole next action, the user replied “同意，请执行下一步”. This later reply accepts this exact callable/error/proof package and the complete linked C2 numeric, enforcement, sink and custody matrix, not merely permission to review it. The earlier absence-of-acceptance statement above describes the preceding recording, not the current result. The disposition is recorded at clean `e392061f32d096329535e12ae702f82c7edd19a4` before these six planning-document edits. Its only delta from `9e6f7bb7720819cdd7bd0b4cb6ec3c2352d9e98f` is the preceding six-document design record; source and other authority are unchanged. `zhennann` is the accountable reviewer and accepted implementation/sanitized-artifact custodian for this bounded harness. The proposal heading is retained for chronology/stable links. C3 source/command/managed-resource/evidence approval remains separate and outstanding; production DEC-MCP-04/07/08 remain Proposed as a whole.

The accepted bounded design selects one library callable around **admission before executor invocation and ownership of its entire continuation**. Its inputs are native request/response objects, an explicit server-owned binding provider, bounded ownership settings, an approved callback and an executor continuation. For this no-listener qualification only, admission is synthetic, not production Host/proxy/OAuth validation. [ADR 0007](./0007-mcp-context-passport-executor.md#proposed-unregistered-request-owner-contract-2026-10-18) owns trusted options, settlement and the real-versus-controlled proof split; [ADR 0008](./0008-mcp-limits-audit-telemetry-redaction.md#proposed-no-listener-owner-budgets-and-sinks-2026-10-18) owns this distinct harness's ceilings and sinks. These bounded acceptances do not accept production DEC-MCP-04/07/08 as a whole.

The accepted seam-only failure gate uses the following empty-body precommit outcomes, not MCP/OAuth protocol mappings:

| Condition                                                         | Status |
| ----------------------------------------------------------------- | ------ |
| Explicit binding denial                                           | `403`  |
| Missing, ambiguous or unavailable binding; closed/unhealthy owner | `503`  |
| Capacity exhausted, with no waiting queue                         | `429`  |
| Owned execution deadline                                          | `504`  |
| Unexpected binding-provider or executor failure                   | `500`  |

The first committed response is never rewritten. Once committed/ended/destroyed, cancellation may terminate the owned synthetic response but must not append another envelope, headers, body or raw exception. There is no fake `401` challenge. Failure reporting uses request-local pure state and must neither invoke default framework logging/rendering nor reacquire disposed scoped beans. This fixed empty-failure gate is not a general production JSON/SSE writer, SDK redactor or native wire/backpressure qualification.

Only `src/lib/productionRequestOwner.ts`, `test/support/productionBoundaryFixture.ts` and `test/productionBoundary.test.ts` under the existing MCP module are explicitly approved new design targets, with source creation gated by C3. No listener, route/controller, startup, AOP, application getter/configuration mutation, module-index export, SDK call, body reader, dependency addition or business dispatch is selected. Existing `transport.ts`/`transportIngress.ts` stay fixture-only and unchanged. Explicit direct wiring does not prove supported standard-startup interception; eventual installation, full system/controller/Aspect error ownership, native server/parser limits, collision/ordinary-route/disablement/shutdown behavior, production binding and OAuth metadata remain activation gates. The source check does not declare production integration impossible.

This finite C1/C2 design surface is accepted; no further generic preparation or reconfirmation of unchanged design is needed. Precise C3 source/command/managed-resource/evidence approval is still required. No runtime result, WBS advancement or full ATP closure is claimed; WBS-MCP-20-01/Phase 20 stay blocked and verified remains 0/12.

## Proposed controller-preserving native ingress profile (2026-10-18)

**Proposed compatibility refinement, not an amendment already accepted with DEC-MCP-02.** The separately authorized concentrated F3-B/R/E disposition at clean `d05c4c3d12f3421b6f80cb2281ec2b19b8f93754` selects the following recommendation for independent disposition. Original controller/Aspect, protocol and SDK design acceptance is preserved; no production source, registration, wire result or new execution authority follows. See [dossier section 16](../wbs-mcp-20-01-execution-dossier.md#16-concrete-f3-bre-mechanism-disposition-2026-10-18).

### Supported terminal and specific missing entrypoint

The [web owner](../../../vona/src/suite-vendor/a-vona/modules/a-web/src/main.ts), lines 30–83, exposes `app[SymbolRouterMiddleware]`, invoked with `ctx`, separately from its app-wide cached system composition. On **registered decorated routes**, the [router](../../../vona/src/suite-vendor/a-vona/modules/a-web/src/bean/bean.router.ts), lines 172–234, establishes route/params/query and invokes route-start, global middleware, guards, interceptors, pipes, route-tail/local middleware and container-resolved controller invocation, including applicable method AOP. This is the proposed terminal, not temporary raw registration or a direct method call. It does **not** replay system middleware.

Recommend a supported `a-web` **admitted-native-request profile/entrypoint** with server-built admission, fixed executor options, immutable predeclared system allowlist, Koa `handleRequest` and the decorated router terminal. Together with ADR 0007's early context hook and ADR 0004's ready-existing path, it must validate the expected controller/action/method and framework-issued receipt; missing/mismatched receipt denies without ordinary resolver fallback. These are new framework capabilities, not current `_callback()` options. Retain synchronous startup wrapping, construction-time `next()` exactly once, no captured startup authority, and exactly-once unchanged delegation for clearly non-MCP request pairs/receiver semantics. Do not mutate singleton system caches, global getters/proxy, prototypes or warmed controller composition.

### Dedicated system profile

Recommend **an empty generic-system allowlist** for claimed MCP/selected metadata traffic, followed by the decorated router. This deliberately replaces—not reproduces—the ordinary HTTP system contract:

| Excluded system owner        | Explicit replacement / retained boundary                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `trace`, `httpLog`           | ADR 0008's safe diagnostic prevention and separately selected audit/telemetry; no raw headers/URL/exception logging. |
| `notfound`, `overrideMethod` | Fixed native unmatched/method behavior and raw-ingress override rejection before executor/routing.                   |
| `health`, `metrics`          | Not MCP handlers; ordinary traffic keeps its existing composition.                                                   |
| `app`, `instance`            | Nonwaiting completed-startup/close checks and read-only existing-ready admission; no lazy initialization.            |
| `cors`                       | Explicit reviewed Origin policy, preserving invalid-Origin 403; no inherited preflight permission.                   |
| `securities`                 | Explicit reviewed native response-header/security policy.                                                            |
| `static`                     | No static/SSR preemption of the reserved endpoint.                                                                   |

The observed dependency spine is `trace → httpLog → notfound → overrideMethod → app → instance → cors → securities → static`; health and metrics are additional nodes. Source/generated ordering is not runtime enablement or precedence proof. New graph members must be classified or fail profile validation; do not silently inherit them. Origin, security-header, metadata and production numeric policies remain independently gated, not assumed supplied by the empty list.

### Dedicated ingress-controller route profile

Disable all nine inspected generic global route onions **on ingress actions only**, using the existing `Aspect.middlewareGlobal`, `Aspect.guardGlobal` and `Aspect.interceptorGlobal` with `enable: false`:

| Stage / onion                                   | Proposed disposition                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Middleware `a-core:gate`                        | Replace with dedicated admission guard checking receipt/destination/binding/current availability.                                                                        |
| Middleware `a-ssr:ssrPassport`                  | Disable SSR redirect/return-URL behavior.                                                                                                                                |
| Guard `a-user:passport`                         | Replace with dedicated MCP OAuth admission, with explicit public-metadata/method policy; `public: true` alone still permits generic token extraction/anonymous Passport. |
| Guard `demo-demonstration:demonstration`        | Disable even when default-disabled; MCP POST is not itself a domain write. Actual business action retains demonstration restrictions.                                    |
| Interceptor `a-datasharding:datasharding`       | Disable transport-level business-datasource switching; action dispatch retains its datasource ownership.                                                                 |
| Interceptor `a-openapischema:openapiSchema`     | Disable `x-vona-openapi-schema` diversion to schema generation/framework success.                                                                                        |
| Interceptors `a-body:bodyReq`, `a-body:bodyRes` | Disable as already accepted: one bounded MCP reader/native writer, no generic parser/envelope.                                                                           |
| Interceptor `a-ratelimit:rateLimit`             | Disable explicitly even when default-disabled; use reviewed MCP staged limits rather than generic HTTP identity keys/logging.                                            |

Retain route discovery, lookup, route-start/tail/completion, guard/interceptor/pipe machinery, container resolution and applicable method AOP. Use native `ctx.req/res` without decorated body/other arguments. Keep ingress `ctx.onionsDynamic` unset: [onion precedence](../../../vona/src/suite-vendor/a-vona/modules/a-onion/src/service/onion_.ts), lines 260–309, 373–400, permits dynamic options to override route options. A controller-local dedicated guard must deny receipt absence, including advice-excluded graphs; it cannot repair the missing early boundary. Fresh graph/config checks must reject unclassified new route onions or method AOP. Do not copy ingress disables, public policy or options to business `performAction`; its Passport/RBAC/role/demonstration guards, pipes, datasource/AOP and domain checks remain unchanged.

### Raw target ownership and collision policy

`//mcp` is declaration syntax; `/mcp` is the wire target. Recommend admitting only canonical origin-form `/mcp` and the separately selected metadata target. Claim and deny query-bearing, encoded, absolute-form, malformed or normalized aliases that could resolve there **before executor/instance work**, rather than delegating them. The inspected router can strip query/fragment, decode eligible encoding and accept HTTP(S) absolute-form (for example `/mcp?...`, `/%6dcp`, `/mcp#...`, `https://authority/mcp`). Target authority never supplies binding. Freeze and validate supported slash/trailing/case/decoding assumptions; unknown ambiguity fails closed. Bound classifier work under the later F3-N budget; clearly unrelated traffic delegates unchanged.

Validate ownership across POST/GET/DELETE and every other method, selected metadata routes, duplicate root declarations, wildcard/parameter/constraint/fallback matches, advice exclusion and module graph absence versus present-but-unavailable. Identical-route duplicate errors alone do not reserve the endpoint. Effective installed graph/AOP order, controller receipt, system exclusions and ordinary-route regression require separately approved real HTTP proof; the completed F1/F2 construction probe does not supply it. This resolves the proposed profile choice, not production readiness or F3-S/N/F4 gates.

## References

- [MCP Streamable HTTP, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP base request metadata](https://modelcontextprotocol.io/specification/2026-07-28/basic/index#_meta)
- [MCP versioning](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)
- [MCP server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover)
- [MCP server tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [Published server 2.3.0 package metadata](https://registry.npmjs.org/@modelcontextprotocol%2Fserver/2.3.0) and [published Node adapter 2.1.1 metadata](https://registry.npmjs.org/@modelcontextprotocol%2Fnode/2.1.1) (package archives inspected for exports/defaults; not installed or compiled)
- [TypeScript SDK HTTP serving guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/http.md) (not fetched during this review; package archives supplied SDK findings)
- [Vona Swagger root-path precedent](../../../vona/src/suite-vendor/a-vona/modules/a-swagger/src/controller/swagger.ts)
- [Vona pre-route method override](../../../vona/src/suite-vendor/a-vona/modules/a-core/src/bean/middlewareSystem.overrideMethod.ts), [body parser](../../../vona/src/suite-vendor/a-vona/modules/a-body/src/bean/interceptor.bodyReq.ts), [response interceptor](../../../vona/src/suite-vendor/a-vona/modules/a-body/src/bean/interceptor.bodyRes.ts), [router](../../../vona/src/suite-vendor/a-vona/modules/a-web/src/bean/bean.router.ts), and [error renderer](../../../vona/src/suite-vendor/a-vona/modules/a-error/src/lib/onerror.ts)
