# A-MCP Internal Planning

This `repo-specs/cabloy-mcp/` directory retains the existing `MCP` requirement, WBS, and ATP IDs for the planned `cabloy-mcp` normal Vona suite. It is maintainer-facing planning material, not end-user documentation, source implementation, or execution authorization. ADR 0001 accepts the overall first-increment boundary and DEC-MCP-01's initial structural/configuration design; DEC-MCP-02 through DEC-MCP-08 remain gated.

## Reading Order

1. [Product Requirements Document](./prd.md) defines the external-AI access outcome, actors, scope, and product acceptance.
2. [Software Requirements Specification](./srs.md) defines the remote MCP transport, OAuth resource-server boundary, instance binding, tool catalog, dispatch, authorization, privacy, and operational contracts.
3. [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md) sequences design gates, implementation work, contract-loop work, and release hardening.
4. [Test Strategy and Acceptance Plan](./test-plan.md) defines executable `ATP-MCP-*` scenarios, fixtures, redaction, and release proof.
5. [Delivery Progress](./progress.md) records derived status, blockers, and future evidence; it does not redefine requirements or contracts.
6. [Implementation roadmap](./implementation-gantt.svg) is a generated, non-authoritative WBS/dependency/status view.
7. [Implementation scope-count burndown](./implementation-burndown.svg) is a generated scope-count reference, not a calendar forecast.
8. [ADR 0001](./decisions/0001-mcp-suite-boundaries.md) records the accepted overall suite, security, ownership, and first-increment boundaries while retaining specific implementation design gates.
9. [ADR 0002 (proposed)](./decisions/0002-mcp-transport.md) drafts the current-profile Streamable HTTP boundary without accepting DEC-MCP-02 or authorizing source.
10. [Threat model and policy matrix (draft)](./threat-model.md) maps first-increment threats to fail-closed controls and open design gates; it does not accept DEC-MCP-02–08 or close WBS-MCP-10-02.
11. [ADR 0003 (proposed)](./decisions/0003-mcp-oauth-resource-server.md) drafts the OAuth protected-resource boundary without selecting a provider or authorizing configuration.

## Product and Technical Baseline

| Concern             | Baseline and status                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository edition  | Observed existing: Cabloy Basic (`__CABLOY_BASIC__`).                                                                                                                                                                                                                                                                                                                      |
| Suite identity      | Revised accepted name, proposed new source: `providerId=cabloy`, Vona normal suite `cabloy-mcp` (`vona-suite-cabloy-mcp`) under `vona/src/suite/cabloy-mcp/`; no source suite or package-name collision was found in inspected source/manifests at `8ead4de320`. The earlier `a-mcp` vendor-suite target is superseded.                                                    |
| Module identity     | Accepted DEC-MCP-01 initial scaffold, source not yet created: first module `cabloy-mcp` (`vona-module-cabloy-mcp`) at `5.0.0`; the suite is also `5.0.0` and depends on the module through `workspace:^`. Later protocol/OAuth library versions remain gated.                                                                                                              |
| Product outcome     | Let authorized external AI applications discover and invoke selected Cabloy business capabilities through a standards-based remote MCP endpoint.                                                                                                                                                                                                                           |
| Transport           | Accepted first-increment boundary: remote MCP Streamable HTTP, not local stdio. ADR 0002 proposes the 2026-07-28 modern-only POST profile, native Vona route integration, and no legacy session/GET/DELETE behavior; it remains unaccepted and requires DEC-MCP-02 review.                                                                                                 |
| Identity            | Accepted boundary: standards-based OAuth resource-server validation per request. ADR 0003 proposes an external issuer with signed JWT/JWKS validation and deterministic local `(issuer, sub, instance)` mapping; it remains unaccepted, and issuer/resource/owner/configuration are still `TODO(confirm)`. Existing Cabloy OAuth login is not an MCP authorization server. |
| Tenant/instance     | Reuse the active Vona instance as tenant. The MCP host/domain is the intended default binding, subject to trusted-host and token-instance consistency checks.                                                                                                                                                                                                              |
| Tool source         | Use generated OpenAPI/DTO metadata as a candidate source, then apply MCP eligibility, metadata, policy, and server-owned registry checks.                                                                                                                                                                                                                                  |
| Dispatch            | Accepted boundary: a planned adapter calls the existing controller route through `bean.executor.performAction(...)` with `innerAccess: false`; exact isolation and options remain design gates.                                                                                                                                                                            |
| First increment     | Accepted scope: JSON-compatible request/response tools with explicit authorization, audit, rate limits, redacted errors, and safe exclusions for multipart, binary, streaming, redirects, raw bodies, and unsafe/unclassified operations.                                                                                                                                  |
| Audiences and sites | Accepted first-increment no-site design: no Zova page or independent SSR site. The capability is a Vona-serving remote endpoint; any later Admin/Web operator UI requires a separate decision.                                                                                                                                                                             |
| Persistence         | First increment adds no MCP-owned registry, consent, or audit persistence; reuse existing identity, RBAC, instance, business-resource, and platform audit owners. Any later schema change needs its own decision and fileVersion gate.                                                                                                                                     |
| Activation          | Existing normal-suite discovery and generated registration cover the planned module; no handwritten app registration. Module defaults own `enabled: false`, with application overrides at `config.modules['cabloy-mcp']`; only a literal `CABLOY_MCP_ENABLED=true` application value may opt in, and missing required security configuration still fails closed.           |
| Decision status     | ADR 0001 is `Accepted` for the overall boundary and DEC-MCP-01's initial manifest, discovery, dependency ownership, and default-off configuration design. DEC-MCP-02 through DEC-MCP-08 and separate source execution remain open.                                                                                                                                         |

## Current or Intended Topology

Existing normal Vona suites include `cabloy-basic`. No `cabloy-mcp` suite/module or package-name collision was observed at the inspected revisions. The accepted new-source target fits the existing normal-suite workspace/discovery layout:

```text
vona/src/suite/cabloy-mcp/
└── modules/cabloy-mcp/
```

The suite generator defaults to `src/suite`, matching this target, but has not been run. DEC-MCP-01 fixes the initial `5.0.0` manifests: the suite composes `vona-module-cabloy-mcp` via `workspace:^`; the module starts with empty library `dependencies`, `vonaModule.dependencies` containing only `a-vona: 5.0.0`, and no `fileVersion` or `meta.version.ts`. The CLI-generated project references, metadata, module registration, and application dependency are not handwritten. Module `src/config/config.ts` owns typed default-off configuration; application `vona/src/backend/config/config/config.ts` owns explicit environment overrides. Generator output and activation behavior must be inspected only in a separately approved scaffold execution. MCP SDK/OAuth libraries and protocol/controller/bean/service layout remain DEC-MCP-02 through DEC-MCP-08 decisions, not current runnable paths. The module must not create a new tenant, Passport, RBAC, or business-resource authority. It owns MCP transport adaptation, discovery projection, policy enforcement, dispatch isolation, and protocol-facing errors; existing domain modules retain business authorization and persistence ownership.

## Document Authority

- The PRD owns external-AI product outcomes, scope, user journeys, and product acceptance.
- The SRS owns MCP/OAuth/instance/API/tool/dispatch/security/privacy/operational contracts and technical acceptance.
- The PDP/WBS owns delivery order, dependencies, implementation tasks, and completion checks.
- The test plan owns executable acceptance scenarios, evidence format, and release proof.
- ADR 0001 owns the accepted overall suite boundary, naming, no-new-persistence choice, DEC-MCP-01 structural/configuration design, and first-increment trade-offs; DEC-MCP-02 through DEC-MCP-08 remain unaccepted integration designs.
- Progress is derived status only and cannot upgrade a proposed decision or claim evidence.

When records disagree, update the document that owns the fact first, then update downstream traceability and derived views. A static audit or generated chart does not close ADR 0001's remaining design gates, create source, or prove a security control.

## Traceability Chain and Status Rules

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

Exact declaration-level links use `PRD-MCP-*`, `SRS-MCP-*`, `WBS-MCP-*`, and `ATP-MCP-*` identifiers. Ranges and wildcard summaries do not define records. New delivery rows start as `not-started`, `deferred`, or `blocked`; no implementation or ATP evidence is claimed in this baseline. Evidence must be synthetic or redacted and include source revision, environment, exact procedure, observed result, and durable artifact location before any item can be `verified`.

## Related Framework Records

- [Suite and module guidance](../../repo-docs/fullstack/suites-and-modules.md)
- [Backend Auth Guide](../../repo-docs/backend/auth-guide.md)
- [Controller AOP Guide](../../repo-docs/backend/controller-aop-guide.md)
- [Backend Cache Guide](../../repo-docs/backend/cache-guide.md)
- [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP server tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
