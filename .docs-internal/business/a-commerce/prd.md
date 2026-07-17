# A-Commerce Product Requirements Document

## Purpose

A-Commerce is a tenant-isolated commerce MVP for one merchant selling physical goods from one warehouse. It provides an authenticated customer storefront and a separate tenant-operator application. The MVP must complete a trustworthy path from catalogue browsing to checkout, stock reservation, mock payment, manual shipment, and a controlled pre-shipment refund.

This PRD defines product outcomes and business acceptance. The technical source of truth is the [Software Requirements Specification](./srs.md).

## Product Goals

- Let authenticated customers browse available goods, apply one eligible coupon, place an order, pay through a mock payment flow, and track their own orders.
- Protect sellable stock by reserving it at order creation rather than after payment.
- Let tenant operators manage catalogue availability, stock, coupons, orders, manual shipment, and pre-shipment whole-order refunds.
- Keep every customer, operator, record, and operation within Cabloy's existing tenant boundary.
- Establish a clean domain boundary that can later support real payment providers and additional sales channels without implementing them now.

## Personas

### Customer

An authenticated user who browses a tenant's catalogue, manages delivery addresses, purchases goods, applies a coupon, views an order, and requests an eligible refund.

### Catalogue Operator

A tenant operator who maintains categories, products, SKU availability, prices, and stock.

### Order Operator

A tenant operator who reviews orders and manually records shipment carrier and tracking data.

### Refund Approver

A tenant operator authorized to approve or reject a customer refund request before shipment. The MVP does not require a separate approver from the order operator, but the authorization must be explicit.

### Tenant Administrator

A tenant operator who assigns commerce roles. Framework-wide administrative authority is not automatically a commerce permission.

## Scope

### In Scope

- Customer catalogue browsing, SKU selection, and availability display.
- Customer address management, cart, authenticated checkout, and order history/detail.
- Catalogue, SKU, price, publication, and one-warehouse stock management for tenant operators.
- A single fixed-amount coupon per order with eligibility, minimum spend, validity, issuance limits, and per-customer limits.
- Atomic order creation with inventory and coupon reservation.
- A mock payment flow with success, failure, cancellation, and duplicate-notification handling.
- Automatic release of unpaid order stock and coupon reservations after 30 minutes, explicit cancellation, or failed payment.
- Tenant-operator manual shipment for the whole order with a carrier and tracking number.
- Customer-requested, operator-approved, pre-shipment whole-order refunds through the mock payment flow.
- Inventory restoration after a successful refund; the redeemed coupon is not restored.
- Separate customer and operator SSR applications at `/commerce` and `/commerce-admin`.

### Deferred

- Multi-merchant marketplaces, store onboarding, seller settlement, and merchant-to-merchant data boundaries.
- Multiple warehouses, transfer, replenishment, stocktake, backorders, split allocation, and split shipment.
- Guest checkout, guest order lookup, order claiming, and unauthenticated payment continuation.
- Real payment service providers, webhooks from external providers, reconciliation, disputes, chargebacks, and payment routing.
- External marketplace/channel catalogue mapping, order ingestion, and channel-specific inventory.
- Percentage coupons, coupon stacking, product-level promotion engines, loyalty points, gift cards, subscriptions, and campaigns.
- Partial refunds, post-shipment returns, return logistics, inspection, and RMA workflows.
- Tax engines, shipping-rate engines, internationalization of selling currency, and multi-currency pricing.

## Primary User Journeys

### Customer purchase

1. The customer browses an active product and selects an active, sellable SKU.
2. The customer adds SKU quantities to a cart and selects a delivery address.
3. At checkout, the system recalculates prices and evaluates one submitted coupon on the server.
4. The system creates the order, snapshots the customer-visible commercial terms, reserves stock, and reserves the coupon in one atomic operation.
5. The customer completes, cancels, or fails the mock payment.
6. A successful payment moves the order into the operator's shipment queue. An unsuccessful or abandoned payment releases reservations.
7. The order operator enters the carrier and tracking number for the whole order.
8. The customer reads the resulting shipment information and order history in the personal centre.

### Coupon use

1. The customer receives or holds an active coupon.
2. The customer selects at most one coupon during checkout.
3. The server confirms its ownership, validity period, limit, minimum spend, and eligibility before calculating the final amount.
4. Successful order creation reserves the coupon with the order.
5. Payment success consumes the coupon. Cancellation, payment failure, or 30-minute expiry releases the coupon reservation.
6. A successful refund does not restore a coupon that was already redeemed.

### Refund before shipment

1. A customer requests a refund for a paid order that has not been shipped.
2. The system rejects requests for unpaid, cancelled, shipped, completed, already-refunded, or otherwise ineligible orders.
3. An authorized operator approves or rejects the whole-order request and records the decision.
4. An approved request initiates the mock refund exactly once.
5. Successful mock refund marks the order refunded, restores the order's stock, and retains the coupon redemption history.

## Product Requirements

### Catalogue

- **PRD-CAT-01**: Customers can browse categories, active products, and active SKUs available to the current tenant.
- **PRD-CAT-02**: Customers see the price and current sellable availability for a selected SKU, but the display is not the final checkout authority.
- **PRD-CAT-03**: Catalogue operators can create, edit, publish, unpublish, and inspect products and SKUs within their tenant.

### Inventory

- **PRD-INV-01**: A customer cannot create an order for more units than are currently sellable.
- **PRD-INV-02**: Order creation reserves stock atomically; concurrent requests must not oversell an SKU.
- **PRD-INV-03**: Cancellation, failed payment, and 30-minute unpaid expiry release a reservation exactly once.
- **PRD-INV-04**: A successful eligible refund restores the refunded order's stock exactly once.

### Checkout and orders

- **PRD-ORD-01**: Checkout requires authentication and a customer-owned delivery address.
- **PRD-ORD-02**: The server, not the browser, determines order items, amounts, coupon result, and current sellability.
- **PRD-ORD-03**: An order preserves historical snapshots of the purchased SKU, pricing, coupon result, and delivery address.
- **PRD-ORD-04**: Customers can access only their own carts, addresses, orders, payments, and refund requests.

### Coupons

- **PRD-CPN-01**: A customer can apply no more than one eligible fixed-amount coupon to an order.
- **PRD-CPN-02**: Coupon evaluation enforces minimum spend, validity period, total issuance/usage limits, and per-customer limits.
- **PRD-CPN-03**: Coupon reservation and release follow the order lifecycle; a paid-and-refunded order does not reissue its coupon.

### Payment

- **PRD-PAY-01**: The MVP provides a mock payment experience that can finish successfully, fail, or be cancelled.
- **PRD-PAY-02**: Payment completion is idempotent: repeated confirmation cannot charge, consume stock, or advance an order twice.
- **PRD-PAY-03**: A paid order becomes available for shipment only after the server accepts payment completion.

### Shipment

- **PRD-SHP-01**: An authorized operator can record one carrier and tracking number for a paid, unshipped order.
- **PRD-SHP-02**: Customers can view shipment information for their own shipped order.
- **PRD-SHP-03**: Shipment makes the MVP refund route unavailable.

### Refunds

- **PRD-RFD-01**: A customer can request a refund only for a paid, unshipped, whole order.
- **PRD-RFD-02**: An authorized operator approves or rejects each refund request and records an auditable reason.
- **PRD-RFD-03**: An approved refund runs once through mock payment, restores stock on success, and does not restore the coupon.

## Business Rules

- The active Cabloy tenant is the commercial boundary. A tenant has one merchant and one warehouse in this MVP.
- Prices are USD integer cents. The customer-facing total cannot be negative after the coupon is applied.
- A coupon discount cannot exceed the eligible subtotal. The exact rounding and field definitions are specified in the SRS.
- A reservation exists for no more than 30 minutes while an order remains unpaid. Payment success, cancellation, failure, expiry, and refund are server-controlled lifecycle changes.
- One shipment represents the entire order. Partial fulfilment is not a supported MVP state.
- A refund concerns the entire paid order; no line-level refund quantity is supported.
- Customer-facing route admission is not authorization for backend operations. Server-side tenant and resource checks remain mandatory.

## Launch Criteria

The MVP is ready for acceptance when:

- the customer purchase, payment, shipment, and eligible refund journeys complete end to end in both development and SSR production-like modes;
- automated tests cover stock contention, repeated payment/refund notification, tenant isolation, coupon misuse, payment expiry, and shipment/refund conflicts;
- operators cannot read or mutate another tenant's catalogue, orders, stock, coupon, payment, shipment, or refund data;
- order snapshots remain historically stable after later catalogue, price, address, and coupon-template edits; and
- all PRD requirements map to SRS contracts and delivery tasks.

## Requirement Traceability

| Product area        | PRD requirements | SRS contracts            | PDP/WBS tasks          | Test-plan evidence                        |
| ------------------- | ---------------- | ------------------------ | ---------------------- | ----------------------------------------- |
| Catalogue           | `PRD-CAT-*`      | `SRS-CAT-*`              | `WBS-30-*`             | `ATP-SNAP-01`                             |
| Inventory           | `PRD-INV-*`      | `SRS-INV-*`              | `WBS-30-*`, `WBS-40-*` | `ATP-INV-01`, `ATP-TXN-01`, `ATP-EXP-01`  |
| Checkout and orders | `PRD-ORD-*`      | `SRS-ORD-*`, `SRS-TXN-*` | `WBS-40-*`             | `ATP-TEN-01`, `ATP-AUT-01`, `ATP-SNAP-01` |
| Coupons             | `PRD-CPN-*`      | `SRS-CPN-*`              | `WBS-40-*`             | `ATP-CPN-01`                              |
| Payment             | `PRD-PAY-*`      | `SRS-PAY-*`              | `WBS-50-*`             | `ATP-PAY-01`, `ATP-EXP-01`                |
| Shipment            | `PRD-SHP-*`      | `SRS-SHP-*`              | `WBS-60-*`             | `ATP-SHP-01`, `ATP-RACE-01`               |
| Refunds             | `PRD-RFD-*`      | `SRS-RFD-*`              | `WBS-60-*`             | `ATP-RFD-01`, `ATP-RACE-01`               |

## Related Records

- [A-Commerce internal planning index](./README.md)
- [Software Requirements Specification](./srs.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [ADR 0001: Establish A-Commerce MVP Boundaries](./decisions/0001-mvp-boundaries.md)
