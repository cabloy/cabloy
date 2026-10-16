# WBS-MCP-20-04 AS Execution Dossier (Planning Draft)

## Dossier status

**Planning-only execution dossier draft — not approved for execution and not execution-ready.** This record scopes the bounded work required for `WBS-MCP-20-04`, but the task remains `blocked`. It does not authorize source changes, dependency installation, schema or external-store creation, provider or issuer configuration, authorization-endpoint operation, credential changes, OAuth/HTTP execution, ATP execution, or status advancement.

Originally prepared against the Cabloy Basic worktree at revision `1e7c10ce84` on 2026-10-09; reconciled against clean `2dda23660f`, then reviewed against clean `9cca451dff` on 2026-10-10. The bounded planning disposition selects an integrated `a-auth` AS logical owner with `zhennann` responsible for implementation and operations, one AS-owned database-backed authority with a database-neutral atomic-commit **state direction**, and a per-request AS approve/deny flow presented by Zova under ADR 0009's 2026-10-11 revision. On 2026-10-14, the bounded directions for both physical state and browser presentation were separately accepted: use a trusted-instance-scoped AS authorization aggregate with locator/secret opaque credentials, complete conditional transitions, same-commit code redemption/activation and fresh authoritative fail-closed lookup; evaluate the observed Basic Web site with a narrow AS page, an AS-verifiable short-lived HttpOnly bridge, fixed internal continuation, request-bound CSRF, synchronous per-path early instance admission and an AS-built final redirect. The earlier backend-rendered HTML direction is superseded; no explicit multi-statement transaction is assumed for the MVP, but code consumption and resulting token activation must share one atomic commit. The first AS implementation now targets SQLite via `better-sqlite3` on Vona's existing primary datasource; this does not confirm the actual deployment or prove SQLite atomicity. No schema, AS source, concrete Zova site/role admission, flavor/route/SSR behavior, bridge/session/CSRF implementation, endpoint, provider configuration, usable credential, grant/token record, or `ATP-MCP-AUTH-03` evidence is claimed.

This dossier follows the accepted-for-design-only disposition in [ADR 0003](./decisions/0003-mcp-oauth-resource-server.md) and the planning review in [the AS design dossier](./wbs-mcp-20-04-as-design-review.md). The [AS state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) is the basis for the separately selected database-backed atomic-commit authority and Zova presentation of the AS-owned per-request browser-flow **directions**; it does not approve the physical store or concrete browser interaction. This dossier remains a readiness and approval boundary, not an implementation plan that silently resolves the remaining authority decisions.

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
- **State/interaction design authority:** [ADR 0009](./decisions/0009-mcp-as-state-boundary.md) selects one database-backed AS authority with a database-neutral atomic-commit contract and Zova per-request grant presentation for bounded design; AS alone decides, issues and performs the final redirect. Its 2026-10-14 dispositions accept the bounded physical direction (trusted-instance-scoped aggregate, locator/secret opaque credentials, complete conditional transitions, same-commit redemption/activation and fresh authoritative fail-closed lookup) and browser direction (evaluate Basic Web, an AS-verifiable short-lived HttpOnly bridge, fixed continuation, request-bound CSRF and synchronous per-path early admission). The first AS target is SQLite/`better-sqlite3` on Vona's existing primary datasource; it does not confirm the deployed client/datasource or approve a physical schema, final site/role admission, flavor/route/SSR behavior, identity/session/CSRF implementation, migration, remembered consent or execution.
- **Design review:** [WBS-MCP-20-04 AS design review dossier](./wbs-mcp-20-04-as-design-review.md), accepted as the bounded design basis only; the later [AS state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) records the basis and remaining unselected physical/interaction choices.

### Dependency readiness

| Dependency or gate | Current state                              | Effect on this dossier                                                                                                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WBS-MCP-10-01`    | `planning-complete` documentary closure    | Satisfies its planning dependency only; no AS source or runtime proof.                                                                                                                                                                                                                                                                          |
| `WBS-MCP-10-02`    | `planning-complete` documentary closure    | Satisfies its planning dependency only; no AS source or runtime proof.                                                                                                                                                                                                                                                                          |
| `DEC-MCP-03`       | `accepted (design only)`                   | Establishes the bounded design direction; does not authorize concrete execution.                                                                                                                                                                                                                                                                |
| `DEC-MCP-09`       | `accepted (bounded design direction only)` | Selects one AS-owned database-backed authority with atomic code-consumption/token-activation commit and Zova per-request presentation; the selected SQLite/`better-sqlite3` primary-datasource target still needs deployment confirmation; site/admission/identity/CSRF, schema, SQLite proof, retention, migration and execution remain gated. |
| `WBS-MCP-20-01`    | `blocked`                                  | Not a direct AS implementation prerequisite, but no end-to-end MCP proof can be claimed while transport is absent.                                                                                                                                                                                                                              |
| `WBS-MCP-20-02`    | `blocked`                                  | Remains dependent on this AS contract plus transport and instance gates.                                                                                                                                                                                                                                                                        |
| `DEC-MCP-04`       | `proposed`                                 | The AS must preserve its shared resource/instance interface; this dossier cannot choose host, proxy, or instance values.                                                                                                                                                                                                                        |
| `ATP-MCP-AUTH-03`  | prospective, no evidence                   | Must be run only after owner, storage, source/configuration, and execution approval close.                                                                                                                                                                                                                                                      |

The target remains blocked: the integrated route, implementation/operations responsibility, accepted bounded physical state direction and accepted bounded browser-presentation direction are recorded, but confirmation of the SQLite/`better-sqlite3` existing-primary-datasource target in deployment, schema/retention/uniqueness/consistency proof on SQLite, final Zova site/role admission and route/flavor/SSR behavior, concrete browser identity/session/CSRF implementation, synchronous ingress map, configuration, migration implementation and actual eligibility under the accepted fresh-only conditional existing-`a-auth` keep-v1 scope, execution approval, and AS-owned proof remain open. Planning-complete predecessors and either bounded package disposition do not authorize execution.

## Observed source and feasibility boundary

The following existing paths are read-only inputs and do not establish an MCP AS:

- `vona/src/suite-vendor/a-auth/modules/auth-oauth/src/bean/authProvider.oauth.ts` — provider/login strategy registration, not MCP metadata, client/grant registration, resource-indicator processing, or token issuance.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/controller/passport.ts` — provider login callback with signed OAuth state, not a general MCP authorization endpoint.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/controller/mock.ts` — development-only mock authorization form, not production user authentication, consent, code issuance, or PKCE handling.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/service/auth.ts` — local provider callback and OAuth-code handoff, without the required MCP resource/client/PKCE/grant lifecycle.
- `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts` — local Passport and JWT/session refresh helpers, not a one-time MCP refresh-family or opaque-token service.
- `vona/src/suite-vendor/a-vona/modules/a-user/src/service/redisToken.ts` — instance-scoped session marker, not a token-digest-to-grant, consent, or revocation store.
- `vona/src/suite-vendor/a-auth/modules/a-auth/src/bean/meta.version.ts` and `package.json` — existing auth persistence and module metadata, not approval for MCP state or a file-version change.

The selected integrated `a-auth` logical route may extend an existing auth owner, but the later refinement below accepts existing-`a-auth` physical ownership, dedicated service-scene responsibilities and the logical aggregate/lifecycle only. Exact source files, package/dependency ownership, schema and implementation remain unselected. A separately operated AS is not selected; any future switch needs a new route decision, approved operator, contract, resource registration, current lookup proof, and redacted evidence.

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

Creating AS endpoints, consent UI, grant storage, or token issuance in the resource module is explicitly excluded. Zova is selected to present only the narrow AS per-request approve/deny interaction, not a resource-module UI or general management site. The browser package's bounded direction accepts evaluating the observed Basic Web site, an AS-verifiable short-lived HttpOnly bridge, fixed internal continuation, request-bound CSRF, synchronous per-path early admission and AS-built final redirect; no final Web role/site admission, route/flavor, SSR mode, session lifecycle or concrete browser implementation is selected. That surface needs a separately approved source, privacy, browser/SSR and acceptance scope. The RS target itself has no Zova page.

## Authority gates before execution approval

Execution cannot start until each gate below has a recorded disposition in the owning authority and the bounded dossier is re-approved if the scope changes.

### Recorded topology and conditional version inputs (2026-10-15)

The first implementation and verification target is multiple Vona workers on one host sharing persistent SQLite/`better-sqlite3` through Vona's existing primary datasource. This selects neither cross-host SQLite nor replica support and does not attest to an actual deployment. Exact worker count, effective datasource per AS-bound instance, storage/connection ownership and contention/failure policy remain open. Prospective ATP must prove cross-worker approval/redemption contention, acknowledged-revocation visibility and connection/failure behavior; separate contexts within one process are insufficient. No SQLite journal mode, busy timeout, pool size or automatic replay/retry policy is selected here.

If AS persistence resides in existing `a-auth`, keep `vonaModule.fileVersion: 1` and fold schema into its version-1 creation path; no new version-2 migration is selected. Databases already recorded at v1 do not automatically upgrade. Fresh-only installation scope/exclusions and confirmation requirements are accepted below; exact source targets/schema, actual eligibility, migration implementation and partial recovery remain gated before persisted edits. Existing-v1 upgrade/adoption remains excluded pending a separate disposition. This is not reset/recreation or source approval. Do not re-ask the conditional keep-v1 question unless the owning-module premise changes. A later approved `meta.version.ts` edit requires root `npm run test`; neither is authorized here.

### Installation scope and confirmation requirements accepted (bounded design only)

[ADR 0009](./decisions/0009-mcp-as-state-boundary.md) records the 2026-10-15 approval of [concrete AS contract dossier sections 9.2–9.4](./wbs-mcp-20-04-as-contract-dossier.md#92-installation-applicability-accepted-bounded-design-only): fresh physical-database/v1 creation only and explicit exclusion/blocking of existing-v1 adoption/upgrades, missing-history-with-existing-objects, partial creation and unknown states. Shared instances do not each get a fresh schema history. The secret-free confirmation requirements cover per-instance/worker effective routing and per-physical-target installation classification; every actual observation remains unconfirmed and no installation is classified as eligible. Fail-closed activation requirements are accepted; the later refinement below accepts responsibilities/timing only, not source mechanics. This is not a completed Gate B or deployment attestation. Exact schema, recovery, connection policy and safe runtime fixtures/procedures remain open; no replay/reset, deployment inspection or execution is authorized.

### Owner/representation/activation-check refinement accepted (bounded design only)

[Concrete dossier sections 9.5–9.8](./wbs-mcp-20-04-as-contract-dossier.md#95-owner-and-runtime-boundary-bounded-design-accepted) were prepared separately, then accepted in the 2026-10-15 finite design disposition recorded in ADR 0009 and SRS-MCP-AUTH-04: physical ownership in existing `a-auth`, dedicated service-scene authorization/readiness responsibilities, one logical aggregate/lifecycle, layered read-only activation responsibilities/timing and only verifiable continuity of the same approved fresh-v1 installation across restart. The selected owner satisfies the existing conditional keep-v1 premise. This is not a completed Gate B, selection of exact source targets/DDL, proof of provenance or acceptance of check mechanics. Startup is not a substitute for per-effective-binding readiness or current-token lookup; arbitrary existing-v1 adoption remains excluded. Exact source hooks, physical contract, provenance/coherence/reuse mechanism, credential/connection/browser/protocol details and execution/runtime proof remain gated. The deployment template is unfilled and no installation qualifies by this record.

### Provenance/read-only-check mechanism accepted (bounded design only)

Separately authorized preparation at clean `e66171a243` produced [concrete dossier sections 9.9–9.12](./wbs-mcp-20-04-as-contract-dossier.md#99-installation-provenance-mechanism-bounded-design-accepted), initially proposed. The later separate 2026-10-15 four-row disposition, recorded against clean checkout `20b6aeb8b4` before planning edits in ADR 0009 and SRS-MCP-AUTH-04, accepts protected completion receipt/noncredential installation-generation pairing, actual pinned-connection uncached inspection with ambient-transaction rejection, no positive readiness reuse/coordinated AS quiescence, and prospective synthetic proof/minimization. Earlier mechanism gates are refined only to that bounded extent. This does not complete Gate B or authorize source: exact storage/integrity/custody/retention/withdrawal/identity, commit/publication hooks/failure handling and adapter/dependencies/SQL/schema/logging, connection/fleet/drain enforcement, fixtures/safe launcher/procedure and public errors remain open. Existing helpers do not establish physical handle binding, independent SQLite transaction escape, uncached complete schema inspection or installation provenance. Copies/restores and ambiguous completion stay blocked without automatic repair/adoption. All 11 deployment observations remain unconfirmed, no installation qualifies, and execution/ATP/release gates are unchanged; verified count stays 0/12. The later separately authorized candidate preparation below does not follow automatically from mechanism acceptance or authorize implementation/deployment inspection.

### Receipt/marker and physical-identity contract accepted (bounded design only)

Separately authorized preparation on 2026-10-15 at `20b6aeb8b4` with eight carried planning edits produced [concrete dossier sections 9.13–9.16](./wbs-mcp-20-04-as-contract-dossier.md#913-receipt-and-marker-representation-bounded-design-accepted), initially proposed. After the candidate report, `zhennann` agreed to the offered independent four-row design-disposition step; ADR 0009/SRS-MCP-AUTH-04 record that bounded acceptance at the same revision with the carried edits, not a clean checkout. Accepted rows cover strict bounded JSON/minimal marker and specified format limits, protected local operations custody/current activation/sticky withdrawal/installation-life retention, conservative acknowledged no-overwrite durable publication with ambiguous failures blocked, and qualified actual-connection/storage-lineage controls. This is not a completed Gate B or acceptance of a platform, source or executable procedure. Paths/metadata/generation/signatures alone are insufficient; copied/restored and ambiguous completion remain blocked without reconstruction/adoption. SQLite initialization may change WAL; the read-only check is not write-free acquisition proof. Exact parser/grammar/activation encoding/DDL, publisher/hooks/filesystem durability, live-handle adapter, permission/confinement/sidecar/fleet controls, retention/disposal duration, actual eligibility/deployment and runtime proof remain gated. All 11 observations remain Unconfirmed, no installation qualifies and verified count stays 0/12. This disposition did not authorize the later candidate preparation.

### Aggregate/marker schema and conditional-transition contract accepted (bounded design only)

After separate preparation authorization, [concrete dossier sections 9.17–9.20](./wbs-mcp-20-04-as-contract-dossier.md#917-aggregate-and-marker-physical-schema-bounded-design-accepted) were prepared on 2026-10-15 at `20b6aeb8b4` with eight carried planning edits, initially Proposed. After the candidate report, `zhennann` agreed to the offered independent four-row design-disposition step; ADR 0009/SRS-MCP-AUTH-04 record this later bounded acceptance against clean `b0ff7ceab0` before planning edits. All four rows and their dependency/platform/ambiguity limits are accepted: one explicit aggregate row/five-column installation singleton physical contract, complete scoped lifecycle and same-row consumption/activation, absent-row-safe serialized creation/direct pinned write-read result/commit responsibilities, and prospective synthetic proof obligations. This is no completed Gate B or physical package, approved emitted DDL/source/native adapter/platform, executable fixture/procedure, result or execution approval. Read-only source facts demonstrate ordinary Model cache preselection/returned-data limitations, not a working SQLite adapter. Exact emitted DDL/checker/source, credential/browser/registration-policy/clock/TTL/retention/no-reuse, reservation/affected-count/owning-commit/native identity/platform/fleet/logging controls and actual attestation remain gated. No executable DDL, source, target/receipt, runtime fixture/procedure or ATP exists from this step. Earlier bounded acceptances remain unchanged; all 11 observations stay Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and verified count 0/12.

### Locator/credential, verifier and custody contract accepted (bounded design only)

After the accepted-storage report, `zhennann` agreed only to candidate preparation. [Concrete dossier sections 9.21–9.24](./wbs-mcp-20-04-as-contract-dossier.md#921-locator-and-credential-wire-contract-bounded-design-accepted) were prepared on 2026-10-15 at `b0ff7ceab0` with eight carried planning edits, initially Proposed. After the candidate report, `zhennann` explicitly agreed to independent acceptance of all four section 9.24 rows for bounded design only on 2026-10-16, recorded in ADR 0009/SRS-MCP-AUTH-04 against clean `086811c5e5` before planning edits. Every dependency/platform/ambiguity restriction remains: strict version/kind pending/code/token formats, independent 32-byte credential secrets, a seven-field length-prefixed purpose/context-separated SHA-256 binary verifier without pepper/key, ephemeral AS custody/winner-only release/no recovery, retry, reissue or rollover, and prospective synthetic proof obligations. Preparation/static checks were not acceptance. No Gate A/B/C, browser decision-binding contract, clock/TTL/retention/no-reuse/platform dependency or execution/procedure gate is completed. Accepted sections 9.2–9.20/physical slots remain unchanged. No source, DDL, actual key/credential, fixture/procedure, deployment observation or evidence is created; AS/RS remain blocked, ATP prospective, 11 Unconfirmed and 0/12 verified. Bounded design acceptance does not authorize implementation automatically.

### Trusted-time, absolute-deadline and TTL contract accepted (bounded design only)

After the credential-acceptance report, `zhennann` agreed to candidate preparation only. [Concrete dossier sections 9.25–9.28](./wbs-mcp-20-04-as-contract-dossier.md#925-trusted-time-assurance-boundary-bounded-design-accepted), prepared on 2026-10-16 at `086811c5e5` with eight attributable carried planning edits, initially proposed bounded synchronous epoch-ms intervals/fleet nondecreasing bounds/qualified restart continuity, safe conservative distinct phase deadlines, actual-effect/read fencing/fresh acknowledged release and prospective synthetic proof. After the candidate report, `zhennann` explicitly agreed to independent acceptance of all four section 9.28 candidates. ADR 0009/SRS-MCP-AUTH-04 record this later bounded design acceptance on 2026-10-16 at the same `086811c5e5` with eight attributable carried planning edits from credential acceptance and time-candidate preparation, not a clean checkout. Retain every platform/parameter/continuity/dependency/ambiguity restriction; preparation/static checks were not acceptance. All four rows are accepted for bounded design only, none deferred or implementation-authorized; this is not a selected TTL/profile value, working provider/native integration, qualified host/continuity mechanism or executable procedure. No new timestamp/high-water schema field, clock operation, source/DDL/credential/runtime/evidence is created. Accepted sections 9.2–9.24 and physical fields are unchanged. Browser/policy synchronization, retention/no-reuse, platform/driver/epoch/fleet/response/operations and exact parameter/fixture/procedure/execution gates remain open; no Gate A/B/C or physical-package/execution completion follows. All 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified.

### Browser decision-binding, CSRF custody and invalidation contract accepted (bounded design only)

After the time-acceptance report, `zhennann` agreed only to the offered candidate preparation, including `decisionBindingDigest`. [Concrete dossier sections 9.29–9.32](./wbs-mcp-20-04-as-contract-dossier.md#929-decision-binding-preimage-and-verifier-bounded-design-accepted), prepared on 2026-10-16 at `086811c5e5` with eight attributable carried planning edits, not a clean checkout, initially proposed four rows under ADR 0009/SRS-MCP-AUTH-04: independent browser/CSRF secret32 and fixed-domain eight-LP-field SHA-256 binary32 immutable correlation verifier; request-specific HttpOnly holder, separately authenticated current-subject/auth/session bridge, strict Origin and independent CSRF for minimal post-hydration summary/native decision; fixed-binding invalidation ordered across workers through effect/commit/release; prospective synthetic proof/dependencies. Initially Proposed, all four were later independently accepted for bounded design only on 2026-10-16 after `zhennann` explicitly selected all four bounded acceptances; agreement to undertake disposition was not itself the acceptance choice. Recorded at the same `086811c5e5` with eight attributable carried planning edits from credential/time preparation and acceptance and browser-candidate preparation, not a clean checkout. Every custody/bootstrap/first-binding/current-session/cross-worker synchronization/platform/parameter/dependency/ambiguity limit remains; none is deferred or implementation-authorized. Preparation/static checks were not acceptance. No compliant custody, executable bootstrap, authoritative session continuity or working synchronization is established. `C` inside an HttpOnly holder is not independent submitted CSRF, and a bridge-gated summary cannot bootstrap its own bridge; exact proof sequencing remains gated. Pending subject remains NULL, no digest rewrite/session field/store/Redis authority/raw persistence or custody exception is introduced. Exact holder/bridge/key/cookie/first-binding/current-session/Origin/SSR/transport, browser disk/session restore custody and authoritative invalidation/policy synchronization remain blocking, as do parameter/native/time/platform/retention/source/fixture/procedure/execution gates. Existing request identity/JWT/marker deletion/frontend revision or generic CSRF/Origin helper is not proof of compliant custody, enforced decision CSRF or synchronized invalidation. Accepted sections 9.2–9.28/physical fields unchanged; no Gate A/B/C or physical/browser-package/execution completion. No secret/cookie/envelope, source/DDL, browser/clock/database/runtime procedure or evidence created; all 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified.

### Custody/bootstrap compatibility and first-binding options prepared (Proposed only)

After the browser bounded-acceptance report, `zhennann` separately authorized only the offered finite feasibility/options preparation. [Concrete dossier sections 9.33–9.36](./wbs-mcp-20-04-as-contract-dossier.md#933-custody-compatibility-feasibility-preparation-only), recorded on 2026-10-16 at `086811c5e5` with eight attributable carried credential/time/browser planning edits, not a clean checkout, separate custody compatibility, the literal same-C bootstrap cycle and missing demonstrated authoritative first-only binding/current-session continuity. ADR 0009/SRS-MCP-AUTH-04 record Proposed analysis, not accepted amendments. Four categories cover strict-custody bounded investigation, explicit custody exception, bootstrap disclosure/proof amendment, and existing-owner first-binding assessment or explicit authority/lifecycle amendment. At preparation none was selected or independently accepted; no compliant mechanism or universal impossibility is claimed. Accepted sections 9.2–9.32 remain unchanged, and cross-worker effect/commit/release invalidation stays a separate blocking gate. No Gate A/B/C or physical/browser-package/execution completion follows. No session/store/field, cookie/key/envelope, source/DDL, platform qualification, executable fixture/procedure or evidence is created. All 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified. **Later explicit independent disposition (2026-10-16):** after agreement to undertake disposition, `zhennann` selected preserve constraints and advance finite design, recorded at the same dirty revision with eight attributable carried planning edits including compatibility-options preparation. Recognize the analysis, preserve strict custody, defer the recoverable-custody exception direction and authorize next bounded bootstrap sequence/proof candidate preparation plus existing identity-owner first-binding assessment only. Neither bootstrap branch nor new authority/state/session mechanism is selected; no contract amendment is accepted. Option-level deferral changes no WBS status. This increment records the choice and does not perform the successor; agreement/static checks were not the choice. Further preparation, explicit amendment, implementation, procedure and runtime proof remain separate gates.

### Bootstrap candidates and existing identity-owner capability assessment prepared (Proposed only)

The authorized finite successor to section 9.36's explicit limited disposition is prepared in [sections 9.37–9.40](./wbs-mcp-20-04-as-contract-dossier.md#937-bootstrap-candidate-preparation-boundary-proposed-only) on 2026-10-16 at `086811c5e5` with eight attributable carried credential/time/browser and compatibility-options/disposition planning edits, not a clean checkout. ADR 0009/SRS-MCP-AUTH-04 record Proposed candidates/assessment only: protected pre-bridge existing-C disclosure/admission exception versus independent bootstrap-proof/admission substitution leaving C bridge-gated, neither selected/accepted. Both require a noncircular issuance trust root and authoritative first binding/current session/synchronization; bounded existing-owner source checks do not qualify the complete capability. No authority/state/session extension, helper token, site/route, proof wire, cookie/key/envelope, TTL/platform or amendment is selected. Preserve strict custody and the deferred recoverable-custody exception direction. Accepted sections 9.2–9.32 and all physical/state/owner/fresh-only keep-v1/topology and procedure/execution gates remain; no Gate A/B/C or physical/browser-package/execution completion. All 11 observations Unconfirmed, no installation qualifies, AS/RS blocked, ATP prospective and 0/12 verified. No source/DDL, fixture/procedure/runtime/evidence or commit follows. Independent candidate/assessment disposition is the next suggested single action only; it is not performed or authorized here.

### Gate A — accountable ownership and route selection

1. **Recorded:** `zhennann` owns AS implementation and operations; the integrated `a-auth` logical route is selected. A route change requires a new decision.
2. **Still open:** record the exact endpoint, issuer, discovery, client-registration, and token-state service ownership without writing live values or credentials into planning records.
3. **Still open:** define incident response, retention, key/secret custody, worker count/connection policy within the selected topology, and outage escalation. Naming a responsible person does not settle these operational policies.

### Gate B — persistence and state authority

[ADR 0009](./decisions/0009-mcp-as-state-boundary.md) now records a **bounded design-only** selection: one AS-owned database-backed authority for authorization request/code/grant linkage and MCP opaque-token active/revocation state, with code consumption and token activation in one atomic commit. No explicit multi-statement transaction is required by default; a single authoritative aggregate/conditional mutation is only a candidate until proven on the deployed dialect, while multiple writes require an appropriate atomic transaction or a new authority decision. The initial `cabloy-mcp` scaffold remains schema-free; no MCP resource-module store or remembered consent is approved. This disposition is **not** approval to create an `a-auth` table, a Redis namespace, an external state service or a grant/consent record. Redis-only and SQL/Redis split authority are not selected.

The original bounded state invariants were database-product-neutral, not a PostgreSQL-primary recommendation or a claim of dialect portability. The first implementation now targets SQLite via `better-sqlite3` on Vona's existing primary datasource; confirm that the actual deployment matches this target, resolve worker count, storage and connection policy within the selected same-host multi-worker shared-persistent-SQLite topology, and verify SQLite affected-row/conditional-write semantics, creation-time uniqueness, cache bypass, current lookup, contention, atomic code-consumption/token-activation outcome and approved fresh/version-1 creation, already-v1 non-upgrade/treatment and partial-recovery behavior before execution. Repository support for PostgreSQL/MySQL drivers does not select or certify their AS behavior; ordinary cached model `update()` and `getForUpdate()` alone are not compare-and-set or uniqueness proof. Retain the accepted owner/service responsibilities and logical lifecycle above; separately approve exact source targets/dependencies, client registry representation, schema, TTL and deletion, digest/custody, concrete approval and redemption/revocation mechanics, multi-worker consistency, outage recovery, and migration boundary. The [state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) supplies the design basis and unresolved details, **not** a schema or service selection. For existing-`a-auth` persistence, apply the recorded conditional keep-v1 fold strategy within the accepted fresh-only scope, after actual eligibility confirmation and separate exact schema, implementation and recovery approval. Already-recorded v1 databases do not upgrade automatically; a different owning-module premise requires its own version disposition. Run the required root `npm run test` after an approved `meta.version.ts` change. Switching to an external Redis or another shared-store direction requires a new authority decision and its own namespace, lifetime and operational approval.

### Gate C — authorization interaction and protocol profile

Approve the exact first-profile behavior:

- pre-registered public and confidential clients only;
- Authorization Code grant with PKCE `S256`;
- exact redirect URI validation;
- approved confidential-client authentication;
- explicit resource-owner login and grant/deny interaction;
- one-time code redemption with AS-owned pending-state, client, authorization-time redirect, resource, scope, subject, and instance binding; code consumption and token activation must share one atomic commit, without presuming an explicit multi-statement transaction; OAuth client `state` remains authorization-response correlation, not a token-request credential;
- truthful RFC 8414 or selected discovery metadata;
- no Dynamic Client Registration and no required Client ID Metadata Documents in the first profile, with compatibility limits documented;
- no Client Credentials, implicit, or password fallback; and
- no refresh-token issuance in the accepted first profile.

The integrated AS retains authenticated grant/deny, code issuance, token activation and final redirect authority; Zova presents only a narrow approve/deny interaction for each authorization request. This supersedes the earlier backend HTML choice. The browser package's bounded direction accepts evaluating Basic Web, an AS-verifiable short-lived HttpOnly bridge, fixed internal continuation, request-bound CSRF, synchronous per-path early admission and an AS-built final redirect, but does not select a final Web/Admin/new site, role policy, flavor, route, layout, SSR/hydration mode, session lifecycle or admission implementation. Zova's client-managed cookie does not itself verify identity to the AS, and the existing disabled CSRF assertion does not protect a decision API. Before approving **concrete implementation**, define protected AS summary/decision APIs, the intended authorizing population and site admission, server-verifiable identity/session or the bounded bridge contract, request-bound CSRF, privacy-safe SSR/hydration, response and clickjacking protections, and AS-owned continuation/final redirect and terminal-state behavior. Distinguish client OAuth `state`, AS transaction/browser correlation, upstream provider-login state (if reused), decision CSRF and the PKCE challenge/verifier. An existing login session may establish identity but cannot substitute for the required new grant decision. Specify invalid-redirect, denial/cancellation, concurrent approval and redemption, account-switch and lost-response behavior without treating client `state` as a token-endpoint credential; the authorization-time redirect remains code-bound. OAuth 2.1 draft-13 §10.2 removes the token-request `redirect_uri`, while any separately supported OAuth 2.0 compatibility branch must require its identical value when the authorization request supplied it (RFC 6749 §4.1.3). Select and verify the branch before execution rather than describing it as an optional comparison. Design AS request-to-instance admission before Vona instance initialization for authorization, continuation, decision, token and discovery routes separately from ADR 0004's proposed early `/mcp` hook; route guards run too late to undo initial instance selection. Exact registered client redirect matching must not be conflated with the existing provider continuation/origin check. The existing development mock form is not a production control. The [state and interaction review](./wbs-mcp-20-04-state-interaction-review.md) is a selected design basis with unapproved concrete mechanics. Remembered consent, alternative grants, metadata-document compatibility and refresh profiles require new authority decisions; the selected Zova interaction still requires separate UI/site scope approval before source work.

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
3. Implement an AS-owned pending authorization state and protected summary/decision contract with state correlation, exact redirect validation, PKCE `S256`, one-time code redemption, canonical resource/scope/client/subject/instance binding, explicit grant/denial handling, and AS-owned final redirect; scope the selected Zova presentation separately after site/admission/SSR approval.
4. Implement current MCP opaque-token issuance and authoritative lookup/revocation state under the approved persistence disposition; prove code consumption and token activation in one atomic commit, whether a proven single conditional mutation suffices or the selected representation requires a transaction.
5. Keep `/mcp` resource validation outside the AS change; provide the contract and redacted lookup fixtures required by the resource-server successor.
6. Add focused unit/integration tests for the AS-owned behavior and run only approved commands. If schema changes, apply the approved file-version strategy and required root test.

### Separately operated AS route (not selected)

A future route change needs a new decision and revised dossier. It would still require inspected metadata, client/PKCE/resource/lookup/revocation and no-refresh behavior, approved resource registration and operation, and equivalent redacted AS-owned proof. This paragraph authorizes no external provider operation or configuration.

## Verification and evidence plan (prospective)

### `ATP-MCP-AUTH-03` required coverage

After execution approval and actual implementation/configuration, verify with synthetic labels and redacted artifacts:

1. metadata/discovery advertises only supported endpoints, grants, PKCE, registration compatibility, and no-refresh behavior;
2. public and confidential pre-registered clients obey exact redirect and authentication rules;
3. resource-owner authentication and Zova-presented explicit per-request grant/deny/cancel interaction use protected AS summary/decision APIs, server-verifiable identity, request-bound CSRF, reviewed site admission and privacy-safe SSR/hydration; the AS retains issuance and redirect authority;
4. authorization code state, client, redirect, PKCE, resource, scope, subject, and instance substitution/replay fail closed; competing redemptions prove one atomic code-consumption/token-activation commit and at most one active token, including a committed-but-lost response;
5. issued tokens are MCP-specific opaque values with current active state bound to the approved grant/resource/client/subject/instance/scope;
6. wrong-resource, wrong-client, revoked, expired, ambiguous, unavailable, or stale token state cannot become resource-server-valid;
7. mandatory same-host separate worker-process tests prove shared persistent SQLite approval/redemption contention, exactly-one committed winner, connection/contention/outage/unknown-commit behavior and fresh lookup begun after another worker acknowledges revocation; separate Vona contexts in one process alone are insufficient. Verify approved keep-v1 creation, already-v1 non-upgrade/treatment and partial recovery without claiming an unapproved upgrade path;
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
- treating ADR 0009's selected database-backed atomic-commit/Zova presentation **directions** as a physical database, schema, site/flavor/route/SSR/admission/identity/CSRF, remembered-consent, or execution approval;
- creating relational schema, Redis token contracts, durable consent, or external shared state;
- editing `meta.version.ts` or choosing `vonaModule.fileVersion` without explicit approval;
- implementing `cabloy-mcp` resource-server validation, transport, host binding, catalog, dispatch, or operations;
- creating the selected narrow Zova authorization UI, choosing a site/flavor, or adding a general management UI without separate scope and review;
- configuring an issuer, provider, client secret, redirect URI, live host, endpoint, webhook, or credentials;
- running OAuth/HTTP ATPs or live provider operations;
- running `npm run init`, resetting/recreating a database, reinstalling dependencies as a first response, cleaning/resetting/stashing/checking out the worktree, broad generation, committing, or pushing.

## Quality gates and current disposition

- **Authority audit:** planning structure is checked separately; static audit is not AS approval or runtime evidence.
- **Chart model/freshness:** charts are derived only; they do not prove source, token state, or ATP behavior.
- **Human approval:** route, responsible owner, the bounded physical state direction, and the bounded browser-presentation direction are recorded under `DEC-MCP-09`; the 2026-10-14 dispositions accept only these directions, not implementation. This dossier still requires separate approval after actual SQLite/`better-sqlite3` primary-datasource deployment confirmation and physical schema/uniqueness/migration proof, Zova site/role admission/route/SSR, synchronous ingress, identity/session/CSRF and operational gates close. Approval of these directions does not authorize provider/deployment operations, physical schema or source.
- **Current WBS status:** `WBS-MCP-20-04` remains `blocked`.
- **Current evidence:** none for `ATP-MCP-AUTH-03`; no AS source or runtime proof exists.

## Handoff and next single action

```text
WBS / phase: WBS-MCP-20-04 / Phase 20
Status: blocked; planning-only execution dossier draft, not implementation-complete or verified
Revision and worktree: initial draft 1e7c10ce84; clean reviews 2dda23660f and 9cca451dff; credential preparation at dirty b0ff7ceab0 with eight carried planning edits; later four-row bounded acceptance against clean 086811c5e5 before attributable planning edits; time/deadline/TTL preparation and later independent four-row bounded acceptance at the same revision with eight carried planning edits from credential acceptance and time-candidate preparation, not a clean checkout; subsequent separately authorized browser decision-binding/CSRF custody/invalidation candidate preparation at that revision with eight attributable carried planning edits, initially Proposed; later independent all-four bounded design acceptance on 2026-10-16 after explicit selection by zhennann at the same revision with eight attributable carried planning edits, not a clean checkout; subsequently separately authorized sections 9.33–9.36 custody/bootstrap compatibility and first-binding options preparation at the same dirty revision with eight attributable carried credential/time/browser planning edits, initially Proposed only; later explicit limited disposition on 2026-10-16 at the same dirty revision with eight attributable carried planning edits including compatibility-options preparation recognizes analysis, preserves strict custody, defers the custody-exception direction and authorizes finite further preparation only, without accepting amendments; subsequent separately authorized sections 9.37–9.40 bootstrap candidates and bounded identity-owner capability assessment prepared at the same dirty revision with those eight attributable carried planning edits, Proposed only without branch/amendment/mechanism acceptance
Scope and exclusions: one integrated a-auth AS/token-service contract only; no resource-server, transport, host binding, deployment, provider operation, schema, or runtime execution
Authority and ownership: PRD/SRS/WBS/ATP above; ADR 0003 accepted for bounded design only; ADR 0009 selects database-backed atomic-commit authority, the bounded physical state direction and the bounded Zova browser-flow direction; both 2026-10-14 dispositions are accepted without concrete implementation; zhennann owns AS implementation and operations
Completed gates/evidence: edition/repository discovery, authority/dependency review, source feasibility review, route/owner and logical state/browser-flow design decisions, bounded browser and physical-package dispositions, independent section 9.28 four-row bounded time/deadline/TTL/effect-read-release/prospective-proof acceptance with all platform/parameter/continuity/dependency/ambiguity limits, later independent section 9.32 four-row bounded browser verifier/custody-admission/invalidation-synchronization/prospective-proof acceptance with every custody/bootstrap/first-binding/current-session/cross-worker synchronization/platform/parameter/dependency/ambiguity restriction, and dossier reconciliation; no physical/browser-package/execution completion or AS execution/ATP evidence
Commands/procedures actually run: repository discovery and read-only planning inspection, documentary edits and static planning checks; none are ATP proof
Commands/procedures still required: confirm the SQLite/`better-sqlite3` existing-primary-datasource target against deployment; retain section 9.20's bounded storage/transition/creation-adapter requirements and approve remaining exact source/emitted DDL/native APIs/retention/no-reuse/synchronization/consistency, then prove atomic code-consumption/token-activation plus SQLite transition/migration behavior; concretize Basic Web site/role admission, route/flavor/SSR, synchronous ingress, bridge/session/CSRF/decision APIs and operational policy; confirm actual eligibility and approve migration implementation under the accepted fresh-only conditional existing-a-auth keep-v1 scope; obtain another version disposition only if the owning-module premise changes; obtain separate execution approval; then observe source/dependency layout and run approved narrow checks
Blocker or decision needed: actual SQLite primary-datasource deployment confirmation, physical AS schema/source integration and creation-uniqueness proof, exact TTL/error/freshness/hold budgets and native actual-effect/read/release time integration, fleet/restart/host continuity qualification, retention/worker consistency/outage, concrete Web/role/route/SSR contract, AS-route instance admission, bridge/session/CSRF lifecycle, issuer/resource/client registration, applicable migration strategy, separate execution approval
Next single action (suggested independent planning disposition; not performed or authorized here): independently review the section 9.37–9.40 two Proposed bootstrap candidates and bounded identity-owner capability assessment. Distinguish analysis acceptance, further-design authorization and explicitly requested amendment direction from exact amendment acceptance and implementation. Protected issuance trust root, first-only binding/current-session continuity and cross-worker synchronization remain blocking; source reading establishes no complete qualifying capability. Preserve strict custody; the recoverable-custody exception direction is deferred. Neither bootstrap branch nor any new authority/state/session mechanism is selected or accepted; no contract amendment is approved. Preserve accepted sections 9.2–9.32 and every custody/bootstrap/first-binding/current-session/cross-worker synchronization/platform/parameter/continuity/dependency/ambiguity/browser/policy/retention limit. No custody exception, bridge/key/cookie/current-session/first-binding/synchronization implementation, TTL numbers, clock/native/platform/continuity qualification, deployment qualification, operational recovery, source/DDL or procedures/results are approved. Actual eligibility/attestation, exact schema/check/source/connection/fleet/protocol/browser contracts, safe procedures and execution remain separately gated; no source, configuration, clock/deployment/provider or OAuth/HTTP operation is authorized
```

This dossier is a bounded planning handoff only. It does not authorize execution automatically, and it does not change the status of any ADR, WBS, ATP, provider, endpoint, schema, or runtime environment.
