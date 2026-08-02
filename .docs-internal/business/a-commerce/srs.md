# A-Commerce Software Requirements Specification

## Purpose and Authority

This specification translates the [A-Commerce PRD](./prd.md) into implementable and testable system contracts. It is the technical source of truth for data ownership, server-side authorization, state transitions, transaction boundaries, and integration behavior. The [PDP/WBS](./pdp-wbs.md) sequences its delivery.

## System Context

A-Commerce is a Vona/Zova suite-first domain:

```text
vona/src/suite/a-commerce/modules/<module>/
zova/src/suite/a-commerce/modules/<module>/
```

It runs two independent Zova SSR applications and Vona SSR sites:

| Concern              | Customer application                                                                           | Operator application                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| SSR site ID          | `commerce`                                                                                     | `commerceAdmin`                                                         |
| Public path          | `commerce` (`/commerce`)                                                                       | `commerce-admin` (`/commerce-admin`)                                    |
| Zova flavor          | `cabloyCommerce`                                                                               | `cabloyCommerceAdmin`                                                   |
| Paired root build    | `npm run build:zova:commerce:web`                                                              | `npm run build:zova:commerce:admin`                                     |
| Primary audience     | Authenticated customers, with public catalogue browsing                                        | Authorized tenant operators                                             |
| SSR privacy baseline | Anonymous shell for private data unless a later decision requires cookie-aware personalization | Cookie-aware SSR may be enabled only when the site contract requires it |

`web` and `admin` are already registered SSR site IDs in Cabloy Basic. Commerce must declare new IDs and public paths rather than reuse either identity.

Every Commerce flavor must have a root build wrapper that builds its SSR bundle and generated REST package together. The generated REST package is part of the Vona/Zova contract boundary; a REST-only build is not the standard replacement for its corresponding SSR build.

## Capability Ownership

| Module               | Owns                                                                                                                 | Does not own                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `commerce-catalog`   | Categories, products, SKUs, publication, catalogue read models                                                       | Historical order price or SKU snapshots                                             |
| `commerce-trade`     | Carts, checkout, orders, order lines, address snapshots, reservation lifecycle, order state                          | Coupon policy definitions or payment-provider implementation                        |
| `commerce-promotion` | Coupon templates, customer coupon grants, eligibility, reservation, redemption                                       | Order amount authority after snapshot persistence                                   |
| `commerce-payment`   | Commerce payment attempts, mock payment outcomes, idempotency records, mock refunds                                  | Order aggregate ownership or external provider selection policy                     |
| `commerce-member`    | One live Address domain with Admin and customer projections, member commerce extensions, personal-centre aggregation | Immutable order Address snapshots or framework authentication and Passport identity |
| `commerce-siteweb`   | Customer SSR site registration and site-level composition                                                            | Commerce domain data                                                                |
| `commerce-siteadmin` | Operator SSR site registration and site-level composition                                                            | Commerce domain data                                                                |

Inventory reservation is initially a `commerce-trade` aggregate behavior. The persisted reservation and stock mutation contracts must remain explicit enough that a dedicated inventory module can later own stock operations without changing checkout behavior.

## Tenant, Identity, and Authorization Contracts

### Tenant isolation

- **SRS-TEN-01**: The active tenant is resolved on the server from Cabloy's authoritative request/session context. The browser must not select or assert the tenant for authorization.
- **SRS-TEN-02**: Catalogue, SKU, stock, reservation, cart, address, order, order line, coupon, coupon reservation/redemption, payment, shipment, refund, and audit queries and mutations are scoped to that active tenant.
- **SRS-TEN-03**: Tenant scope is enforced for relation traversal, asynchronous processing, scheduled expiration, event handling, and mutation recovery—not only list endpoints.
- **SRS-TEN-04**: A resource identifier alone never grants cross-tenant access. Services must verify both tenant membership and resource ownership before reading or mutating it.

### Customer and operator authorization

- **SRS-AUT-01**: Checkout, carts, addresses, orders, payment attempts, and refund requests require authentication. Guest checkout is not available.
- **SRS-AUT-02**: Customer operations verify that the target resource belongs to the current authenticated customer in the active tenant.
- **SRS-AUT-03**: Operator operations require explicit server-side authorization for catalogue, stock, Address, order, shipment, coupon, payment, and refund actions as applicable. The current read-only Admin Address actions use `@Passport.systemAdmin()`; Commerce site admission and menu visibility do not grant that API authority.
- **SRS-AUT-04**: Zova `SITE_ID` and route admission determine site access only. Vona API and service authorization independently enforce tenant and resource permissions.
- **SRS-AUT-05**: A refund request and an approval are separate actions. The MVP allows the same authorized operator to perform both, but no customer can approve or execute a refund.

## Data and Money Contracts

### Shared record requirements

- **SRS-DAT-01**: Commerce records persist tenant ownership or derive it through a mandatory tenant-owned parent relationship that is enforced in services.
- **SRS-DAT-02**: Mutations that affect order, stock, coupon, payment, shipment, or refund state append an audit record containing the actor, action, prior and next state where applicable, correlation ID, reason when supplied, and timestamp.
- **SRS-DAT-03**: Business uniqueness is enforced through tenant-aware service logic and transactional checks. Do not use `table.unique(...)` for tenant-scoped business uniqueness.
- **SRS-DAT-04**: Ordinary indexes support tenant-scoped lookup, active-state lookup, and idempotency lookup.

### Live Address Admin/Web contracts

- **SRS-ADR-01**: `commerce-member` owns one live Address entity, model, active-instance persistence boundary, and lifecycle. It does not duplicate Address persistence for Admin and Web consumers. `commerce-trade` owns immutable Address snapshots persisted with orders.
- **SRS-ADR-02**: The Admin Resource surface is read-only: conventional `select` and `view` actions are independently protected by `@Passport.systemAdmin()`, operate within the active instance, and never inherit the current-customer owner predicate. Admin `create`, `update`, and `delete` actions are absent from the MVP contract, metadata, and UI.
- **SRS-ADR-03**: The customer self-service surface uses explicit `mine`, `viewMine`, `createMine`, `updateMine`, and `deleteMine` actions with customer-specific request and response DTOs. It does not use one unqualified action with role-dependent response shapes.
- **SRS-ADR-04**: Every Web service path derives the authoritative customer owner only from the current Passport. Web request and response DTOs exclude authoritative `userId`, tenant/instance identity, and Admin-only metadata. Owner and customer-visible predicates are applied in the database query before count, ordering, offset, or limit; every Web detail/update/delete lookup includes that owner, so foreign-customer and cross-instance rows are absent.
- **SRS-ADR-05**: Admin DTOs may carry the operational Resource metadata required by the generic page. Web DTOs contain only customer-needed Address fields and never alias the Admin projection. Both operation families are emitted as separate generated contracts from Vona contract truth.
- **SRS-ADR-06**: Admin Address state remains selector-scoped under `rest-resource.model.resource`, with only an optional thin semantic facade. Customer Address state belongs to a dedicated model such as `ModelAddressMine`, with distinct `$useStateData(...)` keys, mutations, and invalidation for the Web contract; this is a separate audience state domain, not a competing Admin cache owner.
- **SRS-ADR-07**: An Admin `presetResource` menu may disclose the approved read-only Resource surface, and the customer route remains protected, but neither menu nor route admission authorizes Address APIs. Anonymous Web SSR and hydration-time initial rendering remain an equivalent neutral shell until the browser authentication/admission boundary creates private Address queries.

### Monetary values and snapshots

- **SRS-MNY-01**: Every persisted money amount is a signed or unsigned integer count of USD cents. Floating-point values are not persisted or used to determine totals.
- **SRS-MNY-02**: An order snapshots line title, SKU attributes, unit price, quantity, eligible subtotal, coupon identity and discount, address, payable total, and payment currency at creation.
- **SRS-MNY-03**: Coupon discount is `min(fixedDiscountCents, eligibleSubtotalCents)` and the payable amount must not be negative.
- **SRS-MNY-04**: Later product, SKU, address, coupon-template, or price changes do not alter an existing order snapshot, payment amount, or refund amount.

## State Machines

State names in this section are canonical. A later implementation may use integer persistence codes, but it must expose the same meaning and forbid the same transitions.

### Catalogue and SKU

| State      | Meaning                                                     | Allowed next states    |
| ---------- | ----------------------------------------------------------- | ---------------------- |
| `draft`    | Not sellable or customer-visible                            | `active`, `archived`   |
| `active`   | Customer-visible and potentially sellable                   | `inactive`, `archived` |
| `inactive` | Not newly sellable; existing orders remain historical facts | `active`, `archived`   |
| `archived` | Permanently unavailable for new sales                       | none                   |

- **SRS-CAT-01**: Checkout accepts only an `active` SKU with sufficient available stock.
- **SRS-CAT-02**: Catalogue display is advisory; checkout reruns publication, tenant, price, and availability validation.

### Stock reservation

| State      | Meaning                                             | Allowed next states    |
| ---------- | --------------------------------------------------- | ---------------------- |
| `reserved` | Stock is held for an unpaid order                   | `consumed`, `released` |
| `consumed` | Payment completed and the held stock became sold    | `restored`             |
| `released` | The unpaid order was cancelled, failed, or expired  | none                   |
| `restored` | A successful whole-order refund restored sold stock | none                   |

- **SRS-INV-01**: Available stock is calculated from the tenant's one-warehouse on-hand stock minus active reservations; the persistent representation may store equivalent counters if they preserve this invariant.
- **SRS-INV-02**: The system must prevent a reservation from reducing available stock below zero.
- **SRS-INV-03**: Each order line has a traceable reservation record. Release, consumption, and restoration are idempotent.

### Order

| State              | Meaning                                                         | Allowed next states                          |
| ------------------ | --------------------------------------------------------------- | -------------------------------------------- |
| `awaiting_payment` | Order and reservations created; payment not accepted            | `paid`, `cancelled`, `expired`               |
| `paid`             | Payment accepted; shipment not yet recorded                     | `shipped`, `refund_requested`                |
| `refund_requested` | Customer has requested an eligible refund                       | `paid`, `refund_approved`, `refund_rejected` |
| `refund_approved`  | Operator approved; provider refund is being executed            | `paid`, `refunded`                           |
| `refund_rejected`  | Operator rejected the request; order remains paid and unshipped | `paid`                                       |
| `shipped`          | Whole-order carrier/tracking information recorded               | none                                         |
| `refunded`         | Whole-order provider refund succeeded and stock was restored    | none                                         |
| `cancelled`        | Customer/operator cancellation before payment completion        | none                                         |
| `expired`          | 30-minute unpaid timeout released reservations                  | none                                         |

- **SRS-ORD-01**: `paid`, `refund_requested`, `refund_approved`, or `refund_rejected` must not transition to `shipped` unless the current state is `paid` at the transaction boundary.
- **SRS-ORD-02**: `shipped`, `refunded`, `cancelled`, and `expired` are final in the MVP.
- **SRS-ORD-03**: The refund route accepts only `paid` orders. It is unavailable after shipment and for every final or payment-incomplete state.

### Coupon use

| State       | Meaning                                          | Allowed next states     |
| ----------- | ------------------------------------------------ | ----------------------- |
| `available` | Held by an eligible customer and usable if valid | `reserved`, `expired`   |
| `reserved`  | Bound to an unpaid order                         | `redeemed`, `available` |
| `redeemed`  | Payment succeeded and coupon use is final        | none                    |
| `expired`   | No longer usable                                 | none                    |

- **SRS-CPN-01**: One order holds at most one coupon reservation.
- **SRS-CPN-02**: Coupon validation checks active status, customer ownership, validity, total usage limit, per-customer limit, and minimum spend while creating the order.
- **SRS-CPN-03**: Cancellation, failed payment, and expiry change `reserved` to `available` exactly once; a successful refund leaves `redeemed` unchanged.

### Payment and refund attempts

| Record          | State       | Meaning                                                      |
| --------------- | ----------- | ------------------------------------------------------------ |
| Payment attempt | `created`   | Order created a provider-neutral payment session             |
| Payment attempt | `succeeded` | A verified provider success completed exactly once           |
| Payment attempt | `failed`    | Verified provider payment failed                             |
| Payment attempt | `cancelled` | Verified provider cancellation or order expiry/cancel        |
| Refund attempt  | `created`   | Approved refund is ready for provider execution              |
| Refund attempt  | `succeeded` | Verified provider refund completed exactly once              |
| Refund attempt  | `failed`    | Verified provider refund failed and the order is recoverable |

- **SRS-RFD-01**: A refund request records the requesting customer, order, reason, requested time, decision actor, decision reason, and execution attempt. It is created only from the order's current `paid` state.
- **SRS-RFD-02**: Approval must recheck tenant ownership and that no shipment exists. A refund attempt may run only from `refund_approved`; a rejection returns the order to `paid` without changing stock or coupon redemption.
- **SRS-RFD-03**: A successful whole-order refund restores each consumed reservation exactly once, transitions the order to `refunded`, and leaves the coupon in `redeemed` state. A failed provider attempt is retained in the refund audit trail and returns the order to `paid`, where the customer may create a new refund request.

- **SRS-PAY-01**: A payment or refund event has a durable idempotency key scoped to its attempt and tenant.
- **SRS-PAY-02**: Replaying a successful event returns the existing final result and must not reapply any stock, coupon, order, or audit mutation.
- **SRS-PAY-03**: Payment success consumes reservations and changes the order from `awaiting_payment` to `paid` atomically. Full refund success restores stock and changes the order from `refund_approved` to `refunded` atomically.
- **SRS-PAY-04**: Browser redirects and callbacks are advisory only. The Provider result must be verified through a signed webhook, Provider query, or reconciliation before it changes Commerce state.
- **SRS-PAY-05**: Provider side effects are driven by durable operations and an outbox. No external payment call runs inside a retryable Commerce database transaction.

### Shipment

- **SRS-SHP-01**: A shipment is a whole-order record with a non-empty carrier and tracking number, the operator, and the timestamp.
- **SRS-SHP-02**: Creating the shipment is permitted only for the same tenant's current `paid` order and moves that order to `shipped` in the same transaction.
- **SRS-SHP-03**: The MVP has no split shipment, tracking-provider integration, delivery confirmation, or post-shipment correction workflow.

## Transactional and Concurrency Requirements

- **SRS-TXN-01**: Order creation is one `@Core.transaction()`-protected operation. It resolves tenant and customer, loads authoritative SKU and coupon data, validates every condition, creates order snapshots, reserves stock, reserves a coupon if present, creates the payment attempt, and writes audit records.
- **SRS-TXN-02**: The stock update uses a concurrency-safe row lock or conditional update. It succeeds only when sufficient current availability exists. A losing concurrent checkout rolls back completely and reports insufficient stock.
- **SRS-TXN-03**: Any failure during order creation leaves no partial order, reservation, coupon reservation, payment attempt, or cache mutation.
- **SRS-TXN-04**: Payment success, cancellation/failure, unpaid expiry, shipment, and refund success each have explicit transactional transitions and are safe to retry.
- **SRS-TXN-05**: Scheduled expiry locates only still-`awaiting_payment` orders whose reservation deadline has passed; it rechecks current state in the transaction before releasing stock or coupons.
- **SRS-TXN-06**: Cache writes related to transactional mutations use the framework's transaction-aware path, and tests assert database rollback and cache consistency when relevant.

## API and Frontend State Contracts

- **SRS-API-01**: Vona is the contract truth. For a Commerce DTO, controller, validation, or OpenAPI change, update and verify Vona first; start local Vona when Swagger generation requires it; configure the owning Zova module with `npm run zova :openapi:config <module>` when it exposes operations; require non-empty `operations.match` or `operations.ignore`; then run `npm run zova :openapi:generate <module>`. Regenerate Zova consumers rather than manually patching generated output, and consume the result through a thin Zova Model facade.
- **SRS-API-02**: A reverse change to frontend metadata/routes requires the matching Commerce flavor SSR + REST build before `npm run deps:vona`: `npm run build:zova:commerce:web` for Customer, `npm run build:zova:commerce:admin` for Operator, or `npm run build:zova:commerce` when both surfaces or generated contract output changed. A REST-only build is insufficient because the SSR bundle and generated contract must move together. Generated `vona/.zova-rest/` directories are build artifacts and must not be edited manually.
- **SRS-API-03**: APIs expose semantic resource and action boundaries. A customer action never accepts an arbitrary customer, tenant, total, discount, or state transition from the browser.
- **SRS-UI-01**: Reusable async product, cart, order, coupon, and operator query state belongs to a Zova Model. Controllers orchestrate scenes rather than becoming shared fetch/cache owners.
- **SRS-UI-02**: A custom endpoint in the same Admin Resource boundary reuses the existing `rest-resource.model.resource` state and invalidation tree rather than creating a competing module-local cache owner. A genuinely separate customer self-service contract may own its dedicated Web state boundary as specified by `SRS-ADR-06`.
- **SRS-UI-03**: Customer SSR renders no private cart, address, order, coupon, or payment information in an anonymous response. Final client theme and authenticated state remain hydration-tolerant.
- **SRS-UI-04**: Coupon Template Admin DTO render metadata expresses the semantic information areas in the Coupon Template Admin scene matrix without changing validation, authorization, server-authoritative values, or the separate customer coupon-selection flow. Layouts may differ by scene when their DTO fields differ.

### Coupon Template Admin scene matrix

| Scene       | Audience and task                                    | Information areas                                                                           | Editable / readonly boundary                                                                                                      |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Create      | Operator defines a reusable coupon policy            | basic identity and activation; monetary eligibility; validity window; issuance/usage limits | All policy fields are inputs; `description` is optional                                                                           |
| Update      | Operator makes the currently permitted template edit | basic identity and activation                                                               | Only `name`, `state`, and `description` are editable; monetary, validity, and limit policy fields are outside the update contract |
| View        | Operator inspects the complete template and its use  | basic identity and activation; monetary eligibility; validity window; issuance/usage limits | All fields are readonly; issued and redeemed counters appear with limits                                                          |
| List/filter | Operator finds templates                             | compact name and created-date controls                                                      | The filter ends with one filter-actions block; it is independent from entry-form structure                                        |

## Non-Functional Requirements

- **SRS-NFR-01**: Order, payment, inventory, coupon, shipment, and refund state changes are attributable and diagnosable through audit records and correlation IDs.
- **SRS-NFR-02**: Customer addresses and tracking data are tenant-scoped personal data. Live Address data is returned only through the owner-scoped Web projection or the independently authorized, read-only Admin projection; it is never exposed through a browser-supplied owner/tenant claim or an Admin mutation action.
- **SRS-NFR-03**: Tests cover tenant isolation, stock contention, duplicate payment/refund event delivery, expiry, coupon limits, shipment/refund conflict, and historical snapshot stability.
- **SRS-NFR-04**: Any schema change in a future implementation follows the repository migration rules. Before adding a persisted field to an existing resource, the implementer asks whether `vonaModule.fileVersion` should increase; every `meta.version.ts` change requires `npm run test`.

## Acceptance Mapping

| SRS area                 | PRD source                | Required evidence                                                                                                 | Test-plan scenarios                                                                 |
| ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `SRS-TEN-*`, `SRS-AUT-*` | `PRD-ORD-04`, `PRD-ADR-*` | Cross-tenant and cross-customer negative API tests                                                                | `ATP-TEN-01`, `ATP-AUT-01`, `ATP-SSR-02`                                            |
| `SRS-ADR-*`              | `PRD-ADR-*`               | Separate generated Admin/Web contracts, action authorization, owner scope, state ownership, and SSR/browser proof | `ATP-ADDR-01`, `ATP-TEN-01`, `ATP-AUT-01`, `ATP-SSR-01`, `ATP-SSR-02`, `ATP-CTR-01` |
| `SRS-CAT-*`, `SRS-INV-*` | `PRD-CAT-*`, `PRD-INV-*`  | SKU publication and concurrent checkout tests                                                                     | `ATP-INV-01`, `ATP-SNAP-01`                                                         |
| `SRS-ORD-*`, `SRS-TXN-*` | `PRD-ORD-*`, `PRD-INV-*`  | Transaction rollback, expiry, and snapshot tests                                                                  | `ATP-TXN-01`, `ATP-EXP-01`, `ATP-SNAP-01`                                           |
| `SRS-CPN-*`, `SRS-MNY-*` | `PRD-CPN-*`               | Coupon eligibility, integer-cent, and release tests                                                               | `ATP-CPN-01`                                                                        |
| `SRS-UI-04`              | `PRD-CPN-04`              | Coupon Template Admin render metadata preserves the approved scene information areas and compact filter contract  | `ATP-FIA-01`                                                                        |
| `SRS-PAY-*`              | `PRD-PAY-*`               | Idempotent mock event tests                                                                                       | `ATP-PAY-01`, `ATP-RFD-01`                                                          |
| `SRS-SHP-*`, `SRS-RFD-*` | `PRD-SHP-*`, `PRD-RFD-*`  | Shipment/refund lifecycle tests                                                                                   | `ATP-SHP-01`, `ATP-RACE-01`                                                         |
| `SRS-API-*`, `SRS-UI-*`  | All PRD areas             | Flavor build, REST contract, and end-to-end browser checks                                                        | `ATP-CTR-01`, `ATP-SSR-01`, `ATP-SSR-02`                                            |

## Related Records

- [A-Commerce internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [ADR 0001: Establish A-Commerce MVP Boundaries](./decisions/0001-mvp-boundaries.md)
- [A-Pay payment architecture](../../architecture/a-pay-payment-architecture.md)
- [Transaction guide](../../../cabloy-docs/backend/transaction-guide.md)
- [Contract-loop playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md)
- [SSR Vona/Zova boundary and call chain](../../architecture/ssr-vona-zova-boundary-and-call-chain.md)
- [Resource custom-API state ownership](../../architecture/resource-custom-api-state-ownership.md)
