# SSR Leak Experiment Flags Inventory

This note records the SSR leak investigation flags that were introduced during the investigation, which ones still remain in source after cleanup, and which ones were intentionally removed.

Use it when deciding whether a future SSR debugging switch should be kept in-tree, or when checking whether an old leak-investigation branch is still supposed to exist.

## Current status

A cleanup pass removed the one-off binary-search and narrow render/controller experiment flags.

After that cleanup, only this temporary diagnostic subset remains in active source:

- `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`
- `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
- `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`
- `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
- `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
- `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
- `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

## Why these flags remain

These are the only flags still broad and reusable enough to justify temporary retention.

They help isolate:

- top-of-tree root-page participation
- server-entry vs render-time behavior
- SSR handler cleanup/finalization boundaries
- model/query effect-scope behavior on the server

They should still be treated as diagnostic tools, not as accepted production defaults.

## Remaining flags in source

### Root-app isolation

#### `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`

Source:

- `zova/src/boot/app/index.ts`

Why it remains:

- useful as a coarse root-component isolation switch
- broad enough to justify temporary retention

### SSR handler pipeline and cleanup boundaries

#### `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
#### `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`
#### `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
#### `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
#### `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
#### `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`

Source:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`

Why they remain:

- they isolate broad SSR lifecycle and teardown boundaries
- they were still useful during the post-fix second-cause analysis
- they are better reusable diagnostics than dozens of fine-grained skip flags spread across app/module/controller code

Caveat:

- none of these flags were promoted to normal product behavior

### Model/query effect-scope diagnostic

#### `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Sources:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useMutation.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`

Why it remains:

- it captures a reusable SSR hypothesis family around effect ownership and disposal
- it is more durable than the other a-model binary-search switches

## Removed in the cleanup pass

The following flag families were intentionally removed from active source.

### Removed component/controller one-offs

- `SSR_LEAK_EXPERIMENT_USE_SHARED_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_SSR_RENDER_RESET`
- `SSR_LEAK_EXPERIMENT_CLEAR_COMPONENT_BEAN_RECORDS`
- `SSR_LEAK_EXPERIMENT_SKIP_USE_CONTROLLER_PAGE`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_LOAD`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_DATA_UPDATE`

Reason:

- these were narrow, one-off search tools around highly sensitive component and controller paths
- the accepted product fix did not depend on them

### Removed app/bootstrap/module/router skip grids

- `SSR_LEAK_EXPERIMENT_SKIP_BOOT_ZOVA`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_PLUGIN_BEAN`
- `SSR_LEAK_EXPERIMENT_SKIP_PLUGIN_FREEZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_INIT`
- `SSR_LEAK_EXPERIMENT_SKIP_ROOT_APP_BEAN_INIT`
- `SSR_LEAK_EXPERIMENT_SKIP_ZOVA_APP_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_SYS_APPLICATION_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_META_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_COMPONENT_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_LOCALE_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_ERROR_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MODULE_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MONKEY_APP_INITIALIZE`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MONKEY_APP_INITIALIZED`
- `SSR_LEAK_EXPERIMENT_SKIP_APP_MONKEY_APP_READY`
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
- `SSR_LEAK_EXPERIMENT_SKIP_APP_INITIALIZED_ROUTER_GUARDS`
- `SSR_LEAK_EXPERIMENT_SKIP_ROUTER_PREPARE_CHECK`
- `SSR_LEAK_EXPERIMENT_SKIP_ROUTER_FORCE_LOAD_MODULE`
- `SSR_LEAK_EXPERIMENT_SKIP_ROUTER_AFTER_EACH`

Reason:

- these were broad but investigation-specific binary-search grids
- keeping them permanently would leave too much scaffolding in the normal runtime path

### Removed model-stack binary-search flags

- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_VUE_QUERY_PLUGIN_INSTALL`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_QUERY_DEHYDRATE`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_QUERY_CACHES`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_MUTATION_CACHES`
- `SSR_LEAK_EXPERIMENT_SKIP_MODEL_QUERY_CACHE`
- `SSR_LEAK_EXPERIMENT_SKIP_QUERY_PERSISTER`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_MODULE_LOADED`

Reason:

- the runtime-core fix did not depend on them
- the residual-tail work did not isolate a second model-specific leak root cause
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE` was the only durable diagnostic worth keeping

## Guidance for future contributors

Do not treat the existence of a remaining flag as proof that its guarded branch is a valid production fix.

In this investigation:

- many flags were only search tools
- the cleanup removed those one-off branches
- only a small temporary diagnostic toolkit remains in source
- the accepted product fix is still the runtime-core helper, not the surviving flags

## Related records

- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `.docs-internal/architecture/ssr-leak-experiment-cleanup-checklist.md`
- `.docs-internal/decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md`
