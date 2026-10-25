# Cabloy Locale Delivery Progress

## Purpose and Authority

This is a derived status register for the [WBS](./pdp-wbs.md), not a source of product requirements or runtime contracts. The [PRD](./prd.md), [SRS](./srs.md), [test plan](./test-plan.md), and accepted [ADR 0001](./decisions/0001-locale-module-boundaries.md) / [ADR 0002](./decisions/0002-locale-provider-resource-export.md) retain their own authority.

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

| Concern                  | Current state                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product/design direction | ADR 0001 remains Accepted except the export/generator portions narrowly superseded by accepted ADR 0002. The user approved current `src/locales` + `localesProvider` and bounded specification alignment on 2026-10-25.                                                                                                                                                           |
| Planning artifacts       | Complete baseline and attributed documentary review retained. Static planning audit does not supply runtime acceptance.                                                                                                                                                                                                                                                           |
| Source attribution       | Current proof uses base `c6bbe87564acbc19af6c7667a104a3b2e71a8afc` plus implementation diff SHA-256 `0ca3d8077b0bd5a3ea8bcc412dfecc17b0b5c7e634d6166b977eec923028607b`: two new tooling tests and generated Zova workspace lockfile alignment. Product runtime/source generators have no new diff. Historical base `81610b2341` plus its different dirty digest remains separate. |
| New source targets       | Paired suites, locale-jajp and relocated locale-test modules are observed existing; locale-zhtw remains approved new, not created.                                                                                                                                                                                                                                                |
| Implementation           | 1 of 6 tasks verified; WBS-LOC-10-01 planning-complete, WBS-LOC-20-01 verified for the bounded Japanese slice, remaining four not-started.                                                                                                                                                                                                                                        |
| Runtime/ATP evidence     | Current ATP-LOC-01/02/03 Japanese-slice proof passed under supported Node 24.11.0: metadata 14 tests, frontend 19, managed backend 9, both typechecks, Admin/Web SSR+REST pairs then dependency sync, independent E2E 2. New sanitized primary artifacts are nonignored `.txt` additions, not yet committed. Historical 22 ignored logs remain locally present and unchanged.     |
| Language policy          | Product offerings remain en-us/zh-cn, default en-us. Installing Japanese does not enable it; Japanese-enabled/default and missing-dictionary variants are isolated fixtures.                                                                                                                                                                                                      |
| Charts                   | Complete README/WBS/ATP/progress inputs; English derived views use relative/scope-count semantics. Regeneration/freshness results are recorded separately in the phase index.                                                                                                                                                                                                     |
| Next candidate           | Recommend a bounded WBS-LOC-30-02 reload-correctness dossier; predecessor proof is satisfied. It remains unapproved/unstarted and does not depend on unassigned language reviewers.                                                                                                                                                                                               |

## WBS Execution Register

| WBS ID        | Status            | Evidence                                                                                                                                                  | Next action                                                                                      |
| ------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| WBS-LOC-10-01 | planning-complete | [Attributed baseline review](./evidence/phase-10/baseline-review.md), revision `81610b2341`; documentary closure only.                                    | Closed; preserve attribution, no repeated baseline review.                                       |
| WBS-LOC-20-01 | verified          | [Current Japanese proof](./evidence/phase-20/current-proof.md), base `c6bbe87564` plus recorded dirty digest; applicable bounded ATP-LOC-01/02/03 passed. | Closed for the Japanese mechanism slice only; no adjacent execution authorized.                  |
| WBS-LOC-30-01 | not-started       | None; complete translation inventory/review not executed.                                                                                                 | After separate execution approval, complete both dictionaries and attributed terminology review. |
| WBS-LOC-30-02 | not-started       | None; reload acceptance not exercised. Current source captures the provider snapshot; source presence is not ATP proof.                                   | Obtain a bounded dossier approval, then verify target/provider/helper edit/deletion reloads.     |
| WBS-LOC-40-01 | not-started       | No complete two-language browser/SSR/validation proof; phase-20 policy regressions do not close this task.                                                | After dictionary/reload tasks, integrate existing consumers and paired artifact checks.          |
| WBS-LOC-50-01 | not-started       | None; public documentation and release-readiness proof absent.                                                                                            | After integration, close docs and applicable proof; publication requires separate approval.      |

Dependency readiness and implementation approval are separate. Downstream not-started rows do not claim that all execution gates have been satisfied.

## Open Decision Register

| Gate                      | Owner                                                     | State and closure condition                                                                                                                                                                                           | Actual dependency scope                                                                                                                           |
| ------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design and topology       | User / ADR decision authority                             | Settled for approved suite/module identities, no-new-site boundary and ADR 0002 provider export contract. Reopen only for a material new conflict.                                                                    | No current design blocker.                                                                                                                        |
| Baseline closure          | Claude Code, attributed documentary reviewer              | Closed for revision `81610b2341` with named-reviewer disposition and static checks. This is not human terminology review.                                                                                             | WBS-LOC-10-01 predecessor edge satisfied.                                                                                                         |
| Execution authorization   | User                                                      | On 2026-10-25 the user separately approved and execution completed the bounded WBS-LOC-20-01 current-proof dossier, including minimal regressions, bounded repairs/reruns, paired builds/sync and managed locale E2E. | Approval exhausted at WBS-LOC-20-01 closure; successors require their own approval. No reset/init/env edit/reinstall/commit/publication approval. |
| Current predecessor proof | Implementer / user execution authority                    | Closed by current Japanese proof and durable nonignored redacted artifacts, with exact revision/dirty attribution. Historical export/generator discrepancy is not carried forward as an open blocker.                 | WBS-LOC-30-01 and WBS-LOC-30-02 predecessor edges satisfied; not permission to execute them.                                                      |
| Translation review        | Maintainer selects attributable Japanese/Taiwan reviewers | Reviewer identities/results remain unassigned until real review; close with revision-scoped dispositions and corrected coverage.                                                                                      | WBS-LOC-30-01 and downstream full acceptance, not the completed Japanese mechanism slice or independent reload task.                              |
| Release/publication       | User / release authority                                  | No publication approval requested or granted. Full runtime proof and release operation approval remain later gates.                                                                                                   | Release operations, not the completed bounded increment.                                                                                          |

The resource-export discrepancy is resolved by ADR 0002 and current proof. No further architecture-refinement or whole-baseline review is required. No Site, environment, tenant or migration decision is manufactured for this static-resource feature.

## Current Evidence Index

- [WBS-LOC-10-01 baseline review](./evidence/phase-10/baseline-review.md): attributed Claude Code documentary closure for revision `81610b2341`, actual static checks and the historical successor dossier. Not human language review or runtime ATP proof.
- [WBS-LOC-20-01 current proof refresh](./evidence/phase-20/current-proof.md): current scope/approval, source hashes/digest, fixtures, exact supported-Node commands/results, new primary artifacts, failures/reconciliation, cleanup and applicable ATP disposition. No new product runtime repair was necessary.
- [Phase-20 historical/current index](./evidence/phase-20/index.md): historical dirty-snapshot proof and original failures preserved; current proof explicitly supersedes its predecessor applicability. The historical 22 logs remain locally present but ignored/untracked, without a claim that their durability was repaired.
- Locale browser scenarios remain in independent `repo-e2e/specs/cabloy-locale.spec.ts`; current execution did not edit it or Basic E2E. Preload proof is instrumentation at a real existing module boundary, not a pre-existing business text reader; client lazy assertions do not imply SSR import laziness.
- Full inventory/human review, HMR, schema/draft validation, complete two-language SSR and release acceptance remain absent. Static authority audit and chart freshness describe planning consistency only.

## Update Rules and Next Steps

1. Update PRD/SRS/ADR authority before changing task/scenario/status scope.
2. Preserve exact IDs and only change statuses when their own checks and proof justify the transition.
3. Stop at WBS-LOC-20-01 closure. Next single action: prepare and seek approval for a bounded WBS-LOC-30-02 reload-correctness dossier; do not execute it automatically.
4. Keep later runtime/review gaps visible. Neither an Accepted ADR nor passing spec/chart checks make those tasks implemented or verified.
5. Sanitize paths and manually inspect sensitive content before retaining evidence; preserve exit codes/failures/source hashes.
6. Regenerate/check both charts after README title/language, WBS, test-plan or progress changes. Do not add dates/history or promote status to improve chart appearance.

## Related Records

- [README](./README.md)
- [PRD](./prd.md)
- [SRS](./srs.md)
- [PDP/WBS](./pdp-wbs.md)
- [Test plan](./test-plan.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
- [Provider export ADR](./decisions/0002-locale-provider-resource-export.md)
- [Implementation Gantt](./implementation-gantt.svg)
- [Implementation Burndown](./implementation-burndown.svg)
