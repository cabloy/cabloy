# Agent Governance

Cabloy keeps shared AI-development guidance in one authored repository surface while providing adapters for the coding agents used in this repository.

## Canonical source and generated adapters

`repo-agent-governance/` is the canonical source for portable repository rules, root workflow skill bundles, bundled references, deterministic tools, and adapter metadata.

Do not hand-edit generated adapter output. Regenerate it instead:

```bash
npm run agent:governance:render
npm run agent:governance:check
```

The committed repository adapter outputs are:

| Agent surface | Generated repository assets                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------ |
| Claude Code   | `CLAUDE.md`, `.claude/skills/`, `.claude/commands/`, `.claude/settings.json`, `.claude/hooks/`   |
| Codex         | `AGENTS.md`, `.agents/skills/`, `.codex/hooks.json`, `.codex/hooks/`                             |
| Cursor        | `.cursor/rules/cabloy-governance.mdc`, `.cursor/skills/`, `.cursor/hooks.json`, `.cursor/hooks/` |

The same root rule and skill sources are copied to every listed adapter. Platform-specific discovery metadata is intentionally thin and lives in the adapter layer. The generated Codex and Cursor skill paths are configured adapter locations; their client discovery behavior requires a version-pinned external smoke check before it is claimed as supported.

Codex requires the user to trust project-local hooks before it runs `.codex/hooks.json`; that local trust state is not generated or committed by this repository. The repository launcher resolves a hook from nested working directories without Git once Codex invokes it, but Codex discovery remains client-version behavior. For non-Git projects opened from nested directories, configure local Codex `project_root_markers` to include `__CABLOY_BASIC__` and `__CABLOY_START__` alongside `.git`; do not generate that user setting from this repository.

### Package migration bridge

The transition package deliberately excludes generated root adapters because the immediately preceding upgrader overwrites those paths before it starts the incoming initializer. This prevents that legacy path from silently replacing customized adapters. The package still includes canonical governance and `scripts/init.ts`; `npm run init` performs ownership-aware adoption for both a staged upgrade and a fresh project. A source checkout retains its committed generated adapters. This bridge is package-transition behavior, not a claim that agents generate instructions at startup.

## Capability boundary

Rules, procedural skills, references, eval fixtures, contract-loop analysis, and ordinary deterministic repository tools are portable.

Hooks, tool permissions, local settings, credentials, MCP registration, slash-command discovery, confirmation UI, and automatic command execution are not portable contracts. Claude Code, Codex, and Cursor each have a platform-specific contract-loop convenience hook over the same portable classifier and reverse auto-sync runtime. Their hook payloads and stdout contracts differ, so each adapter must remain provider-specific even when it shares the same runtime.

No adapter output owns `settings.local.json`, `CLAUDE.local.md`, worktree state, scheduled-task state, credentials, or arbitrary user-owned agent files.

## Maintain and verify governance assets

Use these commands during repository maintenance:

```bash
npm run agent:governance:render
npm run agent:governance:check
npm run test:agent-governance
npm run agent:governance:pack-check
```

`agent:governance:check` is read-only and fails when a committed adapter output or `managed-assets.json` is stale. `agent:governance:pack-check` verifies that the npm package includes the canonical and adapter assets but excludes local state.

For an existing project whose adapter files predate governance ownership, inspect adoption first:

```bash
npm run agent:governance:adopt
npm run agent:governance:adopt -- --apply
```

Adoption creates missing assets and records byte-identical assets. It preserves differing legacy or locally changed managed files as conflicts. Only an explicit path-specific `--force <target>` can replace a conflict.

## Contract-loop tooling

The portable advisory checker accepts a reviewed source path and never starts a build by default:

```bash
npm run contract:gate -- --file zova/src/suite/<suite>/modules/<module>/src/.metadata/index.ts --format json
```

Follow [Contract Loop Playbook](/fullstack/contract-loop-playbook) for the full forward, reverse, consumer-drift, and local-dependency-drift workflow. The checker provides a signal and command guidance; it is not proof that generation, build, or dependency refresh has completed.

## Placement rules

Keep the existing Cabloy knowledge boundary:

- `repo-docs/` explains durable workflows for people and agents.
- `repo-docs-internal/` records supporting maintainer rationale and ADRs.
- `repo-specs/<suite>/` remains authority for suite product, delivery, acceptance, and evidence records.
- `repo-agent-governance/` owns portable agent rules, root skill workflows, adapters, and deterministic governance tooling.
- platform directories are generated runtime/discovery adapters, not a second authored source.

For a broader placement decision, see [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping).
