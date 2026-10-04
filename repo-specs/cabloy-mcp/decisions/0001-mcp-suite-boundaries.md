# ADR 0001: Establish A-MCP Suite Boundaries

## Status

Accepted

The 2026-10-04 WBS-MCP-10-01 decision accepts only the overall suite and first-increment boundary. A subsequent explicit naming/layout revision supersedes the initial `providerId=a` vendor-suite identity: the accepted target is now `providerId=cabloy`, normal suite `cabloy-mcp`, initial module `cabloy-mcp`, and no new MCP-owned persistence in the first increment. The implementation decision gates remain open; this acceptance is not approval of source creation, ATP execution, provider configuration, or release.

## Background

External AI applications need a controlled way to reach selected Cabloy business capabilities. Existing Vona controllers, DTOs, OpenAPI metadata, Passport, instance isolation, RBAC, resource ownership, guards, AOP, transactions, and audit behavior already define the business system. The proposed `cabloy-mcp` capability must expose that system without creating a parallel domain API, bypassing authorization, or treating an OAuth connection as a tenant or user authority.

Discovery of this Cabloy Basic checkout found existing normal suites under `vona/src/suite/`, but no `cabloy-mcp` suite/module source or package-name collision at revision `8ead4de3204028652ab1612603c4a49484c17872`. The accepted identity targets proposed new source, not an observed current topology. This ADR records the accepted overall boundary and remaining design gates; it does not authorize scaffolding, provider configuration, deployment, or acceptance execution.

## Problem

A naive MCP bridge could expose every Swagger operation as a tool, trust generic bearer authentication, infer instance from an overridable header/query, reuse a parent executor context, or forward arbitrary route/header options. That would risk cross-instance access, confused-deputy behavior, Passport leakage, unsafe side effects, schema drift, and loss of existing controller guards. OpenAPI also does not by itself encode stable globally unique tool names, MCP-compatible content shapes, current subject authorization, data scope, or side-effect risk.

## Decision

The overall ownership and first-increment boundary below is accepted. Exact integration designs remain subject to the specific gates listed under Implementation Decision Gates; acceptance does not make planned source or commands observed.

### Suite and module ownership

The accepted revised identity is `providerId=cabloy`, Vona normal suite `cabloy-mcp` (`vona-suite-cabloy-mcp`), and first capability module `cabloy-mcp` (`vona-module-cabloy-mcp`). The original `providerId=a`, vendor suite/module `a-mcp`, and `src/suite-vendor` placement are superseded as source targets; the planning directory has since moved to `repo-specs/cabloy-mcp/` while the `*-MCP-*` IDs remain unchanged. The intended source path remains a planned addition, not observed source:

```text
vona/src/suite/cabloy-mcp/modules/cabloy-mcp/
```

The inspected Vona suite/module sources and manifests had no `cabloy-mcp` naming collision at revision `8ead4de3204028652ab1612603c4a49484c17872`; the existing normal-suite workspace and module-discovery layout can contain this shape. The suite-creation CLI defaults to `src/suite`, which matches the revised target, but has not been run. The exact manifest contents, application activation, module registration and dependencies, dependency versions, source file topology, and configuration names remain `TODO(confirm)`. The module owns MCP transport adaptation, protected-resource metadata, OAuth resource validation integration, instance binding policy, candidate catalog projection, MCP metadata, fixed operation registry, dispatch isolation, protocol errors, limits, and MCP audit/telemetry integration.

It does not own Cabloy users, Passport, tenants/instances, roles, business resources, domain persistence, controller business rules, or a second CRUD API. Existing modules remain authoritative for those concerns.

### Remote transport and OAuth boundary

The first increment targets a standards-based remote MCP Streamable HTTP server. Local stdio, a Zova SSR site, and an independent MCP frontend are not part of this boundary.

Each request is validated as a protected resource request with an approved OAuth issuer/resource-server arrangement. Issuer, signature/introspection, resource/audience, expiry, subject, and scope are checked per request. Protected-resource metadata identifies the resource and authorization-server discovery. Existing Cabloy OAuth login/provider code may be reused only where its contracts actually satisfy this resource-server requirement; it is not assumed to be a complete MCP OAuth authorization server.

The OAuth subject is mapped to one active local identity in the endpoint-bound instance. OAuth scope, deployment tool policy, local Passport/RBAC, data scope, resource ownership, and operation risk form an intersection. None alone grants unrestricted authority.

### Instance and host binding

The endpoint's trusted host/domain mapping is the intended default instance binding because an MCP client is configured with a particular server URL. The design must account for trusted proxy/forwarded-host behavior and must not permit generic query/header selectors to override the endpoint binding. Conflicting selectors are rejected or ignored according to an explicit policy and are never used to expand scope. Any token instance/resource claim must match the endpoint-bound instance or be covered by an approved authorization relationship; missing claims do not mean unrestricted cross-instance access.

### Candidate catalog and tool governance

Generated Vona DTO/OpenAPI metadata is the candidate contract source. The catalog distinguishes HTTP routes, OpenAPI operations, MCP-compatible candidates, deployment-enabled registry entries, subject-visible tools, and call-time authorized operations.

`@Api.exclude()` is a hard upstream exclusion. A separate MCP metadata mechanism is proposed so an operation may remain in Swagger while being excluded from MCP, and so MCP can add stable names, descriptions, risk/read-only/destructive/idempotency/confirmation annotations, and explicit input/output adapter metadata. Operation IDs are not assumed globally unique; the server-owned registry performs deterministic naming and collision checks.

The default candidate policy is conservative rather than “every Swagger operation is callable.” JSON-compatible ordinary request/response operations may become candidates after policy review. Multipart, raw body, binary, redirect, streaming, unsupported statuses/envelopes, arbitrary URL/host operations, callbacks, and unclassified or high-impact side effects are excluded or require separately approved adapters. HTTP GET is not treated as read-only by itself.

### Fixed guarded dispatch

A tool call resolves only a server-owned registry entry containing one known controller method/path, schema, mapping, risk policy, and adapter. The adapter invokes the existing executor path with `innerAccess: false` so downstream controller guards/AOP remain active. The caller cannot supply method, URL, route, authorization, cookies, forwarding headers, host/origin, tenant/instance, `innerAccess`, middleware onions, executor state, or arbitrary auth token.

Before dispatch, the MCP layer performs OAuth validation, instance binding, request limits, argument validation, tool policy, audit context, and local subject establishment. The executor's existing context delegation and Passport behavior must not be relied on to replace an existing identity: each MCP request receives a fresh request-owned context and Passport mapping. Concurrent requests must not share mutable state, headers, Passport, or security decisions.

### First-increment scope

The first increment is JSON tool discovery/call with bounded result/error adaptation, rate limits, redacted audit/telemetry, and endpoint/tool disablement. It has no Zova module, Web/Admin page, independent SSR site, MCP resources/prompts, or new MCP-owned registry, consent, or audit persistence. Identity, authorization, business persistence, and any available platform audit/telemetry owner remain the existing authorities; the exact audit sink and retention are still `TODO(confirm)`. A future user or operator UI, independent site, durable consent store, persisted registry, or new durable audit model requires a separate decision or superseding ADR. The `vonaModule.fileVersion` choice is not triggered by this no-schema increment; ask before any later persisted schema change.

## Alternatives Deferred

- **Expose every OpenAPI operation directly:** deferred because OpenAPI is a candidate schema source, not a complete MCP safety, identity, risk, or authorization policy.
- **Reuse `@Api.exclude()` as the only MCP exclusion:** deferred because MCP visibility may need to differ from Swagger visibility, while an existing API exclusion must remain authoritative.
- **Trust MCP URL domain without overriding generic selectors or checking tokens:** deferred because host/proxy/query/header resolution and token claims can disagree; the binding must be explicit and fail closed.
- **Use `innerAccess: true` or direct service calls:** rejected for the first boundary because trusted inner access can bypass downstream guards, while direct service calls would bypass the existing controller contract and AOP path. A later operation-specific service adapter would require a separate decision.
- **Create a new MCP user/tenant/RBAC model:** rejected because it would duplicate and potentially diverge from Cabloy identity and resource authorization.
- **Build a Zova Admin/Web management site in the first increment:** deferred because the requested product outcome is external AI access, not a UI, and no observed independent site owner is required.
- **Treat existing `auth-oauth` login as the MCP OAuth authorization server:** rejected as an assumption; integration is allowed only after resource-server and protected-resource contracts are verified.

## Consequences

- The suite can expose many existing operations without duplicating domain DTOs or business persistence, but every candidate needs metadata, shape, risk, and policy classification.
- MCP list visibility and call authorization are separate computations; catalog caching must not carry subject-specific authority across requests.
- The implementation must invest in a secure context/Passport factory because nested executor state can be shared and an existing Passport can prevent token revalidation.
- Endpoint configuration must explicitly own host/instance and OAuth resource identity; domain configuration alone is not an authorization proof.
- The first increment is narrower than the total OpenAPI surface and requires explicit future adapters for binary, multipart, streaming, and high-impact operations.
- Operational observability, redaction, rate limiting, and disablement are release requirements, not optional polish.
- If persistence is later added, the module/fileVersion/migration decision must be made before schema changes; schema work triggers the repository's full test requirement.
- This ADR acceptance creates no source or provider. Each implementation task still requires its predecessor and design gates, then a separately approved bounded execution dossier.

## Implementation Decision Gates

Before implementation begins, resolve and record (the accepted overall boundary and naming do not settle the remaining design inputs):

1. `TODO(confirm)` the exact `cabloy-mcp` module manifest, application activation, registration, dependencies, and configuration topology; the revised name/layout collision check has passed, but the planned source does not exist;
2. selected MCP transport implementation, supported protocol version, endpoint route, session/stateless mode, and protected-resource metadata locations;
3. OAuth authorization-server/resource-server owner, issuer, JWKS/introspection, resource/audience identifier, client registration, scope vocabulary, subject mapping, key rotation, and outage behavior;
4. trusted host/proxy model, canonical host-to-instance mapping, forwarded-host handling, selector conflict policy, and token-instance consistency rules;
5. MCP decorator/metadata API, metadata merge order, stable naming/collision policy, catalog freshness, and generated/in-memory registry lifecycle (no MCP-owned registry persistence in the first increment);
6. JSON eligibility, unsupported content/status handling, side-effect/risk/confirmation classification, and destructive-operation policy;
7. request-context/Passport construction and executor option isolation, including timeout, cancellation, idempotency, and non-retry rules;
8. limit dimensions, audit/telemetry sink and retention, redaction policy, and operational ownership;
9. if a later task proposes schema work, reopen the first-increment no-persistence boundary and ask whether `vonaModule.fileVersion` is incremented before editing the migration path;
10. a separate bounded `cabloy-spec-execution` dossier with explicit source/scaffolding/provider/runtime authorization for the selected implementation task.

## Related Records

- [A-MCP planning index](../README.md)
- [A-MCP PRD](../prd.md)
- [A-MCP SRS](../srs.md)
- [A-MCP PDP/WBS](../pdp-wbs.md)
- [A-MCP test plan](../test-plan.md)
- [Repository-native planning ADR](../../../repo-docs-internal/decisions/0010-repository-native-planning-documents.md)
- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
