# ADR 0001: Establish A-Commerce MVP Boundaries

## Status

Accepted.

## Background

A-Commerce is a new long-lived commerce domain in Cabloy Basic. The requested first release needs a complete business path—catalogue, stock protection, checkout, coupon, payment, shipment, and refund—without prematurely becoming a marketplace, multi-channel platform, or payment-provider framework.

The repository already has global SSR site identities `web` and `admin`, together with their own flavor-specific bundles and generated REST contracts. A-Commerce requires its own customer and operator applications to isolate its runtime composition, routes, menu surface, and deployment artifacts from existing functionality.

## Problem

Without an explicit domain and application boundary, a commerce MVP can fail in several durable ways:

- product, stock, order, coupon, payment, shipment, and refund behavior becomes one unowned module;
- stock is decremented after payment and concurrent checkout oversells;
- client-provided totals, tenant identity, or state transitions are accepted as authority;
- customer and operator interfaces leak into existing SSR sites or reuse conflicting site IDs;
- a mock payment prototype becomes coupled to order internals and blocks later provider work; or
- partial refunds, returns, multi-warehouse fulfillment, and marketplace concerns silently expand the MVP.

## Decision

### Establish a suite-first A-Commerce domain

Create `a-commerce` as the business suite boundary, with modules physically owned beneath it on Vona and Zova. The initial capability boundaries are catalogue, trade, promotion, payment, member, customer site, and operator site.

The commercial model is one merchant selling physical goods from one warehouse per existing Cabloy tenant. A-Commerce reuses the framework tenant boundary and does not add a store or merchant business entity.

### Use independent customer and operator SSR applications

Register two new Vona SSR site identities and matching Zova flavors:

| Concern     | Customer                 | Operator                             |
| ----------- | ------------------------ | ------------------------------------ |
| SSR site ID | `commerce`               | `commerceAdmin`                      |
| Public path | `commerce` (`/commerce`) | `commerce-admin` (`/commerce-admin`) |
| Zova flavor | `cabloyCommerce`         | `cabloyCommerceAdmin`                |

Do not reuse `web` or `admin` as Commerce site IDs. They are already globally registered by Basic site modules; a second registration would violate the SSR site identity contract. The Commerce public paths and bundle/REST outputs are separate from those existing applications.

Each Commerce flavor must build SSR and generated REST output as a paired contract, following the accepted fullstack SSR/type-flow model. Site and route admission are not substitutes for Vona API and service authorization.

### Make authenticated USD checkout and reservation-at-order the MVP transaction model

Checkout requires authentication. All commerce monetary values persist as integer USD cents. The server resolves tenant, customer ownership, SKU, price, coupon eligibility, and totals; browser values are requests, never authoritative commercial facts.

Order creation atomically snapshots the commercial terms, creates stock reservations, reserves one eligible coupon when supplied, creates a mock payment attempt, and records the operation. The reservation expires after 30 minutes unpaid and is released on cancellation, failed payment, or expiry. Payment success consumes the reservation.

### Keep payments mockable but commerce-owned

The MVP uses mock payment and mock refund outcomes. Payment attempts, idempotency, and order transition integration belong to the Commerce payment boundary. This permits later provider adapters and events without placing provider-specific behavior inside the order aggregate.

### Limit promotion, shipment, and refund behavior

An order may apply at most one fixed-amount coupon, subject to minimum spend, validity, total usage limits, and per-customer limits. Cancellation/failure/expiry releases a coupon reservation; a successful refund does not restore a redeemed coupon.

An operator records one carrier and tracking number for a whole paid order. A customer can request a whole-order refund only while it is paid and unshipped. An authorized operator approves or rejects it. A successful mock refund restores stock and does not reissue the coupon.

## Alternatives Deferred

The following are intentionally not part of the MVP:

- reuse of Basic `web`/`admin` sites or site IDs for Commerce;
- a marketplace, multiple merchants, merchant onboarding, or settlement;
- multiple warehouses, stock transfer, allocation, backorders, split shipment, or split fulfilment;
- guest checkout and guest order-privacy/claiming rules;
- real payment providers, external callbacks, reconciliation, disputes, or payment routing;
- external sales channels and channel-specific stock;
- percentage, stacked, or campaign promotions;
- partial refunds, post-shipment returns, return logistics, inspection, or RMA;
- tax/shipping-rate engines and multi-currency selling.

## Consequences

- A-Commerce has two additional SSR sites, flavors, bundles, generated REST packages, and operational build paths.
- The domain has explicit tenant, stock, payment, coupon, shipment, and refund invariants before feature code is written.
- Stock reservation expiry and idempotent payment/refund transitions are mandatory work, not future cleanup.
- Customer and operator authorization require explicit server-side permissions and resource ownership checks.
- Later real providers and external channels must extend the payment/channel boundary rather than change the ownership of orders or inventory reservations.
- Later scope expansion must be introduced through a new decision and system contract rather than by broadening the MVP state machine implicitly.

## Related Records

- [A-Commerce internal planning index](../README.md)
- [A-Commerce PRD](../prd.md)
- [A-Commerce SRS](../srs.md)
- [A-Commerce PDP/WBS](../pdp-wbs.md)
- [ADR 0004: Preserve Fullstack SSR and Bidirectional Type-Flow Principles](../../../decisions/0004-fullstack-ssr-and-bidirectional-type-flow.md)
- [ADR 0006: SSR Site Access and Role Model](../../../decisions/0006-ssr-site-access-and-role-model.md) — proposed guidance
- [SSR Vona/Zova Boundary and Call Chain](../../../architecture/ssr-vona-zova-boundary-and-call-chain.md)
