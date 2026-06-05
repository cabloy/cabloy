# Fullstack Quickstart

This quickstart is intentionally monorepo-native.

## 1. Install dependencies

At the repository root:

```bash
npm run init
```

## 2. Start the backend

```bash
npm run dev
```

## 3. Start the frontend for the edition you are working with

### Cabloy Basic

```bash
npm run dev:zova:admin
npm run dev:zova:web
```

### Cabloy Start

The sibling `cabloy-start` repository uses different Zova flavors such as `cabloyStartAdmin` and `cabloyStartWeb`.

Do not copy Cabloy Basic examples blindly. Instead:

1. confirm the `__CABLOY_START__` marker
2. inspect that repo’s `package.json`
3. use the exact Start-specific flavor names found there before documenting or automating the workflow

## 4. Prefer CLI-backed generation over manual scaffolding

Instead of creating framework files by hand, start with:

```bash
npm run vona :create
npm run zova :create
```

Then narrow into the specific command family you need.

## 5. Verify with root scripts

Use the root scripts before declaring a workflow correct:

```bash
npm run tsc
npm run test
npm run build
```

Choose more targeted checks when only one area is affected, but treat the root scripts as the shared reference surface.
