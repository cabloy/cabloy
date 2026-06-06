# Unified Docs English Migration Inventory

## Purpose

This note tracks which **English** topics from the legacy Vona and Zova docs have not yet been fully absorbed into `cabloy-docs/`.

Scope rules:

- only English legacy docs are considered migration candidates
- legacy `zh/` trees are archive-only and out of scope
- this inventory focuses on **missing**, **partial**, **reframed**, or **archive-only** topic families
- topic families already well covered in `cabloy-docs/` are only mentioned briefly for context

## Current source of truth

The current public docs source of truth is `cabloy-docs/`, supported by the root docs scripts in `package.json` and the unified sidebar structure in `cabloy-docs/.vitepress/config.mjs`.

## Summary

### Recently completed unified-docs additions

The following legacy English families now have dedicated unified documentation homes in `cabloy-docs/`:

#### Vona

- `aop/` → `backend/aop-overview.md`, `backend/controller-aop-guide.md`, `backend/internal-aop-guide.md`, `backend/external-aop-guide.md`
- `bal/` → `backend/auth-guide.md`, `backend/captcha-guide.md`, `backend/user-access-guide.md`, `backend/menu-guide.md`
- `techniques/event/` → `backend/event-guide.md`
- `techniques/i18n/` → `backend/i18n-guide.md`
- `techniques/jwt/` → `backend/jwt-guide.md`
- `techniques/logger/` → `backend/logger-guide.md`
- `techniques/mail/` → `backend/mail-guide.md`
- `techniques/serialization/` → `backend/serialization-guide.md`
- `techniques/upload/` → `backend/upload-guide.md`

#### Zova

- `techniques/mock/` → `frontend/mock-guide.md`

### Highest-priority English themes still missing from `cabloy-docs/`

#### Vona

1. **Core backend architecture families still scattered rather than documented directly**
   - legacy source families:
     - `vona/packages-docs/guide/essentials/ioc/`
     - `vona/packages-docs/guide/essentials/modularization/`
     - `vona/packages-docs/guide/essentials/scope/`
   - current state: these concepts are spread across `cabloy-docs/backend/foundation.md`, `backend/service-guide.md`, `backend/model-guide.md`, `backend/entity-guide.md`, `backend/dto-guide.md`, and `reference/package-map.md`
   - why it matters: these are foundational framework concepts and still do not have a dedicated unified conceptual guide family

2. **Environment/configuration families still partially reframed rather than fully consolidated**
   - legacy source families:
     - `vona/packages-docs/guide/env-config/app-start/`
     - `vona/packages-docs/guide/env-config/config/`
     - `vona/packages-docs/guide/env-config/db-strategy/`
     - `vona/packages-docs/guide/env-config/env/`
     - `vona/packages-docs/guide/env-config/instance/`
     - `vona/packages-docs/guide/env-config/mode-flavor/`
   - current state: partially covered by `backend/runtime-and-flavors.md`, `backend/multi-database-datasource.md`, `backend/dynamic-datasource-guide.md`, `backend/quickstart.md`, and reference pages
   - why it matters: backend runtime / instance / db-strategy / environment resolution still lacks one coherent unified family

3. **A few distributed/system topics still remain without direct unified homes**
   - legacy source families:
     - `vona/packages-docs/guide/distributed/startup/`
     - `vona/packages-docs/guide/distributed/election.md`
   - current state: distributed concerns are broadly covered across queue, worker, broadcast, redis, schedule, and redlock guides, but startup/election still lack dedicated treatment
   - why it matters: these are still framework-level runtime concerns rather than minor implementation details

4. **A few backend technique pages are still undecided and may be archive-only**
   - legacy source families:
     - `vona/packages-docs/guide/techniques/mock/`
     - `vona/packages-docs/guide/techniques/printTip/`
   - current state: no dedicated unified pages
   - why it matters: these may not justify public migration and likely need an explicit archive-only decision

#### Zova

1. **Frontend IOC / modularization / scope as dedicated reference**
   - legacy source: `zova/packages-docs/guide/essentials/`
   - current state: concepts are mentioned in `cabloy-docs/frontend/foundation.md`, `cabloy-docs/frontend/design-principles.md`, and `cabloy-docs/reference/package-map.md`, but there is no dedicated unified guide family
   - why it matters: these are foundational concepts for understanding how Zova differs from generic Vue usage

2. **Page subtopics not yet explicitly represented**
   - legacy source: `zova/packages-docs/guide/page/`
   - missing or partial subtopics:
     - `page/page-layout.md`
     - `page/progressive-code-splitting.md`
     - `page/zod.md`
   - current state: core page guides exist, but these subtopics do not have direct unified coverage

3. **Frontend boot / env / flavor setup still lacks one coherent unified family**
   - legacy source families:
     - `zova/packages-docs/guide/env-config/app-start/`
     - `zova/packages-docs/guide/env-config/config/`
     - `zova/packages-docs/guide/env-config/env/`
     - `zova/packages-docs/guide/env-config/mode-flavor/`
     - `zova/packages-docs/guide/env-config/sys-start/`
   - current state: partially covered by `frontend/quickstart.md`, `frontend/scripts.md`, `frontend/ssr-env.md`, and edition docs
   - why it matters: frontend boot/config/runtime setup still feels distributed rather than consolidated

## Detailed inventory

## Vona legacy topics

### A. Missing and should likely be migrated

#### `aop/`

Legacy files:

- `vona/packages-docs/guide/aop/introduction.md`
- `vona/packages-docs/guide/aop/controller/filter-builtin.md`
- `vona/packages-docs/guide/aop/controller/filter-global.md`
- `vona/packages-docs/guide/aop/controller/filter-local.md`
- `vona/packages-docs/guide/aop/controller/guard-builtin.md`
- `vona/packages-docs/guide/aop/controller/guard-global.md`
- `vona/packages-docs/guide/aop/controller/guard-local.md`
- `vona/packages-docs/guide/aop/controller/interceptor-builtin.md`
- `vona/packages-docs/guide/aop/controller/interceptor-global.md`
- `vona/packages-docs/guide/aop/controller/interceptor-local.md`
- `vona/packages-docs/guide/aop/controller/middleware-builtin.md`
- `vona/packages-docs/guide/aop/controller/middleware-global.md`
- `vona/packages-docs/guide/aop/controller/middleware-local.md`
- `vona/packages-docs/guide/aop/controller/middleware-system.md`
- `vona/packages-docs/guide/aop/controller/pipe-argument.md`
- `vona/packages-docs/guide/aop/controller/pipe-global.md`
- `vona/packages-docs/guide/aop/controller/pipe-local.md`
- `vona/packages-docs/guide/aop/controller/pipe-zod.md`
- `vona/packages-docs/guide/aop/external/introduction.md`
- `vona/packages-docs/guide/aop/internal/aop-method.md`
- `vona/packages-docs/guide/aop/internal/builtin.md`
- `vona/packages-docs/guide/aop/internal/magic-method.md`

Suggested unified destination:

- new backend guide family under `cabloy-docs/backend/`
- keep controller-related pages near `controller-guide.md`
- add an overview page so AOP is visible as a first-class backend topic

#### `bal/`

Legacy files:

- `vona/packages-docs/guide/bal/auth/introduction.md`
- `vona/packages-docs/guide/bal/auth/auth-oauth.md`
- `vona/packages-docs/guide/bal/auth/auth-simple.md`
- `vona/packages-docs/guide/bal/captcha/introduction.md`
- `vona/packages-docs/guide/bal/captcha/captcha-provider.md`
- `vona/packages-docs/guide/bal/captcha/captcha-scene.md`
- `vona/packages-docs/guide/bal/menu/introduction.md`
- `vona/packages-docs/guide/bal/menu/ssr-menu.md`
- `vona/packages-docs/guide/bal/user/user.md`
- `vona/packages-docs/guide/bal/user/role.md`
- `vona/packages-docs/guide/bal/user/passport.md`

Suggested unified destination:

- likely new backend topic family under `cabloy-docs/backend/`
- some menu / SSR user-flow pieces may cross-link from frontend navigation guidance

#### Backend techniques still missing as dedicated pages

Legacy files:

- `vona/packages-docs/guide/techniques/event/introduction.md`
- `vona/packages-docs/guide/techniques/event/event-listener.md`
- `vona/packages-docs/guide/techniques/i18n/locale.md`
- `vona/packages-docs/guide/techniques/i18n/timezone.md`
- `vona/packages-docs/guide/techniques/jwt/introduction.md`
- `vona/packages-docs/guide/techniques/logger/introduction.md`
- `vona/packages-docs/guide/techniques/logger/logger-level.md`
- `vona/packages-docs/guide/techniques/mail/introduction.md`
- `vona/packages-docs/guide/techniques/mock/introduction.md`
- `vona/packages-docs/guide/techniques/printTip/introduction.md`
- `vona/packages-docs/guide/techniques/runtime/introduction.md`
- `vona/packages-docs/guide/techniques/serialization/introduction.md`
- `vona/packages-docs/guide/techniques/serialization/tools.md`
- `vona/packages-docs/guide/techniques/upload/introduction.md`

Suggested unified destination:

- mostly `cabloy-docs/backend/`
- `i18n` may need cross-links from frontend or reference pages
- each family should be evaluated as migrate vs archive-only, but they are not yet represented clearly enough to count as covered

### B. Partial and need consolidation or expansion

#### `essentials/`

Legacy files:

- IOC: `bean-base`, `bean-create`, `bean-identifier`, `bean-scene`, `dependency-injection`, `dependency-lookup`, `inject-api`, `lifecycle`, `onion-name`
- modularization: `directory-structure`, `module`, `package`, `suite`
- scope: `config`, `constant`, `entity`, `error`, `locale`, `model`, `service`

Current partial coverage:

- `cabloy-docs/backend/foundation.md`
- `cabloy-docs/backend/introduction.md`
- `cabloy-docs/backend/controller-guide.md`
- `cabloy-docs/backend/service-guide.md`
- `cabloy-docs/backend/model-guide.md`
- `cabloy-docs/backend/entity-guide.md`
- `cabloy-docs/backend/dto-guide.md`
- `cabloy-docs/reference/package-map.md`

Gap assessment:

- concepts exist, but there is no dedicated unified explanation of IOC, modularization, and scope as a coherent conceptual family

#### `env-config/`

Legacy files:

- `app-start/introduction.md`
- `config/introduction.md`
- `db-strategy/introduction.md`
- `env/introduction.md`
- `instance/introduction.md`
- `mode-flavor/introduction.md`

Current partial coverage:

- `cabloy-docs/backend/runtime-and-flavors.md`
- `cabloy-docs/backend/multi-database-datasource.md`
- `cabloy-docs/reference/repo-scripts.md`
- `cabloy-docs/editions/detection.md`

Gap assessment:

- the old family has been reframed, but there is still no single unified explanation of backend runtime / env / instance / flavor concepts

### C. Reframed or likely archive-only

#### `start/`

Legacy files:

- `start/cli.md`
- `start/comparison.md`
- `start/first-crud.md`
- `start/introduction.md`
- `start/menu.md`
- `start/play.md`
- `start/quick-start.md`
- `start/scripts.md`
- `start/update.md`
- `start/with-zova.md`

Current replacement areas:

- `cabloy-docs/fullstack/introduction.md`
- `cabloy-docs/fullstack/quickstart.md`
- `cabloy-docs/backend/quickstart.md`
- `cabloy-docs/backend/cli.md`
- `cabloy-docs/backend/scripts.md`
- `cabloy-docs/reference/repo-scripts.md`

Assessment:

- this family is largely replaced by the monorepo and unified-doc workflow model
- only specific high-value pieces should be extracted if still useful

#### `resources/` and `others/`

Legacy files:

- `resources/articles.md`
- `resources/faq.md`
- `resources/videos.md`
- `others/license.md`
- `others/thanks.md`

Assessment:

- these are not core migration targets for the unified docs knowledge system

## Zova legacy topics

### A. Missing and should likely be migrated

#### `techniques/mock/`

Legacy files:

- `zova/packages-docs/guide/techniques/mock/introduction.md`

Suggested unified destination:

- new frontend guide page under `cabloy-docs/frontend/`

Reason:

- this is a concrete workflow topic and does not appear covered elsewhere

### B. Partial and need consolidation or expansion

#### `essentials/`

Legacy files:

- IOC: `bean-base`, `bean-create`, `bean-identifier`, `bean-scene`, `dependency-injection`, `dependency-injection-api`, `lifecycle`, `onion-name`
- modularization: `directory-structure`, `module`, `package`, `suite`
- scope: `api`, `config`, `constant`, `error`, `locale`

Current partial coverage:

- `cabloy-docs/frontend/foundation.md`
- `cabloy-docs/frontend/design-principles.md`
- `cabloy-docs/reference/package-map.md`
- `cabloy-docs/frontend/api-guide.md`

Gap assessment:

- core concepts are mentioned, but there is no dedicated unified conceptual guide family for IOC, modularization, and scope on the frontend side

#### `env-config/`

Legacy files:

- `app-start/introduction.md`
- `config/introduction.md`
- `env/introduction.md`
- `mode-flavor/introduction.md`
- `sys-start/introduction.md`

Current partial coverage:

- `cabloy-docs/frontend/ssr-env.md`
- `cabloy-docs/frontend/scripts.md`
- `cabloy-docs/reference/repo-scripts.md`
- `cabloy-docs/editions/overview.md`

Gap assessment:

- the old family has been redistributed, but unified docs still lack one coherent explanation of frontend env / app-start / sys-start / flavor concepts

#### `page/`

Legacy files not clearly represented yet:

- `zova/packages-docs/guide/page/page-layout.md`
- `zova/packages-docs/guide/page/progressive-code-splitting.md`
- `zova/packages-docs/guide/page/zod.md`

Current related pages:

- `cabloy-docs/frontend/page-guide.md`
- `cabloy-docs/frontend/page-params-guide.md`
- `cabloy-docs/frontend/page-query-guide.md`
- `cabloy-docs/frontend/page-route-guide.md`
- `cabloy-docs/frontend/navigation-guards-guide.md`
- `cabloy-docs/frontend/route-alias-guide.md`

Gap assessment:

- page basics are covered, but these three subtopics still need either dedicated coverage or an explicit decision to archive them

#### `start/`

Legacy files:

- `start/cli.md`
- `start/first-page.md`
- `start/how.md`
- `start/introduction.md`
- `start/menu.md`
- `start/quick-start.md`
- `start/scripts.md`
- `start/update.md`

Current replacement areas:

- `cabloy-docs/frontend/quickstart.md`
- `cabloy-docs/frontend/cli.md`
- `cabloy-docs/frontend/scripts.md`
- `cabloy-docs/reference/repo-scripts.md`

Gap assessment:

- much of this family is reframed already, but a few onboarding pieces may still contain reusable content not yet pulled into unified quickstart pages

### C. Reframed or likely archive-only

#### `techniques/build/`

Legacy files:

- `zova/packages-docs/guide/techniques/build/build.md`

Assessment:

- now mostly replaced by monorepo script guidance in `cabloy-docs/reference/repo-scripts.md` and `cabloy-docs/frontend/scripts.md`

#### `vue/`

Legacy files:

- `zova/packages-docs/guide/vue/composables.md`
- `zova/packages-docs/guide/vue/others.md`
- `zova/packages-docs/guide/vue/provide-inject.md`
- `zova/packages-docs/guide/vue/refs.md`

Assessment:

- these pages are mostly generic Vue knowledge rather than durable Zova-specific monorepo guidance
- they should probably remain archive-only unless a page contains framework-specific guidance worth extracting

#### `resources/` and `others/`

Legacy files:

- `resources/articles.md`
- `resources/faq.md`
- `resources/videos.md`
- `others/license.md`
- `others/thanks.md`

Assessment:

- not core migration targets for the unified docs system

## Topic families that already look sufficiently covered

These do not appear to be the main migration gap right now.

### Vona

- `rest-api/`
- `distributed/`
- `techniques/cache/`
- `techniques/openapi/`
- `techniques/orm/`
- `techniques/validation/`

### Zova

- `component/`
- core `page/` topics
- `techniques/css-in-js/`
- `techniques/icon/`
- `techniques/model/`
- `techniques/server-data/`
- `techniques/ssr/`

## Recommended next migration order

1. Vona `aop/`
2. Vona `bal/`
3. Vona backend technique families that are still active framework features (`event`, `i18n`, `jwt`, `logger`, `mail`, `upload`, `serialization`)
4. Zova frontend `essentials/` conceptual guides
5. Zova missing `page/` subtopics (`page-layout`, `progressive-code-splitting`, `zod`)
6. Zova `techniques/mock/`
7. Decide archive-only handling for legacy `start/`, `vue/`, `resources/`, and `others/`

## Verification checklist for future migration work

- verify that any migrated topic is reflected in `cabloy-docs/.vitepress/config.mjs`
- verify that migrated wording uses present-tense canonical docs language rather than migration framing
- verify that root scripts and CLI references still match the current source tree
- do not count any `zh/` page toward completion