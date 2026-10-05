# ADR 0003: Proposed MCP OAuth Resource-Server Boundary

## Status

Proposed — design draft only. This record does not accept `DEC-MCP-03`, select or configure an issuer, add OAuth/JWKS dependencies, create a provider, create an endpoint, or provide runtime/ATP evidence. The accountable decision owner is `zhennann`.

This proposal defines the OAuth boundary for the remote MCP endpoint described by [ADR 0002](./0002-mcp-transport.md). It keeps transport wire behavior in DEC-MCP-02 and trusted host/domain-to-instance binding in DEC-MCP-04.

## Current-source findings

The inspected Cabloy Basic source does not provide an MCP OAuth resource server or authorization server:

- `vona/src/suite-vendor/a-auth/modules/auth-oauth/src/bean/authProvider.oauth.ts` registers OAuth **login/provider** strategies (the observed default is GitHub) and supports authorization-code login flows; it is not an MCP protected-resource metadata publisher or bearer-token resource validator.
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtClient.ts` verifies Cabloy JWTs using the configured application signing secret/keys and `issuer: APP_NAME`; this is an application JWT mechanism, not evidence of an external OAuth issuer, JWKS rotation contract, resource indicator/audience, or MCP scope vocabulary.
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtExtract.ts` checks a configured query token before the Authorization header. MCP must not reuse that broad extraction path: protected calls accept only an HTTP `Authorization: Bearer` credential, never query, cookie, or an unrelated custom token header.
- `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts` deserializes local Cabloy passport data and may verify a local JWT plus a stateful auth-token adapter. It is the local identity/Passport boundary after a separately validated MCP token, not a replacement for MCP resource-server validation.

These observations are source facts with limits, not implementation authorization.

## Proposed decision

### Ownership and deployment model

Use an approved external or separately operated OAuth 2.0 authorization server as the issuer and client-consent owner. The planned `cabloy-mcp` module is an OAuth **protected resource/resource server** only. It does not implement an authorization UI, login provider, authorization-code exchange, dynamic client registration, consent persistence, token minting, or a second user store in the first increment.

The authorization server must publish standards-compatible authorization-server metadata and an approved registration/consent path outside this module. The MCP protected-resource metadata advertises that issuer without exposing client secrets, private keys, internal topology, or local Passport details. The exact issuer and operational owner remain deployment configuration, not a hard-coded public default.

The existing Cabloy `auth-oauth` module may remain responsible for ordinary Cabloy login providers. It is not reused as the MCP authorization server unless a later review proves that its contracts cover protected-resource metadata, resource indicators, access-token issuance, scopes, client registration, and key lifecycle. It must not silently mint or accept MCP tokens merely because it can exchange an OAuth login code for a Cabloy JWT.

### Token format and validation

For the first increment, propose **signed JWT access tokens validated locally with issuer JWKS**. Do not select opaque-token introspection for the first increment; a future introspection deployment requires a separate design because it changes availability, timeout, caching, revocation, and privacy behavior. Do not accept Cabloy application JWTs as MCP access tokens solely because they are signed by the same application key.

For each protected MCP request, the resource-server boundary must:

1. require exactly one `Authorization` header using the `Bearer` scheme; reject query, cookie, `x-vona-passport-code`, and other token locations;
2. obtain signing keys only from the configured issuer's approved JWKS metadata, with issuer/host allowlisting and bounded refresh/cache behavior;
3. validate signature and an explicit allowed algorithm, `iss`, `exp`, `nbf` when present, and any required token-type/profile constraints; reject algorithm confusion, missing time claims, malformed tokens, and key/issuer mismatch;
4. require the `aud` or RFC-compliant resource indicator to identify the canonical MCP protected resource, using an exact canonical comparison rather than accepting a generic application audience or a caller-selected URL;
5. require a nonempty stable `sub`, validate the approved scope claim format, and apply the required scope for the requested MCP operation. Scope is an upper bound, never a replacement for local RBAC or data scope;
6. reject tokens with a wrong issuer/resource, expired or not-yet-valid lifetime, missing subject, unknown key, insufficient scope, or invalid claims before `server/discover`-protected tool policy, `tools/list`, or `tools/call` reaches a business controller;
7. fail closed on JWKS outage, malformed key material, issuer metadata mismatch, clock uncertainty beyond the configured bound, or ambiguous validation. Key rotation may use a bounded cached previous key only while its validity and issuer policy remain satisfied; it must not turn an issuer outage into indefinite acceptance.

The exact JWT library, JWKS client, algorithm allowlist, clock skew, cache TTL, token lifetime, and error/status mapping are `TODO(confirm)` until DEC-MCP-03 is accepted and an execution dossier verifies the selected implementation.

### Protected-resource metadata and discovery

Publish RFC 9728 protected-resource metadata for the canonical MCP resource URL and identify the approved authorization-server metadata URL(s). Because the proposed MCP endpoint is `/mcp`, use the RFC path-aware protected-resource metadata location for that resource (proposed `/.well-known/oauth-protected-resource/mcp`) and verify whether the deployment must additionally serve the origin-wide well-known form. Do not publish conflicting documents or derive issuer/resource values from an untrusted request Host.

The metadata response is a direct standards JSON response, not Vona's `{ code: 0, data }` application envelope. It contains only approved public resource/discovery information, supported scopes/authorization details as applicable, and no secrets, access tokens, private keys, subject mappings, internal instance names, or tool catalog. Cache headers and host/instance variation are owned jointly by this decision and DEC-MCP-04; a cached metadata document must never advertise one instance's resource for another host.

A protected MCP request without a valid token may return an RFC-compatible `401` and `WWW-Authenticate` challenge that points to the protected-resource metadata. The challenge and metadata must not echo raw credentials or user-controlled issuer/resource URLs. The exact error fields, scope challenge, and status mapping must be checked against the accepted MCP authorization revision and selected SDK.

### Subject mapping to local Passport

After external token validation and trusted endpoint-instance binding, map the token's stable `sub` (and, only where explicitly approved, an issuer/client namespace) to exactly one active local identity in the bound Vona instance. The mapping is a server-owned configuration/service boundary and must not be selected by tool arguments or a client-provided local user ID.

The first increment proposes a deterministic mapping adapter keyed by `(issuer, sub)` and bound to the instance established by DEC-MCP-04. No match, multiple matches, disabled account, inactive account, wrong instance, or mapping-store outage fails closed. The adapter then constructs a fresh request-owned local Passport projection for normal controller guards and data-scope/RBAC evaluation. It must not reuse a Passport from the parent HTTP context or treat OAuth claims/roles as local roles without an explicit server-side mapping.

A token's `scope`, `roles`, `groups`, `tenant`, or profile claims cannot directly grant local roles, system-admin status, ownership, or unrestricted instance access. Local account activation, disabled-account checks, role guards, resource ownership, and row/data scope remain authoritative. A subject may be valid at the OAuth layer and still see no tools or receive a local authorization denial.

### Client registration, scopes, and revocation

The external authorization server owns client registration, redirect URIs, PKCE, consent, grant, and token revocation. The first increment does not provide dynamic client registration or a Cabloy consent UI. The operator must provision the MCP client and permitted resource/scope grant through the approved authorization-server process.

Use narrow, deployment-defined scopes that name MCP capabilities or policy classes rather than broad `admin` or raw Cabloy role names. The exact vocabulary and per-tool requirements remain `TODO(confirm)` under DEC-MCP-06. Every request checks the token's scope and current deployment policy; a previously issued token does not survive endpoint disablement or tool-policy removal.

Locally validated JWTs cannot provide immediate revocation by themselves. The deployment must choose one of: short access-token lifetime with issuer key/grant revocation controls, an approved revocation/introspection mechanism, or an explicit release constraint that prevents high-risk tools from using non-revocable tokens. The first increment's conservative proposal is short-lived tokens and no destructive/unclassified tools; this is a policy proposal, not an accepted revocation guarantee.

### Failure and privacy policy

- Missing or malformed bearer credentials: bounded `401` with a safe challenge where appropriate.
- Validly signed but wrong issuer/resource, expired/not-yet-valid, unknown subject, insufficient scope, disabled mapping, or instance mismatch: bounded authorization failure; do not disclose unrelated subject/resource existence.
- Issuer metadata/JWKS/key-rotation outage or ambiguous subject mapping: fail closed and emit only a protected, redacted operator event.
- No raw Authorization value, JWT, claims, JWKS response, client secret, refresh token, cookie, or complete subject profile may enter logs, traces, metrics, audit, or retained evidence.
- OAuth validation never expands authority beyond the intersection of endpoint enablement, DEC-MCP-04 instance binding, deployment tool policy, local Passport/RBAC, data scope, resource ownership, and DEC-MCP-06 risk policy.

## Boundaries with adjacent decisions

- **DEC-MCP-02:** owns the 2026-07-28 transport method, protocol metadata, wire errors, and request/response handling. This decision supplies auth challenge and protected-resource inputs but does not alter the wire profile.
- **DEC-MCP-04:** owns trusted Host/forwarded-host processing, canonical host-to-instance mapping, selector conflicts, and token-instance consistency. This decision only requires the token resource/instance relationship to be checked after that binding is established.
- **DEC-MCP-06:** owns scope vocabulary, per-tool policy, confirmation, side-effect classification, and result/data minimization. This decision does not make a broad scope sufficient for a call.
- **DEC-MCP-07:** owns fresh context/Passport construction and executor adaptation. This decision requires a fresh local subject projection but does not select its implementation.
- **DEC-MCP-08:** owns validation telemetry, redaction, retention, rate/timeout limits, and operational ownership. This decision supplies only the OAuth-specific events that must be classified safely.

## Alternatives rejected or deferred

- **Reuse Cabloy `auth-oauth` as the MCP authorization server:** rejected as an assumption; current source demonstrates login/provider integration, not the complete MCP authorization-server/resource-indicator contract.
- **Accept Cabloy local JWTs as external MCP bearer tokens:** rejected because local signing/Passport payloads do not establish an MCP resource audience, external issuer, client grant, or scope contract.
- **Use generic Vona JWT extraction:** rejected because the current extractor checks query before Authorization; MCP accepts only the protected-resource Bearer header.
- **Map OAuth claims directly to local roles or tenant/instance:** rejected because external claims are not local authority or data scope.
- **Opaque introspection in the first increment:** deferred pending a separate latency, outage, caching, revocation, and privacy design.
- **Build an MCP authorization UI/client registry in Cabloy:** deferred; external authorization-server ownership and no new MCP persistence remain the first-increment boundary.

## Acceptance and execution gates

Before accepting `DEC-MCP-03`, verify:

1. the external issuer/resource-server owner, canonical resource identifier, authorization-server metadata URL, client-registration process, scope vocabulary, and operational escalation owner;
2. JWT/JWKS versus introspection choice, algorithm/claim requirements, key rotation, clock skew, cache/outage behavior, and exact MCP `401`/`403`/challenge mapping;
3. path-aware protected-resource metadata route(s), host/instance variation and cache policy, direct unwrapped JSON output, and no secret/topology disclosure;
4. deterministic `(issuer, sub, instance)` local mapping, disabled/ambiguous/outage behavior, and fresh Passport handoff to DEC-MCP-07;
5. synthetic tests for wrong issuer/resource, expired/not-yet-valid, signature/key rotation, missing scope, query-token rejection, unmapped/disabled subjects, and no-controller dispatch;
6. approved dependencies and configuration ownership in a bounded execution dossier. Do not add packages, provider configuration, secrets, or routes as part of this planning draft.

No item above is runtime evidence. Planning audits/charts and source inspection cannot accept this ADR or prove token validation.

## References

- [MCP authorization, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [OAuth 2.0 Protected Resource Metadata (RFC 9728)](https://www.rfc-editor.org/rfc/rfc9728)
- [OAuth 2.0 Authorization Server Metadata (RFC 8414)](https://www.rfc-editor.org/rfc/rfc8414)
- [OAuth 2.0 Security Best Current Practice (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700)
- [Vona Auth Guide](../../../repo-docs/backend/auth-guide.md)
- [Vona JWT extractor](../../../vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtExtract.ts)
- [Vona Passport bean](../../../vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts)
