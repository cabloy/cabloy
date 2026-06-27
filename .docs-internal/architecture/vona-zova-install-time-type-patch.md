# Vona/Zova Install-Time Type Patch

This note records the current Vona-side compatibility patch that removes a Zova global type augmentation during `pnpm install`.

Use it when future work needs to:

- understand why Vona keeps a workspace-level pnpm patch for `zova-core`
- diagnose TypeScript conflicts that appear only after `.zova-rest/*` pulls `zova` and `zova-core` into the Vona type program
- update the patch after a `zova-core` version bump
- decide whether a new failure is local dependency drift, generated-output drift, or a repeat of the known global-type collision

## Why this note exists

Cabloy Basic intentionally lets Vona consume generated frontend contract output through local `zova-rest-*` file dependencies.

That preserves the full contract-loop path, including:

- generated `zova-rest-*` package output
- `zova-module-*` interface surfaces
- business-side module augmentation and interface merging

A facade-only replacement was rejected for this path because it would cut through the interface-merging chain that backend consumers rely on.

The actual conflict came from a smaller boundary:

- Vona imports `zova-rest-cabloy-basic-admin` / `zova-rest-cabloy-basic-web`
- those generated packages import `zova`
- `zova` re-exports `zova-core`
- `zova-core` contributes several global or shared-surface augmentations
- Vona contributes its own backend-specific augmentations on some of the same surfaces

Once both declaration sets enter the same TypeScript program, merges can fail even though package resolution itself is behaving correctly.

There is also a separate init-time hazard:

- `vona/package.original.json` intentionally keeps a smaller bootstrap dependency set
- the generated `.zova-rest/*` file dependencies are normally restored by `vona :tools:deps`
- if `scripts/init.ts` restores `package.original.json` and runs `pnpm install` before those file dependencies are present, pnpm may not see any path to `zova-core`
- in that state, `patchedDependencies` can fail with `ERR_PNPM_UNUSED_PATCH` even though a normal Vona working tree install would succeed

## Confirmed conflict shape

The known collisions were between Vona source declarations and installed `zova-core` declarations on three surfaces.

### 1. Global `Error`

Collision between:

- `vona/packages-vona/vona-core/src/lib/bean/resource/error/errorGlobal.ts`
- installed `zova-core/dist/bean/resource/error/errorGlobal.d.ts`

The conflicting fields were:

- `Error.code`
- `Error.status`

### 2. `NodeJS.ProcessEnv`

Collision between:

- `vona/packages-vona/vona-core/src/types/utils/env.ts`
- installed `zova-core/dist/types/utils/env.d.ts`

The conflicting fields included:

- `NODE_ENV`
- `META_FLAVOR`
- `META_MODE`

This produced downstream mode-comparison errors because Zova's frontend-side environment mode types are not the same as Vona's backend-side environment mode types.

### 3. `@cabloy/module-info` module augmentation

Collision between:

- `vona/packages-vona/vona-core/src/types/interface/module.ts`
- installed `zova-core/dist/types/interface/module.d.ts`

Both sides augment `@cabloy/module-info`, but they attach different `resource`, `Main`, `Monkey`, and monkey-lifecycle expectations.

That mismatch produced follow-on errors involving:

- `IModule.resource`
- `IModuleMain`
- monkey lifecycle methods such as `configLoaded`
- backend code expecting `VonaApplication`-oriented module config types while Zova expects `ZovaSys`

The critical point is still not package precedence. The issue is that both packages augment the same shared interfaces inside one TS program.

## Current fix boundary

The current repository rule is:

- keep the `zova-rest-* -> zova -> zova-module-*` type chain intact for backend consumers
- remove only the specific installed `zova-core` augmentations that collide with Vona's backend declaration surfaces

That boundary is implemented as a pnpm patch in the Vona workspace.

## Current implementation

Vona keeps a workspace-level patch registration in:

- `vona/pnpm-workspace.yaml`

The patch file currently lives at:

- `vona/patches/zova-core@5.1.61.patch`

The patch currently rewrites three installed declaration files:

- `zova-core/dist/bean/resource/error/errorGlobal.d.ts`
- `zova-core/dist/types/utils/env.d.ts`
- `zova-core/dist/types/interface/module.d.ts`

The current behavior is:

- replace `errorGlobal.d.ts` with a no-op module:

```ts
export {};
```

- remove the `NodeJS.ProcessEnv` global augmentation from `env.d.ts`
- remove the `declare module '@cabloy/module-info'` augmentation from `module.d.ts`

This keeps the rest of the `zova-core` and `zova-module-*` declaration graph available while removing the known Vona-colliding augmentations.

## Why the patch lives in `pnpm-workspace.yaml`

With pnpm 11, `patchedDependencies` should be configured in workspace settings rather than in `package.json`.

For this repository, that means:

- use `vona/pnpm-workspace.yaml`
- do not rely on `vona/package.json -> pnpm.patchedDependencies`

If future pnpm behavior changes again, verify the supported config home before adjusting the patch wiring.

## Maintenance rules

### 1. Treat this as a compatibility patch, not the long-term architecture

This patch is acceptable because it is:

- workspace-scoped to Vona
- narrowly targeted at a small set of installed declaration files proven to collide with Vona
- preserving the existing fullstack type-flow instead of replacing it with a facade

It should not be treated as proof that broad manual patching of generated or installed types is the normal workflow.

### 2. Version bumps require patch review

The patch key is version-specific.

If `zova-core` changes version:

1. inspect the installed declaration graph again
2. confirm whether these files still exist and still contribute the same conflicting augmentations:
   - `dist/bean/resource/error/errorGlobal.d.ts`
   - `dist/types/utils/env.d.ts`
   - `dist/types/interface/module.d.ts`
3. regenerate or update the patch file for the new version
4. rerun Vona typecheck
5. rerun the root `npm run tsc` check, because some conflicts only surface when the full root workflow drives both Zova and Vona checks together

Do not assume a version bump preserves the same patch target paths or the same collision set.

### 3. Keep the patch as small as possible

Do not widen this patch to strip unrelated `zova` or `zova-module-*` types unless source proof shows they are part of the same root cause.

The purpose is to remove one global collision while preserving interface merging elsewhere.

### 4. Prefer source fixes when architecture work becomes feasible

If future framework work can safely consolidate the global `Error` ownership into a single shared type source, that is architecturally cleaner than continuing install-time patches forever.

Until then, preserve this narrow workspace patch because it keeps current Vona/Zova contract flow working.

## Regeneration workflow

When the patch must be refreshed, the representative flow is:

```bash
cd vona
pnpm patch zova-core@<version>
# edit dist/bean/resource/error/errorGlobal.d.ts to: export {};
# remove the NodeJS.ProcessEnv augmentation from dist/types/utils/env.d.ts
# remove the @cabloy/module-info augmentation from dist/types/interface/module.d.ts
pnpm patch-commit <edit-dir>
pnpm install
pnpm exec tsc -p tsconfig.json --noEmit
npm run tsc
```

After regenerating the patch:

- confirm `vona/pnpm-workspace.yaml` still points at the correct patch file
- confirm `vona/pnpm-lock.yaml` records the patched dependency
- confirm Vona typecheck still passes
- confirm the root `npm run tsc` workflow still passes

## Verification rule

After any patch addition or update, run at least:

```bash
cd vona && pnpm exec tsc -p tsconfig.json --noEmit
```

If the patch was added while debugging `.zova-rest` consumption drift, also confirm the relevant generated package still resolves from Vona as expected.

If the change touches `scripts/init.ts` or `vona/package.original.json`, also run root init:

```bash
npm run init
```

That catches the specific bootstrap-only case where `package.original.json` is restored first and the first Vona install must still see enough `.zova-rest` dependencies for the `zova-core` patch to be considered used.

## Related guidance

- `.docs-internal/architecture/backend-resource-field-workflow.md`
- `.docs-internal/architecture/ssr-vona-zova-boundary-and-call-chain.md`
- `cabloy-docs/fullstack/contract-loop-playbook.md`
