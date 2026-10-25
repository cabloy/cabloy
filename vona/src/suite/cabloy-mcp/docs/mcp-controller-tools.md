# MCP Controller Tools

Expose an existing Vona Controller Action as an MCP tool with `@mcp.tool()`. Reuse its request/response contract and ordinary authorization rather than writing a second business implementation.

The current integration is the authenticated **dev/test shared `/mcp` endpoint** in Cabloy Basic. It is not a production ingress or production-readiness claim. The independent anonymous standalone catalog remains exactly three synthetic fixture tools; it does not discover business actions.

## Opt in explicitly

```ts
import { mcp } from 'vona-module-a-openapiutils';
```

Exposure is **closed by default**:

- A method-level `@mcp.tool()` opts in only that registered Controller Action.
- A class-level `@mcp.tool()` opts in all supported, registered actions on that controller, with optional shared defaults. It does not expose arbitrary helper methods.
- There is **no exclusion/opt-out option**. For a narrower surface, leave the class undecorated and decorate selected methods instead. Class opt-in also includes future supported actions added to that controller.

MCP metadata is independent of `@Api.*` metadata. `@Api.exclude()` controls ordinary OpenAPI publication, not MCP exposure: an explicitly opted-in action can still become a tool, and an ordinary published HTTP action does not become a tool without MCP opt-in.

## Example: student summary

The existing `training-student` summary action adds the following decorator without changing its HTTP DTO, serializer or permissions:

```ts
@mcp.tool({
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

Pass the validated authorization scope, `mcp:read` or `mcp:all`, and dispatch within the authenticated application request context. Missing or unsupported scope fails closed. This factory creates the tool server, not OAuth ingress or a new authentication mechanism. The current dev/test shared endpoint already uses it.

- `mcp:read` lists **only read-only tools** and rejects direct calls to other tools, even when the caller knows their names.
- `mcp:all` allows both read and mutation classifications, subject to the same business authorization.
- Every call uses the ordinary action executor with **`innerAccess: false`**, preserving controller guards, RBAC, serialization, current user and instance/data scope. Neither scope nor the decorator grants business permissions or cross-instance access.

The mapper internally calls `generateJsonOfControllerAction(controller, action, 'V31', { includeExcluded: true })`. This fourth option enables contract extraction for an opted-in action without changing ordinary `@Api.exclude()` behavior. It is not a global OpenAPI-publication switch or an authorization bypass.

## Supported actions and diagnostics

The initial mapper supports ordinary typed **JSON/200** actions with representable path/query/JSON-body contracts and ordinary response handling. Files, uploads, streams, native request/response bindings, header-dependent contracts, custom response wrappers and non-200 responses are outside this profile. Do not expose an approximation that silently drops those semantics.

Unsupported opted-in actions are omitted and recorded on **`server.diagnostics`**, with `controller`, `action` and `reason` fields. These are operator-facing repository controller/action identifiers and bounded reasons, not machine-local paths or client error details. Inspect this collection when an opted-in action is missing. Schema definitions retained in a tool are limited to those reachable from its advertised contract; a projection must not retain the original private DTO as an unused definition.

## Source locations

Repository-relative locations for the current integration:

- Decorator: `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/mcp.ts`
- Mapper: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerTools.ts`
- Schema projection: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/controllerToolSchema.ts`
- Shared endpoint composition: `vona/src/suite/cabloy-mcp/modules/mcp-test/src/lib/sharedBusinessTools.ts`
- Student example: `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`

For the underlying contracts and guards, see [Controller Guide](../../../../../repo-docs/backend/controller-guide.md), [OpenAPI Guide](../../../../../repo-docs/backend/openapi-guide.md), [Validation Guide](../../../../../repo-docs/backend/validation-guide.md) and [RBAC Authorization](../../../../../repo-docs/backend/rbac-authorization.md).
