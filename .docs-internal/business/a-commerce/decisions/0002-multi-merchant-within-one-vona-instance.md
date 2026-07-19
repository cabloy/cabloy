# ADR 0002: Preserve a Path to Multiple Merchants Within One Vona Instance

## Status

Proposed.

## Background

ADR 0001 establishes the A-Commerce MVP as one merchant and one warehouse per existing Cabloy tenant. It deliberately reuses the Vona tenant boundary and does not introduce a merchant or store business entity.

Vona tenant isolation remains unchanged: one active instance is one tenant, and ordinary resource models automatically scope records to the active instance through `iid`. A future requirement for several merchants in one instance is therefore a business-domain boundary inside the existing tenant, not another meaning for a Vona instance.

The current Commerce suite has begun persisting catalogue and stock records. Defining the future boundary before carts, orders, promotions, payments, shipments, and member-facing Commerce data become established prevents singleton assumptions from becoming accidental long-term contracts.

## Problem

Treating a future merchant as another instance would conflate a business boundary with Vona tenancy and break the existing tenant-isolation model. Conversely, adding `merchantId` ad hoc to selected resources would leave relation traversal, authorization, uniqueness, background work, audit history, and non-disclosure behavior inconsistent.

Multiple merchants within one instance also does not by itself define a marketplace. Merchant onboarding, settlement, commissions, cross-merchant checkout, and external-channel aggregation require separate product and architecture decisions.

## Decision

### Keep the instance as the tenant boundary

One Vona instance remains one tenant. A merchant is an additional Commerce business boundary inside the active instance.

A future implementation must not represent merchant selection by choosing another Vona instance, accepting caller-controlled `iid`, using `disableInstance`, selecting another datasource, or creating a merchant-specific SSR site, Zova flavor, bundle, or deployment identity. Automatic active-instance scope remains the outer isolation boundary for every merchant-aware operation.

This ADR supplements ADR 0001. ADR 0001 remains the accepted single-merchant MVP decision until a separately approved implementation decision changes the product scope. This ADR introduces no merchant resource, schema, route, permission, migration, or runtime behavior now.

### Introduce an explicit merchant boundary when implementation is approved

A future implementation must create an explicit Commerce merchant resource with a stable server-assigned identifier. Merchant names, slugs, domains, or other display values must not be used as the sole authority or cross-resource key.

Merchant-owned records must persist `merchantId`, unless it can be derived through a mandatory and unambiguous merchant-owned parent. All business operations and relation traversals must validate both:

1. active Vona instance / tenant scope; and
2. compatible merchant ownership.

A future resource-ownership design must cover at least these domains:

| Domain             | Merchant boundary requirement                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catalogue          | Category, Product, SKU, publication, price, and catalogue read-model ownership must be explicit.                                                        |
| Inventory          | Warehouse, stock balance, reservation, restoration, and stock audit ownership must be explicit.                                                         |
| Trade              | Cart, checkout, order, order line, and immutable order snapshots must belong to one merchant unless a later cross-merchant-order ADR says otherwise.    |
| Promotion          | Coupon definition, grant, eligibility, reservation, and redemption scope must be explicit.                                                              |
| Payment and refund | Attempts, idempotency, correlation, and refund history must retain merchant identity.                                                                   |
| Shipment and audit | Fulfilment records and immutable audit records must retain merchant identity even after rename, disablement, or other merchant configuration changes.   |
| Member-facing data | The boundary for addresses, carts, order history, and personal-centre aggregation must be explicit while preserving the shared Passport identity model. |

The existing persisted Category, Product, SKU, Stock Balance, and Stock Audit records are currently singleton Commerce data within their tenant. Before enabling multi-merchant behavior, an approved migration must designate and backfill their merchant ownership consistently. The migration design must cover validation, recovery, and post-backfill isolation proof.

### Derive merchant authority on the server

A merchant identifier received from a browser, route, request body, event, or queue payload is selection input to validate; it is never authorization evidence.

A future authorization model must keep these concerns distinct:

- active tenant membership;
- Commerce SSR site and route admission;
- merchant membership;
- merchant-scoped permissions; and
- any explicitly authorized platform or cross-merchant authority.

A tenant-level administrator must not gain implicit cross-merchant access merely because they are an instance administrator. Any platform-wide Commerce role requires an explicit, auditable permission decision.

List, view, mutation, relation, and action paths must filter by authorized merchant scope before returning or changing records. A record outside the active merchant scope normally appears absent or not found. Code must not probe another merchant merely to distinguish an absent record from a foreign one and return `403`. `403` remains appropriate for a recognized operation within an already authorized scope when its action is forbidden.

### Preserve merchant-aware data integrity and asynchronous scope

Merchant-scoped business uniqueness must include the active tenant and merchant boundary where the business meaning requires it. Use ordinary supporting indexes for lookup performance and enforce business uniqueness in the tenant-aware, merchant-aware service layer; do not create accidental global or tenant-only uniqueness.

Scheduled expiry, events, queue workers, payment/refund recovery, locks, idempotency workflows, and audit writes must carry and re-establish both instance and merchant scope. A tenant-wide worker may enumerate work, but each work item must execute with explicit merchant context and cannot operate on a merchant-free aggregate.

### Preserve the existing Commerce applications

`commerce` and `commerceAdmin` remain Commerce application/site identities, not merchant identities. Multi-merchant support must resolve merchant context within the existing customer and operator applications unless a later ADR decides custom storefront domains, merchant-specific SSR configuration, or another application topology. Site admission remains separate from Vona API, service, and resource authorization.

## Alternatives Deferred

This ADR does not approve or imply:

- a marketplace, merchant onboarding, merchant self-service, seller settlement, commissions, payouts, escrow, or tax-liability allocation;
- cross-merchant carts, orders, payments, refunds, stock pools, split fulfilment, or merchant-to-merchant data sharing;
- external sales channels, channel-specific inventory, catalogue aggregation, or payment routing;
- multiple warehouses or warehouse transfers; or
- merchant-specific domains, bundles, SSR sites, or Zova flavors.

Each of these expands the business model beyond merchant scoping and requires its own product and architecture decision.

## Consequences

- Future Commerce implementation work must treat merchant scope as additive to, never a replacement for, Vona instance scope.
- The resource-owner modules established by ADR 0001 remain responsible for their domains; merchant scope does not by itself move Catalogue, Trade, Promotion, Payment, Member, or site ownership.
- Before adding merchant fields, the implementation design must define the resource ownership matrix, actor/access matrix, migration plan, unique-key semantics, cross-merchant non-disclosure behavior, and background-work context propagation.
- Current `systemAdmin`-guarded Commerce scaffolding is not a decision that instance administrators automatically manage every future merchant. The documented target remains explicit Commerce permissions, with merchant-level authority defined before implementation.

## Related Records

- [A-Commerce internal planning index](../README.md)
- [ADR 0001: Establish A-Commerce MVP Boundaries](./0001-mvp-boundaries.md)
- [A-Commerce PRD](../prd.md)
- [A-Commerce SRS](../srs.md)
- [A-Commerce PDP/WBS](../pdp-wbs.md)
- [Multi-Instance and Instance Resolution](../../../../cabloy-docs/backend/multi-instance-and-instance-resolution.md)
- [Model Guide](../../../../cabloy-docs/backend/model-guide.md)
- [CRUD Workflow](../../../../cabloy-docs/backend/crud-workflow.md)
