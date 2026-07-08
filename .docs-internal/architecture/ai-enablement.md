# AI Enablement Architecture

## Purpose

This document explains how Cabloy should organize and distribute the knowledge that supports AI-assisted development across the public `cabloy-basic` repository and the sibling `cabloy-start` repository.

## Decision summary

Cabloy should treat docs, skills, rules, and selected Claude configuration as **one shared, repo-managed knowledge system** across Basic and Start.

The default policy is:

- keep one shared set of docs / skills / rules whenever possible
- treat Basic-vs-Start differences as **behavior parameters**, not separate knowledge systems
- use the root edition markers as the runtime branch selector:
  - `__CABLOY_BASIC__`
  - `__CABLOY_START__`
- allow edition-aware inline branching or conditional disclosure when the difference is safe to expose in both repos
- create edition-private overlays only when a difference is materially sensitive or cannot be expressed as a stable parameter branch

For the current Cabloy Basic / Cabloy Start relationship, the working assumption is:

1. most differences are behavior parameters
2. it is acceptable if users of one edition can see the edition-aware branch text for the other edition inside shared docs / skills / rules

That makes **shared-by-default, marker-aware branching** the preferred design.

## Problem

Cabloy needs AI systems to work accurately across:

- a unified fullstack monorepo shape
- two closely related editions with meaningful runtime and UI differences
- a large CLI surface that already encodes framework conventions
- documentation and automation assets that must ship with each published repository

If these concerns are split into duplicated Basic-only and Start-only knowledge sets too early, AI workflows drift in predictable ways:

- shared guidance silently diverges
- one repo receives fixes that the sibling repo misses
- edition differences get hard-coded instead of parameterized
- upgrade or scaffold flows stop distributing shared Claude assets consistently

## Core design

The AI-enablement model uses four complementary layers.

### 1. Public docs

Location:

- `cabloy-docs/`

Purpose:

- document user-facing and agent-facing workflows
- explain shared architecture once
- mark edition-specific differences explicitly
- provide durable, source-aligned operational knowledge

Shared-doc guidance:

- prefer one shared page with edition-aware branches when the difference is only a parameter change
- use inline notes, side-by-side comparisons, or clearly labeled Basic/Start subsections when that keeps one shared explanation readable
- create separate edition pages only when the divergence is large enough that a shared page becomes misleading or noisy

### 2. Internal engineering docs

Location:

- `.docs-internal/`

Purpose:

- record architecture notes and ADRs
- preserve maintainer rationale
- document why boundaries exist and what future work should preserve

This layer is intentionally separate from public documentation.

### 3. Claude rules, commands, hooks, and shared settings

Location:

- `CLAUDE.md`
- `.claude/commands/`
- `.claude/hooks/`
- `.claude/settings.json`

Purpose:

- define concise operational repo guidance
- encode named workflows such as release or future docs migration commands
- enforce shared automation behavior that should travel with each published repo
- keep execution behavior aligned with the repo’s real entrypoints

Policy:

- `CLAUDE.md` should stay short, durable, and edition-aware
- shared command behavior should be distributed to both repos
- shared hook behavior should be distributed to both repos when the hook can branch safely by marker
- `.claude/settings.json` may be shared when the settings are intended to ship with the repo
- `.claude/settings.local.json` is local-only and is excluded from the shared policy

### 4. Skills

Location:

- `.claude/skills/`

Purpose:

- encode reusable procedural workflows
- reduce token cost by reusing CLI capabilities
- make edition detection and verification steps explicit
- support cross-stack work without duplicating framework conventions

Policy:

- prefer one shared skill per workflow
- make edition detection the first durable branch in the workflow
- parameterize UI-library assumptions, build flavors, output paths, and examples instead of forking entire skills by edition

## Edition-aware shared-assets principle

The system must always distinguish between:

- **common** behavior shared by Cabloy Basic and Cabloy Start
- **edition parameters** that change how the shared workflow runs
- **edition-private** material that should not live inside the shared asset

The primary detection signals are the root marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

These markers should be checked before:

- recommending UI-library-specific workflows
- choosing frontend script flavors
- selecting example paths or module assumptions
- resolving generated output paths
- branching shared skill behavior
- branching shared hook behavior
- deciding which edition-specific note to surface inside a shared doc

The marker should be treated as a runtime input, not as a reason to duplicate the whole knowledge asset.

## Conditional disclosure rule

Conditional disclosure is acceptable when all of the following are true:

- the difference is a behavior parameter rather than a secrecy boundary
- seeing the other edition’s branch is not harmful
- the shared asset remains readable after the branch is added

For the current Basic / Start relationship, this means the same shared docs / skills / rules can usually disclose both branches explicitly, for example:

- Basic uses DaisyUI + Tailwind CSS assumptions
- Start uses Vuetify assumptions
- reverse-chain build flavors or generated paths differ by edition

Do **not** rely on marker-based branching as a way to hide truly private or sensitive information. If content must not appear in the sibling repo at all, it belongs in an edition-private overlay, not in a shared file.

## Shared asset inventory

The following assets should be treated as part of the shared, repo-managed AI surface unless a specific file proves otherwise:

- `CLAUDE.md`
- `.claude/commands/`
- `.claude/skills/`
- `.claude/hooks/contract-loop-gate.ts`
- `.claude/settings.json`
- edition-neutral and edition-aware pages under `cabloy-docs/`
- relevant internal architecture notes under `.docs-internal/`

The following assets are **not** part of the shared set:

- `.claude/settings.local.json`
- worktree-local state
- machine-local preferences
- any file whose content is genuinely edition-private rather than edition-parameterized

## Hook policy

`contract-loop-gate.ts` should be maintained as a shared hook that supports both Basic and Start.

That means the hook should:

- detect the active root marker before making edition-sensitive assumptions
- keep shared contract-loop guidance common where possible
- branch only where Basic and Start genuinely need different build flavors, paths, or generated outputs

If one repo is missing this shared hook, the absence should be treated as a distribution gap rather than as evidence that the hook must stay Basic-only.

## Settings policy

`.claude/settings.json` may be shared and published with the repo when the contained behavior is intended for all consumers of that repository.

`.claude/settings.local.json` remains explicitly outside the shared policy because it is for local, non-portable, or developer-specific adjustments.

## Upgrade and distribution implication

Any repo-to-repo upgrade or distribution path that claims to keep shared Claude assets aligned should include the shared hook and shared settings surface, not only commands and skills.

In practice, that means shared-asset distribution should cover at least:

- `CLAUDE.md`
- `.claude/commands/`
- `.claude/skills/`
- `.claude/hooks/` when the hook is shared-by-marker
- `.claude/settings.json`

and should continue to ignore:

- `.claude/settings.local.json`

This closes the class of drift where one repo receives shared skills and commands but misses the shared hook or shared settings behavior.

## CLI-first principle

The Vona and Zova CLIs already encode a large amount of framework knowledge.

That makes them the preferred automation surface for AI workflows.

### Why

- lower token usage
- fewer inferred conventions
- more consistent output across human and AI workflows
- easier verification against current source

### Practical effect

Skills, rules, and hooks should usually:

1. detect the edition from the root marker
2. inspect the shared root scripts
3. choose the correct Vona or Zova command family
4. execute or recommend the command
5. inspect output and apply only minimal follow-up edits
6. verify the result

## Documentation boundary rule

Use the following decision rule:

- if the content teaches users or agents how to work, it belongs in `cabloy-docs/`
- if the content explains maintainer rationale or design history, it belongs in `.docs-internal/`
- if the content changes execution behavior for Claude, it belongs in `CLAUDE.md`, `.claude/commands/`, `.claude/hooks/`, `.claude/settings.json`, or `.claude/skills/`

## Operational consequences

### Benefits

- one logical knowledge system across both editions
- less duplication and less silent drift
- shared fixes can be shipped to both repos consistently
- edition differences remain explicit instead of being rediscovered ad hoc
- repo consumers receive the intended Claude behavior without depending on machine-global configuration

### Trade-off

Contributors must distinguish between:

- a parameterized edition branch that belongs in the shared asset
- an edition-private overlay that must stay separate

That trade-off is acceptable because the markers give a stable runtime branch point, while the shared-by-default policy keeps maintenance cost lower than maintaining two divergent knowledge systems.
