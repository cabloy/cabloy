# Captcha Guide

## Why captcha matters in Vona

Vona treats captcha as a reusable framework capability rather than a one-off image challenge.

That matters because different business flows may need different captcha types, different verification strategies, and different frontend/backend interaction patterns.

## Core captcha model

The `a-captcha` module provides a general captcha system built around two concepts:

- **captcha provider**
- **captcha scene**

### Provider

A provider implements a captcha mechanism, such as image-text captcha or another verification style.

### Scene

A scene chooses how captcha should be used in a specific business context.

A scene can:

- select one provider
- rotate across multiple providers
- vary provider choice by user state or other business context

## `bean.captcha`

Vona exposes a global bean `bean.captcha` so backend code can work with captcha through one unified entrypoint.

Representative generation workflow:

```bash
npm run vona :create:bean captchaProvider imageText -- --module=captcha-simple
npm run vona :create:bean captchaScene simple -- --module=captcha-simple
```

The main operations are:

- `create(scene, payload?)`
- `refresh(id, scene, payload?)`
- `verify(id, token, scene, payload?)`
- `verifyImmediate(id, token)`

`payload` is provider-specific request input. Public create/refresh requests use the field `payload`, not `data`. Provider defaults and scene overrides are merged automatically as the sole server-owned policy; payload is passed separately and is never merged into options. There is no public `bound`, `context`, `publicData`, `prepare` or `authorize` protocol, or `ICaptchaAuthorization` contract.

### Create captcha

```typescript
const captcha = await this.bean.captcha.create('captcha-simple:simple');
```

### Refresh captcha

```typescript
const captchaNew = await this.bean.captcha.refresh(captchaId, 'captcha-simple:simple');
```

### Verify captcha

```typescript
const passed = await this.bean.captcha.verify(captchaId, '1234', 'captcha-simple:simple');
```

### Immediate verification

```typescript
const tokenOrFalse = await this.bean.captcha.verifyImmediate(captchaId, '1234');
```

Immediate verification can return a secondary token that must still be verified again on form submission.

## Provider model

A provider defines:

- token type
- payload type
- creation logic
- verification logic
- provider-specific options

A representative provider can implement image-text captcha with fields such as:

- `type`
- `fontPath`
- `opts`

The provider lifecycle is uniform for every provider:

- `create(options, payload?, previousToken?)` returns an opaque `token` reference to provider-owned proof state, plus public presentation `payload` and optional timing/status metadata. It never returns the answer as the private reference.
- `verify(token, tokenInput, options, payload?)` returns `true` only after verification and one-time consumption have atomically committed. The provider owns the sole consume transition; generic captcha adds no second consume CAS.
- Optional `verifyImmediate(token, tokenInput, options)` and `updateToken(token, tokenInput, options)` implement provider-specific immediate verification and token updates. `bean.captcha.verifyImmediate` and `updateCaptchaToken` only delegate; unsupported operations return `false` and fail with 403 respectively.

There is no `verification` mode. Generic captcha owns only scene/provider resolution, automatically merged server options, payload forwarding and opaque-reference routing; it never owns proof state or normal/secondary verification. The image provider owns normal and secondary proof, immediate verification, token updates and refresh CAS, preserving existing image behavior.

Refresh reuses `create(options, payload?, previousToken?)`, not a separate provider refresh hook. `previousToken` comes only from the internal cached reference; it is not caller authority or a source of request input. Returning the same reference preserves the public captcha ID; returning a new reference produces a new ID. Missing routing records fall back to create with fresh payload validation. If image private state is already absent at the start of provider create, create a new reference/ID; this supports the existing image field's refresh on form error even after proof was consumed. If the image snapshot existed but is consumed during generation, refresh CAS still fails with 403.

Internal `routingExpiresAt` controls routing retention, not proof validity. For images it reserves the primary TTL plus the secondary TTL snapshotted at creation/refresh, so late immediate verification can still route secondary proof. Public `expiresAt` describes the actual proof deadline; routing retention never extends that deadline or exposes `routingExpiresAt`.

Generic cache stores scene/provider/opaque reference only, with internal routing retention, not provider-owned proof state. Provider decorator defaults and scene overrides supply server-owned policy; request payload never overrides that policy.

Public `token` can come only from the separate `tokenPublic` under `showToken`; the opaque private reference is never exposed, even for images or with `showToken` enabled. Issuance responses remain `no-store`.

Provider code implements the mechanism and validates payload; scene code selects it and supplies server policy.

## Scene model

A scene defines:

- which providers are available
- how one provider is resolved for the current request
- how provider-level options can be configured or overridden

That means business policy can be expressed at the scene layer while implementation details remain in the provider layer.

A representative scene can choose one provider statically, rotate among several providers, or vary difficulty and provider options by request context or user state.

## Captcha verify interceptor

Vona also provides a local interceptor for captcha verification:

```typescript
@Core.captchaVerify({ scene: 'captcha-simple:simple' })
```

This interceptor supports:

- normal form verification
- secondary verification after `verifyImmediate`

This is the most important request-path integration point for captcha in ordinary controller code.

## Built-in captcha API

The `a-captcha` module exposes out-of-the-box captcha APIs for:

- `create`
- `refresh`
- `verifyImmediate`

The direct `verify` path is usually consumed through the interceptor-oriented request flow.

## Configuration

Captcha behavior can be configured through app config, including:

- whether to expose the token for debugging
- captcha token TTL
- secondary-token TTL
- provider-specific options
- scene-specific provider setup

A useful separation rule is:

- module config for broad captcha defaults such as `showToken`
- `config.onions.captchaProvider` for provider-level TTL and option tuning
- `config.onions.captchaScene` for scene-level provider selection and overrides

## Relationship to auth flows

Captcha is often used in login, registration, or other user-facing flows, but it should remain a separate framework concern.

That makes it easier to reuse the same captcha capability across different account-related APIs.

## Implementation checks for captcha-sensitive changes

When editing captcha-sensitive flows, ask:

1. is the right layer the provider, the scene, or the request interceptor?
2. does the flow need immediate verification, form verification, or both?
3. should the captcha policy vary by business scenario?
4. is there already an existing scene/provider combination that should be reused?

That helps AI keep captcha behavior aligned with Vona’s reusable verification model.
