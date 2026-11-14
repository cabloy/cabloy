# Cabloy MCP

This suite maps explicitly opted-in Vona Controller Actions to MCP tools while reusing their DTO contracts, validation, serialization and ordinary business authorization. The normal authenticated resources are site-specific `/mcp/:ssrSiteId` endpoints, for example `/mcp/commerce` and `/mcp/web`; the issuer and authorization endpoints remain shared under `${origin}/mcp`. Bare `/mcp` is not a backward-compatible business endpoint. The dev/test-only standalone synthetic catalog is a separate entrypoint.

## Guides

Public usage documentation is published in the formal MCP documentation section; the links below point to its canonical source pages.

- [MCP Integration Guide](../../../../repo-docs/mcp/mcp-guide.md): runtime ownership, admission, authorization and operational boundaries.
- [MCP Controller Tools](../../../../repo-docs/mcp/mcp-controller-tools.md): decorator options, argument/result mapping, examples and diagnostics.
- [MCP Browser Authorization](../../../../repo-docs/mcp/mcp-browser-authorization.md): registration, login, consent, tokens and personal scopes.
- [Personal MCP Access Tokens](../../../../repo-docs/mcp/mcp-access-tokens.md): independent Account Security page, one-time token creation, finite lifetimes, status and deletion for clients without OAuth support.
- [Connected-client Query Guide](../../../../repo-docs/mcp/mcp-query-guide.md): compact declarations, exact-target `cabloy_tool_contract` lookup and native query composition, with or without an optional skill.
- [Log out from an MCP client](../../../../repo-docs/mcp/mcp-browser-authorization.md#log-out-from-an-mcp-client): revoke the current OAuth authorization or personal access token through `cabloy_logout`, including shared-credential effects and reconnect requirements.
- [End-user client skills](../../../../repo-client-governance/README.md): standalone skill packaging and manual client loading, independent of repository-development adapters.

## Suite ownership

The backend suite contains only `cabloy-mcp` (shared runtime and transport) and `mcp-auth` (authorization). Dev/test diagnostics, synthetic fixtures and standalone launcher support belong to `a-test/test-mcp` at `vona/src/suite-vendor/a-test/modules/test-mcp`, outside this suite. The runtime/auth suite does not depend on the fixture module. Frontend consent and personal-scope pages belong to the corresponding frontend suite in existing SSR Sites. A tool decorator, server connection or skill does not itself grant business permissions or install client instructions.
