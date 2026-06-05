# AI Enablement Architecture

## Purpose

This document explains how Cabloy organizes the knowledge that supports AI-assisted development across the public `cabloy-basic` repository and the sibling private `cabloy-start` repository.

## Problem

Cabloy needs AI systems to work accurately across:

- a unified fullstack monorepo
- two closely related editions with meaningful differences
- a large CLI surface that already encodes framework conventions
- separate public and internal documentation audiences

If these concerns are mixed together loosely, AI workflows drift in predictable ways:

- stale docs override source truth
- frontend guidance assumes the wrong edition
- generators are bypassed in favor of manual scaffolding
- internal rationale leaks into public docs without enough curation

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

### 2. Internal engineering docs

Location:

- `.docs-internal/`

Purpose:

- record architecture notes and ADRs
- preserve maintainer rationale
- document why boundaries exist and what future work should preserve

This layer is intentionally separate from public documentation.

### 3. Claude rules and commands

Location:

- `CLAUDE.md`
- `.claude/commands/`

Purpose:

- define concise operational repo guidance
- encode named workflows such as release or future docs migration commands
- keep execution behavior aligned with the repo’s real entrypoints

### 4. Skills

Location:

- `.claude/skills/`

Purpose:

- encode reusable procedural workflows
- reduce token cost by reusing CLI capabilities
- make edition detection and verification steps explicit
- support cross-stack work without duplicating framework conventions

## Edition-aware principle

The system must always distinguish between:

- **Common** behavior shared by Cabloy Basic and Cabloy Start
- **Basic**-specific workflows
- **Start**-specific workflows

The primary detection signals are the root marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

These markers should be checked before:

- recommending UI-library-specific workflows
- choosing frontend script flavors
- selecting example paths or module assumptions
- triggering edition-specific branches inside skills

## CLI-first principle

The Vona and Zova CLIs already encode a large amount of framework knowledge.

That makes them the preferred automation surface for AI workflows.

### Why

- lower token usage
- fewer inferred conventions
- more consistent output across human and AI workflows
- easier verification against current source

### Practical effect

Skills should usually:

1. detect the edition
2. inspect the shared root scripts
3. choose the correct Vona or Zova command family
4. execute or recommend the command
5. inspect output and apply only minimal follow-up edits
6. verify the result

## Documentation boundary rule

Use the following decision rule:

- if the content teaches users or agents how to work, it belongs in `cabloy-docs/`
- if the content explains maintainer rationale or design history, it belongs in `.docs-internal/`
- if the content changes execution behavior for Claude, it belongs in `CLAUDE.md`, `.claude/commands/`, or `.claude/skills/`

## Consequences

### Benefits

- better reuse of CLI capabilities
- clearer distinction between public workflows and internal rationale
- safer support for both Basic and Start
- more durable AI behavior as the repo evolves

### Trade-off

The model introduces multiple knowledge homes, so contributors must choose where a new piece of knowledge belongs.

That trade-off is acceptable because the audiences and maintenance rules are materially different.
