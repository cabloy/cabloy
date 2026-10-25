# WBS-LOC-10-01 Baseline Review

## Attribution and approval

- Date: 2026-10-25.
- Reviewer: Claude Code (AI implementation agent), not a human language reviewer.
- Reviewed revision: `81610b2341d7b6723e863da1a73a69ed0e0aefb2`; clean working tree at review start.
- Scope: the seven Markdown authorities and two derived SVGs in `repo-specs/cabloy-locale/` at that commit. Product/tooling source is unchanged from the source-reading baseline `2f3a2a1151`.
- User approval: after presentation of the two-step boundary, the user selected “批准两步顺序执行（Recommended）” for WBS-LOC-10-01 followed by WBS-LOC-20-01. This permits the documentary review and, only after its closure, the bounded Japanese increment. It does not authorize adjacent WBS tasks or publication.

## Review disposition

**Planning-complete.** I, Claude Code, reviewed the committed baseline's PRD/SRS/ADR/WBS/ATP/progress consistency and observed-versus-new target classification. The approved Japanese increment has sufficient scope, safety limits, dependencies, and prospective acceptance to start; no material unresolved architecture decision was found. This is an attributed AI documentary review with user-authorized execution, not human translation review, ATP verification, or a release disposition.

The ADR remains Accepted for the already-approved design. All product tasks remain unverified. New source targets are approved new, not existing. Both workspace discovery patterns cover the intended suites/modules; current manifest checks found no planned package-name collisions. No new Site, API, persistence, migration, authorization boundary, environment override, or general registry is permitted.

## Actual checks

At the clean reviewed revision:

| Command | Exit | Observed result |
| --- | --- | --- |
| `npm run spec:check -- cabloy-locale` | 0 | Complete planning structure passed; 32 definitions and exact-ID chain. Static structure only. |
| `npm run spec:charts:check -- cabloy-locale` | 0 | Both English derived SVGs fresh; 0/6 verified. |
| `./node_modules/.bin/oxfmt --check repo-specs/cabloy-locale/*.md repo-specs/cabloy-locale/decisions/*.md` | 0 | All seven Markdown files correctly formatted. |
| `git diff --quiet 2f3a2a1151..HEAD -- vona zova package.json scripts repo-agent-governance` | 0 | No product/tooling change since source-reading baseline. |

The source inspection and static checks above are not runtime results. No application, product build, database operation, or ATP was run for this documentary closure. Retained content uses repository-relative locations and was manually reviewed for machine paths and sensitive data.

## Successor execution dossier

- Target: **WBS-LOC-20-01 only**, after this documentary closure; Cabloy Basic, same linked PRD/SRS/ADR/ATP authority.
- Outcome: paired Japanese providers and actual scoped consumers, early provider registration, policy independent of installed packs, single-language metadata generation, and applicable ATP-LOC-01/02/03 proof.
- Source: new `vona/src/suite/cabloy-locale` and `zova/src/suite/cabloy-locale`; existing locale/module runtimes, config/default consumers, metadata generators, menus/SSR locale input, and focused tests. Preserve target message-key ownership.
- Concrete consumers: existing home-base/layout targets and `demo-basic`'s `HelloWorld` client-lazy page. The only confirmed preload module is `a-bean`; no pre-existing translation reader at its install boundary was found. A focused assertion at the actual preload installation boundary is new test instrumentation, not a claim about an existing business reader. Do not add production pack Monkey/Main behavior to manufacture that consumer.
- Specialist routing: cabloy-backend-scaffold and cabloy-frontend-scaffold; cabloy-contract-loop if generated artifact synchronization becomes necessary.
- Verification: focused actual generator/runtime regressions; managed backend `npm run test -- test-vona/test/locale.test.ts`; frontend source-import/entry tests through existing `node --test` files; `npm run tsc:vona` and `npm run tsc:zova`. Inspect affected artifacts before running applicable paired builds/synchronization. Route/menu behavior must be checked, not inferred from a helper test. Any unexecuted browser/SSR proof stays explicitly open.
- Evidence: exact commands/exits, revision plus dirty-change attribution, pack/config/fixture variants, observed assertions and failures, cleanup, and redacted artifacts under phase 20; no empty ATP records.
- Failure handling: in-scope diagnosis, test/implementation repairs and reruns are approved. Stop for an authority conflict, attribution ambiguity, destructive/external operation, or material scope/safety change. Do not weaken assertions for a pass.
- Permitted record updates: this evidence, phase-20 evidence, derived progress and both charts. No product authority change is silently authorized.
- Exclusions: full two-language inventory/terminology review, HMR hardening, full SSR/validation release proof, public docs/release closure, reset/init/seeding, environment changes, dependency reinstall, deployment/publication, commit/push.
- Separate gates: static authority audit passed; chart freshness passed; user approved this bounded execution. Runtime proof is still to be produced, and publication remains unauthorized.

## Related authority

- [WBS](../../pdp-wbs.md)
- [SRS](../../srs.md)
- [Test plan](../../test-plan.md)
- [ADR 0001](../../decisions/0001-locale-module-boundaries.md)
- [Progress](../../progress.md)
