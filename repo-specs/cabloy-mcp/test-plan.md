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
| Protocol tests                           | Streamable HTTP, metadata, initialize, tools/list, tools/call, errors, limits                     | Proposed `cabloy-mcp` protocol tests                                                   |
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
- Prepare valid protocol messages, unsupported content types/versions, missing authorization, oversized body, unknown host, and session/stateless variants according to the selected design.

Procedure:

- Request protected-resource metadata and verify only approved resource/discovery information is returned.
- Perform initialize, tools/list, and a minimal tools/call with a valid synthetic token.
- Repeat with malformed protocol, unsupported method/content negotiation, oversized input, unknown host, and a session identifier without valid authorization.

Expected result:

- Supported exchanges are protocol-compliant; unsupported or malformed requests fail without controller dispatch.
- Resource metadata identifies the configured resource and authorization discovery without secrets.
- Session state, if selected, is not accepted as authorization; every request still authenticates.

Minimum proof:

- Retain revision, environment, exact HTTP/protocol exchanges with tokens redacted, dispatch counter, status/error classes, and redacted artifact location.

Traceability: `PRD-MCP-ACCESS-01`, `SRS-MCP-TRANSPORT-01`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-TRANSPORT-03`, `SRS-MCP-NFR-03`, `WBS-MCP-20-01`.

### ATP-MCP-AUTH-01: OAuth resource validation and failure-closed behavior

Setup:

- Prepare synthetic signed/introspected tokens for valid issuer/resource/subject/scope, wrong issuer, wrong audience/resource, expired/not-yet-valid, malformed signature, revoked/introspection-negative, missing subject, and missing scope.
- Configure approved resource metadata and a local subject mapping for one instance.

Procedure:

- Call metadata, tools/list, and tools/call with each token state.
- Simulate key/introspection unavailability and ambiguous or disabled local subject mapping.

Expected result:

- Only the valid resource-bound token proceeds to the next policy stage.
- Invalid, stale, wrong-resource, missing-scope, unavailable, ambiguous, or disabled states fail closed without anonymous fallback, controller dispatch, or cross-instance probing.
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

- Configure synthetic endpoint hosts for instances A and B, an unknown host, trusted and untrusted forwarded-host cases, and conflicting query/header selectors.
- Prepare same-subject tokens authorized only for A, only for B, and with mismatched/absent instance claims.

Procedure:

- Perform metadata, tools/list, and tools/call against each host/selector/token combination.
- Attempt to use an `iid`-like argument, host header, forwarded host, query selector, or instance header to switch from A to B.

Expected result:

- Only the approved host/token/instance combination proceeds.
- Unknown hosts, untrusted proxy values, token-instance mismatches, and conflicting selectors fail or follow the explicitly approved reject/ignore policy without scope expansion.
- Business queries never use a caller-supplied instance field as authorization.

Minimum proof:

- Retain canonicalized host/instance labels, proxy trust configuration fingerprint, expected/observed outcomes, domain lookup/dispatch trace, and redacted artifacts.

Traceability: `PRD-MCP-IDENTITY-02`, `SRS-MCP-INSTANCE-01`, `SRS-MCP-INSTANCE-02`, `SRS-MCP-NFR-01`, `WBS-MCP-20-03`.

### ATP-MCP-CONTRACT-01: DTO/OpenAPI schema projection and freshness

Setup:

- Prepare an observed or execution-created controller DTO/OpenAPI operation with representative path/query/body/response schema.
- Generate OpenAPI and the proposed MCP candidate/registry output from the same source revision.

Procedure:

- Compare declared MCP input/output schema and mapping with emitted OpenAPI/DTO metadata.
- Change a source DTO/operation metadata field in a controlled revision, regenerate, and inspect catalog freshness/drift behavior.
- Attempt to invoke an orphaned or stale registry entry.

Expected result:

- The candidate reflects approved DTO/OpenAPI truth through a deterministic transformation; no hand-edited generated consumer is required.
- Drift, missing ownership, unsupported references, or stale entries fail the catalog check or prevent dispatch.
- Runtime does not silently retain an obsolete schema/route.

Minimum proof:

- Retain source revision, generated schema diff, catalog revision/fingerprint, command/procedure, drift result, and redacted artifact path.

Traceability: `PRD-MCP-CONTRACT-01`, `SRS-MCP-CATALOG-01`, `SRS-MCP-API-01`, `SRS-MCP-API-02`, `WBS-MCP-30-01`.

### ATP-MCP-CONTRACT-02: MCP exclusion, metadata, and stable-name collisions

Setup:

- Prepare operations that are API-excluded, MCP-excluded only, explicitly named, unnamed, duplicate-named, and annotated with risk/confirmation/output-adapter metadata.

Procedure:

- Build the catalog and inspect each candidate/registry state.
- Change MCP metadata while leaving OpenAPI exposure intact, and introduce a stable-name collision.

Expected result:

- API-excluded operations never reappear in MCP.
- MCP-only exclusion hides an otherwise OpenAPI-visible operation.
- Metadata is preserved in the tool definition and policy registry.
- Duplicate names fail deterministically; no nondeterministic winner is callable.

Minimum proof:

- Retain metadata fixture/source revision, catalog state table, collision diagnostic, and redacted generated output.

Traceability: `PRD-MCP-CONTRACT-02`, `SRS-MCP-CATALOG-02`, `SRS-MCP-CATALOG-04`, `SRS-MCP-API-02`, `WBS-MCP-30-01`.

### ATP-MCP-CONTRACT-03: Unsafe shape and side-effect classification

Setup:

- Prepare JSON read/mutation operations, a side-effecting GET, multipart/raw-body, binary, redirect, streaming, unsupported status/envelope, arbitrary-URL, and unclassified destructive operation.

Procedure:

- Run candidate eligibility/classification and inspect `tools/list` under default policy and explicitly approved policy.
- Attempt calls for excluded/unsupported operations and compare a safe JSON operation.

Expected result:

- JSON-compatible, explicitly classified operations can become candidates; unsafe/unclassified shapes remain excluded or require a reviewed adapter.
- GET side effects are not marked read-only by method.
- Excluded operations cannot be reached through a guessed tool name or route-like arguments.

Minimum proof:

- Retain classification matrix, policy configuration fingerprint, list/call outcomes, and redacted diagnostics.

Traceability: `PRD-MCP-CONTRACT-03`, `PRD-MCP-SAFETY-01`, `SRS-MCP-CATALOG-03`, `WBS-MCP-30-02`.

### ATP-MCP-CALL-01: Valid JSON tool call and result adaptation

Setup:

- Use one approved fixed registry entry backed by a synthetic controller operation with declared path/query/body mapping and JSON result.
- Prepare valid and schema-invalid arguments, including unknown and boundary values.

Procedure:

- Call the tool with valid arguments, then malformed/unknown/oversized/extra arguments.
- Verify the controller receives only the declared mapped fields and inspect the MCP result.

Expected result:

- Valid input reaches the fixed operation and returns the declared MCP result semantics.
- Invalid input is rejected before business dispatch; unknown/dangerous fields cannot alter route or state.
- Envelope unwrapping/response transformation follows the approved adapter contract.

Minimum proof:

- Retain synthetic request/result, mapping assertions, dispatch counter, response classification, and redacted logs.

Traceability: `PRD-MCP-ACCESS-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-02`, `SRS-MCP-TRANSPORT-03`, `WBS-MCP-40-01`.

### ATP-MCP-CALL-02: Guarded fixed dispatch and executor-option rejection

Setup:

- Use an operation with an observable existing controller guard/RBAC requirement and a fixed registry entry.
- Attempt arguments or protocol fields representing method, URL, host, Authorization, cookies, forwarded headers, instance, `innerAccess`, onions, `authToken`, or arbitrary state.

Procedure:

- Call as an authorized subject and an unauthorized subject.
- Repeat with every forged execution-control input and inspect executor invocation options and guard behavior.

Expected result:

- The adapter invokes the known method/path with `innerAccess: false`; normal guard/AOP authorization remains effective.
- Caller-controlled execution options are stripped/rejected and never reach executor dispatch.
- Unauthorized calls fail without a trusted inner-access bypass.

Minimum proof:

- Retain redacted executor-option capture, guard invocation/result, route identity, caller input class, and audit artifact.

Traceability: `PRD-MCP-SAFETY-01`, `PRD-MCP-IDENTITY-03`, `SRS-MCP-DISPATCH-01`, `SRS-MCP-DISPATCH-03`, `WBS-MCP-40-01`.

### ATP-MCP-CALL-03: Concurrent context, Passport, and side-effect isolation

Setup:

- Prepare subjects A/B and instances A/B with distinct visible resources, fixed tools, separate `mockCtx(...)` contexts, and a transaction/side-effect fixture.
- Include interleavings where one request is authenticated or reaches a guard while the other begins dispatch.

Procedure:

- Launch explicitly competing calls with different subjects/instances and controlled barriers.
- Inject downstream validation, timeout, transaction, post-commit, and non-idempotent side-effect failures where the owning domain supports them.
- Inspect Passport/state/header identity and combined durable outcome after all calls finish.

Expected result:

- No call observes another request's Passport, state, headers, arguments, instance, or audit identity.
- At most the contract-defined durable side effect occurs; retries/timeouts do not duplicate non-idempotent work.
- Failure results match the documented transaction/recovery boundary and never claim false success.

Minimum proof:

- Retain explicit interleaving, separate-context identifiers, durable final state, failure injection, result classes, and redacted telemetry.

Traceability: `PRD-MCP-SAFETY-02`, `PRD-MCP-SAFETY-03`, `SRS-MCP-DISPATCH-04`, `SRS-MCP-DISPATCH-05`, `SRS-MCP-PRIVACY-01`, `WBS-MCP-40-02`.

### ATP-MCP-OPS-01: Limits, audit, telemetry, and sensitive-data redaction

Setup:

- Configure synthetic request/body/result/concurrency/time/rate limits and redacted audit/telemetry sinks.
- Prepare successful, validation, auth, instance, policy, downstream, timeout, and internal-failure calls containing synthetic sensitive-looking values.

Procedure:

- Exceed each approved limit by subject/client/instance/tool dimension.
- Inspect protocol responses, application logs, traces, metrics, audit records, and retained test artifacts.
- Search for bearer tokens, cookies, passwords, hashes, raw OAuth claims, complete private payloads, and usable links.

Expected result:

- Limits reject safely without cross-subject leakage or unintended controller side effects.
- Operators can distinguish error classes through redacted protected telemetry; clients receive bounded nondiagnostic errors.
- No prohibited secret or sensitive value is retained.

Minimum proof:

- Retain configuration fingerprint, redacted event samples, limit counters, search procedure/result, and artifact location.

Traceability: `PRD-MCP-SAFETY-03`, `SRS-MCP-PRIVACY-01`, `SRS-MCP-OPS-01`, `SRS-MCP-OPS-02`, `SRS-MCP-TRANSPORT-03`, `WBS-MCP-50-01`.

### ATP-MCP-OPS-02: Disablement and configuration fail-closed behavior

Setup:

- Prepare enabled/disabled endpoint and per-tool policy states, missing OAuth configuration, missing host mapping, invalid registry/adapter, and ordinary HTTP calls to the same underlying controller.

Procedure:

- Disable the endpoint and individual tool, remove each required MCP configuration item, and attempt list/call operations.
- Call the ordinary HTTP API with its normal authentication before and after MCP disablement.

Expected result:

- Disabled or incomplete MCP configuration returns stable unavailable/failure-closed results and never invokes a business controller.
- Ordinary HTTP authorization and behavior are unchanged by MCP disablement.
- Operator telemetry identifies the configuration class without exposing secret values.

Minimum proof:

- Retain configuration state labels, dispatch counters, ordinary HTTP comparison, result classes, and redacted operator artifact.

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
