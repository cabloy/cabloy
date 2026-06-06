# User Access Guide

## Why user access matters in Vona

Vona separates general user, role, and passport capabilities from business-specific customization.

That matters because the framework needs to stay reusable while still supporting project-specific identity, role, and activation workflows.

## Core access model

The user-access model is centered on three framework-level concepts:

- **user**
- **role**
- **passport**

## `IUser`

The `a-user` module provides `IUser` as the core interface for the current user model.

Representative fields include:

- `id`
- `name`
- `avatar`
- `email`
- `mobile`
- `activated`
- `locale`
- `anonymous`

## `bean.user`

Vona exposes `bean.user` as the general business-facing API for user operations.

Representative capabilities include:

- register a user
- activate a user
- create an anonymous user
- find a user by name or id
- update or remove a user
- register a user from OAuth profile data

This gives business logic a stable entrypoint even when deeper adapter behavior is customized elsewhere.

## `IRole` and `bean.role`

The `a-user` module also provides `IRole` and a global bean `bean.role`.

Representative capabilities include:

- find a role by name or id
- find all roles for a user

This makes role lookup part of the same framework-level access model as user lookup.

## `IPassport` and `bean.passport`

When a request successfully authenticates, Vona creates a passport containing access-related context such as:

- current user
- current auth record
- current roles

`bean.passport` provides a unified calling surface for passport behavior.

Representative capabilities include:

- get the current passport
- get current user/auth/roles
- check authentication or activation state
- sign in or sign out
- mock sign in for tests
- sign in as anonymous
- refresh JWT tokens
- create temporary auth tokens

## Current user and current roles

Backend code can retrieve the current user through several framework-native paths.

### Controller parameter decorator

```typescript
@Arg.user() user: IUser
```

### Passport bean

```typescript
const user = this.bean.passport.currentUser;
const roles = this.bean.passport.currentRoles;
```

### Request context

```typescript
const user = this.ctx.user;
const passport = this.ctx.passport;
```

## Anonymous user behavior

When anonymous access is allowed, Vona can create an anonymous user object automatically.

That means request-path access rules and user identity handling stay consistent even before full authentication.

## Registration and activation

Vona’s user system is connected to event-driven customization points.

Representative flows include:

- registration
- activation
- assigning default roles
- sending email confirmation or similar follow-up logic

The framework-level user APIs stay stable while project-specific modules can customize what happens before or after those core steps.

## Relationship to auth and controller AOP

This guide focuses on the user/role/passport model itself.

Read it together with:

- [Auth Guide](/backend/auth-guide) for provider-driven authentication
- [Controller AOP Guide](/backend/controller-aop-guide) for `@Passport.*` and guard-based request-path behavior

## Why this matters for AI workflows

When AI edits user or access logic, it should ask:

1. is the right layer `bean.user`, `bean.role`, `bean.passport`, or an auth provider?
2. does the flow depend on current user, current roles, or current passport state?
3. should anonymous, activated, or admin behavior be handled through existing framework conventions?
4. does the change belong in business logic, event-driven customization, or request-path guard configuration?

That helps AI keep access logic aligned with Vona’s real identity architecture.
