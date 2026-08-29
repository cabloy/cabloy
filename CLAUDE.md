# Cabloy Monorepo Guidance

## Repository identity

Detect the active edition from the repository-root marker before making edition-sensitive assumptions:

- exactly `__CABLOY_BASIC__` present → Cabloy Basic, the public framework/reference edition
- exactly `__CABLOY_START__` present → Cabloy Start, the private commercial edition delivered as licensed source
- both markers present → treat the checkout as invalid or ambiguous and stop before giving edition-specific guidance
- neither marker present → inspect the owning `package.json` and nearby repository structure, then ask before making an edition-specific assumption

Always perform this detection before making UI-sensitive assumptions, choosing frontend examples, recommending module-specific workflows, or assuming the project creation path.

## Monorepo layout

- `package.json` is the primary shared workflow entrypoint.
- `vona/` contains the backend framework, backend modules, and the Vona CLI.
- `zova/` contains the frontend framework, frontend modules, and the Zova CLI.
- `repo-docs/` contains the unified public documentation.
- `repo-docs-internal/`, when present, contains edition-local maintainer notes and ADRs; treat it as optional supporting material, not as a shared-edition requirement.
- `repo-specs/` contains product and business specifications, delivery plans, and suite-local ADRs.
- `repo-e2e/` contains the end-to-end test project.
- `repo-observability/` contains local observability infrastructure.
- `.claude/` contains Claude commands, skills, and settings.

## Preferred workflow

Before inventing a custom implementation path:

1. check the root `package.json`
2. detect the edition marker
3. inspect the relevant CLI entrypoint:
   - `npm run vona`
   - `npm run zova`
4. use existing command families before writing framework scaffolding manually
5. verify the result with targeted checks or shared root scripts

## Documentation boundary

- Put user-facing and agent-facing guidance in `repo-docs/`.
- When an established `repo-docs-internal/` home exists, use it for maintainer rationale, architecture notes, and engineering ADRs. Do not infer or create that path from edition identity alone.
- If the active repository has no established internal-documentation home, do not block the workflow or move internal rationale into public docs automatically; use existing documentation homes or ask before establishing one.
- Put product and business specifications, delivery plans, acceptance records, and suite-local ADRs in `repo-specs/` when that repository surface exists.
- Do not mix internal rationale into public how-to pages unless a trimmed user-facing explanation is genuinely needed.

## AI development rules

- Prefer CLI-backed workflows over manual scaffolding whenever Vona or Zova already provides a generator, refactor, metadata, or verification command.
- The Cabloy contract-loop model applies to both Cabloy Basic and Cabloy Start; detect the edition to choose commands and output paths, not to redefine the workflow model.
- Treat contract-loop work as one of four branches: forward chain, reverse chain, consumer drift, or local dependency drift.
- For the forward chain, change backend contract truth first and regenerate frontend consumers rather than hand-patching them.
- After forward regeneration, keep frontend follow-up thin: prefer semantic model facades and reuse the existing resource-owner when the custom API still belongs to the same resource.
- For schema-driven UI, treat backend entity/DTO/OpenAPI metadata as contract truth; prefer `$apiSchema` or the owning `ModelResource` with automatic `ZForm` rendering, regenerate generated consumers, and never duplicate schema metadata or hand-edit generated consumers.
- Treat localized `$apiSchema` and `ModelResource` schemas as locale-scoped reactive state: do not retain a schema facade or derived snapshot created before a locale change; reacquire it through the current runtime and reactive owner.
- Keep reusable query, cache, mutation, and resource state in models or `ModelResource`; a page-specific, low-reuse action may call the generated `$api` directly when no shared state or cache ownership is required.
- When one persisted business resource serves both Admin Resource and Web self-service consumers, keep one domain and persistence boundary; where audience authority or experience differs, split API/DTO contracts, server-side scope, frontend state ownership, and page architecture—reuse the generic Resource owner for Admin and use dedicated state/pages for a genuinely distinct Web self-service contract.
- For the reverse chain, always run the relevant Zova build first, then run `npm run deps:vona`: use `npm run build:zova:admin` for Admin changes, and also run `npm run build:zova:web` when the Web flavor is affected. Do not treat `build:rest:*` alone as sufficient, because the SSR bundle and rest output must move together.
- If the generated `.zova-rest` artifacts already contain the expected changes but Vona consumers still see stale types after `npm run deps:vona`, treat it as local dependency drift: delete `vona/node_modules` and reinstall dependencies before further debugging or hand-patching dependency links.
- For Cabloy Start, apply the same reverse-chain logic but resolve the Start-specific flavor names and generated-output paths from the active Start repo before recommending commands.
- Treat legacy docs as input material, not as unquestioned truth. When docs conflict with source code, prefer current source code.
- For frontend work, assume Cabloy Basic and Cabloy Start share a frontend engineering layer but may diverge in UI layer, frontend flavors, suite/module availability, SSR site baselines, project assets, and generated outputs.
- For Zova frontend analysis, do not default to generic Vue reinterpretation first. Read the code through Zova’s controller / bean / IoC architecture before mapping it to Vue concepts.
- For Zova source-reading or Vue-vs-Zova explanation tasks, start from the frontend reading guides and source-reading map in `repo-docs/frontend/` before doing framework-neutral reinterpretation.
- In Zova application modules under `zova/src/module/**`, `zova/src/module-vendor/**`, `zova/src/suite/**/modules/**`, and `zova/src/suite-vendor/**/modules/**`, use emitted runtime suffixes for relative imports and exports: `.js` for `.ts` targets and `.jsx` for `.tsx` targets, including type-only imports and module tests. Preserve the deliberate `.ts`/`.tsx` convention in `zova/packages-utils/**` and `zova/packages-zova/**`; do not generalize this rule to Vona, CLI/templates, dependencies, generated output, or build artifacts.
- In Zova page routes, any route with dynamic `params` must define `route.name`; do not rely on unnamed path-keyed routes for typed `$params`. Static routes should omit `route.name` unless a documented named-route requirement exists; use `$router.getPagePath(...)` for canonical static URL generation rather than adding a name or alias for convenience. Ordinary business routes without `locale` params should omit app-config aliases unless a documented system, compatibility, or user-facing URL exception requires one. Choose `ssrProfile` from the page's rendering contract: Web remains `public` by default, while `session` is an explicit choice for cookie-backed state, protected admission, personalized first paint, or private SSR data; the absence of a locale parameter alone does not select a profile. `requiresAuth` is independent, so anonymous routes must explicitly use `requiresAuth: false`. Regenerate page metadata after route changes.
- For frontend async state that affects rendering or interaction across consumers, prefer model-owned `$useStateData(...)` over controller-managed fetch/cache state.
- Default to establishing such query state during render. Use `disableSuspenseOnInit: true` only for relatively stable query-backed state when you want to skip the init-time `query.suspense()` kick; it does not prevent query creation, fetches, or hydration-time rendering. If strict readiness is needed later, wait explicitly at the interaction boundary.
- For render-driving async state, read the current query-owned reactive surface (`query.data` or a model-derived projection); an awaited `query.refetch()` result is valid only for one-shot interaction or orchestration and must not become a parallel ongoing controller/render state owner.
- In SSR, keep server HTML and the client's hydration-time initial render equivalent. When server rendering intentionally omits private, cookie-unavailable, or browser-only state, keep the same neutral shell or placeholder through hydration and defer its query/load/render branch to an explicit post-hydration, admission, mounted, or interaction boundary.
- Keep repo-wide AI rules in `CLAUDE.md` short and durable; put branching Zova analysis workflows in `.claude/skills/`.
- After implementation, do not launch broad reviews automatically; when review is needed, scope it to the current diff and report only high-confidence issues.
- Do not modify shared environment identity or ports merely to bypass a busy resource. For intentional parallel worktree setup, follow `repo-docs/fullstack/parallel-worktree-environment.md`; otherwise wait for the shared resource or ask the user. Create or change worktree-local environment overrides only through the explicitly invoked `cabloy-worktree-environment` skill and its confirmation phase, and only in `vona/env/.env.local` and `zova/env/.env.local`; never modify flavor-, mode-, app-mode-, or runtime-specific `.env.*.local` files. The skill derives the standard `APP_NAME`, `SERVER_LISTEN_PORT`, `DEV_SERVER_PORT`, `DEV_SERVER_HMR_PORT`, and API-derived `API_BASE_URL` tuple only from Git worktree metadata and fixed port baselines; never read or expose `.env*` content while recommending values. Admin and Web are alternative commands using this shared tuple and must not run concurrently in one worktree; use another linked worktree for concurrent use. Detect the active edition before choosing scripts, and never run `npm run init` as an automatic follow-up.
- For SSR theme-sensitive frontend work, detect the active edition marker and UI library before making assumptions. Cabloy Basic currently means DaisyUI + Tailwind CSS assumptions; Cabloy Start currently means Vuetify assumptions.
- In Web SSR without cookie-backed theme resolution, do not treat server reads of `$theme.dark`, `$theme.darkMode`, or `$token` as final browser truth. Keep theme-sensitive SSR branching hydration-tolerant or defer final theme-sensitive decisions to the client.
- Do not assume Cabloy Basic and Cabloy Start use the same adapter-level SSR theme handoff. Verify the active theme handler and client hydration path before changing SSR theme behavior.
- Reuse existing repo terminology: Cabloy, Vona, Zova, suite, module, bean, SSR, SPA, Web, Admin.
- For backend base-class placement, use the A / B1 / B2 rule from `repo-docs/ai/class-placement-rule.md`.
- Pure helper bases belong in `src/lib`; subclass-only bases should be evaluated case by case and often belong in `src/lib`.
- Runtime-anchor bases that still require container-managed or selector/class-token behavior but should not be global beans should prefer `src/service` with `@Service()`.
- Service-scene runtime-anchor bases that should not register in `IBeanRecordGeneral` should prefer the `src/service/*_.ts` form.
- `src/bean` defines the global shorthand surface; classes that should not appear in `IBeanRecordGlobal` should move to `src/lib` or `src/service` rather than being filtered by `@Virtual()`.
- When backend code references `this.bean.xxx`, `ctx.bean.xxx`, or `app.bean.xxx`, use `IBeanRecordGlobal` and module `src/.metadata/index.ts` as the first static lookup surface; use `IBeanRecordGeneral` or `src/service` only when the target is not a global shorthand.
- When adding a persisted field to an existing backend resource, ask the user whether `vonaModule.fileVersion` should be incremented before changing `meta.version.ts` or the module schema path. If yes, add a new migration version and bump `fileVersion`. If no, keep the current `fileVersion` and fold the schema change into the current version path. Do not assume the versioning strategy without confirmation.
- In shared-database multitenancy, do not use `table.unique(...)` for business uniqueness. Keep ordinary indexes for lookup performance and enforce tenant-scoped uniqueness in the business layer.
- In Vona, a tenant corresponds to an instance. Ordinary resource-model CRUD is automatically scoped to the active instance; treat records absent from that scope as absent, and do not use raw cross-instance probes merely to choose between `403` and not-found behavior. Model future multi-merchant boundaries explicitly inside an instance.
- Model cross-Model query-cache dependencies as one directed, acyclic `modelsClear` / `modelsClearedBy` graph, and verify source mutations refresh warmed dependent queries; follow [Cross-model query-cache dependencies](repo-docs/backend/cache-guide.md#cross-model-query-cache-dependencies) before designing a nontrivial graph.
- For `@Api.field(...)` and related schemaLike composition, framework guards now preserve previously attached OpenAPI metadata across schema rebuilds, but structure-shaping schemaLike is still order-sensitive. Treat `v.object(...)`, `v.array(...)`, `v.optional()`, `v.nullable()`, `v.default(...)`, and preprocess/transform wrappers as structure-shaping; keep the final structure-defining schemaLike last and verify emitted schema/OpenAPI output after such edits.
- `@Core.transaction(...)` defaults to `REQUIRED`: it starts a transaction only when none exists and otherwise joins the current datasource transaction without upgrading its isolation. Prefer it over manual `inTransaction` wrappers for atomic service methods; use `REQUIRES_NEW` only when an independently committed boundary is explicitly required.
- For replay-safe transient failures, use `@Core.retryable(...)` with an explicit `errorCodes` allowlist. It retries the downstream AOP suffix, so place it closest to the method when it must wrap and retry a `@Core.transaction(...)` boundary; use `ownerOnly: true` for dual-role leaves that must not retry inside a caller-owned transaction; do not retry external side effects or infer retryability from isolation level.
- Backend tests that use scoped Vona state must own an `app.bean.executor.mockCtx(...)` boundary; every intentionally competing operation must run in a separate `mockCtx(...)`.
- Do not set `TEST_CONCURRENCY=false` for normal `npm run test` or CI runs: an unset value defaults to concurrent execution. For stateful `node:test` suites, declare `{ concurrency: false }` explicitly. Prove business contention by explicitly launching competing operations and asserting their combined durable outcome, never through runner parallelism or scheduling.
- Unit tests must delete every test-owned persisted resource in `finally`, using precise owned identities and reverse dependency order.
- Shared durable test or local-development fixtures must be created through the owning module's `meta.version.ts` `seed()` hook and treated as read-only by tests; the managed seed path starts from a newly recreated database rather than repeating against one database.

## Verification expectations

- For docs changes: run the docs build and verify links/navigation where practical.
- For code-generation or workflow guidance changes: verify that the referenced scripts and command families still exist.
- For code changes: prefer the narrowest meaningful verification first, then use shared root scripts when broader confidence is needed.
- Any change to `meta.version.ts` requires running `npm run test` so the test database is reinitialized and schema/data consistency issues surface early.
