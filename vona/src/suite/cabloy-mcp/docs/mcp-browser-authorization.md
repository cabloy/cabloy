# MCP Browser Authorization

This guide describes Cabloy Basic's implemented, bounded browser-to-MCP authorization profile. Registrations remain operator-owned and disabled by default; this is not a claim that a public endpoint is live or production use is qualified. The connected browser flow and targeted backend regressions have passed managed isolated verification. See [Verification and operational limits](#verification-and-operational-limits) for coverage and earlier failed-run limitations.

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
| Client registration                | Preregistered clients only                                            |
| Public client authentication       | `none`                                                                |
| Confidential client authentication | `client_secret_basic`                                                 |
| Scope                              | `mcp:read` for the existing read-only tools                           |
| Pending authorization lifetime     | **10 minutes** by default                                             |
| Authorization code lifetime        | **60 seconds** by default; one use                                    |
| Access token lifetime              | **15 minutes** by default; opaque MCP-specific token                  |
| Refresh                            | None; start a new authorization after access-token expiry             |
| Consent                            | Explicit approve/deny on every request; no remembered consent         |

Dynamic registration and Client ID Metadata Documents are not part of this profile. A client that requires either cannot be assumed compatible; arrange preregistration before attempting the flow. No `refresh_token` grant or `offline_access` is advertised. An ordinary Cabloy login JWT, temporary token or browser cookie is not an MCP access token. Configured TTL values and OAuth `expires_in` use seconds; an `expiresAt` timestamp uses epoch milliseconds.

## Endpoints and registration

The initial endpoint paths are:

| Purpose                                   | Path                                        |
| ----------------------------------------- | ------------------------------------------- |
| Begin browser authorization               | `/mcp/auth`                                 |
| Exchange a code                           | `/mcp/token`                                |
| Authorization-server metadata             | `/.well-known/oauth-authorization-server`   |
| MCP protected-resource metadata           | `/.well-known/oauth-protected-resource/mcp` |
| Shared MCP resource                       | `/mcp`                                      |
| Consent page inside the selected SSR Site | `/cabloy/mcp/consent`                       |

Use the configured public issuer, canonical resource and metadata, not a guessed host/port. The AS issuer is an HTTPS origin without a path, and its canonical `/mcp` resource must have that same origin. This first integrated profile allows one unique resource/instance mapping per host; all AS routes use that exact registered host binding. Cross-origin AS/resource federation is not supported. The consent URL receives the selected Site's public-path prefix through its normal page-path helper; the canonical page path is not a separate OAuth redirect registration.

Before using the flow, the operator must register:

- A trusted public issuer and canonical `/mcp` resource mapped to one enabled Vona instance.
- The client's ID and display name, exact callback URI allowlist, permitted resources and client-authentication method.
- For a confidential client, the server-side secret verifier and the corresponding secret held by that client; never expose either through browser page data or metadata.
- An enabled SSR Site whose built flavor contains the shared consent page and whose normal role admission permits the intended user.

Missing or inconsistent registration fails closed. An arbitrary Host header, instance selector, tool argument or token value cannot establish OAuth resource/instance authority. Client registration does not grant local Cabloy roles or bypass data scope.

The configuration owner is `config.modules['mcp-auth']`. The following illustrates its agreed shape only; **it is not a provisioned or verified deployment**. Replace the instance placeholder with an already configured, enabled instance and preregister the actual client/callback before use. Do not paste example identities into a live installation.

```ts
config.modules['mcp-auth'] = {
  issuer: 'https://mcp.example.com',
  resources: [
    {
      resource: 'https://mcp.example.com/mcp',
      instanceName: 'YOUR_EXISTING_INSTANCE_NAME',
    },
  ],
  clients: [
    {
      clientId: 'example-public-client',
      name: 'Example public client',
      redirectUris: ['https://client.example.com/oauth/callback'],
      authentication: 'none',
      resources: ['https://mcp.example.com/mcp'],
    },
  ],
  pendingTtl: 600,
  codeTtl: 60,
  tokenTtl: 900,
  allowLoopbackHttp: false,
};
```

Each client has `clientId`, `name`, `redirectUris`, `authentication` and permitted `resources`. A confidential registration uses `authentication: 'client_secret_basic'` and `secretSha256`, the SHA-256 verifier of its client secret; the client keeps the original secret for HTTP Basic. Never substitute an ordinary login token or publish a real secret/verifier in documentation, browser configuration or retained evidence.

Defaults contain no issuer/resource/client registrations and fail closed; a module being present does not provision them. TTL fields are seconds. `allowLoopbackHttp` defaults to `false`; explicitly enabling it is a development/test loopback-HTTP exception only, not general HTTP support, cross-origin federation or permission to expose the fixture publicly. The configuration example does not request writing deployment settings or changing environment files.

## Client and browser journey

### 1. Start a fresh authorization request

The preregistered client creates a fresh PKCE verifier and its S256 challenge, then opens `/mcp/auth` in the browser. Request parameters identify `response_type=code`, the registered `client_id`, exact registered `redirect_uri`, canonical `resource`, `scope=mcp:read`, `code_challenge` and `code_challenge_method=S256`. Keep and verify client-generated OAuth `state` for callback correlation.

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

- **No usable registration:** check the configured issuer/resource/instance and preregistered client/redirect tuple. Do not make the request Host or a client-supplied selector authoritative.
- **Consent route missing or user denied by the selected Site:** verify the shared route is included in that Site's paired built artifacts and that ordinary Site-role admission is appropriate. The backend intentionally does not capability-probe or select a more permissive Site.
- **Login does not return to consent:** preserve the exact internal pending URL through the existing login flow; do not substitute the OAuth callback or add another cookie/bridge.
- **Consent API calls reach the wrong origin:** inspect explicit Site/module API-origin overrides first. Vona integrated SSR normally supplies runtime API origins; see [Runtime API origins](../../../../../repo-docs/fullstack/ssr-entry-modes.md#runtime-api-origins-in-vona-integrated-ssr). Do not edit environment values merely to match an isolated test listener.
- **Decision rejected:** check current login/account state, request lifetime and trusted origin. Do not replace an authenticated POST with a GET or introduce CSRF bootstrap to bypass the normal client chain.
- **Code exchange rejected:** check exact redirect/client/resource binding, the original verifier, expiry and previous use. Reauthorize instead of replaying or recovering a credential.
- **MCP access denied:** distinguish token/scope failure from current local authorization. A valid token does not create a local role or a cross-instance entitlement.

## Verification and operational limits

This profile initially targets SQLite on Vona's primary datasource and ordinary application wall-clock deadlines under a correctly maintained host clock. It does not establish cross-dialect, multi-worker, cross-host, qualified nonrollback-clock, synchronous browser-logout/token-revocation or production guarantees. Expiry and current revocation checks must not depend on background cleanup.

Implementation verification on 2026-10-23–24 established passing frontend/backend typechecks, generated consumers, all four selectable flavors' paired SSR/REST builds, reverse dependency synchronization and the docs build. The final isolated contract-generation command exited **0**. All three integrated-SSR browser scenarios passed in a managed E2E command that exited **0**: anonymous login and internal return, explicit approval with PKCE exchange and real Bearer tools, denial/terminal handling, invalid registration/locator handling, and neutral SSR hydration.

The final managed authorization-service and ingress-guard run reported **14 passed, 0 failed**, including six service cases with real existing identity, expiry/revocation and separate-context single-winner checks. The protected shared-listener run reported **7 passed, 0 failed** after explicitly awaiting its existing shared-instance startup before fixture writes; this does not establish the precise database-error cause of earlier failures. The independent anonymous standalone run reported **8 passed, 0 failed**. Each final command exited **0**; standalone verification used its required listener-disabled mode separately from shared-listener tests.

Earlier browser, standalone and contract-generation attempts exited **1** at post-shutdown resource cleanup despite successful task output; earlier backend attempts also failed or did not complete successfully. These attempts are not passing evidence, and successful fresh reruns do not prove their retained resources were repaired or released. Retained claims and cleanup locks remain subject to the runner's ownership checks, not manual deletion or cleanup bypasses. The bounded checks above are not full legacy ATP acceptance or production release clearance. For verification workflow and resource boundaries, see [Repo Scripts](../../../../../repo-docs/reference/repo-scripts.md).

Never retain raw tokens, authorization codes, client secrets, Authorization/cookie values or complete credential-bearing callback URLs in logs, screenshots, traces or shared evidence. Do not reset development databases, alter shared ports or expose the standalone fixture to troubleshoot this flow.
