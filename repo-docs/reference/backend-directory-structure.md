# Backend Directory Structure

This page gives a compact reference view of the backend tree under `vona/`.

## Why this page exists

The package map explains the architectural meaning of package, module, and suite boundaries.

This page complements that by showing the practical backend tree layout used in the Cabloy repository.

## Simplified backend tree

Representative backend structure:

```text
vona/
├── packages-cli/
├── packages-utils/
├── packages-vona/
└── src/
   ├── module/
   ├── module-vendor/
   ├── suite/
   └── suite-vendor/
```

## Meaning of the main directories

| Path                      | Meaning                                  |
| ------------------------- | ---------------------------------------- |
| `vona/packages-cli/`      | Vona CLI entrypoints and command sets    |
| `vona/packages-utils/`    | shared backend-side utilities            |
| `vona/packages-vona/`     | framework packages                       |
| `vona/src/module/`        | first-party standalone modules           |
| `vona/src/module-vendor/` | vendor-provided standalone modules       |
| `vona/src/suite/`         | first-party suites and their modules     |
| `vona/src/suite-vendor/`  | vendor-provided suites and their modules |

## Project-level backend areas

Within the backend application layer, contributors should also know these practical areas:

| Path                       | Meaning                                            |
| -------------------------- | -------------------------------------------------- |
| `vona/env/`                | backend env files and runtime configuration inputs |
| `vona/src/backend/config/` | project-level backend config and locale overrides  |
| `vona/src/backend/typing/` | project-level backend type definitions             |
| `vona/src/backend/play/`   | backend playground-oriented verification assets    |

## Practical development reading of the tree

A useful rule is:

- start in `vona/src/module/` when the work belongs to a standalone module
- start in `vona/src/suite/` when the work belongs to a suite-composed business area
- inspect `vona/packages-cli/` when the task is about command discovery or generation behavior
- inspect `vona/src/backend/config/` when the task is about project-level config overrides rather than module-local defaults

A practical generator-oriented reading is:

- `:create:module` and `:create:suite` choose the structural target first
- `:create:bean` then places scene-based resources under the chosen module
- initializer commands such as `:init:constant`, `:init:types`, and `:init:asset` create module-scope resource files rather than ordinary bean-scene classes

## Relationship to other reference pages

Read this page together with:

- [Package Map](/reference/package-map)
- [Backend Essentials](/backend/backend-essentials)
- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)

A practical split is:

- [Backend (Vona)](/backend/introduction) is the broader backend hub
- [Package Map](/reference/package-map) explains architecture boundaries and package metadata
- this page explains the practical directory tree contributors navigate

## Implementation checks for backend file-location changes

When changing backend code, ask:

1. does this change belong to a standalone module, a suite-contained module, or project-level backend config?
2. is the task about generation behavior under `packages-cli/` or runtime behavior under `src/`?
3. should the example use a module path, a suite path, or a project-level backend path?

That helps keep backend file references aligned with the actual monorepo layout.
