# Controller Guide

This guide explains how controllers work in Vona within the Cabloy monorepo.

## Why controllers matter

Controllers are the HTTP-facing contract surface of the backend.

They define how routes, request parameters, validation, response typing, and OpenAPI metadata meet the rest of the backend thread.

A useful contract-loop mental model is:

- controller defines the route and request/response surface
- service owns orchestration
- model and entity shape persistence behavior
- DTOs and validation shape explicit request/response contracts
- OpenAPI emits the machine-readable contract that frontend SDK generation can consume

## Create a controller

Example: create a controller named `student` in module `training-student`.

### CLI command

```bash
npm run vona :create:bean controller student -- --module=training-student
```

## Controller definition

Representative pattern:

```typescript
@Controller<IControllerOptionsStudent>('student')
export class ControllerStudent extends BeanBase {
  @Web.post('')
  @Api.body(v.tableIdentity())
  async create(@Arg.body() student: DtoStudentCreate): Promise<TableIdentity> {
    return (await this.scope.service.student.create(student)).id;
  }
}
```

The most important things to notice are:

- the controller path is declared in `@Controller(...)`
- the action path and request method are declared with `@Web.*`
- request parameters are declared with `@Arg.*`
- response metadata can be enriched for validation and OpenAPI generation

## Route composition

Vona uses automatic route registration for controller actions that use `@Web` decorators.

The general route model is:

```text
Route Path = GlobalPrefix + Module Url + Controller Path + Action Path
```

Important pieces:

- `GlobalPrefix`: from project config, commonly `/api`
- `Module Url`: derived from the module name
- controller path and action path: defined in the controller itself

## Route simplification rules

Three useful simplification rules apply here.

### 1. Remove duplicate module path fragments

If the controller path matches the module name, the duplicate fragment is removed from the final route.

### 2. Leading `/` removes the module URL

If the controller path or action path starts with `/`, the module URL is removed.

### 3. Leading `//` removes both global prefix and module URL

If the controller path or action path starts with `//`, both the global prefix and module URL are removed.

This is useful for special routes such as the project homepage or a shared non-module-prefixed API path.

## Request methods

Vona groups HTTP method decorators under `@Web`, which helps reduce mental overhead.

Representative methods include:

- `@Web.post`
- `@Web.get`
- `@Web.delete`
- `@Web.put`
- `@Web.patch`
- `@Web.options`
- `@Web.head`

## Request parameters

Vona groups request-parameter decorators under `@Arg`.

Representative parameter decorators include:

- `@Arg.param`
- `@Arg.query`
- `@Arg.body`
- `@Arg.headers`
- `@Arg.fields`
- `@Arg.field`
- `@Arg.files`
- `@Arg.file`
- `@Arg.user`

These decorators are also the main request-parameter surface for multipart upload flows; see [Upload Guide](/backend/upload-guide).

## Parameter extraction patterns

A useful distinction is:

- specify a field name when you want one parameter only
- omit the field name when you want the whole structured object

Representative patterns:

```typescript
findOne(@Arg.query('id') id: number) {}
```

```typescript
class DtoStudentInfo {
  id: number;
  name: string;
}

findOne(@Arg.query() query: DtoStudentInfo) {
  console.log(query.id, query.name);
}
```

This matters because controller signatures can express both simple and structured request shapes without leaving the framework’s contract surface.

## Compact action-signature patterns

A practical controller signature often combines route params, request body typing, and response metadata in one place.

Representative pattern:

```typescript
@Web.patch('updateUser/:id')
async updateUser(
  @Arg.param('id') id: TableIdentity,
  @Arg.body(v.object(DtoUserUpdate)) user: DtoUserUpdate,
): Promise<void> {
  await this.scope.service.user.update(id, user);
}
```

When the response contract should follow inferred DTO shape directly, a pattern like this is also common:

```typescript
@Web.get('getUserDynamic')
@Api.body($Dto.get('test-vona:post'))
getPostDynamic() {}
```

A practical rule is:

- use `@Arg.param(...)` and `@Arg.body(...)` together when the action mixes route identity and structured payload input
- use return-type inference when the response contract is obvious
- use `@Api.body(...)` when the response should expose a more specific inferred or customized contract shape

## Validation, OpenAPI, and Controller AOP

Controllers are strongly connected to three related capabilities:

- parameter validation based on Zod-oriented patterns
- Swagger/OpenAPI generation
- middleware, guards, interceptors, pipes, and filters around the request path

In practice, that means controllers are not only request handlers. They are also a key place where request and response shape become machine-readable for tooling and frontend integration, and where request-path policies are composed through controller AOP.

For a dedicated explanation of middleware, guards, interceptors, pipes, and filters, see [Controller AOP Guide](/backend/controller-aop-guide).

## Response body typing and schema declaration

Vona can often infer response schema from the declared return type.

Representative automatically inferred cases include:

- basic types such as `string`, `number`, and `boolean`
- DTO classes
- Entity classes

When inference is not enough, use explicit schema declaration.

Representative pattern:

```typescript
@Api.body(v.array(String))
findOne(): string[] {
  return ['Tom'];
}
```

A practical rule is:

- use return-type inference when the contract is obvious and simple
- use explicit `@Api.body(...)` when the response shape needs more control or the inference boundary becomes unclear

## Resource mutation response contract

Standard resource `update` and `delete` actions are command-style actions. Their public contract is successful completion, not an implicit persistence-model payload.

Representative pattern:

```typescript
import { z } from 'zod';

@Web.patch(':id')
@Api.body(z.null())
@Passport.systemAdmin()
async update(
  @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  @Arg.body() student: DtoStudentUpdate,
): Promise<void> {
  await this.scope.service.student.update(id, student);
}
```

Use `await` without `return` at the controller boundary. A service or model may still return mutation data for internal orchestration, but that data is not automatically a stable public representation of the resource.

`Promise<void>` expresses the controller's command semantics, while `@Api.body(z.null())` explicitly supplies the response schema that runtime reflection cannot recover from `Promise<void>`. It makes the existing no-payload response visible to emitted OpenAPI and generated SDK consumers.

For a standard JSON action, Vona maps this no-result controller completion to its normal HTTP `200` success wrapper:

```typescript
{
  code: 0,
  message: 'success',
  data: null,
}
```

This is Vona's default resource-mutation convention. It does not use HTTP `204 No Content`, so consumers can keep one uniform success-envelope protocol.

### When a mutation should return data

Return data only when it is an intentional consumer-facing contract, such as an updated response DTO, a version token, or a job handle. Declare that shape explicitly with `@Api.body(...)`; add `@Core.serializer()` when the response depends on serializer transforms, exclusions, getters, or replacements. Do not forward raw ORM or service mutation results merely because the delegated method returns a value.

`create` and read actions commonly expose an identity or DTO and therefore use their own explicit response contracts. For generated resource defaults, see [CRUD Workflow](/backend/crud-workflow#generated-mutation-response-default). For action-level verification, see [Unit Testing](/backend/unit-testing#testing-controllers-through-actions). When a declared response shape changes, follow the [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) contract loop.

## Response wrapper behavior

By default, Vona wraps the response body in a standard wrapper object.

That means a plain response value conceptually becomes a response shape like:

```typescript
{
  code: string;
  message: string;
  data: string;
}
```

### Disable the wrapper

Use `@Api.bodyCustom(false)` when the endpoint should return the body directly.

Representative pattern:

```typescript
@Api.bodyCustom(false)
findOne(): string {
  return 'Tom';
}
```

### Provide a custom wrapper

Use `@Api.bodyCustom(...)` with a wrapper function when the project needs a different response envelope.

Representative pattern:

```typescript
@Api.bodyCustom(bodySchemaWrapperCustom)
findOne(): string {
  return 'Tom';
}
```

This is one of the most important response-contract choices because it affects backend OpenAPI output and frontend SDK consumption.

Other response/action metadata patterns can also be expressed at the controller surface, including representative cases such as:

- `contentType`
- `httpCode`
- `headers`
- `setHeaders`
- `exclude`
- `tags`

Use those when the runtime behavior and the machine-readable contract should stay aligned in one place.

## Action options

Vona actions can carry additional metadata directly in `@Web.*` options.

Representative pattern:

```typescript
@Web.get(':id', {
  tags: ['Student'],
  description: 'Find a student',
})
findOne(@Arg.param('id') id: number): EntityStudent {}
```

Representative action-option areas include:

- `description`
- `summary`
- `httpCode`
- `contentType`
- `bodySchema`
- `bodySchemaWrapper`
- `exclude`
- `tags`
- `operationId`
- `headers`
- `setHeaders`

This matters because controller actions are one of the main places where runtime behavior and machine-readable API description meet.

## Controller options

Controllers can also carry higher-level options.

Representative pattern:

```typescript
@Controller('student', {
  description: 'Student controller',
  summary: 'Student API',
  exclude: false,
  tags: ['Student'],
})
class ControllerStudent {}
```

Representative controller-option areas include:

- `description`
- `summary`
- `exclude`
- `tags`
- `actions`
- `enable`
- `meta`

`description` and `summary` at the controller level are controller metadata. They are independent from the operation metadata supplied to `@Web.*`: controller values do not become defaults for an action's OpenAPI `description` or `summary`. Set those fields on the action when documenting a specific operation.

This is especially important because the controller surface can also be tuned from app config through onion/config override patterns.

## RBAC presentation metadata

Some Cabloy editions or module sets provide `@Passport.rbac(...)` for dynamic RBAC actions. Verify that the active edition and installed modules provide this decorator before applying the following convention.

For every action decorated with `@Passport.rbac(...)`, provide a locale-aware `summary` at both the controller and action levels:

```typescript
@Controller('student', {
  summary: $locale('StudentControllerSummary'),
})
class ControllerStudent extends BeanBase {
  @Web.get(':id', {
    summary: $locale('StudentViewSummary'),
  })
  @Passport.rbac({ dataScope: true })
  async view(@Arg.param('id') id: number) {
    // ...
  }
}
```

Controller and action `summary` values are independent metadata. A controller summary does not automatically become the action's OpenAPI summary, so define both explicitly. Add locale-aware `description` metadata at either level when the business or administrative experience needs additional explanation; descriptions are optional.

A policy catalog or editor may project these fields as localized display labels, but only through an explicit server-side projection. `summary` and `description` are presentation metadata: they do not define the RBAC action key, select a policy, change a route or `operationId`, or grant authorization. Keep action keys, controller bean names, action names, routes, and other integration identifiers stable and nonlocalized. Do not assume that OpenAPI metadata is automatically included in a policy catalog; inspect the active implementation.

See [Controller AOP Guide](/backend/controller-aop-guide) for the guard boundary and edition-aware RBAC notes.

## Relationship to the backend contract loop

Read this guide together with:

- [Validation Guide](/backend/validation-guide)
- [DTO Guide](/backend/dto-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [CRUD Workflow](/backend/crud-workflow)
- [Unit Testing](/backend/unit-testing)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

A practical split is:

- controllers define the route and contract surface
- validation and DTOs define the request/response schema language
- OpenAPI emits the machine-readable contract
- CRUD generation instantiates the thread quickly
- tests verify the contract through action execution

## Practical implications for controller implementation

When creating or editing a controller, preserve the Vona controller model instead of rewriting it into a generic framework style.

The safest workflow is:

1. use the Vona CLI to create the controller skeleton
2. inspect the generated module-specific patterns
3. add `@Web`, `@Arg`, validation, and OpenAPI metadata in the same style
4. choose deliberately whether response wrapper defaults should stay in place
5. verify the resulting routes and response conventions

## Where to read next

If your next question is how the HTTP-facing controller layer connects to the rest of one real backend module, continue with:

- [Service Guide](/backend/service-guide)
- [DTO Guide](/backend/dto-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
