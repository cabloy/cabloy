---
name: cabloy-master-detail
description: This skill should be used when the main Cabloy task is parent-owned detail aggregation: master-detail or nested-detail backend scaffolding, choosing aggregate-owned vs standalone-capable detail mode, running `:tools:masterDetail`, or preserving nested detail DTO naming and placement rules. Prefer it when the core problem is detail aggregation rather than ordinary standalone CRUD scaffolding or cross-stack contract drift.
---

# Cabloy Master-Detail

Use this skill when the user wants to add, extend, analyze, or preserve a Cabloy master-detail or nested-detail backend workflow.

Read the public [Master-Detail Workflow](../../../repo-docs/backend/master-detail-workflow.md) for the canonical operational explanation and [Master-Detail Source Reading Map](../../../repo-docs/backend/master-detail-source-reading-map.md) for the current source evidence. This skill is the thinner orchestration layer: it should classify the detail shape, choose the generator-first path, preserve the naming and placement invariants, and finish with the right verification path.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. classify the request as first-level master-detail, recursive nested-detail, aggregate-only detail, standalone-capable detail, or docs/source-reading only
3. prefer `npm run vona :tools:masterDetail` over manual scaffolding when the task is really generator-oriented
4. preserve nested detail DTO naming and placement invariants
5. keep aggregate vs standalone detail mode explicit
6. finish with verification guidance that matches the actual detail shape

## Step 1: Detect repo, edition, and task shape

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect nearby scripts and ask before making edition-specific assumptions

Then classify the request into one of these entry shapes.

### Shape A: first-level master-detail

Use this shape when the user wants a master resource to own one detail collection, such as:

- `student -> trainingRecords`
- parent resource plus one nested child collection

### Shape B: recursive nested-detail

Use this shape when a detail resource itself becomes the immediate parent of another detail collection, such as:

- `student -> trainingRecords -> trainingRecordSubjects`

Treat this as the same master-detail pattern repeated one level lower, not as an unrelated mechanism.

### Shape C: aggregate-only detail

Use this shape when the detail should remain owned by the aggregate and should not keep a standalone controller/service/DTO resource surface in source.

### Shape D: standalone-capable detail

Use this shape when the detail must still participate in nested editing but also keep its own ordinary standalone resource surface.

### Shape E: docs or source-reading only

Use this shape when the user is not changing the scaffold but wants explanation, diagnosis, or source-reading guidance. In that case, anchor the answer in the two public master-detail docs instead of pretending the next step is generation.

## Step 2: Start from shared entrypoints and the generator

Inspect these surfaces before proposing implementation:

- the repository `package.json`
- `npm run vona`
- `vona/packages-cli/cli-set-api/src/lib/command/tools.masterDetail.ts`
- `vona/packages-cli/cli-set-api/src/lib/bean/cli.tools.masterDetail.ts`
- the two public master-detail docs

If the task is scaffold or generator oriented, prefer the generator path first.

Typical command shape:

- `npm run vona :tools:masterDetail resourceName -- [--module=] [--detailModule=] [--detailResourceName=] [--relationName=] [--fk=] [--detailMode=aggregate|standalone]`

Important rule:

- use canonical module relative names such as `training-student` and `training-record`
- do not substitute package names for module names

## Step 3: Preserve the current nested detail invariants

### Nested detail DTO naming

Keep nested detail DTOs on the `detail*` prefix so their role remains explicit.

Representative examples:

- `detailRecordBase`
- `detailRecordMutate`
- `detailRecordResItem`
- `detailRecordView`
- `detailRecordSubjectBase`
- `detailRecordSubjectMutate`
- `detailRecordSubjectResItem`
- `detailRecordSubjectView`

Do not rewrite these into ordinary child-resource CRUD names when the DTOs are really describing nested detail editing under a parent.

### Nested detail DTO placement

Keep nested detail DTOs beside the immediate parent DTOs that consume them.

That means:

- first-level detail DTOs live with the master DTOs
- second-level detail DTOs live with the first-level parent DTOs
- deeper levels repeat the same immediate-parent rule recursively

Do not move nested detail DTOs into the child module just because the child may also have its own standalone resource surface.

## Step 4: Distinguish aggregate vs standalone mode deliberately

### Aggregate mode

Use `--detailMode=aggregate` when the detail should remain aggregate-owned only.

Preserve the source-backed rule:

- aggregate mode removes or disallows standalone controller/service/DTO resource surfaces as appropriate

### Standalone mode

Use `--detailMode=standalone` when the detail must also keep its own ordinary resource surface.

Preserve the source-backed rule:

- standalone mode still uses nested `detail*` DTOs in the parent-owned editing flow
- standalone child CRUD in the child module can keep its ordinary resource DTO names

## Step 5: Inspect the specimen modules before manual follow-up edits

Use the current specimen chain as the strongest current reference path:

- `training-student`
- `training-record`
- `training-recordsubject`

Especially inspect:

- parent model relation wiring
- parent service include lifecycle
- parent create/update/view DTOs
- sibling nested detail DTO files
- child entity FK support
- generated `.metadata/index.ts` exports

Important rule:

- do not start from hand-patching DTO placement or relation semantics until the generator path and specimen shape have been checked first

## Step 6: Preserve the instance boundary across the aggregate

Master-detail ownership is separate from Vona's tenant/instance boundary:

- in the current tenancy model, a tenant corresponds to an instance and normal parent/detail model operations retain the active instance scope
- relation and foreign-key checks must preserve that scope; aggregate ownership does not authorize bypassing it
- treat a missing parent or detail from the normal scoped aggregate flow as absent; do not add unscoped existence probes merely to distinguish a foreign-instance row
- if a future multi-merchant design is needed, model merchant ownership explicitly within the instance in addition to the aggregate relation

For the canonical tenancy explanation, read [Multi-Instance and Instance Resolution](../../../repo-docs/backend/multi-instance-and-instance-resolution.md) and [Model Guide](../../../repo-docs/backend/model-guide.md).

## Step 7: Keep fullstack boundaries explicit

This skill is primarily for backend detail aggregation.

If the task later becomes a backend/frontend contract synchronization or stale generated consumer problem, the root `cabloy-contract-loop` skill may become the better primary workflow.

Use this skill first when the core problem is still:

- parent-owned detail aggregation
- nested detail recursion
- generator choice
- aggregate vs standalone detail mode
- nested detail DTO naming or placement in a scaffolding context

## Step 8: Verification guidance

Always finish with verification that matches the detail shape.

Typical checks include:

- confirm the parent model contains the expected `hasMany` relation
- confirm parent service create/view/update/delete includes the nested detail relation
- confirm parent create/update/view DTOs consume the nested detail DTOs
- confirm nested detail DTO names still follow the `detail*` pattern
- confirm nested detail DTOs are placed with the immediate parent DTOs that consume them
- confirm the recursive immediate-parent rule still holds for deeper nesting
- confirm the detail entity contains the FK field when expected
- confirm detail schema/index support is present
- confirm both modules’ `.metadata/index.ts` outputs reflect the expected nested detail DTOs
- if standalone mode applies, confirm the detail module still exposes its standalone resource surface
- if this workflow changes `meta.version.ts`, run `npm run test` so the test database is reinitialized and schema/data consistency issues surface early

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. detected detail shape
3. recommended generator-first path
4. aggregate vs standalone decision
5. nested DTO naming and placement reminders
6. verification steps

Keep the response practical. The value of this skill is to route master-detail requests into the correct generator-first workflow while preserving the recursive ownership rules encoded by the current source.