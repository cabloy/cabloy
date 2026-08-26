# ADR 0003: Establish Semantic Presentation Contracts

## Status

Accepted.

## Background

A-Commerce uses Vona DTOs as the contract source for Admin Resource scenes and Zova renderer metadata as the generated presentation handoff. Coupon Template already demonstrates scene-specific Create, Update, View, and list/filter layouts, but the suite needs a durable rule that can guide later catalogue, order, stock, and Address presentation work.

## Problem

Without an explicit authority boundary, presentation work can introduce several forms of drift:

- visual layout can be mistaken for product or API authority;
- a universal form can erase meaningful differences between Create, Update, View, and list/filter scenes;
- frontend-local schema copies can diverge from Vona DTO contracts;
- visual hiding can be mistaken for authorization or customer-data isolation; or
- separate audiences, API contracts, Model owners, and pages can be collapsed into tabs or groups.

## Decision

### Define semantic presentation before renderer selection

A-Commerce presentation begins with an audience, task, scene, and meaningful business information areas. Lists support finding and comparison, mutation scenes expose only permitted input, and detail scenes expose complete audience-appropriate facts. State, money, availability, time, relations, and immutable snapshots are presented as business meanings rather than raw persistence values.

The PRD owns those outcomes. The SRS owns operation-specific scene contracts, including DTO membership and editable, readonly, derived, and hidden boundaries.

### Use DTO render metadata as the translation layer

Vona DTO render metadata translates eligible operation fields into order, visibility, groups, sections, tabs, Grid/flow placement, and renderer identities. Zova shared or Commerce-specific renderers implement the runtime presentation.

Metadata is not permitted to add API authority, change persistence or validation, turn browser input into server authority, replace authorization, or redefine SSR privacy. It also cannot merge a separate audience, API contract, Model owner, or page into a visual group.

### Permit scenes to differ by task and contract

Create, Update, View, and list/filter scenes may use different DTO fields and layouts when their tasks differ. Groups represent semantic information areas; sections solve local placement; tabs are reserved for genuinely independent information areas. Entry-form layout and list-filter layout are independently designed.

### Prefer shared renderer resources

Use existing Basic renderer resources where they preserve the semantic contract. Add a Commerce-specific renderer only when a reusable resource cannot accurately express the required business meaning or interaction. A custom renderer follows the normal reverse contract loop before Vona metadata references its identity.

### Retain Coupon Template as the first conformance reference

`PRD-CPN-04`, `SRS-UI-04`, `WBS-70-03`, and `ATP-FIA-01` remain the focused Coupon Template reference. The generic semantic-presentation contract is tracked separately through `PRD-UI-01`, `SRS-UI-05`, `WBS-70-04`, and `ATP-SPC-01`.

## Alternatives Considered

- **Make `formLayout` the product source of truth.** Rejected because layout syntax cannot define product intent or security boundaries.
- **Use one universal DTO and layout for every scene.** Rejected because it exposes inapplicable fields and obscures scene-specific editing authority.
- **Maintain frontend-local field schemas.** Rejected because it duplicates Vona contract truth and drifts from generated consumers.
- **Use visual hiding as authorization or data isolation.** Rejected because server authorization, DTO membership, resource ownership, state ownership, and SSR privacy remain independent contracts.

## Consequences

- Every new A-Commerce presentation slice starts from a resource/scene matrix and preserves its PRD/SRS authority chain.
- Metadata changes require emitted-contract evidence; business-significant renderer behavior also requires focused browser evidence.
- Existing Customer Web and Admin Resource boundaries remain separate even when they share one persisted domain.
- Cabloy Basic renderer identities in this ADR are not assertions about Cabloy Start UI implementation.

## Related Records

- [A-Commerce internal planning index](../README.md)
- [A-Commerce PRD](../prd.md)
- [A-Commerce SRS](../srs.md)
- [A-Commerce PDP/WBS](../pdp-wbs.md)
- [A-Commerce test plan](../test-plan.md)
- [Presentation contracts](../presentation-contracts.md)
- [ADR 0001: Establish A-Commerce MVP Boundaries](./0001-mvp-boundaries.md)
- [Repository-native planning documents](../../../repo-docs-internal/decisions/0010-repository-native-planning-documents.md)
- [Form Layout Guide](../../../repo-docs/frontend/form-layout-guide.md)
