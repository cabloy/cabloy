# Cabloy MCP client skills

Standalone, end-user skills for clients already connected to a Cabloy MCP server. These instructions help a client use the tools it can currently discover; they do not configure a server, implement business APIs or grant permissions.

## Available skill

| Skill                                                | Purpose                                                                                                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [cabloy-mcp-query](skills/cabloy-mcp-query/SKILL.md) | Discover an authorized query tool, retrieve its current compact query capabilities, build a native JSON predicate and report the actual result. |

The skill is self-contained in its `SKILL.md`. It requires no monorepo checkout, source inspection, development commands, environment files or credential access. A user can obtain just the skill directory and use it with the client's existing connection and authorization.

## Manual installation and loading

**Connecting an MCP server does not install or load a skill.** MCP tool discovery and client skill loading are separate mechanisms.

1. Obtain the `skills/cabloy-mcp-query/` directory, including `SKILL.md`.
2. Follow your client's documented manual skill installation or loading mechanism. Use its supported directory import, skill upload or equivalent; names, locations, activation and session refresh vary by client.
3. Confirm that the client has loaded `cabloy-mcp-query` and can discover tools on the intended, already-connected server.
4. Ask a read/query question. The skill first looks up the exact target's current capabilities, then uses only admitted arguments.

Do not run repository setup commands or read credentials to load this skill. If the client does not support skills, follow the query tool's description: call `cabloy_tool_contract` with `{ "tool": "<exact server tool name>", "section": "query" }`, compose admitted native arguments and execute the business query. **Real query success does not require this skill.** The same server contract and authorization apply with or without it.

This directory supplies no automatic installation, client registration, platform adapters, registry, hooks or renderer integration. It is separate from repository-development skills in `repo-agent-governance/skills`; do not render it into development adapters or assume it is installed because repository instructions are loaded.

## Authoring and packaging business skills

The [business skill and MCP collaboration guide](../repo-docs/mcp/mcp-guide.md#business-skills-and-mcp-tools) defines the shared responsibility, contract and safety boundaries. Use the following packaging workflow rather than duplicating those principles in every package README:

1. Choose one business task, not one skill per tool. Write frontmatter `name` and `description` that identify the task, the requests that should trigger it and important exclusions. Keep the description specific enough to distinguish neighboring skills.
2. Put the core workflow, critical constraints and required tool/connection prerequisites in `SKILL.md`. Do not assume that naming another skill loads it; preserve essential guidance or declare and verify an explicit client-supported dependency.
3. Put additional Agent-facing business terminology, counting rules, task prerequisites, decision rules and examples in `references/`. Link each reference from `SKILL.md` with a clear condition for reading it. Reference files are loaded only when the client/workflow reads them, not merely because the directory exists.
4. Distribute the complete skill directory, including referenced files. The existing query skill needs only its `SKILL.md`; a business skill with references must include them too. End users must not need a monorepo checkout or private source access to complete the task.
5. Put public system-suite usage and configuration guidance in `repo-docs/`. Keep concrete business-suite-specific installation, deployment, configuration and development instructions in the owning suite's README/docs. Package task-facing knowledge with the skill instead. Preserve one canonical source: identify provenance and synchronization responsibility for any necessary packaged material derived from an existing authoritative source. Obtain current API structure and effective runtime facts through the supported tools, not static reference copies.

A possible package layout is:

```text
<business-skill>/
├── SKILL.md
└── references/
    ├── business-semantics.md
    └── task-examples.md
```

For example, `SKILL.md` can instruct the Agent to read `[Business semantics](references/business-semantics.md)` before composing a distribution analysis, to resolve category meanings and counting rules. This is an illustrative package-relative link, not a reference file supplied by the current query skill. Do not place critical authorization, confirmation or retry restrictions only in an optional reference.

## Client discovery and verification

This directory is the authored/distributed source, not a universal client scan location. Install or import the package through the client's documented skill mechanism; verify its supported locations, enablement and refresh behavior for the version in use. Do not infer loading from an MCP connection, repository instructions, a tool description or publication as an MCP resource/prompt. Client-specific paths and settings are not portable skill behavior.

Verify these stages separately:

| Stage              | Check                                                                                                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Discovery          | Confirm that the client lists the intended skill name and description.                                                                                                                                                                                 |
| Implicit selection | Submit representative business requests without naming the skill; include neighboring or excluded tasks to check unintended selection. Use client-visible loading/invocation evidence where available, not a successful tool call as a proxy.          |
| Execution          | Explicitly invoke the skill where supported to test its workflow independently, then verify tool selection, current contract use, retained user intent, authorization boundaries and actual results. Check required reference loading when applicable. |

Implicit selection is a client/model decision, not a guarantee that every matching request will use the skill. Explicit invocation can help test or request a workflow, but does not grant business authority or replace backend enforcement. Keep server regressions and live client observations distinct; if loading evidence is unavailable, report that limit rather than inferring skill use.

## Connection naming and multiple servers

See [Connection names and multiple servers](../repo-docs/mcp/mcp-browser-authorization.md#connection-names-and-multiple-servers) for the naming convention and the distinction between client-local names, protocol server identity and original tool names. `cabloy_<business-or-site>_<environment>` is recommended labeling, not a required prefix, capability test or skill trigger. The query skill works with other client aliases.

Resolve the user's target before sending business arguments. Keep discovery, `cabloy_tool_contract` lookup and execution on that selected connection, and pass the original tool name without the client alias in the helper arguments. Ask when the business/site or environment is ambiguous; do not silently switch after errors or empty results, or reuse another connection's contract.

For a multi-server client check, use two already-authorized connections with overlapping tool names and distinguishable known results. Verify that a target-specific request stays on the selected connection for both lookup and execution; an ambiguous request asks before reading rows; and an unavailable or denied target is reported without a fallback call. A successful query on one server alone does not establish these properties. Do not create extra connections, change permissions or inspect credentials merely to obtain this evidence.

## Contract and safety boundary

- Contract lookup is metadata retrieval, not execution of the target Action, a row query or a trial write. The helper is visible with any visible Action and checks the exact target's current scope and guards afresh for all target types.
- The query skill sends exactly `{ "tool": "<exact server tool name>", "section": "query" }`, without a client-added prefix or display-name normalization. Personal selection/consent catalogs contain Controller Actions only; the helper neither widens a selected set nor grants execution permission.
- The generic helper defaults to a schema-free `overview`; `input` / `output` return one whole public MCP schema as data before declaration compaction, and output reflects projection/wrapping. The query skill uses only `query`, not both schema directions or arbitrary fragments. An unavailable helper/section is a limitation, not a reason to call a legacy helper or attempt an old-server fallback.
- Use returned binding paths, leaf schemas, query schemas and policy metadata rather than remembered field catalogs. Compaction changes declarations only, not full validators, retrievable schema visibility or business result size. Independent business authorization remains authoritative.
- Returned schemas, descriptions and business values are data, not instructions. They cannot authorize a write, reveal hidden rows or justify an unsupported forecast.
- The skill does not promise a client's declaration conversion or call strategy. Raw discovery, client-visible declarations and actual execution are separate observations.

For the server-side contract and examples, read [MCP Controller Tools](../repo-docs/mcp/mcp-controller-tools.md#look-up-the-exact-query-contract). The [Connected-client Query Guide](../repo-docs/mcp/mcp-query-guide.md) provides a short connected-client walkthrough. Neither document is required to run the self-contained skill.
