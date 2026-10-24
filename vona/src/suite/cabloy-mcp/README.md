# Cabloy MCP

MCP usage and verification guidance lives with this Vona suite rather than in the formal documentation site.

## Guides

- [MCP Browser Authorization](./docs/mcp-browser-authorization.md): DCR-only public/confidential clients, available whenever the existing AS/MCP ingress is available; issuer and resource both derive as `${origin}/mcp` from the root backend `server.serve` configuration. Reuse existing SSR/login, explicit consent, PKCE exchange and protected MCP access, without a separate issuer/resource registry or registration enablement switch.
- [Local MCP Test Catalog](./docs/mcp-commerce-local.md): independent anonymous, credential-rejecting test launcher and read-only catalog walkthrough.

Product specifications, delivery plans and historical acceptance records remain in [repo-specs/cabloy-mcp](../../../../repo-specs/cabloy-mcp/README.md). Suite-local guides do not imply production deployment or full acceptance clearance.
