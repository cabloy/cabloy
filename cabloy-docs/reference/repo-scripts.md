# Repo Scripts

The root `package.json` is the first reference point for shared monorepo workflows.

## Current shared entrypoints in Cabloy Basic

- `npm run init`
- `npm run vona`
- `npm run zova`
- `npm run dev`
- `npm run dev:zova:admin`
- `npm run dev:zova:web`
- `npm run build`
- `npm run build:zova`
- `npm run start`
- `npm run test`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

## Edition-sensitive note

Cabloy Start keeps the same high-level pattern while using different frontend flavors such as `cabloyStartAdmin` and `cabloyStartWeb`.

### Documentation and automation guidance

When documenting or automating flavor-specific commands, always confirm the active repo first.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
