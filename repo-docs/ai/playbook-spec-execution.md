# Execute an Approved Cabloy Specification Increment

Use this playbook to deliver one approved Cabloy specification increment from a bounded WBS item through implementation, scoped verification, retained evidence, and an accurate progress handoff.

The `cabloy-spec-execution` skill is a control plane. It coordinates an approved increment and its specialist workflow; it is not a second product authority, architecture authority, or code generator.

This playbook is the execution half of [AI Spec-Driven Development](/ai/ai-spec-driven-development). It operationalizes Traceable Spec Delivery for one bounded increment; it does not redefine upstream authority or make Contract Loop synchronization sufficient evidence of verification.

## Start a bounded execution increment

In Claude Code, use either of these entry points:

```text
/cabloy-spec-execution <WBS-ID>
/cabloy-spec-execution Execute the next task for <Suite Name>
```

An explicit `WBS-ID` is the most direct and precise request: it identifies the bounded increment that you want to execute.

If you do not know the next `WBS-ID`, use the suite-level request instead. AI reads the suite's WBS, dependencies, current progress, blockers, and acceptance requirements, then proposes the next ready bounded increment or a finite candidate set. Review and explicitly approve the proposed WBS target and execution dossier before any implementation begins. The suite-level request authorizes exploration and recommendation; it does **not** authorize AI to choose or execute adjacent work automatically.

Use `cabloy-spec-execution` when you need to:

- implement one named `WBS-*` item
- explore an existing suite and recommend its next ready bounded increment
- execute an explicitly named, finite, approved phase with a defined closure boundary
- verify or close a named ATP or release-gate task
- turn one existing suite-plan increment into implementation and observed proof

Requests such as “implement the suite,” “finish all specs,” or “do the next phase” are not bounded enough. Select one WBS task, or explicitly approve a finite task list and its closure boundary, before implementation begins.

Use [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation) instead when the task changes a requirement, contract, dependency, scope boundary, or durable decision.

## Establish the execution boundary first

Inspect the active root, current revision, working tree, and edition markers. Exactly one marker selects Basic or Start; both mean stop as invalid/ambiguous. If neither marker is present, inspect the owning package/structure and ask before edition-sensitive execution. Then build the selected increment's dossier.

The dossier identifies:

- suite, edition, target WBS ID or approved finite task list, and closure boundary
- linked PRD, SRS, ADR, ATP, progress, and evidence records
- predecessor tasks and their required proof
- source ownership, affected areas, and explicit exclusions
- applicable tenant, authorization, privacy, lifecycle, transaction, concurrency, idempotency, audit, migration, SSR, and contract-loop constraints
- the specialist workflow that owns implementation
- approved verification procedures, expected redacted evidence, and allowed record updates
- blockers, unresolved `TODO(confirm)` items, excluded unsafe operations, and one next action

Require explicit dossier approval before source changes, meaningful verification, evidence/status updates, or specialist execution. Generation approval, concrete design/ADR acceptance, and execution approval are separate. Do not reserve a task by marking it `in-progress` before approved work starts.

Classify targets as **observed existing**, **proposed new**, or **explicitly approved new**, as in [spec generation](/ai/playbook-spec-generation#existing-facts-and-new-designs). An approved new site/flavor tuple may be created before its future source exists if framework constraints and collisions were checked, you explicitly approved the concrete design, and its governing ADR is `Accepted`. Cite accepted design authority and planned paths/manifests in the dossier. Shared integration still requires an observed owner. Controlling TODOs, unaccepted ADRs, and blocked gates remain blockers; absence of future source alone is not one.

A new wrapper is a planned addition: create it within approved scope, inspect its durable manifest and paired SSR/REST outputs, then run it. Do not treat the proposed command as already runnable.

## Read authority before implementation

Read the suite records in this order:

1. `README.md` for identity, topology, reading order, and authority map
2. `prd.md`, `srs.md`, and applicable ADRs for product and technical authority
3. the complete WBS task and its dependencies in `pdp-wbs.md`
4. linked ATP procedures and release gates in `test-plan.md`
5. `progress.md` for derived status, blockers, waivers, evidence pointers, and next proof
6. linked evidence, runbooks, presentation records, or rollout records when they apply
7. applicable implementation charts, checking freshness only with complete supported inputs; report incomplete lightweight/legacy inputs rather than forcing new business declarations

Keep planning authority audit (`npm run spec:check -- <suite>`, with `--lightweight` only for agreed limited scope), chart model/freshness, and human approval/evidence as three separate gates. Compatible catalogue tables can define legacy ATPs in their owning role; matrices and evidence cannot. A static pass does not clear a controlling TODO, accept an ADR, or prove ATP execution.

When records conflict, return to [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation) before implementation. Do not resolve an authority contradiction through an execution note, a chart edit, or a source workaround.

## Stop at readiness gates

Do not begin the increment when any of these conditions applies:

- the WBS target, suite identity, ownership boundary, or required source fact is unresolved
- PRD, SRS, ADR, WBS, or ATP records conflict
- a controlling `TODO(confirm)` or unaccepted ADR remains
- a predecessor lacks its required completion state or evidence
- the selected task is already `verified`, `blocked`, or `deferred`
- overlapping working-tree changes cannot be classified for attribution
- material tenant, authorization, privacy, lifecycle, transaction, concurrency, idempotency, audit, migration, SSR, or ownership behavior is unspecified
- the proposed work expands scope or introduces a competing persistence, identity, or API authority

When adding a persisted field to an existing backend resource, stop and ask the user whether `vonaModule.fileVersion` should increment before changing `meta.version.ts` or the module schema path. A specification can provide context, but it does not replace this direct confirmation. Do not invent a migration strategy during execution.

## Route the smallest approved increment

After approval, hand the smallest coherent unit to the specialist that owns its implementation.

| Work shape                                                           | Route                                                |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| Vona module, entity, DTO, service, migration, or backend test        | `cabloy-backend-scaffold`                            |
| Zova page, route, component, model, metadata, SSR, or frontend test  | `cabloy-frontend-scaffold`                           |
| OpenAPI, generated consumers, reverse metadata, or consumer drift    | `cabloy-contract-loop`                               |
| Master-detail, resource-field update, or module removal              | The corresponding specialist skill                   |
| Requirement, scope, contract, dependency, or durable-decision change | `cabloy-spec-generation` or `cabloy-domain-planning` |

The execution workflow supplies the approved dossier and preserves the boundary; it does not replace a specialist's CLI-first procedure. Never hand-edit generated consumers, infer an unconfirmed site or flavor, or expand automatically into an adjacent WBS item.

## Verify narrowly and retain evidence

Use the narrowest approved check first, then follow the linked ATP procedures and applicable release gates.

1. run the scoped verification specified by the increment
2. retain observed evidence using the suite's existing convention
3. redact secrets, credentials, raw tokens, customer data, and provider identifiers
4. record failures, waivers, invalidation, and supersession rather than erasing history
5. update evidence before updating derived progress

Use status precisely:

- `in-progress` — approved work or verification has actually begun
- `planning-complete` — only an opted-in documentary/design WBS task with a named-reviewer, revision-scoped closure disposition and linked planning proof; no source or ATP closure
- `implementation-complete` — source work is complete, but required ATP or release proof remains
- `verified` — all applicable WBS checks and ATPs have durable, linked, redacted observed evidence

`planning-complete` satisfies a predecessor dependency edge but does not unblock a task still recorded `blocked` or grant an execution dossier. Charts count only `verified` toward verified/remaining metrics. A successful build, generation command, hook, manual walkthrough, screenshot, or unrelated test run is not by itself `verified` unless the authoritative test plan defines it as sufficient retained proof. Evidence is revision- and authority-scoped; mark old proof superseded or requiring rerun when relevant source or authority changes.

## Refresh derived charts last

After evidence and progress are accurate, refresh both derived views only when complete supported README/WBS/ATP/progress inputs follow the [chart input contract](/reference/repo-scripts#chart-input-contract). Refresh again when README title/language changes. If legacy/lightweight inputs are incomplete, report the precise omission and route necessary authority repair through planning; never invent business definitions to force chart generation. Find progress rows by `WBS ID` and `Status` headers, not fixed column positions.

```bash
npm run spec:charts -- <suite>
# Use this non-mutating check when verifying an existing chart state:
npm run spec:charts:check -- <suite>
```

The correct update order is:

```text
evidence → progress → derived charts
```

Use the check as a separate non-mutating freshness verification, such as CI or a review of an existing chart state. A passing chart check confirms only the supported chart input contract and generated-view freshness. It is not ATP proof, implementation proof, release approval, or a replacement for reviewing traceability and status semantics. Do not hand-edit an SVG to mask an authority conflict; correct the authoritative Markdown records and regenerate instead. Chart language follows the suite README.

Confirm the available root scripts and their input expectations in the active repository, especially when the work concerns a Cabloy Start checkout or a legacy suite.

## Keep unsafe operations outside the increment

Without a separate explicit workflow and approval, do not:

- infer Cabloy Start runtime facts from Cabloy Basic
- run `npm run init`, reset or recreate a database, or reinstall dependencies as a first response to drift
- clean, reset, stash, check out, or discard the working tree
- deploy, publish, cut over, operate a provider or webhook, change credentials, or retain secrets
- commit or push
- fabricate evidence or promote status based only on planning artifacts, hooks, builds, or generated outputs
- continue to adjacent WBS work automatically

## Leave a resumable handoff

Finish the increment with a concise record of:

1. target WBS/phase, edition, revision, and working-tree classification
2. implemented scope and explicit exclusions
3. commands and procedures actually run
4. observed evidence and its redacted location
5. resulting status and its precise reason
6. remaining blocker or evidence gap
7. exactly one next action

A next action is a handoff, not authorization to execute another task. If it requires an authority change, return to [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation).

For the public boundaries between docs, skills, suite authority, and CLI workflows, read [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping) and [CLI to Skill Map](/ai/cli-to-skill-map).
