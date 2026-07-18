# A-Commerce Phase 20 Contract Loop

## Purpose

This note records the executable contract boundary introduced by Phase 20. It supplements the delivery rules in [the A-Commerce SRS](./srs.md) and [PDP/WBS](./pdp-wbs.md); it does not replace them.

## Commerce sites and flavors

| Surface  | Vona SSR site   | Public path       | Zova flavor           | Paired root build                   |
| -------- | --------------- | ----------------- | --------------------- | ----------------------------------- |
| Customer | `commerce`      | `/commerce`       | `cabloyCommerce`      | `npm run build:zova:commerce:web`   |
| Operator | `commerceAdmin` | `/commerce-admin` | `cabloyCommerceAdmin` | `npm run build:zova:commerce:admin` |

Each paired build creates the matching SSR bundle under its Commerce site-owner module and a generated REST package under `vona/.zova-rest/`. The generated REST directories are build artifacts and must not be edited manually.

## Forward chain: Vona contract to Zova consumer

When a Commerce Vona DTO, controller, validation rule, or OpenAPI declaration changes:

1. update and verify Vona contract truth first;
2. start the local API when OpenAPI generation needs the Swagger endpoint;
3. configure the owning Zova module with `npm run zova :openapi:config <module>` once it exposes operations;
4. ensure the module declares non-empty `operations.match` or `operations.ignore`;
5. regenerate with `npm run zova :openapi:generate <module>`;
6. consume the generated API/schema from a thin Zova Model facade rather than hand-patching generated files.

## Reverse chain: Zova site metadata to Vona consumer

When Commerce routes, pages, icons, render metadata, or other Vona-consumed frontend metadata changes:

```bash
npm run build:zova:commerce:web
# or
npm run build:zova:commerce:admin
npm run deps:vona
```

Never substitute `build:rest:*` alone: the SSR bundle and generated REST package form one boundary and must move together.

## Verification evidence

Phase 20 retains build and browser evidence for:

- `ATP-CTR-01`: each paired build produces separate Commerce SSR and REST artifacts and `npm run deps:vona` resolves them;
- `ATP-SSR-01`: anonymous `/commerce` HTML contains no cart, address, order, coupon, or payment data before hydration, then the browser observes `html[data-zova-hydrated="commerce"]`;
- `ATP-SSR-02`: `/commerce-admin` is independent from `/commerce`, redirects to its own login route, then the browser observes `html[data-zova-hydrated="commerceAdmin"]`; future operator routes and APIs must independently enforce tenant-scoped authorization.

`data-zova-hydrated` is absent from raw SSR HTML. Zova's `a-ssr` lifecycle sets it client-side from `onHydrated()` after the SSR root and framework-tracked nested hydration work drain. It is an initial SSR-hydration marker, not a generic SPA or later client-navigation ready signal.

Build both paired Commerce SSR/REST artifacts whenever Commerce frontend or generated contract output changes:

```bash
npm run build:zova:commerce
npm run deps:vona
```

Then run the clean development-Vona browser acceptance gate:

```bash
npm run test:e2e:commerce:dev
```

The wrapper runs `npm run db:reset`, which recreates Vona's managed test database and clears the local Vona Redis namespace. Playwright then starts one `npm run dev:one` Vona worker and exercises both `/commerce` and `/commerce-admin` through `http://127.0.0.1:7102`. This validates Vona site selection and in-process SSR using the already-built Commerce site assets without rebuilding Vona for every browser run.

For a separately managed Vona instance, use `COMMERCE_E2E_BASE_URL`. The aggregate command runs both browser scenarios; `:web` and `:admin` select the durable `@web` and `@admin` surface tags. Use `-- --grep <tag>` for a capability or future workflow category rather than adding a root script per scenario. None resets the target or manages its process, so the caller owns data and cache cleanliness:

```bash
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:web
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:admin
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce -- --grep @smoke
```

Do not use the Zova development-server port `9000` for these checks. The acceptance target is Vona's SSR site dispatch at `7102`; changing only `COMMERCE_E2E_BASE_URL` does not rebind a Zova development server to another port.
