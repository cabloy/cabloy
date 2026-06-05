# Backend Scripts

This page migrates the most important Vona script guidance into the new monorepo docs.

## Shared rule

Even though the underlying backend scripts still live in `vona/package.json`, contributors should usually start from the root scripts in the monorepo because they are the shared workflow surface.

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

Vona also supports single-process and docker-oriented start modes inside its own package:

```bash
cd vona && npm run start
cd vona && npm run start:one
cd vona && npm run start:docker
```

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

The legacy docs surfaced the Playground as a fast verification path. That remains a high-value capability.

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

## Guidance

When documenting or automating backend scripts:

- prefer root scripts for normal contributor workflows
- drop to `vona/package.json` only when you need backend-specific detail
- verify commands against current scripts before publishing examples
