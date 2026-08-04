# A-Commerce Internal Planning

This directory records the agreed product, system, and delivery baseline for the `a-commerce` business suite. It is maintainer-facing planning material, not end-user product documentation.

## Reading Order

1. [Product Requirements Document](./prd.md) defines the MVP outcomes, users, scope, and acceptance expectations.
2. [Software Requirements Specification](./srs.md) defines the implementation contracts, ownership boundaries, state machines, invariants, and Commerce contract-loop requirements.
3. [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md) sequences the work and defines completion checks.
4. [Test Strategy and Acceptance Plan](./test-plan.md) defines executable acceptance scenarios, Phase 20 build/browser procedure, evidence, and release proof.
5. [Delivery Progress](./progress.md) is the derived execution-status index for WBS state, evidence pointers, blockers, and next proof; it does not redefine authoritative requirements or acceptance.
6. [ADR 0001](./decisions/0001-mvp-boundaries.md) records the accepted MVP architecture and scope decisions behind this plan.
7. [ADR 0002](./decisions/0002-multi-merchant-within-one-vona-instance.md) records proposed guardrails for a future multi-merchant boundary within one Vona instance.
8. [ADR 0003](./decisions/0003-semantic-presentation-contracts.md) records the semantic-presentation authority and boundary convention.
9. [Presentation contracts](./presentation-contracts.md) is the living resource/scene matrix that applies the PRD and SRS to renderer selection.
10. [Semantic-presentation rollout](./semantic-presentation-rollout.md) is the resumable execution runbook for the staged follow-on work; it does not replace the authoritative WBS, test plan, or matrix.

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

## Semantic Information Architecture Baseline

A-Commerce is also a reference for semantic information architecture. [PRD-UI-01](./prd.md) and [SRS-UI-05](./srs.md) define the audience, task, scene, and business information areas that must remain distinct; [ADR 0003](./decisions/0003-semantic-presentation-contracts.md) defines the authority boundary; and the [presentation contracts](./presentation-contracts.md) matrix records resource/scene application. Vona DTO render metadata translates that intent into field placement, groups, sections, tabs, or renderer identities. `formLayout` syntax is implementation metadata, not product authority. A separate audience, API contract, state owner, or page boundary must not be reduced to a visual grouping decision.

## Current Topology

`a-commerce` is a suite-first domain. Its Vona and Zova modules belong beneath the suite rather than being loose standalone packages:

```text
vona/src/suite/a-commerce/modules/
zova/src/suite/a-commerce/modules/
```

The capability boundaries are:

- `commerce-catalog`: categories, products, SKU publication, and catalogue read models;
- `commerce-trade`: carts, checkout, order snapshots, inventory reservation, and order lifecycle;
- `commerce-promotion`: coupon definitions, eligibility, reservation, and redemption;
- `commerce-payment`: payment attempts, mock payment events, and mock refunds;
- `commerce-member`: addresses, member extensions, and personal-centre aggregation;
- `commerce-siteweb`: the customer-facing SSR site and Web composition;
- `commerce-siteadmin`: the operator SSR site and Admin composition.

The reusable `a-home` modules `home-indexweb` and `home-indexadmin` provide general Web and Admin landing or entry pages. They remain distinct from the Commerce-owned `commerce-siteweb` and `commerce-siteadmin` modules, which own Commerce application/site composition.

Inventory reservation starts as a `commerce-trade` aggregate behavior. The SRS keeps inventory ownership explicit so that a later inventory module can be extracted without changing the business contract.

## Document Authority

- The PRD owns customer and operator outcomes, scope, and business acceptance.
- The SRS owns system contracts, state transitions, data ownership, security, technical acceptance, and Commerce contract-loop requirements.
- The PDP/WBS owns delivery order, dependencies, and completion checks.
- The test plan owns acceptance strategy, executable build/browser procedures, traceability evidence, and release proof.
- ADR 0001 owns the accepted MVP scope and architecture choices.
- ADR 0002 owns proposed guardrails for any future multi-merchant boundary inside one Vona instance.
- ADR 0003 owns the durable semantic-presentation translation and boundary convention.
- [ADR 0010](../../decisions/0010-repository-native-planning-documents.md) owns the repository-wide decision to retain internal planning documents and not adopt OpenSpec as a parallel planning authority.
- [ADR 0009](../../decisions/0009-homepage-module-naming-boundary.md) owns the cross-suite naming and ownership boundary between reusable A-Home entry modules and Commerce site modules.

If the documents disagree, update the authoritative document first and then update every downstream reference.

## Related Framework Records

- [Suite and module guidance](../../../cabloy-docs/fullstack/suites-and-modules.md)
- [Fullstack SSR and bidirectional type-flow ADR](../../decisions/0004-fullstack-ssr-and-bidirectional-type-flow.md)
- [SSR site access and role model ADR](../../decisions/0006-ssr-site-access-and-role-model.md) — proposed guidance
- [SSR Vona/Zova boundary and call chain](../../architecture/ssr-vona-zova-boundary-and-call-chain.md)
- [User workspace SSR strategy](../../architecture/user-workspace-ssr-strategy.md)
- [Resource custom-API state ownership](../../architecture/resource-custom-api-state-ownership.md)
