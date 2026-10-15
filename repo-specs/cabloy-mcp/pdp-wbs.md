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

Completion mode: planning-only.

Traceability: `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-02`, `PRD-MCP-CONTRACT-01`, `PRD-MCP-SAFETY-04`, `SRS-MCP-API-01`, `SRS-MCP-UI-01`, `SRS-MCP-OPS-04`, `ATP-MCP-CONTRACT-01`, `ATP-MCP-OPS-02`.

Dependencies: none.

Source areas: `repo-specs/cabloy-mcp/`; observed Vona suite/module topology; `repo-docs/fullstack/suites-and-modules.md`; MCP transport and authorization specifications. The proposed source path is not yet created.

Tasks:

- Confirm the revised `providerId=cabloy`, normal suite `cabloy-mcp`, and initial module `cabloy-mcp` identity and inspect source/manifests for collisions; source creation remains a later task.
- Record ADR 0001's accepted overall ownership boundary, no-Zova MCP resource-server increment, external OAuth resource-server requirement, JSON-only scope, and no new MCP-owned registry/consent/audit persistence. ADR 0009 later selects a separate Zova presentation for AS authorization, not a resource-module frontend.
- Record DEC-MCP-01's accepted initial `5.0.0` suite/module manifests, suite `workspace:^` composition, module's initial `a-vona: 5.0.0` lifecycle dependency, CLI-driven discovery/generated registration, and module-owned `enabled: false` defaults with explicit application opt-in. Leave SDK/OAuth libraries and runtime security settings to their later decisions.
- Record `zhennann` as the accountable owner for DEC-MCP-02 through DEC-MCP-08; keep the design inputs `TODO(confirm)` until each decision is separately resolved.
- Separate generation approval, overall design/ADR acceptance, concrete implementation design gates, and execution approval.
- If a later increment proposes a persisted registry, consent, or audit model, reopen the persistence decision and ask about `vonaModule.fileVersion` before schema work.

Acceptance checks:

- ADR 0001 records explicit acceptance of the overall boundary, names, and DEC-MCP-01 initial structural/configuration design only. ADR 0002 separately accepts DEC-MCP-02's transport design; ADR 0003 accepts DEC-MCP-03's bounded OAuth design only. DEC-MCP-04 through DEC-MCP-08 and bounded source execution remain gated; ADR 0009 separately selects a single AS-owned database-backed authority with same-commit code consumption/token activation and a Zova-presented, AS-controlled browser grant-flow direction under DEC-MCP-09 for design only, without approving a physical store, site/admission, UI implementation or schema.
- No planning record claims that the source suite/module, endpoint, OAuth provider, or runnable command already exists.
- Every material design gate has a recorded accountable owner and a bounded downstream WBS dependency; do not infer the owner from package authorship.

#### WBS-MCP-10-02: Complete MCP threat model and policy matrix

Completion mode: planning-only.

Traceability: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-02`, `PRD-MCP-IDENTITY-03`, `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-01`, `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-NFR-01`, `SRS-MCP-NFR-02`, `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`, `ATP-MCP-INSTANCE-01`, `ATP-MCP-CONTRACT-03`, `ATP-MCP-CALL-02`, `ATP-MCP-CALL-03`, `ATP-MCP-OPS-01`.

Dependencies: `WBS-MCP-10-01`.

Source areas: proposed `cabloy-mcp` security boundary; existing Passport/instance/guard/executor behavior; deployment trust and OAuth documentation. The [draft threat model and policy matrix](./threat-model.md) records candidate controls and open decision gates; it is not accepted closure.

Tasks:

- Model wrong-resource tokens, authorization-server/token-lookup failure, refresh-token replay/rotation failure, confused deputy, host/forwarded-host injection, selector conflicts, cross-instance access, Passport leakage, tool/schema injection, output exfiltration, rate abuse, and destructive operations.
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

Dependencies: `WBS-MCP-10-01`, `WBS-MCP-10-02`.

Source areas: proposed `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/`; existing Vona router/middleware registration; selected MCP transport implementation. ADR 0002 accepts DEC-MCP-02's transport design only; it does not authorize source or claim the target module exists. Target-module compilation and real HTTP remain checks under a separately approved bounded execution dossier.

Tasks:

- Select and record the supported Streamable HTTP protocol version, SDK or adapter, route registration, modern-only configuration, content negotiation, request size, timeout, and Origin handling; do not equate an SDK default or `ctx.respond = false` with isolation, response ownership, or request-scope lifetime.
- Define the transport-facing handoff to protected-resource metadata, authorization-server discovery, and canonical host/instance binding without selecting the metadata route/issuer or host-to-instance trust policy here; implementation and acceptance of those contracts remain with DEC-MCP-03/04 and WBS-MCP-20-02/03. Do not expose secrets or internal topology.
- Define the selected revision's `server/discover` (not legacy `initialize`), tools/list, tools/call, mirrored-header and error mappings, POST method-override defense, native JSON/SSE/error ownership, disconnect and context-settlement behavior, and unsupported-feature handling. Do not import GET, DELETE, or session behavior from an older revision.

Acceptance checks:

- A valid protocol exchange reaches the MCP boundary without requiring a Zova site; supported JSON/SSE and all error responses have exactly one transport-owned writer and a bounded request-scope lifetime.
- Missing, malformed, unsupported, method-overridden, or oversized protocol requests fail safely without business-controller dispatch; modern-only and exact HTTP/JSON-RPC mappings are proven with real HTTP, not just source inspection.
- The boundary preserves the approved resource/authorization-server/instance handoff without using any protocol or session identifier as authorization. Protected-resource metadata correctness and host-to-instance authorization remain gated by WBS-MCP-20-02/03 and DEC-MCP-03/04; this task alone cannot close those separate contracts.

#### WBS-MCP-20-02: Integrate OAuth resource-server validation and local subject mapping

Traceability: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-NFR-01`, `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`.

Dependencies: `WBS-MCP-20-01`, `WBS-MCP-20-04`.

Source areas: approved authorization-server/token-service integration and MCP resource-server boundary; existing Vona Passport/user/auth ownership; proposed `cabloy-mcp` authentication service. ADR 0003 accepts a design-only integrated `a-auth` logical AS with an MCP-only opaque access-token profile and **no refresh issuance** in the first profile; ADR 0009 selects this AS route and assigns `zhennann` implementation/operations responsibility while permitting planning AS-owned shared state only. A subsequent bounded ADR 0009 disposition selects a database-backed same-commit atomicity contract and Zova presentation of the AS-owned browser interaction only; no live issuer, physical store/schema, site/admission, UI/session/CSRF or configuration is selected. Blocked `WBS-MCP-20-04` owns separate AS delivery and `ATP-MCP-AUTH-03` proof; this resource-server task may use synthetic lookup fixtures in isolation but cannot claim real issuance or end-to-end readiness before its predecessor's approved delivery and proof. A separate AS alternative would require a new route decision and equivalent approved contract/proof and dependency disposition.

Tasks:

- Validate the MCP access-token profile, issuer/resource binding, current lookup/introspection state, expiry, subject, instance relation, and scope on every request.
- Map the OAuth subject to an active local Passport-compatible identity in the endpoint instance without reusing an existing unrelated request Passport.
- Define behavior for token lookup/introspection outage, first-profile access expiry requiring reauthorization, refresh credentials presented to the resource endpoint, ambiguous mapping, disabled identity, missing scope, and token/resource mismatch; the selected opaque-token profile rejects a token whenever current authorization state cannot be confirmed. Do not implement rotation, grant storage or consent in this resource module. A later AS-owned refresh failure requires a separate refresh-profile decision; the earlier deny-on-required-JWKS-refresh-failure policy is retained only if a later JWT/JWKS alternative is selected.

Acceptance checks:

- Invalid and wrong-resource tokens cannot list or call tools.
- A valid token maps to exactly one permitted local subject or fails closed.
- An opaque token is accepted only when the MCP-specific token profile, resource, subject, scope, instance binding, expiry, and revocation state are confirmed; token lookup/introspection failure denies without using stale authorization state. If a JWT/JWKS alternative is later approved, its refresh-failure rule is verified separately.
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

#### WBS-MCP-20-04: Deliver an approved MCP authorization-server/token-service contract

Traceability: `PRD-MCP-IDENTITY-01`, `SRS-MCP-AUTH-04`, `SRS-MCP-NFR-01`, `ATP-MCP-AUTH-03`.

Dependencies: `WBS-MCP-10-01`, `WBS-MCP-10-02`. ADR 0003 accepts DEC-MCP-03's bounded OAuth design only; ADR 0009 selects AS-owned database-backed same-commit atomicity and Zova-presented, AS-controlled browser grant-flow directions for design only. The first AS implementation targets SQLite via `better-sqlite3` on Vona's existing primary datasource; actual deployment confirmation, SQLite transition/migration proof, AS schema, site/admission and browser/session/CSRF implementation, delivery, applicable DEC-MCP-04 integration and execution approval remain independent authority gates, not satisfied by these planning predecessors.

Source areas: observed `a-auth` login/provider and `a-user` Passport/session primitives; ADR 0003 accepts the bounded design for an integrated `a-auth` logical AS, pre-registered public/confidential clients, authorization code + PKCE S256, MCP-specific opaque access tokens, and no refresh issuance in the first profile. ADR 0009 selects that route, records `zhennann` as implementation and operational owner, and selects a single AS-owned database-backed authority with same-commit code consumption/token activation and a Zova-presented, AS-controlled per-request browser grant-flow **design direction**; SQLite/`better-sqlite3` on Vona's existing primary datasource is the first target, but no actual deployment configuration, exact runtime service, schema, Zova site/flavor/admission, browser routes/UI/session/CSRF, issuer/endpoint or provider is approved. A separate AS would need a new route decision. No `cabloy-mcp` resource-module token/grant persistence, source target, site or provider is approved by this task declaration.

Tasks:

- Under the selected integrated `a-auth` logical AS with `zhennann` responsible for implementation and operations, specify the exact runtime service and separately approve supported client types and pre-registration path (including documented Client ID Metadata Documents compatibility limits), issuer/discovery and truthful endpoint/grant/PKCE/redirect/response-issuer metadata, resource-owner authentication and authorization interaction, and a resource-bound authorization-code + PKCE exchange. Verify exact issuer comparison independently of canonical resource matching.
- Define MCP-only opaque access-token issuance, grant/client/subject/scope/canonical-resource/instance binding, token-state lookup or introspection contract for the resource server, revocation, secret-safe representation, availability and multi-worker consistency. The existing Cabloy JWT pair, temporary token, OAuth provider and Redis session marker do not satisfy this token service by default.
- Enforce the accepted first-profile **no-refresh-issuance** decision: metadata must not advertise unsupported refresh capability, and clients reauthorize after access expiry. A later refresh profile requires a separate authority change and AS-owned replay-safe issuance/rotation or sender constraint and lifecycle proof; the MCP resource endpoint never accepts refresh credentials.
- Apply ADR 0009's bounded design-only DEC-MCP-09 disposition: use one AS-owned database-backed authority with **code consumption and resulting token activation in the same atomic commit**, and a Zova-presented, AS-controlled browser approve/deny flow for every authorization request. The first implementation targets SQLite via `better-sqlite3` on Vona's existing primary datasource, without claiming the actual deployment uses it or presuming an explicit multi-statement transaction by default; evaluate one aggregate/conditional mutation only with proof of equivalent atomicity on that driver, or use an appropriate atomic transaction for multi-write state. Confirm the actual deployment matches this target and retain the accepted existing-`a-auth` physical owner and service responsibilities below and obtain separate approval for exact source targets/schema, SQLite conditional-write or transaction/locking and migration proof, client registry, exact Zova site/flavor/admission/route and server identity/session/CSRF/instance-admission/SSR privacy, TTL/retention, outage policy and any consent change. The selected first topology is same-host multiple Vona workers sharing persistent SQLite on that datasource; require cross-worker approval/redemption contention, acknowledged-revocation visibility and connection/failure proof, not merely separate contexts in one process. Cross-host SQLite and replica support are unselected. If persistence resides in existing `a-auth`, the user selected keeping `vonaModule.fileVersion: 1` and folding the schema into version 1's creation path, with no version-2 migration or automatic upgrade of databases already recorded at v1. Apply the accepted fresh-only installation scope/exclusions, confirm actual eligibility and approve migration implementation before any persisted edit; seek a new version disposition only if the owning-module premise changes. Any `meta.version.ts` change requires `npm run test`. No schema or UI implementation is approved by this planning WBS.

Acceptance checks:

- The selected integrated `a-auth` logical AS and `zhennann`'s implementation/operational responsibility are recorded; a separately approved bounded execution dossier must identify real discovery, code/PKCE, client compatibility, resource-bound grant/token issuance and current token-service contract, with no assumption that `auth-oauth` provider login is already an AS. The first profile issues no refresh tokens; metadata must not advertise unsupported capabilities.
- `ATP-MCP-AUTH-03` has separately retained AS-owned synthetic/redacted proof for metadata, authorization/code exchange, token binding, revocation, outage, no-refresh issuance and multi-worker consistency. Resource-server-only fixtures or `ATP-MCP-AUTH-01` are insufficient for this work package.
- Apply the separately accepted [installation scope and deployment-confirmation requirements](./wbs-mcp-20-04-as-contract-dossier.md#92-installation-applicability-accepted-bounded-design-only): fresh physical-target/v1 creation only, existing-v1/nonfresh/partial/unknown exclusions, and an operations-owned allowlisted template with per-instance/worker effective routing and per-target version/physical-contract classification. All deployment observations remain unconfirmed and no actual installation is classified as eligible. Before execution, settle exact schema, activation-check hooks/mechanics, connection policy and safe verification procedures. This bounded design approval does not approve persisted edits, recovery operations, deployment inspection or ATP execution.
- Apply the separately accepted bounded [owner/representation/activation-check refinement, sections 9.5–9.8](./wbs-mcp-20-04-as-contract-dossier.md#95-owner-and-runtime-boundary-bounded-design-accepted): existing-`a-auth` physical ownership/service responsibilities, one logical aggregate/lifecycle, layered read-only activation responsibilities/timing and verifiable continuity of the same approved fresh-v1 installation. This satisfies the existing conditional keep-v1 owner premise, not arbitrary existing-v1 adoption. At that disposition, exact source targets, physical contract, provenance producer/integrity/binding/retention/restart verification, activation hooks/reuse/coherence, connection policy and execution remained gated; the following later disposition refines mechanism-level choices only, not concrete implementation. Do not treat startup readiness or a version marker as current-token or installation-provenance proof.
- Apply the separately accepted bounded [provenance/read-only-check mechanism rows, sections 9.9–9.12](./wbs-mcp-20-04-as-contract-dossier.md#99-installation-provenance-mechanism-bounded-design-accepted): protected completion receipt plus noncredential installation-generation marker, actual pinned-connection uncached checking/no ambient transaction, no positive readiness reuse/coordinated AS quiescence, and prospective synthetic proof/minimization. Candidate preparation at `e66171a243` was not acceptance; the later 2026-10-15 four-row disposition is recorded in ADR 0009/SRS-MCP-AUTH-04. Earlier mechanism gates are refined only to that bounded extent. Exact representation/integrity/custody/retention/withdrawal/identity, adapters/hooks/SQL/schema/logging/failure mappings, deployment confirmation, connection/fleet/drain enforcement and fixtures/execution/procedure approval remain open; no target currently qualifies. This does not complete the execution dossier or authorize implementation, deployment inspection or ATP.
- Apply the separately accepted bounded [receipt/marker and physical-identity contract rows, sections 9.13–9.16](./wbs-mcp-20-04-as-contract-dossier.md#913-receipt-and-marker-representation-bounded-design-accepted): bounded JSON/minimal marker, protected operations custody/activation/sticky withdrawal/installation-life retention, acknowledged durable no-overwrite publication, and platform-qualified actual-handle/storage-control identity. Preparation at `20b6aeb8b4` with eight carried planning edits was not acceptance; the later independent 2026-10-15 four-row disposition is recorded in ADR 0009/SRS-MCP-AUTH-04. No marker/path/inode/signature or copied receipt establishes continuity or rollback detection; unsupported or ambiguous cases remain blocked. Exact grammar/parser/activation encoding/DDL, publisher/hooks/filesystem/driver adapters, permission/confinement/fleet/sidecar controls, retention/disposal duration, deployment, fixtures/procedures and execution/runtime proof retain separate gates; no target qualifies and the execution dossier is not completed.
- Obtain an independent disposition of the newly prepared **Proposed** [aggregate/marker physical schema and conditional-transition rows, sections 9.17–9.20](./wbs-mcp-20-04-as-contract-dossier.md#917-aggregate-and-marker-physical-schema-proposed). The later 2026-10-15 user agreement authorized preparation only, at `20b6aeb8b4` with eight carried planning edits. Proposed one-row aggregate/singleton marker, explicit bounded physical fields/state shapes/indexes, scoped writer-serialized creation and direct pinned conditional-write/current-read result/commit boundary do not approve source or executable DDL. Ordinary Model CRUD is not committed-winner proof. Exact credential/browser/policy/clock/retention, emitted schema/checker/driver result/transaction/native identity/platform/fleet controls, actual operations attestation and safe fixture/procedure/execution/runtime proof remain gated. Keep all earlier bounded acceptances, 11 Unconfirmed observations, blocked AS/RS and prospective ATP unchanged.
- Database-neutral same-commit atomicity and Zova presentation directions have bounded design approval; actual SQLite/`better-sqlite3` primary-datasource deployment confirmation, atomic mutation or transaction/migration proof and exact AS state/schema, Zova site/admission and browser identity/session/CSRF/SSR interaction still need separate approval before source. The conditional existing-`a-auth` keep-v1 strategy is recorded; before any persisted edit, actual eligibility under the accepted fresh-only scope and migration implementation still need confirmation/approval; existing-v1 upgrade/adoption remains excluded pending a separate disposition. A materially different owning-module premise requires its own version decision. ADR 0009 authorizes bounded design only; no source, endpoint, provider or test execution is authorized by this disposition.

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
- Run the narrow contract loop and applicable type/test/lint/format checks after implementation; the selected AS Zova interaction requires its approved flavor's paired SSR/REST build before `npm run deps:vona`, without treating a site/flavor candidate as approved source.
- Prepare a bounded release dossier containing ATP results, revision/environment/procedure/artifact references, unresolved waivers, and production approval.

Acceptance checks:

- Missing OAuth/host/registry/adapter configuration disables the affected MCP surface and never invokes a business controller.
- Ordinary HTTP authorization remains unchanged when MCP is disabled.
- Release closure requires every applicable ATP and no expired waiver; planning audit/chart checks are reported separately from runtime proof.

## Dependency and Contract-Loop Rules

1. The forward chain is Vona DTO/controller/OpenAPI/MCP metadata truth → emitted OpenAPI inspection → MCP catalog/registry validation. Generated consumers, if any, are never hand-edited.
2. The MCP resource endpoint itself has no Zova consumer; the separately selected AS interaction does. Backend AS contract truth comes first, with generated consumers never hand-edited; after site/flavor approval, affected Web/Admin reverse work builds both SSR and REST artifacts before `npm run deps:vona`.
3. Executor reuse is permitted only through a server-owned operation registry, explicit `innerAccess: false`, isolated context, and fixed options.
4. Existing controller guards do not replace OAuth resource validation, trusted instance binding, request limits, policy checks, or audit.
5. Any persisted field/schema/meta.version change requires a prior `vonaModule.fileVersion` decision and then `npm run test`.
6. No WBS dependency readiness is execution approval. Source scaffolding, provider setup, deployment, or acceptance execution requires a separate bounded dossier.

## Traceability Matrix

| Product area             | PRD                                             | SRS                                                           | WBS                              | ATP                                                                   |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| Planning/security gates  | `PRD-MCP-*`                                     | `SRS-MCP-NFR-01`                                              | `WBS-MCP-10-01`, `WBS-MCP-10-02` | `ATP-MCP-AUTH-01`, `ATP-MCP-CONTRACT-03`                              |
| Transport/OAuth/instance | `PRD-MCP-ACCESS-01`, `PRD-MCP-IDENTITY-01`–`03` | `SRS-MCP-TRANSPORT-*`, `SRS-MCP-AUTH-*`, `SRS-MCP-INSTANCE-*` | `WBS-MCP-20-01`–`04`             | `ATP-MCP-TRANSPORT-01`, `ATP-MCP-AUTH-01`–`03`, `ATP-MCP-INSTANCE-01` |
| Catalog/policy           | `PRD-MCP-CONTRACT-01`–`03`                      | `SRS-MCP-CATALOG-*`, `SRS-MCP-API-*`                          | `WBS-MCP-30-01`–`02`             | `ATP-MCP-CONTRACT-01`–`03`                                            |
| Dispatch/isolation       | `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`–`02`   | `SRS-MCP-DISPATCH-*`, `SRS-MCP-PRIVACY-01`                    | `WBS-MCP-40-01`–`02`             | `ATP-MCP-CALL-01`–`03`                                                |
| Operations/release       | `PRD-MCP-SAFETY-03`–`04`                        | `SRS-MCP-OPS-*`, `SRS-MCP-UI-*`, `SRS-MCP-NFR-02`–`03`        | `WBS-MCP-50-01`–`02`             | `ATP-MCP-OPS-01`–`02`                                                 |

## Completion and Evidence Rules

- A planning task is not implementation-complete because its Markdown exists. Only a task explicitly declaring `Completion mode: planning-only.` may become `planning-complete` once its own documentary checks have revision-scoped evidence and a named reviewer records a planning-closure disposition. WBS-MCP-10-01 and WBS-MCP-10-02 have separate named-reviewer documentary `planning-complete` closures recorded in the current progress register. The earlier 2026-10-06 review did not grant WBS-MCP-10-01 closure. Their linked runtime ATPs remain future proof and successors, including proposed WBS-MCP-20-04, remain subject to their own gates.
- A `planning-complete` predecessor satisfies its dependency edge, but does not authorize a blocked successor, accept another ADR, waive applicable ATPs or change the verified count.
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
- [A-MCP AS design review dossier](./wbs-mcp-20-04-as-design-review.md)
- [A-MCP AS execution dossier (planning draft)](./wbs-mcp-20-04-execution-dossier.md)
- [A-MCP ADR 0004 (proposed)](./decisions/0004-mcp-host-instance-binding.md)
- [A-MCP ADR 0005 (proposed)](./decisions/0005-mcp-tool-catalog-registry.md)
- [A-MCP ADR 0006 (proposed)](./decisions/0006-mcp-tool-eligibility-risk-results.md)
- [A-MCP ADR 0007 (proposed)](./decisions/0007-mcp-context-passport-executor.md)
- [A-MCP ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md)
- [A-MCP ADR 0009 (accepted design-only amendment)](./decisions/0009-mcp-as-state-boundary.md)
