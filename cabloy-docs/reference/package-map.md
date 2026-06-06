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
- `vona/src/` — modules, suites, and vendor source

## Frontend side

- `zova/packages-cli/` — Zova CLI and command sets
- `zova/packages-utils/` — shared utilities
- `zova/packages-zova/` — framework packages
- `zova/src/` — modules, suites, and vendor source

For the frontend architectural meaning of modules, suites, scope-driven resources, and runtime/startup structure, see `/frontend/modules-and-suites`, `/frontend/module-scope`, `/frontend/ioc-and-beans`, `/frontend/environment-config-guide`, `/frontend/app-startup-guide`, and `/frontend/system-startup-guide`.

## Sibling edition

- `cabloy-start` is a separate sibling repository, not a subdirectory of this monorepo. Its docs, skills, and rules should still align conceptually with the system documented here.
