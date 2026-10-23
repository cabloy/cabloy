# ADR 0001: Establish A-MCP Suite Boundaries

## Status

Accepted

The 2026-10-04 WBS-MCP-10-01 decision accepts the overall suite and first-increment boundary. A subsequent explicit naming/layout revision supersedes the initial `providerId=a` vendor-suite identity: the accepted target is now `providerId=cabloy`, normal suite `cabloy-mcp`, initial module `cabloy-mcp`, and no new MCP resource-module-owned persistence in the first increment. On 2026-10-05, DEC-MCP-01's structural scaffold, application discovery, generated registration, dependency ownership, and default-off configuration design were explicitly accepted. Transport, OAuth, host trust, catalog policy, dispatch isolation, and operational decisions were left open under DEC-MCP-02 through DEC-MCP-08 by this ADR; DEC-MCP-02's transport design was separately accepted in ADR 0002 on 2026-10-07. The later [ADR 0009](./0009-mcp-as-state-boundary.md) revises DEC-MCP-09 to permit AS-owned shared authorization state and separately selects a single database-backed atomic-commit authority and Zova-presented, AS-controlled browser-flow **design direction** without approving a physical store, Zova site/admission, browser implementation or schema; the initial `cabloy-mcp` scaffold remains schema-free. This acceptance is not approval of source creation, ATP execution, provider configuration, or release.

## 2026-10-17 user-directed bounded supersession

The user explicitly supersedes **only** DEC-MCP-01's default-off / literal-`true` application-opt-in activation rule. The module's `src/config/config.ts` now owns `enabled: app.meta.env.CABLOY_MCP_ENABLED !== 'false'`: it is enabled by default, and only the literal string `false` disables it. Unset, empty, `true`, and other non-`false` values leave the module flag enabled. Remove the standard application-level MCP `enabled` environment mapping from `vona/src/backend/config/config/config.ts`; the generic framework merge of application overrides in `config.modules['cabloy-mcp']` after module defaults remains supported, but is not a standard MCP environment mapping or an application-opt-in requirement.

This is a bounded user-directed authority supersession, not a retroactive change to the 2026-10-04/05 acceptance history below. Default enablement is **not** readiness, endpoint exposure approval, tool enablement or dispatch authority: missing/invalid OAuth, trusted host/instance binding, registry, policy and required operational controls remain fail-closed. Remaining ADR/WBS/security gates and ATP/release proof are unchanged; proposed ADRs remain proposed and no ATP is closed.

## Background

External AI applications need a controlled way to reach selected Cabloy business capabilities. Existing Vona controllers, DTOs, OpenAPI metadata, Passport, instance isolation, RBAC, resource ownership, guards, AOP, transactions, and audit behavior already define the business system. The proposed `cabloy-mcp` capability must expose that system without creating a parallel domain API, bypassing authorization, or treating an OAuth connection as a tenant or user authority.

Discovery of this Cabloy Basic checkout found existing normal suites under `vona/src/suite/`, but no `cabloy-mcp` suite/module source or package-name collision at revision `8ead4de3204028652ab1612603c4a49484c17872`. That discovery was a historical pre-scaffold observation, not current topology: initial source/configuration and application integration now exist under separately approved bounded increments recorded in the [phase-20 index](../evidence/phase-20/index.md). They do not prove endpoint readiness or ATP acceptance. This ADR records the accepted overall boundary and remaining design gates; it does not authorize scaffolding, provider configuration, deployment, or acceptance execution.

## Problem

A naive MCP bridge could expose every Swagger operation as a tool, trust generic bearer authentication, infer instance from an overridable header/query, reuse a parent executor context, or forward arbitrary route/header options. That would risk cross-instance access, confused-deputy behavior, Passport leakage, unsafe side effects, schema drift, and loss of existing controller guards. OpenAPI also does not by itself encode stable globally unique tool names, MCP-compatible content shapes, current subject authorization, data scope, or side-effect risk.

## Decision

The overall ownership and first-increment boundary below is accepted. Exact integration designs remain subject to the specific gates listed under Implementation Decision Gates; acceptance does not make planned source or commands observed.

### Suite and module ownership

The accepted revised identity is `providerId=cabloy`, Vona normal suite `cabloy-mcp` (`vona-suite-cabloy-mcp`), and first capability module `cabloy-mcp` (`vona-module-cabloy-mcp`). The original `providerId=a`, vendor suite/module `a-mcp`, and `src/suite-vendor` placement are superseded as source targets; the planning directory has since moved to `repo-specs/cabloy-mcp/` while the `*-MCP-*` IDs remain unchanged. The source path was a planned addition at the original acceptance; initial scaffold/configuration and application integration now exist as recorded in the [phase-20 index](../evidence/phase-20/index.md):

```text
vona/src/suite/cabloy-mcp/modules/cabloy-mcp/
```

The inspected Vona suite/module sources and manifests had no `cabloy-mcp` naming collision at revision `8ead4de3204028652ab1612603c4a49484c17872`; inspection at `4374e1f3a22b04a1c1cf31f187db6bf517199b05` also found no suite/module source collision. The existing normal-suite workspace and module-discovery layout can contain this shape. The suite-creation CLI defaults to `src/suite`, which matches the revised target. Its not-yet-run status belonged to the original pre-scaffold acceptance; subsequent approved initial scaffold/configuration and integration work is recorded in the phase-20 index.

DEC-MCP-01 accepts this exact **initial scaffold**, not a final runtime dependency set:

- The suite `package.json` uses the Vona generator's ESM composition manifest (`name: vona-suite-cabloy-mcp`, `version: 5.0.0`, `title: cabloy-mcp`, `files: []`) and one module dependency, `"vona-module-cabloy-mcp": "workspace:^"`. The module generator initially inserts `^5.0.0`; the authorized scaffold execution must normalize that local composition entry to `workspace:^` and inspect the result.
- The module `package.json` uses the full Vona generator template (`name: vona-module-cabloy-mcp`, `version: 5.0.0`, `title: cabloy-mcp`, ESM exports/build scripts). Initial ordinary `dependencies` are empty; `vonaModule.dependencies` contains only `"a-vona": "5.0.0"`, a minimum framework-module version, not an npm range. This schema-free **initial `cabloy-mcp` scaffold** adds no `vonaModule.fileVersion` or `meta.version.ts`; separately gated AS-owned shared-state design is governed by [ADR 0009](./0009-mcp-as-state-boundary.md). Existing `a-vona` supplies foundational module dependencies; additional lifecycle edges are introduced only for genuinely required availability/order/version, not every discovered business operation.
- The suite generator owns the suite `package.json` and TypeScript configuration; module creation owns its package/configuration skeleton and adds `modules/cabloy-mcp/tsconfig.build.json` to suite project references. Planned module `src/index.ts` exports generated `src/.metadata/index.ts`; generated registration, module identity, typing, and application dependency outputs are never hand-edited. The authored MCP default belongs in module `src/config/config.ts`; `src/types/` owns public configuration/environment types. Protocol/controller/service/bean/lib filenames are deliberately left to their respective integration decisions.
- Normal-suite workspace globs and Vona module discovery already cover this path. There is no handwritten app suite/module registration list, new workspace glob, or monorepo-root package dependency. The Vona dependency tool will add the local module to the generated Vona application package as `"vona-module-cabloy-mcp": "workspace:^"`; this generated artifact is not the authored activation authority. Existing discovery filters (`PROJECT_DISABLED_SUITES`/`PROJECT_DISABLED_MODULES`) are build/runtime selection controls, not substitutes for MCP endpoint policy.
- The module's configuration contract is `config.modules['cabloy-mcp']`. Under the 2026-10-17 user-directed bounded supersession above, module `src/config/config.ts` owns `enabled: app.meta.env.CABLOY_MCP_ENABLED !== 'false'`, enabled by default and disabled only by the literal string `false`. There is no standard application-level MCP `enabled` environment mapping. Generic application overrides remain supported and merge after module defaults; that framework precedence does not restore the superseded application-opt-in requirement. Module enablement alone never authorizes transport or tool dispatch: missing or invalid OAuth, host/instance, registry, or policy configuration remains fail-closed under the later decisions. Initial configuration and application integration now exist under separately approved increments recorded in the [phase-20 index](../evidence/phase-20/index.md), not as endpoint-readiness or ATP proof.
- Transport SDK/package/version and protocol-specific source/configuration belong to DEC-MCP-02; OAuth resource validation packages and subject integration to DEC-MCP-03; host-instance settings to DEC-MCP-04; catalog/registry to DEC-MCP-05; shape/risk policy to DEC-MCP-06; executor context to DEC-MCP-07; limits/audit/telemetry to DEC-MCP-08. Selected third-party libraries belong in the module's ordinary `dependencies`, and module lifecycle requirements in `vonaModule.dependencies`. A transient `@modelcontextprotocol/server` lockfile dependency from `textlint` is not a selected MCP implementation. This initial empty library list does not assert that runtime MCP needs no libraries. Standalone npm publication of this normal suite/module is outside this decision.

The module owns MCP transport adaptation, protected-resource metadata, OAuth resource validation integration, instance binding policy, candidate catalog projection, MCP metadata, fixed operation registry, dispatch isolation, protocol errors, limits, and MCP audit/telemetry integration.

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

The MCP resource-server increment is JSON tool discovery/call with bounded result/error adaptation, rate limits, redacted audit/telemetry, and endpoint/tool disablement. It has no Zova module, Web/Admin page, independent SSR site, MCP resources/prompts, or new **MCP resource-module-owned** registry, consent, or audit persistence. Identity, authorization, business persistence, and any available platform audit/telemetry owner remain the existing authorities; the exact audit sink and retention are still `TODO(confirm)`. [ADR 0009](./0009-mcp-as-state-boundary.md) selects a single AS-owned database-backed authority with same-commit code consumption/token activation and a Zova-presented, AS-controlled browser grant-flow direction for integrated `a-auth` design only, not an approved physical store, site/admission, UI implementation, schema, remembered consent, or migration. A future user or operator management UI, independent site, durable consent store, persisted MCP registry, or new durable MCP audit model requires a separate decision. The initial `cabloy-mcp` scaffold is schema-free; ask about the owning module's `vonaModule.fileVersion` strategy before any later persisted schema edit.

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

Before the relevant implementation increments begin, resolve and record the remaining integration decisions. DEC-MCP-01 resolves structural ownership and the initial scaffold only; it does not settle or authorize later dependency versions or runtime exposure:

1. DEC-MCP-01's initial manifest, discovery/generated registration and dependency ownership are accepted above; its original default-off/literal-`true` application-opt-in rule is superseded only as explicitly recorded on 2026-10-17. Initial source/configuration and application integration now exist under separately approved increments in the phase-20 index. Remaining proof must verify module-owned `enabled: app.meta.env.CABLOY_MCP_ENABLED !== 'false'`, the absence of the standard application MCP `enabled` environment mapping, generic framework application override precedence and independent fail-closed readiness. This ADR grants no further source execution or ATP closure;
2. selected MCP transport implementation, supported protocol version, endpoint route, session/stateless mode, and protected-resource metadata locations;
3. OAuth authorization-server/resource-server owner, issuer, JWKS/introspection, resource/audience identifier, client registration, scope vocabulary, subject mapping, key rotation, and outage behavior;
4. trusted host/proxy model, canonical host-to-instance mapping, forwarded-host handling, selector conflict policy, and token-instance consistency rules;
5. MCP decorator/metadata API, metadata merge order, stable naming/collision policy, catalog freshness, and generated/in-memory registry lifecycle (no MCP-owned registry persistence in the first increment);
6. JSON eligibility, unsupported content/status handling, side-effect/risk/confirmation classification, and destructive-operation policy;
7. request-context/Passport construction and executor option isolation, including timeout, cancellation, idempotency, and non-retry rules;
8. limit dimensions, audit/telemetry sink and retention, redaction policy, and operational ownership;
9. for AS-owned shared state, follow ADR 0009's selected database-backed same-commit atomicity and Zova-presentation directions and separately decide its physical module/store/schema, site/admission, browser interaction, retention and consistency; if any task proposes schema work, ask whether the owning `vonaModule.fileVersion` is incremented before editing the migration path, and require a separate boundary change for new MCP resource-module persistence;
10. a separate bounded `cabloy-spec-execution` dossier with explicit source/scaffolding/provider/runtime authorization for the selected implementation task.

## Accepted independent test-business ownership (2026-10-23)

`zhennann` explicitly approved the bounded `mcp-test` migration plan at clean `9f98519ebec9e025197d92005916e02f918e459a`. Add dev/test-only `mcp-test` within this suite, depending on `cabloy-mcp`, never the reverse. It owns the synthetic read-only catalog fixture, DTO/controller/service and local business composition; generic MCP remains business-independent. No Entity/Model, schema, seed or `fileVersion` is added. This is not a second production Commerce or identity authority. The initial single-module scaffold above remains historical. [ADR 0002](./0002-mcp-transport.md#accepted-independent-mcp-test-migration-2026-10-23) defines the finite connected delivery and unchanged security limits; later shopping/persistence requires its own bounded approval.

## Related Records

- [A-MCP planning index](../README.md)
- [A-MCP PRD](../prd.md)
- [A-MCP SRS](../srs.md)
- [A-MCP PDP/WBS](../pdp-wbs.md)
- [A-MCP test plan](../test-plan.md)
- [Repository-native planning ADR](../../../repo-docs-internal/decisions/0010-repository-native-planning-documents.md)
- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
