# Controller Guide

This guide explains how controllers work in Vona within the Cabloy monorepo.

## Create a controller

Example: create a controller named `student` in module `demo-student`.

### CLI command

```bash
npm run vona :create:bean controller student -- --module=demo-student
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

This is useful for special routes such as the project homepage.

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

This lets controller signatures express request shape directly in a consistent way.

## Validation, OpenAPI, and Controller AOP

Controllers are strongly connected to three related capabilities:

- parameter validation based on Zod-oriented patterns
- Swagger/OpenAPI generation
- middleware, guards, interceptors, pipes, and filters around the request path

In practice, that means controllers are not only request handlers. They are also a key place where request and response shape become machine-readable for tooling and frontend integration, and where request-path policies are composed through controller AOP.

For a dedicated explanation of middleware, guards, interceptors, pipes, and filters, see [Controller AOP Guide](/backend/controller-aop-guide).

## Why this matters for AI workflows

When an AI system creates or edits a controller, it should preserve the Vona controller model instead of rewriting it into a generic framework style.

The safest workflow is:

1. use the Vona CLI to create the controller skeleton
2. inspect the generated module-specific patterns
3. add `@Web`, `@Arg`, validation, and OpenAPI metadata in the same style
4. verify the resulting routes and response conventions
