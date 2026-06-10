# SSR Leak Experiment Cleanup Checklist

This note turns the SSR leak flag inventory into an executable cleanup checklist and records the cleanup boundary that should be preserved in source.

Use it when removing old investigation gates, reviewing whether a future debug switch still belongs in-tree, or repeating a similar cleanup after another memory investigation.

## Current goal

The runtime-core helper fix is already the accepted product repair:

- `withCurrentInstanceScopeSSR(instance, fn)`

This cleanup is therefore **not** about changing the accepted fix path.

It is about removing one-off SSR investigation switches that were only used to localize the original leak, while preserving the small diagnostic subset that still provides durable value.

## Keep in source for now

Keep only these flags after the cleanup pass:

- `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`
- `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
- `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`
- `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
- `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
- `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
- `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

These are the only flags still broad and reusable enough to justify temporary retention.

## Remove in this cleanup pass

### Phase 1: remove the narrowest component/controller one-offs first

Files:

- `zova/packages-zova/zova-core/src/core/context/component.ts`
- `zova/packages-zova/zova-core/src/components/component.ts`
- `zova/packages-zova/zova-core/src/composables/useController.ts`
- `zova/packages-zova/zova-core/src/bean/beanControllerBase.ts`
- `zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts`

Flags to remove:

- `SSR_LEAK_EXPERIMENT_USE_SHARED_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_SSR_RENDER_RESET`
- `SSR_LEAK_EXPERIMENT_CLEAR_COMPONENT_BEAN_RECORDS`
- `SSR_LEAK_EXPERIMENT_SKIP_USE_CONTROLLER_PAGE`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_LOAD`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_DATA_UPDATE`

Expected result:

- component render patching returns to a single normal path
- SSR render reset is always applied again
- controller/page load and data update always run

### Phase 2: remove root-app, bootstrap, module, and router binary-search grids

Files:

- `zova/packages-utils/zova-vite/templates/app/controller.tsx_`
- `zova/src/boot/zova.ts`
- `zova/packages-zova/zova-core/src/bootstrap.ts`
- `zova/packages-zova/zova-core/src/plugins/zova.ts`
- `zova/packages-zova/zova-core/src/core/app/application.ts`
- `zova/packages-zova/zova-core/src/core/component/module.ts`
- `zova/packages-zova/zova-core/src/core/sys/module.ts`
- `zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-router/src/service/routerGuards.ts`

Flags to remove:

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

Expected result:

- normal bootstrap and app initialization paths always run again
- module lifecycle hooks return to a single standard path
- router guard registration and force-load checks return to normal behavior
- the generated app template no longer carries investigation-only bypass logic

### Phase 3: remove model-stack binary-search switches but keep effect-scope diagnostics

Files:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`

Flags to remove:

- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_VUE_QUERY_PLUGIN_INSTALL`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_QUERY_DEHYDRATE`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_QUERY_CACHES`
- `SSR_LEAK_EXPERIMENT_CLEAR_A_MODEL_MUTATION_CACHES`
- `SSR_LEAK_EXPERIMENT_SKIP_MODEL_QUERY_CACHE`
- `SSR_LEAK_EXPERIMENT_SKIP_QUERY_PERSISTER`
- `SSR_LEAK_EXPERIMENT_SKIP_A_MODEL_MODULE_LOADED`

Flag to keep:

- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Expected result:

- standard Vue Query plugin install/dehydrate/cache behavior becomes unconditional again
- persister creation returns to the normal product path
- only the reusable server effect-scope diagnostic remains available

## Execution notes

1. Remove the source gates first.
2. Re-run a source search for `SSR_LEAK_EXPERIMENT_`.
3. Confirm only the retained eight flags remain in non-doc source.
4. Keep the docs consistent with the resulting source state.

## Verification

### Source verification

Use a source-only search excluding generated assets and dist output.

Success condition:

- only the retained eight flags remain in active source files

### Build verification

Run:

```bash
npm run build
```

This is the preferred repository-level verification because it rebuilds the frontend and backend outputs together.

### Runtime sanity verification

After build, validate that representative SSR pages still render:

- `/demo/basic/toolMinimal`
- `/demo/basic/toolTwo`

## Related records

- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `.docs-internal/architecture/ssr-leak-experiment-flags-inventory.md`
- `.docs-internal/decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md`
