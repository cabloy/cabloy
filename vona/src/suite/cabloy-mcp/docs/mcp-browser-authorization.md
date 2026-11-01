# MCP Browser Authorization

This guide describes Cabloy Basic's bounded browser-to-MCP authorization profile, including the approved authority/configuration simplification. RFC 7591 Dynamic Client Registration (DCR) is the only client-registration path for both public and confidential clients; it is available whenever the existing AS/MCP ingress is available, without a separate registration enablement switch. Static configuration clients are not supported. This is not a claim that a public deployment is live or production use is qualified. See [Verification and operational limits](#verification-and-operational-limits) for current focused checks, historical coverage and earlier failed-run limitations.

The connected journey is:

```text
MCP client → /mcp/auth → existing SSR Site → consent page
          → existing login, if needed → explicit approve or deny
          → registered client callback → /mcp/token → Bearer-authenticated /mcp
```

Backend `mcp-auth` in the `cabloy-mcp` suite owns OAuth authorization state, decisions, codes and tokens. Backend `cabloy-mcp` now owns normal shared `/mcp`: its `middlewareSystem.mcp.ts` delegates to `mcpTransport.ts`, `businessTransport.ts` owns authenticated exchanges and settlement, the shared business-tool service composes Resource-backed tool admission, and `monkey.ts` drains transport work on application close. `mcp-test` is not the normal endpoint owner. The consent page belongs to Zova's `cabloy-mcp` suite/module; no management console is introduced.

Normal `/mcp` accepts recognized **dev/test/prod** modes through the same authenticated, permission-checked boundary. Production is no longer rejected solely by mode. Unknown modes, not-ready, closing and disabled ingress still return 503; production also requires the explicit trusted public serve pair described below. Enabled-by-default behavior is unchanged: only the literal environment value `CABLOY_MCP_ENABLED=false` disables `cabloy-mcp`. Dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas are deferred for the four reads and individually admitted Student create, update and delete tools, not implemented capabilities or production prerequisites. Existing per-worker bounds, actual-work settlement and shutdown drain remain; no audit compliance or actual deployment qualification is claimed.

Shared construction admission accepts registered Resource controllers, not a student controller/action whitelist: `includeTool` derives the resource with `onionNameFromBeanFullName(controller)` and requires an own entry in `recordResourceNameToRoutePath`. The factory still requires an enabled registered route, explicit method/class `@Mcp.tool()` opt-in and a supported contract. Construction controls both listing and known-name direct calls; opt-in alone is not normal exposure. The seven current student actions (`create`, `select`, `lookup`, `view`, `update`, `summary` and `delete`) are examples, not a catalog ceiling. When optional `training-student` is absent, its tools disappear, but other eligible Resource tools may remain; there is no fixture fallback. The three synthetic `commerce_*` tools and anonymous standalone entry remain **`mcp-test` launcher only**, never part of normal shared `/mcp`.

For the independent anonymous, credential-rejecting standalone fixture, use [Local MCP Test Catalog](./mcp-commerce-local.md). Do not send OAuth tokens to that launcher.

## Student create, update, delete and business reads

### Student create

`training_student_create` requires `mcp:all` plus independent current student-create authority; `mcp:read` hides it and rejects known-name calls before dispatch. Create authority grants no select/view/update authority and vice versa. Discovery checks guards only, never a trial create. Calls independently authorize the existing `POST /training/student` with `innerAccess: false` in the current instance.

Arguments are the flat existing `DtoStudentCreate` body, including optional Markdown content and training records with nested subjects. The create DTO now omits writable nested subject identity/deletion controls, and MCP rejects unknown nested controls before dispatch. Schema-declared dates such as nested `trainingTime` accept ISO date-time JSON strings and bind as native Dates without enabling broad request coercion. Synthetic aggregate persistence and permission/scope/current-instance boundaries pass local authenticated HTTP regression; no actual-client create or deployment is claimed. Parent-FK checks remain, but a deeper write failure can follow partial insertion. The existing identity-only response becomes `{ "result": "<created student ID>" }` with equivalent JSON text and structured content. This is a non-idempotent persisted aggregate write: repetition can create another Student. No new server-side per-call confirmation gate, automatic retry, deduplication, rollback-on-response-failure or new atomicity guarantee is provided; an uncertain response does not prove no write occurred. Create's individual disposition defers dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas, not audit compliance. Existing read grants/tokens are not promoted; broader authorization is a separate user operation.

### Student update

**Local update regression (2026-10-30):** the complete grouped aggregate passes the separate authenticated HTTP regression, including nested creation/update/deletion, independent read-back authority, null completion and root/child ownership. The separately approved shared-reader correction permits value depth 9 (root = 1), retaining eight nested containers and all other byte/node/key/array/string/duplicate-key bounds, with passing exact edge regressions. This supersedes the earlier depth-8 qualification stop, not its retained history. Browser catalog/OAuth checks are still not browser mutation or actual-client update evidence; no deployment/release qualification follows. Do not bypass ingress or automatically replay an uncertain mutation.

`training_student_update` is one of the current student tools and is separately authorized: it requires `mcp:all` **and** independent current student-update authority. Create, select and view do not grant update; update does not grant those other actions. `mcp:read` hides update and rejects its known-name calls before dispatch. Listing checks current guards without trial writes or business reads; calling independently executes the guarded fixed `PATCH /training/student/:id` with `innerAccess: false` in the current instance.

Unlike flat create, update takes **grouped params/body arguments**:

```json
{
  "params": { "id": "<existing student ID>" },
  "body": { "name": "Student name", "mobile": "13812345678", "level": 1 }
}
```

The existing `DtoStudentUpdate` requires `body.name`, `body.mobile` and `body.level`; PATCH does not make this a partial-patch or basic-fields-only contract. The complete existing aggregate contract includes parent fields with optional `imageId`, Markdown content, and existing/new training records with nested subjects. Declared nested `id` and `deleted` controls can update and delete children, with the DTO-required business fields still required in deletion entries. This is potentially destructive behavior, not a non-destructive mutation. Caller-controlled relation parent foreign keys are omitted and undeclared controls are rejected before dispatch; existing cross-parent record/subject validation remains. Schema-declared dates bind from ISO date-time strings to native Dates without broad request coercion.

The shared service first reads the root through ordinary current-instance Model scope. Missing, deleted and out-of-instance roots are equally absent and return before content preparation or nested writes. This is a no-op, not a new not-found response or cross-instance existence probe. The pre-read is **not atomic against concurrent deletion** and adds no transaction, lock, rollback or aggregate atomicity guarantee. Later failures can leave earlier parent/content/child writes in place.

The ordinary controller's void response becomes declared null, represented as **`{ "result": null }`** in equivalent structured and JSON-text content. It acknowledges completion only, not root existence, affected rows or read-back success; absent roots yield the same null completion. A separate view requires independent view authority. Errors, lost responses and invalid responses do not prove no writes occurred. Because update can create or delete children and leave partial writes, automatic replay is unsafe; no automatic retry, deduplication or rollback-on-response-failure is supplied.

Update's individual bounded disposition explicitly adds **no new server-side per-call confirmation gate** and defers **dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas**, including its nested deletion effects. This is not inherited create approval, audit compliance, actual-client verification or deployment qualification. Existing authorization, runtime bounds, actual-work settlement and drain remain. The current student example also opts in ordinary single-record delete below; its `deleteForce` and bulk actions are not opted in. Other eligible Resource mutations are not excluded by a student-only allowlist.

### Student delete

`training_student_delete` is one of the current normal authenticated student tools. It requires **`mcp:all` and independent current student-delete permission** in the active instance. Create, update, select and view authority do not grant delete; delete grants none of them. `mcp:read` hides all three mutations and rejects their known-name calls before dispatch. Discovery checks current guards only, without row probes or trial deletion; calls independently reauthorize.

Delete takes a **flat params contract**, unlike grouped update:

```json
{ "id": "<existing student ID>" }
```

The fixed target is guarded `DELETE /training/student/:id`, with exactly `{ params: { id }, innerAccess: false }`. Existing string/number identity validation is retained; undeclared body, route, method, instance, Passport, executor and confirmation controls are rejected before dispatch. The existing void/null response becomes **`{ "result": null }`** in equivalent structured and JSON-text content. This acknowledges completion only, not root existence, affected rows, complete cascade or independently authorized read-back. Missing, deleted and out-of-instance roots return the same nondisclosing completion.

This is **destructive aggregate soft deletion** of Student, content, training records and nested subjects, not root-only deletion. Soft deletion promises neither recoverability nor indefinite retention; existing pruning may later remove rows. No attachment/blob deletion or restore capability is promised. The shared ordinary-delete service first reads the root through current-instance Model scope and returns before any cascade when it is absent. This prevents the cache-enabled requested-ID shortcut from cascading into active current-instance descendants of an absent root; it is not a cross-instance existence probe. The pre-read is **not atomic against concurrent deletion**. Existing sequential cascade can partially complete; no new transaction, lock, atomicity or rollback guarantee is added.

Delete is individually accepted **without a new server-side per-call confirmation gate**; no confirmation flag/store/UI is introduced, and client approval is not a server-verifiable grant. Dedicated protected audit, audit-delivery/outage gating and deployment-wide fine-grained/fleet quotas are explicitly deferred for this named tool, not inherited from create/update. Ordinary logs are not protected audit or compliance proof. Existing authorization, privacy, runtime bounds, actual-work settlement and drain remain. Errors, timeouts, lost responses and output/delivery failures do not prove rollback. No automatic retry, deduplication, replay-safety or new idempotency guarantee is supplied: **do not automatically replay uncertain deletion**. Student `deleteForce` and `deleteBulk` remain excluded because they are not opted in; anonymous business deletion remains excluded. This is not a blanket exclusion of other eligible Resource mutations. Local verification is separate from actual-client deletion, deployment and release qualification.

### Business reads

When `training-student` is active, the authenticated shared endpoint can list **`training_student_select`**, **`training_student_lookup`**, **`training_student_view`** and **`training_student_summary`**, independently gated by their actual Action guards. Select and lookup use student `select` permission; view and summary use student `view` permission. Neither permission implies the other: with neither, no student reads are listed; select only lists select + lookup, view only lists view + summary, and both list all four reads. Independent create authority adds create only under `mcp:all`; independent update authority separately adds update only under `mcp:all`; independent delete authority separately adds delete only under `mcp:all`. With all corresponding student business authority, `mcp:all` lists the seven student tools and `mcp:read` lists the four student reads; other eligible Resource tools may also appear. Each list first filters by the OAuth scope ceiling, then checks `checkPermissionActionGuards(derivedResource, actualAction)` afresh and sequentially for each eligible tool, without executing business reads, trial writes or student-row queries. Calls independently use ordinary `executor.performAction` with `innerAccess: false`, without reusing visibility as a grant, so revocation after listing still denies a known-name call.

Select accepts the existing flat filter/query arguments, including pagination, and returns the complete existing serialized `DtoStudentSelectRes`: `list`, string `total`, `pageNo`, `pageSize` and `pageCount`, with existing row fields, optional image resolution and masked mobile. It does not add detail joins or become an unbounded export. Lookup retains its narrower current-instance result of student ID, name and level.

View accepts only `{ "id": "<existing student ID>" }` and invokes the existing guarded `GET /training/student/:id` Action with `innerAccess: false`. It retains student-view RBAC, the optional `DtoStudentView`, serializer and ordinary instance-scoped service. The complete serialized detail includes full `content.descriptionMarkdown`, `trainingRecords` with nested `trainingRecordSubjects`, optional `image` URL presentation and masked mobile. This is intentional full-view disclosure under existing view authority, not an expansion of select/lookup/summary. The image remains an optional URL presentation object, not an MCP image block or UI resource; neither URL reachability nor client rendering of Markdown, images or expandable details is guaranteed.

Summary accepts only `{ "id": "<existing student ID>" }` and invokes the existing guarded `GET /training/student/summary/:id` Action. It retains inherited student-view RBAC and its six-field `output.pick`: exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength` and `summaryText`. Mobile and full Markdown/HTML notes remain absent from summary's advertised schema and result. This is field minimization, not anonymization: the name and summary remain business data.

All four reads retain the current authenticated user, serializer and instance boundary through ordinary Action execution with `innerAccess: false`; none becomes owner-only self-service. OAuth scopes are ceilings, not grants: neither `mcp:all` nor `mcp:read` grants student permission. Validated JSON text and structured content represent the same result. Missing detail records, including records outside the current instance, produce a safe not-found tool result; denied or failed reads return a generic failure without exception details. Invalid arguments are protocol errors. Clients cannot supply routes, methods, credentials, instance/user selectors or executor options.

The shared endpoint maps enabled, supported and explicitly opted-in Actions of registered Resource controllers, rather than using a student-specific adapter or unrestricted decorator discovery. Existing HTTP DTOs and permissions stay unchanged. Without the training module, student tools disappear, but other eligible Resource tools may remain. Nonresource fixtures remain excluded. The independent anonymous launcher always retains exactly its three synthetic fixtures and does not use the mapper or expose these business tools. See [MCP Controller Tools](./mcp-controller-tools.md) for class/method opt-in, construction admission, contract mapping and diagnostics.

For a manual check of the mapper-backed shared endpoint:

1. Use a freshly authorized shared-server connection and an existing student that the signed-in account may already view. List tools: the four admitted student reads appear according to the select + lookup and view + summary permission pairs above; create, update and delete may additionally appear with `mcp:all` and their independent business authorities. This manual procedure remains read-only; do not call any mutation. Confirm view's existing detail schema and summary's six-field schema for a view-authorized account. If select is also authorized, select or lookup may supply an ID; do not assume either permission grants the other. Do not use a disposable automated-test ID or create seed data merely for this check.
2. Call view and summary with `{ "id": "<existing student ID>" }`. Compare view with the ordinary serialized HTTP detail, including any existing Markdown and nested records/subjects, optional image presentation and masked mobile; do not infer visual rendering or URL reachability. Summary must retain exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText`, with no mobile or full notes in its schema definitions or result. JSON text and structured content must agree for each read.
3. With a separately authorized `mcp:read` connection, confirm the same permission-eligible student read surface. Student create, update and delete must be absent under `mcp:read`; `mcp:all` additionally permits each only with its independent business authority. Other eligible Resource tools may appear under the same rules. Nonresource fixture and other non-admitted tool names must be absent and unavailable to direct calls under either scope; do not execute business writes or use the three-tool commerce journey as this endpoint's expected result. An absent training module removes student tools, not necessarily all tools, and never enables fixture fallback.
4. If an expected tool is missing, check module availability, Resource registration, enabled route, method/class opt-in, scope and its actual Action authority, then inspect the factory server's `diagnostics` (`controller`, `action`, `reason`) on the server side for unsupported contracts. Non-admitted actions are never constructed and need not have diagnostics. Diagnostic details are not client errors. A business permission error is not a reason to bypass RBAC or grant a role.

**Historical revision boundary:** the reports in the next two paragraphs predate normal ingress ownership moving from `mcp-test` to `cabloy-mcp` and the exact lookup/summary construction allowlist. Their shared commerce calls describe the earlier revision, not current endpoint instructions or qualification of the migrated owner. This procedure includes checks beyond the reported happy path. The [earlier automated qualification](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#student-summary-business-tool-automated-qualification-2026-10-25) and historical real-client report below predate replacement of the student-specific adapter and do not revalidate the mapper. In a [separate subsequent Codex replay](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#user-reported-codex-generic-mapper-replay-success-recorded-2026-10-25), the user reported all four mapper-backed reads successful in order: category → search → detail with matching identities and actual `priceCents = 9999`, `available = 11`, then student summary with matching input identity, exactly six fields, consistent summary and no mobile/full notes. No retries or permission changes were reported. This passes the bounded user-reported replacement happy path, not independent served-source attestation, schema/text-versus-structured inspection, negative-scope coverage, production readiness or full ATP closure.

On 2026-10-25, before that replacement, the user reported Codex server `test` discovered this tool and invoked `mcp__test__training_student_summary` successfully. The returned ID matched the input, the result contained exactly the six fields, and mobile/full notes were absent. They reported no writes or role-permission changes. This passed the bounded real-client happy path for the earlier integration; the [retained acceptance record](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#user-reported-codex-student-summary-success-recorded-2026-10-25) omits raw student name/ID and keeps exact scope, version and served-source attribution unknown. The mapper-backed replacement has not been revalidated by that historical report. Earlier negative authorization and instance-isolation checks remain automated historical coverage, not proof for this replacement, production readiness or full ATP closure.

## Supported first profile

| Item                               | Boundary                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Grant                              | Authorization code with PKCE **S256**; refresh when explicitly registered        |
| Client registration                | RFC 7591 DCR only; available with the existing AS/MCP ingress                    |
| Public client authentication       | `none`                                                                           |
| Confidential client authentication | `client_secret_basic`                                                            |
| Scopes                             | `mcp:all` (new-registration default) and narrower `mcp:read`                     |
| Pending authorization lifetime     | **10 minutes** by default                                                        |
| Authorization code lifetime        | **60 seconds** by default; one use                                               |
| Access token lifetime              | **900 seconds (15 minutes)** by default; MCP-specific JWT                        |
| Refresh family lifetime            | **7 days** by default; fixed at initial issuance, never sliding                  |
| Refresh rotation                   | Each successful use rotates the pair; older-generation replay revokes the family |
| Consent                            | Explicit approve/deny on each new authorization; no remembered consent           |

`POST /mcp/register` creates an AS-owned client record whenever the existing AS/MCP ingress is available, and its authorization-server metadata advertises `registration_endpoint`. There is no `registration.enabled` field or separate registration activation step. Registration retains bounded body/redirect limits and rate limiting; availability does not bypass ingress or current client, authorization, configuration and account validity checks. Registration creates only a client identity: it does not authenticate a user, grant Cabloy roles or tenant access, issue an authorization code/token, or bypass explicit consent and PKCE. Discovery advertises `authorization_code` and `refresh_token`, but refresh capability requires an explicit DCR grant pair. CIMD, dynamic scopes, remembered consent, a management UI, public registration update/delete endpoints and `offline_access` remain unsupported. Ordinary Cabloy login, refresh, temporary and OAuth credentials are not MCP tokens, and MCP credentials cannot become ordinary login credentials. Configured TTL values and OAuth `expires_in` use seconds; an `expiresAt` timestamp uses epoch milliseconds.

## Endpoints and registration

The initial endpoint paths are:

| Purpose                                   | Path                                          |
| ----------------------------------------- | --------------------------------------------- |
| Begin browser authorization               | `/mcp/auth`                                   |
| Exchange a code or refresh token          | `/mcp/token`                                  |
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
- **Local authority:** both scopes remain bounded by the current user's RBAC, resource ownership, data scope and tenant/instance. `mcp:all` is not administrator or cross-tenant authority. The mapper enforces scope at both `tools/list` and `tools/call`: `mcp:read` lists/calls only tools classified read-only; `mcp:all` permits both classifications only within the constructed catalog, without bypassing business guards. Normal construction requires a registered Resource controller, an enabled route, explicit method/class opt-in and a supported contract. In the student example, create, update and delete are non-read-only and each requires `mcp:all` plus its independent current business authority. Student `deleteForce` and bulk actions lack opt-in; nonresource synthetic/test fixtures fail shared Resource admission. Classification uses action `readOnly`, then controller default, then GET inference; GET is a convention, not proof of no side effects. Mapping opt-in is closed by default, and there is no decorator exclusion option after class opt-in; decorate selected methods for narrower mapping eligibility. Opt-in does not bypass Resource registration, contract, scope or authorization requirements; class opt-in on a registered Resource controller can include future supported actions.

No client scope configuration is needed for the new-registration default. To explicitly narrow Codex authorization, use top-level `scopes` in the server's MCP configuration table, not in its HTTP headers:

```toml
[mcp_servers.cabloy]
url = "https://mcp.example.com/mcp"
scopes = ["mcp:read"]
```

To enable refresh, explicitly register `grant_types: ["authorization_code", "refresh_token"]` (either request order is accepted). The server persists and returns that canonical pair; the initial code exchange then returns both tokens. Omitted `grant_types` or explicit `["authorization_code"]` (as in the example above) remain code-only and return no refresh token. Existing registrations with missing capability, pending grants and legacy opaque tokens are not silently upgraded: obtain a new pair-capable registration and fresh explicit authorization. Refresh-only requests, unrelated or duplicate grants, and unsupported scopes (including `offline_access`) remain invalid registration metadata.

### Codex native registration compatibility

DCR also accepts an omitted `application_type` or exactly `application_type: "native"` as a request-only compatibility hint. It is validated and discarded, not persisted or echoed as registered metadata. No default application type or OIDC application-type semantics are introduced. Other values (including `web`, null, wrong types, case and whitespace variants) remain `invalid_client_metadata`; unrelated unknown fields remain rejected. Exact redirect validation, authentication, scope ceilings and PKCE remain required; refresh capability follows the explicit grant-pair rules above. This bounded profile does not claim unrestricted RFC 7591 metadata support.

The source trace matching bundled Codex `0.163.0-alpha.11.1` is pinned to [Codex's registration builder](https://github.com/openai/codex/blob/680c4ba93ec79c292287fb9e0b627dc7a76e3b5e/codex-rs/rmcp-client/src/oauth_client_registration.rs#L111-L128) and [its rmcp dependency revision](https://github.com/openai/codex/blob/680c4ba93ec79c292287fb9e0b627dc7a76e3b5e/codex-rs/Cargo.toml#L451). The pinned [rmcp manager default](https://github.com/modelcontextprotocol/rust-sdk/blob/4048ac40e958fb1a7d614617a2ae8d26666ee2fa/crates/rmcp/src/transport/auth.rs#L1377-L1392) supplies `native` to its [DCR request builder](https://github.com/modelcontextprotocol/rust-sdk/blob/4048ac40e958fb1a7d614617a2ae8d26666ee2fa/crates/rmcp/src/transport/auth.rs#L1746-L1772). This identifies a concrete field rejected by the previous allowlist, consistent with the observed registration-stage `400 invalid_client_metadata`; it is not a capture of the installed App's full outbound request or proof that no other incompatibility remains. Regression fixtures include native metadata, the requested grant pair and supported scope choices; fixture success alone does not establish real-client success. A later user-reported installed-Codex retry passed authentication and the three-read business journey, as recorded separately below.

Before using the flow, the operator must ensure:

- Dev/test uses a trusted root backend `server.serve.protocol`/`host` pair or the requestless localhost listener fallback. Production requires the explicit trusted public pair and follows the same ready/enabled, OAuth, current business-permission and instance checks; there is no additional audit-delivery gate for this MVP. Do not author `mcp-auth.issuer` or `mcp-auth.resources`.
- Existing automatic instance routing resolves an enabled instance after Host validation, without client selectors or an MCP mapping registry.
- An enabled SSR Site's built flavor contains the shared consent page and normal role admission permits the intended user.
- Registration body/redirect and rate limits remain bounded, with an operational policy for the resulting AS-owned client records. There is no separate DCR enablement step.
- Exact callback URIs are registered through DCR; for confidential clients, keep the returned secret private and store only its server-side digest. Never expose a secret through browser page data or metadata.

Missing or inconsistent configuration fails closed. An arbitrary Host header, instance selector, tool argument or token value cannot establish OAuth resource/instance authority. Registration does not authenticate a user, grant local Cabloy roles or tenant access, issue MCP access, or bypass data scope.

Authority belongs to root backend `server.serve`; module limits, TTLs and the narrow loopback exception belong to `config.modules['mcp-auth']`. The following illustrates the shape only; **it is not a provisioned or verified deployment** and does not request writing deployment settings or environment files. A serve pair establishes canonical authority, not authentication, business permission or readiness.

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
  refreshTokenTtl: 7 * 24 * 60 * 60, // Fixed family lifetime from initial issuance.
  allowLoopbackHttp: true, // Module default; an explicit false is supported.
};
```

Public and confidential clients are created only through `/mcp/register` under the existing AS/MCP ingress; there is no static `clients` configuration. The server owns the generated ID and immutable resource/scope bindings. A confidential registration uses `client_secret_basic`; the server returns the secret only once and stores only its SHA-256 verifier. Never substitute an ordinary login token or publish a real secret/verifier in documentation, browser configuration or retained evidence.

`mcp-auth` keeps `vonaModule.fileVersion: 1`; the existing version-1 path now includes client grant capability and authorization token-version, refresh-capability, generation and fixed-family-deadline fields, separate from `a-auth`. This adds no version-2 migration and does not replay an already-applied version 1. A development database already at version 1 will not acquire those fields from this edit: resetting managed disposable dev data through `npm run db:reset` is a separate destructive operation requiring explicit approval. Managed isolated tests prepare fresh v1 schema, not a development-database upgrade. No reset or live runtime upgrade is claimed here.

Defaults derive authority from the root serve pair or the nonproduction requestless localhost fallback; they do not provision client registrations. TTL fields are seconds. `allowLoopbackHttp` defaults to `true` and may be overridden to `false`; it permits HTTP only for exact `localhost`, `127.0.0.1` or `[::1]`, not arbitrary HTTP, cross-origin federation or public fixture exposure. Production still requires its public serve pair.

The former origin-only issuer (for example `https://mcp.example.com`) differs from the new exact issuer `https://mcp.example.com/mcp`. Existing pending grants, codes and access tokens carrying the old issuer fail exact comparison and require a new authorization. Do not rewrite persisted grants, relax issuer matching or reset the database to preserve them; this is an authority change, not a schema/fileVersion change.

## Client and browser journey

### 1. Start a fresh authorization request

After DCR registration, the client creates a fresh PKCE verifier and its S256 challenge, then opens `/mcp/auth` in the browser. Request parameters identify `response_type=code`, the server-issued `client_id`, exact registered `redirect_uri`, canonical `resource`, optional `scope`, `code_challenge` and `code_challenge_method=S256`. Omit `scope` to inherit the registered ceiling, or send `scope=mcp:read` to request narrower read access from an `mcp:all` registration. Keep and verify client-generated OAuth `state` for callback correlation.

The AS validates client, redirect, resource, scope, instance and PKCE before redirecting toward a client callback, including error callbacks. Malformed/duplicate parameters and mismatched bindings are rejected, not silently normalized into a different authorization.

Set `MCP_AUTH_SSR_SITE` or override `config.modules['mcp-auth'].ssrSite` to select the consent SSR Site by its registered name, for example `basic-siteweb:web`. The module config defaults to the environment value. A nonempty selector must match an enabled Site for the current instance/host; an unknown or disabled Site returns `temporarily_unavailable` (503), without silently choosing another Site. If the selector is unset or empty, the AS keeps the default: choose the enabled Site with the **shortest `publicPath`**; ties preserve existing ordering. It does not probe page availability or fall back based on route capability. Deploy the shared page in all selectable flavors. Selecting a Site does not bypass its role restrictions or alter ordinary SSR routing specificity.

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

A successful exchange consumes the code and activates generation 1 of the MCP JWT grant family in one committed conditional database update. A refresh-enabled grant returns `access_token` and `refresh_token`; a code-only grant returns only `access_token`. Codes cannot be replayed, and a lost response does not enable credential recovery or automatic issuance retry.

Send the MCP access token only as **one `Authorization: Bearer` header** on the protected shared `/mcp` request. Keep the endpoint's required MCP framing/version/method headers. Do not supply bearer credentials through query parameters, cookies, proxy headers or a framework login-token shortcut. This protected-resource rule does not remove normal cookies from the SSR consent page.

Each protected request checks current expiry, revocation, registration and account validity, then constructs a fresh local Passport projection in the trusted instance. Scope is only one limit: existing controller guards, RBAC, resource ownership and data scope remain authoritative. Missing/invalid bearer receives 401 with the applicable challenge; insufficient scope receives 403. Lookup/configuration failure denies before tool dispatch.

### 5. Refresh without a new browser authorization

A refresh-capable client posts `grant_type=refresh_token`, its current `refresh_token` and the same canonical `resource` to `/mcp/token`, using the same public-client identification or confidential Basic authentication as the code exchange. Do not send code, redirect or PKCE parameters in a refresh request. Optional `scope` may retain the granted scope or narrow it, never expand it or exceed the current registered ceiling. A valid refresh can succeed after access expiry, without another consent page, while the family and current account/client bindings remain valid.

Each successful refresh atomically replaces the nonce digest and generation and returns a new pair. **The old access token becomes invalid immediately**, even before its JWT expiry. The default access lifetime remains 900 seconds; the family's original absolute refresh deadline defaults to 7 days and is never extended by rotation. Cleanup retains refreshable grants through that deadline, not merely access expiry. Revocation invalidates the whole family and both token types.

After client authentication and binding checks, replay of a correctly signed older refresh generation revokes the family, including a concurrent winner's newly issued pair. Clients must serialize refresh and replace both credentials together. Do not automatically retry code or refresh issuance after an uncertain/lost response: credentials are not recoverable, and replay can revoke the family. Expired/revoked families require fresh browser authorization.

Existing exact-format opaque access tokens remain usable only through the bounded legacy lookup until their original expiry; they cannot refresh or be upgraded. JWT verification failure never falls back to legacy authentication.

### Server-side refresh evidence

The normal server emits two INFO events through the existing default logger (console and combined log file):

- `mcp.oauth.refresh_succeeded`: the server completed refresh rotation, pair signing and Passport attachment.
- `mcp.oauth.refreshed_access_accepted`: a later protected MCP request successfully authenticated using a refreshed access generation. This is authentication evidence, not evidence that the requested tool succeeded.

For example, the application-authored fields of two correlated records are:

```json
{"event":"mcp.oauth.refresh_succeeded","family":"<same SHA-256 family correlator>","generation":2}
{"event":"mcp.oauth.refreshed_access_accepted","family":"<same SHA-256 family correlator>","generation":2}
```

The standard logger may also add timestamp, level, bean, method/canonical pathname and telemetry metadata. The family correlator hashes a domain-separated grant-binding tuple, not a token or nonce. No raw identity/client/grant IDs, credentials, authorization codes, headers, cookies, request bodies or tool arguments/results are included. This is pseudonymous operational correlation, not strong anonymization or a protected audit trail.

After loading this code into the normal server, perform a read-only client interaction, wait beyond the default 900-second access lifetime, then interact again without manually reauthorizing. Search the server console or its configured combined log for these event names. A refresh event followed by an accepted-access event with the **same family and generation** directly establishes server-side refresh issuance followed by use of that generation. It does not establish client response persistence or business-call success; continued usability alone does not prove refresh. Initial generation 1, legacy opaque access and rejected operations produce no such success records. Each accepted refreshed request may log again.

Existing INFO/child/transport filters, optional request-boundary diagnostic suppression and strict isolated-test suppression remain effective. Normal shared ingress does not install that optional boundary. Missing records are inconclusive if diagnostics are filtered, suppressed or unavailable; do not bypass those policies or collect credentials. Managed regression assertions capture the production logging calls without changing suppression settings; they do not substitute for real-client runtime evidence. Logging is best-effort and does not change authentication outcomes. Do not reset databases or replay a refresh token to obtain evidence.

### Shared Passport implementation boundary

MCP reuses the original Passport auth-token lifecycle through static JWT client selection. The registered `mcpAccess` and `mcpRefresh` clients both configure `authTokenAdapter: 'mcp-auth:authTokenAdapter'`; trusted server code passes those client names to `bean.passport.createAuthToken(...)`, `checkAuthToken(...)` and `refreshAuthToken(...)`. No auth provider, signin event or duplicate user identity is introduced. The adapter's optional `deserialize(payloadData)` seam reloads the current user, auth ownership/provider and roles rather than relying on the ordinary deserializer. Its fixed `options: { stateless: false, strategy: 'reissue' }` preserves stateful grant validation regardless of provider stateless overrides or ordinary session mode. Clients without an adapter selection keep their existing ordinary auth/session behavior.

Adapter verification is read-only: access checks require the current generation, while refresh verification can pass an otherwise valid older generation to the shared `reissue` strategy and the selected adapter's `create(...)` for replay revocation. MCP's `create(payloadData, ttl?, input?)` dispatches generation 0 to initial activation and generation 1 or later to atomic rotation; validated operation data in `input` supplies the required resource binding and any requested narrowed scope, not a closure or adapter override. `verify(payloadData, { operation, clientName, input })` checks that data and the selected purpose. Refresh checks defer Passport attachment. The single-winner state change returns the rotated payload, then `getJwtOptions(payloadData)` selects the MCP pair and lifetimes before JWT signing and current Passport attachment.

The existing authorization row is the grant family; only the current nonce digest is stored, not plaintext credentials or a second token-history/identity store. The attached scalar `passportAuthTokenClient` preserves the selected adapter across the MCP Passport handoff and is cleared with current state. Ordinary signin, refresh, temporary-token and OAuth helpers reject conversion from attached MCP authority before replacing current state or accepting an ordinary OAuth code. See [Auth Guide](../../../../../repo-docs/backend/auth-guide.md#auth-token-lifecycle-and-adapter-selection) and [JWT Guide](../../../../../repo-docs/backend/jwt-guide.md#explicit-pairs-and-scoped-passport-flows).

## Troubleshooting without weakening the boundary

- **No usable registration:** check root backend `server.serve.protocol`/`host` (or the nonproduction requestless localhost fallback), Host validation, existing automatic instance routing and the active DCR record with its exact registered redirect. DCR follows existing AS/MCP ingress availability; there is no `registration.enabled`, authored issuer/resource map or static-client fallback. Keep body/rate limits and do not make request Host, proxy headers or selectors authoritative.
- **Consent route missing or user denied by the selected Site:** verify the shared route is included in that Site's paired built artifacts and that ordinary Site-role admission is appropriate. The backend intentionally does not capability-probe or select a more permissive Site.
- **Login does not return to consent:** preserve the exact internal pending URL through the existing login flow; do not substitute the OAuth callback or add another cookie/bridge.
- **Consent API calls reach the wrong origin:** inspect explicit Site/module API-origin overrides first. Vona integrated SSR normally supplies runtime API origins; see [Runtime API origins](../../../../../repo-docs/fullstack/ssr-entry-modes.md#runtime-api-origins-in-vona-integrated-ssr). Do not edit environment values merely to match an isolated test listener.
- **Decision rejected:** check current login/account state, request lifetime and trusted origin. Do not replace an authenticated POST with a GET or introduce CSRF bootstrap to bypass the normal client chain.
- **Code exchange rejected:** check exact redirect/client/resource binding, the original verifier, expiry and previous use. Reauthorize instead of replaying or recovering a credential.
- **Refresh rejected or access denied after refresh:** check client/resource binding, current stored pair, family expiry/revocation, scope and account validity. Old access is intentionally invalid after rotation; do not retry an old refresh token or widen scope. A code-only/legacy grant requires a new refresh-capable registration and authorization, not a login-token fallback.
- **MCP access denied:** distinguish token/scope failure from current local authorization. A valid token does not create a local role or a cross-instance entitlement.
- **503 or an empty/missing tool list:** normal ingress requires a recognized dev/test/prod mode, enabled and ready application state, no shutdown in progress, and valid required authority configuration (including an explicit public serve pair in production). Unknown modes remain closed; production is not denied solely by mode. Dedicated audit delivery is not an MVP availability gate. An absent training module removes student tools, not necessarily the entire Resource catalog. Check Resource registration, enabled routes, explicit opt-in, supported contracts, scope and each actual Action's current guards. For the student example, select/view authority independently filters the four reads into select + lookup and view + summary; create, update and delete each separately require `mcp:all` and their corresponding student authority. `commerce_*` tools belong only to the standalone launcher, not shared `/mcp`.

## Verification and operational limits

**Refresh evidence boundary:** the current refresh contract above supersedes historical authorization-code-only/no-refresh statements in the retained reports below; those historical reports do not verify refresh. The [2026-11-01 real-client refresh record](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#user-provided-real-client-mcp-refresh-runtime-evidence-2026-11-01) separately retains user-provided matching generation-4 refresh/accepted-access events and scoped automated verification. It establishes server-side refresh followed by use of that generation, not tool success, a development-database reset, immutable served-source attestation or production qualification. Managed tests and real-client runtime evidence retain their separate scopes; historical successful login/read journeys alone do not establish refresh.

**Normal ownership migration boundary:** the retained checks and real-client reports below all predate `cabloy-mcp` taking normal `/mcp` ownership and restricting construction to lookup/summary. They do not attest the migrated ingress, its production/unknown-mode gate, or the then-student-only empty-without-training behavior. That historical allowlist is not the current Resource admission rule. This documentation update adds no execution evidence; current ingress and Resource-catalog acceptance must be established separately.

The earlier Controller Action mapper replacement is qualified separately in the [opt-in mapping evidence](../../../../../repo-specs/cabloy-mcp/evidence/business-ai-client.md#explicit-opt-in-controller-action-mapping-2026-10-25). That revision's focused shared authorization/student regression passed **34/34**, including ordinary RBAC/instance behavior and read-scope denial before test-only writes in modern and legacy modes. Its broader fixture/mutation composition is not current normal admission. Earlier real-Codex catalog/student acceptance remains historical.

The retained results below describe their original increments. They also predate the Controller Action mapper replacement and are not new verification of its discovery, projection or scope enforcement. No replacement or ownership-migration acceptance is inferred from the earlier Codex reports.

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
