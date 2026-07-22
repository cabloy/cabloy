# Cabloy Monorepo Guidance

## Repository identity

This repository is **Cabloy Basic**, the public framework/reference edition, identified by the root marker file:

- `__CABLOY_BASIC__`

A sibling repository named `cabloy-start` is the private commercial edition, delivered as a licensed separate source repository and identified by:

- `__CABLOY_START__`

Always detect the active edition before making UI-sensitive assumptions, choosing frontend examples, recommending module-specific workflows, or assuming the project creation path.

## Monorepo layout

- `package.json` is the primary shared workflow entrypoint.
- `vona/` contains the backend framework, backend modules, and the Vona CLI.
- `zova/` contains the frontend framework, frontend modules, and the Zova CLI.
- `cabloy-docs/` contains the unified public documentation.
- `.docs-internal/` contains internal engineering notes and ADRs.
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

- Put user-facing and agent-facing guidance in `cabloy-docs/`.
- Put maintainer rationale, architecture notes, and ADRs in `.docs-internal/`.
- Do not mix internal rationale into public how-to pages unless a trimmed user-facing explanation is genuinely needed.

## AI development rules

- Prefer CLI-backed workflows over manual scaffolding whenever Vona or Zova already provides a generator, refactor, metadata, or verification command.
- The Cabloy contract-loop model applies to both Cabloy Basic and Cabloy Start; detect the edition to choose commands and output paths, not to redefine the workflow model.
- Treat contract-loop work as one of four branches: forward chain, reverse chain, consumer drift, or local dependency drift.
- For the forward chain, change backend contract truth first and regenerate frontend consumers rather than hand-patching them.
- After forward regeneration, keep frontend follow-up thin: prefer semantic model facades and reuse the existing resource-owner when the custom API still belongs to the same resource.
- For the reverse chain, always run the relevant Zova build first, then run `npm run deps:vona`: use `npm run build:zova:admin` for Admin changes, and also run `npm run build:zova:web` when the Web flavor is affected. Do not treat `build:rest:*` alone as sufficient, because the SSR bundle and rest output must move together.
- If the generated `.zova-rest` artifacts already contain the expected changes but Vona consumers still see stale types after `npm run deps:vona`, treat it as local dependency drift: delete `vona/node_modules` and reinstall dependencies before further debugging or hand-patching dependency links.
- For Cabloy Start, apply the same reverse-chain logic but resolve the Start-specific flavor names and generated-output paths from the active Start repo before recommending commands.
- Treat legacy docs as input material, not as unquestioned truth. When docs conflict with source code, prefer current source code.
- For frontend work, assume Cabloy Basic and Cabloy Start share a frontend engineering layer but may diverge in UI layer, frontend flavors, suite/module availability, SSR site baselines, project assets, and generated outputs.
- For Zova frontend analysis, do not default to generic Vue reinterpretation first. Read the code through Zova’s controller / bean / IoC architecture before mapping it to Vue concepts.
- For Zova source-reading or Vue-vs-Zova explanation tasks, start from the frontend reading guides and source-reading map in `cabloy-docs/frontend/` before doing framework-neutral reinterpretation.
- For frontend async state that affects rendering or interaction across consumers, prefer model-owned `$useStateData(...)` over controller-managed fetch/cache state.
- Default to establishing such query state during render. Use `disableSuspenseOnInit: true` only for relatively stable query-backed state when you want to skip the init-time `query.suspense()` kick; it does not prevent query creation, fetches, or hydration-time rendering. If strict readiness is needed later, wait explicitly at the interaction boundary.
- In SSR, keep server HTML and the client's hydration-time initial render equivalent. When server rendering intentionally omits private, cookie-unavailable, or browser-only state, keep the same neutral shell or placeholder through hydration and defer its query/load/render branch to an explicit post-hydration, admission, mounted, or interaction boundary.
- Keep repo-wide AI rules in `CLAUDE.md` short and durable; put branching Zova analysis workflows in `.claude/skills/`.
- For SSR theme-sensitive frontend work, detect the active edition marker and UI library before making assumptions. Cabloy Basic currently means DaisyUI + Tailwind CSS assumptions; Cabloy Start currently means Vuetify assumptions.
- In Web SSR without cookie-backed theme resolution, do not treat server reads of `$theme.dark`, `$theme.darkMode`, or `$token` as final browser truth. Keep theme-sensitive SSR branching hydration-tolerant or defer final theme-sensitive decisions to the client.
- Do not assume Cabloy Basic and Cabloy Start use the same adapter-level SSR theme handoff. Verify the active theme handler and client hydration path before changing SSR theme behavior.
- Reuse existing repo terminology: Cabloy, Vona, Zova, suite, module, bean, SSR, SPA, Web, Admin.
- For backend base-class placement, use the A / B1 / B2 rule from `cabloy-docs/ai/class-placement-rule.md`.
- Pure helper bases belong in `src/lib`; subclass-only bases should be evaluated case by case and often belong in `src/lib`.
- Runtime-anchor bases that still require container-managed or selector/class-token behavior but should not be global beans should prefer `src/service` with `@Service()`.
- Service-scene runtime-anchor bases that should not register in `IBeanRecordGeneral` should prefer the `src/service/*_.ts` form.
- `src/bean` defines the global shorthand surface; classes that should not appear in `IBeanRecordGlobal` should move to `src/lib` or `src/service` rather than being filtered by `@Virtual()`.
- When backend code references `this.bean.xxx`, `ctx.bean.xxx`, or `app.bean.xxx`, use `IBeanRecordGlobal` and module `src/.metadata/index.ts` as the first static lookup surface; use `IBeanRecordGeneral` or `src/service` only when the target is not a global shorthand.
- When adding a persisted field to an existing backend resource, ask the user whether `vonaModule.fileVersion` should be incremented before changing `meta.version.ts` or the module schema path. If yes, add a new migration version and bump `fileVersion`. If no, keep the current `fileVersion` and fold the schema change into the current version path. Do not assume the versioning strategy without confirmation.
- In shared-database multitenancy, do not use `table.unique(...)` for business uniqueness. Keep ordinary indexes for lookup performance and enforce tenant-scoped uniqueness in the business layer.
- In Vona, a tenant corresponds to an instance. Ordinary resource-model CRUD is automatically scoped to the active instance; treat records absent from that scope as absent, and do not use raw cross-instance probes merely to choose between `403` and not-found behavior. Model future multi-merchant boundaries explicitly inside an instance.
- Model cross-Model query-cache dependencies as one directed, acyclic `modelsClear` / `modelsClearedBy` graph, and verify source mutations refresh warmed dependent queries; read `.docs-internal/architecture/vona-cross-model-query-cache-dependencies.md` before designing a nontrivial graph.
- For `@Api.field(...)` and related schemaLike composition, framework guards now preserve previously attached OpenAPI metadata across schema rebuilds, but structure-shaping schemaLike is still order-sensitive. Treat `v.object(...)`, `v.array(...)`, `v.optional()`, `v.nullable()`, `v.default(...)`, and preprocess/transform wrappers as structure-shaping; keep the final structure-defining schemaLike last and verify emitted schema/OpenAPI output after such edits.
- Backend tests that use scoped Vona state must own an `app.bean.executor.mockCtx(...)` boundary; every intentionally competing operation must run in a separate `mockCtx(...)`.
- For stateful `node:test` suites, declare concurrency explicitly. Prove business contention by explicitly launching competing operations and asserting their combined durable outcome, never through runner parallelism or scheduling.
- Unit tests must delete every test-owned persisted resource in `finally`, using precise owned identities and reverse dependency order.
- Shared durable test or local-development fixtures must be created through the owning module's `meta.version.ts` `seed()` hook and treated as read-only by tests; the managed seed path starts from a newly recreated database rather than repeating against one database.

## Verification expectations

- For docs changes: run the docs build and verify links/navigation where practical.
- For code-generation or workflow guidance changes: verify that the referenced scripts and command families still exist.
- For code changes: prefer the narrowest meaningful verification first, then use shared root scripts when broader confidence is needed.
- Any change to `meta.version.ts` requires running `npm run test` so the test database is reinitialized and schema/data consistency issues surface early.
