# ADR 0002: Guard-Based Default API Permission Projection

## Status

Accepted and implemented.

## Background

The framework computes API permissions through `retrievePermissions(resource)` in:

- `vona/src/suite-vendor/a-vona/modules/a-permission/src/bean/bean.permission.ts`

Historically, the default implementation evaluated each controller action by executing the runtime guard chain and then cached the result using a user-specific cache key.

That approach had two major properties:

1. it closely matched runtime authorization behavior
2. it produced cache entries that were too tightly coupled to each individual user

At the same time, the built-in Passport decorators already expressed a useful distinction between:

- role-based authorization, such as `@Passport.roleName()` and `@Passport.admin()`
- identity-based authorization, such as `@Passport.userName()`

This made default permission precomputation a good candidate for a more cache-friendly design.

## Problem

The old default permission path had three practical limitations:

1. **it executed runtime guards during default permission calculation**
   - this made permission projection depend on request-scoped runtime behavior
   - it also made the default path more dynamic than necessary

2. **it cached too narrowly**
   - the default path effectively cached by user
   - users with identical roles could not share the same default permission projection

3. **it mixed two different concerns**
   - stable default permission projection
   - user-specific or extension-specific permission decisions

A redesign was needed, but runtime authorization behavior had to remain unchanged.

## Decision

The final design preserves runtime authorization while changing only the default permission projection behavior.

### 1. Keep runtime guards authoritative

The runtime guard system remains unchanged.

This includes the behavior of:

- `@Passport.userName()`
- `@Passport.roleName()`
- `@Passport.admin()`
- `@Passport.public()`
- `@Passport.activated()`

Actual action execution still uses the runtime guard chain.

### 2. Split outer permission retrieval from default projection

The permission flow now distinguishes two layers:

- **outer permission retrieval**
  - `retrievePermissions(resource)`
  - still cached per user
  - remains safe for event-based or user-specific extensions

- **default permission projection**
  - internal default path
  - cached by role profile
  - derived from route metadata instead of runtime guard execution

This split is important because extension logic attached through the `retrievePermissions` event may still be user-specific.

### 3. Replace runtime guard execution with metadata-based static projection

The default projection no longer executes guard chains.

Instead, it reads merged route metadata from:

- `SymbolUseOnionOptionsRouteReal`

This metadata is used to evaluate built-in Passport guard behavior conservatively.

## Final Design

### Outer cache remains user-scoped

`retrievePermissions(resource)` keeps a user-oriented cache key because the event-based permission path may incorporate user-specific logic that cannot be safely shared across users.

### Default projection cache is role-profile-scoped

The default projection path uses a role-profile-based cache key.

The key currently includes:

- resource name
- anonymous vs authenticated state
- activated state
- sorted role names

This allows users with the same role profile to share the same default permission projection.

### Default projection uses conservative static rules

The default projection returns `true` only when the system can safely prove that an action is allowed under the supported built-in rules.

When the answer is uncertain, it returns `false` rather than over-granting access.

## Static Projection Rules

### `a-user:passport`

The default projection statically evaluates:

- `public`
- `activated`

Interpretation:

- `public: true`
  - anonymous access is allowed
- `public !== true`
  - authenticated access is required
- `activated: true`
  - authenticated and activated access is required
- `activated: false`
  - authenticated but not activated access is required

### `a-user:roleName`

The default projection evaluates role requirements using the current role names from the Passport.

An action can project to `true` only when the required role names are matched by the current role profile.

### `a-user:admin`

`@Passport.admin()` is treated as a role-based shortcut and therefore participates in the same static projection model as `roleName`.

### `a-user:userName`

`@Passport.userName()` is always treated as dynamic for default permission projection.

Even if the current username happens to match, the default projection does not convert that into a shared cacheable allow.

This avoids leaking identity-specific authorization into a role-profile cache.

### Unknown or unsupported guards

If the route metadata contains unknown or unsupported guards, the default projection falls back conservatively to `false`.

This avoids false positives when future guards introduce behavior that cannot be statically inferred.

## Implementation Summary

### Primary implementation file

- `vona/src/suite-vendor/a-vona/modules/a-permission/src/bean/bean.permission.ts`

Key implementation changes:

- the outer permission cache key remains user-scoped
- a dedicated default projection cache path was introduced
- the default projection now reads route metadata instead of executing the runtime guard chain
- role-profile cache keys are built from authentication state, activation state, and sorted role names
- built-in Passport guards are evaluated with conservative static rules

### Supporting test fixture changes

To validate the new behavior, the following files were updated:

- `vona/src/suite-vendor/a-test/modules/test-vona/src/controller/guardPassport.ts`
- `vona/src/suite-vendor/a-test/modules/test-vona/test/guardPassport.test.ts`

The test controller was marked as a resource so that the permission bean could evaluate it through the default permission path.

## Validation

The implemented behavior was validated with targeted tests.

### Runtime guard behavior remained unchanged

The existing guard-oriented test cases still verified that:

- `userName` checks work at runtime
- `roleName` checks work at runtime

### Default projection behavior was added to tests

The updated `guardPassport` tests confirmed that:

- `testUserName` projects to `false`
- `testUserNameFail` projects to `false`
- `testRoleName` projects to `true`
- `testRoleNameFail` projects to `false`

### Cache key behavior was validated

The tests also verified role-profile cache key generation, including:

- anonymous profile projection keys
- authenticated admin-role projection keys

## Consequences

### Benefits

- default permission projection is more cache-friendly
- users with the same role profile can share projected default permissions
- default permission calculation avoids runtime guard execution side effects
- identity-based authorization does not leak into shared projection caches

### Trade-off

The default projection is intentionally conservative.

This means some actions that may succeed at runtime can still project to `false` if the system cannot safely prove the allow result using static built-in rules.

This is by design.

## Guidance for Future Work

When introducing or modifying guards, future work should classify them explicitly:

### Safe for default static projection

A guard can participate in default projection only if it is:

- metadata-driven
- stable under a coarse role profile
- evaluable without request-specific side effects

### Runtime-only

A guard should remain runtime-only if it depends on:

- username or identity-specific state
- request-scoped state
- external context not represented in the role profile
- behavior that cannot be safely inferred from route metadata

### Important rule

Runtime authorization remains the source of truth.

Default permission projection is a cache-friendly capability projection, not a replacement for runtime guard execution.
