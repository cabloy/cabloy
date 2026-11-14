# MCP Browser Authorization

<Badge type="info" text="Basic" />

This guide explains how an MCP client connects to Cabloy Basic's authenticated `/mcp/:ssrSiteId` resources, such as `/mcp/commerce` and `/mcp/web`. The authorization server uses RFC 7591 Dynamic Client Registration (DCR), existing Cabloy login, explicit consent and authorization code exchange with PKCE. Static OAuth client registrations are not supported. Clients that cannot perform OAuth but can send a Bearer header may instead use [personal MCP access tokens](/mcp/mcp-access-tokens), managed separately under Account → Security.

Read [MCP Integration Guide](/mcp/mcp-guide) for endpoint ownership and admission, and [MCP Controller Tools](/mcp/mcp-controller-tools) for Action mapping and business examples. The [independent local test launcher](/mcp/mcp-commerce-local) is anonymous and rejects credentials; do not send OAuth tokens to it.

## Connected journey

```text
MCP client → /mcp/register → /mcp/auth with resource=/mcp/<ssrSiteId>
           → resource's SSR Site → consent page → existing login, if needed
           → explicit approve or deny → registered client callback
           → /mcp/token with same resource → Bearer-authenticated /mcp/<ssrSiteId>
```

Backend `mcp-auth` owns client registrations, authorization state, personal scopes, decisions, codes and tokens. Backend `cabloy-mcp` owns the Site resources and their transport lifecycle. The consent page and personal scope management belong to Zova's `cabloy-mcp` module within existing SSR Sites; they are not a separate management console or SSR Site.

## Supported profile

| Item                               | Boundary                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| Grant                              | Authorization code with PKCE **S256**; refresh when explicitly registered                      |
| Client registration                | RFC 7591 DCR only, available with the existing AS/MCP ingress                                  |
| Public client authentication       | `none`                                                                                         |
| Confidential client authentication | `client_secret_basic`                                                                          |
| Scopes                             | Registered `mcp:all`/`mcp:read` ceilings; consent may narrow to a personal `mcp:custom:<name>` |
| Pending authorization lifetime     | **10 minutes** by default                                                                      |
| Authorization code lifetime        | **60 seconds** by default; one use                                                             |
| Access token lifetime              | **7200 seconds (2 hours)** by default; MCP-specific JWT                                        |
| Refresh window                     | **7 days** from issuance or each successful refresh by default; no absolute cap                |
| Refresh rotation                   | Each successful use rotates the pair; older-generation replay revokes the family               |
| Consent                            | Explicit approve/deny on each new authorization; no remembered consent                         |

Ordinary Cabloy login, refresh, temporary and OAuth credentials are not MCP tokens, and MCP credentials cannot become ordinary login credentials. Configured TTL values and OAuth `expires_in` use seconds; an `expiresAt` timestamp uses epoch milliseconds.

Shared/role/nested scopes, a generalized scope policy engine, Client ID Metadata Documents (CIMD), remembered consent, management UI beyond personal scopes/authorizations/access tokens, public registration update/delete endpoints and `offline_access` are not supported.

## Endpoints and authority

| Purpose                                   | Path                                                   |
| ----------------------------------------- | ------------------------------------------------------ |
| Begin browser authorization               | `/mcp/auth`                                            |
| Exchange a code or refresh token          | `/mcp/token`                                           |
| Dynamic client registration               | `/mcp/register`                                        |
| Authorization-server metadata             | `/.well-known/oauth-authorization-server/mcp`          |
| MCP protected-resource metadata           | `/.well-known/oauth-protected-resource/mcp/:ssrSiteId` |
| Site MCP resource                         | `/mcp/:ssrSiteId`                                      |
| Consent page inside the selected SSR Site | `/cabloy/mcp/consent`                                  |

The shared authorization-server issuer is exactly **`${origin}/mcp`**. Each protected resource is exactly **`${origin}/mcp/${ssrSiteId}`**, for example `https://mcp.example.com/mcp/commerce` or `https://mcp.example.com/mcp/web`. These resources share the issuer, not credentials or tool catalogs. Site IDs are simple registered IDs, not flavor names, public-path prefixes or bean selectors. Protected-resource metadata and the Bearer challenge identify that exact Site resource; authorization-server metadata remains at `/.well-known/oauth-authorization-server/mcp`.

Bare `/mcp` and the old unsuffixed protected-resource metadata path are not compatibility entrypoints. There is no default-Site fallback, redirect or conversion of old grants, personal scopes or tokens. Reconfigure the client and obtain new Site-bound authorization. `getMcpIssuer(...)` obtains `origin` through `app.util.getAbsoluteUrl()`: `AppUtil` uses the current context's effective `server.serve.protocol` and `server.serve.host` when present, otherwise root config, not `config.modules['mcp-auth']`. MCP URL validation still enforces the supported scheme, loopback-HTTP policy and exact origin shape.

Production requires the explicit trusted public serve pair (`SERVER_SERVE_PROTOCOL` / `SERVER_SERVE_HOST`); each empty effective field throws even when a request origin is available. In `dev/test`, each field resolves from configured value, then request context, then the requestless `http` and `localhost:<SERVER_LISTEN_PORT>` fallback (or `localhost` without a port). Raw ingress does not create a context for origin resolution: without an ambient context, `AppUtil` uses configured values or the requestless fallback. It validates the single incoming Host against the resolved authority rather than adopting it as authority. Once configured or issued, authority bindings remain exact: `localhost` and `127.0.0.1` are not interchangeable; keep the same scheme, host and port throughout registration, authorization and token use. Production Host validation against configured authority is unchanged. Ingress reuses existing automatic instance routing in a fresh selector-free context. Authorization-server endpoints reject instance selectors. Site resources `/mcp/:ssrSiteId` permit recognized singleton selectors only when they equal the server-derived instance, then strip them before dispatch; mismatches are rejected. Selectors cannot establish or change instance authority. Registered SSR Sites establish the resource boundary; there is no separate authored MCP resource/instance registry or cross-origin AS/resource federation.

Recognized dev/test/prod modes use the same authenticated, permission-checked boundary. Unknown modes, not-ready, closing, disabled state and invalid required authority configuration fail closed. The resource integration is enabled by default; only literal `CABLOY_MCP_ENABLED=false` disables its environment-derived default, while ordinary application overrides remain supported. This resource gate does not itself disable `mcp-auth` registration, authorization, token exchange or authorization-server discovery; those endpoints enforce their own readiness, shutdown and authority/configuration checks.

## Role-level MCP admission

External MCP access requires at least one of the user's **current, directly assigned roles** to have `mcpAccess: true`. New ordinary roles default to `false`; the builtin `registeredUser` and `systemAdmin` roles both initialize to `true`. This is an any-role grant: a role with `false` does not override another role's `true`, and no roles means no admission. There is no role-name-based administrator bypass.

Site-resource admission also requires the target Site in the union of the user's current directly assigned roles' `siteIds`; a permitted wildcard admits all Sites. The same role need not supply both properties: the current direct-role union must supply MCP admission **and** Site admission. The backend rechecks both rather than trusting the frontend's Site admission or a stale browser Passport. Neither property grants tools, business permissions, ownership or data access. Tool scopes and current Action guards remain authoritative after MCP admission. Public discovery and client registration do not grant user eligibility, and trusted in-process MCP factories are outside this external-channel gate.

The backend reloads current authority for consent summary/approval, authorization-code exchange, personal token creation, refresh and each external MCP request; a stale browser Passport or an already-issued credential cannot preserve eligibility. Consent approval and personal issuance fail with `access_denied` (403), code exchange/refresh with `invalid_grant` (400), and external access with `invalid_token` (401) when the current direct-role union lacks MCP or target-Site admission.

Removing the last allowing membership or disabling its `mcpAccess` blocks the next admission, not work already admitted. It suspends eligibility without automatically revoking or deleting grants: restoring eligibility permits otherwise-valid credentials again. Use the existing revoke/delete operations for permanent invalidation. Authenticated users can still deny consent and list, revoke or delete their own credentials after losing MCP eligibility.

`home-user.vonaModule.fileVersion` remains **1**; the field and builtin values are part of its current version-1 creation/initialization path. An already-applied version 1 does not replay automatically. Fresh isolated verification does not update development databases, and a no-version-bump decision does not authorize a database reset.

## Register a client

Send a direct JSON request:

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

The direct JSON response uses HTTP `201` and contains a server-issued opaque `client_id`, exact redirect URIs, canonical registered scope, and supported grant/response/authentication metadata. A confidential registration with `client_secret_basic` returns its secret only once; the server stores only its digest. Keep that secret private.

Redirect URIs must be exact HTTPS values, or HTTP for exactly `localhost`, `127.0.0.1` or `[::1]` while `allowLoopbackHttp` is true (the module default). An explicit `false` disables that exception. Lookalikes, other loopback addresses and arbitrary HTTP hosts are not allowed.

Unrecognized top-level registration metadata, including `client_uri` and client-specific extensions, is accepted and ignored: it is not persisted or echoed, and URLs in ignored metadata are not fetched. Recognized fields still require supported values. Duplicate JSON members, forwarded headers, instance selectors in the request URL or headers, query strings and oversized/malformed JSON remain rejected. Ignored body fields such as `resource`, `ssrSiteId` or `instanceName` cannot select authority: registration is bound to the shared `${origin}/mcp` issuer and server-derived instance, not one target Site resource. The body is unchanged and has no target-Site selector. Registration creates a client identity, not user authentication, a local role, Site admission, tenant access, an authorization code or a token. The later authorization request selects and validates an enabled canonical Site resource; each approved user grant and issued token is bound to exactly that resource. A client registration is not a cross-Site user grant, and a token never carries access to multiple Site resources. Explicit consent and PKCE remain required.

DCR and its metadata advertisement are available with the existing AS/MCP ingress; there is no `registration.enabled` field or separate activation step. Body/redirect limits and registration rate limiting remain in effect.

### Scope ceiling and client configuration

- **New registration:** omitted `scope` defaults to `mcp:all`. Explicit `mcp:all` and `mcp:read` are supported. Either ordering of the space-separated list containing both canonicalizes to `mcp:all`.
- **Authorization:** omitted `scope` requests the registered ceiling, not an unconditional all default. Consent chooses one allowed all/read/custom scope within both the original request and client ceiling; it never combines options to widen access.
- **Existing read grants:** existing `mcp:read` registrations, grants and tokens are not promoted. Broader access requires a new `mcp:all` registration and fresh explicit authorization, not rewriting persisted bindings.
- **Local authority:** neither scope grants business permissions or cross-instance access. `mcp:read` lists/calls only tools classified read-only. `mcp:all` permits both classifications only within the admitted catalog and current business authority.

No client scope configuration is needed for the registration default. To explicitly narrow a Codex connection, use top-level `scopes` in the server's MCP configuration table, not HTTP headers:

```toml
[mcp_servers.cabloy]
url = "https://mcp.example.com/mcp/web"
scopes = ["mcp:read"]
```

To enable refresh, explicitly register `grant_types: ["authorization_code", "refresh_token"]` (either request order is accepted). The server persists and returns that canonical pair; code exchange then returns both tokens. Omitted `grant_types` or explicit `["authorization_code"]` remain code-only. Refresh-only, unrelated or duplicate grants and unsupported scopes remain invalid. Existing code-only registrations, pending grants and legacy opaque tokens are not upgraded: obtain a new pair-capable registration and fresh authorization.

### Connection names and multiple servers

Distinguish these identities when configuring a client:

| Identity                     | Example                                                    | Meaning                                                                                                            |
| ---------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Client-local connection name | `cabloy_school_prod` in `[mcp_servers.cabloy_school_prod]` | Identifies one configured connection in the client.                                                                |
| Protocol `serverInfo.name`   | `school` from `APP_NAME`                                   | Reports the configured application name, not a unique endpoint, SSR Site or instance identity.                     |
| Server-published `tool.name` | `training-student_student_select`                          | Identifies an operation within that server. A client may present it with an additional namespace or display alias. |

The Controller-tool server reports `serverInfo.name` from `app.meta.env.APP_NAME` and `serverInfo.version` from `app.meta.env.APP_VERSION`. Each value is trimmed; an absent, empty or whitespace-only value independently falls back to `cabloy-mcp-actions` or `0.1.0`, respectively. `APP_VERSION` is configured application metadata, not automatically the version in `package.json`, the negotiated MCP protocol version or a tool contract version. These values need not distinguish production from test or separate SSR Sites sharing one backend. They do not rename the client's connection or tool namespace, change authorization or data scope, or guarantee that a client exposes this information to the Agent. Keep them suitable for client-visible metadata, without credentials or sensitive identifiers.

The `cabloy` connection name in the scope example is illustrative, not required. For multiple connections, prefer `cabloy_<business-or-site>_<environment>`, such as `cabloy_school_prod`, `cabloy_school_test` and `cabloy_store_prod`. Use distinct names within the client's configuration namespace, prioritize business/environment clarity, and keep names stable, short and free of credentials or sensitive identifiers. Lowercase ASCII letters, digits and underscores are a conservative convention, not a complete Codex or MCP name-validation specification; follow the client's supported syntax.

A `cabloy_` prefix can help people and, where the client exposes it, an Agent recognize the source. It is optional branding, not a capability test, automatic skill trigger or authorization rule. Skills must not require that prefix. Tool namespace/display behavior is client-specific; do not assume a universal prefix format or mechanically strip one to recover a server tool name.

A connection name is only a label: `prod`, `test` or `readonly` does not establish the effective environment or permissions. Renaming it does not change the endpoint, OAuth resource, server-owned instance routing or resource-bound consent Site. Configure the endpoint with the intended Site resource; the server derives the corresponding consent Site. Distinct SSR Sites have distinct `/mcp/:ssrSiteId` resources even when they share one backend, issuer and instance. Use separate connections and authorization for `/mcp/commerce` and `/mcp/web` when both are needed; never reuse a token across them. Two frontend URLs that resolve to the same Site ID do not create additional resources. Decide using the actual Site resource and instance/data scope, not website labels alone.

For each operation, resolve the user's intended business/site and environment using the client's available connection information and current tool descriptions. A name is a selection hint, not proof of identity or authority. If multiple connections still fit and the target is unclear, ask before sending business arguments or reading rows; do not query every server to guess the intended target.

Keep the selected connection and original server tool name together throughout discovery, contract lookup and execution. Multiple deployments can publish the same `serverInfo.name`, business tool names and `cabloy_tool_contract`; identical names do not imply the same data, contract or permissions. Call the helper on the selected connection and pass only the original tool name in its `tool` argument, without a client connection prefix or extra server selector. Execute the business tool on that same connection. Do not reuse another connection's contract or silently switch after a denial, missing tool, empty result or transport failure. If the user explicitly chooses a different target, discover and retrieve its contract afresh, and keep results attributed to their source rather than silently merging environments.

The [client query skill](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-query) follows this same-connection rule without depending on a particular client alias.

### Native client compatibility

DCR accepts an omitted `application_type` or exactly `application_type: "native"` as a request-only compatibility hint. It is validated and discarded, not persisted or echoed. Other values, including `web`, null, wrong types, case and whitespace variants, remain invalid. This does not introduce OIDC application-type semantics or implement semantics for ignored registration metadata. Exact redirects, client authentication, scopes and PKCE remain required.

### Personal scopes from account security

1. Sign in and open **Account → Security → Personal MCP scopes**. This opens the current Site's `/cabloy/mcp/scopes` page through normal protected navigation, not a new Site or OAuth callback.
2. Create a preset with a name, description and exact selected tools from this Site's catalog. Review each tool's read/write classification. The trimmed name must contain 1–100 ASCII characters from `A–Z`, `a–z`, `0–9`, `_` and `-`; case is preserved. Entering `test` produces exactly `mcp:custom:test`, without a random suffix. The trimmed name is unique within your user, active instance and Site resource; another Site or user may use the same name safely. The identifier text alone is not a cross-Site binding.
3. During fresh authorization, choose **one** allowed all/read/personal-custom option. A read request cannot approve a preset containing a write. An option with unavailable tools or outside the original request or registered ceiling cannot be approved.

A preset belongs to one canonical Site resource and stores exact tool identities/names, not a wildcard, category or expanding query. Newly exposed tools do not join it automatically. Both `tools/list` and direct known-name `tools/call` enforce the same selection. Selected tools still require current business permissions, ownership and instance scope; selection does not promise access to every record.

Code and refresh token responses report the **actual effective `scope`**, possibly `mcp:custom:<name>`, rather than necessarily the original all/read request. Clients must honor it. Refresh can retain or narrow the grant, never widen it or pick up newly added preset tools.

**Editing has authorization consequences:** rename changes the scope identifier. Rename, selected-tool changes or deletion revoke codes, access tokens and refresh tokens linked through either the old effective scope or old requested scope, including grants narrowed from a custom request to another effective scope. Affected clients need fresh browser authorization; refresh cannot recover the old grant. Description-only edits preserve grants.

Before login, custom validation checks syntax only. Authenticated resolution checks ownership and active instance and requires the stored identifier to match its name-derived value. Old random/noncanonical identifiers are rejected, not accepted as aliases. There is no automatic identifier migration or database reset. DCR and public discovery expose only built-in all/read ceilings, not personal presets.

### Site-scoped Account Security management

Personal scopes, OAuth authorizations and personal access tokens are managed within the current Site resource, current user and active instance. Their management APIs require the `ssrSiteId` query parameter; the UI supplies the current runtime `sys.env.SITE_ID`. The UI does not choose an unrelated Site or infer a Site from the page URL. A definition, grant or token from `/mcp/commerce` does not appear as a `/mcp/web` record or become mutable through a Web request just because its ID or scope name is known. Listing, revocation and deletion remain available to the owner after MCP eligibility is lost; issuing or exercising authority requires current admission.

## Configure the server and consent Site

Before using the flow, ensure:

- The effective serve pair establishes authority; in `dev/test` only, unset fields may use the validated request origin or requestless fallback described above. Keep the resulting origin exact throughout the flow. Do not author `mcp-auth.issuer` or `mcp-auth.resources`.
- Automatic instance routing resolves an enabled instance after Host validation, without client selectors.
- Each intended resource's enabled SSR Site has a built flavor containing the shared consent page, and the current direct-role union permits both MCP access and that Site.
- Registration limits and an operational policy for AS-owned client records are appropriate.
- Callback URIs are registered exactly, and confidential client secrets are kept out of browser state, URLs, logs and metadata.

Illustrative configuration, **not a provisioned or verified deployment**:

```ts
config.server.serve.protocol = 'https';
config.server.serve.host = 'mcp.example.com';
// Shared issuer: https://mcp.example.com/mcp.
// Site resources: https://mcp.example.com/mcp/commerce and .../mcp/web.
config.modules['mcp-auth'] = {
  registration: {
    maxBodyBytes: 16384,
    maxRedirectUris: 16,
    rateLimit: 10,
    rateLimitWindow: 600,
  },
  pendingTtl: 600,
  codeTtl: 60,
  tokenTtl: 7200,
  refreshTokenTtl: 7 * 24 * 60 * 60,
  allowLoopbackHttp: true,
};
```

The requested resource selects its consent Site: `/mcp/commerce` uses the `commerce` SSR Site, and `/mcp/web` uses `web`. `MCP_AUTH_SSR_SITE` and `config.modules['mcp-auth'].ssrSite` are removed, without compatibility. There is no shortest-`publicPath` default, alternate-Site fallback, route-capability probe or role bypass. An unknown, disabled or unavailable Site fails closed. Include the shared consent page in every intended flavor. The normal page-path helper adds the resource Site's own public-path prefix; its runtime `SITE_ID` must match the pending authorization's Site.

### Existing databases and authority changes

`mcp-auth` currently keeps `vonaModule.fileVersion: 1`. Its current version-1 schema includes resource-scoped personal scopes, shared-issuer client registrations (`issuer`, replacing the old client `resource` binding), requested/effective grant scopes, refresh grant fields and personal access-token issuance/name fields with nullable OAuth client bindings. Editing that path does not replay an already-applied version 1: an existing v1 database needs a separately approved upgrade or disposable-data strategy. Fresh isolated tests initialize the current schema; they do not upgrade a development database. `npm run db:reset` is destructive and requires explicit approval, never an automatic troubleshooting step.

Old origin-only issuer values differ from the exact `${origin}/mcp` issuer, and the former shared `${origin}/mcp` resource differs from every new Site resource. Old client bindings, unscoped personal definitions, grants, codes and tokens are not migrated or accepted as aliases. Obtain a new registration where required, recreate Site-scoped definitions and authorize or issue a new Site-bound credential. Do not rewrite records, relax matching or reset a database to preserve old authority.

## Client and browser journey

### 1. Start a fresh authorization request

After DCR, create a fresh PKCE verifier and S256 challenge, then open `/mcp/auth`. Parameters identify `response_type=code`, the issued `client_id`, exact registered `redirect_uri`, exact Site `resource` (for example `https://mcp.example.com/mcp/commerce`, not the shared issuer), optional `scope`, `code_challenge` and `code_challenge_method=S256`. Omit scope to inherit the client ceiling, or request `mcp:read` to narrow an all registration. Keep and verify client-generated OAuth `state` for callback correlation.

The server validates client, redirect, resource, scope, instance and PKCE before redirecting toward a client callback, including error callbacks. Malformed/duplicate parameters and mismatched bindings are rejected.

### 2. Reuse the existing login

The selected Site presents `/cabloy/mcp/consent?request=…`. Its protected-page guard sends an anonymous user through normal Cabloy login and returns to that same internal pending-consent URL. The OAuth callback is **not** the login `returnTo`.

Existing SSR/browser Passport cookie support and the normal authenticated API client own identity. No new MCP cookie, holder secret, identity bridge, session system or CSRF-bootstrap step is needed. The `request` value locates pending state; possession is not authentication or approval.

The consent page uses the session SSR profile. Its model loads private summary data after the required hydration/admission boundary, keeping server HTML and the client's initial render equivalent. Authorization responses must not enter SSR state or browser query persistence.

### 3. Approve or deny explicitly

Review the application, resource and original requested scope, then choose one allowed option as described in [Personal scopes](#personal-scopes-from-account-security). The original request remains visible separately from the effective choice. Every request requires explicit approval or denial, even when signed in; the server rechecks that the selection cannot widen access.

Approve/deny is an authenticated POST, not a GET link or page-load side effect. It uses the existing backend origin check and a single-winner pending transition. This is not a claim that stock CSRF-token enforcement is enabled: the helper retains development/loopback exceptions. Do not weaken Site admission, API-origin configuration or CORS/Origin policy.

Approval returns a server-built registered callback with a one-use code and client state; denial returns an error callback without a code. The browser immediately navigates there. Do not cache, persist, log or serialize the credential-bearing response. An expired, decided or invalid request must not issue a replacement code.

### 4. Exchange once, then call MCP

Validate callback `state`, then exchange at `/mcp/token` using `grant_type=authorization_code`, the code, original `code_verifier`, canonical `resource` and **the exact authorization `redirect_uri`**. Public clients use `client_id` without a secret; confidential clients use HTTP Basic under `client_secret_basic`, never a URL secret.

A successful exchange consumes the code and activates generation 1 of the MCP JWT grant family in one committed conditional database update. A refresh-enabled grant returns both credentials; a code-only grant returns only access. Codes cannot be replayed, and a lost response does not permit credential recovery or automatic issuance retry.

Send the access token only as **one `Authorization: Bearer` header** on protected `/mcp/<ssrSiteId>` requests for that same resource, with required MCP framing/version/method headers. Do not put credentials in query parameters, cookies, proxy headers or ordinary login-token shortcuts. This resource rule does not remove normal cookies from the SSR consent page.

Each request checks current expiry, revocation, registration and account validity, then builds a fresh local Passport projection in the trusted instance. Missing/invalid bearer receives 401 with the applicable challenge; insufficient scope receives 403. Configuration/lookup failure denies before dispatch. Business guards, ownership and data scope remain authoritative.

### 5. Refresh without a new browser authorization {#5-refresh-without-a-new-browser-authorization}

A refresh-capable client posts `grant_type=refresh_token`, its current refresh token and canonical `resource` to `/mcp/token`, using the same client authentication as code exchange. Do not send code, redirect or PKCE fields. Optional scope may retain or narrow the grant, never widen it or exceed the current client ceiling. Refresh may succeed after access expiry while the family, account and client bindings remain valid.

Each successful refresh atomically replaces nonce digest and generation, advances the deadline and returns a new pair. **The old access token becomes invalid immediately**, even before JWT expiry. The default refresh window is 7 days from issuance and resets to 7 days after each successful refresh, with no absolute family lifetime cap. Ordinary access and failed refresh do not extend it. Cleanup retains refreshable grants through that deadline; revocation invalidates both credentials.

Replay of a correctly signed older refresh generation after authentication/binding checks revokes the family, including a concurrent winner's new pair. **Serialize refresh and replace both credentials together. Do not automatically retry code or refresh issuance after an uncertain/lost response.** Credentials are not recoverable, and replay can revoke the family. Expired/revoked families require fresh authorization.

Credentials bound to the old unsuffixed resource cannot be used, refreshed or upgraded into Site-bound authority. Obtain fresh authorization for the exact Site resource; JWT verification failure is not a compatibility fallback.

### Server-side refresh evidence

Two framework logger DEBUG events identify rotation and subsequent use, provided logger/transport filters admit DEBUG (the default INFO threshold does not):

- `mcp.oauth.refresh_succeeded`: rotation, pair signing and Passport attachment completed.
- `mcp.oauth.refreshed_access_accepted`: a later MCP request authenticated using a refreshed generation, not necessarily a successful tool call.

Example application-authored fields:

```json
{"event":"mcp.oauth.refresh_succeeded","family":"<same SHA-256 family correlator>","generation":2}
{"event":"mcp.oauth.refreshed_access_accepted","family":"<same SHA-256 family correlator>","generation":2}
```

The correlator hashes a domain-separated grant-binding tuple, not a token or nonce. These fields exclude raw user/client/grant IDs, credentials, codes, headers, cookies and tool arguments/results. The normal logger may add timestamp, level, bean, method/path and telemetry metadata. This is pseudonymous operational correlation, not anonymization or protected audit.

To observe refresh without changing lifetimes, make a read-only interaction, wait beyond access expiry (2 hours by default), then interact without manually reauthorizing. Matching family and generation across both events establishes server-side refresh followed by use, not client persistence or tool success. Continued usability alone is insufficient. Missing logs are inconclusive when filtered/suppressed; do not bypass logging policy, collect credentials, reset databases or replay refresh tokens to obtain evidence.

## Log out from an MCP client

Explicitly ask the connected assistant to log out of Cabloy MCP or revoke its current authorization. For example: “Log out of Cabloy MCP.” The authenticated server provides the built-in `cabloy_logout` tool for this request, including for `mcp:read` and custom scopes. It remains available even when no business Action is visible. It is an authorization self-service operation, not a selectable business Action, and does not grant access to other tools.

The tool takes no arguments. A direct MCP call can omit `arguments` or send an empty object:

```json
{ "name": "cabloy_logout", "arguments": {} }
```

Do not paste a token or specify a user, client or authorization ID. The server identifies the credential from the authenticated request. Only call the tool when the user explicitly requests logout or revocation; finishing a task alone is not a logout request. With multiple connections, select the intended server before calling it.

- **OAuth:** revokes the current authorization, including its refresh capability. A refresh token cannot restore that authorization.
- **Personal access token:** revokes the current token. [Create a replacement](/mcp/mcp-access-tokens#create-and-connect) to reconnect; personal tokens have no refresh credential.
- **Shared credentials:** every connection or conversation using the same authorization or token loses access. Independently issued authorizations and tokens remain usable.

A successful result includes `loggedOut: true`. Subsequent requests using the revoked credential fail authentication; the operation does not cancel work already admitted. Reconnect with a new OAuth authorization or a new personal access token. The tool cannot close a conversation, erase history or previously returned data, clear credentials stored by the MCP client, or sign out of the website/browser. Whether the client offers or starts a new authorization flow is client-specific.

## Business reads

Tool discovery applies the OAuth ceiling, personal selection if any, and fresh current Action guards. Calls independently reauthorize through `executor.performAction` with `innerAccess: false`; a listed tool is not a reusable grant.

With optional training active, Student select/group/aggregate require select permission, and view/summary require view permission. Neither implies the other. Create/update/delete additionally require a write-capable scope and their independent permissions. Student examples are not a shared catalog ceiling; without training, other eligible tools may remain, never fixture fallback.

For a read-only check:

1. Authorize a fresh connection, list tools, and inspect schemas. Use an existing Student the account may already view, not a disposable test identity or new seed data.
2. If separately select-authorized, call `training-student_student_select` with `{ "name": "Student", "pageNo": 1, "pageSize": 10 }` and choose a matching row's returned ID. LIKE wildcards `%` and `_` retain their usual meaning.
3. With view authority, call `training-student_student_view` and `training-student_student_summary` using `{ "id": "<returned student ID>" }`, or an already known authorized ID when select is unavailable. View retains full serialized detail; summary contains exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText`, without mobile/full notes. Structured content and JSON text must agree.
4. With a separately authorized read scope, confirm writes are absent. Do not invoke mutations merely to test discovery. Missing, excluded or unsupported Actions must not become available by knowing their names.

See [MCP Controller Tools](/mcp/mcp-controller-tools) for complete contracts, output limits, safe errors and mutation behavior. Images are existing URL presentation, not MCP image blocks or guaranteed client rendering.

## Shared Passport implementation boundary

MCP reuses Passport's auth-token lifecycle through static JWT client selection. Both `mcpAccess` and `mcpRefresh` select `authTokenAdapter: 'mcp-auth:authTokenAdapter'`; trusted server code passes those names to `createAuthToken`, `checkAuthToken` and `refreshAuthToken`. No auth provider, signin event or duplicate identity is introduced.

The adapter reloads current user, auth ownership/provider and roles. Its fixed `options: { stateless: false, strategy: 'reissue' }` retains stateful grant validation regardless of ordinary session/provider overrides. Other clients retain existing auth/session behavior.

Verification is read-only: access requires the current generation, while refresh can pass an otherwise valid older generation into reissue for replay-family revocation. For OAuth, generation 0 creation activates the grant; later generations rotate it atomically with validated resource/scope operation input. Personal issuance creates an explicitly personal, generation-1 active row and signs only the existing `mcpAccess` client; it never signs a refresh credential or replaces the browser Passport. Personal validation retains the same current-state/account/resource/instance/scope checks, excluding only inapplicable OAuth client/redirect checks. The existing authorization row is the family, storing only the current nonce digest rather than plaintext credentials or a second identity/history store.

The selected `passportAuthTokenClient` survives the MCP Passport handoff and clears with current state. Ordinary signin, refresh, temporary-token and OAuth helpers reject conversion from attached MCP authority. See [Auth Guide](/backend/auth-guide#auth-token-lifecycle-and-adapter-selection) and [JWT Guide](/backend/jwt-guide#explicit-pairs-and-scoped-passport-flows).

## Troubleshooting without weakening the boundary

- **Registration unavailable:** check effective serve configuration, exact Host/origin binding, automatic routing and ingress readiness. No static client, authored issuer/resource registry or registration switch is required.
- **Consent route missing or Site admission denied:** verify the selected Site's paired SSR/REST artifacts contain the page and ordinary role admission is appropriate. The server does not probe or choose a more permissive Site. Follow the [contract-loop workflow](/fullstack/contract-loop-playbook) when rebuilding changed frontend artifacts.
- **Login does not return to consent:** preserve the internal pending URL, not the OAuth callback; do not add another cookie or identity bridge.
- **Consent API origin mismatch:** check explicit Site/module overrides first. Vona integrated SSR normally supplies runtime API origins; see [Runtime API origins](/fullstack/ssr-entry-modes#runtime-api-origins-in-vona-integrated-ssr). Do not change environment values merely to match an isolated test listener.
- **Decision rejected:** check current identity, lifetime and trusted origin. Do not replace authenticated POST with GET or weaken origin checks.
- **Code/refresh rejected:** check exact bindings, verifier or current credential pair, expiry, revocation and scope. Reauthorize when needed; do not replay, recover or convert ordinary login credentials.
- **MCP denied:** check the exact Site resource and current direct-role union's MCP and Site admission, then distinguish credential failure from independent business authorization. A `/mcp/commerce` token cannot authenticate `/mcp/web`; tokens do not create local roles or cross-instance access.
- **503 or missing tools:** check recognized mode, enabled/ready state, shutdown, required authority, Controller/route registration, Action-level opt-in, `ssrSites`, supported contract, scope and actual Action guards. Inspect server-side `diagnostics` for unsupported opted-in contracts. The standalone launcher always composes exactly three fixtures, while shared discovery can also include their opted-in Actions when `a-test/test-mcp` is active. Each `/mcp/:ssrSiteId` resource remains authenticated and does not use a fixed three-tool catalog.

## Operational limits

The profile initially targets SQLite on Vona's primary datasource and ordinary wall-clock deadlines under a maintained host clock. It does not establish cross-dialect, multi-worker, cross-host, nonrollback-clock or synchronous browser-logout/token-revocation guarantees. Expiry/current revocation must not depend on background cleanup.

Per-worker transport bounds, actual-work settlement and shutdown drain remain active. Dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas are not supplied for the Student examples. Ordinary logs are not protected audit; production-mode support is not qualified deployment, compliance or release evidence. [Mutation limits](/mcp/mcp-guide#mutation-and-operational-limits) apply independently of browser approval.

Never retain tokens, codes, secrets, Authorization/cookie values or complete credential-bearing callback URLs in logs, screenshots, traces or shared evidence. Do not reset development databases, alter shared ports or expose the standalone fixture to troubleshoot authorization. See [Repo Scripts](/reference/repo-scripts) for managed verification and resource boundaries.
