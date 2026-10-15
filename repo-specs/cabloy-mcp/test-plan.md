# A-MCP Test Strategy and Acceptance Plan

## Purpose and Authority

This plan defines verification strategy, executable acceptance scenarios, fixtures, evidence requirements, and release proof for the accepted overall `cabloy-mcp` remote access design, whose source and runtime proof remain pending. It completes the traceability chain:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

The [PRD](./prd.md) owns product outcomes; the [SRS](./srs.md) owns technical contracts; the [PDP/WBS](./pdp-wbs.md) owns sequencing and completion checks. `ATP-MCP-*` declarations are scenarios, not evidence or status. Planning, static audits, and chart generation never prove runtime acceptance.

## Scope, Quality Priorities, and Risk

Verification prioritizes:

1. MCP-profile access-token resource/expiry/scope validation, current token lookup, and local-subject mapping;
2. trusted endpoint-host to instance binding, forwarded-host behavior, and selector conflict rejection;
3. candidate-vs-enabled-vs-visible-vs-call-authorized tool separation;
4. OpenAPI/DTO schema fidelity, MCP exclusions, stable-name collision handling, and unsafe-shape rejection;
5. fixed executor dispatch with explicit `innerAccess: false`, normal guard/AOP execution, and no arbitrary route/header/state control;
6. fresh Passport/context isolation under concurrent different-subject and different-instance calls;
7. JSON result/error adaptation, timeout, idempotency, side-effect and transaction boundaries;
8. request/rate limits, redacted audit/telemetry, sensitive-data minimization, and disablement;
9. transport metadata/protocol behavior and absence of an implicit Zova/site dependency for the MCP resource endpoint; the separately selected AS Zova interaction needs its own browser proof.

The first increment does not test deferred multipart/binary/streaming adapters as positive features; it tests that they are rejected or remain disabled. Provider live credentials, real customer data, raw tokens, and secrets are never used in retained evidence.

## Verification Model

### Narrow-scope verification

Run the smallest module-local unit/integration tests that own the changed invariant. Vona scoped tests must own an `app.bean.executor.mockCtx(...)` boundary. Every intentionally competing operation uses a separate `mockCtx(...)`; runner concurrency is not contention proof. Test-owned persisted resources are deleted in `finally` with precise owned identities and reverse dependency order.

### Contract verification

After Vona controller/DTO/OpenAPI/MCP metadata changes, inspect emitted OpenAPI and catalog output before any consumer or protocol test. Generated artifacts are never hand-edited. The MCP resource endpoint has no Zova consumer; the selected AS authorization presentation requires the documented forward/reverse contract loop after its APIs and site/flavor are approved.

### Full closure verification

Release requires protocol, OAuth, instance, direct authorization, catalog, dispatch, concurrency, redaction, limit, disablement, type, lint, format, and applicable root tests, with exact revision/environment/procedure/result/redacted artifact evidence. A passing MCP protocol smoke test cannot substitute for direct business authorization or cross-instance proof.

## Test Levels and Ownership Locations

| Test level                               | Purpose                                                                                                                                    | Expected ownership                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Catalog/metadata unit tests              | OpenAPI projection, MCP metadata, exclusions, stable names, shape/risk classification                                                      | Proposed `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/` and metadata owner tests                           |
| OAuth/resource integration tests         | Token validation, resource metadata, scope, local subject mapping, key/error cases                                                         | Proposed `cabloy-mcp` tests plus approved OAuth integration owner                                                |
| Authorization-server integration tests   | Metadata, code/PKCE/pre-registered clients, resource-bound issuance, approved shared grant/token state, revocation and no-refresh behavior | Selected integrated `a-auth` logical AS (`zhennann` implementation/operations) under blocked WBS-MCP-20-04 scope |
| Instance/authorization integration tests | Host mapping, selector conflicts, RBAC/data scope, tenant isolation                                                                        | Proposed `cabloy-mcp` tests and existing instance/guard owners                                                   |
| Dispatch/context tests                   | Fixed executor route, `innerAccess: false`, headers/options, Passport isolation, concurrent calls                                          | Proposed `cabloy-mcp` tests and owning controller tests                                                          |
| Transaction/side-effect tests            | Domain transaction, timeout, retry/idempotency, irreversible operation policy                                                              | Owning domain module tests plus MCP adapter tests                                                                |
| Protocol tests                           | Selected-version Streamable HTTP, metadata/discovery, tools/list, tools/call, errors, limits                                               | Proposed `cabloy-mcp` protocol tests                                                                             |
| Operational tests                        | Rate limits, audit/telemetry, redaction, disablement, failure-closed behavior                                                              | Proposed `cabloy-mcp` operational tests and deployment checks                                                    |
| Root closure checks                      | Type, format, lint, tests, planning audit, chart freshness                                                                                 | Root scripts and bounded release dossier                                                                         |

No Zova browser/E2E suite is required for the MCP resource-server module itself. The selected integrated `a-auth` logical AS has a Zova-presented per-request authorization interaction; it needs separately approved site/admission and browser/session/CSRF contracts and AS-owned `ATP-MCP-AUTH-03` SSR/hydration and grant-flow proof, without assuming an independent site. The first profile uses explicit approval or denial per request, not remembered consent. Any later general operator/management UI needs its own scoped acceptance and site-specific proof.

## Fixtures, Cleanup, Privacy, and Data Minimization

### Minimum fixture set

Each applicable combination uses synthetic data and separate contexts for:

- instance A and instance B;
- subject A with allowed scope/RBAC/data ownership;
- subject B with different allowed scope and no ownership of A's resource;
- disabled/unmapped subject, ambiguous subject mapping, wrong-resource token, expired/inactive/revoked opaque token, token-lookup outage, wrong issuer, insufficient scope, and valid token;
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

- Use a synthetic configured MCP endpoint and, for the metadata handoff, approved resource metadata/authorization-server discovery values; DEC-MCP-03/04 acceptance and their separate ATPs remain necessary for actual metadata/host authorization closure.
- Prepare valid 2026-07-28-profile `server/discover`, tools/list, and tools/call requests with required `_meta` and mirrored headers plus JSON and request-scoped SSE negotiation. Record the accepted design's SDK versions and explicit `legacy: 'reject'` setting once installed in a separately approved execution; do not use `initialize` as a valid-profile handshake.
- Prepare malformed/omitted `_meta` and headers, mismatches, unsupported versions, unknown RPC method and tool, malformed RPC request versus invalid tool input, header-safe/unsafe/sentinel-shaped `Mcp-Name`, unsupported content types, oversized bodies, POST `X-HTTP-Method-Override`, invalid Origin, GET/DELETE, and legacy session/resumption headers. Test missing authorization and unknown host only against approved DEC-MCP-03/04 policies, not as transport-only proof.

Procedure:

- Request protected-resource metadata and verify approved resource/discovery values only after their DEC-MCP-03/04 owners select them; do not treat this test alone as acceptance of their policy or instance binding.
- After separate design acceptance and execution approval, inspect the installed SDK versions, generated dependency owner and compilation; verify the handler factory creates a fresh server per request and `legacy: 'reject'` behavior under overlapping requests, including any legacy-classified notification response without dispatch.
- Over real HTTP, perform `server/discover`, tools/list, and a minimal tools/call with a valid synthetic token under the separately approved OAuth/host fixture; exercise JSON and request-scoped SSE, including a disconnect and work that settles later. Test request-scope disposal and native error/response writer behavior before and after headers, with no duplicate or framework-wrapped response.
- Repeat with missing or mismatched `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name`, decoded Base64/sentinel-shaped names, missing required `_meta` in a claimed modern request versus an unclassified legacy request, missing required client capability, unsupported version, unknown RPC method versus unknown tool versus malformed call versus invalid tool input versus tool-execution failure, invalid Origin, and oversized/unsupported representations. Submit POST with `X-HTTP-Method-Override: GET` and `DELETE` and confirm no method remapping or business dispatch; test GET/DELETE and ignored `Mcp-Session-Id`/`Last-Event-ID` without enabling legacy behavior. Test missing authorization/unknown host against separately approved DEC-MCP-03/04 decisions.

Expected result:

- Supported exchanges are protocol-compliant; malformed/missing mirrored headers yield HTTP `400` / JSON-RPC `-32020`, unsupported version `400` / `-32022`, missing required `_meta` on a modern-profile request `400` / `-32602`, missing required client capability `400` / `-32021`, and an unknown RPC method `404` / `-32601`. An unknown tool or malformed RPC call is a protocol error, while tool-input validation or execution failure after a valid call follows the tool-result `isError` contract. No invalid/method-overridden request dispatches a business controller.
- Modern-only mode rejects a well-formed `initialize` request as an unimplemented method, answers GET/DELETE with the chosen `405`, and ignores session/resumption headers without accepting them as authority. Legacy-classified notifications must not dispatch; record their actual response rather than assuming every legacy message is rejected with an error. An invalid present Origin yields `403` even when unauthenticated, without Vona rewriting it to `401`; bounded body handling remains effective when Vona's ordinary parser is bypassed.
- Native JSON/SSE/error responses are not enveloped or rewritten by Vona; disconnect signaling, actual work settlement, context disposal, and post-effect outcomes are observed separately rather than inferring rollback from a closed socket.
- The selected protocol's discovery response and, after separate DEC-MCP-03/04 approval, protected-resource metadata identify only approved resource/authorization information without secrets. Every protected request still authenticates; this scenario does not itself approve OAuth or host-to-instance policy.

Minimum proof:

- Retain accepted protocol revision and SDK/legacy-mode configuration fingerprint, source revision, environment, exact real-HTTP JSON/SSE, header, method-override, Origin, error and disconnect procedures with synthetic/redacted tokens, dispatch counter, status and JSON-RPC codes, context/work-settlement observations, and durable redacted artifact location. Document which metadata/host/auth decisions and ATPs are still separately open.

Traceability: `PRD-MCP-ACCESS-01`, `SRS-MCP-TRANSPORT-01`, `SRS-MCP-TRANSPORT-02`, `SRS-MCP-TRANSPORT-03`, `SRS-MCP-NFR-03`, `WBS-MCP-20-01`.

### ATP-MCP-AUTH-01: OAuth resource validation and failure-closed behavior

Setup:

- Prepare synthetic MCP-profile opaque access-token lookup results for valid issuer/resource/subject/scope/instance, wrong issuer, wrong resource, expired/inactive/revoked state, missing subject, missing scope, ambiguous mapping, and lookup/introspection outage. If a JWT/JWKS alternative is separately selected, add its signed-token and key-rotation fixtures as an explicit branch rather than as the default profile.
- Configure protected-resource metadata with the canonical `resource` and at least one `authorization_servers` issuer identifier (not an authorization-server metadata URL), plus a local subject mapping for one instance.
- Prepare a synthetic credential distinguishable from an MCP access token for the negative resource-server case. The first profile issues no refresh tokens; AS no-refresh behavior belongs to `ATP-MCP-AUTH-03`, not this resource-server fixture.

Procedure:

- Call metadata, tools/list, and tools/call with each token state.
- Simulate token lookup/introspection unavailability, stale or ambiguous token state, and ambiguous or disabled local subject mapping. Send a synthetic refresh credential to the MCP resource endpoint as a negative test and confirm rejection; do not exercise AS issuance or refresh here. If JWT/JWKS is later selected, separately simulate a required JWKS refresh failure while a previously fetched key remains cached.

Expected result:

- Only the active MCP-profile access token whose current lookup/introspection state confirms the canonical resource, subject, scope, instance, expiry, and revocation status proceeds to the next policy stage; a client-supplied `resource` parameter alone is not proof of binding.
- Lookup/introspection outage, stale authorization state, and ambiguous grant state deny without using a stale cache or permitting controller dispatch. A refresh credential is rejected at the MCP resource endpoint. A client without a refresh token may use its valid access token until expiry and then needs reauthorization, not a resource-server refresh. The first profile has no AS refresh issuance; a later refresh profile and its AS-only rotation/reuse proof require a separate authority change.
- Missing, invalid, expired, inactive, revoked, or wrong-resource tokens yield bounded HTTP `401`; insufficient scope yields bounded HTTP `403` at the HTTP authorization boundary. Unavailable, ambiguous, or disabled states fail closed with a separately approved nondiagnostic mapping; none permits anonymous fallback, controller dispatch, or cross-instance probing. If a JWT/JWKS alternative is later approved, its required-refresh-failure behavior is verified in a separate branch.
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

### ATP-MCP-AUTH-03: Authorization-server issuance, grant, and token lifecycle (prospective; no runtime proof)

This is a prospective AS-owned acceptance scenario, not authorization to implement or operate an AS. DEC-MCP-03's bounded design is accepted; ADR 0009 selects the integrated `a-auth` logical AS with `zhennann` responsible for implementation and operations, one AS-owned database-backed authority with **code consumption/token activation in the same atomic commit** and Zova presentation of the AS-controlled per-request browser grant flow under DEC-MCP-09. The first AS implementation and verification target is multiple Vona workers on one host sharing persistent SQLite via `better-sqlite3` through Vona's existing primary datasource, not cross-host SQLite or replica support. If persistence resides in existing `a-auth`, keep `vonaModule.fileVersion: 1` and fold the schema into its version-1 creation path; no version-2 migration or automatic upgrade of already-versioned v1 databases is selected. Fresh-only installation scope/exclusions and secret-free confirmation requirements are separately accepted under ADR 0009; actual installation eligibility, deployment observations, migration implementation and any treatment outside that scope remain open. This design choice does not confirm an actual deployment, prove SQLite atomicity, select PostgreSQL/MySQL AS support, or presume an explicit multi-statement transaction by default; the Zova direction does not approve a site/flavor/admission, physical schema, server-verified session/CSRF control or SSR implementation. Run this ATP only after the exact physical storage/browser-interaction contract (including actual eligibility and migration implementation within the accepted fresh-only conditional existing-`a-auth` keep-v1 scope), bounded `WBS-MCP-20-04` execution dossier and safe verification path are separately approved. An isolated resource-server lookup fixture is not sufficient; a separately operated AS would need a new route decision and equivalent contract proof.

Setup:

- Confirm the test deployment has at least two Vona worker processes on the same host sharing the same persistent SQLite database via `better-sqlite3` through Vona's existing primary datasource, with the effective datasource confirmed for each AS-bound instance. Record only synthetic worker/storage labels and a safe configuration fingerprint without reading `.env*` contents into evidence. Approve connection ownership, contention/failure handling and the safe test launcher separately; no journal mode, busy timeout, pool size or automatic write retry is prescribed by this plan. For existing-`a-auth` persistence, use the selected keep-v1 creation path only within the accepted fresh-only scope after actual eligibility and execution/procedure approval; an already-recorded v1 installation does not upgrade automatically. Use excluded existing/partial states only as approved synthetic negative fixtures; separately approve partial-failure expectations and any recovery procedure before tests; no reset/recreation is implied. Configure synthetic issuer/client/resource/instance/subject labels under the selected `a-auth` logical AS, without retaining credentials or real endpoint/provider settings. Include pre-registered public and confidential client profiles; record Client ID Metadata Documents compatibility limits and do not assume Dynamic Client Registration support.
- The [installation scope and deployment-confirmation requirements](./wbs-mcp-20-04-as-contract-dossier.md#92-installation-applicability-accepted-bounded-design-only) were separately accepted for bounded design only on 2026-10-15; no actual installation or deployment observation is confirmed. After separate physical-contract and execution/procedure approval, concretize synthetic fixtures per physical target for fresh v1 creation, existing-v1 non-replay/denied AS activation when required objects are absent, missing history with existing objects, partial/unknown state and separately approved recovery. Distinguish shared schema history from per-instance initialization and routed physical targets; no absent-marker inference, automatic adoption, ledger repair, replay or reset. Minimum future proof must retain classification, exact contract revision, redacted rejection/activation assertions and recovery disposition, not raw schema/log/configuration dumps. The unfilled operator template is not evidence or deployment-inspection authorization; no new procedure ran.
- The [owner/representation/activation-check refinement, sections 9.5–9.8](./wbs-mcp-20-04-as-contract-dossier.md#95-owner-and-runtime-boundary-bounded-design-accepted) has separate bounded design acceptance only, including the logical lifecycle, layered responsibilities/timing and approved-fresh-install continuity rule. After separate mechanism, physical-contract and execution/procedure approval, add synthetic checks distinguishing approved fresh-creation continuity across restart from excluded arbitrary existing-v1 adoption, per-worker/per-effective-binding readiness from startup hints, installation compatibility from current-token validity, dynamic/routed-target mismatch, unknown provenance and checker outage. Assert no DDL/repair/replay/fallback, no credential issuance/acceptance while unconfirmed and no collateral change to ordinary login. Exact provenance/coherence/reuse mechanism, hooks, fixtures, launcher and public error mappings remain open; this bullet authorizes no new runtime procedure.
- The four [provenance/read-only-check mechanism rows, sections 9.9–9.12](./wbs-mcp-20-04-as-contract-dossier.md#99-installation-provenance-mechanism-proposed-not-accepted) are prepared only, not accepted. After separate mechanism/physical-contract/execution/procedure approval, concretize their synthetic proof matrix: protected completed receipt/live generation/target binding; pending or corrupted evidence, arbitrary matching-v1 adoption and interrupted completion rejection; copied/restored/rebound authority and artifact mismatch; actual pinned connection, ambient snapshot, prebuilt/rerouted builder and reconnect failures; repeated checks without positive reuse; fleet stop/drain and activation-epoch separation. Prove each supported detection/control rather than inferring it from marker equality. No automatic completion reconstruction/repair/replay, credential release or token acceptance on unknown state; ordinary login remains unchanged. Exact receipt/marker integrity/storage/retention, physical identity, adapter/hooks/SQL, fleet enforcement, fixtures/launcher and public errors remain open. Retain only allowlisted revision, synthetic coverage/generation/epoch aliases, protected approval/receipt reference aliases, failure/interleaving labels, classifications, negative counts and combined durable assertions; no raw schema/SQL/paths/configuration/credentials. This setup is prospective, not a runnable or authorized new procedure.
- Prepare approved authorization-server metadata/discovery, redirect URI and client-authentication policy, authorization-code + PKCE S256 fixtures, the selected Zova-presented AS interaction with a separately approved site/flavor/admission, server-verifiable identity/session or bridge, request-bound CSRF, SSR/hydration privacy, pre-instance AS admission and new explicit authorization/grant interaction per request, two distinct canonical resources/instances and scopes, and current token/grant-state lookup for the resource server. Do not assume existing Cabloy login JWTs, Redis session markers, provider records or local Passport refresh satisfy these fixtures.
- Prepare the accepted no-refresh first profile: access expiry and reauthorization, unsupported refresh requests/metadata, and multi-worker shared-state outage and revocation fixtures. No refresh rotation, family state, or remembered consent is in scope; a later refresh profile needs a separate authority change and ATP amendment.

Procedure:

- Inspect issuer discovery and advertised endpoints, grant types, pre-registration and PKCE `S256` capabilities. Exercise pre-registered-client compatibility, authorization-time redirect/client authentication and a new explicit user/grant authorization interaction per request; reject unregistered/incompatible clients, missing/invalid PKCE, absent/duplicate `resource`, unauthorized user grants, redirect mismatch (including protocol-relative `//host` and duplicate parameters) and authorization-code reuse. Under the selected Zova presentation, verify no implicit AS authentication from a frontend cookie/flag, fixed internal browser-bound login continuation, protected display escaping, login/decision CSRF, explicit denial, early instance admission across all AS paths, and no-store/referrer/framing protections on private pages, APIs, local errors and redirects as well as success. Verify the chosen site admits the intended users without a role workaround; SSR server HTML and hydration-time initial render must agree, and sensitive pending/code data must not leak into hydration or persistent query state. Prove that a decision POST navigates only to the prevalidated, server-bound redirect URI rather than relying on an AJAX-followed redirect; a generic route/middleware-only check is insufficient. Verify that OAuth client `state` (when supplied), AS pending correlation, provider-login state and approval-form CSRF are distinct; client `state` belongs only to the authorization response, not token redemption. OAuth 2.1 draft-13 §10.2 removes token-request `redirect_uri`; for a separately supported OAuth 2.0 branch, when the authorization request supplied it, RFC 6749 §4.1.3 requires the identical value at token exchange. Verify the selected branch, not merely a comparison when optionally supplied. If RFC 9207 authorization-response `iss` is selected, verify it is present on every redirectable success and error, advertised, and identical to the metadata issuer; invalid client/redirect errors never redirect.
- Request the canonical `resource` during authorization and token exchange, then attempt substitution of another resource, client, subject, instance or broader scope when redeeming the code. Exercise duplicate approve/deny/cancel/expiry interleavings and concurrent code redemption under the selected single AS database-backed authority, including committed-but-lost response; at most one code per pending request and one active token per redeemed code result. Prove code consumption and resulting token activation share the **same atomic commit**, whether implemented as one proven conditional mutation or an appropriate transaction for multiple writes; show that a failed activation cannot burn a code in an unapproved split phase. Prove conditional-transition affected-row handling, creation-time uniqueness/ambiguous digest denial and redemption/revocation ordering on the confirmed same-host shared SQLite/`better-sqlite3` primary-datasource deployment. Deliberately launch competing approvals and redemptions across at least two worker processes, each operation owning a separate Vona `mockCtx(...)` boundary where scoped test state is used; assert the combined durable outcome, not runner parallelism. Verify connection contention, fail-closed busy/unavailable/unknown-commit outcomes and no unsafe replay, under the separately approved connection policy. For existing-`a-auth` keep-v1 persistence, verify the approved fresh/version-1 creation path, explicitly demonstrate that already-recorded v1 databases are not automatically upgraded, and exercise approved partial-failure/recovery behavior. Do not report an existing-install upgrade as supported without a separate disposition. A test on another dialect is not equivalent proof or AS support. Verify that issued MCP-only opaque access tokens have current issuer/profile/grant/token records retrievable by the protected resource, and that revoked/expired/ambiguous/outage states cannot be accepted as current. Separate worker-process execution is mandatory for the selected topology; single-process competing contexts alone cannot close this proof. After worker A acknowledges revocation, prove every lookup begun on worker B fails without an older ambient snapshot, positive cache or replica fallback; do not treat a valid Redis session marker or ordinary signed JWT as an MCP token record.
- Confirm the first-profile AS neither advertises nor issues refresh capability and requires a new authorization request after access expiry; reject unsupported refresh grant requests. Verify current grant/token lookup, revocation and fail-closed multi-worker outage behavior under the separately approved shared-state design. `ATP-MCP-AUTH-01` separately proves the MCP resource endpoint rejects non-access credentials.

Expected result:

- Metadata and actual behavior agree for the pre-registered public/confidential clients and no-refresh first profile. Only the authorized user/client/code/PKCE and explicitly approved canonical resource/scope combination produces a current MCP-profile access-token record. Duplicate approval, denial/cancellation, code replay, substitution, invalid client, revoked grant, ambiguous state or unavailable token service never yields a second resource-server-valid token or escalates local authority; an uncertain lost response does not reissue the same code's token.
- No refresh grant or `offline_access` resource scope is advertised for the first profile; access expiry requires reauthorization, with no remembered-consent shortcut. Browser denial/cancellation, CSRF rejection, account switching or cross-tab conflicts issue no code or token; failures do not expose credentials, token-state internals or subject profiles. This scenario does not independently prove host binding, Passport mapping or guarded tool authorization.

Minimum proof:

- Retain `zhennann`'s AS implementation/operations ownership, separate execution/storage/interaction approvals and source revision, synthetic environment/resource/instance/client labels, configuration and metadata fingerprints, exact authorization/token/lookup procedures and interleavings, redacted combined durable grant/token-state outcomes, distinct synthetic worker-process labels, shared-storage fingerprint, connection/contention/failure outcomes, acknowledged-revocation-to-later-lookup ordering, approved installation scope and keep-v1 non-upgrade/recovery results, explicit per-request grant-interaction results, negative issuance counts, observed no-refresh behavior, and a durable redacted artifact location. Never retain raw codes, access/refresh tokens, cookies, signed callback state, client secrets, full claims or private subject data. The selected Zova authorization presentation needs the separately approved site/flavor's real-browser SSR/hydration and admission proof under this AS ATP; no general management UI is implied.

Traceability: `PRD-MCP-IDENTITY-01`, `SRS-MCP-AUTH-04`, `SRS-MCP-NFR-01`, `WBS-MCP-20-04`.

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

The MCP resource-server module itself has no Zova SSR/browser procedure. The selected integrated `a-auth` logical AS needs Zova-presented authorization/grant-interaction verification under `ATP-MCP-AUTH-03` after site/flavor/admission and browser security contracts are approved; an independent site is not presumed. After implementation, use the narrowest applicable command and record actual results in a bounded execution dossier. Prospective resource-server command families verified during planning include:

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

For the selected AS Zova interaction, build the approved affected flavor's SSR and REST artifacts together and synchronize through `npm run deps:vona` when execution is approved; `ATP-MCP-AUTH-03` must separately prove its site/admission and browser/SSR contract. A future management UI would require its own site-specific proof.

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
- [A-MCP ADR 0009 (accepted design-only amendment)](./decisions/0009-mcp-as-state-boundary.md)
