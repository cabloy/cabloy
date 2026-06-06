# Environment and Config Guide

## Why this guide matters

Zova uses a multi-dimensional environment and configuration model so frontend behavior can vary cleanly across runtime scenarios without scattering ad hoc conditionals through the codebase.

That matters because SSR, SPA, edition-specific flavors, and deployment-specific variants all need a shared way to select the right settings.

## The three core dimensions

Zova’s frontend runtime model is built around three dimensions:

- **mode**
- **appMode**
- **flavor**

Together they determine which env variables, config files, and script paths should be active.

## Runtime mode

Runtime mode describes whether the app is running in:

- `development`
- `production`

This affects script behavior, environment loading, and tree-shakeable flags such as `DEV` and `PROD`.

## App mode

App mode describes the application delivery model, such as:

- `ssr`
- `spa`

This matters because SSR and SPA have different runtime assumptions, build paths, and environment-sensitive code behavior.

## Flavor

Flavor adds a third dimension so the frontend can support different product or UI variants without flattening everything into only one mode axis.

Representative built-in flavors include:

- `admin`
- `web`
- `cabloyBasicAdmin`
- `cabloyStartAdmin`
- `cabloyStartWeb`

Flavor is especially important in Cabloy because Basic and Start do not always share the same frontend stack or output assumptions.

## Env-file loading model

Zova loads env files from `env/` using the multi-dimensional model.

Representative patterns include:

- `.env`
- `.env.[meta]`
- `.env.local`
- `.env.[meta].local`

This means env loading is layered and conditional rather than single-file only.

## Config-file loading model

Zova also loads frontend config files from `src/front/config/config/` using the same multi-dimensional logic.

Representative patterns include:

- `config.ts`
- `config.[meta].ts`
- `config.local.ts`
- `config.[meta].local.ts`

That keeps env variables and frontend config aligned around the same runtime-selection model.

## Resolution principle

The practical rule is:

- base files always load
- meta-specific files load when their dimensions match
- `.local` files override while remaining git-ignored

This lets projects combine shared defaults with scenario-specific and local overrides cleanly.

## Scripts and runtime variants

Frontend scripts map directly onto the same runtime dimensions.

Representative commands include variants such as:

- `dev:ssr:admin`
- `build:ssr:admin`
- `dev:ssr:cabloyBasicAdmin`
- `build:ssr:cabloyBasicWeb`

That means scripts are not just convenience aliases. They are the operational surface for selecting mode, appMode, and flavor.

For current monorepo usage, also see [Frontend Scripts](/frontend/scripts).

## Tree-shakeable env flags

Some environment variables are especially important because they support tree-shaking or compile-time branching.

Representative flags include:

- `META_MODE`
- `META_APP_MODE`
- `META_FLAVOR`
- `NODE_ENV`
- `DEV`
- `PROD`
- `SSR`
- `CLIENT`
- `SERVER`

This is one of the most important reasons environment access should be done deliberately rather than by inventing custom runtime checks everywhere.

## `process.env` vs `sys.env` vs `sys.config`

Use the right access path for the right kind of value:

- `process.env` for tree-shakeable env-based conditions
- `sys.env` for runtime env values that are not tree-shaken
- `sys.config` for the merged frontend config model

This distinction is central to writing Zova code that behaves correctly across builds and runtime variants.

## Built-in env variables

Zova exposes built-in variables covering areas such as:

- app identity
- router mode
- dev-server settings
- project-disabled suites/modules
- build output settings
- API/proxy configuration
- SSR-specific values
- mock configuration

That means many common project-level knobs already exist and should be reused before inventing project-specific patterns.

## Custom flavors

Projects can define custom flavors when built-in variants are not enough.

This usually requires:

- adding scripts that pass the new `--flavor` value
- using `META_FLAVOR` or `sys.config.meta.flavor` in code
- optionally augmenting type definitions for better autocomplete

## Relationship to other frontend guides

Read this guide together with:

- [Frontend Scripts](/frontend/scripts)
- [SSR Environment Variables](/frontend/ssr-env)
- [Frontend Quickstart](/frontend/quickstart)

These guides explain the operational script surface, SSR-specific environment concerns, and the monorepo-first starting path.

## Why this matters for AI workflows

When AI edits frontend runtime-sensitive code, it should ask:

1. does this behavior depend on mode, appMode, flavor, or more than one of them?
2. should this logic read from `process.env`, `sys.env`, or `sys.config`?
3. is there already a built-in env/config variable for this concern?
4. does the active edition change which flavor or script family is correct?

That helps AI keep frontend runtime behavior aligned with Zova’s actual configuration model.
