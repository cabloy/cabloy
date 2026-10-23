# A-MCP Product Requirements Document

## Purpose

The planned `cabloy-mcp` suite gives authorized external AI applications a controlled way to discover and invoke Cabloy business capabilities through a standards-based remote MCP server. It is an access boundary over existing Cabloy APIs, not a second business-domain implementation and not a bypass around Passport, instance isolation, RBAC, resource ownership, or controller guards.

This PRD defines the product outcome and observable boundaries. The SRS owns OAuth, transport, DTO/schema projection, tool policy, dispatch, context isolation, audit, and operational details.

## Product Goals

- Let an external AI application discover only the tools that the deployment has intentionally made available to the caller.
- Let an authorized caller invoke an eligible business operation without the AI application needing a bespoke Cabloy client for every controller.
- Reuse existing DTO/OpenAPI contract truth while preserving server-side authorization and business invariants.
- Bind each request to the correct Cabloy instance and prevent a token, host, query, or header from expanding tenant scope.
- Make tool capability, risk, and failure behavior understandable to AI clients and operators.
- Provide auditable, rate-limited, privacy-preserving operation suitable for production governance.

## Personas

### External AI application

A client such as an enterprise assistant or agent that obtains an OAuth access token, connects to a configured MCP endpoint, lists available tools, and requests tool calls. It is not trusted to select arbitrary routes, headers, tenants, or execution options.

### Business user

The human represented by the OAuth subject and local Passport mapping. Their existing Cabloy roles, permissions, instance scope, and business-resource ownership remain authoritative.

### Platform operator

The maintainer who configures MCP exposure, OAuth resource metadata, allowed tool policy, rate limits, audit retention, and deployment host/instance bindings. Operator configuration is not a substitute for per-request authorization.

### Cabloy domain owner

The owner of an existing controller/API operation whose DTO, OpenAPI metadata, guard, business rule, and data scope remain authoritative when the operation is exposed as an MCP candidate.

## Scope

### In scope for the first planned increment

- A Vona normal suite `cabloy-mcp` and module `cabloy-mcp` as an accepted ownership design for planned new source; exact integration details remain gated by ADR 0001.
- A remote MCP Streamable HTTP endpoint; local stdio integration is excluded.
- OAuth protected-resource discovery and per-request bearer-token validation, including issuer, audience/resource, expiry, scope, and subject checks.
- Trusted endpoint-host to active-instance binding and rejection of conflicting instance selectors.
- Candidate tool discovery from generated OpenAPI/DTO metadata.
- Independent MCP exclusion metadata and MCP-specific descriptive/risk metadata.
- A fixed, server-owned operation registry that maps each exposed tool to one known controller method/path and known input/output adaptation.
- `tools/list` filtering and `tools/call` authorization for the current OAuth subject, instance, scope, RBAC, data scope, deployment policy, and operation risk.
- JSON-compatible input and output adaptation through the existing executor route path with `innerAccess: false`.
- Per-request context isolation, controlled headers, request limits, rate limits, audit, telemetry, and redacted protocol errors.
- Contract, security, concurrency, tenant-isolation, and protocol acceptance scenarios.

### Bounded local verification exception (2026-10-22)

The [accepted local commerce disposition in ADR 0002](./decisions/0002-mcp-transport.md#accepted-local-commerce-verification-disposition-2026-10-22) explicitly permits a separate manual loopback-only `mcp:commerce:local` entry for external-client discovery and search → detail using exactly `commerce_products_search` and `commerce_product_detail`, managed disposable test resources, fixed default instance and real guarded public reads. Anonymous access is allowed only for those two reads in that isolated process; this is not a production OAuth or protected-tool exception. It is a bounded contribution under `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03` and `PRD-MCP-CONTRACT-01`, not a new requirement or launch criterion. The old synthetic fixture's no-business limitation, all production requirements, dependencies, full ATP checks, parent blocked statuses and verified count 0/12 remain unchanged. Approval is prospective; this amendment supplies no source/runtime proof.

### Approved three-tool extension (2026-10-22)

After delivery of the two-tool local runtime, `zhennann` explicitly approved the combined planning, design and bounded execution plan for category discovery → returned category ID → Product search → returned Product ID → detail. The [later ADR 0002 disposition](./decisions/0002-mcp-transport.md#accepted-three-tool-category-extension-2026-10-22) extends only the local exception to exactly `commerce_categories_list`, `commerce_products_search`, `commerce_product_detail`, using Commerce's flat published directory under the [Commerce catalogue requirements](../a-commerce/prd.md#catalogue). The preceding two-tool approval remains historical, not proof of this extension. Existing `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01`, all transport/resource/security constraints and production gates remain unchanged; parent statuses stay blocked, full ATPs open and verified 0/12. This amendment is authority, not new runtime evidence.

### Approved local client compatibility (2026-10-22)

Following the observed Claude Code protocol rejection, `zhennann` approved [ADR 0002's local stateless compatibility amendment](./decisions/0002-mcp-transport.md#accepted-local-stateless-client-compatibility-2026-10-22) and finite execution plan. Only the managed three-tool local entry gains SDK-native legacy initialization/initialized acknowledgement alongside strict modern serving. No new tool, business requirement, production protocol/OAuth exception or launch criterion is added. All other local safety/resource conditions and blocked/full-ATP/0-of-12 boundaries remain; actual AI-client success requires separate observed proof.

### Approved independent test catalog (2026-10-23)

The [subsequent accepted migration](./decisions/0002-mcp-transport.md#accepted-independent-mcp-test-migration-2026-10-23) replaces Commerce ownership only for the local three-tool example. Same-suite `mcp-test` owns a minimal synthetic read-only catalog and ordinary guarded API; generic `cabloy-mcp` has no business dependency. Keep the three `commerce_*` names for compatibility and the returned-ID journey under `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01`. Basic's `a-commerce` source, data and lifecycle are not prerequisites and are not modified. No shopping writes or production authority is added. Historical approvals/proof above remain scoped to their old owner; full ATPs/open dependencies and verified 0/12 remain unchanged.

### Approved dev shared-listener access (2026-10-23)

At clean `47d41c84fe`, `zhennann` approved [ADR 0002's bounded dev amendment](./decisions/0002-mcp-transport.md#accepted-dev-shared-listener-amendment-2026-10-23): local clients may use the same three `mcp-test` tools/static catalog through the dev `/mcp` entry on the existing Vona listener. Middleware metadata `mode: ['dev', 'test']` permits identical-chain managed verification, never production; no test-specific flag or global mode mutation. The corrected contract permits optional URL `instanceName` per request, passed to fresh `newCtx`; absence is `undefined` for default framework resolution, not a fixed `''`. Actual default scope alone owns fixture data; foreign instances return empty/absent results. Preserve direct-local-peer/Host/Origin security, actual-work lifecycle/drain and ordinary-route passthrough. Keep the separate managed isolated launcher unchanged. This extends only the local exception under `PRD-MCP-ACCESS-01`, `PRD-MCP-ACCESS-03`, `PRD-MCP-CONTRACT-01`; no production OAuth/registry or cross-instance business authority, runtime result, new requirement or launch criterion is added. Existing partial WBS/ATP links apply; parents remain blocked, full ATPs open and verified 0/12.

### Superseding shared-ingress access amendment (2026-10-23)

The [later user correction in ADR 0002](./decisions/0002-mcp-transport.md#accepted-shared-ingress-authority-simplification-2026-10-23) supersedes the preceding middleware-mode and shared local-peer/Host/Origin restrictions only. Dev/test-only `mcp-test` module inclusion is the sole mode gate; shared ingress adds no local-authority allowlist. Business API authorization remains authoritative through fixed guarded `innerAccess: false` actions; all three fixture reads are public and anonymous. No credential forwarding, authentication, OAuth or CORS is added. Protocol/body checks, limits, instance scope and actual-work/drain remain, while standalone strict loopback/Host/Origin, fixed-default selector rejection and TTL are unchanged. Historical approvals/evidence and existing requirement/ATP links remain; no new result, launch criterion or WBS status follows (parents blocked, full ATPs open, verified 0/12).

### Deferred

- A general-purpose OAuth authorization-server UI or identity provider managed by Cabloy itself. The selected integrated `a-auth` logical AS for the MCP-specific opaque-token profile has a separate, blocked delivery scope: a narrow Zova-presented, AS-controlled per-request authorization interaction is selected for design, while its concrete site/flavor, admission and shared grant/token implementation still require approval. This does not create a general-purpose UI or automatically add an independent Zova site. The first profile issues no refresh tokens; any later refresh profile needs a separate authority change.
- Automatic exposure of every OpenAPI operation without eligibility, policy, or risk review.
- Multipart upload, raw-body operations, binary downloads, redirects, streaming responses, SSE business payloads, and non-JSON tool results.
- Destructive-operation confirmation UX beyond a protocol-level policy/metadata contract.
- A Zova Admin/Web management page, independent SSR site, or end-user MCP configuration screen.
- Long-running asynchronous jobs, subscriptions, notifications, and tool-result pagination unless a later MCP-specific design adds them.
- MCP resources and prompts; the first increment is tools-focused.
- Cross-instance administration or an input-controlled `iid`/tenant switch.

### Out of scope

- Replacing existing controllers, DTOs, OpenAPI generation, Passport, RBAC, or business services.
- Treating the MCP bearer token as proof of unrestricted system-admin authority.
- Allowing the client to provide an arbitrary HTTP method, URL, route, host, authorization header, cookies, `innerAccess`, middleware onions, or executor state.
- Creating a separate tenant, user store, business-resource database, or alternate authorization model.
- Claiming that a GET operation is safe solely because its HTTP method is GET.

## Primary User Journeys

### Discover available tools

1. The AI application requests the configured MCP endpoint with a valid OAuth token.
2. The server binds the request to the trusted endpoint instance and validates the token.
3. The server returns only tools visible under deployment policy, OAuth scope, local RBAC, data-scope policy, operation eligibility, and current subject state.
4. The tool definition contains a stable server-owned name, human-readable description, JSON input schema, output contract, and relevant risk/confirmation annotations.

### Invoke a read-oriented tool

1. The AI application submits a server-owned tool name and JSON arguments.
2. The server resolves the name through its immutable request-time registry; arguments cannot select a route or execution mode.
3. The server creates an isolated request context, performs per-request authorization, and dispatches the known controller operation with `innerAccess: false`.
4. The response is converted to an MCP tool result without leaking credentials, internal IDs, stack traces, or unrelated fields.

### Invoke a state-changing tool

1. The client sees the operation's explicit risk metadata and obtains any required user/deployment consent outside or through the agreed MCP interaction.
2. The server repeats authorization and policy checks at call time; visibility in `tools/list` is not authorization for arbitrary arguments.
3. The server executes the controller/business transaction and emits a redacted audit event with correlation data.
4. Failures are nondiagnostic to the external client while remaining actionable in protected operator telemetry.

### Reject an unsafe or invalid call

The server rejects missing/invalid OAuth, wrong resource/audience, instance mismatch, unknown tool name, malformed JSON, unsupported content shape, insufficient scope/RBAC/data scope, excessive rate, unsafe operation policy, or downstream authorization failure without falling back to a generic internal dispatch path.

## Product Requirements

### External access and discovery

- **PRD-MCP-ACCESS-01**: An authorized external AI application can connect to the configured remote MCP endpoint and receive a protocol-compliant response without requiring a custom client endpoint for each Cabloy controller. Traceability: `SRS-MCP-TRANSPORT-01`, `WBS-MCP-20-01`, `ATP-MCP-TRANSPORT-01`.
- **PRD-MCP-ACCESS-02**: A caller can list only the tools that the current deployment, OAuth subject, instance, scope, RBAC, data scope, and tool policy allow them to see. Traceability: `SRS-MCP-AUTH-02`, `SRS-MCP-CATALOG-04`, `WBS-MCP-30-01`, `ATP-MCP-AUTH-02`.
- **PRD-MCP-ACCESS-03**: A caller can invoke an exposed tool using the published JSON input contract and receive a bounded MCP tool result derived from the existing business operation. Traceability: `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `WBS-MCP-40-01`, `ATP-MCP-CALL-01`.

### Identity, instance, and authorization

- **PRD-MCP-IDENTITY-01**: Every MCP request is authenticated with a standards-based OAuth access token whose issuer, resource/audience, expiry, subject, and required scopes are validated before tool discovery or invocation. For the selected integrated `a-auth` logical AS route, obtaining that token also requires a separately delivered AS contract owned for implementation and operations by `zhennann`; the existing login provider does not provide it automatically. Traceability: `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-04`, `WBS-MCP-20-02`, `WBS-MCP-20-04`, `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-03`.
- **PRD-MCP-IDENTITY-02**: Every request is bound to the intended Cabloy instance by trusted endpoint host configuration, and a token or client-supplied selector cannot cross or override that instance boundary. Traceability: `SRS-MCP-INSTANCE-01`, `SRS-MCP-INSTANCE-02`, `WBS-MCP-20-03`, `ATP-MCP-INSTANCE-01`.
- **PRD-MCP-IDENTITY-03**: Existing Passport, RBAC, business-resource ownership, and data-scope rules remain effective for MCP calls; MCP exposure never grants authority that the local subject does not already possess. Traceability: `SRS-MCP-AUTH-02`, `SRS-MCP-AUTH-03`, `WBS-MCP-30-02`, `ATP-MCP-AUTH-02`.

### Contract and tool governance

- **PRD-MCP-CONTRACT-01**: MCP candidate schemas are derived from the current Vona DTO/OpenAPI contract rather than duplicated manually in an unrelated tool definition. Traceability: `SRS-MCP-CATALOG-01`, `WBS-MCP-30-01`, `ATP-MCP-CONTRACT-01`.
- **PRD-MCP-CONTRACT-02**: A controller operation can be explicitly excluded from MCP independently of whether it remains visible in Swagger/OpenAPI, and MCP-specific metadata can describe stable naming, risk, confirmation, and adaptation rules. Traceability: `SRS-MCP-CATALOG-02`, WBS-MCP-30-01`, `ATP-MCP-CONTRACT-02`.
- **PRD-MCP-CONTRACT-03**: The default candidate policy does not automatically expose operations whose input/output or side-effect semantics cannot be represented safely as first-increment JSON tools. Traceability: `SRS-MCP-CATALOG-03`, `WBS-MCP-30-02`, `ATP-MCP-CONTRACT-03`.

### Safe execution and operations

- **PRD-MCP-SAFETY-01**: A tool call dispatches only to a server-owned controller operation through the existing guarded route path and cannot alter `innerAccess`, middleware, authentication, host, cookies, or tenant context through arguments. Traceability: `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-03`, `WBS-MCP-40-01`, `ATP-MCP-CALL-02`.
- **PRD-MCP-SAFETY-02**: The server isolates caller identity and request state for every MCP request, including concurrent requests and nested executor contexts. Traceability: `SRS-MCP-DISPATCH-04`, `WBS-MCP-40-02`, `ATP-MCP-CALL-03`.
- **PRD-MCP-SAFETY-03**: MCP calls enforce request-size, rate, timeout, and risk policy limits and produce redacted audit/telemetry records without exposing secrets or sensitive business data to the client. Traceability: `SRS-MCP-OPS-01`, `SRS-MCP-OPS-02`, `WBS-MCP-50-01`, `ATP-MCP-OPS-01`.
- **PRD-MCP-SAFETY-04**: A deployment can disable or defer the MCP surface without changing the underlying business APIs or making them less secure for ordinary HTTP callers. Traceability: `SRS-MCP-OPS-03`, `WBS-MCP-50-02`, `ATP-MCP-OPS-02`.

## Business Rules

- OpenAPI export is a candidate source, not a final authorization or safety decision.
- `@Api.exclude()` is a hard upstream exclusion; a separate `@Mcp.exclude()` is proposed for MCP-only exclusion.
- Tool names are stable server-owned identifiers and cannot be derived from a potentially colliding `operationId` without collision detection and a deterministic naming policy.
- Visibility in `tools/list` does not authorize every possible argument in `tools/call`; authorization is repeated at call time.
- HTTP method is not a side-effect classification. GET operations that mutate state remain high-risk or excluded until explicitly classified.
- The active Vona instance is the tenant boundary. An input field such as `iid` is never an authorization source.
- The first increment accepts ordinary JSON-compatible request/response shapes only. Multipart, raw body, binary, redirect, streaming, and unsupported status/result forms are excluded or require explicit adapters.
- Existing controller guards and AOP remain authoritative, but MCP must perform its own OAuth, instance, request-shape, policy, and audit boundary before executor dispatch.
- No source, provider, database migration, or deployment is created by this planning baseline.

## Launch Criteria

The first increment may launch only when the governing ADR is accepted, the concrete module/dependency design is approved, the OAuth resource-server and trusted-host strategy is operationally configured, every exposed tool has a reviewed registry/policy entry, direct API authorization and instance-isolation ATPs pass, context-concurrency and redaction proof is retained, generated contract checks pass, and release owners approve the remaining operational gates. Planning files alone never satisfy launch criteria.

## Requirement Traceability

| Product area           | PRD                                           | SRS                                                | WBS                                   | ATP                                           | Status source |
| ---------------------- | --------------------------------------------- | -------------------------------------------------- | ------------------------------------- | --------------------------------------------- | ------------- |
| Transport and protocol | `PRD-MCP-ACCESS-01`                           | `SRS-MCP-TRANSPORT-01`                             | `WBS-MCP-20-01`                       | `ATP-MCP-TRANSPORT-01`                        | `progress.md` |
| OAuth and instance     | `PRD-MCP-IDENTITY-01`–`03`                    | `SRS-MCP-AUTH-01`–`04`, `SRS-MCP-INSTANCE-01`–`02` | `WBS-MCP-20-02`–`04`, `WBS-MCP-30-02` | `ATP-MCP-AUTH-01`–`03`, `ATP-MCP-INSTANCE-01` | `progress.md` |
| Catalog and schema     | `PRD-MCP-CONTRACT-01`–`03`                    | `SRS-MCP-CATALOG-01`–`03`                          | `WBS-MCP-30-01`–`02`                  | `ATP-MCP-CONTRACT-01`–`03`                    | `progress.md` |
| Dispatch and isolation | `PRD-MCP-ACCESS-03`, `PRD-MCP-SAFETY-01`–`02` | `SRS-MCP-DISPATCH-01`–`04`                         | `WBS-MCP-40-01`–`02`                  | `ATP-MCP-CALL-01`–`03`                        | `progress.md` |
| Operations and release | `PRD-MCP-SAFETY-03`–`04`                      | `SRS-MCP-OPS-01`–`03`                              | `WBS-MCP-50-01`–`02`                  | `ATP-MCP-OPS-01`–`02`                         | `progress.md` |

## Related Records

- [A-MCP planning index](./README.md)
- [A-MCP SRS](./srs.md)
- [A-MCP PDP/WBS](./pdp-wbs.md)
- [A-MCP test plan](./test-plan.md)
- [A-MCP ADR 0001](./decisions/0001-mcp-suite-boundaries.md)
