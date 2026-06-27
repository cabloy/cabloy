# Master-Detail Source Reading Map

This page is a practical source-reading companion for one narrow backend question:

> if my question is no longer “how do I use the master-detail workflow?” but “which files prove the current master-detail, nested-detail, and standalone-capable detail behavior?”, where should I read first, and in what order?

Use this page together with:

- [Master-Detail Workflow](/backend/master-detail-workflow)
- [Relations Guide](/backend/relations-guide)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)

> [!TIP]
> **Master-detail reading path**
>
> 1. **[Master-Detail Workflow](/backend/master-detail-workflow)** — understand the public workflow and DTO rules
> 2. **[Master-Detail Source Reading Map](/backend/master-detail-source-reading-map)** — trace the generator and specimen evidence
>
> **You are here:** step 2.

## Why this page exists

The current public docs already explain the basic master-detail workflow.

What was still missing was one file-order map that proves the current implementation across:

- generator behavior
- first-level master-detail specimen
- second-level nested-detail specimen
- the boundary between aggregate-owned detail DTOs and standalone child-resource surfaces

This page fills that gap.

It is a source-order map for the current implementation, not another broad CRUD or relation concept page.

## How to use this page

Use this rule of thumb:

1. start with the workflow page first
2. read the generator entrypoints to understand what the scaffold promises
3. read the specimen files in parent-to-child order
4. stop once the behavior is clear instead of rereading the whole suite
5. hand off to fullstack contract-loop docs only when the question becomes frontend generation or consumer drift

## The shortest accurate mental model

A practical master-detail implementation path looks like this:

1. `:tools:masterDetail` receives the master/detail module and resource arguments
2. the generator normalizes detail DTO names, relation names, FK names, and detail mode
3. the generator ensures the detail module/resource shape exists
4. it patches the detail entity/meta side
5. it renders nested detail DTOs into the parent DTO folder
6. it patches the master model/service/DTO/locales
7. it refreshes metadata for both the detail module and the master module
8. the specimen modules then demonstrate how the same pattern can repeat recursively for nested-detail

That means the source-reading branch is not only “follow one CRUD module.”

It starts from the generator, then confirms the shape in real specimen modules.

## Generator entrypoints

Start here:

1. `vona/packages-cli/cli-set-api/src/lib/command/tools.masterDetail.ts`
2. `vona/packages-cli/cli-set-api/src/lib/bean/cli.tools.masterDetail.ts`

Read the command definition first when the question is:

- what CLI shape is officially supported?
- what arguments are part of the public workflow?

Read `cli.tools.masterDetail.ts` first when the question is:

- how are `detailMode`, relation names, FK names, and detail DTO names normalized?
- what exactly gets scaffolded or patched?
- how does the generator distinguish aggregate-only detail from standalone-capable detail?

## What `cli.tools.masterDetail.ts` actually patches

The main execution path is:

1. `_prepareArgv`
2. `_ensureDetailModule`
3. `_ensureDetailResourceShape`
4. `_patchDetailModule`
5. `_renderMasterDetailDtos`
6. `_patchMasterModule`
7. `_refreshMetadata`

A practical reading of the responsibilities is:

- `_prepareArgv`
  - defaults and validates `detailMode`
  - derives `relationName`, `fk`, and the nested detail DTO names
  - confirms the `detail*` naming convention comes from the generator itself
- `_ensureDetailResourceShape`
  - ensures the detail resource core exists
  - branches into aggregate vs standalone handling
- `_handleAggregateDetailMode`
  - refuses to silently collapse an existing standalone detail surface into aggregate-only mode
  - removes generated standalone controller/service/DTO files when aggregate-only shape is intended
- `_handleStandaloneDetailMode`
  - requires the standalone detail surface to remain present
- `_patchDetailModule`
  - adds the FK field and schema/index support on the detail side
- `_renderMasterDetailDtos`
  - emits `detail*` DTO files into the master module `src/dto` folder
- `_patchMasterDto`
  - patches `Create` / `Update` / `View` DTOs so the parent DTOs consume the sibling nested detail DTOs
- `_refreshMetadata`
  - regenerates `.metadata/index.ts` for both modules so the nested detail DTOs appear in generated contract surfaces

## First-level specimen: `training-student -> training-record`

Use this order:

1. `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
2. `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
3. `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`
4. `vona/src/suite/a-training/modules/training-student/src/dto/studentUpdate.tsx`
5. `vona/src/suite/a-training/modules/training-student/src/dto/studentView.tsx`
6. `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordBase.tsx`
7. `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordMutate.tsx`
8. `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordResItem.tsx`
9. `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordView.tsx`
10. `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`
11. `vona/src/suite/a-training/modules/training-record/src/entity/record.tsx`

What this sequence clarifies:

- `student.ts` shows the `hasMany('training-record:record', 'studentId', ...)` ownership relation
- `service/student.ts` shows the nested include lifecycle for create/view/update/delete
- `studentCreate.tsx`, `studentUpdate.tsx`, and `studentView.tsx` show the parent DTOs consuming sibling nested detail DTOs
- `detailRecord*.tsx` shows the `detail*` naming convention for first-level nested detail DTOs
- `.metadata/index.ts` confirms those nested detail DTOs are part of the generated contract registry
- `entity/record.tsx` shows the detail-side FK persistence field that closes the aggregate thread

## Second-level specimen: `training-record -> training-recordsubject`

Use this order:

1. `vona/src/suite/a-training/modules/training-record/src/model/record.ts`
2. `vona/src/suite/a-training/modules/training-record/src/service/record.ts`
3. `vona/src/suite/a-training/modules/training-record/src/dto/recordCreate.tsx`
4. `vona/src/suite/a-training/modules/training-record/src/dto/recordUpdate.tsx`
5. `vona/src/suite/a-training/modules/training-record/src/dto/recordView.tsx`
6. `vona/src/suite/a-training/modules/training-record/src/dto/detailRecordSubjectBase.tsx`
7. `vona/src/suite/a-training/modules/training-record/src/dto/detailRecordSubjectMutate.tsx`
8. `vona/src/suite/a-training/modules/training-record/src/dto/detailRecordSubjectResItem.tsx`
9. `vona/src/suite/a-training/modules/training-record/src/dto/detailRecordSubjectView.tsx`
10. `vona/src/suite/a-training/modules/training-record/src/.metadata/index.ts`

What this sequence clarifies:

- `record.ts` shows that `record` is itself a parent through `trainingRecordSubjects: $relation.hasMany(...)`
- `service/record.ts` shows the include lifecycle for the second-level nested detail collection
- `recordCreate.tsx`, `recordUpdate.tsx`, and `recordView.tsx` show the immediate parent consuming sibling `detailRecordSubject*` DTOs
- `detailRecordSubject*.tsx` proves the recursive `detail*` naming rule
- `.metadata/index.ts` confirms second-level nested detail DTOs are also exported into generated contract surfaces

The key point is that this is not a separate mechanism.

It is the same master-detail pattern repeated one level lower.

## Standalone child surface vs nested detail surface

This is the boundary most worth reading carefully.

The `training-record` module proves that a detail can keep its own standalone resource surface while still participating as a nested detail under `student`.

Read these files for the standalone-capable detail surface:

- `vona/src/suite/a-training/modules/training-record/src/service/record.ts`
- `vona/src/suite/a-training/modules/training-record/src/dto/recordCreate.tsx`
- `vona/src/suite/a-training/modules/training-record/src/dto/recordUpdate.tsx`
- `vona/src/suite/a-training/modules/training-record/src/dto/recordView.tsx`

Then compare that with the nested detail DTOs that live in the parent module:

- `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordBase.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordMutate.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordResItem.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordView.tsx`

That comparison shows the intended split:

- nested detail DTOs use `detail*` names in the parent module because they describe the child in its parent-owned detail role
- standalone child CRUD uses ordinary resource DTO names in the child module because it describes the child as its own resource surface

For `training-recordsubject`, the current source tree also helps prove the aggregate-only boundary.

Observed source state:

- `vona/src/suite/a-training/modules/training-recordsubject/src/` currently contains entity/model/meta files
- it does **not** currently contain `src/controller/`, `src/service/`, or `src/dto/`
- the compiled `dist/` tree still contains prior standalone declarations such as `dist/dto/subjectCreate.d.ts`

A practical interpretation is:

- source-level authoring for `training-recordsubject` is currently aggregate-oriented
- nested second-level detail authoring lives in the parent `training-record` module through `detailRecordSubject*`
- compiled artifacts alone should not be treated as the canonical source of truth when the source tree shows the current aggregate-only shape

## Frontend/runtime touchpoints

If your next question becomes “how does this nested detail DTO shape connect to actual detail UI/runtime behavior?”, read these areas next:

- `zova/src/suite/cabloy-basic/modules/basic-details/`
- `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/detail/`

Use them to confirm:

- nested detail fields are rendered through `basic-details`
- detail lists/rows/actions have a concrete runtime contract
- the backend DTO and metadata shape feeds a real frontend detail workflow rather than remaining only a backend convention

## Suggested reading order for future source analysis

Use this order when you want the shortest reliable path:

1. `vona/packages-cli/cli-set-api/src/lib/command/tools.masterDetail.ts`
2. `vona/packages-cli/cli-set-api/src/lib/bean/cli.tools.masterDetail.ts`
3. `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
4. `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
5. `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`
6. `vona/src/suite/a-training/modules/training-student/src/dto/studentUpdate.tsx`
7. `vona/src/suite/a-training/modules/training-student/src/dto/studentView.tsx`
8. `vona/src/suite/a-training/modules/training-record/src/model/record.ts`
9. `vona/src/suite/a-training/modules/training-record/src/service/record.ts`
10. `vona/src/suite/a-training/modules/training-record/src/dto/recordCreate.tsx`
11. `vona/src/suite/a-training/modules/training-record/src/dto/recordUpdate.tsx`
12. `vona/src/suite/a-training/modules/training-record/src/dto/recordView.tsx`
13. both module `.metadata/index.ts` files
14. frontend `basic-details` and `a-openapi` detail runtime types if the question crosses into UI/runtime behavior

## Where to read next

- If you need the public workflow and naming/placement rules, return to [Master-Detail Workflow](/backend/master-detail-workflow).
- If you need broader ORM relation semantics, continue with [Relations Guide](/backend/relations-guide).
- If you want one concrete backend module wiring page before returning to detail-specific reading, continue with [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain).
- If the next question becomes frontend consumer generation or backend/frontend drift, continue with [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Final takeaway

The cleanest way to read the current master-detail implementation is not to stay only at the workflow level and not to read every file in the suite.

Start from the CLI entrypoint, confirm what the generator promises, trace the first-level specimen, then trace the recursive second-level specimen.

That path is enough to prove the three current capabilities:

- master-detail
- nested-detail
- a detail resource that can remain aggregate-owned only or also keep its own standalone resource surface
