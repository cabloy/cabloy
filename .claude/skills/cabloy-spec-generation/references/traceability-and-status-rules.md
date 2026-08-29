# Traceability and Status Rules

These rules protect the distinction between planning authority, delivery sequencing, executable proof, and derived status.

## Identifier conventions

Choose one concise domain prefix and use it consistently:

```text
PRD-<DOMAIN>-<CAPABILITY>-01
SRS-<DOMAIN>-<CAPABILITY>-01
WBS-<DOMAIN>-<PHASE>-01
ATP-<DOMAIN>-<CAPABILITY>-01
EVD-<DOMAIN>-<CAPABILITY>-01   # only after evidence is observed
```

A shorter `PRD-<DOMAIN>-01` / `SRS-<DOMAIN>-01` form is acceptable for a small capability. IDs must be stable: do not renumber existing records merely to make a table look tidy. If an existing suite already has a convention, preserve it.

## Identifier registry and reference validation

Before reporting a generated baseline or an authority update complete, build a temporary registry. Collect formal definitions from their owning documents (`prd.md`, `srs.md`, `pdp-wbs.md`, and `test-plan.md`) and scan every generated non-evidence Markdown record for references, including core records, `decisions/*.md`, presentation/rollout records, phase indexes, and `runbooks/*.md`.

- A **formal definition** is one atomic requirement, contract, WBS task, or ATP scenario declaration in its owning document. A prose mention, matrix cell, evidence-record format example, range, wildcard, template placeholder such as `<DOMAIN>`, or generic ellipsis is not a definition.
- A **concrete reference** names one complete instantiated ID, such as `SRS-<DOMAIN>-CAT-01` or `ATP-<DOMAIN>-CON-01`. It must resolve to exactly one formal definition in its owning document. Do not create duplicate definitions or dangling concrete references.
- A wildcard or range, such as `SRS-<DOMAIN>-CAT-*` or `ATP-<DOMAIN>-01`–`03`, is aggregation notation only. It may summarize already-defined records, but cannot define them or satisfy an exact reference/traceability requirement.
- Preserve an existing suite's ID convention when extending it. For a new baseline, use the chosen convention consistently across definitions and references.
- Report missing owners, duplicate definitions, and orphaned material definitions separately; correct the authoritative records before completion.
- Validate the canonical PRD -> SRS -> WBS -> ATP chain by exact defined IDs, while allowing a many-to-many relationship where the matrices make it explicit.
- This static audit covers generated planning records only. Exclude `evidence/`: evidence is created after observed execution and cannot establish or repair planning authority.
- Generated implementation charts must contain only formal WBS/ATP identifiers and current progress statuses; run `npm run spec:charts:check -- <suite>` after generation to verify freshness and reconciliation.

## Canonical chain

Maintain this chain across the core records:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

Minimum cardinality for a material in-scope requirement:

- one PRD requirement;
- at least one SRS contract;
- at least one WBS task;
- at least one ATP scenario;
- zero evidence records before execution, and at least one retained evidence record before `verified`.

A single ATP may prove several related requirements, but the matrices must make the relationship explicit. A WBS item may cover several contracts, but it still needs bounded completion checks.

## Authority-first updates

When a requirement or durable boundary changes:

1. update the authoritative PRD, SRS, or ADR first;
2. update traceability matrices;
3. update WBS dependencies and completion checks;
4. update ATP procedures and expected proof;
5. update progress and evidence pointers;
6. reassess prior evidence and statuses whose assumptions changed;
7. regenerate `implementation-gantt.svg` and `implementation-burndown.svg` with `npm run spec:charts -- <suite>`;
8. run `npm run spec:charts:check -- <suite>` and reconcile generated WBS/ATP/status references.

Downstream records summarize or operationalize authority; they do not silently override it. The SVGs are derived views only: they cannot authorize scope, dependencies, dates, evidence, or status. Their language follows the suite `README.md`.

## Status semantics

| Status | Meaning |
| --- | --- |
| `not-started` | Defined, but implementation or acceptance evidence has not started. |
| `in-progress` | Work or verification has started, but closure checks are incomplete. |
| `implementation-complete` | Source work is reported complete, but required ATP or release evidence is incomplete. |
| `verified` | Applicable WBS checks and ATPs passed, and durable evidence contains revision, environment, exact procedure, result, and redacted artifact location. |
| `blocked` | A failed gate, dependency, or unresolved decision prevents closure. |
| `waived` | A temporary exception explicitly approved with owner, reason, and expiry. |
| `deferred` | Explicitly postponed scope; it is not complete or verified. |

For a newly created plan, initialize delivery rows as `not-started`, `deferred`, or `blocked` as appropriate. Creating Markdown files never makes implementation `implementation-complete` or `verified`.

### README and ADR decision-status consistency

Keep the status domain explicit:

- **Observed current-source facts** are repository facts that have been inspected and cited.
- **Confirmed inputs** are values explicitly supplied or confirmed by the user.
- **Proposed targets** and durable boundaries remain proposed while their governing ADR is `Proposed`.
- **Accepted durable decisions** require explicit confirmation and an `Accepted` governing ADR.

A README may summarize observed facts and confirmed inputs, but it must not label a proposed target baseline, topology, scope boundary, or durable decision as `Confirmed` or `Accepted` while its governing ADR remains `Proposed`. Use neutral wording such as “Product and Technical Baseline,” and label individual entries by their actual state. The ADR remains authoritative; a README summary never upgrades its status.

## Evidence requirements

A retained evidence entry should include:

- linked PRD, SRS, WBS, and ATP IDs;
- source revision or commit;
- database, environment, and flavor/site when relevant;
- exact command, API procedure, or browser procedure;
- fixture and explicit concurrency interleaving when relevant;
- observed pass/fail result;
- durable log, response, screenshot, CI job, or artifact path;
- redaction statement and any waiver metadata.

Evidence must be synthetic or redacted. Never retain credentials, raw tokens, signed callback state, secrets, live provider identifiers, or real customer/payment data merely to prove a scenario.

A planned command is not a result. A code reading, design review, manual walkthrough, or single screenshot is not by itself sufficient for `verified` unless the applicable test plan explicitly defines it as adequate proof and the result is retained.

## Waivers

Every temporary waiver names:

- owner;
- reason;
- affected requirement/ATP/WBS;
- expiry date or time;
- compensating control, when relevant.

An expired waiver automatically becomes a release blocker. Do not hide an unresolved waiver in prose.

## Initial-plan safeguards

Do not:

- write `passed`, `verified`, `implemented`, or a fabricated evidence ID without an observed result;
- copy example-suite module names, API paths, test counts, CI links, or state assertions into a new domain;
- claim that a source path, API, flavor, generator, migration, test, build, or browser flow exists when it was not inspected;
- create empty evidence records just to make the traceability chain appear complete;
- mark progress `implementation-complete` because the planning set was generated;
- place a new requirement only in `progress.md`;
- reference an exact SRS or ATP ID that has no formal definition in `srs.md` or `test-plan.md`;
- use a wildcard, range, prose mention, or evidence-format example as if it defined an atomic PRD, SRS, WBS, or ATP record;
- describe a proposed target or durable boundary as confirmed/accepted in README while its governing ADR remains `Proposed`;
- let an optional presentation matrix, runbook, or rollout record redefine PRD/SRS authority;
- introduce OpenSpec or another parallel authority by duplicating these records without a repository-level decision defining ownership, migration, history, traceability, and duplicate-prevention rules.

If a fact is unknown, write `TODO(confirm)` or a neutral placeholder and put the decision gate in the ADR, SRS, WBS, or progress register according to its authority.
