# SSR Route Typing and Zova Rest Declaration Visibility

This note records the recent investigation into why backend SSR consumers in `vona` could fail to see route augmentations contributed by frontend modules through generated `zova-rest-*` declarations.

Use it when future work needs to:

- diagnose why a backend SSR route key unexpectedly collapses to `never`
- understand why `export * from 'zova-module-rest-resource'` was not sufficient on its own
- preserve the declaration-visibility boundary in `buildRest`
- validate that generated `zova-rest-*` packages still carry frontend module augmentation into backend consumers

## Why this note exists

The concrete symptom was a backend SSR typing failure around:

- `'/rest/resource/:resource'`

That route is contributed by `zova-module-rest-resource` through interface merging on `IPagePathRecord`, but the backend consumer path could still fail to see it. The practical effect was that:

- `'/rest/resource/:resource'` could collapse to `never`
- `Ssr.redirect('basic-siteadmin:admin', '/rest/resource/:resource', ...)` could stop resolving through the expected SSR site typing path

This was not a runtime SSR redirect bug. The problem was declaration visibility across the generated `zova-rest-*` contract package boundary.

## The affected type-flow chain

The relevant fullstack type-flow is:

1. `zova/packages-cli/cli-set-front/src/lib/bean/cli.bin.buildRest.ts`
   - generates the `zova-rest-*` bundle source and declaration output
2. `zova/packages-cli/cli-set-front/cli/templates/rest/utils.ts`
   - defines part of the generated rest type surface, including `IIconRecord` / `IPagePathRecord` re-exports
3. `zova/dist/rest-cabloyBasicAdmin/index.d.mts`
   - shows the final declaration artifact emitted by the rest build
4. `vona/.zova-rest/cabloy-basic-admin/index.d.mts`
   - shows the generated package surface consumed by the Vona workspace
5. `vona/src/suite/cabloy-basic/modules/basic-siteadmin/src/bean/ssrSite.admin.ts`
   - binds admin SSR site typing to `IPagePathRecord` from `zova-rest-cabloy-basic-admin`
6. `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/types/ssrSite.ts`
   - defines `IDecoratorSsrSiteOptions` and the `pages` type surface
7. `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/ssr.ts`
   - constrains `Ssr.redirect(...)` with `PAGEPATH extends keyof ISsrSiteRecord[SITE]['pages']`
8. `vona/src/suite-vendor/a-test/modules/test-rest/src/controller/product.tsx`
   - exercises the real consumer case with:

```ts
@Ssr.redirect('basic-siteadmin:admin', '/rest/resource/:resource', {
  params: { resource: 'test-rest:product' },
})
```

The important point is that the backend site typing does not invent its own route record. It consumes the generated frontend declaration surface through `zova-rest-cabloy-basic-admin`.

## Root cause

The route itself was already declared correctly in `zova-module-rest-resource` through module augmentation on `zova-module-a-router`.

The problem was that the final generated `index.d.mts` could still lose the visibility signal needed for backend consumers to reliably observe that augmentation.

More specifically:

- `export * from 'zova-module-rest-resource'` alone was not sufficient to guarantee declaration-augmentation visibility in the final emitted declaration artifact
- the post-build declaration output needed explicit side-effect imports for non-bundled modules whose augmentations must stay visible to downstream consumers
- dependency extraction also needed to recognize bare imports such as `import "zova-module-rest-resource";`

A second detail mattered during the fix:

- modules already bundled into the declaration output must **not** be re-injected through the post-build import list

That bundled-vs-non-bundled distinction is part of the stable fix boundary.

## Implemented fix

The accepted fix lives in:

- `zova/packages-cli/cli-set-front/src/lib/bean/cli.bin.buildRest.ts`

### 1. Preserve declaration visibility with post-build side-effect imports

After declaration build completion, `buildRest` now rewrites the final `index.d.mts` and injects side-effect imports for non-bundled modules.

That preserves lines such as:

```ts
import 'zova-module-rest-resource';
```

in the final generated declaration entry.

### 2. Keep `bundleModules` out of the injected list

`bundleModules` are already carried by the declaration bundle output, so they should not be added again through the post-build injection path.

The generator now keeps these boundaries separate:

- bundled modules participate in declaration bundling
- non-bundled modules are candidates for post-build side-effect import injection

This avoids over-injecting modules that are already represented inside the final artifact.

### 3. Re-export missing rest-facing types in the template layer

The generated rest utilities also needed to expose the expected route/icon typing surface from the template layer.

That supporting change lives in:

- `zova/packages-cli/cli-set-front/cli/templates/rest/utils.ts`

The important additions were explicit re-exports for:

- `IIconRecord`
- `IPagePathRecord`

### 4. Widen dependency extraction for bare imports

Because the final declaration file now intentionally contains bare imports, `_extractDeps` in `cli.bin.buildRest.ts` had to recognize both:

- `import ... from 'pkg'`
- `import 'pkg'`

Without that widening, the generated `package.json` dependencies could drift from the declaration file's actual import surface.

## Validation that proved the fix

### Generated-artifact validation

After the generator fix, the built admin declaration artifact preserved the required side-effect import in:

- `zova/dist/rest-cabloyBasicAdmin/index.d.mts`

and the Vona-consumed generated package surface also preserved it in:

- `vona/.zova-rest/cabloy-basic-admin/index.d.mts`

The key evidence was the presence of:

```ts
import 'zova-module-rest-resource';
```

in the final declaration entry.

### Real consumer validation path

The consumer-side validation focused on the real backend chain:

- `vona/src/suite/cabloy-basic/modules/basic-siteadmin/src/bean/ssrSite.admin.ts`
- `vona/src/suite-vendor/a-test/modules/test-rest/src/controller/product.tsx`
- `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/ssr.ts`

This proves the fix at the actual backend consumption point rather than only at the generated-file inspection layer.

### Focused compiler validation result

A focused TypeScript compiler-API probe was used against the real consumer package graph.

The confirmed result was:

- `'/rest/resource/:resource' extends keyof ISsrSiteOptionsAdmin['pages']` resolved to `true`
- `Ssr.redirect('basic-siteadmin:admin', '/rest/resource/:resource', { params: { resource: 'test-rest:product' } })` resolved successfully

That is the decisive validation because it checks the exact downstream contract that originally failed.

## Guardrails for future work

Preserve these invariants when changing `buildRest`, rest templates, or the generated declaration post-processing flow:

1. Generated `zova-rest-*` declaration entries must preserve module-augmentation visibility for backend consumers.
2. If post-build declaration rewriting changes, re-check that the final `index.d.mts` still preserves the required side-effect imports for non-bundled modules.
3. Keep the distinction between bundled modules and non-bundled modules when deciding which imports to inject.
4. Treat generated artifacts as evidence to inspect, but keep source-of-truth fixes in the generator/template layer rather than hand-editing generated output.
5. When a backend SSR route suddenly becomes `never`, inspect the generated declaration entry first before assuming the route module itself is missing the augmentation.

## Troubleshooting checklist

When a backend SSR route unexpectedly collapses to `never`, use this order before changing business code.

1. Confirm the route really comes from frontend module augmentation rather than from a local backend route record.
2. Inspect the final generated declaration entry first:
   - `zova/dist/rest-cabloyBasicAdmin/index.d.mts`
   - `vona/.zova-rest/cabloy-basic-admin/index.d.mts`
3. Check whether the expected side-effect import is present, for example:

```ts
import 'zova-module-rest-resource';
```

4. Confirm the generated rest template still re-exports the route-facing types from:
   - `zova/packages-cli/cli-set-front/cli/templates/rest/utils.ts`
5. Confirm `buildRest` is still preserving the bundled-vs-non-bundled split in:
   - `zova/packages-cli/cli-set-front/src/lib/bean/cli.bin.buildRest.ts`
6. If injected bare imports are present, confirm generated `package.json` dependencies still match the final declaration import surface.
7. If the declaration artifact already looks correct but Vona still sees stale typing, inspect local dependency drift next before hand-patching generated output.
8. Re-validate at the real consumer boundary rather than only at the generated-file layer:
   - `vona/src/suite/cabloy-basic/modules/basic-siteadmin/src/bean/ssrSite.admin.ts`
   - `vona/src/suite-vendor/a-test/modules/test-rest/src/controller/product.tsx`
   - `vona/src/suite-vendor/a-cabloy/modules/a-ssr/src/lib/ssr.ts`

## Generated-artifact caveats

A few debugging rules from this investigation should remain explicit:

- `.zova-rest/*` is temporary build output and not the long-term source of truth
- `zova/dist/rest-*` and `vona/.zova-rest/*` are useful evidence surfaces because they show what downstream consumers actually receive
- if the declaration artifact already contains the expected side-effect import but the backend still sees stale typing, inspect local dependency drift next
- if future changes rely on injected bare imports, always confirm generated `package.json` dependencies still match the final declaration import surface

## Related records

- `.docs-internal/architecture/vona-zova-install-time-type-patch.md`
- `.docs-internal/architecture/ssr-vona-zova-boundary-and-call-chain.md`
