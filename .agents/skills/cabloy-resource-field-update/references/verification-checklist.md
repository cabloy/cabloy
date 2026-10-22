# Verification Checklist

Use this reference with `cabloy-resource-field-update` to choose the right verification path for an existing resource field change.

## 1. If persistence changed

This means the task changed storage shape, such as:

- a new persisted field
- a schema migration path
- `meta.version.ts`
- module `fileVersion`

Verify affected migration, initialization, or seed behavior through the managed isolated test entrypoint. Prefer focused tests that cover the changed resource:

```bash
npm run test -- 'src/module/<module-name>/test/**/*.ts'
```

Resolve the actual test path for suite-owned modules. A focused managed run still recreates its isolated test database and runs migrations, initialization, and seeds; a `meta.version.ts` edit alone does not require the full suite. Expand coverage according to actual impact, including upgrade behavior when applicable; fresh-database preparation alone does not prove an existing-data upgrade.

Development-database updates are a separate decision. Tests do not update dev data. Normal startup applies pending migrations to existing prepared databases, but does not replay an already-applied positive-numbered branch. Recreating disposable dev data requires explicit reset approval; a no-bump decision is not authorization. Use a new incremental migration when data must be preserved. See [Migration and Changes](../../../../repo-docs/backend/migration-and-changes.md#local-development-workflow).

## 2. For all backend field changes

Start with the narrowest meaningful checks, including when persistence changed.

Typical root-level sequence:

```bash
npm run tsc:vona
npm run test -- 'src/module/<module-name>/test/**/*.ts'
```

For validation-only refinements, locale updates, or renderer metadata changes on an existing field, select relevant checks without inventing a migration requirement.

## 3. If custom frontend renderers were introduced

Run the synchronization chain in order:

1. regenerate frontend metadata
2. build the relevant frontend SSR/rest target
3. run `deps:vona`
4. run Vona typecheck
5. run the narrow backend resource test

Representative Cabloy Basic admin flow:

```bash
npm run zova :tools:metadata <module-name>
npm run build:zova:admin
npm run deps:vona
cd vona && npm run tsc
cd vona && npm test -- <resource-test>.test.ts
```

If the same handoff must also be available to Web, also run:

```bash
npm run build:zova:web
npm run deps:vona
```

Do not treat `build:rest:*` alone as sufficient, because the SSR bundle and rest output must move together.

## 4. What to verify in the result

### Backend contract

Confirm:

- field create/update/view/select behavior still works
- invalid enum-like values are rejected when applicable
- inferred DTO surfaces still line up with the entity/model chain

### Renderer integration

Confirm:

- generated metadata contains the new component or table-cell registrations
- generated `.zova-rest` or related type surfaces contain the new renderer keys
- backend `ZovaRender.field(...)` / `ZovaRender.cell(...)` references pass typecheck

## 5. Common recovery rule for stale local file dependencies

If all of these are true:

- the generated `.zova-rest` artifacts already contain the new renderer keys
- `npm run deps:vona` was run after the relevant Zova build
- Vona still sees stale renderer types

Then treat it as local dependency drift and suspect a stale or unhealthy local installation state in `vona/node_modules`.

Recovery action:

```bash
cd vona && rm -rf node_modules && pnpm install
```

Use this as a recovery path when the normal sync steps did not restore the local file-package installation state cleanly.
