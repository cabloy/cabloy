# A-MCP Test Strategy and Acceptance Plan

## Purpose and Authority

This plan defines verification strategy, executable acceptance scenarios, fixtures, evidence requirements, and release proof for the accepted overall `cabloy-mcp` remote access design, whose source and runtime proof remain pending. It completes the traceability chain:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

The [PRD](./prd.md) owns product outcomes; the [SRS](./srs.md) owns technical contracts; the [PDP/WBS](./pdp-wbs.md) owns sequencing and completion checks. `ATP-MCP-*` declarations are scenarios, not evidence or status. Planning, static audits, and chart generation never prove runtime acceptance.

## Scope, Quality Priorities, and Risk

Verification prioritizes:

1. OAuth issuer/resource/audience/expiry/scope validation and local-subject mapping;
2. trusted endpoint-host to instance binding, forwarded-host behavior, and selector conflict rejection;
3. candidate-vs-enabled-vs-visible-vs-call-authorized tool separation;
4. OpenAPI/DTO schema fidelity, MCP exclusions, stable-name collision handling, and unsafe-shape rejection;
5. fixed executor dispatch with explicit `innerAccess: false`, normal guard/AOP execution, and no arbitrary route/header/state control;
6. fresh Passport/context isolation under concurrent different-subject and different-instance calls;
7. JSON result/error adaptation, timeout, idempotency, side-effect and transaction boundaries;
8. request/rate limits, redacted audit/telemetry, sensitive-data minimization, and disablement;
9. transport metadata/protocol behavior and absence of an implicit Zova/site dependency.

The first increment does not test deferred multipart/binary/streaming adapters as positive features; it tests that they are rejected or remain disabled. Provider live credentials, real customer data, raw tokens, and secrets are never used in retained evidence.

## Verification Model

### Narrow-scope verification

Run the smallest module-local unit/integration tests that own the changed invariant. Vona scoped tests must own an `app.bean.executor.mockCtx(...)` boundary. Every intentionally competing operation uses a separate `mockCtx(...)`; runner concurrency is not contention proof. Test-owned persisted resources are deleted in `finally` with precise owned identities and reverse dependency order.

### Contract verification

After Vona controller/DTO/OpenAPI/MCP metadata changes, inspect emitted OpenAPI and catalog output before any consumer or protocol test. Generated artifacts are never hand-edited. A future frontend or generated consumer must follow the documented forward/reverse contract loop; the current first increment has no Zova consumer.

### Full closure verification

Release requires protocol, OAuth, instance, direct authorization, catalog, dispatch, concurrency, redaction, limit, disablement, type, lint, format, and applicable root tests, with exact revision/environment/procedure/result/redacted artifact evidence. A passing MCP protocol smoke test cannot substitute for direct business authorization or cross-instance proof.

## Test Levels and Ownership Locations

| Test level                               | Purpose                                                                                           | Expected ownership                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Catalog/metadata unit tests              | OpenAPI projection, MCP metadata, exclusions, stable names, shape/risk classification             | Proposed `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/` and metadata owner tests |
| OAuth/resource integration tests         | Token validation, resource metadata, scope, local subject mapping, key/error cases                | Proposed `cabloy-mcp` tests plus approved OAuth integration owner                      |
| Instance/authorization integration tests | Host mapping, selector conflicts, RBAC/data scope, tenant isolation                               | Proposed `cabloy-mcp` tests and existing instance/guard owners                         |
| Dispatch/context tests                   | Fixed executor route, `innerAccess: false`, headers/options, Passport isolation, concurrent calls | Proposed `cabloy-mcp` tests and owning controller tests                                |
| Transaction/side-effect tests            | Domain transaction, timeout, retry/idempotency, irreversible operation policy                     | Owning domain module tests plus MCP adapter tests                                      |
| Protocol tests                           | Selected-version Streamable HTTP, metadata/discovery, tools/list, tools/call, errors, limits      | Proposed `cabloy-mcp` protocol tests                                                   |
| Operational tests                        | Rate limits, audit/telemetry, redaction, disablement, failure-closed behavior                     | Proposed `cabloy-mcp` operational tests and deployment checks                          |
| Root closure checks                      | Type, format, lint, tests, planning audit, chart freshness                                        | Root scripts and bounded release dossier                                               |

No Zova browser/E2E suite is required for the first increment. If a future operator/user UI is added, it needs separate ATPs and site-specific SSR/hydration proof.

## Fixtures, Cleanup, Privacy, and Data Minimization

### Minimum fixture set

Each applicable combination uses synthetic data and separate contexts for:

- instance A and instance B;
- subject A with allowed scope/RBAC/data ownership;
- subject B with different allowed scope and no ownership of A's resource;
- disabled/unmapped subject, ambiguous subject mapping, wrong-resource token, expired token, wrong issuer, insufficient scope, and valid token;
- approved endpoint host, unknown host, trusted proxy host, conflicting query/header selector, and token-instance mismatch;
- one safe JSON read candidate, one JSON mutation candidate, one destructive or side-effecting GET candidate, one MCP-excluded candidate, one API-excluded candidate, one multipart/binary/streaming/redirect/unsupported-shape candidate, and a duplicate-name candidate;
- valid, malformed, unknown, extra-field, oversized, route-like, header-like, tenant-like, and state-like tool arguments;
- downstream success, validation rejection, authorization rejection, timeout, rate-limit, controller error, executor error, and injected post-commit failure cases.

Fixtures must be created through the owning module's managed seed path when they are shared durable fixtures; test-owned resources are isolated and deleted in `finally`. No fixture contains a real OAuth secret, customer identity, bearer token, password, or usable external link.

### Evidence record

Every accepted ATP retains:

- linked PRD, SRS, WBS, and ATP IDs;
- source revision/commit, runtime/database/environment, endpoint host and instance where relevant;
- exact command or request procedure, fixture identities in redacted form, and concurrency interleaving;
- pass/fail result and durable redacted log, response, trace, screenshot, CI job, or artifact location;
- proof that tokens, secrets, passwords, raw sensitive payloads, and complete private data were not retained;
- owner, reason, compensating control, and expiry for any temporary waiver.

A planned command or code reading is not a result. No `evidence/` directory or `EVD-*` record is created before actual execution.

## Acceptance Scenario Catalogue

### ATP-MCP-TRANSPORT-01: Streamable HTTP protocol and protected-resource discovery

Setup:

- Use a synthetic configured MCP endpoint and approved resource metadata/authorization-server discovery values.
- Prepare valid messages for the selected protocol revision, including its required request metadata and discovery method; test unsupported content types/versions, missing authorization, oversized body, and unknown host. Do not add legacy session cases unless the accepted revision explicitly supports them.

Procedure:

- Request protected-resource metadata and verify only approved resource/discovery information is returned.
- Perform the selected revision's mandatory discovery RPC, tools/list, and a minimal tools/call with a valid synthetic token; perform `initialize` only if the accepted revision requires it.
- Repeat with malformed protocol, unsupported method/content negotiation, oversized input, unknown host, and any protocol/session identifier without valid authorization only if the accepted revision defines it.

Expected result:

- Supported exchanges are protocol-compliant; unsupported or malformed requests fail without controller dispatch.
- The selected protocol's discovery response and separate protected-resource metadata identify only approved resource/authorization information without secrets.
- Protocol state or session identifiers, if supported by the accepted revision, are not accepted as authorization; every protected request still authenticates.

Minimum proof:

- Retain accepted protocol revision and SDK configuration fingerprint, environment, exact HTTP/protocol exchanges with tokens redacted, dispatch counter, status/error classes, and redacted artifact location.

Traceability: `PRD-MCP-ACCESS-01`, `SRS-MCP-TRANSPORT-01`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-TRANSPORT-03`, `SRS-MCP-NFR-03`, `WBS-MCP-20-01`.

### ATP-MCP-AUTH-01: OAuth resource validation and failure-closed behavior

Setup:

- Prepare synthetic signed/introspected tokens for valid issuer/resource/subject/scope, wrong issuer, wrong audience/resource, expired/not-yet-valid, malformed signature, revoked/introspection-negative, missing subject, and missing scope.
- Configure protected-resource metadata with the canonical `resource` and at least one `authorization_servers` issuer identifier (not an authorization-server metadata URL), plus a local subject mapping for one instance.

Procedure:

- Call metadata, tools/list, and tools/call with each token state.
- Simulate key/introspection unavailability and ambiguous or disabled local subject mapping.

Expected result:

- Only the valid token independently verified as bound to the canonical resource proceeds to the next policy stage; a client-supplied `resource` parameter alone is not audience proof.
- Missing, invalid, expired, or wrong-resource tokens yield bounded HTTP `401`; insufficient scope yields bounded HTTP `403` at the HTTP authorization boundary. Unavailable, ambiguous, or disabled states fail closed with a separately approved nondiagnostic mapping; none permits anonymous fallback, controller dispatch, or cross-instance probing.
- Client errors are bounded; protected telemetry records a redacted reason class.

Minimum proof:

- Retain token-fixture labels (not token values), issuer/resource configuration fingerprint, expected/observed result, dispatch counts, and redacted audit artifact.

Traceability: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-NFR-01`, `WBS-MCP-20-02`.

### ATP-MCP-AUTH-02: Authorization intersection and call-time recheck

Setup:

- Prepare two local subjects with different roles/data ownership and OAuth tokens with narrow/broad scopes.
- Prepare tools enabled by deployment policy, excluded by policy, visible only to one role, and requiring a scope/data owner.

Procedure:

- Compare tools/list for each subject/token combination.
- Invoke visible and hidden tools, change or revoke a policy/role between list and call, and submit arguments targeting an unowned resource.

Expected result:

- List results reflect the current intersection of scope, deployment policy, Passport/RBAC, data scope, and risk rules.
- Hidden/changed/disallowed calls fail at call time; list visibility is not a reusable authorization grant.
- No response reveals whether an unrelated subject or out-of-scope resource exists beyond the approved nondiagnostic policy.

Minimum proof:

- Retain policy fixture labels, subject/tool visibility matrix, call outcomes, resource-scope assertions, and redacted audit records.

Traceability: `PRD-MCP-ACCESS-02`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-AUTH-02`, `SRS-MCP-AUTH-03`, `WBS-MCP-30-02`, `WBS-MCP-40-01`.

### ATP-MCP-INSTANCE-01: Host binding and cross-instance isolation

Setup:

- Configure synthetic canonical HTTPS endpoints and distinct resources for instances A and B, plus an unknown host, malformed/duplicate authority, unexpected port, direct-backend and trusted/untrusted forwarded-host/proto cases, and query/header selectors that agree or conflict with the endpoint.
- Prepare same-subject tokens authorized only for A, only for B, and with mismatched/absent verified instance claims; configure metadata routing/cache cases for both endpoint hosts.

Procedure:

- Exercise real HTTP metadata, tools/list, and tools/call against each host/selector/token combination, including the instance-initialization order, missing/disabled-instance rejection and cached-name behavior; compare ordinary non-MCP API routing before and after. The inner executor's instance lookup/readiness is not a substitute for the HTTP `initInstance()` admission check.
- Attempt to use an `iid`-like argument, host header, forwarded host/protocol, empty/default or duplicate query selector, or instance header to switch from A to B. Simulate a reverse-proxy cache hit for the wrong host's metadata.

Expected result:

- Only the approved host/resource/token/instance combination proceeds; each metadata response names only the configured resource and issuer for that host.
- Unknown hosts, untrusted proxy values, token-instance mismatches, and selectors fail under the accepted reject/ignore policy without default-instance fallback, wrong-instance metadata, unintended instance initialization, or controller dispatch. ADR 0004 proposes rejecting all MCP query/header instance selectors; accepting this behavior still requires DEC-MCP-04 approval.
- Business queries never use a caller-supplied instance field as authorization, and ordinary non-MCP routing remains unchanged.

Minimum proof:

- Retain synthetic host/resource/instance labels, proxy-ingress trust configuration fingerprint (without sensitive network settings), exact redacted HTTP requests and responses, expected/observed outcomes, metadata cache behavior, instance initialization/dispatch counters, and redacted artifacts. Do not mutate global `app.proxy` or request-origin settings in unit tests; use explicit `req` fixtures and environment-specific real HTTP tests.

Traceability: `PRD-MCP-IDENTITY-02`, `SRS-MCP-INSTANCE-01`, `SRS-MCP-INSTANCE-02`, `SRS-MCP-NFR-01`, `WBS-MCP-20-03`.

### ATP-MCP-CONTRACT-01: DTO/OpenAPI schema projection and freshness

Setup:

- Prepare an observed or execution-created enabled controller DTO/OpenAPI operation with representative path/query/body/response schema, one excluded/disabled router action, a referenced schema, and a distinct runtime-serialization or response-envelope case.
- Generate OpenAPI and the proposed MCP candidate/registry output from the same source revision and approved configuration fingerprint, with a second worker snapshot if multi-process serving is selected.

Procedure:

- Compare the declared MCP input/output schema, normalized references, actual enabled router identity, fixed controller/action/method/path mapping, and runtime response shape with emitted OpenAPI/DTO metadata.
- Change a source DTO/operation metadata field in a controlled revision, regenerate, and inspect OpenAPI-cache, HMR/restart, registry snapshot and second-worker freshness/drift behavior.
- Attempt to invoke an orphaned, excluded, disabled, stale, ambiguous, or wrong-worker registry entry; separately change role/policy after listing and try to call the formerly visible name.

Expected result:

- The candidate reflects approved DTO/OpenAPI truth through a deterministic transformation; no hand-edited generated consumer is required. An emitted single-action schema alone cannot admit a disabled or API-excluded router action.
- Drift, missing ownership, unsupported references/extensions, schema/serialization disagreement, worker mismatch, or stale entries fail the catalog check or prevent dispatch.
- Runtime does not silently retain an obsolete schema/route; revoking policy/role after list prevents subsequent call even when the structural snapshot remains valid.

Minimum proof:

- Retain source revision, effective route identity and generated schema diff, catalog/worker revision fingerprints, cache/rebuild procedure, negative dispatch counts, policy-revocation result, and redacted artifact path.

Traceability: `PRD-MCP-CONTRACT-01`, `SRS-MCP-CATALOG-01`, `SRS-MCP-API-01`, `SRS-MCP-API-02`, `WBS-MCP-30-01`.

### ATP-MCP-CONTRACT-02: MCP exclusion, metadata, and stable-name collisions

Setup:

- Prepare operations that are API-excluded (controller and action), MCP-excluded only, explicitly named, unnamed/unreviewed, duplicate-named, and annotated with risk/confirmation/output-adapter metadata. Include a refactor/rename case, an alternate locale, a controller/action metadata conflict, and a deployment-disabled entry.

Procedure:

- Build the catalog and inspect registered route, emitted operation, candidate, eligible, deployment-enabled, subject-visible, and call-authorized states separately.
- Change MCP metadata while leaving OpenAPI exposure intact; introduce a stable-name collision, a bean/action rename with an unchanged public tool name, an invalid schema reference, a metadata inheritance conflict, a locale change, and a disabled deployment policy.
- List tools under two subjects and instances, then change policy/role and retry a paginated cursor and `tools/call`; inspect the selected MCP revision's completed list fields, private caching rules, and bounded error classes.

Expected result:

- API-excluded operations never reappear in MCP; MCP-only exclusion hides an otherwise OpenAPI-visible operation, while ordinary OpenAPI/API behavior remains unchanged.
- An unannotated or unreviewed operation is not enabled; presentation text and risk hints are preserved only as reviewed metadata, not interpreted as authorization.
- A stable reviewed public name survives a checked internal refactor, and locale changes affect presentation only. Duplicate names, invalid metadata conflicts, and unsupported schemas fail deterministically; no nondeterministic winner is callable.
- A private, subject-filtered list (or its cursor/cache entry) never exposes another subject or instance's tools and cannot authorize a call after revocation; required list response fields match the approved protocol revision.

Minimum proof:

- Retain metadata/manifest fixture and source revision, catalog state and stable-name tables, collision/conflict diagnostics, locale/policy changes, redacted list/cache/call outcomes, and generated output.

Traceability: `PRD-MCP-CONTRACT-02`, `SRS-MCP-CATALOG-02`, `SRS-MCP-CATALOG-04`, `SRS-MCP-API-02`, `WBS-MCP-30-01`.

### ATP-MCP-CONTRACT-03: Unsafe shape and side-effect classification

Setup:

- Prepare JSON read/mutation operations (including reversible and confirmation-required mutations), a side-effecting GET, multipart/raw-body, binary, redirect, streaming, unsupported 201/202/204 status or envelope, arbitrary-URL/callback, and unclassified destructive operation.
- For each candidate, define a synthetic domain-owner review of route, request/response fields, guards/row scope, business and external effects, idempotency, reversibility, and proposed OAuth scope/deployment policy. Leave at least one candidate without review and one with misleading read-only metadata.

Procedure:

- Run candidate eligibility/classification and inspect `tools/list` under default policy and explicitly approved policy, with subject/instance/scope/role variants; change role/policy and try the same tool with owned and unowned row identifiers.
- Attempt calls for unsupported/unclassified/confirmation-required operations using a forged `confirm: true` argument or tool annotation; compare an individually reviewed JSON mutation that requires no per-call confirmation. Do not execute a destructive call just to classify or preview it.
- Check the runtime result of a supported 200-status action and the proposed output allowlist against OpenAPI/DTO; verify that source changes or unreviewed external effects invalidate prior risk approval.

Expected result:

- JSON-compatible, explicitly classified operations may become candidates, but only domain/operator-reviewed and deployment-approved read or bounded reversible operations may enter an enabled set; this plan itself does not approve one. Unsafe/unclassified/destructive/open-world shapes and misleading hints cannot enable or appear as safe reads; GET side effects are mutations.
- Confirmation-required operations remain disabled without an approved, server-verifiable, subject/client/instance/tool/arguments-bound and replay-safe grant; caller booleans, hints, a prior list, or optional elicitation alone do not grant one. Explicitly reviewed low-risk mutations without a per-call-confirmation requirement still face normal scope, RBAC, row scope, and audit checks.
- Excluded operations cannot be reached through a guessed tool name or route-like arguments, and neither list visibility nor broad scopes disclose an unrelated row. Unsupported executor statuses or unsafe result fields never fall back to raw data.

Minimum proof:

- Retain the per-operation review/classification and field-policy matrix, synthetic allowlist and configuration fingerprints, scope/role/row visibility and call outcomes, negative dispatch counters, and redacted diagnostics.

Traceability: `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-CATALOG-03`, `WBS-MCP-30-02`.

### ATP-MCP-CALL-01: Valid JSON tool call and result adaptation

Setup:

- Use one approved fixed registry entry backed by a synthetic 200-status controller operation with declared path/query/body mapping and JSON result; include an OpenAPI 200 envelope, an unwrapped executor result, a declared-field projection with an extra sensitive field, and optional `outputSchema`.
- Prepare valid and schema-invalid arguments, including unknown, nested override, route/host/tenant-like, and boundary values. Include approved object/array/scalar/null outputs and an unsupported status, non-finite number, oversized result, and output-schema mismatch.

Procedure:

- Call the tool with valid arguments, then malformed/unknown/oversized/extra arguments; verify that Vona raw-body parser limits are not incorrectly credited for a pre-populated executor body.
- Verify the controller receives only the declared mapped fields and inspect the actual unwrapped 200 value. Compare the OpenAPI/DTO response with the runtime result and the MCP-specific field allowlist after any Vona serializer.
- Inspect `structuredContent` and any compatibility JSON text block, then inject an extra secret field or result-shape mismatch after a synthetic mutation and check both external result and protected outcome classification.

Expected result:

- Valid input reaches the fixed operation and returns only the reviewed, bounded JSON value; any published output schema matches `structuredContent` for objects, arrays, scalars, or null as individually approved. Text content, if supplied, derives from the same filtered value.
- Invalid input is rejected before business dispatch; unknown/dangerous fields cannot alter route or state. DTO metadata and Vona serialization do not substitute for the MCP result allowlist.
- An unsupported status, undeclared sensitive field, unsafe value, or schema mismatch does not leak through a raw-result or text fallback. A post-execution filtering failure does not claim the domain mutation was rolled back or auto-retry it.

Minimum proof:

- Retain synthetic request/result and field-projection matrix, mapping and route validation assertions, status/dispatch and side-effect counters, structured/text/schema comparisons, protected outcome classification, and redacted logs.

Traceability: `PRD-MCP-ACCESS-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `SRS-MCP-TRANSPORT-03`, `WBS-MCP-40-01`.

### ATP-MCP-CALL-02: Guarded fixed dispatch and executor-option rejection

Setup:

- Use an operation with an observable existing controller guard/RBAC requirement and a fixed registry entry.
- Attempt arguments or protocol fields representing method, URL, host, Authorization, cookies, forwarded headers, instance, `innerAccess`, onions, `authToken`, or arbitrary state.

Procedure:

- Call as an authorized subject and an unauthorized subject.
- Repeat with every forged execution-control input, including a query token key, and inspect the **inner action** invocation options and guard behavior. Verify the exact registered route, guard/AOP chain and action-context RBAC decision; separately check that MCP admission enforces enabled-instance and body-size/security controls not rerun by router-only dispatch.

Expected result:

- The adapter invokes the known method/path with `innerAccess: false` on the action, not just an outer context; normal route guard/AOP authorization remains effective with a fresh local mapped Passport.
- Caller-controlled execution options are rejected before dispatch and never reach the executor; token-in-query, inherited HTTP Passport, and `extraData.state` cannot substitute another principal.
- Unauthorized calls fail without a trusted inner-access bypass; router-only tests are not counted as real HTTP admission proof.

Minimum proof:

- Retain redacted executor-option capture, guard invocation/result, route identity, matched instance and Passport labels, query-token denial, caller input class, admission control coverage, and audit artifact.

Traceability: `PRD-MCP-SAFETY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-03`, `WBS-MCP-40-01`.

### ATP-MCP-CALL-03: Concurrent context, Passport, and side-effect isolation

Setup:

- Prepare subjects A/B and instances A/B with distinct visible resources, fixed tools, separate `mockCtx(...)` contexts, and a transaction/side-effect fixture.
- Include interleavings where one request is authenticated or reaches a guard while the other begins dispatch. Create shared setup separately, then launch each contender inside its own **top-level** `mockCtx(...)` boundary; do not nest competitors inside one parent transaction.

Procedure:

- Launch explicitly competing calls with different subjects/instances and controlled barriers, and verify the effective instance, Passport, action-context RBAC decision and datasource/transaction ownership for each.
- Inject downstream validation, a response lost after commit, a post-commit success-callback rejection, a context-completion failure, result-filter failure and non-idempotent side-effect failure where the owning domain supports them; separately test deadline/disconnect with a real HTTP transport fixture. Attempt a duplicate client submission after an uncertain result only for a reviewed domain-safe test operation.
- Inspect Passport/state/header identity and combined durable outcome after all calls settle; separately compare execution outcome, result delivery, redacted audit class and any permitted domain reconciliation. Delete precise test-owned persisted resources in `finally` in reverse dependency order.

Expected result:

- No call observes another request's Passport, state, headers, arguments, instance, transaction store, authorization result or audit identity.
- At most the contract-defined durable side effect occurs; deadlines/disconnects or post-execution callback/filter failures do not automatically duplicate non-idempotent work. Operations lacking a reviewed idempotency/recovery policy remain disabled.
- Failure results match the documented transaction/recovery boundary, never claim false success or automatic rollback after commit, and do not reveal rejected output. The real HTTP fixture demonstrates bounded completion/accounting independently of executor-only tests.

Minimum proof:

- Retain explicit interleaving, separate-context/datasource identifiers, durable final state, failure injection and duplicate-submit outcome, guarded route and real HTTP classifications, and redacted telemetry; test runner concurrency alone is not contention proof.

Traceability: `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-DISPATCH-04`, `SRS-MCP-DISPATCH-05`, `SRS-MCP-PRIVACY-01`, `WBS-MCP-40-02`.

### ATP-MCP-OPS-01: Limits, audit, telemetry, and sensitive-data redaction

Setup:

- Configure synthetic, separately reviewed preauth header/body/parser and request budgets, JSON argument/structure and list/result limits, keyed rate and in-flight limits, and execution/cleanup deadlines; configure an approved protected audit sink and separate telemetry/exporters. Keep live secret/configuration values out of evidence.
- Prepare successful, validation, auth, instance, policy, downstream, timeout, post-commit filtering/audit failure, disconnect, and internal-failure calls containing synthetic sensitive-looking values; use independent subjects, clients, instances and tool classes, plus the approved worker topology.

Procedure:

- Exceed each approved ingress/JSON/catalog/result/time/concurrency/rate limit, including preauth requests, per-subject/client/instance/tool dimensions, multiple workers where applicable, and a quota-backend failure/stall or restart. Prove whether denial occurs before dispatch and whether result rejection follows an already committed effect.
- Inject sink delivery/ack failure before state-changing admission; check read/list outage behavior against the approved policy. Trigger disconnect/deadline while an owned operation remains active, and check slot/accounting and eventual domain outcome without auto-replay.
- Inspect real HTTP protocol/error responses, dedicated HTTP file logs, platform/SDK/proxy and nested route/AOP error-and-argument/token/ORM SQL debug logs, trace exceptions, metrics, protected audit records, external exporters and retained test artifacts, including debug and nonproduction error modes. Search each approved sink for bearer tokens, cookies, passwords, hashes, raw OAuth claims, raw arguments/results, complete private payloads, usable links and high-cardinality identity labels; verify MCP correlation independently of optional telemetry and caller-supplied request IDs.

Expected result:

- Limits and required sink/backend failures reject safely at the approved stage without cross-subject leakage, unintended controller side effects for pre-dispatch denials, or untracked active work; result rejection or timeout does not imply rollback or permit MCP replay.
- Protected audit delivery and operator telemetry preserve the approved, pseudonymous event/outcome classes; clients receive bounded nondiagnostic errors. Actual settled and unknown states remain distinguishable.
- No prohibited secret or sensitive value is retained; ordinary non-MCP routes remain unchanged by MCP limit/disablement policy.

Minimum proof:

- Retain the approved numeric/key/window matrix, source/configuration/worker/sink fingerprints, ingress and dispatch counters, explicit in-flight/settlement interleaving, sink-failure procedure, safe event samples, per-sink redaction searches, and redacted artifact locations. This is a future ATP, not evidence from this planning draft.

Traceability: `PRD-MCP-SAFETY-03`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-OPS-01`, `SRS-MCP-OPS-02`, `SRS-MCP-TRANSPORT-03`, `WBS-MCP-50-01`.

### ATP-MCP-OPS-02: Disablement and configuration fail-closed behavior

Setup:

- After a separately approved scaffold exists, inspect the generated `5.0.0` suite/module manifests, suite `workspace:^` module dependency, module `a-vona: 5.0.0` lifecycle dependency, absence of MCP-owned `fileVersion`/schema, and discovered/generated application registration; do not substitute planning text for observed output.
- Prepare default module configuration (`enabled: false`), literal application `CABLOY_MCP_ENABLED=true` opt-in, non-`true` inputs, enabled/disabled endpoint and per-tool policy states, missing OAuth configuration, missing host mapping, invalid registry/adapter, and ordinary HTTP calls to the same underlying controller.

Procedure:

- Confirm the generated module is discoverable without handwritten registration, then compare default-off behavior, non-`true` inputs, and explicit application opt-in; remove each required MCP security configuration item and attempt list/call operations.
- Disable the endpoint and individual tool, then call the ordinary HTTP API with its normal authentication before and after MCP disablement.

Expected result:

- The actual generated manifests and registration match DEC-MCP-01; mere module discovery never enables MCP. Default-off, non-`true` inputs, and incomplete opt-in all fail closed without business-controller dispatch.
- Disabled or incomplete MCP configuration returns stable unavailable/failure-closed results and never invokes a business controller.
- Ordinary HTTP authorization and behavior are unchanged by MCP disablement.
- Operator telemetry identifies the configuration class without exposing secret values.

Minimum proof:

- Retain source revision, generated manifest/registration excerpts, default/override configuration state labels (not secret values), dispatch counters, ordinary HTTP comparison, result classes, and redacted operator artifact.

Traceability: `PRD-MCP-SAFETY-04`, `SRS-MCP-OPS-03`, `SRS-MCP-OPS-04`, `SRS-MCP-UI-01`, `SRS-MCP-UI-02`, `WBS-MCP-50-02`.

## Contract, SSR, Browser, and Integration Procedures

The first increment has no Zova SSR/browser procedure. After implementation, use the narrowest applicable command and record actual results in a bounded execution dossier. Prospective command families verified during planning include:

```bash
# Vona module-local or selected backend tests, after the proposed module exists
npm run vona -- :bin:test -- <selected-cabloy-mcp-tests> --flavor=normal

# Type and root checks as applicable
npm run tsc
npm run lint
npm run format
npm run test

# Planning authority and derived chart checks
npm run spec:check -- cabloy-mcp
npm run spec:charts -- cabloy-mcp
npm run spec:charts:check -- cabloy-mcp
```

The exact generated module test command, protocol harness, OAuth test provider, and deployment integration command remain execution-dossier decisions. Do not run database reset, provider operation, deployment, or acceptance tests automatically as a consequence of generating this plan.

If a future Zova interface is added, its affected Web/Admin SSR and REST artifacts must be built together and synchronized through `npm run deps:vona`; browser ATPs must separately prove each audience/site contract.

## Commands

Planning commands are separate from runtime proof:

- `npm run spec:check -- cabloy-mcp` validates planning definition/reference/link structure.
- `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp` validate complete supported chart inputs and freshness.
- The implementation commands above are prospective only until an approved execution dossier runs them and retains evidence.

## Release Closure Gate

Release is blocked until:

- ADR 0001 is accepted and concrete module/OAuth/host/registry designs have separate approvals;
- every applicable PRD/SRS/WBS/ATP chain has an owner and passing, revision-bound, redacted evidence;
- OAuth resource validation, subject mapping, instance binding, direct authorization, list/call recheck, fixed dispatch, and context isolation pass independently;
- unsafe shapes, destructive/unclassified operations, arbitrary execution controls, and stale registry entries are proven unavailable;
- limits, audit, redaction, disablement, configuration fail-closed behavior, and ordinary-HTTP non-regression pass;
- no expired waiver, unresolved critical `TODO(confirm)`, unreviewed provider/host trust issue, or source/schema drift remains;
- production endpoint/resource metadata, OAuth issuer, secrets, host-instance mapping, tool policy, and operational ownership are explicitly configured and approved.

## Related Records

- [A-MCP planning index](./README.md)
- [A-MCP PRD](./prd.md)
- [A-MCP SRS](./srs.md)
- [A-MCP PDP/WBS](./pdp-wbs.md)
- [A-MCP progress](./progress.md)
- [A-MCP ADR 0001](./decisions/0001-mcp-suite-boundaries.md)
- [A-MCP ADR 0004 (proposed)](./decisions/0004-mcp-host-instance-binding.md)
- [A-MCP ADR 0005 (proposed)](./decisions/0005-mcp-tool-catalog-registry.md)
- [A-MCP ADR 0006 (proposed)](./decisions/0006-mcp-tool-eligibility-risk-results.md)
- [A-MCP ADR 0007 (proposed)](./decisions/0007-mcp-context-passport-executor.md)
- [A-MCP ADR 0008 (proposed)](./decisions/0008-mcp-limits-audit-telemetry-redaction.md)
