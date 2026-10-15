# WBS-MCP-20-02 Bounded Execution Dossier (Draft)

## Dossier status

**Planning-only draft — awaiting separate execution approval.** This record scopes a possible bounded execution of `WBS-MCP-20-02`; it does not authorize source changes, dependency installation, provider or endpoint configuration, runtime verification, ATP execution, or status advancement. The target is currently blocked and must remain blocked until the listed predecessor and authority gates close.

Prepared from the observed worktree at revision `d8ea65675e2496165064a603f752c2d999846a0f` on 2026-10-08. Revision-specific preparation and clean-worktree observations below are historical, not the current checkout state; later design-only decisions are noted without recasting them as execution approval. No runtime or ATP evidence is claimed.

## Execution target

- **Suite:** `cabloy-mcp`
- **Target WBS:** `WBS-MCP-20-02 — Integrate OAuth resource-server validation and local subject mapping`
- **Target class:** backend increment, contingent on an approved bounded execution dossier and resolved authority gates.
- **Finite boundary:**
  - integrate the approved OAuth protected-resource validation boundary for each protected MCP request against a separately approved and available authorization-server/token service delivered under `WBS-MCP-20-04` (or an explicitly approved equivalent AS disposition);
  - map a validated subject to exactly one active local Passport-compatible identity in the already bound Vona instance;
  - enforce fail-closed behavior before protected discovery, `tools/list`, or `tools/call` reaches a business controller;
  - cover the resource-server portions of `ATP-MCP-AUTH-01` and the linked `ATP-MCP-AUTH-02` procedures after implementation. The first profile issues no refresh tokens; any later refresh issuance/rotation needs a separate authority decision and AS-owned proof.
- **Not included:** authorization-server endpoint/grant/shared-state implementation (owned logically by `a-auth` with `zhennann` responsible for implementation/operations, but requiring its own exact storage/interaction approval and bounded WBS scope), transport implementation (`WBS-MCP-20-01`), host/proxy-to-instance implementation (`WBS-MCP-20-03`), tool catalog or risk policy, fixed dispatch/context isolation, operational limits/audit, deployment, or release closure.

## Edition, repository, revision, and worktree

- **Edition:** Cabloy Basic, observed from the sole marker `__CABLOY_BASIC__`.
- **Repository root:** `/Volumes/my-data/cabloy-multirepo/cabloy-basic/.claude/worktrees/spec-basic-cabloy-mcp`
- **Planning authority directory:** `/Volumes/my-data/cabloy-multirepo/cabloy-basic/.claude/worktrees/spec-basic-cabloy-mcp/repo-specs/cabloy-mcp/`
- **Revision:** `d8ea65675e2496165064a603f752c2d999846a0f`
- **Worktree classification at 2026-10-08 preparation only:** clean at that revision; this historical observation does not classify the current worktree (which must be reinspected before any execution) or approve execution.
- **Edition-sensitive workflow:** the root `package.json` exposes the observed `npm run vona`, `npm run tsc`, `npm run lint`, `npm run format`, `npm run test`, `npm run spec:check`, and chart commands. No command below is claimed to have been run for this dossier unless listed under “Commands actually run.”

## Authority and traceability

### Product and technical records

- PRD: `PRD-MCP-IDENTITY-01`, `PRD-MCP-IDENTITY-03`
- SRS: `SRS-MCP-AUTH-01`, `SRS-MCP-AUTH-02`, `SRS-MCP-NFR-01`
- WBS: `WBS-MCP-20-02`
- ATPs: `ATP-MCP-AUTH-01`, `ATP-MCP-AUTH-02`
- Related transport authority: [ADR 0002](./decisions/0002-mcp-transport.md), accepted for design only; transport source and proof remain outside this target.
- Related OAuth authority: [ADR 0003](./decisions/0003-mcp-oauth-resource-server.md), **accepted for bounded design only on 2026-10-09**, after this dossier's 2026-10-08 preparation. The earlier optional-refresh candidate is superseded: the first profile has pre-registered public/confidential clients, Authorization Code + PKCE S256, MCP-only opaque access tokens with current lookup and **no refresh issuance**. The deny-on-required-JWKS-refresh-failure sub-policy applies only to a separately selected JWT/JWKS alternative.
- Related state/owner authority: [ADR 0009](./decisions/0009-mcp-as-state-boundary.md), **accepted design-only amendment beginning on 2026-10-10, revised on 2026-10-11**. The integrated `a-auth` logical AS route is selected; `zhennann` owns implementation and operations. DEC-MCP-09 selects one AS-owned database-backed authority with code consumption/token activation in one atomic commit (without assuming a default explicit multi-statement transaction) and Zova presentation of an AS-owned per-request approve/deny flow. A later 2026-10-15 design choice targets SQLite via `better-sqlite3` on Vona's existing primary datasource for the first AS implementation; it does not establish actual deployment configuration or atomicity. No AS schema, Zova site/flavor/admission/SSR, concrete identity/session/CSRF implementation, remembered consent or execution is approved.
- Related instance authority: [ADR 0004](./decisions/0004-mcp-host-instance-binding.md), **Proposed**. Its endpoint/resource/instance interface is a required integration dependency, not an accepted host or proxy configuration.
- Overall boundary: [ADR 0001](./decisions/0001-mcp-suite-boundaries.md), accepted for the overall boundary and initial structural design only.
- Evidence references: `evidence/phase-10/` contains documentary planning closures for WBS-MCP-10-01 and WBS-MCP-10-02 only. No `ATP-MCP-AUTH-01` or `ATP-MCP-AUTH-02` evidence exists.

### Dependency readiness

- `WBS-MCP-20-01` is **blocked**. Its planning predecessors are documentary `planning-complete`, and DEC-MCP-02's transport design is accepted, but no transport source, bounded implementation approval, or real-HTTP proof exists. This dossier does not override that block.
- Predecessor `WBS-MCP-20-04` is **blocked**: despite the selected integrated `a-auth` logical AS and `zhennann`'s implementation/operations ownership, no exact approved shared-state store/interaction, approved AS execution dossier, AS source/contract proof or `ATP-MCP-AUTH-03` result exists. Its numeric suffix does not mean it follows resource-server implementation.
- `DEC-MCP-03` is **accepted for bounded design only**; ADR 0009 selects the integrated route, one AS-owned database-backed authority with an atomic code-consumption/token-activation commit, and Zova presentation of the AS-owned per-request approve/deny flow for design only. Concrete issuer/resource identifiers, physical storage representation, Zova site/admission/SSR, browser identity/session/CSRF implementation, lookup consistency, mapping adapter, scope/grant semantics and outage taxonomy remain unresolved. First-profile no-refresh issuance is decided; refresh rotation/reuse is not part of this profile.
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

The proposed module is **not** an observed existing target. It is not yet an explicitly approved new implementation target for this dossier: DEC-MCP-03 and ADR 0009 are design-only, `WBS-MCP-20-01` and AS predecessor `WBS-MCP-20-04` remain blocked, and this execution dossier has no approval. DEC-MCP-01's accepted topology does not by itself authorize creation.

### Ownership boundary

- The selected integrated `a-auth` logical AS owns issuer metadata, authorization code + PKCE S256, pre-registered client compatibility, reviewed resource-owner interaction, grants, MCP opaque access-token issuance and revocation; `zhennann` is responsible for its implementation and operations. The first profile issues no refresh tokens and does not approve remembered consent. A separately operated AS would require a new route decision.
- The future `cabloy-mcp` module owns protected-resource validation and the server-side mapping handoff only; it does not receive refresh tokens, provide an independent OAuth login/consent store, or create a second identity/tenant authority. Ordinary `createTempAuthToken()` is not accepted as an MCP token without explicit profile separation.
- Existing Vona Passport, local activation, RBAC, data-scope, and domain ownership remain authoritative after mapping.
- DEC-MCP-04 owns trusted endpoint/instance binding; DEC-MCP-07 owns fresh execution context construction; DEC-MCP-06 owns scope/tool policy; DEC-MCP-08 owns operational telemetry and redaction.

## Proposed bounded implementation (only after approval)

The approved implementation, if later authorized, would be limited to the following contract:

1. Accept exactly one HTTP `Authorization: Bearer` credential for protected MCP requests; reject query, cookie, `x-vona-passport-code`, refresh-token, and other token locations.
2. Look up or introspect an MCP-profile access token through the approved authorization-server/token service and confirm the token's active state, profile, issuer, canonical resource, client/grant, expiry, stable nonempty subject, scope, bound instance relation, and revocation state. Fail closed when current authorization state cannot be confirmed; do not use stale lookup state to extend trust.
3. Reject any refresh-type credential at the resource endpoint. The accepted first profile has no refresh issuance; verify that the separately delivered AS preserves resource/client/subject/instance/grant boundaries. A later refresh profile would need a separate authority decision and AS-owned token-endpoint proof. This resource-server dossier does not implement that endpoint or grant store.
4. Map `(issuer, sub, bound instance)` to exactly one active local identity. Missing, ambiguous, disabled, inactive, wrong-instance, or unavailable mappings fail closed without probing unrelated instances or accepting external roles as local authority.
5. Create or hand off a fresh request-owned local Passport projection for downstream authorization. Do not reuse an unrelated parent request Passport.
6. Return only the approved bounded authorization result to the transport layer. Do not expose raw tokens, claims, token-store records, secrets, private keys, complete profiles, or mapping-store details.

The exact issuer, resource URL, metadata values, scope vocabulary, opaque-token representation/hash policy, lookup consistency, access lifetime, HTTP status taxonomy, and mapping service are placeholders until separately approved and configured. The accepted first profile issues no refresh tokens; rotation/reuse bounds require a new authority decision rather than being placeholders for this profile. If a JWT/JWKS alternative is later selected, its algorithm, key-refresh, and cache policy must be added as a separate approved branch.

## Safety and contract constraints

- **Tenant/instance:** use only the trusted instance supplied by the agreed DEC-MCP-04 interface. A token claim, raw host, query/header selector, tool argument, or client-provided instance identifier cannot select an instance. No cross-instance probing.
- **Identity:** external `sub` is an input to a server-owned mapping; it is not a local user ID, role, tenant, or Passport by itself.
- **Authorization:** OAuth scope is an upper bound. Local activation, RBAC, data scope, ownership, deployment policy, and operation risk remain mandatory and are not implemented or weakened here.
- **Lifecycle:** every protected request performs the required validation and mapping decision. List visibility is not a call grant; call-time recheck belongs to downstream authorization tasks.
- **Transactions and persistence:** this target proposes no MCP resource-module-owned schema or persisted field. ADR 0009 selects one AS-owned database-backed authority and an atomic code-consumption/token-activation outcome for bounded design, not a physical database, default explicit multi-statement transaction, schema or service. The later AS target is same-host multiple Vona workers sharing persistent SQLite/`better-sqlite3` through Vona's existing primary datasource. If persistence resides in existing `a-auth`, the user selected keeping `vonaModule.fileVersion: 1` and folding schema into its version-1 creation path, without a version-2 migration or automatic upgrade of already-recorded v1 databases. Installation scope, actual deployment, exact schema and execution remain gated; cross-host SQLite and replicas are not selected. A materially different owning-module premise needs its own version disposition before persisted edits. The current RS dossier authorizes no persisted change; a later approved `meta.version.ts` edit requires root `npm run test`.
- **Concurrency and recovery:** concurrent subject/instance checks must use separate Vona `mockCtx(...)` boundaries where scoped state is involved. Opaque-token lookup outage, mapping ambiguity, or validation uncertainty fails closed. A required key-refresh failure applies only to a separately approved JWT/JWKS alternative. No automatic retry of external side effects is in scope.
- **Privacy/audit:** tests and evidence use synthetic labels and redacted fingerprints only. No raw token, signed JWT, full claims, client secret, refresh token, cookie, JWKS body, private key, or complete subject profile may be retained. Detailed audit ownership remains DEC-MCP-08.
- **SSR/site/flavor:** this MCP resource-server target has no Zova page, browser flow, or SSR site. ADR 0009 selects Zova only for the narrow per-request AS approval/denial presentation under blocked `WBS-MCP-20-04`, with AS decision/issuance/redirect authority and separate AS-owned verification. No Web/Admin/new site, flavor, SSR profile, admission or identity/session bridge is selected. No frontend contract loop applies to this RS task.
- **Contract direction:** this is a Vona backend increment. There is no generated Zova consumer; no generated consumer may be hand-edited.

## Verification and evidence plan (prospective)

These procedures become runnable only after the dependency and authority gates close, the dossier is explicitly approved, and the source/dependency layout is observed. They are not results of this dossier.

### `ATP-MCP-AUTH-01`

Use synthetic MCP-profile lookup/introspection fixtures for valid issuer/resource/subject/scope/instance, wrong issuer, wrong resource, expired/inactive/revoked state, missing subject/scope, lookup outage, stale state, disabled/unmapped subject, and ambiguous mapping. Prepare a synthetic refresh credential as a negative resource-endpoint fixture only; do not retain its value.

Exercise metadata, `tools/list`, and `tools/call` through the approved transport and host fixture. Send the synthetic refresh credential to the resource endpoint and confirm rejection. Verify that only the valid current resource-bound access token reaches the next policy stage; lookup failure, stale state, and refresh-token misuse deny without anonymous fallback, controller dispatch, cross-instance probe, or raw credential disclosure. Record bounded status/result classes and redacted reason categories. Authorization-server issuance and the accepted no-refresh behavior belong to prospective `ATP-MCP-AUTH-03` under blocked `WBS-MCP-20-04`; resource-server fixtures cannot close that AS scenario. If a JWT/JWKS alternative is later selected, add its key-refresh-failure branch separately.

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

- **Authority audit:** `npm run spec:check -- cabloy-mcp` is a structural planning check only. DEC-MCP-03/ADR 0009 design-only acceptance does not close DEC-MCP-04, exact AS storage/interaction, dependency blocks, or human execution approval.
- **Chart model/freshness:** charts are derived views. With complete supported inputs, regenerate and check them after any display-affecting progress/authority change. Chart success is not implementation or ATP proof.
- **Human approval/evidence:** DEC-MCP-03 and ADR 0009 have design-only acceptance; separate approval remains required for DEC-MCP-04, exact AS storage/interaction, the bounded execution dossier, and each ATP/evidence disposition. Silence or static passes do not substitute for approval.

### Records permitted to change after explicit execution approval

- approved implementation source within the exact module/service/test boundary;
- actual redacted ATP evidence and phase index;
- the selected WBS row's derived status/evidence/blocker/next-proof fields in `progress.md`;
- applicable derived charts after supported input changes;
- an authority record only through a separately approved authority change, never as an implementation side effect.

Before execution approval, this dossier may be corrected for scope, observed revision, or authority facts. It must not change ADR status, WBS status, ATP evidence, issuer values, host values, or runtime claims.

## Blockers and excluded operations

The following are explicit blockers or exclusions, not TODOs to fill by assumption:

- `WBS-MCP-20-01` and AS predecessor `WBS-MCP-20-04` remain blocked and have no source or applicable ATP proof; ADR 0009's logical AS route/owner selection is not delivery.
- `DEC-MCP-03` is accepted for bounded design only; ADR 0009 selects the integrated `a-auth` logical AS, `zhennann`'s implementation/operations responsibility, one AS-owned database-backed atomic-commit authority and Zova presentation of the AS-owned per-request grant flow for design only. Neither approves a physical store/schema, Zova site/flavor/admission/SSR or identity/session/CSRF implementation, live configuration or runtime issuance; the first profile has no refresh issuance. The earlier deny-on-required-JWKS-refresh-failure sub-policy applies only to a separately selected JWT/JWKS alternative.
- `DEC-MCP-04` remains Proposed; no host/proxy/instance configuration is approved.
- The integrated AS route, accountable owner, database-backed atomic-commit authority direction and Zova-presented AS per-request browser flow are decided for design, but issuer/resource URL, metadata configuration, physical state service/schema, Zova site/admission/SSR and concrete identity/session/CSRF mechanics, scopes, library, access lifetime, lookup consistency, local mapping adapter, and final failure taxonomy remain `TODO(confirm)`. Refresh/rotation is outside the first profile.
- No `cabloy-mcp` source suite/module, OAuth dependency, provider, endpoint, live host, local subject mapping, or ATP evidence exists.
- Excluded without a separate explicit workflow and confirmation: `npm run init`; database reset/recreation; dependency reinstall; provider calls; live OAuth/webhook operation; credentials or secret changes; real deployment, publication, cutover, or production exposure; cleanup/reset/stash/checkout; broad generation outside this WBS boundary; commit or push; and any unapproved neighboring WBS task.

## Handoff and next action

```text
WBS / phase: WBS-MCP-20-02 / Phase 20
Status: blocked; planning-only dossier draft, not implementation-complete or verified
Revision and worktree: d8ea65675e2496165064a603f752c2d999846a0f; clean worktree at preparation
Scope and exclusions: OAuth resource validation and local subject mapping only; no transport, host binding, provider, endpoint, catalog, dispatch, deployment, or ATP execution yet
Authority and ownership: PRD/SRS/WBS/ATP links above; DEC-MCP-03 and ADR 0009 accepted for design only, DEC-MCP-04 proposed; integrated `a-auth` logical AS selected with `zhennann` responsible for implementation/operations, while Cabloy MCP owns resource validation and local mapping boundary
Completed gates/evidence: repository/edition discovery and dossier-reference review; no runtime or ATP evidence
Commands/procedures actually run: repository identity/status/marker inspection only; no implementation or runtime command
Commands/procedures still required: resolve predecessor and ADR gates, explicitly approve this dossier, then observe source/dependency layout before selecting narrow tests and ATP procedures
Blocker or decision needed: WBS-MCP-20-01 and WBS-MCP-20-04 delivery/proof, DEC-MCP-04 host authority, exact AS shared-state/interaction approval and installation applicability/migration approval under the conditional existing-a-auth keep-v1 strategy (another owner needs its own version disposition) before a schema edit, and live configuration ownership
Next single action: obtain explicit review/approval of this bounded dossier after the unresolved OAuth and predecessor gates are addressed; do not execute source or ATP work automatically
```

Approval of this draft, if later granted, must still be distinct from DEC-MCP-03/ADR 0009's design-only acceptance, accepting DEC-MCP-04, approving AS storage/interaction and any schema/version choice, selecting live configuration, or authorizing provider/deployment operations.
