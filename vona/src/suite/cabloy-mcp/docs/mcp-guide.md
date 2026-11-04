# MCP Integration Guide

This guide describes the Cabloy Basic `cabloy-mcp` implementation. The reusable [`@Mcp.tool()` metadata](../../../../../repo-docs/backend/openapi-guide.md#mcp-tool-metadata) lives in `vona-module-a-openapiutils`; the decorator alone does not provide this runtime integration.

## Shared endpoint and tool admission

The normal authenticated endpoint is shared `/mcp`, owned by `cabloy-mcp`. Recognized dev/test/prod modes use the same OAuth, business-authorization and instance boundary. Production is not rejected solely by mode; unknown modes, not-ready, closing, disabled state and invalid required authority configuration fail closed. Only literal `CABLOY_MCP_ENABLED=false` disables the enabled-by-default integration.

Shared construction admits registered Resource controllers, not a Student action whitelist. A tool must have an enabled registered route, explicit method/class `@Mcp.tool()` opt-in and a supported contract. The implementation derives the Resource from the controller identity and requires its own entry in `recordResourceNameToRoutePath`. Nonresource fixtures are excluded from both listing and known-name direct calls.

The optional training suite supplies eight Student examples after lookup retirement: select, group, aggregate, view and summary reads, plus create, update and delete writes. These are not a catalog ceiling. Without training, Student tools disappear; other eligible Resource tools may remain. The three synthetic tools and anonymous standalone entry of the `mcp-test` launcher are not the shared endpoint.

## Authorization is checked independently

OAuth scopes are ceilings, not business-permission grants:

- `mcp:read` permits only tools classified as read-only; other tools are hidden and known-name calls are rejected before dispatch.
- `mcp:all` permits both classifications within the admitted catalog, subject to independent business authority.
- Discovery checks the current Action guards afresh and sequentially for each scope-eligible tool, without performing business reads or writes.
- Calls independently dispatch through the ordinary action executor with `innerAccess: false`. Discovery is not a reusable grant; guards, RBAC, serialization and current-instance scope still apply, including after permission revocation.

Class-level opt-in includes future supported registered actions. Use method-level decorators when eligibility should remain narrow. `readOnly` must describe actual behavior: GET inference and a decorator annotation are not proof that an action has no side effects.

## Mapping action contracts

The implementation reuses the existing action's path parameters, query, JSON body, validation and response contract rather than defining a second business API.

| Action input               | MCP arguments                                                                  |
| -------------------------- | ------------------------------------------------------------------------------ |
| One object-shaped location | Flat object, such as `{ "id": "…" }`                                           |
| Multiple locations         | Grouped object, such as `{ "params": { "id": "…" }, "body": { "name": "…" } }` |
| Scalar or array body       | `{ "body": value }`                                                            |
| No arguments               | Strict empty object `{}`                                                       |

Unknown arguments and undeclared controls are rejected before dispatch. Schema-declared dates accept ISO date-time JSON strings and bind as native Dates without enabling broad request coercion. Clients cannot choose a route, method, user, instance or executor option through extra arguments.

Object responses become structured content directly. Scalar and array responses use `{ "result": value }`; declared null completion becomes `{ "result": null }`. JSON text represents the same structured object. Output is validated, not replaced with raw action output after a validation failure. An undefined result or a missing object resource represented by null produces safe `Resource not found`; authorization, action and output-validation failures produce safe `Action failed`. Invalid arguments are protocol errors.

Method options override class defaults; `output.pick` arrays replace inherited arrays. The mapper applies this top-level output field allowlist to the runtime result and advertised schema without changing the HTTP DTO. Projection minimizes fields; it is not anonymization or authorization.

## Student read examples

| Tool                         | Required business authority | Existing response contract                                                                                                                   |
| ---------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `training_student_select`    | Student select              | Paginated `list`, string `total`, `pageNo`, `pageSize`, `pageCount`; serialized rows and masked mobile                                       |
| `training_student_group`     | Student select              | Grouped counts by level; string counts, wrapped in `result`                                                                                  |
| `training_student_aggregate` | Student select              | Ungrouped string counts                                                                                                                      |
| `training_student_view`      | Student view                | Complete serialized detail, including Markdown content, training records with nested subjects, optional image presentation and masked mobile |
| `training_student_summary`   | Student view                | Six-field projection: `id`, `name`, `level`, `levelTitle`, `descriptionLength`, `summaryText`                                                |

Select and view authority do not imply each other. All five reads are current-instance scoped. For name → ID → summary/view, call select with flat query arguments such as `{ "name": "Student", "pageNo": 1, "pageSize": 10 }`, choose the matching `list` row's returned `id`, then call summary or view with `{ "id": "<returned student ID>" }` only with independent view permission. Select uses the existing LIKE name filter: `%` and `_` retain wildcard meaning and are not literal-escaped. It returns complete serialized rows, including masked mobile, not the retired lookup's three-field projection or its dedicated page bounds. Pagination follows the existing select contract; full detail does not add detail joins to select or expand summary's six-field projection.

Image presentation is existing URL data, not an MCP image block or UI resource. Absolute URLs do not guarantee external reachability or inline rendering in a client.

## Student mutation examples

Each mutation requires `mcp:all` and its own current Student business permission. Create, update, delete, select and view authority do not grant one another. `mcp:read` hides all three mutations and rejects their direct calls.

### Create

`training_student_create` binds flat arguments to the existing `DtoStudentCreate` body of guarded `POST /training/student`:

```json
{ "name": "Synthetic student", "mobile": "13812345678", "level": 1 }
```

The aggregate contract also supports optional Markdown content and training records with nested subjects. Nested subject identity/deletion controls and caller-controlled relation parent foreign keys are omitted from the create contract; undeclared controls are rejected. Existing ownership checks remain. The scalar created identity becomes `{ "result": "<created student ID>" }`, not a read-back detail object.

### Update

`training_student_update` binds grouped arguments to guarded `PATCH /training/student/:id`:

```json
{
  "params": { "id": "<existing student ID>" },
  "body": { "name": "Student name", "mobile": "13812345678", "level": 1 }
}
```

Despite PATCH, `DtoStudentUpdate` requires `name`, `mobile` and `level`; it is not a partial-patch or basic-fields-only contract. It accepts the complete existing aggregate, including optional `imageId`, content, and existing/new training records with nested subjects. Declared nested `id` and `deleted` controls can update or delete children; deletion entries still require their DTO-required business fields. Parent foreign keys are omitted, unknown controls are rejected, and cross-parent ownership checks remain.

The service first reads the root through ordinary current-instance Model scope. A missing, deleted or out-of-instance root returns before content preparation or nested writes. Completion is `{ "result": null }`, including for an absent root; it proves neither existence nor affected rows. Read-back is a separate operation requiring view authority.

### Delete

`training_student_delete` takes flat params `{ "id": "<existing student ID>" }` and targets guarded `DELETE /training/student/:id`. No undeclared body, route, method, instance, identity, executor or confirmation controls are accepted.

This is destructive aggregate soft deletion of Student, content, training records and nested subjects, not root-only deletion. Soft deletion promises neither recoverability nor indefinite retention; later pruning may remove rows. No attachment/blob deletion or restore capability is promised. `deleteForce` and bulk actions are not opted in for this example; that is not a blanket exclusion of other eligible Resource mutations.

The service reads the root through current-instance scope before cascading; absent roots do not trigger descendant deletion. `{ "result": null }` acknowledges completion only, not root existence, affected rows, complete cascade or successful read-back. Missing, deleted and out-of-instance roots return the same nondisclosing completion.

## Mutation and operational limits

Root admission pre-reads are not atomic against concurrent deletion. Aggregate writes and sequential cascades can partially complete before a later failure; no new transaction, lock, atomicity or rollback guarantee is supplied. Create is non-idempotent, and update can create or delete children.

There is no automatic retry, deduplication, replay-safety or rollback-on-response-failure guarantee. Errors, timeouts, lost responses and output failures do not prove that no write occurred. **Do not automatically replay uncertain mutations.**

The named Student create, update and delete tools add no new server-side per-call confirmation gate. Client approval is not a server-verifiable grant. Dedicated protected audit, audit-outage availability gating and deployment-wide fine-grained quotas are deferred for these named tools and the five reads. Ordinary logs are not protected audit or compliance proof. Existing authorization, per-worker bounds, actual-work settlement and shutdown drain remain; this guide claims neither audit compliance nor deployment/release qualification.

## Source reading pointers

- Metadata: `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/mcp.ts`
- Contract mapper: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts`
- Shared ingress: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/bean/middlewareSystem.mcp.ts`
- Transport checks: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/mcpTransport.ts`
- Authenticated exchange and settlement: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTransport.ts`
- Resource admission and fresh discovery: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/service/sharedBusinessTools.ts`
- Shutdown drain: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/monkey.ts`
