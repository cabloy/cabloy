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

| Concern                  | Current state                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Product/design direction | User approved the analyzed design and confirmed the complete English planning scope; ADR 0001 is Accepted within its stated boundary. |
| Planning artifacts       | New complete baseline authored; static audit/chart outcomes are reported by the generation handoff, not treated as ATP results.       |
| Source baseline observed | `2f3a2a1151`; source reading only, not implementation or acceptance.                                                                  |
| New source targets       | Approved new design; no suite/module source has been created by planning generation.                                                  |
| Implementation           | 0 of 6 WBS tasks verified; all 6 not-started. No actual task duration, staffing, or calendar commitment.                              |
| Runtime/ATP evidence     | None. No ATP, scaffolding, product build, reset, initialization, or publication executed during generation.                           |
| Charts                   | Complete README/WBS/ATP/progress inputs; generated views use English and relative/scope-count semantics only.                         |
| Next candidate           | Close baseline handoff, then approve the Japanese connected increment rather than another open-ended refinement pass.                 |

## WBS Execution Register

| WBS ID        | Status      | Evidence                                                      | Next action                                                                                                                        |
| ------------- | ----------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| WBS-LOC-10-01 | not-started | None; generation and ADR acceptance do not close this review. | Named reviewer closes the exact baseline and prepares separate bounded execution approval.                                         |
| WBS-LOC-20-01 | not-started | None; source/ATP execution not begun.                         | After predecessor closure and dossier approval, connect Japanese resources, policy, preload/lazy consumers, and generator support. |
| WBS-LOC-30-01 | not-started | None; translation inventory/review not executed.              | After Japanese slice, complete both dictionaries and attributed terminology review.                                                |
| WBS-LOC-30-02 | not-started | None; reload behavior not exercised.                          | After Japanese slice, preserve override snapshot and verify provider/helper edit/deletion reloads.                                 |
| WBS-LOC-40-01 | not-started | None; browser/SSR/validation proof absent.                    | After dictionary/reload tasks, integrate existing consumers and paired artifact checks.                                            |
| WBS-LOC-50-01 | not-started | None; release-readiness proof absent.                         | After integration, close docs and applicable proof; publication requires separate approval.                                        |

Dependency readiness and implementation approval are separate. Downstream not-started rows do not claim that predecessors or execution gates have been satisfied.

## Open Decision Register

| Gate                    | Owner                                                     | State and closure condition                                                                                                      | Actual dependency scope                                                                 |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Design and topology     | User / ADR decision authority                             | Settled for approved suite/module identities and no-new-site boundary. Reopen only for a material new conflict.                  | No current design blocker; source creation still requires execution approval.           |
| Baseline closure        | Named maintainer reviewer                                 | Pending attributable disposition for the exact generated revision and documentary checks.                                        | WBS-LOC-10-01; predecessor for the initial implementation slice.                        |
| Execution authorization | User                                                      | Pending cabloy-spec-execution dossier approval for the selected WBS boundary.                                                    | Only the approved increment may execute; planning does not grant broad source work.     |
| Translation review      | Maintainer selects attributable Japanese/Taiwan reviewers | Reviewer identities/results remain unassigned until real review; close with revision-scoped dispositions and corrected coverage. | WBS-LOC-30-01 and downstream full acceptance, not the initial Japanese mechanism slice. |
| Release/publication     | User / release authority                                  | No publication approval requested or granted. Runtime proof and release operation approval remain later gates.                   | Release operations, not source planning or initial implementation readiness.            |

No unresolved architecture question currently requires another planning pass. No provider, Site, environment, tenant, or migration decision is manufactured for this static-resource feature.

## Current Evidence Index

No runtime acceptance or documentary closure evidence is retained yet. Do not create an evidence ID/directory until an actual approved procedure or attributable baseline review produces revision-scoped proof. The design/generation confirmations are approval inputs, not ATP records. Static audit and chart freshness outputs describe planning consistency only.

## Update Rules and Next Steps

1. Update PRD/SRS/ADR authority before changing task/scenario/status scope.
2. Preserve exact IDs and only change statuses when their own checks and proof justify the transition.
3. Prepare WBS-LOC-10-01 closure and a bounded WBS-LOC-20-01 execution dossier through cabloy-spec-execution. The latter must name source boundaries, Japanese consumers, targeted checks, resource/cleanup limits, and approval.
4. Keep missing runtime proof visible. Neither an Accepted ADR nor passing spec/chart checks make a source task implemented or verified.
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
