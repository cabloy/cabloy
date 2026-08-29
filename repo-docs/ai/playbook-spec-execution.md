# Playbook: Execute an Approved Cabloy Specification Increment

Use this playbook to deliver one approved Cabloy specification increment from a bounded WBS item through implementation, scoped verification, retained evidence, and an accurate progress handoff.

The `cabloy-spec-execution` skill is a control plane. It coordinates an approved increment and its specialist workflow; it is not a second product authority, architecture authority, or code generator.

## When to use this playbook

Use `cabloy-spec-execution` when you need to:

- implement one named `WBS-*` item
- execute an explicitly named, finite, approved phase with a defined closure boundary
- verify or close a named ATP or release-gate task
- turn one existing suite-plan increment into implementation and observed proof

Requests such as “implement the suite,” “finish all specs,” or “do the next phase” are not bounded enough. Select one WBS task, or explicitly approve a finite task list and its closure boundary, before implementation begins.

Use [Playbook: Plan a Cabloy Suite Specification](/ai/playbook-spec-generation) instead when the task changes a requirement, contract, dependency, scope boundary, or durable decision.

## Establish the execution boundary first

Start by inspecting the active repository, edition marker, current revision, and working-tree state. Then build an execution dossier for the selected increment.

The dossier identifies:

- suite, edition, target WBS ID or approved finite task list, and closure boundary
- linked PRD, SRS, ADR, ATP, progress, and evidence records
- predecessor tasks and their required proof
- source ownership, affected areas, and explicit exclusions
- applicable tenant, authorization, privacy, lifecycle, transaction, concurrency, idempotency, audit, migration, SSR, and contract-loop constraints
- the specialist workflow that owns implementation
- approved verification procedures, expected redacted evidence, and allowed record updates
- blockers, unresolved `TODO(confirm)` items, excluded unsafe operations, and one next action

Require explicit approval of the dossier before source changes, meaningful verification, evidence/status updates, or specialist execution. Do not reserve a task by marking it `in-progress` before approved work actually starts.

## Read authority before implementation

Read the suite records in this order:

1. `README.md` for identity, topology, reading order, and authority map
2. `prd.md`, `srs.md`, and applicable ADRs for product and technical authority
3. the complete WBS task and its dependencies in `pdp-wbs.md`
4. linked ATP procedures and release gates in `test-plan.md`
5. `progress.md` for derived status, blockers, waivers, evidence pointers, and next proof
6. linked evidence, runbooks, presentation records, or rollout records when they apply
7. `implementation-gantt.svg` and `implementation-burndown.svg` as derived views to check for freshness, not authority

When records conflict, return to [Playbook: Plan a Cabloy Suite Specification](/ai/playbook-spec-generation) before implementation. Do not resolve an authority contradiction through an execution note, a chart edit, or a source workaround.

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

- `in-progress` — approved implementation or verification has actually begun
- `implementation-complete` — source work is complete, but required ATP or release proof remains
- `verified` — all applicable WBS checks and ATPs have durable, linked, redacted observed evidence

A successful build, generation command, hook, manual walkthrough, screenshot, or unrelated test run is not by itself `verified` unless the authoritative test plan defines it as sufficient retained proof. Evidence is revision- and authority-scoped; mark old proof superseded or requiring rerun when relevant source or authority changes.

## Refresh derived charts last

After evidence and progress are accurate, refresh the two derived views when the suite's authoritative Markdown follows the [chart input contract](/reference/repo-scripts#chart-input-contract). Refresh again when the suite README title or language changes:

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

A next action is a handoff, not authorization to execute another task. If it requires an authority change, return to [Playbook: Plan a Cabloy Suite Specification](/ai/playbook-spec-generation).

For the public boundaries between docs, skills, suite authority, and CLI workflows, read [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping) and [CLI to Skill Map](/ai/cli-to-skill-map).
