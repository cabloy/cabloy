# Rules and Config

Cabloy’s AI behavior should be organized into a few clear layers instead of one oversized instruction file.

## Root `CLAUDE.md`

Use the root `CLAUDE.md` for concise, durable operational guidance such as:

- how the monorepo is organized
- where public docs live
- whether an established internal-documentation home is available
- which command entrypoints are preferred
- why edition detection is mandatory before UI-sensitive guidance or project-creation assumptions

## `.claude/commands/`

Use commands for reusable operator workflows that are naturally invoked as a named action, such as release or future docs migration helpers.

## `.claude/skills/`

Use skills for workflows that need more procedural context, bundled references, or iterative selection logic.

## `settings.json` and `settings.local.json`

Use Claude settings for permissions and execution environment, not as the primary place to explain framework concepts.

## Documentation boundary

If a rule is important for people and agents to understand, it probably belongs in public docs too. When an established internal-documentation home exists, it may hold maintainer rationale rather than user-facing workflow. Do not assume or create such a home in another edition.
