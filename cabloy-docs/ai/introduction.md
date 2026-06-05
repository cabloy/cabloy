# AI Development Introduction

The Cabloy monorepo is a good fit for AI-assisted development because the source tree already contains most of the framework knowledge an agent needs:

- root scripts for shared workflows
- Vona CLI source and command groups
- Zova CLI source and command groups
- legacy docs that still capture valuable concepts
- internal engineering docs for maintainers
- Claude commands and skills

## The main design goal

The goal is not to make AI guess Cabloy conventions more effectively.

The goal is to make AI **reuse the repo’s existing conventions directly**, especially through:

- CLI commands
- root scripts
- repo markers
- internal architecture notes
- shared public documentation

## The knowledge layers

### Public docs

Use `cabloy-docs/` for user-facing and agent-facing guidance that should remain durable and source-aligned.

### Internal engineering docs

Use `.docs-internal/` for architecture notes, ADRs, and maintainership rationale that should not be mixed into public how-to documentation.

### Claude rules and commands

Use root `CLAUDE.md` and `.claude/commands/` for concise operational behavior and repeatable workflows.

### Skills

Use `.claude/skills/` for procedural workflows that benefit from reusable instructions, bundled references, or future deterministic scripts.

## Common AI mistakes to avoid

- assuming Cabloy Basic and Cabloy Start are identical
- creating framework files manually when a CLI command already exists
- trusting stale legacy repo paths instead of current source
- mixing public documentation and internal rationale into one document set
