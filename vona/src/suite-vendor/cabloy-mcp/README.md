# Cabloy MCP

This suite maps explicitly opted-in Vona Controller Actions to MCP tools while reusing their DTO contracts, validation, serialization and ordinary business authorization. The normal shared `/mcp` endpoint is authenticated; the dev/test-only standalone synthetic catalog is a separate entrypoint.

## Guides

- [Connected-client query guide](docs/query-guide.md): compact declarations, exact-target `cabloy_tool_contract` lookup and native query composition, with or without an optional skill.
- [MCP Integration Guide](../../../../repo-docs/mcp/mcp-guide.md): runtime ownership, admission, authorization and operational boundaries.
- [MCP Controller Tools](../../../../repo-docs/mcp/mcp-controller-tools.md): decorator options, argument/result mapping, examples and diagnostics.
- [MCP Browser Authorization](../../../../repo-docs/mcp/mcp-browser-authorization.md): registration, login, consent, tokens and personal scopes.
- [End-user client skills](../../../../repo-client-governance/README.md): standalone skill packaging and manual client loading, independent of repository-development adapters.

The backend suite contains only `cabloy-mcp` (shared runtime and transport) and `mcp-auth` (authorization). Dev/test diagnostics, synthetic fixtures and standalone launcher support belong to `a-test/test-mcp` at `vona/src/suite-vendor/a-test/modules/test-mcp`, outside this suite. The runtime/auth suite does not depend on the fixture module. Frontend consent and personal-scope pages belong to the corresponding frontend suite in existing SSR Sites. A tool decorator, server connection or skill does not itself grant business permissions or install client instructions.
