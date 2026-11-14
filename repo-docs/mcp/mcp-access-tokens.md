# Personal MCP Access Tokens

<Badge type="info" text="Basic" />

Use a personal access token when an MCP client supports a configured Bearer header but cannot complete OAuth. This is an alternative issuance method for the existing authenticated `/mcp` resource, not an anonymous endpoint or a different tool execution path. OAuth-capable clients can continue using [browser authorization](/mcp/mcp-browser-authorization).

## Create and connect

1. Sign in through the existing Cabloy Site and open **Account → Security → MCP access tokens** (`/cabloy/mcp/accessTokens`). This page is separate from **MCP authorizations** and **MCP personal scopes**.
2. Choose **Create**, enter a descriptive name and select one scope. The default is `mcp:read`; `mcp:all` permits write-capable tools only when the account already has their business permissions. An existing personal `mcp:custom:<name>` scope restricts access to its selected exact tools. Manage those definitions on the personal scopes page.
3. Set the lifetime in days. The default is **7 days**. The page converts days to seconds for the API. There is **no product maximum**: a longer positive, finite, safely representable lifetime is allowed. This does not provide a never-expiring token. OAuth access/refresh lifetime policies are unchanged.
4. Create once, then copy the token and the server-derived MCP URL from the one-time result. Store the token in the client's protected credential configuration. The application cannot reveal it again after the dialog closes or navigation clears it; create a replacement and delete an unused token if necessary.
5. Configure the client to send one header on every protected MCP request:

   ```http
   Authorization: Bearer <access-token>
   ```

   Use the displayed exact MCP URL, including `/mcp`. Do not put the token in a URL, cookie, prompt, screenshot or log. Use HTTPS outside the explicitly supported local-development exception.

The client must also support Cabloy's MCP HTTP transport and protocol framing. A token alone does not add support for stdio-only clients or incompatible transports. Once connected, follow the [connected-client query guide](/mcp/mcp-query-guide).

## List and delete

The page lists only the current user's personal tokens in the active instance, with name, scope, creation time, expiry and **active**, **expired** or **revoked** status. List responses never contain token material. Expired and revoked personal records remain visible until deleted; they are not removed by OAuth expiry cleanup.

Delete requires confirmation and invalidates subsequent authentication immediately through the shared current-state lookup, even if the signed JWT has not expired. It does not undo a tool operation already admitted. Deletion is not recoverable; create a new token to reconnect. Personal tokens have no refresh credential, renewal action or secret-recovery endpoint.

To revoke the token currently used by a connected MCP client through a prompt, see [Log out from an MCP client](/mcp/mcp-browser-authorization#log-out-from-an-mcp-client).

OAuth grants remain on the separate authorizations page. Neither management API can list, revoke or delete the other issuance kind.

## Authorization and scope changes

The token is bound to its issuing user/auth record, canonical issuer/resource and instance. Creation and every external use require a current directly assigned role with `mcpAccess: true`; see [role-level MCP admission](/mcp/mcp-browser-authorization#role-level-mcp-admission) for defaults and any-role semantics. Losing eligibility blocks creation/use but preserves listing and deletion. Restoring eligibility permits an otherwise-valid token again; delete it for permanent invalidation.

Every request reloads current account/auth/provider/role state and checks the current authorization row, nonce digest, generation and expiry. Existing tool policy, RBAC, business ownership and data scope still apply; neither `mcp:all` nor a custom scope grants missing permissions.

A custom token captures its exact tool ceiling at issuance and requires a currently owned, valid definition and currently authorized tools. Renaming, changing the selected tools or deleting that definition invalidates linked tokens; a description-only edit does not. Expanding a definition cannot silently expand an already-issued token.

Personal creation signs only an MCP access JWT and does not replace the browser login or issue an MCP refresh token. Personal credentials are rejected by OAuth code/refresh issuance and cannot become ordinary login credentials. The server stores only the nonce digest, never a recoverable copy of the signed token. Do not automatically retry creation after an uncertain response: check the list and remove an unused record before deliberately creating another.

## API ownership

The authenticated personal API is owned by `mcp-auth`:

| Operation              | Endpoint                                          |
| ---------------------- | ------------------------------------------------- |
| List own safe metadata | `GET /api/mcp/auth/accessToken/mine`              |
| Create once            | `POST /api/mcp/auth/accessToken/createMine`       |
| Delete own token       | `DELETE /api/mcp/auth/accessToken/deleteMine/:id` |

Create accepts `name`, optional `scope` and optional positive integer `expiresIn` (seconds). Identity, auth, resource and instance are derived by the server, not accepted as client-selected controls. Responses use `Cache-Control: no-store`. The frontend consumes regenerated DTO/OpenAPI contracts; secret-bearing create results are kept out of query persistence and SSR transfer.
