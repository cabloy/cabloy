---
name: cabloy-spec-execution
description: Use this skill whenever the user asks to implement, execute, deliver, verify, or close a task from an existing Cabloy suite specification, including requests such as “implement WBS-…”, “execute the approved phase”, “deliver the next spec task”, or “make the repo-specs plan real”. It coordinates one bounded WBS increment through the existing backend, frontend, and contract-loop skills, then records evidence-backed derived status. Require an explicit WBS task ID or a finite, explicitly approved phase; do not use it to invent requirements, resolve suite identity, replace cabloy-spec-generation, duplicate scaffold procedures, or perform unapproved destructive, deployment, or provider operations.
---

# Cabloy Spec Execution

Use this skill as the control plane for delivering an already-approved suite specification. It turns one bounded WBS item into an implementation, verification, evidence, and progress handoff without becoming a second product authority.

## Goals

1. detect the active Cabloy edition and repository state before making implementation or command assumptions;
2. select only an explicit, bounded, dependency-ready WBS increment;
3. preserve PRD, SRS, ADR, WBS, and test-plan authority while routing technical work to the existing specialist skills;
4. require scoped verification and durable redacted evidence before claiming `verified`;
5. leave a resumable status and next-proof handoff without silently advancing neighboring work.

Read these references before executing or substantially updating an increment:

- `references/execution-protocol.md` for discovery, dossier, gates, routing, and safe-operation boundaries;
- `references/status-and-evidence.md` for evidence retention, status transitions, supersession, and progress updates.

## Step 1: Detect repository and edition

From the active repository root, inspect:

1. `git rev-parse --show-toplevel`, `git status --short`, current `HEAD`, and the working-tree classification;
2. `__CABLOY_BASIC__` or `__CABLOY_START__`;
3. root `package.json` and `CLAUDE.md`;
4. the target `repo-specs/<suite>/` directory and relevant source/module topology.

Interpret the markers as follows:

- `__CABLOY_BASIC__` present: use Basic source, scripts, flavors, UI, and SSR facts only when observed;
- `__CABLOY_START__` present: resolve Start-specific scripts, flavor/site names, paths, UI, and SSR behavior from the active Start repository;
- neither present: stop before edition-specific execution and ask the user to confirm the repository context.

A PostToolUse hook or an automatic build is convenience assistance, not evidence that the task is synchronized or verified. The deterministic chart commands are `npm run spec:charts -- <suite>` and `npm run spec:charts:check -- <suite>`; they validate derived-view freshness, not implementation or ATP completion.

## Step 2: Require and classify the execution target

Require one of:

- an explicit WBS task identifier such as `WBS-ABC-20-01`;
- a finite phase whose included WBS tasks and closure boundary are explicitly named and approved.

Do not interpret “implement the suite”, “finish everything”, or “execute the next phase” as a sufficiently bounded target. Ask for the exact task or enumerate a finite candidate set and obtain approval before implementation.

Classify the target:

- **backend increment**: Vona module, bean, service, model, entity, DTO, validation, migration, or backend test;
- **frontend increment**: Zova page, component, route, model, metadata, SSR, or frontend test;
- **contract increment**: OpenAPI, DTO consumer, generated SDK/schema, reverse metadata handoff, or consumer-drift diagnosis;
- **verification/closure increment**: an ATP, evidence, phase closure, or release gate explicitly defined by the test plan;
- **authority change**: a requirement, contract, dependency, scope, or durable decision change. Stop and route this to `cabloy-spec-generation` or `cabloy-domain-planning` before execution.

If a task maps to a more specialized Cabloy skill such as `cabloy-master-detail`, `cabloy-resource-field-update`, or `cabloy-module-removal`, use that specialist rather than flattening its procedure into this skill.

## Step 3: Read the spec authority set

Read the suite records in this order:

1. `README.md` for identity, reading order, topology, and authority map;
2. `prd.md`, `srs.md`, and applicable accepted/proposed ADRs for product and technical authority;
3. `pdp-wbs.md` for the complete selected task, dependencies, source areas, exclusions, completion checks, and linked IDs;
4. `test-plan.md` for linked `ATP-*` procedures, fixture/cleanup rules, evidence requirements, and release gates;
5. `progress.md` for current derived state, blockers, waivers, prior evidence, superseded proof, and next action;
6. linked evidence, phase indexes, presentation contracts, rollout records, or provider runbooks when referenced;
7. `implementation-gantt.svg` and `implementation-burndown.svg` as derived views; check their freshness rather than treating them as authority.

Do not trust the first status statement found in a historical record. Reconcile revision, chronology, supersession, and the authoritative current progress row before deciding readiness.

## Step 4: Build and confirm an execution dossier

Before implementation, present a concise dossier containing:

- detected edition, repository root, suite, target WBS ID/finite phase, current revision, and clean/dirty working-tree classification;
- linked `PRD-*`, `SRS-*`, `ATP-*`, ADR, and evidence records;
- dependencies and their actual status/proof;
- source-of-truth paths, proposed paths, ownership boundaries, and specialist skill route;
- applicable tenant, identity, authorization, ownership, lifecycle, transaction, concurrency, idempotency, audit, privacy, SSR, migration, and contract-loop constraints;
- exact scoped verification procedures and expected evidence;
- records permitted to change (`progress.md`, evidence/phase index, derived implementation charts, and only other records whose established convention requires it);
- remaining blockers, `TODO(confirm)` decisions, unsafe actions intentionally excluded, and one next action.

Keep observed repository facts separate from target contracts. Require explicit user confirmation of this dossier before making source changes, running meaningful verification, or writing evidence/status updates. Do not treat silence as approval.

## Step 5: Apply readiness gates

Stop and route back to the relevant planning authority if any of the following applies:

- the suite identity, ownership, or target boundary is unresolved;
- PRD/SRS/ADR/WBS/test-plan records contradict one another;
- a controlling `TODO(confirm)` or unaccepted ADR remains;
- a predecessor is not complete according to the WBS, or its required evidence is absent;
- the selected task is already `verified`, explicitly `deferred`, or currently `blocked`;
- a persisted field/schema change lacks an explicit decision about incrementing `vonaModule.fileVersion`;
- the working tree contains overlapping unclassified changes that make attribution or rollback unclear;
- authorization, tenant isolation, privacy, lifecycle, transaction, concurrency, idempotency, or ownership behavior is unspecified for a material risk;
- the requested work would expand scope or silently create a competing persistence, identity, or API authority.

A task may be marked `in-progress` only when approved execution actually starts. Do not edit progress merely to reserve a task.

## Step 6: Route the approved increment

After confirmation, route the smallest coherent implementation unit:

- Vona implementation -> `cabloy-backend-scaffold`;
- Zova implementation -> `cabloy-frontend-scaffold`;
- Vona/Zova contract synchronization, generated consumers, reverse metadata handoff, or stale consumer diagnosis -> `cabloy-contract-loop`;
- master-detail, resource-field, or module-removal shape -> the corresponding specialized skill;
- test-only/closure work -> follow the selected ATP and repository test ownership, without inventing a new test authority.

Keep the specialist’s CLI-first and follow-up rules. Never hand-edit generated consumers. Do not automatically implement adjacent WBS items, choose unconfirmed routes/flavors, change requirements, commit/push, or invoke the next phase.

## Step 7: Verify narrowly, then expand as required

Start with the narrowest meaningful check for the selected task, then follow the linked ATP and release-gate requirements. Use only commands observed in the active repository and approved by the dossier.

For contract-sensitive work:

- forward chain: establish backend contract truth, inspect OpenAPI, regenerate Zova consumers, then perform thin frontend follow-up;
- reverse chain: build the affected Zova flavor with both SSR and REST outputs, then run `npm run deps:vona`; build Web and Admin pairs when both are affected;
- if generated artifacts are correct but installed Vona consumers remain stale, diagnose local dependency drift through `cabloy-contract-loop` rather than hand-patching generated files or reinstalling automatically.

For SSR-sensitive work, verify server output and hydration-time initial render equivalence, privacy/admission behavior, and the exact active flavor/site contract. For backend tests, preserve separate `mockCtx(...)` boundaries for competing operations, explicit contention assertions, precise `finally` cleanup, and read-only managed seed behavior.

A planned command, successful generation, code reading, manual walkthrough, screenshot, or unrelated broad test pass is not sufficient for `verified` unless the test plan explicitly defines it as adequate retained proof.

## Step 8: Record evidence and derived status

Record actual observed proof according to `references/status-and-evidence.md`. Prefer dedicated phase/ATP evidence records when the suite convention supports them; otherwise preserve the suite’s established inline test-plan convention. Update evidence first, then the derived progress register, and regenerate/check both implementation charts last. Use `npm run spec:charts -- <suite>` followed by `npm run spec:charts:check -- <suite>`; chart output remains derived and cannot repair an authority conflict.

Set status accurately:

- `in-progress` while work or verification remains open;
- `implementation-complete` when source work is complete but ATP/release proof remains;
- `verified` only after all applicable WBS checks and ATPs have durable linked redacted evidence;
- `blocked`, `waived`, or `deferred` only with the required details.

Do not create empty evidence records, fabricate `EVD-*` IDs, erase historical failures, or claim that a hook/build means verification passed. If changed source or authority invalidates old proof, mark it superseded or requiring rerun.

## Step 9: Finish with a resumable handoff

Report:

1. target WBS/phase and detected edition;
2. implementation files and commands actually changed/run;
3. observed result and evidence locations, with secrets and sensitive data redacted;
4. resulting status and the precise reason for it;
5. blockers, decisions, or evidence still outstanding;
6. one next proof/action only;
7. refreshed `implementation-gantt.svg` and `implementation-burndown.svg`, README-derived chart language, and the chart check result.

Do not automatically modify the next WBS item or claim release closure from feature-level verification.

## Prohibited autonomous operations

Unless a separate explicit workflow and confirmation authorizes them, do not:

- run `npm run init`;
- reset or recreate a database;
- deploy, publish, cut over, or perform production/provider/webhook operations;
- change credentials or retain secrets/raw tokens/signed callback state/live provider identifiers;
- clean, reset, stash, checkout, or discard the working tree;
- reinstall dependencies as a first response to drift;
- scaffold broad source outside the approved WBS boundary;
- commit or push;
- mark implementation or verification complete without observed, traceable proof.
