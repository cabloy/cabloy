# AOP Overview

## Why AOP matters in Vona

Vona uses AOP to make cross-cutting backend behavior explicit, composable, and framework-native.

That matters because concerns such as middleware flow, authentication checks, validation, transactions, logging, caching, and error handling should not be re-implemented ad hoc in every controller or service method.

## The three AOP capability families

Vona AOP can be understood in three capability families:

1. **Controller AOP** for request-path behavior around controller actions
2. **Internal AOP** for adding behavior inside a class through decorators or magic methods
3. **External AOP** for attaching behavior to a class from the outside without editing the class source code

## Controller AOP families

The controller-facing AOP system includes five main aspect families:

- **middleware**
- **guard**
- **interceptor**
- **pipe**
- **filter**

These families work together to shape request execution, parameter handling, error behavior, and API policy.

## Execution model

Middleware and interceptors use onion-style execution: they can run logic before `next()` and after downstream controller work returns. Guards check access preconditions, pipes transform or validate request values, and filters handle exceptions on the error path.

For a matched controller route, the inbound order is:

1. **system middleware** before route matching
2. **route matching**
3. **global middleware** after a route matches and before authentication
4. **guards**, including Passport authentication and authorization
5. **interceptors**
6. **argument extraction and pipes**
7. **local middleware**
8. **controller action**

After the action, middleware and interceptor after-`next()` work unwinds in reverse: local middleware, interceptors, then global middleware. Filters are not another successful inbound stage; they compose the exception-handling path when request execution throws.

Choose the family by the state the concern needs: use system middleware for route-independent transport behavior, global middleware for matched-route work before authentication, a global interceptor for post-auth admission before body parsing, and local middleware for action-side wrapping after pipes.

## System, global, and local scope

Controller AOP also varies by scope:

- **system middleware** runs before route matching and has no matched-route metadata
- **global middleware** is auto-loaded after route matching but before guards; it can use runtime filters such as `match`, `ignore`, `mode`, or `flavor`
- **local middleware** is attached directly to a controller class or action and runs after pipes, immediately around the action-side suffix
- **global/local guards, interceptors, pipes, and filters** remain in their own family stages rather than sharing middleware placement

Built-in aspects and shorthand decorators sit on top of the same general model.

Across controller, internal, and external AOP, the same operational ideas appear repeatedly:

- default options in the aspect definition
- per-usage option overrides
- app-config overrides through `config.onions`
- enable/disable switches
- runtime targeting through `mode` and `flavor`
- ordering through `dependencies` and `dependents`
- inspection of the effective chains at runtime

That consistency is one of the biggest reasons the Vona AOP surface stays learnable even though it covers many different extension points.

## Validation, OpenAPI, and AOP

Vona’s AOP model is closely connected to:

- controller argument handling through `@Arg.*`
- Zod-based validation
- Swagger/OpenAPI generation

That means AOP is not only about request middleware. It is also part of how Vona turns request contracts into typed, machine-readable framework behavior.

## Internal AOP

Internal AOP provides two main mechanisms:

- **AOP Method** for decorating class methods
- **Magic Method** for dynamic behavior such as `__get__`, `__set__`, or `__method__`

These mechanisms help keep code concise while still making transactions, logging, caching, scope lookup, and dynamic access patterns explicit.

## External AOP

External AOP uses `@Aop({ match: ... })` to attach behavior to another class by bean name.

This is useful when the desired extension logic should live outside the target class, for example when layering timing, logging, lifecycle hooks, or dynamic method interception onto an existing service or bean.

A simple ownership rule is:

- choose **controller AOP** when the concern belongs to the HTTP request path
- choose **internal AOP** when the behavior belongs naturally to the class that owns the method
- choose **external AOP** when the behavior should remain decoupled from the target class source

## Recommended reading path

For the unified docs, use this progression:

1. [Controller AOP Guide](/backend/controller-aop-guide)
2. [Validation Guide](/backend/validation-guide)
3. [Internal AOP Guide](/backend/internal-aop-guide)
4. [External AOP Guide](/backend/external-aop-guide)

## Questions for AOP-sensitive changes

When changing backend behavior in Vona, ask:

1. is this concern already represented by middleware, guard, interceptor, pipe, or filter?
2. should this logic be expressed through an internal AOP decorator instead of manual repetition?
3. is an external aspect a better fit than modifying the target class directly?
4. does the change interact with validation, OpenAPI, caching, transactions, or runtime environment controls?

That helps AI keep backend changes aligned with Vona’s real execution model rather than rewriting them into generic framework patterns.
