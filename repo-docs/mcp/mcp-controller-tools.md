# MCP Controller Tools

<Badge type="info" text="Basic" />

Opt an existing Vona Controller Action into MCP mapping with `@Mcp.tool()`. Reuse its request/response contract, validation, serialization and ordinary business authorization rather than writing a second business implementation.

Start with the [MCP Integration Guide](/mcp/mcp-guide) for runtime ownership and endpoint boundaries. Use [MCP Browser Authorization](/mcp/mcp-browser-authorization) for client registration, login, consent, tokens and personal scopes. This page covers Controller opt-in, contract mapping, discovery and the Student examples.

## Opt in explicitly

```ts
import { Mcp } from 'vona-module-a-openapiutils';
```

Mapping is **closed by default**:

- Only a registered Action with its **own Action-level `@Mcp.tool(options)`** metadata opts in. `@Mcp.tool()` records an explicit opt-in with empty options.
- Undecorated Actions, including future Actions, remain closed before naming, collision checks, contract/schema extraction and diagnostics. Helpers are never admitted.
- Controller-level decoration and Controller-default inheritance are not supported. Applying `@Mcp.tool()` to a class is rejected.
- This is a breaking change with no compatibility layer: `Mcp.exclude` and `SymbolMcpExclude` are removed. To keep an Action closed, omit its Action-level tool decorator.

Normal site-resource `/mcp/:ssrSiteId` construction requires all of the following:

1. An enabled Controller.
2. A registered Action route.
3. Admission by the server-owned `includeTool` predicate, when supplied.
4. Own Action-level `@Mcp.tool()` metadata.
5. Admission of the requested SSR Site by the Action's optional `ssrSites`.
6. A supported MCP/OpenAPI contract.

OAuth scope eligibility and current business authorization apply independently. Opt-in alone is not exposure on the authenticated endpoint. `@Resource()` is not a generic admission requirement; loaded synthetic/test Controllers can contribute tools under the same rules. Module capability and Controller `meta.mode` filtering occur during startup, before this scan.

MCP metadata is independent of ordinary OpenAPI publication. `@Api.exclude()` is not an MCP authorization boundary: an explicitly opted-in, admitted Action can still become a tool. Conversely, publishing an HTTP Action does not opt it into MCP.

### Generated CRUD opt-in

In this Cabloy Basic checkout, `:tools:crud`, `:tools:crudBasic`, and `:tools:crudStart` generate explicit Action-level opt-in for all eight Actions by default, without an `--mcp` flag. `select`, `group`, `aggregate`, and `view` use `readOnly: true`; `create`, `update`, `delete`, and `deleteBulk` use `readOnly: false`. This changes new scaffolds, not existing Controllers or the runtime admission rules above. Decorators do not activate an endpoint or grant business authority; bulk mutations remain potentially destructive and must preserve existing guards and instance/data scope.

Generated MCP Actions target the ordinary Admin Site with `ssrSites: ['basic-siteadmin:admin']` in Basic or `ssrSites: ['start-siteadmin:admin']` in Start. These are SSR Site bean onion names, matching the menu's existing `site` selector format. This is a generation-time default; omitted runtime `ssrSites` still admits every Site. For a different audience, adapt the generated menu's public package import, Site options type, `site` selector and `group`, together with every relevant MCP Action's `ssrSites`, from the target Site definition. Menu visibility and MCP Site membership do not grant business authority.

Generated descriptions use `$locale('<Resource><Action>Description')` with minimal truthful action text and English `TODO(mcp-description)` source comments. The CLI reminder asks for AI/manual refinement against the actual Action, DTO, and Service. **After business implementation and before completion**, fill these descriptions in every generated locale from the implemented inputs, result, scope, and material effects, including bulk selection scope and destructive or related-record effects when material. Remove resolved TODO comments in all generated locales; retain unresolved TODOs and explicitly report incomplete semantics. Verify `readOnly` against the final behavior and never infer atomicity, idempotency, rollback, recoverability, or authorization guarantees from a generated scaffold.

See [CRUD Workflow](/backend/crud-workflow#generated-mcp-metadata-and-required-description-follow-up) for the generation and follow-up sequence. The Student examples below are separately authored contracts, not the default generated catalog.

## Options and defaults

| Option        | Meaning                                                                                                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Action-only public tool name override. The default is `module_controller_action`. Names must be unique and contain 1–128 letters, digits, `_` or `-`. Unsupported characters in the Controller identity are replaced by `_`; module-name hyphens are preserved.            |
| `description` | Action-scoped text or locale metadata. Falls back to that Action's OpenAPI description, summary, then Controller/Action identity. A class-level description is not inherited.                                                                                              |
| `readOnly`    | Action-local read classification. If absent, infers `true` for GET and `false` for other methods; no Controller default applies.                                                                                                                                           |
| `ssrSites`    | Optional nonempty list of SSR Site bean onion names, for example `['commerce-siteweb:commerce']`. Omission admits every Site; `[]` is invalid. Simple Site IDs are not accepted. Filters construction before names, contracts and diagnostics, not business authorization. |
| `output.pick` | Top-level object response field allowlist, applied to runtime validation/projection and the advertised schema closure. It does not alter the HTTP DTO.                                                                                                                     |
| `discovery`   | Optional `{ input?: string[][]; output?: string[][] }` paths that compact selected object/array schemas in tool declarations only. Full contracts remain available through `cabloy_tool_contract`.                                                                         |

All options are Action-local; no option is inherited from the Controller. `output.pick` is only the decorated Action's allowlist, not a merge with class defaults. Invalid names, duplicate names and unknown projection fields are configuration errors, not reasons to publish unvalidated output.

The Student examples use default names such as `training-student_student_summary`, derived from `training-student.controller.student`. Clients must refresh discovery after a name change. A personal scope bound to the old exact name does not automatically admit the renamed tool; update the preset and authorize again.

### Limit an Action to an SSR Site

```ts
@Mcp.tool({ ssrSites: ['commerce-siteweb:commerce'], readOnly: true })
```

This Action can enter the `/mcp/commerce` catalog but not `/mcp/web`. `ssrSites` uses SSR Site bean onion names such as `commerce-siteweb:commerce`, the same selectors used by menu `site` metadata; menus are unchanged. Simple Site IDs, flavor names and public paths are not accepted in `ssrSites`, and there is no dual-format compatibility. External `/mcp/:ssrSiteId` URLs, OAuth resource bindings and frontend `SITE_ID` still use simple IDs such as `commerce`, not bean onion names. Omit `ssrSites` to permit construction for every Site; `@Mcp.tool()` still requires all other admission checks. The filter applies before naming, collision checks, contract extraction and unsupported-contract diagnostics, so an Action excluded from the current Site is not exposed through known-name calls or `cabloy_tool_contract`. Restricting an Action's Site does not change its HTTP route, grant Site admission or bypass its current guards. Custom selections remain resource-scoped.

GET inference and `readOnly: true` are not proof that an Action has no side effects. Classify actual behavior accurately: a misleading classification weakens the read-only scope boundary.

## Arguments and results

Request contracts come from the existing Action's path parameters, query and JSON body:

| Action input                                              | Tool arguments                                                                                                                                 |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| One object-shaped location, such as path parameters alone | Flat object, for example `{ "id": "…" }`                                                                                                       |
| Multiple locations                                        | Grouped object, for example `{ "params": { "id": "…" }, "query": { "verbose": true }, "body": { "name": "…" } }`; include only declared groups |
| Scalar or array body                                      | `{ "body": value }`                                                                                                                            |
| No arguments                                              | Strict empty object `{}`                                                                                                                       |

Unknown top-level arguments and unknown fields in location objects are rejected. Empty path-parameter strings are invalid because they cannot represent a route segment. Both the advertised contract and native Action validators apply. Schema-declared dates accept ISO date-time JSON strings and bind as native Dates without enabling broad HTTP query coercion. Clients cannot supply routes, methods, credentials, user/instance selectors or executor options through extra arguments.

Object results become `structuredContent` directly. Array and scalar results use `{ "result": value }`; a declared null result becomes `{ "result": null }`. JSON text content represents that same structured object. Results are validated; failed validation never falls back to raw Action output.

An `undefined` result or a missing object resource represented by `null` returns an error tool result with safe text `Resource not found`. Authorization, unexpected Action and output-validation failures return `Action failed`, without raw exceptions or private data. Invalid arguments remain protocol errors. Reviewed public-query validation failures include bounded `queryCode` / `path` diagnostics and a fixed `hint` directing the caller to `cabloy_tool_contract` with the failed tool's exact server name and `section: 'query'`. Retrieve the current contract and correct the arguments while preserving the intended filters; do not drop constraints to bypass validation. The hint is general guidance, not a diagnosis of the precise cause or an automatic retry. These errors never include SQL, operand values or a hidden-field catalog; ordinary argument, authorization and unexpected Action failures do not receive query repair hints.

### Action contract extraction

The mapper extracts the existing contract using the MCP schema target:

```ts
const document = await app.bean.openapi.generateJsonOfControllerAction(controller, action, 'V31', {
  includeExcluded: true,
  schemaTarget: 'mcp',
});
```

`includeExcluded: true` permits contract extraction independently of ordinary `@Api.exclude()` publication; it is not an authorization bypass or a global publication switch. `schemaTarget: 'mcp'` disables HTTP query coercion during contract collection and schema generation. Optional fields therefore do not advertise null merely because HTTP query normalization can treat null as omission; explicitly nullable fields retain null support.

See [OpenAPI Guide](/backend/openapi-guide#generate-an-action-contract-for-mcp-json-arguments) for target defaults and cache separation. Native validators remain authoritative for constraints JSON Schema cannot express.

### Public query arguments

For query-enabled Actions, use the same policy-bound [public query contract](/backend/public-query-guide) as HTTP and generated UI clients. MCP uses a **compact discovery contract**: the formal tool keeps `where` as an object with its original optionality and a short description, rather than advertising the complete recursive predicate graph. This is a discovery representation, not a new query language or a relaxation of validation. The full native predicate, operand, policy and budget checks still run before ordinary guarded Action execution. Not every list Action exposes advanced controls.

The mapper preserves the selected business description and appends centrally owned guidance to policy-bound query tools. It directs clients to `cabloy_tool_contract` with `section: 'query'` for the exact target, recommends one `where.or` call for alternatives, and explains that named filters add AND constraints. This applies to actual select/group/aggregate bindings, not all read-only tools or Actions named `select`. Shared guidance is in English; localized business descriptions remain intact. Refresh discovery after deployment. A client without an installed skill can follow the tool description, retrieve the contract and successfully execute the business query; a skill is not required for that workflow.

### Compact selected declaration schemas

Use `discovery` only to keep a large declaration manageable. It is explicit, declaration-only compaction, **not redaction**: the selected full public schema remains retrievable, input/output validators remain complete, and business arguments and returned data do not become smaller. Use `output.pick` when the intended contract actually excludes output fields.

```ts
@Mcp.tool({
  readOnly: true,
  discovery: { output: [['list', 'items']] },
})
```

Each path is a nonempty array of segments in the **final MCP contract**, after flat/grouped argument mapping and output projection/wrapping. Traverse object property names; a terminal `items` selects an array's item schema. For example, `['list', 'items']` selects the object item schema of a paged result's `list` array. It is not a wildcard or a JSON Pointer, and cannot continue into properties of an array item.

Only selected object/array schemas can be compacted. Root paths, scalar targets, union/ambiguous targets, missing paths, duplicate or overlapping selections are invalid. An explicit selection does not automatically cover other Actions or descendants through array traversal. A flat object body has no artificial `body` prefix; `['body']` is valid only when the final MCP arguments actually have that grouped property. The effect fixture's grouped `['body']` selection is a test example, not a blanket mutation setting.

Policy-bound `where` compaction is automatic and independent of these explicit paths. Neither mechanism changes the native predicate language, validators, guards or data scope. The helper's overview reports the effective compact paths, including each bound query's `argumentPath` plus `['where']`.

### Retrieve one tool's contract

`cabloy_tool_contract` is the single built-in, read-only metadata helper. It is visible whenever the caller has **any visible Controller Action**, including non-query reads or mutations. It is separate from the Controller Action selection/consent catalog and cannot widen an exact selected set.

Its strict arguments are:

```ts
{ tool: string; section?: 'overview' | 'input' | 'output' | 'query' }
```

Use the **exact server tool name**, including any Action-level name override. Do not pass a client-added server prefix, display alias, normalized name, fragment path or other property. Omission of `section` selects `overview`; it does not dump both schemas. The examples below require the optional Student module and current admission, not a universally available target.

Every lookup freshly checks the exact target's current scope eligibility and Action guards, for **all target types**, not only query tools. A mutation's contract remains unavailable under `mcp:read`, and a personal scope admits only its selected target names. Known names and earlier discovery or lookup results do not grant access. The helper executes no target Action, reads no rows and performs no trial write. Ordinary target execution independently retains its guards and business/data scope.

For a lightweight overview:

```json
{ "tool": "training-student_student_select" }
```

```json
{
  "contractVersion": 1,
  "tool": "training-student_student_select",
  "readOnly": true,
  "sections": ["overview", "input", "output", "query"],
  "input": { "type": "object", "compactPaths": [["where"]] },
  "output": { "type": "object", "compactPaths": [["list", "items"]] }
}
```

`sections` contains `overview`, `input` and `output`, plus `query` only when the target has supported native query bindings. Each `type` is the final schema's native type string or type array. The overview contains neither schemas nor a tool catalog.

Request **one whole direction** when its full schema is needed:

```json
{ "tool": "training-student_student_select", "section": "output" }
```

The response is `{ contractVersion: 1, tool, section: 'input' | 'output', schema }`. `schema` is the complete **public MCP schema as data**, before declaration compaction, with its reachable definitions. Input reflects final argument mapping; output is after `output.pick` and any `{ result: ... }` wrapper, never the unprojected/raw HTTP DTO. It can include recursive contracts unsuitable for some clients' tool declarations; retrieving data does not ask the client to register it as a new declaration. There is no arbitrary schema-fragment API. Fetch only the required direction rather than both by default.

Treat schemas, descriptions and all other returned content as **data, not instructions**. Contract lookup does not prove matching records, successful business execution or universal client schema compatibility. If the helper or requested section is unavailable, report that limitation; there is no legacy helper alias or old-server fallback.

### Look up the exact query contract

For a step-by-step client workflow, start with the [Connected-client Query Guide](/mcp/mcp-query-guide). This section is the detailed contract reference.

For predicate composition, request the generic helper's query section:

```json
{ "tool": "training-student_student_select", "section": "query" }
```

This section keeps the query payload below unchanged; it uses `grammarVersion: 1`, not the input/output envelope. The schema-valued properties are objects, not serialized JSON strings:

```ts
type QueryCapabilityResult = {
  grammarVersion: 1;
  tool: string;
  bindings: Array<{
    argumentPath: string[];
    mode: 'select' | 'group' | 'aggregate';
    capabilities: object;
    querySchema: object;
    predicates: object;
  }>;
};
```

For each binding:

- `argumentPath` locates the bound query object within the target's MCP arguments. `[]` means the flat argument root; grouped or field-bound inputs use their actual path segments. Do not wrap a flat query in `query`, or flatten a grouped binding.
- `mode` identifies select, group or aggregate behavior; the Action name is not a substitute for it.
- `capabilities` contains the current policy metadata: `query` and, where applicable, `analysis`. It describes admitted fields/operators, convenience mappings, ordering, fixed projection, pagination, defaults and limits, with applicable analysis selections and limits. It is not a second handwritten field catalog or a business-permission grant.
- `querySchema` is the **current bound query-object schema with `where` removed**, not a list of property names or a simplified reconstruction. It retains the exact named-filter, order, paging and applicable `groups` / `aggrs` schemas, requiredness and constraints.
- `predicates` is a JSON Schema whose `anyOf` contains the exact **nonrecursive leaf branches**. Use it to choose each field/operator/operand combination, including enums, identity types, decimal/date formats and value-less null checks. Compose admitted leaves using the grammar below; `predicates` is not itself the complete recursive `where` schema.

`querySchema` and `predicates` each carry their own reachable `$defs` when needed. Resolve references within that schema document, not against the other property or a cached `tools/list` response. Backend Model classes, table names and private bindings are not public query capabilities.

### Compose and execute

Use the retrieved contract together with the target's declared argument locations:

- Supply `where`, `orders`, `groups` and `aggrs` as **native JSON**, not JSON strings. Only HTTP GET needs structured-control JSON query encoding. Numeric and Boolean operands are native numbers/Booleans; recursive string coercion is disabled.
- Use explicit AST leaves (`{ field, op, value }`), nonempty `{ and: [...] }` / `{ or: [...] }` arrays or `{ not: predicate }`. Each node has exactly one strict shape. Omit `where` for no added restriction; `{}` and old property-keyed/underscore-operator queries are invalid. No raw-ORM fallback exists.
- Explicit `where` and all supplied named conveniences combine by AND. Names in a small form are not the complete advanced field allowlist and need not map to same-named canonical fields.
- Public string operators match literal `%`, `_` and `!`; they do not accept client LIKE patterns. Use explicit null-check leaves without `value`, typed dates and offset-bearing timestamps as documented in the canonical guide.
- Select uses structured orders and stable resource-id tie-breaking. Current projection is fixed: do not send `columns`. Group/aggregate reject list orders/projection/paging instead of ignoring them.
- Shared query byte/node/depth/list/order/string budgets combine. The complete MCP JSON-RPC envelope has separate transport limits, including argument wrappers, so do not assume every semantic maximum fits one call.

Compilation preserves service-owned scope AND client restrictions and ordinary ORM instance/deleted scope. The static query policy is not authorization. MCP adds no joins, Raw/Ref, execution identity, datasource/scope switches or cross-instance access. Refresh discovery/capabilities and generated consumers after backend policy changes; do not maintain a second MCP field catalog.

### Optional end-user query skill

The standalone [`cabloy-mcp-query` skill](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-query) packages this discovery → capability lookup → native query workflow for an already-connected client. It needs no source checkout, development commands, environment files or credential access. Read the [end-user package README](https://github.com/cabloy/cabloy/tree/main/repo-client-governance) for its boundary and manual loading guidance.

**Connecting to MCP does not install or load the skill.** Users must manually install or load the skill through their own client's supported mechanism; location, activation and session refresh are client-specific. No automatic installer, adapter generation or client registration is supplied or executed. The skill grants no authority and does not replace tool schemas or server validation.

## Factory and authorization boundary

The metadata lives in `vona-module-a-openapiutils`; runtime mapping and MCP SDK dependencies live in `vona-module-cabloy-mcp`:

```ts
import { createControllerToolServer } from 'vona-module-cabloy-mcp';

const server = await createControllerToolServer(app, scope, { ssrSiteId: 'web' });
```

Pass a **validated `mcp:read` or `mcp:all` scope** and an explicit enabled `ssrSiteId`, and dispatch within the authenticated application request context. Missing/unsupported scope or a missing/unavailable Site fails closed. Omitting the Site is not an all-Sites catalog. The factory creates a tool server, not OAuth ingress or a new authentication mechanism.

Normal `/mcp/:ssrSiteId` ingress uses `createSharedBusinessToolServer`, which delegates to the shared service for Site-filtered construction and permission-aware discovery. Do not replace that composition with unrestricted factory discovery.

- `mcp:read` lists only tools classified read-only and rejects direct calls to other tools, even when their names are known.
- `mcp:all` permits both classifications within the admitted catalog, subject to independent business authorization.
- Normal shared ingress also supports personal `mcp:custom:<name>` scopes. The shared service resolves the authenticated user's exact consented tool bindings and supplies server-owned `toolAccess` and read-only restrictions to the mapper. A custom scope without resolved bindings is not valid for the simple factory example. Custom selection narrows both listing and calling within the original request and registered client ceiling; it never grants business permissions. See [Personal scopes](/mcp/mcp-browser-authorization#personal-scopes-from-account-security).
- Every business Action call uses ordinary `executor.performAction` with **`innerAccess: false`**, retaining Controller guards, RBAC, serialization, current user and instance/data scope. Neither the decorator nor an OAuth scope grants cross-instance access.

### Permission-aware discovery

The shared service supplies the optional factory callback `isToolVisible(identity, controller)`. After scope filtering, each list checks `permission.checkPermissionControllerActionGuards(controller, actualAction)` afresh and sequentially in the request context. It bypasses permission-result caching and matcher projection while retaining the actual guards and restoring context state. For every target type, the factory uses the native Action guard check when this callback is absent, both during listing and exact-target contract lookup. It does not execute business Actions, probe rows or perform trial writes.

Ordinary denial omits the tool. An unexpected visibility error fails the entire list with a nondiagnostic protocol error, not partial tools or an unfiltered fallback. Calls independently execute their Action guards; listing is not a reusable grant, so revocation after discovery still denies a known-name call.

When the optional training suite is active, its eight Student tools illustrate independent business permissions:

| Actions                        | Required Student permission | Built-in scope ceiling  |
| ------------------------------ | --------------------------- | ----------------------- |
| `select`, `group`, `aggregate` | Select                      | `mcp:read` or `mcp:all` |
| `view`, `summary`              | View                        | `mcp:read` or `mcp:all` |
| `create`                       | Create                      | `mcp:all`               |
| `update`                       | Update                      | `mcp:all`               |
| `delete`                       | Delete                      | `mcp:all`               |

These permissions do not imply one another. Select-only authority lists three reads; view-only authority lists two. All corresponding permissions permit eight Student tools under `mcp:all`, or five reads under `mcp:read`. A personal scope may narrow those selections further. Visibility establishes Action admission, not that a matching Student exists.

Student tools are examples, not a catalog ceiling. Other eligible Controllers may contribute tools; without training, Student tools disappear without enabling fixture fallback. The independent anonymous launcher owned by `a-test/test-mcp` has exactly three synthetic fixtures and is a separate entrypoint. Its relocation from `mcp-test` changes module-derived default names from `mcp-test_*` to `test-mcp_*`, not explicit overrides such as `mcp_test_action_*`, the three `commerce_*` tools or protocol strings such as `x-mcp-test-owner`. Its fixed catalog is not the expected `/mcp/:ssrSiteId` list: opted-in `test-mcp` Controller Actions may also qualify for the shared map when their module is active, under the same authentication, contract and permission rules.

## Student examples

All eight Student tools select `basic-siteadmin:admin` and require the ordinary Admin `/mcp/admin` resource, not Web; this Site selection grants no authorization and leaves scope and Action guards independent.

Student tool descriptions live in their Action-level `@Mcp.tool()` options, alongside read classification and output projection. `$locale('Student<Action>Description')` resolves through the backend `training-student` module's locale resources in the current request locale. The `@Web.xxx()` options retain HTTP OpenAPI summaries without duplicating MCP-specific descriptions; the mapper's OpenAPI description/summary fallback remains available when an Action omits its MCP description.

### Example: student create

`training-student_student_create` opts in the existing guarded `POST /training/student` Action:

```ts
@Mcp.tool({
  ssrSites: ['basic-siteadmin:admin'],
  description: $locale('StudentCreateDescription'),
  readOnly: false,
})
@Web.post('', { summary: $locale('StudentCreate') })
```

With independent Student-create authority and a write-permitting scope, call it with the flat `DtoStudentCreate` body:

```json
{ "name": "Synthetic student", "mobile": "13812345678", "level": 1 }
```

Optional Markdown content and training records with nested subjects follow the existing DTO. Only declared nested controls are accepted; relation ownership checks still apply. Schema-declared dates such as nested `trainingTime` use ISO date-time strings.

The response is an identity, represented as `{ "result": "<created student ID>" }`, not a read-back detail object. Create is a **non-idempotent persisted aggregate write**: repeating a call can create additional data, and deeper failures can follow partial insertion. Apply the [mutation safety boundaries](#mutation-safety-boundaries) below.

### Example: complete student update

`training-student_student_update` targets guarded `PATCH /training/student/:id`. It requires independent Student-update authority and a write-permitting scope. Unlike flat create, it uses **grouped params/body arguments**:

```json
{
  "params": { "id": "<existing student ID>" },
  "body": { "name": "Student name", "mobile": "13812345678", "level": 1 }
}
```

`body.name`, `body.mobile` and `body.level` are required by `DtoStudentUpdate`; the PATCH route is not a partial-patch or basic-fields-only contract. The aggregate contract includes optional `imageId`, `content.descriptionMarkdown`, and existing/new `trainingRecords` with nested `trainingRecordSubjects`. Declared nested `id` and `deleted` controls can update or delete children; deletion entries still require their DTO-required business fields. Caller-controlled relation parent foreign keys are omitted, undeclared controls are rejected, and cross-parent validation remains.

The Controller declares `Promise<void>` with `@Api.body(z.null())`. MCP returns **`{ "result": null }`** as completion acknowledgment, not proof of root existence, affected rows or read-back success. A subsequent view requires independent view authority. Update can create children, delete children and leave partial changes after a later failure; do not replay it automatically after an uncertain response.

### Example: student delete

`training-student_student_delete` targets guarded `DELETE /training/student/:id` and requires independent Student-delete authority and a write-permitting scope. Its arguments are **flat path parameters**:

```json
{ "id": "<existing student ID>" }
```

Dispatch retains `{ params: { id }, innerAccess: false }` and ordinary string/number identity validation. Undeclared body, route, method, instance, Passport, executor and confirmation controls are rejected.

The void/null response becomes **`{ "result": null }`**. It acknowledges completion only, not root existence, affected rows, complete cascade or independently authorized read-back.

This is **destructive aggregate soft deletion** of Student, content, training records and nested subjects, not root-only deletion. Soft deletion promises neither recoverability nor indefinite retention; pruning may later remove rows. No attachment/blob deletion or restore capability is promised. Sequential cascades can partially complete. Student `deleteForce` and bulk Actions are not opted in; this does not exclude other eligible Resource mutations.

### Example: complete student select

`training-student_student_select` exposes the existing select Action without an MCP output projection:

```ts
@Mcp.tool({
  ssrSites: ['basic-siteadmin:admin'],
  description: $locale('StudentSelectDescription'),
  readOnly: true,
  discovery: { output: [['list', 'items']] },
})
@Web.get('', { summary: $locale('StudentSelect') })
```

Call it with flat query arguments:

```json
{ "name": "Student", "level": 2, "pageNo": 1, "pageSize": 10 }
```

The policy-bound `@Arg.filter(DtoStudentSelectReq)` also exposes named `createdAt`, canonical `where` and structured `orders`. Before building an advanced call, call `cabloy_tool_contract` with `{ "tool": "training-student_student_select", "section": "query" }` and follow its current binding, query schema and leaf schemas. An advanced call using admitted Student operations is:

```json
{
  "where": {
    "and": [
      { "field": "name", "op": "containsI", "value": "Student" },
      { "field": "level", "op": "eq", "value": 2 }
    ]
  },
  "orders": [{ "field": "createdAt", "direction": "desc" }],
  "pageNo": 1,
  "pageSize": 10
}
```

These are native arguments, not serialized query strings. A supplied named `name` filter additionally restricts the advanced predicate; it never overrides or is overridden by `where`. Name search treats `%`, `_` and `!` literally. Timestamp comparisons need offset-bearing ISO strings; the named date-range input remains a distinct UI convenience. Read current capabilities for exact operators rather than assuming every operator family is enabled for Student.

The result retains `DtoStudentSelectRes`: `list`, string `total`, `pageNo`, `pageSize` and `pageCount`. `discovery.output: [['list', 'items']]` compacts only the declared row schema; `section: 'output'` returns its full public schema as data. Business rows do not shrink: they retain their fixed serialized fields, including masked mobile and optional image resolution. Client `columns` is rejected at input; it is not a way to vary the response or deliberately trigger output-validation failure. Select does not add detail relations, full notes or fetch every page. Schema UI metadata does not create extra row values.

For name → ID → summary/view, choose a matching row's returned `id`, then call the next tool only with independent Student-view permission. Select authority alone does not grant detail access.

### Example: student group and aggregate

`training-student_student_group` and `training-student_student_aggregate` use the same canonical filter and mandatory scope boundary, with the separate Student analysis allowlist. A query-only group call is flat:

```json
{
  "where": { "field": "name", "op": "containsI", "value": "Student" },
  "groups": ["level"],
  "aggrs": { "count": ["*"] }
}
```

Aggregate accepts `aggrs` but no `groups`. Neither accepts `orders`, `columns`, `pageNo` or `pageSize`; analysis covers the full matching population, not a select page. Omitted analysis selections use the Action defaults; explicit empty selections are invalid. Count values remain decimal strings. See [CRUD Workflow](/backend/crud-workflow#grouping-and-statistics) for requested-only response fields and analysis limits. These are persisted Student flows; immutable `commerce_*` test fixtures do not demonstrate real commerce data access.

### Example: complete student view

Call `training-student_student_view` with `{ "id": "<existing student ID>" }`. The ID binds to guarded `GET /training/student/:id` with `v.tableIdentity()` validation. The optional `DtoStudentView`, serializer, view RBAC and instance-scoped service remain unchanged.

The complete serialized detail includes full `content.descriptionMarkdown`, `trainingRecords` with nested `trainingRecordSubjects`, optional `image` URL presentation and masked mobile. This intentionally exposes full detail under view authority; it does not add detail joins to select or change summary's six-field projection. Missing and out-of-instance Students receive the same safe not-found result.

An image URL presentation object is not an MCP image block or UI resource. Returning Markdown, images or nested data does not guarantee client rendering, expandable UI or URL reachability.

### Example: student summary

The summary Action declares a projection without changing its HTTP DTO, serializer or permissions:

```ts
@Mcp.tool({
  ssrSites: ['basic-siteadmin:admin'],
  description: $locale('StudentSummaryDescription'),
  output: {
    pick: ['id', 'name', 'level', 'levelTitle', 'descriptionLength', 'summaryText'],
  },
})
@Web.get('summary/:id', { summary: $locale('StudentSummary') })
@Api.body(v.optional(), v.object(DtoStudentSummary))
@Core.serializer()
@Passport.rbac({ actionInherit: 'view' })
async summary(
  @Arg.param('id', v.tableIdentity()) id: TableIdentity,
): Promise<DtoStudentSummary | undefined> {
  return await this.scope.service.student.summary(id);
}
```

Call `training-student_student_summary` with `{ "id": "<existing student ID>" }`. The result contains exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength` and `summaryText`. Mobile and full Markdown/HTML notes are absent from both runtime output and the advertised schema, including reachable definitions.

Projection is field minimization, not anonymization: the name and summary remain business data. Use an existing Student the signed-in account may already view. Opt-in neither grants view authority nor turns the Action into owner-only self-service.

## Mutation safety boundaries

The Student create, update and delete tools retain ordinary authentication, independent Action authorization and current-instance scope. They add **no server-side per-call confirmation gate**; client approval is not a server-verifiable grant.

Aggregate writes and sequential cascades can partially complete before a later failure. Current-instance scoping is not a transaction or concurrency guarantee; a root pre-read, wherever used, is not atomic against concurrent deletion. MCP adds no transaction, lock, aggregate atomicity, deduplication, automatic retry, replay safety or rollback-on-response-failure guarantee.

Errors, timeouts, lost responses and output-validation/delivery failures do not prove that no write occurred or that rollback happened. **Do not automatically replay uncertain mutations.** Null completion is not a substitute for separately authorized verification.

Dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas are not supplied for these examples. Ordinary logs are not protected audit or compliance proof. Existing per-worker bounds, actual-work settlement and shutdown drain remain; supporting a runtime mode is not deployment qualification.

## Supported actions and diagnostics

The mapper supports ordinary typed **JSON/200** Actions with representable path/query/JSON-body contracts and ordinary response handling. Files, uploads, streams, native request/response bindings, header-dependent contracts, custom response wrappers and non-200 responses are outside this profile. Do not approximate an Action by silently dropping its HTTP semantics.

Unsupported opted-in Actions are omitted and recorded in **`server.diagnostics`**, with `controller`, `action` and `reason` fields. These are operator-facing Controller/Action identifiers and bounded reasons, not machine-local paths or client error details. If a tool is missing, check module availability, Controller enablement, route registration, `includeTool`, own Action-level opt-in, `ssrSites`, scope and business authority, then inspect diagnostics for unsupported contracts. Undecorated Actions are skipped before names/contracts/diagnostics and have no unsupported-contract diagnostic entries.

Retained schema definitions are limited to those reachable from the advertised contract. A projection must not retain the original private DTO as an unused definition.

Keep raw `tools/list` JSON Schema, a client's model-visible declaration, and observed tool execution as separate evidence. A compact declaration alone is not proof of a universal recursion limit, successful business filtering or a particular agent call strategy.

### Trace tool calls and Boolean filters

The Controller-tool mapper emits three diagnostic events through the `mcp` logger child of the existing default client at `debug`. Use the normal [Logger Guide](/backend/logger-guide#level-control-and-transport-behavior) controls, such as `LOGGER_CLIENT_DEFAULT=debug`, when investigating calls. Set `LOGGER_CHILD_DEFAULT=mcp` to filter the default client's diagnostics to this child. No separate MCP logger client, logging switch or audit store is involved.

| Event                    | Meaning                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp.tool.call received` | The SDK reached the application `tools/call` callback with a request context. Malformed protocol envelopes can be rejected earlier.                                 |
| `mcp.tool.call dispatch` | Existing argument validation passed and the mapper is about to invoke the ordinary guarded Action. This does not mean its guards have admitted the operation.       |
| `mcp.tool.call settled`  | Server-side tool processing settled, with a fixed `outcome` and monotonic `durationMs`. This does not prove client receipt, rollback, or absence of partial writes. |

Each event includes a server-generated `callId` and the admitted tool name. Unknown or scope-ineligible names use the fixed label `unavailable`, without reflecting caller text. A call rejected before dispatch has only received/settled events. Outcomes are `success`, `unavailable`, `invalid_arguments`, `resource_not_found` or `action_failed`; opaque Action failures do not expose an authorization reason or exception detail.

Dispatch events include only the structure of validated policy-bound query arguments: declared named-filter names and canonical Boolean trees containing field/operator names. **All operands are omitted**, including numeric levels, IDs, timestamps and strings. Business bodies, result records, credentials and error objects are not logged. No-policy tools have no argument summary. Diagnostic summaries have fixed size/depth/node bounds and explicitly mark truncation.

For example, two calls with `{ "level": 1 }` and `{ "level": 2 }` produce different call IDs, each with `queries: [{ "namedFilters": ["level"] }]`. A single call with `where.or` instead produces one call ID and a dispatch projection like:

```json
{
  "queries": [
    {
      "namedFilters": [],
      "where": {
        "or": [
          { "field": "level", "op": "eq" },
          { "field": "level", "op": "eq" }
        ]
      }
    }
  ]
}
```

This distinguishes split calls from a combined Boolean filter without retaining business values. It does not reveal the original natural-language prompt, why the agent chose that strategy, which schema it cached, or whether two redacted operands differ. The call ID correlates these MCP events, not individual SQL statements. Existing thresholds, child filters, protected-request suppression and strict contract-generation suppression remain authoritative; missing events do not prove a call never occurred. Ordinary diagnostics are not protected audit.

## Source locations

Repository-relative locations:

- Decorator: `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/mcp.ts`
- Mapper: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts`
- Schema projection: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts`
- Shared ingress: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/bean/middlewareSystem.mcp.ts`
- Transport checks: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts`
- Authenticated exchange and settlement: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTransport.ts`
- Shared admission, custom scope resolution and fresh discovery guards: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/service/sharedBusinessTools.ts`, delegated through `src/lib/sharedBusinessTools.ts`
- Application-close drain: `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/src/monkey.ts`
- Student Controller: `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`
- Student DTOs: `vona/src/suite/a-training/modules/training-student/src/dto/`
- Student service: `vona/src/suite/a-training/modules/training-student/src/service/student.ts`

For the underlying contracts and guards, see [Controller Guide](/backend/controller-guide), [OpenAPI Guide](/backend/openapi-guide), [Validation Guide](/backend/validation-guide) and [Shared RBAC Architecture](/backend/shared-rbac-architecture).
