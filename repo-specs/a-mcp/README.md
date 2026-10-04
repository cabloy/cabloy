# A-MCP Internal Planning

This directory retains the `a-mcp` planning slug and `MCP` IDs for the proposed `cabloy-mcp` normal Vona suite. It is maintainer-facing planning material, not end-user documentation, source implementation, or execution authorization. ADR 0001 accepts only the revised overall first-increment boundary; concrete integration designs remain gated.

## Reading Order

1. [Product Requirements Document](./prd.md) defines the external-AI access outcome, actors, scope, and product acceptance.
2. [Software Requirements Specification](./srs.md) defines the remote MCP transport, OAuth resource-server boundary, instance binding, tool catalog, dispatch, authorization, privacy, and operational contracts.
3. [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md) sequences design gates, implementation work, contract-loop work, and release hardening.
4. [Test Strategy and Acceptance Plan](./test-plan.md) defines executable `ATP-MCP-*` scenarios, fixtures, redaction, and release proof.
5. [Delivery Progress](./progress.md) records derived status, blockers, and future evidence; it does not redefine requirements or contracts.
6. [Implementation roadmap](./implementation-gantt.svg) is a generated, non-authoritative WBS/dependency/status view.
7. [Implementation scope-count burndown](./implementation-burndown.svg) is a generated scope-count reference, not a calendar forecast.
8. [ADR 0001](./decisions/0001-mcp-suite-boundaries.md) records the accepted overall suite, security, ownership, and first-increment boundaries while retaining specific implementation design gates.

## Product and Technical Baseline

| Concern             | Baseline and status                                                                                                                                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository edition  | Observed existing: Cabloy Basic (`__CABLOY_BASIC__`).                                                                                                                                                                                                                                                                   |
| Suite identity      | Revised accepted name, proposed new source: `providerId=cabloy`, Vona normal suite `cabloy-mcp` (`vona-suite-cabloy-mcp`) under `vona/src/suite/cabloy-mcp/`; no source suite or package-name collision was found in inspected source/manifests at `8ead4de320`. The earlier `a-mcp` vendor-suite target is superseded. |
| Module identity     | Revised accepted name, proposed new source: first module `cabloy-mcp` (`vona-module-cabloy-mcp`) under the suite; exact manifest, application activation, dependencies, registration, and generated metadata remain `TODO(confirm)`.                                                                                    |
| Product outcome     | Let authorized external AI applications discover and invoke selected Cabloy business capabilities through a standards-based remote MCP endpoint.                                                                                                                                                                        |
| Transport           | Accepted first-increment boundary: remote MCP Streamable HTTP, not local stdio. Exact protocol version, route, session mode, and SDK/HTTP adapter remain `TODO(confirm)`.                                                                                                                                               |
| Identity            | Accepted boundary: standards-based OAuth resource-server validation per request. The issuer, resource identifier, and integration owner remain `TODO(confirm)`; existing Cabloy OAuth login is not an MCP authorization server.                                                                                         |
| Tenant/instance     | Reuse the active Vona instance as tenant. The MCP host/domain is the intended default binding, subject to trusted-host and token-instance consistency checks.                                                                                                                                                           |
| Tool source         | Use generated OpenAPI/DTO metadata as a candidate source, then apply MCP eligibility, metadata, policy, and server-owned registry checks.                                                                                                                                                                               |
| Dispatch            | Accepted boundary: a planned adapter calls the existing controller route through `bean.executor.performAction(...)` with `innerAccess: false`; exact isolation and options remain design gates.                                                                                                                         |
| First increment     | Accepted scope: JSON-compatible request/response tools with explicit authorization, audit, rate limits, redacted errors, and safe exclusions for multipart, binary, streaming, redirects, raw bodies, and unsafe/unclassified operations.                                                                               |
| Audiences and sites | Accepted first-increment no-site design: no Zova page or independent SSR site. The capability is a Vona-serving remote endpoint; any later Admin/Web operator UI requires a separate decision.                                                                                                                          |
| Persistence         | First increment adds no MCP-owned registry, consent, or audit persistence; reuse existing identity, RBAC, instance, business-resource, and platform audit owners. Any later schema change needs its own decision and fileVersion gate.                                                                                  |
| Decision status     | ADR 0001 is `Accepted` for the overall boundary and naming only; concrete integration gates remain open, and later source execution requires its own dossier.                                                                                                                                                           |

## Current or Intended Topology

Existing normal Vona suites include `cabloy-basic`. No `cabloy-mcp` suite/module or package-name collision was observed. The revised accepted naming targets a proposed normal-suite path supported by the existing workspace/discovery layout; its exact manifest and application activation remain gated:

```text
vona/src/suite/cabloy-mcp/
└── modules/cabloy-mcp/
```

The suite generator defaults to `src/suite`, matching this target, but has not been run. The exact module manifest, controller/bean/service layout, application activation, and MCP protocol dependency are planned additions, not current runnable paths. The module must not create a new tenant, Passport, RBAC, or business-resource authority. It owns MCP transport adaptation, discovery projection, policy enforcement, dispatch isolation, and protocol-facing errors; existing domain modules retain business authorization and persistence ownership.

## Document Authority

- The PRD owns external-AI product outcomes, scope, user journeys, and product acceptance.
- The SRS owns MCP/OAuth/instance/API/tool/dispatch/security/privacy/operational contracts and technical acceptance.
- The PDP/WBS owns delivery order, dependencies, implementation tasks, and completion checks.
- The test plan owns executable acceptance scenarios, evidence format, and release proof.
- ADR 0001 owns the accepted overall suite boundary, naming, no-new-persistence choice, and first-increment trade-offs; its remaining implementation design gates are not accepted values.
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
