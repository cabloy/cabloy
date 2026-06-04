# ADR 0001: Establish the Internal Engineering Documentation Home

## Status

Accepted and implemented.

## Background

The monorepo needs a durable place for internal engineering knowledge.

That knowledge includes:

- framework design rationale
- architecture notes
- implementation plans
- refactor records
- important development decisions
- execution and validation summaries for non-trivial work

At the same time, future user-facing documentation for Cabloy, Vona, and Zova will live in a separate root-level documentation project.

These two concerns should not share the same documentation home.

## Problem

Without a dedicated internal documentation area, important engineering context is easily lost after a feature is implemented.

This creates several problems:

1. future feature work repeats earlier analysis
2. refactor rationale becomes hard to recover
3. framework invariants are preserved only in code, not in explanatory form
4. user-facing docs risk being polluted with internal implementation details

## Decision

Create a root-level internal documentation area at:

- `.docs-internal/`

This area is reserved for framework-internal engineering documentation.

## Structure

The initial structure is intentionally lightweight:

- `.docs-internal/README.md`
- `.docs-internal/architecture/`
- `.docs-internal/decisions/`

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

## What Does Not Belong Here

Do not use `.docs-internal/` for:

- end-user product documentation
- external usage tutorials
- release notes
- temporary personal scratch notes

## Consequences

### Benefits

- important engineering context becomes durable and searchable
- future contributors can reuse previous design work
- internal technical records stay separate from user-facing documentation
- the structure is small enough to adopt immediately without heavy process

### Trade-off

This adds a second documentation area to the repository, which means contributors must choose between internal and external documentation on purpose.

That trade-off is acceptable because the audiences, maintenance rules, and content types are fundamentally different.

## Guidance for Future Work

When writing new documentation:

- use `.docs-internal/architecture/` for stable technical explanations
- use `.docs-internal/decisions/` for important design and refactor records
- keep user-facing how-to content out of this directory
- prefer concise, reusable notes that explain why a decision matters for later development
