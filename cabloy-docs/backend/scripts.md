# Backend Scripts

This guide explains the main Vona script workflows in the Cabloy monorepo.

## Shared rule

Even though the underlying backend scripts still live in `vona/package.json`, contributors should usually start from the root scripts in the monorepo because they are the shared workflow surface.

## Root scripts vs Vona CLI

A practical distinction is:

- use root scripts for normal runtime workflows such as install, dev, build, start, test, and typecheck
- use `npm run vona ...` when you need backend command discovery, generation, initialization, or backend-specific tool flows

That means [Backend CLI](/backend/cli) and this page are complementary, not redundant.

## Development

Start the backend in the root repository:

```bash
npm run dev
```

The underlying Vona package also distinguishes multi-worker and single-worker development modes:

```bash
cd vona && npm run dev
cd vona && npm run dev:one
```

## Build

From the root repository:

```bash
npm run build
npm run build:docker
```

The backend-side build behavior is driven by Vona scripts such as:

- `build`
- `build:docker`

## Start

From the root repository:

```bash
npm run start
```

Vona also supports its normal and single-process start modes inside its own package:

```bash
cd vona && npm run start
cd vona && npm run start:one
```

For Docker output, use the Docker Compose workflow after `npm run build:docker`; Docker does not use a direct Vona start command.

## Test and typecheck

From the root repository:

```bash
npm run test
npm run tsc
```

The backend-specific script surface also includes:

- `cov`
- `db:reset`
- `play`

## Playground

The Playground remains a high-value verification path for fast backend checks.

```bash
cd vona && npm run play
```

Or through the CLI wrapper:

```bash
npm run vona :bin:play -- --flavor=play --dummy
```

## Database reset

```bash
cd vona && npm run db:reset
```

## Relationship to backend essentials

These scripts are part of the backend essentials workflow because they define how contributors actually enter the backend runtime.

A useful split is:

- scripts answer how the monorepo runs backend workflows
- the CLI answers how backend resources are discovered and generated
- modules and suites answer where generated resources belong

For the structural side of that story, also see [Backend Essentials](/backend/backend-essentials) and [Package Map](/reference/package-map).

## Guidance

When documenting or automating backend scripts:

- prefer root scripts for normal contributor workflows
- drop to `vona/package.json` only when you need backend-specific detail
- verify commands against current scripts before publishing examples

## Where to read next

If your next question is not only how the monorepo runs backend workflows, but which source surfaces those workflows eventually enter, continue with:

- [Backend CLI](/backend/cli)
- [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
