# Architecture Notes

This directory is for long-lived internal technical explanations.

Use it when future contributors need to understand how a subsystem works, what invariants it depends on, and what design boundaries should be preserved during new feature work or refactors.

## Good candidates for this directory

- subsystem architecture overviews
- cross-package execution flow notes
- internal framework patterns
- state, caching, or lifecycle invariants
- technical constraints that should remain stable over time

Representative examples:

- `a-status-module-architecture.md` records the Vona-side `a-status` module boundary, shared-table storage model, module-scoped ownership invariant, `get` / `set` call path, Redlock-protected first-write flow, cache-fresh recheck rule, and refactor safety rules
- `backend-resource-field-workflow.md` records the preferred AI-assisted workflow for adding or refining fields on existing Vona backend resources, including fileVersion decisions, migration safety, shared renderer reuse, locale updates, and verification
- `dto-render-field-name-typing.md` records why DTO-local field-name identity helpers are avoided and the framework-level typing boundary required for complete render-layout constraints
- `a-image-cloudflare-signed-delivery-architecture.md` records the shared `a-image` signed-delivery model, `image-native` vs `image-cloudflare` boundaries, upload-policy invariants, and contract-loop verification expectations for image provider work
- `a-image-refactor-checklist.md` records the recommended execution order for the next `a-image` cleanup pass, including delivery semantic separation, direct-upload lifecycle completion, provider typing cleanup, and the locked decision that `image-native` stays lazy-only
- `a-image-public-contract-followup-checklist.md` records the still-open follow-up items after the `a-image` public-contract shrink pass, including intentionally deferred areas, second-round contraction candidates, `a-file` alignment questions, and the missing frontend Cloudflare direct-upload completion path
- `resource-public-contract-exposure.md` records the shared rule for deciding which backend resource fields belong in public DTO / View / OpenAPI contracts, including runtime allowlisting and the separation from persistence/versioning work
- `resource-custom-api-state-ownership.md` records the preferred Zova state-ownership pattern for resource-bound custom APIs, including `ModelResource` as the single owner, row-grouped cache keys, thin semantic facade models, and invalidation rules
- `zova-upload-policy-query-cache-investigation.md` records the source-backed conclusions about upload-policy query ownership, `disableSuspenseOnInit: true` vs `staleTime: Infinity`, persisted-state restore behavior, and the contrast with page-entry item-state loading
- `class-placement-a-b1-b2.md` records the durable rule for placing backend base classes in `src/lib`, `src/service`, or the global bean shorthand surface
- `router-tabs-design-boundaries.md` records the design intent, workspace-vs-instance identity split, anchor-item role, layout boundary, cache boundary, and refactor safety rules for the router-tabs workbench mechanism
- `zova-goto-navigation-control-flow-semantics.md` records why Zova `$goto...()` helpers preserve synchronous SSR redirect throws, asynchronous Client router promises, browser/no-op `void` outcomes, and the guard-safe `$getPagePath...()` boundary
- `a-ssr-module-architecture.md` records the Vona-side `a-ssr` module boundaries, request-resolution flow, handler-loading bridge, render/redirect integration, cache/HMR rules, and diagnostics surface
- `ssr-retrieve-menus-role-aware-cache-evaluation.md` records the SSR structural menu-cache identity, request-local Passport projection, navigation-disclosure boundary, freshness ownership, current test limitations, and gates for any future caller-specific menu cache
- `ssr-vona-zova-boundary-and-call-chain.md` records the fullstack SSR call chain from Vona request resolution into the generated Zova bundle, clarifies the Vona/Zova ownership split, and preserves the hydration handoff boundary
- `ssr-memory-leak-investigation-guide.md` records the confirmed SSR leak root cause, the formal runtime-core fix, the SSR `ssrRender -> instance.render` fallback bridge used by Zova, and the residual-runtime findings that future memory investigations should reuse
- `ssr-leak-experiment-flags-inventory.md` records the historical `SSR_LEAK_EXPERIMENT_*` surface and confirms that those investigation flags were ultimately removed from active source
- `ssr-leak-experiment-cleanup-checklist.md` records the execution order and verification path used to fully remove the old SSR leak investigation flags from source
- `ssr-route-typing-zova-rest-declaration-visibility.md` records why backend SSR route keys could collapse to `never`, how the generated `zova-rest-*` declaration fix preserves module augmentation visibility, and how the backend consumer path was validated
- `anonymous-token-route-pattern.md` records the invariants for temporary-token anonymous HTTP routes, including the need for `@Passport.public()`, exact sign/verify path matching, and HTTP-level verification of signed URLs
- `vona-cross-model-query-cache-dependencies.md` records Vona source-to-target query-cache dependency direction, transitive propagation, target callback replacement semantics, and the no-duplicate/no-cycle graph safety rules
- `backend-test-resource-lifecycle.md` records ownership, cleanup order, tenant scope, and durable-seed boundaries for persisted backend test data

## What should go elsewhere

- major design or refactor decisions with explicit rationale should go in `../decisions/`
- end-user documentation should not go under `.docs-internal/`
- temporary implementation scratch notes should not be committed here

## Writing guidance

Prefer documents that answer questions such as:

- how does this subsystem fit into the rest of the monorepo?
- what assumptions does it rely on?
- what would future contributors be likely to break by accident?
- what code paths should be traced first when changing this area?
