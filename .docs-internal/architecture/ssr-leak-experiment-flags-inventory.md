# SSR Leak Experiment Flags Inventory

This note inventories the SSR leak investigation flags currently present in source, groups them by subsystem, and records whether they should be kept as reusable diagnostics or removed after the investigation.

Use it when cleaning up the current work, reviewing future regressions, or deciding which experimental switches are still worth carrying in-tree.

## Why this note exists

The SSR leak investigation introduced many `SSR_LEAK_EXPERIMENT_*` switches across Zova SSR lifecycle paths.

These flags were useful for narrowing the leak boundary, but they do not all serve the same long-term purpose.

Without an inventory, future contributors may not know:

- which flags were part of the proven root-cause path
- which flags were only temporary isolation aids
- which flags are still valuable as reusable diagnostics
- which flags should eventually be removed to reduce maintenance noise

## Overall recommendation

### Keep as reusable diagnostics

Keep only the small subset of flags that still provide durable value for future SSR investigations, especially when they isolate broad lifecycle stages or cleanup boundaries.

### Remove after the investigation is archived

Most narrow skip flags were one-off binary-search aids used to localize the original leak. They should not become permanent framework surface area unless a new investigation reuses them in practice.

## Decision categories

This document uses four categories.

### Keep

Retain in source because the flag still provides durable diagnostic value and the guarded logic is broad enough to justify the maintenance cost.

### Keep temporarily

Retain for now while the investigation is still fresh, but plan to remove once the current cleanup pass or follow-up validation cycle is complete.

### Remove when convenient

No longer needed for the proven fix. Safe to remove in a cleanup-focused refactor once the team no longer expects to reuse it immediately.

### Remove first

Strongly candidate for early removal because it guards narrow one-off experiments or invasive branches that are unlikely to be reused safely.

## Group 1: confirmed-fix boundary and high-value reusable diagnostics

### `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`

Sources:

- `zova/src/boot/app/index.ts`

Recommendation:

- **Keep temporarily**

Why:

- useful as a high-level top-of-tree isolation switch for future SSR page-chain investigations
- cheap to understand
- broad enough to remain diagnostically meaningful

Why not permanent keep yet:

- still investigation-specific naming
- if retained long-term, it may deserve a more generic debug name later

### `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
- `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`

Sources:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`

Recommendation:

- **Keep temporarily**

Why:

- these isolate very broad SSR pipeline stages
- they are still useful for distinguishing server-entry construction from render-time behavior

Why not permanent keep yet:

- still named as one investigation rather than a stable debug facility

### `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
- `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
- `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
- `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`

Sources:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`

Recommendation:

- **Keep temporarily**

Why:

- these were reused in the second-cause analysis and remain useful for future retained-graph experiments
- they isolate cleanup/finalization concerns cleanly

Caveat:

- the investigation did **not** prove they should become production defaults
- retain only as diagnostic switches, not as accepted product behavior

## Group 2: model/query diagnostics that may still be useful

### `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Sources:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useMutation.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`

Recommendation:

- **Keep temporarily**

Why:

- this is one of the few flags that captures a reusable hypothesis family: query/mutation composables creating effects that might need explicit scoping on the server
- it is meaningful beyond this single investigation

### `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_VUE_QUERY_PLUGIN_INSTALL`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_QUERY_DEHYDRATE`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_QUERY_CACHES`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_MUTATION_CACHES`
- `SSR_LEAK_EXPERIMENT_SKIP_MODEL_QUERY_CACHE`
- `SSR_LEAK_EXPERIMENT_SKIP_QUERY_PERSISTER`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_MODULE_LOADED`

Sources:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts`

Recommendation:

- **Remove when convenient**, except `USE_MODEL_EFFECT_SCOPE` above

Why:

- these were useful binary-search toggles for the model stack
- the formal fix did not depend on them
- the residual-tail analysis did not isolate a second business-level model leak

## Group 3: app/bootstrap/module/router binary-search switches

These flags were valuable during localization but now mostly represent one-off skip surfaces rather than durable diagnostics.

### Bootstrap and root-app entry

- `SSR_LEAK_EXPERIMENT_SKIP_BOOT_ZOVA`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_PLUGIN_BEAN`
- `SSR_LEAK_EXPERIMENT_SKIP_PLUGIN_FREEZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_INIT`
- `SSR_LEAK_EXPERIMENT_SKIP_ROOT_APP_BEAN_INIT`
- `SSR_LEAK_EXPERIMENT_SKIP_ZOVA_APP_INITIALIZE`

Sources:

- `zova/src/boot/zova.ts`
- `zova/packages-zova/zova-core/src/bootstrap.ts`
- `zova/packages-utils/zova-vite/templates/app/controller.tsx_`
- `zova/packages-zova/zova-core/src/plugins/zova.ts`

Recommendation:

- **Remove when convenient**

Why:

- broad skip switches helped localize the initial boundary
- the runtime-core fix resolved the main problem
- keeping all of them permanently would leave too much investigation scaffolding in the normal code path

### Application initialization sub-stages

- `SSR_LEAK_EXPERIMENT_SKIP_SYS_APPLICATION_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_META_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_COMPONENT_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_LOCALE_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_ERROR_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MONKEY_APP_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MONKEY_APP_INITIALIZED`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MONKEY_APP_READY`

Sources:

- `zova/packages-zova/zova-core/src/core/app/application.ts`
- `zova/packages-utils/zova-vite/templates/app/controller.tsx_`

Recommendation:

- **Remove when convenient**

Why:

- these are extremely useful during a one-time binary search
- but too granular to justify long-term surface area once the main issue is solved

### Module lifecycle sub-stages

- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_PRELOADS`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_MONKEYS`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_SYNCS`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_MONKEY_MODULE_LOADING`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_MONKEY_MODULE_LOADED`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_MODULE_LOAD_ALL`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_MODULE_PRELOADS`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_MODULE_MONKEYS`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_MODULE_SYNCS`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_MODULE_OTHERS`

Sources:

- `zova/packages-zova/zova-core/src/core/component/module.ts`
- `zova/packages-zova/zova-core/src/core/sys/module.ts`
- `zova/packages-utils/zova-vite/templates/app/controller.tsx_`

Recommendation:

- **Remove when convenient**

Why:

- these were search-grid toggles for broad app/module execution
- they are unlikely to be reused often enough to justify their maintenance cost

### Router-stage binary-search switches

- `SSR_LEAK_EXPERIMENT_SKIP_APP_INITIALIZED_ROUTER_GUARDS`
- `SSR_LEAK_EXPERIMENT_SKIP_ROUTER_PREPARE_CHECK`
- `SSR_LEAK_EXPERIMENT_SKIP_ROUTER_FORCE_LOAD_MODULE`
- `SSR_LEAK_EXPERIMENT_SKIP_ROUTER_AFTER_EACH`

Sources:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts`

Recommendation:

- **Remove when convenient**

Why:

- valuable during route-pipeline exclusion tests
- no longer needed for the accepted fix path

## Group 4: very narrow component/controller experiment flags

### Component/render patch flags

- `SSR_LEAK_EXPERIMENT_USE_SHARED_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_SSR_RENDER_RESET`
- `SSR_LEAK_EXPERIMENT_CLEAR_COMPONENT_BEAN_RECORDS`

Sources:

- `zova/packages-zova/zova-core/src/core/context/component.ts`

Recommendation:

- **Remove first**

Why:

- these guard very narrow hypotheses around render-patch behavior
- the user explicitly asked to avoid moving the main investigation into render-patch changes early
- the formal fix did not depend on this branch
- retaining them permanently risks future confusion around a highly sensitive path

### Controller and page-loading narrow switches

- `SSR_LEAK_EXPERIMENT_SKIP_USE_CONTROLLER_PAGE`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_LOAD`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_DATA_UPDATE`

Sources:

- `zova/packages-zova/zova-core/src/components/component.ts`
- `zova/packages-zova/zova-core/src/composables/useController.ts`
- `zova/packages-zova/zova-core/src/bean/beanControllerBase.ts`
- `zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts`

Recommendation:

- **Remove when convenient**

Why:

- useful for the original narrowing work
- but now superseded by the durable runtime-core explanation

## Suggested cleanup order

If the repository wants to reduce experiment clutter in stages, use this order.

### Phase A: remove the narrowest one-off switches first

Highest-priority cleanup candidates:

- `SSR_LEAK_EXPERIMENT_USE_SHARED_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_SSR_RENDER_RESET`
- `SSR_LEAK_EXPERIMENT_CLEAR_COMPONENT_BEAN_RECORDS`

### Phase B: remove binary-search skip grids

Next candidates:

- controller/load/update skip flags
- router skip flags
- module-stage skip flags
- app-stage skip flags

### Phase C: decide whether to preserve a small diagnostic toolkit

If a small reusable investigation toolkit is desired, the best candidates to keep temporarily are:

- `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`
- `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
- `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`
- `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
- `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
- `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
- `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

If even that is too much long-term surface area, convert them later into a smaller, more intentionally named debug interface rather than keeping the investigation-specific names forever.

## Important rule for future contributors

Do not treat the existence of a flag as evidence that the guarded branch is a valid production fix.

In this investigation:

- many flags were only search tools
- several cleanup/sever flags were useful for proof work
- only the runtime-core helper became the accepted product fix

## Related records

- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `.docs-internal/decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md`
