# Canonical Spec Input and Quality Gates

Use this syntax for new spec records. Preserve compatible legacy records when maintaining an existing suite; parser compatibility is not permission to reinterpret business definitions.

## Definition roles

Only declarations in the owning document define IDs:

| Owner          | New canonical declaration                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| `prd.md`       | Atomic `- **PRD-...**: <requirement body>` under product requirements.                                            |
| `srs.md`       | Atomic `- **SRS-...**: <contract body>` under the applicable contract section.                                    |
| `pdp-wbs.md`   | `#### WBS-...: <title>` inside a phase; declaration body contains Traceability, Tasks, and Acceptance checks.     |
| `test-plan.md` | `### ATP-...: <title>` under `## Acceptance Scenario Catalogue`; declaration body contains the five fields below. |

References in matrices, related-record lists, progress, evidence, templates, wildcards, or ranges are not definitions. A legacy acceptance catalogue table may declare scenarios when the table is actually the scenario catalogue in `test-plan.md`; a generic traceability matrix or evidence table cannot. Compatible legacy requirement/contract declarations remain valid in their owning role. Do not create duplicate declarations to migrate syntax.

Use exact instantiated IDs in declaration-body Traceability. A wildcard or abbreviated range is an aggregate summary, not an exact association or substitute for missing definitions. Keep associations explicit even if a downstream summary matrix repeats them. The audit must derive associations from the declaration body, not nearby unrelated sections.

For a genuinely cross-cutting engineering contract without a product requirement, an atomic SRS bullet may carry `Traceability exception: technical-only — <record-specific rationale>` on its definition line. This exempts only the incoming PRD association; its outgoing WBS mapping remains required. For a documentary planning or release gate with no independent executable scenario, a WBS task may carry `Traceability exception: authority-only — <record-specific rationale>` in its declaration body. This exempts only the outgoing ATP association; its incoming SRS mapping remains required. Use exactly one well-formed field on the correct definition and explain the alternative authority or retained documentary checks. The auditor rejects malformed, empty, duplicated, or wrong-kind exceptions. Neither classification waives the underlying contract, delivery checks, applicable ATPs, revision-scoped evidence, or release approval; never use one merely to silence a missing real link.

For a Phase 10 task that reviews the entire planning baseline rather than implementing one SRS or executing one ATP, use the separate `Traceability mode: planning-baseline-review` classification and accepted local ADR review authority described in `traceability-and-status-rules.md`. It exempts only that WBS task's incoming SRS and outgoing ATP checks. Do not combine it with a `Traceability exception` or apply it to product-delivery, contract-loop, migration, or release work. Classification alone does not establish approval, proof, `planning-complete` eligibility, or `verified` status; a separate task-local `Completion mode: planning-only.` declaration is required for planning closure.

## Minimal connected example

These are neutral **syntax examples**, not business requirements to copy into a real suite. All four IDs are exact and unique. Production bodies must describe the approved domain.

### prd.md

```markdown
## Product Requirements

- **PRD-DEMO-01**: An authorized operator can inspect the active tenant's item. Traceability: `SRS-DEMO-01`.
```

The colon follows the closing bold delimiter. Do not generate `**PRD-DEMO-01: Title**` as the new canonical form.

### srs.md

```markdown
## Ownership and Authorization Contracts

- **SRS-DEMO-01**: The server derives tenant and operator authority before returning the item. Traceability: `PRD-DEMO-01`, `WBS-DEMO-10-01`.
```

An atomic bullet's own prose may carry its Traceability. Do not place associations only in a distant matrix.

### pdp-wbs.md

```markdown
## Work Breakdown Structure

### Phase 10: Implement the bounded item inspection

Dependencies: none.

#### WBS-DEMO-10-01: Implement tenant-scoped inspection

Traceability: `PRD-DEMO-01`, `SRS-DEMO-01`, `ATP-DEMO-01`.

Dependencies: none.

Source areas: the approved item owner; paths are proposed until created.

Tasks:

- Implement the approved tenant-scoped inspection boundary.

Acceptance checks:

- The selected ATP passes and retains its required proof.
```

Each phase has explicit Dependencies, using `none` when no predecessor exists. Task-level Dependencies override the phase Dependencies for that task; they are not accumulated automatically. Do not rely on an empty dependency label to mean none. Keep phases dependency-ordered and task scope bounded. WBS bodies own linked IDs, tasks, and checks; progress does not add them. For a genuinely documentary/design-only task, the formal task declaration may add exactly one `Completion mode: planning-only.` field. This opt-in is not a phase default or a traceability exception: its own checks still need a named reviewer, a revision-scoped planning-closure disposition and linked documentary proof before progress can say `planning-complete`. Keep linked prospective runtime ATPs intact and unpassed.

### test-plan.md

```markdown
## Acceptance Scenario Catalogue

### ATP-DEMO-01: Inspect only the active tenant's item

Setup:

- Use synthetic items and separate scoped request contexts.

Procedure:

- Request the owned item, then request an item absent from the active tenant scope.

Expected result:

- The owned item is returned; the out-of-scope item is absent.

Minimum proof:

- Retain revision, environment, exact procedure, assertions, observed result, and redacted artifact location.

Traceability: `PRD-DEMO-01`, `SRS-DEMO-01`, `WBS-DEMO-10-01`.
```

Setup, Procedure, Expected result, Minimum proof, and Traceability must each be substantive. A valid heading alone does not make an executable scenario complete. Scenario definitions cannot live in an evidence example, commands list, or traceability matrix.

### progress.md

```markdown
## WBS Execution Register

| WBS ID           | Status        | Evidence                       | Next action                            |
| ---------------- | ------------- | ------------------------------ | -------------------------------------- |
| `WBS-DEMO-10-01` | `not-started` | None; execution has not begun. | Confirm the bounded execution dossier. |
```

Resolve columns by header names (`WBS ID` and `Status`), never fixed cell positions. Additional/reordered columns are allowed. Require one row for every formal WBS task when constructing the complete chart model. Preserve the established status vocabulary and explain blockers/waivers precisely. `planning-complete` is valid only for a task declaring `Completion mode: planning-only.` in its WBS body; it satisfies a predecessor dependency edge but does not grant successor execution approval, count as verified, or reduce the verified-based burndown remainder.

## Three gates, not one success signal

### 1. Planning authority audit

Verify the active root script first, then use:

```bash
npm run spec:check -- <suite>
# Explicit small-scope branch:
npm run spec:check -- <suite> --lightweight
```

The audit checks definition roles/uniqueness, exact references, declared PRD -> SRS -> WBS -> ATP associations, and local Markdown links. Scan non-evidence planning records, including optional ADR/runbook/rollout records. Evidence is not definition authority. Full mode requires the core owners; lightweight validates available owners/references/links and reports omissions rather than implying full-chain coverage. If `progress.md` is present, its WBS owner is still required; lightweight does not legalize references to absent definitions. A static pass cannot accept an ADR, clear a controlling TODO, establish source existence, or prove ATP execution.

### 2. Chart model and freshness

Only after complete supported README/WBS/ATP/progress inputs exist:

```bash
npm run spec:charts -- <suite>
npm run spec:charts:check -- <suite>
```

Charts validate the supported WBS/dependency/ATP/progress model and deterministic output freshness, not the entire authority audit. Regenerate both views after WBS, test-plan, progress, or README title/language changes. Chart labels, accessibility, and metadata follow README language. Neither chart creates dates, estimates, history, evidence, scope, or forecast authority.

For lightweight/incomplete legacy input, skip generation and state exactly which inputs are missing. Do not add fake ATP declarations, rewrite legacy business requirements, or promote statuses merely to make the chart model pass. If complete inputs exist, chart refresh applies regardless of whether the request is incremental or lightweight.

### 3. Human approval and observed proof

Review generation approval, explicit design approval, governing ADR status, execution dossier approval, controlling TODOs, and actual evidence separately. New planning does not establish `implementation-complete` or `verified`. Retained applicable ATP evidence must identify revision, environment, exact procedure, observed result, and redacted artifact before `verified` is defensible.

## Legacy gaps and failure handling

Preserve stable IDs and compatible legacy catalogue tables. Report missing/duplicate definitions, undeclared associations, unresolved links, incomplete chart inputs, and missing evidence as distinct failures. Correct syntax without changing business meaning only within approved maintenance scope. If a repair would introduce a requirement, contract, decision, or proof procedure, obtain planning approval before changing its owner. Never use matrices or evidence to silently backfill definitions.
