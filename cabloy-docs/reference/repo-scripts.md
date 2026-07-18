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
- `npm run dev:zova:commerce:web`
- `npm run dev:zova:commerce:admin`
- `npm run build`
- `npm run build:zova`
- `npm run build:zova:commerce`
- `npm run build:zova:commerce:web`
- `npm run build:zova:commerce:admin`
- `npm run start`
- `npm run test`
- `npm run test:e2e:basic`
- `npm run test:e2e:basic:web`
- `npm run test:e2e:basic:admin`
- `npm run test:e2e:basic:dev`
- `npm run test:e2e:commerce`
- `npm run test:e2e:commerce:web`
- `npm run test:e2e:commerce:admin`
- `npm run test:e2e:commerce:dev`
- `npm run tsc`
- `npm run docs:dev`
- `npm run docs:build`
- `npm run docs:preview`

## SSR browser checks

Both E2E families use the same command structure:

- `test:e2e:<suite>` runs every browser scenario in the suite.
- `test:e2e:<suite>:web` and `test:e2e:<suite>:admin` run one surface.
- `test:e2e:<suite>:dev` resets managed local test state, starts one development Vona worker, and runs the complete suite.

The Basic skeleton exercises Web at `/` and anonymous Admin routing at `/admin` through Vona's SSR dispatcher. Prepare fresh Basic SSR artifacts explicitly when frontend SSR output has changed:

```bash
npm run build:zova
npm run deps:vona
npm run test:e2e:basic:dev
```

For an externally managed Basic target, set `BASIC_E2E_BASE_URL` and use an aggregate or focused command. These commands do not reset, start, stop, or rebuild the target:

```bash
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic:web
BASIC_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:basic:admin
```

Commerce browser acceptance exercises Customer Web at `/commerce` and anonymous Operator Admin routing at `/commerce-admin`. Prepare its paired artifacts explicitly:

```bash
npm run build:zova:commerce
npm run deps:vona
npm run test:e2e:commerce:dev
```

For an externally managed Commerce target, set `COMMERCE_E2E_BASE_URL` and use the matching aggregate or focused command. The target owner is responsible for data, cache, and artifact freshness:

```bash
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:web
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:admin
```

## Edition-sensitive note

Cabloy Start keeps the same high-level pattern while using different frontend flavors such as `cabloyStartAdmin` and `cabloyStartWeb`, plus its own SSR site baselines and project assets in the licensed private repository.

When documenting or automating flavor-specific commands, always confirm the active repo first.

## Read together with

Use this page together with:

- [Backend Quickstart](/backend/quickstart)
- [Runtime and Flavors](/backend/runtime-and-flavors)
- [CLI Reference](/reference/cli-reference)
