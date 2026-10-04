# A-MCP Software Requirements Specification

## Purpose and Authority

This SRS translates the [A-MCP PRD](./prd.md) into implementable and verifiable contracts for an accepted overall normal-suite boundary whose Vona source remains proposed new. It owns the MCP transport boundary, OAuth resource-server validation, instance binding, tool catalog and metadata, executor adaptation, authorization, privacy, rate limiting, audit, and operational behavior. The PRD owns product outcomes and scope; the [PDP/WBS](./pdp-wbs.md) owns delivery sequencing; the [test plan](./test-plan.md) owns executable `ATP-MCP-*` scenarios and evidence.

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

Unless explicitly marked as an observed current-source fact, this document defines a target contract, not implemented source. ADR 0001 accepts the revised `cabloy-mcp` normal-suite naming and overall first-increment boundary, including no new MCP-owned persistence. The planning directory is `repo-specs/cabloy-mcp/`; existing `*-MCP-*` IDs and relative links remain unchanged. The planned suite/module does not currently exist in the inspected checkout. Exact application activation, framework registration, dependency versions, OAuth provider selection, configuration keys, and source file names remain `TODO(confirm)` until their specific design approval and bounded execution.

## Current-Source Facts and Target Contracts

| Concern                  | Observed current source                                                                                                                                                   | Proposed target contract                                                                                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Edition and root scripts | Basic marker exists; root scripts expose Vona/Zova CLI, tests, builds, `spec:check`, and chart commands.                                                                  | Use only observed Basic commands in later execution dossiers; planned commands are not current evidence.                                                                                                                                                           |
| Suite/module             | Existing normal suites include `cabloy-basic`; no `cabloy-mcp` suite/module or package-name collision was observed in inspected source/manifests at `8ead4de320`.         | Revised accepted names: `providerId=cabloy`, normal suite `cabloy-mcp`, module `cabloy-mcp`. The planned source `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/` requires concrete manifest/application-activation design and a separate bounded execution dossier. |
| OpenAPI                  | `bean.openapi.generateJson()` can generate an OpenAPI document internally; Swagger export is not equivalent to MCP authorization.                                         | Use OpenAPI/DTO output as a candidate schema source, then apply MCP policy and registry checks.                                                                                                                                                                    |
| Executor                 | `bean.executor.performAction()` delegates to the executor service; `innerAccess` defaults to true and `innerAccess: false` is required to reach normal downstream guards. | The adapter supplies a fixed method/path, isolated context, server-owned headers/body/options, and explicit `innerAccess: false`.                                                                                                                                  |
| Context                  | Executor delegation can share `ctx.state` and request headers with a caller context; Passport lives in state.                                                             | MCP must establish a fresh request-owned identity/context boundary and prove no cross-request state or Passport leakage.                                                                                                                                           |
| Instance resolution      | Generic instance resolution may inspect custom resolver, query, header, and subdomains.                                                                                   | MCP endpoint host is the intended binding authority; conflicting query/header selectors are rejected or ignored according to an approved policy, and token instance authorization is checked.                                                                      |
| Authentication           | Existing Passport/JWT and `auth-oauth` support Cabloy login/provider flows; no inspected source establishes an MCP OAuth authorization server/resource server.            | Integrate or deploy a standards-compliant OAuth issuer/resource-server arrangement; do not relabel existing login OAuth as complete MCP authorization.                                                                                                             |
| Tool catalog             | OpenAPI operation IDs/security metadata do not guarantee globally unique names, safe side effects, or MCP-compatible representations.                                     | Build a deterministic, collision-checked, server-owned registry with candidate, exclusion, risk, shape, and policy states.                                                                                                                                         |
| Frontend/site            | No frontend or independent site is required by the external-AI endpoint outcome.                                                                                          | No Zova module/site in this baseline; any operator UI is deferred and requires a separate scope decision.                                                                                                                                                          |

## System Context

The proposed server sits between an external MCP client and existing Vona HTTP controller operations:

```text
External AI application
        │ MCP Streamable HTTP + OAuth bearer token
        ▼
MCP transport / protocol boundary
        │ request validation, host-instance binding, OAuth resource validation
        ▼
MCP catalog + authorization + fixed operation registry
        │ server-owned adaptation; no arbitrary route or header forwarding
        ▼
Fresh Vona request context + Passport mapping
        │ innerAccess: false
        ▼
bean.executor.performAction(...) / existing controller guards and AOP
        ▼
Existing domain service, Model, resource scope, transaction, and audit owners
```

The MCP layer is an adapter and policy boundary. It does not become the owner of domain persistence, account identity, tenant lifecycle, resource CRUD semantics, or controller business rules.

## Capability and Persistence Ownership

| Capability                                                                      | Owner                                                                                                    |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| MCP HTTP transport, protocol envelopes, tool list/call adaptation               | Proposed `cabloy-mcp` module                                                                             |
| OAuth issuer and authorization consent                                          | An approved external or Cabloy-integrated OAuth authorization server; exact owner `TODO(confirm)`        |
| OAuth bearer validation and resource metadata                                   | Proposed `cabloy-mcp` resource-server boundary, using the approved issuer/JWKS/introspection integration |
| Local subject mapping, Passport, roles, and account state                       | Existing Vona `a-user`/`home-user` and approved instance-local identity owner                            |
| Tenant/instance resolution                                                      | Existing Vona instance system, constrained by the MCP host-binding contract                              |
| Business authorization, resource ownership, CRUD, transactions, and data scopes | Existing domain controller/guard/service/Model owner                                                     |
| Candidate DTO/OpenAPI schemas                                                   | Existing Vona controller/OpenAPI/DTO metadata; `cabloy-mcp` projects rather than duplicates them         |
| Tool policy/registry and MCP annotations                                        | Proposed `cabloy-mcp`; durable storage is not assumed                                                    |
| Audit and telemetry                                                             | Existing platform audit/telemetry owner where available, with `cabloy-mcp` emitting a redacted MCP event |
| Operator configuration                                                          | Existing Vona configuration/deployment owner; no operator UI is included                                 |

The accepted first increment introduces no MCP-owned registry, consent, or audit persistence and no independent identity store. The existing identity, business-resource, and available platform audit/telemetry owners remain authoritative; the exact sink and retention still need a specific decision. If a persisted registry, consent record, client grant, or durable audit model becomes necessary later, the owning module, migration shape, retention, and `vonaModule.fileVersion` strategy must be decided before schema work.

## Tenant, Identity, Privacy, and Authorization Contracts

### SRS-MCP-AUTH-01: OAuth resource-server validation

Traceability: `PRD-MCP-IDENTITY-01`, `WBS-MCP-20-02`, `ATP-MCP-AUTH-01`.

Every MCP request that reaches protocol handling or tool discovery/call must validate a bearer access token as an OAuth resource server. Validation must include issuer, signature or approved introspection, expiration/not-before as applicable, resource/audience bound to this MCP endpoint, subject, and required scope claims. The resource metadata endpoint must identify the protected resource and authorization-server discovery location according to the selected MCP authorization profile. Invalid, missing, expired, wrong-issuer, wrong-resource, malformed, or insufficiently scoped tokens receive a protocol-appropriate authorization failure and never fall through to anonymous or inner access.

The exact issuer, JWKS/introspection mechanism, client registration mode, token format, and configuration names are `TODO(confirm)` design inputs. Existing Cabloy `auth-oauth` login providers and default JWT issuer settings are not, by themselves, proof of this contract.

### SRS-MCP-AUTH-02: Subject mapping and authorization intersection

Traceability: `PRD-MCP-IDENTITY-03`, `PRD-MCP-ACCESS-02`, `WBS-MCP-30-02`, `ATP-MCP-AUTH-02`.

After OAuth validation, the server maps the token subject to an active local identity in the bound instance using an approved stable mapping. It then evaluates the intersection of:

1. OAuth scope and client grant;
2. deployment-level MCP tool policy;
3. local Passport authentication and activation state;
4. existing role/RBAC/guard requirements;
5. business-resource ownership and row/data scope;
6. operation-specific risk, confirmation, and policy conditions.

A broader OAuth scope cannot elevate local authority. A local administrator role cannot authorize a tool absent MCP deployment policy. Mapping failure, disabled subject, instance mismatch, or ambiguous mapping fails closed without probing unrelated instances.

### SRS-MCP-AUTH-03: Call-time authorization

Traceability: `PRD-MCP-ACCESS-02`, `PRD-MCP-IDENTITY-03`, `WBS-MCP-30-02`, `WBS-MCP-40-01`, `ATP-MCP-AUTH-02`, `ATP-MCP-CALL-01`.

The result of `tools/list` is advisory visibility, not a capability token. `tools/call` repeats token, instance, subject, tool-policy, scope, RBAC, data-scope, and operation-risk checks immediately before dispatch. Argument values are validated against the published schema and any server-side resource policy; an argument cannot choose a different user, tenant, host, route, method, or authorization context.

### SRS-MCP-INSTANCE-01: Trusted endpoint-host binding

Traceability: `PRD-MCP-IDENTITY-02`, `WBS-MCP-20-03`, `ATP-MCP-INSTANCE-01`.

Each configured MCP endpoint has an approved host-to-instance binding. The server derives the expected instance from trusted endpoint configuration and request host processing, not from an untrusted tool argument. Deployment must define trusted proxy/forwarded-host behavior before relying on host-derived identity. A host not present in the approved mapping is rejected.

The generic Vona resolver's query/header/subdomain precedence cannot silently override the MCP binding. The final policy must either reject conflicting `x-vona-instance-name`/query selectors or ignore them while recording a redacted conflict; it must never use a conflicting selector to broaden scope.

### SRS-MCP-INSTANCE-02: Token-instance consistency

Traceability: `PRD-MCP-IDENTITY-02`, `WBS-MCP-20-03`, `ATP-MCP-INSTANCE-01`.

If the approved OAuth token carries an instance, tenant, organization, or resource claim, the claim must equal the endpoint-bound instance under a documented canonical comparison. If the token has no such claim, the approved authorization-server/resource registration must establish that the subject/client is permitted for the endpoint instance without treating absence as unrestricted access. Host, token, query, and header disagreement fails closed before tool visibility or business lookup.

### SRS-MCP-PRIVACY-01: Sensitive-data minimization

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

Tool schemas and results expose only fields required by the existing approved controller contract and MCP use case. The adapter must not return passwords, hashes, bearer tokens, raw OAuth claims, cookies, internal authorization records, secrets, unapproved debug data, or cross-resource data. Logs, metrics, traces, error details, and retained evidence use correlation IDs and redacted identifiers. Raw tool arguments and results require an explicit data-minimization policy; default telemetry does not retain them.

## Tool Catalog and Metadata Contracts

### SRS-MCP-CATALOG-01: OpenAPI/DTO candidate projection

Traceability: `PRD-MCP-CONTRACT-01`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-01`.

The catalog builder may call the existing internal OpenAPI generation service and inspect the associated controller/DTO metadata. It must preserve the generated input schema as the contract source or record a deterministic, reviewable transformation. It must distinguish at least:

- registered HTTP route;
- OpenAPI operation;
- MCP-compatible candidate;
- deployment-approved registry entry;
- subject-visible tool;
- call-time authorized operation.

OpenAPI `security` metadata is an input signal only and must not be treated as a complete OAuth scope, RBAC, data-scope, or side-effect policy. The builder must reject missing/ambiguous operation identity, unsupported schema references, unsupported content types, and unrepresentable response shapes rather than guessing.

### SRS-MCP-CATALOG-02: MCP exclusion and metadata

Traceability: `PRD-MCP-CONTRACT-02`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-02`.

The design must provide an independent MCP metadata mechanism, modeled in style after `@Api.exclude()`, with at least:

- MCP exclusion that can hide an operation while leaving OpenAPI exposure unchanged;
- stable tool-name override or namespace metadata;
- human title/description and localized or safe documentation text;
- read-only/destructive/idempotent/risk and confirmation annotations;
- input/output adaptation identifiers where schema translation is required;
- required OAuth scope and deployment-policy metadata where appropriate.

`@Api.exclude()` remains a hard upstream exclusion: an operation excluded from OpenAPI cannot be reintroduced by MCP discovery. Exact decorator names, metadata symbols, merge order, and module ownership are `TODO(confirm)` until design approval. Metadata must not weaken controller authorization.

### SRS-MCP-CATALOG-03: Eligibility and risk classification

Traceability: `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-03`, `WBS-MCP-30-02`, `ATP-MCP-CONTRACT-03`.

The default candidate policy is conservative. An operation is not automatically exposed merely because it appears in Swagger/OpenAPI. The eligibility classifier must account for method-independent side effects, authorization annotations, input content type, response content type, status behavior, streaming/redirect behavior, path/query/header bindings, idempotency, and data sensitivity.

The first increment excludes or requires explicit reviewed adapters for multipart/form-data, raw bodies, binary/file downloads, redirect responses, streaming/SSE, non-JSON success payloads, unsupported status envelopes, ambiguous operation IDs, arbitrary URL/host inputs, callbacks/webhooks, and operations whose destructive or externally irreversible effects are not explicitly classified. GET is not a read-only guarantee.

### SRS-MCP-CATALOG-04: Stable server-owned tool registry

Traceability: `PRD-MCP-CONTRACT-02`, `PRD-MCP-ACCESS-02`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-02`.

Every exposed tool has a deterministic unique name, one fixed HTTP method/path/controller operation, one schema version, one adapter policy, and one risk/policy record. Tool names cannot be supplied by the caller to resolve arbitrary routes. Collisions, stale generated entries, missing owners, or registry/schema drift fail the catalog build or remove the affected tool rather than selecting a nondeterministic winner.

The registry may be generated from source metadata, but runtime calls use the server-owned result and verify its revision/freshness policy. The accepted first increment does not persist an MCP-owned registry; its exact generated/in-memory lifecycle is `TODO(confirm)`. A persisted registry requires a separate decision and the fileVersion gate.

## MCP Transport and Protocol Contracts

### SRS-MCP-TRANSPORT-01: Streamable HTTP boundary

Traceability: `PRD-MCP-ACCESS-01`, `WBS-MCP-20-01`, `ATP-MCP-TRANSPORT-01`.

The first increment implements the selected current MCP Streamable HTTP transport profile over an approved Vona route. It must validate HTTP method/content type/accept headers, MCP protocol version/session behavior if sessions are used, request size, origin/host policy, and protocol message shape. The endpoint must not be confused with an independent Zova SSR site.

The exact MCP SDK or hand-written protocol adapter, endpoint path, session/stateless mode, supported protocol version, and SSE response details are `TODO(confirm)`. If stateless operation is selected, no connection/session state may be treated as authorization. If sessions are selected, authorization remains per request and session identifiers are not bearer credentials.

### SRS-MCP-TRANSPORT-02: Protected resource metadata and discovery

Traceability: `PRD-MCP-ACCESS-01`, `PRD-MCP-IDENTITY-01`, `WBS-MCP-20-01`, `WBS-MCP-20-02`, `ATP-MCP-TRANSPORT-01`, `ATP-MCP-AUTH-01`.

The deployment publishes protected-resource metadata at the standards-required location(s), advertises the resource identifier used for token audience/resource validation, and points clients to the approved authorization-server metadata. Metadata must not expose client secrets, private issuer material, or internal topology. Discovery behavior and response caching must be reviewed for host/instance correctness.

### SRS-MCP-TRANSPORT-03: Protocol error boundary

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

Protocol errors are stable, bounded, and nondiagnostic. Authentication/authorization, invalid tool, invalid arguments, unsupported representation, rate limit, timeout, downstream business rejection, and internal failure have distinct operator classifications but do not expose stack traces, SQL, raw guards, secrets, or unrelated resource existence. Correlation identifiers may be returned when safe and must map to redacted protected telemetry.

## Dispatch and Context Contracts

### SRS-MCP-DISPATCH-01: Fixed executor adaptation

Traceability: `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`, `WBS-MCP-40-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-02`.

For each registry entry, the adapter maps MCP arguments to the known controller path/method/body/query/params shape and invokes the existing executor path with `innerAccess: false`. It must preserve the selected controller guard/AOP chain and must not use trusted inner access. The server owns all executor options, including method, URL, headers, body, instance, auth context, and middleware behavior.

The adapter must account for executor behavior that unwraps successful Cabloy response envelopes and treats only supported response statuses/shapes as success. It must define a safe result transformation and reject unsupported response forms rather than silently misrepresenting them.

### SRS-MCP-DISPATCH-02: Input and output binding

Traceability: `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01`, `WBS-MCP-40-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CONTRACT-01`.

The binding layer validates JSON arguments against the registry schema, applies only declared path/query/body mappings, rejects unknown or dangerous fields according to the DTO contract, and enforces request size/depth/string limits. It must never interpret an argument as a URL, method, host, cookie, authorization header, tenant selector, executor onion, or arbitrary state patch.

Outputs are converted to the MCP result content supported by the first increment. JSON object/array/scalar representations must preserve the approved business result semantics without exposing internal envelope details unless that envelope is part of the declared tool contract.

### SRS-MCP-DISPATCH-03: Server-controlled execution options

Traceability: `PRD-MCP-SAFETY-01`, `WBS-MCP-40-01`, `ATP-MCP-CALL-02`.

The adapter fixes `innerAccess: false` and controls `onions`, headers, authentication propagation, instance name, timeout, and executor state. It must strip or overwrite caller-supplied `Authorization`, cookie, forwarding, host/origin, instance, proxy, trace, and protocol-control headers. It must not expose `options.onions`, `extraData.state`, `authToken`, or equivalent executor internals to tool arguments.

### SRS-MCP-DISPATCH-04: Fresh request context and Passport isolation

Traceability: `PRD-MCP-SAFETY-02`, `WBS-MCP-40-02`, `ATP-MCP-CALL-03`.

Each MCP request establishes a request-owned context whose Passport is constructed from the validated OAuth subject and bound instance before guarded dispatch. The implementation must not rely on a nested executor call to replace an existing Passport: current executor/context delegation can share `state`, and an existing anonymous or authenticated Passport may prevent a new token from being checked.

Concurrent MCP requests for different subjects or instances must not share mutable state, request headers, Passport, tool arguments, audit context, or authorization results. Any intentionally shared cache is immutable or keyed by all security-relevant dimensions and cannot carry caller identity.

### SRS-MCP-DISPATCH-05: Transaction and side-effect boundary

Traceability: `PRD-MCP-SAFETY-01`, `PRD-MCP-SAFETY-03`, `WBS-MCP-40-02`, `ATP-MCP-CALL-03`.

The MCP adapter does not create a new transaction around every operation by default. The existing controller/service owns transaction semantics, including `@Core.transaction(...)` where required. The adapter must define timeout, cancellation, retry, and response behavior without retrying non-idempotent business side effects or external operations. Destructive/irreversible calls require an explicit reviewed policy and must not be exposed solely because the route is guarded.

## Transactional, Concurrency, Idempotency, Audit, and Recovery Requirements

### SRS-MCP-OPS-01: Limits, timeout, and abuse controls

Traceability: `PRD-MCP-SAFETY-03`, WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

The endpoint enforces bounded request bytes, JSON depth/collection sizes, tool-call duration, concurrent calls, per-subject/client/instance rate limits, and catalog/list pagination or size limits if applicable. Limit dimensions and values are deployment-configurable and documented; missing configuration fails closed for dangerous operations. Rate-limit responses do not reveal another subject's usage or existence.

### SRS-MCP-OPS-02: Audit and telemetry

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

For discovery and calls, emit redacted audit/telemetry containing event type, outcome, correlation ID, bound instance, subject/client pseudonymous identifiers, tool name/version, policy decision, latency, and safe error class. State-changing calls additionally record the applicable risk/confirmation decision and downstream result class. Do not record bearer tokens, cookies, raw tool secrets, passwords, hashes, complete sensitive payloads, or usable links. Retention and sink ownership are `TODO(confirm)`.

### SRS-MCP-OPS-03: Disable and fail-closed behavior

Traceability: `PRD-MCP-SAFETY-04`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

Operators can disable the MCP endpoint or individual tool policy without weakening ordinary HTTP API guards. Disabled endpoints return a stable unavailable result and do not invoke domain controllers. A catalog-generation failure, registry mismatch, missing OAuth configuration, missing host-instance mapping, or unsafe adapter resolution causes the affected surface to fail closed and produces an operator-visible diagnostic without exposing internal detail to the client.

### SRS-MCP-OPS-04: Configuration and migration boundary

Traceability: `PRD-MCP-SAFETY-04`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

Configuration must distinguish resource metadata, issuer/trust keys, host-instance bindings, enabled tools, scopes, limits, audit settings, and environment secrets. Secrets are supplied through the repository's approved secret/configuration mechanisms and are never committed to planning records. If new persisted records or schema fields are required, the implementation must first ask whether `vonaModule.fileVersion` should be incremented, then add the approved migration and run the mandated full test path.

## API, DTO, OpenAPI, and Contract-Loop Contracts

### SRS-MCP-API-01: Vona contract truth and generated consumers

Traceability: `PRD-MCP-CONTRACT-01`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-01`.

Existing Vona DTO/controller/OpenAPI metadata remains the source of business request/response truth. MCP-specific annotations and projections are added only through the approved Vona metadata mechanism. Generated OpenAPI is inspected before MCP catalog generation; generated consumers or schemas must not be hand-edited. No Zova REST consumer is required for the endpoint itself, but any future frontend must follow the normal forward/reverse contract loop.

### SRS-MCP-API-02: Catalog freshness and drift

Traceability: `PRD-MCP-CONTRACT-01`, `PRD-MCP-CONTRACT-02`, WBS-MCP-30-01`, ATP-MCP-CONTRACT-01`, `ATP-MCP-CONTRACT-02`.

The implementation must define when the catalog is rebuilt, how schema/metadata revisions are identified, and what happens when runtime registry entries differ from current controller metadata. Stale or orphaned entries are not dispatched. Catalog output must be deterministic across equivalent source/configuration inputs, and duplicate stable names are a build/configuration failure.

## Frontend State, Route, Site, and SSR Contracts

### SRS-MCP-UI-01: No frontend/site dependency in first increment

Traceability: `PRD-MCP-SAFETY-04`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

The first increment has no Zova page, SSR route, Web flavor, Admin flavor, or independent MCP site. The remote endpoint is a Vona-serving integration surface. Any operator configuration UI, user consent page, or site-specific entry point is deferred and must not be implied by this baseline.

### SRS-MCP-UI-02: Future audience split rule

Traceability: `PRD-MCP-SAFETY-04`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

If a future Admin/Web UI is proposed, it must reuse the same domain/tenant/identity/authorization authority while separately specifying audience API/DTO scope, frontend state ownership, route/SSR behavior, and site composition where those contracts differ. A visual page cannot authorize MCP tools or replace the remote resource-server boundary.

## Non-Functional and Migration Requirements

### SRS-MCP-NFR-01: Security posture

Traceability: `PRD-MCP-IDENTITY-01`–`03`, `PRD-MCP-SAFETY-01`–`03`, `WBS-MCP-20-02`, `WBS-MCP-20-03`, `WBS-MCP-40-01`, `WBS-MCP-40-02`, `WBS-MCP-50-01`, `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`, `ATP-MCP-INSTANCE-01`, `ATP-MCP-CALL-02`, `ATP-MCP-CALL-03`, `ATP-MCP-OPS-01`.

The endpoint is fail-closed by default, uses HTTPS in production, validates trusted Origin/Host behavior as required by the selected MCP transport, prevents CSRF/session confusion, applies least privilege, and keeps OAuth tokens out of logs and tool arguments. Threat modeling must cover confused deputy, token replay, wrong resource/audience, host injection, forwarded-host trust, instance override, cross-request Passport leakage, prompt/tool description injection, schema confusion, output data exfiltration, rate abuse, and destructive tool invocation.

### SRS-MCP-NFR-02: Observability and operability

Traceability: `PRD-MCP-SAFETY-03`–`04`, `WBS-MCP-50-01`, `WBS-MCP-50-02`, `ATP-MCP-OPS-01`, `ATP-MCP-OPS-02`.

Operators can distinguish transport, authentication, instance, catalog, policy, downstream authorization, validation, limit, timeout, and internal failures through protected telemetry. Health/readiness behavior must not expose tool data or bypass authentication. Configuration changes and tool enablement changes are auditable according to the selected configuration owner.

### SRS-MCP-NFR-03: Performance and boundedness

Traceability: `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03`, `WBS-MCP-20-01`, `WBS-MCP-40-01`, `WBS-MCP-50-01`, `ATP-MCP-TRANSPORT-01`, `ATP-MCP-CALL-01`, `ATP-MCP-OPS-01`.

Catalog generation, tool listing, and calls have explicit bounded work, response size, and timeout behavior. Caching of public catalog metadata must not cache subject-specific visibility or authorization decisions across instances/subjects. Any cross-model query cache dependency follows the existing directed acyclic dependency rules; MCP does not use cache as an authorization or uniqueness mechanism.

## Acceptance Mapping

| Contract family                    | Primary PRD                                   | Primary WBS                      | Primary ATP                               |
| ---------------------------------- | --------------------------------------------- | -------------------------------- | ----------------------------------------- |
| Transport and protected resource   | `PRD-MCP-ACCESS-01`, `PRD-MCP-IDENTITY-01`    | `WBS-MCP-20-01`, `WBS-MCP-20-02` | `ATP-MCP-TRANSPORT-01`, `ATP-MCP-AUTH-01` |
| Instance and subject authorization | `PRD-MCP-IDENTITY-02`–`03`                    | `WBS-MCP-20-03`, `WBS-MCP-30-02` | `ATP-MCP-INSTANCE-01`, `ATP-MCP-AUTH-02`  |
| Catalog/schema governance          | `PRD-MCP-CONTRACT-01`–`03`                    | `WBS-MCP-30-01`, `WBS-MCP-30-02` | `ATP-MCP-CONTRACT-01`–`03`                |
| Dispatch/context isolation         | `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`–`02` | `WBS-MCP-40-01`, `WBS-MCP-40-02` | `ATP-MCP-CALL-01`–`03`                    |
| Limits/audit/disablement           | `PRD-MCP-SAFETY-03`–`04`                      | `WBS-MCP-50-01`, `WBS-MCP-50-02` | `ATP-MCP-OPS-01`–`02`                     |

## Related Records

- [A-MCP planning index](./README.md)
- [A-MCP PRD](./prd.md)
- [A-MCP PDP/WBS](./pdp-wbs.md)
- [A-MCP test plan](./test-plan.md)
- [A-MCP ADR 0001](./decisions/0001-mcp-suite-boundaries.md)
