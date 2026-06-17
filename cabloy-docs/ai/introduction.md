# AI Development Introduction

This page is the entrypoint for contributors who are designing, reviewing, or maintaining AI vibe coding workflows in the Cabloy repository.

The Cabloy monorepo is a good fit for AI vibe coding because the source tree already contains most of the framework knowledge an agent needs:

- root scripts for shared workflows
- Vona CLI source and command groups
- Zova CLI source and command groups
- archived docs that still capture valuable concepts
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

## How to approach AI work

For contributor and automation workflows in this repository, prefer this order:

1. inspect the active edition and repo markers before making UI-sensitive or workflow-sensitive assumptions
2. inspect root scripts, Vona CLI, and Zova CLI before inventing manual scaffolding or custom workflow steps
3. use public docs for durable user-facing guidance and `.docs-internal/` for maintainer rationale
4. encode repeatable behavior in Claude rules, commands, or skills instead of relying on unstated habits

## The knowledge layers

### Public docs

Use `cabloy-docs/` for user-facing and agent-facing guidance that should remain durable and source-aligned.

For normal project usage, prefer the user-facing entry docs such as [Fullstack Quickstart](/fullstack/quickstart). This AI section focuses on repository workflows and AI vibe coding.

### Internal engineering docs

Use `.docs-internal/` for architecture notes, ADRs, and maintainership rationale that should not be mixed into public how-to documentation.

### Claude rules and commands

Use root `CLAUDE.md` and `.claude/commands/` for concise operational behavior and repeatable workflows.

### Skills

Use `.claude/skills/` for procedural workflows that benefit from reusable instructions, bundled references, or future deterministic scripts.

## AI reading paths

Use this page as the main AI-development hub, then choose the path that matches your task.

### Repo workflow path

Start here when the task is about choosing the right repo surface, docs location, or automation boundary:

- [Repo Guidance](/ai/repo-guidance)
- [Docs / Skills Mapping](/ai/docs-skills-rules-mapping)
- [CLI to Skill Map](/ai/cli-to-skill-map)
- [Skills](/ai/skills)
- [Rules and Config](/ai/rules-and-config)

### Framework implementation path

Use this path when the task is about implementing or reviewing Cabloy code with repo-aware rules:

- [Class Placement Rule](/ai/class-placement-rule)
- [Global Bean Lookup](/ai/global-bean-lookup)
- [Playbook: Backend Module](/ai/playbook-backend-module)
- [Playbook: Frontend Page](/ai/playbook-frontend-page)
- [Playbook: Contract Regeneration](/ai/playbook-contract-regeneration)
- [Playbook: Module Removal](/ai/playbook-module-removal)
- [Playbook: Metadata Refresh](/ai/playbook-metadata-refresh)

### Verification and roadmap path

Use this path when the task is about consistency checks, verification, or future workflow planning:

- [Edition Detection](/ai/edition-detection)
- [Edition Consistency Checklist](/ai/edition-consistency-checklist)
- [Verification](/ai/verification)
- [Future Skill Roadmap](/ai/future-skill-roadmap)
- [CLI for Agents](/ai/cli-for-agents)

## Recommended AI lookup rules

For backend shorthand lookup, prefer these surfaces in order:

1. `IBeanRecordGlobal` for `this.bean.xxx`, `ctx.bean.xxx`, and `app.bean.xxx`
2. module `src/.metadata/index.ts` to map shorthand names to generated bean types
3. `src/bean` for the shorthand source file itself
4. only then re-evaluate whether the target is really a general full-name bean, a service-scene runtime-anchor, or a lib/helper class

For the full lookup workflow, read [Global Bean Lookup](/ai/global-bean-lookup).

## Common AI mistakes to avoid

- assuming Cabloy Basic and Cabloy Start are identical
- creating framework files manually when a CLI command already exists
- trusting stale legacy repo paths instead of current source
- mixing public documentation and internal rationale into one document set
