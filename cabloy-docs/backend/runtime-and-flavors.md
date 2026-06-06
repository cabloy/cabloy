# Runtime Environments and Flavors

This guide explains how runtime environments and flavors work in Vona within the Cabloy monorepo.

## Why this model exists

Vona uses multi-dimensional variables to load environment variables and config values.

In practice, that means configuration is not chosen by a single mode flag alone. It is chosen by combining:

- **runtime environment**
- **flavor**

This gives Cabloy more flexibility for development, testing, CI, Docker, and edition-specific or customer-specific scenarios.

## Runtime environments

Vona provides three main runtime environments:

| Name | Description |
| --- | --- |
| `test` | testing environment |
| `dev` | development environment |
| `prod` | production environment |

## How runtime environment is activated

In the current workflow, the active runtime environment is usually implied by which command you run.

### Test environment

```bash
npm run test
cd vona && npm run cov
cd vona && npm run db:reset
```

### Development environment

```bash
npm run dev
cd vona && npm run dev:one
```

### Production environment

```bash
npm run start
cd vona && npm run start:one
cd vona && npm run start:docker
```

## How to determine the current runtime environment in code

### Via environment variables

```typescript
process.env.META_MODE === 'test';
process.env.META_MODE === 'dev';
process.env.META_MODE === 'prod';
```

Using environment variables is especially useful when you want behavior that can participate in tree-shaking during builds.

### Via config

```typescript
app.config.meta.mode === 'test';
app.config.meta.mode === 'dev';
app.config.meta.mode === 'prod';
```

### Via simplified helpers

```typescript
app.meta.isTest;
app.meta.isDev;
app.meta.isProd;
```

## Flavors

For more complex scenarios, Vona adds the `flavor` dimension.

The combination of runtime environment and flavor lets the framework support more specific operational contexts without flattening everything into one environment axis.

### Built-in flavors

| Name | Description |
| --- | --- |
| `normal` | default flavor |
| `play` | used by the Playground |
| `docker` | used for Docker-oriented workflows |
| `ci` | used for CI environments such as GitHub Actions |

## How to activate a flavor

Use the `--flavor` parameter where the script or command supports it.

```bash
npm run dev
npm run build -- --flavor=docker
npm run build -- --flavor=ci
```

## How to determine the current flavor in code

### Via environment variables

```typescript
process.env.META_FLAVOR === 'normal';
process.env.META_FLAVOR === 'docker';
process.env.META_FLAVOR === 'ci';
```

### Via config

```typescript
app.config.meta.flavor === 'normal';
app.config.meta.flavor === 'docker';
app.config.meta.flavor === 'ci';
```

## Custom flavors

Flavors are not limited to the built-in ones. You can introduce your own flavor for business needs such as:

- customer-specific behavior
- project-specific behavior
- organization-specific behavior
- deployment-specific behavior

Example:

```bash
npm run dev -- --flavor=customA
```

And in code:

```typescript
process.env.META_FLAVOR === 'customA';
app.config.meta.flavor === 'customA';
```

## Type support for custom flavors

Custom flavor names can also be added to type definitions for better editor support.

Representative pattern:

```typescript
declare module '@cabloy/module-info' {
  export interface VonaMetaFlavorExtend {
    customA: never;
  }
}
```

## Relationship to distributed runtime features

Runtime environment and flavor are not only configuration concerns. They also shape which distributed backend capabilities should be active.

This especially affects topics such as:

- startup enable/disable rules
- queue enable/disable rules
- whether a backend capability should run in `dev`, `test`, `prod`, or a specific flavor only
- Docker-, CI-, or playground-specific distributed behavior

Read this guide together with:

- [Backend Startup Guide](/backend/startup-guide)
- [Queue Guide](/backend/queue-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Broadcast Guide](/backend/broadcast-guide)

## Why this matters for AI workflows

When an AI system suggests configuration or runtime guidance, it should never assume that `dev/test/prod` is the whole story.

It should also inspect whether the active workflow depends on flavor, especially for:

- Docker
- CI
- Playground
- edition-sensitive integrations
- customer- or project-specific deployment behavior

These environment differences also matter for distributed backend capabilities and operational concerns such as log directories, log levels, and log rotation; see [Logger Guide](/backend/logger-guide).
