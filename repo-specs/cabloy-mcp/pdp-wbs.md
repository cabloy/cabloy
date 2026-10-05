# A-MCP Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver a security-first remote MCP capability for Cabloy Basic that lets an authorized external AI application discover and invoke a reviewed subset of existing business controller operations. The delivery must preserve Vona identity, instance, RBAC, data-scope, DTO/OpenAPI, controller guard, transaction, audit, and resource ownership boundaries. This plan covers the revised accepted overall `cabloy-mcp` normal-suite/module design, still planned new source; the planning directory is `repo-specs/cabloy-mcp/`, while existing `WBS-MCP-*` IDs remain unchanged. It does not authorize source scaffolding, provider deployment, or production exposure.

## Delivery Principles

- Treat the accepted `cabloy-mcp` normal suite and module, including DEC-MCP-01's initial manifest/discovery/default-off configuration design, as planned new source until a separate bounded execution dossier is approved; do not claim source exists or that later integration gates are decided.
- Establish the OAuth resource-server and trusted host/instance boundary before exposing tools.
- Use Vona/OpenAPI/DTO contract truth first; generate a candidate catalog, then apply independent MCP metadata, risk, representation, and deployment policy.
- Keep a server-owned immutable operation registry. Never map an untrusted tool name or argument to an arbitrary route.
- Dispatch through the existing executor with explicit `innerAccess: false`, preserving normal guards/AOP while establishing an isolated MCP request context first.
- Keep OAuth scope, local Passport/RBAC, instance, data scope, and deployment tool policy as an intersection, not interchangeable authority.
- Deliver JSON-compatible tools first; defer multipart, binary, raw-body, redirect, streaming, and unclassified side effects.
- Prove competing operations through separate `mockCtx(...)` boundaries and explicit combined durable assertions, not test-runner scheduling.
- Do not add persistence or change `meta.version.ts` without first deciding the fileVersion strategy; any such change requires the full root test path.
- Distinguish implementation completion, ATP evidence, ADR acceptance, and production release approval.

## Work Breakdown Structure

### Phase 10: Planning and durable design gates

Dependencies: none.

#### WBS-MCP-10-01: Freeze suite boundary and delivery decision gates

Traceability: `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-02`, `PRD-MCP-CONTRACT-01`, `PRD-MCP-SAFETY-04`, `SRS-MCP-API-01`, `SRS-MCP-UI-01`, `SRS-MCP-OPS-04`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-OPS-02`.

Dependencies: none.

Source areas: `repo-specs/cabloy-mcp/`; observed Vona suite/module topology; `repo-docs/fullstack/suites-and-modules.md`; MCP transport and authorization specifications. The proposed source path is not yet created.

Tasks:

- Confirm the revised `providerId=cabloy`, normal suite `cabloy-mcp`, and initial module `cabloy-mcp` identity and inspect source/manifests for collisions; source creation remains a later task.
- Record ADR 0001's accepted overall ownership boundary, no-Zova first increment, external OAuth resource-server requirement, JSON-only scope, and no new MCP-owned registry/consent/audit persistence.
- Record DEC-MCP-01's accepted initial `5.0.0` suite/module manifests, suite `workspace:^` composition, module's initial `a-vona: 5.0.0` lifecycle dependency, CLI-driven discovery/generated registration, and module-owned `enabled: false` defaults with explicit application opt-in. Leave SDK/OAuth libraries and runtime security settings to their later decisions.
- Record `zhennann` as the accountable owner for DEC-MCP-02 through DEC-MCP-08; keep the design inputs `TODO(confirm)` until each decision is separately resolved.
- Separate generation approval, overall design/ADR acceptance, concrete implementation design gates, and execution approval.
- If a later increment proposes a persisted registry, consent, or audit model, reopen the persistence decision and ask about `vonaModule.fileVersion` before schema work.

Acceptance checks:

- ADR 0001 records explicit acceptance of the overall boundary, names, and DEC-MCP-01 initial structural/configuration design only; DEC-MCP-02 through DEC-MCP-08 remain gated.
- No planning record claims that the source suite/module, endpoint, OAuth provider, or runnable command already exists.
- Every material design gate has a recorded accountable owner and a bounded downstream WBS dependency; do not infer the owner from package authorship.

#### WBS-MCP-10-02: Complete MCP threat model and policy matrix

Traceability: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-02`, `PRD-MCP-IDENTITY-03`, `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-01`, `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-NFR-01`, `SRS-MCP-NFR-02`, `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`, `ATP-MCP-INSTANCE-01`, `ATP-MCP-CONTRACT-03`, `ATP-MCP-CALL-02`, `ATP-MCP-CALL-03`, `ATP-MCP-OPS-01`.

Dependencies: `WBS-MCP-10-01`.

Source areas: proposed `cabloy-mcp` security boundary; existing Passport/instance/guard/executor behavior; deployment trust and OAuth documentation. The [draft threat model and policy matrix](./threat-model.md) records candidate controls and open decision gates; it is not accepted closure.

Tasks:

- Model wrong-resource tokens, issuer/JWKS/introspection failure, replay, confused deputy, host/forwarded-host injection, selector conflicts, cross-instance access, Passport leakage, tool/schema injection, output exfiltration, rate abuse, and destructive operations.
- Define the policy matrix for tool visibility, call authorization, risk/confirmation, data minimization, audit, error classes, disablement, and operational limits.
- Identify exact OAuth issuer, resource identifier, subject-to-local mapping, trusted proxy model, and configuration owner as design gates.

Acceptance checks:

- The threat model distinguishes transport authentication, instance binding, local authorization, data scope, and tool policy.
- The policy matrix has fail-closed behavior and does not treat OpenAPI security or HTTP method as sufficient authority/safety classification.
- No unresolved gate is hidden in a downstream implementation task.

### Phase 20: Transport, OAuth, and instance boundary

Dependencies: `WBS-MCP-10-01`, `WBS-MCP-10-02`.

#### WBS-MCP-20-01: Establish the remote MCP transport boundary

Traceability: `PRD-MCP-ACCESS-01`, `SRS-MCP-TRANSPORT-01`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-NFR-03`, `ATP-MCP-TRANSPORT-01`.

Dependencies: `WBS-MCP-10-01`.

Source areas: proposed `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/`; existing Vona router/middleware registration; selected MCP transport implementation. ADR 0002 is the current proposed transport draft; it does not close DEC-MCP-02 or authorize source.

Tasks:

- Select and record the supported Streamable HTTP protocol version, SDK or adapter, route registration, stateless/session mode, content negotiation, request size, timeout, and Origin/Host handling.
- Implement protected-resource metadata and authorization-server discovery integration without exposing secrets or internal topology.
- Define the selected revision's discovery handshake (not necessarily `initialize`), tools/list, tools/call, error, cancellation, and unsupported-feature behavior for the first increment; do not import GET, DELETE, or session behavior from an older revision.

Acceptance checks:

- A valid protocol exchange reaches the MCP boundary without requiring a Zova site.
- Missing, malformed, unsupported, or oversized protocol requests fail safely and do not dispatch a controller.
- Metadata advertises the correct resource identity and approved authorization-server discovery; no session identifier is treated as authorization.

#### WBS-MCP-20-02: Integrate OAuth resource-server validation and local subject mapping

Traceability: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-NFR-01`, `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`.

Dependencies: `WBS-MCP-20-01`.

Source areas: approved OAuth issuer/resource-server integration; existing Vona Passport/user/auth ownership; proposed `cabloy-mcp` authentication service. ADR 0003 is the current proposed OAuth design; it does not select an issuer or authorize provider configuration.

Tasks:

- Validate issuer, signature/introspection, resource/audience, expiry, subject, and scope on every request.
- Map the OAuth subject to an active local Passport-compatible identity in the endpoint instance without reusing an existing unrelated request Passport.
- Define behavior for key rotation, issuer outage, ambiguous mapping, disabled identity, missing scope, and token/resource mismatch.

Acceptance checks:

- Invalid and wrong-resource tokens cannot list or call tools.
- A valid token maps to exactly one permitted local subject or fails closed.
- OAuth scope never expands local RBAC, data scope, or deployment tool policy.

#### WBS-MCP-20-03: Bind endpoint hosts to Vona instances

Traceability: `PRD-MCP-IDENTITY-02`, `SRS-MCP-INSTANCE-01`, `SRS-MCP-INSTANCE-02`, `SRS-MCP-NFR-01`, `ATP-MCP-INSTANCE-01`.

Dependencies: `WBS-MCP-20-02`.

Source areas: existing Vona instance resolver and pre-router middleware; trusted host/proxy configuration; proposed MCP endpoint configuration. [ADR 0004](./decisions/0004-mcp-host-instance-binding.md) drafts the early host-binding mechanism and deployment requirements; it does not accept DEC-MCP-04.

Tasks:

- Define a deployment-owned canonical HTTPS endpoint-host/port → unique OAuth resource → instance mapping, and a comparison for verified token recipient/optional instance claims.
- Decide and implement an early MCP-path-only selection before generic query/header/subdomain fallback or instance initialization; ADR 0004 proposes rejecting any MCP query/header instance selector, even one that matches.
- Validate trusted proxy peers and sanitization of forwarded host/protocol, direct-backend policy, malformed/duplicate authorities, unknown hosts, resource collisions, and cache separation for protected-resource metadata.

Acceptance checks:

- Requests to an unknown, untrusted, or conflicting host fail before unintended instance initialization, tool visibility, metadata disclosure, or business lookup; ordinary non-MCP instance resolution stays unchanged.
- Same-subject tokens cannot cross instances through host, query, header, path, cached context, or tool arguments.
- Real HTTP tests prove trusted proxy behavior and request ordering; `performAction()` alone is not transport/instance-middleware proof.

### Phase 30: Candidate catalog and authorization policy

Dependencies: `WBS-MCP-20-01`, `WBS-MCP-20-02`, `WBS-MCP-20-03`.

#### WBS-MCP-30-01: Build the DTO/OpenAPI candidate catalog and MCP metadata

Traceability: `PRD-MCP-CONTRACT-01`, `PRD-MCP-CONTRACT-02`, `SRS-MCP-CATALOG-01`, `SRS-MCP-CATALOG-02`, `SRS-MCP-CATALOG-04`, `SRS-MCP-API-01`, `SRS-MCP-API-02`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-CONTRACT-02`.

Dependencies: `WBS-MCP-20-01`.

Source areas: existing OpenAPI generator/DTO metadata; proposed MCP decorator/metadata library; proposed catalog builder and registry.

Tasks:

- Collect OpenAPI JSON internally and correlate operations to controller metadata and fixed route identities.
- Add independent MCP exclusion and metadata mechanisms, including stable name, description, risk, confirmation, idempotency, and adapter declarations.
- Define deterministic naming, collision detection, schema revision/freshness, hard `@Api.exclude()` behavior, and registry output.
- Keep candidate, eligible, enabled, visible, and call-authorized states distinct.

Acceptance checks:

- DTO/OpenAPI schema changes flow into the candidate contract without hand-editing generated consumers.
- MCP exclusion can hide an operation while OpenAPI remains available; an upstream API exclusion cannot be reintroduced.
- Duplicate names, stale entries, unsupported references, and missing operation ownership fail closed and are visible to operators.

#### WBS-MCP-30-02: Classify tool shapes, risk, and authorization policy

Traceability: `PRD-MCP-ACCESS-02`, `PRD-MCP-CONTRACT-03`, `PRD-MCP-IDENTITY-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-AUTH-03`, `SRS-MCP-CATALOG-03`, `SRS-MCP-NFR-01`, `ATP-MCP-AUTH-02`, `ATP-MCP-CONTRACT-03`.

Dependencies: `WBS-MCP-30-01`.

Source areas: candidate catalog; existing controller guards/RBAC/data-scope conventions; deployment policy configuration.

Tasks:

- Classify read-only, mutating, destructive, irreversible, idempotent, sensitive, and confirmation-required behavior independently of HTTP method.
- Exclude or require explicit adapters for multipart, raw body, binary, redirect, streaming, unsupported statuses/envelopes, arbitrary URL inputs, callbacks, and unclassified side effects.
- Define the intersection of OAuth scopes, deployment policy, local Passport/RBAC, data scope, resource ownership, and risk/confirmation rules for list and call.

Acceptance checks:

- A GET with business side effects is not classified read-only by method alone.
- `tools/list` hides disallowed tools and `tools/call` repeats all relevant authorization checks.
- The first catalog contains only representations and operations with a documented safe MCP adapter.

### Phase 40: Guarded dispatch and isolation

Dependencies: `WBS-MCP-30-01`, `WBS-MCP-30-02`.

#### WBS-MCP-40-01: Implement fixed tool-call dispatch

Traceability: `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-AUTH-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `SRS-MCP-DISPATCH-03`, `SRS-MCP-TRANSPORT-03`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-02`.

Dependencies: `WBS-MCP-30-02`.

Source areas: proposed MCP tool-call adapter; `bean.executor.performAction(...)`; existing controller guards/AOP; approved registry.

Tasks:

- Resolve only server-owned tool names and map validated arguments to declared method/path/params/query/body fields.
- Invoke the executor with `innerAccess: false`, server-controlled headers/options, bounded timeout, and no caller-controlled onions/state/authToken.
- Adapt supported Cabloy success envelopes and JSON results to MCP tool results; classify unsupported statuses/shapes and downstream failures safely.
- Reject unknown tools, unknown/dangerous fields, route-like arguments, and caller-supplied authorization/host/cookie/tenant controls.

Acceptance checks:

- A call reaches only its fixed controller route and normal guard/AOP chain.
- Forged method, URL, path, header, tenant, `innerAccess`, onion, or state arguments cannot alter dispatch.
- Successful and rejected calls produce the declared MCP result/error classes without leaking internal details.

#### WBS-MCP-40-02: Prove request-context, Passport, and side-effect isolation

Traceability: `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-DISPATCH-04`, `SRS-MCP-DISPATCH-05`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-NFR-01`, `ATP-MCP-CALL-03`, `ATP-MCP-OPS-01`.

Dependencies: `WBS-MCP-40-01`.

Source areas: proposed request-context factory; existing executor context delegation; Passport state; owning domain transaction/lock services.

Tasks:

- Establish a fresh request context and Passport for every call, with no state/header reference sharing across subjects or instances.
- Define timeout, cancellation, idempotency, transaction, retry, and external-side-effect behavior; do not retry non-idempotent operations automatically.
- Prove concurrent calls using separate `mockCtx(...)` boundaries and explicit durable outcomes.

Acceptance checks:

- Concurrent calls by different subjects cannot observe or mutate each other's Passport, headers, arguments, or audit identity.
- A failure after a domain commit has a documented result/recovery boundary and no false success caused by the adapter.
- No sensitive request/result content appears in ordinary logs or retained artifacts.

### Phase 50: Operations, release hardening, and handoff

Dependencies: `WBS-MCP-40-01`, `WBS-MCP-40-02`.

#### WBS-MCP-50-01: Add limits, audit, telemetry, and redaction

Traceability: `PRD-MCP-SAFETY-03`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-OPS-01`, `SRS-MCP-OPS-02`, `SRS-MCP-TRANSPORT-03`, `SRS-MCP-NFR-02`, `SRS-MCP-NFR-03`, `ATP-MCP-OPS-01`.

Dependencies: `WBS-MCP-40-02`.

Source areas: proposed MCP operational middleware; existing rate-limit/audit/telemetry owners; deployment configuration.

Tasks:

- Enforce request/body/depth/result/concurrency/time/rate limits keyed by approved subject/client/instance/tool dimensions.
- Emit redacted discovery and call audit events with correlation, subject/client pseudonyms, instance, tool/version, outcome, policy class, latency, and safe error class.
- Define protected telemetry retention and verify that tokens, cookies, passwords, hashes, raw sensitive arguments, and usable links are not retained.

Acceptance checks:

- Deliberate limit exceedance is rejected without cross-subject/instance leakage or unintended side effects.
- Success, validation, authorization, downstream, timeout, and internal failures are distinguishable to operators but nondiagnostic to clients.
- Redaction proof covers protocol responses, logs, traces, metrics, and test evidence.

#### WBS-MCP-50-02: Establish disablement, configuration, and release closure

Traceability: `PRD-MCP-SAFETY-04`, `SRS-MCP-OPS-03`, `SRS-MCP-OPS-04`, `SRS-MCP-UI-01`, `SRS-MCP-UI-02`, `ATP-MCP-OPS-02`.

Dependencies: `WBS-MCP-50-01`.

Source areas: proposed module configuration/registration; existing deployment/configuration ownership; root contract/test commands.

Tasks:

- Provide fail-closed endpoint and per-tool disablement without weakening ordinary HTTP API behavior.
- Validate configuration ownership for issuer, keys, resource metadata, host-instance bindings, tool enablement, limits, and audit sinks; keep secrets outside planning/source records.
- Run the narrow contract loop and applicable type/test/lint/format checks after implementation; if frontend/site scope changes later, use paired flavor builds and `npm run deps:vona`.
- Prepare a bounded release dossier containing ATP results, revision/environment/procedure/artifact references, unresolved waivers, and production approval.

Acceptance checks:

- Missing OAuth/host/registry/adapter configuration disables the affected MCP surface and never invokes a business controller.
- Ordinary HTTP authorization remains unchanged when MCP is disabled.
- Release closure requires every applicable ATP and no expired waiver; planning audit/chart checks are reported separately from runtime proof.

## Dependency and Contract-Loop Rules

1. The forward chain is Vona DTO/controller/OpenAPI/MCP metadata truth → emitted OpenAPI inspection → MCP catalog/registry validation. Generated consumers, if any, are never hand-edited.
2. The first increment has no Zova consumer. If a future UI or generated consumer is added, backend contract truth still comes first; affected Web/Admin reverse work must build both SSR and REST artifacts before `npm run deps:vona`.
3. Executor reuse is permitted only through a server-owned operation registry, explicit `innerAccess: false`, isolated context, and fixed options.
4. Existing controller guards do not replace OAuth resource validation, trusted instance binding, request limits, policy checks, or audit.
5. Any persisted field/schema/meta.version change requires a prior `vonaModule.fileVersion` decision and then `npm run test`.
6. No WBS dependency readiness is execution approval. Source scaffolding, provider setup, deployment, or acceptance execution requires a separate bounded dossier.

## Traceability Matrix

| Product area             | PRD                                             | SRS                                                           | WBS                              | ATP                                                                   |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| Planning/security gates  | `PRD-MCP-*`                                     | `SRS-MCP-NFR-01`                                              | `WBS-MCP-10-01`, `WBS-MCP-10-02` | `ATP-MCP-AUTH-01`, `ATP-MCP-CONTRACT-03`                              |
| Transport/OAuth/instance | `PRD-MCP-ACCESS-01`, `PRD-MCP-IDENTITY-01`–`03` | `SRS-MCP-TRANSPORT-*`, `SRS-MCP-AUTH-*`, `SRS-MCP-INSTANCE-*` | `WBS-MCP-20-01`–`03`             | `ATP-MCP-TRANSPORT-01`, `ATP-MCP-AUTH-01`–`02`, `ATP-MCP-INSTANCE-01` |
| Catalog/policy           | `PRD-MCP-CONTRACT-01`–`03`                      | `SRS-MCP-CATALOG-*`, `SRS-MCP-API-*`                          | `WBS-MCP-30-01`–`02`             | `ATP-MCP-CONTRACT-01`–`03`                                            |
| Dispatch/isolation       | `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`–`02`   | `SRS-MCP-DISPATCH-*`, `SRS-MCP-PRIVACY-01`                    | `WBS-MCP-40-01`–`02`             | `ATP-MCP-CALL-01`–`03`                                                |
| Operations/release       | `PRD-MCP-SAFETY-03`–`04`                        | `SRS-MCP-OPS-*`, `SRS-MCP-UI-*`, `SRS-MCP-NFR-02`–`03`        | `WBS-MCP-50-01`–`02`             | `ATP-MCP-OPS-01`–`02`                                                 |

## Completion and Evidence Rules

- A planning task is not implementation-complete because its Markdown exists.
- A WBS task may become `implementation-complete` only after its source/configuration completion checks are satisfied; it becomes `verified` only after every applicable ATP has retained proof.
- Evidence must identify exact source revision, environment/database/instance where relevant, command or procedure, fixture/interleaving, observed result, and redacted durable artifact path.
- No empty evidence directory or fabricated `EVD-*` record is created by planning.
- Any temporary waiver must name owner, reason, affected IDs, compensating control, and expiry; an expired waiver blocks release.

## Related Records

- [A-MCP planning index](./README.md)
- [A-MCP PRD](./prd.md)
- [A-MCP SRS](./srs.md)
- [A-MCP test plan](./test-plan.md)
- [A-MCP progress](./progress.md)
- [A-MCP ADR 0001](./decisions/0001-mcp-suite-boundaries.md)
- [A-MCP ADR 0004 (proposed)](./decisions/0004-mcp-host-instance-binding.md)
