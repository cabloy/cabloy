# Playbook: Plan a Cabloy Suite Specification

Use this playbook to create or maintain the repository-native planning record for a long-lived Cabloy business suite. It explains the public workflow behind the `cabloy-spec-generation` skill without replacing the skill's detailed decision tree.

A specification establishes product intent, technical contracts, delivery structure, acceptance procedures, and decision history. It does **not** prove that implementation, generated artifacts, tests, or acceptance evidence already exist.

## When to use this playbook

Use `cabloy-spec-generation` when you need to:

- establish a new suite's PRD, SRS, WBS, test plan, progress register, and initial ADR
- extend an existing suite's authoritative planning records
- turn product intent into traceable delivery and acceptance records
- prepare an approved handoff for implementation

Use a different workflow when:

- provider, suite, or module identity is unresolved — use `cabloy-domain-planning`
- the task is approved backend or frontend scaffolding — use `cabloy-backend-scaffold` or `cabloy-frontend-scaffold`
- the task is Vona/Zova contract synchronization or generated-consumer drift — use `cabloy-contract-loop`
- the task is one already approved, bounded WBS increment — use [Playbook: Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution)

## Start with repository and edition discovery

Before naming a suite, describing source topology, or recommending a site, flavor, UI, SSR, or command path:

1. inspect the active repository root and edition marker
2. inspect the root `package.json`, `CLAUDE.md`, relevant CLI entrypoints, and existing suite records
3. separate observed source facts from confirmed user inputs, proposed targets, and `TODO(confirm from active source)` items

Cabloy Basic and Cabloy Start share the planning model, but their runtime details can differ. Do not carry a Basic command, site identifier, flavor, UI assumption, or generated-output path into Start without confirming it in the active Start source.

Read [Edition Detection for AI Workflows](/ai/edition-detection), [Repo Guidance](/ai/repo-guidance), [Repo Scripts](/reference/repo-scripts), and [Package Map](/reference/package-map) before making repository-specific claims.

## Classify the planning request

### New suite baseline

A long-lived business domain normally receives the complete planning baseline under `repo-specs/<suite>/`. The specification should be suite-first, name capability modules by business responsibility, and avoid inventing a competing persistence, identity, or authorization owner.

### Existing suite extension

Read the existing README and authority map first. Update the owning PRD, SRS, or ADR before downstream WBS, test-plan, progress, or evidence references. Preserve existing identifiers, accepted decisions, history, and evidence conventions rather than replacing them with a fresh parallel record.

### Proportionate planning

A disposable demo, tutorial, or isolated utility can use a smaller record only when the requester explicitly selects that scope. Do not reduce the planning baseline for a domain expected to grow merely because its first increment is small.

### Unresolved identity

Stop before creating a planning directory when the provider, suite, or capability boundary is unclear. Route the identity decision to `cabloy-domain-planning` rather than creating a competing suite hierarchy.

## Keep the authority chain explicit

Repository-native traceability flows in one direction:

```text
PRD requirement → SRS contract → PDP/WBS task → ATP scenario → observed evidence
```

Each record has a distinct role:

| Record                 | Authority                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `README.md`            | Index, reading order, topology summary, and authority map                                                 |
| `prd.md`               | Product outcomes, personas, scope, journeys, business rules, and launch criteria                          |
| `srs.md`               | Technical contracts, ownership, data, tenant, authorization, lifecycle, API, and nonfunctional boundaries |
| `pdp-wbs.md`           | Dependency order, bounded delivery tasks, completion checks, and contract-loop checkpoints                |
| `test-plan.md`         | Formal ATP scenarios, procedures, fixtures, expected proof, and release gates                             |
| `decisions/*.md`       | Durable suite decisions and their alternatives, consequences, and gates                                   |
| Evidence records       | Observed, redacted proof only                                                                             |
| `progress.md`          | Derived execution status, blockers, evidence links, and next proof                                        |
| `implementation-*.svg` | Deterministic derived views of planning and progress records                                              |

Update the upstream owner before downstream records. For example, a product or technical change belongs in the PRD, SRS, or ADR first; it is then traced into WBS tasks, ATP procedures, progress implications, and derived charts.

A proposed ADR is not an accepted decision. Progress cannot introduce a new requirement, contract, or durable boundary, and a chart cannot repair an authority conflict.

## Build the planning baseline after confirmation

For a new long-lived suite, the normal core set is:

```text
repo-specs/<suite>/
├── README.md
├── prd.md
├── srs.md
├── pdp-wbs.md
├── test-plan.md
├── progress.md
├── implementation-gantt.svg
├── implementation-burndown.svg
└── decisions/
    └── 0001-*.md
```

Add presentation contracts, staged rollout records, runbooks, additional ADRs, or an `evidence/` directory only when their scope is justified. Do not create empty evidence records to imply that testing or delivery has begun.

Before creating or replacing records, explicitly confirm at least:

- repository, edition, suite identity, and target directory
- intended product outcome, audiences, in-scope capabilities, and deferred scope
- confirmed and unresolved tenant, authorization, privacy, ownership, lifecycle, migration, and integration constraints
- site strategy at the level actually supported by current source and confirmed inputs
- required core documents and justified optional records
- unresolved decision gates and which WBS branches they block
- the initial delivery-status policy

Silence is not approval. Confirmation to generate records does not accept a durable ADR; retain an unaccepted decision as proposed. Initial delivery rows are normally `not-started`, `deferred`, or explicitly `blocked` unless actual prior evidence was intentionally carried forward.

## Preserve traceability and status integrity

Use stable identifiers such as `PRD-*`, `SRS-*`, `WBS-*`, and `ATP-*`. Every referenced exact identifier must resolve to a formal definition in its owning document; a range, wildcard, or prose summary is not a substitute.

The status vocabulary is:

- `not-started`
- `in-progress`
- `implementation-complete`
- `verified`
- `blocked`
- `waived`
- `deferred`

`verified` requires retained, redacted, traceable observed proof. A planning record, a planned command, a generated scaffold, a screenshot, or an unrelated broad check does not automatically provide that proof.

## Generate and check derived charts

For a new or substantially revised long-lived specification set whose authoritative Markdown follows the [chart input contract](/reference/repo-scripts#chart-input-contract), refresh the two derived views after changing the README title or language, WBS, test plan, or progress register:

```bash
npm run spec:charts -- <suite>
# Use this non-mutating check when verifying an existing chart state:
npm run spec:charts:check -- <suite>
```

The generator consumes the suite README, WBS, test plan, and progress register. It emits `implementation-gantt.svg` and `implementation-burndown.svg`; visible chart language follows the suite README. After refreshing charts, use the check when a separate freshness verification is needed, such as CI or a non-mutating review.

The check validates the supported chart input contract and generated-view freshness. It does **not** implement a WBS task, run an ATP, establish evidence, prove acceptance, or replace a review of traceability and status semantics. The charts are scope/order views, not schedule forecasts or a new status authority.

This current baseline does not require unchanged legacy suite records to be migrated solely to add charts. A legacy record that does not follow the chart input contract must not be treated as chart-compatible until a deliberate record-format normalization aligns its authoritative Markdown. That normalization preserves existing planning authority and does not require an unrelated product or delivery change. Always confirm exact scripts and input expectations in the active repository before running or documenting them for another edition.

## Hand off work without implying implementation

Once the planning authority is coherent and implementation is approved, route the next task deliberately:

- unresolved domain identity or boundary → `cabloy-domain-planning`
- approved backend increment → `cabloy-backend-scaffold`
- approved frontend increment → `cabloy-frontend-scaffold`
- contract synchronization or generated-consumer drift → `cabloy-contract-loop`
- an approved bounded WBS increment → [Playbook: Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution)

Do not make code changes, run initialization or database-reset workflows, deploy, operate a provider, or claim implementation or verification merely because planning records now exist.

For the division of responsibility between public docs, skills, repository specs, and internal rationale, read [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping).
