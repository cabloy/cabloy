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
