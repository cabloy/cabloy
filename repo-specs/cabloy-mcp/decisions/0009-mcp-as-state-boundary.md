# ADR 0009: MCP Authorization-Server State Boundary

## Status

**Accepted for bounded design only — not a storage, schema, source, or execution approval.** On 2026-10-10, `zhennann` selected the integrated `a-auth` AS route and a revision of the first-increment no-schema boundary to permit planning for **AS-owned shared authorization state**. `zhennann` accepted AS implementation and operational responsibility. This decision amends `DEC-MCP-09` only to that extent. It does not select a database, Redis namespace, external service, schema, migration, file version, retention period, consent record, live issuer, endpoint, credential, or deployment topology.

`WBS-MCP-20-04` remains blocked. This decision is distinct from approval of its [execution dossier](../wbs-mcp-20-04-execution-dossier.md), AS source, runtime operation, or `ATP-MCP-AUTH-03`.

## Context

[ADR 0001](./0001-mcp-suite-boundaries.md) accepts no new **MCP resource-module-owned** registry, consent, or audit persistence and a no-schema first-increment scaffold. [ADR 0003](./0003-mcp-oauth-resource-server.md) accepts a distinct AS and resource-server design: Authorization Code + PKCE S256, pre-registered public/confidential clients, MCP-only opaque access tokens with current authoritative lookup, and no refresh issuance. The [AS design review](../wbs-mcp-20-04-as-design-review.md) found that existing login/provider, JWT, and Redis session primitives do not provide the required AS transaction, grant, or opaque-token lookup state. Putting new records under `a-auth` would still change the original no-schema scope; a Redis/external shared store is still authorization state even without a relational migration.

The 2026-10-10 decision selects an integrated `a-auth` logical AS for the first profile and separately identifies `zhennann` as both implementation and operational owner. The first profile cannot be executed as real issuance with only the existing session marker or a process-local token map.

## Decision and exact boundary

1. **Ownership:** `a-auth` is the selected logical AS capability owner. `zhennann` is responsible for AS implementation and operations, including issuer/client registration, authorization interaction, state availability and revocation, secret custody, incident response, and retention policy. The `cabloy-mcp` resource server remains a separate owner; it does not issue credentials, retain grants, store consent, or run an independent token registry. This is responsibility assignment, not permission to set live configuration.
2. **First-increment scope revision:** `DEC-MCP-09` permits a separately designed and approved **AS-owned shared authorization state** capability needed for MCP client registration, short-lived authorization request/code/PKCE transactions, grant/resource/scope binding during access-token lifetime, and opaque access-token active/revocation lookup. This is authority to design a shared-state boundary, **not authority to create any particular persisted object or store**. The originally accepted no-MCP-resource-module persistence boundary and no-schema initial `cabloy-mcp` scaffold remain intact. The blanket statement that the entire first increment can have no new schema is superseded only for a future, separately approved AS-owned store.
3. **No remembered consent or refresh by default:** The first profile requires a new explicit grant interaction for each authorization request. It does not authorize a durable consent record, refresh token or family state. Any remembered consent or refresh issuance needs a distinct authority change.
4. **State safety requirements:** Any selected store must support bounded authorization-transaction lifetime, one-time code redemption, current opaque-token lookup/revocation, appropriate digest representation, shared-worker consistency and fail-closed outage behavior. Clients and resource-server workers must not rely on a process-local or stale snapshot to extend authorization.
5. **Separate implementation decision:** Before changing source or registering storage, record the exact owning module and runtime service, representation (database versus approved shared service), retention/deletion, migration and concurrency/replay policy, operational topology, outage recovery, data classification and redaction. Before **any** persisted field/schema edit, ask and record whether the owning `vonaModule.fileVersion` will increment; this decision intentionally does not answer that question. Any `meta.version.ts` edit requires `npm run test` after separately approved implementation. An external shared store still requires approval of its namespace, lifetime, consistency, custody and failure policy even if no SQL schema is added.

The decision is not an exception for a new `cabloy-mcp` schema, an AS inside the resource module, a general consent ledger, new OAuth provider configuration, or a production authorization endpoint. A separately operated AS remains a later alternative only through a new route decision and equivalent contract proof.

## Consequences and readiness

- The AS implementation path has a responsible logical owner and accountable operator, but no storage design or runtime configuration. The existing auth tables and Redis session marker are not accepted as an opaque-token/grant store.
- [WBS-MCP-20-04](../pdp-wbs.md) cannot proceed to implementation until its exact storage/interaction contract, applicable migration/file-version choice, configuration ownership, bounded execution approval and safe verification path are separately settled. Planning predecessors and design acceptance do not change its `blocked` status.
- `WBS-MCP-20-02` remains blocked on actual AS contract/proof, transport and trusted endpoint binding; the AS design does not grant any local Passport, RBAC, data scope, or tenant authority to a token.
- No source, schema, state service, dependency, issuer, provider, credential, deployment, OAuth/HTTP test, or ATP evidence follows from this ADR.

## Related records

- [Planning index](../README.md)
- [AS execution dossier](../wbs-mcp-20-04-execution-dossier.md)
- [AS state and interaction review (proposal)](../wbs-mcp-20-04-state-interaction-review.md)
- [SRS](../srs.md)
- [Delivery plan](../pdp-wbs.md)
- [Progress](../progress.md)
- [ADR 0001](./0001-mcp-suite-boundaries.md)
- [ADR 0003](./0003-mcp-oauth-resource-server.md)
