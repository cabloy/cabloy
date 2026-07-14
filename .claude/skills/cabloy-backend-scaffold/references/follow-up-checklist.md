# Follow-up Checklist

After generating or extending a backend thread, check which follow-up layers apply.

## Structural follow-up

- controller path and action shape
- service ownership of business logic
- model/entity pairing
- DTO design

## Contract follow-up

- validation rules
- OpenAPI metadata
- inferred DTO opportunities
- frontend contract impact
- `@Api.field(...)` / `$makeSchema(...)` ordering: framework guards now preserve previously attached OpenAPI metadata across schema rebuilds, but structure-shaping schemaLike is still order-sensitive
- when an explicit zod/custom schema or other structure-defining schemaLike is present, put that structure-defining schemaLike last because `makeSchemaLikes(...)` applies arguments right-to-left and later structure changes can otherwise alter or replace the intended schema
- treat `v.object(...)`, `v.array(...)`, `v.optional()`, `v.nullable()`, `v.default(...)`, and preprocess/transform wrappers as structure-shaping rather than metadata-only
- after touching structure-shaping schemaLike, verify the emitted schema/OpenAPI result explicitly

## Persistence follow-up

- migration/version changes
- `meta.version`
- field indexes; in shared-database multitenancy, preserve ordinary lookup indexes and enforce business uniqueness in tenant-aware business logic rather than with `table.unique(...)`
- relations
- datasource choice
- cache behavior
- transaction behavior

## Verification follow-up

- unit tests
- `db:reset` or migration verification
- `npm run test`
- `npm run tsc`
- `npm run build`

## Escalation rule

If the request clearly affects frontend SDK, schema, or page logic too, hand off mentally to a fullstack workflow instead of pretending it is backend-only.
