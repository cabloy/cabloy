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

- `repo-docs/`

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

- `repo-docs-internal/`

Purpose:

- record architecture notes and ADRs
- preserve maintainer rationale
- document why boundaries exist and what future work should preserve

This layer is intentionally separate from public documentation.

### 3. Agent-neutral governance and generated adapters

Canonical location:

- `repo-agent-governance/`

Generated platform adapters:

- Claude Code: `CLAUDE.md`, `.claude/commands/`, `.claude/skills/`, `.claude/hooks/`, `.claude/settings.json`
- Codex: `AGENTS.md`, `.agents/skills/`
- Cursor: `.cursor/rules/`, `.cursor/skills/`

Purpose:

- define one authored source for concise operational repository guidance and root procedural skill bundles
- encode named workflows and deterministic tools without provider-directory coupling
- make adapter drift visible through committed output and a no-write checker
- keep agent guidance aligned with real Vona/Zova entrypoints

Policy:

- canonical policy and skill bodies are shared only when their engineering semantics are genuinely portable
- generated adapters are never hand-edited or treated as another authority
- hooks, permissions, local settings, MCP registration, command discovery, and automatic command execution remain provider-specific integrations
- the Claude contract-loop hook may keep its Claude-only automatic convenience behavior; other adapters must describe only the portable advisory workflow
- local settings, worktree state, and credentials are excluded from generated ownership

### 4. Root skills

Canonical location:

- `repo-agent-governance/skills/`

Purpose:

- encode reusable procedural workflows
- reduce token cost by reusing CLI capabilities
- make edition detection and verification steps explicit
- support cross-stack work without duplicating framework conventions

Policy:

- prefer one shared root skill per portable workflow
- make edition detection the first durable branch in the workflow
- parameterize UI-library assumptions, build flavors, output paths, and examples instead of forking entire skills by edition
- retain provider-local diagnostic skills outside the root governance surface until their capability profile is explicitly reviewed

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

- `repo-agent-governance/` canonical policies, root skills, adapters, and deterministic tools
- committed generated adapters for Claude Code, Codex, and Cursor
- Claude-specific `PostToolUse` contract-loop bridge and its settings registration
- edition-neutral and edition-aware pages under `repo-docs/`
- relevant internal architecture notes under `repo-docs-internal/`

The following assets are **not** part of the generated or shared ownership set:

- `.claude/settings.local.json`, `CLAUDE.local.md`, and equivalent local provider configuration
- worktree-local and scheduled-task state
- machine-local preferences, credentials, and MCP registration
- arbitrary unregistered sibling files in adapter directories
- any file whose content is genuinely edition-private rather than edition-parameterized

## Hook policy

The portable contract-loop classifier and advisory CLI are maintained in `repo-agent-governance/tools/contract-loop/` and support both Basic and Start through root marker detection.

The Claude adapter hook may additionally:

- parse the Claude `PostToolUse` payload
- maintain Claude-only duplicate-sync state
- auto-run the high-confidence Basic/Admin reverse-chain convenience path

Its platform-specific behavior must not be promised by Codex or Cursor adapters. All adapters should preserve the same shared classifier guidance and branch only where Basic and Start genuinely need different build flavors, paths, or generated outputs.

## Settings policy

`.claude/settings.json` is a generated Claude adapter file when its behavior is intended for the repository's Claude Code users. It is not a cross-agent settings contract.

`.claude/settings.local.json` remains explicitly outside the generated policy because it is for local, non-portable, or developer-specific adjustments.

## Upgrade and distribution implication

Any repo-to-repo upgrade or npm distribution path that claims to keep shared agent guidance aligned must distribute `repo-agent-governance/` first, then reconcile only the exact manifest-managed adapter paths and named package scripts.

The upgrader must:

- replace the canonical governance directory as framework-owned source
- preserve unregistered adapter siblings and local configuration
- update or delete an adapter only when installer state proves that it is unchanged since the prior managed version
- preserve modified or legacy outputs as reported conflicts
- keep platform-specific hook/settings behavior inside the applicable provider adapter

This closes drift without recreating the previous blind root `.claude/**` merge and overwrite behavior.

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

- if the content teaches users or agents how to work, it belongs in `repo-docs/`
- if the content explains maintainer rationale or design history, it belongs in `repo-docs-internal/`
- if the content changes portable agent guidance, it belongs in `repo-agent-governance/`; Claude-specific execution behavior belongs in its canonical adapter source and is rendered to the applicable `.claude/` path

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
