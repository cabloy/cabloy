# Package Map

This monorepo is organized around a small set of stable top-level areas.

## Root

- `package.json` — shared scripts and release entrypoints
- `lerna.json` — package topology
- `.docs-internal/` — internal engineering docs
- `.claude/` — Claude commands, skills, and local settings
- `cabloy-docs/` — unified public docs

## Backend side

- `vona/packages-cli/` — Vona CLI and command sets
- `vona/packages-utils/` — shared utilities
- `vona/packages-vona/` — framework packages
- `vona/src/module/` — first-party Vona modules
- `vona/src/module-vendor/` — vendor-provided modules
- `vona/src/suite/` — first-party suites and their modules
- `vona/src/suite-vendor/` — vendor-provided suites and their modules

A useful structural rule is:

- **package** is the publishable/package-metadata unit
- **module** is the main backend capability unit
- **suite** is the composition unit that groups modules into a larger architecture surface

## Representative backend package metadata

Representative package metadata in the current repo shows the distinction clearly.

### Module package

Example: `vona/src/module/demo-student/package.json`

- package name: `vona-module-demo-student`
- title: `demo-student`
- `vonaModule.dependencies` records module-level framework dependencies

### Suite package

Example: `vona/src/suite/a-demo/package.json`

- package name: `vona-suite-a-demo`
- title: `a-demo`
- `dependencies` declare which module packages the suite composes

### Suite-contained module package

Example: `vona/src/suite/a-demo/modules/demo-basic/package.json`

- package name: `vona-module-demo-basic`
- title: `demo-basic`
- `vonaModule.dependencies` still expresses module-level dependencies even when the module lives under a suite

This matters because Vona modularization is not just folder layout. Package metadata participates in dependency declarations and architecture boundaries.

## Practical modularization edge table

| Unit    | Main role                             | Where dependency intent is usually expressed                         |
| ------- | ------------------------------------- | -------------------------------------------------------------------- |
| Package | metadata and publication unit         | package-level `dependencies`, scripts, exports, and release metadata |
| Module  | main backend capability unit          | `vonaModule.dependencies` for framework/module dependency intent     |
| Suite   | composition unit for multiple modules | normal package `dependencies` that compose module packages           |

A practical comparison is:

- a standalone module package still uses `vonaModule.dependencies` to describe backend framework/module dependency intent
- a suite package uses ordinary package `dependencies` to compose the module packages it contains or depends on
- a suite-contained module still remains a module package with its own `vonaModule.dependencies`

## How this relates to backend docs

Use this package map together with:

- [Backend Essentials](/backend/backend-essentials)
- [Backend Foundation](/backend/foundation)
- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Backend Directory Structure](/reference/backend-directory-structure)

A practical split is:

- the backend essentials pages explain the architecture model
- this page grounds that model in the real monorepo layout

For the broader backend entry path, also see [Backend (Vona)](/backend/introduction).

## Frontend side

- `zova/packages-cli/` — Zova CLI and command sets
- `zova/packages-utils/` — shared utilities
- `zova/packages-zova/` — framework packages
- `zova/src/` — modules, suites, and vendor source

For the frontend architectural meaning of modules, suites, scope-driven resources, and runtime/startup structure, see `/frontend/modules-and-suites`, `/frontend/module-scope`, `/frontend/ioc-and-beans`, `/frontend/environment-config-guide`, `/frontend/app-startup-guide`, and `/frontend/system-startup-guide`.

## Sibling edition

- `cabloy-start` is a separate sibling repository, not a subdirectory of this monorepo.

### Maintainer note for cross-repo guidance

When maintaining docs, skills, or rules that refer to Cabloy Start, keep the cross-repo guidance conceptually aligned with the system documented here.
