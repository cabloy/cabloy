# A-Commerce Presentation Contracts

## Purpose and Authority

This document is the living resource/scene matrix for A-Commerce semantic presentation. It applies [PRD-UI-01](./prd.md) and [SRS-UI-05](./srs.md) under [ADR 0003](./decisions/0003-semantic-presentation-contracts.md).

It does not redefine product scope, DTO/API membership, validation, persistence, authorization, Model ownership, page ownership, or SSR privacy. Those remain authoritative in the PRD and SRS. Vona DTO render metadata translates an already-authorized scene contract into placement and renderer choice; Zova implements that metadata at runtime.

## Matrix conventions

| Column                       | Meaning                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| Resource and scene           | The domain projection, audience, and task being described.                                     |
| Information areas and fields | Business facts needed by the scene, in intended reading or input order.                        |
| Boundary                     | Whether data is editable, readonly, derived, hidden, live, or immutable snapshot data.         |
| Presentation strategy        | Default, shared renderer, or a later Commerce-specific renderer decision.                      |
| Constraint and evidence      | Authority/privacy boundary that must survive the presentation work and its verification owner. |

## Coupon Template Admin reference

Coupon Template is the first executable conformance reference. Its scene layouts remain owned by `PRD-CPN-04` and `SRS-UI-04`; this table records the field-rendering policy that completes the reference.

| Resource and scene                      | Information areas and fields                                                                                                                                                                          | Boundary                                                                                       | Presentation strategy                                                                                                                                                              | Constraint and evidence                                                         |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Coupon Template / Admin Create          | Basic information: `name`, `state`, `description`; discount policy: `currency`, `discountCents`, `minSpendCents`; validity window: `validFrom`, `validUntil`; usage limits: issue/use/customer limits | All listed policy fields are inputs; `description` is optional                                 | `state`: shared select field; cent values: shared currency field with 2-decimal minor-unit conversion; validity values: shared date field; `currency` remains the literal USD code | The browser never supplies commercial authority. `ATP-FIA-01`, `ATP-SPC-01`     |
| Coupon Template / Admin Update          | Basic information: `name`, `state`, `description`                                                                                                                                                     | Only the current update DTO fields are editable; policy fields are absent, not visually hidden | Same state select renderer; normal text fields use default renderers                                                                                                               | Metadata cannot broaden the update contract. `ATP-FIA-01`, `ATP-SPC-01`         |
| Coupon Template / Admin View            | Basic information; discount policy; validity window; usage limits plus `issuedCount` and `redeemedCount`                                                                                              | All values readonly; counters are derived operational facts                                    | Shared select, currency, and date cells/fields preserve semantic labels and units                                                                                                  | View cannot create a mutation surface. `ATP-FIA-01`, `ATP-SPC-01`               |
| Coupon Template / Admin List and filter | Compact finding controls: `name`, `createdAt`; list identity and operations                                                                                                                           | Filter has one action block; operations follow backend authorization                           | Shared date-range filter; name is the view link; state/money/date cells use their entity metadata when surfaced by the list schema                                                 | List layout does not become the entry-form contract. `ATP-FIA-01`, `ATP-SPC-01` |

## Baseline inventory for follow-up resource slices

These rows classify the next semantic-presentation work. They do not authorize source changes in this baseline implementation.

| Resource and scene                  | Information areas and fields                                                                                     | Boundary                                                                                                        | Presentation strategy                                                                                                                                                               | Constraint and evidence                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Category / Product / SKU Admin      | Identity, parent/category/product relation, publication/lifecycle, price, description, SKU attributes            | Create/update policy follows current Resource DTOs; catalogue visibility remains server-advisory                | Relations need resource identity treatment; lifecycle/publication need localized status treatment; `priceCents` needs cents formatting; attributes need structured detail treatment | Do not change customer catalogue DTOs or live sellability authority. Future resource-slice ATP                               |
| Order Admin                         | Identity, lifecycle, money summary, reservation deadline, address/coupon/line snapshots, shipment/refund actions | Lifecycle and money are readonly facts; actions remain independently server-authorized; snapshots are immutable | Status and money renderers; business-date renderer; summary list cells and complete structured View sections                                                                        | Do not use row/action visibility as authorization; do not replace snapshots with live data. Future resource-slice ATP        |
| Stock Balance and Stock Audit Admin | SKU identity, on-hand/reserved/available values, operation, delta, before/after values, actor/correlation/time   | Audits are readonly; availability is a derived business value                                                   | Resource identity renderer; localized operation/status renderer; quantity/delta semantics; timestamp renderer; audit detail grouping                                                | Preserve stock transaction and audit invariants. Future resource-slice ATP                                                   |
| Address Admin                       | Recipient and address summary, contact fields, created/updated time                                              | Readonly Admin projection; customer Web has its own DTO, Model, and page                                        | Compact address summary for list; complete readonly address detail; standard dates                                                                                                  | Never merge Admin and customer DTO/state/page contracts or expose Admin mutation. `ATP-ADDR-01` plus future presentation ATP |

## Renderer selection rule

Use the default renderer for ordinary text and simple values when it preserves business meaning. Use a shared renderer for dates, enum labels/selects, cents, resource identities, and reusable details. Introduce a Commerce-specific renderer only when those shared resources cannot preserve the documented meaning or interaction, and then follow the reverse contract loop before backend metadata references it.

## Related Records

- [A-Commerce internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [ADR 0003: Establish Semantic Presentation Contracts](./decisions/0003-semantic-presentation-contracts.md)
