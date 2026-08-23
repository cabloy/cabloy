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
| CORS                   | `CORS_WHITE_LIST`                                                                                                                            | supplies the default allowed-origin whitelist for the `a-security:cors` middleware            |
| Database               | `DATABASE_DEFAULT_CLIENT`, `DATABASE_CLIENT_SQLITE3_FILENAME`, `DATABASE_CLIENT_PG_*`, `DATABASE_CLIENT_MYSQL_*`                             | controls datasource defaults and concrete client connection settings                          |
| Redis                  | `REDIS_DEFAULT_HOST`, `REDIS_DEFAULT_PORT`, `REDIS_DEFAULT_DB`                                                                               | controls the backend Redis baseline used by queue, cache, broadcast, and related capabilities |
| Logger                 | `LOGGER_DIR`, `LOGGER_ROTATE_*`                                                                                                              | controls log path and rotation behavior                                                       |

Use this page as the runtime-facing overview, then inspect the current app config when you need to see how those values are translated into backend config.

## Public server origin

`SERVER_LISTEN_HOSTNAME` and `SERVER_LISTEN_PORT` control where the Vona process binds. They do not define the public URL that Vona emits.

When configured, `SERVER_SERVE_PROTOCOL` and `SERVER_SERVE_HOST` define Vona's canonical public origin for backend APIs and backend-hosted SSR sites. If either serve value is not configured, Vona resolves the effective protocol and host from the current proxy-aware request context; background work that needs a stable backend public origin should configure both serve values explicitly.

A browser consumer can be deployed on a different origin and pathname. Account password-set and password-reset delivery therefore does not derive its destination from `SERVER_SERVE_*`, SSR Site metadata, `publicPath`, `siteId`, `Referer`, or browser-selected mount data: Zova supplies the complete token-free absolute public page URL, and Vona validates only HTTP(S), absence of userinfo/query/fragment, and an exact trusted origin. `checkOriginExact` permits the exact current origin when protocol, host, and effective port all match; request or proxy Host values are not a general cross-origin allowlist and cannot authorize lookalike, suffix, alternate-scheme, or alternate-port destinations. Other production consumer origins must exactly match an explicit `a-security:cors` `whiteList` entry. In `dev/test`, exact credential-link authorization additionally accepts different ports only when both API and consumer hostnames are loopback (`localhost`, `127.0.0.1`, or `::1`). Vona preserves the frontend pathname and alone adds the raw token as the `token` URL query parameter. Query transport reaches the initial request; Referrer-Policy and Vona, edge, or APM query-log redaction are intentionally outside this flow's current scope. Normal CORS defaults to an empty `whiteList`; configure `CORS_WHITE_LIST` with the permitted browser origins, or explicitly configure `a-security:cors`. In `dev/test`, loopback requests may cross ports; elsewhere, cross-origin CORS requires an allowed entry. Normal CORS wildcard and suffix matching remain available when configured but are not credential-link authorization.

## Configure browser CORS origins

`CORS_WHITE_LIST` supplies the default `whiteList` for the app-wide `a-security:cors` middleware. It controls normal HTTP CORS and the built-in WebSocket origin check; it does not authenticate or authorize requests.

Set it to a comma-separated list of allowed browser origins. Use complete origins, including the scheme and a non-default port when applicable:

```dotenv
CORS_WHITE_LIST=https://app.example.com,https://admin.example.com
```

```dotenv
CORS_WHITE_LIST=https://app.example.com,http://localhost:5173
```

When `CORS_WHITE_LIST` is absent or empty, Vona retains the closed empty-whitelist default. The existing `dev/test` loopback exception remains available for local development, so ordinary loopback clients on different ports do not require this setting.

Set deployment-specific origins in the active `vona/env/.env*` layer or inject them through the deployment environment. See [Env-file resolution and precedence](#env-file-resolution-and-precedence) for the active-file chain and precedence rules. Applications that need middleware behavior beyond this default origin list can configure `a-security:cors` explicitly.

Normal CORS may use its configured wildcard or suffix matching behavior. Do not use that behavior to authorize account credential links: `checkOriginExact(...)` accepts only an exact normalized HTTP(S) origin and rejects wildcard and suffix entries.

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
