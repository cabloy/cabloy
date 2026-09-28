# Rules and Config

Cabloy’s AI behavior is organized into authored governance, generated platform adapters, and platform-local runtime configuration. This prevents the same repository knowledge from drifting across agent-specific directories.

## `repo-agent-governance/`

Use `repo-agent-governance/` as the only authored source for portable repository rules, root procedural skill bundles, bundled references, deterministic tools, and adapter definitions.

It contains the concise repository policy that adapters render to `CLAUDE.md`, `AGENTS.md`, and Cursor MDC rules. It also owns the source bundles rendered to Claude, Codex, and Cursor skill locations.

Run these maintenance checks after changing governance assets:

```bash
npm run agent:governance:render
npm run agent:governance:check
npm run test:agent-governance
```

## Generated platform adapters

The following are committed generated outputs, not parallel authored knowledge sources:

- Claude Code: `CLAUDE.md`, `.claude/commands/`, `.claude/skills/`, `.claude/settings.json`, `.claude/hooks/`
- Codex: `AGENTS.md`, `.agents/skills/`
- Cursor: `.cursor/rules/cabloy-governance.mdc`, `.cursor/skills/`

The Codex and Cursor skill paths are configured generated adapter locations; verify client discovery with a version-pinned external smoke check before presenting it as supported behavior. The adapter model shares rules and procedures, not platform runtime behavior. Claude Code's contract-loop hook is a Claude-specific convenience integration; Codex and Cursor receive advisory guidance but do not claim the same automatic after-edit action.

## Local configuration and permissions

Keep local settings, credentials, worktree state, scheduled-task state, and user-owned agent configuration out of the generated ownership surface. In particular, do not overwrite or adopt `settings.local.json`, `CLAUDE.local.md`, or unregistered files merely because they are near an adapter directory.

Use agent settings for permissions and execution environment, not as the primary place to explain framework concepts.

## Documentation boundary

If a rule is important for people and agents to understand, it belongs in public docs as well. `repo-docs-internal/` holds supporting maintainer rationale rather than user-facing workflow; individual records may vary by edition. See [Agent Governance](/ai/agent-governance) for the complete ownership, adoption, and package-distribution model.
