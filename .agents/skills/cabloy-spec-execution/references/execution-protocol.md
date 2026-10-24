# Spec Execution Protocol

This reference defines the preflight and handoff protocol for `cabloy-spec-execution`. It coordinates an approved delivery increment; it does not become a parallel product, architecture, or implementation authority.

## 1. Discovery dossier

Before selecting work, inspect the active repository root and record only observed facts:

```bash
git rev-parse --show-toplevel
git status --short
git rev-parse HEAD
find . -maxdepth 1 \( -name '__CABLOY_BASIC__' -o -name '__CABLOY_START__' \) -print
```

Then inspect the root `package.json`, `repo-agent-governance/` (or the active generated adapter), the suite spec directory, and actual affected source paths. Classify the worktree as clean, dirty with unrelated changes, dirty with overlapping changes, or otherwise unknown. Do not clean or reset it to make execution easier.

Exactly one edition marker is required before edition-specific work. Both markers mean stop as invalid/ambiguous; neither means inspect the owning package/structure and ask. For Basic or Start, resolve scripts, sites, UI, flavors, and generated paths from that active repository. Shared workflow does not make runtime facts interchangeable.

## Target semantics

Apply the same classes used by generation:

- **Observed existing**: cite inspected source/configuration/manifest and the owner.
- **Proposed new**: design approval, framework/collision checks, or ADR acceptance is missing; creation stays gated.
- **Explicitly approved new**: concrete design passed framework/collision checks, user explicitly approved it, and governing ADR is `Accepted`. A separately approved bounded WBS task can create its future source. Do not require a deliberately new target to exist already.

For a new independent site, verify the site ID/public-path collisions, exclusive root-path owner, flavor/composition, SSR admission/profile, site module/registration, bundle/release identity, generated REST package/import, durable manifests, and paired commands together. Cite checked framework surfaces and accepted design authority. A shared target still requires an observed owner.

A new wrapper is a planned addition until implementation creates it in the durable manifest. Observe its resulting definition and SSR/REST pairing before running it. Neither tuple design nor generation approval is execution approval. Keep controlling TODOs, unaccepted ADRs, and blocked gates; absence of future source alone is not one of those gates.

## 2. Target selection

The normal unit of work is one WBS item. A phase may be selected only when the phase is a finite, explicitly approved batch and the WBS defines its task set and closure boundary. Use the existing scope and authority description to identify the observable business, framework, or tooling outcome and the minimum connected implementation path that delivers it; include supporting work only where that path or a concrete material risk requires it.

A valid target dossier names:

- suite planning directory and edition;
- one `WBS-*` ID, or finite phase/task list;
- linked `PRD-*`, `SRS-*`, and `ATP-*` IDs;
- dependencies and predecessor WBS rows;
- source areas and ownership;
- explicit exclusions and neighboring work that will not be touched.

Vague targets such as “implement the suite”, “finish all specs”, or “do the next phase” are not executable. Ask the user to select a task or approve a finite task list.

## 3. Authority and readiness gates

Read in this order:

1. README and authority map;
2. PRD, SRS, and applicable ADRs;
3. complete WBS task and dependency rows;
4. linked ATP definitions and test-plan release gates;
5. progress, blockers, waivers, and next proof;
6. linked evidence, indexes, runbooks, presentation/rollout records, and applicable derived charts. With complete supported chart inputs, check freshness using `npm run spec:charts:check -- <suite>`; otherwise report the precise legacy/lightweight gap.

Run the applicable authority audit (`npm run spec:check -- <suite>`; `--lightweight` only for agreed limited scope). Keep definition/reference/chain/link audit, chart model/freshness, and human approval/evidence review separate. Compatible legacy catalogue tables remain definitions only in their owning catalogue role; matrices/evidence do not define records. Do not invent business declarations to repair a tool gap.

Before implementation, verify:

- the WBS target exists and is bounded;
- every material linked requirement has a technical contract and ATP;
- each predecessor is `verified`, or is `planning-complete` with its own formal `Completion mode: planning-only.` declaration, named-reviewer revision-scoped disposition and documentary proof; neither `implementation-complete` nor a traceability exception satisfies this edge;
- no controlling `TODO(confirm)`, unaccepted ADR, waiver, or failed gate remains unresolved;
- the selected task is not already `verified`, `deferred`, or `blocked`;
- source ownership and the target API/state/page boundary are unambiguous;
- current evidence is still valid for the current source revision and authority set;
- with complete supported inputs, both charts are current or regeneration is in approved scope; with incomplete inputs, the omission is explicit and does not conceal a controlling task-authority gap;
- dirty-worktree changes can be attributed without overwriting unrelated work;
- tenant, identity, authorization, ownership, privacy, lifecycle, transaction, concurrency, idempotency, audit, and recovery constraints are defined for the task’s risk;
- the requested change does not broaden scope or create a competing persistence, identity, or API authority.

Apply readiness to the selected increment and its real dependency graph. Record each blocker with its affected branch, decision owner and finite closure condition in existing records; keep future refinements and release-only questions separate. Do not require the new implementation's runtime ATP evidence before implementation starts, but retain required predecessor evidence and any specifically mandated pre-implementation qualification. When blocked, surface one meaningful, independently verifiable alternative if available, without executing it unapproved or changing formal dependencies/status to bypass the blocker. A foundation-only subincrement needs a named existing or approved-scope consumer and integration path, or a concrete invariant, defect, or material risk it addresses, plus checks and explicit scope approval. A planned consumer need not already exist in source, but hypothetical reuse and isolated passing helper tests do not establish integration value. Such work does not complete the parent WBS.

When authority records conflict, stop the affected work. Update the authoritative PRD, SRS, or ADR through `cabloy-spec-generation`, then propagate the change through WBS, ATP, evidence assumptions, and progress. Do not reconcile a conflict by silently editing a downstream status or implementation plan. A return to planning must name the new fact, material authority question or blocker to resolve and its exit condition; do not restart a preparation/review cycle merely to restate accepted direction. Batch related decisions and report stalled convergence if further refinement has no justified new value.

## 4. Special gates

### Persisted schema and file version

If implementation may add or alter a persisted field, table, relation, index, or `meta.version.ts` path, ask before editing whether `vonaModule.fileVersion` should increment. Do not infer the answer from neighboring modules. Include managed isolated verification of affected migration, initialization, or seed behavior in the dossier and evidence plan; focused tests still prepare the test database, and a `meta.version.ts` edit alone does not require the full suite. Record development-database updates separately: tests do not update dev data, normal startup applies pending migrations, and replaying an already-applied positive-numbered branch on disposable dev data requires separate explicit reset approval. A no-bump decision is not reset authorization; use a new migration when existing data must be preserved.

### Contract loop

Classify the handoff before choosing commands:

- **forward**: Vona DTO/controller/entity/validation/OpenAPI truth -> inspect output -> regenerate Zova consumers -> thin frontend follow-up;
- **reverse**: Zova-owned route/resource/metadata -> build the affected flavor’s SSR and REST outputs -> run `npm run deps:vona`;
- **consumer drift**: identify the generated or hand-authored stale surface before changing source;
- **local dependency drift**: enter only after source, generated output, flavor build, and dependency sync are known correct.

Generated consumers are disposable outputs and must not be hand-edited. The contract-loop hook may assist, but it is not proof of completion.

### SSR and flavor

For SSR or route work, identify the actual site/flavor, route admission, auth requirement, SSR profile, private data boundary, and hydration-time initial render contract. Verify the relevant SSR and REST artifacts together when the change crosses the reverse handoff. Do not use the absence of a locale parameter as a reason to choose a session/public profile, and do not copy Basic SSR assumptions into Start.

### External and destructive operations

Provider calls, real webhooks, deployment, release, cutover, credential changes, database reset/recreation, `npm run init`, broad generation, cleanup/reset/stash/checkout, and dependency reinstall are separate operations. Keep them out of ordinary spec execution unless their own explicit workflow and confirmation authorizes them. Use synthetic or sandbox data and redact retained proof.

## 5. Confirmation dossier template

Present this before implementation:

```text
Execution target: <WBS ID or finite phase>
Edition/repository: <observed edition and root>
Revision/worktree: <HEAD>; <clean or dirty classification>
Scope: <bounded tasks and exclusions>
Authority: <PRD/SRS/ADR/WBS/ATP links>
Dependencies: <predecessors and proof>
Source ownership: <observed paths and proposed paths>
Specialist route: <backend/frontend/contract-loop/specialist>
Safety/contract constraints: <tenant, auth, lifecycle, transaction, SSR, migration, privacy>
Verification: <exact approved ATP procedures and commands>
Failure handling: <bounded in-scope diagnosis/repair/reruns, limits, and explicit stop conditions; or stop/report only>
Evidence: <required revision/environment/procedure/result/redacted artifact>
Target classes: <observed existing / proposed new / explicitly approved new; design checks, ADR and planned additions>
Quality gates: <authority audit; chart input eligibility/model/freshness; human approval/evidence>
Derived charts: with complete inputs, regenerate both after progress or README title/language changes, then run spec:charts:check; otherwise name the input gap. They remain non-authoritative.
Allowed record updates: <evidence/phase index/progress/derived charts, or explicitly named authority change>
Blocked or unresolved: <TODOs, waivers, conflicts>
Excluded operations: <init/reset/deploy/provider/etc.>
Next action: <one action after confirmation>
```

Require explicit confirmation unless this same bounded dossier already has valid explicit approval. Reuse unchanged approval across skill handoffs, session continuations and implementation substeps after checking current revision/worktree attribution and evidence applicability. Revision change alone requires an impact check, not automatic reapproval. Refresh affected dossier parts and obtain renewed approval for material scope/authority/dependency/safety changes, newly observed risks or conditions specified by the approval. A prior confirmation does not authorize a new task, phase, provider operation, or destructive command. Once ready and approved, proceed with the coherent implementation/verification sequence rather than requesting the same permission or another planning round by default.

## 6. Specialist routing

| Task shape                                                                | Primary route                                       | Coordinator must preserve                                                                                |
| ------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Vona module/bean/service/model/entity/DTO/validation/migration/test       | `cabloy-backend-scaffold`                           | CLI-first generation, tenant/security review, migration/index/version gate, tests, OpenAPI impact        |
| Zova page/component/route/model/metadata/SSR/test                         | `cabloy-frontend-scaffold`                          | route metadata, state ownership, hydration equivalence, actual source import suffixes, flavor/site proof |
| OpenAPI, SDK/schema, generated consumer, reverse metadata, stale consumer | `cabloy-contract-loop`                              | source-first direction, paired SSR/REST reverse build, `deps:vona`, no hand edits                        |
| master-detail, resource-field, module removal                             | corresponding specialist skill                      | specialized ownership and cleanup order                                                                  |
| requirement, architecture, scope, identity, or authority change           | `cabloy-spec-generation` / `cabloy-domain-planning` | no implementation around unresolved authority                                                            |

The coordinator may pass the dossier to the specialist; it should not duplicate the specialist’s detailed command tree.

## 7. Verification and stopping

Start with the narrowest meaningful check, then execute linked ATP procedures and only the required release gates. Explicitly preserve test-owned fixture cleanup, separate `mockCtx(...)` boundaries for competing Vona operations, synthetic/redacted data, and the test plan’s database/flavor requirements.

Verify the approved connected outcome, not merely supporting helper behavior. Once that outcome and its applicable required checks are satisfied, stop optional abstraction, hardening, and cleanup; report remaining improvements without automatically implementing them. Keep any outstanding acceptance or release gates explicit rather than claiming full completion. This does not waive necessary security, tenant isolation, privacy, lifecycle correctness, migration, or mandatory evidence requirements.

After user correction, redirect the affected approach rather than rename, relocate, or repackage rejected work. Reassess only the affected scope and preserve valid unchanged approvals; the correction does not itself authorize destructive cleanup or a different feature.

The approved dossier may cover bounded in-scope diagnosis, implementation/test repair, and reruns, including locator corrections. Record the first failure and subsequent attempts, then complete that connected work within the stated limits without another approval for each substep. Do not weaken expected business/security outcomes, skip required checks, or expand scope to obtain a pass. If repair/reruns are not authorized, the limit is reached, or the user explicitly required first-failure stopping, stop and report. This permission is prospective and never overrides an existing narrower approval.

Stop and report rather than guessing when:

- a command to run is not yet observed, or a creation path lacks the explicit approved-new design/ADR/execution boundary; future source absence alone is not a blocker for an approved creation task;
- a failed test or missing required artifact cannot be resolved within the approved repair/rerun boundary, or an explicit stop condition applies;
- the working tree becomes attribution-ambiguous;
- a specialist discovers a requirement or contract change;
- a planned external/destructive operation is needed;
- a prior evidence record is invalidated by source or authority changes.

A failed verification creates an accurate blocker only when the observed result is recorded; otherwise the task remains unexecuted or in-progress according to actual activity. Do not claim a phase or release is closed because one feature ATP passed.
