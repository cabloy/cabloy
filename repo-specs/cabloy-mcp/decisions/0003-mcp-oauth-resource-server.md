# ADR 0003: Proposed MCP OAuth Resource-Server Boundary

## Status

Proposed — design draft only. On 2026-10-08, the accountable decision owner `zhennann` approved a planning direction to evaluate a Cabloy-integrated authorization server, MCP-specific opaque access tokens, and optional refresh-token support; `DEC-MCP-03` as a whole remains unaccepted. The earlier deny-on-JWKS-refresh-failure sub-policy is retained only for a future JWT/JWKS alternative and is not the preferred opaque-token profile. This record does not select or configure a provider, create an endpoint, add OAuth dependencies, or provide runtime/ATP evidence.

This proposal defines the OAuth boundary for the remote MCP endpoint described by [ADR 0002](./0002-mcp-transport.md). It keeps transport wire behavior in DEC-MCP-02 and trusted host/domain-to-instance binding in DEC-MCP-04. DEC-MCP-03 and DEC-MCP-04 must agree on the shared resource/instance interface below, but neither draft's **acceptance** presupposes that the other has already been accepted. Their joint integration and real-HTTP proof remain separate execution gates.

## Current-source findings

The inspected Cabloy Basic source does not provide a complete MCP OAuth authorization-server/resource-server contract, but it does provide reusable authentication and token primitives:

- `vona/src/suite-vendor/a-auth/modules/auth-oauth/src/bean/authProvider.oauth.ts` registers OAuth **login/provider** strategies (the observed default is GitHub) and supports authorization-code login flows; it is not by itself an MCP protected-resource metadata publisher, authorization-code/token endpoint, or bearer-token resource validator.
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtClient.ts` provides Cabloy JWT signing/verification using application configuration and issuer settings. This is a reusable token primitive, not by itself an MCP access-token profile or resource/audience/scope contract.
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/bean/bean.jwt.ts` exposes access/refresh JWT creation and temporary access-token creation. These capabilities are reference points; ordinary tokens must not be accepted as MCP credentials without an explicit MCP profile.
- `vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtExtract.ts` checks a configured query token before the Authorization header. MCP must not reuse that broad extraction path: protected calls accept only an HTTP `Authorization: Bearer` credential, never query, cookie, or an unrelated custom token header.
- `vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts` owns local Passport serialization, auth-token refresh, and temporary-token helpers. It is the local identity/Passport boundary and a possible foundation for a separate MCP OAuth integration, not proof that the existing temporary-token or login flows already satisfy MCP authorization.
- `vona/src/suite/a-home/modules/home-user/src/controller/passport.ts` exposes the existing user-facing refresh and temporary-token endpoints. Their browser/application semantics must not be widened to MCP without a profile and audience/resource review.

These observations are source facts with limits, not implementation authorization.

## Proposed decision

### Ownership and deployment model

Prefer evaluating a **Cabloy-integrated OAuth authorization server**, built on the existing `a-auth` authentication capability and shared Vona identity ownership, while keeping the MCP protected resource/resource server as a separate logical boundary. The authorization server may be hosted with the resource server or separately, consistent with the selected MCP authorization model. It owns user interaction, authorization code + PKCE, client registration or Client ID Metadata Document compatibility, consent/grant state, access-token issuance, refresh-token issuance/rotation, and revocation. The future `cabloy-mcp` resource-server boundary owns protected-resource metadata, Bearer access-token validation, resource/scope checks, and local subject/instance mapping; it does not receive refresh tokens.

This is a proposed direction, not an accepted provider or endpoint configuration. The existing `a-auth` login/provider flow is a foundation to evaluate, not an automatic MCP authorization server. The exact issuer identifier, authorization-server owner, metadata endpoints, client registration path, grant storage, and operational owner remain `TODO(confirm)`. Metadata must not expose client secrets, private keys, internal topology, or local Passport details.

The MCP authorization server must satisfy the selected 2026-07-28 authorization contract, including validated issuer discovery, resource indicators, PKCE, and an approved client-registration path. MCP clients that want refresh tokens declare `refresh_token` in their registration `grant_types` when supported and may request `offline_access` only if the authorization-server metadata supports it; they must protect issued refresh tokens and must not assume one will be issued. `offline_access` is not a required MCP resource scope. Refresh tokens go only to the authorization-server token endpoint, never to `/mcp`. The exact supported client set and registration compatibility remain open until the `a-auth` extension is reviewed.

### Token format and validation

For the preferred first-increment profile, evaluate **short-lived opaque MCP access tokens** backed by a server-owned token/grant service, with optional refresh-token support for clients that request and securely store refresh tokens. This avoids making JWKS a required dependency while retaining OAuth resource binding and fail-closed validation. The opaque token profile is not the ordinary Cabloy temporary-token profile: it must carry or reference an explicit MCP profile and bind the client, canonical resource, subject, scope, bound instance, issued/expiry times, and revocation/grant state.

The existing `createTempAuthToken()` and `bean.jwt.create(...)` capabilities inform authentication and token-service design but sign JWTs; their signed output does not implement an opaque token. Reuse safe lower-level identity or lifecycle primitives only after semantic and storage review. If the temporary URL-bound or application-JWT semantics differ materially from an OAuth bearer access token, provide an MCP-specific authorization-server entry rather than widening the existing method. Exact operations, owners, and storage are `TODO(confirm)`; never accept an ordinary temporary token merely because it is valid or signed by Cabloy.

For each protected MCP request, the resource-server boundary must:

1. require exactly one `Authorization` header using the `Bearer` scheme; reject query, cookie, `x-vona-passport-code`, refresh-token, and other token locations;
2. look up or introspect only an MCP-profile access token through the approved server-owned token service, and fail closed when current authorization state cannot be confirmed; do not use stale lookup state to extend trust;
3. verify that the token is active, unexpired, not revoked, bound to the configured canonical MCP resource, associated with the approved client/grant, and carries a nonempty stable subject and the required scope;
4. verify the token's bound instance relation against the trusted DEC-MCP-04 endpoint binding. A client-supplied resource parameter is not proof of the token's resource, and no token claim may select an instance;
5. reject a wrong resource, inactive/revoked/expired token, missing subject, invalid profile, insufficient scope, ambiguous mapping, or token-service outage before protected `server/discover` policy, `tools/list`, or `tools/call` reaches a business controller;
6. map the stable authorization-server subject to exactly one active local identity in the bound instance and construct a fresh request-owned Passport projection; external scopes/roles never directly grant local RBAC or data scope;
7. keep refresh-token handling in the authorization-server token endpoint. Where a refresh token is issued, a refresh operation must preserve the original resource, client, subject, instance and grant boundaries, enforce rotation or other replay detection required by the selected OAuth profile, invalidate the prior token when rotated, and fail closed on reuse or ambiguous state.

The opaque-token profile, token-store representation and owner, hash-at-rest policy, lookup consistency, access/refresh lifetimes, rotation and family-reuse behavior, revocation, multi-worker availability, exact scope vocabulary, and HTTP status taxonomy remain `TODO(confirm)` until design and implementation review. No MCP-owned registry/consent/audit persistence is accepted under DEC-MCP-09; any new opaque-token/grant storage must be assigned to an approved auth owner and reviewed against that no-MCP-owned-persistence boundary, with the fileVersion choice obtained before schema changes. A future JWT/JWKS alternative remains possible but is not the preferred first-increment profile. Only if that alternative is explicitly selected, the previously approved deny-on-required-JWKS-refresh-failure sub-policy applies: a successfully fetched and currently valid key cache may be used before refresh is required, but failure of a required refresh denies the token even when a prior key remains cached; the failure cannot extend that key's trust. Its finite refresh bounds, algorithms, and implementation would need separate approval and proof. This key-cache policy must not be mixed into opaque-token behavior.

### Protected-resource metadata and discovery

Publish RFC 9728 protected-resource metadata containing the canonical MCP `resource` identifier and `authorization_servers` with at least one approved authorization-server **issuer identifier** (not a metadata-document URL). For a canonical resource of `https://example.com/mcp`, the path-specific well-known location is `https://example.com/.well-known/oauth-protected-resource/mcp`. Serving this path-specific document satisfies the proposed discovery route; the origin-wide well-known location is a client fallback, not an additional mandatory server route. If an origin-wide document is also offered, its `resource` must match the resource it represents and cannot conflict with the path-specific document. Do not derive issuer or resource values from an untrusted request Host.

The metadata response is a direct standards JSON response, not Vona's `{ code: 0, data }` application envelope. It contains only approved public resource/discovery information, supported scopes/authorization details as applicable, and no secrets, access tokens, private keys, subject mappings, internal instance names, or tool catalog. Cache headers and host/instance variation are owned jointly by this decision and DEC-MCP-04; a cached metadata document must never advertise one instance's resource for another host.

Missing/invalid/expired tokens receive HTTP `401`; insufficient scope or permission receives HTTP `403` at the HTTP authorization boundary, without publishing sensitive denial details. This proposal uses the well-known metadata URL for discovery; a `WWW-Authenticate` challenge with `resource_metadata` may also be used where appropriate, but the selected MCP revision requires a working well-known route **or** that challenge mechanism, not both. If a challenge is emitted, it must point to trusted protected-resource metadata rather than a caller-controlled URL. Scope hints are advisory, not a required disclosure; the exact fields and any protocol-level versus HTTP-level error handling must be verified against the selected SDK and revision.

### Subject mapping to local Passport

After MCP access-token validation and trusted endpoint-instance binding, map the token's stable `sub` (and, only where explicitly approved, an issuer/client namespace) to exactly one active local identity in the bound Vona instance. The mapping is a server-owned configuration/service boundary and must not be selected by tool arguments or a client-provided local user ID.

The first increment proposes a deterministic mapping adapter keyed by `(issuer, sub)` and bound to the instance established by DEC-MCP-04. No match, multiple matches, disabled account, inactive account, wrong instance, or mapping-store outage fails closed. The adapter then constructs a fresh request-owned local Passport projection for normal controller guards and data-scope/RBAC evaluation. It must not reuse a Passport from the parent HTTP context or treat OAuth claims/roles as local roles without an explicit server-side mapping.

A token's `scope`, `roles`, `groups`, `tenant`, or profile claims cannot directly grant local roles, system-admin status, ownership, or unrestricted instance access. Local account activation, disabled-account checks, role guards, resource ownership, and row/data scope remain authoritative. A subject may be valid at the OAuth layer and still see no tools or receive a local authorization denial.

### Client registration, scopes, and revocation

The Cabloy-integrated authorization-server candidate owns client registration, redirect URIs, PKCE, consent, grants, refresh-token issuance/rotation, and token revocation. A separately operated authorization server may own the same responsibilities if that alternative is explicitly selected. The first increment does not provide dynamic client registration or a Cabloy consent UI in the `cabloy-mcp` resource module. This proposal limits supported clients to those registered through the authorization server's approved process with the permitted resource/scope grant; it is a deployment/client-compatibility constraint, not a general MCP requirement. For design-only review, record the compatibility limit of requiring pre-registered clients rather than assuming Client ID Metadata Documents support. Before configuring/activating the selected authorization server, verify its actual registration and metadata capabilities or explicitly approve and record the impact on clients that require the recommended registration method. Dynamic Client Registration remains out of first-increment resource-module scope.

Use narrow, deployment-defined scopes that name MCP capabilities or policy classes rather than broad `admin` or raw Cabloy role names. The exact vocabulary and per-tool requirements remain `TODO(confirm)` under DEC-MCP-06. Every request checks the token's scope and current deployment policy; a previously issued token does not survive endpoint disablement or tool-policy removal.

Opaque tokens can support revocation through the server-owned token/grant state, but only when lookup is current and available. The selected authorization-server/token-service design must define revocation, lookup consistency, outage behavior, access-token lifetime, refresh-token rotation, and reuse detection before activation. The first increment's conservative proposal is short-lived access tokens, optional refresh tokens, and no destructive/unclassified tools; this is a policy proposal, not an accepted revocation guarantee.

### Failure and privacy policy

- Missing, malformed, wrong-issuer/resource, expired/not-yet-valid, or otherwise invalid bearer credentials: bounded HTTP `401`, with a trusted metadata challenge if this deployment elects to emit one.
- Insufficient scope or local permission: bounded HTTP `403` at the HTTP authorization boundary. Unknown subject, disabled/ambiguous mapping, and instance mismatch fail closed without disclosing unrelated subject/resource existence; finalize their nondiagnostic HTTP mapping before acceptance.
- Authorization-server metadata mismatch or token lookup/introspection outage: deny unless the selected profile has an independently approved, current validation state. Under the preferred opaque profile, do not use stale token state to extend trust. Ambiguous subject mapping always denies. Emit only a protected, redacted operator event. If a JWT/JWKS alternative is later selected, apply the separately retained deny-on-required-refresh-failure rule.
- No raw Authorization value, JWT, claims, JWKS response, client secret, refresh token, cookie, or complete subject profile may enter logs, traces, metrics, audit, or retained evidence.
- OAuth validation never expands authority beyond the intersection of endpoint enablement, DEC-MCP-04 instance binding, deployment tool policy, local Passport/RBAC, data scope, resource ownership, and DEC-MCP-06 risk policy.

## Shared DEC-MCP-03/04 design interface (proposed)

Both decisions must use one deployment-owned, validated configuration contract: a canonical external HTTPS `/mcp` endpoint URL maps to **one** protected-resource identifier and **one** enabled Vona instance; that resource is registered for an allowlisted authorization-server issuer and is the expected recipient of its tokens. The path-specific protected-resource metadata publishes the configured resource and issuer identifiers for that same endpoint. DEC-MCP-04 supplies the trusted endpoint/instance binding before instance initialization; DEC-MCP-03 confirms the opaque token's issuer and recipient from current server-owned lookup state against that binding, then maps `(issuer, sub, bound instance)` to exactly one active local identity. Neither raw Host nor a token claim may select the instance, and the same resource cannot bind to different instances. An unconfigured, ambiguous, mismatched, or disabled binding prevents MCP activation or dispatch; an absent trusted instance claim does not bypass resource registration and local mapping.

Design acceptance may establish this interface, configuration ownership, and fail-closed opaque-token validation profile **without claiming** that an authorization server, live Host/instance/resource tuple, proxy operator, client registration, local mapping, token store, or test fixture is already provisioned. DEC-MCP-03 acceptance must not depend on DEC-MCP-04 already being accepted, nor vice versa: each owner review must check the same interface in both drafts and record any incompatible change before accepting either. If the interface cannot be agreed independently, hold both decisions for a joint design disposition rather than accepting one on the assumption that the other will change. Concrete deployment values, authorization-server grant semantics, and token-store behavior must be approved before they are used; installed-library behavior, proxy/metadata isolation, local mapping and HTTP outcomes require separately approved integration and ATP proof. No design acceptance alone enables exposure.

## Boundaries with adjacent decisions

- **DEC-MCP-02:** owns the 2026-07-28 transport method, protocol metadata, wire errors, and request/response handling. This decision supplies auth challenge and protected-resource inputs but does not alter the wire profile.
- **DEC-MCP-04:** owns trusted Host/forwarded-host processing, canonical host-to-instance mapping, selector conflicts, and token-instance consistency. This decision only requires the token resource/instance relationship to be checked after that binding is established.
- **DEC-MCP-06:** owns scope vocabulary, per-tool policy, confirmation, side-effect classification, and result/data minimization. This decision does not make a broad scope sufficient for a call.
- **DEC-MCP-07:** owns fresh context/Passport construction and executor adaptation. This decision requires a fresh local subject projection but does not select its implementation.
- **DEC-MCP-08:** owns validation telemetry, redaction, retention, rate/timeout limits, and operational ownership. This decision supplies only the OAuth-specific events that must be classified safely.

## Alternatives rejected or deferred

- **Reuse Cabloy `auth-oauth` as the MCP authorization server:** rejected as an assumption; current source demonstrates login/provider integration, not the complete MCP authorization-server/resource-indicator contract.
- **Accept ordinary Cabloy JWTs or temporary tokens as MCP bearer tokens:** rejected because local signing/Passport or URL-bound temporary-token semantics do not establish the MCP resource, client grant, scope, instance, revocation, and lifecycle contract.
- **Use generic Vona JWT extraction:** rejected because the current extractor checks query before Authorization; MCP accepts only the protected-resource Bearer header.
- **Map OAuth claims directly to local roles or tenant/instance:** rejected because external claims are not local authority or data scope.
- **Require JWT/JWKS for the first increment:** deferred as an alternative; the preferred profile uses MCP-specific opaque tokens and current token lookup/introspection. The retained deny-on-required-refresh-failure rule applies only if JWT/JWKS is later selected.
- **Build a separate MCP authorization UI/client registry in the resource module:** deferred; `a-auth` authorization-server extension is the preferred candidate, while the resource module adds no independent consent or identity authority.

## Acceptance and execution gates

Before **design-only** acceptance of `DEC-MCP-03`, review and record:

1. the shared DEC-MCP-03/04 interface above, including configuration owners and validation of issuer → protected resource → canonical endpoint → instance, token recipient, optional trusted instance-claim semantics, and `(issuer, sub, bound instance)` mapping; reconcile the same interface in ADR 0004 without requiring DEC-MCP-04's prior acceptance;
2. the Cabloy-integrated authorization-server candidate versus MCP resource-server responsibilities, issuer discovery (RFC 8414 or OIDC), PKCE/client-registration/consent compatibility policy, preferred opaque token lookup/introspection profile, optional refresh-token issuance/rotation/reuse policy, recipient binding, URI canonicalization, scope-policy ownership, token-store availability/consistency, and nondiagnostic `401`/`403`/challenge taxonomy; retain the deny-on-required-JWKS-refresh-failure rule only for a separately selected JWT/JWKS alternative;
3. path-specific protected-resource metadata, required `resource`/`authorization_servers` fields, per-bound-endpoint variation and cache isolation, direct unwrapped JSON, and no secret/topology disclosure; deterministic local mapping failure behavior and the fresh Passport handoff to DEC-MCP-07.

Do **not** infer acceptance from this draft or from a planning audit. Before configuring/activating a real endpoint, separately approve and validate the selected authorization-server owner and escalation path, public endpoint/instance/resource registration, proxy and local-mapping owners, client-grant and scope semantics, token-store/lookup/rotation behavior, library and security parameter choices, and safe failure behavior against DEC-MCP-04/06/07/08. Retain these as `TODO(confirm)` while unknown; a design-only decision is not authorization to choose their values. A separately approved bounded execution dossier must own dependencies, configuration and fixtures; synthetic tests for wrong issuer/resource, inactive/expired/revoked opaque state, lookup outage, refresh-token rotation/reuse, scopes, query-token and refresh-token rejection at the resource endpoint, unmapped/disabled subjects and no-controller dispatch, together with metadata, host isolation and real HTTP ATP, are **implementation/verification gates**, not prerequisites to design-only acceptance. If a JWT/JWKS alternative is selected later, add its key-rotation and required-refresh-failure branch separately.

No runtime evidence exists. Planning audits/charts and source inspection cannot accept this ADR or prove token validation.

## References

- [MCP authorization, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [OAuth 2.0 Protected Resource Metadata (RFC 9728)](https://www.rfc-editor.org/rfc/rfc9728)
- [OAuth 2.0 Authorization Server Metadata (RFC 8414)](https://www.rfc-editor.org/rfc/rfc8414)
- [OAuth 2.0 Security Best Current Practice (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700)
- [Vona Auth Guide](../../../repo-docs/backend/auth-guide.md)
- [Vona JWT extractor](../../../vona/src/suite-vendor/a-vona/modules/a-jwt/src/service/jwtExtract.ts)
- [Vona Passport bean](../../../vona/src/suite-vendor/a-vona/modules/a-user/src/bean/bean.passport.ts)
