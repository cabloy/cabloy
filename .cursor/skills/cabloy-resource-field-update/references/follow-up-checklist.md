# Follow-up Checklist

After updating or refining a field on an existing backend resource, check which follow-up layers apply.

## Classification follow-up

- is this a new persisted field or a metadata-only refinement?
- does the task require a `fileVersion` decision before persistence edits?
- is the request purely backend-first, or does it explicitly branch into renderer-aware frontend follow-up?

## Backend thread follow-up

- entity field definition
- model/entity alignment
- inferred DTO flow vs manual DTO edits
- controller/service still match the resource contract
- locale updates for visible field text

## Persistence follow-up

Apply when storage shape changes:

- `meta.version.ts`
- module `package.json` `fileVersion`
- fresh install vs upgrade behavior
- duplicate-column risk across historical and new migration branches

## Validation and contract follow-up

- required vs optional behavior
- explicit enum-like allowed-value schema when needed
- `ZovaRender.order(...)`
- `ZovaRender.field(...)`
- `ZovaRender.cell(...)`
- invalid-value test coverage

## Renderer follow-up

### Shared renderer path

- confirm an existing shared renderer already fits
- keep option shapes aligned with the shared renderer baseline
- avoid custom frontend code when reuse is sufficient

### Custom renderer demo path

Apply when the user explicitly wants to demonstrate custom renderer development:

- module-local FormField component exists
- module-local `@TableCell(...)` bean exists
- backend `ZovaRender.cell(...)` points to the registered table-cell key, not just a plain component
- metadata regeneration is included
- frontend build is included
- `deps:vona` is included

## Verification follow-up

### Backend checks

- relevant typecheck, such as `cd vona && npm run tsc`
- focused managed tests, such as `npm run test -- 'src/module/<module-name>/test/**/*.ts'` from the repository root; resolve the actual path for suite-owned modules
- if persistence, initialization, or seed behavior changed, cover that behavior in the managed run; focused tests still prepare a fresh isolated test database, so a `meta.version.ts` edit alone does not require the full suite
- expand coverage according to actual impact, including upgrade behavior when applicable

### Development-database follow-up

- isolated tests do not update development data
- normal startup applies pending migrations to existing prepared databases
- an already-applied positive-numbered migration branch does not replay on startup; recreating disposable dev data requires separate explicit reset approval, even after a no-bump decision
- use a new incremental migration when existing data must be preserved
- see [Migration and Changes](../../../../repo-docs/backend/migration-and-changes.md#local-development-workflow) for lifecycle and reset safety

### If custom frontend renderers were introduced

- `npm run zova :tools:metadata <module-name>`
- run the relevant Zova build first:
  - `npm run build:zova:admin` for Admin-facing render/action/metadata changes
  - also `npm run build:zova:web` when the Web flavor is affected
- `npm run deps:vona`
- `cd vona && npm run tsc`
- `cd vona && npm test -- <resource-test>.test.ts`

## Common recovery rule

If the generated `.zova-rest` artifacts already contain the new renderer keys but Vona still sees stale types after the normal sync flow:

- treat it as local dependency drift
- rebuild `vona/node_modules` and reinstall dependencies if normal `deps:vona` sync did not recover the local file-package installation state
