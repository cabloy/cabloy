# A-Commerce Internal Planning

This directory records the agreed product, system, and delivery baseline for the `a-commerce` business suite. It is maintainer-facing planning material, not end-user product documentation.

## Reading Order

1. [Product Requirements Document](./prd.md) defines the MVP outcomes, users, scope, and acceptance expectations.
2. [Software Requirements Specification](./srs.md) defines the implementation contracts, ownership boundaries, state machines, and invariants.
3. [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md) sequences the work and defines completion checks.
4. [Test Strategy and Acceptance Plan](./test-plan.md) defines executable acceptance scenarios, evidence, and release proof.
5. [Phase 20 Contract Loop](./phase-20-contract-loop.md) defines the paired Commerce SSR/REST build and synchronization workflow.
6. [ADR 0001](./decisions/0001-mvp-boundaries.md) records the durable architecture and scope decisions behind this plan.

## Confirmed MVP Baseline

| Concern          | Decision                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Suite            | `a-commerce` (`providerId = a`, `suiteName = commerce`)                                                                          |
| Commercial model | One merchant, physical goods, one warehouse per existing Cabloy tenant                                                           |
| Tenant model     | Reuse Cabloy tenant isolation; do not introduce a store or merchant business entity                                              |
| Customer site    | `commerce` site ID, `/commerce` public path, `cabloyCommerce` Zova flavor                                                        |
| Operator site    | `commerceAdmin` site ID, `/commerce-admin` public path, `cabloyCommerceAdmin` Zova flavor                                        |
| Checkout         | Authenticated users only; all USD amounts are integer cents                                                                      |
| Inventory        | Reserve stock atomically when an order is created; release it on cancellation, failed payment, or 30 minutes unpaid              |
| Payment          | Mock payment in the MVP; real providers and multi-channel design are deferred                                                    |
| Coupon           | At most one fixed-amount coupon per order, subject to minimum spend, limits, and validity                                        |
| Shipment         | One whole-order shipment entered manually with carrier and tracking number                                                       |
| Refund           | Customer-requested, operator-approved, whole-order only, before shipment only; mock refund restores inventory but not the coupon |

## Planned Topology

`a-commerce` is a suite-first domain. Its Vona and Zova modules belong beneath the suite rather than being loose standalone packages:

```text
vona/src/suite/a-commerce/modules/
zova/src/suite/a-commerce/modules/
```

The planned capability boundaries are:

- `commerce-catalog`: categories, products, SKU publication, and catalogue read models;
- `commerce-trade`: carts, checkout, order snapshots, inventory reservation, and order lifecycle;
- `commerce-promotion`: coupon definitions, eligibility, reservation, and redemption;
- `commerce-payment`: payment attempts, mock payment events, and mock refunds;
- `commerce-member`: addresses, member extensions, and personal-centre aggregation;
- `commerce-siteweb`: the customer-facing SSR site and Web composition;
- `commerce-siteadmin`: the operator SSR site and Admin composition.

Inventory reservation starts as a `commerce-trade` aggregate behavior. The SRS keeps inventory ownership explicit so that a later inventory module can be extracted without changing the business contract.

## Document Authority

- The PRD owns customer and operator outcomes, scope, and business acceptance.
- The SRS owns system contracts, state transitions, data ownership, security, and technical acceptance.
- The PDP/WBS owns delivery order, dependencies, and verification steps.
- The test plan owns acceptance strategy, traceability evidence, and release proof.
- ADR 0001 owns the rationale for long-lived scope and architecture choices.

If the documents disagree, update the authoritative document first and then update every downstream reference.

## Related Framework Records

- [Suite and module guidance](../../../cabloy-docs/fullstack/suites-and-modules.md)
- [Fullstack SSR and bidirectional type-flow ADR](../../decisions/0004-fullstack-ssr-and-bidirectional-type-flow.md)
- [SSR site access and role model ADR](../../decisions/0006-ssr-site-access-and-role-model.md) — proposed guidance
- [SSR Vona/Zova boundary and call chain](../../architecture/ssr-vona-zova-boundary-and-call-chain.md)
- [User workspace SSR strategy](../../architecture/user-workspace-ssr-strategy.md)
- [Resource custom-API state ownership](../../architecture/resource-custom-api-state-ownership.md)
