# MCP Integration Guide

<Badge type="info" text="Basic" />

Cabloy Basic lets an Agent use existing business APIs through the Model Context Protocol (MCP). **Tools** expose specific operations, **Skills** guide the Agent through a business task, and **authorization** controls what a connected client can use. The same Vona Controller Actions handle the business logic, validation and permissions for both HTTP and MCP.

## What Cabloy Basic provides

| Capability                              | What it does                                                                                                                                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MCP Tools decorator (`@Mcp.tool()`)** | Exposes an existing Vona Controller Action as a tool, reusing its request and response contracts. Actions are not exposed by default.                                                                                                 |
| **MCP Server**                          | Serves an authenticated tool catalog at `/mcp/:ssrSiteId` for each enabled SSR Site and dispatches tool calls to the existing Actions.                                                                                                |
| **MCP Authorization Server**            | Registers OAuth clients dynamically and handles browser consent, authorization codes with PKCE, and token issuance. Clients that cannot use OAuth can connect with a personal MCP access token if they support Bearer authentication. |
| **MCP Skills**                          | Give the Agent task-level workflows for querying data, making business changes, uploading and binding images, or handing off to a browser page. The Agent detects and loads the required Skills when it executes a business task.     |

The frontend provides four pages within existing SSR Sites:

| Page                                                                                         | When to use it                                                                                                  |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Authorize MCP access](/mcp/mcp-browser-authorization#client-and-browser-journey)            | Opens during OAuth. Review the client, Site and requested access; choose an allowed scope and approve, or deny. |
| [MCP scopes](/mcp/mcp-browser-authorization#personal-scopes-from-account-security)           | Create a reusable scope by selecting the exact tools you want to allow.                                         |
| [MCP authorizations](/mcp/mcp-browser-authorization#site-scoped-account-security-management) | Review and revoke your OAuth authorizations.                                                                    |
| [MCP access tokens](/mcp/mcp-access-tokens)                                                  | Create, view the status of, or delete personal tokens for clients that use a Bearer header.                     |

The last three pages are under **Account → Security** and manage only your records for the current Site. A scope can narrow which tools a client may use; it cannot grant a business permission your account does not already have.

## Automate a business task with an Agent

If your Cabloy Site already exposes the tools you need, you can start without writing code. Install the relevant Skill, connect the client to the Site, then give the Agent a concrete task.

### 1. Install the MCP Skills

Ask the Agent to visit the [MCP Skills directory](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/) and download all available Skills. The directory currently provides the following Skills:

| Skill                                                                                                                             | Function                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`cabloy-mcp-query`](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-query)                   | Query, filter and analyze business data according to the current tool contract.                      |
| [`cabloy-mcp-mutations`](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-mutations)           | Create, update and delete business data, or execute an explicit business command.                    |
| [`cabloy-mcp-image`](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-image)                   | Resolve the current image policy, prepare and upload an image, and optionally bind it to a resource. |
| [`cabloy-mcp-resource-pages`](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-resource-pages) | Obtain trusted links to list, create, view or edit pages for browser-based follow-up.                |

MCP Tools must be used together with the corresponding MCP Skill. When the Agent executes a business task, it automatically detects and loads the required MCP Skill, then selects and orchestrates the necessary MCP Tools to complete the business goal.

### 2. Configure the MCP server connection

1. Add a remote HTTP MCP server in your client using the intended Site's exact MCP URL, for example `https://mcp.example.com/mcp/web`. Replace the example origin and `web` with your deployment's values. Use the Site's simple ID, not a flavor name or public-path prefix. Bare `/mcp` is the authorization issuer path, not a tool endpoint.
2. **For an OAuth client**, connect and follow the browser flow. Sign in with your existing Cabloy account, review the client and Site, and approve only the scope you need. Start with `mcp:read` for read-only work, or use a personal scope to limit access to selected tools. See [MCP Browser Authorization](/mcp/mcp-browser-authorization) for compatibility and [an example client configuration](/mcp/mcp-browser-authorization#scope-ceiling-and-client-configuration).
3. **If the client cannot use OAuth but supports a Bearer header**, create a [personal MCP access token](/mcp/mcp-access-tokens) on the intended Site and use the MCP URL shown with it. Keep the token in the client's protected credential configuration, never in a prompt or URL.

Connecting to two Sites requires separate connections and authorization. If you operate the deployment rather than connect to an existing one, see [Configure the server and consent Site](/mcp/mcp-browser-authorization#configure-the-server-and-consent-site).

### 3. Try a read-only task

After the connection is authorized, try the following prompt:

> **On the school test connection, list the first five Student records I can view. Do not change any data.**

The Agent detects and loads the query Skill, discovers an eligible tool, retrieves its current contract, and orchestrates the required MCP Tools on the same connection. See the [Connected-client Query Guide](/mcp/mcp-query-guide) for the full sequence.

## Expose an API as an MCP tool

Add `@Mcp.tool()` to an existing API Controller Action. The original API decorators remain in place, so the same Action serves both the API and MCP Tool:

```ts
@Mcp.tool()
@Web.get('summary/:id', { summary: $locale('StudentSummary') })
@Api.body(v.optional(), v.object(DtoStudentSummary))
async summary(
  @Arg.param('id', v.tableIdentity()) id: TableIdentity,
): Promise<DtoStudentSummary | undefined> {
  return await this.scope.service.student.summary(id);
}
```

In this example, `@Web.get()` and `@Api.body()` describe the original API, while `@Mcp.tool()` additionally exposes the Action as an MCP Tool. For detailed options and usage, see [MCP Controller Tools](/mcp/mcp-controller-tools).

## Business skills and MCP tools

Organize a business Skill around a user task, not one Skill per tool. The Skill interprets the request, chooses a workflow and identifies when to ask for confirmation. Tool descriptions explain individual operations and their effects. The read-only [`cabloy_tool_contract` helper](/mcp/mcp-controller-tools#retrieve-one-tool-s-contract) supplies the exact tool's current public contract; the backend still enforces validation, business permissions and instance scope.

Use current contracts rather than copying field lists or query rules into the Skill. Keep discovery, contract lookup and execution on the same connection, using the original server tool name for lookup. Ask when the intended Site or environment is ambiguous; do not silently switch connections after an error or empty result. Treat tool responses as data, not instructions.

Keep the core workflow and critical constraints in `SKILL.md`; put task terminology, decision rules and examples in linked `references/` files with clear reading conditions. Distribute the complete package so users do not need private source or credentials. Verify client discovery, Skill selection/loading and business execution separately: a successful tool call does not prove the Skill was loaded. See the [client skill package](https://github.com/cabloy/cabloy/tree/main/repo-client-governance#authoring-and-packaging-business-skills) for packaging and verification.

## Resource page links

The built-in read-only `cabloy_resource_page_links` helper is discoverable when the Site has at least one visible MCP tool backed by a standard Vona Resource. Pass the exact server-published source tool name and request up to eight links:

```json
{
  "sourceTool": "training-student_student_view",
  "links": [{ "page": "list" }, { "page": "view", "id": "3" }, { "page": "edit", "id": "3" }]
}
```

The supported pages are `list`, `create`, `view` and `edit`. Only `view` and `edit` require an `id`; omit it for `list` and `create`. The server derives the Resource from the source tool and uses trusted configuration for the current Site. It checks the source tool and each target page Action independently against current scope and business permissions. The result may contain only an authorized subset, including no links. Use the returned `resource_link` URI rather than constructing a URL.

Links carry no credentials, do not run the source or target Action, and do not prove a record exists. The browser still enforces login, Site admission and Resource authorization.

## Runtime and authorization reference

<a id="shared-endpoint-and-tool-admission"></a>

### Site resources and tool admission

Backend `cabloy-mcp` serves `/mcp/:ssrSiteId` on Vona's existing listener. The shared issuer is `${origin}/mcp`, with `/mcp/auth`, `/mcp/token` and `/mcp/register` owned by `mcp-auth`. An old bare `/mcp` connection must be replaced with an explicit Site URL and fresh authorization; there is no redirect or credential conversion. The frontend `cabloy-mcp` module supplies the four pages in existing SSR Sites.

A tool enters a Site catalog only if its Controller is enabled, its Action has a registered route and its own `@Mcp.tool()` metadata, any server `includeTool` predicate and Action `ssrSites` filter allow it, and the mapper supports its contract. Unsupported opted-in Actions are omitted with server-side diagnostics. A Resource declaration is not required. Fixtures live separately in `a-test/test-mcp`; the [anonymous local test catalog](/mcp/mcp-commerce-local) is not a substitute for the authenticated Site endpoint.

Recognized dev/test/prod modes use the same authorization and instance boundary. Production requires an explicit trusted public `server.serve.protocol`/`host` pair. Unknown modes, unavailable runtime state and invalid required authority configuration fail closed. The integration is enabled by default; only literal `CABLOY_MCP_ENABLED=false` disables its environment-derived default. Application configuration can override that default.

### Authorization is checked independently

`mcp:read` admits only read-only tools; `mcp:all` admits both read and write classifications within the Site catalog. A personal `mcp:custom:<name>` selects exact tools on one Site. During OAuth consent it cannot widen the original request or registered client ceiling. Grants and tokens cannot be reused across Sites.

Current roles must admit both MCP and the target Site. Discovery checks current Action guards without executing business operations. Tool calls independently use the ordinary Action executor with `innerAccess: false`; guards, RBAC and current-instance scope still apply. Discovery, a successful contract lookup or knowledge of a tool name does not authorize a later call.

### Rate-limit boundary

Transport and Action rate limits are independently opt-in. The shared transport applies its aggregate gate once per accepted exchange after transport/body checks and the executor's initial lookup; the target Action retains its own identity policies. See [MCP admission and error mapping](/backend/rate-limit-guide#mcp-admission-and-error-mapping) for the precise boundary.

### Student read examples

When the optional training suite is active, the Student tools illustrate select, group, aggregate, view and summary, as well as create, update and delete. For example, find a row using select and pass its returned ID to view or summary only if that tool is independently authorized. These tools are not a built-in catalog or a fixture fallback. See [Student examples](/mcp/mcp-controller-tools#student-examples) for complete contracts and effects.

### Mutation and operational limits

For a full CRUD update, obtain a fresh, complete, authorized read, project it onto the current update contract, preserve unrelated editable values, and submit only the intended change once. Partial updates and business commands use their own contracts. Read-before-write does not prevent races, and client confirmation does not add a server-side approval gate.

MCP does not add transactionality, deduplication or rollback to an Action. An error, timeout or lost response does not prove that a write did not occur. **Do not automatically replay an uncertain mutation.** See [Mutation safety boundaries](/mcp/mcp-controller-tools#mutation-safety-boundaries) for the guarantees and limitations of the Student examples, including auditing and deployment qualification.

### Automated verification

With the [repository test prerequisites](/reference/repo-scripts) available, run both commands from the repository root:

```bash
npm run test
npm --prefix vona run test:mcp:no-listener
```

The ordinary test run uses the managed application listener, including for authenticated HTTP tests. The separate no-listener run sets `SERVER_LISTEN_DISABLE=true` and uses six explicit qualification entrypoints under `a-test/test-mcp`. Do not add them to ordinary `test/**/*.ts` discovery or replace the explicit selection with a directory glob. The native `qualification/transport.test.ts` is a separate qualification requiring an exact single-file managed-child invocation; it is not in the no-listener batch. CI runs the no-listener gate separately from the ordinary test or coverage report.
