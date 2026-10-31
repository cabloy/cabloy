# MCP Controller Tools

Opt an existing Vona Controller Action into MCP mapping with `@Mcp.tool()`. Reuse its request/response contract and ordinary authorization rather than writing a second business implementation. Opt-in alone does **not** expose an action on normal `/mcp`; that endpoint also requires server-owned Resource construction admission, a supported contract, OAuth scope eligibility and current business authorization.

The current normal integration is the authenticated **shared `/mcp` endpoint** in Cabloy Basic, owned by `cabloy-mcp`, not `mcp-test`. Recognized dev/test/prod modes use the same OAuth, business-authorization and instance boundary; production is not rejected solely by mode. Unknown modes and invalid required authority configuration still fail closed. Dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas are deferred for the four reads and individually admitted Student create, update and delete tools; no audit compliance or deployment qualification is claimed. Existing per-worker bounds, actual-work settlement and shutdown drain remain. `cabloy-mcp` remains enabled by default: only the literal environment value `CABLOY_MCP_ENABLED=false` disables it. Readiness, shutdown and disabled-state checks also fail closed. The independent anonymous standalone catalog remains exactly three synthetic fixture tools owned by the `mcp-test` launcher; none is admitted on normal `/mcp`.

## Opt in explicitly

```ts
import { Mcp } from 'vona-module-a-openapiutils';
```

Mapping is **closed by default**:

- A method-level `@Mcp.tool()` opts in only that registered Controller Action.
- A class-level `@Mcp.tool()` opts in all supported, registered actions on that controller, with optional shared defaults. It does not expose arbitrary helper methods.
- There is **no decorator exclusion/opt-out option**. For narrower mapping eligibility, leave the class undecorated and decorate selected methods instead. Class opt-in also includes future supported actions added to that controller; on a registered Resource controller, these can enter normal ingress subject to the same scope and authorization boundary.

Normal shared composition uses the factory's construction-time `includeTool` callback to admit registered Resource controllers, not a student controller/action whitelist. It derives the resource with `onionNameFromBeanFullName(controller)` and requires an own entry in `recordResourceNameToRoutePath`. The factory still requires an enabled registered route, explicit method/class `@Mcp.tool()` opt-in and a supported contract. Nonresource controllers, including synthetic fixtures, never enter the shared tool map and cannot be listed or directly called by name. The seven current student actions (`create`, `select`, `lookup`, `view`, `update`, `summary` and `delete`) are examples, not a catalog ceiling. Training is optional: its absence removes student tools, not necessarily other eligible Resource tools, and does not enable fixture fallback.

MCP metadata is independent of `@Api.*` metadata. `@Api.exclude()` controls ordinary OpenAPI publication, not MCP mapping: an explicitly opted-in, admitted action can still become a tool, and an ordinary published HTTP action does not become a tool without MCP opt-in.

## Example: student create

`training_student_create` opts in only the existing `create()` Action:

```ts
@Mcp.tool({
  name: 'training_student_create',
  description:
    'Create a student using your current student-create permission and instance. Uses the existing create contract, including optional content and training records with subjects. Non-idempotent; repeating a call can create additional data.',
  readOnly: false,
})
```

It requires `mcp:all` and independent current student-create permission in the active instance. Call with the flat existing `DtoStudentCreate` body, for example `{ "name": "Synthetic student", "mobile": "13812345678", "level": 1 }`. Optional content and training records with nested subjects follow that same DTO; the create DTO now omits writable nested subject identity/deletion controls, and MCP rejects unknown nested controls before dispatch. Schema-declared dates such as nested `trainingTime` accept ISO date-time JSON strings and bind as native Dates while broad request coercion remains disabled. The authenticated HTTP regression covers synthetic aggregate persistence, independent authority, no-write denials and current-instance isolation; this is local proof, not an actual-client or deployment claim. Parent-FK checks remain, but a deeper write failure may follow partial insertion. The fixed target remains guarded `POST /training/student` with `innerAccess: false`. The existing created identity becomes `{ "result": "<created student ID>" }` in both structured and JSON-text content, not a read-back detail object.

This is a non-idempotent persisted aggregate write. Repeating a call can create additional data; no automatic retry, deduplication, rollback-on-response-failure or new atomicity is promised. A lost or invalid response does not prove no write occurred. This individually admitted mutation adds no server-side per-call confirmation gate and explicitly defers dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas, not audit compliance. Its admission does not authorize other mutations; update is separately admitted below. The current student example also opts in ordinary single-record delete, described below; its `deleteForce` and bulk actions are not opted in. Other Resource mutations follow the same registration, opt-in, contract, scope and authorization requirements.

## Example: complete student update

**Local update regression (2026-10-30):** the complete grouped aggregate passes authenticated HTTP verification, including nested creation/update/deletion, independently authorized read-back, null completion and root/child ownership boundaries. The separately approved shared-reader correction accepts value depth 9 (root = 1), retaining the eight-container parser ceiling and all other byte/node/key/array/string/duplicate-key bounds; exact edge regressions pass. This supersedes the earlier depth-8 qualification stop without erasing its failure history. Local proof is not actual-client, deployment or release qualification; do not bypass ingress or automatically replay an uncertain mutation.

`training_student_update` opts in only the existing `update()` Action and is one of the current student tools in normal shared composition. It requires `mcp:all` and independent current student-update permission in the active instance. Create, select and view authority do not grant update; update authority does not grant those other actions. `mcp:read` hides update and rejects known-name calls before dispatch.

The fixed target remains guarded `PATCH /training/student/:id` with `innerAccess: false`. Unlike create's flat body, update uses **grouped params/body arguments**:

```json
{
  "params": { "id": "<existing student ID>" },
  "body": { "name": "Student name", "mobile": "13812345678", "level": 1 }
}
```

`body.name`, `body.mobile` and `body.level` are required by the existing `DtoStudentUpdate`. The PATCH route is not a partial-patch or basic-fields-only contract. The complete existing aggregate contract includes parent fields and optional `imageId`, `content.descriptionMarkdown`, and existing/new `trainingRecords` with nested `trainingRecordSubjects`. Declared nested `id` and `deleted` controls allow child updates and deletion; deletion entries still require their DTO-required business fields. These are potentially destructive effects, not a non-destructive write or a standalone root-delete tool. Caller-controlled relation parent foreign keys are omitted, undeclared controls are rejected before dispatch, and existing cross-parent record/subject validation remains. Schema-declared dates such as `trainingTime` accept ISO date-time strings and bind as native Dates without enabling broad request coercion.

Before content preparation or any update/relation mutation, the shared service reads the root through the ordinary current-instance Model scope. Missing, deleted and out-of-instance roots are equally absent and return without nested writes at admission. This is a no-op with the existing empty completion, not a new not-found error or a cross-instance existence probe. The pre-read is **not atomic against concurrent deletion**; it adds no transaction, lock, rollback or aggregate atomicity guarantee. A later cross-parent or deeper write failure may follow earlier successful writes and leave partial changes.

The existing controller returns `Promise<void>` with `@Api.body(z.null())`; the ordinary response path yields null. MCP represents it as **`{ "result": null }`** in both structured content and equivalent JSON-text content. This is completion acknowledgment only, not root-existence, affected-row or read-back proof. An absent root returns the same null completion. A subsequent view is a separate operation requiring independent view authority.

Update adds no automatic retry, deduplication or rollback-on-response-failure. It can create children and delete them; replay after an error, lost response or invalid response is unsafe because partial writes may already have occurred. Its individual bounded disposition explicitly adds **no new server-side per-call confirmation gate** and defers **dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas**, including for nested deletion. This is separate update authority, not inherited create approval, audit compliance or deployment qualification. Existing authorization, runtime bounds, actual-work settlement and drain remain. The current student example also opts in ordinary single-record delete below; its `deleteForce` and bulk actions are not opted in. Other eligible Resource mutations are not excluded by a student-only allowlist.

## Example: student delete

`training_student_delete` is one of the current normal authenticated student tools. It requires **`mcp:all` and independent current student-delete permission** in the active instance. Create, update, select and view authority do not grant delete; delete grants none of them. `mcp:read` hides all three mutations and rejects their known-name calls before dispatch. Discovery checks current guards only, without row probes or trial deletion; calls independently reauthorize.

Delete takes a **flat params contract**, unlike grouped update:

```json
{ "id": "<existing student ID>" }
```

The fixed target is guarded `DELETE /training/student/:id`, with exactly `{ params: { id }, innerAccess: false }`. Existing string/number identity validation is retained; undeclared body, route, method, instance, Passport, executor and confirmation controls are rejected before dispatch. The existing void/null response becomes **`{ "result": null }`** in equivalent structured and JSON-text content. This acknowledges completion only, not root existence, affected rows, complete cascade or independently authorized read-back. Missing, deleted and out-of-instance roots return the same nondisclosing completion.

This is **destructive aggregate soft deletion** of Student, content, training records and nested subjects, not root-only deletion. Soft deletion promises neither recoverability nor indefinite retention; existing pruning may later remove rows. No attachment/blob deletion or restore capability is promised. The shared ordinary-delete service first reads the root through current-instance Model scope and returns before any cascade when it is absent. This prevents the cache-enabled requested-ID shortcut from cascading into active current-instance descendants of an absent root; it is not a cross-instance existence probe. The pre-read is **not atomic against concurrent deletion**. Existing sequential cascade can partially complete; no new transaction, lock, atomicity or rollback guarantee is added.

Delete is individually accepted **without a new server-side per-call confirmation gate**; no confirmation flag/store/UI is introduced, and client approval is not a server-verifiable grant. Dedicated protected audit, audit-delivery/outage gating and deployment-wide fine-grained/fleet quotas are explicitly deferred for this named tool, not inherited from create/update. Ordinary logs are not protected audit or compliance proof. Existing authorization, privacy, runtime bounds, actual-work settlement and drain remain. Errors, timeouts, lost responses and output/delivery failures do not prove rollback. No automatic retry, deduplication, replay-safety or new idempotency guarantee is supplied: **do not automatically replay uncertain deletion**. Student `deleteForce` and `deleteBulk` remain excluded because they are not opted in; anonymous business deletion remains excluded. This is not a blanket exclusion of other eligible Resource mutations. Local verification is separate from actual-client deletion, deployment and release qualification.

## Example: complete student select

`training_student_select` exposes the existing `select()` Action without an MCP output projection:

```ts
@Mcp.tool({
  name: 'training_student_select',
  description:
    'Select students using your current student-select permission and instance. Returns the complete existing paginated select response with serialized row fields, including masked mobile.',
  readOnly: true,
})
```

Call it with flat query arguments, for example `{ "name": "Student", "level": 2, "pageNo": 1, "pageSize": 10 }`. The existing `@Arg.filter(DtoStudentSelectReq)` also supports `createdAt`, `columns`, `where` and `orders`; their semantics and configured pagination bounds come from the existing HTTP Action, not lookup's narrower contract. Unknown authority/executor arguments remain invalid.

The result retains the complete existing `DtoStudentSelectRes`: `list`, string `total`, `pageNo`, `pageSize` and `pageCount`. Row fields use the existing DTO and serializer, including mobile masking and optional image resolution. This does not load new relations/full notes, disable serialization or fetch every page. UI renderer/page metadata in the schema does not create extra row values. Caller-selected `columns` must still satisfy the response DTO; incompatible projections return safe `Action failed`, never unvalidated raw output.

## Example: complete student view

`training_student_view` exposes the existing `view()` Action without an MCP output projection. Call it with `{ "id": "<existing student ID>" }`; the ID binds to the existing `GET :id` path parameter and retains `v.tableIdentity()` validation. The optional `DtoStudentView`, serializer, student-view RBAC and instance-scoped service remain unchanged.

The result retains the complete existing serialized `DtoStudentView`, including full `content.descriptionMarkdown`, `trainingRecords` with nested `trainingRecordSubjects`, optional `image` URL presentation and masked mobile. Full Markdown and these nested details are intentionally available under the existing view authority; this does not extend lookup/summary disclosure or add detail joins to select. Missing or out-of-instance students return the same safe not-found result described below.

The optional image remains the existing URL presentation object, not an MCP image block or UI resource. Returning Markdown, nested data and image presentation does not guarantee client rendering, expandable UI or URL reachability.

## Example: student summary

The existing `training-student` summary action adds the following decorator without changing its HTTP DTO, serializer or permissions:

```ts
@Mcp.tool({
  name: 'training_student_summary',
  description:
    'Read a student summary by ID using your current student-view permission and instance. Excludes mobile and full notes.',
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

Call `training_student_summary` with `{ "id": "<existing student ID>" }`. The result contains exactly `id`, `name`, `level`, `levelTitle`, `descriptionLength` and `summaryText`. Mobile and full Markdown/HTML notes are absent from both the runtime result and the advertised output schema, including its reachable schema definitions. Projection is field minimization, not anonymization: the name and summary remain business data.

Use an existing student the signed-in account may already view. MCP opt-in does not grant student-view permission, change the HTTP response contract or turn this action into owner-only self-service.

## Options and defaults

| Option        | Meaning                                                                                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Method-only public tool name override. Otherwise the stable default is `module_controller_action`, with unsupported characters in the controller identity replaced by `_`. Names must be unique and contain 1–128 letters, digits, `_` or `-`. |
| `description` | Tool description; accepts text or locale metadata. Falls back to the action's OpenAPI description, summary, then controller/action identity.                                                                                                   |
| `readOnly`    | Explicit read classification. Otherwise inherited from the controller, then inferred as `true` for GET and `false` for other methods.                                                                                                          |
| `output.pick` | Top-level object response field allowlist, applied to runtime validation/projection and the advertised schema closure. It does not alter the HTTP DTO.                                                                                         |

Method options override class defaults. Arrays such as `output.pick` **replace**, rather than append to, inherited arrays. Unknown projection fields, invalid names and duplicate names are configuration errors, not a reason to fall back to unvalidated output.

GET-based read inference is a convention, not proof that an action has no side effects. Classify actual behavior accurately; a misleading `readOnly: true` would weaken the read-only scope boundary.

## Arguments and results

Request contracts come from the existing action's path parameters, query and JSON body:

| Action input                                              | Tool arguments                                                                                                                                 |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| One object-shaped location, such as path parameters alone | Flat object, for example `{ "id": "…" }`                                                                                                       |
| Multiple locations                                        | Grouped object, for example `{ "params": { "id": "…" }, "query": { "verbose": true }, "body": { "name": "…" } }`; include only declared groups |
| Scalar or array body                                      | `{ "body": value }`                                                                                                                            |
| No arguments                                              | Strict empty object `{}`                                                                                                                       |

Unknown top-level arguments and unknown fields in the location objects are rejected. Empty path-parameter strings are also rejected because they cannot represent a route segment. Both the advertised input contract and the action's runtime validators are used; clients cannot select a route, HTTP method, identity, instance or executor option through extra arguments.

Object results become `structuredContent` directly. Array and scalar results use `{ "result": value }`; a declared scalar `null` result can therefore be represented as `{ "result": null }`. The JSON in text content represents that same structured object, not a separate response shape. The mapper validates the result and never falls back to publishing the raw action response.

An `undefined` result or a missing object resource represented by `null` returns an error tool result with safe text `Resource not found`. Authorization failures, action failures and output-validation failures return `Action failed`, without raw exceptions or private data. Invalid tool arguments are protocol errors.

## Factory and authorization boundary

The decorator and metadata live in `vona-module-a-openapiutils`; MCP runtime mapping and SDK dependencies live in `vona-module-cabloy-mcp`:

```ts
import { createControllerToolServer } from 'vona-module-cabloy-mcp';

const server = await createControllerToolServer(app, scope);
```

Pass the validated authorization scope, `mcp:read` or `mcp:all`, and dispatch within the authenticated application request context. Missing or unsupported scope fails closed. This factory creates the tool server, not OAuth ingress or a new authentication mechanism. The two-argument example is the generic factory API, **not** the normal ingress composition: normal `/mcp` uses `createSharedBusinessToolServer`, which delegates to the shared service for Resource construction admission and permission-aware discovery as described below. Do not replace that composition with unrestricted factory discovery.

- `mcp:read` lists **only read-only tools** and rejects direct calls to other tools, even when the caller knows their names.
- `mcp:all` permits both classifications within the constructed catalog, subject to the same business authorization. Student create, update and delete each require their independent current business authority. Student `deleteForce`/bulk actions lack opt-in, and nonresource fixture/test controllers fail shared Resource admission.
- Every call uses the ordinary action executor with **`innerAccess: false`**, preserving controller guards, RBAC, serialization, current user and instance/data scope. Neither scope nor the decorator grants business permissions or cross-instance access.

### Resource permission-aware discovery (student example)

On the authenticated shared endpoint, `training_student_select` and `training_student_view` are listed only when the current request passes their existing select and view Action guards respectively. `training_student_lookup` uses its own Action guards with inherited student-select permission; `training_student_summary` uses summary Action guards with inherited student-view permission. Neither permission implies the other. The read-only portion is:

| Current student read authority | Read tools listed |
| ------------------------------ | ----------------- |
| Neither                        | None              |
| Select only                    | Select and lookup |
| View only                      | View and summary  |
| Both                           | All four reads    |

Independent create, update and delete authority respectively add `training_student_create`, `training_student_update` and `training_student_delete` only under `mcp:all`. No mutation permission grants reads or another mutation. With all corresponding student business authority, `mcp:all` lists the seven student tools and `mcp:read` lists the four student reads; other eligible Resource tools may also appear. `mcp:read` filters all three mutations before visibility checks and rejects their direct calls before dispatch.

All four read tools remain eligible under `mcp:read` and `mcp:all`; OAuth scopes are ceilings, not business-permission grants. Every list checks the current Passport and registered Actions afresh, sequentially on its request context, without executing student Actions, trial writes or student-row queries. Visibility means Action admission, not that a matching student exists. Call-time guards still run independently, so revocation after a list denies a known-name call.

The shared service supplies the factory's optional third argument with two distinct server-owned callbacks: `includeTool({ controller, action }): boolean` gates construction for **both list and direct calls** using the derived resource's own registration entry, while `isToolVisible({ controller, action }): Promise<boolean>` filters discovery after scope filtering. Neither is client-provided policy or a substitute for call authorization. On every list, visibility checks `permission.checkPermissionActionGuards(derivedResource, actualAction)` afresh and sequentially for each scope-eligible tool. This bypasses permission-result caching and matcher projection while retaining the actual guards and restoring context state; it does not execute business Actions. Ordinary denial omits a tool; an unexpected visibility error fails the whole list with a nondiagnostic protocol error, never partial tools or an unfiltered fallback. Direct calls use ordinary `executor.performAction` with `innerAccess: false` and execute their actual Action guards independently, without reusing visibility as a grant.

Normal `/mcp` is Resource-backed rather than student-only: other registered Resource controllers can contribute enabled, opted-in, supported actions under the same scope and permission rules. The no-hook generic factory retains its previous behavior, and the anonymous standalone still lists exactly its three fixture tools only through the `mcp-test` launcher. This Resource catalog rule does not establish deployment qualification or a client cache-invalidation guarantee. Select retains the complete existing serialized select response. View retains the complete existing serialized detail DTO under view authority. Lookup remains a select-authorized, current-instance read returning only student ID, name and level; it does not grant view/summary authority. Summary retains its independent view permission and six-field projection.

The mapper internally calls `generateJsonOfControllerAction(controller, action, 'V31', { includeExcluded: true })`. This fourth option enables contract extraction for an opted-in action without changing ordinary `@Api.exclude()` behavior. It is not a global OpenAPI-publication switch or an authorization bypass.

## Supported actions and diagnostics

The initial mapper supports ordinary typed **JSON/200** actions with representable path/query/JSON-body contracts and ordinary response handling. Files, uploads, streams, native request/response bindings, header-dependent contracts, custom response wrappers and non-200 responses are outside this profile. Do not expose an approximation that silently drops those semantics.

Unsupported opted-in actions are omitted and recorded on **`server.diagnostics`**, with `controller`, `action` and `reason` fields. These are operator-facing repository controller/action identifiers and bounded reasons, not machine-local paths or client error details. Inspect this collection when an opted-in action is missing. Schema definitions retained in a tool are limited to those reachable from its advertised contract; a projection must not retain the original private DTO as an unused definition.

## Source locations

Repository-relative locations for the current integration:

- Decorator: `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/mcp.ts`
- Mapper: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts`
- Schema projection: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts`
- Normal ingress middleware: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/bean/middlewareSystem.mcp.ts`
- Normal ingress checks: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts`
- Authenticated exchange and settlement: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTransport.ts`
- Resource admission and fresh discovery guards: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/service/sharedBusinessTools.ts` (delegated through `src/lib/sharedBusinessTools.ts`)
- Application-close drain: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/monkey.ts`
- Student example: `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`

For the underlying contracts and guards, see [Controller Guide](../../../../../repo-docs/backend/controller-guide.md), [OpenAPI Guide](../../../../../repo-docs/backend/openapi-guide.md), [Validation Guide](../../../../../repo-docs/backend/validation-guide.md) and [RBAC Authorization](../../../../../repo-docs/backend/rbac-authorization.md).
