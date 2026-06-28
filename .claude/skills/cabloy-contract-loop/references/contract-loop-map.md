# Contract Loop Map

Use this reference when a task crosses the backend/frontend contract boundary.

This map is symmetric across Cabloy Basic and Cabloy Start. Detect the active edition to choose commands and output paths, but keep the same four-way diagnosis model:

- forward chain
- reverse chain
- consumer drift
- local dependency drift

## Typical triggers

### Forward chain

Common examples:

- DTO shape changed
- controller request/response changed
- validation changed
- `@Api.field` or OpenAPI metadata changed
- inferred DTO output changed

Likely next step:

- verify backend OpenAPI output
- regenerate the frontend consumer path

### Reverse chain

Common examples:

- backend metadata now references a new frontend table cell or form field
- routes, components, or icons changed and backend-side tooling depends on them
- frontend-generated metadata needs to be consumed back into Vona

Likely next step:

- regenerate frontend metadata or build output
- run the correct flavor build for the active edition
- run `deps:vona`

### Consumer drift

Common examples:

- generated SDK no longer matches visible frontend behavior
- schema-driven UI expects old shape
- model or API service types are stale

Likely next step:

- confirm whether source truth or generated output really changed
- regenerate instead of hand-patching when the generated layer is the stale one

### Local dependency drift

Common examples:

- generated artifacts already contain the expected change
- normal sync already ran
- installed local file consumers still behave stale

Likely next step:

- stop editing source files
- repair install state only after proving the earlier stages are healthy

## Module-local OpenAPI generation boundary

When generating a module-local OpenAPI SDK, do not leave the module config effectively unconstrained if the module should only own a narrow resource surface.

Preferred rule:

- set `operations.match` in `openapi.config.ts` so the module generates only the intended API operations

Reason:

- an unconstrained or overly broad generation pass can pull unrelated APIs into the module
- that expands generated SDK files, metadata exports, and downstream type surfaces far beyond the module’s real ownership boundary
- the result may still compile, but it weakens module boundaries and makes maintenance harder

Representative example:

- a module-level OpenAPI config such as `zova/src/module/demo-student/cli/openapi.config.ts`
- narrow the generated surface with a module-specific matcher such as `operations.match: [/^DemoStudent_*/]`

Treat that module path as an example, not as a durable dependency of the rule. The durable rule is to align `operations.match` with the module’s true API ownership boundary.

Practical check after generation:

- confirm the generated API files only contain the intended resource operations
- confirm the module metadata and exports were not polluted by unrelated APIs

## Forward chain artifact map

1. backend contract source
   - controllers
   - DTOs
   - entities
   - validation rules
   - OpenAPI metadata
2. emitted proof surface
   - Swagger/OpenAPI output
3. generated handoff
   - generated SDK
   - schema-aware helpers
   - flavor-built REST output when needed
4. consumer layers
   - frontend API files
   - thin model facades
   - schema-driven UI
   - row and page actions

## Reverse chain artifact map

1. frontend contract source
   - routes
   - components
   - icons
   - custom table cells
   - custom form-field resources
   - module metadata
2. generated handoff
   - metadata output
   - the relevant flavor build output
3. sync surface
   - run the relevant Zova build first
   - `deps:vona`
4. consumer layers
   - backend `ZovaRender.*(...)` references
   - backend tooling and type hints
   - SSR or integration paths that depend on refreshed frontend output

## Drift diagnosis matrix

### Source wrong

- wrong layer was edited
- emitted or generated output is therefore wrong
- fix the contract source first

### Generated output wrong

- source is correct, but generation did not run or ran on the wrong boundary
- regenerate rather than hand-patch consumers

### Consumer stale

- generated output is correct, but the next consumer layer is still reading old expectations
- inspect the consumer path before changing source again

### Install stale

- generated output is correct
- normal sync already ran
- local file dependencies still behave stale
- repair install state only after proving the earlier stages are healthy

## Anti-pattern

Do not patch frontend generated artifacts first when the backend contract is the real source of truth.
