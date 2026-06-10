# SSR Leak Experiment Cleanup Checklist

This note records the execution order and verification path that were used to fully remove the SSR leak investigation flags from active source.

Use it when reviewing how the cleanup was performed, or when planning a future temporary instrumentation pass that should also be cleaned back out after the investigation ends.

## Final outcome

The cleanup is complete.

Current source state:

- no `SSR_LEAK_EXPERIMENT_*` flags remain in active source

The accepted product repair remains:

- `withCurrentInstanceScopeSSR(instance, fn)`

## Cleanup objective

The objective was to remove all investigation-only runtime branches after the proven fix and the residual-tail analysis had already been documented.

This cleanup was **not** intended to change the accepted repair path.

It was intended to:

- remove one-off investigation scaffolding
- restore single normal execution paths where possible
- keep the investigation knowledge in docs instead of in long-lived env gates

## Execution order that was used

### Phase 1: remove component/controller one-offs

Files:

- `zova/packages-zova/zova-core/src/core/context/component.ts`
- `zova/packages-zova/zova-core/src/components/component.ts`
- `zova/packages-zova/zova-core/src/composables/useController.ts`
- `zova/packages-zova/zova-core/src/bean/beanControllerBase.ts`
- `zova/packages-zova/zova-core/src/bean/beanControllerPageBase.ts`

Removed flags:

- `SSR_LEAK_EXPERIMENT_USE_SHARED_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_RENDER_PATCH`
- `SSR_LEAK_EXPERIMENT_SKIP_COMPONENT_SSR_RENDER_RESET`
- `SSR_LEAK_EXPERIMENT_CLEAR_COMPONENT_BEAN_RECORDS`
- `SSR_LEAK_EXPERIMENT_SKIP_USE_CONTROLLER_PAGE`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_LOAD`
- `SSR_LEAK_EXPERIMENT_SKIP_CONTROLLER_DATA_UPDATE`

Result:

- controller/page load paths returned to normal execution
- component render patching returned to a single standard path

### Phase 2: remove app/bootstrap/module/router binary-search grids

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

Removed flags:

- the app/bootstrap/module/router `SKIP_*` investigation grid introduced during binary search

Result:

- bootstrap and initialization returned to standard execution
- module lifecycle hooks returned to standard execution
- router guard registration and route force-load logic returned to standard execution

### Phase 3: remove model-stack binary-search flags

Files:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useMutation.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`

Removed flags:

- the a-model investigation skip/clear flags
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Result:

- query/mutation/state/persister logic returned to standard execution
- no alternate SSR effect-scope branch remains in product code

### Phase 4: remove the last retained diagnostic flags

Files:

- `zova/src/boot/app/index.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`
- a-model files that still referenced `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Removed flags:

- `SSR_LEAK_EXPERIMENT_USE_EMPTY_ROOT_COMPONENT`
- `SSR_LEAK_EXPERIMENT_SKIP_SERVER_ENTRY`
- `SSR_LEAK_EXPERIMENT_SKIP_RENDER_TO_STRING`
- `SSR_LEAK_EXPERIMENT_FORCE_ON_RENDERED_CLEANUP`
- `SSR_LEAK_EXPERIMENT_SEVER_SSR_CONTEXT_FIELDS`
- `SSR_LEAK_EXPERIMENT_SEVER_VUE_APP_GRAPH`
- `SSR_LEAK_EXPERIMENT_SEVER_ZOVA_APP_REFS`
- `SSR_LEAK_EXPERIMENT_USE_MODEL_EFFECT_SCOPE`

Result:

- all remaining investigation-only env gates were removed from active source

## Verification path used

### Source verification

Run a source-only search excluding generated output.

Success condition:

- no `SSR_LEAK_EXPERIMENT_*` matches remain in active source files

### Type verification

Run:

```bash
pnpm --dir zova run tsc
```

Success condition:

- typecheck passes after removing the final investigation branches

### Repository build verification

Run:

```bash
npm run build
```

Success condition:

- frontend and backend outputs rebuild successfully after the full cleanup

### Diff sanity verification

Run:

```bash
git diff --check
```

Success condition:

- no whitespace or patch-format issues remain

## Practical rule for future investigations

If a future SSR memory investigation needs new env-gated probes, treat them as temporary instrumentation.

The intended lifecycle is:

1. add the smallest useful probe surface
2. record findings in `.docs-internal`
3. remove the probes once conclusions are stable

Do not let the framework accumulate a permanent `SSR_LEAK_EXPERIMENT_*` layer without clear recurring operational need.

## Related records

- `.docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `.docs-internal/architecture/ssr-leak-experiment-flags-inventory.md`
- `.docs-internal/decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md`
