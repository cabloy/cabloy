# Unified Docs English Migration Inventory

## Purpose

This note is the **current closure snapshot** for the English-only migration from legacy Vona/Zova docs into `repo-docs/`, including the later second-stage deepening pass for heavy legacy topic families.

Scope rules:

- only English legacy docs are migration candidates
- legacy `zh/` trees are archive-only and out of scope
- this note focuses on what is now **closed**, what remains **conceptually partial**, and what should be treated as **archive-only or reframed**
- `repo-docs/` is the public source of truth

## Final status

### 1. Active high-value English topic migration is effectively complete

The previously targeted active framework topic families now have unified public homes in `repo-docs/`.

#### Vona

- `aop/` → `backend/aop-overview.md`, `backend/controller-aop-guide.md`, `backend/internal-aop-guide.md`, `backend/external-aop-guide.md`
- `bal/auth/` → `backend/auth-guide.md`
- `bal/captcha/` → `backend/captcha-guide.md`
- `bal/user/` → `backend/user-access-guide.md`
- `bal/menu/` → `backend/menu-guide.md`
- `techniques/event/` → `backend/event-guide.md`
- `techniques/i18n/` → `backend/i18n-guide.md`
- `techniques/jwt/` → `backend/jwt-guide.md`
- `techniques/logger/` → `backend/logger-guide.md`
- `techniques/mail/` → `backend/mail-guide.md`
- `techniques/serialization/` → `backend/serialization-guide.md`
- `techniques/upload/` → `backend/upload-guide.md`
- `guide/distributed/startup/` → `backend/startup-guide.md`
- `guide/distributed/election.md` → `backend/election-guide.md`
- `guide/techniques/orm/config-orm.md` → `backend/orm-configuration-guide.md`
- `guide/techniques/orm/aggr-group.md`, `guide/techniques/orm/relations-aggr.md`, `guide/techniques/orm/relations-group.md` → `backend/orm-aggregate-group-guide.md`
- `guide/essentials/ioc/`, `guide/essentials/scope/`, `guide/essentials/modularization/` → `backend/backend-essentials.md`, `backend/config-guide.md`, `backend/error-guide.md`, `reference/package-map.md`, `reference/backend-directory-structure.md`
- `guide/env-config/env/`, `guide/env-config/mode-flavor/`, `guide/env-config/config/`, `guide/env-config/app-start/`, `guide/env-config/instance/`, `guide/env-config/db-strategy/` → `backend/runtime-and-flavors.md`, `backend/config-guide.md`, `backend/startup-guide.md`, `backend/multi-instance-and-instance-resolution.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, `backend/introduction.md`, and `backend/quickstart.md`

#### Zova

- `techniques/mock/` → `frontend/mock-guide.md`
- `techniques/css-in-js/` → `frontend/css-in-js-guide.md`, `frontend/theme-guide.md`, with supporting usage links in `frontend/page-guide.md` and `frontend/component-guide.md`
- `essentials/ioc/` → `frontend/ioc-and-beans.md`
- `essentials/modularization/` → `frontend/modules-and-suites.md`
- `essentials/scope/` → `frontend/module-scope.md`
- `env-config/mode-flavor/`, `env-config/env/`, `env-config/config/` → `frontend/environment-config-guide.md`
- `env-config/app-start/` → `frontend/app-startup-guide.md`
- `env-config/sys-start/` → `frontend/system-startup-guide.md`
- `page/page-layout.md` → `frontend/page-route-guide.md`
- `guide/start/` → `frontend/quickstart.md`, `frontend/cli.md`, `frontend/scripts.md`, `frontend/environment-config-guide.md`, `frontend/app-startup-guide.md`, `frontend/system-startup-guide.md`, `frontend/page-route-guide.md`, with supporting edition context in `editions/detection.md`, `editions/cabloy-basic.md`, and `editions/cabloy-start.md`
- `page/progressive-code-splitting.md` → `frontend/page-guide.md`
- `page/zod.md` → `frontend/zod-guide.md`

### 2. No confirmed high-priority missing public page remains

At this point, there is no longer a confirmed missing page among the previously prioritized active English framework topics.

The main false-completion risk was JWT. That gap is now closed because:

- `repo-docs/backend/jwt-guide.md` exists
- JWT is wired into `repo-docs/.vitepress/config.mjs`
- JWT is now tracked consistently in this inventory

A later second-stage deepening pass also closed the clearest heavy-family underrepresentation risks by adding or strengthening:

- `backend/startup-guide.md`
- `backend/election-guide.md`
- `backend/orm-configuration-guide.md`
- `backend/orm-aggregate-group-guide.md`
- deeper ORM/distributed coverage in `backend/queue-guide.md`, `backend/broadcast-guide.md`, `backend/orm-select-guide.md`, `backend/orm-mutation-guide.md`, `backend/relations-guide.md`, `backend/dto-guide.md`, `backend/dto-infer-generation.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, and `backend/sharding-guide.md`
- a clearer backend rest-api contract loop across `backend/controller-guide.md`, `backend/model-guide.md`, `backend/entity-guide.md`, `backend/dto-guide.md`, `backend/dto-infer-generation.md`, `backend/crud-workflow.md`, `backend/openapi-guide.md`, `backend/migration-and-changes.md`, `backend/unit-testing.md`, `fullstack/openapi-to-sdk.md`, and `frontend/openapi-sdk-guide.md`
- a clearer backend env/runtime/config family across `backend/runtime-and-flavors.md`, `backend/config-guide.md`, `backend/startup-guide.md`, `backend/multi-instance-and-instance-resolution.md`, `backend/model-guide.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, `backend/introduction.md`, and `backend/quickstart.md`
- a focused Zova CSS-in-JS deepening pass across `frontend/css-in-js-guide.md` and `frontend/theme-guide.md`, with supporting discoverability links in `frontend/page-guide.md` and `frontend/component-guide.md`, closing the strongest remaining frontend family-level depth concern around style/tool selection, global-style vocabulary, token/theme lifecycle, and edition-stable styling architecture
- a focused Zova start/app-shell narrative consolidation pass across `frontend/quickstart.md`, `frontend/page-route-guide.md`, `frontend/app-startup-guide.md`, `frontend/system-startup-guide.md`, `frontend/cli.md`, `frontend/scripts.md`, and the frontend sidebar order in `.vitepress/config.mjs`, restoring a clearer "repo root to first routed screen" spine, making app-shell/layout behavior more explicit, and strengthening edition-first script/navigation guidance without recreating the legacy `guide/start/` tree

## What is still partial, but optional rather than blocking

These areas are no longer “missing migration topics.” They are **conceptual consolidation opportunities**.

### Vona backend essentials family

Legacy source families:

- `vona/packages-docs/guide/essentials/ioc/`
- `vona/packages-docs/guide/essentials/modularization/`
- `vona/packages-docs/guide/essentials/scope/`

Current state:

- the family now has a dedicated public hub in `backend/backend-essentials.md`
- the architecture spine is now stronger across `backend/foundation.md`, `backend/service-guide.md`, `backend/model-guide.md`, `backend/entity-guide.md`, and `backend/dto-guide.md`
- the scope-resource leaves now have explicit homes in `backend/config-guide.md` and `backend/error-guide.md`
- modularization and repo-shape guidance are now grounded across `backend/cli.md`, `backend/scripts.md`, `reference/package-map.md`, and `reference/backend-directory-structure.md`

Assessment:

- no longer merely partial as a broad conceptual family
- now substantially absorbed into unified public docs at both family and major-leaf level
- any remaining work is optional leaf-parity or additional example-depth work such as `scope/constant` or finer IoC reference extraction

### Vona ORM heavy family

Legacy source families:

- `vona/packages-docs/guide/techniques/orm/`

Current state:

- core ORM concepts already lived across `backend/orm-guide.md`, `backend/orm-select-guide.md`, `backend/orm-mutation-guide.md`, `backend/relations-guide.md`, `backend/dto-guide.md`, `backend/dto-infer-generation.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, and `backend/sharding-guide.md`
- the second-stage deepening pass added `backend/orm-configuration-guide.md` and `backend/orm-aggregate-group-guide.md`
- the ORM family now has materially stronger public coverage for config, aggregate/group, relation depth, DTO depth, and topology framing

Assessment:

- no longer a missing migration family
- no longer only a thin overview-level family
- any remaining work is optional leaf-parity or example-depth work such as further `crud-magic` extraction or more advanced topology examples

### Vona backend rest-api contract family

Legacy source families:

- `vona/packages-docs/guide/rest-api/`

Current state:

- the family is no longer best understood as a missing page set; it is now distributed intentionally across backend, fullstack, and frontend contract-loop pages
- the second-stage deepening pass materially strengthened the backend contract spine across `backend/controller-guide.md`, `backend/model-guide.md`, `backend/entity-guide.md`, `backend/dto-guide.md`, and `backend/dto-infer-generation.md`
- the operational lifecycle is now much clearer across `backend/crud-workflow.md`, `backend/openapi-guide.md`, `backend/migration-and-changes.md`, and `backend/unit-testing.md`
- the cross-stack bridge is now explicit across `fullstack/openapi-to-sdk.md` and `frontend/openapi-sdk-guide.md`
- the later leaf-depth polish round further sharpened concrete controller signatures, inferred DTO examples, CRUD generator expectations, migration/version decision rules, action-level `performAction(...)` testing, and the OpenAPI-to-SDK regeneration path

Assessment:

- no longer a missing migration family
- no longer merely scattered low-depth coverage
- now substantially absorbed as a coherent backend contract-loop family
- the main remaining work is no longer family closure but only optional micro-polish or future example-depth enrichment
- not core migration closure work

### Vona backend env/runtime/config family

Legacy source families:

- `vona/packages-docs/guide/env-config/app-start/`
- `vona/packages-docs/guide/env-config/config/`
- `vona/packages-docs/guide/env-config/db-strategy/`
- `vona/packages-docs/guide/env-config/env/`
- `vona/packages-docs/guide/env-config/instance/`
- `vona/packages-docs/guide/env-config/mode-flavor/`

Current state:

- the family now has stronger canonical homes across `backend/runtime-and-flavors.md`, `backend/config-guide.md`, `backend/startup-guide.md`, `backend/multi-instance-and-instance-resolution.md`, `backend/multi-database-datasource.md`, and `backend/dynamic-datasource-guide.md`
- onboarding and reading-path links are now also clearer across `backend/introduction.md` and `backend/quickstart.md`
- the second-stage deepening pass materially strengthened env-file layering, config ownership, startup lifecycle hooks, instance resolution, and isolated-instance datasource strategy
- the later leaf-depth polish round also sharpened env precedence examples, built-in env-variable guidance, config access-layer distinctions, startup hook-surface precision, instance edge cases, and the concrete isolated datasource pattern

Assessment:

- no longer merely conceptually distributed without canonical homes
- no longer a missing migration family
- now substantially absorbed as a coherent backend runtime/config family
- the main remaining work is no longer family closure but only optional micro-polish or future edge-case/example enrichment
- not core migration closure work

### Distributed startup / election

Legacy source families:

- `vona/packages-docs/guide/distributed/startup/`
- `vona/packages-docs/guide/distributed/election.md`

Current state:

- now directly represented by `backend/startup-guide.md` and `backend/election-guide.md`
- broader distributed runtime concerns are also connected across queue, worker, broadcast, redis, schedule, and redlock docs

Assessment:

- no longer underrepresented directly
- second-stage deepening materially closed this family as a public unified-docs gap

### Zova CSS-in-JS family

Legacy source families:

- `zova/packages-docs/guide/techniques/css-in-js/`

Current state:

- the family now has clearer canonical public homes in `frontend/css-in-js-guide.md` and `frontend/theme-guide.md`
- a focused later deepening pass strengthened the practical decision map across `$style`, dedicated style beans, `@Css()` / `$cssBase`, `$token`, and `$theme`
- the same pass also clarified the style → token → theme flow, the shared-vs-global style distinction, development-time class-name/debugging expectations, and the boundary between edition-stable styling architecture and UI-library-specific token/detail variation
- discoverability links now connect `frontend/page-guide.md` and `frontend/component-guide.md` back to the CSS-in-JS family docs

Assessment:

- no longer just a thin conceptual overview paired with a separate theme page
- no longer the strongest remaining frontend heavy-family depth concern
- now substantially absorbed as a coherent Zova styling family without reopening a new public doc tree
- any remaining work is optional example-depth or further token/theme scenario enrichment rather than core migration closure work

### Zova start / app-shell narrative family

Legacy source families:

- `zova/packages-docs/guide/start/`

Current state:

- the family’s substance is now explicitly consolidated across `frontend/quickstart.md`, `frontend/cli.md`, `frontend/scripts.md`, `frontend/environment-config-guide.md`, `frontend/app-startup-guide.md`, `frontend/system-startup-guide.md`, and `frontend/page-route-guide.md`
- a focused later consolidation pass restored a clearer "repo root to first routed screen" onboarding spine in `frontend/quickstart.md`
- the same pass made app-shell/layout behavior more explicit in `frontend/page-route-guide.md`, tightened the reading sequence between system startup and app startup, absorbed the useful legacy menu ergonomics into `frontend/cli.md`, strengthened edition-first script selection in `frontend/scripts.md`, and moved `Quickstart` earlier in the frontend sidebar for discoverability
- the editions docs now remain the canonical detail pages, while the frontend start narrative makes edition detection unavoidable at the beginning of the journey

Assessment:

- no longer a scattered narrative where the main onboarding/app-shell story must be reconstructed entirely from separate reference pages
- no longer the strongest remaining frontend start-family consolidation concern
- now substantially absorbed as a coherent frontend onboarding and app-shell narrative without recreating the legacy `guide/start/` tree
- any remaining work is optional example-depth or future workflow-specific enrichment rather than core migration closure work

## What should be treated as archive-only or reframed

### Vona

Likely archive-only or not worth direct migration unless a new use case appears:

- `guide/techniques/mock/`
- `guide/techniques/printTip/`
- `guide/start/`
- `guide/resources/`
- `guide/others/`

### Zova

Likely archive-only or already reframed sufficiently:

- `guide/techniques/build/`
- `guide/vue/`
- `guide/start/`
- `guide/resources/`
- `guide/others/`

## Final corrections captured by this inventory

This file now reflects the corrected post-migration state, including the later second-stage depth pass.

### Corrected from earlier stale versions

1. JWT is now **actually complete**, not just conversationally treated as complete
2. frontend mock is no longer tracked as missing
3. frontend essentials are no longer tracked as only partial in the original migration sense
4. frontend env/startup is no longer tracked as only partial in the original migration sense
5. frontend page subtopics (`page-layout`, `progressive-code-splitting`, `zod`) are no longer tracked as missing
6. migrated Vona active technique families are no longer tracked as missing
7. distributed startup and election are no longer tracked as underrepresented conceptual leftovers
8. heavy ORM subtopics now have stronger public coverage through dedicated config and aggregate/group pages plus deeper ORM family guides
9. backend essentials now has a dedicated public hub plus explicit config/error/directory-structure leaf coverage, so it should no longer be described as only a conceptually partial family
10. backend rest-api is now better described as a coherent contract-loop family spanning backend authoring, lifecycle verification, and frontend SDK bridge pages rather than as a scattered partially represented topic set
11. backend env/runtime/config is now better described as a coherent runtime/config family with explicit homes for runtime/flavor, config layering, startup lifecycle, instance resolution, and datasource strategy rather than as a loosely distributed partial topic set
12. the later env/runtime/config leaf-depth polish round further improved practical usability through env precedence examples, config access distinctions, startup hook precision, instance edge cases, and a more concrete isolated datasource pattern
13. the later rest-api leaf-depth polish round further improved practical usability through concrete controller signatures, inferred DTO examples, generated-thread expectations, migration decision rules, action-level testing flow, and a clearer OpenAPI-to-SDK regeneration path
14. `techniques/css-in-js/` is no longer a remaining frontend depth concern after the later focused Zova CSS-in-JS pass strengthened the mechanism-selection map, global-style explanation, token/theme lifecycle, and edition-boundary guidance across `frontend/css-in-js-guide.md` and `frontend/theme-guide.md`
15. `guide/start/` is no longer a remaining frontend narrative-consolidation concern after the later focused Zova start/app-shell pass restored a stronger quickstart spine, made layout/app-shell behavior more explicit, tightened startup sequencing, surfaced menu-vs-CLI ergonomics, and strengthened edition-first script guidance

## Closure judgment

### Migration phase result

The English migration can now be considered **phase-complete for active high-value public topics**.

What remains is no longer “finish the migration” work in the original sense.

What remains is one of these optional follow-up categories:

- conceptual consolidation
- archive positioning
- low-priority extraction from legacy material only if a concrete value case appears

A later cautious heavy-family re-audit did not identify any newly confirmed family-level reopening target. The strongest remaining frontend candidate, Zova CSS-in-JS, has now also received a focused deepening pass and should no longer be treated as an unresolved heavy-family concern. The other strongest frontend narrative-consolidation candidate, Zova start / app-shell, has also now received a focused consolidation pass and should no longer be treated as an unresolved family-level concern.

## Recommended next-step framing

If follow-up work continues, it should be framed as one of these, not as unfinished core migration:

1. **conceptual consolidation**
   - optional remaining backend essentials leaf-depth refinements
   - optional remaining ORM/distributed leaf-depth refinements

2. **legacy archive positioning**
   - tighten wording on legacy entry pages so they read as archives rather than active doc homes

3. **incremental polish**
   - cross-links, examples, or editorial refinement inside already-migrated unified pages

## Verification checklist for future updates

- verify every newly added public page is wired into `repo-docs/.vitepress/config.mjs`
- verify unified docs use present-tense canonical language rather than migration framing
- verify root scripts and CLI references still match the current source tree
- do not count any legacy `zh/` page toward completion
- when closing a topic family, verify both the page and sidebar wiring before marking it complete
