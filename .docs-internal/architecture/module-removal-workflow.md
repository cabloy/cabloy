# Module Removal Workflow

## Purpose

This note records the maintainer rationale and pitfalls behind the Cabloy module-removal workflow assets.

It exists to support:

- the public module-removal playbook in `cabloy-docs/`
- the reusable `cabloy-module-removal` skill in `.claude/skills/`
- future maintainers who need to preserve the same boundaries and recovery rules

## Problem

Removing a Cabloy module is not only a source-deletion task.

In practice, a clean removal can involve:

- backend module roots
- frontend module roots
- workspace dependency entries
- generated registries
- lockfiles
- runtime-generated directories
- build/deps/typecheck verification

If AI systems treat generated working state as source-of-truth, they can leave stale type or runtime residues behind and then keep debugging the wrong layer.

## What the demo-student deletion taught

The `demo-student` cleanup showed that removing source and direct package references is necessary but not always sufficient.

The key failure mode was stale generated/runtime state remaining after source cleanup, which can leave type or runtime consumers behaving as if the deleted module still exists.

This is the core reason to preserve a dedicated removal workflow as a skill plus docs rather than relying on ad hoc instructions.

## Generated runtime directories are not source of truth

Two directories need to stay explicitly classified as the primary generated runtime working state for this workflow:

- `vona/.vona`
- `zova/.zova`

They are not the only generated working directories in the repo, but they are the main recovery targets for normal module-removal drift after source cleanup.

### Why `vona/.vona` is generated

Evidence from source:

- `vona/packages-cli/cli-set-api/src/lib/bean/toolsBin/generateEntryFiles.ts` writes runtime files into the configured runtime directory
- Vona startup/build/test flows generate runtime files such as config, app bootstrap, and modules metadata under that runtime directory
- the Vona CLI build/dev/test flows recreate and often remove `.vona` automatically

### Why `zova/.zova` is generated

Evidence from source:

- `zova/packages-cli/cli-set-front/src/lib/bean/cli.bin.buildRest.ts` uses `.zova` as a generated runtime/config surface during the build-rest workflow
- frontend CLI flows treat `.zova` as a generated working directory, not as a hand-authored code location

### Repo-level evidence that both are disposable

The repo ignores these directories in generated/working-state surfaces such as:

- `.gitignore`
- `.npmignore`
- `vona/oxfmt.config.ts`
- `zova/oxfmt.config.ts`

That is strong evidence that both directories should be treated as ephemeral and rebuildable.

## Maintainer recovery rule

When a module has already been removed from source and direct dependency references, but stale generated residues still remain, future AI workflows should allow direct deletion of:

- `vona/.vona`
- `zova/.zova`

This recovery rule is especially important when a service or build process may not have stopped cleanly and the generated runtime directories were not cleaned up automatically.

The intended sequence is:

1. confirm the real source and workspace references are already gone
2. delete stale generated runtime directories if needed
3. rerun the normal build/deps/typecheck flow
4. only then continue debugging remaining issues

## Why the knowledge is split across three homes

The Cabloy AI model uses different homes for different audiences.

### Public playbook

The public doc should explain:

- when to use the workflow
- the normal removal sequence
- when generated runtime directories can be deleted
- how to verify success

This belongs in `cabloy-docs/` because both people and agents may need the operational explanation.

### Skill

The skill should encode:

- repo/edition detection
- backend-only vs frontend-only vs fullstack branching
- execution order
- recovery reminders
- verification checklists

This belongs in `.claude/skills/` because it is a reusable procedural decision tree.

### Internal note

This note preserves:

- the rationale for the recovery rule
- the source-backed evidence for `.vona` / `.zova`
- the pitfalls of stale generated state
- the maintenance boundary between docs, rules, and skills

This belongs in `.docs-internal/` because it is maintainer-facing rationale, not user-facing workflow explanation.

## Invariants to preserve

Future changes to this workflow should preserve these invariants:

1. prefer fullstack classification by default when both Vona and Zova module surfaces exist
2. remove real source and direct dependency references before debugging generated residues
3. treat `.vona` and `.zova` as rebuildable generated working state, not authoring surfaces
4. keep repo-wide rules short; do not move this whole workflow into `CLAUDE.md`
5. keep the public playbook procedural and the internal note explanatory

## Verification guidance for workflow maintainers

When updating the module-removal assets, re-check that:

- root commands in `package.json` still match the documented workflow
- generated-dir claims remain backed by Vona/Zova CLI source
- the skill, public doc, and internal note tell one consistent story
- docs still build cleanly after public-playbook changes