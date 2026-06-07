# Auth Guide

## Why auth matters in Vona

Vona treats authentication as a framework-level capability rather than a one-off login endpoint.

That matters because real systems often need more than one authentication method, more than one credential source, and more than one post-auth workflow.

## Core auth model

The `a-auth` module provides a general authentication system built around **auth providers**.

This model supports:

- multiple authentication methods such as username/password and OAuth
- multiple clients per provider
- association of multiple authentication methods to one user
- migration of authentication methods from one user to another

## `bean.auth`

Vona exposes a global bean `bean.auth` so backend code can use all registered auth providers through one unified entrypoint.

Representative provider-generation workflow:

```bash
npm run vona :create:bean authProvider simple -- --module=auth-simple
npm run vona :create:bean authProvider oauth -- --module=auth-oauth
```

Those providers still plug into the shared `:create:bean` command surface, which keeps auth extension aligned with the rest of Vona’s bean architecture.

### Username/password example

```typescript
const jwt = await this.bean.auth.authenticate('auth-simple:simple', {
  clientOptions: { username: 'admin', password: '123456' },
});
```

### OAuth example

```typescript
await this.bean.auth.authenticate('auth-oauth:oauth', {
  clientName: 'github',
  state: { redirect: '/' },
});
```

## Auth provider types

### `auth-simple`

`auth-simple` provides an out-of-the-box username/password provider.

Representative flows include:

- register a new user by calling `bean.auth.authenticate(..., { state: { intention: 'register' } })`
- log in by calling `bean.auth.authenticate(..., { state: { intention: 'login' } })`
- sign out through `bean.passport.signout()`

It also exposes password-hash configuration through app config.

### `auth-oauth`

`auth-oauth` provides an OAuth-based provider model.

Representative capabilities include:

- built-in support for GitHub
- adding new OAuth strategies such as Google through client configuration and interface merging
- unified callback handling
- exchanging the returned OAuth code for a JWT token through the Passport API flow
- optional mock login behavior in development

## Provider and client model

A provider can expose multiple clients.

For example, one OAuth provider can expose `github`, `google`, or other client entries, each with its own strategy and credentials.

That means auth configuration is not hardwired to one provider/credential pair.

## State and auth intent

Authentication calls can carry state such as:

- `register`
- `login`
- `associate`
- `migrate`
- redirect target after successful OAuth flow

This is one of the reasons Vona auth can support richer account flows without scattering those rules across unrelated controller code.

## Profile-driven user creation

Auth providers usually return profile data rather than directly creating a final user shape by hand.

That profile is then consumed by the broader user and passport system.

This separation helps Vona keep provider logic, user logic, and business customization decoupled.

A practical rule is that the provider should prove identity and return a stable profile, while user creation and passport assembly remain downstream responsibilities handled by the user/passport layers.

## OAuth credentials and callback flow

OAuth credentials are configured through app config under the relevant auth provider client entry.

The typical flow is:

1. redirect to the provider
2. receive the OAuth callback code
3. exchange the code for a JWT token
4. continue through the passport and user flow

The out-of-the-box Passport controller in `home-user` exposes that exchange as `createPassportJwtFromOauthCode`, which is why frontend OAuth flows usually stay thin: the provider redirect happens first, and the frontend then asks the Passport API to finish JWT creation.

## Passport API relationship

The `home-user` module exposes out-of-the-box Passport APIs for common account flows such as:

- current passport retrieval
- login
- logout
- registration
- OAuth login
- associate / migrate auth methods
- token refresh
- temporary auth token creation

In the current repo implementation, these flows live in `home-user/src/controller/passport.ts`, where register/login call `bean.auth.authenticate(...)`, OAuth login uses provider/module path parameters, and token-oriented follow-up endpoints stay concentrated in one controller surface.

This guide focuses on the framework-level auth model. For the user/passport side, see [User Access Guide](/backend/user-access-guide).

## Relationship to controller AOP

Auth behavior is closely connected to controller AOP, especially guards.

Built-in passport-oriented guard shorthands such as `@Passport.public()` are documented from the request-path perspective in [Controller AOP Guide](/backend/controller-aop-guide).

## Implementation checks for authentication changes

When editing authentication behavior, ask:

1. is the right layer `bean.auth`, `bean.passport`, or controller guard configuration?
2. does this flow belong to username/password auth, OAuth auth, or both?
3. does a provider already exist instead of needing custom authentication code?
4. does the flow need register, login, associate, migrate, or redirect-aware state?

That helps AI keep auth logic aligned with Vona’s real backend architecture.
