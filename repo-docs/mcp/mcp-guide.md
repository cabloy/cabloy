# MCP Integration Guide

<Badge type="info" text="Basic" />

Cabloy Basic exposes existing Vona Controller Actions as Model Context Protocol (MCP) tools through the `cabloy-mcp` suite. Tools reuse the Action's DTOs, validation, serialization and business authorization rather than defining a second business API.

The reusable [`@Mcp.tool()` metadata](/backend/openapi-guide#mcp-tool-metadata) lives in `vona-module-a-openapiutils`. The decorator alone does not start a server or provide authentication; `cabloy-mcp` supplies the runtime integration described here. Do not assume another edition includes the same suite, frontend pages or launcher commands.

## Choose a guide

- [MCP Controller Tools](/mcp/mcp-controller-tools): opt Actions in, map arguments and results, inspect diagnostics, and follow the Student read/write examples.
- [MCP Browser Authorization](/mcp/mcp-browser-authorization): connect a client through registration, existing login, explicit consent, PKCE, MCP tokens and personal scopes.
- [Local MCP Test Catalog](/mcp/mcp-commerce-local): try an independent, anonymous loopback endpoint with three synthetic read-only tools. It is not the normal authenticated endpoint.

## Runtime ownership

| Component             | Responsibility                                                                      |
| --------------------- | ----------------------------------------------------------------------------------- |
| `a-openapiutils`      | Reusable MCP decorators and Action contract metadata                                |
| Backend `cabloy-mcp`  | Shared `/mcp`, Controller-to-tool mapping, guarded dispatch and transport lifecycle |
| Backend `mcp-auth`    | OAuth registration, authorization state, personal scopes, codes and tokens          |
| Frontend `cabloy-mcp` | Consent page and personal scope management within existing SSR Sites                |
| Backend `mcp-test`    | Dev/test-only synthetic catalog and standalone launcher support                     |

## Shared endpoint and tool admission

The normal endpoint is **authenticated shared `/mcp`**, served on Vona's existing listener. Recognized dev/test/prod modes use the same OAuth, business-authorization and instance boundary. Production requires an explicit trusted public `server.serve.protocol`/`host` pair. Unknown modes, not-ready, closing, disabled state and invalid required authority configuration fail closed. The integration is enabled by default; only literal `CABLOY_MCP_ENABLED=false` disables its environment-derived default. Ordinary application configuration overrides remain supported.

A tool must satisfy every construction requirement:

1. Its Controller is enabled and its Action has a registered route.
2. It passes the server-owned `includeTool` predicate, when supplied.
3. It has its own Action-level `@Mcp.tool(options)` metadata; empty options still opt in.
4. Its request/response contract is supported by the mapper.

A Resource declaration is not required. Module capability and Controller `meta.mode` filtering already occur during startup; MCP does not repeat them. Loaded test or synthetic Controllers can contribute tools if they satisfy the same predicate. The standalone launcher composes exactly three `commerce_*` fixtures. Shared construction is independent: those Actions can also appear when `mcp-test` is active and they satisfy the same admission requirements. Their presence does not make shared `/mcp` anonymous.

Undecorated Actions, including future additions, are closed before names, collisions, contract/schema extraction and diagnostics. Only Action-level decoration is supported; Controller-level decoration is rejected, and Controller defaults are not inherited. `Mcp.exclude` and `SymbolMcpExclude` are removed without backwards compatibility: omit the tool decorator to keep an Action closed. Unsupported opted-in Actions are omitted with server-side diagnostics, not approximated by dropping their HTTP semantics. This admission change does not change MCP wire transport or OAuth.

## Authorization is checked independently

OAuth scopes are ceilings, not business-permission grants:

- `mcp:read` permits only tools classified as read-only; other tools are hidden and known-name calls are rejected before dispatch.
- `mcp:all` permits both classifications within the admitted catalog, subject to independent business authority.
- A personal `mcp:custom:<name>` scope restricts access to exact selected tools within the original request and registered client ceiling. It never grants business permissions.

Discovery checks the current Action guards afresh and sequentially for each scope-eligible tool, without performing business reads or writes. Calls independently dispatch through the ordinary Action executor with **`innerAccess: false`**. Discovery is not a reusable grant: guards, RBAC, serialization and current-instance scope still apply, including after permission revocation.

`readOnly` must describe actual behavior. GET inference and a decorator annotation are not proof that an Action has no side effects.

## Mapping Action contracts

The mapper reuses the Action's path parameters, query, JSON body, validation and response contract.

| Action input               | MCP arguments                                                                  |
| -------------------------- | ------------------------------------------------------------------------------ |
| One object-shaped location | Flat object, such as `{ "id": "…" }`                                           |
| Multiple locations         | Grouped object, such as `{ "params": { "id": "…" }, "body": { "name": "…" } }` |
| Scalar or array body       | `{ "body": value }`                                                            |
| No arguments               | Strict empty object `{}`                                                       |

Unknown arguments and undeclared controls are rejected before dispatch. Schema-declared dates accept ISO date-time JSON strings and bind as native Dates without enabling broad request coercion. Clients cannot choose a route, method, user, instance or executor option through extra arguments.

Object responses become structured content directly. Scalar and array responses use `{ "result": value }`; declared null completion becomes `{ "result": null }`. JSON text represents the same structured object. Output is validated, never replaced with raw Action output after a validation failure.

An undefined result or a missing object resource represented by null produces safe `Resource not found`; authorization, Action and output-validation failures produce safe `Action failed`. Invalid arguments are protocol errors.

`output.pick` applies a top-level field allowlist to both the runtime result and advertised schema without changing the HTTP DTO. Projection minimizes fields; it is not anonymization or authorization. `name`, `description`, `readOnly` and `output.pick` are Action-local; see [MCP Controller Tools](/mcp/mcp-controller-tools#options-and-defaults) for defaults.

## Student read examples

When the optional training suite is active, its Student Controller contributes eight examples:

| Tools                                                     | Independent business permission | Scope ceiling           |
| --------------------------------------------------------- | ------------------------------- | ----------------------- |
| `training-student_student_select`, `_group`, `_aggregate` | Student select                  | `mcp:read` or `mcp:all` |
| `training-student_student_view`, `_summary`               | Student view                    | `mcp:read` or `mcp:all` |
| `training-student_student_create`                         | Student create                  | `mcp:all`               |
| `training-student_student_update`                         | Student update                  | `mcp:all`               |
| `training-student_student_delete`                         | Student delete                  | `mcp:all`               |

The abbreviated read names above share the `training-student_student` prefix. A personal custom scope may narrow any eligible selection further. None of these permissions implies another.

Use select to find an authorized row, then use its returned ID for view or summary if independently authorized. Select retains complete serialized rows and pagination; view retains full serialized detail; summary projects exactly six fields. Create returns an identity, while update and delete return null completion rather than a read-back resource. Follow the [complete examples](/mcp/mcp-controller-tools#example-student-create) before calling mutations.

These examples are not a catalog ceiling. Without training, Student tools disappear; other eligible Controller tools may remain. No fixture fallback is enabled.

## Mutation and operational limits

The Student mutations add no new server-side per-call confirmation gate. Client approval is not a server-verifiable grant. Create is non-idempotent; update can create or delete children; delete performs aggregate soft deletion, not root-only deletion. Soft deletion promises neither recoverability nor indefinite retention.

Aggregate writes and sequential cascades can partially complete before a later failure. Current-instance scope is not an aggregate atomicity or concurrency guarantee. No new transaction, lock, atomicity, deduplication, automatic retry or rollback-on-response-failure guarantee is supplied. Errors, timeouts, lost responses and output failures do not prove that no write occurred. **Do not automatically replay uncertain mutations.**

Dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas are not supplied for these examples. Ordinary logs are not protected audit or compliance proof. Existing per-worker bounds, actual-work settlement and shutdown drain remain; supporting production mode is not proof of a qualified deployment.

## Automated verification

MCP verification uses two complementary application startup modes. With the prerequisites from the [repository test workflow](/reference/repo-scripts) available, run both commands from the repository root:

```bash
npm run test
npm --prefix vona run test:mcp:no-listener
```

The ordinary test command uses the managed application listener, including the business HTTP tests. The no-listener command starts a separate managed test run with `SERVER_LISTEN_DISABLE=true` and explicitly selects six qualification entrypoints under the backend `cabloy-mcp` and `mcp-test` modules. They cover request boundaries, the protected SQLite registry, existing-ready composition, ingress interception, and the fixture-owned local HTTP transport. Both commands retain the managed runner's disposable-resource ownership and cleanup rules.

The SQLite, PostgreSQL, MySQL, and PostgreSQL coverage workflows require the no-listener gate separately. The ordinary coverage command retains its own report; the qualification gate does not overwrite it.

Do not move these qualification entrypoints into automatic `test/**/*.ts` discovery, disable the listener for the ordinary business HTTP tests, or toggle the shared listener between suites. Listener-absence assertions are part of the qualification contract.

`vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/qualification/transport.test.ts` is a different native transport qualification with an exact single-file managed-child requirement. It is intentionally not included in `test:mcp:no-listener`; do not replace the explicit file selection with a qualification-directory glob.

## Source reading pointers

Repository-relative locations:

- Metadata: `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/mcp.ts`
- Contract mapper: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts`
- Shared ingress: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/bean/middlewareSystem.mcp.ts`
- Transport checks: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts`
- Authenticated exchange and settlement: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTransport.ts`
- Shared admission and discovery: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/service/sharedBusinessTools.ts`
- Shutdown drain: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/monkey.ts`
