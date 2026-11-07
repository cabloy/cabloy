# Cabloy MCP

The `cabloy-mcp` suite connects existing Vona Controller Actions to MCP clients. Backend `cabloy-mcp` owns shared ingress and tool mapping, `mcp-auth` owns browser authorization and tokens, and `mcp-test` provides the independent local test catalog. Zova's companion `cabloy-mcp` module provides consent and personal scope pages inside existing SSR Sites.

## Documentation

The canonical usage guides are published in the formal documentation site:

- [MCP Integration Guide](../../../../repo-docs/backend/mcp-guide.md): ownership, shared endpoint admission, authorization and operational boundaries.
- [MCP Controller Tools](../../../../repo-docs/backend/mcp-controller-tools.md): explicit opt-in/exclusion, Action contracts, diagnostics and Student examples.
- [MCP Browser Authorization](../../../../repo-docs/backend/mcp-browser-authorization.md): DCR, existing login, explicit consent, PKCE, token refresh and personal scopes.
- [Local MCP Test Catalog](../../../../repo-docs/backend/mcp-commerce-local.md): independent anonymous loopback launcher and three-tool read-only walkthrough.

Product specifications, delivery plans and historical acceptance records remain in [repo-specs/cabloy-mcp](../../../../repo-specs/cabloy-mcp/README.md). Usage guidance does not establish deployment qualification or acceptance closure.
