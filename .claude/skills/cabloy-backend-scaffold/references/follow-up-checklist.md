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

## Persistence follow-up

- migration/version changes
- `meta.version`
- field indexes
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
