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

| Level                         | Purpose                                                                        | Current or future location                                    |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Service and state tests       | Validate money, eligibility, transitions, and snapshots                        | Future module-local `test/**/*.ts`                            |
| Transaction/integration tests | Prove atomic checkout, locking, rollback, expiry, and idempotency              | Future module-local `test/**/*.ts` with `vona-mock`           |
| Action/API tests              | Prove authentication, tenant/resource ownership, and invalid-transition denial | Future module-local `test/**/*.ts` with `performAction(...)`  |
| Cross-database tests          | Confirm transaction/locking behavior on supported database clients             | Existing CI pattern; Commerce cases added when implemented    |
| Contract tests                | Prove generated REST and SSR artifacts match changed contracts                 | Future paired Commerce build wrappers                         |
| SSR document tests            | Inspect anonymous HTML, site selection, route admission, and assets            | Future Commerce site-owner tests plus HTTP checks             |
| Browser acceptance            | Prove real navigation, hydration, interaction, and operator/customer journeys  | Future `e2e/a-commerce/` after a committed runner is selected |

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

These are target locations, not currently existing files. The test remains with the module that owns the invariant: checkout/reservation in trade, coupon state in promotion, event idempotency in payment, and SSR admission/privacy in the matching site owner.

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

## Acceptance Scenario Catalogue

| ID            | Scenario                                                                                                                                                                                                  | Expected invariant                                                                                                                             | Level                        | Traceability                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ATP-TEN-01`  | Use tenant-A context to read or mutate tenant-B catalogue, stock, coupon, order, payment, shipment, refund, and relation-traversal identifiers; exercise scheduled/recovery paths with mixed tenant data. | Every cross-tenant request is denied or returns no resource; no background or recovery path crosses tenant scope.                              | API, integration             | `PRD-ORD-04`; `SRS-TEN-01` through `SRS-TEN-04`, `SRS-DAT-01`; `WBS-30-*`, `WBS-40-*`, `WBS-70-02`                                       |
| `ATP-AUT-01`  | Exercise anonymous, customer, unauthorized operator, and authorized operator calls directly against customer/operator actions.                                                                            | Access is determined by server-side tenant/resource permissions, not route visibility, menu visibility, or browser-supplied claims.            | API, SSR                     | `PRD-ORD-04`; `SRS-AUT-01` through `SRS-AUT-05`, `SRS-API-03`; `WBS-20-02`, `WBS-40-01`, `WBS-60-*`                                      |
| `ATP-INV-01`  | Launch competing checkout requests for the final available unit.                                                                                                                                          | At most one order reserves the unit; losing requests leave no reservation and report insufficient stock.                                       | Transaction, PostgreSQL gate | `PRD-INV-01`, `PRD-INV-02`; `SRS-INV-01` through `SRS-INV-03`, `SRS-TXN-01`, `SRS-TXN-02`; `WBS-30-02`, `WBS-40-03`                      |
| `ATP-TXN-01`  | Inject a failure after each checkout stage: snapshot, stock reservation, coupon reservation, payment attempt, audit, and cache path.                                                                      | No partial durable/cached order, reservation, coupon hold, payment attempt, or audit mutation remains.                                         | Transaction                  | `PRD-INV-03`, `PRD-ORD-02`; `SRS-TXN-01` through `SRS-TXN-03`, `SRS-TXN-06`; `WBS-30-02`, `WBS-40-03`                                    |
| `ATP-CPN-01`  | Attempt invalid, expired, exhausted, cross-tenant, over-limit, and second-coupon checkout; then cancel/fail/expire a valid reservation and complete a later refund.                                       | Invalid usage leaves no writes; one coupon maximum is enforced; cancellation/failure/expiry releases once; refund does not reissue redemption. | Service, transaction, API    | `PRD-CPN-01` through `PRD-CPN-03`; `SRS-CPN-01` through `SRS-CPN-03`, `SRS-MNY-03`; `WBS-40-02`, `WBS-40-03`, `WBS-60-02`                |
| `ATP-PAY-01`  | Deliver the same mock payment-success notification sequentially and concurrently.                                                                                                                         | Only one accepted payment transition, stock consumption, coupon redemption, and audit mutation occurs.                                         | Integration, API             | `PRD-PAY-01` through `PRD-PAY-03`; `SRS-PAY-01` through `SRS-PAY-03`, `SRS-TXN-04`; `WBS-50-01`                                          |
| `ATP-EXP-01`  | Race 30-minute expiry against mock payment success for the same unpaid order.                                                                                                                             | State is rechecked transactionally; exactly one legal outcome applies stock/coupon effects once.                                               | Transaction, PostgreSQL gate | `PRD-INV-03`; `SRS-TXN-04`, `SRS-TXN-05`, `SRS-PAY-03`; `WBS-40-03`, `WBS-50-01`                                                         |
| `ATP-SHP-01`  | Create shipment for a paid order, then try unpaid, cancelled, expired, refunded, refund-pending, and cross-tenant orders.                                                                                 | Only a current-tenant `paid` order gets one shipment with non-empty carrier/tracking data and an atomic `shipped` transition.                  | API, integration             | `PRD-SHP-01` through `PRD-SHP-03`; `SRS-ORD-01` through `SRS-ORD-03`, `SRS-SHP-01` through `SRS-SHP-03`; `WBS-60-01`                     |
| `ATP-RFD-01`  | Replay mock refund success sequentially and concurrently after an approved eligible request.                                                                                                              | Stock restores once, order becomes `refunded` once, coupon stays redeemed, and audit history is not duplicated.                                | Integration, API             | `PRD-RFD-01` through `PRD-RFD-03`; `SRS-RFD-01` through `SRS-RFD-03`, `SRS-PAY-01` through `SRS-PAY-03`; `WBS-60-02`                     |
| `ATP-RACE-01` | Race shipment against refund request, approval, and refund execution.                                                                                                                                     | Shipment wins and blocks refund, or refund wins and blocks shipment; no mixed order state or duplicate stock effect survives.                  | Transaction, PostgreSQL gate | `PRD-SHP-03`, `PRD-RFD-01` through `PRD-RFD-03`; `SRS-ORD-01` through `SRS-ORD-03`, `SRS-RFD-02`, `SRS-SHP-02`; `WBS-60-01`, `WBS-60-02` |
| `ATP-SNAP-01` | After checkout, change SKU title/attributes/price/publication, address, and coupon template.                                                                                                              | Existing order, payment, and refund views retain immutable purchase snapshots and amounts.                                                     | Service, API                 | `PRD-ORD-03`; `SRS-MNY-02` through `SRS-MNY-04`, `SRS-CAT-02`; `WBS-30-01`, `WBS-40-03`, `WBS-70-02`                                     |
| `ATP-SSR-01`  | Fetch anonymous `/commerce` HTML, load it in a browser, and inspect hydration.                                                                                                                            | Server HTML contains no private cart, address, order, coupon, or payment data; client hydration remains functional without hydration errors.   | SSR, browser                 | PRD launch criteria; `SRS-UI-03`, `SRS-NFR-02`; `WBS-20-02`, `WBS-50-02`, `WBS-70-02`                                                    |
| `ATP-SSR-02`  | Exercise `/commerce-admin`, its menu/routes, and direct APIs with authorized and unauthorized tenant operators.                                                                                           | The customer and operator sites are independent; unauthorized users receive denial and no cross-tenant operator data is disclosed.             | SSR, API, browser            | `PRD-ORD-04`; `SRS-AUT-03`, `SRS-AUT-04`, `SRS-TEN-*`; `WBS-20-02`, `WBS-60-*`, `WBS-70-02`                                              |
| `ATP-CTR-01`  | Change backend contract truth and then change frontend metadata/routes after Commerce wrappers exist.                                                                                                     | Matching flavor artifacts are regenerated through the correct forward/reverse contract loop; no generated REST package is hand-patched.        | Build, contract              | `SRS-API-01`, `SRS-API-02`; `WBS-20-03`, `WBS-70-01`                                                                                     |

## SSR and Browser Acceptance

SSR, hydration, route admission, and Vona API authorization are separate evidence targets.

Customer-site verification must inspect actual anonymous HTML and subsequent hydrated behavior. It must prove that private customer data is absent before the authenticated client query resolves. Operator-site verification must prove that an unauthorized person cannot obtain access merely by knowing a route or menu path, and direct API calls remain independently protected.

Phase 20 commits a Playwright browser acceptance suite under `e2e/a-commerce/`. Install Chromium once with `npx playwright install chromium`; after Commerce SSR/REST artifacts are current, the clean default path is `npm run test:e2e:commerce:dev`. It runs `npm run db:reset`, starts one Vona development worker, and runs both browser smoke scenarios through `http://127.0.0.1:7102`. The reset recreates Vona's managed test database and clears the local Vona Redis namespace. Set `COMMERCE_E2E_BASE_URL` to test an externally managed target without Playwright resetting, starting, or stopping Vona.

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

### Future-gated after the relevant WBS work

```bash
# Focus a future module-local test after the suite and test file exist
npm run vona :bin:test -- commerce-trade/test/checkoutReservation.test.ts --flavor=normal

# Refresh paired Commerce SSR and REST artifacts when frontend or contract output changed
npm run build:zova:commerce
npm run build:zova:commerce-admin
npm run deps:vona

# Clean development-Vona browser acceptance: reset database and local Redis,
# start one Vona development worker, then run both smoke scenarios
npm run test:e2e:commerce:dev

# Focused checks against an externally managed Vona target;
# the caller owns its database and cache cleanliness
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce
COMMERCE_E2E_BASE_URL=http://127.0.0.1:7102 npm run test:e2e:commerce-admin
```

For release contention evidence, run the relevant Commerce transaction scenarios on PostgreSQL in addition to the fast default database suite. Existing CI provides the multi-database pattern; Commerce test cases must be added to it when the modules exist.

## Release Gates

| Gate               | Required proof                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 20           | `ATP-SSR-01`, `ATP-SSR-02`, and `ATP-CTR-01` evidence shows distinct sites/flavors, paired SSR/REST artifacts, anonymous privacy, and independent API denial.                                                   |
| Phases 30–40       | `ATP-TEN-01`, `ATP-AUT-01`, `ATP-INV-01`, `ATP-TXN-01`, `ATP-CPN-01`, and `ATP-SNAP-01` pass before payment depends on checkout state.                                                                          |
| Phases 50–60       | `ATP-PAY-01`, `ATP-EXP-01`, `ATP-SHP-01`, `ATP-RFD-01`, and `ATP-RACE-01` pass before end-to-end acceptance.                                                                                                    |
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
