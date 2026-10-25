# Cabloy Locale Delivery Progress

## Purpose and Authority

This is a derived status register for the [WBS](./pdp-wbs.md), not a source of product requirements or runtime contracts. The [PRD](./prd.md), [SRS](./srs.md), [test plan](./test-plan.md), and [ADR](./decisions/0001-locale-module-boundaries.md) retain their own authority.

Last reviewed: 2026-10-25.

## Status Definitions

| Status                  | Meaning                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| not-started             | Defined work has not begun; execution authorization may still be required.                                    |
| in-progress             | Approved work or verification is active and incomplete.                                                       |
| planning-complete       | An explicitly opted-in documentary task has named-reviewer, revision-scoped closure proof; not runtime proof. |
| implementation-complete | Source changes are complete but applicable acceptance proof is not.                                           |
| verified                | Applicable acceptance checks have retained revision/environment/procedure/result/artifact proof.              |
| blocked                 | A concrete failed gate or unresolved dependency prevents the affected work.                                   |
| waived                  | A temporary exception has owner, reason, expiry, and compensating control.                                    |
| deferred                | Explicitly postponed; not completed.                                                                          |

Only verified tasks reduce the verified-based chart remainder. An eligible planning-complete predecessor satisfies its dependency edge but does not authorize successor execution.

## Current Delivery Overview

| Concern                  | Current state                                                                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product/design direction | User approved the analyzed design and complete English planning scope; ADR 0001 is Accepted within its stated boundary.                                                                                             |
| Planning artifacts       | Complete baseline and attributed documentary review retained. Static audit/chart outcomes are separate from runtime acceptance.                                                                                     |
| Source attribution       | Base `81610b2341d7b6723e863da1a73a69ed0e0aefb2`, dirty implementation; final source-diff digest and changed-file scope are in the phase-20 evidence index. Earlier `2f3a2a1151` was a source-reading baseline only. |
| New source targets       | Paired Vona/Zova cabloy-locale suites and locale-jajp modules created through CLI; locale-zhtw not created.                                                                                                         |
| Implementation           | 1 of 6 WBS tasks verified; WBS-LOC-10-01 planning-complete, WBS-LOC-20-01 verified, remaining four not-started. No calendar commitment or full-feature closure.                                                     |
| Runtime/ATP evidence     | Applicable Japanese ATP-LOC-01/02/03 results retained: generator/runtime/typechecks, managed backend tests, paired builds/sync and three passing Web/Admin E2E scenarios. Earlier failures retained and reconciled. |
| Language policy          | Product offerings remain en-us/zh-cn, default en-us. Installing Japanese does not enable it; Japanese-enabled/default and missing-dictionary variants are isolated fixtures.                                        |
| Charts                   | Complete README/WBS/ATP/progress inputs; English derived views use relative/scope-count semantics. Freshness is checked separately after this update.                                                               |
| Next candidate           | WBS-LOC-30-01: complete both inventories and obtain attributed language review, subject to its own bounded execution approval. Not started automatically.                                                           |

## WBS Execution Register

| WBS ID        | Status            | Evidence                                                                                                                                                 | Next action                                                                                           |
| ------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| WBS-LOC-10-01 | planning-complete | [Attributed baseline review](./evidence/phase-10/baseline-review.md), revision `81610b2341`; documentary closure only.                                   | Closed; the separately approved successor increment has now been executed.                            |
| WBS-LOC-20-01 | verified          | [Japanese connected evidence](./evidence/phase-20/index.md), including dirty-source digest, applicable ATP-LOC-01/02/03 results and reconciled failures. | Bounded Japanese mechanism slice closed; no full dictionary, two-pack or release claim.               |
| WBS-LOC-30-01 | not-started       | None; translation inventory/review not executed.                                                                                                         | Obtain bounded execution approval, then complete both dictionaries and attributed terminology review. |
| WBS-LOC-30-02 | not-started       | None; reload behavior not exercised.                                                                                                                     | After Japanese slice, preserve override snapshot and verify provider/helper edit/deletion reloads.    |
| WBS-LOC-40-01 | not-started       | No complete two-language browser/SSR/validation proof; phase-20 policy regressions do not close this task.                                               | After dictionary/reload tasks, integrate existing consumers and paired artifact checks.               |
| WBS-LOC-50-01 | not-started       | None; public documentation and release-readiness proof absent.                                                                                           | After integration, close docs and applicable proof; publication requires separate approval.           |

Dependency readiness and implementation approval are separate. Downstream not-started rows do not claim that all predecessors or execution gates have been satisfied.

## Open Decision Register

| Gate                    | Owner                                                     | State and closure condition                                                                                                      | Actual dependency scope                                                                   |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Design and topology     | User / ADR decision authority                             | Settled for approved suite/module identities and no-new-site boundary. Reopen only for a material new conflict.                  | No current design blocker.                                                                |
| Baseline closure        | Claude Code, attributed documentary reviewer              | Closed for revision `81610b2341` with named-reviewer disposition and static checks. This is not human terminology review.        | WBS-LOC-10-01 predecessor edge satisfied.                                                 |
| Execution authorization | User                                                      | Explicit sequential dossier approval applied to WBS-LOC-10-01 and WBS-LOC-20-01 only; both selected steps are closed.            | A later increment requires its own bounded approval; no broad source authorization.       |
| Translation review      | Maintainer selects attributable Japanese/Taiwan reviewers | Reviewer identities/results remain unassigned until real review; close with revision-scoped dispositions and corrected coverage. | WBS-LOC-30-01 and downstream full acceptance, not the completed Japanese mechanism slice. |
| Release/publication     | User / release authority                                  | No publication approval requested or granted. Full runtime proof and release operation approval remain later gates.              | Release operations, not the completed bounded increment.                                  |

No unresolved architecture question currently requires another planning pass. No provider, Site, environment, tenant, or migration decision is manufactured for this static-resource feature.

## Current Evidence Index

- [WBS-LOC-10-01 baseline review](./evidence/phase-10/baseline-review.md): attributed Claude Code documentary closure for revision `81610b2341`, actual static checks, and the user-approved successor dossier. Not human language review or runtime ATP proof.
- [WBS-LOC-20-01 Japanese connected increment](./evidence/phase-20/index.md): final implementation diff SHA-256 `46b47ab6ad9e623a43efedbb6377d60edd51aeba77557dfb5d058616a86bcf62`, changed-file scope, config/pack variants, actual assertions/results, retained redacted logs, initial failures and final passing reruns. Locale browser scenarios now live in the independent `repo-e2e/specs/cabloy-locale.spec.ts`; the original `cabloy-basic.spec.ts` is unchanged by this feature. Preload assertions use explicit instrumentation at a real existing module boundary, not a pre-existing business translation reader; client lazy proof does not imply SSR import laziness.
- Full language inventory/human review, HMR, schema/draft validation, complete two-language SSR and release acceptance remain absent. Static authority audit and chart freshness describe planning consistency only.

## Update Rules and Next Steps

1. Update PRD/SRS/ADR authority before changing task/scenario/status scope.
2. Preserve exact IDs and only change statuses when their own checks and proof justify the transition.
3. Stop at the completed approved increment. The next candidate is a bounded WBS-LOC-30-01 dossier, not automatic execution.
4. Keep later runtime/review gaps visible. Neither an Accepted ADR nor passing spec/chart checks make those tasks implemented or verified.
5. Sanitize paths and manually inspect sensitive content before retaining evidence; preserve exit codes/failures/source hashes.
6. Regenerate/check both charts after README title/language, WBS, test-plan, or progress changes. Do not add dates/history or promote status to improve chart appearance.

## Related Records

- [README](./README.md)
- [PRD](./prd.md)
- [SRS](./srs.md)
- [PDP/WBS](./pdp-wbs.md)
- [Test plan](./test-plan.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
- [Implementation Gantt](./implementation-gantt.svg)
- [Implementation Burndown](./implementation-burndown.svg)
