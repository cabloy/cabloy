# zova-cli-set-front

This package contains the authoritative Zova command catalog for frontend-oriented CLI workflows.

## Source of truth

The top-level command-family registry lives in:

- `src/lib/commands.ts`

Inspect this file first when you need to answer:

- which Zova command families exist
- which command names are registered
- which command module implements each entry

Current families include:

- `default`
- `bin`
- `create`
- `init`
- `refactor`
- `tools`
- `openapi`

## Command metadata surface

Each command module under `src/lib/command/` provides the main CLI-facing metadata for that command, typically including:

- `bean`
- `info.title`
- `info.usage`
- `options`

Representative example:

- `src/lib/command/tools.metadata.ts`

## Recommended navigation path

1. run `npm run zova`
2. inspect `../cli/src/bin/zova.ts` for entry dispatch only
3. inspect `src/lib/commands.ts` for the authoritative family map
4. inspect the specific command module for usage and options

## Public reference

For the compact top-level overview shared across Vona and Zova, see:

- `../../../cabloy-docs/reference/cli-reference.md`
