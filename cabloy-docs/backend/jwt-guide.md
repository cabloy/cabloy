# JWT Guide

## Why JWT matters in Vona

Vona treats JWT as a framework capability rather than a raw token-library wrapper.

That matters because backend auth flows usually need more than one token type, more than one verification path, and more than one lifecycle strategy for access, refresh, OAuth, or temporary tokens.

## Core JWT model

The `a-jwt` module provides JWT capabilities on top of `jsonwebtoken`.

The most important framework-level pieces are:

- **JWT clients**
- a shared **base** configuration
- helper methods for paired token creation
- temporary-token support
- integration with the passport/auth flow

## JWT configuration

JWT behavior is configured under `config.modules['a-jwt']`.

Representative pattern:

```typescript
config.modules = {
  'a-jwt': {
    tempAuthToken: {
      signOptions: { expiresIn: 5 * 60 },
    },
    base: {
      secret: undefined,
      signOptions: { issuer: env.APP_NAME },
      verifyOptions: { issuer: env.APP_NAME },
    },
    clients: {
      access: {
        signOptions: { expiresIn: 2 * 60 * 60 },
      },
      refresh: {
        signOptions: { expiresIn: 7 * 24 * 60 * 60 },
      },
    },
  },
};
```

The main configuration layers are:

- `tempAuthToken`
- `base`
- `clients`

A useful ownership rule is:

- `base` defines common signing and verification defaults
- `clients` specialize token behavior by scenario
- `tempAuthToken` shortens the lifecycle for query-oriented or temporary access flows

## Built-in JWT clients

Vona ships with built-in JWT clients including:

- `access`
- `refresh`
- `oauth`
- `oauthstate`
- `code`

This is one of the reasons JWT should be understood as part of the broader auth/passport architecture rather than as only one access token string.

## Secret fallback model

A client can provide its own `secret`.

If a client secret is absent, Vona falls back to:

1. the client-specific secret
2. `base.secret`
3. `config.server.keys[0]`

That means JWT signing can stay centrally configured even when most clients share the same secret source.

## Adding a new JWT client

Projects can add additional JWT clients for custom scenarios.

Representative type extension:

```typescript
declare module 'vona-module-a-jwt' {
  export interface IJwtClientRecord {
    test: never;
  }
}
```

In the VSCode workflow, the `recordjwtclient` snippet can generate the augmentation skeleton.

Representative client config:

```typescript
config.modules = {
  'a-jwt': {
    clients: {
      test: {
        secret: 'xxxx',
        signOptions: { expiresIn: 2 * 60 * 60 },
      },
    },
  },
};
```

## `bean.jwt`

Vona exposes a global bean `bean.jwt` for working with JWT clients.

Representative client retrieval:

```typescript
const jwtAccess = this.bean.jwt.get('access');
const jwtRefresh = this.bean.jwt.get('refresh');
const jwtTest = this.bean.jwt.get('test');
```

This lets business code stay explicit about which token lifecycle it is using.

## Generate an access token directly

Representative pattern:

```typescript
const jwtAccess = this.bean.jwt.get('access');
const accessToken = await jwtAccess.sign({ userId: '1' });
```

This is useful when a flow needs one specific client rather than the paired access/refresh helper.

## Generate paired JWT tokens

Vona can generate `accessToken` and `refreshToken` together:

```typescript
const jwtTokens = await this.bean.jwt.create({ userId: '1' });
```

The returned shape is `IJwtToken`:

```typescript
export interface IJwtToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

That paired helper is the normal fit for sign-in flows.

## Temporary auth tokens

Some flows need an access token in a URL query or similarly constrained transport.

For those cases, Vona supports shorter-lived temporary access tokens.

### Method 1: temporary sign on the access client

```typescript
const jwtAccess = this.bean.jwt.get('access');
const accessToken = await jwtAccess.sign({ userId: '1' }, { temp: true });
```

### Method 2: dedicated helper

```typescript
const accessToken = await this.bean.jwt.createTempAuthToken({ userId: '1' });
```

This is useful when a token should remain valid only briefly, for example for URL-bound handoff flows.

## Verification

JWT verification can happen directly through a client:

```typescript
const jwtAccess = this.bean.jwt.get('access');
const accessToken = await jwtAccess.sign({ userId: '1' });
const payload = await jwtAccess.verify(accessToken);
```

Direct verification is useful when the business flow really needs raw payload verification.

In ordinary request-path auth flows, the more important layer is usually the passport guard, not manual verification.

## Relationship to passport

In most application flows, JWT is consumed through `bean.passport` rather than through raw token handling in every controller.

Representative passport-facing capabilities include:

- `signin(...)`
- `signout()`
- `checkAuthToken(...)`
- `refreshAuthToken(...)`
- `createTempAuthToken(...)`
- `createAuthTokenFromOauthCode(...)`

This is the key architectural point:

- `bean.jwt` owns token creation and verification mechanics
- `bean.passport` owns identity-bearing flows built on top of those mechanics

For example, the out-of-the-box Passport controller in `home-user` uses:

- `refreshAuthToken` for refresh-token exchange
- `createPassportJwtFromOauthCode` for finishing OAuth login
- `createTempAuthToken` for temporary URL-bound auth scenarios

## Relationship to guards and request-path auth

The built-in global passport guard uses JWT checking as part of request authentication.

That means request-path authorization usually works like this:

1. the guard checks whether an auth token should be verified
2. `bean.passport.checkAuthToken()` verifies and deserializes token state
3. the current passport is attached to request context
4. later guards or business logic use current user / roles / passport state

So JWT is a foundational mechanism, but request-path access control should still be understood through the passport and guard layers.

Read this guide together with:

- [Auth Guide](/backend/auth-guide)
- [User Access Guide](/backend/user-access-guide)
- [Controller AOP Guide](/backend/controller-aop-guide)

## OAuth-specific JWT flows

Vona also uses JWT-backed flows for OAuth-oriented state and code handling.

Representative passport methods include:

- `createOauthAuthToken(...)`
- `createOauthCode(...)`
- `createOauthCodeFromOauthAuthToken(...)`
- `createAuthTokenFromOauthCode(...)`

This is why JWT is not only about access/refresh tokens. It is also part of the framework’s OAuth handoff model.

## When to use `bean.jwt` directly

Use `bean.jwt` directly when:

- the business flow needs a specific client instance
- the flow needs direct sign/verify control
- the token use case is infrastructural rather than ordinary login/logout controller behavior

Use `bean.passport` when:

- the flow is really about user sign-in/out
- refresh-token behavior should reuse framework defaults
- token handling should remain tied to current passport lifecycle behavior

## Why this matters for AI workflows

When AI edits JWT-sensitive backend behavior, it should ask:

1. is this really a raw JWT concern, or should it stay at the passport/auth layer?
2. does the flow need `access`, `refresh`, `oauth`, `code`, or a custom client?
3. should this token be temporary rather than normal-lived?
4. does the request path already rely on the passport guard instead of manual verification?

That helps AI keep token handling aligned with Vona’s real auth architecture instead of scattering raw JWT logic through unrelated controllers and services.
