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

Two controller AOP families use an onion-style execution model:

- **middleware**
- **interceptor**

That means they can run logic both before and after the controller action.

Other controller AOP families participate in more specialized stages:

- **guard** checks access or execution preconditions
- **pipe** transforms or validates request values
- **filter** handles exceptions and logging behavior

A practical controller-path mental model is:

1. system middleware runs before route matching
2. route matching happens
3. global and local middleware wrap the matched route
4. guards enforce access preconditions
5. pipes transform and validate incoming values
6. interceptors wrap controller execution
7. the controller action runs
8. filters handle thrown exceptions and logging customization when failures occur

That model is the fastest way to decide which aspect family should own a change.

## System, global, and local scope

Controller AOP also varies by scope:

- **system** middleware runs before route matching
- **global** aspects are auto-loaded and can be applied broadly with runtime filters such as `match`, `ignore`, `mode`, or `flavor`
- **local** aspects are attached directly to a controller class or action

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
