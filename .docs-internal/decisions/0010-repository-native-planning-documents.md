# ADR 0010: Keep Internal Planning Documents Repository-Native

## Status

Accepted.

## Background

Cabloy Basic maintains repository-native internal planning records for long-lived business suites and engineering work. These records include product requirements, system contracts, delivery plans, test and acceptance evidence, implementation workflow records, and ADRs.

A-Commerce demonstrates the current model:

- the PRD defines product outcomes, scope, and business acceptance;
- the SRS defines system contracts, ownership, state transitions, authorization, and invariants;
- the PDP/WBS defines delivery order, dependencies, and completion checks;
- the test plan defines acceptance scenarios, evidence, and release proof;
- the contract-loop record defines the paired Vona/Zova implementation workflow; and
- local ADRs preserve durable suite decisions.

These records use a linked traceability chain:

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

OpenSpec was evaluated as a possible spec-driven workflow for AI-assisted development. It is an independent change-management framework, not a Claude Code requirement. Its change artifacts could be useful for a future workflow, but introducing it without a repository-level authority model would create another document system alongside established planning records.

## Problem

The monorepo needs one clear source of truth for each class of planning fact: product scope, technical contracts, delivery sequencing, acceptance evidence, and durable decisions.

Adding OpenSpec without first redefining document authority would create competing or mirrored representations of the same facts. It would leave unresolved whether a PRD or proposal owns product scope, whether an SRS or OpenSpec capability spec owns technical contracts, whether a delivery plan or change tasks own delivery order, and how OpenSpec verification relates to established acceptance evidence.

## Decision

Keep repository-native internal planning documents as the canonical planning system for Cabloy Basic.

Do not adopt OpenSpec as a required repository workflow, a second planning authority, or a mirrored representation of existing internal planning documents, implementation workflow records, or ADRs.

The existing documentation boundary remains in force:

- `cabloy-docs/` owns user-facing and agent-facing guidance;
- `.docs-internal/` owns maintainer rationale, architecture notes, planning records, and ADRs; and
- `CLAUDE.md`, `.claude/commands/`, `.claude/hooks/`, `.claude/settings.json`, and `.claude/skills/` own Claude execution behavior.

Within a business suite, its planning index and authority map identify which repository-native document owns each class of fact. Requirement identifiers and the suite's established traceability chain remain the change-control mechanism. Contributors must update the applicable authoritative record before changing downstream references or implementation.

A future decision may adopt OpenSpec or a hybrid process only through a new ADR that defines the canonical source for each class of fact, migration and history retention, traceability to existing requirement and acceptance identifiers, archive behavior, and rules that prevent independently editable duplicate specifications.

## Alternatives Deferred

The following alternatives are deferred:

- replacing repository-native internal planning records with OpenSpec;
- maintaining OpenSpec and current internal documents as separately editable sources of truth;
- adopting OpenSpec for selected suites, phases, or modules without first resolving authority, traceability, archive behavior, and duplicate-maintenance rules; and
- adding OpenSpec tooling, commands, configuration, or generated planning structure opportunistically as part of feature work.

## Consequences

- Existing internal planning indexes remain the entry points for their domains and define document authority locally.
- Contributors continue to maintain repository-native Markdown records and their links as part of normal change control.
- Planning history remains reviewable through repository history, planning records, and ADRs.
- A future OpenSpec evaluation must demonstrate a concrete unmet need, rather than treating Claude Code usage alone as a reason to introduce a second workflow.
- This decision does not prevent future change-specific execution records; any such process must reference the established authoritative documents unless a later ADR deliberately changes the authority model.

## Related Records

- [Internal Engineering Documentation](../README.md)
- [ADR 0001: Establish the Internal Engineering Documentation Home](./0001-internal-docs-home.md)
- [AI Enablement Architecture](../architecture/ai-enablement.md)
- [A-Commerce internal planning index](../business/a-commerce/README.md)
- [A-Commerce PRD](../business/a-commerce/prd.md)
- [A-Commerce SRS](../business/a-commerce/srs.md)
- [A-Commerce PDP/WBS](../business/a-commerce/pdp-wbs.md)
- [A-Commerce test strategy and acceptance plan](../business/a-commerce/test-plan.md)
- [A-Commerce ADR 0001: Establish A-Commerce MVP Boundaries](../business/a-commerce/decisions/0001-mvp-boundaries.md)
- [A-Commerce ADR 0002: Preserve a Path to Multiple Merchants Within One Vona Instance](../business/a-commerce/decisions/0002-multi-merchant-within-one-vona-instance.md)
