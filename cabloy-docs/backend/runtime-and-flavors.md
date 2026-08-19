# Runtime Environments and Flavors

This guide explains how runtime environments and flavors work in Vona within the Cabloy monorepo.

## Why this model exists

Vona does not treat backend runtime selection as a single switch.

In practice, backend behavior is chosen by combining:

- **runtime environment**
- **flavor**

That gives Cabloy enough room for development, testing, Playground, Docker, CI, and deployment-specific behavior without flattening everything into one axis.

## Runtime environments

Vona provides three main runtime environments:

| Name   | Description             |
| ------ | ----------------------- |
| `test` | testing environment     |
| `dev`  | development environment |
| `prod` | production environment  |

## How runtime environment is activated in the current repo

In Cabloy Basic, the active mode is usually implied by which command you run.

### Root-level contributor workflow

```bash
npm run dev
npm run test
npm run build
npm run start
```

These root scripts delegate to the backend or frontend layer as needed, so they are the preferred monorepo-facing entrypoints.

### Direct Vona workflow

Representative backend-side scripts include:

```bash
cd vona && npm run dev
cd vona && npm run dev:one
cd vona && npm run test
cd vona && npm run cov
cd vona && npm run db:reset
cd vona && npm run build
cd vona && npm run build:docker
cd vona && npm run start
cd vona && npm run start:one
```

In the current repo, those scripts map naturally to:

- `dev` commands -> development mode
- `test` / `cov` / `db:reset` -> test mode
- `build` / `start` -> production mode

## Flavors

For more specific scenarios, Vona adds the `flavor` dimension.

The combination of runtime environment and flavor lets the framework support more precise operational contexts without inventing a separate environment for every case.

### Built-in flavors used in this repo

| Name     | Description                                   |
| -------- | --------------------------------------------- |
| `normal` | default contributor/runtime flavor            |
| `play`   | used by the Playground workflow               |
| `docker` | used for Docker-oriented build/runtime output |
| `ci`     | used for CI-oriented production variants      |

Representative current scripts include:

```bash
cd vona && npm run play
cd vona && npm run build
cd vona && npm run build:docker
cd vona && npm run start
```

`build:docker` produces Docker-oriented output. Run that output through the Docker Compose workflow rather than a direct Vona `start:docker` command.

These scripts show that the same `prod` mode can still branch into different output/runtime shapes through flavor.

## What the CLI injects automatically

The current Vona CLI does not only read env files. It also injects key meta variables for the running process.

The important ones are:

- `NODE_ENV`
- `META_MODE`
- `META_FLAVOR`
- `SERVER_WORKERS`

A practical interpretation is:

- `META_MODE` is the backend runtime mode source of truth
- `META_FLAVOR` carries the flavor dimension
- `NODE_ENV` is derived from mode (`test`, `development`, or `production`)
- `SERVER_WORKERS` is normalized so the runtime always has an explicit worker count

In the current CLI behavior:

- prod defaults `SERVER_WORKERS` to CPU count when not provided
- non-prod defaults `SERVER_WORKERS` to `1`

## Curated built-in env variable catalog

The current repo uses many env variables, but these are the most important ones for understanding the runtime/config family.

| Variable family        | Representative variables                                                                                                                     | Why it matters                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Runtime meta           | `META_MODE`, `META_FLAVOR`, `NODE_ENV`                                                                                                       | chooses the active runtime and flavor shape                                                   |
| Worker/runtime process | `SERVER_WORKERS`                                                                                                                             | controls worker count and is normalized by the CLI/bootstrap path                             |
| HTTP server            | `SERVER_LISTEN_HOSTNAME`, `SERVER_LISTEN_PORT`, `SERVER_LISTEN_DISABLE`, `SERVER_SERVE_PROTOCOL`, `SERVER_SERVE_HOST`, `SERVER_GLOBALPREFIX` | controls listen/serve behavior and URL shaping                                                |
| Database               | `DATABASE_DEFAULT_CLIENT`, `DATABASE_CLIENT_SQLITE3_FILENAME`, `DATABASE_CLIENT_PG_*`, `DATABASE_CLIENT_MYSQL_*`                             | controls datasource defaults and concrete client connection settings                          |
| Redis                  | `REDIS_DEFAULT_HOST`, `REDIS_DEFAULT_PORT`, `REDIS_DEFAULT_DB`                                                                               | controls the backend Redis baseline used by queue, cache, broadcast, and related capabilities |
| Logger                 | `LOGGER_DIR`, `LOGGER_ROTATE_*`                                                                                                              | controls log path and rotation behavior                                                       |

Use this page as the runtime-facing overview, then inspect the current app config when you need to see how those values are translated into backend config.

## Public server origin

`SERVER_LISTEN_HOSTNAME` and `SERVER_LISTEN_PORT` control where the Vona process binds. They do not define the public URL that Vona emits.

When configured, `SERVER_SERVE_PROTOCOL` and `SERVER_SERVE_HOST` define Vona's canonical public origin for backend APIs and backend-hosted SSR sites. If either serve value is not configured, Vona resolves the effective protocol and host from the current proxy-aware request context; background work that needs a stable backend public origin should configure both serve values explicitly.

A browser consumer can be deployed on a different origin. Account password-set and password-reset delivery therefore does not derive its destination from `SERVER_SERVE_*`, `Referer`, or browser-selected mount data: Zova supplies its token-free absolute public page URL, and Vona validates its pathname against the server-derived Web Site mount plus the fixed Account route leaf. For the origin, Vona uses `checkOrigin(..., { exact: true, allowSameOrigin: true, allowLocalhost: true })`: `allowSameOrigin` accepts a consumer only when it exactly equals the current proxy-aware API request origin after HTTP(S) URL normalization, including protocol and port. Other non-local origins must exactly match an explicit `a-security:cors` `whiteList` entry. `allowLocalhost` is effective only in `dev/test` when both the API request host and consumer origin have the exact hostname `localhost`; their ports may differ for multi-workspace development. Vona alone adds the raw token in the URL fragment. Normal CORS defaults to an empty `whiteList`: in `dev/test`, a request from `localhost` to an API host also named `localhost` is allowed across ports; elsewhere, cross-origin CORS requires an explicit whitelist entry. Normal CORS wildcard and suffix matching remain available when configured but are not credential-link authorization. Production deployments must explicitly configure the HTTPS consumer origin when the browser consumer is cross-origin.

## How to determine runtime metadata in code

### Via environment variables

```typescript
process.env.META_MODE === 'test';
process.env.META_MODE === 'dev';
process.env.META_MODE === 'prod';

process.env.META_FLAVOR === 'normal';
process.env.META_FLAVOR === 'docker';
process.env.META_FLAVOR === 'ci';
```

Using environment variables is especially useful when behavior needs to participate in build-time replacement or tree-shaking.

### Via config

```typescript
app.config.meta.mode === 'test';
app.config.meta.mode === 'dev';
app.config.meta.mode === 'prod';

app.config.meta.flavor === 'normal';
app.config.meta.flavor === 'docker';
app.config.meta.flavor === 'ci';
```

### Via simplified helpers

```typescript
app.meta.isTest;
app.meta.isDev;
app.meta.isProd;
```

A practical rule is:

- use `process.env` when the logic is environment-driven and may affect bundling or compile-time replacement
- use `app.config.meta` or `app.meta` when the logic belongs to normal runtime behavior inside the running backend

## Env-file resolution and precedence

This page owns the env-file and mode/flavor precedence view. For config surfaces and config layering, see [Config Guide](/backend/config-guide). For the fuller instance-aware merge view used by request-scoped behavior, see [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution).

In the current repo, env values are loaded from the `vona/env/` directory.

Representative files include:

- `.env`
- `.env.dev`
- `.env.dev.play`
- `.env.test`
- `.env.prod`
- `.env.prod.ci`
- `.env.prod.docker`
- `.env.local`
- `.env.prod.local`
- `.env.prod.docker.local`
- `.env.prod.normal.local`

The current loader builds the env-file chain from runtime metadata shaped like:

- `mode`
- `flavor`
- `local`

That means the loader can cascade from general files to more specific files such as:

1. `.env`
2. `.env.prod`
3. `.env.prod.docker`
4. `.env.prod.docker.local`

The important rule is:

- `.local` variants are treated as highest-priority local overrides

Representative effective chains in the current repo look like this:

- `dev + normal` -> `.env` -> `.env.dev` -> `.env.local`
- `dev + play` -> `.env` -> `.env.dev` -> `.env.dev.play` -> `.env.local`
- `prod + docker + local` -> `.env` -> `.env.prod` -> `.env.prod.docker` -> `.env.local` -> `.env.prod.local` -> `.env.prod.docker.local`

One more practical detail matters during bootstrap:

- after the env files are prepared, already-present `process.env` values still win when the runtime assembles the final env object

So when you document or debug backend configuration, do not assume one flat `.env` file. Inspect the active `mode`, `flavor`, local override files, and any externally injected environment variables together.

## Custom flavors

Flavors are not limited to the built-in ones. You can introduce your own flavor for needs such as:

- customer-specific behavior
- deployment-specific behavior
- project-specific behavior
- organization-specific behavior

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

## How runtime metadata becomes backend config

Runtime env values do not stop at `process.env`.

In the current Vona app config, they are folded into config such as:

- `config.meta.mode`
- `config.meta.flavor`
- `config.server.*`
- `config.database.defaultClient`
- `config.logger.*`
- `config.redis.*`

This is why runtime environment and config should be read together, not as separate concerns.

For the config-layering view, also see [Config Guide](/backend/config-guide).

## Relationship to startup, instance, and datasource behavior

Runtime environment and flavor are not only configuration concerns. They also shape:

- startup enable/disable rules
- startup hook behavior in different modes
- distributed capability activation
- datasource defaults
- local-vs-prod operational differences

Read this guide together with:

- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Model Guide](/backend/model-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)
- [Queue Guide](/backend/queue-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Broadcast Guide](/backend/broadcast-guide)

## Implementation checks for runtime and flavor changes

When evaluating backend runtime or configuration guidance, do not assume that `dev/test/prod` is the whole story.

Also inspect:

1. which repo command actually drives the workflow
2. whether the active behavior depends on flavor
3. whether `.local` overrides may be changing the effective env values
4. whether the runtime check should use `process.env`, `app.config.meta`, or `app.meta`
5. whether a datasource, startup, or distributed feature is mode- or flavor-sensitive

These environment differences also matter for operational concerns such as log directories, log levels, worker count, and runtime output layout; see [Logger Guide](/backend/logger-guide).
