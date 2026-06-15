# Field Update Decision Tree

Use this reference with `cabloy-resource-field-update` when a request is about an existing backend resource field.

## 1. Is this an existing-resource update?

Use the skill when the task is about:

- adding a field to an existing resource
- refining validation for an existing field
- adding enum-like constraints
- changing `ZovaRender.field(...)` or `ZovaRender.cell(...)`
- deciding whether an existing resource field change needs a `fileVersion` bump

Do not use it when the request is really about:

- creating a new CRUD/resource thread
- generic frontend page/component scaffolding
- stale contract diagnosis

## 2. Persisted field or metadata-only change?

### Persisted field

Examples:

- add `level: number`
- add `status: string`
- add a stored relation key

Actions:

- ask whether `vonaModule.fileVersion` should be incremented
- inspect `meta.version.ts`
- inspect module `package.json`
- plan fresh install and upgrade behavior

### Metadata-only change

Examples:

- add enum validation to an existing field
- add `ZovaRender.field(...)`
- add `ZovaRender.cell(...)`
- refine locale labels
- tighten validation without changing storage

Actions:

- usually keep `fileVersion` unchanged
- focus on entity metadata, locale, tests, and optional renderer follow-up

## 3. What is the source of truth?

Check these surfaces first:

- entity
- model
- DTOs
- controller
- service
- `meta.version.ts`
- module `package.json`
- locale files
- tests

Prefer:

- entity-first field definition
- inferred DTO flow if the source already uses `$Dto.create(...)`, `$Dto.update(...)`, or `$Dto.get(...)`

## 4. Renderer branch

### Shared renderer reuse

Default to shared reuse first, especially for enum-like fields.

Typical select-style pair:

- `basic-select:formFieldSelect`
- `basic-select:select`

### Custom renderer demo

Use only when the task explicitly wants to demonstrate the full custom-renderer workflow.

Required pieces:

- module-local FormField component
- module-local `@TableCell(...)` bean
- metadata regeneration
- frontend build
- `deps:vona`
- Vona typecheck and targeted backend test

Important:

- a plain component alone is not enough for backend `ZovaRender.cell(...)`
- backend table-cell rendering should point to a registered table-cell key backed by `@TableCell(...)`

## 5. Must-close follow-up layers

- locale labels
- invalid-value test for constrained enum-like fields
- migration safety if persistence changed
- narrow verification first, then broader checks if needed

## 6. Migration warning

If you add a new persisted field in a version-bump workflow:

- do not add the same new column in both an older create path and a new migration branch
- fresh install may run version branches sequentially
- duplicate introduction paths can cause duplicate-column failures
