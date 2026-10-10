# WBS-MCP-20-04 AS Execution Dossier (Planning Draft)

## Dossier status

**Planning-only execution dossier draft — not approved for execution and not execution-ready.** This record scopes the bounded work required for `WBS-MCP-20-04`, but the task remains `blocked`. It does not authorize source changes, dependency installation, schema or external-store creation, provider or issuer configuration, authorization-endpoint operation, credential changes, OAuth/HTTP execution, ATP execution, or status advancement.

Originally prepared against the Cabloy Basic worktree at revision `1e7c10ce84` on 2026-10-09; reconciled against clean `2dda23660f`, then reviewed against clean `9cca451dff` on 2026-10-10. The bounded planning disposition selects an integrated `a-auth` AS logical owner with `zhennann` responsible for implementation and operations, one AS-owned database-neutral transactional authority **state direction**, and an AS-owned per-request approve/deny flow with **backend-rendered HTML presentation direction** under ADR 0009. No deployed dialect, schema, AS source, HTML routes/renderer, browser identity/session/CSRF mechanism, endpoint, provider configuration, usable credential, grant/token record, or `ATP-MCP-AUTH-03` evidence is claimed.

This dossier follows the accepted-for-design-only disposition in [ADR 0003](./decisions/0003-mcp-oauth-resource-server.md) and the planning review in [the AS design dossier](./wbs-mcp-20-04-as-design-review.md). The [AS state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) is the basis for the separately selected transactional-database authority and AS-owned browser-flow **directions**; it does not approve the physical store or concrete browser interaction. This dossier remains a readiness and approval boundary, not an implementation plan that silently resolves the remaining authority decisions.

## Execution target

- **Suite:** `cabloy-mcp`
- **Target WBS:** `WBS-MCP-20-04 — Deliver an approved MCP authorization-server/token-service contract`
- **Target class:** planned backend AS/token-service increment under the selected integrated `a-auth` route; currently blocked before execution. A separately operated AS requires a new route decision.
- **Finite boundary after all gates close:** deliver and prove one approved MCP authorization-server/token-service contract that supports:
  - truthful authorization-server metadata/discovery;
  - pre-registered public and confidential clients;
  - Authorization Code grant with PKCE `S256`;
  - exact redirect URI and client-authentication policy;
  - explicit resource-owner authentication and grant interaction;
  - canonical MCP resource and narrow scope binding through authorization and code redemption;
  - MCP-specific high-entropy opaque access tokens with current server-owned lookup;
  - active, expiry, revocation, grant, subject, client, resource, and bound-instance consistency;
  - the accepted first-profile choice of **no refresh-token issuance**; and
  - redacted AS-owned proof for `ATP-MCP-AUTH-03`.
- **Not included:** MCP resource-server Bearer middleware (`WBS-MCP-20-02`), Streamable HTTP transport (`WBS-MCP-20-01`), trusted host/proxy-to-instance binding (`WBS-MCP-20-03`), tool catalog/risk policy, Passport/context dispatch, operational limits/audit, production deployment, live provider operation, or release closure.

The target has one bounded outcome. The integrated `a-auth` logical route has been selected for design, with `zhennann` responsible for its implementation and operations. A separately operated conforming AS would require a new route decision and equivalent contract/proof. The selected route is not approved for source, configuration, or runtime work by this dossier.

## Edition, repository, revision, and worktree

- **Edition:** Cabloy Basic, observed from the sole marker `__CABLOY_BASIC__`.
- **Repository root:** `/Volumes/my-data/cabloy-multirepo/cabloy-basic/.claude/worktrees/spec-basic-cabloy-mcp`
- **Planning authority directory:** `/Volumes/my-data/cabloy-multirepo/cabloy-basic/.claude/worktrees/spec-basic-cabloy-mcp/repo-specs/cabloy-mcp/`
- **Revision observed:** `1e7c10ce84` at initial draft; clean `2dda23660f` at authority reconciliation and clean `9cca451dff` at the later design review.
- **Worktree classification:** clean at the `9cca451dff` design review; attributable planning-document changes were present before this bounded design update and remain in the worktree. No source or configuration change for this task was observed. The dossier must not overwrite or clean existing changes.
- **Observed root workflow:** `package.json` exposes `npm run vona`, `npm run tsc`, `npm run lint`, `npm run format`, `npm run test`, `npm run spec:check`, and chart commands. Prospective commands below are not evidence until executed under a separately approved dossier.

## Authority and traceability

### Product, technical, and decision records

- **PRD:** `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`.
- **SRS:** `SRS-MCP-AUTH-04`, `SRS-MCP-AUTH-01`, `SRS-MCP-INSTANCE-01`, `SRS-MCP-NFR-01`.
- **WBS:** `WBS-MCP-20-04`.
- **ATP:** `ATP-MCP-AUTH-03`.
- **Overall boundary:** [ADR 0001](./decisions/0001-mcp-suite-boundaries.md), accepted for the overall first-increment boundary; no MCP-owned registry/consent/audit persistence and no-site resource-server boundary remain controlling.
- **Transport dependency:** [ADR 0002](./decisions/0002-mcp-transport.md), accepted for design only; no transport source or runtime proof is required by this AS target.
- **OAuth design authority:** [ADR 0003](./decisions/0003-mcp-oauth-resource-server.md), accepted for bounded design only; the integrated `a-auth` logical AS route is selected, but no concrete store, endpoint, provider, or source is approved.
- **Instance interface:** [ADR 0004](./decisions/0004-mcp-host-instance-binding.md), proposed; this dossier must preserve the shared endpoint → resource → instance interface without accepting host/proxy policy.
- **State/interaction design authority:** [ADR 0009](./decisions/0009-mcp-as-state-boundary.md) selects a database-neutral AS-owned transactional authority and AS backend HTML per-request grant-flow direction for bounded design; it does not approve the deployed dialect, physical store, session/CSRF/HTML implementation, schema, migration, remembered consent or execution.
- **Design review:** [WBS-MCP-20-04 AS design review dossier](./wbs-mcp-20-04-as-design-review.md), accepted as the bounded design basis only; the later [AS state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) records the basis and remaining unselected physical/interaction choices.

### Dependency readiness

| Dependency or gate | Current state                              | Effect on this dossier                                                                                                                                                                     |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `WBS-MCP-10-01`    | `planning-complete` documentary closure    | Satisfies its planning dependency only; no AS source or runtime proof.                                                                                                                     |
| `WBS-MCP-10-02`    | `planning-complete` documentary closure    | Satisfies its planning dependency only; no AS source or runtime proof.                                                                                                                     |
| `DEC-MCP-03`       | `accepted (design only)`                   | Establishes the bounded design direction; does not authorize concrete execution.                                                                                                           |
| `DEC-MCP-09`       | `accepted (bounded design direction only)` | Selects one AS-owned transactional database authority and an AS-owned browser approve/deny flow; physical store, UI/session/CSRF, schema, retention, migration and execution remain gated. |
| `WBS-MCP-20-01`    | `blocked`                                  | Not a direct AS implementation prerequisite, but no end-to-end MCP proof can be claimed while transport is absent.                                                                         |
| `WBS-MCP-20-02`    | `blocked`                                  | Remains dependent on this AS contract plus transport and instance gates.                                                                                                                   |
| `DEC-MCP-04`       | `proposed`                                 | The AS must preserve its shared resource/instance interface; this dossier cannot choose host, proxy, or instance values.                                                                   |
| `ATP-MCP-AUTH-03`  | prospective, no evidence                   | Must be run only after owner, storage, source/configuration, and execution approval close.                                                                                                 |

The target remains blocked: the integrated route, implementation/operations responsibility, transactional-database authority and AS-owned browser direction are recorded, but the physical store/retention/consistency, browser/session/CSRF implementation, configuration, migration/file-version choice if applicable, execution approval, and AS-owned proof remain open. Planning-complete predecessors do not authorize execution.

## Observed source and feasibility boundary

The following existing paths are read-only inputs and do not establish an MCP AS:

- `vona/src/suite-vendor/a-auth/modules/auth-oauth/src/bean/authProvider.oauth.ts` — provider/login strategy registration, not MCP metadata, client/grant registration, resource-indicator processing, or token issuance.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/controller/passport.ts` — provider login callback with signed OAuth state, not a general MCP authorization endpoint.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/controller/mock.ts` — development-only mock authorization form, not production user authentication, consent, code issuance, or PKCE handling.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/service/auth.ts` — local provider callback and OAuth-code handoff, without the required MCP resource/client/PKCE/grant lifecycle.
- `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts` — local Passport and JWT/session refresh helpers, not a one-time MCP refresh-family or opaque-token service.
- `vona/src/suite-vendor/a-vona/modules/a-user/src/service/redisToken.ts` — instance-scoped session marker, not a token-digest-to-grant, consent, or revocation store.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/bean/meta.version.ts` and `package.json` — existing auth persistence and module metadata, not approval for MCP state or a file-version change.

The selected integrated `a-auth` logical route may extend an existing auth owner, but exact source files, package/dependency ownership, service boundaries, and state representation remain unselected. A separately operated AS is not selected; any future switch needs a new route decision, approved operator, contract, resource registration, current lookup proof, and redacted evidence.

## Ownership and target classification

### Selected logical route: integrated `a-auth` capability

- **Logical owner:** an extension of Vona `a-auth`, sharing local identity ownership but exposing a separate MCP authorization-server capability.
- **Implementation and operational owner:** `zhennann` accepts responsibility for issuer metadata, public endpoints, client/redirect registration, authorization interaction, state availability, revocation, key/secret custody, incident response and retention policy. Exact configuration, custody and retention values remain unapproved.
- **Resource server:** `cabloy-mcp` remains separate and receives access-token Bearer credentials only. It does not issue tokens, receive refresh tokens, own consent, or create a second grant/token store.
- **Target classification:** proposed new capability in an observed logical owner; exact source/manifest/state paths are not explicitly approved new targets.

### Deferred alternative: separately operated conforming AS

- **Route authority:** not selected; a change from the integrated route requires a new decision and separately accountable operator.
- **Target classification:** external existing or proposed service, to be classified after its metadata, registration, resource binding, lookup, revocation, and proof are inspected.
- **Acceptance condition:** it must provide the same supported client/grant/resource/token contract and redacted `ATP-MCP-AUTH-03` proof. Existing provider login, local JWTs, or Redis markers cannot be substituted as evidence.

### No independent MCP AS in `cabloy-mcp`

Creating AS endpoints, consent UI, grant storage, or token issuance in the resource module is explicitly excluded. No new Zova site is required merely for an integrated AS interaction; if a browser/SSR authorization surface is selected, it needs a separate source, privacy, browser/SSR, and acceptance scope.

## Authority gates before execution approval

Execution cannot start until each gate below has a recorded disposition in the owning authority and the bounded dossier is re-approved if the scope changes.

### Gate A — accountable ownership and route selection

1. **Recorded:** `zhennann` owns AS implementation and operations; the integrated `a-auth` logical route is selected. A route change requires a new decision.
2. **Still open:** record the exact endpoint, issuer, discovery, client-registration, and token-state service ownership without writing live values or credentials into planning records.
3. **Still open:** define incident response, retention, key/secret custody, worker topology, and outage escalation. Naming a responsible person does not settle these operational policies.

### Gate B — persistence and state authority

[ADR 0009](./decisions/0009-mcp-as-state-boundary.md) now records a **bounded design-only** selection: one AS-owned transactional database authority for authorization request/code/grant linkage and MCP opaque-token active/revocation state, with code consumption and token activation in one atomic commit. The initial `cabloy-mcp` scaffold remains schema-free; no MCP resource-module store or remembered consent is approved. This disposition is **not** approval to create an `a-auth` table, a Redis namespace, an external state service or a grant/consent record. Redis-only and SQL/Redis split authority are not selected.

The bounded design direction is database-neutral, not a PostgreSQL-primary recommendation: specify portable state/transition invariants now, but select and approve the actual deployed dialect/topology and verify its actual affected-row/serialization semantics, creation-time uniqueness, current lookup, contention and fresh-install/existing-install/partial-recovery migration implementation before execution; ordinary cached model `update()` and `getForUpdate()` alone are not compare-and-set or uniqueness proof. Also approve the exact AS module/service, client registry representation, schema, TTL and deletion, digest/custody, approval and redemption/revocation state machine, multi-worker consistency, outage recovery, and migration boundary. The [state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) supplies the design basis and unresolved details, **not** a schema or service selection. If a persisted field/schema or `meta.version.ts` changes, ask and record whether the owning `vonaModule.fileVersion` increments **before editing**, and run the required root `npm run test` after an approved `meta.version.ts` change. Switching to an external Redis or another shared-store direction requires a new authority decision and its own namespace, lifetime and operational approval.

### Gate C — authorization interaction and protocol profile

Approve the exact first-profile behavior:

- pre-registered public and confidential clients only;
- Authorization Code grant with PKCE `S256`;
- exact redirect URI validation;
- approved confidential-client authentication;
- explicit resource-owner login and grant/deny interaction;
- one-time code redemption with AS transaction, client, authorization-time redirect, resource, scope, subject, and instance binding; OAuth client `state` remains authorization-response correlation, not a token-request credential;
- truthful RFC 8414 or selected discovery metadata;
- no Dynamic Client Registration and no required Client ID Metadata Documents in the first profile, with compatibility limits documented;
- no Client Credentials, implicit, or password fallback; and
- no refresh-token issuance in the accepted first profile.

The AS-owned browser flow with per-request approve/deny and AS backend-rendered HTML presentation is selected for bounded design; no Zova authorization site is selected. A plain backend GET does not inherit a verified identity from Zova's client-written cookie, and the existing global CSRF middleware does not assert approval-form tokens. Before approving its **concrete implementation**, distinguish client OAuth `state`, AS transaction/browser correlation, upstream provider-login state (if reused), grant-form CSRF and the PKCE challenge/verifier. An existing login session may establish identity but cannot substitute for the required new grant decision. Specify invalid-redirect, denial/cancellation, concurrent approval and redemption, account-switch and lost-response behavior without treating client `state` as a token-endpoint credential; the authorization-time redirect remains code-bound. OAuth 2.1 draft-13 §10.2 removes the token-request `redirect_uri`, while any separately supported OAuth 2.0 compatibility branch must require its identical value when the authorization request supplied it (RFC 6749 §4.1.3). Select and verify the branch before execution rather than describing it as an optional comparison. Design AS request-to-instance admission in the pre-`newCtx` resolver separately from ADR 0004's proposed early `/mcp` hook; route guards run too late to undo initial instance selection. Define a server-verifiable browser identity/session or login bridge, CSRF checked after bounded form parsing, exact registered client redirect matching (not the existing provider continuation/origin check), escaped HTML and response protections on success, errors and redirects. The [state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) is a selected design basis with unapproved concrete mechanics. Any remembered consent, alternative grant, metadata-document compatibility, refresh profile, or UI/site addition requires a separate authority change.

### Gate D — token and lookup contract

Approve the MCP-specific opaque-token representation and current lookup contract:

- high-entropy token values are returned only at the token endpoint and never retained in evidence;
- the authoritative state binds issuer, client, authorization transaction/grant, subject, canonical resource, bound-instance relation, narrow scope, issued time, expiry, and active/revoked state;
- tokens are represented by a protected digest or equivalent non-recoverable form where supported;
- all workers use one current authoritative lookup/revocation view;
- unavailable, stale, ambiguous, malformed, revoked, expired, wrong-resource, or wrong-client state fails closed; and
- revocation and policy changes cannot be bypassed by a stale Passport/JWT/session marker.

The resource server accepts only one `Authorization: Bearer` access-token credential and rejects authorization codes, refresh tokens, cookies, query tokens, local JWTs, provider tokens, and unrelated headers.

### Gate E — shared resource/instance interface

Use the deployment-owned interface accepted for bounded design by DEC-MCP-03 and still proposed for trusted-ingress design by DEC-MCP-04:

```text
canonical external HTTPS /mcp endpoint
    -> one protected-resource identifier
    -> one enabled Vona instance
```

The AS binds the canonical resource and approved instance relation at authorization and token exchange. The AS may resolve an authorization request's `resource` only through an approved resource-to-instance registry; the supplied value is a request for a registered recipient, not a trusted instance selector. The resource server later compares current token state with the trusted endpoint/resource/instance binding and maps `(issuer, sub, bound instance)` to exactly one active local identity. Raw Host, forwarded headers, query selectors, token claims, and tool arguments cannot select an instance. Concrete hosts, issuers, resources, proxy operators, and instance values remain outside this dossier.

### Gate F — local identity and privacy boundary

The AS supplies a stable subject, but local account activation, mapping, Passport projection, RBAC, data scope, ownership, and tool policy remain resource/domain owners' authority. The AS must not emit or retain private local profiles unnecessarily. No raw authorization codes, access/refresh tokens, cookies, signed state, client secrets, private keys, full claims, or private profiles may enter logs, traces, metrics, audit, or evidence.

## Bounded implementation boundary after approval

Only the selected integrated `a-auth` route may be proposed for execution after the gates close; changing routes requires a new decision. Exact files and commands must be observed from the owning module before changes.

### Integrated `a-auth` route

1. Add or extend the AS capability in the selected auth owner without widening existing provider-login or local refresh endpoints.
2. Publish only truthful metadata for the selected issuer, endpoints, grants, PKCE methods, client-registration compatibility, and no-refresh profile.
3. Implement an AS-owned authorization transaction with state correlation, exact redirect validation, PKCE `S256`, one-time code redemption, canonical resource/scope/client/subject/instance binding, and explicit grant/denial handling.
4. Implement current MCP opaque-token issuance and authoritative lookup/revocation state under the approved persistence disposition.
5. Keep `/mcp` resource validation outside the AS change; provide the contract and redacted lookup fixtures required by the resource-server successor.
6. Add focused unit/integration tests for the AS-owned behavior and run only approved commands. If schema changes, apply the approved file-version strategy and required root test.

### Separately operated AS route (not selected)

A future route change needs a new decision and revised dossier. It would still require inspected metadata, client/PKCE/resource/lookup/revocation and no-refresh behavior, approved resource registration and operation, and equivalent redacted AS-owned proof. This paragraph authorizes no external provider operation or configuration.

## Verification and evidence plan (prospective)

### `ATP-MCP-AUTH-03` required coverage

After execution approval and actual implementation/configuration, verify with synthetic labels and redacted artifacts:

1. metadata/discovery advertises only supported endpoints, grants, PKCE, registration compatibility, and no-refresh behavior;
2. public and confidential pre-registered clients obey exact redirect and authentication rules;
3. resource-owner authentication and explicit grant/deny/cancel interaction are bounded and redacted;
4. authorization code state, client, redirect, PKCE, resource, scope, subject, and instance substitution/replay fail closed;
5. issued tokens are MCP-specific opaque values with current active state bound to the approved grant/resource/client/subject/instance/scope;
6. wrong-resource, wrong-client, revoked, expired, ambiguous, unavailable, or stale token state cannot become resource-server-valid;
7. all workers observe current token/revocation state where the deployment uses multiple workers;
8. the no-refresh profile does not advertise or issue refresh capability and requires reauthorization after access expiry; and
9. no raw credentials, codes, cookies, state, secrets, private keys, complete claims, or private profiles are retained.

A later refresh profile is out of scope. If separately proposed, it requires a new authority disposition and must cover atomic rotation or sender constraint, predecessor invalidation, family/reuse handling, concurrency, lost responses, expiry, revocation, worker consistency, and outage behavior before execution.

### Minimum evidence

Retain only a redacted evidence record containing:

- AS owner, approval disposition, and source revision or external service revision;
- clean/dirty classification and attributable diff digest when source is changed;
- synthetic environment, client, resource, instance, and subject labels;
- metadata/configuration fingerprints without secrets;
- exact authorization, token, lookup, revocation, and outage procedures;
- expected and observed results, including negative issuance and replay counts;
- explicit no-refresh branch result; and
- durable redacted artifact location.

Do not create evidence records before actual execution. Never retain raw authorization codes, access/refresh tokens, cookies, signed callback state, client secrets, private keys, full claims, or private user data.

## Prospective commands and command gates

No AS command has been run for this dossier. Exact module-local commands remain dependent on the selected owner and observed generated/dependency layout.

After an integrated source route is explicitly approved, the narrow command families may include only observed commands such as:

```bash
npm run vona -- :bin:test -- <selected-auth-or-mcp-tests> --flavor=normal
npm run tsc
npm run lint
npm run format
```

If `meta.version.ts` or a schema changes under an explicitly approved persistence revision, the required command is:

```bash
npm run test
```

That root test path is not authorized by this dossier and must not be run automatically. Provider calls, live endpoint tests, deployment, or credential setup require their own explicit confirmation. Real HTTP/ATP procedures are prospective until the selected AS and resource-server fixtures exist.

Planning-only documentary checks, if needed after this dossier is recorded, remain separate:

```bash
npm run spec:check -- cabloy-mcp
npm run spec:charts -- cabloy-mcp
npm run spec:charts:check -- cabloy-mcp
git diff --check
```

These checks cannot accept an AS store/schema or execution, revise the bounded ADR 0009 disposition, produce ATP evidence, or unblock the task.

## Allowed records and exclusions

### Records permitted after explicit execution approval

- source/configuration only within the selected AS route and approved WBS boundary;
- focused AS tests and actual redacted `ATP-MCP-AUTH-03` evidence;
- the selected WBS row's derived status, blocker, evidence, and next-proof fields in `progress.md`;
- applicable generated planning charts after supported progress changes;
- authority records only through a separately approved authority change.

### Explicitly excluded now

- changing ADR 0003 from design-only acceptance;
- treating ADR 0009's selected transactional-database/browser **directions** as a physical database, schema, browser route/UI/CSRF, remembered-consent, or execution approval;
- creating relational schema, Redis token contracts, durable consent, or external shared state;
- editing `meta.version.ts` or choosing `vonaModule.fileVersion` without explicit approval;
- implementing `cabloy-mcp` resource-server validation, transport, host binding, catalog, dispatch, or operations;
- creating a Zova site or authorization UI without separate scope and review;
- configuring an issuer, provider, client secret, redirect URI, live host, endpoint, webhook, or credentials;
- running OAuth/HTTP ATPs or live provider operations;
- running `npm run init`, resetting/recreating a database, reinstalling dependencies as a first response, cleaning/resetting/stashing/checking out the worktree, broad generation, committing, or pushing.

## Quality gates and current disposition

- **Authority audit:** planning structure is checked separately; static audit is not AS approval or runtime evidence.
- **Chart model/freshness:** charts are derived only; they do not prove source, token state, or ATP behavior.
- **Human approval:** route, responsible owner, transactional-database authority and AS-owned browser-flow directions are recorded under bounded `DEC-MCP-09` design only. This dossier still requires separate approval after concrete physical storage, browser/session/CSRF and operational gates close. Approval of these directions does not authorize provider/deployment operations, physical schema or source.
- **Current WBS status:** `WBS-MCP-20-04` remains `blocked`.
- **Current evidence:** none for `ATP-MCP-AUTH-03`; no AS source or runtime proof exists.

## Handoff and next single action

```text
WBS / phase: WBS-MCP-20-04 / Phase 20
Status: blocked; planning-only execution dossier draft, not implementation-complete or verified
Revision and worktree: initial draft 1e7c10ce84; clean reviews 2dda23660f and 9cca451dff; now dirty with attributable planning edits
Scope and exclusions: one integrated a-auth AS/token-service contract only; no resource-server, transport, host binding, deployment, provider operation, schema, or runtime execution
Authority and ownership: PRD/SRS/WBS/ATP above; ADR 0003 accepted for bounded design only; ADR 0009 selects transactional-database and AS-owned browser-flow directions; zhennann owns AS implementation and operations
Completed gates/evidence: edition/repository discovery, authority/dependency review, source feasibility review, route/owner and logical state/browser-flow design decisions, and dossier drafting; no AS execution or ATP evidence
Commands/procedures actually run: repository discovery and read-only planning inspection for the original dossier; later documentary edits/checks are reported separately, not as ATP proof
Commands/procedures still required: approve deployed dialect/module/schema/retention/consistency and prove that dialect's transition/migration behavior; approve concrete AS backend HTML identity/session/CSRF/admission and operational policy; decide owning module fileVersion before any schema edit; obtain separate execution approval; then observe source/dependency layout and run approved narrow checks
Blocker or decision needed: concrete AS physical state representation/service, retention/worker consistency/outage, browser interaction implementation and instance admission, issuer/resource/client registration, applicable migration strategy, separate execution approval
Next single action: develop a bounded physical-database and AS-browser interaction design for separate disposition before re-reviewing this dossier; do not infer source, configuration, provider, or OAuth/HTTP authorization
```

This dossier is a bounded planning handoff only. It does not authorize execution automatically, and it does not change the status of any ADR, WBS, ATP, provider, endpoint, schema, or runtime environment.
