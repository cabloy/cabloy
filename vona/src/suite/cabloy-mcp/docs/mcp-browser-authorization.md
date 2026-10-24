# MCP Browser Authorization

This guide describes Cabloy Basic's bounded browser-to-MCP authorization profile, including the approved authority/configuration simplification. RFC 7591 Dynamic Client Registration (DCR) is the only client-registration path for both public and confidential clients; it is available whenever the existing AS/MCP ingress is available, without a separate registration enablement switch. Static configuration clients are not supported. This is not a claim that a public deployment is live or production use is qualified. See [Verification and operational limits](#verification-and-operational-limits) for current focused checks, historical coverage and earlier failed-run limitations.

The connected journey is:

```text
MCP client → /mcp/auth → existing SSR Site → consent page
          → existing login, if needed → explicit approve or deny
          → registered client callback → /mcp/token → Bearer-authenticated /mcp
```

Backend `mcp-auth` in the `cabloy-mcp` suite owns OAuth authorization state, decisions, codes and tokens. Backend `cabloy-mcp` validates MCP access, while dev/test-only `mcp-test` continues to own the shared `/mcp` endpoint and the three read-only catalog tools. The consent page belongs to Zova's `cabloy-mcp` suite/module. This does not introduce a production tool registry or management console.

For the independent anonymous, credential-rejecting standalone fixture, use [Local MCP Test Catalog](./mcp-commerce-local.md). Do not send OAuth tokens to that launcher.

## Supported first profile

| Item                               | Boundary                                                              |
| ---------------------------------- | --------------------------------------------------------------------- |
| Grant                              | Authorization code with PKCE **S256**, including confidential clients |
| Client registration                | RFC 7591 DCR only; available with the existing AS/MCP ingress         |
| Public client authentication       | `none`                                                                |
| Confidential client authentication | `client_secret_basic`                                                 |
| Scope                              | `mcp:read` for the existing read-only tools                           |
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

The response is direct JSON with HTTP `201`, a server-issued opaque `client_id`, exact redirect URIs, fixed `mcp:read` scope, and the supported grant/response/authentication metadata. Confidential registration with `client_secret_basic` returns the secret only in that response; the server stores only its digest. Redirect URIs must be exact HTTPS values, or HTTP for exactly `localhost`, `127.0.0.1` or `[::1]` while `allowLoopbackHttp` is true (the module default). An explicit `false` disables that exception; lookalikes, other loopback addresses and arbitrary HTTP hosts are not allowed. Unknown metadata, duplicate members, forwarded headers, instance selectors, query strings, oversized/malformed JSON, and unsupported metadata are rejected. The server fixes the resource to the derived canonical `${origin}/mcp`; clients cannot register a resource or scope of their choice.

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

After DCR registration, the client creates a fresh PKCE verifier and its S256 challenge, then opens `/mcp/auth` in the browser. Request parameters identify `response_type=code`, the server-issued `client_id`, exact registered `redirect_uri`, canonical `resource`, `scope=mcp:read`, `code_challenge` and `code_challenge_method=S256`. Keep and verify client-generated OAuth `state` for callback correlation.

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

This profile initially targets SQLite on Vona's primary datasource and ordinary application wall-clock deadlines under a correctly maintained host clock. It does not establish cross-dialect, multi-worker, cross-host, qualified nonrollback-clock, synchronous browser-logout/token-revocation or production guarantees. Expiry and current revocation checks must not depend on background cleanup.

The authority/configuration simplification was verified on 2026-10-24 without the special E2E backend configuration injection/helper. Focused native typechecks passed for `mcp-auth`, `cabloy-mcp` and `mcp-test`. The managed backend command passed **26 tests, 0 failed**, covering authorization, registration, shared-listener HTTP and transport guards; the managed browser command passed **3 scenarios** using normal module defaults and the listener's root-origin configuration. Both commands exited **0**. Browser coverage includes exact pathful issuer/discovery endpoints, DCR → login/consent → PKCE → real Bearer tools, denial/terminal handling and invalid requests. Targeted formatting, diff whitespace and 264 relative file links across 10 changed Markdown files passed. The formal docs build exited **0** with a chunk-size warning; it does not itself build this suite-local guide.

The first backend attempt in this increment passed 25/26 tests; its sole failure compared unordered database rows to registration order. The assertion now compares sorted client IDs, and the complete focused rerun passed. Failed-run resources were not manually removed. The earlier checks below predate this simplification and remain historical evidence only.

The dynamic-only/version-1 follow-up on 2026-10-24, before the simplification, passed focused `mcp-auth` and `mcp-test` typechecks, **17 backend tests** across authorization, registration and managed HTTP coverage, and **3 browser E2E scenarios**, with both managed commands exiting **0**. Fresh isolated initialization used `mcp-auth` version **1** and exercised both tables. Coverage includes confidential DCR Basic exchange, registration revocation, and existing-client authorization/exchange/Bearer access while new registration is disabled. The formal documentation-site build also exited **0**; it does not itself build this suite-local guide. The first follow-up backend run failed two cases because the new registration-switch test restored a stale configuration reference; that fixture was corrected before the passing rerun. No retained failed-run resources were manually removed.

Earlier implementation verification on 2026-10-23–24 established passing focused backend typechecks for `mcp-auth`, `mcp-test`, and the shared rate-limit module, targeted formatting/diff checks, and the isolated registration test. The managed MCP HTTP integration command exited **0** with 8 passed tests, including dynamic registration-to-consent-to-PKCE-to-bearer flow and direct DCR negative cases. All three integrated-SSR browser scenarios passed in a managed E2E command that exited **0**: dynamic registration, anonymous login and internal return, explicit approval with PKCE exchange and real Bearer tools, denial/terminal handling, invalid registration/locator handling, and neutral SSR hydration. Broader frontend/backend builds and full contract generation/dependency synchronization are not claimed by the focused checks or the dynamic-only follow-up.

The final managed authorization-service and ingress-guard run reported **14 passed, 0 failed**, including six service cases with real existing identity, expiry/revocation and separate-context single-winner checks. The protected shared-listener run reported **7 passed, 0 failed** after explicitly awaiting its existing shared-instance startup before fixture writes; this does not establish the precise database-error cause of earlier failures. The independent anonymous standalone run reported **8 passed, 0 failed**. Each final command exited **0**; standalone verification used its required listener-disabled mode separately from shared-listener tests.

Earlier browser, standalone and contract-generation attempts exited **1** at post-shutdown resource cleanup despite successful task output; earlier backend attempts also failed or did not complete successfully. These attempts are not passing evidence, and successful fresh reruns do not prove their retained resources were repaired or released. Retained claims and cleanup locks remain subject to the runner's ownership checks, not manual deletion or cleanup bypasses. The bounded checks above are not full legacy ATP acceptance or production release clearance. For verification workflow and resource boundaries, see [Repo Scripts](../../../../../repo-docs/reference/repo-scripts.md).

Never retain raw tokens, authorization codes, client secrets, Authorization/cookie values or complete credential-bearing callback URLs in logs, screenshots, traces or shared evidence. Do not reset development databases, alter shared ports or expose the standalone fixture to troubleshoot this flow.
