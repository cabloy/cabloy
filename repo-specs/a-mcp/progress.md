# A-MCP Delivery Progress

## Purpose and Authority

This is the derived execution register for the [A-MCP PDP/WBS](./pdp-wbs.md). It records planning status, blockers, decisions, next proof, and evidence pointers; it does not redefine the [PRD](./prd.md), [SRS](./srs.md), [test plan](./test-plan.md), or [ADR 0001](./decisions/0001-mcp-suite-boundaries.md).

At baseline creation, no `a-mcp` source/module, OAuth deployment, runtime endpoint, implementation, or ATP execution was observed. The current revision is planning-only. No evidence directory or fabricated `EVD-*` record is created.

## Status Definitions

| Status                    | Meaning                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `not-started`             | Defined, but implementation or acceptance evidence has not started.                                                |
| `in-progress`             | Work or verification has started, but closure checks are incomplete.                                               |
| `implementation-complete` | Source work is reported complete, but required ATP or release evidence is incomplete.                              |
| `verified`                | Applicable ATP evidence is retained with revision, environment, procedure, result, and redacted artifact location. |
| `blocked`                 | A dependency, unresolved decision, or failed gate prevents closure.                                                |
| `waived`                  | A temporary exception is explicitly approved with owner, reason, compensating control, and expiry.                 |
| `deferred`                | Explicitly postponed scope; it is not complete or verified.                                                        |

Creating planning Markdown never makes implementation `implementation-complete` or `verified`.

## Current Delivery Overview

| Scope                                                | Status        | Description                                                                                                                                                 |
| ---------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 10: Planning and durable design gates          | `not-started` | Planning baseline is generated. ADR 0001 remains Proposed; generation, design/ADR, and execution approvals are separate and no implementation has begun.    |
| Phase 20: Transport, OAuth, and instance boundary    | `blocked`     | Blocked for implementation by unresolved OAuth issuer/resource-server owner, concrete transport adapter, trusted proxy/host model, and design/ADR approval. |
| Phase 30: Candidate catalog and authorization policy | `blocked`     | Depends on Phase 20 and unresolved metadata/decorator, registry, naming, and risk-policy design.                                                            |
| Phase 40: Guarded dispatch and isolation             | `blocked`     | Depends on approved module topology, subject/Passport mapping, registry, and executor-context isolation design.                                             |
| Phase 50: Operations and release hardening           | `blocked`     | Depends on all prior phases plus operational sink/retention, limits, configuration, and release approvals.                                                  |
| First increment release                              | `deferred`    | Deferred until all design, implementation, ATP, operational, and release gates close; no production endpoint is claimed.                                    |

## WBS Execution Register

| WBS ID          | Work item                                                            | Status        | Dependencies/blockers                                                                                                              | Evidence                                                       | Next action                                                                          |
| --------------- | -------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `WBS-MCP-10-01` | Freeze suite boundary and delivery decision gates                    | `not-started` | Proposed `a-mcp` suite/module is not source-observed; concrete identity/manifest collision and ADR acceptance remain open.         | None; planning only.                                           | Obtain design confirmation for identity, topology, persistence, and ADR boundary.    |
| `WBS-MCP-10-02` | Complete MCP threat model and policy matrix                          | `not-started` | OAuth/host trust, subject mapping, tool risk, confirmation, limits, and redaction owners remain `TODO(confirm)`.                   | None; planning only.                                           | Approve threat model and policy matrix as a design deliverable.                      |
| `WBS-MCP-20-01` | Establish remote MCP transport boundary                              | `blocked`     | Requires WBS-MCP-10-01/02, selected SDK/adapter, protocol version, route, session mode, and resource metadata design.              | None; no endpoint exists.                                      | Approve concrete transport design, then create bounded execution dossier.            |
| `WBS-MCP-20-02` | Integrate OAuth resource-server validation and local subject mapping | `blocked`     | Requires approved OAuth issuer/resource-server owner, token validation mechanism, subject mapping, and instance identity contract. | None; existing auth-oauth is not MCP resource-server evidence. | Decide issuer/JWKS or introspection, resource audience, mapping, and failure policy. |
| `WBS-MCP-20-03` | Bind endpoint hosts to Vona instances                                | `blocked`     | Requires trusted proxy/forwarded-host model, host-instance configuration, token claim policy, and conflict handling.               | None; generic resolver observation is not MCP binding proof.   | Approve canonical host and instance-binding design.                                  |
| `WBS-MCP-30-01` | Build DTO/OpenAPI candidate catalog and MCP metadata                 | `blocked`     | Requires module topology, metadata API/decorator design, stable naming, registry freshness, and OpenAPI correlation design.        | None; OpenAPI generation was inspected only.                   | Decide metadata owner/syntax and registry lifecycle.                                 |
| `WBS-MCP-30-02` | Classify tool shapes, risk, and authorization policy                 | `blocked`     | Requires policy matrix and candidate catalog; destructive/side-effect classification and confirmation model remain open.           | None; no MCP candidate catalog exists.                         | Approve first-increment eligibility and risk policy.                                 |
| `WBS-MCP-40-01` | Implement fixed tool-call dispatch                                   | `blocked`     | Requires approved registry, transport/auth context, binding schema, and executor adaptation design.                                | None; `performAction` was inspected, not integrated.           | Approve fixed dispatch and response-adapter contract.                                |
| `WBS-MCP-40-02` | Prove request-context, Passport, and side-effect isolation           | `blocked`     | Requires request-context factory and local subject/Passport mapping; no source or test harness exists.                             | None; no runtime execution.                                    | Define isolated context implementation and explicit competing test fixtures.         |
| `WBS-MCP-50-01` | Add limits, audit, telemetry, and redaction                          | `blocked`     | Requires operational sink/retention owner, rate-limit dimensions, timeout policy, and privacy/redaction contract.                  | None; no runtime execution.                                    | Approve operational and evidence policy.                                             |
| `WBS-MCP-50-02` | Establish disablement, configuration, and release closure            | `blocked`     | Requires all predecessor implementation/ATP evidence and production config/secret/host approvals.                                  | None; no release evidence.                                     | Prepare a bounded release dossier after predecessor closure.                         |

## Open Decision Register

| ID           | Decision                                                                  | Status          | Impacted WBS                                       | Required follow-up                                                                                                            |
| ------------ | ------------------------------------------------------------------------- | --------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `DEC-MCP-01` | Suite/module identity and exact source topology                           | `proposed`      | `WBS-MCP-10-01`, all implementation phases         | Confirm `a-mcp` naming, module manifest location, provider/module registration, and collision checks.                         |
| `DEC-MCP-02` | MCP Streamable HTTP adapter, protocol version, endpoint, and session mode | `proposed`      | `WBS-MCP-20-01`                                    | Select SDK/adapter and document route, negotiation, session, cancellation, and protocol support.                              |
| `DEC-MCP-03` | OAuth authorization-server/resource-server ownership and token validation | `proposed`      | `WBS-MCP-20-02`                                    | Select issuer, JWKS/introspection, resource/audience, client registration, scopes, key rotation, and outage behavior.         |
| `DEC-MCP-04` | Host/domain to instance binding and trusted proxy policy                  | `proposed`      | `WBS-MCP-20-03`                                    | Define canonical host mapping, forwarded-host trust, selector conflict behavior, and token-instance claim policy.             |
| `DEC-MCP-05` | MCP metadata/exclusion and stable tool registry design                    | `proposed`      | `WBS-MCP-30-01`                                    | Decide decorator/metadata symbols, naming, registry freshness, persistence/in-memory lifecycle, and API exclusion precedence. |
| `DEC-MCP-06` | First-increment eligibility, risk, confirmation, and result-shape policy  | `proposed`      | `WBS-MCP-30-02`, `WBS-MCP-40-01`                   | Approve JSON-only boundary, unsafe-shape exclusions, side-effect classification, and destructive operation policy.            |
| `DEC-MCP-07` | Request-context/Passport isolation and executor adaptation                | `proposed`      | `WBS-MCP-40-01`, `WBS-MCP-40-02`                   | Define fresh context creation, local subject projection, server-owned options, and concurrency proof.                         |
| `DEC-MCP-08` | Limits, audit/telemetry ownership, retention, and redaction               | `proposed`      | `WBS-MCP-50-01`                                    | Set limit dimensions/windows, timeout, event fields, sinks, retention, and evidence redaction.                                |
| `DEC-MCP-09` | Persistence and `vonaModule.fileVersion` strategy                         | `not-triggered` | Any task introducing registry/consent/audit schema | If persisted fields are needed, ask whether to increment fileVersion before schema/migration work.                            |
| `DEC-MCP-10` | Zova/UI/site strategy                                                     | `deferred`      | `WBS-MCP-50-02`                                    | No first-increment UI/site. Reopen only with a separate audience/site decision and source-owner validation.                   |

## Current Evidence Index

No evidence records exist. Repository discovery and source reading informed the planning baseline but are not runtime evidence and cannot mark an ATP or WBS task verified. The inspected current-source facts are recorded in the README/SRS as observed facts with their limits.

## Update Rules and Next Steps

1. Keep ADR 0001 Proposed until the concrete durable boundary is explicitly accepted; generation approval alone does not accept it.
2. Resolve DEC-MCP-01 through DEC-MCP-08 before implementation. DEC-MCP-09 remains conditional on persistence; DEC-MCP-10 remains deferred.
3. Obtain a bounded `cabloy-spec-execution` dossier before creating `vona/src/suite-vendor/a-mcp` or configuring an OAuth provider/endpoint.
4. After source exists, inspect the generated manifest and actual CLI command before running module tests or metadata generation; do not list planned commands as current commands.
5. After each implementation increment, update the owning SRS/WBS/ATP authority first, then this register, and reassess any prior evidence.
6. Record actual ATP evidence only with source revision, environment, exact procedure, observed result, and redacted durable artifact location.
7. Run the planning audit and chart freshness checks as separate gates; neither is implementation or security proof.

## Related Records

- [A-MCP planning index](./README.md)
- [A-MCP PRD](./prd.md)
- [A-MCP SRS](./srs.md)
- [A-MCP PDP/WBS](./pdp-wbs.md)
- [A-MCP test plan](./test-plan.md)
- [A-MCP ADR 0001](./decisions/0001-mcp-suite-boundaries.md)
