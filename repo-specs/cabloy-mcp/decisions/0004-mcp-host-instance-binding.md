# ADR 0004: Proposed MCP Host-to-Instance Binding

## Status

Proposed — design draft for `DEC-MCP-04`, not an accepted trust configuration, proxy deployment, source implementation, or `ATP-MCP-INSTANCE-01` result. The accountable decision owner is `zhennann`. The actual public hosts, instance names, proxy operator, issuer/resource registration, and trust settings are `TODO(confirm)`; no live endpoints or credentials belong in this record.

This decision would constrain the accepted instance boundary in [ADR 0001](./0001-mcp-suite-boundaries.md). It depends on the proposed `/mcp` transport and protected-resource metadata in [ADR 0002](./0002-mcp-transport.md) and [ADR 0003](./0003-mcp-oauth-resource-server.md), without accepting either. DEC-MCP-03 owns token validation and local subject mapping; DEC-MCP-07 owns isolated execution context construction.

## Observed Cabloy Basic source

- `vona/src/backend/config/config/config.ts` configures both query and header instance selectors as `x-vona-instance-name`, a default subdomain offset of two, and `proxy.enable: true` with `hostHeaders: 'x-forwarded-host,host'`. Test config disables proxy trust. Neither this configuration nor subdomain labels are an approved MCP endpoint-host allowlist.
- `vona/src/suite-vendor/a-vona/modules/a-instance/src/main.ts` resolves a cached context name, then `config.instance.getInstanceName(ctx)`, query, header, and finally `ctx.subdomains.join('.')`. A getter returning `undefined` falls through; an explicit `''` selects the default instance. The resolver caches its result. Onion metadata can read `ctx.instanceName` early (`a-onion/src/bean/bean.onion.ts`), so a later route/controller check alone cannot repair a previously selected instance.
- `vona/packages-vona/vona-core/src/lib/framework/start.ts` wires `proxy.enable` to Koa `app.proxy` and the subdomain offset to Koa, but does not wire `proxy.hostHeaders`, `proxy.protocolHeaders`, or `proxy.maxProxyCount` as host-trust enforcement. In the inspected Koa runtime, proxy-enabled `ctx.host` can prefer caller-supplied `X-Forwarded-Host` when direct backend access or unsanitized forwarding is possible. `ctx.hostname`/subdomains are therefore not authoritative on their own.
- `a-instance/src/bean/middlewareSystem.instance.ts` calls `initInstance()` before the router/controller guard. `a-instance/src/service/instance.ts` may load or start the selected instance before OAuth validation; the instance service is not a pure host-allowlist validator. Ordinary `performAction()` tests do not exercise this external HTTP system-middleware order.

These observations are design inputs, not evidence that the proposed MCP checks already exist. Existing non-MCP instance selection and ordinary HTTP authorization must retain their behavior.

## Proposed decision

### Deployment-owned binding and ingress trust

Establish a server-owned, immutable-at-request-time deployment map from each **canonical external HTTPS MCP origin and `/mcp` endpoint URL** to exactly one enabled Vona instance and one canonical OAuth protected-resource identifier. Do not derive this map from subdomain labels, persisted instance presence, token claims, the request Host, user input, or tool arguments. Reject ambiguous hosts, duplicate or conflicting entries, disabled instances, missing public resource configuration, and a resource identifier shared between distinct instance bindings. For the first increment, use one canonical public endpoint per instance; any alias, multiple hosts for one instance, shared-host/path multiplexing, or canonical redirect requires a separately reviewed mapping and matching OAuth registration/discovery policy.

The proxy or directly exposed listener must have an explicit trust model. At a proxy ingress, accept forwarded host/protocol information only when the immediate peer is an approved proxy (or an equivalently restricted network boundary) **and** that proxy removes client-provided forwarding headers and writes one controlled external authority and scheme. A directly reachable backend must ignore or reject forwarded-host values, not assume that `app.proxy` authenticates the peer. If the backend remains reachable outside the trusted ingress and Koa still trusts `X-Forwarded-Host` globally, an MCP-only check cannot make the deployment safe; restrict that reachability or establish a verified upstream enforcement mechanism before activation. Reject conflicting or multiple authority values and insecure/ambiguous external schemes rather than choosing the first attacker-controlled value. Do not assume the configured `hostHeaders`, `protocolHeaders`, or `maxProxyCount` enforce this in the current Vona runtime. The exact proxy list, network exposure, header policy, and public host/resource entries remain `TODO(confirm)` with the deployment owner.

Normalize an externally obtained authority only under an approved, testable policy: parse a single host and permitted port, normalize the DNS scheme/hostname case and approved IDNA/trailing-dot form, handle a permitted IPv6 literal explicitly if supported, and compare against the configured allowlist. Preserve the path and significant port in the resource identifier. Reject malformed authority, userinfo, unexpected ports, ambiguous comma lists, unapproved aliases, and hostname suffix lookalikes; do not interpolate raw headers into resource URLs, metadata, redirects, logs, or the instance map. This normalization must remain compatible with DEC-MCP-03's agreed canonical-resource and token-audience comparison. The trusted deployment map, not an in-request header, supplies the metadata resource and audience expected after normalization.

### Resolve before instance initialization

For `/mcp` and the matching path-specific OAuth protected-resource metadata route, propose a single authoritative selection before any ordinary query/header/subdomain fallback or `initInstance()` work. Evaluate the approved ingress-host policy and map first, then return the **explicit** mapped instance name (including `''` if that is intentionally configured). Unknown, ambiguous, disabled, or conflicting inputs **throw/deny**; do not return `undefined` or `null` as a denial marker. Never change `ctx.instanceName` after `ctx.instance` has been initialized.

The existing `config.instance.getInstanceName(ctx)` is a candidate early hook because it precedes the generic selectors. It is application-wide: any integration must identify only the exact MCP transport and metadata paths, delegate other routes to the prior non-MCP behavior, and prove whether early onion access invokes the hook before the route-specific validation. For non-MCP paths the existing getter (if configured) must be composed explicitly rather than overwritten or returned to generic fallback by accident. A pre-instance system middleware may assist, but a router/controller-only guard is insufficient while the generic resolver can cache an untrusted selection or initialize an instance first. The actual hook, install order, disabled-endpoint behavior, and interactions with existing application getter overrides are `TODO(confirm)` for the separately approved implementation; if an isolated early selection cannot be achieved, keep MCP disabled rather than changing global instance-selection semantics.

The effective bound instance in the HTTP request, local subject mapping, `ctx.config`, and any fresh DEC-MCP-07 executor context must be the **same** approved instance. Re-validate that binding before `tools/list` and `tools/call`; an argument or nested executor option cannot select another instance. Unknown or disabled endpoint hosts must fail before public metadata is emitted or protected tool visibility/business lookup begins. Vona might already have performed safe middleware metadata work; acceptance requires a real HTTP trace proving no unintended tenant initialization or controller dispatch on rejected requests.

### Selectors, token relation, and metadata

For MCP paths, propose **rejecting** a query or `x-vona-instance-name` header selector even when its value equals the mapped instance; these selectors have no MCP contract and rejecting their presence avoids ambiguity, duplicates, an empty default selector, or later divergent evaluation. Reject a selector encoded through any documented alternative input path. Ordinary non-MCP routes retain their existing selector behavior. No client-provided `iid`, organization name, path segment, or JSON argument can change the bound instance.

The canonical protected-resource metadata for each configured MCP endpoint must advertise that endpoint's configured `resource` and approved issuer identifier(s), not values synthesized from an untrusted Host. The proposed `/.well-known/oauth-protected-resource/mcp` path must use the **same** host/instance binding as `/mcp`. Public metadata must not expose local instance names, selectors, other hosts' resource identifiers, or private topology. When shared caches or reverse proxies are present, key or bypass the cache by validated canonical endpoint URL so one host cannot receive another host's metadata; never treat a generic `Vary` value alone as proof of isolation.

A valid OAuth token must be independently validated for the **bound resource** under DEC-MCP-03. If the issuer adds a trusted instance/tenant claim, its documented semantics must agree with the host-bound instance or the call fails; an untrusted claim is not an instance selector. If such a claim is absent, lack of a claim is not an unrestricted grant: the unique per-instance resource registration and issuer grant, followed by an unambiguous active local `(issuer, sub, bound instance)` mapping, must authorize this instance. Confirm the actual issuer's grant/claim contract before accepting either case. Do not probe another instance merely to distinguish a local missing resource from an authorization failure.

### Failure behavior and ownership

An unknown/unsafe host, untrusted forwarded value, conflicting selector, missing/duplicate map entry, invalid scheme/resource, or inconsistent token binding fails closed without default-instance fallback, wrong-instance metadata, or business dispatch. Expose only a bounded nondiagnostic response; finalize HTTP status and disabled-endpoint behavior with DEC-MCP-02/03. Emit redacted denial categories and safe correlation through DEC-MCP-08 without logging raw Host/forwarding strings or bearer tokens. Configuration validation must block MCP activation on incomplete map/proxy/resource settings; this proposal does not alter ADR 0001's default-off setting or normal non-MCP routes.

## Alternatives rejected or deferred

- **Derive tenant from any subdomain:** rejected for MCP because a derived label does not prove ownership of an allowed base domain and query/header selection can take precedence.
- **Trust `ctx.host`/`app.proxy` alone:** rejected because proxy enablement does not authenticate the peer or sanitize forwarded-host input.
- **Validate host only inside the controller:** rejected because instance name can be cached and initialized earlier in the HTTP chain.
- **Trust the OAuth subject or token tenant as the instance selector:** rejected because token validation and local identity do not replace a server-owned endpoint/resource binding.
- **Support aliases or cross-instance resource audience by default:** deferred pending explicit metadata, issuer grants, canonicalization, and cache isolation design.

## Acceptance and execution gates

Before accepting `DEC-MCP-04`, resolve and record:

1. deployment-owned canonical HTTPS host/port → `/mcp` URL → unique resource → Vona instance map, including empty-name/default instance, disabled/missing entries, permitted aliases, and registration owner;
2. trusted ingress architecture, directly reachable backend policy, allowed proxy peers, forwarded-host/proto stripping/replacement, conflict/duplicate handling, and request authority normalization; confirm real Vona/Koa behavior in the selected runtime rather than relying on configured but unwired host settings;
3. an early path-specific selection mechanism and order relative to lazy name caching, instance initialization, protected metadata, controller guards, and non-MCP routes; no globally changed tenant semantics;
4. DEC-MCP-03 issuer/resource registration, token-recipient binding, optional trusted instance-claim semantics, and local subject mapping; missing claim and same-subject cross-instance behavior;
5. approved failure/status taxonomy, caching separation, redacted operational owner, and narrow real-HTTP `ATP-MCP-INSTANCE-01` plus OAuth/metadata/ordinary-route non-regression cases covering direct/proxied/malformed/unknown/conflicting hosts, empty/default selectors, disabled instances, and two-instance isolation.

This ADR proposes no source/configuration change or runtime/ATP proof. Planning checks do not accept DEC-MCP-04 or permit endpoint exposure. A separately approved bounded execution dossier is required after its predecessor WBS/design gates close.

## References

- [A-MCP planning index](../README.md)
- [Instance and token contracts](../srs.md#tenant-identity-privacy-and-authorization-contracts)
- [Host-instance acceptance scenario](../test-plan.md#atp-mcp-instance-01-host-binding-and-cross-instance-isolation)
- [Vona instance resolution guide](../../../repo-docs/backend/multi-instance-and-instance-resolution.md)
- [Vona instance resolver](../../../vona/src/suite-vendor/a-vona/modules/a-instance/src/main.ts)
- [Vona instance middleware](../../../vona/src/suite-vendor/a-vona/modules/a-instance/src/bean/middlewareSystem.instance.ts)
- [Vona application proxy configuration](../../../vona/src/backend/config/config/config.ts)
- [Vona proxy startup wiring](../../../vona/packages-vona/vona-core/src/lib/framework/start.ts)
