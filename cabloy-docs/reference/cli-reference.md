# CLI Reference

This page is the fast orientation map for the two main Cabloy CLI entrypoints. Use it first when you need to answer three questions quickly:

1. Should this workflow use Vona or Zova?
2. Which command families already exist?
3. Where is the authoritative command definition for a specific command?

## Quick routing

### Use Vona for backend workflows

Run from the repo root:

```bash
npm run vona :
npm run vona :create
npm run vona :tools
```

Choose Vona for backend-oriented work such as suites, modules, beans, metadata, runtime assets, tests, and backend build or dev tasks.

### Use Zova for frontend workflows

Run from the repo root:

```bash
npm run zova :
npm run zova :create
npm run zova :refactor
npm run zova :openapi
```

Choose Zova for frontend-oriented work such as pages, components, frontend beans, refactors, generated frontend metadata, and OpenAPI-to-SDK generation.

## Source of truth

The shared root scripts live in `package.json`:

- `npm run vona`
- `npm run zova`

Those scripts enter thin CLI launchers and then hand off to the real command catalogs:

- Vona entrypoint: `vona/packages-cli/cli/src/bin/vona.ts`
- Zova entrypoint: `zova/packages-cli/cli/src/bin/zova.ts`
- Vona command registry: `vona/packages-cli/cli-set-api/src/lib/commands.ts`
- Zova command registry: `zova/packages-cli/cli-set-front/src/lib/commands.ts`

When you need the authoritative command-family map, inspect the two `commands.ts` files first.

## Command families

### Vona families

- `bin:*` — backend runtime and build tasks
- `create:*` — create suites, modules, beans, and tests
- `init:*` — initialize backend source artifacts
- `tools:*` — metadata, dependency, and CRUD-related tools

### Zova families

- `bin:*` — frontend build tasks
- `create:*` — create suites, modules, pages, components, mocks, and beans
- `init:*` — initialize frontend source artifacts
- `refactor:*` — frontend refactor workflows
- `tools:*` — metadata and dependency tools
- `openapi:*` — OpenAPI config and SDK generation workflows

## Fast path to a specific command

For a specific command, use this navigation path:

1. choose `npm run vona` or `npm run zova`
2. inspect the relevant `commands.ts` registry
3. open the matching command module in `src/lib/command/`
4. read `info.title`, `info.usage`, and `options`

Representative command modules:

- `vona/packages-cli/cli-set-api/src/lib/command/bin.play.ts`
- `zova/packages-cli/cli-set-front/src/lib/command/tools.metadata.ts`

This is the preferred path for both humans and AI agents because it follows the real registration flow instead of relying on scattered examples.

## Related guides

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Frontend (Zova)](/frontend/introduction)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

If the public CLI surface is enough, prefer it over file-level implementation details. Drop to the source files only when you need the authoritative registry or per-command metadata.
