# A-Commerce Product Delivery Plan and Work Breakdown Structure

## Delivery Objective

Deliver a tenant-isolated, single-merchant, physical-goods commerce MVP as a sequence of verified vertical increments. The delivery order protects the high-risk contracts first: independent SSR applications, tenant boundaries, stock reservation, immutable commercial snapshots, idempotent mock payment/refund events, and shipment/refund exclusion.

This document owns delivery sequencing and completion checks. The [PRD](./prd.md) owns desired outcomes, and the [SRS](./srs.md) owns implementation contracts.

## Delivery Principles

- Keep `a-commerce` suite-first and keep capability modules physically under the suite.
- Create backend contract truth first; regenerate frontend consumers rather than hand-patching generated output.
- Build each Commerce flavor's SSR bundle and REST output together. For reverse-chain changes, build the affected flavor before `npm run deps:vona`.
- Prefer a thin semantic Zova Model facade over a second cache owner when custom APIs still belong to an existing resource.
- Keep all business uniqueness tenant-aware in the service layer; do not use `table.unique(...)` for tenant-scoped business rules.
- Do not pull real providers, marketplace support, multi-warehouse inventory, partial refunds, or post-shipment returns into an MVP phase.

## Work Breakdown Structure

### Phase 10: Documentation baseline and implementation gate

Dependencies: none.

#### WBS-10-01: Freeze the product and technical baseline

Primary documents:

- `.docs-internal/business/a-commerce/prd.md`
- `.docs-internal/business/a-commerce/srs.md`
- `.docs-internal/business/a-commerce/test-plan.md`
- `.docs-internal/business/a-commerce/decisions/0001-mvp-boundaries.md`

Tasks:

- confirm the scope, terminology, state names, USD-cent policy, 30-minute expiry, and deferred work;
- keep PRD, SRS, test-plan, ADR, and WBS traceability identifiers aligned;
- record any later scope change in the authoritative document before code changes begin.

Acceptance checks:

- no open policy question affects storage, authorization, stock, coupon, payment, shipment, or refund behavior;
- every PRD requirement maps to an SRS contract, a future WBS task, and one or more `ATP-*` scenarios.

### Phase 20: Suite, site, flavor, and contract plumbing

Dependencies: `WBS-10-01`.

Status: `verified`; the [test plan](./test-plan.md) retains `ATP-SSR-01`, `ATP-SSR-02`, and `ATP-CTR-01` observed CI evidence, including a successful independent Commerce browser baseline.

#### WBS-20-01: Create the A-Commerce suite and first capability modules

Primary areas:

- `vona/src/suite/a-commerce/`
- `zova/src/suite/a-commerce/`

Tasks:

- use the Vona and Zova suite generators to create `a-commerce`;
- generate the confirmed capability modules under that suite, beginning with `commerce-catalog`, `commerce-trade`, `commerce-promotion`, `commerce-payment`, `commerce-member`, `commerce-siteweb`, and `commerce-siteadmin`;
- use generators rather than manual package/directory scaffolding.

Acceptance checks:

- Vona and Zova packages use the documented suite-contained layout;
- suite and module metadata/dependencies refresh successfully;
- no Commerce module is left as a loose standalone package outside `a-commerce`.

#### WBS-20-02: Add two independent Commerce SSR sites and flavors

Primary areas:

- Commerce site-owner modules under `vona/src/suite/a-commerce/modules/`
- Commerce flavor environments/configuration under `zova/`
- root `package.json` and `zova/package.json` build/dev wrappers

Tasks:

- declare unique Vona site IDs `commerce` and `commerceAdmin` with public paths `commerce` and `commerce-admin`;
- add `cabloyCommerce` and `cabloyCommerceAdmin` Zova flavors with site IDs, bases, layouts, and asset-copy targets that belong to their matching site-owner module;
- add root dev/build wrappers, including one wrapper per flavor that pairs SSR and REST output;
- bind Commerce menus and route admission to the matching site without treating route admission as API authorization.

Acceptance checks:

- `/commerce` and `/commerce-admin` resolve as distinct SSR sites without collision with existing `web` or `admin`;
- each flavor creates a separate SSR bundle and `.zova-rest` contract artifact;
- customer flavor does not expose private data in an anonymous SSR response;
- operator site access, routes, menus, and APIs reject users without required tenant roles.

#### WBS-20-03: Establish Commerce contract-loop checks

Primary files/areas:

- root build scripts
- generated REST consumer packages under `vona/.zova-rest/`
- Commerce API and frontend route/metadata paths

Tasks:

- document and automate the forward chain for Commerce backend DTO/controller changes;
- document and automate the reverse chain for Commerce Zova metadata/route changes;
- confirm artifact names, copy paths, and Vona workspace dependency discovery for both flavors.

Acceptance checks:

- a changed Commerce backend contract reaches generated Zova consumers through the normal contract loop;
- a changed Commerce frontend contract builds its matching SSR and REST artifacts before `npm run deps:vona`;
- no manually edited generated REST artifact is required.

The [SRS](./srs.md) owns the Commerce contract constraints and workflow guards. The [test plan](./test-plan.md) owns executable build, browser, and retained-evidence procedures.

### Phase 30: Tenant-scoped catalogue and stock foundation

Dependencies: `WBS-20-*`.

#### WBS-30-01: Implement catalogue and SKU lifecycle

Primary areas:

- `commerce-catalog` entities, DTOs, services, controllers, and Zova Models/pages

Tasks:

- implement categories, products, SKUs, pricing in USD cents, publication states, and customer/operator read surfaces;
- add tenant-scoped operator mutations and customer catalogue queries;
- ensure catalogue changes do not rewrite later order snapshots.

Acceptance checks:

- only active, tenant-owned SKUs appear in customer catalogue reads;
- a tenant operator cannot manage another tenant's catalogue;
- publication changes affect new sales only and never rewrite historical orders.

#### WBS-30-02: Implement one-warehouse stock and audit foundation

Primary areas:

- `commerce-trade` stock/reservation persistence and services
- catalogue/operator stock views

Tasks:

- define on-hand, reserved, and available stock semantics;
- implement tenant-scoped stock adjustments and auditable reasons;
- provide a concurrency-safe stock mutation primitive usable by checkout, expiry, and refund.

Acceptance checks:

- available stock cannot become negative;
- every stock-changing path writes a traceable audit record;
- transaction tests cover competing updates and rollback.

### Phase 40: Checkout, coupon, order, and reservation lifecycle

Dependencies: `WBS-30-*`.

#### WBS-40-01: Implement authenticated customer cart and address management

Primary areas:

- `commerce-member`
- `commerce-trade`
- customer Web pages and Models

Tasks:

- provide customer-owned address management and cart operations;
- use model-owned query state for shared cart/address/order surfaces;
- enforce tenant and customer ownership for every resource action.

Acceptance checks:

- an authenticated customer cannot access another customer's cart or address;
- no customer-facing API accepts a browser-supplied tenant/customer as authority;
- shared query invalidation stays under a single resource/model owner.

This verified historical item covers the customer contract that existed when it was delivered. The separate Admin and Web Address contract/state split is owned by `WBS-40-04` and must not be inferred from this item's evidence.

#### WBS-40-02: Implement fixed-amount coupon lifecycle

Primary areas:

- `commerce-promotion` entities, service, API, operator pages, and customer selection surface

Tasks:

- implement coupon templates/grants, validity, minimum spend, issuance/usage limits, and per-customer limits;
- implement one-coupon reservation at order creation and release on unpaid-order expiry;
- snapshot coupon identity and discount on the order;
- leave payment-event cancellation/failure release and payment-success redemption to Phase 50.

Acceptance checks:

- one order cannot reserve multiple coupons;
- invalid, exhausted, expired, cross-tenant, or ineligible coupon issuance/reservation fails without partial writes;
- unpaid-order expiry releases a reserved coupon exactly once while preserving the immutable order discount snapshot.

#### WBS-40-03: Implement atomic order creation and 30-minute reservation expiry

Primary areas:

- `commerce-trade` order, order-line, reservation, and scheduled-expiry paths
- payment-attempt creation contract

Tasks:

- implement `@Core.transaction()` checkout flow with authoritative SKU, amount, coupon, tenant, and address validation;
- create immutable commercial snapshots, stock reservations, coupon reservations, payment attempt, and audit records atomically;
- implement unpaid-order expiry processing that rechecks `awaiting_payment` state before releasing reservations and cancelling its initial payment-attempt record;
- leave payment-event outcomes, reservation consumption/redemption, and payment-success-versus-expiry contention to Phase 50.

Acceptance checks:

- concurrent checkout cannot oversell;
- an error leaves no partial order, stock reservation, coupon reservation, payment attempt, or cached mutation;
- every still-unpaid order expires at or after 30 minutes and releases stock/coupon once without crossing tenant scope.

#### WBS-40-04: Split Address into read-only Admin Resource and Web self-service contracts

Dependencies: `WBS-20-03`, `WBS-40-01`.

Primary areas:

- `commerce-member` controller, service, DTOs, and ownership tests
- Commerce Admin menu and selector-scoped generic Resource integration
- customer Address model, page, route admission, and browser coverage
- generated Commerce contract consumers and flavor artifacts

Tasks:

- preserve one live Address persistence/lifecycle domain while separating Admin Resource and Web self-service operations and DTO projections;
- expose only Admin `select` and `view`, independently guarded by `@Passport.systemAdmin()`, and add the approved read-only `presetResource` Admin entry without enabling mutation actions;
- replace the current generic Resource-shaped customer contract with explicit owner-derived Web operations and move customer query/mutation state to a dedicated Web model;
- preserve active-instance isolation, owner-scoped Web absence semantics, anonymous SSR neutrality, and hydration-safe customer query admission;
- change Vona contract truth first, regenerate both audience contract consumers, then build the Web and Admin Commerce flavor pairs before `npm run deps:vona`.

Acceptance checks:

- Admin `select` and `view` require `systemAdmin`, return only active-instance rows, and never silently inherit customer-owner scope;
- Admin `create`, `update`, and `delete` actions, metadata, and UI controls are absent;
- Web create/list/view/update/delete derive customer ownership only on the server and treat foreign or cross-instance rows as absent;
- Admin `ModelResource` and dedicated Web Address state retain separate cache ownership, DTO projections, and page architecture;
- focused API, generated-contract, SSR, and browser evidence satisfies `ATP-ADDR-01` and its linked shared scenarios.

### Phase 50: Mock payment and customer order experience

Dependencies: `WBS-40-*`.

#### WBS-50-01: Implement Commerce-owned mock payment attempts

Primary areas:

- `commerce-payment`
- `commerce-trade` payment transition integration

Tasks:

- implement payment attempt creation and mock success, failure, and cancellation outcomes;
- persist an idempotency key and transition/audit correlation for every event;
- consume stock/coupon reservations only when mock payment success is accepted by the server.

Acceptance checks:

- duplicate mock success does not change the order, stock, coupon, or audit records twice;
- failed/cancelled payment releases pending reservations exactly once;
- the mock adapter is behind a Commerce-owned interface that can later support real providers without rewriting order ownership.

#### WBS-50-02: Deliver customer checkout and personal-centre order surfaces

Primary areas:

- `commerce-siteweb`
- `commerce-member`
- customer pages, models, and route guards

Tasks:

- deliver checkout confirmation, mock payment result, order history, order detail, coupon selection, and address selection;
- expose customer-visible order status and shipment information without exposing other customers' data;
- keep personalized screens hydration-tolerant on the customer SSR site.

Acceptance checks:

- a customer can complete the paid-order flow and see the resulting order;
- unauthorized or cross-customer order access is rejected server-side;
- direct browser verification confirms SSR then hydration for public and authenticated Commerce paths.

### Phase 60: Operator shipment and pre-shipment whole-order refunds

Dependencies: `WBS-50-*`.

#### WBS-60-01: Deliver operator order workbench and manual shipment

Primary areas:

- `commerce-siteadmin`
- `commerce-trade`
- operator pages and Models

Tasks:

- implement tenant-scoped order list/detail and operational filtering;
- permit carrier/tracking entry only for current `paid` orders;
- atomically create the whole-order shipment and move the order to `shipped`.

Acceptance checks:

- shipment cannot be created for unpaid, cancelled, expired, refunded, or refund-pending orders;
- customer order detail exposes shipment data only to its owner;
- no split-shipment UI or API path exists.

#### WBS-60-02: Deliver request, approval, and mock execution of refunds

Primary areas:

- `commerce-payment`
- `commerce-trade`
- customer and operator refund surfaces

Tasks:

- implement customer request, operator approval/rejection, mock refund execution, and audit reason capture;
- validate state again at approval/execution time to prevent shipment/refund races;
- restore sold stock exactly once on successful refund and retain coupon redemption without reissuing or restoring the redeemed coupon.

Acceptance checks:

- only paid, unshipped whole orders can enter the refund flow;
- shipment and refund race tests permit only one legal terminal outcome;
- repeated refund success does not duplicate stock restoration or transition history;
- refund does not restore a redeemed coupon.

### Phase 70: Migrations, integration hardening, and release acceptance

Dependencies: `WBS-20-*` through `WBS-60-*`.

#### WBS-70-01: Complete migrations and contract synchronization

Tasks:

- apply the repository's file-version decision rule before each persisted-field change;
- create appropriate migration versions and schema paths;
- regenerate frontend contracts after backend changes and refresh Vona dependencies after reverse-chain changes.

Acceptance checks:

- every `meta.version.ts` change is followed by `npm run test`;
- generated consumers match the current backend contract;
- no stale `.zova-rest` package masks a contract mismatch.

#### WBS-70-02: Run focused and end-to-end verification

Tasks:

- execute the focused, transaction, API, SSR, browser, and release evidence defined in `test-plan.md`;
- exercise concurrent checkout, duplicate payment/refund, unpaid expiry, coupon recovery, shipment/refund conflict, and snapshot stability;
- build both Commerce SSR/REST flavor pairs and inspect their generated site artifacts;
- run `npm run test:e2e:commerce:clean` after the relevant Commerce artifacts and Vona dependencies are current; treat `COMMERCE_E2E_BASE_URL` runs as deployment-specific supplemental validation owned by the target operator.

Acceptance checks:

- every PRD and SRS traceability entry has observed evidence;
- affected flavor builds, contract synchronization, type checks, linting, formatting, and test suite checks pass;
- the complete customer and operator flow passes through the repository-managed Commerce SSR sites (`/commerce` and `/commerce-admin`) using `npm run test:e2e:commerce:clean` after current artifact preparation; externally managed-target E2E is not a WBS-70-02 prerequisite or blocker.

#### WBS-70-03: Establish the Coupon Template semantic form-layout reference

Dependencies: `WBS-40-02`, `WBS-70-01`.

Primary areas:

- A-Commerce PRD/SRS semantic information-architecture requirements
- `commerce-promotion` Coupon Template Admin DTO render metadata and locales
- Coupon Template emitted-metadata contract test and Commerce Admin consumer regeneration

Tasks:

- align the Coupon Template operator scenes with `PRD-CPN-04` and `SRS-UI-04`;
- express the approved Create, Update, View, and compact list/filter information areas in Vona DTO render metadata;
- preserve the existing API, persistence, validation, authorization, and customer coupon-selection boundaries;
- add focused emitted-metadata coverage and regenerate the affected Commerce Admin contract consumer through the normal forward chain.

Acceptance checks:

- Create, Update, View, and list/filter metadata preserve their approved scene-specific information areas and field placement;
- the list filter retains one embedded filter-actions block;
- no DTO layout change alters Coupon Template API fields, persistence, authorization, or customer-page ownership;
- `ATP-FIA-01` records focused test and Commerce Admin contract-loop evidence.

#### WBS-70-04: Codify the reusable semantic-presentation contract

Dependencies: `WBS-10-01`, `WBS-70-03`.

Primary areas:

- A-Commerce semantic-presentation authority and traceability contracts;
- resource/scene presentation matrix and Coupon Template renderer conformance reference;
- emitted-metadata and Commerce Admin browser proof.

Tasks:

- record ADR 0003 and establish `PRD-UI-01` / `SRS-UI-05` without changing the completed Coupon Template requirement chain;
- maintain a resource/scene matrix that separates business information areas, operation DTO boundaries, render metadata, and renderer behavior;
- add semantic render metadata to the Coupon Template reference using existing shared resources where they preserve the documented meaning;
- add focused metadata and browser evidence that shared select, cents, and date controls render in the documented scenes and that presentation changes preserve API, validation, authorization, persistence, state-owner, page-owner, customer-flow, and SSR boundaries;
- regenerate paired Commerce artifacts and generated dependencies through the normal contract loop without hand-editing generated output.

Acceptance checks:

- each presentation decision names its audience, task, scene, and authoritative information area before renderer selection;
- scene-specific field differences originate in operation DTO contracts rather than visual hiding;
- Coupon Template metadata emits the approved select, cents, and date renderer semantics while retaining its existing Create, Update, View, and list/filter boundaries;
- focused emitted-schema and browser evidence pass, with `ATP-FIA-01` retained as the Coupon Template layout reference and `ATP-SPC-01` proving the reusable boundary;
- no presentation-only change alters API authority, persistence, validation, authorization, Model ownership, page ownership, customer flow, or SSR privacy.

## Deferred Work Guardrail

The following are intentionally excluded from this WBS: marketplace/multi-merchant behavior, multiple warehouses, external payment providers, real provider callbacks/reconciliation, external sales channels, percentage or stacked promotions, partial shipment, partial refund, post-shipment returns/RMA, tax and shipping-rate engines, and multi-currency selling. A later plan must introduce each as an explicit domain contract rather than silently extending an MVP workflow.

## Verification Commands for Future Implementation

Run the narrowest relevant verification first, then broaden it:

```bash
# discover/confirm command families
npm run vona :
npm run zova :

# refresh both Commerce SSR and REST artifact pairs
npm run build:zova:commerce
npm run deps:vona
npm run deps:zova

# shared checks
npm run tsc
npm run lint
npm run format
npm run test
```

A future task that changes `meta.version.ts` must run `npm run test`, because it reinitializes the test database and surfaces schema/data consistency problems.

## Traceability Matrix

| WBS task group | PRD requirements                                   | SRS contracts                                                                | Completion evidence                                                                                                                                                                   |
| -------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WBS-20-*`     | Site isolation launch criterion                    | `SRS-API-*`, `SRS-UI-03`                                                     | `ATP-SSR-01`, `ATP-SSR-02`, `ATP-CTR-01`                                                                                                                                              |
| `WBS-30-*`     | `PRD-CAT-*`, `PRD-INV-*`                           | `SRS-CAT-*`, `SRS-INV-*`, `SRS-TEN-*`                                        | `ATP-TEN-01`, `ATP-INV-01`, `ATP-SNAP-01`                                                                                                                                             |
| `WBS-40-*`     | `PRD-ADR-*`, `PRD-ORD-*`, `PRD-CPN-*`, `PRD-INV-*` | `SRS-ADR-*`, `SRS-ORD-*`, `SRS-CPN-*`, `SRS-TEN-*`, `SRS-TXN-*`, `SRS-MNY-*` | Phase-40-owned branches of `ATP-ADDR-01`, `ATP-TEN-01`, `ATP-AUT-01`, `ATP-INV-01`, `ATP-TXN-01`, `ATP-CPN-01`, `ATP-EXP-01`, `ATP-SNAP-01`, `ATP-SSR-01`, `ATP-SSR-02`, `ATP-CTR-01` |
| `WBS-50-*`     | `PRD-PAY-*`, `PRD-ORD-*`                           | `SRS-PAY-*`, `SRS-AUT-*`                                                     | `ATP-PAY-01`, `ATP-EXP-01`                                                                                                                                                            |
| `WBS-60-*`     | `PRD-SHP-*`, `PRD-RFD-*`                           | `SRS-SHP-*`, `SRS-RFD-*`, `SRS-PAY-*`                                        | `ATP-SHP-01`, `ATP-RFD-01`, `ATP-RACE-01`                                                                                                                                             |
| `WBS-70-03`    | `PRD-CPN-04`                                       | `SRS-UI-04`                                                                  | `ATP-FIA-01`                                                                                                                                                                          |
| `WBS-70-04`    | `PRD-UI-01`                                        | `SRS-UI-05`                                                                  | `ATP-SPC-01`, with `ATP-FIA-01` as the Coupon Template reference                                                                                                                      |
| `WBS-70-*`     | All PRD requirements                               | All applicable SRS contracts                                                 | All applicable `ATP-*` evidence and release gates                                                                                                                                     |

## Related Records

- [A-Commerce internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [ADR 0001: Establish A-Commerce MVP Boundaries](./decisions/0001-mvp-boundaries.md)
- [ADR 0003: Establish Semantic Presentation Contracts](./decisions/0003-semantic-presentation-contracts.md)
- [Presentation contracts](./presentation-contracts.md)
- [Form Layout Guide](../../../cabloy-docs/frontend/form-layout-guide.md)
- [Suite and module guidance](../../../cabloy-docs/fullstack/suites-and-modules.md)
- [Contract-loop playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
