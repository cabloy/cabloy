# SSR Leak Experiment Flags Inventory

This note records the SSR leak investigation flags that were introduced during the investigation and confirms that they were later fully removed from active source.

Use it when checking historical investigation branches, deciding whether an old diagnostic switch is still supposed to exist, or planning a future leak investigation without reintroducing stale product-code scaffolding by accident.

## Current status

A follow-up cleanup pass removed the remaining retained diagnostic flags.

Current source state:

- no `SSR_LEAK_EXPERIMENT_*` flags remain in active source

This is the intended steady state.

The accepted product fix remains:

- `withCurrentInstanceScopeSSR(instance, fn)`

The investigation-specific flags were useful during diagnosis, but they are no longer carried in the main runtime code paths.

## Why full removal was chosen

The final decision was to prefer:

- a clean product runtime surface
- durable investigation documentation
- temporary reintroduction of probes only when a future regression truly requires them

instead of permanently keeping investigation-only branches in framework code.

That trade-off was chosen because:

- the main SSR leak had already been fixed at the runtime-core boundary
- the residual-tail investigation did not justify a second permanent product-side fix
- the remaining flags were diagnostic aids, not accepted product behavior
- keeping them in-tree would continue to add runtime branching and reader confusion in sensitive code paths

## Historical flag families that were removed

The following groups were intentionally removed from active source.

### Component and controller one-offs

- `SSR_LEAK_EXPERIMENT_USE_SHARED_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_SSR_RENDER_RESET`
- `SSR_LEAK_EXPERIMENT_CLEAR_COMPONENT_BEAN_RECORDS`
- `SSR_LEAK_EXPERIMENT_SKIP_USE_CONTROLLER_PAGE`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_LOAD`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_DATA_UPDATE`

Why they were removed:

- they were narrow search tools around highly sensitive component and controller behavior
- the accepted repair did not depend on them

### App, bootstrap, module, and router binary-search grids

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

Why they were removed:

- they were broad but investigation-specific binary-search scaffolding
- leaving them in-tree would keep too much non-product branching in standard execution paths

### Model-stack binary-search and effect-scope diagnostics

- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_VUE_QUERY_PLUGIN_INSTALL`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_QUERY_DEHYDRATE`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_QUERY_CACHES`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_MUTATION_CACHES`
- `SSR_LEAK_EXPERIMENT_SKIP_MODEL_QUERY_CACHE`
- `SSR_LEAK_EXPERIMENT_SKIP_QUERY_PERSISTER`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_MODULE_LOADED`
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Why they were removed:

- none of them became part of the accepted repair path
- the residual-tail work did not prove a model-specific second root cause
- keeping even the last reusable diagnostic would still preserve an investigation-only alternate path in product code

### Final retained diagnostic flags that were also removed later

These were temporarily retained after the first cleanup pass, then removed in the final cleanup:

- `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`
- `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
- `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`
- `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
- `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
- `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
- `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Why they were ultimately removed too:

- they still represented diagnostic-only behavior rather than accepted runtime behavior
- the repo now has enough durable documentation to reconstruct the investigation without keeping those branches live in source

## Guidance for future contributors

Do not treat the absence of these flags as loss of investigation history.

The durable artifacts are now:

- the runtime-core fix itself
- the investigation guide
- the ADR explaining why product fixes stop at the runtime-core boundary
- the cleanup records in this documentation set

If a future regression needs similar diagnostics again, prefer:

1. reproducing the issue from the documented workflow
2. adding temporary focused probes for that investigation
3. deleting them again after conclusions are recorded

Do not rebuild a permanent `SSR_LEAK_EXPERIMENT_*` surface unless a recurring operational need is proven.

## Related records

- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `.docs-internal/architecture/ssr-leak-experiment-cleanup-checklist.md`
- `.docs-internal/decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md`
