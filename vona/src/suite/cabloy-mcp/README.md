# Cabloy MCP

MCP usage and verification guidance lives with this Vona suite rather than in the formal documentation site.

## Guides

- [MCP Browser Authorization](./docs/mcp-browser-authorization.md): DCR-only public/confidential clients, available whenever the existing AS/MCP ingress is available; issuer and resource both derive as `${origin}/mcp` from the root backend `server.serve` configuration. Reuse existing SSR/login, explicit consent, PKCE exchange and protected MCP access, without a separate issuer/resource registry or registration enablement switch. New DCR registrations default to `mcp:all`; explicit `mcp:read` narrows access, omitted authorization scope inherits the registered ceiling, and existing read-only registrations/tokens are not promoted. Both scopes retain local RBAC/data/tenant limits; the three catalog tools remain read-only, with no new mutation or dispatch registry. The guide covers Codex's optional top-level `scopes = ["mcp:read"]` and the unchanged no-refresh boundary.
- [Local MCP Test Catalog](./docs/mcp-commerce-local.md): independent anonymous, credential-rejecting test launcher and read-only catalog walkthrough.

Product specifications, delivery plans and historical acceptance records remain in [repo-specs/cabloy-mcp](../../../../repo-specs/cabloy-mcp/README.md). Suite-local guides do not imply production deployment or full acceptance clearance.
