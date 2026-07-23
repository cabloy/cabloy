# A-Commerce Test Strategy and Acceptance Plan

## Purpose and Authority

This document defines the A-Commerce verification strategy, executable acceptance scenarios, evidence format, and release proof. It completes the planning traceability chain:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

The [PRD](./prd.md) owns product outcomes and business acceptance. The [SRS](./srs.md) owns system contracts, security, state machines, and invariants. The [PDP/WBS](./pdp-wbs.md) owns delivery sequencing. This test plan must not redefine those decisions; it defines how they are proved.

A-Commerce Phase 20 establishes the `a-commerce` Vona/Zova suite, Commerce flavor scripts, paired SSR/REST artifact builds, and a committed Playwright browser-E2E runner. Later business source paths remain future-gated until their owning WBS phase creates them.

## Scope and Quality Priorities

This plan covers the MVP risks that cannot be accepted on manual confidence alone:

1. tenant isolation and customer/operator resource ownership;
2. atomic stock reservation and prevention of oversell;
3. rollback of incomplete checkout work;
4. coupon eligibility, reservation, release, and redemption;
5. idempotent payment and refund event handling;
6. 30-minute unpaid expiry and lifecycle races;
7. shipment/refund mutual exclusion;
8. immutable commercial snapshots;
9. independent Commerce SSR sites, generated contracts, anonymous SSR privacy, and hydration.

Deferred product capabilities remain out of scope: real payment providers, external channels, multiple warehouses, split shipment, partial refunds, post-shipment returns/RMA, percentage or stacked promotions, tax/shipping-rate engines, and multi-currency selling.

## Verification Model

### Narrow verification

Run the smallest tests that cover the changed capability owner and invariant. Backend tests use the established Vona module-local test structure with `node:test` and `vona-mock`.

Use `app.bean.executor.mockCtx(...)` for tenant/request context, `app.bean.executor.performAction(...)` for action/API behavior, Passport mock sign-in/out helpers for identity, direct persisted-state reads for invariants, and `assert.rejects(...)` for denied operations or forbidden transitions.

Runner parallelism does not prove a race condition. Contention tests must explicitly launch competing business operations and assert their combined durable outcome.

### Contract verification

When Vona DTOs, controllers, or API schemas change, change backend contract truth first and regenerate Zova consumers through the forward contract loop. When Zova metadata or routes change, run the matching Commerce flavor's paired SSR + REST build before `npm run deps:vona`; REST-only output is not sufficient.

### Full verification

Before a release candidate, run the required focused tests, complete suite, type/lint/format checks, both Commerce flavor artifact builds, generated-contract synchronization, cross-database transaction tests, and browser-driven acceptance once the project adopts a committed browser runner.

## Test Levels and Planned Locations

| Level                         | Purpose                                                                        | Current or future location                                                          |
| ----------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Service and state tests       | Validate money, eligibility, transitions, and snapshots                        | Existing and future module-local `test/**/*.ts`                                     |
| Transaction/integration tests | Prove atomic checkout, locking, rollback, expiry, and idempotency              | Existing and future module-local `test/**/*.ts` with `vona-mock`                    |
| Action/API tests              | Prove authentication, tenant/resource ownership, and invalid-transition denial | Existing and future module-local `test/**/*.ts` with `performAction(...)`           |
| Cross-database tests          | Confirm transaction/locking behavior on supported database clients             | Existing CI pattern; Commerce cases added when implemented                          |
| Contract tests                | Prove generated REST and SSR artifacts match changed contracts                 | Existing paired Commerce build wrappers                                             |
| SSR document tests            | Inspect anonymous HTML, site selection, route admission, and assets            | Existing Commerce Playwright HTTP/browser checks; future site-owner tests as needed |
| Browser acceptance            | Prove real navigation, hydration, interaction, and operator/customer journeys  | `e2e/specs/a-commerce/`                                                             |

Planned backend test ownership:

```text
vona/src/suite/a-commerce/modules/commerce-catalog/test/catalog.test.ts
vona/src/suite/a-commerce/modules/commerce-trade/test/checkoutReservation.test.ts
vona/src/suite/a-commerce/modules/commerce-trade/test/orderSnapshot.test.ts
vona/src/suite/a-commerce/modules/commerce-trade/test/reservationExpiry.test.ts
vona/src/suite/a-commerce/modules/commerce-trade/test/shipmentRefundRace.test.ts
vona/src/suite/a-commerce/modules/commerce-promotion/test/couponReservation.test.ts
vona/src/suite/a-commerce/modules/commerce-payment/test/paymentIdempotency.test.ts
vona/src/suite/a-commerce/modules/commerce-payment/test/refundLifecycle.test.ts
vona/src/suite/a-commerce/modules/commerce-member/test/addressOwnership.test.ts
vona/src/suite/a-commerce/modules/commerce-siteweb/test/ssrPrivacy.test.ts
vona/src/suite/a-commerce/modules/commerce-siteadmin/test/operatorAccess.test.ts
```

These are target locations for capabilities not yet implemented. Existing Phase 20 and Phase 30 coverage already includes `commerce-catalog/test/catalog.test.ts`, `commerce-trade/test/stockBalance.test.ts`, `commerce-trade/test/stockAudit.test.ts`, and `commerce-siteadmin/test/operatorAccess.test.ts`. The test remains with the module that owns the invariant: checkout/reservation in trade, coupon state in promotion, event idempotency in payment, and SSR admission/privacy in the matching site owner.

## Test Fixtures and Evidence

### Minimum fixture set

Every isolation or concurrency suite prepares at least:

- tenant A and tenant B;
- customer A1 and customer A2 in tenant A, plus customer B1 in tenant B;
- a tenant-A catalogue/order/refund operator and an unauthorized operator;
- equivalent SKU identifiers or business values across tenants where meaningful;
- a bounded SKU whose last available unit can be contested;
- valid, expired, exhausted, cross-tenant, and per-customer-limited coupons;
- a deterministic current time or controllable reservation deadline for 30-minute expiry;
- mock payment and refund attempts with repeatable idempotency keys.

### Evidence record

Each accepted `ATP-*` scenario retains:

- the PRD, SRS, and WBS references;
- source revision and tested database/flavor;
- exact command or browser procedure;
- fixture and concurrency interleaving description when relevant;
- pass/fail result and retained log, response, screenshot, or artifact location;
- waiver owner, reason, and expiry date for any temporary exception.

An expired waiver is a release blocker.

### Phase 20 observed evidence

| ATP ID       | Traceability                            | Revision / database / flavor                                  | Command                                                                               | Result                                                                                   | Retained evidence                                                                                                                                     | Status           |
| ------------ | --------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `ATP-SSR-01` | `SRS-UI-03`, `SRS-NFR-02`, `WBS-20-02`  | `2631496342`; SQLite; `cabloyCommerce`                        | `npm run build:zova:commerce && npm run deps:vona && npm run test:e2e:commerce:clean` | Passed: anonymous privacy and Commerce hydration smoke scenario                          | [Commerce CI job 88671283757](https://github.com/cabloy/cabloy/actions/runs/29841507067/job/88671283757), 2026-07-21; 7 Commerce browser tests passed | CI-backed passed |
| `ATP-SSR-02` | `SRS-AUT-03`, `SRS-AUT-04`, `WBS-20-02` | `2631496342`; SQLite; `cabloyCommerceAdmin`                   | `npm run build:zova:commerce && npm run deps:vona && npm run test:e2e:commerce:clean` | Passed: independent Admin SSR smoke; full Vona suite includes direct operator API denial | [Commerce CI job 88671283757](https://github.com/cabloy/cabloy/actions/runs/29841507067/job/88671283757), 2026-07-21; 7 Commerce browser tests passed | CI-backed passed |
| `ATP-CTR-01` | `SRS-API-01`, `SRS-API-02`, `WBS-20-03` | `2631496342`; SQLite; `cabloyCommerce`, `cabloyCommerceAdmin` | `npm run build:zova:commerce && npm run deps:vona && npm run test:e2e:commerce:clean` | Passed: paired SSR/REST artifacts built and Vona dependency discovery synchronized       | [Commerce CI job 88671283757](https://github.com/cabloy/cabloy/actions/runs/29841507067/job/88671283757), 2026-07-21; all three commands passed       | CI-backed passed |

The `playwright-e2e` workflow runs independent Basic and Commerce clean browser baselines. [Commerce CI job 88671283757](https://github.com/cabloy/cabloy/actions/runs/29841507067/job/88671283757) passed at revision `2631496342` even though the unrelated Basic job failed; its independent success is durable CI evidence for the Phase 20 executable browser and contract-loop scenarios.

### Phase 30 observed evidence

| WBS / ATP scope                         | Traceability                                                                      | Revision / database / flavor          | Command                                                                                                                                                                                                                    | Result                                                                                                                                                                                                                                                                                                                                                                              | Retained evidence                                                                                                                                                                                                 | Status                  |
| --------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `WBS-30-02` stock-reservation primitive | `PRD-INV-01`, `PRD-INV-02`; `SRS-INV-01`–`SRS-INV-03`, `SRS-TXN-02`, `SRS-DAT-02` | `19b098e437`; PostgreSQL 17; `normal` | `TEST_CONCURRENCY=false DATABASE_DEFAULT_CLIENT=pg npm run vona :bin:test -- commerce-trade/test/stockBalance.test.ts commerce-trade/test/stockReservation.test.ts commerce-trade/test/stockAudit.test.ts --flavor=normal` | Passed: independent request contexts contend for one unit; exactly one reservation and reserve audit survive; the retried loser reports `409 insufficient available stock`; balance is `[1, 1, 0]`; transaction rollback leaves no partial balance, reservation, or audit write. Audit rows retain actor when an authenticated caller is present plus prior and resulting counters. | [PostgreSQL CI job 88804601983](https://github.com/cabloy/cabloy/actions/runs/29881977007/job/88804601983), 2026-07-22; focused gate passed 12 tests with 0 failures before unrelated legacy full-suite failures. | CI-backed scoped passed |

This proves the reusable Phase 30 stock primitive, not checkout-level `ATP-INV-01`: that scenario remains pending for WBS-40-03, which owns competing checkout requests. The same CI job correctly failed its subsequent pre-existing, concurrently unsafe full Vona suite after the test command began propagating failed test status; its successful focused stock gate remains the retained evidence for WBS-30-02.

| WBS / ATP scope                                 | Traceability                                                                                                 | Revision / database / flavor         | Command                                                                                                                                                                                                                       | Result                                                                                                                                                                                                                                              | Retained evidence                                                                                                                           | Status              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `WBS-30-01` immutable order-snapshot foundation | `PRD-CAT-*`, `PRD-ORD-03`; `SRS-CAT-02`, `SRS-MNY-01`, `SRS-MNY-02`, `SRS-MNY-04`, `SRS-TEN-01`–`SRS-TEN-04` | Local working tree; SQLite; `normal` | `npm run vona :bin:test -- commerce-catalog/test/catalog.test.ts commerce-catalog/test/sku.test.ts commerce-trade/test/orderSnapshot.test.ts commerce-trade/test/stockReservation.test.ts --flavor=normal` and `npm run test` | Passed: persisted address, SKU title/code/attributes, unit price, quantities, and totals survive later source edits; each snapshot line has a reservation link; same correlation replays the original snapshot and conflicting reuse returns `409`. | Local test output, 2026-07-22; 14 focused passes plus 1 PostgreSQL-only skip; full Vona suite passed 150 tests with 1 PostgreSQL-only skip. | Scoped local passed |

This is scoped foundation evidence, not a full `ATP-SNAP-01` pass: the scenario still requires the Phase 40+ checkout composition, coupon, payment, and refund views. Unpaid-expiry processing and checkout-level contention also remain in their owning WBS work.

### Phase 40 observed evidence

| WBS / ATP scope                                                                                   | Traceability                                                                                               | Revision / database / flavor                                            | Command                                                                                                                                                                                                                                   | Result                                                                                                                                                                                                                                                                                                                                                                                      | Retained evidence                                 | Status              |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------- |
| `WBS-40-01` authenticated address/cart ownership; applicable address/cart portion of `ATP-AUT-01` | `PRD-ORD-04`; `SRS-TEN-01`–`SRS-TEN-04`, `SRS-AUT-01`, `SRS-AUT-02`, `SRS-API-03`, `SRS-UI-01`–`SRS-UI-03` | `a63e640258`; SQLite; `normal`, `cabloyCommerce`, `cabloyCommerceAdmin` | `npm run vona :bin:test -- commerce-member/test/addressOwnership.test.ts commerce-trade/test/cartOwnership.test.ts --flavor=normal`; `npm run build:zova:commerce && npm run deps:vona && npm run tsc`; `npm run test:e2e:commerce:clean` | Passed: 6 direct-action ownership tests derive customer/instance authority server-side, reject anonymous calls, and treat foreign customer/instance resources as absent; paired SSR/REST build, dependency synchronization, and full type check passed; clean browser baseline passed 7 Commerce scenarios, including neutral protected address/cart entries and anonymous login redirects. | Clean isolated worktree local output, 2026-07-22. | Scoped local passed |

This is bounded WBS-40-01 evidence, not a complete pass for `ATP-AUT-01` or `ATP-TEN-01`: it does not cover orders, coupons, payment attempts, shipment, refunds, scheduled/recovery paths, or operator permissions. It also does not pass `ATP-INV-01`, `ATP-TXN-01`, `ATP-CPN-01`, `ATP-EXP-01`, or `ATP-SNAP-01`; those remain with WBS-40-02/03 and later lifecycle work.

| WBS / ATP scope                                                                                                                                                                                       | Traceability                                                                                                                                        | Revision / database / flavor                                            | Command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Retained evidence                                                                                                            | Status              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `WBS-40-02` coupon issue/reservation/expiry; `WBS-40-03` checkout/expiry/rollback; Phase-40-owned branches of `ATP-TEN-01`, `ATP-INV-01`, `ATP-TXN-01`, `ATP-CPN-01`, `ATP-EXP-01`, and `ATP-SNAP-01` | `SRS-CPN-01`–`SRS-CPN-03`; `SRS-INV-01`–`SRS-INV-03`; `SRS-TEN-01`–`SRS-TEN-04`; `SRS-TXN-01`–`SRS-TXN-05`; `SRS-MNY-02`–`SRS-MNY-04`; WBS-40-02/03 | `057eb45cb5` plus current working tree; SQLite and PostgreSQL; `normal` | SQLite: `DATABASE_DEFAULT_CLIENT=sqlite3 npm run vona :bin:test -- commerce-promotion/test/couponReservation.test.ts commerce-trade/test/checkoutReservation.test.ts commerce-trade/test/checkoutTransaction.test.ts commerce-trade/test/orderSnapshot.test.ts commerce-trade/test/reservationExpiry.test.ts --flavor=normal`. PostgreSQL: `DATABASE_DEFAULT_CLIENT=pg npm run vona :bin:test -- commerce-promotion/test/couponReservation.test.ts --flavor=normal`; `DATABASE_DEFAULT_CLIENT=pg npm run vona :bin:test -- commerce-trade/test/checkoutReservation.test.ts commerce-trade/test/checkoutTransaction.test.ts commerce-trade/test/orderSnapshot.test.ts commerce-trade/test/reservationExpiry.test.ts --flavor=normal`. Shared: `npm run tsc`; `npm run lint`; `npm run format`; `npm run test`. | SQLite: 16 passed, 2 PostgreSQL-only contention skips. PostgreSQL: 4 coupon tests and 14 trade tests passed; independently authenticated checkout final-unit and one-usage coupon competitions each yielded exactly one durable winner. Direct actions reject anonymous checkout and foreign address/coupon relations without partial writes. Coupon issuance rejects a foreign-instance recipient without a grant/audit/counter update. Checkout preserves address, SKU, coupon, totals, and initial payment amount after live source changes. The decorated expiry schedule releases/cancels only the active instance's due order and remains exact-once on repeat. Six injected checkout failures fully roll back. Shared checks passed: TypeScript, lint, format, and 177-test suite with 3 expected PostgreSQL-only skips. | Local command output, 2026-07-24. Run CI on the committed revision before promoting this local evidence to a CI-backed pass. | Scoped local passed |

This closes the independently-owned Phase 40 branches. Mock payment success/failure/cancellation, reservation consumption/coupon redemption, payment-success-versus-expiry contention, customer payment/order views, and refund behavior remain owned by Phases 50–60. No DTO/controller contract changed, so no OpenAPI regeneration or paired SSR/REST artifact build was required.

## Acceptance Scenario Catalogue

| ID            | Scenario                                                                                                                                                                                                                       | Expected invariant                                                                                                                                                                                                                                  | Level                        | Traceability                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ATP-TEN-01`  | Use tenant-A context to read or mutate tenant-B catalogue, stock, coupon, order, payment, shipment, refund, and relation-traversal identifiers; exercise scheduled/recovery paths with mixed tenant data.                      | Every cross-tenant request is denied or returns no resource; no background or recovery path crosses tenant scope.                                                                                                                                   | API, integration             | `PRD-ORD-04`; `SRS-TEN-01` through `SRS-TEN-04`, `SRS-DAT-01`; `WBS-30-*`, `WBS-40-*`, `WBS-70-02`                                       |
| `ATP-AUT-01`  | Exercise anonymous, customer, unauthorized operator, and authorized operator calls directly against customer/operator actions.                                                                                                 | Access is determined by server-side tenant/resource permissions, not route visibility, menu visibility, or browser-supplied claims.                                                                                                                 | API, SSR                     | `PRD-ORD-04`; `SRS-AUT-01` through `SRS-AUT-05`, `SRS-API-03`; `WBS-20-02`, `WBS-40-01`, `WBS-60-*`                                      |
| `ATP-INV-01`  | Launch competing checkout requests for the final available unit.                                                                                                                                                               | At most one order reserves the unit; losing requests leave no reservation and report insufficient stock.                                                                                                                                            | Transaction, PostgreSQL gate | `PRD-INV-01`, `PRD-INV-02`; `SRS-INV-01` through `SRS-INV-03`, `SRS-TXN-01`, `SRS-TXN-02`; `WBS-30-02`, `WBS-40-03`                      |
| `ATP-TXN-01`  | Inject a failure after each checkout stage: snapshot, stock reservation, coupon reservation, payment attempt, audit, and cache path.                                                                                           | No partial durable/cached order, reservation, coupon hold, payment attempt, or audit mutation remains.                                                                                                                                              | Transaction                  | `PRD-INV-03`, `PRD-ORD-02`; `SRS-TXN-01` through `SRS-TXN-03`, `SRS-TXN-06`; `WBS-30-02`, `WBS-40-03`                                    |
| `ATP-CPN-01`  | **Phase 40:** attempt invalid, expired, exhausted, cross-tenant, over-limit, and second-coupon issuance/reservation; expire a valid reservation. **Later:** exercise payment cancellation/failure and refund after redemption. | Phase 40 invalid usage leaves no writes, one coupon maximum is enforced, and unpaid expiry releases once. Phase 50 owns payment-event release/redemption; Phase 60 proves refund does not reissue redemption.                                       | Service, transaction, API    | `PRD-CPN-01` through `PRD-CPN-03`; `SRS-CPN-01` through `SRS-CPN-03`, `SRS-MNY-03`; `WBS-40-02`, `WBS-40-03`, `WBS-50-01`, `WBS-60-02`   |
| `ATP-PAY-01`  | Deliver the same mock payment-success notification sequentially and concurrently.                                                                                                                                              | Only one accepted payment transition, stock consumption, coupon redemption, and audit mutation occurs.                                                                                                                                              | Integration, API             | `PRD-PAY-01` through `PRD-PAY-03`; `SRS-PAY-01` through `SRS-PAY-03`, `SRS-TXN-04`; `WBS-50-01`                                          |
| `ATP-EXP-01`  | **Phase 40:** expire an unpaid order after 30 minutes and run the schedule over mixed-tenant due orders. **Phase 50:** race expiry against mock payment success.                                                               | Phase 40 releases stock/coupon and cancels the initial payment-attempt record exactly once without crossing tenant scope. Phase 50 transactionally selects one legal payment/expiry outcome.                                                        | Transaction, PostgreSQL gate | `PRD-INV-03`; `SRS-TXN-04`, `SRS-TXN-05`, `SRS-PAY-03`; `WBS-40-03`, `WBS-50-01`                                                         |
| `ATP-SHP-01`  | Create shipment for a paid order, then try unpaid, cancelled, expired, refunded, refund-pending, and cross-tenant orders.                                                                                                      | Only a current-tenant `paid` order gets one shipment with non-empty carrier/tracking data and an atomic `shipped` transition.                                                                                                                       | API, integration             | `PRD-SHP-01` through `PRD-SHP-03`; `SRS-ORD-01` through `SRS-ORD-03`, `SRS-SHP-01` through `SRS-SHP-03`; `WBS-60-01`                     |
| `ATP-RFD-01`  | Replay mock refund success sequentially and concurrently after an approved eligible request.                                                                                                                                   | Stock restores once, order becomes `refunded` once, coupon stays redeemed, and audit history is not duplicated.                                                                                                                                     | Integration, API             | `PRD-RFD-01` through `PRD-RFD-03`; `SRS-RFD-01` through `SRS-RFD-03`, `SRS-PAY-01` through `SRS-PAY-03`; `WBS-60-02`                     |
| `ATP-RACE-01` | Race shipment against refund request, approval, and refund execution.                                                                                                                                                          | Shipment wins and blocks refund, or refund wins and blocks shipment; no mixed order state or duplicate stock effect survives.                                                                                                                       | Transaction, PostgreSQL gate | `PRD-SHP-03`, `PRD-RFD-01` through `PRD-RFD-03`; `SRS-ORD-01` through `SRS-ORD-03`, `SRS-RFD-02`, `SRS-SHP-02`; `WBS-60-01`, `WBS-60-02` |
| `ATP-SNAP-01` | **Phase 40:** after checkout, change SKU title/attributes/price/publication, address, and coupon template. **Later:** expose the same facts through payment/refund views.                                                      | Phase 40 order snapshots and initial payment amount retain immutable purchase facts. Payment/refund view preservation remains with the owning later phases.                                                                                         | Service, API                 | `PRD-ORD-03`; `SRS-MNY-02` through `SRS-MNY-04`, `SRS-CAT-02`; `WBS-30-01`, `WBS-40-03`, `WBS-50-01`, `WBS-60-02`, `WBS-70-02`           |
| `ATP-SSR-01`  | Fetch anonymous `/commerce` HTML, load it in a browser, and inspect hydration.                                                                                                                                                 | Raw HTML contains no private cart, address, order, coupon, payment, or hydration-complete marker; browser hydration reaches `html[data-zova-hydrated="commerce"]` without page errors.                                                              | SSR, browser                 | PRD launch criteria; `SRS-UI-03`, `SRS-NFR-02`; `WBS-20-02`, `WBS-50-02`, `WBS-70-02`                                                    |
| `ATP-SSR-02`  | Exercise `/commerce-admin`, its menu/routes, and direct APIs with authorized and unauthorized tenant operators.                                                                                                                | The customer and operator sites are independent; the raw Admin login HTML has no marker, and hydrated browser reaches `html[data-zova-hydrated="commerceAdmin"]`; unauthorized users receive denial and no cross-tenant operator data is disclosed. | SSR, API, browser            | `PRD-ORD-04`; `SRS-AUT-03`, `SRS-AUT-04`, `SRS-TEN-*`; `WBS-20-02`, `WBS-60-*`, `WBS-70-02`                                              |
| `ATP-CTR-01`  | Change backend contract truth and then change frontend metadata/routes after Commerce wrappers exist.                                                                                                                          | Matching flavor artifacts are regenerated through the correct forward/reverse contract loop; no generated REST package is hand-patched.                                                                                                             | Build, contract              | `SRS-API-01`, `SRS-API-02`; `WBS-20-03`, `WBS-70-01`                                                                                     |

## SSR and Browser Acceptance

SSR, hydration, route admission, and Vona API authorization are separate evidence targets.

Customer-site verification must inspect actual anonymous HTML and subsequent hydrated behavior. It must prove that private customer data is absent before the authenticated client query resolves and that `/commerce` resolves to the Web home rather than the inherited Admin dashboard. Raw SSR HTML must also lack `data-zova-hydrated`; the browser must receive the site-specific attribute only after Zova's `a-ssr` lifecycle runs its `onHydrated()` callback (`commerce` for customer and `commerceAdmin` for operator). This is an initial SSR-hydration proof, not a generic SPA or later client-navigation readiness signal. Operator-site verification must prove that an unauthorized person cannot obtain access merely by knowing a route or menu path, and direct API calls remain independently protected.

Phase 20 commits a Playwright browser acceptance suite under `e2e/specs/a-commerce/`. Install Chromium once with `npx playwright install chromium`; after Commerce SSR/REST artifacts are current, the clean default path is `npm run test:e2e:commerce:clean`. It runs `npm run db:reset`, starts one Vona development worker, and runs both browser smoke scenarios through `http://127.0.0.1:7102`. The reset recreates Vona's managed test database and clears the local Vona Redis namespace. The existing SSR evidence uses `@smoke`; `:web` and `:admin` select their `@web` and `@admin` surface tags. Direct operator API authorization is independently covered by `commerce-siteadmin/test/operatorAccess.test.ts`: it proves the operator-context contract rejects anonymous and non-`systemAdmin` callers and returns only server-derived context to `systemAdmin`. Future Commerce interaction workflows must add a purpose tag such as `@flow` and use `-- --grep @flow`, rather than adding a root script per scenario. Set `COMMERCE_E2E_BASE_URL` to test an externally managed target without Playwright resetting, starting, or stopping Vona.

## Commands

### Available now

```bash
# Discover command families
npm run vona :
npm run zova :

# Run currently discovered Vona module tests
npm run test

# Shared repository checks
npm run tsc
npm run lint
npm run format
```

### Phase 20 browser acceptance

```bash
# Refresh both Commerce SSR and REST artifact pairs when frontend or contract output changed
npm run build:zova:commerce
npm run deps:vona

# Clean development-Vona browser acceptance: reset database and local Redis,
# start one Vona development worker, then run both smoke scenarios
npm run test:e2e:commerce:clean

# Aggregate, surface, or tag-filtered checks against an externally managed Vona target;
# the caller owns its database and cache cleanliness
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:web
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce:admin
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce -- --grep @smoke
```

### Future-gated after the relevant WBS work

```bash
# Focus a future module-local test after the suite and test file exist
npm run vona :bin:test -- commerce-trade/test/checkoutReservation.test.ts --flavor=normal
```

For release contention evidence, run the relevant Commerce transaction scenarios on PostgreSQL in addition to the fast default database suite. Existing CI provides the multi-database pattern; Commerce test cases must be added to it when the modules exist.

## Release Gates

| Gate               | Required proof                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 20           | `ATP-SSR-01`, `ATP-SSR-02`, and `ATP-CTR-01` evidence shows distinct sites/flavors, paired SSR/REST artifacts, anonymous privacy, and independent API denial.                                                   |
| Phases 30–40       | The Phase 30–40-owned branches of `ATP-TEN-01`, `ATP-AUT-01`, `ATP-INV-01`, `ATP-TXN-01`, `ATP-CPN-01`, `ATP-EXP-01`, and `ATP-SNAP-01` pass before payment depends on checkout state.                          |
| Phases 50–60       | `ATP-PAY-01`, the Phase-50 payment-success branch of `ATP-EXP-01`, `ATP-SHP-01`, `ATP-RFD-01`, and `ATP-RACE-01` pass before end-to-end acceptance.                                                             |
| Phase 70 / release | Every applicable PRD/SRS requirement maps to a passed `ATP-*` record; required builds, contract synchronization, tests, and browser evidence pass; no severity-one invariant failure or expired waiver remains. |

## Related Records

- [A-Commerce internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [ADR 0001: Establish A-Commerce MVP Boundaries](./decisions/0001-mvp-boundaries.md)
- [Transaction guide](../../../cabloy-docs/backend/transaction-guide.md)
- [Contract-loop playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
- [User workspace SSR strategy](../../architecture/user-workspace-ssr-strategy.md)
- [a-image refactor checklist](../../architecture/a-image-refactor-checklist.md)
