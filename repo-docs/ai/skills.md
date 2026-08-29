# Skills

Skills are the procedural layer of Cabloy’s AI development model.

## What a skill should do here

A Cabloy skill should reduce repeated reasoning cost by encoding workflows such as:

- choosing the correct backend or frontend entrypoint
- detecting the active edition
- selecting the right CLI command family
- deciding what to verify after generation or refactor work

## What a skill should not do by default

A skill should not re-implement framework scaffolding manually when the Vona or Zova CLI already provides that behavior.

If a generator or refactor command exists, the skill should orchestrate it instead of replacing it.

## Skill placement

- Use root `.claude/skills/` for cross-stack, monorepo-wide workflows.
- Use subtree-local `.claude/skills/` only when a workflow is truly specific to one framework area.

## Skill structure recommendation

A strong Cabloy skill usually includes:

1. repo and edition detection
2. CLI-first workflow selection
3. minimal manual fallback guidance
4. verification guidance
5. references to durable source-of-truth files

When a skill needs to apply an architectural rule such as backend class placement, prefer a branching decision tree that points back to durable docs instead of embedding the full architecture rationale inside the skill itself.

For edition-aware skills, use [Edition Detection for AI Workflows](/ai/edition-detection) and [Edition Consistency Checklist](/ai/edition-consistency-checklist) as the durable review surfaces before expanding edition-specific branches.

## Example workflow skills in this repo

Current examples include:

- `cabloy-workflow` for choosing the correct Cabloy work path before implementation
- `cabloy-domain-planning` for proposing and confirming providerId, suite, and initial module names before scaffolding a new business domain
- `cabloy-spec-generation` for creating or maintaining suite-local planning authority, traceability, and derived planning views before implementation
- `cabloy-spec-execution` for coordinating one confirmed WBS increment through specialist implementation, evidence, and derived progress updates
- `cabloy-contract-loop` for backend/frontend contract regeneration and drift diagnosis
- `cabloy-resource-field-update` for updating an existing backend resource field thread
- `cabloy-module-removal` for removing a backend, frontend, or fullstack module cleanly, including generated-runtime cleanup, stale-residue recovery, and verification

The specification workflows show the same boundary: [Playbook: Plan a Cabloy Suite Specification](/ai/playbook-spec-generation) and [Playbook: Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution) explain the durable public workflow, while the skills retain the branching, confirmation gates, specialist routing, and evidence protocol.

The module-removal workflow is a good example of why skills belong in `.claude/skills/` instead of `CLAUDE.md`: the task needs branching, cleanup order, recovery guidance for generated runtime directories such as `vona/.vona` and `zova/.zova`, and a verification checklist that would be too large for a short repo-wide rule.
