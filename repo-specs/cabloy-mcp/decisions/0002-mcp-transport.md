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
- use the v2 web-standard handler (`createMcpHandler`) and its Node adapter (`toNodeHandler`), subject to compile-time/API verification during a separately approved execution dossier;
- reject legacy MCP traffic rather than accepting both profiles implicitly. The exact package versions remain a proposal until lockfile, Node engine, peer dependencies, and the package's modern-only configuration are checked in the target module.

Do not select the older monolithic `@modelcontextprotocol/sdk` 1.x package for this modern-only boundary. If compatibility with an older MCP revision is later required, it needs a separate protocol/version decision, explicit route behavior, and separate ATP coverage; it must not be enabled as an accidental SDK default.

### Vona route and response ownership

Mount the endpoint at the origin-root Vona path `//mcp`, which resolves to `/mcp` rather than inheriting a global API prefix. Use a dedicated controller action for `POST`; register explicit `GET` and `DELETE` behavior that returns `405` for this modern-only endpoint, rather than relying on generic not-found handling. Do not assume a catch-all `@Web.all` action exists.

The controller hands native `ctx.req` and `ctx.res` to the Node adapter. It must deliberately transfer ownership of parsing, protocol response writing, stream completion, and protocol error formatting to the selected MCP transport. The implementation must:

- disable the route's Vona request-body interceptor, or use the SDK's documented pre-parsed-body path without double-reading the consumed stream; do not accept Vona's default 20 MB parser limit accidentally;
- disable the normal Vona response-envelope interceptor for the transport action and set `ctx.respond = false` when native response ownership is transferred; otherwise JSON-RPC responses can be wrapped as `{ code: 0, data: ... }`;
- avoid Express response/request APIs and avoid appending an Express-style middleware after Vona's terminal router;
- keep request-local transport state and request-scoped Vona context alive until tool work, response completion, cancellation, or disconnect cleanup has finished. No process-global handler may capture a request-scoped context or Passport.

A separate protected-resource metadata HTTP route is **not** selected here. Its resource identifier, authorization-server discovery, OAuth bearer validation, and host-to-instance authorization belong to `DEC-MCP-03` and `DEC-MCP-04`. The MCP `server/discover` method is a protocol RPC on `/mcp`, not a substitute for OAuth protected-resource metadata.

### Modern HTTP wire contract

For the first increment, the endpoint accepts one JSON-RPC request per `POST`:

- require `Content-Type: application/json` and `Accept: application/json, text/event-stream` (or an equivalent explicitly approved negotiation policy);
- require the selected profile's request `_meta` protocol version and client capabilities; `clientInfo` is recommended but not a required authentication input;
- validate the profile's mirrored protocol headers against the request body, including `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` where required by the method. A mismatch is a bounded HTTP `400` / protocol header-mismatch error; an unsupported version is a bounded HTTP `400` with the supported-version error class/list;
- implement the required `server/discover` RPC, `tools/list`, and `tools/call` on the same endpoint. `tools/call` business or tool execution failures are represented as tool results with `isError: true` where the profile requires a result; malformed requests, unknown RPC methods, and invalid protocol envelopes remain JSON-RPC errors;
- allow a JSON response or request-scoped SSE response according to the client's `Accept` header and the selected SDK. There is no long-lived standalone GET notification stream in this proposal. If future subscription notifications use POST (for example `subscriptions/listen`), they require a separate scope and cancellation/limit review;
- return `405` for GET and DELETE, with no session creation or termination semantics; do not accept `Mcp-Session-Id` or `Last-Event-ID` as authority or resumption state;
- validate a present `Origin` and reject an invalid Origin with `403`. Add explicit Vona ingress Host allowlisting and trusted-proxy handling because the SDK handler does not itself establish the deployment's Host/instance trust boundary;
- choose bounded request bytes, JSON depth/collection limits, concurrent calls, execution deadlines, and cancellation behavior in the operational decisions. The protocol profile does not supply a numerical body-size limit. An SSE disconnect closes the transport response; whether work is actually canceled depends on the verified Vona/SDK/domain operation lifecycle. A disconnect alone neither proves business cancellation nor rolls back a committed effect; DEC-MCP-07/08 own active-work accounting and recovery.

The exact status/error mappings above must be checked against the selected SDK and normative profile before implementation. They are proposed contract targets, not observed runtime behavior.

### Legacy compatibility boundary

Legacy 2025-era behavior (`initialize`, optional protocol sessions, GET SSE, DELETE, and `Last-Event-ID`) is excluded from the first increment. A client that sends such traffic receives the modern endpoint's bounded unsupported-method/version response and no controller dispatch. Supporting both profiles in one route would require explicit negotiation, test fixtures, and a new decision; it is not a safe compatibility default.

## Alternatives rejected or deferred

- **Older `@modelcontextprotocol/sdk` transport/session model:** deferred because it does not match the selected 2026-07-28 profile and would reintroduce ambiguous GET/session behavior.
- **Express adapter or second HTTP server:** rejected for the first increment because Vona already supplies native Node request/response access and a second server would complicate host, OAuth, instance, lifecycle, and disablement ownership.
- **Ordinary Vona JSON controller return:** rejected because the response interceptor wraps JSON-RPC and the framework's error renderer is not an MCP JSON-RPC boundary.
- **Long-lived GET/SSE session:** rejected for the modern-only first increment; request-scoped POST responses are narrower and avoid treating transport state as authorization.
- **HTTP protected-resource metadata under this decision:** deferred to `DEC-MCP-03`; protocol discovery and OAuth protected-resource metadata are different contracts.

## Consequences and verification gates

This proposal keeps transport ownership inside the planned normal Vona module and preserves the no-new-persistence boundary. It requires a native-response controller integration, exact body/response interceptor configuration, explicit Host/Origin policy, and real HTTP tests rather than only `bean.executor.performAction(...)` tests. It also means older MCP clients are intentionally unsupported until a separately approved compatibility design exists.

Before accepting `DEC-MCP-02`, verify:

1. package versions, Node/peer requirements, modern-only SDK configuration, and generated module dependency ownership;
2. exact 2026-07-28 request `_meta`, header mirroring, response negotiation, `server/discover`, error codes, and unsupported-method/version behavior;
3. Vona `//mcp` route resolution, POST/GET/DELETE mapping, route-level request/response interceptor overrides, native response ownership, and parser limits;
4. request-context lifetime across JSON and SSE responses, disconnect cancellation, and concurrent stateless calls;
5. Host/Origin handling without moving OAuth, resource metadata, or host-to-instance authority out of DEC-MCP-03/04;
6. ATP updates and a bounded execution dossier before adding the package, route, or source.

No item above is runtime evidence. Planning audit and chart checks cannot accept this ADR or prove protocol/security behavior.

## References

- [MCP Streamable HTTP, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP base request metadata](https://modelcontextprotocol.io/specification/2026-07-28/basic/index#_meta)
- [MCP versioning](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)
- [MCP server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover)
- [MCP server tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [TypeScript SDK HTTP serving guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/http.md)
- [Vona Swagger root-path precedent](../../../vona/src/suite-vendor/a-vona/modules/a-swagger/src/controller/swagger.ts)
