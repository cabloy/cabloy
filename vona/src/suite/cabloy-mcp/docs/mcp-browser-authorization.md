# MCP Browser Authorization

This guide describes Cabloy Basic's bounded browser-to-MCP authorization profile, including the approved authority/configuration simplification. RFC 7591 Dynamic Client Registration (DCR) is the only client-registration path for both public and confidential clients; it is available whenever the existing AS/MCP ingress is available, without a separate registration enablement switch. Static configuration clients are not supported. This is not a claim that a public deployment is live or production use is qualified. See [Verification and operational limits](#verification-and-operational-limits) for current focused checks, historical coverage and earlier failed-run limitations.

The connected journey is:

```text
MCP client → /mcp/auth → existing SSR Site → consent page
          → existing login, if needed → explicit approve or deny
          → registered client callback → /mcp/token → Bearer-authenticated /mcp
```

Backend `mcp-auth` in the `cabloy-mcp` suite owns OAuth authorization state, decisions, codes and tokens. Backend `cabloy-mcp` validates MCP access and maps explicitly opted-in Controller Actions to tools; dev/test-only `mcp-test` owns the shared `/mcp` endpoint and composes it through `createControllerToolServer(app, scope)`. This includes the three read-only catalog actions and the conditional [student summary tool](#student-summary-business-read), plus supported opted-in actions enabled in the current mode. The consent page belongs to Zova's `cabloy-mcp` suite/module. This does not introduce production ingress or a management console.

For the independent anonymous, credential-rejecting standalone fixture, use [Local MCP Test Catalog](./mcp-commerce-local.md). Do not send OAuth tokens to that launcher.

## Student summary business read

When `training-student` is active, the authenticated shared endpoint also lists **`training_student_summary`**. It accepts only `{ "id": "<existing student ID>" }` and invokes the existing guarded `GET /training/student/summary/:id` action with `innerAccess: false`. The action retains its inherited student `view` RBAC, serializer, current authenticated user, and ordinary instance-scoped model read. It is not an owner-only self-service action. Neither `mcp:all` nor `mcp:read` grants student permission; both scopes permit this read only when the current business authorization allows it.

The validated result contains exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, and `summaryText`, identically represented as JSON text and structured content. Metadata comes from a projection of the existing summary DTO. Mobile and full Markdown/HTML notes are omitted from the advertised schema and result. This is field minimization, not anonymization: the name and summary remain business data. Missing records, including records outside the current instance, produce a safe not-found tool result; denied or failed reads return a generic failure without exception details. Invalid arguments are protocol errors. Clients cannot supply routes, methods, credentials, instance/user selectors, or executor options.

The shared endpoint now discovers supported, explicitly opted-in Controller Actions rather than adding this tool through a student-specific adapter. Its method-level `@mcp.tool()` preserves the explicit name and six-field `output.pick`; the HTTP DTO and permissions stay unchanged. Without the training module, this tool is absent, but other enabled opted-in actions remain eligible. The independent anonymous launcher always retains exactly its three synthetic fixtures and does not use the mapper or expose this business tool. See [MCP Controller Tools](./mcp-controller-tools.md) for class/method opt-in, contract mapping and diagnostics.

For a manual check of the mapper-backed shared endpoint:

1. Use a freshly authorized shared-server connection and an existing student that the signed-in account may already view. List tools and confirm `training_student_summary` and its six-field output schema. Do not use a disposable automated-test ID or create seed data merely for this check.
2. Call it with `{ "id": "<existing student ID>" }`. Check identity and exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText`; JSON text and structured content must agree. Check that neither schema definitions nor results retain mobile or full notes.
3. With a separately authorized `mcp:read` connection, confirm only read-only tools are listed. If a supported mutation tool is enabled, a direct call by its known name must also be rejected. `mcp:all` may expose both classifications but must retain ordinary action authorization; do not execute business writes merely to check discovery.
4. If an opted-in tool is missing, inspect the factory server's `diagnostics` (`controller`, `action`, `reason`) on the server side. Unsupported contracts are omitted; diagnostic details are not client errors. A business permission error is not a reason to bypass RBAC or grant a role.

This procedure includes checks beyond the reported happy path. The [earlier automated qualification](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#student-summary-business-tool-automated-qualification-2026-10-25) and historical real-client report below predate replacement of the student-specific adapter and do not revalidate the mapper. In a [separate subsequent Codex replay](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#user-reported-codex-generic-mapper-replay-success-recorded-2026-10-25), the user reported all four mapper-backed reads successful in order: category → search → detail with matching identities and actual `priceCents = 9999`, `available = 11`, then student summary with matching input identity, exactly six fields, consistent summary and no mobile/full notes. No retries or permission changes were reported. This passes the bounded user-reported replacement happy path, not independent served-source attestation, schema/text-versus-structured inspection, negative-scope coverage, production readiness or full ATP closure.

On 2026-10-25, before that replacement, the user reported Codex server `test` discovered this tool and invoked `mcp__test__training_student_summary` successfully. The returned ID matched the input, the result contained exactly the six fields, and mobile/full notes were absent. They reported no writes or role-permission changes. This passed the bounded real-client happy path for the earlier integration; the [retained acceptance record](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#user-reported-codex-student-summary-success-recorded-2026-10-25) omits raw student name/ID and keeps exact scope, version and served-source attribution unknown. The mapper-backed replacement has not been revalidated by that historical report. Earlier negative authorization and instance-isolation checks remain automated historical coverage, not proof for this replacement, production readiness or full ATP closure.

## Supported first profile

| Item                               | Boundary                                                              |
| ---------------------------------- | --------------------------------------------------------------------- |
| Grant                              | Authorization code with PKCE **S256**, including confidential clients |
| Client registration                | RFC 7591 DCR only; available with the existing AS/MCP ingress         |
| Public client authentication       | `none`                                                                |
| Confidential client authentication | `client_secret_basic`                                                 |
| Scopes                             | `mcp:all` (new-registration default) and narrower `mcp:read`          |
| Pending authorization lifetime     | **10 minutes** by default                                             |
| Authorization code lifetime        | **60 seconds** by default; one use                                    |
| Access token lifetime              | **15 minutes** by default; opaque MCP-specific token                  |
| Refresh                            | None; start a new authorization after access-token expiry             |
| Consent                            | Explicit approve/deny on every request; no remembered consent         |

`POST /mcp/register` creates an AS-owned client record whenever the existing AS/MCP ingress is available, and its authorization-server metadata advertises `registration_endpoint`. There is no `registration.enabled` field or separate registration activation step. Registration retains bounded body/redirect limits and rate limiting; availability does not bypass ingress or current client, authorization, configuration and account validity checks. Registration creates only a client identity: it does not authenticate a user, grant Cabloy roles or tenant access, issue an authorization code/token, or bypass explicit consent and PKCE. CIMD, dynamic scopes, remembered consent, refresh tokens, a management UI, and public registration update/delete endpoints remain deferred. No `refresh_token` grant or `offline_access` is advertised. An ordinary Cabloy login JWT, temporary token or browser cookie is not an MCP access token. Configured TTL values and OAuth `expires_in` use seconds; an `expiresAt` timestamp uses epoch milliseconds.

## Endpoints and registration

The initial endpoint paths are:

| Purpose                                   | Path                                          |
| ----------------------------------------- | --------------------------------------------- |
| Begin browser authorization               | `/mcp/auth`                                   |
| Exchange a code                           | `/mcp/token`                                  |
| Dynamic client registration               | `/mcp/register`                               |
| Authorization-server metadata             | `/.well-known/oauth-authorization-server/mcp` |
| MCP protected-resource metadata           | `/.well-known/oauth-protected-resource/mcp`   |
| Shared MCP resource                       | `/mcp`                                        |
| Consent page inside the selected SSR Site | `/cabloy/mcp/consent`                         |

Both the AS issuer and protected resource are the exact `${origin}/mcp` identifier, including the `/mcp` path. `origin` comes from the **root backend** `server.serve.protocol` and `server.serve.host`, not `config.modules['mcp-auth']`, a request Host or proxy header. Production requires the configured public serve pair. Nonproduction may use the existing requestless `AppUtil` fallback `http://localhost:<SERVER_LISTEN_PORT>` when no public serve pair is configured; it must not infer authority from the incoming request. Arbitrary Host/forwarded values cannot mint an issuer or resource. Validate Host against the canonical authority, reject instance selectors, and use existing automatic instance routing in a fresh selector-free context; there is no separate MCP resource/instance registry. Missing, invalid or inconsistent authority fails closed. Cross-origin AS/resource federation is not supported.

The canonical AS discovery path is `/.well-known/oauth-authorization-server/mcp` for the path-bearing issuer; PRM remains `/.well-known/oauth-protected-resource/mcp`. The consent URL receives the selected Site's public-path prefix through its normal page-path helper; the canonical page path is not a separate OAuth redirect registration.

Register a client with a direct JSON request such as:

```http
POST /mcp/register
Content-Type: application/json

{
  "client_name": "Example MCP client",
  "redirect_uris": ["https://client.example.com/oauth/callback"],
  "token_endpoint_auth_method": "none",
  "grant_types": ["authorization_code"],
  "response_types": ["code"]
}
```

The response is direct JSON with HTTP `201`, a server-issued opaque `client_id`, exact redirect URIs, the canonical registered scope, and the supported grant/response/authentication metadata. Confidential registration with `client_secret_basic` returns the secret only in that response; the server stores only its digest. Redirect URIs must be exact HTTPS values, or HTTP for exactly `localhost`, `127.0.0.1` or `[::1]` while `allowLoopbackHttp` is true (the module default). An explicit `false` disables that exception; lookalikes, other loopback addresses and arbitrary HTTP hosts are not allowed. Unknown metadata, duplicate members, forwarded headers, instance selectors, query strings, oversized/malformed JSON, and unsupported metadata are rejected. The server fixes the resource to the derived canonical `${origin}/mcp`; clients can select only the supported scopes, not arbitrary resource or scope vocabulary.

### Scope ceiling and client configuration

- **New DCR registration:** omitted `scope` defaults to `mcp:all`. Explicit `mcp:all` and `mcp:read` are supported. A valid space-separated list `mcp:all mcp:read` or `mcp:read mcp:all` is accepted and canonicalized to `mcp:all`.
- **Authorization:** explicit `scope` uses the same supported values and list canonicalization; omitted `scope` inherits that client's registered ceiling, not an unconditional `mcp:all` default. An `mcp:all` registration may authorize either `mcp:all` or narrowed `mcp:read`; an `mcp:read` registration cannot authorize `mcp:all`. The approved scope remains bound through consent, code exchange and token use.
- **Existing clients and tokens:** existing `mcp:read` registrations, grants and tokens are not promoted by the new default. Requesting broader access requires a new `mcp:all` registration and fresh explicit authorization; do not rewrite persisted bindings.
- **Local authority:** both scopes remain bounded by the current user's RBAC, resource ownership, data scope and tenant/instance. `mcp:all` is not administrator or cross-tenant authority. The mapper enforces scope at both `tools/list` and `tools/call`: `mcp:read` lists/calls only tools classified read-only; `mcp:all` permits both classifications without bypassing business guards. The three catalog actions remain read-only and work with either scope. Classification uses action `readOnly`, then controller default, then GET inference; GET is a convention, not proof of no side effects. Opt-in is closed by default, and there is no exclusion option after class opt-in; decorate selected methods when only a subset is safe to expose.

No client scope configuration is needed for the new-registration default. To explicitly narrow Codex authorization, use top-level `scopes` in the server's MCP configuration table, not in its HTTP headers:

```toml
[mcp_servers.cabloy]
url = "https://mcp.example.com/mcp"
scopes = ["mcp:read"]
```

For clients that request both `authorization_code` and `refresh_token` during DCR, the server accepts the request but registers and returns only `grant_types: ["authorization_code"]`. This remains capability negotiation, not refresh support: discovery advertises only the authorization-code grant, token exchange returns no refresh token, and a refresh grant is rejected. Refresh-only requests, unrelated or duplicate grants, and unsupported scopes (including `offline_access`) remain invalid registration metadata.

### Codex native registration compatibility

DCR also accepts an omitted `application_type` or exactly `application_type: "native"` as a request-only compatibility hint. It is validated and discarded, not persisted or echoed as registered metadata. No default application type or OIDC application-type semantics are introduced. Other values (including `web`, null, wrong types, case and whitespace variants) remain `invalid_client_metadata`; unrelated unknown fields remain rejected. Exact redirect validation, authentication, scope ceilings, PKCE and authorization-code-only/no-refresh behavior are unchanged. This bounded profile does not claim unrestricted RFC 7591 metadata support.

The source trace matching bundled Codex `0.163.0-alpha.11.1` is pinned to [Codex's registration builder](https://github.com/openai/codex/blob/680c4ba93ec79c292287fb9e0b627dc7a76e3b5e/codex-rs/rmcp-client/src/oauth_client_registration.rs#L111-L128) and [its rmcp dependency revision](https://github.com/openai/codex/blob/680c4ba93ec79c292287fb9e0b627dc7a76e3b5e/codex-rs/Cargo.toml#L451). The pinned [rmcp manager default](https://github.com/modelcontextprotocol/rust-sdk/blob/4048ac40e958fb1a7d614617a2ae8d26666ee2fa/crates/rmcp/src/transport/auth.rs#L1377-L1392) supplies `native` to its [DCR request builder](https://github.com/modelcontextprotocol/rust-sdk/blob/4048ac40e958fb1a7d614617a2ae8d26666ee2fa/crates/rmcp/src/transport/auth.rs#L1746-L1772). This identifies a concrete field rejected by the previous allowlist, consistent with the observed registration-stage `400 invalid_client_metadata`; it is not a capture of the installed App's full outbound request or proof that no other incompatibility remains. Regression fixtures include native metadata, the requested grant pair and supported scope choices; fixture success alone does not establish real-client success. A later user-reported installed-Codex retry passed authentication and the three-read business journey, as recorded separately below.

Before using the flow, the operator must ensure:

- Production has a trusted public root backend `server.serve.protocol`/`host` pair; nonproduction may use the requestless localhost listener fallback. Do not author `mcp-auth.issuer` or `mcp-auth.resources`.
- Existing automatic instance routing resolves an enabled instance after Host validation, without client selectors or an MCP mapping registry.
- An enabled SSR Site's built flavor contains the shared consent page and normal role admission permits the intended user.
- Registration body/redirect and rate limits remain bounded, with an operational policy for the resulting AS-owned client records. There is no separate DCR enablement step.
- Exact callback URIs are registered through DCR; for confidential clients, keep the returned secret private and store only its server-side digest. Never expose a secret through browser page data or metadata.

Missing or inconsistent configuration fails closed. An arbitrary Host header, instance selector, tool argument or token value cannot establish OAuth resource/instance authority. Registration does not authenticate a user, grant local Cabloy roles or tenant access, issue MCP access, or bypass data scope.

Authority belongs to root backend `server.serve`; module limits, TTLs and the narrow loopback exception belong to `config.modules['mcp-auth']`. The following illustrates the shape only; **it is not a provisioned or verified deployment**, and does not request writing deployment settings or environment files.

```ts
// Root backend public origin for a production deployment (illustrative only).
config.server.serve.protocol = 'https';
config.server.serve.host = 'mcp.example.com';
// Both issuer and resource derive as https://mcp.example.com/mcp.
config.modules['mcp-auth'] = {
  registration: {
    maxBodyBytes: 16384,
    maxRedirectUris: 16,
    rateLimit: 10,
    rateLimitWindow: 600,
  },
  pendingTtl: 600,
  codeTtl: 60,
  tokenTtl: 900,
  allowLoopbackHttp: true, // Module default; an explicit false is supported.
};
```

Public and confidential clients are created only through `/mcp/register` under the existing AS/MCP ingress; there is no static `clients` configuration. The server owns the generated ID and immutable resource/scope bindings. A confidential registration uses `client_secret_basic`; the server returns the secret only once and stores only its SHA-256 verifier. Never substitute an ordinary login token or publish a real secret/verifier in documentation, browser configuration or retained evidence.

`mcp-auth` keeps `vonaModule.fileVersion: 1`; both the authorization and client tables are created in its version-1 path, separate from `a-auth`. This does not add a version-2 migration, automatically replay version 1 against existing databases, or authorize a database reset. An existing database already recorded at version 1 is not automatically upgraded by editing that path; it needs separate approved treatment if the client table is absent.

Defaults derive authority from the root serve pair or the nonproduction requestless localhost fallback; they do not provision client registrations. TTL fields are seconds. `allowLoopbackHttp` defaults to `true` and may be overridden to `false`; it permits HTTP only for exact `localhost`, `127.0.0.1` or `[::1]`, not arbitrary HTTP, cross-origin federation or public fixture exposure. Production still requires its public serve pair.

The former origin-only issuer (for example `https://mcp.example.com`) differs from the new exact issuer `https://mcp.example.com/mcp`. Existing pending grants, codes and access tokens carrying the old issuer fail exact comparison and require a new authorization. Do not rewrite persisted grants, relax issuer matching or reset the database to preserve them; this is an authority change, not a schema/fileVersion change.

## Client and browser journey

### 1. Start a fresh authorization request

After DCR registration, the client creates a fresh PKCE verifier and its S256 challenge, then opens `/mcp/auth` in the browser. Request parameters identify `response_type=code`, the server-issued `client_id`, exact registered `redirect_uri`, canonical `resource`, optional `scope`, `code_challenge` and `code_challenge_method=S256`. Omit `scope` to inherit the registered ceiling, or send `scope=mcp:read` to request narrower read access from an `mcp:all` registration. Keep and verify client-generated OAuth `state` for callback correlation.

The AS validates client, redirect, resource, scope, instance and PKCE before redirecting toward a client callback, including error callbacks. Malformed/duplicate parameters and mismatched bindings are rejected, not silently normalized into a different authorization.

The AS chooses the enabled SSR Site for the current instance/host with the **shortest `publicPath`**; ties preserve existing ordering. It does not probe page availability or fall back based on route capability. Deploy the shared page in all selectable flavors. Selecting a Site does not bypass its role restrictions or alter ordinary SSR routing specificity.

### 2. Reuse the existing login

The browser reaches the selected Site's `/cabloy/mcp/consent?request=…` page. If authentication is required, its existing protected-page guard sends the user through normal Cabloy login and returns to that same internal pending-consent URL. The OAuth client's callback is **not** the login `returnTo`.

Existing SSR/browser Passport cookie support and the normal authenticated API client remain responsible for identity. The generated API client supplies its existing Authorization header to backend Passport guards; no new MCP cookie, holder secret, identity bridge, session system or CSRF-bootstrap step is required. The `request` value only locates pending state; possession is not authentication or approval.

The consent page uses the session SSR profile. Private summary data is loaded through its model after the required hydration/admission boundary; neutral server and initial client output must agree. Do not serialize authorization responses into SSR state or browser query persistence.

### 3. Approve or deny explicitly

Review the application, resource and requested scope. Every request requires an explicit choice, even when the user is already signed in.

Approve/deny is an authenticated POST, not a GET link or page-load side effect. It applies the existing backend origin check against trusted configured origin input and a single-winner pending transition. This is **not** a claim that stock CSRF-token enforcement is enabled: the existing helper also has development/loopback exceptions. Do not weaken Site admission, API-origin configuration or CORS/Origin policy to make the flow work.

Approval returns a server-built registered callback carrying a one-use code and the client's state; denial returns a registered error callback with no code. The browser immediately navigates to that callback. The mutation response must not become cached summary data, persisted callback state, logs or SSR output. An expired, already decided or invalid request must not issue a replacement code.

### 4. Exchange once, then call MCP

At its callback, the client validates `state` and exchanges the code at `/mcp/token`. The exchange uses `grant_type=authorization_code`, the code, original PKCE `code_verifier`, canonical `resource` and **the exact `redirect_uri` used at authorization**. The redirect field is required even though the server already has its binding. Public clients identify themselves with `client_id` and no secret; confidential clients authenticate using HTTP Basic under `client_secret_basic`, not a secret in the URL.

A successful exchange consumes the code and activates the resulting opaque access token in the same conditional database update and committed outcome. Codes cannot be replayed, and a lost response does not enable credential recovery or automatic issuance retry. No refresh token is returned.

Send the MCP access token only as **one `Authorization: Bearer` header** on the protected shared `/mcp` request. Keep the endpoint's required MCP framing/version/method headers. Do not supply bearer credentials through query parameters, cookies, proxy headers or a framework login-token shortcut. This protected-resource rule does not remove normal cookies from the SSR consent page.

Each protected request checks current expiry, revocation, registration and account validity, then constructs a fresh local Passport projection in the trusted instance. Scope is only one limit: existing controller guards, RBAC, resource ownership and data scope remain authoritative. Missing/invalid bearer receives 401 with the applicable challenge; insufficient scope receives 403. Lookup/configuration failure denies before tool dispatch.

## Troubleshooting without weakening the boundary

- **No usable registration:** check root backend `server.serve.protocol`/`host` (or the nonproduction requestless localhost fallback), Host validation, existing automatic instance routing and the active DCR record with its exact registered redirect. DCR follows existing AS/MCP ingress availability; there is no `registration.enabled`, authored issuer/resource map or static-client fallback. Keep body/rate limits and do not make request Host, proxy headers or selectors authoritative.
- **Consent route missing or user denied by the selected Site:** verify the shared route is included in that Site's paired built artifacts and that ordinary Site-role admission is appropriate. The backend intentionally does not capability-probe or select a more permissive Site.
- **Login does not return to consent:** preserve the exact internal pending URL through the existing login flow; do not substitute the OAuth callback or add another cookie/bridge.
- **Consent API calls reach the wrong origin:** inspect explicit Site/module API-origin overrides first. Vona integrated SSR normally supplies runtime API origins; see [Runtime API origins](../../../../../repo-docs/fullstack/ssr-entry-modes.md#runtime-api-origins-in-vona-integrated-ssr). Do not edit environment values merely to match an isolated test listener.
- **Decision rejected:** check current login/account state, request lifetime and trusted origin. Do not replace an authenticated POST with a GET or introduce CSRF bootstrap to bypass the normal client chain.
- **Code exchange rejected:** check exact redirect/client/resource binding, the original verifier, expiry and previous use. Reauthorize instead of replaying or recovering a credential.
- **MCP access denied:** distinguish token/scope failure from current local authorization. A valid token does not create a local role or a cross-instance entitlement.

## Verification and operational limits

The Controller Action mapper replacement is qualified separately in the [opt-in mapping evidence](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#explicit-opt-in-controller-action-mapping-2026-10-25). Its focused shared authorization/student regression passes **34/34**, including ordinary RBAC/instance behavior and read-scope denial before test-only writes in modern and legacy modes. Earlier real-Codex catalog/student acceptance is historical; a real-client retest of the generic replacement remains separate.

The retained results below describe their original increments. They predate the Controller Action mapper replacement and are not new verification of its discovery, projection or scope enforcement. No replacement acceptance is inferred from the earlier Codex reports.

This profile initially targets SQLite on Vona's primary datasource and ordinary application wall-clock deadlines under a correctly maintained host clock. It does not establish cross-dialect, multi-worker, cross-host, qualified nonrollback-clock, synchronous browser-logout/token-revocation or production guarantees. Expiry and current revocation checks must not depend on background cleanup.

On 2026-10-25, the user confirmed the real Codex App displayed `Authentication complete. You may close this window.` They then confirmed all three category → product search → product detail tool calls succeeded, with matching product/category IDs and expected `priceCents: 9999`, `available: 11`. This is user-reported real-client authentication and read-only business success, separate from the automated fixture checks below. The [retained acceptance record](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#user-reported-codex-oauth-and-fixture-tool-success-recorded-2026-10-25) preserves procedure, source-attribution limits and unknowns; no exact granted scope, full wire capture, production qualification or full ATP closure is inferred.

The native DCR compatibility amendment on 2026-10-25 passed focused native typechecks for backend `mcp-auth` and `mcp-test`. The managed registration/shared-listener HTTP selection passed **15 tests, 0 failed**; the managed integrated-SSR browser run passed **4 scenarios** (default-all and explicit-read login/approval/PKCE/Bearer journeys, denial, and invalid requests). Both managed commands exited **0**. Fixtures now include `application_type: "native"`; service coverage retains omission and rejects unsupported native metadata values and unrelated unknown fields before persistence, while responses omit the hint and remain authorization-code-only. Existing SSR/REST artifacts were reused without frontend source changes or contract regeneration. Targeted formatting/lint, diff whitespace and all three relative file links in this guide passed; fragment anchors were not checked. The formal docs build exited **0** with its existing chunk-size warning and does not build this suite-local guide. These results verify fixtures, not an installed Codex App retry or production qualification. No development database reset, environment/port change, service restart or live diagnostic registration was performed.

The dual-scope amendment on 2026-10-24 passed focused native typechecks for backend `mcp-auth`, `cabloy-mcp` and `mcp-test`, plus the frontend `cabloy-mcp` module. Managed backend regression passed **33 tests, 0 failed** across authorization, registration, shared-listener HTTP and transport guards. Coverage includes new-registration default `mcp:all`, canonicalization of both discovered scopes, inherited read ceilings, all-to-read narrowing through consent/code/token/lookup, escalation and invalid stored-scope rejection, and actual read-tool access with both scopes. Existing PKCE, one-use redemption, revocation and no-refresh regressions remain covered. Paired Admin and Web SSR/REST builds and `deps:vona` completed before the managed integrated-SSR browser run, which passed **4 scenarios**: default-all and explicit-read successful journeys, denial, and invalid requests. Both managed test commands exited **0**. Targeted formatting/lint, diff whitespace, and 186 relative file links across seven changed Markdown files passed; fragment anchors were not checked. The formal docs build exited **0** with its chunk-size warning and does not build this suite-local guide. This is fixture-based coverage, not proof of an installed Codex App retry, mutation-scope separation for future tools, or production qualification. No development database reset, environment/port change, or service restart was performed.

The following checks predate the dual-scope amendment and retain their original scope; they do not verify the new defaults or scope-ceiling behavior.

The bounded DCR compatibility follow-up on 2026-10-24 passed focused native typechecks for `mcp-auth` and `mcp-test`, **27 backend tests, 0 failed**, and **3 browser scenarios**, with both managed test commands exiting **0**. Registration accepts the Codex-style requested grant pair plus `scope: "mcp:read"`, while responses/discovery retain only the authorization-code grant and token exchange issues no refresh token. Service regressions reject broader scope, refresh-only, unrelated and duplicate grants; HTTP regressions verify refresh requests remain rejected. Browser fixtures use the compatible request through login, explicit consent, PKCE and Bearer tool access. This is fixture-based compatibility coverage, not evidence of a successful installed Codex App authentication. Targeted formatting, diff whitespace, all three relative file links in this guide and the formal docs build passed; the build retained its chunk-size warning and does not build this suite-local guide. The first backend attempt passed 26/27: the new refresh rejection assertion expected `unsupported_grant_type`, but its unsupported `refresh_token` parameter was rejected earlier as `invalid_request`. The assertion was corrected to cover both existing rejection layers without changing the token endpoint; the complete rerun passed, and failed-run resources were not manually removed.

The authority/configuration simplification was verified on 2026-10-24 without the special E2E backend configuration injection/helper. Focused native typechecks passed for `mcp-auth`, `cabloy-mcp` and `mcp-test`. The managed backend command passed **26 tests, 0 failed**, covering authorization, registration, shared-listener HTTP and transport guards; the managed browser command passed **3 scenarios** using normal module defaults and the listener's root-origin configuration. Both commands exited **0**. Browser coverage includes exact pathful issuer/discovery endpoints, DCR → login/consent → PKCE → real Bearer tools, denial/terminal handling and invalid requests. Targeted formatting, diff whitespace and 264 relative file links across 10 changed Markdown files passed. The formal docs build exited **0** with a chunk-size warning; it does not itself build this suite-local guide.

The first backend attempt in this increment passed 25/26 tests; its sole failure compared unordered database rows to registration order. The assertion now compares sorted client IDs, and the complete focused rerun passed. Failed-run resources were not manually removed. The earlier checks below predate this simplification and remain historical evidence only.

The dynamic-only/version-1 follow-up on 2026-10-24, before the simplification, passed focused `mcp-auth` and `mcp-test` typechecks, **17 backend tests** across authorization, registration and managed HTTP coverage, and **3 browser E2E scenarios**, with both managed commands exiting **0**. Fresh isolated initialization used `mcp-auth` version **1** and exercised both tables. Coverage includes confidential DCR Basic exchange, registration revocation, and existing-client authorization/exchange/Bearer access while new registration is disabled. The formal documentation-site build also exited **0**; it does not itself build this suite-local guide. The first follow-up backend run failed two cases because the new registration-switch test restored a stale configuration reference; that fixture was corrected before the passing rerun. No retained failed-run resources were manually removed.

Earlier implementation verification on 2026-10-23–24 established passing focused backend typechecks for `mcp-auth`, `mcp-test`, and the shared rate-limit module, targeted formatting/diff checks, and the isolated registration test. The managed MCP HTTP integration command exited **0** with 8 passed tests, including dynamic registration-to-consent-to-PKCE-to-bearer flow and direct DCR negative cases. All three integrated-SSR browser scenarios passed in a managed E2E command that exited **0**: dynamic registration, anonymous login and internal return, explicit approval with PKCE exchange and real Bearer tools, denial/terminal handling, invalid registration/locator handling, and neutral SSR hydration. Broader frontend/backend builds and full contract generation/dependency synchronization are not claimed by the focused checks or the dynamic-only follow-up.

The final managed authorization-service and ingress-guard run reported **14 passed, 0 failed**, including six service cases with real existing identity, expiry/revocation and separate-context single-winner checks. The protected shared-listener run reported **7 passed, 0 failed** after explicitly awaiting its existing shared-instance startup before fixture writes; this does not establish the precise database-error cause of earlier failures. The independent anonymous standalone run reported **8 passed, 0 failed**. Each final command exited **0**; standalone verification used its required listener-disabled mode separately from shared-listener tests.

Earlier browser, standalone and contract-generation attempts exited **1** at post-shutdown resource cleanup despite successful task output; earlier backend attempts also failed or did not complete successfully. These attempts are not passing evidence, and successful fresh reruns do not prove their retained resources were repaired or released. Retained claims and cleanup locks remain subject to the runner's ownership checks, not manual deletion or cleanup bypasses. The bounded checks above are not full legacy ATP acceptance or production release clearance. For verification workflow and resource boundaries, see [Repo Scripts](../../../../../repo-docs/reference/repo-scripts.md).

Never retain raw tokens, authorization codes, client secrets, Authorization/cookie values or complete credential-bearing callback URLs in logs, screenshots, traces or shared evidence. Do not reset development databases, alter shared ports or expose the standalone fixture to troubleshoot this flow.
