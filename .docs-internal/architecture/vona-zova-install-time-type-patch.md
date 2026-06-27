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
- `zova-core` contributes a global `Error` augmentation
- Vona also contributes its own global `Error` augmentation

Once both declarations enter the same TypeScript program, `interface Error` merges and can fail with incompatible property types.

## Confirmed conflict shape

The known collision was between:

- `vona/packages-vona/vona-core/src/lib/bean/resource/error/errorGlobal.ts`
- installed `zova-core/dist/bean/resource/error/errorGlobal.d.ts`

The conflicting fields were:

- `Error.code`
- `Error.status`

The critical point is not package precedence. The issue is that both packages augment the same global interface inside one TS program.

## Current fix boundary

The current repository rule is:

- keep the `zova-rest-* -> zova -> zova-module-*` type chain intact for backend consumers
- remove only the specific installed `zova-core` global `Error` augmentation from the Vona workspace

That boundary is implemented as a pnpm patch in the Vona workspace.

## Current implementation

Vona keeps a workspace-level patch registration in:

- `vona/pnpm-workspace.yaml`

The patch file currently lives at:

- `vona/patches/zova-core@5.1.61.patch`

The patch rewrites the installed declaration file:

- `zova-core/dist/bean/resource/error/errorGlobal.d.ts`

from a global `Error` augmentation to a no-op module:

```ts
export {};
```

This keeps the rest of the `zova-core` and `zova-module-*` declaration graph available while removing the one known global collision.

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
- narrowly targeted at one installed declaration file
- preserving the existing fullstack type-flow instead of replacing it with a facade

It should not be treated as proof that broad manual patching of generated or installed types is the normal workflow.

### 2. Version bumps require patch review

The patch key is version-specific.

If `zova-core` changes version:

1. inspect the installed declaration graph again
2. confirm whether `dist/bean/resource/error/errorGlobal.d.ts` still exists and still contributes the same global augmentation
3. regenerate or update the patch file for the new version
4. rerun Vona typecheck

Do not assume a version bump preserves the same patch target path.

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
pnpm patch-commit <edit-dir>
pnpm install
pnpm exec tsc -p tsconfig.json --noEmit
```

After regenerating the patch:

- confirm `vona/pnpm-workspace.yaml` still points at the correct patch file
- confirm `vona/pnpm-lock.yaml` records the patched dependency
- confirm Vona typecheck still passes

## Verification rule

After any patch addition or update, run at least:

```bash
cd vona && pnpm exec tsc -p tsconfig.json --noEmit
```

If the patch was added while debugging `.zova-rest` consumption drift, also confirm the relevant generated package still resolves from Vona as expected.

## Related guidance

- `.docs-internal/architecture/backend-resource-field-workflow.md`
- `.docs-internal/architecture/ssr-vona-zova-boundary-and-call-chain.md`
- `cabloy-docs/fullstack/contract-loop-playbook.md`
