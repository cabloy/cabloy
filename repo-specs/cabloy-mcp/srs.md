# A-MCP Software Requirements Specification

## Purpose and Authority

This SRS translates the [A-MCP PRD](./prd.md) into implementable and verifiable contracts for an accepted overall normal-suite boundary whose Vona source remains proposed new. It owns the MCP transport boundary, OAuth resource-server validation, instance binding, tool catalog and metadata, executor adaptation, authorization, privacy, rate limiting, audit, and operational behavior. The PRD owns product outcomes and scope; the [PDP/WBS](./pdp-wbs.md) owns delivery sequencing; the [test plan](./test-plan.md) owns executable `ATP-MCP-*` scenarios and evidence.

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

Unless explicitly marked as an observed current-source fact, this document defines a target contract, not implemented source. ADR 0001 accepts the revised `cabloy-mcp` normal-suite naming and overall first-increment boundary, including no new MCP-owned persistence; DEC-MCP-01 also accepts the initial scaffold manifests, discovery/generated registration, default-off enablement, and configuration ownership. The planning directory is `repo-specs/cabloy-mcp/`; existing `*-MCP-*` IDs and relative links remain unchanged. The planned suite/module does not currently exist in the inspected checkout. DEC-MCP-02 selects the transport protocol and SDK versions in ADR 0002 (design only); target-module compatibility and implementation-specific source remain unverified. OAuth provider, host binding, registry, and policy configuration remain `TODO(confirm)` under DEC-MCP-03 through DEC-MCP-08 until separately approved.

## Current-Source Facts and Target Contracts

| Concern                  | Observed current source                                                                                                                                                                                                              | Proposed target contract                                                                                                                                                                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edition and root scripts | Basic marker exists; root scripts expose Vona/Zova CLI, tests, builds, `spec:check`, and chart commands.                                                                                                                             | Use only observed Basic commands in later execution dossiers; planned commands are not current evidence.                                                                                                                                                                                          |
| Suite/module             | Existing normal suites include `cabloy-basic`; no `cabloy-mcp` suite/module or package-name collision was observed at `8ead4de320` or in the inspected source at `4374e1f3a2`.                                                       | Accepted DEC-MCP-01 target: `providerId=cabloy`, normal suite `cabloy-mcp`, module `cabloy-mcp`, initial scaffold under `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/`. The manifest/discovery/configuration design is accepted, but source creation needs a separate bounded execution dossier. |
| OpenAPI                  | `bean.openapi.generateJson()` can generate an OpenAPI document internally; Swagger export is not equivalent to MCP authorization.                                                                                                    | Use OpenAPI/DTO output as a candidate schema source, then apply MCP policy and registry checks.                                                                                                                                                                                                   |
| Executor                 | `bean.executor.performAction()` invokes router middleware only; `innerAccess` defaults to true on each call and can short-circuit later authorization guards. A prepopulated body bypasses raw-body parsing.                         | A fixed method/path and reviewed 200-status result run with server-owned options, including `innerAccess: false` on the inner call; MCP admission owns checks skipped with system middleware.                                                                                                     |
| Context                  | Nested executor calls may share `ctx.state` and request headers by reference; Passport lives in state, while the RBAC decision is action-context-owned. A fresh Koa context does not prove independent database/transaction storage. | MCP establishes a fresh instance-bound Passport and context per call, proves datasource/transaction isolation, and recomputes authorization in the route; ADR 0007 remains Proposed.                                                                                                              |
| Instance resolution      | Generic instance resolution may inspect custom resolver, query, header, and subdomains.                                                                                                                                              | MCP endpoint host is the intended binding authority; conflicting query/header selectors are rejected or ignored according to an approved policy, and token instance authorization is checked.                                                                                                     |
| Authentication           | Existing Passport/JWT and `auth-oauth` support Cabloy login/provider flows; no inspected source establishes a complete MCP OAuth authorization server/resource server.                                                               | Prefer evaluating a Cabloy-integrated `a-auth` authorization-server extension with an MCP-specific access-token profile and a separate MCP resource-server boundary; do not relabel existing login OAuth or temporary tokens as complete MCP authorization.                                       |
| Tool catalog             | OpenAPI operation IDs/security metadata do not guarantee globally unique names, safe side effects, or MCP-compatible representations.                                                                                                | Build a deterministic, collision-checked, server-owned registry with candidate, exclusion, risk, shape, and policy states.                                                                                                                                                                        |
| Frontend/site            | No frontend or independent site is required by the external-AI endpoint outcome.                                                                                                                                                     | No Zova module/site in this baseline; any operator UI is deferred and requires a separate scope decision.                                                                                                                                                                                         |

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

| Capability                                                                      | Owner                                                                                                                                                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| MCP HTTP transport, protocol envelopes, tool list/call adaptation               | Proposed `cabloy-mcp` module                                                                                                                                                         |
| OAuth authorization server, consent, and token grants                           | A Cabloy-integrated `a-auth` extension is the preferred candidate; a separately operated authorization server remains possible, but exact owner and contracts remain `TODO(confirm)` |
| OAuth bearer validation and resource metadata                                   | Proposed `cabloy-mcp` resource-server boundary, using the approved MCP access-token lookup/introspection integration                                                                 |
| Local subject mapping, Passport, roles, and account state                       | Existing Vona `a-user`/`home-user` and approved instance-local identity owner                                                                                                        |
| Tenant/instance resolution                                                      | Existing Vona instance system, constrained by the MCP host-binding contract                                                                                                          |
| Business authorization, resource ownership, CRUD, transactions, and data scopes | Existing domain controller/guard/service/Model owner                                                                                                                                 |
| Candidate DTO/OpenAPI schemas                                                   | Existing Vona controller/OpenAPI/DTO metadata; `cabloy-mcp` projects rather than duplicates them                                                                                     |
| Tool policy/registry and MCP annotations                                        | Proposed `cabloy-mcp`; durable storage is not assumed                                                                                                                                |
| Audit and telemetry                                                             | Existing platform audit/telemetry owner where available, with `cabloy-mcp` emitting a redacted MCP event                                                                             |
| Operator configuration                                                          | Proposed module owns typed defaults; existing Vona application/deployment config owns environment overrides. No operator UI is included.                                             |

The accepted first increment introduces no MCP-owned registry, consent, or audit persistence and no independent identity store. An opaque access-token profile may require durable token/grant/revocation state under an existing or extended authorization-server owner; no such store or schema is approved by this proposal. Reconcile that owner and any new persistence with DEC-MCP-09's no-MCP-owned-persistence boundary before implementation. The existing identity, business-resource, and available platform audit/telemetry owners remain authoritative; the exact sink and retention still need a specific decision. If a persisted registry, consent record, client grant, token store, or durable audit model becomes necessary, the owning module, migration shape, retention, and `vonaModule.fileVersion` strategy must be decided before schema work.

## Tenant, Identity, Privacy, and Authorization Contracts

### SRS-MCP-AUTH-01: OAuth resource-server validation

Traceability: `PRD-MCP-IDENTITY-01`, `WBS-MCP-20-02`, `ATP-MCP-AUTH-01`.

Every protected MCP request that reaches protocol handling or tool discovery/call must validate a Bearer access token as an OAuth resource server. For the preferred opaque profile, the approved token service must confirm current profile, issuer, client/grant, resource binding, expiry/activation, revocation, bound instance relation, subject, and required scope; a separately selected signed-token profile would also require signature, algorithm, and applicable claim checks. The public protected-resource metadata endpoint identifies the resource and authorization-server issuer discovery information without making tool access public. Invalid, missing, expired, wrong-issuer, wrong-resource, malformed, or insufficiently scoped access tokens never fall through to anonymous or inner access; the failure class follows the approved nondiagnostic HTTP policy.

ADR 0003 proposes evaluating a Cabloy-integrated `a-auth` authorization server with a dedicated MCP access-token profile, preferred opaque access tokens, optional refresh tokens, and deterministic local subject mapping. The authorization server owns authorization code + PKCE, client registration/compatibility, consent/grants, token issuance, refresh rotation, and revocation; the MCP resource server receives access tokens only. The preferred opaque profile requires current token lookup/introspection and fails closed when authorization state cannot be confirmed; it does not depend on JWKS. Clients may request refresh tokens but must not assume one is issued, and refresh tokens are used only at the authorization-server token endpoint. The overall DEC-MCP-03 input remains proposed: issuer/resource identity, grant and client registration, scope vocabulary, token-store representation, lookup consistency, rotation/reuse behavior, lifetimes, mapping owner, and configuration names remain `TODO(confirm)`. The earlier deny-on-required-JWKS-refresh-failure rule is retained only for a separately selected JWT/JWKS alternative. Existing Cabloy `auth-oauth` login providers, local JWT signing, and temporary-token helpers are reference capabilities, not by themselves proof of this MCP resource-server contract.

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

The result of `tools/list` is advisory visibility, not a capability token. `tools/call` repeats token, instance, subject, tool-policy, scope, RBAC, data-scope, and operation-risk checks immediately before dispatch. Argument values are validated against the published schema and any server-side resource policy; an argument cannot choose a different user, tenant, host, route, method, or authorization context. If visibility depends on an argument-specific row, listing may indicate only that a subject can attempt the operation; actual row ownership remains the guarded domain operation's decision. A confirmation-required operation remains unavailable without the separately approved server-verifiable grant described by the proposed ADR 0006, not a caller-provided flag.

### SRS-MCP-INSTANCE-01: Trusted endpoint-host binding

Traceability: `PRD-MCP-IDENTITY-02`, `WBS-MCP-20-03`, `ATP-MCP-INSTANCE-01`.

Each configured MCP endpoint has an approved host-to-instance binding. The server derives the expected instance from trusted endpoint configuration and request host processing, not from an untrusted tool argument. Deployment must define trusted proxy/forwarded-host behavior before relying on host-derived identity. A host not present in the approved mapping is rejected.

The generic Vona resolver's query/header/subdomain precedence cannot silently override the MCP binding. [ADR 0004](./decisions/0004-mcp-host-instance-binding.md) proposes rejecting query/header selectors on MCP paths even when they agree with the configured host and establishing an early, path-scoped binding before instance initialization. This remains a DEC-MCP-04 proposal, not an approved selector or proxy policy. The final policy must never use a conflicting selector to broaden scope; it must verify the effective external host against an approved deployment-owned allowlist, not infer authority from `ctx.hostname` or a subdomain alone.

### SRS-MCP-INSTANCE-02: Token-instance consistency

Traceability: `PRD-MCP-IDENTITY-02`, `WBS-MCP-20-03`, `ATP-MCP-INSTANCE-01`.

If the approved OAuth token carries an issuer-defined, verified instance or tenant claim, its documented mapping must agree with the endpoint-bound instance; a resource/audience claim instead binds the token to the configured MCP resource and cannot be treated as an instance-name selector. If the token has no instance claim, the approved per-instance authorization-server/resource registration and unambiguous active local subject mapping must authorize the endpoint instance without treating absence as unrestricted access. Host, token, query, and header disagreement fails closed before tool visibility or business lookup. ADR 0004 proposes one canonical resource per instance endpoint and leaves actual issuer/grant semantics `TODO(confirm)`.

### SRS-MCP-PRIVACY-01: Sensitive-data minimization

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

Tool schemas and results expose only fields required by the existing approved controller contract and MCP use case. The adapter must not return passwords, hashes, bearer tokens, raw OAuth claims, cookies, internal authorization records, secrets, unapproved debug data, or cross-resource data. Logs, metrics, traces, error details, and retained evidence use correlation IDs and redacted identifiers. Raw tool arguments and results require an explicit data-minimization policy; default telemetry does not retain them.

## Tool Catalog and Metadata Contracts

### SRS-MCP-CATALOG-01: OpenAPI/DTO candidate projection

Traceability: `PRD-MCP-CONTRACT-01`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-01`.

The catalog builder may call the existing internal OpenAPI generation service and inspect the associated controller/DTO metadata. It must preserve the generated input schema as the contract source or record a deterministic, reviewable transformation. [ADR 0005](./decisions/0005-mcp-tool-catalog-registry.md) proposes a one-to-one match between an enabled registered controller/action and request mapping, the emitted operation, and independent MCP metadata; a single-action OpenAPI document alone does not prove router enablement. Proposed schema projection must explicitly normalize or reject unresolved `$ref`, framework extensions, unconstrained fields, response-envelope differences, and incompatible runtime serialization. This proposal does not accept DEC-MCP-05 or make OpenAPI an exposure allowlist. The catalog must distinguish at least:

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

`@Api.exclude()` remains a hard upstream exclusion: an operation excluded from OpenAPI cannot be reintroduced by MCP discovery. ADR 0005 proposes separate MCP controller/action exclusion, explicitly reviewed action inclusion, and an independent authored deployment allowlist; unannotated or unapproved operations remain disabled. If a gateway-owned decorator would create business-module dependency cycles, prefer an authored manifest or neutral metadata owner. Exact decorator names, metadata symbols, merge order, dependency direction, and first operation owners are `TODO(confirm)` until design approval. Metadata must not weaken controller authorization; presentation strings and annotations are never policy proof.

### SRS-MCP-CATALOG-03: Eligibility and risk classification

Traceability: `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-03`, `WBS-MCP-30-02`, `ATP-MCP-CONTRACT-03`.

The default candidate policy is conservative. An operation is not automatically exposed merely because it appears in Swagger/OpenAPI. [ADR 0006](./decisions/0006-mcp-tool-eligibility-risk-results.md) proposes a review by the owning domain and MCP operator of the enabled action, DTO/OpenAPI-to-runtime input/output shape, guard and row/data scope, side effects, field minimization, and a narrow deployment policy. This remains an unaccepted DEC-MCP-06 input, not approval of a tool. Reviewed read-oriented operations and individually approved bounded reversible mutations may become eligible; destructive, externally irreversible, callback/open-world, and unclassified operations remain disabled by default. A GET with business side effects is a mutation, and MCP read-only/destructive/idempotency hints are not safety or authorization proof. The first enabled allowlist and per-tool scope/risk classification remain `TODO(confirm)`.

Eligibility requires a JSON object-root input schema with deterministic declared path/query/body bindings, plus a reviewed output projection/schema checked against the actual JSON result after executor adaptation. Reject unknown/control fields before dispatch and unreviewed result fields before external release. Supported JSON objects, arrays, scalars, and null require per-tool semantics; if `outputSchema` is published, emitted `structuredContent` must conform. Any compatibility JSON text block must derive from the same filtered value. The first increment excludes multipart/form-data, raw bodies, binary/file downloads, redirect responses, streaming/SSE, non-JSON success payloads, unsupported statuses/envelopes, arbitrary URL/host inputs, callbacks/webhooks, and unclassified/destructive effects unless a separate reviewed decision admits an adapter or risk exception. Response limits and operational redaction remain DEC-MCP-08 gates.

A client `confirm` argument, risk hint, or previous list entry is not a trusted approval. Any per-call-confirmation-required mutation remains disabled until the subject/client/instance/tool/arguments are bound to an independently approved, replay-safe, server-verifiable confirmation channel; client-side prompts and optional MCP elicitation do not automatically provide one. Explicitly reviewed reversible mutations without that requirement still need current OAuth scope, deployment policy, local authorization and domain ownership, plus audit. The confirmation mechanism and actual tool list remain `TODO(confirm)`; this proposal creates no MCP-owned consent database or UI.

### SRS-MCP-CATALOG-04: Stable server-owned tool registry

Traceability: `PRD-MCP-CONTRACT-02`, `PRD-MCP-ACCESS-02`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-02`.

Every exposed tool has a reviewed explicit public name independent of its internal bean/action key, one fixed HTTP method/path/controller operation, one schema version, one adapter policy, and one risk/policy record. Tool names supplied by the caller resolve only a validated server-owned entry, never arbitrary routes. A deterministic diagnostic key may identify unapproved candidates, but refactoring that key cannot silently rename an enabled public tool. Collisions, stale generated entries, missing owners, or registry/schema drift fail closed rather than selecting a nondeterministic winner.

ADR 0005 proposes an atomic in-memory structural snapshot validated after controller registration and before MCP admission, with explicit cache invalidation/rebuild or restart and per-worker revision checks. Subject-specific `tools/list` remains a current authorization projection rather than part of the immutable registry; a list or pagination cursor never grants `tools/call` authority. For the proposed 2026-07-28 protocol, completed list responses require `resultType`, `ttlMs`, and `cacheScope`, with private scope for a subject-specific list; final wire behavior awaits DEC-MCP-02 acceptance. The accepted first increment does not persist an MCP-owned registry. Exact metadata integration, snapshot lifecycle, policy freshness, and first allowlist remain `TODO(confirm)` under DEC-MCP-05; a persisted registry requires a separate decision and the fileVersion gate.

## MCP Transport and Protocol Contracts

### SRS-MCP-TRANSPORT-01: Streamable HTTP boundary

Traceability: `PRD-MCP-ACCESS-01`, `WBS-MCP-20-01`, `ATP-MCP-TRANSPORT-01`.

The first increment implements the selected current MCP Streamable HTTP transport profile over an approved Vona route. It must validate HTTP method/content type/accept headers, MCP protocol version/session behavior if sessions are used, request size, origin/host policy, and protocol message shape. The endpoint must not be confused with an independent Zova SSR site.

Accepted ADR 0002 selects the 2026-07-28 modern-only POST profile with a native Vona `//mcp` route, official v2 Node adapter, request-scoped JSON/SSE responses, `server/discover` rather than `initialize`, and no GET/DELETE/session transport. Modern-only serving requires explicit `legacy: 'reject'` because the inspected SDK defaults to legacy-stateless compatibility. Required per-request `_meta` and mirrored HTTP headers must agree (including decoded `Mcp-Name` for `tools/call`); malformed/missing headers map to HTTP `400` / JSON-RPC `-32020`, unsupported version to `400` / `-32022`, missing required `_meta` to `400` / `-32602`, and an unimplemented RPC method to `404` / `-32601`. A present invalid Origin requires `403`; chosen GET/DELETE `405` behavior is a profile SHOULD. The ingress must reject POST method override before Vona routing; route-local `enable: false` body/response overrides and `ctx.respond = false` alone do not prove bounded parsing, native error ownership, or request-scope survival through disconnected/settling work. DEC-MCP-02 accepts this design, including the module-owned `@modelcontextprotocol/server@2.3.0` and `@modelcontextprotocol/node@2.1.1` selections, not an installed dependency or runtime result. Obtain separate approval of a bounded source execution dossier; validate these mappings and the SDK/Vona lifetime in real HTTP after execution approval and before implementation closure. If a different revision or session mode is selected, update this contract and its ATP before source work.

### SRS-MCP-TRANSPORT-02: Protected resource metadata and discovery

Traceability: `PRD-MCP-ACCESS-01`, `PRD-MCP-IDENTITY-01`, `WBS-MCP-20-01`, `WBS-MCP-20-02`, `ATP-MCP-TRANSPORT-01`, `ATP-MCP-AUTH-01`.

The deployment publishes protected-resource metadata at the standards-required location(s), advertises the canonical `resource` identifier used for token audience/resource validation, and lists at least one approved authorization-server issuer identifier in `authorization_servers`; clients discover the authorization-server metadata from the issuer rather than from a metadata-document URL in that field. Metadata must not expose client secrets, private issuer material, or internal topology. Discovery behavior and response caching must be reviewed for host/instance correctness. ADR 0003's path-specific route and authorization-server/token-profile choices remain proposed pending DEC-MCP-03 acceptance.

### SRS-MCP-TRANSPORT-03: Protocol error boundary

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

Protocol errors are stable, bounded, and nondiagnostic. Authentication/authorization, invalid tool, invalid arguments, unsupported representation, rate limit, timeout, downstream business rejection, and internal failure have distinct operator classifications but do not expose stack traces, SQL, raw guards, secrets, or unrelated resource existence. Correlation identifiers may be returned when safe and must map to redacted protected telemetry.

## Dispatch and Context Contracts

### SRS-MCP-DISPATCH-01: Fixed executor adaptation

Traceability: `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`, `WBS-MCP-40-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CALL-02`.

For each registry entry, the adapter maps MCP arguments to the known controller path/method/body/query/params shape and invokes the existing executor path with `innerAccess: false` **on that action call**, not merely on an outer context. It must preserve the selected controller guard/AOP chain and must not use trusted inner access. The server owns all executor options, including method, URL, headers, body, instance, auth context, and middleware behavior. [ADR 0007 (proposed)](./decisions/0007-mcp-context-passport-executor.md) details the identity/context handoff and the limits of router-only dispatch; no context factory or action has been approved.

The inspected executor directly runs router middleware, treats **only status 200** as success, unwraps a `code: 0` Cabloy response to `data`, and does not perform an HTTP JSON serialization round-trip. OpenAPI's default response schema is a wrapped 200 shape; it does not itself prove the runtime/serialized shape or redact extra fields. A supported tool must review the actual unwrapped 200 result and account for guards attached to router middleware versus any system-only middleware; 201/202/204, framework/custom responses, or security controls outside that path need a separate approved adapter or stay disabled. MCP admission must explicitly cover required OAuth, approved instance activation, transport-origin and request-size controls that the inner router cannot rerun; the executor's prepopulated body does not pass through the raw-body parser's HTTP limits. Never unwrap a domain value a second time just because it has a `code` field. A rejected post-execution shape cannot be assumed to undo a committed business effect.

### SRS-MCP-DISPATCH-02: Input and output binding

Traceability: `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01`, `WBS-MCP-40-01`, `ATP-MCP-CALL-01`, `ATP-MCP-CONTRACT-01`.

The binding layer validates JSON arguments against the registry schema, applies only declared path/query/body mappings, rejects unknown or dangerous fields according to the DTO contract, and enforces request size/depth/string limits. It must never interpret an argument as a URL, method, host, cookie, authorization header, tenant selector, executor onion, or arbitrary state patch.

Outputs are converted from the executor's actual unwrapped value into a separately reviewed MCP field allowlist and runtime-validated JSON result; DTO/OpenAPI schema and the opt-in Vona serializer alone do not strip every undeclared field. JSON object/array/scalar/null representations must preserve the approved business result semantics without exposing internal envelope details unless that envelope is part of the declared tool contract. If a reviewed `outputSchema` is published, `structuredContent` conforms; any JSON text compatibility block is generated only from the same minimized value. An unexpected or unsafe result fails without raw-value fallback.

### SRS-MCP-DISPATCH-03: Server-controlled execution options

Traceability: `PRD-MCP-SAFETY-01`, `WBS-MCP-40-01`, `ATP-MCP-CALL-02`.

The adapter fixes `innerAccess: false` on each executor action and builds a new options object without spreading caller values. It controls `onions`, headers, authentication propagation, instance name, deadline policy, and executor state. It must reject caller-supplied `Authorization`, cookie, forwarding, host/origin, instance, proxy, trace, protocol-control headers, query token keys, and executor controls rather than letting them select credentials or instance. It must not expose `options.onions`, `extraData.state`, `authToken`, or equivalent executor internals to tool arguments. The current executor has no generic abort/deadline/idempotency option; a transport timeout is not proof of cancellation. Validate sensitive-argument/result redaction in existing route/AOP logging and JWT diagnostics, not just MCP logging.

### SRS-MCP-DISPATCH-04: Fresh request context and Passport isolation

Traceability: `PRD-MCP-SAFETY-02`, `WBS-MCP-40-02`, `ATP-MCP-CALL-03`.

Each MCP tool call establishes a request-owned context with an explicit, trusted, non-null instance (an approved empty-string default instance is distinct from the `null` no-instance/system mode) whose Passport is constructed from the validated OAuth subject and bound instance before guarded dispatch. Check that the instance exists, is enabled and is ready; executor instance lookup alone is not HTTP `initInstance()` admission. The implementation must not rely on a nested executor call to replace an existing Passport: current executor/context delegation can share `state`, and an existing anonymous or authenticated Passport may prevent a new token from being checked. Project only the current instance-local, active mapped identity through the approved Passport adapter, not an external bearer through `authToken`, unreviewed `extraData.state`, or local `signin()`/JWT issuance. The inner action may inherit the authenticated state only from this _same_ per-call context; the action's route guards must compute their own current RBAC decision. The context factory must demonstrate an independent datasource and transaction ownership boundary, not merely a new Koa context, because compatible database/transaction ALS stores may be reused.

Concurrent MCP calls for different subjects or instances must not share mutable state, request headers, Passport, tool arguments, audit context, or authorization results. Any intentionally shared cache is immutable or keyed by all security-relevant dimensions and cannot carry caller identity. Real HTTP tests separately prove the trusted ingress path that router-only executor tests cannot cover.

### SRS-MCP-DISPATCH-05: Transaction and side-effect boundary

Traceability: `PRD-MCP-SAFETY-01`, `PRD-MCP-SAFETY-03`, `WBS-MCP-40-02`, `ATP-MCP-CALL-03`.

The MCP adapter does not create a new transaction around every operation by default. The existing controller/service owns transaction semantics, including `@Core.transaction(...)` where required; its default `REQUIRED` joins an ambient datasource transaction without upgrading isolation. A database commit, post-commit callback, `ctx.commit()` completion callback, external effect, response filtering, and client delivery are distinct boundaries: failure after an effect may leave its outcome uncertain to the client. The adapter must define bounded execution, timeout, cancellation, retry, response and protected outcome behavior without treating disconnect/deadline as automatic rollback or replaying non-idempotent business effects. Existing executor options have no generic signal, deadline, or idempotency key; do not detach work with a fire-and-forget `Promise.race` or treat `runInBackground` as durable recovery. Automatic MCP retry is prohibited; any domain retry/idempotency contract must be separately reviewed as replay-safe, including post-commit callback failure and duplicate client submission. If bounded, truthful completion or recovery cannot be demonstrated, leave the affected tool disabled. Destructive/irreversible calls require an explicit reviewed policy and must not be exposed solely because the route is guarded.

## Transactional, Concurrency, Idempotency, Audit, and Recovery Requirements

### SRS-MCP-OPS-01: Limits, timeout, and abuse controls

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

The endpoint enforces staged, bounded ingress headers/body/parser work before expensive protected operations, JSON depth/collections/arguments and catalog/list work before business dispatch, per-instance/subject/client/tool rates and in-flight work, and approved filtered-result bytes before release. Unauthenticated requests use only ingress-owned, untrusted-source quotas; trusted subject/client/instance keys are derived after binding and authentication, never from caller-selected headers or payload. A per-process counter does not establish a multi-worker limit. Configure and review numeric ceilings, keys/windows, burst and failure/restart policy against the actual deployment; their values and mechanisms remain `TODO(confirm)` under [ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md). Missing required controls do not silently expose an unbounded tool. Deadline/disconnect does not prove business cancellation or rollback: account for admitted work until actual settlement or an approved durable recovery owner, coordinate with DEC-MCP-07, and never automatically retry an uncertain effect. Rate-limit responses do not reveal another subject's usage or existence.

### SRS-MCP-OPS-02: Audit and telemetry

Traceability: `PRD-MCP-SAFETY-03`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.

For protected discovery, call admission/denial, dispatch, limit/timeout, settled and uncertain outcomes, and activation/policy changes, define a reviewed protected audit contract distinct from sampled diagnostic logs/traces/metrics. Emit only approved event type, outcome class, server-generated correlation ID, bound instance when safely known, policy/registry revision, pseudonymous subject/client when authenticated, approved tool name/version, risk/confirmation decision, bounded latency, and safe error class. Distinguish rejection before dispatch, controller denial, settled effect, and unknown client-visible outcome; no timeout or delivery event alone proves rollback or commit. Reject new state-changing dispatch before business effects when required audit delivery is unavailable; an audit failure after an effect cannot undo the effect. Generate correlation independently of optional tracing or a caller-supplied request ID and preserve it across nested execution and late settlement. Selection of a protected sink/operator, event schema, delivery/failure behavior for list/read, retention/deletion and pseudonym-key ownership remains `TODO(confirm)` under [ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md), not approval for an MCP-owned audit table. Audit and telemetry must not record bearer tokens, cookies, OAuth claims, raw tool arguments or results, passwords, hashes, full sensitive payloads, or usable links.

### SRS-MCP-OPS-03: Disable and fail-closed behavior

Traceability: `PRD-MCP-SAFETY-04`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

Operators can disable the MCP endpoint or individual tool policy without weakening ordinary HTTP API guards. Disabled endpoints return a stable unavailable result and do not invoke domain controllers. A catalog-generation failure, registry mismatch, missing OAuth configuration, missing host-instance mapping, or unsafe adapter resolution causes the affected surface to fail closed and produces an operator-visible diagnostic without exposing internal detail to the client.

### SRS-MCP-OPS-04: Configuration and migration boundary

Traceability: `PRD-MCP-SAFETY-04`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

DEC-MCP-01 fixes the initial structural contract: generate the normal suite `vona-suite-cabloy-mcp` and module `vona-module-cabloy-mcp` at template version `5.0.0`; the suite composes `"vona-module-cabloy-mcp": "workspace:^"` (normalize the generator's initial `^5.0.0` entry). The module retains its generated ESM exports/build scripts, empty initial library `dependencies`, and `"vonaModule.dependencies": {"a-vona": "5.0.0"}`; the latter is a concrete minimum framework version, not an npm range. No `fileVersion` or `meta.version.ts` is created for this no-schema increment. The initial manifest does not install MCP SDK or OAuth libraries: DEC-MCP-02 subsequently selected the module-owned `@modelcontextprotocol/server@2.3.0` and `@modelcontextprotocol/node@2.1.1` for approved execution, while OAuth library choices remain with DEC-MCP-03. Further framework lifecycle dependencies are added only for required availability, ordering, or compatibility.

Normal-suite workspace discovery already includes `src/suite/*/modules/*` under `vona/`. The Vona dependency and metadata tools generate the application dependency and module registrations for discovered local modules; do not hand-edit generated outputs or invent a separate suite-registration array. Suite/module TS projects and module metadata follow the CLI-generated layout. Module `src/config/config.ts` owns typed defaults; Vona application `vona/src/backend/config/config/config.ts` supplies overrides via `config.modules['cabloy-mcp']`, merged after defaults. The initial module default is `enabled: false`; an application can opt in only by setting `CABLOY_MCP_ENABLED` to the literal string `true` in its application configuration mapping. Discovery and opt-in do not bypass readiness: before any protocol or business dispatch, the module must fail closed on missing or invalid OAuth, endpoint-to-instance binding, registry, or policy configuration. The later decisions own those settings' exact keys and semantics. `PROJECT_DISABLED_SUITES`/`PROJECT_DISABLED_MODULES` affect module discovery, not this security switch.

Configuration must distinguish resource metadata, issuer/trust keys, host-instance bindings, enabled tools, scopes, limits, audit settings, and environment secrets. Secrets are supplied through the repository's approved secret/configuration mechanisms and are never committed to planning records. If new persisted records or schema fields are required, the implementation must first ask whether `vonaModule.fileVersion` should be incremented, then add the approved migration and run the mandated full test path.

## API, DTO, OpenAPI, and Contract-Loop Contracts

### SRS-MCP-API-01: Vona contract truth and generated consumers

Traceability: `PRD-MCP-CONTRACT-01`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-01`.

Existing Vona DTO/controller/OpenAPI metadata remains the source of business request/response truth. MCP-specific annotations and projections are added only through the approved Vona metadata mechanism. Generated OpenAPI is inspected before MCP catalog generation; generated consumers or schemas must not be hand-edited. No Zova REST consumer is required for the endpoint itself, but any future frontend must follow the normal forward/reverse contract loop.

### SRS-MCP-API-02: Catalog freshness and drift

Traceability: `PRD-MCP-CONTRACT-01`, `PRD-MCP-CONTRACT-02`, WBS-MCP-30-01`, ATP-MCP-CONTRACT-01`, `ATP-MCP-CONTRACT-02`.

The implementation must define when the catalog is rebuilt, how schema/metadata revisions are identified, and what happens when runtime registry entries differ from current controller metadata. Stale or orphaned entries are not dispatched. Catalog output must be deterministic across equivalent source/configuration inputs, and duplicate stable names are a build/configuration failure. ADR 0005 proposes validating generated metadata, the current OpenAPI cache and effective enabled router against one approved source/configuration fingerprint at startup, then atomically publishing only a matching snapshot. HMR, DTO/schema edits, locale-specific descriptions, application controller overrides, worker drift, and policy/role revocation require separate structural and subject-visibility freshness checks; no stale cache can extend a caller's authority.

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
- [A-MCP ADR 0002 (accepted design)](./decisions/0002-mcp-transport.md)
- [A-MCP ADR 0003 (proposed)](./decisions/0003-mcp-oauth-resource-server.md)
- [A-MCP ADR 0004 (proposed)](./decisions/0004-mcp-host-instance-binding.md)
- [A-MCP ADR 0005 (proposed)](./decisions/0005-mcp-tool-catalog-registry.md)
- [A-MCP ADR 0006 (proposed)](./decisions/0006-mcp-tool-eligibility-risk-results.md)
- [A-MCP ADR 0007 (proposed)](./decisions/0007-mcp-context-passport-executor.md)
- [A-MCP ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md)
