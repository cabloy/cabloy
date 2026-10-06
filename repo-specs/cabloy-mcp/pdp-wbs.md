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

Source areas: existing OpenAPI generator/DTO metadata and enabled controller/router registrations; proposed MCP annotation or authored-manifest contract; proposed catalog builder and registry. [ADR 0005](./decisions/0005-mcp-tool-catalog-registry.md) is a Proposed input, not DEC-MCP-05 approval or source authorization.

Tasks:

- Collect versioned OpenAPI JSON internally and prove a unique enabled controller/action/request-mapping match for each candidate; validate DTO reference and response-envelope projection without treating OpenAPI presence as an allowlist.
- Choose independent MCP exclusion and annotation or manifest ownership without cyclic dependencies; require reviewed explicit public tool names, safe descriptions, metadata/risk signals, and adapter declarations before inclusion.
- Define deterministic diagnostic identity and stable public naming, collision/rename handling, schema revision/freshness, hard `@Api.exclude()` behavior, startup validation, and atomic in-memory registry snapshot without new MCP persistence.
- Separate structural registry refresh from deployment policy, per-subject `tools/list`, and call-time authorization; settle locale, cache, cursor, HMR/restart, and multi-worker drift behavior against the selected protocol.
- Keep candidate, eligible, enabled, visible, and call-authorized states distinct; DEC-MCP-06 still owns the final shape/risk/confirmation approval.

Acceptance checks:

- DTO/OpenAPI schema changes flow into the candidate contract without hand-editing generated consumers; enabled router identity, emitted operation, schema and registry snapshot agree at the serving revision.
- MCP exclusion can hide an operation while OpenAPI remains available; an upstream API exclusion cannot be reintroduced, and unannotated/unreviewed operations are not enabled.
- Duplicate public names, stale entries/caches, unsupported references, missing operation ownership, worker mismatch, and metadata-policy conflicts fail closed and are visible to operators.
- A per-subject list/cursor neither leaks another subject's tools nor authorizes a later call after policy/role/registry changes; ordinary non-MCP OpenAPI/API behavior is unchanged.

#### WBS-MCP-30-02: Classify tool shapes, risk, and authorization policy

Traceability: `PRD-MCP-ACCESS-02`, `PRD-MCP-CONTRACT-03`, `PRD-MCP-IDENTITY-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-AUTH-03`, `SRS-MCP-CATALOG-03`, `SRS-MCP-NFR-01`, `ATP-MCP-AUTH-02`, `ATP-MCP-CONTRACT-03`.

Dependencies: `WBS-MCP-30-01`.

Source areas: candidate catalog; existing controller guards/RBAC/data-scope conventions; Vona executor result/serializer behavior; deployment policy configuration. [ADR 0006](./decisions/0006-mcp-tool-eligibility-risk-results.md) is a Proposed DEC-MCP-06 input, not approval of a risk exception or any first tool.

Tasks:

- Obtain a per-action domain-owner/operator review of shape, guarded route/data scope, input/output field projection, side effects, reversibility, idempotency, sensitivity, and external interactions independently of HTTP method; require explicit allowlist/policy/scope ownership before eligibility.
- Exclude or require separately reviewed adapters for multipart, raw body, binary, redirect, streaming, unsupported statuses/envelopes, arbitrary URL inputs, callbacks, and unclassified side effects. Review current executor 200-status/unwrapped-result behavior and the gap between OpenAPI response schema and serializer/runtime output.
- Define the intersection of OAuth scopes, deployment policy, local Passport/RBAC, data scope, resource ownership, and risk/confirmation rules for list and call. Disable destructive/irreversible/open-world operations by default and any confirmation-required mutation without a separately approved server-verifiable, replay-safe grant; do not use a caller-provided boolean or tool annotation as approval.
- Specify the reviewed JSON result allowlist and runtime validation, `structuredContent`/optional `outputSchema`/compatibility text, supported empty/null/scalar forms, and bounded nondiagnostic post-execution failures without presuming a committed effect was rolled back. Set numerical limits, context/retry mechanics, and audit ownership through DEC-MCP-07/08, not this classification alone.

Acceptance checks:

- A GET with business side effects is not classified read-only by method alone; unreviewed, deceptive-hint, externally irreversible, and unsupported operations cannot enter the enabled set by OpenAPI presence or deployment opt-in alone.
- `tools/list` hides disallowed tools and `tools/call` repeats relevant current authorization and argument-specific row checks; a listed operation is not a row-level grant.
- The first approved catalog contains only representations and operations with a documented safe MCP adapter, approved domain/field/side-effect review, and deployment policy; no tool is asserted to be approved by this ADR.
- Execution and result tests prove field minimization and schema conformity for each enabled shape, reject unapproved response fields/unsupported status without raw fallback, and distinguish downstream effect from result delivery after post-execution failure.

### Phase 40: Guarded dispatch and isolation

Dependencies: `WBS-MCP-30-01`, `WBS-MCP-30-02`.

#### WBS-MCP-40-01: Implement fixed tool-call dispatch

Traceability: `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-AUTH-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `SRS-MCP-DISPATCH-03`, `SRS-MCP-TRANSPORT-03`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-02`.

Dependencies: `WBS-MCP-30-02`.

Source areas: proposed MCP tool-call adapter; `bean.executor.performAction(...)`; existing controller guards/AOP; approved registry. [ADR 0007](./decisions/0007-mcp-context-passport-executor.md) is a Proposed DEC-MCP-07 input, not approval of the context factory, executor options, or runtime execution.

Tasks:

- Resolve only server-owned tool names and map validated arguments to declared method/path/params/query/body fields.
- Invoke the **inner action** with `innerAccess: false` and a fresh server-built options object; validate trusted minimal headers and reject caller-controlled authorization, query tokens, instance, onions, state and `authToken`. Apply a reviewed bounded execution policy without assuming current executor options provide abort/deadline/cancellation.
- Prove route guard/AOP and domain policy coverage separately from OAuth, enabled-instance admission, HTTP body limits, origin and other system-middleware controls bypassed by router-only executor invocation; check downstream AOP argument/result and JWT diagnostic redaction.
- Adapt only explicitly reviewed Cabloy 200-status executor/unwrapped results to a minimized, runtime-validated MCP JSON value; check optional output-schema/structured-content and compatibility-text consistency, and classify unsupported statuses/shapes and post-execution failures safely.
- Reject unknown tools, unknown/dangerous fields, route-like arguments, and caller-supplied authorization/host/cookie/tenant controls.

Acceptance checks:

- A call reaches only its fixed controller route and normal guard/AOP chain.
- Forged method, URL, path, header, tenant, `innerAccess`, onion, or state arguments cannot alter dispatch.
- Successful and rejected calls produce the declared MCP result/error classes without leaking internal details.

#### WBS-MCP-40-02: Prove request-context, Passport, and side-effect isolation

Traceability: `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-DISPATCH-04`, `SRS-MCP-DISPATCH-05`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-NFR-01`, `ATP-MCP-CALL-03`, `ATP-MCP-OPS-01`.

Dependencies: `WBS-MCP-40-01`.

Source areas: proposed request-context factory; existing executor context delegation; Passport state; owning domain transaction/lock services. [ADR 0007](./decisions/0007-mcp-context-passport-executor.md) remains Proposed; no context implementation or runtime proof exists.

Tasks:

- Establish a fresh, explicitly endpoint-bound, enabled-instance context and local mapped Passport for every call, with no cross-call state/header references or ambient datasource/transaction-store/callback inheritance; verify any intentional same-call executor delegation and recomputed action-context RBAC.
- Define bounded execution, cancellation, duplicate submission, idempotency, transaction, retry, post-commit callback and external-side-effect behavior; never infer rollback from timeout, disconnect or failed result filtering, and never automatically retry MCP calls.
- Prove concurrent calls using independent top-level `mockCtx(...)` boundaries after setup, explicit barriers and combined durable outcomes; use real HTTP separately for system-middleware ingress and disconnect behavior.

Acceptance checks:

- Concurrent calls by different subjects and instances cannot observe or mutate each other's Passport, headers, arguments, authorization result, transaction state, or audit identity.
- Failure after a domain commit has a documented result/recovery boundary, no false rollback/success claim and no unreviewed replay of a non-idempotent effect.
- No sensitive request/result content appears in downstream AOP/JWT logging or retained artifacts.

### Phase 50: Operations, release hardening, and handoff

Dependencies: `WBS-MCP-40-01`, `WBS-MCP-40-02`.

#### WBS-MCP-50-01: Add limits, audit, telemetry, and redaction

Traceability: `PRD-MCP-SAFETY-03`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-OPS-01`, `SRS-MCP-OPS-02`, `SRS-MCP-TRANSPORT-03`, `SRS-MCP-NFR-02`, `SRS-MCP-NFR-03`, `ATP-MCP-OPS-01`.

Dependencies: `WBS-MCP-40-02`.

Source areas: proposed MCP operational middleware; existing rate-limit/audit/telemetry owners; deployment configuration. [ADR 0008](./decisions/0008-mcp-limits-audit-telemetry-redaction.md) is a Proposed DEC-MCP-08 input, not approved numeric policy, a selected audit sink, or source authorization.

Tasks:

- Select and enforce reviewed numeric ingress/body/parser, JSON argument/depth/collection, catalog/list, filtered-result, concurrency, time/cleanup and rate budgets, including preauth limits and independently derived instance/subject/client/tool keys. Verify key/window/worker/restart and quota-backend outage semantics; ordinary body-parser/rate-limiter defaults do not establish MCP limits.
- Account for already-started work after timeout/disconnect until actual settlement or approved durable recovery, without freeing capacity early, claiming rollback, or retrying uncertain effects; coordinate with DEC-MCP-02/07.
- Select a protected audit sink and operational owner with explicit delivery/failure, retention/deletion and pseudonym policy; emit reviewed redacted discovery, call, denial, dispatch, outcome/uncertainty and policy-change events with bounded fields. Keep diagnostic telemetry separate from required audit.
- Review transport, HTTP/error, nested route/AOP, token diagnostics, proxy/exporter, logs, traces, metrics and retained evidence for tokens, cookies, passwords, hashes, raw sensitive arguments/results, and usable links; disable a tool whose downstream disclosure cannot be controlled.

Acceptance checks:

- Deliberate limit exceedance and backend/sink failure reject before dispatch where required without cross-subject/instance leakage, unintended side effects or untracked still-active work; real HTTP and worker topology prove the selected mechanisms.
- Operators distinguish rejection, guarded authorization, settled and uncertain execution without inferring cancellation from a timeout; clients receive bounded nondiagnostic errors.
- Redaction proof covers protocol responses, logs, traces, metrics, protected audit and test evidence; approved retention and owner are recorded before release.

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
- [A-MCP ADR 0005 (proposed)](./decisions/0005-mcp-tool-catalog-registry.md)
- [A-MCP ADR 0006 (proposed)](./decisions/0006-mcp-tool-eligibility-risk-results.md)
- [A-MCP ADR 0007 (proposed)](./decisions/0007-mcp-context-passport-executor.md)
- [A-MCP ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md)
