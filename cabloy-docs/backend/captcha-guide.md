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

- `create`
- `refresh`
- `verify`
- `verifyImmediate`

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

That makes captcha providers extensible rather than hardcoded to one built-in shape.

The image-text example is a good mental model: provider code decides how to create and verify one captcha mechanism, while scene code decides when and why that mechanism should be chosen.

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

## Why this matters for AI workflows

When AI edits captcha-sensitive flows, it should ask:

1. is the right layer the provider, the scene, or the request interceptor?
2. does the flow need immediate verification, form verification, or both?
3. should the captcha policy vary by business scenario?
4. is there already an existing scene/provider combination that should be reused?

That helps AI keep captcha behavior aligned with Vona’s reusable verification model.
