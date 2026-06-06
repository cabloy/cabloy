# Unified Docs English Migration Inventory

## Purpose

This note is the **current closure snapshot** for the English-only migration from legacy Vona/Zova docs into `cabloy-docs/`, including the later second-stage deepening pass for heavy legacy topic families.

Scope rules:

- only English legacy docs are migration candidates
- legacy `zh/` trees are archive-only and out of scope
- this note focuses on what is now **closed**, what remains **conceptually partial**, and what should be treated as **archive-only or reframed**
- `cabloy-docs/` is the public source of truth

## Final status

### 1. Active high-value English topic migration is effectively complete

The previously targeted active framework topic families now have unified public homes in `cabloy-docs/`.

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

#### Zova

- `techniques/mock/` → `frontend/mock-guide.md`
- `essentials/ioc/` → `frontend/ioc-and-beans.md`
- `essentials/modularization/` → `frontend/modules-and-suites.md`
- `essentials/scope/` → `frontend/module-scope.md`
- `env-config/mode-flavor/`, `env-config/env/`, `env-config/config/` → `frontend/environment-config-guide.md`
- `env-config/app-start/` → `frontend/app-startup-guide.md`
- `env-config/sys-start/` → `frontend/system-startup-guide.md`
- `page/page-layout.md` → `frontend/page-route-guide.md`
- `page/progressive-code-splitting.md` → `frontend/page-guide.md`
- `page/zod.md` → `frontend/zod-guide.md`

### 2. No confirmed high-priority missing public page remains

At this point, there is no longer a confirmed missing page among the previously prioritized active English framework topics.

The main false-completion risk was JWT. That gap is now closed because:

- `cabloy-docs/backend/jwt-guide.md` exists
- JWT is wired into `cabloy-docs/.vitepress/config.mjs`
- JWT is now tracked consistently in this inventory

A later second-stage deepening pass also closed the clearest heavy-family underrepresentation risks by adding or strengthening:

- `backend/startup-guide.md`
- `backend/election-guide.md`
- `backend/orm-configuration-guide.md`
- `backend/orm-aggregate-group-guide.md`
- deeper ORM/distributed coverage in `backend/queue-guide.md`, `backend/broadcast-guide.md`, `backend/orm-select-guide.md`, `backend/orm-mutation-guide.md`, `backend/relations-guide.md`, `backend/dto-guide.md`, `backend/dto-infer-generation.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, and `backend/sharding-guide.md`

## What is still partial, but optional rather than blocking

These areas are no longer “missing migration topics.” They are **conceptual consolidation opportunities**.

### Vona backend essentials family

Legacy source families:

- `vona/packages-docs/guide/essentials/ioc/`
- `vona/packages-docs/guide/essentials/modularization/`
- `vona/packages-docs/guide/essentials/scope/`

Current state:

- concepts are distributed across `backend/foundation.md`, `backend/service-guide.md`, `backend/model-guide.md`, `backend/entity-guide.md`, `backend/dto-guide.md`, and `reference/package-map.md`

Assessment:

- still partial as a conceptual family
- not a blocking migration gap
- suitable only if we later want a cleaner backend conceptual guide set

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

### Vona backend env/runtime/config family

Legacy source families:

- `vona/packages-docs/guide/env-config/app-start/`
- `vona/packages-docs/guide/env-config/config/`
- `vona/packages-docs/guide/env-config/db-strategy/`
- `vona/packages-docs/guide/env-config/env/`
- `vona/packages-docs/guide/env-config/instance/`
- `vona/packages-docs/guide/env-config/mode-flavor/`

Current state:

- reframed across `backend/runtime-and-flavors.md`, `backend/startup-guide.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, `backend/quickstart.md`, and reference pages

Assessment:

- still conceptually distributed
- no longer missing the most obvious backend startup treatment
- not a missing active-topic migration blocker

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

## Closure judgment

### Migration phase result

The English migration can now be considered **phase-complete for active high-value public topics**.

What remains is no longer “finish the migration” work in the original sense.

What remains is one of these optional follow-up categories:

- conceptual consolidation
- archive positioning
- low-priority extraction from legacy material only if a concrete value case appears

## Recommended next-step framing

If follow-up work continues, it should be framed as one of these, not as unfinished core migration:

1. **conceptual consolidation**
   - backend essentials family
   - backend env/runtime/config family
   - optional remaining ORM/distributed leaf-depth refinements

2. **legacy archive positioning**
   - tighten wording on legacy entry pages so they read as archives rather than active doc homes

3. **incremental polish**
   - cross-links, examples, or editorial refinement inside already-migrated unified pages

## Verification checklist for future updates

- verify every newly added public page is wired into `cabloy-docs/.vitepress/config.mjs`
- verify unified docs use present-tense canonical language rather than migration framing
- verify root scripts and CLI references still match the current source tree
- do not count any legacy `zh/` page toward completion
- when closing a topic family, verify both the page and sidebar wiring before marking it complete
