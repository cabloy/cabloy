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

Then inspect the root `package.json`, `CLAUDE.md`, the suite spec directory, and actual affected source paths. Classify the worktree as clean, dirty with unrelated changes, dirty with overlapping changes, or otherwise unknown. Do not clean or reset it to make execution easier.

For Basic, resolve current scripts, sites, flavors, UI, and generated paths from the active repository. For Start, inspect the active Start repository and use its own commands and flavor/site names. The shared execution model does not make edition-specific runtime facts interchangeable.

## 2. Target selection

The normal unit of work is one WBS item. A phase may be selected only when the phase is a finite, explicitly approved batch and the WBS defines its task set and closure boundary.

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
6. linked evidence, phase indexes, runbooks, presentation contracts, and rollout records.

Before implementation, verify:

- the WBS target exists and is bounded;
- every material linked requirement has a technical contract and ATP;
- predecessor status satisfies the WBS dependency rule and required evidence exists;
- no controlling `TODO(confirm)`, unaccepted ADR, waiver, or failed gate remains unresolved;
- the selected task is not already `verified`, `deferred`, or `blocked`;
- source ownership and the target API/state/page boundary are unambiguous;
- current evidence is still valid for the current source revision and authority set;
- dirty-worktree changes can be attributed without overwriting unrelated work;
- tenant, identity, authorization, ownership, privacy, lifecycle, transaction, concurrency, idempotency, audit, and recovery constraints are defined for the task’s risk;
- the requested change does not broaden scope or create a competing persistence, identity, or API authority.

When authority records conflict, stop. Update the authoritative PRD, SRS, or ADR through `cabloy-spec-generation`, then propagate the change through WBS, ATP, evidence assumptions, and progress. Do not reconcile a conflict by silently editing a downstream status or implementation plan.

## 4. Special gates

### Persisted schema and file version

If implementation may add or alter a persisted field, table, relation, index, or `meta.version.ts` path, ask before editing whether `vonaModule.fileVersion` should increment. Do not infer the answer from neighboring modules. If `meta.version.ts` changes, the repository rule requires `npm run test` after the change; include this in the dossier and evidence plan.

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
Evidence: <required revision/environment/procedure/result/redacted artifact>
Allowed record updates: <evidence/phase index/progress, or explicitly named authority change>
Blocked or unresolved: <TODOs, waivers, conflicts>
Excluded operations: <init/reset/deploy/provider/etc.>
Next action: <one action after confirmation>
```

Require explicit confirmation. If the user changes scope, rebuild the dossier and re-check dependencies and authority. A prior confirmation does not authorize a new task, phase, provider operation, or destructive command.

## 6. Specialist routing

| Task shape | Primary route | Coordinator must preserve |
| --- | --- | --- |
| Vona module/bean/service/model/entity/DTO/validation/migration/test | `cabloy-backend-scaffold` | CLI-first generation, tenant/security review, migration/index/version gate, tests, OpenAPI impact |
| Zova page/component/route/model/metadata/SSR/test | `cabloy-frontend-scaffold` | route metadata, state ownership, hydration equivalence, emitted import suffixes, flavor/site proof |
| OpenAPI, SDK/schema, generated consumer, reverse metadata, stale consumer | `cabloy-contract-loop` | source-first direction, paired SSR/REST reverse build, `deps:vona`, no hand edits |
| master-detail, resource-field, module removal | corresponding specialist skill | specialized ownership and cleanup order |
| requirement, architecture, scope, identity, or authority change | `cabloy-spec-generation` / `cabloy-domain-planning` | no implementation around unresolved authority |

The coordinator may pass the dossier to the specialist; it should not duplicate the specialist’s detailed command tree.

## 7. Verification and stopping

Start with the narrowest meaningful check, then execute linked ATP procedures and only the required release gates. Explicitly preserve test-owned fixture cleanup, separate `mockCtx(...)` boundaries for competing Vona operations, synthetic/redacted data, and the test plan’s database/flavor requirements.

Stop and report rather than guessing when:

- a command or path is not observed in the active repository;
- a test fails or a required artifact is missing;
- the working tree becomes attribution-ambiguous;
- a specialist discovers a requirement or contract change;
- a planned external/destructive operation is needed;
- a prior evidence record is invalidated by source or authority changes.

A failed verification creates an accurate blocker only when the observed result is recorded; otherwise the task remains unexecuted or in-progress according to actual activity. Do not claim a phase or release is closed because one feature ATP passed.
