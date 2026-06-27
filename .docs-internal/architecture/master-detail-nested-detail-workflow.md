# Master-Detail and Nested-Detail Workflow

## Purpose

This note records the maintainer rationale and invariants behind the Cabloy master-detail and nested-detail workflow assets.

It exists to support:

- the public workflow doc in `cabloy-docs/backend/master-detail-workflow.md`
- the public source-reading companion in `cabloy-docs/backend/master-detail-source-reading-map.md`
- the reusable `cabloy-master-detail` skill in `.claude/skills/`
- future generator, scaffold, and workflow maintainers who need to preserve the same behavior

## Problem

Master-detail work is easy to misread as ordinary CRUD scaffolding.

In practice, the workflow carries several invariants that are easy to lose if AI systems or maintainers treat it as ad hoc file editing:

- a detail resource may be aggregate-owned only, or may also keep its own standalone resource surface
- nested-detail is not a separate mechanism; it is recursive reuse of the same immediate-parent pattern
- nested detail DTOs are not ordinary child-module CRUD DTOs
- DTO naming and DTO placement encode ownership semantics, not just style preferences
- generator behavior and specimen modules must stay aligned

If these boundaries drift, the usual failure modes are:

- treating the detail as unrelated CRUD
- losing the `detail*` DTO naming rule
- moving nested detail DTOs into the child module instead of keeping them with the parent DTOs that consume them
- collapsing aggregate-only and standalone-capable detail into one ambiguous shape
- trusting compiled `dist/` artifacts over the current source tree when diagnosing the real workflow shape

## Current specimen thread

The current repo demonstrates the workflow through this chain:

- `training-student` -> `training-record` -> `training-recordsubject`

A practical reading is:

- `student` is the master resource
- `record` is a first-level detail under `student`
- `subject` is a second-level detail under `record`
- `record` also demonstrates the case where a detail keeps its own standalone resource surface

The strongest generator entrypoints are:

- `vona/packages-cli/cli-set-api/src/lib/command/tools.masterDetail.ts` for the CLI command surface
- `vona/packages-cli/cli-set-api/src/lib/bean/cli.tools.masterDetail.ts` for the implementation flow

## Why the knowledge is split across three homes

The Cabloy AI-enablement model uses different homes for different audiences.

### Public docs

The public docs should explain:

- when to use the workflow
- how aggregate mode differs from standalone mode
- how nested-detail recurses from the immediate parent
- how nested detail DTO naming and placement work
- where to read current source evidence

This belongs in `cabloy-docs/` because both people and agents need the operational explanation.

### Skill

The skill should encode:

- edition detection
- generator-first routing
- aggregate vs standalone branching
- nested detail DTO naming and placement reminders
- verification checklists

This belongs in `.claude/skills/` because it is a reusable procedural workflow.

### Internal note

This note preserves:

- why the workflow is split this way
- what future generator or scaffold changes must preserve
- the most common failure modes
- the maintenance boundary between public docs, internal rationale, and skills

This belongs in `.docs-internal/` because it is maintainer-facing rationale, not the main public playbook.

## Canonical definitions

Use these terms consistently.

### Master

The resource that owns the aggregate lifecycle and the top-level nested editing flow.

### First-level detail

A resource edited as a nested collection under the master.

### Nested-detail

A detail resource that itself becomes the immediate parent of another detail collection.

### Aggregate-only detail

A detail resource that remains owned by the aggregate and does not keep a standalone controller/service/DTO resource surface in source.

### Standalone-capable detail

A detail resource that still participates in nested editing but also keeps its own ordinary standalone resource surface.

### Immediate parent

The DTO/model/service owner at the current nesting level.

This term matters because nested detail placement is recursive and always follows the immediate parent, not the deepest child module.

## Invariants to preserve

Future changes to this workflow should preserve these invariants.

1. prefer `npm run vona :tools:masterDetail` over hand wiring when the task is really master-detail scaffolding
2. keep `--module` and `--detailModule` on canonical module relative names such as `training-student` and `training-record`
3. keep nested detail DTO names on the `detail*` prefix so their role is explicit in source and generated contract surfaces
4. keep nested detail DTOs beside the parent DTOs that consume them
5. for second-level and deeper nesting, repeat the same immediate-parent placement rule recursively
6. preserve the distinction between aggregate-only detail and standalone-capable detail
7. preserve detail FK/schema/index support as part of the generated thread
8. preserve generator-driven metadata refresh for both the master module and the detail module
9. treat compiled artifacts as secondary evidence when current source shows the authoritative shape

## Practical source-backed meaning of the rules

### Generator-first workflow

The generator already encodes the real structure:

- argument normalization
- detail mode branching
- detail-side FK/meta patching
- parent-side nested detail DTO rendering
- master model/service/DTO patching
- metadata refresh

Do not replace this with a manual patch-first mental model unless source proves the generator cannot express the task.

### Nested detail DTO naming

The current specimen uses names such as:

- `detailRecordBase`
- `detailRecordMutate`
- `detailRecordResItem`
- `detailRecordView`
- `detailRecordSubjectBase`
- `detailRecordSubjectMutate`
- `detailRecordSubjectResItem`
- `detailRecordSubjectView`

This is not just cosmetic naming. It separates nested detail contract artifacts from ordinary standalone child-resource CRUD DTOs.

### Nested detail DTO placement

The current specimen keeps:

- `student*` DTOs together with `detailRecord*` in the `training-student` DTO folder
- `record*` DTOs together with `detailRecordSubject*` in the `training-record` DTO folder

That placement is the ownership signal.

Do not move nested detail DTOs into the child module just because the child may also have a standalone resource surface.

### Aggregate-only vs standalone-capable detail

The generator distinguishes two valid shapes:

- aggregate mode removes or disallows standalone resource surfaces as appropriate
- standalone mode preserves the child module’s ordinary standalone controller/service/DTO surface

Preserve this branch explicitly in docs, skills, and source.

## Recommended maintainer workflow

When changing generator or scaffold behavior for this area:

1. read `cabloy-docs/backend/master-detail-workflow.md`
2. read `cabloy-docs/backend/master-detail-source-reading-map.md`
3. inspect:
   - `vona/packages-cli/cli-set-api/src/lib/command/tools.masterDetail.ts`
   - `vona/packages-cli/cli-set-api/src/lib/bean/cli.tools.masterDetail.ts`
4. inspect the specimen chain:
   - `training-student`
   - `training-record`
   - `training-recordsubject`
5. change generator or scaffold behavior
6. re-check nested DTO naming, placement, and detail-mode branching
7. verify that the public docs and skill still tell the same story as the source

## Anti-patterns

Avoid these mistakes:

- do not duplicate the full public workflow doc in this internal note
- do not move the whole source-reading trail into the skill
- do not teach AI to patch nested DTO placement manually before checking the generator path
- do not treat a child module’s standalone CRUD surface as proof that nested detail DTOs belong in that child module
- do not let compiled `dist/` output override the current source tree when they disagree about the active source-authored workflow shape

## Verification guidance for workflow maintainers

When updating the master-detail workflow assets, re-check that:

- `npm run vona :tools:masterDetail` still exists and matches the documented workflow
- the current generator still produces or preserves the `detail*` DTO pattern
- specimen modules still prove first-level and recursive nested-detail behavior
- aggregate vs standalone mode behavior in source still matches docs and skill guidance
- the skill, public docs, and this internal note tell one consistent story
- no new generator behavior is documented in one knowledge home but missing from the others

## Related guidance

- `cabloy-docs/backend/master-detail-workflow.md`
- `cabloy-docs/backend/master-detail-source-reading-map.md`
- `.docs-internal/architecture/ai-enablement.md`
- `.claude/skills/cabloy-master-detail/SKILL.md`
