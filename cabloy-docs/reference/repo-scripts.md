# Repo Scripts

Use this page when you need the compact lookup surface for the shared root scripts exposed by the Cabloy Basic monorepo.

For the broader Reference landing page, see [Reference Introduction](/reference/introduction).

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
- `npm run test:e2e:basic`
- `npm run test:e2e:basic:dev`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

## Basic SSR browser checks

The Basic SSR skeleton exercises Web at `/` and anonymous Admin routing at `/admin` through Vona's SSR dispatcher. Prepare fresh Basic SSR artifacts explicitly when frontend SSR output has changed:

```bash
npm run build:zova
npm run deps:vona
```

Then run the clean local gate:

```bash
npm run test:e2e:basic:dev
```

The managed command resets Vona's local test database and Redis namespace, then starts one development Vona worker. Focused commands do not rebuild artifacts. To test an externally managed target without resetting it or managing its process, set `BASIC_E2E_BASE_URL`:

```bash
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic:web
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic:admin
```

## Edition-sensitive note

Cabloy Start keeps the same high-level pattern while using different frontend flavors such as `cabloyStartAdmin` and `cabloyStartWeb`, plus its own SSR site baselines and project assets in the licensed private repository.

When documenting or automating flavor-specific commands, always confirm the active repo first.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
