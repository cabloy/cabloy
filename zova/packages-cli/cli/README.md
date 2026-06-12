# zova-cli

This package is the thin Zova CLI entrypoint.

## Purpose

From the monorepo root, `npm run zova` resolves to this package and launches the frontend-oriented CLI flow.

Primary entrypoint:

- `src/bin/zova.ts`

This entrypoint stays intentionally small. It validates the top-level environment and hands off to the Zova command runtime.

## Source of truth

Do not treat this package as the full command catalog. The authoritative Zova command-family registry lives in:

- `../../packages-cli/cli-set-front/src/lib/commands.ts`

Inspect that file first when you need to know:

- which command families exist
- which command names are registered
- which command module implements each entry

Current top-level families include:

- `bin`
- `create`
- `init`
- `refactor`
- `tools`
- `openapi`

## Where command details live

Each command module in `../../packages-cli/cli-set-front/src/lib/command/` provides the main CLI-facing metadata, including:

- `info.title`
- `info.usage`
- `options`

Representative example:

- `../../packages-cli/cli-set-front/src/lib/command/tools.metadata.ts`

## Recommended navigation path

1. start from `npm run zova`
2. inspect `src/bin/zova.ts` only for top-level dispatch behavior
3. inspect `cli-set-front/src/lib/commands.ts` for the authoritative catalog
4. inspect the specific command module for usage and options

## Canonical public reference

For the compact top-level overview shared across Vona and Zova, start with:

- `../../../cabloy-docs/reference/cli-reference.md`
