# WBS-MCP-20-02 Bounded Execution Dossier (Draft)

## Dossier status

**Planning-only draft — awaiting separate execution approval.** This record scopes a possible bounded execution of `WBS-MCP-20-02`; it does not authorize source changes, dependency installation, provider or endpoint configuration, runtime verification, ATP execution, or status advancement. The target is currently blocked and must remain blocked until the listed predecessor and authority gates close.

Prepared from the observed worktree at revision `d8ea65675e2496165064a603f752c2d999846a0f` on 2026-10-08. No runtime or ATP evidence is claimed.

## Execution target

- **Suite:** `cabloy-mcp`
- **Target WBS:** `WBS-MCP-20-02 — Integrate OAuth resource-server validation and local subject mapping`
- **Target class:** backend increment, contingent on an approved bounded execution dossier and resolved authority gates.
- **Finite boundary:**
  - integrate the approved OAuth protected-resource validation boundary for each protected MCP request against a separately approved and available authorization-server/token service delivered under `WBS-MCP-20-04` (or an explicitly approved equivalent AS disposition);
  - map a validated subject to exactly one active local Passport-compatible identity in the already bound Vona instance;
  - enforce fail-closed behavior before protected discovery, `tools/list`, or `tools/call` reaches a business controller;
  - cover the resource-server portions of `ATP-MCP-AUTH-01` and the linked `ATP-MCP-AUTH-02` procedures after implementation. Refresh grant issuance/rotation needs separate authorization-server ownership and proof.
- **Not included:** authorization-server endpoint/grant/token-store implementation (requires its own approved owner and bounded WBS scope), transport implementation (`WBS-MCP-20-01`), host/proxy-to-instance implementation (`WBS-MCP-20-03`), tool catalog or risk policy, fixed dispatch/context isolation, operational limits/audit, deployment, or release closure.

## Edition, repository, revision, and worktree

- **Edition:** Cabloy Basic, observed from the sole marker `__CABLOY_BASIC__`.
- **Repository root:** `/Volumes/my-data/cabloy-multirepo/cabloy-basic/.claude/worktrees/spec-basic-cabloy-mcp`
- **Planning authority directory:** `/Volumes/my-data/cabloy-multirepo/cabloy-basic/.claude/worktrees/spec-basic-cabloy-mcp/repo-specs/cabloy-mcp/`
- **Revision:** `d8ea65675e2496165064a603f752c2d999846a0f`
- **Worktree classification:** clean at dossier preparation; no unrelated or overlapping local changes were observed.
- **Edition-sensitive workflow:** the root `package.json` exposes the observed `npm run vona`, `npm run tsc`, `npm run lint`, `npm run format`, `npm run test`, `npm run spec:check`, and chart commands. No command below is claimed to have been run for this dossier unless listed under “Commands actually run.”

## Authority and traceability

### Product and technical records

- PRD: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`
- SRS: `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-NFR-01`
- WBS: `WBS-MCP-20-02`
- ATPs: `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`
- Related transport authority: [ADR 0002](./decisions/0002-mcp-transport.md), accepted for design only; transport source and proof remain outside this target.
- Related OAuth authority: [ADR 0003](./decisions/0003-mcp-oauth-resource-server.md), **Proposed**. The 2026-10-08 planning direction prefers a Cabloy-integrated `a-auth` authorization server, MCP-specific opaque access tokens, and optional refresh-token support; the ADR as a whole remains unaccepted. The earlier deny-on-required-JWKS-refresh-failure sub-policy applies only to a separately selected JWT/JWKS alternative.
- Related instance authority: [ADR 0004](./decisions/0004-mcp-host-instance-binding.md), **Proposed**. Its endpoint/resource/instance interface is a required integration dependency, not an accepted host or proxy configuration.
- Overall boundary: [ADR 0001](./decisions/0001-mcp-suite-boundaries.md), accepted for the overall boundary and initial structural design only.
- Evidence references: `evidence/phase-10/` contains documentary planning closures for WBS-MCP-10-01 and WBS-MCP-10-02 only. No `ATP-MCP-AUTH-01` or `ATP-MCP-AUTH-02` evidence exists.

### Dependency readiness

- `WBS-MCP-20-01` is **blocked**. Its planning predecessors are documentary `planning-complete`, and DEC-MCP-02's transport design is accepted, but no transport source, bounded implementation approval, or real-HTTP proof exists. This dossier does not override that block.
- Proposed predecessor `WBS-MCP-20-04` is **blocked**: no AS owner, approved AS execution dossier, AS source/contract proof, no-schema disposition, or `ATP-MCP-AUTH-03` result exists. Its numeric suffix does not mean it follows resource-server implementation.
- `DEC-MCP-03` remains **Proposed**. The preferred Cabloy-integrated `a-auth` authorization-server candidate, MCP opaque-token/grant profile, token lookup/introspection availability, resource identifier, refresh-token issuance/rotation/reuse, mapping owner, scope/grant semantics, and outage taxonomy remain unresolved.
- `DEC-MCP-04` remains **Proposed**. The trusted endpoint/resource/instance map, ingress trust, early selection, and cache isolation remain unresolved. This target may consume only an agreed interface; it may not invent host or instance authority.
- No predecessor is `verified`; no predecessor's planning-only status constitutes implementation authorization. Consequently this dossier is not execution-ready.

## Scope, ownership, and target classification

### Observed existing source (read-only inputs)

These paths establish existing login/provider, local JWT, extraction, and Passport behavior. They are not MCP resource-server implementations and must not be treated as an authority shortcut:

- `vona/src/suite-vendor/a-auth/modules/auth-oauth/src/bean/authProvider.oauth.ts`
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtClient.ts`
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtExtract.ts`
- `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts`
- `repo-docs/backend/auth-guide.md`
- `repo-docs/fullstack/suites-and-modules.md`

### Proposed new source (not present)

- `vona/src/suite/cabloy-mcp/`
- `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/`
- Within that module, only the approved implementation boundary may add an authentication service/adapter and its focused tests. Exact filenames, package ownership, and library choice remain execution-dossier decisions after authority closure.

The proposed module is **not** an observed existing target. It is not yet an explicitly approved new implementation target for this dossier because DEC-MCP-03 is still Proposed and `WBS-MCP-20-01` is blocked. DEC-MCP-01's accepted topology does not by itself authorize creation.

### Ownership boundary

- The preferred Cabloy-integrated `a-auth` authorization-server extension owns issuer metadata, authorization code + PKCE, client registration/compatibility, consent, grants, access-token issuance, optional refresh-token issuance/rotation, and revocation. A separately operated authorization server remains a possible alternative until DEC-MCP-03 is accepted.
- The future `cabloy-mcp` module owns protected-resource validation and the server-side mapping handoff only; it does not receive refresh tokens, provide an independent OAuth login/consent store, or create a second identity/tenant authority. Ordinary `createTempAuthToken()` is not accepted as an MCP token without explicit profile separation.
- Existing Vona Passport, local activation, RBAC, data-scope, and domain ownership remain authoritative after mapping.
- DEC-MCP-04 owns trusted endpoint/instance binding; DEC-MCP-07 owns fresh execution context construction; DEC-MCP-06 owns scope/tool policy; DEC-MCP-08 owns operational telemetry and redaction.

## Proposed bounded implementation (only after approval)

The approved implementation, if later authorized, would be limited to the following contract:

1. Accept exactly one HTTP `Authorization: Bearer` credential for protected MCP requests; reject query, cookie, `x-vona-passport-code`, refresh-token, and other token locations.
2. Look up or introspect an MCP-profile access token through the approved authorization-server/token service and confirm the token's active state, profile, issuer, canonical resource, client/grant, expiry, stable nonempty subject, scope, bound instance relation, and revocation state. Fail closed when current authorization state cannot be confirmed; do not use stale lookup state to extend trust.
3. Reject refresh tokens at the resource endpoint. Verify the approved authorization-server contract preserves resource/client/subject/instance/grant boundaries and, if refresh tokens are issued, applies its separately owned rotation/reuse policy at the token endpoint. This resource-server dossier does not implement that endpoint or grant store.
4. Map `(issuer, sub, bound instance)` to exactly one active local identity. Missing, ambiguous, disabled, inactive, wrong-instance, or unavailable mappings fail closed without probing unrelated instances or accepting external roles as local authority.
5. Create or hand off a fresh request-owned local Passport projection for downstream authorization. Do not reuse an unrelated parent request Passport.
6. Return only the approved bounded authorization result to the transport layer. Do not expose raw tokens, claims, token-store records, secrets, private keys, complete profiles, or mapping-store details.

The exact issuer, resource URL, metadata values, client grant, scope vocabulary, opaque-token representation/hash policy, lookup consistency, access/refresh lifetimes, rotation/reuse bounds, HTTP status taxonomy, and mapping storage/service are placeholders until their owning decisions are accepted and configuration is separately approved. If a JWT/JWKS alternative is later selected, its algorithm, key-refresh, and cache policy must be added as a separate approved branch.

## Safety and contract constraints

- **Tenant/instance:** use only the trusted instance supplied by the agreed DEC-MCP-04 interface. A token claim, raw host, query/header selector, tool argument, or client-provided instance identifier cannot select an instance. No cross-instance probing.
- **Identity:** external `sub` is an input to a server-owned mapping; it is not a local user ID, role, tenant, or Passport by itself.
- **Authorization:** OAuth scope is an upper bound. Local activation, RBAC, data scope, ownership, deployment policy, and operation risk remain mandatory and are not implemented or weakened here.
- **Lifecycle:** every protected request performs the required validation and mapping decision. List visibility is not a call grant; call-time recheck belongs to downstream authorization tasks.
- **Transactions and persistence:** this target proposes no MCP-owned schema or persisted field. If implementation later changes a persisted schema or `meta.version.ts`, stop and obtain the required `vonaModule.fileVersion` decision before editing; the current dossier does not authorize such a change.
- **Concurrency and recovery:** concurrent subject/instance checks must use separate Vona `mockCtx(...)` boundaries where scoped state is involved. A key refresh outage, mapping ambiguity, or validation uncertainty fails closed. No automatic retry of external side effects is in scope.
- **Privacy/audit:** tests and evidence use synthetic labels and redacted fingerprints only. No raw token, signed JWT, full claims, client secret, refresh token, cookie, JWKS body, private key, or complete subject profile may be retained. Detailed audit ownership remains DEC-MCP-08.
- **SSR/site/flavor:** this MCP resource-server target has no Zova page, browser flow, or SSR site. A separately approved AS authorization-code interaction/grant flow under `WBS-MCP-20-04` still needs AS-owned verification; it does not automatically require a new Zova site. No frontend contract loop applies to this RS task.
- **Contract direction:** this is a Vona backend increment. There is no generated Zova consumer; no generated consumer may be hand-edited.

## Verification and evidence plan (prospective)

These procedures become runnable only after the dependency and authority gates close, the dossier is explicitly approved, and the source/dependency layout is observed. They are not results of this dossier.

### `ATP-MCP-AUTH-01`

Use synthetic MCP-profile lookup/introspection fixtures for valid issuer/resource/subject/scope/instance, wrong issuer, wrong resource, expired/inactive/revoked state, missing subject/scope, lookup outage, stale state, disabled/unmapped subject, and ambiguous mapping. Prepare a synthetic refresh credential as a negative resource-endpoint fixture only; do not retain its value.

Exercise metadata, `tools/list`, and `tools/call` through the approved transport and host fixture. Send the synthetic refresh credential to the resource endpoint and confirm rejection. Verify that only the valid current resource-bound access token reaches the next policy stage; lookup failure, stale state, and refresh-token misuse deny without anonymous fallback, controller dispatch, cross-instance probe, or raw credential disclosure. Record bounded status/result classes and redacted reason categories. Authorization-server issuance and optional refresh rotation/reuse belong to `ATP-MCP-AUTH-03` under `WBS-MCP-20-04`; resource-server fixtures cannot close that AS scenario. If a JWT/JWKS alternative is later selected, add its key-refresh-failure branch separately.

Minimum evidence: source revision, environment/instance labels, configuration fingerprint without secrets, fixture labels not token values, exact procedure, expected/observed result, dispatch counts, and durable redacted artifact location.

### `ATP-MCP-AUTH-02`

Use two synthetic local subjects with different roles/data ownership and narrow/broad OAuth scopes. Compare `tools/list`; then change or revoke role/policy between listing and calling and submit an argument for an unowned resource. Verify that visibility is the current intersection of scope, deployment policy, local Passport/RBAC, data scope, ownership, and risk policy; call-time checks deny stale/hidden/unowned operations without unrelated-existence disclosure.

This dossier does not authorize catalog, tool-risk, fixed-dispatch, or context-isolation implementation. Those gates must be available as approved dependencies or the applicable portions of this ATP must remain blocked and be attributed accurately.

Minimum evidence: source revision, environment/instance labels, policy fixture labels, visibility matrix, explicit list-to-call interleaving, outcomes, scope assertions, dispatch counts, and redacted audit artifact.

### Narrow commands after approval

The test plan records these prospective command families:

```bash
npm run vona -- :bin:test -- <selected-cabloy-mcp-tests> --flavor=normal
npm run tsc
npm run lint
npm run format
npm run test
```

The exact module-local test command, OAuth test harness, and any real-HTTP procedure must be selected only after the generated module and installed dependency ownership are observed. Do not run the placeholder command before then. Root `npm run test` may reinitialize/use the test database under repository workflow and therefore requires explicit inclusion in the approved execution scope; it is not run by this planning dossier.

Planning-only checks are separate from runtime proof:

```bash
npm run spec:check -- cabloy-mcp
npm run spec:charts -- cabloy-mcp
npm run spec:charts:check -- cabloy-mcp
git diff --check
```

If the dossier itself is added or planning records change, these checks may be run as documentary consistency checks. They cannot accept DEC-MCP-03/04, unblock `WBS-MCP-20-02`, or produce ATP evidence.

## Evidence retention, redaction, and cleanup

If execution is later approved and begins, retain a dedicated ATP evidence record only after actual observation, following the suite convention under `evidence/phase-<NN>/`. Each record must link PRD/SRS/WBS/ATP IDs and include revision, clean/dirty classification and attributable diff digest, environment/database/instance/configuration class, exact command or HTTP procedure, synthetic fixture/interleaving labels, expected and observed results, and a durable redacted artifact location.

Do not create an empty evidence directory or fabricated `EVD-*` record. Delete all test-owned persisted resources in `finally` using precise identities and reverse dependency order. Mark prior evidence superseded if source or authority changes invalidate it. No live provider, customer data, or usable credential belongs in evidence.

## Quality gates and allowed record updates

### Independent gates

- **Authority audit:** `npm run spec:check -- cabloy-mcp` is a structural planning check only. Current unresolved ADRs, dependency blocks, and human approvals remain controlling.
- **Chart model/freshness:** charts are derived views. With complete supported inputs, regenerate and check them after any display-affecting progress/authority change. Chart success is not implementation or ATP proof.
- **Human approval/evidence:** separate approval is required for DEC-MCP-03/04, the bounded execution dossier, and each ATP/evidence disposition. Silence or static passes do not substitute for approval.

### Records permitted to change after explicit execution approval

- approved implementation source within the exact module/service/test boundary;
- actual redacted ATP evidence and phase index;
- the selected WBS row's derived status/evidence/blocker/next-proof fields in `progress.md`;
- applicable derived charts after supported input changes;
- an authority record only through a separately approved authority change, never as an implementation side effect.

Before execution approval, this dossier may be corrected for scope, observed revision, or authority facts. It must not change ADR status, WBS status, ATP evidence, issuer values, host values, or runtime claims.

## Blockers and excluded operations

The following are explicit blockers or exclusions, not TODOs to fill by assumption:

- `WBS-MCP-20-01` and proposed AS predecessor `WBS-MCP-20-04` remain blocked and have no source or applicable ATP proof.
- `DEC-MCP-03` remains Proposed; its preferred opaque-token/refresh-token planning direction is not an accepted authorization-server or runtime configuration. The earlier deny-on-required-JWKS-refresh-failure sub-policy applies only to a separately selected JWT/JWKS alternative.
- `DEC-MCP-04` remains Proposed; no host/proxy/instance configuration is approved.
- Issuer/operator, resource URL, metadata owner, client registration/grants, scopes, library, algorithms, cache/refresh/rotation bounds, mapping owner, and final failure taxonomy remain `TODO(confirm)`.
- No `cabloy-mcp` source suite/module, OAuth dependency, provider, endpoint, live host, local subject mapping, or ATP evidence exists.
- Excluded without a separate explicit workflow and confirmation: `npm run init`; database reset/recreation; dependency reinstall; provider calls; live OAuth/webhook operation; credentials or secret changes; real deployment, publication, cutover, or production exposure; cleanup/reset/stash/checkout; broad generation outside this WBS boundary; commit or push; and any unapproved neighboring WBS task.

## Handoff and next action

```text
WBS / phase: WBS-MCP-20-02 / Phase 20
Status: blocked; planning-only dossier draft, not implementation-complete or verified
Revision and worktree: d8ea65675e2496165064a603f752c2d999846a0f; clean worktree at preparation
Scope and exclusions: OAuth resource validation and local subject mapping only; no transport, host binding, provider, endpoint, catalog, dispatch, deployment, or ATP execution yet
Authority and ownership: PRD/SRS/WBS/ATP links above; DEC-MCP-03/04 remain proposed; the preferred Cabloy-integrated authorization-server candidate owns issuance/grants, while Cabloy MCP owns resource validation and local mapping boundary
Completed gates/evidence: repository/edition discovery and dossier-reference review; no runtime or ATP evidence
Commands/procedures actually run: repository identity/status/marker inspection only; no implementation or runtime command
Commands/procedures still required: resolve predecessor and ADR gates, explicitly approve this dossier, then observe source/dependency layout before selecting narrow tests and ATP procedures
Blocker or decision needed: WBS-MCP-20-01 and WBS-MCP-20-04 delivery/proof plus DEC-MCP-03/04 authority closure, DEC-MCP-09 no-schema disposition if needed, and configuration ownership
Next single action: obtain explicit review/approval of this bounded dossier after the unresolved OAuth and predecessor gates are addressed; do not execute source or ATP work automatically
```

Approval of this draft, if later granted, must still be distinct from accepting DEC-MCP-03/04, selecting live configuration, or authorizing provider/deployment operations.
