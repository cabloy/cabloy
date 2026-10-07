# ADR 0002: Proposed MCP Streamable HTTP Transport Boundary

## Status

Proposed — design draft only. This record does not accept `DEC-MCP-02`, authorize source creation, select an OAuth provider, configure a route in a running application, or provide runtime/ATP evidence. The accountable decision owner is `zhennann`.

The proposal targets the MCP **2026-07-28** Streamable HTTP profile. It must not be silently applied to an older MCP profile or inferred from a package name alone. Acceptance requires explicit review of the normative protocol revision, the selected SDK API/compatibility behavior, and the Vona route integration.

## Context

The first increment needs one remote MCP HTTP boundary served by Vona. It must not add a Zova site, an Express application, a second HTTP server, or a second business API. Vona exposes the native Node request/response through its Koa context, but ordinary controller responses are wrapped in the Cabloy response envelope and the normal body interceptor can consume the request before an MCP transport sees it.

The current MCP profile differs materially from older Streamable HTTP revisions. The 2026-07-28 profile is a POST request/response protocol: it has no `initialize` handshake, protocol session, standalone GET stream, DELETE termination, or `Last-Event-ID` resumption. Treating an older client/server exchange as the current contract would create an interoperability and security ambiguity.

## Proposed decision

### Protocol profile and library

Use the MCP 2026-07-28 Streamable HTTP profile in **modern-only** mode:

- propose the official v2 server package `@modelcontextprotocol/server` at `2.3.0`;
- propose the official Node adapter `@modelcontextprotocol/node` at `2.1.1`;
- use the v2 web-standard handler (`createMcpHandler`) and its Node adapter (`toNodeHandler`), subject to compile-time/API and real HTTP verification during a separately approved execution dossier;
- configure `createMcpHandler(factory, { legacy: 'reject' })` explicitly: the published `2.3.0` handler defaults to `legacy: 'stateless'` and would otherwise admit 2025-era requests. The published `2.1.1` Node adapter accepts native `(req, res, parsedBody?)` and returns `Promise<void>`; it does not make a Vona controller action or its lifecycle safe by itself. The published packages declare Node `>=20` and the adapter peers on server `^2.3.0`; the root project declares Node `>=24.4.0`. These are package-source observations, **not** installation, compilation, lockfile selection, or runtime interoperability proof. Versions and dependency ownership remain proposed until approved execution checks them in the target module.

Do not select the older monolithic `@modelcontextprotocol/sdk` 1.x package for this modern-only boundary. If compatibility with an older MCP revision is later required, it needs a separate protocol/version decision, explicit route behavior, and separate ATP coverage; it must not be enabled as an accidental SDK default.

### Vona route and response ownership

Mount the endpoint at the origin-root Vona path `//mcp`, which resolves to `/mcp` rather than inheriting a global API prefix. Use a dedicated controller action for `POST`; register explicit `GET` and `DELETE` behavior that returns `405` for this modern-only endpoint, rather than relying on generic not-found handling. Do not assume a catch-all `@Web.all` action exists.

The controller hands native `ctx.req` and `ctx.res` to the Node adapter. It must deliberately transfer ownership of parsing, protocol response writing, stream completion, and protocol error formatting to the selected MCP transport. The implementation must:

- disable the transport actions' global Vona parser/envelope with route-local `@UseInterceptorGlobal('a-body:bodyReq', { enable: false })` and `@UseInterceptorGlobal('a-body:bodyRes', { enable: false })` (the option is `enable`, **not** `enabled`); alternatively, a separately verified pre-parsed-body path must preserve the same bounds without double-reading the stream. The normal parser's 20 MB default is no longer an MCP ingress bound when bypassed. The published Node adapter and server handler each default to a 4 MiB body bound for bodies they read; select and verify application-level request limits under DEC-MCP-08 rather than relying on those defaults or passing an unbounded pre-parsed body;
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

The cited normative mappings and published-package API/defaults were inspected as planning inputs; compatibility across actual SDK, Vona, ingress/proxy and real HTTP still requires a separately approved compilation and ATP. No runtime wire behavior is claimed.

### Legacy compatibility boundary

Legacy 2025-era behavior (`initialize`, optional protocol sessions, GET SSE, DELETE, and `Last-Event-ID`) is excluded from the first increment. A well-formed, modern-profile `initialize` request is an unimplemented RPC method (`404` / `-32601`); malformed/missing headers or an unsupported version instead receive their applicable `400` protocol error before RPC dispatch. Legacy GET/DELETE receive the chosen `405`; session/resumption headers are ignored rather than used for authority. Supporting both profiles in one route would require explicit negotiation, test fixtures, and a new decision; it is not a safe SDK compatibility default.

## Alternatives rejected or deferred

- **Older `@modelcontextprotocol/sdk` transport/session model:** deferred because it does not match the selected 2026-07-28 profile and would reintroduce ambiguous GET/session behavior.
- **Express adapter or second HTTP server:** rejected for the first increment because Vona already supplies native Node request/response access and a second server would complicate host, OAuth, instance, lifecycle, and disablement ownership.
- **Ordinary Vona JSON controller return:** rejected because the response interceptor wraps JSON-RPC and the framework's error renderer is not an MCP JSON-RPC boundary.
- **Long-lived GET/SSE session:** rejected for the modern-only first increment; request-scoped POST responses are narrower and avoid treating transport state as authorization.
- **HTTP protected-resource metadata under this decision:** deferred to `DEC-MCP-03`; protocol discovery and OAuth protected-resource metadata are different contracts.

## Consequences and verification gates

This proposal keeps transport ownership inside the planned normal Vona module and preserves the no-new-persistence boundary. It requires a native-response controller integration, exact body/response interceptor configuration, explicit Host/Origin policy, and real HTTP tests rather than only `bean.executor.performAction(...)` tests. It also means older MCP clients are intentionally unsupported until a separately approved compatibility design exists.

Before accepting `DEC-MCP-02`, verify:

1. proposed package versions, Node/peer requirements, generated module dependency ownership, compilation and modern-only `legacy: 'reject'` behavior in the target module;
2. exact 2026-07-28 `_meta`, mirrored headers and Base64 sentinel, JSON/SSE negotiation, `server/discover`, supported/unknown-method error codes, and unsupported-version behavior via real HTTP;
3. Vona `//mcp` route resolution, POST/GET/DELETE mapping, pre-route POST method-override rejection, route-level `enable: false` body/response overrides, application body bounds, native writer/error ownership and parser bypass;
4. request-context lifetime across JSON/SSE and pre-/post-header errors, request scope through awaited work and cleanup, disconnect signaling versus actual domain settlement, and concurrent stateless calls;
5. Origin `403`, Host/proxy ingress policy and instance-binding handoff without moving OAuth, resource metadata, or host-to-instance authority out of DEC-MCP-03/04;
6. ATP updates and a bounded execution dossier before adding any package, route, or source. DEC-MCP-02 acceptance itself remains a separate explicit owner decision; real HTTP/ATP results cannot be inferred from this record.

No item above is runtime evidence. Planning audit and chart checks cannot accept this ADR or prove protocol/security behavior.

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
