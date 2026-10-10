# WBS-MCP-20-04 AS Design Review Dossier (Accepted Design Only)

## Dossier status

**Planning-only design disposition — not an execution dossier.** This record is the planning basis for the bounded `DEC-MCP-03` design accepted in ADR 0003 on 2026-10-09. It does not amend `DEC-MCP-09`, authorize source or schema changes, configure an issuer/provider, operate an authorization endpoint, run OAuth/HTTP tests, or advance any WBS/ATP status. Concrete implementation and persistence gates remain open.

Prepared against the Cabloy Basic worktree at revision `1e7c10ce84` on 2026-10-09. The worktree contains the uncommitted planning increment that introduced the AS work package and its resource-server dependency. No AS source, endpoint, provider configuration, usable credential, or ATP evidence was observed.

## Review target and authority

- **Suite:** `cabloy-mcp`
- **Target:** proposed `WBS-MCP-20-04 — Deliver an approved MCP authorization-server/token-service contract`
- **Primary authority:** [ADR 0003](./decisions/0003-mcp-oauth-resource-server.md), `DEC-MCP-03`, accepted for bounded design only
- **Overall boundary:** [ADR 0001](./decisions/0001-mcp-suite-boundaries.md), accepted for the overall first-increment boundary and no-schema/no-site MCP resource boundary only
- **Persistence gate:** `DEC-MCP-09`, accepted for the no-schema first increment; it does not authorize auth-owned grant, consent, or token persistence
- **Technical contracts:** `SRS-MCP-AUTH-04`, `SRS-MCP-AUTH-01`, `SRS-MCP-INSTANCE-01`
- **Acceptance scenario:** proposed `ATP-MCP-AUTH-03`; no result exists
- **Related boundary:** proposed [ADR 0004](./decisions/0004-mcp-host-instance-binding.md) must use the same endpoint → resource → instance interface, but its prior acceptance is not assumed

This dossier is a design review input. It is not a human decision record and does not convert any recommendation below into an accepted value.

## Observed source feasibility

The current source provides reusable authentication primitives but no complete MCP authorization server or opaque-token service:

| Observed path                                                                                   | Fact and limit                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vona/src/suite-vendor/a-auth/modules/auth-oauth/src/bean/authProvider.oauth.ts:33-54`          | Registers provider strategies and client credentials for OAuth login; it is not MCP authorization-server metadata, client registration, resource-indicator processing, or token issuance.                                                                       |
| `vona/src/suite-vendor/a-auth/modules/a-auth/src/controller/passport.ts:12-37`                  | Handles a login callback by verifying signed OAuth state and invoking the provider callback; it is a login callback, not a general authorization endpoint with MCP client/grant/PKCE policy.                                                                    |
| `vona/src/suite-vendor/a-auth/modules/a-auth/src/controller/mock.ts:10-43`                      | Provides a development-only mock authorization form and redirects a submitted username as a code. It is test scaffolding, not a production resource-owner consent or authorization-code implementation.                                                         |
| `vona/src/suite-vendor/a-auth/modules/a-auth/src/service/auth.ts:214-285`                       | Provider callback handling creates a local OAuth code from an OAuth login token and redirects after origin validation. The flow has no observed MCP resource binding, client registration, PKCE verifier validation, consent record, or token-family lifecycle. |
| `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts:161-235`                 | Existing access/refresh handling verifies Cabloy JWTs, extends the configured session-backed token state, and creates another JWT. It does not consume a previous refresh token as a one-time family member or implement MCP grant/resource binding.            |
| `vona/src/suite-vendor/a-vona/modules/a-user/src/service/redisToken.ts:8-67`                    | Stores and verifies an instance-scoped session marker keyed from local identity/auth data. It is not an opaque token-hash → grant lookup, consent ledger, revocation family, or MCP resource registry.                                                          |
| `vona/src/suite-vendor/a-auth/modules/a-auth/package.json:35-66` and `src/bean/meta.version.ts` | `a-auth` has an existing `fileVersion` and provider/auth-association persistence. No MCP client, grant, consent, access-token, or refresh-family store is established by those records.                                                                         |

The existing source therefore supports evaluating an integrated `a-auth` extension as an ownership location, but does not make that extension an available AS or justify widening existing login/JWT endpoints.

## Proposed design disposition for separate review

The following records the bounded design disposition accepted under `DEC-MCP-03`. Concrete values and implementation details remain separately gated; this record does not authorize execution.

### 1. Logical and operational ownership

- Keep the preferred **logical AS owner** as an extension of Vona `a-auth`, sharing the existing local identity owner but using a separate MCP authorization-server capability and contracts.
- Keep `cabloy-mcp` as a distinct **resource-server** boundary. It receives only access tokens at `/mcp`; it does not host authorization, consent, refresh, client registration, or token/grant persistence as a shortcut.
- Require a separately named **operational owner** for issuer metadata, redirect/client registration, authorization interaction, token-state availability, revocation, key/secret custody, incident response, and retention. `zhennann` is the planning decision owner, not by that fact an AS operator.
- Retain a separately operated conforming AS as an alternative. It can replace the integrated candidate only after equivalent ownership, resource registration, current token lookup, interaction, and redacted proof are observed.

### 2. Supported client and grant profile

The bounded first profile should support only clients whose registration and redirect policy can be reviewed before activation:

| Client profile                                 | Proposed support                                                      | Required controls                                                                                                      |
| ---------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Public MCP client                              | Pre-registered only                                                   | Authorization Code, PKCE `S256`, exact redirect URI, explicit resource and scope grant, no client secret as proof      |
| Confidential MCP client                        | Pre-registered only                                                   | Authorization Code, PKCE `S256`, exact redirect URI, approved client authentication, explicit resource and scope grant |
| Dynamic Client Registration                    | Not in first profile                                                  | Add only through a later authority change with abuse, redirect, metadata, and lifecycle controls                       |
| Client ID Metadata Documents                   | Not required in first profile; compatibility limit must be documented | Add only after URL-fetch/metadata trust, SSRF, availability, and client-compatibility review                           |
| Client Credentials or implicit/password grants | Not supported                                                         | No user-delegated MCP authority or legacy grant fallback                                                               |

The authorization server must advertise only this actual matrix. Pre-registration is a deliberate compatibility constraint, not evidence that a general MCP client ecosystem is supported. The profile does not advertise unsupported registration methods, grants, scopes, or refresh capability.

### 3. Authorization and resource-owner interaction

Use Authorization Code + PKCE with a server-owned authorization endpoint. The resource owner must authenticate through an approved Cabloy identity path and make an explicit grant decision for the requesting client, canonical resource, and narrow requested scopes. The AS owns:

- state and request correlation, exact redirect validation, PKCE `S256` verification, and one-time authorization-code redemption;
- the reviewed login/session handoff and grant/consent interaction, including safe denial and cancellation behavior;
- client, user, resource, instance, and scope binding at authorization and token exchange;
- a clear policy for whether prior consent is remembered. The proposed first profile remembers no durable consent and requires an explicit grant interaction for each authorization request; any remembered consent is a separate persistence decision;
- safe redaction of codes, callback state, cookies, client credentials, and private user data from logs and evidence.

An integrated AS may reuse an existing Cabloy login/session experience, but the existing `auth-oauth` provider callback and the development-only mock form are not the AS interaction. Reuse must preserve a distinct MCP authorization transaction and must not turn the resource-server increment into a browser or Zova-site requirement. A future AS-owned page or UI needs its own source, SSR/browser, and privacy review if the selected interaction requires it.

### 4. Access-token and grant profile

The proposed first profile remains **MCP-specific opaque access tokens** with current server-owned lookup:

- the token record binds issuer, registered client, authorization transaction/grant, subject, canonical resource, bound instance relation, granted scope, issued time, expiry, and active/revoked state;
- the token value is high-entropy and is stored only as a protected digest or equivalent non-recoverable representation where the selected store permits; raw values are returned only at the token endpoint and never retained in evidence;
- the resource server performs a current lookup/introspection decision and denies on unavailable, stale, revoked, expired, malformed, wrong-resource, ambiguous, or otherwise uncertain state;
- revocation and endpoint/tool-policy changes must not be defeated by a cached Passport/JWT/session marker;
- `/mcp` accepts only the access-token Bearer credential. Authorization codes, refresh tokens, cookies, query tokens, local JWTs, and provider tokens are rejected.

This is a proposed contract, not a claim that the current Cabloy JWT or Redis session implementation meets it.

### 5. Explicit refresh disposition

**Accepted first-profile design choice: do not issue refresh tokens.** A client re-runs authorization after access-token expiry. This is a design choice only; it does not authorize implementation. Consequently:

- AS metadata and client registration do not advertise `refresh_token` or imply `offline_access` for the MCP resource;
- no refresh-family table, rotation endpoint, sender constraint, reuse detector, or refresh replay recovery is required for the first profile;
- `ATP-MCP-AUTH-01` retains only a negative resource-endpoint test proving that a refresh-shaped credential cannot reach `/mcp`;
- any later refresh profile must be a separate authority change and must specify public/confidential-client rules, grant/resource/scope preservation, atomic rotation or sender constraint, predecessor invalidation, family lineage, reuse response, concurrent/lost-response behavior, expiry, revocation, worker consistency, and outage behavior before source.

Choosing no refresh does **not** eliminate the access-token, authorization-code, grant, or revocation-state requirements.

### 6. Persistence and no-schema disposition

The required state is separated by purpose rather than hidden under `a-auth`:

| State                                       | First-profile need                          | Proposed owner/handling                                                                                                                            | Authority needed before implementation                                                         |
| ------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Client registration                         | Required                                    | AS owner; configuration or a reviewed registry, with pre-registration only                                                                         | Select representation, custody, rotation, and deployment ownership                             |
| Authorization request/code/PKCE transaction | Required and short-lived                    | AS owner; shared state with atomic one-time redemption and bounded TTL                                                                             | Approve storage namespace, availability, replay handling, and redaction                        |
| Grant/consented resource and scope          | Required for token binding                  | AS owner; no remembered consent is proposed, but the authorization transaction/grant relation must remain auditable/current for the token lifetime | Decide whether short-lived/shared state is sufficient or durable grant persistence is required |
| Opaque access-token active/revocation state | Required                                    | AS-owned authoritative lookup service shared by all workers; `cabloy-mcp` must not own a second store                                              | Select database or external shared store, hash/retention, revocation and outage semantics      |
| Refresh-token family                        | Not required in proposed no-refresh profile | None                                                                                                                                               | Reopen only if refresh is later selected                                                       |
| MCP-owned registry/consent/audit schema     | Not required and excluded                   | None                                                                                                                                               | Any exception requires a new decision; placement under `a-auth` does not bypass it             |

`DEC-MCP-09` remains controlling: this dossier preserves the accepted no-schema first-increment wording and does not authorize a new `a-auth` table, Redis contract, durable consent record, or migration. An external shared store is still persistence/authorization state even when it is not a relational schema. Before implementing the integrated AS, one of the following must receive a separately recorded authority disposition:

1. **Preserve no-schema:** defer the integrated AS and use no real MCP token issuance until an already conforming, separately operated AS is selected and its contract is approved; or
2. **Revise the first-increment boundary:** permit explicitly AS-owned shared authorization/token state, name its owner and retention, choose database versus external store, decide the owning `vonaModule.fileVersion` strategy before any schema edit, and run the required root test path if `meta.version.ts` changes.

Neither option is selected by this dossier. In particular, “put the tables in `a-auth`” is not a no-schema solution.

## Acceptance and proof required later

Before approving AS execution, the execution dossier and decision record must resolve:

1. accountable implementation and operations owner, issuer deployment and endpoint ownership;
2. supported public/confidential client matrix, pre-registration/metadata-document/DCR compatibility, exact redirect and client-authentication rules;
3. resource-owner login and explicit grant interaction, consent retention choice, cancellation/denial, state/PKCE/code replay behavior;
4. canonical resource and instance binding at authorization, token exchange, current lookup, revocation, and local subject mapping;
5. access-token store/lookup owner, representation, retention, multi-worker consistency, outage and fail-closed behavior;
6. the no-schema versus auth-owned persistence disposition and, if schema is allowed, the owning module `fileVersion` choice;
7. the proposed no-refresh profile, or a separately accepted replay-safe refresh profile;
8. `ATP-MCP-AUTH-03` redacted proof for truthful metadata, supported-client behavior, user/grant interaction, code/PKCE, substitution/replay denial, current token lookup, revocation, outage, and the selected refresh branch.

No raw authorization code, access/refresh token, cookie, signed state, client secret, private key, full claim set, or private user profile may be retained.

## Current blockers and permitted next action

- `DEC-MCP-03` is accepted for bounded design only; concrete implementation, configuration, persistence, and proof remain open.
- `DEC-MCP-09` remains accepted for no-schema first increment; no persistence exception is granted.
- `WBS-MCP-20-04` remains blocked and has no source or ATP evidence.
- `WBS-MCP-20-02` remains blocked on this AS contract and the transport/host gates; synthetic RS fixtures cannot close the AS dependency.
- No issuer, provider, endpoint, client, schema, grant, token, consent record, dependency, or credential may be configured from this dossier.

**Next single action:** review the separate [AS execution dossier (planning draft)](./wbs-mcp-20-04-execution-dossier.md) after resolving concrete implementation/storage authority and any required DEC-MCP-09 disposition. Do not execute source or OAuth/HTTP ATP work automatically.
