# Controller AOP Guide

## Why controller AOP matters

Controller AOP is how Vona structures request-path behavior around controller actions.

Instead of scattering authentication, validation, logging, error handling, or request transformation into unrelated code paths, Vona models them as explicit aspect families.

## The five controller aspect families

Vona provides five main controller-facing aspect families:

- **middleware**
- **guard**
- **interceptor**
- **pipe**
- **filter**

## Middleware

Middleware is used for request-path behavior that wraps execution before and after the controller action.

Representative CLI generation patterns from the legacy workflow include:

```bash
npm run vona :create:bean middlewareSystem logger -- --module=training-student
npm run vona :create:bean middleware logger -- --module=training-student --boilerplate=global
npm run vona :create:bean middleware logger -- --module=training-student
```

These commands all go through the shared `:create:bean` entrypoint, but they target different middleware scopes and boilerplates.

### Scope variants

- **system middleware** runs before route matching and has no matched-route metadata
- **global middleware** is auto-loaded after a route matches but before guards and Passport authentication
- **local middleware** is attached directly to a controller class or action and runs after pipes, around the action-side suffix

### Inbound execution order

For a matched controller route, Vona enters these stages in order:

```text
system middleware → route matching → global middleware → guard → interceptor → pipe → local middleware → action
```

Middleware and interceptors use onion execution. Their after-`next()` work unwinds in reverse, so local middleware returns before interceptors, which return before global middleware. Filters are selected from the error path when request execution throws; they are not a normal inbound stage.

### Why system middleware is different

System middleware executes before route matching, so it is the earliest controller-facing interception stage.

This is where Vona places concerns such as not-found handling, request override behavior, app initialization, instance initialization, HTTP logging, CORS, and static-resource handling. Use global middleware instead when the concern needs a matched route but must still run before authentication. Use local middleware when the concern is controller/action-specific and should see pipe-processed arguments.

### Representative local usage

```typescript
@Aspect.middleware('training-student:logger')
```

### Representative global usage

```typescript
@Aspect.middlewareGlobal('training-student:logger', { prefix: 'elapsed' })
```

`@Aspect.middlewareGlobal(...)` writes route options for an already registered global middleware. It does not add a local middleware or change that middleware’s pre-guard execution stage. The same distinction applies to `@Aspect.interceptorGlobal(...)`: it configures an existing global interceptor for the controller/action while the interceptor remains in the post-guard stage.

### Representative built-in usage

```typescript
@Core.gate({
  gate: {
    flavor: 'normal',
    mode: 'dev',
  },
})
```

The `@Core.gate(...)` shorthand still maps to `@Aspect.middlewareGlobal('a-core:gate', ...)`.

## Guard

Guards are used for access control and execution preconditions.

Typical jobs include:

- checking whether the current user is authenticated
- checking whether a user is activated
- checking whether a username or role name matches the required rule

### Scope variants

- **global guard** is auto-loaded and can be configured per API
- **local guard** is attached directly to a controller class or action

### Representative local usage

```typescript
@Aspect.guard('training-student:admin')
```

### Representative built-in usage

```typescript
@Passport.public()
@Passport.activated(false)
@Passport.roleName({ name: 'systemAdmin' })
@Passport.systemAdmin()
```

These shorthands still map back to the generic aspect model.

### Passport inheritance and action policy

The global Passport guard is the baseline for controller actions: without a local Passport decorator, an action requires an authenticated and activated user. It is not public.

Use a local Passport or domain guard when an action needs a policy beyond that baseline:

- use `@Passport.public()` only when anonymous access is intentional
- use `@Passport.systemAdmin()`, `@Passport.roleName(...)`, or a domain-specific guard when access needs additional restriction
- leave an action without a local Passport guard when authenticated-and-activated access is intentionally sufficient

The CRUD generator applies `@Passport.systemAdmin()` to each generated CRUD action rather than to the controller class. This keeps the administrative default explicit while allowing a future custom action to deliberately inherit the baseline or define its own policy.

For the underlying auth, passport, and user-access model, see [Auth Guide](/backend/auth-guide) and [User Access Guide](/backend/user-access-guide).

## Interceptor

Interceptors provide onion-style around-execution behavior for controller actions.

Typical jobs include:

- timing and logging
- wrapping response handling
- enforcing consistent around-action behavior

### Scope variants

- **global interceptor** is auto-loaded after guards and before pipes, local middleware, and controller execution
- **local interceptor** is attached directly to a controller class or action, runs inside global interceptors, and still precedes pipes

A global interceptor is the correct placement for post-auth admission that must reject before body parsing. For example, [`a-ratelimit:rateLimit`](/backend/rate-limit-guide) uses Passport-resolved identity, then runs before the request-body interceptor, pipes, local middleware, and action code.

### Representative local usage

```typescript
@Aspect.interceptor('training-student:logger')
```

### Representative built-in usage

Built-in interceptors can be used for framework-level response behavior, such as body-wrapping interceptors provided by built-in modules. Vona also provides interceptor-driven verification helpers such as `@Core.captchaVerify(...)`; for the provider/scene architecture behind that flow, see [Captcha Guide](/backend/captcha-guide).

## Pipe

Pipes transform or validate request values after interceptor entry and before local middleware and controller logic.

### Scope variants

- **global pipe** is auto-loaded and broadly configurable
- **local pipe** is attached directly to a controller class or action
- **argument pipe** is the most common developer-facing style in normal application code

### Representative local pipe usage

```typescript
@Aspect.pipe('training-student:number')
```

### Argument pipe pattern

Argument pipes are usually created from a local pipe:

```typescript
import { createArgumentPipe } from 'vona-module-a-aspect';

export const ArgNumber = createArgumentPipe('training-student:number');
```

Used on a controller parameter:

```typescript
async findOne(@ArgNumber() @Arg.param('id') id: any) {}
```

Order matters:

- `@Arg.param(...)`
- then custom argument pipes such as `@ArgNumber()`

### Zod integration

In many real cases, built-in `@Arg.*` handling with type inference or explicit Zod schema is enough:

```typescript
async findOne(@Arg.param('id') id: number) {}
async findOne(@Arg.param('id', z.number().min(1)) id: number) {}
```

This is why custom argument pipes are now the exception rather than the default. Reach for a custom argument pipe when the transformation itself is reusable business behavior. Reach for typed `@Arg.*` plus Zod when ordinary parameter coercion and validation are enough.

For broader validation guidance, see [Validation Guide](/backend/validation-guide).

## Filter

Filters handle exceptions and logging behavior on the error path. They are selected when request execution throws, rather than forming another successful inbound stage after the action.

This is where request-path error customization becomes explicit.

### Scope variants

- **global filter** is auto-loaded and can be tuned per API or by app config
- **local filter** is attached directly to a controller class or action

### Representative local usage

```typescript
@Aspect.filter('training-student:test')
```

### Built-in filter

The built-in global filter `a-error:error` covers common error-handling and logging needs.

Representative shorthand:

```typescript
@Core.error({ logs: { 422: false } })
```

## Shared configuration patterns

Most controller aspect families support the same configuration ideas:

- parameters with default values
- parameter override at usage site
- app-config override
- enable/disable
- `match` and `ignore`
- `mode` and `flavor`
- ordering through `dependencies` and `dependents`
- inspection of the effective aspect list

That consistency is one of the most important reasons controller AOP stays scalable in Vona.

### Global-onion override and option ownership

A local use decorator such as `@Aspect.interceptor(...)` adds an onion to the local execution chain. A global use decorator such as `@Aspect.interceptorGlobal(...)` or `@Core.rateLimit(...)` instead writes controller/action route options for the named, already-global onion. It does not move that onion into a local stage.

Put concern-specific fields under the exact onion that consumes them. For example, `rateLimit` belongs to `a-ratelimit:rateLimit` options; putting that object in another middleware or interceptor’s options does not transfer the quota policy or activate the limiter.

### Effective option precedence

For normal object-valued onion options, lower-precedence values are deep-merged with later values in this order:

```text
aspect defaults and application config.onions
→ active-instance config.onions
→ controller route options
→ action route options
→ controlled dynamic request or test overrides
```

An action can therefore override only `rateLimit.limit` and inherit the rest of the controller or application policy. An action `enable: false` is an explicit exemption from a globally or controller-enabled onion. Primitive option scenes use the highest-precedence value instead of deep merging.

### Representative inspect patterns

Runtime inspection is especially useful when several global aspects combine on one route.

Representative examples include:

```typescript
this.bean.onion.middlewareSystem.inspect();
this.bean.onion.middleware.inspect();
```

Those inspection helpers help explain why a route is behaving a certain way before you start rewriting aspect definitions.

## How to choose the right aspect family

Use this rule of thumb:

- **middleware** for request-path infrastructure behavior
- **guard** for access checks and authorization preconditions
- **interceptor** for around-execution behavior
- **pipe** for request-value transformation or validation
- **filter** for error handling and log customization

## Relationship to controller design

Controller AOP should be read together with [Controller Guide](/backend/controller-guide).

The controller guide explains routing, `@Web.*`, and `@Arg.*`, while this guide explains the cross-cutting behavior that surrounds controller execution.

## Questions for controller-AOP-sensitive changes

When changing controller behavior, ask:

1. is this concern really controller AOP rather than ordinary business logic?
2. should it be local, global, or system-level?
3. is there already a built-in shorthand or built-in aspect for this job?
4. does the change also affect validation, OpenAPI, runtime flavor, or environment-specific behavior?

That helps AI keep request-path logic aligned with Vona’s native execution model.
