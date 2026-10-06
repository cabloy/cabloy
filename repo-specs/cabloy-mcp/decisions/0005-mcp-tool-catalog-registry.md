# ADR 0005: Proposed MCP Tool Catalog and Fixed Registry

## Status

Proposed — design draft for `DEC-MCP-05`; not an accepted annotation API, enabled tool list, source implementation, `ATP-MCP-CONTRACT-01/02` result, or authorization to expose controllers. The accountable decision owner is `zhennann`. The exact metadata API, first reviewed operation set, registry integration point, and generation command remain `TODO(confirm)`.

This proposal refines the accepted candidate-source and fixed-dispatch boundary in [ADR 0001](./0001-mcp-suite-boundaries.md). It depends on the proposed transport in [ADR 0002](./0002-mcp-transport.md), but does not accept it. DEC-MCP-06 owns eligibility, risk, confirmation, and result policy; DEC-MCP-07 owns executor/context adaptation. A catalog entry or MCP annotation grants neither business authorization nor permission to dispatch.

## Observed Cabloy Basic source

- `a-openapi/src/bean/bean.openapi.ts` exposes `generateJson()` and `generateJsonOfControllerAction()`; generation is cached by OpenAPI version and locale, so a runtime builder must define how contract changes invalidate any upstream cache. `a-openapi/src/service/openapi.ts` collects enabled controller onions and DTO/entity schemas, omits API-excluded controllers/actions, uses request mapping metadata for method/path, and constructs `operationId` from the first OpenAPI tag plus action name or override. OpenAPI `security` is a broad bearer signal, not the MCP tool policy or route ownership proof.
- `a-openapiutils/src/lib/decorator/api.ts` implements `@Api.exclude()` on classes and methods with `SymbolOpenApiOptions`; the collector checks both independently. The annotation is an upstream hard exclusion. Neither an MCP decorator nor a source-to-MCP fixed registry was observed; the `cabloy-mcp` suite is planned new source, not a current module.
- The emitted OpenAPI document and generated module `.metadata` records are related contract surfaces, not interchangeable dispatch authorities. Single-action generation does not by itself prove that a controller is enabled in the router; the OpenAPI collector inspects own prototype methods, and emitted response schemas can reflect Cabloy's response envelope. `a-web/src/main.ts` registers enabled controllers after module loading, while controller HMR clears OpenAPI caches. A candidate must be correlated to a uniquely registered controller action and actual route method/path rather than trusting an `operationId`, tag, localized description, or URL string alone. Framework route/config overrides and cache behavior must be checked in the approved implementation.

These are read-only design inputs. They do not demonstrate that any OpenAPI route is MCP-safe or that catalog generation, fresh registration, or runtime policy currently exists.

## Proposed decision

### Metadata ownership and inheritance

The planned `cabloy-mcp` module owns an independent MCP metadata namespace and authoring helper (tentatively `@Mcp.exclude()` and `@Mcp.tool({...})`) or an equivalently reviewed metadata adapter. An explicit, reviewed module-owned manifest remains the deployment allowlist even where controllers carry MCP annotations. The helper may be exported for existing domain controllers to annotate their own operations only after checking module import and dependency directions: domain modules must not acquire a cyclic lifecycle dependency on a gateway that scans them. Where that cannot be proven, use an authored manifest or a separately owned neutral metadata contract instead of importing `cabloy-mcp` into business owners. The mechanism must not edit generated `.metadata` output, change `@Api.exclude()` semantics, or turn MCP metadata into a second request/response DTO authority. The accepted configuration/default-off surface remains `config.modules['cabloy-mcp']` under ADR 0001.

Propose explicit, independently testable controller-level exclusion and action-level inclusion/metadata. A controller exclusion is absolute for its actions; an action exclusion is absolute for that action; no lower-priority include/override re-enables either. Default for an unannotated action is **not enabled**. Any inherited action annotation, decorator-order merge, application override, or enabled-controller filtering must be defined and tested before approval. Unknown metadata keys, duplicate/conflicting declarations, or unresolved adapters fail catalog validation instead of being silently ignored.

Action metadata proposes a stable machine-owned name override, safe title/description source, optional requested scope/policy reference, declared input/output adapter identifiers, and risk/read-only/destructive/idempotency/confirmation descriptors. These declarations express author intent, **not** independently verified side-effect safety or granted scope. DEC-MCP-06 must separately review their semantics and result/field minimization before enablement. Localized titles and descriptions are presentation only: locale never changes a stable name, route, policy key, schema identity, or authorization result. Sanitize/bound text before publishing it to an external AI client and never treat that text as an instruction or as a substitute for policy.

### Candidate correlation and naming

Generate a read-only candidate inventory from current OpenAPI/DTO emission plus enabled controller/request-mapping metadata. Establish a one-to-one correspondence among a registered controller full name and action key, effective HTTP method and route path, the emitted OpenAPI operation, and the metadata record. Prohibit API-excluded operations regardless of any MCP annotation; prohibit emitted-only or route-only entries without a unique owner. Detect ambiguous method/path matches and multiple actions claiming one operation before enabling any affected tool. Use the emitted request/response schemas as contract truth, applying only explicit, reviewable JSON-schema projections rather than duplicating DTO definitions.

For an unapproved candidate inventory, propose a deterministic diagnostic key derived from canonical module/bean identity plus action key, not from OpenAPI tags, `operationId`, translated prose, route path, or caller input. **Require a reviewed explicit public tool name before enablement**: bean names and action keys themselves may change during refactoring and cannot promise stable public identity. Validate public names case-sensitively with a chosen conservative ASCII-safe grammar/length policy, reject duplicates across all enabled tool candidates (including aliases), and maintain an explicit rename/compatibility rule; do not append a counter, silently pick a winner, or let `serverInfo.name` disambiguate operations. The selected MCP revision recommends rather than mandates the 1–128 character ASCII name convention; this proposal would make a concrete subset an application rule. Exact separator, versioning, allowed character set, and catalog-inclusion policy are `TODO(confirm)` against emitted examples and the selected protocol/SDK.

Catalog states remain distinct: registered route → emitted OpenAPI operation → MCP metadata/candidate → DEC-MCP-06 shape-and-risk eligible → explicitly deployment-approved and enabled registry entry → subject-visible tool → call-time-authorized operation. Neither OpenAPI presence, a method name, an `@Mcp.tool` marker, nor deployment enablement on its own authorizes a call. The initial reviewed allowlist and its owning domain operators are `TODO(confirm)`; until then the default enabled set is empty.

### Immutable registry and freshness

Propose a deterministic, server-owned **in-memory registry snapshot** built only after enabled modules/controllers and relevant OpenAPI metadata are ready, before serving MCP requests. Runtime module and route registration is distinct from CLI-generated `.metadata` typing/exports; use the existing `npm run vona` CLI metadata family under a separately approved execution dossier, not as the registry itself. Each immutable entry binds the unique name to one controller full name/action, effective method/path, request/response schema identity, approved adapter identifiers, policy reference, and fingerprint of the source/metadata/config revision. Validate duplicate names, route-owner mismatches, missing/excluded operations, unsupported references, unresolved schemas or adapters, and stale fingerprints before activation. On failure, keep the MCP surface disabled or omit only an independently isolated affected tool under an explicitly approved atomic policy; never continue dispatching a previous snapshot or re-resolve a name from a URL supplied by a caller.

Snapshot ownership and publication should be atomic for a process revision; concurrent requests must see one consistent snapshot and approved policy revision. A change to DTO/controller metadata, generated artifacts, module enablement, or deployment tool policy requires an explicit rebuild/revalidation and a documented cache invalidation or restart path. With multi-process or multi-instance deployments, verify every worker has a matching approved source/configuration fingerprint before serving tools; do not assume a shared in-memory snapshot or turn OpenAPI cache TTL into authorization freshness. Keep per-request visibility and call-time authority separate from the immutable structural registry. No MCP-owned persistence, startup database migration, handwritten generated consumer, or dynamic client-side registration is included; introducing storage reopens DEC-MCP-09 and the `vonaModule.fileVersion` decision.

### Protocol-facing list and dispatch boundary

For the proposed 2026-07-28 MCP profile, project only the caller's current approved subset into `tools/list`; a declared tools capability must serve the method even when its result is empty. The profile's completed list response requires `resultType: 'complete'`, nonnegative `ttlMs`, and `cacheScope` (`private` for a subject-specific list). Stable ordering and bounded output/pagination are required by this design, with opaque cursors and snapshot/policy/subject binding if pagination is used. A cached list that depends on authorization must be private and invalidated/bounded on permission or registry changes; absence of safe invalidation requires no cross-request visibility cache (choose an approved non-caching `ttlMs` policy). If a snapshot or role/policy changes between pages, reject the stale cursor and restart discovery instead of mixing authorities. Final pagination and list-change/subscription behavior must be checked against the accepted protocol revision and SDK before implementation; do not import session-wide or unconditional notifications from older MCP revisions.

Tool definitions publish a valid JSON Schema object-root `inputSchema`, reviewed optional `outputSchema`, and only appropriate presentation annotations. JSON-schema `$ref`/component resolution and framework-specific extensions must be normalized or rejected explicitly; an unconstrained `any` is not a reviewed request contract. The optional output schema can describe any approved JSON result, not only objects; if published, the actual structured output must conform, with any compatibility text governed by DEC-MCP-06. MCP read-only/destructive/idempotent hints remain hints, not server-side safety decisions. `tools/call` resolves the requested name only in the current server snapshot, validates arguments using the approved schema/mapping, rechecks endpoint/subject/scope/deployment/risk/role/data-scope authority, and dispatches only through the DEC-MCP-07 fixed executor boundary with explicit `innerAccess: false`. A list result or cached cursor is not a capability token. Unknown, excluded, stale, revoked, or ambiguous names cannot fall back to raw controller lookup. Exact list/call wire errors and structured-result shape belong to DEC-MCP-02/06 and require protocol tests.

## Alternatives rejected or deferred

- **Turn every OpenAPI operation into a tool:** rejected; OpenAPI is a candidate contract source and does not encode reviewed eligibility, instance, RBAC/data scope, risk, or result disclosure.
- **Use `operationId`, bean/action key, tag, localized label, or route as a stable public dispatch name by default:** rejected; these can change under refactoring, collide, be translated, or lack a verified one-to-one action owner. Bean/action identity remains part of the validated _internal_ binding.
- **Use `@Api.exclude()` as the only MCP switch:** rejected; an otherwise public OpenAPI operation may still be MCP-excluded, while an API-excluded action may never be reintroduced.
- **Resolve the caller's tool name to an arbitrary URL/bean at call time:** rejected because it bypasses the server-owned registry and creates a confused-deputy path.
- **Persist a registry or silently hot-swap partial snapshots:** deferred; the first increment is schema-free, and changes to storage, worker coordination, or hot-reload need explicit decisions and proof.

## Acceptance and execution gates

Before accepting `DEC-MCP-05`, resolve and record:

1. exact MCP annotation/manifest API, symbols, placement and dependency direction across existing domain controllers, class/action inheritance, merge/decorator order, safe documentation/localization, and who approves each metadata entry;
2. one-to-one correlation of actual enabled controller/action/request mapping with emitted OpenAPI operations, API-exclusion semantics, DTO/schema transformations, overrides, and the versioned OpenAPI/cache source;
3. deterministic stable-name grammar with explicit collision/rename policy, registry entry schema, reviewed operation owner set, first allowlist, and handling for orphaned, duplicate, stale, unsupported, or disabled entries;
4. startup/build/restart/invalidation mechanism and atomic in-memory snapshot lifecycle, per-worker revision agreement, locale-specific presentation, deployment-policy refresh, and what fails closed on drift;
5. selected MCP protocol revision/SDK behavior for tool schemas, list pagination/cache freshness, annotations, and call errors, coordinated with DEC-MCP-02, DEC-MCP-06, and DEC-MCP-07;
6. narrow `ATP-MCP-CONTRACT-01/02` plus direct auth/list-call drift tests, including DTO edits, API vs MCP exclusions, duplicate names, route overrides, stale caches/worker revisions, locale changes, revocation between list and call, and non-MCP OpenAPI behavior.

This ADR proposes no source, provider configuration, enabled tools, or runtime/ATP proof. Static planning checks cannot accept it or authorize a bounded implementation dossier while its predecessor design/WBS gates remain open.

## References

- [A-MCP planning index](../README.md)
- [Tool catalog contracts](../srs.md#tool-catalog-and-metadata-contracts)
- [Candidate catalog WBS](../pdp-wbs.md#wbs-mcp-30-01-build-the-dtoopenapi-candidate-catalog-and-mcp-metadata)
- [DTO/schema acceptance](../test-plan.md#atp-mcp-contract-01-dtoopenapi-schema-projection-and-freshness)
- [MCP tools, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [MCP list pagination, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/pagination)
- [MCP caching, 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching)
- [Vona OpenAPI generation](../../../vona/src/suite-vendor/a-vona/modules/a-openapi/src/bean/bean.openapi.ts)
- [Vona OpenAPI registry collection](../../../vona/src/suite-vendor/a-vona/modules/a-openapi/src/service/openapi.ts)
- [Vona API exclusion decorator](../../../vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/decorator/api.ts)
