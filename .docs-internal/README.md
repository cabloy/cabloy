# Internal Engineering Documentation

This directory stores internal technical documentation for the Cabloy Basic monorepo.

## Purpose

This documentation area is for framework-internal engineering knowledge, including:

- architecture notes
- design rationale
- implementation plans
- refactor records
- decision history
- execution and validation summaries for important work

It is intentionally separate from future user-facing documentation.

## What belongs here

### `architecture/`

Use this directory for long-lived technical explanations, such as:

- subsystem design
- cross-package behavior
- framework patterns
- internal abstractions
- invariants that future development should preserve

### `decisions/`

Use this directory for ADR-style records and major engineering changes, such as:

- why a design was chosen
- what alternatives were rejected
- what implementation boundaries were established
- how a refactor changed the system
- what future work should keep in mind

## What does not belong here

Do not use this directory for:

- end-user product documentation
- framework usage tutorials for external users
- release notes
- temporary personal scratch notes

Those concerns should live elsewhere.

## Current documents

### Decisions

- [ADR 0001: Establish the Internal Engineering Documentation Home](./decisions/0001-internal-docs-home.md)
- [ADR 0002: Guard-Based Default API Permission Projection](./decisions/0002-guard-permission-projection.md)
- [ADR 0003: Stop SSR Leak Fixes at the Runtime-Core Boundary](./decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md)

### Architecture notes

- [SSR Memory Leak Investigation Guide](./architecture/ssr-memory-leak-investigation-guide.md)
- [SSR Leak Experiment Flags Inventory](./architecture/ssr-leak-experiment-flags-inventory.md)
