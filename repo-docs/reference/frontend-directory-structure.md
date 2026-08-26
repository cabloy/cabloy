# Frontend Directory Structure

This page gives a compact reference view of the frontend tree under `zova/`.

## Why this page exists

The package map explains the architectural meaning of package, module, and suite boundaries.

This page complements that by showing the practical frontend tree layout used in the Cabloy repository.

## Simplified frontend tree

Representative frontend structure:

```text
zova/
├── packages-cli/
├── packages-utils/
├── packages-zova/
├── env/
├── public/
├── src-ssr/
└── src/
   ├── boot/
   ├── css/
   ├── front/
   │  ├── config/
   │  └── typing/
   ├── module/
   ├── module-vendor/
   ├── suite/
   └── suite-vendor/
```

## Meaning of the main directories

| Path                      | Meaning                                        |
| ------------------------- | ---------------------------------------------- |
| `zova/packages-cli/`      | Zova CLI entrypoints and command sets          |
| `zova/packages-utils/`    | shared frontend-side utilities                 |
| `zova/packages-zova/`     | framework packages                             |
| `zova/env/`               | frontend env files and runtime/build inputs    |
| `zova/public/`            | public static assets                           |
| `zova/src-ssr/`           | SSR entrypoints and SSR-related project source |
| `zova/src/boot/`          | app bootstrapping and startup registration     |
| `zova/src/css/`           | project-level CSS and theme entry assets       |
| `zova/src/front/config/`  | project-level frontend config overrides        |
| `zova/src/front/typing/`  | project-level frontend type definitions        |
| `zova/src/module/`        | first-party standalone frontend modules        |
| `zova/src/module-vendor/` | vendor-provided standalone frontend modules    |
| `zova/src/suite/`         | first-party frontend suites and their modules  |
| `zova/src/suite-vendor/`  | vendor-provided frontend suites and modules    |

## Project-level frontend areas

Within the frontend application layer, contributors should also know these practical areas:

| Path                     | Meaning                                            |
| ------------------------ | -------------------------------------------------- |
| `zova/env/`              | frontend env files and runtime/build inputs        |
| `zova/public/`           | project-level public static assets                 |
| `zova/src-ssr/`          | project-level SSR entry and SSR middleware wiring  |
| `zova/src/boot/`         | project-level boot registration and startup hooks  |
| `zova/src/css/`          | project-level CSS, theme, and style entry assets   |
| `zova/src/front/config/` | project-level frontend config and override surface |
| `zova/src/front/typing/` | project-level frontend typing definitions          |

## Edition note

The high-level Zova tree above is intentionally stable across Cabloy Basic and Cabloy Start.

A practical rule is:

- use the shared tree as the structural reference
- treat suite names and UI-layer examples as edition-sensitive details
- in Cabloy Basic, public examples may include suites such as `cabloy-basic` and `a-devui`
- in Cabloy Start, examples may include suites such as `cabloy-start` and `a-vuetify`

Cabloy Start is a sibling repository, not a subdirectory of this monorepo.

## Practical development reading of the tree

A useful rule is:

- start in `zova/src/module/` when the work belongs to a standalone frontend module
- start in `zova/src/suite/` when the work belongs to a suite-composed business area
- inspect `zova/packages-cli/` when the task is about command discovery, generation behavior, or refactor behavior
- inspect `zova/src/front/config/` when the task is about project-level frontend config overrides rather than module-local defaults
- inspect `zova/src/boot/` or `zova/src-ssr/` when the task is about startup flow or SSR behavior
- inspect `zova/src/css/` and `zova/public/` when the task is about project-level styling or static assets

A practical generator-oriented reading is:

- `create:*` commands choose the structural target before placing frontend resources
- `init:*` commands create project-level or module-level support assets
- `refactor:*` commands reshape existing frontend patterns without requiring manual rework from scratch
- `openapi:*` commands affect generated SDK-related frontend surfaces

## Relationship to other reference pages

Read this page together with:

- [Package Map](/reference/package-map)
- [Frontend (Zova)](/frontend/introduction)
- [Modules and Suites](/frontend/modules-and-suites)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [App Startup Guide](/frontend/app-startup-guide)
- [System Startup Guide](/frontend/system-startup-guide)
- [Frontend CLI](/frontend/cli)

A practical split is:

- [Frontend (Zova)](/frontend/introduction) is the broader frontend hub
- [Package Map](/reference/package-map) explains architecture boundaries and package metadata
- this page explains the practical directory tree contributors navigate

## Implementation checks for frontend file-location changes

When changing frontend code, ask:

1. does this change belong to a standalone module, a suite-contained module, or a project-level frontend area?
2. is the task about generation behavior under `packages-cli/`, startup behavior under `src/boot` or `src-ssr`, or feature code under `src/`?
3. should the example use a shared structural path, a Cabloy Basic example, or a public Cabloy Start example note?

That helps keep frontend file references aligned with the actual monorepo layout.
