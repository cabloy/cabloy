# A-Commerce Delivery Progress

> This is a derived execution-status index. It records current delivery state, evidence pointers, blockers, and next proof only. The [PRD](./prd.md), [SRS](./srs.md), [PDP/WBS](./pdp-wbs.md), and [test plan](./test-plan.md) remain the authoritative sources for scope, contracts, sequencing, completion checks, and acceptance evidence.
>
> Last reviewed: 2026-07-21.

## Status Legend

| Status                    | Meaning                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `not-started`             | No implementation work or acceptance evidence is recorded.                                                      |
| `in-progress`             | Work has started, but the owning WBS acceptance checks are not yet all met.                                     |
| `implementation-complete` | Implementation is reported complete, but required acceptance evidence or a closure gate remains incomplete.     |
| `verified`                | All applicable WBS acceptance checks have passed and durable, traceable ATP evidence is recorded.               |
| `blocked`                 | Progress cannot continue because of an unresolved dependency, decision, or failing gate.                        |
| `waived`                  | A temporary exception exists. It must name an owner, reason, and expiry date; an expired waiver blocks release. |

## Phase Summary

| Phase                                                          | Status                    | Completion basis                                                                                                                                          | Current evidence / blocker                                                                                                                              | Next action                                                                                              |
| -------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 10 — Documentation baseline and implementation gate            | `verified`                | `WBS-10-01` is a dependency of the implemented Phase 20 work.                                                                                             | The PRD, SRS, WBS, test plan, and MVP-boundaries ADR establish the traceability baseline.                                                               | Keep authoritative documents aligned before making scope or contract changes.                            |
| 20 — Suite, site, flavor, and contract plumbing                | `implementation-complete` | The WBS reports implementation complete. Formal closure requires `ATP-SSR-01`, `ATP-SSR-02`, `ATP-CTR-01`, and a successful Commerce CI browser baseline. | The test plan records local passes for all three ATP scenarios; the durable CI run URL or identifier has not yet been retained in the evidence record.  | Record the successful Commerce CI browser-baseline run URL or identifier, then mark Phase 20 `verified`. |
| 30 — Tenant-scoped catalogue and stock foundation              | `in-progress`             | `WBS-30-01` and `WBS-30-02` require catalogue/SKU lifecycle and auditable, concurrency-safe stock operations.                                             | The test plan records existing Phase 30 coverage for catalogue, stock balance, and stock audit, but no complete WBS-30 exit-evidence record is present. | Complete the WBS-30 acceptance checks and retain `ATP-TEN-01`, `ATP-INV-01`, and `ATP-SNAP-01` evidence. |
| 40 — Checkout, coupon, order, and reservation lifecycle        | `not-started`             | `WBS-40-*` depends on Phase 30.                                                                                                                           | No complete phase-level acceptance evidence is recorded.                                                                                                | Start after the required Phase 30 contracts and evidence are ready.                                      |
| 50 — Mock payment and customer order experience                | `not-started`             | `WBS-50-*` depends on Phase 40.                                                                                                                           | No complete phase-level acceptance evidence is recorded.                                                                                                | Start after checkout, coupon, and reservation lifecycle requirements are verified.                       |
| 60 — Operator shipment and pre-shipment refunds                | `not-started`             | `WBS-60-*` depends on Phase 50.                                                                                                                           | No complete phase-level acceptance evidence is recorded.                                                                                                | Start after payment and customer order lifecycle requirements are verified.                              |
| 70 — Migrations, integration hardening, and release acceptance | `not-started`             | `WBS-70-*` depends on all preceding implementation phases.                                                                                                | No complete release evidence is recorded.                                                                                                               | Start release hardening after applicable ATP scenarios from Phases 20–60 pass.                           |

## WBS Execution Register

| WBS ID                        | Status                    | Required acceptance evidence                                                                                               | Latest recorded evidence                                                                                        | Next proof / blocker                                                                       |
| ----------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `WBS-10-01`                   | `verified`                | Aligned scope, terminology, state names, traceability, and no open policy question affecting the MVP contracts.            | The linked planning baseline is in place and Phase 20 declares this dependency satisfied.                       | Update the authoritative document first if a policy changes.                               |
| `WBS-20-01`                   | `implementation-complete` | Suite-contained Vona/Zova layout and refreshed module metadata/dependencies.                                               | Phase 20 is reported implementation-complete in the WBS.                                                        | Retain/attach closure evidence with the Phase 20 CI record.                                |
| `WBS-20-02`                   | `implementation-complete` | `ATP-SSR-01` and `ATP-SSR-02`: independent Commerce SSR sites, anonymous privacy, hydration, and operator-access boundary. | Local passes are recorded in the [Phase 20 observed-evidence table](./test-plan.md#phase-20-observed-evidence). | Retain the successful Commerce CI browser-baseline run URL or identifier.                  |
| `WBS-20-03`                   | `implementation-complete` | `ATP-CTR-01`: paired SSR/REST artifacts and normal forward/reverse contract synchronization.                               | A local pass is recorded in the [Phase 20 observed-evidence table](./test-plan.md#phase-20-observed-evidence).  | Retain the successful CI/build evidence reference.                                         |
| `WBS-30-01`                   | `in-progress`             | Active tenant-owned catalogue/SKU reads and mutations; immutable historical orders.                                        | Existing catalogue coverage is noted in the test plan.                                                          | Record completed acceptance checks and the applicable `ATP-TEN-01`/`ATP-SNAP-01` evidence. |
| `WBS-30-02`                   | `in-progress`             | Non-negative available stock, traceable stock audit, and concurrent-update rollback behavior.                              | Existing stock-balance and stock-audit coverage is noted in the test plan.                                      | Record `ATP-INV-01` evidence, including the required contention outcome.                   |
| `WBS-40-*` through `WBS-70-*` | `not-started`             | See the completion checks and ATP mappings in the [PDP/WBS traceability matrix](./pdp-wbs.md#traceability-matrix).         | No phase-level closure evidence is recorded.                                                                    | Advance in dependency order; add individual WBS rows here when work begins.                |

## Update Rules

1. Update this file when a WBS item changes state, a blocker appears or clears, or durable acceptance evidence is recorded.
2. Link to evidence; do not duplicate requirement text, state machines, test procedures, logs, screenshots, or generated artifacts here.
3. Set a WBS item or phase to `verified` only when its WBS acceptance checks pass and each applicable `ATP-*` item has retained, traceable evidence.
4. A phase remains `implementation-complete` when code is complete but an acceptance, CI, or release-closure requirement is still outstanding.
5. Record a `waived` item with the waiver owner, reason, and expiry date. An expired waiver is a release blocker under the [test plan](./test-plan.md#test-fixtures-and-evidence).
6. If scope, ownership, a system contract, delivery sequence, or test acceptance changes, update the authoritative document first and then refresh this derived status index.

## Related Records

- [A-Commerce internal planning index](./README.md)
- [Product Requirements Document](./prd.md)
- [Software Requirements Specification](./srs.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Phase 20 Contract Loop](./phase-20-contract-loop.md)
