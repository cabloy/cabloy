# A-MCP Internal Planning

This directory records the proposed product, system, delivery, and acceptance baseline for the `a-mcp` vendor suite. It is maintainer-facing planning material, not end-user documentation, source implementation, an accepted architecture decision, or execution authorization.

## Reading Order

1. [Product Requirements Document](./prd.md) defines the external-AI access outcome, actors, scope, and product acceptance.
2. [Software Requirements Specification](./srs.md) defines the remote MCP transport, OAuth resource-server boundary, instance binding, tool catalog, dispatch, authorization, privacy, and operational contracts.
3. [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md) sequences design gates, implementation work, contract-loop work, and release hardening.
4. [Test Strategy and Acceptance Plan](./test-plan.md) defines executable `ATP-MCP-*` scenarios, fixtures, redaction, and release proof.
5. [Delivery Progress](./progress.md) records derived status, blockers, and future evidence; it does not redefine requirements or contracts.
6. [Implementation roadmap](./implementation-gantt.svg) is a generated, non-authoritative WBS/dependency/status view; chart generation is pending the planning audit.
7. [Implementation scope-count burndown](./implementation-burndown.svg) is a generated scope-count reference, not a calendar forecast; chart generation is pending the planning audit.
8. [ADR 0001](./decisions/0001-mcp-suite-boundaries.md) records the proposed suite, security, ownership, and first-increment boundaries.

## Product and Technical Baseline

| Concern             | Baseline and status                                                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository edition  | Observed existing: Cabloy Basic (`__CABLOY_BASIC__`).                                                                                                                                                                     |
| Suite identity      | Proposed new: `a-mcp` under `vona/src/suite-vendor/a-mcp/`; no source suite was observed in discovery.                                                                                                                    |
| Module identity     | Proposed new: `a-mcp`, intended under the proposed suite; module manifests and exact generated metadata remain `TODO(confirm)`.                                                                                           |
| Product outcome     | Let authorized external AI applications discover and invoke selected Cabloy business capabilities through a standards-based remote MCP endpoint.                                                                          |
| Transport           | Proposed first increment: MCP Streamable HTTP; local stdio is not in scope. Exact MCP SDK/HTTP adapter remains `TODO(confirm)`.                                                                                           |
| Identity            | Proposed standards-based OAuth resource-server validation per request; existing Cabloy OAuth login is an observed provider capability, not an MCP authorization server.                                                   |
| Tenant/instance     | Reuse the active Vona instance as tenant. The MCP host/domain is the intended default binding, subject to trusted-host and token-instance consistency checks.                                                             |
| Tool source         | Use generated OpenAPI/DTO metadata as a candidate source, then apply MCP eligibility, metadata, policy, and server-owned registry checks.                                                                                 |
| Dispatch            | Proposed adapter calls the existing controller route through `bean.executor.performAction(...)` with `innerAccess: false`; request context and headers must be isolated and server-controlled.                            |
| First increment     | JSON-compatible request/response tools with explicit authorization, audit, rate limits, redacted errors, and safe exclusions for multipart, binary, streaming, redirects, raw bodies, and unsafe/unclassified operations. |
| Audiences and sites | No Zova page or independent SSR site is proposed. The capability is a Vona-serving remote endpoint; any later admin/web operator UI requires a separate decision.                                                         |
| Persistence         | Reuse existing identity, RBAC, tenant, and business-resource ownership. New persisted MCP registry, consent, or audit fields are `TODO(confirm)` and require the fileVersion decision gate.                               |
| Decision status     | ADR 0001 is `Proposed`; generation approval, design/ADR approval, and execution approval remain separate.                                                                                                                 |

## Current or Intended Topology

Observed Vona vendor suites include `a-auth`, `a-cabloy`, `a-captcha`, `a-file`, `a-image`, `a-pay`, `a-test`, and `a-vona`. No `a-mcp` source topology was observed. The proposed target is:

```text
vona/src/suite-vendor/a-mcp/
└── modules/a-mcp/
```

The exact module manifest, controller/bean/service layout, provider registration, and MCP protocol dependency are planned additions, not current runnable paths. The module must not create a new tenant, Passport, RBAC, or business-resource authority. It owns MCP transport adaptation, discovery projection, policy enforcement, dispatch isolation, and protocol-facing errors; existing domain modules retain business authorization and persistence ownership.

## Document Authority

- The PRD owns external-AI product outcomes, scope, user journeys, and product acceptance.
- The SRS owns MCP/OAuth/instance/API/tool/dispatch/security/privacy/operational contracts and technical acceptance.
- The PDP/WBS owns delivery order, dependencies, implementation tasks, and completion checks.
- The test plan owns executable acceptance scenarios, evidence format, and release proof.
- ADR 0001 owns the proposed durable suite boundary and first-increment trade-offs.
- Progress is derived status only and cannot upgrade a proposed decision or claim evidence.

When records disagree, update the document that owns the fact first, then update downstream traceability and derived views. A static audit or generated chart does not accept ADR 0001, create source, or prove a security control.

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
