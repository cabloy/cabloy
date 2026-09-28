# Verification Checklist

Use this reference with `cabloy-resource-field-update` to choose the right verification path for an existing resource field change.

## 1. If persistence changed

This means the task changed storage shape, such as:

- a new persisted field
- a schema migration path
- `meta.version.ts`
- module `fileVersion`

Run:

```bash
npm run test
```

Reason:

- the test database should be reinitialized so schema/version mismatches surface early

## 2. If the change is narrower

Start with the narrowest meaningful checks first.

Typical sequence:

```bash
cd vona && npm run tsc
cd vona && npm test -- <resource-test>.test.ts
```

Use this for:

- validation-only refinement
- locale updates for a field
- renderer metadata changes on an existing persisted field

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
