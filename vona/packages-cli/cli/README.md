# vona-cli

This package is the thin Vona CLI entrypoint.

## Purpose

From the monorepo root, `npm run vona` resolves to this package and launches the backend-oriented CLI flow.

Primary entrypoint:

- `src/bin/vona.ts`

This entrypoint stays intentionally small. It handles top-level argument parsing, the special `play` dispatch path, and handoff to the Vona command runtime.

## Source of truth

Do not treat this package as the full command catalog. The authoritative Vona command-family registry lives in:

- `../../packages-cli/cli-set-api/src/lib/commands.ts`

Inspect that file first when you need to know:

- which command families exist
- which command names are registered
- which command module implements each entry

Current top-level families include:

- `bin`
- `create`
- `init`
- `tools`

## Where command details live

Each command module in `../../packages-cli/cli-set-api/src/lib/command/` provides the main CLI-facing metadata, including:

- `info.title`
- `info.usage`
- `options`

Representative example:

- `../../packages-cli/cli-set-api/src/lib/command/bin.play.ts`

## Recommended navigation path

1. start from `npm run vona`
2. inspect `src/bin/vona.ts` only for top-level dispatch behavior
3. inspect `cli-set-api/src/lib/commands.ts` for the authoritative catalog
4. inspect the specific command module for usage and options

## Canonical public reference

For the compact top-level overview shared across Vona and Zova, start with:

- `../../../repo-docs/reference/cli-reference.md`
