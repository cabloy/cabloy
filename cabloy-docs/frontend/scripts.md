# Frontend Scripts

This page migrates the most important Zova script guidance into the new monorepo docs.

## Shared rule

Zova can build `SSR`, `SPA`, `Web`, and `Admin` modes in one codebase. In Cabloy, contributors should usually start from the root scripts first, then drop into `zova/package.json` only when they need edition-specific detail.

## Cabloy Basic root wrappers

From the current root repository:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
```

These map to Basic-specific Zova flavors in this repository.

## Zova script model

The underlying Zova package still organizes scripts around app mode and flavor.

Examples from the current source include:

- `dev:ssr:admin`
- `build:ssr:admin`
- `preview:ssr:admin`
- `dev:ssr:web`
- `build:ssr:web`
- `preview:ssr:web`
- `dev:ssr:cabloyBasicAdmin`
- `build:ssr:cabloyBasicAdmin`
- `build:rest:cabloyBasicAdmin`
- `dev:ssr:cabloyBasicWeb`
- `build:ssr:cabloyBasicWeb`
- `build:rest:cabloyBasicWeb`

## Cabloy Basic

The current public repository documents and scripts support Basic-specific flavors such as:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative Zova commands inside this repo include:

```bash
cd zova && npm run dev:ssr:cabloyBasicAdmin
cd zova && npm run build:ssr:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicAdmin
```

## Cabloy Start

The sibling `cabloy-start` repository uses Start-specific flavors such as:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Those commands are not driven by the current Basic repo root wrappers, so verify the Start repo’s `package.json` before documenting or automating them.

## Guidance

When documenting or automating frontend scripts:

- start from root wrappers for normal Cabloy Basic workflows
- verify the exact flavor before writing edition-specific examples
- use REST/type generation commands deliberately when backend integration depends on them
